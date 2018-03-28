
var div1 = d3.select("body").append("talkbubble")   // Tooltip
		.attr("class", "tooltip")
		.style("opacity", 1)
		.style("position", "absolute")
		.style("text-align", "center")
		.style("width", 100)
		.style("height", 48)
		.style("border-radius", "8px")   // "10% / 10%")
		.style("padding", 2)
		.style("font-size", 12)
		.style("background", "lightblue") // "#1e90ff")
		.style("border", 3)
		.style("pointer-events", "none");

   var output;
   // var height = 500;
    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
  
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

var txtfiles = []
var readfiles = []
var articleName;
var sampleName;
var tabular_data;
var data_pointer = -1;
var dataset_name = "housing"
var call_once = 0;
var total_doc;
var doc_num;
var attributes=[];
var values=[];

function load_dataset(){
	// attributes=[];
	// values=[];	

	dataset_name = getCookie("user_selection")
	console.log("dataset ", dataset_name)
	articleName = dataset_name;
	var file_path = "data/"+dataset_name+"/"+dataset_name+".csv";

	d3.csv(file_path, function(data) {
	  tabular_data = data;
	  console.log("1 >> ", data[0]);
	  total_data = data.length;

	 // tabular_data.map(function(d){
     //            attributes.push(d.fico_range_high);
     //            values.push(+d.fico_range_low);
     //    })
	  nextData();
	  article_title(dataset_name);
	})
	
	
	// $.ajax({
	//     url : folder,
	//     success: function (data) {
	//         $(data).find("a").attr("href", function (i, val) {
	//             // if ( val.match(/\.(gif)$/) == 0){
	//             	this_file = val.split("");
	// 				// console.log(this_file.pop())	            	
	//             	// txtfiles.push(val)
	//             	if (this_file.pop() == "t"){  // if ((!isNaN(parseInt(this_file.pop(), 10))) & (this_file[0] == "/")){  ( !isNaN(parseInt(this_file.pop(), 10)) )
	//             		txtfiles.push(val)//txtfiles.push(val) // txtfiles.push(folder+val)
	//             	}
	//             // }
	//         });
	//         total_doc = txtfiles.length;
	//         console.log(txtfiles)
	// 		nextArticle();
	//     }
	// });

}



function start_over(){

    if (confirm("Are you sure you want to start over?") == true) {
	    results_json  = []
		exp_data = []
		saved = 1;
		readfiles = []
		// txtfilename();
		location.href="../expevl.html"
	}
}


function nextData() {
	data_pointer +=1;
	if (data_pointer > 19) data_pointer = 19
	showTable(0);
	article_title(dataset_name)

	if (saved == 0) save_json();
	exp_data = [];
}

function lastData() {

			if (saved == 0) save_json();
			exp_data = [];

			data_pointer -=1;
			if (data_pointer < 0) data_pointer = 0
 			showTable(0);
 			article_title(dataset_name)
}

var words_hash = []; 
var words_array = [];
var results_json = [];
var exp_data = []
var saved = 1;

function save_json(){  

		results_json.push({article: (dataset_name+"-"+data_pointer), word: exp_data})
		console.log(results_json)
		saved = 1;
}

function WriteFile(){

	if (saved == 0) save_json()

	var jsonContent = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results_json));
	var a = document.createElement('a');
	a.href = 'data:' + jsonContent;
	a.download = 'results.json';
	a.innerHTML = 'End Study';
	a.click();
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
	}


function article_title(articleName){
	if (articleName == "lendingclub"){
	explanation_title.text("Please highlight any reasons associated with the applicant that could relate to this loan application being: \""+tabular_data[data_pointer].loan_status+"\" ( "+ (data_pointer + 1)+" / "+ total_data + " )")
	} else if (articleName == "housing"){
	explanation_title.text("Please highlight any reasons causing this apartment's price to be $"+tabular_data[data_pointer].MEDV*1000+": ( "+ (data_pointer + 1)+" / "+total_data+ " )")
	} else {
	explanation_title.text("Please highlight any reasons associated with this prisoner's background that could relate to this prisoner "+(tabular_data[data_pointer].RECID == 0 ? "having \"No More Crime" : "being \"Re-arrested")+"\": ( "+ (data_pointer + 1)+" / "+total_data+ " )") 
	}
}

function showTable(update_content) {
	
	var myElement = document.createElement('chartDiv');
	myElement.style.userSelect = 'none';

	d3.dragDisable(window)

	for (var i = 0; i < 500; i++) {
	    svg.selectAll(".explanation-"+i.toString()).remove(); 
	    svg.selectAll(".boxes-"+i.toString()).remove(); 
    }
	svg.selectAll(".words").remove(); 
	
	if (update_content == 0){
		words_hash = []; 
		words_array = []; 
		// var line_array = output.split("\n");

		// for (var i = 0; i < tabular_data[data_pointer].length; i++) {
			// this_line = tabular_data[data_pointer].  // .split(" ");
		if (dataset_name == "lendingclub"){
			words_array.push("nextline");
			words_array.push("Loan Status = " + tabular_data[data_pointer].loan_status)
			words_array.push("nextline");
			words_array.push("nextline");

			words_array.push("Loan Amount = " + tabular_data[data_pointer].loan_amnt)
			words_array.push("nextline");
			words_array.push("Loan Term = " + tabular_data[data_pointer].term)
			words_array.push("nextline");
			words_array.push("Interest Rate = " + tabular_data[data_pointer].int_rate)
			words_array.push("nextline");
			words_array.push("Installment = " + tabular_data[data_pointer].installment)
			words_array.push("nextline");
			words_array.push("Loan Purpose = " + tabular_data[data_pointer].purpose)
			words_array.push("nextline");
			words_array.push("Application Type = " + tabular_data[data_pointer].application_type)
			words_array.push("nextline");
			words_array.push("nextline");
			
			words_array.push("Annual Income = " + tabular_data[data_pointer].annual_inc)
			words_array.push("nextline");
			words_array.push("Employment Title = " + tabular_data[data_pointer].emp_title)
			words_array.push("nextline");
			words_array.push("Employment Length = " + tabular_data[data_pointer].emp_length)
			words_array.push("nextline");
			words_array.push("Home Ownership = " + tabular_data[data_pointer].home_ownership)
			words_array.push("nextline");
			words_array.push("State = " + tabular_data[data_pointer].addr_state)
			words_array.push("nextline"); 
			words_array.push("nextline");
			
			words_array.push("Earliest Credit Line = " + tabular_data[data_pointer].earliest_cr_line)
			words_array.push("nextline");
			words_array.push("FICO Score High = " + tabular_data[data_pointer].fico_range_high)
			words_array.push("nextline");
			words_array.push("FICO Score Low = " + tabular_data[data_pointer].fico_range_low)
			words_array.push("nextline");
			words_array.push("Credit Inquiry in the last 6 months = " + tabular_data[data_pointer].inq_last_6mths)
			words_array.push("nextline");
			words_array.push("Number of Open Accounts = " + tabular_data[data_pointer].open_acc)
			words_array.push("nextline");
			words_array.push("Account Balance = " + tabular_data[data_pointer].revol_bal)
			words_array.push("nextline"); 
			words_array.push("Debt to Income Ratio (DTI) = " + tabular_data[data_pointer].dti)
			words_array.push("nextline"); 			

		}else if (dataset_name == "housing"){

			words_array.push("nextline");
			words_array.push("Home Value = $" + (tabular_data[data_pointer].MEDV*1000))
			words_array.push("nextline");
			words_array.push("nextline");

			words_array.push("Number of Rooms = " + tabular_data[data_pointer].RM)
			words_array.push("nextline");
			words_array.push("Weighted Distances to Five Boston Employment Centres = " + tabular_data[data_pointer].DIS)
			words_array.push("nextline");
			words_array.push("Index of Accessibility to Radial Highways = " + tabular_data[data_pointer].RAD)
			words_array.push("nextline");
			words_array.push("Full-value Property-tax Rate per $10,000 = " + tabular_data[data_pointer].TAX)
			words_array.push("nextline");
			words_array.push("nextline");

			words_array.push("Crime Rate (per capita) = " + tabular_data[data_pointer].CRIM)
			words_array.push("nextline");
			words_array.push("Proportion of Residential Land Zoned for Lots= " + tabular_data[data_pointer].ZN)
			words_array.push("nextline");
			words_array.push("Proportion of Non-retail Business Acres per Town = " + tabular_data[data_pointer].INDUS)
			words_array.push("nextline");
			words_array.push("River= " + tabular_data[data_pointer].CHAS)
			words_array.push("nextline");
			words_array.push("Nitric Oxides Concentration = " + tabular_data[data_pointer].NOX)
			words_array.push("nextline");
			words_array.push("Proportion of Owner-occupied Units Built = " + tabular_data[data_pointer].AGE)
			words_array.push("nextline");
			words_array.push("Pupil-teacher Ratio by Town = " + tabular_data[data_pointer].PTRATIO)
			words_array.push("nextline");
			// words_array.push(" 1000(Bk - 0.63)^2 where Bk is the proportion of blacks by town = " + tabular_data[data_pointer].B)
			// words_array.push("nextline");
			words_array.push("Percentage Lower Status of the Population = " + tabular_data[data_pointer].LSTAT)
			words_array.push("nextline");

			
			

		}else{

			words_array.push("nextline");
			words_array.push("Rearrested = " + (tabular_data[data_pointer].RECID == 0 ? "No More Crime" : "Re-arrested"))
			words_array.push("nextline");
			words_array.push("nextline");
			// index < data2.length ? dataString+ "\n" : dataString;
			
			words_array.push("Married = " + (tabular_data[data_pointer].MARRIED == 0 ? "No" : "Yes"))
			words_array.push("nextline");
			words_array.push("Age = " + Math.round(tabular_data[data_pointer].AGE/12))
			words_array.push("nextline");
			words_array.push("Years School = " + tabular_data[data_pointer].SCHOOL)
			words_array.push("nextline");			
			words_array.push("Race = " + (tabular_data[data_pointer].WHITE == 0 ? "African-American" : "White"))
			words_array.push("nextline");
			words_array.push("Alcohol = " + (tabular_data[data_pointer].ALCHY == 0 ? "No" : "Yes"))
			words_array.push("nextline");
			words_array.push("Junky = " + (tabular_data[data_pointer].JUNKY == 0 ? "No" : "Yes"))
			words_array.push("nextline");
			words_array.push("nextline");

			
			words_array.push("Supervised Release = " + (tabular_data[data_pointer].SUPER == 0 ? "No" : "Yes"))
			words_array.push("nextline");			
			words_array.push("Work Release = " + (tabular_data[data_pointer].WORKREL == 0 ? "No" : "Yes"))
			words_array.push("nextline");
			words_array.push("Felony = " + (tabular_data[data_pointer].FELON == 0 ? "No" : "Yes"))
			words_array.push("nextline");			
			words_array.push("Crime Against Property = " + (tabular_data[data_pointer].PROPTY == 0 ? "No" : "Yes"))
			words_array.push("nextline");
			words_array.push("Crime against Person = " + (tabular_data[data_pointer].PERSON == 0 ? "No" : "Yes"))
			words_array.push("nextline");
			words_array.push("Number Prior Arrests = " + (tabular_data[data_pointer].PRIORS == 0 ? "None" : Math.abs(tabular_data[data_pointer].PRIORS)))
			words_array.push("nextline");
			words_array.push("Prison Violations = " + (tabular_data[data_pointer].RULE == 0 ? "No" : "Yes"))
			words_array.push("nextline");			
			words_array.push("Time Served in Prison = " + tabular_data[data_pointer].TSERVD + " months")
			words_array.push("nextline");
		}


		for (var i = 0; i < words_array.length; i++){
			words_hash.push({word : words_array[i],
							x : 0,
							y : 0,
							w : 0})
		}
	}

				var letter_length = getWidthOfText(" ", "sans-serif", "12px"); 
				var box_height = 20;
				var x_pos = explanation_x; //  + clearance;
				var y_pos = explanation_y + box_height + clearance/3;
				var next_line = 25;
				var line_counter = 0;
				var box_words_alignment = 11;
				var exp_margin = 20;

				words_box = svg.selectAll(".boxes")
									.data(words_hash).enter().append("g").attr("class", "words");		

				words_box.append("rect")
					.attr("class",function(d,i){return "boxes-"+i.toString()})
					.each(function (d,i) {
						letters = d.word.split("")

						if (d.word == "nextline") {
							line_counter += 1;
							x_pos = explanation_x + clearance;
							y_pos = explanation_y + box_height + clearance/3 + line_counter*next_line;

							// d.word = ""

							d.x = x_pos;
							d.y = y_pos;
							d.w = getWidthOfText("", "sans-serif", "12px")
							x_pos = x_pos + d.w + letter_length;

						}else if ((x_pos + (letters.length * letter_length)) > (explanation_x + explanation_width - exp_margin)){
							line_counter += 1;
							x_pos = explanation_x + clearance/3;
							y_pos = explanation_y + box_height + clearance/3 + line_counter*next_line;

							d.x = x_pos;
							d.y = y_pos;
							d.w = getWidthOfText(d.word, "sans-serif", "12px")
							x_pos = x_pos + d.w + letter_length;

						}else{

							d.x = x_pos;
							d.y = y_pos;
							d.w = getWidthOfText(d.word, "sans-serif", "12px")
							x_pos = x_pos + d.w + letter_length;
						}

					})
					.attr("x", function(d,i){
						return d.x;})  
					.attr("y", function(d,i){
						return d.y - box_words_alignment;})  // + d.count*clearance + clearance })
					.attr("width", function(d){
						return d.w;})
					.attr("height", box_height)
					.attr("fill", function(d,i){ 
			       		if (update_content == 0) d.highlight = 0;
			       		if (d.highlight == 1) return "yellow"; 
			       		if (d.highlight == 2) return "lightgreen"; 
						return "white";
					})
					.attr("opacity", function(d,i) { 
						if (d.highlight == 1){
							return 1;	
						}else if (d.highlight == 2) {
							return 1;	
						}else{
							return 0;
						}
					});
			    

				var dragall = 0;
				var last_sample = 0;
				
				svg.on("mouseup", function(d){ dragall = 0})

				words_box.append("text")
					.attr("class","explanation")
					.attr("class",function(d,i){return "explanation-"+ i.toString()})
					.style("font-size", "12px")
				    .attr("x", function(d,i){
								return d.x})  
				    .attr("y", function(d,i){
								return d.y;})  // + d.count*clearance + clearance })
				    .attr("dy", ".35em")
				    .text(function(d) {
				    	if (d.word == "nextline") {
				    	return "";	
				    	}else{
				    	return d.word; 	
				    	}
				    	
				    })
				    .on("mouseover", function(d){
						var this_sample = d3.select(this).attr('class').split("-")[1]
						if (d.highlight == 0){
							svg.selectAll(".boxes-" + this_sample.toString())
								.attr("fill","yellow")
								.attr("opacity", 0.3);
						}
						svg.selectAll(".boxes-" + this_sample.toString()).moveToBack();
						
					})
					.on("mousemove", function(d){
						var this_sample = d3.select(this).attr('class').split("-")[1]
						if ((dragall == 1) & (this_sample != last_sample)){							

							if (d.highlight == 1){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("fill","lightgreen");

								// d.highlight = 2;

								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("opacity", 0);
								
								// d.highlight = 0;

							}else if (d.highlight == 2){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("opacity", 0);
								// d.highlight = 0;
							}else{
								d.highlight = 1;
								svg.selectAll(".boxes-" + this_sample.toString())
									.attr("fill","yellow")
									.attr("opacity", 1);
								// console.log({article: articleName, word: d.word, action: "add"})
								// results_json.push({article: articleName, word: d.word, action: "add"})
								saved = 0;
								exp_data.push(d.word)
							}
							 window.getSelection().removeAllRanges();
							 last_sample = this_sample 
						}
					})
					.on("mousedown", function(d){ 

						dragall = 1;
						var this_sample = d3.select(this).attr('class').split("-")[1]
						// if (this_sample == last_sample){
						
							if (d.highlight == 1){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("fill","lightgreen");

								// d.highlight = 2;

								svg.selectAll(".boxes-" + this_sample.toString())
									.attr("opacity", 0);
								d.highlight = 0;
								dragall = 0;
								// console.log({article: articleName, word: d.word, action: "remove"})
								// results_json.push({article: articleName, word: d.word, action: "remove"})
								index = exp_data.indexOf(d.word);
								if (index > -1) {
								    exp_data.splice(index, 1);
								}
								// exp_data.push(d.word)
								saved = 0

							}else if (d.highlight == 2){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("opacity", 0);
								
								// d.highlight = 0;

							}else{
								d.highlight = 1;
								svg.selectAll(".boxes-" + this_sample.toString())
									.attr("fill","yellow")
									.attr("opacity", 1);
									// console.log({article: articleName, word: d.word, action: "add"})
									// results_json.push({article: articleName, word: d.word, action: "add"})
									exp_data.push(d.word)
									saved = 0
							}
							 window.getSelection().removeAllRanges();
						// }else{
						// dragall = 1;	
						// }
						
					})
					.on("mouseup", function(d){ dragall = 0})
					.on("mouseout", function(d){
						var this_sample = d3.select(this).attr('class').split("-")[1]
						if (d.highlight > 0){
							svg.selectAll(".boxes-" + this_sample.toString())
						}else{
							svg.selectAll(".boxes-" + this_sample.toString())
								.attr("opacity", 0);
						}
					});
			
				height =y_pos; 
				svg.selectAll(".explanation_frame").attr("height", height); 
				svg.attr("height", height + 100); 
}

function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontsize + ' ' + fontname;
    return getWidthOfText.ctx.measureText(txt).width;
}

function tooltip(d){
	
	div1.style("background", function(){
			if (d.class == "med"){
				return "#1FC3B7"  // 00b390
			}else{
				return "#cff1c9"
			}
		})
		.transition()
		.duration(200)
		.style("opacity", 0.9)

		
	
	// if (d.class == "symp"){
	// 	classType = "Symptom feature"  
	// }else{
	// 	classType = "Medication feature"
	// }

	// featureType = d.type.toUpperCase().toString() + " type: ''" +  feature_table[d.feature] + "''" // "Feature type: " + d.type.toUpperCase();
	
	arr =  ["a" , "b ", "c"]  //[classType,featureType , "Contribution: "+ d.weight];  // feature_table[d.feature]
	 
	str = "          " +"&nbsp" + "<br/>" // + "Rules: " +  "          " +"&nbsp" + "<br/>""
	for (var j = 0 ; j < arr.length ; j++ ){
		
		str = str + "          " +"&nbsp" + arr[j] + "          " +"&nbsp" + "<br/>" + "          " +"&nbsp" 

	}

	div1.html(str)	
	
	if (d3.event.pageY < 200){
	div1.style("left", (d3.event.pageX - 120) + "px")
		.style("top", ((d3.event.pageY + 128 + (arr.length*20)) + "px"));
	}else{
	div1.style("left", (d3.event.pageX - 120) + "px")
		.style("top", ( d3.event.pageY - 128 - (arr.length*20) ) + "px");
	}

}


function clearText() {
    document.getElementById("TextArea").value = ""
    for (var i = 0; i < 300; i++) {
	    svg.selectAll(".explanation-"+i.toString()).remove(); 
	    svg.selectAll(".boxes-"+i.toString()).remove(); 
    }
    // svg.selectAll(".words").remove(); 
    svg.selectAll(".result_bar").remove(); 
	svg.selectAll(".result_frame").remove(); 
	svg.selectAll(".class_label").remove(); 
		
}


var hidRect;
var time_weight = 100, topic_weight = 0, action_weight = 400, cluster_weight = 20;
var max_y = 100;
var each_time_sec;
// var topic_distance;
var colors = d3.scaleOrdinal(d3.schemeCategory10); 

var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
	d3.select(window).on('resize.updatesvg', updateWindow);
		var chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth;  
		var chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; //

var svg = d3.select("#chartDiv").append("svg"),
    margin = {top: 20, right: 50, bottom: 20, left: 50};


	svg.attr("width", (0.6*chart_x - margin.right - margin.left));
	svg.attr("height", 500)

 var width = svg.attr("width");
 var height = 500; //svg.attr("height");   

var points_size = 10;
var Axis_room = 50;


var dataXRange = {min: 0, max: 6000};
var dataYRange = {min: 0, max: max_y};


var x_scale = d3.scaleLinear()
    .domain([dataXRange.min, dataXRange.max])
    .range([margin.left + points_size, width - points_size]);

var y_scale = d3.scaleLinear()
	.domain([dataYRange.min, dataYRange.max])
    .range([height - dataYRange.max, 0 + points_size]);



    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
  
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  



	var list_x = 50
	var list_y = 100
	var	list_width = 230
	var	list_height = 600
	var clearance = 50
	var explanation_x = 100
	var explanation_y = 60
	var explanation_height = 300
	var explanation_width = 580
	var frame_height = height - 100
	var result_height = 100
	
	var explanation_title = svg.append("g").append("text").attr("class","explanation_title")
			  .style("font-weight", "bold")
			  .style("font-size", "15px")
			  .text("Please highlight any words related to \""+dataset_name.toString()+"\" topic in this Article:")
			  .attr('dy','0.35em')
			  .attr("x", explanation_x)
			  .attr("y", explanation_y);

	var explanation_frame = svg.append("g").append("rect").attr("class","explanation_frame")
					.attr("x", explanation_x)
					.attr("y", explanation_y)
					.attr("rx", 5)
					.attr("ry", 5)
					.attr("width", explanation_width)
					.attr("height", explanation_height)
					.attr("fill", "white")
					.style("fill-opacity",1)
					.style("stroke","gray")
					.style("stroke-opacity",0.5);


load_dataset();
updateWindow();

function updateWindow(){
							 
		chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth; 
		chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; 
		
		
		width = chart_x * 0.8;

		explanation_width = width * 0.8;
		explanation_x = width * 0.09;
	
		svg.attr("width", width);
		svg.attr("height", height).attr("x", explanation_x);

		explanation_frame.attr("width", explanation_width)
						.attr("x", explanation_x)
						.attr("y", explanation_y);

		explanation_title.attr("x", explanation_x)
						.attr("y", explanation_y - 20);
		
		svg.selectAll(".explanation_frame").attr("height", height); //(3*next_line + line_counter * next_line));
		svg.attr("height", height + 100); //y_pos
		showTable(1);
	}
	