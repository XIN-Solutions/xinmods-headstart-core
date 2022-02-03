require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.object.assign.js");

/*
	 _   _ _                      ____                            _   _
	| | | (_)_ __  _ __   ___    / ___|___  _ __  _ __   ___  ___| |_(_) ___  _ __
	| |_| | | '_ \| '_ \ / _ \  | |   / _ \| '_ \| '_ \ / _ \/ __| __| |/ _ \| '_ \
	|  _  | | |_) | |_) | (_) | | |__| (_) | | | | | | |  __/ (__| |_| | (_) | | | |
	|_| |_|_| .__/| .__/ \___/   \____\___/|_| |_|_| |_|\___|\___|\__|_|\___/|_| |_|
	        |_|   |_|


	Purpose:

		A single place to get the hippo connection from.

 */
var xinmods = require('xinmods');

var HippoConfig = {
  cached: process.env.HIPPO_DISABLE_CACHE !== 'true',
  ttl: parseInt(process.env.HIPPO_CACHE_TTL),
  isRemote: process.env.HIPPO_REMOTE === 'true',
  url: process.env.HIPPO_URL || 'http://localhost:8080',
  user: process.env.HIPPO_USER || 'admin',
  password: process.env.HIPPO_PASSWORD || 'admin',
  cdnUrl: process.env.HIPPO_CDN_URL || null
};
/**
 * @type {HippoConnection}
 */

module.exports = function () {
  var cacheName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'system';
  var ttl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : HippoConfig.ttl;
  var options = {
    cache: {
      enabled: HippoConfig.cached,
      ttl: ttl,
      cacheName: cacheName
    }
  }; // make sure the system knows this cache exists.

  var Cache = require('./Cache.js');

  Cache.addCacheName(cacheName);

  if (HippoConfig.isRemote) {
    Object.assign(options, {
      hippoApi: '/api',
      xinApi: '/api/xin',
      assetPath: '/binaries',
      assetModPath: '/assetmod',
      cdnUrl: HippoConfig.cdnUrl
    });
  }

  return xinmods.connectTo(HippoConfig.url, HippoConfig.user, HippoConfig.password, options);
};