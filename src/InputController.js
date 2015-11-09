function InputController(canvasController, square) {
  if (window === this) {
    return new InputController(canvasController, square);
  }

  this.canvasController = canvasController;
  this.square = square;

  var _this = this;

  function mousedown(event) {
    _this.beginDrag(event);
  }

  function mousemove(event) {
    _this.midDrag(event);
    _this.redraw(event.pageX, event.pageY);
  }

  function mouseup() {
    _this.endDrag();
  }

  function mouseout() {
    _this.drawBlank();
  }

  window.addEventListener('mousedown', mousedown, false);
  window.addEventListener('mousemove', mousemove, false);
  window.addEventListener('mouseup', mouseup, false);
  window.addEventListener('mouseout', mouseout, false);

  // Mobile events
  window.addEventListener('touchstart', function(touchEvent) {
    mousedown(touchEvent.touches[0]);
  }, false);

  window.addEventListener('touchmove', function(touchEvent) {
    mousemove(touchEvent.touches[0]);
  }, false);

  window.addEventListener('touchend', function() {
    mouseup();
    mouseout();
  }, false);

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

