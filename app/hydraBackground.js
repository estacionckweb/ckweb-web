const Hydra = require('hydra-synth')
var loop = require('raf-loop')


function hydraBackground({ canvas, initialAnimationDuration }) {
  var self = this
  this.hydra = new Hydra({
    canvas: canvas,
    autoLoop: false
  })
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
