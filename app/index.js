const AudioPlayer = require('./audioPlayer.js')
const HydraBackground = require('./hydraBackground.js')


var canvas = document.getElementById("hydra")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var hydra = new HydraBackground({
  canvas: canvas,
  initialAnimationDuration: 1000
})

var player = new AudioPlayer({
  stream: "http://radiolibre.co:8000/streamvivo.ogg",
  type: "application/ogg",
  container: document.getElementById("player")
})

player.onPlay = () => { hydra.play() }

player.onPause = () => { hydra.pause() }
