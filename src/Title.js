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
  this.$primary.text(primaryText || '');
  this.$secondary.text(secondaryText || '');

  return this;
};

Title.prototype.setOpacity = function(opacity) {
  this.$el.css({ opacity: opacity });

  var displayFunction = (opacity) ? 'show' : 'hide';
  this.$el[displayFunction]();

  return this;
};
