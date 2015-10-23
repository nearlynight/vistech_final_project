function start() {
	loadData(function(result){
		prepareData(result);
	});
}

function calculateAverage() {
	for (var i = 0; i < data.length; ++i) {
		while(data[i].datetime.getDate() == data[i+1].datetime.getDate()) {
			console.log("foo");
		}
	}
}