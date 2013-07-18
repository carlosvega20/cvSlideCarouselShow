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
            loop: false, // true for circular carousel
            currentItem: 0,
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
                currentItem: options.currentItem,
                moving: false,
                playing: null
              });
              data = $(this).data('cvSlideCarouselShow');
            }

            if (data.settings.orientationLandscape) {
              $(data.viewPortContainer).css({'width': (data.itemWidth * data.totalItems) + 10 + 'px'});
            }
            $(data.viewPortContainer).css({'position': 'relative', 'left': '0px'});

            $this.cvSlideCarouselShow('slideTo', data.currentItem);

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
              $this.cvSlideCarouselShow('slideTo', ++data.currentItem);
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
            if (data.settings.loop && data.currentItem > data.totalItems - 1) {
              data.currentItem = itemN = 0;
            }else if (data.settings.loop && data.currentItem <0) {
              data.currentItem = itemN = data.totalItems - 1;
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
                data.currentItem = itemN;
                $this.cvSlideCarouselShow('update');
              }
            );

            $(data.items[itemN]).trigger('clicked', [itemN]);
            }
          });
        },

        update: function() {
          return this.each(function() {
            var $this = $(this),
                data = $(this).data('cvSlideCarouselShow');

            if (data.currentItem >= data.totalItems-1 && !data.settings.loop){
              $(this).cvSlideCarouselShow('stop');
            }

            data.moving = false;
            $(data.items).removeClass(data.settings.classSelectedItem);
            $(data.items[data.currentItem-1]).addClass(data.settings.classSelectedItem);
            $this.trigger('updated', data.currentItem);
          });
        },

        destroy: function() {
          return this.each(function() {
            var $this = $(this);
            $this.cvSlideCarouselShow('stop');
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
