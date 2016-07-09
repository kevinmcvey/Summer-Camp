var FPS = 20;
var FADE_INTERVAL = Math.ceil(1000 / FPS);
var FADE_OUT_TIME = 10; // seconds
var FADE_IN_TIME = 1; // seconds
var FADE_OUT_STEPS = Math.ceil((FADE_OUT_TIME * 1000) / FADE_INTERVAL);
var FADE_IN_STEPS = Math.ceil((FADE_IN_TIME * 1000) / FADE_INTERVAL);
var DEFAULT_DAY_LIMIT = 10; // days

function SummerCamp(layerController, coverContainer, $titleContainer, dayLimit) {
  if (window === this) {
    return new SummerCamp(layerController);
  }

  this.layerController = layerController;
  this.coverContainer = coverContainer;

  this.fadeOpacity = 1.0;
  this.fadeStepsPassed = 0;
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
  //this.fadeInId = this.scheduler.schedule(FADE_INTERVAL, this.setFadeIn.bind(this));
  this.fadeOutId = this.scheduler.schedule(FADE_INTERVAL, this.setFade.bind(this));
  //this.dayPassedId = this.scheduler.schedule(FADE_INTERVAL * (FADE_OUT_STEPS + FADE_IN_STEPS), this.onDayPassed.bind(this));
};

SummerCamp.prototype.setFade = function() {
  // TODO: Should this live in layer controller? Given that it's a project-wide
  // fade layer I'm not so sure.
  this.layerController.updateCoverOpacity(this.fadeOpacity);

  if (this.fadeStepsPassed < FADE_IN_STEPS) {
      this.fadeOpacity -= (1 / FADE_IN_STEPS);
      this.fadeStepsPassed++;
      if (this.stopOnNextFade) {
        this.scheduler.timer.pause();
        this.scheduler.$el.off();
        return;
      }
  } else if (this.fadeStepsPassed < (FADE_IN_STEPS + FADE_OUT_STEPS)) {
      this.fadeOpacity += (1 / FADE_OUT_STEPS);
      this.fadeStepsPassed++;
  } else {
      this.onDayPassed();
      this.fadeStepsPassed = 0;
  }

  this.title.setOpacity(1 - this.fadeOpacity);
};

SummerCamp.prototype.onDayPassed = function() {
  // Only run the demo step once. It's not a "real day"
  if (!this.demoStep) {
    this.daysPassed++;
  }

  // When we've exceeded twice our day limit plus one (aka, we've had an outro-day), refresh
  if (this.daysPassed > this.dayLimit * 2) {
    this.stopOnNextFade = true; // Huge hack
    return;
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

  var randomColor = 'rgba(' + Math.floor(Math.random() * 255) + ', ' +
                              Math.floor(Math.random() * 255) + ', ' +
                              Math.floor(Math.random() * 255) + ', 1.0)';

  // Add new layers until we've reached the "day limit"
  if (this.daysPassed < this.dayLimit) {
    this.layerController.addLayer(undefined, undefined, undefined, undefined,
                                  randomColor, randomColor);
    this.layerController.transitionActiveLayer(this.layerController.layers.length - 1);
  }

  // When we've reached our limit, unbind the cover (no further interaction supported)
  if (this.daysPassed === this.dayLimit) {
    this.layerController.cover.unbind();
  }

  this.title.setOpacity(1.0);
  this.fadeOpacity = 1.0;
};

SummerCamp.prototype.updateTitle = function(day) {
  var dayNames = [
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
  ];

  var subTitle = '';
  var title = '';
  if (day < this.dayLimit) {
    // Human control
    title = dayNames[day];
    for (var i = 0; i < day; i++) {
      subTitle = dayNames[i] + '<br>' + subTitle;
    }
  } else if (day < this.dayLimit * 2) {
    // Computer control
    var missingDays = day - this.dayLimit;
    for (var i = missingDays; i < this.dayLimit; i++) {
      subTitle = dayNames[i] + '<br>' + subTitle;
    }
  } else {
    // Just show the ending text.
    this.finalFrame = true;
    subTitle = 'another day at summer camp.';
  }

  this.title.setGraySubtitle();
  this.title.setText(title, subTitle);
  return this;
};
