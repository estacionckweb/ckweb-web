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
  stream: "http://radiolibre.co:8000/streamvivo.ogg",
  type: "application/ogg",
  container: document.getElementById("player")
})

var videoPlayer = new VideoPlayer({
  stream: "https://ia902909.us.archive.org/4/items/Lab.DatanaturaMSTRMay7/Lab.%20Datanatura-MSTR-May7.ogv",
  type: "video/ogg",
  container: document.getElementsByClassName("container")[0]
})

audio.onPlay = () => { hydra.play() }

audio.onPause = () => { hydra.pause() }
