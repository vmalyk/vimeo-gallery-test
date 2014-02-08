define(['module', 'models/FacebookUser', 'views/LoginView', 'views/GalleryView'], function (module, FacebookUser, LoginView, GalleryView) {
    
    var appMain = Backbone.Router.extend({
         
        routes: {
            ""        : "openLogin",
            "Gallery" : "openGallery"
        },

        initialize : function (templates) {
            this.currentView = null;
            this.container = $("#container");
            this.initFacebookUser();
        },
         
        initFacebookUser : function () {
            FB.init({
                appId: module.config().facebookAppId
            });
            this.facebookUser = new FacebookUser();
        },

        openLogin : function () {
            this.destroyView();
            this.currentView = new LoginView({
                model : this.facebookUser
            });
        },

        openGallery : function () {
            this.destroyView();
            this.currentView = new GalleryView({
                model : this.facebookUser
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
