fabric.EventTarget = function() {
  this._listeners = {};
};

fabric.EventTarget.prototype.on = function(eventName, eventListener) {
  this._listeners[eventName] = this._listeners[eventName] || [];
  this._listeners[eventName].push(eventListener);
};

fabric.EventTarget.prototype.off = function(eventName, eventListener) {
  if (!this._listeners.hasOwnProperty(eventName)) return;
  var index = this._listeners[eventName].indexOf(eventListener);
  if (index !== -1) {
    this._listeners[eventName].splice(index, 1);
  }
};

fabric.EventTarget.prototype.emit = function(eventName) {
  if (!this._listeners.hasOwnProperty(eventName)) return;
  this._listeners[eventName].forEach(function(listener) {
    listener();
  });
};

fabric.ResourceLoader = function(url, options) {
  fabric.EventTarget.call(this);

  this.url = url;
  this.options = options;
  this.data = null;
};

fabric.ResourceLoader.prototype = Object.create(fabric.EventTarget.prototype);

fabric.ResourceLoader.prototype.constructor = fabric.ResourceLoader;

fabric.ResourceLoader.prototype.setUrl = function(url) {
  this.url = url;
}

fabric.ResourceLoader.prototype.getUrl = function() {
  return this.url;
};

fabric.ResourceLoader.prototype.setOptions = function(options) {
  this.options = options;
};

fabric.ResourceLoader.prototype.getOptions = function() {
  return this.options;
};

fabric.ResourceLoader.prototype.setData = function(data) {
  this.data = data;
};

fabric.ResourceLoader.prototype.getData = function() {
  return this.data;
};

fabric.ImageLoader = function(url, options) {
  fabric.ResourceLoader.call(this, url, options);
};

fabric.ImageLoader.prototype = Object.create(fabric.ResourceLoader.prototype);

fabric.ImageLoader.prototype.constructor = fabric.ImageLoader;

fabric.ImageLoader.prototype.load = function() {
  var self = this;

  fabric.util.loadImage(this.url, function(image) {
    self.setData(image);
    self.emit('load', this);
  });
};

fabric.FontLoader = function(url, options) {
  fabric.ResourceLoader.call(this, url, options);
};

fabric.FontLoader.prototype = Object.create(fabric.ResourceLoader.prototype);

fabric.FontLoader.prototype.constructor = fabric.FontLoader;

fabric.FontLoader.prototype._addFontStyle = function() {
  var styleNode = document.querySelector('style#fonts');

  if (!styleNode) {
    styleNode = document.createElement('style');
    styleNode.id = 'fonts';
    styleNode.type = 'text/css';
    document.head.appendChild(styleNode);
  }

  var re = RegExp('font-family: "' + this.options.fontFamily + '";', 'g');
  if (!re.test(styleNode.innerHTML)) {
    var html = '@font-face {\n';
    html += '  font-family: "' + this.options.fontFamily + '";\n';
    html += '  src: url("' + this.url + '") format("' + this.options.format + '");\n';
    html += '}\n';
    styleNode.innerHTML += html;
  }
};

fabric.FontLoader.prototype.load = function() {
  var self = this;

  this._addFontStyle();

  FontDetect.onFontLoaded(this.options.fontFamily, function() {
    self.emit('load', self);
  });
};

fabric.ResourcesLoader = function() {
  fabric.EventTarget.call(this);

  this._resources = {};
  this._count = 0;

  this._loadersByType = {
    'image': fabric.ImageLoader,
    'font': fabric.FontLoader
  };
};

fabric.ResourcesLoader.prototype = Object.create(fabric.EventTarget.prototype);

fabric.ResourcesLoader.prototype.constructor = fabric.ResourcesLoader;

fabric.ResourcesLoader.prototype.add = function(type, url, options) {
  var self = this;

  // Check if given resource is already added to the list.
  if (self._resources.hasOwnProperty(url)) return;

  // Get resource loader constructor by type.
  var Resource = self._loadersByType[type];
  if (!Resource) throw new Error(type + ' is an unsupported type');

  // Create instance of resource loader.
  var resource = new Resource(url, options);
  self._resources[url] = resource;

  // Increase resources count.
  self._count++;
};

fabric.ResourcesLoader.prototype.load = function() {
  var self = this;

  for (var url in self._resources) {
    if (self._resources.hasOwnProperty(url)) {
      var resource = self._resources[url];

      resource.on('load', function() {
        self.onLoadListener();
      });
      resource.load();
    }
  }
};

fabric.ResourcesLoader.prototype.onLoadListener = function(resource) {
  this._count--;

  this.emit('progress');

  if (this._count === 0) {
    this.emit('complete', {
      content: this
    });
    if (this.onComplete) this.onComplete();
  }
};

fabric.ResourcesLoader.prototype.getResource = function (url) {
  if (this._resources.hasOwnProperty(url)) {
    return this._resources[url];
  }

  return;
};

fabric.ResourcesLoader.prototype.getResources = function () {
  return this._resources;
};
