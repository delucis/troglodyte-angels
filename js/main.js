// collect UI elements as variables
var instrumentsMenu = document.querySelector('#instrumentSelect');
var playButton = document.querySelector('#playNext');
var stopButton = document.querySelector('#stopButton');
var gainSlider = document.querySelector('#gainSlider');
var nextCueNum = document.querySelector('#nextCue');
var currentCueNum = document.querySelector('#currentCue');
var incCueButton = document.querySelector('#incrementNextCue');
var decCueButton = document.querySelector('#decrementNextCue');
// get volume slider’s current value
var gainSliderVal = gainSlider.value;
// create audio context
var audioContext = new AudioContext();
// create master gain, set it using the slider value, & connect to output
var masterGainNode = audioContext.createGain();
masterGainNode.gain.value = gainSliderVal * gainSliderVal;
masterGainNode.connect(audioContext.destination);
var masterGainNodeVal = masterGainNode.gain.value; // variable to pass on current gain value
// create gain node to control oscillator amplitude, set to 0, & connect to master gain
var oscGainNode = audioContext.createGain();
oscGainNode.gain.value = 0;
oscGainNode.connect(masterGainNode);
var oscGainNodeVal = oscGainNode.gain.value;
// declare empty initial oscillator variables
var oscillator = null;
var oscillatorState = 0;
// set up next cue system variables
var nextCue = nextCueNum.valueAsNumber;
var minCue = 1;
var maxCue = Infinity;
// associate functions with UI actions
playButton.onmousedown = playNext;
stopButton.onmousedown = mute;
incCueButton.onmousedown = cueIncrement;
decCueButton.onmousedown = cueDecrement;
nextCueNum.oninput = updateNextCue;
gainSlider.oninput = adjustGain;

// = = = = = = = = = = //
//  F U N C T I O N S  //
// = = = = = = = = = = //
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
  gainChange(1);
  setCurrentCue();
  if (stopButton.disabled == true) {
    stopButton.disabled = false;
  }
  if (instrumentsMenu.disabled == false) {
    instrumentsMenu.disabled = true;
  }
}

function mute() {
  gainChange(0);
  oscillator.stop(audioContext.currentTime + 0.06);
  stopButton.disabled = true;
  if (instrumentsMenu.disabled == true) {
    instrumentsMenu.disabled = false;
  }
}

function gainChange(newLevel, time) {
  if (newLevel === undefined) {
    throw "gainChange() needs at least one argument";
  }
  if (time === undefined) {
    time = 0.05;
  }
  if (oscGainNode) {
    oscGainNode.gain.cancelScheduledValues(audioContext.currentTime);
    oscGainNodeVal = oscGainNode.gain.value;
    oscGainNode.gain.setValueAtTime(oscGainNodeVal, audioContext.currentTime);
    oscGainNode.gain.linearRampToValueAtTime(newLevel, audioContext.currentTime + time);
  }
}

function setCurrentCue() {
  currentCueNum.innerHTML = nextCue;
  cueIncrement();
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
  masterGainNodeVal = masterGainNode.gain.value;
  masterGainNode.gain.setValueAtTime(masterGainNodeVal, audioContext.currentTime);
  masterGainNode.gain.linearRampToValueAtTime(gainSliderVal * gainSliderVal, audioContext.currentTime + 0.03);
}
