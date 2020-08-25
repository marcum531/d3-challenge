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

var chooseXAxis = "poverty";
var chooseYAxis = "obesity";

function xScale(data, xchooseXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[chooseXAxis])* 1.2])
    .range([0, chartWidth]);

    return xLinearScale;
}

function yScale(data, chooseYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[chooseYAxis]) * 1.2])
    .range([chartHeight, 0]);

    return yLinearScale;
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

function renderCircles(circlesGroup, xScaleNew, yScaleNew, chooseXAxis, chooseYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xScaleNew(d[chooseXAxis]))
        .attr("cy", d => yScaleNew(d[chooseYAxis]));

    return circlesGroup;
}

function renderText(circlesTextGroup, xScaleNew, yScaleNew, chooseXAxis, chooseYAxis) {
    circlesTextGroup.transition()
        .duration(1000)
        .attr("x", d => xScaleNew(d[chooseXAxis]))
        .attr("y", d => yScaleNew(d[chooseYAxis]));

    return circlesTextGroup;
}

function updateTooltip (circlesGroup, chooseXAxis, chooseYAxis) {

    if (chooseXAxis === "poverty") {
        var xLabel = "Poverty (%): ";
    }

    else if (chooseXAxis === "age") {
        var xLabel = "Age (Median): ";
    }

    else {
        var xLabel = "Income (Median): $ ";
    }

    if (chooseYAxis === "obesity") {
        var yLabel = "Obesity (%): ";
    }

    else if (chooseYAxis === "healthcare") {
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
            ${yLabel} ${d[chooseYAxis]}
            <br>
            ${xLabel} ${d[chooseXAxis]}`);
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

d3.csv("assets/data/data.csv").then(function(stateData) {
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        console.log(stateData);
    });

    var xLinearScale = xScale(stateData, chooseXAxis);
    var yLinearScale = yScale(stateData, chooseYAxis);

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
        .attr("cx", d => xLinearScale(d[chooseXAxis])
        .attr("cy", d => yLinearScale(d[chooseYAxis])
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
        .attr("x", d => xLinearScale(d[chooseXAxis]))
        .attr("y", d => yLinearScale(d[chooseYAxis]));
    
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
    
    var healthLabel = yaxisLabels.append("text")
        .attr("x", 0-(chartHeight/2))
        .attr("y", -10-(margin.left/3))
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Without Healthcare (%)");

    var smokesLabel = yaxisLabels.append("text")
        .attr("x", 0-(chartHeight/2))
        .attr("y", -30-(margin.left/3))
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokers (%)");
    
    var circlesGroup = updateTooltip(circlesGroup, chooseXAxis, chooseYAxis);

    xaxisLabels.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");
            
            if (value !== chooseXAxis) {
                chooseXAxis = value;

                xLinearScale = xScale(stateDate, chooseXAxis);

                xaxis = renderXAxis(xLinearScale, xaxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                circlesGroup = updateTooltip(circlesGroup, chooseXAxis, chooseYAxis);

                circleLabel = renderLabels(circleLabel, xLinearScale, chooseXAxis, chooseYAxis);

                if (chooseXAxis === "age") {
                    ageLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                }

                else if (chooseXAxis === "income") {
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", true).classed("inactive", false);
                    povertyLabel.classed("active", false).classed("inactive", true);
                }

                else {
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", true).classed("inactive", false);
                }
            }
            
        });

    yaxisLabels.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");

            if (value !== chooseYAxis) {
                chooseYAxis === value;

                yLinearScale = yScale(stateData, chooseYAxis);

                yaxis = renderYAxis(yLinearScale, yaxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                circlesGroup = updateTooltip(circlesGroup, chooseXAxis);

                circleLabel = renderLabels(circleLabel, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                if (chooseYAxis === "healthcare") {
                    healthLabel.classed("active", true).classed("inactive", false);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    obesityLabel.classed("active", false).classed("inactive", true);
                }

                else if (chooseYAxis === "smokes") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    smokesLabel.classed("active", true).classed("inactive", false);
                    obesityLabel.classed("active", false).classed("inactive", true);
                }

                else {
                    healthLabel.classed("active", false).classed("inactive", true);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    obesityLabel.classed("active", true).classed("inactive", false);
                }
            }
        });
    
}).catch(function(error) {
    console.log(error);
});
