//console.log("test");

var set = [];

function start() {
	loadData(function(result){
		prepareData(result);
	});
	drawBars();
}

function prepareData(data) {
	for (var i = 0; i < data.length; ++i) {
		data[i].datetime = stringToDate(data[i].datetime);
	}
}

function stringToDate(str) {
	if(str != null) {
		var t = str.split(/[. :]/);
		var d = new Date(t[2], t[1]-1, t[0], t[3], t[4], t[5]);
		return d;
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

