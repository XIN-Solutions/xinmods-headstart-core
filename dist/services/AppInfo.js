require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

/*
        _                _ _           _   _               ___        __
       / \   _ __  _ __ | (_) ___ __ _| |_(_) ___  _ __   |_ _|_ __  / _| ___
      / _ \ | '_ \| '_ \| | |/ __/ _` | __| |/ _ \| '_ \   | || '_ \| |_ / _ \
     / ___ \| |_) | |_) | | | (_| (_| | |_| | (_) | | | |  | || | | |  _| (_) |
    /_/   \_\ .__/| .__/|_|_|\___\__,_|\__|_|\___/|_| |_| |___|_| |_|_|  \___/
            |_|   |_|

    Purpose:

        To retrieve information about the application from pacakge.json

 */
var fs = require('fs');

module.exports = {
  /**
   * @returns {object} the package json deserialised in javascript objects
   * @private
   */
  _getPackageJson: function _getPackageJson() {
    try {
      var rawJson = fs.readFileSync("package.json", {
        encoding: "utf-8"
      });
      return JSON.parse(rawJson.toString());
    } catch (err) {
      console.error("Could not read package.json from the bundle. Caused by:", err);
      return null;
    }
  },

  /**
   * Get the application version as described in the package.json
   * @returns {string}
   */
  getVersion: function getVersion() {
    var pkgJson = this._getPackageJson();

    if (pkgJson === null) {
      return "v1.0.0";
    }

    return "v".concat(pkgJson.version);
  }
};