console.log('bounce');
var Debounce = {
  timeout: undefined,
  bounce: function(callback, time) {
    return function() {
      clearTimeout(this.timeout);
      var args = [].slice.apply(arguments);
      this.timeout = setTimeout(function() {
        callback.apply(this, args);
      }.bind(this), time);
    };
  }
};

module.exports = Debounce;
