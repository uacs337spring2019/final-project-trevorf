/* Author: Trevor Freudig
	 File: final_project_js.js
	 CSC 337 Final Project

	 Purpose: This program contains the javascript code for 
	 final_project_js.html. */

"use strict";
(function() {
	let canvas, ctx;
	let status;

	const user = {
		x: null,
		y: null,
		width: 10,
		height: 90,

		update: function() {
			ctx.clearRect(user.x, user.y, user.width, user.height);
			if (status[38]) {
				this.y -= 10;
			}

			if (status[40]) {
				this.y += 10;
			}
		},

		draw: function() {
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};

	const ai = {
		x: null,
		y: null,
		width: 10,
		height: 90,

		update: function() {
			ctx.clearRect(this.x, this.y, this.width, this.height);
			ctx.clearRect(this.x + 1, this.y + 1, this.width, this.height);
			ctx.clearRect(this.x - 1, this.y - 1, this.width, this.height);
			let move = ball.y - (this.height - ball.radius)*0.5;
			this.y += (move - this.y)*0.06;
		},

		draw: function() {
			ctx.fillRect(this.x, this.y, this.width, this.height);
		} 
	};

	const ball = {
		x: null,
		y: null,
		velocity: null,
		speed: 10,
		radius: 15,


		update: function() {
			ctx.clearRect(ball.x, ball.y, 20, 20);
			ctx.clearRect(ball.x + 1, ball.y + 1, ball.radius, ball.radius);
			ctx.clearRect(ball.x - 1, ball.y -1, ball.radius, ball.radius);
			ctx.clearRect(ball.x + 2, ball.y + 2, ball.radius, ball.radius);
			ctx.clearRect(ball.x - 2, ball.y - 2, ball.radius, ball.radius);

			this.x += this.velocity.x;
			this.y += this.velocity.y;

			if (this.y < 0 || this.y + this.radius > 350) {
				this.velocity.y *= -1; 
			}

			let helper = function(x1, y1, w1, h1, x2, y2, w2, h2) {
				return x1 < x2+w2 && y1 < y2+h2 && x2 < x1+w1 && y2 < y1+h1;
			}; 

			if (this.velocity.x < 0) {
				var paddle = user;
			} else {
				var paddle = ai;
			}

			if (helper(paddle.x, paddle.y, paddle.width, paddle.height, this.x, 
				this.y, this.radius, this.radius)) {
				var num = (this.y + this.radius - paddle.y)/(paddle.height + this.radius);
				let angle = 0.25 * Math.PI * (2*num - 1);

				if (paddle === user) {
					var constant = 1;
				} else {
					var constant = -1;
				}

				this.velocity.x = constant * this.speed * Math.cos(angle);
				this.velocity.y = this.speed * Math.sin(angle);
			}

			let resetBall = function(paddle) {
				ball.x = (550 - ball.radius)/2;
				ball.y = (350 - ball.radius)/2;
				ball.velocity = {
				x: (paddle === user ? 1 : -1) * ball.speed,
				y: 0
				}
			}

			/* Reset ball/game and update score */
			if (this.x + this.radius < 0) {
				addAiScore();
				resetBall();
			} else if (this.x > 550) {
				addPlayer1Score();
				resetBall();
			}
		},

		draw: function() {
			ctx.fillRect(this.x, this.y, this.radius, this.radius);
		}
	};

/* Function to initialize start button when page loads. */
window.onload = function() {
	document.getElementById("startButton").onclick = main;
	document.getElementById("quitButton").onclick = reset;
}

/* Function to make calls to other functions controlling the game. */
function main() {
	canvas = document.getElementById("canvas");	
	ctx = canvas.getContext("2d");

	handleKeyPresses();
	setup();

	let loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}

/* Initialize all canvas properties (paddles, ball, etc) */
function setup() {
	var element = document.createElement("player1Score");
	element.setAttribute("id", "player1Score");
    element.appendChild(document.createTextNode(0));
    document.getElementById('player1').appendChild(element);

    var element = document.createElement("aiScore");
    element.setAttribute("id", "aiScore");
    element.appendChild(document.createTextNode(0));
    document.getElementById('ai').appendChild(element);

	user.x = user.width;
	user.y = (350 - user.height)/2;

	ai.x = 550 - (user.width + ai.width);
	ai.y = (350 - ai.height)/2;

	ball.x = (550 - ball.radius)/2;
	ball.y = (350 - ball.radius)/2;
	ball.velocity = {
		x: ball.speed,
		y: 0
	}
}

/* Update function used to update positions of paddles and ball. They each
have their separate parameters and values so their functions are defined in their 
corresponding constant declarations. */
function update() {
	ball.update();
	user.update();
	ai.update();
}

/* When Player 1 scores a point this function increments his/her score */
function addPlayer1Score() {
	var element = document.getElementById("player1Score");
	var num = parseInt(element.textContent);

	while (element.firstChild) {
  		element.removeChild(element.firstChild);
	}

    element.appendChild(document.createTextNode(num + 1));
    document.getElementById('player1').appendChild(element);

    if (num + 1 == 5) {
		getUserInfo();
	}
}

/* When the AI scores this function increments its score by 1 */
function addAiScore() {
	var element = document.getElementById("aiScore");
	var num = parseInt(element.textContent);

	while (element.firstChild) {
  		element.removeChild(element.firstChild);
	}

    element.appendChild(document.createTextNode(num + 1));
    document.getElementById('ai').appendChild(element);

    if (num + 1 == 5) {
		alert("AI WINS!!");
		location.reload();
	}
}

/* This function draws to the canvas. As like the update() function, the user, ai,
and ball each have different values and functions so they are created in their
corresponding constant decalartions and called here. */
function draw() { 
	ball.draw();
	user.draw();
	ai.draw();

	let w = 4;
	let x = (550 - w)*0.5;
	let y = 0;
	let step = 350/25;
	while (y < 350) {
		ctx.fillRect(x, y+step*.25, w, step*.5);
		y += step;
	}
}

/* This function contains the event listeners for the up and down key
presses made by the user */
function handleKeyPresses() {
	canvas = document.getElementById("canvas");	

	status = {};
	document.addEventListener("keydown", function(e) {
		status[e.keyCode] = true;
	}, false);

	document.addEventListener("keyup", function(e) {
		status[e.keyCode] = false;
	}, false);
}

function getUserInfo() {
	let person = prompt("You won!! Please enter your name:", "WINNER");

	if (person != null) {
      document.getElementById("data").innerHTML = person + ": " + 1 + "win";
	  submit(person);
	}
}

// sends the values the user input into the page as post parameters
// to a service and logs the response. 
function submit(person) {
	var url = "http://localhost:3000";
	fetch(url)
		.then(checkStatus)
		.then(function(responseText) {
			let json = JSON.parse(responseText);
			let name = json["name"]; // same as json.city
			document.getElementById("leaderBoard").innerHTML = name;
		})
		.catch(function(error) {
			console.log(error);
		});
}

// returns the response text if the status is in the 200s
// otherwise rejects the promise with a message including the status
function checkStatus(response) {  
    if (response.status >= 200 && response.status < 300) {  
        return response.text();
    } else if (response.status == 404) {
    	// sends back a different error when we have a 404 than when we have
    	// a different error
    	return Promise.reject(new Error("Sorry, we couldn't find that page")); 
    } else {  
        return Promise.reject(new Error(response.status+": "+response.statusText)); 
    } 
}

// Reset webpage
function reset() {
	location.reload();
}

})();