var gulp = require('gulp');
var nodeunit = require('gulp-nodeunit');


gulp.task('default', function(){
    gulp.src('./test/*.js')
        .pipe(nodeunit({
            reporter: 'junit',
            reporterOptions: {
                output: 'test'
            }
        }));
});
