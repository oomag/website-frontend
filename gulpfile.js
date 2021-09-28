var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		template       = require('gulp-template'),
		rsync          = require('gulp-rsync');
		fileinclude    = require('gulp-file-include');
		reload 			   = browserSync.reload;

var path = {
	dist: {
		html: './dist',
		htmlRu: './dist/ru/',
		htmlEn: './dist/en/',
		css: './dist/css/',
		js: './dist/js/'
	},
	src: {
		html: 'app/html/*.html',
		htmlRu: 'app/html/ru/*.html',
		htmlEn: 'app/html/en/*.html',
		sass: 'app/sass/**/*.sass',
		js: 'app/js'
	},
	watch: {
		html: 'app/html/**/*.html',
		sass: 'app/sass/**/*.sass',
		js: 'app/js/common.js',
		img: 'app/img/**/*.*'
	}
};

// Скрипты проекта

var config = {
	server: {
		baseDir: "dist"
	},
	tunnel: false,
	host: 'localhost',
	port: 3000,
	logPrefix: "Frontend"
};

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('sass', function() {
	return gulp.src(path.src.sass)
		.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS()) // Опционально, закомментировать при отладке
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('common-js', function() {
	return gulp.src(['app/js/common.js'])
		.pipe(template({ contactUsURL: process.env.CONTACTUS_URL || 'http://localhost:11000' }))
		.pipe(concat('common.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.src.js));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest(path.dist.js))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function() {
	gulp.src(path.src.htmlEn)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file',
			indent: true
		}))
		.pipe(gulp.dest(path.dist.htmlEn))
		.pipe(reload({stream: true}));

	gulp.src(path.src.htmlRu)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file',
			indent: true
		}))
		.pipe(gulp.dest(path.dist.html))
		.pipe(reload({stream: true}));
});

gulp.task('watch', function() {
	gulp.watch([path.watch.html], function(event, cb) {
		gulp.start('html');
	});
	gulp.watch([path.watch.sass], function(event, cb) {
		gulp.start('sass');
	});
	gulp.watch([path.watch.js], function(event, cb) {
		gulp.start('js');
	});
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'html', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'app/html/*.html',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		archive: true,
		silent: false,
		compress: true
	}));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['html', 'sass', 'js', 'webserver', 'watch']);
