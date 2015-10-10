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
  oscGain.gain.setValueAtTime(0, audioContext.currentTime);
  oscGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.05);
  if (stopButton.disabled == true) {
    stopButton.disabled = false;
  }
}

function mute() {
  if (oscGain) {
    oscGain.gain.setValueAtTime(1, audioContext.currentTime);
    oscGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.05);
    stopButton.disabled = true;
  }
}
