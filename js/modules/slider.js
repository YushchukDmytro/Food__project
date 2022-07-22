function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, filds}) {
	// Slider

	const slides = document.querySelectorAll(slide),
		slider = document.querySelector(container),
		prev = document.querySelector(prevArrow),
		next = document.querySelector(nextArrow),
		total = document.querySelector(totalCounter),
		current = document.querySelector(currentCounter),
		slidesWrapper = document.querySelector(wrapper),
		slideFild = document.querySelector(filds),
		width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1;
	let offset = 0;

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}


	slideFild.style.width = 100 * slides.length + '%';
	slideFild.style.display = 'flex';
	slideFild.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';

	slides.forEach(slide => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';
	const indicators = document.createElement('ol'),
		dots = [];
	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
		position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
	`;
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
				box-sizing: content-box;
				flex: 0 1 auto;
				width: 30px;
				height: 6px;
				margin-right: 3px;
				margin-left: 3px;
				cursor: pointer;
				background-color: #fff;
				background-clip: padding-box;
				border-top: 10px solid transparent;
				border-bottom: 10px solid transparent;
				opacity: .5;
				transition: opacity .6s ease;
		`;

		if (i == 0) {
			dot.style.opacity = 1;
		}
		indicators.append(dot);
		dots.push(dot);
	}

	function dotOpacity(dots) {
		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	}

	function slideMove(fild, num) {
		fild.style.transform = `translateX(-${num}px)`;
	}

	function currInfo(curr, index) {
		if (slides.length < 10) {
			curr.textContent = `0${index}`;
		} else {
			curr.textContent = index;
		}
	}

	function widthChange(str) {
		return +str.replace(/\D/g, '');
	}
	next.addEventListener('click', () => {
		if (offset == widthChange(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += +width.replace(/\D/g, '');
		}
		slideMove(slideFild, offset);

		if (slideIndex == slides.length) {

			slideIndex = 1;
		} else {
			slideIndex++;
		}

		currInfo(current, slideIndex);

		dotOpacity(dots);
	});

	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = widthChange(width) * (slides.length - 1);
		} else {
			offset -= +width.replace(/\D/g, '');
		}
		slideMove(slideFild, offset);

		if (slideIndex == 1) {
			slideIndex = slides.length;

		} else {
			slideIndex--;
		}

		currInfo(current, slideIndex);

		dotOpacity(dots);
	});

	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');
			slideIndex = slideTo;
			offset = widthChange(width) * (slideTo - 1);

			slideMove(slideFild, offset);

			currInfo(current, slideIndex);

			dotOpacity(dots);
		});
	});
}
export default slider;