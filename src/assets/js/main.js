//= components/maskPhone.js
//= components/slider28.js





function initializePhoneNumberMask(selector) {
	const element = document.getElementById(selector);
	if (element) {

		phoneNumberMask(3, '+7(___)___-__-__', [')', '(', '-'], element, true);

		//phoneNumberMask(стартовая позиция курсора,, маска,  массив не заменяемых символов, класс input к которому применяется маска,булево значение эффекта hover маски)

	} else {
		console.warn(`Элемент ${selector} не найден. Маска не будет применена.`);
	}
}

// Инициализация масок для мобильного и стационарного номеров
initializePhoneNumberMask('phone');


function initHeaderStyle() {
	const header = document.getElementById('page-header');
	window.addEventListener('scroll', () => {
		if (window.scrollY > 50) {
			header.classList.add('header-move');
		} else {
			header.classList.remove('header-move');
		}
	});
}

initHeaderStyle();