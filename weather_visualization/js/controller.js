//console.log("test");

var set = [];
var averagevalues = [];
var EXTREMA = null;

function start() {
	loadData(function(result){
		prepareData(result);
		calculateAverage(result);
	});
	drawBars();
	initControls();
}

function calculateAverage(data) {
	var averTempSum = 0;
	var averPSum = 0;
	var averRhSum = 0;
	var averWvSum = 0;
	var averRainSum = 0;
	var j = 0;
	for (var i = 1; i < data.length; i++) {
		averTempSum = averTempSum + data[i].temp;
		averPSum = averPSum + data[i].p;
		averRhSum = averRhSum + data[i].rh;
		averWvSum = averWvSum + data[i].wv;
		averRainSum = averRainSum + data[i].rain;
		++j;
		//console.log("avg" + averTemp);

		if (i == data.length-1 || data[i].datetime.getDay() != data[i+1].datetime.getDay()) {
			var averTemp = 0;
			var averP = 0;
			var averRh = 0;
			var averWv = 0;
			var averRain = 0;

			averTemp = averTempSum / j;
			averP = averPSum / j;
			averRh = averRhSum / j;
			averWv = averWvSum / j;
			averRain = averRainSum / j;

			var averObj = {
				datetime: data[i].datetime,
				temp: averTemp,
				p: averP,
				rh: averRh,
				wv: averWv,
				rain: averRain
			}

			averagevalues.push(averObj);

			j = 0;
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
	console.log(averagevalues.length);
	saveMinMax();
	createYearBar();
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
	//console.log(EXTREMA);
}

function createYearBar() {
	document.getElementById("rangeInput").min = 0;
	document.getElementById("rangeInput").max = averagevalues.length-1;
}

function getMinMax(key) {
	var min = null;
	var max = null;
	for (var i = 0; i < averagevalues.length; ++i) {
		if(averagevalues[i][key] < min || min == null) {
			min = averagevalues[i][key];
		}
		if(averagevalues[i][key] > max || max == null) {
			max = averagevalues[i][key];
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

function prepareData(data) {
	for (var i = 0; i < data.length; ++i) {
		data[i].datetime = stringToDate(data[i].datetime);
		data[i].temp = stringToNumber(data[i].temp);
		data[i].p = stringToNumber(data[i].p);
		data[i].rh = stringToNumber(data[i].rh);
		data[i].wv = stringToNumber(data[i].wv);
		data[i].rain = stringToNumber(data[i].rain);
	}
}

function stringToDate(str) {
	if(str != null) {
		var t = str.split(/[. :]/);
		var d = new Date(t[2], t[1]-1, t[0], t[3], t[4], t[5]);
		return d;
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


