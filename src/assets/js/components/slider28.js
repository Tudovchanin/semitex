


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



