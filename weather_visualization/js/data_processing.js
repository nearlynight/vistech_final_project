function start() {
	loadData(function(result){
		prepareData(result);
	});
}

function calculateAverage(data) {
	for (var i = 0; i < data.length; ++i) {
		var j = 0;
		var averTemp = 0;
		while(data[i].datetime.getDate() == data[i+1].datetime.getDate()) {
			averTemp += data[i].temp;
			console.log(averTemp);


			++j;
		}
	}
}