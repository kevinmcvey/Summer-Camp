var DEFAULT_SQUARE_WIDTH = 100;
var DEFAULT_START_X = (window.innerWidth - DEFAULT_SQUARE_WIDTH) / 2;
var DEFAULT_START_Y = (window.innerHeight - DEFAULT_SQUARE_WIDTH) / 2;
var DEFAULT_FILL_COLOR = '#000000';
var DEFAULT_GRADIENT_START_COLOR = '#999999';
var DEFAULT_GRADIENT_END_COLOR = '#ffffff';

function Layer(elementId, startX, startY, squareWidth, fillColor, gradientStartColor, gradientEndColor) {
  if (window === this) {
    return new Layer();
  }

  startX = (startX === undefined) ? DEFAULT_START_X : startX;
  startY = (startY === undefined) ? DEFAULT_START_Y : startY;
  this.squareWidth = squareWidth || DEFAULT_SQUARE_WIDTH;
  this.fillColor = fillColor || DEFAULT_FILL_COLOR;
  this.gradientStartColor = gradientStartColor || DEFAULT_GRADIENT_START_COLOR;
  this.gradientEndColor = gradientEndColor || DEFAULT_GRADIENT_END_COLOR;

  this.canvasController = new CanvasController(elementId);

  this.square = new Square(this.canvasController,
      startX,
      startY,
      this.squareWidth,
      this.fillColor,
      this.gradientStartColor,
      this.gradientEndColor);

  this.inputController = new InputController(this.canvasController, this.square);

  var _this = this;
  this.canvasController.redrawFunction = function() {
    _this.inputController.redraw(_this.square.cx, _this.square.cy);
  };

  this.inputController.drawBlank();

  return this;
}

Layer.prototype = {
  squareWidth: undefined,
  fillColor: undefined,
  gradientStartColor: undefined,
  gradientEndColor: undefined,

  canvasController: undefined,
  square: undefined,
  inputController: undefined
}
