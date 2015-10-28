<?php
	$text = array();
	$file = "";

	if(isset($_POST["year"]) && file_exists("../data/full_years/mpi_roof_" .$_POST["year"]. ".csv") ){
		$file = fopen("../data/full_years/mpi_roof_" .$_POST["year"]. ".csv","r");
		while(! feof($file))
		  {
		  	$temp = fgetcsv($file);
		  	array_push($text, ["datetime" => $temp[0], "p" => $temp[1], "temp" => $temp[2], "rh" => $temp[3], "wv" => $temp[4], "rain" => $temp[5]]);
		  }
		fclose($file);
	}
	echo json_encode($text);
?> 