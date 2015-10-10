var playButton = document.querySelector('#playNext');
var stopButton = document.querySelector('#stopButton');
var audioContext = new AudioContext();
var gainNode = audioContext.createGain();
var oscillator = audioContext.createOscillator();
var oscillatorState = 0;

oscillator.type = 'sine';
oscillator.frequency.value = 1000;
gainNode.gain.value = 0;

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

playButton.onmousedown = playCurve;
stopButton.onmousedown = mute;

function playCurve() {
  if (oscillatorState === 0) {
    oscillatorState = 1;
    oscillator.start(0);
  }
  gainNode.gain.value = 1;
  if (stopButton.disabled == true) {
    stopButton.disabled = false;
  }
}

function mute() {
  if (gainNode) {
    gainNode.gain.value = 0;
    stopButton.disabled = true;
  }
}
