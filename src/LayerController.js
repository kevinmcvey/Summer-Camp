function LayerController(containerId) {
  if (window === this) {
    return new LayerController(containerId);
  }

  this.containerId = containerId;
  this.layers = [];
  this.activeLayer = 0;

  return this;
}

LayerController.prototype = {
  containerId: undefined,
  layers: undefined,

  // Calls Layer constructor with whatever arguments are passed in.
  // Will add the container on its own. Caller should leave this out
  // and only provide the optional arguments.
  addLayer: function() {
    var layerArgs = prependToArguments([null, this.containerId], arguments);
    this.layers.push(
      new (Function.prototype.bind.apply(Layer, layerArgs))
    );

    // TODO: This might not be right.
    this.activeLayer = this.layers.length - 1;
  },

  // Calls Cover constructor with whatever arguments are passed in.
  // Will add the contaienr on its own. Caller should leave this out
  // and only provide the optional arguments
  addCover: function() {
    var topLayer = this.layers[this.layers.length - 1];
    var coverArgs = prependToArguments([null], arguments);
    coverArgs = appendToArguments([topLayer.canvasId], coverArgs);

    this.cover = new (Function.prototype.bind.apply(Cover, coverArgs));
  },

  // TODO: Maybe full id?
  transitionActiveLayer: function(nextActiveLayerIndex) {
    this.cover.unbind();
    this.cover.coveredElementId = this.layers[nextActiveLayerIndex].canvasId;
    this.cover.bind();

    this.activeLayer = nextActiveLayerIndex;
  },

  updateCoverOpacity: function(opacity) {
    var width = this.cover.canvasController.width;
    var height = this.cover.canvasController.height;
    this.cover.canvasController.reset();
    this.cover.canvasController.rect(0, 0, width, height, 'rgba(255, 255, 255, ' + opacity + ')');
  },

  returnAllLayersToStart: function() {
    this.layers.forEach(function forEachLayer(layer) {
      layer.square.returnToStart();
    });
  },

  replayAllLayerLogs: function() {
    this.layers.forEach(function forEachLayer(layer) {
      layer.inputController.replayLogs(layer.inputController.eventLog);
    });
  }
}
