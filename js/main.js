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
var oscillatorFreqVal = 0;

// set up instruments system
var currentInstrument = 0;
var cueArray = new Array();
// set up next cue system variables
var nextCue = 0;
var minCue = 0;
var maxCue = Infinity;

// load cue file from JSON
var instrumentList = new Array();
var cueList = new Array();
var instrumentCues = '';
jQuery.getJSON("cue-data.json", function(data) {
  // build variables from JSON
  for (var i in data.instruments) {
    instrumentList.push(data.instruments[i].name);
    cueList.push(data.instruments[i].cues);
  }
  // remove existing <select> menu items
  while (instrumentsMenu.options.length > 0) {
    instrumentsMenu.remove(instrumentsMenu.options.length - 1);
  }
  // add new <select> menu items
  for (i = 0; i < instrumentList.length; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.text = instrumentList[i];
    instrumentsMenu.add(opt, null)
  }
  // select first option by defauly
  instrumentsMenu.selectedIndex = 0;
  // initialise default cueArray
  loadInstrumentCues(0);
})
  // display error alert if JSON load fails
  .fail(function() {
    insertErrorAlert("Could not load cue data");
  });

// associate functions with UI actions
instrumentsMenu.onchange = loadInstrumentCues;
playButton.onmousedown = playNext;
stopButton.onmousedown = mute;
incCueButton.onmousedown = cueIncrement;
decCueButton.onmousedown = cueDecrement;
nextCueNum.oninput = updateNextCue;
gainSlider.oninput = adjustGain;

// = = = = = = = = = = //
//  F U N C T I O N S  //
// = = = = = = = = = = //
function loadInstrumentCues(instrumentIndex) {
  if (typeof(instrumentIndex) !== "number") {
    currentInstrument = instrumentsMenu.selectedIndex;
  } else {
    currentInstrument = instrumentIndex;
  }
  instrumentCues = cueList[currentInstrument];
  cueArray = Object.keys(instrumentCues);
  maxCue = cueArray.length - 1;
  nextCue = minCue;
  nextCueNum.value = cueArray[nextCue];
  cueIncDecEnabler();
}

function playNext() {
  oscInit();
  gainChange(1);
  // set current cue display and increment next cue
  setCurrentCue();
  stopButton.disabled = false;
  instrumentsMenu.disabled = true;
}

function mute() {
  gainChange(0);
  oscillator.stop(audioContext.currentTime + 0.06);
  setCurrentCue(0);
  stopButton.disabled = true;
  instrumentsMenu.disabled = false;
}

function oscInit(freq, type) {
  if (freq === undefined) {
    freq = 880;
  }
  if (type === undefined) {
    type = 'sine';
  }
  if (oscillatorState === 0) {
    oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    oscillator.connect(oscGainNode);
    oscillatorState = 1;
    oscillator.start(0);
    oscillator.onended = function() {
      oscillatorState = 0;
      oscillator.disconnect();
    };
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

function freqChange(newFreq, time) {
  if (newFreq === undefined) {
    throw "freqChange() needs at least one argument";
  }
  if (time === undefined) {
    time = 0.05;
  }
  if (oscillator) {
    oscillator.frequency.cancelScheduledValues(audioContext.currentTime);
    oscillatorFreqVal = oscillator.frequency.value;
    oscillator.frequency.setValueAtTime(oscillatorFreqVal, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(newFreq, audioContext.currentTime + time);
  }
}

function setCurrentCue(val) {
  if (val === 0) {
    currentCueNum.innerHTML = "n/a";
  } else {
    currentCueNum.innerHTML = cueArray[nextCue];
    cueIncrement();
  }
}

function cueIncrement() {
  if (nextCue < maxCue) {
    nextCue++;
    nextCueNum.value = cueArray[nextCue];
  }
  cueIncDecEnabler();
}
function cueDecrement() {
  if (nextCue > minCue) {
    nextCue--;
    nextCueNum.value = cueArray[nextCue];
  }
  cueIncDecEnabler();
}
function updateNextCue() {
  if (cueArray.indexOf(nextCueNum.value) >= 0) {
    nextCue = cueArray.indexOf(nextCueNum.value);
  } else {
  }
}
function cueIncDecEnabler() {
  if (nextCue <= minCue) {
    decCueButton.disabled = true;
  }
  if (nextCue > minCue) {
    decCueButton.disabled = false;
  }
  if (nextCue >= maxCue) {
    incCueButton.disabled = true;
  }
  if (nextCue < maxCue) {
    incCueButton.disabled = false;
  }
}

function adjustGain() {
  gainSliderVal = gainSlider.value;
  masterGainNode.gain.cancelScheduledValues(audioContext.currentTime);
  masterGainNodeVal = masterGainNode.gain.value;
  masterGainNode.gain.setValueAtTime(masterGainNodeVal, audioContext.currentTime);
  masterGainNode.gain.linearRampToValueAtTime(gainSliderVal * gainSliderVal, audioContext.currentTime + 0.03);
}

function insertErrorAlert(string) {
  if (string === undefined) {
    string = 'Unknown error…';
  }
  jQuery("#firstFormGroup").before(
  '<div class="alert alert-danger alert-dismissable fade in" role="alert">' +
  '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
  '<span aria-hidden="true">&times;</span>' +
  '</button>' +
  '<strong>Error:</strong> ' + string +
  '</div>');
}
