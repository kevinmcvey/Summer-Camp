var FADE_INTERVAL = 100;
var FADE_STEPS = 100;
var DEFAULT_DAY_LIMIT = 10;
var TITLE_DISPLAY = 1000;

function SummerCamp(layerController, coverContainer, $titleContainer, dayLimit) {
  if (window === this) {
    return new SummerCamp(layerController);
  }

  this.layerController = layerController;
  this.coverContainer = coverContainer;

  this.fadeOpacity = 0.0;
  this.scheduler = layerController.scheduler; // TODO refactor?
  this.dayLimit = dayLimit || DEFAULT_DAY_LIMIT;
  this.daysPassed = 0;
  this.title = new Title($titleContainer);

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

  this.demoStep = true;

  // This is where I have to add the title updater thing
  this.timePassedId = this.scheduler.schedule(FADE_INTERVAL, this.onTimePassed.bind(this));
  this.dayPassedId = this.scheduler.schedule(FADE_INTERVAL * FADE_STEPS, this.onDayPassed.bind(this));
};

SummerCamp.prototype.onTimePassed = function() {
  // TODO: Should this live in layer controller? Given that it's a project-wide
  // fade layer I'm not so sure.
  this.layerController.updateCoverOpacity(this.fadeOpacity);
  if (this.demoStep) {
    this.title.setOpacity(1 - this.fadeOpacity);
  }

  this.fadeOpacity += (1 / FADE_STEPS);
};

SummerCamp.prototype.onDayPassed = function() {
  // Only run the demo step once. It's not a "real day"
  if (!this.demoStep) {
    this.daysPassed++;
  }

  // For every day past the day limit, remove a layer's record
  // Alternatively, remove the demo day if we're on it
  if (this.daysPassed > this.dayLimit || this.demoStep) {
    this.layerController.layers[0].removeLayerCanvas();
    this.layerController.layers = this.layerController.layers.slice(1);

    this.demoStep = false;
  }

  this.layerController.returnAllLayersToStart();
  this.layerController.replayAllLayerLogs();
  this.updateTitle(this.daysPassed);
  this.title.setOpacity(1.0);

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

  this.fadeOpacity = 0.0;
};

SummerCamp.prototype.updateTitle = function(day) {
  var title = [
    'one.',
    'two.',
    'three.',
    'four.',
    'five.',
    'six.',
    'seven.',
    'eight.',
    'nine.',
    'ten.',
    'eleven.',
    'twelve.',
    'thirteen.',
    'fourteen.',
    'fifteen.',
    'sixteen.',
    'seventeen.',
    'eighteen.',
    'nineteen.',
    'twenty.'
  ][day];

  var subTitle = '';
  for (var i = 0; i <= day; i++) {
    subTitle += '. ';
  }

  this.title.setText(title, subTitle);
  return this;
};
