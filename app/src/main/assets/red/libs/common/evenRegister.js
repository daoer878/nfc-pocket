define(function() {
  return eventRegister = {
    addListener: function( selector, event_type, callback) {
      $(document).on(event_type, selector, function(e){
        callback(e);
      });
    },

    removeListener: function(selector, event_type) {
      $(document).off(event_type, selector);
    }
  }
});
