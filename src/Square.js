function Square(canvasController, x, y, width, fillColor, gradientStartColor, gradientEndColor) {
  if (window === this) {
    return new Square(canvasController, x, y, width, fillColor, gradientStartColor, gradientEndColor);
  }

  this.canvasController = canvasController;

  this.x = x;
  this.y = y;
  this.width = width;
  this.cx = this.x + (this.width / 2);
  this.cy = this.y + (this.width / 2);

  // Backups for the sake of restarting
  this.startX = this.x;
  this.startY = this.y;
  this.startCx = this.cx;
  this.startCy = this.cy;

  this.fillColor = fillColor;
  this.gradientStartColor = gradientStartColor;
  this.gradientEndColor = gradientEndColor;
  this.shadowGradient = this.regenerateRadialGradient();

  this.exteriorPoints = this.regenerateExteriorPoints();
  this.quadrantIntersectPoints = this.regenerateQuadrantIntersectPoints();

  return this;
}

Square.prototype = {
  x: undefined,
  y: undefined,
  cx: undefined,
  cy: undefined,

  exteriorPoints: undefined,
  quadrantIntersectPoints: undefined,

  width: undefined,
  fillColor: undefined,
  shadowGradient: undefined,

  dragging: false,
  dragOffset: [],

  drawSelf: function() {
    this.canvasController.rect(this.x, this.y, this.width, this.width, this.fillColor);
  },

  drawShadow(lightX, lightY) {
    var quadrant = this.getQuadrant(lightX, lightY);
    //if (quadrant === -1) { return; }

    var shadowPoints = this.getShadowShape(quadrant, lightX, lightY);

    this.canvasController.shape(shadowPoints, this.shadowGradient);
  },

  regenerateRadialGradient() {
    return this.canvasController.pageRadialGradient(this.cx, this.cy, this.gradientStartColor, this.gradientEndColor);
  },

  regenerateExteriorPoints: function() {
    return [[[this.x, this.y], [this.x + this.width, this.y]],
        [[this.x, this.y + this.width], [this.x + this.width, this.y + this.width]]];
  },

  /**
   * Quadrants are in "reading order":
   *
   *  0   1   2
   *  3  -1   4
   *  5   6   7
   */
  regenerateQuadrantIntersectPoints: function() {
    return [[this.exteriorPoints[1][0], this.exteriorPoints[0][1]],
        [this.exteriorPoints[0][0], this.exteriorPoints[0][1]],
        [this.exteriorPoints[0][0], this.exteriorPoints[1][1]],
        [this.exteriorPoints[0][0], this.exteriorPoints[1][0]],
        [this.exteriorPoints[0][1], this.exteriorPoints[1][1]],
        [this.exteriorPoints[0][0], this.exteriorPoints[1][1]],
        [this.exteriorPoints[1][0], this.exteriorPoints[1][1]],
        [this.exteriorPoints[1][0], this.exteriorPoints[0][1]]];
  },

  isWithinSquare(x, y) {
    return (x >= this.x && x <= this.x + this.width &&
        y >= this.y && y <= this.y + this.width);
  },

  getQuadrant: function(x, y) {
    var xStat = 0;
    var yStat = 0;

    if (x < this.exteriorPoints[0][0][0]) {
      xStat = 0;
    } else if (x < this.exteriorPoints[0][1][0]) {
      xStat = 1;
    } else {
      xStat = 2;
    }

    if (y < this.exteriorPoints[0][0][1]) {
      yStat = 0;
    } else if (y < this.exteriorPoints[1][0][1]) {
      yStat = 1;
    } else {
      yStat = 2;
    }

    if (xStat == 0 && yStat == 0) { return 0 };
    if (xStat == 0 && yStat == 1) { return 3 };
    if (xStat == 0 && yStat == 2) { return 5 };
    if (xStat == 1 && yStat == 0) { return 1 };
    if (xStat == 1 && yStat == 2) { return 6 };
    if (xStat == 2 && yStat == 0) { return 2 };
    if (xStat == 2 && yStat == 1) { return 4 };
    if (xStat == 2 && yStat == 2) { return 7 };

    return -1;
  },

  getShadowShape: function(quadrant, mouseX, mouseY) {
    // Currently if hovering over the box, show nothing. Uncomment second line to instead
    // fill the entire window
    if (quadrant === -1) {
      return [[]];
      //return [[0,0], [window.innerWidth, 0], [window.innerWidth, window.innerHeight], [0, window.innerHeight]];
    }

    var quadrantIntersectPoints = this.quadrantIntersectPoints[quadrant];

    var dX1 = quadrantIntersectPoints[0][0] - mouseX;
    var dY1 = quadrantIntersectPoints[0][1] - mouseY;
    var dX2 = quadrantIntersectPoints[1][0] - mouseX;
    var dY2 = quadrantIntersectPoints[1][1] - mouseY;

    var slope1 = dY1 / dX1;
    var slope2 = dY2 / dX2;

    var points = [quadrantIntersectPoints[0], quadrantIntersectPoints[1]];

    var pt1 = quadrantIntersectPoints[0];
    var pt2 = quadrantIntersectPoints[1];

    var sub1 = (([1, 2, 4, 6, 7]).indexOf(quadrant) !== -1) ? 0 : window.innerWidth;
    var sub2 = (([2, 4, 7]).indexOf(quadrant) !== -1) ? 0 : window.innerWidth;

    var end1 = [sub1, pt1[1] + ((sub1 - pt1[0]) * slope1)];
    var end2 = [sub2, pt2[1] + ((sub2 - pt2[0]) * slope2)];

    // Hacky solution: override at asymtotes
    if (slope1 === Infinity) {
      end1 = [pt1[0], window.innerHeight];
    } else if (slope1 === -Infinity || isNaN(slope1)) {
      end1 = [pt1[0], 0];
    }

    if (slope2 === Infinity) {
      end2 = [pt2[0], window.innerHeight];
    } else if (slope2 === -Infinity) {
      end2 = [pt2[0], 0];
    }

    points.push(pt1);
    points.push(end1);

    switch(quadrant) {
      case 0:
        points.push([window.innerWidth, window.innerHeight])
        break;
      case 1:
        if (end1[1] < window.innerHeight) {
          points.push([0, window.innerHeight]);
        }
        if (end2[1] < window.innerHeight) {
          points.push([window.innerWidth, window.innerHeight]);
        }
        break;
      case 2:
        points.push([0, window.innerHeight]);
        break;
      case 5:
        points.push([window.innerWidth, 0]);
        break;
      case 6:
        if (end1[1] > 0) {
          points.push([0, 0]);
        }
        if (end2[1] > 0) {
          points.push([window.innerWidth, 0]);
        }
        break;
      case 7:
        points.push([0, 0]);
        break;
    }

    points.push(end2);
    points.push(pt2);

    return points;
  },

  beginDrag: function(mouseX, mouseY) {
    this.dragging = true;
    this.dragOffset = [mouseX - this.x, mouseY - this.y];
  },

  midDrag: function(mouseX, mouseY) {
    this.x = (mouseX - this.dragOffset[0]).clamp(0, window.innerWidth - this.width);
    this.y = (mouseY - this.dragOffset[1]).clamp(0, window.innerHeight - this.width);

    this.cx = this.x + (this.width / 2);
    this.cy = this.y + (this.width / 2);

    this.exteriorPoints = this.regenerateExteriorPoints();
    this.quadrantIntersectPoints = this.regenerateQuadrantIntersectPoints();
    this.shadowGradient = this.regenerateRadialGradient();
  },

  endDrag: function() {
    this.dragging = false;
  },

  returnToStart: function() {
    this.x = this.startX;
    this.y = this.startY;
    this.cx = this.startCx;
    this.cy = this.startCy;

    this.exteriorPoints = this.regenerateExteriorPoints();
    this.quadrantIntersectPoints = this.regenerateQuadrantIntersectPoints();
    this.shadowGradient = this.regenerateRadialGradient();

    this.canvasController.reset();
    this.drawSelf();
  }
}

