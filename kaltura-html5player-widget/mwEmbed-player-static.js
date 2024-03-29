/**
 * @license
 * Kaltura html5 video library ( code name mwEmbed )
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * @copyright (C) 2010 Kaltura
 * @author Michael Dale ( michael.dale at kaltura.com )
 *
 * @url http://www.kaltura.org/project/HTML5_Video_Media_JavaScript_Library
 *
 * Libraries used carry code license in headers
 */
/*@cc_on@if(@_jscript_version<9){'video audio source itext playlist'.replace(/\w+/g,function(n){document.createElement(n)})}@end@*/

var mwResourceLoaderDate = "2011-01-24T12:19:33-06:00";
var mwResourceLoaderRequestKey =
  "mwEmbedmw.EmbedPlayermw.PlayerControlBuilderj.fn.hoverIntentj.uij.widgetj.ui.mousej.ui.slidermw.PlayerSkinKskinmw.PlayerSkinMvpcfmw.EmbedPlayerNativemw.EmbedPlayerJavamw.EmbedPlayerVlcmw.EmbedPlayerKplayermw.EmbedPlayerGenericj.cookieJSONmw.TimedTextj.fn.menu_";
"video audio source track".replace(/\w+/g, function (n) {
  document.createElement(n);
});
if (typeof window.mw == "undefined") {
  window.mw = {};
}
var MW_EMBED_VERSION = "1.1h";
if (typeof preMwEmbedReady == "undefined") {
  var preMwEmbedReady = [];
}
if (typeof preMwEmbedConfig == "undefined") {
  var preMwEmbedConfig = [];
}
(function (mw) {
  mw.version = MW_EMBED_VERSION;
  mw.validSkins = ["mvpcf", "kskin"];
  if (!mw.style) {
    mw.style = {};
  }
  if (!mwConfig) {
    var mwConfig = {};
  }
  if (!mwNonDefaultConfigList) {
    var mwNonDefaultConfigList = [];
  }
  var mwUserConfig = {};
  mw.setConfig = function (name, value) {
    if (typeof name == "object") {
      for (var i in name) {
        mw.setConfig(i, name[i]);
      }
      return;
    }
    mwConfig[name] = value;
    mwNonDefaultConfigList.push(name);
  };
  mw.setConfig(preMwEmbedConfig);
  mw.mergeConfig = function (name, value) {
    if (typeof name == "object") {
      $j.each(name, function (inx, val) {
        mw.setConfig(inx, val);
      });
      return;
    }
    if (typeof value == "object" && typeof mwConfig[name] == "object") {
      if (
        value.constructor.toString().indexOf("Array") != -1 &&
        mwConfig[name].constructor.toString().indexOf("Array") != -1
      ) {
        mwConfig[name] = $j.merge(mwConfig[name], value);
      } else {
        for (var i in value) {
          mwConfig[name][i] = value[i];
        }
      }
      return;
    }
    mwConfig[name] = value;
    mwNonDefaultConfigList.push(name);
  };
  mw.setDefaultConfig = function (name, value) {
    if (typeof name == "object") {
      for (var i in name) {
        mw.setDefaultConfig(i, name[i]);
      }
      return;
    }
    if (typeof mwConfig[name] == "undefined") {
      mwConfig[name] = value;
      return;
    }
  };
  mw.getConfig = function (name) {
    if (mwConfig[name]) return mwConfig[name];
    return false;
  };
  mw.getNonDefaultConfigObject = function () {
    var nonDefaultConfig = {};
    for (var i = 0; i < mwNonDefaultConfigList.length; i++) {
      var configKey = mwNonDefaultConfigList[i];
      nonDefaultConfig[configKey] = mw.getConfig(configKey);
    }
    return nonDefaultConfig;
  };
  var setupUserConfigFlag = false;
  mw.setupUserConfig = function (callback) {
    if (setupUserConfigFlag) {
      if (callback) {
        callback();
      }
      return;
    }
    mw.load(["$j.cookie", "JSON"], function () {
      if ($j.cookie("mwUserConfig")) {
        mwUserConfig = JSON.parse($j.cookie("mwUserConfig"));
      }
      setupUserConfigFlag = true;
      if (callback) {
        callback();
      }
    });
  };
  mw.setUserConfig = function (name, value, cookieOptions) {
    if (!setupUserConfigFlag) {
      return false;
    }
    mwUserConfig[name] = value;
    $j.cookie("mwUserConfig", JSON.stringify(mwUserConfig));
  };
  mw.getUserConfig = function (name) {
    if (mwUserConfig[name]) return mwUserConfig[name];
    return false;
  };
  mw.addHookSystem = function (targetObj) {
    targetObj["hooks"] = {};
    targetObj.addHook = function (hookName, hookFunction) {
      if (!this.hooks[hookName]) {
        this.hooks[hookName] = [];
      }
      this.hooks[hookName].push(hookFunction);
    };
    targetObj.runHook = function (hookName, options) {
      if (this.hooks[hookName]) {
        for (var i = 0; i < this.hooks[hookName].length; i++) {
          if (typeof this.hooks[hookName][i] == "function") {
            this.hooks[hookName][i](options);
          }
        }
      }
    };
  };
  mw.addHookSystem(mw);
  var mwLoadDoneCB = {};
  mw.loader = {
    moduleLoaders: [],
    moduleLoadQueue: {},
    resourcePaths: {},
    requestedResourceQueue: {},
    resourceStyleDependency: {},
    load: function (loadRequest, instanceCallback) {
      var _this = this;
      loadRequest = this.cleanLoadRequest(loadRequest);
      var callback = function () {
        if (instanceCallback) {
          instanceCallback(loadRequest);
          instanceCallback = null;
        }
      };
      if (mw.isEmpty(loadRequest)) {
        callback(loadRequest);
        return;
      }
      if (typeof loadRequest == "object") {
        if (loadRequest.length > 1) {
          this.loadMany(loadRequest, callback);
          return;
        } else {
          loadRequest = loadRequest[0];
        }
      }
      if (this.moduleLoaders[loadRequest]) {
        var resourceSet = this.getModuleResourceSet(loadRequest);
        if (!resourceSet) {
          return;
        }
        this.load(resourceSet, callback);
        return;
      }
      if (this.getResourcePath(loadRequest)) {
        this.loadResource(loadRequest, callback);
        return;
      }
      if (loadRequest) {
        if (typeof this.requestedResourceQueue[loadRequest] == "object") {
          this.requestedResourceQueue[loadRequest].push(callback);
          return;
        } else {
          this.requestedResourceQueue[loadRequest] = [];
        }
        if (loadRequest.indexOf(".js") == -1 && !mw.getResourceLoaderPath()) {
        }
        mw.getScript(loadRequest, function () {
          while (_this.requestedResourceQueue[loadRequest].length) {
            _this.requestedResourceQueue[loadRequest].shift()(loadRequest);
          }
          callback(loadRequest);
          _this.requestedResourceQueue[loadRequest] = [];
        });
        return;
      }
    },
    getModuleResourceSet: function (moduleName) {
      if (typeof this.moduleLoaders[moduleName] == "function") {
        return this.moduleLoaders[moduleName]();
      } else if (typeof this.moduleLoaders[moduleName] == "object") {
        return this.moduleLoaders[moduleName];
      }
      return false;
    },
    cleanLoadRequest: function (loadRequest) {
      var cleanRequest = [];
      if (!loadRequest) {
        return [];
      }
      if (typeof loadRequest == "string") return loadRequest;
      for (var i = 0; i < loadRequest.length; i++) {
        if (typeof loadRequest[i] == "object") {
          cleanRequest[i] = this.cleanLoadRequest(loadRequest[i]);
        } else if (typeof loadRequest[i] == "string") {
          cleanRequest[i] = $j.trim(loadRequest[i]);
        } else {
        }
      }
      return cleanRequest;
    },
    loadMany: function (loadSet, callback) {
      var _this = this;
      var loadStates = {};
      if (mw.getResourceLoaderPath()) {
        loadStates = this.getGroupLoadState(loadSet);
        if (mw.isEmpty(loadStates)) {
          callback();
          return;
        }
      } else {
        if (typeof loadSet[0] == "object") {
          _this.dependencyChainCallFlag[loadSet] = false;
          _this.loadDependencyChain(loadSet, callback);
          return;
        }
        for (var i = 0; i < loadSet.length; i++) {
          var loadName = loadSet[i];
          loadStates[loadName] = 0;
        }
      }
      for (var loadName in loadStates) {
        this.load(loadName, function (loadName) {
          loadStates[loadName] = 1;
          var loadDone = true;
          for (var j in loadStates) {
            if (loadStates[j] === 0) loadDone = false;
          }
          if (loadDone) {
            callback(loadName);
          }
        });
      }
    },
    getGroupLoadState: function (loadSet) {
      var groupedLoadSet = [];
      var loadStates = {};
      if (typeof loadSet[0] == "object") {
        for (var i = 0; i < loadSet.length; i++) {
          for (var j = 0; j < loadSet[i].length; j++) {
            groupedLoadSet.push(loadSet[i][j]);
          }
        }
      } else {
        groupedLoadSet = loadSet;
      }
      var groupClassKey = "";
      var coma = "";
      var uniqueResourceName = {};
      for (var i = 0; i < groupedLoadSet.length; i++) {
        var loadName = groupedLoadSet[i];
        if (this.getResourcePath(loadName)) {
          if (!mw.isset(loadName) && !uniqueResourceName[loadName]) {
            groupClassKey += coma + loadName;
            coma = ",";
            if (this.resourceStyleDependency[loadName]) {
              groupClassKey += coma + this.resourceStyleDependency[loadName];
            }
          }
        } else if (this.moduleLoaders[loadName]) {
          if (groupClassKey != "") {
            loadStates[groupClassKey] = 0;
            groupClassKey = coma = "";
          }
          if (!uniqueResourceName[loadName]) {
            loadStates[loadName] = 0;
          }
        }
        uniqueResourceName[loadName] = true;
      }
      if (groupClassKey != "") {
        loadStates[groupClassKey] = 0;
      }
      return loadStates;
    },
    dependencyChainCallFlag: {},
    loadDependencyChain: function (loadChain, callback) {
      var _this = this;
      var callSet = loadChain.shift();
      this.load(callSet, function (cbname) {
        if (loadChain.length != 0) {
          _this.loadDependencyChain(loadChain, callback);
        } else {
          if (_this.dependencyChainCallFlag[callSet] == callback) {
            return;
          }
          _this.dependencyChainCallFlag[callSet] = callback;
          callback();
        }
      });
    },
    addToModuleLoaderQueue: function (moduleName, resourceSet, callback) {
      if (this.moduleLoadQueue[moduleName]) {
        this.moduleLoadQueue[moduleName].functionQueue.push(callback);
      } else {
        this.moduleLoadQueue[moduleName] = {
          resourceSet: resourceSet,
          functionQueue: [callback],
          loaded: false,
        };
      }
    },
    runModuleLoadQueue: function () {
      var _this = this;
      var runModuleFunctionQueue = function () {
        for (var moduleName in _this.moduleLoadQueue) {
          while (_this.moduleLoadQueue[moduleName].functionQueue.length) {
            _this.moduleLoadQueue[moduleName].functionQueue.shift()();
          }
        }
      };
      if (
        !mw.getResourceLoaderPath() ||
        mw.getConfig("loader.groupStrategy") == "single"
      ) {
        var fullResourceList = [];
        for (var moduleName in this.moduleLoadQueue) {
          var resourceSet = this.moduleLoadQueue[moduleName].resourceSet;
          fullResourceList = $j.merge(fullResourceList, resourceSet);
        }
        mw.load(fullResourceList, function () {
          runModuleFunctionQueue();
        });
        return;
      }
      if (mw.getConfig("loader.groupStrategy") == "module") {
        var fullResourceList = [];
        var sharedResourceList = [];
        for (var moduleName in this.moduleLoadQueue) {
          var moduleResourceList = this.getFlatModuleResourceList(moduleName);
          for (var i = 0; i < moduleResourceList.length; i++) {
            var moduleResource = moduleResourceList[i];
            if (fullResourceList[moduleResource]) {
              if ($j.inArray(moduleResource, sharedResourceList) == -1) {
                sharedResourceList.push(moduleResource);
              }
            }
            fullResourceList[moduleResource] = true;
          }
        }
        var moduleRequestSet = {};
        for (var moduleName in this.moduleLoadQueue) {
          moduleRequestSet[moduleName] = [];
          var moduleResourceList = this.getFlatModuleResourceList(moduleName);
          for (var i = 0; i < moduleResourceList.length; i++) {
            var moduleResource = moduleResourceList[i];
            if ($j.inArray(moduleResource, sharedResourceList) == -1) {
              moduleRequestSet[moduleName].push(moduleResource);
            }
          }
        }
        var sharedResourceLoadDone = false;
        var checkModulesDone = function () {
          if (!sharedResourceLoadDone) {
            return false;
          }
          for (var moduleName in _this.moduleLoadQueue) {
            if (!_this.moduleLoadQueue[moduleName].loaded) {
              return false;
            }
          }
          runModuleFunctionQueue();
        };
        var localLoadCallInstance = function (moduleName, resourceSet) {
          mw.load(resourceSet, function () {
            _this.moduleLoadQueue[moduleName].loaded = true;
            checkModulesDone();
          });
        };
        mw.load(sharedResourceList, function () {
          sharedResourceLoadDone = true;
          checkModulesDone();
        });
        for (var moduleName in moduleRequestSet) {
          localLoadCallInstance(moduleName, moduleRequestSet[moduleName]);
        }
      }
    },
    getFlatModuleResourceList: function (moduleName) {
      var moduleList = [];
      for (var j in this.moduleLoadQueue[moduleName].resourceSet) {
        if (
          typeof this.moduleLoadQueue[moduleName].resourceSet[j] == "object"
        ) {
          moduleList = $j.merge(
            moduleList,
            this.moduleLoadQueue[moduleName].resourceSet[j]
          );
        } else {
          moduleList = $j.merge(moduleList, [
            this.moduleLoadQueue[moduleName].resourceSet[j],
          ]);
        }
      }
      return moduleList;
    },
    loadResource: function (resourceName, callback) {
      var _this = this;
      if (this.resourceStyleDependency[resourceName]) {
        if (!mw.isset(this.resourceStyleDependency[resourceName])) {
          _this.loadResource(
            this.resourceStyleDependency[resourceName],
            function () {
              _this.loadResource(resourceName, callback);
            }
          );
          return;
        }
      }
      if (mw.isset(resourceName)) {
        callback(resourceName);
        return;
      }
      var scriptRequest = null;
      if (mw.getResourceLoaderPath()) {
        scriptRequest = resourceName;
      } else {
        var baseClassPath = this.getResourcePath(resourceName);
        if (
          baseClassPath.indexOf("/") !== 0 &&
          baseClassPath.indexOf("://") === -1
        ) {
          scriptRequest = mw.getMwEmbedPath() + baseClassPath;
        } else {
          scriptRequest = baseClassPath;
        }
        if (!scriptRequest) {
          return false;
        }
      }
      var resourceDone = false;
      mw.setLoadDoneCB(resourceName, callback);
      mw.getScript(scriptRequest, function (scriptRequest) {
        var ext = scriptRequest
          .substr(scriptRequest.split("?")[0].lastIndexOf("."), 4)
          .toLowerCase();
        if (ext == ".css" && resourceName.substr(0, 8) == "mw.style") {
          mw.style[resourceName.substr(9)] = true;
        }
        if (!mw.isset(resourceName) && mwLoadDoneCB[resourceName] != "done") {
        }
        if (mw.currentClassMissingMessages) {
          mw.currentClassMissingMessages = false;
          mw.loadResourceMessages(resourceName, function () {
            mw.loadDone(resourceName);
          });
        } else {
          if (!mw.getResourceLoaderPath()) {
            mw.waitForObject(resourceName, function (resourceName) {
              mw.loadDone(resourceName);
            });
          } else {
          }
        }
      });
    },
    addModuleLoader: function (name, moduleLoader) {
      this.moduleLoaders[name] = moduleLoader;
    },
    addResourcePaths: function (resourceSet) {
      var prefix = mw.getConfig("loaderContext")
        ? mw.getConfig("loaderContext")
        : "";
      for (var i in resourceSet) {
        this.resourcePaths[i] = prefix + resourceSet[i];
      }
    },
    addStyleResourceDependency: function (resourceSet) {
      for (var i in resourceSet) {
        this.resourceStyleDependency[i] = resourceSet[i];
      }
    },
    getResourcePath: function (resourceName) {
      if (this.resourcePaths[resourceName])
        return this.resourcePaths[resourceName];
      return false;
    },
  };
  mw.loadDone = function (requestName) {
    if (!mwLoadDoneCB[requestName]) {
      return true;
    }
    while (mwLoadDoneCB[requestName].length) {
      if (typeof mwLoadDoneCB[requestName] != "object") {
        break;
      }
      var func = mwLoadDoneCB[requestName].pop();
      if (typeof func == "function") {
        func(requestName);
      } else {
      }
    }
    mwLoadDoneCB[requestName] = "done";
  };
  mw.setLoadDoneCB = function (requestName, callback) {
    if (mwLoadDoneCB[requestName] == "done") {
      callback(requestName);
    }
    if (typeof mwLoadDoneCB[requestName] != "object") {
      mwLoadDoneCB[requestName] = [];
    }
    mwLoadDoneCB[requestName].push(callback);
  };
  mw.load = function (loadRequest, callback) {
    return mw.loader.load(loadRequest, callback);
  };
  mw.addModuleLoader = function (name, loaderFunction) {
    return mw.loader.addModuleLoader(name, loaderFunction);
  };
  mw.addResourcePaths = function (resourceSet) {
    return mw.loader.addResourcePaths(resourceSet);
  };
  mw.addStyleResourceDependency = function (resourceSet) {
    return mw.loader.addStyleResourceDependency(resourceSet);
  };
  mw.getResourcePath = function (resourceName) {
    return mw.loader.getResourcePath(resourceName);
  };
  mw.addLoaderDialog = function (dialogHtml) {
    if (typeof dialogHtml == "undefined") {
      dialogHtml = "";
    }
    var $dialog = mw.addDialog({
      title: dialogHtml,
      content: dialogHtml + "<br>" + $j("<div />").loadingSpinner().html(),
    });
    return $dialog;
  };
  mw.closeLoaderDialog = function () {
    if (!mw.isset("$j.ui.dialog")) {
      return false;
    }
    setTimeout(function () {
      $j("#mwTempLoaderDialog").dialog("destroy");
    }, 10);
  };
  mw.addDialog = function (options) {
    $j("#mwTempLoaderDialog").remove();
    if (!options) {
      options = {};
    }
    var options = $j.extend(
      {
        bgiframe: true,
        draggable: true,
        resizable: false,
        modal: true,
        position: ["center", "center"],
      },
      options
    );
    if (!options.title || !options.content) {
      return;
    }
    $j("body").append(
      $j("<div />")
        .attr({ id: "mwTempLoaderDialog", title: options.title })
        .hide()
        .append(options.content)
    );
    var uiRequest = ["$j.ui.dialog"];
    if (options.draggable) {
      uiRequest.push("$j.ui.mouse");
      uiRequest.push("$j.ui.draggable");
    }
    if (options.resizable) {
      uiRequest.push("$j.ui.resizable");
    }
    if (typeof options.buttons == "string") {
      var buttonMsg = options.buttons;
      buttons = {};
      options.buttons[buttonMsg] = function () {
        $j(this).dialog("close");
      };
    }
    mw.load(
      [["$j.ui", "$j.widget", "$j.ui.mouse", "$j.ui.position"], uiRequest],
      function () {
        var $dialog = $j("#mwTempLoaderDialog").show().dialog(options);
      }
    );
    return $j("#mwTempLoaderDialog");
  };
  mw.isIphone = function () {
    return navigator.userAgent.indexOf("iPhone") != -1 && !mw.isIpad();
  };
  mw.isIphone4 = function () {
    return (
      mw.isIphone() && window.devicePixelRatio && window.devicePixelRatio >= 2
    );
  };
  mw.isIpod = function () {
    return navigator.userAgent.indexOf("iPod") != -1;
  };
  mw.isIpad = function () {
    return navigator.userAgent.indexOf("iPad") != -1;
  };
  mw.isAndroid2 = function () {
    return navigator.userAgent.indexOf("Android 2.") != -1;
  };
  mw.isHTML5FallForwardNative = function () {
    if (mw.isMobileHTML5()) {
      return true;
    }
    if (document.URL.indexOf("forceMobileHTML5") != -1) {
      return true;
    }
    if (mw.supportsFlash()) {
      return false;
    }
    if (mw.supportsHTML5()) {
      return true;
    }
    return false;
  };
  mw.isMobileHTML5 = function () {
    if (mw.isIphone() || mw.isIpod() || mw.isIpad() || mw.isAndroid2()) {
      return true;
    }
    return false;
  };
  mw.supportsHTML5 = function () {
    if (navigator.userAgent.indexOf("BlackBerry") != -1) {
      return false;
    }
    var dummyvid = document.createElement("video");
    if (dummyvid.canPlayType) {
      return true;
    }
    return false;
  };
  mw.supportsFlash = function () {
    if (navigator.mimeTypes && navigator.mimeTypes.length > 0) {
      for (var i = 0; i < navigator.mimeTypes.length; i++) {
        var type = navigator.mimeTypes[i].type;
        var semicolonPos = type.indexOf(";");
        if (semicolonPos > -1) {
          type = type.substr(0, semicolonPos);
        }
        if (type == "application/x-shockwave-flash") {
          return true;
        }
      }
    }
    var hasObj = true;
    if (typeof ActiveXObject != "undefined") {
      try {
        var obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      } catch (e) {
        hasObj = false;
      }
      if (hasObj) {
        return true;
      }
    }
    return false;
  };
  mw.isset = function (objectPath) {
    if (!objectPath || typeof objectPath != "string") {
      return false;
    }
    var pathSet = objectPath.split(".");
    var cur_path = "";
    for (var p = 0; p < pathSet.length; p++) {
      cur_path =
        cur_path == "" ? cur_path + pathSet[p] : cur_path + "." + pathSet[p];
      eval("var ptest = typeof ( " + cur_path + " ); ");
      if (ptest == "undefined") {
        return false;
      }
    }
    return true;
  };
  var waitTime = 1200;
  mw.waitForObject = function (objectName, callback, _callNumber) {
    if (!_callNumber) {
      _callNumber = 1;
    } else {
      _callNumber++;
    }
    if (_callNumber > waitTime) {
      callback(false);
      return;
    }
    if (mw.isset(objectName) || mwLoadDoneCB[objectName] == "done") {
      callback(objectName);
    } else {
      setTimeout(function () {
        mw.waitForObject(objectName, callback, _callNumber);
      }, 25);
    }
  };
  mw.isEmpty = function (object) {
    if (typeof object == "string") {
      if (object == "") return true;
      return false;
    }
    if (
      Object.prototype.toString.call(object) === "[object Array]" &&
      object.length == 0
    ) {
      return true;
    }
    for (var i in object) {
      return false;
    }
    return true;
  };
  mw.log = function (string) {
    if (mw.getConfig("Mw.LogPrepend")) {
      string = mw.getConfig("Mw.LogPrepend") + string;
    }
    if (window.console) {
      window.console.log(string);
    } else {
    }
  };
  mw.getCallStack = function () {
    var stringifyArguments = function (args) {
      for (var i = 0; i < args.length; ++i) {
        var arg = args[i];
        if (arg === undefined) {
          args[i] = "undefined";
        } else if (arg === null) {
          args[i] = "null";
        } else if (arg.constructor) {
          if (arg.constructor === Array) {
            if (arg.length < 3) {
              args[i] = "[" + stringifyArguments(arg) + "]";
            } else {
              args[i] =
                "[" +
                stringifyArguments(Array.prototype.slice.call(arg, 0, 1)) +
                "..." +
                stringifyArguments(Array.prototype.slice.call(arg, -1)) +
                "]";
            }
          } else if (arg.constructor === Object) {
            args[i] = "#object";
          } else if (arg.constructor === Function) {
            args[i] = "#function";
          } else if (arg.constructor === String) {
            args[i] = '"' + arg + '"';
          }
        }
      }
      return args.join(",");
    };
    var getStack = function (curr) {
      var ANON = "{anonymous}",
        fnRE = /function\s*([\w\-$]+)?\s*\(/i,
        stack = [],
        fn,
        args,
        maxStackSize = 100;
      while (curr && stack.length < maxStackSize) {
        fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
        args = Array.prototype.slice.call(curr["arguments"]);
        stack[stack.length] = fn + "(" + stringifyArguments(args) + ")";
        curr = curr.caller;
      }
      return stack;
    };
    var stack = getStack(arguments.callee);
    return stack;
  };
  var mwOnLoadFunctions = [];
  var mwReadyFlag = false;
  mw.ready = function (callback) {
    if (mwReadyFlag === false) {
      mwOnLoadFunctions.push(callback);
    } else {
      callback();
    }
  };
  mw.runReadyFunctions = function () {
    while (preMwEmbedReady.length) {
      preMwEmbedReady.shift()();
    }
    while (mwOnLoadFunctions.length) {
      mwOnLoadFunctions.shift()();
    }
    mwReadyFlag = true;
    setTimeout(function () {
      mw.loader.runModuleLoadQueue();
    }, 1);
  };
  mw.getScript = function (scriptRequest, callback) {
    var myCallback = function () {
      if (callback) {
        callback(scriptRequest);
      }
    };
    var scriptLoaderPath = mw.getResourceLoaderPath();
    var isResourceName =
      scriptRequest.indexOf("://") == -1 && scriptRequest.indexOf("/") !== 0
        ? true
        : false;
    var ext = scriptRequest
      .substr(scriptRequest.lastIndexOf("."), 4)
      .toLowerCase();
    var isCssFile = ext == ".css" ? true : false;
    if (scriptLoaderPath && isResourceName) {
      url = scriptLoaderPath + "?class=" + scriptRequest;
    } else {
      url = isResourceName ? mw.getMwEmbedPath() : "";
      url += scriptRequest;
    }
    url += url.indexOf("?") == -1 ? "?" : "&";
    url += mw.getUrlParam();
    if (!isCssFile) {
    }
    if (
      mw.isset("window.jQuery") &&
      mw.getConfig("debug") === false &&
      typeof $j != "undefined" &&
      mw.parseUri(url).protocal != "file" &&
      !isCssFile
    ) {
      $j.getScript(url, myCallback);
      return;
    }
    if (isCssFile) {
      mw.getStyleSheet(url, myCallback);
      return;
    }
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.setAttribute("src", url);
    script.onload = script.onreadystatechange = function () {
      if (
        !this.readyState ||
        this.readyState == "loaded" ||
        this.readyState == "complete"
      ) {
        myCallback();
      }
    };
    head.appendChild(script);
  };
  mw.addStyleString = function (cssResourceName, cssString) {
    if (mw.style[cssResourceName]) {
      return true;
    }
    mw.style[cssResourceName] = true;
    var styleNode = document.createElement("style");
    styleNode.type = "text/css";
    if (window.attachEvent && !window.opera) {
      styleNode.styleSheet.cssText = cssString;
    } else {
      var styleText = document.createTextNode(cssString);
      styleNode.appendChild(styleText);
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(styleNode);
  };
  mw.getStyleSheet = function (url, callback) {
    if (url.indexOf("?") == -1) {
      url += "?" + mw.getUrlParam();
    }
    var foundSheet = false;
    $j("link").each(function () {
      var currentSheet = $j(this).attr("href");
      var sheetParts = currentSheet.split("?");
      var urlParts = url.split("?");
      if (sheetParts[0] == urlParts[0] && sheetParts[1]) {
        if (
          sheetParts[1].split("&").sort().join("") ==
          urlParts[1].split("&").sort().join("")
        ) {
          foundSheet = true;
        }
      }
    });
    if (foundSheet) {
      if (callback) {
        callback();
      }
      return;
    }
    $j("head").append(
      $j("<link />").attr({ rel: "stylesheet", type: "text/css", href: url })
    );
    if (callback) {
      callback();
    }
  };
  mw.getRelativeMwEmbedPath = function () {
    return mw.getMwEmbedPath(true);
  };
  mw.getMwEmbedPath = function (relativePath) {
    var src = mw.getMwEmbedSrc();
    var mwpath = null;
    if (src.indexOf("mwEmbed.js") !== -1) {
      alert(
        "Direct Refrece to mwEmbed is no longer suported, please update to ResourceLoader.php?class=window.jQuery,mwEmbed& instead"
      );
      mwpath = src.substr(0, src.indexOf("mwEmbed.js"));
    }
    if (src.indexOf("mwResourceLoader.php") !== -1) {
      mwpath =
        src.substr(0, src.indexOf("mwResourceLoader.php")) +
        mw.getConfig("mediaWikiEmbedPath");
    }
    if (src.indexOf("ResourceLoader.php") !== -1) {
      mwpath = src.substr(0, src.indexOf("ResourceLoader.php"));
    }
    if (src.indexOf("mwEmbed-") !== -1 && src.indexOf("-static") !== -1) {
      mwpath = src.substr(0, src.indexOf("mwEmbed-"));
    }
    if (mwpath === null) {
      return;
    }
    if (!relativePath) {
      mwpath = mw.absoluteUrl(mwpath);
    }
    return mwpath;
  };
  mw.getResourceLoaderPath = function () {
    var src = mw.getMwEmbedSrc();
    if (
      src.indexOf("mwResourceLoader.php") !== -1 ||
      src.indexOf("ResourceLoader.php") !== -1
    ) {
      return src.split("?")[0];
    }
    return false;
  };
  mw.seconds2npt = function (sec, verbose) {
    if (isNaN(sec)) {
      return "0:00:00";
    }
    var tm = mw.seconds2Measurements(sec);
    if (verbose) {
      tm.seconds = Math.round(tm.seconds * 1000) / 1000;
    } else {
      tm.seconds = Math.round(tm.seconds);
    }
    if (tm.seconds < 10) {
      tm.seconds = "0" + tm.seconds;
    }
    if (tm.hours == 0 && !verbose) {
      hoursStr = "";
    } else {
      if (tm.minutes < 10 && verbose) {
        tm.minutes = "0" + tm.minutes;
      }
      if (tm.hours < 10 && verbose) {
        tm.hours = "0" + tm.hours;
      }
      hoursStr = tm.hours + ":";
    }
    return hoursStr + tm.minutes + ":" + tm.seconds;
  };
  mw.seconds2Measurements = function (sec) {
    var tm = {};
    tm.days = Math.floor(sec / (3600 * 24));
    tm.hours = Math.floor(sec / 3600);
    tm.minutes = Math.floor((sec / 60) % 60);
    tm.seconds = sec % 60;
    return tm;
  };
  mw.npt2seconds = function (npt_str) {
    if (!npt_str) {
      return 0;
    }
    npt_str = npt_str.replace(/npt:|s/g, "");
    var hour = 0;
    var min = 0;
    var sec = 0;
    times = npt_str.split(":");
    if (times.length == 3) {
      sec = times[2];
      min = times[1];
      hour = times[0];
    } else if (times.length == 2) {
      sec = times[1];
      min = times[0];
    } else {
      sec = times[0];
    }
    sec = sec.replace(/,\s?/, ".");
    return parseInt(hour * 3600) + parseInt(min * 60) + parseFloat(sec);
  };
  var mwEmbedSrc = null;
  mw.getMwEmbedSrc = function () {
    if (mwEmbedSrc) {
      return mwEmbedSrc;
    }
    var js_elements = document.getElementsByTagName("script");
    for (var i = 0; i < js_elements.length; i++) {
      var src = js_elements[i].getAttribute("src");
      if (src) {
        if (
          (src.indexOf("mwEmbed.js") !== -1 &&
            src.indexOf("MediaWiki:Gadget") == -1) ||
          ((src.indexOf("mwResourceLoader.php") !== -1 ||
            src.indexOf("ResourceLoader.php") !== -1) &&
            src.indexOf("mwEmbed") !== -1) ||
          (src.indexOf("mwEmbed") !== -1 && src.indexOf("static") !== -1)
        ) {
          mwEmbedSrc = src;
          return mwEmbedSrc;
        }
      }
    }
    return false;
  };
  var mwUrlParam = null;
  mw.getUrlParam = function () {
    if (mwUrlParam) {
      return mwUrlParam;
    }
    var mwEmbedSrc = mw.getMwEmbedSrc();
    var req_param = "";
    var urid = mw.parseUri(mwEmbedSrc).queryKey["urid"];
    if (mw.parseUri(mwEmbedSrc).queryKey["debug"] == "true") {
      mw.setConfig("debug", true);
      var d = new Date();
      req_param += "urid=" + d.getTime() + "&debug=true";
    } else if (urid) {
      req_param += "urid=" + urid;
    } else {
      req_param += "urid=" + mw.version;
    }
    var langKey = mw.parseUri(mwEmbedSrc).queryKey["uselang"];
    if (langKey) req_param += "&uselang=" + langKey;
    mwUrlParam = req_param;
    return mwUrlParam;
  };
  mw.replaceUrlParams = function (url, newParams) {
    var parsedUrl = mw.parseUri(url);
    if (parsedUrl.protocol != "") {
      var new_url =
        parsedUrl.protocol + "://" + parsedUrl.authority + parsedUrl.path + "?";
    } else {
      var new_url = parsedUrl.path + "?";
    }
    for (var key in newParams) {
      parsedUrl.queryKey[key] = newParams[key];
    }
    var amp = "";
    for (var key in parsedUrl.queryKey) {
      var val = parsedUrl.queryKey[key];
      new_url += amp + key + "=" + val;
      amp = "&";
    }
    return new_url;
  };
  mw.parseUri = function (str) {
    var o = mw.parseUri.options,
      m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
      uri = {},
      i = 14;
    while (i--) uri[o.key[i]] = m[i] || "";
    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });
    return uri;
  };
  mw.parseUri.options = {
    strictMode: false,
    key: [
      "source",
      "protocol",
      "authority",
      "userInfo",
      "user",
      "password",
      "host",
      "port",
      "relative",
      "path",
      "directory",
      "file",
      "query",
      "anchor",
    ],
    q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
    parser: {
      strict:
        /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:
        /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
    },
  };
  mw.absoluteUrl = function (src, contextUrl) {
    var parsedSrc = mw.parseUri(src);
    if (parsedSrc.protocol != "") {
      return src;
    }
    if (!contextUrl) {
      contextUrl = document.URL;
    }
    var parsedUrl = mw.parseUri(contextUrl);
    if (parsedUrl.directory == "" && parsedUrl.protocol == "file") {
      var fileUrl = contextUrl.split("\\");
      fileUrl.pop();
      return fileUrl.join("\\") + "\\" + src;
    }
    if (src.indexOf("/") === 0) {
      return parsedUrl.protocol + "://" + parsedUrl.authority + src;
    } else {
      return (
        parsedUrl.protocol +
        "://" +
        parsedUrl.authority +
        parsedUrl.directory +
        src
      );
    }
  };
  mw.isUrl = function (src) {
    var parsedSrc = mw.parseUri(src);
    return parsedSrc.host != parsedSrc.source;
  };
  mw.escapeQuotes = function (text) {
    var re = new RegExp("'", "g");
    text = text.replace(re, "\\'");
    re = new RegExp("\\n", "g");
    text = text.replace(re, "\\n");
    return mw.escapeQuotesHTML(text);
  };
  mw.escapeQuotesHTML = function (text) {
    var replaceMap = { "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" };
    for (var i in replaceMap) {
      text = text.split(i).join(replaceMap[i]);
    }
    return text;
  };
  var mwSetupFunctions = [];
  mw.addSetupHook = function (callback) {
    mwSetupFunctions.push(callback);
  };
  var mwSetupFlag = false;
  mw.setupMwEmbed = function () {
    if (mwSetupFlag) {
      return;
    }
    mwSetupFlag = true;
    mw.checkCoreLoaderFile(function () {
      mw.load("window.jQuery", function () {
        if (!window["$j"]) {
          window["$j"] = jQuery.noConflict();
        }
        mw.dojQueryBindings();
        mw.setupUserConfig(function () {
          mw.checkModuleLoaderFiles(function () {
            if (
              typeof wgUserLanguage != "undefined" &&
              mw.isValidLang(wgUserLanguage)
            ) {
              mw.setConfig("userLanguage", wgUserLanguage);
            } else {
              var langKey = mw.parseUri(mw.getMwEmbedSrc()).queryKey["uselang"];
              if (langKey && mw.isValidLang(langKey)) {
                mw.setConfig("userLanguage", langKey);
              }
            }
            mw.setConfig(
              "imagesPath",
              mw.getMwEmbedPath() + "skins/common/images/"
            );
            $j.ajaxSetup({ cache: true });
            mw.Language.magicSetup();
            if (mw.hasJQueryUiCss()) {
              mw.style["ui_" + mw.getConfig("jQueryUISkin")] = true;
            }
            mw.load(["mw.style.mwCommon"], function () {
              function runSetupFunctions() {
                if (mwSetupFunctions.length) {
                  mwSetupFunctions.shift()(function () {
                    runSetupFunctions();
                  });
                } else {
                  mw.runReadyFunctions();
                }
              }
              runSetupFunctions();
            });
          });
        });
      });
    });
  };
  mw.hasJQueryUiCss = function () {
    var hasUiCss = false;
    var cssStyleSheetNames = ["jquery-ui-1.7.2.css", "jquery-ui.css"];
    $j("link").each(function (na, linkNode) {
      $j.each(cssStyleSheetNames, function (inx, sheetName) {
        if ($j(linkNode).attr("href").indexOf(sheetName) != -1) {
          hasUiCss = true;
          return true;
        }
      });
    });
    $j("style").each(function (na, styleNode) {
      $j.each(cssStyleSheetNames, function (inx, sheetName) {
        if (
          $j(styleNode).text().indexOf("@import") != -1 &&
          $j(styleNode).text().indexOf(sheetName) != -1
        ) {
          hasUiCss = true;
          return true;
        }
      });
    });
    return hasUiCss;
  };
  mw.checkCoreLoaderFile = function (callback) {
    if (mw.getResourceLoaderPath()) {
      callback();
      return;
    }
    if (mw.isStaticPackge()) {
      callback();
      return;
    }
    mw.load("loader.js", callback);
  };
  mw.isStaticPackge = function () {
    var src = mw.getMwEmbedSrc();
    if (src.indexOf("-static") !== -1) {
      return true;
    }
    return false;
  };
  mw.checkModuleLoaderFiles = function (callback) {
    if (mw.getResourceLoaderPath() || mw.isStaticPackge()) {
      callback();
      return;
    }
    var loaderRequest = [];
    var enabledComponents = mw.getConfig("coreComponents");
    function loadEnabledComponents(enabledComponents) {
      if (!enabledComponents.length) {
        var enabledModules = mw.getConfig("enabledModules");
        loadEnabledModules(enabledModules);
        return;
      }
      var componentName = enabledComponents.shift();
      componentName = componentName.replace(/"/g, "");
      mw.load(componentName, function () {
        loadEnabledComponents(enabledComponents);
      });
    }
    loadEnabledComponents(enabledComponents);
    function loadEnabledModules(enabledModules) {
      if (!enabledModules.length) {
        addLanguageFile();
        return;
      }
      var moduleName = enabledModules.shift();
      moduleName = moduleName.replace(/"/g, "");
      mw.setConfig("loaderContext", "modules/" + moduleName + "/");
      mw.load("modules/" + moduleName + "/loader.js", function () {
        loadEnabledModules(enabledModules);
      });
    }
    function addLanguageFile() {
      var langLoaderRequest = [];
      if (mw.getConfig("userLanguage")) {
        var langCode = mw.getConfig("userLanguage");
        var transformKey = mw.getLangTransformKey(langCode);
        if (transformKey != "en") {
          langCode =
            langCode.substr(0, 1).toUpperCase() +
            langCode.substr(1, langCode.length);
          langLoaderRequest.push(
            "languages/classes/Language" + langCode + ".js"
          );
        }
      }
      if (!langLoaderRequest.length) {
        addLocalSettings();
        return;
      }
      mw.load(langLoaderRequest, function () {
        addLocalSettings();
      });
    }
    function addLocalSettings() {
      var continueCallback = function () {
        mwModuleLoaderCheckFlag = true;
        callback();
      };
      if (mw.getConfig("LoadLocalSettings") != true) {
        continueCallback();
        return;
      }
      mw.load("localSettings.js", function () {
        continueCallback();
      });
    }
  };
  mw.styleRuleExists = function (styleRule) {
    for (var i = 0; i < document.styleSheets.length; i++) {
      var rules = null;
      try {
        if (document.styleSheets[i].cssRules)
          rules = document.styleSheets[i].cssRules;
        else if (document.styleSheets[0].rules)
          rules = document.styleSheets[i].rules;
        for (var j = 0; j < rules.length; j++) {
          var rule = rules[j].selectorText;
          if (rule && rule.indexOf(styleRule) != -1) {
            return true;
          }
        }
      } catch (e) {}
    }
    return false;
  };
  var mwDomReadyFlag = false;
  var mwModuleLoaderCheckFlag = false;
  mw.domReady = function () {
    if (mwDomReadyFlag) {
      return;
    }
    mwDomReadyFlag = true;
    setTimeout(function () {
      mw.setupMwEmbed();
    }, 1);
  };
  mw.versionIsAtLeast = function (minVersion, clientVersion) {
    var minVersionParts = minVersion.split(".");
    var clientVersionParts = clientVersion.split(".");
    for (var i = 0; i < minVersionParts.length; i++) {
      if (parseInt(clientVersionParts[i]) > parseInt(minVersionParts[i])) {
        return true;
      }
      if (parseInt(clientVersionParts[i]) < parseInt(minVersionParts[i])) {
        return false;
      }
    }
    return true;
  };
  mw.dojQueryBindings = function () {
    (function ($) {
      $.fn.triggerQueueCallback = function (
        triggerName,
        triggerParam,
        callback
      ) {
        var targetObject = this;
        if (!callback && typeof triggerParam == "function") {
          callback = triggerParam;
          triggerParam = null;
        }
        var triggerBaseName = triggerName.split(".")[0];
        var triggerNamespace = triggerName.split(".")[1];
        var callbackSet = [];
        if (!$j(targetObject).data("events")) {
          callback();
          return;
        }
        if (!triggerNamespace) {
          callbackSet = $j(targetObject).data("events")[triggerBaseName];
        } else {
          $j.each(
            $j(targetObject).data("events")[triggerBaseName],
            function (inx, bindObject) {
              if (bindObject.namespace == triggerNamespace) {
                callbackSet.push(bindObject);
              }
            }
          );
        }
        if (!callbackSet || callbackSet.length === 0) {
          callback();
          return;
        }
        var callbackCount = callbackSet.length ? callbackSet.length : 1;
        var callInx = 0;
        var doCallbackCheck = function () {
          callInx++;
          if (callInx == callbackCount) {
            callback();
          }
        };
        if (triggerParam) {
          $(this).trigger(triggerName, [triggerParam, doCallbackCheck]);
        } else {
          $(this).trigger(triggerName, [doCallbackCheck]);
        }
      };
      $.fn.loadingSpinner = function () {
        if (this) {
          $(this).html($("<div />").addClass("loadingSpinner"));
        }
        return this;
      };
      $.fn.getAbsoluteOverlaySpinner = function () {
        var pos = $j(this).offset();
        var posLeft = $j(this).width()
          ? parseInt(pos.left + 0.5 * $j(this).width() - 16)
          : pos.left + 30;
        var posTop = $j(this).height()
          ? parseInt(pos.top + 0.5 * $j(this).height() - 16)
          : pos.top + 30;
        var $spinner = $j("<div />")
          .loadingSpinner()
          .css({
            width: 32,
            height: 32,
            position: "absolute",
            top: posTop + "px",
            left: posLeft + "px",
          });
        $j("body").append($spinner);
        return $spinner;
      };
      $.fn.dragFileUpload = function (conf) {
        if (this.selector) {
          var _this = this;
          mw.load(["$j.fn.dragDropFile"], function () {
            $j(_this.selector).dragDropFile();
          });
        }
      };
      $.btnHtml = function (msg, styleClass, iconId, opt) {
        if (!opt) opt = {};
        var href = opt.href ? opt.href : "#";
        var target_attr = opt.target ? ' target="' + opt.target + '" ' : "";
        var style_attr = opt.style ? ' style="' + opt.style + '" ' : "";
        return (
          '<a href="' +
          href +
          '" ' +
          target_attr +
          style_attr +
          ' class="ui-state-default ui-corner-all ui-icon_link ' +
          styleClass +
          '"><span class="ui-icon ui-icon-' +
          iconId +
          '" ></span>' +
          '<span class="btnText">' +
          msg +
          "</span></a>"
        );
      };
      var mw_default_button_options = {
        class: "",
        style: {},
        text: "",
        icon: "carat-1-n",
      };
      $.button = function (options) {
        var options = $j.extend({}, mw_default_button_options, options);
        var $button = $j("<a />")
          .attr("href", "#")
          .addClass("ui-state-default ui-corner-all ui-icon_link");
        if (options.css) {
          $button.css(options.css);
        }
        if (options["class"]) {
          $button.addClass(options["class"]);
        }
        $button
          .append(
            $j("<span />").addClass("ui-icon ui-icon-" + options.icon),
            $j("<span />").addClass("btnText")
          )
          .buttonHover();
        if (options.text) {
          $button.find(".btnText").text(options.text);
        } else {
          $button.css("padding", "1em");
        }
        return $button;
      };
      $.fn.buttonHover = function () {
        $j(this).hover(
          function () {
            $j(this).addClass("ui-state-hover");
          },
          function () {
            $j(this).removeClass("ui-state-hover");
          }
        );
        return this;
      };
      $.fn.dialogFitWindow = function (options) {
        var opt_default = { hspace: 50, vspace: 50 };
        if (!options) var options = {};
        options = $j.extend(opt_default, options);
        $j(this.selector).dialog(
          "option",
          "width",
          $j(window).width() - options.hspace
        );
        $j(this.selector).dialog(
          "option",
          "height",
          $j(window).height() - options.vspace
        );
        $j(this.selector).dialog("option", "position", "center");
        $j(this.selector + "~ .ui-dialog-buttonpane").css({
          position: "absolute",
          left: "0px",
          right: "0px",
          bottom: "0px",
        });
      };
    })(jQuery);
  };
})(window.mw);
if (document.readyState === "complete") {
  mw.domReady();
}
if (document.addEventListener) {
  DOMContentLoaded = function () {
    document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
    mw.domReady();
  };
} else if (document.attachEvent) {
  DOMContentLoaded = function () {
    if (document.readyState === "complete") {
      document.detachEvent("onreadystatechange", DOMContentLoaded);
      mw.domReady();
    }
  };
}
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
  window.addEventListener("load", mw.domReady, false);
} else if (document.attachEvent) {
  document.attachEvent("onreadystatechange", DOMContentLoaded);
  window.attachEvent("onload", mw.domReady);
  var toplevel = false;
  try {
    toplevel = window.frameElement == null;
  } catch (e) {}
  if (document.documentElement.doScroll && toplevel) {
    doScrollCheck();
  }
}
function doScrollCheck() {
  try {
    document.documentElement.doScroll("left");
  } catch (error) {
    setTimeout(doScrollCheck, 1);
    return;
  }
  mw.domReady();
}
if (mw.getResourceLoaderPath() && !window.jQuery) {
}
if (mw.isStaticPackge() && !window.jQuery) {
  alert("Error: jQuery is required for mwEmbed ");
}
if (window.jQuery) {
  if (!mw.versionIsAtLeast("1.4.2", jQuery.fn.jquery)) {
    if (window.console && window.console.log) {
      console.log("Error mwEmbed requires jQuery 1.4 or above");
    }
  }
  var dollarFlag = false;
  if ($ && $.fn && $.fn.jquery) {
    dollarFlag = true;
  }
  window["$j"] = jQuery.noConflict();
  if (dollarFlag) {
    window["$"] = jQuery.noConflict();
  }
}
var JQUERY_SWAP_STRING = "ZjQuerySwapZ";
var LINK_SWAP_STRING = "ZreplaceZ";
(function (mw) {
  var pMagicSet = {};
  mw.addTemplateTransform = function (magicSet) {
    for (var i in magicSet) {
      pMagicSet[i] = magicSet[i];
    }
  };
  mw.Parser = function (wikiText, options) {
    this.init(wikiText, options);
    return this;
  };
  mw.Parser.prototype = {
    pOut: false,
    init: function (wikiText, parserOptions) {
      this.wikiText = wikiText;
      var defaultParserOptions = { templateParCount: 2 };
      this.options = $j.extend(defaultParserOptions, parserOptions);
    },
    updateText: function (wikiText) {
      this.wikiText = wikiText;
      this.pOut = false;
    },
    checkParlookAheadOpen: function (text, a) {
      if (this.options.templateParCount == 2) {
        return text[a] == "{" && text[a + 1] == "{";
      } else if (this.options.templateParCount == 3) {
        return text[a] == "{" && text[a + 1] == "{" && text[a + 2] == "{";
      }
    },
    checkParlookAheadClose: function (text, a) {
      if (this.options.templateParCount == 2) {
        return text[a] == "}" && text[a + 1] == "}";
      } else if (this.options.templateParCount == 3) {
        return text[a] == "}" && text[a + 1] == "}" && text[a + 2] == "}";
      }
    },
    parse: function () {
      var _this = this;
      function recurseTokenizeNodes(text) {
        var node = {};
        for (var a = 0; a < text.length; a++) {
          if (_this.checkParlookAheadOpen(text, a)) {
            a = a + _this.options.templateParCount;
            node["parent"] = node;
            if (!node["child"]) {
              node["child"] = new Array();
            }
            node["child"].push(recurseTokenizeNodes(text.substr(a)));
          } else if (_this.checkParlookAheadClose(text, a)) {
            a++;
            if (!node["parent"]) {
              return node;
            }
            node = node["parent"];
          }
          if (!node["text"]) {
            node["text"] = "";
          }
          if (text[a] && text[a] != "}") {
            node["text"] += text[a];
          }
        }
        return node;
      }
      function parseTmplTxt(templateString) {
        var templateObject = {};
        templateName = templateString.split("|").shift();
        templateName = templateName.split("{").shift();
        templateName = templateName.replace(/^\s+|\s+$/g, "");
        if (templateName.split(":").length == 1) {
          templateObject["name"] = templateName;
        } else {
          templateObject["name"] = templateName.split(":").shift();
          templateObject["arg"] = templateName.split(":").pop();
        }
        var paramSet = templateString.split("|");
        paramSet.splice(0, 1);
        if (paramSet.length) {
          templateObject.param = new Array();
          for (var pInx = 0; pInx < paramSet.length; pInx++) {
            var paramString = paramSet[pInx];
            if (paramString == "") {
              templateObject.param[pInx] = "";
              continue;
            }
            for (var b = 0; b < paramString.length; b++) {
              if (
                paramString[b] == "=" &&
                b > 0 &&
                b < paramString.length &&
                paramString[b - 1] != "\\"
              ) {
                templateObject.param[paramString.split("=").shift()] =
                  paramString.split("=").pop();
              } else {
                templateObject.param[pInx] = paramString;
              }
            }
          }
        }
        return templateObject;
      }
      function getMagicTxtFromTempNode(node) {
        node.templateObject = parseTmplTxt(node.text);
        if (node.templateObject.name in pMagicSet) {
          var nodeText = pMagicSet[node.templateObject.name](
            node.templateObject
          );
          return nodeText;
        } else {
          return node.text;
        }
      }
      function linkSwapText(text) {
        var re = new RegExp(/\[([^\s]+[\s]+[^\]]*)\]/g);
        var matchSet = text.match(re);
        if (!matchSet) {
          return text;
        }
        text = text.replace(re, LINK_SWAP_STRING);
        for (var i = 0; i < matchSet.length; i++) {
          var matchParts = matchSet[i].substr(1, matchSet[i].length - 2);
          if (matchParts.indexOf(JQUERY_SWAP_STRING) !== -1) {
            var $matchParts = $j("<span>" + matchParts + "</span>");
            $jQuerySpan = $matchParts.find("#" + JQUERY_SWAP_STRING + i);
            var linkText = $matchParts.text();
            $jQuerySpan.text(linkText);
            text = text.replace(
              LINK_SWAP_STRING,
              $j("<span />").append($jQuerySpan).html()
            );
          } else {
            matchParts = matchParts.split(/ /);
            var link = matchParts[0];
            matchParts.shift();
            var linkText = matchParts.join(" ");
            text = text.replace(
              LINK_SWAP_STRING,
              '<a href="' + link + '">' + linkText + "</a>"
            );
          }
        }
        return text;
      }
      var pNode = null;
      function recurse_magic_swap(node) {
        if (!pNode) pNode = node;
        if (node["child"]) {
          for (var i in node["child"]) {
            var nodeText = recurse_magic_swap(node["child"][i]);
            if (node.text) {
              node.text = node.text.replace(node["child"][i].text, nodeText);
            }
            pNode.text = pNode.text.replace(node["child"][i].text, nodeText);
          }
          var nodeText = getMagicTxtFromTempNode(node);
          pNode.text = pNode.text.replace(node.text, nodeText);
          return node.text;
        } else {
          return getMagicTxtFromTempNode(node);
        }
      }
      this.pNode = recurseTokenizeNodes(this.wikiText);
      this.pNode["parent"] = null;
      this.pOut = recurse_magic_swap(this.pNode);
      this.pOut = linkSwapText(this.pOut);
    },
    templates: function (templateName) {
      this.parse();
      var tmplSet = new Array();
      function getMatchingTmpl(node) {
        if (node["child"]) {
          for (var i in node["child"]) {
            getMatchingTmpl(node["child"]);
          }
        }
        if (templateName && node.templateObject) {
          if (node.templateObject["name"] == templateName)
            tmplSet.push(node.templateObject);
        } else if (node.templateObject) {
          tmplSet.push(node.templateObject);
        }
      }
      getMatchingTmpl(this.pNode);
      return tmplSet;
    },
    getTemplateVars: function () {
      templateVars = new Array();
      var tempVars = wikiText.match(/\{\{\{([^\}]*)\}\}\}/gi);
      for (var i = 0; i < tempVars.length; i++) {
        var tvar = tempVars[i].replace("{{{", "").replace("}}}", "");
        if (tvar.indexOf("|") != -1) {
          tvar = tvar.substr(0, tvar.indexOf("|"));
        }
        var do_add = true;
        for (var j = 0; j < templateVars.length; j++) {
          if (templateVars[j] == tvar) do_add = false;
        }
        if (do_add) templateVars.push(tvar);
      }
      return templateVars;
    },
    getHTML: function () {
      if (!this.pOut) {
        this.parse();
      }
      return this.pOut;
    },
  };
})(window.mw);
(function (mw) {
  mw.Language = {};
  var messageCache = {};
  mw.addMessages = function (msgSet) {
    for (var i in msgSet) {
      messageCache[i] = msgSet[i];
    }
  };
  mw.currentClassMissingMessages = false;
  mw.addMessageKeys = function (msgSet) {
    for (i = 0; i < msgSet.length; i++) {
      msgKey = msgSet[i];
      if (!messageCache[msgKey]) {
        mw.currentClassMissingMessages = true;
        return false;
      }
    }
    return true;
  };
  mw.includeAllModuleMessages = function () {
    mw.currentClassMissingMessages = true;
  };
  mw.loadResourceMessages = function (className, callback) {
    if (
      typeof wgScriptLoaderLocation == "undefined" ||
      !wgScriptLoaderLocation
    ) {
      wgScriptLoaderLocation = mw.getMwEmbedPath() + "ResourceLoader.php";
    }
    mw.getScript(
      wgScriptLoaderLocation + "?class=" + className + "&format=messages",
      callback
    );
  };
  mw.getMsg = function (messageKey, args) {
    if (!messageCache[messageKey]) {
      return "[" + messageKey + "]";
    }
    if (typeof args != "undefined") {
      if (
        typeof args == "string" ||
        typeof args == "number" ||
        args instanceof jQuery
      ) {
        args = [args];
      }
      var extraArgs = $j.makeArray(arguments);
      for (var i = 2; i < extraArgs.length; i++) {
        args.push(extraArgs[i]);
      }
    }
    if (
      (!args || args.length == 0) &&
      messageCache[messageKey].indexOf("{{") === -1 &&
      messageCache[messageKey].indexOf("[") === -1
    ) {
      return messageCache[messageKey];
    }
    var messageSwap = new mw.Language.messageSwapObject(
      messageCache[messageKey],
      args
    );
    return messageSwap.getMsg();
  };
  mw.Language.messageSwapObject = function (message, arguments) {
    this.init(message, arguments);
  };
  mw.Language.messageSwapObject.prototype = {
    init: function (message, arguments) {
      this.message = message;
      this.arguments = arguments;
      includesjQueryArgs: false;
    },
    getMsg: function () {
      this.replaceStringArgs();
      if (
        this.message.indexOf("{{") === -1 &&
        this.message.indexOf("[") === -1 &&
        !this.includesjQueryArgs
      ) {
        return this.message;
      }
      var pObj = new mw.Parser(this.message);
      this.message = pObj.getHTML();
      if (!this.includesjQueryArgs) {
        return this.message;
      }
      return this.getJQueryArgsReplace();
    },
    replaceStringArgs: function () {
      if (!this.arguments) {
        return;
      }
      for (var v = 0; v < this.arguments.length; v++) {
        if (typeof this.arguments[v] == "undefined") {
          continue;
        }
        var replaceValue = this.arguments[v];
        if (parseInt(replaceValue) == replaceValue) {
          replaceValue = mw.Language.convertNumber(replaceValue);
        }
        var argumentRegExp = new RegExp("\\$" + (parseInt(v) + 1), "g");
        if (replaceValue instanceof jQuery) {
          this.includesjQueryArgs = true;
          this.message = this.message.replace(
            argumentRegExp,
            '<span id="' + JQUERY_SWAP_STRING + v + '"></span>'
          );
        } else {
          this.message = this.message.replace(argumentRegExp, replaceValue);
        }
      }
    },
    getJQueryArgsReplace: function () {
      var $jQueryMessage = false;
      for (var v = 0; v < this.arguments.length; v++) {
        if (typeof this.arguments[v] == "undefined") {
          continue;
        }
        var $replaceValue = this.arguments[v];
        if ($replaceValue instanceof jQuery) {
          if (!$jQueryMessage) {
            $jQueryMessage = $j("<span />").html(this.message);
          }
          var $swapTarget = $jQueryMessage.find("#" + JQUERY_SWAP_STRING + v);
          if (!$swapTarget.length) {
            continue;
          }
          if ($swapTarget.html() != "") {
            $replaceValue.html($swapTarget.html());
          }
          $swapTarget.replaceWith($replaceValue);
        }
      }
      return $jQueryMessage;
    },
  };
  mw.Language.msgNoTrans = function (key) {
    if (messageCache[key]) return messageCache[key];
    return "&lt;" + key + "&gt;";
  };
  mw.Language.isMsgKeyDefined = function (msgKey) {
    if (messageCache[msgKey]) {
      return true;
    }
    return false;
  };
  mw.Language.doneSetup = false;
  mw.Language.magicSetup = function () {
    if (!mw.Language.doneSetup) {
      mw.addTemplateTransform({
        PLURAL: mw.Language.procPLURAL,
        GENDER: mw.Language.procGENDER,
      });
      mw.Language.doneSetup = true;
    }
  };
  mw.Language.gender = function (gender, forms) {
    if (!forms.length) {
      return "";
    }
    forms = mw.Language.preConvertPlural(forms, 2);
    if (gender === "male") return forms[0];
    if (gender === "female") return forms[1];
    return forms[2] ? forms[2] : forms[0];
  };
  mw.Language.procPLURAL = function (templateObject) {
    if (
      templateObject.arg &&
      templateObject.param &&
      mw.Language.convertPlural
    ) {
      if (templateObject.param.length == 0) {
        return "";
      }
      var count = mw.Language.convertNumber(templateObject.arg, true);
      return mw.Language.convertPlural(parseInt(count), templateObject.param);
    }
    if (templateObject.param[0]) {
      return templateObject.param[0];
    }
    return "";
  };
  mw.Language.procGENDER = function (templateObject) {
    return "gender-not-supported-in-js-yet";
  };
  mw.Language.convertPlural = function (count, forms) {
    if (!forms || forms.length == 0) {
      return "";
    }
    return parseInt(count) == 1 ? forms[0] : forms[1];
  };
  mw.Language.preConvertPlural = function (forms, count) {
    while (forms.length < count) {
      forms.push(forms[forms.length - 1]);
    }
    return forms;
  };
  mw.Language.digitTransformTable = null;
  mw.Language.convertNumber = function (number, typeInt) {
    if (!mw.Language.digitTransformTable) return number;
    var transformTable = mw.Language.digitTransformTable;
    if (typeInt) {
      if (parseInt(number) == number) return number;
      var tmp = [];
      for (var i in transformTable) {
        tmp[transformTable[i]] = i;
      }
      transformTable = tmp;
    }
    var numberString = "" + number;
    var convertedNumber = "";
    for (var i = 0; i < numberString.length; i++) {
      if (transformTable[numberString[i]]) {
        convertedNumber += transformTable[numberString[i]];
      } else {
        convertedNumber += numberString[i];
      }
    }
    return typeInt ? parseInt(convertedNumber) : convertedNumber;
  };
  mw.isValidLang = function (langKey) {
    return mw.Language.names[langKey] ? true : false;
  };
  mw.getLangTransformKey = function (langKey) {
    if (mw.Language.fallbackTransformMap[langKey]) {
      langKey = mw.Language.fallbackTransformMap[langKey];
    }
    for (var i = 0; i < mw.Language.transformClass.length; i++) {
      if (langKey == mw.Language.transformClass[i]) {
        return langKey;
      }
    }
    return "en";
  };
  mw.getRemoteMsg = function (msgSet, callback) {
    var ammessages = "";
    if (typeof msgSet == "object") {
      for (var i in msgSet) {
        if (!messageCache[i]) {
          ammessages += msgSet[i] + "|";
        }
      }
    } else if (typeof msgSet == "string") {
      if (!messageCache[i]) {
        ammessages += msgSet;
      }
    }
    if (ammessages == "") {
      callback();
      return false;
    }
    var request = { meta: "allmessages", ammessages: ammessages };
    mw.getJSON(request, function (data) {
      if (data.query.allmessages) {
        var msgs = data.query.allmessages;
        for (var i in msgs) {
          var ld = {};
          ld[msgs[i]["name"]] = msgs[i]["*"];
          mw.addMessages(ld);
        }
      }
      callback();
    });
  };
  mw.Language.formatSize = function (size) {
    var round = 0;
    var msg = "";
    if (size > 1024) {
      size = size / 1024;
      if (size > 1024) {
        size = size / 1024;
        round = 2;
        if (size > 1024) {
          size = size / 1024;
          msg = "mwe-size-gigabytes";
        } else {
          msg = "mwe-size-megabytes";
        }
      } else {
        msg = "mwe-size-kilobytes";
      }
    } else {
      msg = "mwe-size-bytes";
    }
    var p = Math.pow(10, round);
    size = Math.round(size * p) / p;
    return gM(msg, size);
  };
  mw.Language.formatNumber = function (num) {
    function addSeparatorsNF(nStr, outD, sep) {
      nStr += "";
      var dpos = nStr.indexOf(".");
      var nStrEnd = "";
      if (dpos != -1) {
        nStrEnd = outD + nStr.substring(dpos + 1, nStr.length);
        nStr = nStr.substring(0, dpos);
      }
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(nStr)) {
        nStr = nStr.replace(rgx, "$1" + sep + "$2");
      }
      return nStr + nStrEnd;
    }
    return addSeparatorsNF(num, ".", ",");
  };
  mw.Language.names = {
    aa: "Qaf\u00e1r af",
    ab: "\u0410\u04a7\u0441\u0443\u0430",
    ace: "Ac\u00e8h",
    af: "Afrikaans",
    ak: "Akan",
    aln: "Geg\u00eb",
    als: "Alemannisch",
    am: "\u12a0\u121b\u122d\u129b",
    an: "Aragon\u00e9s",
    ang: "Anglo-Saxon",
    ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    arc: "\u0710\u072a\u0721\u071d\u0710",
    arn: "Mapudungun",
    arz: "\u0645\u0635\u0631\u0649",
    as: "\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be",
    ast: "Asturianu",
    av: "\u0410\u0432\u0430\u0440",
    avk: "Kotava",
    ay: "Aymar aru",
    az: "Az\u0259rbaycan",
    ba: "\u0411\u0430\u0448\u04a1\u043e\u0440\u0442",
    bar: "Boarisch",
    "bat-smg": "\u017demait\u0117\u0161ka",
    bcc: "\u0628\u0644\u0648\u0686\u06cc \u0645\u06a9\u0631\u0627\u0646\u06cc",
    bcl: "Bikol Central",
    be: "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f",
    "be-tarask":
      "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f (\u0442\u0430\u0440\u0430\u0448\u043a\u0435\u0432\u0456\u0446\u0430)",
    "be-x-old":
      "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f (\u0442\u0430\u0440\u0430\u0448\u043a\u0435\u0432\u0456\u0446\u0430)",
    bg: "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",
    bh: "\u092d\u094b\u091c\u092a\u0941\u0930\u0940",
    bi: "Bislama",
    bm: "Bamanankan",
    bn: "\u09ac\u09be\u0982\u09b2\u09be",
    bo: "\u0f56\u0f7c\u0f51\u0f0b\u0f61\u0f72\u0f42",
    bpy: "\u0987\u09ae\u09be\u09b0 \u09a0\u09be\u09b0/\u09ac\u09bf\u09b7\u09cd\u09a3\u09c1\u09aa\u09cd\u09b0\u09bf\u09af\u09bc\u09be \u09ae\u09a3\u09bf\u09aa\u09c1\u09b0\u09c0",
    bqi: "\u0628\u062e\u062a\u064a\u0627\u0631\u064a",
    br: "Brezhoneg",
    bs: "Bosanski",
    bug: "\u1a05\u1a14 \u1a15\u1a18\u1a01\u1a17",
    bxr: "\u0411\u0443\u0440\u044f\u0430\u0434",
    ca: "Catal\u00e0",
    "cbk-zam": "Chavacano de Zamboanga",
    cdo: "M\u00ecng-d\u0115\u0324ng-ng\u1e73\u0304",
    ce: "\u041d\u043e\u0445\u0447\u0438\u0439\u043d",
    ceb: "Cebuano",
    ch: "Chamoru",
    cho: "Choctaw",
    chr: "\u13e3\u13b3\u13a9",
    chy: "Tsets\u00eahest\u00e2hese",
    ckb: "Soran\u00ee / \u06a9\u0648\u0631\u062f\u06cc",
    "ckb-latn": "\u202aSoran\u00ee (lat\u00een\u00ee)\u202c",
    "ckb-arab":
      "\u202b\u06a9\u0648\u0631\u062f\u06cc (\u0639\u06d5\u0631\u06d5\u0628\u06cc)\u202c",
    co: "Corsu",
    cr: "N\u0113hiyaw\u0113win / \u14c0\u1426\u1403\u152d\u140d\u140f\u1423",
    crh: "Q\u0131r\u0131mtatarca",
    "crh-latn": "\u202aQ\u0131r\u0131mtatarca (Latin)\u202c",
    "crh-cyrl":
      "\u202a\u041a\u044a\u044b\u0440\u044b\u043c\u0442\u0430\u0442\u0430\u0440\u0434\u0436\u0430 (\u041a\u0438\u0440\u0438\u043b\u043b)\u202c",
    cs: "\u010cesky",
    csb: "Kasz\u00ebbsczi",
    cu: "\u0421\u043b\u043e\u0432\u0463\u0301\u043d\u044c\u0441\u043a\u044a / \u2c14\u2c0e\u2c11\u2c02\u2c21\u2c10\u2c20\u2c14\u2c0d\u2c1f",
    cv: "\u0427\u04d1\u0432\u0430\u0448\u043b\u0430",
    cy: "Cymraeg",
    da: "Dansk",
    de: "Deutsch",
    "de-at": "\u00d6sterreichisches Deutsch",
    "de-ch": "Schweizer Hochdeutsch",
    "de-formal": "Deutsch (Sie-Form)",
    diq: "Zazaki",
    dk: "Dansk (deprecated:da)",
    dsb: "Dolnoserbski",
    dv: "\u078b\u07a8\u0788\u07ac\u0780\u07a8\u0784\u07a6\u0790\u07b0",
    dz: "\u0f47\u0f7c\u0f44\u0f0b\u0f41",
    ee: "E\u028begbe",
    el: "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
    eml: "Emili\u00e0n e rumagn\u00f2l",
    en: "English",
    "en-gb": "British English",
    eo: "Esperanto",
    es: "Espa\u00f1ol",
    et: "Eesti",
    eu: "Euskara",
    ext: "Estreme\u00f1u",
    fa: "\u0641\u0627\u0631\u0633\u06cc",
    ff: "Fulfulde",
    fi: "Suomi",
    "fiu-vro": "V\u00f5ro",
    fj: "Na Vosa Vakaviti",
    fo: "F\u00f8royskt",
    fr: "Fran\u00e7ais",
    frc: "Fran\u00e7ais cadien",
    frp: "Arpetan",
    fur: "Furlan",
    fy: "Frysk",
    ga: "Gaeilge",
    gag: "Gagauz",
    gan: "\u8d1b\u8a9e",
    "gan-hans": "\u8d63\u8bed(\u7b80\u4f53)",
    "gan-hant": "\u8d1b\u8a9e(\u7e41\u9ad4)",
    gd: "G\u00e0idhlig",
    gl: "Galego",
    glk: "\u06af\u06cc\u0644\u06a9\u06cc",
    gn: "Ava\u00f1e'\u1ebd",
    got: "\ud800\udf32\ud800\udf3f\ud800\udf44\ud800\udf39\ud800\udf43\ud800\udf3a",
    grc: "\u1f08\u03c1\u03c7\u03b1\u03af\u03b1 \u1f11\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u1f74",
    gsw: "Alemannisch",
    gu: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0",
    gv: "Gaelg",
    ha: "\u0647\u064e\u0648\u064f\u0633\u064e",
    hak: "Hak-k\u00e2-fa",
    haw: "Hawai`i",
    he: "\u05e2\u05d1\u05e8\u05d9\u05ea",
    hi: "\u0939\u093f\u0928\u094d\u0926\u0940",
    hif: "Fiji Hindi",
    "hif-deva":
      "\u092b\u093c\u0940\u091c\u0940 \u0939\u093f\u0928\u094d\u0926\u0940",
    "hif-latn": "Fiji Hindi",
    hil: "Ilonggo",
    ho: "Hiri Motu",
    hr: "Hrvatski",
    hsb: "Hornjoserbsce",
    ht: "Krey\u00f2l ayisyen",
    hu: "Magyar",
    hy: "\u0540\u0561\u0575\u0565\u0580\u0565\u0576",
    hz: "Otsiherero",
    ia: "Interlingua",
    id: "Bahasa Indonesia",
    ie: "Interlingue",
    ig: "Igbo",
    ii: "\ua187\ua259",
    ik: "I\u00f1upiak",
    "ike-cans": "\u1403\u14c4\u1483\u144e\u1450\u1466",
    "ike-latn": "inuktitut",
    ilo: "Ilokano",
    inh: "\u0413\u0406\u0430\u043b\u0433\u0406\u0430\u0439 \u011eal\u011faj",
    io: "Ido",
    is: "\u00cdslenska",
    it: "Italiano",
    iu: "\u1403\u14c4\u1483\u144e\u1450\u1466/inuktitut",
    ja: "\u65e5\u672c\u8a9e",
    jbo: "Lojban",
    jut: "Jysk",
    jv: "Basa Jawa",
    ka: "\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8",
    kaa: "Qaraqalpaqsha",
    kab: "Taqbaylit",
    kg: "Kongo",
    ki: "G\u0129k\u0169y\u0169",
    kiu: "Kurmanc\u00ee",
    kj: "Kwanyama",
    kk: "\u049a\u0430\u0437\u0430\u049b\u0448\u0430",
    "kk-arab":
      "\u202b\u0642\u0627\u0632\u0627\u0642\u0634\u0627 (\u062a\u0674\u0648\u062a\u06d5)\u202c",
    "kk-cyrl":
      "\u202a\u049a\u0430\u0437\u0430\u049b\u0448\u0430 (\u043a\u0438\u0440\u0438\u043b)\u202c",
    "kk-latn": "\u202aQazaq\u015fa (lat\u0131n)\u202c",
    "kk-cn":
      "\u202b\u0642\u0627\u0632\u0627\u0642\u0634\u0627 (\u062c\u06c7\u0646\u06af\u0648)\u202c",
    "kk-kz":
      "\u202a\u049a\u0430\u0437\u0430\u049b\u0448\u0430 (\u049a\u0430\u0437\u0430\u049b\u0441\u0442\u0430\u043d)\u202c",
    "kk-tr": "\u202aQazaq\u015fa (T\u00fcrk\u00efya)\u202c",
    kl: "Kalaallisut",
    km: "\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a",
    kn: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1",
    ko: "\ud55c\uad6d\uc5b4",
    "ko-kp": "\ud55c\uad6d\uc5b4 (\uc870\uc120)",
    kr: "Kanuri",
    kri: "Krio",
    krj: "Kinaray-a",
    ks: "\u0915\u0936\u094d\u092e\u0940\u0930\u0940 - (\u0643\u0634\u0645\u064a\u0631\u064a)",
    ksh: "Ripoarisch",
    ku: "Kurd\u00ee / \u0643\u0648\u0631\u062f\u06cc",
    "ku-latn": "\u202aKurd\u00ee (lat\u00een\u00ee)\u202c",
    "ku-arab":
      "\u202b\u0643\u0648\u0631\u062f\u064a (\u0639\u06d5\u0631\u06d5\u0628\u06cc)\u202c",
    kv: "\u041a\u043e\u043c\u0438",
    kw: "Kernowek",
    ky: "\u041a\u044b\u0440\u0433\u044b\u0437\u0447\u0430",
    la: "Latina",
    lad: "Ladino",
    lb: "L\u00ebtzebuergesch",
    lbe: "\u041b\u0430\u043a\u043a\u0443",
    lez: "\u041b\u0435\u0437\u0433\u0438",
    lfn: "Lingua Franca Nova",
    lg: "Luganda",
    li: "Limburgs",
    lij: "L\u00edguru",
    lmo: "Lumbaart",
    ln: "Ling\u00e1la",
    lo: "\u0ea5\u0eb2\u0ea7",
    loz: "Silozi",
    lt: "Lietuvi\u0173",
    lv: "Latvie\u0161u",
    lzh: "\u6587\u8a00",
    mai: "\u092e\u0948\u0925\u093f\u0932\u0940",
    "map-bms": "Basa Banyumasan",
    mdf: "\u041c\u043e\u043a\u0448\u0435\u043d\u044c",
    mg: "Malagasy",
    mh: "Ebon",
    mhr: "\u041e\u043b\u044b\u043a \u041c\u0430\u0440\u0438\u0439",
    mi: "M\u0101ori",
    mk: "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438",
    ml: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02",
    mn: "\u041c\u043e\u043d\u0433\u043e\u043b",
    mo: "\u041c\u043e\u043b\u0434\u043e\u0432\u0435\u043d\u044f\u0441\u043a\u044d",
    mr: "\u092e\u0930\u093e\u0920\u0940",
    ms: "Bahasa Melayu",
    mt: "Malti",
    mus: "Mvskoke",
    mwl: "Mirand\u00e9s",
    my: "\u1019\u103c\u1014\u103a\u1019\u102c\u1018\u102c\u101e\u102c",
    myv: "\u042d\u0440\u0437\u044f\u043d\u044c",
    mzn: "\u0645\u064e\u0632\u0650\u0631\u0648\u0646\u064a",
    na: "Dorerin Naoero",
    nah: "N\u0101huatl",
    nan: "B\u00e2n-l\u00e2m-g\u00fa",
    nap: "Nnapulitano",
    nb: "\u202aNorsk (bokm\u00e5l)\u202c",
    nds: "Plattd\u00fc\u00fctsch",
    "nds-nl": "Nedersaksisch",
    ne: "\u0928\u0947\u092a\u093e\u0932\u0940",
    new: "\u0928\u0947\u092a\u093e\u0932 \u092d\u093e\u0937\u093e",
    ng: "Oshiwambo",
    niu: "Niu\u0113",
    nl: "Nederlands",
    nn: "\u202aNorsk (nynorsk)\u202c",
    no: "\u202aNorsk (bokm\u00e5l)\u202c",
    nov: "Novial",
    nrm: "Nouormand",
    nso: "Sesotho sa Leboa",
    nv: "Din\u00e9 bizaad",
    ny: "Chi-Chewa",
    oc: "Occitan",
    om: "Oromoo",
    or: "\u0b13\u0b21\u0b3c\u0b3f\u0b06",
    os: "\u0418\u0440\u043e\u043d\u0430\u0443",
    pa: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40",
    pag: "Pangasinan",
    pam: "Kapampangan",
    pap: "Papiamentu",
    pcd: "Picard",
    pdc: "Deitsch",
    pdt: "Plautdietsch",
    pfl: "Pf\u00e4lzisch",
    pi: "\u092a\u093e\u093f\u0934",
    pih: "Norfuk / Pitkern",
    pl: "Polski",
    pms: "Piemont\u00e8is",
    pnb: "\u067e\u0646\u062c\u0627\u0628\u06cc",
    pnt: "\u03a0\u03bf\u03bd\u03c4\u03b9\u03b1\u03ba\u03ac",
    ps: "\u067e\u069a\u062a\u0648",
    pt: "Portugu\u00eas",
    "pt-br": "Portugu\u00eas do Brasil",
    qu: "Runa Simi",
    rif: "Tarifit",
    rm: "Rumantsch",
    rmy: "Romani",
    rn: "Kirundi",
    ro: "Rom\u00e2n\u0103",
    "roa-rup": "Arm\u00e3neashce",
    "roa-tara": "Tarand\u00edne",
    ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
    ruq: "Vl\u0103he\u015fte",
    "ruq-cyrl": "\u0412\u043b\u0430\u0445\u0435\u0441\u0442\u0435",
    "ruq-latn": "Vl\u0103he\u015fte",
    rw: "Kinyarwanda",
    sa: "\u0938\u0902\u0938\u094d\u0915\u0943\u0924",
    sah: "\u0421\u0430\u0445\u0430 \u0442\u044b\u043b\u0430",
    sc: "Sardu",
    scn: "Sicilianu",
    sco: "Scots",
    sd: "\u0633\u0646\u068c\u064a",
    sdc: "Sassaresu",
    se: "S\u00e1megiella",
    sei: "Cmique Itom",
    sg: "S\u00e4ng\u00f6",
    sh: "Srpskohrvatski / \u0421\u0440\u043f\u0441\u043a\u043e\u0445\u0440\u0432\u0430\u0442\u0441\u043a\u0438",
    shi: "Ta\u0161l\u1e25iyt",
    si: "\u0dc3\u0dd2\u0d82\u0dc4\u0dbd",
    simple: "Simple English",
    sk: "Sloven\u010dina",
    sl: "Sloven\u0161\u010dina",
    sli: "Schl\u00e4sch",
    sm: "Gagana Samoa",
    sma: "\u00c5arjelsaemien",
    sn: "chiShona",
    so: "Soomaaliga",
    sq: "Shqip",
    sr: "\u0421\u0440\u043f\u0441\u043a\u0438 / Srpski",
    "sr-ec":
      "\u0421\u0440\u043f\u0441\u043a\u0438 (\u045b\u0438\u0440\u0438\u043b\u0438\u0446\u0430)",
    "sr-el": "Srpski (latinica)",
    srn: "Sranantongo",
    ss: "SiSwati",
    st: "Sesotho",
    stq: "Seeltersk",
    su: "Basa Sunda",
    sv: "Svenska",
    sw: "Kiswahili",
    szl: "\u015al\u016fnski",
    ta: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
    tcy: "\u0ca4\u0cc1\u0cb3\u0cc1",
    te: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41",
    tet: "Tetun",
    tg: "\u0422\u043e\u04b7\u0438\u043a\u04e3",
    "tg-cyrl": "\u0422\u043e\u04b7\u0438\u043a\u04e3",
    "tg-latn": "tojik\u012b",
    th: "\u0e44\u0e17\u0e22",
    ti: "\u1275\u130d\u122d\u129b",
    tk: "T\u00fcrkmen\u00e7e",
    tl: "Tagalog",
    tn: "Setswana",
    to: "lea faka-Tonga",
    tokipona: "Toki Pona",
    tp: "Toki Pona (deprecated:tokipona)",
    tpi: "Tok Pisin",
    tr: "T\u00fcrk\u00e7e",
    ts: "Xitsonga",
    tt: "\u0422\u0430\u0442\u0430\u0440\u0447\u0430/Tatar\u00e7a",
    "tt-cyrl": "\u0422\u0430\u0442\u0430\u0440\u0447\u0430",
    "tt-latn": "Tatar\u00e7a",
    tum: "chiTumbuka",
    tw: "Twi",
    ty: "Reo M\u0101`ohi",
    tyv: "\u0422\u044b\u0432\u0430 \u0434\u044b\u043b",
    udm: "\u0423\u0434\u043c\u0443\u0440\u0442",
    ug: "Uyghurche\u200e / \u0626\u06c7\u064a\u063a\u06c7\u0631\u0686\u06d5",
    "ug-arab": "\u0626\u06c7\u064a\u063a\u06c7\u0631\u0686\u06d5",
    "ug-latn": "Uyghurche\u200e",
    uk: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",
    ur: "\u0627\u0631\u062f\u0648",
    uz: "O'zbek",
    ve: "Tshivenda",
    vec: "V\u00e8neto",
    vep: "Vepsan kel'",
    vi: "Ti\u1ebfng Vi\u1ec7t",
    vls: "West-Vlams",
    vo: "Volap\u00fck",
    vro: "V\u00f5ro",
    wa: "Walon",
    war: "Winaray",
    wo: "Wolof",
    wuu: "\u5434\u8bed",
    xal: "\u0425\u0430\u043b\u044c\u043c\u0433",
    xh: "isiXhosa",
    xmf: "\u10db\u10d0\u10e0\u10d2\u10d0\u10da\u10e3\u10e0\u10d8",
    yi: "\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9",
    yo: "Yor\u00f9b\u00e1",
    yue: "\u7cb5\u8a9e",
    za: "Vahcuengh",
    zea: "Ze\u00eauws",
    zh: "\u4e2d\u6587",
    "zh-classical": "\u6587\u8a00",
    "zh-cn": "\u202a\u4e2d\u6587(\u4e2d\u56fd\u5927\u9646)\u202c",
    "zh-hans": "\u202a\u4e2d\u6587(\u7b80\u4f53)\u202c",
    "zh-hant": "\u202a\u4e2d\u6587(\u7e41\u9ad4)\u202c",
    "zh-hk": "\u202a\u4e2d\u6587(\u9999\u6e2f)\u202c",
    "zh-min-nan": "B\u00e2n-l\u00e2m-g\u00fa",
    "zh-mo": "\u202a\u4e2d\u6587(\u6fb3\u9580)\u202c",
    "zh-my": "\u202a\u4e2d\u6587(\u9a6c\u6765\u897f\u4e9a)\u202c",
    "zh-sg": "\u202a\u4e2d\u6587(\u65b0\u52a0\u5761)\u202c",
    "zh-tw": "\u202a\u4e2d\u6587(\u53f0\u7063)\u202c",
    "zh-yue": "\u7cb5\u8a9e",
    zu: "isiZulu",
  };
  mw.Language.transformClass = [
    "am",
    "ar",
    "bat_smg",
    "be_tarak",
    "be",
    "bh",
    "bs",
    "cs",
    "cu",
    "cy",
    "dsb",
    "fr",
    "ga",
    "gd",
    "gv",
    "he",
    "hi",
    "hr",
    "hsb",
    "hy",
    "ksh",
    "ln",
    "lt",
    "lv",
    "mg",
    "mk",
    "mo",
    "mt",
    "nso",
    "pl",
    "pt_br",
    "ro",
    "ru",
    "se",
    "sh",
    "sk",
    "sl",
    "sma",
    "sr_ec",
    "sr_el",
    "sr",
    "ti",
    "tl",
    "uk",
    "wa",
  ];
  mw.Language.fallbackTransformMap = {
    mwl: "pt",
    ace: "id",
    hsb: "de",
    frr: "de",
    pms: "it",
    dsb: "de",
    gan: "gan-hant",
    lzz: "tr",
    ksh: "de",
    kl: "da",
    fur: "it",
    "zh-hk": "zh-hant",
    kk: "kk-cyrl",
    "zh-my": "zh-sg",
    nah: "es",
    sr: "sr-ec",
    "ckb-latn": "ckb-arab",
    mo: "ro",
    ay: "es",
    gl: "pt",
    gag: "tr",
    mzn: "fa",
    "ruq-cyrl": "mk",
    "kk-arab": "kk-cyrl",
    pfl: "de",
    "zh-yue": "yue",
    ug: "ug-latn",
    ltg: "lv",
    nds: "de",
    sli: "de",
    mhr: "ru",
    sah: "ru",
    ff: "fr",
    ab: "ru",
    "ko-kp": "ko",
    sg: "fr",
    "zh-tw": "zh-hant",
    "map-bms": "jv",
    av: "ru",
    "nds-nl": "nl",
    "pt-br": "pt",
    ce: "ru",
    vep: "et",
    wuu: "zh-hans",
    pdt: "de",
    krc: "ru",
    "gan-hant": "zh-hant",
    bqi: "fa",
    as: "bn",
    bm: "fr",
    gn: "es",
    tt: "ru",
    "zh-hant": "zh-hans",
    hif: "hif-latn",
    zh: "zh-hans",
    kaa: "kk-latn",
    lij: "it",
    vot: "fi",
    ii: "zh-cn",
    "ku-arab": "ckb-arab",
    xmf: "ka",
    vmf: "de",
    "zh-min-nan": "nan",
    bcc: "fa",
    an: "es",
    rgn: "it",
    qu: "es",
    nb: "no",
    bar: "de",
    lbe: "ru",
    su: "id",
    pcd: "fr",
    glk: "fa",
    lb: "de",
    "kk-kz": "kk-cyrl",
    "kk-tr": "kk-latn",
    inh: "ru",
    mai: "hi",
    tp: "tokipona",
    "kk-latn": "kk-cyrl",
    ba: "ru",
    nap: "it",
    ruq: "ruq-latn",
    "tt-cyrl": "ru",
    lad: "es",
    dk: "da",
    "de-ch": "de",
    "be-x-old": "be-tarask",
    za: "zh-hans",
    "kk-cn": "kk-arab",
    shi: "ar",
    crh: "crh-latn",
    yi: "he",
    pdc: "de",
    eml: "it",
    uk: "ru",
    kv: "ru",
    koi: "ru",
    cv: "ru",
    "zh-cn": "zh-hans",
    "de-at": "de",
    jut: "da",
    vec: "it",
    "zh-mo": "zh-hk",
    "fiu-vro": "vro",
    frp: "fr",
    mg: "fr",
    "ruq-latn": "ro",
    sa: "hi",
    lmo: "it",
    kiu: "tr",
    tcy: "kn",
    srn: "nl",
    jv: "id",
    vls: "nl",
    zea: "nl",
    ty: "fr",
    szl: "pl",
    rmy: "ro",
    wo: "fr",
    vro: "et",
    udm: "ru",
    bpy: "bn",
    mrj: "ru",
    ckb: "ckb-arab",
    xal: "ru",
    "de-formal": "de",
    myv: "ru",
    ku: "ku-latn",
    "crh-cyrl": "ru",
    gsw: "de",
    rue: "uk",
    iu: "ike-cans",
    stq: "de",
    "gan-hans": "zh-hans",
    scn: "it",
    arn: "es",
    ht: "fr",
    "zh-sg": "zh-hans",
    "bat-smg": "lt",
    aln: "sq",
    tg: "tg-cyrl",
    li: "nl",
    simple: "en",
    os: "ru",
    ln: "fr",
    als: "gsw",
    "zh-classical": "lzh",
    arz: "ar",
    wa: "fr",
  };
})(window.mw);
if (typeof gMsg != "undefined") {
  mw.addMessages(gMsg);
}
window["gM"] = mw.getMsg;
mw.addMessages({
  "mwe-loading_txt": "Loading ...",
  "mwe-size-gigabytes": "$1 GB",
  "mwe-size-megabytes": "$1 MB",
  "mwe-size-kilobytes": "$1 K",
  "mwe-size-bytes": "$1 B",
  "mwe-error_load_lib":
    "Error: JavaScript $1 was not retrievable or does not define $2",
  "mwe-apiproxy-setup": "Setting up API proxy",
  "mwe-load-drag-item": "Loading dragged item",
  "mwe-ok": "OK",
  "mwe-cancel": "Cancel",
  "mwe-enable-gadget": "Enable multimedia beta (mwEmbed) for all pages",
  "mwe-enable-gadget-done": "Multimedia beta gadget has been enabled",
  "mwe-must-login-gadget":
    'To enable gadget you must <a target="_new" href="$1">login</a>',
  "mwe-test-plural": "I ran {{PLURAL:$1|$1 test|$1 tests}}",
});
(function (mw) {
  mw.Api = {};
  mw.getTitleText = function (apiUrl, title, callback) {
    if (!callback) {
      title = apiUrl;
      callback = title;
      apiUrl = mw.getLocalApiUrl();
    }
    var request = { titles: title, prop: "revisions", rvprop: "content" };
    mw.getJSON(apiUrl, request, function (data) {
      if (!data || !data.query || !data.query.pages) {
        callback(false);
      }
      var pages = data.query.pages;
      for (var i in pages) {
        var page = pages[i];
        if (
          page["revisions"] &&
          typeof page["revisions"][0]["*"] != "undefined"
        ) {
          callback(page["revisions"][0]["*"]);
          return;
        }
      }
      callback(false);
    });
  };
  mw.parseWikiText = function (wikitext, title, callback) {
    mw.load("JSON", function () {
      $j.ajax({
        type: "POST",
        url: mw.getLocalApiUrl(),
        timeout: 60000,
        data: { action: "parse", format: "json", title: title, text: wikitext },
        dataType: "text",
        success: function (data) {
          var jsonData = JSON.parse(data);
          callback(jsonData.parse.text["*"]);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          callback("Error: failed to parse wikitext ");
        },
      });
    });
  };
  mw.getJSON = function () {
    var url = false;
    url = typeof arguments[0] == "string" ? arguments[0] : mw.getLocalApiUrl();
    var data = null;
    data = typeof arguments[0] == "object" ? arguments[0] : null;
    if (!data && typeof arguments[1] == "object") {
      data = arguments[1];
    }
    var callback = false;
    callback = typeof arguments[1] == "function" ? arguments[1] : false;
    var cbinx = 1;
    if (!callback && typeof arguments[2] == "function") {
      callback = arguments[2];
      cbinx = 2;
    }
    var timeoutCallback = false;
    timeoutCallback =
      typeof arguments[cbinx + 1] == "function" ? arguments[cbinx + 1] : false;
    if (!url) {
      return false;
    }
    if (!data["action"]) {
      data["action"] = "query";
    }
    if (!data["format"]) {
      data["format"] = "json";
    }
    var requestTimeOutFlag = false;
    var ranCallback = false;
    var myCallback = function (data) {
      if (!requestTimeOutFlag) {
        ranCallback = true;
        callback(data);
      }
    };
    setTimeout(function () {
      if (!ranCallback) {
        requestTimeOutFlag = true;
        if (timeoutCallback) {
          timeoutCallback();
        }
      }
    }, mw.getConfig("defaultRequestTimeout") * 1000);
    if (mw.checkRequestPost(data) || data["_method"] == "post") {
      if (!mw.isLocalDomain(url)) {
        ranCallback = true;
        mw.load("ApiProxy", function () {
          mw.ApiProxy.doRequest(url, data, callback, timeoutCallback);
        });
      } else {
        $j.post(url, data, myCallback, "json");
      }
      return;
    }
    if (!mw.isLocalDomain(url)) {
      if (url.indexOf("callback=") == -1 || data["callback"] == -1) {
        url += url.indexOf("?") == -1 ? "?callback=?" : "&callback=?";
      }
    }
    $j.getJSON(url, data, myCallback);
  };
  mw.checkRequestPost = function (data) {
    if ($j.inArray(data["action"], mw.getConfig("apiPostActions")) != -1) {
      return true;
    }
    if (data["prop"] == "info" && data["intoken"]) {
      return true;
    }
    if (data["meta"] == "userinfo") {
      return true;
    }
    return false;
  };
  mw.isLocalDomain = function (url) {
    if (
      mw.parseUri(document.URL).host == mw.parseUri(url).host ||
      url.indexOf("://") == -1
    ) {
      return true;
    }
    return false;
  };
  mw.getToken = function (apiUrl, title, callback) {
    if (typeof title == "function") {
      callback = title;
      title = apiUrl;
      apiUrl = mw.getLocalApiUrl();
    }
    var request = { prop: "info", intoken: "edit", titles: title };
    mw.getJSON(apiUrl, request, function (data) {
      for (var i in data.query.pages) {
        if (data.query.pages[i]["edittoken"]) {
          callback(data.query.pages[i]["edittoken"]);
          return;
        }
      }
      callback(false);
    });
  };
  var apiUserNameCache = {};
  mw.getUserName = function (apiUrl, callback, fresh) {
    if (typeof apiUrl == "function") {
      var callback = apiUrl;
      var apiUrl = mw.getLocalApiUrl();
    }
    if (mw.isLocalDomain(apiUrl)) {
      if (typeof wgUserName != "undefined" && wgUserName !== null) {
        callback(wgUserName);
        return wgUserName;
      }
    }
    if (!fresh && apiUserNameCache[apiUrl]) {
      callback(apiUserNameCache[apiUrl]);
      return;
    }
    var request = { action: "query", meta: "userinfo" };
    mw.getJSON(
      apiUrl,
      request,
      function (data) {
        if (
          !data ||
          !data.query ||
          !data.query.userinfo ||
          !data.query.userinfo.name
        ) {
          callback(false);
          return;
        }
        if (data.query.userinfo.id == 0) {
          callback(false);
          return;
        }
        apiUserNameCache[apiUrl] = data.query.userinfo.name;
        callback(data.query.userinfo.name);
      },
      function () {
        callback(false);
      }
    );
  };
  mw.getApiProviderURL = function (providerId) {
    if (mw.getConfig(providerId + "_apiurl")) {
      return mw.getConfig(providerId + "_apiurl");
    }
    return mw.getLocalApiUrl();
  };
  mw.getLocalApiUrl = function () {
    if (typeof wgServer != "undefined" && typeof wgScriptPath != "undefined") {
      return wgServer + wgScriptPath + "/api.php";
    }
    return false;
  };
})(window.mw);
var mwCoreComponentList = ["mw.Parser", "mw.Language", "mw.Api"];
mw.setDefaultConfig({
  coreComponents: mwCoreComponentList,
  jQueryUISkin: "kdark",
  mediaWikiEmbedPath: "js/mwEmbed/",
  apiPostActions: [
    "login",
    "purge",
    "rollback",
    "delete",
    "undelete",
    "protect",
    "block",
    "unblock",
    "move",
    "edit",
    "upload",
    "emailuser",
    "import",
    "userrights",
  ],
  debug: false,
  defaultRequestTimeout: 30,
  userLanguage: "en",
  commons_apiurl: "http://commons.wikimedia.org/w/api.php",
  "loader.groupStrategy": "module",
  "Mw.AppendWithJS": false,
});
mw.setConfig("loaderContext", "");
mw.addResourcePaths({
  mwEmbed: "mwEmbed.js",
  "window.jQuery": "libraries/jquery/jquery-1.4.2.js",
  "$j.mobile": "libraries/jquerymobile/jquery.mobile-1.0a2.js",
  "mw.style.mobile": "libraries/jquerymobile/jquery.mobile-1.0a2.css",
  "mw.Language": "components/mw.Language.js",
  "mw.Parser": "components/mw.Parser.js",
  "mw.Api": "components/mw.Api.js",
  Modernizr: "libraries/jquery/plugins/modernizr.js",
  JSON: "libraries/json/json2.js",
  MD5: "libraries/crypto/MD5.js",
  "$j.replaceText.js": "libraries/jquery/plugins/jquery.replaceText.js",
  "$j.fn.menu": "libraries/jquery/plugins/jquery.menu/jquery.menu.js",
  "mw.style.jquerymenu": "libraries/jquery/plugins/jquery.menu/jquery.menu.css",
  "$j.fn.pngFix": "libraries/jquery/plugins/jquery.pngFix.js",
  "$j.fn.autocomplete": "libraries/jquery/plugins/jquery.autocomplete.js",
  "mw.style.autocomplete": "libraries/jquery/plugins/jquery.autocomplete.css",
  "$j.fn.hoverIntent": "libraries/jquery/plugins/jquery.hoverIntent.js",
  "$j.fn.datePicker": "libraries/jquery/plugins/jquery.datePicker.js",
  "mw.style.ui_redmond": "skins/jquery.ui.themes/redmond/jquery-ui-1.7.2.css",
  "mw.style.ui_darkness": "skins/jquery.ui.themes/darkness/jquery-ui-1.7.2.css",
  "mw.style.ui_le-frog": "skins/jquery.ui.themes/le-frog/jquery-ui-1.7.2.css",
  "mw.style.ui_start": "skins/jquery.ui.themes/start/jquery-ui-1.7.2.css",
  "mw.style.ui_sunny": "skins/jquery.ui.themes/sunny/jquery-ui-1.7.2.css",
  "mw.style.ui_kdark":
    "skins/jquery.ui.themes/kaltura-dark/jquery-ui-1.7.2.css",
  "mw.style.mwCommon": "skins/common/mw.style.mwCommon.css",
  "$j.cookie": "libraries/jquery/plugins/jquery.cookie.js",
  "$j.postMessage": "libraries/jquery/plugins/jquery.postmessage.js",
  "$j.contextMenu": "libraries/jquery/plugins/jquery.contextMenu.js",
  "$j.fn.suggestions": "libraries/jquery/plugins/jquery.suggestions.js",
  "$j.fn.textSelection": "libraries/jquery/plugins/jquery.textSelection.js",
  "$j.browserTest": "libraries/jquery/plugins/jquery.browserTest.js",
  "$j.fn.jWizard": "libraries/jquery/plugins/jquery.jWizard.js",
  "$j.ui": "libraries/jquery/jquery.ui/ui/jquery.ui.core.js",
  "$j.widget": "libraries/jquery/jquery.ui/ui/jquery.ui.widget.js",
  "$j.effects.blind": "libraries/jquery/jquery.ui/ui/jquery.effects.blind.js",
  "$j.effects.bounce": "libraries/jquery/jquery.ui/ui/jquery.effects.bounce.js",
  "$j.effects.clip": "libraries/jquery/jquery.ui/ui/jquery.effects.clip.js",
  "$j.effects": "libraries/jquery/jquery.ui/ui/jquery.effects.core.js",
  "$j.effects.drop": "libraries/jquery/jquery.ui/ui/jquery.effects.drop.js",
  "$j.effects.explode":
    "libraries/jquery/jquery.ui/ui/jquery.effects.explode.js",
  "$j.effects.fold": "libraries/jquery/jquery.ui/ui/jquery.effects.fold.js",
  "$j.effects.highlight":
    "libraries/jquery/jquery.ui/ui/jquery.effects.highlight.js",
  "$j.effects.pulsate":
    "libraries/jquery/jquery.ui/ui/jquery.effects.pulsate.js",
  "$j.effects.scale": "libraries/jquery/jquery.ui/ui/jquery.effects.scale.js",
  "$j.effects.shake": "libraries/jquery/jquery.ui/ui/jquery.effects.shake.js",
  "$j.effects.slide": "libraries/jquery/jquery.ui/ui/jquery.effects.slide.js",
  "$j.effects.transfer":
    "libraries/jquery/jquery.ui/ui/jquery.effects.transfer.js",
  "$j.ui.accordion": "libraries/jquery/jquery.ui/ui/jquery.ui.accordion.js",
  "$j.ui.autocomplete":
    "libraries/jquery/jquery.ui/ui/jquery.ui.autocomplete.js",
  "$j.ui.button": "libraries/jquery/jquery.ui/ui/jquery.ui.button.js",
  "$j.ui.datepicker": "libraries/jquery/jquery.ui/ui/jquery.ui.datepicker.js",
  "$j.ui.dialog": "libraries/jquery/jquery.ui/ui/jquery.ui.dialog.js",
  "$j.ui.droppable": "libraries/jquery/jquery.ui/ui/jquery.ui.droppable.js",
  "$j.ui.draggable": "libraries/jquery/jquery.ui/ui/jquery.ui.draggable.js",
  "$j.ui.mouse": "libraries/jquery/jquery.ui/ui/jquery.ui.mouse.js",
  "$j.ui.position": "libraries/jquery/jquery.ui/ui/jquery.ui.position.js",
  "$j.ui.progressbar": "libraries/jquery/jquery.ui/ui/jquery.ui.progressbar.js",
  "$j.ui.resizable": "libraries/jquery/jquery.ui/ui/jquery.ui.resizable.js",
  "$j.ui.selectable": "libraries/jquery/jquery.ui/ui/jquery.ui.selectable.js",
  "$j.ui.slider": "libraries/jquery/jquery.ui/ui/jquery.ui.slider.js",
  "$j.ui.sortable": "libraries/jquery/jquery.ui/ui/jquery.ui.sortable.js",
  "$j.ui.tabs": "libraries/jquery/jquery.ui/ui/jquery.ui.tabs.js",
});
mw.addStyleResourceDependency({
  "$j.ui": "mw.style.ui_" + mw.getConfig("jQueryUISkin"),
});
(function (mw) {
  mw.setDefaultConfig({
    "EmbedPlayer.OverlayControls": true,
    "EmbedPlayer.CodecPreference": ["webm", "h264", "ogg"],
    "EmbedPlayer.EnableIpadHTMLControls": false,
    "EmbedPlayer.LibraryPage":
      "http://www.kaltura.org/project/HTML5_Video_Media_JavaScript_Library",
    "EmbedPlayer.ApiProvider": "local",
    "EmbedPlayer.RewriteTags": "video,audio,playlist",
    "EmbedPlayer.DefaultSize": "400x300",
    "EmbedPlayer.KalturaAttribution": true,
    "EmbedPlayer.AttributionButton": {
      title: "Kaltura html5 video library",
      href: "http://www.kaltura.org/project/HTML5_Video_Media_JavaScript_Library",
      class: "kaltura-icon",
      iconurl: false,
    },
    "EmbedPlayer.EnableOptionsMenu": true,
    "EmbedPlayer.WaitForMeta": true,
    "EmbedPlayer.ShowNativeWarning": true,
    "EmbedPlayer.EnableFullscreen": true,
    "EmbedPlayer.NativeControls": false,
    "EmbedPlayer.NativeControlsMobileSafari": true,
    "EmbedPlayer.fullScreenZIndex": 999998,
    "EmbedPlayer.ShareEmbedMode": "iframe",
    "EmbedPlayer.SkinName": "mvpcf",
    "EmbedPlayer.MonitorRate": 250,
    "EmbedPlayer.EnalbeIFramePlayerServer": false,
    "EmbedPlayer.UseFlashOnAndroid": false,
    "EmbedPlayer.EnableURLTimeEncoding": "flash",
    "EmbedPLayer.IFramePlayer.DomainWhiteList": "*",
    "EmbedPlayer.EnableIframeApi": true,
  });
  mw.setDefaultConfig("EmbedPlayer.SourceAttributes", [
    "id",
    "src",
    "title",
    "URLTimeEncoding",
    "startOffset",
    "durationHint",
    "start",
    "end",
    "default",
    "title",
    "titleKey",
  ]);
  mw.mergeConfig("EmbedPlayer.Attributes", {
    id: null,
    width: null,
    height: null,
    src: null,
    poster: null,
    autoplay: false,
    loop: false,
    controls: true,
    paused: true,
    readyState: 0,
    networkState: 0,
    currentTime: 0,
    previousTime: 0,
    previousVolume: 1,
    volume: 0.75,
    preMuteVolume: 0.75,
    duration: null,
    muted: false,
    videoAspect: "4:3",
    start: 0,
    end: null,
    apiTitleKey: null,
    apiProvider: null,
    overlaycontrols: true,
    usenativecontrols: false,
    attributionbutton: true,
    roe: null,
    startOffset: 0,
    thumbnail: null,
    linkback: null,
    download_link: true,
    type: null,
  });
  mw.addResourcePaths({
    "mw.EmbedPlayer": "mw.EmbedPlayer.js",
    "mw.EmbedPlayerKplayer": "mw.EmbedPlayerKplayer.js",
    "mw.EmbedPlayerGeneric": "mw.EmbedPlayerGeneric.js",
    "mw.EmbedPlayerHtml": "mw.EmbedPlayerHtml.js",
    "mw.EmbedPlayerJava": "mw.EmbedPlayerJava.js",
    "mw.EmbedPlayerNative": "mw.EmbedPlayerNative.js",
    "mw.EmbedPlayerVlc": "mw.EmbedPlayerVlc.js",
    "mw.PlayerControlBuilder": "skins/mw.PlayerControlBuilder.js",
    "mw.style.EmbedPlayer": "skins/mw.style.EmbedPlayer.css",
    "mw.style.PlayerSkinKskin": "skins/kskin/mw.style.PlayerSkinKskin.css",
    "mw.PlayerSkinKskin": "skins/kskin/mw.PlayerSkinKskin.js",
    "mw.PlayerSkinMvpcf": "skins/mvpcf/mw.PlayerSkinMvpcf.js",
    "mw.style.PlayerSkinMvpcf": "skins/mvpcf/mw.style.PlayerSkinMvpcf.css",
    "mw.IFramePlayerApiServer": "mw.IFramePlayerApiServer.js",
    "mw.IFramePlayerApiClient": "mw.IFramePlayerApiClient.js",
  });
  mw.documentHasPlayerTags = function () {
    var rewriteTags = mw.getConfig("EmbedPlayer.RewriteTags");
    if ($j(rewriteTags).length != 0) {
      return true;
    }
    return false;
  };
  mw.addSetupHook(function (callback) {
    mw.rewritePagePlayerTags(callback);
  });
  mw.rewritePagePlayerTags = function (callback) {
    var doModuleTagRewrites = function () {
      $j(mw).triggerQueueCallback("LoadeRewritePlayerTags", callback);
    };
    if (mw.documentHasPlayerTags()) {
      var rewriteElementCount = 0;
      $j(mw.getConfig("EmbedPlayer.RewriteTags")).each(function (
        index,
        element
      ) {
        if ($j(element).attr("id") == "") {
          $j(element).attr("id", "v" + rewriteElementCount++);
        }
        $j(element)
          .getAbsoluteOverlaySpinner()
          .attr("id", "loadingSpinner_" + $j(element).attr("id"))
          .addClass("playerLoadingSpinner");
      });
      mw.load("EmbedPlayer", function () {
        $j(mw.getConfig("EmbedPlayer.RewriteTags")).embedPlayer(
          doModuleTagRewrites
        );
      });
    } else {
      doModuleTagRewrites();
    }
  };
  mw.addModuleLoader("EmbedPlayer", function () {
    var _this = this;
    $j(".videonojs").hide();
    var dependencyRequest = [
      ["mw.EmbedPlayer"],
      [
        "mw.PlayerControlBuilder",
        "$j.fn.hoverIntent",
        "mw.style.EmbedPlayer",
        "$j.cookie",
        "JSON",
        "$j.ui",
        "$j.widget",
      ],
      ["$j.ui.mouse", "$j.fn.menu", "mw.style.jquerymenu", "$j.ui.slider"],
    ];
    $j(mw.getConfig("EmbedPlayer.RewriteTags")).each(function (
      inx,
      playerElement
    ) {
      mw.embedPlayerUpdateLibraryRequest(playerElement, dependencyRequest[1]);
    });
    if ($j.browser.msie && $j.browser.version < 7) {
      dependencyRequest[0].push("$j.fn.pngFix");
    }
    if ($j.browser.msie) {
      dependencyRequest[0].push("mw.EmbedPlayerJava");
    }
    if (!!document.createElement("video").canPlayType && !$j.browser.safari) {
      dependencyRequest[0].push("mw.EmbedPlayerNative");
    }
    if (
      mw.getConfig("EmbedPlayer.EnableIframeApi") &&
      mw.getConfig("EmbedPlayer.IframeParentUrl")
    ) {
      dependencyRequest[0].push("mw.EmbedPlayerNative");
      dependencyRequest[0].push("$j.postMessage");
      dependencyRequest[0].push("mw.IFramePlayerApiServer");
    }
    return dependencyRequest;
  });
  mw.embedPlayerUpdateLibraryRequest = function (
    playerElement,
    dependencyRequest
  ) {
    var skinName = $j(playerElement).attr("class");
    if (!skinName || $j.inArray(skinName.toLowerCase(), mw.validSkins) == -1) {
      skinName = mw.getConfig("EmbedPlayer.SkinName");
    }
    skinName = skinName.toLowerCase();
    var skinCaseName = skinName.charAt(0).toUpperCase() + skinName.substr(1);
    if ($j.inArray("mw.PlayerSkin" + skinCaseName, dependencyRequest) == -1) {
      dependencyRequest.push("mw.PlayerSkin" + skinCaseName);
    }
    if (
      $j.inArray("mw.style.PlayerSkin" + skinCaseName, dependencyRequest) == -1
    ) {
      dependencyRequest.push("mw.style.PlayerSkin" + skinCaseName);
    }
    $j(mw).trigger("LoaderEmbedPlayerUpdateRequest", [
      playerElement,
      dependencyRequest,
    ]);
  };
})(window.mw);
(function (mw) {
  mw.addResourcePaths({
    "mw.TimedText": "mw.TimedText.js",
    "mw.style.TimedText": "css/mw.style.TimedText.css",
    "mw.TimedTextEdit": "mw.TimedTextEdit.js",
    "mw.style.TimedTextEdit": "css/mw.style.TimedTextEdit.css",
    RemoteMwTimedText: "remotes/RemoteMwTimedText.js",
  });
  var sourceAttr = mw.getConfig("EmbedPlayer.SourceAttributes");
  mw.setConfig(
    "EmbedPlayer.SourceAttributes",
    $j.extend(sourceAttr, ["srclang", "category"])
  );
  mw.setDefaultConfig({
    "TimedText.showInterface": "auto",
    "TimedText.showAddTextLink": true,
    "TimedText.NeedsTranscriptCategory": "Videos needing subtitles",
  });
  var mwTimedTextRequestSet = [
    "$j.fn.menu",
    "mw.TimedText",
    "mw.style.TimedText",
    "mw.style.jquerymenu",
  ];
  mw.addModuleLoader("TimedText", mwTimedTextRequestSet);
  $j(mw).bind(
    "LoaderEmbedPlayerUpdateRequest",
    function (event, playerElement, classRequest) {
      if (mw.isTimedTextSupported(playerElement)) {
        classRequest = $j.merge(classRequest, mwTimedTextRequestSet);
      }
    }
  );
  $j(mw).bind("newEmbedPlayerEvent", function (event, embedPlayer) {
    if (mw.isTimedTextSupported(embedPlayer)) {
      if (!embedPlayer.timedText && mw.TimedText) {
        embedPlayer.timedText = new mw.TimedText(embedPlayer);
      }
    }
  });
  mw.isTimedTextSupported = function (embedPlayer) {
    if (mw.getConfig("TimedText.showInterface") == "always") {
      return true;
    }
    if (
      $j(embedPlayer).attr("apititlekey") ||
      $j(embedPlayer).attr("apiTitleKey") ||
      (embedPlayer.mediaElement &&
        embedPlayer.mediaElement.textSourceExists()) ||
      $j(embedPlayer).find("track").length != 0
    ) {
      return true;
    } else {
      return false;
    }
  };
  mw.addModuleLoader("TimedText.Edit", [
    [
      "$j.ui",
      "$j.widget",
      "$j.ui.mouse",
      "$j.ui.position",
      "$j.fn.menu",
      "mw.style.jquerymenu",
      "mw.TimedText",
      "mw.style.TimedText",
      "mw.TimedTextEdit",
      "mw.style.TimedTextEdit",
    ],
    ["$j.ui.dialog", "$j.ui.tabs"],
  ]);
})(window.mw);
mw.addMessages({
  "mwe-embedplayer-credit-title": "Title: $1",
  "mwe-embedplayer-loading_plugin": "Loading plugin ...",
  "mwe-embedplayer-select_playback": "Set playback preference",
  "mwe-embedplayer-link_back": "Link back",
  "mwe-embedplayer-error_swap_vid":
    "Error: mwEmbed was unable to swap the video tag for the mwEmbed interface",
  "mwe-embedplayer-add_to_end_of_sequence": "Add to end of sequence",
  "mwe-embedplayer-missing_video_stream":
    "The video file for this stream is missing",
  "mwe-embedplayer-play_clip": "Play clip",
  "mwe-embedplayer-pause_clip": "Pause clip",
  "mwe-embedplayer-volume_control": "Volume control",
  "mwe-embedplayer-player_options": "Player options",
  "mwe-embedplayer-timed_text": "Timed text",
  "mwe-embedplayer-player_fullscreen": "Fullscreen",
  "mwe-embedplayer-next_clip_msg": "Play next clip",
  "mwe-embedplayer-prev_clip_msg": "Play previous clip",
  "mwe-embedplayer-current_clip_msg": "Continue playing this clip",
  "mwe-embedplayer-seek_to": "Seek $1",
  "mwe-embedplayer-paused": "paused",
  "mwe-embedplayer-download_segment": "Download selection:",
  "mwe-embedplayer-download_full": "Download full video file:",
  "mwe-embedplayer-download_right_click":
    "To download, right click and select <i>Save link as...</i>",
  "mwe-embedplayer-download_clip": "Download video",
  "mwe-embedplayer-download_text": "Download text",
  "mwe-embedplayer-download": "Download",
  "mwe-embedplayer-share": "Share",
  "mwe-embedplayer-credits": "Credits",
  "mwe-embedplayer-about-library": "About Kaltura player",
  "mwe-embedplayer-about-library-desc":
    "Kaltura's HTML5 media library enables you to take advantage of the HTML5 &lt;video&gt and &lt;audio&gt; tags today with a consistent player interface across all major browsers.\n\n[$1 More about the Kaltura player library].",
  "mwe-embedplayer-clip_linkback": "Clip source page",
  "mwe-embedplayer-choose_player": "Choose video player",
  "mwe-embedplayer-no-player": "No player available for $1",
  "mwe-embedplayer-share_this_video": "Share this video",
  "mwe-embedplayer-video_credits": "Video credits",
  "mwe-embedplayer-kaltura-platform-title":
    "Kaltura open source video platform",
  "mwe-embedplayer-menu_btn": "Menu",
  "mwe-embedplayer-close_btn": "Close",
  "mwe-embedplayer-ogg-player-vlc-player": "VLC player",
  "mwe-embedplayer-ogg-player-oggNative": "HTML5 Ogg player",
  "mwe-embedplayer-ogg-player-h264Native": "HTML5 H.264 player",
  "mwe-embedplayer-ogg-player-webmNative": "HTML5 WebM player",
  "mwe-embedplayer-ogg-player-oggPlugin": "Generic Ogg plugin",
  "mwe-embedplayer-ogg-player-quicktime-mozilla": "QuickTime plugin",
  "mwe-embedplayer-ogg-player-quicktime-activex": "QuickTime ActiveX",
  "mwe-embedplayer-ogg-player-cortado": "Java Cortado",
  "mwe-embedplayer-ogg-player-flowplayer": "Flowplayer",
  "mwe-embedplayer-ogg-player-kplayer": "Kaltura player",
  "mwe-embedplayer-ogg-player-selected": "(selected)",
  "mwe-embedplayer-ogg-player-omtkplayer": "OMTK Flash Vorbis",
  "mwe-embedplayer-generic_missing_plugin":
    'You browser does not appear to support the following playback type: <b>$1</b><br />Visit the <a href="http://commons.wikimedia.org/wiki/Commons:Media_help">Playback methods</a> page to download a player.<br />',
  "mwe-embedplayer-for_best_experience":
    'For a better video playback experience we recommend the <b><a href="http://www.mozilla.com/en-US/firefox/upgrade.html?from=mwEmbed">latest Firefox</a>.</b>',
  "mwe-embedplayer-do_not_warn_again": "Dismiss for now.",
  "mwe-embedplayer-playerSelect": "Players",
  "mwe-embedplayer-read_before_embed":
    '<a href="http://mediawiki.org/wiki/Security_Notes_on_Remote_Embedding" target="_new">Read this</a> before embedding.',
  "mwe-embedplayer-embed_site_or_blog": "Embed on a page",
  "mwe-embedplayer-related_videos": "Related videos",
  "mwe-embedplayer-seeking": "seeking",
  "mwe-embedplayer-buffering": "buffering",
  "mwe-embedplayer-copy-code": "Copy code",
  "mwe-embedplayer-video-h264": "H.264 video",
  "mwe-embedplayer-video-flv": "Flash video",
  "mwe-embedplayer-video-webm": "WebM video",
  "mwe-embedplayer-video-ogg": "Ogg video",
  "mwe-embedplayer-video-audio": "Ogg audio",
  "mwe-embedplayer-missing-source": "No source video was found",
});
mw.setDefaultConfig("EmbedPlayer.SourceAttributes", [
  "id",
  "src",
  "title",
  "URLTimeEncoding",
  "startOffset",
  "durationHint",
  "start",
  "end",
  "default",
  "titleKey",
]);
(function ($) {
  $.embedPlayers = function (attributes, callback) {
    $j(mw.getConfig("EmbedPlayer.RewriteTags")).embedPlayer(
      attributes,
      callback
    );
  };
  $.fn.embedPlayer = function (attributes, callback) {
    if (this.selector) {
      var playerSelect = this.selector;
    } else {
      var playerSelect = this;
    }
    if (!attributes) {
      attributes = {};
    }
    if (typeof attributes == "function") {
      callback = attributes;
      attributes = {};
    }
    $j(playerSelect).each(function (index, playerElement) {
      if (!$j(playerElement).attr("id")) {
        $j(playerElement).attr("id", "mwe_v" + index);
      }
      if (
        playerElement.nodeName.toLowerCase() == "div" &&
        (attributes.poster || $j(playerElement).attr("poster"))
      ) {
        var posterSrc = attributes.poster
          ? attributes.poster
          : $j(playerElement).attr("poster");
        var width = $j(playerElement).width();
        var height = $j(playerElement).height();
        if (!width) {
          var width = attributes.width ? attributes.width : "100%";
        }
        if (!height) {
          var height = attributes.height ? attributes.height : "100%";
        }
        $j(playerElement).append(
          $j("<img />")
            .attr("src", posterSrc)
            .css({ position: "absolute", width: width, height: height })
        );
      }
    });
    if (!mw.playerManager) {
      mw.playerManager = new EmbedPlayerManager();
      $j(mw).trigger("EmbedPlayerManagerReady");
    }
    mw.setupUserConfig(function () {
      var addedToPlayerManager = false;
      $j(playerSelect).each(function (index, playerElement) {
        if ($j(playerElement).hasClass("nativeEmbedPlayerPid")) {
          $j("#loadingSpinner_" + $j(playerElement).attr("id")).hide();
        } else {
          addedToPlayerManager = true;
          mw.playerManager.addPlayerElement(playerElement, attributes);
        }
      });
      if (addedToPlayerManager) {
        if (callback) {
          $j(mw).bind("playersReadyEvent", callback);
        }
      } else {
        if (callback) {
          callback();
        }
      }
    });
  };
})(jQuery);
var EmbedPlayerManager = function () {
  return this.init();
};
EmbedPlayerManager.prototype = {
  callbackFunctions: null,
  playerElementQueue: [],
  init: function () {
    this.callbackFunctions = [];
    this.playerList = [];
  },
  getPlayerList: function () {
    return this.playerList;
  },
  addPlayerElement: function (playerElement, attributes) {
    var _this = this;
    if (!playerElement.id || playerElement.id == "") {
      playerElement.id = "vid" + (this.playerList.length + 1);
    }
    this.playerList.push(playerElement.id);
    var playerDependencyRequest = [];
    $j.extend(playerElement, attributes);
    mw.embedPlayerUpdateLibraryRequest(playerElement, playerDependencyRequest);
    mw.load(playerDependencyRequest, function () {
      var waitForMeta = true;
      if (playerElement.pause) {
        playerElement.pause();
      }
      $j(mw).trigger("checkPlayerWaitForMetaData", playerElement);
      waitForMeta = playerElement.waitForMeta === false ? false : true;
      if (waitForMeta) {
        waitForMeta = _this.waitForMetaCheck(playerElement);
      }
      var ranPlayerSwapFlag = false;
      function runPlayerSwap() {
        if (ranPlayerSwapFlag) {
          return;
        }
        ranPlayerSwapFlag = true;
        var playerInterface = new mw.EmbedPlayer(playerElement, attributes);
        var swapPlayer = _this.swapEmbedPlayerElement(
          playerElement,
          playerInterface
        );
        $j(mw).trigger(
          "newEmbedPlayerEvent",
          $j("#" + playerInterface.id).get(0)
        );
        $j("#" + playerInterface.id)
          .get(0)
          .checkPlayerSources();
      }
      if (waitForMeta && mw.getConfig("EmbedPlayer.WaitForMeta")) {
        $j(playerElement).bind("loadedmetadata", runPlayerSwap);
        setTimeout(runPlayerSwap, 5000);
        return;
      } else {
        runPlayerSwap();
        return;
      }
    });
  },
  waitForMetaCheck: function (playerElement) {
    var waitForMeta = false;
    if (!playerElement) {
      return false;
    }
    if (
      !playerElement.tagName ||
      (playerElement.tagName.toLowerCase() != "audio" &&
        playerElement.tagName.toLowerCase() != "video")
    ) {
      return false;
    }
    if (
      !mw.EmbedTypes.getMediaPlayers().isSupportedPlayer("oggNative") &&
      !mw.EmbedTypes.getMediaPlayers().isSupportedPlayer("webmNative") &&
      !mw.EmbedTypes.getMediaPlayers().isSupportedPlayer("h264Native")
    ) {
      return false;
    }
    var width = $j(playerElement).css("width");
    var height = $j(playerElement).css("height");
    if (
      $j(playerElement).css("width") == "300px" &&
      $j(playerElement).css("height") == "150px"
    ) {
      waitForMeta = true;
    } else {
      if (
        $j(playerElement).attr("duration") ||
        $j(playerElement).attr("durationHint")
      ) {
        return false;
      } else {
        waitForMeta = true;
      }
    }
    if (
      $j(playerElement).attr("width") == -1 ||
      $j(playerElement).attr("height") == -1
    ) {
      waitForMeta = true;
    }
    if (
      $j(playerElement).attr("width") === 0 ||
      $j(playerElement).attr("height") === 0
    ) {
      waitForMeta = true;
    }
    if (this.height == 150 && this.width == 300) {
      waitForMeta = true;
    }
    if (
      waitForMeta &&
      ($j(playerElement).attr("src") ||
        $j(playerElement).find("source[src]").length !== 0)
    ) {
      return true;
    } else {
      return false;
    }
  },
  swapEmbedPlayerElement: function (targetElement, playerInterface) {
    var swapPlayerElement = document.createElement("div");
    for (var method in playerInterface) {
      if (method != "readyState") {
        swapPlayerElement[method] = playerInterface[method];
      }
    }
    if (
      playerInterface.useNativePlayerControls() ||
      playerInterface.isPersistentNativePlayer()
    ) {
      $j(targetElement)
        .attr("id", playerInterface.pid)
        .addClass("nativeEmbedPlayerPid")
        .show()
        .after($j(swapPlayerElement).css("display", "none"));
    } else {
      $j(targetElement).replaceWith(swapPlayerElement);
    }
    $j(swapPlayerElement).css({
      width: playerInterface.width + "px",
      height: playerInterface.height + "px",
    });
    if ($j("#loadingSpinner_" + playerInterface.id).length == 0) {
      if (
        playerInterface.useNativePlayerControls() ||
        playerInterface.isPersistentNativePlayer()
      ) {
        var $spinner = $j(targetElement).getAbsoluteOverlaySpinner();
      } else {
        var $spinner = $j(swapPlayerElement).getAbsoluteOverlaySpinner();
      }
      $spinner.attr("id", "loadingSpinner_" + playerInterface.id);
    }
    return swapPlayerElement;
  },
  playerReady: function (player) {
    var _this = this;
    player.readyToPlay = true;
    $j("#loadingSpinner_" + player.id).remove();
    $j(player).trigger("playerReady");
    var is_ready = true;
    for (var i = 0; i < this.playerList.length; i++) {
      var currentPlayer = $j("#" + this.playerList[i]).get(0);
      if (player) {
        is_ready = player.readyToPlay || player.loadError ? is_ready : false;
      }
    }
    if (is_ready) {
      $j(".loadingSpinner,.playerLoadingSpinner").remove();
      $j(mw).trigger("playersReadyEvent");
    }
  },
};
function mediaSource(element) {
  this.init(element);
}
mediaSource.prototype = {
  mimeType: null,
  uri: null,
  title: null,
  markedDefault: false,
  URLTimeEncoding: false,
  startOffset: 0,
  duration: 0,
  is_playable: null,
  id: null,
  start_npt: null,
  end_npt: null,
  srclang: null,
  init: function (element) {
    this.src = $j(element).attr("src");
    var pUrl = mw.parseUri(this.src);
    if (typeof pUrl["queryKey"]["t"] != "undefined") {
      this.URLTimeEncoding = true;
    }
    var sourceAttr = mw.getConfig("EmbedPlayer.SourceAttributes");
    for (var i = 0; i < sourceAttr.length; i++) {
      var attr = sourceAttr[i];
      var attr_value = element.getAttribute(attr);
      if (attr_value) {
        this[attr] = attr_value;
      }
    }
    if ($j(element).attr("type")) {
      this.mimeType = $j(element).attr("type");
    } else if ($j(element).attr("content-type")) {
      this.mimeType = $j(element).attr("content-type");
    } else if ($j(element).get(0).tagName.toLowerCase() == "audio") {
      this.mimeType = "audio/ogg";
    } else {
      this.mimeType = this.detectType(this.src);
    }
    if (this.mimeType == "video/theora") {
      this.mimeType = "video/ogg";
    }
    if (this.mimeType == "audio/vorbis") {
      this.mimeType = "audio/ogg";
    }
    if ($j(element).parent().attr("category")) {
      this.category = $j(element).parent().attr("category");
    }
    if ($j(element).attr("default")) {
      this.markedDefault = true;
    }
    this.getURLDuration();
  },
  updateSource: function (element) {
    if ($j(element).attr("title")) {
      this.title = $j(element).attr("title");
    }
  },
  updateSrcTime: function (start_npt, end_npt) {
    if (this.URLTimeEncoding) {
      if (!mw.npt2seconds(start_npt)) {
        start_npt = this.start_npt;
      }
      if (!mw.npt2seconds(end_npt)) {
        end_npt = this.end_npt;
      }
      this.src = mw.replaceUrlParams(this.src, {
        t: start_npt + "/" + end_npt,
      });
      this.getURLDuration();
    }
  },
  setDuration: function (duration) {
    this.duration = duration;
    if (!this.end_npt) {
      this.end_npt = mw.seconds2npt(this.startOffset + duration);
    }
  },
  getMIMEType: function () {
    if (this.mimeType) {
      return this.mimeType;
    }
    this.mimeType = this.detectType(this.src);
    return this.mimeType;
  },
  getSrc: function (serverSeekTime) {
    if (!serverSeekTime || !this.URLTimeEncoding) {
      return this.src;
    }
    var endvar = "";
    if (this.end_npt) {
      endvar = "/" + this.end_npt;
    }
    return mw.replaceUrlParams(this.src, {
      t: mw.seconds2npt(serverSeekTime) + endvar,
    });
  },
  getTitle: function () {
    if (this.title) {
      return this.title;
    }
    switch (this.getMIMEType()) {
      case "video/h264":
        return gM("mwe-embedplayer-video-h264");
        break;
      case "video/x-flv":
        return gM("mwe-embedplayer-video-flv");
        break;
      case "video/webm":
        return gM("mwe-embedplayer-video-webm");
        break;
      case "video/ogg":
        return gM("mwe-embedplayer-video-ogg");
        break;
      case "audio/ogg":
        return gM("mwe-embedplayer-video-audio");
        break;
      case "video/mpeg":
        return "MPEG video";
        break;
      case "video/x-msvideo":
        return "AVI video";
        break;
    }
    var urlParts = mw.parseUri(this.getSrc());
    if (urlParts.file) {
      return urlParts.file;
    }
    return this.mimeType;
  },
  getURLDuration: function () {
    if (this.URLTimeEncoding) {
      var annoURL = mw.parseUri(this.src);
      if (annoURL.queryKey.t) {
        var times = annoURL.queryKey.t.split("/");
        this.start_npt = times[0];
        this.end_npt = times[1];
        this.startOffset = mw.npt2seconds(this.start_npt);
        this.duration = mw.npt2seconds(this.end_npt) - this.startOffset;
      } else {
        if (this.startOffset) {
          this.start_npt = mw.seconds2npt(this.startOffset);
        }
        if (this.duration) {
          this.end_npt = mw.seconds2npt(
            parseInt(this.duration) + parseInt(this.startOffset)
          );
        }
      }
    }
  },
  detectType: function (uri) {
    var urlParts = mw.parseUri(uri);
    var ext = urlParts.file ? /[^.]+$/.exec(urlParts.file) : /[^.]+$/.exec(uri);
    switch (ext.toString().toLowerCase()) {
      case "smil":
      case "sml":
        return "application/smil";
        break;
      case "m4v":
      case "mp4":
        return "video/h264";
        break;
      case "webm":
        return "video/webm";
        break;
      case "srt":
        return "text/x-srt";
        break;
      case "flv":
        return "video/x-flv";
        break;
      case "ogg":
      case "ogv":
        return "video/ogg";
        break;
      case "oga":
        return "audio/ogg";
        break;
      case "anx":
        return "video/ogg";
        break;
      case "xml":
        return "text/xml";
        break;
      case "avi":
        return "video/x-msvideo";
        break;
      case "mpg":
        return "video/mpeg";
        break;
      case "mpeg":
        return "video/mpeg";
        break;
    }
  },
};
function mediaElement(element) {
  this.init(element);
}
mediaElement.prototype = {
  sources: null,
  addedROEData: false,
  selectedSource: null,
  thumbnail: null,
  linkback: null,
  init: function (videoElement) {
    var _this = this;
    this.sources = new Array();
    if ($j(videoElement).attr("src")) {
      _this.tryAddSource(videoElement);
    }
    $j(videoElement)
      .find("source,track")
      .each(function () {
        _this.tryAddSource(this);
      });
  },
  updateSourceTimes: function (start_npt, end_npt) {
    var _this = this;
    $j.each(this.sources, function (inx, mediaSource) {
      mediaSource.updateSrcTime(start_npt, end_npt);
    });
  },
  textSourceExists: function () {
    for (var i = 0; i < this.sources.length; i++) {
      if (
        this.sources[i].mimeType == "text/cmml" ||
        this.sources[i].mimeType == "text/x-srt"
      ) {
        return true;
      }
    }
    return false;
  },
  getSources: function (mimeFilter) {
    if (!mimeFilter) {
      return this.sources;
    }
    var source_set = new Array();
    for (var i = 0; i < this.sources.length; i++) {
      if (
        this.sources[i].mimeType &&
        this.sources[i].mimeType.indexOf(mimeFilter) != -1
      ) {
        source_set.push(this.sources[i]);
      }
    }
    return source_set;
  },
  getSourceById: function (source_id) {
    for (var i = 0; i < this.sources.length; i++) {
      if (this.sources[i].id == source_id) {
        return this.sources[i];
      }
    }
    return null;
  },
  selectSource: function (index) {
    var playableSources = this.getPlayableSources();
    for (var i = 0; i < playableSources.length; i++) {
      if (i == index) {
        this.selectedSource = playableSources[i];
        mw.EmbedTypes.getMediaPlayers().setFormatPreference(
          playableSources[i].mimeType
        );
        break;
      }
    }
  },
  autoSelectSource: function () {
    var _this = this;
    var playableSources = this.getPlayableSources();
    var flash_flag = (ogg_flag = false);
    if (playableSources.length == 0) {
      return false;
    }
    var setSelectedSource = function (source) {
      _this.selectedSource = source;
    };
    for (var source = 0; source < playableSources.length; source++) {
      var mimeType = playableSources[source].mimeType;
      if (
        mw.EmbedTypes.getMediaPlayers().preference["format_preference"] ==
        mimeType
      ) {
        setSelectedSource(playableSources[source]);
        return true;
      }
    }
    for (var source = 0; source < playableSources.length; source++) {
      if (playableSources[source].markedDefault) {
        setSelectedSource(playableSources[source]);
        return true;
      }
    }
    var namedSources = [];
    for (var source = 0; source < playableSources.length; source++) {
      var mimeType = playableSources[source].mimeType;
      var player = mw.EmbedTypes.getMediaPlayers().defaultPlayer(mimeType);
      if (player && player.library == "Native") {
        switch (player.id) {
          case "oggNative":
            namedSources["ogg"] = playableSources[source];
            break;
          case "webmNative":
            namedSources["webm"] = playableSources[source];
            break;
          case "h264Native":
            namedSources["h264"] = playableSources[source];
            break;
        }
      }
    }
    var codecPref = mw.getConfig("EmbedPlayer.CodecPreference");
    for (var i = 0; i < codecPref.length; i++) {
      var codec = codecPref[i];
      if (namedSources[codec]) {
        setSelectedSource(namedSources[codec]);
        return true;
      }
    }
    for (var source = 0; source < playableSources.length; source++) {
      var mimeType = playableSources[source].mimeType;
      var player = mw.EmbedTypes.getMediaPlayers().defaultPlayer(mimeType);
      if (
        mimeType == "video/h264" &&
        player &&
        (player.library == "Native" || player.library == "Kplayer")
      ) {
        setSelectedSource(playableSources[source]);
        return true;
      }
    }
    if (!this.selectedSource) {
      setSelectedSource(playableSources[0]);
      return true;
    }
    return false;
  },
  isOgg: function (mimeType) {
    if (
      mimeType == "video/ogg" ||
      mimeType == "ogg/video" ||
      mimeType == "video/annodex" ||
      mimeType == "application/ogg"
    ) {
      return true;
    }
    return false;
  },
  getPosterSrc: function () {
    return this.poster;
  },
  hasStreamOfMIMEType: function (mimeType) {
    for (var i = 0; i < this.sources.length; i++) {
      if (this.sources[i].getMIMEType() == mimeType) {
        return true;
      }
    }
    return false;
  },
  isPlayableType: function (mimeType) {
    if (mw.EmbedTypes.getMediaPlayers().defaultPlayer(mimeType)) {
      return true;
    } else {
      return false;
    }
  },
  tryAddSource: function (element) {
    var newSrc = $j(element).attr("src");
    if (newSrc) {
      for (var i = 0; i < this.sources.length; i++) {
        if (this.sources[i].src == newSrc) {
          this.sources[i].updateSource(element);
          return this.sources[i];
        }
      }
    }
    var source = new mediaSource(element);
    this.sources.push(source);
    return source;
  },
  getPlayableSources: function () {
    var playableSources = [];
    for (var i = 0; i < this.sources.length; i++) {
      if (this.isPlayableType(this.sources[i].mimeType)) {
        playableSources.push(this.sources[i]);
      } else {
      }
    }
    return playableSources;
  },
  addROE: function (roe_data) {
    this.addedROEData = true;
    var _this = this;
    if (roe_data) {
      var $roeParsed = $j(roe_data.pay_load);
      $roeParsed.find("mediaSource").each(function (inx, source) {
        _this.tryAddSource(source);
      });
      $roeParsed.find("img").each(function (inx, n) {
        if ($j(n).attr("id") == "stream_thumb") {
          _this.poster = $j(n).attr("src");
        }
      });
      $roeParsed.find("link").each(function (inx, n) {
        if ($j(n).attr("id") == "html_linkback") {
          _this.linkback = $j(n).attr("href");
        }
      });
    } else {
    }
  },
};
mw.EmbedPlayer = function (element, customAttributes) {
  return this.init(element, customAttributes);
};
mw.EmbedPlayer.prototype = {
  mediaElement: null,
  supports: {},
  previewMode: false,
  readyToPlay: false,
  loadError: false,
  thumbnail_updating: false,
  posterDisplayed: true,
  cmmlData: null,
  serverSeekTime: 0,
  seeking: false,
  bufferedPercent: 0,
  monitorTimerId: null,
  bufferStartFlag: false,
  bufferEndFlag: false,
  pauseTime: null,
  donePlayingCount: 0,
  _propagateEvents: true,
  onDoneInterfaceFlag: true,
  init: function (element, customAttributes) {
    var _this = this;
    if (!customAttributes) {
      customAttributes = {};
    }
    var playerAttributes = mw.getConfig("EmbedPlayer.Attributes");
    for (var attr in playerAttributes) {
      if (customAttributes[attr] || customAttributes[attr] === false) {
        this[attr] = customAttributes[attr];
      } else if (element.getAttribute(attr) != null) {
        if (element.getAttribute(attr) == "") {
          this[attr] = true;
        } else {
          this[attr] = element.getAttribute(attr);
        }
      } else {
        this[attr] = playerAttributes[attr];
      }
      if (this[attr] == "false") this[attr] = false;
      if (this[attr] == "true") this[attr] = true;
    }
    if (this.apiTitleKey) {
      this.apiTitleKey = decodeURI(this.apiTitleKey);
    }
    if (this.useNativePlayerControls()) {
      _this.controls = false;
    }
    if ($j(element).attr("thumbnail")) {
      _this.poster = $j(element).attr("thumbnail");
    }
    if ($j(element).attr("poster")) {
      _this.poster = $j(element).attr("poster");
    }
    var sn = $j(element).attr("class");
    if (sn && sn != "") {
      for (var n = 0; n < mw.validSkins.length; n++) {
        if (sn.indexOf(mw.validSkins[n].toLowerCase()) !== -1) {
          this.skinName = mw.validSkins[n];
        }
      }
    }
    if (!this.skinName) {
      this.skinName = mw.getConfig("EmbedPlayer.SkinName");
    }
    if (!this.monitorRate) {
      this.monitorRate = mw.getConfig("EmbedPlayer.MonitorRate");
    }
    if (this.startOffset && this.startOffset.split(":").length >= 2) {
      this.startOffset = parseFloat(mw.npt2seconds(this.startOffset));
    }
    this.startOffset = parseFloat(this.startOffset);
    if ($j(element).attr("duration")) {
      _this.duration = $j(element).attr("duration");
    }
    if (!_this.duration && $j(element).attr("durationHint")) {
      _this.durationHint = $j(element).attr("durationHint");
      _this.duration = mw.npt2seconds(_this.durationHint);
    }
    this.duration = parseFloat(this.duration);
    this.loadPlayerSize(element);
    this.pid = "pid_" + this.id;
    if (
      element.innerHTML != "" &&
      element.getElementsByTagName("source").length == 0
    ) {
      this.user_missing_plugin_html = element.innerHTML;
    }
    this.mediaElement = new mediaElement(element);
    if (customAttributes.sources && customAttributes.sources.length) {
      for (var i = 0; i < customAttributes.sources.length; i++) {
        var customSource = customAttributes.sources[i];
        if (customSource.src) {
          var $source = $j("<source />").attr("src", customSource.src);
          if (customSource.type) {
            $source.attr("type", customSource.type);
          }
          if (customSource.title) {
            $source.attr("title", customSource.title);
          }
          this.mediaElement.tryAddSource($source.get(0));
        }
      }
    }
  },
  stopEventPropagation: function () {
    this.stopMonitor();
    this._propagateEvents = false;
  },
  restoreEventPropagation: function () {
    this._propagateEvents = true;
    this.startMonitor();
  },
  enableSeekBar: function () {
    this.controlBuilder.enableSeekBar();
    $j(this).trigger("onEnableSeekBar");
  },
  disableSeekBar: function () {
    this.controlBuilder.disableSeekBar();
    $j(this).trigger("ondisableSeekBar");
  },
  updateFeatureSupport: function () {
    $j(this).trigger("updateFeatureSupportEvent", this.supports);
    return;
  },
  loadPlayerSize: function (element) {
    this.height = $j(element).css("height");
    this.width = $j(element).css("width");
    if (this.height == "32px" || this.height == "32px") {
      var defaultSize = mw.getConfig("EmbedPlayer.DefaultSize").split("x");
      this.width = "100%";
      this.height = "100%";
    }
    if (this.height.indexOf("100%") != -1 || this.width.indexOf("100%") != -1) {
      $relativeParent = $j(element)
        .parents()
        .filter(function () {
          return $j(this).is("body") || $j(this).css("position") == "relative";
        })
        .slice(0, 1);
      this.width = $relativeParent.width();
      this.height = $relativeParent.height();
    }
    this.height = parseInt(this.height);
    this.width = parseInt(this.width);
    this.height =
      this.height == 0 || (isNaN(this.height) && $j(element).attr("height"))
        ? parseInt($j(element).attr("height"))
        : this.height;
    this.width =
      this.width == 0 || (isNaN(this.width) && $j(element).attr("width"))
        ? parseInt($j(element).attr("width"))
        : this.width;
    if (element.tagName.toLowerCase() == "audio" && this.height == "32") {
      this.height = 0;
    }
    if (element.tagName.toLowerCase() != "audio" && this.videoAspect) {
      var aspect = this.videoAspect.split(":");
      if (this.height && !this.width) {
        this.width = parseInt(this.height * (aspect[0] / aspect[1]));
      }
      if (this.width && !this.height) {
        var apectRatio = aspect[1] / aspect[0];
        this.height = parseInt(this.width * (aspect[1] / aspect[0]));
      }
    }
    if (
      isNaN(this.height) ||
      isNaN(this.width) ||
      this.height == -1 ||
      this.width == -1 ||
      ((this.height == 150 || this.height == 64) && this.width == 300)
    ) {
      var defaultSize = mw.getConfig("EmbedPlayer.DefaultSize").split("x");
      if (isNaN(this.width)) {
        this.width = defaultSize[0];
      }
      if (element.tagName.toLowerCase() == "audio") {
        this.height = 0;
      } else {
        this.height = defaultSize[1];
      }
    }
  },
  resizePlayer: function (size, animate, callback) {
    if (this.useNativePlayerControls()) {
      if (animate) {
        $j(this.getPlayerElement()).animate(size, callback);
      } else {
        $j(this.getPlayerElement()).css(size);
        if (callback) {
          callback();
        }
      }
    } else {
      this.controlBuilder.resizePlayer(size, animate, callback);
    }
    $j(this).trigger("onResizePlayer", [size, animate]);
  },
  getPlayerWidth: function () {
    return $j(this).width();
  },
  getPlayerHeight: function () {
    return $j(this).height();
  },
  checkPlayerSources: function () {
    var _this = this;
    var finishCheckPlayerSources = function () {
      $j(_this).triggerQueueCallback("checkPlayerSourcesEvent", function () {
        _this.setupSourcePlayer();
      });
    };
    if (_this.apiTitleKey && this.mediaElement.sources.length == 0) {
      _this.loadSourceFromApi(function () {
        finishCheckPlayerSources();
      });
      return;
    } else {
      finishCheckPlayerSources();
    }
  },
  emptySources: function () {
    if (this.mediaElement) {
      this.mediaElement.sources = [];
      this.mediaElement.selectedSource = null;
    }
  },
  switchPlaySrc: function (source) {},
  loadSourceFromApi: function (callback) {
    var _this = this;
    if (!_this.apiTitleKey) {
      return false;
    }
    if (!_this.apiProvider) {
      _this.apiProvider = mw.getConfig("EmbedPlayer.ApiProvider");
    }
    var request = {
      prop: "imageinfo",
      titles:
        "File:" + unescape(this.apiTitleKey).replace(/^(File:|Image:)/, ""),
      iiprop: "url|size|dimensions|metadata",
      iiurlwidth: _this.width,
      redirects: true,
    };
    mw.getJSON(
      mw.getApiProviderURL(_this.apiProvider),
      request,
      function (data) {
        if (data.query.pages) {
          for (var i in data.query.pages) {
            if (i == "-1") {
              callback(false);
              return;
            }
            var page = data.query.pages[i];
          }
        } else {
          callback(false);
          return;
        }
        if (!page.imageinfo || !page.imageinfo[0]) {
          callback(false);
          return;
        }
        var imageinfo = page.imageinfo[0];
        _this.poster = imageinfo.thumburl;
        _this.mediaElement.tryAddSource(
          $j("<source />").attr("src", imageinfo.url).get(0)
        );
        if (imageinfo.metadata[2]["name"] == "length") {
          _this.duration = imageinfo.metadata[2]["value"];
        }
        if (imageinfo.height != 0 && imageinfo.width != 0) {
          _this.height = parseInt(
            _this.width * (imageinfo.height / imageinfo.width)
          );
        }
        $j(_this).css("height", _this.height);
        callback();
      }
    );
  },
  setupSourcePlayer: function () {
    this.mediaElement.autoSelectSource();
    if (!this.mediaElement.selectedSource) {
    } else {
      this.selectedPlayer = mw.EmbedTypes.getMediaPlayers().defaultPlayer(
        this.mediaElement.selectedSource.mimeType
      );
    }
    if (this.selectedPlayer) {
      this.inheritEmbedPlayer();
    } else {
      this.showPluginMissingHTML();
    }
  },
  inheritEmbedPlayer: function (callback) {
    if (this.instanceOf) {
      eval("var tmpObj = mw.EmbedPlayer" + this.instanceOf);
      for (var i in tmpObj) {
        if (this["parent_" + i]) {
          this[i] = this["parent_" + i];
        } else {
          this[i] = null;
        }
      }
    }
    var _this = this;
    this.selectedPlayer.load(function () {
      var playerInterface = mw["EmbedPlayer" + _this.selectedPlayer.library];
      for (var method in playerInterface) {
        if (_this[method] && !_this["parent_" + method]) {
          _this["parent_" + method] = _this[method];
        }
        _this[method] = playerInterface[method];
      }
      _this.updateFeatureSupport();
      _this.getDuration();
      setTimeout(function () {
        _this.showPlayer();
        mw.playerManager.playerReady(_this);
        if (typeof callback == "function") {
          callback();
        }
      }, 1);
    });
  },
  selectPlayer: function (player) {
    var _this = this;
    if (this.selectedPlayer.id != player.id) {
      this.selectedPlayer = player;
      this.inheritEmbedPlayer(function () {
        _this.$interface.find(".track").remove();
        if (_this.controls && _this.controlBuilder.checkOverlayControls()) {
          _this.controlBuilder.showControlBar();
          _this.$interface.hoverIntent({
            sensitivity: 4,
            timeout: 2000,
            over: function () {
              _this.controlBuilder.showControlBar();
            },
            out: function () {
              _this.controlBuilder.hideControlBar();
            },
          });
        }
      });
    }
  },
  getTimeRange: function () {
    var end_time = this.controlBuilder.longTimeDisp
      ? "/" + mw.seconds2npt(this.getDuration())
      : "";
    var default_time_range = "0:00" + end_time;
    if (!this.mediaElement) return default_time_range;
    if (!this.mediaElement.selectedSource) return default_time_range;
    if (!this.mediaElement.selectedSource.end_npt) return default_time_range;
    return (
      this.mediaElement.selectedSource.start_npt +
      this.mediaElement.selectedSource.end_npt
    );
  },
  getDuration: function () {
    return this.duration;
  },
  getHeight: function () {
    return this.height;
  },
  getWidth: function () {
    return this.width;
  },
  isAudio: function () {
    return this.mediaElement.selectedSource.mimeType.indexOf("audio/") !== -1;
  },
  doEmbedHTML: function () {
    return "Error: function doEmbedHTML should be implemented by embed player interface ";
  },
  doSeek: function (percent) {
    var _this = this;
    this.seeking = true;
    if (this.supportsURLTimeEncoding()) {
      if (_this.currentTime == _this.serverSeekTime) {
        return;
      }
      this.stop();
      this.didSeekJump = true;
      this.serverSeekTime =
        mw.npt2seconds(this.start_npt) +
        parseFloat(percent * this.getDuration());
      this.updatePlayHead(percent);
    }
    setTimeout(function () {
      _this.seeking = false;
      _this.play();
      _this.monitor();
    }, 100);
    this.controlBuilder.onSeek();
  },
  setCurrentTime: function (time, callback) {},
  onClipDone: function () {
    var _this = this;
    if (!_this._propagateEvents) {
      return;
    }
    if (!this.isStopped()) {
      this.stop();
      this.controlBuilder.showControlBar();
      this.donePlayingCount++;
      $j(this).trigger("ended");
      if (this.onDoneInterfaceFlag) {
        if (this.loop) {
          this.play();
          return;
        }
        this.serverSeekTime = 0;
        this.updatePlayHead(0);
        if (this.previewMode) {
          return;
        }
        this.controlBuilder.onClipDone();
      }
    }
  },
  showThumbnail: function () {
    var _this = this;
    this.controlBuilder.closeMenuOverlay();
    this.updatePosterHTML();
    this.paused = true;
    this.posterDisplayed = true;
    this.controlBuilder.addControlBindings();
    if (!this.useNativePlayerControls()) {
      $j(this).trigger("mediaLoaded");
    }
  },
  showPlayer: function () {
    var _this = this;
    this.controlBuilder = new mw.PlayerControlBuilder(this);
    var _this = this;
    if ($j(this).parent(".mwplayer_interface").length == 0) {
      $j(this)
        .wrap(
          $j("<div>")
            .addClass("mwplayer_interface " + this.controlBuilder.playerClass)
            .css({
              width: this.width + "px",
              height: this.height + "px",
              position: "relative",
            })
        )
        .css("position", "absolute");
    }
    this.$interface = $j(this).parent(".mwplayer_interface");
    if (!this.useNativePlayerControls() && this.isPersistentNativePlayer()) {
      this.$interface.css({
        position: "absolute",
        top: "0px",
        left: "0px",
        background: null,
      });
      if (
        this.isPersistentNativePlayer() &&
        !_this.controlBuilder.checkOverlayControls()
      ) {
        $j("#" + this.pid).css(
          "height",
          this.height - _this.controlBuilder.height
        );
      }
      $j(this).show();
      this.controls = true;
    }
    if (
      !this.useNativePlayerControls() &&
      !this.isPersistentNativePlayer() &&
      !_this.controlBuilder.checkOverlayControls()
    ) {
      $j(this).css("height", this.height - _this.controlBuilder.height);
    }
    this.updatePosterHTML();
    if (this.controls) {
      this.controlBuilder.addControls();
    } else {
      this.$interface.hide();
    }
    this.updateTemporalUrl();
    if (this.autoplay) {
      setTimeout(function () {
        _this.play();
      }, 1);
    }
  },
  updateTemporalUrl: function () {
    var sourceHash = /[^\#]+$/.exec(this.getSrc()).toString();
    if (sourceHash.indexOf("t=") === 0) {
      var times = sourceHash.substr(2).split(",");
      if (times[0]) {
        this.currentTime = mw.npt2seconds(times[0].toString());
      }
      if (times[1]) {
        this.pauseTime = mw.npt2seconds(times[1].toString());
        if (this.pauseTime < this.currentTime) {
          this.pauseTime = null;
        }
      }
      this.updatePlayHead(this.currentTime / this.duration);
      this.controlBuilder.setStatus(mw.seconds2npt(this.currentTime));
    }
  },
  showPluginMissingHTML: function () {
    var missingType = "";
    var or = "";
    for (var i = 0; i < this.mediaElement.sources.length; i++) {
      missingType += or + this.mediaElement.sources[i].mimeType;
      or = " or ";
    }
    $j(".playerLoadingSpinner,.loadingSpinner").remove();
    if ($j("#" + this.pid).length != 0) {
      $j("#loadingSpinner_" + this.id).remove();
      $j("#" + this.pid).hide();
    }
    if (this.mediaElement.sources.length == 0) {
      $j("#pid_" + this.id).hide();
      $j(this)
        .show()
        .html($j("<span />").text(gM("mwe-embedplayer-missing-source")));
      return;
    }
    var source = this.mediaElement.sources[0];
    $j(this).html(
      $j("<div />").append(
        gM("mwe-embedplayer-generic_missing_plugin", missingType),
        $j("<br />"),
        $j("<a />")
          .attr({
            title: gM("mwe-embedplayer-download_clip"),
            href: source.src,
          })
          .text(gM("mwe-embedplayer-download_clip"))
      )
    );
  },
  updateVideoTimeReq: function (time_req) {
    var time_parts = time_req.split("/");
    this.updateVideoTime(time_parts[0], time_parts[1]);
  },
  updateVideoTime: function (start_npt, end_npt) {
    this.mediaElement.updateSourceTimes(start_npt, end_npt);
    this.controlBuilder.setStatus(start_npt + "/" + end_npt);
    this.updatePlayHead(0);
    if (this.mediaElement.selectedSource.URLTimeEncoding) {
      this.serverSeekTime = 0;
    } else {
      this.serverSeekTime = mw.npt2seconds(start_npt);
    }
  },
  updateThumbTimeNPT: function (time) {
    this.updateThumbTime(mw.npt2seconds(time) - parseInt(this.startOffset));
  },
  updateThumbTime: function (floatSeconds) {
    var _this = this;
    if (typeof this.org_thum_src == "undefined") {
      this.org_thum_src = this.poster;
    }
    if (this.org_thum_src.indexOf("t=") !== -1) {
      this.last_thumb_url = mw.replaceUrlParams(this.org_thum_src, {
        t: mw.seconds2npt(floatSeconds + parseInt(this.startOffset)),
      });
      if (!this.thumbnail_updating) {
        this.updatePoster(this.last_thumb_url, false);
        this.last_thumb_url = null;
      }
    }
  },
  updateThumbPerc: function (percent) {
    return this.updateThumbTime(this.getDuration() * percent);
  },
  updatePosterSrc: function (src, quick_switch) {
    if (
      !this.thumbnail_updating &&
      $j("#img_thumb_" + this.id).attr("src") == src
    )
      return false;
    if (
      this.thumbnail_updating &&
      $j("#new_img_thumb_" + this.id).attr("src") == src
    )
      return false;
    if (quick_switch) {
      $j("#img_thumb_" + this.id).attr("src", src);
    } else {
      var _this = this;
      if (this.thumbnail_updating == true)
        $j("#new_img_thumb_" + this.id)
          .stop()
          .remove();
      if (this.posterDisplayed) {
        this.thumbnail_updating = true;
        $j(this).append(
          $j("<img />")
            .attr({
              src: src,
              id: "new_img_thumb_" + this.id,
              width: this.width,
              height: this.height,
            })
            .css({
              display: "none",
              position: "absolute",
              "z-index": 2,
              top: "0px",
              left: "0px",
            })
        );
        $j("#new_img_thumb_" + this.id).fadeIn("slow", function () {
          $j("#img_thumb_" + _this.id).remove();
          $j("#new_img_thumb_" + _this.id).attr("id", "img_thumb_" + _this.id);
          $j("#img_thumb_" + _this.id).css("z-index", "1");
          _this.thumbnail_updating = false;
          if (_this.last_thumb_url) {
            var src_url = _this.last_thumb_url;
            _this.last_thumb_url = null;
            _this.updatePosterSrc(src_url);
          }
        });
      }
    }
  },
  updatePosterSrc: function (posterSrc) {
    this.poster = posterSrc;
  },
  updatePosterHTML: function () {
    var thumb_html = "";
    var class_atr = "";
    var style_atr = "";
    if (this.useNativePlayerControls()) {
      this.showNativePlayer();
      return;
    }
    var posterSrc = this.poster
      ? this.poster
      : mw.getConfig("imagesPath") + "vid_default_thumb.jpg";
    if (this.isPersistentNativePlayer()) {
      $j("#" + this.pid).attr("poster", posterSrc);
    } else {
      $j(this).html(
        $j("<img />")
          .css({ position: "relative", width: "100%", height: "100%" })
          .attr({ id: "img_thumb_" + this.id, src: posterSrc })
          .addClass("playerPoster")
      );
    }
    if (
      this.controls &&
      this.height > this.controlBuilder.getComponentHeight("playButtonLarge")
    ) {
      $j(this).append(this.controlBuilder.getComponent("playButtonLarge"));
    }
  },
  useNativePlayerControls: function () {
    if (this.usenativecontrols === true) {
      return true;
    }
    if (mw.getConfig("EmbedPlayer.NativeControls") === true) {
      return true;
    }
    if (mw.isAndroid2() || mw.isIpod() || mw.isIphone()) {
      return true;
    }
    if (mw.isIpad()) {
      if (
        this.isPersistentNativePlayer() &&
        mw.getConfig("EmbedPlayer.EnableIpadHTMLControls")
      ) {
        return false;
      } else {
        if (mw.getConfig("EmbedPlayer.EnableIpadHTMLControls")) {
        }
        return true;
      }
    }
    return false;
  },
  isPersistentNativePlayer: function () {
    return $j("#" + this.pid).hasClass("persistentNativePlayer");
  },
  showNativePlayer: function () {
    var _this = this;
    $j(this).empty();
    $j("#loadingSpinner_" + this.id).remove();
    var source = this.mediaElement.getSources("video/h264")[0];
    if (!source || !source.src) {
      source = this.mediaElement.getSources("video/ogg")[0];
    }
    var videoAttribues = {
      poster: _this.poster,
      src: source.src,
      controls: "true",
    };
    if (this.loop) {
      videoAttribues["loop"] = "true";
    }
    var cssStyle = { width: _this.width, height: _this.height };
    $j("#" + this.pid).replaceWith(
      _this.getNativePlayerHtml(videoAttribues, cssStyle)
    );
    this.applyMediaElementBindings();
    if (mw.isAndroid2()) {
      this.addPlayBtnLarge();
    }
    return;
  },
  addPlayBtnLarge: function () {
    var _this = this;
    var $pid = $j("#" + _this.pid);
    $pid.siblings(".play-btn-large").remove();
    $playButton = this.controlBuilder.getComponent("playButtonLarge");
    $pid.after(
      $playButton.css({
        left:
          parseInt($pid.position().left) + parseInt($playButton.css("left")),
        top: parseInt($pid.position().top) + parseInt($playButton.css("top")),
      })
    );
  },
  getNativePlayerHtml: function () {
    return $j("<div />")
      .css("width", this.getWidth())
      .html(
        "Error: Trying to get native html5 player without native support for codec"
      );
  },
  applyMediaElementBindings: function () {
    return;
  },
  getEmbeddingHTML: function () {
    switch (mw.getConfig("EmbedPlayer.ShareEmbedMode")) {
      case "iframe":
        return this.getShareIframeObject();
        break;
      case "videojs":
        return this.getShareEmbedVideoJs();
        break;
    }
  },
  getShareIframeObject: function () {
    if (
      typeof wgServer != "undefined" &&
      typeof mwCheckForGadget != "undefined"
    ) {
      var iframeUrl =
        wgServer +
        wgArticlePath.replace(
          /\$1/,
          "File:" + unescape(this.apiTitleKey).replace(/^(File:|Image:)/, "")
        ) +
        "?" +
        mw.getConfig("Mw.AppendWithJS") +
        "&embedplayer=yes";
    } else if (typeof mw.IA != "undefined") {
      var iframeUrl = mw.IA.embedUrl();
    } else {
      var iframeUrl = mw.getMwEmbedPath() + "mwEmbedFrame.php?";
      var params = { "src[]": [] };
      if (this.apiTitleKey) {
        params.apiTitleKey = this.apiTitleKey;
        if (this.apiProvider) {
          if (mw.parseUri(document.URL).host == "commons.wikimedia.org") {
            this.apiProvider = "commons";
          }
          params.apiProvider = this.apiProvider;
        }
      } else {
        for (var i = 0; i < this.mediaElement.sources.length; i++) {
          var source = this.mediaElement.sources[i];
          if (source.src) {
            params["src[]"].push(mw.absoluteUrl(source.src));
          }
        }
        if (this.poster) {
          params.poster = this.poster;
        }
      }
      if (this.skinName) {
        params.skin = this.skinName;
      }
      if (this.duration) {
        params.durationHint = parseFloat(this.duration);
      }
      iframeUrl += $j.param(params);
    }
    var embedCode =
      "&lt;iframe src=&quot;" + mw.escapeQuotesHTML(iframeUrl) + "&quot; ";
    embedCode += "width=&quot;" + this.getPlayerWidth() + "&quot; ";
    embedCode += "height=&quot;" + this.getPlayerHeight() + "&quot; ";
    embedCode += "frameborder=&quot;0&quot; ";
    embedCode += "&gt;&lt/iframe&gt;";
    return embedCode;
  },
  getShareEmbedVideoJs: function () {
    var embedtag = this.isAudio() ? "audio" : "video";
    var embedCode =
      "&lt;script type=&quot;text/javascript&quot; " +
      "src=&quot;" +
      mw.escapeQuotesHTML(mw.absoluteUrl(mw.getMwEmbedSrc())) +
      "&quot;&gt;&lt;/script&gt" +
      "&lt;" +
      embedtag +
      " ";
    if (this.poster) {
      embedCode +=
        "poster=&quot;" +
        mw.escapeQuotesHTML(mw.absoluteUrl(this.poster)) +
        "&quot; ";
    }
    if (this.skinName) {
      embedCode +=
        "class=&quot;" + mw.escapeQuotesHTML(this.skinName) + "&quot; ";
    }
    if (this.duration) {
      embedCode +=
        "durationHint=&quot;" + parseFloat(this.duration) + "&quot; ";
    }
    if (this.width || this.height) {
      embedCode += "style=&quot;";
      embedCode += this.width ? "width:" + this.width + "px;" : "";
      embedCode += this.height ? "height:" + this.height + "px;" : "";
      embedCode += "&quot; ";
    }
    if (this.apiTitleKey) {
      embedCode +=
        "apiTitleKey=&quot;" +
        mw.escapeQuotesHTML(this.apiTitleKey) +
        "&quot; ";
      if (this.apiProvider) {
        embedCode +=
          "apiProvider=&quot;" +
          mw.escapeQuotesHTML(this.apiProvider) +
          "&quot; ";
      }
      embedCode += "&gt;&lt;/video&gt;";
    } else {
      embedCode += "&gt;";
      for (var i = 0; i < this.mediaElement.sources.length; i++) {
        var source = this.mediaElement.sources[i];
        if (source.src) {
          embedCode +=
            "&lt;source src=&quot;" +
            mw.absoluteUrl(source.src) +
            "&quot; &gt;&lt;/source&gt;";
        }
      }
      embedCode += "&lt;/video&gt;";
    }
    return embedCode;
  },
  play: function () {
    var _this = this;
    if (!this._propagateEvents) {
      return;
    }
    this.controlBuilder.closeMenuOverlay();
    if (this.posterDisplayed) {
      if (!this.selectedPlayer) {
        this.showPluginMissingHTML();
        return;
      } else {
        this.posterDisplayed = false;
        this.$interface.find(".play-btn-large").remove();
        this.doEmbedHTML();
      }
    }
    if (this.paused === true) {
      this.paused = false;
      if (!this.doMethodsAutoTrigger()) {
        $j(this).trigger("play");
      }
    }
    if (this.donePlayingCount > 0 && !this.paused) {
      $j(this).trigger("replayEvent");
    }
    this.$interface
      .find(".play-btn span")
      .removeClass("ui-icon-play")
      .addClass("ui-icon-pause");
    this.$interface
      .find(".play-btn")
      .unbind()
      .buttonHover()
      .click(function () {
        _this.pause();
      })
      .attr("title", gM("mwe-embedplayer-pause_clip"));
    this.monitor();
  },
  pause: function (event) {
    var _this = this;
    if (this.paused === false) {
      this.paused = true;
      if (!this.doMethodsAutoTrigger()) {
        $j(this).trigger("pause");
      }
    }
    this.$interface
      .find(".play-btn span")
      .removeClass("ui-icon-pause")
      .addClass("ui-icon-play");
    this.$interface
      .find(".play-btn")
      .unbind("click")
      .buttonHover()
      .click(function () {
        _this.play();
      })
      .attr("title", gM("mwe-embedplayer-play_clip"));
  },
  doMethodsAutoTrigger: function () {
    if ($j.browser.mozilla && !mw.versionIsAtLeast("2.0", $j.browser.version)) {
      return true;
    }
    return false;
  },
  load: function () {},
  stop: function () {
    var _this = this;
    this.didSeekJump = false;
    this.currentTime = this.previousTime = this.serverSeekTime = 0;
    this.stopMonitor();
    if (!this.paused) {
      this.paused = true;
      if (this["parent_pause"]) {
        this.parent_pause();
      } else {
        this.pause();
      }
    }
    if (this.useNativePlayerControls()) {
      this.getPlayerElement().currentTime = 0;
      this.getPlayerElement().pause();
      if (mw.isAndroid2()) {
        this.addPlayBtnLarge();
      }
    } else {
      this.showThumbnail();
      this.bufferedPercent = 0;
      this.controlBuilder.setStatus(this.getTimeRange());
      this.updatePlayHead(0);
    }
  },
  toggleMute: function () {
    if (this.muted) {
      this.muted = false;
      var percent = this.preMuteVolume;
    } else {
      this.muted = true;
      this.preMuteVolume = this.volume;
      var percent = 0;
    }
    this.setVolume(percent);
    this.setInterfaceVolume(percent);
  },
  setVolume: function (percent) {
    if (isNaN(percent)) {
      return;
    }
    this.previousVolume = this.volume = percent;
    if (percent != 0) {
      this.muted = false;
    }
    this.setPlayerElementVolume(percent);
    $j(this).trigger("volumeChanged", percent);
  },
  setInterfaceVolume: function (percent) {
    if (
      this.supports["volumeControl"] &&
      this.$interface.find(".volume-slider").length
    ) {
      this.$interface.find(".volume-slider").slider("value", percent * 100);
    }
  },
  setPlayerElementVolume: function (percent) {},
  getPlayerElementVolume: function () {
    return this.volume;
  },
  getPlayerElementMuted: function () {
    return this.muted;
  },
  fullscreen: function () {
    this.controlBuilder.toggleFullscreen();
  },
  postEmbedJS: function () {
    return;
  },
  isPlaying: function () {
    if (this.posterDisplayed) {
      return false;
    } else if (this.paused) {
      return false;
    } else {
      return true;
    }
  },
  isPaused: function () {
    return this.paused;
  },
  isStopped: function () {
    return this.posterDisplayed;
  },
  stopMonitor: function () {
    clearInterval(this.monitorInterval);
    this.monitorInterval = 0;
  },
  startMonitor: function () {
    this.monitor();
  },
  checkForCurrentTimeSeek: function () {
    var _this = this;
    if (
      _this.previousTime != _this.currentTime &&
      !this.userSlide &&
      !this.seeking
    ) {
      if (_this.getDuration() && _this.currentTime <= _this.getDuration()) {
        var seekPercent = _this.currentTime / _this.getDuration();
        _this.previousTime = _this.currentTime;
        this.doSeek(seekPercent);
      }
    }
  },
  monitor: function () {
    var _this = this;
    this.checkForCurrentTimeSeek();
    _this.currentTime = _this.getPlayerElementTime();
    if (_this.serverSeekTime && _this.supportsURLTimeEncoding()) {
      _this.currentTime =
        parseInt(_this.serverSeekTime) + parseInt(_this.getPlayerElementTime());
    }
    _this.previousTime = _this.currentTime;
    if (_this.pauseTime && _this.currentTime > _this.pauseTime) {
      _this.pause();
      _this.pauseTime = null;
    }
    if (
      Math.round(_this.volume * 100) != Math.round(_this.previousVolume * 100)
    ) {
      _this.setInterfaceVolume(_this.volume);
      if (_this._propagateEvents) {
        $j(this).trigger("volumeChanged", _this.volume);
      }
    }
    _this.previousVolume = _this.volume;
    _this.volume = this.getPlayerElementVolume();
    if (_this.muted != _this.getPlayerElementMuted() && !_this.isStopped()) {
      _this.toggleMute();
      _this.muted = _this.getPlayerElementMuted();
    }
    if (this.currentTime >= 0 && this.duration) {
      if (!this.userSlide && !this.seeking) {
        if (parseInt(this.startOffset) != 0) {
          this.updatePlayHead(
            (this.currentTime - this.startOffset) / this.duration
          );
          var et = this.controlBuilder.longTimeDisp
            ? "/" +
              mw.seconds2npt(
                parseFloat(this.startOffset) + parseFloat(this.duration)
              )
            : "";
          this.controlBuilder.setStatus(mw.seconds2npt(this.currentTime) + et);
        } else {
          this.updatePlayHead(this.currentTime / this.duration);
          var et = this.controlBuilder.longTimeDisp
            ? "/" + mw.seconds2npt(this.duration)
            : "";
          this.controlBuilder.setStatus(mw.seconds2npt(this.currentTime) + et);
        }
      }
      var endPresentationTime = this.startOffset
        ? this.startOffset + this.duration
        : this.duration;
      if (this.currentTime >= endPresentationTime) {
        this.onClipDone();
      }
    } else {
      if (this.isStopped()) {
        this.controlBuilder.setStatus(this.getTimeRange());
      } else if (this.isPaused()) {
        this.controlBuilder.setStatus(gM("mwe-embedplayer-paused"));
      } else if (this.isPlaying()) {
        if (this.currentTime && !this.duration)
          this.controlBuilder.setStatus(
            mw.seconds2npt(this.currentTime) + " /"
          );
        else this.controlBuilder.setStatus(" - - - ");
      } else {
        this.controlBuilder.setStatus(this.getTimeRange());
      }
    }
    this.updateBufferStatus();
    if (this.progressEventData) {
      if (_this._propagateEvents) {
        $j(this).trigger("progress", this.progressEventData);
      }
    }
    if (!this.isStopped()) {
      if (!this.monitorInterval) {
        this.monitorInterval = setInterval(function () {
          if (_this.monitor) _this.monitor();
        }, this.monitorRate);
      }
    } else {
      this.stopMonitor();
    }
    if (_this._propagateEvents) {
      $j(this).trigger("monitorEvent");
    }
  },
  getPlayerElementTime: function () {},
  updateBufferStatus: function () {
    $buffer = this.$interface.find(".mw_buffer");
    if (this.bufferedPercent != 0) {
      if (this.bufferedPercent > 1) {
        this.bufferedPercent = 1;
      }
      $buffer.css({ width: this.bufferedPercent * 100 + "%" });
      $j(this).trigger("updateBufferPercent", this.bufferedPercent);
    } else {
      $buffer.css("width", "0px");
    }
    if (this.bufferedPercent > 0 && !this.bufferStartFlag) {
      this.bufferStartFlag = true;
      $j(this).trigger("bufferStartEvent");
    }
    if (this.bufferedPercent == 1 && !this.bufferEndFlag) {
      this.bufferEndFlag = true;
      $j(this).trigger("bufferEndEvent");
    }
  },
  updatePlayHead: function (perc) {
    $playHead = this.$interface.find(".play_head");
    if (this.controls && $playHead.length != 0) {
      var val = parseInt(perc * 1000);
      $playHead.slider("value", val);
    }
    $j(this).trigger("updatePlayHeadPercent", perc);
  },
  getSrc: function (serverSeekTime) {
    if (serverSeekTime) {
      this.serverSeekTime = serverSeekTime;
    }
    if (this.currentTime && !this.serverSeekTime) {
      this.serverSeekTime = this.currentTime;
    }
    if (!this.mediaElement) {
      return false;
    }
    if (!this.mediaElement.selectedSource) {
      this.mediaElement.autoSelectSource();
    }
    if (this.mediaElement.selectedSource) {
      return this.mediaElement.selectedSource.getSrc(this.serverSeekTime);
    }
    return false;
  },
  supportsURLTimeEncoding: function () {
    var timeUrls = mw.getConfig("EmbedPlayer.EnableURLTimeEncoding");
    if (timeUrls == "none") {
      return false;
    } else if (timeUrls == "always") {
      return this.mediaElement.selectedSource.URLTimeEncoding;
    } else if (timeUrls == "flash") {
      if (this.mediaElement.selectedSource.URLTimeEncoding) {
        return this.instanceOf == "Kplayer";
      }
    } else {
    }
    return false;
  },
};
function mediaPlayer(id, supported_types, library) {
  this.id = id;
  this.supported_types = supported_types;
  this.library = library;
  this.loaded = false;
  this.loading_callbacks = new Array();
  return this;
}
mediaPlayer.prototype = {
  id: null,
  supported_types: null,
  library: null,
  loaded: false,
  supportsMIMEType: function (type) {
    for (var i = 0; i < this.supported_types.length; i++) {
      if (this.supported_types[i] == type) return true;
    }
    return false;
  },
  getName: function () {
    return gM("mwe-embedplayer-ogg-player-" + this.id);
  },
  load: function (callback) {
    mw.load(
      [
        "mw.EmbedPlayer" +
          this.library.substr(0, 1).toUpperCase() +
          this.library.substr(1),
      ],
      function () {
        callback();
      }
    );
  },
};
var kplayer = new mediaPlayer(
  "kplayer",
  ["video/x-flv", "video/h264"],
  "Kplayer"
);
var cortadoPlayer = new mediaPlayer(
  "cortado",
  ["video/ogg", "audio/ogg", "application/ogg"],
  "Java"
);
var oggNativePlayer = new mediaPlayer(
  "oggNative",
  ["video/ogg", "audio/ogg", "application/ogg"],
  "Native"
);
var h264NativePlayer = new mediaPlayer("h264Native", ["video/h264"], "Native");
var webmNativePlayer = new mediaPlayer("webmNative", ["video/webm"], "Native");
var vlcMineList = [
  "video/ogg",
  "audio/ogg",
  "application/ogg",
  "video/x-flv",
  "video/mp4",
  "video/h264",
  "video/x-msvideo",
  "video/mpeg",
];
var vlcPlayer = new mediaPlayer("vlc-player", vlcMineList, "Vlc");
var oggPluginPlayer = new mediaPlayer(
  "oggPlugin",
  ["video/ogg", "application/ogg"],
  "Generic"
);
var htmlPlayer = new mediaPlayer(
  "html",
  ["text/html", "image/jpeg", "image/png", "image/svg"],
  "Html"
);
function mediaPlayers() {
  this.init();
}
mediaPlayers.prototype = {
  players: null,
  preference: {},
  defaultPlayers: {},
  init: function () {
    this.players = new Array();
    this.loadPreferences();
    this.defaultPlayers["video/x-flv"] = ["Kplayer", "Vlc"];
    this.defaultPlayers["video/h264"] = ["Native", "Kplayer", "Vlc"];
    this.defaultPlayers["video/ogg"] = ["Native", "Vlc", "Java", "Generic"];
    this.defaultPlayers["video/webm"] = ["Native", "Vlc"];
    this.defaultPlayers["application/ogg"] = [
      "Native",
      "Vlc",
      "Java",
      "Generic",
    ];
    this.defaultPlayers["audio/ogg"] = ["Native", "Vlc", "Java"];
    this.defaultPlayers["video/mp4"] = ["Vlc"];
    this.defaultPlayers["video/mpeg"] = ["Vlc"];
    this.defaultPlayers["video/x-msvideo"] = ["Vlc"];
    this.defaultPlayers["text/html"] = ["Html"];
    this.defaultPlayers["image/jpeg"] = ["Html"];
    this.defaultPlayers["image/png"] = ["Html"];
    this.defaultPlayers["image/svg"] = ["Html"];
  },
  addPlayer: function (player) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id == player.id) {
        return;
      }
    }
    this.players.push(player);
  },
  isSupportedPlayer: function (playerId) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id == playerId) {
        return true;
      }
    }
    return false;
  },
  getMIMETypePlayers: function (mimeType) {
    var mimePlayers = new Array();
    var _this = this;
    if (this.defaultPlayers[mimeType]) {
      $j.each(this.defaultPlayers[mimeType], function (d, lib) {
        var library = _this.defaultPlayers[mimeType][d];
        for (var i = 0; i < _this.players.length; i++) {
          if (
            _this.players[i].library == library &&
            _this.players[i].supportsMIMEType(mimeType)
          ) {
            mimePlayers.push(_this.players[i]);
          }
        }
      });
    }
    return mimePlayers;
  },
  defaultPlayer: function (mimeType) {
    var mimePlayers = this.getMIMETypePlayers(mimeType);
    if (mimePlayers.length > 0) {
      for (var i = 0; i < mimePlayers.length; i++) {
        if (mimePlayers[i].id == this.preference[mimeType])
          return mimePlayers[i];
      }
      return mimePlayers[0];
    }
    return null;
  },
  setFormatPreference: function (mimeFormat) {
    this.preference["format_preference"] = mimeFormat;
    mw.setUserConfig("playerPref", this.preference);
  },
  setPlayerPreference: function (playerId, mimeType) {
    var selectedPlayer = null;
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id == playerId) {
        selectedPlayer = this.players[i];
        this.preference[mimeType] = playerId;
        mw.setUserConfig("playerPref", this.preference);
        break;
      }
    }
    if (selectedPlayer) {
      var playerList = mw.playerManager.getPlayerList();
      for (var i = 0; i < playerList.length; i++) {
        var embed = $j("#" + playerList[i]).get(0);
        if (
          embed.mediaElement.selectedSource &&
          embed.mediaElement.selectedSource.mimeType == mimeType
        ) {
          embed.selectPlayer(selectedPlayer);
        }
      }
    }
  },
  loadPreferences: function () {
    this.preference = {};
    preferenceConfig = mw.getUserConfig("playerPref");
    if (typeof preferenceConfig == "object") {
      this.preference = preferenceConfig;
    }
  },
};
mw.EmbedTypes = {
  mediaPlayers: null,
  detect_done: false,
  init: function () {
    this.detect();
    this.detect_done = true;
  },
  getMediaPlayers: function () {
    if (this.mediaPlayers) {
      return this.mediaPlayers;
    }
    this.mediaPlayers = new mediaPlayers();
    this.detectPlayers();
    return this.mediaPlayers;
  },
  supportedMimeType: function (mimeType) {
    for (var i = 0; i < navigator.plugins.length; i++) {
      var plugin = navigator.plugins[i];
      if (typeof plugin[mimeType] != "undefined") return true;
    }
    return false;
  },
  detectPlayers: function () {
    this.mediaPlayers.addPlayer(htmlPlayer);
    try {
      var javaEnabled = navigator.javaEnabled();
    } catch (e) {}
    var uniqueMimesOnly = $j.browser.opera || $j.browser.safari;
    if (javaEnabled && navigator.appName == "Opera") {
      this.mediaPlayers.addPlayer(cortadoPlayer);
    }
    if ($j.browser.msie) {
      if (this.testActiveX("ShockwaveFlash.ShockwaveFlash")) {
        this.mediaPlayers.addPlayer(kplayer);
      }
      if (this.testActiveX("VideoLAN.VLCPlugin.2")) {
        this.mediaPlayers.addPlayer(vlcPlayer);
      }
      if (this.testActiveX("JavaWebStart.isInstalled")) {
        this.mediaPlayers.addPlayer(cortadoPlayer);
      }
    }
    if (
      typeof HTMLVideoElement == "object" ||
      typeof HTMLVideoElement == "function"
    ) {
      try {
        var dummyvid = document.createElement("video");
        if (dummyvid.canPlayType) {
          if (dummyvid.canPlayType('video/webm; codecs="vp8, vorbis"')) {
            this.mediaPlayers.addPlayer(webmNativePlayer);
          }
          if (
            dummyvid.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
          ) {
            this.mediaPlayers.addPlayer(h264NativePlayer);
          }
          if (mw.isAndroid2()) {
            this.mediaPlayers.addPlayer(h264NativePlayer);
          }
          if (dummyvid.canPlayType('video/ogg; codecs="theora,vorbis"')) {
            this.mediaPlayers.addPlayer(oggNativePlayer);
          } else if (this.supportedMimeType("video/ogg")) {
            this.mediaPlayers.addPlayer(oggNativePlayer);
          }
        }
      } catch (e) {}
    }
    if (navigator.mimeTypes && navigator.mimeTypes.length > 0) {
      for (var i = 0; i < navigator.mimeTypes.length; i++) {
        var type = navigator.mimeTypes[i].type;
        var semicolonPos = type.indexOf(";");
        if (semicolonPos > -1) {
          type = type.substr(0, semicolonPos);
        }
        var pluginName = navigator.mimeTypes[i].enabledPlugin
          ? navigator.mimeTypes[i].enabledPlugin.name
          : "";
        if (!pluginName) {
          pluginName = "";
        }
        if (
          pluginName.toLowerCase() == "vlc multimedia plugin" ||
          pluginName.toLowerCase() == "vlc multimedia plug-in"
        ) {
          this.mediaPlayers.addPlayer(vlcPlayer);
          continue;
        }
        if (type == "application/x-java-applet") {
          this.mediaPlayers.addPlayer(cortadoPlayer);
          continue;
        }
        if (
          (type == "video/mpeg" || type == "video/x-msvideo") &&
          pluginName.toLowerCase() == "vlc multimedia plugin"
        ) {
          this.mediaPlayers.addPlayer(vlcMozillaPlayer);
        }
        if (type == "application/ogg") {
          if (pluginName.toLowerCase() == "vlc multimedia plugin") {
            this.mediaPlayers.addPlayer(vlcMozillaPlayer);
          } else {
            this.mediaPlayers.addPlayer(oggPluginPlayer);
          }
          continue;
        } else if (uniqueMimesOnly) {
          if (type == "application/x-vlc-player") {
            this.mediaPlayers.addPlayer(vlcMozillaPlayer);
            continue;
          } else if (type == "video/quicktime") {
            continue;
          }
        }
        if (type == "application/x-shockwave-flash") {
          this.mediaPlayers.addPlayer(kplayer);
          if (navigator.plugins["Shockwave Flash"]) {
            var flashDescription =
              navigator.plugins["Shockwave Flash"].description;
            var descArray = flashDescription.split(" ");
            var tempArrayMajor = descArray[2].split(".");
            var versionMajor = tempArrayMajor[0];
          }
          continue;
        }
      }
    }
    $j(mw).trigger("embedPlayerUpdateMediaPlayersEvent", this.mediaPlayers);
  },
  testActiveX: function (name) {
    var hasObj = true;
    try {
      var obj = new ActiveXObject("" + name);
    } catch (e) {
      hasObj = false;
    }
    return hasObj;
  },
};
(function (mw) {
  mw.PlayerControlBuilder = function (embedPlayer, options) {
    return this.init(embedPlayer, options);
  };
  mw.PlayerControlBuilder.prototype = {
    playerClass: "mv-player",
    longTimeDisp: true,
    volume_layout: "vertical",
    height: 31,
    supportedComponets: { options: true },
    supportedMenuItems: {
      playerSelect: true,
      download: true,
      share: true,
      aboutPlayerLibrary: true,
    },
    fullscreenMode: false,
    addWarningFlag: false,
    displayOptionsMenuFlag: false,
    init: function (embedPlayer) {
      var _this = this;
      this.embedPlayer = embedPlayer;
      var skinClass =
        embedPlayer.skinName.substr(0, 1).toUpperCase() +
        embedPlayer.skinName.substr(1);
      if (mw["PlayerSkin" + skinClass]) {
        var _this = $j.extend(true, {}, this, mw["PlayerSkin" + skinClass]);
        return _this;
      }
      return this;
    },
    getHeight: function () {
      return this.height;
    },
    addControls: function () {
      var embedPlayer = this.embedPlayer;
      var _this = this;
      embedPlayer.$interface.find(".control-bar,.overlay-win").remove();
      _this.displayOptionsMenuFlag = false;
      var $controlBar = $j("<div />")
        .addClass(
          "ui-state-default ui-widget-header ui-helper-clearfix control-bar"
        )
        .css("height", this.height);
      if (_this.checkOverlayControls()) {
        $controlBar.hide();
      }
      $controlBar.css({
        position: "absolute",
        bottom: "0px",
        left: "0px",
        right: "0px",
      });
      if (embedPlayer.isAudio() && embedPlayer.$interface.height() == 0) {
        embedPlayer.$interface.css({ height: this.height });
      }
      embedPlayer.$interface.append($controlBar);
      this.addControlComponents();
      this.addControlBindings();
    },
    addControlComponents: function () {
      var _this = this;
      var embedPlayer = this.embedPlayer;
      var $controlBar = embedPlayer.$interface.find(".control-bar");
      this.available_width = embedPlayer.getPlayerWidth();
      this.supportedComponets = $j.extend(
        this.supportedComponets,
        embedPlayer.supports
      );
      $j(embedPlayer).trigger("addControlBarComponent", this);
      if (
        mw.getConfig("EmbedPlayer.AttributionButton") &&
        embedPlayer.attributionbutton
      ) {
        this.supportedComponets["attributionButton"] = true;
      }
      if (mw.getConfig("EmbedPlayer.EnableFullscreen") === false) {
        this.supportedComponets["fullscreen"] = false;
      }
      if (mw.getConfig("EmbedPlayer.EnableOptionsMenu") === false) {
        this.supportedComponets["options"] = false;
      }
      var addComponent = function (component_id) {
        if (_this.supportedComponets[component_id]) {
          if (_this.available_width > _this.components[component_id].w) {
            $controlBar.append(_this.getComponent(component_id));
            _this.available_width -= _this.components[component_id].w;
          } else {
          }
        }
      };
      for (var component_id in this.components) {
        if (this.components[component_id] === false) {
          continue;
        }
        if (component_id == "playHead" || component_id == "timeDisplay") {
          continue;
        }
        if (component_id == "fullscreen" && this.embedPlayer.height == 0) {
          continue;
        }
        addComponent(component_id);
      }
      addComponent("timeDisplay");
      if (this.available_width > 30) {
        addComponent("playHead");
      }
    },
    getAspectPlayerWindowCss: function (windowSize) {
      var embedPlayer = this.embedPlayer;
      var _this = this;
      if (!windowSize) {
        var windowSize = {
          width: $j(window).width(),
          height: $j(window).height(),
        };
      }
      var targetWidth = windowSize.width;
      var targetHeight =
        targetWidth * (embedPlayer.getHeight() / embedPlayer.getWidth());
      if (targetHeight > windowSize.height) {
        targetHeight = windowSize.height;
        targetWidth =
          targetHeight * (embedPlayer.getWidth() / embedPlayer.getHeight());
      }
      var offsetTop =
        targetHeight < windowSize.height
          ? (windowSize.height - targetHeight) / 2
          : 0;
      var offsetLeft =
        targetWidth < windowSize.width
          ? (windowSize.width - targetWidth) / 2
          : 0;
      if (!_this.checkOverlayControls()) {
        targetHeight = targetHeight - this.height;
        offsetTop = offsetTop - this.height;
        if (offsetTop < 0) offsetTop = 0;
      }
      return {
        position: "absolute",
        height: targetHeight,
        width: targetWidth,
        top: offsetTop,
        left: offsetLeft,
      };
    },
    getFullscreenPlayButtonCss: function (size) {
      var _this = this;
      var pos = this.getAspectPlayerWindowCss(size);
      if (!_this.checkOverlayControls()) {
        pos.top = pos.top - this.height;
      }
      return {
        left: (pos.width - this.getComponentWidth("playButtonLarge")) / 2,
        top: (pos.height - this.getComponentHeight("playButtonLarge")) / 2,
      };
    },
    toggleFullscreen: function (forceClose) {
      var _this = this;
      if (mw.getConfig("EmbedPlayer.IsIframePlayer")) {
        if (this.fullscreenMode) {
          $j(_this.embedPlayer).trigger("onCloseFullScreen");
          this.fullscreenMode = false;
        } else {
          $j(_this.embedPlayer).trigger("onOpenFullScreen");
          this.fullscreenMode = true;
        }
        return;
      }
      if (this.fullscreenMode) {
        this.restoreWindowPlayer();
      } else {
        this.doFullScreenPlayer();
      }
    },
    doFullScreenPlayer: function (callback) {
      var _this = this;
      var embedPlayer = this.embedPlayer;
      var $interface = embedPlayer.$interface;
      if (this.fullscreenMode == true) {
        return;
      }
      this.fullscreenMode = true;
      $j(".mw-fullscreen-overlay").remove();
      if ($j("#p-search,#p-logo").length) {
        $j("#p-search,#p-logo,#ca-nstab-project a").css("z-index", 1);
      }
      $interface.after(
        $j("<div />")
          .addClass("mw-fullscreen-overlay")
          .css("z-index", mw.getConfig("EmbedPlayer.fullScreenZIndex"))
          .hide()
          .fadeIn("slow")
      );
      this.windowPositionStyle = $interface.css("position");
      this.windowZindex = $interface.css("z-index");
      this.windowOffset = $interface.offset();
      this.windowOffset.top = this.windowOffset.top - $j(document).scrollTop();
      this.windowOffset.left =
        this.windowOffset.left - $j(document).scrollLeft();
      $interface.css({
        position: "fixed",
        "z-index": mw.getConfig("EmbedPlayer.fullScreenZIndex") + 1,
        top: this.windowOffset.top,
        left: this.windowOffset.left,
      });
      if (embedPlayer.isPersistentNativePlayer()) {
        $j(embedPlayer.getPlayerElement()).css({
          "z-index": mw.getConfig("EmbedPlayer.fullScreenZIndex") + 1,
          position: "absolute",
        });
      }
      _this.parentsAbsolute = [];
      $j("body").css("overflow", "hidden");
      var topOffset = "0px";
      var leftOffset = "0px";
      if ($interface.offsetParent().get(0).tagName.toLowerCase() != "body") {
        topOffset = -this.windowOffset.top + "px";
        leftOffset = -this.windowOffset.left + "px";
      }
      $j(embedPlayer).css({ position: "relative" });
      $interface.css("overlow", "hidden");
      embedPlayer.resizePlayer(
        {
          top: topOffset,
          left: leftOffset,
          width: $j(window).width(),
          height: $j(window).height(),
        },
        true,
        function () {
          $j(_this.embedPlayer).trigger("onOpenFullScreen");
        }
      );
      $interface.parents().each(function () {
        if ($j(this).css("position") == "absolute") {
          _this.parentsAbsolute.push($j(this));
          $j(this).css("position", null);
        }
      });
      _this.mouseMovedFlag = false;
      $interface.mousemove(function (e) {
        _this.mouseMovedFlag = true;
      });
      if (_this.checkOverlayControls()) {
        function checkMovedMouse() {
          if (_this.fullscreenMode) {
            if (_this.mouseMovedFlag) {
              _this.mouseMovedFlag = false;
              _this.showControlBar();
              setTimeout(checkMovedMouse, 4000);
            } else {
              _this.hideControlBar();
              setTimeout(checkMovedMouse, 250);
            }
          }
        }
        checkMovedMouse();
      }
      $j(window).resize(function () {
        if (_this.fullscreenMode) {
          embedPlayer.resizePlayer({
            width: $j(window).width(),
            height: $j(window).height(),
          });
        }
      });
      $j(window).keyup(function (event) {
        if (event.keyCode == 27) {
          _this.restoreWindowPlayer();
        }
      });
    },
    resizePlayer: function (size, animate, callback) {
      var _this = this;
      var interfaceCss = {
        top: size.top ? size.top : "0px",
        left: size.left ? size.left : "0px",
        width: size.width,
        height: size.height,
      };
      var embedPlayer = this.embedPlayer;
      var $interface = embedPlayer.$interface;
      if (animate) {
        $interface.animate(interfaceCss);
        $j(embedPlayer).animate(_this.getAspectPlayerWindowCss(size), callback);
        $interface
          .find(".play-btn-large")
          .animate(_this.getFullscreenPlayButtonCss(size));
        if (embedPlayer.isPersistentNativePlayer()) {
          $j(embedPlayer.getPlayerElement()).animate(
            _this.getAspectPlayerWindowCss(size)
          );
        }
      } else {
        $interface.css(interfaceCss);
        $j(embedPlayer).css(_this.getAspectPlayerWindowCss(size));
        $interface
          .find(".play-btn-large")
          .css(_this.getFullscreenPlayButtonCss(size));
        if (embedPlayer.isPersistentNativePlayer()) {
          $j(embedPlayer.getPlayerElement()).css(
            _this.getAspectPlayerWindowCss(size)
          );
        }
        if (callback) {
          callback();
        }
      }
    },
    restoreWindowPlayer: function () {
      var _this = this;
      var embedPlayer = this.embedPlayer;
      if (this.fullscreenMode == false) {
        return;
      }
      this.fullscreenMode = false;
      var $interface = embedPlayer.$interface;
      var interfaceHeight = _this.checkOverlayControls()
        ? embedPlayer.getHeight()
        : embedPlayer.getHeight() + _this.getHeight();
      $j(".mw-fullscreen-overlay").fadeOut("slow");
      embedPlayer.resizePlayer(
        {
          top: _this.windowOffset.top + "px",
          left: _this.windowOffset.left + "px",
          width: embedPlayer.getWidth(),
          height: embedPlayer.getHeight(),
        },
        true,
        function () {
          $interface.css({
            position: _this.windowPositionStyle,
            "z-index": _this.windowZindex,
            overlow: "visible",
            top: "0px",
            left: "0px",
          });
          $j.each(_this.parentsAbsolute, function (na, element) {
            $j(element).css("position", "absolute");
          });
          _this.parentsAbsolute = null;
          $j("body").css("overflow", "auto");
          if (embedPlayer.isPersistentNativePlayer()) {
            $j(embedPlayer.getPlayerElement()).css({ "z-index": "auto" });
          }
        }
      );
      $interface
        .find(".play-btn-large")
        .animate({
          left:
            (embedPlayer.getWidth() -
              this.getComponentWidth("playButtonLarge")) /
            2,
          top:
            (embedPlayer.getHeight() -
              this.getComponentHeight("playButtonLarge")) /
            2,
        });
      $j(this.embedPlayer).trigger("onCloseFullScreen");
    },
    getOverlayWidth: function () {
      return this.embedPlayer.getPlayerWidth() < 300
        ? 300
        : this.embedPlayer.getPlayerWidth();
    },
    getOverlayHeight: function () {
      return this.embedPlayer.getPlayerHeight() < 200
        ? 200
        : this.embedPlayer.getPlayerHeight();
    },
    addControlBindings: function () {
      var embedPlayer = this.embedPlayer;
      var _this = this;
      var $interface = embedPlayer.$interface;
      $interface.unbind();
      var bindFirstPlay = false;
      $j(embedPlayer)
        .unbind("play.ctrl")
        .bind("play.ctrl", function () {
          if (bindFirstPlay) {
            return;
          }
          bindFirstPlay = true;
          var dblClickTime = 300;
          var lastClickTime = 0;
          var didDblClick = false;
          $j(embedPlayer)
            .unbind("dblclick")
            .click(function () {
              if (embedPlayer.getPlayerElement().controls) {
                return;
              }
              var clickTime = new Date().getTime();
              if (clickTime - lastClickTime < dblClickTime) {
                embedPlayer.fullscreen();
                didDblClick = true;
                setTimeout(function () {
                  didDblClick = false;
                }, dblClickTime + 10);
              }
              lastClickTime = clickTime;
              setTimeout(function () {
                if (!didDblClick) {
                  if (embedPlayer.paused) {
                    embedPlayer.play();
                  } else {
                    embedPlayer.pause();
                  }
                }
              }, dblClickTime);
            });
        });
      var bindSpaceUp = function () {
        $j(window).bind("keyup.mwPlayer", function (e) {
          if (e.keyCode == 32) {
            if (embedPlayer.paused) {
              embedPlayer.play();
            } else {
              embedPlayer.pause();
            }
            return false;
          }
        });
      };
      var bindSpaceDown = function () {
        $j(window).unbind("keyup.mwPlayer");
      };
      if (!_this.checkOverlayControls()) {
        $interface.show().hover(bindSpaceUp, bindSpaceDown);
      } else {
        $j(embedPlayer)
          .unbind("click.showCtrlBar")
          .bind("click.showCtrlBar", function () {
            _this.showControlBar();
          });
        $interface.bind("touchstart", function () {
          _this.showControlBar();
        });
        $interface.hoverIntent({
          sensitivity: 100,
          timeout: 1000,
          over: function () {
            _this.showControlBar();
            bindSpaceUp();
          },
          out: function () {
            _this.hideControlBar();
            bindSpaceDown();
          },
        });
      }
      if (_this.checkNativeWarning()) {
        _this.doWarningBindinng(
          "EmbedPlayer.ShowNativeWarning",
          gM("mwe-embedplayer-for_best_experience")
        );
      }
      if ($j.browser.msie && $j.browser.version <= 6) {
        $j("#" + embedPlayer.id + " .play-btn-large").pngFix();
      }
      this.doVolumeBinding();
      if (
        this.addSkinControlBindings &&
        typeof this.addSkinControlBindings == "function"
      ) {
        this.addSkinControlBindings();
      }
      $j(embedPlayer).trigger("addControlBindingsEvent");
    },
    hideControlBar: function () {
      var animateDuration = "fast";
      var _this = this;
      if (
        _this.displayOptionsMenuFlag ||
        $j("#timedTextMenu_" + this.embedPlayer.id).is(":visible")
      ) {
        setTimeout(function () {
          _this.hideControlBar();
        }, 200);
        return;
      }
      this.embedPlayer.$interface.find(".control-bar").fadeOut(animateDuration);
      $j(this.embedPlayer).trigger("onHideControlBar", { bottom: 15 });
    },
    showControlBar: function () {
      var animateDuration = "fast";
      if (!this.embedPlayer) return;
      if (
        this.embedPlayer.getPlayerElement &&
        !this.embedPlayer.isPersistentNativePlayer()
      ) {
        $j(this.embedPlayer.getPlayerElement()).css("z-index", "1");
      }
      this.embedPlayer.$interface.find(".control-bar").fadeIn(animateDuration);
      $j(this.embedPlayer).trigger("onShowControlBar", {
        bottom: this.getHeight() + 15,
      });
    },
    checkOverlayControls: function () {
      if (!this.embedPlayer.supports["overlays"]) {
        return false;
      }
      if (this.embedPlayer.overlaycontrols === false) {
        return false;
      }
      if (mw.getConfig("EmbedPlayer.OverlayControls") === false) {
        return false;
      }
      if (mw.isIpad()) {
        return false;
      }
      if (
        this.embedPlayer.getPlayerHeight() === 0 &&
        $j(this.embedPlayer).css("height").indexOf("%") === -1
      ) {
        return false;
      }
      if (this.embedPlayer.controls === false) {
        return false;
      }
      return true;
    },
    checkNativeWarning: function () {
      if (mw.getConfig("EmbedPlayer.ShowNativeWarning") === false) {
        return false;
      }
      if (this.embedPlayer.getPlayerHeight() < 199) {
        return false;
      }
      var supportingPlayers =
        mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers("video/ogg");
      for (var i = 0; i < supportingPlayers.length; i++) {
        if (
          supportingPlayers[i].id == "oggNative" &&
          !/chrome/.test(navigator.userAgent.toLowerCase())
        ) {
          return false;
        }
      }
      if (
        /chrome/.test(navigator.userAgent.toLowerCase()) &&
        mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers("video/webm").length
      ) {
        return false;
      }
      if (
        (mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers("video/h264")
          .length &&
          this.embedPlayer.mediaElement.getSources("video/h264").length) ||
        (mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers("video/x-flv")
          .length &&
          this.embedPlayer.mediaElement.getSources("video/x-flv").length)
      ) {
        return false;
      }
      return true;
    },
    doWarningBindinng: function (preferenceId, warningMsg) {
      var embedPlayer = this.embedPlayer;
      var _this = this;
      $j(embedPlayer).hoverIntent({
        timeout: 2000,
        over: function () {
          if (embedPlayer.isPlaying()) {
            return;
          }
          if ($j("#warningOverlay_" + embedPlayer.id).length == 0) {
            $j(this).append(
              $j("<div />")
                .attr({ id: "warningOverlay_" + embedPlayer.id })
                .addClass("ui-state-highlight ui-corner-all")
                .css({
                  position: "absolute",
                  display: "none",
                  background: "#FFF",
                  color: "#111",
                  top: "10px",
                  left: "10px",
                  right: "10px",
                  padding: "4px",
                })
                .html(warningMsg)
            );
            $targetWarning = $j("#warningOverlay_" + embedPlayer.id);
            $targetWarning.append($j("<br />"));
            $targetWarning.append(
              $j("<input />")
                .attr({
                  id: "ffwarn_" + embedPlayer.id,
                  type: "checkbox",
                  name: "ffwarn_" + embedPlayer.id,
                })
                .click(function () {
                  $j.cookie(preferenceId, "hidewarning", { expires: 30 });
                  mw.setConfig(preferenceId, false);
                  $j("#warningOverlay_" + embedPlayer.id).fadeOut("slow");
                  _this.addWarningFlag = false;
                })
            );
            $targetWarning.append(
              $j("<label />")
                .text(gM("mwe-embedplayer-do_not_warn_again"))
                .attr("for", "ffwarn_" + embedPlayer.id)
            );
          }
          if (
            mw.getConfig(preferenceId) === true &&
            $j.cookie(preferenceId) != "hidewarning"
          ) {
            $j("#warningOverlay_" + embedPlayer.id).fadeIn("slow");
          }
        },
        out: function () {
          $j("#warningOverlay_" + embedPlayer.id).fadeOut("slow");
        },
      });
    },
    doVolumeBinding: function () {
      var embedPlayer = this.embedPlayer;
      var _this = this;
      embedPlayer.$interface
        .find(".volume_control")
        .unbind()
        .buttonHover()
        .click(function () {
          embedPlayer.toggleMute();
        });
      if (this.volume_layout == "vertical") {
        var hoverOverDelay = false;
        var $targetvol = embedPlayer.$interface.find(".vol_container").hide();
        embedPlayer.$interface.find(".volume_control").hover(
          function () {
            $targetvol.addClass("vol_container_top");
            if (
              embedPlayer &&
              embedPlayer.isPlaying &&
              embedPlayer.isPlaying() &&
              !embedPlayer.supports["overlays"]
            ) {
              $targetvol
                .removeClass("vol_container_top")
                .addClass("vol_container_below");
            }
            $targetvol.fadeIn("fast");
            hoverOverDelay = true;
          },
          function () {
            hoverOverDelay = false;
            setTimeout(function () {
              if (!hoverOverDelay) {
                $targetvol.fadeOut("fast");
              }
            }, 500);
          }
        );
      }
      var sliderConf = {
        range: "min",
        value: 80,
        min: 0,
        max: 100,
        slide: function (event, ui) {
          var percent = ui.value / 100;
          embedPlayer.setVolume(percent);
        },
        change: function (event, ui) {
          var percent = ui.value / 100;
          if (percent == 0) {
            embedPlayer.$interface
              .find(".volume_control span")
              .removeClass("ui-icon-volume-on")
              .addClass("ui-icon-volume-off");
          } else {
            embedPlayer.$interface
              .find(".volume_control span")
              .removeClass("ui-icon-volume-off")
              .addClass("ui-icon-volume-on");
          }
          embedPlayer.setVolume(percent);
        },
      };
      if (this.volume_layout == "vertical") {
        sliderConf["orientation"] = "vertical";
      }
      embedPlayer.$interface.find(".volume-slider").slider(sliderConf);
    },
    getOptionsMenu: function () {
      $optionsMenu = $j("<ul />");
      for (var i in this.optionMenuItems) {
        if (!this.supportedMenuItems[i]) {
          continue;
        }
        $optionsMenu.append(this.optionMenuItems[i](this));
      }
      return $optionsMenu;
    },
    onClipDone: function () {},
    onSeek: function () {
      this.setStatus(gM("mwe-embedplayer-seeking"));
    },
    setStatus: function (value) {
      this.embedPlayer.$interface.find(".time-disp").text(value);
    },
    optionMenuItems: {
      playerSelect: function (ctrlObj) {
        return $j.getLineItem(
          gM("mwe-embedplayer-choose_player"),
          "gear",
          function () {
            ctrlObj.displayMenuOverlay(ctrlObj.getPlayerSelect());
          }
        );
      },
      download: function (ctrlObj) {
        return $j.getLineItem(
          gM("mwe-embedplayer-download"),
          "disk",
          function () {
            ctrlObj.displayMenuOverlay(gM("mwe-loading_txt"));
            ctrlObj.showDownload(
              ctrlObj.embedPlayer.$interface.find(".overlay-content")
            );
            $j(ctrlObj.embedPlayer).trigger("showDownloadEvent");
          }
        );
      },
      share: function (ctrlObj) {
        return $j.getLineItem(
          gM("mwe-embedplayer-share"),
          "mail-closed",
          function () {
            ctrlObj.displayMenuOverlay(ctrlObj.getShare());
            $j(ctrlObj.embedPlayer).trigger("showShareEvent");
          }
        );
      },
      aboutPlayerLibrary: function (ctrlObj) {
        return $j.getLineItem(
          gM("mwe-embedplayer-about-library"),
          "info",
          function () {
            ctrlObj.displayMenuOverlay(ctrlObj.aboutPlayerLibrary());
            $j(ctrlObj.embedPlayer).trigger("aboutPlayerLibrary");
          }
        );
      },
    },
    closeMenuOverlay: function () {
      var _this = this;
      var embedPlayer = this.embedPlayer;
      var $overlay = embedPlayer.$interface.find(
        ".overlay-win,.ui-widget-overlay,.ui-widget-shadow"
      );
      this.displayOptionsMenuFlag = false;
      $overlay.fadeOut("slow", function () {
        $overlay.remove();
      });
      embedPlayer.$interface.find(".play-btn-large").fadeIn("slow");
      $j(embedPlayer).trigger("closeMenuOverlay");
      return false;
    },
    displayMenuOverlay: function (overlayContent) {
      var _this = this;
      var embedPlayer = this.embedPlayer;
      this.displayOptionsMenuFlag = true;
      if (!this.supportedComponets["overlays"]) {
        embedPlayer.stop();
      }
      embedPlayer.$interface.find(".play-btn-large").hide();
      if (embedPlayer.$interface.find(".overlay-win").length != 0) {
        embedPlayer.$interface.find(".overlay-content").html(overlayContent);
        return;
      }
      embedPlayer.$interface.append(
        $j("<div />")
          .addClass("ui-widget-overlay")
          .css({ height: "100%", width: "100%", "z-index": 2 })
      );
      $closeButton = $j("<span />")
        .addClass("ui-icon ui-icon-closethick")
        .css({
          position: "absolute",
          cursor: "pointer",
          top: "2px",
          right: "2px",
        })
        .click(function () {
          _this.closeMenuOverlay();
        });
      var overlayMenuCss = {
        height: 200,
        width: 250,
        position: "absolute",
        left: "10px",
        top: "15px",
        overflow: "auto",
        padding: "4px",
        "z-index": 3,
      };
      $overlayMenu = $j("<div />")
        .addClass("overlay-win ui-state-default ui-widget-header ui-corner-all")
        .css(overlayMenuCss)
        .append(
          $closeButton,
          $j("<div />").addClass("overlay-content").append(overlayContent)
        );
      var shadowCss = jQuery.extend(true, {}, overlayMenuCss);
      shadowCss["height"] = 210;
      shadowCss["width"] = 260;
      shadowCss["z-index"] = 2;
      $overlayShadow = $j("<div />")
        .addClass("ui-widget-shadow ui-corner-all")
        .css(shadowCss);
      embedPlayer.$interface
        .prepend($overlayMenu, $overlayShadow)
        .find(".overlay-win")
        .fadeIn("slow");
      $j(embedPlayer).trigger("displayMenuOverlay");
      return false;
    },
    aboutPlayerLibrary: function () {
      return $j("<div />").append(
        $j("<h3 />").text(gM("mwe-embedplayer-about-library")),
        $j("<span />").append(
          gM(
            "mwe-embedplayer-about-library-desc",
            $j("<a />").attr({
              href: mw.getConfig("EmbedPlayer.LibraryPage"),
              target: "_new",
            })
          )
        )
      );
    },
    getShare: function () {
      var embedPlayer = this.embedPlayer;
      var embed_code = embedPlayer.getEmbeddingHTML();
      var _this = this;
      var $shareInterface = $j("<div />");
      $shareList = $j("<ul />");
      $shareList.append(
        $j("<li />").append(
          $j("<a />")
            .attr("href", "#")
            .addClass("active")
            .text(gM("mwe-embedplayer-embed_site_or_blog"))
        )
      );
      $shareInterface.append(
        $j("<h2 />")
          .text(gM("mwe-embedplayer-share_this_video"))
          .append($shareList)
      );
      $shareInterface.append(
        $j("<textarea />")
          .attr("rows", 4)
          .html(embed_code)
          .click(function () {
            $j(this).select();
          }),
        $j("<br />"),
        $j("<br />"),
        $j("<button />")
          .addClass("ui-state-default ui-corner-all copycode")
          .text(gM("mwe-embedplayer-copy-code"))
          .click(function () {
            $shareInterface.find("textarea").focus().select();
            if (document.selection) {
              CopiedTxt = document.selection.createRange();
              CopiedTxt.execCommand("Copy");
            }
          })
      );
      return $shareInterface;
    },
    getPlayerSelect: function () {
      var embedPlayer = this.embedPlayer;
      var _this = this;
      $playerSelect = $j("<div />").append(
        $j("<h2 />").text(gM("mwe-embedplayer-choose_player"))
      );
      $j.each(
        embedPlayer.mediaElement.getPlayableSources(),
        function (sourceId, source) {
          var isPlayable =
            typeof mw.EmbedTypes.getMediaPlayers().defaultPlayer(
              source.getMIMEType()
            ) == "object";
          var is_selected =
            source.getSrc() == embedPlayer.mediaElement.selectedSource.getSrc();
          $playerSelect.append($j("<h3 />").text(source.getTitle()));
          if (isPlayable) {
            $playerList = $j("<ul />");
            var supportingPlayers =
              mw.EmbedTypes.getMediaPlayers().getMIMETypePlayers(
                source.getMIMEType()
              );
            for (var i = 0; i < supportingPlayers.length; i++) {
              if (
                embedPlayer.selectedPlayer.id == supportingPlayers[i].id &&
                is_selected
              ) {
                $playerLine = $j("<span />").append(
                  $j("<a />")
                    .attr({ href: "#" })
                    .addClass("active")
                    .text(supportingPlayers[i].getName())
                );
              } else {
                $playerLine = $j("<a />")
                  .attr({
                    href: "#",
                    rel: "sel_source",
                    id: "sc_" + sourceId + "_" + supportingPlayers[i].id,
                  })
                  .addClass("ui-corner-all")
                  .text(supportingPlayers[i].getName())
                  .click(function () {
                    var iparts = $j(this)
                      .attr("id")
                      .replace(/sc_/, "")
                      .split("_");
                    var sourceId = iparts[0];
                    var player_id = iparts[1];
                    embedPlayer.controlBuilder.closeMenuOverlay();
                    if (_this.fullscreenMode) {
                      _this.restoreWindowPlayer();
                    }
                    embedPlayer.mediaElement.selectSource(sourceId);
                    var playableSources =
                      embedPlayer.mediaElement.getPlayableSources();
                    mw.EmbedTypes.getMediaPlayers().setPlayerPreference(
                      player_id,
                      playableSources[sourceId].getMIMEType()
                    );
                    embedPlayer.stop();
                    return false;
                  })
                  .hover(
                    function () {
                      $j(this).addClass("active");
                    },
                    function () {
                      $j(this).removeClass("active");
                    }
                  );
              }
              $playerList.append($j("<li />").append($playerLine));
            }
            $playerSelect.append($playerList);
          } else {
            $playerSelect.append(
              gM("mwe-embedplayer-no-player", source.getTitle())
            );
          }
        }
      );
      return $playerSelect;
    },
    showDownload: function ($target) {
      var _this = this;
      var embedPlayer = this.embedPlayer;
      if (embedPlayer.apiTitleKey) {
        mw.load("TimedText", function () {
          embedPlayer.timedText.setupTextSources(function () {
            _this.showDownloadWithSources($target);
          });
        });
      } else {
        _this.showDownloadWithSources($target);
      }
    },
    showDownloadWithSources: function ($target) {
      var _this = this;
      var embedPlayer = this.embedPlayer;
      $target.empty();
      var $mediaList = $j("<ul />");
      var $textList = $j("<ul />");
      $j.each(embedPlayer.mediaElement.getSources(), function (index, source) {
        if (source.getSrc()) {
          var $dl_line = $j("<li />").append(
            $j("<a />").attr("href", source.getSrc()).text(source.getTitle())
          );
          if (source.getSrc().indexOf("?t=") !== -1) {
            $target.append($dl_line);
          } else if (this.getMIMEType().indexOf("text") === 0) {
            $textList.append($dl_line);
          } else {
            $mediaList.append($dl_line);
          }
        }
      });
      if ($mediaList.find("li").length != 0) {
        $target.append(
          $j("<h2 />").text(gM("mwe-embedplayer-download_full")),
          $mediaList
        );
      }
      if ($textList.find("li").length != 0) {
        $target.append(
          $j("<h2 />").html(gM("mwe-embedplayer-download_text")),
          $textList
        );
      }
    },
    getComponent: function (component_id) {
      if (this.components[component_id]) {
        return this.components[component_id].o(this);
      } else {
        return false;
      }
    },
    getComponentHeight: function (component_id) {
      if (this.components[component_id] && this.components[component_id].h) {
        return this.components[component_id].h;
      }
      return 0;
    },
    getComponentWidth: function (component_id) {
      if (this.components[component_id] && this.components[component_id].w) {
        return this.components[component_id].w;
      }
      return 0;
    },
    components: {
      playButtonLarge: {
        w: 70,
        h: 53,
        o: function (ctrlObj) {
          return $j("<div/>")
            .attr({
              title: gM("mwe-embedplayer-play_clip"),
              class: "play-btn-large",
            })
            .css({
              left: (ctrlObj.embedPlayer.getPlayerWidth() - this.w) / 2,
              top: (ctrlObj.embedPlayer.getPlayerHeight() - this.h) / 2,
            })
            .click(function () {
              ctrlObj.embedPlayer.play();
              return false;
            });
        },
      },
      attributionButton: {
        w: 28,
        o: function (ctrlObj) {
          var buttonConfig = mw.getConfig("EmbedPlayer.AttributionButton");
          if (buttonConfig.iconurl) {
            var $icon = $j("<img />")
              .css({
                width: "16px",
                height: "16px",
                margin: "-8px 5px 0px 0px",
              })
              .attr("src", buttonConfig.iconurl);
          } else {
            var $icon = $j("<span />").addClass("ui-icon");
            if (buttonConfig["class"]) {
              $icon.addClass(buttonConfig["class"]);
            }
          }
          return $j("<a />")
            .attr({
              href: buttonConfig.href,
              title: buttonConfig.title,
              target: "_new",
            })
            .addClass("attributionButton")
            .append(
              $j("<div />")
                .addClass("rButton")
                .css({ top: "9px", left: "2px" })
                .append($icon)
            );
        },
      },
      options: {
        w: 28,
        o: function (ctrlObj) {
          return $j("<div />")
            .attr("title", gM("mwe-embedplayer-player_options"))
            .addClass(
              "ui-state-default ui-corner-all ui-icon_link rButton options-btn"
            )
            .append($j("<span />").addClass("ui-icon ui-icon-wrench"))
            .buttonHover()
            .menu({
              content: ctrlObj.getOptionsMenu(),
              zindex: mw.getConfig("EmbedPlayer.fullScreenZIndex") + 1,
              positionOpts: {
                directionV: "up",
                offsetY: 30,
                directionH: "left",
                offsetX: -28,
              },
            });
        },
      },
      fullscreen: {
        w: 28,
        o: function (ctrlObj) {
          $j(ctrlObj.embedPlayer)
            .unbind("dblclick")
            .bind("dblclick", function () {
              ctrlObj.embedPlayer.fullscreen();
            });
          return $j("<div />")
            .attr("title", gM("mwe-embedplayer-player_fullscreen"))
            .addClass(
              "ui-state-default ui-corner-all ui-icon_link rButton fullscreen-btn"
            )
            .append($j("<span />").addClass("ui-icon ui-icon-arrow-4-diag"))
            .buttonHover()
            .click(function () {
              ctrlObj.embedPlayer.fullscreen();
            });
        },
      },
      pause: {
        w: 28,
        o: function (ctrlObj) {
          return $j("<div />")
            .attr("title", gM("mwe-embedplayer-play_clip"))
            .addClass(
              "ui-state-default ui-corner-all ui-icon_link lButton play-btn"
            )
            .append($j("<span />").addClass("ui-icon ui-icon-play"))
            .buttonHover()
            .click(function () {
              ctrlObj.embedPlayer.play();
            });
        },
      },
      volumeControl: {
        w: 28,
        o: function (ctrlObj) {
          $volumeOut = $j("<span />");
          if (ctrlObj.volume_layout == "horizontal") {
            $volumeOut.append(
              $j("<div />").addClass(
                "ui-slider ui-slider-horizontal rButton volume-slider"
              )
            );
          }
          $volumeOut.append(
            $j("<div />")
              .attr("title", gM("mwe-embedplayer-volume_control"))
              .addClass(
                "ui-state-default ui-corner-all ui-icon_link rButton volume_control"
              )
              .append($j("<span />").addClass("ui-icon ui-icon-volume-on"))
          );
          if (ctrlObj.volume_layout == "vertical") {
            $volumeOut
              .find(".volume_control")
              .append(
                $j("<div />")
                  .css({ position: "absolute", left: "0px" })
                  .hide()
                  .addClass("vol_container ui-corner-all")
                  .append($j("<div />").addClass("volume-slider"))
              );
          }
          return $volumeOut.html();
        },
      },
      timeDisplay: {
        w: 100,
        o: function (ctrlObj) {
          return $j("<div />")
            .addClass("ui-widget time-disp")
            .append(ctrlObj.embedPlayer.getTimeRange());
        },
      },
      playHead: {
        w: 0,
        o: function (ctrlObj) {
          var sliderConfig = {
            range: "min",
            value: 0,
            min: 0,
            max: 1000,
            start: function (event, ui) {
              var id =
                embedPlayer.pc != null ? embedPlayer.pc.pp.id : embedPlayer.id;
              embedPlayer.userSlide = true;
              $j(id + " .play-btn-large").fadeOut("fast");
              embedPlayer.start_time_sec =
                embedPlayer.instanceOf == "mvPlayList"
                  ? 0
                  : mw.npt2seconds(embedPlayer.getTimeRange().split("/")[0]);
            },
            slide: function (event, ui) {
              var perc = ui.value / 1000;
              embedPlayer.jump_time = mw.seconds2npt(
                parseFloat(parseFloat(embedPlayer.getDuration()) * perc) +
                  embedPlayer.start_time_sec
              );
              if (_this.longTimeDisp) {
                ctrlObj.setStatus(
                  gM("mwe-embedplayer-seek_to", embedPlayer.jump_time)
                );
              } else {
                ctrlObj.setStatus(embedPlayer.jump_time);
              }
              if (embedPlayer.isPlaying == false) {
                embedPlayer.updateThumbPerc(perc);
              }
            },
            change: function (event, ui) {
              if (embedPlayer.userSlide) {
                embedPlayer.userSlide = false;
                embedPlayer.seeking = true;
                var perc = ui.value / 1000;
                embedPlayer.seek_time_sec = mw.npt2seconds(
                  embedPlayer.jump_time,
                  true
                );
                ctrlObj.setStatus(gM("mwe-embedplayer-seeking"));
                embedPlayer.doSeek(perc);
              }
            },
          };
          ctrlObj.disableSeekBar = function () {
            ctrlObj.embedPlayer.$interface
              .find(".play_head")
              .slider("option", "disabled", true);
          };
          ctrlObj.enableSeekBar = function () {
            ctrlObj.embedPlayer.$interface
              .find(".play_head")
              .slider("option", "disabled", false);
          };
          var embedPlayer = ctrlObj.embedPlayer;
          var _this = this;
          var $playHead = $j("<div />")
            .addClass("play_head")
            .css({
              position: "absolute",
              left: "33px",
              right:
                embedPlayer.getPlayerWidth() -
                ctrlObj.available_width -
                33 +
                "px",
            })
            .slider(sliderConfig);
          $playHead.find(".ui-slider-handle").css("z-index", 4);
          $playHead
            .find(".ui-slider-range")
            .addClass("ui-corner-all")
            .css("z-index", 2);
          $playHead.append(
            $j("<div />")
              .addClass("ui-slider-range ui-slider-range-min ui-widget-header")
              .addClass("ui-state-highlight ui-corner-all mw_buffer")
          );
          return $playHead;
        },
      },
    },
  };
})(window.mw);
(function ($) {
  $.fn.hoverIntent = function (f, g) {
    var cfg = { sensitivity: 7, interval: 100, timeout: 0 };
    cfg = $.extend(cfg, g ? { over: f, out: g } : f);
    var cX, cY, pX, pY;
    var track = function (ev) {
      cX = ev.pageX;
      cY = ev.pageY;
    };
    var compare = function (ev, ob) {
      ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
      if (Math.abs(pX - cX) + Math.abs(pY - cY) < cfg.sensitivity) {
        $(ob).unbind("mousemove", track);
        ob.hoverIntent_s = 1;
        return cfg.over.apply(ob, [ev]);
      } else {
        pX = cX;
        pY = cY;
        ob.hoverIntent_t = setTimeout(function () {
          compare(ev, ob);
        }, cfg.interval);
      }
    };
    var delay = function (ev, ob) {
      ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
      ob.hoverIntent_s = 0;
      return cfg.out.apply(ob, [ev]);
    };
    var handleHover = function (e) {
      var p =
        (e.type == "mouseover" ? e.fromElement : e.toElement) ||
        e.relatedTarget;
      while (p && p != this) {
        try {
          p = p.parentNode;
        } catch (e) {
          p = this;
        }
      }
      if (p == this) {
        return false;
      }
      var ev = jQuery.extend({}, e);
      var ob = this;
      if (ob.hoverIntent_t) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
      }
      if (e.type == "mouseover") {
        pX = ev.pageX;
        pY = ev.pageY;
        $(ob).bind("mousemove", track);
        if (ob.hoverIntent_s != 1) {
          ob.hoverIntent_t = setTimeout(function () {
            compare(ev, ob);
          }, cfg.interval);
        }
      } else {
        $(ob).unbind("mousemove", track);
        if (ob.hoverIntent_s == 1) {
          ob.hoverIntent_t = setTimeout(function () {
            delay(ev, ob);
          }, cfg.timeout);
        }
      }
    };
    return this.mouseover(handleHover).mouseout(handleHover);
  };
})(jQuery);
(function ($, undefined) {
  $.ui = $.ui || {};
  if ($.ui.version == "1.8.4") {
    return;
  }
  $.extend($.ui, {
    version: "1.8.4",
    plugin: {
      add: function (module, option, set) {
        var proto = $.ui[module].prototype;
        for (var i in set) {
          proto.plugins[i] = proto.plugins[i] || [];
          proto.plugins[i].push([option, set[i]]);
        }
      },
      call: function (instance, name, args) {
        var set = instance.plugins[name];
        if (!set || !instance.element[0].parentNode) {
          return;
        }
        for (var i = 0; i < set.length; i++) {
          if (instance.options[set[i][0]]) {
            set[i][1].apply(instance.element, args);
          }
        }
      },
    },
    contains: function (a, b) {
      return document.compareDocumentPosition
        ? a.compareDocumentPosition(b) & 16
        : a !== b && a.contains(b);
    },
    hasScroll: function (el, a) {
      if ($(el).css("overflow") === "hidden") {
        return false;
      }
      var scroll = a && a === "left" ? "scrollLeft" : "scrollTop",
        has = false;
      if (el[scroll] > 0) {
        return true;
      }
      el[scroll] = 1;
      has = el[scroll] > 0;
      el[scroll] = 0;
      return has;
    },
    isOverAxis: function (x, reference, size) {
      return x > reference && x < reference + size;
    },
    isOver: function (y, x, top, left, height, width) {
      return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
    },
    keyCode: {
      ALT: 18,
      BACKSPACE: 8,
      CAPS_LOCK: 20,
      COMMA: 188,
      COMMAND: 91,
      COMMAND_LEFT: 91,
      COMMAND_RIGHT: 93,
      CONTROL: 17,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      INSERT: 45,
      LEFT: 37,
      MENU: 93,
      NUMPAD_ADD: 107,
      NUMPAD_DECIMAL: 110,
      NUMPAD_DIVIDE: 111,
      NUMPAD_ENTER: 108,
      NUMPAD_MULTIPLY: 106,
      NUMPAD_SUBTRACT: 109,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SHIFT: 16,
      SPACE: 32,
      TAB: 9,
      UP: 38,
      WINDOWS: 91,
    },
  });
  $.fn.extend({
    _focus: $.fn.focus,
    focus: function (delay, fn) {
      return typeof delay === "number"
        ? this.each(function () {
            var elem = this;
            setTimeout(function () {
              $(elem).focus();
              if (fn) {
                fn.call(elem);
              }
            }, delay);
          })
        : this._focus.apply(this, arguments);
    },
    enableSelection: function () {
      return this.attr("unselectable", "off").css("MozUserSelect", "");
    },
    disableSelection: function () {
      return this.attr("unselectable", "on").css("MozUserSelect", "none");
    },
    scrollParent: function () {
      var scrollParent;
      if (
        ($.browser.msie && /(static|relative)/.test(this.css("position"))) ||
        /absolute/.test(this.css("position"))
      ) {
        scrollParent = this.parents()
          .filter(function () {
            return (
              /(relative|absolute|fixed)/.test($.curCSS(this, "position", 1)) &&
              /(auto|scroll)/.test(
                $.curCSS(this, "overflow", 1) +
                  $.curCSS(this, "overflow-y", 1) +
                  $.curCSS(this, "overflow-x", 1)
              )
            );
          })
          .eq(0);
      } else {
        scrollParent = this.parents()
          .filter(function () {
            return /(auto|scroll)/.test(
              $.curCSS(this, "overflow", 1) +
                $.curCSS(this, "overflow-y", 1) +
                $.curCSS(this, "overflow-x", 1)
            );
          })
          .eq(0);
      }
      return /fixed/.test(this.css("position")) || !scrollParent.length
        ? $(document)
        : scrollParent;
    },
    zIndex: function (zIndex) {
      if (zIndex !== undefined) {
        return this.css("zIndex", zIndex);
      }
      if (this.length) {
        var elem = $(this[0]),
          position,
          value;
        while (elem.length && elem[0] !== document) {
          position = elem.css("position");
          if (
            position === "absolute" ||
            position === "relative" ||
            position === "fixed"
          ) {
            value = parseInt(elem.css("zIndex"));
            if (!isNaN(value) && value != 0) {
              return value;
            }
          }
          elem = elem.parent();
        }
      }
      return 0;
    },
  });
  $.each(["Width", "Height"], function (i, name) {
    var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
      type = name.toLowerCase(),
      orig = {
        innerWidth: $.fn.innerWidth,
        innerHeight: $.fn.innerHeight,
        outerWidth: $.fn.outerWidth,
        outerHeight: $.fn.outerHeight,
      };
    function reduce(elem, size, border, margin) {
      $.each(side, function () {
        size -= parseFloat($.curCSS(elem, "padding" + this, true)) || 0;
        if (border) {
          size -=
            parseFloat($.curCSS(elem, "border" + this + "Width", true)) || 0;
        }
        if (margin) {
          size -= parseFloat($.curCSS(elem, "margin" + this, true)) || 0;
        }
      });
      return size;
    }
    $.fn["inner" + name] = function (size) {
      if (size === undefined) {
        return orig["inner" + name].call(this);
      }
      return this.each(function () {
        $.style(this, type, reduce(this, size) + "px");
      });
    };
    $.fn["outer" + name] = function (size, margin) {
      if (typeof size !== "number") {
        return orig["outer" + name].call(this, size);
      }
      return this.each(function () {
        $.style(this, type, reduce(this, size, true, margin) + "px");
      });
    };
  });
  function visible(element) {
    return !$(element)
      .parents()
      .andSelf()
      .filter(function () {
        return (
          $.curCSS(this, "visibility") === "hidden" ||
          $.expr.filters.hidden(this)
        );
      }).length;
  }
  $.extend($.expr[":"], {
    data: function (elem, i, match) {
      return !!$.data(elem, match[3]);
    },
    focusable: function (element) {
      var nodeName = element.nodeName.toLowerCase(),
        tabIndex = $.attr(element, "tabindex");
      if ("area" === nodeName) {
        var map = element.parentNode,
          mapName = map.name,
          img;
        if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
          return false;
        }
        img = $("img[usemap=#" + mapName + "]")[0];
        return !!img && visible(img);
      }
      return (
        (/input|select|textarea|button|object/.test(nodeName)
          ? !element.disabled
          : "a" == nodeName
          ? element.href || !isNaN(tabIndex)
          : !isNaN(tabIndex)) && visible(element)
      );
    },
    tabbable: function (element) {
      var tabIndex = $.attr(element, "tabindex");
      return (isNaN(tabIndex) || tabIndex >= 0) && $(element).is(":focusable");
    },
  });
})(jQuery);
(function ($) {
  var _remove = $.fn.remove;
  $.fn.remove = function (selector, keepData) {
    return this.each(function () {
      if (!keepData) {
        if (!selector || $.filter(selector, [this]).length) {
          $("*", this)
            .add([this])
            .each(function () {
              $(this).triggerHandler("remove");
            });
        }
      }
      return _remove.call($(this), selector, keepData);
    });
  };
  $.widget = function (name, base, prototype) {
    var namespace = name.split(".")[0],
      fullName;
    name = name.split(".")[1];
    fullName = namespace + "-" + name;
    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }
    $.expr[":"][fullName] = function (elem) {
      return !!$.data(elem, name);
    };
    $[namespace] = $[namespace] || {};
    $[namespace][name] = function (options, element) {
      if (arguments.length) {
        this._createWidget(options, element);
      }
    };
    var basePrototype = new base();
    basePrototype.options = $.extend(true, {}, basePrototype.options);
    $[namespace][name].prototype = $.extend(
      true,
      basePrototype,
      {
        namespace: namespace,
        widgetName: name,
        widgetEventPrefix:
          $[namespace][name].prototype.widgetEventPrefix || name,
        widgetBaseClass: fullName,
      },
      prototype
    );
    $.widget.bridge(name, $[namespace][name]);
  };
  $.widget.bridge = function (name, object) {
    $.fn[name] = function (options) {
      var isMethodCall = typeof options === "string",
        args = Array.prototype.slice.call(arguments, 1),
        returnValue = this;
      options =
        !isMethodCall && args.length
          ? $.extend.apply(null, [true, options].concat(args))
          : options;
      if (isMethodCall && options.substring(0, 1) === "_") {
        return returnValue;
      }
      if (isMethodCall) {
        this.each(function () {
          var instance = $.data(this, name),
            methodValue =
              instance && $.isFunction(instance[options])
                ? instance[options].apply(instance, args)
                : instance;
          if (methodValue !== instance && methodValue !== "undefined") {
            returnValue = methodValue;
            return false;
          }
        });
      } else {
        this.each(function () {
          var instance = $.data(this, name);
          if (instance) {
            if (options) {
              instance.option(options);
            }
            instance._init();
          } else {
            $.data(this, name, new object(options, this));
          }
        });
      }
      return returnValue;
    };
  };
  $.Widget = function (options, element) {
    if (arguments.length) {
      this._createWidget(options, element);
    }
  };
  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    options: { disabled: false },
    _createWidget: function (options, element) {
      $.data(element, this.widgetName, this);
      this.element = $(element);
      this.options = $.extend(
        true,
        {},
        this.options,
        $.metadata && $.metadata.get(element)[this.widgetName],
        options
      );
      var self = this;
      this.element.bind("remove." + this.widgetName, function () {
        self.destroy();
      });
      this._create();
      this._init();
    },
    _create: function () {},
    _init: function () {},
    destroy: function () {
      this.element.unbind("." + this.widgetName).removeData(this.widgetName);
      this.widget()
        .unbind("." + this.widgetName)
        .removeAttr("aria-disabled")
        .removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled");
    },
    widget: function () {
      return this.element;
    },
    option: function (key, value) {
      var options = key,
        self = this;
      if (arguments.length === 0) {
        return $.extend({}, self.options);
      }
      if (typeof key === "string") {
        if (value === "undefined") {
          return this.options[key];
        }
        options = {};
        options[key] = value;
      }
      $.each(options, function (key, value) {
        self._setOption(key, value);
      });
      return self;
    },
    _setOption: function (key, value) {
      this.options[key] = value;
      if (key === "disabled") {
        this.widget()
          [value ? "addClass" : "removeClass"](
            this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled"
          )
          .attr("aria-disabled", value);
      }
      return this;
    },
    enable: function () {
      return this._setOption("disabled", false);
    },
    disable: function () {
      return this._setOption("disabled", true);
    },
    _trigger: function (type, event, data) {
      var callback = this.options[type];
      event = $.Event(event);
      event.type = (
        type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type
      ).toLowerCase();
      data = data || {};
      if (event.originalEvent) {
        for (var i = $.event.props.length, prop; i; ) {
          prop = $.event.props[--i];
          event[prop] = event.originalEvent[prop];
        }
      }
      this.element.trigger(event, data);
      return !(
        ($.isFunction(callback) &&
          callback.call(this.element[0], event, data) === false) ||
        event.isDefaultPrevented()
      );
    },
  };
})(jQuery);
(function ($, undefined) {
  $.widget("ui.mouse", {
    options: { cancel: ":input,option", distance: 1, delay: 0 },
    _mouseInit: function () {
      var self = this;
      this.element
        .bind("mousedown." + this.widgetName, function (event) {
          return self._mouseDown(event);
        })
        .bind("click." + this.widgetName, function (event) {
          if (self._preventClickEvent) {
            self._preventClickEvent = false;
            event.stopImmediatePropagation();
            return false;
          }
        });
      this.started = false;
    },
    _mouseDestroy: function () {
      this.element.unbind("." + this.widgetName);
    },
    _mouseDown: function (event) {
      event.originalEvent = event.originalEvent || {};
      if (event.originalEvent.mouseHandled) {
        return;
      }
      this._mouseStarted && this._mouseUp(event);
      this._mouseDownEvent = event;
      var self = this,
        btnIsLeft = event.which == 1,
        elIsCancel =
          typeof this.options.cancel == "string"
            ? $(event.target)
                .parents()
                .add(event.target)
                .filter(this.options.cancel).length
            : false;
      if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
        return true;
      }
      this.mouseDelayMet = !this.options.delay;
      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function () {
          self.mouseDelayMet = true;
        }, this.options.delay);
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = this._mouseStart(event) !== false;
        if (!this._mouseStarted) {
          event.preventDefault();
          return true;
        }
      }
      this._mouseMoveDelegate = function (event) {
        return self._mouseMove(event);
      };
      this._mouseUpDelegate = function (event) {
        return self._mouseUp(event);
      };
      $(document)
        .bind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .bind("mouseup." + this.widgetName, this._mouseUpDelegate);
      $.browser.safari || event.preventDefault();
      event.originalEvent.mouseHandled = true;
      return true;
    },
    _mouseMove: function (event) {
      if ($.browser.msie && !event.button) {
        return this._mouseUp(event);
      }
      if (this._mouseStarted) {
        this._mouseDrag(event);
        return event.preventDefault();
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted =
          this._mouseStart(this._mouseDownEvent, event) !== false;
        this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event);
      }
      return !this._mouseStarted;
    },
    _mouseUp: function (event) {
      $(document)
        .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      if (this._mouseStarted) {
        this._mouseStarted = false;
        this._preventClickEvent = event.target == this._mouseDownEvent.target;
        this._mouseStop(event);
      }
      return false;
    },
    _mouseDistanceMet: function (event) {
      return (
        Math.max(
          Math.abs(this._mouseDownEvent.pageX - event.pageX),
          Math.abs(this._mouseDownEvent.pageY - event.pageY)
        ) >= this.options.distance
      );
    },
    _mouseDelayMet: function (event) {
      return this.mouseDelayMet;
    },
    _mouseStart: function (event) {},
    _mouseDrag: function (event) {},
    _mouseStop: function (event) {},
    _mouseCapture: function (event) {
      return true;
    },
  });
})(jQuery);
(function ($, undefined) {
  var numPages = 5;
  $.widget("ui.slider", $.ui.mouse, {
    widgetEventPrefix: "slide",
    options: {
      animate: false,
      distance: 0,
      max: 100,
      min: 0,
      orientation: "horizontal",
      range: false,
      step: 1,
      value: 0,
      values: null,
    },
    _create: function () {
      var self = this,
        o = this.options;
      this._keySliding = false;
      this._mouseSliding = false;
      this._animateOff = true;
      this._handleIndex = null;
      this._detectOrientation();
      this._mouseInit();
      this.element.addClass(
        "ui-slider" +
          " ui-slider-" +
          this.orientation +
          " ui-widget" +
          " ui-widget-content" +
          " ui-corner-all"
      );
      if (o.disabled) {
        this.element.addClass("ui-slider-disabled ui-disabled");
      }
      this.range = $([]);
      if (o.range) {
        if (o.range === true) {
          this.range = $("<div></div>");
          if (!o.values) {
            o.values = [this._valueMin(), this._valueMin()];
          }
          if (o.values.length && o.values.length !== 2) {
            o.values = [o.values[0], o.values[0]];
          }
        } else {
          this.range = $("<div></div>");
        }
        this.range.appendTo(this.element).addClass("ui-slider-range");
        if (o.range === "min" || o.range === "max") {
          this.range.addClass("ui-slider-range-" + o.range);
        }
        this.range.addClass("ui-widget-header");
      }
      if ($(".ui-slider-handle", this.element).length === 0) {
        $("<a href='#'></a>")
          .appendTo(this.element)
          .addClass("ui-slider-handle");
      }
      if (o.values && o.values.length) {
        while ($(".ui-slider-handle", this.element).length < o.values.length) {
          $("<a href='#'></a>")
            .appendTo(this.element)
            .addClass("ui-slider-handle");
        }
      }
      this.handles = $(".ui-slider-handle", this.element).addClass(
        "ui-state-default" + " ui-corner-all"
      );
      this.handle = this.handles.eq(0);
      this.handles
        .add(this.range)
        .filter("a")
        .click(function (event) {
          event.preventDefault();
        })
        .hover(
          function () {
            if (!o.disabled) {
              $(this).addClass("ui-state-hover");
            }
          },
          function () {
            $(this).removeClass("ui-state-hover");
          }
        )
        .focus(function () {
          if (!o.disabled) {
            $(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
            $(this).addClass("ui-state-focus");
          } else {
            $(this).blur();
          }
        })
        .blur(function () {
          $(this).removeClass("ui-state-focus");
        });
      this.handles.each(function (i) {
        $(this).data("index.ui-slider-handle", i);
      });
      this.handles
        .keydown(function (event) {
          var ret = true,
            index = $(this).data("index.ui-slider-handle"),
            allowed,
            curVal,
            newVal,
            step;
          if (self.options.disabled) {
            return;
          }
          switch (event.keyCode) {
            case $.ui.keyCode.HOME:
            case $.ui.keyCode.END:
            case $.ui.keyCode.PAGE_UP:
            case $.ui.keyCode.PAGE_DOWN:
            case $.ui.keyCode.UP:
            case $.ui.keyCode.RIGHT:
            case $.ui.keyCode.DOWN:
            case $.ui.keyCode.LEFT:
              ret = false;
              if (!self._keySliding) {
                self._keySliding = true;
                $(this).addClass("ui-state-active");
                allowed = self._start(event, index);
                if (allowed === false) {
                  return;
                }
              }
              break;
          }
          step = self.options.step;
          if (self.options.values && self.options.values.length) {
            curVal = newVal = self.values(index);
          } else {
            curVal = newVal = self.value();
          }
          switch (event.keyCode) {
            case $.ui.keyCode.HOME:
              newVal = self._valueMin();
              break;
            case $.ui.keyCode.END:
              newVal = self._valueMax();
              break;
            case $.ui.keyCode.PAGE_UP:
              newVal = self._trimAlignValue(
                curVal + (self._valueMax() - self._valueMin()) / numPages
              );
              break;
            case $.ui.keyCode.PAGE_DOWN:
              newVal = self._trimAlignValue(
                curVal - (self._valueMax() - self._valueMin()) / numPages
              );
              break;
            case $.ui.keyCode.UP:
            case $.ui.keyCode.RIGHT:
              if (curVal === self._valueMax()) {
                return;
              }
              newVal = self._trimAlignValue(curVal + step);
              break;
            case $.ui.keyCode.DOWN:
            case $.ui.keyCode.LEFT:
              if (curVal === self._valueMin()) {
                return;
              }
              newVal = self._trimAlignValue(curVal - step);
              break;
          }
          self._slide(event, index, newVal);
          return ret;
        })
        .keyup(function (event) {
          var index = $(this).data("index.ui-slider-handle");
          if (self._keySliding) {
            self._keySliding = false;
            self._stop(event, index);
            self._change(event, index);
            $(this).removeClass("ui-state-active");
          }
        });
      this._refreshValue();
      this._animateOff = false;
    },
    destroy: function () {
      this.handles.remove();
      this.range.remove();
      this.element
        .removeClass(
          "ui-slider" +
            " ui-slider-horizontal" +
            " ui-slider-vertical" +
            " ui-slider-disabled" +
            " ui-widget" +
            " ui-widget-content" +
            " ui-corner-all"
        )
        .removeData("slider")
        .unbind(".slider");
      this._mouseDestroy();
      return this;
    },
    _mouseCapture: function (event) {
      var o = this.options,
        position,
        normValue,
        distance,
        closestHandle,
        self,
        index,
        allowed,
        offset,
        mouseOverHandle;
      if (o.disabled) {
        return false;
      }
      this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight(),
      };
      this.elementOffset = this.element.offset();
      position = { x: event.pageX, y: event.pageY };
      normValue = this._normValueFromMouse(position);
      distance = this._valueMax() - this._valueMin() + 1;
      self = this;
      this.handles.each(function (i) {
        var thisDistance = Math.abs(normValue - self.values(i));
        if (distance > thisDistance) {
          distance = thisDistance;
          closestHandle = $(this);
          index = i;
        }
      });
      if (o.range === true && this.values(1) === o.min) {
        index += 1;
        closestHandle = $(this.handles[index]);
      }
      allowed = this._start(event, index);
      if (allowed === false) {
        return false;
      }
      this._mouseSliding = true;
      self._handleIndex = index;
      closestHandle.addClass("ui-state-active").focus();
      offset = closestHandle.offset();
      mouseOverHandle = !$(event.target)
        .parents()
        .andSelf()
        .is(".ui-slider-handle");
      this._clickOffset = mouseOverHandle
        ? { left: 0, top: 0 }
        : {
            left: event.pageX - offset.left - closestHandle.width() / 2,
            top:
              event.pageY -
              offset.top -
              closestHandle.height() / 2 -
              (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
              (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
              (parseInt(closestHandle.css("marginTop"), 10) || 0),
          };
      this._slide(event, index, normValue);
      this._animateOff = true;
      return true;
    },
    _mouseStart: function (event) {
      return true;
    },
    _mouseDrag: function (event) {
      var position = { x: event.pageX, y: event.pageY },
        normValue = this._normValueFromMouse(position);
      this._slide(event, this._handleIndex, normValue);
      return false;
    },
    _mouseStop: function (event) {
      this.handles.removeClass("ui-state-active");
      this._mouseSliding = false;
      this._stop(event, this._handleIndex);
      this._change(event, this._handleIndex);
      this._handleIndex = null;
      this._clickOffset = null;
      this._animateOff = false;
      return false;
    },
    _detectOrientation: function () {
      this.orientation =
        this.options.orientation === "vertical" ? "vertical" : "horizontal";
    },
    _normValueFromMouse: function (position) {
      var pixelTotal, pixelMouse, percentMouse, valueTotal, valueMouse;
      if (this.orientation === "horizontal") {
        pixelTotal = this.elementSize.width;
        pixelMouse =
          position.x -
          this.elementOffset.left -
          (this._clickOffset ? this._clickOffset.left : 0);
      } else {
        pixelTotal = this.elementSize.height;
        pixelMouse =
          position.y -
          this.elementOffset.top -
          (this._clickOffset ? this._clickOffset.top : 0);
      }
      percentMouse = pixelMouse / pixelTotal;
      if (percentMouse > 1) {
        percentMouse = 1;
      }
      if (percentMouse < 0) {
        percentMouse = 0;
      }
      if (this.orientation === "vertical") {
        percentMouse = 1 - percentMouse;
      }
      valueTotal = this._valueMax() - this._valueMin();
      valueMouse = this._valueMin() + percentMouse * valueTotal;
      return this._trimAlignValue(valueMouse);
    },
    _start: function (event, index) {
      var uiHash = { handle: this.handles[index], value: this.value() };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }
      return this._trigger("start", event, uiHash);
    },
    _slide: function (event, index, newVal) {
      var otherVal, newValues, allowed;
      if (this.options.values && this.options.values.length) {
        otherVal = this.values(index ? 0 : 1);
        if (
          this.options.values.length === 2 &&
          this.options.range === true &&
          ((index === 0 && newVal > otherVal) ||
            (index === 1 && newVal < otherVal))
        ) {
          newVal = otherVal;
        }
        if (newVal !== this.values(index)) {
          newValues = this.values();
          newValues[index] = newVal;
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal,
            values: newValues,
          });
          otherVal = this.values(index ? 0 : 1);
          if (allowed !== false) {
            this.values(index, newVal, true);
          }
        }
      } else {
        if (newVal !== this.value()) {
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal,
          });
          if (allowed !== false) {
            this.value(newVal);
          }
        }
      }
    },
    _stop: function (event, index) {
      var uiHash = { handle: this.handles[index], value: this.value() };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }
      this._trigger("stop", event, uiHash);
    },
    _change: function (event, index) {
      if (!this._keySliding && !this._mouseSliding) {
        var uiHash = { handle: this.handles[index], value: this.value() };
        if (this.options.values && this.options.values.length) {
          uiHash.value = this.values(index);
          uiHash.values = this.values();
        }
        this._trigger("change", event, uiHash);
      }
    },
    value: function (newValue) {
      if (arguments.length) {
        this.options.value = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, 0);
      }
      return this._value();
    },
    values: function (index, newValue) {
      var vals, newValues, i;
      if (arguments.length > 1) {
        this.options.values[index] = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, index);
      }
      if (arguments.length) {
        if ($.isArray(arguments[0])) {
          vals = this.options.values;
          newValues = arguments[0];
          for (i = 0; i < vals.length; i += 1) {
            vals[i] = this._trimAlignValue(newValues[i]);
            this._change(null, i);
          }
          this._refreshValue();
        } else {
          if (this.options.values && this.options.values.length) {
            return this._values(index);
          } else {
            return this.value();
          }
        }
      } else {
        return this._values();
      }
    },
    _setOption: function (key, value) {
      var i,
        valsLength = 0;
      if ($.isArray(this.options.values)) {
        valsLength = this.options.values.length;
      }
      $.Widget.prototype._setOption.apply(this, arguments);
      switch (key) {
        case "disabled":
          if (value) {
            this.handles.filter(".ui-state-focus").blur();
            this.handles.removeClass("ui-state-hover");
            this.handles.attr("disabled", "disabled");
            this.element.addClass("ui-disabled");
          } else {
            this.handles.removeAttr("disabled");
            this.element.removeClass("ui-disabled");
          }
          break;
        case "orientation":
          this._detectOrientation();
          this.element
            .removeClass("ui-slider-horizontal ui-slider-vertical")
            .addClass("ui-slider-" + this.orientation);
          this._refreshValue();
          break;
        case "value":
          this._animateOff = true;
          this._refreshValue();
          this._change(null, 0);
          this._animateOff = false;
          break;
        case "values":
          this._animateOff = true;
          this._refreshValue();
          for (i = 0; i < valsLength; i += 1) {
            this._change(null, i);
          }
          this._animateOff = false;
          break;
      }
    },
    _value: function () {
      var val = this.options.value;
      val = this._trimAlignValue(val);
      return val;
    },
    _values: function (index) {
      var val, vals, i;
      if (arguments.length) {
        val = this.options.values[index];
        val = this._trimAlignValue(val);
        return val;
      } else {
        vals = this.options.values.slice();
        for (i = 0; i < vals.length; i += 1) {
          vals[i] = this._trimAlignValue(vals[i]);
        }
        return vals;
      }
    },
    _trimAlignValue: function (val) {
      if (val < this._valueMin()) {
        return this._valueMin();
      }
      if (val > this._valueMax()) {
        return this._valueMax();
      }
      var step = this.options.step > 0 ? this.options.step : 1,
        valModStep = val % step,
        alignValue = val - valModStep;
      if (Math.abs(valModStep) * 2 >= step) {
        alignValue += valModStep > 0 ? step : -step;
      }
      return parseFloat(alignValue.toFixed(5));
    },
    _valueMin: function () {
      return this.options.min;
    },
    _valueMax: function () {
      return this.options.max;
    },
    _refreshValue: function () {
      var oRange = this.options.range,
        o = this.options,
        self = this,
        animate = !this._animateOff ? o.animate : false,
        valPercent,
        _set = {},
        lastValPercent,
        value,
        valueMin,
        valueMax;
      if (this.options.values && this.options.values.length) {
        this.handles.each(function (i, j) {
          valPercent =
            ((self.values(i) - self._valueMin()) /
              (self._valueMax() - self._valueMin())) *
            100;
          _set[self.orientation === "horizontal" ? "left" : "bottom"] =
            valPercent + "%";
          $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
          if (self.options.range === true) {
            if (self.orientation === "horizontal") {
              if (i === 0) {
                self.range
                  .stop(1, 1)
                  [animate ? "animate" : "css"](
                    { left: valPercent + "%" },
                    o.animate
                  );
              }
              if (i === 1) {
                self.range[animate ? "animate" : "css"](
                  { width: valPercent - lastValPercent + "%" },
                  { queue: false, duration: o.animate }
                );
              }
            } else {
              if (i === 0) {
                self.range
                  .stop(1, 1)
                  [animate ? "animate" : "css"](
                    { bottom: valPercent + "%" },
                    o.animate
                  );
              }
              if (i === 1) {
                self.range[animate ? "animate" : "css"](
                  { height: valPercent - lastValPercent + "%" },
                  { queue: false, duration: o.animate }
                );
              }
            }
          }
          lastValPercent = valPercent;
        });
      } else {
        value = this.value();
        valueMin = this._valueMin();
        valueMax = this._valueMax();
        valPercent =
          valueMax !== valueMin
            ? ((value - valueMin) / (valueMax - valueMin)) * 100
            : 0;
        _set[self.orientation === "horizontal" ? "left" : "bottom"] =
          valPercent + "%";
        this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
        if (oRange === "min" && this.orientation === "horizontal") {
          this.range
            .stop(1, 1)
            [animate ? "animate" : "css"](
              { width: valPercent + "%" },
              o.animate
            );
        }
        if (oRange === "max" && this.orientation === "horizontal") {
          this.range[animate ? "animate" : "css"](
            { width: 100 - valPercent + "%" },
            { queue: false, duration: o.animate }
          );
        }
        if (oRange === "min" && this.orientation === "vertical") {
          this.range
            .stop(1, 1)
            [animate ? "animate" : "css"](
              { height: valPercent + "%" },
              o.animate
            );
        }
        if (oRange === "max" && this.orientation === "vertical") {
          this.range[animate ? "animate" : "css"](
            { height: 100 - valPercent + "%" },
            { queue: false, duration: o.animate }
          );
        }
      }
    },
  });
  $.extend($.ui.slider, { version: "1.8.4" });
})(jQuery);
mw.PlayerSkinKskin = {
  playerClass: "k-player",
  longTimeDisp: false,
  height: 20,
  volume_layout: "horizontal",
  supportedMenuItems: { credits: true },
  components: {
    playButtonLarge: { h: 55 },
    options: {
      w: 50,
      o: function (ctrlObj) {
        return $j("<div />")
          .attr("title", gM("mwe-embedplayer-player_options"))
          .addClass("ui-state-default ui-corner-bl rButton k-options")
          .append($j("<span />").text(gM("mwe-embedplayer-menu_btn")));
      },
    },
    volumeControl: { w: 40 },
    attributionButton: false,
    timeDisplay: { w: 45 },
    optionsMenu: {
      w: 0,
      o: function (ctrlObj) {
        var embedPlayer = ctrlObj.embedPlayer;
        $menuOverlay = $j("<div />")
          .addClass("overlay-win k-menu ui-widget-content")
          .css({
            width: "100%",
            position: "absolute",
            top: "0px",
            bottom: ctrlObj.getHeight() + 2 + "px",
          });
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("safari") != -1) {
          $menuOverlay.css("opacity", "0.9");
        }
        if (embedPlayer.getPlayerHeight() < ctrlObj.getOverlayHeight()) {
          var topPos = ctrlObj.checkOverlayControls()
            ? embedPlayer.getPlayerHeight()
            : embedPlayer.getPlayerHeight() + ctrlObj.getHeight();
          $menuOverlay.css({
            top: topPos + "px",
            bottom: null,
            width: ctrlObj.getOverlayWidth(),
            height: ctrlObj.getOverlayHeight() + "px",
          });
          $j(embedPlayer).parents(".thumbinner").css("overflow", "visible");
        }
        $menuBar = $j("<ul />").addClass("k-menu-bar");
        delete ctrlObj.supportedMenuItems["aboutPlayerLibrary"];
        for (var menuItem in ctrlObj.supportedMenuItems) {
          $menuBar.append(
            $j("<li />")
              .addClass("k-" + menuItem + "-btn")
              .attr("rel", menuItem)
              .append(
                $j("<a />").attr({
                  title: gM("mwe-embedplayer-" + menuItem),
                  href: "#",
                })
              )
          );
        }
        $menuOverlay.append($menuBar);
        var $menuScreens = $j("<div />")
          .addClass("k-menu-screens")
          .css({
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "45px",
            overflow: "hidden",
          });
        for (var menuItem in ctrlObj.supportedMenuItems) {
          $menuScreens.append(
            $j("<div />").addClass("menu-screen menu-" + menuItem)
          );
        }
        $menuOverlay.append($menuScreens);
        return $menuOverlay;
      },
    },
  },
  getOverlayWidth: function () {
    return this.embedPlayer.getPlayerWidth() < 200
      ? 200
      : this.embedPlayer.getPlayerWidth();
  },
  getOverlayHeight: function () {
    return this.embedPlayer.getPlayerHeight() < 160
      ? 160
      : this.embedPlayer.getPlayerHeight();
  },
  addSkinControlBindings: function () {
    var embedPlayer = this.embedPlayer;
    var _this = this;
    this.$playerTarget = embedPlayer.$interface;
    this.$playerTarget
      .find(".k-options")
      .unbind()
      .click(function () {
        _this.checkMenuOverlay();
        var $kmenu = _this.$playerTarget.find(".k-menu");
        if ($kmenu.is(":visible")) {
          _this.closeMenuOverlay();
        } else {
          _this.showMenuOverlay();
        }
      });
  },
  checkMenuOverlay: function () {
    var _this = this;
    var embedPlayer = this.embedPlayer;
    if (_this.$playerTarget.find(".k-menu").length == 0) {
      if (!embedPlayer.supports["overlays"]) {
        embedPlayer.stop();
      }
      _this.addMenuBinding();
    }
  },
  closeMenuOverlay: function () {
    var $optionsMenu = this.$playerTarget.find(".k-options");
    var $kmenu = this.$playerTarget.find(".k-menu");
    $kmenu.fadeOut("fast", function () {
      $optionsMenu.find("span").text(gM("mwe-embedplayer-menu_btn"));
    });
    this.$playerTarget.find(".play-btn-large").fadeIn("fast");
    this.showControlBar();
    this.displayOptionsMenuFlag = false;
  },
  showMenuOverlay: function ($ktxt) {
    var $optionsMenu = this.$playerTarget.find(".k-options");
    var $kmenu = this.$playerTarget.find(".k-menu");
    $kmenu.fadeIn("fast", function () {
      $optionsMenu.find("span").text(gM("mwe-embedplayer-close_btn"));
    });
    this.$playerTarget.find(".play-btn-large").fadeOut("fast");
    $j(this.embedPlayer).trigger("displayMenuOverlay");
    this.displayOptionsMenuFlag = true;
  },
  addMenuBinding: function () {
    var _this = this;
    var embedPlayer = this.embedPlayer;
    var $playerTarget = embedPlayer.$interface;
    if ($playerTarget.find(".k-menu").length != 0) return false;
    $playerTarget.prepend(_this.getComponent("optionsMenu"));
    $playerTarget.find(".k-menu").hide();
    for (var menuItem in _this.supportedMenuItems) {
      $playerTarget.find(".k-" + menuItem + "-btn").click(function () {
        var mk = $j(this).attr("rel");
        $targetItem = $playerTarget.find(".menu-" + mk);
        _this.showMenuItem(mk);
        $playerTarget.find(".menu-screen").hide();
        $targetItem.fadeIn("fast");
        return false;
      });
    }
  },
  onClipDone: function () {
    if (this.embedPlayer.apiTitleKey) {
      this.checkMenuOverlay();
      this.showMenuOverlay();
      this.showMenuItem("credits");
    }
  },
  showMenuItem: function (menuItem) {
    var embedPlayer = this.embedPlayer;
    switch (menuItem) {
      case "credits":
        this.showCredits();
        break;
      case "playerSelect":
        embedPlayer.$interface
          .find(".menu-playerSelect")
          .html(this.getPlayerSelect());
        break;
      case "download":
        embedPlayer.$interface
          .find(".menu-download")
          .text(gM("mwe-loading_txt"));
        this.showDownload(embedPlayer.$interface.find(".menu-download"));
        break;
      case "share":
        embedPlayer.$interface.find(".menu-share").html(this.getShare());
        break;
    }
  },
  showCredits: function () {
    var embedPlayer = this.embedPlayer;
    var _this = this;
    var $target = embedPlayer.$interface.find(".menu-credits");
    $target
      .empty()
      .append(
        $j("<h2 />").text(gM("mwe-embedplayer-credits")),
        $j("<div />").addClass("credits_box ui-corner-all").loadingSpinner()
      );
    if (mw.getConfig("EmbedPlayer.KalturaAttribution") == true) {
      $target.append(
        $j("<div />")
          .addClass("k-attribution")
          .attr({ title: gM("mwe-embedplayer-kaltura-platform-title") })
          .click(function () {
            window.location = "http://kaltura.com";
          })
      );
    }
    if (!embedPlayer.apiTitleKey) {
      $target
        .find(".credits_box")
        .text("Error: no title key to grab credits with");
      return;
    }
    _this.getCredits();
  },
  getCredits: function () {
    var embedPlayer = this.embedPlayer;
    var _this = this;
    var $target = embedPlayer.$interface.find(".menu-credits");
    var apiUrl = mw.getApiProviderURL(embedPlayer.apiProvider);
    var fileTitle =
      "File:" + unescape(embedPlayer.apiTitleKey).replace(/File:|Image:/, "");
    var request = { prop: "imageinfo", titles: fileTitle, iiprop: "url" };
    var articleUrl = "";
    mw.getJSON(apiUrl, request, function (data) {
      if (data.query.pages) {
        for (var i in data.query.pages) {
          var imageProps = data.query.pages[i];
          if (
            imageProps.imageinfo &&
            imageProps.imageinfo[0] &&
            imageProps.imageinfo[0].descriptionurl
          ) {
            $target
              .find(".credits_box")
              .html(_this.doCreditLine(imageProps.imageinfo[0].descriptionurl));
          } else {
            $target
              .find(".credits_box")
              .text(
                "Error: title key: " + embedPlayer.apiTitleKey + " not found"
              );
          }
        }
      }
    });
  },
  doCreditLine: function (articleUrl) {
    var embedPlayer = this.embedPlayer;
    var titleStr = embedPlayer.apiTitleKey.replace(/_/g, " ");
    var imgWidth = this.getOverlayWidth() < 250 ? 45 : 90;
    return $j("<div/>")
      .addClass("creditline")
      .append(
        $j("<a/>")
          .attr({ href: articleUrl, title: titleStr })
          .html(
            $j("<img/>")
              .attr({ border: 0, src: embedPlayer.poster })
              .css({
                width: imgWidth,
                height: parseInt(
                  imgWidth * (embedPlayer.height / embedPlayer.width)
                ),
              })
          )
      )
      .append(
        $j("<span>").html(
          gM(
            "mwe-embedplayer-credit-title",
            $j("<div>")
              .html(
                $j("<a/>")
                  .attr({ href: articleUrl, title: titleStr })
                  .text(titleStr)
              )
              .html()
          )
        )
      );
  },
};
mw.PlayerSkinMvpcf = { playerClass: "mv-player" };
mw.EmbedPlayerNative = {
  instanceOf: "Native",
  onlyLoadFlag: false,
  onLoadedCallback: null,
  prevCurrentTime: -1,
  progressEventData: null,
  mediaLoadedFlag: null,
  nativeEvents: [
    "loadstart",
    "progress",
    "suspend",
    "abort",
    "error",
    "emptied",
    "stalled",
    "play",
    "pause",
    "loadedmetadata",
    "loadeddata",
    "waiting",
    "playing",
    "canplay",
    "canplaythough",
    "seeking",
    "seeked",
    "timeupdate",
    "ended",
    "ratechange",
    "durationchange",
    "volumechange",
  ],
  supports: {
    playHead: true,
    pause: true,
    fullscreen: true,
    timeDisplay: true,
    volumeControl: true,
    overlays: true,
  },
  updateFeatureSupport: function () {
    if (this.useNativePlayerControls()) {
      this.supports.overlays = false;
      this.supports.volumeControl = false;
    }
    if (mw.isIpad()) {
      this.supports.volumeControl = false;
    }
    this.parent_updateFeatureSupport();
  },
  doEmbedHTML: function () {
    var _this = this;
    _this.bufferStartFlag = false;
    _this.bufferEndFlag = false;
    if (
      (this.useNativePlayerControls() || this.isPersistentNativePlayer()) &&
      $j("#" + this.pid).length &&
      typeof $j("#" + this.pid).get(0).play != "undefined"
    ) {
      $j("#" + this.pid).attr("src", this.getSrc(this.currentTime));
      $j("#" + this.pid)
        .get(0)
        .load();
      _this.postEmbedJS();
      return;
    }
    $j(this).html(_this.getNativePlayerHtml());
    _this.postEmbedJS();
  },
  getNativePlayerHtml: function (playerAttribtues, cssSet) {
    if (!playerAttribtues) {
      playerAttribtues = {};
    }
    if (!playerAttribtues["id"]) playerAttribtues["id"] = this.pid;
    if (!playerAttribtues["src"])
      playerAttribtues["src"] = this.getSrc(this.currentTime);
    if (this.autoplay) {
      playerAttribtues["autoplay"] = "true";
    }
    if (!cssSet) {
      cssSet = {};
    }
    if (!cssSet["width"]) cssSet["width"] = "100%";
    if (!cssSet["height"]) cssSet["height"] = "100%";
    if (this.loop) {
      playerAttribtues["loop"] = "true";
    }
    var tagName = this.isAudio() ? "audio" : "video";
    return $j("<" + tagName + " />")
      .addClass("nativeEmbedPlayerPid")
      .attr(playerAttribtues)
      .css(cssSet);
  },
  postEmbedJS: function () {
    var _this = this;
    var vid = this.getPlayerElement();
    this.applyMediaElementBindings();
    if (this.onlyLoadFlag) {
      vid.pause();
      vid.load();
    } else {
      vid.play();
    }
    setTimeout(function () {
      _this.monitor();
    }, 100);
  },
  applyMediaElementBindings: function () {
    var _this = this;
    var vid = this.getPlayerElement();
    if (!vid) {
      return;
    }
    $j.each(_this.nativeEvents, function (inx, eventName) {
      $j(vid).bind(eventName, function () {
        if (_this._propagateEvents) {
          var argArray = $j.makeArray(arguments);
          if (_this["on" + eventName]) {
            _this["on" + eventName].apply(_this, argArray);
          } else {
            $j(_this).trigger(eventName, argArray);
          }
        }
      });
    });
  },
  monitor: function () {
    var _this = this;
    var vid = _this.getPlayerElement();
    if (vid && vid.duration) {
      this.duration = vid.duration;
    }
    if (vid && vid.buffered && vid.buffered.end && vid.duration) {
      this.bufferedPercent = vid.buffered.end(0) / vid.duration;
    }
    _this.parent_monitor();
  },
  doSeek: function (percentage) {
    this.seeking = true;
    this.controlBuilder.onSeek();
    if (this.supportsURLTimeEncoding()) {
      if (
        percentage < this.bufferedPercent &&
        this.playerElement.duration &&
        !this.didSeekJump
      ) {
        this.doNativeSeek(percentage);
      } else {
        this.parent_doSeek(percentage);
      }
    } else if (this.playerElement && this.playerElement.duration) {
      this.doNativeSeek(percentage);
    } else {
      this.doPlayThenSeek(percentage);
    }
  },
  doNativeSeek: function (percentage) {
    var _this = this;
    this.seeking = true;
    this.seek_time_sec = 0;
    this.setCurrentTime(percentage * this.duration, function () {
      _this.seeking = false;
      _this.monitor();
    });
  },
  doPlayThenSeek: function (percentage) {
    var _this = this;
    this.play();
    var retryCount = 0;
    var readyForSeek = function () {
      _this.getPlayerElement();
      if (_this.playerElement && _this.playerElement.duration) {
        _this.doNativeSeek(percentage);
      } else {
        if (retryCount < 800) {
          setTimeout(readyForSeek, 50);
          retryCount++;
        } else {
        }
      }
    };
    readyForSeek();
  },
  setCurrentTime: function (time, callback, callbackCount) {
    var _this = this;
    if (!callbackCount) callbackCount = 0;
    this.getPlayerElement();
    if (_this.playerElement.readyState >= 1) {
      if (_this.playerElement.currentTime == time) {
        callback();
        return;
      }
      var once = function (event) {
        if (callback) {
          callback();
        }
        _this.playerElement.removeEventListener("seeked", once, false);
      };
      _this.playerElement.addEventListener("seeked", once, false);
      try {
        _this.playerElement.currentTime = time;
      } catch (e) {
        callback();
        return;
      }
    } else {
      if (callbackCount >= 300) {
        return;
      }
      setTimeout(function () {
        _this.setCurrentTime(time, callback, callbackCount++);
      }, 10);
    }
  },
  getPlayerElementTime: function () {
    var _this = this;
    this.getPlayerElement();
    if (!this.playerElement) {
      return false;
    }
    return this.playerElement.currentTime;
  },
  updatePosterSrc: function (src) {
    if (this.getPlayerElement()) {
      this.getPlayerElement().poster = src;
    }
    this.parent_updatePosterSrc(src);
  },
  switchPlaySrc: function (src, switchCallback, doneCallback) {
    var _this = this;
    this.duration = 0;
    this.currentTime = 0;
    this.previousTime = 0;
    var vid = this.getPlayerElement();
    if (vid) {
      try {
        vid.play();
        setTimeout(function () {
          $j(vid).unbind();
          vid.pause();
          var orginalControlsState = vid.controls;
          vid.removeAttribute("controls");
          var updateSrcAndPlay = function () {
            var vid = _this.getPlayerElement();
            if (!vid) {
              return;
            }
            vid.src = src;
            setTimeout(function () {
              var vid = _this.getPlayerElement();
              if (!vid) {
                return;
              }
              vid.load();
              vid.play();
              setTimeout(function () {
                var vid = _this.getPlayerElement();
                vid.controls = orginalControlsState;
                $j(vid).bind("ended", function (event) {
                  if (typeof doneCallback == "function") {
                    doneCallback();
                  }
                  return false;
                });
                if (typeof switchCallback == "function") {
                  switchCallback(vid);
                }
              }, 100);
            }, 100);
          };
          if (navigator.userAgent.toLowerCase().indexOf("chrome") != -1) {
            vid.src = "";
            setTimeout(updateSrcAndPlay, 100);
          } else {
            updateSrcAndPlay();
          }
        }, 100);
      } catch (e) {}
    }
  },
  pause: function () {
    this.getPlayerElement();
    this.parent_pause();
    if (this.playerElement) {
      if (!this.playerElement.paused) {
        this.playerElement.pause();
      }
    }
  },
  play: function () {
    this.getPlayerElement();
    this.parent_play();
    if (this.playerElement && this.playerElement.play) {
      if (this.playerElement.paused) {
        this.playerElement.play();
      }
      this.monitor();
    }
  },
  stop: function () {
    if (this.playerElement) {
      $j(this.playerElement).unbind();
    }
    this.parent_stop();
  },
  toggleMute: function () {
    this.parent_toggleMute();
    this.getPlayerElement();
    if (this.playerElement) this.playerElement.muted = this.muted;
  },
  setPlayerElementVolume: function (percentage) {
    if (this.getPlayerElement()) {
      if (percentage != 0) {
        this.playerElement.muted = false;
      }
      this.playerElement.volume = percentage;
    }
  },
  getPlayerElementVolume: function () {
    if (this.getPlayerElement()) {
      return this.playerElement.volume;
    }
  },
  getPlayerElementMuted: function () {
    if (this.getPlayerElement()) {
      return this.playerElement.muted;
    }
  },
  getNativeDuration: function () {
    if (this.playerElement) {
      return this.playerElement.duration;
    }
  },
  load: function (callback) {
    this.getPlayerElement();
    if (!this.playerElement) {
      this.onlyLoadFlag = true;
      this.doEmbedHTML();
      this.onLoadedCallback = callback;
    } else {
      this.playerElement.load();
      if (callback) callback();
    }
  },
  getPlayerElement: function () {
    this.playerElement = $j("#" + this.pid).get(0);
    return this.playerElement;
  },
  onseeking: function () {
    if (!this.seeking) {
      this.seeking = true;
      this.controlBuilder.onSeek();
      $j(this).trigger("seeking");
    }
  },
  onseeked: function () {
    if (this.seeking) {
      this.seeking = false;
      $j(this).trigger("seeked");
    }
    this.seeking = false;
  },
  onpause: function () {
    if (this._propagateEvents) {
      this.parent_pause();
    }
  },
  onplay: function () {
    if (this._propagateEvents) {
      this.parent_play();
    }
  },
  onloadedmetadata: function () {
    this.getPlayerElement();
    if (this.playerElement && !isNaN(this.playerElement.duration)) {
      this.duration = this.playerElement.duration;
    }
    if (typeof this.onLoadedCallback == "function") {
      this.onLoadedCallback();
    }
    if (!this.mediaLoadedFlag) {
      $j(this).trigger("mediaLoaded");
      this.mediaLoadedFlag = true;
    }
  },
  onprogress: function (event) {
    var e = event.originalEvent;
    if (e && e.loaded && e.total) {
      this.bufferedPercent = e.loaded / e.total;
      this.progressEventData = e.loaded;
    }
  },
  onended: function () {
    var _this = this;
    if (this._propagateEvents) {
      this.onClipDone();
    }
  },
};
window.cortadoDomainLocations = {
  "upload.wikimedia.org": "http://upload.wikimedia.org/jars/cortado.jar",
};
mw.setDefaultConfig(
  "relativeCortadoAppletPath",
  mw.getMwEmbedPath() +
    "modules/EmbedPlayer/binPlayers/cortado/cortado-ovtk-stripped-0.6.0.jar"
);
mw.EmbedPlayerJava = {
  instanceOf: "Java",
  supports: {
    playHead: true,
    pause: true,
    stop: true,
    fullscreen: false,
    timeDisplay: true,
    volumeControl: false,
  },
  doEmbedHTML: function () {
    var _this = this;
    var appletCode =
      "" +
      '<applet id="' +
      this.pid +
      '" code="com.fluendo.player.Cortado.class" ' +
      'archive="' +
      this.getAppletLocation() +
      '" width="' +
      parseInt(this.getWidth()) +
      '" ' +
      'height="' +
      parseInt(this.getHeight()) +
      '"> ' +
      "\n" +
      '<param name="url" value="' +
      this.getSrc() +
      '" /> ' +
      "\n" +
      '<param name="local" value="false"/>' +
      "\n" +
      '<param name="keepaspect" value="true" />' +
      "\n" +
      '<param name="video" value="true" />' +
      "\n" +
      '<param name="showStatus" value="hide" />' +
      "\n" +
      '<param name="audio" value="true" />' +
      "\n" +
      '<param name="seekable" value="true" />' +
      "\n";
    if (this.getDuration()) {
      appletCode +=
        '<param name="duration" value="' +
        parseFloat(this.getDuration()) +
        '" />' +
        "\n";
    }
    appletCode +=
      '<param name="BufferSize" value="4096" />' +
      '<param name="BufferHigh" value="25">' +
      '<param name="BufferLow" value="5">' +
      "</applet>";
    $j(this).html(appletCode);
    _this.monitor();
  },
  getAppletLocation: function () {
    var mediaSrc = this.getSrc();
    var appletLoc = false;
    if (
      !mw.isLocalDomain(mediaSrc) ||
      !mw.isLocalDomain(
        mw.getMwEmbedPath() ||
          mw.getConfig("relativeCortadoAppletPath") === false
      )
    ) {
      if (window.cortadoDomainLocations[mw.parseUri(mediaSrc).host]) {
        appletLoc = window.cortadoDomainLocations[mw.parseUri(mediaSrc).host];
      } else {
        appletLoc = "http://theora.org/cortado.jar";
      }
    } else {
      appletLoc = mw.getConfig("relativeCortadoAppletPath");
    }
    return appletLoc;
  },
  getPlayerElementTime: function () {
    this.getPlayerElement();
    var currentTime = 0;
    if (this.playerElement) {
      try {
        currentTime = this.playerElement.currentTime;
      } catch (e) {}
    } else {
    }
    return currentTime;
  },
  doSeek: function (percentage) {
    this.getPlayerElement();
    if (this.supportsURLTimeEncoding()) {
      this.parent_doSeek(percentage);
    } else if (this.playerElement) {
      this.playerElement.currentTime =
        percentage * parseFloat(this.getDuration());
    } else {
      this.doPlayThenSeek(percentage);
    }
    this.controlBuilder.onSeek();
  },
  doPlayThenSeek: function (percentage) {
    var _this = this;
    this.play();
    var rfsCount = 0;
    var readyForSeek = function () {
      _this.getPlayerElement();
      if (_this.playerElement) {
        _this.doSeek(perc);
      } else {
        if (rfsCount < 200) {
          setTimeout(readyForSeek, 50);
          rfsCount++;
        } else {
        }
      }
    };
    readyForSeek();
  },
  getPlayerElement: function () {
    if (!$j("#" + this.pid).length) {
      return false;
    }
    this.playerElement = $j("#" + this.pid).get(0);
    return this.playerElement;
  },
  play: function () {
    this.getPlayerElement();
    this.parent_play();
    if (this.playerElement) {
      try {
        this.playerElement.play();
      } catch (e) {}
    }
  },
  pause: function () {
    this.getPlayerElement();
    this.parent_pause();
    if (this.playerElement) {
      this.playerElement.pause();
    }
  },
};
mw.EmbedPlayerVlc = {
  instanceOf: "Vlc",
  supports: {
    playHead: true,
    pause: true,
    stop: true,
    fullscreen: true,
    timeDisplay: true,
    volumeControl: true,
    playlist_driver: true,
    overlay: false,
  },
  prevState: 0,
  waitForVlcCount: 0,
  vlcCurrentTime: 0,
  doEmbedHTML: function () {
    var _this = this;
    $j(this).html(
      '<object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" ' +
        'codebase="http://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab#Version=0,8,6,0" ' +
        'id="' +
        this.pid +
        '" events="True" height="' +
        this.getPlayerHeight() +
        '" width="' +
        this.getPlayerWidth() +
        '"' +
        ">" +
        '<param name="MRL" value="">' +
        '<param name="ShowDisplay" value="True">' +
        '<param name="AutoLoop" value="False">' +
        '<param name="AutoPlay" value="False">' +
        '<param name="Volume" value="50">' +
        '<param name="StartTime" value="0">' +
        '<embed pluginspage="http://www.videolan.org" type="application/x-vlc-plugin" ' +
        'progid="VideoLAN.VLCPlugin.2" name="' +
        this.pid +
        '" ' +
        'height="' +
        this.getHeight() +
        '" width="' +
        this.getWidth() +
        '" ' +
        'style="width:' +
        this.getWidth() +
        "px;height:" +
        this.getHeight() +
        'px;" ' +
        ">" +
        "</object>"
    );
    this.waitForVlcCount = 0;
    setTimeout(function () {
      _this.postEmbedJS();
    }, 150);
  },
  postEmbedJS: function () {
    var _this = this;
    this.getPlayerElement();
    if (this.playerElement && this.playerElement.playlist) {
      this.playerElement.style.width = this.getWidth();
      this.playerElement.style.height = this.getHeight();
      this.playerElement.playlist.items.clear();
      var src = mw.absoluteUrl(this.getSrc());
      var itemId = this.playerElement.playlist.add(src);
      if (itemId != -1) {
        this.playerElement.playlist.playItem(itemId);
      } else {
      }
      setTimeout(function () {
        _this.monitor();
      }, 100);
    } else {
      this.waitForVlcCount++;
      if (this.waitForVlcCount < 10) {
        setTimeout(function () {
          _this.postEmbedJS();
        }, 100);
      } else {
      }
    }
  },
  doSeek: function (percent) {
    this.getPlayerElement();
    if (this.supportsURLTimeEncoding()) {
      this.parent_doSeek(percent);
    } else if (this.playerElement) {
      this.seeking = true;
      if (
        this.playerElement.input.state == 3 &&
        this.playerElement.input.position != percent
      ) {
        this.playerElement.input.position = percent;
        this.controlBuilder.setStatus("seeking...");
      }
    } else {
      this.doPlayThenSeek(percent);
    }
    this.parent_monitor();
  },
  doPlayThenSeek: function (percent) {
    var _this = this;
    this.play();
    var rfsCount = 0;
    var readyForSeek = function () {
      _this.getPlayerElement();
      var newState = _this.playerElement.input.state;
      if (newState == 3) {
        _this.doSeek(percent);
      } else {
        if (rfsCount < 200) {
          setTimeout(readyForSeek, 50);
          rfsCount++;
        } else {
        }
      }
    };
    readyForSeek();
  },
  monitor: function () {
    this.getPlayerElement();
    if (!this.playerElement) return;
    try {
      if (this.playerElement.log.messages.count > 0) {
        var iter = this.playerElement.log.messages.iterator();
        while (iter.hasNext) {
          var msg = iter.next();
          var msgtype = msg.type.toString();
          if (msg.severity == 1 && msgtype == "input") {
          }
        }
        this.playerElement.log.messages.clear();
      }
      var newState = this.playerElement.input.state;
      if (this.prevState != newState) {
        if (newState == 0) {
          this.onStop();
        } else if (newState == 1) {
          this.onOpen();
        } else if (newState == 2) {
          this.onBuffer();
        } else if (newState == 3) {
          this.onPlay();
        } else if (this.playerElement.input.state == 4) {
          this.onPause();
        }
        this.prevState = newState;
      } else if (newState == 3) {
        this.onPlaying();
      }
    } catch (e) {}
    this.parent_monitor();
  },
  onOpen: function () {
    this.controlBuilder.setStatus("Opening...");
  },
  onBuffer: function () {
    this.controlBuilder.setStatus("Buffering...");
  },
  onPlay: function () {
    this.onPlaying();
  },
  onPlaying: function () {
    this.seeking = false;
    if (!this.getDuration() && this.playerElement.input.length > 0) {
      this.duration = this.playerElement.input.length / 1000;
    }
    this.vlcCurrentTime = this.playerElement.input.time / 1000;
  },
  getPlayerElementTime: function () {
    return this.vlcCurrentTime;
  },
  onPause: function () {
    this.parent_pause();
  },
  onStop: function () {
    if (!this.seeking) this.onClipDone();
  },
  play: function () {
    this.parent_play();
    if (this.getPlayerElement()) {
      if (this.playerElement.log) {
        this.playerElement.log.messages.clear();
      }
      if (
        this.playerElement.playlist &&
        typeof this.playerElement.playlist.play == "function"
      )
        this.playerElement.playlist.play();
      if (typeof this.playerElement.play == "function")
        this.playerElement.play();
      this.paused = false;
      this.monitor();
    }
  },
  pause: function () {
    this.parent_pause();
    if (this.getPlayerElement()) {
      try {
        this.playerElement.playlist.togglePause();
      } catch (e) {}
    }
  },
  toggleMute: function () {
    this.parent_toggleMute();
    if (this.getPlayerElement()) this.playerElement.audio.toggleMute();
  },
  setPlayerElementVolume: function (percent) {
    if (this.getPlayerElement()) {
      this.playerElement.audio.volume = percent * 100;
    }
  },
  getVolumen: function () {
    if (this.getPlayerElement()) return this.playerElement.audio.volume / 100;
  },
  fullscreen: function () {
    if (this.playerElement) {
      if (this.playerElement.video) {
        try {
          this.playerElement.video.toggleFullscreen();
        } catch (e) {}
      }
    }
  },
  getPlayerElement: function () {
    this.playerElement = $j("#" + this.pid).get(0);
    return this.playerElement;
  },
};
function jsInterfaceReadyFunc() {
  return true;
}
mw.EmbedPlayerKplayer = {
  instanceOf: "Kplayer",
  supports: {
    playHead: true,
    pause: true,
    stop: true,
    timeDisplay: true,
    volumeControl: true,
    overlays: true,
    fullscreen: true,
  },
  flashCurrentTime: 0,
  doEmbedHTML: function () {
    var _this = this;
    var flashvars = {};
    flashvars.autoPlay = "true";
    var playerPath =
      mw.getMwEmbedPath() + "modules/EmbedPlayer/binPlayers/kaltura-player";
    flashvars.entryId = mw.absoluteUrl(_this.getSrc());
    if (mw.parseUri(document.URL).protocol == "file") {
      playerPath =
        mw.getRelativeMwEmbedPath() +
        "modules/EmbedPlayer/binPlayers/kaltura-player";
      flashvars.entryId = _this.getSrc();
    }
    flashvars.debugMode = "true";
    flashvars.fileSystemMode = "true";
    flashvars.widgetId = "_7463";
    flashvars.partnerId = "7463";
    flashvars.pluginDomain = "kdp3/plugins/";
    flashvars.kml = "local";
    flashvars.kmlPath = playerPath + "/config.xml";
    flashvars.sourceType = "url";
    flashvars.externalInterfaceDisabled = "false";
    flashvars.skinPath = playerPath + "/skin.swf";
    flashvars["full.skinPath"] = playerPath + "/LightDoodleskin.swf";
    var params = {};
    params.quality = "best";
    params.wmode = "opaque";
    params.allowfullscreen = "true";
    params.allowscriptaccess = "always";
    var attributes = {};
    attributes.id = this.pid;
    attributes.name = this.pid;
    $j(this).html($j("<div />").attr("id", this.pid + "_container"));
    swfobject.callDomLoadFunctions();
    swfobject.embedSWF(
      playerPath + "/kdp3.swf",
      this.pid + "_container",
      "100%",
      "100%",
      "10.0.0",
      playerPath + "/expressInstall.swf",
      flashvars,
      params,
      attributes
    );
    setTimeout(function () {
      _this.postEmbedJS();
    }, 100);
    $j(_this).bind("onOpenFullScreen", function () {
      _this.postEmbedJS();
    });
    $j(_this).bind("onCloseFullScreen", function () {
      _this.postEmbedJS();
    });
  },
  postEmbedJS: function () {
    var _this = this;
    this.getPlayerElement();
    var bindEventMap = {
      doPause: "onPause",
      doPlay: "onPlay",
      durationChange: "onDurationChange",
      playerPlayEnd: "onClipDone",
      playerUpdatePlayhead: "onUpdatePlayhead",
      bytesTotalChange: "onBytesTotalChange",
      bytesDownloadedChange: "onBytesDownloadedChange",
    };
    if (this.playerElement && this.playerElement.addJsListener) {
      $j.each(bindEventMap, function (bindName, localMethod) {
        _this.bindPlayerFunction(bindName, localMethod);
      });
      this.monitor();
    } else {
      setTimeout(function () {
        _this.postEmbedJS();
      }, 250);
    }
  },
  bindPlayerFunction: function (bindName, methodName) {
    var gKdpCallbackName = methodName + "_cb_" + this.id;
    var createGlobalCB = (function (cName, embedPlayer) {
      window[cName] = function (data) {
        if (embedPlayer._propagateEvents) {
          embedPlayer[methodName](data);
        }
      };
    })(gKdpCallbackName, this);
    this.playerElement.addJsListener(bindName, gKdpCallbackName);
  },
  onPause: function () {
    this.parent_pause();
  },
  onPlay: function () {
    this.parent_play();
  },
  onDurationChange: function (data, id) {
    this.duration = data.newValue;
  },
  play: function () {
    if (this.playerElement && this.playerElement.sendNotification) {
      this.playerElement.sendNotification("doPlay");
    }
    this.parent_play();
  },
  pause: function () {
    if (this.playerElement && this.playerElement.sendNotification) {
      this.playerElement.sendNotification("doPause");
    }
    this.parent_pause();
  },
  doSeek: function (percentage) {
    var _this = this;
    var seekTime = percentage * this.getDuration();
    if (this.supportsURLTimeEncoding()) {
      if (
        !(
          percentage < this.bufferedPercent &&
          this.playerElement.duration &&
          !this.didSeekJump
        )
      ) {
        this.parent_doSeek(percentage);
        return;
      }
    }
    if (this.playerElement) {
      this.playerElement.sendNotification("doSeek", seekTime);
      setTimeout(function () {
        _this.seeking = false;
      }, 500);
    } else {
      this.doPlayThenSeek(percentage);
    }
    this.controlBuilder.onSeek();
  },
  doPlayThenSeek: function (percentage) {
    var _this = this;
    this.play();
    _this.seeking = true;
    var getPlayerCount = 0;
    var readyForSeek = function () {
      _this.getPlayerElement();
      if (
        _this.playerElement &&
        _this.playerElement.sendNotification &&
        _this.getDuration() &&
        _this.bufferedPercent
      ) {
        var seekTime = percentage * _this.getDuration();
        _this.playerElement.sendNotification("doSeek", seekTime);
      } else {
        if (getPlayerCount < 400) {
          setTimeout(readyForSeek, 50);
          getPlayerCount++;
        } else {
        }
      }
    };
    readyForSeek();
  },
  setPlayerElementVolume: function (percentage) {
    if (this.playerElement && this.playerElement.sendNotification) {
      this.playerElement.sendNotification("changeVolume", percentage);
    }
  },
  onUpdatePlayhead: function (playheadValue) {
    this.flashCurrentTime = playheadValue;
  },
  onBytesTotalChange: function (data, id) {
    this.bytesTotal = data.newValue;
  },
  onBytesDownloadedChange: function (data, id) {
    this.bytesLoaded = data.newValue;
    this.bufferedPercent = this.bytesLoaded / this.bytesTotal;
    $j(this).trigger("progress", {
      loaded: this.bytesLoaded,
      total: this.bytesTotal,
    });
  },
  getPlayerElementTime: function () {
    return this.flashCurrentTime;
  },
  getPlayerElement: function () {
    this.playerElement = document.getElementById(this.pid);
    return this.playerElement;
  },
};
function onKdpReady(playerId) {}
var swfobject = (function () {
  var UNDEF = "undefined",
    OBJECT = "object",
    SHOCKWAVE_FLASH = "Shockwave Flash",
    SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
    FLASH_MIME_TYPE = "application/x-shockwave-flash",
    EXPRESS_INSTALL_ID = "SWFObjectExprInst",
    ON_READY_STATE_CHANGE = "onreadystatechange",
    win = window,
    doc = document,
    nav = navigator,
    plugin = false,
    domLoadFnArr = [main],
    regObjArr = [],
    objIdArr = [],
    listenersArr = [],
    storedAltContent,
    storedAltContentId,
    storedCallbackFn,
    storedCallbackObj,
    isDomLoaded = false,
    isExpressInstallActive = false,
    dynamicStylesheet,
    dynamicStylesheetMedia,
    autoHideShow = true,
    ua = (function () {
      var w3cdom =
          typeof doc.getElementById != UNDEF &&
          typeof doc.getElementsByTagName != UNDEF &&
          typeof doc.createElement != UNDEF,
        u = nav.userAgent.toLowerCase(),
        p = nav.platform.toLowerCase(),
        windows = p ? /win/.test(p) : /win/.test(u),
        mac = p ? /mac/.test(p) : /mac/.test(u),
        webkit = /webkit/.test(u)
          ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1"))
          : false,
        ie = !+"\v1",
        playerVersion = [0, 0, 0],
        d = null;
      if (
        typeof nav.plugins != UNDEF &&
        typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT
      ) {
        d = nav.plugins[SHOCKWAVE_FLASH].description;
        if (
          d &&
          !(
            typeof nav.mimeTypes != UNDEF &&
            nav.mimeTypes[FLASH_MIME_TYPE] &&
            !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin
          )
        ) {
          plugin = true;
          ie = false;
          d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
          playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
          playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
          playerVersion[2] = /[a-zA-Z]/.test(d)
            ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10)
            : 0;
        }
      } else if (typeof win.ActiveXObject != UNDEF) {
        try {
          var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
          if (a) {
            d = a.GetVariable("$version");
            if (d) {
              ie = true;
              d = d.split(" ")[1].split(",");
              playerVersion = [
                parseInt(d[0], 10),
                parseInt(d[1], 10),
                parseInt(d[2], 10),
              ];
            }
          }
        } catch (e) {}
      }
      return {
        w3: w3cdom,
        pv: playerVersion,
        wk: webkit,
        ie: ie,
        win: windows,
        mac: mac,
      };
    })();
  function callDomLoadFunctions() {
    if (isDomLoaded) {
      return;
    }
    try {
      var t = doc
        .getElementsByTagName("body")[0]
        .appendChild(createElement("span"));
      t.parentNode.removeChild(t);
    } catch (e) {
      return;
    }
    isDomLoaded = true;
    var dl = domLoadFnArr.length;
    for (var i = 0; i < dl; i++) {
      domLoadFnArr[i]();
    }
  }
  function addDomLoadEvent(fn) {
    if (isDomLoaded) {
      fn();
    } else {
      domLoadFnArr[domLoadFnArr.length] = fn;
    }
  }
  function addLoadEvent(fn) {
    if (typeof win.addEventListener != UNDEF) {
      win.addEventListener("load", fn, false);
    } else if (typeof doc.addEventListener != UNDEF) {
      doc.addEventListener("load", fn, false);
    } else if (typeof win.attachEvent != UNDEF) {
      addListener(win, "onload", fn);
    } else if (typeof win.onload == "function") {
      var fnOld = win.onload;
      win.onload = function () {
        fnOld();
        fn();
      };
    } else {
      win.onload = fn;
    }
  }
  function main() {
    if (plugin) {
      testPlayerVersion();
    } else {
      matchVersions();
    }
  }
  function testPlayerVersion() {
    var b = doc.getElementsByTagName("body")[0];
    var o = createElement(OBJECT);
    o.setAttribute("type", FLASH_MIME_TYPE);
    var t = b.appendChild(o);
    if (t) {
      var counter = 0;
      (function () {
        if (typeof t.GetVariable != UNDEF) {
          try {
            var d = t.GetVariable("$version");
            if (d) {
              d = d.split(" ")[1].split(",");
              ua.pv = [
                parseInt(d[0], 10),
                parseInt(d[1], 10),
                parseInt(d[2], 10),
              ];
            }
          } catch (e) {}
        } else if (counter < 10) {
          counter++;
          setTimeout(arguments.callee, 10);
          return;
        }
        b.removeChild(o);
        t = null;
        matchVersions();
      })();
    } else {
      matchVersions();
    }
  }
  function matchVersions() {
    var rl = regObjArr.length;
    if (rl > 0) {
      for (var i = 0; i < rl; i++) {
        var id = regObjArr[i].id;
        var cb = regObjArr[i].callbackFn;
        var cbObj = { success: false, id: id };
        if (ua.pv[0] > 0) {
          var obj = getElementById(id);
          if (obj) {
            if (
              hasPlayerVersion(regObjArr[i].swfVersion) &&
              !(ua.wk && ua.wk < 312)
            ) {
              setVisibility(id, true);
              if (cb) {
                cbObj.success = true;
                cbObj.ref = getObjectById(id);
                cb(cbObj);
              }
            } else if (regObjArr[i].expressInstall && canExpressInstall()) {
              var att = {};
              att.data = regObjArr[i].expressInstall;
              att.width = obj.getAttribute("width") || "0";
              att.height = obj.getAttribute("height") || "0";
              if (obj.getAttribute("class")) {
                att.styleclass = obj.getAttribute("class");
              }
              if (obj.getAttribute("align")) {
                att.align = obj.getAttribute("align");
              }
              var par = {};
              var p = obj.getElementsByTagName("param");
              var pl = p.length;
              for (var j = 0; j < pl; j++) {
                if (p[j].getAttribute("name").toLowerCase() != "movie") {
                  par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                }
              }
              showExpressInstall(att, par, id, cb);
            } else {
              displayAltContent(obj);
              if (cb) {
                cb(cbObj);
              }
            }
          }
        } else {
          setVisibility(id, true);
          if (cb) {
            var o = getObjectById(id);
            if (o && typeof o.SetVariable != UNDEF) {
              cbObj.success = true;
              cbObj.ref = o;
            }
            cb(cbObj);
          }
        }
      }
    }
  }
  function getObjectById(objectIdStr) {
    var r = null;
    var o = getElementById(objectIdStr);
    if (o && o.nodeName == "OBJECT") {
      if (typeof o.SetVariable != UNDEF) {
        r = o;
      } else {
        var n = o.getElementsByTagName(OBJECT)[0];
        if (n) {
          r = n;
        }
      }
    }
    return r;
  }
  function canExpressInstall() {
    return (
      !isExpressInstallActive &&
      hasPlayerVersion("6.0.65") &&
      (ua.win || ua.mac) &&
      !(ua.wk && ua.wk < 312)
    );
  }
  function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
    isExpressInstallActive = true;
    storedCallbackFn = callbackFn || null;
    storedCallbackObj = { success: false, id: replaceElemIdStr };
    var obj = getElementById(replaceElemIdStr);
    if (obj) {
      if (obj.nodeName == "OBJECT") {
        storedAltContent = abstractAltContent(obj);
        storedAltContentId = null;
      } else {
        storedAltContent = obj;
        storedAltContentId = replaceElemIdStr;
      }
      att.id = EXPRESS_INSTALL_ID;
      if (
        typeof att.width == UNDEF ||
        (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)
      ) {
        att.width = "310";
      }
      if (
        typeof att.height == UNDEF ||
        (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)
      ) {
        att.height = "137";
      }
      doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
      var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
        fv =
          "MMredirectURL=" +
          win.location.toString().replace(/&/g, "%26") +
          "&MMplayerType=" +
          pt +
          "&MMdoctitle=" +
          doc.title;
      if (typeof par.flashvars != UNDEF) {
        par.flashvars += "&" + fv;
      } else {
        par.flashvars = fv;
      }
      if (ua.ie && ua.win && obj.readyState != 4) {
        var newObj = createElement("div");
        replaceElemIdStr += "SWFObjectNew";
        newObj.setAttribute("id", replaceElemIdStr);
        obj.parentNode.insertBefore(newObj, obj);
        obj.style.display = "none";
        (function () {
          if (obj.readyState == 4) {
            obj.parentNode.removeChild(obj);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      }
      createSWF(att, par, replaceElemIdStr);
    }
  }
  function displayAltContent(obj) {
    if (ua.ie && ua.win && obj.readyState != 4) {
      var el = createElement("div");
      obj.parentNode.insertBefore(el, obj);
      el.parentNode.replaceChild(abstractAltContent(obj), el);
      obj.style.display = "none";
      (function () {
        if (obj.readyState == 4) {
          obj.parentNode.removeChild(obj);
        } else {
          setTimeout(arguments.callee, 10);
        }
      })();
    } else {
      obj.parentNode.replaceChild(abstractAltContent(obj), obj);
    }
  }
  function abstractAltContent(obj) {
    var ac = createElement("div");
    if (ua.win && ua.ie) {
      ac.innerHTML = obj.innerHTML;
    } else {
      var nestedObj = obj.getElementsByTagName(OBJECT)[0];
      if (nestedObj) {
        var c = nestedObj.childNodes;
        if (c) {
          var cl = c.length;
          for (var i = 0; i < cl; i++) {
            if (
              !(c[i].nodeType == 1 && c[i].nodeName == "PARAM") &&
              !(c[i].nodeType == 8)
            ) {
              ac.appendChild(c[i].cloneNode(true));
            }
          }
        }
      }
    }
    return ac;
  }
  function createSWF(attObj, parObj, id) {
    var r,
      el = getElementById(id);
    if (ua.wk && ua.wk < 312) {
      return r;
    }
    if (el) {
      if (typeof attObj.id == UNDEF) {
        attObj.id = id;
      }
      if (ua.ie && ua.win) {
        var att = "";
        for (var i in attObj) {
          if (attObj[i] != Object.prototype[i]) {
            if (i.toLowerCase() == "data") {
              parObj.movie = attObj[i];
            } else if (i.toLowerCase() == "styleclass") {
              att += ' class="' + attObj[i] + '"';
            } else if (i.toLowerCase() != "classid") {
              att += " " + i + '="' + attObj[i] + '"';
            }
          }
        }
        var par = "";
        for (var j in parObj) {
          if (parObj[j] != Object.prototype[j]) {
            par += '<param name="' + j + '" value="' + parObj[j] + '" />';
          }
        }
        el.outerHTML =
          '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
          att +
          ">" +
          par +
          "</object>";
        objIdArr[objIdArr.length] = attObj.id;
        r = getElementById(attObj.id);
      } else {
        var o = createElement(OBJECT);
        o.setAttribute("type", FLASH_MIME_TYPE);
        for (var m in attObj) {
          if (attObj[m] != Object.prototype[m]) {
            if (m.toLowerCase() == "styleclass") {
              o.setAttribute("class", attObj[m]);
            } else if (m.toLowerCase() != "classid") {
              o.setAttribute(m, attObj[m]);
            }
          }
        }
        for (var n in parObj) {
          if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") {
            createObjParam(o, n, parObj[n]);
          }
        }
        el.parentNode.replaceChild(o, el);
        r = o;
      }
    }
    return r;
  }
  function createObjParam(el, pName, pValue) {
    var p = createElement("param");
    p.setAttribute("name", pName);
    p.setAttribute("value", pValue);
    el.appendChild(p);
  }
  function removeSWF(id) {
    var obj = getElementById(id);
    if (obj && obj.nodeName == "OBJECT") {
      if (ua.ie && ua.win) {
        obj.style.display = "none";
        (function () {
          if (obj.readyState == 4) {
            removeObjectInIE(id);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      } else {
        obj.parentNode.removeChild(obj);
      }
    }
  }
  function removeObjectInIE(id) {
    var obj = getElementById(id);
    if (obj) {
      for (var i in obj) {
        if (typeof obj[i] == "function") {
          obj[i] = null;
        }
      }
      obj.parentNode.removeChild(obj);
    }
  }
  function getElementById(id) {
    var el = null;
    try {
      el = doc.getElementById(id);
    } catch (e) {}
    return el;
  }
  function createElement(el) {
    return doc.createElement(el);
  }
  function addListener(target, eventType, fn) {
    target.attachEvent(eventType, fn);
    listenersArr[listenersArr.length] = [target, eventType, fn];
  }
  function hasPlayerVersion(rv) {
    var pv = ua.pv,
      v = rv.split(".");
    v[0] = parseInt(v[0], 10);
    v[1] = parseInt(v[1], 10) || 0;
    v[2] = parseInt(v[2], 10) || 0;
    return pv[0] > v[0] ||
      (pv[0] == v[0] && pv[1] > v[1]) ||
      (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])
      ? true
      : false;
  }
  function createCSS(sel, decl, media, newStyle) {
    if (ua.ie && ua.mac) {
      return;
    }
    var h = doc.getElementsByTagName("head")[0];
    if (!h) {
      return;
    }
    var m = media && typeof media == "string" ? media : "screen";
    if (newStyle) {
      dynamicStylesheet = null;
      dynamicStylesheetMedia = null;
    }
    if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
      var s = createElement("style");
      s.setAttribute("type", "text/css");
      s.setAttribute("media", m);
      dynamicStylesheet = h.appendChild(s);
      if (
        ua.ie &&
        ua.win &&
        typeof doc.styleSheets != UNDEF &&
        doc.styleSheets.length > 0
      ) {
        dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
      }
      dynamicStylesheetMedia = m;
    }
    if (ua.ie && ua.win) {
      if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
        dynamicStylesheet.addRule(sel, decl);
      }
    } else {
      if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
        dynamicStylesheet.appendChild(
          doc.createTextNode(sel + " {" + decl + "}")
        );
      }
    }
  }
  function setVisibility(id, isVisible) {
    if (!autoHideShow) {
      return;
    }
    var v = isVisible ? "visible" : "hidden";
    if (isDomLoaded && getElementById(id)) {
      getElementById(id).style.visibility = v;
    } else {
      createCSS("#" + id, "visibility:" + v);
    }
  }
  function urlEncodeIfNecessary(s) {
    var regex = /[\\\"<>\.;]/;
    var hasBadChars = regex.exec(s) != null;
    return hasBadChars && typeof encodeURIComponent != UNDEF
      ? encodeURIComponent(s)
      : s;
  }
  var cleanup = (function () {
    if (ua.ie && ua.win) {
      window.attachEvent("onunload", function () {
        var ll = listenersArr.length;
        for (var i = 0; i < ll; i++) {
          listenersArr[i][0].detachEvent(
            listenersArr[i][1],
            listenersArr[i][2]
          );
        }
        var il = objIdArr.length;
        for (var j = 0; j < il; j++) {
          removeSWF(objIdArr[j]);
        }
        for (var k in ua) {
          ua[k] = null;
        }
        ua = null;
        for (var l in swfobject) {
          swfobject[l] = null;
        }
        swfobject = null;
      });
    }
  })();
  return {
    registerObject: function (
      objectIdStr,
      swfVersionStr,
      xiSwfUrlStr,
      callbackFn
    ) {
      if (ua.w3 && objectIdStr && swfVersionStr) {
        var regObj = {};
        regObj.id = objectIdStr;
        regObj.swfVersion = swfVersionStr;
        regObj.expressInstall = xiSwfUrlStr;
        regObj.callbackFn = callbackFn;
        regObjArr[regObjArr.length] = regObj;
        setVisibility(objectIdStr, false);
      } else if (callbackFn) {
        callbackFn({ success: false, id: objectIdStr });
      }
    },
    getObjectById: function (objectIdStr) {
      if (ua.w3) {
        return getObjectById(objectIdStr);
      }
    },
    callDomLoadFunctions: function () {
      callDomLoadFunctions();
    },
    embedSWF: function (
      swfUrlStr,
      replaceElemIdStr,
      widthStr,
      heightStr,
      swfVersionStr,
      xiSwfUrlStr,
      flashvarsObj,
      parObj,
      attObj,
      callbackFn
    ) {
      var callbackObj = { success: false, id: replaceElemIdStr };
      if (
        ua.w3 &&
        !(ua.wk && ua.wk < 312) &&
        swfUrlStr &&
        replaceElemIdStr &&
        widthStr &&
        heightStr &&
        swfVersionStr
      ) {
        setVisibility(replaceElemIdStr, false);
        addDomLoadEvent(function () {
          widthStr += "";
          heightStr += "";
          var att = {};
          if (attObj && typeof attObj === OBJECT) {
            for (var i in attObj) {
              att[i] = attObj[i];
            }
          }
          att.data = swfUrlStr;
          att.width = widthStr;
          att.height = heightStr;
          var par = {};
          if (parObj && typeof parObj === OBJECT) {
            for (var j in parObj) {
              par[j] = parObj[j];
            }
          }
          if (flashvarsObj && typeof flashvarsObj === OBJECT) {
            for (var k in flashvarsObj) {
              if (typeof par.flashvars != UNDEF) {
                par.flashvars += "&" + k + "=" + flashvarsObj[k];
              } else {
                par.flashvars = k + "=" + flashvarsObj[k];
              }
            }
          }
          if (hasPlayerVersion(swfVersionStr)) {
            var obj = createSWF(att, par, replaceElemIdStr);
            if (att.id == replaceElemIdStr) {
              setVisibility(replaceElemIdStr, true);
            }
            callbackObj.success = true;
            callbackObj.ref = obj;
          } else if (xiSwfUrlStr && canExpressInstall()) {
            att.data = xiSwfUrlStr;
            showExpressInstall(att, par, replaceElemIdStr, callbackFn);
            return;
          } else {
            setVisibility(replaceElemIdStr, true);
          }
          if (callbackFn) {
            callbackFn(callbackObj);
          }
        });
      } else if (callbackFn) {
        callbackFn(callbackObj);
      }
    },
    switchOffAutoHideShow: function () {
      autoHideShow = false;
    },
    ua: ua,
    getFlashPlayerVersion: function () {
      return { major: ua.pv[0], minor: ua.pv[1], release: ua.pv[2] };
    },
    hasFlashPlayerVersion: hasPlayerVersion,
    createSWF: function (attObj, parObj, replaceElemIdStr) {
      if (ua.w3) {
        return createSWF(attObj, parObj, replaceElemIdStr);
      } else {
        return undefined;
      }
    },
    showExpressInstall: function (att, par, replaceElemIdStr, callbackFn) {
      if (ua.w3 && canExpressInstall()) {
        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
      }
    },
    removeSWF: function (objElemIdStr) {
      if (ua.w3) {
        removeSWF(objElemIdStr);
      }
    },
    createCSS: function (selStr, declStr, mediaStr, newStyleBoolean) {
      if (ua.w3) {
        createCSS(selStr, declStr, mediaStr, newStyleBoolean);
      }
    },
    addDomLoadEvent: addDomLoadEvent,
    addLoadEvent: addLoadEvent,
    getQueryParamValue: function (param) {
      var q = doc.location.search || doc.location.hash;
      if (q) {
        if (/\?/.test(q)) {
          q = q.split("?")[1];
        }
        if (param == null) {
          return urlEncodeIfNecessary(q);
        }
        var pairs = q.split("&");
        for (var i = 0; i < pairs.length; i++) {
          if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
            return urlEncodeIfNecessary(
              pairs[i].substring(pairs[i].indexOf("=") + 1)
            );
          }
        }
      }
      return "";
    },
    expressInstallCallback: function () {
      if (isExpressInstallActive) {
        var obj = getElementById(EXPRESS_INSTALL_ID);
        if (obj && storedAltContent) {
          obj.parentNode.replaceChild(storedAltContent, obj);
          if (storedAltContentId) {
            setVisibility(storedAltContentId, true);
            if (ua.ie && ua.win) {
              storedAltContent.style.display = "block";
            }
          }
          if (storedCallbackFn) {
            storedCallbackFn(storedCallbackObj);
          }
        }
        isExpressInstallActive = false;
      }
    },
  };
})();
mw.EmbedPlayerGeneric = {
  supports: {
    playHead: false,
    pause: false,
    stop: true,
    fullscreen: false,
    timeDisplay: false,
    volumeControl: false,
  },
  instanceOf: "Generic",
  doEmbedHTML: function () {
    $j(this).html(
      '<object type="application/ogg" ' +
        'width="' +
        this.getWidth() +
        '" height="' +
        this.getHeight() +
        '" ' +
        'data="' +
        this.getSrc(this.seek_time_sec) +
        '"></object>'
    );
  },
};
(function ($) {
  $.cookie = function (name, value, options) {
    if (typeof value != "undefined") {
      options = options || {};
      if (value === null) {
        value = "";
        options = $.extend({}, options);
        options.expires = -1;
      }
      var expires = "";
      if (
        options.expires &&
        (typeof options.expires == "number" || options.expires.toUTCString)
      ) {
        var date;
        if (typeof options.expires == "number") {
          date = new Date();
          date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        } else {
          date = options.expires;
        }
        expires = "; expires=" + date.toUTCString();
      }
      var path = options.path ? "; path=" + options.path : "";
      var domain = options.domain ? "; domain=" + options.domain : "";
      var secure = options.secure ? "; secure" : "";
      document.cookie = [
        name,
        "=",
        encodeURIComponent(value),
        expires,
        path,
        domain,
        secure,
      ].join("");
    } else {
      var cookieValue = null;
      if (document.cookie && document.cookie != "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) == name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
  };
})(jQuery);
if (!this.JSON) {
  this.JSON = {};
}
(function () {
  function f(n) {
    return n < 10 ? "0" + n : n;
  }
  if (typeof Date.prototype.toJSON !== "function") {
    Date.prototype.toJSON = function (key) {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() +
            "-" +
            f(this.getUTCMonth() + 1) +
            "-" +
            f(this.getUTCDate()) +
            "T" +
            f(this.getUTCHours()) +
            ":" +
            f(this.getUTCMinutes()) +
            ":" +
            f(this.getUTCSeconds()) +
            "Z"
        : null;
    };
    String.prototype.toJSON =
      Number.prototype.toJSON =
      Boolean.prototype.toJSON =
        function (key) {
          return this.valueOf();
        };
  }
  var cx =
      /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable =
      /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\",
    },
    rep;
  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string)
      ? '"' +
          string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string"
              ? c
              : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
      : '"' + string + '"';
  }
  function str(key, holder) {
    var i,
      k,
      v,
      length,
      mind = gap,
      partial,
      value = holder[key];
    if (
      value &&
      typeof value === "object" &&
      typeof value.toJSON === "function"
    ) {
      value = value.toJSON(key);
    }
    if (typeof rep === "function") {
      value = rep.call(holder, key, value);
    }
    switch (typeof value) {
      case "string":
        return quote(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      case "null":
        return String(value);
      case "object":
        if (!value) {
          return "null";
        }
        gap += indent;
        partial = [];
        if (Object.prototype.toString.apply(value) === "[object Array]") {
          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || "null";
          }
          v =
            partial.length === 0
              ? "[]"
              : gap
              ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
              : "[" + partial.join(",") + "]";
          gap = mind;
          return v;
        }
        if (rep && typeof rep === "object") {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            k = rep[i];
            if (typeof k === "string") {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v);
              }
            }
          }
        } else {
          for (k in value) {
            if (Object.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v);
              }
            }
          }
        }
        v =
          partial.length === 0
            ? "{}"
            : gap
            ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
            : "{" + partial.join(",") + "}";
        gap = mind;
        return v;
    }
  }
  if (typeof JSON.stringify !== "function") {
    JSON.stringify = function (value, replacer, space) {
      var i;
      gap = "";
      indent = "";
      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " ";
        }
      } else if (typeof space === "string") {
        indent = space;
      }
      rep = replacer;
      if (
        replacer &&
        typeof replacer !== "function" &&
        (typeof replacer !== "object" || typeof replacer.length !== "number")
      ) {
        throw new Error("JSON.stringify");
      }
      return str("", { "": value });
    };
  }
  if (typeof JSON.parse !== "function") {
    JSON.parse = function (text, reviver) {
      var j;
      function walk(holder, key) {
        var k,
          v,
          value = holder[key];
        if (value && typeof value === "object") {
          for (k in value) {
            if (Object.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function (a) {
          return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      if (
        /^[\],:{}\s]*$/.test(
          text
            .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              "]"
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
        )
      ) {
        j = eval("(" + text + ")");
        return typeof reviver === "function" ? walk({ "": j }, "") : j;
      }
      throw new SyntaxError("JSON.parse");
    };
  }
})();
mw.addMessages({
  "mwe-timedtext-editor": "Timed text editor",
  "mwe-timedtext-stage-transcribe": "Transcribe",
  "mwe-timedtext-stage-sync": "Sync",
  "mwe-timedtext-stage-translate": "Translate",
  "mwe-timedtext-stage-upload": "Upload from local file",
  "mwe-timedtext-select-language": "Select language",
  "mwe-timedtext-file-language": "Subtitle file language",
  "mwe-timedtext-upload-text": "Upload text file",
  "mwe-timedtext-uploading-text": "Uploading text file",
  "mwe-timedtext-upload-text-desc-title": "Upload a text file",
  "mwe-timedtext-upload-text-desc-help":
    "The upload text file interface accepts .srt files",
  "mwe-timedtext-upload-text-desc-help-browse":
    "Browse your local computer for the .srt file you want to upload",
  "mwe-timedtext-upload-text-desc-help-select":
    "Select the language of the file",
  "mwe-timedtext-upload-text-desc-help-review":
    "Review / edit the text content and then press upload to add the text",
  "mwe-timedtext-upload-text-preview": "Review text",
  "mwe-timedtext-upload-text-success": "Upload of timed text was successful",
  "mwe-timedtext-upload-text-done": "Upload done",
  "mwe-timedtext-upload-text-fail-desc": "Upload was unsuccessful",
  "mwe-timedtext-upload-text-fail-title": "Upload failed",
  "mwe-timedtext-upload-text-another": "Upload another",
  "mwe-timedtext-upload-text-done-uploading": "Done uploading",
  "mwe-timedtext-back-btn": "Back",
  "mwe-timedtext-choose-text": "Choose text",
  "mwe-timedtext-upload-timed-text": "Upload subtitles",
  "mwe-timedtext-loading-text-edit": "Loading timed text editor",
  "mwe-timedtext-search": "Search clip",
  "mwe-timedtext-layout": "Layout",
  "mwe-timedtext-layout-ontop": "On top of video",
  "mwe-timedtext-layout-below": "Below video",
  "mwe-timedtext-layout-off": "Hide subtitles",
  "mwe-timedtext-loading-text": "Loading text ...",
  "mwe-timedtext-key-language": "$1, $2",
  "mwe-timedtext-textcat-cc": "Captions",
  "mwe-timedtext-textcat-sub": "Subtitles",
  "mwe-timedtext-textcat-tad": "Audio description",
  "mwe-timedtext-textcat-ktv": "Karaoke",
  "mwe-timedtext-textcat-tik": "Ticker text",
  "mwe-timedtext-textcat-ar": "Active regions",
  "mwe-timedtext-textcat-nb": "Annotation",
  "mwe-timedtext-textcat-meta": "Timed metadata",
  "mwe-timedtext-textcat-trx": "Transcript",
  "mwe-timedtext-textcat-lrc": "Lyrics",
  "mwe-timedtext-textcat-lin": "Linguistic markup",
  "mwe-timedtext-textcat-cue": "Cue points",
  "mwe-timedtext-language-subtitles-for-clip": "$1 subtitles for clip: $2",
  "mwe-timedtext-language-no-subtitles-for-clip":
    "No $1 subtitles where found for clip: $2",
  "mwe-timedtext-request-subs": "Request transcription",
  "mwe-timedtext-request-subs-desc":
    "Add a request for this video file to be transcribed",
  "mwe-timedtext-request-subs-done":
    "Transcription request added. [$1 See all transcribe requests]",
  "mwe-timedtext-request-subs-fail":
    "Failed to add transcription request, Are you logged in? ",
  "mwe-timedtext-request-already-done":
    "A transcription of this video has already been requested. [$1 See all transcribe requests]",
});
(function ($) {
  mw.TimedText = function (embedPlayer, options) {
    return this.init(embedPlayer, options);
  };
  mw.TimedText.prototype = {
    config: { layout: "ontop", userLanugage: "en", userCategory: "SUB" },
    enabledSources: null,
    currentLangKey: null,
    prevText: null,
    textSources: null,
    textSourceSetupFlag: null,
    textProviderId: "commons",
    validCategoriesKeys: [
      "CC",
      "SUB",
      "TAD",
      "KTV",
      "TIK",
      "AR",
      "NB",
      "META",
      "TRX",
      "LRC",
      "LIN",
      "CUE",
    ],
    timedTextExtMime: {
      srt: "text/x-srt",
      "mw-srt": "text/mw-srt",
      cmml: "text/cmml",
    },
    init: function (embedPlayer, options) {
      var _this = this;
      this.embedPlayer = embedPlayer;
      this.options = options;
      this.enabledSources = [];
      this.prevText = "";
      this.textSources = [];
      this.textSourceSetupFlag = false;
      if (typeof wgUserLanguage != "undefined") {
        this.config.userLanugage = wgUserLanguage;
      }
      preferenceConfig = mw.getUserConfig("timedTextConfig");
      if (typeof preferenceConfig == "object") {
        this.config = preferenceConfig;
      }
      $j(embedPlayer).bind(
        "addControlBarComponent",
        function (event, controlBar) {
          if (mw.isTimedTextSupported(embedPlayer)) {
            controlBar.supportedComponets["timedText"] = true;
            controlBar.components["timedText"] = _this.getTimedTextButton();
          }
        }
      );
      $j(embedPlayer).bind("monitorEvent", function () {
        _this.monitor();
      });
      $j(embedPlayer).bind("play", function () {
        _this.setupTextSources();
      });
      $j(embedPlayer).bind("onCloseFullScreen onOpenFullScreen", function () {
        var textOffset = _this.embedPlayer.controlBuilder.fullscreenMode
          ? 35
          : 15;
        embedPlayer.$interface
          .find(".track")
          .css(
            _this.getInterfaceSizeTextCss({
              width: embedPlayer.$interface.width(),
              height: embedPlayer.$interface.height(),
            })
          )
          .css({
            bottom:
              _this.embedPlayer.controlBuilder.getHeight() + textOffset + "px",
          });
      });
      $j(embedPlayer).bind("onResizePlayer", function (e, size, animate) {
        if (animate) {
          embedPlayer.$interface
            .find(".track")
            .animate(_this.getInterfaceSizeTextCss(size));
        } else {
          embedPlayer.$interface
            .find(".track")
            .css(_this.getInterfaceSizeTextCss(size));
        }
      });
      $j(embedPlayer).bind("onShowControlBar", function (event, layout) {
        embedPlayer.$interface.find(".track").stop().animate(layout, "fast");
      });
      $j(embedPlayer).bind("onHideControlBar", function (event, layout) {
        embedPlayer.$interface.find(".track").stop().animate(layout, "fast");
      });
    },
    getCurrentLangKey: function () {
      return this.currentLangKey;
    },
    getTimedTextButton: function () {
      var _this = this;
      return {
        w: 28,
        o: function (ctrlObj) {
          $textButton = $j("<div />")
            .attr("title", gM("mwe-embedplayer-timed_text"))
            .addClass(
              "ui-state-default ui-corner-all ui-icon_link rButton timed-text"
            )
            .append($j("<span />").addClass("ui-icon ui-icon-comment"))
            .buttonHover();
          _this.bindTextButton($textButton);
          return $textButton;
        },
      };
    },
    bindTextButton: function ($textButton) {
      var _this = this;
      $textButton.unbind("click.textMenu").bind("click.textMenu", function () {
        _this.showTextMenu();
      });
    },
    getInterfaceSizeTextCss: function (size) {
      return { "font-size": this.getInterfaceSizePercent(size) + "%" };
    },
    showTextMenu: function () {
      var embedPlayer = this.embedPlayer;
      var loc = embedPlayer.$interface.find(".rButton.timed-text").offset();
      var $menu = $j("#timedTextMenu_" + embedPlayer.id);
      if ($menu.length != 0) {
        if ($menu.is(":visible")) {
          $menu.hide("fast");
        } else {
          $menu.show("fast");
        }
      } else {
        $j("body").append(
          $j("<div>")
            .addClass("ui-widget ui-widget-content ui-corner-all")
            .attr("id", "timedTextMenu_" + embedPlayer.id)
            .css({
              position: "absolute",
              "z-index": 10,
              height: "180px",
              width: "180px",
              "font-size": "12px",
              display: "none",
            })
        );
        $j("#" + embedPlayer.id).timedText(
          "showMenu",
          "#timedTextMenu_" + embedPlayer.id
        );
      }
    },
    getInterfaceSizePercent: function (size) {
      var textSize = size.width / 5;
      if (textSize < 110) textSize = 110;
      if (textSize > 220) textSize = 220;
      return textSize;
    },
    setupTextSources: function (callback) {
      var _this = this;
      if (this.textSourceSetupFlag) {
        if (callback) {
          callback();
        }
        return;
      }
      this.textSourceSetupFlag = true;
      _this.loadTextSources(function () {
        _this.autoSelectSource();
        _this.loadEnabledSources();
        if (callback) {
          callback();
        }
      });
    },
    bindMenu: function (target, autoShow) {
      var _this = this;
      _this.menuTarget = target;
      var $menuButton = this.embedPlayer.$interface.find(".timed-text");
      var positionOpts = {};
      if (this.embedPlayer.supports["overlays"]) {
        var positionOpts = {
          directionV: "up",
          offsetY: this.embedPlayer.controlBuilder.getHeight(),
          directionH: "left",
          offsetX: -28,
        };
      }
      _this.setupTextSources(function () {
        $menuButton
          .unbind()
          .menu({
            content: _this.getMainMenu(),
            zindex: mw.getConfig("EmbedPlayer.fullScreenZIndex") + 2,
            crumbDefaultText: " ",
            autoShow: autoShow,
            targetMenuContainer: _this.menuTarget,
            positionOpts: positionOpts,
            backLinkText: gM("mwe-timedtext-back-btn"),
          });
      });
    },
    monitor: function () {
      embedPlayer = this.embedPlayer;
      var currentTime = embedPlayer.currentTime;
      var textCategories = [];
      for (var i = 0; i < this.enabledSources.length; i++) {
        var source = this.enabledSources[i];
        this.updateSourceDisplay(source, currentTime);
      }
    },
    loadTextSources: function (callback) {
      var _this = this;
      this.textSources = [];
      var inlineSources = this.embedPlayer.mediaElement.getSources("text");
      for (var i = 0; i < inlineSources.length; i++) {
        var source = new TextSource(inlineSources[i]);
        this.textSources.push(source);
      }
      if (!this.embedPlayer.apiTitleKey) {
        callback();
        return;
      }
      var provider_id = this.embedPlayer.apiProvider
        ? this.embedPlayer.apiProvider
        : "local";
      var apiUrl = mw.getApiProviderURL(provider_id);
      var apiTitleKey = this.embedPlayer.apiTitleKey;
      if (!apiUrl || !apiTitleKey) {
        return;
      }
      this.textProvider = new mw.MediaWikTrackProvider({
        provider_id: provider_id,
        apiUrl: apiUrl,
        embedPlayer: this.embedPlayer,
      });
      this.textProvider.loadSources(apiTitleKey, function (textSources) {
        for (var i = 0; i < textSources.length; i++) {
          var textSource = textSources[i];
          var textElm = document.createElement("track");
          $j(textElm).attr({
            category: "SUB",
            srclang: textSource.srclang,
            type: _this.timedTextExtMime[textSource.extension],
            titleKey: textSource.titleKey,
          });
          $j(textElm).attr(
            "src",
            _this.textProvider.apiUrl.replace("api.php", "index.php?title=") +
              encodeURIComponent(textSource.titleKey) +
              "&action=raw&ctype=text/x-srt"
          );
          $j(textElm).attr(
            "title",
            gM("mwe-timedtext-key-language", [
              textSource.srclang,
              mw.Language.names[textSource.srclang],
            ])
          );
          var embedSource =
            _this.embedPlayer.mediaElement.tryAddSource(textElm);
          var source = new TextSource(embedSource, _this.textProvider);
          _this.textSources.push(source);
        }
        callback();
      });
    },
    getLayoutMode: function () {
      if (
        this.config.layout == "ontop" &&
        !this.embedPlayer.supports["overlays"]
      ) {
        this.config.layout = "below";
      }
      return this.config.layout;
    },
    autoSelectSource: function () {
      this.enabledSources = [];
      for (var i = 0; i < this.textSources.length; i++) {
        var source = this.textSources[i];
        if (
          this.config.userLanugage &&
          this.config.userLanugage == source.srclang.toLowerCase()
        ) {
          this.enableSource(source);
          return;
        }
      }
      if (this.enabledSources.length == 0) {
        for (var i = 0; i < this.textSources.length; i++) {
          var source = this.textSources[i];
          if (source.srclang.toLowerCase() == "en") {
            this.enableSource(source);
            return;
          }
        }
      }
      if (this.enabledSources.length == 0) {
        for (var i = 0; i < this.textSources.length; i++) {
          var source = this.textSources[i];
          this.enableSource(source);
          return;
        }
      }
    },
    enableSource: function (source) {
      this.enabledSources.push(source);
      this.currentLangKey = source.srclang;
    },
    loadCurrentSubSrouce: function (callback) {
      for (var i = 0; i < this.enabledSources.length; i++) {
        var source = this.enabledSources[i];
        if (source.category == "SUB") {
          source.load(function () {
            callback(source);
            return;
          });
        }
      }
      return false;
    },
    getSubCaptions: function (langKey, callback) {
      for (var i = 0; i < this.textSources.length; i++) {
        var source = this.textSources[i];
        if (source.srclang.toLowerCase() == langKey) {
          var source = this.textSources[i];
          source.load(function () {
            callback(source.captions);
          });
        }
      }
    },
    loadEnabledSources: function () {
      for (var i = 0; i < this.enabledSources.length; i++) {
        var enabledSource = this.enabledSources[i];
        if (!enabledSource.loaded) enabledSource.load();
      }
    },
    selectMenuItem: function (item) {},
    isSourceEnabled: function (source) {
      for (var i = 0; i < this.enabledSources.length; i++) {
        var enabledSource = this.enabledSources[i];
        if (source.id) {
          if (source.id == enabledSource.id) return true;
        }
        if (source.srclang) {
          if (source.srclang == enabledSource.srclang) return true;
        }
      }
      return false;
    },
    getSourceByLanguage: function (langKey) {
      for (var i = 0; i < this.textSources.length; i++) {
        var source = this.textSources[i];
        if (source.srclang == langKey) return source;
      }
      return false;
    },
    getMainMenu: function () {
      var _this = this;
      $menu = $j("<ul>");
      if (_this.textSources.length != 0) {
        $menu.append(
          $j
            .getLineItem(gM("mwe-timedtext-choose-text"), "comment")
            .append(_this.getLanguageMenu()),
          $j
            .getLineItem(gM("mwe-timedtext-layout"), "image")
            .append(_this.getLayoutMenu())
        );
      } else {
        $menu.append(
          $j.getLineItem(
            gM("mwe-timedtext-request-subs"),
            "comment",
            function () {
              _this.getAddSubRequest();
            }
          )
        );
      }
      if (
        mw.getConfig("TimedText.showAddTextLink") &&
        _this.embedPlayer.apiTitleKey
      ) {
        $menu.append(_this.getLiAddText());
      }
      $j(_this.embedPlayer).trigger("TimedText.BuildCCMenu", $menu);
      return $menu;
    },
    getAddSubRequest: function () {
      var _this = this;
      var buttons = {};
      buttons[gM("mwe-timedtext-request-subs")] = function () {
        var apiUrl = _this.textProvider.apiUrl;
        var videoTitle =
          "File:" + _this.embedPlayer.apiTitleKey.replace("File:|Image:", "");
        var catName = mw.getConfig("TimedText.NeedsTranscriptCategory");
        var $dialog = $j(this);
        var subRequestCategoryUrl =
          apiUrl.replace("api.php", "index.php") +
          "?title=Category:" +
          catName.replace(/ /g, "_");
        var buttonOk = {};
        buttonOk[gM("mwe-ok")] = function () {
          $j(this).dialog("close");
        };
        $j(this).loadingSpinner();
        $dialog.dialog("option", "buttons", null);
        mw.getJSON(
          apiUrl,
          { titles: videoTitle, prop: "categories" },
          function (data) {
            if (data && data.query && data.query.pages) {
              for (var i in data.query.pages) {
                var categories = data.query.pages[i].categories;
                for (var j = 0; j < categories.length; j++) {
                  if (categories[j].title.indexOf(catName) != -1) {
                    $dialog.html(
                      gM(
                        "mwe-timedtext-request-already-done",
                        subRequestCategoryUrl
                      )
                    );
                    $dialog.dialog("option", "buttons", buttonOk);
                    return;
                  }
                }
              }
            }
            mw.getUserName(apiUrl, function (userName) {
              if (!userName) {
                $dialog.html(gM("mwe-timedtext-request-subs-fail"));
                return;
              }
              mw.getToken(apiUrl, videoTitle, function (token) {
                if (!token) {
                  $dialog.html(gM("mwe-timedtext-request-subs-fail"));
                  return;
                }
                var request = {
                  action: "edit",
                  summary:
                    "Added request for subtitles using [[Commons:MwEmbed|MwEmbed]]",
                  title: videoTitle,
                  appendtext: "\n[[Category:" + catName + "]]",
                  token: token,
                };
                mw.getJSON(apiUrl, request, function (data) {
                  if (data.edit && data.edit.newrevid) {
                    $dialog.html(
                      gM(
                        "mwe-timedtext-request-subs-done",
                        subRequestCategoryUrl
                      )
                    );
                  } else {
                    $dialog.html(gM("mwe-timedtext-request-subs-fail"));
                  }
                  $dialog.dialog("option", "buttons", buttonOk);
                });
              });
            });
          }
        );
      };
      buttons[gM("mwe-cancel")] = function () {
        $j(this).dialog("close");
      };
      mw.addDialog({
        title: gM("mwe-timedtext-request-subs"),
        width: 450,
        content: gM("mwe-timedtext-request-subs-desc"),
        buttons: buttons,
      });
    },
    showTimedTextEditUI: function (mode) {
      var _this = this;
      mw.addLoaderDialog(gM("mwe-timedtext-loading-text-edit"));
      mw.load("TimedText.Edit", function () {
        if (!_this.editText) {
          _this.editText = new mw.TimedTextEdit(_this);
        }
        mw.closeLoaderDialog();
        _this.editText.showUI();
      });
    },
    getLiAddText: function () {
      var _this = this;
      return $j.getLineItem(
        gM("mwe-timedtext-upload-timed-text"),
        "script",
        function () {
          _this.showTimedTextEditUI("add");
        }
      );
    },
    getLiSource: function (source) {
      var _this = this;
      var source_icon = this.isSourceEnabled(source) ? "bullet" : "radio-on";
      if (source.title) {
        return $j.getLineItem(source.title, source_icon, function () {
          _this.selectTextSource(source);
        });
      }
      if (source.srclang) {
        var langKey = source.srclang.toLowerCase();
        _this.getLanguageName(langKey);
        return $j.getLineItem(
          gM("mwe-timedtext-key-language", [
            langKey,
            mw.Language.names[source.srclang],
          ]),
          source_icon,
          function () {
            _this.selectTextSource(source);
          }
        );
      }
    },
    getLanguageName: function (lang_key) {
      if (mw.Language.names[lang_key]) {
        return mw.Language.names[lang_key];
      }
      return false;
    },
    getLayoutMenu: function () {
      var _this = this;
      var layoutOptions = [];
      if (this.embedPlayer.supports["overlays"]) layoutOptions.push("ontop");
      layoutOptions.push("below");
      layoutOptions.push("off");
      $ul = $j("<ul>");
      $j.each(layoutOptions, function (na, layoutMode) {
        var icon = _this.config.layout == layoutMode ? "bullet" : "radio-on";
        $ul.append(
          $j.getLineItem(
            gM("mwe-timedtext-layout-" + layoutMode),
            icon,
            function () {
              _this.selectLayout(layoutMode);
            }
          )
        );
      });
      return $ul;
    },
    selectLayout: function (layoutMode) {
      var _this = this;
      if (layoutMode != _this.config.layout) {
        _this.config.layout = layoutMode;
        mw.setUserConfig("timedTextConfig", _this.config);
        _this.updateLayout();
      }
    },
    updateLayout: function () {
      var $playerTarget = this.embedPlayer.$interface;
      $playerTarget.find(".track").remove();
      this.refreshDisplay();
    },
    selectTextSource: function (source) {
      var _this = this;
      this.bindTextButton(this.embedPlayer.$interface.find("timed-text"));
      this.currentLangKey = source.srclang;
      if (source.srclang) this.config.userLanugage = source.srclang;
      if (source.category) this.config.userCategory = source.category;
      this.enabledSources = [];
      this.enabledSources.push(source);
      if (!source.loaded) {
        var $playerTarget = this.embedPlayer.$interface;
        $playerTarget.find(".track").text(gM("mwe-timedtext-loading-text"));
        source.load(function () {
          _this.refreshDisplay();
        });
      } else {
        _this.refreshDisplay();
      }
    },
    refreshDisplay: function () {
      this.prevText = [];
      if (this.menuTarget) {
        this.bindMenu(this.menuTarget, false);
      }
      this.monitor();
    },
    getLanguageMenu: function () {
      var _this = this;
      var catSourceList = {};
      var catSourceCount = 0;
      var sourcesWithoutCategory = [];
      for (var i = 0; i < this.textSources.length; i++) {
        var source = this.textSources[i];
        if (source.category) {
          var catKey = source.category;
          if (!catSourceList[catKey]) {
            catSourceList[catKey] = [];
            catSourceCount++;
          }
          catSourceList[catKey].push(_this.getLiSource(source));
        } else {
          sourcesWithoutCategory.push(_this.getLiSource(source));
        }
      }
      var $langMenu = $j("<ul>");
      if (catSourceCount > 1) {
        for (var catKey in catSourceList) {
          $catChildren = $j("<ul>");
          for (var i = 0; i < catSourceList[catKey].length; i++) {
            $catChildren.append(catSourceList[catKey][i]);
          }
          $langMenu.append(
            $j
              .getLineItem(gM("mwe-timedtext-textcat-" + catKey.toLowerCase()))
              .append($catChildren)
          );
        }
      } else {
        for (var catKey in catSourceList) {
          for (var i = 0; i < catSourceList[catKey].length; i++) {
            $langMenu.append(catSourceList[catKey][i]);
          }
        }
      }
      for (var i = 0; i < sourcesWithoutCategory.length; i++) {
        $langMenu.append(sourcesWithoutCategory[i]);
      }
      $langMenu.append(_this.getLiAddText());
      return $langMenu;
    },
    updateSourceDisplay: function (source, time) {
      var text = source.getTimedText(time);
      if (text === this.prevText[source.category]) {
        return;
      }
      var $playerTarget = this.embedPlayer.$interface;
      var $textTarget = $playerTarget.find(
        ".track_" + source.category + " span"
      );
      if ($textTarget.length == 0) {
        this.addItextDiv(source.category);
        $textTarget = $playerTarget.find(".track_" + source.category + " span");
      }
      if (text === false) {
        $textTarget.fadeOut("fast");
      } else {
        if (!$textTarget.is(":visible")) {
          $textTarget.fadeIn("fast");
        }
        $textTarget.html(text);
        $textTarget.find("a").attr("target", "_blank");
      }
      this.prevText[source.category] = text;
    },
    addItextDiv: function (category) {
      var $playerTarget = this.embedPlayer.$interface;
      $playerTarget.find(".track_" + category).remove();
      var layoutMode = this.getLayoutMode();
      if (layoutMode == "ontop") {
        this.embedPlayer.controlBuilder.displayOptionsMenuFlag = false;
        var $track = $j("<div>")
          .addClass("track" + " " + "track_" + category)
          .css({
            position: "absolute",
            bottom: this.embedPlayer.controlBuilder.getHeight() + 10,
            width: "100%",
            display: "block",
            opacity: 0.8,
            "text-align": "center",
          })
          .append($j("<span >"));
        $track
          .css(
            this.getInterfaceSizeTextCss({
              width: this.embedPlayer.getWidth(),
              height: this.embedPlayer.getHeight(),
            })
          )
          .css({ "line-height": "1.6em" });
        $playerTarget.append($track);
      } else if (layoutMode == "below") {
        this.embedPlayer.controlBuilder.displayOptionsMenuFlag = true;
        var belowBarHeight = 60;
        $playerTarget.find(".control-bar").before(
          $j("<div>")
            .addClass("track" + " " + "track_" + category)
            .css({
              position: "absolute",
              top: this.embedPlayer.getHeight(),
              display: "block",
              width: "100%",
              height: belowBarHeight + "px",
              "background-color": "#000",
              "text-align": "center",
              "padding-top": "5px",
            })
            .append($j("<span>").css({ color: "white" }))
        );
        var height =
          belowBarHeight +
          8 +
          this.embedPlayer.getHeight() +
          this.embedPlayer.controlBuilder.getHeight();
        if (!this.embedPlayer.controlBuilder.fullscreenMode) {
          this.embedPlayer.$interface.animate({ height: height });
        }
      }
    },
  };
  TextSource = function (source, textProvider) {
    return this.init(source, textProvider);
  };
  TextSource.prototype = {
    loaded: false,
    captions: [],
    prevIndex: 0,
    init: function (source, textProvider) {
      for (var i in source) {
        this[i] = source[i];
      }
      if (!this.category) {
        this.category = "SUB";
      }
      if (textProvider) {
        this.textProvider = textProvider;
      }
    },
    load: function (callback) {
      var _this = this;
      if (_this.loaded) {
        if (callback) {
          callback();
          return;
        }
      }
      _this.loaded = true;
      switch (this.getMIMEType()) {
        case "text/mw-srt":
          var handler = parseMwSrt;
          break;
        case "text/x-srt":
          var handler = parseSrt;
          break;
        case "text/cmml":
          var handler = parseCMML;
          break;
        default:
          var hanlder = null;
          break;
      }
      if (!handler) {
        return;
      }
      if (this.textProvider && this.titleKey) {
        this.textProvider.loadTitleKey(this.titleKey, function (data) {
          if (data) {
            _this.captions = handler(data);
          }
          _this.loaded = true;
          if (callback) {
            callback();
          }
        });
        return;
      }
      if (this.getSrc()) {
        if (!mw.isLocalDomain(this.getSrc())) {
          return;
        }
        $j.get(
          this.getSrc(),
          function (data) {
            _this.captions = handler(data);
            _this.loaded = true;
            if (callback) {
              callback();
            }
          },
          "text"
        );
        return;
      }
    },
    getTimedText: function (time) {
      var prevCaption = this.captions[this.prevIndex];
      if (prevCaption && time >= prevCaption.start) {
        var startIndex = this.prevIndex;
      } else {
        var startIndex = 0;
      }
      for (var i = startIndex; i < this.captions.length; i++) {
        caption = this.captions[i];
        if (caption.end == 0 || caption.end == -1) continue;
        if (time >= caption.start && time <= caption.end) {
          this.prevIndex = i;
          return caption.content;
        }
      }
      return false;
    },
  };
  function parseMwSrt(data) {
    var captions = [];
    var curentCap = [];
    var parseNextAsTime = false;
    $j("<div>" + data + "</div>")
      .find("p")
      .each(function () {
        currentPtext = $j(this).html();
        var m = currentPtext
          .replace("--&gt;", "-->")
          .match(
            /\d+\s([\d\-]+):([\d\-]+):([\d\-]+)(?:,([\d\-]+))?\s*--?>\s*([\d\-]+):([\d\-]+):([\d\-]+)(?:,([\d\-]+))?\n?(.*\n?.*)/
          );
        if (m) {
          var startMs = m[4] ? parseInt(m[4], 10) / 1000 : 0;
          var endMs = m[8] ? parseInt(m[8], 10) / 1000 : 0;
          captions.push({
            start:
              parseInt(m[1], 10) * 60 * 60 +
              parseInt(m[2], 10) * 60 +
              parseInt(m[3], 10) +
              startMs,
            end:
              parseInt(m[5], 10) * 60 * 60 +
              parseInt(m[6], 10) * 60 +
              parseInt(m[7], 10) +
              endMs,
            content: $j.trim(m[9]),
          });
          return true;
        }
        if (parseInt(currentPtext) == currentPtext) {
          if (curentCap.length != 0) {
            captions.push(curentCap);
          }
          curentCap = { content: "" };
          return true;
        }
        var m = currentPtext
          .replace("--&gt;", "-->")
          .match(
            /(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/
          );
        if (m) {
          var startMs = m[4] ? parseInt(m[4], 10) / 1000 : 0;
          var endMs = m[8] ? parseInt(m[8], 10) / 1000 : 0;
          curentCap["start"] =
            parseInt(m[1], 10) * 60 * 60 +
            parseInt(m[2], 10) * 60 +
            parseInt(m[3], 10) +
            startMs;
          curentCap["end"] =
            parseInt(m[5], 10) * 60 * 60 +
            parseInt(m[6], 10) * 60 +
            parseInt(m[7], 10) +
            endMs;
          return true;
        }
        if (currentPtext != "<br>") {
          curentCap["content"] += currentPtext;
        }
      });
    if (curentCap.length != 0) {
      captions.push(curentCap);
    }
    return captions;
  }
  function parseSrt(data) {
    var srt = data.replace(/\r+/g, "");
    srt = srt.replace(/^\s+|\s+$/g, "");
    srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, "");
    var captions = [];
    var caplist = srt.split("\n\n");
    for (var i = 0; i < caplist.length; i++) {
      var caption = "";
      var content, start, end, s;
      caption = caplist[i];
      s = caption.split(/\n/);
      if (s[0].match(/^\d+$/) && s[1].match(/\d+:\d+:\d+/)) {
        var m = s[1].match(
          /(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/
        );
        if (m) {
          start =
            parseInt(m[1], 10) * 60 * 60 +
            parseInt(m[2], 10) * 60 +
            parseInt(m[3], 10) +
            parseInt(m[4], 10) / 1000;
          end =
            parseInt(m[5], 10) * 60 * 60 +
            parseInt(m[6], 10) * 60 +
            parseInt(m[7], 10) +
            parseInt(m[8], 10) / 1000;
        } else {
          continue;
        }
        content = s.slice(2).join("<br>");
      } else {
        continue;
      }
      captions.push({ start: start, end: end, content: content });
    }
    return captions;
  }
  function parseCMML(data) {
    var captions = [];
    $j(data)
      .find("clip")
      .each(function (inx, clip) {
        var content, start, end;
        start = mw.npt2seconds($j(clip).attr("start").replace("npt:", ""));
        end = mw.npt2seconds($j(clip).attr("end").replace("npt:", ""));
        $j(clip)
          .find("body")
          .each(function (binx, bn) {
            if (bn.textContent) {
              content = bn.textContent;
            } else if (bn.text) {
              content = bn.text;
            }
          });
        captions.push({ start: start, end: end, content: content });
      });
    return captions;
  }
  var default_textProvider_attr = [
    "apiUrl",
    "provider_id",
    "timed_text_NS",
    "embedPlayer",
  ];
  mw.MediaWikTrackProvider = function (options) {
    this.init(options);
  };
  mw.MediaWikTrackProvider.prototype = {
    apiUrl: null,
    timed_text_NS: null,
    init: function (options) {
      for (var i in default_textProvider_attr) {
        var attr = default_textProvider_attr[i];
        if (options[attr]) this[attr] = options[attr];
      }
    },
    loadTitleKey: function (titleKey, callback) {
      var request = {
        action: "parse",
        page: titleKey,
        smaxage: 300,
        maxage: 300,
      };
      mw.getJSON(this.apiUrl, request, function (data) {
        if (data && data.parse && data.parse.text["*"]) {
          callback(data.parse.text["*"]);
          return;
        }
        callback(false);
      });
    },
    loadSources: function (apiTitleKey, callback) {
      var request = {};
      var _this = this;
      this.getSourcePages(apiTitleKey, function (sourcePages) {
        if (!sourcePages.query.allpages) {
          callback();
          return;
        }
        callback(_this.getSources(sourcePages));
      });
    },
    getSourcePages: function (titleKey, callback) {
      var _this = this;
      var request = {
        list: "allpages",
        apprefix: unescape(titleKey),
        apnamespace: this.getTimedTextNS(),
        aplimit: 200,
        prop: "revisions",
        smaxage: 300,
        maxage: 300,
      };
      mw.getJSON(this.apiUrl, request, function (sourcePages) {
        if (
          sourcePages.error &&
          sourcePages.error.code == "apunknown_apnamespace"
        ) {
          var request = {
            list: "allpages",
            apprefix:
              _this.getCanonicalTimedTextNS() +
              ":" +
              _this.embedPlayer.apiTitleKey,
          };
          mw.getJSON(_this.apiUrl, request, function (sourcePages) {
            callback(sourcePages);
          });
        } else {
          callback(sourcePages);
        }
      });
    },
    getSources: function (sourcePages) {
      var _this = this;
      var foundTextTracks = false;
      var sources = [];
      for (var i = 0; i < sourcePages.query.allpages.length; i++) {
        var subPage = sourcePages.query.allpages[i];
        if (!subPage || !subPage.title) {
          continue;
        }
        var langKey = subPage.title.split(".");
        var extension = langKey.pop();
        langKey = langKey.pop();
        if (extension == "srt") {
          extension = "mw-srt";
        }
        if (!_this.isSuportedLang(langKey)) {
        } else {
          sources.push({
            extension: extension,
            srclang: langKey,
            titleKey: subPage.title.replace(/ /g, "_"),
          });
        }
      }
      return sources;
    },
    getTimedTextNS: function () {
      if (this.timed_text_NS) return this.timed_text_NS;
      if (typeof wgNamespaceIds != "undefined" && wgNamespaceIds["timedtext"]) {
        this.timed_text_NS = wgNamespaceIds["timedtext"];
      } else {
        this.timed_text_NS = 102;
      }
      return this.timed_text_NS;
    },
    getCanonicalTimedTextNS: function () {
      return "TimedText";
    },
    isSuportedLang: function (lang_key) {
      if (mw.Language.names[lang_key]) {
        return true;
      }
      return false;
    },
  };
})(window.mw);
(function ($) {
  $.fn.timedText = function (action, target) {
    if (!target) {
      options = action;
    }
    if (typeof options == "undefined") options = {};
    $j(this.selector).each(function () {
      var embedPlayer = $j(this).get(0);
      if (!embedPlayer.timedText) {
        embedPlayer.timedText = new mw.TimedText(embedPlayer, options);
      }
      if (action == "showMenu") {
        embedPlayer.timedText.bindMenu(target, true);
      }
    });
  };
})(jQuery);
var allUIMenus = [];
(function ($) {
  $.getLineItem = function (string, icon, callback) {
    var $li = $j("<li>").append($j("<a>").attr("href", "#").click(callback));
    if (icon) {
      $li
        .find("a")
        .append(
          $j('<span style="float:left;"></span>').addClass(
            "ui-icon ui-icon-" + icon
          )
        );
    }
    $li.find("a").append($j("<span>").text(string));
    return $li;
  };
  $.fn.menu = function (options) {
    var caller = this;
    var options = options;
    if (!caller.m) {
      caller.m = new Menu(caller, options);
      allUIMenus.push(caller.m);
      $(this)
        .mousedown(function () {
          if (!caller.m.menuOpen) {
            caller.m.showLoading();
          }
        })
        .click(function () {
          if (caller.m.menuOpen == false) {
            caller.m.showMenu();
          } else {
            caller.m.kill();
          }
          return false;
        });
    }
    if (options.autoShow) {
      setTimeout(function () {
        caller.m.showLoading();
        caller.m.showMenu();
      }, 0);
    }
    if (options == "show") {
      caller.m.showMenu();
    }
    return this;
  };
  function Menu(caller, options) {
    var menu = this;
    var caller = $(caller);
    var callerClassList =
      "fg-menu-container ui-widget ui-widget-content ui-corner-all";
    if (options.targetMenuContainer) {
      var container = $(options.targetMenuContainer)
        .addClass(callerClassList)
        .html(options.content);
    } else {
      var container = $("<div>")
        .addClass(callerClassList)
        .html(options.content);
    }
    this.menuOpen = false;
    this.menuExists = false;
    var options = jQuery.extend(
      {
        content: null,
        autoShow: false,
        width: 180,
        maxHeight: 180,
        targetMenuContainer: null,
        zindex: 2,
        positionOpts: {
          posX: "left",
          posY: "bottom",
          offsetX: 0,
          offsetY: 0,
          directionH: "right",
          directionV: "down",
          detectH: true,
          detectV: true,
          linkToFront: false,
        },
        showSpeed: 200,
        createMenuCallback: null,
        callerOnState: "ui-state-active",
        loadingState: "ui-state-loading",
        linkHover: "ui-state-hover",
        linkHoverSecondary: "li-hover",
        crossSpeed: 200,
        crumbDefaultText: "Choose an option:",
        backLink: true,
        backLinkText: "Back",
        flyOut: false,
        flyOutOnState: "ui-state-default",
        nextMenuLink: "ui-icon-triangle-1-e",
        topLinkText: "All",
        nextCrumbLink: "ui-icon-carat-1-e",
      },
      options
    );
    container.css({ left: "0px", "z-index": options.zindex });
    var killAllMenus = function () {
      $.each(allUIMenus, function (i) {
        if (allUIMenus[i].menuOpen) {
          allUIMenus[i].kill();
        }
      });
    };
    this.kill = function () {
      caller
        .removeClass(options.loadingState)
        .removeClass("fg-menu-open")
        .removeClass(options.callerOnState);
      container
        .find("li")
        .removeClass(options.linkHoverSecondary)
        .find("a")
        .removeClass(options.linkHover);
      if (options.flyOutOnState) {
        container.find("li a").removeClass(options.flyOutOnState);
      }
      if (options.callerOnState) {
        caller.removeClass(options.callerOnState);
      }
      if (container.is(".fg-menu-ipod")) {
        menu.resetDrilldownMenu();
      }
      if (container.is(".fg-menu-flyout")) {
        menu.resetFlyoutMenu();
      }
      if (!options.keepPosition) {
        container.parent().hide();
      } else {
        container.hide();
      }
      menu.menuOpen = false;
      $(document).unbind("click", killAllMenus);
      $(document).unbind("keydown");
    };
    this.showLoading = function () {
      caller.addClass(options.loadingState);
    };
    this.showMenu = function () {
      killAllMenus();
      if (!menu.menuExists) {
        menu.create();
      }
      caller.addClass("fg-menu-open").addClass(options.callerOnState);
      container
        .parent()
        .show()
        .click(function () {
          menu.kill();
          return false;
        });
      container.hide().slideDown(options.showSpeed).find(".fg-menu:eq(0)");
      menu.menuOpen = true;
      caller.removeClass(options.loadingState);
      $(document).click(killAllMenus);
      $(document).keydown(function (event) {
        var e;
        if (event.which != "") {
          e = event.which;
        } else if (event.charCode != "") {
          e = event.charCode;
        } else if (event.keyCode != "") {
          e = event.keyCode;
        }
        var menuType = $(event.target).parents("div").is(".fg-menu-flyout")
          ? "flyout"
          : "ipod";
        switch (e) {
          case 37:
            if (menuType == "flyout") {
              $(event.target).trigger("mouseout");
              if ($("." + options.flyOutOnState).size() > 0) {
                $("." + options.flyOutOnState).trigger("mouseover");
              }
            }
            if (menuType == "ipod") {
              $(event.target).trigger("mouseout");
              if ($(".fg-menu-footer").find("a").size() > 0) {
                $(".fg-menu-footer").find("a").trigger("click");
              }
              if ($(".fg-menu-header").find("a").size() > 0) {
                $(".fg-menu-current-crumb").prev().find("a").trigger("click");
              }
              if ($(".fg-menu-current").prev().is(".fg-menu-indicator")) {
                $(".fg-menu-current").prev().trigger("mouseover");
              }
            }
            return false;
            break;
          case 38:
            if ($(event.target).is("." + options.linkHover)) {
              var prevLink = $(event.target).parent().prev().find("a:eq(0)");
              if (prevLink.size() > 0) {
                $(event.target).trigger("mouseout");
                prevLink.trigger("mouseover");
              }
            } else {
              container.find("a:eq(0)").trigger("mouseover");
            }
            return false;
            break;
          case 39:
            if ($(event.target).is(".fg-menu-indicator")) {
              if (menuType == "flyout") {
                $(event.target).next().find("a:eq(0)").trigger("mouseover");
              } else if (menuType == "ipod") {
                $(event.target).trigger("click");
                setTimeout(function () {
                  $(event.target).next().find("a:eq(0)").trigger("mouseover");
                }, options.crossSpeed);
              }
            }
            return false;
            break;
          case 40:
            if ($(event.target).is("." + options.linkHover)) {
              var nextLink = $(event.target).parent().next().find("a:eq(0)");
              if (nextLink.size() > 0) {
                $(event.target).trigger("mouseout");
                nextLink.trigger("mouseover");
              }
            } else {
              container.find("a:eq(0)").trigger("mouseover");
            }
            return false;
            break;
          case 27:
            killAllMenus();
            break;
          case 13:
            if (
              $(event.target).is(".fg-menu-indicator") &&
              menuType == "ipod"
            ) {
              $(event.target).trigger("click");
              setTimeout(function () {
                $(event.target).next().find("a:eq(0)").trigger("mouseover");
              }, options.crossSpeed);
            }
            break;
        }
      });
    };
    this.create = function () {
      container
        .css({ width: options.width })
        .find("ul:first")
        .not(".fg-menu-breadcrumb")
        .addClass("fg-menu");
      if (!options.keepPosition) {
        container.appendTo("body");
      }
      container.find("ul, li a").addClass("ui-corner-all");
      container
        .find("ul")
        .attr("role", "menu")
        .eq(0)
        .attr("aria-activedescendant", "active-menuitem")
        .attr("aria-labelledby", caller.attr("id"));
      container.find("li").attr("role", "menuitem");
      container
        .find("li:has(ul)")
        .attr("aria-haspopup", "true")
        .find("ul")
        .attr("aria-expanded", "false");
      container.find("a").attr("tabindex", "-1");
      if (container.find("ul").size() > 1) {
        if (options.flyOut) {
          menu.flyout(container, options);
        } else {
          menu.drilldown(container, options);
        }
      } else {
        container.find("a").click(function () {
          menu.chooseItem(this);
          return false;
        });
      }
      if (options.linkHover) {
        var allLinks = container.find(".fg-menu li a");
        allLinks.hover(
          function () {
            var menuitem = $(this);
            var menuli = menuitem.parent();
            if (!menuli.hasClass("divider") && !menuli.hasClass("disabled")) {
              $("." + options.linkHover)
                .removeClass(options.linkHover)
                .blur()
                .parent()
                .removeAttr("id");
              $(this)
                .addClass(options.linkHover)
                .focus()
                .parent()
                .addClass("active-menuitem");
            }
          },
          function () {
            if (
              typeof menuitem != "undefined" &&
              !menuitem.hasClass("divider") &&
              !menuitem.hasClass("disabled")
            ) {
              $(this)
                .removeClass(options.linkHover)
                .blur()
                .parent()
                .removeClass("active-menuitem");
            }
          }
        );
      }
      if (options.linkHoverSecondary) {
        container.find(".fg-menu li").hover(
          function () {
            $(this).siblings("li").removeClass(options.linkHoverSecondary);
            if (options.flyOutOnState) {
              $(this)
                .siblings("li")
                .find("a")
                .removeClass(options.flyOutOnState);
            }
            $(this).addClass(options.linkHoverSecondary);
          },
          function () {
            $(this).removeClass(options.linkHoverSecondary);
          }
        );
      }
      if (!options.keepPosition) {
        menu.setPosition(container, caller, options);
      }
      menu.menuExists = true;
      if (typeof options.createMenuCallback == "function") {
        options.createMenuCallback();
      }
    };
    this.chooseItem = function (item) {
      menu.kill();
      if (options.selectItemCallback) options.selectItemCallback(item);
    };
  }
  Menu.prototype.flyout = function (container, options) {
    var menu = this;
    this.resetFlyoutMenu = function () {
      var allLists = container.find("ul ul");
      allLists.removeClass("ui-widget-content").hide();
    };
    container
      .addClass("fg-menu-flyout")
      .find("li:has(ul)")
      .each(function () {
        var linkWidth = container.width();
        var showTimer, hideTimer;
        var allSubLists = $(this).find("ul");
        allSubLists.css({ left: linkWidth, width: linkWidth }).hide();
        $(this)
          .find("a:eq(0)")
          .addClass("fg-menu-indicator")
          .html(
            "<span>" +
              $(this).find("a:eq(0)").html() +
              '</span><span class="ui-icon ' +
              options.nextMenuLink +
              '"></span>'
          )
          .hover(
            function () {
              clearTimeout(hideTimer);
              var subList = $(this).next();
              if (!fitVertical(subList, $(this).offset().top)) {
                subList.css({ top: "auto", bottom: 0 });
              }
              if (!fitHorizontal(subList, $(this).offset().left + 100)) {
                subList.css({
                  left: "auto",
                  right: linkWidth,
                  "z-index": 1005,
                });
              }
              showTimer = setTimeout(function () {
                subList
                  .addClass("ui-widget-content")
                  .show(options.showSpeed)
                  .attr("aria-expanded", "true");
              }, 300);
            },
            function () {
              clearTimeout(showTimer);
              var subList = $(this).next();
              hideTimer = setTimeout(function () {
                subList
                  .removeClass("ui-widget-content")
                  .hide(options.showSpeed)
                  .attr("aria-expanded", "false");
              }, 400);
            }
          );
        $(this)
          .find("ul a")
          .hover(
            function () {
              clearTimeout(hideTimer);
              if ($(this).parents("ul").prev().is("a.fg-menu-indicator")) {
                $(this).parents("ul").prev().addClass(options.flyOutOnState);
              }
            },
            function () {
              hideTimer = setTimeout(function () {
                allSubLists.hide(options.showSpeed);
                container
                  .find(options.flyOutOnState)
                  .removeClass(options.flyOutOnState);
              }, 500);
            }
          );
      });
    container.find("a").click(function () {
      menu.chooseItem(this);
      return false;
    });
  };
  Menu.prototype.drilldown = function (container, options) {
    var menu = this;
    var topList = container.find(".fg-menu");
    var breadcrumb = $(
      '<ul class="fg-menu-breadcrumb ui-widget-header ui-corner-all ui-helper-clearfix"></ul>'
    );
    var crumbDefaultHeader = $(
      '<li class="fg-menu-breadcrumb-text">' +
        options.crumbDefaultText +
        "</li>"
    );
    var firstCrumbText = options.backLink
      ? options.backLinkText
      : options.topLinkText;
    var firstCrumbClass = options.backLink
      ? "fg-menu-prev-list"
      : "fg-menu-all-lists";
    var firstCrumbLinkClass = options.backLink
      ? "ui-state-default ui-corner-all"
      : "";
    var firstCrumbIcon = options.backLink
      ? '<span class="ui-icon ui-icon-triangle-1-w"></span>'
      : "";
    var firstCrumb = $(
      '<li class="' +
        firstCrumbClass +
        '"><a href="#" class="' +
        firstCrumbLinkClass +
        '">' +
        firstCrumbIcon +
        firstCrumbText +
        "</a></li>"
    );
    container.addClass("fg-menu-ipod");
    if (options.backLink) {
      breadcrumb.addClass("fg-menu-footer").appendTo(container).hide();
    } else {
      breadcrumb.addClass("fg-menu-header").prependTo(container);
    }
    breadcrumb.append(crumbDefaultHeader);
    var checkMenuHeight = function (el) {
      if (el.height() > options.maxHeight) {
        el.addClass("fg-menu-scroll");
      }
      el.css({ height: options.maxHeight - 30 });
    };
    var resetChildMenu = function (el) {
      el.removeClass("fg-menu-scroll")
        .removeClass("fg-menu-current")
        .height("auto");
    };
    this.resetDrilldownMenu = function () {
      $(".fg-menu-current").removeClass("fg-menu-current");
      topList.animate({ left: 0 }, options.crossSpeed, function () {
        $(this)
          .find("ul")
          .each(function () {
            $(this).hide();
            resetChildMenu($(this));
          });
        topList.addClass("fg-menu-current");
      });
      $(".fg-menu-all-lists").find("span").remove();
      breadcrumb.empty().append(crumbDefaultHeader);
      $(".fg-menu-footer").empty().hide();
      checkMenuHeight(topList);
    };
    topList
      .addClass(
        "fg-menu-content fg-menu-current ui-widget-content ui-helper-clearfix"
      )
      .css({ width: container.width() })
      .find("ul")
      .css({ width: container.width(), left: container.width() })
      .addClass("ui-widget-content")
      .hide();
    checkMenuHeight(topList);
    topList.find("a").each(function () {
      if ($(this).next().is("ul")) {
        $(this)
          .addClass("fg-menu-indicator")
          .each(function () {
            $(this).html(
              "<span>" +
                $(this).html() +
                '</span><span class="ui-icon ' +
                options.nextMenuLink +
                '"></span>'
            );
          })
          .click(function () {
            var nextList = $(this).next();
            var parentUl = $(this).parents("ul:eq(0)");
            var parentLeft = parentUl.is(".fg-menu-content")
              ? 0
              : parseFloat(topList.css("left"));
            var nextLeftVal = Math.round(
              parentLeft - parseFloat(container.width())
            );
            var footer = $(".fg-menu-footer");
            resetChildMenu(parentUl);
            checkMenuHeight(nextList);
            topList.animate({ left: nextLeftVal }, options.crossSpeed);
            nextList
              .show()
              .addClass("fg-menu-current")
              .attr("aria-expanded", "true");
            var setPrevMenu = function (backlink) {
              var b = backlink;
              var c = $(".fg-menu-current");
              var prevList = c.parents("ul:eq(0)");
              c.hide().attr("aria-expanded", "false");
              resetChildMenu(c);
              checkMenuHeight(prevList);
              prevList
                .addClass("fg-menu-current")
                .attr("aria-expanded", "true");
              if (prevList.hasClass("fg-menu-content")) {
                b.remove();
                footer.hide();
              }
            };
            if (options.backLink) {
              if (footer.find("a").size() == 0) {
                footer.show();
                $(
                  '<a href="#"><span class="ui-icon ui-icon-triangle-1-w"></span> <span>Back</span></a>'
                )
                  .appendTo(footer)
                  .click(function () {
                    var b = $(this);
                    var prevLeftVal =
                      parseFloat(topList.css("left")) + container.width();
                    topList.animate(
                      { left: prevLeftVal },
                      options.crossSpeed,
                      function () {
                        setPrevMenu(b);
                      }
                    );
                    return false;
                  });
              }
            } else {
              if (breadcrumb.find("li").size() == 1) {
                breadcrumb.empty().append(firstCrumb);
                firstCrumb.find("a").click(function () {
                  menu.resetDrilldownMenu();
                  return false;
                });
              }
              $(".fg-menu-current-crumb").removeClass("fg-menu-current-crumb");
              var crumbText = $(this).find("span:eq(0)").text();
              var newCrumb = $(
                '<li class="fg-menu-current-crumb"><a href="javascript://" class="fg-menu-crumb">' +
                  crumbText +
                  "</a></li>"
              );
              newCrumb
                .appendTo(breadcrumb)
                .find("a")
                .click(function () {
                  if ($(this).parent().is(".fg-menu-current-crumb")) {
                    menu.chooseItem(this);
                  } else {
                    var newLeftVal =
                      -($(".fg-menu-current").parents("ul").size() - 1) * 180;
                    topList.animate(
                      { left: newLeftVal },
                      options.crossSpeed,
                      function () {
                        setPrevMenu();
                      }
                    );
                    $(this)
                      .parent()
                      .addClass("fg-menu-current-crumb")
                      .find("span")
                      .remove();
                    $(this).parent().nextAll().remove();
                  }
                  return false;
                });
              newCrumb
                .prev()
                .append(
                  ' <span class="ui-icon ' + options.nextCrumbLink + '"></span>'
                );
            }
            return false;
          });
      } else {
        $(this).click(function () {
          menu.chooseItem(this);
          return false;
        });
      }
    });
  };
  Menu.prototype.setPosition = function (widget, caller, options) {
    var el = widget;
    var referrer = caller;
    var dims = {
      refX: referrer.offset().left,
      refY: referrer.offset().top,
      refW: referrer.getTotalWidth(),
      refH: referrer.getTotalHeight(),
    };
    var options = options;
    var xVal, yVal;
    var helper = $('<div class="menuPositionHelper">');
    helper.css("z-index", options.zindex);
    if (isNaN(dims.refW) || isNaN(dims.refH)) {
      dims.refH = 16;
      dims.refW = 23;
    }
    helper.css({
      position: "absolute",
      left: dims.refX,
      top: dims.refY,
      width: dims.refW,
      height: dims.refH,
    });
    el.wrap(helper);
    xVal = yVal = 0;
    switch (options.positionOpts.posX) {
      case "left":
        xVal = 0;
        break;
      case "center":
        xVal = dims.refW / 2;
        break;
      case "right":
        xVal = dims.refW;
        break;
    }
    switch (options.positionOpts.posY) {
      case "top":
        yVal = 0;
        break;
      case "center":
        yVal = dims.refH / 2;
        break;
      case "bottom":
        yVal = dims.refH;
        break;
    }
    xVal += options.positionOpts.offsetX ? options.positionOpts.offsetX : 0;
    yVal += options.positionOpts.offsetY ? options.positionOpts.offsetY : 0;
    if (options.positionOpts.directionV == "up") {
      el.css({ top: "auto", bottom: yVal });
      if (options.positionOpts.detectV && !fitVertical(el)) {
        el.css({ bottom: "auto", top: yVal });
      }
    } else {
      el.css({ bottom: "auto", top: yVal });
      if (options.positionOpts.detectV && !fitVertical(el)) {
        el.css({ top: "auto", bottom: yVal });
      }
    }
    if (options.positionOpts.directionH == "left") {
      el.css({ left: "auto", right: xVal });
      if (options.positionOpts.detectH && !fitHorizontal(el)) {
        el.css({ right: "auto", left: xVal });
      }
    } else {
      el.css({ right: "auto", left: xVal });
      if (options.positionOpts.detectH && !fitHorizontal(el)) {
        el.css({ left: "auto", right: xVal });
      }
    }
    if (options.positionOpts.linkToFront) {
      referrer
        .clone()
        .addClass("linkClone")
        .css({
          position: "absolute",
          top: 0,
          right: "auto",
          bottom: "auto",
          left: 0,
          width: referrer.width(),
          height: referrer.height(),
        })
        .insertAfter(el);
    }
  };
  function sortBigToSmall(a, b) {
    return b - a;
  }
  jQuery.fn.getTotalWidth = function () {
    return (
      $(this).width() +
      parseInt($(this).css("paddingRight")) +
      parseInt($(this).css("paddingLeft")) +
      parseInt($(this).css("borderRightWidth")) +
      parseInt($(this).css("borderLeftWidth"))
    );
  };
  jQuery.fn.getTotalHeight = function () {
    return (
      $(this).height() +
      parseInt($(this).css("paddingTop")) +
      parseInt($(this).css("paddingBottom")) +
      parseInt($(this).css("borderTopWidth")) +
      parseInt($(this).css("borderBottomWidth"))
    );
  };
  function getScrollTop() {
    return (
      self.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    );
  }
  function getScrollLeft() {
    return (
      self.pageXOffset ||
      document.documentElement.scrollLeft ||
      document.body.scrollLeft
    );
  }
  function getWindowHeight() {
    var de = document.documentElement;
    return (
      self.innerHeight || (de && de.clientHeight) || document.body.clientHeight
    );
  }
  function getWindowWidth() {
    var de = document.documentElement;
    return (
      self.innerWidth || (de && de.clientWidth) || document.body.clientWidth
    );
  }
  function fitHorizontal(el, leftOffset) {
    var leftVal = parseInt(leftOffset) || $(el).offset().left;
    return (
      leftVal + $(el).width() <= getWindowWidth() + getScrollLeft() &&
      leftVal - getScrollLeft() >= 0
    );
  }
  function fitVertical(el, topOffset) {
    var topVal = parseInt(topOffset) || $(el).offset().top;
    return (
      topVal + $(el).height() <= getWindowHeight() + getScrollTop() &&
      topVal - getScrollTop() >= 0
    );
  }
  Number.prototype.pxToEm = String.prototype.pxToEm = function (settings) {
    settings = jQuery.extend({ scope: "body", reverse: false }, settings);
    var pxVal = this == "" ? 0 : parseFloat(this);
    var scopeVal;
    var getWindowWidth = function () {
      var de = document.documentElement;
      return (
        self.innerWidth || (de && de.clientWidth) || document.body.clientWidth
      );
    };
    if (
      settings.scope == "body" &&
      $.browser.msie &&
      (parseFloat($("body").css("font-size")) / getWindowWidth()).toFixed(1) >
        0.0
    ) {
      var calcFontSize = function () {
        return (
          (parseFloat($("body").css("font-size")) / getWindowWidth()).toFixed(
            3
          ) * 16
        );
      };
      scopeVal = calcFontSize();
    } else {
      scopeVal = parseFloat(jQuery(settings.scope).css("font-size"));
    }
    var result =
      settings.reverse == true
        ? (pxVal * scopeVal).toFixed(2) + "px"
        : (pxVal / scopeVal).toFixed(2) + "em";
    return result;
  };
})(jQuery);
if (typeof mw != "undefined" && mw.loadDone) {
  mw.loadDone(
    "mwEmbed,mw.EmbedPlayer,mw.PlayerControlBuilder,j.fn.hoverIntent,j.ui,j.widget,j.ui.mouse,j.ui.slider,mw.PlayerSkinKskin,mw.PlayerSkinMvpcf,mw.EmbedPlayerNative,mw.EmbedPlayerJava,mw.EmbedPlayerVlc,mw.EmbedPlayerKplayer,mw.EmbedPlayerGeneric,j.cookie,JSON,mw.TimedText,j.fn.menu"
  );
}
mw.style.mwCommon = 1;
mw.style.EmbedPlayer = 1;
mw.style.PlayerSkinMvpcf = 1;
mw.style.PlayerSkinKskin = 1;
mw.style.TimedText = 1;
mw.style.jquerymenu = 1;

mw.setConfig({
  LoadLocalSettings: 0,
  LoadModuleMessagesInDebug: 0,
  relativeCortadoAppletPath: 0,
  "TimedText.showAddTextLink": 0,
});
