var voice = new Wad({source : 'mic' });
var tuner = new Wad.Poly();
var onOffTimer;
var tunerOn = false;

var indicator = [];

var pitchesRef = [
  ['A0', 27.5000], ['A#/Bb0', 29.1352], ['B0', 30.8677], ['C1', 32.7032],
  ['C#/Db1', 34.6478], ['D1', 36.7081], ['D#/Eb1', 38.8909], ['E1', 41.2034],
  ['F1', 43.6535], ['F#/Gb1', 46.2493], ['G1', 48.9994], ['G#/Ab1', 51.9131],
  ['A1', 55.0000], ['A#/Bb1', 58.2705], ['B1', 61.7354], ['C2', 65.4064],
  ['C#/Db2', 69.2957], ['D2', 73.4162], ['D#/Eb2', 77.7817], ['E2', 82.4069],
  ['F2', 87.3071], ['F#/Gb2', 92.4986], ['G2', 97.9989], ['G#/Ab2', 103.826],
  ['A2', 110.000], ['A#/Bb2', 116.541], ['B2', 123.471], ['C3', 130.813],
  ['C#/Db3', 138.591], ['D3', 146.832], ['D#/Eb3', 155.563], ['E3', 164.814],
  ['F3', 174.614], ['F#/Gb3', 184.997], ['G3', 195.998], ['G#/Ab3', 207.652],
  ['A3', 220.000], ['A#/Bb3', 233.082], ['B3', 246.942], ['C4', 261.626],
  ['C#/Db4', 277.183], ['D4', 293.665], ['D#/Eb4', 311.127], ['E4', 329.628],
  ['F4', 349.228], ['F#/Gb4', 369.994], ['G4', 391.995], ['G#/Ab4', 415.305],
  ['A4', 440.000], ['A#/Bb4', 466.164], ['B4', 493.883], ['C5', 523.251],
  ['C#/Db5', 554.365], ['D5', 587.330], ['D#/Eb5', 622.254], ['E5', 659.255],
  ['F5', 698.456], ['F#/Gb5', 739.989], ['G5' , 783.991], ['G#/Ab5', 830.609],
  ['A5', 880.000], ['A#/Bb5', 932.328], ['B5', 987.767], ['C6', 1046.50],
  ['C#/Db6', 1108.73], ['D6', 1174.66], ['D#/Eb6', 1244.51], ['E6', 1318.51],
  ['F6', 1396.91], ['F#/Gb6', 1479.98], ['G6', 1567.98], ['G#/Ab6', 1661.22],
  ['A6', 1760.00], ['A#/Bb6', 1864.66], ['B6' , 1975.53], ['C7', 2093.00],
  ['C#/Db7', 2217.46], ['D7', 2349.32], ['D#/Eb7', 2489.02], ['E7', 2637.02],
  ['F7', 2793.83], ['F#/Gb7', 2959.96], ['G7', 3135.96], ['G#/Ab7', 3322.44],
  ['A7', 3520.00], ['A#/Bb7', 3729.31], ['B7', 3951.07], ['C8', 4186.01]
];

$(document).ready(function(){
  console.log("Document ready from tuner.js");
  indicator = [
    {number: 1, element: document.getElementById('indicator1')},
    {number: 2, element: document.getElementById('indicator2')},
    {number: 3, element: document.getElementById('indicator3')},
    {number: 4, element: document.getElementById('indicator4')},
    {number: 5, element: document.getElementById('indicator5')},
    {number: 6, element: document.getElementById('indicator6')},
    {number: 7, element: document.getElementById('indicator7')},
    {number: 8, element: document.getElementById('indicator8')},
    {number: 9, element: document.getElementById('indicator9')}
  ];
});

function stopUpdatingPitch(){
  tuner.stopUpdatingPitch();
  clearInterval(onOffTimer);
}

function startUpdatingPitch(){
  tuner.add(voice);
  voice.play();
  tuner.setVolume(0);

  tuner.updatePitch() // The tuner is now calculating the pitch and note name of its input 60 times per second. These values are stored in tuner.pitch and tuner.noteName.

  //var logPitch = function(){
  //  console.log(tuner.pitch, tuner.noteName)
  //  requestAnimationFrame(logPitch)
  //};
  //logPitch();
  onOffTimer = setInterval(function(){
    console.log("Freq: " + tuner.pitch + " Note: " + tuner.noteName);
    var noteObject = findClosestPitchReturnPercentageOut(tuner.pitch);
    if(noteObject != undefined){
      lightController(noteObject);
    }
  }, 100);
};

function tunerOnOffClicked(){
  console.log("Tuner button pressed");
  if(tunerOn == false){
    tunerOn = true;
    startUpdatingPitch();
    document.getElementById('tunerOnOff').innerHTML = "Off";
  } else{
    tunerOn = false;
    stopUpdatingPitch();
    voice.stop();
    document.getElementById('tunerOnOff').innerHTML = "On";
  }
}

function findClosestPitchReturnPercentageOut(frequency){
  for(var i = 1; i < pitchesRef.length; i++){
    if(frequency >= pitchesRef[i - 1][1] && frequency <= pitchesRef[i][1]){
      var midPoint = ((pitchesRef[i][1] - pitchesRef[i - 1][1]) / 2) + pitchesRef[i - 1][1];
      if(frequency <= midPoint){
        var perc = (((frequency - pitchesRef[i - 1][1]) / (midPoint - pitchesRef[i - 1][1])) * 100); //0 is in, 100 is out
        console.log("Percent below midpoint: " + perc);
        return {
          note: pitchesRef[i - 1][0],
          percent: perc,
          position: "below"
        };
      } else if (frequency > midPoint){
        var perc = ((frequency - pitchesRef[i][1]) / (midPoint - pitchesRef[i][1])) * 100;
        console.log("Percent above midpoint: " + perc);
        return {
          note: pitchesRef[i][0],
          percent: perc,
          position: "above"
        };
      }
    }
  }
}

function lightController(noteObject){
  var noteName = noteObject.note;
  var percent = noteObject.percent;
  var position = noteObject.position;
  document.getElementById('noteDisplay').innerHTML = noteName;
  if(position == 'below'){
    if(percent <= 15){
      lightUp(1);
    } else if(percent <= 25){
      lightUp(2);
    } else if(percent <= 35){
      lightUp(3);
    } else if(percent <= 45){
      lightUp(4);
    } else if(percent <= 65){
      lightUp(4, 5);
    } else if(percent <= 100){
      lightUp(5);
    }
  } else if(position == 'above'){
    if(percent <= 15){
      lightUp(5);
    } else if(percent <= 25){
      lightUp(5, 4);
    } else if(percent <= 35){
      lightUp(4);
    } else if(percent <= 45){
      lightUp(3);
    } else if(percent <= 65){
      lightUp(2);
    } else if(percent <= 100){
      lightUp(1);
    }
  }
}

function lightUp(){
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  for(var i = 0; i < indicator.length; i++){
    for(var j = 0; j < args.length; j++){
      if(args[j] == indicator[i].number){
        console.log("Setting green: " + indicator[i].element);
        indicator[i].element.style.backgroundColor = 'green';
      } else{
        indicator[i].element.style.backgroundColor = 'grey';
      }
    }
  }



}
