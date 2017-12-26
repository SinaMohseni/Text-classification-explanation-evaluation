highligh_data = []
var inkColor = "red" // "#1f77b4"
var imgIndex = '';
var fill_checkbox = 1

  fill_area = d3.selectAll("input[name=fillarea]")          // Check box for cutting the tails
      .style("margin", "0px 10px 0px 10px")
      .style("padding", "0px 0px")
      .attr("position", "relative")
      .attr("checked", true)
      .on("change", function() {
                        if (this.checked) {
                          fill_checkbox = 1;
                        }else{
                          fill_checkbox = 0;
                        }
                    }
                       );


var path;
var color = "lightblue"
x_old = 0
y_old = 0

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
var folder_name = "ImageNet"
var call_once = 0;
var total_doc
var doc_num

function txtfilename(){
	
	folder_name = getCookie("user_selection")
	var folder = "benchmark/data/"+ folder_name +"/";
	var txtdoc = []
	
	$.ajax({
	    url : folder,
	    success: function (data) {
	        $(data).find("a").attr("href", function (i, val) {
	            	this_file = val.split("");
	            	// if ( (this_file.pop() == "g") & (this_file.pop() == "n") & (this_file.pop() == "p") ){  //if (( !isNaN(parseInt(this_file.pop(), 10)) )){
	            		txtfiles.push(val) // txtfiles.push(folder+val)
	            	// }
	        });
	        console.log(txtfiles)
	        total_doc = txtfiles.length;
			nextImage();
	    }
	});

}

function nextImage() {
	for (var i = 0; i < txtfiles.length ; i ++){
	  	if ( $.inArray(txtfiles[i], readfiles) == -1 ){
			readfiles.push(txtfiles[i])
			
			showImage(txtfiles[i], 0);

			doc_num =i + 1;
			image_title();
			
			d3.selectAll('path.line').remove();
  			ct =0;

			break;
		}
	}
}

function lastImage() {

	  		readfiles.pop()
	  		this_article = readfiles.pop()
	  		readfiles.push(this_article)
	  		console.log(this_article)

	  		showImage(this_article, 0);

	  		d3.selectAll('path.line').remove();
  			ct =0;

	 		doc_num -= 1;
			image_title();

}

var words_hash = []; 
var words_array = [];
var results_json = [];

function WriteFile(){

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


function image_title(){

	explanation_title.text("Please highlight any words related to \""+folder_name.toString()+"\" topic in this Article: ( "+ doc_num+" / "+total_doc+ " )")
}

function showImage(image_name, update_txt) {

  var this_img = new Image();  

  this_img.src = image_name
  $(".img_exp").attr("xlink:href",image_name);

  this_img.onload = function(){

			  	var img_width = this_img.height;//clientWidth;
				var img_height = this_img.width;//clientHeight;
			console.log(img_width, img_height)
            $(".img_box").attr("height",this_img.height); //"100%");
            $(".img_box").attr("width",this_img.width); //"100%");  
            $(".img_box").attr("margin","0 auto");
            }
}


var ct = 0;
var str = "line"
var first_point;

function dragstarted() {

  xy0 = d3.mouse(this);                     
  first_point = xy0;
  
  path = highlighter.append("path").datum([xy0, xy0])
  		  .attr("id", str.concat(ct) )
  		  .attr("class","line")
  		  .style("stroke", inkColor)
          .style("opacity", 1)
          .style("stroke-width", 2 + "px")
          .style("stroke-linejoin", "round")
          .style("fill", function(){if (fill_checkbox == 1) return inkColor; else return "none"; })
          .style("fill-opacity",0.3);
          ct++;
}

function dragged() {

  console.log(first_point, d3.mouse(this))
  path.datum().push(d3.mouse(this));
  path.attr("d", area); 
}

function dragended() {
  path.datum().push(first_point);
  path.attr("d", area); 
  path = null;
}
    
d3.select('#undo').on('click', function(){
  ct--;
  d3.select('path#'+str.concat(ct)).remove();
});

d3.select('#clear').on('click', function(){
  d3.selectAll('path.line').remove();
  ct =0;
});
    
var colorScale = d3.schemeCategory10; 
    colorAr = [0,1];

d3.select('#palette')
    .select('g')
  .selectAll('rect')
    .data(colorAr)
  .enter().append('rect')
    .attr('width', 10)
    .attr('height',10)
    .attr('x', function(d,i){
      return 22 * i;
    })
    .attr('fill', function(d){
      return colorScale(d);
    })
    .style('cursor','pointer')
    .on('click',function(d){
      changeColor(colorScale(d));
    });

  function changeColor(c){
    color = c.value;
    inkColor = color
  }


function saveIt(){  
    
    var csvContent = "data:text/csv;charset=utf-8,";
    highligh_data.forEach(function(infoArray, index){   
         dataString = infoArray.join(",");
         csvContent += index < highligh_data.length ? dataString+ "\n" : dataString;
    });
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Retraining_data.csv");
    document.body.appendChild(link);  

    link.click(); 
    highligh_data = []

}

function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontsize + ' ' + fontname;
    return getWidthOfText.ctx.measureText(txt).width;
}

function draw(selection){
    var xy0, 
        path, 
        keep = false, 
        line = d3.line()
                 .x(function(d){ return d[0]; })
                 .y(function(d){ return d[1]; });

    selection
        .on('mousedown', function(){ 
            keep = true;
            xy0 = d3.mouse(this);
            path = d3.select('svg')
                     .append('path')
                     .attr('d', line([xy0, xy0]))
                     .style({'stroke': 'black', 'stroke-width': '1px'});
        })
        .on('mouseup', function(){ 
            keep = false; 
        })
        .on('mousemove', function(){ 
            if (keep) {
                Line = line([xy0, d3.mouse(this).map(function(x){ return x - 1; })]);
                console.log(Line);
                path.attr("d", Line);
  //               path.datum().push(d3.mouse(this));
  // path.attr("d", area); 
            }
        });
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

var colors = d3.scaleOrdinal(d3.schemeCategory10); 

var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
	d3.select(window).on('resize.updatesvg', updateWindow);
		var width = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth;  
		var height = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; //

    margin = {top: 20, right: 50, bottom: 20, left: 50};

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

	var area = d3.line()
	  .x(function(d) {
	      if ( (Math.abs(d[0] - x_old) > 1) | (Math.abs(d[1] - y_old) > 1) ){
	        x_old = d[0];
	        y_old = d[1];
	        if (inkColor == "#1f77b4"){
	          highligh_data.push([d[0],d[1],0,0]);
	        } else{
	          highligh_data.push([0,0,d[0],d[1]]);
	        }
	      }
	      return d[0]; })
	  .y(function(d) { return d[1];});


	var highlighter = d3.select("#img_box") // Pixel highlighter
		.call(d3.drag()
			.on("start", dragstarted)
		    .on("drag", dragged)
		    .on("end", dragended));

	// var highlighter = d3.select("#img_box")
	// 						.append('rect')
	// 					    .attr('x', 0)
	// 					    .attr('y', 0)
	// 					    .attr('width', 224)
	// 					    .attr('height', 224)
	// 					    .style('fill', 'white')
	// 					    .call(draw)   // Line highlighter


	var explanation_title = d3.select("#panel").append("g").append("text").attr("class","explanation_title")
			  .style("font-weight", "bold")
			  .style("font-size", "15px")
			  .text("Please highlight any words related to \""+folder_name.toString()+"\" topic in this Article:")
			  .attr('dy','0.35em')
			  .attr("x", explanation_x)
			  .attr("y", explanation_y);

	// var explanation_frame = svg.append("g").append("rect").attr("class","explanation_frame")
	// 				.attr("x", explanation_x)
	// 				.attr("y", explanation_y)
	// 				.attr("rx", 5)
	// 				.attr("ry", 5)
	// 				.attr("width", explanation_width)
	// 				.attr("height", explanation_height)
	// 				.attr("fill", "white")
	// 				.style("fill-opacity",0.8)
	// 				.style("stroke","gray")
	// 				.style("stroke-opacity",0.5);


txtfilename();
// updateWindow();

function updateWindow(){
							 
		chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth; 
		chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; 
		
		
		width = chart_x * 0.8;

		explanation_width = width * 0.8;
		explanation_x = width * 0.09;
	
		// svg.attr("width", width);
		// svg.attr("height", height).attr("x", explanation_x);

		// explanation_frame.attr("width", explanation_width)
		// 				.attr("x", explanation_x)
		// 				.attr("y", explanation_y);

		// explanation_title.attr("x", explanation_x)
		// 				.attr("y", explanation_y - 20);
		
		// svg.selectAll(".explanation_frame").attr("height", height); //(3*next_line + line_counter * next_line));
		// svg.attr("height", height + 100); //y_pos
		// showText(1);
	}
	