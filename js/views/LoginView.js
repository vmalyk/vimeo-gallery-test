define(['text!templates/login.html'], function(loginTemplate) {

    var LoginView = Backbone.View.extend({
        el : "#container",

        initialize : function (options) {
            this.render();
            this.setOptions(options);
            this.bindEvents();
            this.model.updateLoginStatus();
        },

        render : function () {            
            this.$el.html(loginTemplate);
            return this;
        },

        setOptions : function (options) {
            this.model = options.model; 
        },
        
        bindEvents : function () {
            this.model.on('facebook:connected', this.onFbConnected, this);
            this.model.on('facebook:disconnected', this.onFbDisConnected, this);  
        },

        onFbConnected : function(model, response) {
            window.location.hash = "Gallery";
        },

        onFbDisConnected : function(model, response) {
            window.location.hash = "";
        }, 

        events : {
            "click #login_fb"  : "loginHandler"
        },

        loginHandler : function() {
            this.model.login()  
        }

    });
    return LoginView; 
});