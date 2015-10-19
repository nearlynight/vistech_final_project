var canvas = null;
var context = null;
var R1 = 75;
var R2 = 200;
var STARTANGLE = 45;
var ENDANGLE = 180;
var AMOUNTBARS = 5;
var ANGLEBETWEENBARS = 5;


function start() {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	context.fillStyle = "#00AAAA";
	drawBars();

}

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function Polygon(p1, p2, p3, p4) {
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.p4 = p4;
	this.draw = function() {
		context.beginPath();
		context.moveTo(this.p1.x, this.p1.y);
		context.lineTo(this.p2.x, this.p2.y);
		context.lineTo(this.p3.x, this.p3.y);
		context.lineTo(this.p4.x, this.p4.y);
		context.closePath();
		context.stroke();
		context.fill();
	};
}

function createPolygon(angle1, angle2, value) {
	var p1 = {};
	var p2 = {};
	var p3 = {};
	var p4 = {};
	angle1 = toRadians(angle1);
	angle2 = toRadians(angle2);
	var valueRadius = (R2 - R1) * value + R1;

	console.log(Math.sin(angle2));
	console.log(Math.sin(toRadians(90) - angle2));

	p1.x = canvas.width/2 - Math.sin(toRadians(90) - angle1) * valueRadius;
	p1.y = canvas.height/2 - Math.sin(angle1) * valueRadius;
	p2.x = canvas.width/2 - Math.sin(toRadians(90) - angle2) * valueRadius;
	p2.y = canvas.height/2 - Math.sin(angle2) * valueRadius;
	p3.x = canvas.width/2 - Math.sin(toRadians(90) - angle2) * R1;
	p3.y = canvas.height/2 - Math.sin(angle2) * R1;
	p4.x = canvas.width/2 - Math.sin(toRadians(90) - angle1) * R1;
	p4.y = canvas.height/2 - Math.sin(angle1) * R1;

	var poly = new Polygon(p1, p2, p3, p4);
	return poly;
}

function drawBars(subset) {

	var v = [.6, .4, .8, .5, .7];

	var barwidth = (ENDANGLE - (2 * STARTANGLE) - ((AMOUNTBARS -1) * ANGLEBETWEENBARS)) / AMOUNTBARS;
	console.log(barwidth);

	for (var i = 0; i < v.length; ++i) {
		var poly = createPolygon(STARTANGLE + ANGLEBETWEENBARS * i + barwidth * i, 
									STARTANGLE + ANGLEBETWEENBARS * i + barwidth * (i+1), 
									v[i]);
		poly.draw();
	}
}


