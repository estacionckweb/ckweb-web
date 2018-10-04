const Hydra = require('hydra-synth')
const AudioPlayer = require('./audioPlayer.js')

console.log("hello")

var canvas = document.getElementById("hydra")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var hydra = new Hydra({ canvas: canvas })
var player = new AudioPlayer({
  stream: "http://radiolibre.co:8000/streamvivo.ogg",
  type: "application/ogg",
  container: document.getElementById("player")
})
  
osc(80, 0.02, 1.4)
  .rotate(0.1, -0.008)
.pixelate(50, 20)
  .diff(o0)
  .luma(0.1)
  .scale(1.01)
  .out()