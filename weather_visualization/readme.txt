// INDEX.HTML
canvas 	"myCanvas"
div 	"slider"
div		"add_year"
div		"popup"
input	"year_input_1"
div		"tooltip"
canvas 	"graphCanvas"


// VIEW.JS
initControls(callBack)
CountElementsOfYear(year)
Slider(year)
toRadians(angle)
Polygon(p1, p2, p3, p4, slider)
createPolygon(angle1, angle2, value, slider)
drawCircle(x, y, radius, color, context)
drawGraphs(key)
drawLabel(trans, rota, text, color)
updateBars()

// CONTROLLER.JS
start()
existSlider(year)
createSlider()
calculateAverage(date, callBack)
getValueFromIndex(averObj, i)
getKeyFromIndex(averObj, i)
saveMinMax(key)
valuesAsPercent(value, key)
prepareData(data, callBack)
stringToDate(str)
stringToNumber(str)
Record(datetime, temp, rain, wv, p, rh)
twoDigits(d)


// MODEL.JS
loadData(callBack, years)

// READCSV.PHP
