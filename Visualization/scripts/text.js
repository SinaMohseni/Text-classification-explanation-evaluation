

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function getTopN(arr, prop, n) {
    // clone before sorting, to preserve the original array
    var clone = arr.slice(0); 

    // sort descending
    clone.sort(function(x, y) {
        if (x[prop] == y[prop]) return 0;
        else if (parseInt(x[prop]) < parseInt(y[prop])) return 1;
        else return -1;
    });

    return clone.slice(0, n || 1);
}




function text() {


    total_weights_elec = 0 ;
    total_weights_space = 0;
    total_weights_guns = 0;
    total_weights_med = 0;
    total_weights_cars = 0;

    total_weights_elec_lime = 0 ;
    total_weights_space_lime = 0;
    total_weights_guns_lime = 0;
    total_weights_med_lime = 0;
    total_weights_cars_lime = 0;

    dataR_elec = [];
    dataR_med = [];
    dataR_space = [];
    dataR_guns = [];
    dataR_cars = [];

    dataL_elec = [];
    dataL_med = [];
    dataL_space = [];
    dataL_guns = [];
    dataL_cars = [];

    jsonfile = "data/user_study/P1-text.json"
    users_list = "data/user_study/list.csv"

    this_user = 0
    d3.csv(users_list,function(user) {
        
        for (ii = 0; ii < user.length;ii++){     // all participants
            jsonfile = "data/user_study/"+user[ii].text+".json"
            d3.json(jsonfile,function(d){  // This users
         
                for (var i = 1; i < d.length;i++){  // all articles
                    this_topic = d[i-1].article.split("-")[1]
                    for (var j = 0; j < d[i].word.length;j++){  // check decisions

                        this_word = d[i].word[j].toLowerCase();
                        // console.log(this_word)
                        if (this_topic == "electronics"){
                            total_weights_elec +=1;
                            this_exist = 0
                            for (var kk = 0; kk<dataR_elec.length;kk++){
                                if (this_word == dataR_elec[kk].label) this_exist = 1
                            }
                            if (this_exist == 0){
                                dataR_elec.push({label:this_word, value:1})
                            }else{
                                $.grep(dataR_elec, function(obj){return obj.label === this_word;})[0].value +=1
                            }
                        }else if (this_topic == "space"){
                            total_weights_space +=1;
                            this_exist = 0
                            for (var kk = 0; kk<dataR_space.length;kk++){
                                if (this_word == dataR_space[kk].label) this_exist = 1
                            }
                            if (this_exist == 0){
                                dataR_space.push({label:this_word, value:1})
                            }else{
                                $.grep(dataR_space, function(obj){return obj.label === this_word;})[0].value +=1                                
                            }
                        }else if (this_topic == "guns"){
                            total_weights_guns +=1;
                            this_exist = 0
                            for (var kk = 0; kk<dataR_guns.length;kk++){
                                if (this_word == dataR_guns[kk].label) this_exist = 1 
                            }
                            if (this_exist == 0){
                                dataR_guns.push({label:this_word, value:1})
                            }else{
                                $.grep(dataR_guns, function(obj){return obj.label === this_word;})[0].value +=1                                
                            }
                        }else if (this_topic == "autos"){
                             total_weights_cars +=1;
                            this_exist = 0
                            for (var kk = 0; kk<dataR_cars.length;kk++){
                                if (this_word == dataR_cars[kk].label) this_exist = 1
                            }
                            if (this_exist == 0){
                                dataR_cars.push({label:this_word, value:1})
                            }else{
                                $.grep(dataR_cars, function(obj){return obj.label === this_word;})[0].value +=1

                            }
                        }else{
                            total_weights_med +=1;
                            this_exist = 0
                            for (var kk = 0; kk<dataR_med.length;kk++){
                                if (this_word == dataR_med[kk].label) this_exist = 1
                            }
                            if (this_exist == 0){
                                dataR_med.push({label:this_word, value:1})
                            }else{
                                $.grep(dataR_med, function(obj){return obj.label === this_word;})[0].value +=1
                            }                            
                        }
                    }
                }
                
                this_user+=1
                if (this_user == user.length) ML_text_results();

            });  // End of this User's results (right)

        }

    }); // End of all participants

} // End



function ML_text_results(){

    // ------------------------ Electronics -------------------------------
    jsonfile = "data/ML_results/Text/RF/tfidf/no_header/LIME_exp/electronics.json"
    d3.json(jsonfile,function(d) {
        
        for (var i = 1; i < d.length;i++){  // all articles
            // this_topic = d[i-1].article.split("-")[1]
            for (var j = 0; j < d[i].features_list.length;j++){  // check decisions

                temp = d[i].features_list[j];
                if (temp[1] >0){
                    this_word = temp[0].toLowerCase();
                    
                    total_weights_elec_lime +=1;
                    this_exist = 0
                    for (var kk = 0; kk<dataL_elec.length;kk++){
                        if (this_word == dataL_elec[kk].label) this_exist = 1
                    }
                    if (this_exist == 0){
                        dataL_elec.push({label:this_word, value:1})
                    }else{
                        $.grep(dataL_elec, function(obj){return obj.label === this_word;})[0].value +=1
                    }
                }
            }
        }

       d3.selectAll(".svg4").remove();
       svg4 = d3.select('#electronics')
            .append("svg")
            .attr("class", "svg4")
            // .attr("width", width)
            .attr("height", svg_height);

        dataR_elec_top = getTopN(dataR_elec, "value", 20);
        dataL_elec_top = getTopN(dataL_elec, "value", 20);

        parallelwings(svg4,dataR_elec_top,dataL_elec_top,total_weights_elec,total_weights_elec_lime)

    });


    // ------------------------ Medical -------------------------------
    jsonfile = "data/ML_results/Text/RF/tfidf/no_header/LIME_exp/med.json"
    d3.json(jsonfile,function(d) {
        
        for (var i = 1; i < d.length;i++){  // all articles
            // this_topic = d[i-1].article.split("-")[1]
            for (var j = 0; j < d[i].features_list.length;j++){  // check decisions

                temp = d[i].features_list[j];
                if (temp[1] >0){
                    this_word = temp[0].toLowerCase();
                    
                    total_weights_med_lime +=1;
                    this_exist = 0
                    for (var kk = 0; kk<dataL_med.length;kk++){
                        if (this_word == dataL_med[kk].label) this_exist = 1
                    }
                    if (this_exist == 0){
                        dataL_med.push({label:this_word, value:1})
                    }else{
                        $.grep(dataL_med, function(obj){return obj.label === this_word;})[0].value +=1
                    }
                }
            }
        }

       d3.selectAll(".svg5").remove();
       svg5 = d3.select('#medical')
            .append("svg")
            .attr("class", "svg5")
            // .attr("width", width)
            .attr("height", svg_height);

        dataR_med_top = getTopN(dataR_med, "value", 20);
        dataL_med_top = getTopN(dataL_med, "value", 20);

        parallelwings(svg5,dataR_med_top,dataL_med_top,total_weights_med,total_weights_med_lime)

    });

 // ------------------------ Space -------------------------------
    jsonfile = "data/ML_results/Text/RF/tfidf/no_header/LIME_exp/space.json"
    d3.json(jsonfile,function(d) {
        
        for (var i = 1; i < d.length;i++){  // all articles
            // this_topic = d[i-1].article.split("-")[1]
            for (var j = 0; j < d[i].features_list.length;j++){  // check decisions

                temp = d[i].features_list[j];
                if (temp[1] >0){
                    this_word = temp[0].toLowerCase();
                    
                    total_weights_space_lime +=1;
                    this_exist = 0
                    for (var kk = 0; kk<dataL_space.length;kk++){
                        if (this_word == dataL_space[kk].label) this_exist = 1
                    }
                    if (this_exist == 0){
                        dataL_space.push({label:this_word, value:1})
                    }else{
                        $.grep(dataL_space, function(obj){return obj.label === this_word;})[0].value +=1
                    }
                }
            }
        }

       d3.selectAll(".svg6").remove();
       svg6 = d3.select('#space')
            .append("svg")
            .attr("class", "svg6")
            // .attr("width", width)
            .attr("height", svg_height);

        dataR_space_top = getTopN(dataR_space, "value", 20);
        dataL_space_top = getTopN(dataL_space, "value", 20);

        parallelwings(svg6,dataR_space_top,dataL_space_top,total_weights_space,total_weights_space_lime)

    });

       // ------------------------ Cars -------------------------------
    jsonfile = "data/ML_results/Text/RF/tfidf/no_header/LIME_exp/autos.json"
    d3.json(jsonfile,function(d) {
        
        for (var i = 1; i < d.length;i++){  // all articles
            // this_topic = d[i-1].article.split("-")[1]
            for (var j = 0; j < d[i].features_list.length;j++){  // check decisions

                temp = d[i].features_list[j];
                if (temp[1] >0){
                    this_word = temp[0].toLowerCase();
                    
                    total_weights_cars_lime +=1;
                    this_exist = 0
                    for (var kk = 0; kk<dataL_cars.length;kk++){
                        if (this_word == dataL_cars[kk].label) this_exist = 1
                    }
                    if (this_exist == 0){
                        dataL_cars.push({label:this_word, value:1})
                    }else{
                        $.grep(dataL_cars, function(obj){return obj.label === this_word;})[0].value +=1
                    }
                }
            }
        }

       d3.selectAll(".svg7").remove();
       svg7 = d3.select('#cars')
            .append("svg")
            .attr("class", "svg7")
            // .attr("width", width)
            .attr("height", svg_height);

        dataR_cars_top = getTopN(dataR_cars, "value", 20);
        dataL_cars_top = getTopN(dataL_cars, "value", 20);

        parallelwings(svg7,dataR_cars_top,dataL_cars_top,total_weights_cars,total_weights_cars_lime)

    });

           // ------------------------ Guns -------------------------------
    jsonfile = "data/ML_results/Text/RF/tfidf/no_header/LIME_exp/guns.json"
    d3.json(jsonfile,function(d) {
        
        for (var i = 1; i < d.length;i++){  // all articles
            // this_topic = d[i-1].article.split("-")[1]
            for (var j = 0; j < d[i].features_list.length;j++){  // check decisions

                temp = d[i].features_list[j];
                if (temp[1] >0){
                    this_word = temp[0].toLowerCase();
                    
                    total_weights_guns_lime +=1;
                    this_exist = 0
                    for (var kk = 0; kk<dataL_guns.length;kk++){
                        if (this_word == dataL_guns[kk].label) this_exist = 1
                    }
                    if (this_exist == 0){
                        dataL_guns.push({label:this_word, value:1})
                    }else{
                        $.grep(dataL_guns, function(obj){return obj.label === this_word;})[0].value +=1
                    }
                }
            }
        }

       d3.selectAll(".svg8").remove();
       svg8 = d3.select('#guns')
            .append("svg")
            .attr("class", "svg8")
            // .attr("width", width)
            .attr("height", svg_height);

        dataR_guns_top = getTopN(dataR_guns, "value", 20);
        dataL_guns_top = getTopN(dataL_guns, "value", 20);

        parallelwings(svg8,dataR_guns_top,dataL_guns_top,total_weights_guns,total_weights_guns_lime)

    });

}

    