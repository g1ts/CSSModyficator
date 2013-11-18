;(function($) {
  if(!$.cssModyficator) {
    $.cssModyficator = {};
  };
  var NS = $.cssModyficator; // control name space

  /* ---------------- SelectWidget ---------------- */
  function SelectWidget(root, config, values, restrictions, currentValue, cb){
    var self = this;
    this.config = config || {};
    this.cb = cb;
    this.el = $("<select>");
    for(var i in values){
      this.el.append("<option value='"+i+"'>"+values[i]+"</option>");
    }
    if(this.config.defaulValue){
      this.el.val(this.config.defaulValue);
    }else{
      this.el.val(currentValue);
    }
    this.el.change(function(){return self.cb($(this).val());});
    root.append(this.el);
    //this.el.change();
  }
  SelectWidget.prototype.setCurrentValue = function(value){
    this.el.val(value);
  }
  SelectWidget.prototype.getCurrentValue = function(){
    return this.el.val();
  }
  /* ---------------- /SelectWidget ---------------- */

  /* ---------------- EnumControlDefault ---------------- */
  NS.EnumControlDefault = function(root, config, onChange){
    var self = this;
    this.config = $.extend({}, NS.EnumControlDefault.defaultOptions, config);
    var widgetClass = NS.EnumControlDefault.widgets[this.config.widget.type];
    var currentValue = this.getCurrentValue();
    this.widget = new widgetClass(root, this.config.widget.config, this.config.values, this.config.restrictions, currentValue, function(value){
      self.onChange(value);
      onChange(self.config.selector ,value); 
    });
    root.append(this.widget);
  }
  NS.EnumControlDefault.prototype.validate = function(value){
    return (typeof this.config.values[value] === "string");
  }
  NS.EnumControlDefault.prototype.getCurrentValue = function (){
    return $(this.config.selector).css(this.config.optionName);
  }
  NS.EnumControlDefault.prototype.setCurrentValue = function(value){
    this.widget.setCurrentValue(value);
    return $(this.config.selector).css(this.config.optionName, value+this.config.unit);
  }
  NS.EnumControlDefault.prototype.onChange = function(value){
    if(this.validate(value)){
      this.setCurrentValue(value);
    }else{
      this.widget.setCurrentValue(this.getCurrentValue());
    }
  }
  /* ---------------- /EnumControlDefault ---------------- */
  NS.EnumControlDefault.defaultOptions = {
      selector: "",
      optionName: "",
      unit: "",
      values: {},
      widget: {
        type: "default",
        config: {}
      }
    };
    NS.EnumControlDefault.widgets = {
      default: SelectWidget
    }
    
})( jQuery );
