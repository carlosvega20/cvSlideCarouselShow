/*
 * @plugin jQuery cvSlideCarouselShow v0.1
 *
 * @author Carlos Andrés Vega / http://carlosandresvega.com/
 * 
 * Copyright (c) 2012
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *   
 *   test new
 */

 (function($){

    $.fn.cvSlideCarouselShow = function(obj){
    
        var Main = function(){
            var _public = {}, 
				_private = this;
			
			//get Settings	
             _public.settings = function(options){
			 	var data = $(this).data('cvSlideCarouselShow');
                return data;
			 };
            
            _public.init = function(options){
				
                options = $.extend({viewPort: null,
									 miniSlides:null,
									 nextButton: null,
							         prevButton: null,
									 playButton:null,
									 stopButton:null,
									 easing: "linear",
							         duration: 1000,
							         classDisableButtons: "kg_disable",
									 classSelectedItem: "selected",
									 autoplay:false,
									 endless: false, // true for circular carousel
									 startItem:0,
									 currentPosition:0,
									 orientationLandscape:true
					                }, options);
                
                return this.each(function(){
                    var $this = $(this), 
						data = $this.data('cvSlideCarouselShow');
						
                    
                    if (!data) {
                        $(this).data('cvSlideCarouselShow', {
                            target: $this,
							settings: options,
							viewPortContainer: $(options.viewPort).find("ul"),
							items :  $(options.viewPort).find("ul li"),
							totalItems : $(options.viewPort).find("ul li").length,
							itemWidth : $(options.viewPort).find("ul li").outerWidth(true),
							itemHeight : $(options.viewPort).find("ul li").outerHeight(true),
				    		leftValue : $(options.viewPort).find("ul li").outerWidth(true) * (-1),
							currentPosition : options.currentPosition,
							startItem : options.startItem,
							moving : false,
							playing : null
							
                        });
						
						data = $(this).data('cvSlideCarouselShow');
                    }
					
					if(data.totalItems<=1 || data.itemWidth*data.totalItems < $(data.settings.viewPort).width()){
						if(data.settings.nextButton && data.settings.prevButton){
							data.settings.nextButton.remove();
							data.settings.prevButton.remove();
						}
						
					}
					
					if (data.settings.orientationLandscape) {
						$(data.viewPortContainer).css({"width": (data.itemWidth * data.totalItems) + 10 + "px"});
					}
					
					$(data.viewPortContainer).css({"position": "relative","left": "0px"});
					
                    data.items.bind("click.cvSlideCarouselShow", function(event){
                        $this.trigger('update', [$(this).index()]);
                        event.preventDefault();
                    });
			        
			        if (data.settings.classSelectedItem) {
						$(data.items).bind("click.cvSlideCarouselShowEvents", function(event){
							$(data.items).removeClass(data.settings.classSelectedItem);
			            	$(this).addClass(data.settings.classSelectedItem);
							data.startItem = $(this).index();
							event.preventDefault();
						});
			        }
						
					
					$this.cvSlideCarouselShow("goToItem", data.startItem);
					
					if (data.settings.autoplay) 
						$this.cvSlideCarouselShow("play");
						
					if (data.settings.playButton) {
						data.settings.playButton.bind("click.cvSlideCarouselShowEvents",function(event){
							$this.cvSlideCarouselShow("play");
							event.preventDefault();
						});
					}
					
					if (data.settings.stopButton) {
						data.settings.stopButton.bind("click.cvSlideCarouselShowEvents",function(event){
							$this.cvSlideCarouselShow("stop");
							event.preventDefault();
						});
					}
					
					if (data.settings.nextButton) {
						data.settings.nextButton.bind("click.cvSlideCarouselShowEvents",function(event){
							if (data.startItem < data.totalItems-1 || data.settings.endless) {
								$this.cvSlideCarouselShow("goToItem", ++data.startItem);
							}
							event.preventDefault();
						});
					}
					
					if (data.settings.prevButton) {
						data.settings.prevButton.bind("click.cvSlideCarouselShowEvents",function(event){
							if (data.startItem > 0 || data.settings.endless) {
								$this.cvSlideCarouselShow("goToItem", --data.startItem);
							}
							event.preventDefault();
						});
					}
                });
            }
            
            _public.destroy = function(){
                return this.each(function(){
					
                    var $this = $(this);
					$this.cvSlideCarouselShow("stop");
                    $this.unbind('.cvSlideCarouselShowEvents');
                    $this.removeData('cvSlideCarouselShow');
                })
            }
			
            _public.play = function(){
				return this.each(function(){
					var $this = $(this),
					data = $(this).data('cvSlideCarouselShow');
					clearInterval(data.playing);
                	data.playing = setInterval(function(){$this.cvSlideCarouselShow("goToItem", ++data.startItem);}, data.settings.duration);
				});
            }
            
            _public.stop = function(){
				return this.each(function(){
					var data = $(this).data('cvSlideCarouselShow');
                	clearInterval(data.playing);
				});
            }
            
            _public.goToItem = function(itemN){
            	return this.each(function(){
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
						orientation
						, data.settings.duration, data.settings.easing, function(){
	                        data.startItem = itemN;
	                        $this.cvSlideCarouselShow("upDate");
	                    });
						$(data.items[itemN]).trigger('click', [itemN]);
	                }
				});
            }
            
            _public.upDate = function(){
				return this.each(function(){
					var data = $(this).data('cvSlideCarouselShow'),
						limit = 0;
					if (data.settings.orientationLandscape) {
						data.currentPosition = parseInt(data.viewPortContainer.css('left'));
						limit = data.settings.viewPort.width();
					}else{
						data.currentPosition = parseInt(data.viewPortContainer.css('top'));
						limit = data.settings.viewPort.height();
					}
	                if (data.settings.prevButton && data.settings.nextButton && !data.settings.endless) {
	                    if (data.startItem > 0) {
	                        data.settings.classDisableButtons ? data.settings.prevButton.removeClass(data.settings.classDisableButtons) : data.settings.prevButton.show();
	                    }
	                    if (data.startItem <= 0 || data.currentPosition >= 0) {
	                        data.settings.classDisableButtons ? data.settings.prevButton.addClass(data.settings.classDisableButtons) : data.settings.prevButton.hide();
	                    }
	                    if (data.startItem < data.totalItems - 1 || (data.itemWidth * data.totalItems) + data.currentPosition > limit) {
	                        data.settings.classDisableButtons ? data.settings.nextButton.removeClass(data.settings.classDisableButtons) : data.settings.nextButton.show();
	                    }
	                    if (data.startItem >= data.totalItems - 1 || (data.itemWidth * data.totalItems) + data.currentPosition <= limit) {
	                        data.settings.classDisableButtons ? data.settings.nextButton.addClass(data.settings.classDisableButtons) : data.settings.nextButton.hide();
	                    }
	                    
	                }
	                data.moving = false;
	                
	                if (data.startItem >= data.totalItems-1 && !data.settings.endless) 
	                    $(this).cvSlideCarouselShow("stop");
	                
	                
	                $(data.items).removeClass(data.settings.classSelectedItem);
	                $(data.items[data.startItem]).addClass(data.settings.classSelectedItem);
					
					
				});
            }
            
            //Carousel end
            ///////////////////////
            
            return _public;
            
        }();
        
        if (Main[obj]) {
            if ($.isFunction(Main[obj])) {
                return Main[obj].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else {
                return Main[obj];
            }
        }
        else 
            if (typeof obj === 'object' || !obj) {
                return Main.init.apply(this, arguments);
            }
            else {
                $.error(obj + ' does not exist');
            }
    };
})(jQuery);