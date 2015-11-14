function InputController(canvasController, square) {
  if (window === this) {
    return new InputController(canvasController, square);
  }

  this.canvasController = canvasController;
  this.square = square;

  var _this = this;

  function mousedown(event, manualEvent) {
    if (manualEvent) {
      event = manualEvent;
    }

    _this.beginDrag(event);
  }

  function mousemove(event, manualEvent) {
    if (manualEvent) {
      event = manualEvent;
    }

    _this.midDrag(event);
    _this.redraw(event.pageX, event.pageY);
  }

  function mouseup() {
    _this.endDrag();
  }

  function mouseout() {
    _this.drawBlank();
  }

  $(window).on('mousedown', mousedown);
  $(window).on('mousemove', mousemove);
  $(window).on('mouseup', mouseup);
  $(window).on('mouseout', mouseout);

  // Mobile events
  $(window).on('touchstart', function(touchEvent) {
    mousedown(touchEvent.touches[0]);
  });

  $(window).on('touchmove', function(touchEvent) {
    mousemove(touchEvent.touches[0]);
  });

  $(window).on('touchend', function() {
    mouseup();
    mouseout();
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
  }
}

