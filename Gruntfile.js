module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    yaml: {
      your_target: {
        options: {
          ignored: /^_/,
          space: 2,
          customTypes: {
            '!include scalar': function(value, yamlLoader) {
              return yamlLoader(value);
            },
            '!max sequence': function(values) {
              return Math.max.apply(null, values);
            },
            '!extend mapping': function(value, yamlLoader) {
              return _.extend(yamlLoader(value.basePath), value.partial);
            }
          }
        },
        files: [
          {expand: true, cwd: '', src: ['*.yml'], dest: ''}
        ]
      }
    },
    'json-minify': {
      build: {
        files: 'cue-data.json'
      }
    },
    uglify: {
      js: {
        files: {
          'js/app.js': ['js/vendor/bootstrap.min.js', 'js/vendor/AudioContextMonkeyPatch.js', 'js/main.js']
        }
      }
    },
    copy: {
      build: {
        cwd: '',
        src: [ 'index.html', 'index.appcache', '*.ico', 'cue-data.json', 'browserconfig.xml', 'js/app.js', 'js/vendor/modernizr-2.8.3-respond-1.4.2.min.js', 'js/vendor/jquery-1.11.2.min.js', 'fonts/**', 'css/bootstrap.min.css', 'css/bootstrap-cyborg.min.css', 'css/main.css' ],
        dest: 'tacb',
        expand: true
      }
    },
    clean: {
      build: {
        src: [ 'tacb' ]
      },
    },
    watch: {
      cues: {
        files: ['cue-data.yml'],
        tasks: ['yaml', 'json-minify']
      },
      scripts: {
        files: ['js/main.js', 'js/vendor/*.js'],
        tasks: ['uglify']
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', 'Convert YAML to minified JSON, uglify JS, and watch for changes.', ['yaml', 'json-minify', 'uglify', 'watch']);
  grunt.registerTask('build', 'Clean & (re)build distribution-ready project in /tacb', ['yaml', 'json-minify', 'uglify', 'clean', 'copy']);
};
