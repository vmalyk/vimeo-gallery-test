define(['models/VimeoRequestModel', 'views/CarouselView' , 'text!templates/profile.html','jquery.Hammer'], 
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
                modal         : this.$('#modal'), 
                logoutButton  : this.$('#logout_fb'),   
            }
        }, 

        bindEvents : function () {
            this.userModel.on('change', this.onFbConnected, this);
            this.userModel.on('facebook:disconnected', this.onFbDisConnected, this);
            this.requestModel.on(this.requestModel.dataLoadedEvent, this.onVideoLoaded, this);
            this.requestModel.on(this.requestModel.dataNotLoadedEvent, this.onFbDisConnected);  
        },

        fetchData : function () {
            this.userModel.updateLoginStatus();            
        },

        onFbConnected : function(model) {
            this.dom.userPhoto.attr("src", model.get('pictures')['normal']);
            this.dom.userName.html(model.get('first_name') + '<br/>' + model.get('last_name'));
            this.userModel.isConnected() && this.requestModel.fetchData();
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
            
            var view = this;

            var players = $('.video-player');
            _.each(players, function(player) { 
                $f(player).addEvent('ready', ready);
            }); 

            function ready(player_id) {
                var froogaloop = $f(player_id);
                froogaloop.addEvent('play', _.bind(view.closeModalHandler, view));    
                froogaloop.addEvent('finish', _.bind(view.showModalHandler, view));
            }   
        },   
        
        events : {
            "click #logout_fb"         : "logoutHandler",
            "click .close"             : "closeModalHandler",
            "swipe .jcarousel-wrapper" : "swipeHandler"
        },

        logoutHandler : function(event) {
            event.preventDefault();
            this.userModel.logout();  
        },

        closeModalHandler : function(event) {
            var iframe = this.dom.modal.closest('li').find('.video-player');
            iframe.show();
            this.dom.modal.hide();
        }, 

        swipeHandler : function (event) {
            console.log(event.direction);
        },

        showModalHandler : function(data) {
            var iframe = $('#'+data),
                modal = this.dom.modal,
                list = iframe.closest('li');
            iframe.hide();
            list.append(modal.show());
        },

        undelegateEvents: function () {
            !this.videoCarousel || this.videoCarousel.undelegateEvents();             
        }
    });

    return GalleryView; 
});