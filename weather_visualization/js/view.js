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
//var ACTIVEDAY = 1;
var POLYGONS = [];
var SLIDERS = [];
var MOUSEOVERPOLYGONS = [];
var MOUSECLICKPOLYGONS = [];
var DRAWGRAPHARRAY = [];
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

function initControls(callBack) {
/*	DAYBARWIDTH = CANVAS.width;
	$("#rangeInput").css({
		"width" : DAYBARWIDTH + "px"
	});*/
	/*$('.bar').on('input', function () {
		var value = parseInt($("#rangeInput").val(), 10);
		console.log("VALUE: " + value);
		console.log("DATE: " + ACTIVEDAY);
		ACTIVEDAY = AVERAGEVALUES[value];
		console.log("HERE: " + AVERAGEVALUES[value]);
		var day = AVERAGEVALUES[value].datetime;
		$("#dateview").html(day.toDayMonth());
		var dateLeftPosition = (DAYBARWIDTH / (AVERAGEVALUES.length-1)) * value;
		var top = document.getElementById("rangeInput").offsetTop + document.getElementById("rangeInput").offsetHeight*2;
		var canvas = document.getElementById("myCanvas");
		$("#dateview").css({
			"left" : (canvas.offsetLeft + dateLeftPosition) + "px",
			"top" : top + "px",
			"display" : "block"
		});
		updateBars();
	});*/

	CANVAS = document.getElementById("myCanvas");
	CONTEXT = CANVAS.getContext("2d");

	CANVAS.onmousemove = function(e) {
		MOUSEOVERPOLYGONS = [];
		var pt = {
			x: e.clientX,
			y: e.clientY
		};
		pt.x -= CANVAS.offsetLeft;
		pt.y -= CANVAS.offsetTop;

		var show = false;
		var activeBar = null;
		var activeSlider = null;

		for(var i = 0; i < POLYGONS.length; i++) {
			if (POLYGONS[i].isPointInside(pt)) {
				show = true;
				MOUSEOVERPOLYGONS.push(POLYGONS[i]);
				//activeSlider = POLYGONS[i].slider;
				activeBar = POLYGONS[i].bar;
			}
		}

		if (show == true) {
			//console.log("POINT INSIDE: " + i);
			var tempI = null;
			var minValue = null;
			for (var i = 0; i < MOUSEOVERPOLYGONS.length; i++) {
				if(minValue == null || MOUSEOVERPOLYGONS[i].value < minValue) {
					tempI = i;
					minValue = MOUSEOVERPOLYGONS[i].value;
				}
			}

			activeSlider = MOUSEOVERPOLYGONS[tempI].slider;

			//console.log(activeBar);
			var foo = getValueFromIndex(activeSlider.activeday, activeBar).value * 10;
			b = Math.round(foo)
			bar = b / 10
			$("#tooltip").html(bar + " " + getValueFromIndex(activeSlider.activeday, activeBar).unit);

			//var canvas = document.getElementById("myCanvas");
			pt.x += CANVAS.offsetLeft;
			pt.y += CANVAS.offsetTop;

			//console.log("POINT: " + pt.x + " " + pt.y + " ACTIVE BAR: " + activeBar);
			$("#tooltip").css({
				"left" : (pt.x+10) + "px",
				"top" : (pt.y+10) + "px",
				"display" : "block"
			});
		} else {
			$("#tooltip").css({
				"left" : (pt.x) + "px",
				"top" : pt.y + "px",
				"display" : "none"
			});
		}
	};

	CANVAS.onclick = function(e) {
		MOUSECLICKPOLYGONS = [];
		var pt = {
			x: e.clientX,
			y: e.clientY
		};
		pt.x -= CANVAS.offsetLeft;
		pt.y -= CANVAS.offsetTop;
		var activeBar = null;
		var activeSlider = null;
		var show = false;
		for(var i = 0; i < POLYGONS.length; i++) {
			if (POLYGONS[i].isPointInside(pt)) {
				show = true;
				MOUSECLICKPOLYGONS.push(POLYGONS[i]);
				//activeSlider = POLYGONS[i].slider;
				activeBar = POLYGONS[i].bar;
				//activeBar = i;
			}
		}

		if (show){
			var tempI = null;
			var minValue = null;
			for (var i = 0; i < MOUSECLICKPOLYGONS.length; i++) {
				if(minValue == null || MOUSECLICKPOLYGONS[i].value < minValue) {
					tempI = i;
					minValue = MOUSECLICKPOLYGONS[i].value;
				}
			}
			//console.log(MOUSECLICKPOLYGONS[tempI]);
			activeSlider = MOUSECLICKPOLYGONS[tempI].slider;
			var key = getKeyFromIndex(MOUSECLICKPOLYGONS[tempI].slider.year, activeBar);
			var drawYear = MOUSECLICKPOLYGONS[tempI].slider.year;
			//var key = getKeyFromIndex(MOUSECLICKPOLYGONS[tempI].slider.year, activeBar);
			if (typeof key != "undefined") {
				//console.log("AWAKE");
				//console.log(key);
				drawGraphs(key, drawYear);
			} 
		}
	};

	// PLUS BUTTON
	var plus_button = document.getElementById("add_year");
	plus_button.onclick = function(e) {
		$("#popup").empty();
		var pt = {
			x: e.clientX,
			y: e.clientY
		};
		//console.log("TEST+");


		for(var i = 0; i < YEARS.length; i++) {
			if (!YEARS[i].active) {
				var listEl = new ListEl(YEARS[i]);
			}
		}

		this.button = document.createElement("button");
		this.button.innerHTML = "close";
		$(this.button).on("click", {obj:this}, function(event) {
			$("#popup").fadeOut();
		});
		$("#popup").append(this.button);
		
		//var year = document.getElementById("year_input_1").value;
		//console.log("YEAR: " + year);
		var popupPosition = window.innerWidth/2 - 100;
		$("#popup").css({
				"left" : (window.innerWidth/2 - 100) + "px",
				"top" : (window.innerHeight/2 -100) + "px"
			});
		//$("#popup").html("");
		$("#popup").fadeIn();
	}
	$("#popup").on("click", function(e){
		$(this).fadeOut();
	});
	if(typeof callBack != "undefined") {
		callBack();
	}
}

function CountElementsOfYear(year) {
	var count = 0;
	for (var i = 0; i < AVERAGEVALUES.length; i++) {
		if(AVERAGEVALUES[i].datetime.getFullYear() == year) {
			count++;
		}
	}
	return count;
}

function Slider(year){
	this.year = year;
	this.position = 0;
	this.min = 0;
	this.max = CountElementsOfYear(this.year);
	this.averagevalues = [];
	this.color = "red";
	if (this.year == 2004) {
		this.color = "green";
	} else if (this.year == 2005) {
		this.color = "blue";
	} else if (this.year == 2006) {
		this.color = "yellow";
	}
	
	for (var i = 0; i < AVERAGEVALUES.length; i++) {
		if (this.year == AVERAGEVALUES[i].datetime.getFullYear()) {
			this.averagevalues.push(AVERAGEVALUES[i]);
		}
	}
	this.activeday = this.averagevalues[0];
	this.removeYear = function() {
		$(this.div).fadeOut();
/*		for (var i = 0; i < SLIDERS.length; i++) {
			if (SLIDERS[i].year == this.year) {
				SLIDERS[i] = null;
			}
		}*/

		for(var j = 0; j < YEARS.length; j++) {
			if (YEARS[j].year == this.year){
				YEARS[j].active = false;		
			}
		}
	};
	this.show = function (){
		this.div = document.createElement("div");
		this.div.innerHTML = '<form oninput="rangeInput' + this.year + '.value;"><input name="' + this.year + '" class="bar rangeInput" type="range" id="rangeInput' + this.year + '" value="0"  min="0" max="' + this.max + '" />' +
								'<span class="highlight"> </span><div id="dateview' + this.year + '" class="dateview"></div>' + 
								'<span class="yearName">' + this.year + '</span> <button class="closeButton" id="closeButton' + this.year + '"> X </button></form>';
		$("#sliders").append(this.div);
		var closeButton = document.getElementById("closeButton" + this.year);
		$(closeButton).on('click', {obj:this}, function (event) {
			var that = event.data.obj;
			event.preventDefault();
			that.removeYear();
			updateBars();
		});

		$('#rangeInput' + this.year).on('input', {obj:this}, function (event) {
			var that = event.data.obj;
			var rangeEl = document.getElementById("rangeInput" + that.year);
			var dateviewEl = document.getElementById("dateview" + that.year);

			// get active day
			var value = parseInt($(rangeEl).val(), 10);
			that.activeday = that.averagevalues[value];
			
			// dateview position calculation
			$(dateviewEl).html(that.averagevalues[value].datetime.toDayMonth());
			var dateLeftPosition = (DAYBARWIDTH / (that.averagevalues.length-1)) * value;
			$(dateviewEl).css({
				"left" : (CANVAS.offsetLeft + dateLeftPosition) + "px",
				"top" : (rangeEl.offsetTop + rangeEl.offsetHeight*2 + 0) + "px",
				"display" : "block"
			});
			updateBars();
			drawGraphs();
		});
	};
}

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function Polygon(p1, p2, p3, p4, slider, value, bar) {
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.p4 = p4;
	this.slider = slider;
	this.value = value;
	this.bar = bar;
	this.draw = function() {
		if(this.slider != null){
			CONTEXT.fillStyle = this.slider.color;
		} else {
			CONTEXT.fillStyle = "#E0E0E0";
		}
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

function createPolygon(angle1, angle2, value, slider, barnumber) {
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

	var poly = new Polygon(p1, p2, p3, p4, slider, value, barnumber);
	return poly;
}

/*function drawBars(subset) {
	CANVAS = document.getElementById("myCanvas");
	CONTEXT = CANVAS.getContext("2d");
	updateBars();
}*/

function drawCircle(x, y, radius, color, context) {
	var centerX = x;
	var centerY = y;
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
}

function clearGraph() {
	if (typeof GRAPH_CONTEXT == "undefined") {
		GRAPH_CANVAS = document.getElementById("graphCanvas");
		GRAPH_CONTEXT = GRAPH_CANVAS.getContext("2d");
	}
	GRAPH_CONTEXT.clearRect(0, 0, GRAPH_CANVAS.width, GRAPH_CANVAS.height);
	DRAWGRAPHARRAY = [];
}



function drawGraphs(key, year) {
	//console.log("WAAA:" + key);
	if(typeof key != "undefined" && typeof year != "undefined"){
		DRAWGRAPHARRAY.push({
			key: key,
			year: year
		});
	}

	var graph_width = 380;
	var graph_height = 750;
	GRAPH_CANVAS = document.getElementById("graphCanvas");
	GRAPH_CONTEXT = GRAPH_CANVAS.getContext("2d");
	GRAPH_CONTEXT.clearRect(0, 0, GRAPH_CANVAS.width, GRAPH_CANVAS.height);

	// DRAW COORDINATE SYSTEM
	GRAPH_CONTEXT.beginPath();
	GRAPH_CONTEXT.moveTo(20,20);
	GRAPH_CONTEXT.lineTo(20,graph_width);
	GRAPH_CONTEXT.lineTo(graph_height,graph_width);
	GRAPH_CONTEXT.stroke();
	//console.log("GRAPH: " + AVERAGEVALUES.length);
	for (var j = 0; j < DRAWGRAPHARRAY.length; j++) {
		var year = DRAWGRAPHARRAY[j].year;
		var key = DRAWGRAPHARRAY[j].key;

		var activeSlider = getSliderFromYear(year);
		var values = activeSlider.averagevalues;
		//console.log(values);

		var color = null;
		if (year == 2004) {
			color = "green";
		} else if (year == 2005) {
			color = "blue";
		} else if (year == 2006) {
			color = "yellow";
		} else if (year == 2007) {
			color = "red";
		} else {
			color = "black";
		}

		var radius = 2;
	


		for(var i=0; i <= values.length; i++) {
			var pointX = 20 + i*2;
			if (typeof values[i] != "undefined") {
				if (values[i].datetime == activeSlider.activeday.datetime){
					radius = 10;
				} else {
					radius = 2;
				}
				//console.log("HERE: " + AVERAGEVALUES[i][key]);
				var valueinpercent = (values[i][key] - getMinMax(key).min) / (getMinMax(key).max - getMinMax(key).min);
				var pointY = valueinpercent * 300;
				GRAPH_CONTEXT.fillStyle = "#31CDD5";
				drawCircle(pointX, 360-pointY, radius, color, GRAPH_CONTEXT);
				//GRAPH_CONTEXT.fillRect(pointX, 360 - pointY, 2, 2); // fill in the pixel at (10,10)
			}
			//console.log("HERE: " + key);
		}
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
	var DAYbarwidth = (ENDANGLE - (2 * STARTANGLE) - ((AMOUNTBARS -1) * ANGLEBETWEENBARS)) / AMOUNTBARS;

	// draw background of bars
	for (var i = 0; i < AMOUNTBARS; ++i) {
		var initPoly = createPolygon(STARTANGLE + ANGLEBETWEENBARS * i + DAYbarwidth * i, 
									STARTANGLE + ANGLEBETWEENBARS * i + DAYbarwidth * (i+1), 
									1.0, null);
		initPoly.draw("#E0E0E0");
	}

	//CONTEXT.rotate(45);
	drawLabel({x:190, y:180}, 40, "Temperatur "+ unescape("%B0") + "C", "#3B3B3B");
	drawLabel({x:260, y:125}, 20, "Niederschlag mm", "#3B3B3B");
	drawLabel({x:360, y:95}, 0, "Windgeschw. m/s", "#3B3B3B");
	drawLabel({x:470, y:100}, -20, "Luftdruck mbar", "#3B3B3B");
	drawLabel({x:565, y:140}, -40, "Luftfeuchte %", "#3B3B3B");
	
	// empty polygon array
	POLYGONS = [];

	//CONTEXT.fillStyle = "#00AAAA";

	console.log(SLIDERS);

	for (var i = 0; i < SLIDERS.length; i++){
		var tempBool = false;
		for(var j = 0; j < YEARS.length; j++) {
			if (YEARS[j].year == SLIDERS[i].year && YEARS[j].active){
				tempBool = true;
			}
		}
		if(tempBool){
			// adapt values to percentage
			if(typeof RANGE.temp == "undefined")
				var temp = (SLIDERS[i].activeday.temp - RANGE.temp.min) / (RANGE.temp.max - RANGE.temp.min); 
			else
				var temp = (SLIDERS[i].activeday.temp - getMinMax("temp").min) / (getMinMax("temp").max - getMinMax("temp").min); 	
			if(typeof RANGE.rain == "undefined")
				var rain = (SLIDERS[i].activeday.rain - RANGE.rain.min) / (RANGE.rain.max - RANGE.rain.min); 
			else
				var rain = (SLIDERS[i].activeday.rain - getMinMax("rain").min) / (getMinMax("rain").max - getMinMax("rain").min); 
			if(typeof RANGE.wv == "undefined")
				var wv = (SLIDERS[i].activeday.wv - RANGE.wv.min) / (RANGE.wv.max - RANGE.wv.min); 
			else
				var wv = (SLIDERS[i].activeday.wv - getMinMax("wv").min) / (getMinMax("wv").max - getMinMax("wv").min); 
			if(typeof RANGE.p == "undefined")
				var p = (SLIDERS[i].activeday.p - RANGE.p.min) / (RANGE.p.max - RANGE.p.min); 
			else
				var p = (SLIDERS[i].activeday.p - getMinMax("p").min) / (getMinMax("p").max - getMinMax("p").min);
			if(typeof RANGE.rh == "undefined")
				var rh = (SLIDERS[i].activeday.rh - RANGE.rh.min) / (RANGE.rh.max - RANGE.rh.min); 
			else
				var rh = (SLIDERS[i].activeday.rh - getMinMax("rh").min) / (getMinMax("rh").max - getMinMax("rh").min); 

			//console.log("ACTIVE DAY WV: " + ACTIVEDAY.wv);

			//console.log(ACTIVEDAY);
			//console.log(getMinMax("temp"));
			//console.log(temp);

			var v = [temp, rain, wv, p, rh];

			for (var j = 0; j < v.length; ++j) {
				//console.log("DUDE!");
				var poly = createPolygon(STARTANGLE + ANGLEBETWEENBARS * j + DAYbarwidth * j, 
											STARTANGLE + ANGLEBETWEENBARS * j + DAYbarwidth * (j+1), 
											v[j], SLIDERS[i], j);
				//console.log(poly);
				//poly.draw();
				POLYGONS.push(poly);
			}
		}
	}
	POLYGONS.Sort("value", function(sortedArray){
		for(var i = sortedArray.length-1; i >= 0; i--) {
			sortedArray[i].draw();
		}
	});

}


