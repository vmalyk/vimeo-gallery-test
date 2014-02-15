requirejs.config({
    baseUrl       : 'js/',
    enforceDefine : true,

    paths: {
        //API
        "facebook"         : [
                               "http://connect.facebook.net/en_US/all",
                               "lib/api/fb"
                             ],
        "frogaloop"        : "lib/api/froogaloop.min",                      
        //jQuery
        "jquery"           : "lib/jquery/jquery.min",
        "jquery.jCarousel" : "lib/jquery/jquery.jcarousel.min",
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
        "frogaloop" : {
            exports : "$f",
        },
        "jquery.jCarousel" : {
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
        },
        //Config Vimeo Video Requests 
        'models/VimeoRequestModel' : {
            userName      :  'brad',
            maxVideoCount :  5
        }     
    }    
});

define(["facebook", "frogaloop", "jquery", "underscore", "backbone"], function () {
    require(["app"]);    
});

