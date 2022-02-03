require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.index-of.js");

/*
	 _____                                _   _       _     ____      _                 _
	| ____|_  ___ __  _ __ ___  ___ ___  | | | | ___ | |_  |  _ \ ___| | ___   __ _  __| |
	|  _| \ \/ / '_ \| '__/ _ \/ __/ __| | |_| |/ _ \| __| | |_) / _ \ |/ _ \ / _` |/ _` |
	| |___ >  <| |_) | | |  __/\__ \__ \ |  _  | (_) | |_  |  _ <  __/ | (_) | (_| | (_| |
	|_____/_/\_\ .__/|_|  \___||___/___/ |_| |_|\___/ \__| |_| \_\___|_|\___/ \__,_|\__,_|
			   |_|

	Purpose:

		To clear out server require cache when a server side file was changed and to
		notify the frontend through a websocket if the SCSS was touched.
*/

/** Inspiration for code: https://nimblewebdeveloper.com/blog/hot-reload-nodejs-server */
var chokidar = require("chokidar");

var WebSocket = require('ws');

var Config = require('./AppConfig.js');

var wsServer = null;
var reloadHandlers = [];
module.exports = {
  /**
   * Clear all required files from the cache that have a certain path prefix.
   */
  clearRequireCache: function clearRequireCache() {
    // Loop through the cached modules
    // The "id" is the FULL path to the cached module
    Object.keys(require.cache).forEach(function (id) {
      //Get the local path to the module
      var localId = id.substr(process.cwd().length); //Ignore anything not in server/app

      if (localId.match(/^\/src\//)) {
        //Remove the module from the cache
        delete require.cache[id];
      }
    });
  },

  /**
   * Send a message through websocket to refresh the CSS
   */
  notifyFrontend: function notifyFrontend(file) {
    wsServer.clients.forEach(function (client) {
      if (client.readyState !== WebSocket.OPEN) {
        return;
      }

      client.send(JSON.stringify({
        action: 'reload',
        file: file
      }));
    });
  },

  /**
   * Start the websocket server on port 30303 so that we can send notification messages.
   */
  initialiseWsMessaging: function initialiseWsMessaging() {
    wsServer = new WebSocket.Server({
      port: Config.hotReloadPort
    });
    console.log("Started hot reload websocket server on port", Config.hotReloadPort);
  },

  /**
   * Add a new reload handler.
   *
   * @param doThis {function} the function to invoke when reload is required.
   * @param name {string} the name of the handler
   */
  onReload: function onReload(doThis) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (name) {
      console.log("Registering hot reload handler: ", name);
    }

    reloadHandlers.push(doThis);
  },

  /**
   * Start the hot reloading process
   */
  start: function start() {
    var _Config$hotReloadPath,
        _Config$hotReloadPath2,
        _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      onReload: []
    };

    if (!Config.hotReload) {
      return;
    }

    if (options.onReload) {
      options.onReload.forEach(function (handler) {
        return reloadHandlers.push(handler);
      });
    } //Set up watcher to watch all files in ./server/app


    var watcher = chokidar.watch((_Config$hotReloadPath = (_Config$hotReloadPath2 = Config.hotReloadPaths) === null || _Config$hotReloadPath2 === void 0 ? void 0 : _Config$hotReloadPath2.split(",")) !== null && _Config$hotReloadPath !== void 0 ? _Config$hotReloadPath : ["./src", "assets/dist/"]);
    watcher.on("ready", function () {
      var handler = function handler(type) {
        return function (file) {
          if (file.match(/\.js$/) && file.indexOf('src/') !== -1) {
            console.log(type + " in JS detected, reloading .. ", file);

            _this.clearRequireCache();

            console.log("Reload handlers: ", reloadHandlers.length);
            reloadHandlers.forEach(function (rCall) {
              return rCall();
            });
          }

          if (file.match(/\.css$/)) {
            console.log("CSS was changed, notifying websocket.");

            _this.notifyFrontend(file);
          }
        };
      }; // On any file change event
      // You could customise this to only run on new/save/delete etc
      // This will also pass the file modified into the callback
      // however for this example we aren't using that information


      watcher.on("change", handler("Change"));
      watcher.on("unlink", handler("Deletion"));
    });
    this.initialiseWsMessaging();
  }
};