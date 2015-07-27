'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('app/manifest.json'),
        to_browserify: {
            'dist/scripts/background-main.js':        'app/scripts/background-main.js',
            'dist/scripts/everywhere-main.js':        'app/scripts/everywhere-main.js',
            'dist/scripts/sidebar-main.js':           'app/scripts/sidebar-main.js',
            'dist/scripts/soundcloud-player-main.js': 'app/scripts/soundcloud-player-main.js',
            'dist/scripts/top-frame-main.js':         'app/scripts/top-frame-main.js'
        },
        browserify: {
            js: {
                options: {
                    alias: {
                        'env': './app/scripts/production-env.js'
                    }
                },
                files: '<%= to_browserify %>'
            },
            js_watchify: {
                options: {
                    alias: {
                        'env': './app/scripts/development-env.js'
                    },
                    keepAlive: true,
                    watch: true
                },
                files: '<%= to_browserify %>'
            }
        },
        compress: {
            dist: {
                options: {
                    archive: 'build/pkg-<%= manifest.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            develop: {
                tasks: ['watch:non_js', 'browserify:js_watchify']
            }
        },
        copy: {
            non_js: {
                files: [
                    { expand: true, cwd: 'app/',                                     src: ['**', '!scripts/**'],     dest: 'dist/' },
                    { expand: true, cwd: 'node_modules/angular/',                    src: ['angular-csp.css'],       dest: 'dist/styles/' },
                    { expand: true, cwd: 'node_modules/slick-carousel/slick/',       src: ['slick.css'],             dest: 'dist/styles/' },
                    { expand: true, cwd: 'node_modules/perfect-scrollbar/dist/css/', src: ['perfect-scrollbar.css'], dest: 'dist/styles/' }
                ]
            }
        },
        uglify: {
            js: {
                options: {
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'dist/scripts/background-main.js':        'dist/scripts/background-main.js',
                    'dist/scripts/everywhere-main.js':        'dist/scripts/everywhere-main.js',
                    'dist/scripts/sidebar-main.js':           'dist/scripts/sidebar-main.js',
                    'dist/scripts/soundcloud-player-main.js': 'dist/scripts/soundcloud-player-main.js',
                    'dist/scripts/top-frame-main.js':         'dist/scripts/top-frame-main.js'
                }
            }
        },
        watch: {
            options: {
                atBegin: true,
                interrupt: true
            },
            non_js: {
                files: ['app/**/*', '!app/**/*.js'],
                tasks: ['dist:non_js']
            }
        }
    });

    grunt.registerTask('develop',     ['concurrent:develop']);
    grunt.registerTask('dist:js',     ['browserify:js']);
    grunt.registerTask('dist:non_js', ['copy:non_js']);
    grunt.registerTask('pkg',         ['dist:non_js', 'dist:js', 'uglify:js', 'compress']);
};
