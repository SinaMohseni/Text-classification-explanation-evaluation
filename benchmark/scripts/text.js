	var txtfiles = [];
	var folder = "data/sci.electronics/";
	var txtdoc = []
	$.ajax({
	    url : folder,
	    success: function (data) {
	        $(data).find("a").attr("href", function (i, val) {
	            // if( val.match(/\.()$/) ){
	            	this_file = val.split("");
	            	if ((!isNaN(parseInt(this_file.pop(), 10))) & (this_file[0] == "/")){
	            		txtfiles.push(val)
	            	}
	            // } 
	        });
	    }
	});