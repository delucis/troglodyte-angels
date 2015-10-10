var playButton = document.querySelector('#playNext');
var stopButton = document.querySelector('#stopButton');
var gainSlider = document.querySelector('#gainSlider');
var nextCueNum = document.querySelector('#nextCue');
var incCueButton = document.querySelector('#incrementNextCue');
var decCueButton = document.querySelector('#decrementNextCue');
var gainSliderVal = gainSlider.value;
var audioContext = new AudioContext();
var masterGainNode = audioContext.createGain();
var masterGainVal = gainSliderVal * gainSliderVal;
var oscGain = audioContext.createGain();
var oscillator = audioContext.createOscillator();
var oscillatorState = 0;

var nextCue = nextCueNum.valueAsNumber;
var minCue = 1;
var maxCue = Infinity;

oscillator.type = 'sine';
oscillator.frequency.value = 1000;
oscGain.gain.value = 0;
masterGainNode.gain.value = masterGainVal;

oscillator.connect(oscGain);
oscGain.connect(masterGainNode);
masterGainNode.connect(audioContext.destination);

playButton.onmousedown = playCurve;
stopButton.onmousedown = mute;
incCueButton.onmousedown = cueIncrement;
decCueButton.onmousedown = cueDecrement;
nextCueNum.oninput = updateNextCue;
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

function cueIncrement() {
  if (nextCue < maxCue) {
    nextCueNum.stepUp(1);
    nextCue = nextCueNum.valueAsNumber;
  }
}
function cueDecrement() {
  if (nextCue > minCue) {
    nextCueNum.stepDown(1);
    nextCue = nextCueNum.valueAsNumber;
  }
}
function updateNextCue() {
  nextCue = nextCueNum.valueAsNumber;
}

function adjustGain() {
  gainSliderVal = gainSlider.value;
  masterGainNode.gain.linearRampToValueAtTime(gainSliderVal * gainSliderVal, audioContext.currentTime + 0.1);
  masterGainVal = gainSliderVal * gainSliderVal;
}
