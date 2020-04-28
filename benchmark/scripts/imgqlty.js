highlight_data = []
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
var color = "lightblue";
x_old = 0;
y_old = 0;

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




const study_length = 14;
const training_imgs = 5; 
const time_out = 2000;

var results_json = [];
var txtfiles = [];
var readfiles = [];
var imageName;
var folder_name = "VOC_grad-cam";
// var folder_name = "udacity" 
var call_once = 0;
var total_doc = study_length;
var doc_num;
current_time_s = 0;
last_time_s = 0;


function txtfilename(){
	
	task_key_id = getCookie("task_key_id")
	dataset_key = task_key_id.split(",")[1];
	mturk_id = task_key_id.split(",")[2];


	results_json.push({i: "mturk_id", r: task_key_id.split(",")[2],d:0})

	var folder = "./data/"+ folder_name + "/"; //  +"_exp/";
	var txtdoc = []; 

	// 	$.ajax({
	//     url : folder,
	//     success: function (data) {
	//         $(data).find("a").attr("href", function (i, val) {
	//             	this_file = val.split("");
	//             	if ( (this_file.pop() == "g") | (this_file.pop() == "m") ){  //if (( !isNaN(parseInt(this_file.pop(), 10)) )){
	//             	// this_file.pop()
	//             	// if ( (this_file.pop() != "i") & (this_file.pop() !== ".") ){
	//             		console.log(folder)
	// 					console.log(val)
	//             		txtfiles.push(val) // txtfiles.push(folder+val)
	//             	}
	//         });
	//         console.log(txtfiles)
	//         total_doc = txtfiles.length;
	// 		nextImage();
	//     }
	// });

	if (annotated_imgs.length >= ((parseInt(task_key_id.split(",")[1])+1)*study_length)  ){

		for (i=0;i<study_length;i++){
			// task_key_id.split(",")[1]  // key	
			txtfiles.push(annotated_imgs[i+(task_key_id.split(",")[1]*study_length)])

		}
	}else{
		
		console.log('Task: ', task_key_id.split(",")[0],"Key:", task_key_id.split(",")[1],'id: ', task_key_id.split(",")[2])
		console.log( (parseInt(task_key_id.split(",")[1])+1)*study_length, "is smaller thatn", annotated_imgs.length)
		alert("Not Enough Images found!")
	}
	// console.log('annotated_imgs', annotated_imgs.length,((task_key_id.split(",")[1]+1)*10),txtfiles)	
	last_time_s = Math.floor(Date.now() / 1000);
	nextImage();
}


function start_over(){

    if (confirm("Are you sure you want to start over?") == true) {
	    results_json  = []
		highlight_data = []
		txtfiles = []
		ct = 0;
		readfiles = []
		txtfilename();
		location.href="../expevl.html"
	}
}

function nextImage() {	

	current_time_s = Math.floor(Date.now() / 1000)
	tot_time = current_time_s - last_time_s;
	last_time_s = current_time_s;
	
	if (doc_num == study_length) {
		
		alert("End of this HIT! \n\n Code is printed in a new tab. Please copy the code it in the AMT page to finish the HIT! \n\n You can also click on Download Results")

		WriteFile(tot_time);
		document.getElementById("nextbutton-1").innerHTML = "Download Results"
		document.getElementById("nextbutton-2").innerHTML = "Download Results"

	}else{

		document.getElementById("nextbutton-1").disabled = true;
		document.getElementById("nextbutton-2").disabled = true;
		// $('#my-input-id').prop('disabled', false);
		save_json(tot_time);     // if ((ct > 0) & (saved == 0)) save_json();

	    $('input[name=star]').prop('checked', false);

		for (var i = 0; i < txtfiles.length ; i ++){
		  	if ( $.inArray(txtfiles[i], readfiles) == -1 ){
				readfiles.push(txtfiles[i])
				
				showImage(txtfiles[i], 0);
	            rating = 0; 

				imageName = txtfiles[i].split("/").pop();
				doc_num =i + 1;
				image_title();
				
				d3.selectAll('path.line').remove();
				highlight_data = []
	  			ct =0;

				break;
			}
		}


		for (i=1;i<11;i++){
			freezRating("star-"+i)
		}
		
	      // document.getElementsByClassName("star star-10").disabled = true; // disabled="disabled"
	      // setTimeout(function(){document.getElementsByClassName("star star-10").disabled = false;},2000);
	}





}


function freezRating(id){
      document.getElementById(id).disabled = true; // disabled="disabled"
      setTimeout(function(){document.getElementById(id).disabled = false;},time_out);
      // ... dim colors ...
    }

function lastImage() {
			
			// save_json();       // if ((ct > 0) & (saved == 0)) save_json();

            $('input[name=star]').prop('checked', false);
            rating = 0;

	  		readfiles.pop()
	  		this_article = readfiles.pop()
	  		readfiles.push(this_article)
	  		console.log("this_article: ", this_article)

	  		showImage(this_article, 0);
	  		imageName = this_article.split("/").pop();

	  		d3.selectAll('path.line').remove();
	  		highlight_data = []
  			ct =0;

	 		doc_num -= 1;
			image_title();



}

var words_hash = []; 
var words_array = [];


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
    obj = imageName.toString().split(".")[0].slice(0,-1)
    explanation_title.text("Please rate 'how good' the AI is explaining the pet in this image: ( "+ doc_num +" / "+total_doc+ " )");
}

function showImage(image_name, update_txt) {

  // var this_img = new Image();  

  // this_img.src = image_name;
  // $(".img_exp1").attr("xlink:href",image_name);

  // this_img.onload = function(){

		// 	  	var img_width = this_img.height;
		// 		var img_height = this_img.width;

  //           $(".img_box1").attr("height",this_img.height);
  //           $(".img_box1").attr("width","800px"); //this_img.width);
  //           $(".img_exp1").attr("margin-left","10%");
  //           $(".img_box1").attr("margin","100px");
  //           $(".img_box1").attr("padding-left","200px");
  //           $(".img_exp1").attr("padding-left","200px");
  //           $(".img_exp1").attr("display","block");
  //           $(".img_exp1").attr("width","400px");
  //           $(".img_exp1").attr("margin-left","10%");

            
  //           }
  
            // var folder = "data/"+ folder_name +"_exp/";
            // document.getElementById("test_img").src= folder+image_name;
            // document.getElementById("test_img").src= ".."+image_name;
            document.getElementById("test_img").src= image_name;


}


var ct = 0;
var str = "line"
var first_point;

var line = d3.line()
    .curve(d3.curveBasis);

var svg = d3.select("#img_box")
    .call(d3.drag()
        .container(function() { return this; })
        .subject(function() { var p = [d3.event.x, d3.event.y]; return [p, p]; })
        .on("start", dragstarted));

function dragstarted() {

	ct++;
	highlight_data.push([])

	xy0 = d3.mouse(this);                     
    first_point = xy0;

  var d = d3.event.subject,
      active = svg.append("path").datum(d)
      .attr("id", str.concat(ct) )
	  .attr("class","line")
      .style("stroke", inkColor)
      .style("opacity", 1)
      .style("stroke-width", 2 + "px")
      .style("stroke-linejoin", "round")
      .style("fill", function(){if (fill_checkbox == 1) return inkColor; else return "none"; })
      .style("fill-opacity",0.3),
      x0 = d3.event.x,
      y0 = d3.event.y;

  d3.event.on("drag", function() {
    var x1 = d3.event.x,
        y1 = d3.event.y,
        dx = x1 - x0,
        dy = y1 - y0;

    if (dx * dx + dy * dy > 20){
		d.push([x0 = x1, y0 = y1]);
        highlight_data[ct-1].push([x1,y1]);
    } 
    else d[d.length - 1] = [x1, y1];
    active.attr("d", line);
  });

	d3.event.on("end", function(){
		d.push(first_point);
        highlight_data[ct-1].push([first_point[0],first_point[1]]);
        // console.log(highlight_data)
        active.attr("d", line);
	});

}


    
// d3.select('#undo').on('click', function(){
//   ct--;
//   d3.select('path#'+str.concat(ct)).remove();
// });

d3.select('#clear').on('click', function(){
  d3.selectAll('path.line').remove();
  highlight_data = []
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

var rating = 0;

// $('#nextbutton').prop('disabled', false);
// document.getElementById("nextbutton").removeAttribute('disabled');
// $("#nextbutton").removeAttr('disabled');

// document.getElementById("nextbutton-1").disabled = true;

// $("#nextbutton *").attr("disabled", "disabled").off('click');


// $("#nextbutton *").attr("disabled", "disabled").off('click');
// $("#nextbutton").hasClass("disabledDiv");
// $("#nextbutton").addClass("disabledDiv");



$(document).ready(function() {
  $('input[type=radio][name=star]').change(function() {
     // confirm(this.value)
     rating = this.value
     // document.getElementById("nextbutton").disabled = false;
	$('#nextbutton-1').prop('disabled', false);
	$('#nextbutton-2').prop('disabled', false);
     // $("#nextbutton *").attr("disabled", "false");
     // $("#nextbutton").prop("disabled", false); 
     // $("#nextbutton").removeAttr("disabled");
     // $("#nextbutton").removeClass("disabledDiv")
     // $("#nextbutton").removeClass("disabledDiv");
     // console.log("here")
  });
});


function save_json(tot_time){  

	if (imageName != null) this_image = imageName.split(".")[0].split("-")[1]
	// for (var i=0;i<highlight_data.length;i++){
	// if (rating > 0) results_json.push({i: this_image, r: rating, d: tot_time})// contour: i+1, points: highlight_data[i]})
	if (rating > 0) results_json.push({i: imageName, r: rating})// contour: i+1, points: highlight_data[i]})
	// console.log("rate", rating)
	// }
}

function WriteFile(tot_time){
    
	save_json(tot_time);

		


	var jsonContent = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results_json));
	var a = document.createElement('a');
	a.href = 'data:' + jsonContent;
	a.download = 'results.json';
	a.innerHTML = 'End Study';
	a.click();
	
	var winPrint = window.open("about:blank", "_blank")//'', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0',"_blank"); 
	winPrint.document.write(JSON.stringify(results_json)); 
	winPrint.document.close(); 
	// something = window.open("data:text/json," + encodeURIComponent(JSON.stringify(results_json))); // ,"_blank"
	// something.focus();


    // var myjson = JSON.stringify(results_json, null, 2);
    // console.log(myjson);
    // var x = window.open();
    // x.document.open();
    // x.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
    // x.document.close();


	// document.write(results_json);
}

// function saveIt(){  
    
//     var csvContent = "data:text/csv;charset=utf-8,";
//     highlight_data.forEach(function(infoArray, index){   
//          dataString = infoArray.join(",");
//          csvContent += index < highlight_data.length ? dataString+ "\n" : dataString;
//     });
//     console.log(csvContent)
//     var encodedUri = encodeURI(csvContent);
//     var link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "Retraining_data.csv");
//     document.body.appendChild(link);  

//     link.click(); 
//     saved = 1;
// }

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
			  .text("Please rate how fine is the highlighted area of this image to explain the object in this image:")
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




// start_over();
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
	