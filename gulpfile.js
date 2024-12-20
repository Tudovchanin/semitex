"use strict"
// Импорт необходимых модулей из Gulp и других пакетов
const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer"); // Добавляет вендорные префиксы к CSS
const cssbeautify = require("gulp-cssbeautify"); // Форматирует CSS для улучшения читаемости
const removeComments = require('gulp-strip-css-comments');// Удаляет комментарии из CSS
const rename = require("gulp-rename");// Переименовывает файлы
const rigger = require("gulp-rigger"); // Позволяет использовать директивы для объединения файлов
const sass = require("gulp-sass")(require('sass'));// Компилирует Sass в CSS
const cssnano = require("gulp-cssnano");// Минимизирует CSS
const uglify = require("gulp-uglify");// Минимизирует JavaScript

const plumber = require("gulp-plumber");// Обрабатывает ошибки в потоках Gulp
const panini = require("panini");// Шаблонизатор для HTML
const imagemin = require("gulp-imagemin"); // Оптимизирует изображения
const del = require("del");// Удаляет файлы и папки
const notify = require("gulp-notify");  // Отправляет уведомления об ошибках
const imagewebp = require("gulp-webp");// Конвертирует изображения в формат WebP
const browserSync = require("browser-sync").create(); // Создает локальный сервер для разработки

/* Paths */
const srcPath = "src/";// Путь к исходным файлам
const distPath = "dist/";// Путь к выходным файлам
const docsPath = "docs/"; // Путь к папке docs для гих хаб pages

// Определение путей для различных типов файлов
const path = {
    build: {
        html: distPath, // Путь для собранных HTML файлов
        css: distPath + "assets/css/", // Путь для собранных CSS файлов
        js: distPath + "assets/js/", // Путь для собранных JS файлов
        images: distPath + "assets/img/", // Путь для собранных изображений
        fonts: distPath + "assets/fonts/" // Путь для собранных шрифтов
    },
    src: {
        html: srcPath + "*.html", // Путь к исходным HTML файлам
        css: srcPath + "assets/scss/*.scss", // Путь к исходным SCSS файлам
        js: srcPath + "assets/js/*.js", // Путь к исходным JS файлам
        images: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}", // Путь к исходным изображениям
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    }, // Путь к исходным шрифтам
    watch: {
        html:   srcPath + "**/*.html",  // Наблюдение за изменениями в HTML файлах
        js:     srcPath + "assets/js/**/*.js", // Наблюдение за изменениями в JS файлах
        css:    srcPath + "assets/scss/**/*.scss", // Наблюдение за изменениями в SCSS файлах
        images: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}", // Наблюдение за изменениями в изображениях
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    }, // Наблюдение за изменениями в шрифтах
    clean: "./" + distPath,  // Путь для очистки выходной папки перед сборкой
    cleanDocs: "./" + docsPath   // Путь для очистки папки docs перед копированием
}

// Функция для запуска локального сервера с помощью BrowserSync
function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

// Функция для обработки HTML файлов с использованием Panini
function html() {
    panini.refresh(); // Обновляет шаблоны Panini при необходимости

    return src(path.src.html, {base: srcPath}) // Читает HTML файлы из исходной папки
        .pipe(plumber()) // Обрабатывает ошибки в потоке Gulp
        .pipe(panini({  // Обрабатывает шаблоны с помощью Panini
            root: srcPath,
            layouts: srcPath + "tpl/layouts/",
            partials: srcPath + "tpl/partials/",
            data: srcPath + "tpl/data/"
          }))
        .pipe(dest(path.build.html))  // Сохраняет собранные HTML файлы в выходную папку
        .pipe(browserSync.reload({stream: true}));  // Обновляет страницу в браузере при изменении HTML файла
}

// Функция для обработки SCSS файлов и их компиляции в CSS
function css() {
    return src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(plumber({ // Обрабатывает ошибки компиляции SCSS 
            errorHandler : function(err) {
                notify.onError({
                    title:    "SCSS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass()) // Компилирует SCSS в CSS 
        .pipe(autoprefixer()) // Добавляет вендорные префиксы к CSS 
        .pipe(cssbeautify()) // Форматирует CSS 
        .pipe(dest(path.build.css)) // Сохраняет обычный CSS файл в выходной папке 
        .pipe(cssnano({ // Минимизирует CSS файл 
            zindex: false,
            discardComments: {
                removeAll: true // Удаляет все комментарии из минифицированного файла 
            }
        }))
        .pipe(removeComments()) // Удаляет комментарии из CSS 
        .pipe(rename({ // Переименовывает файл с добавлением суффикса ".min"
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css)) // Сохраняет минифицированный CSS файл в выходной папке 
        .pipe(browserSync.reload({stream: true})); // Обновляет страницу в браузере при изменении CSS файла 
}

// Функция для обработки JavaScript файлов 
function js() {
    return src(path.src.js, {base: srcPath + "assets/js/"})
        .pipe(plumber({ // Обрабатывает ошибки компиляции JavaScript 
            errorHandler : function(err) {
                notify.onError({
                    title:    "JS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(rigger()) // Позволяет использовать директивы для объединения JS файлов
        .pipe(dest(path.build.js))  // Сохраняет обычный JS файл в выходной папке 
        .pipe(uglify()) // Минимизирует JS файл 
        .pipe(rename({
            suffix: ".min", // Переименовывает файл с добавлением суффикса ".min"
            extname: ".js"
        }))
        .pipe(dest(path.build.js)) // Сохраняет минифицированный JS файл в выходной папке 
        .pipe(browserSync.reload({stream: true})); // Обновляет страницу в браузере при изменении JS файла 
}

// Функция для оптимизации изображений
function images() {
    return src(path.src.images, {base: srcPath + "assets/img/"})
        .pipe(imagemin([ // Оптимизирует изображения с помощью imagemin 
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest(path.build.images)) // Сохраняет оптимизированные изображения в выходной папке 
        .pipe(browserSync.reload({stream: true})); // Обновляет страницу в браузере при изменении изображений
}

// Функция для конвертации изображений в формат WebP 
function webpImages() {
    return src(path.src.images, {base: srcPath + "assets/img/"})
        .pipe(imagewebp()) // Конвертирует изображения в формат WebP 
        .pipe(dest(path.build.images)) // Сохраняет WebP изображения в выходной папке 
}

// Функция для копирования шрифтов из исходной папки в выходную папку
function fonts() {
    return src(path.src.fonts, {base: srcPath + "assets/fonts/"})
    .pipe(dest(path.build.fonts)) // Сохраняет шрифты в выходной папке 
    .pipe(browserSync.reload({stream: true})); // Обновляет страницу в браузере при изменении шрифтов 
}

// Функция для очистки выходной папки перед сборкой проекта 
function clean() {
    return del(path.clean)
}

// Функция для очистки папки docs перед копированием файлов
function cleanDocs() {
    return del(path.cleanDocs);
}

// Функция для копирования файлов из dist в docs
function copyToDocs() {
    return src(distPath + '**/*')  // Читает все файлы из папки dist
        .pipe(dest(docsPath));  // Копирует их в папку docs
}

// Функция для наблюдения за изменениями файлов и автоматического запуска соответствующих задач Gulp 
function watchFiles() {
    gulp.watch([path.watch.html], html); // Наблюдает за изменениями HTML файлов и запускает задачу html()
    gulp.watch([path.watch.css], css); // Наблюдает за изменениями SCSS файлов и запускает задачу css()
    gulp.watch([path.watch.js], js); // Наблюдает за изменениями JS файлов и запускает задачу js()
    gulp.watch([path.watch.images], images); // Наблюдает за изменениями изображений и запускает задачу images()
    gulp.watch([path.watch.fonts], fonts); // Наблюдает за изменениями шрифтов и запускает задачу fonts()
}

// Определение последовательности задач сборки проекта (clean -> html, css, js, images)
const build = gulp.series(clean, gulp.parallel(html, css, js, images, webpImages, fonts));

// Определение задачи watch (сборка проекта -> наблюдение за файлами -> запуск сервера)
const watch = gulp.parallel(build, watchFiles, serve);



// Экспортируем задачи Gulp так чтобы их можно было вызывать из командной строки или других скриптов.
exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.webpImages = webpImages
exports.fonts = fonts
exports.clean = clean
exports.cleanDocs = cleanDocs;  // Экспортируем задачу очистки docs
exports.copyToDocs = copyToDocs;
exports.build = build
exports.watch = watch
exports.default = watch /* Задача по умолчанию - запускать режим наблюдения */