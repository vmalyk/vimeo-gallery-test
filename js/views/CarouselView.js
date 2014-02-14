define(['jquery.jCarousel','jquery.Hammer'], function() {
    var MAX_WIDTH = 700,
        MAX_PER_PAGE = 2;

    var perPage = 1;    

    var CarouselComponent = function(options) {
        this.dom = options.dom;
        this.models = options.models;
        this.render();
        this.bindEvents();
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
                                    </li>'),

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

            //Touch Events

            $('.jcarousel-wrapper').hammer().on('swipeleft',  function(event) {
                console.log(event.currentTarget);
                var activePage  = $('.jcarousel-pagination').find('a.active'); 
                if (!activePage.is(':last')) {
                    activePage.next().click(); 
                } 
            }); 

            $('.jcarousel-wrapper').hammer().on('swiperight', function(event) {
                var activePage  = $('.jcarousel-pagination').find('a.active'); 
                if (!activePage.is(':first')) {
                   activePage.prev().click(); 
                }
            });
            /*
            this.dom.carousel.swipe({
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount) {
                    var activePage  = $('.jcarousel-pagination').find('a.active'); 
                    if (!activePage.is(':last')) {
                       activePage.next().click(); 
                    }  
                },
                swipeRight:function(event, direction, distance, duration, fingerCount) {
                    var activePage  = $('.jcarousel-pagination').find('a.active'); 
                    if (!activePage.is(':first')) {
                       activePage.prev().click(); 
                    }
                },
                threshold:0
            });
               */    
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

        undelegateEvents : function () {
            $(window).off('resize');
        },

    };
    
    return CarouselComponent;
});
