define(['models/VimeoRequestModel', 'views/CarouselView' , 'text!templates/profile.html'], 
   function(VimeoRequestModel, CarouselView, profileTemplate) {

    var GalleryView = Backbone.View.extend({
        el : "#container",

        initialize : function (options) {            
            this.render();
            this.setOptions(options);
            this.registerDOMElements();
            this.bindEvents();
            this.fetchData();
        },

        render : function () {
            this.$el.html(profileTemplate);
            return this;
        },
        
        setOptions : function (options) {
            this.userModel = options.model;
            this.requestModel = new VimeoRequestModel(); 
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
            this.userModel.on('change', _.bind(this.onFbConnected, this));
            this.userModel.on('facebook:disconnected', _.bind(this.onFbDisConnected, this));
            this.requestModel.on(this.requestModel.dataLoadedEvent, this.onVideoLoaded);
            this.requestModel.on(this.requestModel.dataNotLoadedEvent, this.onError);  
        },

        fetchData : function () {
            this.userModel.updateLoginStatus();
            this.requestModel.fetchData();
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

        onFbDisConnected : function(model, response) {
            window.location.hash = "";
        },

        onVideoLoaded : function (data) {
           console.log('count fetched : ' + data);
           console.log(data);  
        },   
        
        onError : function () {
            console.log('Gopaaaa!');
        },

        events : {
            "click #logout_fb" : "logoutHandler",
        },


        logoutHandler : function(event) {
            event.preventDefault();
            this.userModel.logout();  
        },
        
        undelegateEvents: function () {
            !this.videoCarousel || this.videoCarousel.undelegateEvents();             
        }


    });
    return GalleryView; 
});