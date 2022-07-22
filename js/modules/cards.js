import {getResource} from '../services/services';

function cards() {
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
}

export default cards;