# Generated on <%= (new Date()).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    config:
      dist: 'dist'
      src:  'src'<% if (useBrowser && !isLibrary) { %>
      app: 'src/app'
      server: 'src/server'<% } %>
      test: 'test'
      tmp:  '.tmp'<% if (!useBrowser || !isLibrary) { %>

    # Serve
    # -----

    nodemon:
      dev:<% if (useBrowser && !isLibrary) { %>
        script: '<%%= config.server %>/index.js'
        options:
          watch: '<%%= config.server %>'<% } else { %>
        script: '<%%= config.src %>/index.js'
        options:
          watch: '<%%= config.src %>'<% } %><% } %>

    # Static Analysis
    # ---------------

    jshint:
      options:
        reporter: require 'jshint-stylish'<% if (useBrowser && !isLibrary) { %>
      app:
        options:
          jshintrc: '<%%= config.app %>/.jshintrc'
        files:
          src: [
            '<%%= config.app %>/scripts/**/*.js'
          ]
      server:
        options:
          jshintrc: '<%%= config.server %>/.jshintrc'
        files:
          src: [
            '<%%= config.server %>/**/*.js'
          ]<% } else { %>
      src:
        options:
          jshintrc: '<%%= config.src %>/.jshintrc'
        files:
          src: [
            '<%%= config.src %>/scripts/**/*.js'
          ]<% } %><% if (unitTests) { %>
      'test-unit':
        options:
          jshintrc: '<%%= config.test %>/unit/.jshintrc'
        files:
          src: [
              '<%%= config.test %>/unit/**/*.js'
            ]<% } %><% if (integrationTests) { %>
      'test-integration':
        options:
          jshintrc: '<%%= config.test %>/integration/.jshintrc'
        files:
          src: [
              '<%%= config.test %>/integration/**/*.js'
            ]<% } %><% if (acceptanceTests) { %>
      'test-acceptance':
        options:
          jshintrc: '<%%= config.test %>/acceptance/.jshintrc'
        files:
          src: [
              '<%%= config.test %>/acceptance/**/*.js'
            ]<% } %>

    jscs:
      options:
        config: '.jscsrc'
      all: [
        '<%%= config.src %>/**/*.js'
        '<%%= config.test %>/**/*.js'
      ] <% if (useBrowser && !isLibrary) { %>

    # Build
    # -----

    browserify:
      dist:
        files:
          '<%%= config.dist %>/scripts/<%= _.slugify(appname) %>.js': '<%%= config.app %>/scripts/<%= _.slugify(appname) %>.js'
        options:
          transform: [
            'envify'
            'uglifyify'
          ]<% if (useLess) { %>
    less:
      dist:
        files:
          '<%%= config.dist %>/styles/<%= _.slugify(appname) %>.css': '<%%= config.app %>/styles/<%= _.slugify(appname) %>.less'<% } %>

    autoprefixer:
      dist:
        files: '<%%= config.dist %>/styles/<%= _.slugify(appname) %>.css': '<%%= config.dist %>/styles/<%= _.slugify(appname) %>.css'

    uglify:
      dist:
        files:
          '<%%= config.dist %>/scripts/<%= _.slugify(appname) %>.min.js': '<%%= config.dist %>/scripts/<%= _.slugify(appname) %>.js'

    <% } >

  # Public Tasks
  # ------------

  grunt.registerTask 'static-analysis', [
    'jshint'
    'jscs'
  ]
