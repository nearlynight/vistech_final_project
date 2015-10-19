function loadData(callBack) {
	$.post( "php/readcsv.php").done( function(data){
		var result = jQuery.parseJSON(data);
		console.log(result);
		callBack(result);
	});
}