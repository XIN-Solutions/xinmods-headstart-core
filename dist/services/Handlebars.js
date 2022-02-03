var _regeneratorRuntime = require("@babel/runtime/regenerator");

var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.string.link.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.promise.js");

var _ = require('lodash');

var fs = require('fs');

var ContentParser = require("./ContentParser.js");

var Models = require("./Models.js");

module.exports = {
  registerHelpers: function registerHelpers(hbs) {
    /**
     * Simple JSON output handlebars helper.
     */
    hbs.registerHelper('inlineFile', function (context) {
      var file = fs.readFileSync(context);
      return file;
    });
    /**
     * Simple JSON output handlebars helper.
     */

    hbs.registerHelper('json', function (context) {
      var skipHippo = function skipHippo(key, value) {
        if (key === 'hippo') {
          return null;
        }

        return value;
      };

      return JSON.stringify(context, skipHippo, 4);
    });
    /**
     * Simple JSON output handlebars helper.
     */

    hbs.registerHelper('jsonflat', function (context) {
      var skipHippo = function skipHippo(key, value) {
        if (key === 'hippo') {
          return null;
        }

        return value;
      };

      return JSON.stringify(context, skipHippo);
    });
    hbs.registerHelper('nl2br', function (context) {
      return context.replace("\n", "<br>");
    });
    hbs.registerHelper("length", function (a, options) {
      return a.length;
    });
    hbs.registerHelper("has-items", function (a, options) {
      return !_.isEmpty(a);
    });
    hbs.registerHelper("odd", function (a, options) {
      return a % 2 === 1;
    });
    hbs.registerHelper("even", function (a, options) {
      return a % 2 === 0;
    });
    hbs.registerHelper("not", function (a, options) {
      return !!!a;
    });
    hbs.registerHelper("and", function (a, b, options) {
      if (a && b) {
        return true;
      }

      return null;
    });
    hbs.registerHelper("or", function (a, b, options) {
      if (a || b) {
        return true;
      }

      return null;
    });
    hbs.registerHelper('equals', function (first, second) {
      return first == second;
    });
    hbs.registerHelper('?:', function (v1, thenCond, elseCond, options) {
      if (v1) {
        return thenCond;
      }

      return elseCond;
    });
    hbs.registerHelper("concat", function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var items = [].concat(args);
      items.pop();
      return items.join("");
    });
    hbs.registerHelper('fallback', function (v1, elseCond, options) {
      if (v1) {
        return v1;
      }

      return elseCond;
    });
    hbs.registerHelper('image-url', function (image, options) {
      var _options$hash;

      if (!image) {
        return null;
      }

      if (typeof image === 'string') {
        return image;
      }

      var _ref = (_options$hash = options.hash) !== null && _options$hash !== void 0 ? _options$hash : {},
          width = _ref.width,
          height = _ref.height,
          cropX = _ref.cropX,
          cropY = _ref.cropY,
          document = _ref.document;

      if (image.type && image.link && !document) {
        throw new Error("Expecting 'document' specified in image-url helper when using raw image object.");
      }

      var isRawImg = document && image.type && image.link;
      var cloned = isRawImg ? document.hippo.getImageFromLinkSync(image) : image.clone();

      if (width) {
        cloned.scaleWidth(width);
      } else if (height) {
        cloned.scaleHeight(height);
      }

      if (cropX && cropY) {
        cloned.crop(cropX, cropY);
      }

      return cloned.toUrl();
    });
    hbs.registerAsyncHelper('html-field', /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(options, cb) {
        var _options$hash2, _field$items$html, _field$items, _field$items2;

        var ContentParser, _ref3, document, field, parsedContent;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ContentParser = require('./ContentParser.js');
                _ref3 = (_options$hash2 = options.hash) !== null && _options$hash2 !== void 0 ? _options$hash2 : {}, document = _ref3.document, field = _ref3.field;

                if (document) {
                  _context.next = 4;
                  break;
                }

                throw new Error("Expected `document=<value>` with .hippo field in html-field include.");

              case 4:
                if (field) {
                  _context.next = 6;
                  break;
                }

                throw new Error("Expected `field=<html-object>` field in html-field include.");

              case 6:
                _context.next = 8;
                return ContentParser.parseHtml(document.hippo, (_field$items$html = (_field$items = field.items) === null || _field$items === void 0 ? void 0 : _field$items.html) !== null && _field$items$html !== void 0 ? _field$items$html : (_field$items2 = field.items) === null || _field$items2 === void 0 ? void 0 : _field$items2.text);

              case 8:
                parsedContent = _context.sent;
                cb(parsedContent);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    hbs.registerHelper('use', function (model, options) {
      var Models = require('./Models.js');

      if (!model) {
        console.error("The model does not exist.");
        return null;
      }

      if (!options) {
        console.error("No options specified.");
        return null;
      }

      var variation = options.hash.as;

      if (!variation) {
        throw new Error("Expected 'variation' parameter on #use helper.");
      }

      var baseDoc = options.hash.document; // is an array, or is map with only numeric keys.

      var isMultiple = _.isArray(model) || _.keys(model).filter(function (number) {
        return number == parseInt(number);
      }).length === _.keys(model).length;

      if (isMultiple) {
        var elements = _.map(_.values(model), function (el) {
          return Models.transform(el, variation, baseDoc !== null && baseDoc !== void 0 ? baseDoc : null);
        });

        return options.fn ? options.fn(elements) : elements;
      }

      var result = Models.transform(model, variation, baseDoc !== null && baseDoc !== void 0 ? baseDoc : null);
      return options.fn ? options.fn(result) : result;
    });
    hbs.registerHelper("get-config", function (config) {
      var Config = require('./AppConfig.js');

      return Config[config];
    });
    /**
     * Handlebars block helper to check if an env var is set to true or not
     */

    hbs.registerHelper('feature-enabled', function (featureName, options) {
      var envName = "FEATURE_".concat(featureName.toUpperCase());

      if (process.env[envName] === 'enabled') {
        return options.fn(this);
      }

      return '';
    });
  },

  /**
   * Initialise common handlebars function we need.
   *
   * @param hbs	handlebars instance
   */
  initialise: function initialise(app, hbs, rootFolder) {
    var _this = this;

    var headstartRootFolder = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    return new Promise(function (resolve, reject) {
      _this.registerHelpers(hbs);

      var nodeFolder = headstartRootFolder !== null && headstartRootFolder !== void 0 ? headstartRootFolder : "".concat(rootFolder, "/node_modules/xinmods-headstart");
      /**
       * Configure the handlebars engine
       */

      app.engine('hbs', hbs.express4({
        partialsDir: ["".concat(nodeFolder, "/views/components"), "".concat(nodeFolder, "/views/partials"), rootFolder + '/views/partials'],
        layoutsDir: rootFolder + '/views/layouts',
        cache: true
      }));
      app.set('view engine', 'hbs');
      app.set('views', ["".concat(nodeFolder, "/views/pages"), "".concat(rootFolder, "/views/partials"), "".concat(rootFolder, "/views/pages"), "".concat(rootFolder, "/views/components")]); // precache partials so the markdown engine knows about them

      hbs.cachePartials(function () {
        resolve();
      });
    });
  }
};