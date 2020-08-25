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

function renderXAxis(xScaleNew, xaxis) {
    var bottomAxis = d3.bottomAxis(xScaleNew);

    xaxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xaxis;
}

function renderYAxis(yScaleNew, yaxis)  {
    var leftAxis = d3.axisLeft(yScaleNew);

    yaxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yaxis;
}

function renderCircles(circlesGroup, xScaleNew, yScaleNew, xaxis, yaxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xScaleNew(d[xaxis]))
        .attr("cy", d => yScaleNew(d[yaxis]));

    return circlesGroup;
}

function renderText(circlesTextGroup, xScaleNew, yScaleNew, xaxis, yaxis) {
    circlesTextGroup.transition()
        .duration(1000)
        .attr("x", d => xScaleNew(d[xaxis]))
        .attr("y", d => yScaleNew(d[yaxis]));

    return circlesTextGroup;
}

function updateTooltip (circlesGroup, xaxis, yaxis) {

    if (xaxis === "poverty") {
        var xLabel = "Poverty (%): ";
    }

    else if (xaxis === "age") {
        var xLabel = "Age (Median): ";
    }

    else {
        var xLabel = "Income (Median): $ ";
    }

    if (yaxis === "obesity") {
        var yLabel = "Obesity (%): ";
    }

    else if (yaxis === "healthcare") {
        var yLabel = "Without Healthcare (%): ";
    }

    else {
        var yLabel = "Smokers (%): ";
    }

    var tooltip = d3.tip()
        .attr("class", "tooltip")
        .offset([100, -60])
        .html(d => {
            return (`${d.state}`) (${d.abbr})
            <br>
            ${yLabel} ${d[yaxis]}
            <br>
            ${xLabel} ${d[xaxis]}`);
        });

    circlesGroup.call(tooltip);

    circlesGroup
        .on("mouseover", function (data) {
            tooltip.show(data);            
        })
        .on("mouseout", function (data, index) {
        tooltip.hide(data);
        });
        return circlesGroup;
};

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

    var xLinearScale = xScale(stateData, xaxis);
    var yLinearScale = yScale(stateData, yaxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xaxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var yaxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    
    var dataGroup = chartGroup.selectAll("g")
        .data(stateData)
        .enter()
        .append("g")
        .classed("circles", true);

    var circlesGroup = dataGroup.append("circle")
        .data(stateData)
        .enter()
        .attr("cx", d => xLinearScale(d[xaxis])
        .attr("cy", d => yLinearScale(d[yaxis])
        .attr("r", 20)
        .attr("fill", "yellow")
        .attr("opacity", ".5");

    var circleLabel = chartGroup.selectAll(".circles")
        .append ("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "8px")
        .attr("stroke", "black")
        .attr("x", d => xLinearScale(d[xaxis]))
        .attr("y", d => yLinearScale(d[yaxis]));
    
    var xaxisLabels = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 25})`);
    
    var povertyLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");
    
    var ageLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Income (Median)");
    });

    var yaxisLabels = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
    
    var obesityLabel = yaxisLabels.append("text")
        .attr("x", 0-(chartHeight/2))
        .attr("y", 0-(margin.left/3))
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity (%)");
    
}).catch(function(error) {
    console.log(error);

