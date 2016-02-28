function Scheduler(el) {
  if (!(this instanceof Scheduler)) {
    return new Scheduler(el);
  }

  this.$el = $(el) || $(window);
  this.events = [];
  this.timer = new Timer(this.$el).start();
  this.safe = true;

  this.$el.on('tick', this.onTick.bind(this));

  return this;
}

Scheduler.prototype.onTick = function() {
  this.safe = false;

  this.events.map(function triggerScheduledEvents(event, eventId) {
    if (!event) {
      return null;
    }

    var now = this.timer.now();
    if (now >= event.requestedAt + event.triggerOn) {
      event.executable();
      event.requestedAt = now;
      return event.recurring ? event : null;
    }
  }.bind(this));

  this.safe = true;
  this.$el.trigger('safe');
}

// TODO: Might need to add safety to this as well? Not sure.
Scheduler.prototype.schedule = function(millis, eventFunction) {
  return this.addEvent(millis, eventFunction, true);
}

Scheduler.prototype.scheduleOnce = function(millis, eventFunction) {
  return this.addEvent(millis, eventFunction, false);
}

Scheduler.prototype.addEvent = function(millis, eventFunction, recurring) {
  return this.events.push({
    requestedAt: this.timer.now(),
    triggerOn: millis,
    executable: eventFunction,
    recurring: recurring
  });
}

Scheduler.prototype.unschedule = function(eventId) {
  if (!this.safe) {
    return this.$el.once('safe', function() {
      this.removeEvent(eventId);
    });
  }

  this.removeEvent(eventId);
}

Scheduler.prototype.removeEvent = function(eventId) {
  this.events[eventId] = null;
}
