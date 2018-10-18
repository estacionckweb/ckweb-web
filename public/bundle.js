(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function audioPlayer(opts) {
  this.file = opts.file
  this.container = opts.container
  this.isPlaying = false

  var audio = new Audio(opts.stream)
  console.log('audio is', audio)
  this.audio = audio

  var buttonHolder = document.createElement('div')
  buttonHolder.setAttribute('class', 'button-holder')

  var self = this
  buttonHolder.onclick = () => {
    console.log(audio.paused)
    if(audio.paused){
      self.play()
    } else {
      self.pause()
    }
  }

  opts.container.appendChild(buttonHolder)
  this.playButton = document.createElement('div')
  this.playButton.setAttribute('class', 'play-button audio-player-button')
  buttonHolder.appendChild(this.playButton)

  this.pauseButton = document.createElement('div')
  this.pauseButton.setAttribute('class', 'pause-button audio-player-button')
  buttonHolder.appendChild(this.pauseButton)

  this.pause()
}

audioPlayer.prototype.play = function () {
  this.pauseButton.style.display = 'block'
  this.playButton.style.display = 'none'
  this.audio.play()
  this.onPlay()
}

audioPlayer.prototype.pause = function() {
  this.playButton.style.display = 'block'
  this.pauseButton.style.display = 'none'
  this.audio.pause()
  this.onPause()
}

audioPlayer.prototype.onPlay = () => {}

audioPlayer.prototype.onPause = () => {}

module.exports = audioPlayer

},{}],2:[function(require,module,exports){
const Hydra = require('hydra-synth')
var loop = require('raf-loop')


function hydraBackground({ canvas, initialAnimationDuration }) {
  var self = this
  this.hydra = new Hydra({
    canvas: canvas,
    autoLoop: false,
    detectAudio: false
  })
  console.log("hydra is", this.hydra)
  this.engine = loop(function(dt) {
      // delta time in milliseconds
      self.hydra.tick(dt)
  }).start()

  osc(80, 0.02, 1.4)
    .rotate(0.1, -0.008)
    .pixelate(50, 20)
    .diff(o0)
    .luma(0.1)
    .scale(1.01)
    .out()

  setTimeout(() => this.engine.stop(), initialAnimationDuration)
  //self.hydra.tick(0.01)
}

hydraBackground.prototype.play = function () {
  this.engine.start()
}

hydraBackground.prototype.pause = function() {
  this.engine.stop()
}

module.exports = hydraBackground

},{"hydra-synth":7,"raf-loop":28}],3:[function(require,module,exports){
const AudioPlayer = require('./audioPlayer.js')
const HydraBackground = require('./hydraBackground.js')

var canvas = document.getElementById("hydra")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
 //alert("hi")

var hydra = new HydraBackground({
  canvas: canvas,
  initialAnimationDuration: 300
})

var player = new AudioPlayer({
  stream: "http://radiolibre.co:8000/streamvivo.ogg",
  type: "application/ogg",
  container: document.getElementById("player")
})

player.onPlay = () => { hydra.play() }

player.onPause = () => { hydra.pause() }

},{"./audioPlayer.js":1,"./hydraBackground.js":2}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],5:[function(require,module,exports){
module.exports = function (cb) {
    if (typeof Promise !== 'function') {
      var err = new Error('Device enumeration not supported.');
      err.kind = 'METHOD_NOT_AVAILABLE';
      if (cb) {
          console.warn('module now uses promise based api - callback is deprecated');
          return cb(err);
      }
      throw err;
    }

    return new Promise(function(resolve, reject) {
        var processDevices = function (devices) {
            var normalizedDevices = [];
            for (var i = 0; i < devices.length; i++) {
                var device = devices[i];
                //make chrome values match spec
                var kind = device.kind || null;
                if (kind && kind.toLowerCase() === 'audio') {
                    kind = 'audioinput';
                } else if (kind && kind.toLowerCase() === 'video') {
                    kind = 'videoinput';
                }
                normalizedDevices.push({
                    facing: device.facing || null,
                    deviceId: device.id || device.deviceId || null,
                    label: device.label || null,
                    kind: kind,
                    groupId: device.groupId || null
                });
            }
            resolve(normalizedDevices);
            if (cb) {
                console.warn('module now uses promise based api - callback is deprecated');
                cb(null, normalizedDevices);
            }
        };

        if (window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.enumerateDevices) {
            window.navigator.mediaDevices.enumerateDevices().then(processDevices);
        } else if (window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
            window.MediaStreamTrack.getSources(processDevices);
        } else {
            var err = new Error('Device enumeration not supported.');
            err.kind = 'METHOD_NOT_AVAILABLE';
            reject(err);
            if (cb) {
                console.warn('module now uses promise based api - callback is deprecated');
                cb(err);
            }
        }
    });
};

},{}],6:[function(require,module,exports){
// getUserMedia helper by @HenrikJoreteg used for navigator.getUserMedia shim
var adapter = require('webrtc-adapter');

module.exports = function (constraints, cb) {
    var error;
    var haveOpts = arguments.length === 2;
    var defaultOpts = {video: true, audio: true};

    var denied = 'PermissionDeniedError';
    var altDenied = 'PERMISSION_DENIED';
    var notSatisfied = 'ConstraintNotSatisfiedError';

    // make constraints optional
    if (!haveOpts) {
        cb = constraints;
        constraints = defaultOpts;
    }

    // treat lack of browser support like an error
    if (typeof navigator === 'undefined' || !navigator.getUserMedia) {
        // throw proper error per spec
        error = new Error('MediaStreamError');
        error.name = 'NotSupportedError';

        // keep all callbacks async
        return setTimeout(function () {
            cb(error);
        }, 0);
    }

    // normalize error handling when no media types are requested
    if (!constraints.audio && !constraints.video) {
        error = new Error('MediaStreamError');
        error.name = 'NoMediaRequestedError';

        // keep all callbacks async
        return setTimeout(function () {
            cb(error);
        }, 0);
    }

    navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
        cb(null, stream);
    }).catch(function (err) {
        var error;
        // coerce into an error object since FF gives us a string
        // there are only two valid names according to the spec
        // we coerce all non-denied to "constraint not satisfied".
        if (typeof err === 'string') {
            error = new Error('MediaStreamError');
            if (err === denied || err === altDenied) {
                error.name = denied;
            } else {
                error.name = notSatisfied;
            }
        } else {
            // if we get an error object make sure '.name' property is set
            // according to spec: http://dev.w3.org/2011/webrtc/editor/getusermedia.html#navigatorusermediaerror-and-navigatorusermediaerrorcallback
            error = err;
            if (!error.name) {
                // this is likely chrome which
                // sets a property called "ERROR_DENIED" on the error object
                // if so we make sure to set a name
                if (error[denied]) {
                    err.name = denied;
                } else {
                    err.name = notSatisfied;
                }
            }
        }

        cb(error);
    });
};

},{"webrtc-adapter":33}],7:[function(require,module,exports){
const Output = require('./src/output.js')
const loop = require('raf-loop')
const Source = require('./src/hydra-source.js')
const GeneratorFactory = require('./src/GeneratorFactory.js')
const getUserMedia = require('getusermedia')
const mouse = require('mouse-change')()
const Audio = require('./src/audio.js')
const VidRecorder = require('./src/video-recorder.js')

// to do: add ability to pass in certain uniforms and transforms
class HydraSynth {

  constructor ({
    pb = null,
    width = 1280,
    height = 720,
    numSources = 4,
    numOutputs = 4,
    makeGlobal = true,
    autoLoop = true,
    detectAudio = true,
    enableStreamCapture = true,
    canvas
  } = {}) {

    this.bpm = 60
    this.pb = pb
    this.width = width
    this.height = height
    this.time = 0
    this.makeGlobal = makeGlobal
    this.renderAll = false
    this.detectAudio = detectAudio

    // boolean to store when to save screenshot
    this.saveFrame = false

    // if stream capture is enabled, this object contains the capture stream
    this.captureStream = null

    this._initCanvas(canvas)
    this._initRegl()
    this._initOutputs(numOutputs)
    this._initSources(numSources)
    this._generateGlslTransforms()

    window.screencap = () => {
      this.saveFrame = true
    }

    if (enableStreamCapture) {
      this.captureStream = this.canvas.captureStream(25)

      // to do: enable capture stream of specific sources and outputs
      window.vidRecorder = new VidRecorder(this.captureStream)
    }

    if(detectAudio) this._initAudio()
    //if(makeGlobal) {
      window.mouse = mouse
      window.time = this.time
      window['render'] = this.render.bind(this)
    //  window.bpm = this.bpm
      window.bpm = this._setBpm.bind(this)
  //  }
    if(autoLoop) loop(this.tick.bind(this)).start()
  }

  getScreenImage(callback) {
    this.imageCallback = callback
    this.saveFrame = true
  }

  canvasToImage (callback) {
    const a = document.createElement('a')
    a.style.display = 'none'

    let d = new Date()
    a.download = `hydra-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}.png`
    document.body.appendChild(a)
    var self = this
    this.canvas.toBlob( (blob) => {
      //  var url = window.URL.createObjectURL(blob)
        a.href = URL.createObjectURL(blob)
        console.log(a.href)
        a.click()
        if(self.imageCallback){
          self.imageCallback(blob)
          delete self.imageCallback
        }
    }, 'image/png')
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    }, 300);
  }

  _initAudio () {
    this.audio = new Audio({
      numBins: 4
    })
    if(this.makeGlobal) window.a = this.audio
  }
  // create main output canvas and add to screen
  _initCanvas (canvas) {
    if (canvas) {
      this.canvas = canvas
      this.width = canvas.width
      this.height = canvas.height
    } else {
      this.canvas = document.createElement('canvas')
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      document.body.appendChild(this.canvas)
    }
  }

  _initRegl () {
    this.regl = require('regl')({
      canvas: this.canvas,
      pixelRatio: 1,
      extensions: [
        'oes_texture_half_float',
        'oes_texture_half_float_linear'
      ],
      optionalExtensions: [
        'oes_texture_float',
        'oes_texture_float_linear'
      ]})

    // This clears the color buffer to black and the depth buffer to 1
    this.regl.clear({
      color: [0, 0, 0, 1]
    })

    this.renderAll = this.regl({
      frag: `
      precision mediump float;
      varying vec2 uv;
      uniform sampler2D tex0;
      uniform sampler2D tex1;
      uniform sampler2D tex2;
      uniform sampler2D tex3;

      void main () {
        vec2 st = vec2(1.0 - uv.x, uv.y);
        st*= vec2(2);
        vec2 q = floor(st).xy*(vec2(2.0, 1.0));
        int quad = int(q.x) + int(q.y);
        st.x += step(1., mod(st.y,2.0));
        st.y += step(1., mod(st.x,2.0));
        st = fract(st);
        if(quad==0){
          gl_FragColor = texture2D(tex0, st);
        } else if(quad==1){
          gl_FragColor = texture2D(tex1, st);
        } else if (quad==2){
          gl_FragColor = texture2D(tex2, st);
        } else {
          gl_FragColor = texture2D(tex3, st);
        }

      }
      `,
      vert: `
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;

      void main () {
        uv = position;
        gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
      }`,
      attributes: {
        position: [
          [-2, 0],
          [0, -2],
          [2, 2]
        ]
      },
      uniforms: {
        tex0: this.regl.prop('tex0'),
        tex1: this.regl.prop('tex1'),
        tex2: this.regl.prop('tex2'),
        tex3: this.regl.prop('tex3')
      },
      count: 3,
      depth: { enable: false }
    })

    this.renderFbo = this.regl({
      frag: `
      precision mediump float;
      varying vec2 uv;
      uniform vec2 resolution;
      uniform sampler2D tex0;

      void main () {
        gl_FragColor = texture2D(tex0, vec2(1.0 - uv.x, uv.y));
      }
      `,
      vert: `
      precision mediump float;
      attribute vec2 position;
      varying vec2 uv;

      void main () {
        uv = position;
        gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
      }`,
      attributes: {
        position: [
          [-2, 0],
          [0, -2],
          [2, 2]
        ]
      },
      uniforms: {
        tex0: this.regl.prop('tex0'),
        resolution: this.regl.prop('resolution')
      },
      count: 3,
      depth: { enable: false }
    })
  }

  _initOutputs (numOutputs) {
    const self = this
    this.o = (Array(numOutputs)).fill().map((el, index) => {
      var o = new Output({regl: this.regl, width: this.width, height: this.height})
      o.render()
      o.id = index
      if (self.makeGlobal) window['o' + index] = o
      return o
    })

    // set default output
    this.output = this.o[0]
  }

  _initSources (numSources) {
    this.s = []
    for(var i = 0; i < numSources; i++) {
      this.createSource()
    }
  }

  _setBpm(bpm) {
    this.bpm = bpm
  }

  createSource () {
    let s = new Source({regl: this.regl, pb: this.pb, width: this.width, height: this.height})
    if(this.makeGlobal) {
      window['s' + this.s.length] = s
    }
    this.s.push(s)
    return s
  }

  _generateGlslTransforms () {
    const self = this
    const gen = new GeneratorFactory(this.o[0])
    window.generator = gen
    Object.keys(gen.functions).forEach((key)=>{
      self[key] = gen.functions[key]
      if(self.makeGlobal === true) {
        window[key] = gen.functions[key]
      }
    })
  }

  render (output) {
    if (output) {
      this.output = output
      this.isRenderingAll = false
    } else {
      this.isRenderingAll = true
    }
  }

  tick (dt, uniforms) {

  //  if(self.detectAudio === true) self.fft = self.audio.frequencies()
  // this.regl.frame(function () {
    this.time += dt * 0.001
    // console.log(this.time)
    // this.regl.clear({
    //   color: [0, 0, 0, 1]
    // })
    window.time = this.time
    if(this.detectAudio === true) this.audio.tick()
    for (let i = 0; i < this.s.length; i++) {
      this.s[i].tick(this.time)
    }

    for (let i = 0; i < this.o.length; i++) {
    //  console.log('WIDTH', this.canvas.width, this.o[0].getCurrent())
      this.o[i].tick({
        time: this.time,
        mouse: mouse,
        bpm: this.bpm,
        resolution: [this.canvas.width, this.canvas.height]
      })
    }

    // console.log("looping", self.o[0].fbo)
    if (this.isRenderingAll) {
      this.renderAll({
        tex0: this.o[0].getCurrent(),
        tex1: this.o[1].getCurrent(),
        tex2: this.o[2].getCurrent(),
        tex3: this.o[3].getCurrent(),
        resolution: [this.canvas.width, this.canvas.height]
      })
    } else {
    //  console.log('out', self.output.id)
      this.renderFbo({
        tex0: this.output.getCurrent(),
        resolution: [this.canvas.width, this.canvas.height]
      })
    }
    if(this.saveFrame === true) {
      this.canvasToImage()
      this.saveFrame = false
    }
  }


}

module.exports = HydraSynth

},{"./src/GeneratorFactory.js":8,"./src/audio.js":9,"./src/hydra-source.js":13,"./src/output.js":16,"./src/video-recorder.js":20,"getusermedia":6,"mouse-change":24,"raf-loop":28,"regl":30}],8:[function(require,module,exports){
/* globals tex */
const { seq, sin, ramp, createFades } = require('./timingUtils.js')
const glslTransforms = require('./composable-glsl-functions.js')

// in progress: implementing multiple renderpasses within a single
// function string
const renderPassFunctions = require('./renderpass-functions.js')

const counter = require('./counter.js')
const shaderManager = require('./shaderManager.js')

var Generator = function (param) {
  return Object.create(Generator.prototype)
}

// Functions that return a new transformation function based on the existing function chain as well
// as the new function passed in.
const compositionFunctions = {
  coord: existingF => newF => x => existingF(newF(x)), // coord transforms added onto beginning of existing function chain
  color: existingF => newF => x => newF(existingF(x)), // color transforms added onto end of existing function chain
  combine: existingF1 => existingF2 => newF => x => newF(existingF1(x))(existingF2(x)), //
  combineCoord: existingF1 => existingF2 => newF => x => existingF1(newF(x)(existingF2(x)))
}
// gl_FragColor = osc(modulate(osc(rotate(st, 10., 0.), 32., 0.1, 0.), st, 0.5), 199., 0.1, 0.);

// hydra code: osc().rotate().color().repeat().out()
// pseudo shader code: gl_FragColor = color(osc(rotate(repeat())))

// hydra code: osc().rotate().add(s0).repeat().out()
// gl_FragColor = osc(rotate(repeat())) + tex(repeat())

// Parses javascript args to use in glsl
function generateGlsl (inputs) {
  var str = ''
  inputs.forEach((input) => {
    str += ', ' + input.name
  })
  return str
}

// when possible, reformats arguments to be the correct type
// creates unique names for variables requiring a uniform to be passed in (i.e. a texture)
// returns an object that contains the type and value of each argument
// to do: add much more type checking, validation, and transformation to this part
function formatArguments (userArgs, defaultArgs) {
  return defaultArgs.map((input, index) => {
    var typedArg = {}

    // if there is a user input at a certain index, create a uniform for this variable so that the value is passed in on each render pass
    // to do (possibly): check whether this is a function in order to only use uniforms when needed

    counter.increment()
    typedArg.name = input.name + counter.get()
    typedArg.isUniform = true

    if (userArgs.length > index) {
    //  console.log("arg", userArgs[index])
      typedArg.value = userArgs[index]
      // if argument passed in contains transform property, i.e. is of type generator, do not add uniform
      if (userArgs[index].transform) typedArg.isUniform = false

      if (typeof userArgs[index] === 'function') {
        typedArg.value = (context, props, batchId) => (userArgs[index](props))
      } else if (userArgs[index].constructor === Array) {
      //  console.log("is Array")
        typedArg.value = (context, props, batchId) => seq(userArgs[index])(props)
      }
    } else {
      // use default value for argument
      typedArg.value = input.default
    }
    // if input is a texture, set unique name for uniform
    if (input.type === 'texture') {
      // typedArg.tex = typedArg.value
      var x = typedArg.value
      typedArg.value = () => (x.getTexture())
    } else {
      // if passing in a texture reference, when function asks for vec4, convert to vec4
      if (typedArg.value.getTexture && input.type === 'vec4') {
        var x1 = typedArg.value
        typedArg.value = src(x1)
        typedArg.isUniform = false
      }
    }
    typedArg.type = input.type
    return typedArg
  })
}


var GeneratorFactory = function (defaultOutput) {

  let self = this
  self.functions = {}

  // set global utility functions. to do: make global optional
  window.sin = sin
  window.ramp = ramp
  window.frag = shaderManager(defaultOutput)

  createFades(6)
  // extend Array prototype
  Array.prototype.fast = function(speed) {
  //  console.log("array fast", speed, this)
    this.speed = speed
    return this
  }

  Object.keys(glslTransforms).forEach((method) => {
    const transform = glslTransforms[method]

    // if type is a source, create a new global generator function that inherits from Generator object
    if (transform.type === 'src') {
      self.functions[method] = (...args) => {
        var obj = Object.create(Generator.prototype)
        obj.name = method
        const inputs = formatArguments(args, transform.inputs)
        obj.transform = (x) => {
          var glslString = `${method}(${x}`
          glslString += generateGlsl(inputs)
          glslString += ')'
          return glslString
        }
        obj.defaultOutput = defaultOutput
        obj.uniforms = []
        inputs.forEach((input, index) => {
          if (input.isUniform) {
            obj.uniforms.push(input)
          }
        })

        obj.passes = []
        let pass = {
          transform: (x) => {
            var glslString = `${method}(${x}`
            glslString += generateGlsl(inputs)
            glslString += ')'
            return glslString
          },
          uniforms: []
        }
        inputs.forEach((input, index) => {
          if (input.isUniform) {
            pass.uniforms.push(input)
          }
        })
        obj.passes.push(pass)
        return obj
      }
    } else {
      Generator.prototype[method] = function (...args) {
        const inputs = formatArguments(args, transform.inputs)

        if (transform.type === 'combine' || transform.type === 'combineCoord') {
        // composition function to be executed when all transforms have been added
        // c0 and c1 are two inputs.. (explain more)
          var f = (c0) => (c1) => {
            var glslString = `${method}(${c0}, ${c1}`
            glslString += generateGlsl(inputs.slice(1))
            glslString += ')'
            return glslString
          }
          this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(inputs[0].value.transform)(f)

          this.uniforms = this.uniforms.concat(inputs[0].value.uniforms)

          var pass = this.passes[this.passes.length - 1]
          pass.transform = this.transform
          pass.uniform + this.uniform
        } else {
          var f1 = (x) => {
            var glslString = `${method}(${x}`
            glslString += generateGlsl(inputs)
            glslString += ')'
            return glslString
          }
          this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(f1)
          this.passes[this.passes.length - 1].transform = this.transform
        }

        inputs.forEach((input, index) => {
          if (input.isUniform) {
            this.uniforms.push(input)
          }
        })
        this.passes[this.passes.length - 1].uniforms = this.uniforms
        return this
      }
    }
  })
}

//
//   iterate through transform types and create a function for each
//
Generator.prototype.compile = function (pass) {
//  console.log("compiling", pass)
  var frag = `
  precision mediump float;
  ${pass.uniforms.map((uniform) => {
    let type = ''
    switch (uniform.type) {
      case 'float':
        type = 'float'
        break
      case 'texture':
        type = 'sampler2D'
        break
    }
    return `
      uniform ${type} ${uniform.name};`
  }).join('')}
  uniform float time;
  uniform vec2 resolution;
  varying vec2 uv;

  ${Object.values(glslTransforms).map((transform) => {
  //  console.log(transform.glsl)
    return `
            ${transform.glsl}
          `
  }).join('')}

  void main () {
    vec4 c = vec4(1, 0, 0, 1);
    //vec2 st = uv;
    vec2 st = gl_FragCoord.xy/resolution;
    gl_FragColor = ${pass.transform('st')};
  }
  `
  return frag
}

// creates a fragment shader from an object containing uniforms and a snippet of
// fragment shader code
Generator.prototype.compileRenderPass = function (pass) {
  var frag = `
      precision mediump float;
      ${pass.uniforms.map((uniform) => {
        let type = ''
        switch (uniform.type) {
          case 'float':
            type = 'float'
            break
          case 'texture':
            type = 'sampler2D'
            break
        }
        return `
          uniform ${type} ${uniform.name};`
      }).join('')}
      uniform float time;
      uniform vec2 resolution;
      uniform sampler2D prevBuffer;
      varying vec2 uv;

      ${Object.values(renderPassFunctions).filter(transform => transform.type === 'renderpass_util')
      .map((transform) => {
      //  console.log(transform.glsl)
        return `
                ${transform.glsl}
              `
      }).join('')}

      ${pass.glsl}
  `
  return frag
}

Generator.prototype.glsl = function () {
//  console.log(this.compile())
}

// functions for testing multiple render passes
// Generator.prototype.fragPass = function () {
// return `
//   precision mediump float;
//   uniform float time;
//   uniform vec2 resolution;
//   uniform sampler2D prevBuffer;
//   varying vec2 uv;
//
//   void main () {
//     vec4 c = vec4(1, 0, 0, 1);
//     //vec2 st = uv;
//     vec2 st = gl_FragCoord.xy/resolution;
//     vec4 col = texture2D(prevBuffer, fract(st));
//     gl_FragColor = vec4(col.r, 1.0, col.b, col.a);
//   }
//   `
// }
//
// Generator.prototype.fragPass2 = function () {
// return `
//   precision mediump float;
//   uniform float time;
//   uniform vec2 resolution;
//   uniform sampler2D prevBuffer;
//   varying vec2 uv;
//
//   void main () {
//     vec4 c = vec4(1, 0, 0, 1);
//     //vec2 st = uv;
//     vec2 st = gl_FragCoord.xy/resolution;
//     vec4 col = texture2D(prevBuffer, fract(st));
//     gl_FragColor = vec4(col.r - 1.0, col.g, col.b, col.a);
//   }
//   `
// }

Generator.prototype.out = function (_output) {
//  console.log('UNIFORMS', this.uniforms, output)
  var output = _output || this.defaultOutput
  // var pass = {
  //   glsl: renderPassFunctions['edges'].glsl,
  //   uniforms: []
  // }
  // var frag = this.compileRenderPass(pass)
  // console.log('shader', frag)
  //
  // this.passes.push({
  //   frag: frag,
  //   uniforms: pass.uniforms
  // })
  // this.passes.push({
  //   frag: this.fragPass2(),
  //   uniforms: []
  // })
  var passes = this.passes.map((pass) => {
    var uniforms = {}
    pass.uniforms.forEach((uniform) => { uniforms[uniform.name] = uniform.value })
    if(pass.hasOwnProperty('transform')){
    //  console.log(" rendering pass", pass)

      return {
        frag: this.compile(pass),
        uniforms: Object.assign(output.uniforms, uniforms)
      }
    } else {
    //  console.log(" not rendering pass", pass)
      return {
        frag: pass.frag,
        uniforms:  Object.assign(output.uniforms, uniforms)
      }
    }
  })

  // console.log("FRAG", frag)
  output.renderPasses(passes)
  //var frag = this.compile(this.passes[this.passes.length-1])
  //output.frag = frag
/*  var uniformObj = {}
  this.uniforms.forEach((uniform) => { uniformObj[uniform.name] = uniform.value })
  output.uniforms = Object.assign(output.uniforms, uniformObj)*/
//  output.render()
}

module.exports = GeneratorFactory

},{"./composable-glsl-functions.js":10,"./counter.js":11,"./renderpass-functions.js":17,"./shaderManager.js":18,"./timingUtils.js":19}],9:[function(require,module,exports){
const Meyda = require('meyda')
const getUserMedia = require('getusermedia')

class Audio {
  constructor ({
    numBins = 4,
    cutoff = 2,
    smooth = 0.4,
    max = 15,
    scale = 10,
    isDrawing = false
  }) {
    this.vol = 0
    this.scale = scale
    this.max = max
    this.cutoff = cutoff
    this.smooth = smooth
    this.setBins(numBins)

    // beat detection from: https://github.com/therewasaguy/p5-music-viz/blob/gh-pages/demos/01d_beat_detect_amplitude/sketch.js
    this.beat = {
      holdFrames: 20,
      threshold: 40,
      _cutoff: 0, // adaptive based on sound state
      decay: 0.98,
      _framesSinceBeat: 0 // keeps track of frames
    }

    this.onBeat = () => {
      console.log("beat")
    }

    this.canvas = document.createElement('canvas')
    this.canvas.width = 100
    this.canvas.height = 80
    this.canvas.style.width = "100px"
    this.canvas.style.height = "80px"
    this.canvas.style.position = 'absolute'
    this.canvas.style.right = '0px'
    this.canvas.style.bottom = '0px'
    document.body.appendChild(this.canvas)

    this.isDrawing = isDrawing
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle="#DFFFFF"
    this.ctx.strokeStyle="#0ff"
    this.ctx.lineWidth=0.5

    getUserMedia(
      {video: false, audio: true},
      (err, stream) => {
        if(err) {
          console.log('ERROR', err)
        } else {
          console.log('got mic stream', stream)
          this.stream = stream
          this.context = new AudioContext()
        //  this.context = new AudioContext()
          let audio_stream = this.context.createMediaStreamSource(stream)

          console.log(this.context)
          this.meyda = Meyda.createMeydaAnalyzer({
            audioContext: this.context,
            source: audio_stream,
            featureExtractors: [
              'loudness',
            //  'perceptualSpread',
            //  'perceptualSharpness',
            //  'spectralCentroid'
            ]
          })
        }
      })
  }

  detectBeat (level) {
    //console.log(level,   this.beat._cutoff)
    if (level > this.beat._cutoff && level > this.beat.threshold) {
      this.onBeat()
      this.beat._cutoff = level *1.2
      this.beat._framesSinceBeat = 0
    } else {
      if (this.beat._framesSinceBeat <= this.beat.holdFrames){
        this.beat._framesSinceBeat ++;
      } else {
        this.beat._cutoff *= this.beat.decay
        this.beat._cutoff = Math.max(  this.beat._cutoff, this.beat.threshold);
      }
    }
  }

  tick() {
   if(this.meyda){
     var features = this.meyda.get()
     if(features && features !== null){
       this.vol = features.loudness.total
       this.detectBeat(this.vol)
       // reduce loudness array to number of bins
       const reducer = (accumulator, currentValue) => accumulator + currentValue;
       let spacing = Math.floor(features.loudness.specific.length/this.bins.length)
       this.prevBins = this.bins.slice(0)
       this.bins = this.bins.map((bin, index) => {
         return features.loudness.specific.slice(index * spacing, (index + 1)*spacing).reduce(reducer)
       }).map((bin, index) => {
         // map to specified range

        // return (bin * (1.0 - this.smooth) + this.prevBins[index] * this.smooth)
          return (bin * (1.0 - this.settings[index].smooth) + this.prevBins[index] * this.settings[index].smooth)
       })
       // var y = this.canvas.height - scale*this.settings[index].cutoff
       // this.ctx.beginPath()
       // this.ctx.moveTo(index*spacing, y)
       // this.ctx.lineTo((index+1)*spacing, y)
       // this.ctx.stroke()
       //
       // var yMax = this.canvas.height - scale*(this.settings[index].scale + this.settings[index].cutoff)
       this.fft = this.bins.map((bin, index) => (
        // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
         Math.max(0, (bin - this.settings[index].cutoff)/this.settings[index].scale)
       ))
       if(this.isDrawing) this.draw()
     }
   }
  }

  setCutoff (cutoff) {
    this.cutoff = cutoff
    this.settings = this.settings.map((el) => {
      el.cutoff = cutoff
      return el
    })
  }

  setSmooth (smooth) {
    this.smooth = smooth
    this.settings = this.settings.map((el) => {
      el.smooth = smooth
      return el
    })
  }

  setBins (numBins) {
    this.bins = Array(numBins).fill(0)
    this.prevBins = Array(numBins).fill(0)
    this.fft = Array(numBins).fill(0)
    this.settings = Array(numBins).fill(0).map(() => ({
      cutoff: this.cutoff,
      scale: this.scale,
      smooth: this.smooth
    }))
    // to do: what to do in non-global mode?
    this.bins.forEach((bin, index) => {
      window['a' + index] = (scale = 1, offset = 0) => () => (a.fft[index] * scale + offset)
    })
    console.log(this.settings)
  }

  setScale(scale){
    this.scale = scale
    this.settings = this.settings.map((el) => {
      el.scale = scale
      return el
    })
  }

  setMax(max) {
    this.max = max
    console.log('set max is deprecated')
  }
  hide() {
    this.isDrawing = false
    this.canvas.style.display = 'none'
  }

  show() {
    this.isDrawing = true
    this.canvas.style.display = 'block'

  }

  draw () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    var spacing = this.canvas.width / this.bins.length
    var scale = this.canvas.height / (this.max * 2)
  //  console.log(this.bins)
    this.bins.forEach((bin, index) => {

      var height = bin * scale

     this.ctx.fillRect(index * spacing, this.canvas.height - height, spacing, height)

  //   console.log(this.settings[index])
     var y = this.canvas.height - scale*this.settings[index].cutoff
     this.ctx.beginPath()
     this.ctx.moveTo(index*spacing, y)
     this.ctx.lineTo((index+1)*spacing, y)
     this.ctx.stroke()

     var yMax = this.canvas.height - scale*(this.settings[index].scale + this.settings[index].cutoff)
     this.ctx.beginPath()
     this.ctx.moveTo(index*spacing, yMax)
     this.ctx.lineTo((index+1)*spacing, yMax)
     this.ctx.stroke()
    })


    /*var y = this.canvas.height - scale*this.cutoff
    this.ctx.beginPath()
    this.ctx.moveTo(0, y)
    this.ctx.lineTo(this.canvas.width, y)
    this.ctx.stroke()

    var yMax = this.canvas.height - scale*this.max
    this.ctx.beginPath()
    this.ctx.moveTo(0, yMax)
    this.ctx.lineTo(this.canvas.width, yMax)
    this.ctx.stroke()*/
  }
}

module.exports = Audio

},{"getusermedia":6,"meyda":23}],10:[function(require,module,exports){
// to add: ripple: https://www.shadertoy.com/view/4djGzz
// mask
// convolution
// basic sdf shapes
// repeat
// iq color palletes

module.exports = {

  _noise: {
    type: 'util',
    glsl: `
    //	Simplex 3D Noise
    //	by Ian McEwan, Ashima Arts
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float _noise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
    `
  },
  noise: {
    type: 'src',
    inputs: [
      {
        type: 'float',
        name: 'scale',
        default: 10
      },
      {
        type: 'float',
        name: 'offset',
        default : 0.1
      }
    ],
    glsl: `vec4 noise(vec2 st, float scale, float offset){
      return vec4(vec3(_noise(vec3(st*scale, offset*time))), 1.0);
    }`
  },
  voronoi: {
    type: 'src',
    inputs: [
      {
        type: 'float',
        name: 'scale',
        default: 5
      },
      {
        type: 'float',
        name: 'speed',
        default : 0.3
      },
      {
        type: 'float',
        name: 'blending',
        default : 0.3
      }
    ],
    notes: 'from https://thebookofshaders.com/edit.php#12/vorono-01.frag, https://www.shadertoy.com/view/ldB3zc',
    glsl: `vec4 voronoi(vec2 st, float scale, float speed, float blending) {
      vec3 color = vec3(.0);

   // Scale
   st *= scale;

   // Tile the space
   vec2 i_st = floor(st);
   vec2 f_st = fract(st);

   float m_dist = 10.;  // minimun distance
   vec2 m_point;        // minimum point

   for (int j=-1; j<=1; j++ ) {
       for (int i=-1; i<=1; i++ ) {
           vec2 neighbor = vec2(float(i),float(j));
           vec2 p = i_st + neighbor;
           vec2 point = fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
           point = 0.5 + 0.5*sin(time*speed + 6.2831*point);
           vec2 diff = neighbor + point - f_st;
           float dist = length(diff);

           if( dist < m_dist ) {
               m_dist = dist;
               m_point = point;
           }
       }
   }

   // Assign a color using the closest point position
   color += dot(m_point,vec2(.3,.6));
 color *= 1.0 - blending*m_dist;
   return vec4(color, 1.0);
    }`
  },
  osc: {
    type: 'src',
    inputs: [
      {
        name: 'frequency',
        type: 'float',
        default: 60.0
      },
      {
        name: 'sync',
        type: 'float',
        default: 0.1
      },
      {
        name: 'offset',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec4 osc(vec2 _st, float freq, float sync, float offset){
            vec2 st = _st;
            float r = sin((st.x-offset/freq+time*sync)*freq)*0.5  + 0.5;
            float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
            float b = sin((st.x+offset/freq+time*sync)*freq)*0.5  + 0.5;
            return vec4(r, g, b, 1.0);
          }`
  },
  shape: {
    type: 'src',
    inputs: [
      {
        name: 'sides',
        type: 'float',
        default: 3.0
      },
      {
        name: 'radius',
        type: 'float',
        default: 0.3
      },
      {
        name: 'smoothing',
        type: 'float',
        default: 0.01
      }
    ],
    glsl: `vec4 shape(vec2 _st, float sides, float radius, float smoothing){
      vec2 st = _st * 2. - 1.;
      // Angle and radius from the current pixel
      float a = atan(st.x,st.y)+3.1416;
      float r = (2.*3.1416)/sides;
      float d = cos(floor(.5+a/r)*r-a)*length(st);
      return vec4(vec3(1.0-smoothstep(radius,radius + smoothing,d)), 1.0);
    }`
  },
  gradient: {
    type: 'src',
    inputs: [
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec4 gradient(vec2 _st, float speed) {
      return vec4(_st, sin(time*speed), 1.0);
    }
    `
  },
  src: {
    type: 'src',
    inputs: [
      {
        name: 'tex',
        type: 'texture'
      }
    ],
    glsl: `vec4 src(vec2 _st, sampler2D _tex){
    //  vec2 uv = gl_FragCoord.xy/vec2(1280., 720.);
      return texture2D(_tex, fract(_st));
    }`
  },
  solid: {
    type: 'src',
    inputs: [
      {
        name: 'r',
        type: 'float',
        default: 0.0
      },
      {
        name: 'g',
        type: 'float',
        default: 0.0
      },
      {
        name: 'b',
        type: 'float',
        default: 0.0
      },
      {
        name: 'a',
        type: 'float',
        default: 1.0
      }
    ],
    notes: '',
    glsl: `vec4 solid(vec2 uv, float _r, float _g, float _b, float _a){
      return vec4(_r, _g, _b, _a);
    }`
  },
  rotate: {
    type: 'coord',
    inputs: [
      {
        name: 'angle',
        type: 'float',
        default: 10.0
      }, {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 rotate(vec2 st, float _angle, float speed){
              vec2 xy = st - vec2(0.5);
              float angle = _angle + speed *time;
              xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
              xy += 0.5;
              return xy;
          }`
  },
  scale: {
    type: 'coord',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 1.5
      },
      {
        name: 'xMult',
        type: 'float',
        default: 1.0
      },
      {
        name: 'yMult',
        type: 'float',
        default: 1.0
      }
    ],
    glsl: `vec2 scale(vec2 st, float amount, float xMult, float yMult){
      vec2 xy = st - vec2(0.5);
      xy*=(1.0/vec2(amount*xMult, amount*yMult));
      xy+=vec2(0.5);
      return xy;
    }
    `
  },
  pixelate: {
    type: 'coord',
    inputs: [
      {
        name: 'pixelX',
        type: 'float',
        default: 20
      }, {
        name: 'pixelY',
        type: 'float',
        default: 20
      }
    ],
    glsl: `vec2 pixelate(vec2 st, float pixelX, float pixelY){
      vec2 xy = vec2(pixelX, pixelY);
      return (floor(st * xy) + 0.5)/xy;
    }`
  },
  posterize: {
    type: 'color',
    inputs: [
      {
        name: 'bins',
        type: 'float',
        default: 3.0
      },
      {
        name: 'gamma',
        type: 'float',
        default: 0.6
      }
    ],
    glsl: `vec4 posterize(vec4 c, float bins, float gamma){
      vec4 c2 = pow(c, vec4(gamma));
      c2 *= vec4(bins);
      c2 = floor(c2);
      c2/= vec4(bins);
      c2 = pow(c2, vec4(1.0/gamma));
      return vec4(c2.xyz, c.a);
    }`
  },
  shift: {
    type: 'color',
    inputs: [
      {
        name: 'r',
        type: 'float',
        default: 0.5
      },
      {
        name: 'g',
        type: 'float',
        default: 0.0
      },
      {
        name: 'b',
        type: 'float',
        default: 0.0
      },
      {
        name: 'a',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec4 shift(vec4 c, float r, float g, float b, float a){
      vec4 c2 = vec4(c);
      c2.r = fract(c2.r + r);
      c2.g = fract(c2.g + g);
      c2.b = fract(c2.b + b);
      c2.a = fract(c2.a + a);
      return vec4(c2.rgba);
    }
    `
  },
  repeat: {
    type: 'coord',
    inputs: [
      {
        name: 'repeatX',
        type: 'float',
        default: 3.0
      },
      {
        name: 'repeatY',
        type: 'float',
        default: 3.0
      },
      {
        name: 'offsetX',
        type: 'float',
        default: 0.0
      },
      {
        name: 'offsetY',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 repeat(vec2 _st, float repeatX, float repeatY, float offsetX, float offsetY){
        vec2 st = _st * vec2(repeatX, repeatY);
        st.x += step(1., mod(st.y,2.0)) * offsetX;
        st.y += step(1., mod(st.x,2.0)) * offsetY;
        return fract(st);
    }`
  },
  modulateRepeat: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'repeatX',
        type: 'float',
        default: 3.0
      },
      {
        name: 'repeatY',
        type: 'float',
        default: 3.0
      },
      {
        name: 'offsetX',
        type: 'float',
        default: 0.5
      },
      {
        name: 'offsetY',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec2 modulateRepeat(vec2 _st, vec4 c1, float repeatX, float repeatY, float offsetX, float offsetY){
        vec2 st = _st * vec2(repeatX, repeatY);
        st.x += step(1., mod(st.y,2.0)) + c1.r * offsetX;
        st.y += step(1., mod(st.x,2.0)) + c1.g * offsetY;
        return fract(st);
    }`
  },
  repeatX: {
    type: 'coord',
    inputs: [
      {
        name: 'reps',
        type: 'float',
        default: 3.0
      }, {
          name: 'offset',
          type: 'float',
          default: 0.0
        }
    ],
    glsl: `vec2 repeatX(vec2 _st, float reps, float offset){
      vec2 st = _st * vec2(reps, 1.0);
    //  float f =  mod(_st.y,2.0);

      st.y += step(1., mod(st.x,2.0))* offset;
      return fract(st);
    }`
  },
  modulateRepeatX: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'reps',
        type: 'float',
        default: 3.0
      },
      {
          name: 'offset',
          type: 'float',
          default: 0.5
      }
    ],
    glsl: `vec2 modulateRepeatX(vec2 _st, vec4 c1, float reps, float offset){
      vec2 st = _st * vec2(reps, 1.0);
    //  float f =  mod(_st.y,2.0);
      st.y += step(1., mod(st.x,2.0)) + c1.r * offset;

      return fract(st);
    }`
  },
  repeatY: {
    type: 'coord',
    inputs: [
      {
        name: 'reps',
        type: 'float',
        default: 3.0
      }, {
        name: 'offset',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 repeatY(vec2 _st, float reps, float offset){
      vec2 st = _st * vec2(1.0, reps);
    //  float f =  mod(_st.y,2.0);
      st.x += step(1., mod(st.y,2.0))* offset;
      return fract(st);
    }`
  },
  modulateRepeatY: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'reps',
        type: 'float',
        default: 3.0
      },
      {
        name: 'offset',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec2 modulateRepeatY(vec2 _st, vec4 c1, float reps, float offset){
      vec2 st = _st * vec2(reps, 1.0);
    //  float f =  mod(_st.y,2.0);
      st.x += step(1., mod(st.y,2.0)) + c1.r * offset;
      return fract(st);
    }`
  },
  kaleid: {
    type: 'coord',
    inputs: [
      {
        name: 'nSides',
        type: 'float',
        default: 4.0
      }
    ],
    glsl: `vec2 kaleid(vec2 st, float nSides){
      st -= 0.5;
      float r = length(st);
      float a = atan(st.y, st.x);
      float pi = 2.*3.1416;
      a = mod(a,pi/nSides);
      a = abs(a-pi/nSides/2.);
      return r*vec2(cos(a), sin(a));
    }`
  },
  modulateKaleid: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'nSides',
        type: 'float',
        default: 4.0
      }
    ],
    glsl: `vec2 modulateKaleid(vec2 st, vec4 c1, float nSides){
      st -= 0.5;
      float r = length(st);
      float a = atan(st.y, st.x);
      float pi = 2.*3.1416;
      a = mod(a,pi/nSides);
      a = abs(a-pi/nSides/2.);
      return (c1.r+r)*vec2(cos(a), sin(a));
    }`
  },
  scrollX: {
    type: 'coord',
    inputs: [
      {
        name: 'scrollX',
        type: 'float',
        default: 0.5
      },
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 scrollX(vec2 st, float amount, float speed){
      st.x += amount + time*speed;
      return fract(st);
    }`
  },
  modulateScrollX: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'scrollX',
        type: 'float',
        default: 0.5
      },
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 modulateScrollX(vec2 st, vec4 c1, float amount, float speed){
      st.x += c1.r*amount + time*speed;
      return fract(st);
    }`
  },
  scrollY: {
    type: 'coord',
    inputs: [
      {
        name: 'scrollY',
        type: 'float',
        default: 0.5
      },
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 scrollY(vec2 st, float amount, float speed){
      st.y += amount + time*speed;
      return fract(st);
    }`
  },
  modulateScrollY: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'scrollY',
        type: 'float',
        default: 0.5
      },
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 modulateScrollY(vec2 st, vec4 c1, float amount, float speed){
      st.y += c1.r*amount + time*speed;
      return fract(st);
    }`
  },
  add: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec4 add(vec4 c0, vec4 c1, float amount){
            return (c0+c1)*amount + c0*(1.0-amount);
          }`
  },
  layer: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      }
    ],
    glsl: `vec4 layer(vec4 c0, vec4 c1){
        return vec4(mix(c0.rgb, c1.rgb, c1.a), c0.a+c1.a);
    }
    `
  },
  blend: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec4 blend(vec4 c0, vec4 c1, float amount){
      return c0*(1.0-amount)+c1*amount;
    }`
  },
  mult: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 1.0
      }
    ],
    glsl: `vec4 mult(vec4 c0, vec4 c1, float amount){
      return c0*(1.0-amount)+(c0*c1)*amount;
    }`
  },

  diff: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      }
    ],
    glsl: `vec4 diff(vec4 c0, vec4 c1){
      return vec4(abs(c0.rgb-c1.rgb), max(c0.a, c1.a));
    }
    `
  },

  modulate: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.1
      }
    ],
    glsl: `vec2 modulate(vec2 st, vec4 c1, float amount){
          //  return fract(st+(c1.xy-0.5)*amount);
              return st + c1.xy*amount;
          }`
  },
  modulateScale: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'multiple',
        type: 'float',
        default: 1.0
      },
      {
        name: 'offset',
        type: 'float',
        default: 1.0
      }
    ],
    glsl: `vec2 modulateScale(vec2 st, vec4 c1, float multiple, float offset){
      vec2 xy = st - vec2(0.5);
      xy*=(1.0/vec2(offset + multiple*c1.r, offset + multiple*c1.g));
      xy+=vec2(0.5);
      return xy;
    }`
  },
  modulatePixelate: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'multiple',
        type: 'float',
        default: 10.0
      },
      {
        name: 'offset',
        type: 'float',
        default: 3.0
      }
    ],
    glsl: `vec2 modulatePixelate(vec2 st, vec4 c1, float multiple, float offset){
      vec2 xy = vec2(offset + c1.x*multiple, offset + c1.y*multiple);
      return (floor(st * xy) + 0.5)/xy;
    }`
  },
  modulateRotate: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'multiple',
        type: 'float',
        default: 1.0
      },
      {
        name: 'offset',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 modulateRotate(vec2 st, vec4 c1, float multiple, float offset){
        vec2 xy = st - vec2(0.5);
        float angle = offset + c1.x * multiple;
        xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
        xy += 0.5;
        return xy;
    }`
  },
  modulateHue: {
    type: 'combineCoord',
    notes: 'changes coordinates based on hue of second input. Based on: https://www.shadertoy.com/view/XtcSWM',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 1.0
      }
    ],
    glsl: `vec2 modulateHue(vec2 st, vec4 c1, float amount){

            return st + (vec2(c1.g - c1.r, c1.b - c1.g) * amount * 1.0/resolution);
          }`
  },
  invert: {
    type: 'color',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 1.0
      }
    ],
    glsl: `vec4 invert(vec4 c0, float amount){
      return vec4((1.0-c0.rgb)*amount + c0.rgb*(1.0-amount), c0.a);
    }`
  },
  contrast: {
    type: 'color',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 1.6
      }
    ],
    glsl: `vec4 contrast(vec4 c0, float amount) {
      vec4 c = (c0-vec4(0.5))*vec4(amount) + vec4(0.5);
      return vec4(c.rgb, c0.a);
    }
    `
  },
  brightness: {
    type: 'color',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 0.4
      }
    ],
    glsl: `vec4 brightness(vec4 c0, float amount){
      return vec4(c0.rgb + vec3(amount), c0.a);
    }
    `
  },
  luminance: {
    type: 'util',
    glsl: `float luminance(vec3 rgb){
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`
  },
  mask: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      }
    ],
    glsl: `vec4 mask(vec4 c0, vec4 c1){
      float a = luminance(c1.rgb);
      return vec4(c0.rgb*a, a);
    }`
  },
  luma: {
    type: 'color',
    inputs: [
      {
        name: 'threshold',
        type: 'float',
        default: 0.5
      },
      {
        name: 'tolerance',
        type: 'float',
        default: 0.1
      }
    ],
    glsl: `vec4 luma(vec4 c0, float threshold, float tolerance){
      float a = smoothstep(threshold-tolerance, threshold+tolerance, luminance(c0.rgb));
      return vec4(c0.rgb*a, a);
    }`
  },
  thresh: {
    type: 'color',
    inputs: [
      {
        name: 'threshold',
        type: 'float',
        default: 0.5
      }, {
        name: 'tolerance',
        type: 'float',
        default: 0.04
      }
    ],
    glsl: `vec4 thresh(vec4 c0, float threshold, float tolerance){
      return vec4(vec3(smoothstep(threshold-tolerance, threshold+tolerance, luminance(c0.rgb))), c0.a);
    }`
  },
  color: {
    type: 'color',
    inputs: [
      {
        name: 'r',
        type: 'float',
        default: 1.0
      },
      {
        name: 'g',
        type: 'float',
        default: 1.0
      },
      {
        name: 'b',
        type: 'float',
        default: 1.0
      }
    ],
    notes: 'https://www.youtube.com/watch?v=FpOEtm9aX0M',
    glsl: `vec4 color(vec4 c0, float _r, float _g, float _b){
      vec3 c = vec3(_r, _g, _b);
      vec3 pos = step(0.0, c); // detect whether negative

      // if > 0, return r * c0
      // if < 0 return (1.0-r) * c0
      return vec4(mix((1.0-c0.rgb)*abs(c), c*c0.rgb, pos), c0.a);
    }`
  },
  _rgbToHsv: {
    type: 'util',
    glsl: `vec3 _rgbToHsv(vec3 c){
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`
  },
  _hsvToRgb: {
    type: 'util',
    glsl: `vec3 _hsvToRgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }`
  },
  saturate: {
    type: 'color',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 2.0
      }
    ],
    glsl: `vec4 saturate(vec4 c0, float amount){
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
      vec3 intensity = vec3(dot(c0.rgb, W));
      return vec4(mix(intensity, c0.rgb, amount), c0.a);
    }`
  },
  hue: {
    type: 'color',
    inputs: [
      {
        name: 'hue',
        type: 'float',
        default: 0.4
      }
    ],
    glsl: `vec4 hue(vec4 c0, float hue){
      vec3 c = _rgbToHsv(c0.rgb);
      c.r += hue;
    //  c.r = fract(c.r);
      return vec4(_hsvToRgb(c), c0.a);
    }`
  },
  colorama: {
    type: 'color',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 0.005
      }
    ],
    glsl: `vec4 colorama(vec4 c0, float amount){
      vec3 c = _rgbToHsv(c0.rgb);
      c += vec3(amount);
      c = _hsvToRgb(c);
      c = fract(c);
      return vec4(c, c0.a);
    }`
  }
}

},{}],11:[function(require,module,exports){
// singleton class that generates ids to use has unique variable names for variables
// counter.js

let value = 0

module.exports = {
  increment: () => value++,
  get: () => value
}

},{}],12:[function(require,module,exports){
module.exports = {
  src: {
    transformType: 'color',
    isSource: true,
    inputs: [{
      name: 'src',
      type: 'image'
    }],
    fragBody: `
      c = texture2D(<0>, st);
    `
  },
  invert: {
    transformType: 'color',
    fragBody: `
      c = 1.0-c;
      c = vec4(c.xyz, 1.0);
    `
  },
  osc: {
    transformType: 'color',
    isSource: true,
    inputs: [
      {
        name: 'frequency',
        type: 'float',
        default: 60
      },
      {
        name: 'sync',
        type: 'float',
        default: 0.1
      },
      {
        name: 'offset',
        type: 'float',
        default: 0.0
      }
    ],
    fragBody: `
      float r<0> = sin((st.x-<2>/100.+time*<1>)*<0>)*0.5 + 0.5;
      float g<0> = sin((st.x+time*<1>)*<0>)*0.5 + 0.5;
      float b<0> = sin((st.x+<2>/100.+time*<1>)*<0>)*0.5 + 0.5;
      c = vec4(r<0>, g<0>, b<0>, 1.0);
    `
  },
  blend: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      },
      {
        name: 'blendAmount',
        type: 'float',
        default: 0.4
      }
    ],
    fragBody: `
      c*=(1.0-<1>);
      c+= texture2D(<0>, uv)*<1>;
    `
  },
  mult: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      },
      {
        name: 'amount',
        type: 'float',
        default: 1.0
      }
    ],
    fragBody: `
      vec4 c<1> = c*(texture2D(<0>, uv));
      c*=(1.0-<1>);
      c+= c<1>*<1>;
    `
  },
  add: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      }
    ],
    fragBody: `
      c += texture2D(<0>, uv);
    `
  },
  diff: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      }
    ],
    fragBody: `
      c -= texture2D(<0>, uv);
      c = vec4(abs(c).xyz, 1.0);
    `
  },
  scale: {
    transformType: 'coord',
    inputs: [
      {
        name: 'scaleAmount',
        type: 'float',
        default: 1.5
      }
    ],
    fragBody: `
      st = vec2(1.0/<0>)*st;
    `
  },
  pixelate: {
    transformType: 'coord',
    inputs: [
      {
        name: 'pixelX',
        type: 'float',
        default: 20
      }, {
        name: 'pixelY',
        type: 'float',
        default: 20
      }
    ],
    fragBody: `
      st *= vec2(<0>, <1>);
      st = floor(st) + 0.5;
      st /= vec2(<0>, <1>);
    `
  },
  contrast: {
    transformType: 'color',
    inputs: [
      {
        name: 'contrast',
        type: 'float',
        default: 1.6
      }
    ],
    fragBody: `
      c = (c-vec4(0.5))*<0> + vec4(0.5);
      c = vec4(c.xyz, 1.0);
    `
  },
  kaleid: {
    transformType: 'coord',
    inputs: [
      {
        name: 'nSides',
        type: 'float',
        default: 4.0
      }
    ],
    fragBody: `
      st -= 0.5;
      float r<0> = length(st);
      float a<0> = atan(st.y, st.x);
      float pi<0> = 2.*3.1416;
      a<0> = mod(a<0>, pi<0>/<0>);
      a<0> = abs(a<0>-pi<0>/<0>/2.);
      st = r<0>*vec2(cos(a<0>), sin(a<0>));
    `
  },
  brightness: {
    transformType: 'color',
    inputs: [
      {
        name: 'brightness',
        type: 'float',
        default: 0.4
      }
    ],
    fragBody: `
      c = vec4(c.xyz + vec3(<0>), 1.0);
    `
  },
  posterize: {
    transformType: 'color',
    inputs: [
      {
        name: 'bins',
        type: 'float',
        default: 3.0
      },
      {
        name: 'gamma',
        type: 'float',
        default: 0.6
      }
    ],
    fragBody: `
      c = pow(c, vec4(<1>));
      c*=vec4(<0>);
      c = floor(c);
      c/=vec4(<0>);
      c = pow(c, vec4(1.0/<1>));
      c = vec4(c.xyz, 1.0);
    `
  },
  modulate: {
    transformType: 'coord',
    inputs: [
      {
        name: 'src',
        type: 'image'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.1
      }
    ],
    fragBody: `
      st += texture2D(<0>, uv).xy*<1>;
    `
  },

  color: {
    transformType: 'color',
    inputs: [{
      name: 'color',
      type: 'color',
      default: [1.0, 0.5, 0.0]
    }],
    fragBody: `
      c.rgb = c.rgb*<0>;
      c = vec4(c.rgb, 1.0);
    `
  },
  gradient: {
    transformType: 'color',
    isSource: true,
    fragBody: `
      c = vec4(st, sin(time), 1.0);
    `
  },
  scrollX: {
    transformType: 'coord',
    inputs: [
      {
        name: 'scrollX',
        type: 'float',
        default: 0.5
      },
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    fragBody: `
      st.x += <0> + time*<1>;
      st = fract(st);
    `
  },
  repeatX: {
    transformType: 'coord',
    inputs: [
      {
        name: 'repeatX',
        type: 'float',
        default: 3.0
      }, {
        name: 'offsetX',
        type: 'float',
        default: 0.0
      }
    ],
    fragBody: `
      st*= vec2(<0>, 1.0);
      st.x += step(1., mod(st.y,2.0)) * <1>;
      st = fract(st);
      `
  },
  repeatY: {
    transformType: 'coord',
    inputs: [
      {
        name: 'repeatY',
        type: 'float',
        default: 3.0
      }, {
        name: 'offsetY',
        type: 'float',
        default: 0.0
      }
    ],
    fragBody: `
      st*= vec2(1.0, <0>);
      st.y += step(1., mod(st.x,2.0)) * <1>;
      st = fract(st);
      `
  },
  repeat: {
    transformType: 'coord',
    inputs: [
      {
        name: 'repeatX',
        type: 'float',
        default: 3.0
      },
      {
        name: 'repeatY',
        type: 'float',
        default: 3.0
      },
      {
        name: 'offsetX',
        type: 'float',
        default: 0.0
      },
      {
        name: 'offsetY',
        type: 'float',
        default: 0.0
      }
    ],
    fragBody: `
      st*= vec2(<0>, <1>);
      st.x += step(1., mod(st.y,2.0)) * <2>;
      st.y += step(1., mod(st.x,2.0)) * <3>;
      st = fract(st);
      `
  },
  rotate: {
    transformType: 'coord',
    inputs: [
      {
        name: 'angle',
        type: 'float',
        default: 10.0
      }, {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    fragBody: `
      st -= vec2(0.5);
      float angle<0> = <0> + <1>*time;
      st = mat2(cos(angle<0>),-sin(angle<0>), sin(angle<0>),cos(angle<0>))*st;
      st += vec2(0.5);
    `
  }
}

},{}],13:[function(require,module,exports){
const Webcam = require('./webcam.js')
const Screen = require('./lib/screenmedia.js')

class HydraSource  {

  constructor (opts) {
    this.regl = opts.regl
    this.src = null
    this.dynamic = true
    this.width = opts.width
    this.height = opts.height
    this.tex = this.regl.texture({
      shape: [opts.width, opts.height]
    })
    this.pb = opts.pb
  }

  init (opts) {
    if (opts.src) {
      this.src = opts.src
      this.tex = this.regl.texture(this.src)
    }
    if(opts.dynamic) this.dynamic = opts.dynamic
  }

  initCam (index) {
    const self = this
    Webcam(index).then((response) => {
      self.src = response.video
      self.tex = self.regl.texture(self.src)
    })
  }

  initStream (streamName) {
    console.log("initing stream!", streamName)
    let self = this
    if (streamName && this.pb) {
        this.pb.initSource(streamName)

        this.pb.on("got video", function(nick, video){
          if(nick === streamName) {
            self.src = video
            self.tex = self.regl.texture(self.src)
          }
        })

    }
  }

  initScreen () {
    const self = this
    Screen().then(function (response) {
       self.src = response.video
       self.tex = self.regl.texture(self.src)
     //  console.log("received screen input")
     })
  }

  clear () {
    this.src = null
    this.tex = this.regl.texture({
      shape: [this.width, this.height]
    })
  }

  tick (time) {
  //  console.log("src", src)
    if (this.src !== null && this.dynamic === true) {
        //this.tex.subimage(this.src)
       this.tex = this.regl.texture(this.src)
    }
  }

  getTexture () {
    return this.tex
  }
}

module.exports = HydraSource

},{"./lib/screenmedia.js":15,"./webcam.js":21}],14:[function(require,module,exports){
var adapter = require('webrtc-adapter');
// to do: clean up this code
// cache for constraints and callback
var cache = {};

module.exports = function (constraints, cb) {
    var hasConstraints = arguments.length === 2;
    var callback = hasConstraints ? cb : constraints;
    var error;

    if (typeof window === 'undefined' || window.location.protocol === 'http:') {
        error = new Error('NavigatorUserMediaError');
        error.name = 'HTTPS_REQUIRED';
        return callback(error);
    }

    if (window.navigator.userAgent.match('Chrome')) {
      
        var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10);
        var maxver = 33;

        // check whether running in electron
        if (window && window.process && window.process.type) {
          constraints = (hasConstraints && constraints) || {audio: false, video: {
              mandatory: {
                  chromeMediaSource: 'desktop',
                  maxWidth: window.screen.width,
                  maxHeight: window.screen.height,
                  maxFrameRate: 3
              }
          }};


          console.log("running in electron" , constraints)
        //  constraints.video.mandatory.chromeMediaSourceId = data.sourceId;
          window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
              callback(null, stream);
          }).catch(function (err) {
              callback(err);
          })
        } else {
          var isCef = !window.chrome.webstore;
        // "known" crash in chrome 34 and 35 on linux
          if (window.navigator.userAgent.match('Linux')) maxver = 35;

        // check that the extension is installed by looking for a
        // sessionStorage variable that contains the extension id
        // this has to be set after installation unless the contest
        // script does that
          if (sessionStorage.getScreenMediaJSExtensionId) {
              chrome.runtime.sendMessage(sessionStorage.getScreenMediaJSExtensionId,
                  {type:'getScreen', id: 1}, null,
                  function (data) {
                      console.log("getting screen", data)
                      if (!data || data.sourceId === '') { // user canceled
                          var error = new Error('NavigatorUserMediaError');
                          error.name = 'NotAllowedError';
                          callback(error);
                      } else {
                          constraints = (hasConstraints && constraints) || {audio: false, video: {
                              mandatory: {
                                  chromeMediaSource: 'desktop',
                                  maxWidth: window.screen.width,
                                  maxHeight: window.screen.height,
                                  maxFrameRate: 3
                              }
                          }};


                          console.log("constriants", constraints)
                          constraints.video.mandatory.chromeMediaSourceId = data.sourceId;
                          window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                              callback(null, stream);
                          }).catch(function (err) {
                              callback(err);
                          });
                      }
                  }
              );
          } else if (window.cefGetScreenMedia) {
              //window.cefGetScreenMedia is experimental - may be removed without notice
              window.cefGetScreenMedia(function(sourceId) {
                  if (!sourceId) {
                      var error = new Error('cefGetScreenMediaError');
                      error.name = 'CEF_GETSCREENMEDIA_CANCELED';
                      callback(error);
                  } else {
                      constraints = (hasConstraints && constraints) || {audio: false, video: {
                          mandatory: {
                              chromeMediaSource: 'desktop',
                              maxWidth: window.screen.width,
                              maxHeight: window.screen.height,
                              maxFrameRate: 3
                          },
                          optional: [
                              {googLeakyBucket: true},
                              {googTemporalLayeredScreencast: true}
                          ]
                      }};
                      constraints.video.mandatory.chromeMediaSourceId = sourceId;
                      window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                          callback(null, stream);
                      }).catch(function (err) {
                          callback(err);
                      });
                  }
              });
          } else if (isCef || (chromever >= 26 && chromever <= maxver)) {
              // chrome 26 - chrome 33 way to do it -- requires bad chrome://flags
              // note: this is basically in maintenance mode and will go away soon
              constraints = (hasConstraints && constraints) || {
                  video: {
                      mandatory: {
                          googLeakyBucket: true,
                          maxWidth: window.screen.width,
                          maxHeight: window.screen.height,
                          maxFrameRate: 3,
                          chromeMediaSource: 'screen'
                      }
                  }
              };
              window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                  callback(null, stream);
              }).catch(function (err) {
                  callback(err);
              });
          } else {
              // chrome 34+ way requiring an extension
              var pending = window.setTimeout(function () {
                  error = new Error('NavigatorUserMediaError');
                  error.name = 'EXTENSION_UNAVAILABLE';
                  return callback(error);
              }, 1000);
              cache[pending] = [callback, hasConstraints ? constraints : null];
              window.postMessage({ type: 'getScreen', id: pending }, '*');
          }
      }
    } else if (window.navigator.userAgent.match('Firefox')) {
        var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
        if (ffver >= 33) {
            constraints = (hasConstraints && constraints) || {
                video: {
                    mozMediaSource: 'window',
                    mediaSource: 'window'
                }
            };
            window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                callback(null, stream);
                var lastTime = stream.currentTime;
                var polly = window.setInterval(function () {
                    if (!stream) window.clearInterval(polly);
                    if (stream.currentTime == lastTime) {
                        window.clearInterval(polly);
                        if (stream.onended) {
                            stream.onended();
                        }
                    }
                    lastTime = stream.currentTime;
                }, 500);
            }).catch(function (err) {
                callback(err);
            });
        } else {
            error = new Error('NavigatorUserMediaError');
            error.name = 'EXTENSION_UNAVAILABLE'; // does not make much sense but...
        }
    }
};

typeof window !== 'undefined' && window.addEventListener('message', function (event) {
    if (event.origin != window.location.origin) {
        return;
    }
    if (event.data.type == 'gotScreen' && cache[event.data.id]) {
      alert("got screen!")
        var data = cache[event.data.id];
        var constraints = data[1];
        var callback = data[0];
        delete cache[event.data.id];

        if (event.data.sourceId === '') { // user canceled
            var error = new Error('NavigatorUserMediaError');
            error.name = 'NotAllowedError';
            callback(error);
        } else {
            constraints = constraints || {audio: false, video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height,
                    maxFrameRate: 3
                },
                optional: [
                    {googLeakyBucket: true},
                    {googTemporalLayeredScreencast: true}
                ]
            }};
            constraints.video.mandatory.chromeMediaSourceId = event.data.sourceId;
            window.navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                callback(null, stream);
            }).catch(function (err) {
                callback(err);
            });
        }
    } else if (event.data.type == 'getScreenPending') {
        window.clearTimeout(event.data.id);
    }
});

},{"webrtc-adapter":33}],15:[function(require,module,exports){
const getScreenMedia = require('./getscreenmedia.js')

module.exports = function (options) {
  //const regl = options.regl

  // mandatory: {
  //     chromeMediaSource: 'desktop',
  //     maxWidth: 640,
  //     maxHeight: 480
  // }
  return new Promise(function(resolve, reject) {
    getScreenMedia( {audio: false, video: {
        mandatory: {
            chromeMediaSource: 'desktop'
        }
    }}, function (err, stream) {
    if (err) {
      console.log('error getting screen media', err)
      reject(err)
    } else {
      console.log("got stream", stream)
      const video = document.createElement('video')
      //video.src = window.URL.createObjectURL(stream)
      video.srcObject = stream
     // document.body.appendChild(video)
      video.addEventListener('loadedmetadata', () => {
        video.play()
       // const webcam = regl.texture(video)
        //regl.frame(() => webcam.subimage(video))
        resolve({video: video})
      })
    //resolve()
    }
  })
  })

}

},{"./getscreenmedia.js":14}],16:[function(require,module,exports){
const transforms = require('./glsl-transforms.js')

var Output = function (opts) {
  this.regl = opts.regl
  this.positionBuffer = this.regl.buffer([
    [-2, 0],
    [0, -2],
    [2, 2]
  ])

  this.clear()
  this.pingPongIndex = 0

  // for each output, create two fbos to use for ping ponging
  this.fbos = (Array(2)).fill().map(() => this.regl.framebuffer({
    color: this.regl.texture({
      width: opts.width,
      height: opts.height,
      format: 'rgba'
    }),
    depthStencil: false
  }))

  // array containing render passes
  this.passes = []
  // console.log("position", this.positionBuffer)
}

// Object.keys(transforms).forEach((method) => {
//   Output.prototype[method] = function (...args) {
//   //  console.log("applying", method, transforms[method])
//     this.applyTransform(transforms[method], args)
//
//     return this
//   }
// })

Output.prototype.getCurrent = function () {
  // console.log("get current",this.pingPongIndex )
  return this.fbos[this.pingPongIndex]
}

Output.prototype.getTexture = function () {
//  return this.fbos[!this.pingPongIndex]
  var index = this.pingPongIndex ? 0 : 1
  //  console.log("get texture",index)
  return this.fbos[index]
}

Output.prototype.clear = function () {
  this.transformIndex = 0
  this.fragHeader = `
  precision mediump float;

  uniform float time;
  varying vec2 uv;
  `
  this.fragBody = ``
  //
  // uniform vec4 color;
  // void main () {
  //   gl_FragColor = color;
  // }`
  this.vert = `
  precision mediump float;
  attribute vec2 position;
  varying vec2 uv;

  void main () {
    uv = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
  }`
  this.attributes = {
    position: this.positionBuffer
  }
  this.uniforms = {
    time: this.regl.prop('time'),
    resolution: this.regl.prop('resolution')
  }
//  this.compileFragShader()

  this.frag = `
       ${this.fragHeader}

      void main () {
        vec4 c = vec4(0, 0, 0, 0);
        vec2 st = uv;
        ${this.fragBody}
        gl_FragColor = c;
      }
  `
  return this
}


// Output.prototype.compileFragShader = function () {
//   var frag = `
//     ${this.fragHeader}
//
//     void main () {
//       vec4 c = vec4(0, 0, 0, 0);
//       vec2 st = uv;
//       ${this.fragBody}
//       gl_FragColor = c;
//     }
//   `
// // console.log("FRAG", frag)
//   this.frag = frag
// }

Output.prototype.render = function () {
  this.draw = this.regl({
    frag: this.frag,
    vert: this.vert,
    attributes: this.attributes,
    uniforms: this.uniforms,
    count: 3,
    framebuffer: () => {
      this.pingPongIndex = this.pingPongIndex ? 0 : 1
      return this.fbos[this.pingPongIndex]
    }
  })
}

Output.prototype.renderPasses = function(passes) {
  var self = this
//  console.log("passes", passes)
  this.passes = passes.map( (pass, passIndex) => {

    //  console.log("get texture",index)
    var uniforms = Object.assign(pass.uniforms, { prevBuffer:  () =>  {
           var index = this.pingPongIndex ? 0 : 1
        //  console.log('pass index', passIndex, 'fbo index', index)
         return this.fbos[this.pingPongIndex ? 0 : 1]
        }
      })

      return {
        draw: self.regl({
          frag: pass.frag,
          vert: self.vert,
          attributes: self.attributes,
          uniforms: uniforms,
          count: 3,
          framebuffer: () => {

            self.pingPongIndex = self.pingPongIndex ? 0 : 1
          //  console.log('pass index', passIndex, 'render index',  self.pingPongIndex)
            return self.fbos[self.pingPongIndex]
          }
        })
      }
  })
}

Output.prototype.tick = function (props) {
//  this.draw(props)
  this.passes.forEach((pass) => pass.draw(props))
}

module.exports = Output

},{"./glsl-transforms.js":12}],17:[function(require,module,exports){
// to add: ripple: https://www.shadertoy.com/view/4djGzz
// mask
// convolution
// basic sdf shapes
// repeat
// iq color palletes

module.exports = {
  _convolution: {
    type: 'renderpass_util',
    glsl: `
      float kernel [9];

      vec4 _convolution (vec2 uv, float[9] _kernel, float kernelWeight) {
        vec2 st = uv/resolution;
        vec2 onePixel = vec2(4.0, 4.0) / resolution;
        //  vec2 onePixel = vec2(1.0, 1.0);
        vec4 colorSum =
          texture2D(prevBuffer, st + onePixel * vec2(-1, -1)) * _kernel[0] +
          texture2D(prevBuffer, st + onePixel * vec2( 0, -1)) * _kernel[1] +
          texture2D(prevBuffer, st + onePixel * vec2( 1, -1)) * _kernel[2] +
          texture2D(prevBuffer, st + onePixel * vec2(-1,  0)) * _kernel[3] +
          texture2D(prevBuffer, st + onePixel * vec2( 0,  0)) * _kernel[4] +
          texture2D(prevBuffer, st + onePixel * vec2( 1,  0)) * _kernel[5] +
          texture2D(prevBuffer, st + onePixel * vec2(-1,  1)) * _kernel[6] +
          texture2D(prevBuffer, st + onePixel * vec2( 0,  1)) * _kernel[7] +
          texture2D(prevBuffer, st + onePixel * vec2( 1,  1)) * _kernel[8] ;
        colorSum /= kernelWeight;
        return colorSum;
      }
    `
  },
  rgbShift: {
    type: 'renderpass',
    glsl: `

    void main() {
      vec2 p = st;
      vec4 shift = vec4(-0.01, 0.02, 0.03, -0.04);
      vec2 rs = vec2(shift.x,-shift.y);
      vec2 gs = vec2(shift.y,-shift.z);
      vec2 bs = vec2(shift.z,-shift.x);

      float r = texture2D(prevBuffer, p+rs, 0.0).x;
      float g = texture2D(prevBuffer, p+gs, 0.0).y;
      float b = texture2D(prevBuffer, p+bs, 0.0).z;
    }
    `
  },
  edges: {
    type: 'renderpass',
    glsl: `
      void main () {
    //    kernel[0] = -0.125; kernel[1] = -0.125; kernel[2] = -0.125;
      //  kernel[3] = -0.125; kernel[4] = 1.0; kernel[5] = -0.125;
      //  kernel[6] = -0.125; kernel[7] = -0.125; kernel[8] = -0.125;

// blur
     kernel[0] = 0.0; kernel[1] = 1.0; kernel[2] = 0.0;
     kernel[3] = 1.0; kernel[4] = 1.0; kernel[5] = 1.0;
     kernel[6] = 0.0; kernel[7] = 1.0; kernel[8] = 0.0;

      kernel[0] = 5.0; kernel[1] = -0.0; kernel[2] = -0.0;
      kernel[3] = 0.0; kernel[4] = 0.0; kernel[5] = 0.0;
      kernel[6] = -0.0; kernel[7] = -0.0; kernel[8] = -5.0;

        vec4 sum = _convolution( gl_FragCoord.xy, kernel, 10.0);
        gl_FragColor = clamp(sum , vec4(0.0), vec4(1.0));
    //   vec2 st = gl_FragCoord.xy/resolution;
    //    vec4 col = texture2D(prevBuffer, fract(st));
    //  gl_FragColor = vec4(st, 1.0, 1.0);
      }
    `
  }
}

},{}],18:[function(require,module,exports){
// to do:
// 1. how to handle multi-pass renders
// 2. how to handle vertex shaders

module.exports = function (defaultOutput) {

  var Frag = function (shaderString) {
    var obj =  Object.create(Frag.prototype)
    obj.shaderString =   `
    void main () {
      vec2 st = gl_FragCoord.xy/resolution;
      gl_FragColor = vec4(st, 1.0, 1.0);
    }
    `
    if(shaderString) obj.shaderString = shaderString
    return obj
  }

  Frag.prototype.compile = function () {
    var frag = `
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 uv;

    ${this.shaderString}
    `
    return frag
  }

  Frag.prototype.out = function (_output) {
    var output = _output || defaultOutput
    var frag = this.compile()
    output.frag = frag
    var pass = {
      frag: frag,
      uniforms: output.uniforms
    }
    console.log('rendering', pass)
    var passes = []
    passes.push(pass)
    output.renderPasses([pass])
    // var uniformObj = {}
    // this.uniforms.forEach((uniform) => { uniformObj[uniform.name] = uniform.value })
    // output.uniforms = Object.assign(output.uniforms, uniformObj)
    output.render()
  }

  return Frag
}

},{}],19:[function(require,module,exports){
// some utility functions for managing time within hydra
// to do: add easing functions: https://github.com/bameyrick/js-easing-functions

// accepts a sequence of values as an array
const seq = (arr = []) => ({time, bpm}) =>
{
   let speed = arr.speed ? arr.speed : 1
   return arr[Math.floor(time * speed * (bpm / 60) % (arr.length))]
}

// base sin oscillation
const sin = (amplitude = 1, period = 0.1, offset = 0, offsetTime = 0) => ({time, bpm}) => {
	return amplitude * Math.sin((time + offsetTime) * period * (bpm / 60)) + offset
}

// continuously increasing
const ramp = (scale = 1, offset = 0) => ({time, bpm}) => (time * scale + offset)

// Utility functions and variables for managing fade in and outs:
// creates a set of variables to store state.
// usage: osc(f0(10, 100)).out() , where there variables are: minimum, maximum, and multiple in time
// call fadeIn(0) to fade in all instances of f0, and fadeOut(0) to fadeOut
function createFades (numFades) {
  // variables containing current state of fade
  const gain = Array(numFades).fill().map(() => ({ progress: 0, dir: 1, mult: 1}))

  // fade function to use as parameter
  const fade = (i) => (min = 0, max = 10, mult = 1) => () => {
  //  console.log("gain", gain)
  	gain[i].progress++
  	if(gain[i].dir > 0) {
  		return Math.min(max, min + gain[i].progress * mult * gain[i].mult)
  	} else {
  		return Math.max(min, max - gain[i].progress * mult * gain[i].mult)
  	}
  }

  // to do: put this code somewhere else
  gain.forEach((gain, index) => {
    window['f'+index] = fade(index)
  })

  window.fadeIn = (index, _mult) => {
  	gain[index] = {
  		progress: 0, dir: 1, mult: _mult ? _mult : 1
  	}
  }
  //
  window.fadeOut = (index, _mult) => {
  	gain[index] = {
  		progress: 0, dir: -1, mult: _mult ? _mult : 1
  	}
  }
}

module.exports = {
  seq: seq,
  sin: sin,
  ramp: ramp,
  createFades: createFades
}

},{}],20:[function(require,module,exports){
class VideoRecorder {
  constructor(stream) {
    this.mediaSource = new MediaSource()
    this.stream = stream

    // testing using a recording as input
    this.output = document.createElement('video')
    this.output.autoplay = true
    this.output.loop = true

    let self = this
    this.mediaSource.addEventListener('sourceopen', () => {
      console.log('MediaSource opened');
      self.sourceBuffer = self.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
      console.log('Source buffer: ', sourceBuffer);
    })
  }

  start() {
  //  let options = {mimeType: 'video/webm'};

//   let options = {mimeType: 'video/webm;codecs=h264'};
   let options = {mimeType: 'video/webm;codecs=vp9'};

    this.recordedBlobs = []
    try {
     this.mediaRecorder = new MediaRecorder(this.stream, options)
    } catch (e0) {
     console.log('Unable to create MediaRecorder with options Object: ', e0)
     try {
       options = {mimeType: 'video/webm,codecs=vp9'}
       this.mediaRecorder = new MediaRecorder(this.stream, options)
     } catch (e1) {
       console.log('Unable to create MediaRecorder with options Object: ', e1)
       try {
         options = 'video/vp8' // Chrome 47
         this.mediaRecorder = new MediaRecorder(this.stream, options)
       } catch (e2) {
         alert('MediaRecorder is not supported by this browser.\n\n' +
           'Try Firefox 29 or later, or Chrome 47 or later, ' +
           'with Enable experimental Web Platform features enabled from chrome://flags.')
         console.error('Exception while creating MediaRecorder:', e2)
         return
       }
     }
   }
   console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
   this.mediaRecorder.onstop = this._handleStop.bind(this)
   this.mediaRecorder.ondataavailable = this._handleDataAvailable.bind(this)
   this.mediaRecorder.start(100) // collect 100ms of data
   console.log('MediaRecorder started', this.mediaRecorder)
 }

  
   stop(){
     this.mediaRecorder.stop()
   }

 _handleStop() {
   //const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'})
   // const blob = new Blob(this.recordedBlobs, {type: 'video/webm;codecs=h264'})
  const blob = new Blob(this.recordedBlobs, {type: this.mediaRecorder.mimeType})
   const url = window.URL.createObjectURL(blob)
   this.output.src = url

    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    let d = new Date()
    a.download = `hydra-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}.webm`
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 300);
  }

  _handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }
}

module.exports = VideoRecorder

},{}],21:[function(require,module,exports){
const getUserMedia = require('getusermedia')
const enumerateDevices = require('enumerate-devices')

module.exports = function (deviceId) {
  return new Promise(function (resolve, reject) {
    enumerateDevices()
    .then(devices => devices.filter(devices => devices.kind === 'videoinput'))
    .then(cameras =>
      {
        let constraints = { audio: false, video: true}
        if(cameras[deviceId]) {
          constraints['video'] = {
            deviceId: { exact: cameras[deviceId].deviceId }
          }
        }
        getUserMedia(constraints, function (err, stream) {
          if(err) {
            reject(err)
          } else {
            const video = document.createElement('video')
          //  video.src = window.URL.createObjectURL(stream)
          video.srcObject = stream
            video.addEventListener('loadedmetadata', () => {
              video.play().then(() => resolve({video: video}))
            })
          }
        })

        console.log(cameras)
      }
    ).catch(console.log.bind(console))

  })
}

},{"enumerate-devices":5,"getusermedia":6}],22:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],23:[function(require,module,exports){
!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.Meyda=r():t.Meyda=r()}(this,function(){return function(t){function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var e={};return r.m=t,r.c=e,r.i=function(t){return t},r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},r.p="",r(r.s=23)}([function(t,r,e){"use strict";function n(t){if(Array.isArray(t)){for(var r=0,e=Array(t.length);r<t.length;r++)e[r]=t[r];return e}return Array.from(t)}function o(t){for(;t%2==0&&t>1;)t/=2;return 1===t}function i(t,r){for(var e=[],n=0;n<Math.min(t.length,r.length);n++)e[n]=t[n]*r[n];return e}function a(t,r){if("rect"!==r){if(""!==r&&r||(r="hanning"),g[r]||(g[r]={}),!g[r][t.length])try{g[r][t.length]=b[r](t.length)}catch(t){throw new Error("Invalid windowing function")}t=i(t,g[r][t.length])}return t}function u(t,r,e){for(var n=new Float32Array(t),o=0;o<n.length;o++)n[o]=o*r/e,n[o]=13*Math.atan(n[o]/1315.8)+3.5*Math.atan(Math.pow(n[o]/7518,2));return n}function c(t){return Float32Array.from(t)}function f(t){return 700*(Math.exp(t/1125)-1)}function l(t){return 1125*Math.log(1+t/700)}function s(t,r,e){for(var n=new Float32Array(t+2),o=new Float32Array(t+2),i=r/2,a=l(0),u=l(i),c=u-a,s=c/(t+1),p=Array(t+2),m=0;m<n.length;m++)n[m]=m*s,o[m]=f(n[m]),p[m]=Math.floor((e+1)*o[m]/r);for(var y=Array(t),h=0;h<y.length;h++){y[h]=Array.apply(null,new Array(e/2+1)).map(Number.prototype.valueOf,0);for(var b=p[h];b<p[h+1];b++)y[h][b]=(b-p[h])/(p[h+1]-p[h]);for(var g=p[h+1];g<p[h+2];g++)y[h][g]=(p[h+2]-g)/(p[h+2]-p[h+1])}return y}function p(t,r){return Math.log2(16*t/r)}function m(t){var r=t[0].map(function(){return 0}),e=t.reduce(function(t,r){return r.forEach(function(r,e){t[e]+=Math.pow(r,2)}),t},r).map(Math.sqrt);return t.map(function(t,r){return t.map(function(t,r){return t/(e[r]||1)})})}function y(t,r,e){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:5,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:2,a=!(arguments.length>5&&void 0!==arguments[5])||arguments[5],u=arguments.length>6&&void 0!==arguments[6]?arguments[6]:440,c=Math.floor(e/2)+1,f=new Array(e).fill(0).map(function(n,o){return t*p(r*o/e,u)});f[0]=f[1]-1.5*t;var l=f.slice(1).map(function(t,r){return Math.max(t-f[r])},1).concat([1]),s=Math.round(t/2),y=new Array(t).fill(0).map(function(r,e){return f.map(function(r){return(10*t+s+r-e)%t-s})}),h=y.map(function(t,r){return t.map(function(t,e){return Math.exp(-.5*Math.pow(2*y[r][e]/l[e],2))})});if(h=m(h),i){var b=f.map(function(r){return Math.exp(-.5*Math.pow((r/t-o)/i,2))});h=h.map(function(t){return t.map(function(t,r){return t*b[r]})})}return a&&(h=[].concat(n(h.slice(3)),n(h.slice(0,3)))),h.map(function(t){return t.slice(0,c)})}function h(t,r,e){if(t.length<r)throw new Error("Buffer is too short for frame length");if(e<1)throw new Error("Hop length cannot be less that 1");if(r<1)throw new Error("Frame length cannot be less that 1");var n=1+Math.floor((t.length-r)/e);return new Array(n).fill(0).map(function(n,o){return t.slice(o*e,o*e+r)})}r.b=o,r.a=a,r.c=u,r.f=c,r.d=s,r.e=y,r.g=h;var b=e(25),g={}},function(t,r,e){"use strict";function n(t,r){for(var e=0,n=0,o=0;o<r.length;o++)e+=Math.pow(o,t)*Math.abs(r[o]),n+=r[o];return e/n}r.a=n},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(t){if("object"!==n(t.ampSpectrum)||"object"!==n(t.barkScale))throw new TypeError;var r=new Float32Array(24),e=0,o=t.ampSpectrum,i=new Int32Array(25);i[0]=0;for(var a=t.barkScale[o.length-1]/24,u=1,c=0;c<o.length;c++)for(;t.barkScale[c]>a;)i[u++]=c,a=u*t.barkScale[o.length-1]/24;i[24]=o.length-1;for(var f=0;f<24;f++){for(var l=0,s=i[f];s<i[f+1];s++)l+=o[s];r[f]=Math.pow(l,.23)}for(var p=0;p<r.length;p++)e+=r[p];return{specific:r,total:e}}},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==n(arguments[0].ampSpectrum))throw new TypeError;for(var t=new Float32Array(arguments[0].ampSpectrum.length),r=0;r<t.length;r++)t[r]=Math.pow(arguments[0].ampSpectrum[r],2);return t}},function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),e.d(r,"buffer",function(){return v}),e.d(r,"complexSpectrum",function(){return w}),e.d(r,"amplitudeSpectrum",function(){return x});var n=e(13),o=e(9),i=e(20),a=e(14),u=e(18),c=e(15),f=e(21),l=e(19),s=e(17),p=e(22),m=e(2),y=e(12),h=e(11),b=e(10),g=e(8),S=e(3),d=e(16);e.d(r,"rms",function(){return n.a}),e.d(r,"energy",function(){return o.a}),e.d(r,"spectralSlope",function(){return i.a}),e.d(r,"spectralCentroid",function(){return a.a}),e.d(r,"spectralRolloff",function(){return u.a}),e.d(r,"spectralFlatness",function(){return c.a}),e.d(r,"spectralSpread",function(){return f.a}),e.d(r,"spectralSkewness",function(){return l.a}),e.d(r,"spectralKurtosis",function(){return s.a}),e.d(r,"zcr",function(){return p.a}),e.d(r,"loudness",function(){return m.a}),e.d(r,"perceptualSpread",function(){return y.a}),e.d(r,"perceptualSharpness",function(){return h.a}),e.d(r,"powerSpectrum",function(){return S.a}),e.d(r,"mfcc",function(){return b.a}),e.d(r,"chroma",function(){return g.a}),e.d(r,"spectralFlux",function(){return d.a});var v=function(t){return t.signal},w=function(t){return t.complexSpectrum},x=function(t){return t.ampSpectrum}},function(t,r){var e;e=function(){return this}();try{e=e||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,r,e){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=e(0),o=e(4),i=e(28),a=(e.n(i),e(24)),u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c={audioContext:null,spn:null,bufferSize:512,sampleRate:44100,melBands:26,chromaBands:12,callback:null,windowingFunction:"hanning",featureExtractors:o,EXTRACTION_STARTED:!1,_featuresToExtract:[],windowing:n.a,_errors:{notPow2:new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"),featureUndef:new Error("Meyda: No features defined."),invalidFeatureFmt:new Error("Meyda: Invalid feature format"),invalidInput:new Error("Meyda: Invalid input."),noAC:new Error("Meyda: No AudioContext specified."),noSource:new Error("Meyda: No source node specified.")},createMeydaAnalyzer:function(t){return new a.a(t,c)},extract:function(t,r,e){if(!r)throw this._errors.invalidInput;if("object"!=(void 0===r?"undefined":u(r)))throw this._errors.invalidInput;if(!t)throw this._errors.featureUndef;if(!n.b(r.length))throw this._errors.notPow2;void 0!==this.barkScale&&this.barkScale.length==this.bufferSize||(this.barkScale=n.c(this.bufferSize,this.sampleRate,this.bufferSize)),void 0!==this.melFilterBank&&this.barkScale.length==this.bufferSize&&this.melFilterBank.length==this.melBands||(this.melFilterBank=n.d(this.melBands,this.sampleRate,this.bufferSize)),void 0!==this.chromaFilterBank&&this.chromaFilterBank.length==this.chromaBands||(this.chromaFilterBank=n.e(this.chromaBands,this.sampleRate,this.bufferSize)),void 0===r.buffer?this.signal=n.f(r):this.signal=r;var o=f(r,this.windowingFunction,this.bufferSize);if(this.signal=o.windowedSignal,this.complexSpectrum=o.complexSpectrum,this.ampSpectrum=o.ampSpectrum,e){var i=f(e,this.windowingFunction,this.bufferSize);this.previousSignal=i.windowedSignal,this.previousComplexSpectrum=i.complexSpectrum,this.previousAmpSpectrum=i.ampSpectrum}if("object"===(void 0===t?"undefined":u(t))){for(var a={},c=0;c<t.length;c++)a[t[c]]=this.featureExtractors[t[c]]({ampSpectrum:this.ampSpectrum,chromaFilterBank:this.chromaFilterBank,complexSpectrum:this.complexSpectrum,signal:this.signal,bufferSize:this.bufferSize,sampleRate:this.sampleRate,barkScale:this.barkScale,melFilterBank:this.melFilterBank,previousSignal:this.previousSignal,previousAmpSpectrum:this.previousAmpSpectrum,previousComplexSpectrum:this.previousComplexSpectrum});return a}if("string"==typeof t)return this.featureExtractors[t]({ampSpectrum:this.ampSpectrum,chromaFilterBank:this.chromaFilterBank,complexSpectrum:this.complexSpectrum,signal:this.signal,bufferSize:this.bufferSize,sampleRate:this.sampleRate,barkScale:this.barkScale,melFilterBank:this.melFilterBank,previousSignal:this.previousSignal,previousAmpSpectrum:this.previousAmpSpectrum,previousComplexSpectrum:this.previousComplexSpectrum});throw this._errors.invalidFeatureFmt}},f=function(t,r,o){var a={};void 0===t.buffer?a.signal=n.f(t):a.signal=t,a.windowedSignal=n.a(a.signal,r),a.complexSpectrum=e.i(i.fft)(a.windowedSignal),a.ampSpectrum=new Float32Array(o/2);for(var u=0;u<o/2;u++)a.ampSpectrum[u]=Math.sqrt(Math.pow(a.complexSpectrum.real[u],2)+Math.pow(a.complexSpectrum.imag[u],2));return a};r.default=c,"undefined"!=typeof window&&(window.Meyda=c)},function(t,r,e){"use strict";(function(r){/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function n(t,r){if(t===r)return 0;for(var e=t.length,n=r.length,o=0,i=Math.min(e,n);o<i;++o)if(t[o]!==r[o]){e=t[o],n=r[o];break}return e<n?-1:n<e?1:0}function o(t){return r.Buffer&&"function"==typeof r.Buffer.isBuffer?r.Buffer.isBuffer(t):!(null==t||!t._isBuffer)}function i(t){return Object.prototype.toString.call(t)}function a(t){return!o(t)&&("function"==typeof r.ArrayBuffer&&("function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):!!t&&(t instanceof DataView||!!(t.buffer&&t.buffer instanceof ArrayBuffer))))}function u(t){if(v.isFunction(t)){if(E)return t.name;var r=t.toString(),e=r.match(M);return e&&e[1]}}function c(t,r){return"string"==typeof t?t.length<r?t:t.slice(0,r):t}function f(t){if(E||!v.isFunction(t))return v.inspect(t);var r=u(t);return"[Function"+(r?": "+r:"")+"]"}function l(t){return c(f(t.actual),128)+" "+t.operator+" "+c(f(t.expected),128)}function s(t,r,e,n,o){throw new _.AssertionError({message:e,actual:t,expected:r,operator:n,stackStartFunction:o})}function p(t,r){t||s(t,!0,r,"==",_.ok)}function m(t,r,e,u){if(t===r)return!0;if(o(t)&&o(r))return 0===n(t,r);if(v.isDate(t)&&v.isDate(r))return t.getTime()===r.getTime();if(v.isRegExp(t)&&v.isRegExp(r))return t.source===r.source&&t.global===r.global&&t.multiline===r.multiline&&t.lastIndex===r.lastIndex&&t.ignoreCase===r.ignoreCase;if(null!==t&&"object"==typeof t||null!==r&&"object"==typeof r){if(a(t)&&a(r)&&i(t)===i(r)&&!(t instanceof Float32Array||t instanceof Float64Array))return 0===n(new Uint8Array(t.buffer),new Uint8Array(r.buffer));if(o(t)!==o(r))return!1;u=u||{actual:[],expected:[]};var c=u.actual.indexOf(t);return-1!==c&&c===u.expected.indexOf(r)||(u.actual.push(t),u.expected.push(r),h(t,r,e,u))}return e?t===r:t==r}function y(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function h(t,r,e,n){if(null===t||void 0===t||null===r||void 0===r)return!1;if(v.isPrimitive(t)||v.isPrimitive(r))return t===r;if(e&&Object.getPrototypeOf(t)!==Object.getPrototypeOf(r))return!1;var o=y(t),i=y(r);if(o&&!i||!o&&i)return!1;if(o)return t=x.call(t),r=x.call(r),m(t,r,e);var a,u,c=A(t),f=A(r);if(c.length!==f.length)return!1;for(c.sort(),f.sort(),u=c.length-1;u>=0;u--)if(c[u]!==f[u])return!1;for(u=c.length-1;u>=0;u--)if(a=c[u],!m(t[a],r[a],e,n))return!1;return!0}function b(t,r,e){m(t,r,!0)&&s(t,r,e,"notDeepStrictEqual",b)}function g(t,r){if(!t||!r)return!1;if("[object RegExp]"==Object.prototype.toString.call(r))return r.test(t);try{if(t instanceof r)return!0}catch(t){}return!Error.isPrototypeOf(r)&&!0===r.call({},t)}function S(t){var r;try{t()}catch(t){r=t}return r}function d(t,r,e,n){var o;if("function"!=typeof r)throw new TypeError('"block" argument must be a function');"string"==typeof e&&(n=e,e=null),o=S(r),n=(e&&e.name?" ("+e.name+").":".")+(n?" "+n:"."),t&&!o&&s(o,e,"Missing expected exception"+n);var i="string"==typeof n,a=!t&&v.isError(o),u=!t&&o&&!e;if((a&&i&&g(o,e)||u)&&s(o,e,"Got unwanted exception"+n),t&&o&&e&&!g(o,e)||!t&&o)throw o}var v=e(33),w=Object.prototype.hasOwnProperty,x=Array.prototype.slice,E=function(){return"foo"===function(){}.name}(),_=t.exports=p,M=/\s*function\s+([^\(\s]*)\s*/;_.AssertionError=function(t){this.name="AssertionError",this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message?(this.message=t.message,this.generatedMessage=!1):(this.message=l(this),this.generatedMessage=!0);var r=t.stackStartFunction||s;if(Error.captureStackTrace)Error.captureStackTrace(this,r);else{var e=new Error;if(e.stack){var n=e.stack,o=u(r),i=n.indexOf("\n"+o);if(i>=0){var a=n.indexOf("\n",i+1);n=n.substring(a+1)}this.stack=n}}},v.inherits(_.AssertionError,Error),_.fail=s,_.ok=p,_.equal=function(t,r,e){t!=r&&s(t,r,e,"==",_.equal)},_.notEqual=function(t,r,e){t==r&&s(t,r,e,"!=",_.notEqual)},_.deepEqual=function(t,r,e){m(t,r,!1)||s(t,r,e,"deepEqual",_.deepEqual)},_.deepStrictEqual=function(t,r,e){m(t,r,!0)||s(t,r,e,"deepStrictEqual",_.deepStrictEqual)},_.notDeepEqual=function(t,r,e){m(t,r,!1)&&s(t,r,e,"notDeepEqual",_.notDeepEqual)},_.notDeepStrictEqual=b,_.strictEqual=function(t,r,e){t!==r&&s(t,r,e,"===",_.strictEqual)},_.notStrictEqual=function(t,r,e){t===r&&s(t,r,e,"!==",_.notStrictEqual)},_.throws=function(t,r,e){d(!0,t,r,e)},_.doesNotThrow=function(t,r,e){d(!1,t,r,e)},_.ifError=function(t){if(t)throw t};var A=Object.keys||function(t){var r=[];for(var e in t)w.call(t,e)&&r.push(e);return r}}).call(r,e(5))},function(t,r,e){"use strict";function n(t){if(Array.isArray(t)){for(var r=0,e=Array(t.length);r<t.length;r++)e[r]=t[r];return e}return Array.from(t)}var o=(e(0),"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t});r.a=function(t){if("object"!==o(t.ampSpectrum))throw new TypeError("Valid ampSpectrum is required to generate chroma");if("object"!==o(t.chromaFilterBank))throw new TypeError("Valid chromaFilterBank is required to generate chroma");var r=t.chromaFilterBank.map(function(r,e){return t.ampSpectrum.reduce(function(t,e,n){return t+e*r[n]},0)}),e=Math.max.apply(Math,n(r));return e?r.map(function(t){return t/e}):r}},function(t,r,e){"use strict";var n=e(7),o=(e.n(n),"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t});r.a=function(){if("object"!==o(arguments[0].signal))throw new TypeError;for(var t=0,r=0;r<arguments[0].signal.length;r++)t+=Math.pow(Math.abs(arguments[0].signal[r]),2);return t}},function(t,r,e){"use strict";var n=e(3),o=(e(0),"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t}),i=e(26);r.a=function(t){if("object"!==o(t.ampSpectrum))throw new TypeError("Valid ampSpectrum is required to generate MFCC");if("object"!==o(t.melFilterBank))throw new TypeError("Valid melFilterBank is required to generate MFCC");for(var r=e.i(n.a)(t),a=t.melFilterBank.length,u=Array(a),c=new Float32Array(a),f=0;f<c.length;f++){u[f]=new Float32Array(t.bufferSize/2),c[f]=0;for(var l=0;l<t.bufferSize/2;l++)u[f][l]=t.melFilterBank[f][l]*r[l],c[f]+=u[f][l];c[f]=Math.log(c[f]+1)}var s=Array.prototype.slice.call(c);return i(s).slice(0,13)}},function(t,r,e){"use strict";var n=e(2),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==o(arguments[0].signal))throw new TypeError;for(var t=e.i(n.a)(arguments[0]),r=t.specific,i=0,a=0;a<r.length;a++)i+=a<15?(a+1)*r[a+1]:.066*Math.exp(.171*(a+1));return i*=.11/t.total}},function(t,r,e){"use strict";var n=e(2),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==o(arguments[0].signal))throw new TypeError;for(var t=e.i(n.a)(arguments[0]),r=0,i=0;i<t.specific.length;i++)t.specific[i]>r&&(r=t.specific[i]);return Math.pow((t.total-r)/t.total,2)}},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(t){if("object"!==n(t.signal))throw new TypeError;for(var r=0,e=0;e<t.signal.length;e++)r+=Math.pow(t.signal[e],2);return r/=t.signal.length,r=Math.sqrt(r)}},function(t,r,e){"use strict";var n=e(1),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==o(arguments[0].ampSpectrum))throw new TypeError;return e.i(n.a)(1,arguments[0].ampSpectrum)}},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==n(arguments[0].ampSpectrum))throw new TypeError;for(var t=0,r=0,e=0;e<arguments[0].ampSpectrum.length;e++)t+=Math.log(arguments[0].ampSpectrum[e]),r+=arguments[0].ampSpectrum[e];return Math.exp(t/arguments[0].ampSpectrum.length)*arguments[0].ampSpectrum.length/r}},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(t){if("object"!==n(t.signal)||"object"!=n(t.previousSignal))throw new TypeError;for(var r=0,e=-t.bufferSize/2;e<signal.length/2-1;e++)x=Math.abs(t.signal[e])-Math.abs(t.previousSignal[e]),r+=(x+Math.abs(x))/2;return r}},function(t,r,e){"use strict";var n=e(1),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==o(arguments[0].ampSpectrum))throw new TypeError;var t=arguments[0].ampSpectrum,r=e.i(n.a)(1,t),i=e.i(n.a)(2,t),a=e.i(n.a)(3,t),u=e.i(n.a)(4,t);return(-3*Math.pow(r,4)+6*r*i-4*r*a+u)/Math.pow(Math.sqrt(i-Math.pow(r,2)),4)}},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==n(arguments[0].ampSpectrum))throw new TypeError;for(var t=arguments[0].ampSpectrum,r=arguments[0].sampleRate/(2*(t.length-1)),e=0,o=0;o<t.length;o++)e+=t[o];for(var i=.99*e,a=t.length-1;e>i&&a>=0;)e-=t[a],--a;return(a+1)*r}},function(t,r,e){"use strict";var n=e(1),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(t){if("object"!==o(t.ampSpectrum))throw new TypeError;var r=e.i(n.a)(1,t.ampSpectrum),i=e.i(n.a)(2,t.ampSpectrum),a=e.i(n.a)(3,t.ampSpectrum);return(2*Math.pow(r,3)-3*r*i+a)/Math.pow(Math.sqrt(i-Math.pow(r,2)),3)}},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(t){if("object"!==n(t.ampSpectrum))throw new TypeError;for(var r=0,e=0,o=new Float32Array(t.ampSpectrum.length),i=0,a=0,u=0;u<t.ampSpectrum.length;u++){r+=t.ampSpectrum[u];var c=u*t.sampleRate/t.bufferSize;o[u]=c,i+=c*c,e+=c,a+=c*t.ampSpectrum[u]}return(t.ampSpectrum.length*a-e*r)/(r*(i-Math.pow(e,2)))}},function(t,r,e){"use strict";var n=e(1),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(t){if("object"!==o(t.ampSpectrum))throw new TypeError;return Math.sqrt(e.i(n.a)(2,t.ampSpectrum)-Math.pow(e.i(n.a)(1,t.ampSpectrum),2))}},function(t,r,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.a=function(){if("object"!==n(arguments[0].signal))throw new TypeError;for(var t=0,r=0;r<arguments[0].signal.length;r++)(arguments[0].signal[r]>=0&&arguments[0].signal[r+1]<0||arguments[0].signal[r]<0&&arguments[0].signal[r+1]>=0)&&t++;return t}},function(t,r,e){t.exports=e(6).default},function(t,r,e){"use strict";function n(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")}e.d(r,"a",function(){return u});var o=e(0),i=e(4),a=function(){function t(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(r,e,n){return e&&t(r.prototype,e),n&&t(r,n),r}}(),u=function(){function t(r,e){var a=this;if(n(this,t),this._m=e,!r.audioContext)throw this._m.errors.noAC;if(r.bufferSize&&!o.b(r.bufferSize))throw this._m._errors.notPow2;if(!r.source)throw this._m._errors.noSource;this._m.audioContext=r.audioContext,this._m.bufferSize=r.bufferSize||this._m.bufferSize||256,this._m.hopSize=r.hopSize||this._m.hopSize||this._m.bufferSize,this._m.sampleRate=r.sampleRate||this._m.audioContext.sampleRate||44100,this._m.callback=r.callback,this._m.windowingFunction=r.windowingFunction||"hanning",this._m.featureExtractors=i,this._m.EXTRACTION_STARTED=r.startImmediately||!1,this._m.spn=this._m.audioContext.createScriptProcessor(this._m.bufferSize,1,1),this._m.spn.connect(this._m.audioContext.destination),this._m._featuresToExtract=r.featureExtractors||[],this._m.barkScale=o.c(this._m.bufferSize,this._m.sampleRate,this._m.bufferSize),this._m.melFilterBank=o.d(this._m.melBands,this._m.sampleRate,this._m.bufferSize),this._m.inputData=null,this._m.previousInputData=null,this._m.frame=null,this._m.previousFrame=null,this.setSource(r.source),this._m.spn.onaudioprocess=function(t){if(null!==a._m.inputData&&(a._m.previousInputData=a._m.inputData),a._m.inputData=t.inputBuffer.getChannelData(0),a._m.previousInputData){var r=new Float32Array(a._m.previousInputData.length+a._m.inputData.length-a._m.hopSize);r.set(a._m.previousInputData.slice(a._m.hopSize)),r.set(a._m.inputData,a._m.previousInputData.length-a._m.hopSize)}else var r=a._m.inputData;o.g(r,a._m.bufferSize,a._m.hopSize).forEach(function(t){a._m.frame=t;var r=a._m.extract(a._m._featuresToExtract,a._m.frame,a._m.previousFrame);"function"==typeof a._m.callback&&a._m.EXTRACTION_STARTED&&a._m.callback(r),a._m.previousFrame=a._m.frame})}}return a(t,[{key:"start",value:function(t){this._m._featuresToExtract=t||this._m._featuresToExtract,this._m.EXTRACTION_STARTED=!0}},{key:"stop",value:function(){this._m.EXTRACTION_STARTED=!1}},{key:"setSource",value:function(t){t.connect(this._m.spn)}},{key:"get",value:function(t){return this._m.inputData?this._m.extract(t||this._m._featuresToExtract,this._m.inputData,this._m.previousInputData):null}}]),t}()},function(t,r,e){"use strict";function n(t){for(var r=new Float32Array(t),e=2*Math.PI/(t-1),n=2*e,o=0;o<t/2;o++)r[o]=.42-.5*Math.cos(o*e)+.08*Math.cos(o*n);for(var i=t/2;i>0;i--)r[t-i]=r[i-1];return r}function o(t){for(var r=Math.PI/(t-1),e=new Float32Array(t),n=0;n<t;n++)e[n]=Math.sin(r*n);return e}function i(t){for(var r=new Float32Array(t),e=0;e<t;e++)r[e]=.5-.5*Math.cos(2*Math.PI*e/(t-1));return r}function a(t){for(var r=new Float32Array(t),e=0;e<t;e++)r[e]=.54-.46*Math.cos(2*Math.PI*(e/t-1));return r}Object.defineProperty(r,"__esModule",{value:!0}),r.blackman=n,r.sine=o,r.hanning=i,r.hamming=a},function(t,r,e){t.exports=e(27)},function(t,r){function e(t,r){var e=t.length;return r=r||2,cosMap&&cosMap[e]||n(e),t.map(function(){return 0}).map(function(n,o){return r*t.reduce(function(t,r,n,i){return t+r*cosMap[e][n+o*e]},0)})}cosMap=null;var n=function(t){cosMap=cosMap||{},cosMap[t]=new Array(t*t);for(var r=Math.PI/t,e=0;e<t;e++)for(var n=0;n<t;n++)cosMap[t][n+e*t]=Math.cos(r*(n+.5)*e)};t.exports=e},function(t,r,e){"use strict";var n=e(29),o=function(t){var r={};void 0===t.real||void 0===t.imag?r=n.constructComplexArray(t):(r.real=t.real.slice(),r.imag=t.imag.slice());var e=r.real.length,o=Math.log2(e);if(Math.round(o)!=o)throw new Error("Input size must be a power of 2.");if(r.real.length!=r.imag.length)throw new Error("Real and imaginary components must have the same length.");for(var i=n.bitReverseArray(e),a={real:[],imag:[]},u=0;u<e;u++)a.real[i[u]]=r.real[u],a.imag[i[u]]=r.imag[u];for(var c=0;c<e;c++)r.real[c]=a.real[c],r.imag[c]=a.imag[c];for(var f=1;f<=o;f++)for(var l=Math.pow(2,f),s=0;s<l/2;s++)for(var p=n.euler(s,l),m=0;m<e/l;m++){var y=l*m+s,h=l*m+s+l/2,b={real:r.real[y],imag:r.imag[y]},g={real:r.real[h],imag:r.imag[h]},S=n.multiply(p,g),d=n.subtract(b,S);r.real[h]=d.real,r.imag[h]=d.imag;var v=n.add(S,b);r.real[y]=v.real,r.imag[y]=v.imag}return r},i=function(t){if(void 0===t.real||void 0===t.imag)throw new Error("IFFT only accepts a complex input.");for(var r=t.real.length,e={real:[],imag:[]},i=0;i<r;i++){var a={real:t.real[i],imag:t.imag[i]},u=n.conj(a);e.real[i]=u.real,e.imag[i]=u.imag}var c=o(e);return e.real=c.real.map(function(t){return t/r}),e.imag=c.imag.map(function(t){return t/r}),e};t.exports={fft:o,ifft:i}},function(t,r,e){"use strict";function n(t){if(Array.isArray(t)){for(var r=0,e=Array(t.length);r<t.length;r++)e[r]=t[r];return e}return Array.from(t)}var o={},i={},a=function(t){var r={};r.real=void 0===t.real?t.slice():t.real.slice();var e=r.real.length;return void 0===i[e]&&(i[e]=Array.apply(null,Array(e)).map(Number.prototype.valueOf,0)),r.imag=i[e].slice(),r},u=function(t){if(void 0===o[t]){for(var r=(t-1).toString(2).length,e="0".repeat(r),i={},a=0;a<t;a++){var u=a.toString(2);u=e.substr(u.length)+u,u=[].concat(n(u)).reverse().join(""),i[a]=parseInt(u,2)}o[t]=i}return o[t]},c=function(t,r){return{real:t.real*r.real-t.imag*r.imag,imag:t.real*r.imag+t.imag*r.real}},f=function(t,r){return{real:t.real+r.real,imag:t.imag+r.imag}},l=function(t,r){return{real:t.real-r.real,imag:t.imag-r.imag}},s=function(t,r){var e=-2*Math.PI*t/r;return{real:Math.cos(e),imag:Math.sin(e)}},p=function(t){return t.imag*=-1,t};t.exports={bitReverseArray:u,multiply:c,add:f,subtract:l,euler:s,conj:p,constructComplexArray:a}},function(t,r){function e(){throw new Error("setTimeout has not been defined")}function n(){throw new Error("clearTimeout has not been defined")}function o(t){if(l===setTimeout)return setTimeout(t,0);if((l===e||!l)&&setTimeout)return l=setTimeout,setTimeout(t,0);try{return l(t,0)}catch(r){try{return l.call(null,t,0)}catch(r){return l.call(this,t,0)}}}function i(t){if(s===clearTimeout)return clearTimeout(t);if((s===n||!s)&&clearTimeout)return s=clearTimeout,clearTimeout(t);try{return s(t)}catch(r){try{return s.call(null,t)}catch(r){return s.call(this,t)}}}function a(){h&&m&&(h=!1,m.length?y=m.concat(y):b=-1,y.length&&u())}function u(){if(!h){var t=o(a);h=!0;for(var r=y.length;r;){for(m=y,y=[];++b<r;)m&&m[b].run();b=-1,r=y.length}m=null,h=!1,i(t)}}function c(t,r){this.fun=t,this.array=r}function f(){}var l,s,p=t.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:e}catch(t){l=e}try{s="function"==typeof clearTimeout?clearTimeout:n}catch(t){s=n}}();var m,y=[],h=!1,b=-1;p.nextTick=function(t){var r=new Array(arguments.length-1);if(arguments.length>1)for(var e=1;e<arguments.length;e++)r[e-1]=arguments[e];y.push(new c(t,r)),1!==y.length||h||o(u)},c.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=f,p.addListener=f,p.once=f,p.off=f,p.removeListener=f,p.removeAllListeners=f,p.emit=f,p.prependListener=f,p.prependOnceListener=f,p.listeners=function(t){return[]},p.binding=function(t){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(t){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},function(t,r){"function"==typeof Object.create?t.exports=function(t,r){t.super_=r,t.prototype=Object.create(r.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(t,r){t.super_=r;var e=function(){};e.prototype=r.prototype,t.prototype=new e,t.prototype.constructor=t}},function(t,r){t.exports=function(t){return t&&"object"==typeof t&&"function"==typeof t.copy&&"function"==typeof t.fill&&"function"==typeof t.readUInt8}},function(t,r,e){(function(t,n){function o(t,e){var n={seen:[],stylize:a};return arguments.length>=3&&(n.depth=arguments[2]),arguments.length>=4&&(n.colors=arguments[3]),h(e)?n.showHidden=e:e&&r._extend(n,e),w(n.showHidden)&&(n.showHidden=!1),w(n.depth)&&(n.depth=2),w(n.colors)&&(n.colors=!1),w(n.customInspect)&&(n.customInspect=!0),n.colors&&(n.stylize=i),c(n,t,n.depth)}function i(t,r){var e=o.styles[r];return e?"["+o.colors[e][0]+"m"+t+"["+o.colors[e][1]+"m":t}function a(t,r){return t}function u(t){var r={};return t.forEach(function(t,e){r[t]=!0}),r}function c(t,e,n){if(t.customInspect&&e&&A(e.inspect)&&e.inspect!==r.inspect&&(!e.constructor||e.constructor.prototype!==e)){var o=e.inspect(n,t);return d(o)||(o=c(t,o,n)),o}var i=f(t,e);if(i)return i;var a=Object.keys(e),h=u(a);if(t.showHidden&&(a=Object.getOwnPropertyNames(e)),M(e)&&(a.indexOf("message")>=0||a.indexOf("description")>=0))return l(e);if(0===a.length){if(A(e)){var b=e.name?": "+e.name:"";return t.stylize("[Function"+b+"]","special")}if(x(e))return t.stylize(RegExp.prototype.toString.call(e),"regexp");if(_(e))return t.stylize(Date.prototype.toString.call(e),"date");if(M(e))return l(e)}var g="",S=!1,v=["{","}"];if(y(e)&&(S=!0,v=["[","]"]),A(e)){g=" [Function"+(e.name?": "+e.name:"")+"]"}if(x(e)&&(g=" "+RegExp.prototype.toString.call(e)),_(e)&&(g=" "+Date.prototype.toUTCString.call(e)),M(e)&&(g=" "+l(e)),0===a.length&&(!S||0==e.length))return v[0]+g+v[1];if(n<0)return x(e)?t.stylize(RegExp.prototype.toString.call(e),"regexp"):t.stylize("[Object]","special");t.seen.push(e);var w;return w=S?s(t,e,n,h,a):a.map(function(r){return p(t,e,n,h,r,S)}),t.seen.pop(),m(w,g,v)}function f(t,r){if(w(r))return t.stylize("undefined","undefined");if(d(r)){var e="'"+JSON.stringify(r).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return t.stylize(e,"string")}return S(r)?t.stylize(""+r,"number"):h(r)?t.stylize(""+r,"boolean"):b(r)?t.stylize("null","null"):void 0}function l(t){return"["+Error.prototype.toString.call(t)+"]"}function s(t,r,e,n,o){for(var i=[],a=0,u=r.length;a<u;++a)z(r,String(a))?i.push(p(t,r,e,n,String(a),!0)):i.push("");return o.forEach(function(o){o.match(/^\d+$/)||i.push(p(t,r,e,n,o,!0))}),i}function p(t,r,e,n,o,i){var a,u,f;if(f=Object.getOwnPropertyDescriptor(r,o)||{value:r[o]},f.get?u=f.set?t.stylize("[Getter/Setter]","special"):t.stylize("[Getter]","special"):f.set&&(u=t.stylize("[Setter]","special")),z(n,o)||(a="["+o+"]"),u||(t.seen.indexOf(f.value)<0?(u=b(e)?c(t,f.value,null):c(t,f.value,e-1),u.indexOf("\n")>-1&&(u=i?u.split("\n").map(function(t){return"  "+t}).join("\n").substr(2):"\n"+u.split("\n").map(function(t){return"   "+t}).join("\n"))):u=t.stylize("[Circular]","special")),w(a)){if(i&&o.match(/^\d+$/))return u;a=JSON.stringify(""+o),a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(a=a.substr(1,a.length-2),a=t.stylize(a,"name")):(a=a.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),a=t.stylize(a,"string"))}return a+": "+u}function m(t,r,e){var n=0;return t.reduce(function(t,r){return n++,r.indexOf("\n")>=0&&n++,t+r.replace(/\u001b\[\d\d?m/g,"").length+1},0)>60?e[0]+(""===r?"":r+"\n ")+" "+t.join(",\n  ")+" "+e[1]:e[0]+r+" "+t.join(", ")+" "+e[1]}function y(t){return Array.isArray(t)}function h(t){return"boolean"==typeof t}function b(t){return null===t}function g(t){return null==t}function S(t){return"number"==typeof t}function d(t){return"string"==typeof t}function v(t){return"symbol"==typeof t}function w(t){return void 0===t}function x(t){return E(t)&&"[object RegExp]"===T(t)}function E(t){return"object"==typeof t&&null!==t}function _(t){return E(t)&&"[object Date]"===T(t)}function M(t){return E(t)&&("[object Error]"===T(t)||t instanceof Error)}function A(t){return"function"==typeof t}function j(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||void 0===t}function T(t){return Object.prototype.toString.call(t)}function F(t){return t<10?"0"+t.toString(10):t.toString(10)}function k(){var t=new Date,r=[F(t.getHours()),F(t.getMinutes()),F(t.getSeconds())].join(":");return[t.getDate(),R[t.getMonth()],r].join(" ")}function z(t,r){return Object.prototype.hasOwnProperty.call(t,r)}var O=/%[sdj%]/g;r.format=function(t){if(!d(t)){for(var r=[],e=0;e<arguments.length;e++)r.push(o(arguments[e]));return r.join(" ")}for(var e=1,n=arguments,i=n.length,a=String(t).replace(O,function(t){if("%%"===t)return"%";if(e>=i)return t;switch(t){case"%s":return String(n[e++]);case"%d":return Number(n[e++]);case"%j":try{return JSON.stringify(n[e++])}catch(t){return"[Circular]"}default:return t}}),u=n[e];e<i;u=n[++e])b(u)||!E(u)?a+=" "+u:a+=" "+o(u);return a},r.deprecate=function(e,o){function i(){if(!a){if(n.throwDeprecation)throw new Error(o);n.traceDeprecation?console.trace(o):console.error(o),a=!0}return e.apply(this,arguments)}if(w(t.process))return function(){return r.deprecate(e,o).apply(this,arguments)};if(!0===n.noDeprecation)return e;var a=!1;return i};var B,D={};r.debuglog=function(t){if(w(B)&&(B=n.env.NODE_DEBUG||""),t=t.toUpperCase(),!D[t])if(new RegExp("\\b"+t+"\\b","i").test(B)){var e=n.pid;D[t]=function(){var n=r.format.apply(r,arguments);console.error("%s %d: %s",t,e,n)}}else D[t]=function(){};return D[t]},r.inspect=o,o.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},o.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},r.isArray=y,r.isBoolean=h,r.isNull=b,r.isNullOrUndefined=g,r.isNumber=S,r.isString=d,r.isSymbol=v,r.isUndefined=w,r.isRegExp=x,r.isObject=E,r.isDate=_,r.isError=M,r.isFunction=A,r.isPrimitive=j,r.isBuffer=e(32);var R=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];r.log=function(){console.log("%s - %s",k(),r.format.apply(r,arguments))},r.inherits=e(31),r._extend=function(t,r){if(!r||!E(r))return t;for(var e=Object.keys(r),n=e.length;n--;)t[e[n]]=r[e[n]];return t}}).call(r,e(5),e(30))}])});

},{}],24:[function(require,module,exports){
'use strict'

module.exports = mouseListen

var mouse = require('mouse-event')

function mouseListen (element, callback) {
  if (!callback) {
    callback = element
    element = window
  }

  var buttonState = 0
  var x = 0
  var y = 0
  var mods = {
    shift: false,
    alt: false,
    control: false,
    meta: false
  }
  var attached = false

  function updateMods (ev) {
    var changed = false
    if ('altKey' in ev) {
      changed = changed || ev.altKey !== mods.alt
      mods.alt = !!ev.altKey
    }
    if ('shiftKey' in ev) {
      changed = changed || ev.shiftKey !== mods.shift
      mods.shift = !!ev.shiftKey
    }
    if ('ctrlKey' in ev) {
      changed = changed || ev.ctrlKey !== mods.control
      mods.control = !!ev.ctrlKey
    }
    if ('metaKey' in ev) {
      changed = changed || ev.metaKey !== mods.meta
      mods.meta = !!ev.metaKey
    }
    return changed
  }

  function handleEvent (nextButtons, ev) {
    var nextX = mouse.x(ev)
    var nextY = mouse.y(ev)
    if ('buttons' in ev) {
      nextButtons = ev.buttons | 0
    }
    if (nextButtons !== buttonState ||
      nextX !== x ||
      nextY !== y ||
      updateMods(ev)) {
      buttonState = nextButtons | 0
      x = nextX || 0
      y = nextY || 0
      callback && callback(buttonState, x, y, mods)
    }
  }

  function clearState (ev) {
    handleEvent(0, ev)
  }

  function handleBlur () {
    if (buttonState ||
      x ||
      y ||
      mods.shift ||
      mods.alt ||
      mods.meta ||
      mods.control) {
      x = y = 0
      buttonState = 0
      mods.shift = mods.alt = mods.control = mods.meta = false
      callback && callback(0, 0, 0, mods)
    }
  }

  function handleMods (ev) {
    if (updateMods(ev)) {
      callback && callback(buttonState, x, y, mods)
    }
  }

  function handleMouseMove (ev) {
    if (mouse.buttons(ev) === 0) {
      handleEvent(0, ev)
    } else {
      handleEvent(buttonState, ev)
    }
  }

  function handleMouseDown (ev) {
    handleEvent(buttonState | mouse.buttons(ev), ev)
  }

  function handleMouseUp (ev) {
    handleEvent(buttonState & ~mouse.buttons(ev), ev)
  }

  function attachListeners () {
    if (attached) {
      return
    }
    attached = true

    element.addEventListener('mousemove', handleMouseMove)

    element.addEventListener('mousedown', handleMouseDown)

    element.addEventListener('mouseup', handleMouseUp)

    element.addEventListener('mouseleave', clearState)
    element.addEventListener('mouseenter', clearState)
    element.addEventListener('mouseout', clearState)
    element.addEventListener('mouseover', clearState)

    element.addEventListener('blur', handleBlur)

    element.addEventListener('keyup', handleMods)
    element.addEventListener('keydown', handleMods)
    element.addEventListener('keypress', handleMods)

    if (element !== window) {
      window.addEventListener('blur', handleBlur)

      window.addEventListener('keyup', handleMods)
      window.addEventListener('keydown', handleMods)
      window.addEventListener('keypress', handleMods)
    }
  }

  function detachListeners () {
    if (!attached) {
      return
    }
    attached = false

    element.removeEventListener('mousemove', handleMouseMove)

    element.removeEventListener('mousedown', handleMouseDown)

    element.removeEventListener('mouseup', handleMouseUp)

    element.removeEventListener('mouseleave', clearState)
    element.removeEventListener('mouseenter', clearState)
    element.removeEventListener('mouseout', clearState)
    element.removeEventListener('mouseover', clearState)

    element.removeEventListener('blur', handleBlur)

    element.removeEventListener('keyup', handleMods)
    element.removeEventListener('keydown', handleMods)
    element.removeEventListener('keypress', handleMods)

    if (element !== window) {
      window.removeEventListener('blur', handleBlur)

      window.removeEventListener('keyup', handleMods)
      window.removeEventListener('keydown', handleMods)
      window.removeEventListener('keypress', handleMods)
    }
  }

  // Attach listeners
  attachListeners()

  var result = {
    element: element
  }

  Object.defineProperties(result, {
    enabled: {
      get: function () { return attached },
      set: function (f) {
        if (f) {
          attachListeners()
        } else {
          detachListeners()
        }
      },
      enumerable: true
    },
    buttons: {
      get: function () { return buttonState },
      enumerable: true
    },
    x: {
      get: function () { return x },
      enumerable: true
    },
    y: {
      get: function () { return y },
      enumerable: true
    },
    mods: {
      get: function () { return mods },
      enumerable: true
    }
  })

  return result
}

},{"mouse-event":25}],25:[function(require,module,exports){
'use strict'

function mouseButtons(ev) {
  if(typeof ev === 'object') {
    if('buttons' in ev) {
      return ev.buttons
    } else if('which' in ev) {
      var b = ev.which
      if(b === 2) {
        return 4
      } else if(b === 3) {
        return 2
      } else if(b > 0) {
        return 1<<(b-1)
      }
    } else if('button' in ev) {
      var b = ev.button
      if(b === 1) {
        return 4
      } else if(b === 2) {
        return 2
      } else if(b >= 0) {
        return 1<<b
      }
    }
  }
  return 0
}
exports.buttons = mouseButtons

function mouseElement(ev) {
  return ev.target || ev.srcElement || window
}
exports.element = mouseElement

function mouseRelativeX(ev) {
  if(typeof ev === 'object') {
    if('offsetX' in ev) {
      return ev.offsetX
    }
    var target = mouseElement(ev)
    var bounds = target.getBoundingClientRect()
    return ev.clientX - bounds.left
  }
  return 0
}
exports.x = mouseRelativeX

function mouseRelativeY(ev) {
  if(typeof ev === 'object') {
    if('offsetY' in ev) {
      return ev.offsetY
    }
    var target = mouseElement(ev)
    var bounds = target.getBoundingClientRect()
    return ev.clientY - bounds.top
  }
  return 0
}
exports.y = mouseRelativeY

},{}],26:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this,require('_process'))
},{"_process":27}],27:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],28:[function(require,module,exports){
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var now = require('right-now')
var raf = require('raf')

module.exports = Engine
function Engine(fn) {
    if (!(this instanceof Engine)) 
        return new Engine(fn)
    this.running = false
    this.last = now()
    this._frame = 0
    this._tick = this.tick.bind(this)

    if (fn)
        this.on('tick', fn)
}

inherits(Engine, EventEmitter)

Engine.prototype.start = function() {
    if (this.running) 
        return
    this.running = true
    this.last = now()
    this._frame = raf(this._tick)
    return this
}

Engine.prototype.stop = function() {
    this.running = false
    if (this._frame !== 0)
        raf.cancel(this._frame)
    this._frame = 0
    return this
}

Engine.prototype.tick = function() {
    this._frame = raf(this._tick)
    var time = now()
    var dt = time - this.last
    this.emit('tick', dt)
    this.last = time
}
},{"events":4,"inherits":22,"raf":29,"right-now":31}],29:[function(require,module,exports){
(function (global){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":26}],30:[function(require,module,exports){
(function(pa,W){"object"===typeof exports&&"undefined"!==typeof module?module.exports=W():"function"===typeof define&&define.amd?define(W):pa.createREGL=W()})(this,function(){function pa(a,b){this.id=Ab++;this.type=a;this.data=b}function W(a){if(0===a.length)return[];var b=a.charAt(0),c=a.charAt(a.length-1);if(1<a.length&&b===c&&('"'===b||"'"===b))return['"'+a.substr(1,a.length-2).replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'];if(b=/\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(a))return W(a.substr(0,
b.index)).concat(W(b[1])).concat(W(a.substr(b.index+b[0].length)));b=a.split(".");if(1===b.length)return['"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'];a=[];for(c=0;c<b.length;++c)a=a.concat(W(b[c]));return a}function Za(a){return"["+W(a).join("][")+"]"}function Bb(){var a={"":0},b=[""];return{id:function(c){var e=a[c];if(e)return e;e=a[c]=b.length;b.push(c);return e},str:function(a){return b[a]}}}function Cb(a,b,c){function e(){var b=window.innerWidth,e=window.innerHeight;a!==document.body&&
(e=a.getBoundingClientRect(),b=e.right-e.left,e=e.bottom-e.top);f.width=c*b;f.height=c*e;D(f.style,{width:b+"px",height:e+"px"})}var f=document.createElement("canvas");D(f.style,{border:0,margin:0,padding:0,top:0,left:0});a.appendChild(f);a===document.body&&(f.style.position="absolute",D(a.style,{margin:0,padding:0}));window.addEventListener("resize",e,!1);e();return{canvas:f,onDestroy:function(){window.removeEventListener("resize",e);a.removeChild(f)}}}function Db(a,b){function c(c){try{return a.getContext(c,
b)}catch(f){return null}}return c("webgl")||c("experimental-webgl")||c("webgl-experimental")}function $a(a){return"string"===typeof a?a.split():a}function ab(a){return"string"===typeof a?document.querySelector(a):a}function Eb(a){var b=a||{},c,e,f,d;a={};var n=[],k=[],r="undefined"===typeof window?1:window.devicePixelRatio,p=!1,u=function(a){},m=function(){};"string"===typeof b?c=document.querySelector(b):"object"===typeof b&&("string"===typeof b.nodeName&&"function"===typeof b.appendChild&&"function"===
typeof b.getBoundingClientRect?c=b:"function"===typeof b.drawArrays||"function"===typeof b.drawElements?(d=b,f=d.canvas):("gl"in b?d=b.gl:"canvas"in b?f=ab(b.canvas):"container"in b&&(e=ab(b.container)),"attributes"in b&&(a=b.attributes),"extensions"in b&&(n=$a(b.extensions)),"optionalExtensions"in b&&(k=$a(b.optionalExtensions)),"onDone"in b&&(u=b.onDone),"profile"in b&&(p=!!b.profile),"pixelRatio"in b&&(r=+b.pixelRatio)));c&&("canvas"===c.nodeName.toLowerCase()?f=c:e=c);if(!d){if(!f){c=Cb(e||document.body,
u,r);if(!c)return null;f=c.canvas;m=c.onDestroy}d=Db(f,a)}return d?{gl:d,canvas:f,container:e,extensions:n,optionalExtensions:k,pixelRatio:r,profile:p,onDone:u,onDestroy:m}:(m(),u("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"),null)}function Fb(a,b){function c(b){b=b.toLowerCase();var c;try{c=e[b]=a.getExtension(b)}catch(f){}return!!c}for(var e={},f=0;f<b.extensions.length;++f){var d=b.extensions[f];if(!c(d))return b.onDestroy(),b.onDone('"'+d+'" extension is not supported by the current WebGL context, try upgrading your system or a different browser'),
null}b.optionalExtensions.forEach(c);return{extensions:e,restore:function(){Object.keys(e).forEach(function(a){if(!c(a))throw Error("(regl): error restoring extension "+a);})}}}function O(a,b){for(var c=Array(a),e=0;e<a;++e)c[e]=b(e);return c}function bb(a){var b,c;b=(65535<a)<<4;a>>>=b;c=(255<a)<<3;a>>>=c;b|=c;c=(15<a)<<2;a>>>=c;b|=c;c=(3<a)<<1;return b|c|a>>>c>>1}function cb(){function a(a){a:{for(var b=16;268435456>=b;b*=16)if(a<=b){a=b;break a}a=0}b=c[bb(a)>>2];return 0<b.length?b.pop():new ArrayBuffer(a)}
function b(a){c[bb(a.byteLength)>>2].push(a)}var c=O(8,function(){return[]});return{alloc:a,free:b,allocType:function(b,c){var d=null;switch(b){case 5120:d=new Int8Array(a(c),0,c);break;case 5121:d=new Uint8Array(a(c),0,c);break;case 5122:d=new Int16Array(a(2*c),0,c);break;case 5123:d=new Uint16Array(a(2*c),0,c);break;case 5124:d=new Int32Array(a(4*c),0,c);break;case 5125:d=new Uint32Array(a(4*c),0,c);break;case 5126:d=new Float32Array(a(4*c),0,c);break;default:return null}return d.length!==c?d.subarray(0,
c):d},freeType:function(a){b(a.buffer)}}}function ka(a){return!!a&&"object"===typeof a&&Array.isArray(a.shape)&&Array.isArray(a.stride)&&"number"===typeof a.offset&&a.shape.length===a.stride.length&&(Array.isArray(a.data)||P(a.data))}function db(a,b,c,e,f,d){for(var n=0;n<b;++n)for(var k=a[n],r=0;r<c;++r)for(var p=k[r],u=0;u<e;++u)f[d++]=p[u]}function eb(a,b,c,e,f){for(var d=1,n=c+1;n<b.length;++n)d*=b[n];var k=b[c];if(4===b.length-c){var r=b[c+1],p=b[c+2];b=b[c+3];for(n=0;n<k;++n)db(a[n],r,p,b,e,
f),f+=d}else for(n=0;n<k;++n)eb(a[n],b,c+1,e,f),f+=d}function Ha(a){return Ia[Object.prototype.toString.call(a)]|0}function fb(a,b){for(var c=0;c<b.length;++c)a[c]=b[c]}function gb(a,b,c,e,f,d,n){for(var k=0,r=0;r<c;++r)for(var p=0;p<e;++p)a[k++]=b[f*r+d*p+n]}function Gb(a,b,c,e){function f(b){this.id=r++;this.buffer=a.createBuffer();this.type=b;this.usage=35044;this.byteLength=0;this.dimension=1;this.dtype=5121;this.persistentData=null;c.profile&&(this.stats={size:0})}function d(b,c,l){b.byteLength=
c.byteLength;a.bufferData(b.type,c,l)}function n(a,b,c,g,h,e){a.usage=c;if(Array.isArray(b)){if(a.dtype=g||5126,0<b.length)if(Array.isArray(b[0])){h=hb(b);for(var t=g=1;t<h.length;++t)g*=h[t];a.dimension=g;b=Qa(b,h,a.dtype);d(a,b,c);e?a.persistentData=b:z.freeType(b)}else"number"===typeof b[0]?(a.dimension=h,h=z.allocType(a.dtype,b.length),fb(h,b),d(a,h,c),e?a.persistentData=h:z.freeType(h)):P(b[0])&&(a.dimension=b[0].length,a.dtype=g||Ha(b[0])||5126,b=Qa(b,[b.length,b[0].length],a.dtype),d(a,b,c),
e?a.persistentData=b:z.freeType(b))}else if(P(b))a.dtype=g||Ha(b),a.dimension=h,d(a,b,c),e&&(a.persistentData=new Uint8Array(new Uint8Array(b.buffer)));else if(ka(b)){h=b.shape;var f=b.stride,t=b.offset,p=0,k=0,r=0,n=0;1===h.length?(p=h[0],k=1,r=f[0],n=0):2===h.length&&(p=h[0],k=h[1],r=f[0],n=f[1]);a.dtype=g||Ha(b.data)||5126;a.dimension=k;h=z.allocType(a.dtype,p*k);gb(h,b.data,p,k,r,n,t);d(a,h,c);e?a.persistentData=h:z.freeType(h)}}function k(c){b.bufferCount--;for(var d=0;d<e.state.length;++d){var l=
e.state[d];l.buffer===c&&(a.disableVertexAttribArray(d),l.buffer=null)}a.deleteBuffer(c.buffer);c.buffer=null;delete p[c.id]}var r=0,p={};f.prototype.bind=function(){a.bindBuffer(this.type,this.buffer)};f.prototype.destroy=function(){k(this)};var u=[];c.profile&&(b.getTotalBufferSize=function(){var a=0;Object.keys(p).forEach(function(b){a+=p[b].stats.size});return a});return{create:function(m,e,l,g){function h(b){var m=35044,e=null,l=0,f=0,p=1;Array.isArray(b)||P(b)||ka(b)?e=b:"number"===typeof b?
l=b|0:b&&("data"in b&&(e=b.data),"usage"in b&&(m=jb[b.usage]),"type"in b&&(f=Ra[b.type]),"dimension"in b&&(p=b.dimension|0),"length"in b&&(l=b.length|0));d.bind();e?n(d,e,m,f,p,g):(l&&a.bufferData(d.type,l,m),d.dtype=f||5121,d.usage=m,d.dimension=p,d.byteLength=l);c.profile&&(d.stats.size=d.byteLength*la[d.dtype]);return h}b.bufferCount++;var d=new f(e);p[d.id]=d;l||h(m);h._reglType="buffer";h._buffer=d;h.subdata=function(b,c){var g=(c||0)|0,m;d.bind();if(P(b))a.bufferSubData(d.type,g,b);else if(Array.isArray(b)){if(0<
b.length)if("number"===typeof b[0]){var e=z.allocType(d.dtype,b.length);fb(e,b);a.bufferSubData(d.type,g,e);z.freeType(e)}else if(Array.isArray(b[0])||P(b[0]))m=hb(b),e=Qa(b,m,d.dtype),a.bufferSubData(d.type,g,e),z.freeType(e)}else if(ka(b)){m=b.shape;var l=b.stride,f=e=0,p=0,E=0;1===m.length?(e=m[0],f=1,p=l[0],E=0):2===m.length&&(e=m[0],f=m[1],p=l[0],E=l[1]);m=Array.isArray(b.data)?d.dtype:Ha(b.data);m=z.allocType(m,e*f);gb(m,b.data,e,f,p,E,b.offset);a.bufferSubData(d.type,g,m);z.freeType(m)}return h};
c.profile&&(h.stats=d.stats);h.destroy=function(){k(d)};return h},createStream:function(a,b){var c=u.pop();c||(c=new f(a));c.bind();n(c,b,35040,0,1,!1);return c},destroyStream:function(a){u.push(a)},clear:function(){R(p).forEach(k);u.forEach(k)},getBuffer:function(a){return a&&a._buffer instanceof f?a._buffer:null},restore:function(){R(p).forEach(function(b){b.buffer=a.createBuffer();a.bindBuffer(b.type,b.buffer);a.bufferData(b.type,b.persistentData||b.byteLength,b.usage)})},_initBuffer:n}}function Hb(a,
b,c,e){function f(a){this.id=r++;k[this.id]=this;this.buffer=a;this.primType=4;this.type=this.vertCount=0}function d(d,e,l,g,h,f,p){d.buffer.bind();if(e){var k=p;p||P(e)&&(!ka(e)||P(e.data))||(k=b.oes_element_index_uint?5125:5123);c._initBuffer(d.buffer,e,l,k,3)}else a.bufferData(34963,f,l),d.buffer.dtype=k||5121,d.buffer.usage=l,d.buffer.dimension=3,d.buffer.byteLength=f;k=p;if(!p){switch(d.buffer.dtype){case 5121:case 5120:k=5121;break;case 5123:case 5122:k=5123;break;case 5125:case 5124:k=5125}d.buffer.dtype=
k}d.type=k;e=h;0>e&&(e=d.buffer.byteLength,5123===k?e>>=1:5125===k&&(e>>=2));d.vertCount=e;e=g;0>g&&(e=4,g=d.buffer.dimension,1===g&&(e=0),2===g&&(e=1),3===g&&(e=4));d.primType=e}function n(a){e.elementsCount--;delete k[a.id];a.buffer.destroy();a.buffer=null}var k={},r=0,p={uint8:5121,uint16:5123};b.oes_element_index_uint&&(p.uint32=5125);f.prototype.bind=function(){this.buffer.bind()};var u=[];return{create:function(a,b){function l(a){if(a)if("number"===typeof a)g(a),h.primType=4,h.vertCount=a|0,
h.type=5121;else{var b=null,c=35044,e=-1,f=-1,m=0,k=0;if(Array.isArray(a)||P(a)||ka(a))b=a;else if("data"in a&&(b=a.data),"usage"in a&&(c=jb[a.usage]),"primitive"in a&&(e=Sa[a.primitive]),"count"in a&&(f=a.count|0),"type"in a&&(k=p[a.type]),"length"in a)m=a.length|0;else if(m=f,5123===k||5122===k)m*=2;else if(5125===k||5124===k)m*=4;d(h,b,c,e,f,m,k)}else g(),h.primType=4,h.vertCount=0,h.type=5121;return l}var g=c.create(null,34963,!0),h=new f(g._buffer);e.elementsCount++;l(a);l._reglType="elements";
l._elements=h;l.subdata=function(a,b){g.subdata(a,b);return l};l.destroy=function(){n(h)};return l},createStream:function(a){var b=u.pop();b||(b=new f(c.create(null,34963,!0,!1)._buffer));d(b,a,35040,-1,-1,0,0);return b},destroyStream:function(a){u.push(a)},getElements:function(a){return"function"===typeof a&&a._elements instanceof f?a._elements:null},clear:function(){R(k).forEach(n)}}}function kb(a){for(var b=z.allocType(5123,a.length),c=0;c<a.length;++c)if(isNaN(a[c]))b[c]=65535;else if(Infinity===
a[c])b[c]=31744;else if(-Infinity===a[c])b[c]=64512;else{lb[0]=a[c];var e=Ib[0],f=e>>>31<<15,d=(e<<1>>>24)-127,e=e>>13&1023;b[c]=-24>d?f:-14>d?f+(e+1024>>-14-d):15<d?f+31744:f+(d+15<<10)+e}return b}function ra(a){return Array.isArray(a)||P(a)}function Ea(a){return"[object "+a+"]"}function mb(a){return Array.isArray(a)&&(0===a.length||"number"===typeof a[0])}function nb(a){return Array.isArray(a)&&0!==a.length&&ra(a[0])?!0:!1}function ma(a){return Object.prototype.toString.call(a)}function Ta(a){if(!a)return!1;
var b=ma(a);return 0<=Jb.indexOf(b)?!0:mb(a)||nb(a)||ka(a)}function ob(a,b){36193===a.type?(a.data=kb(b),z.freeType(b)):a.data=b}function Ja(a,b,c,e,f,d){a="undefined"!==typeof v[a]?v[a]:S[a]*ha[b];d&&(a*=6);if(f){for(e=0;1<=c;)e+=a*c*c,c/=2;return e}return a*c*e}function Kb(a,b,c,e,f,d,n){function k(){this.format=this.internalformat=6408;this.type=5121;this.flipY=this.premultiplyAlpha=this.compressed=!1;this.unpackAlignment=1;this.colorSpace=37444;this.channels=this.height=this.width=0}function r(a,
b){a.internalformat=b.internalformat;a.format=b.format;a.type=b.type;a.compressed=b.compressed;a.premultiplyAlpha=b.premultiplyAlpha;a.flipY=b.flipY;a.unpackAlignment=b.unpackAlignment;a.colorSpace=b.colorSpace;a.width=b.width;a.height=b.height;a.channels=b.channels}function p(a,b){if("object"===typeof b&&b){"premultiplyAlpha"in b&&(a.premultiplyAlpha=b.premultiplyAlpha);"flipY"in b&&(a.flipY=b.flipY);"alignment"in b&&(a.unpackAlignment=b.alignment);"colorSpace"in b&&(a.colorSpace=ya[b.colorSpace]);
"type"in b&&(a.type=F[b.type]);var c=a.width,e=a.height,d=a.channels,g=!1;"shape"in b?(c=b.shape[0],e=b.shape[1],3===b.shape.length&&(d=b.shape[2],g=!0)):("radius"in b&&(c=e=b.radius),"width"in b&&(c=b.width),"height"in b&&(e=b.height),"channels"in b&&(d=b.channels,g=!0));a.width=c|0;a.height=e|0;a.channels=d|0;c=!1;"format"in b&&(c=b.format,e=a.internalformat=U[c],a.format=Lb[e],c in F&&!("type"in b)&&(a.type=F[c]),c in Y&&(a.compressed=!0),c=!0);!g&&c?a.channels=S[a.format]:g&&!c&&a.channels!==
La[a.format]&&(a.format=a.internalformat=La[a.channels])}}function u(b){a.pixelStorei(37440,b.flipY);a.pixelStorei(37441,b.premultiplyAlpha);a.pixelStorei(37443,b.colorSpace);a.pixelStorei(3317,b.unpackAlignment)}function m(){k.call(this);this.yOffset=this.xOffset=0;this.data=null;this.needsFree=!1;this.element=null;this.needsCopy=!1}function C(a,b){var c=null;Ta(b)?c=b:b&&(p(a,b),"x"in b&&(a.xOffset=b.x|0),"y"in b&&(a.yOffset=b.y|0),Ta(b.data)&&(c=b.data));if(b.copy){var e=f.viewportWidth,d=f.viewportHeight;
a.width=a.width||e-a.xOffset;a.height=a.height||d-a.yOffset;a.needsCopy=!0}else if(!c)a.width=a.width||1,a.height=a.height||1,a.channels=a.channels||4;else if(P(c))a.channels=a.channels||4,a.data=c,"type"in b||5121!==a.type||(a.type=Ia[Object.prototype.toString.call(c)]|0);else if(mb(c)){a.channels=a.channels||4;e=c;d=e.length;switch(a.type){case 5121:case 5123:case 5125:case 5126:d=z.allocType(a.type,d);d.set(e);a.data=d;break;case 36193:a.data=kb(e)}a.alignment=1;a.needsFree=!0}else if(ka(c)){e=
c.data;Array.isArray(e)||5121!==a.type||(a.type=Ia[Object.prototype.toString.call(e)]|0);var d=c.shape,g=c.stride,h,l,q,y;3===d.length?(q=d[2],y=g[2]):y=q=1;h=d[0];l=d[1];d=g[0];g=g[1];a.alignment=1;a.width=h;a.height=l;a.channels=q;a.format=a.internalformat=La[q];a.needsFree=!0;h=y;c=c.offset;q=a.width;y=a.height;l=a.channels;for(var G=z.allocType(36193===a.type?5126:a.type,q*y*l),H=0,ea=0;ea<y;++ea)for(var fa=0;fa<q;++fa)for(var J=0;J<l;++J)G[H++]=e[d*fa+g*ea+h*J+c];ob(a,G)}else if(ma(c)===Ua||
ma(c)===pb)ma(c)===Ua?a.element=c:a.element=c.canvas,a.width=a.element.width,a.height=a.element.height,a.channels=4;else if(ma(c)===qb)a.element=c,a.width=c.width,a.height=c.height,a.channels=4;else if(ma(c)===rb)a.element=c,a.width=c.naturalWidth,a.height=c.naturalHeight,a.channels=4;else if(ma(c)===sb)a.element=c,a.width=c.videoWidth,a.height=c.videoHeight,a.channels=4;else if(nb(c)){e=a.width||c[0].length;d=a.height||c.length;g=a.channels;g=ra(c[0][0])?g||c[0][0].length:g||1;h=Ma.shape(c);q=1;
for(y=0;y<h.length;++y)q*=h[y];q=z.allocType(36193===a.type?5126:a.type,q);Ma.flatten(c,h,"",q);ob(a,q);a.alignment=1;a.width=e;a.height=d;a.channels=g;a.format=a.internalformat=La[g];a.needsFree=!0}}function l(b,c,d,g,h){var l=b.element,f=b.data,k=b.internalformat,q=b.format,y=b.type,G=b.width,H=b.height;u(b);l?a.texSubImage2D(c,h,d,g,q,y,l):b.compressed?a.compressedTexSubImage2D(c,h,d,g,k,G,H,f):b.needsCopy?(e(),a.copyTexSubImage2D(c,h,d,g,b.xOffset,b.yOffset,G,H)):a.texSubImage2D(c,h,d,g,G,H,q,
y,f)}function g(){return K.pop()||new m}function h(a){a.needsFree&&z.freeType(a.data);m.call(a);K.push(a)}function qa(){k.call(this);this.genMipmaps=!1;this.mipmapHint=4352;this.mipmask=0;this.images=Array(16)}function t(a,b,c){var e=a.images[0]=g();a.mipmask=1;e.width=a.width=b;e.height=a.height=c;e.channels=a.channels=4}function B(a,b){var c=null;if(Ta(b))c=a.images[0]=g(),r(c,a),C(c,b),a.mipmask=1;else if(p(a,b),Array.isArray(b.mipmap))for(var e=b.mipmap,d=0;d<e.length;++d)c=a.images[d]=g(),r(c,
a),c.width>>=d,c.height>>=d,C(c,e[d]),a.mipmask|=1<<d;else c=a.images[0]=g(),r(c,a),C(c,b),a.mipmask=1;r(a,a.images[0])}function X(b,c){for(var d=b.images,g=0;g<d.length&&d[g];++g){var h=d[g],l=c,f=g,k=h.element,q=h.data,y=h.internalformat,G=h.format,H=h.type,ea=h.width,fa=h.height,J=h.channels;u(h);k?a.texImage2D(l,f,G,G,H,k):h.compressed?a.compressedTexImage2D(l,f,y,ea,fa,0,q):h.needsCopy?(e(),a.copyTexImage2D(l,f,G,h.xOffset,h.yOffset,ea,fa,0)):((h=!q)&&(q=z.zero.allocType(H,ea*fa*J)),a.texImage2D(l,
f,G,ea,fa,0,G,H,q),h&&q&&z.zero.freeType(q))}}function x(){var a=tb.pop()||new qa;k.call(a);for(var b=a.mipmask=0;16>b;++b)a.images[b]=null;return a}function ib(a){for(var b=a.images,c=0;c<b.length;++c)b[c]&&h(b[c]),b[c]=null;tb.push(a)}function v(){this.magFilter=this.minFilter=9728;this.wrapT=this.wrapS=33071;this.anisotropic=1;this.genMipmaps=!1;this.mipmapHint=4352}function N(a,b){"min"in b&&(a.minFilter=Va[b.min],0<=Mb.indexOf(a.minFilter)&&!("faces"in b)&&(a.genMipmaps=!0));"mag"in b&&(a.magFilter=
V[b.mag]);var c=a.wrapS,d=a.wrapT;if("wrap"in b){var e=b.wrap;"string"===typeof e?c=d=L[e]:Array.isArray(e)&&(c=L[e[0]],d=L[e[1]])}else"wrapS"in b&&(c=L[b.wrapS]),"wrapT"in b&&(d=L[b.wrapT]);a.wrapS=c;a.wrapT=d;"anisotropic"in b&&(a.anisotropic=b.anisotropic);if("mipmap"in b){c=!1;switch(typeof b.mipmap){case "string":a.mipmapHint=A[b.mipmap];c=a.genMipmaps=!0;break;case "boolean":c=a.genMipmaps=b.mipmap;break;case "object":a.genMipmaps=!1,c=!0}!c||"min"in b||(a.minFilter=9984)}}function Q(c,d){a.texParameteri(d,
10241,c.minFilter);a.texParameteri(d,10240,c.magFilter);a.texParameteri(d,10242,c.wrapS);a.texParameteri(d,10243,c.wrapT);b.ext_texture_filter_anisotropic&&a.texParameteri(d,34046,c.anisotropic);c.genMipmaps&&(a.hint(33170,c.mipmapHint),a.generateMipmap(d))}function E(b){k.call(this);this.mipmask=0;this.internalformat=6408;this.id=za++;this.refCount=1;this.target=b;this.texture=a.createTexture();this.unit=-1;this.bindCount=0;this.texInfo=new v;n.profile&&(this.stats={size:0})}function T(b){a.activeTexture(33984);
a.bindTexture(b.target,b.texture)}function Ba(){var b=na[0];b?a.bindTexture(b.target,b.texture):a.bindTexture(3553,null)}function w(b){var c=b.texture,e=b.unit,g=b.target;0<=e&&(a.activeTexture(33984+e),a.bindTexture(g,null),na[e]=null);a.deleteTexture(c);b.texture=null;b.params=null;b.pixels=null;b.refCount=0;delete Z[b.id];d.textureCount--}var A={"don't care":4352,"dont care":4352,nice:4354,fast:4353},L={repeat:10497,clamp:33071,mirror:33648},V={nearest:9728,linear:9729},Va=D({mipmap:9987,"nearest mipmap nearest":9984,
"linear mipmap nearest":9985,"nearest mipmap linear":9986,"linear mipmap linear":9987},V),ya={none:0,browser:37444},F={uint8:5121,rgba4:32819,rgb565:33635,"rgb5 a1":32820},U={alpha:6406,luminance:6409,"luminance alpha":6410,rgb:6407,rgba:6408,rgba4:32854,"rgb5 a1":32855,rgb565:36194},Y={};b.ext_srgb&&(U.srgb=35904,U.srgba=35906);b.oes_texture_float&&(F.float32=F["float"]=5126);b.oes_texture_half_float&&(F.float16=F["half float"]=36193);b.webgl_depth_texture&&(D(U,{depth:6402,"depth stencil":34041}),
D(F,{uint16:5123,uint32:5125,"depth stencil":34042}));b.webgl_compressed_texture_s3tc&&D(Y,{"rgb s3tc dxt1":33776,"rgba s3tc dxt1":33777,"rgba s3tc dxt3":33778,"rgba s3tc dxt5":33779});b.webgl_compressed_texture_atc&&D(Y,{"rgb atc":35986,"rgba atc explicit alpha":35987,"rgba atc interpolated alpha":34798});b.webgl_compressed_texture_pvrtc&&D(Y,{"rgb pvrtc 4bppv1":35840,"rgb pvrtc 2bppv1":35841,"rgba pvrtc 4bppv1":35842,"rgba pvrtc 2bppv1":35843});b.webgl_compressed_texture_etc1&&(Y["rgb etc1"]=36196);
var Nb=Array.prototype.slice.call(a.getParameter(34467));Object.keys(Y).forEach(function(a){var b=Y[a];0<=Nb.indexOf(b)&&(U[a]=b)});var ca=Object.keys(U);c.textureFormats=ca;var O=[];Object.keys(U).forEach(function(a){O[U[a]]=a});var ba=[];Object.keys(F).forEach(function(a){ba[F[a]]=a});var oa=[];Object.keys(V).forEach(function(a){oa[V[a]]=a});var Aa=[];Object.keys(Va).forEach(function(a){Aa[Va[a]]=a});var ia=[];Object.keys(L).forEach(function(a){ia[L[a]]=a});var Lb=ca.reduce(function(a,b){var c=
U[b];6409===c||6406===c||6409===c||6410===c||6402===c||34041===c?a[c]=c:32855===c||0<=b.indexOf("rgba")?a[c]=6408:a[c]=6407;return a},{}),K=[],tb=[],za=0,Z={},ga=c.maxTextureUnits,na=Array(ga).map(function(){return null});D(E.prototype,{bind:function(){this.bindCount+=1;var b=this.unit;if(0>b){for(var c=0;c<ga;++c){var e=na[c];if(e){if(0<e.bindCount)continue;e.unit=-1}na[c]=this;b=c;break}n.profile&&d.maxTextureUnits<b+1&&(d.maxTextureUnits=b+1);this.unit=b;a.activeTexture(33984+b);a.bindTexture(this.target,
this.texture)}return b},unbind:function(){--this.bindCount},decRef:function(){0>=--this.refCount&&w(this)}});n.profile&&(d.getTotalTextureSize=function(){var a=0;Object.keys(Z).forEach(function(b){a+=Z[b].stats.size});return a});return{create2D:function(b,c){function e(a,b){var c=f.texInfo;v.call(c);var d=x();"number"===typeof a?"number"===typeof b?t(d,a|0,b|0):t(d,a|0,a|0):a?(N(c,a),B(d,a)):t(d,1,1);c.genMipmaps&&(d.mipmask=(d.width<<1)-1);f.mipmask=d.mipmask;r(f,d);f.internalformat=d.internalformat;
e.width=d.width;e.height=d.height;T(f);X(d,3553);Q(c,3553);Ba();ib(d);n.profile&&(f.stats.size=Ja(f.internalformat,f.type,d.width,d.height,c.genMipmaps,!1));e.format=O[f.internalformat];e.type=ba[f.type];e.mag=oa[c.magFilter];e.min=Aa[c.minFilter];e.wrapS=ia[c.wrapS];e.wrapT=ia[c.wrapT];return e}var f=new E(3553);Z[f.id]=f;d.textureCount++;e(b,c);e.subimage=function(a,b,c,d){b|=0;c|=0;d|=0;var q=g();r(q,f);q.width=0;q.height=0;C(q,a);q.width=q.width||(f.width>>d)-b;q.height=q.height||(f.height>>d)-
c;T(f);l(q,3553,b,c,d);Ba();h(q);return e};e.resize=function(b,c){var d=b|0,g=c|0||d;if(d===f.width&&g===f.height)return e;e.width=f.width=d;e.height=f.height=g;T(f);for(var q,y=f.channels,G=f.type,H=0;f.mipmask>>H;++H){var ea=d>>H,fa=g>>H;if(!ea||!fa)break;q=z.zero.allocType(G,ea*fa*y);a.texImage2D(3553,H,f.format,ea,fa,0,f.format,f.type,q);q&&z.zero.freeType(q)}Ba();n.profile&&(f.stats.size=Ja(f.internalformat,f.type,d,g,!1,!1));return e};e._reglType="texture2d";e._texture=f;n.profile&&(e.stats=
f.stats);e.destroy=function(){f.decRef()};return e},createCube:function(b,c,e,f,k,m){function A(a,b,c,d,e,J){var I,da=w.texInfo;v.call(da);for(I=0;6>I;++I)q[I]=x();if("number"===typeof a||!a)for(a=a|0||1,I=0;6>I;++I)t(q[I],a,a);else if("object"===typeof a)if(b)B(q[0],a),B(q[1],b),B(q[2],c),B(q[3],d),B(q[4],e),B(q[5],J);else if(N(da,a),p(w,a),"faces"in a)for(a=a.faces,I=0;6>I;++I)r(q[I],w),B(q[I],a[I]);else for(I=0;6>I;++I)B(q[I],a);r(w,q[0]);w.mipmask=da.genMipmaps?(q[0].width<<1)-1:q[0].mipmask;
w.internalformat=q[0].internalformat;A.width=q[0].width;A.height=q[0].height;T(w);for(I=0;6>I;++I)X(q[I],34069+I);Q(da,34067);Ba();n.profile&&(w.stats.size=Ja(w.internalformat,w.type,A.width,A.height,da.genMipmaps,!0));A.format=O[w.internalformat];A.type=ba[w.type];A.mag=oa[da.magFilter];A.min=Aa[da.minFilter];A.wrapS=ia[da.wrapS];A.wrapT=ia[da.wrapT];for(I=0;6>I;++I)ib(q[I]);return A}var w=new E(34067);Z[w.id]=w;d.cubeCount++;var q=Array(6);A(b,c,e,f,k,m);A.subimage=function(a,b,c,q,d){c|=0;q|=0;
d|=0;var e=g();r(e,w);e.width=0;e.height=0;C(e,b);e.width=e.width||(w.width>>d)-c;e.height=e.height||(w.height>>d)-q;T(w);l(e,34069+a,c,q,d);Ba();h(e);return A};A.resize=function(b){b|=0;if(b!==w.width){A.width=w.width=b;A.height=w.height=b;T(w);for(var c=0;6>c;++c)for(var q=0;w.mipmask>>q;++q)a.texImage2D(34069+c,q,w.format,b>>q,b>>q,0,w.format,w.type,null);Ba();n.profile&&(w.stats.size=Ja(w.internalformat,w.type,A.width,A.height,!1,!0));return A}};A._reglType="textureCube";A._texture=w;n.profile&&
(A.stats=w.stats);A.destroy=function(){w.decRef()};return A},clear:function(){for(var b=0;b<ga;++b)a.activeTexture(33984+b),a.bindTexture(3553,null),na[b]=null;R(Z).forEach(w);d.cubeCount=0;d.textureCount=0},getTexture:function(a){return null},restore:function(){R(Z).forEach(function(b){b.texture=a.createTexture();a.bindTexture(b.target,b.texture);for(var c=0;32>c;++c)if(0!==(b.mipmask&1<<c))if(3553===b.target)a.texImage2D(3553,c,b.internalformat,b.width>>c,b.height>>c,0,b.internalformat,b.type,null);
else for(var e=0;6>e;++e)a.texImage2D(34069+e,c,b.internalformat,b.width>>c,b.height>>c,0,b.internalformat,b.type,null);Q(b.texInfo,b.target)})}}}function Ob(a,b,c,e,f,d){function n(a,b,c){this.target=a;this.texture=b;this.renderbuffer=c;var e=a=0;b?(a=b.width,e=b.height):c&&(a=c.width,e=c.height);this.width=a;this.height=e}function k(a){a&&(a.texture&&a.texture._texture.decRef(),a.renderbuffer&&a.renderbuffer._renderbuffer.decRef())}function r(a,b,c){a&&(a.texture?a.texture._texture.refCount+=1:
a.renderbuffer._renderbuffer.refCount+=1)}function p(b,c){c&&(c.texture?a.framebufferTexture2D(36160,b,c.target,c.texture._texture.texture,0):a.framebufferRenderbuffer(36160,b,36161,c.renderbuffer._renderbuffer.renderbuffer))}function u(a){var b=3553,c=null,e=null,d=a;"object"===typeof a&&(d=a.data,"target"in a&&(b=a.target|0));a=d._reglType;"texture2d"===a?c=d:"textureCube"===a?c=d:"renderbuffer"===a&&(e=d,b=36161);return new n(b,c,e)}function m(a,b,c,d,g){if(c)return a=e.create2D({width:a,height:b,
format:d,type:g}),a._texture.refCount=0,new n(3553,a,null);a=f.create({width:a,height:b,format:d});a._renderbuffer.refCount=0;return new n(36161,null,a)}function C(a){return a&&(a.texture||a.renderbuffer)}function l(a,b,c){a&&(a.texture?a.texture.resize(b,c):a.renderbuffer&&a.renderbuffer.resize(b,c))}function g(){this.id=N++;Q[this.id]=this;this.framebuffer=a.createFramebuffer();this.height=this.width=0;this.colorAttachments=[];this.depthStencilAttachment=this.stencilAttachment=this.depthAttachment=
null}function h(a){a.colorAttachments.forEach(k);k(a.depthAttachment);k(a.stencilAttachment);k(a.depthStencilAttachment)}function qa(b){a.deleteFramebuffer(b.framebuffer);b.framebuffer=null;d.framebufferCount--;delete Q[b.id]}function t(b){var e;a.bindFramebuffer(36160,b.framebuffer);var d=b.colorAttachments;for(e=0;e<d.length;++e)p(36064+e,d[e]);for(e=d.length;e<c.maxColorAttachments;++e)a.framebufferTexture2D(36160,36064+e,3553,null,0);a.framebufferTexture2D(36160,33306,3553,null,0);a.framebufferTexture2D(36160,
36096,3553,null,0);a.framebufferTexture2D(36160,36128,3553,null,0);p(36096,b.depthAttachment);p(36128,b.stencilAttachment);p(33306,b.depthStencilAttachment);a.checkFramebufferStatus(36160);a.bindFramebuffer(36160,X.next?X.next.framebuffer:null);X.cur=X.next;a.getError()}function B(a,b){function c(a,b){var d,g=0,f=0,l=!0,k=!0;d=null;var p=!0,n="rgba",B="uint8",qa=1,ba=null,oa=null,X=null,ia=!1;if("number"===typeof a)g=a|0,f=b|0||g;else if(a){"shape"in a?(f=a.shape,g=f[0],f=f[1]):("radius"in a&&(g=
f=a.radius),"width"in a&&(g=a.width),"height"in a&&(f=a.height));if("color"in a||"colors"in a)d=a.color||a.colors,Array.isArray(d);if(!d){"colorCount"in a&&(qa=a.colorCount|0);"colorTexture"in a&&(p=!!a.colorTexture,n="rgba4");if("colorType"in a&&(B=a.colorType,!p))if("half float"===B||"float16"===B)n="rgba16f";else if("float"===B||"float32"===B)n="rgba32f";"colorFormat"in a&&(n=a.colorFormat,0<=z.indexOf(n)?p=!0:0<=x.indexOf(n)&&(p=!1))}if("depthTexture"in a||"depthStencilTexture"in a)ia=!(!a.depthTexture&&
!a.depthStencilTexture);"depth"in a&&("boolean"===typeof a.depth?l=a.depth:(ba=a.depth,k=!1));"stencil"in a&&("boolean"===typeof a.stencil?k=a.stencil:(oa=a.stencil,l=!1));"depthStencil"in a&&("boolean"===typeof a.depthStencil?l=k=a.depthStencil:(X=a.depthStencil,k=l=!1))}else g=f=1;var E=null,v=null,D=null,T=null;if(Array.isArray(d))E=d.map(u);else if(d)E=[u(d)];else for(E=Array(qa),d=0;d<qa;++d)E[d]=m(g,f,p,n,B);g=g||E[0].width;f=f||E[0].height;ba?v=u(ba):l&&!k&&(v=m(g,f,ia,"depth","uint32"));oa?
D=u(oa):k&&!l&&(D=m(g,f,!1,"stencil","uint8"));X?T=u(X):!ba&&!oa&&k&&l&&(T=m(g,f,ia,"depth stencil","depth stencil"));l=null;for(d=0;d<E.length;++d)r(E[d],g,f),E[d]&&E[d].texture&&(k=Wa[E[d].texture._texture.format]*Na[E[d].texture._texture.type],null===l&&(l=k));r(v,g,f);r(D,g,f);r(T,g,f);h(e);e.width=g;e.height=f;e.colorAttachments=E;e.depthAttachment=v;e.stencilAttachment=D;e.depthStencilAttachment=T;c.color=E.map(C);c.depth=C(v);c.stencil=C(D);c.depthStencil=C(T);c.width=e.width;c.height=e.height;
t(e);return c}var e=new g;d.framebufferCount++;c(a,b);return D(c,{resize:function(a,b){var d=a|0,g=b|0||d;if(d===e.width&&g===e.height)return c;for(var f=e.colorAttachments,h=0;h<f.length;++h)l(f[h],d,g);l(e.depthAttachment,d,g);l(e.stencilAttachment,d,g);l(e.depthStencilAttachment,d,g);e.width=c.width=d;e.height=c.height=g;t(e);return c},_reglType:"framebuffer",_framebuffer:e,destroy:function(){qa(e);h(e)},use:function(a){X.setFBO({framebuffer:c},a)}})}var X={cur:null,next:null,dirty:!1,setFBO:null},
z=["rgba"],x=["rgba4","rgb565","rgb5 a1"];b.ext_srgb&&x.push("srgba");b.ext_color_buffer_half_float&&x.push("rgba16f","rgb16f");b.webgl_color_buffer_float&&x.push("rgba32f");var v=["uint8"];b.oes_texture_half_float&&v.push("half float","float16");b.oes_texture_float&&v.push("float","float32");var N=0,Q={};return D(X,{getFramebuffer:function(a){return"function"===typeof a&&"framebuffer"===a._reglType&&(a=a._framebuffer,a instanceof g)?a:null},create:B,createCube:function(a){function b(a){var d,g={color:null},
f=0,h=null;d="rgba";var l="uint8",k=1;if("number"===typeof a)f=a|0;else if(a){"shape"in a?f=a.shape[0]:("radius"in a&&(f=a.radius|0),"width"in a?f=a.width|0:"height"in a&&(f=a.height|0));if("color"in a||"colors"in a)h=a.color||a.colors,Array.isArray(h);h||("colorCount"in a&&(k=a.colorCount|0),"colorType"in a&&(l=a.colorType),"colorFormat"in a&&(d=a.colorFormat));"depth"in a&&(g.depth=a.depth);"stencil"in a&&(g.stencil=a.stencil);"depthStencil"in a&&(g.depthStencil=a.depthStencil)}else f=1;if(h)if(Array.isArray(h))for(a=
[],d=0;d<h.length;++d)a[d]=h[d];else a=[h];else for(a=Array(k),h={radius:f,format:d,type:l},d=0;d<k;++d)a[d]=e.createCube(h);g.color=Array(a.length);for(d=0;d<a.length;++d)k=a[d],f=f||k.width,g.color[d]={target:34069,data:a[d]};for(d=0;6>d;++d){for(k=0;k<a.length;++k)g.color[k].target=34069+d;0<d&&(g.depth=c[0].depth,g.stencil=c[0].stencil,g.depthStencil=c[0].depthStencil);if(c[d])c[d](g);else c[d]=B(g)}return D(b,{width:f,height:f,color:a})}var c=Array(6);b(a);return D(b,{faces:c,resize:function(a){var d=
a|0;if(d===b.width)return b;var e=b.color;for(a=0;a<e.length;++a)e[a].resize(d);for(a=0;6>a;++a)c[a].resize(d);b.width=b.height=d;return b},_reglType:"framebufferCube",destroy:function(){c.forEach(function(a){a.destroy()})}})},clear:function(){R(Q).forEach(qa)},restore:function(){R(Q).forEach(function(b){b.framebuffer=a.createFramebuffer();t(b)})}})}function ub(){this.w=this.z=this.y=this.x=this.state=0;this.buffer=null;this.size=0;this.normalized=!1;this.type=5126;this.divisor=this.stride=this.offset=
0}function Pb(a,b,c,e){a=c.maxAttributes;b=Array(a);for(c=0;c<a;++c)b[c]=new ub;return{Record:ub,scope:{},state:b}}function Qb(a,b,c,e){function f(a,b,c,d){this.name=a;this.id=b;this.location=c;this.info=d}function d(a,b){for(var c=0;c<a.length;++c)if(a[c].id===b.id){a[c].location=b.location;return}a.push(b)}function n(c,d,e){e=35632===c?p:u;var f=e[d];if(!f){var l=b.str(d),f=a.createShader(c);a.shaderSource(f,l);a.compileShader(f);e[d]=f}return f}function k(a,b){this.id=l++;this.fragId=a;this.vertId=
b;this.program=null;this.uniforms=[];this.attributes=[];e.profile&&(this.stats={uniformsCount:0,attributesCount:0})}function r(c,h){var l,k;l=n(35632,c.fragId);k=n(35633,c.vertId);var p=c.program=a.createProgram();a.attachShader(p,l);a.attachShader(p,k);a.linkProgram(p);var m=a.getProgramParameter(p,35718);e.profile&&(c.stats.uniformsCount=m);var r=c.uniforms;for(l=0;l<m;++l)if(k=a.getActiveUniform(p,l))if(1<k.size)for(var u=0;u<k.size;++u){var C=k.name.replace("[0]","["+u+"]");d(r,new f(C,b.id(C),
a.getUniformLocation(p,C),k))}else d(r,new f(k.name,b.id(k.name),a.getUniformLocation(p,k.name),k));m=a.getProgramParameter(p,35721);e.profile&&(c.stats.attributesCount=m);r=c.attributes;for(l=0;l<m;++l)(k=a.getActiveAttrib(p,l))&&d(r,new f(k.name,b.id(k.name),a.getAttribLocation(p,k.name),k))}var p={},u={},m={},C=[],l=0;e.profile&&(c.getMaxUniformsCount=function(){var a=0;C.forEach(function(b){b.stats.uniformsCount>a&&(a=b.stats.uniformsCount)});return a},c.getMaxAttributesCount=function(){var a=
0;C.forEach(function(b){b.stats.attributesCount>a&&(a=b.stats.attributesCount)});return a});return{clear:function(){var b=a.deleteShader.bind(a);R(p).forEach(b);p={};R(u).forEach(b);u={};C.forEach(function(b){a.deleteProgram(b.program)});C.length=0;m={};c.shaderCount=0},program:function(a,b,d){var e=m[b];e||(e=m[b]={});var f=e[a];f||(f=new k(b,a),c.shaderCount++,r(f,d),e[a]=f,C.push(f));return f},restore:function(){p={};u={};for(var a=0;a<C.length;++a)r(C[a])},shader:n,frag:-1,vert:-1}}function Rb(a,
b,c,e,f,d,n){function k(d){var f;f=null===b.next?5121:b.next.colorAttachments[0].texture._texture.type;var k=0,r=0,l=e.framebufferWidth,g=e.framebufferHeight,h=null;P(d)?h=d:d&&(k=d.x|0,r=d.y|0,l=(d.width||e.framebufferWidth-k)|0,g=(d.height||e.framebufferHeight-r)|0,h=d.data||null);c();d=l*g*4;h||(5121===f?h=new Uint8Array(d):5126===f&&(h=h||new Float32Array(d)));a.pixelStorei(3333,4);a.readPixels(k,r,l,g,6408,f,h);return h}function r(a){var c;b.setFBO({framebuffer:a.framebuffer},function(){c=k(a)});
return c}return function(a){return a&&"framebuffer"in a?r(a):k(a)}}function va(a){return Array.prototype.slice.call(a)}function Ca(a){return va(a).join("")}function Sb(){function a(){var a=[],b=[];return D(function(){a.push.apply(a,va(arguments))},{def:function(){var d="v"+c++;b.push(d);0<arguments.length&&(a.push(d,"="),a.push.apply(a,va(arguments)),a.push(";"));return d},toString:function(){return Ca([0<b.length?"var "+b+";":"",Ca(a)])}})}function b(){function b(a,e){d(a,e,"=",c.def(a,e),";")}var c=
a(),d=a(),e=c.toString,f=d.toString;return D(function(){c.apply(c,va(arguments))},{def:c.def,entry:c,exit:d,save:b,set:function(a,d,e){b(a,d);c(a,d,"=",e,";")},toString:function(){return e()+f()}})}var c=0,e=[],f=[],d=a(),n={};return{global:d,link:function(a){for(var b=0;b<f.length;++b)if(f[b]===a)return e[b];b="g"+c++;e.push(b);f.push(a);return b},block:a,proc:function(a,c){function d(){var a="a"+e.length;e.push(a);return a}var e=[];c=c||0;for(var f=0;f<c;++f)d();var f=b(),C=f.toString;return n[a]=
D(f,{arg:d,toString:function(){return Ca(["function(",e.join(),"){",C(),"}"])}})},scope:b,cond:function(){var a=Ca(arguments),c=b(),d=b(),e=c.toString,f=d.toString;return D(c,{then:function(){c.apply(c,va(arguments));return this},"else":function(){d.apply(d,va(arguments));return this},toString:function(){var b=f();b&&(b="else{"+b+"}");return Ca(["if(",a,"){",e(),"}",b])}})},compile:function(){var a=['"use strict";',d,"return {"];Object.keys(n).forEach(function(b){a.push('"',b,'":',n[b].toString(),
",")});a.push("}");var b=Ca(a).replace(/;/g,";\n").replace(/}/g,"}\n").replace(/{/g,"{\n");return Function.apply(null,e.concat(b)).apply(null,f)}}}function Oa(a){return Array.isArray(a)||P(a)||ka(a)}function vb(a){return a.sort(function(a,c){return"viewport"===a?-1:"viewport"===c?1:a<c?-1:1})}function aa(a,b,c,e){this.thisDep=a;this.contextDep=b;this.propDep=c;this.append=e}function wa(a){return a&&!(a.thisDep||a.contextDep||a.propDep)}function x(a){return new aa(!1,!1,!1,a)}function K(a,b){var c=
a.type;return 0===c?(c=a.data.length,new aa(!0,1<=c,2<=c,b)):4===c?(c=a.data,new aa(c.thisDep,c.contextDep,c.propDep,b)):new aa(3===c,2===c,1===c,b)}function Tb(a,b,c,e,f,d,n,k,r,p,u,m,C,l,g){function h(a){return a.replace(".","_")}function v(a,b,c){var d=h(a);Ka.push(a);Fa[d]=sa[d]=!!c;ta[d]=b}function t(a,b,c){var d=h(a);Ka.push(a);Array.isArray(c)?(sa[d]=c.slice(),Fa[d]=c.slice()):sa[d]=Fa[d]=c;ua[d]=b}function B(){var a=Sb(),c=a.link,d=a.global;a.id=va++;a.batchId="0";var e=c(pa),f=a.shared={props:"a0"};
Object.keys(pa).forEach(function(a){f[a]=d.def(e,".",a)});var g=a.next={},J=a.current={};Object.keys(ua).forEach(function(a){Array.isArray(sa[a])&&(g[a]=d.def(f.next,".",a),J[a]=d.def(f.current,".",a))});var I=a.constants={};Object.keys(ha).forEach(function(a){I[a]=d.def(JSON.stringify(ha[a]))});a.invoke=function(b,d){switch(d.type){case 0:var e=["this",f.context,f.props,a.batchId];return b.def(c(d.data),".call(",e.slice(0,Math.max(d.data.length+1,4)),")");case 1:return b.def(f.props,d.data);case 2:return b.def(f.context,
d.data);case 3:return b.def("this",d.data);case 4:return d.data.append(a,b),d.data.ref}};a.attribCache={};var da={};a.scopeAttrib=function(a){a=b.id(a);if(a in da)return da[a];var d=p.scope[a];d||(d=p.scope[a]=new za);return da[a]=c(d)};return a}function X(a){var b=a["static"];a=a.dynamic;var c;if("profile"in b){var d=!!b.profile;c=x(function(a,b){return d});c.enable=d}else if("profile"in a){var e=a.profile;c=K(e,function(a,b){return a.invoke(b,e)})}return c}function z(a,b){var c=a["static"],d=a.dynamic;
if("framebuffer"in c){var e=c.framebuffer;return e?(e=k.getFramebuffer(e),x(function(a,b){var c=a.link(e),d=a.shared;b.set(d.framebuffer,".next",c);d=d.context;b.set(d,".framebufferWidth",c+".width");b.set(d,".framebufferHeight",c+".height");return c})):x(function(a,b){var c=a.shared;b.set(c.framebuffer,".next","null");c=c.context;b.set(c,".framebufferWidth",c+".drawingBufferWidth");b.set(c,".framebufferHeight",c+".drawingBufferHeight");return"null"})}if("framebuffer"in d){var f=d.framebuffer;return K(f,
function(a,b){var c=a.invoke(b,f),d=a.shared,e=d.framebuffer,c=b.def(e,".getFramebuffer(",c,")");b.set(e,".next",c);d=d.context;b.set(d,".framebufferWidth",c+"?"+c+".width:"+d+".drawingBufferWidth");b.set(d,".framebufferHeight",c+"?"+c+".height:"+d+".drawingBufferHeight");return c})}return null}function D(a,b,c){function d(a){if(a in e){var c=e[a];a=!0;var q=c.x|0,xa=c.y|0,g,J;"width"in c?g=c.width|0:a=!1;"height"in c?J=c.height|0:a=!1;return new aa(!a&&b&&b.thisDep,!a&&b&&b.contextDep,!a&&b&&b.propDep,
function(a,b){var d=a.shared.context,e=g;"width"in c||(e=b.def(d,".","framebufferWidth","-",q));var f=J;"height"in c||(f=b.def(d,".","framebufferHeight","-",xa));return[q,xa,e,f]})}if(a in f){var G=f[a];a=K(G,function(a,b){var c=a.invoke(b,G),d=a.shared.context,e=b.def(c,".x|0"),q=b.def(c,".y|0"),f=b.def('"width" in ',c,"?",c,".width|0:","(",d,".","framebufferWidth","-",e,")"),c=b.def('"height" in ',c,"?",c,".height|0:","(",d,".","framebufferHeight","-",q,")");return[e,q,f,c]});b&&(a.thisDep=a.thisDep||
b.thisDep,a.contextDep=a.contextDep||b.contextDep,a.propDep=a.propDep||b.propDep);return a}return b?new aa(b.thisDep,b.contextDep,b.propDep,function(a,b){var c=a.shared.context;return[0,0,b.def(c,".","framebufferWidth"),b.def(c,".","framebufferHeight")]}):null}var e=a["static"],f=a.dynamic;if(a=d("viewport")){var g=a;a=new aa(a.thisDep,a.contextDep,a.propDep,function(a,b){var c=g.append(a,b),d=a.shared.context;b.set(d,".viewportWidth",c[2]);b.set(d,".viewportHeight",c[3]);return c})}return{viewport:a,
scissor_box:d("scissor.box")}}function P(a){function c(a){if(a in d){var q=b.id(d[a]);a=x(function(){return q});a.id=q;return a}if(a in e){var f=e[a];return K(f,function(a,b){var c=a.invoke(b,f);return b.def(a.shared.strings,".id(",c,")")})}return null}var d=a["static"],e=a.dynamic,f=c("frag"),g=c("vert"),J=null;wa(f)&&wa(g)?(J=u.program(g.id,f.id),a=x(function(a,b){return a.link(J)})):a=new aa(f&&f.thisDep||g&&g.thisDep,f&&f.contextDep||g&&g.contextDep,f&&f.propDep||g&&g.propDep,function(a,b){var c=
a.shared.shader,d;d=f?f.append(a,b):b.def(c,".","frag");var e;e=g?g.append(a,b):b.def(c,".","vert");return b.def(c+".program("+e+","+d+")")});return{frag:f,vert:g,progVar:a,program:J}}function N(a,b){function c(a,b){if(a in e){var d=e[a]|0;return x(function(a,c){b&&(a.OFFSET=d);return d})}if(a in f){var q=f[a];return K(q,function(a,c){var d=a.invoke(c,q);b&&(a.OFFSET=d);return d})}return b&&g?x(function(a,b){a.OFFSET="0";return 0}):null}var e=a["static"],f=a.dynamic,g=function(){if("elements"in e){var a=
e.elements;Oa(a)?a=d.getElements(d.create(a,!0)):a&&(a=d.getElements(a));var b=x(function(b,c){if(a){var d=b.link(a);return b.ELEMENTS=d}return b.ELEMENTS=null});b.value=a;return b}if("elements"in f){var c=f.elements;return K(c,function(a,b){var d=a.shared,e=d.isBufferArgs,d=d.elements,q=a.invoke(b,c),f=b.def("null"),e=b.def(e,"(",q,")"),q=a.cond(e).then(f,"=",d,".createStream(",q,");")["else"](f,"=",d,".getElements(",q,");");b.entry(q);b.exit(a.cond(e).then(d,".destroyStream(",f,");"));return a.ELEMENTS=
f})}return null}(),J=c("offset",!0);return{elements:g,primitive:function(){if("primitive"in e){var a=e.primitive;return x(function(b,c){return Sa[a]})}if("primitive"in f){var b=f.primitive;return K(b,function(a,c){var d=a.constants.primTypes,e=a.invoke(c,b);return c.def(d,"[",e,"]")})}return g?wa(g)?g.value?x(function(a,b){return b.def(a.ELEMENTS,".primType")}):x(function(){return 4}):new aa(g.thisDep,g.contextDep,g.propDep,function(a,b){var c=a.ELEMENTS;return b.def(c,"?",c,".primType:",4)}):null}(),
count:function(){if("count"in e){var a=e.count|0;return x(function(){return a})}if("count"in f){var b=f.count;return K(b,function(a,c){return a.invoke(c,b)})}return g?wa(g)?g?J?new aa(J.thisDep,J.contextDep,J.propDep,function(a,b){return b.def(a.ELEMENTS,".vertCount-",a.OFFSET)}):x(function(a,b){return b.def(a.ELEMENTS,".vertCount")}):x(function(){return-1}):new aa(g.thisDep||J.thisDep,g.contextDep||J.contextDep,g.propDep||J.propDep,function(a,b){var c=a.ELEMENTS;return a.OFFSET?b.def(c,"?",c,".vertCount-",
a.OFFSET,":-1"):b.def(c,"?",c,".vertCount:-1")}):null}(),instances:c("instances",!1),offset:J}}function Q(a,b){var c=a["static"],d=a.dynamic,e={};Ka.forEach(function(a){function b(q,g){if(a in c){var y=q(c[a]);e[f]=x(function(){return y})}else if(a in d){var l=d[a];e[f]=K(l,function(a,b){return g(a,b,a.invoke(b,l))})}}var f=h(a);switch(a){case "cull.enable":case "blend.enable":case "dither":case "stencil.enable":case "depth.enable":case "scissor.enable":case "polygonOffset.enable":case "sample.alpha":case "sample.enable":case "depth.mask":return b(function(a){return a},
function(a,b,c){return c});case "depth.func":return b(function(a){return Xa[a]},function(a,b,c){return b.def(a.constants.compareFuncs,"[",c,"]")});case "depth.range":return b(function(a){return a},function(a,b,c){a=b.def("+",c,"[0]");b=b.def("+",c,"[1]");return[a,b]});case "blend.func":return b(function(a){return[Ga["srcRGB"in a?a.srcRGB:a.src],Ga["dstRGB"in a?a.dstRGB:a.dst],Ga["srcAlpha"in a?a.srcAlpha:a.src],Ga["dstAlpha"in a?a.dstAlpha:a.dst]]},function(a,b,c){function d(a,e){return b.def('"',
a,e,'" in ',c,"?",c,".",a,e,":",c,".",a)}a=a.constants.blendFuncs;var e=d("src","RGB"),f=d("dst","RGB"),e=b.def(a,"[",e,"]"),q=b.def(a,"[",d("src","Alpha"),"]"),f=b.def(a,"[",f,"]");a=b.def(a,"[",d("dst","Alpha"),"]");return[e,f,q,a]});case "blend.equation":return b(function(a){if("string"===typeof a)return[Z[a],Z[a]];if("object"===typeof a)return[Z[a.rgb],Z[a.alpha]]},function(a,b,c){var d=a.constants.blendEquations,e=b.def(),f=b.def();a=a.cond("typeof ",c,'==="string"');a.then(e,"=",f,"=",d,"[",
c,"];");a["else"](e,"=",d,"[",c,".rgb];",f,"=",d,"[",c,".alpha];");b(a);return[e,f]});case "blend.color":return b(function(a){return O(4,function(b){return+a[b]})},function(a,b,c){return O(4,function(a){return b.def("+",c,"[",a,"]")})});case "stencil.mask":return b(function(a){return a|0},function(a,b,c){return b.def(c,"|0")});case "stencil.func":return b(function(a){return[Xa[a.cmp||"keep"],a.ref||0,"mask"in a?a.mask:-1]},function(a,b,c){a=b.def('"cmp" in ',c,"?",a.constants.compareFuncs,"[",c,".cmp]",
":",7680);var d=b.def(c,".ref|0");b=b.def('"mask" in ',c,"?",c,".mask|0:-1");return[a,d,b]});case "stencil.opFront":case "stencil.opBack":return b(function(b){return["stencil.opBack"===a?1029:1028,Pa[b.fail||"keep"],Pa[b.zfail||"keep"],Pa[b.zpass||"keep"]]},function(b,c,d){function e(a){return c.def('"',a,'" in ',d,"?",f,"[",d,".",a,"]:",7680)}var f=b.constants.stencilOps;return["stencil.opBack"===a?1029:1028,e("fail"),e("zfail"),e("zpass")]});case "polygonOffset.offset":return b(function(a){return[a.factor|
0,a.units|0]},function(a,b,c){a=b.def(c,".factor|0");b=b.def(c,".units|0");return[a,b]});case "cull.face":return b(function(a){var b=0;"front"===a?b=1028:"back"===a&&(b=1029);return b},function(a,b,c){return b.def(c,'==="front"?',1028,":",1029)});case "lineWidth":return b(function(a){return a},function(a,b,c){return c});case "frontFace":return b(function(a){return wb[a]},function(a,b,c){return b.def(c+'==="cw"?2304:2305')});case "colorMask":return b(function(a){return a.map(function(a){return!!a})},
function(a,b,c){return O(4,function(a){return"!!"+c+"["+a+"]"})});case "sample.coverage":return b(function(a){return["value"in a?a.value:1,!!a.invert]},function(a,b,c){a=b.def('"value" in ',c,"?+",c,".value:1");b=b.def("!!",c,".invert");return[a,b]})}});return e}function E(a,b){var c=a["static"],d=a.dynamic,e={};Object.keys(c).forEach(function(a){var b=c[a],d;if("number"===typeof b||"boolean"===typeof b)d=x(function(){return b});else if("function"===typeof b){var f=b._reglType;if("texture2d"===f||
"textureCube"===f)d=x(function(a){return a.link(b)});else if("framebuffer"===f||"framebufferCube"===f)d=x(function(a){return a.link(b.color[0])})}else ra(b)&&(d=x(function(a){return a.global.def("[",O(b.length,function(a){return b[a]}),"]")}));d.value=b;e[a]=d});Object.keys(d).forEach(function(a){var b=d[a];e[a]=K(b,function(a,c){return a.invoke(c,b)})});return e}function T(a,c){var d=a["static"],e=a.dynamic,g={};Object.keys(d).forEach(function(a){var c=d[a],e=b.id(a),q=new za;if(Oa(c))q.state=1,
q.buffer=f.getBuffer(f.create(c,34962,!1,!0)),q.type=0;else{var y=f.getBuffer(c);if(y)q.state=1,q.buffer=y,q.type=0;else if("constant"in c){var l=c.constant;q.buffer="null";q.state=2;"number"===typeof l?q.x=l:Da.forEach(function(a,b){b<l.length&&(q[a]=l[b])})}else{var y=Oa(c.buffer)?f.getBuffer(f.create(c.buffer,34962,!1,!0)):f.getBuffer(c.buffer),h=c.offset|0,k=c.stride|0,H=c.size|0,m=!!c.normalized,n=0;"type"in c&&(n=Ra[c.type]);c=c.divisor|0;q.buffer=y;q.state=1;q.size=H;q.normalized=m;q.type=
n||y.dtype;q.offset=h;q.stride=k;q.divisor=c}}g[a]=x(function(a,b){var c=a.attribCache;if(e in c)return c[e];var d={isStream:!1};Object.keys(q).forEach(function(a){d[a]=q[a]});q.buffer&&(d.buffer=a.link(q.buffer),d.type=d.type||d.buffer+".dtype");return c[e]=d})});Object.keys(e).forEach(function(a){var b=e[a];g[a]=K(b,function(a,c){function d(a){c(y[a],"=",e,".",a,"|0;")}var e=a.invoke(c,b),q=a.shared,f=q.isBufferArgs,g=q.buffer,y={isStream:c.def(!1)},l=new za;l.state=1;Object.keys(l).forEach(function(a){y[a]=
c.def(""+l[a])});var h=y.buffer,k=y.type;c("if(",f,"(",e,")){",y.isStream,"=true;",h,"=",g,".createStream(",34962,",",e,");",k,"=",h,".dtype;","}else{",h,"=",g,".getBuffer(",e,");","if(",h,"){",k,"=",h,".dtype;",'}else if("constant" in ',e,"){",y.state,"=",2,";","if(typeof "+e+'.constant === "number"){',y[Da[0]],"=",e,".constant;",Da.slice(1).map(function(a){return y[a]}).join("="),"=0;","}else{",Da.map(function(a,b){return y[a]+"="+e+".constant.length>"+b+"?"+e+".constant["+b+"]:0;"}).join(""),"}}else{",
"if(",f,"(",e,".buffer)){",h,"=",g,".createStream(",34962,",",e,".buffer);","}else{",h,"=",g,".getBuffer(",e,".buffer);","}",k,'="type" in ',e,"?",q.glTypes,"[",e,".type]:",h,".dtype;",y.normalized,"=!!",e,".normalized;");d("size");d("offset");d("stride");d("divisor");c("}}");c.exit("if(",y.isStream,"){",g,".destroyStream(",h,");","}");return y})});return g}function M(a){var b=a["static"],c=a.dynamic,d={};Object.keys(b).forEach(function(a){var c=b[a];d[a]=x(function(a,b){return"number"===typeof c||
"boolean"===typeof c?""+c:a.link(c)})});Object.keys(c).forEach(function(a){var b=c[a];d[a]=K(b,function(a,c){return a.invoke(c,b)})});return d}function w(a,b,c,d,e){var f=z(a,e),g=D(a,f,e),l=N(a,e),k=Q(a,e),m=P(a,e),xa=g.viewport;xa&&(k.viewport=xa);xa=h("scissor.box");(g=g[xa])&&(k[xa]=g);g=0<Object.keys(k).length;f={framebuffer:f,draw:l,shader:m,state:k,dirty:g};f.profile=X(a,e);f.uniforms=E(c,e);f.attributes=T(b,e);f.context=M(d,e);return f}function A(a,b,c){var d=a.shared.context,e=a.scope();
Object.keys(c).forEach(function(f){b.save(d,"."+f);e(d,".",f,"=",c[f].append(a,b),";")});b(e)}function L(a,b,c,d){var e=a.shared,f=e.gl,g=e.framebuffer,l;na&&(l=b.def(e.extensions,".webgl_draw_buffers"));var h=a.constants,e=h.drawBuffer,h=h.backBuffer;a=c?c.append(a,b):b.def(g,".next");d||b("if(",a,"!==",g,".cur){");b("if(",a,"){",f,".bindFramebuffer(",36160,",",a,".framebuffer);");na&&b(l,".drawBuffersWEBGL(",e,"[",a,".colorAttachments.length]);");b("}else{",f,".bindFramebuffer(",36160,",null);");
na&&b(l,".drawBuffersWEBGL(",h,");");b("}",g,".cur=",a,";");d||b("}")}function V(a,b,c){var d=a.shared,e=d.gl,f=a.current,g=a.next,l=d.current,k=d.next,m=a.cond(l,".dirty");Ka.forEach(function(b){b=h(b);if(!(b in c.state)){var d,y;if(b in g){d=g[b];y=f[b];var H=O(sa[b].length,function(a){return m.def(d,"[",a,"]")});m(a.cond(H.map(function(a,b){return a+"!=="+y+"["+b+"]"}).join("||")).then(e,".",ua[b],"(",H,");",H.map(function(a,b){return y+"["+b+"]="+a}).join(";"),";"))}else d=m.def(k,".",b),H=a.cond(d,
"!==",l,".",b),m(H),b in ta?H(a.cond(d).then(e,".enable(",ta[b],");")["else"](e,".disable(",ta[b],");"),l,".",b,"=",d,";"):H(e,".",ua[b],"(",d,");",l,".",b,"=",d,";")}});0===Object.keys(c.state).length&&m(l,".dirty=false;");b(m)}function R(a,b,c,d){var e=a.shared,f=a.current,g=e.current,l=e.gl;vb(Object.keys(c)).forEach(function(e){var h=c[e];if(!d||d(h)){var k=h.append(a,b);if(ta[e]){var m=ta[e];wa(h)?k?b(l,".enable(",m,");"):b(l,".disable(",m,");"):b(a.cond(k).then(l,".enable(",m,");")["else"](l,
".disable(",m,");"));b(g,".",e,"=",k,";")}else if(ra(k)){var n=f[e];b(l,".",ua[e],"(",k,");",k.map(function(a,b){return n+"["+b+"]="+a}).join(";"),";")}else b(l,".",ua[e],"(",k,");",g,".",e,"=",k,";")}})}function ya(a,b){ga&&(a.instancing=b.def(a.shared.extensions,".angle_instanced_arrays"))}function F(a,b,c,d,e){function f(){return"undefined"===typeof performance?"Date.now()":"performance.now()"}function g(a){t=b.def();a(t,"=",f(),";");"string"===typeof e?a(n,".count+=",e,";"):a(n,".count++;");l&&
(d?(u=b.def(),a(u,"=",r,".getNumPendingQueries();")):a(r,".beginQuery(",n,");"))}function h(a){a(n,".cpuTime+=",f(),"-",t,";");l&&(d?a(r,".pushScopeStats(",u,",",r,".getNumPendingQueries(),",n,");"):a(r,".endQuery();"))}function k(a){var c=b.def(p,".profile");b(p,".profile=",a,";");b.exit(p,".profile=",c,";")}var m=a.shared,n=a.stats,p=m.current,r=m.timer;c=c.profile;var t,u;if(c){if(wa(c)){c.enable?(g(b),h(b.exit),k("true")):k("false");return}c=c.append(a,b);k(c)}else c=b.def(p,".profile");m=a.block();
g(m);b("if(",c,"){",m,"}");a=a.block();h(a);b.exit("if(",c,"){",a,"}")}function U(a,b,c,d,e){function f(a){switch(a){case 35664:case 35667:case 35671:return 2;case 35665:case 35668:case 35672:return 3;case 35666:case 35669:case 35673:return 4;default:return 1}}function g(c,d,e){function f(){b("if(!",G,".buffer){",h,".enableVertexAttribArray(",m,");}");var c=e.type,g;g=e.size?b.def(e.size,"||",d):d;b("if(",G,".type!==",c,"||",G,".size!==",g,"||",p.map(function(a){return G+"."+a+"!=="+e[a]}).join("||"),
"){",h,".bindBuffer(",34962,",",n,".buffer);",h,".vertexAttribPointer(",[m,g,c,e.normalized,e.stride,e.offset],");",G,".type=",c,";",G,".size=",g,";",p.map(function(a){return G+"."+a+"="+e[a]+";"}).join(""),"}");ga&&(c=e.divisor,b("if(",G,".divisor!==",c,"){",a.instancing,".vertexAttribDivisorANGLE(",[m,c],");",G,".divisor=",c,";}"))}function k(){b("if(",G,".buffer){",h,".disableVertexAttribArray(",m,");","}if(",Da.map(function(a,b){return G+"."+a+"!=="+H[b]}).join("||"),"){",h,".vertexAttrib4f(",
m,",",H,");",Da.map(function(a,b){return G+"."+a+"="+H[b]+";"}).join(""),"}")}var h=l.gl,m=b.def(c,".location"),G=b.def(l.attributes,"[",m,"]");c=e.state;var n=e.buffer,H=[e.x,e.y,e.z,e.w],p=["buffer","normalized","offset","stride"];1===c?f():2===c?k():(b("if(",c,"===",1,"){"),f(),b("}else{"),k(),b("}"))}var l=a.shared;d.forEach(function(d){var l=d.name,h=c.attributes[l],k;if(h){if(!e(h))return;k=h.append(a,b)}else{if(!e(xb))return;var m=a.scopeAttrib(l);k={};Object.keys(new za).forEach(function(a){k[a]=
b.def(m,".",a)})}g(a.link(d),f(d.info.type),k)})}function Y(a,c,d,e,f){for(var g=a.shared,l=g.gl,h,k=0;k<e.length;++k){var m=e[k],n=m.name,p=m.info.type,r=d.uniforms[n],m=a.link(m)+".location",t;if(r){if(!f(r))continue;if(wa(r)){n=r.value;if(35678===p||35680===p)p=a.link(n._texture||n.color[0]._texture),c(l,".uniform1i(",m,",",p+".bind());"),c.exit(p,".unbind();");else if(35674===p||35675===p||35676===p)n=a.global.def("new Float32Array(["+Array.prototype.slice.call(n)+"])"),r=2,35675===p?r=3:35676===
p&&(r=4),c(l,".uniformMatrix",r,"fv(",m,",false,",n,");");else{switch(p){case 5126:h="1f";break;case 35664:h="2f";break;case 35665:h="3f";break;case 35666:h="4f";break;case 35670:h="1i";break;case 5124:h="1i";break;case 35671:h="2i";break;case 35667:h="2i";break;case 35672:h="3i";break;case 35668:h="3i";break;case 35673:h="4i";break;case 35669:h="4i"}c(l,".uniform",h,"(",m,",",ra(n)?Array.prototype.slice.call(n):n,");")}continue}else t=r.append(a,c)}else{if(!f(xb))continue;t=c.def(g.uniforms,"[",
b.id(n),"]")}35678===p?c("if(",t,"&&",t,'._reglType==="framebuffer"){',t,"=",t,".color[0];","}"):35680===p&&c("if(",t,"&&",t,'._reglType==="framebufferCube"){',t,"=",t,".color[0];","}");n=1;switch(p){case 35678:case 35680:p=c.def(t,"._texture");c(l,".uniform1i(",m,",",p,".bind());");c.exit(p,".unbind();");continue;case 5124:case 35670:h="1i";break;case 35667:case 35671:h="2i";n=2;break;case 35668:case 35672:h="3i";n=3;break;case 35669:case 35673:h="4i";n=4;break;case 5126:h="1f";break;case 35664:h=
"2f";n=2;break;case 35665:h="3f";n=3;break;case 35666:h="4f";n=4;break;case 35674:h="Matrix2fv";break;case 35675:h="Matrix3fv";break;case 35676:h="Matrix4fv"}c(l,".uniform",h,"(",m,",");if("M"===h.charAt(0)){var m=Math.pow(p-35674+2,2),u=a.global.def("new Float32Array(",m,")");c("false,(Array.isArray(",t,")||",t," instanceof Float32Array)?",t,":(",O(m,function(a){return u+"["+a+"]="+t+"["+a+"]"}),",",u,")")}else 1<n?c(O(n,function(a){return t+"["+a+"]"})):c(t);c(");")}}function S(a,b,c,d){function e(f){var g=
m[f];return g?g.contextDep&&d.contextDynamic||g.propDep?g.append(a,c):g.append(a,b):b.def(k,".",f)}function f(){function a(){c(ba,".drawElementsInstancedANGLE(",[p,t,C,r+"<<(("+C+"-5121)>>1)",u],");")}function b(){c(ba,".drawArraysInstancedANGLE(",[p,r,t,u],");")}n?B?a():(c("if(",n,"){"),a(),c("}else{"),b(),c("}")):b()}function g(){function a(){c(l+".drawElements("+[p,t,C,r+"<<(("+C+"-5121)>>1)"]+");")}function b(){c(l+".drawArrays("+[p,r,t]+");")}n?B?a():(c("if(",n,"){"),a(),c("}else{"),b(),c("}")):
b()}var h=a.shared,l=h.gl,k=h.draw,m=d.draw,n=function(){var e=m.elements,f=b;if(e){if(e.contextDep&&d.contextDynamic||e.propDep)f=c;e=e.append(a,f)}else e=f.def(k,".","elements");e&&f("if("+e+")"+l+".bindBuffer(34963,"+e+".buffer.buffer);");return e}(),p=e("primitive"),r=e("offset"),t=function(){var e=m.count,f=b;if(e){if(e.contextDep&&d.contextDynamic||e.propDep)f=c;e=e.append(a,f)}else e=f.def(k,".","count");return e}();if("number"===typeof t){if(0===t)return}else c("if(",t,"){"),c.exit("}");var u,
ba;ga&&(u=e("instances"),ba=a.instancing);var C=n+".type",B=m.elements&&wa(m.elements);ga&&("number"!==typeof u||0<=u)?"string"===typeof u?(c("if(",u,">0){"),f(),c("}else if(",u,"<0){"),g(),c("}")):f():g()}function ca(a,b,c,d,e){b=B();e=b.proc("body",e);ga&&(b.instancing=e.def(b.shared.extensions,".angle_instanced_arrays"));a(b,e,c,d);return b.compile().body}function W(a,b,c,d){ya(a,b);U(a,b,c,d.attributes,function(){return!0});Y(a,b,c,d.uniforms,function(){return!0});S(a,b,b,c)}function ba(a,b){var c=
a.proc("draw",1);ya(a,c);A(a,c,b.context);L(a,c,b.framebuffer);V(a,c,b);R(a,c,b.state);F(a,c,b,!1,!0);var d=b.shader.progVar.append(a,c);c(a.shared.gl,".useProgram(",d,".program);");if(b.shader.program)W(a,c,b,b.shader.program);else{var e=a.global.def("{}"),f=c.def(d,".id"),g=c.def(e,"[",f,"]");c(a.cond(g).then(g,".call(this,a0);")["else"](g,"=",e,"[",f,"]=",a.link(function(c){return ca(W,a,b,c,1)}),"(",d,");",g,".call(this,a0);"))}0<Object.keys(b.state).length&&c(a.shared.current,".dirty=true;")}
function oa(a,b,c,d){function e(){return!0}a.batchId="a1";ya(a,b);U(a,b,c,d.attributes,e);Y(a,b,c,d.uniforms,e);S(a,b,b,c)}function Aa(a,b,c,d){function e(a){return a.contextDep&&g||a.propDep}function f(a){return!e(a)}ya(a,b);var g=c.contextDep,h=b.def(),l=b.def();a.shared.props=l;a.batchId=h;var k=a.scope(),m=a.scope();b(k.entry,"for(",h,"=0;",h,"<","a1",";++",h,"){",l,"=","a0","[",h,"];",m,"}",k.exit);c.needsContext&&A(a,m,c.context);c.needsFramebuffer&&L(a,m,c.framebuffer);R(a,m,c.state,e);c.profile&&
e(c.profile)&&F(a,m,c,!1,!0);d?(U(a,k,c,d.attributes,f),U(a,m,c,d.attributes,e),Y(a,k,c,d.uniforms,f),Y(a,m,c,d.uniforms,e),S(a,k,m,c)):(b=a.global.def("{}"),d=c.shader.progVar.append(a,m),l=m.def(d,".id"),k=m.def(b,"[",l,"]"),m(a.shared.gl,".useProgram(",d,".program);","if(!",k,"){",k,"=",b,"[",l,"]=",a.link(function(b){return ca(oa,a,c,b,2)}),"(",d,");}",k,".call(this,a0[",h,"],",h,");"))}function ia(a,b){function c(a){return a.contextDep&&e||a.propDep}var d=a.proc("batch",2);a.batchId="0";ya(a,
d);var e=!1,f=!0;Object.keys(b.context).forEach(function(a){e=e||b.context[a].propDep});e||(A(a,d,b.context),f=!1);var g=b.framebuffer,h=!1;g?(g.propDep?e=h=!0:g.contextDep&&e&&(h=!0),h||L(a,d,g)):L(a,d,null);b.state.viewport&&b.state.viewport.propDep&&(e=!0);V(a,d,b);R(a,d,b.state,function(a){return!c(a)});b.profile&&c(b.profile)||F(a,d,b,!1,"a1");b.contextDep=e;b.needsContext=f;b.needsFramebuffer=h;f=b.shader.progVar;if(f.contextDep&&e||f.propDep)Aa(a,d,b,null);else if(f=f.append(a,d),d(a.shared.gl,
".useProgram(",f,".program);"),b.shader.program)Aa(a,d,b,b.shader.program);else{var g=a.global.def("{}"),h=d.def(f,".id"),l=d.def(g,"[",h,"]");d(a.cond(l).then(l,".call(this,a0,a1);")["else"](l,"=",g,"[",h,"]=",a.link(function(c){return ca(Aa,a,b,c,2)}),"(",f,");",l,".call(this,a0,a1);"))}0<Object.keys(b.state).length&&d(a.shared.current,".dirty=true;")}function ka(a,c){function d(b){var g=c.shader[b];g&&e.set(f.shader,"."+b,g.append(a,e))}var e=a.proc("scope",3);a.batchId="a2";var f=a.shared,g=f.current;
A(a,e,c.context);c.framebuffer&&c.framebuffer.append(a,e);vb(Object.keys(c.state)).forEach(function(b){var d=c.state[b].append(a,e);ra(d)?d.forEach(function(c,d){e.set(a.next[b],"["+d+"]",c)}):e.set(f.next,"."+b,d)});F(a,e,c,!0,!0);["elements","offset","count","instances","primitive"].forEach(function(b){var d=c.draw[b];d&&e.set(f.draw,"."+b,""+d.append(a,e))});Object.keys(c.uniforms).forEach(function(d){e.set(f.uniforms,"["+b.id(d)+"]",c.uniforms[d].append(a,e))});Object.keys(c.attributes).forEach(function(b){var d=
c.attributes[b].append(a,e),f=a.scopeAttrib(b);Object.keys(new za).forEach(function(a){e.set(f,"."+a,d[a])})});d("vert");d("frag");0<Object.keys(c.state).length&&(e(g,".dirty=true;"),e.exit(g,".dirty=true;"));e("a1(",a.shared.context,",a0,",a.batchId,");")}function la(a){if("object"===typeof a&&!ra(a)){for(var b=Object.keys(a),c=0;c<b.length;++c)if(ja.isDynamic(a[b[c]]))return!0;return!1}}function ma(a,b,c){function d(a,b){g.forEach(function(c){var d=e[c];ja.isDynamic(d)&&(d=a.invoke(b,d),b(m,".",
c,"=",d,";"))})}var e=b["static"][c];if(e&&la(e)){var f=a.global,g=Object.keys(e),h=!1,l=!1,k=!1,m=a.global.def("{}");g.forEach(function(b){var c=e[b];if(ja.isDynamic(c))"function"===typeof c&&(c=e[b]=ja.unbox(c)),b=K(c,null),h=h||b.thisDep,k=k||b.propDep,l=l||b.contextDep;else{f(m,".",b,"=");switch(typeof c){case "number":f(c);break;case "string":f('"',c,'"');break;case "object":Array.isArray(c)&&f("[",c.join(),"]");break;default:f(a.link(c))}f(";")}});b.dynamic[c]=new ja.DynamicVariable(4,{thisDep:h,
contextDep:l,propDep:k,ref:m,append:d});delete b["static"][c]}}var za=p.Record,Z={add:32774,subtract:32778,"reverse subtract":32779};c.ext_blend_minmax&&(Z.min=32775,Z.max=32776);var ga=c.angle_instanced_arrays,na=c.webgl_draw_buffers,sa={dirty:!0,profile:g.profile},Fa={},Ka=[],ta={},ua={};v("dither",3024);v("blend.enable",3042);t("blend.color","blendColor",[0,0,0,0]);t("blend.equation","blendEquationSeparate",[32774,32774]);t("blend.func","blendFuncSeparate",[1,0,1,0]);v("depth.enable",2929,!0);
t("depth.func","depthFunc",513);t("depth.range","depthRange",[0,1]);t("depth.mask","depthMask",!0);t("colorMask","colorMask",[!0,!0,!0,!0]);v("cull.enable",2884);t("cull.face","cullFace",1029);t("frontFace","frontFace",2305);t("lineWidth","lineWidth",1);v("polygonOffset.enable",32823);t("polygonOffset.offset","polygonOffset",[0,0]);v("sample.alpha",32926);v("sample.enable",32928);t("sample.coverage","sampleCoverage",[1,!1]);v("stencil.enable",2960);t("stencil.mask","stencilMask",-1);t("stencil.func",
"stencilFunc",[519,0,-1]);t("stencil.opFront","stencilOpSeparate",[1028,7680,7680,7680]);t("stencil.opBack","stencilOpSeparate",[1029,7680,7680,7680]);v("scissor.enable",3089);t("scissor.box","scissor",[0,0,a.drawingBufferWidth,a.drawingBufferHeight]);t("viewport","viewport",[0,0,a.drawingBufferWidth,a.drawingBufferHeight]);var pa={gl:a,context:C,strings:b,next:Fa,current:sa,draw:m,elements:d,buffer:f,shader:u,attributes:p.state,uniforms:r,framebuffer:k,extensions:c,timer:l,isBufferArgs:Oa},ha={primTypes:Sa,
compareFuncs:Xa,blendFuncs:Ga,blendEquations:Z,stencilOps:Pa,glTypes:Ra,orientationType:wb};na&&(ha.backBuffer=[1029],ha.drawBuffer=O(e.maxDrawbuffers,function(a){return 0===a?[0]:O(a,function(a){return 36064+a})}));var va=0;return{next:Fa,current:sa,procs:function(){var a=B(),b=a.proc("poll"),c=a.proc("refresh"),d=a.block();b(d);c(d);var f=a.shared,g=f.gl,h=f.next,l=f.current;d(l,".dirty=false;");L(a,b);L(a,c,null,!0);var k;ga&&(k=a.link(ga));for(var m=0;m<e.maxAttributes;++m){var n=c.def(f.attributes,
"[",m,"]"),p=a.cond(n,".buffer");p.then(g,".enableVertexAttribArray(",m,");",g,".bindBuffer(",34962,",",n,".buffer.buffer);",g,".vertexAttribPointer(",m,",",n,".size,",n,".type,",n,".normalized,",n,".stride,",n,".offset);")["else"](g,".disableVertexAttribArray(",m,");",g,".vertexAttrib4f(",m,",",n,".x,",n,".y,",n,".z,",n,".w);",n,".buffer=null;");c(p);ga&&c(k,".vertexAttribDivisorANGLE(",m,",",n,".divisor);")}Object.keys(ta).forEach(function(e){var f=ta[e],k=d.def(h,".",e),m=a.block();m("if(",k,"){",
g,".enable(",f,")}else{",g,".disable(",f,")}",l,".",e,"=",k,";");c(m);b("if(",k,"!==",l,".",e,"){",m,"}")});Object.keys(ua).forEach(function(e){var f=ua[e],k=sa[e],m,n,p=a.block();p(g,".",f,"(");ra(k)?(f=k.length,m=a.global.def(h,".",e),n=a.global.def(l,".",e),p(O(f,function(a){return m+"["+a+"]"}),");",O(f,function(a){return n+"["+a+"]="+m+"["+a+"];"}).join("")),b("if(",O(f,function(a){return m+"["+a+"]!=="+n+"["+a+"]"}).join("||"),"){",p,"}")):(m=d.def(h,".",e),n=d.def(l,".",e),p(m,");",l,".",e,
"=",m,";"),b("if(",m,"!==",n,"){",p,"}"));c(p)});return a.compile()}(),compile:function(a,b,c,d,e){var f=B();f.stats=f.link(e);Object.keys(b["static"]).forEach(function(a){ma(f,b,a)});Ub.forEach(function(b){ma(f,a,b)});c=w(a,b,c,d,f);ba(f,c);ka(f,c);ia(f,c);return f.compile()}}}function yb(a,b){for(var c=0;c<a.length;++c)if(a[c]===b)return c;return-1}var D=function(a,b){for(var c=Object.keys(b),e=0;e<c.length;++e)a[c[e]]=b[c[e]];return a},Ab=0,ja={DynamicVariable:pa,define:function(a,b){return new pa(a,
Za(b+""))},isDynamic:function(a){return"function"===typeof a&&!a._reglType||a instanceof pa},unbox:function(a,b){return"function"===typeof a?new pa(0,a):a},accessor:Za},Ya={next:"function"===typeof requestAnimationFrame?function(a){return requestAnimationFrame(a)}:function(a){return setTimeout(a,16)},cancel:"function"===typeof cancelAnimationFrame?function(a){return cancelAnimationFrame(a)}:clearTimeout},zb="undefined"!==typeof performance&&performance.now?function(){return performance.now()}:function(){return+new Date},
z=cb();z.zero=cb();var Vb=function(a,b){var c=1;b.ext_texture_filter_anisotropic&&(c=a.getParameter(34047));var e=1,f=1;b.webgl_draw_buffers&&(e=a.getParameter(34852),f=a.getParameter(36063));var d=!!b.oes_texture_float;if(d){d=a.createTexture();a.bindTexture(3553,d);a.texImage2D(3553,0,6408,1,1,0,6408,5126,null);var n=a.createFramebuffer();a.bindFramebuffer(36160,n);a.framebufferTexture2D(36160,36064,3553,d,0);a.bindTexture(3553,null);if(36053!==a.checkFramebufferStatus(36160))d=!1;else{a.viewport(0,
0,1,1);a.clearColor(1,0,0,1);a.clear(16384);var k=z.allocType(5126,4);a.readPixels(0,0,1,1,6408,5126,k);a.getError()?d=!1:(a.deleteFramebuffer(n),a.deleteTexture(d),d=1===k[0]);z.freeType(k)}}k=!0;k=a.createTexture();n=z.allocType(5121,36);a.activeTexture(33984);a.bindTexture(34067,k);a.texImage2D(34069,0,6408,3,3,0,6408,5121,n);z.freeType(n);a.bindTexture(34067,null);a.deleteTexture(k);k=!a.getError();return{colorBits:[a.getParameter(3410),a.getParameter(3411),a.getParameter(3412),a.getParameter(3413)],
depthBits:a.getParameter(3414),stencilBits:a.getParameter(3415),subpixelBits:a.getParameter(3408),extensions:Object.keys(b).filter(function(a){return!!b[a]}),maxAnisotropic:c,maxDrawbuffers:e,maxColorAttachments:f,pointSizeDims:a.getParameter(33901),lineWidthDims:a.getParameter(33902),maxViewportDims:a.getParameter(3386),maxCombinedTextureUnits:a.getParameter(35661),maxCubeMapSize:a.getParameter(34076),maxRenderbufferSize:a.getParameter(34024),maxTextureUnits:a.getParameter(34930),maxTextureSize:a.getParameter(3379),
maxAttributes:a.getParameter(34921),maxVertexUniforms:a.getParameter(36347),maxVertexTextureUnits:a.getParameter(35660),maxVaryingVectors:a.getParameter(36348),maxFragmentUniforms:a.getParameter(36349),glsl:a.getParameter(35724),renderer:a.getParameter(7937),vendor:a.getParameter(7936),version:a.getParameter(7938),readFloat:d,npotTextureCube:k}},P=function(a){return a instanceof Uint8Array||a instanceof Uint16Array||a instanceof Uint32Array||a instanceof Int8Array||a instanceof Int16Array||a instanceof
Int32Array||a instanceof Float32Array||a instanceof Float64Array||a instanceof Uint8ClampedArray},R=function(a){return Object.keys(a).map(function(b){return a[b]})},Ma={shape:function(a){for(var b=[];a.length;a=a[0])b.push(a.length);return b},flatten:function(a,b,c,e){var f=1;if(b.length)for(var d=0;d<b.length;++d)f*=b[d];else f=0;c=e||z.allocType(c,f);switch(b.length){case 0:break;case 1:e=b[0];for(b=0;b<e;++b)c[b]=a[b];break;case 2:e=b[0];b=b[1];for(d=f=0;d<e;++d)for(var n=a[d],k=0;k<b;++k)c[f++]=
n[k];break;case 3:db(a,b[0],b[1],b[2],c,0);break;default:eb(a,b,0,c,0)}return c}},Ia={"[object Int8Array]":5120,"[object Int16Array]":5122,"[object Int32Array]":5124,"[object Uint8Array]":5121,"[object Uint8ClampedArray]":5121,"[object Uint16Array]":5123,"[object Uint32Array]":5125,"[object Float32Array]":5126,"[object Float64Array]":5121,"[object ArrayBuffer]":5121},Ra={int8:5120,int16:5122,int32:5124,uint8:5121,uint16:5123,uint32:5125,"float":5126,float32:5126},jb={dynamic:35048,stream:35040,"static":35044},
Qa=Ma.flatten,hb=Ma.shape,la=[];la[5120]=1;la[5122]=2;la[5124]=4;la[5121]=1;la[5123]=2;la[5125]=4;la[5126]=4;var Sa={points:0,point:0,lines:1,line:1,triangles:4,triangle:4,"line loop":2,"line strip":3,"triangle strip":5,"triangle fan":6},lb=new Float32Array(1),Ib=new Uint32Array(lb.buffer),Mb=[9984,9986,9985,9987],La=[0,6409,6410,6407,6408],S={};S[6409]=S[6406]=S[6402]=1;S[34041]=S[6410]=2;S[6407]=S[35904]=3;S[6408]=S[35906]=4;var Ua=Ea("HTMLCanvasElement"),pb=Ea("CanvasRenderingContext2D"),qb=Ea("ImageBitmap"),
rb=Ea("HTMLImageElement"),sb=Ea("HTMLVideoElement"),Jb=Object.keys(Ia).concat([Ua,pb,qb,rb,sb]),ha=[];ha[5121]=1;ha[5126]=4;ha[36193]=2;ha[5123]=2;ha[5125]=4;var v=[];v[32854]=2;v[32855]=2;v[36194]=2;v[34041]=4;v[33776]=.5;v[33777]=.5;v[33778]=1;v[33779]=1;v[35986]=.5;v[35987]=1;v[34798]=1;v[35840]=.5;v[35841]=.25;v[35842]=.5;v[35843]=.25;v[36196]=.5;var M=[];M[32854]=2;M[32855]=2;M[36194]=2;M[33189]=2;M[36168]=1;M[34041]=4;M[35907]=4;M[34836]=16;M[34842]=8;M[34843]=6;var Wb=function(a,b,c,e,f){function d(a){this.id=
p++;this.refCount=1;this.renderbuffer=a;this.format=32854;this.height=this.width=0;f.profile&&(this.stats={size:0})}function n(b){var c=b.renderbuffer;a.bindRenderbuffer(36161,null);a.deleteRenderbuffer(c);b.renderbuffer=null;b.refCount=0;delete u[b.id];e.renderbufferCount--}var k={rgba4:32854,rgb565:36194,"rgb5 a1":32855,depth:33189,stencil:36168,"depth stencil":34041};b.ext_srgb&&(k.srgba=35907);b.ext_color_buffer_half_float&&(k.rgba16f=34842,k.rgb16f=34843);b.webgl_color_buffer_float&&(k.rgba32f=
34836);var r=[];Object.keys(k).forEach(function(a){r[k[a]]=a});var p=0,u={};d.prototype.decRef=function(){0>=--this.refCount&&n(this)};f.profile&&(e.getTotalRenderbufferSize=function(){var a=0;Object.keys(u).forEach(function(b){a+=u[b].stats.size});return a});return{create:function(b,c){function l(b,c){var d=0,e=0,m=32854;"object"===typeof b&&b?("shape"in b?(e=b.shape,d=e[0]|0,e=e[1]|0):("radius"in b&&(d=e=b.radius|0),"width"in b&&(d=b.width|0),"height"in b&&(e=b.height|0)),"format"in b&&(m=k[b.format])):
"number"===typeof b?(d=b|0,e="number"===typeof c?c|0:d):b||(d=e=1);if(d!==g.width||e!==g.height||m!==g.format)return l.width=g.width=d,l.height=g.height=e,g.format=m,a.bindRenderbuffer(36161,g.renderbuffer),a.renderbufferStorage(36161,m,d,e),f.profile&&(g.stats.size=M[g.format]*g.width*g.height),l.format=r[g.format],l}var g=new d(a.createRenderbuffer());u[g.id]=g;e.renderbufferCount++;l(b,c);l.resize=function(b,c){var d=b|0,e=c|0||d;if(d===g.width&&e===g.height)return l;l.width=g.width=d;l.height=
g.height=e;a.bindRenderbuffer(36161,g.renderbuffer);a.renderbufferStorage(36161,g.format,d,e);f.profile&&(g.stats.size=M[g.format]*g.width*g.height);return l};l._reglType="renderbuffer";l._renderbuffer=g;f.profile&&(l.stats=g.stats);l.destroy=function(){g.decRef()};return l},clear:function(){R(u).forEach(n)},restore:function(){R(u).forEach(function(b){b.renderbuffer=a.createRenderbuffer();a.bindRenderbuffer(36161,b.renderbuffer);a.renderbufferStorage(36161,b.format,b.width,b.height)});a.bindRenderbuffer(36161,
null)}}},Wa=[];Wa[6408]=4;Wa[6407]=3;var Na=[];Na[5121]=1;Na[5126]=4;Na[36193]=2;var Da=["x","y","z","w"],Ub="blend.func blend.equation stencil.func stencil.opFront stencil.opBack sample.coverage viewport scissor.box polygonOffset.offset".split(" "),Ga={0:0,1:1,zero:0,one:1,"src color":768,"one minus src color":769,"src alpha":770,"one minus src alpha":771,"dst color":774,"one minus dst color":775,"dst alpha":772,"one minus dst alpha":773,"constant color":32769,"one minus constant color":32770,"constant alpha":32771,
"one minus constant alpha":32772,"src alpha saturate":776},Xa={never:512,less:513,"<":513,equal:514,"=":514,"==":514,"===":514,lequal:515,"<=":515,greater:516,">":516,notequal:517,"!=":517,"!==":517,gequal:518,">=":518,always:519},Pa={0:0,zero:0,keep:7680,replace:7681,increment:7682,decrement:7683,"increment wrap":34055,"decrement wrap":34056,invert:5386},wb={cw:2304,ccw:2305},xb=new aa(!1,!1,!1,function(){}),Xb=function(a,b){function c(){this.endQueryIndex=this.startQueryIndex=-1;this.sum=0;this.stats=
null}function e(a,b,d){var e=k.pop()||new c;e.startQueryIndex=a;e.endQueryIndex=b;e.sum=0;e.stats=d;r.push(e)}var f=b.ext_disjoint_timer_query;if(!f)return null;var d=[],n=[],k=[],r=[],p=[],u=[];return{beginQuery:function(a){var b=d.pop()||f.createQueryEXT();f.beginQueryEXT(35007,b);n.push(b);e(n.length-1,n.length,a)},endQuery:function(){f.endQueryEXT(35007)},pushScopeStats:e,update:function(){var a,b;a=n.length;if(0!==a){u.length=Math.max(u.length,a+1);p.length=Math.max(p.length,a+1);p[0]=0;var c=
u[0]=0;for(b=a=0;b<n.length;++b){var e=n[b];f.getQueryObjectEXT(e,34919)?(c+=f.getQueryObjectEXT(e,34918),d.push(e)):n[a++]=e;p[b+1]=c;u[b+1]=a}n.length=a;for(b=a=0;b<r.length;++b){var c=r[b],h=c.startQueryIndex,e=c.endQueryIndex;c.sum+=p[e]-p[h];h=u[h];e=u[e];e===h?(c.stats.gpuTime+=c.sum/1E6,k.push(c)):(c.startQueryIndex=h,c.endQueryIndex=e,r[a++]=c)}r.length=a}},getNumPendingQueries:function(){return n.length},clear:function(){d.push.apply(d,n);for(var a=0;a<d.length;a++)f.deleteQueryEXT(d[a]);
n.length=0;d.length=0},restore:function(){n.length=0;d.length=0}}};return function(a){function b(){if(0===F.length)x&&x.update(),ca=null;else{ca=Ya.next(b);u();for(var a=F.length-1;0<=a;--a){var c=F[a];c&&c(N,null,0)}l.flush();x&&x.update()}}function c(){!ca&&0<F.length&&(ca=Ya.next(b))}function e(){ca&&(Ya.cancel(b),ca=null)}function f(a){a.preventDefault();e();U.forEach(function(a){a()})}function d(a){l.getError();h.restore();R.restore();E.restore();w.restore();A.restore();L.restore();x&&x.restore();
V.procs.refresh();c();Y.forEach(function(a){a()})}function n(a){function b(a){var c={},d={};Object.keys(a).forEach(function(b){var e=a[b];ja.isDynamic(e)?d[b]=ja.unbox(e,b):c[b]=e});return{dynamic:d,"static":c}}function c(a){for(;m.length<a;)m.push(null);return m}var d=b(a.context||{}),e=b(a.uniforms||{}),f=b(a.attributes||{}),g=b(function(a){function b(a){if(a in c){var d=c[a];delete c[a];Object.keys(d).forEach(function(b){c[a+"."+b]=d[b]})}}var c=D({},a);delete c.uniforms;delete c.attributes;delete c.context;
"stencil"in c&&c.stencil.op&&(c.stencil.opBack=c.stencil.opFront=c.stencil.op,delete c.stencil.op);b("blend");b("depth");b("cull");b("stencil");b("polygonOffset");b("scissor");b("sample");return c}(a));a={gpuTime:0,cpuTime:0,count:0};var d=V.compile(g,f,e,d,a),h=d.draw,k=d.batch,l=d.scope,m=[];return D(function(a,b){var d;if("function"===typeof a)return l.call(this,null,a,0);if("function"===typeof b)if("number"===typeof a)for(d=0;d<a;++d)l.call(this,null,b,d);else if(Array.isArray(a))for(d=0;d<a.length;++d)l.call(this,
a[d],b,d);else return l.call(this,a,b,0);else if("number"===typeof a){if(0<a)return k.call(this,c(a|0),a|0)}else if(Array.isArray(a)){if(a.length)return k.call(this,a,a.length)}else return h.call(this,a)},{stats:a})}function k(a,b){var c=0;V.procs.poll();var d=b.color;d&&(l.clearColor(+d[0]||0,+d[1]||0,+d[2]||0,+d[3]||0),c|=16384);"depth"in b&&(l.clearDepth(+b.depth),c|=256);"stencil"in b&&(l.clearStencil(b.stencil|0),c|=1024);l.clear(c)}function r(a){F.push(a);c();return{cancel:function(){function b(){var a=
yb(F,b);F[a]=F[F.length-1];--F.length;0>=F.length&&e()}var c=yb(F,a);F[c]=b}}}function p(){var a=S.viewport,b=S.scissor_box;a[0]=a[1]=b[0]=b[1]=0;N.viewportWidth=N.framebufferWidth=N.drawingBufferWidth=a[2]=b[2]=l.drawingBufferWidth;N.viewportHeight=N.framebufferHeight=N.drawingBufferHeight=a[3]=b[3]=l.drawingBufferHeight}function u(){N.tick+=1;N.time=v();p();V.procs.poll()}function m(){p();V.procs.refresh();x&&x.update()}function v(){return(zb()-O)/1E3}a=Eb(a);if(!a)return null;var l=a.gl,g=l.getContextAttributes();
l.isContextLost();var h=Fb(l,a);if(!h)return null;var z=Bb(),t={bufferCount:0,elementsCount:0,framebufferCount:0,shaderCount:0,textureCount:0,cubeCount:0,renderbufferCount:0,maxTextureUnits:0},B=h.extensions,x=Xb(l,B),O=zb(),K=l.drawingBufferWidth,P=l.drawingBufferHeight,N={tick:0,time:0,viewportWidth:K,viewportHeight:P,framebufferWidth:K,framebufferHeight:P,drawingBufferWidth:K,drawingBufferHeight:P,pixelRatio:a.pixelRatio},Q=Vb(l,B),K=Pb(l,B,Q,z),E=Gb(l,t,a,K),T=Hb(l,B,E,t),R=Qb(l,z,t,a),w=Kb(l,
B,Q,function(){V.procs.poll()},N,t,a),A=Wb(l,B,Q,t,a),L=Ob(l,B,Q,w,A,t),V=Tb(l,z,B,Q,E,T,w,L,{},K,R,{elements:null,primitive:4,count:-1,offset:0,instances:-1},N,x,a),z=Rb(l,L,V.procs.poll,N,g,B,Q),S=V.next,M=l.canvas,F=[],U=[],Y=[],W=[a.onDestroy],ca=null;M&&(M.addEventListener("webglcontextlost",f,!1),M.addEventListener("webglcontextrestored",d,!1));var aa=L.setFBO=n({framebuffer:ja.define.call(null,1,"framebuffer")});m();g=D(n,{clear:function(a){if("framebuffer"in a)if(a.framebuffer&&"framebufferCube"===
a.framebuffer_reglType)for(var b=0;6>b;++b)aa(D({framebuffer:a.framebuffer.faces[b]},a),k);else aa(a,k);else k(null,a)},prop:ja.define.bind(null,1),context:ja.define.bind(null,2),"this":ja.define.bind(null,3),draw:n({}),buffer:function(a){return E.create(a,34962,!1,!1)},elements:function(a){return T.create(a,!1)},texture:w.create2D,cube:w.createCube,renderbuffer:A.create,framebuffer:L.create,framebufferCube:L.createCube,attributes:g,frame:r,on:function(a,b){var c;switch(a){case "frame":return r(b);
case "lost":c=U;break;case "restore":c=Y;break;case "destroy":c=W}c.push(b);return{cancel:function(){for(var a=0;a<c.length;++a)if(c[a]===b){c[a]=c[c.length-1];c.pop();break}}}},limits:Q,hasExtension:function(a){return 0<=Q.extensions.indexOf(a.toLowerCase())},read:z,destroy:function(){F.length=0;e();M&&(M.removeEventListener("webglcontextlost",f),M.removeEventListener("webglcontextrestored",d));R.clear();L.clear();A.clear();w.clear();T.clear();E.clear();x&&x.clear();W.forEach(function(a){a()})},
_gl:l,_refresh:m,poll:function(){u();x&&x.update()},now:v,stats:t});a.onDone(null,g);return g}});

},{}],31:[function(require,module,exports){
(function (global){
module.exports =
  global.performance &&
  global.performance.now ? function now() {
    return performance.now()
  } : Date.now || function now() {
    return +new Date
  }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
 /* eslint-env node */
'use strict';

// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress); // was: relAddr
    sdp.push('rport');
    sdp.push(candidate.relatedPort); // was: relPort
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
}

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  // was: channels
  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
          ? '/' + headerExtension.direction
          : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      params.push(param + '=' + codec.parameters[param]);
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
}

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
      'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  caps.headerExtensions.forEach(function(extension) {
    sdp += SDPUtils.writeExtmap(extension);
  });
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.split(' ');
    parts.shift();
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
        rtx: {
          ssrc: secondarySsrc
        }
      };
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(5), 10);
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

SDPUtils.writeSessionBoilerplate = function() {
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

// Expose public methods.
module.exports = SDPUtils;

},{}],33:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

'use strict';

// Shimming starts here.
(function() {
  // Utils.
  var logging = require('./utils').log;
  var browserDetails = require('./utils').browserDetails;
  // Export to the adapter global object visible in the browser.
  module.exports.browserDetails = browserDetails;
  module.exports.extractVersion = require('./utils').extractVersion;
  module.exports.disableLog = require('./utils').disableLog;

  // Uncomment the line below if you want logging to occur, including logging
  // for the switch statement below. Can also be turned on in the browser via
  // adapter.disableLog(false), but then logging from the switch statement below
  // will not appear.
  // require('./utils').disableLog(false);

  // Browser shims.
  var chromeShim = require('./chrome/chrome_shim') || null;
  var edgeShim = require('./edge/edge_shim') || null;
  var firefoxShim = require('./firefox/firefox_shim') || null;
  var safariShim = require('./safari/safari_shim') || null;

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'opera': // fallthrough as it uses chrome shims
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection) {
        logging('Chrome shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = chromeShim;

      chromeShim.shimGetUserMedia();
      chromeShim.shimMediaStream();
      chromeShim.shimSourceObject();
      chromeShim.shimPeerConnection();
      chromeShim.shimOnTrack();
      break;
    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection) {
        logging('Firefox shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = firefoxShim;

      firefoxShim.shimGetUserMedia();
      firefoxShim.shimSourceObject();
      firefoxShim.shimPeerConnection();
      firefoxShim.shimOnTrack();
      break;
    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection) {
        logging('MS edge shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = edgeShim;

      edgeShim.shimGetUserMedia();
      edgeShim.shimPeerConnection();
      break;
    case 'safari':
      if (!safariShim) {
        logging('Safari shim is not included in this adapter release.');
        return;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      module.exports.browserShim = safariShim;

      safariShim.shimGetUserMedia();
      break;
    default:
      logging('Unsupported browser!');
  }
})();

},{"./chrome/chrome_shim":34,"./edge/edge_shim":36,"./firefox/firefox_shim":38,"./safari/safari_shim":40,"./utils":41}],34:[function(require,module,exports){

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';
var logging = require('../utils.js').log;
var browserDetails = require('../utils.js').browserDetails;

var chromeShim = {
  shimMediaStream: function() {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  },

  shimOnTrack: function() {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          var self = this;
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function(te) {
              var event = new Event('track');
              event.track = te.track;
              event.receiver = {track: te.track};
              event.streams = [e.stream];
              self.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimSourceObject: function() {
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this._srcObject;
          },
          set: function(stream) {
            var self = this;
            // Use _srcObject as a private property for this shim
            this._srcObject = stream;
            if (this.src) {
              URL.revokeObjectURL(this.src);
            }

            if (!stream) {
              this.src = '';
              return;
            }
            this.src = URL.createObjectURL(stream);
            // We need to recreate the blob url when a track is added or
            // removed. Doing it manually since we want to avoid a recursion.
            stream.addEventListener('addtrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
            stream.addEventListener('removetrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
          }
        });
      }
    }
  },

  shimPeerConnection: function() {
    // The RTCPeerConnection object.
    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
      // Translate iceTransportPolicy to iceTransports,
      // see https://code.google.com/p/webrtc/issues/detail?id=4869
      logging('PeerConnection');
      if (pcConfig && pcConfig.iceTransportPolicy) {
        pcConfig.iceTransports = pcConfig.iceTransportPolicy;
      }

      var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints);
      var origGetStats = pc.getStats.bind(pc);
      pc.getStats = function(selector, successCallback, errorCallback) {
        var self = this;
        var args = arguments;

        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === 'function') {
          return origGetStats(selector, successCallback);
        }

        var fixChromeStats_ = function(response) {
          var standardReport = {};
          var reports = response.result();
          reports.forEach(function(report) {
            var standardStats = {
              id: report.id,
              timestamp: report.timestamp,
              type: report.type
            };
            report.names().forEach(function(name) {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });

          return standardReport;
        };

        // shim getStats with maplike support
        var makeMapStats = function(stats, legacyStats) {
          var map = new Map(Object.keys(stats).map(function(key) {
            return[key, stats[key]];
          }));
          legacyStats = legacyStats || stats;
          Object.keys(legacyStats).forEach(function(key) {
            map[key] = legacyStats[key];
          });
          return map;
        };

        if (arguments.length >= 2) {
          var successCallbackWrapper_ = function(response) {
            args[1](makeMapStats(fixChromeStats_(response)));
          };

          return origGetStats.apply(this, [successCallbackWrapper_,
              arguments[0]]);
        }

        // promise-support
        return new Promise(function(resolve, reject) {
          if (args.length === 1 && typeof selector === 'object') {
            origGetStats.apply(self, [
              function(response) {
                resolve(makeMapStats(fixChromeStats_(response)));
              }, reject]);
          } else {
            // Preserve legacy chrome stats only on legacy access of stats obj
            origGetStats.apply(self, [
              function(response) {
                resolve(makeMapStats(fixChromeStats_(response),
                    response.result()));
              }, reject]);
          }
        }).then(successCallback, errorCallback);
      };

      return pc;
    };
    window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype;

    // wrap static methods. Currently just generateCertificate.
    if (webkitRTCPeerConnection.generateCertificate) {
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function() {
          return webkitRTCPeerConnection.generateCertificate;
        }
      });
    }

    ['createOffer', 'createAnswer'].forEach(function(method) {
      var nativeMethod = webkitRTCPeerConnection.prototype[method];
      webkitRTCPeerConnection.prototype[method] = function() {
        var self = this;
        if (arguments.length < 1 || (arguments.length === 1 &&
            typeof arguments[0] === 'object')) {
          var opts = arguments.length === 1 ? arguments[0] : undefined;
          return new Promise(function(resolve, reject) {
            nativeMethod.apply(self, [resolve, reject, opts]);
          });
        }
        return nativeMethod.apply(this, arguments);
      };
    });

    // add promise support -- natively available in Chrome 51
    if (browserDetails.version < 51) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
          .forEach(function(method) {
            var nativeMethod = webkitRTCPeerConnection.prototype[method];
            webkitRTCPeerConnection.prototype[method] = function() {
              var args = arguments;
              var self = this;
              var promise = new Promise(function(resolve, reject) {
                nativeMethod.apply(self, [args[0], resolve, reject]);
              });
              if (args.length < 2) {
                return promise;
              }
              return promise.then(function() {
                args[1].apply(null, []);
              },
              function(err) {
                if (args.length >= 3) {
                  args[2].apply(null, [err]);
                }
              });
            };
          });
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = webkitRTCPeerConnection.prototype[method];
          webkitRTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        RTCPeerConnection.prototype.addIceCandidate;
    RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }
};


// Expose public methods.
module.exports = {
  shimMediaStream: chromeShim.shimMediaStream,
  shimOnTrack: chromeShim.shimOnTrack,
  shimSourceObject: chromeShim.shimSourceObject,
  shimPeerConnection: chromeShim.shimPeerConnection,
  shimGetUserMedia: require('./getusermedia')
};

},{"../utils.js":41,"./getusermedia":35}],35:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';
var logging = require('../utils.js').log;

// Expose public methods.
module.exports = function() {
  var constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  var shimConstraints_ = function(constraints, func) {
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && constraints.audio) {
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile, where it defaults to "user".
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode)) {
        delete constraints.video.facingMode;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          // Look for "back" in label, or use last cam (typically back cam).
          return navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            devices = devices.filter(function(d) {
              return d.kind === 'videoinput';
            });
            var back = devices.find(function(d) {
              return d.label.toLowerCase().indexOf('back') !== -1;
            }) || (devices.length && devices[devices.length - 1]);
            if (back) {
              constraints.video.deviceId = face.exact ? {exact: back.deviceId} :
                                                        {ideal: back.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        ConstraintNotSatisfiedError: 'OverconstrainedError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraintName,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function(c) {
      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
        onError(shimError_(e));
      });
    });
  };

  navigator.getUserMedia = getUserMedia_;

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  };

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: getUserMediaPromise_,
      enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                      kind: kinds[device.kind],
                      deviceId: device.id,
                      groupId: ''};
            }));
          });
        });
      }
    };
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return getUserMediaPromise_(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, function(c) {
        return origGetUserMedia(c).then(function(stream) {
          if (c.audio && !stream.getAudioTracks().length ||
              c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }
          return stream;
        }, function(e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      logging('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      logging('Dummy mediaDevices.removeEventListener called.');
    };
  }
};

},{"../utils.js":41}],36:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var SDPUtils = require('sdp');
var browserDetails = require('../utils').browserDetails;

var edgeShim = {
  shimPeerConnection: function() {
    if (window.RTCIceGatherer) {
      // ORTC defines an RTCIceCandidate object but no constructor.
      // Not implemented in Edge.
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function(args) {
          return args;
        };
      }
      // ORTC does not have a session description object but
      // other browsers (i.e. Chrome) that will support both PC and ORTC
      // in the future might have this defined already.
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function(args) {
          return args;
        };
      }
      // this adds an additional event listener to MediaStrackTrack that signals
      // when a tracks enabled property was changed.
      var origMSTEnabled = Object.getOwnPropertyDescriptor(
          MediaStreamTrack.prototype, 'enabled');
      Object.defineProperty(MediaStreamTrack.prototype, 'enabled', {
        set: function(value) {
          origMSTEnabled.set.call(this, value);
          var ev = new Event('enabled');
          ev.enabled = value;
          this.dispatchEvent(ev);
        }
      });
    }

    window.RTCPeerConnection = function(config) {
      var self = this;

      var _eventTarget = document.createDocumentFragment();
      ['addEventListener', 'removeEventListener', 'dispatchEvent']
          .forEach(function(method) {
            self[method] = _eventTarget[method].bind(_eventTarget);
          });

      this.onicecandidate = null;
      this.onaddstream = null;
      this.ontrack = null;
      this.onremovestream = null;
      this.onsignalingstatechange = null;
      this.oniceconnectionstatechange = null;
      this.onnegotiationneeded = null;
      this.ondatachannel = null;

      this.localStreams = [];
      this.remoteStreams = [];
      this.getLocalStreams = function() {
        return self.localStreams;
      };
      this.getRemoteStreams = function() {
        return self.remoteStreams;
      };

      this.localDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.remoteDescription = new RTCSessionDescription({
        type: '',
        sdp: ''
      });
      this.signalingState = 'stable';
      this.iceConnectionState = 'new';
      this.iceGatheringState = 'new';

      this.iceOptions = {
        gatherPolicy: 'all',
        iceServers: []
      };
      if (config && config.iceTransportPolicy) {
        switch (config.iceTransportPolicy) {
          case 'all':
          case 'relay':
            this.iceOptions.gatherPolicy = config.iceTransportPolicy;
            break;
          case 'none':
            // FIXME: remove once implementation and spec have added this.
            throw new TypeError('iceTransportPolicy "none" not supported');
          default:
            // don't set iceTransportPolicy.
            break;
        }
      }
      this.usingBundle = config && config.bundlePolicy === 'max-bundle';

      if (config && config.iceServers) {
        // Edge does not like
        // 1) stun:
        // 2) turn: that does not have all of turn:host:port?transport=udp
        // 3) turn: with ipv6 addresses
        var iceServers = JSON.parse(JSON.stringify(config.iceServers));
        this.iceOptions.iceServers = iceServers.filter(function(server) {
          if (server && server.urls) {
            var urls = server.urls;
            if (typeof urls === 'string') {
              urls = [urls];
            }
            urls = urls.filter(function(url) {
              return (url.indexOf('turn:') === 0 &&
                  url.indexOf('transport=udp') !== -1 &&
                  url.indexOf('turn:[') === -1) ||
                  (url.indexOf('stun:') === 0 &&
                    browserDetails.version >= 14393);
            })[0];
            return !!urls;
          }
          return false;
        });
      }
      this._config = config;

      // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
      // everything that is needed to describe a SDP m-line.
      this.transceivers = [];

      // since the iceGatherer is currently created in createOffer but we
      // must not emit candidates until after setLocalDescription we buffer
      // them in this array.
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
      var self = this;
      var sections = SDPUtils.splitSections(self.localDescription.sdp);
      // FIXME: need to apply ice candidates in a way which is async but
      // in-order
      this._localIceCandidatesBuffer.forEach(function(event) {
        var end = !event.candidate || Object.keys(event.candidate).length === 0;
        if (end) {
          for (var j = 1; j < sections.length; j++) {
            if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
              sections[j] += 'a=end-of-candidates\r\n';
            }
          }
        } else if (event.candidate.candidate.indexOf('typ endOfCandidates')
            === -1) {
          sections[event.candidate.sdpMLineIndex + 1] +=
              'a=' + event.candidate.candidate + '\r\n';
        }
        self.localDescription.sdp = sections.join('');
        self.dispatchEvent(event);
        if (self.onicecandidate !== null) {
          self.onicecandidate(event);
        }
        if (!event.candidate && self.iceGatheringState !== 'complete') {
          var complete = self.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer &&
                transceiver.iceGatherer.state === 'completed';
          });
          if (complete) {
            self.iceGatheringState = 'complete';
          }
        }
      });
      this._localIceCandidatesBuffer = [];
    };

    window.RTCPeerConnection.prototype.getConfiguration = function() {
      return this._config;
    };

    window.RTCPeerConnection.prototype.addStream = function(stream) {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      this.localStreams.push(clonedStream);
      this._maybeFireNegotiationNeeded();
    };

    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var idx = this.localStreams.indexOf(stream);
      if (idx > -1) {
        this.localStreams.splice(idx, 1);
        this._maybeFireNegotiationNeeded();
      }
    };

    window.RTCPeerConnection.prototype.getSenders = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpSender;
      })
      .map(function(transceiver) {
        return transceiver.rtpSender;
      });
    };

    window.RTCPeerConnection.prototype.getReceivers = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpReceiver;
      })
      .map(function(transceiver) {
        return transceiver.rtpReceiver;
      });
    };

    // Determines the intersection of local and remote capabilities.
    window.RTCPeerConnection.prototype._getCommonCapabilities =
        function(localCapabilities, remoteCapabilities) {
          var commonCapabilities = {
            codecs: [],
            headerExtensions: [],
            fecMechanisms: []
          };
          localCapabilities.codecs.forEach(function(lCodec) {
            for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
              var rCodec = remoteCapabilities.codecs[i];
              if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
                  lCodec.clockRate === rCodec.clockRate) {
                // number of channels is the highest common number of channels
                rCodec.numChannels = Math.min(lCodec.numChannels,
                    rCodec.numChannels);
                // push rCodec so we reply with offerer payload type
                commonCapabilities.codecs.push(rCodec);

                // determine common feedback mechanisms
                rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
                  for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                    if (lCodec.rtcpFeedback[j].type === fb.type &&
                        lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                      return true;
                    }
                  }
                  return false;
                });
                // FIXME: also need to determine .parameters
                //  see https://github.com/openpeer/ortc/issues/569
                break;
              }
            }
          });

          localCapabilities.headerExtensions
              .forEach(function(lHeaderExtension) {
                for (var i = 0; i < remoteCapabilities.headerExtensions.length;
                     i++) {
                  var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                  if (lHeaderExtension.uri === rHeaderExtension.uri) {
                    commonCapabilities.headerExtensions.push(rHeaderExtension);
                    break;
                  }
                }
              });

          // FIXME: fecMechanisms
          return commonCapabilities;
        };

    // Create ICE gatherer, ICE transport and DTLS transport.
    window.RTCPeerConnection.prototype._createIceAndDtlsTransports =
        function(mid, sdpMLineIndex) {
          var self = this;
          var iceGatherer = new RTCIceGatherer(self.iceOptions);
          var iceTransport = new RTCIceTransport(iceGatherer);
          iceGatherer.onlocalcandidate = function(evt) {
            var event = new Event('icecandidate');
            event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

            var cand = evt.candidate;
            var end = !cand || Object.keys(cand).length === 0;
            // Edge emits an empty object for RTCIceCandidateComplete‥
            if (end) {
              // polyfill since RTCIceGatherer.state is not implemented in
              // Edge 10547 yet.
              if (iceGatherer.state === undefined) {
                iceGatherer.state = 'completed';
              }

              // Emit a candidate with type endOfCandidates to make the samples
              // work. Edge requires addIceCandidate with this empty candidate
              // to start checking. The real solution is to signal
              // end-of-candidates to the other side when getting the null
              // candidate but some apps (like the samples) don't do that.
              event.candidate.candidate =
                  'candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates';
            } else {
              // RTCIceCandidate doesn't have a component, needs to be added
              cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
              event.candidate.candidate = SDPUtils.writeCandidate(cand);
            }

            // update local description.
            var sections = SDPUtils.splitSections(self.localDescription.sdp);
            if (event.candidate.candidate.indexOf('typ endOfCandidates')
                === -1) {
              sections[event.candidate.sdpMLineIndex + 1] +=
                  'a=' + event.candidate.candidate + '\r\n';
            } else {
              sections[event.candidate.sdpMLineIndex + 1] +=
                  'a=end-of-candidates\r\n';
            }
            self.localDescription.sdp = sections.join('');

            var complete = self.transceivers.every(function(transceiver) {
              return transceiver.iceGatherer &&
                  transceiver.iceGatherer.state === 'completed';
            });

            // Emit candidate if localDescription is set.
            // Also emits null candidate when all gatherers are complete.
            switch (self.iceGatheringState) {
              case 'new':
                self._localIceCandidatesBuffer.push(event);
                if (end && complete) {
                  self._localIceCandidatesBuffer.push(
                      new Event('icecandidate'));
                }
                break;
              case 'gathering':
                self._emitBufferedCandidates();
                self.dispatchEvent(event);
                if (self.onicecandidate !== null) {
                  self.onicecandidate(event);
                }
                if (complete) {
                  self.dispatchEvent(new Event('icecandidate'));
                  if (self.onicecandidate !== null) {
                    self.onicecandidate(new Event('icecandidate'));
                  }
                  self.iceGatheringState = 'complete';
                }
                break;
              case 'complete':
                // should not happen... currently!
                break;
              default: // no-op.
                break;
            }
          };
          iceTransport.onicestatechange = function() {
            self._updateConnectionState();
          };

          var dtlsTransport = new RTCDtlsTransport(iceTransport);
          dtlsTransport.ondtlsstatechange = function() {
            self._updateConnectionState();
          };
          dtlsTransport.onerror = function() {
            // onerror does not set state to failed by itself.
            dtlsTransport.state = 'failed';
            self._updateConnectionState();
          };

          return {
            iceGatherer: iceGatherer,
            iceTransport: iceTransport,
            dtlsTransport: dtlsTransport
          };
        };

    // Start the RTP Sender and Receiver for a transceiver.
    window.RTCPeerConnection.prototype._transceive = function(transceiver,
        send, recv) {
      var params = this._getCommonCapabilities(transceiver.localCapabilities,
          transceiver.remoteCapabilities);
      if (send && transceiver.rtpSender) {
        params.encodings = transceiver.sendEncodingParameters;
        params.rtcp = {
          cname: SDPUtils.localCName
        };
        if (transceiver.recvEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
        }
        transceiver.rtpSender.send(params);
      }
      if (recv && transceiver.rtpReceiver) {
        // remove RTX field in Edge 14942
        if (transceiver.kind === 'video'
            && transceiver.recvEncodingParameters) {
          transceiver.recvEncodingParameters.forEach(function(p) {
            delete p.rtx;
          });
        }
        params.encodings = transceiver.recvEncodingParameters;
        params.rtcp = {
          cname: transceiver.cname
        };
        if (transceiver.sendEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
        }
        transceiver.rtpReceiver.receive(params);
      }
    };

    window.RTCPeerConnection.prototype.setLocalDescription =
        function(description) {
          var self = this;
          var sections;
          var sessionpart;
          if (description.type === 'offer') {
            // FIXME: What was the purpose of this empty if statement?
            // if (!this._pendingOffer) {
            // } else {
            if (this._pendingOffer) {
              // VERY limited support for SDP munging. Limited to:
              // * changing the order of codecs
              sections = SDPUtils.splitSections(description.sdp);
              sessionpart = sections.shift();
              sections.forEach(function(mediaSection, sdpMLineIndex) {
                var caps = SDPUtils.parseRtpParameters(mediaSection);
                self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
              });
              this.transceivers = this._pendingOffer;
              delete this._pendingOffer;
            }
          } else if (description.type === 'answer') {
            sections = SDPUtils.splitSections(self.remoteDescription.sdp);
            sessionpart = sections.shift();
            var isIceLite = SDPUtils.matchPrefix(sessionpart,
                'a=ice-lite').length > 0;
            sections.forEach(function(mediaSection, sdpMLineIndex) {
              var transceiver = self.transceivers[sdpMLineIndex];
              var iceGatherer = transceiver.iceGatherer;
              var iceTransport = transceiver.iceTransport;
              var dtlsTransport = transceiver.dtlsTransport;
              var localCapabilities = transceiver.localCapabilities;
              var remoteCapabilities = transceiver.remoteCapabilities;

              var rejected = mediaSection.split('\n', 1)[0]
                  .split(' ', 2)[1] === '0';

              if (!rejected && !transceiver.isDatachannel) {
                var remoteIceParameters = SDPUtils.getIceParameters(
                    mediaSection, sessionpart);
                if (isIceLite) {
                  var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
                  .map(function(cand) {
                    return SDPUtils.parseCandidate(cand);
                  })
                  .filter(function(cand) {
                    return cand.component === '1';
                  });
                  // ice-lite only includes host candidates in the SDP so we can
                  // use setRemoteCandidates (which implies an
                  // RTCIceCandidateComplete)
                  if (cands.length) {
                    iceTransport.setRemoteCandidates(cands);
                  }
                }
                var remoteDtlsParameters = SDPUtils.getDtlsParameters(
                    mediaSection, sessionpart);
                if (isIceLite) {
                  remoteDtlsParameters.role = 'server';
                }

                if (!self.usingBundle || sdpMLineIndex === 0) {
                  iceTransport.start(iceGatherer, remoteIceParameters,
                      isIceLite ? 'controlling' : 'controlled');
                  dtlsTransport.start(remoteDtlsParameters);
                }

                // Calculate intersection of capabilities.
                var params = self._getCommonCapabilities(localCapabilities,
                    remoteCapabilities);

                // Start the RTCRtpSender. The RTCRtpReceiver for this
                // transceiver has already been started in setRemoteDescription.
                self._transceive(transceiver,
                    params.codecs.length > 0,
                    false);
              }
            });
          }

          this.localDescription = {
            type: description.type,
            sdp: description.sdp
          };
          switch (description.type) {
            case 'offer':
              this._updateSignalingState('have-local-offer');
              break;
            case 'answer':
              this._updateSignalingState('stable');
              break;
            default:
              throw new TypeError('unsupported type "' + description.type +
                  '"');
          }

          // If a success callback was provided, emit ICE candidates after it
          // has been executed. Otherwise, emit callback after the Promise is
          // resolved.
          var hasCallback = arguments.length > 1 &&
            typeof arguments[1] === 'function';
          if (hasCallback) {
            var cb = arguments[1];
            window.setTimeout(function() {
              cb();
              if (self.iceGatheringState === 'new') {
                self.iceGatheringState = 'gathering';
              }
              self._emitBufferedCandidates();
            }, 0);
          }
          var p = Promise.resolve();
          p.then(function() {
            if (!hasCallback) {
              if (self.iceGatheringState === 'new') {
                self.iceGatheringState = 'gathering';
              }
              // Usually candidates will be emitted earlier.
              window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
            }
          });
          return p;
        };

    window.RTCPeerConnection.prototype.setRemoteDescription =
        function(description) {
          var self = this;
          var stream = new MediaStream();
          var receiverList = [];
          var sections = SDPUtils.splitSections(description.sdp);
          var sessionpart = sections.shift();
          var isIceLite = SDPUtils.matchPrefix(sessionpart,
              'a=ice-lite').length > 0;
          this.usingBundle = SDPUtils.matchPrefix(sessionpart,
              'a=group:BUNDLE ').length > 0;
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var lines = SDPUtils.splitLines(mediaSection);
            var mline = lines[0].substr(2).split(' ');
            var kind = mline[0];
            var rejected = mline[1] === '0';
            var direction = SDPUtils.getDirection(mediaSection, sessionpart);

            var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:');
            if (mid.length) {
              mid = mid[0].substr(6);
            } else {
              mid = SDPUtils.generateIdentifier();
            }

            // Reject datachannels which are not implemented yet.
            if (kind === 'application' && mline[2] === 'DTLS/SCTP') {
              self.transceivers[sdpMLineIndex] = {
                mid: mid,
                isDatachannel: true
              };
              return;
            }

            var transceiver;
            var iceGatherer;
            var iceTransport;
            var dtlsTransport;
            var rtpSender;
            var rtpReceiver;
            var sendEncodingParameters;
            var recvEncodingParameters;
            var localCapabilities;

            var track;
            // FIXME: ensure the mediaSection has rtcp-mux set.
            var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
            var remoteIceParameters;
            var remoteDtlsParameters;
            if (!rejected) {
              remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
                  sessionpart);
              remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
                  sessionpart);
              remoteDtlsParameters.role = 'client';
            }
            recvEncodingParameters =
                SDPUtils.parseRtpEncodingParameters(mediaSection);

            var cname;
            // Gets the first SSRC. Note that with RTX there might be multiple
            // SSRCs.
            var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
                .map(function(line) {
                  return SDPUtils.parseSsrcMedia(line);
                })
                .filter(function(obj) {
                  return obj.attribute === 'cname';
                })[0];
            if (remoteSsrc) {
              cname = remoteSsrc.value;
            }

            var isComplete = SDPUtils.matchPrefix(mediaSection,
                'a=end-of-candidates', sessionpart).length > 0;
            var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
                .map(function(cand) {
                  return SDPUtils.parseCandidate(cand);
                })
                .filter(function(cand) {
                  return cand.component === '1';
                });
            if (description.type === 'offer' && !rejected) {
              var transports = self.usingBundle && sdpMLineIndex > 0 ? {
                iceGatherer: self.transceivers[0].iceGatherer,
                iceTransport: self.transceivers[0].iceTransport,
                dtlsTransport: self.transceivers[0].dtlsTransport
              } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

              if (isComplete) {
                transports.iceTransport.setRemoteCandidates(cands);
              }

              localCapabilities = RTCRtpReceiver.getCapabilities(kind);

              // filter RTX until additional stuff needed for RTX is implemented
              // in adapter.js
              localCapabilities.codecs = localCapabilities.codecs.filter(
                  function(codec) {
                    return codec.name !== 'rtx';
                  });

              sendEncodingParameters = [{
                ssrc: (2 * sdpMLineIndex + 2) * 1001
              }];

              rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);

              track = rtpReceiver.track;
              receiverList.push([track, rtpReceiver]);
              // FIXME: not correct when there are multiple streams but that is
              // not currently supported in this shim.
              stream.addTrack(track);

              // FIXME: look at direction.
              if (self.localStreams.length > 0 &&
                  self.localStreams[0].getTracks().length >= sdpMLineIndex) {
                var localTrack;
                if (kind === 'audio') {
                  localTrack = self.localStreams[0].getAudioTracks()[0];
                } else if (kind === 'video') {
                  localTrack = self.localStreams[0].getVideoTracks()[0];
                }
                if (localTrack) {
                  rtpSender = new RTCRtpSender(localTrack,
                      transports.dtlsTransport);
                }
              }

              self.transceivers[sdpMLineIndex] = {
                iceGatherer: transports.iceGatherer,
                iceTransport: transports.iceTransport,
                dtlsTransport: transports.dtlsTransport,
                localCapabilities: localCapabilities,
                remoteCapabilities: remoteCapabilities,
                rtpSender: rtpSender,
                rtpReceiver: rtpReceiver,
                kind: kind,
                mid: mid,
                cname: cname,
                sendEncodingParameters: sendEncodingParameters,
                recvEncodingParameters: recvEncodingParameters
              };
              // Start the RTCRtpReceiver now. The RTPSender is started in
              // setLocalDescription.
              self._transceive(self.transceivers[sdpMLineIndex],
                  false,
                  direction === 'sendrecv' || direction === 'sendonly');
            } else if (description.type === 'answer' && !rejected) {
              transceiver = self.transceivers[sdpMLineIndex];
              iceGatherer = transceiver.iceGatherer;
              iceTransport = transceiver.iceTransport;
              dtlsTransport = transceiver.dtlsTransport;
              rtpSender = transceiver.rtpSender;
              rtpReceiver = transceiver.rtpReceiver;
              sendEncodingParameters = transceiver.sendEncodingParameters;
              localCapabilities = transceiver.localCapabilities;

              self.transceivers[sdpMLineIndex].recvEncodingParameters =
                  recvEncodingParameters;
              self.transceivers[sdpMLineIndex].remoteCapabilities =
                  remoteCapabilities;
              self.transceivers[sdpMLineIndex].cname = cname;

              if ((isIceLite || isComplete) && cands.length) {
                iceTransport.setRemoteCandidates(cands);
              }
              if (!self.usingBundle || sdpMLineIndex === 0) {
                iceTransport.start(iceGatherer, remoteIceParameters,
                    'controlling');
                dtlsTransport.start(remoteDtlsParameters);
              }

              self._transceive(transceiver,
                  direction === 'sendrecv' || direction === 'recvonly',
                  direction === 'sendrecv' || direction === 'sendonly');

              if (rtpReceiver &&
                  (direction === 'sendrecv' || direction === 'sendonly')) {
                track = rtpReceiver.track;
                receiverList.push([track, rtpReceiver]);
                stream.addTrack(track);
              } else {
                // FIXME: actually the receiver should be created later.
                delete transceiver.rtpReceiver;
              }
            }
          });

          this.remoteDescription = {
            type: description.type,
            sdp: description.sdp
          };
          switch (description.type) {
            case 'offer':
              this._updateSignalingState('have-remote-offer');
              break;
            case 'answer':
              this._updateSignalingState('stable');
              break;
            default:
              throw new TypeError('unsupported type "' + description.type +
                  '"');
          }
          if (stream.getTracks().length) {
            self.remoteStreams.push(stream);
            window.setTimeout(function() {
              var event = new Event('addstream');
              event.stream = stream;
              self.dispatchEvent(event);
              if (self.onaddstream !== null) {
                window.setTimeout(function() {
                  self.onaddstream(event);
                }, 0);
              }

              receiverList.forEach(function(item) {
                var track = item[0];
                var receiver = item[1];
                var trackEvent = new Event('track');
                trackEvent.track = track;
                trackEvent.receiver = receiver;
                trackEvent.streams = [stream];
                self.dispatchEvent(event);
                if (self.ontrack !== null) {
                  window.setTimeout(function() {
                    self.ontrack(trackEvent);
                  }, 0);
                }
              });
            }, 0);
          }
          if (arguments.length > 1 && typeof arguments[1] === 'function') {
            window.setTimeout(arguments[1], 0);
          }
          return Promise.resolve();
        };

    window.RTCPeerConnection.prototype.close = function() {
      this.transceivers.forEach(function(transceiver) {
        /* not yet
        if (transceiver.iceGatherer) {
          transceiver.iceGatherer.close();
        }
        */
        if (transceiver.iceTransport) {
          transceiver.iceTransport.stop();
        }
        if (transceiver.dtlsTransport) {
          transceiver.dtlsTransport.stop();
        }
        if (transceiver.rtpSender) {
          transceiver.rtpSender.stop();
        }
        if (transceiver.rtpReceiver) {
          transceiver.rtpReceiver.stop();
        }
      });
      // FIXME: clean up tracks, local streams, remote streams, etc
      this._updateSignalingState('closed');
    };

    // Update the signaling state.
    window.RTCPeerConnection.prototype._updateSignalingState =
        function(newState) {
          this.signalingState = newState;
          var event = new Event('signalingstatechange');
          this.dispatchEvent(event);
          if (this.onsignalingstatechange !== null) {
            this.onsignalingstatechange(event);
          }
        };

    // Determine whether to fire the negotiationneeded event.
    window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded =
        function() {
          // Fire away (for now).
          var event = new Event('negotiationneeded');
          this.dispatchEvent(event);
          if (this.onnegotiationneeded !== null) {
            this.onnegotiationneeded(event);
          }
        };

    // Update the connection state.
    window.RTCPeerConnection.prototype._updateConnectionState = function() {
      var self = this;
      var newState;
      var states = {
        'new': 0,
        closed: 0,
        connecting: 0,
        checking: 0,
        connected: 0,
        completed: 0,
        failed: 0
      };
      this.transceivers.forEach(function(transceiver) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      });
      // ICETransport.completed and connected are the same for this purpose.
      states.connected += states.completed;

      newState = 'new';
      if (states.failed > 0) {
        newState = 'failed';
      } else if (states.connecting > 0 || states.checking > 0) {
        newState = 'connecting';
      } else if (states.disconnected > 0) {
        newState = 'disconnected';
      } else if (states.new > 0) {
        newState = 'new';
      } else if (states.connected > 0 || states.completed > 0) {
        newState = 'connected';
      }

      if (newState !== self.iceConnectionState) {
        self.iceConnectionState = newState;
        var event = new Event('iceconnectionstatechange');
        this.dispatchEvent(event);
        if (this.oniceconnectionstatechange !== null) {
          this.oniceconnectionstatechange(event);
        }
      }
    };

    window.RTCPeerConnection.prototype.createOffer = function() {
      var self = this;
      if (this._pendingOffer) {
        throw new Error('createOffer called while there is a pending offer.');
      }
      var offerOptions;
      if (arguments.length === 1 && typeof arguments[0] !== 'function') {
        offerOptions = arguments[0];
      } else if (arguments.length === 3) {
        offerOptions = arguments[2];
      }

      var tracks = [];
      var numAudioTracks = 0;
      var numVideoTracks = 0;
      // Default to sendrecv.
      if (this.localStreams.length) {
        numAudioTracks = this.localStreams[0].getAudioTracks().length;
        numVideoTracks = this.localStreams[0].getVideoTracks().length;
      }
      // Determine number of audio and video tracks we need to send/recv.
      if (offerOptions) {
        // Reject Chrome legacy constraints.
        if (offerOptions.mandatory || offerOptions.optional) {
          throw new TypeError(
              'Legacy mandatory/optional constraints not supported.');
        }
        if (offerOptions.offerToReceiveAudio !== undefined) {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
        if (offerOptions.offerToReceiveVideo !== undefined) {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
      if (this.localStreams.length) {
        // Push local streams.
        this.localStreams[0].getTracks().forEach(function(track) {
          tracks.push({
            kind: track.kind,
            track: track,
            wantReceive: track.kind === 'audio' ?
                numAudioTracks > 0 : numVideoTracks > 0
          });
          if (track.kind === 'audio') {
            numAudioTracks--;
          } else if (track.kind === 'video') {
            numVideoTracks--;
          }
        });
      }
      // Create M-lines for recvonly streams.
      while (numAudioTracks > 0 || numVideoTracks > 0) {
        if (numAudioTracks > 0) {
          tracks.push({
            kind: 'audio',
            wantReceive: true
          });
          numAudioTracks--;
        }
        if (numVideoTracks > 0) {
          tracks.push({
            kind: 'video',
            wantReceive: true
          });
          numVideoTracks--;
        }
      }

      var sdp = SDPUtils.writeSessionBoilerplate();
      var transceivers = [];
      tracks.forEach(function(mline, sdpMLineIndex) {
        // For each track, create an ice gatherer, ice transport,
        // dtls transport, potentially rtpsender and rtpreceiver.
        var track = mline.track;
        var kind = mline.kind;
        var mid = SDPUtils.generateIdentifier();

        var transports = self.usingBundle && sdpMLineIndex > 0 ? {
          iceGatherer: transceivers[0].iceGatherer,
          iceTransport: transceivers[0].iceTransport,
          dtlsTransport: transceivers[0].dtlsTransport
        } : self._createIceAndDtlsTransports(mid, sdpMLineIndex);

        var localCapabilities = RTCRtpSender.getCapabilities(kind);
        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
        localCapabilities.codecs.forEach(function(codec) {
          // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
          // by adding level-asymmetry-allowed=1
          if (codec.name === 'H264' &&
              codec.parameters['level-asymmetry-allowed'] === undefined) {
            codec.parameters['level-asymmetry-allowed'] = '1';
          }
        });

        var rtpSender;
        var rtpReceiver;

        // generate an ssrc now, to be used later in rtpSender.send
        var sendEncodingParameters = [{
          ssrc: (2 * sdpMLineIndex + 1) * 1001
        }];
        if (track) {
          rtpSender = new RTCRtpSender(track, transports.dtlsTransport);
        }

        if (mline.wantReceive) {
          rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
        }

        transceivers[sdpMLineIndex] = {
          iceGatherer: transports.iceGatherer,
          iceTransport: transports.iceTransport,
          dtlsTransport: transports.dtlsTransport,
          localCapabilities: localCapabilities,
          remoteCapabilities: null,
          rtpSender: rtpSender,
          rtpReceiver: rtpReceiver,
          kind: kind,
          mid: mid,
          sendEncodingParameters: sendEncodingParameters,
          recvEncodingParameters: null
        };
      });
      if (this.usingBundle) {
        sdp += 'a=group:BUNDLE ' + transceivers.map(function(t) {
          return t.mid;
        }).join(' ') + '\r\n';
      }
      tracks.forEach(function(mline, sdpMLineIndex) {
        var transceiver = transceivers[sdpMLineIndex];
        sdp += SDPUtils.writeMediaSection(transceiver,
            transceiver.localCapabilities, 'offer', self.localStreams[0]);
      });

      this._pendingOffer = transceivers;
      var desc = new RTCSessionDescription({
        type: 'offer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.createAnswer = function() {
      var self = this;

      var sdp = SDPUtils.writeSessionBoilerplate();
      if (this.usingBundle) {
        sdp += 'a=group:BUNDLE ' + this.transceivers.map(function(t) {
          return t.mid;
        }).join(' ') + '\r\n';
      }
      this.transceivers.forEach(function(transceiver) {
        if (transceiver.isDatachannel) {
          sdp += 'm=application 0 DTLS/SCTP 5000\r\n' +
              'c=IN IP4 0.0.0.0\r\n' +
              'a=mid:' + transceiver.mid + '\r\n';
          return;
        }
        // Calculate intersection of capabilities.
        var commonCapabilities = self._getCommonCapabilities(
            transceiver.localCapabilities,
            transceiver.remoteCapabilities);

        sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
            'answer', self.localStreams[0]);
      });

      var desc = new RTCSessionDescription({
        type: 'answer',
        sdp: sdp
      });
      if (arguments.length && typeof arguments[0] === 'function') {
        window.setTimeout(arguments[0], 0, desc);
      }
      return Promise.resolve(desc);
    };

    window.RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
      if (!candidate) {
        this.transceivers.forEach(function(transceiver) {
          transceiver.iceTransport.addRemoteCandidate({});
        });
      } else {
        var mLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < this.transceivers.length; i++) {
            if (this.transceivers[i].mid === candidate.sdpMid) {
              mLineIndex = i;
              break;
            }
          }
        }
        var transceiver = this.transceivers[mLineIndex];
        if (transceiver) {
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return;
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component !== '1') {
            return;
          }
          // A dirty hack to make samples work.
          if (cand.type === 'endOfCandidates') {
            cand = {};
          }
          transceiver.iceTransport.addRemoteCandidate(cand);

          // update the remoteDescription.
          var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
          sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim()
              : 'a=end-of-candidates') + '\r\n';
          this.remoteDescription.sdp = sections.join('');
        }
      }
      if (arguments.length > 1 && typeof arguments[1] === 'function') {
        window.setTimeout(arguments[1], 0);
      }
      return Promise.resolve();
    };

    window.RTCPeerConnection.prototype.getStats = function() {
      var promises = [];
      this.transceivers.forEach(function(transceiver) {
        ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
            'dtlsTransport'].forEach(function(method) {
              if (transceiver[method]) {
                promises.push(transceiver[method].getStats());
              }
            });
      });
      var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
          arguments[1];
      return new Promise(function(resolve) {
        // shim getStats with maplike support
        var results = new Map();
        Promise.all(promises).then(function(res) {
          res.forEach(function(result) {
            Object.keys(result).forEach(function(id) {
              results.set(id, result[id]);
              results[id] = result[id];
            });
          });
          if (cb) {
            window.setTimeout(cb, 0, results);
          }
          resolve(results);
        });
      });
    };
  }
};

// Expose public methods.
module.exports = {
  shimPeerConnection: edgeShim.shimPeerConnection,
  shimGetUserMedia: require('./getusermedia')
};

},{"../utils":41,"./getusermedia":37,"sdp":32}],37:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

// Expose public methods.
module.exports = function() {
  var shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(function(e) {
      return Promise.reject(shimError_(e));
    });
  };
};

},{}],38:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var browserDetails = require('../utils').browserDetails;

var firefoxShim = {
  shimOnTrack: function() {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimSourceObject: function() {
    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this.mozSrcObject;
          },
          set: function(stream) {
            this.mozSrcObject = stream;
          }
        });
      }
    }
  },

  shimPeerConnection: function() {
    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
        window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (browserDetails.version < 38) {
          // .urls is not supported in FF < 38.
          // create RTCIceServers with a single url.
          if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for (var i = 0; i < pcConfig.iceServers.length; i++) {
              var server = pcConfig.iceServers[i];
              if (server.hasOwnProperty('urls')) {
                for (var j = 0; j < server.urls.length; j++) {
                  var newServer = {
                    url: server.urls[j]
                  };
                  if (server.urls[j].indexOf('turn') === 0) {
                    newServer.username = server.username;
                    newServer.credential = server.credential;
                  }
                  newIceServers.push(newServer);
                }
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
        }
        return new mozRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype;

      // wrap static methods. Currently just generateCertificate.
      if (mozRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return mozRTCPeerConnection.generateCertificate;
          }
        });
      }

      window.RTCSessionDescription = mozRTCSessionDescription;
      window.RTCIceCandidate = mozRTCIceCandidate;
    }

    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = RTCPeerConnection.prototype[method];
          RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                RTCIceCandidate : RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        RTCPeerConnection.prototype.addIceCandidate;
    RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };

    if (browserDetails.version < 48) {
      // shim getStats with maplike support
      var makeMapStats = function(stats) {
        var map = new Map();
        Object.keys(stats).forEach(function(key) {
          map.set(key, stats[key]);
          map[key] = stats[key];
        });
        return map;
      };

      var nativeGetStats = RTCPeerConnection.prototype.getStats;
      RTCPeerConnection.prototype.getStats = function(selector, onSucc, onErr) {
        return nativeGetStats.apply(this, [selector || null])
          .then(function(stats) {
            return makeMapStats(stats);
          })
          .then(onSucc, onErr);
      };
    }
  }
};

// Expose public methods.
module.exports = {
  shimOnTrack: firefoxShim.shimOnTrack,
  shimSourceObject: firefoxShim.shimSourceObject,
  shimPeerConnection: firefoxShim.shimPeerConnection,
  shimGetUserMedia: require('./getusermedia')
};

},{"../utils":41,"./getusermedia":39}],39:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var logging = require('../utils').log;
var browserDetails = require('../utils').browserDetails;

// Expose public methods.
module.exports = function() {
  var shimError_ = function(e) {
    return {
      name: {
        SecurityError: 'NotAllowedError',
        PermissionDeniedError: 'NotAllowedError'
      }[e.name] || e.name,
      message: {
        'The operation is insecure.': 'The request is not allowed by the ' +
        'user agent or the platform in the current context.'
      }[e.message] || e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  // getUserMedia constraints shim.
  var getUserMedia_ = function(constraints, onSuccess, onError) {
    var constraintsToFF37_ = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r. min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    constraints = JSON.parse(JSON.stringify(constraints));
    if (browserDetails.version < 38) {
      logging('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37_(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37_(constraints.video);
      }
      logging('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
      onError(shimError_(e));
    });
  };

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      getUserMedia_(constraints, resolve, reject);
    });
  };

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
        return new Promise(function(resolve) {
          var infos = [
            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
          ];
          resolve(infos);
        });
      };

  if (browserDetails.version < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
  if (browserDetails.version < 49) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).then(function(stream) {
        // Work around https://bugzil.la/802326
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(function(track) {
            track.stop();
          });
          throw new DOMException('The object can not be found here.',
                                 'NotFoundError');
        }
        return stream;
      }, function(e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    if (browserDetails.version < 44) {
      return getUserMedia_(constraints, onSuccess, onError);
    }
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    console.warn('navigator.getUserMedia has been replaced by ' +
                 'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
};

},{"../utils":41}],40:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';
var safariShim = {
  // TODO: DrAlex, should be here, double check against LayoutTests
  // shimOnTrack: function() { },

  // TODO: once the back-end for the mac port is done, add.
  // TODO: check for webkitGTK+
  // shimPeerConnection: function() { },

  shimGetUserMedia: function() {
    navigator.getUserMedia = navigator.webkitGetUserMedia;
  }
};

// Expose public methods.
module.exports = {
  shimGetUserMedia: safariShim.shimGetUserMedia
  // TODO
  // shimOnTrack: safariShim.shimOnTrack,
  // shimPeerConnection: safariShim.shimPeerConnection
};

},{}],41:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var logDisabled_ = true;

// Utility methods.
var utils = {
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  extractVersion: function(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  },

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  detectBrowser: function() {
    // Returned result object.
    var result = {};
    result.browser = null;
    result.version = null;

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }

    // Firefox.
    if (navigator.mozGetUserMedia) {
      result.browser = 'firefox';
      result.version = this.extractVersion(navigator.userAgent,
          /Firefox\/([0-9]+)\./, 1);

    // all webkit-based browsers
    } else if (navigator.webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
      if (window.webkitRTCPeerConnection) {
        result.browser = 'chrome';
        result.version = this.extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/([0-9]+)\./, 2);

      // Safari or unknown webkit-based
      // for the time being Safari has support for MediaStreams but not webRTC
      } else {
        // Safari UA substrings of interest for reference:
        // - webkit version:           AppleWebKit/602.1.25 (also used in Op,Cr)
        // - safari UI version:        Version/9.0.3 (unique to Safari)
        // - safari UI webkit version: Safari/601.4.4 (also used in Op,Cr)
        //
        // if the webkit version and safari UI webkit versions are equals,
        // ... this is a stable version.
        //
        // only the internal webkit version is important today to know if
        // media streams are supported
        //
        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
          result.browser = 'safari';
          result.version = this.extractVersion(navigator.userAgent,
            /AppleWebKit\/([0-9]+)\./, 1);

        // unknown webkit-based browser
        } else {
          result.browser = 'Unsupported webkit-based browser ' +
              'with GUM support but no WebRTC support.';
          return result;
        }
      }

    // Edge.
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
      result.browser = 'edge';
      result.version = this.extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);

    // Default fallthrough: not supported.
    } else {
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  }
};

// Export.
module.exports = {
  log: utils.log,
  disableLog: utils.disableLog,
  browserDetails: utils.detectBrowser(),
  extractVersion: utils.extractVersion
};

},{}]},{},[3]);
