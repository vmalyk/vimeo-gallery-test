define(['jquery.jCarousel'], function() {
    var MAX_WIDTH = 700,
        MAX_PER_PAGE = 2;

    var perPage = 1;    

    var CarouselComponent = function(options) {
        this.dom = options.dom;
        this.models = options.models;
        this.init();
    };

    CarouselComponent.prototype = {
        
        pageTemplate : _.template('<a href="#<%= page %>"><%= page %></a>'),
        
        viewTemplate : _.template('<ul>\
                                       <% _.each(models, function(model, key) { %>\
                                          <%= itemTempate(_.extend({}, model, {number : key})) %>\
                                       <% }); %>\
                                       <% if (models.length % 2 != 0 ) { %><li></li><% } %>\
                                   </ul>'), 

        itemTemplate : _.template('<li>\
                                       <iframe id="player<%= number %>" class="video-player" src="http://player.vimeo.com/video/<%= id %>?api=1&player_id=player<%= number %>" webkitAllowFullScreen mozallowfullscreen allowFullScreen>\
                                       </iframe>\
                                       <div class="video-overlay"></div>\
                                    </li>'),
       
        init : function () {
            this.render();
            this.bindEvents();
            this.enableSwipe(this); 
        },

        render : function () {
            var html = this.viewTemplate({
                  models      : this.models,
                  itemTempate : this.itemTemplate 
                });
            this.dom.carousel.html(html);
        },

        bindEvents : function() {
            var carousel = this.dom.carousel,
                pageTemplate = this.pageTemplate,
                itemCount = this.models.length;

            this.dom.carousel
                .on('jcarousel:reload jcarousel:create', function () {
                    var width = carousel.innerWidth();
                    if (width >= MAX_WIDTH) {
                        width = width / MAX_PER_PAGE;
                        perPage = MAX_PER_PAGE
                    }

                    carousel.jcarousel('items').css('width', width + 'px');
                })
                .jcarousel({
                    wrap: 'circular'
                });

    
            this.dom.paging
                .on('jcarouselpagination:active', 'a', function() {
                    $(this).addClass('active');
                })
                .on('jcarouselpagination:inactive', 'a', function() {
                    $(this).removeClass('active');
                })
                .on('click', function(e) {
                    e.preventDefault();
                })
                .jcarouselPagination({
                    perPage: perPage,
                    item: function(page) {                         
                        return (page <= itemCount) && pageTemplate({ page : page });
                    }
                });

            $(window).on('resize', function() {
                var width = $('.jcarousel').innerWidth();
                $('.jcarousel-pagination').jcarouselPagination('reload', {
                    'perPage': (width >= MAX_WIDTH) ? MAX_PER_PAGE : 1
                });
            });
        },

        goForward : function () {
            var activePage  = $('.jcarousel-pagination').find('a.active'); 
            if (!activePage.is(':last')) {
                activePage.next().click(); 
            } 
        },

        goBack  : function () {
            var activePage  = $('.jcarousel-pagination').find('a.active'); 
            if (!activePage.is(':first')) {
                activePage.prev().click(); 
            }
        }, 

        enableSwipe : function(slider) {

            var time = 1000, // allow movement if < 1000 ms (1 sec)
                range = 50,  // swipe movement of 50 pixels triggers the slider
                x = 0, t = 0, touch = "ontouchend" in document,
                st = (touch) ? 'touchstart' : 'mousedown',
                mv = (touch) ? 'touchmove' : 'mousemove',
                en = (touch) ? 'touchend' : 'mouseup';
            
            $('.jcarousel-wrapper')
                .on(st, function(e){
                    // prevent image drag (Firefox)
                    e.preventDefault();
                    t = (new Date()).getTime();
                    x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
                })
                .on(en, function(e){
                    t = 0; x = 0;
                })
                .on(mv, function(e){
                    e.preventDefault();
                    var newx = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
                    (newx!= x) && e.stopImmediatePropagation();  
                    r = (x === 0) ? 0 : Math.abs(newx - x),
                    // allow if movement < 1 sec
                    ct = (new Date()).getTime();
                    if (t !== 0 && ct - t < time && r > range) {
                        if (newx < x) { slider.goForward(); }
                        if (newx > x) { slider.goBack(); }
                        t = 0; x = 0;
                    }
                });
        },


        undelegateEvents : function () {
            $(window).off('resize');
        },

    };
    
    return CarouselComponent;
});
