var PASSTHROUGH_EVENTS = ['mousedown', 'mouseup', 'mousemove', 'mouseout', 'touchstart', 'touchend', 'touchmove'];

function Cover(elementId, coveredElementId) {
  if (window === this) {
    return new Cover(elementId, coveredElementId);
  }

  this.elementId = elementId;
  this.coveredElementId = coveredElementId;
  this.canvasController = new CanvasController(this.elementId);

  this.initialize(this.elementId, this.coveredElementId);

  return this;
}

Cover.prototype = {
  elementId: undefined,
  coveredElementId: undefined,
  canvasController: undefined,

  initialize: function(elementId, coveredElementId) {
    PASSTHROUGH_EVENTS.forEach(function bindEventToCoveredElement(eventName) {
      $('#' + elementId).on(eventName, function() {
        $('#' + coveredElementId).trigger(eventName, arguments);
      });
    });
  }
}
