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
        sh.run('bundle install');
        this.npmInstall();
        this.bowerInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    //Greet the user with Sketch!
    var welcome =
    chalk.white('\n  _______ __          __        __    ') +
    chalk.white('\n |   _   |  |--.-----|  |_.----|  |--.') +
    chalk.white('\n |   |___|    <|  -__|   _|  __|     |') +
    chalk.white('\n |____   |__|__|_____|____|____|__|__|') +
    chalk.white('\n |   |   |   ') + chalk.magenta('____') + chalk.gray('_') + chalk.yellow('__________________') +
    chalk.white('\n |       |  ') + chalk.magenta('/   ') + chalk.gray('//') + chalk.yellow('=================') + chalk.red('/`"-._') +
    chalk.white('\n `-------\' ') + chalk.magenta('|   ') + chalk.gray('||') + chalk.yellow('=================') + chalk.red('|      ') + chalk.grey('D') +
    chalk.magenta('\n            \\___') + chalk.gray('\\\\') + chalk.yellow('_________________') + chalk.red('\\__.-"');

    console.log(welcome + '\n');

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('Quickly sketch out ideas in HTML, Sass, and JS.'));

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