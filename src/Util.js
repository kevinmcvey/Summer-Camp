Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
}

// 0 === -0 unfortunately
Number.prototype.isNegativeZero = function() {
  var n = this;
  return n === 0 && (((n = +n) || (1 / n)) < 0);
}

// Add value to the beginning of an arguments array. Safe operation for use with
// JavaScript optimizers (V8, etc...)
function prependToArguments(valueArray, argArray) {
  var returnArray = valueArray;
  for (argIndex = 0; argIndex < argArray.length; argIndex++) {
    returnArray.push(argArray[argIndex]);
  }

  return returnArray;
}

// Add value to the end of an arguments array. Safe operation for use with
// JavaScript optimizers (V8, etc...)
function appendToArguments(valueArray, argArray) {
  var returnArray = [];
  for (argIndex = 0; argIndex < argArray.length; argIndex++) {
    returnArray.push(argArray[argIndex]);
  }

  for (valueIndex = 0; valueIndex < valueArray.length; valueIndex++) {
    returnArray.push(valueArray[valueIndex]);
  }

  return returnArray;
}
