var margin = {top: 10, right: 30, bottom: 90, left: 60},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
  
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var tooltip = d3.select("body").append("div")
	.style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#ffffff")
    .text("a simple tooltip");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv", function(data) {

var select = d3.select("#state")
   .attr('class','select')
    .on('change',onchange)

var options = select
  .selectAll('option')
    .data(d3.map(data, function(d){return d.state;}).keys())
    .enter()
	.append('option')
	.text(function (d) { return d; })
    .attr("value",function(d){return d;});

function onchange() {
	selectState = d3.select('select').property('value')
    d3.selectAll('svg').remove();
    svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    displayChart(data, selectState);
};

function filterData(data, s) {
	var fData = data.filter(function(d) {
        var year = d.date.substring(0,4);
        var month = d.date.substring(5,7);
        var day = d.date.substring(8,10);
    	return d.state == s && year == "2021" && month <= "07" && day == "01"
    });
   
	return fData;
};

displayChart(data, selectState);

function displayChart(data, selectState) {
    var stateData = filterData(data, selectState);
    console.log(stateData);
    stateData.forEach(function(d) {
        d.cases = d.cases/1000;
        var year = d.date.substring(0,4);
        var month = d.date.substring(5,7);
        var day = d.date.substring(8,10);
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var monthValue = months[parseInt(month) - 1];
        d.date = monthValue;
    });
    // X axis
     var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(d3.map(stateData, function(d){return d.date;}).keys())
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    var casesMin = d3.min(stateData, function(d) { return d.cases; } );
    var casesMax = d3.max(stateData, function(d) { return d.cases; } );
    console.log(casesMin, casesMax);

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, casesMax])
      .range([ height, 0])
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Add the text label for the Y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Cases(in 1000s)");

    // Bars
    svg.selectAll("mybar")
      .data(stateData)
      .enter()
      .append("rect")
        .attr("x", function(d) { 
        	return x(d.date);
        })
        .attr("width", x.bandwidth())
        .attr("fill", "#69b3a2")
        // no bar at the beginning thus:
        .attr("height", function(d) { return height - y(0); }) // always equal to 0
        .attr("y", function(d) { return y(0); })
        .on("mouseover", function(d){tooltip.text("Deaths:\n" + d.deaths); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    // Animation
    svg.selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", function(d) { return y(d.cases); })
      .attr("height", function(d) {  	
            return Math.max(height - y(d.cases), 0);
       })
      .delay(function(d,i){console.log(i) ; return(i*100)})
}
    });
