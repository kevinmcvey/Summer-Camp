var DEFAULT_SQUARE_WIDTH = 100;
var DEFAULT_FILL_COLOR = '#000000';
var DEFAULT_GRADIENT_START_COLOR = '#999999';
var DEFAULT_GRADIENT_END_COLOR = '#ffffff';

function Layer(elementId, squareWidth, fillColor, gradientStartColor, gradientEndColor) {
  if (window === this) {
    return new Layer();
  }

  this.squareWidth = squareWidth || DEFAULT_SQUARE_WIDTH;
  this.fillColor = fillColor || DEFAULT_FILL_COLOR;
  this.gradientStartColor = gradientStartColor || DEFAULT_GRADIENT_START_COLOR;
  this.gradientEndColor = gradientEndColor || DEFAULT_GRADIENT_END_COLOR;

  this.canvasController = new CanvasController(elementId);

  this.square = new Square(this.canvasController,
      (window.innerWidth - this.squareWidth) / 2,
      (window.innerHeight - this.squareWidth) / 2,
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
