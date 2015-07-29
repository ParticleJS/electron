(function (lol, rofl) {
  "use strict";
  
  if (typeof module !== "undefined" && module.exports) {
    module.exports = rofl();
  } else if (typeof define === "function" && define.amd) {
    define(rofl());
  } else {
    lol.electron = rofl();
  }
}(this, function () {
  "use strict";
  
  var Electron = function (url, opts) {
    this.opts = opts || {};
    this.xhr = new XMLHttpRequest();
    
    var xhr = this.xhr
      , timeoutHandler
      , handler;
    
    this.xhr.open(
      this.opts.method ? this.opts.method.toUpperCase() : "GET",
      url,
      this.opts.async || true,
      this.opts.username || null,
      this.opts.password || null
    );
    
    this.timeout = this.opts.timeout || 7000;
    
    timeoutHandler = setTimeout(this.opts.ontimeout || function () {
      throw new Error("electron: request timeout after " + this.timeout + "ms");
    });
    
    this.then = function (handlerT) {
      handler = handlerT;
      xhr.send(this.opts.data || null);
    };
    
    this.xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }
      
      clearTimeout(timeoutHandler);
      
      handler(
        xhr.status !== 200 ? new Error("electron: server returned status " + this.xhr.status) : null,
        xhr.responseText,
        xhr
      );
    };
  };
  
  return {
    get: function (url, data) { return new Electron(url, {data: data || null, method: "get"}); },
    post: function (url, data) { return new Electron(url, {data: data || null, method: "post"}); },
    put: function (url, data) { return new Electron(url, {data: data || null, method: "put"}); },
    del: function (url, data) { return new Electron(url, {data: data || null, method: "delete"}); },
    raw: function (url, opts) { return new Electron(url, opts); },
    
    serialize: function (data) {
      var url = "";
      
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          url += encodeURIComponent(prop) + "=" + encodeURIComponent(data[prop]) + "&";
        }
      }
      
      return url.substring(0, url.length - 1);
    }
  };
}));
