var DEFAULT_SQUARE_WIDTH = 100;
var DEFAULT_START_X = (window.innerWidth - DEFAULT_SQUARE_WIDTH) / 2;
var DEFAULT_START_Y = (window.innerHeight - DEFAULT_SQUARE_WIDTH) / 2;
var DEFAULT_FILL_COLOR = '#000000';
var DEFAULT_GRADIENT_START_COLOR = '#999999';
var DEFAULT_GRADIENT_END_COLOR = '#ffffff';
var MAX_ELEMENTS = 1000;

function Layer(containerId, scheduler, startX, startY, squareWidth, fillColor, gradientStartColor, gradientEndColor) {
  if (window === this) {
    return new Layer(containerId, scheduler, startX, startY, squareWidth, fillColor, gradientStartColor, gradientEndColor);
  }

  startX = (startX === undefined) ? DEFAULT_START_X : startX;
  startY = (startY === undefined) ? DEFAULT_START_Y : startY;
  this.squareWidth = squareWidth || DEFAULT_SQUARE_WIDTH;
  this.fillColor = fillColor || DEFAULT_FILL_COLOR;
  this.gradientStartColor = gradientStartColor || DEFAULT_GRADIENT_START_COLOR;
  this.gradientEndColor = gradientEndColor || DEFAULT_GRADIENT_END_COLOR;

  this.containerId = containerId;
  this.canvasId = this.getRandomElementId();
  this.createLayerCanvas(this.canvasId);
  this.canvasController = new CanvasController(this.canvasId);
  this.scheduler = scheduler;

  this.square = new Square(this.canvasController,
      startX,
      startY,
      this.squareWidth,
      this.fillColor,
      this.gradientStartColor,
      this.gradientEndColor);

  this.inputController = new InputController(this.canvasController, this.square, this.scheduler);

  var _this = this;
  this.canvasController.redrawFunction = function() {
    _this.inputController.redraw(_this.square.cx, _this.square.cy);
  };

  this.inputController.drawBlank();

  return this;
}

// Generate a random number, retrying if already present. This is a naive
// approach but we should NEVER expect a large number of canvases to be
// generated anyway. That's not the goal of this project.
Layer.prototype.getRandomElementId = function() {
  var id = 'canvas-' + Math.floor(Math.random() * MAX_ELEMENTS);

  if ($('#' + id).length) {
    return getRandomElementId();
  }

  return id;
}

Layer.prototype.createLayerCanvas = function(canvasId) {
  $('#' + this.containerId).append(
    '<canvas id="' + canvasId + '"></canvas>'
  );
}

Layer.prototype.removeLayerCanvas = function() {
  $('#' + this.canvasId).remove();
}
