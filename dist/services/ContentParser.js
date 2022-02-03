require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.is-array.js");

var _regeneratorRuntime = require("@babel/runtime/regenerator");

var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.find.js");

require("core-js/modules/es.function.name.js");

var _ = require('lodash');

var RewritingStream = require('parse5-html-rewriting-stream');

var _require = require('stream'),
    Writable = _require.Writable,
    Readable = _require.Readable;

module.exports = {
  /**
   * An image url that needs to be converted to the CDN url if set.
   *
   * @param url	{string} the url to convert
   * @returns {string|*} the converted url or the same of CDN URL is not set.
   */
  cdnUrl: function cdnUrl(url) {
    if (process.env.HIPPO_CDN_URL) {
      return process.env.HIPPO_CDN_URL + url;
    }

    return url;
  },

  /**
   * Get link path information
   * @param linkInfo
   * @returns {Promise<*>}
   */
  getLinkPath: function getLinkPath(hippo, linkInfo) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(linkInfo.type === "binary")) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", _this.cdnUrl(linkInfo.url));

            case 2:
              if (_this.resolver) {
                _context.next = 5;
                break;
              }

              console.error("No link resolver set, will not resolve links.");
              return _context.abrupt("return", "#");

            case 5:
              return _context.abrupt("return", _this.resolver(linkInfo));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },

  /**
   * Parse the html and replace any internal links with their proper links.
   * @returns {Promise<void>}
   */
  parseHtml: function parseHtml(hippo, textBlock) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var linkNames, linkInfo, _iterator, _step, linkName;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              linkNames = _.keys(textBlock.links);
              linkInfo = {};
              _iterator = _createForOfIteratorHelper(linkNames);
              _context2.prev = 3;

              _iterator.s();

            case 5:
              if ((_step = _iterator.n()).done) {
                _context2.next = 12;
                break;
              }

              linkName = _step.value;
              _context2.next = 9;
              return _this2.getLinkPath(hippo, textBlock.links[linkName]);

            case 9:
              linkInfo[linkName] = _context2.sent;

            case 10:
              _context2.next = 5;
              break;

            case 12:
              _context2.next = 17;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](3);

              _iterator.e(_context2.t0);

            case 17:
              _context2.prev = 17;

              _iterator.f();

              return _context2.finish(17);

            case 20:
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                var rewriter = new RewritingStream();
                var chunks = [];
                var writer = new Writable({
                  write: function write(chunk, encoding, callback) {
                    chunks.push(chunk);
                    callback(null);
                  }
                });
                writer.on("finish", function () {
                  var resultStr = Buffer.concat(chunks).toString('utf8');
                  resolve(resultStr);
                }); // waiting on an 'a' tag with some hippo link in it.

                // waiting on an 'a' tag with some hippo link in it.
                rewriter.on('startTag', function (startTag) {
                  if (startTag.tagName === 'img') {
                    var linkAttr = startTag.attrs ? _.find(startTag.attrs, function (attr) {
                      return attr.name === 'data-hippo-link';
                    }) : null;

                    if (linkAttr) {
                      var linkName = linkAttr.value; // get link path

                      // get link path
                      linkAttr.name = "src";
                      linkAttr.value = linkInfo[linkName] || "#";
                    }
                  }

                  if (startTag.tagName === 'a') {
                    if (startTag.attrs) {
                      var _linkAttr = null;

                      var _iterator2 = _createForOfIteratorHelper(startTag.attrs),
                          _step2;

                      try {
                        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                          var attr = _step2.value;

                          if (attr && attr.name === 'data-hippo-link') {
                            _linkAttr = attr;
                          }
                        }
                      } catch (err) {
                        _iterator2.e(err);
                      } finally {
                        _iterator2.f();
                      }

                      if (_linkAttr) {
                        // get link path
                        var _linkName = _linkAttr.value;
                        _linkAttr.name = "href";
                        _linkAttr.value = linkInfo[_linkName] || "#";
                      }
                    }
                  }

                  rewriter.emitStartTag(startTag);
                }); // start the process

                // start the process
                var reader = Readable.from(textBlock.content);
                reader.pipe(rewriter).pipe(writer);
              }));

            case 21:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[3, 14, 17, 20]]);
    }))();
  },

  /**
   * Sets the link resolver we're after.
   * @param resolver
   */
  setLinkResolver: function setLinkResolver(resolver) {
    this.resolver = resolver;
  }
};