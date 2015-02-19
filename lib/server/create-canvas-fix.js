var createCanvasForNode = fabric.createCanvasForNode;

fabric.createCanvasForNode = function () {
  var canvas = createCanvasForNode.apply(this, arguments);
  canvas.nodeCanvas = new Canvas(canvas.width, canvas.height);
  canvas.contextContainer = canvas.nodeCanvas.getContext('2d');
  canvas.Font = Canvas.Font;

  return canvas;
};

fabric.util.createCanvasElement = function () {
  return new Canvas();
};
