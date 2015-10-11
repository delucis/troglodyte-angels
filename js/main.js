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
var tempVal = masterGainNode.gain.value;
var oscGain = audioContext.createGain();
var oscillatorState = 0;

var nextCue = nextCueNum.valueAsNumber;
var minCue = 1;
var maxCue = Infinity;

oscGain.gain.value = 0;
masterGainNode.gain.value = masterGainVal;

oscGain.connect(masterGainNode);
masterGainNode.connect(audioContext.destination);

playButton.onmousedown = playNext;
stopButton.onmousedown = mute;
incCueButton.onmousedown = cueIncrement;
decCueButton.onmousedown = cueDecrement;
nextCueNum.oninput = updateNextCue;
gainSlider.oninput = adjustGain;


function playNext() {
  if (oscillatorState === 0) {
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 1000;
    oscillator.connect(oscGainNode);
    oscillatorState = 1;
    oscillator.start(0);
    oscillator.onended = function() {
      oscillatorState = 0;
      oscillator.disconnect();
    };
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
    oscillator.stop(audioContext.currentTime + 0.06);
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
  masterGainNode.gain.cancelScheduledValues(audioContext.currentTime);
  tempVal = masterGainNode.gain.value;
  masterGainNode.gain.setValueAtTime(tempVal, audioContext.currentTime);
  masterGainNode.gain.linearRampToValueAtTime(gainSliderVal * gainSliderVal, audioContext.currentTime + 0.03);
  masterGainVal = gainSliderVal * gainSliderVal;
}
