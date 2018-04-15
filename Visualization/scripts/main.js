    var dataR
    var dataL
  
    var div = d3.select("body").append("div").attr("class", "toolTip");
  
    var axisMargin = 0,
            margin = 0,
            valueMargin = 4,
            width = 500,
            height = 500,
            barHeight = (height-axisMargin-margin*2)* 0.2/10, //dataR.length,
            barPadding = (height-axisMargin-margin*2)*0.05/10; //dataR.length,
    var     dataR, bar, svg, scale, xAxis, labelWidth = 0,
            center = (width/2), labelmargin = 2;

        // width = parseInt(d3.select('body').style('width'), 10),
        // height = parseInt(d3.select('body').style('height'), 10);
    height = 300
    
    criminalRecords();
    loanApplication();
    apartmentpricing();
    text();
    
    // ----------------------- Machine results 
    function rightwing(svg,dataR,total_weights){

        labelWidth_array = []
        max = d3.max(dataR, function(d) { return d.value/total_weights; });

        barR = svg.selectAll("barR")
                .data(dataR)
                .enter()
                .append("g")   
                .attr("class", "barR")
                .attr("transform", function(d, i) {
                    return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                });
      
        barR.append("text")
                .attr("class", "label")
                .attr("y", barHeight / 2)
                .attr("x", center)
                .attr("dy", ".35em")
                .attr("fill", "black")
                .style("font-weight", "bold")
                .style("font-size", "80%")
                .text(function(d){
                    return d.label;
                })
                .each(function() {
                   labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                   labelWidth_array.push(this.getBBox().width)
                })
                .attr("dx", function(d,i){
                    return (labelWidth - labelWidth_array[i])/2;
                })

        scale = d3.scale.linear()
                .domain([0, max])
                .range([0, (width/2 - margin*2 - labelWidth)]);


        barR.append("rect")
                .attr("transform", "translate("+(labelWidth + center + labelmargin)+", 0)")
                .attr("height", barHeight)
                .attr("width", function(d){
                    return scale(d.value/total_weights);
                });

        barR.append("text")
                .attr("class", "value")
                .attr("y", barHeight / 2)
                .attr("dx", center-valueMargin + labelWidth) //margin right
                .attr("dy", ".35em") //vertical align middle
                .attr("text-anchor", "end")
                .text(function(d){
                    return ((d.value/total_weights).toFixed(2));
                })
                .attr("x", function(d){
                    var width = this.getBBox().width;
                    return Math.max(width + valueMargin, scale(d.value/total_weights));
                });

        barR.on("mousemove", function(d){
                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    div.html((d.label)+"<br>"+(100*d.value/total_weights).toFixed(2)+"%"+"<br>"+(d.value)+" times");
                });
        barR.on("mouseout", function(d){
                    div.style("display", "none");
                });

    }
    
    // -------------------- User results 
    function leftwing(svg,dataL){

        max = d3.max(dataL, function(d) { return d.value; });

        barL = svg.selectAll("barL")
                .data(dataL)
                .enter()
                .append("g")     
                .attr("class", "barL")
                .attr("cx",0)
                // .attr("cx",0)
                .attr("transform", function(d, i) {
                    return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                });
     
        scale = d3.scale.linear()
                .domain([0, max])
                .range([0, (width/2 - margin*2 - labelWidth)]);

        barL.append("rect")
                .attr("transform", function(d){
                    return "translate("+( center - scale(d.value) - labelmargin )+", 0)"
                })
                .attr("fill", "orange")
                .attr("height", barHeight)
                .attr("width", function(d){
                    return scale(d.value);
                });

        barL.append("text")
                .attr("class", "value")
                .attr("y", barHeight / 2)
                .attr("dx", function(d){
                    var this_width = this.getBBox().width;
                    return (valueMargin);
                })
                .attr("dy", ".35em") //vertical align middle
                .attr("text-anchor", "end")
                .text(function(d){
                    return (d.value);
                })
                .attr("x", function(d){
                    var this_width = this.getBBox().width;
                    return (center - scale(d.value) + this_width)
                });

        barL.on("mousemove", function(d){
                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    div.html((d.label)+"<br>"+(d.value));
                });
        barL.on("mouseout", function(d){
                    div.style("display", "none");
                });

    }
    