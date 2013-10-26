(function(){
    function createWorld(){
        return new Box2D.Dynamics.b2World(
            new Box2D.Common.Math.b2Vec2(0, 10),
            true)
    };
    // property = hight, wight, x, y, name, hp
    function createBody(world, property){
        var body,
            body_fix_def,
            body_def;
        body_fix_def = new Box2D.Dynamics.b2FixtureDef();
        body_fix_def.share = new Box2D.b2Collision.share.b2PolygonShape();
        body_fix_def.share.SetAsBox(property.wight/2, property.hight/2);

        body_fix_def.density = 1.0;
        body_fix_def.friction = 1;
        body_fix_def.restitution = 0.2;

        body_def = new Box2D.Dynamics.b2BodyDef();
        body_def.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        body_def.position.set(property.x, property.y);

        body_def.SetMassData(2.0); // масса тела в кг
        body_def.center.SetZero(); // центр массы в локальных координатах тела
        body_def.I = 3.0; // момет инерции в кг*м^2

        if (property.name == "bullet")
          body_def.isBullet = true;

        //body = world.createBody(body_def);
        body.CreateFixture(body_fix_def);

        // устанавливаем hp и name
        body.setUserData(property.name, property.hp);
        body.SetAngularVelocity(10);
        return body;
        //world.createBody();
    };

    function createGround(world){
        var body,
            body_fix_def,
            body_def;

        body_def = new Box2D.b2BodyDef();
        body_def.type = Box2D.b2Body.b2_staticBody;
        body_def.position.set(0, -5);

        body =


        return body;
    };


    var cb = null;
    var world = null;
    var groundBody = null;
    var archer1_body = null;
    var archer2_body = null;
    var bullet = undefined;

    var contactListener = function(){}

    // обрабатываем столкновения
    contactListener.prototype.PostSolve = function(contact, impulse){
        //hit
        var cbData = {};
        cbData.name = contact.GetBody.userData.name;
        if (contact.GetBodyB.userData.name == "archer1")
        {
            archer1_body.userData.hp--;
            cbData.hp = archer1_body.userData.hp;
        }
        if (contact.GetBodyB.userData.name == "archer2")
        {
            archer2_body.userData.hp--;
            cbData.hp = archer2_body.userData.hp;
        }
        bullet = undefined;
        cb(cbData);
    }

    window.pWorld = {

    step : function (){
        contactListener.prototype = Box2D.Dynamics.b2ContactListener;
        var timeStep = 1/60;
        var iterations = 10;
        world.Step(timeStep, iterations);
    },

    setArcherPos : function (name, pos){
        if (name == "archer1")
            archer1_body.setUserData(name, archer1_body.userData.hp);
        if (name == "archer2")
            archer2_body.setUserData(name, archer2_body.userData.hp);
    },

    createArcher : function (name){
        var property = {};
        // property = hight, wight, x, y, name, hp
        property.name = name;
        property.hp = 3;
        property.hight = 2;
        property.wight = 2;
        if (name == "archer1")
        {
            property.x = 1;
            property.y = 1;
            archer1_body = createBody(world, property);
        }
        if (name == "archer2")
        {
            property.x = 9;
            property.y = 1;
            archer1_body = createBody(world, property);
        }
    },

    initWorld : function (data){
        cb = data.onHit;
        world = createWorld();
        //earthBody
        createGround(word);
        ///groundBodyDef; groundBodyDef.position.Set(0.0f, -10.0f);
        //groundBodyDef; groundBodyDef.position.Set(0.0f, -10.0f);
        world.createArcher("archer1");
        world.createArcher("archer2");
    },

    getHit : function (name)
    {
        if (name == "archer1")
            return archer1_body.userData.hp;
        if (name == "archer2")
            return archer2_body.userData.hp;
    },

    // return pos archer
    getArcherPos : function (name){
        var pos = {};
        if (name == "archer1")
        {
            pos.x = archer1_body.position.x;
            pos.y = archer1_body.position.y;
        }
        if (name == "archer2")
        {
            pos.x = archer2_body.position.x;
            pos.y = archer2_body.position.y;
        }
        return pos;
    },

     createBullet : function(name, vector, cb){
        var property = {};
        property.x = world.getArcherPos(name).x;
        property.y = world.getArcherPos(name).y+1; // против столкновения
        property.hight = 1;
        property.wight = 1;
        property.name = "bullet";
        bullet = createBody(world, property);
        // применить импульс
        bullet.ApplyImpulse(new Box2D.Common.Math.b2Vec2(vector.x, vector.y), bullet.center.mass);
    },

    bulletExist : function (){
        if (bullet == undefined)
            return false;
        return true;
    }


    };

}());