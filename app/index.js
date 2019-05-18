const AudioPlayer = require('./audioPlayer.js')
const VideoPlayer = require('./videoPlayer.js')
const HydraBackground = require('./hydraBackground.js')

var canvas = document.getElementById("hydra")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
 //alert("hi")

var hydra = new HydraBackground({
  canvas: canvas,
  initialAnimationDuration: 300
})

var audio = new AudioPlayer({
  stream: "http://domolleno2018.out.airtime.pro:8000/domolleno2018_a",
  type: "application/ogg",
  container: document.getElementById("player")
})



audio.onPlay = () => { hydra.play() }

audio.onPause = () => { hydra.pause() }
