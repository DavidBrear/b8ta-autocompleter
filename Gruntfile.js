module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    env: {
      build: {
        NODE_ENV: 'production'
      }
    },

    browserify: {
      dev: {
        options: {
          debug: true,
          transform: ['reactify']
        },
        files: {
          'scripts/build/main.bundle.js': ['scripts/src/**/*.js', '!scripts/src/**/__tests__/*']
        }
      },
      build: {
        options: {
          debug: false,
          transform: ['reactify']
        },
        files: {
          'scripts/build/main.bundle.js': ['scripts/src/**/*.js', '!scripts/src/**/__tests__/*']
        }
      }
    },

    watch: {
      browserify: {
        files: ['scripts/src/**/*.js'],
        tasks: ['browserify:dev']
      },
      options: {
        nospawn: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('default', ['browserify:dev', 'watch']);
  grunt.registerTask('build', ['env:build', 'browserify:build']);
};

