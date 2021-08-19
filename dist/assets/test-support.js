

(function() {
/*!
 * @overview  Ember - JavaScript Application Framework
 * @copyright Copyright 2011-2020 Tilde Inc. and contributors
 *            Portions Copyright 2006-2011 Strobe Inc.
 *            Portions Copyright 2008-2011 Apple Inc. All rights reserved.
 * @license   Licensed under MIT license
 *            See https://raw.github.com/emberjs/ember.js/master/LICENSE
 * @version   3.24.1
 */
/*globals process */
var define, require, Ember; // Used in @ember/-internals/environment/lib/global.js


mainContext = this; // eslint-disable-line no-undef

(function () {
  var registry;
  var seen;

  function missingModule(name, referrerName) {
    if (referrerName) {
      throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
    } else {
      throw new Error('Could not find module ' + name);
    }
  }

  function internalRequire(_name, referrerName) {
    var name = _name;
    var mod = registry[name];

    if (!mod) {
      name = name + '/index';
      mod = registry[name];
    }

    var exports = seen[name];

    if (exports !== undefined) {
      return exports;
    }

    exports = seen[name] = {};

    if (!mod) {
      missingModule(_name, referrerName);
    }

    var deps = mod.deps;
    var callback = mod.callback;
    var reified = new Array(deps.length);

    for (var i = 0; i < deps.length; i++) {
      if (deps[i] === 'exports') {
        reified[i] = exports;
      } else if (deps[i] === 'require') {
        reified[i] = require;
      } else {
        reified[i] = internalRequire(deps[i], name);
      }
    }

    callback.apply(this, reified);
    return exports;
  }

  var isNode = typeof window === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  if (!isNode) {
    Ember = this.Ember = this.Ember || {};
  }

  if (typeof Ember === 'undefined') {
    Ember = {};
  }

  if (typeof Ember.__loader === 'undefined') {
    registry = Object.create(null);
    seen = Object.create(null);

    define = function (name, deps, callback) {
      var value = {};

      if (!callback) {
        value.deps = [];
        value.callback = deps;
      } else {
        value.deps = deps;
        value.callback = callback;
      }

      registry[name] = value;
    };

    require = function (name) {
      return internalRequire(name, null);
    }; // setup `require` module


    require['default'] = require;

    require.has = function registryHas(moduleName) {
      return Boolean(registry[moduleName]) || Boolean(registry[moduleName + '/index']);
    };

    require._eak_seen = registry;
    Ember.__loader = {
      define: define,
      require: require,
      registry: registry
    };
  } else {
    define = Ember.__loader.define;
    require = Ember.__loader.require;
  }
})();
define("@ember/debug/index", ["exports", "@ember/-internals/browser-environment", "@ember/error", "@ember/debug/lib/deprecate", "@ember/debug/lib/testing", "@ember/debug/lib/warn", "@ember/debug/lib/capture-render-tree"], function (_exports, _browserEnvironment, _error, _deprecate2, _testing, _warn2, _captureRenderTree) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "registerDeprecationHandler", {
    enumerable: true,
    get: function () {
      return _deprecate2.registerHandler;
    }
  });
  Object.defineProperty(_exports, "isTesting", {
    enumerable: true,
    get: function () {
      return _testing.isTesting;
    }
  });
  Object.defineProperty(_exports, "setTesting", {
    enumerable: true,
    get: function () {
      return _testing.setTesting;
    }
  });
  Object.defineProperty(_exports, "registerWarnHandler", {
    enumerable: true,
    get: function () {
      return _warn2.registerHandler;
    }
  });
  Object.defineProperty(_exports, "captureRenderTree", {
    enumerable: true,
    get: function () {
      return _captureRenderTree.default;
    }
  });
  _exports._warnIfUsingStrippedFeatureFlags = _exports.getDebugFunction = _exports.setDebugFunction = _exports.deprecateFunc = _exports.runInDebug = _exports.debugFreeze = _exports.debugSeal = _exports.deprecate = _exports.debug = _exports.warn = _exports.info = _exports.assert = void 0;

  // These are the default production build versions:
  var noop = () => {};

  var assert = noop;
  _exports.assert = assert;
  var info = noop;
  _exports.info = info;
  var warn = noop;
  _exports.warn = warn;
  var debug = noop;
  _exports.debug = debug;
  var deprecate = noop;
  _exports.deprecate = deprecate;
  var debugSeal = noop;
  _exports.debugSeal = debugSeal;
  var debugFreeze = noop;
  _exports.debugFreeze = debugFreeze;
  var runInDebug = noop;
  _exports.runInDebug = runInDebug;
  var setDebugFunction = noop;
  _exports.setDebugFunction = setDebugFunction;
  var getDebugFunction = noop;
  _exports.getDebugFunction = getDebugFunction;

  var deprecateFunc = function () {
    return arguments[arguments.length - 1];
  };

  _exports.deprecateFunc = deprecateFunc;

  if (true
  /* DEBUG */
  ) {
    _exports.setDebugFunction = setDebugFunction = function (type, callback) {
      switch (type) {
        case 'assert':
          return _exports.assert = assert = callback;

        case 'info':
          return _exports.info = info = callback;

        case 'warn':
          return _exports.warn = warn = callback;

        case 'debug':
          return _exports.debug = debug = callback;

        case 'deprecate':
          return _exports.deprecate = deprecate = callback;

        case 'debugSeal':
          return _exports.debugSeal = debugSeal = callback;

        case 'debugFreeze':
          return _exports.debugFreeze = debugFreeze = callback;

        case 'runInDebug':
          return _exports.runInDebug = runInDebug = callback;

        case 'deprecateFunc':
          return _exports.deprecateFunc = deprecateFunc = callback;
      }
    };

    _exports.getDebugFunction = getDebugFunction = function (type) {
      switch (type) {
        case 'assert':
          return assert;

        case 'info':
          return info;

        case 'warn':
          return warn;

        case 'debug':
          return debug;

        case 'deprecate':
          return deprecate;

        case 'debugSeal':
          return debugSeal;

        case 'debugFreeze':
          return debugFreeze;

        case 'runInDebug':
          return runInDebug;

        case 'deprecateFunc':
          return deprecateFunc;
      }
    };
  }
  /**
  @module @ember/debug
  */


  if (true
  /* DEBUG */
  ) {
    /**
      Verify that a certain expectation is met, or throw a exception otherwise.
         This is useful for communicating assumptions in the code to other human
      readers as well as catching bugs that accidentally violates these
      expectations.
         Assertions are removed from production builds, so they can be freely added
      for documentation and debugging purposes without worries of incuring any
      performance penalty. However, because of that, they should not be used for
      checks that could reasonably fail during normal usage. Furthermore, care
      should be taken to avoid accidentally relying on side-effects produced from
      evaluating the condition itself, since the code will not run in production.
         ```javascript
      import { assert } from '@ember/debug';
         // Test for truthiness
      assert('Must pass a string', typeof str === 'string');
         // Fail unconditionally
      assert('This code path should never be run');
      ```
         @method assert
      @static
      @for @ember/debug
      @param {String} description Describes the expectation. This will become the
        text of the Error thrown if the assertion fails.
      @param {any} condition Must be truthy for the assertion to pass. If
        falsy, an exception will be thrown.
      @public
      @since 1.0.0
    */
    setDebugFunction('assert', function assert(desc, test) {
      if (!test) {
        throw new _error.default(`Assertion Failed: ${desc}`);
      }
    });
    /**
      Display a debug notice.
         Calls to this function are not invoked in production builds.
         ```javascript
      import { debug } from '@ember/debug';
         debug('I\'m a debug notice!');
      ```
         @method debug
      @for @ember/debug
      @static
      @param {String} message A debug message to display.
      @public
    */

    setDebugFunction('debug', function debug(message) {
      /* eslint-disable no-console */
      if (console.debug) {
        console.debug(`DEBUG: ${message}`);
      } else {
        console.log(`DEBUG: ${message}`);
      }
      /* eslint-ensable no-console */

    });
    /**
      Display an info notice.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         @method info
      @private
    */

    setDebugFunction('info', function info() {
      console.info(...arguments);
      /* eslint-disable-line no-console */
    });
    /**
     @module @ember/debug
     @public
    */

    /**
      Alias an old, deprecated method with its new counterpart.
         Display a deprecation warning with the provided message and a stack trace
      (Chrome and Firefox only) when the assigned method is called.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         ```javascript
      import { deprecateFunc } from '@ember/debug';
         Ember.oldMethod = deprecateFunc('Please use the new, updated method', options, Ember.newMethod);
      ```
         @method deprecateFunc
      @static
      @for @ember/debug
      @param {String} message A description of the deprecation.
      @param {Object} [options] The options object for `deprecate`.
      @param {Function} func The new function called to replace its deprecated counterpart.
      @return {Function} A new function that wraps the original function with a deprecation warning
      @private
    */

    setDebugFunction('deprecateFunc', function deprecateFunc(...args) {
      if (args.length === 3) {
        var [message, options, func] = args;
        return function (...args) {
          deprecate(message, false, options);
          return func.apply(this, args);
        };
      } else {
        var [_message, _func] = args;
        return function () {
          deprecate(_message);
          return _func.apply(this, arguments);
        };
      }
    });
    /**
     @module @ember/debug
     @public
    */

    /**
      Run a function meant for debugging.
         Calls to this function are removed from production builds, so they can be
      freely added for documentation and debugging purposes without worries of
      incuring any performance penalty.
         ```javascript
      import Component from '@ember/component';
      import { runInDebug } from '@ember/debug';
         runInDebug(() => {
        Component.reopen({
          didInsertElement() {
            console.log("I'm happy");
          }
        });
      });
      ```
         @method runInDebug
      @for @ember/debug
      @static
      @param {Function} func The function to be executed.
      @since 1.5.0
      @public
    */

    setDebugFunction('runInDebug', function runInDebug(func) {
      func();
    });
    setDebugFunction('debugSeal', function debugSeal(obj) {
      Object.seal(obj);
    });
    setDebugFunction('debugFreeze', function debugFreeze(obj) {
      // re-freezing an already frozen object introduces a significant
      // performance penalty on Chrome (tested through 59).
      //
      // See: https://bugs.chromium.org/p/v8/issues/detail?id=6450
      if (!Object.isFrozen(obj)) {
        Object.freeze(obj);
      }
    });
    setDebugFunction('deprecate', _deprecate2.default);
    setDebugFunction('warn', _warn2.default);
  }

  var _warnIfUsingStrippedFeatureFlags;

  _exports._warnIfUsingStrippedFeatureFlags = _warnIfUsingStrippedFeatureFlags;

  if (true
  /* DEBUG */
  && !(0, _testing.isTesting)()) {
    if (typeof window !== 'undefined' && (_browserEnvironment.isFirefox || _browserEnvironment.isChrome) && window.addEventListener) {
      window.addEventListener('load', () => {
        if (document.documentElement && document.documentElement.dataset && !document.documentElement.dataset.emberExtension) {
          var downloadURL;

          if (_browserEnvironment.isChrome) {
            downloadURL = 'https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi';
          } else if (_browserEnvironment.isFirefox) {
            downloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/';
          }

          debug(`For more advanced debugging, install the Ember Inspector from ${downloadURL}`);
        }
      }, false);
    }
  }
});
define("@ember/debug/lib/capture-render-tree", ["exports", "@glimmer/util"], function (_exports, _util) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = captureRenderTree;

  /**
    @module @ember/debug
  */

  /**
    Ember Inspector calls this function to capture the current render tree.
  
    In production mode, this requires turning on `ENV._DEBUG_RENDER_TREE`
    before loading Ember.
  
    @private
    @static
    @method captureRenderTree
    @for @ember/debug
    @param app {ApplicationInstance} An `ApplicationInstance`.
    @since 3.14.0
  */
  function captureRenderTree(app) {
    var env = (0, _util.expect)(app.lookup('-environment:main'), 'BUG: owner is missing -environment:main');
    var rendererType = env.isInteractive ? 'renderer:-dom' : 'renderer:-inert';
    var renderer = (0, _util.expect)(app.lookup(rendererType), `BUG: owner is missing ${rendererType}`);
    return renderer.debugRenderTree.capture();
  }
});
define("@ember/debug/lib/deprecate", ["exports", "@ember/-internals/environment", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _environment, _index, _handlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SINCE_MISSING_DEPRECATIONS = _exports.FOR_MISSING_DEPRECATIONS = _exports.missingOptionsSinceDeprecation = _exports.missingOptionsForDeprecation = _exports.missingOptionsUntilDeprecation = _exports.missingOptionsIdDeprecation = _exports.missingOptionsDeprecation = _exports.registerHandler = _exports.default = void 0;

  /**
   @module @ember/debug
   @public
  */

  /**
    Allows for runtime registration of handler functions that override the default deprecation behavior.
    Deprecations are invoked by calls to [@ember/debug/deprecate](/ember/release/classes/@ember%2Fdebug/methods/deprecate?anchor=deprecate).
    The following example demonstrates its usage by registering a handler that throws an error if the
    message contains the word "should", otherwise defers to the default handler.
  
    ```javascript
    import { registerDeprecationHandler } from '@ember/debug';
  
    registerDeprecationHandler((message, options, next) => {
      if (message.indexOf('should') !== -1) {
        throw new Error(`Deprecation message with should: ${message}`);
      } else {
        // defer to whatever handler was registered before this one
        next(message, options);
      }
    });
    ```
  
    The handler function takes the following arguments:
  
    <ul>
      <li> <code>message</code> - The message received from the deprecation call.</li>
      <li> <code>options</code> - An object passed in with the deprecation call containing additional information including:</li>
        <ul>
          <li> <code>id</code> - An id of the deprecation in the form of <code>package-name.specific-deprecation</code>.</li>
          <li> <code>until</code> - The Ember version number the feature and deprecation will be removed in.</li>
        </ul>
      <li> <code>next</code> - A function that calls into the previously registered handler.</li>
    </ul>
  
    @public
    @static
    @method registerDeprecationHandler
    @for @ember/debug
    @param handler {Function} A function to handle deprecation calls.
    @since 2.1.0
  */
  var registerHandler = () => {};

  _exports.registerHandler = registerHandler;
  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
  var missingOptionsUntilDeprecation;
  _exports.missingOptionsUntilDeprecation = missingOptionsUntilDeprecation;

  var missingOptionsForDeprecation = () => '';

  _exports.missingOptionsForDeprecation = missingOptionsForDeprecation;

  var missingOptionsSinceDeprecation = () => '';

  _exports.missingOptionsSinceDeprecation = missingOptionsSinceDeprecation;

  var deprecate = () => {};

  var FOR_MISSING_DEPRECATIONS = new Set();
  _exports.FOR_MISSING_DEPRECATIONS = FOR_MISSING_DEPRECATIONS;
  var SINCE_MISSING_DEPRECATIONS = new Set();
  _exports.SINCE_MISSING_DEPRECATIONS = SINCE_MISSING_DEPRECATIONS;

  if (true
  /* DEBUG */
  ) {
    _exports.registerHandler = registerHandler = function registerHandler(handler) {
      (0, _handlers.registerHandler)('deprecate', handler);
    };

    var formatMessage = function formatMessage(_message, options) {
      var message = _message;

      if (options && options.id) {
        message = message + ` [deprecation id: ${options.id}]`;
      }

      if (options && options.url) {
        message += ` See ${options.url} for more details.`;
      }

      return message;
    };

    registerHandler(function logDeprecationToConsole(message, options) {
      var updatedMessage = formatMessage(message, options);
      console.warn(`DEPRECATION: ${updatedMessage}`); // eslint-disable-line no-console
    });
    var captureErrorForStack;

    if (new Error().stack) {
      captureErrorForStack = () => new Error();
    } else {
      captureErrorForStack = () => {
        try {
          __fail__.fail();
        } catch (e) {
          return e;
        }
      };
    }

    registerHandler(function logDeprecationStackTrace(message, options, next) {
      if (_environment.ENV.LOG_STACKTRACE_ON_DEPRECATION) {
        var stackStr = '';
        var error = captureErrorForStack();
        var stack;

        if (error.stack) {
          if (error['arguments']) {
            // Chrome
            stack = error.stack.replace(/^\s+at\s+/gm, '').replace(/^([^(]+?)([\n$])/gm, '{anonymous}($1)$2').replace(/^Object.<anonymous>\s*\(([^)]+)\)/gm, '{anonymous}($1)').split('\n');
            stack.shift();
          } else {
            // Firefox
            stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
          }

          stackStr = `\n    ${stack.slice(2).join('\n    ')}`;
        }

        var updatedMessage = formatMessage(message, options);
        console.warn(`DEPRECATION: ${updatedMessage}${stackStr}`); // eslint-disable-line no-console
      } else {
        next(message, options);
      }
    });
    registerHandler(function raiseOnDeprecation(message, options, next) {
      if (_environment.ENV.RAISE_ON_DEPRECATION) {
        var updatedMessage = formatMessage(message);
        throw new Error(updatedMessage);
      } else {
        next(message, options);
      }
    });
    _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `deprecate` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include `id` and `until` properties.';
    _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `deprecate` you must provide `id` in options.';
    _exports.missingOptionsUntilDeprecation = missingOptionsUntilDeprecation = 'When calling `deprecate` you must provide `until` in options.';

    _exports.missingOptionsForDeprecation = missingOptionsForDeprecation = id => {
      return `When calling \`deprecate\` you must provide \`for\` in options. Missing options.for in "${id}" deprecation`;
    };

    _exports.missingOptionsSinceDeprecation = missingOptionsSinceDeprecation = id => {
      return `When calling \`deprecate\` you must provide \`since\` in options. Missing options.since in "${id}" deprecation`;
    };
    /**
     @module @ember/debug
     @public
     */

    /**
      Display a deprecation warning with the provided message and a stack trace
      (Chrome and Firefox only).
         * In a production build, this method is defined as an empty function (NOP).
      Uses of this method in Ember itself are stripped from the ember.prod.js build.
         @method deprecate
      @for @ember/debug
      @param {String} message A description of the deprecation.
      @param {Boolean} test A boolean. If falsy, the deprecation will be displayed.
      @param {Object} options
      @param {String} options.id A unique id for this deprecation. The id can be
        used by Ember debugging tools to change the behavior (raise, log or silence)
        for that specific deprecation. The id should be namespaced by dots, e.g.
        "view.helper.select".
      @param {string} options.until The version of Ember when this deprecation
        warning will be removed.
      @param {String} options.for A namespace for the deprecation, usually the package name
      @param {Object} options.since Describes when the deprecation became available and enabled.
      @param {String} [options.url] An optional url to the transition guide on the
            emberjs.com website.
      @static
      @public
      @since 1.0.0
    */


    deprecate = function deprecate(message, test, options) {
      (0, _index.assert)(missingOptionsDeprecation, Boolean(options && (options.id || options.until)));
      (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options.id));
      (0, _index.assert)(missingOptionsUntilDeprecation, Boolean(options.until));

      if (!options.for && !FOR_MISSING_DEPRECATIONS.has(options.id)) {
        FOR_MISSING_DEPRECATIONS.add(options.id);
        deprecate(missingOptionsForDeprecation(options.id), Boolean(options.for), {
          id: 'ember-source.deprecation-without-for',
          until: '4.0.0',
          for: 'ember-source',
          since: {
            available: '3.24.0'
          }
        });
      }

      if (!options.since && !SINCE_MISSING_DEPRECATIONS.has(options.id)) {
        SINCE_MISSING_DEPRECATIONS.add(options.id);
        deprecate(missingOptionsSinceDeprecation(options.id), Boolean(options.since), {
          id: 'ember-source.deprecation-without-since',
          until: '4.0.0',
          for: 'ember-source',
          since: {
            available: '3.24.0'
          }
        });
      }

      (0, _handlers.invoke)('deprecate', message, test, options);
    };
  }

  var _default = deprecate;
  _exports.default = _default;
});
define("@ember/debug/lib/handlers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.invoke = _exports.registerHandler = _exports.HANDLERS = void 0;
  var HANDLERS = {};
  _exports.HANDLERS = HANDLERS;

  var registerHandler = () => {};

  _exports.registerHandler = registerHandler;

  var invoke = () => {};

  _exports.invoke = invoke;

  if (true
  /* DEBUG */
  ) {
    _exports.registerHandler = registerHandler = function registerHandler(type, callback) {
      var nextHandler = HANDLERS[type] || (() => {});

      HANDLERS[type] = (message, options) => {
        callback(message, options, nextHandler);
      };
    };

    _exports.invoke = invoke = function invoke(type, message, test, options) {
      if (test) {
        return;
      }

      var handlerForType = HANDLERS[type];

      if (handlerForType) {
        handlerForType(message, options);
      }
    };
  }
});
define("@ember/debug/lib/testing", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isTesting = isTesting;
  _exports.setTesting = setTesting;
  var testing = false;

  function isTesting() {
    return testing;
  }

  function setTesting(value) {
    testing = Boolean(value);
  }
});
define("@ember/debug/lib/warn", ["exports", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _index, _handlers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.missingOptionsDeprecation = _exports.missingOptionsIdDeprecation = _exports.registerHandler = _exports.default = void 0;

  var registerHandler = () => {};

  _exports.registerHandler = registerHandler;

  var warn = () => {};

  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  /**
  @module @ember/debug
  */

  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;

  if (true
  /* DEBUG */
  ) {
    /**
      Allows for runtime registration of handler functions that override the default warning behavior.
      Warnings are invoked by calls made to [@ember/debug/warn](/ember/release/classes/@ember%2Fdebug/methods/warn?anchor=warn).
      The following example demonstrates its usage by registering a handler that does nothing overriding Ember's
      default warning behavior.
         ```javascript
      import { registerWarnHandler } from '@ember/debug';
         // next is not called, so no warnings get the default behavior
      registerWarnHandler(() => {});
      ```
         The handler function takes the following arguments:
         <ul>
        <li> <code>message</code> - The message received from the warn call. </li>
        <li> <code>options</code> - An object passed in with the warn call containing additional information including:</li>
          <ul>
            <li> <code>id</code> - An id of the warning in the form of <code>package-name.specific-warning</code>.</li>
          </ul>
        <li> <code>next</code> - A function that calls into the previously registered handler.</li>
      </ul>
         @public
      @static
      @method registerWarnHandler
      @for @ember/debug
      @param handler {Function} A function to handle warnings.
      @since 2.1.0
    */
    _exports.registerHandler = registerHandler = function registerHandler(handler) {
      (0, _handlers.registerHandler)('warn', handler);
    };

    registerHandler(function logWarning(message) {
      /* eslint-disable no-console */
      console.warn(`WARNING: ${message}`);
      /* eslint-enable no-console */
    });
    _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `warn` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include an `id` property.';
    _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `warn` you must provide `id` in options.';
    /**
      Display a warning with the provided message.
         * In a production build, this method is defined as an empty function (NOP).
      Uses of this method in Ember itself are stripped from the ember.prod.js build.
         ```javascript
      import { warn } from '@ember/debug';
      import tomsterCount from './tomster-counter'; // a module in my project
         // Log a warning if we have more than 3 tomsters
      warn('Too many tomsters!', tomsterCount <= 3, {
        id: 'ember-debug.too-many-tomsters'
      });
      ```
         @method warn
      @for @ember/debug
      @static
      @param {String} message A warning to display.
      @param {Boolean} test An optional boolean. If falsy, the warning
        will be displayed.
      @param {Object} options An object that can be used to pass a unique
        `id` for this warning.  The `id` can be used by Ember debugging tools
        to change the behavior (raise, log, or silence) for that specific warning.
        The `id` should be namespaced by dots, e.g. "ember-debug.feature-flag-with-features-stripped"
      @public
      @since 1.0.0
    */

    warn = function warn(message, test, options) {
      if (arguments.length === 2 && typeof test === 'object') {
        options = test;
        test = false;
      }

      (0, _index.assert)(missingOptionsDeprecation, Boolean(options));
      (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options && options.id));
      (0, _handlers.invoke)('warn', message, test, options);
    };
  }

  var _default = warn;
  _exports.default = _default;
});
define("ember-testing/index", ["exports", "ember-testing/lib/test", "ember-testing/lib/adapters/adapter", "ember-testing/lib/setup_for_testing", "ember-testing/lib/adapters/qunit", "ember-testing/lib/support", "ember-testing/lib/ext/application", "ember-testing/lib/ext/rsvp", "ember-testing/lib/helpers", "ember-testing/lib/initializers"], function (_exports, _test, _adapter, _setup_for_testing, _qunit, _support, _application, _rsvp, _helpers, _initializers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "Test", {
    enumerable: true,
    get: function () {
      return _test.default;
    }
  });
  Object.defineProperty(_exports, "Adapter", {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
  Object.defineProperty(_exports, "setupForTesting", {
    enumerable: true,
    get: function () {
      return _setup_for_testing.default;
    }
  });
  Object.defineProperty(_exports, "QUnitAdapter", {
    enumerable: true,
    get: function () {
      return _qunit.default;
    }
  });
});
define("ember-testing/lib/adapters/adapter", ["exports", "@ember/-internals/runtime"], function (_exports, _runtime) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function K() {
    return this;
  }
  /**
   @module @ember/test
  */

  /**
    The primary purpose of this class is to create hooks that can be implemented
    by an adapter for various test frameworks.
  
    @class TestAdapter
    @public
  */


  var _default = _runtime.Object.extend({
    /**
      This callback will be called whenever an async operation is about to start.
       Override this to call your framework's methods that handle async
      operations.
       @public
      @method asyncStart
    */
    asyncStart: K,

    /**
      This callback will be called whenever an async operation has completed.
       @public
      @method asyncEnd
    */
    asyncEnd: K,

    /**
      Override this method with your testing framework's false assertion.
      This function is called whenever an exception occurs causing the testing
      promise to fail.
       QUnit example:
       ```javascript
        exception: function(error) {
          ok(false, error);
        };
      ```
       @public
      @method exception
      @param {String} error The exception to be raised.
    */
    exception(error) {
      throw error;
    }

  });

  _exports.default = _default;
});
define("ember-testing/lib/adapters/qunit", ["exports", "@ember/-internals/utils", "ember-testing/lib/adapters/adapter"], function (_exports, _utils, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /* globals QUnit */

  /**
     @module ember
  */

  /**
    This class implements the methods defined by TestAdapter for the
    QUnit testing framework.
  
    @class QUnitAdapter
    @namespace Ember.Test
    @extends TestAdapter
    @public
  */
  var _default = _adapter.default.extend({
    init() {
      this.doneCallbacks = [];
    },

    asyncStart() {
      if (typeof QUnit.stop === 'function') {
        // very old QUnit version
        QUnit.stop();
      } else {
        this.doneCallbacks.push(QUnit.config.current ? QUnit.config.current.assert.async() : null);
      }
    },

    asyncEnd() {
      // checking for QUnit.stop here (even though we _need_ QUnit.start) because
      // QUnit.start() still exists in QUnit 2.x (it just throws an error when calling
      // inside a test context)
      if (typeof QUnit.stop === 'function') {
        QUnit.start();
      } else {
        var done = this.doneCallbacks.pop(); // This can be null if asyncStart() was called outside of a test

        if (done) {
          done();
        }
      }
    },

    exception(error) {
      QUnit.config.current.assert.ok(false, (0, _utils.inspect)(error));
    }

  });

  _exports.default = _default;
});
define("ember-testing/lib/events", ["exports", "@ember/runloop", "@ember/polyfills", "ember-testing/lib/helpers/-is-form-control"], function (_exports, _runloop, _polyfills, _isFormControl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.focus = focus;
  _exports.fireEvent = fireEvent;
  var DEFAULT_EVENT_OPTIONS = {
    canBubble: true,
    cancelable: true
  };
  var KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];
  var MOUSE_EVENT_TYPES = ['click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover'];

  function focus(el) {
    if (!el) {
      return;
    }

    if (el.isContentEditable || (0, _isFormControl.default)(el)) {
      var type = el.getAttribute('type');

      if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
        (0, _runloop.run)(null, function () {
          var browserIsNotFocused = document.hasFocus && !document.hasFocus(); // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event

          el.focus(); // Firefox does not trigger the `focusin` event if the window
          // does not have focus. If the document does not have focus then
          // fire `focusin` event as well.

          if (browserIsNotFocused) {
            // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
            fireEvent(el, 'focus', {
              bubbles: false
            });
            fireEvent(el, 'focusin');
          }
        });
      }
    }
  }

  function fireEvent(element, type, options = {}) {
    if (!element) {
      return;
    }

    var event;

    if (KEYBOARD_EVENT_TYPES.indexOf(type) > -1) {
      event = buildKeyboardEvent(type, options);
    } else if (MOUSE_EVENT_TYPES.indexOf(type) > -1) {
      var rect = element.getBoundingClientRect();
      var x = rect.left + 1;
      var y = rect.top + 1;
      var simulatedCoordinates = {
        screenX: x + 5,
        screenY: y + 95,
        clientX: x,
        clientY: y
      };
      event = buildMouseEvent(type, (0, _polyfills.assign)(simulatedCoordinates, options));
    } else {
      event = buildBasicEvent(type, options);
    }

    element.dispatchEvent(event);
  }

  function buildBasicEvent(type, options = {}) {
    var event = document.createEvent('Events'); // Event.bubbles is read only

    var bubbles = options.bubbles !== undefined ? options.bubbles : true;
    var cancelable = options.cancelable !== undefined ? options.cancelable : true;
    delete options.bubbles;
    delete options.cancelable;
    event.initEvent(type, bubbles, cancelable);
    (0, _polyfills.assign)(event, options);
    return event;
  }

  function buildMouseEvent(type, options = {}) {
    var event;

    try {
      event = document.createEvent('MouseEvents');
      var eventOpts = (0, _polyfills.assign)({}, DEFAULT_EVENT_OPTIONS, options);
      event.initMouseEvent(type, eventOpts.canBubble, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
    } catch (e) {
      event = buildBasicEvent(type, options);
    }

    return event;
  }

  function buildKeyboardEvent(type, options = {}) {
    var event;

    try {
      event = document.createEvent('KeyEvents');
      var eventOpts = (0, _polyfills.assign)({}, DEFAULT_EVENT_OPTIONS, options);
      event.initKeyEvent(type, eventOpts.canBubble, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
    } catch (e) {
      event = buildBasicEvent(type, options);
    }

    return event;
  }
});
define("ember-testing/lib/ext/application", ["@ember/application", "ember-testing/lib/setup_for_testing", "ember-testing/lib/test/helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/run", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/adapter"], function (_application, _setup_for_testing, _helpers, _promise, _run, _on_inject_helpers, _adapter) {
  "use strict";

  _application.default.reopen({
    /**
     This property contains the testing helpers for the current application. These
     are created once you call `injectTestHelpers` on your `Application`
     instance. The included helpers are also available on the `window` object by
     default, but can be used from this object on the individual application also.
       @property testHelpers
      @type {Object}
      @default {}
      @public
    */
    testHelpers: {},

    /**
     This property will contain the original methods that were registered
     on the `helperContainer` before `injectTestHelpers` is called.
      When `removeTestHelpers` is called, these methods are restored to the
     `helperContainer`.
       @property originalMethods
      @type {Object}
      @default {}
      @private
      @since 1.3.0
    */
    originalMethods: {},

    /**
    This property indicates whether or not this application is currently in
    testing mode. This is set when `setupForTesting` is called on the current
    application.
     @property testing
    @type {Boolean}
    @default false
    @since 1.3.0
    @public
    */
    testing: false,

    /**
      This hook defers the readiness of the application, so that you can start
      the app when your tests are ready to run. It also sets the router's
      location to 'none', so that the window's location will not be modified
      (preventing both accidental leaking of state between tests and interference
      with your testing framework). `setupForTesting` should only be called after
      setting a custom `router` class (for example `App.Router = Router.extend(`).
       Example:
       ```
      App.setupForTesting();
      ```
       @method setupForTesting
      @public
    */
    setupForTesting() {
      (0, _setup_for_testing.default)();
      this.testing = true;
      this.resolveRegistration('router:main').reopen({
        location: 'none'
      });
    },

    /**
      This will be used as the container to inject the test helpers into. By
      default the helpers are injected into `window`.
       @property helperContainer
      @type {Object} The object to be used for test helpers.
      @default window
      @since 1.2.0
      @private
    */
    helperContainer: null,

    /**
      This injects the test helpers into the `helperContainer` object. If an object is provided
      it will be used as the helperContainer. If `helperContainer` is not set it will default
      to `window`. If a function of the same name has already been defined it will be cached
      (so that it can be reset if the helper is removed with `unregisterHelper` or
      `removeTestHelpers`).
       Any callbacks registered with `onInjectHelpers` will be called once the
      helpers have been injected.
       Example:
      ```
      App.injectTestHelpers();
      ```
       @method injectTestHelpers
      @public
    */
    injectTestHelpers(helperContainer) {
      if (helperContainer) {
        this.helperContainer = helperContainer;
      } else {
        this.helperContainer = window;
      }

      this.reopen({
        willDestroy() {
          this._super(...arguments);

          this.removeTestHelpers();
        }

      });
      this.testHelpers = {};

      for (var name in _helpers.helpers) {
        this.originalMethods[name] = this.helperContainer[name];
        this.testHelpers[name] = this.helperContainer[name] = helper(this, name);
        protoWrap(_promise.default.prototype, name, helper(this, name), _helpers.helpers[name].meta.wait);
      }

      (0, _on_inject_helpers.invokeInjectHelpersCallbacks)(this);
    },

    /**
      This removes all helpers that have been registered, and resets and functions
      that were overridden by the helpers.
       Example:
       ```javascript
      App.removeTestHelpers();
      ```
       @public
      @method removeTestHelpers
    */
    removeTestHelpers() {
      if (!this.helperContainer) {
        return;
      }

      for (var name in _helpers.helpers) {
        this.helperContainer[name] = this.originalMethods[name];
        delete _promise.default.prototype[name];
        delete this.testHelpers[name];
        delete this.originalMethods[name];
      }
    }

  }); // This method is no longer needed
  // But still here for backwards compatibility
  // of helper chaining


  function protoWrap(proto, name, callback, isAsync) {
    proto[name] = function (...args) {
      if (isAsync) {
        return callback.apply(this, args);
      } else {
        return this.then(function () {
          return callback.apply(this, args);
        });
      }
    };
  }

  function helper(app, name) {
    var fn = _helpers.helpers[name].method;
    var meta = _helpers.helpers[name].meta;

    if (!meta.wait) {
      return (...args) => fn.apply(app, [app, ...args]);
    }

    return (...args) => {
      var lastPromise = (0, _run.default)(() => (0, _promise.resolve)((0, _promise.getLastPromise)())); // wait for last helper's promise to resolve and then
      // execute. To be safe, we need to tell the adapter we're going
      // asynchronous here, because fn may not be invoked before we
      // return.

      (0, _adapter.asyncStart)();
      return lastPromise.then(() => fn.apply(app, [app, ...args])).finally(_adapter.asyncEnd);
    };
  }
});
define("ember-testing/lib/ext/rsvp", ["exports", "@ember/-internals/runtime", "@ember/runloop", "@ember/debug", "ember-testing/lib/test/adapter"], function (_exports, _runtime, _runloop, _debug, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  _runtime.RSVP.configure('async', function (callback, promise) {
    // if schedule will cause autorun, we need to inform adapter
    if ((0, _debug.isTesting)() && !_runloop.backburner.currentInstance) {
      (0, _adapter.asyncStart)();

      _runloop.backburner.schedule('actions', () => {
        (0, _adapter.asyncEnd)();
        callback(promise);
      });
    } else {
      _runloop.backburner.schedule('actions', () => callback(promise));
    }
  });

  var _default = _runtime.RSVP;
  _exports.default = _default;
});
define("ember-testing/lib/helpers", ["ember-testing/lib/test/helpers", "ember-testing/lib/helpers/and_then", "ember-testing/lib/helpers/click", "ember-testing/lib/helpers/current_path", "ember-testing/lib/helpers/current_route_name", "ember-testing/lib/helpers/current_url", "ember-testing/lib/helpers/fill_in", "ember-testing/lib/helpers/find", "ember-testing/lib/helpers/find_with_assert", "ember-testing/lib/helpers/key_event", "ember-testing/lib/helpers/pause_test", "ember-testing/lib/helpers/trigger_event", "ember-testing/lib/helpers/visit", "ember-testing/lib/helpers/wait"], function (_helpers, _and_then, _click, _current_path, _current_route_name, _current_url, _fill_in, _find, _find_with_assert, _key_event, _pause_test, _trigger_event, _visit, _wait) {
  "use strict";

  (0, _helpers.registerAsyncHelper)('visit', _visit.default);
  (0, _helpers.registerAsyncHelper)('click', _click.default);
  (0, _helpers.registerAsyncHelper)('keyEvent', _key_event.default);
  (0, _helpers.registerAsyncHelper)('fillIn', _fill_in.default);
  (0, _helpers.registerAsyncHelper)('wait', _wait.default);
  (0, _helpers.registerAsyncHelper)('andThen', _and_then.default);
  (0, _helpers.registerAsyncHelper)('pauseTest', _pause_test.pauseTest);
  (0, _helpers.registerAsyncHelper)('triggerEvent', _trigger_event.default);
  (0, _helpers.registerHelper)('find', _find.default);
  (0, _helpers.registerHelper)('findWithAssert', _find_with_assert.default);
  (0, _helpers.registerHelper)('currentRouteName', _current_route_name.default);
  (0, _helpers.registerHelper)('currentPath', _current_path.default);
  (0, _helpers.registerHelper)('currentURL', _current_url.default);
  (0, _helpers.registerHelper)('resumeTest', _pause_test.resumeTest);
});
define("ember-testing/lib/helpers/-is-form-control", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isFormControl;
  var FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is a form control, `false` otherwise
  */

  function isFormControl(element) {
    var {
      tagName,
      type
    } = element;

    if (type === 'hidden') {
      return false;
    }

    return FORM_CONTROL_TAGS.indexOf(tagName) > -1;
  }
});
define("ember-testing/lib/helpers/and_then", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = andThen;

  function andThen(app, callback) {
    return app.testHelpers.wait(callback(app));
  }
});
define("ember-testing/lib/helpers/click", ["exports", "ember-testing/lib/events"], function (_exports, _events) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = click;

  /**
  @module ember
  */

  /**
    Clicks an element and triggers any actions triggered by the element's `click`
    event.
  
    Example:
  
    ```javascript
    click('.some-jQuery-selector').then(function() {
      // assert something
    });
    ```
  
    @method click
    @param {String} selector jQuery selector for finding element on the DOM
    @param {Object} context A DOM Element, Document, or jQuery to use as context
    @return {RSVP.Promise<undefined>}
    @public
  */
  function click(app, selector, context) {
    var $el = app.testHelpers.findWithAssert(selector, context);
    var el = $el[0];
    (0, _events.fireEvent)(el, 'mousedown');
    (0, _events.focus)(el);
    (0, _events.fireEvent)(el, 'mouseup');
    (0, _events.fireEvent)(el, 'click');
    return app.testHelpers.wait();
  }
});
define("ember-testing/lib/helpers/current_path", ["exports", "@ember/-internals/metal"], function (_exports, _metal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentPath;

  /**
  @module ember
  */

  /**
    Returns the current path.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentPath(), 'some.path.index', "correct path was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentPath
  @return {Object} The currently active path.
  @since 1.5.0
  @public
  */
  function currentPath(app) {
    var routingService = app.__container__.lookup('service:-routing');

    return (0, _metal.get)(routingService, 'currentPath');
  }
});
define("ember-testing/lib/helpers/current_route_name", ["exports", "@ember/-internals/metal"], function (_exports, _metal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentRouteName;

  /**
  @module ember
  */

  /**
    Returns the currently active route name.
  
  Example:
  
  ```javascript
  function validateRouteName() {
    equal(currentRouteName(), 'some.path', "correct route was transitioned into.");
  }
  visit('/some/path').then(validateRouteName)
  ```
  
  @method currentRouteName
  @return {Object} The name of the currently active route.
  @since 1.5.0
  @public
  */
  function currentRouteName(app) {
    var routingService = app.__container__.lookup('service:-routing');

    return (0, _metal.get)(routingService, 'currentRouteName');
  }
});
define("ember-testing/lib/helpers/current_url", ["exports", "@ember/-internals/metal"], function (_exports, _metal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = currentURL;

  /**
  @module ember
  */

  /**
    Returns the current URL.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentURL(), '/some/path', "correct URL was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentURL
  @return {Object} The currently active URL.
  @since 1.5.0
  @public
  */
  function currentURL(app) {
    var router = app.__container__.lookup('router:main');

    return (0, _metal.get)(router, 'location').getURL();
  }
});
define("ember-testing/lib/helpers/fill_in", ["exports", "ember-testing/lib/events", "ember-testing/lib/helpers/-is-form-control"], function (_exports, _events, _isFormControl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = fillIn;

  /**
  @module ember
  */

  /**
    Fills in an input element with some text.
  
    Example:
  
    ```javascript
    fillIn('#email', 'you@example.com').then(function() {
      // assert something
    });
    ```
  
    @method fillIn
    @param {String} selector jQuery selector finding an input element on the DOM
    to fill text with
    @param {String} text text to place inside the input element
    @return {RSVP.Promise<undefined>}
    @public
  */
  function fillIn(app, selector, contextOrText, text) {
    var $el, el, context;

    if (text === undefined) {
      text = contextOrText;
    } else {
      context = contextOrText;
    }

    $el = app.testHelpers.findWithAssert(selector, context);
    el = $el[0];
    (0, _events.focus)(el);

    if ((0, _isFormControl.default)(el)) {
      el.value = text;
    } else {
      el.innerHTML = text;
    }

    (0, _events.fireEvent)(el, 'input');
    (0, _events.fireEvent)(el, 'change');
    return app.testHelpers.wait();
  }
});
define("ember-testing/lib/helpers/find", ["exports", "@ember/-internals/metal", "@ember/debug", "@ember/-internals/views"], function (_exports, _metal, _debug, _views) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = find;

  /**
  @module ember
  */

  /**
    Finds an element in the context of the app's container element. A simple alias
    for `app.$(selector)`.
  
    Example:
  
    ```javascript
    var $el = find('.my-selector');
    ```
  
    With the `context` param:
  
    ```javascript
    var $el = find('.my-selector', '.parent-element-class');
    ```
  
    @method find
    @param {String} selector jQuery selector for element lookup
    @param {String} [context] (optional) jQuery selector that will limit the selector
                              argument to find only within the context's children
    @return {Object} DOM element representing the results of the query
    @public
  */
  function find(app, selector, context) {
    if (_views.jQueryDisabled) {
      (true && !(false) && (0, _debug.assert)('If jQuery is disabled, please import and use helpers from @ember/test-helpers [https://github.com/emberjs/ember-test-helpers]. Note: `find` is not an available helper.'));
    }

    var $el;
    context = context || (0, _metal.get)(app, 'rootElement');
    $el = app.$(selector, context);
    return $el;
  }
});
define("ember-testing/lib/helpers/find_with_assert", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = findWithAssert;

  /**
  @module ember
  */

  /**
    Like `find`, but throws an error if the element selector returns no results.
  
    Example:
  
    ```javascript
    var $el = findWithAssert('.doesnt-exist'); // throws error
    ```
  
    With the `context` param:
  
    ```javascript
    var $el = findWithAssert('.selector-id', '.parent-element-class'); // assert will pass
    ```
  
    @method findWithAssert
    @param {String} selector jQuery selector string for finding an element within
    the DOM
    @param {String} [context] (optional) jQuery selector that will limit the
    selector argument to find only within the context's children
    @return {Object} jQuery object representing the results of the query
    @throws {Error} throws error if object returned has a length of 0
    @public
  */
  function findWithAssert(app, selector, context) {
    var $el = app.testHelpers.find(selector, context);

    if ($el.length === 0) {
      throw new Error('Element ' + selector + ' not found.');
    }

    return $el;
  }
});
define("ember-testing/lib/helpers/key_event", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = keyEvent;

  /**
  @module ember
  */

  /**
    Simulates a key event, e.g. `keypress`, `keydown`, `keyup` with the desired keyCode
    Example:
    ```javascript
    keyEvent('.some-jQuery-selector', 'keypress', 13).then(function() {
     // assert something
    });
    ```
    @method keyEvent
    @param {String} selector jQuery selector for finding element on the DOM
    @param {String} type the type of key event, e.g. `keypress`, `keydown`, `keyup`
    @param {Number} keyCode the keyCode of the simulated key event
    @return {RSVP.Promise<undefined>}
    @since 1.5.0
    @public
  */
  function keyEvent(app, selector, contextOrType, typeOrKeyCode, keyCode) {
    var context, type;

    if (keyCode === undefined) {
      context = null;
      keyCode = typeOrKeyCode;
      type = contextOrType;
    } else {
      context = contextOrType;
      type = typeOrKeyCode;
    }

    return app.testHelpers.triggerEvent(selector, context, type, {
      keyCode,
      which: keyCode
    });
  }
});
define("ember-testing/lib/helpers/pause_test", ["exports", "@ember/-internals/runtime", "@ember/debug"], function (_exports, _runtime, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.resumeTest = resumeTest;
  _exports.pauseTest = pauseTest;

  /**
  @module ember
  */
  var resume;
  /**
   Resumes a test paused by `pauseTest`.
  
   @method resumeTest
   @return {void}
   @public
  */

  function resumeTest() {
    (true && !(resume) && (0, _debug.assert)('Testing has not been paused. There is nothing to resume.', resume));
    resume();
    resume = undefined;
  }
  /**
   Pauses the current test - this is useful for debugging while testing or for test-driving.
   It allows you to inspect the state of your application at any point.
   Example (The test will pause before clicking the button):
  
   ```javascript
   visit('/')
   return pauseTest();
   click('.btn');
   ```
  
   You may want to turn off the timeout before pausing.
  
   qunit (timeout available to use as of 2.4.0):
  
   ```
   visit('/');
   assert.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
   mocha (timeout happens automatically as of ember-mocha v0.14.0):
  
   ```
   visit('/');
   this.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
  
   @since 1.9.0
   @method pauseTest
   @return {Object} A promise that will never resolve
   @public
  */


  function pauseTest() {
    (0, _debug.info)('Testing paused. Use `resumeTest()` to continue.');
    return new _runtime.RSVP.Promise(resolve => {
      resume = resolve;
    }, 'TestAdapter paused promise');
  }
});
define("ember-testing/lib/helpers/trigger_event", ["exports", "ember-testing/lib/events"], function (_exports, _events) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = triggerEvent;

  /**
  @module ember
  */

  /**
    Triggers the given DOM event on the element identified by the provided selector.
    Example:
    ```javascript
    triggerEvent('#some-elem-id', 'blur');
    ```
    This is actually used internally by the `keyEvent` helper like so:
    ```javascript
    triggerEvent('#some-elem-id', 'keypress', { keyCode: 13 });
    ```
   @method triggerEvent
   @param {String} selector jQuery selector for finding element on the DOM
   @param {String} [context] jQuery selector that will limit the selector
                             argument to find only within the context's children
   @param {String} type The event type to be triggered.
   @param {Object} [options] The options to be passed to jQuery.Event.
   @return {RSVP.Promise<undefined>}
   @since 1.5.0
   @public
  */
  function triggerEvent(app, selector, contextOrType, typeOrOptions, possibleOptions) {
    var arity = arguments.length;
    var context, type, options;

    if (arity === 3) {
      // context and options are optional, so this is
      // app, selector, type
      context = null;
      type = contextOrType;
      options = {};
    } else if (arity === 4) {
      // context and options are optional, so this is
      if (typeof typeOrOptions === 'object') {
        // either
        // app, selector, type, options
        context = null;
        type = contextOrType;
        options = typeOrOptions;
      } else {
        // or
        // app, selector, context, type
        context = contextOrType;
        type = typeOrOptions;
        options = {};
      }
    } else {
      context = contextOrType;
      type = typeOrOptions;
      options = possibleOptions;
    }

    var $el = app.testHelpers.findWithAssert(selector, context);
    var el = $el[0];
    (0, _events.fireEvent)(el, type, options);
    return app.testHelpers.wait();
  }
});
define("ember-testing/lib/helpers/visit", ["exports", "@ember/runloop"], function (_exports, _runloop) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = visit;

  /**
    Loads a route, sets up any controllers, and renders any templates associated
    with the route as though a real user had triggered the route change while
    using your app.
  
    Example:
  
    ```javascript
    visit('posts/index').then(function() {
      // assert something
    });
    ```
  
    @method visit
    @param {String} url the name of the route
    @return {RSVP.Promise<undefined>}
    @public
  */
  function visit(app, url) {
    var router = app.__container__.lookup('router:main');

    var shouldHandleURL = false;
    app.boot().then(() => {
      router.location.setURL(url);

      if (shouldHandleURL) {
        (0, _runloop.run)(app.__deprecatedInstance__, 'handleURL', url);
      }
    });

    if (app._readinessDeferrals > 0) {
      router.initialURL = url;
      (0, _runloop.run)(app, 'advanceReadiness');
      delete router.initialURL;
    } else {
      shouldHandleURL = true;
    }

    return app.testHelpers.wait();
  }
});
define("ember-testing/lib/helpers/wait", ["exports", "ember-testing/lib/test/waiters", "@ember/-internals/runtime", "@ember/runloop", "ember-testing/lib/test/pending_requests"], function (_exports, _waiters, _runtime, _runloop, _pending_requests) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = wait;

  /**
  @module ember
  */

  /**
    Causes the run loop to process any pending events. This is used to ensure that
    any async operations from other helpers (or your assertions) have been processed.
  
    This is most often used as the return value for the helper functions (see 'click',
    'fillIn','visit',etc). However, there is a method to register a test helper which
    utilizes this method without the need to actually call `wait()` in your helpers.
  
    The `wait` helper is built into `registerAsyncHelper` by default. You will not need
    to `return app.testHelpers.wait();` - the wait behavior is provided for you.
  
    Example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('loginUser', function(app, username, password) {
      visit('secured/path/here')
        .fillIn('#username', username)
        .fillIn('#password', password)
        .click('.submit');
    });
    ```
  
    @method wait
    @param {Object} value The value to be returned.
    @return {RSVP.Promise<any>} Promise that resolves to the passed value.
    @public
    @since 1.0.0
  */
  function wait(app, value) {
    return new _runtime.RSVP.Promise(function (resolve) {
      var router = app.__container__.lookup('router:main'); // Every 10ms, poll for the async thing to have finished


      var watcher = setInterval(() => {
        // 1. If the router is loading, keep polling
        var routerIsLoading = router._routerMicrolib && Boolean(router._routerMicrolib.activeTransition);

        if (routerIsLoading) {
          return;
        } // 2. If there are pending Ajax requests, keep polling


        if ((0, _pending_requests.pendingRequests)()) {
          return;
        } // 3. If there are scheduled timers or we are inside of a run loop, keep polling


        if ((0, _runloop.hasScheduledTimers)() || (0, _runloop.getCurrentRunLoop)()) {
          return;
        }

        if ((0, _waiters.checkWaiters)()) {
          return;
        } // Stop polling


        clearInterval(watcher); // Synchronously resolve the promise

        (0, _runloop.run)(null, resolve, value);
      }, 10);
    });
  }
});
define("ember-testing/lib/initializers", ["@ember/application"], function (_application) {
  "use strict";

  var name = 'deferReadiness in `testing` mode';
  (0, _application.onLoad)('Ember.Application', function (Application) {
    if (!Application.initializers[name]) {
      Application.initializer({
        name: name,

        initialize(application) {
          if (application.testing) {
            application.deferReadiness();
          }
        }

      });
    }
  });
});
define("ember-testing/lib/setup_for_testing", ["exports", "@ember/debug", "@ember/-internals/views", "ember-testing/lib/test/adapter", "ember-testing/lib/test/pending_requests", "ember-testing/lib/adapters/adapter", "ember-testing/lib/adapters/qunit"], function (_exports, _debug, _views, _adapter, _pending_requests, _adapter2, _qunit) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupForTesting;

  /* global self */

  /**
    Sets Ember up for testing. This is useful to perform
    basic setup steps in order to unit test.
  
    Use `App.setupForTesting` to perform integration tests (full
    application testing).
  
    @method setupForTesting
    @namespace Ember
    @since 1.5.0
    @private
  */
  function setupForTesting() {
    (0, _debug.setTesting)(true);
    var adapter = (0, _adapter.getAdapter)(); // if adapter is not manually set default to QUnit

    if (!adapter) {
      (0, _adapter.setAdapter)(typeof self.QUnit === 'undefined' ? _adapter2.default.create() : _qunit.default.create());
    }

    if (!_views.jQueryDisabled) {
      (0, _views.jQuery)(document).off('ajaxSend', _pending_requests.incrementPendingRequests);
      (0, _views.jQuery)(document).off('ajaxComplete', _pending_requests.decrementPendingRequests);
      (0, _pending_requests.clearPendingRequests)();
      (0, _views.jQuery)(document).on('ajaxSend', _pending_requests.incrementPendingRequests);
      (0, _views.jQuery)(document).on('ajaxComplete', _pending_requests.decrementPendingRequests);
    }
  }
});
define("ember-testing/lib/support", ["@ember/debug", "@ember/-internals/views", "@ember/-internals/browser-environment"], function (_debug, _views, _browserEnvironment) {
  "use strict";

  /**
    @module ember
  */
  var $ = _views.jQuery;
  /**
    This method creates a checkbox and triggers the click event to fire the
    passed in handler. It is used to correct for a bug in older versions
    of jQuery (e.g 1.8.3).
  
    @private
    @method testCheckboxClick
  */

  function testCheckboxClick(handler) {
    var input = document.createElement('input');
    $(input).attr('type', 'checkbox').css({
      position: 'absolute',
      left: '-1000px',
      top: '-1000px'
    }).appendTo('body').on('click', handler).trigger('click').remove();
  }

  if (_browserEnvironment.hasDOM && !_views.jQueryDisabled) {
    $(function () {
      /*
        Determine whether a checkbox checked using jQuery's "click" method will have
        the correct value for its checked property.
         If we determine that the current jQuery version exhibits this behavior,
        patch it to work correctly as in the commit for the actual fix:
        https://github.com/jquery/jquery/commit/1fb2f92.
      */
      testCheckboxClick(function () {
        if (!this.checked && !$.event.special.click) {
          $.event.special.click = {
            // For checkbox, fire native event so checked state will be right
            trigger() {
              if (this.nodeName === 'INPUT' && this.type === 'checkbox' && this.click) {
                this.click();
                return false;
              }
            }

          };
        }
      }); // Try again to verify that the patch took effect or blow up.

      testCheckboxClick(function () {
        (true && (0, _debug.warn)("clicked checkboxes should be checked! the jQuery patch didn't work", this.checked, {
          id: 'ember-testing.test-checkbox-click'
        }));
      });
    });
  }
});
define("ember-testing/lib/test", ["exports", "ember-testing/lib/test/helpers", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/waiters", "ember-testing/lib/test/adapter"], function (_exports, _helpers, _on_inject_helpers, _promise, _waiters, _adapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
    @module ember
  */

  /**
    This is a container for an assortment of testing related functionality:
  
    * Choose your default test adapter (for your framework of choice).
    * Register/Unregister additional test helpers.
    * Setup callbacks to be fired when the test helpers are injected into
      your application.
  
    @class Test
    @namespace Ember
    @public
  */
  var Test = {
    /**
      Hash containing all known test helpers.
       @property _helpers
      @private
      @since 1.7.0
    */
    _helpers: _helpers.helpers,
    registerHelper: _helpers.registerHelper,
    registerAsyncHelper: _helpers.registerAsyncHelper,
    unregisterHelper: _helpers.unregisterHelper,
    onInjectHelpers: _on_inject_helpers.onInjectHelpers,
    Promise: _promise.default,
    promise: _promise.promise,
    resolve: _promise.resolve,
    registerWaiter: _waiters.registerWaiter,
    unregisterWaiter: _waiters.unregisterWaiter,
    checkWaiters: _waiters.checkWaiters
  };
  /**
   Used to allow ember-testing to communicate with a specific testing
   framework.
  
   You can manually set it before calling `App.setupForTesting()`.
  
   Example:
  
   ```javascript
   Ember.Test.adapter = MyCustomAdapter.create()
   ```
  
   If you do not set it, ember-testing will default to `Ember.Test.QUnitAdapter`.
  
   @public
   @for Ember.Test
   @property adapter
   @type {Class} The adapter to be used.
   @default Ember.Test.QUnitAdapter
  */

  Object.defineProperty(Test, 'adapter', {
    get: _adapter.getAdapter,
    set: _adapter.setAdapter
  });
  var _default = Test;
  _exports.default = _default;
});
define("ember-testing/lib/test/adapter", ["exports", "@ember/-internals/error-handling"], function (_exports, _errorHandling) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getAdapter = getAdapter;
  _exports.setAdapter = setAdapter;
  _exports.asyncStart = asyncStart;
  _exports.asyncEnd = asyncEnd;
  var adapter;

  function getAdapter() {
    return adapter;
  }

  function setAdapter(value) {
    adapter = value;

    if (value && typeof value.exception === 'function') {
      (0, _errorHandling.setDispatchOverride)(adapterDispatch);
    } else {
      (0, _errorHandling.setDispatchOverride)(null);
    }
  }

  function asyncStart() {
    if (adapter) {
      adapter.asyncStart();
    }
  }

  function asyncEnd() {
    if (adapter) {
      adapter.asyncEnd();
    }
  }

  function adapterDispatch(error) {
    adapter.exception(error);
    console.error(error.stack); // eslint-disable-line no-console
  }
});
define("ember-testing/lib/test/helpers", ["exports", "ember-testing/lib/test/promise"], function (_exports, _promise) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHelper = registerHelper;
  _exports.registerAsyncHelper = registerAsyncHelper;
  _exports.unregisterHelper = unregisterHelper;
  _exports.helpers = void 0;
  var helpers = {};
  /**
   @module @ember/test
  */

  /**
    `registerHelper` is used to register a test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    This helper can later be called without arguments because it will be
    called with `app` as the first parameter.
  
    ```javascript
    import Application from '@ember/application';
  
    App = Application.create();
    App.injectTestHelpers();
    boot();
    ```
  
    @public
    @for @ember/test
    @static
    @method registerHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @param options {Object}
  */

  _exports.helpers = helpers;

  function registerHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: false
      }
    };
  }
  /**
    `registerAsyncHelper` is used to register an async test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerAsyncHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    The advantage of an async helper is that it will not run
    until the last async helper has completed.  All async helpers
    after it will wait for it complete before running.
  
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('deletePost', function(app, postId) {
      click('.delete-' + postId);
    });
  
    // ... in your test
    visit('/post/2');
    deletePost(2);
    visit('/post/3');
    deletePost(3);
    ```
  
    @public
    @for @ember/test
    @method registerAsyncHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @since 1.2.0
  */


  function registerAsyncHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: true
      }
    };
  }
  /**
    Remove a previously added helper method.
  
    Example:
  
    ```javascript
    import { unregisterHelper } from '@ember/test';
  
    unregisterHelper('wait');
    ```
  
    @public
    @method unregisterHelper
    @static
    @for @ember/test
    @param {String} name The helper to remove.
  */


  function unregisterHelper(name) {
    delete helpers[name];
    delete _promise.default.prototype[name];
  }
});
define("ember-testing/lib/test/on_inject_helpers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.onInjectHelpers = onInjectHelpers;
  _exports.invokeInjectHelpersCallbacks = invokeInjectHelpersCallbacks;
  _exports.callbacks = void 0;
  var callbacks = [];
  /**
    Used to register callbacks to be fired whenever `App.injectTestHelpers`
    is called.
  
    The callback will receive the current application as an argument.
  
    Example:
  
    ```javascript
    import $ from 'jquery';
  
    Ember.Test.onInjectHelpers(function() {
      $(document).ajaxSend(function() {
        Test.pendingRequests++;
      });
  
      $(document).ajaxComplete(function() {
        Test.pendingRequests--;
      });
    });
    ```
  
    @public
    @for Ember.Test
    @method onInjectHelpers
    @param {Function} callback The function to be called.
  */

  _exports.callbacks = callbacks;

  function onInjectHelpers(callback) {
    callbacks.push(callback);
  }

  function invokeInjectHelpersCallbacks(app) {
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](app);
    }
  }
});
define("ember-testing/lib/test/pending_requests", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.pendingRequests = pendingRequests;
  _exports.clearPendingRequests = clearPendingRequests;
  _exports.incrementPendingRequests = incrementPendingRequests;
  _exports.decrementPendingRequests = decrementPendingRequests;
  var requests = [];

  function pendingRequests() {
    return requests.length;
  }

  function clearPendingRequests() {
    requests.length = 0;
  }

  function incrementPendingRequests(_, xhr) {
    requests.push(xhr);
  }

  function decrementPendingRequests(_, xhr) {
    setTimeout(function () {
      for (var i = 0; i < requests.length; i++) {
        if (xhr === requests[i]) {
          requests.splice(i, 1);
          break;
        }
      }
    }, 0);
  }
});
define("ember-testing/lib/test/promise", ["exports", "@ember/-internals/runtime", "ember-testing/lib/test/run"], function (_exports, _runtime, _run) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.promise = promise;
  _exports.resolve = resolve;
  _exports.getLastPromise = getLastPromise;
  _exports.default = void 0;
  var lastPromise;

  class TestPromise extends _runtime.RSVP.Promise {
    constructor() {
      super(...arguments);
      lastPromise = this;
    }

    then(_onFulfillment, ...args) {
      var onFulfillment = typeof _onFulfillment === 'function' ? result => isolate(_onFulfillment, result) : undefined;
      return super.then(onFulfillment, ...args);
    }

  }
  /**
    This returns a thenable tailored for testing.  It catches failed
    `onSuccess` callbacks and invokes the `Ember.Test.adapter.exception`
    callback in the last chained then.
  
    This method should be returned by async helpers such as `wait`.
  
    @public
    @for Ember.Test
    @method promise
    @param {Function} resolver The function used to resolve the promise.
    @param {String} label An optional string for identifying the promise.
  */


  _exports.default = TestPromise;

  function promise(resolver, label) {
    var fullLabel = `Ember.Test.promise: ${label || '<Unknown Promise>'}`;
    return new TestPromise(resolver, fullLabel);
  }
  /**
    Replacement for `Ember.RSVP.resolve`
    The only difference is this uses
    an instance of `Ember.Test.Promise`
  
    @public
    @for Ember.Test
    @method resolve
    @param {Mixed} The value to resolve
    @since 1.2.0
  */


  function resolve(result, label) {
    return TestPromise.resolve(result, label);
  }

  function getLastPromise() {
    return lastPromise;
  } // This method isolates nested async methods
  // so that they don't conflict with other last promises.
  //
  // 1. Set `Ember.Test.lastPromise` to null
  // 2. Invoke method
  // 3. Return the last promise created during method


  function isolate(onFulfillment, result) {
    // Reset lastPromise for nested helpers
    lastPromise = null;
    var value = onFulfillment(result);
    var promise = lastPromise;
    lastPromise = null; // If the method returned a promise
    // return that promise. If not,
    // return the last async helper's promise

    if (value && value instanceof TestPromise || !promise) {
      return value;
    } else {
      return (0, _run.default)(() => resolve(promise).then(() => value));
    }
  }
});
define("ember-testing/lib/test/run", ["exports", "@ember/runloop"], function (_exports, _runloop) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = run;

  function run(fn) {
    if (!(0, _runloop.getCurrentRunLoop)()) {
      return (0, _runloop.run)(fn);
    } else {
      return fn();
    }
  }
});
define("ember-testing/lib/test/waiters", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerWaiter = registerWaiter;
  _exports.unregisterWaiter = unregisterWaiter;
  _exports.checkWaiters = checkWaiters;

  /**
   @module @ember/test
  */
  var contexts = [];
  var callbacks = [];
  /**
     This allows ember-testing to play nicely with other asynchronous
     events, such as an application that is waiting for a CSS3
     transition or an IndexDB transaction. The waiter runs periodically
     after each async helper (i.e. `click`, `andThen`, `visit`, etc) has executed,
     until the returning result is truthy. After the waiters finish, the next async helper
     is executed and the process repeats.
  
     For example:
  
     ```javascript
     import { registerWaiter } from '@ember/test';
  
     registerWaiter(function() {
       return myPendingTransactions() === 0;
     });
     ```
     The `context` argument allows you to optionally specify the `this`
     with which your callback will be invoked.
  
     For example:
  
     ```javascript
     import { registerWaiter } from '@ember/test';
  
     registerWaiter(MyDB, MyDB.hasPendingTransactions);
     ```
  
     @public
     @for @ember/test
     @static
     @method registerWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */

  function registerWaiter(context, callback) {
    if (arguments.length === 1) {
      callback = context;
      context = null;
    }

    if (indexOf(context, callback) > -1) {
      return;
    }

    contexts.push(context);
    callbacks.push(callback);
  }
  /**
     `unregisterWaiter` is used to unregister a callback that was
     registered with `registerWaiter`.
  
     @public
     @for @ember/test
     @static
     @method unregisterWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */


  function unregisterWaiter(context, callback) {
    if (!callbacks.length) {
      return;
    }

    if (arguments.length === 1) {
      callback = context;
      context = null;
    }

    var i = indexOf(context, callback);

    if (i === -1) {
      return;
    }

    contexts.splice(i, 1);
    callbacks.splice(i, 1);
  }
  /**
    Iterates through each registered test waiter, and invokes
    its callback. If any waiter returns false, this method will return
    true indicating that the waiters have not settled yet.
  
    This is generally used internally from the acceptance/integration test
    infrastructure.
  
    @public
    @for @ember/test
    @static
    @method checkWaiters
  */


  function checkWaiters() {
    if (!callbacks.length) {
      return false;
    }

    for (var i = 0; i < callbacks.length; i++) {
      var context = contexts[i];
      var callback = callbacks[i];

      if (!callback.call(context)) {
        return true;
      }
    }

    return false;
  }

  function indexOf(context, callback) {
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === callback && contexts[i] === context) {
        return i;
      }
    }

    return -1;
  }
});

          var testing = require('ember-testing');
          Ember.Test = testing.Test;
          Ember.Test.Adapter = testing.Adapter;
          Ember.Test.QUnitAdapter = testing.QUnitAdapter;
          Ember.setupForTesting = testing.setupForTesting;
        
}());

/* globals require, Ember, jQuery */
(() => {
  if (typeof jQuery !== 'undefined') {
    let _Ember;

    if (typeof Ember !== 'undefined') {
      _Ember = Ember;
    } else {
      _Ember = require('ember').default;
    }

    let pendingRequests;

    if (Ember.__loader.registry['ember-testing/test/pending_requests']) {
      // Ember <= 3.1
      pendingRequests = Ember.__loader.require('ember-testing/test/pending_requests');
    } else if (Ember.__loader.registry['ember-testing/lib/test/pending_requests']) {
      // Ember >= 3.2
      pendingRequests = Ember.__loader.require('ember-testing/lib/test/pending_requests');
    }

    if (pendingRequests) {
      // This exists to ensure that the AJAX listeners setup by Ember itself
      // (which as of 2.17 are not properly torn down) get cleared and released
      // when the application is destroyed. Without this, any AJAX requests
      // that happen _between_ acceptance tests will always share
      // `pendingRequests`.
      _Ember.Application.reopen({
        willDestroy() {
          jQuery(document).off('ajaxSend', pendingRequests.incrementPendingRequests);
          jQuery(document).off('ajaxComplete', pendingRequests.decrementPendingRequests);
          pendingRequests.clearPendingRequests();

          this._super(...arguments);
        }

      });
    }
  }
})();
(function() {
  if (typeof QUnit !== 'undefined') {
    QUnit.config.urlConfig.push({
      id: 'mirageLogging',
      label: 'Mirage logging',
    });
  }
})();

define("@ember/test-helpers/-internal/build-registry", ["exports", "require"], function (_exports, _require) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  /**
   * Adds methods that are normally only on registry to the container. This is largely to support the legacy APIs
   * that are not using `owner` (but are still using `this.container`).
   *
   * @private
   * @param {Object} container  the container to modify
   */
  function exposeRegistryMethodsWithoutDeprecations(container) {
    let methods = ['register', 'unregister', 'resolve', 'normalize', 'typeInjection', 'injection', 'factoryInjection', 'factoryTypeInjection', 'has', 'options', 'optionsForType'];

    for (let i = 0, l = methods.length; i < l; i++) {
      let method = methods[i];

      if (method in container) {
        container[method] = function (...args) {
          return container._registry[method](...args);
        };
      }
    }
  }

  const RegistryProxyMixin = Ember._RegistryProxyMixin;
  const ContainerProxyMixin = Ember._ContainerProxyMixin;
  const Owner = Ember.Object.extend(RegistryProxyMixin, ContainerProxyMixin, {
    _emberTestHelpersMockOwner: true
  });
  /**
   * @private
   * @param {Object} resolver the resolver to use with the registry
   * @returns {Object} owner, container, registry
   */

  function _default(resolver) {
    let fallbackRegistry, registry, container;
    let namespace = Ember.Object.create({
      Resolver: {
        create() {
          return resolver;
        }

      }
    });
    fallbackRegistry = Ember.Application.buildRegistry(namespace); // TODO: only do this on Ember < 3.13

    fallbackRegistry.register('component-lookup:main', Ember.ComponentLookup);
    registry = new Ember.Registry({
      fallback: fallbackRegistry
    });
    Ember.ApplicationInstance.setupRegistry(registry); // these properties are set on the fallback registry by `buildRegistry`
    // and on the primary registry within the ApplicationInstance constructor
    // but we need to manually recreate them since ApplicationInstance's are not
    // exposed externally

    registry.normalizeFullName = fallbackRegistry.normalizeFullName;
    registry.makeToString = fallbackRegistry.makeToString;
    registry.describe = fallbackRegistry.describe;
    let owner = Owner.create({
      __registry__: registry,
      __container__: null
    });
    container = registry.container({
      owner: owner
    });
    owner.__container__ = container;
    exposeRegistryMethodsWithoutDeprecations(container);

    if ((0, _require.has)('ember-data/setup-container')) {
      // ember-data is a proper ember-cli addon since 2.3; if no 'import
      // 'ember-data'' is present somewhere in the tests, there is also no `DS`
      // available on the globalContext and hence ember-data wouldn't be setup
      // correctly for the tests; that's why we import and call setupContainer
      // here; also see https://github.com/emberjs/data/issues/4071 for context
      let setupContainer = (0, _require.default)("ember-data/setup-container")['default'];
      setupContainer(registry || container);
    }

    return {
      registry,
      container,
      owner
    };
  }
});
define("@ember/test-helpers/-internal/debug-info-helpers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = registerDebugInfoHelper;
  _exports.debugInfoHelpers = void 0;
  const debugInfoHelpers = new Set();
  /**
   * Registers a custom debug info helper to augment the output for test isolation validation.
   *
   * @public
   * @param {DebugInfoHelper} debugHelper a custom debug info helper
   * @example
   *
   * import { registerDebugInfoHelper } from '@ember/test-helpers';
   *
   * registerDebugInfoHelper({
   *   name: 'Date override detection',
   *   log() {
   *     if (dateIsOverridden()) {
   *       console.log(this.name);
   *       console.log('The date object has been overridden');
   *     }
   *   }
   * })
   */

  _exports.debugInfoHelpers = debugInfoHelpers;

  function registerDebugInfoHelper(debugHelper) {
    debugInfoHelpers.add(debugHelper);
  }
});
define("@ember/test-helpers/-internal/debug-info", ["exports", "@ember/test-helpers/-internal/debug-info-helpers", "@ember/test-waiters"], function (_exports, _debugInfoHelpers, _testWaiters) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.backburnerDebugInfoAvailable = backburnerDebugInfoAvailable;
  _exports.getDebugInfo = getDebugInfo;
  _exports.TestDebugInfo = void 0;
  const PENDING_AJAX_REQUESTS = 'Pending AJAX requests';
  const PENDING_TEST_WAITERS = 'Pending test waiters';
  const SCHEDULED_ASYNC = 'Scheduled async';
  const SCHEDULED_AUTORUN = 'Scheduled autorun';
  /**
   * Determins if the `getDebugInfo` method is available in the
   * running verison of backburner.
   *
   * @returns {boolean} True if `getDebugInfo` is present in backburner, otherwise false.
   */

  function backburnerDebugInfoAvailable() {
    return typeof Ember.run.backburner.getDebugInfo === 'function';
  }
  /**
   * Retrieves debug information from backburner's current deferred actions queue (runloop instance).
   * If the `getDebugInfo` method isn't available, it returns `null`.
   *
   * @public
   * @returns {MaybeDebugInfo | null} Backburner debugInfo or, if the getDebugInfo method is not present, null
   */


  function getDebugInfo() {
    return Ember.run.backburner.DEBUG === true && backburnerDebugInfoAvailable() ? Ember.run.backburner.getDebugInfo() : null;
  }
  /**
   * Encapsulates debug information for an individual test. Aggregates information
   * from:
   * - info provided by getSettledState
   *    - hasPendingTimers
   *    - hasRunLoop
   *    - hasPendingWaiters
   *    - hasPendingRequests
   * - info provided by backburner's getDebugInfo method (timers, schedules, and stack trace info)
   *
   */


  class TestDebugInfo {
    constructor(settledState, debugInfo = getDebugInfo()) {
      this._summaryInfo = undefined;
      this._settledState = settledState;
      this._debugInfo = debugInfo;
    }

    get summary() {
      if (!this._summaryInfo) {
        this._summaryInfo = Ember.assign({}, this._settledState);

        if (this._debugInfo) {
          this._summaryInfo.autorunStackTrace = this._debugInfo.autorun && this._debugInfo.autorun.stack;
          this._summaryInfo.pendingTimersCount = this._debugInfo.timers.length;
          this._summaryInfo.hasPendingTimers = this._settledState.hasPendingTimers && this._summaryInfo.pendingTimersCount > 0;
          this._summaryInfo.pendingTimersStackTraces = this._debugInfo.timers.map(timer => timer.stack);
          this._summaryInfo.pendingScheduledQueueItemCount = this._debugInfo.instanceStack.filter(q => q).reduce((total, item) => {
            Object.keys(item).forEach(queueName => {
              total += item[queueName].length;
            });
            return total;
          }, 0);
          this._summaryInfo.pendingScheduledQueueItemStackTraces = this._debugInfo.instanceStack.filter(q => q).reduce((stacks, deferredActionQueues) => {
            Object.keys(deferredActionQueues).forEach(queue => {
              deferredActionQueues[queue].forEach(queueItem => queueItem.stack && stacks.push(queueItem.stack));
            });
            return stacks;
          }, []);
        }

        if (this._summaryInfo.hasPendingTestWaiters) {
          this._summaryInfo.pendingTestWaiterInfo = (0, _testWaiters.getPendingWaiterState)();
        }
      }

      return this._summaryInfo;
    }

    toConsole(_console = console) {
      let summary = this.summary;

      if (summary.hasPendingRequests) {
        _console.log(PENDING_AJAX_REQUESTS);
      }

      if (summary.hasPendingLegacyWaiters) {
        _console.log(PENDING_TEST_WAITERS);
      }

      if (summary.hasPendingTestWaiters) {
        if (!summary.hasPendingLegacyWaiters) {
          _console.log(PENDING_TEST_WAITERS);
        }

        Object.keys(summary.pendingTestWaiterInfo.waiters).forEach(waiterName => {
          let waiterDebugInfo = summary.pendingTestWaiterInfo.waiters[waiterName];

          if (Array.isArray(waiterDebugInfo)) {
            _console.group(waiterName);

            waiterDebugInfo.forEach(debugInfo => {
              _console.log(`${debugInfo.label ? debugInfo.label : 'stack'}: ${debugInfo.stack}`);
            });

            _console.groupEnd();
          } else {
            _console.log(waiterName);
          }
        });
      }

      if (summary.hasPendingTimers || summary.pendingScheduledQueueItemCount > 0) {
        _console.group(SCHEDULED_ASYNC);

        summary.pendingTimersStackTraces.forEach(timerStack => {
          _console.log(timerStack);
        });
        summary.pendingScheduledQueueItemStackTraces.forEach(scheduleQueueItemStack => {
          _console.log(scheduleQueueItemStack);
        });

        _console.groupEnd();
      }

      if (summary.hasRunLoop && summary.pendingTimersCount === 0 && summary.pendingScheduledQueueItemCount === 0) {
        _console.log(SCHEDULED_AUTORUN);

        if (summary.autorunStackTrace) {
          _console.log(summary.autorunStackTrace);
        }
      }

      _debugInfoHelpers.debugInfoHelpers.forEach(helper => {
        helper.log();
      });
    }

    _formatCount(title, count) {
      return `${title}: ${count}`;
    }

  }

  _exports.TestDebugInfo = TestDebugInfo;
});
define("@ember/test-helpers/-internal/helper-hooks", ["exports", "@ember/test-helpers/-utils"], function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerHook = registerHook;
  _exports.runHooks = runHooks;
  const registeredHooks = new Map();
  /**
   * @private
   * @param {string} helperName The name of the test helper in which to run the hook.
   * @param {string} label A label to help identify the hook.
   * @returns {string} The compound key for the helper.
   */

  function getHelperKey(helperName, label) {
    return `${helperName}:${label}`;
  }
  /**
   * Registers a hook function to be run during the invocation of a test helper.
   *
   * @private
   * @param {string} helperName The name of the test helper in which to run the hook.
   * @param {string} label A label to help identify the hook. Built-in labels are `start` and `end`,
   *                       designating the start of the helper invocation and the end.
   * @param {Function} hook The hook function to run when the test helper is invoked.
   * @returns {HookUnregister} An object containing an unregister function that will unregister
   *                           the specific hook registered to the helper.
   */


  function registerHook(helperName, label, hook) {
    let helperKey = getHelperKey(helperName, label);
    let hooksForHelper = registeredHooks.get(helperKey);

    if (hooksForHelper === undefined) {
      hooksForHelper = new Set();
      registeredHooks.set(helperKey, hooksForHelper);
    }

    hooksForHelper.add(hook);
    return {
      unregister() {
        hooksForHelper.delete(hook);
      }

    };
  }
  /**
   * Runs all hooks registered for a specific test helper.
   *
   * @private
   * @param {string} helperName  The name of the test helper.
   * @param {string} label A label to help identify the hook. Built-in labels are `start` and `end`,
   *                       designating the start of the helper invocation and the end.
   * @param {any[]} args Any arguments originally passed to the test helper.
   * @returns {Promise<void>} A promise representing the serial invocation of the hooks.
   */


  function runHooks(helperName, label, ...args) {
    let hooks = registeredHooks.get(getHelperKey(helperName, label)) || new Set();
    let promises = [];
    hooks.forEach(hook => {
      let hookResult = hook(...args);
      promises.push(hookResult);
    });
    return _utils.Promise.all(promises).then(() => {});
  }
});
define("@ember/test-helpers/-tuple", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = tuple;

  // eslint-disable-next-line require-jsdoc
  function tuple(...args) {
    return args;
  }
});
define("@ember/test-helpers/-utils", ["exports", "es6-promise"], function (_exports, _es6Promise) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.runDestroyablesFor = runDestroyablesFor;
  _exports.isNumeric = isNumeric;
  _exports.futureTick = _exports.nextTick = _exports.Promise = void 0;
  const HAS_PROMISE = typeof Promise === 'function' && // @ts-ignore this is checking if someone has explicitly done `window.Promise = window.Promise || Ember.RSVP.Promise
  Promise !== Ember.RSVP.Promise;

  const _Promise = HAS_PROMISE ? Promise : _es6Promise.Promise;

  _exports.Promise = _Promise;
  const nextTick = HAS_PROMISE ? cb => Promise.resolve().then(cb) : Ember.RSVP.asap;
  _exports.nextTick = nextTick;
  const futureTick = setTimeout;
  /**
   Retrieves an array of destroyables from the specified property on the object
   provided, iterates that array invoking each function, then deleting the
   property (clearing the array).
  
   @private
   @param {Object} object an object to search for the destroyable array within
   @param {string} property the property on the object that contains the destroyable array
  */

  _exports.futureTick = futureTick;

  function runDestroyablesFor(object, property) {
    let destroyables = object[property];

    if (!destroyables) {
      return;
    }

    for (let i = 0; i < destroyables.length; i++) {
      destroyables[i]();
    }

    delete object[property];
  }
  /**
   Returns whether the passed in string consists only of numeric characters.
  
   @private
   @param {string} n input string
   @returns {boolean} whether the input string consists only of numeric characters
   */


  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(Number(n));
  }
});
define("@ember/test-helpers/application", ["exports", "@ember/test-helpers/resolver"], function (_exports, _resolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setApplication = setApplication;
  _exports.getApplication = getApplication;

  let __application__;
  /**
    Stores the provided application instance so that tests being ran will be aware of the application under test.
  
    - Required by `setupApplicationContext` method.
    - Used by `setupContext` and `setupRenderingContext` when present.
  
    @public
    @param {Ember.Application} application the application that will be tested
  */


  function setApplication(application) {
    __application__ = application;

    if (!(0, _resolver.getResolver)()) {
      let Resolver = application.Resolver;
      let resolver = Resolver.create({
        namespace: application
      });
      (0, _resolver.setResolver)(resolver);
    }
  }
  /**
    Retrieve the application instance stored by `setApplication`.
  
    @public
    @returns {Ember.Application} the previously stored application instance under test
  */


  function getApplication() {
    return __application__;
  }
});
define("@ember/test-helpers/build-owner", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/-internal/build-registry"], function (_exports, _utils, _buildRegistry) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = buildOwner;

  /**
    Creates an "owner" (an object that either _is_ or duck-types like an
    `Ember.ApplicationInstance`) from the provided options.
  
    If `options.application` is present (e.g. setup by an earlier call to
    `setApplication`) an `Ember.ApplicationInstance` is built via
    `application.buildInstance()`.
  
    If `options.application` is not present, we fall back to using
    `options.resolver` instead (setup via `setResolver`). This creates a mock
    "owner" by using a custom created combination of `Ember.Registry`,
    `Ember.Container`, `Ember._ContainerProxyMixin`, and
    `Ember._RegistryProxyMixin`.
  
    @private
    @param {Ember.Application} [application] the Ember.Application to build an instance from
    @param {Ember.Resolver} [resolver] the resolver to use to back a "mock owner"
    @returns {Promise<Ember.ApplicationInstance>} a promise resolving to the generated "owner"
  */
  function buildOwner(application, resolver) {
    if (application) {
      return application.boot().then(app => app.buildInstance().boot());
    }

    if (!resolver) {
      throw new Error('You must set up the ember-test-helpers environment with either `setResolver` or `setApplication` before running any tests.');
    }

    let {
      owner
    } = (0, _buildRegistry.default)(resolver);
    return _utils.Promise.resolve(owner);
  }
});
define("@ember/test-helpers/dom/-get-element", ["exports", "@ember/test-helpers/dom/get-root-element", "@ember/test-helpers/dom/-target"], function (_exports, _getRootElement, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
    Used internally by the DOM interaction helpers to find one element.
  
    @private
    @param {string|Element} target the element or selector to retrieve
    @returns {Element} the target or selector
  */
  function getElement(target) {
    if (typeof target === 'string') {
      let rootElement = (0, _getRootElement.default)();
      return rootElement.querySelector(target);
    } else if ((0, _target.isElement)(target) || (0, _target.isDocument)(target)) {
      return target;
    } else if (target instanceof Window) {
      return target.document;
    } else {
      throw new Error('Must use an element or a selector string');
    }
  }

  var _default = getElement;
  _exports.default = _default;
});
define("@ember/test-helpers/dom/-get-elements", ["exports", "@ember/test-helpers/dom/get-root-element"], function (_exports, _getRootElement) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = getElements;

  /**
    Used internally by the DOM interaction helpers to find multiple elements.
  
    @private
    @param {string} target the selector to retrieve
    @returns {NodeList} the matched elements
  */
  function getElements(target) {
    if (typeof target === 'string') {
      let rootElement = (0, _getRootElement.default)();
      return rootElement.querySelectorAll(target);
    } else {
      throw new Error('Must use a selector string');
    }
  }
});
define("@ember/test-helpers/dom/-get-window-or-element", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-target"], function (_exports, _getElement, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getWindowOrElement = getWindowOrElement;

  /**
    Used internally by the DOM interaction helpers to find either window or an element.
  
    @private
    @param {string|Element} target the window, an element or selector to retrieve
    @returns {Element|Window} the target or selector
  */
  function getWindowOrElement(target) {
    if ((0, _target.isWindow)(target)) {
      return target;
    }

    return (0, _getElement.default)(target);
  }
});
define("@ember/test-helpers/dom/-guard-for-maxlength", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = guardForMaxlength;
  // ref: https://html.spec.whatwg.org/multipage/input.html#concept-input-apply
  const constrainedInputTypes = ['text', 'search', 'url', 'tel', 'email', 'password'];
  /**
    @private
    @param {Element} element - the element to check
    @returns {boolean} `true` when the element should constrain input by the maxlength attribute, `false` otherwise
  */

  function isMaxLengthConstrained(element) {
    return !!Number(element.getAttribute('maxLength')) && (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement && constrainedInputTypes.indexOf(element.type) > -1);
  }
  /**
   * @private
   * @param {Element} element - the element to check
   * @param {string} text - the text being added to element
   * @param {string} testHelper - the test helper context the guard is called from (for Error message)
   * @throws if `element` has `maxlength` & `value` exceeds `maxlength`
   */


  function guardForMaxlength(element, text, testHelper) {
    const maxlength = element.getAttribute('maxlength');

    if (isMaxLengthConstrained(element) && maxlength && text && text.length > Number(maxlength)) {
      throw new Error(`Can not \`${testHelper}\` with text: '${text}' that exceeds maxlength: '${maxlength}'.`);
    }
  }
});
define("@ember/test-helpers/dom/-is-focusable", ["exports", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/dom/-target"], function (_exports, _isFormControl, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isFocusable;
  const FOCUSABLE_TAGS = ['A']; // eslint-disable-next-line require-jsdoc

  function isFocusableElement(element) {
    return FOCUSABLE_TAGS.indexOf(element.tagName) > -1;
  }
  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is focusable, `false` otherwise
  */


  function isFocusable(element) {
    if ((0, _target.isWindow)(element)) {
      return false;
    }

    if ((0, _target.isDocument)(element)) {
      return false;
    }

    if ((0, _isFormControl.default)(element)) {
      return !element.disabled;
    }

    if ((0, _target.isContentEditable)(element) || isFocusableElement(element)) {
      return true;
    }

    return element.hasAttribute('tabindex');
  }
});
define("@ember/test-helpers/dom/-is-form-control", ["exports", "@ember/test-helpers/dom/-target"], function (_exports, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isFormControl;
  const FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is a form control, `false` otherwise
  */

  function isFormControl(element) {
    return !(0, _target.isWindow)(element) && !(0, _target.isDocument)(element) && FORM_CONTROL_TAGS.indexOf(element.tagName) > -1 && element.type !== 'hidden';
  }
});
define("@ember/test-helpers/dom/-is-select-element", ["exports", "@ember/test-helpers/dom/-target"], function (_exports, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isSelectElement;

  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is a select element, `false` otherwise
  */
  function isSelectElement(element) {
    return !(0, _target.isDocument)(element) && element.tagName === 'SELECT';
  }
});
define("@ember/test-helpers/dom/-logging", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.log = log;
  _exports.elementToString = elementToString;

  /**
   * Logs a debug message to the console if the `testHelperLogging` query
   * parameter is set.
   *
   * @private
   * @param {string} helperName Name of the helper
   * @param {string|Element} target The target element or selector
   */
  function log(helperName, target, ...args) {
    if (loggingEnabled()) {
      // eslint-disable-next-line no-console
      console.log(`${helperName}(${[elementToString(target), ...args.filter(Boolean)].join(', ')})`);
    }
  }
  /**
   * Returns whether the test helper logging is enabled or not via the
   * `testHelperLogging` query parameter.
   *
   * @private
   * @returns {boolean} true if enabled
   */


  function loggingEnabled() {
    return typeof location !== 'undefined' && location.search.indexOf('testHelperLogging') !== -1;
  }
  /**
   * This generates a human-readable description to a DOM element.
   *
   * @private
   * @param {*} el The element that should be described
   * @returns {string} A human-readable description
   */


  function elementToString(el) {
    let desc;

    if (el instanceof NodeList) {
      if (el.length === 0) {
        return 'empty NodeList';
      }

      desc = Array.prototype.slice.call(el, 0, 5).map(elementToString).join(', ');
      return el.length > 5 ? `${desc}... (+${el.length - 5} more)` : desc;
    }

    if (!(el instanceof HTMLElement || el instanceof SVGElement)) {
      return String(el);
    }

    desc = el.tagName.toLowerCase();

    if (el.id) {
      desc += `#${el.id}`;
    }

    if (el.className && !(el.className instanceof SVGAnimatedString)) {
      desc += `.${String(el.className).replace(/\s+/g, '.')}`;
    }

    Array.prototype.forEach.call(el.attributes, function (attr) {
      if (attr.name !== 'class' && attr.name !== 'id') {
        desc += `[${attr.name}${attr.value ? `="${attr.value}"]` : ']'}`;
      }
    });
    return desc;
  }
});
define("@ember/test-helpers/dom/-target", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isElement = isElement;
  _exports.isWindow = isWindow;
  _exports.isDocument = isDocument;
  _exports.isContentEditable = isContentEditable;

  // eslint-disable-next-line require-jsdoc
  function isElement(target) {
    return target.nodeType === Node.ELEMENT_NODE;
  } // eslint-disable-next-line require-jsdoc


  function isWindow(target) {
    return target instanceof Window;
  } // eslint-disable-next-line require-jsdoc


  function isDocument(target) {
    return target.nodeType === Node.DOCUMENT_NODE;
  } // eslint-disable-next-line require-jsdoc


  function isContentEditable(element) {
    return 'isContentEditable' in element && element.isContentEditable;
  }
});
define("@ember/test-helpers/dom/-to-array", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = toArray;

  /**
    @private
    @param {NodeList} nodelist the nodelist to convert to an array
    @returns {Array} an array
  */
  function toArray(nodelist) {
    let array = new Array(nodelist.length);

    for (let i = 0; i < nodelist.length; i++) {
      array[i] = nodelist[i];
    }

    return array;
  }
});
define("@ember/test-helpers/dom/blur", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getElement, _fireEvent, _settled, _utils, _logging, _isFocusable, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__blur__ = __blur__;
  _exports.default = blur;
  (0, _helperHooks.registerHook)('blur', 'start', target => {
    (0, _logging.log)('blur', target);
  });
  /**
    @private
    @param {Element} element the element to trigger events on
    @param {Element} relatedTarget the element that is focused after blur
  */

  function __blur__(element, relatedTarget = null) {
    if (!(0, _isFocusable.default)(element)) {
      throw new Error(`${element} is not focusable`);
    }

    let browserIsNotFocused = document.hasFocus && !document.hasFocus();
    let needsCustomEventOptions = relatedTarget !== null;

    if (!needsCustomEventOptions) {
      // makes `document.activeElement` be `body`.
      // If the browser is focused, it also fires a blur event
      element.blur();
    } // Chrome/Firefox does not trigger the `blur` event if the window
    // does not have focus. If the document does not have focus then
    // fire `blur` event via native event.


    if (browserIsNotFocused || needsCustomEventOptions) {
      let options = {
        relatedTarget
      };
      (0, _fireEvent.default)(element, 'blur', Ember.assign({
        bubbles: false
      }, options));
      (0, _fireEvent.default)(element, 'focusout', options);
    }
  }
  /**
    Unfocus the specified target.
  
    Sends a number of events intending to simulate a "real" user unfocusing an
    element.
  
    The following events are triggered (in order):
  
    - `blur`
    - `focusout`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle unfocusing a given element.
  
    @public
    @param {string|Element} [target=document.activeElement] the element or selector to unfocus
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating blurring an input using `blur`
    </caption>
  
    blur('input');
  */


  function blur(target = document.activeElement) {
    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('blur', 'start', target)).then(() => {
      let element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`blur('${target}')\`.`);
      }

      __blur__(element);

      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('blur', 'end', target));
  }
});
define("@ember/test-helpers/dom/click", ["exports", "@ember/test-helpers/dom/-get-window-or-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/focus", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getWindowOrElement, _fireEvent, _focus, _settled, _isFocusable, _utils, _isFormControl, _logging, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__click__ = __click__;
  _exports.default = click;
  _exports.DEFAULT_CLICK_OPTIONS = void 0;
  const PRIMARY_BUTTON = 1;
  const MAIN_BUTTON_PRESSED = 0;
  (0, _helperHooks.registerHook)('click', 'start', target => {
    (0, _logging.log)('click', target);
  });
  /**
   * Represent a particular mouse button being clicked.
   * See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons for available options.
   */

  const DEFAULT_CLICK_OPTIONS = {
    buttons: PRIMARY_BUTTON,
    button: MAIN_BUTTON_PRESSED
  };
  /**
    @private
    @param {Element} element the element to click on
    @param {MouseEventInit} options the options to be merged into the mouse events
  */

  _exports.DEFAULT_CLICK_OPTIONS = DEFAULT_CLICK_OPTIONS;

  function __click__(element, options) {
    (0, _fireEvent.default)(element, 'mousedown', options);

    if ((0, _isFocusable.default)(element)) {
      (0, _focus.__focus__)(element);
    }

    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
  }
  /**
    Clicks on the specified target.
  
    Sends a number of events intending to simulate a "real" user clicking on an
    element.
  
    For non-focusable elements the following events are triggered (in order):
  
    - `mousedown`
    - `mouseup`
    - `click`
  
    For focusable (e.g. form control) elements the following events are triggered
    (in order):
  
    - `mousedown`
    - `focus`
    - `focusin`
    - `mouseup`
    - `click`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle clicking a given element.
  
    Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).
    You can use this to specifiy modifier keys as well.
  
    @public
    @param {string|Element} target the element or selector to click on
    @param {MouseEventInit} _options the options to be merged into the mouse events.
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating clicking a button using `click`
    </caption>
    click('button');
  
    @example
    <caption>
      Emulating clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
    </caption>
  
    click('button', { shiftKey: true });
  */


  function click(target, _options = {}) {
    let options = Ember.assign({}, DEFAULT_CLICK_OPTIONS, _options);
    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('click', 'start', target, _options)).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `click`.');
      }

      let element = (0, _getWindowOrElement.getWindowOrElement)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`click('${target}')\`.`);
      }

      if ((0, _isFormControl.default)(element) && element.disabled) {
        throw new Error(`Can not \`click\` disabled ${element}`);
      }

      __click__(element, options);

      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('click', 'end', target, _options));
  }
});
define("@ember/test-helpers/dom/double-click", ["exports", "@ember/test-helpers/dom/-get-window-or-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/focus", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/click", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getWindowOrElement, _fireEvent, _focus, _settled, _isFocusable, _utils, _click, _logging, _isFormControl, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__doubleClick__ = __doubleClick__;
  _exports.default = doubleClick;
  (0, _helperHooks.registerHook)('doubleClick', 'start', target => {
    (0, _logging.log)('doubleClick', target);
  });
  /**
    @private
    @param {Element} element the element to double-click on
    @param {MouseEventInit} options the options to be merged into the mouse events
  */

  function __doubleClick__(element, options) {
    (0, _fireEvent.default)(element, 'mousedown', options);

    if ((0, _isFocusable.default)(element)) {
      (0, _focus.__focus__)(element);
    }

    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
    (0, _fireEvent.default)(element, 'mousedown', options);
    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
    (0, _fireEvent.default)(element, 'dblclick', options);
  }
  /**
    Double-clicks on the specified target.
  
    Sends a number of events intending to simulate a "real" user clicking on an
    element.
  
    For non-focusable elements the following events are triggered (in order):
  
    - `mousedown`
    - `mouseup`
    - `click`
    - `mousedown`
    - `mouseup`
    - `click`
    - `dblclick`
  
    For focusable (e.g. form control) elements the following events are triggered
    (in order):
  
    - `mousedown`
    - `focus`
    - `focusin`
    - `mouseup`
    - `click`
    - `mousedown`
    - `mouseup`
    - `click`
    - `dblclick`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle clicking a given element.
  
    Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).
  
    @public
    @param {string|Element} target the element or selector to double-click on
    @param {MouseEventInit} _options the options to be merged into the mouse events
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating double clicking a button using `doubleClick`
    </caption>
  
    doubleClick('button');
  
    @example
    <caption>
      Emulating double clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
    </caption>
  
    doubleClick('button', { shiftKey: true });
  */


  function doubleClick(target, _options = {}) {
    let options = Ember.assign({}, _click.DEFAULT_CLICK_OPTIONS, _options);
    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('doubleClick', 'start', target, _options)).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `doubleClick`.');
      }

      let element = (0, _getWindowOrElement.getWindowOrElement)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`doubleClick('${target}')\`.`);
      }

      if ((0, _isFormControl.default)(element) && element.disabled) {
        throw new Error(`Can not \`doubleClick\` disabled ${element}`);
      }

      __doubleClick__(element, options);

      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('doubleClick', 'end', target, _options));
  }
});
define("@ember/test-helpers/dom/fill-in", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/dom/-guard-for-maxlength", "@ember/test-helpers/dom/focus", "@ember/test-helpers/settled", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-target", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getElement, _isFormControl, _guardForMaxlength, _focus, _settled, _fireEvent, _utils, _target, _logging, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = fillIn;
  (0, _helperHooks.registerHook)('fillIn', 'start', (target, text) => {
    (0, _logging.log)('fillIn', target, text);
  });
  /**
    Fill the provided text into the `value` property (or set `.innerHTML` when
    the target is a content editable element) then trigger `change` and `input`
    events on the specified target.
  
    @public
    @param {string|Element} target the element or selector to enter text into
    @param {string} text the text to fill into the target element
    @return {Promise<void>} resolves when the application is settled
  
    @example
    <caption>
      Emulating filling an input with text using `fillIn`
    </caption>
  
    fillIn('input', 'hello world');
  */

  function fillIn(target, text) {
    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('fillIn', 'start', target, text)).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `fillIn`.');
      }

      let element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`fillIn('${target}')\`.`);
      }

      if (typeof text === 'undefined' || text === null) {
        throw new Error('Must provide `text` when calling `fillIn`.');
      }

      if ((0, _isFormControl.default)(element)) {
        if (element.disabled) {
          throw new Error(`Can not \`fillIn\` disabled '${target}'.`);
        }

        if ('readOnly' in element && element.readOnly) {
          throw new Error(`Can not \`fillIn\` readonly '${target}'.`);
        }

        (0, _guardForMaxlength.default)(element, text, 'fillIn');
        (0, _focus.__focus__)(element);
        element.value = text;
      } else if ((0, _target.isContentEditable)(element)) {
        (0, _focus.__focus__)(element);
        element.innerHTML = text;
      } else {
        throw new Error('`fillIn` is only usable on form controls or contenteditable elements.');
      }

      (0, _fireEvent.default)(element, 'input');
      (0, _fireEvent.default)(element, 'change');
      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('fillIn', 'end', target, text));
  }
});
define("@ember/test-helpers/dom/find-all", ["exports", "@ember/test-helpers/dom/-get-elements", "@ember/test-helpers/dom/-to-array"], function (_exports, _getElements, _toArray) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = findAll;

  /**
    Find all elements matched by the given selector. Similar to calling
    `querySelectorAll()` on the test root element, but returns an array instead
    of a `NodeList`.
  
    @public
    @param {string} selector the selector to search for
    @return {Array} array of matched elements
  */
  function findAll(selector) {
    if (!selector) {
      throw new Error('Must pass a selector to `findAll`.');
    }

    if (arguments.length > 1) {
      throw new Error('The `findAll` test helper only takes a single argument.');
    }

    return (0, _toArray.default)((0, _getElements.default)(selector));
  }
});
define("@ember/test-helpers/dom/find", ["exports", "@ember/test-helpers/dom/-get-element"], function (_exports, _getElement) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = find;

  /**
    Find the first element matched by the given selector. Equivalent to calling
    `querySelector()` on the test root element.
  
    @public
    @param {string} selector the selector to search for
    @return {Element} matched element or null
  */
  function find(selector) {
    if (!selector) {
      throw new Error('Must pass a selector to `find`.');
    }

    if (arguments.length > 1) {
      throw new Error('The `find` test helper only takes a single argument.');
    }

    return (0, _getElement.default)(selector);
  }
});
define("@ember/test-helpers/dom/fire-event", ["exports", "@ember/test-helpers/dom/-target", "@ember/test-helpers/-tuple"], function (_exports, _target, _tuple) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isKeyboardEventType = isKeyboardEventType;
  _exports.isMouseEventType = isMouseEventType;
  _exports.isFileSelectionEventType = isFileSelectionEventType;
  _exports.isFileSelectionInput = isFileSelectionInput;
  _exports.default = _exports.KEYBOARD_EVENT_TYPES = void 0;

  // eslint-disable-next-line require-jsdoc
  const MOUSE_EVENT_CONSTRUCTOR = (() => {
    try {
      new MouseEvent('test');
      return true;
    } catch (e) {
      return false;
    }
  })();

  const DEFAULT_EVENT_OPTIONS = {
    bubbles: true,
    cancelable: true
  };
  const KEYBOARD_EVENT_TYPES = (0, _tuple.default)('keydown', 'keypress', 'keyup'); // eslint-disable-next-line require-jsdoc

  _exports.KEYBOARD_EVENT_TYPES = KEYBOARD_EVENT_TYPES;

  function isKeyboardEventType(eventType) {
    return KEYBOARD_EVENT_TYPES.indexOf(eventType) > -1;
  }

  const MOUSE_EVENT_TYPES = (0, _tuple.default)('click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover'); // eslint-disable-next-line require-jsdoc

  function isMouseEventType(eventType) {
    return MOUSE_EVENT_TYPES.indexOf(eventType) > -1;
  }

  const FILE_SELECTION_EVENT_TYPES = (0, _tuple.default)('change'); // eslint-disable-next-line require-jsdoc

  function isFileSelectionEventType(eventType) {
    return FILE_SELECTION_EVENT_TYPES.indexOf(eventType) > -1;
  } // eslint-disable-next-line require-jsdoc


  function isFileSelectionInput(element) {
    return element.files;
  }
  /**
    Internal helper used to build and dispatch events throughout the other DOM helpers.
  
    @private
    @param {Element} element the element to dispatch the event to
    @param {string} eventType the type of event
    @param {Object} [options] additional properties to be set on the event
    @returns {Event} the event that was dispatched
  */


  function fireEvent(element, eventType, options = {}) {
    if (!element) {
      throw new Error('Must pass an element to `fireEvent`');
    }

    let event;

    if (isKeyboardEventType(eventType)) {
      event = buildKeyboardEvent(eventType, options);
    } else if (isMouseEventType(eventType)) {
      let rect;

      if (element instanceof Window && element.document.documentElement) {
        rect = element.document.documentElement.getBoundingClientRect();
      } else if ((0, _target.isDocument)(element)) {
        rect = element.documentElement.getBoundingClientRect();
      } else if ((0, _target.isElement)(element)) {
        rect = element.getBoundingClientRect();
      } else {
        return;
      }

      let x = rect.left + 1;
      let y = rect.top + 1;
      let simulatedCoordinates = {
        screenX: x + 5,
        screenY: y + 95,
        clientX: x,
        clientY: y
      };
      event = buildMouseEvent(eventType, Ember.assign(simulatedCoordinates, options));
    } else if (isFileSelectionEventType(eventType) && isFileSelectionInput(element)) {
      event = buildFileEvent(eventType, element, options);
    } else {
      event = buildBasicEvent(eventType, options);
    }

    element.dispatchEvent(event);
    return event;
  }

  var _default = fireEvent; // eslint-disable-next-line require-jsdoc

  _exports.default = _default;

  function buildBasicEvent(type, options = {}) {
    let event = document.createEvent('Events');
    let bubbles = options.bubbles !== undefined ? options.bubbles : true;
    let cancelable = options.cancelable !== undefined ? options.cancelable : true;
    delete options.bubbles;
    delete options.cancelable; // bubbles and cancelable are readonly, so they can be
    // set when initializing event

    event.initEvent(type, bubbles, cancelable);
    Ember.assign(event, options);
    return event;
  } // eslint-disable-next-line require-jsdoc


  function buildMouseEvent(type, options = {}) {
    let event;
    let eventOpts = Ember.assign({
      view: window
    }, DEFAULT_EVENT_OPTIONS, options);

    if (MOUSE_EVENT_CONSTRUCTOR) {
      event = new MouseEvent(type, eventOpts);
    } else {
      try {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent(type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
      } catch (e) {
        event = buildBasicEvent(type, options);
      }
    }

    return event;
  } // eslint-disable-next-line require-jsdoc


  function buildKeyboardEvent(type, options = {}) {
    let eventOpts = Ember.assign({}, DEFAULT_EVENT_OPTIONS, options);
    let event;
    let eventMethodName;

    try {
      event = new KeyboardEvent(type, eventOpts); // Property definitions are required for B/C for keyboard event usage
      // If this properties are not defined, when listening for key events
      // keyCode/which will be 0. Also, keyCode and which now are string
      // and if app compare it with === with integer key definitions,
      // there will be a fail.
      //
      // https://w3c.github.io/uievents/#interface-keyboardevent
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent

      Object.defineProperty(event, 'keyCode', {
        get() {
          return parseInt(eventOpts.keyCode);
        }

      });
      Object.defineProperty(event, 'which', {
        get() {
          return parseInt(eventOpts.which);
        }

      });
      return event;
    } catch (e) {// left intentionally blank
    }

    try {
      event = document.createEvent('KeyboardEvents');
      eventMethodName = 'initKeyboardEvent';
    } catch (e) {// left intentionally blank
    }

    if (!event) {
      try {
        event = document.createEvent('KeyEvents');
        eventMethodName = 'initKeyEvent';
      } catch (e) {// left intentionally blank
      }
    }

    if (event && eventMethodName) {
      event[eventMethodName](type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
    } else {
      event = buildBasicEvent(type, options);
    }

    return event;
  } // eslint-disable-next-line require-jsdoc


  function buildFileEvent(type, element, options = {}) {
    let event = buildBasicEvent(type);
    let files = options.files;

    if (Array.isArray(options)) {
      throw new Error('Please pass an object with a files array to `triggerEvent` instead of passing the `options` param as an array to.');
    }

    if (Array.isArray(files)) {
      Object.defineProperty(files, 'item', {
        value(index) {
          return typeof index === 'number' ? this[index] : null;
        },

        configurable: true
      });
      Object.defineProperty(element, 'files', {
        value: files,
        configurable: true
      });
      let elementProto = Object.getPrototypeOf(element);
      let valueProp = Object.getOwnPropertyDescriptor(elementProto, 'value');
      Object.defineProperty(element, 'value', {
        configurable: true,

        get() {
          return valueProp.get.call(element);
        },

        set(value) {
          valueProp.set.call(element, value); // We are sure that the value is empty here.
          // For a non-empty value the original setter must raise an exception.

          Object.defineProperty(element, 'files', {
            configurable: true,
            value: []
          });
        }

      });
    }

    Object.defineProperty(event, 'target', {
      value: element
    });
    return event;
  }
});
define("@ember/test-helpers/dom/focus", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/-internal/helper-hooks", "@ember/test-helpers/dom/blur"], function (_exports, _getElement, _fireEvent, _settled, _isFocusable, _utils, _logging, _helperHooks, _blur) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__focus__ = __focus__;
  _exports.default = focus;
  (0, _helperHooks.registerHook)('focus', 'start', target => {
    (0, _logging.log)('focus', target);
  });
  /**
    @private
    @param {Element} element the element to trigger events on
  */

  function __focus__(element) {
    if (!(0, _isFocusable.default)(element)) {
      throw new Error(`${element} is not focusable`);
    }

    let browserIsNotFocused = document.hasFocus && !document.hasFocus(); // fire __blur__ manually with the correct relatedTarget when the browser is not
    // already in focus and there was a previously focused element

    if (document.activeElement && document.activeElement !== element && (0, _isFocusable.default)(document.activeElement) && browserIsNotFocused) {
      (0, _blur.__blur__)(document.activeElement, element);
    } // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event


    element.focus(); // Firefox does not trigger the `focusin` event if the window
    // does not have focus. If the document does not have focus then
    // fire `focusin` event as well.

    if (browserIsNotFocused) {
      // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
      (0, _fireEvent.default)(element, 'focus', {
        bubbles: false
      });
      (0, _fireEvent.default)(element, 'focusin');
    }
  }
  /**
    Focus the specified target.
  
    Sends a number of events intending to simulate a "real" user focusing an
    element.
  
    The following events are triggered (in order):
  
    - `focus`
    - `focusin`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle focusing a given element.
  
    @public
    @param {string|Element} target the element or selector to focus
    @return {Promise<void>} resolves when the application is settled
  
    @example
    <caption>
      Emulating focusing an input using `focus`
    </caption>
  
    focus('input');
  */


  function focus(target) {
    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('focus', 'start', target)).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `focus`.');
      }

      let element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`focus('${target}')\`.`);
      }

      __focus__(element);

      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('focus', 'end', target));
  }
});
define("@ember/test-helpers/dom/get-root-element", ["exports", "@ember/test-helpers/setup-context", "@ember/test-helpers/dom/-target"], function (_exports, _setupContext, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = getRootElement;

  /**
    Get the root element of the application under test (usually `#ember-testing`)
  
    @public
    @returns {Element} the root element
  */
  function getRootElement() {
    let context = (0, _setupContext.getContext)();
    let owner = context && context.owner;

    if (!owner) {
      throw new Error('Must setup rendering context before attempting to interact with elements.');
    }

    let rootElement; // When the host app uses `setApplication` (instead of `setResolver`) the owner has
    // a `rootElement` set on it with the element or id to be used

    if (owner && owner._emberTestHelpersMockOwner === undefined) {
      rootElement = owner.rootElement;
    } else {
      rootElement = '#ember-testing';
    }

    if (rootElement instanceof Window) {
      rootElement = rootElement.document;
    }

    if ((0, _target.isElement)(rootElement) || (0, _target.isDocument)(rootElement)) {
      return rootElement;
    } else if (typeof rootElement === 'string') {
      let _rootElement = document.querySelector(rootElement);

      if (_rootElement) {
        return _rootElement;
      }

      throw new Error(`Application.rootElement (${rootElement}) not found`);
    } else {
      throw new Error('Application.rootElement must be an element or a selector string');
    }
  }
});
define("@ember/test-helpers/dom/scroll-to", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-target", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getElement, _fireEvent, _settled, _utils, _target, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = scrollTo;

  /**
    Scrolls DOM element or selector to the given coordinates.
    @public
    @param {string|HTMLElement} target the element or selector to trigger scroll on
    @param {Number} x x-coordinate
    @param {Number} y y-coordinate
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Scroll DOM element to specific coordinates
    </caption>
  
    scrollTo('#my-long-div', 0, 0); // scroll to top
    scrollTo('#my-long-div', 0, 100); // scroll down
  */
  function scrollTo(target, x, y) {
    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('scrollTo', 'start', target)).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `scrollTo`.');
      }

      if (x === undefined || y === undefined) {
        throw new Error('Must pass both x and y coordinates to `scrollTo`.');
      }

      let element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`scrollTo('${target}')\`.`);
      }

      if (!(0, _target.isElement)(element)) {
        throw new Error(`"target" must be an element, but was a ${element.nodeType} when calling \`scrollTo('${target}')\`.`);
      }

      element.scrollTop = y;
      element.scrollLeft = x;
      (0, _fireEvent.default)(element, 'scroll');
      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('scrollTo', 'end', target));
  }
});
define("@ember/test-helpers/dom/select", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-is-select-element", "@ember/test-helpers/dom/focus", "@ember/test-helpers/settled", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/-utils", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getElement, _isSelectElement, _focus, _settled, _fireEvent, _utils, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = select;

  /**
    Set the `selected` property true for the provided option the target is a
    select element (or set the select property true for multiple options if the
    multiple attribute is set true on the HTMLSelectElement) then trigger
    `change` and `input` events on the specified target.
  
    @public
    @param {string|Element} target the element or selector for the select element
    @param {string|string[]} options the value/values of the items to select
    @param {boolean} keepPreviouslySelected a flag keep any existing selections
    @return {Promise<void>} resolves when the application is settled
  
    @example
    <caption>
      Emulating selecting an option or multiple options using `select`
    </caption>
  
    select('select', 'apple');
  
    select('select', ['apple', 'orange']);
  
    select('select', ['apple', 'orange'], true);
  */
  function select(target, options, keepPreviouslySelected = false) {
    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('select', 'start', target, options, keepPreviouslySelected)).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `select`.');
      }

      if (typeof options === 'undefined' || options === null) {
        throw new Error('Must provide an `option` or `options` to select when calling `select`.');
      }

      const element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`select('${target}')\`.`);
      }

      if (!(0, _isSelectElement.default)(element)) {
        throw new Error(`Element is not a HTMLSelectElement when calling \`select('${target}')\`.`);
      }

      if (element.disabled) {
        throw new Error(`Element is disabled when calling \`select('${target}')\`.`);
      }

      options = Array.isArray(options) ? options : [options];

      if (!element.multiple && options.length > 1) {
        throw new Error(`HTMLSelectElement \`multiple\` attribute is set to \`false\` but multiple options were passed when calling \`select('${target}')\`.`);
      }

      (0, _focus.__focus__)(element);

      for (let i = 0; i < element.options.length; i++) {
        let elementOption = element.options.item(i);

        if (elementOption) {
          if (options.indexOf(elementOption.value) > -1) {
            elementOption.selected = true;
          } else if (!keepPreviouslySelected) {
            elementOption.selected = false;
          }
        }
      }

      (0, _fireEvent.default)(element, 'input');
      (0, _fireEvent.default)(element, 'change');
      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('select', 'end', target, options, keepPreviouslySelected));
  }
});
define("@ember/test-helpers/dom/tap", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/click", "@ember/test-helpers/settled", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getElement, _fireEvent, _click, _settled, _utils, _logging, _isFormControl, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = tap;
  (0, _helperHooks.registerHook)('tap', 'start', target => {
    (0, _logging.log)('tap', target);
  });
  /**
    Taps on the specified target.
  
    Sends a number of events intending to simulate a "real" user tapping on an
    element.
  
    For non-focusable elements the following events are triggered (in order):
  
    - `touchstart`
    - `touchend`
    - `mousedown`
    - `mouseup`
    - `click`
  
    For focusable (e.g. form control) elements the following events are triggered
    (in order):
  
    - `touchstart`
    - `touchend`
    - `mousedown`
    - `focus`
    - `focusin`
    - `mouseup`
    - `click`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle tapping on a given element.
  
    Use the `options` hash to change the parameters of the tap events.
  
    @public
    @param {string|Element} target the element or selector to tap on
    @param {Object} options the options to be merged into the touch events
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating tapping a button using `tap`
    </caption>
  
    tap('button');
  */

  function tap(target, options = {}) {
    return _utils.Promise.resolve().then(() => {
      return (0, _helperHooks.runHooks)('tap', 'start', target, options);
    }).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `tap`.');
      }

      let element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`tap('${target}')\`.`);
      }

      if ((0, _isFormControl.default)(element) && element.disabled) {
        throw new Error(`Can not \`tap\` disabled ${element}`);
      }

      let touchstartEv = (0, _fireEvent.default)(element, 'touchstart', options);
      let touchendEv = (0, _fireEvent.default)(element, 'touchend', options);

      if (!touchstartEv.defaultPrevented && !touchendEv.defaultPrevented) {
        (0, _click.__click__)(element, options);
      }

      return (0, _settled.default)();
    }).then(() => {
      return (0, _helperHooks.runHooks)('tap', 'end', target, options);
    });
  }
});
define("@ember/test-helpers/dom/trigger-event", ["exports", "@ember/test-helpers/dom/-get-window-or-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getWindowOrElement, _fireEvent, _settled, _utils, _logging, _isFormControl, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = triggerEvent;
  (0, _helperHooks.registerHook)('triggerEvent', 'start', (target, eventType) => {
    (0, _logging.log)('triggerEvent', target, eventType);
  });
  /**
   * Triggers an event on the specified target.
   *
   * @public
   * @param {string|Element} target the element or selector to trigger the event on
   * @param {string} eventType the type of event to trigger
   * @param {Object} options additional properties to be set on the event
   * @return {Promise<void>} resolves when the application is settled
   *
   * @example
   * <caption>
   * Using `triggerEvent` to upload a file
   *
   * When using `triggerEvent` to upload a file the `eventType` must be `change` and you must pass the
   * `options` param as an object with a key `files` containing an array of
   * [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
   * </caption>
   *
   * triggerEvent(
   *   'input.fileUpload',
   *   'change',
   *   { files: [new Blob(['Ember Rules!'])] }
   * );
   *
   *
   * @example
   * <caption>
   * Using `triggerEvent` to upload a dropped file
   *
   * When using `triggerEvent` to handle a dropped (via drag-and-drop) file, the `eventType` must be `drop`. Assuming your `drop` event handler uses the [DataTransfer API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer),
   * you must pass the `options` param as an object with a key of `dataTransfer`. The `options.dataTransfer`     object should have a `files` key, containing an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
   * </caption>
   *
   * triggerEvent(
   *   '[data-test-drop-zone]',
   *   'drop',
   *   {
   *     dataTransfer: {
   *       files: [new File(['Ember Rules!'], 'ember-rules.txt')]
   *     }
   *   }
   * )
   */

  function triggerEvent(target, eventType, options) {
    return _utils.Promise.resolve().then(() => {
      return (0, _helperHooks.runHooks)('triggerEvent', 'start', target, eventType, options);
    }).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `triggerEvent`.');
      }

      if (!eventType) {
        throw new Error(`Must provide an \`eventType\` to \`triggerEvent\``);
      }

      let element = (0, _getWindowOrElement.getWindowOrElement)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`triggerEvent('${target}', ...)\`.`);
      }

      if ((0, _isFormControl.default)(element) && element.disabled) {
        throw new Error(`Can not \`triggerEvent\` on disabled ${element}`);
      }

      (0, _fireEvent.default)(element, eventType, options);
      return (0, _settled.default)();
    }).then(() => {
      return (0, _helperHooks.runHooks)('triggerEvent', 'end', target, eventType, options);
    });
  }
});
define("@ember/test-helpers/dom/trigger-key-event", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _getElement, _fireEvent, _settled, _utils, _logging, _isFormControl, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__triggerKeyEvent__ = __triggerKeyEvent__;
  _exports.default = triggerKeyEvent;
  (0, _helperHooks.registerHook)('triggerKeyEvent', 'start', (target, eventType, key) => {
    (0, _logging.log)('triggerKeyEvent', target, eventType, key);
  });
  const DEFAULT_MODIFIERS = Object.freeze({
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false
  }); // This is not a comprehensive list, but it is better than nothing.

  const keyFromKeyCode = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'v',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Meta',
    93: 'Meta',
    187: '=',
    189: '-'
  };
  /**
    Calculates the value of KeyboardEvent#key given a keycode and the modifiers.
    Note that this works if the key is pressed in combination with the shift key, but it cannot
    detect if caps lock is enabled.
    @param {number} keycode The keycode of the event.
    @param {object} modifiers The modifiers of the event.
    @returns {string} The key string for the event.
   */

  function keyFromKeyCodeAndModifiers(keycode, modifiers) {
    if (keycode > 64 && keycode < 91) {
      if (modifiers.shiftKey) {
        return String.fromCharCode(keycode);
      } else {
        return String.fromCharCode(keycode).toLocaleLowerCase();
      }
    }

    let key = keyFromKeyCode[keycode];

    if (key) {
      return key;
    }
  }
  /**
   * Infers the keycode from the given key
   * @param {string} key The KeyboardEvent#key string
   * @returns {number} The keycode for the given key
   */


  function keyCodeFromKey(key) {
    let keys = Object.keys(keyFromKeyCode);
    let keyCode = keys.filter(keyCode => keyFromKeyCode[Number(keyCode)] === key)[0];

    if (!keyCode) {
      keyCode = keys.filter(keyCode => keyFromKeyCode[Number(keyCode)] === key.toLowerCase())[0];
    }

    return keyCode !== undefined ? parseInt(keyCode) : undefined;
  }
  /**
    @private
    @param {Element | Document} element the element to trigger the key event on
    @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
    @param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
    @param {Object} [modifiers] the state of various modifier keys
   */


  function __triggerKeyEvent__(element, eventType, key, modifiers = DEFAULT_MODIFIERS) {
    let props;

    if (typeof key === 'number') {
      props = {
        keyCode: key,
        which: key,
        key: keyFromKeyCodeAndModifiers(key, modifiers)
      };
    } else if (typeof key === 'string' && key.length !== 0) {
      let firstCharacter = key[0];

      if (firstCharacter !== firstCharacter.toUpperCase()) {
        throw new Error(`Must provide a \`key\` to \`triggerKeyEvent\` that starts with an uppercase character but you passed \`${key}\`.`);
      }

      if ((0, _utils.isNumeric)(key) && key.length > 1) {
        throw new Error(`Must provide a numeric \`keyCode\` to \`triggerKeyEvent\` but you passed \`${key}\` as a string.`);
      }

      let keyCode = keyCodeFromKey(key);
      props = {
        keyCode,
        which: keyCode,
        key
      };
    } else {
      throw new Error(`Must provide a \`key\` or \`keyCode\` to \`triggerKeyEvent\``);
    }

    let options = Ember.assign(props, modifiers);
    (0, _fireEvent.default)(element, eventType, options);
  }
  /**
    Triggers a keyboard event of given type in the target element.
    It also requires the developer to provide either a string with the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
    or the numeric [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) of the pressed key.
    Optionally the user can also provide a POJO with extra modifiers for the event.
  
    @public
    @param {string|Element} target the element or selector to trigger the event on
    @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
    @param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
    @param {Object} [modifiers] the state of various modifier keys
    @param {boolean} [modifiers.ctrlKey=false] if true the generated event will indicate the control key was pressed during the key event
    @param {boolean} [modifiers.altKey=false] if true the generated event will indicate the alt key was pressed during the key event
    @param {boolean} [modifiers.shiftKey=false] if true the generated event will indicate the shift key was pressed during the key event
    @param {boolean} [modifiers.metaKey=false] if true the generated event will indicate the meta key was pressed during the key event
    @return {Promise<void>} resolves when the application is settled unless awaitSettled is false
  
    @example
    <caption>
      Emulating pressing the `ENTER` key on a button using `triggerKeyEvent`
    </caption>
    triggerKeyEvent('button', 'keydown', 'Enter');
  */


  function triggerKeyEvent(target, eventType, key, modifiers = DEFAULT_MODIFIERS) {
    return _utils.Promise.resolve().then(() => {
      return (0, _helperHooks.runHooks)('triggerKeyEvent', 'start', target, eventType, key);
    }).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `triggerKeyEvent`.');
      }

      let element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`triggerKeyEvent('${target}', ...)\`.`);
      }

      if (!eventType) {
        throw new Error(`Must provide an \`eventType\` to \`triggerKeyEvent\``);
      }

      if (!(0, _fireEvent.isKeyboardEventType)(eventType)) {
        let validEventTypes = _fireEvent.KEYBOARD_EVENT_TYPES.join(', ');

        throw new Error(`Must provide an \`eventType\` of ${validEventTypes} to \`triggerKeyEvent\` but you passed \`${eventType}\`.`);
      }

      if ((0, _isFormControl.default)(element) && element.disabled) {
        throw new Error(`Can not \`triggerKeyEvent\` on disabled ${element}`);
      }

      __triggerKeyEvent__(element, eventType, key, modifiers);

      return (0, _settled.default)();
    }).then(() => {
      return (0, _helperHooks.runHooks)('triggerKeyEvent', 'end', target, eventType, key);
    });
  }
});
define("@ember/test-helpers/dom/type-in", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/dom/focus", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/-guard-for-maxlength", "@ember/test-helpers/dom/-target", "@ember/test-helpers/dom/trigger-key-event", "@ember/test-helpers/dom/-logging", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _utils, _settled, _getElement, _isFormControl, _focus, _fireEvent, _guardForMaxlength, _target, _triggerKeyEvent, _logging, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = typeIn;
  (0, _helperHooks.registerHook)('typeIn', 'start', (target, text) => {
    (0, _logging.log)('typeIn', target, text);
  });
  /**
   * Mimics character by character entry into the target `input` or `textarea` element.
   *
   * Allows for simulation of slow entry by passing an optional millisecond delay
   * between key events.
  
   * The major difference between `typeIn` and `fillIn` is that `typeIn` triggers
   * keyboard events as well as `input` and `change`.
   * Typically this looks like `focus` -> `focusin` -> `keydown` -> `keypress` -> `keyup` -> `input` -> `change`
   * per character of the passed text (this may vary on some browsers).
   *
   * @public
   * @param {string|Element} target the element or selector to enter text into
   * @param {string} text the test to fill the element with
   * @param {Object} options {delay: x} (default 50) number of milliseconds to wait per keypress
   * @return {Promise<void>} resolves when the application is settled
   *
   * @example
   * <caption>
   *   Emulating typing in an input using `typeIn`
   * </caption>
   *
   * typeIn('input', 'hello world');
   */

  function typeIn(target, text, options = {}) {
    return _utils.Promise.resolve().then(() => {
      return (0, _helperHooks.runHooks)('typeIn', 'start', target, text, options);
    }).then(() => {
      if (!target) {
        throw new Error('Must pass an element or selector to `typeIn`.');
      }

      const element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error(`Element not found when calling \`typeIn('${target}')\``);
      }

      if ((0, _target.isDocument)(element) || !(0, _isFormControl.default)(element) && !(0, _target.isContentEditable)(element)) {
        throw new Error('`typeIn` is only usable on form controls or contenteditable elements.');
      }

      if (typeof text === 'undefined' || text === null) {
        throw new Error('Must provide `text` when calling `typeIn`.');
      }

      if ((0, _isFormControl.default)(element)) {
        if (element.disabled) {
          throw new Error(`Can not \`typeIn\` disabled '${target}'.`);
        }

        if ('readOnly' in element && element.readOnly) {
          throw new Error(`Can not \`typeIn\` readonly '${target}'.`);
        }
      }

      (0, _focus.__focus__)(element);
      let {
        delay = 50
      } = options;
      return fillOut(element, text, delay).then(() => (0, _fireEvent.default)(element, 'change')).then(_settled.default).then(() => {
        return (0, _helperHooks.runHooks)('typeIn', 'end', target, text, options);
      });
    });
  } // eslint-disable-next-line require-jsdoc


  function fillOut(element, text, delay) {
    const inputFunctions = text.split('').map(character => keyEntry(element, character));
    return inputFunctions.reduce((currentPromise, func) => {
      return currentPromise.then(() => delayedExecute(delay)).then(func);
    }, _utils.Promise.resolve(undefined));
  } // eslint-disable-next-line require-jsdoc


  function keyEntry(element, character) {
    let shiftKey = character === character.toUpperCase() && character !== character.toLowerCase();
    let options = {
      shiftKey
    };
    let characterKey = character.toUpperCase();
    return function () {
      return _utils.Promise.resolve().then(() => (0, _triggerKeyEvent.__triggerKeyEvent__)(element, 'keydown', characterKey, options)).then(() => (0, _triggerKeyEvent.__triggerKeyEvent__)(element, 'keypress', characterKey, options)).then(() => {
        if ((0, _isFormControl.default)(element)) {
          const newValue = element.value + character;
          (0, _guardForMaxlength.default)(element, newValue, 'typeIn');
          element.value = newValue;
        } else {
          const newValue = element.innerHTML + character;
          element.innerHTML = newValue;
        }

        (0, _fireEvent.default)(element, 'input');
      }).then(() => (0, _triggerKeyEvent.__triggerKeyEvent__)(element, 'keyup', characterKey, options));
    };
  } // eslint-disable-next-line require-jsdoc


  function delayedExecute(delay) {
    return new _utils.Promise(resolve => {
      setTimeout(resolve, delay);
    });
  }
});
define("@ember/test-helpers/dom/wait-for", ["exports", "@ember/test-helpers/wait-until", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-get-elements", "@ember/test-helpers/dom/-to-array", "@ember/test-helpers/-utils"], function (_exports, _waitUntil, _getElement, _getElements, _toArray, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = waitFor;

  /**
    Used to wait for a particular selector to appear in the DOM. Due to the fact
    that it does not wait for general settledness, this is quite useful for testing
    interim DOM states (e.g. loading states, pending promises, etc).
  
    @param {string} selector the selector to wait for
    @param {Object} [options] the options to be used
    @param {number} [options.timeout=1000] the time to wait (in ms) for a match
    @param {number} [options.count=null] the number of elements that should match the provided selector (null means one or more)
    @return {Promise<Element|Element[]>} resolves when the element(s) appear on the page
  
    @example
    <caption>
      Waiting until a selector is rendered:
    </caption>
    await waitFor('.my-selector', { timeout: 2000 })
  */
  function waitFor(selector, options = {}) {
    return _utils.Promise.resolve().then(() => {
      if (!selector) {
        throw new Error('Must pass a selector to `waitFor`.');
      }

      let {
        timeout = 1000,
        count = null,
        timeoutMessage
      } = options;

      if (!timeoutMessage) {
        timeoutMessage = `waitFor timed out waiting for selector "${selector}"`;
      }

      let callback;

      if (count !== null) {
        callback = () => {
          let elements = (0, _getElements.default)(selector);

          if (elements.length === count) {
            return (0, _toArray.default)(elements);
          }

          return;
        };
      } else {
        callback = () => (0, _getElement.default)(selector);
      }

      return (0, _waitUntil.default)(callback, {
        timeout,
        timeoutMessage
      });
    });
  }
});
define("@ember/test-helpers/global", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /* globals global */
  var _default = (() => {
    if (typeof self !== 'undefined') {
      return self;
    } else if (typeof window !== 'undefined') {
      return window;
    } else if (typeof global !== 'undefined') {
      return global;
    } else {
      return Function('return this')();
    }
  })();

  _exports.default = _default;
});
define("@ember/test-helpers/has-ember-version", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = hasEmberVersion;

  /**
    Checks if the currently running Ember version is greater than or equal to the
    specified major and minor version numbers.
  
    @private
    @param {number} major the major version number to compare
    @param {number} minor the minor version number to compare
    @returns {boolean} true if the Ember version is >= MAJOR.MINOR specified, false otherwise
  */
  function hasEmberVersion(major, minor) {
    let numbers = Ember.VERSION.split('-')[0].split('.');
    let actualMajor = parseInt(numbers[0], 10);
    let actualMinor = parseInt(numbers[1], 10);
    return actualMajor > major || actualMajor === major && actualMinor >= minor;
  }
});
define("@ember/test-helpers/index", ["exports", "@ember/test-helpers/resolver", "@ember/test-helpers/application", "@ember/test-helpers/setup-context", "@ember/test-helpers/teardown-context", "@ember/test-helpers/setup-rendering-context", "@ember/test-helpers/setup-application-context", "@ember/test-helpers/settled", "@ember/test-helpers/wait-until", "@ember/test-helpers/validate-error-handler", "@ember/test-helpers/setup-onerror", "@ember/test-helpers/-internal/debug-info", "@ember/test-helpers/-internal/debug-info-helpers", "@ember/test-helpers/test-metadata", "@ember/test-helpers/-internal/helper-hooks", "@ember/test-helpers/dom/click", "@ember/test-helpers/dom/double-click", "@ember/test-helpers/dom/tap", "@ember/test-helpers/dom/focus", "@ember/test-helpers/dom/blur", "@ember/test-helpers/dom/trigger-event", "@ember/test-helpers/dom/trigger-key-event", "@ember/test-helpers/dom/fill-in", "@ember/test-helpers/dom/select", "@ember/test-helpers/dom/wait-for", "@ember/test-helpers/dom/get-root-element", "@ember/test-helpers/dom/find", "@ember/test-helpers/dom/find-all", "@ember/test-helpers/dom/type-in", "@ember/test-helpers/dom/scroll-to"], function (_exports, _resolver, _application, _setupContext, _teardownContext, _setupRenderingContext, _setupApplicationContext, _settled, _waitUntil, _validateErrorHandler, _setupOnerror, _debugInfo, _debugInfoHelpers, _testMetadata, _helperHooks, _click, _doubleClick, _tap, _focus, _blur, _triggerEvent, _triggerKeyEvent, _fillIn, _select, _waitFor, _getRootElement, _find, _findAll, _typeIn, _scrollTo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "setResolver", {
    enumerable: true,
    get: function () {
      return _resolver.setResolver;
    }
  });
  Object.defineProperty(_exports, "getResolver", {
    enumerable: true,
    get: function () {
      return _resolver.getResolver;
    }
  });
  Object.defineProperty(_exports, "getApplication", {
    enumerable: true,
    get: function () {
      return _application.getApplication;
    }
  });
  Object.defineProperty(_exports, "setApplication", {
    enumerable: true,
    get: function () {
      return _application.setApplication;
    }
  });
  Object.defineProperty(_exports, "setupContext", {
    enumerable: true,
    get: function () {
      return _setupContext.default;
    }
  });
  Object.defineProperty(_exports, "getContext", {
    enumerable: true,
    get: function () {
      return _setupContext.getContext;
    }
  });
  Object.defineProperty(_exports, "setContext", {
    enumerable: true,
    get: function () {
      return _setupContext.setContext;
    }
  });
  Object.defineProperty(_exports, "unsetContext", {
    enumerable: true,
    get: function () {
      return _setupContext.unsetContext;
    }
  });
  Object.defineProperty(_exports, "pauseTest", {
    enumerable: true,
    get: function () {
      return _setupContext.pauseTest;
    }
  });
  Object.defineProperty(_exports, "resumeTest", {
    enumerable: true,
    get: function () {
      return _setupContext.resumeTest;
    }
  });
  Object.defineProperty(_exports, "teardownContext", {
    enumerable: true,
    get: function () {
      return _teardownContext.default;
    }
  });
  Object.defineProperty(_exports, "setupRenderingContext", {
    enumerable: true,
    get: function () {
      return _setupRenderingContext.default;
    }
  });
  Object.defineProperty(_exports, "render", {
    enumerable: true,
    get: function () {
      return _setupRenderingContext.render;
    }
  });
  Object.defineProperty(_exports, "clearRender", {
    enumerable: true,
    get: function () {
      return _setupRenderingContext.clearRender;
    }
  });
  Object.defineProperty(_exports, "setupApplicationContext", {
    enumerable: true,
    get: function () {
      return _setupApplicationContext.default;
    }
  });
  Object.defineProperty(_exports, "visit", {
    enumerable: true,
    get: function () {
      return _setupApplicationContext.visit;
    }
  });
  Object.defineProperty(_exports, "currentRouteName", {
    enumerable: true,
    get: function () {
      return _setupApplicationContext.currentRouteName;
    }
  });
  Object.defineProperty(_exports, "currentURL", {
    enumerable: true,
    get: function () {
      return _setupApplicationContext.currentURL;
    }
  });
  Object.defineProperty(_exports, "settled", {
    enumerable: true,
    get: function () {
      return _settled.default;
    }
  });
  Object.defineProperty(_exports, "isSettled", {
    enumerable: true,
    get: function () {
      return _settled.isSettled;
    }
  });
  Object.defineProperty(_exports, "getSettledState", {
    enumerable: true,
    get: function () {
      return _settled.getSettledState;
    }
  });
  Object.defineProperty(_exports, "waitUntil", {
    enumerable: true,
    get: function () {
      return _waitUntil.default;
    }
  });
  Object.defineProperty(_exports, "validateErrorHandler", {
    enumerable: true,
    get: function () {
      return _validateErrorHandler.default;
    }
  });
  Object.defineProperty(_exports, "setupOnerror", {
    enumerable: true,
    get: function () {
      return _setupOnerror.default;
    }
  });
  Object.defineProperty(_exports, "resetOnerror", {
    enumerable: true,
    get: function () {
      return _setupOnerror.resetOnerror;
    }
  });
  Object.defineProperty(_exports, "getDebugInfo", {
    enumerable: true,
    get: function () {
      return _debugInfo.getDebugInfo;
    }
  });
  Object.defineProperty(_exports, "registerDebugInfoHelper", {
    enumerable: true,
    get: function () {
      return _debugInfoHelpers.default;
    }
  });
  Object.defineProperty(_exports, "getTestMetadata", {
    enumerable: true,
    get: function () {
      return _testMetadata.default;
    }
  });
  Object.defineProperty(_exports, "_registerHook", {
    enumerable: true,
    get: function () {
      return _helperHooks.registerHook;
    }
  });
  Object.defineProperty(_exports, "_runHooks", {
    enumerable: true,
    get: function () {
      return _helperHooks.runHooks;
    }
  });
  Object.defineProperty(_exports, "click", {
    enumerable: true,
    get: function () {
      return _click.default;
    }
  });
  Object.defineProperty(_exports, "doubleClick", {
    enumerable: true,
    get: function () {
      return _doubleClick.default;
    }
  });
  Object.defineProperty(_exports, "tap", {
    enumerable: true,
    get: function () {
      return _tap.default;
    }
  });
  Object.defineProperty(_exports, "focus", {
    enumerable: true,
    get: function () {
      return _focus.default;
    }
  });
  Object.defineProperty(_exports, "blur", {
    enumerable: true,
    get: function () {
      return _blur.default;
    }
  });
  Object.defineProperty(_exports, "triggerEvent", {
    enumerable: true,
    get: function () {
      return _triggerEvent.default;
    }
  });
  Object.defineProperty(_exports, "triggerKeyEvent", {
    enumerable: true,
    get: function () {
      return _triggerKeyEvent.default;
    }
  });
  Object.defineProperty(_exports, "fillIn", {
    enumerable: true,
    get: function () {
      return _fillIn.default;
    }
  });
  Object.defineProperty(_exports, "select", {
    enumerable: true,
    get: function () {
      return _select.default;
    }
  });
  Object.defineProperty(_exports, "waitFor", {
    enumerable: true,
    get: function () {
      return _waitFor.default;
    }
  });
  Object.defineProperty(_exports, "getRootElement", {
    enumerable: true,
    get: function () {
      return _getRootElement.default;
    }
  });
  Object.defineProperty(_exports, "find", {
    enumerable: true,
    get: function () {
      return _find.default;
    }
  });
  Object.defineProperty(_exports, "findAll", {
    enumerable: true,
    get: function () {
      return _findAll.default;
    }
  });
  Object.defineProperty(_exports, "typeIn", {
    enumerable: true,
    get: function () {
      return _typeIn.default;
    }
  });
  Object.defineProperty(_exports, "scrollTo", {
    enumerable: true,
    get: function () {
      return _scrollTo.default;
    }
  });
});
define("@ember/test-helpers/resolver", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setResolver = setResolver;
  _exports.getResolver = getResolver;

  let __resolver__;
  /**
    Stores the provided resolver instance so that tests being ran can resolve
    objects in the same way as a normal application.
  
    Used by `setupContext` and `setupRenderingContext` as a fallback when `setApplication` was _not_ used.
  
    @public
    @param {Ember.Resolver} resolver the resolver to be used for testing
  */


  function setResolver(resolver) {
    __resolver__ = resolver;
  }
  /**
    Retrieve the resolver instance stored by `setResolver`.
  
    @public
    @returns {Ember.Resolver} the previously stored resolver
  */


  function getResolver() {
    return __resolver__;
  }
});
define("@ember/test-helpers/settled", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/wait-until", "@ember/test-helpers/setup-application-context", "@ember/test-waiters", "@ember/test-helpers/-internal/debug-info"], function (_exports, _utils, _waitUntil, _setupApplicationContext, _testWaiters, _debugInfo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports._teardownAJAXHooks = _teardownAJAXHooks;
  _exports._setupAJAXHooks = _setupAJAXHooks;
  _exports.getSettledState = getSettledState;
  _exports.isSettled = isSettled;
  _exports.default = settled;

  // Ember internally tracks AJAX requests in the same way that we do here for
  // legacy style "acceptance" tests using the `ember-testing.js` asset provided
  // by emberjs/ember.js itself. When `@ember/test-helpers`'s `settled` utility
  // is used in a legacy acceptance test context any pending AJAX requests are
  // not properly considered during the `isSettled` check below.
  //
  // This utilizes a local utility method present in Ember since around 2.8.0 to
  // properly consider pending AJAX requests done within legacy acceptance tests.
  const _internalPendingRequests = (() => {
    let loader = Ember.__loader;

    if (loader.registry['ember-testing/test/pending_requests']) {
      // Ember <= 3.1
      return loader.require('ember-testing/test/pending_requests').pendingRequests;
    } else if (loader.registry['ember-testing/lib/test/pending_requests']) {
      // Ember >= 3.2
      return loader.require('ember-testing/lib/test/pending_requests').pendingRequests;
    }

    return () => 0;
  })();

  let requests;
  /**
    @private
    @returns {number} the count of pending requests
  */

  function pendingRequests() {
    let localRequestsPending = requests !== undefined ? requests.length : 0;

    let internalRequestsPending = _internalPendingRequests();

    return localRequestsPending + internalRequestsPending;
  }
  /**
    @private
    @param {Event} event (unused)
    @param {XMLHTTPRequest} xhr the XHR that has initiated a request
  */


  function incrementAjaxPendingRequests(event, xhr) {
    requests.push(xhr);
  }
  /**
    @private
    @param {Event} event (unused)
    @param {XMLHTTPRequest} xhr the XHR that has initiated a request
  */


  function decrementAjaxPendingRequests(event, xhr) {
    // In most Ember versions to date (current version is 2.16) RSVP promises are
    // configured to flush in the actions queue of the Ember run loop, however it
    // is possible that in the future this changes to use "true" micro-task
    // queues.
    //
    // The entire point here, is that _whenever_ promises are resolved will be
    // before the next run of the JS event loop. Then in the next event loop this
    // counter will decrement. In the specific case of AJAX, this means that any
    // promises chained off of `$.ajax` will properly have their `.then` called
    // _before_ this is decremented (and testing continues)
    (0, _utils.nextTick)(() => {
      for (let i = 0; i < requests.length; i++) {
        if (xhr === requests[i]) {
          requests.splice(i, 1);
        }
      }
    }, 0);
  }
  /**
    Clears listeners that were previously setup for `ajaxSend` and `ajaxComplete`.
  
    @private
  */


  function _teardownAJAXHooks() {
    // jQuery will not invoke `ajaxComplete` if
    //    1. `transport.send` throws synchronously and
    //    2. it has an `error` option which also throws synchronously
    // We can no longer handle any remaining requests
    requests = [];

    if (typeof jQuery === 'undefined') {
      return;
    }

    jQuery(document).off('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).off('ajaxComplete', decrementAjaxPendingRequests);
  }
  /**
    Sets up listeners for `ajaxSend` and `ajaxComplete`.
  
    @private
  */


  function _setupAJAXHooks() {
    requests = [];

    if (typeof jQuery === 'undefined') {
      return;
    }

    jQuery(document).on('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).on('ajaxComplete', decrementAjaxPendingRequests);
  }

  let _internalCheckWaiters;

  let loader = Ember.__loader;

  if (loader.registry['ember-testing/test/waiters']) {
    // Ember <= 3.1
    _internalCheckWaiters = loader.require('ember-testing/test/waiters').checkWaiters;
  } else if (loader.registry['ember-testing/lib/test/waiters']) {
    // Ember >= 3.2
    _internalCheckWaiters = loader.require('ember-testing/lib/test/waiters').checkWaiters;
  }
  /**
    @private
    @returns {boolean} true if waiters are still pending
  */


  function checkWaiters() {
    let EmberTest = Ember.Test;

    if (_internalCheckWaiters) {
      return _internalCheckWaiters();
    } else if (EmberTest.waiters) {
      if (EmberTest.waiters.some(([context, callback]) => !callback.call(context))) {
        return true;
      }
    }

    return false;
  }
  /**
    Check various settledness metrics, and return an object with the following properties:
  
    - `hasRunLoop` - Checks if a run-loop has been started. If it has, this will
      be `true` otherwise it will be `false`.
    - `hasPendingTimers` - Checks if there are scheduled timers in the run-loop.
      These pending timers are primarily registered by `Ember.run.schedule`. If
      there are pending timers, this will be `true`, otherwise `false`.
    - `hasPendingWaiters` - Checks if any registered test waiters are still
      pending (e.g. the waiter returns `true`). If there are pending waiters,
      this will be `true`, otherwise `false`.
    - `hasPendingRequests` - Checks if there are pending AJAX requests (based on
      `ajaxSend` / `ajaxComplete` events triggered by `jQuery.ajax`). If there
      are pending requests, this will be `true`, otherwise `false`.
    - `hasPendingTransitions` - Checks if there are pending route transitions. If the
      router has not been instantiated / setup for the test yet this will return `null`,
      if there are pending transitions, this will be `true`, otherwise `false`.
    - `pendingRequestCount` - The count of pending AJAX requests.
    - `debugInfo` - Debug information that's combined with info return from backburner's
      getDebugInfo method.
  
    @public
    @returns {Object} object with properties for each of the metrics used to determine settledness
  */


  function getSettledState() {
    let hasPendingTimers = Boolean(Ember.run.hasScheduledTimers());
    let hasRunLoop = Boolean(Ember.run.currentRunLoop);
    let hasPendingLegacyWaiters = checkWaiters();
    let hasPendingTestWaiters = (0, _testWaiters.hasPendingWaiters)();
    let pendingRequestCount = pendingRequests();
    let hasPendingRequests = pendingRequestCount > 0;
    return {
      hasPendingTimers,
      hasRunLoop,
      hasPendingWaiters: hasPendingLegacyWaiters || hasPendingTestWaiters,
      hasPendingRequests,
      hasPendingTransitions: (0, _setupApplicationContext.hasPendingTransitions)(),
      pendingRequestCount,
      debugInfo: new _debugInfo.TestDebugInfo({
        hasPendingTimers,
        hasRunLoop,
        hasPendingLegacyWaiters,
        hasPendingTestWaiters,
        hasPendingRequests
      })
    };
  }
  /**
    Checks various settledness metrics (via `getSettledState()`) to determine if things are settled or not.
  
    Settled generally means that there are no pending timers, no pending waiters,
    no pending AJAX requests, and no current run loop. However, new settledness
    metrics may be added and used as they become available.
  
    @public
    @returns {boolean} `true` if settled, `false` otherwise
  */


  function isSettled() {
    let {
      hasPendingTimers,
      hasRunLoop,
      hasPendingRequests,
      hasPendingWaiters,
      hasPendingTransitions
    } = getSettledState();

    if (hasPendingTimers || hasRunLoop || hasPendingRequests || hasPendingWaiters || hasPendingTransitions) {
      return false;
    }

    return true;
  }
  /**
    Returns a promise that resolves when in a settled state (see `isSettled` for
    a definition of "settled state").
  
    @public
    @returns {Promise<void>} resolves when settled
  */


  function settled() {
    return (0, _waitUntil.default)(isSettled, {
      timeout: Infinity
    }).then(() => {});
  }
});
define("@ember/test-helpers/setup-application-context", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/setup-context", "@ember/test-helpers/global", "@ember/test-helpers/has-ember-version", "@ember/test-helpers/settled", "@ember/test-helpers/test-metadata", "@ember/test-helpers/-internal/helper-hooks"], function (_exports, _utils, _setupContext, _global, _hasEmberVersion, _settled, _testMetadata, _helperHooks) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isApplicationTestContext = isApplicationTestContext;
  _exports.hasPendingTransitions = hasPendingTransitions;
  _exports.setupRouterSettlednessTracking = setupRouterSettlednessTracking;
  _exports.visit = visit;
  _exports.currentRouteName = currentRouteName;
  _exports.currentURL = currentURL;
  _exports.default = setupApplicationContext;
  const CAN_USE_ROUTER_EVENTS = (0, _hasEmberVersion.default)(3, 6);
  let routerTransitionsPending = null;
  const ROUTER = new WeakMap();
  const HAS_SETUP_ROUTER = new WeakMap(); // eslint-disable-next-line require-jsdoc

  function isApplicationTestContext(context) {
    return (0, _setupContext.isTestContext)(context);
  }
  /**
    Determines if we have any pending router transtions (used to determine `settled` state)
  
    @public
    @returns {(boolean|null)} if there are pending transitions
  */


  function hasPendingTransitions() {
    if (CAN_USE_ROUTER_EVENTS) {
      return routerTransitionsPending;
    }

    let context = (0, _setupContext.getContext)(); // there is no current context, we cannot check

    if (context === undefined) {
      return null;
    }

    let router = ROUTER.get(context);

    if (router === undefined) {
      // if there is no router (e.g. no `visit` calls made yet), we cannot
      // check for pending transitions but this is explicitly not an error
      // condition
      return null;
    }

    let routerMicrolib = router._routerMicrolib || router.router;

    if (routerMicrolib === undefined) {
      return null;
    }

    return !!routerMicrolib.activeTransition;
  }
  /**
    Setup the current router instance with settledness tracking. Generally speaking this
    is done automatically (during a `visit('/some-url')` invocation), but under some
    circumstances (e.g. a non-application test where you manually call `this.owner.setupRouter()`)
    you may want to call it yourself.
  
    @public
   */


  function setupRouterSettlednessTracking() {
    const context = (0, _setupContext.getContext)();

    if (context === undefined) {
      throw new Error('Cannot setupRouterSettlednessTracking outside of a test context');
    } // avoid setting up many times for the same context


    if (HAS_SETUP_ROUTER.get(context)) {
      return;
    }

    HAS_SETUP_ROUTER.set(context, true);
    let {
      owner
    } = context;
    let router;

    if (CAN_USE_ROUTER_EVENTS) {
      router = owner.lookup('service:router'); // track pending transitions via the public routeWillChange / routeDidChange APIs
      // routeWillChange can fire many times and is only useful to know when we have _started_
      // transitioning, we can then use routeDidChange to signal that the transition has settled

      router.on('routeWillChange', () => routerTransitionsPending = true);
      router.on('routeDidChange', () => routerTransitionsPending = false);
    } else {
      router = owner.lookup('router:main');
      ROUTER.set(context, router);
    } // hook into teardown to reset local settledness state


    let ORIGINAL_WILL_DESTROY = router.willDestroy;

    router.willDestroy = function () {
      routerTransitionsPending = null;
      return ORIGINAL_WILL_DESTROY.call(this);
    };
  }
  /**
    Navigate the application to the provided URL.
  
    @public
    @param {string} url The URL to visit (e.g. `/posts`)
    @param {object} options app boot options
    @returns {Promise<void>} resolves when settled
  */


  function visit(url, options) {
    const context = (0, _setupContext.getContext)();

    if (!context || !isApplicationTestContext(context)) {
      throw new Error('Cannot call `visit` without having first called `setupApplicationContext`.');
    }

    let {
      owner
    } = context;
    let testMetadata = (0, _testMetadata.default)(context);
    testMetadata.usedHelpers.push('visit');
    return _utils.Promise.resolve().then(() => {
      return (0, _helperHooks.runHooks)('visit', 'start', url, options);
    }).then(() => {
      let visitResult = owner.visit(url, options);
      setupRouterSettlednessTracking();
      return visitResult;
    }).then(() => {
      if (_global.default.EmberENV._APPLICATION_TEMPLATE_WRAPPER !== false) {
        context.element = document.querySelector('#ember-testing > .ember-view');
      } else {
        context.element = document.querySelector('#ember-testing');
      }
    }).then(_settled.default).then(() => {
      return (0, _helperHooks.runHooks)('visit', 'end', url, options);
    });
  }
  /**
    @public
    @returns {string} the currently active route name
  */


  function currentRouteName() {
    const context = (0, _setupContext.getContext)();

    if (!context || !isApplicationTestContext(context)) {
      throw new Error('Cannot call `currentRouteName` without having first called `setupApplicationContext`.');
    }

    let router = context.owner.lookup('router:main');
    return Ember.get(router, 'currentRouteName');
  }

  const HAS_CURRENT_URL_ON_ROUTER = (0, _hasEmberVersion.default)(2, 13);
  /**
    @public
    @returns {string} the applications current url
  */

  function currentURL() {
    const context = (0, _setupContext.getContext)();

    if (!context || !isApplicationTestContext(context)) {
      throw new Error('Cannot call `currentURL` without having first called `setupApplicationContext`.');
    }

    let router = context.owner.lookup('router:main');

    if (HAS_CURRENT_URL_ON_ROUTER) {
      return Ember.get(router, 'currentURL');
    } else {
      return Ember.get(router, 'location').getURL();
    }
  }
  /**
    Used by test framework addons to setup the provided context for working with
    an application (e.g. routing).
  
    `setupContext` must have been run on the provided context prior to calling
    `setupApplicationContext`.
  
    Sets up the basic framework used by application tests.
  
    @public
    @param {Object} context the context to setup
    @returns {Promise<Object>} resolves with the context that was setup
  */


  function setupApplicationContext(context) {
    let testMetadata = (0, _testMetadata.default)(context);
    testMetadata.setupTypes.push('setupApplicationContext');
    return _utils.Promise.resolve();
  }
});
define("@ember/test-helpers/setup-context", ["exports", "@ember/test-helpers/build-owner", "@ember/test-helpers/settled", "@ember/test-helpers/global", "@ember/test-helpers/resolver", "@ember/test-helpers/application", "@ember/test-helpers/-utils", "@ember/test-helpers/test-metadata"], function (_exports, _buildOwner, _settled, _global, _resolver, _application, _utils, _testMetadata) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isTestContext = isTestContext;
  _exports.setContext = setContext;
  _exports.getContext = getContext;
  _exports.unsetContext = unsetContext;
  _exports.pauseTest = pauseTest;
  _exports.resumeTest = resumeTest;
  _exports.default = setupContext;

  // eslint-disable-next-line require-jsdoc
  function isTestContext(context) {
    return typeof context.pauseTest === 'function' && typeof context.resumeTest === 'function';
  }

  let __test_context__;
  /**
    Stores the provided context as the "global testing context".
  
    Generally setup automatically by `setupContext`.
  
    @public
    @param {Object} context the context to use
  */


  function setContext(context) {
    __test_context__ = context;
  }
  /**
    Retrive the "global testing context" as stored by `setContext`.
  
    @public
    @returns {Object} the previously stored testing context
  */


  function getContext() {
    return __test_context__;
  }
  /**
    Clear the "global testing context".
  
    Generally invoked from `teardownContext`.
  
    @public
  */


  function unsetContext() {
    __test_context__ = undefined;
  }
  /**
   * Returns a promise to be used to pauses the current test (due to being
   * returned from the test itself).  This is useful for debugging while testing
   * or for test-driving.  It allows you to inspect the state of your application
   * at any point.
   *
   * The test framework wrapper (e.g. `ember-qunit` or `ember-mocha`) should
   * ensure that when `pauseTest()` is used, any framework specific test timeouts
   * are disabled.
   *
   * @public
   * @returns {Promise<void>} resolves _only_ when `resumeTest()` is invoked
   * @example <caption>Usage via ember-qunit</caption>
   *
   * import { setupRenderingTest } from 'ember-qunit';
   * import { render, click, pauseTest } from '@ember/test-helpers';
   *
   *
   * module('awesome-sauce', function(hooks) {
   *   setupRenderingTest(hooks);
   *
   *   test('does something awesome', async function(assert) {
   *     await render(hbs`{{awesome-sauce}}`);
   *
   *     // added here to visualize / interact with the DOM prior
   *     // to the interaction below
   *     await pauseTest();
   *
   *     click('.some-selector');
   *
   *     assert.equal(this.element.textContent, 'this sauce is awesome!');
   *   });
   * });
   */


  function pauseTest() {
    let context = getContext();

    if (!context || !isTestContext(context)) {
      throw new Error('Cannot call `pauseTest` without having first called `setupTest` or `setupRenderingTest`.');
    }

    return context.pauseTest();
  }
  /**
    Resumes a test previously paused by `await pauseTest()`.
  
    @public
  */


  function resumeTest() {
    let context = getContext();

    if (!context || !isTestContext(context)) {
      throw new Error('Cannot call `resumeTest` without having first called `setupTest` or `setupRenderingTest`.');
    }

    context.resumeTest();
  }
  /**
    @private
    @param {Object} context the test context being cleaned up
  */


  function cleanup(context) {
    (0, _settled._teardownAJAXHooks)();
    Ember.testing = false;
    unsetContext(); // this should not be required, but until https://github.com/emberjs/ember.js/pull/19106
    // lands in a 3.20 patch release

    context.owner.destroy();
  }
  /**
    Used by test framework addons to setup the provided context for testing.
  
    Responsible for:
  
    - sets the "global testing context" to the provided context (`setContext`)
    - create an owner object and set it on the provided context (e.g. `this.owner`)
    - setup `this.set`, `this.setProperties`, `this.get`, and `this.getProperties` to the provided context
    - setting up AJAX listeners
    - setting up `pauseTest` (also available as `this.pauseTest()`) and `resumeTest` helpers
  
    @public
    @param {Object} context the context to setup
    @param {Object} [options] options used to override defaults
    @param {Resolver} [options.resolver] a resolver to use for customizing normal resolution
    @returns {Promise<Object>} resolves with the context that was setup
  */


  function setupContext(context, options = {}) {
    Ember.testing = true;
    setContext(context);
    let testMetadata = (0, _testMetadata.default)(context);
    testMetadata.setupTypes.push('setupContext');
    Ember.run.backburner.DEBUG = true;

    Ember._registerDestructor(context, cleanup);

    return _utils.Promise.resolve().then(() => {
      let application = (0, _application.getApplication)();

      if (application) {
        return application.boot().then(() => {});
      }

      return;
    }).then(() => {
      let {
        resolver
      } = options; // This handles precendence, specifying a specific option of
      // resolver always trumps whatever is auto-detected, then we fallback to
      // the suite-wide registrations
      //
      // At some later time this can be extended to support specifying a custom
      // engine or application...

      if (resolver) {
        return (0, _buildOwner.default)(null, resolver);
      }

      return (0, _buildOwner.default)((0, _application.getApplication)(), (0, _resolver.getResolver)());
    }).then(owner => {
      Ember._associateDestroyableChild(context, owner);

      Object.defineProperty(context, 'owner', {
        configurable: true,
        enumerable: true,
        value: owner,
        writable: false
      });
      Object.defineProperty(context, 'set', {
        configurable: true,
        enumerable: true,

        value(key, value) {
          let ret = Ember.run(function () {
            return Ember.set(context, key, value);
          });
          return ret;
        },

        writable: false
      });
      Object.defineProperty(context, 'setProperties', {
        configurable: true,
        enumerable: true,

        value(hash) {
          let ret = Ember.run(function () {
            return Ember.setProperties(context, hash);
          });
          return ret;
        },

        writable: false
      });
      Object.defineProperty(context, 'get', {
        configurable: true,
        enumerable: true,

        value(key) {
          return Ember.get(context, key);
        },

        writable: false
      });
      Object.defineProperty(context, 'getProperties', {
        configurable: true,
        enumerable: true,

        value(...args) {
          return Ember.getProperties(context, args);
        },

        writable: false
      });
      let resume;

      context.resumeTest = function resumeTest() {
        (true && !(Boolean(resume)) && Ember.assert('Testing has not been paused. There is nothing to resume.', Boolean(resume)));
        resume();
        _global.default.resumeTest = resume = undefined;
      };

      context.pauseTest = function pauseTest() {
        console.info('Testing paused. Use `resumeTest()` to continue.'); // eslint-disable-line no-console

        return new _utils.Promise(resolve => {
          resume = resolve;
          _global.default.resumeTest = resumeTest;
        });
      };

      (0, _settled._setupAJAXHooks)();
      return context;
    });
  }
});
define("@ember/test-helpers/setup-onerror", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupOnerror;
  _exports.resetOnerror = void 0;
  const ORIGINAL_EMBER_ONERROR = Ember.onerror;
  /**
   * Sets the `Ember.onerror` function for tests. This value is intended to be reset after
   * each test to ensure correct test isolation. To reset, you should simply call `setupOnerror`
   * without an `onError` argument.
   *
   * @public
   * @param {Function} onError the onError function to be set on Ember.onerror
   *
   * @example <caption>Example implementation for `ember-qunit` or `ember-mocha`</caption>
   *
   * import { setupOnerror } from '@ember/test-helpers';
   *
   * test('Ember.onerror is stubbed properly', function(assert) {
   *   setupOnerror(function(err) {
   *     assert.ok(err);
   *   });
   * });
   */

  function setupOnerror(onError) {
    if (typeof onError !== 'function') {
      onError = ORIGINAL_EMBER_ONERROR;
    }

    Ember.onerror = onError;
  }
  /**
   * Resets `Ember.onerror` to the value it originally was at the start of the test run.
   *
   * @public
   *
   * @example
   *
   * import { resetOnerror } from '@ember/test-helpers';
   *
   * QUnit.testDone(function() {
   *   resetOnerror();
   * })
   */


  const resetOnerror = setupOnerror;
  _exports.resetOnerror = resetOnerror;
});
define("@ember/test-helpers/setup-rendering-context", ["exports", "@ember/test-helpers/global", "@ember/test-helpers/setup-context", "@ember/test-helpers/-utils", "@ember/test-helpers/settled", "@ember/test-helpers/dom/get-root-element", "@ember/test-helpers/test-metadata", "@ember/test-helpers/-internal/helper-hooks", "@ember/test-helpers/has-ember-version"], function (_exports, _global, _setupContext, _utils, _settled, _getRootElement, _testMetadata, _helperHooks, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isRenderingTestContext = isRenderingTestContext;
  _exports.render = render;
  _exports.clearRender = clearRender;
  _exports.default = setupRenderingContext;
  const OUTLET_TEMPLATE = Ember.HTMLBars.template(
  /*
    {{outlet}}
  */
  {
    "id": "GJakotF8",
    "block": "{\"symbols\":[],\"statements\":[[1,[30,[36,1],[[30,[36,0],null,null]],null]]],\"hasEval\":false,\"upvars\":[\"-outlet\",\"component\"]}",
    "moduleName": "(unknown template module)"
  });
  const EMPTY_TEMPLATE = Ember.HTMLBars.template(
  /*
    
  */
  {
    "id": "+FvXgosQ",
    "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false,\"upvars\":[]}",
    "moduleName": "(unknown template module)"
  }); // eslint-disable-next-line require-jsdoc

  function isRenderingTestContext(context) {
    return (0, _setupContext.isTestContext)(context) && typeof context.render === 'function' && typeof context.clearRender === 'function';
  }
  /**
    @private
    @param {Ember.ApplicationInstance} owner the current owner instance
    @param {string} templateFullName the fill template name
    @returns {Template} the template representing `templateFullName`
  */


  function lookupTemplate(owner, templateFullName) {
    let template = owner.lookup(templateFullName);
    if (typeof template === 'function') return template(owner);
    return template;
  }
  /**
    @private
    @param {Ember.ApplicationInstance} owner the current owner instance
    @returns {Template} a template representing {{outlet}}
  */


  function lookupOutletTemplate(owner) {
    let OutletTemplate = lookupTemplate(owner, 'template:-outlet');

    if (!OutletTemplate) {
      owner.register('template:-outlet', OUTLET_TEMPLATE);
      OutletTemplate = lookupTemplate(owner, 'template:-outlet');
    }

    return OutletTemplate;
  }

  let templateId = 0;
  /**
    Renders the provided template and appends it to the DOM.
  
    @public
    @param {CompiledTemplate} template the template to render
    @returns {Promise<void>} resolves when settled
  */

  function render(template) {
    let context = (0, _setupContext.getContext)();

    if (!template) {
      throw new Error('you must pass a template to `render()`');
    }

    return _utils.Promise.resolve().then(() => (0, _helperHooks.runHooks)('render', 'start')).then(() => {
      if (!context || !isRenderingTestContext(context)) {
        throw new Error('Cannot call `render` without having first called `setupRenderingContext`.');
      }

      let {
        owner
      } = context;
      let testMetadata = (0, _testMetadata.default)(context);
      testMetadata.usedHelpers.push('render');
      let toplevelView = owner.lookup('-top-level-view:main');
      let OutletTemplate = lookupOutletTemplate(owner);
      templateId += 1;
      let templateFullName = `template:-undertest-${templateId}`;
      owner.register(templateFullName, template);
      let outletState = {
        render: {
          owner,
          into: undefined,
          outlet: 'main',
          name: 'application',
          controller: undefined,
          ViewClass: undefined,
          template: OutletTemplate
        },
        outlets: {
          main: {
            render: {
              owner,
              into: undefined,
              outlet: 'main',
              name: 'index',
              controller: context,
              ViewClass: undefined,
              template: lookupTemplate(owner, templateFullName),
              outlets: {}
            },
            outlets: {}
          }
        }
      };
      toplevelView.setOutletState(outletState); // Ember's rendering engine is integration with the run loop so that when a run
      // loop starts, the rendering is scheduled to be done.
      //
      // Ember should be ensuring an instance on its own here (the act of
      // setting outletState should ensureInstance, since we know we need to
      // render), but on Ember < 3.23 that is not guaranteed.

      if (!(0, _hasEmberVersion.default)(3, 23)) {
        Ember.run.backburner.ensureInstance();
      } // returning settled here because the actual rendering does not happen until
      // the renderer detects it is dirty (which happens on backburner's end
      // hook), see the following implementation details:
      //
      // * [view:outlet](https://github.com/emberjs/ember.js/blob/f94a4b6aef5b41b96ef2e481f35e07608df01440/packages/ember-glimmer/lib/views/outlet.js#L129-L145) manually dirties its own tag upon `setOutletState`
      // * [backburner's custom end hook](https://github.com/emberjs/ember.js/blob/f94a4b6aef5b41b96ef2e481f35e07608df01440/packages/ember-glimmer/lib/renderer.js#L145-L159) detects that the current revision of the root is no longer the latest, and triggers a new rendering transaction


      return (0, _settled.default)();
    }).then(() => (0, _helperHooks.runHooks)('render', 'end'));
  }
  /**
    Clears any templates previously rendered. This is commonly used for
    confirming behavior that is triggered by teardown (e.g.
    `willDestroyElement`).
  
    @public
    @returns {Promise<void>} resolves when settled
  */


  function clearRender() {
    let context = (0, _setupContext.getContext)();

    if (!context || !isRenderingTestContext(context)) {
      throw new Error('Cannot call `clearRender` without having first called `setupRenderingContext`.');
    }

    return render(EMPTY_TEMPLATE);
  }
  /**
    Used by test framework addons to setup the provided context for rendering.
  
    `setupContext` must have been ran on the provided context
    prior to calling `setupRenderingContext`.
  
    Responsible for:
  
    - Setup the basic framework used for rendering by the
      `render` helper.
    - Ensuring the event dispatcher is properly setup.
    - Setting `this.element` to the root element of the testing
      container (things rendered via `render` will go _into_ this
      element).
  
    @public
    @param {Object} context the context to setup for rendering
    @returns {Promise<Object>} resolves with the context that was setup
  */


  function setupRenderingContext(context) {
    let testMetadata = (0, _testMetadata.default)(context);
    testMetadata.setupTypes.push('setupRenderingContext');
    return _utils.Promise.resolve().then(() => {
      let {
        owner
      } = context;

      let renderDeprecationWrapper = function (template) {
        (true && !(false) && Ember.deprecate('Using this.render has been deprecated, consider using `render` imported from `@ember/test-helpers`.', false, {
          id: 'ember-test-helpers.setup-rendering-context.render',
          until: '3.0.0'
        }));
        return render(template);
      };

      let clearRenderDeprecationWrapper = function () {
        (true && !(false) && Ember.deprecate('Using this.clearRender has been deprecated, consider using `clearRender` imported from `@ember/test-helpers`.', false, {
          id: 'ember-test-helpers.setup-rendering-context.clearRender',
          until: '3.0.0'
        }));
        return clearRender();
      };

      Object.defineProperty(context, 'render', {
        configurable: true,
        enumerable: true,
        value: renderDeprecationWrapper,
        writable: false
      });
      Object.defineProperty(context, 'clearRender', {
        configurable: true,
        enumerable: true,
        value: clearRenderDeprecationWrapper,
        writable: false
      }); // When the host app uses `setApplication` (instead of `setResolver`) the event dispatcher has
      // already been setup via `applicationInstance.boot()` in `./build-owner`. If using
      // `setResolver` (instead of `setApplication`) a "mock owner" is created by extending
      // `Ember._ContainerProxyMixin` and `Ember._RegistryProxyMixin` in this scenario we need to
      // manually start the event dispatcher.

      if (owner._emberTestHelpersMockOwner) {
        let dispatcher = owner.lookup('event_dispatcher:main') || Ember.EventDispatcher.create();
        dispatcher.setup({}, '#ember-testing');
      }

      let OutletView = owner.factoryFor ? owner.factoryFor('view:-outlet') : owner._lookupFactory('view:-outlet');
      let toplevelView = OutletView.create();
      owner.register('-top-level-view:main', {
        create() {
          return toplevelView;
        }

      }); // initially render a simple empty template

      return render(EMPTY_TEMPLATE).then(() => {
        Ember.run(toplevelView, 'appendTo', (0, _getRootElement.default)());
        return (0, _settled.default)();
      });
    }).then(() => {
      Object.defineProperty(context, 'element', {
        configurable: true,
        enumerable: true,
        // ensure the element is based on the wrapping toplevel view
        // Ember still wraps the main application template with a
        // normal tagged view
        //
        // In older Ember versions (2.4) the element itself is not stable,
        // and therefore we cannot update the `this.element` until after the
        // rendering is completed
        value: _global.default.EmberENV._APPLICATION_TEMPLATE_WRAPPER !== false ? (0, _getRootElement.default)().querySelector('.ember-view') : (0, _getRootElement.default)(),
        writable: false
      });
      return context;
    });
  }
});
define("@ember/test-helpers/teardown-context", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/settled"], function (_exports, _utils, _settled) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = teardownContext;

  /**
    Used by test framework addons to tear down the provided context after testing is completed.
  
    Responsible for:
  
    - un-setting the "global testing context" (`unsetContext`)
    - destroy the contexts owner object
    - remove AJAX listeners
  
    @public
    @param {Object} context the context to setup
    @param {Object} [options] options used to override defaults
    @param {boolean} [options.waitForSettled=true] should the teardown wait for `settled()`ness
    @returns {Promise<void>} resolves when settled
  */
  function teardownContext(context, options) {
    let waitForSettled = true;

    if (options !== undefined && 'waitForSettled' in options) {
      waitForSettled = options.waitForSettled;
    }

    return _utils.Promise.resolve().then(() => {
      Ember.destroy(context);
    }).finally(() => {
      if (waitForSettled) {
        return (0, _settled.default)();
      }

      return;
    });
  }
});
define("@ember/test-helpers/test-metadata", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = getTestMetadata;
  _exports.TestMetadata = void 0;

  class TestMetadata {
    constructor() {
      this.setupTypes = [];
      this.usedHelpers = [];
    }

    get isRendering() {
      return this.setupTypes.indexOf('setupRenderingContext') > -1 && this.usedHelpers.indexOf('render') > -1;
    }

    get isApplication() {
      return this.setupTypes.indexOf('setupApplicationContext') > -1;
    }

  }

  _exports.TestMetadata = TestMetadata;
  const TEST_METADATA = new WeakMap();
  /**
   * Gets the test metadata associated with the provided test context. Will create
   * a new test metadata object if one does not exist.
   *
   * @param {BaseContext} context the context to use
   * @returns {ITestMetadata} the test metadata for the provided context
   */

  function getTestMetadata(context) {
    if (!TEST_METADATA.has(context)) {
      TEST_METADATA.set(context, new TestMetadata());
    }

    return TEST_METADATA.get(context);
  }
});
define("@ember/test-helpers/validate-error-handler", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = validateErrorHandler;
  const VALID = Object.freeze({
    isValid: true,
    message: null
  });
  const INVALID = Object.freeze({
    isValid: false,
    message: 'error handler should have re-thrown the provided error'
  });
  /**
   * Validate the provided error handler to confirm that it properly re-throws
   * errors when `Ember.testing` is true.
   *
   * This is intended to be used by test framework hosts (or other libraries) to
   * ensure that `Ember.onerror` is properly configured. Without a check like
   * this, `Ember.onerror` could _easily_ swallow all errors and make it _seem_
   * like everything is just fine (and have green tests) when in reality
   * everything is on fire...
   *
   * @public
   * @param {Function} [callback=Ember.onerror] the callback to validate
   * @returns {Object} object with `isValid` and `message`
   *
   * @example <caption>Example implementation for `ember-qunit`</caption>
   *
   * import { validateErrorHandler } from '@ember/test-helpers';
   *
   * test('Ember.onerror is functioning properly', function(assert) {
   *   let result = validateErrorHandler();
   *   assert.ok(result.isValid, result.message);
   * });
   */

  function validateErrorHandler(callback = Ember.onerror) {
    if (callback === undefined || callback === null) {
      return VALID;
    }

    let error = new Error('Error handler validation error!');
    let originalEmberTesting = Ember.testing;
    Ember.testing = true;

    try {
      callback(error);
    } catch (e) {
      if (e === error) {
        return VALID;
      }
    } finally {
      Ember.testing = originalEmberTesting;
    }

    return INVALID;
  }
});
define("@ember/test-helpers/wait-until", ["exports", "@ember/test-helpers/-utils"], function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = waitUntil;
  const TIMEOUTS = [0, 1, 2, 5, 7];
  const MAX_TIMEOUT = 10;
  /**
    Wait for the provided callback to return a truthy value.
  
    This does not leverage `settled()`, and as such can be used to manage async
    while _not_ settled (e.g. "loading" or "pending" states).
  
    @public
    @param {Function} callback the callback to use for testing when waiting should stop
    @param {Object} [options] options used to override defaults
    @param {number} [options.timeout=1000] the maximum amount of time to wait
    @param {string} [options.timeoutMessage='waitUntil timed out'] the message to use in the reject on timeout
    @returns {Promise} resolves with the callback value when it returns a truthy value
  
    @example
    <caption>
      Waiting until a selected element displays text:
    </caption>
    await waitUntil(function() {
      return find('.my-selector').textContent.includes('something')
    }, { timeout: 2000 })
  */

  function waitUntil(callback, options = {}) {
    let timeout = 'timeout' in options ? options.timeout : 1000;
    let timeoutMessage = 'timeoutMessage' in options ? options.timeoutMessage : 'waitUntil timed out'; // creating this error eagerly so it has the proper invocation stack

    let waitUntilTimedOut = new Error(timeoutMessage);
    return new _utils.Promise(function (resolve, reject) {
      let time = 0; // eslint-disable-next-line require-jsdoc

      function scheduleCheck(timeoutsIndex) {
        let interval = TIMEOUTS[timeoutsIndex];

        if (interval === undefined) {
          interval = MAX_TIMEOUT;
        }

        (0, _utils.futureTick)(function () {
          time += interval;
          let value;

          try {
            value = callback();
          } catch (error) {
            reject(error);
            return;
          }

          if (value) {
            resolve(value);
          } else if (time < timeout) {
            scheduleCheck(timeoutsIndex + 1);
          } else {
            reject(waitUntilTimedOut);
            return;
          }
        }, interval);
      }

      scheduleCheck(0);
    });
  }
});
define("ember-cli-mirage/test-support/index", ["exports", "ember-cli-mirage/test-support/setup-mirage"], function (_exports, _setupMirage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "setupMirage", {
    enumerable: true,
    get: function () {
      return _setupMirage.default;
    }
  });
});
define("ember-cli-mirage/test-support/setup-mirage", ["exports", "ember-cli-mirage/start-mirage", "@ember/test-helpers"], function (_exports, _startMirage, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupMirage;

  /**
    Used to set up mirage for a test. Must be called after one of the
    `ember-qunit` `setup*Test()` methods. It starts the server and sets
    `this.server` to point to it, and shuts the server down when the test
    finishes.
  
    NOTE: the `hooks = self` is for mocha support
    @hide
  */
  function setupMirage(hooks = self) {
    hooks.beforeEach(function () {
      if (!this.owner) {
        throw new Error('You must call one of the ember-qunit setupTest(),' + ' setupRenderingTest() or setupApplicationTest() methods before' + ' calling setupMirage()');
      }

      this.server = (0, _startMirage.default)(this.owner);
    });
    hooks.afterEach(function () {
      return (0, _testHelpers.settled)().then(() => {
        if (this.server) {
          this.server.shutdown();
          delete this.server;
        }
      });
    });
  }
});
define("ember-cli-test-loader/test-support/index", ["exports"], function (_exports) {
  /* globals requirejs, require */
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.addModuleIncludeMatcher = addModuleIncludeMatcher;
  _exports.addModuleExcludeMatcher = addModuleExcludeMatcher;
  _exports.default = void 0;
  let moduleIncludeMatchers = [];
  let moduleExcludeMatchers = [];

  function addModuleIncludeMatcher(fn) {
    moduleIncludeMatchers.push(fn);
  }

  function addModuleExcludeMatcher(fn) {
    moduleExcludeMatchers.push(fn);
  }

  function checkMatchers(matchers, moduleName) {
    return matchers.some(matcher => matcher(moduleName));
  }

  class TestLoader {
    static load() {
      new TestLoader().loadModules();
    }

    constructor() {
      this._didLogMissingUnsee = false;
    }

    shouldLoadModule(moduleName) {
      return moduleName.match(/[-_]test$/);
    }

    listModules() {
      return Object.keys(requirejs.entries);
    }

    listTestModules() {
      let moduleNames = this.listModules();
      let testModules = [];
      let moduleName;

      for (let i = 0; i < moduleNames.length; i++) {
        moduleName = moduleNames[i];

        if (checkMatchers(moduleExcludeMatchers, moduleName)) {
          continue;
        }

        if (checkMatchers(moduleIncludeMatchers, moduleName) || this.shouldLoadModule(moduleName)) {
          testModules.push(moduleName);
        }
      }

      return testModules;
    }

    loadModules() {
      let testModules = this.listTestModules();
      let testModule;

      for (let i = 0; i < testModules.length; i++) {
        testModule = testModules[i];

        this.require(testModule);

        this.unsee(testModule);
      }
    }

    require(moduleName) {
      try {
        require(moduleName);
      } catch (e) {
        this.moduleLoadFailure(moduleName, e);
      }
    }

    unsee(moduleName) {
      if (typeof require.unsee === 'function') {
        require.unsee(moduleName);
      } else if (!this._didLogMissingUnsee) {
        this._didLogMissingUnsee = true;

        if (typeof console !== 'undefined') {
          console.warn('unable to require.unsee, please upgrade loader.js to >= v3.3.0');
        }
      }
    }

    moduleLoadFailure(moduleName, error) {
      console.error('Error loading: ' + moduleName, error.stack);
    }

  }

  _exports.default = TestLoader;
  ;
});
define("ember-concurrency-decorators/test-support/in-run-loop", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = inRunloop;
  _exports.next = next;

  /**
   * Ensures that each test is executed within a RunLoop
   *
   * @param {object} hooks QUnit Hooks
   */
  function inRunloop(hooks) {
    hooks.beforeEach(function () {
      Ember.run.begin();
    });
    hooks.afterEach(function () {
      Ember.run.end();
    });
  }
  /**
   * Ends the current RunLoop and starts a new one
   */


  function next() {
    Ember.run.end();
    Ember.run.begin();
  }
});
define("ember-page-title/test-support/get-page-title", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getPageTitle = getPageTitle;

  // Testem appends progress to the title...
  // and there's no way to stop this at the moment
  function getPageTitle(doc) {
    // In Fastboot context we get 2 title elements if we don't remove one from app/index.html
    // In real world applications, it is mandatory to remove <title> from app/index.html
    // We are keeping both for sake for testing browser and fastboot scenarios
    let element = [...(doc || window.document).querySelectorAll('head title')].pop();
    return element && element.innerText.trim().replace(/^\(\d+\/\d+\)/, '');
  }
});
define("ember-page-title/test-support/index", ["exports", "ember-page-title/test-support/get-page-title"], function (_exports, _getPageTitle) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "getPageTitle", {
    enumerable: true,
    get: function () {
      return _getPageTitle.getPageTitle;
    }
  });
});
define("ember-qunit/adapter", ["exports", "qunit", "@ember/test-helpers/has-ember-version"], function (_exports, QUnit, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.nonTestDoneCallback = nonTestDoneCallback;
  _exports.default = void 0;

  function unhandledRejectionAssertion(current, error) {
    let message, source;

    if (typeof error === 'object' && error !== null) {
      message = error.message;
      source = error.stack;
    } else if (typeof error === 'string') {
      message = error;
      source = 'unknown source';
    } else {
      message = 'unhandledRejection occured, but it had no message';
      source = 'unknown source';
    }

    current.assert.pushResult({
      result: false,
      actual: false,
      expected: true,
      message: message,
      source: source
    });
  }

  function nonTestDoneCallback() {}

  let Adapter = Ember.Test.Adapter.extend({
    init() {
      this.doneCallbacks = [];
      this.qunit = this.qunit || QUnit;
    },

    asyncStart() {
      let currentTest = this.qunit.config.current;
      let done = currentTest && currentTest.assert ? currentTest.assert.async() : nonTestDoneCallback;
      this.doneCallbacks.push({
        test: currentTest,
        done
      });
    },

    asyncEnd() {
      let currentTest = this.qunit.config.current;

      if (this.doneCallbacks.length === 0) {
        throw new Error('Adapter asyncEnd called when no async was expected. Please create an issue in ember-qunit.');
      }

      let {
        test,
        done
      } = this.doneCallbacks.pop(); // In future, we should explore fixing this at a different level, specifically
      // addressing the pairing of asyncStart/asyncEnd behavior in a more consistent way.

      if (test === currentTest) {
        done();
      }
    },

    // clobber default implementation of `exception` will be added back for Ember
    // < 2.17 just below...
    exception: null
  }); // Ember 2.17 and higher do not require the test adapter to have an `exception`
  // method When `exception` is not present, the unhandled rejection is
  // automatically re-thrown and will therefore hit QUnit's own global error
  // handler (therefore appropriately causing test failure)

  if (!(0, _hasEmberVersion.default)(2, 17)) {
    Adapter = Adapter.extend({
      exception(error) {
        unhandledRejectionAssertion(QUnit.config.current, error);
      }

    });
  }

  var _default = Adapter;
  _exports.default = _default;
});
define("ember-qunit/index", ["exports", "ember-qunit/adapter", "ember-qunit/test-loader", "ember-qunit/qunit-configuration", "@ember/test-helpers", "qunit", "ember-qunit/test-isolation-validation"], function (_exports, _adapter, _testLoader, _qunitConfiguration, _testHelpers, QUnit, _testIsolationValidation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setupTest = setupTest;
  _exports.setupRenderingTest = setupRenderingTest;
  _exports.setupApplicationTest = setupApplicationTest;
  _exports.setupTestContainer = setupTestContainer;
  _exports.startTests = startTests;
  _exports.setupTestAdapter = setupTestAdapter;
  _exports.setupEmberTesting = setupEmberTesting;
  _exports.setupEmberOnerrorValidation = setupEmberOnerrorValidation;
  _exports.setupResetOnerror = setupResetOnerror;
  _exports.setupTestIsolationValidation = setupTestIsolationValidation;
  _exports.start = start;
  Object.defineProperty(_exports, "QUnitAdapter", {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
  Object.defineProperty(_exports, "nonTestDoneCallback", {
    enumerable: true,
    get: function () {
      return _adapter.nonTestDoneCallback;
    }
  });
  Object.defineProperty(_exports, "loadTests", {
    enumerable: true,
    get: function () {
      return _testLoader.loadTests;
    }
  });

  /* globals Testem */
  if (typeof Testem !== 'undefined') {
    Testem.hookIntoTestFramework();
  }

  let waitForSettled = true;

  function setupTest(hooks, _options) {
    let options = _options === undefined ? {
      waitForSettled
    } : Ember.assign({
      waitForSettled
    }, _options);
    hooks.beforeEach(function (assert) {
      let testMetadata = (0, _testHelpers.getTestMetadata)(this);
      testMetadata.framework = 'qunit';
      return (0, _testHelpers.setupContext)(this, options).then(() => {
        let originalPauseTest = this.pauseTest;

        this.pauseTest = function QUnit_pauseTest() {
          assert.timeout(-1); // prevent the test from timing out
          // This is a temporary work around for
          // https://github.com/emberjs/ember-qunit/issues/496 this clears the
          // timeout that would fail the test when it hits the global testTimeout
          // value.

          clearTimeout(QUnit.config.timeout);
          return originalPauseTest.call(this);
        };
      });
    });
    hooks.afterEach(function () {
      return (0, _testHelpers.teardownContext)(this, options);
    });
  }

  function setupRenderingTest(hooks, _options) {
    let options = _options === undefined ? {
      waitForSettled
    } : Ember.assign({
      waitForSettled
    }, _options);
    setupTest(hooks, options);
    hooks.beforeEach(function () {
      return (0, _testHelpers.setupRenderingContext)(this);
    });
  }

  function setupApplicationTest(hooks, _options) {
    let options = _options === undefined ? {
      waitForSettled
    } : Ember.assign({
      waitForSettled
    }, _options);
    setupTest(hooks, options);
    hooks.beforeEach(function () {
      return (0, _testHelpers.setupApplicationContext)(this);
    });
  }
  /**
     Uses current URL configuration to setup the test container.
  
     * If `?nocontainer` is set, the test container will be hidden.
     * If `?dockcontainer`, `?fullscreencontainer` or `?devmode` are set the test
       container will be absolutely positioned.
     * If `?devmode` or `?fullscreencontainer` is set, the test container will be
       made full screen.
  
     @method setupTestContainer
   */


  function setupTestContainer() {
    let testContainer = document.getElementById('ember-testing-container');

    if (!testContainer) {
      return;
    }

    let params = QUnit.urlParams;
    let containerVisibility = params.nocontainer ? 'hidden' : 'visible';
    let containerPosition = params.dockcontainer || params.devmode || params.fullscreencontainer ? 'fixed' : 'relative';

    if (params.devmode || params.fullscreencontainer) {
      testContainer.className = ' full-screen';
    }

    testContainer.style.visibility = containerVisibility;
    testContainer.style.position = containerPosition;
    let qunitContainer = document.getElementById('qunit');

    if (params.dockcontainer) {
      qunitContainer.style.marginBottom = window.getComputedStyle(testContainer).height;
    }
  }
  /**
     Instruct QUnit to start the tests.
     @method startTests
   */


  function startTests() {
    QUnit.start();
  }
  /**
     Sets up the `Ember.Test` adapter for usage with QUnit 2.x.
  
     @method setupTestAdapter
   */


  function setupTestAdapter() {
    Ember.Test.adapter = _adapter.default.create();
  }
  /**
    Ensures that `Ember.testing` is set to `true` before each test begins
    (including `before` / `beforeEach`), and reset to `false` after each test is
    completed. This is done via `QUnit.testStart` and `QUnit.testDone`.
  
   */


  function setupEmberTesting() {
    QUnit.testStart(() => {
      Ember.testing = true;
    });
    QUnit.testDone(() => {
      Ember.testing = false;
    });
  }
  /**
    Ensures that `Ember.onerror` (if present) is properly configured to re-throw
    errors that occur while `Ember.testing` is `true`.
  */


  function setupEmberOnerrorValidation() {
    QUnit.module('ember-qunit: Ember.onerror validation', function () {
      QUnit.test('Ember.onerror is functioning properly', function (assert) {
        assert.expect(1);
        let result = (0, _testHelpers.validateErrorHandler)();
        assert.ok(result.isValid, `Ember.onerror handler with invalid testing behavior detected. An Ember.onerror handler _must_ rethrow exceptions when \`Ember.testing\` is \`true\` or the test suite is unreliable. See https://git.io/vbine for more details.`);
      });
    });
  }

  function setupResetOnerror() {
    QUnit.testDone(_testHelpers.resetOnerror);
  }

  function setupTestIsolationValidation(delay) {
    waitForSettled = false;
    Ember.run.backburner.DEBUG = true;
    QUnit.on('testStart', () => (0, _testIsolationValidation.installTestNotIsolatedHook)(delay));
  }
  /**
     @method start
     @param {Object} [options] Options to be used for enabling/disabling behaviors
     @param {Boolean} [options.loadTests] If `false` tests will not be loaded automatically.
     @param {Boolean} [options.setupTestContainer] If `false` the test container will not
     be setup based on `devmode`, `dockcontainer`, or `nocontainer` URL params.
     @param {Boolean} [options.startTests] If `false` tests will not be automatically started
     (you must run `QUnit.start()` to kick them off).
     @param {Boolean} [options.setupTestAdapter] If `false` the default Ember.Test adapter will
     not be updated.
     @param {Boolean} [options.setupEmberTesting] `false` opts out of the
     default behavior of setting `Ember.testing` to `true` before all tests and
     back to `false` after each test will.
     @param {Boolean} [options.setupEmberOnerrorValidation] If `false` validation
     of `Ember.onerror` will be disabled.
     @param {Boolean} [options.setupTestIsolationValidation] If `false` test isolation validation
     will be disabled.
     @param {Number} [options.testIsolationValidationDelay] When using
     setupTestIsolationValidation this number represents the maximum amount of
     time in milliseconds that is allowed _after_ the test is completed for all
     async to have been completed. The default value is 50.
   */


  function start(options = {}) {
    if (options.loadTests !== false) {
      (0, _testLoader.loadTests)();
    }

    if (options.setupTestContainer !== false) {
      setupTestContainer();
    }

    if (options.setupTestAdapter !== false) {
      setupTestAdapter();
    }

    if (options.setupEmberTesting !== false) {
      setupEmberTesting();
    }

    if (options.setupEmberOnerrorValidation !== false) {
      setupEmberOnerrorValidation();
    }

    if (typeof options.setupTestIsolationValidation !== 'undefined' && options.setupTestIsolationValidation !== false) {
      setupTestIsolationValidation(options.testIsolationValidationDelay);
    }

    if (options.startTests !== false) {
      startTests();
    }

    setupResetOnerror();
  }
});
define("ember-qunit/qunit-configuration", ["qunit"], function (QUnit) {
  "use strict";

  QUnit.config.autostart = false;
  QUnit.config.urlConfig.push({
    id: 'nocontainer',
    label: 'Hide container'
  });
  QUnit.config.urlConfig.push({
    id: 'nolint',
    label: 'Disable Linting'
  });
  QUnit.config.urlConfig.push({
    id: 'dockcontainer',
    label: 'Dock container'
  });
  QUnit.config.urlConfig.push({
    id: 'devmode',
    label: 'Development mode'
  });
  QUnit.config.testTimeout = QUnit.urlParams.devmode ? null : 60000; //Default Test Timeout 60 Seconds
});
define("ember-qunit/test-isolation-validation", ["exports", "qunit", "@ember/test-helpers"], function (_exports, QUnit, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.detectIfTestNotIsolated = detectIfTestNotIsolated;
  _exports.installTestNotIsolatedHook = installTestNotIsolatedHook;

  /* eslint-disable no-console */

  /**
   * Detects if a specific test isn't isolated. A test is considered
   * not isolated if it:
   *
   * - has pending timers
   * - is in a runloop
   * - has pending AJAX requests
   * - has pending test waiters
   *
   * @function detectIfTestNotIsolated
   * @param {Object} testInfo
   * @param {string} testInfo.module The name of the test module
   * @param {string} testInfo.name The test name
   */
  function detectIfTestNotIsolated(test, message = '') {
    if (!(0, _testHelpers.isSettled)()) {
      let {
        debugInfo
      } = (0, _testHelpers.getSettledState)();
      console.group(`${test.module.name}: ${test.testName}`);
      debugInfo.toConsole();
      console.groupEnd();
      test.expected++;
      test.assert.pushResult({
        result: false,
        message: `${message} \nMore information has been printed to the console. Please use that information to help in debugging.\n\n`
      });
    }
  }
  /**
   * Installs a hook to detect if a specific test isn't isolated.
   * This hook is installed by patching into the `test.finish` method,
   * which allows us to be very precise as to when the detection occurs.
   *
   * @function installTestNotIsolatedHook
   * @param {number} delay the delay delay to use when checking for isolation validation
   */


  function installTestNotIsolatedHook(delay = 50) {
    if (!(0, _testHelpers.getDebugInfo)()) {
      return;
    }

    let test = QUnit.config.current;
    let finish = test.finish;
    let pushFailure = test.pushFailure;

    test.pushFailure = function (message) {
      if (message.indexOf('Test took longer than') === 0) {
        detectIfTestNotIsolated(this, message);
      } else {
        return pushFailure.apply(this, arguments);
      }
    }; // We're hooking into `test.finish`, which utilizes internal ordering of
    // when a test's hooks are invoked. We do this mainly because we need
    // greater precision as to when to detect and subsequently report if the
    // test is isolated.
    //
    // We looked at using:
    // - `afterEach`
    //    - the ordering of when the `afterEach` is called is not easy to guarantee
    //      (ancestor `afterEach`es have to be accounted for too)
    // - `QUnit.on('testEnd')`
    //    - is executed too late; the test is already considered done so
    //      we're unable to push a new assert to fail the current test
    // - 'QUnit.done'
    //    - it detaches the failure from the actual test that failed, making it
    //      more confusing to the end user.


    test.finish = function () {
      let doFinish = () => finish.apply(this, arguments);

      if ((0, _testHelpers.isSettled)()) {
        return doFinish();
      } else {
        return (0, _testHelpers.waitUntil)(_testHelpers.isSettled, {
          timeout: delay
        }).catch(() => {// we consider that when waitUntil times out, you're in a state of
          // test isolation violation. The nature of the error is irrelevant
          // in this case, and we want to allow the error to fall through
          // to the finally, where cleanup occurs.
        }).finally(() => {
          detectIfTestNotIsolated(this, 'Test is not isolated (async execution is extending beyond the duration of the test).'); // canceling timers here isn't perfect, but is as good as we can do
          // to attempt to prevent future tests from failing due to this test's
          // leakage

          Ember.run.cancelTimers();
          return doFinish();
        });
      }
    };
  }
});
define("ember-qunit/test-loader", ["exports", "qunit", "ember-cli-test-loader/test-support/index"], function (_exports, QUnit, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.loadTests = loadTests;
  _exports.TestLoader = void 0;
  (0, _index.addModuleExcludeMatcher)(function (moduleName) {
    return QUnit.urlParams.nolint && moduleName.match(/\.(jshint|lint-test)$/);
  });
  (0, _index.addModuleIncludeMatcher)(function (moduleName) {
    return moduleName.match(/\.jshint$/);
  });
  let moduleLoadFailures = [];
  QUnit.done(function () {
    let length = moduleLoadFailures.length;

    try {
      if (length === 0) {// do nothing
      } else if (length === 1) {
        throw moduleLoadFailures[0];
      } else {
        throw new Error('\n' + moduleLoadFailures.join('\n'));
      }
    } finally {
      // ensure we release previously captured errors.
      moduleLoadFailures = [];
    }
  });

  class TestLoader extends _index.default {
    moduleLoadFailure(moduleName, error) {
      moduleLoadFailures.push(error);
      QUnit.module('TestLoader Failures');
      QUnit.test(moduleName + ': could not be loaded', function () {
        throw error;
      });
    }

  }
  /**
     Load tests following the default patterns:
  
     * The module name ends with `-test`
     * The module name ends with `.jshint`
  
     Excludes tests that match the following
     patterns when `?nolint` URL param is set:
  
     * The module name ends with `.jshint`
     * The module name ends with `-lint-test`
  
     @method loadTests
   */


  _exports.TestLoader = TestLoader;

  function loadTests() {
    new TestLoader().loadModules();
  }
});
define("ember-test-helpers/has-ember-version", ["exports", "@ember/test-helpers/has-ember-version"], function (_exports, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _hasEmberVersion.default;
    }
  });
});
define("qunit-dom/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.install = install;
  _exports.setup = setup;

  function exists(options, message) {
    var expectedCount = null;

    if (typeof options === 'string') {
      message = options;
    } else if (options) {
      expectedCount = options.count;
    }

    var elements = this.findElements();

    if (expectedCount === null) {
      var result = elements.length > 0;
      var expected = format(this.targetDescription);
      var actual = result ? expected : format(this.targetDescription, 0);

      if (!message) {
        message = expected;
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else if (typeof expectedCount === 'number') {
      var result = elements.length === expectedCount;
      var actual = format(this.targetDescription, elements.length);
      var expected = format(this.targetDescription, expectedCount);

      if (!message) {
        message = expected;
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else {
      throw new TypeError("Unexpected Parameter: " + expectedCount);
    }
  }

  function format(selector, num) {
    if (num === undefined || num === null) {
      return "Element " + selector + " exists";
    } else if (num === 0) {
      return "Element " + selector + " does not exist";
    } else if (num === 1) {
      return "Element " + selector + " exists once";
    } else if (num === 2) {
      return "Element " + selector + " exists twice";
    } else {
      return "Element " + selector + " exists " + num + " times";
    }
  } // imported from https://github.com/nathanboktae/chai-dom


  function elementToString(el) {
    if (!el) return '<not found>';
    var desc;

    if (el instanceof NodeList) {
      if (el.length === 0) {
        return 'empty NodeList';
      }

      desc = Array.prototype.slice.call(el, 0, 5).map(elementToString).join(', ');
      return el.length > 5 ? desc + "... (+" + (el.length - 5) + " more)" : desc;
    }

    if (!(el instanceof HTMLElement || el instanceof SVGElement)) {
      return String(el);
    }

    desc = el.tagName.toLowerCase();

    if (el.id) {
      desc += "#" + el.id;
    }

    if (el.className && !(el.className instanceof SVGAnimatedString)) {
      desc += "." + String(el.className).replace(/\s+/g, '.');
    }

    Array.prototype.forEach.call(el.attributes, function (attr) {
      if (attr.name !== 'class' && attr.name !== 'id') {
        desc += "[" + attr.name + (attr.value ? "=\"" + attr.value + "\"]" : ']');
      }
    });
    return desc;
  }

  function focused(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var result = document.activeElement === element;
    var actual = elementToString(document.activeElement);
    var expected = elementToString(this.target);

    if (!message) {
      message = "Element " + expected + " is focused";
    }

    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }

  function notFocused(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var result = document.activeElement !== element;
    var expected = "Element " + this.targetDescription + " is not focused";
    var actual = result ? expected : "Element " + this.targetDescription + " is focused";

    if (!message) {
      message = expected;
    }

    this.pushResult({
      result: result,
      message: message,
      actual: actual,
      expected: expected
    });
  }

  function checked(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var isChecked = element.checked === true;
    var isNotChecked = element.checked === false;
    var result = isChecked;
    var hasCheckedProp = isChecked || isNotChecked;

    if (!hasCheckedProp) {
      var ariaChecked = element.getAttribute('aria-checked');

      if (ariaChecked !== null) {
        result = ariaChecked === 'true';
      }
    }

    var actual = result ? 'checked' : 'not checked';
    var expected = 'checked';

    if (!message) {
      message = "Element " + elementToString(this.target) + " is checked";
    }

    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }

  function notChecked(message) {
    var element = this.findTargetElement();
    if (!element) return;
    var isChecked = element.checked === true;
    var isNotChecked = element.checked === false;
    var result = !isChecked;
    var hasCheckedProp = isChecked || isNotChecked;

    if (!hasCheckedProp) {
      var ariaChecked = element.getAttribute('aria-checked');

      if (ariaChecked !== null) {
        result = ariaChecked !== 'true';
      }
    }

    var actual = result ? 'not checked' : 'checked';
    var expected = 'not checked';

    if (!message) {
      message = "Element " + elementToString(this.target) + " is not checked";
    }

    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }

  function required(message) {
    var element = this.findTargetElement();
    if (!element) return;

    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }

    var result = element.required === true;
    var actual = result ? 'required' : 'not required';
    var expected = 'required';

    if (!message) {
      message = "Element " + elementToString(this.target) + " is required";
    }

    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }

  function notRequired(message) {
    var element = this.findTargetElement();
    if (!element) return;

    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }

    var result = element.required === false;
    var actual = !result ? 'required' : 'not required';
    var expected = 'not required';

    if (!message) {
      message = "Element " + elementToString(this.target) + " is not required";
    }

    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }

  function isValid(message, options) {
    if (options === void 0) {
      options = {};
    }

    var element = this.findTargetElement();
    if (!element) return;

    if (!(element instanceof HTMLFormElement || element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLButtonElement || element instanceof HTMLOutputElement || element instanceof HTMLSelectElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }

    var validity = element.reportValidity() === true;
    var result = validity === !options.inverted;
    var actual = validity ? 'valid' : 'not valid';
    var expected = options.inverted ? 'not valid' : 'valid';

    if (!message) {
      message = "Element " + elementToString(this.target) + " is " + actual;
    }

    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  } // Visible logic based on jQuery's
  // https://github.com/jquery/jquery/blob/4a2bcc27f9c3ee24b3effac0fbe1285d1ee23cc5/src/css/hiddenVisibleSelectors.js#L11-L13


  function visible(el) {
    if (el === null) return false;
    if (el.offsetWidth === 0 || el.offsetHeight === 0) return false;
    var clientRects = el.getClientRects();
    if (clientRects.length === 0) return false;

    for (var i = 0; i < clientRects.length; i++) {
      var rect = clientRects[i];
      if (rect.width !== 0 && rect.height !== 0) return true;
    }

    return false;
  }

  function isVisible(options, message) {
    var expectedCount = null;

    if (typeof options === 'string') {
      message = options;
    } else if (options) {
      expectedCount = options.count;
    }

    var elements = this.findElements().filter(visible);

    if (expectedCount === null) {
      var result = elements.length > 0;
      var expected = format$1(this.targetDescription);
      var actual = result ? expected : format$1(this.targetDescription, 0);

      if (!message) {
        message = expected;
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else if (typeof expectedCount === 'number') {
      var result = elements.length === expectedCount;
      var actual = format$1(this.targetDescription, elements.length);
      var expected = format$1(this.targetDescription, expectedCount);

      if (!message) {
        message = expected;
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
    } else {
      throw new TypeError("Unexpected Parameter: " + expectedCount);
    }
  }

  function format$1(selector, num) {
    if (num === undefined || num === null) {
      return "Element " + selector + " is visible";
    } else if (num === 0) {
      return "Element " + selector + " is not visible";
    } else if (num === 1) {
      return "Element " + selector + " is visible once";
    } else if (num === 2) {
      return "Element " + selector + " is visible twice";
    } else {
      return "Element " + selector + " is visible " + num + " times";
    }
  }

  function isDisabled(message, options) {
    if (options === void 0) {
      options = {};
    }

    var inverted = options.inverted;
    var element = this.findTargetElement();
    if (!element) return;

    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement || element instanceof HTMLButtonElement || element instanceof HTMLOptGroupElement || element instanceof HTMLOptionElement || element instanceof HTMLFieldSetElement)) {
      throw new TypeError("Unexpected Element Type: " + element.toString());
    }

    var result = element.disabled === !inverted;
    var actual = element.disabled === false ? "Element " + this.targetDescription + " is not disabled" : "Element " + this.targetDescription + " is disabled";
    var expected = inverted ? "Element " + this.targetDescription + " is not disabled" : "Element " + this.targetDescription + " is disabled";

    if (!message) {
      message = expected;
    }

    this.pushResult({
      result: result,
      actual: actual,
      expected: expected,
      message: message
    });
  }

  function matchesSelector(elements, compareSelector) {
    var failures = elements.filter(function (it) {
      return !it.matches(compareSelector);
    });
    return failures.length;
  }

  function collapseWhitespace(string) {
    return string.replace(/[\t\r\n]/g, ' ').replace(/ +/g, ' ').replace(/^ /, '').replace(/ $/, '');
  }
  /**
   * This function can be used to convert a NodeList to a regular array.
   * We should be using `Array.from()` for this, but IE11 doesn't support that :(
   *
   * @private
   */


  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  var DOMAssertions =
  /** @class */
  function () {
    function DOMAssertions(target, rootElement, testContext) {
      this.target = target;
      this.rootElement = rootElement;
      this.testContext = testContext;
    }
    /**
     * Assert an {@link HTMLElement} (or multiple) matching the `selector` exists.
     *
     * @param {object?} options
     * @param {number?} options.count
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').exists();
     * assert.dom('.choice').exists({ count: 4 });
     *
     * @see {@link #doesNotExist}
     */


    DOMAssertions.prototype.exists = function (options, message) {
      exists.call(this, options, message);
      return this;
    };
    /**
     * Assert an {@link HTMLElement} matching the `selector` does not exists.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.should-not-exist').doesNotExist();
     *
     * @see {@link #exists}
     */


    DOMAssertions.prototype.doesNotExist = function (message) {
      exists.call(this, {
        count: 0
      }, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently checked.
     *
     * Note: This also supports `aria-checked="true/false"`.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.active').isChecked();
     *
     * @see {@link #isNotChecked}
     */


    DOMAssertions.prototype.isChecked = function (message) {
      checked.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently unchecked.
     *
     * Note: This also supports `aria-checked="true/false"`.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.active').isNotChecked();
     *
     * @see {@link #isChecked}
     */


    DOMAssertions.prototype.isNotChecked = function (message) {
      notChecked.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently focused.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.email').isFocused();
     *
     * @see {@link #isNotFocused}
     */


    DOMAssertions.prototype.isFocused = function (message) {
      focused.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is not currently focused.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="password"]').isNotFocused();
     *
     * @see {@link #isFocused}
     */


    DOMAssertions.prototype.isNotFocused = function (message) {
      notFocused.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently required.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="text"]').isRequired();
     *
     * @see {@link #isNotRequired}
     */


    DOMAssertions.prototype.isRequired = function (message) {
      required.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is currently not required.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="text"]').isNotRequired();
     *
     * @see {@link #isRequired}
     */


    DOMAssertions.prototype.isNotRequired = function (message) {
      notRequired.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} passes validation
     *
     * Validity is determined by asserting that:
     *
     * - `element.reportValidity() === true`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.input').isValid();
     *
     * @see {@link #isValid}
     */


    DOMAssertions.prototype.isValid = function (message) {
      isValid.call(this, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} does not pass validation
     *
     * Validity is determined by asserting that:
     *
     * - `element.reportValidity() === true`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.input').isNotValid();
     *
     * @see {@link #isValid}
     */


    DOMAssertions.prototype.isNotValid = function (message) {
      isValid.call(this, message, {
        inverted: true
      });
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` exists and is visible.
     *
     * Visibility is determined by asserting that:
     *
     * - the element's offsetWidth and offsetHeight are non-zero
     * - any of the element's DOMRect objects have a non-zero size
     *
     * Additionally, visibility in this case means that the element is visible on the page,
     * but not necessarily in the viewport.
     *
     * @param {object?} options
     * @param {number?} options.count
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').isVisible();
     * assert.dom('.choice').isVisible({ count: 4 });
     *
     * @see {@link #isNotVisible}
     */


    DOMAssertions.prototype.isVisible = function (options, message) {
      isVisible.call(this, options, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` does not exist or is not visible on the page.
     *
     * Visibility is determined by asserting that:
     *
     * - the element's offsetWidth or offsetHeight are zero
     * - all of the element's DOMRect objects have a size of zero
     *
     * Additionally, visibility in this case means that the element is visible on the page,
     * but not necessarily in the viewport.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.foo').isNotVisible();
     *
     * @see {@link #isVisible}
     */


    DOMAssertions.prototype.isNotVisible = function (message) {
      isVisible.call(this, {
        count: 0
      }, message);
      return this;
    };
    /**
     * Assert that the {@link HTMLElement} has an attribute with the provided `name`
     * and optionally checks if the attribute `value` matches the provided text
     * or regular expression.
     *
     * @param {string} name
     * @param {string|RegExp|object?} value
     * @param {string?} message
     *
     * @example
     * assert.dom('input.password-input').hasAttribute('type', 'password');
     *
     * @see {@link #doesNotHaveAttribute}
     */


    DOMAssertions.prototype.hasAttribute = function (name, value, message) {
      var element = this.findTargetElement();
      if (!element) return this;

      if (arguments.length === 1) {
        value = {
          any: true
        };
      }

      var actualValue = element.getAttribute(name);

      if (value instanceof RegExp) {
        var result = value.test(actualValue);
        var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value matching " + value;
        var actual = actualValue === null ? "Element " + this.targetDescription + " does not have attribute \"" + name + "\"" : "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(actualValue);

        if (!message) {
          message = expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else if (value.any === true) {
        var result = actualValue !== null;
        var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\"";
        var actual = result ? expected : "Element " + this.targetDescription + " does not have attribute \"" + name + "\"";

        if (!message) {
          message = expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var result = value === actualValue;
        var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(value);
        var actual = actualValue === null ? "Element " + this.targetDescription + " does not have attribute \"" + name + "\"" : "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(actualValue);

        if (!message) {
          message = expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     * Assert that the {@link HTMLElement} has no attribute with the provided `name`.
     *
     * **Aliases:** `hasNoAttribute`, `lacksAttribute`
     *
     * @param {string} name
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasNoAttribute('disabled');
     *
     * @see {@link #hasAttribute}
     */


    DOMAssertions.prototype.doesNotHaveAttribute = function (name, message) {
      var element = this.findTargetElement();
      if (!element) return;
      var result = !element.hasAttribute(name);
      var expected = "Element " + this.targetDescription + " does not have attribute \"" + name + "\"";
      var actual = expected;

      if (!result) {
        var value = element.getAttribute(name);
        actual = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(value);
      }

      if (!message) {
        message = expected;
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };

    DOMAssertions.prototype.hasNoAttribute = function (name, message) {
      return this.doesNotHaveAttribute(name, message);
    };

    DOMAssertions.prototype.lacksAttribute = function (name, message) {
      return this.doesNotHaveAttribute(name, message);
    };
    /**
     * Assert that the {@link HTMLElement} has an ARIA attribute with the provided
     * `name` and optionally checks if the attribute `value` matches the provided
     * text or regular expression.
     *
     * @param {string} name
     * @param {string|RegExp|object?} value
     * @param {string?} message
     *
     * @example
     * assert.dom('button').hasAria('pressed', 'true');
     *
     * @see {@link #hasNoAria}
     */


    DOMAssertions.prototype.hasAria = function (name, value, message) {
      return this.hasAttribute("aria-" + name, value, message);
    };
    /**
     * Assert that the {@link HTMLElement} has no ARIA attribute with the
     * provided `name`.
     *
     * @param {string} name
     * @param {string?} message
     *
     * @example
     * assert.dom('button').doesNotHaveAria('pressed');
     *
     * @see {@link #hasAria}
     */


    DOMAssertions.prototype.doesNotHaveAria = function (name, message) {
      return this.doesNotHaveAttribute("aria-" + name, message);
    };
    /**
     * Assert that the {@link HTMLElement} has a property with the provided `name`
     * and checks if the property `value` matches the provided text or regular
     * expression.
     *
     * @param {string} name
     * @param {RegExp|any} value
     * @param {string?} message
     *
     * @example
     * assert.dom('input.password-input').hasProperty('type', 'password');
     *
     * @see {@link #doesNotHaveProperty}
     */


    DOMAssertions.prototype.hasProperty = function (name, value, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var description = this.targetDescription;
      var actualValue = element[name];

      if (value instanceof RegExp) {
        var result = value.test(String(actualValue));
        var expected = "Element " + description + " has property \"" + name + "\" with value matching " + value;
        var actual = "Element " + description + " has property \"" + name + "\" with value " + JSON.stringify(actualValue);

        if (!message) {
          message = expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var result = value === actualValue;
        var expected = "Element " + description + " has property \"" + name + "\" with value " + JSON.stringify(value);
        var actual = "Element " + description + " has property \"" + name + "\" with value " + JSON.stringify(actualValue);

        if (!message) {
          message = expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     *  Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is disabled.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.foo').isDisabled();
     *
     * @see {@link #isNotDisabled}
     */


    DOMAssertions.prototype.isDisabled = function (message) {
      isDisabled.call(this, message);
      return this;
    };
    /**
     *  Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
     * `selector` is not disabled.
     *
     * **Aliases:** `isEnabled`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('.foo').isNotDisabled();
     *
     * @see {@link #isDisabled}
     */


    DOMAssertions.prototype.isNotDisabled = function (message) {
      isDisabled.call(this, message, {
        inverted: true
      });
      return this;
    };

    DOMAssertions.prototype.isEnabled = function (message) {
      return this.isNotDisabled(message);
    };
    /**
     * Assert that the {@link HTMLElement} has the `expected` CSS class using
     * [`classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).
     *
     * `expected` can also be a regular expression, and the assertion will return
     * true if any of the element's CSS classes match.
     *
     * @param {string|RegExp} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="password"]').hasClass('secret-password-input');
     *
     * @example
     * assert.dom('input[type="password"]').hasClass(/.*password-input/);
     *
     * @see {@link #doesNotHaveClass}
     */


    DOMAssertions.prototype.hasClass = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var actual = element.classList.toString();

      if (expected instanceof RegExp) {
        var classNames = Array.prototype.slice.call(element.classList);
        var result = classNames.some(function (className) {
          return expected.test(className);
        });

        if (!message) {
          message = "Element " + this.targetDescription + " has CSS class matching " + expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var result = element.classList.contains(expected);

        if (!message) {
          message = "Element " + this.targetDescription + " has CSS class \"" + expected + "\"";
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     * Assert that the {@link HTMLElement} does not have the `expected` CSS class using
     * [`classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).
     *
     * `expected` can also be a regular expression, and the assertion will return
     * true if none of the element's CSS classes match.
     *
     * **Aliases:** `hasNoClass`, `lacksClass`
     *
     * @param {string|RegExp} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('input[type="password"]').doesNotHaveClass('username-input');
     *
     * @example
     * assert.dom('input[type="password"]').doesNotHaveClass(/username-.*-input/);
     *
     * @see {@link #hasClass}
     */


    DOMAssertions.prototype.doesNotHaveClass = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var actual = element.classList.toString();

      if (expected instanceof RegExp) {
        var classNames = Array.prototype.slice.call(element.classList);
        var result = classNames.every(function (className) {
          return !expected.test(className);
        });

        if (!message) {
          message = "Element " + this.targetDescription + " does not have CSS class matching " + expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: "not: " + expected,
          message: message
        });
      } else {
        var result = !element.classList.contains(expected);

        if (!message) {
          message = "Element " + this.targetDescription + " does not have CSS class \"" + expected + "\"";
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: "not: " + expected,
          message: message
        });
      }

      return this;
    };

    DOMAssertions.prototype.hasNoClass = function (expected, message) {
      return this.doesNotHaveClass(expected, message);
    };

    DOMAssertions.prototype.lacksClass = function (expected, message) {
      return this.doesNotHaveClass(expected, message);
    };
    /**
     * Assert that the [HTMLElement][] has the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').hasStyle({
     *   opacity: 1,
     *   display: 'block'
     * });
     *
     * @see {@link #hasClass}
     */


    DOMAssertions.prototype.hasStyle = function (expected, message) {
      return this.hasPseudoElementStyle(null, expected, message);
    };
    /**
     * Assert that the pseudo element for `selector` of the [HTMLElement][] has the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {string} selector
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').hasPseudoElementStyle(':after', {
     *   content: '";"',
     * });
     *
     * @see {@link #hasClass}
     */


    DOMAssertions.prototype.hasPseudoElementStyle = function (selector, expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var computedStyle = window.getComputedStyle(element, selector);
      var expectedProperties = Object.keys(expected);

      if (expectedProperties.length <= 0) {
        throw new TypeError("Missing style expectations. There must be at least one style property in the passed in expectation object.");
      }

      var result = expectedProperties.every(function (property) {
        return computedStyle[property] === expected[property];
      });
      var actual = {};
      expectedProperties.forEach(function (property) {
        return actual[property] = computedStyle[property];
      });

      if (!message) {
        var normalizedSelector = selector ? selector.replace(/^:{0,2}/, '::') : '';
        message = "Element " + this.targetDescription + normalizedSelector + " has style \"" + JSON.stringify(expected) + "\"";
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };
    /**
     * Assert that the [HTMLElement][] does not have the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').doesNotHaveStyle({
     *   opacity: 1,
     *   display: 'block'
     * });
     *
     * @see {@link #hasClass}
     */


    DOMAssertions.prototype.doesNotHaveStyle = function (expected, message) {
      return this.doesNotHavePseudoElementStyle(null, expected, message);
    };
    /**
     * Assert that the pseudo element for `selector` of the [HTMLElement][] does not have the `expected` style declarations using
     * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
     *
     * @param {string} selector
     * @param {object} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('.progress-bar').doesNotHavePseudoElementStyle(':after', {
     *   content: '";"',
     * });
     *
     * @see {@link #hasClass}
     */


    DOMAssertions.prototype.doesNotHavePseudoElementStyle = function (selector, expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var computedStyle = window.getComputedStyle(element, selector);
      var expectedProperties = Object.keys(expected);

      if (expectedProperties.length <= 0) {
        throw new TypeError("Missing style expectations. There must be at least one style property in the passed in expectation object.");
      }

      var result = expectedProperties.some(function (property) {
        return computedStyle[property] !== expected[property];
      });
      var actual = {};
      expectedProperties.forEach(function (property) {
        return actual[property] = computedStyle[property];
      });

      if (!message) {
        var normalizedSelector = selector ? selector.replace(/^:{0,2}/, '::') : '';
        message = "Element " + this.targetDescription + normalizedSelector + " does not have style \"" + JSON.stringify(expected) + "\"";
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };
    /**
     * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` matches the `expected` text, using the
     * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
     * attribute and stripping/collapsing whitespace.
     *
     * `expected` can also be a regular expression.
     *
     * > Note: This assertion will collapse whitespace if the type you pass in is a string.
     * > If you are testing specifically for whitespace integrity, pass your expected text
     * > in as a RegEx pattern.
     *
     * **Aliases:** `matchesText`
     *
     * @param {string|RegExp} expected
     * @param {string?} message
     *
     * @example
     * // <h2 id="title">
     * //   Welcome to <b>QUnit</b>
     * // </h2>
     *
     * assert.dom('#title').hasText('Welcome to QUnit');
     *
     * @example
     * assert.dom('.foo').hasText(/[12]\d{3}/);
     *
     * @see {@link #includesText}
     */


    DOMAssertions.prototype.hasText = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;

      if (expected instanceof RegExp) {
        var result = expected.test(element.textContent);
        var actual = element.textContent;

        if (!message) {
          message = "Element " + this.targetDescription + " has text matching " + expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else if (expected.any === true) {
        var result = Boolean(element.textContent);
        var expected_1 = "Element " + this.targetDescription + " has a text";
        var actual = result ? expected_1 : "Element " + this.targetDescription + " has no text";

        if (!message) {
          message = expected_1;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected_1,
          message: message
        });
      } else if (typeof expected === 'string') {
        expected = collapseWhitespace(expected);
        var actual = collapseWhitespace(element.textContent);
        var result = actual === expected;

        if (!message) {
          message = "Element " + this.targetDescription + " has text \"" + expected + "\"";
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        throw new TypeError("You must pass a string or Regular Expression to \"hasText\". You passed " + expected + ".");
      }

      return this;
    };

    DOMAssertions.prototype.matchesText = function (expected, message) {
      return this.hasText(expected, message);
    };
    /**
     * Assert that the `textContent` property of an {@link HTMLElement} is not empty.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('button.share').hasAnyText();
     *
     * @see {@link #hasText}
     */


    DOMAssertions.prototype.hasAnyText = function (message) {
      return this.hasText({
        any: true
      }, message);
    };
    /**
     * Assert that the `textContent` property of an {@link HTMLElement} is empty.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('div').hasNoText();
     *
     * @see {@link #hasNoText}
     */


    DOMAssertions.prototype.hasNoText = function (message) {
      return this.hasText('', message);
    };
    /**
     * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` contains the given `text`, using the
     * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
     * attribute.
     *
     * > Note: This assertion will collapse whitespace in `textContent` before searching.
     * > If you would like to assert on a string that *should* contain line breaks, tabs,
     * > more than one space in a row, or starting/ending whitespace, use the {@link #hasText}
     * > selector and pass your expected text in as a RegEx pattern.
     *
     * **Aliases:** `containsText`, `hasTextContaining`
     *
     * @param {string} text
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').includesText('Welcome');
     *
     * @see {@link #hasText}
     */


    DOMAssertions.prototype.includesText = function (text, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var collapsedText = collapseWhitespace(element.textContent);
      var result = collapsedText.indexOf(text) !== -1;
      var actual = collapsedText;
      var expected = text;

      if (!message) {
        message = "Element " + this.targetDescription + " has text containing \"" + text + "\"";
      }

      if (!result && text !== collapseWhitespace(text)) {
        console.warn('The `.includesText()`, `.containsText()`, and `.hasTextContaining()` assertions collapse whitespace. The text you are checking for contains whitespace that may have made your test fail incorrectly. Try the `.hasText()` assertion passing in your expected text as a RegExp pattern. Your text:\n' + text);
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };

    DOMAssertions.prototype.containsText = function (expected, message) {
      return this.includesText(expected, message);
    };

    DOMAssertions.prototype.hasTextContaining = function (expected, message) {
      return this.includesText(expected, message);
    };
    /**
     * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` does not include the given `text`, using the
     * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
     * attribute.
     *
     * **Aliases:** `doesNotContainText`, `doesNotHaveTextContaining`
     *
     * @param {string} text
     * @param {string?} message
     *
     * @example
     * assert.dom('#title').doesNotIncludeText('Welcome');
     */


    DOMAssertions.prototype.doesNotIncludeText = function (text, message) {
      var element = this.findTargetElement();
      if (!element) return this;
      var collapsedText = collapseWhitespace(element.textContent);
      var result = collapsedText.indexOf(text) === -1;
      var expected = "Element " + this.targetDescription + " does not include text \"" + text + "\"";
      var actual = expected;

      if (!result) {
        actual = "Element " + this.targetDescription + " includes text \"" + text + "\"";
      }

      if (!message) {
        message = expected;
      }

      this.pushResult({
        result: result,
        actual: actual,
        expected: expected,
        message: message
      });
      return this;
    };

    DOMAssertions.prototype.doesNotContainText = function (unexpected, message) {
      return this.doesNotIncludeText(unexpected, message);
    };

    DOMAssertions.prototype.doesNotHaveTextContaining = function (unexpected, message) {
      return this.doesNotIncludeText(unexpected, message);
    };
    /**
     * Assert that the `value` property of an {@link HTMLInputElement} matches
     * the `expected` text or regular expression.
     *
     * If no `expected` value is provided, the assertion will fail if the
     * `value` is an empty string.
     *
     * @param {string|RegExp|object?} expected
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasValue('HSimpson');
        * @see {@link #hasAnyValue}
     * @see {@link #hasNoValue}
     */


    DOMAssertions.prototype.hasValue = function (expected, message) {
      var element = this.findTargetElement();
      if (!element) return this;

      if (arguments.length === 0) {
        expected = {
          any: true
        };
      }

      var value = element.value;

      if (expected instanceof RegExp) {
        var result = expected.test(value);
        var actual = value;

        if (!message) {
          message = "Element " + this.targetDescription + " has value matching " + expected;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      } else if (expected.any === true) {
        var result = Boolean(value);
        var expected_2 = "Element " + this.targetDescription + " has a value";
        var actual = result ? expected_2 : "Element " + this.targetDescription + " has no value";

        if (!message) {
          message = expected_2;
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected_2,
          message: message
        });
      } else {
        var actual = value;
        var result = actual === expected;

        if (!message) {
          message = "Element " + this.targetDescription + " has value \"" + expected + "\"";
        }

        this.pushResult({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     * Assert that the `value` property of an {@link HTMLInputElement} is not empty.
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasAnyValue();
     *
     * @see {@link #hasValue}
     * @see {@link #hasNoValue}
     */


    DOMAssertions.prototype.hasAnyValue = function (message) {
      return this.hasValue({
        any: true
      }, message);
    };
    /**
     * Assert that the `value` property of an {@link HTMLInputElement} is empty.
     *
     * **Aliases:** `lacksValue`
     *
     * @param {string?} message
     *
     * @example
     * assert.dom('input.username').hasNoValue();
     *
     * @see {@link #hasValue}
     * @see {@link #hasAnyValue}
     */


    DOMAssertions.prototype.hasNoValue = function (message) {
      return this.hasValue('', message);
    };

    DOMAssertions.prototype.lacksValue = function (message) {
      return this.hasNoValue(message);
    };
    /**
     * Assert that the target selector selects only Elements that are also selected by
     * compareSelector.
     *
     * @param {string} compareSelector
     * @param {string?} message
     *
     * @example
     * assert.dom('p.red').matchesSelector('div.wrapper p:last-child')
     */


    DOMAssertions.prototype.matchesSelector = function (compareSelector, message) {
      var targetElements = this.target instanceof Element ? [this.target] : this.findElements();
      var targets = targetElements.length;
      var matchFailures = matchesSelector(targetElements, compareSelector);
      var singleElement = targets === 1;
      var selectedByPart = this.target instanceof Element ? 'passed' : "selected by " + this.target;
      var actual;
      var expected;

      if (matchFailures === 0) {
        // no failures matching.
        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " also matches the selector " + compareSelector + "." : targets + " elements, selected by " + this.target + ", also match the selector " + compareSelector + ".";
        }

        actual = expected = message;
        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var difference = targets - matchFailures; // there were failures when matching.

        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " did not also match the selector " + compareSelector + "." : matchFailures + " out of " + targets + " elements selected by " + this.target + " did not also match the selector " + compareSelector + ".";
        }

        actual = singleElement ? message : difference + " elements matched " + compareSelector + ".";
        expected = singleElement ? "The element should have matched " + compareSelector + "." : targets + " elements should have matched " + compareSelector + ".";
        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     * Assert that the target selector selects only Elements that are not also selected by
     * compareSelector.
     *
     * @param {string} compareSelector
     * @param {string?} message
     *
     * @example
     * assert.dom('input').doesNotMatchSelector('input[disabled]')
     */


    DOMAssertions.prototype.doesNotMatchSelector = function (compareSelector, message) {
      var targetElements = this.target instanceof Element ? [this.target] : this.findElements();
      var targets = targetElements.length;
      var matchFailures = matchesSelector(targetElements, compareSelector);
      var singleElement = targets === 1;
      var selectedByPart = this.target instanceof Element ? 'passed' : "selected by " + this.target;
      var actual;
      var expected;

      if (matchFailures === targets) {
        // the assertion is successful because no element matched the other selector.
        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " did not also match the selector " + compareSelector + "." : targets + " elements, selected by " + this.target + ", did not also match the selector " + compareSelector + ".";
        }

        actual = expected = message;
        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        var difference = targets - matchFailures; // the assertion fails because at least one element matched the other selector.

        if (!message) {
          message = singleElement ? "The element " + selectedByPart + " must not also match the selector " + compareSelector + "." : difference + " elements out of " + targets + ", selected by " + this.target + ", must not also match the selector " + compareSelector + ".";
        }

        actual = singleElement ? "The element " + selectedByPart + " matched " + compareSelector + "." : matchFailures + " elements did not match " + compareSelector + ".";
        expected = singleElement ? message : targets + " elements should not have matched " + compareSelector + ".";
        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     * Assert that the tagName of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` matches the `expected` tagName, using the
     * [`tagName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)
     * property of the {@link HTMLElement}.
     *
     * @param {string} expected
     * @param {string?} message
     *
     * @example
     * // <h1 id="title">
     * //   Title
     * // </h1>
     *
     * assert.dom('#title').hasTagName('h1');
     */


    DOMAssertions.prototype.hasTagName = function (tagName, message) {
      var element = this.findTargetElement();
      var actual;
      var expected;
      if (!element) return this;

      if (typeof tagName !== 'string') {
        throw new TypeError("You must pass a string to \"hasTagName\". You passed " + tagName + ".");
      }

      actual = element.tagName.toLowerCase();
      expected = tagName.toLowerCase();

      if (actual === expected) {
        if (!message) {
          message = "Element " + this.targetDescription + " has tagName " + expected;
        }

        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        if (!message) {
          message = "Element " + this.targetDescription + " does not have tagName " + expected;
        }

        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     * Assert that the tagName of the {@link HTMLElement} or an {@link HTMLElement}
     * matching the `selector` does not match the `expected` tagName, using the
     * [`tagName`](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)
     * property of the {@link HTMLElement}.
     *
     * @param {string} expected
     * @param {string?} message
     *
     * @example
     * // <section id="block">
     * //   Title
     * // </section>
     *
     * assert.dom('section#block').doesNotHaveTagName('div');
     */


    DOMAssertions.prototype.doesNotHaveTagName = function (tagName, message) {
      var element = this.findTargetElement();
      var actual;
      var expected;
      if (!element) return this;

      if (typeof tagName !== 'string') {
        throw new TypeError("You must pass a string to \"doesNotHaveTagName\". You passed " + tagName + ".");
      }

      actual = element.tagName.toLowerCase();
      expected = tagName.toLowerCase();

      if (actual !== expected) {
        if (!message) {
          message = "Element " + this.targetDescription + " does not have tagName " + expected;
        }

        this.pushResult({
          result: true,
          actual: actual,
          expected: expected,
          message: message
        });
      } else {
        if (!message) {
          message = "Element " + this.targetDescription + " has tagName " + expected;
        }

        this.pushResult({
          result: false,
          actual: actual,
          expected: expected,
          message: message
        });
      }

      return this;
    };
    /**
     * @private
     */


    DOMAssertions.prototype.pushResult = function (result) {
      this.testContext.pushResult(result);
    };
    /**
     * Finds a valid HTMLElement from target, or pushes a failing assertion if a valid
     * element is not found.
     * @private
     * @returns (HTMLElement|null) a valid HTMLElement, or null
     */


    DOMAssertions.prototype.findTargetElement = function () {
      var el = this.findElement();

      if (el === null) {
        var message = "Element " + (this.target || '<unknown>') + " should exist";
        this.pushResult({
          message: message,
          result: false,
          actual: undefined,
          expected: undefined
        });
        return null;
      }

      return el;
    };
    /**
     * Finds a valid HTMLElement from target
     * @private
     * @returns (HTMLElement|null) a valid HTMLElement, or null
     * @throws TypeError will be thrown if target is an unrecognized type
     */


    DOMAssertions.prototype.findElement = function () {
      if (this.target === null) {
        return null;
      } else if (typeof this.target === 'string') {
        return this.rootElement.querySelector(this.target);
      } else if (this.target instanceof Element) {
        return this.target;
      } else {
        throw new TypeError("Unexpected Parameter: " + this.target);
      }
    };
    /**
     * Finds a collection of Element instances from target using querySelectorAll
     * @private
     * @returns (Element[]) an array of Element instances
     * @throws TypeError will be thrown if target is an unrecognized type
     */


    DOMAssertions.prototype.findElements = function () {
      if (this.target === null) {
        return [];
      } else if (typeof this.target === 'string') {
        return toArray(this.rootElement.querySelectorAll(this.target));
      } else if (this.target instanceof Element) {
        return [this.target];
      } else {
        throw new TypeError("Unexpected Parameter: " + this.target);
      }
    };

    Object.defineProperty(DOMAssertions.prototype, "targetDescription", {
      /**
       * @private
       */
      get: function () {
        return elementToString(this.target);
      },
      enumerable: false,
      configurable: true
    });
    return DOMAssertions;
  }();

  var _getRootElement = function () {
    return null;
  };

  function overrideRootElement(fn) {
    _getRootElement = fn;
  }

  function getRootElement() {
    return _getRootElement();
  }

  function install(assert) {
    assert.dom = function (target, rootElement) {
      if (!isValidRootElement(rootElement)) {
        throw new Error(rootElement + " is not a valid root element");
      }

      rootElement = rootElement || this.dom.rootElement || getRootElement();

      if (arguments.length === 0) {
        target = rootElement instanceof Element ? rootElement : null;
      }

      return new DOMAssertions(target, rootElement, this);
    };

    function isValidRootElement(element) {
      return !element || typeof element === 'object' && typeof element.querySelector === 'function' && typeof element.querySelectorAll === 'function';
    }
  }

  function setup(assert, options) {
    if (options === void 0) {
      options = {};
    }

    install(assert);
    var getRootElement = typeof options.getRootElement === 'function' ? options.getRootElement : function () {
      return document.querySelector('#ember-testing');
    };
    overrideRootElement(getRootElement);
  }
});
/*
  used to determine if the application should be booted immediately when `app-name.js` is evaluated
  when `runningTests` the `app-name.js` file will **not** import the applications `app/app.js` and
  call `Application.create(...)` on it. Additionally, applications can opt-out of this behavior by
  setting `autoRun` to `false` in their `ember-cli-build.js`
*/
runningTests = true;

/*
  This file overrides a file built into ember-cli's build pipeline and prevents
  this built-in `Testem.hookIntoTestFramework` invocation:

  https://github.com/ember-cli/ember-cli/blob/v3.20.0/lib/broccoli/test-support-suffix.js#L3-L5
*/
;
var __ember_auto_import__ =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"tests": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp_ember_auto_import_"] = window["webpackJsonp_ember_auto_import_"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([1,"vendors~app~tests","vendors~tests"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/l.js":
/*!******************************************************************!*\
  !*** /tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/l.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nwindow._eai_r = require;\nwindow._eai_d = define;\n\n\n//# sourceURL=webpack://__ember_auto_import__//tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/l.js?");

/***/ }),

/***/ "../../../tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/tests.js":
/*!**********************************************************************!*\
  !*** /tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/tests.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nif (typeof document !== 'undefined') {\n  __webpack_require__.p = (function(){\n    var scripts = document.querySelectorAll('script');\n    return scripts[scripts.length - 1].src.replace(/\\/[^/]*$/, '/');\n  })();\n}\n\nmodule.exports = (function(){\n  var d = _eai_d;\n  var r = _eai_r;\n  window.emberAutoImportDynamic = function(specifier) {\n    if (arguments.length === 1) {\n      return r('_eai_dyn_' + specifier);\n    } else {\n      return r('_eai_dynt_' + specifier)(Array.prototype.slice.call(arguments, 1))\n    }\n  };\n    d('es6-promise', [], function() { return __webpack_require__(/*! ./node_modules/es6-promise/dist/es6-promise.js */ \"./node_modules/es6-promise/dist/es6-promise.js\"); });\n    d('qunit', [], function() { return __webpack_require__(/*! ./node_modules/qunit/qunit/qunit.js */ \"./node_modules/qunit/qunit/qunit.js\"); });\n    d('sinon', [], function() { return __webpack_require__(/*! ./node_modules/sinon/lib/sinon.js */ \"./node_modules/sinon/lib/sinon.js\"); });\n})();\n\n\n//# sourceURL=webpack://__ember_auto_import__//tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/tests.js?");

/***/ }),

/***/ 1:
/*!***************************************************************************************************************************************!*\
  !*** multi /tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/l.js /tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/tests.js ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/l.js */\"../../../tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/l.js\");\nmodule.exports = __webpack_require__(/*! /tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/tests.js */\"../../../tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/tests.js\");\n\n\n//# sourceURL=webpack://__ember_auto_import__/multi_/tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/l.js_/tmp/broccoli-7IwW0QPAS7Q08/cache-310-bundler/staging/tests.js?");

/***/ })

/******/ });;
(window["webpackJsonp_ember_auto_import_"] = window["webpackJsonp_ember_auto_import_"] || []).push([["vendors~app~tests"],{

/***/ "./node_modules/lodash.get/index.js":
/*!******************************************!*\
  !*** ./node_modules/lodash.get/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * lodash (Custom Build) <https://lodash.com/>\n * Build: `lodash modularize exports=\"npm\" -o ./`\n * Copyright jQuery Foundation and other contributors <https://jquery.org/>\n * Released under MIT license <https://lodash.com/license>\n * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>\n * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n */\n\n/** Used as the `TypeError` message for \"Functions\" methods. */\nvar FUNC_ERROR_TEXT = 'Expected a function';\n/** Used to stand-in for `undefined` hash values. */\n\nvar HASH_UNDEFINED = '__lodash_hash_undefined__';\n/** Used as references for various `Number` constants. */\n\nvar INFINITY = 1 / 0;\n/** `Object#toString` result references. */\n\nvar funcTag = '[object Function]',\n    genTag = '[object GeneratorFunction]',\n    symbolTag = '[object Symbol]';\n/** Used to match property names within property paths. */\n\nvar reIsDeepProp = /\\.|\\[(?:[^[\\]]*|([\"'])(?:(?!\\1)[^\\\\]|\\\\.)*?\\1)\\]/,\n    reIsPlainProp = /^\\w*$/,\n    reLeadingDot = /^\\./,\n    rePropName = /[^.[\\]]+|\\[(?:(-?\\d+(?:\\.\\d+)?)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))/g;\n/**\n * Used to match `RegExp`\n * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).\n */\n\nvar reRegExpChar = /[\\\\^$.*+?()[\\]{}|]/g;\n/** Used to match backslashes in property paths. */\n\nvar reEscapeChar = /\\\\(\\\\)?/g;\n/** Used to detect host constructors (Safari). */\n\nvar reIsHostCtor = /^\\[object .+?Constructor\\]$/;\n/** Detect free variable `global` from Node.js. */\n\nvar freeGlobal = typeof global == 'object' && global && global.Object === Object && global;\n/** Detect free variable `self`. */\n\nvar freeSelf = typeof self == 'object' && self && self.Object === Object && self;\n/** Used as a reference to the global object. */\n\nvar root = freeGlobal || freeSelf || Function('return this')();\n/**\n * Gets the value at `key` of `object`.\n *\n * @private\n * @param {Object} [object] The object to query.\n * @param {string} key The key of the property to get.\n * @returns {*} Returns the property value.\n */\n\nfunction getValue(object, key) {\n  return object == null ? undefined : object[key];\n}\n/**\n * Checks if `value` is a host object in IE < 9.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a host object, else `false`.\n */\n\n\nfunction isHostObject(value) {\n  // Many host objects are `Object` objects that can coerce to strings\n  // despite having improperly defined `toString` methods.\n  var result = false;\n\n  if (value != null && typeof value.toString != 'function') {\n    try {\n      result = !!(value + '');\n    } catch (e) {}\n  }\n\n  return result;\n}\n/** Used for built-in method references. */\n\n\nvar arrayProto = Array.prototype,\n    funcProto = Function.prototype,\n    objectProto = Object.prototype;\n/** Used to detect overreaching core-js shims. */\n\nvar coreJsData = root['__core-js_shared__'];\n/** Used to detect methods masquerading as native. */\n\nvar maskSrcKey = function () {\n  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');\n  return uid ? 'Symbol(src)_1.' + uid : '';\n}();\n/** Used to resolve the decompiled source of functions. */\n\n\nvar funcToString = funcProto.toString;\n/** Used to check objects for own properties. */\n\nvar hasOwnProperty = objectProto.hasOwnProperty;\n/**\n * Used to resolve the\n * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\n * of values.\n */\n\nvar objectToString = objectProto.toString;\n/** Used to detect if a method is native. */\n\nvar reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\\\$&').replace(/hasOwnProperty|(function).*?(?=\\\\\\()| for .+?(?=\\\\\\])/g, '$1.*?') + '$');\n/** Built-in value references. */\n\nvar Symbol = root.Symbol,\n    splice = arrayProto.splice;\n/* Built-in method references that are verified to be native. */\n\nvar Map = getNative(root, 'Map'),\n    nativeCreate = getNative(Object, 'create');\n/** Used to convert symbols to primitives and strings. */\n\nvar symbolProto = Symbol ? Symbol.prototype : undefined,\n    symbolToString = symbolProto ? symbolProto.toString : undefined;\n/**\n * Creates a hash object.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\n\nfunction Hash(entries) {\n  var index = -1,\n      length = entries ? entries.length : 0;\n  this.clear();\n\n  while (++index < length) {\n    var entry = entries[index];\n    this.set(entry[0], entry[1]);\n  }\n}\n/**\n * Removes all key-value entries from the hash.\n *\n * @private\n * @name clear\n * @memberOf Hash\n */\n\n\nfunction hashClear() {\n  this.__data__ = nativeCreate ? nativeCreate(null) : {};\n}\n/**\n * Removes `key` and its value from the hash.\n *\n * @private\n * @name delete\n * @memberOf Hash\n * @param {Object} hash The hash to modify.\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\n\n\nfunction hashDelete(key) {\n  return this.has(key) && delete this.__data__[key];\n}\n/**\n * Gets the hash value for `key`.\n *\n * @private\n * @name get\n * @memberOf Hash\n * @param {string} key The key of the value to get.\n * @returns {*} Returns the entry value.\n */\n\n\nfunction hashGet(key) {\n  var data = this.__data__;\n\n  if (nativeCreate) {\n    var result = data[key];\n    return result === HASH_UNDEFINED ? undefined : result;\n  }\n\n  return hasOwnProperty.call(data, key) ? data[key] : undefined;\n}\n/**\n * Checks if a hash value for `key` exists.\n *\n * @private\n * @name has\n * @memberOf Hash\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\n\n\nfunction hashHas(key) {\n  var data = this.__data__;\n  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);\n}\n/**\n * Sets the hash `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf Hash\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the hash instance.\n */\n\n\nfunction hashSet(key, value) {\n  var data = this.__data__;\n  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;\n  return this;\n} // Add methods to `Hash`.\n\n\nHash.prototype.clear = hashClear;\nHash.prototype['delete'] = hashDelete;\nHash.prototype.get = hashGet;\nHash.prototype.has = hashHas;\nHash.prototype.set = hashSet;\n/**\n * Creates an list cache object.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\n\nfunction ListCache(entries) {\n  var index = -1,\n      length = entries ? entries.length : 0;\n  this.clear();\n\n  while (++index < length) {\n    var entry = entries[index];\n    this.set(entry[0], entry[1]);\n  }\n}\n/**\n * Removes all key-value entries from the list cache.\n *\n * @private\n * @name clear\n * @memberOf ListCache\n */\n\n\nfunction listCacheClear() {\n  this.__data__ = [];\n}\n/**\n * Removes `key` and its value from the list cache.\n *\n * @private\n * @name delete\n * @memberOf ListCache\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\n\n\nfunction listCacheDelete(key) {\n  var data = this.__data__,\n      index = assocIndexOf(data, key);\n\n  if (index < 0) {\n    return false;\n  }\n\n  var lastIndex = data.length - 1;\n\n  if (index == lastIndex) {\n    data.pop();\n  } else {\n    splice.call(data, index, 1);\n  }\n\n  return true;\n}\n/**\n * Gets the list cache value for `key`.\n *\n * @private\n * @name get\n * @memberOf ListCache\n * @param {string} key The key of the value to get.\n * @returns {*} Returns the entry value.\n */\n\n\nfunction listCacheGet(key) {\n  var data = this.__data__,\n      index = assocIndexOf(data, key);\n  return index < 0 ? undefined : data[index][1];\n}\n/**\n * Checks if a list cache value for `key` exists.\n *\n * @private\n * @name has\n * @memberOf ListCache\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\n\n\nfunction listCacheHas(key) {\n  return assocIndexOf(this.__data__, key) > -1;\n}\n/**\n * Sets the list cache `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf ListCache\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the list cache instance.\n */\n\n\nfunction listCacheSet(key, value) {\n  var data = this.__data__,\n      index = assocIndexOf(data, key);\n\n  if (index < 0) {\n    data.push([key, value]);\n  } else {\n    data[index][1] = value;\n  }\n\n  return this;\n} // Add methods to `ListCache`.\n\n\nListCache.prototype.clear = listCacheClear;\nListCache.prototype['delete'] = listCacheDelete;\nListCache.prototype.get = listCacheGet;\nListCache.prototype.has = listCacheHas;\nListCache.prototype.set = listCacheSet;\n/**\n * Creates a map cache object to store key-value pairs.\n *\n * @private\n * @constructor\n * @param {Array} [entries] The key-value pairs to cache.\n */\n\nfunction MapCache(entries) {\n  var index = -1,\n      length = entries ? entries.length : 0;\n  this.clear();\n\n  while (++index < length) {\n    var entry = entries[index];\n    this.set(entry[0], entry[1]);\n  }\n}\n/**\n * Removes all key-value entries from the map.\n *\n * @private\n * @name clear\n * @memberOf MapCache\n */\n\n\nfunction mapCacheClear() {\n  this.__data__ = {\n    'hash': new Hash(),\n    'map': new (Map || ListCache)(),\n    'string': new Hash()\n  };\n}\n/**\n * Removes `key` and its value from the map.\n *\n * @private\n * @name delete\n * @memberOf MapCache\n * @param {string} key The key of the value to remove.\n * @returns {boolean} Returns `true` if the entry was removed, else `false`.\n */\n\n\nfunction mapCacheDelete(key) {\n  return getMapData(this, key)['delete'](key);\n}\n/**\n * Gets the map value for `key`.\n *\n * @private\n * @name get\n * @memberOf MapCache\n * @param {string} key The key of the value to get.\n * @returns {*} Returns the entry value.\n */\n\n\nfunction mapCacheGet(key) {\n  return getMapData(this, key).get(key);\n}\n/**\n * Checks if a map value for `key` exists.\n *\n * @private\n * @name has\n * @memberOf MapCache\n * @param {string} key The key of the entry to check.\n * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.\n */\n\n\nfunction mapCacheHas(key) {\n  return getMapData(this, key).has(key);\n}\n/**\n * Sets the map `key` to `value`.\n *\n * @private\n * @name set\n * @memberOf MapCache\n * @param {string} key The key of the value to set.\n * @param {*} value The value to set.\n * @returns {Object} Returns the map cache instance.\n */\n\n\nfunction mapCacheSet(key, value) {\n  getMapData(this, key).set(key, value);\n  return this;\n} // Add methods to `MapCache`.\n\n\nMapCache.prototype.clear = mapCacheClear;\nMapCache.prototype['delete'] = mapCacheDelete;\nMapCache.prototype.get = mapCacheGet;\nMapCache.prototype.has = mapCacheHas;\nMapCache.prototype.set = mapCacheSet;\n/**\n * Gets the index at which the `key` is found in `array` of key-value pairs.\n *\n * @private\n * @param {Array} array The array to inspect.\n * @param {*} key The key to search for.\n * @returns {number} Returns the index of the matched value, else `-1`.\n */\n\nfunction assocIndexOf(array, key) {\n  var length = array.length;\n\n  while (length--) {\n    if (eq(array[length][0], key)) {\n      return length;\n    }\n  }\n\n  return -1;\n}\n/**\n * The base implementation of `_.get` without support for default values.\n *\n * @private\n * @param {Object} object The object to query.\n * @param {Array|string} path The path of the property to get.\n * @returns {*} Returns the resolved value.\n */\n\n\nfunction baseGet(object, path) {\n  path = isKey(path, object) ? [path] : castPath(path);\n  var index = 0,\n      length = path.length;\n\n  while (object != null && index < length) {\n    object = object[toKey(path[index++])];\n  }\n\n  return index && index == length ? object : undefined;\n}\n/**\n * The base implementation of `_.isNative` without bad shim checks.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a native function,\n *  else `false`.\n */\n\n\nfunction baseIsNative(value) {\n  if (!isObject(value) || isMasked(value)) {\n    return false;\n  }\n\n  var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;\n  return pattern.test(toSource(value));\n}\n/**\n * The base implementation of `_.toString` which doesn't convert nullish\n * values to empty strings.\n *\n * @private\n * @param {*} value The value to process.\n * @returns {string} Returns the string.\n */\n\n\nfunction baseToString(value) {\n  // Exit early for strings to avoid a performance hit in some environments.\n  if (typeof value == 'string') {\n    return value;\n  }\n\n  if (isSymbol(value)) {\n    return symbolToString ? symbolToString.call(value) : '';\n  }\n\n  var result = value + '';\n  return result == '0' && 1 / value == -INFINITY ? '-0' : result;\n}\n/**\n * Casts `value` to a path array if it's not one.\n *\n * @private\n * @param {*} value The value to inspect.\n * @returns {Array} Returns the cast property path array.\n */\n\n\nfunction castPath(value) {\n  return isArray(value) ? value : stringToPath(value);\n}\n/**\n * Gets the data for `map`.\n *\n * @private\n * @param {Object} map The map to query.\n * @param {string} key The reference key.\n * @returns {*} Returns the map data.\n */\n\n\nfunction getMapData(map, key) {\n  var data = map.__data__;\n  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;\n}\n/**\n * Gets the native function at `key` of `object`.\n *\n * @private\n * @param {Object} object The object to query.\n * @param {string} key The key of the method to get.\n * @returns {*} Returns the function if it's native, else `undefined`.\n */\n\n\nfunction getNative(object, key) {\n  var value = getValue(object, key);\n  return baseIsNative(value) ? value : undefined;\n}\n/**\n * Checks if `value` is a property name and not a property path.\n *\n * @private\n * @param {*} value The value to check.\n * @param {Object} [object] The object to query keys on.\n * @returns {boolean} Returns `true` if `value` is a property name, else `false`.\n */\n\n\nfunction isKey(value, object) {\n  if (isArray(value)) {\n    return false;\n  }\n\n  var type = typeof value;\n\n  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {\n    return true;\n  }\n\n  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);\n}\n/**\n * Checks if `value` is suitable for use as unique object key.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is suitable, else `false`.\n */\n\n\nfunction isKeyable(value) {\n  var type = typeof value;\n  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;\n}\n/**\n * Checks if `func` has its source masked.\n *\n * @private\n * @param {Function} func The function to check.\n * @returns {boolean} Returns `true` if `func` is masked, else `false`.\n */\n\n\nfunction isMasked(func) {\n  return !!maskSrcKey && maskSrcKey in func;\n}\n/**\n * Converts `string` to a property path array.\n *\n * @private\n * @param {string} string The string to convert.\n * @returns {Array} Returns the property path array.\n */\n\n\nvar stringToPath = memoize(function (string) {\n  string = toString(string);\n  var result = [];\n\n  if (reLeadingDot.test(string)) {\n    result.push('');\n  }\n\n  string.replace(rePropName, function (match, number, quote, string) {\n    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);\n  });\n  return result;\n});\n/**\n * Converts `value` to a string key if it's not a string or symbol.\n *\n * @private\n * @param {*} value The value to inspect.\n * @returns {string|symbol} Returns the key.\n */\n\nfunction toKey(value) {\n  if (typeof value == 'string' || isSymbol(value)) {\n    return value;\n  }\n\n  var result = value + '';\n  return result == '0' && 1 / value == -INFINITY ? '-0' : result;\n}\n/**\n * Converts `func` to its source code.\n *\n * @private\n * @param {Function} func The function to process.\n * @returns {string} Returns the source code.\n */\n\n\nfunction toSource(func) {\n  if (func != null) {\n    try {\n      return funcToString.call(func);\n    } catch (e) {}\n\n    try {\n      return func + '';\n    } catch (e) {}\n  }\n\n  return '';\n}\n/**\n * Creates a function that memoizes the result of `func`. If `resolver` is\n * provided, it determines the cache key for storing the result based on the\n * arguments provided to the memoized function. By default, the first argument\n * provided to the memoized function is used as the map cache key. The `func`\n * is invoked with the `this` binding of the memoized function.\n *\n * **Note:** The cache is exposed as the `cache` property on the memoized\n * function. Its creation may be customized by replacing the `_.memoize.Cache`\n * constructor with one whose instances implement the\n * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)\n * method interface of `delete`, `get`, `has`, and `set`.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Function\n * @param {Function} func The function to have its output memoized.\n * @param {Function} [resolver] The function to resolve the cache key.\n * @returns {Function} Returns the new memoized function.\n * @example\n *\n * var object = { 'a': 1, 'b': 2 };\n * var other = { 'c': 3, 'd': 4 };\n *\n * var values = _.memoize(_.values);\n * values(object);\n * // => [1, 2]\n *\n * values(other);\n * // => [3, 4]\n *\n * object.a = 2;\n * values(object);\n * // => [1, 2]\n *\n * // Modify the result cache.\n * values.cache.set(object, ['a', 'b']);\n * values(object);\n * // => ['a', 'b']\n *\n * // Replace `_.memoize.Cache`.\n * _.memoize.Cache = WeakMap;\n */\n\n\nfunction memoize(func, resolver) {\n  if (typeof func != 'function' || resolver && typeof resolver != 'function') {\n    throw new TypeError(FUNC_ERROR_TEXT);\n  }\n\n  var memoized = function () {\n    var args = arguments,\n        key = resolver ? resolver.apply(this, args) : args[0],\n        cache = memoized.cache;\n\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n\n    var result = func.apply(this, args);\n    memoized.cache = cache.set(key, result);\n    return result;\n  };\n\n  memoized.cache = new (memoize.Cache || MapCache)();\n  return memoized;\n} // Assign cache to `_.memoize`.\n\n\nmemoize.Cache = MapCache;\n/**\n * Performs a\n * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)\n * comparison between two values to determine if they are equivalent.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to compare.\n * @param {*} other The other value to compare.\n * @returns {boolean} Returns `true` if the values are equivalent, else `false`.\n * @example\n *\n * var object = { 'a': 1 };\n * var other = { 'a': 1 };\n *\n * _.eq(object, object);\n * // => true\n *\n * _.eq(object, other);\n * // => false\n *\n * _.eq('a', 'a');\n * // => true\n *\n * _.eq('a', Object('a'));\n * // => false\n *\n * _.eq(NaN, NaN);\n * // => true\n */\n\nfunction eq(value, other) {\n  return value === other || value !== value && other !== other;\n}\n/**\n * Checks if `value` is classified as an `Array` object.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is an array, else `false`.\n * @example\n *\n * _.isArray([1, 2, 3]);\n * // => true\n *\n * _.isArray(document.body.children);\n * // => false\n *\n * _.isArray('abc');\n * // => false\n *\n * _.isArray(_.noop);\n * // => false\n */\n\n\nvar isArray = Array.isArray;\n/**\n * Checks if `value` is classified as a `Function` object.\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a function, else `false`.\n * @example\n *\n * _.isFunction(_);\n * // => true\n *\n * _.isFunction(/abc/);\n * // => false\n */\n\nfunction isFunction(value) {\n  // The use of `Object#toString` avoids issues with the `typeof` operator\n  // in Safari 8-9 which returns 'object' for typed array and other constructors.\n  var tag = isObject(value) ? objectToString.call(value) : '';\n  return tag == funcTag || tag == genTag;\n}\n/**\n * Checks if `value` is the\n * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)\n * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)\n *\n * @static\n * @memberOf _\n * @since 0.1.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is an object, else `false`.\n * @example\n *\n * _.isObject({});\n * // => true\n *\n * _.isObject([1, 2, 3]);\n * // => true\n *\n * _.isObject(_.noop);\n * // => true\n *\n * _.isObject(null);\n * // => false\n */\n\n\nfunction isObject(value) {\n  var type = typeof value;\n  return !!value && (type == 'object' || type == 'function');\n}\n/**\n * Checks if `value` is object-like. A value is object-like if it's not `null`\n * and has a `typeof` result of \"object\".\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is object-like, else `false`.\n * @example\n *\n * _.isObjectLike({});\n * // => true\n *\n * _.isObjectLike([1, 2, 3]);\n * // => true\n *\n * _.isObjectLike(_.noop);\n * // => false\n *\n * _.isObjectLike(null);\n * // => false\n */\n\n\nfunction isObjectLike(value) {\n  return !!value && typeof value == 'object';\n}\n/**\n * Checks if `value` is classified as a `Symbol` primitive or object.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.\n * @example\n *\n * _.isSymbol(Symbol.iterator);\n * // => true\n *\n * _.isSymbol('abc');\n * // => false\n */\n\n\nfunction isSymbol(value) {\n  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;\n}\n/**\n * Converts `value` to a string. An empty string is returned for `null`\n * and `undefined` values. The sign of `-0` is preserved.\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to process.\n * @returns {string} Returns the string.\n * @example\n *\n * _.toString(null);\n * // => ''\n *\n * _.toString(-0);\n * // => '-0'\n *\n * _.toString([1, 2, 3]);\n * // => '1,2,3'\n */\n\n\nfunction toString(value) {\n  return value == null ? '' : baseToString(value);\n}\n/**\n * Gets the value at `path` of `object`. If the resolved value is\n * `undefined`, the `defaultValue` is returned in its place.\n *\n * @static\n * @memberOf _\n * @since 3.7.0\n * @category Object\n * @param {Object} object The object to query.\n * @param {Array|string} path The path of the property to get.\n * @param {*} [defaultValue] The value returned for `undefined` resolved values.\n * @returns {*} Returns the resolved value.\n * @example\n *\n * var object = { 'a': [{ 'b': { 'c': 3 } }] };\n *\n * _.get(object, 'a[0].b.c');\n * // => 3\n *\n * _.get(object, ['a', '0', 'b', 'c']);\n * // => 3\n *\n * _.get(object, 'a.b.c', 'default');\n * // => 'default'\n */\n\n\nfunction get(object, path, defaultValue) {\n  var result = object == null ? undefined : baseGet(object, path);\n  return result === undefined ? defaultValue : result;\n}\n\nmodule.exports = get;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/lodash.get/index.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (module) {\n  if (!module.webpackPolyfill) {\n    module.deprecate = function () {};\n\n    module.paths = []; // module.parent = undefined by default\n\n    if (!module.children) module.children = [];\n    Object.defineProperty(module, \"loaded\", {\n      enumerable: true,\n      get: function () {\n        return module.l;\n      }\n    });\n    Object.defineProperty(module, \"id\", {\n      enumerable: true,\n      get: function () {\n        return module.i;\n      }\n    });\n    module.webpackPolyfill = 1;\n  }\n\n  return module;\n};\n\n//# sourceURL=webpack://__ember_auto_import__/(webpack)/buildin/module.js?");

/***/ })

}]);;
(window["webpackJsonp_ember_auto_import_"] = window["webpackJsonp_ember_auto_import_"] || []).push([["vendors~tests"],{

/***/ "./node_modules/@sinonjs/commons/lib/called-in-order.js":
/*!**************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/called-in-order.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar every = __webpack_require__(/*! ./prototypes/array */ \"./node_modules/@sinonjs/commons/lib/prototypes/array.js\").every;\n/**\n * @private\n */\n\n\nfunction hasCallsLeft(callMap, spy) {\n  if (callMap[spy.id] === undefined) {\n    callMap[spy.id] = 0;\n  }\n\n  return callMap[spy.id] < spy.callCount;\n}\n/**\n * @private\n */\n\n\nfunction checkAdjacentCalls(callMap, spy, index, spies) {\n  var calledBeforeNext = true;\n\n  if (index !== spies.length - 1) {\n    calledBeforeNext = spy.calledBefore(spies[index + 1]);\n  }\n\n  if (hasCallsLeft(callMap, spy) && calledBeforeNext) {\n    callMap[spy.id] += 1;\n    return true;\n  }\n\n  return false;\n}\n/**\n * A Sinon proxy object (fake, spy, stub)\n *\n * @typedef {object} SinonProxy\n * @property {Function} calledBefore - A method that determines if this proxy was called before another one\n * @property {string} id - Some id\n * @property {number} callCount - Number of times this proxy has been called\n */\n\n/**\n * Returns true when the spies have been called in the order they were supplied in\n *\n * @param  {SinonProxy[] | SinonProxy} spies An array of proxies, or several proxies as arguments\n * @returns {boolean} true when spies are called in order, false otherwise\n */\n\n\nfunction calledInOrder(spies) {\n  var callMap = {}; // eslint-disable-next-line no-underscore-dangle\n\n  var _spies = arguments.length > 1 ? arguments : spies;\n\n  return every(_spies, checkAdjacentCalls.bind(null, callMap));\n}\n\nmodule.exports = calledInOrder;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/called-in-order.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/class-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/class-name.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar functionName = __webpack_require__(/*! ./function-name */ \"./node_modules/@sinonjs/commons/lib/function-name.js\");\n/**\n * Returns a display name for a value from a constructor\n *\n * @param  {object} value A value to examine\n * @returns {(string|null)} A string or null\n */\n\n\nfunction className(value) {\n  return value.constructor && value.constructor.name || // The next branch is for IE11 support only:\n  // Because the name property is not set on the prototype\n  // of the Function object, we finally try to grab the\n  // name from its definition. This will never be reached\n  // in node, so we are not able to test this properly.\n  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name\n  typeof value.constructor === \"function\" &&\n  /* istanbul ignore next */\n  functionName(value.constructor) || null;\n}\n\nmodule.exports = className;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/class-name.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/deprecated.js":
/*!*********************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/deprecated.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* eslint-disable no-console */\n\n/**\n * Returns a function that will invoke the supplied function and print a\n * deprecation warning to the console each time it is called.\n *\n * @param  {Function} func\n * @param  {string} msg\n * @returns {Function}\n */\n\nexports.wrap = function (func, msg) {\n  var wrapped = function () {\n    exports.printWarning(msg);\n    return func.apply(this, arguments);\n  };\n\n  if (func.prototype) {\n    wrapped.prototype = func.prototype;\n  }\n\n  return wrapped;\n};\n/**\n * Returns a string which can be supplied to `wrap()` to notify the user that a\n * particular part of the sinon API has been deprecated.\n *\n * @param  {string} packageName\n * @param  {string} funcName\n * @returns {string}\n */\n\n\nexports.defaultMsg = function (packageName, funcName) {\n  return packageName + \".\" + funcName + \" is deprecated and will be removed from the public API in a future version of \" + packageName + \".\";\n};\n/**\n * Prints a warning on the console, when it exists\n *\n * @param  {string} msg\n * @returns {undefined}\n */\n\n\nexports.printWarning = function (msg) {\n  /* istanbul ignore next */\n  if (typeof process === \"object\" && process.emitWarning) {\n    // Emit Warnings in Node\n    process.emitWarning(msg);\n  } else if (console.info) {\n    console.info(msg);\n  } else {\n    console.log(msg);\n  }\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/deprecated.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/every.js":
/*!****************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/every.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns true when fn returns true for all members of obj.\n * This is an every implementation that works for all iterables\n *\n * @param  {object}   obj\n * @param  {Function} fn\n * @returns {boolean}\n */\n\nmodule.exports = function every(obj, fn) {\n  var pass = true;\n\n  try {\n    // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods\n    obj.forEach(function () {\n      if (!fn.apply(this, arguments)) {\n        // Throwing an error is the only way to break `forEach`\n        throw new Error();\n      }\n    });\n  } catch (e) {\n    pass = false;\n  }\n\n  return pass;\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/every.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/function-name.js":
/*!************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/function-name.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns a display name for a function\n *\n * @param  {Function} func\n * @returns {string}\n */\n\nmodule.exports = function functionName(func) {\n  if (!func) {\n    return \"\";\n  }\n\n  try {\n    return func.displayName || func.name || // Use function decomposition as a last resort to get function\n    // name. Does not rely on function decomposition to work - if it\n    // doesn't debugging will be slightly less informative\n    // (i.e. toString will say 'spy' rather than 'myFunc').\n    (String(func).match(/function ([^\\s(]+)/) || [])[1];\n  } catch (e) {\n    // Stringify may fail and we might get an exception, as a last-last\n    // resort fall back to empty string.\n    return \"\";\n  }\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/function-name.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/global.js":
/*!*****************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/global.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * A reference to the global object\n *\n * @type {object} globalObject\n */\n\nvar globalObject;\n/* istanbul ignore else */\n\nif (typeof global !== \"undefined\") {\n  // Node\n  globalObject = global;\n} else if (typeof window !== \"undefined\") {\n  // Browser\n  globalObject = window;\n} else {\n  // WebWorker\n  globalObject = self;\n}\n\nmodule.exports = globalObject;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/global.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = {\n  global: __webpack_require__(/*! ./global */ \"./node_modules/@sinonjs/commons/lib/global.js\"),\n  calledInOrder: __webpack_require__(/*! ./called-in-order */ \"./node_modules/@sinonjs/commons/lib/called-in-order.js\"),\n  className: __webpack_require__(/*! ./class-name */ \"./node_modules/@sinonjs/commons/lib/class-name.js\"),\n  deprecated: __webpack_require__(/*! ./deprecated */ \"./node_modules/@sinonjs/commons/lib/deprecated.js\"),\n  every: __webpack_require__(/*! ./every */ \"./node_modules/@sinonjs/commons/lib/every.js\"),\n  functionName: __webpack_require__(/*! ./function-name */ \"./node_modules/@sinonjs/commons/lib/function-name.js\"),\n  orderByFirstCall: __webpack_require__(/*! ./order-by-first-call */ \"./node_modules/@sinonjs/commons/lib/order-by-first-call.js\"),\n  prototypes: __webpack_require__(/*! ./prototypes */ \"./node_modules/@sinonjs/commons/lib/prototypes/index.js\"),\n  typeOf: __webpack_require__(/*! ./type-of */ \"./node_modules/@sinonjs/commons/lib/type-of.js\"),\n  valueToString: __webpack_require__(/*! ./value-to-string */ \"./node_modules/@sinonjs/commons/lib/value-to-string.js\")\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/index.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/order-by-first-call.js":
/*!******************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/order-by-first-call.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar sort = __webpack_require__(/*! ./prototypes/array */ \"./node_modules/@sinonjs/commons/lib/prototypes/array.js\").sort;\n\nvar slice = __webpack_require__(/*! ./prototypes/array */ \"./node_modules/@sinonjs/commons/lib/prototypes/array.js\").slice;\n/**\n * @private\n */\n\n\nfunction comparator(a, b) {\n  // uuid, won't ever be equal\n  var aCall = a.getCall(0);\n  var bCall = b.getCall(0);\n  var aId = aCall && aCall.callId || -1;\n  var bId = bCall && bCall.callId || -1;\n  return aId < bId ? -1 : 1;\n}\n/**\n * A Sinon proxy object (fake, spy, stub)\n *\n * @typedef {object} SinonProxy\n * @property {Function} getCall - A method that can return the first call\n */\n\n/**\n * Sorts an array of SinonProxy instances (fake, spy, stub) by their first call\n *\n * @param  {SinonProxy[] | SinonProxy} spies\n * @returns {SinonProxy[]}\n */\n\n\nfunction orderByFirstCall(spies) {\n  return sort(slice(spies), comparator);\n}\n\nmodule.exports = orderByFirstCall;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/order-by-first-call.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/array.js":
/*!***************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/array.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar copyPrototype = __webpack_require__(/*! ./copy-prototype */ \"./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js\");\n\nmodule.exports = copyPrototype(Array.prototype);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/array.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js":
/*!************************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar call = Function.call;\n\nmodule.exports = function copyPrototypeMethods(prototype) {\n  // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods\n  return Object.getOwnPropertyNames(prototype).reduce(function (result, name) {\n    // ignore size because it throws from Map\n    if (name !== \"size\" && name !== \"caller\" && name !== \"callee\" && name !== \"arguments\" && typeof prototype[name] === \"function\") {\n      result[name] = call.bind(prototype[name]);\n    }\n\n    return result;\n  }, Object.create(null));\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/function.js":
/*!******************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/function.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar copyPrototype = __webpack_require__(/*! ./copy-prototype */ \"./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js\");\n\nmodule.exports = copyPrototype(Function.prototype);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/function.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = {\n  array: __webpack_require__(/*! ./array */ \"./node_modules/@sinonjs/commons/lib/prototypes/array.js\"),\n  function: __webpack_require__(/*! ./function */ \"./node_modules/@sinonjs/commons/lib/prototypes/function.js\"),\n  map: __webpack_require__(/*! ./map */ \"./node_modules/@sinonjs/commons/lib/prototypes/map.js\"),\n  object: __webpack_require__(/*! ./object */ \"./node_modules/@sinonjs/commons/lib/prototypes/object.js\"),\n  set: __webpack_require__(/*! ./set */ \"./node_modules/@sinonjs/commons/lib/prototypes/set.js\"),\n  string: __webpack_require__(/*! ./string */ \"./node_modules/@sinonjs/commons/lib/prototypes/string.js\")\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/index.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/map.js":
/*!*************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/map.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar copyPrototype = __webpack_require__(/*! ./copy-prototype */ \"./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js\");\n\nmodule.exports = copyPrototype(Map.prototype);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/map.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/object.js":
/*!****************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/object.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar copyPrototype = __webpack_require__(/*! ./copy-prototype */ \"./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js\");\n\nmodule.exports = copyPrototype(Object.prototype);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/object.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/set.js":
/*!*************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/set.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar copyPrototype = __webpack_require__(/*! ./copy-prototype */ \"./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js\");\n\nmodule.exports = copyPrototype(Set.prototype);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/set.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/prototypes/string.js":
/*!****************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/prototypes/string.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar copyPrototype = __webpack_require__(/*! ./copy-prototype */ \"./node_modules/@sinonjs/commons/lib/prototypes/copy-prototype.js\");\n\nmodule.exports = copyPrototype(String.prototype);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/prototypes/string.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/type-of.js":
/*!******************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/type-of.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar type = __webpack_require__(/*! type-detect */ \"./node_modules/type-detect/type-detect.js\");\n/**\n * Returns the lower-case result of running type from type-detect on the value\n *\n * @param  {*} value\n * @returns {string}\n */\n\n\nmodule.exports = function typeOf(value) {\n  return type(value).toLowerCase();\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/type-of.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/commons/lib/value-to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/@sinonjs/commons/lib/value-to-string.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns a string representation of the value\n *\n * @param  {*} value\n * @returns {string}\n */\n\nfunction valueToString(value) {\n  if (value && value.toString) {\n    // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods\n    return value.toString();\n  }\n\n  return String(value);\n}\n\nmodule.exports = valueToString;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/commons/lib/value-to-string.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/formatio/lib/formatio.js":
/*!********************************************************!*\
  !*** ./node_modules/@sinonjs/formatio/lib/formatio.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar samsam = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\");\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar typeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").typeOf;\n\nvar formatio = {\n  excludeConstructors: [\"Object\", /^.$/],\n  quoteStrings: true,\n  limitChildrenCount: 0\n};\nvar specialObjects = [];\n/* istanbul ignore else */\n\nif (typeof global !== \"undefined\") {\n  specialObjects.push({\n    object: global,\n    value: \"[object global]\"\n  });\n}\n\nif (typeof document !== \"undefined\") {\n  specialObjects.push({\n    object: document,\n    value: \"[object HTMLDocument]\"\n  });\n}\n\nif (typeof window !== \"undefined\") {\n  specialObjects.push({\n    object: window,\n    value: \"[object Window]\"\n  });\n}\n\nfunction constructorName(f, object) {\n  var name = functionName(object && object.constructor);\n  var excludes = f.excludeConstructors || formatio.excludeConstructors;\n  var i, l;\n\n  for (i = 0, l = excludes.length; i < l; ++i) {\n    if (typeof excludes[i] === \"string\" && excludes[i] === name) {\n      return \"\";\n    } else if (excludes[i].test && excludes[i].test(name)) {\n      return \"\";\n    }\n  }\n\n  return name;\n}\n\nfunction isCircular(object, objects) {\n  if (typeof object !== \"object\") {\n    return false;\n  }\n\n  var i, l;\n\n  for (i = 0, l = objects.length; i < l; ++i) {\n    if (objects[i] === object) {\n      return true;\n    }\n  }\n\n  return false;\n} // eslint-disable-next-line complexity\n\n\nfunction ascii(f, object, processed, indent) {\n  if (typeof object === \"string\") {\n    if (object.length === 0) {\n      return \"(empty string)\";\n    }\n\n    var qs = f.quoteStrings;\n    var quote = typeof qs !== \"boolean\" || qs; // eslint-disable-next-line quotes\n\n    return processed || quote ? '\"' + object + '\"' : object;\n  }\n\n  if (typeof object === \"symbol\") {\n    return object.toString();\n  }\n\n  if (typeof object === \"function\" && !(object instanceof RegExp)) {\n    return ascii.func(object);\n  } // eslint supports bigint as of version 6.0.0\n  // https://github.com/eslint/eslint/commit/e4ab0531c4e44c23494c6a802aa2329d15ac90e5\n  // eslint-disable-next-line\n\n\n  if (typeOf(object) === \"bigint\") {\n    return object.toString();\n  }\n\n  var internalProcessed = processed || [];\n\n  if (isCircular(object, internalProcessed)) {\n    return \"[Circular]\";\n  }\n\n  if (typeOf(object) === \"array\") {\n    return ascii.array.call(f, object, internalProcessed);\n  }\n\n  if (!object) {\n    return String(1 / object === -Infinity ? \"-0\" : object);\n  }\n\n  if (samsam.isElement(object)) {\n    return ascii.element(object);\n  }\n\n  if (typeof object.toString === \"function\" && object.toString !== Object.prototype.toString) {\n    return object.toString();\n  }\n\n  var i, l;\n\n  for (i = 0, l = specialObjects.length; i < l; i++) {\n    if (object === specialObjects[i].object) {\n      return specialObjects[i].value;\n    }\n  }\n\n  if (samsam.isSet(object)) {\n    return ascii.set.call(f, object, internalProcessed);\n  }\n\n  if (object instanceof Map) {\n    return ascii.map.call(f, object, internalProcessed);\n  }\n\n  return ascii.object.call(f, object, internalProcessed, indent);\n}\n\nascii.func = function (func) {\n  var funcName = functionName(func) || \"\";\n  return \"function \" + funcName + \"() {}\";\n};\n\nfunction delimit(str, delimiters) {\n  var delims = delimiters || [\"[\", \"]\"];\n  return delims[0] + str + delims[1];\n}\n\nascii.array = function (array, processed, delimiters) {\n  processed.push(array);\n  var pieces = [];\n  var i, l;\n  l = this.limitChildrenCount > 0 ? Math.min(this.limitChildrenCount, array.length) : array.length;\n\n  for (i = 0; i < l; ++i) {\n    pieces.push(ascii(this, array[i], processed));\n  }\n\n  if (l < array.length) {\n    pieces.push(\"[... \" + (array.length - l) + \" more elements]\");\n  }\n\n  return delimit(pieces.join(\", \"), delimiters);\n};\n\nascii.set = function (set, processed) {\n  return ascii.array.call(this, Array.from(set), processed, [\"Set {\", \"}\"]);\n};\n\nascii.map = function (map, processed) {\n  return ascii.array.call(this, Array.from(map), processed, [\"Map [\", \"]\"]);\n};\n\nfunction getSymbols(object) {\n  if (samsam.isArguments(object)) {\n    return [];\n  }\n  /* istanbul ignore else */\n\n\n  if (typeof Object.getOwnPropertySymbols === \"function\") {\n    return Object.getOwnPropertySymbols(object);\n  }\n  /* istanbul ignore next: This is only for IE, since getOwnPropertySymbols\n   * does not exist on Object there\n   */\n\n\n  return [];\n}\n\nascii.object = function (object, processed, indent) {\n  processed.push(object);\n  var internalIndent = indent || 0;\n  var pieces = [];\n  var properties = Object.keys(object).sort().concat(getSymbols(object));\n  var length = 3;\n  var prop, str, obj, i, k, l;\n  l = this.limitChildrenCount > 0 ? Math.min(this.limitChildrenCount, properties.length) : properties.length;\n\n  for (i = 0; i < l; ++i) {\n    prop = properties[i];\n    obj = object[prop];\n\n    if (isCircular(obj, processed)) {\n      str = \"[Circular]\";\n    } else {\n      str = ascii(this, obj, processed, internalIndent + 2);\n    }\n\n    str = (typeof prop === \"string\" && /\\s/.test(prop) ? // eslint-disable-next-line quotes\n    '\"' + prop + '\"' : prop.toString()) + \": \" + str;\n    length += str.length;\n    pieces.push(str);\n  }\n\n  var cons = constructorName(this, object);\n  var prefix = cons ? \"[\" + cons + \"] \" : \"\";\n  var is = \"\";\n\n  for (i = 0, k = internalIndent; i < k; ++i) {\n    is += \" \";\n  }\n\n  if (l < properties.length) {\n    pieces.push(\"[... \" + (properties.length - l) + \" more elements]\");\n  }\n\n  if (length + internalIndent > 80) {\n    return prefix + \"{\\n  \" + is + pieces.join(\",\\n  \" + is) + \"\\n\" + is + \"}\";\n  }\n\n  return prefix + \"{ \" + pieces.join(\", \") + \" }\";\n};\n\nascii.element = function (element) {\n  var tagName = element.tagName.toLowerCase();\n  var attrs = element.attributes;\n  var pairs = [];\n  var attr, attrName, i, l, val;\n\n  for (i = 0, l = attrs.length; i < l; ++i) {\n    attr = attrs.item(i);\n    attrName = attr.nodeName.toLowerCase().replace(\"html:\", \"\");\n    val = attr.nodeValue;\n\n    if (attrName !== \"contenteditable\" || val !== \"inherit\") {\n      if (val) {\n        // eslint-disable-next-line quotes\n        pairs.push(attrName + '=\"' + val + '\"');\n      }\n    }\n  }\n\n  var formatted = \"<\" + tagName + (pairs.length > 0 ? \" \" : \"\"); // SVG elements have undefined innerHTML\n\n  var content = element.innerHTML || \"\";\n\n  if (content.length > 20) {\n    content = content.substr(0, 20) + \"[...]\";\n  }\n\n  var res = formatted + pairs.join(\" \") + \">\" + content + \"</\" + tagName + \">\";\n  return res.replace(/ contentEditable=\"inherit\"/, \"\");\n};\n\nfunction Formatio(options) {\n  // eslint-disable-next-line guard-for-in\n  for (var opt in options) {\n    this[opt] = options[opt];\n  }\n}\n\nFormatio.prototype = {\n  functionName: functionName,\n  configure: function (options) {\n    return new Formatio(options);\n  },\n  constructorName: function (object) {\n    return constructorName(this, object);\n  },\n  ascii: function (object, processed, indent) {\n    return ascii(this, object, processed, indent);\n  }\n};\nmodule.exports = Formatio.prototype;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/formatio/lib/formatio.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/array-types.js":
/*!*********************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/array-types.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar ARRAY_TYPES = [Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];\nmodule.exports = ARRAY_TYPES;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/array-types.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher.js":
/*!************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar deepEqual = __webpack_require__(/*! ./deep-equal */ \"./node_modules/@sinonjs/samsam/lib/deep-equal.js\").use(createMatcher); // eslint-disable-line no-use-before-define\n\n\nvar every = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").every;\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar get = __webpack_require__(/*! lodash.get */ \"./node_modules/lodash.get/index.js\");\n\nvar iterableToString = __webpack_require__(/*! ./iterable-to-string */ \"./node_modules/@sinonjs/samsam/lib/iterable-to-string.js\");\n\nvar objectProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object;\n\nvar typeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").typeOf;\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar assertMatcher = __webpack_require__(/*! ./create-matcher/assert-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/assert-matcher.js\");\n\nvar assertMethodExists = __webpack_require__(/*! ./create-matcher/assert-method-exists */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/assert-method-exists.js\");\n\nvar assertType = __webpack_require__(/*! ./create-matcher/assert-type */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/assert-type.js\");\n\nvar isIterable = __webpack_require__(/*! ./create-matcher/is-iterable */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/is-iterable.js\");\n\nvar isMatcher = __webpack_require__(/*! ./create-matcher/is-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/is-matcher.js\");\n\nvar matcherPrototype = __webpack_require__(/*! ./create-matcher/matcher-prototype */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/matcher-prototype.js\");\n\nvar arrayIndexOf = arrayProto.indexOf;\nvar some = arrayProto.some;\nvar hasOwnProperty = objectProto.hasOwnProperty;\nvar objectToString = objectProto.toString;\n\nvar TYPE_MAP = __webpack_require__(/*! ./create-matcher/type-map */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/type-map.js\")(createMatcher); // eslint-disable-line no-use-before-define\n\n/**\n * Creates a matcher object for the passed expectation\n *\n * @alias module:samsam.createMatcher\n * @param {*} expectation An expecttation\n * @param {string} message A message for the expectation\n * @returns {object} A matcher object\n */\n\n\nfunction createMatcher(expectation, message) {\n  var m = Object.create(matcherPrototype);\n  var type = typeOf(expectation);\n\n  if (message !== undefined && typeof message !== \"string\") {\n    throw new TypeError(\"Message should be a string\");\n  }\n\n  if (arguments.length > 2) {\n    throw new TypeError(\"Expected 1 or 2 arguments, received \" + arguments.length);\n  }\n\n  if (type in TYPE_MAP) {\n    TYPE_MAP[type](m, expectation, message);\n  } else {\n    m.test = function (actual) {\n      return deepEqual(actual, expectation);\n    };\n  }\n\n  if (!m.message) {\n    m.message = \"match(\" + valueToString(expectation) + \")\";\n  }\n\n  return m;\n}\n\ncreateMatcher.isMatcher = isMatcher;\ncreateMatcher.any = createMatcher(function () {\n  return true;\n}, \"any\");\ncreateMatcher.defined = createMatcher(function (actual) {\n  return actual !== null && actual !== undefined;\n}, \"defined\");\ncreateMatcher.truthy = createMatcher(function (actual) {\n  return Boolean(actual);\n}, \"truthy\");\ncreateMatcher.falsy = createMatcher(function (actual) {\n  return !actual;\n}, \"falsy\");\n\ncreateMatcher.same = function (expectation) {\n  return createMatcher(function (actual) {\n    return expectation === actual;\n  }, \"same(\" + valueToString(expectation) + \")\");\n};\n\ncreateMatcher.in = function (arrayOfExpectations) {\n  if (typeOf(arrayOfExpectations) !== \"array\") {\n    throw new TypeError(\"array expected\");\n  }\n\n  return createMatcher(function (actual) {\n    return some(arrayOfExpectations, function (expectation) {\n      return expectation === actual;\n    });\n  }, \"in(\" + valueToString(arrayOfExpectations) + \")\");\n};\n\ncreateMatcher.typeOf = function (type) {\n  assertType(type, \"string\", \"type\");\n  return createMatcher(function (actual) {\n    return typeOf(actual) === type;\n  }, 'typeOf(\"' + type + '\")');\n};\n\ncreateMatcher.instanceOf = function (type) {\n  /* istanbul ignore if */\n  if (typeof Symbol === \"undefined\" || typeof Symbol.hasInstance === \"undefined\") {\n    assertType(type, \"function\", \"type\");\n  } else {\n    assertMethodExists(type, Symbol.hasInstance, \"type\", \"[Symbol.hasInstance]\");\n  }\n\n  return createMatcher(function (actual) {\n    return actual instanceof type;\n  }, \"instanceOf(\" + (functionName(type) || objectToString(type)) + \")\");\n};\n/**\n * Creates a property matcher\n *\n * @private\n * @param {Function} propertyTest A function to test the property against a value\n * @param {string} messagePrefix A prefix to use for messages generated by the matcher\n * @returns {object} A matcher\n */\n\n\nfunction createPropertyMatcher(propertyTest, messagePrefix) {\n  return function (property, value) {\n    assertType(property, \"string\", \"property\");\n    var onlyProperty = arguments.length === 1;\n    var message = messagePrefix + '(\"' + property + '\"';\n\n    if (!onlyProperty) {\n      message += \", \" + valueToString(value);\n    }\n\n    message += \")\";\n    return createMatcher(function (actual) {\n      if (actual === undefined || actual === null || !propertyTest(actual, property)) {\n        return false;\n      }\n\n      return onlyProperty || deepEqual(actual[property], value);\n    }, message);\n  };\n}\n\ncreateMatcher.has = createPropertyMatcher(function (actual, property) {\n  if (typeof actual === \"object\") {\n    return property in actual;\n  }\n\n  return actual[property] !== undefined;\n}, \"has\");\ncreateMatcher.hasOwn = createPropertyMatcher(function (actual, property) {\n  return hasOwnProperty(actual, property);\n}, \"hasOwn\");\n\ncreateMatcher.hasNested = function (property, value) {\n  assertType(property, \"string\", \"property\");\n  var onlyProperty = arguments.length === 1;\n  var message = 'hasNested(\"' + property + '\"';\n\n  if (!onlyProperty) {\n    message += \", \" + valueToString(value);\n  }\n\n  message += \")\";\n  return createMatcher(function (actual) {\n    if (actual === undefined || actual === null || get(actual, property) === undefined) {\n      return false;\n    }\n\n    return onlyProperty || deepEqual(get(actual, property), value);\n  }, message);\n};\n\ncreateMatcher.every = function (predicate) {\n  assertMatcher(predicate);\n  return createMatcher(function (actual) {\n    if (typeOf(actual) === \"object\") {\n      return every(Object.keys(actual), function (key) {\n        return predicate.test(actual[key]);\n      });\n    }\n\n    return isIterable(actual) && every(actual, function (element) {\n      return predicate.test(element);\n    });\n  }, \"every(\" + predicate.message + \")\");\n};\n\ncreateMatcher.some = function (predicate) {\n  assertMatcher(predicate);\n  return createMatcher(function (actual) {\n    if (typeOf(actual) === \"object\") {\n      return !every(Object.keys(actual), function (key) {\n        return !predicate.test(actual[key]);\n      });\n    }\n\n    return isIterable(actual) && !every(actual, function (element) {\n      return !predicate.test(element);\n    });\n  }, \"some(\" + predicate.message + \")\");\n};\n\ncreateMatcher.array = createMatcher.typeOf(\"array\");\n\ncreateMatcher.array.deepEquals = function (expectation) {\n  return createMatcher(function (actual) {\n    // Comparing lengths is the fastest way to spot a difference before iterating through every item\n    var sameLength = actual.length === expectation.length;\n    return typeOf(actual) === \"array\" && sameLength && every(actual, function (element, index) {\n      var expected = expectation[index];\n      return typeOf(expected) === \"array\" && typeOf(element) === \"array\" ? createMatcher.array.deepEquals(expected).test(element) : deepEqual(expected, element);\n    });\n  }, \"deepEquals([\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.array.startsWith = function (expectation) {\n  return createMatcher(function (actual) {\n    return typeOf(actual) === \"array\" && every(expectation, function (expectedElement, index) {\n      return actual[index] === expectedElement;\n    });\n  }, \"startsWith([\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.array.endsWith = function (expectation) {\n  return createMatcher(function (actual) {\n    // This indicates the index in which we should start matching\n    var offset = actual.length - expectation.length;\n    return typeOf(actual) === \"array\" && every(expectation, function (expectedElement, index) {\n      return actual[offset + index] === expectedElement;\n    });\n  }, \"endsWith([\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.array.contains = function (expectation) {\n  return createMatcher(function (actual) {\n    return typeOf(actual) === \"array\" && every(expectation, function (expectedElement) {\n      return arrayIndexOf(actual, expectedElement) !== -1;\n    });\n  }, \"contains([\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.map = createMatcher.typeOf(\"map\");\n\ncreateMatcher.map.deepEquals = function mapDeepEquals(expectation) {\n  return createMatcher(function (actual) {\n    // Comparing lengths is the fastest way to spot a difference before iterating through every item\n    var sameLength = actual.size === expectation.size;\n    return typeOf(actual) === \"map\" && sameLength && every(actual, function (element, key) {\n      return expectation.has(key) && expectation.get(key) === element;\n    });\n  }, \"deepEquals(Map[\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.map.contains = function mapContains(expectation) {\n  return createMatcher(function (actual) {\n    return typeOf(actual) === \"map\" && every(expectation, function (element, key) {\n      return actual.has(key) && actual.get(key) === element;\n    });\n  }, \"contains(Map[\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.set = createMatcher.typeOf(\"set\");\n\ncreateMatcher.set.deepEquals = function setDeepEquals(expectation) {\n  return createMatcher(function (actual) {\n    // Comparing lengths is the fastest way to spot a difference before iterating through every item\n    var sameLength = actual.size === expectation.size;\n    return typeOf(actual) === \"set\" && sameLength && every(actual, function (element) {\n      return expectation.has(element);\n    });\n  }, \"deepEquals(Set[\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.set.contains = function setContains(expectation) {\n  return createMatcher(function (actual) {\n    return typeOf(actual) === \"set\" && every(expectation, function (element) {\n      return actual.has(element);\n    });\n  }, \"contains(Set[\" + iterableToString(expectation) + \"])\");\n};\n\ncreateMatcher.bool = createMatcher.typeOf(\"boolean\");\ncreateMatcher.number = createMatcher.typeOf(\"number\");\ncreateMatcher.string = createMatcher.typeOf(\"string\");\ncreateMatcher.object = createMatcher.typeOf(\"object\");\ncreateMatcher.func = createMatcher.typeOf(\"function\");\ncreateMatcher.regexp = createMatcher.typeOf(\"regexp\");\ncreateMatcher.date = createMatcher.typeOf(\"date\");\ncreateMatcher.symbol = createMatcher.typeOf(\"symbol\");\nmodule.exports = createMatcher;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/assert-matcher.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/assert-matcher.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isMatcher = __webpack_require__(/*! ./is-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/is-matcher.js\");\n/**\n * Throws a TypeError when `value` is not a matcher\n *\n * @private\n * @param {*} value The value to examine\n */\n\n\nfunction assertMatcher(value) {\n  if (!isMatcher(value)) {\n    throw new TypeError(\"Matcher expected\");\n  }\n}\n\nmodule.exports = assertMatcher;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/assert-matcher.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/assert-method-exists.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/assert-method-exists.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Throws a TypeError when expected method doesn't exist\n *\n * @private\n * @param {*} value A value to examine\n * @param {string} method The name of the method to look for\n * @param {name} name A name to use for the error message\n * @param {string} methodPath The name of the method to use for error messages\n * @throws {TypeError} When the method doesn't exist\n */\n\nfunction assertMethodExists(value, method, name, methodPath) {\n  if (value[method] === null || value[method] === undefined) {\n    throw new TypeError(\"Expected \" + name + \" to have method \" + methodPath);\n  }\n}\n\nmodule.exports = assertMethodExists;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/assert-method-exists.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/assert-type.js":
/*!************************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/assert-type.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar typeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").typeOf;\n/**\n * Ensures that value is of type\n *\n * @private\n * @param {*} value A value to examine\n * @param {string} type A basic JavaScript type to compare to, e.g. \"object\", \"string\"\n * @param {string} name A string to use for the error message\n * @throws {TypeError} If value is not of the expected type\n * @returns {undefined}\n */\n\n\nfunction assertType(value, type, name) {\n  var actual = typeOf(value);\n\n  if (actual !== type) {\n    throw new TypeError(\"Expected type of \" + name + \" to be \" + type + \", but was \" + actual);\n  }\n}\n\nmodule.exports = assertType;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/assert-type.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/is-iterable.js":
/*!************************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/is-iterable.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar typeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").typeOf;\n/**\n * Returns `true` for iterables\n *\n * @private\n * @param {*} value A value to examine\n * @returns {boolean} Returns `true` when `value` looks like an iterable\n */\n\n\nfunction isIterable(value) {\n  return Boolean(value) && typeOf(value.forEach) === \"function\";\n}\n\nmodule.exports = isIterable;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/is-iterable.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/is-matcher.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/is-matcher.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isPrototypeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object.isPrototypeOf;\n\nvar matcherPrototype = __webpack_require__(/*! ./matcher-prototype */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/matcher-prototype.js\");\n/**\n * Returns `true` when `object` is a matcher\n *\n * @private\n * @param {*} object A value to examine\n * @returns {boolean} Returns `true` when `object` is a matcher\n */\n\n\nfunction isMatcher(object) {\n  return isPrototypeOf(matcherPrototype, object);\n}\n\nmodule.exports = isMatcher;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/is-matcher.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/match-object.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/match-object.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar every = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.every;\n\nvar typeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").typeOf;\n\nvar deepEqualFactory = __webpack_require__(/*! ../deep-equal */ \"./node_modules/@sinonjs/samsam/lib/deep-equal.js\").use;\n\nvar isMatcher = __webpack_require__(/*! ./is-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/is-matcher.js\");\n/**\n * Matches `actual` with `expectation`\n *\n * @private\n * @param {*} actual A value to examine\n * @param {object} expectation An object with properties to match on\n * @returns {boolean} Returns true when `actual` matches all properties in `expectation`\n */\n\n\nfunction matchObject(actual, expectation, matcher) {\n  var deepEqual = deepEqualFactory(matcher);\n\n  if (actual === null || actual === undefined) {\n    return false;\n  }\n\n  return every(Object.keys(expectation), function (key) {\n    var exp = expectation[key];\n    var act = actual[key];\n\n    if (isMatcher(exp)) {\n      if (!exp.test(act)) {\n        return false;\n      }\n    } else if (typeOf(exp) === \"object\") {\n      if (!matchObject(act, exp, matcher)) {\n        return false;\n      }\n    } else if (!deepEqual(act, exp)) {\n      return false;\n    }\n\n    return true;\n  });\n}\n\nmodule.exports = matchObject;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/match-object.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/matcher-prototype.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/matcher-prototype.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar matcherPrototype = {\n  toString: function () {\n    return this.message;\n  }\n};\n\nmatcherPrototype.or = function (valueOrMatcher) {\n  var createMatcher = __webpack_require__(/*! ../create-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher.js\");\n\n  var isMatcher = createMatcher.isMatcher;\n\n  if (!arguments.length) {\n    throw new TypeError(\"Matcher expected\");\n  }\n\n  var m2 = isMatcher(valueOrMatcher) ? valueOrMatcher : createMatcher(valueOrMatcher);\n  var m1 = this;\n  var or = Object.create(matcherPrototype);\n\n  or.test = function (actual) {\n    return m1.test(actual) || m2.test(actual);\n  };\n\n  or.message = m1.message + \".or(\" + m2.message + \")\";\n  return or;\n};\n\nmatcherPrototype.and = function (valueOrMatcher) {\n  var createMatcher = __webpack_require__(/*! ../create-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher.js\");\n\n  var isMatcher = createMatcher.isMatcher;\n\n  if (!arguments.length) {\n    throw new TypeError(\"Matcher expected\");\n  }\n\n  var m2 = isMatcher(valueOrMatcher) ? valueOrMatcher : createMatcher(valueOrMatcher);\n  var m1 = this;\n  var and = Object.create(matcherPrototype);\n\n  and.test = function (actual) {\n    return m1.test(actual) && m2.test(actual);\n  };\n\n  and.message = m1.message + \".and(\" + m2.message + \")\";\n  return and;\n};\n\nmodule.exports = matcherPrototype;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/matcher-prototype.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/create-matcher/type-map.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/create-matcher/type-map.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar join = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.join;\n\nvar map = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.map;\n\nvar stringIndexOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.string.indexOf;\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar matchObject = __webpack_require__(/*! ./match-object */ \"./node_modules/@sinonjs/samsam/lib/create-matcher/match-object.js\");\n\nvar createTypeMap = function (match) {\n  return {\n    function: function (m, expectation, message) {\n      m.test = expectation;\n      m.message = message || \"match(\" + functionName(expectation) + \")\";\n    },\n    number: function (m, expectation) {\n      m.test = function (actual) {\n        // we need type coercion here\n        return expectation == actual; // eslint-disable-line eqeqeq\n      };\n    },\n    object: function (m, expectation) {\n      var array = [];\n\n      if (typeof expectation.test === \"function\") {\n        m.test = function (actual) {\n          return expectation.test(actual) === true;\n        };\n\n        m.message = \"match(\" + functionName(expectation.test) + \")\";\n        return m;\n      }\n\n      array = map(Object.keys(expectation), function (key) {\n        return key + \": \" + valueToString(expectation[key]);\n      });\n\n      m.test = function (actual) {\n        return matchObject(actual, expectation, match);\n      };\n\n      m.message = \"match(\" + join(array, \", \") + \")\";\n      return m;\n    },\n    regexp: function (m, expectation) {\n      m.test = function (actual) {\n        return typeof actual === \"string\" && expectation.test(actual);\n      };\n    },\n    string: function (m, expectation) {\n      m.test = function (actual) {\n        return typeof actual === \"string\" && stringIndexOf(actual, expectation) !== -1;\n      };\n\n      m.message = 'match(\"' + expectation + '\")';\n    }\n  };\n};\n\nmodule.exports = createTypeMap;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/create-matcher/type-map.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/deep-equal.js":
/*!********************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/deep-equal.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar className = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").className;\n\nvar typeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").typeOf;\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar objectProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object;\n\nvar mapForEach = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.map.forEach;\n\nvar getClass = __webpack_require__(/*! ./get-class */ \"./node_modules/@sinonjs/samsam/lib/get-class.js\");\n\nvar identical = __webpack_require__(/*! ./identical */ \"./node_modules/@sinonjs/samsam/lib/identical.js\");\n\nvar isArguments = __webpack_require__(/*! ./is-arguments */ \"./node_modules/@sinonjs/samsam/lib/is-arguments.js\");\n\nvar isDate = __webpack_require__(/*! ./is-date */ \"./node_modules/@sinonjs/samsam/lib/is-date.js\");\n\nvar isElement = __webpack_require__(/*! ./is-element */ \"./node_modules/@sinonjs/samsam/lib/is-element.js\");\n\nvar isMap = __webpack_require__(/*! ./is-map */ \"./node_modules/@sinonjs/samsam/lib/is-map.js\");\n\nvar isNaN = __webpack_require__(/*! ./is-nan */ \"./node_modules/@sinonjs/samsam/lib/is-nan.js\");\n\nvar isObject = __webpack_require__(/*! ./is-object */ \"./node_modules/@sinonjs/samsam/lib/is-object.js\");\n\nvar isSet = __webpack_require__(/*! ./is-set */ \"./node_modules/@sinonjs/samsam/lib/is-set.js\");\n\nvar isSubset = __webpack_require__(/*! ./is-subset */ \"./node_modules/@sinonjs/samsam/lib/is-subset.js\");\n\nvar concat = arrayProto.concat;\nvar every = arrayProto.every;\nvar push = arrayProto.push;\nvar getTime = Date.prototype.getTime;\nvar hasOwnProperty = objectProto.hasOwnProperty;\nvar indexOf = arrayProto.indexOf;\nvar keys = Object.keys;\nvar getOwnPropertySymbols = Object.getOwnPropertySymbols;\n/**\n * Deep equal comparison. Two values are \"deep equal\" when:\n *\n *   - They are equal, according to samsam.identical\n *   - They are both date objects representing the same time\n *   - They are both arrays containing elements that are all deepEqual\n *   - They are objects with the same set of properties, and each property\n *     in ``actual`` is deepEqual to the corresponding property in ``expectation``\n *\n * Supports cyclic objects.\n *\n * @alias module:samsam.deepEqual\n * @param {*} actual The object to examine\n * @param {*} expectation The object actual is expected to be equal to\n * @param {object} match A value to match on\n * @returns {boolean} Returns true when actual and expectation are considered equal\n */\n\nfunction deepEqualCyclic(actual, expectation, match) {\n  // used for cyclic comparison\n  // contain already visited objects\n  var actualObjects = [];\n  var expectationObjects = []; // contain pathes (position in the object structure)\n  // of the already visited objects\n  // indexes same as in objects arrays\n\n  var actualPaths = [];\n  var expectationPaths = []; // contains combinations of already compared objects\n  // in the manner: { \"$1['ref']$2['ref']\": true }\n\n  var compared = {}; // does the recursion for the deep equal check\n  // eslint-disable-next-line complexity\n\n  return function deepEqual(actualObj, expectationObj, actualPath, expectationPath) {\n    // If both are matchers they must be the same instance in order to be\n    // considered equal If we didn't do that we would end up running one\n    // matcher against the other\n    if (match && match.isMatcher(expectationObj)) {\n      if (match.isMatcher(actualObj)) {\n        return actualObj === expectationObj;\n      }\n\n      return expectationObj.test(actualObj);\n    }\n\n    var actualType = typeof actualObj;\n    var expectationType = typeof expectationObj;\n\n    if (actualObj === expectationObj || isNaN(actualObj) || isNaN(expectationObj) || actualObj === null || expectationObj === null || actualObj === undefined || expectationObj === undefined || actualType !== \"object\" || expectationType !== \"object\") {\n      return identical(actualObj, expectationObj);\n    } // Elements are only equal if identical(expected, actual)\n\n\n    if (isElement(actualObj) || isElement(expectationObj)) {\n      return false;\n    }\n\n    var isActualDate = isDate(actualObj);\n    var isExpectationDate = isDate(expectationObj);\n\n    if (isActualDate || isExpectationDate) {\n      if (!isActualDate || !isExpectationDate || getTime.call(actualObj) !== getTime.call(expectationObj)) {\n        return false;\n      }\n    }\n\n    if (actualObj instanceof RegExp && expectationObj instanceof RegExp) {\n      if (valueToString(actualObj) !== valueToString(expectationObj)) {\n        return false;\n      }\n    }\n\n    if (actualObj instanceof Error && expectationObj instanceof Error) {\n      return actualObj === expectationObj;\n    }\n\n    var actualClass = getClass(actualObj);\n    var expectationClass = getClass(expectationObj);\n    var actualKeys = keys(actualObj);\n    var expectationKeys = keys(expectationObj);\n    var actualName = className(actualObj);\n    var expectationName = className(expectationObj);\n    var expectationSymbols = typeOf(getOwnPropertySymbols) === \"function\" ? getOwnPropertySymbols(expectationObj) :\n    /* istanbul ignore next: cannot collect coverage for engine that doesn't support Symbol */\n    [];\n    var expectationKeysAndSymbols = concat(expectationKeys, expectationSymbols);\n\n    if (isArguments(actualObj) || isArguments(expectationObj)) {\n      if (actualObj.length !== expectationObj.length) {\n        return false;\n      }\n    } else {\n      if (actualType !== expectationType || actualClass !== expectationClass || actualKeys.length !== expectationKeys.length || actualName && expectationName && actualName !== expectationName) {\n        return false;\n      }\n    }\n\n    if (isSet(actualObj) || isSet(expectationObj)) {\n      if (!isSet(actualObj) || !isSet(expectationObj) || actualObj.size !== expectationObj.size) {\n        return false;\n      }\n\n      return isSubset(actualObj, expectationObj, deepEqual);\n    }\n\n    if (isMap(actualObj) || isMap(expectationObj)) {\n      if (!isMap(actualObj) || !isMap(expectationObj) || actualObj.size !== expectationObj.size) {\n        return false;\n      }\n\n      var mapsDeeplyEqual = true;\n      mapForEach(actualObj, function (value, key) {\n        mapsDeeplyEqual = mapsDeeplyEqual && deepEqualCyclic(value, expectationObj.get(key));\n      });\n      return mapsDeeplyEqual;\n    }\n\n    return every(expectationKeysAndSymbols, function (key) {\n      if (!hasOwnProperty(actualObj, key)) {\n        return false;\n      }\n\n      var actualValue = actualObj[key];\n      var expectationValue = expectationObj[key];\n      var actualObject = isObject(actualValue);\n      var expectationObject = isObject(expectationValue); // determines, if the objects were already visited\n      // (it's faster to check for isObject first, than to\n      // get -1 from getIndex for non objects)\n\n      var actualIndex = actualObject ? indexOf(actualObjects, actualValue) : -1;\n      var expectationIndex = expectationObject ? indexOf(expectationObjects, expectationValue) : -1; // determines the new paths of the objects\n      // - for non cyclic objects the current path will be extended\n      //   by current property name\n      // - for cyclic objects the stored path is taken\n\n      var newActualPath = actualIndex !== -1 ? actualPaths[actualIndex] : actualPath + \"[\" + JSON.stringify(key) + \"]\";\n      var newExpectationPath = expectationIndex !== -1 ? expectationPaths[expectationIndex] : expectationPath + \"[\" + JSON.stringify(key) + \"]\";\n      var combinedPath = newActualPath + newExpectationPath; // stop recursion if current objects are already compared\n\n      if (compared[combinedPath]) {\n        return true;\n      } // remember the current objects and their paths\n\n\n      if (actualIndex === -1 && actualObject) {\n        push(actualObjects, actualValue);\n        push(actualPaths, newActualPath);\n      }\n\n      if (expectationIndex === -1 && expectationObject) {\n        push(expectationObjects, expectationValue);\n        push(expectationPaths, newExpectationPath);\n      } // remember that the current objects are already compared\n\n\n      if (actualObject && expectationObject) {\n        compared[combinedPath] = true;\n      } // End of cyclic logic\n      // neither actualValue nor expectationValue is a cycle\n      // continue with next level\n\n\n      return deepEqual(actualValue, expectationValue, newActualPath, newExpectationPath);\n    });\n  }(actual, expectation, \"$1\", \"$2\");\n}\n\ndeepEqualCyclic.use = function (match) {\n  return function deepEqual(a, b) {\n    return deepEqualCyclic(a, b, match);\n  };\n};\n\nmodule.exports = deepEqualCyclic;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/deep-equal.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/get-class.js":
/*!*******************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/get-class.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar toString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object.toString;\n/**\n * Returns the internal `Class` by calling `Object.prototype.toString`\n * with the provided value as `this`. Return value is a `String`, naming the\n * internal class, e.g. \"Array\"\n *\n * @private\n * @param  {*} value - Any value\n * @returns {string} - A string representation of the `Class` of `value`\n */\n\n\nfunction getClass(value) {\n  return toString(value).split(/[ \\]]/)[1];\n}\n\nmodule.exports = getClass;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/get-class.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/identical.js":
/*!*******************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/identical.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isNaN = __webpack_require__(/*! ./is-nan */ \"./node_modules/@sinonjs/samsam/lib/is-nan.js\");\n\nvar isNegZero = __webpack_require__(/*! ./is-neg-zero */ \"./node_modules/@sinonjs/samsam/lib/is-neg-zero.js\");\n/**\n * Strict equality check according to EcmaScript Harmony's `egal`.\n *\n * **From the Harmony wiki:**\n * > An `egal` function simply makes available the internal `SameValue` function\n * > from section 9.12 of the ES5 spec. If two values are egal, then they are not\n * > observably distinguishable.\n *\n * `identical` returns `true` when `===` is `true`, except for `-0` and\n * `+0`, where it returns `false`. Additionally, it returns `true` when\n * `NaN` is compared to itself.\n *\n * @alias module:samsam.identical\n * @param {*} obj1 The first value to compare\n * @param {*} obj2 The second value to compare\n * @returns {boolean} Returns `true` when the objects are *egal*, `false` otherwise\n */\n\n\nfunction identical(obj1, obj2) {\n  if (obj1 === obj2 || isNaN(obj1) && isNaN(obj2)) {\n    return obj1 !== 0 || isNegZero(obj1) === isNegZero(obj2);\n  }\n\n  return false;\n}\n\nmodule.exports = identical;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/identical.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-arguments.js":
/*!**********************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-arguments.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar getClass = __webpack_require__(/*! ./get-class */ \"./node_modules/@sinonjs/samsam/lib/get-class.js\");\n/**\n * Returns `true` when `object` is an `arguments` object, `false` otherwise\n *\n * @alias module:samsam.isArguments\n * @param  {*}  object - The object to examine\n * @returns {boolean} `true` when `object` is an `arguments` object\n */\n\n\nfunction isArguments(object) {\n  return getClass(object) === \"Arguments\";\n}\n\nmodule.exports = isArguments;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-arguments.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-array-type.js":
/*!***********************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-array-type.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar indexOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.indexOf;\n\nvar map = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.map;\n\nvar ARRAY_TYPES = __webpack_require__(/*! ./array-types */ \"./node_modules/@sinonjs/samsam/lib/array-types.js\");\n\nvar type = __webpack_require__(/*! type-detect */ \"./node_modules/type-detect/type-detect.js\");\n/**\n * Returns `true` when `object` is an array type, `false` otherwise\n *\n * @param  {*}  object - The object to examine\n * @returns {boolean} `true` when `object` is an array type\n * @private\n */\n\n\nfunction isArrayType(object) {\n  return indexOf(map(ARRAY_TYPES, functionName), type(object)) !== -1;\n}\n\nmodule.exports = isArrayType;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-array-type.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-date.js":
/*!*****************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-date.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns `true` when `value` is an instance of Date\n *\n * @private\n * @param  {Date}  value The value to examine\n * @returns {boolean}     `true` when `value` is an instance of Date\n */\n\nfunction isDate(value) {\n  return value instanceof Date;\n}\n\nmodule.exports = isDate;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-date.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-element.js":
/*!********************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-element.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar div = typeof document !== \"undefined\" && document.createElement(\"div\");\n/**\n * Returns `true` when `object` is a DOM element node.\n *\n * Unlike Underscore.js/lodash, this function will return `false` if `object`\n * is an *element-like* object, i.e. a regular object with a `nodeType`\n * property that holds the value `1`.\n *\n * @alias module:samsam.isElement\n * @param {object} object The object to examine\n * @returns {boolean} Returns `true` for DOM element nodes\n */\n\nfunction isElement(object) {\n  if (!object || object.nodeType !== 1 || !div) {\n    return false;\n  }\n\n  try {\n    object.appendChild(div);\n    object.removeChild(div);\n  } catch (e) {\n    return false;\n  }\n\n  return true;\n}\n\nmodule.exports = isElement;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-element.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-map.js":
/*!****************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-map.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns `true` when `value` is a Map\n *\n * @param {*} value A value to examine\n * @returns {boolean} `true` when `value` is an instance of `Map`, `false` otherwise\n * @private\n */\n\nfunction isMap(value) {\n  return typeof Map !== \"undefined\" && value instanceof Map;\n}\n\nmodule.exports = isMap;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-map.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-nan.js":
/*!****************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-nan.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Compares a `value` to `NaN`\n *\n * @private\n * @param {*} value A value to examine\n * @returns {boolean} Returns `true` when `value` is `NaN`\n */\n\nfunction isNaN(value) {\n  // Unlike global `isNaN`, this function avoids type coercion\n  // `typeof` check avoids IE host object issues, hat tip to\n  // lodash\n  // eslint-disable-next-line no-self-compare\n  return typeof value === \"number\" && value !== value;\n}\n\nmodule.exports = isNaN;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-nan.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-neg-zero.js":
/*!*********************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-neg-zero.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns `true` when `value` is `-0`\n *\n * @alias module:samsam.isNegZero\n * @param {*} value A value to examine\n * @returns {boolean} Returns `true` when `value` is `-0`\n */\n\nfunction isNegZero(value) {\n  return value === 0 && 1 / value === -Infinity;\n}\n\nmodule.exports = isNegZero;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-neg-zero.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-object.js":
/*!*******************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-object.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns `true` when the value is a regular Object and not a specialized Object\n *\n * This helps speed up deepEqual cyclic checks\n *\n * The premise is that only Objects are stored in the visited array.\n * So if this function returns false, we don't have to do the\n * expensive operation of searching for the value in the the array of already\n * visited objects\n *\n * @private\n * @param  {object}   value The object to examine\n * @returns {boolean}       `true` when the object is a non-specialised object\n */\n\nfunction isObject(value) {\n  return typeof value === \"object\" && value !== null && // none of these are collection objects, so we can return false\n  !(value instanceof Boolean) && !(value instanceof Date) && !(value instanceof Error) && !(value instanceof Number) && !(value instanceof RegExp) && !(value instanceof String);\n}\n\nmodule.exports = isObject;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-object.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-set.js":
/*!****************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-set.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Returns `true` when the argument is an instance of Set, `false` otherwise\n *\n * @alias module:samsam.isSet\n * @param  {*}  val - A value to examine\n * @returns {boolean} Returns `true` when the argument is an instance of Set, `false` otherwise\n */\n\nfunction isSet(val) {\n  return typeof Set !== \"undefined\" && val instanceof Set || false;\n}\n\nmodule.exports = isSet;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-set.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/is-subset.js":
/*!*******************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/is-subset.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar forEach = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.set.forEach;\n/**\n * Returns `true` when `s1` is a subset of `s2`, `false` otherwise\n *\n * @private\n * @param  {Array|Set}  s1      The target value\n * @param  {Array|Set}  s2      The containing value\n * @param  {Function}  compare A comparison function, should return `true` when\n *                             values are considered equal\n * @returns {boolean} Returns `true` when `s1` is a subset of `s2`, `false`` otherwise\n */\n\n\nfunction isSubset(s1, s2, compare) {\n  var allContained = true;\n  forEach(s1, function (v1) {\n    var includes = false;\n    forEach(s2, function (v2) {\n      if (compare(v2, v1)) {\n        includes = true;\n      }\n    });\n    allContained = allContained && includes;\n  });\n  return allContained;\n}\n\nmodule.exports = isSubset;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/is-subset.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/iterable-to-string.js":
/*!****************************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/iterable-to-string.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar slice = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.string.slice;\n\nvar typeOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").typeOf;\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n/**\n * Creates a string represenation of an iterable object\n *\n * @private\n * @param   {object} obj The iterable object to stringify\n * @returns {string}     A string representation\n */\n\n\nfunction iterableToString(obj) {\n  if (typeOf(obj) === \"map\") {\n    return mapToString(obj);\n  }\n\n  return genericIterableToString(obj);\n}\n/**\n * Creates a string representation of a Map\n *\n * @private\n * @param   {Map} map    The map to stringify\n * @returns {string}     A string representation\n */\n\n\nfunction mapToString(map) {\n  var representation = \"\";\n  /* eslint-disable-next-line local-rules/no-prototype-methods */\n\n  map.forEach(function (value, key) {\n    representation += \"[\" + stringify(key) + \",\" + stringify(value) + \"],\";\n  });\n  representation = slice(representation, 0, -1);\n  return representation;\n}\n/**\n * Create a string represenation for an iterable\n *\n * @private\n * @param   {object} iterable The iterable to stringify\n * @returns {string}          A string representation\n */\n\n\nfunction genericIterableToString(iterable) {\n  var representation = \"\";\n  /* eslint-disable-next-line local-rules/no-prototype-methods */\n\n  iterable.forEach(function (value) {\n    representation += stringify(value) + \",\";\n  });\n  representation = slice(representation, 0, -1);\n  return representation;\n}\n/**\n * Creates a string representation of the passed `item`\n *\n * @private\n * @param  {object} item The item to stringify\n * @returns {string}      A string representation of `item`\n */\n\n\nfunction stringify(item) {\n  return typeof item === \"string\" ? \"'\" + item + \"'\" : valueToString(item);\n}\n\nmodule.exports = iterableToString;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/iterable-to-string.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/match.js":
/*!***************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/match.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar indexOf = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.string.indexOf;\n\nvar forEach = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.forEach;\n\nvar type = __webpack_require__(/*! type-detect */ \"./node_modules/type-detect/type-detect.js\");\n\nvar engineCanCompareMaps = typeof Array.from === \"function\";\n\nvar deepEqual = __webpack_require__(/*! ./deep-equal */ \"./node_modules/@sinonjs/samsam/lib/deep-equal.js\").use(match); // eslint-disable-line no-use-before-define\n\n\nvar isArrayType = __webpack_require__(/*! ./is-array-type */ \"./node_modules/@sinonjs/samsam/lib/is-array-type.js\");\n\nvar isSubset = __webpack_require__(/*! ./is-subset */ \"./node_modules/@sinonjs/samsam/lib/is-subset.js\");\n\nvar createMatcher = __webpack_require__(/*! ./create-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher.js\");\n/**\n * Returns true when `array` contains all of `subset` as defined by the `compare`\n * argument\n *\n * @param  {Array} array   An array to search for a subset\n * @param  {Array} subset  The subset to find in the array\n * @param  {Function} compare A comparison function\n * @returns {boolean}         [description]\n * @private\n */\n\n\nfunction arrayContains(array, subset, compare) {\n  if (subset.length === 0) {\n    return true;\n  }\n\n  var i, l, j, k;\n\n  for (i = 0, l = array.length; i < l; ++i) {\n    if (compare(array[i], subset[0])) {\n      for (j = 0, k = subset.length; j < k; ++j) {\n        if (i + j >= l) {\n          return false;\n        }\n\n        if (!compare(array[i + j], subset[j])) {\n          return false;\n        }\n      }\n\n      return true;\n    }\n  }\n\n  return false;\n}\n/* eslint-disable complexity */\n\n/**\n * Matches an object with a matcher (or value)\n *\n * @alias module:samsam.match\n * @param {object} object The object candidate to match\n * @param {object} matcherOrValue A matcher or value to match against\n * @returns {boolean} true when `object` matches `matcherOrValue`\n */\n\n\nfunction match(object, matcherOrValue) {\n  if (matcherOrValue && typeof matcherOrValue.test === \"function\") {\n    return matcherOrValue.test(object);\n  }\n\n  switch (type(matcherOrValue)) {\n    case \"bigint\":\n    case \"boolean\":\n    case \"number\":\n    case \"symbol\":\n      return matcherOrValue === object;\n\n    case \"function\":\n      return matcherOrValue(object) === true;\n\n    case \"string\":\n      var notNull = typeof object === \"string\" || Boolean(object);\n      return notNull && indexOf(valueToString(object).toLowerCase(), matcherOrValue.toLowerCase()) >= 0;\n\n    case \"null\":\n      return object === null;\n\n    case \"undefined\":\n      return typeof object === \"undefined\";\n\n    case \"Date\":\n      /* istanbul ignore else */\n      if (type(object) === \"Date\") {\n        return object.getTime() === matcherOrValue.getTime();\n      }\n      /* istanbul ignore next: this is basically the rest of the function, which is covered */\n\n\n      break;\n\n    case \"Array\":\n    case \"Int8Array\":\n    case \"Uint8Array\":\n    case \"Uint8ClampedArray\":\n    case \"Int16Array\":\n    case \"Uint16Array\":\n    case \"Int32Array\":\n    case \"Uint32Array\":\n    case \"Float32Array\":\n    case \"Float64Array\":\n      return isArrayType(matcherOrValue) && arrayContains(object, matcherOrValue, match);\n\n    case \"Map\":\n      /* istanbul ignore next: this is covered by a test, that is only run in IE, but we collect coverage information in node*/\n      if (!engineCanCompareMaps) {\n        throw new Error(\"The JavaScript engine does not support Array.from and cannot reliably do value comparison of Map instances\");\n      }\n\n      return type(object) === \"Map\" && arrayContains(Array.from(object), Array.from(matcherOrValue), match);\n\n    default:\n      break;\n  }\n\n  switch (type(object)) {\n    case \"null\":\n      return false;\n\n    case \"Set\":\n      return isSubset(matcherOrValue, object, match);\n\n    default:\n      break;\n  }\n  /* istanbul ignore else */\n\n\n  if (matcherOrValue && typeof matcherOrValue === \"object\") {\n    if (matcherOrValue === object) {\n      return true;\n    }\n\n    if (typeof object !== \"object\") {\n      return false;\n    }\n\n    var prop; // eslint-disable-next-line guard-for-in\n\n    for (prop in matcherOrValue) {\n      var value = object[prop];\n\n      if (typeof value === \"undefined\" && typeof object.getAttribute === \"function\") {\n        value = object.getAttribute(prop);\n      }\n\n      if (matcherOrValue[prop] === null || typeof matcherOrValue[prop] === \"undefined\") {\n        if (value !== matcherOrValue[prop]) {\n          return false;\n        }\n      } else if (typeof value === \"undefined\" || !deepEqual(value, matcherOrValue[prop])) {\n        return false;\n      }\n    }\n\n    return true;\n  }\n  /* istanbul ignore next */\n\n\n  throw new Error(\"Matcher was an unknown or unsupported type\");\n}\n/* eslint-enable complexity */\n\n\nforEach(Object.keys(createMatcher), function (key) {\n  match[key] = createMatcher[key];\n});\nmodule.exports = match;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/match.js?");

/***/ }),

/***/ "./node_modules/@sinonjs/samsam/lib/samsam.js":
/*!****************************************************!*\
  !*** ./node_modules/@sinonjs/samsam/lib/samsam.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @module samsam\n */\n\nvar identical = __webpack_require__(/*! ./identical */ \"./node_modules/@sinonjs/samsam/lib/identical.js\");\n\nvar isArguments = __webpack_require__(/*! ./is-arguments */ \"./node_modules/@sinonjs/samsam/lib/is-arguments.js\");\n\nvar isElement = __webpack_require__(/*! ./is-element */ \"./node_modules/@sinonjs/samsam/lib/is-element.js\");\n\nvar isNegZero = __webpack_require__(/*! ./is-neg-zero */ \"./node_modules/@sinonjs/samsam/lib/is-neg-zero.js\");\n\nvar isSet = __webpack_require__(/*! ./is-set */ \"./node_modules/@sinonjs/samsam/lib/is-set.js\");\n\nvar isMap = __webpack_require__(/*! ./is-map */ \"./node_modules/@sinonjs/samsam/lib/is-map.js\");\n\nvar match = __webpack_require__(/*! ./match */ \"./node_modules/@sinonjs/samsam/lib/match.js\");\n\nvar deepEqualCyclic = __webpack_require__(/*! ./deep-equal */ \"./node_modules/@sinonjs/samsam/lib/deep-equal.js\").use(match);\n\nvar createMatcher = __webpack_require__(/*! ./create-matcher */ \"./node_modules/@sinonjs/samsam/lib/create-matcher.js\");\n\nmodule.exports = {\n  createMatcher: createMatcher,\n  deepEqual: deepEqualCyclic,\n  identical: identical,\n  isArguments: isArguments,\n  isElement: isElement,\n  isMap: isMap,\n  isNegZero: isNegZero,\n  isSet: isSet,\n  match: match\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/@sinonjs/samsam/lib/samsam.js?");

/***/ }),

/***/ "./node_modules/diff/dist/diff.js":
/*!****************************************!*\
  !*** ./node_modules/diff/dist/diff.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*!\n\n diff v4.0.1\n\nSoftware License Agreement (BSD License)\n\nCopyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>\n\nAll rights reserved.\n\nRedistribution and use of this software in source and binary forms, with or without modification,\nare permitted provided that the following conditions are met:\n\n* Redistributions of source code must retain the above\n  copyright notice, this list of conditions and the\n  following disclaimer.\n\n* Redistributions in binary form must reproduce the above\n  copyright notice, this list of conditions and the\n  following disclaimer in the documentation and/or other\n  materials provided with the distribution.\n\n* Neither the name of Kevin Decker nor the names of its\n  contributors may be used to endorse or promote products\n  derived from this software without specific prior\n  written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR\nIMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND\nFITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR\nCONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\nDATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER\nIN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT\nOF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n@license\n*/\n(function (global, factory) {\n   true ? factory(exports) : undefined;\n})(this, function (exports) {\n  'use strict';\n\n  function Diff() {}\n\n  Diff.prototype = {\n    diff: function diff(oldString, newString) {\n      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n      var callback = options.callback;\n\n      if (typeof options === 'function') {\n        callback = options;\n        options = {};\n      }\n\n      this.options = options;\n      var self = this;\n\n      function done(value) {\n        if (callback) {\n          setTimeout(function () {\n            callback(undefined, value);\n          }, 0);\n          return true;\n        } else {\n          return value;\n        }\n      } // Allow subclasses to massage the input prior to running\n\n\n      oldString = this.castInput(oldString);\n      newString = this.castInput(newString);\n      oldString = this.removeEmpty(this.tokenize(oldString));\n      newString = this.removeEmpty(this.tokenize(newString));\n      var newLen = newString.length,\n          oldLen = oldString.length;\n      var editLength = 1;\n      var maxEditLength = newLen + oldLen;\n      var bestPath = [{\n        newPos: -1,\n        components: []\n      }]; // Seed editLength = 0, i.e. the content starts with the same values\n\n      var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);\n\n      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {\n        // Identity per the equality and tokenizer\n        return done([{\n          value: this.join(newString),\n          count: newString.length\n        }]);\n      } // Main worker method. checks all permutations of a given edit length for acceptance.\n\n\n      function execEditLength() {\n        for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {\n          var basePath = void 0;\n\n          var addPath = bestPath[diagonalPath - 1],\n              removePath = bestPath[diagonalPath + 1],\n              _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;\n\n          if (addPath) {\n            // No one else is going to attempt to use this value, clear it\n            bestPath[diagonalPath - 1] = undefined;\n          }\n\n          var canAdd = addPath && addPath.newPos + 1 < newLen,\n              canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;\n\n          if (!canAdd && !canRemove) {\n            // If this path is a terminal then prune\n            bestPath[diagonalPath] = undefined;\n            continue;\n          } // Select the diagonal that we want to branch from. We select the prior\n          // path whose position in the new string is the farthest from the origin\n          // and does not pass the bounds of the diff graph\n\n\n          if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {\n            basePath = clonePath(removePath);\n            self.pushComponent(basePath.components, undefined, true);\n          } else {\n            basePath = addPath; // No need to clone, we've pulled it from the list\n\n            basePath.newPos++;\n            self.pushComponent(basePath.components, true, undefined);\n          }\n\n          _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath); // If we have hit the end of both strings, then we are done\n\n          if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {\n            return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));\n          } else {\n            // Otherwise track this path as a potential candidate and continue.\n            bestPath[diagonalPath] = basePath;\n          }\n        }\n\n        editLength++;\n      } // Performs the length of edit iteration. Is a bit fugly as this has to support the\n      // sync and async mode which is never fun. Loops over execEditLength until a value\n      // is produced.\n\n\n      if (callback) {\n        (function exec() {\n          setTimeout(function () {\n            // This should not happen, but we want to be safe.\n\n            /* istanbul ignore next */\n            if (editLength > maxEditLength) {\n              return callback();\n            }\n\n            if (!execEditLength()) {\n              exec();\n            }\n          }, 0);\n        })();\n      } else {\n        while (editLength <= maxEditLength) {\n          var ret = execEditLength();\n\n          if (ret) {\n            return ret;\n          }\n        }\n      }\n    },\n    pushComponent: function pushComponent(components, added, removed) {\n      var last = components[components.length - 1];\n\n      if (last && last.added === added && last.removed === removed) {\n        // We need to clone here as the component clone operation is just\n        // as shallow array clone\n        components[components.length - 1] = {\n          count: last.count + 1,\n          added: added,\n          removed: removed\n        };\n      } else {\n        components.push({\n          count: 1,\n          added: added,\n          removed: removed\n        });\n      }\n    },\n    extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {\n      var newLen = newString.length,\n          oldLen = oldString.length,\n          newPos = basePath.newPos,\n          oldPos = newPos - diagonalPath,\n          commonCount = 0;\n\n      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {\n        newPos++;\n        oldPos++;\n        commonCount++;\n      }\n\n      if (commonCount) {\n        basePath.components.push({\n          count: commonCount\n        });\n      }\n\n      basePath.newPos = newPos;\n      return oldPos;\n    },\n    equals: function equals(left, right) {\n      if (this.options.comparator) {\n        return this.options.comparator(left, right);\n      } else {\n        return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();\n      }\n    },\n    removeEmpty: function removeEmpty(array) {\n      var ret = [];\n\n      for (var i = 0; i < array.length; i++) {\n        if (array[i]) {\n          ret.push(array[i]);\n        }\n      }\n\n      return ret;\n    },\n    castInput: function castInput(value) {\n      return value;\n    },\n    tokenize: function tokenize(value) {\n      return value.split('');\n    },\n    join: function join(chars) {\n      return chars.join('');\n    }\n  };\n\n  function buildValues(diff, components, newString, oldString, useLongestToken) {\n    var componentPos = 0,\n        componentLen = components.length,\n        newPos = 0,\n        oldPos = 0;\n\n    for (; componentPos < componentLen; componentPos++) {\n      var component = components[componentPos];\n\n      if (!component.removed) {\n        if (!component.added && useLongestToken) {\n          var value = newString.slice(newPos, newPos + component.count);\n          value = value.map(function (value, i) {\n            var oldValue = oldString[oldPos + i];\n            return oldValue.length > value.length ? oldValue : value;\n          });\n          component.value = diff.join(value);\n        } else {\n          component.value = diff.join(newString.slice(newPos, newPos + component.count));\n        }\n\n        newPos += component.count; // Common case\n\n        if (!component.added) {\n          oldPos += component.count;\n        }\n      } else {\n        component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));\n        oldPos += component.count; // Reverse add and remove so removes are output first to match common convention\n        // The diffing algorithm is tied to add then remove output and this is the simplest\n        // route to get the desired output with minimal overhead.\n\n        if (componentPos && components[componentPos - 1].added) {\n          var tmp = components[componentPos - 1];\n          components[componentPos - 1] = components[componentPos];\n          components[componentPos] = tmp;\n        }\n      }\n    } // Special case handle for when one terminal is ignored (i.e. whitespace).\n    // For this case we merge the terminal into the prior string and drop the change.\n    // This is only available for string mode.\n\n\n    var lastComponent = components[componentLen - 1];\n\n    if (componentLen > 1 && typeof lastComponent.value === 'string' && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {\n      components[componentLen - 2].value += lastComponent.value;\n      components.pop();\n    }\n\n    return components;\n  }\n\n  function clonePath(path) {\n    return {\n      newPos: path.newPos,\n      components: path.components.slice(0)\n    };\n  }\n\n  var characterDiff = new Diff();\n\n  function diffChars(oldStr, newStr, options) {\n    return characterDiff.diff(oldStr, newStr, options);\n  }\n\n  function generateOptions(options, defaults) {\n    if (typeof options === 'function') {\n      defaults.callback = options;\n    } else if (options) {\n      for (var name in options) {\n        /* istanbul ignore else */\n        if (options.hasOwnProperty(name)) {\n          defaults[name] = options[name];\n        }\n      }\n    }\n\n    return defaults;\n  } //\n  // Ranges and exceptions:\n  // Latin-1 Supplement, 0080–00FF\n  //  - U+00D7  × Multiplication sign\n  //  - U+00F7  ÷ Division sign\n  // Latin Extended-A, 0100–017F\n  // Latin Extended-B, 0180–024F\n  // IPA Extensions, 0250–02AF\n  // Spacing Modifier Letters, 02B0–02FF\n  //  - U+02C7  ˇ &#711;  Caron\n  //  - U+02D8  ˘ &#728;  Breve\n  //  - U+02D9  ˙ &#729;  Dot Above\n  //  - U+02DA  ˚ &#730;  Ring Above\n  //  - U+02DB  ˛ &#731;  Ogonek\n  //  - U+02DC  ˜ &#732;  Small Tilde\n  //  - U+02DD  ˝ &#733;  Double Acute Accent\n  // Latin Extended Additional, 1E00–1EFF\n\n\n  var extendedWordChars = /^[A-Za-z\\xC0-\\u02C6\\u02C8-\\u02D7\\u02DE-\\u02FF\\u1E00-\\u1EFF]+$/;\n  var reWhitespace = /\\S/;\n  var wordDiff = new Diff();\n\n  wordDiff.equals = function (left, right) {\n    if (this.options.ignoreCase) {\n      left = left.toLowerCase();\n      right = right.toLowerCase();\n    }\n\n    return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);\n  };\n\n  wordDiff.tokenize = function (value) {\n    var tokens = value.split(/(\\s+|[()[\\]{}'\"]|\\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.\n\n    for (var i = 0; i < tokens.length - 1; i++) {\n      // If we have an empty string in the next field and we have only word chars before and after, merge\n      if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {\n        tokens[i] += tokens[i + 2];\n        tokens.splice(i + 1, 2);\n        i--;\n      }\n    }\n\n    return tokens;\n  };\n\n  function diffWords(oldStr, newStr, options) {\n    options = generateOptions(options, {\n      ignoreWhitespace: true\n    });\n    return wordDiff.diff(oldStr, newStr, options);\n  }\n\n  function diffWordsWithSpace(oldStr, newStr, options) {\n    return wordDiff.diff(oldStr, newStr, options);\n  }\n\n  var lineDiff = new Diff();\n\n  lineDiff.tokenize = function (value) {\n    var retLines = [],\n        linesAndNewlines = value.split(/(\\n|\\r\\n)/); // Ignore the final empty token that occurs if the string ends with a new line\n\n    if (!linesAndNewlines[linesAndNewlines.length - 1]) {\n      linesAndNewlines.pop();\n    } // Merge the content and line separators into single tokens\n\n\n    for (var i = 0; i < linesAndNewlines.length; i++) {\n      var line = linesAndNewlines[i];\n\n      if (i % 2 && !this.options.newlineIsToken) {\n        retLines[retLines.length - 1] += line;\n      } else {\n        if (this.options.ignoreWhitespace) {\n          line = line.trim();\n        }\n\n        retLines.push(line);\n      }\n    }\n\n    return retLines;\n  };\n\n  function diffLines(oldStr, newStr, callback) {\n    return lineDiff.diff(oldStr, newStr, callback);\n  }\n\n  function diffTrimmedLines(oldStr, newStr, callback) {\n    var options = generateOptions(callback, {\n      ignoreWhitespace: true\n    });\n    return lineDiff.diff(oldStr, newStr, options);\n  }\n\n  var sentenceDiff = new Diff();\n\n  sentenceDiff.tokenize = function (value) {\n    return value.split(/(\\S.+?[.!?])(?=\\s+|$)/);\n  };\n\n  function diffSentences(oldStr, newStr, callback) {\n    return sentenceDiff.diff(oldStr, newStr, callback);\n  }\n\n  var cssDiff = new Diff();\n\n  cssDiff.tokenize = function (value) {\n    return value.split(/([{}:;,]|\\s+)/);\n  };\n\n  function diffCss(oldStr, newStr, callback) {\n    return cssDiff.diff(oldStr, newStr, callback);\n  }\n\n  function _typeof(obj) {\n    if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") {\n      _typeof = function (obj) {\n        return typeof obj;\n      };\n    } else {\n      _typeof = function (obj) {\n        return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n      };\n    }\n\n    return _typeof(obj);\n  }\n\n  function _toConsumableArray(arr) {\n    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();\n  }\n\n  function _arrayWithoutHoles(arr) {\n    if (Array.isArray(arr)) {\n      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];\n\n      return arr2;\n    }\n  }\n\n  function _iterableToArray(iter) {\n    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter);\n  }\n\n  function _nonIterableSpread() {\n    throw new TypeError(\"Invalid attempt to spread non-iterable instance\");\n  }\n\n  var objectPrototypeToString = Object.prototype.toString;\n  var jsonDiff = new Diff(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a\n  // dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:\n\n  jsonDiff.useLongestToken = true;\n  jsonDiff.tokenize = lineDiff.tokenize;\n\n  jsonDiff.castInput = function (value) {\n    var _this$options = this.options,\n        undefinedReplacement = _this$options.undefinedReplacement,\n        _this$options$stringi = _this$options.stringifyReplacer,\n        stringifyReplacer = _this$options$stringi === void 0 ? function (k, v) {\n      return typeof v === 'undefined' ? undefinedReplacement : v;\n    } : _this$options$stringi;\n    return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');\n  };\n\n  jsonDiff.equals = function (left, right) {\n    return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\\r\\n])/g, '$1'), right.replace(/,([\\r\\n])/g, '$1'));\n  };\n\n  function diffJson(oldObj, newObj, options) {\n    return jsonDiff.diff(oldObj, newObj, options);\n  } // This function handles the presence of circular references by bailing out when encountering an\n  // object that is already on the \"stack\" of items being processed. Accepts an optional replacer\n\n\n  function canonicalize(obj, stack, replacementStack, replacer, key) {\n    stack = stack || [];\n    replacementStack = replacementStack || [];\n\n    if (replacer) {\n      obj = replacer(key, obj);\n    }\n\n    var i;\n\n    for (i = 0; i < stack.length; i += 1) {\n      if (stack[i] === obj) {\n        return replacementStack[i];\n      }\n    }\n\n    var canonicalizedObj;\n\n    if ('[object Array]' === objectPrototypeToString.call(obj)) {\n      stack.push(obj);\n      canonicalizedObj = new Array(obj.length);\n      replacementStack.push(canonicalizedObj);\n\n      for (i = 0; i < obj.length; i += 1) {\n        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);\n      }\n\n      stack.pop();\n      replacementStack.pop();\n      return canonicalizedObj;\n    }\n\n    if (obj && obj.toJSON) {\n      obj = obj.toJSON();\n    }\n\n    if (_typeof(obj) === 'object' && obj !== null) {\n      stack.push(obj);\n      canonicalizedObj = {};\n      replacementStack.push(canonicalizedObj);\n\n      var sortedKeys = [],\n          _key;\n\n      for (_key in obj) {\n        /* istanbul ignore else */\n        if (obj.hasOwnProperty(_key)) {\n          sortedKeys.push(_key);\n        }\n      }\n\n      sortedKeys.sort();\n\n      for (i = 0; i < sortedKeys.length; i += 1) {\n        _key = sortedKeys[i];\n        canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);\n      }\n\n      stack.pop();\n      replacementStack.pop();\n    } else {\n      canonicalizedObj = obj;\n    }\n\n    return canonicalizedObj;\n  }\n\n  var arrayDiff = new Diff();\n\n  arrayDiff.tokenize = function (value) {\n    return value.slice();\n  };\n\n  arrayDiff.join = arrayDiff.removeEmpty = function (value) {\n    return value;\n  };\n\n  function diffArrays(oldArr, newArr, callback) {\n    return arrayDiff.diff(oldArr, newArr, callback);\n  }\n\n  function parsePatch(uniDiff) {\n    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    var diffstr = uniDiff.split(/\\r\\n|[\\n\\v\\f\\r\\x85]/),\n        delimiters = uniDiff.match(/\\r\\n|[\\n\\v\\f\\r\\x85]/g) || [],\n        list = [],\n        i = 0;\n\n    function parseIndex() {\n      var index = {};\n      list.push(index); // Parse diff metadata\n\n      while (i < diffstr.length) {\n        var line = diffstr[i]; // File header found, end parsing diff metadata\n\n        if (/^(\\-\\-\\-|\\+\\+\\+|@@)\\s/.test(line)) {\n          break;\n        } // Diff index\n\n\n        var header = /^(?:Index:|diff(?: -r \\w+)+)\\s+(.+?)\\s*$/.exec(line);\n\n        if (header) {\n          index.index = header[1];\n        }\n\n        i++;\n      } // Parse file headers if they are defined. Unified diff requires them, but\n      // there's no technical issues to have an isolated hunk without file header\n\n\n      parseFileHeader(index);\n      parseFileHeader(index); // Parse hunks\n\n      index.hunks = [];\n\n      while (i < diffstr.length) {\n        var _line = diffstr[i];\n\n        if (/^(Index:|diff|\\-\\-\\-|\\+\\+\\+)\\s/.test(_line)) {\n          break;\n        } else if (/^@@/.test(_line)) {\n          index.hunks.push(parseHunk());\n        } else if (_line && options.strict) {\n          // Ignore unexpected content unless in strict mode\n          throw new Error('Unknown line ' + (i + 1) + ' ' + JSON.stringify(_line));\n        } else {\n          i++;\n        }\n      }\n    } // Parses the --- and +++ headers, if none are found, no lines\n    // are consumed.\n\n\n    function parseFileHeader(index) {\n      var fileHeader = /^(---|\\+\\+\\+)\\s+(.*)$/.exec(diffstr[i]);\n\n      if (fileHeader) {\n        var keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';\n        var data = fileHeader[2].split('\\t', 2);\n        var fileName = data[0].replace(/\\\\\\\\/g, '\\\\');\n\n        if (/^\".*\"$/.test(fileName)) {\n          fileName = fileName.substr(1, fileName.length - 2);\n        }\n\n        index[keyPrefix + 'FileName'] = fileName;\n        index[keyPrefix + 'Header'] = (data[1] || '').trim();\n        i++;\n      }\n    } // Parses a hunk\n    // This assumes that we are at the start of a hunk.\n\n\n    function parseHunk() {\n      var chunkHeaderIndex = i,\n          chunkHeaderLine = diffstr[i++],\n          chunkHeader = chunkHeaderLine.split(/@@ -(\\d+)(?:,(\\d+))? \\+(\\d+)(?:,(\\d+))? @@/);\n      var hunk = {\n        oldStart: +chunkHeader[1],\n        oldLines: +chunkHeader[2] || 1,\n        newStart: +chunkHeader[3],\n        newLines: +chunkHeader[4] || 1,\n        lines: [],\n        linedelimiters: []\n      };\n      var addCount = 0,\n          removeCount = 0;\n\n      for (; i < diffstr.length; i++) {\n        // Lines starting with '---' could be mistaken for the \"remove line\" operation\n        // But they could be the header for the next file. Therefore prune such cases out.\n        if (diffstr[i].indexOf('--- ') === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf('+++ ') === 0 && diffstr[i + 2].indexOf('@@') === 0) {\n          break;\n        }\n\n        var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? ' ' : diffstr[i][0];\n\n        if (operation === '+' || operation === '-' || operation === ' ' || operation === '\\\\') {\n          hunk.lines.push(diffstr[i]);\n          hunk.linedelimiters.push(delimiters[i] || '\\n');\n\n          if (operation === '+') {\n            addCount++;\n          } else if (operation === '-') {\n            removeCount++;\n          } else if (operation === ' ') {\n            addCount++;\n            removeCount++;\n          }\n        } else {\n          break;\n        }\n      } // Handle the empty block count case\n\n\n      if (!addCount && hunk.newLines === 1) {\n        hunk.newLines = 0;\n      }\n\n      if (!removeCount && hunk.oldLines === 1) {\n        hunk.oldLines = 0;\n      } // Perform optional sanity checking\n\n\n      if (options.strict) {\n        if (addCount !== hunk.newLines) {\n          throw new Error('Added line count did not match for hunk at line ' + (chunkHeaderIndex + 1));\n        }\n\n        if (removeCount !== hunk.oldLines) {\n          throw new Error('Removed line count did not match for hunk at line ' + (chunkHeaderIndex + 1));\n        }\n      }\n\n      return hunk;\n    }\n\n    while (i < diffstr.length) {\n      parseIndex();\n    }\n\n    return list;\n  } // Iterator that traverses in the range of [min, max], stepping\n  // by distance from a given start position. I.e. for [0, 4], with\n  // start of 2, this will iterate 2, 3, 1, 4, 0.\n\n\n  function distanceIterator(start, minLine, maxLine) {\n    var wantForward = true,\n        backwardExhausted = false,\n        forwardExhausted = false,\n        localOffset = 1;\n    return function iterator() {\n      if (wantForward && !forwardExhausted) {\n        if (backwardExhausted) {\n          localOffset++;\n        } else {\n          wantForward = false;\n        } // Check if trying to fit beyond text length, and if not, check it fits\n        // after offset location (or desired location on first iteration)\n\n\n        if (start + localOffset <= maxLine) {\n          return localOffset;\n        }\n\n        forwardExhausted = true;\n      }\n\n      if (!backwardExhausted) {\n        if (!forwardExhausted) {\n          wantForward = true;\n        } // Check if trying to fit before text beginning, and if not, check it fits\n        // before offset location\n\n\n        if (minLine <= start - localOffset) {\n          return -localOffset++;\n        }\n\n        backwardExhausted = true;\n        return iterator();\n      } // We tried to fit hunk before text beginning and beyond text length, then\n      // hunk can't fit on the text. Return undefined\n\n    };\n  }\n\n  function applyPatch(source, uniDiff) {\n    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n\n    if (typeof uniDiff === 'string') {\n      uniDiff = parsePatch(uniDiff);\n    }\n\n    if (Array.isArray(uniDiff)) {\n      if (uniDiff.length > 1) {\n        throw new Error('applyPatch only works with a single input.');\n      }\n\n      uniDiff = uniDiff[0];\n    } // Apply the diff to the input\n\n\n    var lines = source.split(/\\r\\n|[\\n\\v\\f\\r\\x85]/),\n        delimiters = source.match(/\\r\\n|[\\n\\v\\f\\r\\x85]/g) || [],\n        hunks = uniDiff.hunks,\n        compareLine = options.compareLine || function (lineNumber, line, operation, patchContent) {\n      return line === patchContent;\n    },\n        errorCount = 0,\n        fuzzFactor = options.fuzzFactor || 0,\n        minLine = 0,\n        offset = 0,\n        removeEOFNL,\n        addEOFNL;\n    /**\n     * Checks if the hunk exactly fits on the provided location\n     */\n\n\n    function hunkFits(hunk, toPos) {\n      for (var j = 0; j < hunk.lines.length; j++) {\n        var line = hunk.lines[j],\n            operation = line.length > 0 ? line[0] : ' ',\n            content = line.length > 0 ? line.substr(1) : line;\n\n        if (operation === ' ' || operation === '-') {\n          // Context sanity check\n          if (!compareLine(toPos + 1, lines[toPos], operation, content)) {\n            errorCount++;\n\n            if (errorCount > fuzzFactor) {\n              return false;\n            }\n          }\n\n          toPos++;\n        }\n      }\n\n      return true;\n    } // Search best fit offsets for each hunk based on the previous ones\n\n\n    for (var i = 0; i < hunks.length; i++) {\n      var hunk = hunks[i],\n          maxLine = lines.length - hunk.oldLines,\n          localOffset = 0,\n          toPos = offset + hunk.oldStart - 1;\n      var iterator = distanceIterator(toPos, minLine, maxLine);\n\n      for (; localOffset !== undefined; localOffset = iterator()) {\n        if (hunkFits(hunk, toPos + localOffset)) {\n          hunk.offset = offset += localOffset;\n          break;\n        }\n      }\n\n      if (localOffset === undefined) {\n        return false;\n      } // Set lower text limit to end of the current hunk, so next ones don't try\n      // to fit over already patched text\n\n\n      minLine = hunk.offset + hunk.oldStart + hunk.oldLines;\n    } // Apply patch hunks\n\n\n    var diffOffset = 0;\n\n    for (var _i = 0; _i < hunks.length; _i++) {\n      var _hunk = hunks[_i],\n          _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;\n\n      diffOffset += _hunk.newLines - _hunk.oldLines;\n\n      if (_toPos < 0) {\n        // Creating a new file\n        _toPos = 0;\n      }\n\n      for (var j = 0; j < _hunk.lines.length; j++) {\n        var line = _hunk.lines[j],\n            operation = line.length > 0 ? line[0] : ' ',\n            content = line.length > 0 ? line.substr(1) : line,\n            delimiter = _hunk.linedelimiters[j];\n\n        if (operation === ' ') {\n          _toPos++;\n        } else if (operation === '-') {\n          lines.splice(_toPos, 1);\n          delimiters.splice(_toPos, 1);\n          /* istanbul ignore else */\n        } else if (operation === '+') {\n          lines.splice(_toPos, 0, content);\n          delimiters.splice(_toPos, 0, delimiter);\n          _toPos++;\n        } else if (operation === '\\\\') {\n          var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;\n\n          if (previousOperation === '+') {\n            removeEOFNL = true;\n          } else if (previousOperation === '-') {\n            addEOFNL = true;\n          }\n        }\n      }\n    } // Handle EOFNL insertion/removal\n\n\n    if (removeEOFNL) {\n      while (!lines[lines.length - 1]) {\n        lines.pop();\n        delimiters.pop();\n      }\n    } else if (addEOFNL) {\n      lines.push('');\n      delimiters.push('\\n');\n    }\n\n    for (var _k = 0; _k < lines.length - 1; _k++) {\n      lines[_k] = lines[_k] + delimiters[_k];\n    }\n\n    return lines.join('');\n  } // Wrapper that supports multiple file patches via callbacks.\n\n\n  function applyPatches(uniDiff, options) {\n    if (typeof uniDiff === 'string') {\n      uniDiff = parsePatch(uniDiff);\n    }\n\n    var currentIndex = 0;\n\n    function processIndex() {\n      var index = uniDiff[currentIndex++];\n\n      if (!index) {\n        return options.complete();\n      }\n\n      options.loadFile(index, function (err, data) {\n        if (err) {\n          return options.complete(err);\n        }\n\n        var updatedContent = applyPatch(data, index, options);\n        options.patched(index, updatedContent, function (err) {\n          if (err) {\n            return options.complete(err);\n          }\n\n          processIndex();\n        });\n      });\n    }\n\n    processIndex();\n  }\n\n  function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {\n    if (!options) {\n      options = {};\n    }\n\n    if (typeof options.context === 'undefined') {\n      options.context = 4;\n    }\n\n    var diff = diffLines(oldStr, newStr, options);\n    diff.push({\n      value: '',\n      lines: []\n    }); // Append an empty value to make cleanup easier\n\n    function contextLines(lines) {\n      return lines.map(function (entry) {\n        return ' ' + entry;\n      });\n    }\n\n    var hunks = [];\n    var oldRangeStart = 0,\n        newRangeStart = 0,\n        curRange = [],\n        oldLine = 1,\n        newLine = 1;\n\n    var _loop = function _loop(i) {\n      var current = diff[i],\n          lines = current.lines || current.value.replace(/\\n$/, '').split('\\n');\n      current.lines = lines;\n\n      if (current.added || current.removed) {\n        var _curRange; // If we have previous context, start with that\n\n\n        if (!oldRangeStart) {\n          var prev = diff[i - 1];\n          oldRangeStart = oldLine;\n          newRangeStart = newLine;\n\n          if (prev) {\n            curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];\n            oldRangeStart -= curRange.length;\n            newRangeStart -= curRange.length;\n          }\n        } // Output our changes\n\n\n        (_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines.map(function (entry) {\n          return (current.added ? '+' : '-') + entry;\n        }))); // Track the updated file position\n\n\n        if (current.added) {\n          newLine += lines.length;\n        } else {\n          oldLine += lines.length;\n        }\n      } else {\n        // Identical context lines. Track line changes\n        if (oldRangeStart) {\n          // Close out any changes that have been output (or join overlapping)\n          if (lines.length <= options.context * 2 && i < diff.length - 2) {\n            var _curRange2; // Overlapping\n\n\n            (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines)));\n          } else {\n            var _curRange3; // end the range and output\n\n\n            var contextSize = Math.min(lines.length, options.context);\n\n            (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines.slice(0, contextSize))));\n\n            var hunk = {\n              oldStart: oldRangeStart,\n              oldLines: oldLine - oldRangeStart + contextSize,\n              newStart: newRangeStart,\n              newLines: newLine - newRangeStart + contextSize,\n              lines: curRange\n            };\n\n            if (i >= diff.length - 2 && lines.length <= options.context) {\n              // EOF is inside this hunk\n              var oldEOFNewline = /\\n$/.test(oldStr);\n              var newEOFNewline = /\\n$/.test(newStr);\n              var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;\n\n              if (!oldEOFNewline && noNlBeforeAdds) {\n                // special case: old has no eol and no trailing context; no-nl can end up before adds\n                curRange.splice(hunk.oldLines, 0, '\\\\ No newline at end of file');\n              }\n\n              if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {\n                curRange.push('\\\\ No newline at end of file');\n              }\n            }\n\n            hunks.push(hunk);\n            oldRangeStart = 0;\n            newRangeStart = 0;\n            curRange = [];\n          }\n        }\n\n        oldLine += lines.length;\n        newLine += lines.length;\n      }\n    };\n\n    for (var i = 0; i < diff.length; i++) {\n      _loop(i);\n    }\n\n    return {\n      oldFileName: oldFileName,\n      newFileName: newFileName,\n      oldHeader: oldHeader,\n      newHeader: newHeader,\n      hunks: hunks\n    };\n  }\n\n  function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {\n    var diff = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);\n    var ret = [];\n\n    if (oldFileName == newFileName) {\n      ret.push('Index: ' + oldFileName);\n    }\n\n    ret.push('===================================================================');\n    ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\\t' + diff.oldHeader));\n    ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\\t' + diff.newHeader));\n\n    for (var i = 0; i < diff.hunks.length; i++) {\n      var hunk = diff.hunks[i];\n      ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');\n      ret.push.apply(ret, hunk.lines);\n    }\n\n    return ret.join('\\n') + '\\n';\n  }\n\n  function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {\n    return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);\n  }\n\n  function arrayEqual(a, b) {\n    if (a.length !== b.length) {\n      return false;\n    }\n\n    return arrayStartsWith(a, b);\n  }\n\n  function arrayStartsWith(array, start) {\n    if (start.length > array.length) {\n      return false;\n    }\n\n    for (var i = 0; i < start.length; i++) {\n      if (start[i] !== array[i]) {\n        return false;\n      }\n    }\n\n    return true;\n  }\n\n  function calcLineCount(hunk) {\n    var _calcOldNewLineCount = calcOldNewLineCount(hunk.lines),\n        oldLines = _calcOldNewLineCount.oldLines,\n        newLines = _calcOldNewLineCount.newLines;\n\n    if (oldLines !== undefined) {\n      hunk.oldLines = oldLines;\n    } else {\n      delete hunk.oldLines;\n    }\n\n    if (newLines !== undefined) {\n      hunk.newLines = newLines;\n    } else {\n      delete hunk.newLines;\n    }\n  }\n\n  function merge(mine, theirs, base) {\n    mine = loadPatch(mine, base);\n    theirs = loadPatch(theirs, base);\n    var ret = {}; // For index we just let it pass through as it doesn't have any necessary meaning.\n    // Leaving sanity checks on this to the API consumer that may know more about the\n    // meaning in their own context.\n\n    if (mine.index || theirs.index) {\n      ret.index = mine.index || theirs.index;\n    }\n\n    if (mine.newFileName || theirs.newFileName) {\n      if (!fileNameChanged(mine)) {\n        // No header or no change in ours, use theirs (and ours if theirs does not exist)\n        ret.oldFileName = theirs.oldFileName || mine.oldFileName;\n        ret.newFileName = theirs.newFileName || mine.newFileName;\n        ret.oldHeader = theirs.oldHeader || mine.oldHeader;\n        ret.newHeader = theirs.newHeader || mine.newHeader;\n      } else if (!fileNameChanged(theirs)) {\n        // No header or no change in theirs, use ours\n        ret.oldFileName = mine.oldFileName;\n        ret.newFileName = mine.newFileName;\n        ret.oldHeader = mine.oldHeader;\n        ret.newHeader = mine.newHeader;\n      } else {\n        // Both changed... figure it out\n        ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);\n        ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);\n        ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);\n        ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);\n      }\n    }\n\n    ret.hunks = [];\n    var mineIndex = 0,\n        theirsIndex = 0,\n        mineOffset = 0,\n        theirsOffset = 0;\n\n    while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {\n      var mineCurrent = mine.hunks[mineIndex] || {\n        oldStart: Infinity\n      },\n          theirsCurrent = theirs.hunks[theirsIndex] || {\n        oldStart: Infinity\n      };\n\n      if (hunkBefore(mineCurrent, theirsCurrent)) {\n        // This patch does not overlap with any of the others, yay.\n        ret.hunks.push(cloneHunk(mineCurrent, mineOffset));\n        mineIndex++;\n        theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;\n      } else if (hunkBefore(theirsCurrent, mineCurrent)) {\n        // This patch does not overlap with any of the others, yay.\n        ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));\n        theirsIndex++;\n        mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;\n      } else {\n        // Overlap, merge as best we can\n        var mergedHunk = {\n          oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),\n          oldLines: 0,\n          newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),\n          newLines: 0,\n          lines: []\n        };\n        mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);\n        theirsIndex++;\n        mineIndex++;\n        ret.hunks.push(mergedHunk);\n      }\n    }\n\n    return ret;\n  }\n\n  function loadPatch(param, base) {\n    if (typeof param === 'string') {\n      if (/^@@/m.test(param) || /^Index:/m.test(param)) {\n        return parsePatch(param)[0];\n      }\n\n      if (!base) {\n        throw new Error('Must provide a base reference or pass in a patch');\n      }\n\n      return structuredPatch(undefined, undefined, base, param);\n    }\n\n    return param;\n  }\n\n  function fileNameChanged(patch) {\n    return patch.newFileName && patch.newFileName !== patch.oldFileName;\n  }\n\n  function selectField(index, mine, theirs) {\n    if (mine === theirs) {\n      return mine;\n    } else {\n      index.conflict = true;\n      return {\n        mine: mine,\n        theirs: theirs\n      };\n    }\n  }\n\n  function hunkBefore(test, check) {\n    return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;\n  }\n\n  function cloneHunk(hunk, offset) {\n    return {\n      oldStart: hunk.oldStart,\n      oldLines: hunk.oldLines,\n      newStart: hunk.newStart + offset,\n      newLines: hunk.newLines,\n      lines: hunk.lines\n    };\n  }\n\n  function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {\n    // This will generally result in a conflicted hunk, but there are cases where the context\n    // is the only overlap where we can successfully merge the content here.\n    var mine = {\n      offset: mineOffset,\n      lines: mineLines,\n      index: 0\n    },\n        their = {\n      offset: theirOffset,\n      lines: theirLines,\n      index: 0\n    }; // Handle any leading content\n\n    insertLeading(hunk, mine, their);\n    insertLeading(hunk, their, mine); // Now in the overlap content. Scan through and select the best changes from each.\n\n    while (mine.index < mine.lines.length && their.index < their.lines.length) {\n      var mineCurrent = mine.lines[mine.index],\n          theirCurrent = their.lines[their.index];\n\n      if ((mineCurrent[0] === '-' || mineCurrent[0] === '+') && (theirCurrent[0] === '-' || theirCurrent[0] === '+')) {\n        // Both modified ...\n        mutualChange(hunk, mine, their);\n      } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {\n        var _hunk$lines; // Mine inserted\n\n\n        (_hunk$lines = hunk.lines).push.apply(_hunk$lines, _toConsumableArray(collectChange(mine)));\n      } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {\n        var _hunk$lines2; // Theirs inserted\n\n\n        (_hunk$lines2 = hunk.lines).push.apply(_hunk$lines2, _toConsumableArray(collectChange(their)));\n      } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {\n        // Mine removed or edited\n        removal(hunk, mine, their);\n      } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {\n        // Their removed or edited\n        removal(hunk, their, mine, true);\n      } else if (mineCurrent === theirCurrent) {\n        // Context identity\n        hunk.lines.push(mineCurrent);\n        mine.index++;\n        their.index++;\n      } else {\n        // Context mismatch\n        conflict(hunk, collectChange(mine), collectChange(their));\n      }\n    } // Now push anything that may be remaining\n\n\n    insertTrailing(hunk, mine);\n    insertTrailing(hunk, their);\n    calcLineCount(hunk);\n  }\n\n  function mutualChange(hunk, mine, their) {\n    var myChanges = collectChange(mine),\n        theirChanges = collectChange(their);\n\n    if (allRemoves(myChanges) && allRemoves(theirChanges)) {\n      // Special case for remove changes that are supersets of one another\n      if (arrayStartsWith(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {\n        var _hunk$lines3;\n\n        (_hunk$lines3 = hunk.lines).push.apply(_hunk$lines3, _toConsumableArray(myChanges));\n\n        return;\n      } else if (arrayStartsWith(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {\n        var _hunk$lines4;\n\n        (_hunk$lines4 = hunk.lines).push.apply(_hunk$lines4, _toConsumableArray(theirChanges));\n\n        return;\n      }\n    } else if (arrayEqual(myChanges, theirChanges)) {\n      var _hunk$lines5;\n\n      (_hunk$lines5 = hunk.lines).push.apply(_hunk$lines5, _toConsumableArray(myChanges));\n\n      return;\n    }\n\n    conflict(hunk, myChanges, theirChanges);\n  }\n\n  function removal(hunk, mine, their, swap) {\n    var myChanges = collectChange(mine),\n        theirChanges = collectContext(their, myChanges);\n\n    if (theirChanges.merged) {\n      var _hunk$lines6;\n\n      (_hunk$lines6 = hunk.lines).push.apply(_hunk$lines6, _toConsumableArray(theirChanges.merged));\n    } else {\n      conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);\n    }\n  }\n\n  function conflict(hunk, mine, their) {\n    hunk.conflict = true;\n    hunk.lines.push({\n      conflict: true,\n      mine: mine,\n      theirs: their\n    });\n  }\n\n  function insertLeading(hunk, insert, their) {\n    while (insert.offset < their.offset && insert.index < insert.lines.length) {\n      var line = insert.lines[insert.index++];\n      hunk.lines.push(line);\n      insert.offset++;\n    }\n  }\n\n  function insertTrailing(hunk, insert) {\n    while (insert.index < insert.lines.length) {\n      var line = insert.lines[insert.index++];\n      hunk.lines.push(line);\n    }\n  }\n\n  function collectChange(state) {\n    var ret = [],\n        operation = state.lines[state.index][0];\n\n    while (state.index < state.lines.length) {\n      var line = state.lines[state.index]; // Group additions that are immediately after subtractions and treat them as one \"atomic\" modify change.\n\n      if (operation === '-' && line[0] === '+') {\n        operation = '+';\n      }\n\n      if (operation === line[0]) {\n        ret.push(line);\n        state.index++;\n      } else {\n        break;\n      }\n    }\n\n    return ret;\n  }\n\n  function collectContext(state, matchChanges) {\n    var changes = [],\n        merged = [],\n        matchIndex = 0,\n        contextChanges = false,\n        conflicted = false;\n\n    while (matchIndex < matchChanges.length && state.index < state.lines.length) {\n      var change = state.lines[state.index],\n          match = matchChanges[matchIndex]; // Once we've hit our add, then we are done\n\n      if (match[0] === '+') {\n        break;\n      }\n\n      contextChanges = contextChanges || change[0] !== ' ';\n      merged.push(match);\n      matchIndex++; // Consume any additions in the other block as a conflict to attempt\n      // to pull in the remaining context after this\n\n      if (change[0] === '+') {\n        conflicted = true;\n\n        while (change[0] === '+') {\n          changes.push(change);\n          change = state.lines[++state.index];\n        }\n      }\n\n      if (match.substr(1) === change.substr(1)) {\n        changes.push(change);\n        state.index++;\n      } else {\n        conflicted = true;\n      }\n    }\n\n    if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {\n      conflicted = true;\n    }\n\n    if (conflicted) {\n      return changes;\n    }\n\n    while (matchIndex < matchChanges.length) {\n      merged.push(matchChanges[matchIndex++]);\n    }\n\n    return {\n      merged: merged,\n      changes: changes\n    };\n  }\n\n  function allRemoves(changes) {\n    return changes.reduce(function (prev, change) {\n      return prev && change[0] === '-';\n    }, true);\n  }\n\n  function skipRemoveSuperset(state, removeChanges, delta) {\n    for (var i = 0; i < delta; i++) {\n      var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);\n\n      if (state.lines[state.index + i] !== ' ' + changeContent) {\n        return false;\n      }\n    }\n\n    state.index += delta;\n    return true;\n  }\n\n  function calcOldNewLineCount(lines) {\n    var oldLines = 0;\n    var newLines = 0;\n    lines.forEach(function (line) {\n      if (typeof line !== 'string') {\n        var myCount = calcOldNewLineCount(line.mine);\n        var theirCount = calcOldNewLineCount(line.theirs);\n\n        if (oldLines !== undefined) {\n          if (myCount.oldLines === theirCount.oldLines) {\n            oldLines += myCount.oldLines;\n          } else {\n            oldLines = undefined;\n          }\n        }\n\n        if (newLines !== undefined) {\n          if (myCount.newLines === theirCount.newLines) {\n            newLines += myCount.newLines;\n          } else {\n            newLines = undefined;\n          }\n        }\n      } else {\n        if (newLines !== undefined && (line[0] === '+' || line[0] === ' ')) {\n          newLines++;\n        }\n\n        if (oldLines !== undefined && (line[0] === '-' || line[0] === ' ')) {\n          oldLines++;\n        }\n      }\n    });\n    return {\n      oldLines: oldLines,\n      newLines: newLines\n    };\n  } // See: http://code.google.com/p/google-diff-match-patch/wiki/API\n\n\n  function convertChangesToDMP(changes) {\n    var ret = [],\n        change,\n        operation;\n\n    for (var i = 0; i < changes.length; i++) {\n      change = changes[i];\n\n      if (change.added) {\n        operation = 1;\n      } else if (change.removed) {\n        operation = -1;\n      } else {\n        operation = 0;\n      }\n\n      ret.push([operation, change.value]);\n    }\n\n    return ret;\n  }\n\n  function convertChangesToXML(changes) {\n    var ret = [];\n\n    for (var i = 0; i < changes.length; i++) {\n      var change = changes[i];\n\n      if (change.added) {\n        ret.push('<ins>');\n      } else if (change.removed) {\n        ret.push('<del>');\n      }\n\n      ret.push(escapeHTML(change.value));\n\n      if (change.added) {\n        ret.push('</ins>');\n      } else if (change.removed) {\n        ret.push('</del>');\n      }\n    }\n\n    return ret.join('');\n  }\n\n  function escapeHTML(s) {\n    var n = s;\n    n = n.replace(/&/g, '&amp;');\n    n = n.replace(/</g, '&lt;');\n    n = n.replace(/>/g, '&gt;');\n    n = n.replace(/\"/g, '&quot;');\n    return n;\n  }\n  /* See LICENSE file for terms of use */\n\n\n  exports.Diff = Diff;\n  exports.diffChars = diffChars;\n  exports.diffWords = diffWords;\n  exports.diffWordsWithSpace = diffWordsWithSpace;\n  exports.diffLines = diffLines;\n  exports.diffTrimmedLines = diffTrimmedLines;\n  exports.diffSentences = diffSentences;\n  exports.diffCss = diffCss;\n  exports.diffJson = diffJson;\n  exports.diffArrays = diffArrays;\n  exports.structuredPatch = structuredPatch;\n  exports.createTwoFilesPatch = createTwoFilesPatch;\n  exports.createPatch = createPatch;\n  exports.applyPatch = applyPatch;\n  exports.applyPatches = applyPatches;\n  exports.parsePatch = parsePatch;\n  exports.merge = merge;\n  exports.convertChangesToDMP = convertChangesToDMP;\n  exports.convertChangesToXML = convertChangesToXML;\n  exports.canonicalize = canonicalize;\n  Object.defineProperty(exports, '__esModule', {\n    value: true\n  });\n});\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/diff/dist/diff.js?");

/***/ }),

/***/ "./node_modules/es6-promise/dist/es6-promise.js":
/*!******************************************************!*\
  !*** ./node_modules/es6-promise/dist/es6-promise.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*!\n * @overview es6-promise - a tiny implementation of Promises/A+.\n * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)\n * @license   Licensed under MIT license\n *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE\n * @version   v4.2.8+1e68dce6\n */\n(function (global, factory) {\n   true ? module.exports = factory() : undefined;\n})(this, function () {\n  'use strict';\n\n  function objectOrFunction(x) {\n    var type = typeof x;\n    return x !== null && (type === 'object' || type === 'function');\n  }\n\n  function isFunction(x) {\n    return typeof x === 'function';\n  }\n\n  var _isArray = void 0;\n\n  if (Array.isArray) {\n    _isArray = Array.isArray;\n  } else {\n    _isArray = function (x) {\n      return Object.prototype.toString.call(x) === '[object Array]';\n    };\n  }\n\n  var isArray = _isArray;\n  var len = 0;\n  var vertxNext = void 0;\n  var customSchedulerFn = void 0;\n\n  var asap = function asap(callback, arg) {\n    queue[len] = callback;\n    queue[len + 1] = arg;\n    len += 2;\n\n    if (len === 2) {\n      // If len is 2, that means that we need to schedule an async flush.\n      // If additional callbacks are queued before the queue is flushed, they\n      // will be processed by this flush that we are scheduling.\n      if (customSchedulerFn) {\n        customSchedulerFn(flush);\n      } else {\n        scheduleFlush();\n      }\n    }\n  };\n\n  function setScheduler(scheduleFn) {\n    customSchedulerFn = scheduleFn;\n  }\n\n  function setAsap(asapFn) {\n    asap = asapFn;\n  }\n\n  var browserWindow = typeof window !== 'undefined' ? window : undefined;\n  var browserGlobal = browserWindow || {};\n  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;\n  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]'; // test for web worker but not in IE10\n\n  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined'; // node\n\n  function useNextTick() {\n    // node version 0.10.x displays a deprecation warning when nextTick is used recursively\n    // see https://github.com/cujojs/when/issues/410 for details\n    return function () {\n      return process.nextTick(flush);\n    };\n  } // vertx\n\n\n  function useVertxTimer() {\n    if (typeof vertxNext !== 'undefined') {\n      return function () {\n        vertxNext(flush);\n      };\n    }\n\n    return useSetTimeout();\n  }\n\n  function useMutationObserver() {\n    var iterations = 0;\n    var observer = new BrowserMutationObserver(flush);\n    var node = document.createTextNode('');\n    observer.observe(node, {\n      characterData: true\n    });\n    return function () {\n      node.data = iterations = ++iterations % 2;\n    };\n  } // web worker\n\n\n  function useMessageChannel() {\n    var channel = new MessageChannel();\n    channel.port1.onmessage = flush;\n    return function () {\n      return channel.port2.postMessage(0);\n    };\n  }\n\n  function useSetTimeout() {\n    // Store setTimeout reference so es6-promise will be unaffected by\n    // other code modifying setTimeout (like sinon.useFakeTimers())\n    var globalSetTimeout = setTimeout;\n    return function () {\n      return globalSetTimeout(flush, 1);\n    };\n  }\n\n  var queue = new Array(1000);\n\n  function flush() {\n    for (var i = 0; i < len; i += 2) {\n      var callback = queue[i];\n      var arg = queue[i + 1];\n      callback(arg);\n      queue[i] = undefined;\n      queue[i + 1] = undefined;\n    }\n\n    len = 0;\n  }\n\n  function attemptVertx() {\n    try {\n      var vertx = Function('return this')().require('vertx');\n\n      vertxNext = vertx.runOnLoop || vertx.runOnContext;\n      return useVertxTimer();\n    } catch (e) {\n      return useSetTimeout();\n    }\n  }\n\n  var scheduleFlush = void 0; // Decide what async method to use to triggering processing of queued callbacks:\n\n  if (isNode) {\n    scheduleFlush = useNextTick();\n  } else if (BrowserMutationObserver) {\n    scheduleFlush = useMutationObserver();\n  } else if (isWorker) {\n    scheduleFlush = useMessageChannel();\n  } else if (browserWindow === undefined && \"function\" === 'function') {\n    scheduleFlush = attemptVertx();\n  } else {\n    scheduleFlush = useSetTimeout();\n  }\n\n  function then(onFulfillment, onRejection) {\n    var parent = this;\n    var child = new this.constructor(noop);\n\n    if (child[PROMISE_ID] === undefined) {\n      makePromise(child);\n    }\n\n    var _state = parent._state;\n\n    if (_state) {\n      var callback = arguments[_state - 1];\n      asap(function () {\n        return invokeCallback(_state, child, callback, parent._result);\n      });\n    } else {\n      subscribe(parent, child, onFulfillment, onRejection);\n    }\n\n    return child;\n  }\n  /**\n    `Promise.resolve` returns a promise that will become resolved with the\n    passed `value`. It is shorthand for the following:\n  \n    ```javascript\n    let promise = new Promise(function(resolve, reject){\n      resolve(1);\n    });\n  \n    promise.then(function(value){\n      // value === 1\n    });\n    ```\n  \n    Instead of writing the above, your code now simply becomes the following:\n  \n    ```javascript\n    let promise = Promise.resolve(1);\n  \n    promise.then(function(value){\n      // value === 1\n    });\n    ```\n  \n    @method resolve\n    @static\n    @param {Any} value value that the returned promise will be resolved with\n    Useful for tooling.\n    @return {Promise} a promise that will become fulfilled with the given\n    `value`\n  */\n\n\n  function resolve$1(object) {\n    /*jshint validthis:true */\n    var Constructor = this;\n\n    if (object && typeof object === 'object' && object.constructor === Constructor) {\n      return object;\n    }\n\n    var promise = new Constructor(noop);\n    resolve(promise, object);\n    return promise;\n  }\n\n  var PROMISE_ID = Math.random().toString(36).substring(2);\n\n  function noop() {}\n\n  var PENDING = void 0;\n  var FULFILLED = 1;\n  var REJECTED = 2;\n\n  function selfFulfillment() {\n    return new TypeError(\"You cannot resolve a promise with itself\");\n  }\n\n  function cannotReturnOwn() {\n    return new TypeError('A promises callback cannot return that same promise.');\n  }\n\n  function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {\n    try {\n      then$$1.call(value, fulfillmentHandler, rejectionHandler);\n    } catch (e) {\n      return e;\n    }\n  }\n\n  function handleForeignThenable(promise, thenable, then$$1) {\n    asap(function (promise) {\n      var sealed = false;\n      var error = tryThen(then$$1, thenable, function (value) {\n        if (sealed) {\n          return;\n        }\n\n        sealed = true;\n\n        if (thenable !== value) {\n          resolve(promise, value);\n        } else {\n          fulfill(promise, value);\n        }\n      }, function (reason) {\n        if (sealed) {\n          return;\n        }\n\n        sealed = true;\n        reject(promise, reason);\n      }, 'Settle: ' + (promise._label || ' unknown promise'));\n\n      if (!sealed && error) {\n        sealed = true;\n        reject(promise, error);\n      }\n    }, promise);\n  }\n\n  function handleOwnThenable(promise, thenable) {\n    if (thenable._state === FULFILLED) {\n      fulfill(promise, thenable._result);\n    } else if (thenable._state === REJECTED) {\n      reject(promise, thenable._result);\n    } else {\n      subscribe(thenable, undefined, function (value) {\n        return resolve(promise, value);\n      }, function (reason) {\n        return reject(promise, reason);\n      });\n    }\n  }\n\n  function handleMaybeThenable(promise, maybeThenable, then$$1) {\n    if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {\n      handleOwnThenable(promise, maybeThenable);\n    } else {\n      if (then$$1 === undefined) {\n        fulfill(promise, maybeThenable);\n      } else if (isFunction(then$$1)) {\n        handleForeignThenable(promise, maybeThenable, then$$1);\n      } else {\n        fulfill(promise, maybeThenable);\n      }\n    }\n  }\n\n  function resolve(promise, value) {\n    if (promise === value) {\n      reject(promise, selfFulfillment());\n    } else if (objectOrFunction(value)) {\n      var then$$1 = void 0;\n\n      try {\n        then$$1 = value.then;\n      } catch (error) {\n        reject(promise, error);\n        return;\n      }\n\n      handleMaybeThenable(promise, value, then$$1);\n    } else {\n      fulfill(promise, value);\n    }\n  }\n\n  function publishRejection(promise) {\n    if (promise._onerror) {\n      promise._onerror(promise._result);\n    }\n\n    publish(promise);\n  }\n\n  function fulfill(promise, value) {\n    if (promise._state !== PENDING) {\n      return;\n    }\n\n    promise._result = value;\n    promise._state = FULFILLED;\n\n    if (promise._subscribers.length !== 0) {\n      asap(publish, promise);\n    }\n  }\n\n  function reject(promise, reason) {\n    if (promise._state !== PENDING) {\n      return;\n    }\n\n    promise._state = REJECTED;\n    promise._result = reason;\n    asap(publishRejection, promise);\n  }\n\n  function subscribe(parent, child, onFulfillment, onRejection) {\n    var _subscribers = parent._subscribers;\n    var length = _subscribers.length;\n    parent._onerror = null;\n    _subscribers[length] = child;\n    _subscribers[length + FULFILLED] = onFulfillment;\n    _subscribers[length + REJECTED] = onRejection;\n\n    if (length === 0 && parent._state) {\n      asap(publish, parent);\n    }\n  }\n\n  function publish(promise) {\n    var subscribers = promise._subscribers;\n    var settled = promise._state;\n\n    if (subscribers.length === 0) {\n      return;\n    }\n\n    var child = void 0,\n        callback = void 0,\n        detail = promise._result;\n\n    for (var i = 0; i < subscribers.length; i += 3) {\n      child = subscribers[i];\n      callback = subscribers[i + settled];\n\n      if (child) {\n        invokeCallback(settled, child, callback, detail);\n      } else {\n        callback(detail);\n      }\n    }\n\n    promise._subscribers.length = 0;\n  }\n\n  function invokeCallback(settled, promise, callback, detail) {\n    var hasCallback = isFunction(callback),\n        value = void 0,\n        error = void 0,\n        succeeded = true;\n\n    if (hasCallback) {\n      try {\n        value = callback(detail);\n      } catch (e) {\n        succeeded = false;\n        error = e;\n      }\n\n      if (promise === value) {\n        reject(promise, cannotReturnOwn());\n        return;\n      }\n    } else {\n      value = detail;\n    }\n\n    if (promise._state !== PENDING) {// noop\n    } else if (hasCallback && succeeded) {\n      resolve(promise, value);\n    } else if (succeeded === false) {\n      reject(promise, error);\n    } else if (settled === FULFILLED) {\n      fulfill(promise, value);\n    } else if (settled === REJECTED) {\n      reject(promise, value);\n    }\n  }\n\n  function initializePromise(promise, resolver) {\n    try {\n      resolver(function resolvePromise(value) {\n        resolve(promise, value);\n      }, function rejectPromise(reason) {\n        reject(promise, reason);\n      });\n    } catch (e) {\n      reject(promise, e);\n    }\n  }\n\n  var id = 0;\n\n  function nextId() {\n    return id++;\n  }\n\n  function makePromise(promise) {\n    promise[PROMISE_ID] = id++;\n    promise._state = undefined;\n    promise._result = undefined;\n    promise._subscribers = [];\n  }\n\n  function validationError() {\n    return new Error('Array Methods must be provided an Array');\n  }\n\n  var Enumerator = function () {\n    function Enumerator(Constructor, input) {\n      this._instanceConstructor = Constructor;\n      this.promise = new Constructor(noop);\n\n      if (!this.promise[PROMISE_ID]) {\n        makePromise(this.promise);\n      }\n\n      if (isArray(input)) {\n        this.length = input.length;\n        this._remaining = input.length;\n        this._result = new Array(this.length);\n\n        if (this.length === 0) {\n          fulfill(this.promise, this._result);\n        } else {\n          this.length = this.length || 0;\n\n          this._enumerate(input);\n\n          if (this._remaining === 0) {\n            fulfill(this.promise, this._result);\n          }\n        }\n      } else {\n        reject(this.promise, validationError());\n      }\n    }\n\n    Enumerator.prototype._enumerate = function _enumerate(input) {\n      for (var i = 0; this._state === PENDING && i < input.length; i++) {\n        this._eachEntry(input[i], i);\n      }\n    };\n\n    Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {\n      var c = this._instanceConstructor;\n      var resolve$$1 = c.resolve;\n\n      if (resolve$$1 === resolve$1) {\n        var _then = void 0;\n\n        var error = void 0;\n        var didError = false;\n\n        try {\n          _then = entry.then;\n        } catch (e) {\n          didError = true;\n          error = e;\n        }\n\n        if (_then === then && entry._state !== PENDING) {\n          this._settledAt(entry._state, i, entry._result);\n        } else if (typeof _then !== 'function') {\n          this._remaining--;\n          this._result[i] = entry;\n        } else if (c === Promise$1) {\n          var promise = new c(noop);\n\n          if (didError) {\n            reject(promise, error);\n          } else {\n            handleMaybeThenable(promise, entry, _then);\n          }\n\n          this._willSettleAt(promise, i);\n        } else {\n          this._willSettleAt(new c(function (resolve$$1) {\n            return resolve$$1(entry);\n          }), i);\n        }\n      } else {\n        this._willSettleAt(resolve$$1(entry), i);\n      }\n    };\n\n    Enumerator.prototype._settledAt = function _settledAt(state, i, value) {\n      var promise = this.promise;\n\n      if (promise._state === PENDING) {\n        this._remaining--;\n\n        if (state === REJECTED) {\n          reject(promise, value);\n        } else {\n          this._result[i] = value;\n        }\n      }\n\n      if (this._remaining === 0) {\n        fulfill(promise, this._result);\n      }\n    };\n\n    Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {\n      var enumerator = this;\n      subscribe(promise, undefined, function (value) {\n        return enumerator._settledAt(FULFILLED, i, value);\n      }, function (reason) {\n        return enumerator._settledAt(REJECTED, i, reason);\n      });\n    };\n\n    return Enumerator;\n  }();\n  /**\n    `Promise.all` accepts an array of promises, and returns a new promise which\n    is fulfilled with an array of fulfillment values for the passed promises, or\n    rejected with the reason of the first passed promise to be rejected. It casts all\n    elements of the passed iterable to promises as it runs this algorithm.\n  \n    Example:\n  \n    ```javascript\n    let promise1 = resolve(1);\n    let promise2 = resolve(2);\n    let promise3 = resolve(3);\n    let promises = [ promise1, promise2, promise3 ];\n  \n    Promise.all(promises).then(function(array){\n      // The array here would be [ 1, 2, 3 ];\n    });\n    ```\n  \n    If any of the `promises` given to `all` are rejected, the first promise\n    that is rejected will be given as an argument to the returned promises's\n    rejection handler. For example:\n  \n    Example:\n  \n    ```javascript\n    let promise1 = resolve(1);\n    let promise2 = reject(new Error(\"2\"));\n    let promise3 = reject(new Error(\"3\"));\n    let promises = [ promise1, promise2, promise3 ];\n  \n    Promise.all(promises).then(function(array){\n      // Code here never runs because there are rejected promises!\n    }, function(error) {\n      // error.message === \"2\"\n    });\n    ```\n  \n    @method all\n    @static\n    @param {Array} entries array of promises\n    @param {String} label optional string for labeling the promise.\n    Useful for tooling.\n    @return {Promise} promise that is fulfilled when all `promises` have been\n    fulfilled, or rejected if any of them become rejected.\n    @static\n  */\n\n\n  function all(entries) {\n    return new Enumerator(this, entries).promise;\n  }\n  /**\n    `Promise.race` returns a new promise which is settled in the same way as the\n    first passed promise to settle.\n  \n    Example:\n  \n    ```javascript\n    let promise1 = new Promise(function(resolve, reject){\n      setTimeout(function(){\n        resolve('promise 1');\n      }, 200);\n    });\n  \n    let promise2 = new Promise(function(resolve, reject){\n      setTimeout(function(){\n        resolve('promise 2');\n      }, 100);\n    });\n  \n    Promise.race([promise1, promise2]).then(function(result){\n      // result === 'promise 2' because it was resolved before promise1\n      // was resolved.\n    });\n    ```\n  \n    `Promise.race` is deterministic in that only the state of the first\n    settled promise matters. For example, even if other promises given to the\n    `promises` array argument are resolved, but the first settled promise has\n    become rejected before the other promises became fulfilled, the returned\n    promise will become rejected:\n  \n    ```javascript\n    let promise1 = new Promise(function(resolve, reject){\n      setTimeout(function(){\n        resolve('promise 1');\n      }, 200);\n    });\n  \n    let promise2 = new Promise(function(resolve, reject){\n      setTimeout(function(){\n        reject(new Error('promise 2'));\n      }, 100);\n    });\n  \n    Promise.race([promise1, promise2]).then(function(result){\n      // Code here never runs\n    }, function(reason){\n      // reason.message === 'promise 2' because promise 2 became rejected before\n      // promise 1 became fulfilled\n    });\n    ```\n  \n    An example real-world use case is implementing timeouts:\n  \n    ```javascript\n    Promise.race([ajax('foo.json'), timeout(5000)])\n    ```\n  \n    @method race\n    @static\n    @param {Array} promises array of promises to observe\n    Useful for tooling.\n    @return {Promise} a promise which settles in the same way as the first passed\n    promise to settle.\n  */\n\n\n  function race(entries) {\n    /*jshint validthis:true */\n    var Constructor = this;\n\n    if (!isArray(entries)) {\n      return new Constructor(function (_, reject) {\n        return reject(new TypeError('You must pass an array to race.'));\n      });\n    } else {\n      return new Constructor(function (resolve, reject) {\n        var length = entries.length;\n\n        for (var i = 0; i < length; i++) {\n          Constructor.resolve(entries[i]).then(resolve, reject);\n        }\n      });\n    }\n  }\n  /**\n    `Promise.reject` returns a promise rejected with the passed `reason`.\n    It is shorthand for the following:\n  \n    ```javascript\n    let promise = new Promise(function(resolve, reject){\n      reject(new Error('WHOOPS'));\n    });\n  \n    promise.then(function(value){\n      // Code here doesn't run because the promise is rejected!\n    }, function(reason){\n      // reason.message === 'WHOOPS'\n    });\n    ```\n  \n    Instead of writing the above, your code now simply becomes the following:\n  \n    ```javascript\n    let promise = Promise.reject(new Error('WHOOPS'));\n  \n    promise.then(function(value){\n      // Code here doesn't run because the promise is rejected!\n    }, function(reason){\n      // reason.message === 'WHOOPS'\n    });\n    ```\n  \n    @method reject\n    @static\n    @param {Any} reason value that the returned promise will be rejected with.\n    Useful for tooling.\n    @return {Promise} a promise rejected with the given `reason`.\n  */\n\n\n  function reject$1(reason) {\n    /*jshint validthis:true */\n    var Constructor = this;\n    var promise = new Constructor(noop);\n    reject(promise, reason);\n    return promise;\n  }\n\n  function needsResolver() {\n    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');\n  }\n\n  function needsNew() {\n    throw new TypeError(\"Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.\");\n  }\n  /**\n    Promise objects represent the eventual result of an asynchronous operation. The\n    primary way of interacting with a promise is through its `then` method, which\n    registers callbacks to receive either a promise's eventual value or the reason\n    why the promise cannot be fulfilled.\n  \n    Terminology\n    -----------\n  \n    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.\n    - `thenable` is an object or function that defines a `then` method.\n    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).\n    - `exception` is a value that is thrown using the throw statement.\n    - `reason` is a value that indicates why a promise was rejected.\n    - `settled` the final resting state of a promise, fulfilled or rejected.\n  \n    A promise can be in one of three states: pending, fulfilled, or rejected.\n  \n    Promises that are fulfilled have a fulfillment value and are in the fulfilled\n    state.  Promises that are rejected have a rejection reason and are in the\n    rejected state.  A fulfillment value is never a thenable.\n  \n    Promises can also be said to *resolve* a value.  If this value is also a\n    promise, then the original promise's settled state will match the value's\n    settled state.  So a promise that *resolves* a promise that rejects will\n    itself reject, and a promise that *resolves* a promise that fulfills will\n    itself fulfill.\n  \n  \n    Basic Usage:\n    ------------\n  \n    ```js\n    let promise = new Promise(function(resolve, reject) {\n      // on success\n      resolve(value);\n  \n      // on failure\n      reject(reason);\n    });\n  \n    promise.then(function(value) {\n      // on fulfillment\n    }, function(reason) {\n      // on rejection\n    });\n    ```\n  \n    Advanced Usage:\n    ---------------\n  \n    Promises shine when abstracting away asynchronous interactions such as\n    `XMLHttpRequest`s.\n  \n    ```js\n    function getJSON(url) {\n      return new Promise(function(resolve, reject){\n        let xhr = new XMLHttpRequest();\n  \n        xhr.open('GET', url);\n        xhr.onreadystatechange = handler;\n        xhr.responseType = 'json';\n        xhr.setRequestHeader('Accept', 'application/json');\n        xhr.send();\n  \n        function handler() {\n          if (this.readyState === this.DONE) {\n            if (this.status === 200) {\n              resolve(this.response);\n            } else {\n              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));\n            }\n          }\n        };\n      });\n    }\n  \n    getJSON('/posts.json').then(function(json) {\n      // on fulfillment\n    }, function(reason) {\n      // on rejection\n    });\n    ```\n  \n    Unlike callbacks, promises are great composable primitives.\n  \n    ```js\n    Promise.all([\n      getJSON('/posts'),\n      getJSON('/comments')\n    ]).then(function(values){\n      values[0] // => postsJSON\n      values[1] // => commentsJSON\n  \n      return values;\n    });\n    ```\n  \n    @class Promise\n    @param {Function} resolver\n    Useful for tooling.\n    @constructor\n  */\n\n\n  var Promise$1 = function () {\n    function Promise(resolver) {\n      this[PROMISE_ID] = nextId();\n      this._result = this._state = undefined;\n      this._subscribers = [];\n\n      if (noop !== resolver) {\n        typeof resolver !== 'function' && needsResolver();\n        this instanceof Promise ? initializePromise(this, resolver) : needsNew();\n      }\n    }\n    /**\n    The primary way of interacting with a promise is through its `then` method,\n    which registers callbacks to receive either a promise's eventual value or the\n    reason why the promise cannot be fulfilled.\n     ```js\n    findUser().then(function(user){\n      // user is available\n    }, function(reason){\n      // user is unavailable, and you are given the reason why\n    });\n    ```\n     Chaining\n    --------\n     The return value of `then` is itself a promise.  This second, 'downstream'\n    promise is resolved with the return value of the first promise's fulfillment\n    or rejection handler, or rejected if the handler throws an exception.\n     ```js\n    findUser().then(function (user) {\n      return user.name;\n    }, function (reason) {\n      return 'default name';\n    }).then(function (userName) {\n      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it\n      // will be `'default name'`\n    });\n     findUser().then(function (user) {\n      throw new Error('Found user, but still unhappy');\n    }, function (reason) {\n      throw new Error('`findUser` rejected and we're unhappy');\n    }).then(function (value) {\n      // never reached\n    }, function (reason) {\n      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.\n      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.\n    });\n    ```\n    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.\n     ```js\n    findUser().then(function (user) {\n      throw new PedagogicalException('Upstream error');\n    }).then(function (value) {\n      // never reached\n    }).then(function (value) {\n      // never reached\n    }, function (reason) {\n      // The `PedgagocialException` is propagated all the way down to here\n    });\n    ```\n     Assimilation\n    ------------\n     Sometimes the value you want to propagate to a downstream promise can only be\n    retrieved asynchronously. This can be achieved by returning a promise in the\n    fulfillment or rejection handler. The downstream promise will then be pending\n    until the returned promise is settled. This is called *assimilation*.\n     ```js\n    findUser().then(function (user) {\n      return findCommentsByAuthor(user);\n    }).then(function (comments) {\n      // The user's comments are now available\n    });\n    ```\n     If the assimliated promise rejects, then the downstream promise will also reject.\n     ```js\n    findUser().then(function (user) {\n      return findCommentsByAuthor(user);\n    }).then(function (comments) {\n      // If `findCommentsByAuthor` fulfills, we'll have the value here\n    }, function (reason) {\n      // If `findCommentsByAuthor` rejects, we'll have the reason here\n    });\n    ```\n     Simple Example\n    --------------\n     Synchronous Example\n     ```javascript\n    let result;\n     try {\n      result = findResult();\n      // success\n    } catch(reason) {\n      // failure\n    }\n    ```\n     Errback Example\n     ```js\n    findResult(function(result, err){\n      if (err) {\n        // failure\n      } else {\n        // success\n      }\n    });\n    ```\n     Promise Example;\n     ```javascript\n    findResult().then(function(result){\n      // success\n    }, function(reason){\n      // failure\n    });\n    ```\n     Advanced Example\n    --------------\n     Synchronous Example\n     ```javascript\n    let author, books;\n     try {\n      author = findAuthor();\n      books  = findBooksByAuthor(author);\n      // success\n    } catch(reason) {\n      // failure\n    }\n    ```\n     Errback Example\n     ```js\n     function foundBooks(books) {\n     }\n     function failure(reason) {\n     }\n     findAuthor(function(author, err){\n      if (err) {\n        failure(err);\n        // failure\n      } else {\n        try {\n          findBoooksByAuthor(author, function(books, err) {\n            if (err) {\n              failure(err);\n            } else {\n              try {\n                foundBooks(books);\n              } catch(reason) {\n                failure(reason);\n              }\n            }\n          });\n        } catch(error) {\n          failure(err);\n        }\n        // success\n      }\n    });\n    ```\n     Promise Example;\n     ```javascript\n    findAuthor().\n      then(findBooksByAuthor).\n      then(function(books){\n        // found books\n    }).catch(function(reason){\n      // something went wrong\n    });\n    ```\n     @method then\n    @param {Function} onFulfilled\n    @param {Function} onRejected\n    Useful for tooling.\n    @return {Promise}\n    */\n\n    /**\n    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same\n    as the catch block of a try/catch statement.\n    ```js\n    function findAuthor(){\n    throw new Error('couldn't find that author');\n    }\n    // synchronous\n    try {\n    findAuthor();\n    } catch(reason) {\n    // something went wrong\n    }\n    // async with promises\n    findAuthor().catch(function(reason){\n    // something went wrong\n    });\n    ```\n    @method catch\n    @param {Function} onRejection\n    Useful for tooling.\n    @return {Promise}\n    */\n\n\n    Promise.prototype.catch = function _catch(onRejection) {\n      return this.then(null, onRejection);\n    };\n    /**\n      `finally` will be invoked regardless of the promise's fate just as native\n      try/catch/finally behaves\n    \n      Synchronous example:\n    \n      ```js\n      findAuthor() {\n        if (Math.random() > 0.5) {\n          throw new Error();\n        }\n        return new Author();\n      }\n    \n      try {\n        return findAuthor(); // succeed or fail\n      } catch(error) {\n        return findOtherAuther();\n      } finally {\n        // always runs\n        // doesn't affect the return value\n      }\n      ```\n    \n      Asynchronous example:\n    \n      ```js\n      findAuthor().catch(function(reason){\n        return findOtherAuther();\n      }).finally(function(){\n        // author was either found, or not\n      });\n      ```\n    \n      @method finally\n      @param {Function} callback\n      @return {Promise}\n    */\n\n\n    Promise.prototype.finally = function _finally(callback) {\n      var promise = this;\n      var constructor = promise.constructor;\n\n      if (isFunction(callback)) {\n        return promise.then(function (value) {\n          return constructor.resolve(callback()).then(function () {\n            return value;\n          });\n        }, function (reason) {\n          return constructor.resolve(callback()).then(function () {\n            throw reason;\n          });\n        });\n      }\n\n      return promise.then(callback, callback);\n    };\n\n    return Promise;\n  }();\n\n  Promise$1.prototype.then = then;\n  Promise$1.all = all;\n  Promise$1.race = race;\n  Promise$1.resolve = resolve$1;\n  Promise$1.reject = reject$1;\n  Promise$1._setScheduler = setScheduler;\n  Promise$1._setAsap = setAsap;\n  Promise$1._asap = asap;\n  /*global self*/\n\n  function polyfill() {\n    var local = void 0;\n\n    if (typeof global !== 'undefined') {\n      local = global;\n    } else if (typeof self !== 'undefined') {\n      local = self;\n    } else {\n      try {\n        local = Function('return this')();\n      } catch (e) {\n        throw new Error('polyfill failed because global object is unavailable in this environment');\n      }\n    }\n\n    var P = local.Promise;\n\n    if (P) {\n      var promiseToString = null;\n\n      try {\n        promiseToString = Object.prototype.toString.call(P.resolve());\n      } catch (e) {// silently ignored\n      }\n\n      if (promiseToString === '[object Promise]' && !P.cast) {\n        return;\n      }\n    }\n\n    local.Promise = Promise$1;\n  } // Strange compat..\n\n\n  Promise$1.polyfill = polyfill;\n  Promise$1.Promise = Promise$1;\n  return Promise$1;\n});\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/es6-promise/dist/es6-promise.js?");

/***/ }),

/***/ "./node_modules/lolex/lolex.js":
/*!*************************************!*\
  !*** ./node_modules/lolex/lolex.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var require;var require;(function (f) {\n  if (true) {\n    module.exports = f();\n  } else { var g; }\n})(function () {\n  var define, module, exports;\n  return function () {\n    function r(e, n, t) {\n      function o(i, f) {\n        if (!n[i]) {\n          if (!e[i]) {\n            var c = \"function\" == typeof require && require;\n            if (!f && c) return require(i, !0);\n            if (u) return u(i, !0);\n            var a = new Error(\"Cannot find module '\" + i + \"'\");\n            throw a.code = \"MODULE_NOT_FOUND\", a;\n          }\n\n          var p = n[i] = {\n            exports: {}\n          };\n          e[i][0].call(p.exports, function (r) {\n            var n = e[i][1][r];\n            return o(n || r);\n          }, p, p.exports, r, e, n, t);\n        }\n\n        return n[i].exports;\n      }\n\n      for (var u = \"function\" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);\n\n      return o;\n    }\n\n    return r;\n  }()({\n    1: [function (require, module, exports) {\n      \"use strict\";\n\n      var every = require(\"./prototypes/array\").every;\n\n      function hasCallsLeft(callMap, spy) {\n        if (callMap[spy.id] === undefined) {\n          callMap[spy.id] = 0;\n        }\n\n        return callMap[spy.id] < spy.callCount;\n      }\n\n      function checkAdjacentCalls(callMap, spy, index, spies) {\n        var calledBeforeNext = true;\n\n        if (index !== spies.length - 1) {\n          calledBeforeNext = spy.calledBefore(spies[index + 1]);\n        }\n\n        if (hasCallsLeft(callMap, spy) && calledBeforeNext) {\n          callMap[spy.id] += 1;\n          return true;\n        }\n\n        return false;\n      }\n\n      module.exports = function calledInOrder(spies) {\n        var callMap = {}; // eslint-disable-next-line no-underscore-dangle\n\n        var _spies = arguments.length > 1 ? arguments : spies;\n\n        return every(_spies, checkAdjacentCalls.bind(null, callMap));\n      };\n    }, {\n      \"./prototypes/array\": 9\n    }],\n    2: [function (require, module, exports) {\n      \"use strict\";\n\n      var functionName = require(\"./function-name\");\n\n      module.exports = function className(value) {\n        return value.constructor && value.constructor.name || // The next branch is for IE11 support only:\n        // Because the name property is not set on the prototype\n        // of the Function object, we finally try to grab the\n        // name from its definition. This will never be reached\n        // in node, so we are not able to test this properly.\n        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name\n        typeof value.constructor === \"function\" &&\n        /* istanbul ignore next */\n        functionName(value.constructor) || null;\n      };\n    }, {\n      \"./function-name\": 5\n    }],\n    3: [function (require, module, exports) {\n      /* eslint-disable no-console */\n      \"use strict\"; // wrap returns a function that will invoke the supplied function and print a deprecation warning to the console each\n      // time it is called.\n\n      exports.wrap = function (func, msg) {\n        var wrapped = function () {\n          exports.printWarning(msg);\n          return func.apply(this, arguments);\n        };\n\n        if (func.prototype) {\n          wrapped.prototype = func.prototype;\n        }\n\n        return wrapped;\n      }; // defaultMsg returns a string which can be supplied to `wrap()` to notify the user that a particular part of the\n      // sinon API has been deprecated.\n\n\n      exports.defaultMsg = function (packageName, funcName) {\n        return packageName + \".\" + funcName + \" is deprecated and will be removed from the public API in a future version of \" + packageName + \".\";\n      };\n\n      exports.printWarning = function (msg) {\n        // Watch out for IE7 and below! :(\n\n        /* istanbul ignore next */\n        if (typeof console !== \"undefined\") {\n          if (console.info) {\n            console.info(msg);\n          } else {\n            console.log(msg);\n          }\n        }\n      };\n    }, {}],\n    4: [function (require, module, exports) {\n      \"use strict\"; // This is an `every` implementation that works for all iterables\n\n      module.exports = function every(obj, fn) {\n        var pass = true;\n\n        try {\n          /* eslint-disable-next-line local-rules/no-prototype-methods */\n          obj.forEach(function () {\n            if (!fn.apply(this, arguments)) {\n              // Throwing an error is the only way to break `forEach`\n              throw new Error();\n            }\n          });\n        } catch (e) {\n          pass = false;\n        }\n\n        return pass;\n      };\n    }, {}],\n    5: [function (require, module, exports) {\n      \"use strict\";\n\n      module.exports = function functionName(func) {\n        if (!func) {\n          return \"\";\n        }\n\n        return func.displayName || func.name || // Use function decomposition as a last resort to get function\n        // name. Does not rely on function decomposition to work - if it\n        // doesn't debugging will be slightly less informative\n        // (i.e. toString will say 'spy' rather than 'myFunc').\n        (String(func).match(/function ([^\\s(]+)/) || [])[1];\n      };\n    }, {}],\n    6: [function (require, module, exports) {\n      \"use strict\";\n\n      var globalObject;\n      /* istanbul ignore else */\n\n      if (typeof global !== \"undefined\") {\n        // Node\n        globalObject = global;\n      } else if (typeof window !== \"undefined\") {\n        // Browser\n        globalObject = window;\n      } else {\n        // WebWorker\n        globalObject = self;\n      }\n\n      module.exports = globalObject;\n    }, {}],\n    7: [function (require, module, exports) {\n      \"use strict\";\n\n      module.exports = {\n        global: require(\"./global\"),\n        calledInOrder: require(\"./called-in-order\"),\n        className: require(\"./class-name\"),\n        deprecated: require(\"./deprecated\"),\n        every: require(\"./every\"),\n        functionName: require(\"./function-name\"),\n        orderByFirstCall: require(\"./order-by-first-call\"),\n        prototypes: require(\"./prototypes\"),\n        typeOf: require(\"./type-of\"),\n        valueToString: require(\"./value-to-string\")\n      };\n    }, {\n      \"./called-in-order\": 1,\n      \"./class-name\": 2,\n      \"./deprecated\": 3,\n      \"./every\": 4,\n      \"./function-name\": 5,\n      \"./global\": 6,\n      \"./order-by-first-call\": 8,\n      \"./prototypes\": 12,\n      \"./type-of\": 17,\n      \"./value-to-string\": 18\n    }],\n    8: [function (require, module, exports) {\n      \"use strict\";\n\n      var sort = require(\"./prototypes/array\").sort;\n\n      var slice = require(\"./prototypes/array\").slice;\n\n      function comparator(a, b) {\n        // uuid, won't ever be equal\n        var aCall = a.getCall(0);\n        var bCall = b.getCall(0);\n        var aId = aCall && aCall.callId || -1;\n        var bId = bCall && bCall.callId || -1;\n        return aId < bId ? -1 : 1;\n      }\n\n      module.exports = function orderByFirstCall(spies) {\n        return sort(slice(spies), comparator);\n      };\n    }, {\n      \"./prototypes/array\": 9\n    }],\n    9: [function (require, module, exports) {\n      \"use strict\";\n\n      var copyPrototype = require(\"./copy-prototype\");\n\n      module.exports = copyPrototype(Array.prototype);\n    }, {\n      \"./copy-prototype\": 10\n    }],\n    10: [function (require, module, exports) {\n      \"use strict\";\n\n      var call = Function.call;\n\n      module.exports = function copyPrototypeMethods(prototype) {\n        /* eslint-disable local-rules/no-prototype-methods */\n        return Object.getOwnPropertyNames(prototype).reduce(function (result, name) {\n          // ignore size because it throws from Map\n          if (name !== \"size\" && name !== \"caller\" && name !== \"callee\" && name !== \"arguments\" && typeof prototype[name] === \"function\") {\n            result[name] = call.bind(prototype[name]);\n          }\n\n          return result;\n        }, Object.create(null));\n      };\n    }, {}],\n    11: [function (require, module, exports) {\n      \"use strict\";\n\n      var copyPrototype = require(\"./copy-prototype\");\n\n      module.exports = copyPrototype(Function.prototype);\n    }, {\n      \"./copy-prototype\": 10\n    }],\n    12: [function (require, module, exports) {\n      \"use strict\";\n\n      module.exports = {\n        array: require(\"./array\"),\n        function: require(\"./function\"),\n        map: require(\"./map\"),\n        object: require(\"./object\"),\n        set: require(\"./set\"),\n        string: require(\"./string\")\n      };\n    }, {\n      \"./array\": 9,\n      \"./function\": 11,\n      \"./map\": 13,\n      \"./object\": 14,\n      \"./set\": 15,\n      \"./string\": 16\n    }],\n    13: [function (require, module, exports) {\n      \"use strict\";\n\n      var copyPrototype = require(\"./copy-prototype\");\n\n      module.exports = copyPrototype(Map.prototype);\n    }, {\n      \"./copy-prototype\": 10\n    }],\n    14: [function (require, module, exports) {\n      \"use strict\";\n\n      var copyPrototype = require(\"./copy-prototype\");\n\n      module.exports = copyPrototype(Object.prototype);\n    }, {\n      \"./copy-prototype\": 10\n    }],\n    15: [function (require, module, exports) {\n      \"use strict\";\n\n      var copyPrototype = require(\"./copy-prototype\");\n\n      module.exports = copyPrototype(Set.prototype);\n    }, {\n      \"./copy-prototype\": 10\n    }],\n    16: [function (require, module, exports) {\n      \"use strict\";\n\n      var copyPrototype = require(\"./copy-prototype\");\n\n      module.exports = copyPrototype(String.prototype);\n    }, {\n      \"./copy-prototype\": 10\n    }],\n    17: [function (require, module, exports) {\n      \"use strict\";\n\n      var type = require(\"type-detect\");\n\n      module.exports = function typeOf(value) {\n        return type(value).toLowerCase();\n      };\n    }, {\n      \"type-detect\": 19\n    }],\n    18: [function (require, module, exports) {\n      \"use strict\";\n\n      function valueToString(value) {\n        if (value && value.toString) {\n          /* eslint-disable-next-line local-rules/no-prototype-methods */\n          return value.toString();\n        }\n\n        return String(value);\n      }\n\n      module.exports = valueToString;\n    }, {}],\n    19: [function (require, module, exports) {\n      (function (global, factory) {\n        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.typeDetect = factory();\n      })(this, function () {\n        'use strict';\n        /* !\n         * type-detect\n         * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>\n         * MIT Licensed\n         */\n\n        var promiseExists = typeof Promise === 'function';\n        /* eslint-disable no-undef */\n\n        var globalObject = typeof self === 'object' ? self : global; // eslint-disable-line id-blacklist\n\n        var symbolExists = typeof Symbol !== 'undefined';\n        var mapExists = typeof Map !== 'undefined';\n        var setExists = typeof Set !== 'undefined';\n        var weakMapExists = typeof WeakMap !== 'undefined';\n        var weakSetExists = typeof WeakSet !== 'undefined';\n        var dataViewExists = typeof DataView !== 'undefined';\n        var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';\n        var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';\n        var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';\n        var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';\n        var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());\n        var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());\n        var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';\n        var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());\n        var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';\n        var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());\n        var toStringLeftSliceLength = 8;\n        var toStringRightSliceLength = -1;\n        /**\n         * ### typeOf (obj)\n         *\n         * Uses `Object.prototype.toString` to determine the type of an object,\n         * normalising behaviour across engine versions & well optimised.\n         *\n         * @param {Mixed} object\n         * @return {String} object type\n         * @api public\n         */\n\n        function typeDetect(obj) {\n          /* ! Speed optimisation\n           * Pre:\n           *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)\n           *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)\n           *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)\n           *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)\n           *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)\n           * Post:\n           *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)\n           *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)\n           *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)\n           *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)\n           *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)\n           */\n          var typeofObj = typeof obj;\n\n          if (typeofObj !== 'object') {\n            return typeofObj;\n          }\n          /* ! Speed optimisation\n           * Pre:\n           *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)\n           * Post:\n           *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)\n           */\n\n\n          if (obj === null) {\n            return 'null';\n          }\n          /* ! Spec Conformance\n           * Test: `Object.prototype.toString.call(window)``\n           *  - Node === \"[object global]\"\n           *  - Chrome === \"[object global]\"\n           *  - Firefox === \"[object Window]\"\n           *  - PhantomJS === \"[object Window]\"\n           *  - Safari === \"[object Window]\"\n           *  - IE 11 === \"[object Window]\"\n           *  - IE Edge === \"[object Window]\"\n           * Test: `Object.prototype.toString.call(this)``\n           *  - Chrome Worker === \"[object global]\"\n           *  - Firefox Worker === \"[object DedicatedWorkerGlobalScope]\"\n           *  - Safari Worker === \"[object DedicatedWorkerGlobalScope]\"\n           *  - IE 11 Worker === \"[object WorkerGlobalScope]\"\n           *  - IE Edge Worker === \"[object WorkerGlobalScope]\"\n           */\n\n\n          if (obj === globalObject) {\n            return 'global';\n          }\n          /* ! Speed optimisation\n           * Pre:\n           *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)\n           * Post:\n           *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)\n           */\n\n\n          if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {\n            return 'Array';\n          } // Not caching existence of `window` and related properties due to potential\n          // for `window` to be unset before tests in quasi-browser environments.\n\n\n          if (typeof window === 'object' && window !== null) {\n            /* ! Spec Conformance\n             * (https://html.spec.whatwg.org/multipage/browsers.html#location)\n             * WhatWG HTML$7.7.3 - The `Location` interface\n             * Test: `Object.prototype.toString.call(window.location)``\n             *  - IE <=11 === \"[object Object]\"\n             *  - IE Edge <=13 === \"[object Object]\"\n             */\n            if (typeof window.location === 'object' && obj === window.location) {\n              return 'Location';\n            }\n            /* ! Spec Conformance\n             * (https://html.spec.whatwg.org/#document)\n             * WhatWG HTML$3.1.1 - The `Document` object\n             * Note: Most browsers currently adher to the W3C DOM Level 2 spec\n             *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)\n             *       which suggests that browsers should use HTMLTableCellElement for\n             *       both TD and TH elements. WhatWG separates these.\n             *       WhatWG HTML states:\n             *         > For historical reasons, Window objects must also have a\n             *         > writable, configurable, non-enumerable property named\n             *         > HTMLDocument whose value is the Document interface object.\n             * Test: `Object.prototype.toString.call(document)``\n             *  - Chrome === \"[object HTMLDocument]\"\n             *  - Firefox === \"[object HTMLDocument]\"\n             *  - Safari === \"[object HTMLDocument]\"\n             *  - IE <=10 === \"[object Document]\"\n             *  - IE 11 === \"[object HTMLDocument]\"\n             *  - IE Edge <=13 === \"[object HTMLDocument]\"\n             */\n\n\n            if (typeof window.document === 'object' && obj === window.document) {\n              return 'Document';\n            }\n\n            if (typeof window.navigator === 'object') {\n              /* ! Spec Conformance\n               * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)\n               * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray\n               * Test: `Object.prototype.toString.call(navigator.mimeTypes)``\n               *  - IE <=10 === \"[object MSMimeTypesCollection]\"\n               */\n              if (typeof window.navigator.mimeTypes === 'object' && obj === window.navigator.mimeTypes) {\n                return 'MimeTypeArray';\n              }\n              /* ! Spec Conformance\n               * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)\n               * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray\n               * Test: `Object.prototype.toString.call(navigator.plugins)``\n               *  - IE <=10 === \"[object MSPluginsCollection]\"\n               */\n\n\n              if (typeof window.navigator.plugins === 'object' && obj === window.navigator.plugins) {\n                return 'PluginArray';\n              }\n            }\n\n            if ((typeof window.HTMLElement === 'function' || typeof window.HTMLElement === 'object') && obj instanceof window.HTMLElement) {\n              /* ! Spec Conformance\n              * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)\n              * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`\n              * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``\n              *  - IE <=10 === \"[object HTMLBlockElement]\"\n              */\n              if (obj.tagName === 'BLOCKQUOTE') {\n                return 'HTMLQuoteElement';\n              }\n              /* ! Spec Conformance\n               * (https://html.spec.whatwg.org/#htmltabledatacellelement)\n               * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`\n               * Note: Most browsers currently adher to the W3C DOM Level 2 spec\n               *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)\n               *       which suggests that browsers should use HTMLTableCellElement for\n               *       both TD and TH elements. WhatWG separates these.\n               * Test: Object.prototype.toString.call(document.createElement('td'))\n               *  - Chrome === \"[object HTMLTableCellElement]\"\n               *  - Firefox === \"[object HTMLTableCellElement]\"\n               *  - Safari === \"[object HTMLTableCellElement]\"\n               */\n\n\n              if (obj.tagName === 'TD') {\n                return 'HTMLTableDataCellElement';\n              }\n              /* ! Spec Conformance\n               * (https://html.spec.whatwg.org/#htmltableheadercellelement)\n               * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`\n               * Note: Most browsers currently adher to the W3C DOM Level 2 spec\n               *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)\n               *       which suggests that browsers should use HTMLTableCellElement for\n               *       both TD and TH elements. WhatWG separates these.\n               * Test: Object.prototype.toString.call(document.createElement('th'))\n               *  - Chrome === \"[object HTMLTableCellElement]\"\n               *  - Firefox === \"[object HTMLTableCellElement]\"\n               *  - Safari === \"[object HTMLTableCellElement]\"\n               */\n\n\n              if (obj.tagName === 'TH') {\n                return 'HTMLTableHeaderCellElement';\n              }\n            }\n          }\n          /* ! Speed optimisation\n          * Pre:\n          *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)\n          *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)\n          *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)\n          *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)\n          *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)\n          *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)\n          *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)\n          *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)\n          *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)\n          * Post:\n          *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)\n          *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)\n          *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)\n          *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)\n          *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)\n          *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)\n          *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)\n          *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)\n          *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)\n          */\n\n\n          var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];\n\n          if (typeof stringTag === 'string') {\n            return stringTag;\n          }\n\n          var objPrototype = Object.getPrototypeOf(obj);\n          /* ! Speed optimisation\n          * Pre:\n          *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)\n          *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)\n          * Post:\n          *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)\n          *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)\n          */\n\n          if (objPrototype === RegExp.prototype) {\n            return 'RegExp';\n          }\n          /* ! Speed optimisation\n          * Pre:\n          *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)\n          * Post:\n          *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)\n          */\n\n\n          if (objPrototype === Date.prototype) {\n            return 'Date';\n          }\n          /* ! Spec Conformance\n           * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)\n           * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be \"Promise\":\n           * Test: `Object.prototype.toString.call(Promise.resolve())``\n           *  - Chrome <=47 === \"[object Object]\"\n           *  - Edge <=20 === \"[object Object]\"\n           *  - Firefox 29-Latest === \"[object Promise]\"\n           *  - Safari 7.1-Latest === \"[object Promise]\"\n           */\n\n\n          if (promiseExists && objPrototype === Promise.prototype) {\n            return 'Promise';\n          }\n          /* ! Speed optimisation\n          * Pre:\n          *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)\n          * Post:\n          *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)\n          */\n\n\n          if (setExists && objPrototype === Set.prototype) {\n            return 'Set';\n          }\n          /* ! Speed optimisation\n          * Pre:\n          *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)\n          * Post:\n          *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)\n          */\n\n\n          if (mapExists && objPrototype === Map.prototype) {\n            return 'Map';\n          }\n          /* ! Speed optimisation\n          * Pre:\n          *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)\n          * Post:\n          *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)\n          */\n\n\n          if (weakSetExists && objPrototype === WeakSet.prototype) {\n            return 'WeakSet';\n          }\n          /* ! Speed optimisation\n          * Pre:\n          *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)\n          * Post:\n          *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)\n          */\n\n\n          if (weakMapExists && objPrototype === WeakMap.prototype) {\n            return 'WeakMap';\n          }\n          /* ! Spec Conformance\n           * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)\n           * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be \"DataView\":\n           * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``\n           *  - Edge <=13 === \"[object Object]\"\n           */\n\n\n          if (dataViewExists && objPrototype === DataView.prototype) {\n            return 'DataView';\n          }\n          /* ! Spec Conformance\n           * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)\n           * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be \"Map Iterator\":\n           * Test: `Object.prototype.toString.call(new Map().entries())``\n           *  - Edge <=13 === \"[object Object]\"\n           */\n\n\n          if (mapExists && objPrototype === mapIteratorPrototype) {\n            return 'Map Iterator';\n          }\n          /* ! Spec Conformance\n           * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)\n           * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be \"Set Iterator\":\n           * Test: `Object.prototype.toString.call(new Set().entries())``\n           *  - Edge <=13 === \"[object Object]\"\n           */\n\n\n          if (setExists && objPrototype === setIteratorPrototype) {\n            return 'Set Iterator';\n          }\n          /* ! Spec Conformance\n           * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)\n           * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be \"Array Iterator\":\n           * Test: `Object.prototype.toString.call([][Symbol.iterator]())``\n           *  - Edge <=13 === \"[object Object]\"\n           */\n\n\n          if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {\n            return 'Array Iterator';\n          }\n          /* ! Spec Conformance\n           * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)\n           * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be \"String Iterator\":\n           * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``\n           *  - Edge <=13 === \"[object Object]\"\n           */\n\n\n          if (stringIteratorExists && objPrototype === stringIteratorPrototype) {\n            return 'String Iterator';\n          }\n          /* ! Speed optimisation\n          * Pre:\n          *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)\n          * Post:\n          *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)\n          */\n\n\n          if (objPrototype === null) {\n            return 'Object';\n          }\n\n          return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);\n        }\n\n        return typeDetect;\n      });\n    }, {}],\n    20: [function (require, module, exports) {\n      \"use strict\";\n\n      var globalObject = require(\"@sinonjs/commons\").global; // eslint-disable-next-line complexity\n\n\n      function withGlobal(_global) {\n        var userAgent = _global.navigator && _global.navigator.userAgent;\n        var isRunningInIE = userAgent && userAgent.indexOf(\"MSIE \") > -1;\n        var maxTimeout = Math.pow(2, 31) - 1; //see https://heycam.github.io/webidl/#abstract-opdef-converttoint\n\n        var NOOP = function () {\n          return undefined;\n        };\n\n        var NOOP_ARRAY = function () {\n          return [];\n        };\n\n        var timeoutResult = _global.setTimeout(NOOP, 0);\n\n        var addTimerReturnsObject = typeof timeoutResult === \"object\";\n        var hrtimePresent = _global.process && typeof _global.process.hrtime === \"function\";\n        var hrtimeBigintPresent = hrtimePresent && typeof _global.process.hrtime.bigint === \"function\";\n        var nextTickPresent = _global.process && typeof _global.process.nextTick === \"function\";\n        var performancePresent = _global.performance && typeof _global.performance.now === \"function\";\n        var hasPerformancePrototype = _global.Performance && (typeof _global.Performance).match(/^(function|object)$/);\n\n        var queueMicrotaskPresent = _global.hasOwnProperty(\"queueMicrotask\");\n\n        var requestAnimationFramePresent = _global.requestAnimationFrame && typeof _global.requestAnimationFrame === \"function\";\n        var cancelAnimationFramePresent = _global.cancelAnimationFrame && typeof _global.cancelAnimationFrame === \"function\";\n        var requestIdleCallbackPresent = _global.requestIdleCallback && typeof _global.requestIdleCallback === \"function\";\n        var cancelIdleCallbackPresent = _global.cancelIdleCallback && typeof _global.cancelIdleCallback === \"function\";\n        var setImmediatePresent = _global.setImmediate && typeof _global.setImmediate === \"function\"; // Make properties writable in IE, as per\n        // http://www.adequatelygood.com/Replacing-setTimeout-Globally.html\n\n        /* eslint-disable no-self-assign */\n\n        if (isRunningInIE) {\n          _global.setTimeout = _global.setTimeout;\n          _global.clearTimeout = _global.clearTimeout;\n          _global.setInterval = _global.setInterval;\n          _global.clearInterval = _global.clearInterval;\n          _global.Date = _global.Date;\n        } // setImmediate is not a standard function\n        // avoid adding the prop to the window object if not present\n\n\n        if (setImmediatePresent) {\n          _global.setImmediate = _global.setImmediate;\n          _global.clearImmediate = _global.clearImmediate;\n        }\n        /* eslint-enable no-self-assign */\n\n\n        _global.clearTimeout(timeoutResult);\n\n        var NativeDate = _global.Date;\n        var uniqueTimerId = 1;\n\n        function isNumberFinite(num) {\n          if (Number.isFinite) {\n            return Number.isFinite(num);\n          }\n\n          if (typeof num !== \"number\") {\n            return false;\n          }\n\n          return isFinite(num);\n        }\n        /**\n         * Parse strings like \"01:10:00\" (meaning 1 hour, 10 minutes, 0 seconds) into\n         * number of milliseconds. This is used to support human-readable strings passed\n         * to clock.tick()\n         */\n\n\n        function parseTime(str) {\n          if (!str) {\n            return 0;\n          }\n\n          var strings = str.split(\":\");\n          var l = strings.length;\n          var i = l;\n          var ms = 0;\n          var parsed;\n\n          if (l > 3 || !/^(\\d\\d:){0,2}\\d\\d?$/.test(str)) {\n            throw new Error(\"tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits\");\n          }\n\n          while (i--) {\n            parsed = parseInt(strings[i], 10);\n\n            if (parsed >= 60) {\n              throw new Error(\"Invalid time \" + str);\n            }\n\n            ms += parsed * Math.pow(60, l - i - 1);\n          }\n\n          return ms * 1000;\n        }\n        /**\n         * Get the decimal part of the millisecond value as nanoseconds\n         *\n         * @param {Number} msFloat the number of milliseconds\n         * @returns {Number} an integer number of nanoseconds in the range [0,1e6)\n         *\n         * Example: nanoRemainer(123.456789) -> 456789\n         */\n\n\n        function nanoRemainder(msFloat) {\n          var modulo = 1e6;\n          var remainder = msFloat * 1e6 % modulo;\n          var positiveRemainder = remainder < 0 ? remainder + modulo : remainder;\n          return Math.floor(positiveRemainder);\n        }\n        /**\n         * Used to grok the `now` parameter to createClock.\n         * @param epoch {Date|number} the system time\n         */\n\n\n        function getEpoch(epoch) {\n          if (!epoch) {\n            return 0;\n          }\n\n          if (typeof epoch.getTime === \"function\") {\n            return epoch.getTime();\n          }\n\n          if (typeof epoch === \"number\") {\n            return epoch;\n          }\n\n          throw new TypeError(\"now should be milliseconds since UNIX epoch\");\n        }\n\n        function inRange(from, to, timer) {\n          return timer && timer.callAt >= from && timer.callAt <= to;\n        }\n\n        function mirrorDateProperties(target, source) {\n          var prop;\n\n          for (prop in source) {\n            if (source.hasOwnProperty(prop)) {\n              target[prop] = source[prop];\n            }\n          } // set special now implementation\n\n\n          if (source.now) {\n            target.now = function now() {\n              return target.clock.now;\n            };\n          } else {\n            delete target.now;\n          } // set special toSource implementation\n\n\n          if (source.toSource) {\n            target.toSource = function toSource() {\n              return source.toSource();\n            };\n          } else {\n            delete target.toSource;\n          } // set special toString implementation\n\n\n          target.toString = function toString() {\n            return source.toString();\n          };\n\n          target.prototype = source.prototype;\n          target.parse = source.parse;\n          target.UTC = source.UTC;\n          target.prototype.toUTCString = source.prototype.toUTCString;\n          return target;\n        }\n\n        function createDate() {\n          function ClockDate(year, month, date, hour, minute, second, ms) {\n            // the Date constructor called as a function, ref Ecma-262 Edition 5.1, section 15.9.2.\n            // This remains so in the 10th edition of 2019 as well.\n            if (!(this instanceof ClockDate)) {\n              return new NativeDate(ClockDate.clock.now).toString();\n            } // if Date is called as a constructor with 'new' keyword\n            // Defensive and verbose to avoid potential harm in passing\n            // explicit undefined when user does not pass argument\n\n\n            switch (arguments.length) {\n              case 0:\n                return new NativeDate(ClockDate.clock.now);\n\n              case 1:\n                return new NativeDate(year);\n\n              case 2:\n                return new NativeDate(year, month);\n\n              case 3:\n                return new NativeDate(year, month, date);\n\n              case 4:\n                return new NativeDate(year, month, date, hour);\n\n              case 5:\n                return new NativeDate(year, month, date, hour, minute);\n\n              case 6:\n                return new NativeDate(year, month, date, hour, minute, second);\n\n              default:\n                return new NativeDate(year, month, date, hour, minute, second, ms);\n            }\n          }\n\n          return mirrorDateProperties(ClockDate, NativeDate);\n        }\n\n        function enqueueJob(clock, job) {\n          // enqueues a microtick-deferred task - ecma262/#sec-enqueuejob\n          if (!clock.jobs) {\n            clock.jobs = [];\n          }\n\n          clock.jobs.push(job);\n        }\n\n        function runJobs(clock) {\n          // runs all microtick-deferred tasks - ecma262/#sec-runjobs\n          if (!clock.jobs) {\n            return;\n          }\n\n          for (var i = 0; i < clock.jobs.length; i++) {\n            var job = clock.jobs[i];\n            job.func.apply(null, job.args);\n\n            if (clock.loopLimit && i > clock.loopLimit) {\n              throw new Error(\"Aborting after running \" + clock.loopLimit + \" timers, assuming an infinite loop!\");\n            }\n          }\n\n          clock.jobs = [];\n        }\n\n        function addTimer(clock, timer) {\n          if (timer.func === undefined) {\n            throw new Error(\"Callback must be provided to timer calls\");\n          }\n\n          timer.type = timer.immediate ? \"Immediate\" : \"Timeout\";\n\n          if (timer.hasOwnProperty(\"delay\")) {\n            if (!isNumberFinite(timer.delay)) {\n              timer.delay = 0;\n            }\n\n            timer.delay = timer.delay > maxTimeout ? 1 : timer.delay;\n            timer.delay = Math.max(0, timer.delay);\n          }\n\n          if (timer.hasOwnProperty(\"interval\")) {\n            timer.type = \"Interval\";\n            timer.interval = timer.interval > maxTimeout ? 1 : timer.interval;\n          }\n\n          if (timer.hasOwnProperty(\"animation\")) {\n            timer.type = \"AnimationFrame\";\n            timer.animation = true;\n          }\n\n          if (!clock.timers) {\n            clock.timers = {};\n          }\n\n          timer.id = uniqueTimerId++;\n          timer.createdAt = clock.now;\n          timer.callAt = clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));\n          clock.timers[timer.id] = timer;\n\n          if (addTimerReturnsObject) {\n            var res = {\n              id: timer.id,\n              ref: function () {\n                return res;\n              },\n              unref: function () {\n                return res;\n              },\n              refresh: function () {\n                return res;\n              }\n            };\n            return res;\n          }\n\n          return timer.id;\n        }\n        /* eslint consistent-return: \"off\" */\n\n\n        function compareTimers(a, b) {\n          // Sort first by absolute timing\n          if (a.callAt < b.callAt) {\n            return -1;\n          }\n\n          if (a.callAt > b.callAt) {\n            return 1;\n          } // Sort next by immediate, immediate timers take precedence\n\n\n          if (a.immediate && !b.immediate) {\n            return -1;\n          }\n\n          if (!a.immediate && b.immediate) {\n            return 1;\n          } // Sort next by creation time, earlier-created timers take precedence\n\n\n          if (a.createdAt < b.createdAt) {\n            return -1;\n          }\n\n          if (a.createdAt > b.createdAt) {\n            return 1;\n          } // Sort next by id, lower-id timers take precedence\n\n\n          if (a.id < b.id) {\n            return -1;\n          }\n\n          if (a.id > b.id) {\n            return 1;\n          } // As timer ids are unique, no fallback `0` is necessary\n\n        }\n\n        function firstTimerInRange(clock, from, to) {\n          var timers = clock.timers;\n          var timer = null;\n          var id, isInRange;\n\n          for (id in timers) {\n            if (timers.hasOwnProperty(id)) {\n              isInRange = inRange(from, to, timers[id]);\n\n              if (isInRange && (!timer || compareTimers(timer, timers[id]) === 1)) {\n                timer = timers[id];\n              }\n            }\n          }\n\n          return timer;\n        }\n\n        function firstTimer(clock) {\n          var timers = clock.timers;\n          var timer = null;\n          var id;\n\n          for (id in timers) {\n            if (timers.hasOwnProperty(id)) {\n              if (!timer || compareTimers(timer, timers[id]) === 1) {\n                timer = timers[id];\n              }\n            }\n          }\n\n          return timer;\n        }\n\n        function lastTimer(clock) {\n          var timers = clock.timers;\n          var timer = null;\n          var id;\n\n          for (id in timers) {\n            if (timers.hasOwnProperty(id)) {\n              if (!timer || compareTimers(timer, timers[id]) === -1) {\n                timer = timers[id];\n              }\n            }\n          }\n\n          return timer;\n        }\n\n        function callTimer(clock, timer) {\n          if (typeof timer.interval === \"number\") {\n            clock.timers[timer.id].callAt += timer.interval;\n          } else {\n            delete clock.timers[timer.id];\n          }\n\n          if (typeof timer.func === \"function\") {\n            timer.func.apply(null, timer.args);\n          } else {\n            /* eslint no-eval: \"off\" */\n            eval(timer.func);\n          }\n        }\n\n        function clearTimer(clock, timerId, ttype) {\n          if (!timerId) {\n            // null appears to be allowed in most browsers, and appears to be\n            // relied upon by some libraries, like Bootstrap carousel\n            return;\n          }\n\n          if (!clock.timers) {\n            clock.timers = {};\n          } // in Node, timerId is an object with .ref()/.unref(), and\n          // its .id field is the actual timer id.\n\n\n          var id = typeof timerId === \"object\" ? timerId.id : timerId;\n\n          if (clock.timers.hasOwnProperty(id)) {\n            // check that the ID matches a timer of the correct type\n            var timer = clock.timers[id];\n\n            if (timer.type === ttype) {\n              delete clock.timers[id];\n            } else {\n              var clear = ttype === \"AnimationFrame\" ? \"cancelAnimationFrame\" : \"clear\" + ttype;\n              var schedule = timer.type === \"AnimationFrame\" ? \"requestAnimationFrame\" : \"set\" + timer.type;\n              throw new Error(\"Cannot clear timer: timer created with \" + schedule + \"() but cleared with \" + clear + \"()\");\n            }\n          }\n        }\n\n        function uninstall(clock, target, config) {\n          var method, i, l;\n          var installedHrTime = \"_hrtime\";\n          var installedNextTick = \"_nextTick\";\n\n          for (i = 0, l = clock.methods.length; i < l; i++) {\n            method = clock.methods[i];\n\n            if (method === \"hrtime\" && target.process) {\n              target.process.hrtime = clock[installedHrTime];\n            } else if (method === \"nextTick\" && target.process) {\n              target.process.nextTick = clock[installedNextTick];\n            } else if (method === \"performance\") {\n              var originalPerfDescriptor = Object.getOwnPropertyDescriptor(clock, \"_\" + method);\n\n              if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {\n                Object.defineProperty(target, method, originalPerfDescriptor);\n              } else if (originalPerfDescriptor.configurable) {\n                target[method] = clock[\"_\" + method];\n              }\n            } else {\n              if (target[method] && target[method].hadOwnProperty) {\n                target[method] = clock[\"_\" + method];\n\n                if (method === \"clearInterval\" && config.shouldAdvanceTime === true) {\n                  target[method](clock.attachedInterval);\n                }\n              } else {\n                try {\n                  delete target[method];\n                } catch (ignore) {\n                  /* eslint no-empty: \"off\" */\n                }\n              }\n            }\n          } // Prevent multiple executions which will completely remove these props\n\n\n          clock.methods = []; // return pending timers, to enable checking what timers remained on uninstall\n\n          if (!clock.timers) {\n            return [];\n          }\n\n          return Object.keys(clock.timers).map(function mapper(key) {\n            return clock.timers[key];\n          });\n        }\n\n        function hijackMethod(target, method, clock) {\n          var prop;\n          clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(target, method);\n          clock[\"_\" + method] = target[method];\n\n          if (method === \"Date\") {\n            var date = mirrorDateProperties(clock[method], target[method]);\n            target[method] = date;\n          } else if (method === \"performance\") {\n            var originalPerfDescriptor = Object.getOwnPropertyDescriptor(target, method); // JSDOM has a read only performance field so we have to save/copy it differently\n\n            if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {\n              Object.defineProperty(clock, \"_\" + method, originalPerfDescriptor);\n              var perfDescriptor = Object.getOwnPropertyDescriptor(clock, method);\n              Object.defineProperty(target, method, perfDescriptor);\n            } else {\n              target[method] = clock[method];\n            }\n          } else {\n            target[method] = function () {\n              return clock[method].apply(clock, arguments);\n            };\n\n            for (prop in clock[method]) {\n              if (clock[method].hasOwnProperty(prop)) {\n                target[method][prop] = clock[method][prop];\n              }\n            }\n          }\n\n          target[method].clock = clock;\n        }\n\n        function doIntervalTick(clock, advanceTimeDelta) {\n          clock.tick(advanceTimeDelta);\n        }\n\n        var timers = {\n          setTimeout: _global.setTimeout,\n          clearTimeout: _global.clearTimeout,\n          setInterval: _global.setInterval,\n          clearInterval: _global.clearInterval,\n          Date: _global.Date\n        };\n\n        if (setImmediatePresent) {\n          timers.setImmediate = _global.setImmediate;\n          timers.clearImmediate = _global.clearImmediate;\n        }\n\n        if (hrtimePresent) {\n          timers.hrtime = _global.process.hrtime;\n        }\n\n        if (nextTickPresent) {\n          timers.nextTick = _global.process.nextTick;\n        }\n\n        if (performancePresent) {\n          timers.performance = _global.performance;\n        }\n\n        if (requestAnimationFramePresent) {\n          timers.requestAnimationFrame = _global.requestAnimationFrame;\n        }\n\n        if (queueMicrotaskPresent) {\n          timers.queueMicrotask = true;\n        }\n\n        if (cancelAnimationFramePresent) {\n          timers.cancelAnimationFrame = _global.cancelAnimationFrame;\n        }\n\n        if (requestIdleCallbackPresent) {\n          timers.requestIdleCallback = _global.requestIdleCallback;\n        }\n\n        if (cancelIdleCallbackPresent) {\n          timers.cancelIdleCallback = _global.cancelIdleCallback;\n        }\n\n        var keys = Object.keys || function (obj) {\n          var ks = [];\n          var key;\n\n          for (key in obj) {\n            if (obj.hasOwnProperty(key)) {\n              ks.push(key);\n            }\n          }\n\n          return ks;\n        };\n\n        var originalSetTimeout = _global.setImmediate || _global.setTimeout;\n        /**\n         * @param start {Date|number} the system time - non-integer values are floored\n         * @param loopLimit {number}  maximum number of timers that will be run when calling runAll()\n         */\n\n        function createClock(start, loopLimit) {\n          // eslint-disable-next-line no-param-reassign\n          start = Math.floor(getEpoch(start)); // eslint-disable-next-line no-param-reassign\n\n          loopLimit = loopLimit || 1000;\n          var nanos = 0;\n          var adjustedSystemTime = [0, 0]; // [millis, nanoremainder]\n\n          if (NativeDate === undefined) {\n            throw new Error(\"The global scope doesn't have a `Date` object\" + \" (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)\");\n          }\n\n          var clock = {\n            now: start,\n            timeouts: {},\n            Date: createDate(),\n            loopLimit: loopLimit\n          };\n          clock.Date.clock = clock;\n\n          function getTimeToNextFrame() {\n            return 16 - (clock.now - start) % 16;\n          }\n\n          function hrtime(prev) {\n            var millisSinceStart = clock.now - adjustedSystemTime[0] - start;\n            var secsSinceStart = Math.floor(millisSinceStart / 1000);\n            var remainderInNanos = (millisSinceStart - secsSinceStart * 1e3) * 1e6 + nanos - adjustedSystemTime[1];\n\n            if (Array.isArray(prev)) {\n              if (prev[1] > 1e9) {\n                throw new TypeError(\"Number of nanoseconds can't exceed a billion\");\n              }\n\n              var oldSecs = prev[0];\n              var nanoDiff = remainderInNanos - prev[1];\n              var secDiff = secsSinceStart - oldSecs;\n\n              if (nanoDiff < 0) {\n                nanoDiff += 1e9;\n                secDiff -= 1;\n              }\n\n              return [secDiff, nanoDiff];\n            }\n\n            return [secsSinceStart, remainderInNanos];\n          }\n\n          if (hrtimeBigintPresent) {\n            hrtime.bigint = function () {\n              var parts = hrtime();\n              return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]); // eslint-disable-line\n            };\n          }\n\n          clock.requestIdleCallback = function requestIdleCallback(func, timeout) {\n            var timeToNextIdlePeriod = 0;\n\n            if (clock.countTimers() > 0) {\n              timeToNextIdlePeriod = 50; // const for now\n            }\n\n            var result = addTimer(clock, {\n              func: func,\n              args: Array.prototype.slice.call(arguments, 2),\n              delay: typeof timeout === \"undefined\" ? timeToNextIdlePeriod : Math.min(timeout, timeToNextIdlePeriod)\n            });\n            return result.id || result;\n          };\n\n          clock.cancelIdleCallback = function cancelIdleCallback(timerId) {\n            return clearTimer(clock, timerId, \"Timeout\");\n          };\n\n          clock.setTimeout = function setTimeout(func, timeout) {\n            return addTimer(clock, {\n              func: func,\n              args: Array.prototype.slice.call(arguments, 2),\n              delay: timeout\n            });\n          };\n\n          clock.clearTimeout = function clearTimeout(timerId) {\n            return clearTimer(clock, timerId, \"Timeout\");\n          };\n\n          clock.nextTick = function nextTick(func) {\n            return enqueueJob(clock, {\n              func: func,\n              args: Array.prototype.slice.call(arguments, 1)\n            });\n          };\n\n          clock.queueMicrotask = function queueMicrotask(func) {\n            return clock.nextTick(func); // explicitly drop additional arguments\n          };\n\n          clock.setInterval = function setInterval(func, timeout) {\n            // eslint-disable-next-line no-param-reassign\n            timeout = parseInt(timeout, 10);\n            return addTimer(clock, {\n              func: func,\n              args: Array.prototype.slice.call(arguments, 2),\n              delay: timeout,\n              interval: timeout\n            });\n          };\n\n          clock.clearInterval = function clearInterval(timerId) {\n            return clearTimer(clock, timerId, \"Interval\");\n          };\n\n          if (setImmediatePresent) {\n            clock.setImmediate = function setImmediate(func) {\n              return addTimer(clock, {\n                func: func,\n                args: Array.prototype.slice.call(arguments, 1),\n                immediate: true\n              });\n            };\n\n            clock.clearImmediate = function clearImmediate(timerId) {\n              return clearTimer(clock, timerId, \"Immediate\");\n            };\n          }\n\n          clock.countTimers = function countTimers() {\n            return Object.keys(clock.timers || {}).length + (clock.jobs || []).length;\n          };\n\n          clock.requestAnimationFrame = function requestAnimationFrame(func) {\n            var result = addTimer(clock, {\n              func: func,\n              delay: getTimeToNextFrame(),\n              args: [clock.now + getTimeToNextFrame()],\n              animation: true\n            });\n            return result.id || result;\n          };\n\n          clock.cancelAnimationFrame = function cancelAnimationFrame(timerId) {\n            return clearTimer(clock, timerId, \"AnimationFrame\");\n          };\n\n          clock.runMicrotasks = function runMicrotasks() {\n            runJobs(clock);\n          };\n\n          function doTick(tickValue, isAsync, resolve, reject) {\n            var msFloat = typeof tickValue === \"number\" ? tickValue : parseTime(tickValue);\n            var ms = Math.floor(msFloat);\n            var remainder = nanoRemainder(msFloat);\n            var nanosTotal = nanos + remainder;\n            var tickTo = clock.now + ms;\n\n            if (msFloat < 0) {\n              throw new TypeError(\"Negative ticks are not supported\");\n            } // adjust for positive overflow\n\n\n            if (nanosTotal >= 1e6) {\n              tickTo += 1;\n              nanosTotal -= 1e6;\n            }\n\n            nanos = nanosTotal;\n            var tickFrom = clock.now;\n            var previous = clock.now;\n            var timer, firstException, oldNow, nextPromiseTick, compensationCheck, postTimerCall;\n            clock.duringTick = true; // perform microtasks\n\n            oldNow = clock.now;\n            runJobs(clock);\n\n            if (oldNow !== clock.now) {\n              // compensate for any setSystemTime() call during microtask callback\n              tickFrom += clock.now - oldNow;\n              tickTo += clock.now - oldNow;\n            }\n\n            function doTickInner() {\n              // perform each timer in the requested range\n              timer = firstTimerInRange(clock, tickFrom, tickTo); // eslint-disable-next-line no-unmodified-loop-condition\n\n              while (timer && tickFrom <= tickTo) {\n                if (clock.timers[timer.id]) {\n                  tickFrom = timer.callAt;\n                  clock.now = timer.callAt;\n                  oldNow = clock.now;\n\n                  try {\n                    runJobs(clock);\n                    callTimer(clock, timer);\n                  } catch (e) {\n                    firstException = firstException || e;\n                  }\n\n                  if (isAsync) {\n                    // finish up after native setImmediate callback to allow\n                    // all native es6 promises to process their callbacks after\n                    // each timer fires.\n                    originalSetTimeout(nextPromiseTick);\n                    return;\n                  }\n\n                  compensationCheck();\n                }\n\n                postTimerCall();\n              } // perform process.nextTick()s again\n\n\n              oldNow = clock.now;\n              runJobs(clock);\n\n              if (oldNow !== clock.now) {\n                // compensate for any setSystemTime() call during process.nextTick() callback\n                tickFrom += clock.now - oldNow;\n                tickTo += clock.now - oldNow;\n              }\n\n              clock.duringTick = false; // corner case: during runJobs new timers were scheduled which could be in the range [clock.now, tickTo]\n\n              timer = firstTimerInRange(clock, tickFrom, tickTo);\n\n              if (timer) {\n                try {\n                  clock.tick(tickTo - clock.now); // do it all again - for the remainder of the requested range\n                } catch (e) {\n                  firstException = firstException || e;\n                }\n              } else {\n                // no timers remaining in the requested range: move the clock all the way to the end\n                clock.now = tickTo; // update nanos\n\n                nanos = nanosTotal;\n              }\n\n              if (firstException) {\n                throw firstException;\n              }\n\n              if (isAsync) {\n                resolve(clock.now);\n              } else {\n                return clock.now;\n              }\n            }\n\n            nextPromiseTick = isAsync && function () {\n              try {\n                compensationCheck();\n                postTimerCall();\n                doTickInner();\n              } catch (e) {\n                reject(e);\n              }\n            };\n\n            compensationCheck = function () {\n              // compensate for any setSystemTime() call during timer callback\n              if (oldNow !== clock.now) {\n                tickFrom += clock.now - oldNow;\n                tickTo += clock.now - oldNow;\n                previous += clock.now - oldNow;\n              }\n            };\n\n            postTimerCall = function () {\n              timer = firstTimerInRange(clock, previous, tickTo);\n              previous = tickFrom;\n            };\n\n            return doTickInner();\n          }\n          /**\n           * @param {tickValue} {String|Number} number of milliseconds or a human-readable value like \"01:11:15\"\n           */\n\n\n          clock.tick = function tick(tickValue) {\n            return doTick(tickValue, false);\n          };\n\n          if (typeof _global.Promise !== \"undefined\") {\n            clock.tickAsync = function tickAsync(ms) {\n              return new _global.Promise(function (resolve, reject) {\n                originalSetTimeout(function () {\n                  try {\n                    doTick(ms, true, resolve, reject);\n                  } catch (e) {\n                    reject(e);\n                  }\n                });\n              });\n            };\n          }\n\n          clock.next = function next() {\n            runJobs(clock);\n            var timer = firstTimer(clock);\n\n            if (!timer) {\n              return clock.now;\n            }\n\n            clock.duringTick = true;\n\n            try {\n              clock.now = timer.callAt;\n              callTimer(clock, timer);\n              runJobs(clock);\n              return clock.now;\n            } finally {\n              clock.duringTick = false;\n            }\n          };\n\n          if (typeof _global.Promise !== \"undefined\") {\n            clock.nextAsync = function nextAsync() {\n              return new _global.Promise(function (resolve, reject) {\n                originalSetTimeout(function () {\n                  try {\n                    var timer = firstTimer(clock);\n\n                    if (!timer) {\n                      resolve(clock.now);\n                      return;\n                    }\n\n                    var err;\n                    clock.duringTick = true;\n                    clock.now = timer.callAt;\n\n                    try {\n                      callTimer(clock, timer);\n                    } catch (e) {\n                      err = e;\n                    }\n\n                    clock.duringTick = false;\n                    originalSetTimeout(function () {\n                      if (err) {\n                        reject(err);\n                      } else {\n                        resolve(clock.now);\n                      }\n                    });\n                  } catch (e) {\n                    reject(e);\n                  }\n                });\n              });\n            };\n          }\n\n          clock.runAll = function runAll() {\n            var numTimers, i;\n            runJobs(clock);\n\n            for (i = 0; i < clock.loopLimit; i++) {\n              if (!clock.timers) {\n                return clock.now;\n              }\n\n              numTimers = keys(clock.timers).length;\n\n              if (numTimers === 0) {\n                return clock.now;\n              }\n\n              clock.next();\n            }\n\n            throw new Error(\"Aborting after running \" + clock.loopLimit + \" timers, assuming an infinite loop!\");\n          };\n\n          clock.runToFrame = function runToFrame() {\n            return clock.tick(getTimeToNextFrame());\n          };\n\n          if (typeof _global.Promise !== \"undefined\") {\n            clock.runAllAsync = function runAllAsync() {\n              return new _global.Promise(function (resolve, reject) {\n                var i = 0;\n\n                function doRun() {\n                  originalSetTimeout(function () {\n                    try {\n                      var numTimers;\n\n                      if (i < clock.loopLimit) {\n                        if (!clock.timers) {\n                          resolve(clock.now);\n                          return;\n                        }\n\n                        numTimers = Object.keys(clock.timers).length;\n\n                        if (numTimers === 0) {\n                          resolve(clock.now);\n                          return;\n                        }\n\n                        clock.next();\n                        i++;\n                        doRun();\n                        return;\n                      }\n\n                      reject(new Error(\"Aborting after running \" + clock.loopLimit + \" timers, assuming an infinite loop!\"));\n                    } catch (e) {\n                      reject(e);\n                    }\n                  });\n                }\n\n                doRun();\n              });\n            };\n          }\n\n          clock.runToLast = function runToLast() {\n            var timer = lastTimer(clock);\n\n            if (!timer) {\n              runJobs(clock);\n              return clock.now;\n            }\n\n            return clock.tick(timer.callAt - clock.now);\n          };\n\n          if (typeof _global.Promise !== \"undefined\") {\n            clock.runToLastAsync = function runToLastAsync() {\n              return new _global.Promise(function (resolve, reject) {\n                originalSetTimeout(function () {\n                  try {\n                    var timer = lastTimer(clock);\n\n                    if (!timer) {\n                      resolve(clock.now);\n                    }\n\n                    resolve(clock.tickAsync(timer.callAt));\n                  } catch (e) {\n                    reject(e);\n                  }\n                });\n              });\n            };\n          }\n\n          clock.reset = function reset() {\n            nanos = 0;\n            clock.timers = {};\n            clock.jobs = [];\n            clock.now = start;\n          };\n\n          clock.setSystemTime = function setSystemTime(systemTime) {\n            // determine time difference\n            var newNow = getEpoch(systemTime);\n            var difference = newNow - clock.now;\n            var id, timer;\n            adjustedSystemTime[0] = adjustedSystemTime[0] + difference;\n            adjustedSystemTime[1] = adjustedSystemTime[1] + nanos; // update 'system clock'\n\n            clock.now = newNow;\n            nanos = 0; // update timers and intervals to keep them stable\n\n            for (id in clock.timers) {\n              if (clock.timers.hasOwnProperty(id)) {\n                timer = clock.timers[id];\n                timer.createdAt += difference;\n                timer.callAt += difference;\n              }\n            }\n          };\n\n          if (performancePresent) {\n            clock.performance = Object.create(null);\n\n            if (hasPerformancePrototype) {\n              var proto = _global.Performance.prototype;\n              Object.getOwnPropertyNames(proto).forEach(function (name) {\n                if (name.indexOf(\"getEntries\") === 0) {\n                  // match expected return type for getEntries functions\n                  clock.performance[name] = NOOP_ARRAY;\n                } else {\n                  clock.performance[name] = NOOP;\n                }\n              });\n            }\n\n            clock.performance.now = function lolexNow() {\n              var hrt = hrtime();\n              var millis = hrt[0] * 1000 + hrt[1] / 1e6;\n              return millis;\n            };\n          }\n\n          if (hrtimePresent) {\n            clock.hrtime = hrtime;\n          }\n\n          return clock;\n        }\n        /**\n         * @param config {Object} optional config\n         * @param config.target {Object} the target to install timers in (default `window`)\n         * @param config.now {number|Date}  a number (in milliseconds) or a Date object (default epoch)\n         * @param config.toFake {string[]} names of the methods that should be faked.\n         * @param config.loopLimit {number} the maximum number of timers that will be run when calling runAll()\n         * @param config.shouldAdvanceTime {Boolean} tells lolex to increment mocked time automatically (default false)\n         * @param config.advanceTimeDelta {Number} increment mocked time every <<advanceTimeDelta>> ms (default: 20ms)\n         */\n        // eslint-disable-next-line complexity\n\n\n        function install(config) {\n          if (arguments.length > 1 || config instanceof Date || Array.isArray(config) || typeof config === \"number\") {\n            throw new TypeError(\"lolex.install called with \" + String(config) + \" lolex 2.0+ requires an object parameter - see https://github.com/sinonjs/lolex\");\n          } // eslint-disable-next-line no-param-reassign\n\n\n          config = typeof config !== \"undefined\" ? config : {};\n          config.shouldAdvanceTime = config.shouldAdvanceTime || false;\n          config.advanceTimeDelta = config.advanceTimeDelta || 20;\n          var i, l;\n          var target = config.target || _global;\n          var clock = createClock(config.now, config.loopLimit);\n\n          clock.uninstall = function () {\n            return uninstall(clock, target, config);\n          };\n\n          clock.methods = config.toFake || [];\n\n          if (clock.methods.length === 0) {\n            // do not fake nextTick by default - GitHub#126\n            clock.methods = keys(timers).filter(function (key) {\n              return key !== \"nextTick\" && key !== \"queueMicrotask\";\n            });\n          }\n\n          for (i = 0, l = clock.methods.length; i < l; i++) {\n            if (clock.methods[i] === \"hrtime\") {\n              if (target.process && typeof target.process.hrtime === \"function\") {\n                hijackMethod(target.process, clock.methods[i], clock);\n              }\n            } else if (clock.methods[i] === \"nextTick\") {\n              if (target.process && typeof target.process.nextTick === \"function\") {\n                hijackMethod(target.process, clock.methods[i], clock);\n              }\n            } else {\n              if (clock.methods[i] === \"setInterval\" && config.shouldAdvanceTime === true) {\n                var intervalTick = doIntervalTick.bind(null, clock, config.advanceTimeDelta);\n                var intervalId = target[clock.methods[i]](intervalTick, config.advanceTimeDelta);\n                clock.attachedInterval = intervalId;\n              }\n\n              hijackMethod(target, clock.methods[i], clock);\n            }\n          }\n\n          return clock;\n        }\n\n        return {\n          timers: timers,\n          createClock: createClock,\n          install: install,\n          withGlobal: withGlobal\n        };\n      }\n\n      var defaultImplementation = withGlobal(globalObject);\n      exports.timers = defaultImplementation.timers;\n      exports.createClock = defaultImplementation.createClock;\n      exports.install = defaultImplementation.install;\n      exports.withGlobal = withGlobal;\n    }, {\n      \"@sinonjs/commons\": 7\n    }]\n  }, {}, [20])(20);\n});\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/lolex/lolex.js?");

/***/ }),

/***/ "./node_modules/nise/nise.js":
/*!***********************************!*\
  !*** ./node_modules/nise/nise.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/***/ }),

/***/ "./node_modules/qunit/qunit/qunit.js":
/*!*******************************************!*\
  !*** ./node_modules/qunit/qunit/qunit.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;/*!\n * QUnit 2.14.0\n * https://qunitjs.com/\n *\n * Copyright OpenJS Foundation and other contributors\n * Released under the MIT license\n * https://jquery.org/license\n *\n * Date: 2021-01-12\n */\n(function (global$1) {\n  'use strict'; // Support IE 9-10, PhantomJS: Fallback for fuzzysort.js used by ./html.js\n  // eslint-disable-next-line no-unused-vars\n\n  var Map = typeof Map === \"function\" ? Map : function StringMap() {\n    var store = Object.create(null);\n\n    this.get = function (strKey) {\n      return store[strKey];\n    };\n\n    this.set = function (strKey, val) {\n      store[strKey] = val;\n      return this;\n    };\n\n    this.clear = function () {\n      store = Object.create(null);\n    };\n  };\n\n  function _interopDefaultLegacy(e) {\n    return e && typeof e === 'object' && 'default' in e ? e : {\n      'default': e\n    };\n  }\n\n  var global__default = /*#__PURE__*/_interopDefaultLegacy(global$1);\n\n  var window$1 = global__default['default'].window;\n  var self$1 = global__default['default'].self;\n  var console$1 = global__default['default'].console;\n  var setTimeout$1 = global__default['default'].setTimeout;\n  var clearTimeout = global__default['default'].clearTimeout;\n  var document = window$1 && window$1.document;\n  var navigator = window$1 && window$1.navigator;\n\n  var localSessionStorage = function () {\n    var x = \"qunit-test-string\";\n\n    try {\n      global__default['default'].sessionStorage.setItem(x, x);\n      global__default['default'].sessionStorage.removeItem(x);\n      return global__default['default'].sessionStorage;\n    } catch (e) {\n      return undefined;\n    }\n  }();\n\n  function _typeof(obj) {\n    \"@babel/helpers - typeof\";\n\n    if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") {\n      _typeof = function (obj) {\n        return typeof obj;\n      };\n    } else {\n      _typeof = function (obj) {\n        return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n      };\n    }\n\n    return _typeof(obj);\n  }\n\n  function _classCallCheck(instance, Constructor) {\n    if (!(instance instanceof Constructor)) {\n      throw new TypeError(\"Cannot call a class as a function\");\n    }\n  }\n\n  function _defineProperties(target, props) {\n    for (var i = 0; i < props.length; i++) {\n      var descriptor = props[i];\n      descriptor.enumerable = descriptor.enumerable || false;\n      descriptor.configurable = true;\n      if (\"value\" in descriptor) descriptor.writable = true;\n      Object.defineProperty(target, descriptor.key, descriptor);\n    }\n  }\n\n  function _createClass(Constructor, protoProps, staticProps) {\n    if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n    if (staticProps) _defineProperties(Constructor, staticProps);\n    return Constructor;\n  }\n\n  function _toConsumableArray(arr) {\n    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();\n  }\n\n  function _arrayWithoutHoles(arr) {\n    if (Array.isArray(arr)) return _arrayLikeToArray(arr);\n  }\n\n  function _iterableToArray(iter) {\n    if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter);\n  }\n\n  function _unsupportedIterableToArray(o, minLen) {\n    if (!o) return;\n    if (typeof o === \"string\") return _arrayLikeToArray(o, minLen);\n    var n = Object.prototype.toString.call(o).slice(8, -1);\n    if (n === \"Object\" && o.constructor) n = o.constructor.name;\n    if (n === \"Map\" || n === \"Set\") return Array.from(o);\n    if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);\n  }\n\n  function _arrayLikeToArray(arr, len) {\n    if (len == null || len > arr.length) len = arr.length;\n\n    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];\n\n    return arr2;\n  }\n\n  function _nonIterableSpread() {\n    throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n  }\n\n  function _createForOfIteratorHelper(o, allowArrayLike) {\n    var it;\n\n    if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) {\n      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") {\n        if (it) o = it;\n        var i = 0;\n\n        var F = function () {};\n\n        return {\n          s: F,\n          n: function () {\n            if (i >= o.length) return {\n              done: true\n            };\n            return {\n              done: false,\n              value: o[i++]\n            };\n          },\n          e: function (e) {\n            throw e;\n          },\n          f: F\n        };\n      }\n\n      throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n    }\n\n    var normalCompletion = true,\n        didErr = false,\n        err;\n    return {\n      s: function () {\n        it = o[Symbol.iterator]();\n      },\n      n: function () {\n        var step = it.next();\n        normalCompletion = step.done;\n        return step;\n      },\n      e: function (e) {\n        didErr = true;\n        err = e;\n      },\n      f: function () {\n        try {\n          if (!normalCompletion && it.return != null) it.return();\n        } finally {\n          if (didErr) throw err;\n        }\n      }\n    };\n  } // Detect if the console object exists and no-op otherwise.\n  // This allows support for IE 9, which doesn't have a console\n  // object if the developer tools are not open.\n  // Support: SpiderMonkey (mozjs 68+)\n  // The console object has a log method, but no warn method.\n\n\n  var Logger = {\n    warn: console$1 ? (console$1.warn || console$1.log).bind(console$1) : function () {}\n  };\n  var toString = Object.prototype.toString;\n  var hasOwn = Object.prototype.hasOwnProperty;\n\n  var now = Date.now || function () {\n    return new Date().getTime();\n  };\n\n  var nativePerf = getNativePerf();\n\n  function getNativePerf() {\n    if (window$1 && typeof window$1.performance !== \"undefined\" && typeof window$1.performance.mark === \"function\" && typeof window$1.performance.measure === \"function\") {\n      return window$1.performance;\n    } else {\n      return undefined;\n    }\n  }\n\n  var performance = {\n    now: nativePerf ? nativePerf.now.bind(nativePerf) : now,\n    measure: nativePerf ? function (comment, startMark, endMark) {\n      // `performance.measure` may fail if the mark could not be found.\n      // reasons a specific mark could not be found include: outside code invoking `performance.clearMarks()`\n      try {\n        nativePerf.measure(comment, startMark, endMark);\n      } catch (ex) {\n        Logger.warn(\"performance.measure could not be executed because of \", ex.message);\n      }\n    } : function () {},\n    mark: nativePerf ? nativePerf.mark.bind(nativePerf) : function () {}\n  }; // Returns a new Array with the elements that are in a but not in b\n\n  function diff(a, b) {\n    var result = a.slice();\n\n    for (var i = 0; i < result.length; i++) {\n      for (var j = 0; j < b.length; j++) {\n        if (result[i] === b[j]) {\n          result.splice(i, 1);\n          i--;\n          break;\n        }\n      }\n    }\n\n    return result;\n  }\n  /**\n   * Determines whether an element exists in a given array or not.\n   *\n   * @method inArray\n   * @param {Any} elem\n   * @param {Array} array\n   * @return {boolean}\n   */\n\n\n  function inArray(elem, array) {\n    return array.indexOf(elem) !== -1;\n  }\n  /**\n   * Makes a clone of an object using only Array or Object as base,\n   * and copies over the own enumerable properties.\n   *\n   * @param {Object} obj\n   * @return {Object} New object with only the own properties (recursively).\n   */\n\n\n  function objectValues(obj) {\n    var vals = is(\"array\", obj) ? [] : {};\n\n    for (var key in obj) {\n      if (hasOwn.call(obj, key)) {\n        var val = obj[key];\n        vals[key] = val === Object(val) ? objectValues(val) : val;\n      }\n    }\n\n    return vals;\n  }\n\n  function extend(a, b, undefOnly) {\n    for (var prop in b) {\n      if (hasOwn.call(b, prop)) {\n        if (b[prop] === undefined) {\n          delete a[prop];\n        } else if (!(undefOnly && typeof a[prop] !== \"undefined\")) {\n          a[prop] = b[prop];\n        }\n      }\n    }\n\n    return a;\n  }\n\n  function objectType(obj) {\n    if (typeof obj === \"undefined\") {\n      return \"undefined\";\n    } // Consider: typeof null === object\n\n\n    if (obj === null) {\n      return \"null\";\n    }\n\n    var match = toString.call(obj).match(/^\\[object\\s(.*)\\]$/);\n    var type = match && match[1];\n\n    switch (type) {\n      case \"Number\":\n        if (isNaN(obj)) {\n          return \"nan\";\n        }\n\n        return \"number\";\n\n      case \"String\":\n      case \"Boolean\":\n      case \"Array\":\n      case \"Set\":\n      case \"Map\":\n      case \"Date\":\n      case \"RegExp\":\n      case \"Function\":\n      case \"Symbol\":\n        return type.toLowerCase();\n\n      default:\n        return _typeof(obj);\n    }\n  } // Safe object type checking\n\n\n  function is(type, obj) {\n    return objectType(obj) === type;\n  } // Based on Java's String.hashCode, a simple but not\n  // rigorously collision resistant hashing function\n\n\n  function generateHash(module, testName) {\n    var str = module + \"\\x1C\" + testName;\n    var hash = 0;\n\n    for (var i = 0; i < str.length; i++) {\n      hash = (hash << 5) - hash + str.charCodeAt(i);\n      hash |= 0;\n    } // Convert the possibly negative integer hash code into an 8 character hex string, which isn't\n    // strictly necessary but increases user understanding that the id is a SHA-like hash\n\n\n    var hex = (0x100000000 + hash).toString(16);\n\n    if (hex.length < 8) {\n      hex = \"0000000\" + hex;\n    }\n\n    return hex.slice(-8);\n  } // Authors: Philippe Rathé <prathe@gmail.com>, David Chan <david@troi.org>\n\n\n  var equiv = function () {\n    // Value pairs queued for comparison. Used for breadth-first processing order, recursion\n    // detection and avoiding repeated comparison (see below for details).\n    // Elements are { a: val, b: val }.\n    var pairs = [];\n\n    var getProto = Object.getPrototypeOf || function (obj) {\n      return obj.__proto__;\n    };\n\n    function useStrictEquality(a, b) {\n      // This only gets called if a and b are not strict equal, and is used to compare on\n      // the primitive values inside object wrappers. For example:\n      // `var i = 1;`\n      // `var j = new Number(1);`\n      // Neither a nor b can be null, as a !== b and they have the same type.\n      if (_typeof(a) === \"object\") {\n        a = a.valueOf();\n      }\n\n      if (_typeof(b) === \"object\") {\n        b = b.valueOf();\n      }\n\n      return a === b;\n    }\n\n    function compareConstructors(a, b) {\n      var protoA = getProto(a);\n      var protoB = getProto(b); // Comparing constructors is more strict than using `instanceof`\n\n      if (a.constructor === b.constructor) {\n        return true;\n      } // Ref #851\n      // If the obj prototype descends from a null constructor, treat it\n      // as a null prototype.\n\n\n      if (protoA && protoA.constructor === null) {\n        protoA = null;\n      }\n\n      if (protoB && protoB.constructor === null) {\n        protoB = null;\n      } // Allow objects with no prototype to be equivalent to\n      // objects with Object as their constructor.\n\n\n      if (protoA === null && protoB === Object.prototype || protoB === null && protoA === Object.prototype) {\n        return true;\n      }\n\n      return false;\n    }\n\n    function getRegExpFlags(regexp) {\n      return \"flags\" in regexp ? regexp.flags : regexp.toString().match(/[gimuy]*$/)[0];\n    }\n\n    function isContainer(val) {\n      return [\"object\", \"array\", \"map\", \"set\"].indexOf(objectType(val)) !== -1;\n    }\n\n    function breadthFirstCompareChild(a, b) {\n      // If a is a container not reference-equal to b, postpone the comparison to the\n      // end of the pairs queue -- unless (a, b) has been seen before, in which case skip\n      // over the pair.\n      if (a === b) {\n        return true;\n      }\n\n      if (!isContainer(a)) {\n        return typeEquiv(a, b);\n      }\n\n      if (pairs.every(function (pair) {\n        return pair.a !== a || pair.b !== b;\n      })) {\n        // Not yet started comparing this pair\n        pairs.push({\n          a: a,\n          b: b\n        });\n      }\n\n      return true;\n    }\n\n    var callbacks = {\n      \"string\": useStrictEquality,\n      \"boolean\": useStrictEquality,\n      \"number\": useStrictEquality,\n      \"null\": useStrictEquality,\n      \"undefined\": useStrictEquality,\n      \"symbol\": useStrictEquality,\n      \"date\": useStrictEquality,\n      \"nan\": function nan() {\n        return true;\n      },\n      \"regexp\": function regexp(a, b) {\n        return a.source === b.source && // Include flags in the comparison\n        getRegExpFlags(a) === getRegExpFlags(b);\n      },\n      // abort (identical references / instance methods were skipped earlier)\n      \"function\": function _function() {\n        return false;\n      },\n      \"array\": function array(a, b) {\n        var len = a.length;\n\n        if (len !== b.length) {\n          // Safe and faster\n          return false;\n        }\n\n        for (var i = 0; i < len; i++) {\n          // Compare non-containers; queue non-reference-equal containers\n          if (!breadthFirstCompareChild(a[i], b[i])) {\n            return false;\n          }\n        }\n\n        return true;\n      },\n      // Define sets a and b to be equivalent if for each element aVal in a, there\n      // is some element bVal in b such that aVal and bVal are equivalent. Element\n      // repetitions are not counted, so these are equivalent:\n      // a = new Set( [ {}, [], [] ] );\n      // b = new Set( [ {}, {}, [] ] );\n      \"set\": function set(a, b) {\n        if (a.size !== b.size) {\n          // This optimization has certain quirks because of the lack of\n          // repetition counting. For instance, adding the same\n          // (reference-identical) element to two equivalent sets can\n          // make them non-equivalent.\n          return false;\n        }\n\n        var outerEq = true;\n        a.forEach(function (aVal) {\n          // Short-circuit if the result is already known. (Using for...of\n          // with a break clause would be cleaner here, but it would cause\n          // a syntax error on older Javascript implementations even if\n          // Set is unused)\n          if (!outerEq) {\n            return;\n          }\n\n          var innerEq = false;\n          b.forEach(function (bVal) {\n            // Likewise, short-circuit if the result is already known\n            if (innerEq) {\n              return;\n            } // Swap out the global pairs list, as the nested call to\n            // innerEquiv will clobber its contents\n\n\n            var parentPairs = pairs;\n\n            if (innerEquiv(bVal, aVal)) {\n              innerEq = true;\n            } // Replace the global pairs list\n\n\n            pairs = parentPairs;\n          });\n\n          if (!innerEq) {\n            outerEq = false;\n          }\n        });\n        return outerEq;\n      },\n      // Define maps a and b to be equivalent if for each key-value pair (aKey, aVal)\n      // in a, there is some key-value pair (bKey, bVal) in b such that\n      // [ aKey, aVal ] and [ bKey, bVal ] are equivalent. Key repetitions are not\n      // counted, so these are equivalent:\n      // a = new Map( [ [ {}, 1 ], [ {}, 1 ], [ [], 1 ] ] );\n      // b = new Map( [ [ {}, 1 ], [ [], 1 ], [ [], 1 ] ] );\n      \"map\": function map(a, b) {\n        if (a.size !== b.size) {\n          // This optimization has certain quirks because of the lack of\n          // repetition counting. For instance, adding the same\n          // (reference-identical) key-value pair to two equivalent maps\n          // can make them non-equivalent.\n          return false;\n        }\n\n        var outerEq = true;\n        a.forEach(function (aVal, aKey) {\n          // Short-circuit if the result is already known. (Using for...of\n          // with a break clause would be cleaner here, but it would cause\n          // a syntax error on older Javascript implementations even if\n          // Map is unused)\n          if (!outerEq) {\n            return;\n          }\n\n          var innerEq = false;\n          b.forEach(function (bVal, bKey) {\n            // Likewise, short-circuit if the result is already known\n            if (innerEq) {\n              return;\n            } // Swap out the global pairs list, as the nested call to\n            // innerEquiv will clobber its contents\n\n\n            var parentPairs = pairs;\n\n            if (innerEquiv([bVal, bKey], [aVal, aKey])) {\n              innerEq = true;\n            } // Replace the global pairs list\n\n\n            pairs = parentPairs;\n          });\n\n          if (!innerEq) {\n            outerEq = false;\n          }\n        });\n        return outerEq;\n      },\n      \"object\": function object(a, b) {\n        if (compareConstructors(a, b) === false) {\n          return false;\n        }\n\n        var aProperties = [];\n        var bProperties = []; // Be strict: don't ensure hasOwnProperty and go deep\n\n        for (var i in a) {\n          // Collect a's properties\n          aProperties.push(i); // Skip OOP methods that look the same\n\n          if (a.constructor !== Object && typeof a.constructor !== \"undefined\" && typeof a[i] === \"function\" && typeof b[i] === \"function\" && a[i].toString() === b[i].toString()) {\n            continue;\n          } // Compare non-containers; queue non-reference-equal containers\n\n\n          if (!breadthFirstCompareChild(a[i], b[i])) {\n            return false;\n          }\n        }\n\n        for (var _i in b) {\n          // Collect b's properties\n          bProperties.push(_i);\n        } // Ensures identical properties name\n\n\n        return typeEquiv(aProperties.sort(), bProperties.sort());\n      }\n    };\n\n    function typeEquiv(a, b) {\n      var type = objectType(a); // Callbacks for containers will append to the pairs queue to achieve breadth-first\n      // search order. The pairs queue is also used to avoid reprocessing any pair of\n      // containers that are reference-equal to a previously visited pair (a special case\n      // this being recursion detection).\n      //\n      // Because of this approach, once typeEquiv returns a false value, it should not be\n      // called again without clearing the pair queue else it may wrongly report a visited\n      // pair as being equivalent.\n\n      return objectType(b) === type && callbacks[type](a, b);\n    }\n\n    function innerEquiv(a, b) {\n      // We're done when there's nothing more to compare\n      if (arguments.length < 2) {\n        return true;\n      } // Clear the global pair queue and add the top-level values being compared\n\n\n      pairs = [{\n        a: a,\n        b: b\n      }];\n\n      for (var i = 0; i < pairs.length; i++) {\n        var pair = pairs[i]; // Perform type-specific comparison on any pairs that are not strictly\n        // equal. For container types, that comparison will postpone comparison\n        // of any sub-container pair to the end of the pair queue. This gives\n        // breadth-first search order. It also avoids the reprocessing of\n        // reference-equal siblings, cousins etc, which can have a significant speed\n        // impact when comparing a container of small objects each of which has a\n        // reference to the same (singleton) large object.\n\n        if (pair.a !== pair.b && !typeEquiv(pair.a, pair.b)) {\n          return false;\n        }\n      } // ...across all consecutive argument pairs\n\n\n      return arguments.length === 2 || innerEquiv.apply(this, [].slice.call(arguments, 1));\n    }\n\n    return function () {\n      var result = innerEquiv.apply(void 0, arguments); // Release any retained objects\n\n      pairs.length = 0;\n      return result;\n    };\n  }();\n  /**\n   * Config object: Maintain internal state\n   * Later exposed as QUnit.config\n   * `config` initialized at top of scope\n   */\n\n\n  var config = {\n    // The queue of tests to run\n    queue: [],\n    // Block until document ready\n    blocking: true,\n    // By default, run previously failed tests first\n    // very useful in combination with \"Hide passed tests\" checked\n    reorder: true,\n    // By default, modify document.title when suite is done\n    altertitle: true,\n    // HTML Reporter: collapse every test except the first failing test\n    // If false, all failing tests will be expanded\n    collapse: true,\n    // By default, scroll to top of the page when suite is done\n    scrolltop: true,\n    // Depth up-to which object will be dumped\n    maxDepth: 5,\n    // When enabled, all tests must call expect()\n    requireExpects: false,\n    // Placeholder for user-configurable form-exposed URL parameters\n    urlConfig: [],\n    // Set of all modules.\n    modules: [],\n    // The first unnamed module\n    currentModule: {\n      name: \"\",\n      tests: [],\n      childModules: [],\n      testsRun: 0,\n      testsIgnored: 0,\n      hooks: {\n        before: [],\n        beforeEach: [],\n        afterEach: [],\n        after: []\n      }\n    },\n    callbacks: {},\n    // The storage module to use for reordering tests\n    storage: localSessionStorage\n  }; // take a predefined QUnit.config and extend the defaults\n\n  var globalConfig = window$1 && window$1.QUnit && window$1.QUnit.config; // only extend the global config if there is no QUnit overload\n\n  if (window$1 && window$1.QUnit && !window$1.QUnit.version) {\n    extend(config, globalConfig);\n  } // Push a loose unnamed module to the modules collection\n\n\n  config.modules.push(config.currentModule);\n\n  var dump = function () {\n    function quote(str) {\n      return \"\\\"\" + str.toString().replace(/\\\\/g, \"\\\\\\\\\").replace(/\"/g, \"\\\\\\\"\") + \"\\\"\";\n    }\n\n    function literal(o) {\n      return o + \"\";\n    }\n\n    function join(pre, arr, post) {\n      var s = dump.separator();\n      var inner = dump.indent(1);\n\n      if (arr.join) {\n        arr = arr.join(\",\" + s + inner);\n      }\n\n      if (!arr) {\n        return pre + post;\n      }\n\n      var base = dump.indent();\n      return [pre, inner + arr, base + post].join(s);\n    }\n\n    function array(arr, stack) {\n      if (dump.maxDepth && dump.depth > dump.maxDepth) {\n        return \"[object Array]\";\n      }\n\n      this.up();\n      var i = arr.length;\n      var ret = new Array(i);\n\n      while (i--) {\n        ret[i] = this.parse(arr[i], undefined, stack);\n      }\n\n      this.down();\n      return join(\"[\", ret, \"]\");\n    }\n\n    function isArray(obj) {\n      return (//Native Arrays\n        toString.call(obj) === \"[object Array]\" || // NodeList objects\n        typeof obj.length === \"number\" && obj.item !== undefined && (obj.length ? obj.item(0) === obj[0] : obj.item(0) === null && obj[0] === undefined)\n      );\n    }\n\n    var reName = /^function (\\w+)/;\n    var dump = {\n      // The objType is used mostly internally, you can fix a (custom) type in advance\n      parse: function parse(obj, objType, stack) {\n        stack = stack || [];\n        var objIndex = stack.indexOf(obj);\n\n        if (objIndex !== -1) {\n          return \"recursion(\".concat(objIndex - stack.length, \")\");\n        }\n\n        objType = objType || this.typeOf(obj);\n        var parser = this.parsers[objType];\n\n        var parserType = _typeof(parser);\n\n        if (parserType === \"function\") {\n          stack.push(obj);\n          var res = parser.call(this, obj, stack);\n          stack.pop();\n          return res;\n        }\n\n        return parserType === \"string\" ? parser : this.parsers.error;\n      },\n      typeOf: function typeOf(obj) {\n        var type;\n\n        if (obj === null) {\n          type = \"null\";\n        } else if (typeof obj === \"undefined\") {\n          type = \"undefined\";\n        } else if (is(\"regexp\", obj)) {\n          type = \"regexp\";\n        } else if (is(\"date\", obj)) {\n          type = \"date\";\n        } else if (is(\"function\", obj)) {\n          type = \"function\";\n        } else if (obj.setInterval !== undefined && obj.document !== undefined && obj.nodeType === undefined) {\n          type = \"window\";\n        } else if (obj.nodeType === 9) {\n          type = \"document\";\n        } else if (obj.nodeType) {\n          type = \"node\";\n        } else if (isArray(obj)) {\n          type = \"array\";\n        } else if (obj.constructor === Error.prototype.constructor) {\n          type = \"error\";\n        } else {\n          type = _typeof(obj);\n        }\n\n        return type;\n      },\n      separator: function separator() {\n        if (this.multiline) {\n          return this.HTML ? \"<br />\" : \"\\n\";\n        } else {\n          return this.HTML ? \"&#160;\" : \" \";\n        }\n      },\n      // Extra can be a number, shortcut for increasing-calling-decreasing\n      indent: function indent(extra) {\n        if (!this.multiline) {\n          return \"\";\n        }\n\n        var chr = this.indentChar;\n\n        if (this.HTML) {\n          chr = chr.replace(/\\t/g, \"   \").replace(/ /g, \"&#160;\");\n        }\n\n        return new Array(this.depth + (extra || 0)).join(chr);\n      },\n      up: function up(a) {\n        this.depth += a || 1;\n      },\n      down: function down(a) {\n        this.depth -= a || 1;\n      },\n      setParser: function setParser(name, parser) {\n        this.parsers[name] = parser;\n      },\n      // The next 3 are exposed so you can use them\n      quote: quote,\n      literal: literal,\n      join: join,\n      depth: 1,\n      maxDepth: config.maxDepth,\n      // This is the list of parsers, to modify them, use dump.setParser\n      parsers: {\n        window: \"[Window]\",\n        document: \"[Document]\",\n        error: function error(_error) {\n          return \"Error(\\\"\" + _error.message + \"\\\")\";\n        },\n        unknown: \"[Unknown]\",\n        \"null\": \"null\",\n        \"undefined\": \"undefined\",\n        \"function\": function _function(fn) {\n          var ret = \"function\"; // Functions never have name in IE\n\n          var name = \"name\" in fn ? fn.name : (reName.exec(fn) || [])[1];\n\n          if (name) {\n            ret += \" \" + name;\n          }\n\n          ret += \"(\";\n          ret = [ret, dump.parse(fn, \"functionArgs\"), \"){\"].join(\"\");\n          return join(ret, dump.parse(fn, \"functionCode\"), \"}\");\n        },\n        array: array,\n        nodelist: array,\n        \"arguments\": array,\n        object: function object(map, stack) {\n          var ret = [];\n\n          if (dump.maxDepth && dump.depth > dump.maxDepth) {\n            return \"[object Object]\";\n          }\n\n          dump.up();\n          var keys = [];\n\n          for (var key in map) {\n            keys.push(key);\n          } // Some properties are not always enumerable on Error objects.\n\n\n          var nonEnumerableProperties = [\"message\", \"name\"];\n\n          for (var i in nonEnumerableProperties) {\n            var _key = nonEnumerableProperties[i];\n\n            if (_key in map && !inArray(_key, keys)) {\n              keys.push(_key);\n            }\n          }\n\n          keys.sort();\n\n          for (var _i = 0; _i < keys.length; _i++) {\n            var _key2 = keys[_i];\n            var val = map[_key2];\n            ret.push(dump.parse(_key2, \"key\") + \": \" + dump.parse(val, undefined, stack));\n          }\n\n          dump.down();\n          return join(\"{\", ret, \"}\");\n        },\n        node: function node(_node) {\n          var open = dump.HTML ? \"&lt;\" : \"<\";\n          var close = dump.HTML ? \"&gt;\" : \">\";\n\n          var tag = _node.nodeName.toLowerCase();\n\n          var ret = open + tag;\n          var attrs = _node.attributes;\n\n          if (attrs) {\n            for (var i = 0, len = attrs.length; i < len; i++) {\n              var val = attrs[i].nodeValue; // IE6 includes all attributes in .attributes, even ones not explicitly\n              // set. Those have values like undefined, null, 0, false, \"\" or\n              // \"inherit\".\n\n              if (val && val !== \"inherit\") {\n                ret += \" \" + attrs[i].nodeName + \"=\" + dump.parse(val, \"attribute\");\n              }\n            }\n          }\n\n          ret += close; // Show content of TextNode or CDATASection\n\n          if (_node.nodeType === 3 || _node.nodeType === 4) {\n            ret += _node.nodeValue;\n          }\n\n          return ret + open + \"/\" + tag + close;\n        },\n        // Function calls it internally, it's the arguments part of the function\n        functionArgs: function functionArgs(fn) {\n          var l = fn.length;\n\n          if (!l) {\n            return \"\";\n          }\n\n          var args = new Array(l);\n\n          while (l--) {\n            // 97 is 'a'\n            args[l] = String.fromCharCode(97 + l);\n          }\n\n          return \" \" + args.join(\", \") + \" \";\n        },\n        // Object calls it internally, the key part of an item in a map\n        key: quote,\n        // Function calls it internally, it's the content of the function\n        functionCode: \"[code]\",\n        // Node calls it internally, it's a html attribute value\n        attribute: quote,\n        string: quote,\n        date: quote,\n        regexp: literal,\n        number: literal,\n        \"boolean\": literal,\n        symbol: function symbol(sym) {\n          return sym.toString();\n        }\n      },\n      // If true, entities are escaped ( <, >, \\t, space and \\n )\n      HTML: false,\n      // Indentation unit\n      indentChar: \"  \",\n      // If true, items in a collection, are separated by a \\n, else just a space.\n      multiline: true\n    };\n    return dump;\n  }();\n\n  var SuiteReport = /*#__PURE__*/function () {\n    function SuiteReport(name, parentSuite) {\n      _classCallCheck(this, SuiteReport);\n\n      this.name = name;\n      this.fullName = parentSuite ? parentSuite.fullName.concat(name) : [];\n      this.tests = [];\n      this.childSuites = [];\n\n      if (parentSuite) {\n        parentSuite.pushChildSuite(this);\n      }\n    }\n\n    _createClass(SuiteReport, [{\n      key: \"start\",\n      value: function start(recordTime) {\n        if (recordTime) {\n          this._startTime = performance.now();\n          var suiteLevel = this.fullName.length;\n          performance.mark(\"qunit_suite_\".concat(suiteLevel, \"_start\"));\n        }\n\n        return {\n          name: this.name,\n          fullName: this.fullName.slice(),\n          tests: this.tests.map(function (test) {\n            return test.start();\n          }),\n          childSuites: this.childSuites.map(function (suite) {\n            return suite.start();\n          }),\n          testCounts: {\n            total: this.getTestCounts().total\n          }\n        };\n      }\n    }, {\n      key: \"end\",\n      value: function end(recordTime) {\n        if (recordTime) {\n          this._endTime = performance.now();\n          var suiteLevel = this.fullName.length;\n          var suiteName = this.fullName.join(\" – \");\n          performance.mark(\"qunit_suite_\".concat(suiteLevel, \"_end\"));\n          performance.measure(suiteLevel === 0 ? \"QUnit Test Run\" : \"QUnit Test Suite: \".concat(suiteName), \"qunit_suite_\".concat(suiteLevel, \"_start\"), \"qunit_suite_\".concat(suiteLevel, \"_end\"));\n        }\n\n        return {\n          name: this.name,\n          fullName: this.fullName.slice(),\n          tests: this.tests.map(function (test) {\n            return test.end();\n          }),\n          childSuites: this.childSuites.map(function (suite) {\n            return suite.end();\n          }),\n          testCounts: this.getTestCounts(),\n          runtime: this.getRuntime(),\n          status: this.getStatus()\n        };\n      }\n    }, {\n      key: \"pushChildSuite\",\n      value: function pushChildSuite(suite) {\n        this.childSuites.push(suite);\n      }\n    }, {\n      key: \"pushTest\",\n      value: function pushTest(test) {\n        this.tests.push(test);\n      }\n    }, {\n      key: \"getRuntime\",\n      value: function getRuntime() {\n        return this._endTime - this._startTime;\n      }\n    }, {\n      key: \"getTestCounts\",\n      value: function getTestCounts() {\n        var counts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {\n          passed: 0,\n          failed: 0,\n          skipped: 0,\n          todo: 0,\n          total: 0\n        };\n        counts = this.tests.reduce(function (counts, test) {\n          if (test.valid) {\n            counts[test.getStatus()]++;\n            counts.total++;\n          }\n\n          return counts;\n        }, counts);\n        return this.childSuites.reduce(function (counts, suite) {\n          return suite.getTestCounts(counts);\n        }, counts);\n      }\n    }, {\n      key: \"getStatus\",\n      value: function getStatus() {\n        var _this$getTestCounts = this.getTestCounts(),\n            total = _this$getTestCounts.total,\n            failed = _this$getTestCounts.failed,\n            skipped = _this$getTestCounts.skipped,\n            todo = _this$getTestCounts.todo;\n\n        if (failed) {\n          return \"failed\";\n        } else {\n          if (skipped === total) {\n            return \"skipped\";\n          } else if (todo === total) {\n            return \"todo\";\n          } else {\n            return \"passed\";\n          }\n        }\n      }\n    }]);\n\n    return SuiteReport;\n  }();\n\n  var moduleStack = [];\n\n  function isParentModuleInQueue() {\n    var modulesInQueue = config.modules.map(function (module) {\n      return module.moduleId;\n    });\n    return moduleStack.some(function (module) {\n      return modulesInQueue.includes(module.moduleId);\n    });\n  }\n\n  function createModule(name, testEnvironment, modifiers) {\n    var parentModule = moduleStack.length ? moduleStack.slice(-1)[0] : null;\n    var moduleName = parentModule !== null ? [parentModule.name, name].join(\" > \") : name;\n    var parentSuite = parentModule ? parentModule.suiteReport : globalSuite;\n    var skip = parentModule !== null && parentModule.skip || modifiers.skip;\n    var todo = parentModule !== null && parentModule.todo || modifiers.todo;\n    var module = {\n      name: moduleName,\n      parentModule: parentModule,\n      tests: [],\n      moduleId: generateHash(moduleName),\n      testsRun: 0,\n      testsIgnored: 0,\n      childModules: [],\n      suiteReport: new SuiteReport(name, parentSuite),\n      // Pass along `skip` and `todo` properties from parent module, in case\n      // there is one, to childs. And use own otherwise.\n      // This property will be used to mark own tests and tests of child suites\n      // as either `skipped` or `todo`.\n      skip: skip,\n      todo: skip ? false : todo,\n      ignored: modifiers.ignored || false\n    };\n    var env = {};\n\n    if (parentModule) {\n      parentModule.childModules.push(module);\n      extend(env, parentModule.testEnvironment);\n    }\n\n    extend(env, testEnvironment);\n    module.testEnvironment = env;\n    config.modules.push(module);\n    return module;\n  }\n\n  function processModule(name, options, executeNow) {\n    var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};\n\n    if (objectType(options) === \"function\") {\n      executeNow = options;\n      options = undefined;\n    }\n\n    var module = createModule(name, options, modifiers); // Move any hooks to a 'hooks' object\n\n    var testEnvironment = module.testEnvironment;\n    var hooks = module.hooks = {};\n    setHookFromEnvironment(hooks, testEnvironment, \"before\");\n    setHookFromEnvironment(hooks, testEnvironment, \"beforeEach\");\n    setHookFromEnvironment(hooks, testEnvironment, \"afterEach\");\n    setHookFromEnvironment(hooks, testEnvironment, \"after\");\n    var moduleFns = {\n      before: setHookFunction(module, \"before\"),\n      beforeEach: setHookFunction(module, \"beforeEach\"),\n      afterEach: setHookFunction(module, \"afterEach\"),\n      after: setHookFunction(module, \"after\")\n    };\n    var currentModule = config.currentModule;\n\n    if (objectType(executeNow) === \"function\") {\n      moduleStack.push(module);\n      config.currentModule = module;\n      executeNow.call(module.testEnvironment, moduleFns);\n      moduleStack.pop();\n      module = module.parentModule || currentModule;\n    }\n\n    config.currentModule = module;\n\n    function setHookFromEnvironment(hooks, environment, name) {\n      var potentialHook = environment[name];\n      hooks[name] = typeof potentialHook === \"function\" ? [potentialHook] : [];\n      delete environment[name];\n    }\n\n    function setHookFunction(module, hookName) {\n      return function setHook(callback) {\n        module.hooks[hookName].push(callback);\n      };\n    }\n  }\n\n  var focused = false; // indicates that the \"only\" filter was used\n\n  function module$1(name, options, executeNow) {\n    var ignored = focused && !isParentModuleInQueue();\n    processModule(name, options, executeNow, {\n      ignored: ignored\n    });\n  }\n\n  module$1.only = function () {\n    if (!focused) {\n      config.modules.length = 0;\n      config.queue.length = 0;\n    }\n\n    processModule.apply(void 0, arguments);\n    focused = true;\n  };\n\n  module$1.skip = function (name, options, executeNow) {\n    if (focused) {\n      return;\n    }\n\n    processModule(name, options, executeNow, {\n      skip: true\n    });\n  };\n\n  module$1.todo = function (name, options, executeNow) {\n    if (focused) {\n      return;\n    }\n\n    processModule(name, options, executeNow, {\n      todo: true\n    });\n  };\n\n  var LISTENERS = Object.create(null);\n  var SUPPORTED_EVENTS = [\"runStart\", \"suiteStart\", \"testStart\", \"assertion\", \"testEnd\", \"suiteEnd\", \"runEnd\"];\n  /**\n   * Emits an event with the specified data to all currently registered listeners.\n   * Callbacks will fire in the order in which they are registered (FIFO). This\n   * function is not exposed publicly; it is used by QUnit internals to emit\n   * logging events.\n   *\n   * @private\n   * @method emit\n   * @param {string} eventName\n   * @param {Object} data\n   * @return {void}\n   */\n\n  function emit(eventName, data) {\n    if (objectType(eventName) !== \"string\") {\n      throw new TypeError(\"eventName must be a string when emitting an event\");\n    } // Clone the callbacks in case one of them registers a new callback\n\n\n    var originalCallbacks = LISTENERS[eventName];\n    var callbacks = originalCallbacks ? _toConsumableArray(originalCallbacks) : [];\n\n    for (var i = 0; i < callbacks.length; i++) {\n      callbacks[i](data);\n    }\n  }\n  /**\n   * Registers a callback as a listener to the specified event.\n   *\n   * @public\n   * @method on\n   * @param {string} eventName\n   * @param {Function} callback\n   * @return {void}\n   */\n\n\n  function on(eventName, callback) {\n    if (objectType(eventName) !== \"string\") {\n      throw new TypeError(\"eventName must be a string when registering a listener\");\n    } else if (!inArray(eventName, SUPPORTED_EVENTS)) {\n      var events = SUPPORTED_EVENTS.join(\", \");\n      throw new Error(\"\\\"\".concat(eventName, \"\\\" is not a valid event; must be one of: \").concat(events, \".\"));\n    } else if (objectType(callback) !== \"function\") {\n      throw new TypeError(\"callback must be a function when registering a listener\");\n    }\n\n    if (!LISTENERS[eventName]) {\n      LISTENERS[eventName] = [];\n    } // Don't register the same callback more than once\n\n\n    if (!inArray(callback, LISTENERS[eventName])) {\n      LISTENERS[eventName].push(callback);\n    }\n  }\n\n  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};\n\n  function createCommonjsModule(fn, basedir, module) {\n    return module = {\n      path: basedir,\n      exports: {},\n      require: function (path, base) {\n        return commonjsRequire(path, base === undefined || base === null ? module.path : base);\n      }\n    }, fn(module, module.exports), module.exports;\n  }\n\n  function commonjsRequire() {\n    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');\n  }\n\n  var promisePolyfill = createCommonjsModule(function (module) {\n    /*\n    https://github.com/taylorhakes/promise-polyfill/tree/8.2.0\n    \n    Copyright 2014 Taylor Hakes\n    Copyright 2014 Forbes Lindesay\n    \n    Permission is hereby granted, free of charge, to any person obtaining a copy\n    of this software and associated documentation files (the \"Software\"), to deal\n    in the Software without restriction, including without limitation the rights\n    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n    copies of the Software, and to permit persons to whom the Software is\n    furnished to do so, subject to the following conditions:\n    \n    The above copyright notice and this permission notice shall be included in\n    all copies or substantial portions of the Software.\n    \n    THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n    THE SOFTWARE.\n    \n    -------\n    \n    Patches for use in QUnit:\n    \n    - 2021-01-09: Export as module only, don't change global scope as QUnit must not\n      affect the host context (e.g. people may test their application intentionally\n      with different or no polyfills and we must not affect that).\n    \n    - 2021-01-10: Avoid unconditional reference to setTimeout, which isn't supported\n      on SpiderMonkey (mozjs 68). Done by re-arranging the code so that we return early\n      (it has native support for Promise), instead of building an unused polyfill.\n    \n    - 2021-01-10: Add 'globalThis' to globalNS implementation to support SpiderMonkey.\n    \n    */\n    (function () {\n      /** @suppress {undefinedVars} */\n      var globalNS = function () {\n        // the only reliable means to get the global object is\n        // `Function('return this')()`\n        // However, this causes CSP violations in Chrome apps.\n        if (typeof globalThis !== 'undefined') {\n          return globalThis;\n        }\n\n        if (typeof self !== 'undefined') {\n          return self;\n        }\n\n        if (typeof window !== 'undefined') {\n          return window;\n        }\n\n        if (typeof commonjsGlobal !== 'undefined') {\n          return commonjsGlobal;\n        }\n\n        throw new Error('unable to locate global object');\n      }(); // Expose the polyfill if Promise is undefined or set to a\n      // non-function value. The latter can be due to a named HTMLElement\n      // being exposed by browsers for legacy reasons.\n      // https://github.com/taylorhakes/promise-polyfill/issues/114\n\n\n      if (typeof globalNS['Promise'] === 'function') {\n        module.exports = globalNS['Promise'];\n        return;\n      }\n      /**\n       * @this {Promise}\n       */\n\n\n      function finallyConstructor(callback) {\n        var constructor = this.constructor;\n        return this.then(function (value) {\n          // @ts-ignore\n          return constructor.resolve(callback()).then(function () {\n            return value;\n          });\n        }, function (reason) {\n          // @ts-ignore\n          return constructor.resolve(callback()).then(function () {\n            // @ts-ignore\n            return constructor.reject(reason);\n          });\n        });\n      }\n\n      function allSettled(arr) {\n        var P = this;\n        return new P(function (resolve, reject) {\n          if (!(arr && typeof arr.length !== 'undefined')) {\n            return reject(new TypeError(_typeof(arr) + ' ' + arr + ' is not iterable(cannot read property Symbol(Symbol.iterator))'));\n          }\n\n          var args = Array.prototype.slice.call(arr);\n          if (args.length === 0) return resolve([]);\n          var remaining = args.length;\n\n          function res(i, val) {\n            if (val && (_typeof(val) === 'object' || typeof val === 'function')) {\n              var then = val.then;\n\n              if (typeof then === 'function') {\n                then.call(val, function (val) {\n                  res(i, val);\n                }, function (e) {\n                  args[i] = {\n                    status: 'rejected',\n                    reason: e\n                  };\n\n                  if (--remaining === 0) {\n                    resolve(args);\n                  }\n                });\n                return;\n              }\n            }\n\n            args[i] = {\n              status: 'fulfilled',\n              value: val\n            };\n\n            if (--remaining === 0) {\n              resolve(args);\n            }\n          }\n\n          for (var i = 0; i < args.length; i++) {\n            res(i, args[i]);\n          }\n        });\n      } // Store setTimeout reference so promise-polyfill will be unaffected by\n      // other code modifying setTimeout (like sinon.useFakeTimers())\n\n\n      var setTimeoutFunc = setTimeout;\n\n      function isArray(x) {\n        return Boolean(x && typeof x.length !== 'undefined');\n      }\n\n      function noop() {} // Polyfill for Function.prototype.bind\n\n\n      function bind(fn, thisArg) {\n        return function () {\n          fn.apply(thisArg, arguments);\n        };\n      }\n      /**\n       * @constructor\n       * @param {Function} fn\n       */\n\n\n      function Promise(fn) {\n        if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');\n        if (typeof fn !== 'function') throw new TypeError('not a function');\n        /** @type {!number} */\n\n        this._state = 0;\n        /** @type {!boolean} */\n\n        this._handled = false;\n        /** @type {Promise|undefined} */\n\n        this._value = undefined;\n        /** @type {!Array<!Function>} */\n\n        this._deferreds = [];\n        doResolve(fn, this);\n      }\n\n      function handle(self, deferred) {\n        while (self._state === 3) {\n          self = self._value;\n        }\n\n        if (self._state === 0) {\n          self._deferreds.push(deferred);\n\n          return;\n        }\n\n        self._handled = true;\n\n        Promise._immediateFn(function () {\n          var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;\n\n          if (cb === null) {\n            (self._state === 1 ? resolve : reject)(deferred.promise, self._value);\n            return;\n          }\n\n          var ret;\n\n          try {\n            ret = cb(self._value);\n          } catch (e) {\n            reject(deferred.promise, e);\n            return;\n          }\n\n          resolve(deferred.promise, ret);\n        });\n      }\n\n      function resolve(self, newValue) {\n        try {\n          // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure\n          if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');\n\n          if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {\n            var then = newValue.then;\n\n            if (newValue instanceof Promise) {\n              self._state = 3;\n              self._value = newValue;\n              finale(self);\n              return;\n            } else if (typeof then === 'function') {\n              doResolve(bind(then, newValue), self);\n              return;\n            }\n          }\n\n          self._state = 1;\n          self._value = newValue;\n          finale(self);\n        } catch (e) {\n          reject(self, e);\n        }\n      }\n\n      function reject(self, newValue) {\n        self._state = 2;\n        self._value = newValue;\n        finale(self);\n      }\n\n      function finale(self) {\n        if (self._state === 2 && self._deferreds.length === 0) {\n          Promise._immediateFn(function () {\n            if (!self._handled) {\n              Promise._unhandledRejectionFn(self._value);\n            }\n          });\n        }\n\n        for (var i = 0, len = self._deferreds.length; i < len; i++) {\n          handle(self, self._deferreds[i]);\n        }\n\n        self._deferreds = null;\n      }\n      /**\n       * @constructor\n       */\n\n\n      function Handler(onFulfilled, onRejected, promise) {\n        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;\n        this.onRejected = typeof onRejected === 'function' ? onRejected : null;\n        this.promise = promise;\n      }\n      /**\n       * Take a potentially misbehaving resolver function and make sure\n       * onFulfilled and onRejected are only called once.\n       *\n       * Makes no guarantees about asynchrony.\n       */\n\n\n      function doResolve(fn, self) {\n        var done = false;\n\n        try {\n          fn(function (value) {\n            if (done) return;\n            done = true;\n            resolve(self, value);\n          }, function (reason) {\n            if (done) return;\n            done = true;\n            reject(self, reason);\n          });\n        } catch (ex) {\n          if (done) return;\n          done = true;\n          reject(self, ex);\n        }\n      }\n\n      Promise.prototype['catch'] = function (onRejected) {\n        return this.then(null, onRejected);\n      };\n\n      Promise.prototype.then = function (onFulfilled, onRejected) {\n        // @ts-ignore\n        var prom = new this.constructor(noop);\n        handle(this, new Handler(onFulfilled, onRejected, prom));\n        return prom;\n      };\n\n      Promise.prototype['finally'] = finallyConstructor;\n\n      Promise.all = function (arr) {\n        return new Promise(function (resolve, reject) {\n          if (!isArray(arr)) {\n            return reject(new TypeError('Promise.all accepts an array'));\n          }\n\n          var args = Array.prototype.slice.call(arr);\n          if (args.length === 0) return resolve([]);\n          var remaining = args.length;\n\n          function res(i, val) {\n            try {\n              if (val && (_typeof(val) === 'object' || typeof val === 'function')) {\n                var then = val.then;\n\n                if (typeof then === 'function') {\n                  then.call(val, function (val) {\n                    res(i, val);\n                  }, reject);\n                  return;\n                }\n              }\n\n              args[i] = val;\n\n              if (--remaining === 0) {\n                resolve(args);\n              }\n            } catch (ex) {\n              reject(ex);\n            }\n          }\n\n          for (var i = 0; i < args.length; i++) {\n            res(i, args[i]);\n          }\n        });\n      };\n\n      Promise.allSettled = allSettled;\n\n      Promise.resolve = function (value) {\n        if (value && _typeof(value) === 'object' && value.constructor === Promise) {\n          return value;\n        }\n\n        return new Promise(function (resolve) {\n          resolve(value);\n        });\n      };\n\n      Promise.reject = function (value) {\n        return new Promise(function (resolve, reject) {\n          reject(value);\n        });\n      };\n\n      Promise.race = function (arr) {\n        return new Promise(function (resolve, reject) {\n          if (!isArray(arr)) {\n            return reject(new TypeError('Promise.race accepts an array'));\n          }\n\n          for (var i = 0, len = arr.length; i < len; i++) {\n            Promise.resolve(arr[i]).then(resolve, reject);\n          }\n        });\n      }; // Use polyfill for setImmediate for performance gains\n\n\n      Promise._immediateFn = // @ts-ignore\n      typeof setImmediate === 'function' && function (fn) {\n        // @ts-ignore\n        setImmediate(fn);\n      } || function (fn) {\n        setTimeoutFunc(fn, 0);\n      };\n\n      Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {\n        if (typeof console !== 'undefined' && console) {\n          console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console\n        }\n      };\n\n      module.exports = Promise;\n    })();\n  });\n\n  function registerLoggingCallbacks(obj) {\n    var callbackNames = [\"begin\", \"done\", \"log\", \"testStart\", \"testDone\", \"moduleStart\", \"moduleDone\"];\n\n    function registerLoggingCallback(key) {\n      var loggingCallback = function loggingCallback(callback) {\n        if (objectType(callback) !== \"function\") {\n          throw new Error(\"QUnit logging methods require a callback function as their first parameters.\");\n        }\n\n        config.callbacks[key].push(callback);\n      };\n\n      return loggingCallback;\n    }\n\n    for (var i = 0, l = callbackNames.length; i < l; i++) {\n      var key = callbackNames[i]; // Initialize key collection of logging callback\n\n      if (objectType(config.callbacks[key]) === \"undefined\") {\n        config.callbacks[key] = [];\n      }\n\n      obj[key] = registerLoggingCallback(key);\n    }\n  }\n\n  function runLoggingCallbacks(key, args) {\n    var callbacks = config.callbacks[key]; // Handling 'log' callbacks separately. Unlike the other callbacks,\n    // the log callback is not controlled by the processing queue,\n    // but rather used by asserts. Hence to promisfy the 'log' callback\n    // would mean promisfying each step of a test\n\n    if (key === \"log\") {\n      callbacks.map(function (callback) {\n        return callback(args);\n      });\n      return;\n    } // ensure that each callback is executed serially\n\n\n    return callbacks.reduce(function (promiseChain, callback) {\n      return promiseChain.then(function () {\n        return promisePolyfill.resolve(callback(args));\n      });\n    }, promisePolyfill.resolve([]));\n  } // Doesn't support IE9, it will return undefined on these browsers\n  // See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack\n\n\n  var fileName = (sourceFromStacktrace(0) || \"\").replace(/(:\\d+)+\\)?/, \"\").replace(/.+\\//, \"\");\n\n  function extractStacktrace(e, offset) {\n    offset = offset === undefined ? 4 : offset;\n\n    if (e && e.stack) {\n      var stack = e.stack.split(\"\\n\");\n\n      if (/^error$/i.test(stack[0])) {\n        stack.shift();\n      }\n\n      if (fileName) {\n        var include = [];\n\n        for (var i = offset; i < stack.length; i++) {\n          if (stack[i].indexOf(fileName) !== -1) {\n            break;\n          }\n\n          include.push(stack[i]);\n        }\n\n        if (include.length) {\n          return include.join(\"\\n\");\n        }\n      }\n\n      return stack[offset];\n    }\n  }\n\n  function sourceFromStacktrace(offset) {\n    var error = new Error(); // Support: Safari <=7 only, IE <=10 - 11 only\n    // Not all browsers generate the `stack` property for `new Error()`, see also #636\n\n    if (!error.stack) {\n      try {\n        throw error;\n      } catch (err) {\n        error = err;\n      }\n    }\n\n    return extractStacktrace(error, offset);\n  }\n\n  var priorityCount = 0;\n  var unitSampler; // This is a queue of functions that are tasks within a single test.\n  // After tests are dequeued from config.queue they are expanded into\n  // a set of tasks in this queue.\n\n  var taskQueue = [];\n  /**\n   * Advances the taskQueue to the next task. If the taskQueue is empty,\n   * process the testQueue\n   */\n\n  function advance() {\n    advanceTaskQueue();\n\n    if (!taskQueue.length && !config.blocking && !config.current) {\n      advanceTestQueue();\n    }\n  }\n  /**\n   * Advances the taskQueue with an increased depth\n   */\n\n\n  function advanceTaskQueue() {\n    var start = now();\n    config.depth = (config.depth || 0) + 1;\n    processTaskQueue(start);\n    config.depth--;\n  }\n  /**\n   * Process the first task on the taskQueue as a promise.\n   * Each task is a function returned by https://github.com/qunitjs/qunit/blob/master/src/test.js#L381\n   */\n\n\n  function processTaskQueue(start) {\n    if (taskQueue.length && !config.blocking) {\n      var elapsedTime = now() - start;\n\n      if (!setTimeout$1 || config.updateRate <= 0 || elapsedTime < config.updateRate) {\n        var task = taskQueue.shift();\n        promisePolyfill.resolve(task()).then(function () {\n          if (!taskQueue.length) {\n            advance();\n          } else {\n            processTaskQueue(start);\n          }\n        });\n      } else {\n        setTimeout$1(advance);\n      }\n    }\n  }\n  /**\n   * Advance the testQueue to the next test to process. Call done() if testQueue completes.\n   */\n\n\n  function advanceTestQueue() {\n    if (!config.blocking && !config.queue.length && config.depth === 0) {\n      done();\n      return;\n    }\n\n    var testTasks = config.queue.shift();\n    addToTaskQueue(testTasks());\n\n    if (priorityCount > 0) {\n      priorityCount--;\n    }\n\n    advance();\n  }\n  /**\n   * Enqueue the tasks for a test into the task queue.\n   * @param {Array} tasksArray\n   */\n\n\n  function addToTaskQueue(tasksArray) {\n    taskQueue.push.apply(taskQueue, _toConsumableArray(tasksArray));\n  }\n  /**\n   * Return the number of tasks remaining in the task queue to be processed.\n   * @return {number}\n   */\n\n\n  function taskQueueLength() {\n    return taskQueue.length;\n  }\n  /**\n   * Adds a test to the TestQueue for execution.\n   * @param {Function} testTasksFunc\n   * @param {boolean} prioritize\n   * @param {string} seed\n   */\n\n\n  function addToTestQueue(testTasksFunc, prioritize, seed) {\n    if (prioritize) {\n      config.queue.splice(priorityCount++, 0, testTasksFunc);\n    } else if (seed) {\n      if (!unitSampler) {\n        unitSampler = unitSamplerGenerator(seed);\n      } // Insert into a random position after all prioritized items\n\n\n      var index = Math.floor(unitSampler() * (config.queue.length - priorityCount + 1));\n      config.queue.splice(priorityCount + index, 0, testTasksFunc);\n    } else {\n      config.queue.push(testTasksFunc);\n    }\n  }\n  /**\n   * Creates a seeded \"sample\" generator which is used for randomizing tests.\n   */\n\n\n  function unitSamplerGenerator(seed) {\n    // 32-bit xorshift, requires only a nonzero seed\n    // https://excamera.com/sphinx/article-xorshift.html\n    var sample = parseInt(generateHash(seed), 16) || -1;\n    return function () {\n      sample ^= sample << 13;\n      sample ^= sample >>> 17;\n      sample ^= sample << 5; // ECMAScript has no unsigned number type\n\n      if (sample < 0) {\n        sample += 0x100000000;\n      }\n\n      return sample / 0x100000000;\n    };\n  }\n  /**\n   * This function is called when the ProcessingQueue is done processing all\n   * items. It handles emitting the final run events.\n   */\n\n\n  function done() {\n    var storage = config.storage;\n    ProcessingQueue.finished = true;\n    var runtime = now() - config.started;\n    var passed = config.stats.all - config.stats.bad;\n\n    if (config.stats.testCount === 0) {\n      if (config.filter && config.filter.length) {\n        throw new Error(\"No tests matched the filter \\\"\".concat(config.filter, \"\\\".\"));\n      }\n\n      if (config.module && config.module.length) {\n        throw new Error(\"No tests matched the module \\\"\".concat(config.module, \"\\\".\"));\n      }\n\n      if (config.moduleId && config.moduleId.length) {\n        throw new Error(\"No tests matched the moduleId \\\"\".concat(config.moduleId, \"\\\".\"));\n      }\n\n      if (config.testId && config.testId.length) {\n        throw new Error(\"No tests matched the testId \\\"\".concat(config.testId, \"\\\".\"));\n      }\n\n      throw new Error(\"No tests were run.\");\n    }\n\n    emit(\"runEnd\", globalSuite.end(true));\n    runLoggingCallbacks(\"done\", {\n      passed: passed,\n      failed: config.stats.bad,\n      total: config.stats.all,\n      runtime: runtime\n    }).then(function () {\n      // Clear own storage items if all tests passed\n      if (storage && config.stats.bad === 0) {\n        for (var i = storage.length - 1; i >= 0; i--) {\n          var key = storage.key(i);\n\n          if (key.indexOf(\"qunit-test-\") === 0) {\n            storage.removeItem(key);\n          }\n        }\n      }\n    });\n  }\n\n  var ProcessingQueue = {\n    finished: false,\n    add: addToTestQueue,\n    advance: advance,\n    taskCount: taskQueueLength\n  };\n\n  var TestReport = /*#__PURE__*/function () {\n    function TestReport(name, suite, options) {\n      _classCallCheck(this, TestReport);\n\n      this.name = name;\n      this.suiteName = suite.name;\n      this.fullName = suite.fullName.concat(name);\n      this.runtime = 0;\n      this.assertions = [];\n      this.skipped = !!options.skip;\n      this.todo = !!options.todo;\n      this.valid = options.valid;\n      this._startTime = 0;\n      this._endTime = 0;\n      suite.pushTest(this);\n    }\n\n    _createClass(TestReport, [{\n      key: \"start\",\n      value: function start(recordTime) {\n        if (recordTime) {\n          this._startTime = performance.now();\n          performance.mark(\"qunit_test_start\");\n        }\n\n        return {\n          name: this.name,\n          suiteName: this.suiteName,\n          fullName: this.fullName.slice()\n        };\n      }\n    }, {\n      key: \"end\",\n      value: function end(recordTime) {\n        if (recordTime) {\n          this._endTime = performance.now();\n\n          if (performance) {\n            performance.mark(\"qunit_test_end\");\n            var testName = this.fullName.join(\" – \");\n            performance.measure(\"QUnit Test: \".concat(testName), \"qunit_test_start\", \"qunit_test_end\");\n          }\n        }\n\n        return extend(this.start(), {\n          runtime: this.getRuntime(),\n          status: this.getStatus(),\n          errors: this.getFailedAssertions(),\n          assertions: this.getAssertions()\n        });\n      }\n    }, {\n      key: \"pushAssertion\",\n      value: function pushAssertion(assertion) {\n        this.assertions.push(assertion);\n      }\n    }, {\n      key: \"getRuntime\",\n      value: function getRuntime() {\n        return this._endTime - this._startTime;\n      }\n    }, {\n      key: \"getStatus\",\n      value: function getStatus() {\n        if (this.skipped) {\n          return \"skipped\";\n        }\n\n        var testPassed = this.getFailedAssertions().length > 0 ? this.todo : !this.todo;\n\n        if (!testPassed) {\n          return \"failed\";\n        } else if (this.todo) {\n          return \"todo\";\n        } else {\n          return \"passed\";\n        }\n      }\n    }, {\n      key: \"getFailedAssertions\",\n      value: function getFailedAssertions() {\n        return this.assertions.filter(function (assertion) {\n          return !assertion.passed;\n        });\n      }\n    }, {\n      key: \"getAssertions\",\n      value: function getAssertions() {\n        return this.assertions.slice();\n      } // Remove actual and expected values from assertions. This is to prevent\n      // leaking memory throughout a test suite.\n\n    }, {\n      key: \"slimAssertions\",\n      value: function slimAssertions() {\n        this.assertions = this.assertions.map(function (assertion) {\n          delete assertion.actual;\n          delete assertion.expected;\n          return assertion;\n        });\n      }\n    }]);\n\n    return TestReport;\n  }();\n\n  function Test(settings) {\n    this.expected = null;\n    this.assertions = [];\n    this.semaphore = 0;\n    this.module = config.currentModule;\n    this.steps = [];\n    this.timeout = undefined;\n    extend(this, settings); // If a module is skipped, all its tests and the tests of the child suites\n    // should be treated as skipped even if they are defined as `only` or `todo`.\n    // As for `todo` module, all its tests will be treated as `todo` except for\n    // tests defined as `skip` which will be left intact.\n    //\n    // So, if a test is defined as `todo` and is inside a skipped module, we should\n    // then treat that test as if was defined as `skip`.\n\n    if (this.module.skip) {\n      this.skip = true;\n      this.todo = false; // Skipped tests should be left intact\n    } else if (this.module.todo && !this.skip) {\n      this.todo = true;\n    }\n\n    if (!this.skip && typeof this.callback !== \"function\") {\n      var method = this.todo ? \"QUnit.todo\" : \"QUnit.test\";\n      throw new TypeError(\"You must provide a callback to \".concat(method, \"(\\\"\").concat(this.testName, \"\\\")\"));\n    } // No validation after this. Beyond this point, failures must be recorded as\n    // a completed test with errors, instead of early bail out.\n    // Otherwise, internals may be left in an inconsistent state.\n    // Ref https://github.com/qunitjs/qunit/issues/1514\n\n\n    ++Test.count;\n    this.errorForStack = new Error();\n    this.testReport = new TestReport(this.testName, this.module.suiteReport, {\n      todo: this.todo,\n      skip: this.skip,\n      valid: this.valid()\n    }); // Register unique strings\n\n    for (var i = 0, l = this.module.tests; i < l.length; i++) {\n      if (this.module.tests[i].name === this.testName) {\n        this.testName += \" \";\n      }\n    }\n\n    this.testId = generateHash(this.module.name, this.testName);\n    this.module.tests.push({\n      name: this.testName,\n      testId: this.testId,\n      skip: !!this.skip\n    });\n\n    if (this.skip) {\n      // Skipped tests will fully ignore any sent callback\n      this.callback = function () {};\n\n      this.async = false;\n      this.expected = 0;\n    } else {\n      this.assert = new Assert(this);\n    }\n  }\n\n  Test.count = 0;\n\n  function getNotStartedModules(startModule) {\n    var module = startModule;\n    var modules = [];\n\n    while (module && module.testsRun === 0) {\n      modules.push(module);\n      module = module.parentModule;\n    } // The above push modules from the child to the parent\n    // return a reversed order with the top being the top most parent module\n\n\n    return modules.reverse();\n  }\n\n  Test.prototype = {\n    // generating a stack trace can be expensive, so using a getter defers this until we need it\n    get stack() {\n      return extractStacktrace(this.errorForStack, 2);\n    },\n\n    before: function before() {\n      var _this = this;\n\n      var module = this.module;\n      var notStartedModules = getNotStartedModules(module); // ensure the callbacks are executed serially for each module\n\n      var callbackPromises = notStartedModules.reduce(function (promiseChain, startModule) {\n        return promiseChain.then(function () {\n          startModule.stats = {\n            all: 0,\n            bad: 0,\n            started: now()\n          };\n          emit(\"suiteStart\", startModule.suiteReport.start(true));\n          return runLoggingCallbacks(\"moduleStart\", {\n            name: startModule.name,\n            tests: startModule.tests\n          });\n        });\n      }, promisePolyfill.resolve([]));\n      return callbackPromises.then(function () {\n        config.current = _this;\n        _this.testEnvironment = extend({}, module.testEnvironment);\n        _this.started = now();\n        emit(\"testStart\", _this.testReport.start(true));\n        return runLoggingCallbacks(\"testStart\", {\n          name: _this.testName,\n          module: module.name,\n          testId: _this.testId,\n          previousFailure: _this.previousFailure\n        }).then(function () {\n          if (!config.pollution) {\n            saveGlobal();\n          }\n        });\n      });\n    },\n    run: function run() {\n      config.current = this;\n      this.callbackStarted = now();\n\n      if (config.notrycatch) {\n        runTest(this);\n        return;\n      }\n\n      try {\n        runTest(this);\n      } catch (e) {\n        this.pushFailure(\"Died on test #\" + (this.assertions.length + 1) + \" \" + this.stack + \": \" + (e.message || e), extractStacktrace(e, 0)); // Else next test will carry the responsibility\n\n        saveGlobal(); // Restart the tests if they're blocking\n\n        if (config.blocking) {\n          internalRecover(this);\n        }\n      }\n\n      function runTest(test) {\n        var promise = test.callback.call(test.testEnvironment, test.assert);\n        test.resolvePromise(promise); // If the test has a \"lock\" on it, but the timeout is 0, then we push a\n        // failure as the test should be synchronous.\n\n        if (test.timeout === 0 && test.semaphore !== 0) {\n          pushFailure(\"Test did not finish synchronously even though assert.timeout( 0 ) was used.\", sourceFromStacktrace(2));\n        }\n      }\n    },\n    after: function after() {\n      checkPollution();\n    },\n    queueHook: function queueHook(hook, hookName, hookOwner) {\n      var _this2 = this;\n\n      var callHook = function callHook() {\n        var promise = hook.call(_this2.testEnvironment, _this2.assert);\n\n        _this2.resolvePromise(promise, hookName);\n      };\n\n      var runHook = function runHook() {\n        if (hookName === \"before\") {\n          if (hookOwner.testsRun !== 0) {\n            return;\n          }\n\n          _this2.preserveEnvironment = true;\n        } // The 'after' hook should only execute when there are not tests left and\n        // when the 'after' and 'finish' tasks are the only tasks left to process\n\n\n        if (hookName === \"after\" && !lastTestWithinModuleExecuted(hookOwner) && (config.queue.length > 0 || ProcessingQueue.taskCount() > 2)) {\n          return;\n        }\n\n        config.current = _this2;\n\n        if (config.notrycatch) {\n          callHook();\n          return;\n        }\n\n        try {\n          callHook();\n        } catch (error) {\n          _this2.pushFailure(hookName + \" failed on \" + _this2.testName + \": \" + (error.message || error), extractStacktrace(error, 0));\n        }\n      };\n\n      return runHook;\n    },\n    // Currently only used for module level hooks, can be used to add global level ones\n    hooks: function hooks(handler) {\n      var hooks = [];\n\n      function processHooks(test, module) {\n        if (module.parentModule) {\n          processHooks(test, module.parentModule);\n        }\n\n        if (module.hooks[handler].length) {\n          for (var i = 0; i < module.hooks[handler].length; i++) {\n            hooks.push(test.queueHook(module.hooks[handler][i], handler, module));\n          }\n        }\n      } // Hooks are ignored on skipped tests\n\n\n      if (!this.skip) {\n        processHooks(this, this.module);\n      }\n\n      return hooks;\n    },\n    finish: function finish() {\n      config.current = this; // Release the test callback to ensure that anything referenced has been\n      // released to be garbage collected.\n\n      this.callback = undefined;\n\n      if (this.steps.length) {\n        var stepsList = this.steps.join(\", \");\n        this.pushFailure(\"Expected assert.verifySteps() to be called before end of test \" + \"after using assert.step(). Unverified steps: \".concat(stepsList), this.stack);\n      }\n\n      if (config.requireExpects && this.expected === null) {\n        this.pushFailure(\"Expected number of assertions to be defined, but expect() was \" + \"not called.\", this.stack);\n      } else if (this.expected !== null && this.expected !== this.assertions.length) {\n        this.pushFailure(\"Expected \" + this.expected + \" assertions, but \" + this.assertions.length + \" were run\", this.stack);\n      } else if (this.expected === null && !this.assertions.length) {\n        this.pushFailure(\"Expected at least one assertion, but none were run - call \" + \"expect(0) to accept zero assertions.\", this.stack);\n      }\n\n      var module = this.module;\n      var moduleName = module.name;\n      var testName = this.testName;\n      var skipped = !!this.skip;\n      var todo = !!this.todo;\n      var bad = 0;\n      var storage = config.storage;\n      this.runtime = now() - this.started;\n      config.stats.all += this.assertions.length;\n      config.stats.testCount += 1;\n      module.stats.all += this.assertions.length;\n\n      for (var i = 0; i < this.assertions.length; i++) {\n        if (!this.assertions[i].result) {\n          bad++;\n          config.stats.bad++;\n          module.stats.bad++;\n        }\n      }\n\n      if (skipped) {\n        incrementTestsIgnored(module);\n      } else {\n        incrementTestsRun(module);\n      } // Store result when possible\n\n\n      if (storage) {\n        if (bad) {\n          storage.setItem(\"qunit-test-\" + moduleName + \"-\" + testName, bad);\n        } else {\n          storage.removeItem(\"qunit-test-\" + moduleName + \"-\" + testName);\n        }\n      } // After emitting the js-reporters event we cleanup the assertion data to\n      // avoid leaking it. It is not used by the legacy testDone callbacks.\n\n\n      emit(\"testEnd\", this.testReport.end(true));\n      this.testReport.slimAssertions();\n      var test = this;\n      return runLoggingCallbacks(\"testDone\", {\n        name: testName,\n        module: moduleName,\n        skipped: skipped,\n        todo: todo,\n        failed: bad,\n        passed: this.assertions.length - bad,\n        total: this.assertions.length,\n        runtime: skipped ? 0 : this.runtime,\n        // HTML Reporter use\n        assertions: this.assertions,\n        testId: this.testId,\n\n        // Source of Test\n        // generating stack trace is expensive, so using a getter will help defer this until we need it\n        get source() {\n          return test.stack;\n        }\n\n      }).then(function () {\n        if (allTestsExecuted(module)) {\n          var completedModules = [module]; // Check if the parent modules, iteratively, are done. If that the case,\n          // we emit the `suiteEnd` event and trigger `moduleDone` callback.\n\n          var parent = module.parentModule;\n\n          while (parent && allTestsExecuted(parent)) {\n            completedModules.push(parent);\n            parent = parent.parentModule;\n          }\n\n          return completedModules.reduce(function (promiseChain, completedModule) {\n            return promiseChain.then(function () {\n              return logSuiteEnd(completedModule);\n            });\n          }, promisePolyfill.resolve([]));\n        }\n      }).then(function () {\n        config.current = undefined;\n      });\n\n      function logSuiteEnd(module) {\n        // Reset `module.hooks` to ensure that anything referenced in these hooks\n        // has been released to be garbage collected.\n        module.hooks = {};\n        emit(\"suiteEnd\", module.suiteReport.end(true));\n        return runLoggingCallbacks(\"moduleDone\", {\n          name: module.name,\n          tests: module.tests,\n          failed: module.stats.bad,\n          passed: module.stats.all - module.stats.bad,\n          total: module.stats.all,\n          runtime: now() - module.stats.started\n        });\n      }\n    },\n    preserveTestEnvironment: function preserveTestEnvironment() {\n      if (this.preserveEnvironment) {\n        this.module.testEnvironment = this.testEnvironment;\n        this.testEnvironment = extend({}, this.module.testEnvironment);\n      }\n    },\n    queue: function queue() {\n      var test = this;\n\n      if (!this.valid()) {\n        incrementTestsIgnored(this.module);\n        return;\n      }\n\n      function runTest() {\n        return [function () {\n          return test.before();\n        }].concat(_toConsumableArray(test.hooks(\"before\")), [function () {\n          test.preserveTestEnvironment();\n        }], _toConsumableArray(test.hooks(\"beforeEach\")), [function () {\n          test.run();\n        }], _toConsumableArray(test.hooks(\"afterEach\").reverse()), _toConsumableArray(test.hooks(\"after\").reverse()), [function () {\n          test.after();\n        }, function () {\n          return test.finish();\n        }]);\n      }\n\n      var previousFailCount = config.storage && +config.storage.getItem(\"qunit-test-\" + this.module.name + \"-\" + this.testName); // Prioritize previously failed tests, detected from storage\n\n      var prioritize = config.reorder && !!previousFailCount;\n      this.previousFailure = !!previousFailCount;\n      ProcessingQueue.add(runTest, prioritize, config.seed); // If the queue has already finished, we manually process the new test\n\n      if (ProcessingQueue.finished) {\n        ProcessingQueue.advance();\n      }\n    },\n    pushResult: function pushResult(resultInfo) {\n      if (this !== config.current) {\n        var message = resultInfo && resultInfo.message || \"\";\n        var testName = this && this.testName || \"\";\n        var error = \"Assertion occurred after test finished.\\n\" + \"> Test: \" + testName + \"\\n\" + \"> Message: \" + message + \"\\n\";\n        throw new Error(error);\n      } // Destructure of resultInfo = { result, actual, expected, message, negative }\n\n\n      var details = {\n        module: this.module.name,\n        name: this.testName,\n        result: resultInfo.result,\n        message: resultInfo.message,\n        actual: resultInfo.actual,\n        testId: this.testId,\n        negative: resultInfo.negative || false,\n        runtime: now() - this.started,\n        todo: !!this.todo\n      };\n\n      if (hasOwn.call(resultInfo, \"expected\")) {\n        details.expected = resultInfo.expected;\n      }\n\n      if (!resultInfo.result) {\n        var source = resultInfo.source || sourceFromStacktrace();\n\n        if (source) {\n          details.source = source;\n        }\n      }\n\n      this.logAssertion(details);\n      this.assertions.push({\n        result: !!resultInfo.result,\n        message: resultInfo.message\n      });\n    },\n    pushFailure: function pushFailure(message, source, actual) {\n      if (!(this instanceof Test)) {\n        throw new Error(\"pushFailure() assertion outside test context, was \" + sourceFromStacktrace(2));\n      }\n\n      this.pushResult({\n        result: false,\n        message: message || \"error\",\n        actual: actual || null,\n        source: source\n      });\n    },\n\n    /**\n     * Log assertion details using both the old QUnit.log interface and\n     * QUnit.on( \"assertion\" ) interface.\n     *\n     * @private\n     */\n    logAssertion: function logAssertion(details) {\n      runLoggingCallbacks(\"log\", details);\n      var assertion = {\n        passed: details.result,\n        actual: details.actual,\n        expected: details.expected,\n        message: details.message,\n        stack: details.source,\n        todo: details.todo\n      };\n      this.testReport.pushAssertion(assertion);\n      emit(\"assertion\", assertion);\n    },\n    resolvePromise: function resolvePromise(promise, phase) {\n      if (promise != null) {\n        var _test = this;\n\n        var then = promise.then;\n\n        if (objectType(then) === \"function\") {\n          var resume = internalStop(_test);\n\n          if (config.notrycatch) {\n            then.call(promise, function () {\n              resume();\n            });\n          } else {\n            then.call(promise, function () {\n              resume();\n            }, function (error) {\n              var message = \"Promise rejected \" + (!phase ? \"during\" : phase.replace(/Each$/, \"\")) + \" \\\"\" + _test.testName + \"\\\": \" + (error && error.message || error);\n\n              _test.pushFailure(message, extractStacktrace(error, 0)); // Else next test will carry the responsibility\n\n\n              saveGlobal(); // Unblock\n\n              internalRecover(_test);\n            });\n          }\n        }\n      }\n    },\n    valid: function valid() {\n      var filter = config.filter;\n      var regexFilter = /^(!?)\\/([\\w\\W]*)\\/(i?$)/.exec(filter);\n      var module = config.module && config.module.toLowerCase();\n      var fullName = this.module.name + \": \" + this.testName;\n\n      function moduleChainNameMatch(testModule) {\n        var testModuleName = testModule.name ? testModule.name.toLowerCase() : null;\n\n        if (testModuleName === module) {\n          return true;\n        } else if (testModule.parentModule) {\n          return moduleChainNameMatch(testModule.parentModule);\n        } else {\n          return false;\n        }\n      }\n\n      function moduleChainIdMatch(testModule) {\n        return inArray(testModule.moduleId, config.moduleId) || testModule.parentModule && moduleChainIdMatch(testModule.parentModule);\n      } // Internally-generated tests are always valid\n\n\n      if (this.callback && this.callback.validTest) {\n        return true;\n      }\n\n      if (config.moduleId && config.moduleId.length > 0 && !moduleChainIdMatch(this.module)) {\n        return false;\n      }\n\n      if (config.testId && config.testId.length > 0 && !inArray(this.testId, config.testId)) {\n        return false;\n      }\n\n      if (module && !moduleChainNameMatch(this.module)) {\n        return false;\n      }\n\n      if (!filter) {\n        return true;\n      }\n\n      return regexFilter ? this.regexFilter(!!regexFilter[1], regexFilter[2], regexFilter[3], fullName) : this.stringFilter(filter, fullName);\n    },\n    regexFilter: function regexFilter(exclude, pattern, flags, fullName) {\n      var regex = new RegExp(pattern, flags);\n      var match = regex.test(fullName);\n      return match !== exclude;\n    },\n    stringFilter: function stringFilter(filter, fullName) {\n      filter = filter.toLowerCase();\n      fullName = fullName.toLowerCase();\n      var include = filter.charAt(0) !== \"!\";\n\n      if (!include) {\n        filter = filter.slice(1);\n      } // If the filter matches, we need to honour include\n\n\n      if (fullName.indexOf(filter) !== -1) {\n        return include;\n      } // Otherwise, do the opposite\n\n\n      return !include;\n    }\n  };\n\n  function pushFailure() {\n    if (!config.current) {\n      throw new Error(\"pushFailure() assertion outside test context, in \" + sourceFromStacktrace(2));\n    } // Gets current test obj\n\n\n    var currentTest = config.current;\n    return currentTest.pushFailure.apply(currentTest, arguments);\n  }\n\n  function saveGlobal() {\n    config.pollution = [];\n\n    if (config.noglobals) {\n      for (var key in global__default['default']) {\n        if (hasOwn.call(global__default['default'], key)) {\n          // In Opera sometimes DOM element ids show up here, ignore them\n          if (/^qunit-test-output/.test(key)) {\n            continue;\n          }\n\n          config.pollution.push(key);\n        }\n      }\n    }\n  }\n\n  function checkPollution() {\n    var old = config.pollution;\n    saveGlobal();\n    var newGlobals = diff(config.pollution, old);\n\n    if (newGlobals.length > 0) {\n      pushFailure(\"Introduced global variable(s): \" + newGlobals.join(\", \"));\n    }\n\n    var deletedGlobals = diff(old, config.pollution);\n\n    if (deletedGlobals.length > 0) {\n      pushFailure(\"Deleted global variable(s): \" + deletedGlobals.join(\", \"));\n    }\n  }\n\n  var focused$1 = false; // indicates that the \"only\" filter was used\n  // Will be exposed as QUnit.test\n\n  function test(testName, callback) {\n    if (focused$1 || config.currentModule.ignored) {\n      return;\n    }\n\n    var newTest = new Test({\n      testName: testName,\n      callback: callback\n    });\n    newTest.queue();\n  }\n\n  extend(test, {\n    todo: function todo(testName, callback) {\n      if (focused$1 || config.currentModule.ignored) {\n        return;\n      }\n\n      var newTest = new Test({\n        testName: testName,\n        callback: callback,\n        todo: true\n      });\n      newTest.queue();\n    },\n    skip: function skip(testName) {\n      if (focused$1 || config.currentModule.ignored) {\n        return;\n      }\n\n      var test = new Test({\n        testName: testName,\n        skip: true\n      });\n      test.queue();\n    },\n    only: function only(testName, callback) {\n      if (config.currentModule.ignored) {\n        return;\n      }\n\n      if (!focused$1) {\n        config.queue.length = 0;\n        focused$1 = true;\n      }\n\n      var newTest = new Test({\n        testName: testName,\n        callback: callback\n      });\n      newTest.queue();\n    }\n  }); // Resets config.timeout with a new timeout duration.\n\n  function resetTestTimeout(timeoutDuration) {\n    clearTimeout(config.timeout);\n    config.timeout = setTimeout$1(config.timeoutHandler(timeoutDuration), timeoutDuration);\n  } // Put a hold on processing and return a function that will release it.\n\n\n  function internalStop(test) {\n    var released = false;\n    test.semaphore += 1;\n    config.blocking = true; // Set a recovery timeout, if so configured.\n\n    if (setTimeout$1) {\n      var timeoutDuration;\n\n      if (typeof test.timeout === \"number\") {\n        timeoutDuration = test.timeout;\n      } else if (typeof config.testTimeout === \"number\") {\n        timeoutDuration = config.testTimeout;\n      }\n\n      if (typeof timeoutDuration === \"number\" && timeoutDuration > 0) {\n        config.timeoutHandler = function (timeout) {\n          return function () {\n            config.timeout = null;\n            pushFailure(\"Test took longer than \".concat(timeout, \"ms; test timed out.\"), sourceFromStacktrace(2));\n            released = true;\n            internalRecover(test);\n          };\n        };\n\n        clearTimeout(config.timeout);\n        config.timeout = setTimeout$1(config.timeoutHandler(timeoutDuration), timeoutDuration);\n      }\n    }\n\n    return function resume() {\n      if (released) {\n        return;\n      }\n\n      released = true;\n      test.semaphore -= 1;\n      internalStart(test);\n    };\n  } // Forcefully release all processing holds.\n\n\n  function internalRecover(test) {\n    test.semaphore = 0;\n    internalStart(test);\n  } // Release a processing hold, scheduling a resumption attempt if no holds remain.\n\n\n  function internalStart(test) {\n    // If semaphore is non-numeric, throw error\n    if (isNaN(test.semaphore)) {\n      test.semaphore = 0;\n      pushFailure(\"Invalid value on test.semaphore\", sourceFromStacktrace(2));\n      return;\n    } // Don't start until equal number of stop-calls\n\n\n    if (test.semaphore > 0) {\n      return;\n    } // Throw an Error if start is called more often than stop\n\n\n    if (test.semaphore < 0) {\n      test.semaphore = 0;\n      pushFailure(\"Tried to restart test while already started (test's semaphore was 0 already)\", sourceFromStacktrace(2));\n      return;\n    } // Add a slight delay to allow more assertions etc.\n\n\n    if (setTimeout$1) {\n      clearTimeout(config.timeout);\n      config.timeout = setTimeout$1(function () {\n        if (test.semaphore > 0) {\n          return;\n        }\n\n        clearTimeout(config.timeout);\n        config.timeout = null;\n        begin();\n      });\n    } else {\n      begin();\n    }\n  }\n\n  function collectTests(module) {\n    var tests = [].concat(module.tests);\n\n    var modules = _toConsumableArray(module.childModules); // Do a breadth-first traversal of the child modules\n\n\n    while (modules.length) {\n      var nextModule = modules.shift();\n      tests.push.apply(tests, nextModule.tests);\n      modules.push.apply(modules, _toConsumableArray(nextModule.childModules));\n    }\n\n    return tests;\n  } // This returns true after all executable and skippable tests\n  // in a module have been proccessed, and informs 'suiteEnd'\n  // and moduleDone().\n\n\n  function allTestsExecuted(module) {\n    return module.testsRun + module.testsIgnored === collectTests(module).length;\n  } // This returns true during the last executable non-skipped test\n  // within a module, and informs the running of the 'after' hook\n  // for a given module. This runs only once for a given module,\n  // but must run during the last non-skipped test. When it runs,\n  // there may be non-zero skipped tests left.\n\n\n  function lastTestWithinModuleExecuted(module) {\n    return module.testsRun === collectTests(module).filter(function (test) {\n      return !test.skip;\n    }).length - 1;\n  }\n\n  function incrementTestsRun(module) {\n    module.testsRun++;\n\n    while (module = module.parentModule) {\n      module.testsRun++;\n    }\n  }\n\n  function incrementTestsIgnored(module) {\n    module.testsIgnored++;\n\n    while (module = module.parentModule) {\n      module.testsIgnored++;\n    }\n  }\n\n  var Assert = /*#__PURE__*/function () {\n    function Assert(testContext) {\n      _classCallCheck(this, Assert);\n\n      this.test = testContext;\n    } // Assert helpers\n\n\n    _createClass(Assert, [{\n      key: \"timeout\",\n      value: function timeout(duration) {\n        if (typeof duration !== \"number\") {\n          throw new Error(\"You must pass a number as the duration to assert.timeout\");\n        }\n\n        this.test.timeout = duration; // If a timeout has been set, clear it and reset with the new duration\n\n        if (config.timeout) {\n          clearTimeout(config.timeout);\n          config.timeout = null;\n\n          if (config.timeoutHandler && this.test.timeout > 0) {\n            resetTestTimeout(this.test.timeout);\n          }\n        }\n      } // Documents a \"step\", which is a string value, in a test as a passing assertion\n\n    }, {\n      key: \"step\",\n      value: function step(message) {\n        var assertionMessage = message;\n        var result = !!message;\n        this.test.steps.push(message);\n\n        if (objectType(message) === \"undefined\" || message === \"\") {\n          assertionMessage = \"You must provide a message to assert.step\";\n        } else if (objectType(message) !== \"string\") {\n          assertionMessage = \"You must provide a string value to assert.step\";\n          result = false;\n        }\n\n        this.pushResult({\n          result: result,\n          message: assertionMessage\n        });\n      } // Verifies the steps in a test match a given array of string values\n\n    }, {\n      key: \"verifySteps\",\n      value: function verifySteps(steps, message) {\n        // Since the steps array is just string values, we can clone with slice\n        var actualStepsClone = this.test.steps.slice();\n        this.deepEqual(actualStepsClone, steps, message);\n        this.test.steps.length = 0;\n      } // Specify the number of expected assertions to guarantee that failed test\n      // (no assertions are run at all) don't slip through.\n\n    }, {\n      key: \"expect\",\n      value: function expect(asserts) {\n        if (arguments.length === 1) {\n          this.test.expected = asserts;\n        } else {\n          return this.test.expected;\n        }\n      } // Put a hold on processing and return a function that will release it a maximum of once.\n\n    }, {\n      key: \"async\",\n      value: function async(count) {\n        var test = this.test;\n        var popped = false,\n            acceptCallCount = count;\n\n        if (typeof acceptCallCount === \"undefined\") {\n          acceptCallCount = 1;\n        }\n\n        var resume = internalStop(test);\n        return function done() {\n          if (config.current !== test) {\n            throw Error(\"assert.async callback called after test finished.\");\n          }\n\n          if (popped) {\n            test.pushFailure(\"Too many calls to the `assert.async` callback\", sourceFromStacktrace(2));\n            return;\n          }\n\n          acceptCallCount -= 1;\n\n          if (acceptCallCount > 0) {\n            return;\n          }\n\n          popped = true;\n          resume();\n        };\n      } // Exports test.push() to the user API\n      // Alias of pushResult.\n\n    }, {\n      key: \"push\",\n      value: function push(result, actual, expected, message, negative) {\n        Logger.warn(\"assert.push is deprecated and will be removed in QUnit 3.0.\" + \" Please use assert.pushResult instead (https://api.qunitjs.com/assert/pushResult).\");\n        var currentAssert = this instanceof Assert ? this : config.current.assert;\n        return currentAssert.pushResult({\n          result: result,\n          actual: actual,\n          expected: expected,\n          message: message,\n          negative: negative\n        });\n      }\n    }, {\n      key: \"pushResult\",\n      value: function pushResult(resultInfo) {\n        // Destructure of resultInfo = { result, actual, expected, message, negative }\n        var assert = this;\n        var currentTest = assert instanceof Assert && assert.test || config.current; // Backwards compatibility fix.\n        // Allows the direct use of global exported assertions and QUnit.assert.*\n        // Although, it's use is not recommended as it can leak assertions\n        // to other tests from async tests, because we only get a reference to the current test,\n        // not exactly the test where assertion were intended to be called.\n\n        if (!currentTest) {\n          throw new Error(\"assertion outside test context, in \" + sourceFromStacktrace(2));\n        }\n\n        if (!(assert instanceof Assert)) {\n          assert = currentTest.assert;\n        }\n\n        return assert.test.pushResult(resultInfo);\n      }\n    }, {\n      key: \"ok\",\n      value: function ok(result, message) {\n        if (!message) {\n          message = result ? \"okay\" : \"failed, expected argument to be truthy, was: \".concat(dump.parse(result));\n        }\n\n        this.pushResult({\n          result: !!result,\n          actual: result,\n          expected: true,\n          message: message\n        });\n      }\n    }, {\n      key: \"notOk\",\n      value: function notOk(result, message) {\n        if (!message) {\n          message = !result ? \"okay\" : \"failed, expected argument to be falsy, was: \".concat(dump.parse(result));\n        }\n\n        this.pushResult({\n          result: !result,\n          actual: result,\n          expected: false,\n          message: message\n        });\n      }\n    }, {\n      key: \"true\",\n      value: function _true(result, message) {\n        this.pushResult({\n          result: result === true,\n          actual: result,\n          expected: true,\n          message: message\n        });\n      }\n    }, {\n      key: \"false\",\n      value: function _false(result, message) {\n        this.pushResult({\n          result: result === false,\n          actual: result,\n          expected: false,\n          message: message\n        });\n      }\n    }, {\n      key: \"equal\",\n      value: function equal(actual, expected, message) {\n        // eslint-disable-next-line eqeqeq\n        var result = expected == actual;\n        this.pushResult({\n          result: result,\n          actual: actual,\n          expected: expected,\n          message: message\n        });\n      }\n    }, {\n      key: \"notEqual\",\n      value: function notEqual(actual, expected, message) {\n        // eslint-disable-next-line eqeqeq\n        var result = expected != actual;\n        this.pushResult({\n          result: result,\n          actual: actual,\n          expected: expected,\n          message: message,\n          negative: true\n        });\n      }\n    }, {\n      key: \"propEqual\",\n      value: function propEqual(actual, expected, message) {\n        actual = objectValues(actual);\n        expected = objectValues(expected);\n        this.pushResult({\n          result: equiv(actual, expected),\n          actual: actual,\n          expected: expected,\n          message: message\n        });\n      }\n    }, {\n      key: \"notPropEqual\",\n      value: function notPropEqual(actual, expected, message) {\n        actual = objectValues(actual);\n        expected = objectValues(expected);\n        this.pushResult({\n          result: !equiv(actual, expected),\n          actual: actual,\n          expected: expected,\n          message: message,\n          negative: true\n        });\n      }\n    }, {\n      key: \"deepEqual\",\n      value: function deepEqual(actual, expected, message) {\n        this.pushResult({\n          result: equiv(actual, expected),\n          actual: actual,\n          expected: expected,\n          message: message\n        });\n      }\n    }, {\n      key: \"notDeepEqual\",\n      value: function notDeepEqual(actual, expected, message) {\n        this.pushResult({\n          result: !equiv(actual, expected),\n          actual: actual,\n          expected: expected,\n          message: message,\n          negative: true\n        });\n      }\n    }, {\n      key: \"strictEqual\",\n      value: function strictEqual(actual, expected, message) {\n        this.pushResult({\n          result: expected === actual,\n          actual: actual,\n          expected: expected,\n          message: message\n        });\n      }\n    }, {\n      key: \"notStrictEqual\",\n      value: function notStrictEqual(actual, expected, message) {\n        this.pushResult({\n          result: expected !== actual,\n          actual: actual,\n          expected: expected,\n          message: message,\n          negative: true\n        });\n      }\n    }, {\n      key: \"throws\",\n      value: function throws(block, expected, message) {\n        var actual,\n            result = false;\n        var currentTest = this instanceof Assert && this.test || config.current; // 'expected' is optional unless doing string comparison\n\n        if (objectType(expected) === \"string\") {\n          if (message == null) {\n            message = expected;\n            expected = null;\n          } else {\n            throw new Error(\"throws/raises does not accept a string value for the expected argument.\\n\" + \"Use a non-string object value (e.g. regExp) instead if it's necessary.\");\n          }\n        }\n\n        currentTest.ignoreGlobalErrors = true;\n\n        try {\n          block.call(currentTest.testEnvironment);\n        } catch (e) {\n          actual = e;\n        }\n\n        currentTest.ignoreGlobalErrors = false;\n\n        if (actual) {\n          var expectedType = objectType(expected); // We don't want to validate thrown error\n\n          if (!expected) {\n            result = true; // Expected is a regexp\n          } else if (expectedType === \"regexp\") {\n            result = expected.test(errorString(actual)); // Log the string form of the regexp\n\n            expected = String(expected); // Expected is a constructor, maybe an Error constructor.\n            // Note the extra check on its prototype - this is an implicit\n            // requirement of \"instanceof\", else it will throw a TypeError.\n          } else if (expectedType === \"function\" && expected.prototype !== undefined && actual instanceof expected) {\n            result = true; // Expected is an Error object\n          } else if (expectedType === \"object\") {\n            result = actual instanceof expected.constructor && actual.name === expected.name && actual.message === expected.message; // Log the string form of the Error object\n\n            expected = errorString(expected); // Expected is a validation function which returns true if validation passed\n          } else if (expectedType === \"function\" && expected.call({}, actual) === true) {\n            expected = null;\n            result = true;\n          }\n        }\n\n        currentTest.assert.pushResult({\n          result: result,\n          // undefined if it didn't throw\n          actual: actual && errorString(actual),\n          expected: expected,\n          message: message\n        });\n      }\n    }, {\n      key: \"rejects\",\n      value: function rejects(promise, expected, message) {\n        var result = false;\n        var currentTest = this instanceof Assert && this.test || config.current; // 'expected' is optional unless doing string comparison\n\n        if (objectType(expected) === \"string\") {\n          if (message === undefined) {\n            message = expected;\n            expected = undefined;\n          } else {\n            message = \"assert.rejects does not accept a string value for the expected \" + \"argument.\\nUse a non-string object value (e.g. validator function) instead \" + \"if necessary.\";\n            currentTest.assert.pushResult({\n              result: false,\n              message: message\n            });\n            return;\n          }\n        }\n\n        var then = promise && promise.then;\n\n        if (objectType(then) !== \"function\") {\n          var _message = \"The value provided to `assert.rejects` in \" + \"\\\"\" + currentTest.testName + \"\\\" was not a promise.\";\n\n          currentTest.assert.pushResult({\n            result: false,\n            message: _message,\n            actual: promise\n          });\n          return;\n        }\n\n        var done = this.async();\n        return then.call(promise, function handleFulfillment() {\n          var message = \"The promise returned by the `assert.rejects` callback in \" + \"\\\"\" + currentTest.testName + \"\\\" did not reject.\";\n          currentTest.assert.pushResult({\n            result: false,\n            message: message,\n            actual: promise\n          });\n          done();\n        }, function handleRejection(actual) {\n          var expectedType = objectType(expected); // We don't want to validate\n\n          if (expected === undefined) {\n            result = true; // Expected is a regexp\n          } else if (expectedType === \"regexp\") {\n            result = expected.test(errorString(actual)); // Log the string form of the regexp\n\n            expected = String(expected); // Expected is a constructor, maybe an Error constructor\n          } else if (expectedType === \"function\" && actual instanceof expected) {\n            result = true; // Expected is an Error object\n          } else if (expectedType === \"object\") {\n            result = actual instanceof expected.constructor && actual.name === expected.name && actual.message === expected.message; // Log the string form of the Error object\n\n            expected = errorString(expected); // Expected is a validation function which returns true if validation passed\n          } else {\n            if (expectedType === \"function\") {\n              result = expected.call({}, actual) === true;\n              expected = null; // Expected is some other invalid type\n            } else {\n              result = false;\n              message = \"invalid expected value provided to `assert.rejects` \" + \"callback in \\\"\" + currentTest.testName + \"\\\": \" + expectedType + \".\";\n            }\n          }\n\n          currentTest.assert.pushResult({\n            result: result,\n            // leave rejection value of undefined as-is\n            actual: actual && errorString(actual),\n            expected: expected,\n            message: message\n          });\n          done();\n        });\n      }\n    }]);\n\n    return Assert;\n  }(); // Provide an alternative to assert.throws(), for environments that consider throws a reserved word\n  // Known to us are: Closure Compiler, Narwhal\n  // eslint-disable-next-line dot-notation\n\n\n  Assert.prototype.raises = Assert.prototype[\"throws\"];\n  /**\n   * Converts an error into a simple string for comparisons.\n   *\n   * @param {Error|Object} error\n   * @return {string}\n   */\n\n  function errorString(error) {\n    var resultErrorString = error.toString(); // If the error wasn't a subclass of Error but something like\n    // an object literal with name and message properties...\n\n    if (resultErrorString.slice(0, 7) === \"[object\") {\n      // Based on https://es5.github.com/#x15.11.4.4\n      var name = error.name ? String(error.name) : \"Error\";\n      return error.message ? \"\".concat(name, \": \").concat(error.message) : name;\n    } else {\n      return resultErrorString;\n    }\n  }\n  /* global module, exports, define */\n\n\n  function exportQUnit(QUnit) {\n    var exportedModule = false;\n\n    if (window$1 && document) {\n      // QUnit may be defined when it is preconfigured but then only QUnit and QUnit.config may be defined.\n      if (window$1.QUnit && window$1.QUnit.version) {\n        throw new Error(\"QUnit has already been defined.\");\n      }\n\n      window$1.QUnit = QUnit;\n      exportedModule = true;\n    } // For Node.js\n\n\n    if ( true && module && module.exports) {\n      module.exports = QUnit; // For consistency with CommonJS environments' exports\n\n      module.exports.QUnit = QUnit;\n      exportedModule = true;\n    } // For CommonJS with exports, but without module.exports, like Rhino\n\n\n    if ( true && exports) {\n      exports.QUnit = QUnit;\n      exportedModule = true;\n    } // For AMD\n\n\n    if (true) {\n      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {\n        return QUnit;\n      }).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n      QUnit.config.autostart = false;\n      exportedModule = true;\n    } // For Web/Service Workers\n\n\n    if (self$1 && self$1.WorkerGlobalScope && self$1 instanceof self$1.WorkerGlobalScope) {\n      self$1.QUnit = QUnit;\n      exportedModule = true;\n    } // For other environments, such as SpiderMonkey (mozjs) and other\n    // embedded JavaScript engines\n\n\n    if (!exportedModule) {\n      global__default['default'].QUnit = QUnit;\n    }\n  } // error handling should be suppressed and false otherwise.\n  // In this case, we will only suppress further error handling if the\n  // \"ignoreGlobalErrors\" configuration option is enabled.\n\n\n  function onError(error) {\n    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n      args[_key - 1] = arguments[_key];\n    }\n\n    if (config.current) {\n      if (config.current.ignoreGlobalErrors) {\n        return true;\n      }\n\n      pushFailure.apply(void 0, [error.message, error.stacktrace || error.fileName + \":\" + error.lineNumber].concat(args));\n    } else {\n      test(\"global failure\", extend(function () {\n        pushFailure.apply(void 0, [error.message, error.stacktrace || error.fileName + \":\" + error.lineNumber].concat(args));\n      }, {\n        validTest: true\n      }));\n    }\n\n    return false;\n  }\n\n  function onUnhandledRejection(reason) {\n    var resultInfo = {\n      result: false,\n      message: reason.message || \"error\",\n      actual: reason,\n      source: reason.stack || sourceFromStacktrace(3)\n    };\n    var currentTest = config.current;\n\n    if (currentTest) {\n      currentTest.assert.pushResult(resultInfo);\n    } else {\n      test(\"global failure\", extend(function (assert) {\n        assert.pushResult(resultInfo);\n      }, {\n        validTest: true\n      }));\n    }\n  }\n\n  var QUnit = {};\n  var globalSuite = new SuiteReport(); // The initial \"currentModule\" represents the global (or top-level) module that\n  // is not explicitly defined by the user, therefore we add the \"globalSuite\" to\n  // it since each module has a suiteReport associated with it.\n\n  config.currentModule.suiteReport = globalSuite;\n  var globalStartCalled = false;\n  var runStarted = false; // Figure out if we're running the tests from a server or not\n\n  QUnit.isLocal = window$1 && window$1.location && window$1.location.protocol === \"file:\"; // Expose the current QUnit version\n\n  QUnit.version = \"2.14.0\";\n  extend(QUnit, {\n    config: config,\n    dump: dump,\n    equiv: equiv,\n    is: is,\n    objectType: objectType,\n    on: on,\n    onError: onError,\n    onUnhandledRejection: onUnhandledRejection,\n    pushFailure: pushFailure,\n    assert: Assert.prototype,\n    module: module$1,\n    test: test,\n    // alias other test flavors for easy access\n    todo: test.todo,\n    skip: test.skip,\n    only: test.only,\n    start: function start(count) {\n      if (config.current) {\n        throw new Error(\"QUnit.start cannot be called inside a test context.\");\n      }\n\n      var globalStartAlreadyCalled = globalStartCalled;\n      globalStartCalled = true;\n\n      if (runStarted) {\n        throw new Error(\"Called start() while test already started running\");\n      }\n\n      if (globalStartAlreadyCalled || count > 1) {\n        throw new Error(\"Called start() outside of a test context too many times\");\n      }\n\n      if (config.autostart) {\n        throw new Error(\"Called start() outside of a test context when \" + \"QUnit.config.autostart was true\");\n      }\n\n      if (!config.pageLoaded) {\n        // The page isn't completely loaded yet, so we set autostart and then\n        // load if we're in Node or wait for the browser's load event.\n        config.autostart = true; // Starts from Node even if .load was not previously called. We still return\n        // early otherwise we'll wind up \"beginning\" twice.\n\n        if (!document) {\n          QUnit.load();\n        }\n\n        return;\n      }\n\n      scheduleBegin();\n    },\n    extend: function extend$1() {\n      Logger.warn(\"QUnit.extend is deprecated and will be removed in QUnit 3.0.\" + \" Please use Object.assign instead.\"); // delegate to utility implementation, which does not warn and can be used elsewhere internally\n\n      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n        args[_key] = arguments[_key];\n      }\n\n      return extend.apply(this, args);\n    },\n    load: function load() {\n      config.pageLoaded = true; // Initialize the configuration options\n\n      extend(config, {\n        stats: {\n          all: 0,\n          bad: 0,\n          testCount: 0\n        },\n        started: 0,\n        updateRate: 1000,\n        autostart: true,\n        filter: \"\"\n      }, true);\n\n      if (!runStarted) {\n        config.blocking = false;\n\n        if (config.autostart) {\n          scheduleBegin();\n        }\n      }\n    },\n    stack: function stack(offset) {\n      offset = (offset || 0) + 2;\n      return sourceFromStacktrace(offset);\n    }\n  });\n  registerLoggingCallbacks(QUnit);\n\n  function scheduleBegin() {\n    runStarted = true; // Add a slight delay to allow definition of more modules and tests.\n\n    if (setTimeout$1) {\n      setTimeout$1(function () {\n        begin();\n      });\n    } else {\n      begin();\n    }\n  }\n\n  function unblockAndAdvanceQueue() {\n    config.blocking = false;\n    ProcessingQueue.advance();\n  }\n\n  function begin() {\n    if (config.started) {\n      unblockAndAdvanceQueue();\n      return;\n    } // The test run hasn't officially begun yet\n    // Record the time of the test run's beginning\n\n\n    config.started = now(); // Delete the loose unnamed module if unused.\n\n    if (config.modules[0].name === \"\" && config.modules[0].tests.length === 0) {\n      config.modules.shift();\n    } // Avoid unnecessary information by not logging modules' test environments\n\n\n    var l = config.modules.length;\n    var modulesLog = [];\n\n    for (var i = 0; i < l; i++) {\n      modulesLog.push({\n        name: config.modules[i].name,\n        tests: config.modules[i].tests\n      });\n    } // The test run is officially beginning now\n\n\n    emit(\"runStart\", globalSuite.start(true));\n    runLoggingCallbacks(\"begin\", {\n      totalTests: Test.count,\n      modules: modulesLog\n    }).then(unblockAndAdvanceQueue);\n  }\n\n  exportQUnit(QUnit);\n\n  (function () {\n    if (!window$1 || !document) {\n      return;\n    }\n\n    var config = QUnit.config,\n        hasOwn = Object.prototype.hasOwnProperty; // Stores fixture HTML for resetting later\n\n    function storeFixture() {\n      // Avoid overwriting user-defined values\n      if (hasOwn.call(config, \"fixture\")) {\n        return;\n      }\n\n      var fixture = document.getElementById(\"qunit-fixture\");\n\n      if (fixture) {\n        config.fixture = fixture.cloneNode(true);\n      }\n    }\n\n    QUnit.begin(storeFixture); // Resets the fixture DOM element if available.\n\n    function resetFixture() {\n      if (config.fixture == null) {\n        return;\n      }\n\n      var fixture = document.getElementById(\"qunit-fixture\");\n\n      var resetFixtureType = _typeof(config.fixture);\n\n      if (resetFixtureType === \"string\") {\n        // support user defined values for `config.fixture`\n        var newFixture = document.createElement(\"div\");\n        newFixture.setAttribute(\"id\", \"qunit-fixture\");\n        newFixture.innerHTML = config.fixture;\n        fixture.parentNode.replaceChild(newFixture, fixture);\n      } else {\n        var clonedFixture = config.fixture.cloneNode(true);\n        fixture.parentNode.replaceChild(clonedFixture, fixture);\n      }\n    }\n\n    QUnit.testStart(resetFixture);\n  })();\n\n  (function () {\n    // Only interact with URLs via window.location\n    var location = typeof window$1 !== \"undefined\" && window$1.location;\n\n    if (!location) {\n      return;\n    }\n\n    var urlParams = getUrlParams();\n    QUnit.urlParams = urlParams; // Match module/test by inclusion in an array\n\n    QUnit.config.moduleId = [].concat(urlParams.moduleId || []);\n    QUnit.config.testId = [].concat(urlParams.testId || []); // Exact case-insensitive match of the module name\n\n    QUnit.config.module = urlParams.module; // Regular expression or case-insenstive substring match against \"moduleName: testName\"\n\n    QUnit.config.filter = urlParams.filter; // Test order randomization\n\n    if (urlParams.seed === true) {\n      // Generate a random seed if the option is specified without a value\n      QUnit.config.seed = Math.random().toString(36).slice(2);\n    } else if (urlParams.seed) {\n      QUnit.config.seed = urlParams.seed;\n    } // Add URL-parameter-mapped config values with UI form rendering data\n\n\n    QUnit.config.urlConfig.push({\n      id: \"hidepassed\",\n      label: \"Hide passed tests\",\n      tooltip: \"Only show tests and assertions that fail. Stored as query-strings.\"\n    }, {\n      id: \"noglobals\",\n      label: \"Check for Globals\",\n      tooltip: \"Enabling this will test if any test introduces new properties on the \" + \"global object (`window` in Browsers). Stored as query-strings.\"\n    }, {\n      id: \"notrycatch\",\n      label: \"No try-catch\",\n      tooltip: \"Enabling this will run tests outside of a try-catch block. Makes debugging \" + \"exceptions in IE reasonable. Stored as query-strings.\"\n    });\n    QUnit.begin(function () {\n      var i,\n          option,\n          urlConfig = QUnit.config.urlConfig;\n\n      for (i = 0; i < urlConfig.length; i++) {\n        // Options can be either strings or objects with nonempty \"id\" properties\n        option = QUnit.config.urlConfig[i];\n\n        if (typeof option !== \"string\") {\n          option = option.id;\n        }\n\n        if (QUnit.config[option] === undefined) {\n          QUnit.config[option] = urlParams[option];\n        }\n      }\n    });\n\n    function getUrlParams() {\n      var i, param, name, value;\n      var urlParams = Object.create(null);\n      var params = location.search.slice(1).split(\"&\");\n      var length = params.length;\n\n      for (i = 0; i < length; i++) {\n        if (params[i]) {\n          param = params[i].split(\"=\");\n          name = decodeQueryParam(param[0]); // Allow just a key to turn on a flag, e.g., test.html?noglobals\n\n          value = param.length === 1 || decodeQueryParam(param.slice(1).join(\"=\"));\n\n          if (name in urlParams) {\n            urlParams[name] = [].concat(urlParams[name], value);\n          } else {\n            urlParams[name] = value;\n          }\n        }\n      }\n\n      return urlParams;\n    }\n\n    function decodeQueryParam(param) {\n      return decodeURIComponent(param.replace(/\\+/g, \"%20\"));\n    }\n  })();\n\n  var fuzzysort = createCommonjsModule(function (module) {\n    (function (root, UMD) {\n      if (module.exports) module.exports = UMD();else root.fuzzysort = UMD();\n    })(commonjsGlobal, function UMD() {\n      function fuzzysortNew(instanceOptions) {\n        var fuzzysort = {\n          single: function (search, target, options) {\n            if (!search) return null;\n            if (!isObj(search)) search = fuzzysort.getPreparedSearch(search);\n            if (!target) return null;\n            if (!isObj(target)) target = fuzzysort.getPrepared(target);\n            var allowTypo = options && options.allowTypo !== undefined ? options.allowTypo : instanceOptions && instanceOptions.allowTypo !== undefined ? instanceOptions.allowTypo : true;\n            var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo;\n            return algorithm(search, target, search[0]); // var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991\n            // var result = algorithm(search, target, search[0])\n            // if(result === null) return null\n            // if(result.score < threshold) return null\n            // return result\n          },\n          go: function (search, targets, options) {\n            if (!search) return noResults;\n            search = fuzzysort.prepareSearch(search);\n            var searchLowerCode = search[0];\n            var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991;\n            var limit = options && options.limit || instanceOptions && instanceOptions.limit || 9007199254740991;\n            var allowTypo = options && options.allowTypo !== undefined ? options.allowTypo : instanceOptions && instanceOptions.allowTypo !== undefined ? instanceOptions.allowTypo : true;\n            var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo;\n            var resultsLen = 0;\n            var limitedCount = 0;\n            var targetsLen = targets.length; // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]\n            // options.keys\n\n            if (options && options.keys) {\n              var scoreFn = options.scoreFn || defaultScoreFn;\n              var keys = options.keys;\n              var keysLen = keys.length;\n\n              for (var i = targetsLen - 1; i >= 0; --i) {\n                var obj = targets[i];\n                var objResults = new Array(keysLen);\n\n                for (var keyI = keysLen - 1; keyI >= 0; --keyI) {\n                  var key = keys[keyI];\n                  var target = getValue(obj, key);\n\n                  if (!target) {\n                    objResults[keyI] = null;\n                    continue;\n                  }\n\n                  if (!isObj(target)) target = fuzzysort.getPrepared(target);\n                  objResults[keyI] = algorithm(search, target, searchLowerCode);\n                }\n\n                objResults.obj = obj; // before scoreFn so scoreFn can use it\n\n                var score = scoreFn(objResults);\n                if (score === null) continue;\n                if (score < threshold) continue;\n                objResults.score = score;\n\n                if (resultsLen < limit) {\n                  q.add(objResults);\n                  ++resultsLen;\n                } else {\n                  ++limitedCount;\n                  if (score > q.peek().score) q.replaceTop(objResults);\n                }\n              } // options.key\n\n            } else if (options && options.key) {\n              var key = options.key;\n\n              for (var i = targetsLen - 1; i >= 0; --i) {\n                var obj = targets[i];\n                var target = getValue(obj, key);\n                if (!target) continue;\n                if (!isObj(target)) target = fuzzysort.getPrepared(target);\n                var result = algorithm(search, target, searchLowerCode);\n                if (result === null) continue;\n                if (result.score < threshold) continue; // have to clone result so duplicate targets from different obj can each reference the correct obj\n\n                result = {\n                  target: result.target,\n                  _targetLowerCodes: null,\n                  _nextBeginningIndexes: null,\n                  score: result.score,\n                  indexes: result.indexes,\n                  obj: obj\n                }; // hidden\n\n                if (resultsLen < limit) {\n                  q.add(result);\n                  ++resultsLen;\n                } else {\n                  ++limitedCount;\n                  if (result.score > q.peek().score) q.replaceTop(result);\n                }\n              } // no keys\n\n            } else {\n              for (var i = targetsLen - 1; i >= 0; --i) {\n                var target = targets[i];\n                if (!target) continue;\n                if (!isObj(target)) target = fuzzysort.getPrepared(target);\n                var result = algorithm(search, target, searchLowerCode);\n                if (result === null) continue;\n                if (result.score < threshold) continue;\n\n                if (resultsLen < limit) {\n                  q.add(result);\n                  ++resultsLen;\n                } else {\n                  ++limitedCount;\n                  if (result.score > q.peek().score) q.replaceTop(result);\n                }\n              }\n            }\n\n            if (resultsLen === 0) return noResults;\n            var results = new Array(resultsLen);\n\n            for (var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll();\n\n            results.total = resultsLen + limitedCount;\n            return results;\n          },\n          goAsync: function (search, targets, options) {\n            var canceled = false;\n            var p = new Promise(function (resolve, reject) {\n              if (!search) return resolve(noResults);\n              search = fuzzysort.prepareSearch(search);\n              var searchLowerCode = search[0];\n              var q = fastpriorityqueue();\n              var iCurrent = targets.length - 1;\n              var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -9007199254740991;\n              var limit = options && options.limit || instanceOptions && instanceOptions.limit || 9007199254740991;\n              var allowTypo = options && options.allowTypo !== undefined ? options.allowTypo : instanceOptions && instanceOptions.allowTypo !== undefined ? instanceOptions.allowTypo : true;\n              var algorithm = allowTypo ? fuzzysort.algorithm : fuzzysort.algorithmNoTypo;\n              var resultsLen = 0;\n              var limitedCount = 0;\n\n              function step() {\n                if (canceled) return reject('canceled');\n                var startMs = Date.now(); // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]\n                // options.keys\n\n                if (options && options.keys) {\n                  var scoreFn = options.scoreFn || defaultScoreFn;\n                  var keys = options.keys;\n                  var keysLen = keys.length;\n\n                  for (; iCurrent >= 0; --iCurrent) {\n                    var obj = targets[iCurrent];\n                    var objResults = new Array(keysLen);\n\n                    for (var keyI = keysLen - 1; keyI >= 0; --keyI) {\n                      var key = keys[keyI];\n                      var target = getValue(obj, key);\n\n                      if (!target) {\n                        objResults[keyI] = null;\n                        continue;\n                      }\n\n                      if (!isObj(target)) target = fuzzysort.getPrepared(target);\n                      objResults[keyI] = algorithm(search, target, searchLowerCode);\n                    }\n\n                    objResults.obj = obj; // before scoreFn so scoreFn can use it\n\n                    var score = scoreFn(objResults);\n                    if (score === null) continue;\n                    if (score < threshold) continue;\n                    objResults.score = score;\n\n                    if (resultsLen < limit) {\n                      q.add(objResults);\n                      ++resultsLen;\n                    } else {\n                      ++limitedCount;\n                      if (score > q.peek().score) q.replaceTop(objResults);\n                    }\n\n                    if (iCurrent % 1000\n                    /*itemsPerCheck*/\n                    === 0) {\n                      if (Date.now() - startMs >= 10\n                      /*asyncInterval*/\n                      ) {\n                          isNode ? setImmediate(step) : setTimeout(step);\n                          return;\n                        }\n                    }\n                  } // options.key\n\n                } else if (options && options.key) {\n                  var key = options.key;\n\n                  for (; iCurrent >= 0; --iCurrent) {\n                    var obj = targets[iCurrent];\n                    var target = getValue(obj, key);\n                    if (!target) continue;\n                    if (!isObj(target)) target = fuzzysort.getPrepared(target);\n                    var result = algorithm(search, target, searchLowerCode);\n                    if (result === null) continue;\n                    if (result.score < threshold) continue; // have to clone result so duplicate targets from different obj can each reference the correct obj\n\n                    result = {\n                      target: result.target,\n                      _targetLowerCodes: null,\n                      _nextBeginningIndexes: null,\n                      score: result.score,\n                      indexes: result.indexes,\n                      obj: obj\n                    }; // hidden\n\n                    if (resultsLen < limit) {\n                      q.add(result);\n                      ++resultsLen;\n                    } else {\n                      ++limitedCount;\n                      if (result.score > q.peek().score) q.replaceTop(result);\n                    }\n\n                    if (iCurrent % 1000\n                    /*itemsPerCheck*/\n                    === 0) {\n                      if (Date.now() - startMs >= 10\n                      /*asyncInterval*/\n                      ) {\n                          isNode ? setImmediate(step) : setTimeout(step);\n                          return;\n                        }\n                    }\n                  } // no keys\n\n                } else {\n                  for (; iCurrent >= 0; --iCurrent) {\n                    var target = targets[iCurrent];\n                    if (!target) continue;\n                    if (!isObj(target)) target = fuzzysort.getPrepared(target);\n                    var result = algorithm(search, target, searchLowerCode);\n                    if (result === null) continue;\n                    if (result.score < threshold) continue;\n\n                    if (resultsLen < limit) {\n                      q.add(result);\n                      ++resultsLen;\n                    } else {\n                      ++limitedCount;\n                      if (result.score > q.peek().score) q.replaceTop(result);\n                    }\n\n                    if (iCurrent % 1000\n                    /*itemsPerCheck*/\n                    === 0) {\n                      if (Date.now() - startMs >= 10\n                      /*asyncInterval*/\n                      ) {\n                          isNode ? setImmediate(step) : setTimeout(step);\n                          return;\n                        }\n                    }\n                  }\n                }\n\n                if (resultsLen === 0) return resolve(noResults);\n                var results = new Array(resultsLen);\n\n                for (var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll();\n\n                results.total = resultsLen + limitedCount;\n                resolve(results);\n              }\n\n              isNode ? setImmediate(step) : step();\n            });\n\n            p.cancel = function () {\n              canceled = true;\n            };\n\n            return p;\n          },\n          highlight: function (result, hOpen, hClose) {\n            if (result === null) return null;\n            if (hOpen === undefined) hOpen = '<b>';\n            if (hClose === undefined) hClose = '</b>';\n            var highlighted = '';\n            var matchesIndex = 0;\n            var opened = false;\n            var target = result.target;\n            var targetLen = target.length;\n            var matchesBest = result.indexes;\n\n            for (var i = 0; i < targetLen; ++i) {\n              var char = target[i];\n\n              if (matchesBest[matchesIndex] === i) {\n                ++matchesIndex;\n\n                if (!opened) {\n                  opened = true;\n                  highlighted += hOpen;\n                }\n\n                if (matchesIndex === matchesBest.length) {\n                  highlighted += char + hClose + target.substr(i + 1);\n                  break;\n                }\n              } else {\n                if (opened) {\n                  opened = false;\n                  highlighted += hClose;\n                }\n              }\n\n              highlighted += char;\n            }\n\n            return highlighted;\n          },\n          prepare: function (target) {\n            if (!target) return;\n            return {\n              target: target,\n              _targetLowerCodes: fuzzysort.prepareLowerCodes(target),\n              _nextBeginningIndexes: null,\n              score: null,\n              indexes: null,\n              obj: null\n            }; // hidden\n          },\n          prepareSlow: function (target) {\n            if (!target) return;\n            return {\n              target: target,\n              _targetLowerCodes: fuzzysort.prepareLowerCodes(target),\n              _nextBeginningIndexes: fuzzysort.prepareNextBeginningIndexes(target),\n              score: null,\n              indexes: null,\n              obj: null\n            }; // hidden\n          },\n          prepareSearch: function (search) {\n            if (!search) return;\n            return fuzzysort.prepareLowerCodes(search);\n          },\n          // Below this point is only internal code\n          // Below this point is only internal code\n          // Below this point is only internal code\n          // Below this point is only internal code\n          getPrepared: function (target) {\n            if (target.length > 999) return fuzzysort.prepare(target); // don't cache huge targets\n\n            var targetPrepared = preparedCache.get(target);\n            if (targetPrepared !== undefined) return targetPrepared;\n            targetPrepared = fuzzysort.prepare(target);\n            preparedCache.set(target, targetPrepared);\n            return targetPrepared;\n          },\n          getPreparedSearch: function (search) {\n            if (search.length > 999) return fuzzysort.prepareSearch(search); // don't cache huge searches\n\n            var searchPrepared = preparedSearchCache.get(search);\n            if (searchPrepared !== undefined) return searchPrepared;\n            searchPrepared = fuzzysort.prepareSearch(search);\n            preparedSearchCache.set(search, searchPrepared);\n            return searchPrepared;\n          },\n          algorithm: function (searchLowerCodes, prepared, searchLowerCode) {\n            var targetLowerCodes = prepared._targetLowerCodes;\n            var searchLen = searchLowerCodes.length;\n            var targetLen = targetLowerCodes.length;\n            var searchI = 0; // where we at\n\n            var targetI = 0; // where you at\n\n            var typoSimpleI = 0;\n            var matchesSimpleLen = 0; // very basic fuzzy match; to remove non-matching targets ASAP!\n            // walk through target. find sequential matches.\n            // if all chars aren't found then exit\n\n            for (;;) {\n              var isMatch = searchLowerCode === targetLowerCodes[targetI];\n\n              if (isMatch) {\n                matchesSimple[matchesSimpleLen++] = targetI;\n                ++searchI;\n                if (searchI === searchLen) break;\n                searchLowerCode = searchLowerCodes[typoSimpleI === 0 ? searchI : typoSimpleI === searchI ? searchI + 1 : typoSimpleI === searchI - 1 ? searchI - 1 : searchI];\n              }\n\n              ++targetI;\n\n              if (targetI >= targetLen) {\n                // Failed to find searchI\n                // Check for typo or exit\n                // we go as far as possible before trying to transpose\n                // then we transpose backwards until we reach the beginning\n                for (;;) {\n                  if (searchI <= 1) return null; // not allowed to transpose first char\n\n                  if (typoSimpleI === 0) {\n                    // we haven't tried to transpose yet\n                    --searchI;\n                    var searchLowerCodeNew = searchLowerCodes[searchI];\n                    if (searchLowerCode === searchLowerCodeNew) continue; // doesn't make sense to transpose a repeat char\n\n                    typoSimpleI = searchI;\n                  } else {\n                    if (typoSimpleI === 1) return null; // reached the end of the line for transposing\n\n                    --typoSimpleI;\n                    searchI = typoSimpleI;\n                    searchLowerCode = searchLowerCodes[searchI + 1];\n                    var searchLowerCodeNew = searchLowerCodes[searchI];\n                    if (searchLowerCode === searchLowerCodeNew) continue; // doesn't make sense to transpose a repeat char\n                  }\n\n                  matchesSimpleLen = searchI;\n                  targetI = matchesSimple[matchesSimpleLen - 1] + 1;\n                  break;\n                }\n              }\n            }\n\n            var searchI = 0;\n            var typoStrictI = 0;\n            var successStrict = false;\n            var matchesStrictLen = 0;\n            var nextBeginningIndexes = prepared._nextBeginningIndexes;\n            if (nextBeginningIndexes === null) nextBeginningIndexes = prepared._nextBeginningIndexes = fuzzysort.prepareNextBeginningIndexes(prepared.target);\n            var firstPossibleI = targetI = matchesSimple[0] === 0 ? 0 : nextBeginningIndexes[matchesSimple[0] - 1]; // Our target string successfully matched all characters in sequence!\n            // Let's try a more advanced and strict test to improve the score\n            // only count it as a match if it's consecutive or a beginning character!\n\n            if (targetI !== targetLen) for (;;) {\n              if (targetI >= targetLen) {\n                // We failed to find a good spot for this search char, go back to the previous search char and force it forward\n                if (searchI <= 0) {\n                  // We failed to push chars forward for a better match\n                  // transpose, starting from the beginning\n                  ++typoStrictI;\n                  if (typoStrictI > searchLen - 2) break;\n                  if (searchLowerCodes[typoStrictI] === searchLowerCodes[typoStrictI + 1]) continue; // doesn't make sense to transpose a repeat char\n\n                  targetI = firstPossibleI;\n                  continue;\n                }\n\n                --searchI;\n                var lastMatch = matchesStrict[--matchesStrictLen];\n                targetI = nextBeginningIndexes[lastMatch];\n              } else {\n                var isMatch = searchLowerCodes[typoStrictI === 0 ? searchI : typoStrictI === searchI ? searchI + 1 : typoStrictI === searchI - 1 ? searchI - 1 : searchI] === targetLowerCodes[targetI];\n\n                if (isMatch) {\n                  matchesStrict[matchesStrictLen++] = targetI;\n                  ++searchI;\n\n                  if (searchI === searchLen) {\n                    successStrict = true;\n                    break;\n                  }\n\n                  ++targetI;\n                } else {\n                  targetI = nextBeginningIndexes[targetI];\n                }\n              }\n            }\n            {\n              // tally up the score & keep track of matches for highlighting later\n              if (successStrict) {\n                var matchesBest = matchesStrict;\n                var matchesBestLen = matchesStrictLen;\n              } else {\n                var matchesBest = matchesSimple;\n                var matchesBestLen = matchesSimpleLen;\n              }\n\n              var score = 0;\n              var lastTargetI = -1;\n\n              for (var i = 0; i < searchLen; ++i) {\n                var targetI = matchesBest[i]; // score only goes down if they're not consecutive\n\n                if (lastTargetI !== targetI - 1) score -= targetI;\n                lastTargetI = targetI;\n              }\n\n              if (!successStrict) {\n                score *= 1000;\n                if (typoSimpleI !== 0) score += -20;\n                /*typoPenalty*/\n              } else {\n                if (typoStrictI !== 0) score += -20;\n                /*typoPenalty*/\n              }\n\n              score -= targetLen - searchLen;\n              prepared.score = score;\n              prepared.indexes = new Array(matchesBestLen);\n\n              for (var i = matchesBestLen - 1; i >= 0; --i) prepared.indexes[i] = matchesBest[i];\n\n              return prepared;\n            }\n          },\n          algorithmNoTypo: function (searchLowerCodes, prepared, searchLowerCode) {\n            var targetLowerCodes = prepared._targetLowerCodes;\n            var searchLen = searchLowerCodes.length;\n            var targetLen = targetLowerCodes.length;\n            var searchI = 0; // where we at\n\n            var targetI = 0; // where you at\n\n            var matchesSimpleLen = 0; // very basic fuzzy match; to remove non-matching targets ASAP!\n            // walk through target. find sequential matches.\n            // if all chars aren't found then exit\n\n            for (;;) {\n              var isMatch = searchLowerCode === targetLowerCodes[targetI];\n\n              if (isMatch) {\n                matchesSimple[matchesSimpleLen++] = targetI;\n                ++searchI;\n                if (searchI === searchLen) break;\n                searchLowerCode = searchLowerCodes[searchI];\n              }\n\n              ++targetI;\n              if (targetI >= targetLen) return null; // Failed to find searchI\n            }\n\n            var searchI = 0;\n            var successStrict = false;\n            var matchesStrictLen = 0;\n            var nextBeginningIndexes = prepared._nextBeginningIndexes;\n            if (nextBeginningIndexes === null) nextBeginningIndexes = prepared._nextBeginningIndexes = fuzzysort.prepareNextBeginningIndexes(prepared.target);\n            var firstPossibleI = targetI = matchesSimple[0] === 0 ? 0 : nextBeginningIndexes[matchesSimple[0] - 1]; // Our target string successfully matched all characters in sequence!\n            // Let's try a more advanced and strict test to improve the score\n            // only count it as a match if it's consecutive or a beginning character!\n\n            if (targetI !== targetLen) for (;;) {\n              if (targetI >= targetLen) {\n                // We failed to find a good spot for this search char, go back to the previous search char and force it forward\n                if (searchI <= 0) break; // We failed to push chars forward for a better match\n\n                --searchI;\n                var lastMatch = matchesStrict[--matchesStrictLen];\n                targetI = nextBeginningIndexes[lastMatch];\n              } else {\n                var isMatch = searchLowerCodes[searchI] === targetLowerCodes[targetI];\n\n                if (isMatch) {\n                  matchesStrict[matchesStrictLen++] = targetI;\n                  ++searchI;\n\n                  if (searchI === searchLen) {\n                    successStrict = true;\n                    break;\n                  }\n\n                  ++targetI;\n                } else {\n                  targetI = nextBeginningIndexes[targetI];\n                }\n              }\n            }\n            {\n              // tally up the score & keep track of matches for highlighting later\n              if (successStrict) {\n                var matchesBest = matchesStrict;\n                var matchesBestLen = matchesStrictLen;\n              } else {\n                var matchesBest = matchesSimple;\n                var matchesBestLen = matchesSimpleLen;\n              }\n\n              var score = 0;\n              var lastTargetI = -1;\n\n              for (var i = 0; i < searchLen; ++i) {\n                var targetI = matchesBest[i]; // score only goes down if they're not consecutive\n\n                if (lastTargetI !== targetI - 1) score -= targetI;\n                lastTargetI = targetI;\n              }\n\n              if (!successStrict) score *= 1000;\n              score -= targetLen - searchLen;\n              prepared.score = score;\n              prepared.indexes = new Array(matchesBestLen);\n\n              for (var i = matchesBestLen - 1; i >= 0; --i) prepared.indexes[i] = matchesBest[i];\n\n              return prepared;\n            }\n          },\n          prepareLowerCodes: function (str) {\n            var strLen = str.length;\n            var lowerCodes = []; // new Array(strLen)    sparse array is too slow\n\n            var lower = str.toLowerCase();\n\n            for (var i = 0; i < strLen; ++i) lowerCodes[i] = lower.charCodeAt(i);\n\n            return lowerCodes;\n          },\n          prepareBeginningIndexes: function (target) {\n            var targetLen = target.length;\n            var beginningIndexes = [];\n            var beginningIndexesLen = 0;\n            var wasUpper = false;\n            var wasAlphanum = false;\n\n            for (var i = 0; i < targetLen; ++i) {\n              var targetCode = target.charCodeAt(i);\n              var isUpper = targetCode >= 65 && targetCode <= 90;\n              var isAlphanum = isUpper || targetCode >= 97 && targetCode <= 122 || targetCode >= 48 && targetCode <= 57;\n              var isBeginning = isUpper && !wasUpper || !wasAlphanum || !isAlphanum;\n              wasUpper = isUpper;\n              wasAlphanum = isAlphanum;\n              if (isBeginning) beginningIndexes[beginningIndexesLen++] = i;\n            }\n\n            return beginningIndexes;\n          },\n          prepareNextBeginningIndexes: function (target) {\n            var targetLen = target.length;\n            var beginningIndexes = fuzzysort.prepareBeginningIndexes(target);\n            var nextBeginningIndexes = []; // new Array(targetLen)     sparse array is too slow\n\n            var lastIsBeginning = beginningIndexes[0];\n            var lastIsBeginningI = 0;\n\n            for (var i = 0; i < targetLen; ++i) {\n              if (lastIsBeginning > i) {\n                nextBeginningIndexes[i] = lastIsBeginning;\n              } else {\n                lastIsBeginning = beginningIndexes[++lastIsBeginningI];\n                nextBeginningIndexes[i] = lastIsBeginning === undefined ? targetLen : lastIsBeginning;\n              }\n            }\n\n            return nextBeginningIndexes;\n          },\n          cleanup: cleanup,\n          new: fuzzysortNew\n        };\n        return fuzzysort;\n      } // fuzzysortNew\n      // This stuff is outside fuzzysortNew, because it's shared with instances of fuzzysort.new()\n\n\n      var isNode = typeof commonjsRequire !== 'undefined' && typeof window === 'undefined'; // var MAX_INT = Number.MAX_SAFE_INTEGER\n      // var MIN_INT = Number.MIN_VALUE\n\n      var preparedCache = new Map();\n      var preparedSearchCache = new Map();\n      var noResults = [];\n      noResults.total = 0;\n      var matchesSimple = [];\n      var matchesStrict = [];\n\n      function cleanup() {\n        preparedCache.clear();\n        preparedSearchCache.clear();\n        matchesSimple = [];\n        matchesStrict = [];\n      }\n\n      function defaultScoreFn(a) {\n        var max = -9007199254740991;\n\n        for (var i = a.length - 1; i >= 0; --i) {\n          var result = a[i];\n          if (result === null) continue;\n          var score = result.score;\n          if (score > max) max = score;\n        }\n\n        if (max === -9007199254740991) return null;\n        return max;\n      } // prop = 'key'              2.5ms optimized for this case, seems to be about as fast as direct obj[prop]\n      // prop = 'key1.key2'        10ms\n      // prop = ['key1', 'key2']   27ms\n\n\n      function getValue(obj, prop) {\n        var tmp = obj[prop];\n        if (tmp !== undefined) return tmp;\n        var segs = prop;\n        if (!Array.isArray(prop)) segs = prop.split('.');\n        var len = segs.length;\n        var i = -1;\n\n        while (obj && ++i < len) obj = obj[segs[i]];\n\n        return obj;\n      }\n\n      function isObj(x) {\n        return typeof x === 'object';\n      } // faster as a function\n      // Hacked version of https://github.com/lemire/FastPriorityQueue.js\n\n\n      var fastpriorityqueue = function () {\n        var r = [],\n            o = 0,\n            e = {};\n\n        function n() {\n          for (var e = 0, n = r[e], c = 1; c < o;) {\n            var f = c + 1;\n            e = c, f < o && r[f].score < r[c].score && (e = f), r[e - 1 >> 1] = r[e], c = 1 + (e << 1);\n          }\n\n          for (var a = e - 1 >> 1; e > 0 && n.score < r[a].score; a = (e = a) - 1 >> 1) r[e] = r[a];\n\n          r[e] = n;\n        }\n\n        return e.add = function (e) {\n          var n = o;\n          r[o++] = e;\n\n          for (var c = n - 1 >> 1; n > 0 && e.score < r[c].score; c = (n = c) - 1 >> 1) r[n] = r[c];\n\n          r[n] = e;\n        }, e.poll = function () {\n          if (0 !== o) {\n            var e = r[0];\n            return r[0] = r[--o], n(), e;\n          }\n        }, e.peek = function (e) {\n          if (0 !== o) return r[0];\n        }, e.replaceTop = function (o) {\n          r[0] = o, n();\n        }, e;\n      };\n\n      var q = fastpriorityqueue(); // reuse this, except for async, it needs to make its own\n\n      return fuzzysortNew();\n    }); // UMD\n    // TODO: (performance) wasm version!?\n    // TODO: (performance) layout memory in an optimal way to go fast by avoiding cache misses\n    // TODO: (performance) preparedCache is a memory leak\n    // TODO: (like sublime) backslash === forwardslash\n    // TODO: (performance) i have no idea how well optizmied the allowing typos algorithm is\n\n  });\n  var stats = {\n    passedTests: 0,\n    failedTests: 0,\n    skippedTests: 0,\n    todoTests: 0\n  }; // Escape text for attribute or text content.\n\n  function escapeText(s) {\n    if (!s) {\n      return \"\";\n    }\n\n    s = s + \"\"; // Both single quotes and double quotes (for attributes)\n\n    return s.replace(/['\"<>&]/g, function (s) {\n      switch (s) {\n        case \"'\":\n          return \"&#039;\";\n\n        case \"\\\"\":\n          return \"&quot;\";\n\n        case \"<\":\n          return \"&lt;\";\n\n        case \">\":\n          return \"&gt;\";\n\n        case \"&\":\n          return \"&amp;\";\n      }\n    });\n  }\n\n  (function () {\n    // Don't load the HTML Reporter on non-browser environments\n    if (!window$1 || !document) {\n      return;\n    }\n\n    var config = QUnit.config,\n        hiddenTests = [],\n        collapseNext = false,\n        hasOwn = Object.prototype.hasOwnProperty,\n        unfilteredUrl = setUrl({\n      filter: undefined,\n      module: undefined,\n      moduleId: undefined,\n      testId: undefined\n    });\n\n    function addEvent(elem, type, fn) {\n      elem.addEventListener(type, fn, false);\n    }\n\n    function removeEvent(elem, type, fn) {\n      elem.removeEventListener(type, fn, false);\n    }\n\n    function addEvents(elems, type, fn) {\n      var i = elems.length;\n\n      while (i--) {\n        addEvent(elems[i], type, fn);\n      }\n    }\n\n    function hasClass(elem, name) {\n      return (\" \" + elem.className + \" \").indexOf(\" \" + name + \" \") >= 0;\n    }\n\n    function addClass(elem, name) {\n      if (!hasClass(elem, name)) {\n        elem.className += (elem.className ? \" \" : \"\") + name;\n      }\n    }\n\n    function toggleClass(elem, name, force) {\n      if (force || typeof force === \"undefined\" && !hasClass(elem, name)) {\n        addClass(elem, name);\n      } else {\n        removeClass(elem, name);\n      }\n    }\n\n    function removeClass(elem, name) {\n      var set = \" \" + elem.className + \" \"; // Class name may appear multiple times\n\n      while (set.indexOf(\" \" + name + \" \") >= 0) {\n        set = set.replace(\" \" + name + \" \", \" \");\n      } // Trim for prettiness\n\n\n      elem.className = typeof set.trim === \"function\" ? set.trim() : set.replace(/^\\s+|\\s+$/g, \"\");\n    }\n\n    function id(name) {\n      return document.getElementById && document.getElementById(name);\n    }\n\n    function abortTests() {\n      var abortButton = id(\"qunit-abort-tests-button\");\n\n      if (abortButton) {\n        abortButton.disabled = true;\n        abortButton.innerHTML = \"Aborting...\";\n      }\n\n      QUnit.config.queue.length = 0;\n      return false;\n    }\n\n    function interceptNavigation(ev) {\n      applyUrlParams();\n\n      if (ev && ev.preventDefault) {\n        ev.preventDefault();\n      }\n\n      return false;\n    }\n\n    function getUrlConfigHtml() {\n      var i,\n          j,\n          val,\n          escaped,\n          escapedTooltip,\n          selection = false,\n          urlConfig = config.urlConfig,\n          urlConfigHtml = \"\";\n\n      for (i = 0; i < urlConfig.length; i++) {\n        // Options can be either strings or objects with nonempty \"id\" properties\n        val = config.urlConfig[i];\n\n        if (typeof val === \"string\") {\n          val = {\n            id: val,\n            label: val\n          };\n        }\n\n        escaped = escapeText(val.id);\n        escapedTooltip = escapeText(val.tooltip);\n\n        if (!val.value || typeof val.value === \"string\") {\n          urlConfigHtml += \"<label for='qunit-urlconfig-\" + escaped + \"' title='\" + escapedTooltip + \"'><input id='qunit-urlconfig-\" + escaped + \"' name='\" + escaped + \"' type='checkbox'\" + (val.value ? \" value='\" + escapeText(val.value) + \"'\" : \"\") + (config[val.id] ? \" checked='checked'\" : \"\") + \" title='\" + escapedTooltip + \"' />\" + escapeText(val.label) + \"</label>\";\n        } else {\n          urlConfigHtml += \"<label for='qunit-urlconfig-\" + escaped + \"' title='\" + escapedTooltip + \"'>\" + val.label + \": </label><select id='qunit-urlconfig-\" + escaped + \"' name='\" + escaped + \"' title='\" + escapedTooltip + \"'><option></option>\";\n\n          if (QUnit.is(\"array\", val.value)) {\n            for (j = 0; j < val.value.length; j++) {\n              escaped = escapeText(val.value[j]);\n              urlConfigHtml += \"<option value='\" + escaped + \"'\" + (config[val.id] === val.value[j] ? (selection = true) && \" selected='selected'\" : \"\") + \">\" + escaped + \"</option>\";\n            }\n          } else {\n            for (j in val.value) {\n              if (hasOwn.call(val.value, j)) {\n                urlConfigHtml += \"<option value='\" + escapeText(j) + \"'\" + (config[val.id] === j ? (selection = true) && \" selected='selected'\" : \"\") + \">\" + escapeText(val.value[j]) + \"</option>\";\n              }\n            }\n          }\n\n          if (config[val.id] && !selection) {\n            escaped = escapeText(config[val.id]);\n            urlConfigHtml += \"<option value='\" + escaped + \"' selected='selected' disabled='disabled'>\" + escaped + \"</option>\";\n          }\n\n          urlConfigHtml += \"</select>\";\n        }\n      }\n\n      return urlConfigHtml;\n    } // Handle \"click\" events on toolbar checkboxes and \"change\" for select menus.\n    // Updates the URL with the new state of `config.urlConfig` values.\n\n\n    function toolbarChanged() {\n      var updatedUrl,\n          value,\n          tests,\n          field = this,\n          params = {}; // Detect if field is a select menu or a checkbox\n\n      if (\"selectedIndex\" in field) {\n        value = field.options[field.selectedIndex].value || undefined;\n      } else {\n        value = field.checked ? field.defaultValue || true : undefined;\n      }\n\n      params[field.name] = value;\n      updatedUrl = setUrl(params); // Check if we can apply the change without a page refresh\n\n      if (\"hidepassed\" === field.name && \"replaceState\" in window$1.history) {\n        QUnit.urlParams[field.name] = value;\n        config[field.name] = value || false;\n        tests = id(\"qunit-tests\");\n\n        if (tests) {\n          var length = tests.children.length;\n          var children = tests.children;\n\n          if (field.checked) {\n            for (var i = 0; i < length; i++) {\n              var test = children[i];\n              var className = test ? test.className : \"\";\n              var classNameHasPass = className.indexOf(\"pass\") > -1;\n              var classNameHasSkipped = className.indexOf(\"skipped\") > -1;\n\n              if (classNameHasPass || classNameHasSkipped) {\n                hiddenTests.push(test);\n              }\n            }\n\n            var _iterator = _createForOfIteratorHelper(hiddenTests),\n                _step;\n\n            try {\n              for (_iterator.s(); !(_step = _iterator.n()).done;) {\n                var hiddenTest = _step.value;\n                tests.removeChild(hiddenTest);\n              }\n            } catch (err) {\n              _iterator.e(err);\n            } finally {\n              _iterator.f();\n            }\n          } else {\n            while ((test = hiddenTests.pop()) != null) {\n              tests.appendChild(test);\n            }\n          }\n        }\n\n        window$1.history.replaceState(null, \"\", updatedUrl);\n      } else {\n        window$1.location = updatedUrl;\n      }\n    }\n\n    function setUrl(params) {\n      var key,\n          arrValue,\n          i,\n          querystring = \"?\",\n          location = window$1.location;\n      params = extend(extend({}, QUnit.urlParams), params);\n\n      for (key in params) {\n        // Skip inherited or undefined properties\n        if (hasOwn.call(params, key) && params[key] !== undefined) {\n          // Output a parameter for each value of this key\n          // (but usually just one)\n          arrValue = [].concat(params[key]);\n\n          for (i = 0; i < arrValue.length; i++) {\n            querystring += encodeURIComponent(key);\n\n            if (arrValue[i] !== true) {\n              querystring += \"=\" + encodeURIComponent(arrValue[i]);\n            }\n\n            querystring += \"&\";\n          }\n        }\n      }\n\n      return location.protocol + \"//\" + location.host + location.pathname + querystring.slice(0, -1);\n    }\n\n    function applyUrlParams() {\n      var i,\n          selectedModules = [],\n          modulesList = id(\"qunit-modulefilter-dropdown-list\").getElementsByTagName(\"input\"),\n          filter = id(\"qunit-filter-input\").value;\n\n      for (i = 0; i < modulesList.length; i++) {\n        if (modulesList[i].checked) {\n          selectedModules.push(modulesList[i].value);\n        }\n      }\n\n      window$1.location = setUrl({\n        filter: filter === \"\" ? undefined : filter,\n        moduleId: selectedModules.length === 0 ? undefined : selectedModules,\n        // Remove module and testId filter\n        module: undefined,\n        testId: undefined\n      });\n    }\n\n    function toolbarUrlConfigContainer() {\n      var urlConfigContainer = document.createElement(\"span\");\n      urlConfigContainer.innerHTML = getUrlConfigHtml();\n      addClass(urlConfigContainer, \"qunit-url-config\");\n      addEvents(urlConfigContainer.getElementsByTagName(\"input\"), \"change\", toolbarChanged);\n      addEvents(urlConfigContainer.getElementsByTagName(\"select\"), \"change\", toolbarChanged);\n      return urlConfigContainer;\n    }\n\n    function abortTestsButton() {\n      var button = document.createElement(\"button\");\n      button.id = \"qunit-abort-tests-button\";\n      button.innerHTML = \"Abort\";\n      addEvent(button, \"click\", abortTests);\n      return button;\n    }\n\n    function toolbarLooseFilter() {\n      var filter = document.createElement(\"form\"),\n          label = document.createElement(\"label\"),\n          input = document.createElement(\"input\"),\n          button = document.createElement(\"button\");\n      addClass(filter, \"qunit-filter\");\n      label.innerHTML = \"Filter: \";\n      input.type = \"text\";\n      input.value = config.filter || \"\";\n      input.name = \"filter\";\n      input.id = \"qunit-filter-input\";\n      button.innerHTML = \"Go\";\n      label.appendChild(input);\n      filter.appendChild(label);\n      filter.appendChild(document.createTextNode(\" \"));\n      filter.appendChild(button);\n      addEvent(filter, \"submit\", interceptNavigation);\n      return filter;\n    }\n\n    function moduleListHtml(modules) {\n      var i,\n          checked,\n          html = \"\";\n\n      for (i = 0; i < modules.length; i++) {\n        if (modules[i].name !== \"\") {\n          checked = config.moduleId.indexOf(modules[i].moduleId) > -1;\n          html += \"<li><label class='clickable\" + (checked ? \" checked\" : \"\") + \"'><input type='checkbox' \" + \"value='\" + modules[i].moduleId + \"'\" + (checked ? \" checked='checked'\" : \"\") + \" />\" + escapeText(modules[i].name) + \"</label></li>\";\n        }\n      }\n\n      return html;\n    }\n\n    function toolbarModuleFilter() {\n      var commit,\n          reset,\n          moduleFilter = document.createElement(\"form\"),\n          label = document.createElement(\"label\"),\n          moduleSearch = document.createElement(\"input\"),\n          dropDown = document.createElement(\"div\"),\n          actions = document.createElement(\"span\"),\n          applyButton = document.createElement(\"button\"),\n          resetButton = document.createElement(\"button\"),\n          allModulesLabel = document.createElement(\"label\"),\n          allCheckbox = document.createElement(\"input\"),\n          dropDownList = document.createElement(\"ul\"),\n          dirty = false;\n      moduleSearch.id = \"qunit-modulefilter-search\";\n      moduleSearch.autocomplete = \"off\";\n      addEvent(moduleSearch, \"input\", searchInput);\n      addEvent(moduleSearch, \"input\", searchFocus);\n      addEvent(moduleSearch, \"focus\", searchFocus);\n      addEvent(moduleSearch, \"click\", searchFocus);\n      config.modules.forEach(function (module) {\n        return module.namePrepared = fuzzysort.prepare(module.name);\n      });\n      label.id = \"qunit-modulefilter-search-container\";\n      label.innerHTML = \"Module: \";\n      label.appendChild(moduleSearch);\n      applyButton.textContent = \"Apply\";\n      applyButton.style.display = \"none\";\n      resetButton.textContent = \"Reset\";\n      resetButton.type = \"reset\";\n      resetButton.style.display = \"none\";\n      allCheckbox.type = \"checkbox\";\n      allCheckbox.checked = config.moduleId.length === 0;\n      allModulesLabel.className = \"clickable\";\n\n      if (config.moduleId.length) {\n        allModulesLabel.className = \"checked\";\n      }\n\n      allModulesLabel.appendChild(allCheckbox);\n      allModulesLabel.appendChild(document.createTextNode(\"All modules\"));\n      actions.id = \"qunit-modulefilter-actions\";\n      actions.appendChild(applyButton);\n      actions.appendChild(resetButton);\n      actions.appendChild(allModulesLabel);\n      commit = actions.firstChild;\n      reset = commit.nextSibling;\n      addEvent(commit, \"click\", applyUrlParams);\n      dropDownList.id = \"qunit-modulefilter-dropdown-list\";\n      dropDownList.innerHTML = moduleListHtml(config.modules);\n      dropDown.id = \"qunit-modulefilter-dropdown\";\n      dropDown.style.display = \"none\";\n      dropDown.appendChild(actions);\n      dropDown.appendChild(dropDownList);\n      addEvent(dropDown, \"change\", selectionChange);\n      selectionChange();\n      moduleFilter.id = \"qunit-modulefilter\";\n      moduleFilter.appendChild(label);\n      moduleFilter.appendChild(dropDown);\n      addEvent(moduleFilter, \"submit\", interceptNavigation);\n      addEvent(moduleFilter, \"reset\", function () {\n        // Let the reset happen, then update styles\n        window$1.setTimeout(selectionChange);\n      }); // Enables show/hide for the dropdown\n\n      function searchFocus() {\n        if (dropDown.style.display !== \"none\") {\n          return;\n        }\n\n        dropDown.style.display = \"block\";\n        addEvent(document, \"click\", hideHandler);\n        addEvent(document, \"keydown\", hideHandler); // Hide on Escape keydown or outside-container click\n\n        function hideHandler(e) {\n          var inContainer = moduleFilter.contains(e.target);\n\n          if (e.keyCode === 27 || !inContainer) {\n            if (e.keyCode === 27 && inContainer) {\n              moduleSearch.focus();\n            }\n\n            dropDown.style.display = \"none\";\n            removeEvent(document, \"click\", hideHandler);\n            removeEvent(document, \"keydown\", hideHandler);\n            moduleSearch.value = \"\";\n            searchInput();\n          }\n        }\n      }\n\n      function filterModules(searchText) {\n        if (searchText === \"\") {\n          return config.modules;\n        }\n\n        return fuzzysort.go(searchText, config.modules, {\n          key: \"namePrepared\",\n          threshold: -10000\n        }).map(function (module) {\n          return module.obj;\n        });\n      } // Processes module search box input\n\n\n      var searchInputTimeout;\n\n      function searchInput() {\n        window$1.clearTimeout(searchInputTimeout);\n        searchInputTimeout = window$1.setTimeout(function () {\n          var searchText = moduleSearch.value.toLowerCase(),\n              filteredModules = filterModules(searchText);\n          dropDownList.innerHTML = moduleListHtml(filteredModules);\n        }, 200);\n      } // Processes selection changes\n\n\n      function selectionChange(evt) {\n        var i,\n            item,\n            checkbox = evt && evt.target || allCheckbox,\n            modulesList = dropDownList.getElementsByTagName(\"input\"),\n            selectedNames = [];\n        toggleClass(checkbox.parentNode, \"checked\", checkbox.checked);\n        dirty = false;\n\n        if (checkbox.checked && checkbox !== allCheckbox) {\n          allCheckbox.checked = false;\n          removeClass(allCheckbox.parentNode, \"checked\");\n        }\n\n        for (i = 0; i < modulesList.length; i++) {\n          item = modulesList[i];\n\n          if (!evt) {\n            toggleClass(item.parentNode, \"checked\", item.checked);\n          } else if (checkbox === allCheckbox && checkbox.checked) {\n            item.checked = false;\n            removeClass(item.parentNode, \"checked\");\n          }\n\n          dirty = dirty || item.checked !== item.defaultChecked;\n\n          if (item.checked) {\n            selectedNames.push(item.parentNode.textContent);\n          }\n        }\n\n        commit.style.display = reset.style.display = dirty ? \"\" : \"none\";\n        moduleSearch.placeholder = selectedNames.join(\", \") || allCheckbox.parentNode.textContent;\n        moduleSearch.title = \"Type to filter list. Current selection:\\n\" + (selectedNames.join(\"\\n\") || allCheckbox.parentNode.textContent);\n      }\n\n      return moduleFilter;\n    }\n\n    function toolbarFilters() {\n      var toolbarFilters = document.createElement(\"span\");\n      toolbarFilters.id = \"qunit-toolbar-filters\";\n      toolbarFilters.appendChild(toolbarLooseFilter());\n      toolbarFilters.appendChild(toolbarModuleFilter());\n      return toolbarFilters;\n    }\n\n    function appendToolbar() {\n      var toolbar = id(\"qunit-testrunner-toolbar\");\n\n      if (toolbar) {\n        toolbar.appendChild(toolbarUrlConfigContainer());\n        toolbar.appendChild(toolbarFilters());\n        toolbar.appendChild(document.createElement(\"div\")).className = \"clearfix\";\n      }\n    }\n\n    function appendHeader() {\n      var header = id(\"qunit-header\");\n\n      if (header) {\n        header.innerHTML = \"<a href='\" + escapeText(unfilteredUrl) + \"'>\" + header.innerHTML + \"</a> \";\n      }\n    }\n\n    function appendBanner() {\n      var banner = id(\"qunit-banner\");\n\n      if (banner) {\n        banner.className = \"\";\n      }\n    }\n\n    function appendTestResults() {\n      var tests = id(\"qunit-tests\"),\n          result = id(\"qunit-testresult\"),\n          controls;\n\n      if (result) {\n        result.parentNode.removeChild(result);\n      }\n\n      if (tests) {\n        tests.innerHTML = \"\";\n        result = document.createElement(\"p\");\n        result.id = \"qunit-testresult\";\n        result.className = \"result\";\n        tests.parentNode.insertBefore(result, tests);\n        result.innerHTML = \"<div id=\\\"qunit-testresult-display\\\">Running...<br />&#160;</div>\" + \"<div id=\\\"qunit-testresult-controls\\\"></div>\" + \"<div class=\\\"clearfix\\\"></div>\";\n        controls = id(\"qunit-testresult-controls\");\n      }\n\n      if (controls) {\n        controls.appendChild(abortTestsButton());\n      }\n    }\n\n    function appendFilteredTest() {\n      var testId = QUnit.config.testId;\n\n      if (!testId || testId.length <= 0) {\n        return \"\";\n      }\n\n      return \"<div id='qunit-filteredTest'>Rerunning selected tests: \" + escapeText(testId.join(\", \")) + \" <a id='qunit-clearFilter' href='\" + escapeText(unfilteredUrl) + \"'>Run all tests</a></div>\";\n    }\n\n    function appendUserAgent() {\n      var userAgent = id(\"qunit-userAgent\");\n\n      if (userAgent) {\n        userAgent.innerHTML = \"\";\n        userAgent.appendChild(document.createTextNode(\"QUnit \" + QUnit.version + \"; \" + navigator.userAgent));\n      }\n    }\n\n    function appendInterface() {\n      var qunit = id(\"qunit\"); // For compat with QUnit 1.2, and to support fully custom theme HTML,\n      // we will use any existing elements if no id=\"qunit\" element exists.\n      //\n      // Note that we don't fail or fallback to creating it ourselves,\n      // because not having id=\"qunit\" (and not having the below elements)\n      // simply means QUnit acts headless, allowing users to use their own\n      // reporters, or for a test runner to listen for events directly without\n      // having the HTML reporter actively render anything.\n\n      if (qunit) {\n        qunit.setAttribute(\"role\", \"main\"); // Since QUnit 1.3, these are created automatically if the page\n        // contains id=\"qunit\".\n\n        qunit.innerHTML = \"<h1 id='qunit-header'>\" + escapeText(document.title) + \"</h1>\" + \"<h2 id='qunit-banner'></h2>\" + \"<div id='qunit-testrunner-toolbar' role='navigation'></div>\" + appendFilteredTest() + \"<h2 id='qunit-userAgent'></h2>\" + \"<ol id='qunit-tests'></ol>\";\n      }\n\n      appendHeader();\n      appendBanner();\n      appendTestResults();\n      appendUserAgent();\n      appendToolbar();\n    }\n\n    function appendTest(name, testId, moduleName) {\n      var title,\n          rerunTrigger,\n          testBlock,\n          assertList,\n          tests = id(\"qunit-tests\");\n\n      if (!tests) {\n        return;\n      }\n\n      title = document.createElement(\"strong\");\n      title.innerHTML = getNameHtml(name, moduleName);\n      rerunTrigger = document.createElement(\"a\");\n      rerunTrigger.innerHTML = \"Rerun\";\n      rerunTrigger.href = setUrl({\n        testId: testId\n      });\n      testBlock = document.createElement(\"li\");\n      testBlock.appendChild(title);\n      testBlock.appendChild(rerunTrigger);\n      testBlock.id = \"qunit-test-output-\" + testId;\n      assertList = document.createElement(\"ol\");\n      assertList.className = \"qunit-assert-list\";\n      testBlock.appendChild(assertList);\n      tests.appendChild(testBlock);\n    } // HTML Reporter initialization and load\n\n\n    QUnit.begin(function () {\n      // Initialize QUnit elements\n      appendInterface();\n    });\n    QUnit.done(function (details) {\n      var banner = id(\"qunit-banner\"),\n          tests = id(\"qunit-tests\"),\n          abortButton = id(\"qunit-abort-tests-button\"),\n          totalTests = stats.passedTests + stats.skippedTests + stats.todoTests + stats.failedTests,\n          html = [totalTests, \" tests completed in \", details.runtime, \" milliseconds, with \", stats.failedTests, \" failed, \", stats.skippedTests, \" skipped, and \", stats.todoTests, \" todo.<br />\", \"<span class='passed'>\", details.passed, \"</span> assertions of <span class='total'>\", details.total, \"</span> passed, <span class='failed'>\", details.failed, \"</span> failed.\"].join(\"\"),\n          test,\n          assertLi,\n          assertList; // Update remaining tests to aborted\n\n      if (abortButton && abortButton.disabled) {\n        html = \"Tests aborted after \" + details.runtime + \" milliseconds.\";\n\n        for (var i = 0; i < tests.children.length; i++) {\n          test = tests.children[i];\n\n          if (test.className === \"\" || test.className === \"running\") {\n            test.className = \"aborted\";\n            assertList = test.getElementsByTagName(\"ol\")[0];\n            assertLi = document.createElement(\"li\");\n            assertLi.className = \"fail\";\n            assertLi.innerHTML = \"Test aborted.\";\n            assertList.appendChild(assertLi);\n          }\n        }\n      }\n\n      if (banner && (!abortButton || abortButton.disabled === false)) {\n        banner.className = stats.failedTests ? \"qunit-fail\" : \"qunit-pass\";\n      }\n\n      if (abortButton) {\n        abortButton.parentNode.removeChild(abortButton);\n      }\n\n      if (tests) {\n        id(\"qunit-testresult-display\").innerHTML = html;\n      }\n\n      if (config.altertitle && document.title) {\n        // Show ✖ for good, ✔ for bad suite result in title\n        // use escape sequences in case file gets loaded with non-utf-8\n        // charset\n        document.title = [stats.failedTests ? \"\\u2716\" : \"\\u2714\", document.title.replace(/^[\\u2714\\u2716] /i, \"\")].join(\" \");\n      } // Scroll back to top to show results\n\n\n      if (config.scrolltop && window$1.scrollTo) {\n        window$1.scrollTo(0, 0);\n      }\n    });\n\n    function getNameHtml(name, module) {\n      var nameHtml = \"\";\n\n      if (module) {\n        nameHtml = \"<span class='module-name'>\" + escapeText(module) + \"</span>: \";\n      }\n\n      nameHtml += \"<span class='test-name'>\" + escapeText(name) + \"</span>\";\n      return nameHtml;\n    }\n\n    function getProgressHtml(runtime, stats, total) {\n      var completed = stats.passedTests + stats.skippedTests + stats.todoTests + stats.failedTests;\n      return [\"<br />\", completed, \" / \", total, \" tests completed in \", runtime, \" milliseconds, with \", stats.failedTests, \" failed, \", stats.skippedTests, \" skipped, and \", stats.todoTests, \" todo.\"].join(\"\");\n    }\n\n    QUnit.testStart(function (details) {\n      var running, bad;\n      appendTest(details.name, details.testId, details.module);\n      running = id(\"qunit-testresult-display\");\n\n      if (running) {\n        addClass(running, \"running\");\n        bad = QUnit.config.reorder && details.previousFailure;\n        running.innerHTML = [bad ? \"Rerunning previously failed test: <br />\" : \"Running: <br />\", getNameHtml(details.name, details.module), getProgressHtml(now() - config.started, stats, Test.count)].join(\"\");\n      }\n    });\n\n    function stripHtml(string) {\n      // Strip tags, html entity and whitespaces\n      return string.replace(/<\\/?[^>]+(>|$)/g, \"\").replace(/&quot;/g, \"\").replace(/\\s+/g, \"\");\n    }\n\n    QUnit.log(function (details) {\n      var assertList,\n          assertLi,\n          message,\n          expected,\n          actual,\n          diff,\n          showDiff = false,\n          testItem = id(\"qunit-test-output-\" + details.testId);\n\n      if (!testItem) {\n        return;\n      }\n\n      message = escapeText(details.message) || (details.result ? \"okay\" : \"failed\");\n      message = \"<span class='test-message'>\" + message + \"</span>\";\n      message += \"<span class='runtime'>@ \" + details.runtime + \" ms</span>\"; // The pushFailure doesn't provide details.expected\n      // when it calls, it's implicit to also not show expected and diff stuff\n      // Also, we need to check details.expected existence, as it can exist and be undefined\n\n      if (!details.result && hasOwn.call(details, \"expected\")) {\n        if (details.negative) {\n          expected = \"NOT \" + QUnit.dump.parse(details.expected);\n        } else {\n          expected = QUnit.dump.parse(details.expected);\n        }\n\n        actual = QUnit.dump.parse(details.actual);\n        message += \"<table><tr class='test-expected'><th>Expected: </th><td><pre>\" + escapeText(expected) + \"</pre></td></tr>\";\n\n        if (actual !== expected) {\n          message += \"<tr class='test-actual'><th>Result: </th><td><pre>\" + escapeText(actual) + \"</pre></td></tr>\";\n\n          if (typeof details.actual === \"number\" && typeof details.expected === \"number\") {\n            if (!isNaN(details.actual) && !isNaN(details.expected)) {\n              showDiff = true;\n              diff = details.actual - details.expected;\n              diff = (diff > 0 ? \"+\" : \"\") + diff;\n            }\n          } else if (typeof details.actual !== \"boolean\" && typeof details.expected !== \"boolean\") {\n            diff = QUnit.diff(expected, actual); // don't show diff if there is zero overlap\n\n            showDiff = stripHtml(diff).length !== stripHtml(expected).length + stripHtml(actual).length;\n          }\n\n          if (showDiff) {\n            message += \"<tr class='test-diff'><th>Diff: </th><td><pre>\" + diff + \"</pre></td></tr>\";\n          }\n        } else if (expected.indexOf(\"[object Array]\") !== -1 || expected.indexOf(\"[object Object]\") !== -1) {\n          message += \"<tr class='test-message'><th>Message: </th><td>\" + \"Diff suppressed as the depth of object is more than current max depth (\" + QUnit.config.maxDepth + \").<p>Hint: Use <code>QUnit.dump.maxDepth</code> to \" + \" run with a higher max depth or <a href='\" + escapeText(setUrl({\n            maxDepth: -1\n          })) + \"'>\" + \"Rerun</a> without max depth.</p></td></tr>\";\n        } else {\n          message += \"<tr class='test-message'><th>Message: </th><td>\" + \"Diff suppressed as the expected and actual results have an equivalent\" + \" serialization</td></tr>\";\n        }\n\n        if (details.source) {\n          message += \"<tr class='test-source'><th>Source: </th><td><pre>\" + escapeText(details.source) + \"</pre></td></tr>\";\n        }\n\n        message += \"</table>\"; // This occurs when pushFailure is set and we have an extracted stack trace\n      } else if (!details.result && details.source) {\n        message += \"<table>\" + \"<tr class='test-source'><th>Source: </th><td><pre>\" + escapeText(details.source) + \"</pre></td></tr>\" + \"</table>\";\n      }\n\n      assertList = testItem.getElementsByTagName(\"ol\")[0];\n      assertLi = document.createElement(\"li\");\n      assertLi.className = details.result ? \"pass\" : \"fail\";\n      assertLi.innerHTML = message;\n      assertList.appendChild(assertLi);\n    });\n    QUnit.testDone(function (details) {\n      var testTitle,\n          time,\n          testItem,\n          assertList,\n          status,\n          good,\n          bad,\n          testCounts,\n          skipped,\n          sourceName,\n          tests = id(\"qunit-tests\");\n\n      if (!tests) {\n        return;\n      }\n\n      testItem = id(\"qunit-test-output-\" + details.testId);\n      removeClass(testItem, \"running\");\n\n      if (details.failed > 0) {\n        status = \"failed\";\n      } else if (details.todo) {\n        status = \"todo\";\n      } else {\n        status = details.skipped ? \"skipped\" : \"passed\";\n      }\n\n      assertList = testItem.getElementsByTagName(\"ol\")[0];\n      good = details.passed;\n      bad = details.failed; // This test passed if it has no unexpected failed assertions\n\n      var testPassed = details.failed > 0 ? details.todo : !details.todo;\n\n      if (testPassed) {\n        // Collapse the passing tests\n        addClass(assertList, \"qunit-collapsed\");\n      } else if (config.collapse) {\n        if (!collapseNext) {\n          // Skip collapsing the first failing test\n          collapseNext = true;\n        } else {\n          // Collapse remaining tests\n          addClass(assertList, \"qunit-collapsed\");\n        }\n      } // The testItem.firstChild is the test name\n\n\n      testTitle = testItem.firstChild;\n      testCounts = bad ? \"<b class='failed'>\" + bad + \"</b>, \" + \"<b class='passed'>\" + good + \"</b>, \" : \"\";\n      testTitle.innerHTML += \" <b class='counts'>(\" + testCounts + details.assertions.length + \")</b>\";\n\n      if (details.skipped) {\n        stats.skippedTests++;\n        testItem.className = \"skipped\";\n        skipped = document.createElement(\"em\");\n        skipped.className = \"qunit-skipped-label\";\n        skipped.innerHTML = \"skipped\";\n        testItem.insertBefore(skipped, testTitle);\n      } else {\n        addEvent(testTitle, \"click\", function () {\n          toggleClass(assertList, \"qunit-collapsed\");\n        });\n        testItem.className = testPassed ? \"pass\" : \"fail\";\n\n        if (details.todo) {\n          var todoLabel = document.createElement(\"em\");\n          todoLabel.className = \"qunit-todo-label\";\n          todoLabel.innerHTML = \"todo\";\n          testItem.className += \" todo\";\n          testItem.insertBefore(todoLabel, testTitle);\n        }\n\n        time = document.createElement(\"span\");\n        time.className = \"runtime\";\n        time.innerHTML = details.runtime + \" ms\";\n        testItem.insertBefore(time, assertList);\n\n        if (!testPassed) {\n          stats.failedTests++;\n        } else if (details.todo) {\n          stats.todoTests++;\n        } else {\n          stats.passedTests++;\n        }\n      } // Show the source of the test when showing assertions\n\n\n      if (details.source) {\n        sourceName = document.createElement(\"p\");\n        sourceName.innerHTML = \"<strong>Source: </strong>\" + escapeText(details.source);\n        addClass(sourceName, \"qunit-source\");\n\n        if (testPassed) {\n          addClass(sourceName, \"qunit-collapsed\");\n        }\n\n        addEvent(testTitle, \"click\", function () {\n          toggleClass(sourceName, \"qunit-collapsed\");\n        });\n        testItem.appendChild(sourceName);\n      }\n\n      if (config.hidepassed && (status === \"passed\" || details.skipped)) {\n        // use removeChild instead of remove because of support\n        hiddenTests.push(testItem);\n        tests.removeChild(testItem);\n      }\n    }); // Avoid readyState issue with phantomjs\n    // Ref: #818\n\n    var usingPhantom = function (p) {\n      return p && p.version && p.version.major > 0;\n    }(window$1.phantom);\n\n    if (usingPhantom) {\n      console$1.warn(\"Support for PhantomJS is deprecated and will be removed in QUnit 3.0.\");\n    }\n\n    if (!usingPhantom && document.readyState === \"complete\") {\n      QUnit.load();\n    } else {\n      addEvent(window$1, \"load\", QUnit.load);\n    } // Wrap window.onerror. We will call the original window.onerror to see if\n    // the existing handler fully handles the error; if not, we will call the\n    // QUnit.onError function.\n\n\n    var originalWindowOnError = window$1.onerror; // Cover uncaught exceptions\n    // Returning true will suppress the default browser handler,\n    // returning false will let it run.\n\n    window$1.onerror = function (message, fileName, lineNumber, columnNumber, errorObj) {\n      var ret = false;\n\n      if (originalWindowOnError) {\n        for (var _len = arguments.length, args = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {\n          args[_key - 5] = arguments[_key];\n        }\n\n        ret = originalWindowOnError.call.apply(originalWindowOnError, [this, message, fileName, lineNumber, columnNumber, errorObj].concat(args));\n      } // Treat return value as window.onerror itself does,\n      // Only do our handling if not suppressed.\n\n\n      if (ret !== true) {\n        var error = {\n          message: message,\n          fileName: fileName,\n          lineNumber: lineNumber\n        }; // According to\n        // https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror,\n        // most modern browsers support an errorObj argument; use that to\n        // get a full stack trace if it's available.\n\n        if (errorObj && errorObj.stack) {\n          error.stacktrace = extractStacktrace(errorObj, 0);\n        }\n\n        ret = QUnit.onError(error);\n      }\n\n      return ret;\n    }; // Listen for unhandled rejections, and call QUnit.onUnhandledRejection\n\n\n    window$1.addEventListener(\"unhandledrejection\", function (event) {\n      QUnit.onUnhandledRejection(event.reason);\n    });\n  })();\n  /*\n   * This file is a modified version of google-diff-match-patch's JavaScript implementation\n   * (https://code.google.com/p/google-diff-match-patch/source/browse/trunk/javascript/diff_match_patch_uncompressed.js),\n   * modifications are licensed as more fully set forth in LICENSE.txt.\n   *\n   * The original source of google-diff-match-patch is attributable and licensed as follows:\n   *\n   * Copyright 2006 Google Inc.\n   * https://code.google.com/p/google-diff-match-patch/\n   *\n   * Licensed under the Apache License, Version 2.0 (the \"License\");\n   * you may not use this file except in compliance with the License.\n   * You may obtain a copy of the License at\n   *\n   * https://www.apache.org/licenses/LICENSE-2.0\n   *\n   * Unless required by applicable law or agreed to in writing, software\n   * distributed under the License is distributed on an \"AS IS\" BASIS,\n   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n   * See the License for the specific language governing permissions and\n   * limitations under the License.\n   *\n   * More Info:\n   *  https://code.google.com/p/google-diff-match-patch/\n   *\n   * Usage: QUnit.diff(expected, actual)\n   *\n   */\n\n\n  QUnit.diff = function () {\n    function DiffMatchPatch() {} //  DIFF FUNCTIONS\n\n    /**\n     * The data structure representing a diff is an array of tuples:\n     * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]\n     * which means: delete 'Hello', add 'Goodbye' and keep ' world.'\n     */\n\n\n    var DIFF_DELETE = -1,\n        DIFF_INSERT = 1,\n        DIFF_EQUAL = 0,\n        hasOwn = Object.prototype.hasOwnProperty;\n    /**\n     * Find the differences between two texts.  Simplifies the problem by stripping\n     * any common prefix or suffix off the texts before diffing.\n     * @param {string} text1 Old string to be diffed.\n     * @param {string} text2 New string to be diffed.\n     * @param {boolean=} optChecklines Optional speedup flag. If present and false,\n     *     then don't run a line-level diff first to identify the changed areas.\n     *     Defaults to true, which does a faster, slightly less optimal diff.\n     * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.\n     */\n\n    DiffMatchPatch.prototype.DiffMain = function (text1, text2, optChecklines) {\n      var deadline, checklines, commonlength, commonprefix, commonsuffix, diffs; // The diff must be complete in up to 1 second.\n\n      deadline = new Date().getTime() + 1000; // Check for null inputs.\n\n      if (text1 === null || text2 === null) {\n        throw new Error(\"Null input. (DiffMain)\");\n      } // Check for equality (speedup).\n\n\n      if (text1 === text2) {\n        if (text1) {\n          return [[DIFF_EQUAL, text1]];\n        }\n\n        return [];\n      }\n\n      if (typeof optChecklines === \"undefined\") {\n        optChecklines = true;\n      }\n\n      checklines = optChecklines; // Trim off common prefix (speedup).\n\n      commonlength = this.diffCommonPrefix(text1, text2);\n      commonprefix = text1.substring(0, commonlength);\n      text1 = text1.substring(commonlength);\n      text2 = text2.substring(commonlength); // Trim off common suffix (speedup).\n\n      commonlength = this.diffCommonSuffix(text1, text2);\n      commonsuffix = text1.substring(text1.length - commonlength);\n      text1 = text1.substring(0, text1.length - commonlength);\n      text2 = text2.substring(0, text2.length - commonlength); // Compute the diff on the middle block.\n\n      diffs = this.diffCompute(text1, text2, checklines, deadline); // Restore the prefix and suffix.\n\n      if (commonprefix) {\n        diffs.unshift([DIFF_EQUAL, commonprefix]);\n      }\n\n      if (commonsuffix) {\n        diffs.push([DIFF_EQUAL, commonsuffix]);\n      }\n\n      this.diffCleanupMerge(diffs);\n      return diffs;\n    };\n    /**\n     * Reduce the number of edits by eliminating operationally trivial equalities.\n     * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.\n     */\n\n\n    DiffMatchPatch.prototype.diffCleanupEfficiency = function (diffs) {\n      var changes, equalities, equalitiesLength, lastequality, pointer, preIns, preDel, postIns, postDel;\n      changes = false;\n      equalities = []; // Stack of indices where equalities are found.\n\n      equalitiesLength = 0; // Keeping our own length var is faster in JS.\n\n      /** @type {?string} */\n\n      lastequality = null; // Always equal to diffs[equalities[equalitiesLength - 1]][1]\n\n      pointer = 0; // Index of current position.\n      // Is there an insertion operation before the last equality.\n\n      preIns = false; // Is there a deletion operation before the last equality.\n\n      preDel = false; // Is there an insertion operation after the last equality.\n\n      postIns = false; // Is there a deletion operation after the last equality.\n\n      postDel = false;\n\n      while (pointer < diffs.length) {\n        // Equality found.\n        if (diffs[pointer][0] === DIFF_EQUAL) {\n          if (diffs[pointer][1].length < 4 && (postIns || postDel)) {\n            // Candidate found.\n            equalities[equalitiesLength++] = pointer;\n            preIns = postIns;\n            preDel = postDel;\n            lastequality = diffs[pointer][1];\n          } else {\n            // Not a candidate, and can never become one.\n            equalitiesLength = 0;\n            lastequality = null;\n          }\n\n          postIns = postDel = false; // An insertion or deletion.\n        } else {\n          if (diffs[pointer][0] === DIFF_DELETE) {\n            postDel = true;\n          } else {\n            postIns = true;\n          }\n          /*\n           * Five types to be split:\n           * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>\n           * <ins>A</ins>X<ins>C</ins><del>D</del>\n           * <ins>A</ins><del>B</del>X<ins>C</ins>\n           * <ins>A</del>X<ins>C</ins><del>D</del>\n           * <ins>A</ins><del>B</del>X<del>C</del>\n           */\n\n\n          if (lastequality && (preIns && preDel && postIns && postDel || lastequality.length < 2 && preIns + preDel + postIns + postDel === 3)) {\n            // Duplicate record.\n            diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]); // Change second copy to insert.\n\n            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;\n            equalitiesLength--; // Throw away the equality we just deleted;\n\n            lastequality = null;\n\n            if (preIns && preDel) {\n              // No changes made which could affect previous entry, keep going.\n              postIns = postDel = true;\n              equalitiesLength = 0;\n            } else {\n              equalitiesLength--; // Throw away the previous equality.\n\n              pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;\n              postIns = postDel = false;\n            }\n\n            changes = true;\n          }\n        }\n\n        pointer++;\n      }\n\n      if (changes) {\n        this.diffCleanupMerge(diffs);\n      }\n    };\n    /**\n     * Convert a diff array into a pretty HTML report.\n     * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.\n     * @param {integer} string to be beautified.\n     * @return {string} HTML representation.\n     */\n\n\n    DiffMatchPatch.prototype.diffPrettyHtml = function (diffs) {\n      var op,\n          data,\n          x,\n          html = [];\n\n      for (x = 0; x < diffs.length; x++) {\n        op = diffs[x][0]; // Operation (insert, delete, equal)\n\n        data = diffs[x][1]; // Text of change.\n\n        switch (op) {\n          case DIFF_INSERT:\n            html[x] = \"<ins>\" + escapeText(data) + \"</ins>\";\n            break;\n\n          case DIFF_DELETE:\n            html[x] = \"<del>\" + escapeText(data) + \"</del>\";\n            break;\n\n          case DIFF_EQUAL:\n            html[x] = \"<span>\" + escapeText(data) + \"</span>\";\n            break;\n        }\n      }\n\n      return html.join(\"\");\n    };\n    /**\n     * Determine the common prefix of two strings.\n     * @param {string} text1 First string.\n     * @param {string} text2 Second string.\n     * @return {number} The number of characters common to the start of each\n     *     string.\n     */\n\n\n    DiffMatchPatch.prototype.diffCommonPrefix = function (text1, text2) {\n      var pointermid, pointermax, pointermin, pointerstart; // Quick check for common null cases.\n\n      if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {\n        return 0;\n      } // Binary search.\n      // Performance analysis: https://neil.fraser.name/news/2007/10/09/\n\n\n      pointermin = 0;\n      pointermax = Math.min(text1.length, text2.length);\n      pointermid = pointermax;\n      pointerstart = 0;\n\n      while (pointermin < pointermid) {\n        if (text1.substring(pointerstart, pointermid) === text2.substring(pointerstart, pointermid)) {\n          pointermin = pointermid;\n          pointerstart = pointermin;\n        } else {\n          pointermax = pointermid;\n        }\n\n        pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);\n      }\n\n      return pointermid;\n    };\n    /**\n     * Determine the common suffix of two strings.\n     * @param {string} text1 First string.\n     * @param {string} text2 Second string.\n     * @return {number} The number of characters common to the end of each string.\n     */\n\n\n    DiffMatchPatch.prototype.diffCommonSuffix = function (text1, text2) {\n      var pointermid, pointermax, pointermin, pointerend; // Quick check for common null cases.\n\n      if (!text1 || !text2 || text1.charAt(text1.length - 1) !== text2.charAt(text2.length - 1)) {\n        return 0;\n      } // Binary search.\n      // Performance analysis: https://neil.fraser.name/news/2007/10/09/\n\n\n      pointermin = 0;\n      pointermax = Math.min(text1.length, text2.length);\n      pointermid = pointermax;\n      pointerend = 0;\n\n      while (pointermin < pointermid) {\n        if (text1.substring(text1.length - pointermid, text1.length - pointerend) === text2.substring(text2.length - pointermid, text2.length - pointerend)) {\n          pointermin = pointermid;\n          pointerend = pointermin;\n        } else {\n          pointermax = pointermid;\n        }\n\n        pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);\n      }\n\n      return pointermid;\n    };\n    /**\n     * Find the differences between two texts.  Assumes that the texts do not\n     * have any common prefix or suffix.\n     * @param {string} text1 Old string to be diffed.\n     * @param {string} text2 New string to be diffed.\n     * @param {boolean} checklines Speedup flag.  If false, then don't run a\n     *     line-level diff first to identify the changed areas.\n     *     If true, then run a faster, slightly less optimal diff.\n     * @param {number} deadline Time when the diff should be complete by.\n     * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffCompute = function (text1, text2, checklines, deadline) {\n      var diffs, longtext, shorttext, i, hm, text1A, text2A, text1B, text2B, midCommon, diffsA, diffsB;\n\n      if (!text1) {\n        // Just add some text (speedup).\n        return [[DIFF_INSERT, text2]];\n      }\n\n      if (!text2) {\n        // Just delete some text (speedup).\n        return [[DIFF_DELETE, text1]];\n      }\n\n      longtext = text1.length > text2.length ? text1 : text2;\n      shorttext = text1.length > text2.length ? text2 : text1;\n      i = longtext.indexOf(shorttext);\n\n      if (i !== -1) {\n        // Shorter text is inside the longer text (speedup).\n        diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]]; // Swap insertions for deletions if diff is reversed.\n\n        if (text1.length > text2.length) {\n          diffs[0][0] = diffs[2][0] = DIFF_DELETE;\n        }\n\n        return diffs;\n      }\n\n      if (shorttext.length === 1) {\n        // Single character string.\n        // After the previous speedup, the character can't be an equality.\n        return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];\n      } // Check to see if the problem can be split in two.\n\n\n      hm = this.diffHalfMatch(text1, text2);\n\n      if (hm) {\n        // A half-match was found, sort out the return data.\n        text1A = hm[0];\n        text1B = hm[1];\n        text2A = hm[2];\n        text2B = hm[3];\n        midCommon = hm[4]; // Send both pairs off for separate processing.\n\n        diffsA = this.DiffMain(text1A, text2A, checklines, deadline);\n        diffsB = this.DiffMain(text1B, text2B, checklines, deadline); // Merge the results.\n\n        return diffsA.concat([[DIFF_EQUAL, midCommon]], diffsB);\n      }\n\n      if (checklines && text1.length > 100 && text2.length > 100) {\n        return this.diffLineMode(text1, text2, deadline);\n      }\n\n      return this.diffBisect(text1, text2, deadline);\n    };\n    /**\n     * Do the two texts share a substring which is at least half the length of the\n     * longer text?\n     * This speedup can produce non-minimal diffs.\n     * @param {string} text1 First string.\n     * @param {string} text2 Second string.\n     * @return {Array.<string>} Five element Array, containing the prefix of\n     *     text1, the suffix of text1, the prefix of text2, the suffix of\n     *     text2 and the common middle.  Or null if there was no match.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffHalfMatch = function (text1, text2) {\n      var longtext, shorttext, dmp, text1A, text2B, text2A, text1B, midCommon, hm1, hm2, hm;\n      longtext = text1.length > text2.length ? text1 : text2;\n      shorttext = text1.length > text2.length ? text2 : text1;\n\n      if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {\n        return null; // Pointless.\n      }\n\n      dmp = this; // 'this' becomes 'window' in a closure.\n\n      /**\n       * Does a substring of shorttext exist within longtext such that the substring\n       * is at least half the length of longtext?\n       * Closure, but does not reference any external variables.\n       * @param {string} longtext Longer string.\n       * @param {string} shorttext Shorter string.\n       * @param {number} i Start index of quarter length substring within longtext.\n       * @return {Array.<string>} Five element Array, containing the prefix of\n       *     longtext, the suffix of longtext, the prefix of shorttext, the suffix\n       *     of shorttext and the common middle.  Or null if there was no match.\n       * @private\n       */\n\n      function diffHalfMatchI(longtext, shorttext, i) {\n        var seed, j, bestCommon, prefixLength, suffixLength, bestLongtextA, bestLongtextB, bestShorttextA, bestShorttextB; // Start with a 1/4 length substring at position i as a seed.\n\n        seed = longtext.substring(i, i + Math.floor(longtext.length / 4));\n        j = -1;\n        bestCommon = \"\";\n\n        while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {\n          prefixLength = dmp.diffCommonPrefix(longtext.substring(i), shorttext.substring(j));\n          suffixLength = dmp.diffCommonSuffix(longtext.substring(0, i), shorttext.substring(0, j));\n\n          if (bestCommon.length < suffixLength + prefixLength) {\n            bestCommon = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);\n            bestLongtextA = longtext.substring(0, i - suffixLength);\n            bestLongtextB = longtext.substring(i + prefixLength);\n            bestShorttextA = shorttext.substring(0, j - suffixLength);\n            bestShorttextB = shorttext.substring(j + prefixLength);\n          }\n        }\n\n        if (bestCommon.length * 2 >= longtext.length) {\n          return [bestLongtextA, bestLongtextB, bestShorttextA, bestShorttextB, bestCommon];\n        } else {\n          return null;\n        }\n      } // First check if the second quarter is the seed for a half-match.\n\n\n      hm1 = diffHalfMatchI(longtext, shorttext, Math.ceil(longtext.length / 4)); // Check again based on the third quarter.\n\n      hm2 = diffHalfMatchI(longtext, shorttext, Math.ceil(longtext.length / 2));\n\n      if (!hm1 && !hm2) {\n        return null;\n      } else if (!hm2) {\n        hm = hm1;\n      } else if (!hm1) {\n        hm = hm2;\n      } else {\n        // Both matched.  Select the longest.\n        hm = hm1[4].length > hm2[4].length ? hm1 : hm2;\n      } // A half-match was found, sort out the return data.\n\n\n      if (text1.length > text2.length) {\n        text1A = hm[0];\n        text1B = hm[1];\n        text2A = hm[2];\n        text2B = hm[3];\n      } else {\n        text2A = hm[0];\n        text2B = hm[1];\n        text1A = hm[2];\n        text1B = hm[3];\n      }\n\n      midCommon = hm[4];\n      return [text1A, text1B, text2A, text2B, midCommon];\n    };\n    /**\n     * Do a quick line-level diff on both strings, then rediff the parts for\n     * greater accuracy.\n     * This speedup can produce non-minimal diffs.\n     * @param {string} text1 Old string to be diffed.\n     * @param {string} text2 New string to be diffed.\n     * @param {number} deadline Time when the diff should be complete by.\n     * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffLineMode = function (text1, text2, deadline) {\n      var a, diffs, linearray, pointer, countInsert, countDelete, textInsert, textDelete, j; // Scan the text on a line-by-line basis first.\n\n      a = this.diffLinesToChars(text1, text2);\n      text1 = a.chars1;\n      text2 = a.chars2;\n      linearray = a.lineArray;\n      diffs = this.DiffMain(text1, text2, false, deadline); // Convert the diff back to original text.\n\n      this.diffCharsToLines(diffs, linearray); // Eliminate freak matches (e.g. blank lines)\n\n      this.diffCleanupSemantic(diffs); // Rediff any replacement blocks, this time character-by-character.\n      // Add a dummy entry at the end.\n\n      diffs.push([DIFF_EQUAL, \"\"]);\n      pointer = 0;\n      countDelete = 0;\n      countInsert = 0;\n      textDelete = \"\";\n      textInsert = \"\";\n\n      while (pointer < diffs.length) {\n        switch (diffs[pointer][0]) {\n          case DIFF_INSERT:\n            countInsert++;\n            textInsert += diffs[pointer][1];\n            break;\n\n          case DIFF_DELETE:\n            countDelete++;\n            textDelete += diffs[pointer][1];\n            break;\n\n          case DIFF_EQUAL:\n            // Upon reaching an equality, check for prior redundancies.\n            if (countDelete >= 1 && countInsert >= 1) {\n              // Delete the offending records and add the merged ones.\n              diffs.splice(pointer - countDelete - countInsert, countDelete + countInsert);\n              pointer = pointer - countDelete - countInsert;\n              a = this.DiffMain(textDelete, textInsert, false, deadline);\n\n              for (j = a.length - 1; j >= 0; j--) {\n                diffs.splice(pointer, 0, a[j]);\n              }\n\n              pointer = pointer + a.length;\n            }\n\n            countInsert = 0;\n            countDelete = 0;\n            textDelete = \"\";\n            textInsert = \"\";\n            break;\n        }\n\n        pointer++;\n      }\n\n      diffs.pop(); // Remove the dummy entry at the end.\n\n      return diffs;\n    };\n    /**\n     * Find the 'middle snake' of a diff, split the problem in two\n     * and return the recursively constructed diff.\n     * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.\n     * @param {string} text1 Old string to be diffed.\n     * @param {string} text2 New string to be diffed.\n     * @param {number} deadline Time at which to bail if not yet complete.\n     * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffBisect = function (text1, text2, deadline) {\n      var text1Length, text2Length, maxD, vOffset, vLength, v1, v2, x, delta, front, k1start, k1end, k2start, k2end, k2Offset, k1Offset, x1, x2, y1, y2, d, k1, k2; // Cache the text lengths to prevent multiple calls.\n\n      text1Length = text1.length;\n      text2Length = text2.length;\n      maxD = Math.ceil((text1Length + text2Length) / 2);\n      vOffset = maxD;\n      vLength = 2 * maxD;\n      v1 = new Array(vLength);\n      v2 = new Array(vLength); // Setting all elements to -1 is faster in Chrome & Firefox than mixing\n      // integers and undefined.\n\n      for (x = 0; x < vLength; x++) {\n        v1[x] = -1;\n        v2[x] = -1;\n      }\n\n      v1[vOffset + 1] = 0;\n      v2[vOffset + 1] = 0;\n      delta = text1Length - text2Length; // If the total number of characters is odd, then the front path will collide\n      // with the reverse path.\n\n      front = delta % 2 !== 0; // Offsets for start and end of k loop.\n      // Prevents mapping of space beyond the grid.\n\n      k1start = 0;\n      k1end = 0;\n      k2start = 0;\n      k2end = 0;\n\n      for (d = 0; d < maxD; d++) {\n        // Bail out if deadline is reached.\n        if (new Date().getTime() > deadline) {\n          break;\n        } // Walk the front path one step.\n\n\n        for (k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {\n          k1Offset = vOffset + k1;\n\n          if (k1 === -d || k1 !== d && v1[k1Offset - 1] < v1[k1Offset + 1]) {\n            x1 = v1[k1Offset + 1];\n          } else {\n            x1 = v1[k1Offset - 1] + 1;\n          }\n\n          y1 = x1 - k1;\n\n          while (x1 < text1Length && y1 < text2Length && text1.charAt(x1) === text2.charAt(y1)) {\n            x1++;\n            y1++;\n          }\n\n          v1[k1Offset] = x1;\n\n          if (x1 > text1Length) {\n            // Ran off the right of the graph.\n            k1end += 2;\n          } else if (y1 > text2Length) {\n            // Ran off the bottom of the graph.\n            k1start += 2;\n          } else if (front) {\n            k2Offset = vOffset + delta - k1;\n\n            if (k2Offset >= 0 && k2Offset < vLength && v2[k2Offset] !== -1) {\n              // Mirror x2 onto top-left coordinate system.\n              x2 = text1Length - v2[k2Offset];\n\n              if (x1 >= x2) {\n                // Overlap detected.\n                return this.diffBisectSplit(text1, text2, x1, y1, deadline);\n              }\n            }\n          }\n        } // Walk the reverse path one step.\n\n\n        for (k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {\n          k2Offset = vOffset + k2;\n\n          if (k2 === -d || k2 !== d && v2[k2Offset - 1] < v2[k2Offset + 1]) {\n            x2 = v2[k2Offset + 1];\n          } else {\n            x2 = v2[k2Offset - 1] + 1;\n          }\n\n          y2 = x2 - k2;\n\n          while (x2 < text1Length && y2 < text2Length && text1.charAt(text1Length - x2 - 1) === text2.charAt(text2Length - y2 - 1)) {\n            x2++;\n            y2++;\n          }\n\n          v2[k2Offset] = x2;\n\n          if (x2 > text1Length) {\n            // Ran off the left of the graph.\n            k2end += 2;\n          } else if (y2 > text2Length) {\n            // Ran off the top of the graph.\n            k2start += 2;\n          } else if (!front) {\n            k1Offset = vOffset + delta - k2;\n\n            if (k1Offset >= 0 && k1Offset < vLength && v1[k1Offset] !== -1) {\n              x1 = v1[k1Offset];\n              y1 = vOffset + x1 - k1Offset; // Mirror x2 onto top-left coordinate system.\n\n              x2 = text1Length - x2;\n\n              if (x1 >= x2) {\n                // Overlap detected.\n                return this.diffBisectSplit(text1, text2, x1, y1, deadline);\n              }\n            }\n          }\n        }\n      } // Diff took too long and hit the deadline or\n      // number of diffs equals number of characters, no commonality at all.\n\n\n      return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];\n    };\n    /**\n     * Given the location of the 'middle snake', split the diff in two parts\n     * and recurse.\n     * @param {string} text1 Old string to be diffed.\n     * @param {string} text2 New string to be diffed.\n     * @param {number} x Index of split point in text1.\n     * @param {number} y Index of split point in text2.\n     * @param {number} deadline Time at which to bail if not yet complete.\n     * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffBisectSplit = function (text1, text2, x, y, deadline) {\n      var text1a, text1b, text2a, text2b, diffs, diffsb;\n      text1a = text1.substring(0, x);\n      text2a = text2.substring(0, y);\n      text1b = text1.substring(x);\n      text2b = text2.substring(y); // Compute both diffs serially.\n\n      diffs = this.DiffMain(text1a, text2a, false, deadline);\n      diffsb = this.DiffMain(text1b, text2b, false, deadline);\n      return diffs.concat(diffsb);\n    };\n    /**\n     * Reduce the number of edits by eliminating semantically trivial equalities.\n     * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.\n     */\n\n\n    DiffMatchPatch.prototype.diffCleanupSemantic = function (diffs) {\n      var changes, equalities, equalitiesLength, lastequality, pointer, lengthInsertions2, lengthDeletions2, lengthInsertions1, lengthDeletions1, deletion, insertion, overlapLength1, overlapLength2;\n      changes = false;\n      equalities = []; // Stack of indices where equalities are found.\n\n      equalitiesLength = 0; // Keeping our own length var is faster in JS.\n\n      /** @type {?string} */\n\n      lastequality = null; // Always equal to diffs[equalities[equalitiesLength - 1]][1]\n\n      pointer = 0; // Index of current position.\n      // Number of characters that changed prior to the equality.\n\n      lengthInsertions1 = 0;\n      lengthDeletions1 = 0; // Number of characters that changed after the equality.\n\n      lengthInsertions2 = 0;\n      lengthDeletions2 = 0;\n\n      while (pointer < diffs.length) {\n        if (diffs[pointer][0] === DIFF_EQUAL) {\n          // Equality found.\n          equalities[equalitiesLength++] = pointer;\n          lengthInsertions1 = lengthInsertions2;\n          lengthDeletions1 = lengthDeletions2;\n          lengthInsertions2 = 0;\n          lengthDeletions2 = 0;\n          lastequality = diffs[pointer][1];\n        } else {\n          // An insertion or deletion.\n          if (diffs[pointer][0] === DIFF_INSERT) {\n            lengthInsertions2 += diffs[pointer][1].length;\n          } else {\n            lengthDeletions2 += diffs[pointer][1].length;\n          } // Eliminate an equality that is smaller or equal to the edits on both\n          // sides of it.\n\n\n          if (lastequality && lastequality.length <= Math.max(lengthInsertions1, lengthDeletions1) && lastequality.length <= Math.max(lengthInsertions2, lengthDeletions2)) {\n            // Duplicate record.\n            diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]); // Change second copy to insert.\n\n            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT; // Throw away the equality we just deleted.\n\n            equalitiesLength--; // Throw away the previous equality (it needs to be reevaluated).\n\n            equalitiesLength--;\n            pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1; // Reset the counters.\n\n            lengthInsertions1 = 0;\n            lengthDeletions1 = 0;\n            lengthInsertions2 = 0;\n            lengthDeletions2 = 0;\n            lastequality = null;\n            changes = true;\n          }\n        }\n\n        pointer++;\n      } // Normalize the diff.\n\n\n      if (changes) {\n        this.diffCleanupMerge(diffs);\n      } // Find any overlaps between deletions and insertions.\n      // e.g: <del>abcxxx</del><ins>xxxdef</ins>\n      //   -> <del>abc</del>xxx<ins>def</ins>\n      // e.g: <del>xxxabc</del><ins>defxxx</ins>\n      //   -> <ins>def</ins>xxx<del>abc</del>\n      // Only extract an overlap if it is as big as the edit ahead or behind it.\n\n\n      pointer = 1;\n\n      while (pointer < diffs.length) {\n        if (diffs[pointer - 1][0] === DIFF_DELETE && diffs[pointer][0] === DIFF_INSERT) {\n          deletion = diffs[pointer - 1][1];\n          insertion = diffs[pointer][1];\n          overlapLength1 = this.diffCommonOverlap(deletion, insertion);\n          overlapLength2 = this.diffCommonOverlap(insertion, deletion);\n\n          if (overlapLength1 >= overlapLength2) {\n            if (overlapLength1 >= deletion.length / 2 || overlapLength1 >= insertion.length / 2) {\n              // Overlap found.  Insert an equality and trim the surrounding edits.\n              diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlapLength1)]);\n              diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlapLength1);\n              diffs[pointer + 1][1] = insertion.substring(overlapLength1);\n              pointer++;\n            }\n          } else {\n            if (overlapLength2 >= deletion.length / 2 || overlapLength2 >= insertion.length / 2) {\n              // Reverse overlap found.\n              // Insert an equality and swap and trim the surrounding edits.\n              diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlapLength2)]);\n              diffs[pointer - 1][0] = DIFF_INSERT;\n              diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlapLength2);\n              diffs[pointer + 1][0] = DIFF_DELETE;\n              diffs[pointer + 1][1] = deletion.substring(overlapLength2);\n              pointer++;\n            }\n          }\n\n          pointer++;\n        }\n\n        pointer++;\n      }\n    };\n    /**\n     * Determine if the suffix of one string is the prefix of another.\n     * @param {string} text1 First string.\n     * @param {string} text2 Second string.\n     * @return {number} The number of characters common to the end of the first\n     *     string and the start of the second string.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffCommonOverlap = function (text1, text2) {\n      var text1Length, text2Length, textLength, best, length, pattern, found; // Cache the text lengths to prevent multiple calls.\n\n      text1Length = text1.length;\n      text2Length = text2.length; // Eliminate the null case.\n\n      if (text1Length === 0 || text2Length === 0) {\n        return 0;\n      } // Truncate the longer string.\n\n\n      if (text1Length > text2Length) {\n        text1 = text1.substring(text1Length - text2Length);\n      } else if (text1Length < text2Length) {\n        text2 = text2.substring(0, text1Length);\n      }\n\n      textLength = Math.min(text1Length, text2Length); // Quick check for the worst case.\n\n      if (text1 === text2) {\n        return textLength;\n      } // Start by looking for a single character match\n      // and increase length until no match is found.\n      // Performance analysis: https://neil.fraser.name/news/2010/11/04/\n\n\n      best = 0;\n      length = 1;\n\n      while (true) {\n        pattern = text1.substring(textLength - length);\n        found = text2.indexOf(pattern);\n\n        if (found === -1) {\n          return best;\n        }\n\n        length += found;\n\n        if (found === 0 || text1.substring(textLength - length) === text2.substring(0, length)) {\n          best = length;\n          length++;\n        }\n      }\n    };\n    /**\n     * Split two texts into an array of strings.  Reduce the texts to a string of\n     * hashes where each Unicode character represents one line.\n     * @param {string} text1 First string.\n     * @param {string} text2 Second string.\n     * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}\n     *     An object containing the encoded text1, the encoded text2 and\n     *     the array of unique strings.\n     *     The zeroth element of the array of unique strings is intentionally blank.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffLinesToChars = function (text1, text2) {\n      var lineArray, lineHash, chars1, chars2;\n      lineArray = []; // E.g. lineArray[4] === 'Hello\\n'\n\n      lineHash = {}; // E.g. lineHash['Hello\\n'] === 4\n      // '\\x00' is a valid character, but various debuggers don't like it.\n      // So we'll insert a junk entry to avoid generating a null character.\n\n      lineArray[0] = \"\";\n      /**\n       * Split a text into an array of strings.  Reduce the texts to a string of\n       * hashes where each Unicode character represents one line.\n       * Modifies linearray and linehash through being a closure.\n       * @param {string} text String to encode.\n       * @return {string} Encoded string.\n       * @private\n       */\n\n      function diffLinesToCharsMunge(text) {\n        var chars, lineStart, lineEnd, lineArrayLength, line;\n        chars = \"\"; // Walk the text, pulling out a substring for each line.\n        // text.split('\\n') would would temporarily double our memory footprint.\n        // Modifying text would create many large strings to garbage collect.\n\n        lineStart = 0;\n        lineEnd = -1; // Keeping our own length variable is faster than looking it up.\n\n        lineArrayLength = lineArray.length;\n\n        while (lineEnd < text.length - 1) {\n          lineEnd = text.indexOf(\"\\n\", lineStart);\n\n          if (lineEnd === -1) {\n            lineEnd = text.length - 1;\n          }\n\n          line = text.substring(lineStart, lineEnd + 1);\n          lineStart = lineEnd + 1;\n\n          if (hasOwn.call(lineHash, line)) {\n            chars += String.fromCharCode(lineHash[line]);\n          } else {\n            chars += String.fromCharCode(lineArrayLength);\n            lineHash[line] = lineArrayLength;\n            lineArray[lineArrayLength++] = line;\n          }\n        }\n\n        return chars;\n      }\n\n      chars1 = diffLinesToCharsMunge(text1);\n      chars2 = diffLinesToCharsMunge(text2);\n      return {\n        chars1: chars1,\n        chars2: chars2,\n        lineArray: lineArray\n      };\n    };\n    /**\n     * Rehydrate the text in a diff from a string of line hashes to real lines of\n     * text.\n     * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.\n     * @param {!Array.<string>} lineArray Array of unique strings.\n     * @private\n     */\n\n\n    DiffMatchPatch.prototype.diffCharsToLines = function (diffs, lineArray) {\n      var x, chars, text, y;\n\n      for (x = 0; x < diffs.length; x++) {\n        chars = diffs[x][1];\n        text = [];\n\n        for (y = 0; y < chars.length; y++) {\n          text[y] = lineArray[chars.charCodeAt(y)];\n        }\n\n        diffs[x][1] = text.join(\"\");\n      }\n    };\n    /**\n     * Reorder and merge like edit sections.  Merge equalities.\n     * Any edit section can move as long as it doesn't cross an equality.\n     * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.\n     */\n\n\n    DiffMatchPatch.prototype.diffCleanupMerge = function (diffs) {\n      var pointer, countDelete, countInsert, textInsert, textDelete, commonlength, changes, diffPointer, position;\n      diffs.push([DIFF_EQUAL, \"\"]); // Add a dummy entry at the end.\n\n      pointer = 0;\n      countDelete = 0;\n      countInsert = 0;\n      textDelete = \"\";\n      textInsert = \"\";\n\n      while (pointer < diffs.length) {\n        switch (diffs[pointer][0]) {\n          case DIFF_INSERT:\n            countInsert++;\n            textInsert += diffs[pointer][1];\n            pointer++;\n            break;\n\n          case DIFF_DELETE:\n            countDelete++;\n            textDelete += diffs[pointer][1];\n            pointer++;\n            break;\n\n          case DIFF_EQUAL:\n            // Upon reaching an equality, check for prior redundancies.\n            if (countDelete + countInsert > 1) {\n              if (countDelete !== 0 && countInsert !== 0) {\n                // Factor out any common prefixes.\n                commonlength = this.diffCommonPrefix(textInsert, textDelete);\n\n                if (commonlength !== 0) {\n                  if (pointer - countDelete - countInsert > 0 && diffs[pointer - countDelete - countInsert - 1][0] === DIFF_EQUAL) {\n                    diffs[pointer - countDelete - countInsert - 1][1] += textInsert.substring(0, commonlength);\n                  } else {\n                    diffs.splice(0, 0, [DIFF_EQUAL, textInsert.substring(0, commonlength)]);\n                    pointer++;\n                  }\n\n                  textInsert = textInsert.substring(commonlength);\n                  textDelete = textDelete.substring(commonlength);\n                } // Factor out any common suffixies.\n\n\n                commonlength = this.diffCommonSuffix(textInsert, textDelete);\n\n                if (commonlength !== 0) {\n                  diffs[pointer][1] = textInsert.substring(textInsert.length - commonlength) + diffs[pointer][1];\n                  textInsert = textInsert.substring(0, textInsert.length - commonlength);\n                  textDelete = textDelete.substring(0, textDelete.length - commonlength);\n                }\n              } // Delete the offending records and add the merged ones.\n\n\n              if (countDelete === 0) {\n                diffs.splice(pointer - countInsert, countDelete + countInsert, [DIFF_INSERT, textInsert]);\n              } else if (countInsert === 0) {\n                diffs.splice(pointer - countDelete, countDelete + countInsert, [DIFF_DELETE, textDelete]);\n              } else {\n                diffs.splice(pointer - countDelete - countInsert, countDelete + countInsert, [DIFF_DELETE, textDelete], [DIFF_INSERT, textInsert]);\n              }\n\n              pointer = pointer - countDelete - countInsert + (countDelete ? 1 : 0) + (countInsert ? 1 : 0) + 1;\n            } else if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {\n              // Merge this equality with the previous one.\n              diffs[pointer - 1][1] += diffs[pointer][1];\n              diffs.splice(pointer, 1);\n            } else {\n              pointer++;\n            }\n\n            countInsert = 0;\n            countDelete = 0;\n            textDelete = \"\";\n            textInsert = \"\";\n            break;\n        }\n      }\n\n      if (diffs[diffs.length - 1][1] === \"\") {\n        diffs.pop(); // Remove the dummy entry at the end.\n      } // Second pass: look for single edits surrounded on both sides by equalities\n      // which can be shifted sideways to eliminate an equality.\n      // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC\n\n\n      changes = false;\n      pointer = 1; // Intentionally ignore the first and last element (don't need checking).\n\n      while (pointer < diffs.length - 1) {\n        if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {\n          diffPointer = diffs[pointer][1];\n          position = diffPointer.substring(diffPointer.length - diffs[pointer - 1][1].length); // This is a single edit surrounded by equalities.\n\n          if (position === diffs[pointer - 1][1]) {\n            // Shift the edit over the previous equality.\n            diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);\n            diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];\n            diffs.splice(pointer - 1, 1);\n            changes = true;\n          } else if (diffPointer.substring(0, diffs[pointer + 1][1].length) === diffs[pointer + 1][1]) {\n            // Shift the edit over the next equality.\n            diffs[pointer - 1][1] += diffs[pointer + 1][1];\n            diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];\n            diffs.splice(pointer + 1, 1);\n            changes = true;\n          }\n        }\n\n        pointer++;\n      } // If shifts were made, the diff needs reordering and another shift sweep.\n\n\n      if (changes) {\n        this.diffCleanupMerge(diffs);\n      }\n    };\n\n    return function (o, n) {\n      var diff, output, text;\n      diff = new DiffMatchPatch();\n      output = diff.DiffMain(o, n);\n      diff.diffCleanupEfficiency(output);\n      text = diff.diffPrettyHtml(output);\n      return text;\n    };\n  }();\n})(function () {\n  return this;\n}());\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/qunit/qunit/qunit.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon.js":
/*!*****************************************!*\
  !*** ./node_modules/sinon/lib/sinon.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar behavior = __webpack_require__(/*! ./sinon/behavior */ \"./node_modules/sinon/lib/sinon/behavior.js\");\n\nvar createSandbox = __webpack_require__(/*! ./sinon/create-sandbox */ \"./node_modules/sinon/lib/sinon/create-sandbox.js\");\n\nvar extend = __webpack_require__(/*! ./sinon/util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar fakeTimers = __webpack_require__(/*! ./sinon/util/fake-timers */ \"./node_modules/sinon/lib/sinon/util/fake-timers.js\");\n\nvar format = __webpack_require__(/*! ./sinon/util/core/format */ \"./node_modules/sinon/lib/sinon/util/core/format.js\");\n\nvar nise = __webpack_require__(/*! nise */ \"./node_modules/nise/nise.js\");\n\nvar Sandbox = __webpack_require__(/*! ./sinon/sandbox */ \"./node_modules/sinon/lib/sinon/sandbox.js\");\n\nvar stub = __webpack_require__(/*! ./sinon/stub */ \"./node_modules/sinon/lib/sinon/stub.js\");\n\nvar apiMethods = {\n  createSandbox: createSandbox,\n  assert: __webpack_require__(/*! ./sinon/assert */ \"./node_modules/sinon/lib/sinon/assert.js\"),\n  match: __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").createMatcher,\n  restoreObject: __webpack_require__(/*! ./sinon/restore-object */ \"./node_modules/sinon/lib/sinon/restore-object.js\"),\n  expectation: __webpack_require__(/*! ./sinon/mock-expectation */ \"./node_modules/sinon/lib/sinon/mock-expectation.js\"),\n  defaultConfig: __webpack_require__(/*! ./sinon/util/core/default-config */ \"./node_modules/sinon/lib/sinon/util/core/default-config.js\"),\n  setFormatter: format.setFormatter,\n  // fake timers\n  timers: fakeTimers.timers,\n  // fake XHR\n  xhr: nise.fakeXhr.xhr,\n  FakeXMLHttpRequest: nise.fakeXhr.FakeXMLHttpRequest,\n  // fake server\n  fakeServer: nise.fakeServer,\n  fakeServerWithClock: nise.fakeServerWithClock,\n  createFakeServer: nise.fakeServer.create.bind(nise.fakeServer),\n  createFakeServerWithClock: nise.fakeServerWithClock.create.bind(nise.fakeServerWithClock),\n  addBehavior: function (name, fn) {\n    behavior.addBehavior(stub, name, fn);\n  }\n};\nvar sandbox = new Sandbox();\nvar api = extend(sandbox, apiMethods);\nmodule.exports = api;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/assert.js":
/*!************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/assert.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar calledInOrder = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").calledInOrder;\n\nvar createMatcher = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").createMatcher;\n\nvar orderByFirstCall = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").orderByFirstCall;\n\nvar timesInWords = __webpack_require__(/*! ./util/core/times-in-words */ \"./node_modules/sinon/lib/sinon/util/core/times-in-words.js\");\n\nvar format = __webpack_require__(/*! ./util/core/format */ \"./node_modules/sinon/lib/sinon/util/core/format.js\");\n\nvar stringSlice = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.string.slice;\n\nvar globalObject = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").global;\n\nvar arraySlice = arrayProto.slice;\nvar concat = arrayProto.concat;\nvar forEach = arrayProto.forEach;\nvar join = arrayProto.join;\nvar splice = arrayProto.splice;\nvar assert;\n\nfunction verifyIsStub() {\n  var args = arraySlice(arguments);\n  forEach(args, function (method) {\n    if (!method) {\n      assert.fail(\"fake is not a spy\");\n    }\n\n    if (method.proxy && method.proxy.isSinonProxy) {\n      verifyIsStub(method.proxy);\n    } else {\n      if (typeof method !== \"function\") {\n        assert.fail(method + \" is not a function\");\n      }\n\n      if (typeof method.getCall !== \"function\") {\n        assert.fail(method + \" is not stubbed\");\n      }\n    }\n  });\n}\n\nfunction verifyIsValidAssertion(assertionMethod, assertionArgs) {\n  switch (assertionMethod) {\n    case \"notCalled\":\n    case \"called\":\n    case \"calledOnce\":\n    case \"calledTwice\":\n    case \"calledThrice\":\n      if (assertionArgs.length !== 0) {\n        assert.fail(assertionMethod + \" takes 1 argument but was called with \" + (assertionArgs.length + 1) + \" arguments\");\n      }\n\n      break;\n\n    default:\n      break;\n  }\n}\n\nfunction failAssertion(object, msg) {\n  var obj = object || globalObject;\n  var failMethod = obj.fail || assert.fail;\n  failMethod.call(obj, msg);\n}\n\nfunction mirrorPropAsAssertion(name, method, message) {\n  var msg = message;\n  var meth = method;\n\n  if (arguments.length === 2) {\n    msg = method;\n    meth = name;\n  }\n\n  assert[name] = function (fake) {\n    verifyIsStub(fake);\n    var args = arraySlice(arguments, 1);\n    var failed = false;\n    verifyIsValidAssertion(name, args);\n\n    if (typeof meth === \"function\") {\n      failed = !meth(fake);\n    } else {\n      failed = typeof fake[meth] === \"function\" ? !fake[meth].apply(fake, args) : !fake[meth];\n    }\n\n    if (failed) {\n      failAssertion(this, (fake.printf || fake.proxy.printf).apply(fake, concat([msg], args)));\n    } else {\n      assert.pass(name);\n    }\n  };\n}\n\nfunction exposedName(prefix, prop) {\n  return !prefix || /^fail/.test(prop) ? prop : prefix + stringSlice(prop, 0, 1).toUpperCase() + stringSlice(prop, 1);\n}\n\nassert = {\n  failException: \"AssertError\",\n  fail: function fail(message) {\n    var error = new Error(message);\n    error.name = this.failException || assert.failException;\n    throw error;\n  },\n  pass: function pass() {\n    return;\n  },\n  callOrder: function assertCallOrder() {\n    verifyIsStub.apply(null, arguments);\n    var expected = \"\";\n    var actual = \"\";\n\n    if (!calledInOrder(arguments)) {\n      try {\n        expected = join(arguments, \", \");\n        var calls = arraySlice(arguments);\n        var i = calls.length;\n\n        while (i) {\n          if (!calls[--i].called) {\n            splice(calls, i, 1);\n          }\n        }\n\n        actual = join(orderByFirstCall(calls), \", \");\n      } catch (e) {// If this fails, we'll just fall back to the blank string\n      }\n\n      failAssertion(this, \"expected \" + expected + \" to be called in order but were called as \" + actual);\n    } else {\n      assert.pass(\"callOrder\");\n    }\n  },\n  callCount: function assertCallCount(method, count) {\n    verifyIsStub(method);\n\n    if (method.callCount !== count) {\n      var msg = \"expected %n to be called \" + timesInWords(count) + \" but was called %c%C\";\n      failAssertion(this, method.printf(msg));\n    } else {\n      assert.pass(\"callCount\");\n    }\n  },\n  expose: function expose(target, options) {\n    if (!target) {\n      throw new TypeError(\"target is null or undefined\");\n    }\n\n    var o = options || {};\n    var prefix = typeof o.prefix === \"undefined\" && \"assert\" || o.prefix;\n    var includeFail = typeof o.includeFail === \"undefined\" || Boolean(o.includeFail);\n    var instance = this;\n    forEach(Object.keys(instance), function (method) {\n      if (method !== \"expose\" && (includeFail || !/^(fail)/.test(method))) {\n        target[exposedName(prefix, method)] = instance[method];\n      }\n    });\n    return target;\n  },\n  match: function match(actual, expectation) {\n    var matcher = createMatcher(expectation);\n\n    if (matcher.test(actual)) {\n      assert.pass(\"match\");\n    } else {\n      var formatted = [\"expected value to match\", \"    expected = \" + format(expectation), \"    actual = \" + format(actual)];\n      failAssertion(this, join(formatted, \"\\n\"));\n    }\n  }\n};\nmirrorPropAsAssertion(\"called\", \"expected %n to have been called at least once but was never called\");\nmirrorPropAsAssertion(\"notCalled\", function (spy) {\n  return !spy.called;\n}, \"expected %n to not have been called but was called %c%C\");\nmirrorPropAsAssertion(\"calledOnce\", \"expected %n to be called once but was called %c%C\");\nmirrorPropAsAssertion(\"calledTwice\", \"expected %n to be called twice but was called %c%C\");\nmirrorPropAsAssertion(\"calledThrice\", \"expected %n to be called thrice but was called %c%C\");\nmirrorPropAsAssertion(\"calledOn\", \"expected %n to be called with %1 as this but was called with %t\");\nmirrorPropAsAssertion(\"alwaysCalledOn\", \"expected %n to always be called with %1 as this but was called with %t\");\nmirrorPropAsAssertion(\"calledWithNew\", \"expected %n to be called with new\");\nmirrorPropAsAssertion(\"alwaysCalledWithNew\", \"expected %n to always be called with new\");\nmirrorPropAsAssertion(\"calledWith\", \"expected %n to be called with arguments %D\");\nmirrorPropAsAssertion(\"calledWithMatch\", \"expected %n to be called with match %D\");\nmirrorPropAsAssertion(\"alwaysCalledWith\", \"expected %n to always be called with arguments %D\");\nmirrorPropAsAssertion(\"alwaysCalledWithMatch\", \"expected %n to always be called with match %D\");\nmirrorPropAsAssertion(\"calledWithExactly\", \"expected %n to be called with exact arguments %D\");\nmirrorPropAsAssertion(\"calledOnceWithExactly\", \"expected %n to be called once and with exact arguments %D\");\nmirrorPropAsAssertion(\"alwaysCalledWithExactly\", \"expected %n to always be called with exact arguments %D\");\nmirrorPropAsAssertion(\"neverCalledWith\", \"expected %n to never be called with arguments %*%C\");\nmirrorPropAsAssertion(\"neverCalledWithMatch\", \"expected %n to never be called with match %*%C\");\nmirrorPropAsAssertion(\"threw\", \"%n did not throw exception%C\");\nmirrorPropAsAssertion(\"alwaysThrew\", \"%n did not always throw exception%C\");\nmodule.exports = assert;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/assert.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/behavior.js":
/*!**************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/behavior.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar extend = __webpack_require__(/*! ./util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar nextTick = __webpack_require__(/*! ./util/core/next-tick */ \"./node_modules/sinon/lib/sinon/util/core/next-tick.js\");\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar exportAsyncBehaviors = __webpack_require__(/*! ./util/core/export-async-behaviors */ \"./node_modules/sinon/lib/sinon/util/core/export-async-behaviors.js\");\n\nvar concat = arrayProto.concat;\nvar join = arrayProto.join;\nvar reverse = arrayProto.reverse;\nvar slice = arrayProto.slice;\nvar useLeftMostCallback = -1;\nvar useRightMostCallback = -2;\n\nfunction getCallback(behavior, args) {\n  var callArgAt = behavior.callArgAt;\n\n  if (callArgAt >= 0) {\n    return args[callArgAt];\n  }\n\n  var argumentList;\n\n  if (callArgAt === useLeftMostCallback) {\n    argumentList = args;\n  }\n\n  if (callArgAt === useRightMostCallback) {\n    argumentList = reverse(slice(args));\n  }\n\n  var callArgProp = behavior.callArgProp;\n\n  for (var i = 0, l = argumentList.length; i < l; ++i) {\n    if (!callArgProp && typeof argumentList[i] === \"function\") {\n      return argumentList[i];\n    }\n\n    if (callArgProp && argumentList[i] && typeof argumentList[i][callArgProp] === \"function\") {\n      return argumentList[i][callArgProp];\n    }\n  }\n\n  return null;\n}\n\nfunction getCallbackError(behavior, func, args) {\n  if (behavior.callArgAt < 0) {\n    var msg;\n\n    if (behavior.callArgProp) {\n      msg = functionName(behavior.stub) + \" expected to yield to '\" + valueToString(behavior.callArgProp) + \"', but no object with such a property was passed.\";\n    } else {\n      msg = functionName(behavior.stub) + \" expected to yield, but no callback was passed.\";\n    }\n\n    if (args.length > 0) {\n      msg += \" Received [\" + join(args, \", \") + \"]\";\n    }\n\n    return msg;\n  }\n\n  return \"argument at index \" + behavior.callArgAt + \" is not a function: \" + func;\n}\n\nfunction ensureArgs(name, behavior, args) {\n  // map function name to internal property\n  //   callsArg => callArgAt\n  var property = name.replace(/sArg/, \"ArgAt\");\n  var index = behavior[property];\n\n  if (index >= args.length) {\n    throw new TypeError(name + \" failed: \" + (index + 1) + \" arguments required but only \" + args.length + \" present\");\n  }\n}\n\nfunction callCallback(behavior, args) {\n  if (typeof behavior.callArgAt === \"number\") {\n    ensureArgs(\"callsArg\", behavior, args);\n    var func = getCallback(behavior, args);\n\n    if (typeof func !== \"function\") {\n      throw new TypeError(getCallbackError(behavior, func, args));\n    }\n\n    if (behavior.callbackAsync) {\n      nextTick(function () {\n        func.apply(behavior.callbackContext, behavior.callbackArguments);\n      });\n    } else {\n      return func.apply(behavior.callbackContext, behavior.callbackArguments);\n    }\n  }\n\n  return undefined;\n}\n\nvar proto = {\n  create: function create(stub) {\n    var behavior = extend({}, proto);\n    delete behavior.create;\n    delete behavior.addBehavior;\n    delete behavior.createBehavior;\n    behavior.stub = stub;\n\n    if (stub.defaultBehavior && stub.defaultBehavior.promiseLibrary) {\n      behavior.promiseLibrary = stub.defaultBehavior.promiseLibrary;\n    }\n\n    return behavior;\n  },\n  isPresent: function isPresent() {\n    return typeof this.callArgAt === \"number\" || this.exception || this.exceptionCreator || typeof this.returnArgAt === \"number\" || this.returnThis || typeof this.resolveArgAt === \"number\" || this.resolveThis || typeof this.throwArgAt === \"number\" || this.fakeFn || this.returnValueDefined;\n  },\n\n  /*eslint complexity: [\"error\", 20]*/\n  invoke: function invoke(context, args) {\n    /*\n     * callCallback (conditionally) calls ensureArgs\n     *\n     * Note: callCallback intentionally happens before\n     * everything else and cannot be moved lower\n     */\n    var returnValue = callCallback(this, args);\n\n    if (this.exception) {\n      throw this.exception;\n    } else if (this.exceptionCreator) {\n      this.exception = this.exceptionCreator();\n      this.exceptionCreator = undefined;\n      throw this.exception;\n    } else if (typeof this.returnArgAt === \"number\") {\n      ensureArgs(\"returnsArg\", this, args);\n      return args[this.returnArgAt];\n    } else if (this.returnThis) {\n      return context;\n    } else if (typeof this.throwArgAt === \"number\") {\n      ensureArgs(\"throwsArg\", this, args);\n      throw args[this.throwArgAt];\n    } else if (this.fakeFn) {\n      return this.fakeFn.apply(context, args);\n    } else if (typeof this.resolveArgAt === \"number\") {\n      ensureArgs(\"resolvesArg\", this, args);\n      return (this.promiseLibrary || Promise).resolve(args[this.resolveArgAt]);\n    } else if (this.resolveThis) {\n      return (this.promiseLibrary || Promise).resolve(context);\n    } else if (this.resolve) {\n      return (this.promiseLibrary || Promise).resolve(this.returnValue);\n    } else if (this.reject) {\n      return (this.promiseLibrary || Promise).reject(this.returnValue);\n    } else if (this.callsThrough) {\n      var wrappedMethod = this.effectiveWrappedMethod();\n      return wrappedMethod.apply(context, args);\n    } else if (this.callsThroughWithNew) {\n      // Get the original method (assumed to be a constructor in this case)\n      var WrappedClass = this.effectiveWrappedMethod(); // Turn the arguments object into a normal array\n\n      var argsArray = slice(args); // Call the constructor\n\n      var F = WrappedClass.bind.apply(WrappedClass, concat([null], argsArray));\n      return new F();\n    } else if (typeof this.returnValue !== \"undefined\") {\n      return this.returnValue;\n    } else if (typeof this.callArgAt === \"number\") {\n      return returnValue;\n    }\n\n    return this.returnValue;\n  },\n  effectiveWrappedMethod: function effectiveWrappedMethod() {\n    for (var stubb = this.stub; stubb; stubb = stubb.parent) {\n      if (stubb.wrappedMethod) {\n        return stubb.wrappedMethod;\n      }\n    }\n\n    throw new Error(\"Unable to find wrapped method\");\n  },\n  onCall: function onCall(index) {\n    return this.stub.onCall(index);\n  },\n  onFirstCall: function onFirstCall() {\n    return this.stub.onFirstCall();\n  },\n  onSecondCall: function onSecondCall() {\n    return this.stub.onSecondCall();\n  },\n  onThirdCall: function onThirdCall() {\n    return this.stub.onThirdCall();\n  },\n  withArgs: function withArgs()\n  /* arguments */\n  {\n    throw new Error('Defining a stub by invoking \"stub.onCall(...).withArgs(...)\" ' + 'is not supported. Use \"stub.withArgs(...).onCall(...)\" ' + \"to define sequential behavior for calls with certain arguments.\");\n  }\n};\n\nfunction createBehavior(behaviorMethod) {\n  return function () {\n    this.defaultBehavior = this.defaultBehavior || proto.create(this);\n    this.defaultBehavior[behaviorMethod].apply(this.defaultBehavior, arguments);\n    return this;\n  };\n}\n\nfunction addBehavior(stub, name, fn) {\n  proto[name] = function () {\n    fn.apply(this, concat([this], slice(arguments)));\n    return this.stub || this;\n  };\n\n  stub[name] = createBehavior(name);\n}\n\nproto.addBehavior = addBehavior;\nproto.createBehavior = createBehavior;\nvar asyncBehaviors = exportAsyncBehaviors(proto);\nmodule.exports = extend.nonEnum({}, proto, asyncBehaviors);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/behavior.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/collect-own-methods.js":
/*!*************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/collect-own-methods.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar walk = __webpack_require__(/*! ./util/core/walk */ \"./node_modules/sinon/lib/sinon/util/core/walk.js\");\n\nvar getPropertyDescriptor = __webpack_require__(/*! ./util/core/get-property-descriptor */ \"./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js\");\n\nvar hasOwnProperty = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object.hasOwnProperty;\n\nvar push = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.push;\n\nfunction collectMethod(methods, object, prop, propOwner) {\n  if (typeof getPropertyDescriptor(propOwner, prop).value === \"function\" && hasOwnProperty(object, prop)) {\n    push(methods, object[prop]);\n  }\n} // This function returns an array of all the own methods on the passed object\n\n\nfunction collectOwnMethods(object) {\n  var methods = [];\n  walk(object, collectMethod.bind(null, methods, object));\n  return methods;\n}\n\nmodule.exports = collectOwnMethods;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/collect-own-methods.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/color.js":
/*!***********************************************!*\
  !*** ./node_modules/sinon/lib/sinon/color.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar supportsColor = __webpack_require__(/*! supports-color */ \"./node_modules/supports-color/browser.js\");\n\nfunction colorize(str, color) {\n  if (supportsColor.stdout === false) {\n    return str;\n  }\n\n  return \"\\x1b[\" + color + \"m\" + str + \"\\x1b[0m\";\n}\n\nexports.red = function (str) {\n  return colorize(str, 31);\n};\n\nexports.green = function (str) {\n  return colorize(str, 32);\n};\n\nexports.cyan = function (str) {\n  return colorize(str, 96);\n};\n\nexports.white = function (str) {\n  return colorize(str, 39);\n};\n\nexports.bold = function (str) {\n  return colorize(str, 1);\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/color.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/create-sandbox.js":
/*!********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/create-sandbox.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar Sandbox = __webpack_require__(/*! ./sandbox */ \"./node_modules/sinon/lib/sinon/sandbox.js\");\n\nvar forEach = arrayProto.forEach;\nvar push = arrayProto.push;\n\nfunction prepareSandboxFromConfig(config) {\n  var sandbox = new Sandbox();\n\n  if (config.useFakeServer) {\n    if (typeof config.useFakeServer === \"object\") {\n      sandbox.serverPrototype = config.useFakeServer;\n    }\n\n    sandbox.useFakeServer();\n  }\n\n  if (config.useFakeTimers) {\n    if (typeof config.useFakeTimers === \"object\") {\n      sandbox.useFakeTimers(config.useFakeTimers);\n    } else {\n      sandbox.useFakeTimers();\n    }\n  }\n\n  return sandbox;\n}\n\nfunction exposeValue(sandbox, config, key, value) {\n  if (!value) {\n    return;\n  }\n\n  if (config.injectInto && !(key in config.injectInto)) {\n    config.injectInto[key] = value;\n    push(sandbox.injectedKeys, key);\n  } else {\n    push(sandbox.args, value);\n  }\n}\n\nfunction createSandbox(config) {\n  if (!config) {\n    return new Sandbox();\n  }\n\n  var configuredSandbox = prepareSandboxFromConfig(config);\n  configuredSandbox.args = configuredSandbox.args || [];\n  configuredSandbox.injectedKeys = [];\n  configuredSandbox.injectInto = config.injectInto;\n  var exposed = configuredSandbox.inject({});\n\n  if (config.properties) {\n    forEach(config.properties, function (prop) {\n      var value = exposed[prop] || prop === \"sandbox\" && configuredSandbox;\n      exposeValue(configuredSandbox, config, prop, value);\n    });\n  } else {\n    exposeValue(configuredSandbox, config, \"sandbox\");\n  }\n\n  return configuredSandbox;\n}\n\nmodule.exports = createSandbox;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/create-sandbox.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/default-behaviors.js":
/*!***********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/default-behaviors.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar isPropertyConfigurable = __webpack_require__(/*! ./util/core/is-property-configurable */ \"./node_modules/sinon/lib/sinon/util/core/is-property-configurable.js\");\n\nvar exportAsyncBehaviors = __webpack_require__(/*! ./util/core/export-async-behaviors */ \"./node_modules/sinon/lib/sinon/util/core/export-async-behaviors.js\");\n\nvar extend = __webpack_require__(/*! ./util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar slice = arrayProto.slice;\nvar useLeftMostCallback = -1;\nvar useRightMostCallback = -2;\n\nfunction throwsException(fake, error, message) {\n  if (typeof error === \"function\") {\n    fake.exceptionCreator = error;\n  } else if (typeof error === \"string\") {\n    fake.exceptionCreator = function () {\n      var newException = new Error(message || \"\");\n      newException.name = error;\n      return newException;\n    };\n  } else if (!error) {\n    fake.exceptionCreator = function () {\n      return new Error(\"Error\");\n    };\n  } else {\n    fake.exception = error;\n  }\n}\n\nvar defaultBehaviors = {\n  callsFake: function callsFake(fake, fn) {\n    fake.fakeFn = fn;\n  },\n  callsArg: function callsArg(fake, index) {\n    if (typeof index !== \"number\") {\n      throw new TypeError(\"argument index is not number\");\n    }\n\n    fake.callArgAt = index;\n    fake.callbackArguments = [];\n    fake.callbackContext = undefined;\n    fake.callArgProp = undefined;\n    fake.callbackAsync = false;\n  },\n  callsArgOn: function callsArgOn(fake, index, context) {\n    if (typeof index !== \"number\") {\n      throw new TypeError(\"argument index is not number\");\n    }\n\n    fake.callArgAt = index;\n    fake.callbackArguments = [];\n    fake.callbackContext = context;\n    fake.callArgProp = undefined;\n    fake.callbackAsync = false;\n  },\n  callsArgWith: function callsArgWith(fake, index) {\n    if (typeof index !== \"number\") {\n      throw new TypeError(\"argument index is not number\");\n    }\n\n    fake.callArgAt = index;\n    fake.callbackArguments = slice(arguments, 2);\n    fake.callbackContext = undefined;\n    fake.callArgProp = undefined;\n    fake.callbackAsync = false;\n  },\n  callsArgOnWith: function callsArgWith(fake, index, context) {\n    if (typeof index !== \"number\") {\n      throw new TypeError(\"argument index is not number\");\n    }\n\n    fake.callArgAt = index;\n    fake.callbackArguments = slice(arguments, 3);\n    fake.callbackContext = context;\n    fake.callArgProp = undefined;\n    fake.callbackAsync = false;\n  },\n  usingPromise: function usingPromise(fake, promiseLibrary) {\n    fake.promiseLibrary = promiseLibrary;\n  },\n  yields: function (fake) {\n    fake.callArgAt = useLeftMostCallback;\n    fake.callbackArguments = slice(arguments, 1);\n    fake.callbackContext = undefined;\n    fake.callArgProp = undefined;\n    fake.callbackAsync = false;\n  },\n  yieldsRight: function (fake) {\n    fake.callArgAt = useRightMostCallback;\n    fake.callbackArguments = slice(arguments, 1);\n    fake.callbackContext = undefined;\n    fake.callArgProp = undefined;\n    fake.callbackAsync = false;\n  },\n  yieldsOn: function (fake, context) {\n    fake.callArgAt = useLeftMostCallback;\n    fake.callbackArguments = slice(arguments, 2);\n    fake.callbackContext = context;\n    fake.callArgProp = undefined;\n    fake.callbackAsync = false;\n  },\n  yieldsTo: function (fake, prop) {\n    fake.callArgAt = useLeftMostCallback;\n    fake.callbackArguments = slice(arguments, 2);\n    fake.callbackContext = undefined;\n    fake.callArgProp = prop;\n    fake.callbackAsync = false;\n  },\n  yieldsToOn: function (fake, prop, context) {\n    fake.callArgAt = useLeftMostCallback;\n    fake.callbackArguments = slice(arguments, 3);\n    fake.callbackContext = context;\n    fake.callArgProp = prop;\n    fake.callbackAsync = false;\n  },\n  throws: throwsException,\n  throwsException: throwsException,\n  returns: function returns(fake, value) {\n    fake.returnValue = value;\n    fake.resolve = false;\n    fake.reject = false;\n    fake.returnValueDefined = true;\n    fake.exception = undefined;\n    fake.exceptionCreator = undefined;\n    fake.fakeFn = undefined;\n  },\n  returnsArg: function returnsArg(fake, index) {\n    if (typeof index !== \"number\") {\n      throw new TypeError(\"argument index is not number\");\n    }\n\n    fake.returnArgAt = index;\n  },\n  throwsArg: function throwsArg(fake, index) {\n    if (typeof index !== \"number\") {\n      throw new TypeError(\"argument index is not number\");\n    }\n\n    fake.throwArgAt = index;\n  },\n  returnsThis: function returnsThis(fake) {\n    fake.returnThis = true;\n  },\n  resolves: function resolves(fake, value) {\n    fake.returnValue = value;\n    fake.resolve = true;\n    fake.resolveThis = false;\n    fake.reject = false;\n    fake.returnValueDefined = true;\n    fake.exception = undefined;\n    fake.exceptionCreator = undefined;\n    fake.fakeFn = undefined;\n  },\n  resolvesArg: function resolvesArg(fake, index) {\n    if (typeof index !== \"number\") {\n      throw new TypeError(\"argument index is not number\");\n    }\n\n    fake.resolveArgAt = index;\n    fake.returnValue = undefined;\n    fake.resolve = true;\n    fake.resolveThis = false;\n    fake.reject = false;\n    fake.returnValueDefined = false;\n    fake.exception = undefined;\n    fake.exceptionCreator = undefined;\n    fake.fakeFn = undefined;\n  },\n  rejects: function rejects(fake, error, message) {\n    var reason;\n\n    if (typeof error === \"string\") {\n      reason = new Error(message || \"\");\n      reason.name = error;\n    } else if (!error) {\n      reason = new Error(\"Error\");\n    } else {\n      reason = error;\n    }\n\n    fake.returnValue = reason;\n    fake.resolve = false;\n    fake.resolveThis = false;\n    fake.reject = true;\n    fake.returnValueDefined = true;\n    fake.exception = undefined;\n    fake.exceptionCreator = undefined;\n    fake.fakeFn = undefined;\n    return fake;\n  },\n  resolvesThis: function resolvesThis(fake) {\n    fake.returnValue = undefined;\n    fake.resolve = false;\n    fake.resolveThis = true;\n    fake.reject = false;\n    fake.returnValueDefined = false;\n    fake.exception = undefined;\n    fake.exceptionCreator = undefined;\n    fake.fakeFn = undefined;\n  },\n  callThrough: function callThrough(fake) {\n    fake.callsThrough = true;\n  },\n  callThroughWithNew: function callThroughWithNew(fake) {\n    fake.callsThroughWithNew = true;\n  },\n  get: function get(fake, getterFunction) {\n    var rootStub = fake.stub || fake;\n    Object.defineProperty(rootStub.rootObj, rootStub.propName, {\n      get: getterFunction,\n      configurable: isPropertyConfigurable(rootStub.rootObj, rootStub.propName)\n    });\n    return fake;\n  },\n  set: function set(fake, setterFunction) {\n    var rootStub = fake.stub || fake;\n    Object.defineProperty(rootStub.rootObj, rootStub.propName, // eslint-disable-next-line accessor-pairs\n    {\n      set: setterFunction,\n      configurable: isPropertyConfigurable(rootStub.rootObj, rootStub.propName)\n    });\n    return fake;\n  },\n  value: function value(fake, newVal) {\n    var rootStub = fake.stub || fake;\n    Object.defineProperty(rootStub.rootObj, rootStub.propName, {\n      value: newVal,\n      enumerable: true,\n      configurable: isPropertyConfigurable(rootStub.rootObj, rootStub.propName)\n    });\n    return fake;\n  }\n};\nvar asyncBehaviors = exportAsyncBehaviors(defaultBehaviors);\nmodule.exports = extend({}, defaultBehaviors, asyncBehaviors);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/default-behaviors.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/fake.js":
/*!**********************************************!*\
  !*** ./node_modules/sinon/lib/sinon/fake.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar createProxy = __webpack_require__(/*! ./proxy */ \"./node_modules/sinon/lib/sinon/proxy.js\");\n\nvar nextTick = __webpack_require__(/*! ./util/core/next-tick */ \"./node_modules/sinon/lib/sinon/util/core/next-tick.js\");\n\nvar slice = arrayProto.slice;\n\nfunction getError(value) {\n  return value instanceof Error ? value : new Error(value);\n}\n\nvar uuid = 0;\n\nfunction wrapFunc(f) {\n  var proxy;\n\n  var fakeInstance = function () {\n    var lastArg = arguments.length > 0 ? arguments[arguments.length - 1] : undefined;\n    var callback = lastArg && typeof lastArg === \"function\" ? lastArg : undefined;\n    proxy.lastArg = lastArg;\n    proxy.callback = callback;\n    return f && f.apply(this, arguments);\n  };\n\n  proxy = createProxy(fakeInstance, f || fakeInstance);\n  proxy.displayName = \"fake\";\n  proxy.id = \"fake#\" + uuid++;\n  return proxy;\n}\n\nfunction fake(f) {\n  if (arguments.length > 0 && typeof f !== \"function\") {\n    throw new TypeError(\"Expected f argument to be a Function\");\n  }\n\n  return wrapFunc(f);\n}\n\nfake.returns = function returns(value) {\n  function f() {\n    return value;\n  }\n\n  return wrapFunc(f);\n};\n\nfake.throws = function throws(value) {\n  function f() {\n    throw getError(value);\n  }\n\n  return wrapFunc(f);\n};\n\nfake.resolves = function resolves(value) {\n  function f() {\n    return Promise.resolve(value);\n  }\n\n  return wrapFunc(f);\n};\n\nfake.rejects = function rejects(value) {\n  function f() {\n    return Promise.reject(getError(value));\n  }\n\n  return wrapFunc(f);\n};\n\nfunction yieldInternal(async, values) {\n  function f() {\n    var callback = arguments[arguments.length - 1];\n\n    if (typeof callback !== \"function\") {\n      throw new TypeError(\"Expected last argument to be a function\");\n    }\n\n    if (async) {\n      nextTick(function () {\n        callback.apply(null, values);\n      });\n    } else {\n      callback.apply(null, values);\n    }\n  }\n\n  return wrapFunc(f);\n}\n\nfake.yields = function yields() {\n  return yieldInternal(false, slice(arguments));\n};\n\nfake.yieldsAsync = function yieldsAsync() {\n  return yieldInternal(true, slice(arguments));\n};\n\nmodule.exports = fake;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/fake.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/mock-expectation.js":
/*!**********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/mock-expectation.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar proxyInvoke = __webpack_require__(/*! ./proxy-invoke */ \"./node_modules/sinon/lib/sinon/proxy-invoke.js\");\n\nvar proxyCallToString = __webpack_require__(/*! ./proxy-call */ \"./node_modules/sinon/lib/sinon/proxy-call.js\").toString;\n\nvar timesInWords = __webpack_require__(/*! ./util/core/times-in-words */ \"./node_modules/sinon/lib/sinon/util/core/times-in-words.js\");\n\nvar extend = __webpack_require__(/*! ./util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar match = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").createMatcher;\n\nvar stub = __webpack_require__(/*! ./stub */ \"./node_modules/sinon/lib/sinon/stub.js\");\n\nvar assert = __webpack_require__(/*! ./assert */ \"./node_modules/sinon/lib/sinon/assert.js\");\n\nvar deepEqual = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").deepEqual;\n\nvar format = __webpack_require__(/*! ./util/core/format */ \"./node_modules/sinon/lib/sinon/util/core/format.js\");\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar every = arrayProto.every;\nvar forEach = arrayProto.forEach;\nvar push = arrayProto.push;\nvar slice = arrayProto.slice;\n\nfunction callCountInWords(callCount) {\n  if (callCount === 0) {\n    return \"never called\";\n  }\n\n  return \"called \" + timesInWords(callCount);\n}\n\nfunction expectedCallCountInWords(expectation) {\n  var min = expectation.minCalls;\n  var max = expectation.maxCalls;\n\n  if (typeof min === \"number\" && typeof max === \"number\") {\n    var str = timesInWords(min);\n\n    if (min !== max) {\n      str = \"at least \" + str + \" and at most \" + timesInWords(max);\n    }\n\n    return str;\n  }\n\n  if (typeof min === \"number\") {\n    return \"at least \" + timesInWords(min);\n  }\n\n  return \"at most \" + timesInWords(max);\n}\n\nfunction receivedMinCalls(expectation) {\n  var hasMinLimit = typeof expectation.minCalls === \"number\";\n  return !hasMinLimit || expectation.callCount >= expectation.minCalls;\n}\n\nfunction receivedMaxCalls(expectation) {\n  if (typeof expectation.maxCalls !== \"number\") {\n    return false;\n  }\n\n  return expectation.callCount === expectation.maxCalls;\n}\n\nfunction verifyMatcher(possibleMatcher, arg) {\n  var isMatcher = match.isMatcher(possibleMatcher);\n  return isMatcher && possibleMatcher.test(arg) || true;\n}\n\nvar mockExpectation = {\n  minCalls: 1,\n  maxCalls: 1,\n  create: function create(methodName) {\n    var expectation = extend.nonEnum(stub(), mockExpectation);\n    delete expectation.create;\n    expectation.method = methodName;\n    return expectation;\n  },\n  invoke: function invoke(func, thisValue, args) {\n    this.verifyCallAllowed(thisValue, args);\n    return proxyInvoke.apply(this, arguments);\n  },\n  atLeast: function atLeast(num) {\n    if (typeof num !== \"number\") {\n      throw new TypeError(\"'\" + valueToString(num) + \"' is not number\");\n    }\n\n    if (!this.limitsSet) {\n      this.maxCalls = null;\n      this.limitsSet = true;\n    }\n\n    this.minCalls = num;\n    return this;\n  },\n  atMost: function atMost(num) {\n    if (typeof num !== \"number\") {\n      throw new TypeError(\"'\" + valueToString(num) + \"' is not number\");\n    }\n\n    if (!this.limitsSet) {\n      this.minCalls = null;\n      this.limitsSet = true;\n    }\n\n    this.maxCalls = num;\n    return this;\n  },\n  never: function never() {\n    return this.exactly(0);\n  },\n  once: function once() {\n    return this.exactly(1);\n  },\n  twice: function twice() {\n    return this.exactly(2);\n  },\n  thrice: function thrice() {\n    return this.exactly(3);\n  },\n  exactly: function exactly(num) {\n    if (typeof num !== \"number\") {\n      throw new TypeError(\"'\" + valueToString(num) + \"' is not a number\");\n    }\n\n    this.atLeast(num);\n    return this.atMost(num);\n  },\n  met: function met() {\n    return !this.failed && receivedMinCalls(this);\n  },\n  verifyCallAllowed: function verifyCallAllowed(thisValue, args) {\n    var expectedArguments = this.expectedArguments;\n\n    if (receivedMaxCalls(this)) {\n      this.failed = true;\n      mockExpectation.fail(this.method + \" already called \" + timesInWords(this.maxCalls));\n    }\n\n    if (\"expectedThis\" in this && this.expectedThis !== thisValue) {\n      mockExpectation.fail(this.method + \" called with \" + valueToString(thisValue) + \" as thisValue, expected \" + valueToString(this.expectedThis));\n    }\n\n    if (!(\"expectedArguments\" in this)) {\n      return;\n    }\n\n    if (!args) {\n      mockExpectation.fail(this.method + \" received no arguments, expected \" + format(expectedArguments));\n    }\n\n    if (args.length < expectedArguments.length) {\n      mockExpectation.fail(this.method + \" received too few arguments (\" + format(args) + \"), expected \" + format(expectedArguments));\n    }\n\n    if (this.expectsExactArgCount && args.length !== expectedArguments.length) {\n      mockExpectation.fail(this.method + \" received too many arguments (\" + format(args) + \"), expected \" + format(expectedArguments));\n    }\n\n    forEach(expectedArguments, function (expectedArgument, i) {\n      if (!verifyMatcher(expectedArgument, args[i])) {\n        mockExpectation.fail(this.method + \" received wrong arguments \" + format(args) + \", didn't match \" + String(expectedArguments));\n      }\n\n      if (!deepEqual(args[i], expectedArgument)) {\n        mockExpectation.fail(this.method + \" received wrong arguments \" + format(args) + \", expected \" + format(expectedArguments));\n      }\n    }, this);\n  },\n  allowsCall: function allowsCall(thisValue, args) {\n    var expectedArguments = this.expectedArguments;\n\n    if (this.met() && receivedMaxCalls(this)) {\n      return false;\n    }\n\n    if (\"expectedThis\" in this && this.expectedThis !== thisValue) {\n      return false;\n    }\n\n    if (!(\"expectedArguments\" in this)) {\n      return true;\n    } // eslint-disable-next-line no-underscore-dangle\n\n\n    var _args = args || [];\n\n    if (_args.length < expectedArguments.length) {\n      return false;\n    }\n\n    if (this.expectsExactArgCount && _args.length !== expectedArguments.length) {\n      return false;\n    }\n\n    return every(expectedArguments, function (expectedArgument, i) {\n      if (!verifyMatcher(expectedArgument, _args[i])) {\n        return false;\n      }\n\n      if (!deepEqual(_args[i], expectedArgument)) {\n        return false;\n      }\n\n      return true;\n    });\n  },\n  withArgs: function withArgs() {\n    this.expectedArguments = slice(arguments);\n    return this;\n  },\n  withExactArgs: function withExactArgs() {\n    this.withArgs.apply(this, arguments);\n    this.expectsExactArgCount = true;\n    return this;\n  },\n  on: function on(thisValue) {\n    this.expectedThis = thisValue;\n    return this;\n  },\n  toString: function () {\n    var args = slice(this.expectedArguments || []);\n\n    if (!this.expectsExactArgCount) {\n      push(args, \"[...]\");\n    }\n\n    var callStr = proxyCallToString.call({\n      proxy: this.method || \"anonymous mock expectation\",\n      args: args\n    });\n    var message = callStr.replace(\", [...\", \"[, ...\") + \" \" + expectedCallCountInWords(this);\n\n    if (this.met()) {\n      return \"Expectation met: \" + message;\n    }\n\n    return \"Expected \" + message + \" (\" + callCountInWords(this.callCount) + \")\";\n  },\n  verify: function verify() {\n    if (!this.met()) {\n      mockExpectation.fail(String(this));\n    } else {\n      mockExpectation.pass(String(this));\n    }\n\n    return true;\n  },\n  pass: function pass(message) {\n    assert.pass(message);\n  },\n  fail: function fail(message) {\n    var exception = new Error(message);\n    exception.name = \"ExpectationError\";\n    throw exception;\n  }\n};\nmodule.exports = mockExpectation;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/mock-expectation.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/mock.js":
/*!**********************************************!*\
  !*** ./node_modules/sinon/lib/sinon/mock.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar mockExpectation = __webpack_require__(/*! ./mock-expectation */ \"./node_modules/sinon/lib/sinon/mock-expectation.js\");\n\nvar proxyCallToString = __webpack_require__(/*! ./proxy-call */ \"./node_modules/sinon/lib/sinon/proxy-call.js\").toString;\n\nvar extend = __webpack_require__(/*! ./util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar deepEqual = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").deepEqual;\n\nvar wrapMethod = __webpack_require__(/*! ./util/core/wrap-method */ \"./node_modules/sinon/lib/sinon/util/core/wrap-method.js\");\n\nvar usePromiseLibrary = __webpack_require__(/*! ./util/core/use-promise-library */ \"./node_modules/sinon/lib/sinon/util/core/use-promise-library.js\");\n\nvar concat = arrayProto.concat;\nvar filter = arrayProto.filter;\nvar forEach = arrayProto.forEach;\nvar every = arrayProto.every;\nvar join = arrayProto.join;\nvar push = arrayProto.push;\nvar slice = arrayProto.slice;\nvar unshift = arrayProto.unshift;\n\nfunction mock(object) {\n  if (!object || typeof object === \"string\") {\n    return mockExpectation.create(object ? object : \"Anonymous mock\");\n  }\n\n  return mock.create(object);\n}\n\nfunction each(collection, callback) {\n  var col = collection || [];\n  forEach(col, callback);\n}\n\nfunction arrayEquals(arr1, arr2, compareLength) {\n  if (compareLength && arr1.length !== arr2.length) {\n    return false;\n  }\n\n  return every(arr1, function (element, i) {\n    return deepEqual(arr2[i], element);\n  });\n}\n\nextend(mock, {\n  create: function create(object) {\n    if (!object) {\n      throw new TypeError(\"object is null\");\n    }\n\n    var mockObject = extend.nonEnum({}, mock, {\n      object: object\n    });\n    delete mockObject.create;\n    return mockObject;\n  },\n  expects: function expects(method) {\n    if (!method) {\n      throw new TypeError(\"method is falsy\");\n    }\n\n    if (!this.expectations) {\n      this.expectations = {};\n      this.proxies = [];\n      this.failures = [];\n    }\n\n    if (!this.expectations[method]) {\n      this.expectations[method] = [];\n      var mockObject = this;\n      wrapMethod(this.object, method, function () {\n        return mockObject.invokeMethod(method, this, arguments);\n      });\n      push(this.proxies, method);\n    }\n\n    var expectation = mockExpectation.create(method);\n    expectation.wrappedMethod = this.object[method].wrappedMethod;\n    push(this.expectations[method], expectation);\n    usePromiseLibrary(this.promiseLibrary, expectation);\n    return expectation;\n  },\n  restore: function restore() {\n    var object = this.object;\n    each(this.proxies, function (proxy) {\n      if (typeof object[proxy].restore === \"function\") {\n        object[proxy].restore();\n      }\n    });\n  },\n  verify: function verify() {\n    var expectations = this.expectations || {};\n    var messages = this.failures ? slice(this.failures) : [];\n    var met = [];\n    each(this.proxies, function (proxy) {\n      each(expectations[proxy], function (expectation) {\n        if (!expectation.met()) {\n          push(messages, String(expectation));\n        } else {\n          push(met, String(expectation));\n        }\n      });\n    });\n    this.restore();\n\n    if (messages.length > 0) {\n      mockExpectation.fail(join(concat(messages, met), \"\\n\"));\n    } else if (met.length > 0) {\n      mockExpectation.pass(join(concat(messages, met), \"\\n\"));\n    }\n\n    return true;\n  },\n  usingPromise: function usingPromise(promiseLibrary) {\n    this.promiseLibrary = promiseLibrary;\n    return this;\n  },\n  invokeMethod: function invokeMethod(method, thisValue, args) {\n    /* if we cannot find any matching files we will explicitly call mockExpection#fail with error messages */\n\n    /* eslint consistent-return: \"off\" */\n    var expectations = this.expectations && this.expectations[method] ? this.expectations[method] : [];\n    var currentArgs = args || [];\n    var available;\n    var expectationsWithMatchingArgs = filter(expectations, function (expectation) {\n      var expectedArgs = expectation.expectedArguments || [];\n      return arrayEquals(expectedArgs, currentArgs, expectation.expectsExactArgCount);\n    });\n    var expectationsToApply = filter(expectationsWithMatchingArgs, function (expectation) {\n      return !expectation.met() && expectation.allowsCall(thisValue, args);\n    });\n\n    if (expectationsToApply.length > 0) {\n      return expectationsToApply[0].apply(thisValue, args);\n    }\n\n    var messages = [];\n    var exhausted = 0;\n    forEach(expectationsWithMatchingArgs, function (expectation) {\n      if (expectation.allowsCall(thisValue, args)) {\n        available = available || expectation;\n      } else {\n        exhausted += 1;\n      }\n    });\n\n    if (available && exhausted === 0) {\n      return available.apply(thisValue, args);\n    }\n\n    forEach(expectations, function (expectation) {\n      push(messages, \"    \" + String(expectation));\n    });\n    unshift(messages, \"Unexpected call: \" + proxyCallToString.call({\n      proxy: method,\n      args: args\n    }));\n    var err = new Error();\n\n    if (!err.stack) {\n      // PhantomJS does not serialize the stack trace until the error has been thrown\n      try {\n        throw err;\n      } catch (e) {\n        /* empty */\n      }\n    }\n\n    push(this.failures, \"Unexpected call: \" + proxyCallToString.call({\n      proxy: method,\n      args: args,\n      stack: err.stack\n    }));\n    mockExpectation.fail(join(messages, \"\\n\"));\n  }\n});\nmodule.exports = mock;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/mock.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/proxy-call-util.js":
/*!*********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/proxy-call-util.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar push = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.push;\n\nexports.incrementCallCount = function incrementCallCount(proxy) {\n  proxy.called = true;\n  proxy.callCount += 1;\n  proxy.notCalled = false;\n  proxy.calledOnce = proxy.callCount === 1;\n  proxy.calledTwice = proxy.callCount === 2;\n  proxy.calledThrice = proxy.callCount === 3;\n};\n\nexports.createCallProperties = function createCallProperties(proxy) {\n  proxy.firstCall = proxy.getCall(0);\n  proxy.secondCall = proxy.getCall(1);\n  proxy.thirdCall = proxy.getCall(2);\n  proxy.lastCall = proxy.getCall(proxy.callCount - 1);\n};\n\nexports.delegateToCalls = function delegateToCalls(proxy, method, matchAny, actual, returnsValues, notCalled, totalCallCount) {\n  proxy[method] = function () {\n    if (!this.called) {\n      if (notCalled) {\n        return notCalled.apply(this, arguments);\n      }\n\n      return false;\n    }\n\n    if (totalCallCount !== undefined && this.callCount !== totalCallCount) {\n      return false;\n    }\n\n    var currentCall;\n    var matches = 0;\n    var returnValues = [];\n\n    for (var i = 0, l = this.callCount; i < l; i += 1) {\n      currentCall = this.getCall(i);\n      var returnValue = currentCall[actual || method].apply(currentCall, arguments);\n      push(returnValues, returnValue);\n\n      if (returnValue) {\n        matches += 1;\n\n        if (matchAny) {\n          return true;\n        }\n      }\n    }\n\n    if (returnsValues) {\n      return returnValues;\n    }\n\n    return matches === this.callCount;\n  };\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/proxy-call-util.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/proxy-call.js":
/*!****************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/proxy-call.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar match = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").createMatcher;\n\nvar deepEqual = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").deepEqual;\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar sinonFormat = __webpack_require__(/*! ./util/core/format */ \"./node_modules/sinon/lib/sinon/util/core/format.js\");\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar concat = arrayProto.concat;\nvar filter = arrayProto.filter;\nvar join = arrayProto.join;\nvar map = arrayProto.map;\nvar reduce = arrayProto.reduce;\nvar slice = arrayProto.slice;\n\nfunction throwYieldError(proxy, text, args) {\n  var msg = functionName(proxy) + text;\n\n  if (args.length) {\n    msg += \" Received [\" + join(slice(args), \", \") + \"]\";\n  }\n\n  throw new Error(msg);\n}\n\nvar callProto = {\n  calledOn: function calledOn(thisValue) {\n    if (match.isMatcher(thisValue)) {\n      return thisValue.test(this.thisValue);\n    }\n\n    return this.thisValue === thisValue;\n  },\n  calledWith: function calledWith() {\n    var self = this;\n    var calledWithArgs = slice(arguments);\n\n    if (calledWithArgs.length > self.args.length) {\n      return false;\n    }\n\n    return reduce(calledWithArgs, function (prev, arg, i) {\n      return prev && deepEqual(self.args[i], arg);\n    }, true);\n  },\n  calledWithMatch: function calledWithMatch() {\n    var self = this;\n    var calledWithMatchArgs = slice(arguments);\n\n    if (calledWithMatchArgs.length > self.args.length) {\n      return false;\n    }\n\n    return reduce(calledWithMatchArgs, function (prev, expectation, i) {\n      var actual = self.args[i];\n      return prev && match(expectation).test(actual);\n    }, true);\n  },\n  calledWithExactly: function calledWithExactly() {\n    return arguments.length === this.args.length && this.calledWith.apply(this, arguments);\n  },\n  notCalledWith: function notCalledWith() {\n    return !this.calledWith.apply(this, arguments);\n  },\n  notCalledWithMatch: function notCalledWithMatch() {\n    return !this.calledWithMatch.apply(this, arguments);\n  },\n  returned: function returned(value) {\n    return deepEqual(this.returnValue, value);\n  },\n  threw: function threw(error) {\n    if (typeof error === \"undefined\" || !this.exception) {\n      return Boolean(this.exception);\n    }\n\n    return this.exception === error || this.exception.name === error;\n  },\n  calledWithNew: function calledWithNew() {\n    return this.proxy.prototype && this.thisValue instanceof this.proxy;\n  },\n  calledBefore: function (other) {\n    return this.callId < other.callId;\n  },\n  calledAfter: function (other) {\n    return this.callId > other.callId;\n  },\n  calledImmediatelyBefore: function (other) {\n    return this.callId === other.callId - 1;\n  },\n  calledImmediatelyAfter: function (other) {\n    return this.callId === other.callId + 1;\n  },\n  callArg: function (pos) {\n    this.ensureArgIsAFunction(pos);\n    return this.args[pos]();\n  },\n  callArgOn: function (pos, thisValue) {\n    this.ensureArgIsAFunction(pos);\n    return this.args[pos].apply(thisValue);\n  },\n  callArgWith: function (pos) {\n    return this.callArgOnWith.apply(this, concat([pos, null], slice(arguments, 1)));\n  },\n  callArgOnWith: function (pos, thisValue) {\n    this.ensureArgIsAFunction(pos);\n    var args = slice(arguments, 2);\n    return this.args[pos].apply(thisValue, args);\n  },\n  throwArg: function (pos) {\n    if (pos > this.args.length) {\n      throw new TypeError(\"Not enough arguments: \" + pos + \" required but only \" + this.args.length + \" present\");\n    }\n\n    throw this.args[pos];\n  },\n  yield: function () {\n    return this.yieldOn.apply(this, concat([null], slice(arguments, 0)));\n  },\n  yieldOn: function (thisValue) {\n    var args = slice(this.args);\n    var yieldFn = filter(args, function (arg) {\n      return typeof arg === \"function\";\n    })[0];\n\n    if (!yieldFn) {\n      throwYieldError(this.proxy, \" cannot yield since no callback was passed.\", args);\n    }\n\n    return yieldFn.apply(thisValue, slice(arguments, 1));\n  },\n  yieldTo: function (prop) {\n    return this.yieldToOn.apply(this, concat([prop, null], slice(arguments, 1)));\n  },\n  yieldToOn: function (prop, thisValue) {\n    var args = slice(this.args);\n    var yieldArg = filter(args, function (arg) {\n      return arg && typeof arg[prop] === \"function\";\n    })[0];\n    var yieldFn = yieldArg && yieldArg[prop];\n\n    if (!yieldFn) {\n      throwYieldError(this.proxy, \" cannot yield to '\" + valueToString(prop) + \"' since no callback was passed.\", args);\n    }\n\n    return yieldFn.apply(thisValue, slice(arguments, 2));\n  },\n  toString: function () {\n    var callStr = this.proxy ? String(this.proxy) + \"(\" : \"\";\n    var formattedArgs;\n\n    if (!this.args) {\n      return \":(\";\n    }\n\n    formattedArgs = map(this.args, function (arg) {\n      return sinonFormat(arg);\n    });\n    callStr = callStr + join(formattedArgs, \", \") + \")\";\n\n    if (typeof this.returnValue !== \"undefined\") {\n      callStr += \" => \" + sinonFormat(this.returnValue);\n    }\n\n    if (this.exception) {\n      callStr += \" !\" + this.exception.name;\n\n      if (this.exception.message) {\n        callStr += \"(\" + this.exception.message + \")\";\n      }\n    }\n\n    if (this.stack) {\n      // Omit the error message and the two top stack frames in sinon itself:\n      callStr += (this.stack.split(\"\\n\")[3] || \"unknown\").replace(/^\\s*(?:at\\s+|@)?/, \" at \");\n    }\n\n    return callStr;\n  },\n  ensureArgIsAFunction: function (pos) {\n    if (typeof this.args[pos] !== \"function\") {\n      throw new TypeError(\"Expected argument at position \" + pos + \" to be a Function, but was \" + typeof this.args[pos]);\n    }\n  }\n};\nObject.defineProperty(callProto, \"stack\", {\n  enumerable: true,\n  configurable: true,\n  get: function () {\n    return this.errorWithCallStack && this.errorWithCallStack.stack || \"\";\n  }\n});\ncallProto.invokeCallback = callProto.yield;\n\nfunction createProxyCall(proxy, thisValue, args, returnValue, exception, id, errorWithCallStack) {\n  if (typeof id !== \"number\") {\n    throw new TypeError(\"Call id is not a number\");\n  }\n\n  var proxyCall = Object.create(callProto);\n  var lastArg = args.length > 0 && args[args.length - 1] || undefined;\n  var callback = lastArg && typeof lastArg === \"function\" ? lastArg : undefined;\n  proxyCall.proxy = proxy;\n  proxyCall.thisValue = thisValue;\n  proxyCall.args = args;\n  proxyCall.lastArg = lastArg;\n  proxyCall.callback = callback;\n  proxyCall.returnValue = returnValue;\n  proxyCall.exception = exception;\n  proxyCall.callId = id;\n  proxyCall.errorWithCallStack = errorWithCallStack;\n  return proxyCall;\n}\n\ncreateProxyCall.toString = callProto.toString; // used by mocks\n\nmodule.exports = createProxyCall;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/proxy-call.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/proxy-invoke.js":
/*!******************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/proxy-invoke.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar proxyCallUtil = __webpack_require__(/*! ./proxy-call-util */ \"./node_modules/sinon/lib/sinon/proxy-call-util.js\");\n\nvar push = arrayProto.push;\nvar forEach = arrayProto.forEach;\nvar concat = arrayProto.concat;\nvar ErrorConstructor = Error.prototype.constructor;\nvar bind = Function.prototype.bind;\nvar callId = 0;\n\nmodule.exports = function invoke(func, thisValue, args) {\n  var matchings = this.matchingFakes(args);\n  var currentCallId = callId++;\n  var exception, returnValue;\n  proxyCallUtil.incrementCallCount(this);\n  push(this.thisValues, thisValue);\n  push(this.args, args);\n  push(this.callIds, currentCallId);\n  forEach(matchings, function (matching) {\n    proxyCallUtil.incrementCallCount(matching);\n    push(matching.thisValues, thisValue);\n    push(matching.args, args);\n    push(matching.callIds, currentCallId);\n  }); // Make call properties available from within the spied function:\n\n  proxyCallUtil.createCallProperties(this);\n  forEach(matchings, proxyCallUtil.createCallProperties);\n\n  try {\n    this.invoking = true;\n    var thisCall = this.getCall(this.callCount - 1);\n\n    if (thisCall.calledWithNew()) {\n      // Call through with `new`\n      returnValue = new (bind.apply(this.func || func, concat([thisValue], args)))();\n\n      if (typeof returnValue !== \"object\") {\n        returnValue = thisValue;\n      }\n    } else {\n      returnValue = (this.func || func).apply(thisValue, args);\n    }\n  } catch (e) {\n    exception = e;\n  } finally {\n    delete this.invoking;\n  }\n\n  push(this.exceptions, exception);\n  push(this.returnValues, returnValue);\n  forEach(matchings, function (matching) {\n    push(matching.exceptions, exception);\n    push(matching.returnValues, returnValue);\n  });\n  var err = new ErrorConstructor(); // 1. Please do not get stack at this point. It may be so very slow, and not actually used\n  // 2. PhantomJS does not serialize the stack trace until the error has been thrown:\n  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack\n\n  try {\n    throw err;\n  } catch (e) {\n    /* empty */\n  }\n\n  push(this.errorsWithCallStack, err);\n  forEach(matchings, function (matching) {\n    push(matching.errorsWithCallStack, err);\n  }); // Make return value and exception available in the calls:\n\n  proxyCallUtil.createCallProperties(this);\n  forEach(matchings, proxyCallUtil.createCallProperties);\n\n  if (exception !== undefined) {\n    throw exception;\n  }\n\n  return returnValue;\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/proxy-invoke.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/proxy.js":
/*!***********************************************!*\
  !*** ./node_modules/sinon/lib/sinon/proxy.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar extend = __webpack_require__(/*! ./util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar functionToString = __webpack_require__(/*! ./util/core/function-to-string */ \"./node_modules/sinon/lib/sinon/util/core/function-to-string.js\");\n\nvar proxyCall = __webpack_require__(/*! ./proxy-call */ \"./node_modules/sinon/lib/sinon/proxy-call.js\");\n\nvar proxyCallUtil = __webpack_require__(/*! ./proxy-call-util */ \"./node_modules/sinon/lib/sinon/proxy-call-util.js\");\n\nvar proxyInvoke = __webpack_require__(/*! ./proxy-invoke */ \"./node_modules/sinon/lib/sinon/proxy-invoke.js\");\n\nvar sinonFormat = __webpack_require__(/*! ./util/core/format */ \"./node_modules/sinon/lib/sinon/util/core/format.js\");\n\nvar push = arrayProto.push;\nvar forEach = arrayProto.forEach;\nvar slice = arrayProto.slice;\nvar emptyFakes = Object.freeze([]); // Public API\n\nvar proxyApi = {\n  toString: functionToString,\n  named: function named(name) {\n    this.displayName = name;\n    var nameDescriptor = Object.getOwnPropertyDescriptor(this, \"name\");\n\n    if (nameDescriptor && nameDescriptor.configurable) {\n      // IE 11 functions don't have a name.\n      // Safari 9 has names that are not configurable.\n      nameDescriptor.value = name;\n      Object.defineProperty(this, \"name\", nameDescriptor);\n    }\n\n    return this;\n  },\n  invoke: proxyInvoke,\n\n  /*\n   * Hook for derived implementation to return fake instances matching the\n   * given arguments.\n   */\n  matchingFakes: function ()\n  /*args, strict*/\n  {\n    return emptyFakes;\n  },\n  getCall: function getCall(index) {\n    var i = index;\n\n    if (i < 0) {\n      // Negative indices means counting backwards from the last call\n      i += this.callCount;\n    }\n\n    if (i < 0 || i >= this.callCount) {\n      return null;\n    }\n\n    return proxyCall(this, this.thisValues[i], this.args[i], this.returnValues[i], this.exceptions[i], this.callIds[i], this.errorsWithCallStack[i]);\n  },\n  getCalls: function () {\n    var calls = [];\n    var i;\n\n    for (i = 0; i < this.callCount; i++) {\n      push(calls, this.getCall(i));\n    }\n\n    return calls;\n  },\n  calledBefore: function calledBefore(proxy) {\n    if (!this.called) {\n      return false;\n    }\n\n    if (!proxy.called) {\n      return true;\n    }\n\n    return this.callIds[0] < proxy.callIds[proxy.callIds.length - 1];\n  },\n  calledAfter: function calledAfter(proxy) {\n    if (!this.called || !proxy.called) {\n      return false;\n    }\n\n    return this.callIds[this.callCount - 1] > proxy.callIds[0];\n  },\n  calledImmediatelyBefore: function calledImmediatelyBefore(proxy) {\n    if (!this.called || !proxy.called) {\n      return false;\n    }\n\n    return this.callIds[this.callCount - 1] === proxy.callIds[proxy.callCount - 1] - 1;\n  },\n  calledImmediatelyAfter: function calledImmediatelyAfter(proxy) {\n    if (!this.called || !proxy.called) {\n      return false;\n    }\n\n    return this.callIds[this.callCount - 1] === proxy.callIds[proxy.callCount - 1] + 1;\n  },\n  formatters: __webpack_require__(/*! ./spy-formatters */ \"./node_modules/sinon/lib/sinon/spy-formatters.js\"),\n  printf: function (format) {\n    var spyInstance = this;\n    var args = slice(arguments, 1);\n    var formatter;\n    return (format || \"\").replace(/%(.)/g, function (match, specifyer) {\n      formatter = proxyApi.formatters[specifyer];\n\n      if (typeof formatter === \"function\") {\n        return String(formatter(spyInstance, args));\n      } else if (!isNaN(parseInt(specifyer, 10))) {\n        return sinonFormat(args[specifyer - 1]);\n      }\n\n      return \"%\" + specifyer;\n    });\n  },\n  resetHistory: function () {\n    if (this.invoking) {\n      var err = new Error(\"Cannot reset Sinon function while invoking it. \" + \"Move the call to .resetHistory outside of the callback.\");\n      err.name = \"InvalidResetException\";\n      throw err;\n    }\n\n    this.called = false;\n    this.notCalled = true;\n    this.calledOnce = false;\n    this.calledTwice = false;\n    this.calledThrice = false;\n    this.callCount = 0;\n    this.firstCall = null;\n    this.secondCall = null;\n    this.thirdCall = null;\n    this.lastCall = null;\n    this.args = [];\n    this.lastArg = null;\n    this.returnValues = [];\n    this.thisValues = [];\n    this.exceptions = [];\n    this.callIds = [];\n    this.errorsWithCallStack = [];\n\n    if (this.fakes) {\n      forEach(this.fakes, function (fake) {\n        fake.resetHistory();\n      });\n    }\n\n    return this;\n  }\n};\nvar delegateToCalls = proxyCallUtil.delegateToCalls;\ndelegateToCalls(proxyApi, \"calledOn\", true);\ndelegateToCalls(proxyApi, \"alwaysCalledOn\", false, \"calledOn\");\ndelegateToCalls(proxyApi, \"calledWith\", true);\ndelegateToCalls(proxyApi, \"calledOnceWith\", true, \"calledWith\", false, undefined, 1);\ndelegateToCalls(proxyApi, \"calledWithMatch\", true);\ndelegateToCalls(proxyApi, \"alwaysCalledWith\", false, \"calledWith\");\ndelegateToCalls(proxyApi, \"alwaysCalledWithMatch\", false, \"calledWithMatch\");\ndelegateToCalls(proxyApi, \"calledWithExactly\", true);\ndelegateToCalls(proxyApi, \"calledOnceWithExactly\", true, \"calledWithExactly\", false, undefined, 1);\ndelegateToCalls(proxyApi, \"alwaysCalledWithExactly\", false, \"calledWithExactly\");\ndelegateToCalls(proxyApi, \"neverCalledWith\", false, \"notCalledWith\", false, function () {\n  return true;\n});\ndelegateToCalls(proxyApi, \"neverCalledWithMatch\", false, \"notCalledWithMatch\", false, function () {\n  return true;\n});\ndelegateToCalls(proxyApi, \"threw\", true);\ndelegateToCalls(proxyApi, \"alwaysThrew\", false, \"threw\");\ndelegateToCalls(proxyApi, \"returned\", true);\ndelegateToCalls(proxyApi, \"alwaysReturned\", false, \"returned\");\ndelegateToCalls(proxyApi, \"calledWithNew\", true);\ndelegateToCalls(proxyApi, \"alwaysCalledWithNew\", false, \"calledWithNew\");\n\nfunction createProxy(func, originalFunc) {\n  var proxy = wrapFunction(func, originalFunc); // Inherit function properties:\n\n  extend(proxy, func);\n  proxy.prototype = func.prototype;\n  extend.nonEnum(proxy, proxyApi);\n  return proxy;\n}\n\nfunction wrapFunction(func, originalFunc) {\n  var arity = originalFunc.length;\n  var p; // Do not change this to use an eval. Projects that depend on sinon block the use of eval.\n  // ref: https://github.com/sinonjs/sinon/issues/710\n\n  switch (arity) {\n    /*eslint-disable no-unused-vars, max-len*/\n    case 0:\n      p = function proxy() {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 1:\n      p = function proxy(a) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 2:\n      p = function proxy(a, b) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 3:\n      p = function proxy(a, b, c) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 4:\n      p = function proxy(a, b, c, d) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 5:\n      p = function proxy(a, b, c, d, e) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 6:\n      p = function proxy(a, b, c, d, e, f) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 7:\n      p = function proxy(a, b, c, d, e, f, g) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 8:\n      p = function proxy(a, b, c, d, e, f, g, h) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 9:\n      p = function proxy(a, b, c, d, e, f, g, h, i) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 10:\n      p = function proxy(a, b, c, d, e, f, g, h, i, j) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 11:\n      p = function proxy(a, b, c, d, e, f, g, h, i, j, k) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    case 12:\n      p = function proxy(a, b, c, d, e, f, g, h, i, j, k, l) {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    default:\n      p = function proxy() {\n        return p.invoke(func, this, slice(arguments));\n      };\n\n      break;\n\n    /*eslint-enable*/\n  }\n\n  var nameDescriptor = Object.getOwnPropertyDescriptor(originalFunc, \"name\");\n\n  if (nameDescriptor && nameDescriptor.configurable) {\n    // IE 11 functions don't have a name.\n    // Safari 9 has names that are not configurable.\n    Object.defineProperty(p, \"name\", nameDescriptor);\n  }\n\n  extend.nonEnum(p, {\n    isSinonProxy: true,\n    called: false,\n    notCalled: true,\n    calledOnce: false,\n    calledTwice: false,\n    calledThrice: false,\n    callCount: 0,\n    firstCall: null,\n    secondCall: null,\n    thirdCall: null,\n    lastCall: null,\n    lastArg: null,\n    args: [],\n    returnValues: [],\n    thisValues: [],\n    exceptions: [],\n    callIds: [],\n    errorsWithCallStack: []\n  });\n  return p;\n}\n\nmodule.exports = createProxy;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/proxy.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/restore-object.js":
/*!********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/restore-object.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar walkObject = __webpack_require__(/*! ./util/core/walk-object */ \"./node_modules/sinon/lib/sinon/util/core/walk-object.js\");\n\nfunction filter(object, property) {\n  return object[property].restore && object[property].restore.sinon;\n}\n\nfunction restore(object, property) {\n  object[property].restore();\n}\n\nfunction restoreObject(object) {\n  return walkObject(restore, object, filter);\n}\n\nmodule.exports = restoreObject;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/restore-object.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/sandbox.js":
/*!*************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/sandbox.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar collectOwnMethods = __webpack_require__(/*! ./collect-own-methods */ \"./node_modules/sinon/lib/sinon/collect-own-methods.js\");\n\nvar getPropertyDescriptor = __webpack_require__(/*! ./util/core/get-property-descriptor */ \"./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js\");\n\nvar isPropertyConfigurable = __webpack_require__(/*! ./util/core/is-property-configurable */ \"./node_modules/sinon/lib/sinon/util/core/is-property-configurable.js\");\n\nvar match = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").createMatcher;\n\nvar sinonAssert = __webpack_require__(/*! ./assert */ \"./node_modules/sinon/lib/sinon/assert.js\");\n\nvar sinonClock = __webpack_require__(/*! ./util/fake-timers */ \"./node_modules/sinon/lib/sinon/util/fake-timers.js\");\n\nvar sinonMock = __webpack_require__(/*! ./mock */ \"./node_modules/sinon/lib/sinon/mock.js\");\n\nvar sinonSpy = __webpack_require__(/*! ./spy */ \"./node_modules/sinon/lib/sinon/spy.js\");\n\nvar sinonStub = __webpack_require__(/*! ./stub */ \"./node_modules/sinon/lib/sinon/stub.js\");\n\nvar sinonFake = __webpack_require__(/*! ./fake */ \"./node_modules/sinon/lib/sinon/fake.js\");\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar fakeServer = __webpack_require__(/*! nise */ \"./node_modules/nise/nise.js\").fakeServer;\n\nvar fakeXhr = __webpack_require__(/*! nise */ \"./node_modules/nise/nise.js\").fakeXhr;\n\nvar usePromiseLibrary = __webpack_require__(/*! ./util/core/use-promise-library */ \"./node_modules/sinon/lib/sinon/util/core/use-promise-library.js\");\n\nvar filter = arrayProto.filter;\nvar forEach = arrayProto.filter;\nvar push = arrayProto.push;\nvar reverse = arrayProto.reverse;\n\nfunction applyOnEach(fakes, method) {\n  var matchingFakes = filter(fakes, function (fake) {\n    return typeof fake[method] === \"function\";\n  });\n  forEach(matchingFakes, function (fake) {\n    fake[method]();\n  });\n}\n\nfunction Sandbox() {\n  var sandbox = this;\n  var collection = [];\n  var fakeRestorers = [];\n  var promiseLib;\n  sandbox.serverPrototype = fakeServer; // this is for testing only\n\n  sandbox.getFakes = function getFakes() {\n    return collection;\n  }; // this is for testing only\n\n\n  sandbox.getRestorers = function () {\n    return fakeRestorers;\n  };\n\n  sandbox.createStubInstance = function createStubInstance() {\n    var stubbed = sinonStub.createStubInstance.apply(null, arguments);\n    var ownMethods = collectOwnMethods(stubbed);\n    forEach(ownMethods, function (method) {\n      push(collection, method);\n    });\n    usePromiseLibrary(promiseLib, ownMethods);\n    return stubbed;\n  };\n\n  sandbox.inject = function inject(obj) {\n    obj.spy = function () {\n      return sandbox.spy.apply(null, arguments);\n    };\n\n    obj.stub = function () {\n      return sandbox.stub.apply(null, arguments);\n    };\n\n    obj.mock = function () {\n      return sandbox.mock.apply(null, arguments);\n    };\n\n    obj.createStubInstance = function () {\n      return sandbox.createStubInstance.apply(sandbox, arguments);\n    };\n\n    obj.fake = function () {\n      return sandbox.fake.apply(null, arguments);\n    };\n\n    obj.replace = function () {\n      return sandbox.replace.apply(null, arguments);\n    };\n\n    obj.replaceSetter = function () {\n      return sandbox.replaceSetter.apply(null, arguments);\n    };\n\n    obj.replaceGetter = function () {\n      return sandbox.replaceGetter.apply(null, arguments);\n    };\n\n    if (sandbox.clock) {\n      obj.clock = sandbox.clock;\n    }\n\n    if (sandbox.server) {\n      obj.server = sandbox.server;\n      obj.requests = sandbox.server.requests;\n    }\n\n    obj.match = match;\n    return obj;\n  };\n\n  sandbox.mock = function mock() {\n    var m = sinonMock.apply(null, arguments);\n    push(collection, m);\n    usePromiseLibrary(promiseLib, m);\n    return m;\n  };\n\n  sandbox.reset = function reset() {\n    applyOnEach(collection, \"reset\");\n    applyOnEach(collection, \"resetHistory\");\n  };\n\n  sandbox.resetBehavior = function resetBehavior() {\n    applyOnEach(collection, \"resetBehavior\");\n  };\n\n  sandbox.resetHistory = function resetHistory() {\n    function privateResetHistory(f) {\n      var method = f.resetHistory || f.reset;\n\n      if (method) {\n        method.call(f);\n      }\n    }\n\n    forEach(collection, function (fake) {\n      if (typeof fake === \"function\") {\n        privateResetHistory(fake);\n        return;\n      }\n\n      var methods = [];\n\n      if (fake.get) {\n        push(methods, fake.get);\n      }\n\n      if (fake.set) {\n        push(methods, fake.set);\n      }\n\n      forEach(methods, privateResetHistory);\n    });\n  };\n\n  sandbox.restore = function restore() {\n    if (arguments.length) {\n      throw new Error(\"sandbox.restore() does not take any parameters. Perhaps you meant stub.restore()\");\n    }\n\n    reverse(collection);\n    applyOnEach(collection, \"restore\");\n    collection = [];\n    forEach(fakeRestorers, function (restorer) {\n      restorer();\n    });\n    fakeRestorers = [];\n    sandbox.restoreContext();\n  };\n\n  sandbox.restoreContext = function restoreContext() {\n    var injectedKeys = sandbox.injectedKeys;\n    var injectInto = sandbox.injectInto;\n\n    if (!injectedKeys) {\n      return;\n    }\n\n    forEach(injectedKeys, function (injectedKey) {\n      delete injectInto[injectedKey];\n    });\n    injectedKeys = [];\n  };\n\n  function getFakeRestorer(object, property) {\n    var descriptor = getPropertyDescriptor(object, property);\n\n    function restorer() {\n      Object.defineProperty(object, property, descriptor);\n    }\n\n    restorer.object = object;\n    restorer.property = property;\n    return restorer;\n  }\n\n  function verifyNotReplaced(object, property) {\n    forEach(fakeRestorers, function (fakeRestorer) {\n      if (fakeRestorer.object === object && fakeRestorer.property === property) {\n        throw new TypeError(\"Attempted to replace \" + property + \" which is already replaced\");\n      }\n    });\n  }\n\n  sandbox.replace = function replace(object, property, replacement) {\n    var descriptor = getPropertyDescriptor(object, property);\n\n    if (typeof descriptor === \"undefined\") {\n      throw new TypeError(\"Cannot replace non-existent property \" + valueToString(property));\n    }\n\n    if (typeof replacement === \"undefined\") {\n      throw new TypeError(\"Expected replacement argument to be defined\");\n    }\n\n    if (typeof descriptor.get === \"function\") {\n      throw new Error(\"Use sandbox.replaceGetter for replacing getters\");\n    }\n\n    if (typeof descriptor.set === \"function\") {\n      throw new Error(\"Use sandbox.replaceSetter for replacing setters\");\n    }\n\n    if (typeof object[property] !== typeof replacement) {\n      throw new TypeError(\"Cannot replace \" + typeof object[property] + \" with \" + typeof replacement);\n    }\n\n    verifyNotReplaced(object, property); // store a function for restoring the replaced property\n\n    push(fakeRestorers, getFakeRestorer(object, property));\n    object[property] = replacement;\n    return replacement;\n  };\n\n  sandbox.replaceGetter = function replaceGetter(object, property, replacement) {\n    var descriptor = getPropertyDescriptor(object, property);\n\n    if (typeof descriptor === \"undefined\") {\n      throw new TypeError(\"Cannot replace non-existent property \" + valueToString(property));\n    }\n\n    if (typeof replacement !== \"function\") {\n      throw new TypeError(\"Expected replacement argument to be a function\");\n    }\n\n    if (typeof descriptor.get !== \"function\") {\n      throw new Error(\"`object.property` is not a getter\");\n    }\n\n    verifyNotReplaced(object, property); // store a function for restoring the replaced property\n\n    push(fakeRestorers, getFakeRestorer(object, property));\n    Object.defineProperty(object, property, {\n      get: replacement,\n      configurable: isPropertyConfigurable(object, property)\n    });\n    return replacement;\n  };\n\n  sandbox.replaceSetter = function replaceSetter(object, property, replacement) {\n    var descriptor = getPropertyDescriptor(object, property);\n\n    if (typeof descriptor === \"undefined\") {\n      throw new TypeError(\"Cannot replace non-existent property \" + valueToString(property));\n    }\n\n    if (typeof replacement !== \"function\") {\n      throw new TypeError(\"Expected replacement argument to be a function\");\n    }\n\n    if (typeof descriptor.set !== \"function\") {\n      throw new Error(\"`object.property` is not a setter\");\n    }\n\n    verifyNotReplaced(object, property); // store a function for restoring the replaced property\n\n    push(fakeRestorers, getFakeRestorer(object, property)); // eslint-disable-next-line accessor-pairs\n\n    Object.defineProperty(object, property, {\n      set: replacement,\n      configurable: isPropertyConfigurable(object, property)\n    });\n    return replacement;\n  };\n\n  function commonPostInitSetup(args, spy) {\n    var object = args[0];\n    var property = args[1];\n    var isSpyingOnEntireObject = typeof property === \"undefined\" && typeof object === \"object\";\n\n    if (isSpyingOnEntireObject) {\n      var ownMethods = collectOwnMethods(spy);\n      forEach(ownMethods, function (method) {\n        push(collection, method);\n      });\n      usePromiseLibrary(promiseLib, ownMethods);\n    } else {\n      push(collection, spy);\n      usePromiseLibrary(promiseLib, spy);\n    }\n\n    return spy;\n  }\n\n  sandbox.spy = function spy() {\n    var createdSpy = sinonSpy.apply(sinonSpy, arguments);\n    return commonPostInitSetup(arguments, createdSpy);\n  };\n\n  sandbox.stub = function stub() {\n    var createdStub = sinonStub.apply(sinonStub, arguments);\n    return commonPostInitSetup(arguments, createdStub);\n  }; // eslint-disable-next-line no-unused-vars\n\n\n  sandbox.fake = function fake(f) {\n    var s = sinonFake.apply(sinonFake, arguments);\n    push(collection, s);\n    return s;\n  };\n\n  forEach(Object.keys(sinonFake), function (key) {\n    var fakeBehavior = sinonFake[key];\n\n    if (typeof fakeBehavior === \"function\") {\n      sandbox.fake[key] = function () {\n        var s = fakeBehavior.apply(fakeBehavior, arguments);\n        push(collection, s);\n        return s;\n      };\n    }\n  });\n\n  sandbox.useFakeTimers = function useFakeTimers(args) {\n    var clock = sinonClock.useFakeTimers.call(null, args);\n    sandbox.clock = clock;\n    push(collection, clock);\n    return clock;\n  };\n\n  sandbox.verify = function verify() {\n    applyOnEach(collection, \"verify\");\n  };\n\n  sandbox.verifyAndRestore = function verifyAndRestore() {\n    var exception;\n\n    try {\n      sandbox.verify();\n    } catch (e) {\n      exception = e;\n    }\n\n    sandbox.restore();\n\n    if (exception) {\n      throw exception;\n    }\n  };\n\n  sandbox.useFakeServer = function useFakeServer() {\n    var proto = sandbox.serverPrototype || fakeServer;\n\n    if (!proto || !proto.create) {\n      return null;\n    }\n\n    sandbox.server = proto.create();\n    push(collection, sandbox.server);\n    return sandbox.server;\n  };\n\n  sandbox.useFakeXMLHttpRequest = function useFakeXMLHttpRequest() {\n    var xhr = fakeXhr.useFakeXMLHttpRequest();\n    push(collection, xhr);\n    return xhr;\n  };\n\n  sandbox.usingPromise = function usingPromise(promiseLibrary) {\n    promiseLib = promiseLibrary;\n    collection.promiseLibrary = promiseLibrary;\n    return sandbox;\n  };\n}\n\nSandbox.prototype.assert = sinonAssert;\nSandbox.prototype.match = match;\nmodule.exports = Sandbox;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/sandbox.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/spy-formatters.js":
/*!********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/spy-formatters.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar color = __webpack_require__(/*! ./color */ \"./node_modules/sinon/lib/sinon/color.js\");\n\nvar match = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").createMatcher;\n\nvar timesInWords = __webpack_require__(/*! ./util/core/times-in-words */ \"./node_modules/sinon/lib/sinon/util/core/times-in-words.js\");\n\nvar sinonFormat = __webpack_require__(/*! ./util/core/format */ \"./node_modules/sinon/lib/sinon/util/core/format.js\");\n\nvar jsDiff = __webpack_require__(/*! diff */ \"./node_modules/diff/dist/diff.js\");\n\nvar join = arrayProto.join;\nvar map = arrayProto.map;\nvar push = arrayProto.push;\n\nfunction colorSinonMatchText(matcher, calledArg, calledArgMessage) {\n  var calledArgumentMessage = calledArgMessage;\n\n  if (!matcher.test(calledArg)) {\n    matcher.message = color.red(matcher.message);\n\n    if (calledArgumentMessage) {\n      calledArgumentMessage = color.green(calledArgumentMessage);\n    }\n  }\n\n  return calledArgumentMessage + \" \" + matcher.message;\n}\n\nfunction colorDiffText(diff) {\n  var objects = map(diff, function (part) {\n    var text = part.value;\n\n    if (part.added) {\n      text = color.green(text);\n    } else if (part.removed) {\n      text = color.red(text);\n    }\n\n    if (diff.length === 2) {\n      text += \" \"; // format simple diffs\n    }\n\n    return text;\n  });\n  return join(objects, \"\");\n}\n\nmodule.exports = {\n  c: function (spyInstance) {\n    return timesInWords(spyInstance.callCount);\n  },\n  n: function (spyInstance) {\n    // eslint-disable-next-line local-rules/no-prototype-methods\n    return spyInstance.toString();\n  },\n  D: function (spyInstance, args) {\n    var message = \"\";\n\n    for (var i = 0, l = spyInstance.callCount; i < l; ++i) {\n      // describe multiple calls\n      if (l > 1) {\n        message += \"\\nCall \" + (i + 1) + \":\";\n      }\n\n      var calledArgs = spyInstance.getCall(i).args;\n\n      for (var j = 0; j < calledArgs.length || j < args.length; ++j) {\n        message += \"\\n\";\n        var calledArgMessage = j < calledArgs.length ? sinonFormat(calledArgs[j]) : \"\";\n\n        if (match.isMatcher(args[j])) {\n          message += colorSinonMatchText(args[j], calledArgs[j], calledArgMessage);\n        } else {\n          var expectedArgMessage = j < args.length ? sinonFormat(args[j]) : \"\";\n          var diff = jsDiff.diffJson(calledArgMessage, expectedArgMessage);\n          message += colorDiffText(diff);\n        }\n      }\n    }\n\n    return message;\n  },\n  C: function (spyInstance) {\n    var calls = [];\n\n    for (var i = 0, l = spyInstance.callCount; i < l; ++i) {\n      // eslint-disable-next-line local-rules/no-prototype-methods\n      var stringifiedCall = \"    \" + spyInstance.getCall(i).toString();\n\n      if (/\\n/.test(calls[i - 1])) {\n        stringifiedCall = \"\\n\" + stringifiedCall;\n      }\n\n      push(calls, stringifiedCall);\n    }\n\n    return calls.length > 0 ? \"\\n\" + join(calls, \"\\n\") : \"\";\n  },\n  t: function (spyInstance) {\n    var objects = [];\n\n    for (var i = 0, l = spyInstance.callCount; i < l; ++i) {\n      push(objects, sinonFormat(spyInstance.thisValues[i]));\n    }\n\n    return join(objects, \", \");\n  },\n  \"*\": function (spyInstance, args) {\n    return join(map(args, function (arg) {\n      return sinonFormat(arg);\n    }), \", \");\n  }\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/spy-formatters.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/spy.js":
/*!*********************************************!*\
  !*** ./node_modules/sinon/lib/sinon/spy.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar createProxy = __webpack_require__(/*! ./proxy */ \"./node_modules/sinon/lib/sinon/proxy.js\");\n\nvar extend = __webpack_require__(/*! ./util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar getPropertyDescriptor = __webpack_require__(/*! ./util/core/get-property-descriptor */ \"./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js\");\n\nvar deepEqual = __webpack_require__(/*! @sinonjs/samsam */ \"./node_modules/@sinonjs/samsam/lib/samsam.js\").deepEqual;\n\nvar isEsModule = __webpack_require__(/*! ./util/core/is-es-module */ \"./node_modules/sinon/lib/sinon/util/core/is-es-module.js\");\n\nvar proxyCallUtil = __webpack_require__(/*! ./proxy-call-util */ \"./node_modules/sinon/lib/sinon/proxy-call-util.js\");\n\nvar walkObject = __webpack_require__(/*! ./util/core/walk-object */ \"./node_modules/sinon/lib/sinon/util/core/walk-object.js\");\n\nvar wrapMethod = __webpack_require__(/*! ./util/core/wrap-method */ \"./node_modules/sinon/lib/sinon/util/core/wrap-method.js\");\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n/* cache references to library methods so that they also can be stubbed without problems */\n\n\nvar forEach = arrayProto.forEach;\nvar pop = arrayProto.pop;\nvar push = arrayProto.push;\nvar slice = arrayProto.slice;\nvar filter = Array.prototype.filter;\nvar uuid = 0;\n\nfunction matches(fake, args, strict) {\n  var margs = fake.matchingArguments;\n\n  if (margs.length <= args.length && deepEqual(slice(args, 0, margs.length), margs)) {\n    return !strict || margs.length === args.length;\n  }\n\n  return false;\n} // Public API\n\n\nvar spyApi = {\n  withArgs: function () {\n    var args = slice(arguments);\n    var matching = pop(this.matchingFakes(args, true));\n\n    if (matching) {\n      return matching;\n    }\n\n    var original = this;\n    var fake = this.instantiateFake();\n    fake.matchingArguments = args;\n    fake.parent = this;\n    push(this.fakes, fake);\n\n    fake.withArgs = function () {\n      return original.withArgs.apply(original, arguments);\n    };\n\n    forEach(original.args, function (arg, i) {\n      if (!matches(fake, arg)) {\n        return;\n      }\n\n      proxyCallUtil.incrementCallCount(fake);\n      push(fake.thisValues, original.thisValues[i]);\n      push(fake.args, arg);\n      push(fake.returnValues, original.returnValues[i]);\n      push(fake.exceptions, original.exceptions[i]);\n      push(fake.callIds, original.callIds[i]);\n    });\n    proxyCallUtil.createCallProperties(fake);\n    return fake;\n  },\n  // Override proxy default implementation\n  matchingFakes: function (args, strict) {\n    return filter.call(this.fakes, function (fake) {\n      return matches(fake, args, strict);\n    });\n  }\n};\n/* eslint-disable local-rules/no-prototype-methods */\n\nvar delegateToCalls = proxyCallUtil.delegateToCalls;\ndelegateToCalls(spyApi, \"callArg\", false, \"callArgWith\", true, function () {\n  throw new Error(this.toString() + \" cannot call arg since it was not yet invoked.\");\n});\nspyApi.callArgWith = spyApi.callArg;\ndelegateToCalls(spyApi, \"callArgOn\", false, \"callArgOnWith\", true, function () {\n  throw new Error(this.toString() + \" cannot call arg since it was not yet invoked.\");\n});\nspyApi.callArgOnWith = spyApi.callArgOn;\ndelegateToCalls(spyApi, \"throwArg\", false, \"throwArg\", false, function () {\n  throw new Error(this.toString() + \" cannot throw arg since it was not yet invoked.\");\n});\ndelegateToCalls(spyApi, \"yield\", false, \"yield\", true, function () {\n  throw new Error(this.toString() + \" cannot yield since it was not yet invoked.\");\n}); // \"invokeCallback\" is an alias for \"yield\" since \"yield\" is invalid in strict mode.\n\nspyApi.invokeCallback = spyApi.yield;\ndelegateToCalls(spyApi, \"yieldOn\", false, \"yieldOn\", true, function () {\n  throw new Error(this.toString() + \" cannot yield since it was not yet invoked.\");\n});\ndelegateToCalls(spyApi, \"yieldTo\", false, \"yieldTo\", true, function (property) {\n  throw new Error(this.toString() + \" cannot yield to '\" + valueToString(property) + \"' since it was not yet invoked.\");\n});\ndelegateToCalls(spyApi, \"yieldToOn\", false, \"yieldToOn\", true, function (property) {\n  throw new Error(this.toString() + \" cannot yield to '\" + valueToString(property) + \"' since it was not yet invoked.\");\n});\n/* eslint-enable local-rules/no-prototype-methods */\n\nfunction createSpy(func) {\n  var name;\n  var funk = func;\n\n  if (typeof funk !== \"function\") {\n    funk = function () {\n      return;\n    };\n  } else {\n    name = functionName(funk);\n  }\n\n  var proxy = createProxy(funk, funk); // Inherit spy API:\n\n  extend.nonEnum(proxy, spyApi);\n  extend.nonEnum(proxy, {\n    displayName: name || \"spy\",\n    fakes: [],\n    instantiateFake: createSpy,\n    id: \"spy#\" + uuid++\n  });\n  return proxy;\n}\n\nfunction spy(object, property, types) {\n  var descriptor, methodDesc;\n\n  if (isEsModule(object)) {\n    throw new TypeError(\"ES Modules cannot be spied\");\n  }\n\n  if (!property && typeof object === \"function\") {\n    return createSpy(object);\n  }\n\n  if (!property && typeof object === \"object\") {\n    return walkObject(spy, object);\n  }\n\n  if (!object && !property) {\n    return createSpy(function () {\n      return;\n    });\n  }\n\n  if (!types) {\n    return wrapMethod(object, property, createSpy(object[property]));\n  }\n\n  descriptor = {};\n  methodDesc = getPropertyDescriptor(object, property);\n  forEach(types, function (type) {\n    descriptor[type] = createSpy(methodDesc[type]);\n  });\n  return wrapMethod(object, property, descriptor);\n}\n\nextend(spy, spyApi);\nmodule.exports = spy;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/spy.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/stub.js":
/*!**********************************************!*\
  !*** ./node_modules/sinon/lib/sinon/stub.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar behavior = __webpack_require__(/*! ./behavior */ \"./node_modules/sinon/lib/sinon/behavior.js\");\n\nvar behaviors = __webpack_require__(/*! ./default-behaviors */ \"./node_modules/sinon/lib/sinon/default-behaviors.js\");\n\nvar createProxy = __webpack_require__(/*! ./proxy */ \"./node_modules/sinon/lib/sinon/proxy.js\");\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar hasOwnProperty = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object.hasOwnProperty;\n\nvar isNonExistentOwnProperty = __webpack_require__(/*! ./util/core/is-non-existent-own-property */ \"./node_modules/sinon/lib/sinon/util/core/is-non-existent-own-property.js\");\n\nvar spy = __webpack_require__(/*! ./spy */ \"./node_modules/sinon/lib/sinon/spy.js\");\n\nvar extend = __webpack_require__(/*! ./util/core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar getPropertyDescriptor = __webpack_require__(/*! ./util/core/get-property-descriptor */ \"./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js\");\n\nvar isEsModule = __webpack_require__(/*! ./util/core/is-es-module */ \"./node_modules/sinon/lib/sinon/util/core/is-es-module.js\");\n\nvar wrapMethod = __webpack_require__(/*! ./util/core/wrap-method */ \"./node_modules/sinon/lib/sinon/util/core/wrap-method.js\");\n\nvar throwOnFalsyObject = __webpack_require__(/*! ./throw-on-falsy-object */ \"./node_modules/sinon/lib/sinon/throw-on-falsy-object.js\");\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nvar walkObject = __webpack_require__(/*! ./util/core/walk-object */ \"./node_modules/sinon/lib/sinon/util/core/walk-object.js\");\n\nvar forEach = arrayProto.forEach;\nvar pop = arrayProto.pop;\nvar slice = arrayProto.slice;\nvar sort = arrayProto.sort;\nvar uuid = 0;\n\nfunction createStub(originalFunc) {\n  var proxy;\n\n  function functionStub() {\n    var args = slice(arguments);\n    var matchings = proxy.matchingFakes(args);\n    var fnStub = pop(sort(matchings, function (a, b) {\n      return a.matchingArguments.length - b.matchingArguments.length;\n    })) || proxy;\n    return getCurrentBehavior(fnStub).invoke(this, arguments);\n  }\n\n  proxy = createProxy(functionStub, originalFunc || functionStub); // Inherit spy API:\n\n  extend.nonEnum(proxy, spy); // Inherit stub API:\n\n  extend.nonEnum(proxy, stub);\n  var name = originalFunc ? functionName(originalFunc) : null;\n  extend.nonEnum(proxy, {\n    fakes: [],\n    instantiateFake: createStub,\n    displayName: name || \"stub\",\n    defaultBehavior: null,\n    behaviors: [],\n    id: \"stub#\" + uuid++\n  });\n  return proxy;\n}\n\nfunction stub(object, property) {\n  if (arguments.length > 2) {\n    throw new TypeError(\"stub(obj, 'meth', fn) has been removed, see documentation\");\n  }\n\n  if (isEsModule(object)) {\n    throw new TypeError(\"ES Modules cannot be stubbed\");\n  }\n\n  throwOnFalsyObject.apply(null, arguments);\n\n  if (isNonExistentOwnProperty(object, property)) {\n    throw new TypeError(\"Cannot stub non-existent own property \" + valueToString(property));\n  }\n\n  var actualDescriptor = getPropertyDescriptor(object, property);\n  var isObjectOrFunction = typeof object === \"object\" || typeof object === \"function\";\n  var isStubbingEntireObject = typeof property === \"undefined\" && isObjectOrFunction;\n  var isCreatingNewStub = !object && typeof property === \"undefined\";\n  var isStubbingNonFuncProperty = isObjectOrFunction && typeof property !== \"undefined\" && (typeof actualDescriptor === \"undefined\" || typeof actualDescriptor.value !== \"function\") && typeof descriptor === \"undefined\";\n\n  if (isStubbingEntireObject) {\n    return walkObject(stub, object);\n  }\n\n  if (isCreatingNewStub) {\n    return createStub();\n  }\n\n  var func = typeof actualDescriptor.value === \"function\" ? actualDescriptor.value : null;\n  var s = createStub(func);\n  extend.nonEnum(s, {\n    rootObj: object,\n    propName: property,\n    restore: function restore() {\n      if (actualDescriptor !== undefined) {\n        Object.defineProperty(object, property, actualDescriptor);\n        return;\n      }\n\n      delete object[property];\n    }\n  });\n  return isStubbingNonFuncProperty ? s : wrapMethod(object, property, s);\n}\n\nstub.createStubInstance = function (constructor, overrides) {\n  if (typeof constructor !== \"function\") {\n    throw new TypeError(\"The constructor should be a function.\");\n  }\n\n  var stubbedObject = stub(Object.create(constructor.prototype));\n  forEach(Object.keys(overrides || {}), function (propertyName) {\n    if (propertyName in stubbedObject) {\n      var value = overrides[propertyName];\n\n      if (value && value.createStubInstance) {\n        stubbedObject[propertyName] = value;\n      } else {\n        stubbedObject[propertyName].returns(value);\n      }\n    } else {\n      throw new Error(\"Cannot stub \" + propertyName + \". Property does not exist!\");\n    }\n  });\n  return stubbedObject;\n};\n/*eslint-disable no-use-before-define*/\n\n\nfunction getParentBehaviour(stubInstance) {\n  return stubInstance.parent && getCurrentBehavior(stubInstance.parent);\n}\n\nfunction getDefaultBehavior(stubInstance) {\n  return stubInstance.defaultBehavior || getParentBehaviour(stubInstance) || behavior.create(stubInstance);\n}\n\nfunction getCurrentBehavior(stubInstance) {\n  var currentBehavior = stubInstance.behaviors[stubInstance.callCount - 1];\n  return currentBehavior && currentBehavior.isPresent() ? currentBehavior : getDefaultBehavior(stubInstance);\n}\n/*eslint-enable no-use-before-define*/\n\n\nvar proto = {\n  resetBehavior: function () {\n    this.defaultBehavior = null;\n    this.behaviors = [];\n    delete this.returnValue;\n    delete this.returnArgAt;\n    delete this.throwArgAt;\n    delete this.resolveArgAt;\n    delete this.fakeFn;\n    this.returnThis = false;\n    this.resolveThis = false;\n    forEach(this.fakes, function (fake) {\n      fake.resetBehavior();\n    });\n  },\n  reset: function () {\n    this.resetHistory();\n    this.resetBehavior();\n  },\n  onCall: function onCall(index) {\n    if (!this.behaviors[index]) {\n      this.behaviors[index] = behavior.create(this);\n    }\n\n    return this.behaviors[index];\n  },\n  onFirstCall: function onFirstCall() {\n    return this.onCall(0);\n  },\n  onSecondCall: function onSecondCall() {\n    return this.onCall(1);\n  },\n  onThirdCall: function onThirdCall() {\n    return this.onCall(2);\n  },\n  withArgs: function withArgs() {\n    var fake = spy.withArgs.apply(this, arguments);\n\n    if (this.defaultBehavior && this.defaultBehavior.promiseLibrary) {\n      fake.defaultBehavior = fake.defaultBehavior || behavior.create(fake);\n      fake.defaultBehavior.promiseLibrary = this.defaultBehavior.promiseLibrary;\n    }\n\n    return fake;\n  }\n};\nforEach(Object.keys(behavior), function (method) {\n  if (hasOwnProperty(behavior, method) && !hasOwnProperty(proto, method) && method !== \"create\" && method !== \"invoke\") {\n    proto[method] = behavior.createBehavior(method);\n  }\n});\nforEach(Object.keys(behaviors), function (method) {\n  if (hasOwnProperty(behaviors, method) && !hasOwnProperty(proto, method)) {\n    behavior.addBehavior(stub, method, behaviors[method]);\n  }\n});\nextend(stub, proto);\nmodule.exports = stub;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/stub.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/throw-on-falsy-object.js":
/*!***************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/throw-on-falsy-object.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nfunction throwOnFalsyObject(object, property) {\n  if (property && !object) {\n    var type = object === null ? \"null\" : \"undefined\";\n    throw new Error(\"Trying to stub property '\" + valueToString(property) + \"' of \" + type);\n  }\n}\n\nmodule.exports = throwOnFalsyObject;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/throw-on-falsy-object.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/default-config.js":
/*!******************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/default-config.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = {\n  injectInto: null,\n  properties: [\"spy\", \"stub\", \"mock\", \"clock\", \"server\", \"requests\", \"fake\", \"replace\", \"replaceSetter\", \"replaceGetter\", \"createStubInstance\"],\n  useFakeTimers: true,\n  useFakeServer: true\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/default-config.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/export-async-behaviors.js":
/*!**************************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/export-async-behaviors.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar reduce = arrayProto.reduce;\n\nmodule.exports = function exportAsyncBehaviors(behaviorMethods) {\n  return reduce(Object.keys(behaviorMethods), function (acc, method) {\n    // need to avoid creating another async versions of the newly added async methods\n    if (method.match(/^(callsArg|yields)/) && !method.match(/Async/)) {\n      acc[method + \"Async\"] = function () {\n        var result = behaviorMethods[method].apply(this, arguments);\n        this.callbackAsync = true;\n        return result;\n      };\n    }\n\n    return acc;\n  }, {});\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/export-async-behaviors.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/extend.js":
/*!**********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/extend.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar arrayProto = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array;\n\nvar hasOwnProperty = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object.hasOwnProperty;\n\nvar join = arrayProto.join;\nvar push = arrayProto.push;\nvar slice = arrayProto.slice; // Adapted from https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug\n\nvar hasDontEnumBug = function () {\n  var obj = {\n    constructor: function () {\n      return \"0\";\n    },\n    toString: function () {\n      return \"1\";\n    },\n    valueOf: function () {\n      return \"2\";\n    },\n    toLocaleString: function () {\n      return \"3\";\n    },\n    prototype: function () {\n      return \"4\";\n    },\n    isPrototypeOf: function () {\n      return \"5\";\n    },\n    propertyIsEnumerable: function () {\n      return \"6\";\n    },\n    hasOwnProperty: function () {\n      return \"7\";\n    },\n    length: function () {\n      return \"8\";\n    },\n    unique: function () {\n      return \"9\";\n    }\n  };\n  var result = [];\n\n  for (var prop in obj) {\n    if (hasOwnProperty(obj, prop)) {\n      push(result, obj[prop]());\n    }\n  }\n\n  return join(result, \"\") !== \"0123456789\";\n}();\n\nfunction extendCommon(target, sources, doCopy) {\n  var source, i, prop;\n\n  for (i = 0; i < sources.length; i++) {\n    source = sources[i];\n\n    for (prop in source) {\n      if (hasOwnProperty(source, prop)) {\n        doCopy(target, source, prop);\n      }\n    } // Make sure we copy (own) toString method even when in JScript with DontEnum bug\n    // See https://developer.mozilla.org/en/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug\n\n\n    if (hasDontEnumBug && hasOwnProperty(source, \"toString\") && source.toString !== target.toString) {\n      target.toString = source.toString;\n    }\n  }\n\n  return target;\n}\n/** Public: Extend target in place with all (own) properties from sources in-order. Thus, last source will\n *         override properties in previous sources.\n *\n * @arg {Object} target - The Object to extend\n * @arg {Object[]} sources - Objects to copy properties from.\n *\n * @returns {Object} the extended target\n */\n\n\nmodule.exports = function extend(target\n/*, sources */\n) {\n  var sources = slice(arguments, 1);\n  return extendCommon(target, sources, function copyValue(dest, source, prop) {\n    dest[prop] = source[prop];\n  });\n};\n/** Public: Extend target in place with all (own) properties from sources in-order. Thus, last source will\n *         override properties in previous sources. Define the properties as non enumerable.\n *\n * @arg {Object} target - The Object to extend\n * @arg {Object[]} sources - Objects to copy properties from.\n *\n * @returns {Object} the extended target\n */\n\n\nmodule.exports.nonEnum = function extendNonEnum(target\n/*, sources */\n) {\n  var sources = slice(arguments, 1);\n  return extendCommon(target, sources, function copyProperty(dest, source, prop) {\n    Object.defineProperty(dest, prop, {\n      value: source[prop],\n      enumerable: false,\n      configurable: true,\n      writable: true\n    });\n  });\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/extend.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/format.js":
/*!**********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/format.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar formatio = __webpack_require__(/*! @sinonjs/formatio */ \"./node_modules/@sinonjs/formatio/lib/formatio.js\");\n\nvar formatter = formatio.configure({\n  quoteStrings: false,\n  limitChildrenCount: 250\n});\nvar customFormatter;\n\nfunction format() {\n  if (customFormatter) {\n    return customFormatter.apply(null, arguments);\n  }\n\n  return formatter.ascii.apply(formatter, arguments);\n}\n\nformat.setFormatter = function (aCustomFormatter) {\n  if (typeof aCustomFormatter !== \"function\") {\n    throw new Error(\"format.setFormatter must be called with a function\");\n  }\n\n  customFormatter = aCustomFormatter;\n};\n\nmodule.exports = format;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/format.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/function-to-string.js":
/*!**********************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/function-to-string.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function toString() {\n  var i, prop, thisValue;\n\n  if (this.getCall && this.callCount) {\n    i = this.callCount;\n\n    while (i--) {\n      thisValue = this.getCall(i).thisValue;\n\n      for (prop in thisValue) {\n        if (thisValue[prop] === this) {\n          return prop;\n        }\n      }\n    }\n  }\n\n  return this.displayName || \"sinon fake\";\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/function-to-string.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/get-next-tick.js":
/*!*****************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/get-next-tick.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/* istanbul ignore next : not testing that setTimeout works */\n\nfunction nextTick(callback) {\n  setTimeout(callback, 0);\n}\n\nmodule.exports = function getNextTick(process, setImmediate) {\n  if (typeof process === \"object\" && typeof process.nextTick === \"function\") {\n    return process.nextTick;\n  }\n\n  if (typeof setImmediate === \"function\") {\n    return setImmediate;\n  }\n\n  return nextTick;\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/get-next-tick.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function getPropertyDescriptor(object, property) {\n  var proto = object;\n  var descriptor;\n\n  while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, property))) {\n    proto = Object.getPrototypeOf(proto);\n  }\n\n  return descriptor;\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/is-es-module.js":
/*!****************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/is-es-module.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * Verify if an object is a ECMAScript Module\n *\n * As the exports from a module is immutable we cannot alter the exports\n * using spies or stubs. Let the consumer know this to avoid bug reports\n * on weird error messages.\n *\n * @param {Object} object The object to examine\n *\n * @returns {Boolean} true when the object is a module\n */\n\nmodule.exports = function (object) {\n  return object && typeof Symbol !== \"undefined\" && object[Symbol.toStringTag] === \"Module\" && Object.isSealed(object);\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/is-es-module.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/is-non-existent-own-property.js":
/*!********************************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/is-non-existent-own-property.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction isNonExistentOwnProperty(object, property) {\n  return object && typeof property !== \"undefined\" && !(property in object);\n}\n\nmodule.exports = isNonExistentOwnProperty;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/is-non-existent-own-property.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/is-property-configurable.js":
/*!****************************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/is-property-configurable.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar getPropertyDescriptor = __webpack_require__(/*! ./get-property-descriptor */ \"./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js\");\n\nfunction isPropertyConfigurable(obj, propName) {\n  var propertyDescriptor = getPropertyDescriptor(obj, propName);\n  return propertyDescriptor ? propertyDescriptor.configurable : true;\n}\n\nmodule.exports = isPropertyConfigurable;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/is-property-configurable.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/next-tick.js":
/*!*************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/next-tick.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar globalObject = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").global;\n\nvar getNextTick = __webpack_require__(/*! ./get-next-tick */ \"./node_modules/sinon/lib/sinon/util/core/get-next-tick.js\");\n\nmodule.exports = getNextTick(globalObject.process, globalObject.setImmediate);\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/next-tick.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/times-in-words.js":
/*!******************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/times-in-words.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar array = [null, \"once\", \"twice\", \"thrice\"];\n\nmodule.exports = function timesInWords(count) {\n  return array[count] || (count || 0) + \" times\";\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/times-in-words.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/use-promise-library.js":
/*!***********************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/use-promise-library.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar forEach = Array.prototype.forEach;\n\nfunction usePromiseLibrary(library, fakes) {\n  if (typeof library === \"undefined\") {\n    return;\n  }\n\n  if (Array.isArray(fakes)) {\n    forEach.call(fakes, usePromiseLibrary.bind(null, library));\n    return;\n  }\n\n  if (typeof fakes.usingPromise === \"function\") {\n    fakes.usingPromise(library);\n  }\n}\n\nmodule.exports = usePromiseLibrary;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/use-promise-library.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/walk-object.js":
/*!***************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/walk-object.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar functionName = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").functionName;\n\nvar getPropertyDescriptor = __webpack_require__(/*! ./get-property-descriptor */ \"./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js\");\n\nvar walk = __webpack_require__(/*! ./walk */ \"./node_modules/sinon/lib/sinon/util/core/walk.js\");\n\nfunction walkObject(predicate, object, filter) {\n  var called = false;\n  var name = functionName(predicate);\n\n  if (!object) {\n    throw new Error(\"Trying to \" + name + \" object but received \" + String(object));\n  }\n\n  walk(object, function (prop, propOwner) {\n    // we don't want to stub things like toString(), valueOf(), etc. so we only stub if the object\n    // is not Object.prototype\n    if (propOwner !== Object.prototype && prop !== \"constructor\" && typeof getPropertyDescriptor(propOwner, prop).value === \"function\") {\n      if (filter) {\n        if (filter(object, prop)) {\n          called = true;\n          predicate(object, prop);\n        }\n      } else {\n        called = true;\n        predicate(object, prop);\n      }\n    }\n  });\n\n  if (!called) {\n    throw new Error(\"Expected to \" + name + \" methods on object but found none\");\n  }\n\n  return object;\n}\n\nmodule.exports = walkObject;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/walk-object.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/walk.js":
/*!********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/walk.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar forEach = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.array.forEach;\n\nfunction walkInternal(obj, iterator, context, originalObj, seen) {\n  var proto, prop;\n\n  if (typeof Object.getOwnPropertyNames !== \"function\") {\n    // We explicitly want to enumerate through all of the prototype's properties\n    // in this case, therefore we deliberately leave out an own property check.\n\n    /* eslint-disable-next-line guard-for-in */\n    for (prop in obj) {\n      iterator.call(context, obj[prop], prop, obj);\n    }\n\n    return;\n  }\n\n  forEach(Object.getOwnPropertyNames(obj), function (k) {\n    if (seen[k] !== true) {\n      seen[k] = true;\n      var target = typeof Object.getOwnPropertyDescriptor(obj, k).get === \"function\" ? originalObj : obj;\n      iterator.call(context, k, target);\n    }\n  });\n  proto = Object.getPrototypeOf(obj);\n\n  if (proto) {\n    walkInternal(proto, iterator, context, originalObj, seen);\n  }\n}\n/* Walks the prototype chain of an object and iterates over every own property\n * name encountered. The iterator is called in the same fashion that Array.prototype.forEach\n * works, where it is passed the value, key, and own object as the 1st, 2nd, and 3rd positional\n * argument, respectively. In cases where Object.getOwnPropertyNames is not available, walk will\n * default to using a simple for..in loop.\n *\n * obj - The object to walk the prototype chain for.\n * iterator - The function to be called on each pass of the walk.\n * context - (Optional) When given, the iterator will be called with this object as the receiver.\n */\n\n\nmodule.exports = function walk(obj, iterator, context) {\n  return walkInternal(obj, iterator, context, obj, {});\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/walk.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/core/wrap-method.js":
/*!***************************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/core/wrap-method.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar getPropertyDescriptor = __webpack_require__(/*! ./get-property-descriptor */ \"./node_modules/sinon/lib/sinon/util/core/get-property-descriptor.js\");\n\nvar extend = __webpack_require__(/*! ./extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar hasOwnProperty = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").prototypes.object.hasOwnProperty;\n\nvar valueToString = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").valueToString;\n\nfunction isFunction(obj) {\n  return typeof obj === \"function\" || Boolean(obj && obj.constructor && obj.call && obj.apply);\n}\n\nfunction mirrorProperties(target, source) {\n  for (var prop in source) {\n    if (!hasOwnProperty(target, prop)) {\n      target[prop] = source[prop];\n    }\n  }\n} // Cheap way to detect if we have ES5 support.\n\n\nvar hasES5Support = (\"keys\" in Object);\n\nmodule.exports = function wrapMethod(object, property, method) {\n  if (!object) {\n    throw new TypeError(\"Should wrap property of object\");\n  }\n\n  if (typeof method !== \"function\" && typeof method !== \"object\") {\n    throw new TypeError(\"Method wrapper should be a function or a property descriptor\");\n  }\n\n  function checkWrappedMethod(wrappedMethod) {\n    var error;\n\n    if (!isFunction(wrappedMethod)) {\n      error = new TypeError(\"Attempted to wrap \" + typeof wrappedMethod + \" property \" + valueToString(property) + \" as function\");\n    } else if (wrappedMethod.restore && wrappedMethod.restore.sinon) {\n      error = new TypeError(\"Attempted to wrap \" + valueToString(property) + \" which is already wrapped\");\n    } else if (wrappedMethod.calledBefore) {\n      var verb = wrappedMethod.returns ? \"stubbed\" : \"spied on\";\n      error = new TypeError(\"Attempted to wrap \" + valueToString(property) + \" which is already \" + verb);\n    }\n\n    if (error) {\n      if (wrappedMethod && wrappedMethod.stackTraceError) {\n        error.stack += \"\\n--------------\\n\" + wrappedMethod.stackTraceError.stack;\n      }\n\n      throw error;\n    }\n  }\n\n  var error, wrappedMethod, i, wrappedMethodDesc;\n\n  function simplePropertyAssignment() {\n    wrappedMethod = object[property];\n    checkWrappedMethod(wrappedMethod);\n    object[property] = method;\n    method.displayName = property;\n  } // Firefox has a problem when using hasOwn.call on objects from other frames.\n\n  /* eslint-disable-next-line local-rules/no-prototype-methods */\n\n\n  var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwnProperty(object, property);\n\n  if (hasES5Support) {\n    var methodDesc = typeof method === \"function\" ? {\n      value: method\n    } : method;\n    wrappedMethodDesc = getPropertyDescriptor(object, property);\n\n    if (!wrappedMethodDesc) {\n      error = new TypeError(\"Attempted to wrap \" + typeof wrappedMethod + \" property \" + property + \" as function\");\n    } else if (wrappedMethodDesc.restore && wrappedMethodDesc.restore.sinon) {\n      error = new TypeError(\"Attempted to wrap \" + property + \" which is already wrapped\");\n    }\n\n    if (error) {\n      if (wrappedMethodDesc && wrappedMethodDesc.stackTraceError) {\n        error.stack += \"\\n--------------\\n\" + wrappedMethodDesc.stackTraceError.stack;\n      }\n\n      throw error;\n    }\n\n    var types = Object.keys(methodDesc);\n\n    for (i = 0; i < types.length; i++) {\n      wrappedMethod = wrappedMethodDesc[types[i]];\n      checkWrappedMethod(wrappedMethod);\n    }\n\n    mirrorProperties(methodDesc, wrappedMethodDesc);\n\n    for (i = 0; i < types.length; i++) {\n      mirrorProperties(methodDesc[types[i]], wrappedMethodDesc[types[i]]);\n    }\n\n    Object.defineProperty(object, property, methodDesc); // catch failing assignment\n    // this is the converse of the check in `.restore` below\n\n    if (typeof method === \"function\" && object[property] !== method) {\n      // correct any wrongdoings caused by the defineProperty call above,\n      // such as adding new items (if object was a Storage object)\n      delete object[property];\n      simplePropertyAssignment();\n    }\n  } else {\n    simplePropertyAssignment();\n  }\n\n  extend.nonEnum(method, {\n    displayName: property,\n    wrappedMethod: wrappedMethod,\n    // Set up an Error object for a stack trace which can be used later to find what line of\n    // code the original method was created on.\n    stackTraceError: new Error(\"Stack Trace for original\"),\n    restore: function () {\n      // For prototype properties try to reset by delete first.\n      // If this fails (ex: localStorage on mobile safari) then force a reset\n      // via direct assignment.\n      if (!owned) {\n        // In some cases `delete` may throw an error\n        try {\n          delete object[property];\n        } catch (e) {} // eslint-disable-line no-empty\n        // For native code functions `delete` fails without throwing an error\n        // on Chrome < 43, PhantomJS, etc.\n\n      } else if (hasES5Support) {\n        Object.defineProperty(object, property, wrappedMethodDesc);\n      }\n\n      if (hasES5Support) {\n        var descriptor = getPropertyDescriptor(object, property);\n\n        if (descriptor && descriptor.value === method) {\n          object[property] = wrappedMethod;\n        }\n      } else {\n        // Use strict equality comparison to check failures then force a reset\n        // via direct assignment.\n        if (object[property] === method) {\n          object[property] = wrappedMethod;\n        }\n      }\n    }\n  });\n  method.restore.sinon = true;\n\n  if (!hasES5Support) {\n    mirrorProperties(method, wrappedMethod);\n  }\n\n  return method;\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/core/wrap-method.js?");

/***/ }),

/***/ "./node_modules/sinon/lib/sinon/util/fake-timers.js":
/*!**********************************************************!*\
  !*** ./node_modules/sinon/lib/sinon/util/fake-timers.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar extend = __webpack_require__(/*! ./core/extend */ \"./node_modules/sinon/lib/sinon/util/core/extend.js\");\n\nvar llx = __webpack_require__(/*! lolex */ \"./node_modules/lolex/lolex.js\");\n\nvar globalObject = __webpack_require__(/*! @sinonjs/commons */ \"./node_modules/@sinonjs/commons/lib/index.js\").global;\n\nfunction createClock(config, globalCtx) {\n  var llxCtx = llx;\n\n  if (globalCtx !== null && typeof globalCtx === \"object\") {\n    llxCtx = llx.withGlobal(globalCtx);\n  }\n\n  var clock = llxCtx.install(config);\n  clock.restore = clock.uninstall;\n  return clock;\n}\n\nfunction addIfDefined(obj, globalPropName) {\n  var globalProp = globalObject[globalPropName];\n\n  if (typeof globalProp !== \"undefined\") {\n    obj[globalPropName] = globalProp;\n  }\n}\n/**\n * @param {number|Date|Object} dateOrConfig The unix epoch value to install with (default 0)\n * @returns {Object} Returns a lolex clock instance\n */\n\n\nexports.useFakeTimers = function (dateOrConfig) {\n  var hasArguments = typeof dateOrConfig !== \"undefined\";\n  var argumentIsDateLike = (typeof dateOrConfig === \"number\" || dateOrConfig instanceof Date) && arguments.length === 1;\n  var argumentIsObject = dateOrConfig !== null && typeof dateOrConfig === \"object\" && arguments.length === 1;\n\n  if (!hasArguments) {\n    return createClock({\n      now: 0\n    });\n  }\n\n  if (argumentIsDateLike) {\n    return createClock({\n      now: dateOrConfig\n    });\n  }\n\n  if (argumentIsObject) {\n    var config = extend.nonEnum({}, dateOrConfig);\n    var globalCtx = config.global;\n    delete config.global;\n    return createClock(config, globalCtx);\n  }\n\n  throw new TypeError(\"useFakeTimers expected epoch or config object. See https://github.com/sinonjs/sinon\");\n};\n\nexports.clock = {\n  create: function (now) {\n    return llx.createClock(now);\n  }\n};\nvar timers = {\n  setTimeout: setTimeout,\n  clearTimeout: clearTimeout,\n  setInterval: setInterval,\n  clearInterval: clearInterval,\n  Date: Date\n};\naddIfDefined(timers, \"setImmediate\");\naddIfDefined(timers, \"clearImmediate\");\nexports.timers = timers;\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/sinon/lib/sinon/util/fake-timers.js?");

/***/ }),

/***/ "./node_modules/supports-color/browser.js":
/*!************************************************!*\
  !*** ./node_modules/supports-color/browser.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = {\n  stdout: false,\n  stderr: false\n};\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/supports-color/browser.js?");

/***/ }),

/***/ "./node_modules/type-detect/type-detect.js":
/*!*************************************************!*\
  !*** ./node_modules/type-detect/type-detect.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("(function (global, factory) {\n   true ? module.exports = factory() : undefined;\n})(this, function () {\n  'use strict';\n  /* !\n   * type-detect\n   * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>\n   * MIT Licensed\n   */\n\n  var promiseExists = typeof Promise === 'function';\n  /* eslint-disable no-undef */\n\n  var globalObject = typeof self === 'object' ? self : global; // eslint-disable-line id-blacklist\n\n  var symbolExists = typeof Symbol !== 'undefined';\n  var mapExists = typeof Map !== 'undefined';\n  var setExists = typeof Set !== 'undefined';\n  var weakMapExists = typeof WeakMap !== 'undefined';\n  var weakSetExists = typeof WeakSet !== 'undefined';\n  var dataViewExists = typeof DataView !== 'undefined';\n  var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';\n  var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';\n  var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';\n  var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';\n  var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());\n  var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());\n  var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';\n  var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());\n  var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';\n  var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());\n  var toStringLeftSliceLength = 8;\n  var toStringRightSliceLength = -1;\n  /**\n   * ### typeOf (obj)\n   *\n   * Uses `Object.prototype.toString` to determine the type of an object,\n   * normalising behaviour across engine versions & well optimised.\n   *\n   * @param {Mixed} object\n   * @return {String} object type\n   * @api public\n   */\n\n  function typeDetect(obj) {\n    /* ! Speed optimisation\n     * Pre:\n     *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)\n     *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)\n     *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)\n     *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)\n     *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)\n     * Post:\n     *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)\n     *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)\n     *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)\n     *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)\n     *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)\n     */\n    var typeofObj = typeof obj;\n\n    if (typeofObj !== 'object') {\n      return typeofObj;\n    }\n    /* ! Speed optimisation\n     * Pre:\n     *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)\n     * Post:\n     *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)\n     */\n\n\n    if (obj === null) {\n      return 'null';\n    }\n    /* ! Spec Conformance\n     * Test: `Object.prototype.toString.call(window)``\n     *  - Node === \"[object global]\"\n     *  - Chrome === \"[object global]\"\n     *  - Firefox === \"[object Window]\"\n     *  - PhantomJS === \"[object Window]\"\n     *  - Safari === \"[object Window]\"\n     *  - IE 11 === \"[object Window]\"\n     *  - IE Edge === \"[object Window]\"\n     * Test: `Object.prototype.toString.call(this)``\n     *  - Chrome Worker === \"[object global]\"\n     *  - Firefox Worker === \"[object DedicatedWorkerGlobalScope]\"\n     *  - Safari Worker === \"[object DedicatedWorkerGlobalScope]\"\n     *  - IE 11 Worker === \"[object WorkerGlobalScope]\"\n     *  - IE Edge Worker === \"[object WorkerGlobalScope]\"\n     */\n\n\n    if (obj === globalObject) {\n      return 'global';\n    }\n    /* ! Speed optimisation\n     * Pre:\n     *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)\n     * Post:\n     *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)\n     */\n\n\n    if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {\n      return 'Array';\n    } // Not caching existence of `window` and related properties due to potential\n    // for `window` to be unset before tests in quasi-browser environments.\n\n\n    if (typeof window === 'object' && window !== null) {\n      /* ! Spec Conformance\n       * (https://html.spec.whatwg.org/multipage/browsers.html#location)\n       * WhatWG HTML$7.7.3 - The `Location` interface\n       * Test: `Object.prototype.toString.call(window.location)``\n       *  - IE <=11 === \"[object Object]\"\n       *  - IE Edge <=13 === \"[object Object]\"\n       */\n      if (typeof window.location === 'object' && obj === window.location) {\n        return 'Location';\n      }\n      /* ! Spec Conformance\n       * (https://html.spec.whatwg.org/#document)\n       * WhatWG HTML$3.1.1 - The `Document` object\n       * Note: Most browsers currently adher to the W3C DOM Level 2 spec\n       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)\n       *       which suggests that browsers should use HTMLTableCellElement for\n       *       both TD and TH elements. WhatWG separates these.\n       *       WhatWG HTML states:\n       *         > For historical reasons, Window objects must also have a\n       *         > writable, configurable, non-enumerable property named\n       *         > HTMLDocument whose value is the Document interface object.\n       * Test: `Object.prototype.toString.call(document)``\n       *  - Chrome === \"[object HTMLDocument]\"\n       *  - Firefox === \"[object HTMLDocument]\"\n       *  - Safari === \"[object HTMLDocument]\"\n       *  - IE <=10 === \"[object Document]\"\n       *  - IE 11 === \"[object HTMLDocument]\"\n       *  - IE Edge <=13 === \"[object HTMLDocument]\"\n       */\n\n\n      if (typeof window.document === 'object' && obj === window.document) {\n        return 'Document';\n      }\n\n      if (typeof window.navigator === 'object') {\n        /* ! Spec Conformance\n         * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)\n         * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray\n         * Test: `Object.prototype.toString.call(navigator.mimeTypes)``\n         *  - IE <=10 === \"[object MSMimeTypesCollection]\"\n         */\n        if (typeof window.navigator.mimeTypes === 'object' && obj === window.navigator.mimeTypes) {\n          return 'MimeTypeArray';\n        }\n        /* ! Spec Conformance\n         * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)\n         * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray\n         * Test: `Object.prototype.toString.call(navigator.plugins)``\n         *  - IE <=10 === \"[object MSPluginsCollection]\"\n         */\n\n\n        if (typeof window.navigator.plugins === 'object' && obj === window.navigator.plugins) {\n          return 'PluginArray';\n        }\n      }\n\n      if ((typeof window.HTMLElement === 'function' || typeof window.HTMLElement === 'object') && obj instanceof window.HTMLElement) {\n        /* ! Spec Conformance\n        * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)\n        * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`\n        * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``\n        *  - IE <=10 === \"[object HTMLBlockElement]\"\n        */\n        if (obj.tagName === 'BLOCKQUOTE') {\n          return 'HTMLQuoteElement';\n        }\n        /* ! Spec Conformance\n         * (https://html.spec.whatwg.org/#htmltabledatacellelement)\n         * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`\n         * Note: Most browsers currently adher to the W3C DOM Level 2 spec\n         *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)\n         *       which suggests that browsers should use HTMLTableCellElement for\n         *       both TD and TH elements. WhatWG separates these.\n         * Test: Object.prototype.toString.call(document.createElement('td'))\n         *  - Chrome === \"[object HTMLTableCellElement]\"\n         *  - Firefox === \"[object HTMLTableCellElement]\"\n         *  - Safari === \"[object HTMLTableCellElement]\"\n         */\n\n\n        if (obj.tagName === 'TD') {\n          return 'HTMLTableDataCellElement';\n        }\n        /* ! Spec Conformance\n         * (https://html.spec.whatwg.org/#htmltableheadercellelement)\n         * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`\n         * Note: Most browsers currently adher to the W3C DOM Level 2 spec\n         *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)\n         *       which suggests that browsers should use HTMLTableCellElement for\n         *       both TD and TH elements. WhatWG separates these.\n         * Test: Object.prototype.toString.call(document.createElement('th'))\n         *  - Chrome === \"[object HTMLTableCellElement]\"\n         *  - Firefox === \"[object HTMLTableCellElement]\"\n         *  - Safari === \"[object HTMLTableCellElement]\"\n         */\n\n\n        if (obj.tagName === 'TH') {\n          return 'HTMLTableHeaderCellElement';\n        }\n      }\n    }\n    /* ! Speed optimisation\n    * Pre:\n    *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)\n    *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)\n    *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)\n    *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)\n    *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)\n    *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)\n    *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)\n    *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)\n    *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)\n    * Post:\n    *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)\n    *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)\n    *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)\n    *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)\n    *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)\n    *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)\n    *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)\n    *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)\n    *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)\n    */\n\n\n    var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];\n\n    if (typeof stringTag === 'string') {\n      return stringTag;\n    }\n\n    var objPrototype = Object.getPrototypeOf(obj);\n    /* ! Speed optimisation\n    * Pre:\n    *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)\n    *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)\n    * Post:\n    *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)\n    *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)\n    */\n\n    if (objPrototype === RegExp.prototype) {\n      return 'RegExp';\n    }\n    /* ! Speed optimisation\n    * Pre:\n    *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)\n    * Post:\n    *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)\n    */\n\n\n    if (objPrototype === Date.prototype) {\n      return 'Date';\n    }\n    /* ! Spec Conformance\n     * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)\n     * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be \"Promise\":\n     * Test: `Object.prototype.toString.call(Promise.resolve())``\n     *  - Chrome <=47 === \"[object Object]\"\n     *  - Edge <=20 === \"[object Object]\"\n     *  - Firefox 29-Latest === \"[object Promise]\"\n     *  - Safari 7.1-Latest === \"[object Promise]\"\n     */\n\n\n    if (promiseExists && objPrototype === Promise.prototype) {\n      return 'Promise';\n    }\n    /* ! Speed optimisation\n    * Pre:\n    *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)\n    * Post:\n    *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)\n    */\n\n\n    if (setExists && objPrototype === Set.prototype) {\n      return 'Set';\n    }\n    /* ! Speed optimisation\n    * Pre:\n    *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)\n    * Post:\n    *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)\n    */\n\n\n    if (mapExists && objPrototype === Map.prototype) {\n      return 'Map';\n    }\n    /* ! Speed optimisation\n    * Pre:\n    *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)\n    * Post:\n    *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)\n    */\n\n\n    if (weakSetExists && objPrototype === WeakSet.prototype) {\n      return 'WeakSet';\n    }\n    /* ! Speed optimisation\n    * Pre:\n    *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)\n    * Post:\n    *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)\n    */\n\n\n    if (weakMapExists && objPrototype === WeakMap.prototype) {\n      return 'WeakMap';\n    }\n    /* ! Spec Conformance\n     * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)\n     * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be \"DataView\":\n     * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``\n     *  - Edge <=13 === \"[object Object]\"\n     */\n\n\n    if (dataViewExists && objPrototype === DataView.prototype) {\n      return 'DataView';\n    }\n    /* ! Spec Conformance\n     * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)\n     * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be \"Map Iterator\":\n     * Test: `Object.prototype.toString.call(new Map().entries())``\n     *  - Edge <=13 === \"[object Object]\"\n     */\n\n\n    if (mapExists && objPrototype === mapIteratorPrototype) {\n      return 'Map Iterator';\n    }\n    /* ! Spec Conformance\n     * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)\n     * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be \"Set Iterator\":\n     * Test: `Object.prototype.toString.call(new Set().entries())``\n     *  - Edge <=13 === \"[object Object]\"\n     */\n\n\n    if (setExists && objPrototype === setIteratorPrototype) {\n      return 'Set Iterator';\n    }\n    /* ! Spec Conformance\n     * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)\n     * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be \"Array Iterator\":\n     * Test: `Object.prototype.toString.call([][Symbol.iterator]())``\n     *  - Edge <=13 === \"[object Object]\"\n     */\n\n\n    if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {\n      return 'Array Iterator';\n    }\n    /* ! Spec Conformance\n     * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)\n     * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be \"String Iterator\":\n     * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``\n     *  - Edge <=13 === \"[object Object]\"\n     */\n\n\n    if (stringIteratorExists && objPrototype === stringIteratorPrototype) {\n      return 'String Iterator';\n    }\n    /* ! Speed optimisation\n    * Pre:\n    *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)\n    * Post:\n    *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)\n    */\n\n\n    if (objPrototype === null) {\n      return 'Object';\n    }\n\n    return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);\n  }\n\n  return typeDetect;\n});\n\n//# sourceURL=webpack://__ember_auto_import__/./node_modules/type-detect/type-detect.js?");

/***/ })

}]);//# sourceMappingURL=test-support.map