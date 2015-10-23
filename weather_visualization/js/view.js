var CANVAS = null;
var CONTEXT = null;
var R1 = 75;
var R2 = 200;
var STARTANGLE = 45;
var ENDANGLE = 180;
var AMOUNTBARS = 5;
var ANGLEBETWEENBARS = 5;
var BARWIDTH = 600;

function initControls() {
	BARWIDTH = CANVAS.width;
	$("#rangeInput").css({
		"width" : BARWIDTH + "px"
	});
	$('.bar').on('input', function () {
		var value = parseInt($("#rangeInput").val(), 10);
		var day = averagevalues[value].datetime;
		$("#dateview").html(day.toDayMonth());
		var dateLeftPosition = (BARWIDTH / (averagevalues.length-1)) * value;
		var top = document.getElementById("rangeInput").offsetTop + document.getElementById("rangeInput").offsetHeight*2;
		$("#dateview").css({
			"left" : dateLeftPosition + "px",
			"top" : top + "px",
			"display" : "block"
		});

		//var val1 = parseInt($("#rangeInput").val(), 10);
	});
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
		CONTEXT.beginPath();
		CONTEXT.moveTo(this.p1.x, this.p1.y);
		CONTEXT.lineTo(this.p2.x, this.p2.y);
		CONTEXT.lineTo(this.p3.x, this.p3.y);
		CONTEXT.lineTo(this.p4.x, this.p4.y);
		CONTEXT.closePath();
		CONTEXT.stroke();
		CONTEXT.fill();
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

	p1.x = CANVAS.width/2 - Math.sin(toRadians(90) - angle1) * valueRadius;
	p1.y = CANVAS.height/2 - Math.sin(angle1) * valueRadius;
	p2.x = CANVAS.width/2 - Math.sin(toRadians(90) - angle2) * valueRadius;
	p2.y = CANVAS.height/2 - Math.sin(angle2) * valueRadius;
	p3.x = CANVAS.width/2 - Math.sin(toRadians(90) - angle2) * R1;
	p3.y = CANVAS.height/2 - Math.sin(angle2) * R1;
	p4.x = CANVAS.width/2 - Math.sin(toRadians(90) - angle1) * R1;
	p4.y = CANVAS.height/2 - Math.sin(angle1) * R1;

	var poly = new Polygon(p1, p2, p3, p4);
	return poly;
}

function drawBars(subset) {
	CANVAS = document.getElementById("myCanvas");
	CONTEXT = CANVAS.getContext("2d");
	CONTEXT.fillStyle = "#00AAAA";
	var v = [.5, .4, .8, .5, .7];
	var barwidth = (ENDANGLE - (2 * STARTANGLE) - ((AMOUNTBARS -1) * ANGLEBETWEENBARS)) / AMOUNTBARS;
	//console.log(barwidth);

	for (var i = 0; i < v.length; ++i) {
		var poly = createPolygon(STARTANGLE + ANGLEBETWEENBARS * i + barwidth * i, 
									STARTANGLE + ANGLEBETWEENBARS * i + barwidth * (i+1), 
									v[i]);
		poly.draw();
	}
}


