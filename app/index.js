'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _s = require('underscore.string');
var sh = require('execSync');

var SketchGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        if (!this.options['init']) {
          process.chdir(this.folder);
        }
        this.npmInstall();
        this.bowerInstall();
        sh.run('bundle install');
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('You\'re using the fantastic Sketch generator.'));

    var prompts = [{
      type: 'string',
      name: 'sketchName',
      message: 'What\'s your project\'s name?' + chalk.red(' (Required)'),
      validate: function (input) {
        if (input === '') {
          return 'Please enter your project\'s name';
        }
        return true;
      }
    }];

    this.prompt(prompts, function (props) {
      this.sketchName = props.sketchName;
      this.slug = _s.slugify(this.sketchName);
      this.folder = this.options['init'] ? '.' : this.slug;

      done();
    }.bind(this));
  },

  app: function () {
    this.template('_package.json', this.folder + '/package.json');
    this.template('_bower.json', this.folder + '/bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', this.folder + '/.editorconfig');
    this.copy('jshintrc', this.folder + '/.jshintrc');
    this.copy('gitignore', this.folder + '/.gitignore');
    this.directory('bundle', this.folder + '/.bundle');

    this.copy('config.rb', this.folder + '/config.rb');
    this.copy('Gruntfile.js', this.folder + '/Gruntfile.js');

    this.template('index.html', this.folder + '/index.html');
    this.copy('Gemfile', this.folder + '/Gemfile');

    this.directory('sass', this.folder + '/sass');
    this.copy('gitkeep', this.folder + '/images/.gitkeep');
    this.copy('gitkeep', this.folder + '/js/.gitkeep');
    this.copy('gitkeep', this.folder + '/fonts/.gitkeep');
  }
});

module.exports = SketchGenerator;