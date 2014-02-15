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
                froogaloop.addEvent('pause', _.bind(view.stopVideoHandler, view));    
                froogaloop.addEvent('finish', _.bind(view.showModalHandler, view));
            }   
        },   
        
        events : {
            "click #logout_fb"       : "logoutHandler",
            "click .close"           : "closeModalHandler",
            "click .video-overlay"   : "playVideoHandler"
        },

        logoutHandler : function(event) {
            event.preventDefault();
            this.userModel.logout();  
        },

        closeModalHandler : function() {
            this.dom.modal.closest('li').find('.video-player,.video-overlay').show();
            this.dom.modal.hide();
        }, 

        showModalHandler : function(data) {
            var iframe = $('#'+data),
                overlay = iframe.closest('li').find('.video-overlay'),  
                modal = this.dom.modal;
            iframe.add(overlay).hide();
            iframe.closest('li').append(modal.show());
        },

        playVideoHandler : function(event) {
            event.preventDefault();
            event.stopPropagation(); 
             $('#event').text(event.type);            
            var target = $(event.target),
                player = target.closest('li').find('.video-player')[0],
                players = $('.video-player');
            _.each(players, function(player) { 
                $f(player).api('pause');
            }); 
            target.hide();
            $f(player).api('play');
        },
        
        stopVideoHandler : function(data) {
            var iframe = $('#'+data);
            iframe.closest('li').find('.video-overlay').show();  
        },   

        undelegateEvents: function () {
            !this.videoCarousel || this.videoCarousel.undelegateEvents();             
        }
    });

    return GalleryView; 
});