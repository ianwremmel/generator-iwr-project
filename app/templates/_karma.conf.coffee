module.exports = (config) ->
  config.set
    frameworks: [
      'mocha'
      'browserify'
    ]

    basePath: '.'

    files: [<% if (unitTests) {
      'test/unit/spec/**/*.js'<% } %><% if (integrationTests) {
      'test/integration/spec/**/*.js'<% } %>
    ]

    preprocessors:<% if (unitTests) {
      'test/unit/spec/**/*.js': ['browserify']<% } %><% if (integrationTests) {
      'test/integration/spec/**/*.js': ['browserify']<% } %>

    hostname: '127.0.0.1'

    port: 8000

    reporters: [
      'mocha'
    ]

    browserify:
      debug: true
      watch: true

    browsers: [
      'Chrome'
    ]
