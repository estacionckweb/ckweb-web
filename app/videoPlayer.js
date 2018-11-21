function videoPlayer(opts) {
  console.log('stream', opts)
  this.stream = opts.stream
  this.container = opts.container
  this.isPlaying = false

  this.player = document.createElement('video')
  this.player.src = this.stream
  this.player.controls = true
  this.player.width = window.innerWidth
  this.player.height = window.innerHeight


  this.player.onplay = () => {
    console.log("play!")
    this.player.style.position = 'absolute'
    this.player.style.zIndex = 100
  }
  this.player.onpause = () => {
    console.log("pause!")
    this.player.style.position = 'static'
  }
  this.container.appendChild(this.player)
}

// audioPlayer.prototype.play = function () {
//   this.pauseButton.style.display = 'block'
//   this.playButton.style.display = 'none'
//   this.audio.play()
//   this.onPlay()
// }
//
// audioPlayer.prototype.pause = function() {
//   this.playButton.style.display = 'block'
//   this.pauseButton.style.display = 'none'
//   this.audio.pause()
//   this.onPause()
// }
//
// audioPlayer.prototype.onPlay = () => {}
//
// audioPlayer.prototype.onPause = () => {}

module.exports = videoPlayer
