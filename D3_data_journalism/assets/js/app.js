// @TODO: YOUR CODE HERE!
var svgHeight = 900;
var svgWidth = 600;

var chartMargin = {
    top: 30,
    right: 40,
    bottom: 150,
    left: 150
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight-chartMargin.top - chartMargin.bottom;

var svg = d3.select
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g").attr("transform",`translate(${chartMargin.left}, ${chartMargin.top})`);

var chooseXAxis = "poverty";
var chooseYAxis = "obesity";

function xScale(stateData, chooseXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chooseXAxis])*.8, d3.max(stateData, d => d[chooseXAxis])* 1.2])
    .range([0, chartWidth]);

    return xLinearScale;
}

function yScale(stateData, chooseYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chooseYAxis])*0.8, d3.max(data, d => d[chooseYAxis]) * 1.2])
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
        .attr("cx", xx => xScaleNew(xx[chooseXAxis]))
        .attr("cy", yy => yScaleNew(yy[chooseYAxis]));

    return circlesGroup;
}

function renderText(circlesTextGroup, xScaleNew, chooseXAxis, yScaleNew, chooseYAxis) {
    circlesTextGroup.transition()
        .duration(1000)
        .attr("x", xxx => xScaleNew(xxx[chooseXAxis]))
        .attr("y", yyy => yScaleNew(yyy[chooseYAxis]));

    return circlesTextGroup;
}

function updateTooltip (circlesGroup, chooseXAxis, chooseYAxis) {

    if (chooseXAxis === "poverty") {
        var xLabel = "Poverty: ";
    }

    else if (chooseXAxis === "age") {
        var xLabel = "Age: ";
    }

    else {
        var xLabel = "Income: $ ";
    }

    if (chooseYAxis === "obesity") {
        var yLabel = "Obesity: ";
    }

    else if (chooseYAxis === "healthcare") {
        var yLabel = "Without Healthcare: ";
    }

    else {
        var yLabel = "Smokers: ";
    }

    var tooltip = d3.tip()
        .attr("class", "d3-tip")
        .style("font-size", "8px")
        .offset([100, -60])
        .html(function(tip) {
            return (`${tip.state}<br>${xLabel} ${formatAxis(tip[chooseXAxis], chooseXAxis)}
            <br>
            ${yLabel} ${formatAxis(tip[chooseYAxis], chooseYAxis)}`)
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

function formatAxis(axisValue, chooseXAxis, chooseYAxis) {
    if (chooseXAxis == "poverty") {
        return `${axisValue} %`;
    }

    else if (chooseXAxis == "age") {
        return `${axisValue}`;
    }

    else if(chooseXAxis == "income"){
        return `${axisValue}`;
    }

    else if(chooseYAxis == "healthcare") {
        return `${axisValue} %`;
    }

    else if(chooseYAxis == "smokes") {
        return `${axisValue} %`;
    }

    else{
        return `${axisValue} %`;
    }
}

d3.csv("assets/data/data.csv").then(function(stateData, err) {
    if (err) throw err;
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;        
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.healthcareHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
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
    
    // var dataGroup = chartGroup.selectAll("g")
    //     .data(stateData)
    //     .enter()
    //     .append("g")
    //     .classed("circles", true);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", xx => xLinearScale(xx[chooseXAxis]))
        .attr("cy", yy => yLinearScale(yy[chooseYAxis]))
        .attr("r", 12)
        .attr("fill", "yellow")
        .attr("opacity", .5);

    var circleLabel = chartGroup.selectAll("abbr")
        .data(stateData)
        .enter()
        .append ("text")
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "8px")
        .attr("stroke", "black")
        .attr("x", xx => xLinearScale(xx[chooseXAxis]))
        .attr("y", yy => yLinearScale(yy[chooseYAxis]));
    
    var xaxisLabels = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`);
    
    var povertyLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");
    
    var ageLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Income (Median)");
    
    var yaxisLabels = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2));
    
    var obesityLabel = yaxisLabels.append("text")
        .attr("value", "obesity")
        .attr("dx", "-10em")
        .attr("dy", "-6em")
        .classed("active", true)
        .text("Obesity (%)");
    
    var healthLabel = yaxisLabels.append("text")
        .attr("dx", "-10em")
        .attr("dy", "-2em")
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Without Healthcare (%)");

    var smokesLabel = yaxisLabels.append("text")
        .attr("dx", "-10em")
        .attr("dy", "-4em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokers (%)");
    
    //var circlesGroup = updateTooltip(circlesGroup, chooseXAxis, chooseYAxis);

    xaxisLabels.selectAll("text")
        .on("click", function () {
            var xvalue = d3.select(this).attr("value");
            
            if (xvalue !== chooseXAxis) {
                chooseXAxis = xvalue;

                xLinearScale = xScale(stateDate, chooseXAxis);

                xaxis = renderXAxis(xLinearScale, xaxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                circlesGroup = updateTooltip(circlesGroup, chooseXAxis, chooseYAxis);

                circleLabel = renderText(circleLabel, xLinearScale, chooseXAxis, chooseYAxis);

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
            
        })

    yaxisLabels.selectAll("text")
        .on("click", function() {
            var yvalue = d3.select(this).attr("value");

            if (yvalue !== chooseYAxis) {
                chooseYAxis === yvalue;

                yLinearScale = yScale(stateData, chooseYAxis);

                yaxis = renderYAxis(yLinearScale, yaxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                circlesGroup = updateTooltip(circlesGroup, chooseXAxis, chooseYAxis);

                circleLabel = renderText(circleLabel, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

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
        })
    }).catch(function(error) {
        console.log(error)
    });
        
    
