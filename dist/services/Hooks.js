require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.is-array.js");

var _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");

var _regeneratorRuntime = require("@babel/runtime/regenerator");

var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.set.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.find.js");

require("core-js/modules/es.string.starts-with.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.assign.js");

/*
     _   _             _
    | | | | ___   ___ | | _____
    | |_| |/ _ \ / _ \| |/ / __|
    |  _  | (_) | (_) |   <\__ \
    |_| |_|\___/ \___/|_|\_\___/

    Purpose:

        To be able to register and run bits of code with particular identifiers.

 */
var _ = require('lodash');

module.exports = {
  funcs: {},

  /**
   * Generate a view (GET) endpoint that builds its view model off of registered hooks with IDs
   * specified in `ids`. The default template to use is specified in `template` but can be overridden with
   * a hook.
   *
   * @param template  {string} the template to use for rendering
   * @param ids {string[]} a list of hook ids to execute before rendering the template
   * @returns {(function(*=, *=): Promise<void>)|*}
   */
  viewEndpoint: function viewEndpoint(template, ids) {
    var thiz = this;
    return /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, resp) {
        var _viewModel$template, viewModel, useTemplate;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return thiz.invokeAllAsMap(ids, req, resp);

              case 3:
                viewModel = _context.sent;
                useTemplate = (_viewModel$template = viewModel === null || viewModel === void 0 ? void 0 : viewModel.template) !== null && _viewModel$template !== void 0 ? _viewModel$template : template;
                resp.render(useTemplate, viewModel);
                _context.next = 12;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.log("Something went wrong: ", _context.t0);
                resp.status(500).send(_context.t0.message);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
  },

  /**
   * Register a new hook against a particular ID. One ID can have multiple hooks against it
   *
   * @param id    {string} the identifier to register
   * @param func  {function} the function to register.
   */
  register: function register(id, func) {
    var _this$funcs$id;

    var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    this.funcs[id] = (_this$funcs$id = this.funcs[id]) !== null && _this$funcs$id !== void 0 ? _this$funcs$id : []; // clear out any existing code (might be a bad idea).

    if (override) {
      this.funcs[id] = [];
    }

    this.funcs[id].push(func);
  },

  /**
   * Retrieve all functions registered against a particular identifier.
   *
   * @param id {string|string[]} an id to look for
   * @param options {object} the options object
   * @param options.prefix {boolean} if true then search for any hook starting with 'id'
   */
  find: function find(id) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      prefix: false
    };
    var searchTerm = _.isArray(id) ? id : [id]; // iterate over all keys and determine which match

    var allFuncs = new Set();

    var _iterator = _createForOfIteratorHelper(_.keys(this.funcs)),
        _step;

    try {
      var _loop = function _loop() {
        var funcKey = _step.value;

        // searching for prefix but didnt find anything? continue.
        if (options.prefix && !searchTerm.find(function (term) {
          return funcKey.startsWith(term);
        })) {
          return "continue";
        } // not searching for prefix and didn't find a direct match? continue.
        else if (!options.prefix && !searchTerm.find(function (term) {
          return funcKey === term;
        })) {
          return "continue";
        }

        allFuncs.add(_this.funcs[funcKey]);
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return _.flatten(_toConsumableArray(allFuncs));
  },

  /**
   * Invoke a set of registered functions. If they return a promise (when it's an
   * async function for example), we will wait for all of the promises to resolve. This
   * also means you might not get the results in the order you initially registered them, keep
   * this in mind.
   *
   * @param ids       {string|string[]} the prefix of the function that need to be invoked.
   * @param args      {array[]} all arguments to pass into the functions we're calling
   * @returns {Promise<*[]>}
   */
  invokeAll: function invokeAll(ids) {
    var _arguments = arguments,
        _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var _ref2;

      var _len, args, _key, all, results, resolvedResults, awaitsPromise, promiseResults;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              for (_len = _arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _arguments[_key];
              }

              all = ids[0] instanceof Function ? ids : _this2.find(ids, {
                prefix: false
              });
              results = all.map(function (func) {
                return func.apply(void 0, args);
              }); // get a list of normal results

              resolvedResults = results.filter(function (el) {
                return !(el instanceof Promise);
              }); // get a list of functions that result in a promise and wait for them to resolve

              awaitsPromise = results.filter(function (el) {
                return el instanceof Promise;
              });
              _context2.next = 7;
              return Promise.all(awaitsPromise);

            case 7:
              promiseResults = _context2.sent;
              return _context2.abrupt("return", (_ref2 = []).concat.apply(_ref2, _toConsumableArray(resolvedResults)).concat(promiseResults));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },

  /**
   * Convenience function that invokes all handlers with `ids` prefixes and mashes
   * the results into a single map.
   *
   * @param ids       {string|string[]} the prefix of the function that need to be invoked.
   * @param args      {array[]} all arguments to pass into the functions we're calling
   * @returns {Promise<{}>}
   */
  invokeAllAsMap: function invokeAllAsMap(ids) {
    var _arguments2 = arguments,
        _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var _len2, args, _key2, invokeResult, withResult, output, _iterator2, _step2, resultElement;

      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              for (_len2 = _arguments2.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = _arguments2[_key2];
              }

              _context3.next = 3;
              return _this3.invokeAll.apply(_this3, [ids].concat(args));

            case 3:
              invokeResult = _context3.sent;
              // keep only results that have a non-falsy result
              withResult = invokeResult.filter(function (result) {
                return !!result;
              }); // mash everything into a single map.

              output = {};
              _iterator2 = _createForOfIteratorHelper(withResult);

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  resultElement = _step2.value;
                  Object.assign(output, resultElement);
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              return _context3.abrupt("return", output);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  }
};