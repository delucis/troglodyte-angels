module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    modernizr: {
      dist: {
        "crawl": false,
        "customTests": [],
        "dest": "js/builds/modernizr-build.js",
        "tests": [
          "applicationcache",
          "webaudio",
          "localstorage"
        ],
        "options": [
          "setClasses"
        ],
        "uglify": true
      }
    },
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
          'js/builds/app.js': ['js/vendor/bootstrap.min.js', 'js/builds/modernizr-build.js', 'js/vendor/AudioContextMonkeyPatch.js', 'js/main.js', 'js/feedback.js']
        }
      }
    },
    copy: {
      build: {
        files: [
          {
            cwd: '',
            src: [ 'index.html', 'index.appcache', '*.ico', 'cue-data.json', 'browserconfig.xml', 'js/vendor/jquery-1.11.2.min.js', 'fonts/**', 'css/bootstrap.min.css', 'css/bootstrap-cyborg.min.css', 'css/main.css' ],
            dest: 'tacb',
            expand: true
          },
          {
            expand: true,
            flatten: true,
            src: ['js/builds/app.js'],
            dest: 'tacb/js/',
            filter: 'isFile'
          }
        ]
      }
    },
    clean: {
      build: {
        src: [ 'tacb' ]
      },
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: 'tacb',
          hostname: '*',
          open: true
        }
      }
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
  grunt.registerTask(
    'default',
    'Convert YAML to minified JSON, uglify JS, serve to localhost:4000, and watch for changes.',
    ['modernizr:dist', 'yaml', 'json-minify', 'uglify', 'clean', 'copy', 'connect', 'watch']
  );
  grunt.registerTask(
    'build',
    'Clean & (re)build distribution-ready project in /tacb',
    ['modernizr:dist', 'yaml', 'json-minify', 'uglify', 'clean', 'copy']
  );
};
