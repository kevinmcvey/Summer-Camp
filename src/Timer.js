var TIMER_INTERVAL_MILLIS = 100;

function Timer(el) {
  if (window === this) {
    return new Timer(el);
  }

  this.$el = $(el);
  this.pausedTime = 0;

  return this;
}

Timer.prototype.start = function() {
  this.startTime = this.startTime || (new Date()).getTime();
  this.pausedTime += this.timeOfPause ? (new Date()).getTime() - this.timeOfPause : 0;

  this.intervalId = setInterval(this.tick.bind(this), TIMER_INTERVAL_MILLIS);

  return this;
}

Timer.prototype.pause = function() {
  clearInterval(this.intervalId);
  this.intervalId = null;
  this.timeOfPause = (new Date()).getTime();
  this.$el.trigger('pause');

  return this;
}

Timer.prototype.stop = function() {
  clearInterval(this.intervalId);
  this.intervalId = null;
  this.startTime = null;
  this.timeOfPause = null;
  this.pausedTime = 0;
  this.$el.trigger('stop');

  return this;
}

Timer.prototype.tick = function(parameters) {
  if (this.startTime) {
    var tickEvent = new jQuery.Event('tick');
    tickEvent.timeMillis = (new Date()).getTime() - this.startTime - this.pausedTime;
    this.$el.trigger(tickEvent);
  }

  return this;
}
