'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var _s = require('underscore.string');

var types = '',
    type = '',
    name = '',
    options = '';
var templates = ['style-tile'];

var TemplateGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    if (this.args.length > 1) {
      options = this.args.shift();
    }
    types = this.name.split(':');
    type = types[0];
    if (types.length > 1) {
      name = types[1];
    }
    // console.log('You called the ' + type + ' template with the name ' + name);
  },

  files: function () {
    if (type.toLowerCase() === 'style-tile') {
      var indexPath = 'style-tile';
      var sassPath = 'sass';

      if (name !== '') {
        name = _s.slugify(name);
        indexPath = name;
      }

      if (fs.existsSync('sass/partials')) {
        sassPath += '/partials';
      }

      this.copy('style-tile/tile.html', indexPath + '/index.html');
      this.copy('style-tile/_tile.scss', sassPath + '/components/_tile.scss');
      this.directory('style-tile/tile', sassPath + '/components/tile');
      this.copy('style-tile/_style-tile.scss', sassPath + '/layouts/_style-tile.scss');
      this.directory('style-tile/style-tile', sassPath + '/layouts/style-tile');

      console.log('Style Tile HTML created at ' + chalk.cyan(indexPath + '/index.html'));
      console.log('Style Tile Sass created, please add ' + chalk.red('@import "' + sassPath + '/components/tile";') + ' and ' + chalk.red('@import "' + sassPath + '/layouts/style-tile";') + ' to your Sass file');
    }

    type = '';
    name = '';
    options = '';
  }
});

module.exports = TemplateGenerator;