
////////////////////////////////////////////////////////////

 $(function () {
        var $ruler = $('.ruler'),
            $sliderbar = $ruler.find('.sliderbar'),
            $labels = $sliderbar.find('.line'),
            min = parseInt($sliderbar.attr('data-min')),
            max = parseInt($sliderbar.attr('data-max')),
            labelW = parseInt($labels.attr('data-width')),
            currents = $sliderbar.find('.current'),
            $dot = $sliderbar.find('.touch-dot');
        $sliderbar.scrollbarX({
            touchstart: function (v) {
                $dot.css('left', v.currentIndex + '%');
               // $dot.html(v.currentIndex);
                $dot.show();
                
                //100+
                if(v.currentIndex==100){
	                $dot.html(v.currentIndex+"+");
                }else{
	                $dot.html(v.currentIndex);
                }
                
                
            },
            touchmove: function (v) {
                var $current = this,
                    $not = null;
                $span = $current.find('span');
                
                if (currents.length > 1) {
                    currents.each(function (index, curr) {
                        if ($(curr).attr('data-bar') != $current.attr('data-bar')) {
                            $not = $(curr);
//                          console.log($(curr).attr('data-bar'));
//                          console.log($current.attr('data-bar'));
                        }
                    })

                    if ($current.attr('data-bar') == '1' && v.currentIndex >= parseInt($not.attr('data-index'))) {
                        return;
                    } else if ($current.attr('data-bar') == '2' && v.currentIndex <= parseInt($not.attr('data-index'))) {
                        return;
                    }
                	//console.log($current);


                }
                
                $dot.css('left', v.currentIndex + '%');
                $current.width(v.x);
                $current.attr('data-index', v.currentIndex);
                
                //100+
                if(v.currentIndex==100){
//	                $span.html(v.currentIndex+"+");
//	                $dot.html(v.currentIndex+"+");
	                $span.html("99+");
	                $dot.html("99+");
                }else{
	                $span.html(v.currentIndex);
	                $dot.html(v.currentIndex);
                }
                
                //console.log(v.currentIndex);
            },
            touchend: function () {
                $dot.hide();
                var max = parseInt($sliderbar.find('.max-dot span').html()),
                    min = parseInt($sliderbar.find('.min-dot span').html());
				
                //console.log(min, max);
            }
        });
 		
 		//
 		$ruler.on('setvalue', function (ev, paras) {
		        $sliderbar.find('[data-bar=1]').attr('data-index', paras.min).find('span').html(paras.min);
		        $sliderbar.find('[data-bar=2]').attr('data-index', paras.max).find('span').html(paras.max);
		        $sliderbar.trigger('refresh');
		 })
		

 
 
 });