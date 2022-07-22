import{closeModal, openModal} from './modal';
import {postData} from '../services/services';

function form(formSelector, openTimeId) {
	// Forms
	const forms = document.querySelectorAll(formSelector);

	const messages = {
		loading: 'img/form/spinner.svg',
		success: 'Ok!Go go go!',
		faild: 'Something wrong...'
	};

	forms.forEach(item => {
		bindFormData(item);
	});


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
		openModal('.modal', openTimeId);

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
			closeModal('.modal');
		}, 4000);
	}
}
export default form;
