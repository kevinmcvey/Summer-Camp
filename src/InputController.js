const EVENT_MOUSEDOWN = 0;
const EVENT_MOUSEUP = 1;
const EVENT_MOUSEMOVE = 2;
const EVENT_EXIT = 3;

function InputController(canvasController, square) {
  if (window === this) {
    return new InputController(canvasController, square);
  }

  this.canvasController = canvasController;
  this.square = square;
  this.eventLog = [];
  this.startTime = (new Date()).getTime();

  var _this = this;

  function mousedown(event, manualEvent) {
    if (manualEvent) {
      event = manualEvent;
    }

    _this.beginDrag(event);

    if (!event.silent) {
      _this.logEvent(EVENT_MOUSEDOWN, event);
    }
  }

  function mousemove(event, manualEvent) {
    if (manualEvent) {
      event = manualEvent;
    }

    _this.midDrag(event);
    _this.redraw(event.pageX, event.pageY);

    if (!event.silent) {
      _this.logEvent(EVENT_MOUSEMOVE, event);
    }
  }

  function mouseup(event, manualEvent) {
    if (manualEvent) {
      event = manualEvent;
    }

    _this.endDrag();

    if (!event.silent) {
      _this.logEvent(EVENT_MOUSEUP);
    }
  }

  function mouseout(event, manualEvent) {
    if (manualEvent) {
      event = manualEvent;
    }

    _this.drawBlank();

    if (!event.silent) {
      _this.logEvent(EVENT_EXIT);
    }
  }

  $(this.canvasController.canvas).on('mousedown', mousedown);
  $(this.canvasController.canvas).on('mousemove', mousemove);
  $(this.canvasController.canvas).on('mouseup', mouseup);
  $(this.canvasController.canvas).on('mouseout', mouseout);

  // Mobile events
  $(this.canvasController.canvas).on('touchstart', function(touchEvent) {
    mousedown(touchEvent.originalEvent.touches[0]);
  });

  $(this.canvasController.canvas).on('touchmove', function(touchEvent) {
    mousemove(touchEvent.originalEvent.touches[0]);
  });

  $(this.canvasController.canvas).on('touchend', function(touchEvent) {
    mouseup({});
    mouseout({});
  });

  return this;
}

InputController.prototype = {
  canvasController: undefined,
  square: undefined,

  redraw: function(mouseX, mouseY) {
    this.canvasController.reset();
    this.square.drawShadow(mouseX, mouseY);
    this.square.drawSelf();
  },

  beginDrag: function(event) {
    if (!this.square.isWithinSquare(event.pageX, event.pageY)) {
      return;
    }

    this.square.beginDrag(event.pageX, event.pageY);
  },

  midDrag: function(event) {
    if (!this.square.dragging) {
      return;
    }

    this.square.midDrag(event.pageX, event.pageY);
    this.redraw(event.pageX, event.pageY);
  },


  endDrag: function(event) {
    this.square.endDrag();
  },

  drawBlank: function() {
    this.canvasController.reset();
    this.square.drawSelf();
  },

  logEvent: function(eventId, event) {
    var currentTime = (new Date()).getTime();
    var executionTime = currentTime - this.startTime;

    var log = [eventId, executionTime];

    if (event) {
      log.push(event.pageX);
      log.push(event.pageY);
    }

    this.eventLog.push(log);
  },

  // TODO: Interpolation between events
  replayLogs: function(eventLog) {
    var _this = this;
    eventLog.forEach(function(event) {

      (function createTimeout(_this, event) {
        var eventTime = event[1];

        setTimeout(function() {
          var eventId = event[0];
          var eventX = event[2];
          var eventY = event[3];

          switch(eventId) {
            case EVENT_MOUSEDOWN:
              $(_this.canvasController.canvas).trigger('mousedown', { pageX: eventX, pageY: eventY, silent: true });
              break;
            case EVENT_MOUSEUP:
              $(_this.canvasController.canvas).trigger('mouseup', { silent: true });
              break;
            case EVENT_MOUSEMOVE:
              $(_this.canvasController.canvas).trigger('mousemove', { pageX: eventX, pageY: eventY, silent: true });
              break;
            case EVENT_EXIT:
              $(_this.canvasController.canvas).trigger('mouseout', { silent: true });
              break;
          }
        }, eventTime);
      })(_this, event);

    });
  }
}

