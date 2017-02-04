'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');
var browserify = require('browserify');
var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');
var source = require('vinyl-source-stream');

gulp.task('bundle', function () {
	return Promise.all([
		projectDir.copy('./src', './app', {
			overwrite: true
		}),
		bundle(srcDir.path('background.js'), destDir.path('background.js')),
	]);
});

gulp.task('less', function () {
	return gulp.src(srcDir.path('stylesheets/main.less'))
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest(destDir.path('stylesheets')));
});

gulp.task('browserify', function () {
	return browserify({
			entries: './src/assets/main.js',
			debug: true
		})
		.bundle()
		.pipe(source('bundledMain.js'))
		.pipe(gulp.dest('./app/assets/'));
});

gulp.task('environment', function () {
	var configFile = 'config/env_' + utils.getEnvName() + '.json';
	projectDir.copy(configFile, destDir.path('env.json'), {
		overwrite: true
	});
});

gulp.task('watch', function () {
	var beepOnError = function (done) {
		return function (err) {
			if (err) {
				utils.beepSound();
			}
			done(err);
		};
	};

	watch('src/**/*.js', batch(function (events, done) {
		gulp.start('bundle', beepOnError(done));
	}));
	watch('src/**/*.less', batch(function (events, done) {
		gulp.start('less', beepOnError(done));
	}));
});

gulp.task('build', ['bundle', 'browserify', 'less', 'environment']);
