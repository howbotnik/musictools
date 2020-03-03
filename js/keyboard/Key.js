class Key{
  constructor(colour, title, midiCode, id) {
    this.colour = colour;
    this.title = title;
    this.midiCode = midiCode;
    this.id = id;
    this.xRange = [];
  }
  press(){

  }

  constructKey(x, y, width, height){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    if(this.colour === "white"){
      ctx.fillStyle="#FFFFFF";
    } else if (this.colour === "blue"){
      ctx.fillStyle="#3D52D5";
    }
    ctx.fillRect(x,y,width,height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth   = 1;
    ctx.strokeRect(x, y, width, height);
  }

  constructText(x, y, listOfKeysSize){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    var keyWidth = (canvas.width / listOfKeysSize);
    var textSize = "";
    if(keyWidth >= 50){
      textSize = "35px";
    } else if (keyWidth >= 40){
      textSize = "30px";
    } else if (keyWidth >= 30){
      textSize = "20px";
    } else if (keyWidth >= 25){
      textSize = "15px";
    } else {
      textSize = "12px";
    }
    console.log("Using key text size: " + textSize + " because keyWidth is " + keyWidth);
    ctx.font = textSize + " Muli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(this.title, Math.floor((canvas.width / listOfKeysSize)/2) + x, canvas.height - 10);
  }

  hasBlackNoteToRight(){
    var str = this.title;
    if(str == 'C' && this.midiCode == 108){
      return false;
    } else if(str == 'A' || str == 'C' || str == 'D' || str == 'F' || str == 'G'){
      return true;
    } else {
      return false;
    }
  }
}
