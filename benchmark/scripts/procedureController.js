let start_time = Math.floor(Date.now() / 1000);
let last_time_s = start_time;
function Progress(data,next_page){
    this.i = 0 // Current page to resolve/look at
    this.total = data.length //Total number of pages
    this.d = data; //The content to be displayed on screen
    this.next_page = next_page //Where to go after the sequence of progress.
    this.saveData = new Array(this.total)// not sure if I need this saved here yet...
    this.hasSeen = new Array(this.total) //list of booleans if they have been seen.
    for (let index = 0; index < this.total; index++) { //filling in the list of seen as false at first.
        this.hasSeen[index] = false;
        this.saveData[index] = new Array();
    }
    this.saw = function (index){
        if(typeof index == "undefined"){index = this.i} //use index provided or just mark the current index as seen
        this.hasSeen[index]=true;
        // console.log("called Saw for index #",index, "on this index now:", this.i,this.total,this.hasSeen)
        resolveProgressButtons();
        return true;//unnecessary
    }
    // overwrites data stored in an index
    this.wtSaveData = function(updatedObj,shouldOverwrite){
        current_time_s = Math.floor(Date.now() / 1000);
        tot_time = current_time_s - last_time_s;
        last_time_s = current_time_s;
        console.log(tot_time)
        updatedObj["secSinceLast"]=tot_time;
        console.log("I'm filled here, but you want to add:", updatedObj)
        if(shouldOverwrite){ //overwrite the data

            this.saveData.splice(this.i,1,updatedObj);
        } else{ //append to the data in this index
            this.saveData[this.i].push(updatedObj)
        }
    }
    //Mutable!! - remove data from index.
    this.rmSaveData= function(idx){
        // console.log(idx)
        stored = this.saveData.splice(idx,1);
        console.log(stored)
        return stored
    }
    this.back = function (){
        console.log("called Back", this.i,this.total,this.hasSeen)
        if (this.i > 0){
            this.i--;
            this.updatePage();
        }
    }
    this.next = function(){
        console.log("called Next", this.i,this.total,this.hasSeen)
        if(this.i < this.total-1){
            this.i++;
            this.updatePage();
        }else{
            console.error("beyond the total")
            // writeFile();
            window.location = this.next_page;

            // this.updatePage();
            //go to next task/website
        }
    }
    this.updatePage = function(){
        console.log(data[this.i]);
        document.getElementById("num").innerHTML = this.d[this.i]
        resolveProgressButtons();
    }
    //todo define this more clearly
    this.toString = function(){
        return this.saveData;
    }
    //todo,not sure if this should be different from toString
    this.wt2File = function(){
        return this.saveData
    }
}

function resolveProgressButtons(){
    console.log(cntrl)
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

/*simple-test-page.html functions for tessting object*/

d = ['<h1> Instructions: </h1> </br><h2> Select Pet Features in Images: <br>Your main task is to <mark> hightlight areas in the image that mostly represent pets.</mark></h2><p> This could be a paw, a nose, the whole body etc. Your goal is to <mark>select the areas</mark> of the image <mark> that help <u>you recognize</u></mark> the pet. You do not need to select the entire pet in every image, only the most important areas!</p></br></br><img  id= test_img src="http://people.tamu.edu/~sina.mohseni/data/instructions/annotation-1.PNG" width="400">',2,3,4,5,6];
cntrl = new Progress(d,"https://www.google.com");
cntrl.updatePage();

function next(){
    cntrl.next();
}
function back(){
    cntrl.back();
}

function action(){
    elements = []
    for (let index = 0; index < 3; index++) {
        elements.push(Math.floor(Math.random()*30)+10);
    }
    t = new Progress(elements,"https://facebook.com/")
    cntrl.wtSaveData(t,true)
    cntrl.saw();
}
// let timer = setInterval(function(){
//     cntrl.saw();
// }, 5000)
