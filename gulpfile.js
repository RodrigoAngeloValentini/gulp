var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var htmlmin = require('gulp-htmlmin');
var gls = require('gulp-live-server');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('default',['sass','js','htmlmin','image','watch','serve']);

gulp.task('sass', function () {
    return gulp.src('assets/src/sass/**/*.scss')
        .pipe(concat('style.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('assets/css'));

});

gulp.task('js',function(){
   return gulp.src('assets/src/js/**/*.js')
       .pipe(concat('script.min.js'))
       .pipe(uglify())
       .pipe(gulp.dest('assets/js'));
});

gulp.task('image',function(){
    return gulp.src('assets/src/img/*')
        .pipe(imagemin({
            progressive:true,
            svgPlugins:[{removeViewBox:false}],
            use:[pngquant()]
        }))
        .pipe(gulp.dest('assets/img'));
});

gulp.task('htmlmin',function(){
    return gulp.src('_html/**/*.html')
        .pipe(htmlmin({collapseWhitespace:true}))
        .pipe(gulp.dest('.'))
});

gulp.task('watch',function(){
    gulp.watch('assets/src/sass/**/*.scss',['sass'])
    gulp.watch('assets/src/js/**/*.js',['js'])
    gulp.watch('assets/src/img/*',['image'])
    gulp.watch('_html/**/*.html',['htmlmin'])
});

gulp.task('serve',function(){
    var server = gls.static('./',8080);
    server.start();
    gulp.watch('assets/css/**/*.css',function(file){
       gls.notify.apply(server,[file]);
    });
    gulp.watch('assets/js/**/*.js',function(file){
        gls.notify.apply(server,[file]);
    });
    gulp.watch('assets/img/*',function(file){
        gls.notify.apply(server,[file]);
    });
    gulp.watch('./*.html',function(file){
        gls.notify.apply(server,[file]);
    });
});

gulp.task('lint', function() {
    return gulp.src('assets/src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});