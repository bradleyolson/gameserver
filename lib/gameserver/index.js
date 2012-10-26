var utility = require('./utility');

var Games = {
  data: {},

  startup: function(options) {
    this.data = {
      minimum: 0,
      maximum: 10000,
      allow_new: true,
      per_game: 4
    };

    utility.overwrite( this.data, options );

    this.games = {};
  },

  create: function( id ) {
    if( !this.data.allow_new ) {
      return "No new games may be created.";
    }

    var game_id = this.unused( id )
      , game = this.games[ game_id ];

    game = {
      status: 'lobby',
      players: {},
      viewers: {}
    };

    return game;
  }

  unused: function( id ) {
    id = parseInt( id, 10 );
    if( id < this.data.minimum || id > this.data.maximum || !id ) {
      id = Math.floor( Math.random() * this.data.maximum );
    }

    if( !this.allowed() ) {
      return;
    }

    if( this.games[game_id] !== null ) {
      return this.unused();
    }

    return game_id;
  },

  allowed: function() {
    if( Object.keys( this.games ).length === this.maximum - (this.maximum / 10) && !!this.data.allow_new ) {
      return this.data.allow_new = false;
    }

    return this.data.allow_new = true;
  }
};

Games = (function() {
  function Games() {
    this.minimum = 0;
    this.maximum = 10000;
    this.games = {};
    this.new_allowed = true;
  }

  Games.prototype.create = function(id) {
    if (this.new_allowed === false) {
      return 'No new games may be created';
    }

    var game_id = this.unused(id);

    this.games[game_id] = {
      status: 'lobby',
      // name: { occupied: boolean, icon: 'url', identifier: int, ip: 'str' }
      players: {},
      lobby: [] // for those who are allowed to talk in server.
    };
    return game_id;
  };

  Games.prototype.unused = function(id) {
    // make sure requested game is within minimum and maximum.
    if(this.minimum > id || this.maximum < id) {
      id = undefined;
    }

    var game_id = id || Math.floor(Math.random() * this.maximum);

    // 10% leeway of game creation only 90% of potential ports may be used.
    if (Object.keys(this.games).length === this.maximum - (this.maximum / 10)) {
      this.new_allowed = false;
    }

    // request new game if selected game id is already taken.
    if (this.games[game_id] != null) {
      return this.unused();
    }
    return game_id;
  };

  Games.prototype.add_lobby = function(game_id, ip, id, name) {
    if (this.games[game_id].lobby[name] != null) {
      console.log('User exists.');
      return false;
    }

    this.games[game_id].lobby[name] = { ip: ip, id: id, name: name };

    return this.games[game_id].lobby[name];
  }

  Games.prototype.add_player = function(game_id, slot, name) {
    var req_slot = this.games[game_id].players['slot_' + slot];

    if (this.games[game_id] == null || req_slot == null || req_slot.occupied) {
      console.log('Issue found when joining game.');
      return false;
    }

    req_slot.occupied = true;
    req_slot.name = name;
    return req_slot;
  }

  Games.prototype.in_lobby = function(game_id, client_id) {
    if(!this.games[game_id]) {
      return false;
    }

    var key, exists = false;
    for (key in this.games[game_id].lobby) {
      if(this.games[game_id].lobby[key].id === client_id) {
        exists = key;
      }
    }
    
    return exists;
  }

  Games.prototype.purge_lobby = function(game_id, name) {
    if(!this.games[game_id] || !this.games[game_id].lobby[name]) {
      return false;
    }

    delete this.games[game_id].lobby[name];
  };

  Games.prototype.count = function(obj) {
    if( typeof obj !== "object" ) {
      obj = this.games || {};
    }

    var count = 0;

    for(item in obj) {
      count++;
    }

    return count;
  };

  return Games;
})();

module.exports = Games;
