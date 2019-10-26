// referene: http://docs.aegisub.org/3.2/ASS_Tags/
// based on mpv's assdraw.lua

var c = 0.551915024494 // circle approximation

function Assdraw() {
  this.scale = 4;
  this.text = ""
}

Assdraw.SMART_WRAPPING = 0
Assdraw.EOL_WRAPPING = 1
Assdraw.NO_WORD_WRAPPING = 2
Assdraw.SMART_WRAPPING_WIDER = 3
Assdraw.BOTTOM_LEFT = 1
Assdraw.BOTTOM_CENTER = 2
Assdraw.BOTTOM_RIGHT = 3
Assdraw.MIDDLE_LEFT = 4
Assdraw.MIDDLE_CENTER = 5
Assdraw.MIDDLE_RIGHT = 6
Assdraw.TOP_LEFT = 7
Assdraw.TOP_CENTER = 8
Assdraw.TOP_RIGHT = 9

Assdraw.escape = function(s) {
  return s.replace(/([{}])/g, "\\$1")
}

Assdraw.bolden = function(s) {
  return '{\\b1}' + s + '{\\b0}'
}

Assdraw.prototype.newEvent = function() {
  // osd_libass.c adds an event per line
  if (this.text.length > 0) {
    this.text = this.text + "\n"
  }
}

Assdraw.prototype.override = function(callback) {
  this.append('{')
  callback.call(this);
  this.append('}')
}

Assdraw.prototype.primaryFillColor = function(hex) {
  this.append('\\1c&H' + hex + '&')
  return this;
}

Assdraw.prototype.secondaryFillColor = function(hex) {
  this.append('\\2c&H' + hex + '&')
  return this;
}

Assdraw.prototype.borderColor = function(hex) {
  this.append('\\3c&H' + hex + '&')
  return this;
}

Assdraw.prototype.shadowColor = function(hex) {
  this.append('\\4c&H' + hex + '&')
  return this;
}

Assdraw.prototype.primaryFillAlpha = function(hex) {
  this.append('\\1a&H' + hex + '&')
  return this;
}

Assdraw.prototype.secondaryFillAlpha = function(hex) {
  this.append('\\2a&H' + hex + '&')
  return this;
}

Assdraw.prototype.borderAlpha = function(hex) {
  this.append('\\3a&H' + hex + '&')
  return this;
}

Assdraw.prototype.shadowAlpha = function(hex) {
  this.append('\\4a&H' + hex + '&')
  return this;
}

Assdraw.prototype.fontName = function(s) {
  this.append('\\fn' + s)
  return this;
}

Assdraw.prototype.fontSize = function(s) {
  this.append('\\fs' + s)
  return this;
}

Assdraw.prototype.borderSize = function(n) {
  this.append('\\bord' + n)
  return this;
}

Assdraw.prototype.xShadowDistance = function(n) {
  this.append('\\xshad' + n)
  return this;
}

Assdraw.prototype.yShadowDistance = function(n) {
  this.append('\\yshad' + n)
  return this;
}

Assdraw.prototype.letterSpacing = function(n) {
  this.append('\\fsp' + n)
  return this;
}

Assdraw.prototype.wrapStyle = function(n) {
  this.append('\\q' + n)
  return this;
}

Assdraw.prototype.drawStart = function() {
  this.text = this.text + "{\\p"+ this.scale + "}"
}

Assdraw.prototype.drawStop = function() {
  this.text = this.text + "{\\p0}"
}

Assdraw.prototype.coord = function(x, y) {
  var scale = Math.pow(2, (this.scale - 1))
  var ix = Math.ceil(x * scale)
  var iy = Math.ceil(y * scale)
  this.text = this.text + " " + ix + " " + iy
}

Assdraw.prototype.append = function(s) {
  this.text = this.text + s
}

Assdraw.prototype.appendLn = function(s) {
  this.append(s + '\\n')
}

Assdraw.prototype.appendLN = function(s) {
  this.append(s + '\\N')
}

Assdraw.prototype.merge = function(other) {
  this.text = this.text + other.text
}

Assdraw.prototype.pos = function(x, y) {
  this.append("\\pos(" + x.toFixed(0) + "," + y.toFixed(0) + ")")
}

Assdraw.prototype.lineAlignment = function(an) {
  this.append("\\an" + an)
}

Assdraw.prototype.moveTo = function(x, y) {
  this.append(" m")
  this.coord(x, y)
}

Assdraw.prototype.lineTo = function(x, y) {
  this.append(" l")
  this.coord(x, y)
}

Assdraw.prototype.bezierCurve = function(x1, y1, x2, y2, x3, y3) {
  this.append(" b")
  this.coord(x1, y1)
  this.coord(x2, y2)
  this.coord(x3, y3)
}


Assdraw.prototype.rectCcw = function(x0, y0, x1, y1) {
  this.moveTo(x0, y0)
  this.lineTo(x0, y1)
  this.lineTo(x1, y1)
  this.lineTo(x1, y0)
}

Assdraw.prototype.rectCw = function(x0, y0, x1, y1) {
  this.moveTo(x0, y0)
  this.lineTo(x1, y0)
  this.lineTo(x1, y1)
  this.lineTo(x0, y1)
}

Assdraw.prototype.hexagonCw = function(x0, y0, x1, y1, r1, r2) {
  if (typeof r2 === 'undefined') {
    r2 = r1
  }
  this.moveTo(x0 + r1, y0)
  if (x0 != x1) {
    this.lineTo(x1 - r2, y0)
  }
  this.lineTo(x1, y0 + r2)
  if (x0 != x1) {
    this.lineTo(x1 - r2, y1)
  }
  this.lineTo(x0 + r1, y1)
  this.lineTo(x0, y0 + r1)
}

Assdraw.prototype.hexagonCcw = function(x0, y0, x1, y1, r1, r2) {
  if (typeof r2 === 'undefined') {
    r2 = r1
  }
  this.moveTo(x0 + r1, y0)
  this.lineTo(x0, y0 + r1)
  this.lineTo(x0 + r1, y1)
  if (x0 != x1) {
    this.lineTo(x1 - r2, y1)
  }
  this.lineTo(x1, y0 + r2)
  if (x0 != x1) {
    this.lineTo(x1 - r2, y0)
  }
}

Assdraw.prototype.roundRectCw = function(ass, x0, y0, x1, y1, r1, r2) {
  if (typeof r2 === 'undefined') {
    r2 = r1
  }
  var c1 = c * r1 // circle approximation
  var c2 = c * r2 // circle approximation
  this.moveTo(x0 + r1, y0)
  this.lineTo(x1 - r2, y0) // top line
  if (r2 > 0) {
    this.bezierCurve(x1 - r2 + c2, y0, x1, y0 + r2 - c2, x1, y0 + r2) // top right corner
  }
  this.lineTo(x1, y1 - r2) // right line
  if (r2 > 0) {
    this.bezierCurve(x1, y1 - r2 + c2, x1 - r2 + c2, y1, x1 - r2, y1) // bottom right corner
  }
  this.lineTo(x0 + r1, y1) // bottom line
  if (r1 > 0) {
    this.bezierCurve(x0 + r1 - c1, y1, x0, y1 - r1 + c1, x0, y1 - r1) // bottom left corner
  }
  this.lineTo(x0, y0 + r1) // left line
  if (r1 > 0) {
    this.bezierCurve(x0, y0 + r1 - c1, x0 + r1 - c1, y0, x0 + r1, y0) // top left corner
  }
}

Assdraw.prototype.roundRectCcw = function(ass, x0, y0, x1, y1, r1, r2) {
  if (typeof r2 === 'undefined') {
    r2 = r1
  }
  var c1 = c * r1 // circle approximation
  var c2 = c * r2 // circle approximation
  this.moveTo(x0 + r1, y0)
  if (r1 > 0) {
    this.bezierCurve(x0 + r1 - c1, y0, x0, y0 + r1 - c1, x0, y0 + r1) // top left corner
  }
  this.lineTo(x0, y1 - r1) // left line
  if (r1 > 0) {
    this.bezierCurve(x0, y1 - r1 + c1, x0 + r1 - c1, y1, x0 + r1, y1) // bottom left corner
  }
  this.lineTo(x1 - r2, y1) // bottom line
  if (r2 > 0) {
    this.bezierCurve(x1 - r2 + c2, y1, x1, y1 - r2 + c2, x1, y1 - r2) // bottom right corner
  }
  this.lineTo(x1, y0 + r2) // right line
  if (r2 > 0) {
    this.bezierCurve(x1, y0 + r2 - c2, x1 - r2 + c2, y0, x1 - r2, y0) // top right corner
  }
}

module.exports = Assdraw
