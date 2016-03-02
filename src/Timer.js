var TIMER_INTERVAL_MILLIS = 10; // TODO: Tune this value

function Timer(el) {
  if (window === this) {
    return new Timer(el);
  }

  this.$el = $(el);
  this.pausedTime = 0;
  this.state = 'stop';

  return this;
}

Timer.prototype.start = function() {
  if (this.state === 'start') {
    return;
  }

  this.startTime = this.startTime || (new Date()).getTime();
  this.pausedTime += this.timeOfPause ? (new Date()).getTime() - this.timeOfPause : 0;

  this.intervalId = setInterval(this.tick.bind(this), TIMER_INTERVAL_MILLIS);
  this.state = 'start';

  return this;
}

Timer.prototype.pause = function() {
  if (this.state === 'pause') {
    return;
  }

  clearInterval(this.intervalId);
  this.intervalId = null;
  this.timeOfPause = (new Date()).getTime();
  this.state = 'pause';

  return this;
}

Timer.prototype.stop = function() {
  clearInterval(this.intervalId);
  this.intervalId = null;
  this.startTime = null;
  this.timeOfPause = null;
  this.pausedTime = 0;
  this.state = 'stop';

  return this;
}

Timer.prototype.tick = function() {
  if (this.startTime) {
    var tickEvent = new jQuery.Event('tick');
    tickEvent.timeMillis = this.now();
    this.$el.trigger(tickEvent);
  }

  return this;
}

Timer.prototype.now = function() {
  if (this.state === 'stop') {
    return 0;
  } else if (this.state === 'pause') {
    return this.timeOfPause - this.startTime - this.pausedTime;
  }

  // Else started or unexpected case
  return (new Date()).getTime() - this.startTime - this.pausedTime;
}
