// eslint-disable-next-line @typescript-eslint/no-var-requires
const gulp = require("gulp");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require("child_process");

function buildTask(cb) {
    console.log("starting a new build.");
    exec("npm run build", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
        }
        console.log(stdout);
        console.error(stderr);
        cb();
    });
}

gulp.task("build", buildTask);

// Schedule the build task to run every 15 seconds
gulp.task("default", () => {
    setInterval(() => {
        gulp.series("build")();
    }, 15000);
});
