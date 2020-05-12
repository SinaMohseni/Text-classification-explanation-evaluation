
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
var articleTitles = [];
var fileName;
var folder_name = "sci.electronics"
// var call_once = 0;
// var total_doc
// var doc_num
let cntrl

function txtfilename(){
	
	folder_name = getCookie("user_selection")

	// var folder = "data/20news_test/no_header/"+ folder_name +"/";
	var folder = "data/20news_test/no_header/";
	// var folder = "data/20news_test/org/";
	var txtdoc = []
	
	$.ajax({
	    url : folder,
	    success: function (data) {
	        $(data).find("a").attr("href", function (i, val) {
				this_file = val.split(""); //make an array of the characters in file name.
				if (this_file.pop() == "t"){ // if this file ends in a 't', it's likely a .txt file.
					//i is -1 here because $(data).find("a") - lists the parent directory as an item. so we're off by one.
					articleTitles[i-1] = val.split("/").pop().split("-")[1].split(".txt")[0]
					txtfiles.push(folder+val)
				}
			});
		},
		complete: ()=> {
			// console.log(articleTitles)
			textFileContents = []
			for (let index = 0; index < txtfiles.length; index++) {
				$.get(txtfiles[index], (data) => {
					textFileContents.push(data);
				});
			}
			// let total_doc = txtfiles.length;
			
	    }
	}).then( ()=> {
		setTimeout(()=> { //todo find a way to get this working by waiting for the async functions to return.
			cntrl = new Pages(textFileContents)
			article_title();
			showText(0);
			resolveProgressButtons()
		},200);
		// console.log(textFileContents)
	});

}



function start_over(){

    if (confirm("Are you sure you want to start over?") == true) {
	    results_json  = []
		exp_data = []
		txtfiles = []
		saved = 1;
		readfiles = []
		txtfilename();
		location.href="../expevl.html"
	}
}


function nextArticle() {

	// for (var i = 0; i < txtfiles.length ; i ++){
	//   	if ( $.inArray(txtfiles[i], readfiles) == -1 ){
	// 		readfiles.push(txtfiles[i])
	// 		articleName = txtfiles[i].split("-")[1].split(".txt")[0]
	// 		fileName = txtfiles[i].split("%")[1].split(".txt")[0]
	// 		console.log(txtfiles[i])
	// 		jQuery.get(txtfiles[i], function(data) {   // jQuery.get('.'+txtfiles[i], function(data) {
	// 				output = data
				 	
	// 			 	// console.log(output)

	//todo decide if we need the saved variable or can just overwrite thejson on every page turn
	if (saved == 0) save_json();
	exp_data = [];	// 		});
	cntrl.i++;
	showText(0);
	//todo getHighlightsFromMem();
	article_title();
	resolveProgressButtons()

}

function lastArticle() {
			//todo decide if we need the saved variable or can just overwrite thejson on every page turn
			if (saved == 0) save_json();
			exp_data = [];

	  		// readfiles.pop()
	  		// this_article = readfiles.pop()
	  		// readfiles.push(this_article)
	  		// articleName = this_article.split("/").pop().split("-")[1].split(".txt")[0]
	  		// fileName = this_article.split(".txt")[0]
			// // console.log(this_article)
	  		// this_file = this_article.split("");
			// if (this_file.pop() == "t"){
			// 	jQuery.get(this_article, function(data) {   // jQuery.get('.'+txtfiles[i], function(data) {
			// 			output = data
			// 		 	showText(0);
			// 	});
			// }
			cntrl.i--;
			showText(0);
			//todo getHighlightsFromMem();
			article_title();
			resolveProgressButtons();

}

var words_hash = []; 
var words_array = [];
var results_json = [];
var exp_data = []
var saved = 1;

function save_json(){//shouldOverwrite){  
	// console.log(txtfiles[1])
	let updatedObj = {article: txtfiles[cntrl.i], word: exp_data}
	let current_time_s = Math.floor(Date.now() / 1000);
        let tot_time = current_time_s - cntrl.last_time_s;
        cntrl.last_time_s = current_time_s;
        // console.log("time on page: ", tot_time, "(s), currently stored:", updatedObj["secSinceLast"]);
        updatedObj["secSinceLast"]=tot_time;
        cntrl.timeOnPage[cntrl.i] += tot_time;
		// if(shouldOverwrite){ //overwrite the data
		results_json.splice(cntrl.i,1,updatedObj);
        // } else{ //append to the data in this index
        //     results_json.push(updatedObj)
		// }
		console.log("Did that work? Here's the Data I have now",results_json);
	// for (var i=0;i<exp_data.length;i++){
		// results_json.push({article: txtfiles[cntrl.i], word: exp_data})
		// console.log(results_json)
	// }
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


function article_title(){
	articleName = articleTitles[cntrl.i];
	if (articleName == "guns") articleName = "Guns and Politics";
	if (articleName == "med") articleName = "Medical";
	if (articleName == "space") articleName = "Space and Astronomy";
	if (articleName == "electronics") articleName = "Electronics and Computers";
	if (articleName == "autos") articleName = "Cars and Truck";
	
	$("#explaination_title").text("Please highlight any words related to \""+articleName+"\" topic in this Article: ( "+ (cntrl.i+1)+" / "+cntrl.total+ " )")
}

function showText(update_txt) {
	
	var myElement = document.createElement('chartDiv');
	myElement.style.userSelect = 'none';
	
	d3.dragDisable(window)

	for (var i = 0; i < 500; i++) {
	    svg.selectAll(".explanation-"+i.toString()).remove(); 
	    svg.selectAll(".boxes-"+i.toString()).remove(); 
    }
	svg.selectAll(".words").remove(); 
    // var output = document.getElementById("TextArea").value;
    // var output = sample_txt;
	
	if (update_txt == 0){
		words_hash = []; 
		words_array = [];
		var line_array = cntrl.d[cntrl.i].split("\n");
		
		for (var i = 0; i < line_array.length; i++) {
			this_line = line_array[i].split(" ");
			words_array.push("nextline");

			for (var j = 0; j < this_line.length; j++) {
				words_array.push(this_line[j])
			}
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

						// }else if ( $.inArray("\n", letters) > -1 ) {
						// 	line_counter += 1;
						// 	x_pos = explanation_x + clearance/3;
						// 	y_pos = explanation_y + box_height + clearance/3 + line_counter*next_line;

						// 	d.word = ""

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
			       		if (update_txt == 0) d.highlight = 0;
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
						
					}).style('cursor','pointer')
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
									// console.log(d)
									cntrl.saw();
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

var svg = d3.select("#annotation_area").append("svg"),
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
	
	// var explanation_title = svg.append("g").append("text").attr("class","explanation_title")
	// 		  .style("font-weight", "bold")
	// 		  .style("font-size", "15px")
	// 		  .text("Please highlight any words related to \""+folder_name.toString()+"\" topic in this Article:")
	// 		  .attr('dy','0.35em')
	// 		  .attr("x", explanation_x)
	// 		  .attr("y", explanation_y);

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


txtfilename();
// nextArticle();
updateWindow();

function Pages(files){
	this.progress_start_time = Math.floor(Date.now() / 1000);
    this.last_time_s = this.progress_start_time;
	this.i = 0 // Current page to resolve/look at
	this.d = files; //List of file names
    this.total = files.length //Total number of pages
    this.hasSeen = new Array(this.total) //list of booleans if they have been seen.
    this.timeOnPage = new Array(this.total) //How long have they been looking at this trial/page
    for (let index = 0; index < this.total; index++) { //filling in the list of seen as false at first.
        this.hasSeen[index] = false;
        this.timeOnPage[index] = 0;
        // console.log("filling array's with default values")
    }
    this.saw = function (index){
        if(typeof index == "undefined"){index = this.i} //use index provided or just mark the current index as seen
        this.hasSeen[index]=true;
        // console.log("called Saw for index #",index, "on this index now:", this.i,this.total,this.hasSeen))
        resolveProgressButtons();
        return true;//unnecessary but just in case.
    }
    this.unsaw = function(index){
        if(typeof index == "undefined"){index = this.i} //use index provided or just mark the current index as seen
        this.hasSeen[index]=false;
        resolveProgressButtons();
        return false;//unnecessary but just in case.       
	}
	// this.back = function (){
    //     // console.log("called Back to page #", this.i, "out of", this.total, "user has seen:",this.hasSeen)
    //     if (this.i > 0){
    //         this.i--;
    //         this.updatePage();
    //     }
    // } 
    // this.next = function(){
    //     // console.log("called Next", this.i,this.total,this.hasSeen)
    //     if(this.i < this.total-1){
    //         this.i++;
    //         this.updatePage();
    //     // todo change the button text on the next to last page so it's clear that they are finishing
    //     }else if(this.i == this.total-1){
    //         document.getElementById("nextbutton-1").innerHTML = "Submit Annotations"
    //         document.getElementById("nextbutton-2").innerHTML = "Submit Annotations"
    //     }else{
    //         this.writeToFile(this.conditionNum);
    //         // this.callBackMethod()
    //     }
    // }
	
}


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

		// explanation_title.attr("x", explanation_x)
		// 				.attr("y", explanation_y - 20);
		
		svg.selectAll(".explanation_frame").attr("height", height); //(3*next_line + line_counter * next_line));
		svg.attr("height", height + 100); //y_pos
		showText(1);
	}
	
function resolveProgressButtons(){
	// console.log(cntrl);
	if(!cntrl.hasSeen[cntrl.i]){//turn off next button
		document.getElementById("nextbutton-1").disabled = true;
		document.getElementById("nextbutton-2").disabled = true;
	} else { //turn on next button
		document.getElementById("nextbutton-1").disabled = false;
		document.getElementById("nextbutton-2").disabled = false;
	}

	//if first image, don't let them go backward.
	if(cntrl.i == 0){ //turn off previous button
		document.getElementById("backbutton-1").disabled = true;
		document.getElementById("backbutton-2").disabled = true;
	} else{ // Turn on Previous button
		document.getElementById("backbutton-1").disabled = false;
		document.getElementById("backbutton-2").disabled = false;
	}
}