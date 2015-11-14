Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
}

// 0 === -0 unfortunately
Number.prototype.isNegativeZero = function() {
  var n = this;
  return n === 0 && (((n = +n) || (1 / n)) < 0);
}

