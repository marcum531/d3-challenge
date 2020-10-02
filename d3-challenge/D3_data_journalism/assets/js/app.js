// @TODO: YOUR CODE HERE!
let svgWidth = 900;
let svgHeight = 600;


let chartMargin = {
    top: 30,
    right: 40,
    bottom: 150,
    left: 150
};

let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgHeight-chartMargin.top - chartMargin.bottom;

let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g").attr("transform",`translate(${chartMargin.left}, ${chartMargin.top})`)

let chooseXAxis = "poverty";
let chooseYAxis = "healthcare";

function xScale(statedata, chooseXAxis) {
    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(statedata, d => d[chooseXAxis])* 0.8,
      d3.max(statedata, d=> d[chooseXAxis])*1.2
    ])
    .range([0, chartWidth]);

    return xLinearScale;
}

function yScale(statedata, chooseYAxis) {
    let yLinearScale = d3.scaleLinear()
    .domain([d3.min(statedata, d => d[chooseYAxis]) * 0.8,
      d3.max(statedata, d=> d[chooseYAxis])*1.2
    ])
    .range([chartHeight, 0]);

    return yLinearScale;
}

function renderXAxis(xScaleNew, xaxis) {
    let bottomAxis = d3.axisBottom(xScaleNew);

    xaxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xaxis;
}

function renderYAxis(yScaleNew, yaxis)  {
    let leftAxis = d3.axisLeft(yScaleNew);
    yaxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yaxis;
}

function renderCircles(circlesGroup, xScaleNew, chooseXAxis, yScaleNew, chooseYAxis) {
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

function updateTooltip(chooseXAxis, chooseYAxis, circlesGroup) {

    if (chooseXAxis === "poverty") {
        var xLabel = "Poverty: ";
    }

    else if (chooseXAxis === "age") {
        var xLabel = "Age: ";
    }

    else {
        var xLabel = "Income: $";
    }

    if (chooseYAxis === "healthcare") {
        var yLabel = "Healthcare: ";
    }

    else if (chooseYAxis === "smokes") {
        var yLabel = "Smoke: ";
    }

    else {
        var yLabel = "Obesity: ";
    }

    // Creating the tooltip 
    
    var toolTip = d3.tip()
        .attr("class", "d3-tip") // get fromat from d3Style.css
        // .attr("text-anchor", "middle")
        .style("font-size", "8px")
        // .style("font-weight", "bold")
        // .style("fill", "black")
        // .style("opacity", "0.8")
        // .offset([10,-30])
        .html(function(tip){return(`${tip.state}<br>${xLabel} ${formatAxis(tip[chooseYAxis], chooseYAxis)} <br> 
        ${yLabel} ${formatAxis(tip[chooseYAxis], chooseYAxis)} `) // 
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })

    // on mouse out event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// function to format x tip
function formatAxis(axisValue, chosenXAxis, chooseYAxis) {
    
    // Make the style of adding % and $ where needed
    if (chosenXAxis == "poverty"){
        return `${axisValue} %`;
        
    }

    else if(chosenXAxis == "age") {
        return `${axisValue}`;
        
    }

    else if(chosenXAxis == "income"){
        return `${axisValue}`;
    }

    // choosing y labels

    else if(chooseYAxis == "healthcare"){
        return `${axisValue} %`;
    }

    else if(chooseYAxis == "smokes") {
        return `${axisValue} %`;
    }

    else {
        return `${axisValue} %`;
    }

}

d3.csv("assets/data/data.csv").then(function(statedata, err) {
    if (err) throw err;
    console.log(statedata);
    statedata.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;

    });

    let xLinearScale = xScale(statedata, chooseXAxis);
    let yLinearScale = yScale(statedata, chooseYAxis);

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    let xaxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    let yaxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    
    // let dataGroup = chartGroup.selectAll("g")
    //     .data(statedata)
    //     .enter()
    //     .append("g")
    //     .classed("circles", true);

    let circlesGroup = chartGroup.selectAll("circle")
        .data(statedata)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", xx => xLinearScale(xx[chooseXAxis]))
        .attr("cy", yy => yLinearScale(yy[chooseYAxis]))
        .attr("r", 12)
        // .attr("fill", "yellow")
        .attr("opacity", "0.5");

    // let circleLabel= chartGroup.selectAll("abbr")
    //     .data(statedata)
    //     .enter()
    //     .append("text")
    //     .text(d => d.abbr)
    //     .attr("class", "stateText")  // get format from d3Style.css
    //     .attr("cx", xx => xLinearScale(xx[chosenXAxis]))
    //     .attr("cy", yy => yLinearScale(yy[chosenYaxis]))
    //     .attr("font-size", "8px")


    let circleLabel = chartGroup.selectAll("abbr")
        .data(statedata)
        .enter()
        .append ("text")
        .text(d => d.abbr)
        .attr("class", "stateText")
        // .attr("alignment-baseline", "middle")
        .attr("stroke", "black")
        .attr("x", xx=> xLinearScale(xx[chooseXAxis]))
        .attr("y", yy => yLinearScale(yy[chooseYAxis]))
        .attr("font-size", "8px");
    
    let xaxisLabels = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`);
    
    let povertyLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");
    
    let ageLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    let incomeLabel = xaxisLabels.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Income (Median)");


    let yaxisLabels = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
    

    
    let healthLabel = yaxisLabels.append("text")
        .attr("value", "healthcare")
        .attr("dx", "-10em")
        .attr("dy", "-2em")
        .classed("active", true)
        .text("Without Healthcare (%)");

    let smokesLabel = yaxisLabels.append("text")
        .attr("value", "smokes")
        .attr("dx", "-10em")
        .attr("dy", "-4em")
        .classed("inactive", true)
        .text("Smokers (%)");
    
    let obesityLabel = yaxisLabels.append("text")
        .attr("value", "obesity")
        .attr("dx", "-10em")
        .attr("dy", "-6em")
        .classed("inactive", true)
        .text("Obesity (%)");
        
    // let circlesGroup = updateTooltip(circlesGroup, chooseXAxis, chooseYAxis);

    xaxisLabels.selectAll("text")
        .on("click", function () {
            let xvalue = d3.select(this).attr("value");
            
            if (xvalue !== chooseXAxis) {
                chooseXAxis = xvalue;

                xLinearScale = xScale(statedata, chooseXAxis);

                xaxis = renderXAxis(xLinearScale, xaxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                circlesGroup = updateTooltip(chooseXAxis, chooseYAxis, circlesGroup);

                circleLabel = renderText(circleLabel, xLinearScale, chooseXAxis, yLinearScale,chooseYAxis);

                if (chooseXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

                else if (chooseXAxis === "income") {
                    incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
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
            let yvalue = d3.select(this).attr("value");

            if (yvalue !== chooseYAxis) {
                chooseYAxis = yvalue;

                yLinearScale = yScale(statedata, chooseYAxis);

                yaxis = renderYAxis(yLinearScale, yaxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                circlesGroup = updateTooltip(chooseXAxis, chooseYAxis, circlesGroup);

                circleLabel = renderText(circleLabel, xLinearScale, chooseXAxis, yLinearScale, chooseYAxis);

                if (chooseYAxis === "smokes") {
                    smokesLabel                      
                    .classed("active", true)
                    .classed("inactive", false);
                    healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    obesityLabel
                    .classed("active", false)
                    classed("inactive", true);
                }

                else if (chooseYAxis === "obesity") {
                    smokesLabel                      
                    .classed("active", false)
                    .classed("inactive", true);
                    healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }

                else {
                    smokesLabel                      
                    .classed("active", false)
                    .classed("inactive", true);
                    healthLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
            }
        })

}).catch(function(error) {
 console.log(error);
});