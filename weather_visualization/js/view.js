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
var DAYBARWIDTH = 730;
//var ACTIVEDAY = 1;
var POLYGONS = [];
var SLIDERS = [];
var MOUSEOVERPOLYGONS = [];
var MOUSECLICKPOLYGONS = [];
var DRAWGRAPHARRAY = [];

// COLORS
var	C1 = "#1CC1E8";
var C2 = "#6A8A99";
var C3 = "#60FFDC";
var C4 = "#FF897B";
var C5 = "#CC6C78";
var C6 = "#FCDCC0";
var C7 = "#833D1B";
var C8 = "#1B3547";
var C9 = "#dd77c7";
var C10 = "#CEDC74";
var C11 = "#57B644";
var C12 = "#FF0D00";

/*var	C1 = "#8dd3c7";
var C2 = "#ffffb3";
var C3 = "#bebada";
var C4 = "#fb8072";
var C5 = "#80b1d3";
var C6 = "#fdb462";
var C7 = "#b3de69";
var C8 = "#fccde5";
var C9 = "#d9d9d9";
var C10 = "#bc80bd";
var C11 = "#ccebc5";
var C12 = "#ffed6f";*/


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

		// MOUSE OVER WHICH BAR?
		for(var i = 0; i < POLYGONS.length; i++) {
			if (POLYGONS[i].isPointInside(pt)) {
				show = true;
				MOUSEOVERPOLYGONS.push(POLYGONS[i]);
				//activeSlider = POLYGONS[i].slider;
				activeBar = POLYGONS[i].bar;
				//console.log(activeBar);
			}
		}

		// SHOW SMALLER VALUES IN FRONT
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
			//console.log(activeSlider.activeday);
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

			// DRAW POLYFON HIGHLIGHT HERE

			//console.log(MOUSEOVERPOLYGONS[tempI].p1);

			CONTEXT.strokeStyle = "rgba(255,0,0,1.0)";
			CONTEXT.lineWidth = 5;
			CONTEXT.beginPath();
			CONTEXT.moveTo(MOUSEOVERPOLYGONS[tempI].p1.x, MOUSEOVERPOLYGONS[tempI].p1.y);
			CONTEXT.lineTo(MOUSEOVERPOLYGONS[tempI].p2.x, MOUSEOVERPOLYGONS[tempI].p2.y);
			CONTEXT.lineTo(MOUSEOVERPOLYGONS[tempI].p3.x, MOUSEOVERPOLYGONS[tempI].p3.y);
			CONTEXT.lineTo(MOUSEOVERPOLYGONS[tempI].p4.x, MOUSEOVERPOLYGONS[tempI].p4.y);
			CONTEXT.closePath();
			CONTEXT.stroke();
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
				//console.log(activeBar);
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

		// ADD YEARS TO POPUP
		for(var i = 0; i < YEARS.length; i++) {
			if (!YEARS[i].active) {
				var listEl = new ListEl(YEARS[i]);
			}
		}

		// CLOSE ADD YEAR POPUP
		this.button = document.createElement("button");
		this.button.className ="closeYearButton";
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

function countElementsOfYear(year) {
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
	this.max = countElementsOfYear(this.year);
	this.averagevalues = [];
	this.color = C12;
	if (this.year == 2004) {
		this.color = C1;
	} else if (this.year == 2005) {
		this.color = C2;
	} else if (this.year == 2006) {
		this.color = C3;
	} else if (this.year == 2007) {
		this.color = C4;
	} else if (this.year == 2008) {
		this.color = C5;
	} else if (this.year == 2009) {
		this.color = C6;
	} else if (this.year == 2010) {
		this.color = C7;
	} else if (this.year == 2011) {
		this.color = C8;
	} else if (this.year == 2012) {
		this.color = C9;
	} else if (this.year == 2013) {
		this.color = C10;
	} else if (this.year == 2014) {
		this.color = C11;
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

		var sliderColor = "rgba(0,0,0,0),";
		//console.log("SLIDER ADDED");
		for (var i = 0; i < this.averagevalues.length; i++) {
			if (this.averagevalues[i].temp <= -15) {
				sliderColor += " rgba(0,0,0,.9),";
			} else if (this.averagevalues[i].temp <= -10) {
				sliderColor += " rgba(0,0,0,.8),";
			} else if (this.averagevalues[i].temp <= -5) {
				sliderColor += " rgba(0,0,0,.7),";
			} else if (this.averagevalues[i].temp <= 0) {
				sliderColor += " rgba(0,0,0,.6),";
			} else if (this.averagevalues[i].temp <= 5) {
				sliderColor += " rgba(0,0,0,.5),";
			} else if (this.averagevalues[i].temp <= 10) {
				sliderColor += " rgba(0,0,0,.4),";
			} else if (this.averagevalues[i].temp <= 15) {
				sliderColor += " rgba(0,0,0,.3),";
			} else if (this.averagevalues[i].temp <= 20) {
				sliderColor += " rgba(0,0,0,.2),";
			} else if (this.averagevalues[i].temp <= 25) {
				sliderColor += " rgba(0,0,0,.1),";
			} else {
				sliderColor += " rgba(0,0,0,.0),";
			}
			//console.log(this.averagevalues[i].temp);
		}
		sliderColor += " white";
		
		$('#rangeInput' + this.year).css({"background" : "linear-gradient(to right," + sliderColor + ")"});

		//if(this.averagevalues)
		//$('#rangeInput' + this.year).css({"background" : sliderColor});
		

/*		CONTEXT.beginPath();
		CONTEXT.lineWidth = "6";
		CONTEXT.strokeStyle = "red";
		CONTEXT.rect(5, 5, 730, 10);  
		CONTEXT.stroke();*/

		// CLOSE YEAR BUTTON
		var closeButton = document.getElementById("closeButton" + this.year);
		$(closeButton).on('click', {obj:this}, function (event) {
			var that = event.data.obj;
			event.preventDefault();
			that.removeYear();
			updateBars();
		});



		// THUMBNAIL OF SLIDER
		$('#rangeInput' + this.year).on('input', {obj:this}, function (event) {
			var that = event.data.obj;
			var rangeEl = document.getElementById("rangeInput" + that.year);
			var dateviewEl = document.getElementById("dateview" + that.year);

			var color = C12;
			if (that.year == 2004) {
				color = C1;
			} else if (that.year == 2005) {
				color = C2;
			} else if (that.year == 2006) {
				color = C3;
			} else if (that.year == 2007) {
				color = C4;
			} else if (that.year == 2008) {
				color = C5;
			} else if (that.year == 2009) {
				color = C6;
			} else if (that.year == 2010) {
				color = C7;
			} else if (that.year == 2011) {
				color = C8;
			} else if (that.year == 2012) {
				color = C9;
			} else if (that.year == 2013) {
				color = C10;
			} else if (that.year == 2014) {
				color = C11;
			}



			$("slider-thumb").css({"border-top": "solid 20px red"});

			// get active day - position on slider [1,2,...,365]
			var value = parseInt($(rangeEl).val(), 10);

			// make slider transparent, draw temperatur grey values behind

			// SLIDERCOLOR
			// color = #grey * temperature
			// slider color at position of value = color

			//console.log(that.averagevalues[value].temp);

			// THUMBNAIL OF SLIDER
			if (typeof that.averagevalues[value] != "undefined" ) {
				that.activeday = that.averagevalues[value];
				
				// dateview position calculation
				$(dateviewEl).html(that.averagevalues[value].datetime.toDayMonth());
				var dateLeftPosition = (DAYBARWIDTH / (that.averagevalues.length)) * value;
				$(dateviewEl).css({
					"left" : (CANVAS.offsetLeft + dateLeftPosition - 20) + "px",
					"top" : (rangeEl.offsetTop + rangeEl.offsetHeight*2 - 35) + "px",
					"display" : "block",
					"height" : "5px",
					"background-color": color
				});
				updateBars();
				drawGraphs();
			}
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
			// POLYGON COLOR
			CONTEXT.fillStyle = this.slider.color;
		} else {
			// POLYGON DEFAULT BACKGROUND
			CONTEXT.fillStyle = "#E0E0E0";
		}
		CONTEXT.strokeStyle = "rgba(0,0,0,0.8)";
		CONTEXT.lineWidth = 1;
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

	var graph_width = 750;
	var graph_height = 380;
	var graph_plot_compression = (graph_height/100) * 70;
	var graph_plot_position_y = graph_height - ((graph_height/100)*10);

	GRAPH_CANVAS = document.getElementById("graphCanvas");
	GRAPH_CONTEXT = GRAPH_CANVAS.getContext("2d");
	GRAPH_CONTEXT.clearRect(0, 0, GRAPH_CANVAS.width, GRAPH_CANVAS.height);

	// DRAW COORDINATE SYSTEM
	GRAPH_CONTEXT.beginPath();
	GRAPH_CONTEXT.moveTo(20,graph_height);
	//GRAPH_CONTEXT.lineTo(20,graph_height);
	GRAPH_CONTEXT.lineTo(graph_width,graph_height);
	GRAPH_CONTEXT.lineWidth = 2;
	GRAPH_CONTEXT.strokeStyle = "black";
	GRAPH_CONTEXT.stroke();
	// draw month sections
	
	GRAPH_CONTEXT.translate((graph_width/12)-(graph_width/24), graph_height + 10);
	GRAPH_CONTEXT.font = "10px Roboto";
	GRAPH_CONTEXT.fillStyle = "black";
	var step = graph_width/12;
	GRAPH_CONTEXT.fillText("Jan", step * 0, 0);
	GRAPH_CONTEXT.fillText("Feb", step * 1, 0);
	GRAPH_CONTEXT.fillText("Mar", step * 2, 0);
	GRAPH_CONTEXT.fillText("Apr", step * 3, 0);
	GRAPH_CONTEXT.fillText("May", step * 4, 0);
	GRAPH_CONTEXT.fillText("Jun", step * 5, 0);
	GRAPH_CONTEXT.fillText("Jul", step * 6, 0);
	GRAPH_CONTEXT.fillText("Aug", step * 7, 0);
	GRAPH_CONTEXT.fillText("Sep", step * 8, 0);
	GRAPH_CONTEXT.fillText("Oct", step * 9, 0);
	GRAPH_CONTEXT.fillText("Nov", step * 10, 0);
	GRAPH_CONTEXT.fillText("Dec", step * 11, 0);
	GRAPH_CONTEXT.translate(-((graph_width/12)-(graph_width/24)), -(graph_height + 10));

	//console.log("GRAPH: " + AVERAGEVALUES.length);
	for (var j = 0; j < DRAWGRAPHARRAY.length; j++) {
		var year = DRAWGRAPHARRAY[j].year;
		var key = DRAWGRAPHARRAY[j].key;

		var activeSlider = getSliderFromYear(year);
		var values = activeSlider.averagevalues;


		var color = null;
		if (year == 2004) {
			color = C1;
		} else if (year == 2005) {
			color = C2;
		} else if (year == 2006) {
			color = C3;
		} else if (year == 2007) {
			color = C4;
		} else if (year == 2008) {
			color = C5;
		} else if (year == 2009) {
			color = C6;
		} else if (year == 2010) {
			color = C7;
		} else if (year == 2011) {
			color = C8;
		} else if (year == 2012) {
			color = C9;
		} else if (year == 2013) {
			color = C10;
		} else if (year == 2014) {
			color = C11;
		} else {
			color = C12;
		}

		var radius = null;
	
		var valueinpercent_temp = null;

		for(var i=0; i <= values.length; i++) {
			var pointX = 20 + i*2;
			var pointX_2 = 20 + (i+1)*2;
			if (typeof values[i] != "undefined") {

				var valueinpercent = (values[i][key] - getMinMax(key).min) / (getMinMax(key).max - getMinMax(key).min);
				var pointY = valueinpercent * graph_plot_compression;

				//console.log(values[i][key]);

				// HIGHLIGHT POINT ON SLIDER IN GRAPH
				if (values[i].datetime == activeSlider.activeday.datetime){
					radius = 7;
				} else {
					radius = 0;
				}
				//console.log("HERE: " + AVERAGEVALUES[i][key]);
				//var valueinpercent = (values[i][key] - getMinMax(key).min) / (getMinMax(key).max - getMinMax(key).min);

				//console.log(values[i+1][key]);
				//var valueinpercent_2 = (values[i][key] - getMinMax(key).min) / (getMinMax(key).max - getMinMax(key).min);
				//var pointY = valueinpercent * graph_plot_compression;
				//var pointY_2 = valueinpercent_2 * 300;
				GRAPH_CONTEXT.fillStyle = "#31CDD5";

				// DRAW LINE

				GRAPH_CONTEXT.beginPath();
				GRAPH_CONTEXT.moveTo(pointX,graph_plot_position_y - valueinpercent_temp);
				GRAPH_CONTEXT.lineTo(pointX_2,graph_plot_position_y - pointY);
				//GRAPH_CONTEXT.lineTo(graph_height,graph_width);
				GRAPH_CONTEXT.lineWidth = 2;
				GRAPH_CONTEXT.strokeStyle = color;
				GRAPH_CONTEXT.stroke();

				valueinpercent_temp = valueinpercent * graph_plot_compression;

				drawCircle(pointX, graph_plot_position_y - pointY, radius, color, GRAPH_CONTEXT);
				//GRAPH_CONTEXT.fillRect(pointX, 360 - pointY, 2, 2); // fill in the pixel at (10,10)


				// BACKGROUND OF VALUE BOX FOR ACTUAL HIGHLICHTED NUMBER IN GRAPH
				if (values[i].datetime == activeSlider.activeday.datetime){

					GRAPH_CONTEXT.fillStyle = "#E4E4E4";
					//GRAPH_CONTEXT.fillStyle = "red";
					GRAPH_CONTEXT.fillRect(pointX - 33, graph_plot_position_y - pointY - 7, 25, 15);

					var foo = values[i][key] * 10;
					b = Math.round(foo)
					bar = b / 10

					GRAPH_CONTEXT.fillStyle = "black";
					GRAPH_CONTEXT.font = "10px Roboto";
					GRAPH_CONTEXT.fillText(bar, pointX -30, graph_plot_position_y - pointY +4);
					
					//radius = 7;
				}
			}
			//console.log("HERE: " + key);
		}
	}
}

// LABELS FOR POLYGONS
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
		initPoly.draw();
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

	//console.log(SLIDERS);

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


