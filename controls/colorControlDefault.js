// http://www.eyecon.ro/colorpicker/

;(function($) {
  if(!$.cssModyficator) {
    $.cssModyficator = {};
  };
  var NS = $.cssModyficator; // control name space
  
  /* ---------------- InputWigdet ---------------- */
  function InputWigdet(root, config, restrictions, currentValue, cb){
    var self = this;
    this.config = config;
    this.cb = cb|| function(){};
    this.wrap = $("<span class='colorInput'>");
    this.el = $("<input>");
    this.el.val(currentValue);
    this.el.attr("type", "text");
    this.el.attr("size",6);
    this.el.attr("maxlength", 6);
    this.el.change(function(){return self.cb($(this).val());});
    this.wrap.append(this.el);
    root.append(this.wrap);

    this.el.ColorPicker({
	    onSubmit: function(hsb, hex, rgb, el) {
		    $(self.el).val(hex);
		    $(self.el).ColorPickerHide();
		    $(self.el).change();
	    },
	    onBeforeShow: function () {
		    $(this).ColorPickerSetColor("#"+this.value);
	    },
	    onShow: function (colpkr) {
		    $(colpkr).fadeIn(300);
		    return false;
	    },
	    onHide: function (colpkr) {
		    $(colpkr).fadeOut(300);
		    return false;
	    },
	    onChange: function (hsb, hex, rgb) {
		    $(self.el).val(hex);
        $(self.el).change();
        cb(hex);
	    }
    })
    .bind('keyup', function(){
	    $(this).ColorPickerSetColor(this.value);
    });

  }
  InputWigdet.prototype.setCurrentValue = function(value){
    this.el.val(value);
  }
  InputWigdet.prototype.getCurrentValue = function(){
    return this.el.val();
  }
  /* ---------------- /InputWigdet ---------------- */
  
  /* ---------------- ColorPickerWigdet ---------------- */
  function ColorPickerWigdet(root, config, restrictions, currentValue, cb){
    var self = this;
    this.config = config;
    this.cb = cb;
    this.el = $("<div class='colorSelector'>");
    root.append(this.el);
    $(this.el).css("background-color", "#"+currentValue);
    
    this.el.ColorPicker({
      //flat: true,
      color: "#"+currentValue,

	    onBeforeShow: function () {
	      var c = colorToHex($(self.el).css("background-color"));
		    $(this).ColorPickerSetColor(c);
	    },
	    onShow: function (colpkr) {
		    $(colpkr).fadeIn(300);
		    return false;
	    },
	    onHide: function (colpkr) {
		    $(colpkr).fadeOut(300);
		    return false;
	    },
	    onChange: function (hsb, hex, rgb) {
        cb(hex);
        self.el.css("background-color", hex);
	    }
    });
  }
  ColorPickerWigdet.prototype.setCurrentValue = function(value){
    $(this.el).css("background-color", value);
  }
  ColorPickerWigdet.prototype.getCurrentValue = function(){
    return $(this.el).css("background-color").substr(1);
  }
  /* ---------------- /ColorPickerWigdet ---------------- */
  
  
  /* ---------------- ColorControlDefault ---------------- */
  NS.ColorControlDefault = function(root, config, onChange){
    var self = this;
    this.config = $.extend({}, NS.ColorControlDefault.defaultOptions, config);
    var wigdetClass = NS.ColorControlDefault.wigdets[this.config.wigdet.type];
    var currentValue = this.getCurrentValue();
    var cb = function(value){
      self.onChange(value);
      onChange(self.config.selector ,value);
    };
    this.wigdet = new wigdetClass(root, this.config.wigdet.config, this.config.restrictions, currentValue, cb);
    root.append(this.wigdet.el);
  }
  NS.ColorControlDefault.prototype.validate = function(value){
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
  }
  NS.ColorControlDefault.prototype.getCurrentValue = function (){
    return colorToHex($(this.config.selector).css(this.config.optionName));
  }
  NS.ColorControlDefault.prototype.setCurrentValue = function(value){
    this.wigdet.setCurrentValue(value);
    return $(this.config.selector).css(this.config.optionName, value+this.config.unit);
  }
  NS.ColorControlDefault.prototype.onChange = function(value){
    value = "#"+value;
    if(this.validate(value)){
      this.setCurrentValue(value);
    }else{
      this.wigdet.setCurrentValue(this.getCurrentValue());
    }
  }
  

  
  /* ---------------- /ColorControlDefault ---------------- */
  function colorToHex(color){
    var hex = NS.ColorControlDefault.defaultOptions.defaultValue;
    if(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)){
      hex = color;
    }else{
      var r = /rgba?\((\d+), ?(\d+), ?(\d+)(, \d+)?\)/;
      var res = r.exec(color)
      if(res){
        hex = ""+componentToHex(res[1])+componentToHex(res[2])+componentToHex(res[3]);
      }
    }
    return hex;
  }
  function componentToHex(c) {
    var hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  NS.ColorControlDefault.defaultOptions = {
    selector: "",
    optionName: "",
    restrictions: {},
    defaultValue: "#ffffff",
    unit: "",
    wigdet: {
      type: "default",
      config: {}
    }
  };
  NS.ColorControlDefault.wigdets = { // register default widget
    default: InputWigdet,
    InputWigdet: InputWigdet,
    ColorPickerWigdet: ColorPickerWigdet
  }
})( jQuery );
