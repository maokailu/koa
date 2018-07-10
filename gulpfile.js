let gulp = require('gulp');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
gulp.task('js', function () {
    return gulp.src(['client/pages/comments/index.jsx'])
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('dist'))
});
gulp.task('watch', function () {
    return gulp.watch('client/pages/comments/*.jsx', ['js']);
});
gulp.task('serve', function() {
    nodemon({ 
        script: 'index.js', 
        ignore: ["gulpfile.js", "node_modules/"], 
        env: { 'NODE_ENV': 'development' } 
    }).on('start', function() { 
        browserSync.init({ 
            proxy: 'http://localhost:3000',
            files: ["dist/**/*.*", "views/**", "client/**"],
            port:8080
        }, 
        function() { 
            console.log("browser refreshed."); 
        });
    }); 
});
gulp.task('default', ['watch', 'serve']);