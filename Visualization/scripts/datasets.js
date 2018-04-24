  
    function criminalRecords() {
        
        total_weights = 0
        total_weights_crime_lime = 0
        jsonfile = "data/user_study/P1-crime.json"
        criminal_list = "data/user_study/list.csv"

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

        dataL = [
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
    criminal_users = 0    
    d3.csv(criminal_list,function(user) {
    
        for (ii = 0; ii < user.length;ii++){  // all participants

            jsonfile = "data/user_study/"+user[ii].criminal+".json"
            d3.json(jsonfile,function(d) {

                for (var i = 0; i < d.length;i++){  // all articles
                    for (var j = 0; j < d[i].word.length;j++){  // check decisions
                      
                        this_record = d[i].word[j];
                        total_weights +=1;
                        if (this_record.substring(0, 5) == "Marri"){
                            $.grep(dataR, function(obj){return obj.label === "Marriage";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Age ="){
                            $.grep(dataR, function(obj){return obj.label === "Age";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Years"){
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
                        } else if (this_record.substring(14, 23) == "Property "){
                            $.grep(dataR, function(obj){return obj.label === "Property";})[0].value +=1
                        } else if (this_record.substring(14, 21) == "Person "){
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
                criminal_users+=1
                if (criminal_users == (user.length)) crime_ML();

            });  // End of User results (right)

        }

    }); // End of all participants
    
    
    } // End of criminal records


    function crime_ML(){
        jsonfile = "data/ML_results/Tabular/recidivism/results/rcvd.json"   // P1-crime.json
                d3.json(jsonfile,function(d) {
                    

                    for (var i = 0; i < d.length;i++){  // all articles
                        for (var j = 0; j < d[i].features_list.length;j++){  // check decisions
                            
                            this_record = d[i].features_list[j];
                            total_weights_crime_lime +=1;

                            this_record_list = this_record[0].split(" ");
                            if (this_record_list.length == 1) this_record_list = this_record_list[0].split("=");
                            // console.log("Here: ",tokenize(this_record_list, 1))

                            if (this_record_list.indexOf("MARRIED") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Marriage";})[0].value +=1
                            } else if (this_record_list.indexOf("AGE") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Age";})[0].value +=1
                            } else if (this_record_list.indexOf("SCHOOL") >= 0){   // } else if (this_record[0].substring(0, 6) == "SCHOOL"){
                                $.grep(dataL, function(obj){return obj.label === "Education";})[0].value +=1
                            } else if (this_record_list.indexOf("WHITE") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Race";})[0].value +=1
                            } else if (this_record_list.indexOf("ALCHY") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Alcohol";})[0].value +=1
                            } else if (this_record_list.indexOf("JUNKY") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Junky";})[0].value +=1
                            } else if (this_record_list.indexOf("SUPER") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Supervised";})[0].value +=1
                            } else if (this_record_list.indexOf("WORKREL") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Work";})[0].value +=1
                            } else if (this_record_list.indexOf("FELON") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Felony";})[0].value +=1
                            } else if (this_record_list.indexOf("PROPTY") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Property";})[0].value +=1
                            } else if (this_record_list.indexOf("PERSON") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Person";})[0].value +=1
                            } else if (this_record_list.indexOf("PRIORS") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Prior Arrests";})[0].value +=1
                            } else if (this_record_list.indexOf("RULE") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Prison Violation";})[0].value +=1
                            } else if (this_record_list.indexOf("TSERVD") >= 0){
                                $.grep(dataL, function(obj){return obj.label === "Time Served";})[0].value +=1
                            }                    
                        }
                    }

                   d3.selectAll(".svg1").remove();
                   svg = d3.select('#crime')
                        .append("svg")
                        .attr("class", "svg1")
                        // .attr("width", width)
                        .attr("height", svg_height);

                    rightwing(svg,dataR,total_weights)
                    console.log("total ", total_weights_crime_lime)
                    leftwing(svg,dataL,total_weights_crime_lime);

                });  // End of Machine results (left)

    }  // End of criminal ML records
    


    function loanApplication() {

    total_weights_lime = 0
    total_weights_loan = 0
    jsonfile = "data/user_study/P1-laon.json"
    criminal_list = "data/user_study/list.csv"

        dataR_loan = [
        {label:"Amount", value:0},
        {label:"Term", value:0},
        {label:"Rate", value:0},
        {label:"Installment", value:0},
        {label:"Purpose", value:0},
        {label:"Type", value:0},
        {label:"Income", value:0},
        {label:"Title", value:0},
        {label:"Length", value:0},
        {label:"Ownership", value:0},
        {label:"State", value:0},
        {label:"Date", value:0},
        {label:"FICO High", value:0},
        {label:"FICO Low", value:0},
        {label:"Inquiry", value:0},
        {label:"Accounts", value:0},
        {label:"Balance", value:0},
        {label:"DTI", value:0}
        ];
    ii = 0

    d3.csv(criminal_list,function(user) {
        
        
        for (ii = 0; ii < user.length;ii++){  // all participants

            jsonfile = "data/user_study/"+user[ii].loan+".json"
            d3.json(jsonfile,function(d) {
         
                for (var i = 0; i < d.length;i++){  // all articles
                    for (var j = 0; j < d[i].word.length;j++){  // check decisions

                        this_record = d[i].word[j];
                        // $.grep(dataR, function(obj){return obj.label === "Total";})[0].value +=1
                        total_weights_loan +=1;
                        if (this_record.substring(0, 6) == "Loan A"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Amount";})[0].value +=1
                        } else if (this_record.substring(0, 6) == "Loan T"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Term";})[0].value +=1
                        } else if (this_record.substring(0, 6) == "Intere"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Rate";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Insta"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Installment";})[0].value +=1
                        } else if (this_record.substring(0, 6) == "Loan P"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Purpose";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Appli"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Type";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Annua"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Income";})[0].value +=1
                        } else if (this_record.substring(0, 12) == "Employment T"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Title";})[0].value +=1
                        } else if (this_record.substring(0, 12) == "Employment L"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Length";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Home "){
                            $.grep(dataR_loan, function(obj){return obj.label === "Ownership";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "State"){
                            $.grep(dataR_loan, function(obj){return obj.label === "State";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Earli"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Date";})[0].value +=1
                        } else if (this_record.substring(0, 12) == "FICO Score H"){
                            $.grep(dataR_loan, function(obj){return obj.label === "FICO High";})[0].value +=1
                        } else if (this_record.substring(0, 12) == "FICO Score L"){
                            $.grep(dataR_loan, function(obj){return obj.label === "FICO Low";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Credi"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Inquiry";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Numbe"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Accounts";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Accou"){
                            $.grep(dataR_loan, function(obj){return obj.label === "Balance";})[0].value +=1
                        }else{ //} else if (this_record.substring(0, 5); == "Time "){
                            $.grep(dataR_loan, function(obj){return obj.label === "DTI";})[0].value +=1
                        }
                    
                    }
                }
             

                jsonfile = "data/user_study/P1-loan.json"
                d3.json(jsonfile,function(d) {
                    
                    dataL_loan = [
                            {label:"Amount", value:10},
                            {label:"Term", value:10},
                            {label:"Rate", value:10},
                            {label:"Installment", value:10},
                            {label:"Purpose", value:10},
                            {label:"Type", value:10},
                            {label:"Income", value:10},
                            {label:"Title", value:10},
                            {label:"Length", value:10},
                            {label:"Ownership", value:10},
                            {label:"State", value:10},
                            {label:"Date", value:10},
                            {label:"FICO High", value:10},
                            {label:"FICO Low", value:10},
                            {label:"Inquiry", value:10},
                            {label:"Accounts", value:10},
                            {label:"Balance", value:10},
                            {label:"DTI", value:10}
                            ];


                   d3.selectAll(".svg2").remove();

                   svg2 = d3.select('#loan')
                        .append("svg")
                        .attr("class", "svg2")
                        // .attr("width", width)
                        .attr("height", svg_height);

                    rightwing(svg2, dataR_loan,total_weights_loan)
                    total_weights_lime = 1;
                    leftwing(svg2, dataL_loan,total_weights_lime);

                });  // End of Machine results (left)


            });  // End of User results (right)

        }

    }); // End of all participants
    
    
    

    } // End of criminal records


   


function apartmentpricing() {

    total_weights_apartment_lime = 0
    total_weights_apartment = 0;
    jsonfile = "data/user_study/P1-apartment.json";
    apartment_list = "data/user_study/list.csv";
    apartment_users = 0;

    dataR_apartment = [
        {label:"Rooms", value:0},
        {label:"Employment", value:0},
        {label:"Highways", value:0},
        {label:"Property Tax", value:0},
        {label:"Crime Rate", value:0},
        {label:"Lots", value:0},
        {label:"Business", value:0},
        {label:"River", value:0},
        {label:"NOS", value:0},
        {label:"Ower-occupied", value:0},
        {label:"Pupil-teacher", value:0},
        {label:"Lower Status", value:0}
    ];
    dataL_apartment = [
        {label:"Rooms", value:0},
        {label:"Employment", value:0},
        {label:"Highways", value:0},
        {label:"Property Tax", value:0},
        {label:"Crime Rate", value:0},
        {label:"Lots", value:0},
        {label:"Business", value:0},
        {label:"River", value:0},
        {label:"NOS", value:0},
        {label:"Ower-occupied", value:0},
        {label:"Pupil-teacher", value:0},
        {label:"Lower Status", value:0}
    ];

    

    d3.csv(apartment_list,function(user) {
        
        
        for (ii = 0; ii < user.length;ii++){  // all participants
            jsonfile = "data/user_study/"+user[ii].apartment+".json"
            d3.json(jsonfile,function(d) {
         
                for (var i = 0; i < d.length;i++){  // all articles
                    for (var j = 0; j < d[i].word.length;j++){  // check decisions

                        this_record = d[i].word[j];
                        // $.grep(dataR, function(obj){return obj.label === "Total";})[0].value +=1
                        total_weights_apartment +=1;
                        if (this_record.substring(0, 6) == "Number"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Rooms";})[0].value +=1
                        } else if (this_record.substring(0, 6) == "Weight"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Employment";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Index"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Highways";})[0].value +=1
                        } else if (this_record.substring(0, 6) == "Full-v"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Property Tax";})[0].value +=1
                        } else if (this_record.substring(0, 6) == "Crime "){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Crime Rate";})[0].value +=1
                        } else if (this_record.substring(0, 15) == "Proportion of R"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Lots";})[0].value +=1
                        } else if (this_record.substring(0, 15) == "Proportion of N"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Business";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "River"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "River";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Nitri"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "NOS";})[0].value +=1
                        } else if (this_record.substring(0, 15) == "Proportion of O"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Ower-occupied";})[0].value +=1
                        } else if (this_record.substring(0, 5) == "Pupil"){
                            $.grep(dataR_apartment, function(obj){return obj.label === "Pupil-teacher";})[0].value +=1
                        } else{
                            $.grep(dataR_apartment, function(obj){return obj.label === "Lower Status";})[0].value +=1
                        }
                    }
                }

                apartment_users+=1
                if (apartment_users == (user.length)) apapartment_ML();

            });  // End of User results (right)

        }

    }); // End of all participants
    
    } // End of apartment records



function apapartment_ML(){
    jsonfile = "data/ML_results/Tabular/housing/results/housing.json"
    total_weights_apartment_lime = 0;

    d3.json(jsonfile,function(d) {
        
    for (var i = 0; i < d.length;i++){  // all articles
        for (var j = 0; j < d[i].features_list.length;j++){  // check decisions

            this_record = d[i].features_list[j];

            this_record_list = this_record[0].split(" ");
            if (this_record_list.length == 1) this_record_list = this_record_list[0].split("=");
                            


            total_weights_apartment_lime +=1;
                if (this_record_list.indexOf("RM") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Rooms";})[0].value +=1
                } else if (this_record_list.indexOf("DIS") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Employment";})[0].value +=1
                } else if (this_record_list.indexOf("RAD") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Highways";})[0].value +=1
                } else if (this_record_list.indexOf("TAX") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Property Tax";})[0].value +=1
                } else if (this_record_list.indexOf("CRIM") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Crime Rate";})[0].value +=1
                } else if (this_record_list.indexOf("ZN") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Lots";})[0].value +=1
                } else if (this_record_list.indexOf("INDUS") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Business";})[0].value +=1
                } else if (this_record_list.indexOf("CHAS") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "River";})[0].value +=1
                } else if (this_record_list.indexOf("NOX") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "NOS";})[0].value +=1
                } else if (this_record_list.indexOf("AGE") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Ower-occupied";})[0].value +=1
                } else if (this_record_list.indexOf("PTRATIO") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Pupil-teacher";})[0].value +=1
                } else if (this_record_list.indexOf("LSTAT") >= 0){
                    $.grep(dataL_apartment, function(obj){return obj.label === "Lower Status";})[0].value +=1
                }
        }
    }

    d3.selectAll(".svg3").remove();

    svg3 = d3.select('#apartment')
        .append("svg")
        .attr("class", "svg3")
        // .attr("width", width)
        .attr("height", svg_height);

    rightwing(svg3, dataR_apartment,total_weights_apartment)
    console.log("total ", total_weights_apartment_lime)
    leftwing(svg3, dataL_apartment,total_weights_apartment_lime);

    });  // End of Machine results (left)


}   // End of apartment ML records