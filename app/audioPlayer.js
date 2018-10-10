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
