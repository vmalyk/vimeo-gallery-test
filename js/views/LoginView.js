define(['text!templates/login.html'], function(loginTemplate) {

    var LoginView = Backbone.View.extend({
        el : "#container",

        initialize : function (options) {
            this.render();
            this.setOptions(options);
            this.registerDOMElements();
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
        
        registerDOMElements : function () {
            this.dom = {
                loginStatus  : this.$('#loginstatus'),
                loginButton  : this.$('#login_fb'),
                logoutButton : this.$('#logout_fb'),   
            }
        }, 

        bindEvents : function () {
            this.model.on('facebook:connected', _.bind(this.onFbConnected, this));
            this.model.on('facebook:disconnected', _.bind(this.onFbDisConnected, this));  
        },

        onFbConnected : function(model, response) {
            window.location.hash = "Gallery";
        },

        onFbDisConnected : function(model, response) {
            window.location.hash = "";
        }, 

        showStatus : function(status) {
            this.dom.loginStatus.text(status);
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