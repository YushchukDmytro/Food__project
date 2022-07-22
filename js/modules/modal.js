function closeModal(modalSelected) {
	const modal = document.querySelector(modalSelected);

	modal.classList.add('hide');
	modal.classList.remove('show');
	document.body.style.overflow = '';
}

function openModal(modalSelected, openTimeId) {
const modal = document.querySelector(modalSelected);

	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';
	
console.log(2);

	if(openTimeId) {
		clearInterval(openTimeId);
	}
}


function modal(triggerSelected, modalSelected,openTimeId ) {
	//  Modal
	const modalTrigger = document.querySelectorAll(triggerSelected),
		modal = document.querySelector(modalSelected);

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', () => openModal(modalSelected, openTimeId));
	});

	modal.addEventListener('click', (e) => {

		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal(modalSelected);
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {

			closeModal(modalSelected);
		}
	});


	function openModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal(modalSelected, openTimeId);
			window.removeEventListener('scroll', openModalByScroll);
		}
	}

	window.addEventListener('scroll', openModalByScroll);
}
export default modal;
export {closeModal};
export {openModal};

