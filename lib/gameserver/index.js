var utility = require('./utility');

var Games = {
  data: {},

  startup: function(options) {
    this.data = {
      minimum: 0,
      maximum: 50,
      allow_new: true,
      per_game: 4,
      threshold: 0.9
    };

    utility.overwrite( this.data, options );

    this.games = {};
  },

  create: function( id ) {
    if( !this.data.allow_new ) {
      return "No new games may be created.";
    }

    if( this.count( this.games ) > this.threshold() ) {
      this.data.allow_new = false;
      return;
    }

    var game_id = this.unused( id )
      , game = this.games[ game_id ] = {};

    game = {
      id: game_id,
      status: 'lobby',
      players: {},
      viewers: {}
    };

    return game;
  },

  unused: function( id ) {
    id = parseInt( id, 10 );

    if( id < this.data.minimum || id > this.data.maximum || !id ) {
      id = Math.floor( parseInt(Math.random() * this.data.maximum, 10) );
    }

    if( !this.allowed() ) {
      return;
    }

    if( typeof this.games[id] !== "undefined" ) {
      return this.unused();
    }

    return id;
  },

  threshold: function() {
    return this.data.maximum * this.data.threshold;
  },

  allowed: function() {
    if( Object.keys( this.games ).length === this.maximum - (this.maximum / 10) && !!this.data.allow_new ) {
      return this.data.allow_new = false;
    }

    return this.data.allow_new = true;
  },

  add: function( game, to, player ) {
    // takes parameter 'to' as either game.players, or game.viewers

    if( !this.games[ game ] || !this.games[ game ][ to ] ) {
      return "Either the game does not exist or an incorrect directive was given.";
    }

    // if they become a player then remove them from the viewers.
    if( to === 'players' ) {
      this.games[ game ][ 'viewers' ].delete([ player.username ]);
    }

    this.games[ game ][ to ][ player.username ] = player;

    return player;
  },

  count: function( obj ) {
    if( typeof obj !== "object" ) {
      obj = this.games || {};
    }

    var count = 0
      , item;

    for( item in obj ) {
      if( obj.hasOwnProperty( item ) ) {
        count++;
      }
    }

    return count;
  }
};

module.exports = Games;
