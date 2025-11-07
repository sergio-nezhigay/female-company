(function () {
  'use strict';

  function loadScript(src, attrs) {
    try {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      if (attrs) {
        for (var k in attrs) {
          if (Object.prototype.hasOwnProperty.call(attrs, k)) {
            s.setAttribute(k, attrs[k]);
          }
        }
      }
      document.head.appendChild(s);
    } catch (e) {
      // swallow
    }
  }

  function schedule(fn) {
    if (typeof window.requestIdleCallback === 'function') {
      try {
        window.requestIdleCallback(fn, { timeout: 3000 });
        return;
      } catch (e) {
        // fallthrough
      }
    }
    setTimeout(fn, 2000);
  }

  function onFirstInteraction(cb) {
    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      cleanup();
      cb();
    }
    function cleanup() {
      ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach(function (e) {
        window.removeEventListener(e, fire, listenerOpts);
      });
    }
    var listenerOpts = { passive: true, once: true };
    ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach(function (e) {
      window.addEventListener(e, fire, listenerOpts);
    });
    setTimeout(fire, 5000);
  }

  window.DeferLib = {
    loadGroupWhenIdle: function (urls) {
      schedule(function () {
        for (var i = 0; i < urls.length; i++) {
          var u = urls[i];
          loadScript(u.src, u.attrs);
        }
      });
    },
    loadGroupOnInteraction: function (urls) {
      onFirstInteraction(function () {
        for (var i = 0; i < urls.length; i++) {
          var u = urls[i];
          loadScript(u.src, u.attrs);
        }
      });
    },
    loadWhenVisible: function (selector, urls) {
      try {
        var targets = document.querySelectorAll(selector);
        if (!('IntersectionObserver' in window) || !targets || !targets.length) {
          // Fallback: load on first interaction
          return window.DeferLib.loadGroupOnInteraction(urls);
        }
        var loaded = false;
        function loadAll() {
          if (loaded) return;
          loaded = true;
          for (var i = 0; i < urls.length; i++) {
            var u = urls[i];
            loadScript(u.src, u.attrs);
          }
          obs.disconnect();
        }
        var obs = new IntersectionObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              loadAll();
              break;
            }
          }
        }, { rootMargin: '200px 0px' });
        for (var j = 0; j < targets.length; j++) obs.observe(targets[j]);
        // Safety: load on idle if never viewed after 10s
        setTimeout(function(){ if(!loaded) schedule(loadAll); }, 10000);
      } catch (e) {
        // Fallback
        window.DeferLib.loadGroupOnInteraction(urls);
      }
    }
  };
})();


