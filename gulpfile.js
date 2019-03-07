var gulp = require("gulp");
var prettier = require("gulp-prettier");
var browserSync = require("browser-sync").create();

gulp.task("server", function() {
  browserSync.init({ watch: true, server: "./src" });
});

gulp.task("prettier", function() {
  return gulp
    .src("./src/js/index.js")
    .pipe(prettier())
    .pipe(gulp.dest("./src/js/"));
});
