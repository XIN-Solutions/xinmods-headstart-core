var _regeneratorRuntime = require("@babel/runtime/regenerator");

var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");

var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");

var _createClass = require("@babel/runtime/helpers/createClass");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

var AWS = require('aws-sdk');

var SES = new AWS.SES({
  apiVersion: "2010-12-01"
});

var juice = require('juice');

var EmailService = /*#__PURE__*/function () {
  "use strict";

  /**
   * Initialise data-members
   */
  function EmailService() {
    _classCallCheck(this, EmailService);
  }
  /**
   * Send an email to someone using a specific template that has a number of values inserted.
   *
   * @param customer {object} the customer information.
   * @param to {string} the email address
   * @param htmlTemplate {string} the name of the template
   * @param values {object} the values to insert into the template
   */


  _createClass(EmailService, [{
    key: "sendEmail",
    value: function () {
      var _sendEmail = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(app, customer, from, to, subject) {
        var htmlTemplate,
            values,
            _args2 = arguments;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                htmlTemplate = _args2.length > 5 && _args2[5] !== undefined ? _args2[5] : null;
                values = _args2.length > 6 ? _args2[6] : undefined;
                console.log("Sending an email to ".concat(to, ", of template: ").concat(htmlTemplate, ", with values: "), values);
                return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve, reject) {
                    return _regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            app.render(htmlTemplate, values, function (err, htmlContents) {
                              if (err) {
                                reject(err);
                                return;
                              }

                              var inlinedHtml = juice(htmlContents); // send the email.

                              // send the email.
                              SES.sendEmail({
                                Source: from,
                                Destination: {
                                  ToAddresses: [to]
                                },
                                Message: {
                                  Subject: {
                                    Data: subject
                                  },
                                  Body: {
                                    Html: {
                                      Data: inlinedHtml
                                    }
                                  }
                                }
                              }).promise().then(resolve)["catch"](reject);
                            });

                          case 1:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x6, _x7) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function sendEmail(_x, _x2, _x3, _x4, _x5) {
        return _sendEmail.apply(this, arguments);
      }

      return sendEmail;
    }()
  }]);

  return EmailService;
}();

module.exports = EmailService;