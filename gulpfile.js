const gulp = require('gulp');
const ejs = require('gulp-ejs');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const webpackConfig = require('./webpack.config');

const setMode = (mode, cb) => {
    webpackConfig.mode = mode || 'development';
    cb();
};

// browser-sync
gulp.task('browserSync:init', (cb) => {
    browserSync.init(null, {
        server: 'dist'
    });
    cb();
});

gulp.task('browserSync:reload', (cb) => {
    browserSync.reload();
    cb();
});

// 出力先を空にする
gulp.task('clean', (cb) => {
    const outDir = path.resolve(__dirname, 'dist');
    if (!fs.existsSync(outDir)) {
        cb();
        return;
    }

    fs.readdir(outDir, (err, files) => {
        files.forEach(file => rimraf.sync(`${outDir}/${file}`));
        cb();
    });
});

// ejsをコンパイル
gulp.task('ejs', () => {
    return gulp.src('src/ejs/pages/*.ejs')
        .pipe(plumber({
            errorHandler: function (err) {
                console.error(err.message);
                this.emit('end');
            },
        }))
        .pipe(ejs())
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('dist'));
});

// js・sassはwebpackに丸投げ
gulp.task('webpack', () => {
    return gulp.src('src/index.ts')
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest('dist'));
});

// ファイルを監視
gulp.task('serve', gulp.series('clean', 'browserSync:init',
    (cb) => setMode('development', cb),
    gulp.parallel('webpack', 'ejs'), () => {
        gulp.watch([
                'src/**/*.ts',
                'src/**/*.js',
                'src/**/*.scss',
                'src/**/*.css'],
            gulp.series('webpack', 'browserSync:reload'));
        gulp.watch(['src/**/*.ejs'], gulp.series('ejs', 'browserSync:reload'));
    }
));

// ビルド
gulp.task('build', gulp.series('clean', (cb) => setMode('development', cb),
    gulp.parallel('webpack', 'ejs'))
);
