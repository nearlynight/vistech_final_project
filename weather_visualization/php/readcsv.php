<?php
	$text = array();
	$file = fopen("../data/mpi_roof_2003b.csv","r");
	while(! feof($file))
	  {
	  	$temp = fgetcsv($file);
	  	array_push($text, ["datetime" => $temp[0], "p" => $temp[1], "temp" => $temp[2], "rh" => $temp[5], "wv" => $temp[12], "rain" => $temp[15]]);
	  }
	fclose($file);
	echo json_encode($text);
?> 