function startUp() {
	folder_name = getCookie("user_selection")
	let folder = "./data/20news_test/test_ml_generated/"
	let documentData = [];

	$.ajax({
			url: folder,
			success: (data) => { //get all the paths to files
				$(data).find("a").attr("href", function (i, val) {
					this_file = val.split(""); //make an character array of the file name
					if (this_file.pop() == "n") { //If the character array ends in an "n" (aka .json file) then add it to the lists, this is to avoid adding directories to the arrays.
						articleTitles.push(val.split("/").pop().split("-")[1].split(".json")[0]) //so we know what type of file it is
						filePaths.push(folder+val) //folder + the name of the path to the file. 
					}
					// console.log(i,val, this_file, articleTitles,filePaths)
				})
				// console.log(folder_name,folder, documentData)
			},
			complete: () => { //get all the data in the files
				// console.log(filePaths)
				for (let index = 0; index < filePaths.length; index++) {
					$.get(filePaths[index], (data) => {
						documentData.push(data);
					});
				}
			}
		}) //end .ajax

		.then(() => { //generate the html from the files and create the controller.
			setTimeout(() => {

				let htmlDocuments = [];
				console.log(documentData)
				for (let index = 0; index < documentData.length; index++) {
					htmlDocuments.push(generateHTMLFromJSON(index, documentData[index]))
				}
				cntrl = new Progress('chartDiv', htmlDocuments, finished, 3)
				cntrl.updatePage()
			}, 200)
		}) //end .then
}

function generateHTMLFromJSON(index, docWords) {
	function getArticleTitle(i) {
		articleName = articleTitles[i];
		if (articleName == "guns") articleName = "Guns and Politics";
		if (articleName == "med") articleName = "Medical";
		if (articleName == "space") articleName = "Space and Astronomy";
		if (articleName == "electronics") articleName = "Electronics and Computers";
		if (articleName == "autos") articleName = "Cars and Truck";

		return ('<h3 id="explanation_title">How well do the highlighted words relate to \"' + articleName + '\" in this Article?</h3>')
	}

	function getArticleText(words) {
		//todo find a way to attach tool tips with the relative attribution to each word
		let out = '<div id="text_body">'
		for (let index = 0; index < words.length; index++) {
			thisWordIndex = words.find(element => element.i == index)
			// console.log(thisWordIndex)
			out += '<span class="highlight" style=" background:rgba( 255, 255, 0, ' + thisWordIndex.a + ');">' + thisWordIndex.w + '</span> ';
		}

		//alternative way to do it with less looping, but I wan't sure about ajax returning words out of order:
		// words.forEach(word => {
		// 	out += '<span class="highlight" style="background:rgba( 255, 255, 0,'+word.a+');">'+word.w +'</span> ';
		// });

		out += '</div>'
		return out
	}

	function getFreshPallet() {
		out = '<div id="palette"><h3 style = "display: inline-block; vertical-align: middle; text-align: top;margin-top: 1px;margin-bottom: 40px;"> How do you rate this heatmap explanation? </h3> \
		<div class="stars" style = "display: inline-block; margin-left: 10px;"> \
    		<form action=""> \
    			<input class="star star-10" id="star-10" type="radio" name="star" value="10"/> \
       				<label class="star star-10" for="star-10" onclick="newRating(10)">\
					<br>  <b style = "font-size: 12px;text-align: center;padding: 0px;"> 10 </b> \
					</label> \
    			<input class="star star-9" id="star-9" type="radio" name="star" value="9" />\
    				<label class="star star-9" for="star-9" onclick="newRating(9)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 9 </b> \
    				</label>\
    			<input class="star star-8" id="star-8" type="radio" name="star" value="8"/>\
    				<label class="star star-8" for="star-8" onclick="newRating(8)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 8 </b> \
   					</label>\
 				<input class="star star-7" id="star-7" type="radio" name="star" value="7"/>\
    				<label class="star star-7" for="star-7" onclick="newRating(7)">\
    				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 7 </b> \
    				</label>\
    			<input class="star star-6" id="star-6" type="radio" name="star" value="6"/>\
    				<label class="star star-6" for="star-6" onclick="newRating(6)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 6 </b> \
    				</label>\
    			<input class="star star-5" id="star-5" type="radio" name="star" value="5"/>\
    				<label class="star star-5" for="star-5" onclick="newRating(5)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 5 </b> \
    				</label>\
    			<input class="star star-4" id="star-4" type="radio" name="star" value="4"/>\
    				<label class="star star-4" for="star-4" onclick="newRating(4)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 4 </b> \
    				</label>\
    			<input class="star star-3" id="star-3" type="radio" name="star" value="3"/>\
    				<label class="star star-3" for="star-3" onclick="newRating(3)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 3 </b> \
    				</label>\
    			<input class="star star-2" id="star-2" type="radio" name="star" value="2"/>\
    				<label class="star star-2" for="star-2" onclick="newRating(2)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 2 </b> \
    				</label>\
    			<input class="star star-1" id="star-1" type="radio" name="star" value="1"/>\
    				<label class="star star-1" for="star-1" onclick="newRating(1)">\
      				<br>  <b style = "font-size: 12px;text-align: center;padding: 5px;"> 1 </b> \
    				</label>\
    		</form>\
    	</div> </div>'

		return out
	}
	let output = getArticleTitle(index) + getArticleText(docWords) + getFreshPallet();

	// console.log(output, docWords)
	return output
}

function finished() {
	cntrl.writeToFile(3);
	console.log("all Done!")
	window.location.replace('./finish.html');
}

function freshPage() {
	console.log("not yet rated")
		$('input[name=star]').prop('checked', false);
		rating = 0 //reset stars
}

function freezRating(id){
	document.getElementById(id).disabled = true; // disabled="disabled"
	setTimeout(function(){document.getElementById(id).disabled = false;},time_out);
	// ... dim colors ...
  }

function resolveDataFromStorage(storedData){

	console.log(storedData);
	rating = storedData.r
	for (let stars = 0; stars < rating; stars++) {
		//todo: update stars
		console.log("star")
		$('.star-'+(stars+1)).prop('checked', true);
	}
}

function newRating(rate){
	console.log(rate, typeof(rate))
	let toSave = {
		i: filePaths[cntrl.i],
		r: rate
	}
	cntrl.saveData(toSave,true)
}


//todo correct forward and back buttons
function nextArticle(){
	cntrl.next();
}
function lastArticle(){
	cntrl.back()
}


var rating = 0;


let articleTitles = [];
let filePaths = [];
startUp();



/*
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
var folder_name = "sci.electronics"
var call_once = 0;
var total_doc
var doc_num

function txtfilename(){
	
	folder_name = getCookie("user_selection")

	var folder = "data/20news-bydate-test/"+ folder_name +"/";
	var txtdoc = []
	
	$.ajax({
	    url : folder,
	    success: function (data) {
	        $(data).find("a").attr("href", function (i, val) {
	            // if ( val.match(/\.(gif)$/) == 0){
	            	this_file = val.split("");
	            	if (( !isNaN(parseInt(this_file.pop(), 10)) )){  // if ((!isNaN(parseInt(this_file.pop(), 10))) & (this_file[0] == "/")){
	            		txtfiles.push(folder+val)//txtfiles.push(val) // txtfiles.push(folder+val)
	            	}
	            // }
	        });
	        total_doc = txtfiles.length;
			nextArticle();
	    }
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
	for (var i = 0; i < txtfiles.length ; i ++){
	  	if ( $.inArray(txtfiles[i], readfiles) == -1 ){
			readfiles.push(txtfiles[i])
			
			jQuery.get(txtfiles[i], function(data) {   // jQuery.get('.'+txtfiles[i], function(data) {
					output = data
				 	showText(0);
				 	articleName = txtfiles[i].split("/").pop()
				 	console.log(txtfiles[i])
			});
				doc_num =i + 1;
				article_title();
			break;
		}
	}

	if (saved == 0) save_json();
	exp_data = [];
}

function lastArticle() {

			if (saved == 0) save_json();
			exp_data = [];

	  		readfiles.pop()
	  		this_article = readfiles.pop()
	  		readfiles.push(this_article)
	  		console.log("file ", this_article)
	  		this_file = this_article.split("");
			if (( !isNaN(parseInt(this_file.pop(), 10)) )){
				jQuery.get(this_article, function(data) {   // jQuery.get('.'+txtfiles[i], function(data) {
						output = data
					 	showText(0);
					 	articleName = this_article.split("/").pop()
				});
			}
	 		doc_num -= 1;
			article_title();

}

var words_hash = []; 
var words_array = [];
var results_json = [];
var exp_data = []
var saved = 1;

function save_json(){  

	results_json.push({article: articleName, word: exp_data})
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


function article_title(){

	explanation_title.text("Please review highlighted words related to \""+folder_name.toString()+"\" topic in this Article: ( "+ doc_num+" / "+total_doc+ " )")
}

function showText(update_txt) {
	
	var myElement = document.createElement('chartDiv');
	myElement.style.userSelect = 'none';
	
	d3.dragDisable(window)

	for (var i = 0; i < 3000; i++) {
	    svg.selectAll(".explanation-"+i.toString()).remove(); 
	    svg.selectAll(".boxes-"+i.toString()).remove(); 
    }

    // var output = document.getElementById("TextArea").value;
    // var output = sample_txt;
	
	if (update_txt == 0){
		words_hash = []; 
		words_array = [];
		var line_array = output.split("\n");
		
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
			  .text("Please review highlighted words related to \""+folder_name.toString()+"\" topic in this Article:")
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


txtfilename();
// nextArticle();
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
		showText(1);
	}
	*/