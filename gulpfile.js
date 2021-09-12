let project_folder = "dist";
let src_folder = "#source";


let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/image/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [src_folder + "/*.{html, kit}", "!" + src_folder + "/_*.{html, kit}"],
        css: src_folder + "/sass/style.scss",
        js: src_folder + "/js/all.js",
        img: src_folder + "/image/**/*.{jpg, png, svg, gif, ico, webp}",
        fonts: src_folder + "/fonts/*.ttf",
    },
    watch: {
        html: src_folder + "/**/*.{html, kit}",
        css: src_folder + "/sass/**/*.scss",
        js: src_folder + "/js/**/*.js",
        img: src_folder + "/image/**/*.{jpg, png, svg, gif, ico, webp}",
    },
    clean: "./" + project_folder + "/"
}
// $ Подлючение плагинов
let { src, dest } = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require('gulp-sass')(require('sass')),
    autoprfixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename");

// $ Function для сихронизации с браузером
function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

// $ Function html
function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

// $ Function css
function css() {
    return src(path.src.css)
        .pipe(
            scss({ outputStyle: 'expanded' }).on('error', scss.logError)
        )
        .pipe(group_media())
        .pipe(
            autoprfixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

// $ Function удаление поворных файлов
function clean(params) {
    return del(path.clean);
}

// $ Function для просмотра файлов
function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
}

let build = gulp.series(clean, gulp.parallel(css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
