fabric.Canvas.prototype.renderAll = function(allOnTop) {
  var canvasToDrawOn = this[(allOnTop === true && this.interactive) ? 'contextTop' : 'contextContainer'];

  if (this.contextTop && this.selection && !this._groupSelector) {
    this.clearContext(this.contextTop);
  }

  if (!allOnTop) {
    this.clearContext(canvasToDrawOn);
  }

  this.fire('before:render');

  if (this.clipTo) {
    fabric.util.clipContext(this, canvasToDrawOn);
  }

  this._renderBackground(canvasToDrawOn);
  this._renderObjects(canvasToDrawOn);

  if (this.clipTo) {
    canvasToDrawOn.restore();
  }

  if (!this.controlsAboveOverlay && this.interactive) {
    this.drawControls(canvasToDrawOn);
  }

  this._renderOverlay(canvasToDrawOn);

  if (this.controlsAboveOverlay && this.interactive) {
    this.drawControls(canvasToDrawOn);
  }

  this.fire('after:render');

  return this;
};

fabric.Canvas.prototype._draw = function (ctx, object) {
  if (!object) {
    return;
  }

  ctx.save();
  var v = this.viewportTransform;
  ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
  if (this._shouldRenderObject(object)) {
    object.render(ctx);
  }
  ctx.restore();
};

fabric.Canvas.prototype._renderObjects = function(ctx) {
  var i, length;

  for (i = 0, length = this._objects.length; i < length; ++i) {
    this._draw(ctx, this._objects[i]);
  }
};
