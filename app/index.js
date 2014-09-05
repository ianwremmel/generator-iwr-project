'use strict';

var _ = require('lodash');
var shell = require('shelljs');

var yeoman = require('yeoman-generator');

var IwrProjectGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });

    this.packages = [
      'grunt',
      'grunt-bump',
      'grunt-cli',
      'grunt-contrib-jshint',
      'grunt-jscs',
      'jshint-stylish',
      'load-grunt-tasks',
      'time-grunt'
    ];
  }
});

module.exports = IwrProjectGenerator;

IwrProjectGenerator.prototype.askBasic = function() {
  var done = this.async();

  this.prompt([
    {
      type: 'confirm',
      name: 'isLibrary',
      message: 'Is this a library?',
      default: false
    },
    {
      type: 'confirm',
      name: 'useBrowser',
      message: 'Is this project intended to run in web browsers?',
      default: true
    },
    {
      type: 'text',
      name: 'username',
      message: 'What is your GitHub username?',
      default: 'ianwremmel'
    },
    {
      type: 'confirm',
      name: 'useNewrelic',
      message: 'Should this project integrate New Relic?',
      default: true
    }
  ], function(props) {
    _.assign(this, props);
    done();
  }.bind(this));

};

IwrProjectGenerator.prototype.askTest = function() {
  var done = this.async();
  var prompts = [
    {
      type: 'confirm',
      name: 'unitTests',
      message: 'Should this project include unit tests?',
      default: true
    },
    {
      type: 'confirm',
      name: 'integrationTests',
      message: 'Should this project include integration tests?',
      default: true
    }
  ];

  if (this.useBrowser) {
    prompts.push({
      type: 'confirm',
      name: 'acceptanceTests',
      message: 'Should this project include acceptance tests?',
      default: true
    });
  }

  this.prompt(prompts, function(props) {
    _.assign(this, props);
    done();
  }.bind(this));
};

IwrProjectGenerator.prototype.askBrowser = function() {
  var done = this.async();

  var prompts = [
    {
      type: 'confirm',
      name: 'useBower',
      message: 'Will this project need to use bower modules?',
      default: true
    },
    {
      type: 'confirm',
      name: 'useLess',
      message: 'Use less?',
      default: true
    },
    {
      type: 'confirm',
      name: 'usePolymer',
      message: 'Use polymer?',
      default: true
    }
  ];

  this.prompt(prompts, function(props) {
    _.assign(this, props);

    if (this.polymer) {
      this.useBower = true;
    }

    if (this.useBrowser && !this.isLibrary) {
      this.template('src/index.js', 'src/app/index.js');
      this.template('src/_jshintrc', 'src/app/.jshintrc');
      this.template('server/_index.js', 'src/server/index.js');
      this.template('server/_jshintrc', 'src/server/.jshintrc');
    }
    else {
      this.template('server/_index.js', 'src/index.js');
      this.template('server/_jshintrc', 'src/.jshintrc');
    }

    if (this.useLess) {
      this.mkdir('src/app/styles');
      this.write('src/app/styles/' + _.slugify(this.appname) + '.less', '');
    }

    done();
  }.bind(this));
};

IwrProjectGenerator.prototype.setupBasicProject = function() {
  // always copy bower.json because installDependencies errors if it can't find
  // it.
  this.template('_bower.json', 'bower.json');
  this.template('_editorconfig', '.editorconfig');
  this.template('_Gruntfile.coffee', 'Gruntfile.coffee');
  this.template('_jscsrc', '.jscsrc');
  this.template('_LICENSE', 'LICENSE');
  this.template('_package.json', 'package.json');
  this.template('_README.md', 'README.md');
  this.copy('gitignore', '.gitignore');
  if (this.isLibrary) {
    this.copy('index.js', 'index.js');
  }
};

IwrProjectGenerator.prototype.setupTest = function() {
  if (this.unitTests || this.integrationTests || this.acceptanceTests) {
    this.mkdir('test');

    if (this.unitTests) {
      this.mkdir('test/unit');
      this.mkdir('test/unit/fixtures');
      this.mkdir('test/unit/lib');
      this.mkdir('test/unit/spec');

      this.template('test/unit/spec/_test.js', 'test/unit/spec/test.js');
      this.template('test/unit/_jshintrc', 'test/unit/.jshintrc');
    }

    if (this.integrationTests) {
      this.mkdir('test/integration');
      this.mkdir('test/integration/fixtures');
      this.mkdir('test/integration/lib');
      this.mkdir('test/integration/spec');

      this.template('test/integration/spec/_test.js', 'test/integration/spec/test.js');
      this.template('test/integration/_jshintrc', 'test/integration/.jshintrc');
    }

    if (this.acceptanceTests) {
      this.mkdir('test/acceptance');
      this.mkdir('test/acceptance/fixtures');
      this.mkdir('test/acceptance/lib');
      this.mkdir('test/acceptance/spec');

      this.template('test/acceptance/spec/_test.js', 'test/acceptance/spec/test.js');
      this.template('test/acceptance/_jshintrc', 'test/acceptance/.jshintrc');
    }
  }
};
