<?php
	$text = array();
	$file = fopen("../data/test.csv","r");
	while(! feof($file))
	  {
	  	$temp = fgetcsv($file);
	  	array_push($text, ["datetime" => $temp[0], "p" => $temp[1], "temp" => $temp[2], "rh" => $temp[3], "wv" => $temp[4], "rain" => $temp[5]]);
	  }
	fclose($file);
	echo json_encode($text);
?> 