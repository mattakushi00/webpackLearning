import './index.scss'

import counter from './js/counter'
import animation from './js/animation'
import $ from 'jquery'
import 'slick-carousel'
counter()
animation()


$('.slider').slick({
	infinite: true,
	slidesToShow: 3,
	slidesToScroll: 1,
	adaptiveHeight: true,
	responsive: [
		{
			breakpoint: 992,
			settings: {
				arrows: false,
				dots: true,
				slidesToShow: 2,
			}
		},
		{
			breakpoint: 769,
			settings: {
				arrows: false,
				dots: true,
				slidesToShow: 1,
			}
		},
		{
			breakpoint: 481,
			settings: {
				arrows: true,
				dots: true,
				slidesToShow: 1,
			}
		}


	]

})
