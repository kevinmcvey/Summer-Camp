function Scheduler(el) {
  if (!(this instanceof Scheduler)) {
    return new Scheduler(el);
  }

  this.$el = $(el) || $(window);
  this.events = [];
  this.timer = new Timer(this.$el).start();
  this.safe = true;

  this.$el.on('tick', this.onTick.bind(this));
  this.$el.on('blur focus', this.handleFocusChange.bind(this));

  return this;
}

Scheduler.prototype.handleFocusChange = function(event) {
  var eventType = event.type;

  // Only trigger timer events on state change. Sometimes these double-trigger
  if (this.$el.data('prevFocusEvent') === eventType) {
    return;
  }

  this.$el.data({
    prevFocusEvent: eventType
  });

  if (eventType === 'focus') {
    this.timer.start();
  } else if (eventType === 'blur') {
    this.timer.pause();
  }
}

Scheduler.prototype.onTick = function() {
  this.safe = false;

  // TODO: Do something more efficient then store `null` for removed events. This O(n) gets scary
  this.events.forEach(function triggerScheduledEvents(event, eventId) {
    if (!event) {
      return;
    }

    var now = this.timer.now();
    if (now >= event.requestedAt + event.triggerOn) {
      event.executable();
      event.requestedAt = now;
      if (!event.recurring) {
        this.events[eventId] = null;
      }
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
