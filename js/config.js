requirejs.config({
    baseUrl       : 'js/',
    enforceDefine : true,

    paths: {
        //API
        "facebook"         : [
                               "http://connect.facebook.net/en_US/all",
                               "lib/api/fb"
                             ], 
        //jQuery
        "jquery"           : "lib/jquery/jquery.min",
        "jquery.jCarousel" : "lib/jquery/jquery.jcarousel.min",
        "jquery.Hummer"    : "lib/jquer/jquery.hummer.min", 
        //Backbone & Underscore
        "underscore"       : "lib/underscore/underscore.min",
        "backbone"         : "lib/backbone/backbone.min",
        //requirejs plugin
        "text"             : "lib/require/text",
         
    },
    shim: {
        "facebook"  : {
            exports : "FB"
        },
        "jquery.jCarousel" : {
            deps    : ["jquery"],
            exports : "jQuery", 
        },
        "jquery.Hummer" : {
            deps    : ["jquery"],
            exports : "jQuery", 
        },
        "underscore": {
            exports : "_"
        },
        "backbone"  : {
            deps    : ["jquery", "underscore"],
            exports : "Backbone"
        },
    },

    config: {
        'app' : {
           //Facebook Application ID 
           facebookAppId : '420013294796915'  
        }     
    }    
});

define(["facebook", "jquery", "underscore", "backbone"], function () {
    require(["app"]);    
});

