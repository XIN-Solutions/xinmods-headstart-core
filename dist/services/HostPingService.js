require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.is-array.js");

var _regeneratorRuntime = require("@babel/runtime/regenerator");

var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

require("core-js/modules/es.date.now.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/web.timers.js");

var _ = require('lodash');

var os = require('os');

var AWS = require('aws-sdk');

var S3 = new AWS.S3({
  apiVersion: "2006-03-01"
}); // 5 minutes ping interval

var HostPingInterval = 60 * 1000 * 5; // bucket and baseFolder for storing the host ping files.

var bucket = process.env.HOST_PING_BUCKET || null;
var baseFolder = process.env.HOST_PING_KEY || null;
module.exports = {
  /**
   * Get a list of active hostnames from S3.
   *
   * @param includeSelf {boolean} decide whether to include this host in the list of returned items.
   */
  getActiveHostnames: function getActiveHostnames() {
    var _arguments = arguments;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var includeSelf, ownHostname, currentTime, hosts, results, _iterator, _step, hostObject, lastModStamp, timeSinceStamp, remoteHostname;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              includeSelf = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : false;

              if (!(!bucket || !baseFolder)) {
                _context.next = 3;
                break;
              }

              throw new Error("Should set HOST_PING_BUCKET and HOST_PING_KEY");

            case 3:
              ownHostname = os.hostname();
              currentTime = Date.now();
              hosts = [];
              _context.prev = 6;
              _context.next = 9;
              return S3.listObjects({
                Bucket: bucket,
                Prefix: baseFolder
              }).promise();

            case 9:
              results = _context.sent;
              _iterator = _createForOfIteratorHelper(results.Contents);
              _context.prev = 11;

              _iterator.s();

            case 13:
              if ((_step = _iterator.n()).done) {
                _context.next = 24;
                break;
              }

              hostObject = _step.value;
              lastModStamp = hostObject.LastModified.getTime();
              timeSinceStamp = currentTime - lastModStamp; // if a server hasn't written for five times, it's still considered an active server

              if (!(timeSinceStamp < HostPingInterval * 5)) {
                _context.next = 22;
                break;
              }

              remoteHostname = _.last(hostObject.Key.split("/")); // found myself, but shouldn't be included? skip.

              if (!(!includeSelf && remoteHostname === ownHostname)) {
                _context.next = 21;
                break;
              }

              return _context.abrupt("continue", 22);

            case 21:
              hosts.push(remoteHostname);

            case 22:
              _context.next = 13;
              break;

            case 24:
              _context.next = 29;
              break;

            case 26:
              _context.prev = 26;
              _context.t0 = _context["catch"](11);

              _iterator.e(_context.t0);

            case 29:
              _context.prev = 29;

              _iterator.f();

              return _context.finish(29);

            case 32:
              _context.next = 37;
              break;

            case 34:
              _context.prev = 34;
              _context.t1 = _context["catch"](6);
              console.error("Cannot retrieve hostnames:", _context.t1);

            case 37:
              return _context.abrupt("return", hosts);

            case 38:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[6, 34], [11, 26, 29, 32]]);
    }))();
  },

  /**
   * Write the internal hostname to S3.
   */
  writeHostname: function writeHostname() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var hostname;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!bucket || !baseFolder)) {
                _context2.next = 2;
                break;
              }

              throw new Error("Should set HOST_PING_BUCKET and HOST_PING_KEY");

            case 2:
              hostname = os.hostname();
              _context2.prev = 3;
              _context2.next = 6;
              return S3.putObject({
                Bucket: bucket,
                Key: "".concat(baseFolder, "/").concat(hostname),
                Body: "*ping*"
              }).promise();

            case 6:
              console.log("Completed writing hostname being active: ".concat(hostname));
              _context2.t0 = console;
              _context2.t1 = "All active hostnames are: ";
              _context2.next = 11;
              return _this.getActiveHostnames(true);

            case 11:
              _context2.t2 = _context2.sent;
              _context2.t3 = _context2.t1.concat.call(_context2.t1, _context2.t2);

              _context2.t0.log.call(_context2.t0, _context2.t3);

              _context2.next = 19;
              break;

            case 16:
              _context2.prev = 16;
              _context2.t4 = _context2["catch"](3);
              console.error("Could not write hostname being active to S3: ".concat(hostname));

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[3, 16]]);
    }))();
  },

  /**
   * Start sending hostnames.
   */
  start: function start() {
    var _this2 = this;

    if (!bucket || !baseFolder) {
      throw new Error("Should set HOST_PING_BUCKET and HOST_PING_KEY");
    }

    setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _this2.writeHostname();

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), HostPingInterval);
    this.writeHostname().then(function () {
      return console.log("[background] Completed writing hostname to S3 webhook forwarding location");
    })["catch"](function (err) {
      return console.error("[background] Something went wrong: ", err);
    });
  }
};