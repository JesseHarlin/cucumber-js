var HtmlFormatter = function HtmlFormatter(options) {
  var fs = require('fs');
  var path = require('path');
  var _ = require('underscore');

  var Cucumber = require('../../cucumber');
  var self = Cucumber.Listener.Formatter(options);



  var jsonFormatter = Cucumber.Listener.JsonFormatter({
    coffeeScriptSnippets: options.coffeeScriptSnippets,
    logToConsole: false
  });

  var sources = {
    indexTemplate: path.join(__dirname, '/templates/index.tmpl'),
    featuresTemplate: path.join(__dirname + '/templates/features.tmpl'),
    css: path.join(__dirname + '/templates/styles.css'),
  };

  var currentMaxStepLength = 0;

  var parentHear = self.hear;
  self.hear = function hear(event, callback) {
    jsonFormatter.hear(event, function () {
      parentHear(event, callback);
    });
  };

  function readFile(filepath) {
    try {
      contents = fs.readFileSync(String(filepath));
      return contents.toString();
    } catch (e) {
      throw 'Unable to read "' + filepath + '" file (Error code: ' + e.code + ').';
    }

  }

  self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(event, callback) {
    //var jsonLogs = jsonFormatter.getLogs();

    var logs = jsonFormatter.getLogs();
    var jsonModel = JSON.parse(logs);

    var indexTmpl = _.template(readFile(sources.indexTemplate));
    var featuresTmpl = _.template(readFile(sources.featuresTemplate));
    var styles = readFile(sources.css);


    var featuresHtml = featuresTmpl({
      features: jsonModel
    });

    var htmlOut = indexTmpl({
      styles: styles,
      features: featuresHtml
    });

    self.log(htmlOut);
    callback();
  };

  return self;
};

module.exports = HtmlFormatter;