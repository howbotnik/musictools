var canvas;
var leftCanvas;
var rightCanvas;

var numberOfWhiteKeysToDisplay = 52;
var numberOfBlackKeysToDisplay = 36;
var whiteKeyList = [];
var blackKeyList = [];
var whiteKeysInView = [];
var blackKeysInView = [];
var whiteNoteLetterAndMidiList = [['A', 21], ['B', 23], ['C', 24], ['D', 26],
['E', 28], ['F', 29], ['G', 31], ['A', 33], ['B', 35], ['C', 36], ['D', 38],
['E', 40], ['F', 41], ['G', 43], ['A', 45], ['B', 47], ['C', 48], ['D', 50],
['E', 52], ['F', 53], ['G', 55], ['A', 57], ['B', 59], ['C', 60], ['D', 62],
['E', 64], ['F', 65], ['G', 67], ['A', 69], ['B', 71], ['C', 72], ['D', 74],
['E', 76], ['F', 77], ['G', 79], ['A', 81], ['B', 83], ['C', 84], ['D', 86],
['E', 88], ['F', 89], ['G', 91], ['A', 93], ['B', 95], ['C', 96], ['D', 98],
['E', 100], ['F', 101], ['G', 103], ['A', 105], ['B', 107], ['C', 108]];

var blackNoteLetterAndMidiList = [['A#', 22], ['C#', 25], ['D#', 27], ['F#', 30],
['G#', 32], ['A#', 34], ['C#', 37], ['D#', 39], ['F#', 42], ['G#', 44], ['A#', 46],
['C#', 49], ['D#', 51], ['F#', 54], ['G#', 56], ['A#', 58], ['C#', 61], ['D#', 63],
['F#', 66], ['G#', 68], ['A#', 70], ['C#', 73], ['D#', 75], ['F#', 78], ['G#', 80],
['A#', 82], ['C#', 85], ['D#', 87], ['F#', 90], ['G#', 92], ['A#', 94], ['C#', 97],
['D#', 99], ['F#', 102], ['G#', 104], ['A#', 106]];

var isMouseInCanvas = false;

// build white keys
for(var i = 0; i < numberOfWhiteKeysToDisplay; i++){
  var k = new Key('white', whiteNoteLetterAndMidiList[i][0], whiteNoteLetterAndMidiList[i][1], 'key' + i);
  whiteKeyList.push(k);
  whiteKeysInView.push(k);
}
// build black addKeys
for(var i = 0; i < numberOfBlackKeysToDisplay; i++){
  var bk = new BlackKey('black', blackNoteLetterAndMidiList[i][0], blackNoteLetterAndMidiList[i][1], 'blackKey' + i);
  blackKeyList.push(bk);
  blackKeysInView.push(bk);
}

$(document).ready(function(){
  console.log("Page is ready.");
  document.getElementById('canvasContainer').height = Math.round(window.innerHeight / 4);

  canvas = document.getElementById('canvas');
  $("#canvas").fadeIn(400);

  leftCanvas = document.getElementById('leftCanvas');
  $("#leftCanvas").fadeIn(2000);

  rightCanvas = document.getElementById('rightCanvas');
  $("#rightCanvas").fadeIn(2000);

  setCanvasSize();
  addKeys(whiteKeyList);
  window.addEventListener('resize', setSize, false);
  function setSize(){
    console.log("Window resizing.");
    clearCanvas();
    setCanvasSize();
    addKeys(whiteKeysInView);
  }
  // set the listeners for the left and right canvas
  leftCanvas.addEventListener('mousedown', function(){leftListener()}, false);
  rightCanvas.addEventListener('mousedown', function(){rightListener()}, false);
  $(canvas).mouseenter(function(){isMouseInCanvas = true;});
  $(canvas).mouseleave(function(){isMouseInCanvas = false;});

  enableKeyListener();
});

function setCanvasSize(){
  canvas.width = document.getElementById('canvasContainer').offsetWidth - 50;
  canvas.height = Math.round(window.innerHeight / 4);
  //set the left and right canvas heights
  leftCanvas.height = canvas.height;
  rightCanvas.height = canvas.height;
}

function addKeys(listOfKeys){
  var cwidth = canvas.width;
  var xpos = 0;
  var blackNoteIndex = 0;
  for (var k in listOfKeys){
    listOfKeys[k].constructKey(xpos, 0, cwidth / listOfKeys.length, canvas.height);
    listOfKeys[k].constructText(xpos, 0, listOfKeys.length);
    while(listOfKeys[k].xRange.length > 0){
      listOfKeys[k].xRange.pop();
    }
    listOfKeys[k].xRange.push(xpos);
    xpos += cwidth / listOfKeys.length;
    listOfKeys[k].xRange.push(xpos);
    //console.log("Key " + listOfKeys[k].title + " xRange: " + listOfKeys[k].xRange[0] + ", " + listOfKeys[k].xRange[1]);
    // creating the black keys
    if(listOfKeys[k].hasBlackNoteToRight()){
      var startPoint = xpos - ((cwidth / listOfKeys.length) / 4);
      var width = (cwidth / listOfKeys.length) / 2;
      if(blackKeysInView[blackNoteIndex] != undefined){
        while(blackKeysInView[blackNoteIndex].xRange.length > 0){
          blackKeysInView[blackNoteIndex].xRange.pop();
        }
        blackKeysInView[blackNoteIndex].xRange.push(startPoint);
        blackKeysInView[blackNoteIndex].xRange.push(width);
        console.log("Created black note params: " + startPoint + " and " + width);
        blackNoteIndex++;
      }
    } else {
      console.log("Black key list returned undefined");
    }
    console.log("Black note size: " + blackKeysInView.length);
  }
  // remove black key if at end
  //if(listOfKeys[listOfKeys.length - 1].hasBlackNoteToRight()){
  //  blackKeysInView.pop();
  //}

  // separate for loop to draw the black notes on top
  for(var bk in blackKeysInView){
    blackKeysInView[bk].constructKey(blackKeysInView[bk].xRange[0], 0, blackKeysInView[bk].xRange[1], canvas.height * 0.6);
  }
}

function leftListener(){
  console.log("Left canvas clicked.");
  canvas.onmousemove = function(e){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    console.log("x: " + x);
    for(var i = 0; i < whiteKeysInView.length; i++){
      var currentKey = whiteKeysInView[i];
      if(x >= currentKey.xRange[0]){
        currentKey.colour = "blue";
      } else {
        currentKey.colour = "white";
      }
    }
    for(var i = 0; i < blackKeysInView.length; i++){
      var currentKey = blackKeysInView[i];
      if(x >= currentKey.xRange[0]){
        currentKey.colour = "blue";
      } else {
        currentKey.colour = "black";
      }
    }
    clearCanvas();
    addKeys(whiteKeysInView);
  };
  document.addEventListener('mouseup', mouseUpOnDocument, false);
}

function rightListener(){
  console.log("Right canvas clicked.");
  canvas.onmousemove = function(e){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    console.log("x: " + x);

    for(var i = 0; i < whiteKeysInView.length; i++){
      var currentKey = whiteKeysInView[i];
      if(x <= currentKey.xRange[1]){
        currentKey.colour = "blue";
      } else {
        currentKey.colour = "white";
      }
    }
    for(var i = 0; i < blackKeysInView.length; i++){
      var currentKey = blackKeysInView[i];
      if(x <= currentKey.xRange[0] + currentKey.xRange[1]){
        currentKey.colour = "blue";
      } else {
        currentKey.colour = "black";
      }
    }
    clearCanvas();
    setCanvasSize();
    addKeys(whiteKeysInView);
  };
  document.addEventListener('mouseup', mouseUpOnDocument, false);
}

function clearCanvas(){
  console.log("Clearing canvas");
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function colourAllWhite(listOfKeys){
  for(var i = 0; i < listOfKeys.length; i++){
    var currentKey = listOfKeys[i];
    currentKey.colour = "white";
  }
  for(var i = 0; i < blackKeysInView.length; i++){
    var currentKey = blackKeysInView[i];
    console.log("Setting keys black");
    currentKey.colour = "black";
  }
  clearCanvas();
  addKeys(whiteKeysInView);
}

function mouseUpOnDocument(){
  console.log("Entering mouseUpOnDocument()");
  document.removeEventListener('mouseup', mouseUpOnDocument, false);
  canvas.onmousemove = null;
  if(isMouseInCanvas == false){
    console.log("Mouse out of canvas");
    colourAllWhite(whiteKeysInView);
  }else{
    for(var i = whiteKeysInView.length - 1; i >= 0; i--){
      if(whiteKeysInView[i].colour === "blue"){
        whiteKeysInView.splice(i, 1);
      }
    }
    for(var i = blackKeysInView.length - 1; i >= 0; i--){
      if(blackKeysInView[i].colour === "blue"){
        blackKeysInView.splice(i, 1);
      }
    }

    if(blackKeysInView[0].midiCode < whiteKeysInView[0].midiCode){
      blackKeysInView.shift();
    }

    //var index = blackKeysInView.length;
    //while(index--){
    //  if(blackKeysInView[index].colour === "blue"){
    //    blackKeysInView.splice(i, 1);
    //  }
    //}
    colourAllWhite(whiteKeysInView);
    clearCanvas();
    setCanvasSize();
    addKeys(whiteKeysInView);
  }
}

function enableKeyListener(){
  window.addEventListener('keyOn', function (e) {
    console.log('KeyOn', e.detail);
    for(var i = 0; i < whiteKeysInView.length; i++){
      if(whiteKeysInView[i].midiCode == e.detail){
        whiteKeysInView[i].colour = "blue";
      }
    }
    for(var i = 0; i < blackKeysInView.length; i++){
      if(blackKeysInView[i].midiCode == e.detail){
        blackKeysInView[i].colour = "blue";
      }
    }
    clearCanvas();
    addKeys(whiteKeysInView);
  });
  window.addEventListener('keyOff', function (e) {
    console.log('KeyOff', e.detail);
    for(var i = 0; i < whiteKeysInView.length; i++){
      if(whiteKeysInView[i].midiCode == e.detail){
        whiteKeysInView[i].colour = "white";
      }
    }
    for(var i = 0; i < blackKeysInView.length; i++){
      if(blackKeysInView[i].midiCode == e.detail){
        blackKeysInView[i].colour = "black";
      }
    }
    clearCanvas();
    addKeys(whiteKeysInView);
  });
}
