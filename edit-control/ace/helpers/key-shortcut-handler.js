define(["require","jquery","helpers/helpers-web"],function(e){var t=e("jquery"),n=e("helpers/helpers-web");return n.createClass({_oShortcuts:null,_bIsOpen:!1,__init__:function(){this._oShortcuts={},t("body").on("keydown",n.createCallback(this,this._onKeyDown)),t("#shortcut-overlay").on("mousedown",n.createCallback(this,this._close))},registerShortcut:function(e,t,r,i){n.assert(e.length==1,"A shortcut must be one char long."),this._oShortcuts[e.toUpperCase().charCodeAt(0)]={jElem:t,sAccel:e.toUpperCase(),sPos:r,iOffset:i||0}},_onKeyDown:function(e){var t=e.keyCode||e.which;if(!this._bIsOpen&&t==186&&e.ctrlKey){this._open();return}if(this._bIsOpen&&t==27)this._close();else if(this._bIsOpen&&t in this._oShortcuts){var n=this._oShortcuts[t].jElem;if(n.is("button"))n.click();else{var r='input:not([disabled],[type="hidden"]),button:not([disabled]), a, select:not([disabled]), textarea:not([disabled])';n.find(r)[0].focus()}this._close(),e.preventDefault()}},_open:function(){for(var e in this._oShortcuts){var n=this._oShortcuts[e],r=t('<div class="shortcut"></div>');r.text(n.sAccel);var i=n.jElem;i.prepend(r),r.css("margin-top",(i.height()-r.outerHeight())/2+"px");var s=r.outerWidth()/2;if(n["sPos"]=="left"){var o=parseInt(i.css("padding-left"));r.css("margin-left",-o-s+n.iOffset+2+"px")}else{var u=parseInt(i.css("padding-right")),a=i.width();r.css("margin-left",u+a-s-n.iOffset-2+"px")}}t("#shortcut-overlay").show(),this._bIsOpen=!0},_close:function(){t(".shortcut").remove(),t("#shortcut-overlay").hide(),this._bIsOpen=!1}})});