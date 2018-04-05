  
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
                   svg = d3.select('#electronics')
                        .append("svg")
                        .attr("class", "svg4")
                        .attr("width", width)
                        .attr("height", height);
                    rightwing(svg,dataR_elec,total_weights_elec)
                    leftwing(svg,dataL_elec);

                d3.selectAll(".svg5").remove();
               svg = d3.select('#medical')
                    .append("svg")
                    .attr("class", "svg5")
                    .attr("width", width)
                    .attr("height", height);

                rightwing(svg,dataR_med,total_weights_med)
                leftwing(svg,dataL_med);


                });  // End of Machine results (left)


            });  // End of this User's results (right)

        }

    }); // End of all participants
    
    
    

} // End


    