;(function($) {
  if(!$.cssModyficator) {
    $.cssModyficator = {};
  };
  var NS = $.cssModyficator; // control name space
  
  /* ---------------- InputWigdet ---------------- */
  function InputWigdet(root, config, restrictions, currentValue, cb){
    var self = this;
    this.config = config;
    this.cb = cb;
    this.el = $("<input>");
    this.el.val(currentValue);
    this.el.attr("type", "number");
    if(restrictions.min && restrictions.min != -Infinity){
      this.el.attr("min", restrictions.min);
    }
    if(restrictions.max && restrictions.max != Infinity){
      this.el.attr("max", restrictions.max);
    }
    this.el.change(function(){return self.cb($(this).val());});
    root.append(this.el);
  }
  InputWigdet.prototype.setCurrentValue = function(value){
    this.el.val(value);
  }
  InputWigdet.prototype.getCurrentValue = function(){
    return this.el.val();
  }
  /* ---------------- /InputWigdet ---------------- */
  
  /* ---------------- NumberControlDefault ---------------- */
  NS.NumberControlDefault = function(root, config, onChange){
    var self = this;
    this.config = $.extend({}, NS.NumberControlDefault.defaultOptions, config);
    var wigdetClass = NS.NumberControlDefault.wigdets[this.config.wigdet.type];
    var currentValue = this.getCurrentValue();
    this.wigdet = new wigdetClass(root, this.config.wigdet.config, this.config.restrictions, currentValue, function(value){
      self.onChange(value);
      onChange(self.config.selector ,value); 
    });
    root.append(this.wigdet);
  }
  NS.NumberControlDefault.prototype.validate = function(value){
    return (value>=this.config.restrictions.min && value<=this.config.restrictions.max);
  }
  NS.NumberControlDefault.prototype.getCurrentValue = function (){
    return parseInt($(this.config.selector).css(this.config.optionName));
  }
  NS.NumberControlDefault.prototype.setCurrentValue = function(value){
    this.wigdet.setCurrentValue(value);
    return $(this.config.selector).css(this.config.optionName, value+this.config.unit);
  }
  NS.NumberControlDefault.prototype.onChange = function(value){
    if(this.validate(value)){
      this.setCurrentValue(value);
    }else{
      this.wigdet.setCurrentValue(this.getCurrentValue());
    }
  }
  /* ---------------- /NumberControlDefault ---------------- */
  NS.NumberControlDefault.defaultOptions = {
    selector: "",
    optionName: "",
    restrictions: {
      min: -Infinity,
      max: Infinity
    },
    wigdet: {
      type: "default",
      config: {}
    }
  };
  NS.NumberControlDefault.wigdets = { // register default widget
    default: InputWigdet
  }
})( jQuery );
