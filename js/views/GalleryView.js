define(['models/FacebookUser', 'views/CarouselView' , 'text!templates/profile.html'], 
   function(FacebookUser, CarouselView, profileTemplate) {

    var GalleryView = Backbone.View.extend({
        el : "#container",

        initialize : function () {
            this.model = new FacebookUser();
            this.render();
            this.registerDOMElements();
            this.bindEvents();
            this.model.updateLoginStatus();
        },

        render : function () {            
            this.$el.html(profileTemplate);
            return this;
        },
        
        registerDOMElements : function () {
            this.dom = {
                userPhoto     : this.$('#photo'),
                userName      : this.$('#username'), 
                videoCarousel : this.$('.jcarousel'),
                videoPaging   : this.$('.jcarousel-pagination'),
                logoutButton  : this.$('#logout_fb'),   
            }
        }, 

        bindEvents : function () {
            this.model.on('change', _.bind(this.onFbConnected, this));
            this.model.on('facebook:disconnected', _.bind(this.onFbDisConnected, this));  
        },

        onFbConnected : function() {
            this.dom.userPhoto.attr("src", this.model.get('pictures').normal);
            this.dom.userName.html(this.model.get('first_name') + '<br/>' + this.model.get('last_name'));
            var imgModel = [
              {id: 1, fileName: "img/img1.jpg", description : "Image 1"},
              {id: 2, fileName: "img/img2.jpg", description : "Image 2"},
              {id: 3, fileName: "img/img3.jpg", description : "Image 3"},
              {id: 4, fileName: "img/img4.jpg", description : "Image 4"},
              {id: 5, fileName: "img/img5.jpg", description : "Image 5"}
            ]

            this.videoCarousel = new CarouselView({
                models    : imgModel,
                dom      : {
                    carousel : this.dom.videoCarousel,
                    paging   : this.dom.videoPaging
                }   

            });
        },

        onFbDisConnected : function(model) {
            window.location.hash = "";
        }, 

        showStatus : function(status) {
            this.dom.loginStatus.text(status);
        },

        events : {
            "click #logout_fb" : "logoutHandler",
        },


        logoutHandler : function(event) {
            event.preventDefault();
            this.model.logout();  
        },
        
        undelegateEvents: function () {
            !this.videoCarousel || this.videoCarousel.undelegateEvents();             
        }


    });
    return GalleryView; 
});