function Progress(main_element,data,callBackMethod, condition){
    this.progress_start_time = Math.floor(Date.now() / 1000);
    this.last_time_s = this.progress_start_time;
    this.i = 0 // Current page to resolve/look at
    this.total = data.length //Total number of pages
    this.main_element = main_element //What element needs to change on each page.
    this.d = data; //The content to be displayed on screen
    this.callBackMethod = callBackMethod //Where to go after the sequence of progress.
    this.conditionNum = condition //a number 0-3 describing the kind of dataset the users is seeing.
    this.userData = new Array(this.total)// not sure if I need this saved here yet...
    this.hasSeen = new Array(this.total) //list of booleans if they have been seen.
    this.timeOnPage = new Array(this.total) //How long have they been looking at this trial/page
    for (let index = 0; index < this.total; index++) { //filling in the list of seen as false at first.
        this.hasSeen[index] = false;
        this.userData[index] = new Array();
        this.timeOnPage[index] = 0;
        console.log("filling array's with default values")
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
    // overwrites data stored in an index
    this.saveData = function(updatedObj,shouldOverwrite){
        let current_time_s = Math.floor(Date.now() / 1000);
        let tot_time = current_time_s - this.last_time_s;
        this.last_time_s = current_time_s;
        // console.log("time on page: ", tot_time, "(s), currently stored:", updatedObj["secSinceLast"]);
        updatedObj["secSinceLast"]=tot_time;
        this.timeOnPage[this.i] += tot_time;
        // if (this.userData[this.i].tot_time == undefined){
        //     updatedObj["tot_time"] = tot_time
        // } else {
        //     updatedObj["tot_time"] = this.userData[this.i].tot_time +tot_time
        // }
        this.saw(this.i)
        // console.log("you want to add:", updatedObj, "to", this.userData);
        //todo When clearing an object, it doesn't clear away the "secSinceLast" property of the empty array...

        if(shouldOverwrite){ //overwrite the data
            this.userData.splice(this.i,1,updatedObj);
        } else{ //append to the data in this index
            this.userData[this.i].push(updatedObj)
        }
            //    console.log(this.userData[this.i]);
 console.log("Did that work? Here's the Data I have now",this.userData);
    }
    this.writeToFile = function(taskNum){
        let toSave = []; //final output array to be built now and saved
        
        let task_key_id = getCookie("task_key_id") //get user data from cookie storage.
        let tutorial_time = parseInt(getCookie("tutorial_time")) //get the lenght of Time they spent in the totorial from the cookies
        let dataset_key = task_key_id.split(",")[1]; //separate out the dataset key so we know what they observed
        let mturk_id = task_key_id.split(",")[2]; //separate their MTurk ID so we know who they are.
        
        //Calculate the Total Time the Task took to complete
        let task_end_time = Math.floor(Date.now() / 1000);
        let task_total_time = task_end_time - this.progress_start_time;

        //first entry contrins all this information
        toSave.push({i: mturk_id, r:dataset_key, t:taskNum, d:0,d1:tutorial_time,d2:task_total_time});

        for (let index = 0; index < this.total; index++) {
            this.userData[index].unshift({PageTime:this.timeOnPage[index]})
            console.log(this.userData[index])
            // toSave.push(this.userData[index]);
        }
        //push the remainder of the user data to this file.
        toSave.push(this.userData);
        //now Save the file as json to the server with a POST request.
        $.ajax({
            type : "POST",
            url : "/benchmark/json.php",
            data : {
                json : JSON.stringify(toSave)
            }
          });
          //Call the Callback function final page after being written.
          this.callBackMethod();
    }
    this.back = function (){
        // console.log("called Back to page #", this.i, "out of", this.total, "user has seen:",this.hasSeen)
        if (this.i > 0){
            this.i--;
            this.updatePage();
        }
    }
    this.next = function(){
        // console.log("called Next", this.i,this.total,this.hasSeen)
        if(this.i < this.total-1){
            this.i++;
            this.updatePage();
        //todo change the button text on the next to last page so it's clear that they are finishing
        // }else if(this.i == this.total-2){
        //     document.getElementById("nextbutton-1").innerHTML = "Start Task"
        }else{
            this.writeToFile(this.conditionNum);
            // this.callBackMethod()
        }
    }
    this.updatePage = function(){
        newPage = this.d[this.i]+'<h3 class="progress">Page '+(this.i+1)+'/'+this.total+'</h3>';
        // console.log(data[this.i],newPage);
        document.getElementById(this.main_element).innerHTML = newPage;
        if(this.hasSeen[this.i]){
            resolveDataFromStorage(this.userData[this.i])
        }else{
            freshPage(); //may not need to make or use this function but I was getting some left over from previous annotations
        }
        resolveProgressButtons();
    }
    //todo define this more clearly if we need it
    this.toString = function(){
        // let str='';
        // this.userData.forEach(element => {
        //     str += element
        // });
        return this.userData.toString();
    }
}

function resolveProgressButtons(){
    // console.log(cntrl)
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

//Adding generic Getters and Setters for Cookies so the don't need to be added to every html document in addition ot this object.
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

  function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
  }