 var c = document.getElementById('canvas').getContext("2d");
var img;

function makeSquare(x, y, length, speed) {
  return {
    x: x,
    y: y,
    w: length,
    h:length+5,
    s: speed,
    draw: function() {
      c.fillRect(this.x, this.y, this.w, this.h);

    }
  };
}
function makeenemy(x,y,radius,speedx,speedy,strength){
  return{
    x:x,
    y:y,
    r:radius,
    sx:speedx,
    sy:speedy,
    num:strength,
    num2:strength,
    
    draw: function(){
      c.beginPath();
      c.arc(this.x,this.y,this.r,0,2*Math.PI,true);
      c.fill();
      c.fillStyle="#FFFFFF";
      c.font = '10px Arial';
      c.fillText(this.num,this.x-6,this.y+3);
    }
  }
}
function makearrayenemy(){
  if (Math.floor(Math.random() * 2)) {
    var enemyX=0;
  }else{
    var enemyX=canvas.width;
  }
  var enemysize=10;
  var enemyY=Math.floor(Math.random() * (3*canvas.height/4));
  var enemyspeedx=1;
  var enemyspeedy=1;
  var strength=Math.floor(Math.random() * 50);
  enemies.push(makeenemy(enemyX,enemyY,enemysize,enemyspeedx,enemyspeedy,strength));
}
function maketank(x,y,w,h,s){
  return{
    x:x,
    y:y,
    w:w,
    h:h,
    s:s,
    draw:function(){
    c.drawImage(img,this.x,this.y,this.w,this.h);

  }
  };
}
   

  var tank=maketank(canvas.width/2,canvas.height-30,30,30,10);
  var bullet = makeSquare(0,0, 2, 5);
  var shooting = false;
  var right = false;
  var left = false;
  var space=false;
  var enemies=[];
  var time;
  var timegap=10000;
  var name;
  var score=0;
  var arscore=[];
  document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
 function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = true;
    }
    if (e.keyCode == 32) { // SPACE
         shoot();   
  }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = false;
    }
}
function shoot() {
  if (!shooting) {
    shooting = true;
    bullet.x = tank.x + tank.w/2;
    bullet.y = tank.y + tank.h/2 ;
  }
}

function isWithin(a, b, c) {
  return (a > b && a < c);
}
function isColliding(a, b) {
  var result = false;
  if (isWithin(a.x, (b.x-b.r), (b.x + b.r)) || isWithin(a.x + a.w, (b.x-b.r), (b.x + b.r))) {
    if (isWithin(a.y, b.y-b.r, b.y + b.r) || isWithin(a.y + a.h, b.y-b.r, b.y + b.r)) {
      result = true;
    }
  }
  return result;
}

function draw(){ 
   
  var gameover=false;
  c.clearRect(0,0,canvas.width,canvas.height);
  enemies.forEach(function(enemy){
    enemy.x+=enemy.sx;
    enemy.y+=enemy.sy;
    if (enemy.x<0||enemy.x>(enemy.r+canvas.width)) {
      enemy.sx=-enemy.sx;
    }
    if (enemy.y<0||enemy.y>(enemy.r+canvas.height) ){
      enemy.sy=-enemy.sy;
    }
      c.fillStyle = '#00FF00';
      enemy.draw();
  });
  enemies.forEach(function(enemy, i) {
    if (isColliding(tank,enemy)) {
      gameover = true;
        if (localStorage.length==0) {
          var arr=[];
          arr.push({nam:name,sc:score});
          localStorage.setItem('sta', JSON.stringify(arr));
        }else
        {
          var arr=JSON.parse(localStorage.getItem('sta'));
          arr.push({nam:name,sc:score});
           localStorage.setItem('sta', JSON.stringify(arr));
        }
            
    }
  });
  if(right){
    tank.x+=tank.s;
    console.log("sid");
  }
  if(left){
    tank.x-=tank.s;
    console.log("sid");
  }
  if (tank.x<0) {
    tank.x=0;
  }
  if(tank.x>(canvas.width-tank.w)){
    tank.x=canvas.width-tank.w;
  }
  c.fillStyle="#000000";
  tank.draw();
  if (shooting) {
    bullet.y-=bullet.s;
    enemies.forEach(function(enemy,i){
      if(isColliding(bullet,enemy)){
          if(enemy.num>1){enemy.num--;}
          else{
           
               var enemyX=enemy.x;
               var enemyspeedx=1;
               var enemyY=enemy.y;
               var enemyspeedy=1;
               var enemysize=10;
               if(enemy.num%2==0){
               var strength=enemy.num2/2;}
               else{
                var strength=(enemy.num2-1)/2;
               }
               if(strength!=0){
              enemies.push(makeenemy(enemyX,enemyY,enemysize,enemyspeedx,enemyspeedy,strength));
              enemies.push(makeenemy(enemyX,enemyY,enemysize,-enemyspeedx,enemyspeedy,strength));
              }
            enemies.splice(i,1);
            }
          shooting=false;
          score++;
          bullet.s+=0.25;
      }
    });
  
    if (bullet.y < 0 ) {
      shooting = false;
    } 
    c.fillStyle="#000000";
    bullet.draw();
}
  c.fillStyle = '#000000';
  c.font = '10px Bradley Hand ITC';
  c.textAlign = 'left';
  c.fillText('Score: ' + score, 1, 7);
  if(gameover){
    gameover1();
  }
  else{
     window.requestAnimationFrame(draw);
  }
}

function startgame(){
     time= setInterval(makearrayenemy, timegap);
     draw();
}
function gameover1(){
   c.clearRect(0,0,canvas.width,canvas.height);
   clearInterval(time);
    c.font="30px Bradley Hand ITC";
  c.fillStyle="#000000";
   c.fillText("Game Over!",70,40);
   c.font="20px Bradley Hand ITC"
   c.fillText("Scorboard",100,60);
  
  c.font="15px Bradley Hand ITC";
   arscore=JSON.parse(localStorage.getItem('sta'));
  arscore.sort(function(b,a){return a.sc-b.sc});
  
    x=80;
    dx=12.5;
  for( i=0;i<6;i++){
    c.fillText((i+1)+"."+arscore[i].nam+" : "+arscore[i].sc,10,x);
    x=x+dx;
  }
}
function start(){
  img = new Image();
  img.src="tanks.png";
  img.onload=function()
  {   

  name=document.getElementById("name").value;
   if(name.length>=10||name.length==0){
    alert("Enter some name with less than 10 letter");
   }else{
    document.getElementById("index").style.display="none";
    document.getElementById("canvas").style.display="inline-block";
    startgame();
   }
 }  
}

canvas.focus();