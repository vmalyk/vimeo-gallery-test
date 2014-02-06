define(['jquery.jCarousel'], function() {
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
                                       <% _.each(models, function(model) { %>\
                                          <%= itemTempate(model) %>\
                                       <% }); %>\
                                       <li></li>\
                                   </ul>'), 

        itemTemplate : _.template('<li><img src="<%= fileName %>" alt="<%= description %>"></li>'),

        render : function () {
            var html = this.viewTemplate({
                  models      : this.models,
                  itemTempate : this.itemTemplate 
                });
            this.dom.carousel.html(html);
        },

        bindEvents : function() {
            var carousel = this.dom.carousel,
                pageTemplate = this.pageTemplate;

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
                        return pageTemplate({ page : page });
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
