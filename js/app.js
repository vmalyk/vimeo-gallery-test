define(['module','views/LoginView','views/GalleryView'], function (module, LoginView, GalleryView) {
    FB.init({
        appId: module.config().facebookAppId
    });
    
    var appMain = Backbone.Router.extend({

        routes: {
            ""        : "openLogin",
            "Gallery" : "openGallery"
        },

        
        openLogin : function () {
            this.destroyView();
            this.currentView = new LoginView();
        },

        openGallery : function () {
        	this.destroyView();
            this.currentView = new GalleryView();
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
