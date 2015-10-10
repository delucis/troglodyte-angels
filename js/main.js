var playButton = document.querySelector('#playNext');
var stopButton = document.querySelector('#stopButton');
var gainSlider = document.querySelector('#gainSlider');
var gainSliderVal = gainSlider.value;
var audioContext = new AudioContext();
var masterGainNode = audioContext.createGain();
var masterGainVal = gainSliderVal;
var oscGain = audioContext.createGain();
var oscillator = audioContext.createOscillator();
var oscillatorState = 0;

oscillator.type = 'sine';
oscillator.frequency.value = 1000;
oscGain.gain.value = 0;
masterGainNode.gain.value = masterGainVal;

oscillator.connect(oscGain);
oscGain.connect(masterGainNode);
masterGainNode.connect(audioContext.destination);

playButton.onmousedown = playCurve;
stopButton.onmousedown = mute;
gainSlider.oninput = adjustGain;

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

function adjustGain() {
  gainSliderVal = gainSlider.value;
  masterGainNode.gain.linearRampToValueAtTime(gainSliderVal, audioContext.currentTime + 0.1);
  masterGainVal = gainSliderVal;
}
