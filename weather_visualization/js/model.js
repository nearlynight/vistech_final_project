function loadData(callBack, years) {
	//console.log("call arrived");
	var loadedData = [];
	var toLoad = 0;
	var loaded = 0;
	for(var i = 0; i < years.length; i++) {
		var year = years[i];
		if(year.active && !year.loaded){
			toLoad++;
			$.post( "php/readcsv.php", {year:year.year} ).done(function(data){
				//console.log("FOO: " + data);
				var result = jQuery.parseJSON(data);
				for(var j = 0; j < result.length; j++){
					loadedData.push(result[j]);
				}
				loaded++;
				//console.log(loaded + " == " + toLoad);
				if (loaded == toLoad) {
					//console.log(loadedData);
					callBack(loadedData);
					
				}
				
			});
		}
	}
	//console.log(loadedData);
	// /callBack(loadedData);
}