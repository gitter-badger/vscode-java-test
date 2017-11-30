const gulp = require('gulp');
const cp = require('child_process');
const tslint = require("gulp-tslint");
const server_dir = '../';
gulp.task('build_server', ()=>
{
	cp.execSync(mvnw()+ ' clean package', {cwd:server_dir, stdio:[0,1,2]} );
	gulp.src(server_dir + '/java.junit.plugin/target/*.jar')
        .pipe(gulp.dest('./server'));
    gulp.src(server_dir + '/java.junit.runner/target/*.jar')
		.pipe(gulp.dest('./server'))
});

gulp.task("tslint", () => {
	return gulp.src(["**/*.ts", "!**/*.d.ts", "!node_modules/**", "!./src/views/node_modules/**"])
		.pipe(tslint())
		.pipe(tslint.report());
});

function isWin() {
	return /^win/.test(process.platform);
}

function isMac() {
	return /^darwin/.test(process.platform);
}

function isLinux() {
	return /^linux/.test(process.platform);
}

function mvnw() {
	return isWin()?"mvnw.cmd":"./mvnw";
}