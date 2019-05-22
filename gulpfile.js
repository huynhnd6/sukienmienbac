var gulp = require('gulp')

var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    pug = require('gulp-pug'),
    sourcemaps = require("gulp-sourcemaps"),
    sync     = require('browser-sync')

gulp.task('scss', function () {
    return gulp.src([
        'node_modules/sanitize.css/sanitize.css',
        'node_modules/font-awesome/css/font-awesome.min.css',
        'src/**/*.scss'
    ])
        .pipe(sass({
            outputStyle: 'expanded',
            indentType: 'space',
            indentWidth: 4
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('htdocs/css'))
        .pipe(rename({extname: '.min.css'}))
        .pipe(cssnano({ zindex: false }))
        .pipe(gulp.dest('htdocs/css'))
});

gulp.task("pug", function () {
    return gulp.src(["src/pug/**/*.pug", "!src/pug/**/_*.pug"])
        .pipe(pug({
            basedir: "src/pug/",
            pretty: true
        }))
        .on('error', function (err) {
            process.stderr.write(err.message + '\n');
            this.emit('end');
        })
        .pipe(gulp.dest("htdocs"));
});

gulp.task('js', function () {
    return gulp.src([
        'htdocs/vendor/jquery/jquery-3.4.1.min.js',
        'src/**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('htdocs/js'))
        .pipe(rename({extname: '.min.js'}))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('htdocs/js'))
});

gulp.task("browser-sync", function () {
    sync({
        server: {
            baseDir: "./htdocs/",
        },
        notify: false,
    });
});
gulp.task("watch", function () {
    gulp.watch("src/**/*.scss", gulp.series("scss"));
    gulp.watch("src/**/*.pug", gulp.series("pug"));
    gulp.watch("src/**/*.js", gulp.series("js"));
    gulp.watch([
        'htdocs/*.html',
        'htdocs/css/*.css',
        'htdocs/js/*.js'
    ]).on('change', sync.reload);
});

gulp.task("default", gulp.parallel("scss","pug","js","watch", "browser-sync"));