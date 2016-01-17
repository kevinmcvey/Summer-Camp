function CanvasController(elementId) {
  if (window === this) {
    return new CanvasController(elementId);
  }

  this.initialize(elementId);

  var _this = this;
  $(window).on('resize', function() {
    _this.resizeCanvasToWindow();
  });

  return this;
}

CanvasController.prototype = {
  canvas: undefined,
  context: undefined,
  width: undefined,
  height: undefined,

  redrawFunction: undefined,

  initialize: function(elementId) {
    this.canvas = document.getElementById(elementId);
    this.context = this.canvas.getContext('2d');
    this.resizeCanvasToWindow();
  },

  resizeCanvasToWindow: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    if (this.redrawFunction != undefined) {
      this.redrawFunction(window.innerWidth, window.innerHeight);
    }
  },

  rect: function(x, y, width, height, fillColor) {
    var ctx = this.context;

    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);
  },

  line: function(x1, y1, x2, y2, strokeColor) {
    var ctx = this.context;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  },

  shape: function(points, fillColor) {
    var ctx = this.context;

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var pointIndex = 1; pointIndex < points.length; pointIndex++) {
      var point = points[pointIndex];
      ctx.lineTo(point[0], point[1]);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  },

  pageRadialGradient: function(cx, cy, startColor, endColor) {
    var side1 = Math.max(cx, this.canvas.width - cx);
    var side2 = Math.max(cy, this.canvas.height - cy);
    var radius = Math.sqrt(side1 * side1 + side2 * side2);

    var gradient = this.context.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(0.95, endColor);

    return gradient;
  },

  reset: function() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

