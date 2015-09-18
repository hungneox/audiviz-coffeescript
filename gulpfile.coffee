gulp   = require 'gulp';
uglify = require 'gulp-uglify';
coffee = require 'gulp-coffee'

gulp.task 'scripts', ->
	gulp.src 'src/audiviz.coffee'
	.pipe coffee()
	.pipe (gulp.dest 'test/js/')
	.pipe uglify() 
	.pipe (gulp.dest 'js/')

gulp.task 'default', ['scripts']