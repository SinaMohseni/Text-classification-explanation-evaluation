  
    function text() {

    total_weights_elec = 0 ;
    total_weights_space = 0;
    total_weights_guns = 0;
    total_weights_med = 0;
    total_weights_cars = 0;
    jsonfile = "data/P1-text.json"
    users_list = "data/list.csv"

        dataR_elec = [];
        dataR_med = [];
        dataR_space = [];
        dataR_guns = [];
        dataR_cars = [];

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

    d3.csv(users_list,function(user) {
        
        
        for (ii = 0; ii < user.length;ii++){  // all participants
            jsonfile = "data/"+user[ii].text+".json"
            d3.json(jsonfile,function(d){  // This users
         
                for (var i = 1; i < d.length;i++){  // all articles
                    this_topic = d[i-1].article.split("-")[1]
                    for (var j = 0; j < d[i].word.length;j++){  // check decisions

                        this_word = d[i].word[j].toLowerCase();
                        
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
                
             
                
                d3.json(jsonfile,function(d) {
                    
                    dataL_elec = dataR_elec;
                    dataL_med = dataR_med;
                    dataL_space = dataR_space;
                    dataL_guns = dataR_guns;
                    dataL_cars = dataR_cars;

                   console.log(total_weights_elec, total_weights_guns, total_weights_space, total_weights_cars, total_weights_med)

               d3.selectAll(".svg4").remove();
               svg4 = d3.select('#electronics')
                    .append("svg")
                    .attr("class", "svg4")
                    .attr("width", width)
                    .attr("height", height);

                dataR_elec_top = getTopN(dataR_elec, "value", 20);
                dataL_elec_top = dataR_elec_top;
                console.log("elec: ", total_weights_elec, (dataR_elec_top[0].value)/total_weights_elec)
                rightwing(svg4,dataR_elec_top,total_weights_elec)
                leftwing(svg4,dataL_elec_top);

               d3.selectAll(".svg5").remove();
               svg5 = d3.select('#medical')
                    .append("svg")
                    .attr("class", "svg5")
                    .attr("width", width)
                    .attr("height", height);

                dataR_med_top = getTopN(dataR_med, "value", 20);
                dataL_med_top = dataR_med_top
                rightwing(svg5,dataR_med_top,total_weights_med)
                leftwing(svg5,dataL_med_top);

               d3.selectAll(".svg6").remove();
               svg6 = d3.select('#space')
                    .append("svg")
                    .attr("class", "svg6")
                    .attr("width", width)
                    .attr("height", height);

                dataR_space_top = getTopN(dataR_space, "value", 20);
                dataL_space_top = dataR_space_top
                rightwing(svg6,dataR_space_top,total_weights_space)
                leftwing(svg6,dataL_space_top);

                d3.selectAll(".svg7").remove();
               svg7 = d3.select('#cars')
                    .append("svg")
                    .attr("class", "svg7")
                    .attr("width", width)
                    .attr("height", height);

                dataR_cars_top = getTopN(dataR_cars, "value", 18);
                dataL_cars_top = dataR_cars_top
                rightwing(svg7,dataR_cars_top,total_weights_cars)
                leftwing(svg7,dataL_cars_top);

                d3.selectAll(".svg8").remove();
               svg8 = d3.select('#guns')
                    .append("svg")
                    .attr("class", "svg8")
                    .attr("width", width)
                    .attr("height", height);

                dataR_guns_top = getTopN(dataR_guns, "value", 20);
                dataL_guns_top = dataR_guns_top
                rightwing(svg8,dataR_guns_top,total_weights_guns)
                leftwing(svg8,dataL_guns_top);


                });  // End of Machine results (left)


            });  // End of this User's results (right)

        }

    }); // End of all participants
    
    
    

} // End


    