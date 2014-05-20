/* interface */
  var Data = Backbone.Model.extend();
  var Home = Backbone.Model.extend();
  var Sensor = Backbone.Model.extend();
  var HomeList = Backbone.Collection.extend({
	model: Home,
    	url: 'menu.json'
  });
  var DataList = Backbone.Collection.extend({
	model: Data,
    	url: 'data.json',
	parse: function(data){
	  console.log("parse");
	  console.log(data);
	}
  });
  var SensorList = Backbone.Collection.extend({
	model: Sensor,
    	url: 'sensor.json',
	//parse: function(data){
	 // console.log("parse");
	  //console.log(data);
	//}
  });
  var HomeListView = Backbone.View.extend({
	el: '#menu',
    	template: _.template($('#menu-template').html()),
	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addOne, this);
	},
        events: {
		'click .choice' : 'showMenu'
	},
        showMenu: function(e){
		e.preventDefault();
		var id = $(e.currentTarget).data("id");
		alert("showMenu: "+id);
		//var item = this.collection.get(id);
		//var name = item.get("title");
		//alert(name);
		appRouter.navigate(id, true);
		alert(e.currentTarget);
    	},
    	addOne: function(c){
		var homeListItemView = new HomeListItemView({model: c});
		homeListItemView.render();
	},
        render: function(){
		this.collection.forEach(this.addOne, this);
	}
  });
  var DataListView = Backbone.View.extend({
	el: '#menu',
	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addOne, this);
	},
    	addOne: function(c){
		alert("addOne"+c);
		console.log("addOne"+c);
		var dataListItemView = new DataListItemView({model: c});
		dataListItemView.render();
	},
        render: function(){
		alert("DataListView"+ this.collection);
		console.log("DataListView"+ this.collection);
		//$(this.el).html("");
		this.collection.forEach(this.addOne, this);
	}
  });
  var SensorListView = Backbone.View.extend({
	el: '#menu',
	initialize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addOne, this);
	},
    	addOne: function(c){
		alert("addOne"+c);
		console.log("addOne"+c);
		var sensorListItemView = new SensorListItemView({model: c});
		sensorListItemView.render();
	},
        render: function(){
		alert("SensorListView"+ this.collection);
		console.log("SensorListView");
		console.log(this.collection);
		//$(this.el).html("");
		this.collection.forEach(this.addOne, this);
	}
  });
  var HomeListItemView = Backbone.View.extend({
	el: '#menu',
    	template: _.template($('#menu-template').html()),
	render: function(eventName){
		$(this.el).append(this.template(this.model.toJSON()));
		return this;
	}
  });
  var DataListItemView = Backbone.View.extend({
	el: '#content',
    	template: _.template($('#data-template').html()),
	render: function(eventName){
		alert("DataListItemView");
		$(this.el).append(this.template(this.model.toJSON()));
		return this;
	}
  });
  var SensorListItemView = Backbone.View.extend({
	el: '#content',
    	template: _.template($('#sensor-template').html()),
	render: function(eventName){
		alert("SensorListItemView");
		$(this.el).append(this.template(this.model.toJSON()));
		return this;
	}
  });

  var appRouter = new (Backbone.Router.extend({
  routes: {
	"data": "data",
	"sensor": "sensor"
  },
  data: function(){
	alert("data");
	this.dataList = new DataList();
	this.dataListView = new DataListView({collection: this.dataList});
	this.dataListView.render();
	this.dataList.fetch();
  },
  sensor: function(){
	alert("sensor");
	this.sensorList = new SensorList();
	this.sensorListView = new SensorListView({collection: this.sensorList});
	this.sensorListView.render();
	this.sensorList.fetch();
  },
  start: function(){
	alert("start");
	this.homeList = new HomeList();
	this.homeListView = new HomeListView({collection: this.homeList});
	this.homeListView.render();
	this.homeList.fetch();
  }
  }));

var fileSystem;
var app = {
    macAddress: "98:76:B6:00:15:ED",  // get your mac address from bluetoothSerial.list
    chars: "",
    SESSIONID: +new Date,

/* device functions */
  getId: function(id) {
    return document.querySelector(id);
  },
  bindEvents: function(){
    app.getId("#blueConnect").addEventListener("touchstart",app.blueConnect);         
    app.getId("#blueData").addEventListener("touchstart",app.blueData);         
    app.getId("#clearDataButton").addEventListener("click",app.clearLocalData);         
    app.getId("#fileCreateButton").addEventListener("touchstart",app.fileCreate);            
    app.getId("#fileDirButton").addEventListener("touchstart",app.fileDirectoryListing);            
    app.getId("#clearContentButton").addEventListener("touchstart",app.clearContent);            
    app.getId("#getGPSButton").addEventListener("touchstart",app.getGPS);            
    app.getId("#getCameraButton").addEventListener("touchstart",app.getCamera);            
    app.getId("#nativeAlertButton").addEventListener("click",app.nativeAlert);            
    app.getId("#saveDataButton").addEventListener("click",app.saveLocalData);            
    app.getId("#sendSMSButton").addEventListener("click",app.sendSMS);            
    app.getId("#showDataButton").addEventListener("click",app.showLocalData);            
    app.getId("#submitDataButton").addEventListener("click",app.submitLocalData);            
    app.getId("#testDataButton").addEventListener("click",app.testData);            
    app.getId("#fileUploadButton").addEventListener("click",app.uploadFile);            
  },
  clearContent: function() {
    app.getId("#content").innerHTML = "";
  },
  showContent: function(s) {
    app.getId("#content").innerHTML += s;
  },

/* start bluetooth functions */
  blueConnect: function() {
        var connect = function () {
	    alert(app.macAddress);
            app.showContent("Attempting to connect. " +
             "Make sure the serial port is open on the target device.");
            //bluetoothSerial.connect(
            bluetoothSerial.connectInsecure(
                app.macAddress,  // device to connect to
                app.openPort,    // start listening if you succeed
                app.showError    // show the error if you fail
            );
        };
        var disconnect = function () {
            app.showContent("attempting to disconnect");
            bluetoothSerial.disconnect(
                app.closePort,     // stop listening to the port
                app.showError      // show the error if you fail
            );
        };
        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
  },
  openPort: function(){
        blueConnect.innerHTML = "Disconnect";
	var dataString;
        bluetoothSerial.subscribe(':', function (data) {
	    //var app.SESSIONID = +new Date;
            app.showContent(data);
	    alert(data);
	    // key structure - key ring [sessionid1],[sessionid2],[sessionid3]
	    // points to stored data location [sessionid1][data to store]
	    // add another session to the key ring
	    var keyStorage = window.localStorage.getItem("prevKeys");
	    if (keyStorage != null){
			//alert("The following sessions are saved " + keyStorage);
			keyStorage = ""+ keyStorage +","+ app.SESSIONID +"";
		} else {
			var keyStorage = ""+ app.SESSIONID +"";
		}	
		// save session key to key ring
		window.localStorage.setItem("prevKeys", keyStorage);
		alert("Test pull of prevKeys: " + keyStorage);
		// add data to session key
		window.localStorage.setItem(app.SESSIONID, data);
        }, app.showError);
  },
  closePort: function(){
        app.showContent("Disconnected from: " + app.macAddress);
        blueConnect.innerHTML = "Connect";
        bluetoothSerial.unsubscribe(
                function (data) {
                    app.showContent(data);
                },
                app.showError
        );
  },
  blueData: function() {
	    alert("getData Initiated");
	    var text = "g\r";
	    bluetoothSerial.write(text, function(){ alert("getData Succeeded"); }, function(){ alert("getData Failed"); });
  },
  showError: function(error) {
        app.showContent(error);
  },
/* end bluetooth functions */

/* start file storage functions */
  gotFiles: function(entries) { 
    alert("gotFiles");
    var s = "";
    for(var i=0,len=entries.length; i<len; i++) {
	s+= entries[i].fullPath;
	if (entries[i].isFile) {
	  s += " [F]";
	} else {
	  s += " [D]";
	}
	s += "<br/>";
    }
    s+="<p/>";
    app.showContent(s);
  },
  fileDirectoryListing: function(e) {
    alert("fileDirectoryListing");
    //get a directory reader from our FS
    var dirReader = fileSystem.root.createReader();
    dirReader.readEntries(app.gotFiles,app.onError);        
  },
  onFSSuccess: function(fs) {
    //alert("onFSSuccess");
    fileSystem = fs; 
    return fileSystem;
    //app.fileDirectoryListing();
  },
  // file writing f=file,s=string
  fileAppend: function(f) {
    alert("fileAppend");
    f.createWriter(function(writerOb) {
        writerOb.onwrite=function() {
            app.showContent("Done writing to file.<p/>");
        }
        //go to the end of the file...
        writerOb.seek(writerOb.length);
        //writerOb.write("Test at "+new Date().toString() + "\n");
	var localSave = app.getLocalData("local","save");
	alert(localSave);
        writerOb.write(localSave);
	alert("successfully wrote");
    })
  },
  fileCreate: function(e) {
    alert("fileCreate");
    alert(fileSystem);
    fileSystem.root.getFile("test.txt", {create:true}, app.fileAppend, app.onError);
  },
  uploadFile: function(e) {
    alert("uploadFile to SCCWRP");
    var fileURL = "cdvfile://localhost/test.txt";
    function win(r){
	alert(r);
    }
    function fail(error){
	alert(error);
    }

    var uri = encodeURI("http://data.sccwrp.org/sensor/upload.php");

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
    options.mimeType = "text/plain";
    
    var headers={'headerParam':'headerValue'};
    options.headers = headers;

    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent){
	if(progressEvent.lengthComputable){
	  loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
	} else {
	  loadingStatus.increment();
	}
    }
    ft.upload(fileURL, uri, win, fail, options);
  },
/* end file storage */

/* start local storage */
  dataSyncCheck: function(){
	alert("code for dataSyncCheck");
  },
  clearLocalData: function(){
	    alert("clearData");
	    window.localStorage.clear();
	    //window.localStorage.removeItem("prevKeys");
	    alert("Check: " + window.localStorage.getItem("prevKeys"));
  },
  // local function for looping through local data a=local or remote,t=save or delete
  getLocalData: function(a,t){
     alert("a: "+a);
     alert("t: "+t);
     var localSave;
     var prevStorage = window.localStorage.getItem("prevKeys");
     if (prevStorage != null){
	     alert("The following session keys are saved " + prevStorage);
	     var keysArray = prevStorage.split(',');
	     //var connectionStatus = navigator.onLine ? 'online' : 'offline';
	     //if(connectionStatus != "offline") {
	     var currentKey; // currentKey = sessionid
	     var loopNum=keysArray.length;
	     alert("Should loop " + loopNum + " times");
	     for(var i=0; i<loopNum; i++){
		     //alert("Loop number " +  i + "");
		     currentKey = keysArray.pop();
		     var read =  window.localStorage.getItem(currentKey);
		     if(a=="local"){
     			//alert("a: "+a);
			localSave += read;	
		     }
		     //alert("Read Session: "+ read);
		     if(a=="remote"){
			alert(read);
		     	app.submitRemote(read);
		     }
			     //to_submit = read.split(',');
			     //n = oldKey.split('_')[1];
	     }
	     if(a=="local"){
   		alert("a Save: ");
		return localSave;
	     }
	     //window.localStorage.removeItem("prevKeys");
	     //alert("Unable to submit data");
      }

  },
  submitRemote: function(s){
     //function rsubmit(s){
	var url = 'http://data.sccwrp.org/sensor/load.php';
	message = $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {ss: s,tt: ""+ app.SESSIONID +""},
		crossDomain: true,
		timeout: 4000,
		error: function(x,t,m){ 
			 if(t==="timeout"){ alert("Data not Submitted"); }
		}, 
		success: function(data) {
			alert("status:"+data.submit);
			app.dataSyncCheck();
		},
		complete: function(data) {
			//alert("complete:"+data.key);
	        }
    	});
      //} 
      //rsubmit(s);
  },
  saveLocalData: function(){
    alert("saveLocalData");
    fileSystem.root.getFile("test.txt", {create:true}, app.fileAppend, app.onError);
  },
  showLocalData: function(){
    alert("showLocalData");
    app.getLocalData("remote","save");
  },
  submitLocalData: function(){
    alert("submitLocalData");
    app.getLocalData("remote","save");
  },
/* end local storage */

  getGPS: function(){
    alert("GPS");
    var onSuccess = function(position){
	    alert("Latitude: "+ position.coords.latitude);
	    alert("Longitude: "+ position.coords.longitude);
    };
    function onError(error){
	alert("code: "+ error.code);
	alert("message: "+ error.message);
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  },
  getCamera: function(){
    alert("Camera");
    function onSuccess(imageURI){
      var image = document.getElementById('myImage');
      image.src = imageURI;
    }
    function onFail(message){
      alert("Failed because: "+ message);
    }
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
  },
  sendSMS: function(){
	alert("sendSMS");
	//smsplugin.send("5625727718","test from sccwrp",successCallback(result),failureCallback(error));
	sms = window.plugins.sms;
	sms.isSupported(successCallback(function(result) { alert("SMS works"); }), failureCallback(function(result) { alert("SMS failed"); }));
  },
  nativeAlert: function(){
	alert("nativeAlert");
	function helloWorld(){
		alert("helloWorld");
	}
	navigator.notification.alert(
		'Hello World Native Dialog',  //message
		helloWorld,  //callback
		'Hello World Title', //title
		'Finished' //buttonName
	);
  },
  testData: function(){
    alert("testData");
    window.localStorage.setItem("prevKeys", "123456789,234567891");
    window.localStorage.setItem("123456789", "time=14:34:56,PH=4.5,ORP=234,DO=4.7,EC=211μs,T=89,C=4.5");
    window.localStorage.setItem("234567891", "time=09:03:23,PH=3.0,ORP=450,DO=5.9,EC=123μs,T=85,C=2.1");
    var prevStorage = window.localStorage.getItem("prevKeys");
    alert("Test pull on prevKeys: "+ prevStorage);
  },
  onError: function() {
    alert("onError");
  },
  onDeviceReady: function() {
    alert("onDeviceReady");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFSSuccess, app.onError);
    var listPorts = function() {
            bluetoothSerial.list(
                function(results) {
                    app.showContent(JSON.stringify(results));
                },
                function(error) {
                    app.showContent(JSON.stringify(error));
                }
            );
    }
    var notEnabled = function() {
            app.showContent("Bluetooth is not enabled.")
    }
    bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
    );
  },
  initialize: function() {
	//alert("initialize");
	// disable jquery mobile routing
       $.mobile.ajaxEnabled = false;
       $.mobile.linkBindingEnabled = false;
       $.mobile.hashListeningEnabled = false;
       $.mobile.pushStateEnabled = false;
	app.bindEvents();
    	document.addEventListener("deviceready", app.onDeviceReady, true);
  }
};
