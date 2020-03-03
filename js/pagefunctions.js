var isMouseInMenu = false;
var isMouseInHeader = false;

var color1 = "#3C3744";
var color2 = "#090C9B";
var color3 = "#3D52D5";
var color4 = "#B4C5E4";
var color5 = "#FBFFF1";

// flash control
var metronomeOn = false;
var flasherInterval;
var metroPlay = false;
var flasherOn = false;


$(document).ready(function(){
  console.log("Document ready from pagefunction.js");
  var headingDiv = document.getElementById('headingDiv');
  var menuDiv = document.getElementById('menu');

  headingDiv.addEventListener('mouseover', mouseOverHeader, false);
  menu.addEventListener('mouseover', function(){isMouseInMenu = true;});

  headingDiv.addEventListener('mouseleave',function(){isMouseInHeader = false;});
  menu.addEventListener('mouseleave', function(){isMouseInMenu = false;});

  setUpSlider();
})

function mouseOverHeader(){
  console.log("Mouse over header");
  isMouseInHeader = true;
  $("#menu").slideDown(100);
  $("#blackout").slideDown(500);
  document.addEventListener('mousemove', menuController, false);
}

function menuController(){
  console.log("Mouse moved in document");
  console.log("isMouseInMenu: " + isMouseInMenu + " isMouseInHeader" + isMouseInHeader);
  if(isMouseInMenu == false && isMouseInHeader == false){
    console.log("Hiding menu");
    $('#menu').slideUp(100);
    $('#blackout').slideUp(200);
    document.removeEventListener('mousemove', menuController, false);
  }
}

function setUpSlider(){
  var slider = document.getElementById("metronomeSlider");
  var output = document.getElementById("metronomeDisplay");

  output.innerHTML = slider.value;
  slider.oninput = function() {
    output.innerHTML = this.value;
    clearInterval(flasherInterval);
    if(metronomeOn){
      flasher();
    }
  }
}

function metronomeButtonClicked(){
  var button = document.getElementById('metronomeButton');
  if(button.innerHTML == "Start"){
    console.log("Entered if START");
    document.getElementById('metronomeButton').style.backgroundColor = color2;
    button.innerHTML = "Stop";
    flasher();
    metronomeOn = true;
  } else {
    document.getElementById('metronomeButton').style.backgroundColor = color3;
    button.innerHTML = "Start";
    metronomeOn = false;
    clearInterval(flasherInterval);
    flasherOn = false;
    metroPlay = false;
    var flasherDiv = document.getElementById('flasher');
    if(flasherDiv.classList.contains('backgroundRed')){
      console.log("Stopped on red.");
      flasherDiv.classList.remove('backgroundRed');
    }
  }
}

function flasher(){
  var $div2blink = $("#flasher");
  var tempo = document.getElementById('metronomeDisplay').innerHTML;
  tempo = (60000 / tempo) * 0.5;
  console.log("Tempo: " + tempo);
  flasherInterval = setInterval(function(){
    if(metroPlay == false){
      var audio = new Audio('assets/audio/click.mp3');
      audio.play();
      metroPlay = true;
    } else {
      metroPlay = false;
    }
    $div2blink.toggleClass("backgroundRed");
  },tempo)
}

function sendMessage(){

}
