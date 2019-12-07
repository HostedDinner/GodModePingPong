
var width = 800;
var height = 600;

var PaddleLength = 100;
var PaddleThickness = 10;
var PaddleWallSpace = 40;

var BallThickness = 10;

var Speed = 16;

var GodMode = true; //GodMode: Pc will control Paddle Left! (God can't loose!)

//--------------------------------
//--------------------------------
document.addEventListener("DOMContentLoaded", initGame, false);

var canvas;
var started = false;
var paused = false;

var LeftP = {top: ((height/2)-(PaddleLength/2)), speed: 0};
var RightP = {top: ((height/2)-(PaddleLength/2)), speed: 0};
var ball = {x: width/2, y: height/2, hv: Speed, vv: 0};

var key=[0,0,0,0]; // up, down, w, s (Player Right, Player Left)

var PctoPos = ((height/2)-(PaddleLength/2)); //where should the paddle of pc go next?

function update(){
	if(!paused){
	
		var change = false;
	
		//Start/Stop Pc Movement (Left Paddle)
		MakePcMove();
	
		//Player Right Up:
		if(key[0] && !key[1]){
			RightP.speed -= 0.4;
			RightP.top += RightP.speed;
			change = true;
		}
		//Player Right Down:
		else if(key[1] && !key[0]){
			RightP.speed += 0.4;
			RightP.top += RightP.speed;
			change = true;
		}
		//Player Right Both or no
		else{
			RightP.speed = 0;
		}
		
		if(RightP.top <= 0){
			RightP.top = 0;
			RightP.speed = 0;
		}
		if(RightP.top >= height-PaddleLength){
			RightP.top = height-PaddleLength;
			RightP.speed = 0;
		}
		
		
		//Player Left Up:
		if(key[2] && !key[3]){
			LeftP.speed -= 0.4;
			LeftP.top += LeftP.speed;
			change = true;
		}
		//Player Left Down:
		else if(key[3] && !key[2]){
			LeftP.speed += 0.4;
			LeftP.top += LeftP.speed;
			change = true;
		}
		//Player Left Both or no
		else{
			LeftP.speed = 0;
		}
		
		if(LeftP.top <= 0){
			LeftP.top = 0;
			LeftP.speed = 0;
		}
		
		if(LeftP.top >= height-PaddleLength){
			LeftP.top = height-PaddleLength;
			LeftP.speed = 0;
		}
		
		
		//BallMovement
		if(started == true){
			ball.x += ball.hv;
			ball.y += ball.vv;
			change = true;
		}
		
		//Out!
		if(ball.x >= (width-PaddleWallSpace)){
			//Player 1 scored
			var tmp = document.getElementById('scp1').innerHTML;
			tmp++;
			document.getElementById('scp1').innerHTML = tmp;
			reset(1);
			CenterPcPaddle();
		}
		
		else if(ball.x <= (0+PaddleWallSpace)){
			//Player 2 scored
			var tmp = document.getElementById('scp2').innerHTML;
			tmp++;
			document.getElementById('scp2').innerHTML = tmp;
			reset(0);
			CenterPcPaddle();
		}
		
		//left bouncer
		else if(ball.x <= PaddleWallSpace+PaddleThickness+(BallThickness/2)){
			if(((ball.y+(BallThickness/2)) >= LeftP.top) && ((ball.y-(BallThickness/2)) <= LeftP.top + PaddleLength)){
				ball.hv = Speed;
				var relpos = (ball.y - LeftP.top)/PaddleLength;
				ball.vv += ((relpos*8)-4);
				change = true;
				CenterPcPaddle();
			}
			
		}
	
		//right bouncer
		else if(ball.x >= width-PaddleWallSpace-PaddleThickness-(BallThickness/2)){
			if(((ball.y+(BallThickness/2)) >= RightP.top) && ((ball.y-(BallThickness/2)) <= RightP.top + PaddleLength)){
				ball.hv = -Speed;
				var relpos = (ball.y - RightP.top)/PaddleLength;
				ball.vv += ((relpos*8)-4);
				change = true;
				CalculatePcMove();
			}
		}
		
		//Top/Bottom Bouncer
		if((ball.y <= 0 + (BallThickness/2)) || (ball.y >= height - (BallThickness/2))){
			ball.vv *= -1;
			change = true;
		}
		
		if(change){
			drawCanvas();
		}
	}
}


function MakePcMove(){
	if(GodMode){
		if(PctoPos > LeftP.top){
			if(key[2] && !key[3]){LeftP.speed = 0;}//also Wechsel
			key[2]=0;
			key[3]=1;
		}else if(PctoPos < LeftP.top){
			if(!key[2] && key[3]){LeftP.speed = 0;}//also Wechsel
			key[2]=1;
			key[3]=0;
		}else{
			StopPcMove();
		}
	}
}

function StopPcMove(){
	if(GodMode){
		key[2]=0;
		key[3]=0;
		LeftP.speed = 0;
	}
}

function CenterPcPaddle(){
	PctoPos = ((height/2)-(PaddleLength/2));
}

function CalculatePcMove(){
	var x = PaddleWallSpace+PaddleThickness+(BallThickness/2); //constant
	var y = ball.y + ((ball.x - x)/Speed)*ball.vv; //berechnung lmit Steigung blabla
	
	var lowest = 0 + (BallThickness/2);
	var highest = height - (BallThickness/2);
	
	//zu viel/zu wenig (top/bottom bouncing simuluieren)
	while((y < lowest ) || (y > highest)){
		if(y < lowest){
			y = lowest+(lowest-y);
		}else if(y > highest){
			y = highest-(y-highest);
		}
	}
	
	
	
	//PctoPos = y-(PaddleLength/2); //Mitte von Paddle
	PctoPos = y - (Math.random()*(PaddleLength-1))+1; //Random auf Paddle //+1 um immer im Panel zu sein
}

function reset(side){
	ball.x = width/2;
	ball.y = height/2;
	
	setSpeed(parseInt(document.getElementById("speedSlider").value));
	document.getElementById('speedSlider').disabled = false;
	
	if(side > 0){
		ball.hv = Speed;
	}else{
		ball.hv = -Speed;
	}
	
	ball.vv = 0;
	started = false;
	paused = false;
	
	PctoPos = ((height/2)-(PaddleLength/2));
	key=[0,0,0,0];
	
	LeftP.top = ((height/2)-(PaddleLength/2));
	LeftP.speed =0;
	RightP.top = ((height/2)-(PaddleLength/2));
	RightP.speed = 0;
	
	drawCanvas();
}


function changeKey(which, to){
	switch (which){
		case 38: key[0]=to; break; // up
		case 40: key[1]=to; break; // down
		case 87: if(!GodMode){key[2]=to;} break; // w (in GodMode computer plays left Player)
		case 83: if(!GodMode){key[3]=to;} break; // s (in GodMode computer plays left Player)
		case 16: case 17: if((to == 1) && (!started) && (!paused)){startGame();}; break;// Strg oder Shift  - Start
		case 19: if(to == 1){pauseGame();}; break;
	}
}

function drawCanvas(){
	canvas.clearRect(0,0,width,height);
	
	//left Paddle
	canvas.beginPath();
	canvas.moveTo(PaddleWallSpace, LeftP.top);
	canvas.lineTo(PaddleWallSpace, LeftP.top+PaddleLength);
	canvas.stroke();
	canvas.closePath();
		
	//Right Paddle
	canvas.beginPath();
	canvas.moveTo(width-PaddleWallSpace, RightP.top);
	canvas.lineTo(width-PaddleWallSpace, RightP.top+PaddleLength);
	canvas.stroke();
	canvas.closePath();
		
	//Ball
	canvas.fillRect(ball.x-(BallThickness/2), ball.y-(BallThickness/2), BallThickness, BallThickness);
}

function initGame(){
	//bind controls
	document.getElementById("startButton").addEventListener("click", startGame, false);
	document.getElementById("resetButton").addEventListener("click", resetGame, false);
	document.getElementById("speedSlider").addEventListener("change", function(){setSpeed(parseInt(document.getElementById("speedSlider").value));}, false);
	
	//bind keys
	document.addEventListener("keydown", function(e){changeKey((e||window.event).keyCode, 1); e.preventDefault();}, false);
	document.addEventListener("keyup", function(e){changeKey((e||window.event).keyCode, 0); e.preventDefault();}, false);
	
	
	var field = document.getElementById('playfield');
	if (!field.getContext){
	  alert('An error occured creating a Canvas 2D context. This may be because you are using an old browser...');
	  return;
	}
	
	canvas = field.getContext('2d');
	
	
	canvas.lineWidth = PaddleThickness;
	//canvas.lineCap = 'round';
	
	canvas.font = "30px sans-serif";
	
	reset(0);
	
	drawCanvas();
	setInterval(update, 20);
}

function startGame(){
	started = true;
	document.getElementById('speedSlider').disabled = true;
}

function pauseGame(){
	if(!paused){
		paused = true;
		canvas.fillText('Pause', 10, 30);
	}else{
		paused = false;
		drawCanvas();
	}
}

function resetGame(){
	reset(0);
	document.getElementById('scp1').innerHTML = '0';
	document.getElementById('scp2').innerHTML = '0';
	drawCanvas();
}

function setSpeed(newSpeed){
	Speed = newSpeed;
	if(ball.hv < 0){
		ball.hv = -newSpeed;
		if(started){
			CalculatePcMove();
		}
	}else{
		ball.hv = newSpeed;
	}
}

