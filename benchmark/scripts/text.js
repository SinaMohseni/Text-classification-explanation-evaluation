
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
   // var height = 500;
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
var articleTitles = [];
var fileName;
var folder_name = "sci.electronics"
// var call_once = 0;
// var total_doc
// var doc_num
let cntrl

function txtfilename(){
	
	folder_name = getCookie("user_selection")

	//todo Set up some restrictions to ensure everyone see different documents, 
	//todo right now it's set up to load as many as it can before the cntrl is constructed.


	
categories = ['alt.atheism',
	 'comp.graphics',
	 'comp.os.ms-windows.misc',
	 'comp.sys.ibm.pc.hardware',
	 'comp.sys.mac.hardware',
	 'comp.windows.x',
	 'misc.forsale',
	 'rec.autos',
	 'rec.motorcycles',
	 'rec.sport.baseball',
	 'rec.sport.hockey',
	 'sci.crypt',
	 'sci.electronics',
	 'sci.med',
	 'sci.space',
	 'soc.religion.christian',
	 'talk.politics.guns',
	 'talk.politics.mideast',
	 'talk.politics.misc',
	 'talk.religion.misc']

categories_dic = {'alt.atheism': 'Atheism',
	 'comp.graphics': 'Computer Graphics',
	 'comp.os.ms-windows.misc': 'Computer Windows',
	 'comp.sys.ibm.pc.hardware': 'IBM Computer Hardware',
	 'comp.sys.mac.hardware': 'Mac Computer Hardware',
	 'comp.windows.x': 'Computer Windows',
	 'misc.forsale': 'For Sale',
	 'rec.autos': 'Automobile',
	 'rec.motorcycles': 'Motorcycles',
	 'rec.sport.baseball': 'Sports and Baseball',
	 'rec.sport.hockey': 'Sports and Hockey',
	 'sci.crypt': 'Crypt',
	 'sci.electronics': 'Electronics',
	 'sci.med': 'Medical',
	 'sci.space': 'Space',
	 'soc.religion.christian': 'Christianity',
	 'talk.politics.guns': 'Guns and Politics',
	 'talk.politics.mideast': 'Politics and Middle East',
	 'talk.politics.misc': 'Politics',
	 'talk.religion.misc': 'Religion'}


		atheism_topic = 
		["/benchmark/data/validation_set_50/alt.atheism/102.txt", "/benchmark/data/validation_set_50/alt.atheism/103.txt", "/benchmark/data/validation_set_50/alt.atheism/112.txt", "/benchmark/data/validation_set_50/alt.atheism/124.txt", "/benchmark/data/validation_set_50/alt.atheism/135.txt", "/benchmark/data/validation_set_50/alt.atheism/137.txt", "/benchmark/data/validation_set_50/alt.atheism/140.txt", "/benchmark/data/validation_set_50/alt.atheism/143.txt", "/benchmark/data/validation_set_50/alt.atheism/145.txt", "/benchmark/data/validation_set_50/alt.atheism/154.txt", "/benchmark/data/validation_set_50/alt.atheism/16.txt", "/benchmark/data/validation_set_50/alt.atheism/163.txt", "/benchmark/data/validation_set_50/alt.atheism/170.txt", "/benchmark/data/validation_set_50/alt.atheism/189.txt", "/benchmark/data/validation_set_50/alt.atheism/199.txt", "/benchmark/data/validation_set_50/alt.atheism/207.txt", "/benchmark/data/validation_set_50/alt.atheism/214.txt", "/benchmark/data/validation_set_50/alt.atheism/222.txt", "/benchmark/data/validation_set_50/alt.atheism/223.txt", "/benchmark/data/validation_set_50/alt.atheism/228.txt", "/benchmark/data/validation_set_50/alt.atheism/241.txt", "/benchmark/data/validation_set_50/alt.atheism/245.txt", "/benchmark/data/validation_set_50/alt.atheism/248.txt", "/benchmark/data/validation_set_50/alt.atheism/25.txt", "/benchmark/data/validation_set_50/alt.atheism/259.txt", "/benchmark/data/validation_set_50/alt.atheism/26.txt", "/benchmark/data/validation_set_50/alt.atheism/266.txt", "/benchmark/data/validation_set_50/alt.atheism/27.txt", "/benchmark/data/validation_set_50/alt.atheism/274.txt", "/benchmark/data/validation_set_50/alt.atheism/277.txt", "/benchmark/data/validation_set_50/alt.atheism/278.txt", "/benchmark/data/validation_set_50/alt.atheism/289.txt", "/benchmark/data/validation_set_50/alt.atheism/292.txt", "/benchmark/data/validation_set_50/alt.atheism/297.txt", "/benchmark/data/validation_set_50/alt.atheism/301.txt", "/benchmark/data/validation_set_50/alt.atheism/304.txt", "/benchmark/data/validation_set_50/alt.atheism/305.txt", "/benchmark/data/validation_set_50/alt.atheism/310.txt", "/benchmark/data/validation_set_50/alt.atheism/40.txt", "/benchmark/data/validation_set_50/alt.atheism/47.txt", "/benchmark/data/validation_set_50/alt.atheism/53.txt", "/benchmark/data/validation_set_50/alt.atheism/70.txt", "/benchmark/data/validation_set_50/alt.atheism/71.txt", "/benchmark/data/validation_set_50/alt.atheism/73.txt", "/benchmark/data/validation_set_50/alt.atheism/78.txt", "/benchmark/data/validation_set_50/alt.atheism/79.txt", "/benchmark/data/validation_set_50/alt.atheism/87.txt"]
		graphics_topic = 
		["/benchmark/data/validation_set_50/comp.graphics/102.txt", "/benchmark/data/validation_set_50/comp.graphics/11.txt", "/benchmark/data/validation_set_50/comp.graphics/123.txt", "/benchmark/data/validation_set_50/comp.graphics/140.txt", "/benchmark/data/validation_set_50/comp.graphics/142.txt", "/benchmark/data/validation_set_50/comp.graphics/146.txt", "/benchmark/data/validation_set_50/comp.graphics/15.txt", "/benchmark/data/validation_set_50/comp.graphics/164.txt", "/benchmark/data/validation_set_50/comp.graphics/17.txt", "/benchmark/data/validation_set_50/comp.graphics/18.txt", "/benchmark/data/validation_set_50/comp.graphics/191.txt", "/benchmark/data/validation_set_50/comp.graphics/193.txt", "/benchmark/data/validation_set_50/comp.graphics/201.txt", "/benchmark/data/validation_set_50/comp.graphics/207.txt", "/benchmark/data/validation_set_50/comp.graphics/21.txt", "/benchmark/data/validation_set_50/comp.graphics/216.txt", "/benchmark/data/validation_set_50/comp.graphics/226.txt", "/benchmark/data/validation_set_50/comp.graphics/23.txt", "/benchmark/data/validation_set_50/comp.graphics/247.txt", "/benchmark/data/validation_set_50/comp.graphics/251.txt", "/benchmark/data/validation_set_50/comp.graphics/263.txt", "/benchmark/data/validation_set_50/comp.graphics/267.txt", "/benchmark/data/validation_set_50/comp.graphics/277.txt", "/benchmark/data/validation_set_50/comp.graphics/278.txt", "/benchmark/data/validation_set_50/comp.graphics/280.txt", "/benchmark/data/validation_set_50/comp.graphics/290.txt", "/benchmark/data/validation_set_50/comp.graphics/291.txt", "/benchmark/data/validation_set_50/comp.graphics/305.txt", "/benchmark/data/validation_set_50/comp.graphics/313.txt", "/benchmark/data/validation_set_50/comp.graphics/336.txt", "/benchmark/data/validation_set_50/comp.graphics/343.txt", "/benchmark/data/validation_set_50/comp.graphics/351.txt", "/benchmark/data/validation_set_50/comp.graphics/352.txt", "/benchmark/data/validation_set_50/comp.graphics/356.txt", "/benchmark/data/validation_set_50/comp.graphics/363.txt", "/benchmark/data/validation_set_50/comp.graphics/380.txt", "/benchmark/data/validation_set_50/comp.graphics/43.txt", "/benchmark/data/validation_set_50/comp.graphics/44.txt", "/benchmark/data/validation_set_50/comp.graphics/45.txt", "/benchmark/data/validation_set_50/comp.graphics/46.txt", "/benchmark/data/validation_set_50/comp.graphics/50.txt", "/benchmark/data/validation_set_50/comp.graphics/55.txt", "/benchmark/data/validation_set_50/comp.graphics/59.txt", "/benchmark/data/validation_set_50/comp.graphics/61.txt", "/benchmark/data/validation_set_50/comp.graphics/76.txt", "/benchmark/data/validation_set_50/comp.graphics/83.txt", "/benchmark/data/validation_set_50/comp.graphics/88.txt", "/benchmark/data/validation_set_50/comp.graphics/9.txt", "/benchmark/data/validation_set_50/comp.graphics/96.txt"]
		windows_topic = 
		["/benchmark/data/validation_set_50/comp.os.ms-windows.misc/102.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/130.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/131.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/133.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/139.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/151.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/155.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/157.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/166.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/171.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/174.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/179.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/180.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/183.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/193.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/225.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/228.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/239.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/244.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/248.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/252.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/253.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/257.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/271.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/293.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/294.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/295.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/301.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/309.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/315.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/340.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/349.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/362.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/367.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/37.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/380.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/389.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/393.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/47.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/58.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/60.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/61.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/66.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/7.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/88.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/95.txt", "/benchmark/data/validation_set_50/comp.os.ms-windows.misc/98.txt"]
		ibm_topic = 
		["/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/109.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/111.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/141.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/144.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/148.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/150.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/151.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/155.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/164.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/165.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/170.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/172.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/188.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/19.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/201.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/216.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/218.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/219.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/227.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/23.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/237.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/238.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/242.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/243.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/245.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/264.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/268.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/282.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/290.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/299.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/3.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/312.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/315.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/325.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/338.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/352.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/360.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/49.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/51.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/62.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/68.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/70.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/84.txt", "/benchmark/data/validation_set_50/comp.sys.ibm.pc.hardware/99.txt"]
		mac_topic = 
		["/benchmark/data/validation_set_50/comp.sys.mac.hardware/100.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/116.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/117.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/127.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/13.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/130.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/135.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/138.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/140.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/152.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/160.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/164.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/173.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/176.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/180.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/185.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/186.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/193.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/2.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/205.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/223.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/251.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/255.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/268.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/271.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/282.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/287.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/295.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/298.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/301.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/303.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/306.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/310.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/334.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/341.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/363.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/367.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/374.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/41.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/49.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/55.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/59.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/6.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/61.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/7.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/80.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/82.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/9.txt", "/benchmark/data/validation_set_50/comp.sys.mac.hardware/98.txt"]
		windows_x_topic = 
		["/benchmark/data/validation_set_50/comp.windows.x/114.txt", "/benchmark/data/validation_set_50/comp.windows.x/135.txt", "/benchmark/data/validation_set_50/comp.windows.x/142.txt", "/benchmark/data/validation_set_50/comp.windows.x/145.txt", "/benchmark/data/validation_set_50/comp.windows.x/150.txt", "/benchmark/data/validation_set_50/comp.windows.x/158.txt", "/benchmark/data/validation_set_50/comp.windows.x/161.txt", "/benchmark/data/validation_set_50/comp.windows.x/171.txt", "/benchmark/data/validation_set_50/comp.windows.x/173.txt", "/benchmark/data/validation_set_50/comp.windows.x/185.txt", "/benchmark/data/validation_set_50/comp.windows.x/193.txt", "/benchmark/data/validation_set_50/comp.windows.x/197.txt", "/benchmark/data/validation_set_50/comp.windows.x/199.txt", "/benchmark/data/validation_set_50/comp.windows.x/206.txt", "/benchmark/data/validation_set_50/comp.windows.x/21.txt", "/benchmark/data/validation_set_50/comp.windows.x/211.txt", "/benchmark/data/validation_set_50/comp.windows.x/212.txt", "/benchmark/data/validation_set_50/comp.windows.x/214.txt", "/benchmark/data/validation_set_50/comp.windows.x/23.txt", "/benchmark/data/validation_set_50/comp.windows.x/232.txt", "/benchmark/data/validation_set_50/comp.windows.x/238.txt", "/benchmark/data/validation_set_50/comp.windows.x/246.txt", "/benchmark/data/validation_set_50/comp.windows.x/250.txt", "/benchmark/data/validation_set_50/comp.windows.x/26.txt", "/benchmark/data/validation_set_50/comp.windows.x/261.txt", "/benchmark/data/validation_set_50/comp.windows.x/269.txt", "/benchmark/data/validation_set_50/comp.windows.x/273.txt", "/benchmark/data/validation_set_50/comp.windows.x/275.txt", "/benchmark/data/validation_set_50/comp.windows.x/278.txt", "/benchmark/data/validation_set_50/comp.windows.x/290.txt", "/benchmark/data/validation_set_50/comp.windows.x/311.txt", "/benchmark/data/validation_set_50/comp.windows.x/313.txt", "/benchmark/data/validation_set_50/comp.windows.x/317.txt", "/benchmark/data/validation_set_50/comp.windows.x/323.txt", "/benchmark/data/validation_set_50/comp.windows.x/332.txt", "/benchmark/data/validation_set_50/comp.windows.x/340.txt", "/benchmark/data/validation_set_50/comp.windows.x/341.txt", "/benchmark/data/validation_set_50/comp.windows.x/343.txt", "/benchmark/data/validation_set_50/comp.windows.x/390.txt", "/benchmark/data/validation_set_50/comp.windows.x/42.txt", "/benchmark/data/validation_set_50/comp.windows.x/45.txt", "/benchmark/data/validation_set_50/comp.windows.x/51.txt", "/benchmark/data/validation_set_50/comp.windows.x/53.txt", "/benchmark/data/validation_set_50/comp.windows.x/65.txt", "/benchmark/data/validation_set_50/comp.windows.x/66.txt", "/benchmark/data/validation_set_50/comp.windows.x/67.txt", "/benchmark/data/validation_set_50/comp.windows.x/70.txt", "/benchmark/data/validation_set_50/comp.windows.x/77.txt", "/benchmark/data/validation_set_50/comp.windows.x/87.txt"]
		forsale_topic = 
		["/benchmark/data/validation_set_50/misc.forsale/102.txt", "/benchmark/data/validation_set_50/misc.forsale/105.txt", "/benchmark/data/validation_set_50/misc.forsale/106.txt", "/benchmark/data/validation_set_50/misc.forsale/108.txt", "/benchmark/data/validation_set_50/misc.forsale/11.txt", "/benchmark/data/validation_set_50/misc.forsale/114.txt", "/benchmark/data/validation_set_50/misc.forsale/115.txt", "/benchmark/data/validation_set_50/misc.forsale/124.txt", "/benchmark/data/validation_set_50/misc.forsale/125.txt", "/benchmark/data/validation_set_50/misc.forsale/126.txt", "/benchmark/data/validation_set_50/misc.forsale/13.txt", "/benchmark/data/validation_set_50/misc.forsale/131.txt", "/benchmark/data/validation_set_50/misc.forsale/134.txt", "/benchmark/data/validation_set_50/misc.forsale/143.txt", "/benchmark/data/validation_set_50/misc.forsale/152.txt", "/benchmark/data/validation_set_50/misc.forsale/153.txt", "/benchmark/data/validation_set_50/misc.forsale/154.txt", "/benchmark/data/validation_set_50/misc.forsale/155.txt", "/benchmark/data/validation_set_50/misc.forsale/160.txt", "/benchmark/data/validation_set_50/misc.forsale/162.txt", "/benchmark/data/validation_set_50/misc.forsale/178.txt", "/benchmark/data/validation_set_50/misc.forsale/179.txt", "/benchmark/data/validation_set_50/misc.forsale/194.txt", "/benchmark/data/validation_set_50/misc.forsale/2.txt", "/benchmark/data/validation_set_50/misc.forsale/226.txt", "/benchmark/data/validation_set_50/misc.forsale/236.txt", "/benchmark/data/validation_set_50/misc.forsale/237.txt", "/benchmark/data/validation_set_50/misc.forsale/252.txt", "/benchmark/data/validation_set_50/misc.forsale/255.txt", "/benchmark/data/validation_set_50/misc.forsale/262.txt", "/benchmark/data/validation_set_50/misc.forsale/268.txt", "/benchmark/data/validation_set_50/misc.forsale/275.txt", "/benchmark/data/validation_set_50/misc.forsale/29.txt", "/benchmark/data/validation_set_50/misc.forsale/291.txt", "/benchmark/data/validation_set_50/misc.forsale/299.txt", "/benchmark/data/validation_set_50/misc.forsale/341.txt", "/benchmark/data/validation_set_50/misc.forsale/360.txt", "/benchmark/data/validation_set_50/misc.forsale/368.txt", "/benchmark/data/validation_set_50/misc.forsale/39.txt", "/benchmark/data/validation_set_50/misc.forsale/4.txt", "/benchmark/data/validation_set_50/misc.forsale/44.txt", "/benchmark/data/validation_set_50/misc.forsale/49.txt", "/benchmark/data/validation_set_50/misc.forsale/7.txt", "/benchmark/data/validation_set_50/misc.forsale/70.txt", "/benchmark/data/validation_set_50/misc.forsale/78.txt", "/benchmark/data/validation_set_50/misc.forsale/80.txt", "/benchmark/data/validation_set_50/misc.forsale/84.txt", "/benchmark/data/validation_set_50/misc.forsale/98.txt"]
		autos_topic = 
		["/benchmark/data/validation_set_50/rec.autos/103.txt", "/benchmark/data/validation_set_50/rec.autos/107.txt", "/benchmark/data/validation_set_50/rec.autos/127.txt", "/benchmark/data/validation_set_50/rec.autos/128.txt", "/benchmark/data/validation_set_50/rec.autos/129.txt", "/benchmark/data/validation_set_50/rec.autos/133.txt", "/benchmark/data/validation_set_50/rec.autos/152.txt", "/benchmark/data/validation_set_50/rec.autos/16.txt", "/benchmark/data/validation_set_50/rec.autos/165.txt", "/benchmark/data/validation_set_50/rec.autos/177.txt", "/benchmark/data/validation_set_50/rec.autos/178.txt", "/benchmark/data/validation_set_50/rec.autos/179.txt", "/benchmark/data/validation_set_50/rec.autos/185.txt", "/benchmark/data/validation_set_50/rec.autos/194.txt", "/benchmark/data/validation_set_50/rec.autos/200.txt", "/benchmark/data/validation_set_50/rec.autos/206.txt", "/benchmark/data/validation_set_50/rec.autos/207.txt", "/benchmark/data/validation_set_50/rec.autos/209.txt", "/benchmark/data/validation_set_50/rec.autos/217.txt", "/benchmark/data/validation_set_50/rec.autos/220.txt", "/benchmark/data/validation_set_50/rec.autos/223.txt", "/benchmark/data/validation_set_50/rec.autos/233.txt", "/benchmark/data/validation_set_50/rec.autos/253.txt", "/benchmark/data/validation_set_50/rec.autos/288.txt", "/benchmark/data/validation_set_50/rec.autos/303.txt", "/benchmark/data/validation_set_50/rec.autos/304.txt", "/benchmark/data/validation_set_50/rec.autos/306.txt", "/benchmark/data/validation_set_50/rec.autos/307.txt", "/benchmark/data/validation_set_50/rec.autos/312.txt", "/benchmark/data/validation_set_50/rec.autos/315.txt", "/benchmark/data/validation_set_50/rec.autos/321.txt", "/benchmark/data/validation_set_50/rec.autos/322.txt", "/benchmark/data/validation_set_50/rec.autos/332.txt", "/benchmark/data/validation_set_50/rec.autos/336.txt", "/benchmark/data/validation_set_50/rec.autos/348.txt", "/benchmark/data/validation_set_50/rec.autos/353.txt", "/benchmark/data/validation_set_50/rec.autos/354.txt", "/benchmark/data/validation_set_50/rec.autos/356.txt", "/benchmark/data/validation_set_50/rec.autos/37.txt", "/benchmark/data/validation_set_50/rec.autos/370.txt", "/benchmark/data/validation_set_50/rec.autos/383.txt", "/benchmark/data/validation_set_50/rec.autos/385.txt", "/benchmark/data/validation_set_50/rec.autos/393.txt", "/benchmark/data/validation_set_50/rec.autos/394.txt", "/benchmark/data/validation_set_50/rec.autos/50.txt", "/benchmark/data/validation_set_50/rec.autos/60.txt", "/benchmark/data/validation_set_50/rec.autos/67.txt", "/benchmark/data/validation_set_50/rec.autos/80.txt"]
		motorcycles_topic = 
		["/benchmark/data/validation_set_50/rec.motorcycles/105.txt", "/benchmark/data/validation_set_50/rec.motorcycles/11.txt", "/benchmark/data/validation_set_50/rec.motorcycles/13.txt", "/benchmark/data/validation_set_50/rec.motorcycles/134.txt", "/benchmark/data/validation_set_50/rec.motorcycles/135.txt", "/benchmark/data/validation_set_50/rec.motorcycles/142.txt", "/benchmark/data/validation_set_50/rec.motorcycles/145.txt", "/benchmark/data/validation_set_50/rec.motorcycles/157.txt", "/benchmark/data/validation_set_50/rec.motorcycles/173.txt", "/benchmark/data/validation_set_50/rec.motorcycles/176.txt", "/benchmark/data/validation_set_50/rec.motorcycles/180.txt", "/benchmark/data/validation_set_50/rec.motorcycles/185.txt", "/benchmark/data/validation_set_50/rec.motorcycles/212.txt", "/benchmark/data/validation_set_50/rec.motorcycles/228.txt", "/benchmark/data/validation_set_50/rec.motorcycles/229.txt", "/benchmark/data/validation_set_50/rec.motorcycles/239.txt", "/benchmark/data/validation_set_50/rec.motorcycles/259.txt", "/benchmark/data/validation_set_50/rec.motorcycles/266.txt", "/benchmark/data/validation_set_50/rec.motorcycles/267.txt", "/benchmark/data/validation_set_50/rec.motorcycles/268.txt", "/benchmark/data/validation_set_50/rec.motorcycles/273.txt", "/benchmark/data/validation_set_50/rec.motorcycles/275.txt", "/benchmark/data/validation_set_50/rec.motorcycles/280.txt", "/benchmark/data/validation_set_50/rec.motorcycles/283.txt", "/benchmark/data/validation_set_50/rec.motorcycles/286.txt", "/benchmark/data/validation_set_50/rec.motorcycles/29.txt", "/benchmark/data/validation_set_50/rec.motorcycles/292.txt", "/benchmark/data/validation_set_50/rec.motorcycles/294.txt", "/benchmark/data/validation_set_50/rec.motorcycles/300.txt", "/benchmark/data/validation_set_50/rec.motorcycles/313.txt", "/benchmark/data/validation_set_50/rec.motorcycles/326.txt", "/benchmark/data/validation_set_50/rec.motorcycles/337.txt", "/benchmark/data/validation_set_50/rec.motorcycles/356.txt", "/benchmark/data/validation_set_50/rec.motorcycles/365.txt", "/benchmark/data/validation_set_50/rec.motorcycles/372.txt", "/benchmark/data/validation_set_50/rec.motorcycles/379.txt", "/benchmark/data/validation_set_50/rec.motorcycles/394.txt", "/benchmark/data/validation_set_50/rec.motorcycles/397.txt", "/benchmark/data/validation_set_50/rec.motorcycles/44.txt", "/benchmark/data/validation_set_50/rec.motorcycles/48.txt", "/benchmark/data/validation_set_50/rec.motorcycles/54.txt", "/benchmark/data/validation_set_50/rec.motorcycles/55.txt", "/benchmark/data/validation_set_50/rec.motorcycles/66.txt", "/benchmark/data/validation_set_50/rec.motorcycles/7.txt", "/benchmark/data/validation_set_50/rec.motorcycles/72.txt", "/benchmark/data/validation_set_50/rec.motorcycles/93.txt"]
		baseball_topic = 
		["/benchmark/data/validation_set_50/rec.sport.baseball/102.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/106.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/113.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/114.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/117.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/122.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/133.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/136.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/142.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/147.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/153.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/159.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/161.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/162.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/165.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/179.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/185.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/195.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/21.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/216.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/222.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/246.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/249.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/253.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/265.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/267.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/269.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/278.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/289.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/29.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/300.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/316.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/323.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/326.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/344.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/351.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/388.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/394.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/44.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/49.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/5.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/6.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/62.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/71.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/8.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/85.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/86.txt", "/benchmark/data/validation_set_50/rec.sport.baseball/93.txt"] 
		hockey_topic = 
		["/benchmark/data/validation_set_50/rec.sport.hockey/103.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/135.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/137.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/157.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/171.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/174.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/189.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/196.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/2.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/200.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/201.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/207.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/210.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/213.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/231.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/238.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/245.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/248.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/25.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/255.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/26.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/276.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/286.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/289.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/296.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/297.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/30.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/319.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/321.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/326.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/328.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/332.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/333.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/344.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/349.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/353.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/354.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/358.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/388.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/394.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/42.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/69.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/70.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/73.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/74.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/80.txt", "/benchmark/data/validation_set_50/rec.sport.hockey/98.txt"] 
		crypt_topic = 
		["/benchmark/data/validation_set_50/sci.crypt/102.txt", "/benchmark/data/validation_set_50/sci.crypt/107.txt", "/benchmark/data/validation_set_50/sci.crypt/109.txt", "/benchmark/data/validation_set_50/sci.crypt/129.txt", "/benchmark/data/validation_set_50/sci.crypt/150.txt", "/benchmark/data/validation_set_50/sci.crypt/170.txt", "/benchmark/data/validation_set_50/sci.crypt/177.txt", "/benchmark/data/validation_set_50/sci.crypt/179.txt", "/benchmark/data/validation_set_50/sci.crypt/2.txt", "/benchmark/data/validation_set_50/sci.crypt/205.txt", "/benchmark/data/validation_set_50/sci.crypt/208.txt", "/benchmark/data/validation_set_50/sci.crypt/211.txt", "/benchmark/data/validation_set_50/sci.crypt/220.txt", "/benchmark/data/validation_set_50/sci.crypt/241.txt", "/benchmark/data/validation_set_50/sci.crypt/243.txt", "/benchmark/data/validation_set_50/sci.crypt/244.txt", "/benchmark/data/validation_set_50/sci.crypt/246.txt", "/benchmark/data/validation_set_50/sci.crypt/248.txt", "/benchmark/data/validation_set_50/sci.crypt/253.txt", "/benchmark/data/validation_set_50/sci.crypt/257.txt", "/benchmark/data/validation_set_50/sci.crypt/266.txt", "/benchmark/data/validation_set_50/sci.crypt/270.txt", "/benchmark/data/validation_set_50/sci.crypt/292.txt", "/benchmark/data/validation_set_50/sci.crypt/298.txt", "/benchmark/data/validation_set_50/sci.crypt/304.txt", "/benchmark/data/validation_set_50/sci.crypt/318.txt", "/benchmark/data/validation_set_50/sci.crypt/34.txt", "/benchmark/data/validation_set_50/sci.crypt/343.txt", "/benchmark/data/validation_set_50/sci.crypt/354.txt", "/benchmark/data/validation_set_50/sci.crypt/355.txt", "/benchmark/data/validation_set_50/sci.crypt/364.txt", "/benchmark/data/validation_set_50/sci.crypt/365.txt", "/benchmark/data/validation_set_50/sci.crypt/366.txt", "/benchmark/data/validation_set_50/sci.crypt/372.txt", "/benchmark/data/validation_set_50/sci.crypt/373.txt", "/benchmark/data/validation_set_50/sci.crypt/376.txt", "/benchmark/data/validation_set_50/sci.crypt/386.txt", "/benchmark/data/validation_set_50/sci.crypt/389.txt", "/benchmark/data/validation_set_50/sci.crypt/395.txt", "/benchmark/data/validation_set_50/sci.crypt/40.txt", "/benchmark/data/validation_set_50/sci.crypt/50.txt", "/benchmark/data/validation_set_50/sci.crypt/53.txt", "/benchmark/data/validation_set_50/sci.crypt/72.txt", "/benchmark/data/validation_set_50/sci.crypt/77.txt", "/benchmark/data/validation_set_50/sci.crypt/80.txt", "/benchmark/data/validation_set_50/sci.crypt/85.txt", "/benchmark/data/validation_set_50/sci.crypt/86.txt", "/benchmark/data/validation_set_50/sci.crypt/9.txt"]
		electronics_topic = 
		["/benchmark/data/validation_set_50/sci.electronics/106.txt", "/benchmark/data/validation_set_50/sci.electronics/11.txt", "/benchmark/data/validation_set_50/sci.electronics/118.txt", "/benchmark/data/validation_set_50/sci.electronics/127.txt", "/benchmark/data/validation_set_50/sci.electronics/13.txt", "/benchmark/data/validation_set_50/sci.electronics/140.txt", "/benchmark/data/validation_set_50/sci.electronics/150.txt", "/benchmark/data/validation_set_50/sci.electronics/17.txt", "/benchmark/data/validation_set_50/sci.electronics/175.txt", "/benchmark/data/validation_set_50/sci.electronics/179.txt", "/benchmark/data/validation_set_50/sci.electronics/181.txt", "/benchmark/data/validation_set_50/sci.electronics/187.txt", "/benchmark/data/validation_set_50/sci.electronics/194.txt", "/benchmark/data/validation_set_50/sci.electronics/195.txt", "/benchmark/data/validation_set_50/sci.electronics/197.txt", "/benchmark/data/validation_set_50/sci.electronics/215.txt", "/benchmark/data/validation_set_50/sci.electronics/228.txt", "/benchmark/data/validation_set_50/sci.electronics/238.txt", "/benchmark/data/validation_set_50/sci.electronics/242.txt", "/benchmark/data/validation_set_50/sci.electronics/243.txt", "/benchmark/data/validation_set_50/sci.electronics/245.txt", "/benchmark/data/validation_set_50/sci.electronics/247.txt", "/benchmark/data/validation_set_50/sci.electronics/260.txt", "/benchmark/data/validation_set_50/sci.electronics/265.txt", "/benchmark/data/validation_set_50/sci.electronics/266.txt", "/benchmark/data/validation_set_50/sci.electronics/287.txt", "/benchmark/data/validation_set_50/sci.electronics/299.txt", "/benchmark/data/validation_set_50/sci.electronics/306.txt", "/benchmark/data/validation_set_50/sci.electronics/311.txt", "/benchmark/data/validation_set_50/sci.electronics/316.txt", "/benchmark/data/validation_set_50/sci.electronics/346.txt", "/benchmark/data/validation_set_50/sci.electronics/35.txt", "/benchmark/data/validation_set_50/sci.electronics/368.txt", "/benchmark/data/validation_set_50/sci.electronics/379.txt", "/benchmark/data/validation_set_50/sci.electronics/388.txt", "/benchmark/data/validation_set_50/sci.electronics/391.txt", "/benchmark/data/validation_set_50/sci.electronics/43.txt", "/benchmark/data/validation_set_50/sci.electronics/48.txt", "/benchmark/data/validation_set_50/sci.electronics/5.txt", "/benchmark/data/validation_set_50/sci.electronics/56.txt", "/benchmark/data/validation_set_50/sci.electronics/59.txt", "/benchmark/data/validation_set_50/sci.electronics/6.txt", "/benchmark/data/validation_set_50/sci.electronics/63.txt", "/benchmark/data/validation_set_50/sci.electronics/71.txt", "/benchmark/data/validation_set_50/sci.electronics/73.txt", "/benchmark/data/validation_set_50/sci.electronics/74.txt"]
		med_topic = 
		["/benchmark/data/validation_set_50/sci.med/108.txt", "/benchmark/data/validation_set_50/sci.med/114.txt", "/benchmark/data/validation_set_50/sci.med/116.txt", "/benchmark/data/validation_set_50/sci.med/134.txt", "/benchmark/data/validation_set_50/sci.med/139.txt", "/benchmark/data/validation_set_50/sci.med/140.txt", "/benchmark/data/validation_set_50/sci.med/153.txt", "/benchmark/data/validation_set_50/sci.med/160.txt", "/benchmark/data/validation_set_50/sci.med/173.txt", "/benchmark/data/validation_set_50/sci.med/183.txt", "/benchmark/data/validation_set_50/sci.med/19.txt", "/benchmark/data/validation_set_50/sci.med/2.txt", "/benchmark/data/validation_set_50/sci.med/201.txt", "/benchmark/data/validation_set_50/sci.med/206.txt", "/benchmark/data/validation_set_50/sci.med/220.txt", "/benchmark/data/validation_set_50/sci.med/222.txt", "/benchmark/data/validation_set_50/sci.med/225.txt", "/benchmark/data/validation_set_50/sci.med/233.txt", "/benchmark/data/validation_set_50/sci.med/247.txt", "/benchmark/data/validation_set_50/sci.med/265.txt", "/benchmark/data/validation_set_50/sci.med/276.txt", "/benchmark/data/validation_set_50/sci.med/277.txt", "/benchmark/data/validation_set_50/sci.med/278.txt", "/benchmark/data/validation_set_50/sci.med/283.txt", "/benchmark/data/validation_set_50/sci.med/293.txt", "/benchmark/data/validation_set_50/sci.med/296.txt", "/benchmark/data/validation_set_50/sci.med/298.txt", "/benchmark/data/validation_set_50/sci.med/299.txt", "/benchmark/data/validation_set_50/sci.med/300.txt", "/benchmark/data/validation_set_50/sci.med/303.txt", "/benchmark/data/validation_set_50/sci.med/318.txt", "/benchmark/data/validation_set_50/sci.med/344.txt", "/benchmark/data/validation_set_50/sci.med/348.txt", "/benchmark/data/validation_set_50/sci.med/349.txt", "/benchmark/data/validation_set_50/sci.med/35.txt", "/benchmark/data/validation_set_50/sci.med/351.txt", "/benchmark/data/validation_set_50/sci.med/355.txt", "/benchmark/data/validation_set_50/sci.med/36.txt", "/benchmark/data/validation_set_50/sci.med/360.txt", "/benchmark/data/validation_set_50/sci.med/388.txt", "/benchmark/data/validation_set_50/sci.med/5.txt", "/benchmark/data/validation_set_50/sci.med/51.txt", "/benchmark/data/validation_set_50/sci.med/69.txt", "/benchmark/data/validation_set_50/sci.med/8.txt", "/benchmark/data/validation_set_50/sci.med/82.txt", "/benchmark/data/validation_set_50/sci.med/84.txt", "/benchmark/data/validation_set_50/sci.med/88.txt", "/benchmark/data/validation_set_50/sci.med/9.txt", "/benchmark/data/validation_set_50/sci.med/94.txt"]
		space_topic = 
		["/benchmark/data/validation_set_50/sci.space/103.txt", "/benchmark/data/validation_set_50/sci.space/106.txt", "/benchmark/data/validation_set_50/sci.space/109.txt", "/benchmark/data/validation_set_50/sci.space/110.txt", "/benchmark/data/validation_set_50/sci.space/129.txt", "/benchmark/data/validation_set_50/sci.space/132.txt", "/benchmark/data/validation_set_50/sci.space/146.txt", "/benchmark/data/validation_set_50/sci.space/148.txt", "/benchmark/data/validation_set_50/sci.space/156.txt", "/benchmark/data/validation_set_50/sci.space/161.txt", "/benchmark/data/validation_set_50/sci.space/168.txt", "/benchmark/data/validation_set_50/sci.space/178.txt", "/benchmark/data/validation_set_50/sci.space/18.txt", "/benchmark/data/validation_set_50/sci.space/186.txt", "/benchmark/data/validation_set_50/sci.space/191.txt", "/benchmark/data/validation_set_50/sci.space/197.txt", "/benchmark/data/validation_set_50/sci.space/207.txt", "/benchmark/data/validation_set_50/sci.space/223.txt", "/benchmark/data/validation_set_50/sci.space/231.txt", "/benchmark/data/validation_set_50/sci.space/248.txt", "/benchmark/data/validation_set_50/sci.space/269.txt", "/benchmark/data/validation_set_50/sci.space/287.txt", "/benchmark/data/validation_set_50/sci.space/296.txt", "/benchmark/data/validation_set_50/sci.space/298.txt", "/benchmark/data/validation_set_50/sci.space/304.txt", "/benchmark/data/validation_set_50/sci.space/351.txt", "/benchmark/data/validation_set_50/sci.space/356.txt", "/benchmark/data/validation_set_50/sci.space/357.txt", "/benchmark/data/validation_set_50/sci.space/363.txt", "/benchmark/data/validation_set_50/sci.space/371.txt", "/benchmark/data/validation_set_50/sci.space/372.txt", "/benchmark/data/validation_set_50/sci.space/373.txt", "/benchmark/data/validation_set_50/sci.space/384.txt", "/benchmark/data/validation_set_50/sci.space/40.txt", "/benchmark/data/validation_set_50/sci.space/42.txt", "/benchmark/data/validation_set_50/sci.space/46.txt", "/benchmark/data/validation_set_50/sci.space/47.txt", "/benchmark/data/validation_set_50/sci.space/50.txt", "/benchmark/data/validation_set_50/sci.space/56.txt", "/benchmark/data/validation_set_50/sci.space/63.txt", "/benchmark/data/validation_set_50/sci.space/68.txt", "/benchmark/data/validation_set_50/sci.space/71.txt", "/benchmark/data/validation_set_50/sci.space/72.txt", "/benchmark/data/validation_set_50/sci.space/73.txt", "/benchmark/data/validation_set_50/sci.space/75.txt", "/benchmark/data/validation_set_50/sci.space/77.txt", "/benchmark/data/validation_set_50/sci.space/95.txt"]
		christian_topic = 
		["/benchmark/data/validation_set_50/soc.religion.christian/109.txt", "/benchmark/data/validation_set_50/soc.religion.christian/110.txt", "/benchmark/data/validation_set_50/soc.religion.christian/113.txt", "/benchmark/data/validation_set_50/soc.religion.christian/123.txt", "/benchmark/data/validation_set_50/soc.religion.christian/130.txt", "/benchmark/data/validation_set_50/soc.religion.christian/134.txt", "/benchmark/data/validation_set_50/soc.religion.christian/162.txt", "/benchmark/data/validation_set_50/soc.religion.christian/164.txt", "/benchmark/data/validation_set_50/soc.religion.christian/17.txt", "/benchmark/data/validation_set_50/soc.religion.christian/179.txt", "/benchmark/data/validation_set_50/soc.religion.christian/186.txt", "/benchmark/data/validation_set_50/soc.religion.christian/195.txt", "/benchmark/data/validation_set_50/soc.religion.christian/199.txt", "/benchmark/data/validation_set_50/soc.religion.christian/200.txt", "/benchmark/data/validation_set_50/soc.religion.christian/204.txt", "/benchmark/data/validation_set_50/soc.religion.christian/205.txt", "/benchmark/data/validation_set_50/soc.religion.christian/227.txt", "/benchmark/data/validation_set_50/soc.religion.christian/230.txt", "/benchmark/data/validation_set_50/soc.religion.christian/235.txt", "/benchmark/data/validation_set_50/soc.religion.christian/236.txt", "/benchmark/data/validation_set_50/soc.religion.christian/261.txt", "/benchmark/data/validation_set_50/soc.religion.christian/280.txt", "/benchmark/data/validation_set_50/soc.religion.christian/283.txt", "/benchmark/data/validation_set_50/soc.religion.christian/285.txt", "/benchmark/data/validation_set_50/soc.religion.christian/289.txt", "/benchmark/data/validation_set_50/soc.religion.christian/301.txt", "/benchmark/data/validation_set_50/soc.religion.christian/305.txt", "/benchmark/data/validation_set_50/soc.religion.christian/307.txt", "/benchmark/data/validation_set_50/soc.religion.christian/315.txt", "/benchmark/data/validation_set_50/soc.religion.christian/316.txt", "/benchmark/data/validation_set_50/soc.religion.christian/320.txt", "/benchmark/data/validation_set_50/soc.religion.christian/321.txt", "/benchmark/data/validation_set_50/soc.religion.christian/327.txt", "/benchmark/data/validation_set_50/soc.religion.christian/33.txt", "/benchmark/data/validation_set_50/soc.religion.christian/337.txt", "/benchmark/data/validation_set_50/soc.religion.christian/343.txt", "/benchmark/data/validation_set_50/soc.religion.christian/344.txt", "/benchmark/data/validation_set_50/soc.religion.christian/348.txt", "/benchmark/data/validation_set_50/soc.religion.christian/351.txt", "/benchmark/data/validation_set_50/soc.religion.christian/356.txt", "/benchmark/data/validation_set_50/soc.religion.christian/358.txt", "/benchmark/data/validation_set_50/soc.religion.christian/36.txt", "/benchmark/data/validation_set_50/soc.religion.christian/365.txt", "/benchmark/data/validation_set_50/soc.religion.christian/369.txt", "/benchmark/data/validation_set_50/soc.religion.christian/64.txt", "/benchmark/data/validation_set_50/soc.religion.christian/8.txt", "/benchmark/data/validation_set_50/soc.religion.christian/90.txt"]
		guns_topic = 
		["/benchmark/data/validation_set_50/talk.politics.guns/107.txt", "/benchmark/data/validation_set_50/talk.politics.guns/11.txt", "/benchmark/data/validation_set_50/talk.politics.guns/119.txt", "/benchmark/data/validation_set_50/talk.politics.guns/120.txt", "/benchmark/data/validation_set_50/talk.politics.guns/121.txt", "/benchmark/data/validation_set_50/talk.politics.guns/130.txt", "/benchmark/data/validation_set_50/talk.politics.guns/140.txt", "/benchmark/data/validation_set_50/talk.politics.guns/141.txt", "/benchmark/data/validation_set_50/talk.politics.guns/148.txt", "/benchmark/data/validation_set_50/talk.politics.guns/16.txt", "/benchmark/data/validation_set_50/talk.politics.guns/168.txt", "/benchmark/data/validation_set_50/talk.politics.guns/172.txt", "/benchmark/data/validation_set_50/talk.politics.guns/173.txt", "/benchmark/data/validation_set_50/talk.politics.guns/174.txt", "/benchmark/data/validation_set_50/talk.politics.guns/187.txt", "/benchmark/data/validation_set_50/talk.politics.guns/21.txt", "/benchmark/data/validation_set_50/talk.politics.guns/210.txt", "/benchmark/data/validation_set_50/talk.politics.guns/224.txt", "/benchmark/data/validation_set_50/talk.politics.guns/229.txt", "/benchmark/data/validation_set_50/talk.politics.guns/244.txt", "/benchmark/data/validation_set_50/talk.politics.guns/251.txt", "/benchmark/data/validation_set_50/talk.politics.guns/252.txt", "/benchmark/data/validation_set_50/talk.politics.guns/256.txt", "/benchmark/data/validation_set_50/talk.politics.guns/267.txt", "/benchmark/data/validation_set_50/talk.politics.guns/27.txt", "/benchmark/data/validation_set_50/talk.politics.guns/279.txt", "/benchmark/data/validation_set_50/talk.politics.guns/29.txt", "/benchmark/data/validation_set_50/talk.politics.guns/3.txt", "/benchmark/data/validation_set_50/talk.politics.guns/325.txt", "/benchmark/data/validation_set_50/talk.politics.guns/330.txt", "/benchmark/data/validation_set_50/talk.politics.guns/332.txt", "/benchmark/data/validation_set_50/talk.politics.guns/344.txt", "/benchmark/data/validation_set_50/talk.politics.guns/35.txt", "/benchmark/data/validation_set_50/talk.politics.guns/351.txt", "/benchmark/data/validation_set_50/talk.politics.guns/39.txt", "/benchmark/data/validation_set_50/talk.politics.guns/44.txt", "/benchmark/data/validation_set_50/talk.politics.guns/45.txt", "/benchmark/data/validation_set_50/talk.politics.guns/52.txt", "/benchmark/data/validation_set_50/talk.politics.guns/53.txt", "/benchmark/data/validation_set_50/talk.politics.guns/61.txt", "/benchmark/data/validation_set_50/talk.politics.guns/67.txt", "/benchmark/data/validation_set_50/talk.politics.guns/70.txt", "/benchmark/data/validation_set_50/talk.politics.guns/78.txt", "/benchmark/data/validation_set_50/talk.politics.guns/91.txt", "/benchmark/data/validation_set_50/talk.politics.guns/93.txt", "/benchmark/data/validation_set_50/talk.politics.guns/97.txt"]
		mideast_topic = 
		["/benchmark/data/validation_set_50/talk.politics.mideast/108.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/110.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/117.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/131.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/139.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/146.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/147.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/15.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/151.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/163.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/169.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/176.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/181.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/184.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/187.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/19.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/194.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/202.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/206.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/208.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/210.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/228.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/245.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/251.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/263.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/265.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/274.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/275.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/305.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/319.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/334.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/336.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/340.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/347.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/348.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/4.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/44.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/51.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/56.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/58.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/66.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/72.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/74.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/75.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/85.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/94.txt", "/benchmark/data/validation_set_50/talk.politics.mideast/96.txt"]
		politics_topic = 
		["/benchmark/data/validation_set_50/talk.politics.misc/10.txt", "/benchmark/data/validation_set_50/talk.politics.misc/106.txt", "/benchmark/data/validation_set_50/talk.politics.misc/107.txt", "/benchmark/data/validation_set_50/talk.politics.misc/116.txt", "/benchmark/data/validation_set_50/talk.politics.misc/127.txt", "/benchmark/data/validation_set_50/talk.politics.misc/130.txt", "/benchmark/data/validation_set_50/talk.politics.misc/135.txt", "/benchmark/data/validation_set_50/talk.politics.misc/136.txt", "/benchmark/data/validation_set_50/talk.politics.misc/140.txt", "/benchmark/data/validation_set_50/talk.politics.misc/153.txt", "/benchmark/data/validation_set_50/talk.politics.misc/162.txt", "/benchmark/data/validation_set_50/talk.politics.misc/173.txt", "/benchmark/data/validation_set_50/talk.politics.misc/176.txt", "/benchmark/data/validation_set_50/talk.politics.misc/178.txt", "/benchmark/data/validation_set_50/talk.politics.misc/180.txt", "/benchmark/data/validation_set_50/talk.politics.misc/193.txt", "/benchmark/data/validation_set_50/talk.politics.misc/220.txt", "/benchmark/data/validation_set_50/talk.politics.misc/226.txt", "/benchmark/data/validation_set_50/talk.politics.misc/228.txt", "/benchmark/data/validation_set_50/talk.politics.misc/23.txt", "/benchmark/data/validation_set_50/talk.politics.misc/234.txt", "/benchmark/data/validation_set_50/talk.politics.misc/24.txt", "/benchmark/data/validation_set_50/talk.politics.misc/246.txt", "/benchmark/data/validation_set_50/talk.politics.misc/253.txt", "/benchmark/data/validation_set_50/talk.politics.misc/258.txt", "/benchmark/data/validation_set_50/talk.politics.misc/259.txt", "/benchmark/data/validation_set_50/talk.politics.misc/261.txt", "/benchmark/data/validation_set_50/talk.politics.misc/266.txt", "/benchmark/data/validation_set_50/talk.politics.misc/267.txt", "/benchmark/data/validation_set_50/talk.politics.misc/286.txt", "/benchmark/data/validation_set_50/talk.politics.misc/288.txt", "/benchmark/data/validation_set_50/talk.politics.misc/299.txt", "/benchmark/data/validation_set_50/talk.politics.misc/301.txt", "/benchmark/data/validation_set_50/talk.politics.misc/308.txt", "/benchmark/data/validation_set_50/talk.politics.misc/37.txt", "/benchmark/data/validation_set_50/talk.politics.misc/5.txt", "/benchmark/data/validation_set_50/talk.politics.misc/50.txt", "/benchmark/data/validation_set_50/talk.politics.misc/61.txt", "/benchmark/data/validation_set_50/talk.politics.misc/68.txt", "/benchmark/data/validation_set_50/talk.politics.misc/73.txt", "/benchmark/data/validation_set_50/talk.politics.misc/74.txt", "/benchmark/data/validation_set_50/talk.politics.misc/83.txt", "/benchmark/data/validation_set_50/talk.politics.misc/88.txt", "/benchmark/data/validation_set_50/talk.politics.misc/89.txt", "/benchmark/data/validation_set_50/talk.politics.misc/92.txt"]
		religion_topic = 		 
		["/benchmark/data/validation_set_50/talk.religion.misc/102.txt", "/benchmark/data/validation_set_50/talk.religion.misc/107.txt", "/benchmark/data/validation_set_50/talk.religion.misc/108.txt", "/benchmark/data/validation_set_50/talk.religion.misc/109.txt", "/benchmark/data/validation_set_50/talk.religion.misc/117.txt", "/benchmark/data/validation_set_50/talk.religion.misc/123.txt", "/benchmark/data/validation_set_50/talk.religion.misc/125.txt", "/benchmark/data/validation_set_50/talk.religion.misc/129.txt", "/benchmark/data/validation_set_50/talk.religion.misc/135.txt", "/benchmark/data/validation_set_50/talk.religion.misc/137.txt", "/benchmark/data/validation_set_50/talk.religion.misc/148.txt", "/benchmark/data/validation_set_50/talk.religion.misc/155.txt", "/benchmark/data/validation_set_50/talk.religion.misc/157.txt", "/benchmark/data/validation_set_50/talk.religion.misc/159.txt", "/benchmark/data/validation_set_50/talk.religion.misc/161.txt", "/benchmark/data/validation_set_50/talk.religion.misc/18.txt", "/benchmark/data/validation_set_50/talk.religion.misc/184.txt", "/benchmark/data/validation_set_50/talk.religion.misc/19.txt", "/benchmark/data/validation_set_50/talk.religion.misc/192.txt", "/benchmark/data/validation_set_50/talk.religion.misc/193.txt", "/benchmark/data/validation_set_50/talk.religion.misc/197.txt", "/benchmark/data/validation_set_50/talk.religion.misc/198.txt", "/benchmark/data/validation_set_50/talk.religion.misc/20.txt", "/benchmark/data/validation_set_50/talk.religion.misc/208.txt", "/benchmark/data/validation_set_50/talk.religion.misc/210.txt", "/benchmark/data/validation_set_50/talk.religion.misc/212.txt", "/benchmark/data/validation_set_50/talk.religion.misc/220.txt", "/benchmark/data/validation_set_50/talk.religion.misc/224.txt", "/benchmark/data/validation_set_50/talk.religion.misc/235.txt", "/benchmark/data/validation_set_50/talk.religion.misc/24.txt", "/benchmark/data/validation_set_50/talk.religion.misc/28.txt", "/benchmark/data/validation_set_50/talk.religion.misc/32.txt", "/benchmark/data/validation_set_50/talk.religion.misc/33.txt", "/benchmark/data/validation_set_50/talk.religion.misc/46.txt", "/benchmark/data/validation_set_50/talk.religion.misc/54.txt", "/benchmark/data/validation_set_50/talk.religion.misc/57.txt", "/benchmark/data/validation_set_50/talk.religion.misc/58.txt", "/benchmark/data/validation_set_50/talk.religion.misc/60.txt", "/benchmark/data/validation_set_50/talk.religion.misc/69.txt", "/benchmark/data/validation_set_50/talk.religion.misc/70.txt", "/benchmark/data/validation_set_50/talk.religion.misc/73.txt", "/benchmark/data/validation_set_50/talk.religion.misc/74.txt", "/benchmark/data/validation_set_50/talk.religion.misc/8.txt", "/benchmark/data/validation_set_50/talk.religion.misc/85.txt", "/benchmark/data/validation_set_50/talk.religion.misc/87.txt", "/benchmark/data/validation_set_50/talk.religion.misc/88.txt", "/benchmark/data/validation_set_50/talk.religion.misc/97.txt"]

	category = categories[19];
	

	// var folder = "./data/20news_test/no_header/";
	var folder = "./data/validation_set_50/"+category+"/";
	console.log(folder)
	var txtdoc = []
		

	$.ajax({
	    url : folder,
	    success: function (data) {
	        $(data).find("a").attr("href", function (i, val) {
				this_file = val.split(""); //make an array of the characters in file name.
				if (this_file.pop() == "t"){ // if this file ends in a 't', it's likely a .txt file.
					txtfiles.push(val)  // folder+
				}
			});
		},
		complete: ()=> {
			// console.log(articleTitles)
			console.log(txtfiles)
			textFileContents = []
			for (let index = 0; index < txtfiles.length; index++) {
				$.get(txtfiles[index], (data) => {
					// articleTitles.push(txtfiles[index].split("/").pop().split("-")[1].split(".txt")[0])
					articleTitles.push(categories_dic[category])
					textFileContents.push(data);
				});
			}
			// let total_doc = txtfiles.length;
	    }
	    
	}).then( ()=> {
		setTimeout(()=> { //todo find a way to get this working by waiting for the async functions to return in stead of setting a timer.
			cntrl = new Pages(textFileContents)
			article_title();
			showText(results_json[cntrl.i]);
			updateWindow();
			resolveProgressButtons()
		},500);
		// console.log(textFileContents)
	});

	console.log(txtfiles)
}



function start_over(){

    if (confirm("Are you sure you want to start over?") == true) {
	    results_json  = []
		exp_data = []
		txtfiles = []
		saved = 1;
		readfiles = []
		txtfilename();
		location.href="../expevl.html"
	}
}


function nextArticle() {

	// for (var i = 0; i < txtfiles.length ; i ++){
	//   	if ( $.inArray(txtfiles[i], readfiles) == -1 ){
	// 		readfiles.push(txtfiles[i])
	// 		articleName = txtfiles[i].split("-")[1].split(".txt")[0]
	// 		fileName = txtfiles[i].split("%")[1].split(".txt")[0]
	// 		console.log(txtfiles[i])
	// 		jQuery.get(txtfiles[i], function(data) {   // jQuery.get('.'+txtfiles[i], function(data) {
	// 				output = data
				 	
	// 			 	// console.log(output)

	//todo decide if we need the saved variable or can just overwrite thejson on every page turn
	if (saved == 0) save_json();
	exp_data = [];	// 		});
	word_idx = [];
	cntrl.i++;
	if(cntrl.i == cntrl.total){
		writeFile();
	} else{
		showText(results_json[cntrl.i]);
		//todo getHighlightsFromMem();
		article_title();
		resolveProgressButtons()
	}

}

function lastArticle() {
			//todo decide if we need the saved variable or can just overwrite thejson on every page turn
			if (saved == 0) save_json();
			exp_data = [];
			word_idx = [];

	  		// readfiles.pop()
	  		// this_article = readfiles.pop()
	  		// readfiles.push(this_article)
	  		// articleName = this_article.split("/").pop().split("-")[1].split(".txt")[0]
	  		// fileName = this_article.split(".txt")[0]
			// // console.log(this_article)
	  		// this_file = this_article.split("");
			// if (this_file.pop() == "t"){
			// 	jQuery.get(this_article, function(data) {   // jQuery.get('.'+txtfiles[i], function(data) {
			// 			output = data
			// 		 	showText(0);
			// 	});
			// }
			cntrl.i--;
			showText(results_json[cntrl.i]);
			//todo getHighlightsFromMem();
			article_title();
			resolveProgressButtons();

}

var words_hash = []; 
var words_array = [];
var results_json = [];
var exp_data = []
var word_idx =[];
var saved = 1;

function save_json(){//shouldOverwrite){  
	// console.log(txtfiles[1])
	// console.log(word_idx)
	let wordsTuple = [];
	for (let index = 0; index < exp_data.length; index++) {
		wordsTuple.push([word_idx[index],exp_data[index]]);	
	}
	let updatedObj = {i: txtfiles[cntrl.i], p: wordsTuple}
	console.log(updatedObj)
	let current_time_s = Math.floor(Date.now() / 1000);
        let tot_time = current_time_s - cntrl.last_time_s;
        cntrl.last_time_s = current_time_s;
        // console.log("time on page: ", tot_time, "(s), currently stored:", updatedObj["secSinceLast"]);
        updatedObj["secSinceLast"]=tot_time;
        cntrl.timeOnPage[cntrl.i] += tot_time;
		// if(shouldOverwrite){ //overwrite the data
		results_json.splice(cntrl.i,1,updatedObj);
        // } else{ //append to the data in this index
        //     results_json.push(updatedObj)
		// }
		// console.log("Did that work? Here's the Data I have now",results_json);
	// for (var i=0;i<exp_data.length;i++){
		// results_json.push({article: txtfiles[cntrl.i], word: exp_data})
		// console.log(results_json)
	// }
	saved = 1;
}

function writeFile(){

	// if (saved == 0) save_json()

	// var jsonContent = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results_json));
	// var a = document.createElement('a');
	// a.href = 'data:' + jsonContent;
	// a.download = 'results.json';
	// a.innerHTML = 'End Study';
	// a.click();
	let toSave = []; //final output array to be built now and saved
        
	let task_key_id = getCookie("task_key_id") //get user data from cookie storage.
	let tutorial_time = parseInt(getCookie("tutorial_time")) //get the lenght of Time they spent in the totorial from the cookies
	let dataset_key = task_key_id.split(",")[1]; //separate out the dataset key so we know what they observed
	let mturk_id = task_key_id.split(",")[2]; //separate their MTurk ID so we know who they are.
	
	//Calculate the Total Time the Task took to complete
	let task_end_time = Math.floor(Date.now() / 1000);
	let task_total_time = task_end_time - cntrl.progress_start_time;

	//first entry contrins all this information
	toSave.push({i: mturk_id, r:dataset_key, t:2, d:0,d1:tutorial_time,d2:task_total_time});

	for (let index = 0; index < cntrl.total; index++) {
		results_json[index].pageTime = cntrl.timeOnPage[index];
		// console.log(results_json[index])
		// toSave.push(this.userData[index]);
	}
	
	//push the remainder of the user data to this file.
	toSave.push(results_json);
	//now Save the file as json to the server with a POST request.
	$.ajax({
		type : "POST",
		url : "./json.php",
		data : {
			json : JSON.stringify(toSave)
		}
		});
		//Call the Callback function final page after being written.
		window.location.replace('./finish.html');
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


function article_title(){
	// articleName = articleTitles[cntrl.i];
	// if (articleName == "guns") articleName = "Guns and Politics";
	// if (articleName == "med") articleName = "Medical";
	// if (articleName == "space") articleName = "Space and Astronomy";
	// if (articleName == "electronics") articleName = "Electronics and Computers";
	// if (articleName == "autos") articleName = "Cars and Truck";

	articleName = articleTitles[cntrl.i];
	
	$("#explaination_title").text("Please highlight any words related to \""+articleName+"\" topic in this Article: ( "+ (cntrl.i+1)+" / "+cntrl.total+ " )")
}

function showText(highlightsFromMem) {
	
	var myElement = document.createElement('chartDiv');
	myElement.style.userSelect = 'none';
	
	d3.dragDisable(window)

	for (var i = 0; i < 500; i++) {
	    svg.selectAll(".explanation-"+i.toString()).remove(); 
	    svg.selectAll(".boxes-"+i.toString()).remove(); 
    }
	svg.selectAll(".words").remove(); 
    // var output = document.getElementById("TextArea").value;
    // var output = sample_txt;
	
	words_hash = []; 
	words_array = [];
	var line_array = cntrl.d[cntrl.i].split("\n");
	
	for (var i = 0; i < line_array.length; i++) {
		this_line = line_array[i].split(" ");
		words_array.push("nextline");

		for (var j = 0; j < this_line.length; j++) {
			words_array.push(this_line[j])
		}
	}

	// if (update_txt == 0){
	if(highlightsFromMem == undefined || highlightsFromMem.p == undefined){ //new article. has not been seen yet
		for (var i = 0; i < words_array.length; i++){
			words_hash.push({word : words_array[i],
							idx: i,
							highlight: 0,
							x : 0,
							y : 0,
							w : 0})
		}
	} else {
		wordsTuple = highlightsFromMem.p;
		console.log("words in memory:", wordsTuple)
		for (let index = 0; index < wordsTuple.length; index++) {
			word_idx.push(wordsTuple[index][0]);
			exp_data.push(wordsTuple[index][1]);	
		}
		for (let i = 0; i < words_array.length; i++) {
			words_hash.push({word : words_array[i],
				idx: i,
				highlight: checkInx(i),
				x : 0,
				y : 0,
				w : 0})
				// console.log(words_hash)
		}
		// console.log("been here before",word_idx,words_hash)

		function checkInx(i){
			if (word_idx.includes(i)){ return 1} else{ return 0}
		}

	}

				var letter_length = getWidthOfText(" ", "sans-serif", "12px"); 
				var box_height = 20;
				var x_pos = explanation_x; //  + clearance;
				var y_pos = explanation_y + box_height + clearance/3;
				var next_line = 25;
				var line_counter = 0;
				var box_words_alignment = 11;
				var exp_margin = 20;

				words_box = svg.selectAll(".boxes")
									.data(words_hash).enter().append("g").attr("class", "words");		

				words_box.append("rect")
					.attr("class",function(d,i){return "boxes-"+i.toString()})
					.each(function (d,i) {
						letters = d.word.split("")

						if (d.word == "nextline") {
							line_counter += 1;
							x_pos = explanation_x + clearance;
							y_pos = explanation_y + box_height + clearance/3 + line_counter*next_line;

							// d.word = ""

							d.x = x_pos;
							d.y = y_pos;
							d.w = getWidthOfText("", "sans-serif", "12px")
							x_pos = x_pos + d.w + letter_length;

						// }else if ( $.inArray("\n", letters) > -1 ) {
						// 	line_counter += 1;
						// 	x_pos = explanation_x + clearance/3;
						// 	y_pos = explanation_y + box_height + clearance/3 + line_counter*next_line;

						// 	d.word = ""

						}else if ((x_pos + (letters.length * letter_length)) > (explanation_x + explanation_width - exp_margin)){
							line_counter += 1;
							x_pos = explanation_x + clearance/3;
							y_pos = explanation_y + box_height + clearance/3 + line_counter*next_line;

							d.x = x_pos;
							d.y = y_pos;
							d.w = getWidthOfText(d.word, "sans-serif", "12px")
							x_pos = x_pos + d.w + letter_length;

						}else{

							d.x = x_pos;
							d.y = y_pos;
							d.w = getWidthOfText(d.word, "sans-serif", "12px")
							x_pos = x_pos + d.w + letter_length;
						}

					})
					.attr("x", function(d,i){
						return d.x;})  
					.attr("y", function(d,i){
						return d.y - box_words_alignment;})  // + d.count*clearance + clearance })
					.attr("width", function(d){
						return d.w;})
					.attr("height", box_height)
					.attr("fill", function(d,i){ 
			       		// if (d.highlight == 0) return "green";
			       		if (d.highlight == 1) return "yellow"; 
			       		// if (d.highlight == 2) return "lightgreen"; 
						// return "white";
					})
					.attr("opacity", function(d,i) { 
						if (d.highlight == 1){
							return 1;	
						// }else if (d.highlight == 2) {
						// 	return 1;	
						}else{
							return 0;
						}
					});
			    

				var dragall = 0;
				var last_sample = 0;
				
				svg.on("mouseup", function(d){ dragall = 0})

				words_box.append("text")
					.attr("class","explanation")
					.attr("class",function(d,i){return "explanation-"+ i.toString()})
					.style("font-size", "12px")
				    .attr("x", function(d,i){
								return d.x})  
				    .attr("y", function(d,i){
								return d.y;})  // + d.count*clearance + clearance })
				    .attr("dy", ".35em")
				    .text(function(d) {
				    	if (d.word == "nextline") {
				    	return "";	
				    	}else{
				    	return d.word; 	
				    	}
				    	
				    })
				    .on("mouseover", function(d){
						var this_sample = d3.select(this).attr('class').split("-")[1]
						if (d.highlight == 0){
							svg.selectAll(".boxes-" + this_sample.toString())
								.attr("fill","yellow")
								.attr("opacity", 0.3);
						}
						svg.selectAll(".boxes-" + this_sample.toString()).moveToBack();
						
					}).style('cursor','pointer')
					.on("mousemove", function(d){
						var this_sample = d3.select(this).attr('class').split("-")[1]
						if ((dragall == 1) & (this_sample != last_sample)){							

							if (d.highlight == 1){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("fill","lightgreen");

								// d.highlight = 2;

								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("opacity", 0);
								
								// d.highlight = 0;

							}else if (d.highlight == 2){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("opacity", 0);
								// d.highlight = 0;
							}else{
								d.highlight = 1;
								svg.selectAll(".boxes-" + this_sample.toString())
									.attr("fill","yellow")
									.attr("opacity", 1);
								// console.log({article: articleName, word: d.word, action: "add"})
								// results_json.push({article: articleName, word: d.word, action: "add"})
								saved = 0;
								word_idx.push(d.idx)
								// console.log(word_idx)
								exp_data.push(d.word)
							}
							 window.getSelection().removeAllRanges();
							 last_sample = this_sample 
						}
					})
					.on("mousedown", function(d){ 
						dragall = 1;
						var this_sample = d3.select(this).attr('class').split("-")[1]
						// if (this_sample == last_sample){
						
							if (d.highlight == 1){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("fill","lightgreen");
					
								// d.highlight = 2;
					
								svg.selectAll(".boxes-" + this_sample.toString())
									.attr("opacity", 0);
								d.highlight = 0;
								dragall = 0;
								// console.log({article: articleName, word: d.word, action: "remove"})
								// results_json.push({article: articleName, word: d.word, action: "remove"})
								index = exp_data.indexOf(d.word);
								if (index > -1) {
									exp_data.splice(index, 1);
								}
								index = word_idx.indexOf(d.idx);
								// console.log(d,index)
								if(index > -1 ){
									word_idx.splice(index, 1);
								}
								if(word_idx.length == 0){
									cntrl.unsaw();
								}
								// console.log(word_idx)
								// exp_data.push(d.word)
								saved = 0
					
							// }else if (d.highlight == 2){
								// svg.selectAll(".boxes-" + this_sample.toString())
								// 	.attr("opacity", 0);
								
								// d.highlight = 0;
					
							}else{
								d.highlight = 1;
								svg.selectAll(".boxes-" + this_sample.toString())
									.attr("fill","yellow")
									.attr("opacity", 1);
									// console.log(d)
									cntrl.saw();
									// console.log({article: articleName, word: d.word, action: "add"})
									// results_json.push({article: articleName, word: d.word, action: "add"})
									word_idx.push(d.idx)
									// console.log(word_idx)
									exp_data.push(d.word)
									saved = 0
							}
								window.getSelection().removeAllRanges();//updateHighlights(this,d)

						
						// }else{
						// dragall = 1;	
						// }
						
					})
					.on("mouseup", function(d){ dragall = 0})
					.on("mouseout", function(d){
						var this_sample = d3.select(this).attr('class').split("-")[1]
						if (d.highlight > 0){
							svg.selectAll(".boxes-" + this_sample.toString())
						}else{
							svg.selectAll(".boxes-" + this_sample.toString())
								.attr("opacity", 0);
						}
					});
			
				height =y_pos; 
				svg.selectAll(".explanation_frame").attr("height", height); 
				svg.attr("height", height + 100); 
}


function updateHighlights(event, d){
	// console.log("called")

}

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


function clearText() {
    document.getElementById("TextArea").value = ""
    for (var i = 0; i < 300; i++) {
	    svg.selectAll(".explanation-"+i.toString()).remove(); 
	    svg.selectAll(".boxes-"+i.toString()).remove(); 
    }
    // svg.selectAll(".words").remove(); 
    svg.selectAll(".result_bar").remove(); 
	svg.selectAll(".result_frame").remove(); 
	svg.selectAll(".class_label").remove(); 
		
}

function removeHighlights(){
	word_idx = [];
	exp_data = [];
	save_json();
	showText(word_idx);
	cntrl.unsaw()
	resolveProgressButtons()

}

var hidRect;
var time_weight = 100, topic_weight = 0, action_weight = 400, cluster_weight = 20;
var max_y = 100;
var each_time_sec;
// var topic_distance;
var colors = d3.scaleOrdinal(d3.schemeCategory10); 

var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
	d3.select(window).on('resize.updatesvg', updateWindow);
		var chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth;  
		var chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; //

var svg = d3.select("#annotation_area").append("svg"),
    margin = {top: 20, right: 50, bottom: 20, left: 50};


	svg.attr("width", (0.6*chart_x - margin.right - margin.left));
	svg.attr("height", 500)

 var width = svg.attr("width");
 var height = 500; //svg.attr("height");   

var points_size = 10;
var Axis_room = 50;


var dataXRange = {min: 0, max: 6000};
var dataYRange = {min: 0, max: max_y};


var x_scale = d3.scaleLinear()
    .domain([dataXRange.min, dataXRange.max])
    .range([margin.left + points_size, width - points_size]);

var y_scale = d3.scaleLinear()
	.domain([dataYRange.min, dataYRange.max])
    .range([height - dataYRange.max, 0 + points_size]);



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
	
	// var explanation_title = svg.append("g").append("text").attr("class","explanation_title")
	// 		  .style("font-weight", "bold")
	// 		  .style("font-size", "15px")
	// 		  .text("Please highlight any words related to \""+folder_name.toString()+"\" topic in this Article:")
	// 		  .attr('dy','0.35em')
	// 		  .attr("x", explanation_x)
	// 		  .attr("y", explanation_y);

	var explanation_frame = svg.append("g").append("rect").attr("class","explanation_frame")
					.attr("x", explanation_x)
					.attr("y", explanation_y)
					.attr("rx", 5)
					.attr("ry", 5)
					.attr("width", explanation_width)
					.attr("height", explanation_height)
					.attr("fill", "white")
					.style("fill-opacity",1)
					.style("stroke","gray")
					.style("stroke-opacity",0.5);


txtfilename();
// nextArticle();

function Pages(files){
	this.progress_start_time = Math.floor(Date.now() / 1000);
    this.last_time_s = this.progress_start_time;
	this.i = 0 // Current page to resolve/look at
	this.d = files; //List of file names
    this.total = files.length //Total number of pages
    this.hasSeen = new Array(this.total) //list of booleans if they have been seen.
    this.timeOnPage = new Array(this.total) //How long have they been looking at this trial/page
    for (let index = 0; index < this.total; index++) { //filling in the list of seen as false at first.
        this.hasSeen[index] = false;
        this.timeOnPage[index] = 0;
        // console.log("filling array's with default values")
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
	// this.back = function (){
    //     // console.log("called Back to page #", this.i, "out of", this.total, "user has seen:",this.hasSeen)
    //     if (this.i > 0){
    //         this.i--;
    //         this.updatePage();
    //     }
    // } 
    // this.next = function(){
    //     // console.log("called Next", this.i,this.total,this.hasSeen)
    //     if(this.i < this.total-1){
    //         this.i++;
    //         this.updatePage();
    //     // todo change the button text on the next to last page so it's clear that they are finishing
    //     }else if(this.i == this.total-1){
    //         document.getElementById("nextbutton-1").innerHTML = "Submit Annotations"
    //         document.getElementById("nextbutton-2").innerHTML = "Submit Annotations"
    //     }else{
    //         this.writeToFile(this.conditionNum);
    //         // this.callBackMethod()
    //     }
    // }
	
}


function updateWindow(){
							 
		chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth; 
		chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; 
		
		
		width = chart_x * 0.8;

		explanation_width = width * 0.8;
		explanation_x = width * 0.09;
	
		svg.attr("width", width);
		svg.attr("height", height).attr("x", explanation_x);

		explanation_frame.attr("width", explanation_width)
						.attr("x", explanation_x)
						.attr("y", explanation_y);

		// explanation_title.attr("x", explanation_x)
		// 				.attr("y", explanation_y - 20);
		
		svg.selectAll(".explanation_frame").attr("height", height); //(3*next_line + line_counter * next_line));
		svg.attr("height", height + 100); //y_pos
		showText(1);
	}
	
function resolveProgressButtons(){
	// console.log(cntrl);
	if(!cntrl.hasSeen[cntrl.i]){//turn off next button
		document.getElementById("nextbutton-1").disabled = true;
		document.getElementById("nextbutton-2").disabled = true;
	} else { //turn on next button
		document.getElementById("nextbutton-1").disabled = false;
		document.getElementById("nextbutton-2").disabled = false;
	}
	if(cntrl.i == cntrl.total-1){
		document.getElementById("nextbutton-1").innerHTML = "Submit Results";
		document.getElementById("nextbutton-2").innerHTML = "Submit Results";
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