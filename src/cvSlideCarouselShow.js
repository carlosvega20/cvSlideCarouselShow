/*
 * @plugin jQuery cvSlideCarouselShow v0.2
 *
 * @author Carlos Andres Vega carlosvega20@gmail.com
 *
 * Copyright (c) 2012
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */

 (function($) {
  $.fn.cvSlideCarouselShow = function(obj) {
    var Main = function() {
      return {
        init: function(options) {
          options = $.extend({
            easing: 'linear',
            duration: 1000,
            classSelectedItem: 'selected',
            autoplay: false,
            endless: false, // true for circular carousel
            startItem: 0,
            currentPosition: 0,
            orientationLandscape: true
          }, options);

          return this.each(function() {
            var $this = $(this),
            data = $this.data('cvSlideCarouselShow');

            if (!data) {
              $this.data('cvSlideCarouselShow', {
                settings: options,
                viewPortContainer: $this.find('ul'),
                items:  $this.find('ul li'),
                totalItems: $this.find('ul li').length,
                itemWidth: $this.find('ul li').outerWidth(true),
                itemHeight: $this.find('ul li').outerHeight(true),
                leftValue: $this.find('ul li').outerWidth(true) * (-1),
                currentPosition: options.currentPosition,
                startItem: options.startItem,
                moving: false,
                playing: null
              });
              data = $(this).data('cvSlideCarouselShow');
            }

            if (data.settings.orientationLandscape) {
              $(data.viewPortContainer).css({'width': (data.itemWidth * data.totalItems) + 10 + 'px'});
            }
            $(data.viewPortContainer).css({'position': 'relative', 'left': '0px'});

            $(data.items).bind('click.cvSlideCarouselShowEvents', function(e) {
              $(data.items).removeClass(data.settings.classSelectedItem);
              $(this).addClass(data.settings.classSelectedItem);
              data.startItem = $(this).index();
              $this.trigger('updated', [data.startItem]);
              $this.cvSlideCarouselShow('slideTo', data.startItem);
              e.preventDefault();
            });

            $this.cvSlideCarouselShow('slideTo', data.startItem);
            if (data.settings.autoplay) {
              $this.cvSlideCarouselShow('play');
            }
          });
        },

        play: function() {
          return this.each(function() {
            var $this = $(this),
            data = $(this).data('cvSlideCarouselShow');
            clearInterval(data.playing);
            data.playing = setInterval(function() {
              $this.cvSlideCarouselShow('slideTo', ++data.startItem);
            }, data.settings.duration);
          });
        },

        stop: function(){
          return this.each(function() {
            var data = $(this).data('cvSlideCarouselShow');
            clearInterval(data.playing);
          });
        },

        slideTo: function(itemN) {
          return this.each(function() {
            var $this = $(this),
            data = $(this).data('cvSlideCarouselShow');
            if (!data.moving) {
              data.moving = true;
            if (data.settings.endless && data.startItem > data.totalItems - 1) {
              data.startItem = itemN = 0;
            }else if (data.settings.endless && data.startItem <0) {
              data.startItem = itemN = data.totalItems - 1;
            }

            var orientation;
            var leftIndent = -data.itemWidth * itemN;
            var topIndent = -data.itemHeight * itemN;
            if (data.settings.orientationLandscape) {
              orientation = {'left': leftIndent};
            }else{
              orientation = {'top': topIndent};
            }

            data.viewPortContainer.animate(
              orientation,
              data.settings.duration,
              data.settings.easing,
              function() {
                data.startItem = itemN;
                $this.cvSlideCarouselShow('upDate');
              }
            );
            $(data.items[itemN]).trigger('click', [itemN]);
            }
          });
        },

        upDate: function() {
          return this.each(function() {
            var data = $(this).data('cvSlideCarouselShow'),
            limit = 0;
            if (data.settings.orientationLandscape) {
              data.currentPosition = parseInt(data.viewPortContainer.css('left'), 10);
              limit = data.settings.viewPort.width();
            }else{
              data.currentPosition = parseInt(data.viewPortContainer.css('top'), 10);
              limit = data.settings.viewPort.height();
            }
            data.moving = false;
            if (data.startItem >= data.totalItems-1 && !data.settings.endless){
              $(this).cvSlideCarouselShow('stop');
            }
            $(data.items).removeClass(data.settings.classSelectedItem);
            $(data.items[data.startItem]).addClass(data.settings.classSelectedItem);
          });
        },

        destroy: function() {
          return this.each(function() {
            var $this = $(this);
            $this.cvSlideCarouselShow('stop');
            $this.unbind('.cvSlideCarouselShowEvents');
            $this.removeData('cvSlideCarouselShow');
          });
        }
      };
    }();

    if (Main[obj]) {
      if ($.isFunction(Main[obj])) {
        return Main[obj].apply(this, Array.prototype.slice.call(arguments, 1));
      } else {
        return Main[obj];
      }
    } else if (typeof obj === 'object' || !obj) {
      return Main.init.apply(this, arguments);
    } else {
      $.error(obj + ' does not exist');
    }
  };
})(jQuery);
