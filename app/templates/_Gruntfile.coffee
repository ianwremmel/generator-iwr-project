# Generated on <%= (new Date()).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    config:
      dist: 'dist'
      src:  'src'
      test: 'test'
      tmp:  '.tmp'

  # Public Tasks
  # ------------

  grunt.registerTask 'static-analysis', [
    'jshint'
    'jscs'
  ]
