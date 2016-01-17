var PASSTHROUGH_EVENTS = ['mousedown', 'mouseup', 'mousemove', 'mouseout', 'touchstart', 'touchend', 'touchmove'];
var MAX_ELEMENTS = 1000;

function Cover(containerId, coveredElementId) {
  if (window === this) {
    return new Cover(containerId, coveredElementId);
  }

  this.containerId = containerId;
  this.coverId = this.getRandomElementId();
  this.createCoverCanvas(this.coverId);

  this.coveredElementId = coveredElementId;
  this.canvasController = new CanvasController(this.coverId);

  this.bind();

  return this;
}

// TODO: Shared code between this and Layer.js. Should be moved to a shared parent
// that both inherit from.

// Generate a random number, retrying if already present. This is a naive
// approach but we should NEVER expect a large number of canvases to be
// generated anyway. That's not the goal of this project.
Cover.prototype.getRandomElementId = function() {
  var id = 'cover-' + Math.floor(Math.random() * MAX_ELEMENTS);

  if ($('#' + id).length) {
    return getRandomElementId();
  }

  return id;
}

Cover.prototype.createCoverCanvas = function(canvasId) {
  $('#' + this.containerId).append(
    '<canvas id="' + canvasId + '"></canvas>'
  );
}

Cover.prototype.bind = function() {
  PASSTHROUGH_EVENTS.forEach(function bindEventToCoveredElement(eventName) {
    $('#' + this.coverId).on(eventName, function() {
      $('#' + this.coveredElementId).trigger(eventName, arguments);
    }.bind(this));
  }.bind(this));
};

Cover.prototype.unbind = function() {
  PASSTHROUGH_EVENTS.forEach(function unbindEvent(eventName) {
    $('#' + this.coverId).off(eventName);
  }.bind(this));
};

Cover.prototype.destroy = function() {
  $('#' + this.coverId).remove();
};
