var CANVAS = null;
var CONTEXT = null;
var GRAPH_CANVAS = null;
var GRAPH_CONTEXT = null;
var R1 = 100;
var R2 = 300;
var STARTANGLE = 45;
var ENDANGLE = 180;
var AMOUNTBARS = 5;
var ANGLEBETWEENBARS = 5;
var DAYBARWIDTH = 600;
var ACTIVEDAY = 1;
var POLYGONS = [];
var RANGE = {
	temp: {
		min: -7,
		max: 24
	},	
	rain: {
		min: 0,
		max: 28
	},
	wv: {
		min: 0.5,
		max: 6.6
	},
	p: {
		min: 1010,
		max: 960
	},
	rh: {
		min: 49,
		max: 97
	}
};

function initControls() {
	DAYBARWIDTH = CANVAS.width;
	$("#rangeInput").css({
		"width" : DAYBARWIDTH + "px"
	});
	$('.bar').on('input', function () {
		var value = parseInt($("#rangeInput").val(), 10);
		ACTIVEDAY = averagevalues[value];
		var day = averagevalues[value].datetime;
		$("#dateview").html(day.toDayMonth());
		var dateLeftPosition = (DAYBARWIDTH / (averagevalues.length-1)) * value;
		var top = document.getElementById("rangeInput").offsetTop + document.getElementById("rangeInput").offsetHeight*2;
		$("#dateview").css({
			"left" : dateLeftPosition + "px",
			"top" : top + "px",
			"display" : "block"
		});
		updateBars();
	});

	CANVAS.onmousemove = function(e) {
		var pt = {
			x: e.clientX,
			y: e.clientY
		};
		var show = false;
		var activeBar = null;
		for(var i = 0; i < POLYGONS.length; i++) {
			if (POLYGONS[i].isPointInside(pt)) {
				show = true;
				activeBar = i;
			}
		}
		if (show == true) {
			//console.log("POINT INSIDE: " + i);
			var foo = getValueFromIndex(ACTIVEDAY, activeBar).value * 10;
			b = Math.round(foo)
			bar = b / 10
			$("#tooltip").html(bar + " " + getValueFromIndex(ACTIVEDAY, activeBar).unit);
			$("#tooltip").css({
				"left" : (pt.x+10) + "px",
				"top" : (pt.y+10) + "px",
				"display" : "block"
			});
		} else {
			$("#tooltip").css({
				"left" : pt.x + "px",
				"top" : pt.y + "px",
				"display" : "none"
			});
		}
	};

	CANVAS.onclick = function(e) {
		var pt = {
			x: e.clientX,
			y: e.clientY
		};
		var activeBar = null;
		for(var i = 0; i < POLYGONS.length; i++) {
			if (POLYGONS[i].isPointInside(pt)) {
				activeBar = i;
			}
		}
		var key = getKeyFromIndex(ACTIVEDAY, activeBar);

		if (typeof key != "undefined") {
			drawGraphs(key);
		} 
	};
}

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function Polygon(p1, p2, p3, p4) {
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.p4 = p4;
	this.draw = function(color) {
		CONTEXT.fillStyle = color;
		CONTEXT.beginPath();
		CONTEXT.moveTo(this.p1.x, this.p1.y);
		CONTEXT.lineTo(this.p2.x, this.p2.y);
		CONTEXT.lineTo(this.p3.x, this.p3.y);
		CONTEXT.lineTo(this.p4.x, this.p4.y);
		CONTEXT.closePath();
		CONTEXT.stroke();
		CONTEXT.fill();
	};
	this.isPointInside = function(pt){
		var poly = [this.p1, this.p2, this.p3, this.p4];
	    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
	        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
	        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
	        && (c = !c);
	    return c;
	}
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
	p1.y = CANVAS.height - Math.sin(angle1) * valueRadius;
	p2.x = CANVAS.width/2 - Math.sin(toRadians(90) - angle2) * valueRadius;
	p2.y = CANVAS.height - Math.sin(angle2) * valueRadius;
	p3.x = CANVAS.width/2 - Math.sin(toRadians(90) - angle2) * R1;
	p3.y = CANVAS.height - Math.sin(angle2) * R1;
	p4.x = CANVAS.width/2 - Math.sin(toRadians(90) - angle1) * R1;
	p4.y = CANVAS.height - Math.sin(angle1) * R1;

	var poly = new Polygon(p1, p2, p3, p4);
	return poly;
}

function drawBars(subset) {
	CANVAS = document.getElementById("myCanvas");
	CONTEXT = CANVAS.getContext("2d");
	updateBars();
}

function drawGraphs(key) {
	GRAPH_CANVAS = document.getElementById("graphCanvas");
	GRAPH_CONTEXT = GRAPH_CANVAS.getContext("2d");
	GRAPH_CONTEXT.clearRect(0, 0, GRAPH_CANVAS.width, GRAPH_CANVAS.height);
	GRAPH_CONTEXT.beginPath();
	GRAPH_CONTEXT.moveTo(20,20);
	GRAPH_CONTEXT.lineTo(20,380);
	GRAPH_CONTEXT.lineTo(750,380);
	GRAPH_CONTEXT.stroke();
	//console.log("GRAPH: " + averagevalues.length);
	for(var i=0; i <= 365; i++) {
		var pointX = 20 + i*2;
		var bar = null;
		if (key == "temp") {
			bar = averagevalues[i].temp;
		} else if (key == "rain") {
			bar  = averagevalues[i].rain;
		} else if (key == "wv") {
			bar  = averagevalues[i].wv;
		} else if (key == "p") {
			bar  = averagevalues[i].p;
		} else if (key == "rh") {
			bar  = averagevalues[i].rh;
		}
		var foo = (bar - getMinMax(key).min) / (getMinMax(key).max - getMinMax(key).min);
		var pointY = foo * 300;
		GRAPH_CONTEXT.fillStyle = "#31CDD5";
		GRAPH_CONTEXT.fillRect(pointX, 360 - pointY, 2, 2); // fill in the pixel at (10,10)
		//console.log("HERE: " + key);
	}
}



function drawLabel(trans, rota, text, color) {
	CONTEXT.translate(trans.x,trans.y);
	CONTEXT.rotate(-rota * Math.PI/180);
	CONTEXT.fillStyle = color;
	CONTEXT.font = "10px Roboto";
	CONTEXT.fillText(text, 0, 0);
	CONTEXT.rotate(rota * Math.PI/180);
	CONTEXT.translate(-trans.x,-trans.y);
}

function updateBars() {
	CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

	//1 Text, 2 Rotate, 3 Translate
	//CONTEXT.rotate(45);
	//CONTEXT.font = "30px Comic Sans MS";

	//CONTEXT.rotate(45);
	drawLabel({x:190, y:180}, 40, "Temperatur "+ unescape("%B0") + "C", "#3B3B3B");
	drawLabel({x:260, y:125}, 20, "Niederschlag mm", "#3B3B3B");
	drawLabel({x:360, y:95}, 0, "Windgeschw. m/s", "#3B3B3B");
	drawLabel({x:470, y:100}, -20, "Luftdruck mbar", "#3B3B3B");
	drawLabel({x:565, y:140}, -40, "Luftfeuchte %", "#3B3B3B");

	POLYGONS = [];

	//CONTEXT.fillStyle = "#00AAAA";
	if(typeof RANGE.temp == "undefined")
		var temp = (ACTIVEDAY.temp - RANGE.temp.min) / (RANGE.temp.max - RANGE.temp.min); 
	else
		var temp = (ACTIVEDAY.temp - getMinMax("temp").min) / (getMinMax("temp").max - getMinMax("temp").min); 	
	if(typeof RANGE.rain == "undefined")
		var rain = (ACTIVEDAY.rain - RANGE.rain.min) / (RANGE.rain.max - RANGE.rain.min); 
	else
		var rain = (ACTIVEDAY.rain - getMinMax("rain").min) / (getMinMax("rain").max - getMinMax("rain").min); 
	if(typeof RANGE.wv == "undefined")
		var wv = (ACTIVEDAY.wv - RANGE.wv.min) / (RANGE.wv.max - RANGE.wv.min); 
	else
		var wv = (ACTIVEDAY.wv - getMinMax("wv").min) / (getMinMax("wv").max - getMinMax("wv").min); 
	if(typeof RANGE.p == "undefined")
		var p = (ACTIVEDAY.p - RANGE.p.min) / (RANGE.p.max - RANGE.p.min); 
	else
		var p = (ACTIVEDAY.p - getMinMax("p").min) / (getMinMax("p").max - getMinMax("p").min);
	if(typeof RANGE.rh == "undefined")
		var rh = (ACTIVEDAY.rh - RANGE.rh.min) / (RANGE.rh.max - RANGE.rh.min); 
	else
		var rh = (ACTIVEDAY.rh - getMinMax("rh").min) / (getMinMax("rh").max - getMinMax("rh").min); 

	//console.log("ACTIVE DAY WV: " + ACTIVEDAY.wv);

	//var temp = valueAsPercent(ACTIVEDAY.temp, "temp") / 100;
	//var rain = valueAsPercent(ACTIVEDAY.rain, "rain") / 100;
	//var wv = valueAsPercent(ACTIVEDAY.wv, "wv") / 100;
	//var p = valueAsPercent(ACTIVEDAY.p, "p") / 100;
	//var rh = valueAsPercent(ACTIVEDAY.rh, "rh") / 100;
	var v = [temp, rain, wv, p, rh];
	var DAYbarwidth = (ENDANGLE - (2 * STARTANGLE) - ((AMOUNTBARS -1) * ANGLEBETWEENBARS)) / AMOUNTBARS;
	console.log(ACTIVEDAY);
	console.log(getMinMax("temp"));
	console.log(temp);

	for (var i = 0; i < v.length; ++i) {
		var initPoly = createPolygon(STARTANGLE + ANGLEBETWEENBARS * i + DAYbarwidth * i, 
									STARTANGLE + ANGLEBETWEENBARS * i + DAYbarwidth * (i+1), 
									1.0);
		initPoly.draw("#E0E0E0");
		var poly = createPolygon(STARTANGLE + ANGLEBETWEENBARS * i + DAYbarwidth * i, 
									STARTANGLE + ANGLEBETWEENBARS * i + DAYbarwidth * (i+1), 
									v[i]);
		poly.draw("#31CDD5");
		POLYGONS.push(poly);
	}
}


