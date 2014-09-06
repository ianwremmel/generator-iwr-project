module.exports = (config) ->

  launchers =
    sl_chrome_35_osx9:
      base: 'SauceLabs'
      browserName: 'chrome'
      platform: 'OS X 10.9'
      version: '35'
    sl_firefox_30_osx9:
      base: 'SauceLabs'
      browserName: 'firefox'
      platform: 'OS X 10.9'
      version: '30'
    sl_safari_7_osx9:
      base: 'SauceLabs'
      browserName: 'safari'
      platform: 'OS X 10.9'
      version: '7'

    sl_chrome_37_windows7:
      base: 'SauceLabs'
      browserName: 'chrome'
      platform: 'Windows 7'
      version: '37'
    sl_firefox_31_windows7:
      base: 'SauceLabs'
      browserName: 'chrome'
      platform: 'Windows 7'
      version: '31'
    sl_ie_11_windows7:
      base: 'SauceLabs'
      browserName: 'internet explorer'
      platform: 'Windows 7'
      version: '11'

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

    singleRun: true

    sauceLabs:
      username: YOUR SAUCE USERNAME
      accessKey: YOUR SAUCE PASSWORD

    customLaunchers: launchers
    browsers: Object.keys launchers

    # The following is necessary due to delay introduced by sauce connect
    browserNoActivityTimeout: 60000
    captureTimeout: 60000
