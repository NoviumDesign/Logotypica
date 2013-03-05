// extend jquery with "mousewheel" event
(function($){var types=['DOMMouseScroll','mousewheel'];if($.event.fixHooks){for(var i=types.length;i;){$.event.fixHooks[types[--i]]=$.event.mouseHooks}}$.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var i=types.length;i;){this.addEventListener(types[--i],handler,false)}}else{this.onmousewheel=handler}},teardown:function(){if(this.removeEventListener){for(var i=types.length;i;){this.removeEventListener(types[--i],handler,false)}}else{this.onmousewheel=null}}};$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn){return this.unbind("mousewheel",fn)}});function handler(event){var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,returnValue=true,deltaX=0,deltaY=0;event=$.event.fix(orgEvent);event.type="mousewheel";if(orgEvent.wheelDelta){delta=orgEvent.wheelDelta/120}if(orgEvent.detail){delta=-orgEvent.detail/3}deltaY=delta;if(orgEvent.axis!==undefined&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaY=0;deltaX=-1*delta}if(orgEvent.wheelDeltaY!==undefined){deltaY=orgEvent.wheelDeltaY/120}if(orgEvent.wheelDeltaX!==undefined){deltaX=-1*orgEvent.wheelDeltaX/120}args.unshift(event,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args)}})(jQuery);

var minH, maxH, standH, reSize, margin, hideArrows, pos, scrollSpy, scrollBar, relink, totW, readHash;

$wrapper = $('.wrapper');

minH = 650;
maxH = 1000;
standH = 650;	// height when the width will be precise
margin = 100;

// resize
reSize = function() {
	var h, wTot;
	h = $(window).height();
	wTot = 0;

	if(h < minH) {
		h = minH;
	} else if(h > maxH) {
		h = maxH;
	}

	h += -$('nav').outerHeight(true);

	$wrapper.find('.box').each(function() {
		var classList, w;
		classList = $(this)[0].className.split(/\s+/);

		for(var i = 0; i < classList.length; i++) {
			if(classList[i].substr(0, 1) === 'w') {
		    	w = classList[i].substr(1);
		    	break;
			}
		}

		w = Math.floor(w*h/standH);
		$(this).width(w);
		$(this).height(h);
		wTot += w;
	});

	wTot += 20	// +20 -> safe

	totW = wTot;

	$wrapper.width(wTot);

	scrollBar();
}

// hide arrows
hideArrows = function() {
	var totScroll, width, scrollAt;
	scrollAt = $(window).scrollLeft();
	totScroll = $(document).width();
	width = $(window).width();

	if(scrollAt <= 0) {
		if(!$('.arrow.left').hasClass('hidden')) {
			$('.arrow.left').addClass('hidden');
		}
	} else if(totScroll <= scrollAt + width) {
		if(!$('.arrow.right').hasClass('hidden')) {
			$('.arrow.right').addClass('hidden');
		}
	} else {
		$('.arrow.left').removeClass('hidden');
		$('.arrow.right').removeClass('hidden');
	}
}

// scrollSpy
scrollSpy = function() {
	var scrollLeft, wWidth, at;

	scrollLeft = $(window).scrollLeft()
	wWidth = $(window).width();

	$wrapper.find('section').each(function() {
		var offset = $(this).offset();

		if(scrollLeft + wWidth/2 >= offset.left) {
			at = $(this).attr('id');
		} else {
			return;
		}

	});

	$('nav').find('a').each(function() {
		if($(this).attr('href') == '#' + at) {
			if(!$(this).is('.active')) {
				$(this).addClass('active')
			}
		} else {
			$(this).removeClass('active')
		}
	});
}

// scrollBar
scrollBar = function() {
	var wW, scrollW, sliderW, sliderLeft, windowLeft;


	wW = $(window).width();
	windowLeft = $(window).scrollLeft();
	scrollW = $('.process-bar').width();

	// ie 8, 7, 6...
	// if($.browser.msie && $.browser.version < 9) {
	// 	wW = screen.availWidth;
	// 	windowLeft = window.document.documentElement.scrollLeft
	// }

	sliderLeft = scrollW/totW*windowLeft;
	sliderW = wW/totW*scrollW;

	$slider = $('.process-bar .slider').width(sliderW)
	$('.process-bar .slider').css({left: sliderLeft})
}

// relink
relink = function(id) {
	var offset, s;
	
	offset = $('#' + id).offset();

	if(!offset)
		return

	s = offset.left - margin;

	if($.browser.msie && $.browser.version < 8) {
		$(window).scrollLeft(s);
	} else {
		$('html, body').clearQueue().animate({scrollLeft: s}, 200);
	}
}

// read hash
readHash = function() {
	var hash = window.location.hash;

	id = hash.substring(1);

	relink(id);
}

// click arrow
$('.arrow').click(function() {
	var direction, width, left, totW, done;

	width = $(window).width();
	height = $('.wrapper').height();
	scrollLeft = $(window).scrollLeft();

	direction = 'l';
	if($(this).hasClass('right')) {
		direction = 'r';
	}

	totW = 0;

	$wrapper.find('.box').each(function() {

		if(done) {
			return;
		}

		var classList, w;
		classList = $(this)[0].className.split(/\s+/);

		for(var i = 0; i < classList.length; i++) {
			if(classList[i].substr(0, 1) === 'w') {
		    	w = Math.floor(classList[i].substr(1)*height/standH);
		    	totW += w;
		    	break;
			}
		}	

		s = false;
		if(direction == 'l') {
			if(scrollLeft < totW) {
				s = totW - w - margin;
				done = true;
			}
		} else {
			if(scrollLeft + width < totW) {
				s = totW - width + margin;
				done = true;
			}
		}

		if(s != false) {
			if($.browser.msie && $.browser.version < 8) {
				$(document).scrollLeft(s);
			} else {
				$('html, body').clearQueue().animate({scrollLeft: s}, 200);
			}
			return;
		}

	});
});

// scroll
if($.browser.mozilla || $.browser.msie) {
	// firefox and IE
	jQuery(function($) {
		$(document).bind('mousewheel', function(event, delta) {

			var scrollAt, dy;
			dy = -delta*70;

			scrollAt = $(window).scrollLeft();

			if(dy != 0) {
				$(document).scrollLeft(scrollAt + dy);
				event.preventDefault();
			}

	    });
	});
} else {
	// other
	$('body').bind('mousewheel', function(event) {
		var scrollAt, dy;
		dy = -event.originalEvent.wheelDeltaY;

		scrollAt = $(window).scrollLeft();

		if(dy != 0) {
			$('body').scrollLeft(scrollAt + dy);
			event.preventDefault();
		}
	});
}

// other events
$(document).ready(function() {
	reSize();
	hideArrows();

	// transision callback
	setTimeout(
		function() {
			readHash();
			scrollSpy()
		},
		300
	);
})
$(window).resize(function() {
	reSize();
	scrollSpy();
	hideArrows();
	scrollBar();
});
$(window).scroll(function() {
	hideArrows();
	scrollSpy();
	scrollBar();
});

// keys
$(document).keydown(function(event) {
	var k = event.which;
	$arrows = $('.arrows');

	$arrows.removeClass('l r u d')

	// down
	if(k == 83 || k == 40) {
		$arrows.addClass('d');
	}

	// left
	if(k == 65 || k == 37) {
		$arrows.addClass('l');
	}

	// right
	if(k == 68 || k == 39) {
		$arrows.addClass('r');
	}

	// up
	if(k == 87 || k == 38) {
		$arrows.addClass('u');
	}

	setTimeout(
		function() {
			$arrows.removeClass('l r u d')
		}
	, 300)

	if(k == '65' || k == '87' || k == '38' || k == '37') {
		// left
		event.preventDefault();
		$('.arrow.left').click();
	} else if(k == '83' || k == '68' || k == '40' || k == '39') {
		// right
		event.preventDefault();
		$('.arrow.right').click();
	}
});

// drag
$('.wrapper').mousedown(function(event) {
	pos = {
		'how' : 'drag',
		'mx' : event.screenX,
		'dx' : $(document).scrollLeft()
	}
});
$('.process-bar .slider').mousedown(function(event) {
	$(this).addClass('active');
	pos = {
		'how' : 'scroll',
		'mx' : event.screenX,
		'dx' : $(document).scrollLeft()
	}
});

// nav bar
$('nav a').click(function(event) {
	var href, id;

	href = $(this).attr('href');
	id = href.substring(1);

	relink(id);

	window.location.hash = id;

	event.preventDefault();
})


$(document).mouseup(function() {
	pos = '';
	$('.process-bar .slider').removeClass('active');
});
$(document).mousemove(function(event) {
	if(pos) {
		var dx = event.screenX - pos.mx;

		if(pos.how == 'drag') {
			$(document).scrollLeft(pos.dx - dx);
		} else if (pos.how == 'scroll') {
			var scrollW = $('.process-bar').width();
			$(document).scrollLeft(pos.dx + dx*totW/scrollW);
		}
		event.preventDefault();
	}
});

// none dragable imgs
$('*').on('dragstart', function(event) {
	event.preventDefault();
});