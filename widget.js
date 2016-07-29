/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:net-mydomain-widget-degreeindexer"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    // init my widget
    myWidget.init();
    $('#' + myWidget.id).css('margin', '20px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:net-mydomain-widget-degreeindexer", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "net-mydomain-widget-degreeindexer", // Make the id the same as the cpdefine id
        name: "Widget / degreeindexer", // The descriptive name of your widget.
        desc: "An indexer for woodturning projects", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.createCanvas();
            this.forkSetup();
            this.setText("currentPos", 0);
            //document.currentPos.value = "0";
            
            

            console.log("I am done being initted.");
        },
        rtnRadians: function(someDegrees) {
            var temp;
            var radians;
            
            temp = .01745; //Math.PI() / 180;
            radians = someDegrees * temp;
            
            return radians;
        },
   
        createCanvas: function() {
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            this.drawCircle(0);
        },
        
        clearCanvas: function(context, canvas) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            var w = canvas.width;
            canvas.width = 1;
            canvas.width = w;
        
            
        },
        setText: function (anId,myText){
        var TheTextBox = document.getElementById(anId);
        TheTextBox.value = myText;
        },
        decM: function ( num )
        {
            var p = 100;
            return Math.round( num * p ) / p;
        },
        

        drawCircle: function(myAngle) {
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            var degreesRadio = document.querySelector("input[name=degrees]:checked");
            //var degreesValue = degreesRadio ? degreesRadio.value : "";
            var degreesValue = (360 / parseInt(document.getElementById("majorDiv").value));
            var circleRadius = 170;
            var majorSize = 25;
            var minorSize = 15;
            var x1, y1, x2, y2 = 0;
            var i=0;
            //var y1 = 0;
            //var x2 = 0;
            //var y2 = 0;
            var toRad = Math.PI / 180;
            var angle = 45;
            
            var majorDiv = document.getElementById("majorDiv").value;
            var minorDiv = document.getElementById("minorDiv").value;            
            var majRot = 360 / majorDiv;
            var minRot = 360 / minorDiv;

            this.clearCanvas(ctx, c);
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            ctx.arc(200,200,circleRadius+20,0,2*Math.PI);
            ctx.fillStyle = "#FF0000";
            ctx.lineWidth = 36;
            ctx.stroke();
            ctx.fillStyle = "silver";
            ctx.fill();
            
            ctx.arc(200,200,circleRadius,0,2*Math.PI);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.fillStyle = "white";
            ctx.fill();
            //ctx.arc(200,200,circleRadius,-(.5*Math.PI),(1.5*Math.PI));
 
            
            
            //ctx.arc(200,200,10,0,2*Math.PI);
            //ctx.stroke();
            //ctx.lineWidth = 1;

            
            for (i = 0; i<360; i=i+majRot) {
            x2 = circleRadius * Math.sin(i * toRad);
            y2 = circleRadius * Math.cos(i * toRad);
            x1 = (circleRadius - majorSize) * Math.sin(i * toRad);
            y1 = (circleRadius - majorSize) * Math.cos(i * toRad); 
            ctx.moveTo(x1+200,y1+200);
            ctx.beginPath();
            ctx.moveTo(x1+200,y1+200);
            ctx.lineTo(x2+200,y2+200);
            ctx.stroke();                
            }
            x1 = (circleRadius - 100) * Math.sin(myAngle * toRad);
            y1 = (circleRadius - 100) * Math.cos(myAngle * toRad);            
            x2 = (circleRadius - majorSize) * Math.sin(myAngle * toRad);
            y2 = (circleRadius - majorSize) * Math.cos(myAngle * toRad);             
            ctx.moveTo(x1+200, y1+200);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1+200,y1+200);
            ctx.lineTo(x2+200,y2+200);
            ctx.stroke();
            
            ctx.fillStyle = "YELLOW";
            ctx.font = "30px Arial";
            ctx.strokeText(("Step:" + this.decM(myAngle/degreesValue)), 150,200);            
            ctx.strokeText(myAngle + "°",160,230);

            //x2 = circleRadius * Math.sin(myAngle * toRad);
            //y2 = circleRadius * Math.cos(myAngle * toRad);

            /*for (i = 0; i<360; i=i+minRot) {
            x2 = circleRadius * Math.sin(i * toRad);
            y2 = circleRadius * Math.cos(i * toRad);
            x1 = (circleRadius - minorSize) * Math.sin(i * toRad);
            y1 = (circleRadius - minorSize) * Math.cos(i * toRad);            
            ctx.beginPath();
            ctx.moveTo(x1+200,y1+200);
            ctx.lineTo(x2+200,y2+200);
            ctx.stroke();
            
            } */            
        },      

        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            /*$('#' + this.id + ' .btn-jogR').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-jogR').popover("hide");
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Hello Title",
                    "Hello World from widget " + that.id,
                    1000
                );
            });*/

            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-jogR').click(this.onForwardBtnClick.bind(this));
            $('#' + this.id + ' .btn-jogL').click(this.onBackwardBtnClick.bind(this))
            $('#' + this.id + ' .btn-refresh').click(this.onRefreshBtnClick.bind(this)); 
            $('#' + this.id + ' .btn-indexMajor').click(this.onIndexMajorBtnClick.bind(this)); 
            $('#' + this.id + ' .btn-indexMinor').click(this.onIndexMinorBtnClick.bind(this));             
        },
        sendCtr: 0,
        publishSend: function(gcode) {
            var jsonSend = {
                D: gcode,
                Id: "jog" + this.sendCtr
            };
            chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", jsonSend);
            this.sendCtr++;
            if (this.sendCtr > 999999) this.sendCtr = 0;
        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onForwardBtnClick: function(evt) {
            var cmd = "G91 G0 ";
            var feedrate = 200;
            var mult = 1;
            var xyz = "";
            var val = 1.00;
            var degreesRadio = document.querySelector("input[name=degrees]:checked");
            //var degreesValue = degreesRadio ? degreesRadio.value : "";
            var degreesValue = (360 / parseInt(document.getElementById("majorDiv").value));
            var currentPosition = parseFloat(document.getElementById("currentPos").value);

            xyz = "X";
            val = 1/parseInt(document.getElementById("majorDiv").value);
            //currentPosition = this.decM(currentPosition + (degreesValue * 360));
            currentPosition = this.decM(currentPosition + degreesValue);
            if (currentPosition > 359.9) currentPosition = this.decM(currentPosition - 360);
            this.drawCircle(currentPosition);
            this.setText("currentPos", currentPosition);
            
            cmd += xyz + val + "\nG90\n";
            this.publishSend(cmd);
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "GCode ",
                cmd,
                2000 /* show for 2 second */        
            )
            
               

        },
        onBackwardBtnClick: function(evt) {
            var cmd = "G91 G0 ";
            var feedrate = 200;
            var mult = 1;
            var xyz = "";
            var val = 1.00;
            var degreesRadio = document.querySelector("input[name=degrees]:checked");
            //var degreesValue = degreesRadio ? degreesRadio.value : "";
            var degreesValue = (360 / parseInt(document.getElementById("majorDiv").value));
            var currentPosition = parseFloat(document.getElementById("currentPos").value);

            xyz = "X";
            val = degreesValue;
            currentPosition = this.decM(currentPosition - degreesValue);
            if (currentPosition > 359.9) currentPosition = this.decM(currentPosition - 360);
            if (currentPosition < 0) currentPosition = this.decM(currentPosition + 360);
            this.drawCircle(currentPosition);
            this.setText("currentPos", currentPosition);
            
            cmd += xyz + val + "\nG90\n";
            this.publishSend(cmd);
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "GCode ",
                cmd,
                2000 /* show for 2 second */        
            )
            
               

        },        
        onRefreshBtnClick: function(evt) {
            var majorDiv = document.getElementById("majorDiv").value;
            var minorDiv = document.getElementById("minorDiv").value;
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Debug ",
                "Refresh Click " + majorDiv,
                2000 /* show for 2 second */        
            )
            this.drawCircle(0);
            this.setText("currentPos", 0);
        },
        onIndexMajorBtnClick: function(evt) {
            var majorDiv = document.getElementById("majorDiv").value;
            var minorDiv = document.getElementById("minorDiv").value;
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Debug ",
                "Major Click " + majorDiv,
                2000 /* show for 2 second */        
            )
            this.drawCircle(0);
            console.log("Major button click");
        },  
        onIndexMinorBtnClick: function(evt) {
            var majorDiv = document.getElementById("majorDiv").value;
            var minorDiv = document.getElementById("minorDiv").value;
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Debug ",
                "Minor Click " + minorDiv,
                2000 /* show for 2 second */        
            )
            this.drawCircle(0);
        },         
        

        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up more room since it's showing
            $(window).trigger("resize");
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up less room since it's hiding
            $(window).trigger("resize");
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});