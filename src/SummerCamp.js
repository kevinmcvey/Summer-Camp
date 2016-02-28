var FADE_INTERVAL = 100;
var FADE_STEPS = 100;
var DEFAULT_DAY_LIMIT = 10;

function SummerCamp(layerController, coverContainer, dayLimit) {
  if (window === this) {
    return new SummerCamp(layerController);
  }

  this.layerController = layerController;
  this.coverContainer = coverContainer;
  this.scheduler = new Scheduler(window);

  this.fadeOpacity = 0.0;
  this.timePassedId = this.scheduler.schedule(FADE_INTERVAL, this.onTimePassed.bind(this));
  // TODO: Consider moving to the time passing function -- it's possible that these aren't syncing properly
  this.dayPassedId = this.scheduler.schedule(FADE_INTERVAL * FADE_STEPS, this.onDayPassed.bind(this));
  this.dayLimit = dayLimit || DEFAULT_DAY_LIMIT;
  this.daysPassed = 0;

  return this;
}

SummerCamp.prototype.initialize = function() {
  layerController.addLayer(undefined, // start x
                           undefined, // start y
                           undefined, // square width
                           undefined, // fill color
                           'rgba(255, 150, 150, 1.0)',
                           'rgba(255, 150, 150, 1.0)');

  layerController.addCover(this.coverContainer);
};

SummerCamp.prototype.onTimePassed = function() {
  console.log(this.scheduler.timer.now());
  // TODO: Should this live in layer controller? Given that it's a project-wide
  // fade layer I'm not so sure.
  this.layerController.updateCoverOpacity(this.fadeOpacity);
  this.fadeOpacity += (1 / FADE_STEPS);
};

SummerCamp.prototype.onDayPassed = function() {
  this.daysPassed++;

  this.layerController.returnAllLayersToStart();
  this.layerController.replayAllLayerLogs();

  var randomColor = 'rgba(' + Math.floor(Math.random() * 255) + ', ' +
                              Math.floor(Math.random() * 255) + ', ' +
                              Math.floor(Math.random() * 255) + ', 1.0)';

  // Add new layers until we've reached the "day limit"
  if (this.daysPassed < this.dayLimit) {
    this.layerController.addLayer(undefined, undefined, undefined, undefined,
                                  randomColor, randomColor);
    //                         'rgba(150, 255, 150, 1.0)', 'rgba(150, 255, 150, 0.0)');
    this.layerController.transitionActiveLayer(this.layerController.layers.length - 1);
  }

  // When we've reached our limit, unbind the cover (no further interaction supported)
  if (this.daysPassed === this.dayLimit) {
    this.layerController.cover.unbind();
  }

  // For every day past the day limit, remove a layer's record
  if (this.daysPassed > this.dayLimit) {
    this.layerController.layers[0].removeLayerCanvas();
    this.layerController.layers = this.layerController.layers.slice(1);
  }

  this.fadeOpacity = 0.0;
};
