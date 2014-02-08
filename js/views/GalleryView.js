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
            this.userModel.on('change', this.onFbConnected, this);
            this.userModel.on('facebook:disconnected', this.onFbDisConnected, this);
            this.requestModel.on(this.requestModel.dataLoadedEvent, this.onVideoLoaded, this);
            this.requestModel.on(this.requestModel.dataNotLoadedEvent, this.onError);  
        },

        fetchData : function () {
            this.userModel.updateLoginStatus();
            this.requestModel.fetchData();
        },

        onFbConnected : function() {
            this.dom.userPhoto.attr("src", this.model.get('pictures').normal);
            this.dom.userName.html(this.model.get('first_name') + '<br/>' + this.model.get('last_name'));
        },

        onFbDisConnected : function(model, response) {
            window.location.hash = "";
        },

        onVideoLoaded : function (data) {
            this.videoCarousel = new CarouselView({
                models   : this.requestModel.trimBySettings(data),
                dom      : {
                    carousel : this.dom.videoCarousel,
                    paging   : this.dom.videoPaging
                }   
            });  
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