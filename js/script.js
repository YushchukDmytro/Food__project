"use strict";

window.addEventListener('DOMContentLoaded', () => {

	// Tabs
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabContent = document.querySelectorAll('.tabcontent'),
		tabParent = document.querySelector('.tabheader__items');


	function hideTabContent() {
		tabContent.forEach((item) => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}


	function showTabContent(i = 0) {
		tabContent[i].classList.add('show', 'fade');
		tabContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {

			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});


	// Timer
	const dedline = '2022-07-07';


	function getTimeRemainig(endtime) {
		let days, hours, minutes, seconds;
		const t = Date.parse(endtime) - Date.parse(new Date());

		if (t <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {

			days = Math.floor(t / (1000 * 60 * 60 * 24));
			hours = Math.floor(t / (1000 * 60 * 60) % 24);
			minutes = Math.floor(t / (1000 * 60) % 60);
			seconds = Math.floor((t / 1000) % 60);
		}

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}


	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);


		updateClock();

		function updateClock() {
			const t = getTimeRemainig(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}

	}
	setClock('.timer', dedline);

	//  Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');


	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(openTimeId);
	}

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}


	modal.addEventListener('click', (e) => {

		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {

			closeModal();
		}
	});

	const openTimeId = setTimeout(openModal, 50000);



	function openModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', openModalByScroll);
		}
	}

	window.addEventListener('scroll', openModalByScroll);

	// Class for cards

	class MenuCard {
		constructor(src, alt, title, descr, price, parentElement, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.classes = classes;
			this.price = price;
			this.transfer = 33;
			this.parent = document.querySelector(parentElement);
			this.chengToUAH();
		}

		chengToUAH() {
			this.price = this.price * this.transfer;
		}

		rendor() {
			const element = document.createElement('div');

			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className));

			}
			element.innerHTML = `

			<img src=${this.src} alt=${this.alt}>
			<h3 class="menu__item-subtitle">${this.title}</h3>
			<div class="menu__item-descr">${this.descr}</div>
			<div class="menu__item-divider"></div>
			<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
			</div>

			`;
			this.parent.append(element);
		}
	}

	const getResource = async (url) => {
		const result = await fetch(url);
		if (!result.ok) {
			throw new Error(`Could not fatch ${url}, status wrong ${result.status}`);
		}
		return await result.json();
	};

	getResource('http://localhost:3000/menu')
		.then(data => {
			data.forEach(({
				img,
				altimg,
				title,
				descr,
				price
			}) => {
				new MenuCard(img, altimg, title, descr, price, ".menu .container").rendor();
			});
		});
	// Forms
	const forms = document.querySelectorAll('form');

	const messages = {
		loading: 'img/form/spinner.svg',
		success: 'Ok!Go go go!',
		faild: 'Something wrong...'
	};

	forms.forEach(item => {
		bindFormData(item);
	});

	const postData = async (url, data) => {
		const result = await fetch(url, {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});
		return await result.json();
	};

	function bindFormData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const statusDate = document.createElement('img');
			statusDate.src = messages.loading;
			statusDate.style.cssText = `
		display: block;
		margin: 0 auto;
	`;
			form.insertAdjacentElement('afterend', statusDate);

			const formData = new FormData(form);

			const obj = {};
			formData.forEach(function (value, key) {
				obj[key] = value;
			});

			postData('http://localhost:3000/requests', JSON.stringify(obj))
				.then(data => {
					console.log(data);
					showThanksModal(messages.success);
					statusDate.remove();
				}).catch(() => {
					showThanksModal(messages.faild);
				}).finally(() => {
					form.reset();
				});
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');
		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
	<div class="modal__content">
		<div data-close class="modal__close">&times;</div>
		<div class="modal__title">${message}</div>
	</div>
	`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}
	// Slider

	const slides = document.querySelectorAll('.offer__slide'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		total = document.querySelector('#total'),
		current = document.querySelector('#current');

	let slideIndex = 1;

	showSlide(slideIndex);

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
	} else {
		total.textContent = slides.length;
	}

	function showSlide(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}

		if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach(item => item.style.display = 'none');

		slides[slideIndex - 1].style.display = 'block';

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	function plusSlide(n) {
		showSlide(slideIndex += n);
	}

	next.addEventListener('click', () => {
		plusSlide(1);
	});

	prev.addEventListener('click', () => {
		plusSlide(-1);
	});
});