require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

/*
	  ____           _            _____               _    _
	 / ___|__ _  ___| |__   ___  |_   _| __ __ _  ___| | _(_)_ __   __ _
	| |   / _` |/ __| '_ \ / _ \   | || '__/ _` |/ __| |/ / | '_ \ / _` |
	| |__| (_| | (__| | | |  __/   | || | | (_| | (__|   <| | | | | (_| |
	 \____\__,_|\___|_| |_|\___|   |_||_|  \__,_|\___|_|\_\_|_| |_|\__, |
																   |___/

	Purpose:

		To track all known caches

 */
var _ = require('lodash');
/**
 * A map where the keys are the unique known caches
 * @type {Object}
 */


var knownCaches = {};
module.exports = {
  addCacheName: function addCacheName(name) {
    knownCaches[name] = true;
  },
  flushAll: function flushAll() {
    var Hippo = require('./Hippo.js');

    console.log(">> Clearing caches"); // visit all known keys and flush the caches.

    _.keys(knownCaches).forEach(function (cacheName) {
      console.log(" .. clearing ", cacheName);
      var conn = Hippo(cacheName);
      conn.cache.flushCache();
      delete knownCaches[cacheName];
    });

    console.log(" .. completed.");
  }
};