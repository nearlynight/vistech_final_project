//console.log("test");

var set = [];
var AVERAGEVALUES = [];
var EXTREMA = null;
var YEARS = [];


function start() {
	for(var i = 2004; i <= 2008; i++) {
		YEARS.push({
			year: i,
			active: false,
			loaded: false
		});
	}

	YEARS[0].active = true;
	//YEARS[1].active = true;
	//YEARS[0].loaded = true;

	loadData(function(result){
		//console.log(result);
		prepareData(result, function(data){
			//console.log(data);
			calculateAverage(data, function(data){
				initControls(function(){
					createSliders();
					updateBars();
				});
			});
		});
	}, 	YEARS);

	
}

function ListEl(yearObj) {
	//console.log(yearObj);
	this.yearObj = yearObj;
	this.button = document.createElement("button");// element zum draufdruecken
	this.button.innerHTML = this.yearObj.year;
	$("#popup").append(this.button);
	//$('#button' + this.year)
	// event.data.obj

	$(this.button).on("click", {obj:this}, function(event) {
		var that = event.data.obj;
		for(var i = 0; i < YEARS.length; i++) {
			if (YEARS[i].year == that.yearObj.year) {
				YEARS[i].active = true;
			}
		}
		//console.log("LOADED: " + that.yearObj);
		if (that.yearObj.loaded) {
			createSliders();
			updateBars();
		} else {
			loadData(function(result) {
				//console.log(result);
				prepareData(result, function(data){
					//console.log(data);
					calculateAverage(data, function(data){
						//console.log(AVERAGEVALUES);
						createSliders();
						updateBars();
					}); 
				});
			},[that.yearObj]);
		}
	});
}


	
function existSlider(year){
	for (var i = 0; i < SLIDERS.length; i++) {
		if (SLIDERS[i] != null){
			if(SLIDERS[i].year == year){
				return true;
			}
		}
	}
}

function getSliderFromYear(year){
	for (var i = 0; i < SLIDERS.length; i++) {
		if (SLIDERS[i] != null){
			if(SLIDERS[i].year == year){
				return SLIDERS[i];
			}
		}
	}
}

function createSliders() {
	for(var j = 0; j < YEARS.length; j++) {
		if (YEARS[j].active && !existSlider(YEARS[j].year)){
			var newSlider = new Slider(YEARS[j].year);
			newSlider.show();
			SLIDERS.push(newSlider);			
		} else if (YEARS[j].active && existSlider(YEARS[j].year)) {
			$(getSliderFromYear(YEARS[j].year).div).fadeIn();

		}
	}
}

function calculateAverage(data, callBack) {
	var averTempSum = 0;
	var averPSum = 0;
	var averRhSum = 0;
	var averWvSum = 0;
	var averRainSum = 0;
	var count = 0;
	//console.log(data);
	for (var i = 1; i < data.length; i++) {
		if(data[i].temp != -9999.00 || data[i].p != -9999.00 || data[i].rh != -9999.00 || data[i].wv != -9999.00 || data[i].rain != -9999.00) {
			averTempSum = averTempSum + data[i].temp;
			averPSum = averPSum + data[i].p;
			averRhSum = averRhSum + data[i].rh;
			averWvSum = averWvSum + data[i].wv;
			averRainSum = averRainSum + data[i].rain;
			++count;
			//console.log("avg" + averTemp);

			if (i == data.length-1 || data[i].datetime.getDay() != data[i+1].datetime.getDay()) {
				var averTemp = 0;
				var averP = 0;
				var averRh = 0;
				var averWv = 0;
				var averRain = 0;

				averTemp = averTempSum / count;
				averP = averPSum / count;
				averRh = averRhSum / count;
				averWv = averWvSum / count;
				averRain = averRainSum;

				var averObj = {
					datetime: data[i].datetime,
					temp: averTemp,
					p: averP,
					rh: averRh,
					wv: averWv,
					rain: averRain
				}

				AVERAGEVALUES.push(averObj);

				count = 0;
				averTempSum = 0;
				averPSum = 0;
				averRhSum = 0;
				averWvSum = 0;
				averRainSum = 0;

	/*			console.log(i + " temp: " + averTemp);
				console.log(i + " p: " + averP);
				console.log(i + " rh: " + averRh);
				console.log(i + " wv: " + averWv);
				console.log(i + " rain: " + averRain);*/
			}	
		}	
	}
	//console.log(AVERAGEVALUES.length);
	saveMinMax();
	//createYearBar();
	callBack();
}

function getValueFromIndex(averObj, i) {
	if(i == 0) {
		return {
			unit: unescape("%B0") + "C",
			value: averObj.temp
		};
	} else if (i == 1) {
		return {
			unit: "mm",
			value: averObj.rain
		};
	} else if (i == 2) {
		return {
			unit: "m/s",
			value: averObj.wv
		};
	} else if (i == 3) {
		return {
			unit: "mbar",
			value: averObj.p
		};
	} else if (i == 4) {
		return {
			unit: "%",
			value: averObj.rh
		};
	}
}

function getKeyFromIndex(averObj, i) {
	if(i == 0) {
		return "temp";
	} else if (i == 1) {
		return "rain";
	} else if (i == 2) {
		return "wv";
	} else if (i == 3) {
		return "p";
	} else if (i == 4) {
		return "rh";
	}
}

function saveMinMax() {
	EXTREMA = {
		datetime: getMinMax("datetime"),
		temp: getMinMax("temp"),
		p: getMinMax("p"),
		rh: getMinMax("rh"),
		wv: getMinMax("wv"),
		rain: getMinMax("rain")
	};
	console.log(EXTREMA);
}

/*function createYearBar() {
	document.getElementById("rangeInput").min = 0;
	document.getElementById("rangeInput").max = AVERAGEVALUES.length-1;
}*/

function getMinMax(key) {
	var min = null;
	var max = null;
	for (var i = 0; i < AVERAGEVALUES.length; ++i) {
		if(AVERAGEVALUES[i][key] < min || min == null) {
			min = AVERAGEVALUES[i][key];
		}
		if(AVERAGEVALUES[i][key] > max || max == null) {
			max = AVERAGEVALUES[i][key];
		}
	}
	return {
		min: min,
		max: max
	}
}

function valueAsPercent(value, key) {
	return ((value - EXTREMA[key].min) * ((EXTREMA[key].max - EXTREMA[key].min) / 100));
}

function prepareData(data, callBack) {
	//console.log("TEST");
	for (var i = 0; i < data.length; i++) {
		//if(i == 0) console.log("na moin");
		//console.log(data[i].datetime);
		data[i].datetime = stringToDate(data[i].datetime);
		for(var j = 0; j < YEARS.length; j++) {
			if (data[i].datetime.getFullYear() == YEARS[j].year){
				YEARS[j].loaded = true;
			}
		}
		data[i].temp = stringToNumber(data[i].temp);
		data[i].p = stringToNumber(data[i].p);
		data[i].rh = stringToNumber(data[i].rh);
		data[i].wv = stringToNumber(data[i].wv);
		data[i].rain = stringToNumber(data[i].rain);
	}
	callBack(data);
}

function stringToDate(str) {
	if(str != null && typeof str == "string") {
		var t = str.split(/[. :]/);
		var d = new Date(t[2], t[1]-1, t[0], t[3], t[4], t[5]);
		return d;
	} else {
		return str;
	}
}

function stringToNumber(str) {
	if (str != null) {
		var t = parseFloat(str);
		return t;
	}
}

function Record(datetime, temp, rain, wv, p, rh) {
	this.datetime = datetime;
	this.temp = temp;
	this.rain = rain;
	this.wv = wv;
	this.p = p;
	this.rh = rh;
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
Date.prototype.toDayMonth = function() {
	return monthNames[this.getUTCMonth()] + " " + twoDigits(this.getUTCDate());
};

Array.prototype.Sort = function(sortBy, callBack) {
	if(this.length > 1) {		
		var progress = true;
		while(progress) {
			progress = false;			
			for(var i = 1; i < this.length; i++) {
				if(typeof sortBy !== 'undefined') {
					if(this[i][sortBy] < this[i - 1][sortBy]) {
						var temp = this[i];
						this[i] = this[i - 1];
						this[i - 1] = temp;
						progress = true;
					}		
				} else {
					if(this[i] < this[i - 1]) {
						var temp = this[i];
						this[i] = this[i - 1];
						this[i - 1] = temp;
						progress = true;
					}		
				}
			}
		}
		callBack(this);
	} else {
		console.log("Warning: tried to sort array with one element.");
	}
};
