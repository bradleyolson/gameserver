var Utility = {
  overwrite: function(overwritten) {
    return (function() {
      if( arguments.length > 1 ) {
        for( objects in arguments ) {
          overwrite( this, arguments[objects] );
        }
      }

      for( var key in arguments[0] ) {
        if( arguments[0].hasOwnProperty(key) ) {
          this[key] = arguments[0][key];
        }
      }

      return this;
    }).apply(overwritten, Array.prototype.slice.call(arguments, 1));
  }
}

module.exports = Utility;
