let svg = d3.select("body").append("svg")
	.attr("width", 850)
	.attr("height", 400);

//store the width and height for later
let width = +svg.attr("width");
let height = +svg.attr("height");

//render the data
function render(data) {

	let xVal = d => d.date; //gets the date for a value d
	let yVal = d => d.deaths; //gets the cases amount for a value d

	//set the margins
	let margin = {
		top: 100,
		right: 150,
		bottom: 100,
		left: 325
	};

	//these set the width and height of the inner chart
	let innerWidth = width - margin.left - margin.right;
	let innerHeight = height - margin.top - margin.bottom;

	/*

	SET UP SCALES

	*/

	let scaleX = d3.scaleTime() //sets up how dates will scale
		.domain([d3.min(data, xVal), d3.max(data, xVal)]).nice() //the data space, but nice() rounds it cleanly
		.range([0, innerWidth]); //the pixel space

	let xAxis = d3.axisBottom(scaleX) //the bottom axis is connected to the scaleX now
		.tickSize(-innerHeight)
		.tickPadding(20)
		.ticks(12)
		.tickFormat(d3.timeFormat("%b"));

	let scaleY = d3.scaleLinear() //sets up how cases, y axis values will scale
		.domain([0, d3.max(data, yVal)]).nice()
		.range([innerHeight, 0])

	let yAxis = d3.axisLeft(scaleY) //left axis is connected to the scaleY now
		.tickPadding(20)
		.tickSize(-innerWidth);

	let g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`); //moves the chart out into clear space

	let yG = g.append("g") //adds a grouping for the cases, y axis
		.call(yAxis)
		.attr("font-size", 16); //size of number of cases labels

	yG.append("text") //add the y axis label
		.attr("font-size", 22)
		.attr("fill", "black")
		.text("New Deaths")
		.attr("y", innerHeight / 2)
		.attr("x", -90);
	
	let xG = g.append("g") //adds another axis grouping for the x axis, sets up labels and ticks
		.call(xAxis)
		.attr("transform", `translate(0, ${innerHeight})`) //moves the dates to bottom
		.attr("font-size", 16);

	xG.append("text") //add the label below x axis
		.attr("font-size", 22)
		.attr("fill", "black")
		.text("Month")
		.attr("y", 70)
		.attr("x", innerWidth / 2);

	g.append("text") //adds another grouping for the name of the line chart
		.attr("font-family", "sans-serif")
		.text(desiredCode + " COVID-19 Deaths - 2022")
		.attr("font-size", 26)
		.attr("y", -20)
		.attr("x", innerWidth / 4);

	/*

	DRAW THE LINE

	*/

	let line = d3.line() //defines the x and y of the line
		.x(d => scaleX(xVal(d)))
		.y(d => scaleY(yVal(d)));

	g.append("path") //add the line or path
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "#00A15F")
		.attr("stroke-width", 2)
		.attr("stroke-linejoin", "round") //smooths line a bit
		.attr("stroke-linecap", "round") //smooths line a bit
		.attr("d", line); //call line to draw line
}
	

let desiredCode = "USA";
d3.csv("new_countries.csv", function(d) { //for each entry
	if (d["Location.Code"] == desiredCode && +d["Date.Year"] == 2022 && +d["Date.Month"] <= 7) {
		return {	//parse date from multiple entries
			date: d3.timeParse("%Y-%m-%d")(d["Date.Year"] + "-" + d["Date.Month"] + "-" + d["Date.Day"]),
			deaths: +d["Data.Deaths"]
		};
	}
}).then(function(data) {
	render(data); //then render the data as it has been fully processed
});
