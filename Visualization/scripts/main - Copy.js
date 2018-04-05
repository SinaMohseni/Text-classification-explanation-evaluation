    var dataR
    var dataL
  
    var div = d3.select("body").append("div").attr("class", "toolTip");
  
    var axisMargin = 0,
            margin = 0,
            valueMargin = 4,
            width = parseInt(d3.select('body').style('width'), 10),
            height = parseInt(d3.select('body').style('height'), 10),
            barHeight = (height-axisMargin-margin*2)* 0.2/10, //dataR.length,
            barPadding = (height-axisMargin-margin*2)*0.05/10, //dataR.length,
            dataR, bar, svg, scale, xAxis, labelWidth = 0,
            center = (width/2), labelmargin = 2;

      
    criminalRecords();
    loanApplication();



    function criminalRecords() {

     
    total_weights = 0
    jsonfile = "data/P1-crime.json"
    criminal_list = "data/list.csv"

        dataR = [
        {label:"Age", value:0},
        {label:"Marriage", value:0},
        {label:"Education", value:0},
        {label:"Race", value:0},
        {label:"Alcohol", value:0},
        {label:"Junky", value:0},
        {label:"Supervised", value:0},
        {label:"Work", value:0},
        {label:"Felony", value:0},
        {label:"Property", value:0},
        {label:"Person", value:0},
        {label:"Prior Arrests", value:0},
        {label:"Prison Violation", value:0},
        {label:"Time Served", value:0}
        ];
    ii = 0

    d3.csv(criminal_list,function(user) {
        
        
        for (ii = 0; ii < user.length;ii++){  // all participants
            console.log(user[ii].criminal)
            // console.log(user)
            jsonfile = "data/"+user[ii].criminal+".json"
            d3.json(jsonfile,function(d) {
         
                for (var i = 0; i < d.length;i++){  // all articles
                    for (var j = 0; j < d[i].word.length;j++){  // check decisions
                        

                        this_record = d[i].word[j];
                        // $.grep(dataR, function(obj){return obj.label === "Total";})[0].value +=1
                        total_weights +=1;
                        if (this_record.substring(0, 5) == "Marri"){
                        } else if (this_record.substring(0, 5) == "Age ="){
                            $.grep(dataR, function(obj){return obj.label === "Age";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Years "){
                            $.grep(dataR, function(obj){return obj.label === "Education";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Race "){
                            $.grep(dataR, function(obj){return obj.label === "Race";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Alcoh"){
                            $.grep(dataR, function(obj){return obj.label === "Alcohol";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Junky"){
                            $.grep(dataR, function(obj){return obj.label === "Junky";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Super"){
                            $.grep(dataR, function(obj){return obj.label === "Supervised";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Work "){
                            $.grep(dataR, function(obj){return obj.label === "Work";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Felon"){
                            $.grep(dataR, function(obj){return obj.label === "Felony";})[0].value +=1
                        } else if (this_record.substring(14, 23) == "Property"){
                            $.grep(dataR, function(obj){return obj.label === "Property";})[0].value +=1
                        } else if (this_record.substring(14, 21) == "Person"){
                            $.grep(dataR, function(obj){return obj.label === "Person";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Numbe"){
                            $.grep(dataR, function(obj){return obj.label === "Prior Arrests";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Priso"){
                            $.grep(dataR, function(obj){return obj.label === "Prison Violation";})[0].value +=1
                        }else{ //} else if (this_record.substring(0, 5); == "Time "){
                            $.grep(dataR, function(obj){return obj.label === "Time Served";})[0].value +=1
                        }
                    
                    }
                }
                
             
                
                d3.json(jsonfile,function(d) {
                    
                    dataL = [
                        {label:"Age", value:10},
                        {label:"Marriage", value:10},
                        {label:"Education", value:10},
                        {label:"Race", value:10},
                        {label:"Alcohol", value:10},
                        {label:"Junky", value:10},
                        {label:"Supervised", value:10},
                        {label:"Work", value:10},
                        {label:"Felony", value:10},
                        {label:"Property", value:10},
                        {label:"Person", value:10},
                        {label:"Prior Arrests", value:10},
                        {label:"Prison Violation", value:10},
                        {label:"Time Served", value:10}
                    ];

                       console.log(user)
                // rightwing(dataR, total_weights);  
 
               d3.selectAll(".svg1").remove();

               svg = d3.select('body')
                    .append("svg")
                    .attr("class", "svg1")
                    .attr("width", width)
                    .attr("height", height);

                rightwing(svg,dataR,total_weights)

                    leftwing(svg,dataL);

                });  // End of Machine results (left)


            });  // End of User results (right)

        }

    }); // End of all participants
    
    
    

    } // End of criminal records


    


    function loanApplication() {

     
    total_weights = 0
    jsonfile = "data/P1-crime.json"
    criminal_list = "data/list.csv"

        dataR = [
        {label:"Age", value:0},
        {label:"Marriage", value:0},
        {label:"Education", value:0},
        {label:"Race", value:0},
        {label:"Alcohol", value:0},
        {label:"Junky", value:0},
        {label:"Supervised", value:0},
        {label:"Work", value:0},
        {label:"Felony", value:0},
        {label:"Property", value:0},
        {label:"Person", value:0},
        {label:"Prior Arrests", value:0},
        {label:"Prison Violation", value:0},
        {label:"Time Served", value:0}
        ];
    ii = 0

    d3.csv(criminal_list,function(user) {
        
        
        for (ii = 0; ii < user.length;ii++){  // all participants
            console.log(user[ii].criminal)
            // console.log(user)
            jsonfile = "data/"+user[ii].criminal+".json"
            d3.json(jsonfile,function(d) {
         
                for (var i = 0; i < d.length;i++){  // all articles
                    for (var j = 0; j < d[i].word.length;j++){  // check decisions
                        

                        this_record = d[i].word[j];
                        // $.grep(dataR, function(obj){return obj.label === "Total";})[0].value +=1
                        total_weights +=1;
                        if (this_record.substring(0, 5) == "Marri"){
                        } else if (this_record.substring(0, 5) == "Age ="){
                            $.grep(dataR, function(obj){return obj.label === "Age";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Years "){
                            $.grep(dataR, function(obj){return obj.label === "Education";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Race "){
                            $.grep(dataR, function(obj){return obj.label === "Race";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Alcoh"){
                            $.grep(dataR, function(obj){return obj.label === "Alcohol";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Junky"){
                            $.grep(dataR, function(obj){return obj.label === "Junky";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Super"){
                            $.grep(dataR, function(obj){return obj.label === "Supervised";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Work "){
                            $.grep(dataR, function(obj){return obj.label === "Work";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Felon"){
                            $.grep(dataR, function(obj){return obj.label === "Felony";})[0].value +=1
                        } else if (this_record.substring(14, 23) == "Property"){
                            $.grep(dataR, function(obj){return obj.label === "Property";})[0].value +=1
                        } else if (this_record.substring(14, 21) == "Person"){
                            $.grep(dataR, function(obj){return obj.label === "Person";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Numbe"){
                            $.grep(dataR, function(obj){return obj.label === "Prior Arrests";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Priso"){
                            $.grep(dataR, function(obj){return obj.label === "Prison Violation";})[0].value +=1
                        }else{ //} else if (this_record.substring(0, 5); == "Time "){
                            $.grep(dataR, function(obj){return obj.label === "Time Served";})[0].value +=1
                        }
                    
                    }
                }
             

                jsonfile = "data/P1-crime.json"
                d3.json(jsonfile,function(d) {
                    
                    dataL = [
                        {label:"Age", value:10},
                        {label:"Marriage", value:10},
                        {label:"Education", value:10},
                        {label:"Race", value:10},
                        {label:"Alcohol", value:10},
                        {label:"Junky", value:10},
                        {label:"Supervised", value:10},
                        {label:"Work", value:10},
                        {label:"Felony", value:10},
                        {label:"Property", value:10},
                        {label:"Person", value:10},
                        {label:"Prior Arrests", value:10},
                        {label:"Prison Violation", value:10},
                        {label:"Time Served", value:10}
                    ];


                console.log(user)
 
               d3.selectAll(".svg2").remove();

               svg2 = d3.select('body')
                    .append("svg")
                    .attr("class", "svg2")
                    .attr("width", width)
                    .attr("height", height);

                rightwing(svg2, dataR,total_weights)
                    leftwing(svg2, dataL);

                });  // End of Machine results (left)


            });  // End of User results (right)

        }

    }); // End of all participants
    
    
    

    } // End of criminal records


    
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
    