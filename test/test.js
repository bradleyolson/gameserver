var assert = require("assert");

function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

describe('Games', function() {
  var gameserver = require('../lib/gameserver/index.js');

  before(function() {
    gameserver.startup({});
  });

  describe('#create()', function() {
    it('should create several games', function( done ) {
      var base = gameserver.create(),
        compare = gameserver.create( base.id );

      ok( base.id !== compare.id, "When creating multiple games and assigning a repeated id, a new id is not being set" );
      ok( typeof base === "object" );
      ok( typeof compare === "object" );

      if( base.id !== compare.id ) {
        return done();
      }
    });
  });

  describe('allowed', function() {
    it('should turn gameserver.data.allow_new to false', function( done ) {
      for( var j = 0; j < gameserver.data.maximum; j++ ) {
        gameserver.create( j );
      }

      ok( gameserver.data.allow_new === false, "The threshold is never being hit, causing too many games to be created." )

      if( gameserver.data.allow_new === false ) {
        done();
      }
    });
  });
});

/*
describe('Connection', function() {
  var Db = require('../access-db')
    , db = new Db.startup( Db.data.connection() + "/catanode-users-test" );

  before(function() {
    // clear db.
    Db.User.remove({}, function(err) { 
       console.log('collection removed') 
    });
  });

  describe("#saveUser()", function() {
    it('should create a new user', function(done) {
      Db.saveUser({
        fname: "b-rad", lname: "olson",
        email: "foo@brad.io",
        username: "bao!",
        password: "wibblez"
      }, function(err, user) {
        if( err ) throw err;
        done();
      });
    });
  });

  describe("#getUsers()", function() {
    it('should return all users, with a length of 1', function(done) {
      Db.getUsers(function(users) {
        if( users.length > 0 ) {
          done();
        }
      });
    });
  });
});

*/
