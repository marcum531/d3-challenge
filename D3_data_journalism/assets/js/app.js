// @TODO: YOUR CODE HERE!
var svgHeight = 900;
var svgWidth = 600;

var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight-chartMargin.top - chartMargin.bottom;

var svg = d3.select("div")
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g").attr("transform",`translate(${chartMargin.left}, ${chartMargin.top})`);

var xaxis = "poverty";
var yaxis = "obesity";

function xScale(stateData, xaxis) {
    var x = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.poverty)* 1.2])
    .range([0, chartWidth]);

    return x;
}

function yScale(stateData, yaxis) {
    var y = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.obesity) * 1.2])
    .range([chartHeight, 0]);

    return y;
}

d3.csv("assets/data/data.csv").then(function(stateData){
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        console.log(stateData);
    });
}).catch(function(error) {
    console.log(error);




svg.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(x));



svg.append("g")
    .call(d3.axisLeft(y));

svg.append("g")
    .selectAll("dot")
    .data(stateData)
    .enter()
    .append("circle")
        .attr("cx", function(d){
            return x(d.poverty);
        })
        .attr("cy", function(d) {
            return y(d.obesity);
        })
        .attr("r", 1.5)
        .style("fill", d.abbr);
    });
