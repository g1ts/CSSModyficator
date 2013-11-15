;(function($) {
    var pluginName = "cssModyficator";
    var defaults = {
      storage: $.cookie||null,
      localStorage: true, // save data to LS (selectors will be used as keys)
      localStorageKeyPrefix: pluginName+"_"+location.toString()+"_",
      controls: []
    };

    if(!$[pluginName]) {
      $[pluginName] = {};
    };

    var NS = $[pluginName];
   
    // конструктор плагина
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
        // this.element this.options
        var self = this;
        var root = $(this.element);
        for(var i in config.controls){
          var elConf = config.controls[i];
          if(elConf.control && NS[elConf.control]){
            (function(){
              var wrap = $("<div class='CSSMWigdetWrap'>");
              wrap.append(elConf.title);
              var key = elConf.selector+"_"+elConf.optionName;
              var c = new NS[elConf.control](wrap, elConf, function(selector, vaule){self.onChange(key, vaule);});
              wrap.append(elConf.unit);
              root.append(wrap);
              var storedValue = self.getStoredValue(key);
              if(storedValue){
                c.setCurrentValue(storedValue);
              }
            })();
          }
        }
    };
    
    Plugin.prototype.onChange = function(key, vaule){
      if(this.options.localStorage && isLocalStorageAvailable()){
        window['localStorage'].setItem(this.options.localStorageKeyPrefix+key, vaule);
      }
    }
    Plugin.prototype.getStoredValue = function(key){
      if(this.options.localStorage && isLocalStorageAvailable()){
        return window['localStorage'].getItem(this.options.localStorageKeyPrefix+key);
      }
      return null;
    }
    function isLocalStorageAvailable() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    $.fn[pluginName] = function(options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    };
})( jQuery );
