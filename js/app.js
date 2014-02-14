define(['module', 'models/FacebookUser', 'views/LoginView', 'views/GalleryView'], function (module, FacebookUser, LoginView, GalleryView) {
    
    var appMain = Backbone.Router.extend({
         
        routes: {
            ""        : "openLogin",
            "Gallery" : "openGallery"
        },

        initialize : function (templates) {
            this.currentView = null;
            this.container = $("#container");
            this.initFacebookApp();
        },
         
        initFacebookApp : function () {
            FB.init({
                appId: module.config().facebookAppId
            });
        },

        openLogin : function () {
            this.destroyView();
            this.currentView = new LoginView({
                model : new FacebookUser()
            });
        },

        openGallery : function () {
            this.destroyView();
            this.currentView = new GalleryView({
                model : new FacebookUser()
            });
        },

        destroyView : function() {
            if(this.currentView){
                this.currentView.undelegateEvents();
                this.currentView.$el.empty();
                this.currentView = null;
            }
        }

    }); 

    new appMain();
    Backbone.history.start();

});
