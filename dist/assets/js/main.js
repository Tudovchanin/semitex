
const phoneNumberMask = (positionStart, mask, arrSymbols, element, hover = false) => {
	const input = element;
	const lengthMask = mask.length;
	const numberPlaceholderArr = mask.split('');
	let valueArrMask = mask.split('');
	let valueUser = '';
	let indexValue = positionStart;
	let cursorPosition = positionStart;
	let inputFocus = false;


	input.addEventListener('focus', handleFocus);
	input.addEventListener('blur', handleBlur);
	input.addEventListener('keydown', handleKeydown);
	input.addEventListener('click', handleClick);


	if (hover) {
		input.addEventListener('mouseenter', handleMouseenter);
		input.addEventListener('mouseleave', handleMouseleave);
	}




	// Функция для удаления всех слушателей
	function removeAllListeners() {
		input.removeEventListener('focus', handleFocus);
		input.removeEventListener('blur', handleBlur);
		input.removeEventListener('keydown', handleKeydown);
		input.removeEventListener('click', handleClick);

		if (hover) {
			input.removeEventListener('mouseenter', handleMouseEnter); // Если у вас есть обработчики для hover
			input.removeEventListener('mouseleave', handleMouseLeave); // Если у вас есть обработчики для hover
		}
	};


	function handleMouseenter(e) {
		if (!valueUser.length) {
			e.target.value = mask;
		}
	}

	function handleMouseleave(e) {
		if (!valueUser.length && !inputFocus) {
			e.target.value = '';
		}
	}

	function handleFocus(e) {
		inputFocus = true;
		if (!valueUser.length) {
			e.target.value = mask;
			setCursorPosition(input, positionStart)
		}
	}

	function handleBlur(e) {
		inputFocus = false;
		if (!valueUser.length) {
			e.target.value = '';
		}
	}

	function handleKeydown(e) {
		e.preventDefault()
		const key = e.key;
		if (key === 'Tab') return;
		if (key === 'Delete' && cursorPosition < indexValue) {
			if (cursorPosition < positionStart) {
				cursorPosition = positionStart;
				setCursorPosition(e.target, cursorPosition);
				return;
			}
			if (arrSymbols.includes(valueArrMask[indexValue - 1]) || valueArrMask[indexValue - 1] === ' ') {
				indexValue = decrementIndexValue(indexValue);
			}

			indexValue = decrementIndexValue(indexValue);
			valueArrMask = deleteNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
			valueUser = deleteLastCharacter(valueUser);
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
			return;
		}



		if (key === 'ArrowRight') {
			cursorPosition < lengthMask && cursorPosition++;
			setCursorPosition(e.target, cursorPosition);
		} if (key === 'ArrowLeft') {
			cursorPosition > 0 && cursorPosition--;
			setCursorPosition(e.target, cursorPosition);
		}

		if (key === 'Backspace' && indexValue > positionStart) {

			if (arrSymbols.includes(valueArrMask[indexValue - 1]) || valueArrMask[indexValue - 1] === ' ') {
				indexValue = decrementIndexValue(indexValue);
				indexValue = decrementIndexValue(indexValue);
				valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
				cursorPosition = indexValue;
				setTimeout(() => {
					e.target.value = valueArrMask.join('');
					setCursorPosition(e.target, cursorPosition);
				}, 0);


				valueUser = deleteLastCharacter(valueUser);
				return;
			}
			indexValue = decrementIndexValue(indexValue);
			cursorPosition = indexValue;
			valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
			valueUser = deleteLastCharacter(valueUser, numberPlaceholderArr);
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
			return;
		}

		if (indexValue === lengthMask) {
			return;
		}
		if (e.code === 'Backspace' && e.target.selectionStart < positionStart) {
			e.preventDefault();
			setCursorPosition(e.target, positionStart)
		}
		if (key >= '0' && key <= '9') {
			if (arrSymbols.includes(valueArrMask[indexValue]) || valueArrMask[indexValue] === ' ') {
				indexValue = incrementIndex(indexValue);
			}
			valueUser += e.key;
			valueArrMask[indexValue] = e.key;
			indexValue = incrementIndex(indexValue);
			cursorPosition = indexValue;
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
		}
	}

	function handleClick(e) {
		if (e.target.selectionStart < positionStart || !valueUser) {
			setCursorPosition(e.target, positionStart);
			cursorPosition = e.target.selectionStart;
			return
		}
		cursorPosition = e.target.selectionStart;
	}

	function backspaceNumberPhone(arr, cursorPosition, numberPlaceholderArr) {
		let maskArr = arr;
		let arrUserData = maskArr.map((v, i, arr) => {
			if (i === cursorPosition) {
				arr[i] = numberPlaceholderArr[i];
				return arr[i];
			}
			return v;
		})
		return arrUserData;
	}
	function deleteNumberPhone(arr, cursorPosition, numberPlaceholderArr) {
		let maskArr = arr;
		let arrUserData = maskArr.map((v, i, arr) => {
			if (i >= cursorPosition && arr[i] !== ' ' && !arrSymbols.includes(arr[i])) {
				return arr[i] = numberPlaceholderArr[i];;
			}
			return v;
		})
		return arrUserData;
	}
	function setCursorPosition(inputElement, cursorPosition) {
		inputElement.selectionStart = inputElement.selectionEnd = cursorPosition;
	}
	function decrementIndexValue(index) {
		return index - 1;
	}
	function incrementIndex(index) {
		return index + 1;
	}
	function deleteLastCharacter(str) {
		return str.slice(0, -1);
	}

	return removeAllListeners;
}

console.log('маска телефона');



class Slider {
	// Конструктор класса Slider, принимает объект mediaQueries
	constructor(mediaQueries) {
		this.mediaQueries = mediaQueries;  // Медиа-запросы для определения количества видимых слайдов
		this.sliderCount = false;  // Флаг для подсчета шагов слайдера
		this.iconCount = false;  // Флаг для отображения счетчика
		this.sliderNumberStep = false; // Элементы для отображения общего количества шагов и текущего шага
		this.stepNumber = 1;
		this.dragDropMouse = false;
		this.dragDropTouch = false;
	}
	// Метод инициализации слайдера, принимает объект с параметрами
	initSlider({ btnNext = null, btnPrev = null, containerSlider, slider, item, itemLength }) {
		this.windowWidth = document.documentElement.clientWidth;  // Ширина окна
		this.item = item;  // Один элемент слайдера
		this.btnNext = btnNext;  // Кнопка для перехода к следующему слайду
		this.btnPrev = btnPrev;  // Кнопка для перехода к предыдущему слайду
		this.containerSlider = containerSlider;  // Контейнер слайдера
		this.slider = slider;  // Сам слайдер
		this.sliderLength = itemLength;  // Количество элементов слайдера
		this.visibleSlides = this.getVisibleSlidesMediaQueries(this.mediaQueries);  // Количество видимых слайдов
		this.distance = this.updateWidthItem();  // Ширина одного элемента слайдера
		this.position = 0;  // Начальная позиция слайдера


		this.onResize = this.handleResize.bind(this);
		this.onDOMLoaded = this.handleDOMLoaded.bind(this);



		// Установка обработчика события, когда документ полностью загружен
		document.addEventListener('DOMContentLoaded', this.onDOMLoaded);

		// Обработчик события изменения размера окна
		window.addEventListener('resize', this.onResize);


		// Установка обработчиков событий для кнопок перехода
		if (this.btnNext && this.btnPrev) {

			this.onclickNext = this.handleClickNext.bind(this);
			this.onclickPrev = this.handleClickPrev.bind(this);


			this.btnNext.addEventListener('click', this.onclickNext);
			this.btnPrev.addEventListener('click', this.onclickPrev );
		}
	}

	removeAllListener() {
		// Удаление событий
		document.removeEventListener('DOMContentLoaded', this.onDOMLoaded);
		window.removeEventListener('resize', this.onResize);

		// удаление событий клика на кнопки
		if(this.btnNext && this.btnPrev) {
			this.btnNext.removeEventListener('click', this.onclickNext);
			this.btnPrev.removeEventListener('click', this.onclickPrev );			
		}
   // Удаление слушателей для мыши
		if(this.dragDropMouse) {

		// Обработчики событий для мыши
		this.slider.removeEventListener('mousedown', this.onmousedown, { passive: false });

		this.slider.removeEventListener('mousemove', this.onmousemove, { passive: false });

		document.removeEventListener('mouseup', this.onmouseup);
		}
// Удаление слушателей для touch
		if(this.dragDropTouch) {

		this.slider.removeEventListener('touchstart', this.ontouchstart, { passive: false });	
		this.slider.removeEventListener('touchmove', this.ontouchmove, { passive: false });
		document.removeEventListener('touchend', this.ontouchend);

		}
	}

	handleClickNext() {
		this.moveNext();  // Переход к следующему слайду
		this.updateButtonStates();
		if (this.sliderCount) {
			this.showSlideStep();  // Отображение текущего шага
		}
	}

	handleClickPrev() {
		this.movePrev();  // Переход к предыдущему слайду
		this.updateButtonStates();
		if (this.sliderCount) {
			this.showSlideStep();  // Отображение текущего шага
		}
	}

	handleResize() {
		let newWindowWidth = document.documentElement.clientWidth;
		if (newWindowWidth === this.windowWidth) return;
		this.resetSlider();  // Сброс слайдера
		this.distance = this.updateWidthItem();  // Обновление ширины элемента
		this.visibleSlides = this.getVisibleSlidesMediaQueries(this.mediaQueries);  // Обновление видимых слайдов

		if (this.sliderCount) {
			this.setCountTotalStep();  // Установка общего количества шагов
			if (!this.sliderNumberStep) return;
			this.showTotalStep();  // Отображение общего количества шагов
		}
		this.windowWidth = newWindowWidth;
		this.updateButtonStates();
	}

	handleDOMLoaded() {
		// this.slider.style.transition = 'transform .3s linear';  // Установка анимации перехода
		if (this.sliderCount) {
			this.setCountTotalStep();  // Установка общего количества шагов
			if (!this.sliderNumberStep) return;
			this.showTotalStep();  // Отображение общего количества шагов
		}
		this.updateButtonStates();
	}

	// Метод инициализации подсчета шагов
	initCount($totalStep = null, $stepSlide = null) {
		this.sliderCount = true;  // Флаг включения подсчета шагов

		if (!$totalStep || !$stepSlide) return;
		this.totalStep = $totalStep;  // Элемент для отображения общего количества шагов
		this.stepSlide = $stepSlide;  // Элемент для отображения текущего шага
		this.sliderNumberStep = true;
	}
	// Метод инициализации иконок шагов, работает только после  initCount
	initIconCount(allIcons, activeClassName) {
		this.iconCount = allIcons;
		this.iconActiveClassName = activeClassName;
	}

	// Метод инициализации перетаскивания слайдера
	initDragDrop(desktop = false) {
		this.dragDropTouch = true;

		this.isDragging = false;  // Флаг перетаскивания
		this.touchStart = 0;  // Начальная точка касания/клика
		this.touchEnd = 0;  // Конечная точка касания/клика
		this.touchMove = 0;  // Текущая позиция перетаскивания



		this.ontouchstart = this.handleStart.bind(this);
		this.ontouchmove = this.handleMove.bind(this);
		this.ontouchend = this.handleEnd.bind(this);



		// Обработчик события начала касания
		this.slider.addEventListener('touchstart', this.ontouchstart, { passive: false });

		// Обработчик события перемещения касания
		this.slider.addEventListener('touchmove', this.ontouchmove, { passive: false });

		// Обработчик события завершения касания
		document.addEventListener('touchend', this.ontouchend);

		if (!desktop) return;
		this.dragDropMouse = true;

		this.onmousedown = this.handleStart.bind(this);
		this.onmousemove = this.handleMove.bind(this);
		this.onmouseup = this.handleEnd.bind(this);

		// Обработчики событий для мыши
		this.slider.addEventListener('mousedown', this.onmousedown, { passive: false });

		this.slider.addEventListener('mousemove', this.onmousemove, { passive: false });

		document.addEventListener('mouseup', this.onmouseup);
	}

	handleStart(e) {
		e.preventDefault();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;

		this.startDragDrop(clientX);
	}

	handleMove(e) {
		if (!this.isDragging) return;
		e.preventDefault();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		this.moveDragDrop(clientX);
	}

	handleEnd(e) {
		if (!this.isDragging) return;
		e.preventDefault();
		this.endDragDrop();
	}

	// Метод начала перетаскивания
	startDragDrop(value) {
		this.isDragging = true;
		this.touchStart = value;
	}

	// Метод перемещения при перетаскивании
	moveDragDrop(value) {
		this.touchMove = value - this.touchStart + this.position;
		this.animateSlider(this.slider, this.touchMove);
		this.touchEnd = value;
	}

	// Метод завершения перетаскивания
	endDragDrop() {
		this.isDragging = false;
		this.position = this.touchMove;

		setTimeout(() => {
			// Если позиция больше 0, вернуться к началу
			if (this.position > 0) {
				this.animateSlider(this.slider, 0);
				this.position = 0;
				if (this.sliderCount) {
					this.showSlideStep();
				}
				// Если позиция меньше конца слайдера, вернуться к концу
			} else if (this.position < this.sliderEnd()) {
				this.animateSlider(this.slider, this.sliderEnd());
				this.position = this.sliderEnd();
				this.showSlideStep();
				// Если перетаскивание было значительным, перейти на следующий слайд
			} else if (this.touchEnd - this.touchStart < -20) {
				this.position = this.distance * (Math.floor(this.position / this.distance));
				if (this.sliderCount) {
					this.showSlideStep();
				}
				this.animateSlider(this.slider, this.position);
				// Если перетаскивание было значительным, перейти на предыдущий слайд
			} else if (this.touchEnd - this.touchStart > 20) {
				this.position = this.distance * (Math.ceil(this.position / this.distance));
				if (this.sliderCount) {
					this.showSlideStep();
				}
				this.animateSlider(this.slider, this.position);
				// Иначе, оставить на текущем слайде
			} else {
				this.position = this.distance * (Math.round(this.position / this.distance));
				this.animateSlider(this.slider, this.position);
			}
			this.updateButtonStates();
		}, 100);
	}

	// Метод вычисления конца слайдера
	sliderEnd() {
		return -(this.sliderLength * this.distance - this.visibleSlides * this.distance);
	}

	//Метод проверки кнопок для отключения или включения
	updateButtonStates() {
		if (this.btnNext) {
			this.btnNext.disabled = this.position <= this.sliderEnd();
		}
		if (this.btnPrev) {
			this.btnPrev.disabled = this.position >= 0;
		}
	}

	// Метод установки общего количества шагов
	setCountTotalStep() {
		this.countStep = this.sliderLength - this.visibleSlides + 1;
	}

	// Метод отображения общего количества шагов
	showTotalStep() {
		if (!this.sliderNumberStep) return;
		this.totalStep.textContent = this.countStep;
	}

	// Метод отображения текущего шага
	showSlideStep() {
	
		if (this.position > 0) return;

		const value = Math.abs(this.position / this.distance) + 1;
		this.stepNumber = value;

		if (this.iconCount) {
			this.iconCount.forEach(el => el.classList.remove(this.iconActiveClassName));
		
		
			this.iconCount[value - 1] &&	this.iconCount[value - 1].classList.add(this.iconActiveClassName);
		}
		if (!this.sliderNumberStep) return;
		if (value >= this.totalStep.textContent) {
			this.stepSlide.textContent = this.totalStep.textContent;
			return;
		}
		this.stepSlide.textContent = value;
	}

	// Метод получения количества видимых слайдов по медиа-запросам
	getVisibleSlidesMediaQueries(media) {
		for (let key in media) {
			if (media[key].matches) {
				return parseInt(key);
			}
		}
	}

	// Метод обновления ширины элемента
	updateWidthItem() {
		return this.item.offsetWidth;
	}

	// Метод перехода к следующему слайду
	moveNext() {
		const valueEnd = this.visibleSlides * this.distance - this.distance * this.sliderLength;
		if (this.position <= valueEnd) {
			return;
		}
		this.position = this.position - this.distance;
		this.animateSlider(this.slider, this.position);
	}

	// Метод перехода к предыдущему слайду
	movePrev() {
		if (this.position === 0) {
			return;
		}
		this.position = this.position + this.distance;
		this.animateSlider(this.slider, this.position);
	}

	// Метод анимации слайдера
	animateSlider(elem, value) {
		requestAnimationFrame(() => {
			elem.style.transform = `translateX(${value}px)`;
		});
	}

	// Метод сброса слайдера
	resetSlider() {
		this.position = 0;
		if (this.sliderNumberStep) {
			this.stepSlide.textContent = 1;
		}
		if (this.iconCount) {
			this.iconCount.forEach(el => el.classList.remove(this.iconActiveClassName));
			this.iconCount[this.position].classList.add(this.iconActiveClassName);
		}
		this.animateSlider(this.slider, this.position);
	}
}

// Объект медиа-запросов, в ключах прописываем сколько видно слайдов, в css устанавливаем какое количество слайдов видно .item {
// 	flex-shrink: 0;
// 	flex-grow: 0;
// 	width: 25%; (25% это 4 слайда , 50% = 2 , 33% = 3, и тд)
// 	padding: 0 14px;
// } для правильной работы счетчика шагов нужно прописать ключ для каждого изменения кол-ва слайдов и указать разрешение при котором кол-во видимых слайдов меняется(медиа запросы в css)

const media = {
	1: window.matchMedia('(max-width: 575px)'),
	2: window.matchMedia('(max-width: 767px)'),
	4: window.matchMedia('(max-width: 1024px)'),
	5: window.matchMedia('(min-width: 1025px)'),
};



document.querySelectorAll('.container-slider').forEach((elem, index) => {
	// Объект с элементами слайдера, если кнопки ненужны не указываем их в объекте
	const $sliderAllElem = {
		btnNext: document.querySelectorAll('.btn-next-slide')[index],
		btnPrev: document.querySelectorAll('.btn-prev-slide')[index],
		containerSlider: elem,
		slider: elem.querySelector('.slider'),
		itemLength: elem.querySelectorAll('.item').length,
		item: elem.querySelector('.item'),
	}
	const sliderObj = new Slider(media);
	sliderObj.initSlider($sliderAllElem);//инициализация слайдера

	sliderObj.initDragDrop('desktop');//инициализация drag'n drop не обязательна, если для desktop ненужно, то вызываем метод без аргумента

	// Для инициализации иконок шагов без отображения общего количества шагов и текущего шага нужно вызвать sliderObj.initCount() без аргументов
	sliderObj.initIconCount();

})





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