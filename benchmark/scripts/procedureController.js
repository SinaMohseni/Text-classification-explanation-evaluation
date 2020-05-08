let start_time = Math.floor(Date.now() / 1000);
let last_time_s = start_time;
function Progress(main_element,data,callBackMethod){
    this.i = 0 // Current page to resolve/look at
    this.total = data.length //Total number of pages
    this.main_element = main_element //What element needs to change on each page.
    this.d = data; //The content to be displayed on screen
    this.callBackMethod = callBackMethod //Where to go after the sequence of progress.
    this.userData = new Array(this.total)// not sure if I need this saved here yet...
    this.hasSeen = new Array(this.total) //list of booleans if they have been seen.
    for (let index = 0; index < this.total; index++) { //filling in the list of seen as false at first.
        this.hasSeen[index] = false;
        this.userData[index] = new Array();
        console.log("filling array's with default values")
    }
    this.saw = function (index){
        if(typeof index == "undefined"){index = this.i} //use index provided or just mark the current index as seen
        this.hasSeen[index]=true;
        // console.log("called Saw for index #",index, "on this index now:", this.i,this.total,this.hasSeen))
        resolveProgressButtons();
        return true;//unnecessary but just in case.
    }
    // overwrites data stored in an index
    this.saveData = function(updatedObj,shouldOverwrite){
        current_time_s = Math.floor(Date.now() / 1000);
        tot_time = current_time_s - last_time_s;
        last_time_s = current_time_s;
        console.log(tot_time)
        updatedObj["secSinceLast"]=tot_time;
        this.saw(this.i)
        // console.log("you want to add:", updatedObj, "to", this.userData);

        if(shouldOverwrite){ //overwrite the data
            this.userData.splice(this.i,1,updatedObj);
        } else{ //append to the data in this index
            this.userData[this.i].push(updatedObj)
        }
        // console.log("Did that work? Here's the Data I have now",this.userData);
    }
    this.writeToFile = function(taskNum){
        let toSave = []; //final output array to be built now and saved
        
        let task_key_id = getCookie("task_key_id") //get user data from cookie storage.
        let tutorial_time = parseInt(getCookie("tutorial_time")) //get the lenght of Time they spent in the totorial from the cookies
        let dataset_key = task_key_id.split(",")[1]; //separate out the dataset key so we know what they observed
        let mturk_id = task_key_id.split(",")[2]; //separate their MTurk ID so we know who they are.
        
        //todo check that timers are working and saving is happening correctly.
        //Calculate the Total Time the Task took to complete
        let task_end_time = Math.floor(Date.now() / 1000);
        let task_total_time = task_end_time - task_start_time;

        //first entry contrins all this information
        toSave.push({i: mturk_id, r:dataset_key, t:taskNum, d:0,d1:tutorial_time,d2:task_total_time});

        //push the remainder of the user data to this file.
        for (let index = 0; index < this.userData.length; index++) {
            toSave.push(this.userData[index]);
        }

        //now Save the file as json to the server with a POST request.
        $.ajax({
            type : "POST",
            url : "json.php",
            data : {
                json : JSON.stringify(toSave)
            }
          });
          //Call the Callback function final page after being written.
        //   this.callBackMethod();
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
            this.writeToFile();
            progressFinished()
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