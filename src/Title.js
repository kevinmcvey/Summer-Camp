function Title($el) {
  if (!window === this) {
    return new Title($el);
  }

  this.$el = $el;
  this.$primary = $el.find('#title-box');
  this.$secondary = $el.find('#sub-title');

  return this;
}

Title.prototype.setText = function(primaryText, secondaryText) {
  this.$primary.html(primaryText || '');
  this.$secondary.html(secondaryText || '');

  return this;
};

Title.prototype.setOpacity = function(opacity) {
  this.$el.css({ opacity: opacity });

  var displayFunction = (opacity) ? 'show' : 'hide';
  this.$el[displayFunction]();

  return this;
};

Title.prototype.setGraySubtitle = function() {
  if (!this.$secondary.hasClass('gray-subtitle')) {
    this.$secondary.addClass('gray-subtitle');
  }

  return this;
};
