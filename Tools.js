// ToolsAccordion.js - version 0.15 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.Accordion=function(element,opts)
{this.element=this.getElement(element);this.defaultPanel=0;this.hoverClass="AccordionPanelTabHover";this.openClass="AccordionPanelOpen";this.closedClass="AccordionPanelClosed";this.focusedClass="AccordionFocused";this.enableAnimation=true;this.enableKeyboardNavigation=true;this.currentPanel=null;this.animator=null;this.hasFocus=null;this.previousPanelKeyCode=Tools.Widget.Accordion.KEY_UP;this.nextPanelKeyCode=Tools.Widget.Accordion.KEY_DOWN;this.useFixedPanelHeights=true;this.fixedPanelHeight=0;Tools.Widget.Accordion.setOptions(this,opts,true);this.attachBehaviors();};Tools.Widget.Accordion.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.Accordion.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.Accordion.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.Accordion.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Accordion.prototype.onPanelTabMouseOver=function(e,panel)
{if(panel)
this.addClassName(this.getPanelTab(panel),this.hoverClass);return false;};Tools.Widget.Accordion.prototype.onPanelTabMouseOut=function(e,panel)
{if(panel)
this.removeClassName(this.getPanelTab(panel),this.hoverClass);return false;};Tools.Widget.Accordion.prototype.openPanel=function(elementOrIndex)
{var panelA=this.currentPanel;var panelB;if(typeof elementOrIndex=="number")
panelB=this.getPanels()[elementOrIndex];else
panelB=this.getElement(elementOrIndex);if(!panelB||panelA==panelB)
return null;var contentA=panelA?this.getPanelContent(panelA):null;var contentB=this.getPanelContent(panelB);if(!contentB)
return null;if(this.useFixedPanelHeights&&!this.fixedPanelHeight)
this.fixedPanelHeight=(contentA.offsetHeight)?contentA.offsetHeight:contentA.scrollHeight;if(this.enableAnimation)
{if(this.animator)
this.animator.stop();this.animator=new Tools.Widget.Accordion.PanelAnimator(this,panelB,{duration:this.duration,fps:this.fps,transition:this.transition});this.animator.start();}
else
{if(contentA)
{contentA.style.display="none";contentA.style.height="0px";}
contentB.style.display="block";contentB.style.height=this.useFixedPanelHeights?this.fixedPanelHeight+"px":"auto";}
if(panelA)
{this.removeClassName(panelA,this.openClass);this.addClassName(panelA,this.closedClass);}
this.removeClassName(panelB,this.closedClass);this.addClassName(panelB,this.openClass);this.currentPanel=panelB;return panelB;};Tools.Widget.Accordion.prototype.closePanel=function()
{if(!this.useFixedPanelHeights&&this.currentPanel)
{var panel=this.currentPanel;var content=this.getPanelContent(panel);if(content)
{if(this.enableAnimation)
{if(this.animator)
this.animator.stop();this.animator=new Tools.Widget.Accordion.PanelAnimator(this,null,{duration:this.duration,fps:this.fps,transition:this.transition});this.animator.start();}
else
{content.style.display="none";content.style.height="0px";}}
this.removeClassName(panel,this.openClass);this.addClassName(panel,this.closedClass);this.currentPanel=null;}};Tools.Widget.Accordion.prototype.openNextPanel=function()
{return this.openPanel(this.getCurrentPanelIndex()+1);};Tools.Widget.Accordion.prototype.openPreviousPanel=function()
{return this.openPanel(this.getCurrentPanelIndex()-1);};Tools.Widget.Accordion.prototype.openFirstPanel=function()
{return this.openPanel(0);};Tools.Widget.Accordion.prototype.openLastPanel=function()
{var panels=this.getPanels();return this.openPanel(panels[panels.length-1]);};Tools.Widget.Accordion.prototype.onPanelTabClick=function(e,panel)
{if(panel!=this.currentPanel)
this.openPanel(panel);else
this.closePanel();if(this.enableKeyboardNavigation)
this.focus();if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Tools.Widget.Accordion.prototype.onFocus=function(e)
{this.hasFocus=true;this.addClassName(this.element,this.focusedClass);return false;};Tools.Widget.Accordion.prototype.onBlur=function(e)
{this.hasFocus=false;this.removeClassName(this.element,this.focusedClass);return false;};Tools.Widget.Accordion.KEY_UP=38;Tools.Widget.Accordion.KEY_DOWN=40;Tools.Widget.Accordion.prototype.onKeyDown=function(e)
{var key=e.keyCode;if(!this.hasFocus||(key!=this.previousPanelKeyCode&&key!=this.nextPanelKeyCode))
return true;var panels=this.getPanels();if(!panels||panels.length<1)
return false;var currentPanel=this.currentPanel?this.currentPanel:panels[0];var nextPanel=(key==this.nextPanelKeyCode)?currentPanel.nextSibling:currentPanel.previousSibling;while(nextPanel)
{if(nextPanel.nodeType==1)
break;nextPanel=(key==this.nextPanelKeyCode)?nextPanel.nextSibling:nextPanel.previousSibling;}
if(nextPanel&&currentPanel!=nextPanel)
this.openPanel(nextPanel);if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Tools.Widget.Accordion.prototype.attachPanelHandlers=function(panel)
{if(!panel)
return;var tab=this.getPanelTab(panel);if(tab)
{var self=this;Tools.Widget.Accordion.addEventListener(tab,"click",function(e){return self.onPanelTabClick(e,panel);},false);Tools.Widget.Accordion.addEventListener(tab,"mouseover",function(e){return self.onPanelTabMouseOver(e,panel);},false);Tools.Widget.Accordion.addEventListener(tab,"mouseout",function(e){return self.onPanelTabMouseOut(e,panel);},false);}};Tools.Widget.Accordion.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Tools.Widget.Accordion.prototype.initPanel=function(panel,isDefault)
{var content=this.getPanelContent(panel);if(isDefault)
{this.currentPanel=panel;this.removeClassName(panel,this.closedClass);this.addClassName(panel,this.openClass);if(content)
{if(this.useFixedPanelHeights)
{if(this.fixedPanelHeight)
content.style.height=this.fixedPanelHeight+"px";}
else
{content.style.height="auto";}}}
else
{this.removeClassName(panel,this.openClass);this.addClassName(panel,this.closedClass);if(content)
{content.style.height="0px";content.style.display="none";}}
this.attachPanelHandlers(panel);};Tools.Widget.Accordion.prototype.attachBehaviors=function()
{var panels=this.getPanels();for(var i=0;i<panels.length;i++)
this.initPanel(panels[i],i==this.defaultPanel);this.enableKeyboardNavigation=(this.enableKeyboardNavigation&&this.element.attributes.getNamedItem("tabindex"));if(this.enableKeyboardNavigation)
{var self=this;Tools.Widget.Accordion.addEventListener(this.element,"focus",function(e){return self.onFocus(e);},false);Tools.Widget.Accordion.addEventListener(this.element,"blur",function(e){return self.onBlur(e);},false);Tools.Widget.Accordion.addEventListener(this.element,"keydown",function(e){return self.onKeyDown(e);},false);}};Tools.Widget.Accordion.prototype.getPanels=function()
{return this.getElementChildren(this.element);};Tools.Widget.Accordion.prototype.getCurrentPanel=function()
{return this.currentPanel;};Tools.Widget.Accordion.prototype.getPanelIndex=function(panel)
{var panels=this.getPanels();for(var i=0;i<panels.length;i++)
{if(panel==panels[i])
return i;}
return-1;};Tools.Widget.Accordion.prototype.getCurrentPanelIndex=function()
{return this.getPanelIndex(this.currentPanel);};Tools.Widget.Accordion.prototype.getPanelTab=function(panel)
{if(!panel)
return null;return this.getElementChildren(panel)[0];};Tools.Widget.Accordion.prototype.getPanelContent=function(panel)
{if(!panel)
return null;return this.getElementChildren(panel)[1];};Tools.Widget.Accordion.prototype.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Tools.Widget.Accordion.prototype.focus=function()
{if(this.element&&this.element.focus)
this.element.focus();};Tools.Widget.Accordion.prototype.blur=function()
{if(this.element&&this.element.blur)
this.element.blur();};Tools.Widget.Accordion.PanelAnimator=function(accordion,panel,opts)
{this.timer=null;this.interval=0;this.fps=60;this.duration=500;this.startTime=0;this.transition=Tools.Widget.Accordion.PanelAnimator.defaultTransition;this.onComplete=null;this.panel=panel;this.panelToOpen=accordion.getElement(panel);this.panelData=[];this.useFixedPanelHeights=accordion.useFixedPanelHeights;Tools.Widget.Accordion.setOptions(this,opts,true);this.interval=Math.floor(1000/this.fps);var panels=accordion.getPanels();for(var i=0;i<panels.length;i++)
{var p=panels[i];var c=accordion.getPanelContent(p);if(c)
{var h=c.offsetHeight;if(h==undefined)
h=0;if(p==panel&&h==0)
c.style.display="block";if(p==panel||h>0)
{var obj=new Object;obj.panel=p;obj.content=c;obj.fromHeight=h;obj.toHeight=(p==panel)?(accordion.useFixedPanelHeights?accordion.fixedPanelHeight:c.scrollHeight):0;obj.distance=obj.toHeight-obj.fromHeight;obj.overflow=c.style.overflow;this.panelData.push(obj);c.style.overflow="hidden";c.style.height=h+"px";}}}};Tools.Widget.Accordion.PanelAnimator.defaultTransition=function(time,begin,finish,duration){time/=duration;return begin+((2-time)*time*finish);};Tools.Widget.Accordion.PanelAnimator.prototype.start=function()
{var self=this;this.startTime=(new Date).getTime();this.timer=setTimeout(function(){self.stepAnimation();},this.interval);};Tools.Widget.Accordion.PanelAnimator.prototype.stop=function()
{if(this.timer)
{clearTimeout(this.timer);for(i=0;i<this.panelData.length;i++)
{obj=this.panelData[i];obj.content.style.overflow=obj.overflow;}}
this.timer=null;};Tools.Widget.Accordion.PanelAnimator.prototype.stepAnimation=function()
{var curTime=(new Date).getTime();var elapsedTime=curTime-this.startTime;var i,obj;if(elapsedTime>=this.duration)
{for(i=0;i<this.panelData.length;i++)
{obj=this.panelData[i];if(obj.panel!=this.panel)
{obj.content.style.display="none";obj.content.style.height="0px";}
obj.content.style.overflow=obj.overflow;obj.content.style.height=(this.useFixedPanelHeights||obj.toHeight==0)?obj.toHeight+"px":"auto";}
if(this.onComplete)
this.onComplete();return;}
for(i=0;i<this.panelData.length;i++)
{obj=this.panelData[i];var ht=this.transition(elapsedTime,obj.fromHeight,obj.distance,this.duration);obj.content.style.height=((ht<0)?0:ht)+"px";}
var self=this;this.timer=setTimeout(function(){self.stepAnimation();},this.interval);};
// ToolsAutoSuggest.js - version 0.91 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;this.version=parseFloat(r[2]);}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Tools.is=new Tools.Widget.BrowserSniff();Tools.Widget.AutoSuggest=function(region,sRegion,dataset,field,options)
{if(!this.isBrowserSupported())
return;options=options||{};this.init(region,sRegion,dataset,field);Tools.Widget.Utils.setOptions(this,options);if(Tools.Widget.AutoSuggest.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.AutoSuggest.loadQueue.push(this);this.dataset.addObserver(this);var regionID=Tools.Widget.Utils.getElementID(sRegion);var self=this;this._notifyDataset={onPostUpdate:function(){self.attachClickBehaviors();},onPreUpdate:function(){self.removeClickBehaviours();}};Tools.Data.Region.addObserver(regionID,this._notifyDataset);Tools.Widget.Utils.addEventListener(window,'unload',function(){self.destroy()},false);this.attachClickBehaviors();this.handleKeyUp(null);this.showSuggestions(false);};Tools.Widget.AutoSuggest.prototype.init=function(region,sRegion,dataset,field)
{this.region=Tools.Widget.Utils.getElement(region);if(!this.region)
return;this.minCharsType=false;this.containsString=false;this.loadFromServer=false;this.urlParam='';this.suggestionIsVisible=false;this.stopFocus=false;this.hasFocus=false;this.showSuggestClass='showSuggestClass';this.hideSuggestClass='hideSuggestClass';this.hoverSuggestClass='hoverSuggestClass';this.movePrevKeyCode=Tools.Widget.AutoSuggest.KEY_UP;this.moveNextKeyCode=Tools.Widget.AutoSuggest.KEY_DOWN;this.textElement=Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.region,"INPUT");this.textElement.setAttribute('AutoComplete','off');this.suggestRegion=Tools.Widget.Utils.getElement(sRegion);Tools.Widget.Utils.makePositioned(this.suggestRegion);Tools.Widget.Utils.addClassName(this.suggestRegion,this.hideSuggestClass);this.timerID=null;if(typeof dataset=="string"){this.dataset=window[dataset];}else{this.dataset=dataset;}
this.field=field;if(typeof field=='string'&&field.indexOf(',')!=-1)
{field=field.replace(/\s*,\s*/ig,',');this.field=field.split(',');}};Tools.Widget.AutoSuggest.prototype.isBrowserSupported=function()
{return Tools.is.ie&&Tools.is.v>=5&&Tools.is.windows||Tools.is.mozilla&&Tools.is.v>=1.4||Tools.is.safari||Tools.is.opera&&Tools.is.v>=9;};Tools.Widget.AutoSuggest.prototype.getValue=function()
{if(!this.textElement)
return'';return this.textElement.value;};Tools.Widget.AutoSuggest.prototype.setValue=function(str)
{if(!this.textElement)
return;this.textElement.value=str;this.showSuggestions(false);};Tools.Widget.AutoSuggest.prototype.focus=function()
{if(!this.textElement)
return;this.textElement.focus();};Tools.Widget.AutoSuggest.prototype.showSuggestions=function(doShow)
{if(this.region&&this.isVisibleSuggestion()!=doShow)
{if(doShow&&this.hasFocus)
{Tools.Widget.Utils.addClassName(this.region,this.showSuggestClass);if(Tools.is.ie&&Tools.is.version<7)
this.createIframeLayer(this.suggestRegion);}
else
{if(Tools.is.ie&&Tools.is.version<7)
this.removeIframeLayer();Tools.Widget.Utils.removeClassName(this.region,this.showSuggestClass);}}
this.suggestionIsVisible=Tools.Widget.Utils.hasClassName(this.region,this.showSuggestClass);};Tools.Widget.AutoSuggest.prototype.isVisibleSuggestion=function()
{return this.suggestionIsVisible;};Tools.Widget.AutoSuggest.prototype.onDataChanged=function(el)
{var data=el.getData(true);var val=this.getValue();this.showSuggestions(data&&(!this.minCharsType||val.length>=this.minCharsType)&&(data.length>1||(data.length==1&&this.childs[0]&&this.childs[0].attributes.getNamedItem("spry:suggest").value!=this.getValue())));};Tools.Widget.AutoSuggest.prototype.nodeMouseOver=function(e,node)
{var l=this.childs.length;for(var i=0;i<l;i++)
if(this.childs[i]!=node&&Tools.Widget.Utils.hasClassName(this.childs[i],this.hoverSuggestClass))
{Tools.Widget.Utils.removeClassName(this.childs[i],this.hoverSuggestClass);break;}};Tools.Widget.AutoSuggest.prototype.nodeClick=function(e,value)
{if(value)
this.setValue(value);};Tools.Widget.AutoSuggest.prototype.handleKeyUp=function(e)
{if(this.timerID)
{clearTimeout(this.timerID);this.timerID=null;}
if(e&&this.isSpecialKey(e))
{this.handleSpecialKeys(e);return;}
var self=this;var func=function(){self.timerID=null;self.loadDataSet();};if(!this.loadFromServer)
func=function(){self.timerID=null;self.filterDataSet();};this.timerID=setTimeout(func,200);};Tools.Widget.AutoSuggest.prototype.scrollVisible=function(el)
{if(typeof this.scrolParent=='undefined')
{var currEl=el;this.scrolParent=false;while(!this.scrolParent)
{var overflow=Tools.Widget.Utils.getStyleProp(currEl,'overflow');if(!overflow||overflow.toLowerCase()=='scroll')
{this.scrolParent=currEl;break;}
if(currEl==this.region)
break;currEl=currEl.parentNode;}}
if(this.scrolParent!=false)
{var h=parseInt(Tools.Widget.Utils.getStyleProp(this.scrolParent,'height'),10);if(el.offsetTop<this.scrolParent.scrollTop)
this.scrolParent.scrollTop=el.offsetTop;else if(el.offsetTop+el.offsetHeight>this.scrolParent.scrollTop+h)
{this.scrolParent.scrollTop=el.offsetTop+el.offsetHeight-h+5;if(this.scrolParent.scrollTop<0)
this.scrolParent.scrollTop=0;}}};Tools.Widget.AutoSuggest.KEY_UP=38;Tools.Widget.AutoSuggest.KEY_DOWN=40;Tools.Widget.AutoSuggest.prototype.handleSpecialKeys=function(e){switch(e.keyCode)
{case this.moveNextKeyCode:case this.movePrevKeyCode:if(!(this.childs.length>0)||!this.getValue())
return;var prev=this.childs.length-1;var next=false;var found=false;var data=this.dataset.getData();if(this.childs.length>1||(data&&data.length==1&&this.childs[0]&&this.childs[0].attributes.getNamedItem('spry:suggest').value!=this.getValue()))
{this.showSuggestions(true);}
else
return;var utils=Tools.Widget.Utils;for(var k=0;k<this.childs.length;k++)
{if(next)
{utils.addClassName(this.childs[k],this.hoverSuggestClass);this.scrollVisible(this.childs[k]);break;}
if(utils.hasClassName(this.childs[k],this.hoverSuggestClass))
{utils.removeClassName(this.childs[k],this.hoverSuggestClass);found=true;if(e.keyCode==this.moveNextKeyCode)
{next=true;continue;}
else
{utils.addClassName(this.childs[prev],this.hoverSuggestClass);this.scrollVisible(this.childs[prev]);break;}}
prev=k;}
if(!found||(next&&k==this.childs.length))
{utils.addClassName(this.childs[0],this.hoverSuggestClass);this.scrollVisible(this.childs[0]);}
utils.stopEvent(e);break;case 27:this.showSuggestions(false);break;case 13:if(!this.isVisibleSuggestion())
return;for(var k=0;k<this.childs.length;k++)
if(Tools.Widget.Utils.hasClassName(this.childs[k],this.hoverSuggestClass))
{var attr=this.childs[k].attributes.getNamedItem('spry:suggest');if(attr){this.setValue(attr.value);this.handleKeyUp(null);}
Tools.Widget.Utils.stopEvent(e);return false;}
break;case 9:this.showSuggestions(false);}
return;};Tools.Widget.AutoSuggest.prototype.filterDataSet=function()
{var contains=this.containsString;var columnName=this.field;var val=this.getValue();if(this.previousString&&this.previousString==val)
return;this.previousString=val;if(!val||(this.minCharsType&&this.minCharsType>val.length))
{this.dataset.filter(function(ds,row,rowNumber){return null;});this.showSuggestions(false);return;}
var regExpStr=Tools.Widget.Utils.escapeRegExp(val);if(!contains)
regExpStr="^"+regExpStr;var regExp=new RegExp(regExpStr,"ig");if(this.maxListItems>0)
this.dataset.maxItems=this.maxListItems;var filterFunc=function(ds,row,rowNumber)
{if(ds.maxItems>0&&ds.maxItems<=ds.data.length)
return null;if(typeof columnName=='object')
{var l=columnName.length;for(var i=0;i<l;i++)
{var str=row[columnName[i]];if(str&&str.search(regExp)!=-1)
return row;}}
else
{var str=row[columnName];if(str&&str.search(regExp)!=-1)
return row;}
return null;};this.dataset.filter(filterFunc);var data=this.dataset.getData();this.showSuggestions(data&&(!this.minCharsType||val.length>=this.minCharsType)&&(data.length>1||(data.length==1&&this.childs[0]&&this.childs[0].attributes.getNamedItem('spry:suggest').value!=val)));};Tools.Widget.AutoSuggest.prototype.loadDataSet=function()
{var val=this.getValue();var ds=this.dataset;ds.cancelLoadData();ds.useCache=false;if(!val||(this.minCharsType&&this.minCharsType>val.length))
{this.showSuggestions(false);return;}
if(this.previousString&&this.previousString==val)
{var data=ds.getData();this.showSuggestions(data&&(data.length>1||(data.length==1&&this.childs[0].attributes.getNamedItem("spry:suggest").value!=val)));return;}
this.previousString=val;var url=Tools.Widget.Utils.addReplaceParam(ds.url,this.urlParam,val);ds.setURL(url);ds.loadData();};Tools.Widget.AutoSuggest.prototype.addMouseListener=function(node,value)
{var self=this;var addListener=Tools.Widget.Utils.addEventListener;addListener(node,"click",function(e){return self.nodeClick(e,value);self.handleKeyUp(null);},false);addListener(node,"mouseover",function(e){Tools.Widget.Utils.addClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);addListener(node,"mouseout",function(e){Tools.Widget.Utils.removeClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);};Tools.Widget.AutoSuggest.prototype.removeMouseListener=function(node,value)
{var self=this;var removeListener=Tools.Widget.Utils.removeEventListener;removeListener(node,"click",function(e){self.nodeClick(e,value);self.handleKeyUp(null);},false);removeListener(node,"mouseover",function(e){Tools.Widget.Utils.addClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);removeListener(node,"mouseout",function(e){Tools.Widget.Utils.removeClassName(node,self.hoverSuggestClass);self.nodeMouseOver(e,node)},false);};Tools.Widget.AutoSuggest.prototype.attachClickBehaviors=function()
{var self=this;var valNodes=Tools.Utils.getNodesByFunc(this.region,function(node)
{if(node.nodeType==1)
{var attr=node.attributes.getNamedItem("spry:suggest");if(attr){self.addMouseListener(node,attr.value);return true;}}
return false;});this.childs=valNodes;};Tools.Widget.AutoSuggest.prototype.removeClickBehaviours=function()
{var self=this;var valNodes=Tools.Utils.getNodesByFunc(this.region,function(node)
{if(node.nodeType==1)
{var attr=node.attributes.getNamedItem("spry:suggest");if(attr){self.removeMouseListener(node,attr.value);return true;}}
return false;});};Tools.Widget.AutoSuggest.prototype.destroy=function(){this.removeClickBehaviours();Tools.Data.Region.removeObserver(Tools.Widget.Utils.getElementID(this.suggestRegion),this._notifyDataset);if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
for(var k in this)
{if(typeof this[k]!='function'){try{delete this[k];}catch(err){}}}};Tools.Widget.AutoSuggest.onloadDidFire=false;Tools.Widget.AutoSuggest.loadQueue=[];Tools.Widget.AutoSuggest.processLoadQueue=function(handler)
{Tools.Widget.AutoSuggest.onloadDidFire=true;var q=Tools.Widget.AutoSuggest.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.AutoSuggest.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.AutoSuggest.addLoadListener(Tools.Widget.AutoSuggest.processLoadQueue);Tools.Widget.AutoSuggest.prototype.attachBehaviors=function()
{this.event_handlers=[];var self=this;var _notifyKeyUp=function(e){self.handleKeyUp(e)};this.event_handlers.push([this.textElement,"keydown",_notifyKeyUp]);this.event_handlers.push([this.textElement,"focus",function(e){if(self.stopFocus){self.handleKeyUp(e);}self.hasFocus=true;self.stopFocus=false;}]);this.event_handlers.push([this.textElement,"drop",_notifyKeyUp]);this.event_handlers.push([this.textElement,"dragdrop",_notifyKeyUp]);var _notifyBlur=false;if(Tools.is.opera){_notifyBlur=function(e){setTimeout(function(){if(!self.clickInList){self.showSuggestions(false);}else{self.stopFocus=true;self.textElement.focus();}self.clickInList=false;self.hasFocus=false;},100);};}else{_notifyBlur=function(e){if(!self.clickInList){self.showSuggestions(false);}else{self.stopFocus=true;self.textElement.focus();}self.clickInList=false;self.hasFocus=false;};}
this.event_handlers.push([this.textElement,"blur",_notifyBlur]);this.event_handlers.push([this.suggestRegion,"mousedown",function(e){self.clickInList=true;}]);for(var i=0;i<this.event_handlers.length;i++)
Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);};Tools.Widget.AutoSuggest.prototype.createIframeLayer=function(element)
{if(typeof this.iframeLayer=='undefined')
{var layer=document.createElement('iframe');layer.tabIndex='-1';layer.src='javascript:"";';layer.scrolling='no';layer.frameBorder='0';layer.className='iframeSuggest';element.parentNode.appendChild(layer);this.iframeLayer=layer;}
this.iframeLayer.style.left=element.offsetLeft+'px';this.iframeLayer.style.top=element.offsetTop+'px';this.iframeLayer.style.width=element.offsetWidth+'px';this.iframeLayer.style.height=element.offsetHeight+'px';this.iframeLayer.style.display='block';};Tools.Widget.AutoSuggest.prototype.removeIframeLayer=function()
{if(this.iframeLayer)
this.iframeLayer.style.display='none';};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.specialSafariNavKeys=",63232,63233,63234,63235,63272,63273,63275,63276,63277,63289,";Tools.Widget.Utils.specialCharacters=",9,13,27,38,40,";Tools.Widget.Utils.specialCharacters+=",33,34,35,36,37,39,45,46,";Tools.Widget.Utils.specialCharacters+=",16,17,18,19,20,144,145,";Tools.Widget.Utils.specialCharacters+=",112,113,114,115,116,117,118,119,120,121,122,123,";Tools.Widget.Utils.specialCharacters+=Tools.Widget.Utils.specialSafariNavKeys;Tools.Widget.AutoSuggest.prototype.isSpecialKey=function(ev)
{return Tools.Widget.Utils.specialCharacters.indexOf(","+ev.keyCode+",")!=-1||this.moveNextKeyCode==ev.keyCode||this.movePrevKeyCode==ev.keyCode;};Tools.Widget.Utils.getElementID=function(el)
{if(typeof el=='string'&&el)
return el;return el.getAttribute('id');};Tools.Widget.Utils.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.Utils.addReplaceParam=function(url,param,paramValue)
{var uri='';var qstring='';var i=url.indexOf('?');if(i!=-1)
{uri=url.slice(0,i);qstring=url.slice(i+1);}
else
uri=url;qstring=qstring.replace('?','');var arg=qstring.split("&");if(param.lastIndexOf('/')!=-1)
param=param.slice(param.lastIndexOf('/')+1);for(i=0;i<arg.length;i++)
{var k=arg[i].split('=');if((k[0]&&k[0]==decodeURI(param))||arg[i]==decodeURI(param))
arg[i]=null;}
arg[arg.length]=encodeURIComponent(param)+'='+encodeURIComponent(paramValue);qstring='';for(i=0;i<arg.length;i++)
if(arg[i])
qstring+='&'+arg[i];qstring=qstring.slice(1);url=uri+'?'+qstring;return url;};Tools.Widget.Utils.addClassName=function(ele,clssName)
{if(!ele)return;if(!ele.className)ele.className='';if(!ele||ele.className.search(new RegExp("\\b"+clssName+"\\b"))!=-1)
return;ele.className+=' '+clssName;};Tools.Widget.Utils.removeClassName=function(ele,className)
{if(!ele)return;if(!ele.className)
{ele.className='';return;}
ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),'');};Tools.Widget.Utils.hasClassName=function(ele,className)
{if(!ele||!className)
return false;if(!ele.className)
ele.className='';return ele.className.search(new RegExp("\\s*\\b"+className+"\\b"))!=-1;};Tools.Widget.Utils.addEventListener=function(el,eventType,handler,capture)
{try
{if(el.addEventListener)
el.addEventListener(eventType,handler,capture);else if(el.attachEvent)
el.attachEvent("on"+eventType,handler,capture);}catch(e){}};Tools.Widget.Utils.removeEventListener=function(el,eventType,handler,capture)
{try
{if(el.removeEventListener)
el.removeEventListener(eventType,handler,capture);else if(el.detachEvent)
el.detachEvent("on"+eventType,handler,capture);}catch(e){}};Tools.Widget.Utils.stopEvent=function(ev)
{ev.cancelBubble=true;ev.returnValue=false;try
{this.stopPropagation(ev);}catch(e){}
try{this.preventDefault(ev);}catch(e){}};Tools.Widget.Utils.stopPropagation=function(ev)
{if(ev.stopPropagation)
ev.stopPropagation();else
ev.cancelBubble=true;};Tools.Widget.Utils.preventDefault=function(ev)
{if(ev.preventDefault)
ev.preventDefault();else
ev.returnValue=false;};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(typeof ignoreUndefinedProps!='undefined'&&ignoreUndefinedProps&&typeof optionsObj[optionName]=='undefined')
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.firstValid=function()
{var ret=null;for(var i=0;i<Tools.Widget.Utils.firstValid.arguments.length;i++)
if(typeof Tools.Widget.Utils.firstValid.arguments[i]!='undefined')
{ret=Tools.Widget.Utils.firstValid.arguments[i];break;}
return ret;};Tools.Widget.Utils.camelize=function(stringToCamelize)
{var oStringList=stringToCamelize.split('-');var isFirstEntry=true;var camelizedString='';for(var i=0;i<oStringList.length;i++)
{if(oStringList[i].length>0)
{if(isFirstEntry)
{camelizedString=oStringList[i];isFirstEntry=false;}
else
{var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}}}
return camelizedString;};Tools.Widget.Utils.getStyleProp=function(element,prop)
{var value;var camel=Tools.Widget.Utils.camelize(prop);try
{value=element.style[camel];if(!value)
{if(document.defaultView&&document.defaultView.getComputedStyle)
{var css=document.defaultView.getComputedStyle(element,null);value=css?css.getPropertyValue(prop):null;}
else
if(element.currentStyle)
value=element.currentStyle[camel];}}
catch(e){}
return value=='auto'?null:value;};Tools.Widget.Utils.makePositioned=function(element)
{var pos=Tools.Widget.Utils.getStyleProp(element,'position');if(!pos||pos=='static')
{element.style.position='relative';if(window.opera)
{element.style.top=0;element.style.left=0;}}};Tools.Widget.Utils.escapeRegExp=function(rexp)
{return rexp.replace(/([\.\/\]\[\{\}\(\)\\\$\^\?\*\|\!\=\+\-])/g,'\\$1');};Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel=function(node,nodeName)
{var elements=node.getElementsByTagName(nodeName);if(elements)
return elements[0];return null;};
// ToolsCollapsiblePanel.js - version 0.7 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.CollapsiblePanel=function(element,opts)
{this.element=this.getElement(element);this.focusElement=null;this.hoverClass="CollapsiblePanelTabHover";this.openClass="CollapsiblePanelOpen";this.closedClass="CollapsiblePanelClosed";this.focusedClass="CollapsiblePanelFocused";this.enableAnimation=true;this.enableKeyboardNavigation=true;this.animator=null;this.hasFocus=false;this.contentIsOpen=true;this.openPanelKeyCode=Tools.Widget.CollapsiblePanel.KEY_DOWN;this.closePanelKeyCode=Tools.Widget.CollapsiblePanel.KEY_UP;Tools.Widget.CollapsiblePanel.setOptions(this,opts);this.attachBehaviors();};Tools.Widget.CollapsiblePanel.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.CollapsiblePanel.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.CollapsiblePanel.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.CollapsiblePanel.prototype.hasClassName=function(ele,className)
{if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)
return false;return true;};Tools.Widget.CollapsiblePanel.prototype.setDisplay=function(ele,display)
{if(ele)
ele.style.display=display;};Tools.Widget.CollapsiblePanel.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.CollapsiblePanel.prototype.onTabMouseOver=function(e)
{this.addClassName(this.getTab(),this.hoverClass);return false;};Tools.Widget.CollapsiblePanel.prototype.onTabMouseOut=function(e)
{this.removeClassName(this.getTab(),this.hoverClass);return false;};Tools.Widget.CollapsiblePanel.prototype.open=function()
{this.contentIsOpen=true;if(this.enableAnimation)
{if(this.animator)
this.animator.stop();this.animator=new Tools.Widget.CollapsiblePanel.PanelAnimator(this,true,{duration:this.duration,fps:this.fps,transition:this.transition});this.animator.start();}
else
this.setDisplay(this.getContent(),"block");this.removeClassName(this.element,this.closedClass);this.addClassName(this.element,this.openClass);};Tools.Widget.CollapsiblePanel.prototype.close=function()
{this.contentIsOpen=false;if(this.enableAnimation)
{if(this.animator)
this.animator.stop();this.animator=new Tools.Widget.CollapsiblePanel.PanelAnimator(this,false,{duration:this.duration,fps:this.fps,transition:this.transition});this.animator.start();}
else
this.setDisplay(this.getContent(),"none");this.removeClassName(this.element,this.openClass);this.addClassName(this.element,this.closedClass);};Tools.Widget.CollapsiblePanel.prototype.onTabClick=function(e)
{if(this.isOpen())
this.close();else
this.open();this.focus();return this.stopPropagation(e);};Tools.Widget.CollapsiblePanel.prototype.onFocus=function(e)
{this.hasFocus=true;this.addClassName(this.element,this.focusedClass);return false;};Tools.Widget.CollapsiblePanel.prototype.onBlur=function(e)
{this.hasFocus=false;this.removeClassName(this.element,this.focusedClass);return false;};Tools.Widget.CollapsiblePanel.KEY_UP=38;Tools.Widget.CollapsiblePanel.KEY_DOWN=40;Tools.Widget.CollapsiblePanel.prototype.onKeyDown=function(e)
{var key=e.keyCode;if(!this.hasFocus||(key!=this.openPanelKeyCode&&key!=this.closePanelKeyCode))
return true;if(this.isOpen()&&key==this.closePanelKeyCode)
this.close();else if(key==this.openPanelKeyCode)
this.open();return this.stopPropagation(e);};Tools.Widget.CollapsiblePanel.prototype.stopPropagation=function(e)
{if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Tools.Widget.CollapsiblePanel.prototype.attachPanelHandlers=function()
{var tab=this.getTab();if(!tab)
return;var self=this;Tools.Widget.CollapsiblePanel.addEventListener(tab,"click",function(e){return self.onTabClick(e);},false);Tools.Widget.CollapsiblePanel.addEventListener(tab,"mouseover",function(e){return self.onTabMouseOver(e);},false);Tools.Widget.CollapsiblePanel.addEventListener(tab,"mouseout",function(e){return self.onTabMouseOut(e);},false);if(this.enableKeyboardNavigation)
{var tabIndexEle=null;var tabAnchorEle=null;this.preorderTraversal(tab,function(node){if(node.nodeType==1)
{var tabIndexAttr=tab.attributes.getNamedItem("tabindex");if(tabIndexAttr)
{tabIndexEle=node;return true;}
if(!tabAnchorEle&&node.nodeName.toLowerCase()=="a")
tabAnchorEle=node;}
return false;});if(tabIndexEle)
this.focusElement=tabIndexEle;else if(tabAnchorEle)
this.focusElement=tabAnchorEle;if(this.focusElement)
{Tools.Widget.CollapsiblePanel.addEventListener(this.focusElement,"focus",function(e){return self.onFocus(e);},false);Tools.Widget.CollapsiblePanel.addEventListener(this.focusElement,"blur",function(e){return self.onBlur(e);},false);Tools.Widget.CollapsiblePanel.addEventListener(this.focusElement,"keydown",function(e){return self.onKeyDown(e);},false);}}};Tools.Widget.CollapsiblePanel.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Tools.Widget.CollapsiblePanel.prototype.preorderTraversal=function(root,func)
{var stopTraversal=false;if(root)
{stopTraversal=func(root);if(root.hasChildNodes())
{var child=root.firstChild;while(!stopTraversal&&child)
{stopTraversal=this.preorderTraversal(child,func);try{child=child.nextSibling;}catch(e){child=null;}}}}
return stopTraversal;};Tools.Widget.CollapsiblePanel.prototype.attachBehaviors=function()
{var panel=this.element;var tab=this.getTab();var content=this.getContent();if(this.contentIsOpen||this.hasClassName(panel,this.openClass))
{this.addClassName(panel,this.openClass);this.removeClassName(panel,this.closedClass);this.setDisplay(content,"block");this.contentIsOpen=true;}
else
{this.removeClassName(panel,this.openClass);this.addClassName(panel,this.closedClass);this.setDisplay(content,"none");this.contentIsOpen=false;}
this.attachPanelHandlers();};Tools.Widget.CollapsiblePanel.prototype.getTab=function()
{return this.getElementChildren(this.element)[0];};Tools.Widget.CollapsiblePanel.prototype.getContent=function()
{return this.getElementChildren(this.element)[1];};Tools.Widget.CollapsiblePanel.prototype.isOpen=function()
{return this.contentIsOpen;};Tools.Widget.CollapsiblePanel.prototype.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Tools.Widget.CollapsiblePanel.prototype.focus=function()
{if(this.focusElement&&this.focusElement.focus)
this.focusElement.focus();};Tools.Widget.CollapsiblePanel.PanelAnimator=function(panel,doOpen,opts)
{this.timer=null;this.interval=0;this.fps=60;this.duration=500;this.startTime=0;this.transition=Tools.Widget.CollapsiblePanel.PanelAnimator.defaultTransition;this.onComplete=null;this.panel=panel;this.content=panel.getContent();this.doOpen=doOpen;Tools.Widget.CollapsiblePanel.setOptions(this,opts,true);this.interval=Math.floor(1000/this.fps);var c=this.content;var curHeight=c.offsetHeight?c.offsetHeight:0;this.fromHeight=(doOpen&&c.style.display=="none")?0:curHeight;if(!doOpen)
this.toHeight=0;else
{if(c.style.display=="none")
{c.style.visibility="hidden";c.style.display="block";}
c.style.height="";this.toHeight=c.offsetHeight;}
this.distance=this.toHeight-this.fromHeight;this.overflow=c.style.overflow;c.style.height=this.fromHeight+"px";c.style.visibility="visible";c.style.overflow="hidden";c.style.display="block";};Tools.Widget.CollapsiblePanel.PanelAnimator.defaultTransition=function(time,begin,finish,duration){time/=duration;return begin+((2-time)*time*finish);};Tools.Widget.CollapsiblePanel.PanelAnimator.prototype.start=function()
{var self=this;this.startTime=(new Date).getTime();this.timer=setTimeout(function(){self.stepAnimation();},this.interval);};Tools.Widget.CollapsiblePanel.PanelAnimator.prototype.stop=function()
{if(this.timer)
{clearTimeout(this.timer);this.content.style.overflow=this.overflow;}
this.timer=null;};Tools.Widget.CollapsiblePanel.PanelAnimator.prototype.stepAnimation=function()
{var curTime=(new Date).getTime();var elapsedTime=curTime-this.startTime;if(elapsedTime>=this.duration)
{if(!this.doOpen)
this.content.style.display="none";this.content.style.overflow=this.overflow;this.content.style.height=this.toHeight+"px";if(this.onComplete)
this.onComplete();return;}
var ht=this.transition(elapsedTime,this.fromHeight,this.distance,this.duration);this.content.style.height=((ht<0)?0:ht)+"px";var self=this;this.timer=setTimeout(function(){self.stepAnimation();},this.interval);};Tools.Widget.CollapsiblePanelGroup=function(element,opts)
{this.element=this.getElement(element);this.opts=opts;this.attachBehaviors();};Tools.Widget.CollapsiblePanelGroup.prototype.setOptions=Tools.Widget.CollapsiblePanel.prototype.setOptions;Tools.Widget.CollapsiblePanelGroup.prototype.getElement=Tools.Widget.CollapsiblePanel.prototype.getElement;Tools.Widget.CollapsiblePanelGroup.prototype.getElementChildren=Tools.Widget.CollapsiblePanel.prototype.getElementChildren;Tools.Widget.CollapsiblePanelGroup.prototype.setElementWidget=function(element,widget)
{if(!element||!widget)
return;if(!element.spry)
element.spry=new Object;element.spry.collapsiblePanel=widget;};Tools.Widget.CollapsiblePanelGroup.prototype.getElementWidget=function(element)
{return(element&&element.spry&&element.spry.collapsiblePanel)?element.spry.collapsiblePanel:null;};Tools.Widget.CollapsiblePanelGroup.prototype.getPanels=function()
{if(!this.element)
return[];return this.getElementChildren(this.element);};Tools.Widget.CollapsiblePanelGroup.prototype.getPanel=function(panelIndex)
{return this.getPanels()[panelIndex];};Tools.Widget.CollapsiblePanelGroup.prototype.attachBehaviors=function()
{if(!this.element)
return;var cpanels=this.getPanels();var numCPanels=cpanels.length;for(var i=0;i<numCPanels;i++)
{var cpanel=cpanels[i];this.setElementWidget(cpanel,new Tools.Widget.CollapsiblePanel(cpanel,this.opts));}};Tools.Widget.CollapsiblePanelGroup.prototype.openPanel=function(panelIndex)
{var w=this.getElementWidget(this.getPanel(panelIndex));if(w&&!w.isOpen())
w.open();};Tools.Widget.CollapsiblePanelGroup.prototype.closePanel=function(panelIndex)
{var w=this.getElementWidget(this.getPanel(panelIndex));if(w&&w.isOpen())
w.close();};Tools.Widget.CollapsiblePanelGroup.prototype.openAllPanels=function()
{var cpanels=this.getPanels();var numCPanels=cpanels.length;for(var i=0;i<numCPanels;i++)
{var w=this.getElementWidget(cpanels[i]);if(w&&!w.isOpen())
w.open();}};Tools.Widget.CollapsiblePanelGroup.prototype.closeAllPanels=function()
{var cpanels=this.getPanels();var numCPanels=cpanels.length;for(var i=0;i<numCPanels;i++)
{var w=this.getElementWidget(cpanels[i]);if(w&&w.isOpen())
w.close();}};
// ToolsData.js - version 0.45 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Utils)Tools.Utils={};Tools.Utils.msProgIDs=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0"];Tools.Utils.createXMLHttpRequest=function()
{var req=null;try
{if(window.ActiveXObject)
{while(!req&&Tools.Utils.msProgIDs.length)
{try{req=new ActiveXObject(Tools.Utils.msProgIDs[0]);}catch(e){req=null;}
if(!req)
Tools.Utils.msProgIDs.splice(0,1);}}
if(!req&&window.XMLHttpRequest)
req=new XMLHttpRequest();}
catch(e){req=null;}
if(!req)
Tools.Debug.reportError("Failed to create an XMLHttpRequest object!");return req;};Tools.Utils.loadURL=function(method,url,async,callback,opts)
{var req=new Tools.Utils.loadURL.Request();req.method=method;req.url=url;req.async=async;req.successCallback=callback;Tools.Utils.setOptions(req,opts);try
{req.xhRequest=Tools.Utils.createXMLHttpRequest();if(!req.xhRequest)
return null;if(req.async)
req.xhRequest.onreadystatechange=function(){Tools.Utils.loadURL.callback(req);};req.xhRequest.open(req.method,req.url,req.async,req.username,req.password);if(req.headers)
{for(var name in req.headers)
req.xhRequest.setRequestHeader(name,req.headers[name]);}
req.xhRequest.send(req.postData);if(!req.async)
Tools.Utils.loadURL.callback(req);}
catch(e)
{if(req.errorCallback)
req.errorCallback(req);else
Tools.Debug.reportError("Exception caught while loading "+url+": "+e);req=null;}
return req;};Tools.Utils.loadURL.callback=function(req)
{if(!req||req.xhRequest.readyState!=4)
return;if(req.successCallback&&(req.xhRequest.status==200||req.xhRequest.status==0))
req.successCallback(req);else if(req.errorCallback)
req.errorCallback(req);};Tools.Utils.loadURL.Request=function()
{var props=Tools.Utils.loadURL.Request.props;var numProps=props.length;for(var i=0;i<numProps;i++)
this[props[i]]=null;this.method="GET";this.async=true;this.headers={};};Tools.Utils.loadURL.Request.props=["method","url","async","username","password","postData","successCallback","errorCallback","headers","userData","xhRequest"];Tools.Utils.loadURL.Request.prototype.extractRequestOptions=function(opts,undefineRequestProps)
{if(!opts)
return;var props=Tools.Utils.loadURL.Request.props;var numProps=props.length;for(var i=0;i<numProps;i++)
{var prop=props[i];if(opts[prop]!=undefined)
{this[prop]=opts[prop];if(undefineRequestProps)
opts[prop]=undefined;}}};Tools.Utils.loadURL.Request.prototype.clone=function()
{var props=Tools.Utils.loadURL.Request.props;var numProps=props.length;var req=new Tools.Utils.loadURL.Request;for(var i=0;i<numProps;i++)
req[props[i]]=this[props[i]];if(this.headers)
{req.headers={};Tools.Utils.setOptions(req.headers,this.headers);}
return req;};Tools.Utils.setInnerHTML=function(ele,str,preventScripts)
{if(!ele)
return;ele=Tools.$(ele);var scriptExpr="<script[^>]*>(.|\s|\n|\r)*?</script>";ele.innerHTML=str.replace(new RegExp(scriptExpr,"img"),"");if(preventScripts)
return;var matches=str.match(new RegExp(scriptExpr,"img"));if(matches)
{var numMatches=matches.length;for(var i=0;i<numMatches;i++)
{var s=matches[i].replace(/<script[^>]*>[\s\r\n]*(<\!--)?|(-->)?[\s\r\n]*<\/script>/img,"");Tools.Utils.eval(s);}}};Tools.Utils.updateContent=function(ele,url,finishFunc,opts)
{Tools.Utils.loadURL("GET",url,true,function(req)
{Tools.Utils.setInnerHTML(ele,req.xhRequest.responseText);if(finishFunc)
finishFunc(ele,url);},opts);};if(!Tools.$$)
{Tools.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{element=Tools.$(element);if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Tools.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{element=Tools.$(element);if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler);}
catch(e){}};Tools.Utils.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Utils.addClassName=function(ele,className)
{ele=Tools.$(ele);if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Utils.removeClassName=function(ele,className)
{ele=Tools.$(ele);if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Utils.getObjectByName=function(name)
{var result=null;if(name)
{var lu=window;var objPath=name.split(".");for(var i=0;lu&&i<objPath.length;i++)
{result=lu[objPath[i]];lu=result;}}
return result;};Tools.$=function(element)
{if(arguments.length>1)
{for(var i=0,elements=[],length=arguments.length;i<length;i++)
elements.push(Tools.$(arguments[i]));return elements;}
if(typeof element=='string')
element=document.getElementById(element);return element;};}
Tools.Utils.eval=function(str)
{return eval(str);};Tools.Utils.escapeQuotesAndLineBreaks=function(str)
{if(str)
{str=str.replace(/\\/g,"\\\\");str=str.replace(/["']/g,"\\$&");str=str.replace(/\n/g,"\\n");str=str.replace(/\r/g,"\\r");}
return str;};Tools.Utils.encodeEntities=function(str)
{if(str&&str.search(/[&<>"]/)!=-1)
{str=str.replace(/&/g,"&amp;");str=str.replace(/</g,"&lt;");str=str.replace(/>/g,"&gt;");str=str.replace(/"/g,"&quot;");}
return str};Tools.Utils.decodeEntities=function(str)
{var d=Tools.Utils.decodeEntities.div;if(!d)
{d=document.createElement('div');Tools.Utils.decodeEntities.div=d;if(!d)return str;}
d.innerHTML=str;if(d.childNodes.length==1&&d.firstChild.nodeType==3&&d.firstChild.nextSibling==null)
str=d.firstChild.data;else
{str=str.replace(/&lt;/gi,"<");str=str.replace(/&gt;/gi,">");str=str.replace(/&quot;/gi,"\"");str=str.replace(/&amp;/gi,"&");}
return str;};Tools.Utils.fixupIETagAttributes=function(inStr)
{var outStr="";var tagStart=inStr.match(/^<[^\s>]+\s*/)[0];var tagEnd=inStr.match(/\s*\/?>$/)[0];var tagAttrs=inStr.replace(/^<[^\s>]+\s*|\s*\/?>/g,"");outStr+=tagStart;if(tagAttrs)
{var startIndex=0;var endIndex=0;while(startIndex<tagAttrs.length)
{while(tagAttrs.charAt(endIndex)!='='&&endIndex<tagAttrs.length)
++endIndex;if(endIndex>=tagAttrs.length)
{outStr+=tagAttrs.substring(startIndex,endIndex);break;}
++endIndex;outStr+=tagAttrs.substring(startIndex,endIndex);startIndex=endIndex;if(tagAttrs.charAt(endIndex)=='"'||tagAttrs.charAt(endIndex)=="'")
{var savedIndex=endIndex++;while(endIndex<tagAttrs.length)
{if(tagAttrs.charAt(endIndex)==tagAttrs.charAt(savedIndex))
{endIndex++;break;}
else if(tagAttrs.charAt(endIndex)=="\\")
endIndex++;endIndex++;}
outStr+=tagAttrs.substring(startIndex,endIndex);startIndex=endIndex;}
else
{outStr+="\"";var sIndex=tagAttrs.slice(endIndex).search(/\s/);endIndex=(sIndex!=-1)?(endIndex+sIndex):tagAttrs.length;outStr+=tagAttrs.slice(startIndex,endIndex);outStr+="\"";startIndex=endIndex;}}}
outStr+=tagEnd;return outStr;};Tools.Utils.fixUpIEInnerHTML=function(inStr)
{var outStr="";var regexp=new RegExp("<\\!--|<\\!\\[CDATA\\[|<\\w+[^<>]*>|-->|\\]\\](>|\&gt;)","g");var searchStartIndex=0;var skipFixUp=0;while(inStr.length)
{var results=regexp.exec(inStr);if(!results||!results[0])
{outStr+=inStr.substr(searchStartIndex,inStr.length-searchStartIndex);break;}
if(results.index!=searchStartIndex)
{outStr+=inStr.substr(searchStartIndex,results.index-searchStartIndex);}
if(results[0]=="<!--"||results[0]=="<![CDATA[")
{++skipFixUp;outStr+=results[0];}
else if(results[0]=="-->"||results[0]=="]]>"||(skipFixUp&&results[0]=="]]&gt;"))
{--skipFixUp;outStr+=results[0];}
else if(!skipFixUp&&results[0].charAt(0)=='<')
outStr+=Tools.Utils.fixupIETagAttributes(results[0]);else
outStr+=results[0];searchStartIndex=regexp.lastIndex;}
return outStr;};Tools.Utils.stringToXMLDoc=function(str)
{var xmlDoc=null;try
{var xmlDOMObj=new ActiveXObject("Microsoft.XMLDOM");xmlDOMObj.async=false;xmlDOMObj.loadXML(str);xmlDoc=xmlDOMObj;}
catch(e)
{try
{var domParser=new DOMParser;xmlDoc=domParser.parseFromString(str,'text/xml');}
catch(e)
{Tools.Debug.reportError("Caught exception in Tools.Utils.stringToXMLDoc(): "+e+"\n");xmlDoc=null;}}
return xmlDoc;};Tools.Utils.serializeObject=function(obj)
{var str="";var firstItem=true;if(obj==null||obj==undefined)
return str+obj;var objType=typeof obj;if(objType=="number"||objType=="boolean")
str+=obj;else if(objType=="string")
str+="\""+Tools.Utils.escapeQuotesAndLineBreaks(obj)+"\"";else if(obj.constructor==Array)
{str+="[";for(var i=0;i<obj.length;i++)
{if(!firstItem)
str+=", ";str+=Tools.Utils.serializeObject(obj[i]);firstItem=false;}
str+="]";}
else if(objType=="object")
{str+="{";for(var p in obj)
{if(!firstItem)
str+=", ";str+="\""+p+"\": "+Tools.Utils.serializeObject(obj[p]);firstItem=false;}
str+="}";}
return str;};Tools.Utils.getNodesByFunc=function(root,func)
{var nodeStack=new Array;var resultArr=new Array;var node=root;while(node)
{if(func(node))
resultArr.push(node);if(node.hasChildNodes())
{nodeStack.push(node);node=node.firstChild;}
else
{if(node==root)
node=null;else
try{node=node.nextSibling;}catch(e){node=null;};}
while(!node&&nodeStack.length>0)
{node=nodeStack.pop();if(node==root)
node=null;else
try{node=node.nextSibling;}catch(e){node=null;}}}
if(nodeStack&&nodeStack.length>0)
Tools.Debug.trace("-- WARNING: Tools.Utils.getNodesByFunc() failed to traverse all nodes!\n");return resultArr;};Tools.Utils.getFirstChildWithNodeName=function(node,nodeName)
{var child=node.firstChild;while(child)
{if(child.nodeName==nodeName)
return child;child=child.nextSibling;}
return null;};Tools.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Utils.SelectionManager={};Tools.Utils.SelectionManager.selectionGroups=new Object;Tools.Utils.SelectionManager.SelectionGroup=function()
{this.selectedElements=new Array;};Tools.Utils.SelectionManager.SelectionGroup.prototype.select=function(element,className,multiSelect)
{var selObj=null;if(!multiSelect)
{this.clearSelection();}
else
{for(var i=0;i<this.selectedElements.length;i++)
{selObj=this.selectedElements[i].element;if(selObj.element==element)
{if(selObj.className!=className)
{Tools.Utils.removeClassName(element,selObj.className);Tools.Utils.addClassName(element,className);}
return;}}}
selObj=new Object;selObj.element=element;selObj.className=className;this.selectedElements.push(selObj);Tools.Utils.addClassName(element,className);};Tools.Utils.SelectionManager.SelectionGroup.prototype.unSelect=function(element)
{for(var i=0;i<this.selectedElements.length;i++)
{var selObj=this.selectedElements[i].element;if(selObj.element==element)
{Tools.Utils.removeClassName(selObj.element,selObj.className);return;}}};Tools.Utils.SelectionManager.SelectionGroup.prototype.clearSelection=function()
{var selObj=null;do
{selObj=this.selectedElements.shift();if(selObj)
Tools.Utils.removeClassName(selObj.element,selObj.className);}
while(selObj);};Tools.Utils.SelectionManager.getSelectionGroup=function(selectionGroupName)
{if(!selectionGroupName)
return null;var groupObj=Tools.Utils.SelectionManager.selectionGroups[selectionGroupName];if(!groupObj)
{groupObj=new Tools.Utils.SelectionManager.SelectionGroup();Tools.Utils.SelectionManager.selectionGroups[selectionGroupName]=groupObj;}
return groupObj;};Tools.Utils.SelectionManager.select=function(selectionGroupName,element,className,multiSelect)
{var groupObj=Tools.Utils.SelectionManager.getSelectionGroup(selectionGroupName);if(!groupObj)
return;groupObj.select(element,className,multiSelect);};Tools.Utils.SelectionManager.unSelect=function(selectionGroupName,element)
{var groupObj=Tools.Utils.SelectionManager.getSelectionGroup(selectionGroupName);if(!groupObj)
return;groupObj.unSelect(element,className);};Tools.Utils.SelectionManager.clearSelection=function(selectionGroupName)
{var groupObj=Tools.Utils.SelectionManager.getSelectionGroup(selectionGroupName);if(!groupObj)
return;groupObj.clearSelection();};Tools.Utils.Notifier=function()
{this.observers=[];this.suppressNotifications=0;};Tools.Utils.Notifier.prototype.addObserver=function(observer)
{if(!observer)
return;var len=this.observers.length;for(var i=0;i<len;i++)
{if(this.observers[i]==observer)
return;}
this.observers[len]=observer;};Tools.Utils.Notifier.prototype.removeObserver=function(observer)
{if(!observer)
return;for(var i=0;i<this.observers.length;i++)
{if(this.observers[i]==observer)
{this.observers.splice(i,1);break;}}};Tools.Utils.Notifier.prototype.notifyObservers=function(methodName,data)
{if(!methodName)
return;if(!this.suppressNotifications)
{var len=this.observers.length;for(var i=0;i<len;i++)
{var obs=this.observers[i];if(obs)
{if(typeof obs=="function")
obs(methodName,this,data);else if(obs[methodName])
obs[methodName](this,data);}}}};Tools.Utils.Notifier.prototype.enableNotifications=function()
{if(--this.suppressNotifications<0)
{this.suppressNotifications=0;Tools.Debug.reportError("Unbalanced enableNotifications() call!\n");}};Tools.Utils.Notifier.prototype.disableNotifications=function()
{++this.suppressNotifications;};Tools.Debug={};Tools.Debug.enableTrace=true;Tools.Debug.debugWindow=null;Tools.Debug.onloadDidFire=false;Tools.Utils.addLoadListener(function(){Tools.Debug.onloadDidFire=true;Tools.Debug.flushQueuedMessages();});Tools.Debug.flushQueuedMessages=function()
{if(Tools.Debug.flushQueuedMessages.msgs)
{var msgs=Tools.Debug.flushQueuedMessages.msgs;for(var i=0;i<msgs.length;i++)
Tools.Debug.debugOut(msgs[i].msg,msgs[i].color);Tools.Debug.flushQueuedMessages.msgs=null;}};Tools.Debug.createDebugWindow=function()
{if(!Tools.Debug.enableTrace||Tools.Debug.debugWindow||!Tools.Debug.onloadDidFire)
return;try
{Tools.Debug.debugWindow=document.createElement("div");var div=Tools.Debug.debugWindow;div.style.fontSize="12px";div.style.fontFamily="console";div.style.position="absolute";div.style.width="400px";div.style.height="300px";div.style.overflow="auto";div.style.border="solid 1px black";div.style.backgroundColor="white";div.style.color="black";div.style.bottom="0px";div.style.right="0px";div.setAttribute("id","ToolsDebugWindow");document.body.appendChild(Tools.Debug.debugWindow);}
catch(e){}};Tools.Debug.debugOut=function(str,bgColor)
{if(!Tools.Debug.debugWindow)
{Tools.Debug.createDebugWindow();if(!Tools.Debug.debugWindow)
{if(!Tools.Debug.flushQueuedMessages.msgs)
Tools.Debug.flushQueuedMessages.msgs=new Array;Tools.Debug.flushQueuedMessages.msgs.push({msg:str,color:bgColor});return;}}
var d=document.createElement("div");if(bgColor)
d.style.backgroundColor=bgColor;d.innerHTML=str;Tools.Debug.debugWindow.appendChild(d);};Tools.Debug.trace=function(str)
{Tools.Debug.debugOut(str);};Tools.Debug.reportError=function(str)
{Tools.Debug.debugOut(str,"red");};Tools.Data={};Tools.Data.regionsArray={};Tools.Data.initRegionsOnLoad=true;Tools.Data.initRegions=function(rootNode)
{rootNode=rootNode?Tools.$(rootNode):document.body;var lastRegionFound=null;var regions=Tools.Utils.getNodesByFunc(rootNode,function(node)
{try
{if(node.nodeType!=1)
return false;var attrName="spry:region";var attr=node.attributes.getNamedItem(attrName);if(!attr)
{attrName="spry:detailregion";attr=node.attributes.getNamedItem(attrName);}
if(attr)
{if(lastRegionFound)
{var parent=node.parentNode;while(parent)
{if(parent==lastRegionFound)
{Tools.Debug.reportError("Found a nested "+attrName+" in the following markup. Nested regions are currently not supported.<br/><pre>"+Tools.Utils.encodeEntities(parent.innerHTML)+"</pre>");return false;}
parent=parent.parentNode;}}
if(attr.value)
{attr=node.attributes.getNamedItem("id");if(!attr||!attr.value)
{node.setAttribute("id","spryregion"+(++Tools.Data.initRegions.nextUniqueRegionID));}
lastRegionFound=node;return true;}
else
Tools.Debug.reportError(attrName+" attributes require one or more data set names as values!");}}
catch(e){}
return false;});var name,dataSets,i;var newRegions=[];for(i=0;i<regions.length;i++)
{var rgn=regions[i];var isDetailRegion=false;name=rgn.attributes.getNamedItem("id").value;attr=rgn.attributes.getNamedItem("spry:region");if(!attr)
{attr=rgn.attributes.getNamedItem("spry:detailregion");isDetailRegion=true;}
if(!attr.value)
{Tools.Debug.reportError("spry:region and spry:detailregion attributes require one or more data set names as values!");continue;}
rgn.attributes.removeNamedItem(attr.nodeName);Tools.Utils.removeClassName(rgn,Tools.Data.Region.hiddenRegionClassName);dataSets=Tools.Data.Region.strToDataSetsArray(attr.value);if(!dataSets.length)
{Tools.Debug.reportError("spry:region or spry:detailregion attribute has no data set!");continue;}
var hasBehaviorAttributes=false;var hasToolsContent=false;var dataStr="";var parent=null;var regionStates={};var regionStateMap={};attr=rgn.attributes.getNamedItem("spry:readystate");if(attr&&attr.value)
regionStateMap["ready"]=attr.value;attr=rgn.attributes.getNamedItem("spry:errorstate");if(attr&&attr.value)
regionStateMap["error"]=attr.value;attr=rgn.attributes.getNamedItem("spry:loadingstate");if(attr&&attr.value)
regionStateMap["loading"]=attr.value;attr=rgn.attributes.getNamedItem("spry:expiredstate");if(attr&&attr.value)
regionStateMap["expired"]=attr.value;var piRegions=Tools.Utils.getNodesByFunc(rgn,function(node)
{try
{if(node.nodeType==1)
{var attributes=node.attributes;var numPI=Tools.Data.Region.PI.orderedInstructions.length;var lastStartComment=null;var lastEndComment=null;for(var i=0;i<numPI;i++)
{var piName=Tools.Data.Region.PI.orderedInstructions[i];var attr=attributes.getNamedItem(piName);if(!attr)
continue;var piDesc=Tools.Data.Region.PI.instructions[piName];var childrenOnly=(node==rgn)?true:piDesc.childrenOnly;var openTag=piDesc.getOpenTag(node,piName);var closeTag=piDesc.getCloseTag(node,piName);if(childrenOnly)
{var oComment=document.createComment(openTag);var cComment=document.createComment(closeTag);if(!lastStartComment)
node.insertBefore(oComment,node.firstChild);else
node.insertBefore(oComment,lastStartComment.nextSibling);lastStartComment=oComment;if(!lastEndComment)
node.appendChild(cComment);else
node.insertBefore(cComment,lastEndComment);lastEndComment=cComment;}
else
{var parent=node.parentNode;parent.insertBefore(document.createComment(openTag),node);parent.insertBefore(document.createComment(closeTag),node.nextSibling);}
if(piName=="spry:state")
regionStates[attr.value]=true;node.removeAttribute(piName);}
if(Tools.Data.Region.enableBehaviorAttributes)
{var bAttrs=Tools.Data.Region.behaviorAttrs;for(var behaviorAttrName in bAttrs)
{var bAttr=attributes.getNamedItem(behaviorAttrName);if(bAttr)
{hasBehaviorAttributes=true;if(bAttrs[behaviorAttrName].setup)
bAttrs[behaviorAttrName].setup(node,bAttr.value);}}}}}
catch(e){}
return false;});dataStr=rgn.innerHTML;if(window.ActiveXObject&&!Tools.Data.Region.disableIEInnerHTMLFixUp&&dataStr.search(/=\{/)!=-1)
{if(Tools.Data.Region.debug)
Tools.Debug.trace("<hr />Performing IE innerHTML fix up of Region: "+name+"<br /><br />"+Tools.Utils.encodeEntities(dataStr));dataStr=Tools.Utils.fixUpIEInnerHTML(dataStr);}
if(Tools.Data.Region.debug)
Tools.Debug.trace("<hr />Region template markup for '"+name+"':<br /><br />"+Tools.Utils.encodeEntities(dataStr));if(!hasToolsContent)
{rgn.innerHTML="";}
var region=new Tools.Data.Region(rgn,name,isDetailRegion,dataStr,dataSets,regionStates,regionStateMap,hasBehaviorAttributes);Tools.Data.regionsArray[region.name]=region;newRegions.push(region);}
for(var i=0;i<newRegions.length;i++)
newRegions[i].updateContent();};Tools.Data.initRegions.nextUniqueRegionID=0;Tools.Data.updateRegion=function(regionName)
{if(!regionName||!Tools.Data.regionsArray||!Tools.Data.regionsArray[regionName])
return;try{Tools.Data.regionsArray[regionName].updateContent();}
catch(e){Tools.Debug.reportError("Tools.Data.updateRegion("+regionName+") caught an exception: "+e+"\n");}};Tools.Data.getRegion=function(regionName)
{return Tools.Data.regionsArray[regionName];};Tools.Data.updateAllRegions=function()
{if(!Tools.Data.regionsArray)
return;for(var regionName in Tools.Data.regionsArray)
Tools.Data.updateRegion(regionName);};Tools.Data.getDataSetByName=function(dataSetName)
{var ds=window[dataSetName];if(typeof ds!="object"||!ds.getData||!ds.filter)
return null;return ds;};Tools.Data.DataSet=function(options)
{Tools.Utils.Notifier.call(this);this.name="";this.internalID=Tools.Data.DataSet.nextDataSetID++;this.curRowID=0;this.data=[];this.unfilteredData=null;this.dataHash={};this.columnTypes={};this.filterFunc=null;this.filterDataFunc=null;this.distinctOnLoad=false;this.distinctFieldsOnLoad=null;this.sortOnLoad=null;this.sortOrderOnLoad="ascending";this.keepSorted=false;this.dataWasLoaded=false;this.pendingRequest=null;this.lastSortColumns=[];this.lastSortOrder="";this.loadIntervalID=0;Tools.Utils.setOptions(this,options);};Tools.Data.DataSet.prototype=new Tools.Utils.Notifier();Tools.Data.DataSet.prototype.constructor=Tools.Data.DataSet;Tools.Data.DataSet.prototype.getData=function(unfiltered)
{return(unfiltered&&this.unfilteredData)?this.unfilteredData:this.data;};Tools.Data.DataSet.prototype.getUnfilteredData=function()
{return this.getData(true);};Tools.Data.DataSet.prototype.getLoadDataRequestIsPending=function()
{return this.pendingRequest!=null;};Tools.Data.DataSet.prototype.getDataWasLoaded=function()
{return this.dataWasLoaded;};Tools.Data.DataSet.prototype.getValue=function(valueName,rowContext)
{var result=undefined;if(!rowContext)
rowContext=this.getCurrentRow();switch(valueName)
{case"ds_RowNumber":result=this.getRowNumber(rowContext);break;case"ds_RowNumberPlus1":result=this.getRowNumber(rowContext)+1;break;case"ds_RowCount":result=this.getRowCount();break;case"ds_UnfilteredRowCount":result=this.getRowCount(true);break;case"ds_CurrentRowNumber":result=this.getCurrentRowNumber();break;case"ds_CurrentRowID":result=this.getCurrentRowID();break;case"ds_EvenOddRow":result=(this.getRowNumber(rowContext)%2)?Tools.Data.Region.evenRowClassName:Tools.Data.Region.oddRowClassName;break;case"ds_SortOrder":result=this.getSortOrder();break;case"ds_SortColumn":result=this.getSortColumn();break;default:if(rowContext)
result=rowContext[valueName];break;}
return result;};Tools.Data.DataSet.prototype.setDataFromArray=function(arr,fireSyncLoad)
{this.notifyObservers("onPreLoad");this.unfilteredData=null;this.filteredData=null;this.data=[];this.dataHash={};var arrLen=arr.length;for(var i=0;i<arrLen;i++)
{var row=arr[i];if(row.ds_RowID==undefined)
row.ds_RowID=i;this.dataHash[row.ds_RowID]=row;this.data.push(row);}
this.loadData(fireSyncLoad);};Tools.Data.DataSet.prototype.loadData=function(syncLoad)
{var self=this;this.pendingRequest=new Object;this.dataWasLoaded=false;var loadCallbackFunc=function()
{self.pendingRequest=null;self.dataWasLoaded=true;self.applyColumnTypes();self.disableNotifications();self.filterAndSortData();self.enableNotifications();self.notifyObservers("onPostLoad");self.notifyObservers("onDataChanged");};if(syncLoad)
loadCallbackFunc();else
this.pendingRequest.timer=setTimeout(loadCallbackFunc,0);};Tools.Data.DataSet.prototype.filterAndSortData=function()
{if(this.filterDataFunc)
this.filterData(this.filterDataFunc,true);if(this.distinctOnLoad)
this.distinct(this.distinctFieldsOnLoad);if(this.keepSorted&&this.getSortColumn())
this.sort(this.lastSortColumns,this.lastSortOrder);else if(this.sortOnLoad)
this.sort(this.sortOnLoad,this.sortOrderOnLoad);if(this.filterFunc)
this.filter(this.filterFunc,true);if(this.data&&this.data.length>0)
this.curRowID=this.data[0]['ds_RowID'];else
this.curRowID=0;};Tools.Data.DataSet.prototype.cancelLoadData=function()
{if(this.pendingRequest&&this.pendingRequest.timer)
clearTimeout(this.pendingRequest.timer);this.pendingRequest=null;};Tools.Data.DataSet.prototype.getRowCount=function(unfiltered)
{var rows=this.getData(unfiltered);return rows?rows.length:0;};Tools.Data.DataSet.prototype.getRowByID=function(rowID)
{if(!this.data)
return null;return this.dataHash[rowID];};Tools.Data.DataSet.prototype.getRowByRowNumber=function(rowNumber,unfiltered)
{var rows=this.getData(unfiltered);if(rows&&rowNumber>=0&&rowNumber<rows.length)
return rows[rowNumber];return null;};Tools.Data.DataSet.prototype.getCurrentRow=function()
{return this.getRowByID(this.curRowID);};Tools.Data.DataSet.prototype.setCurrentRow=function(rowID)
{if(this.curRowID==rowID)
return;var nData={oldRowID:this.curRowID,newRowID:rowID};this.curRowID=rowID;this.notifyObservers("onCurrentRowChanged",nData);};Tools.Data.DataSet.prototype.getRowNumber=function(row,unfiltered)
{if(row)
{var rows=this.getData(unfiltered);if(rows&&rows.length)
{var numRows=rows.length;for(var i=0;i<numRows;i++)
{if(rows[i]==row)
return i;}}}
return-1;};Tools.Data.DataSet.prototype.getCurrentRowNumber=function()
{return this.getRowNumber(this.getCurrentRow());};Tools.Data.DataSet.prototype.getCurrentRowID=function()
{return this.curRowID;};Tools.Data.DataSet.prototype.setCurrentRowNumber=function(rowNumber)
{if(!this.data||rowNumber>=this.data.length)
{Tools.Debug.trace("Invalid row number: "+rowNumber+"\n");return;}
var rowID=this.data[rowNumber]["ds_RowID"];if(rowID==undefined||this.curRowID==rowID)
return;this.setCurrentRow(rowID);};Tools.Data.DataSet.prototype.findRowsWithColumnValues=function(valueObj,firstMatchOnly,unfiltered)
{var results=[];var rows=this.getData(unfiltered);if(rows)
{var numRows=rows.length;for(var i=0;i<numRows;i++)
{var row=rows[i];var matched=true;for(var colName in valueObj)
{if(valueObj[colName]!=row[colName])
{matched=false;break;}}
if(matched)
{if(firstMatchOnly)
return row;results.push(row);}}}
return firstMatchOnly?null:results;};Tools.Data.DataSet.prototype.setColumnType=function(columnNames,columnType)
{if(columnNames)
{if(typeof columnNames=="string")
columnNames=[columnNames];for(var i=0;i<columnNames.length;i++)
this.columnTypes[columnNames[i]]=columnType;}};Tools.Data.DataSet.prototype.getColumnType=function(columnName)
{if(this.columnTypes[columnName])
return this.columnTypes[columnName];return"string";};Tools.Data.DataSet.prototype.applyColumnTypes=function()
{var rows=this.getData(true);var numRows=rows.length;var colNames=[];if(numRows<1)
return;for(var cname in this.columnTypes)
{var ctype=this.columnTypes[cname];if(ctype!="string")
{for(var i=0;i<numRows;i++)
{var row=rows[i];var val=row[cname];if(val!=undefined)
{if(ctype=="number")
row[cname]=new Number(val);else if(ctype=="html")
row[cname]=Tools.Utils.decodeEntities(val);}}}}};Tools.Data.DataSet.prototype.distinct=function(columnNames)
{if(this.data)
{var oldData=this.data;this.data=[];this.dataHash={};var dataChanged=false;var alreadySeenHash={};var i=0;var keys=[];if(typeof columnNames=="string")
keys=[columnNames];else if(columnNames)
keys=columnNames;else
for(var recField in oldData[0])
keys[i++]=recField;for(var i=0;i<oldData.length;i++)
{var rec=oldData[i];var hashStr="";for(var j=0;j<keys.length;j++)
{recField=keys[j];if(recField!="ds_RowID")
{if(hashStr)
hashStr+=",";hashStr+=recField+":"+"\""+rec[recField]+"\"";}}
if(!alreadySeenHash[hashStr])
{this.data.push(rec);this.dataHash[rec['ds_RowID']]=rec;alreadySeenHash[hashStr]=true;}
else
dataChanged=true;}
if(dataChanged)
this.notifyObservers('onDataChanged');}};Tools.Data.DataSet.prototype.getSortColumn=function(){return(this.lastSortColumns&&this.lastSortColumns.length>0)?this.lastSortColumns[0]:"";};Tools.Data.DataSet.prototype.getSortOrder=function(){return this.lastSortOrder?this.lastSortOrder:"";};Tools.Data.DataSet.prototype.sort=function(columnNames,sortOrder)
{if(!columnNames)
return;if(typeof columnNames=="string")
columnNames=[columnNames,"ds_RowID"];else if(columnNames.length<2&&columnNames[0]!="ds_RowID")
columnNames.push("ds_RowID");if(!sortOrder)
sortOrder="toggle";if(sortOrder=="toggle")
{if(this.lastSortColumns.length>0&&this.lastSortColumns[0]==columnNames[0]&&this.lastSortOrder=="ascending")
sortOrder="descending";else
sortOrder="ascending";}
if(sortOrder!="ascending"&&sortOrder!="descending")
{Tools.Debug.reportError("Invalid sort order type specified: "+sortOrder+"\n");return;}
var nData={oldSortColumns:this.lastSortColumns,oldSortOrder:this.lastSortOrder,newSortColumns:columnNames,newSortOrder:sortOrder};this.notifyObservers("onPreSort",nData);var cname=columnNames[columnNames.length-1];var sortfunc=Tools.Data.DataSet.prototype.sort.getSortFunc(cname,this.getColumnType(cname),sortOrder);for(var i=columnNames.length-2;i>=0;i--)
{cname=columnNames[i];sortfunc=Tools.Data.DataSet.prototype.sort.buildSecondarySortFunc(Tools.Data.DataSet.prototype.sort.getSortFunc(cname,this.getColumnType(cname),sortOrder),sortfunc);}
if(this.unfilteredData)
{this.unfilteredData.sort(sortfunc);if(this.filterFunc)
this.filter(this.filterFunc,true);}
else
this.data.sort(sortfunc);this.lastSortColumns=columnNames.slice(0);this.lastSortOrder=sortOrder;this.notifyObservers("onPostSort",nData);};Tools.Data.DataSet.prototype.sort.getSortFunc=function(prop,type,order)
{var sortfunc=null;if(type=="number")
{if(order=="ascending")
sortfunc=function(a,b)
{a=a[prop];b=b[prop];if(a==undefined||b==undefined)
return(a==b)?0:(a?1:-1);return a-b;};else
sortfunc=function(a,b)
{a=a[prop];b=b[prop];if(a==undefined||b==undefined)
return(a==b)?0:(a?-1:1);return b-a;};}
else if(type=="date")
{if(order=="ascending")
sortfunc=function(a,b)
{var dA=a[prop];var dB=b[prop];dA=dA?(new Date(dA)):0;dB=dB?(new Date(dB)):0;return dA-dB;};else
sortfunc=function(a,b)
{var dA=a[prop];var dB=b[prop];dA=dA?(new Date(dA)):0;dB=dB?(new Date(dB)):0;return dB-dA;};}
else
{if(order=="ascending")
sortfunc=function(a,b){a=a[prop];b=b[prop];if(a==undefined||b==undefined)
return(a==b)?0:(a?1:-1);var tA=a.toString();var tB=b.toString();var tA_l=tA.toLowerCase();var tB_l=tB.toLowerCase();var min_len=tA.length>tB.length?tB.length:tA.length;for(var i=0;i<min_len;i++)
{var a_l_c=tA_l.charAt(i);var b_l_c=tB_l.charAt(i);var a_c=tA.charAt(i);var b_c=tB.charAt(i);if(a_l_c>b_l_c)
return 1;else if(a_l_c<b_l_c)
return-1;else if(a_c>b_c)
return 1;else if(a_c<b_c)
return-1;}
if(tA.length==tB.length)
return 0;else if(tA.length>tB.length)
return 1;return-1;};else
sortfunc=function(a,b){a=a[prop];b=b[prop];if(a==undefined||b==undefined)
return(a==b)?0:(a?-1:1);var tA=a.toString();var tB=b.toString();var tA_l=tA.toLowerCase();var tB_l=tB.toLowerCase();var min_len=tA.length>tB.length?tB.length:tA.length;for(var i=0;i<min_len;i++)
{var a_l_c=tA_l.charAt(i);var b_l_c=tB_l.charAt(i);var a_c=tA.charAt(i);var b_c=tB.charAt(i);if(a_l_c>b_l_c)
return-1;else if(a_l_c<b_l_c)
return 1;else if(a_c>b_c)
return-1;else if(a_c<b_c)
return 1;}
if(tA.length==tB.length)
return 0;else if(tA.length>tB.length)
return-1;return 1;};}
return sortfunc;};Tools.Data.DataSet.prototype.sort.buildSecondarySortFunc=function(funcA,funcB)
{return function(a,b)
{var ret=funcA(a,b);if(ret==0)
ret=funcB(a,b);return ret;};};Tools.Data.DataSet.prototype.filterData=function(filterFunc,filterOnly)
{var dataChanged=false;if(!filterFunc)
{this.filterDataFunc=null;dataChanged=true;}
else
{this.filterDataFunc=filterFunc;if(this.dataWasLoaded&&((this.unfilteredData&&this.unfilteredData.length)||(this.data&&this.data.length)))
{if(this.unfilteredData)
{this.data=this.unfilteredData;this.unfilteredData=null;}
var oldData=this.data;this.data=[];this.dataHash={};for(var i=0;i<oldData.length;i++)
{var newRow=filterFunc(this,oldData[i],i);if(newRow)
{this.data.push(newRow);this.dataHash[newRow["ds_RowID"]]=newRow;}}
dataChanged=true;}}
if(dataChanged)
{if(!filterOnly)
{this.disableNotifications();if(this.filterFunc)
this.filter(this.filterFunc,true);this.enableNotifications();}
this.notifyObservers("onDataChanged");}};Tools.Data.DataSet.prototype.filter=function(filterFunc,filterOnly)
{var dataChanged=false;if(!filterFunc)
{if(this.filterFunc&&this.unfilteredData)
{this.data=this.unfilteredData;this.unfilteredData=null;this.filterFunc=null;dataChanged=true;}}
else
{this.filterFunc=filterFunc;if(this.dataWasLoaded&&(this.unfilteredData||(this.data&&this.data.length)))
{if(!this.unfilteredData)
this.unfilteredData=this.data;var udata=this.unfilteredData;this.data=[];for(var i=0;i<udata.length;i++)
{var newRow=filterFunc(this,udata[i],i);if(newRow)
this.data.push(newRow);}
dataChanged=true;}}
if(dataChanged)
this.notifyObservers("onDataChanged");};Tools.Data.DataSet.prototype.startLoadInterval=function(interval)
{this.stopLoadInterval();if(interval>0)
{var self=this;this.loadInterval=interval;this.loadIntervalID=setInterval(function(){self.loadData();},interval);}};Tools.Data.DataSet.prototype.stopLoadInterval=function()
{if(this.loadIntervalID)
clearInterval(this.loadIntervalID);this.loadInterval=0;this.loadIntervalID=null;};Tools.Data.DataSet.nextDataSetID=0;Tools.Data.HTTPSourceDataSet=function(dataSetURL,dataSetOptions)
{Tools.Data.DataSet.call(this);this.url=dataSetURL;this.dataSetsForDataRefStrings=new Array;this.hasDataRefStrings=false;this.useCache=true;this.setRequestInfo(dataSetOptions,true);Tools.Utils.setOptions(this,dataSetOptions,true);this.recalculateDataSetDependencies();if(this.loadInterval>0)
this.startLoadInterval(this.loadInterval);};Tools.Data.HTTPSourceDataSet.prototype=new Tools.Data.DataSet();Tools.Data.HTTPSourceDataSet.prototype.constructor=Tools.Data.HTTPSourceDataSet;Tools.Data.HTTPSourceDataSet.prototype.setRequestInfo=function(requestInfo,undefineRequestProps)
{this.requestInfo=new Tools.Utils.loadURL.Request();this.requestInfo.extractRequestOptions(requestInfo,undefineRequestProps);if(this.requestInfo.method=="POST")
{if(!this.requestInfo.headers)
this.requestInfo.headers={};if(!this.requestInfo.headers['Content-Type'])
this.requestInfo.headers['Content-Type']="application/x-www-form-urlencoded; charset=UTF-8";}};Tools.Data.HTTPSourceDataSet.prototype.recalculateDataSetDependencies=function()
{this.hasDataRefStrings=false;var i=0;for(i=0;i<this.dataSetsForDataRefStrings.length;i++)
{var ds=this.dataSetsForDataRefStrings[i];if(ds)
ds.removeObserver(this);}
this.dataSetsForDataRefStrings=new Array();var regionStrs=this.getDataRefStrings();var dsCount=0;for(var n=0;n<regionStrs.length;n++)
{var tokens=Tools.Data.Region.getTokensFromStr(regionStrs[n]);for(i=0;tokens&&i<tokens.length;i++)
{if(tokens[i].search(/{[^}:]+::[^}]+}/)!=-1)
{var dsName=tokens[i].replace(/^\{|::.*\}/g,"");var ds=null;if(!this.dataSetsForDataRefStrings[dsName])
{ds=Tools.Data.getDataSetByName(dsName);if(dsName&&ds)
{this.dataSetsForDataRefStrings[dsName]=ds;this.dataSetsForDataRefStrings[dsCount++]=ds;this.hasDataRefStrings=true;}}}}}
for(i=0;i<this.dataSetsForDataRefStrings.length;i++)
{var ds=this.dataSetsForDataRefStrings[i];ds.addObserver(this);}};Tools.Data.HTTPSourceDataSet.prototype.getDataRefStrings=function()
{var strArr=[];if(this.url)strArr.push(this.url);if(this.requestInfo&&this.requestInfo.postData)strArr.push(this.requestInfo.postData);return strArr;};Tools.Data.HTTPSourceDataSet.prototype.attemptLoadData=function()
{for(var i=0;i<this.dataSetsForDataRefStrings.length;i++)
{var ds=this.dataSetsForDataRefStrings[i];if(ds.getLoadDataRequestIsPending()||!ds.getDataWasLoaded())
return;}
this.loadData();};Tools.Data.HTTPSourceDataSet.prototype.onCurrentRowChanged=function(ds,data)
{this.attemptLoadData();};Tools.Data.HTTPSourceDataSet.prototype.onPostSort=function(ds,data)
{this.attemptLoadData();};Tools.Data.HTTPSourceDataSet.prototype.onDataChanged=function(ds,data)
{this.attemptLoadData();};Tools.Data.HTTPSourceDataSet.prototype.loadData=function()
{if(!this.url)
return;this.cancelLoadData();var url=this.url;var postData=this.requestInfo.postData;if(this.hasDataRefStrings)
{var allDataSetsReady=true;for(var i=0;i<this.dataSetsForDataRefStrings.length;i++)
{var ds=this.dataSetsForDataRefStrings[i];if(ds.getLoadDataRequestIsPending())
allDataSetsReady=false;else if(!ds.getDataWasLoaded())
{ds.loadData();allDataSetsReady=false;}}
if(!allDataSetsReady)
return;url=Tools.Data.Region.processDataRefString(null,this.url,this.dataSetsForDataRefStrings);if(!url)
return;if(postData&&(typeof postData)=="string")
postData=Tools.Data.Region.processDataRefString(null,postData,this.dataSetsForDataRefStrings);}
this.notifyObservers("onPreLoad");this.data=null;this.dataWasLoaded=false;this.unfilteredData=null;this.dataHash=null;this.curRowID=0;var req=this.requestInfo.clone();req.url=url;req.postData=postData;this.pendingRequest=new Object;this.pendingRequest.data=Tools.Data.HTTPSourceDataSet.LoadManager.loadData(req,this,this.useCache);};Tools.Data.HTTPSourceDataSet.prototype.cancelLoadData=function()
{if(this.pendingRequest)
{Tools.Data.HTTPSourceDataSet.LoadManager.cancelLoadData(this.pendingRequest.data,this);this.pendingRequest=null;}};Tools.Data.HTTPSourceDataSet.prototype.getURL=function(){return this.url;};Tools.Data.HTTPSourceDataSet.prototype.setURL=function(url,requestOptions)
{if(this.url==url)
{if(!requestOptions||(this.requestInfo.method==requestOptions.method&&(requestOptions.method!="POST"||this.requestInfo.postData==requestOptions.postData)))
return;}
this.url=url;this.setRequestInfo(requestOptions);this.cancelLoadData();this.recalculateDataSetDependencies();this.dataWasLoaded=false;};Tools.Data.HTTPSourceDataSet.prototype.setDataFromDoc=function(rawDataDoc)
{this.pendingRequest=null;this.loadDataIntoDataSet(rawDataDoc);this.applyColumnTypes();this.disableNotifications();this.filterAndSortData();this.enableNotifications();this.notifyObservers("onPostLoad");this.notifyObservers("onDataChanged");};Tools.Data.HTTPSourceDataSet.prototype.loadDataIntoDataSet=function(rawDataDoc)
{this.dataHash=new Object;this.data=new Array;this.dataWasLoaded=true;};Tools.Data.HTTPSourceDataSet.prototype.xhRequestProcessor=function(xhRequest)
{var resp=xhRequest.responseText;if(xhRequest.status==200||xhRequest.status==0)
return resp;return null;};Tools.Data.HTTPSourceDataSet.prototype.sessionExpiredChecker=function(req)
{if(req.xhRequest.responseText=='session expired')
return true;return false;};Tools.Data.HTTPSourceDataSet.prototype.setSessionExpiredChecker=function(checker)
{this.sessionExpiredChecker=checker;};Tools.Data.HTTPSourceDataSet.prototype.onRequestResponse=function(cachedRequest,req)
{this.setDataFromDoc(cachedRequest.rawData);};Tools.Data.HTTPSourceDataSet.prototype.onRequestError=function(cachedRequest,req)
{this.notifyObservers("onLoadError",req);};Tools.Data.HTTPSourceDataSet.prototype.onRequestSessionExpired=function(cachedRequest,req)
{this.notifyObservers("onSessionExpired",req);};Tools.Data.HTTPSourceDataSet.LoadManager={};Tools.Data.HTTPSourceDataSet.LoadManager.cache=[];Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest=function(reqInfo,xhRequestProcessor,sessionExpiredChecker)
{Tools.Utils.Notifier.call(this);this.reqInfo=reqInfo;this.rawData=null;this.timer=null;this.state=Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED;this.xhRequestProcessor=xhRequestProcessor;this.sessionExpiredChecker=sessionExpiredChecker;};Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype=new Tools.Utils.Notifier();Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.constructor=Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest;Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED=1;Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED=2;Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED=3;Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL=4;Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.loadDataCallback=function(req)
{if(req.xhRequest.readyState!=4)
return;var rawData=null;if(this.xhRequestProcessor)rawData=this.xhRequestProcessor(req.xhRequest);if(this.sessionExpiredChecker)
{Tools.Utils.setOptions(req,{'rawData':rawData},false);if(this.sessionExpiredChecker(req))
{this.state=Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED;this.notifyObservers("onRequestSessionExpired",req);this.observers.length=0;return;}}
if(!rawData)
{this.state=Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_FAILED;this.notifyObservers("onRequestError",req);this.observers.length=0;return;}
this.rawData=rawData;this.state=Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL;this.notifyObservers("onRequestResponse",req);this.observers.length=0;};Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.loadData=function()
{var self=this;this.cancelLoadData();this.rawData=null;this.state=Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED;var reqInfo=this.reqInfo.clone();reqInfo.successCallback=function(req){self.loadDataCallback(req);};reqInfo.errorCallback=reqInfo.successCallback;this.timer=setTimeout(function()
{self.timer=null;Tools.Utils.loadURL(reqInfo.method,reqInfo.url,reqInfo.async,reqInfo.successCallback,reqInfo);},0);};Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.prototype.cancelLoadData=function()
{if(this.state==Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
{if(this.timer)
{this.timer.clearTimeout();this.timer=null;}
this.rawData=null;this.state=Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.NOT_LOADED;}};Tools.Data.HTTPSourceDataSet.LoadManager.getCacheKey=function(reqInfo)
{return reqInfo.method+"::"+reqInfo.url+"::"+reqInfo.postData+"::"+reqInfo.username;};Tools.Data.HTTPSourceDataSet.LoadManager.loadData=function(reqInfo,ds,useCache)
{if(!reqInfo)
return null;var cacheObj=null;var cacheKey=null;if(useCache)
{cacheKey=Tools.Data.HTTPSourceDataSet.LoadManager.getCacheKey(reqInfo);cacheObj=Tools.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey];}
if(cacheObj)
{if(cacheObj.state==Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_REQUESTED)
{if(ds)
cacheObj.addObserver(ds);return cacheObj;}
else if(cacheObj.state==Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest.LOAD_SUCCESSFUL)
{if(ds)
setTimeout(function(){ds.setDataFromDoc(cacheObj.rawData);},0);return cacheObj;}}
if(!cacheObj)
{cacheObj=new Tools.Data.HTTPSourceDataSet.LoadManager.CachedRequest(reqInfo,(ds?ds.xhRequestProcessor:null),(ds?ds.sessionExpiredChecker:null));if(useCache)
{Tools.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey]=cacheObj;cacheObj.addObserver({onRequestError:function(){Tools.Data.HTTPSourceDataSet.LoadManager.cache[cacheKey]=undefined;}});}}
if(ds)
cacheObj.addObserver(ds);cacheObj.loadData();return cacheObj;};Tools.Data.HTTPSourceDataSet.LoadManager.cancelLoadData=function(cacheObj,ds)
{if(cacheObj)
{if(ds)
cacheObj.removeObserver(ds);else
cacheObj.cancelLoadData();}};Tools.Data.XMLDataSet=function(dataSetURL,dataSetPath,dataSetOptions)
{this.xpath=dataSetPath;this.doc=null;this.subPaths=[];this.entityEncodeStrings=true;Tools.Data.HTTPSourceDataSet.call(this,dataSetURL,dataSetOptions);var jwType=typeof this.subPaths;if(jwType=="string"||(jwType=="object"&&this.subPaths.constructor!=Array))
this.subPaths=[this.subPaths];};Tools.Data.XMLDataSet.prototype=new Tools.Data.HTTPSourceDataSet();Tools.Data.XMLDataSet.prototype.constructor=Tools.Data.XMLDataSet;Tools.Data.XMLDataSet.prototype.getDataRefStrings=function()
{var strArr=[];if(this.url)strArr.push(this.url);if(this.xpath)strArr.push(this.xpath);if(this.requestInfo&&this.requestInfo.postData)strArr.push(this.requestInfo.postData);return strArr;};Tools.Data.XMLDataSet.prototype.getDocument=function(){return this.doc;};Tools.Data.XMLDataSet.prototype.getXPath=function(){return this.xpath;};Tools.Data.XMLDataSet.prototype.setXPath=function(path)
{if(this.xpath!=path)
{this.xpath=path;if(this.dataWasLoaded&&this.doc)
{this.notifyObservers("onPreLoad");this.setDataFromDoc(this.doc);}}};Tools.Data.XMLDataSet.nodeContainsElementNode=function(node)
{if(node)
{node=node.firstChild;while(node)
{if(node.nodeType==1)
return true;node=node.nextSibling;}}
return false;};Tools.Data.XMLDataSet.getNodeText=function(node,encodeText,encodeCData)
{var txt="";if(!node)
return;try
{var child=node.firstChild;while(child)
{try
{if(child.nodeType==3)
txt+=encodeText?Tools.Utils.encodeEntities(child.data):child.data;else if(child.nodeType==4)
txt+=encodeCData?Tools.Utils.encodeEntities(child.data):child.data;}catch(e){Tools.Debug.reportError("Tools.Data.XMLDataSet.getNodeText() exception caught: "+e+"\n");}
child=child.nextSibling;}}
catch(e){Tools.Debug.reportError("Tools.Data.XMLDataSet.getNodeText() exception caught: "+e+"\n");}
return txt;};Tools.Data.XMLDataSet.createObjectForNode=function(node,encodeText,encodeCData)
{if(!node)
return null;var obj=new Object();var i=0;var attr=null;try
{for(i=0;i<node.attributes.length;i++)
{attr=node.attributes[i];if(attr&&attr.nodeType==2)
obj["@"+attr.name]=attr.value;}}
catch(e)
{Tools.Debug.reportError("Tools.Data.XMLDataSet.createObjectForNode() caught exception while accessing attributes: "+e+"\n");}
var child=node.firstChild;if(child&&!child.nextSibling&&child.nodeType!=1)
{obj[node.nodeName]=Tools.Data.XMLDataSet.getNodeText(node,encodeText,encodeCData);}
while(child)
{if(child.nodeType==1)
{if(!Tools.Data.XMLDataSet.nodeContainsElementNode(child))
{obj[child.nodeName]=Tools.Data.XMLDataSet.getNodeText(child,encodeText,encodeCData);try
{var namePrefix=child.nodeName+"/@";for(i=0;i<child.attributes.length;i++)
{attr=child.attributes[i];if(attr&&attr.nodeType==2)
obj[namePrefix+attr.name]=attr.value;}}
catch(e)
{Tools.Debug.reportError("Tools.Data.XMLDataSet.createObjectForNode() caught exception while accessing attributes: "+e+"\n");}}}
child=child.nextSibling;}
return obj;};Tools.Data.XMLDataSet.getRecordSetFromXMLDoc=function(xmlDoc,path,suppressColumns,entityEncodeStrings)
{if(!xmlDoc||!path)
return null;var recordSet=new Object();recordSet.xmlDoc=xmlDoc;recordSet.xmlPath=path;recordSet.dataHash=new Object;recordSet.data=new Array;recordSet.getData=function(){return this.data;};var ctx=new ExprContext(xmlDoc);var pathExpr=xpathParse(path);var e=pathExpr.evaluate(ctx);var nodeArray=e.nodeSetValue();var isDOMNodeArray=true;if(nodeArray&&nodeArray.length>0)
isDOMNodeArray=nodeArray[0].nodeType!=2;var nextID=0;var encodeText=true;var encodeCData=false;if(typeof entityEncodeStrings=="boolean")
encodeText=encodeCData=entityEncodeStrings;for(var i=0;i<nodeArray.length;i++)
{var rowObj=null;if(suppressColumns)
rowObj=new Object;else
{if(isDOMNodeArray)
rowObj=Tools.Data.XMLDataSet.createObjectForNode(nodeArray[i],encodeText,encodeCData);else
{rowObj=new Object;rowObj["@"+nodeArray[i].name]=nodeArray[i].value;}}
if(rowObj)
{rowObj['ds_RowID']=nextID++;rowObj['ds_XMLNode']=nodeArray[i];recordSet.dataHash[rowObj['ds_RowID']]=rowObj;recordSet.data.push(rowObj);}}
return recordSet;};Tools.Data.XMLDataSet.PathNode=function(path)
{this.path=path;this.subPaths=[];this.xpath="";};Tools.Data.XMLDataSet.PathNode.prototype.addSubPath=function(path)
{var node=this.findSubPath(path);if(!node)
{node=new Tools.Data.XMLDataSet.PathNode(path);this.subPaths.push(node);}
return node;};Tools.Data.XMLDataSet.PathNode.prototype.findSubPath=function(path)
{var numSubPaths=this.subPaths.length;for(var i=0;i<numSubPaths;i++)
{var subPath=this.subPaths[i];if(path==subPath.path)
return subPath;}
return null;};Tools.Data.XMLDataSet.PathNode.prototype.consolidate=function()
{var numSubPaths=this.subPaths.length;if(!this.xpath&&numSubPaths==1)
{var subPath=this.subPaths[0];this.path+=((subPath[0]!="/")?"/":"")+subPath.path;this.xpath=subPath.xpath;this.subPaths=subPath.subPaths;this.consolidate();return;}
for(var i=0;i<numSubPaths;i++)
this.subPaths[i].consolidate();};Tools.Data.XMLDataSet.prototype.convertXPathsToPathTree=function(xpathArray)
{var xpaLen=xpathArray.length;var root=new Tools.Data.XMLDataSet.PathNode("");for(var i=0;i<xpaLen;i++)
{var xpath=xpathArray[i];var cleanXPath=xpath.replace(/\/\//g,"/__SPRYDS__");cleanXPath=cleanXPath.replace(/^\//,"");var pathItems=cleanXPath.split(/\//);var pathItemsLen=pathItems.length;var node=root;for(var j=0;j<pathItemsLen;j++)
{var path=pathItems[j].replace(/__SPRYDS__/,"//");node=node.addSubPath(path);}
node.xpath=xpath;}
root.consolidate();return root;};Tools.Data.XMLDataSet.prototype.flattenSubPaths=function(rs,subPaths)
{if(!rs||!subPaths)
return;var numSubPaths=subPaths.length;if(numSubPaths<1)
return;var data=rs.data;var dataHash={};var xpathArray=[];var cleanedXPathArray=[];for(var i=0;i<numSubPaths;i++)
{var subPath=subPaths[i];if(typeof subPath=="object")
subPath=subPath.path;if(!subPath)
subPath="";xpathArray[i]=Tools.Data.Region.processDataRefString(null,subPath,this.dataSetsForDataRefStrings);cleanedXPathArray[i]=xpathArray[i].replace(/\[.*\]/g,"");}
var row;var numRows=data.length;var newData=[];for(var i=0;i<numRows;i++)
{row=data[i];var newRows=[row];for(var j=0;j<numSubPaths;j++)
{var newRS=Tools.Data.XMLDataSet.getRecordSetFromXMLDoc(row.ds_XMLNode,xpathArray[j],(subPaths[j].xpath?false:true),this.entityEncodeStrings);if(newRS&&newRS.data&&newRS.data.length)
{if(typeof subPaths[j]=="object"&&subPaths[j].subPaths)
{var sp=subPaths[j].subPaths;spType=typeof sp;if(spType=="string")
sp=[sp];else if(spType=="object"&&spType.constructor==Object)
sp=[sp];this.flattenSubPaths(newRS,sp);}
var newRSData=newRS.data;var numRSRows=newRSData.length;var cleanedXPath=cleanedXPathArray[j]+"/";var numNewRows=newRows.length;var joinedRows=[];for(var k=0;k<numNewRows;k++)
{var newRow=newRows[k];for(var l=0;l<numRSRows;l++)
{var newRowObj=new Object;var newRSRow=newRSData[l];for(prop in newRow)
newRowObj[prop]=newRow[prop];for(var prop in newRSRow)
{var newPropName=cleanedXPath+prop;if(cleanedXPath==(prop+"/")||cleanedXPath.search(new RegExp("\\/"+prop+"\\/$"))!=-1)
newPropName=cleanedXPathArray[j];newRowObj[newPropName]=newRSRow[prop];}
joinedRows.push(newRowObj);}}
newRows=joinedRows;}}
newData=newData.concat(newRows);}
data=newData;numRows=data.length;for(i=0;i<numRows;i++)
{row=data[i];row.ds_RowID=i;dataHash[row.ds_RowID]=row;}
rs.data=data;rs.dataHash=dataHash;};Tools.Data.XMLDataSet.prototype.loadDataIntoDataSet=function(rawDataDoc)
{var rs=null;var mainXPath=Tools.Data.Region.processDataRefString(null,this.xpath,this.dataSetsForDataRefStrings);var subPaths=this.subPaths;var suppressColumns=false;if(this.subPaths&&this.subPaths.length>0)
{var processedSubPaths=[];var numSubPaths=subPaths.length;for(var i=0;i<numSubPaths;i++)
{var subPathStr=Tools.Data.Region.processDataRefString(null,subPaths[i],this.dataSetsForDataRefStrings);if(subPathStr.charAt(0)!='/')
subPathStr=mainXPath+"/"+subPathStr;processedSubPaths.push(subPathStr);}
processedSubPaths.unshift(mainXPath);var commonParent=this.convertXPathsToPathTree(processedSubPaths);mainXPath=commonParent.path;subPaths=commonParent.subPaths;suppressColumns=commonParent.xpath?false:true;}
rs=Tools.Data.XMLDataSet.getRecordSetFromXMLDoc(rawDataDoc,mainXPath,suppressColumns,this.entityEncodeStrings);if(!rs)
{Tools.Debug.reportError("Tools.Data.XMLDataSet.loadDataIntoDataSet() failed to create dataSet '"+this.name+"'for '"+this.xpath+"' - "+this.url+"\n");return;}
this.flattenSubPaths(rs,subPaths);this.doc=rs.xmlDoc;this.data=rs.data;this.dataHash=rs.dataHash;this.dataWasLoaded=(this.doc!=null);};Tools.Data.XMLDataSet.prototype.xhRequestProcessor=function(xhRequest)
{var resp=xhRequest.responseXML;var manualParseRequired=false;if(xhRequest.status!=200)
{if(xhRequest.status==0)
{if(xhRequest.responseText&&(!resp||!resp.firstChild))
manualParseRequired=true;}}
else if(!resp)
{manualParseRequired=true;}
if(manualParseRequired)
resp=Tools.Utils.stringToXMLDoc(xhRequest.responseText);if(!resp||!resp.firstChild||resp.firstChild.nodeName=="parsererror")
return null;return resp;};Tools.Data.XMLDataSet.prototype.sessionExpiredChecker=function(req)
{if(req.xhRequest.responseText=='session expired')
return true;else
{if(req.rawData)
{var firstChild=req.rawData.documentElement.firstChild;if(firstChild&&firstChild.nodeValue=="session expired")
return true;}}
return false;};Tools.Data.Region=function(regionNode,name,isDetailRegion,data,dataSets,regionStates,regionStateMap,hasBehaviorAttributes)
{this.regionNode=regionNode;this.name=name;this.isDetailRegion=isDetailRegion;this.data=data;this.dataSets=dataSets;this.hasBehaviorAttributes=hasBehaviorAttributes;this.tokens=null;this.currentState=null;this.states={ready:true};this.stateMap={};Tools.Utils.setOptions(this.states,regionStates);Tools.Utils.setOptions(this.stateMap,regionStateMap);for(var i=0;i<this.dataSets.length;i++)
{var ds=this.dataSets[i];try
{if(ds)
ds.addObserver(this);}
catch(e){Tools.Debug.reportError("Failed to add '"+this.name+"' as a dataSet observer!\n");}}};Tools.Data.Region.hiddenRegionClassName="ToolsHiddenRegion";Tools.Data.Region.evenRowClassName="even";Tools.Data.Region.oddRowClassName="odd";Tools.Data.Region.notifiers={};Tools.Data.Region.evalScripts=true;Tools.Data.Region.addObserver=function(regionID,observer)
{var n=Tools.Data.Region.notifiers[regionID];if(!n)
{n=new Tools.Utils.Notifier();Tools.Data.Region.notifiers[regionID]=n;}
n.addObserver(observer);};Tools.Data.Region.removeObserver=function(regionID,observer)
{var n=Tools.Data.Region.notifiers[regionID];if(n)
n.removeObserver(observer);};Tools.Data.Region.notifyObservers=function(methodName,region,data)
{var n=Tools.Data.Region.notifiers[region.name];if(n)
{var dataObj={};if(data&&typeof data=="object")
dataObj=data;else
dataObj.data=data;dataObj.region=region;dataObj.regionID=region.name;dataObj.regionNode=region.regionNode;n.notifyObservers(methodName,dataObj);}};Tools.Data.Region.RS_Error=0x01;Tools.Data.Region.RS_LoadingData=0x02;Tools.Data.Region.RS_PreUpdate=0x04;Tools.Data.Region.RS_PostUpdate=0x08;Tools.Data.Region.prototype.getState=function()
{return this.currentState;};Tools.Data.Region.prototype.mapState=function(stateName,newStateName)
{this.stateMap[stateName]=newStateName;};Tools.Data.Region.prototype.getMappedState=function(stateName)
{var mappedState=this.stateMap[stateName];return mappedState?mappedState:stateName;};Tools.Data.Region.prototype.setState=function(stateName,suppressNotfications)
{var stateObj={state:stateName,mappedState:this.getMappedState(stateName)};if(!suppressNotfications)
Tools.Data.Region.notifyObservers("onPreStateChange",this,stateObj);this.currentState=stateObj.mappedState?stateObj.mappedState:stateName;if(this.states[stateName])
{var notificationData={state:this.currentState};if(!suppressNotfications)
Tools.Data.Region.notifyObservers("onPreUpdate",this,notificationData);var str=this.transform();if(Tools.Data.Region.debug)
Tools.Debug.trace("<hr />Generated region markup for '"+this.name+"':<br /><br />"+Tools.Utils.encodeEntities(str));Tools.Utils.setInnerHTML(this.regionNode,str,!Tools.Data.Region.evalScripts);if(this.hasBehaviorAttributes)
this.attachBehaviors();if(!suppressNotfications)
Tools.Data.Region.notifyObservers("onPostUpdate",this,notificationData);}
if(!suppressNotfications)
Tools.Data.Region.notifyObservers("onPostStateChange",this,stateObj);};Tools.Data.Region.prototype.getDataSets=function()
{return this.dataSets;};Tools.Data.Region.prototype.addDataSet=function(aDataSet)
{if(!aDataSet)
return;if(!this.dataSets)
this.dataSets=new Array;for(var i=0;i<this.dataSets.length;i++)
{if(this.dataSets[i]==aDataSet)
return;}
this.dataSets.push(aDataSet);aDataSet.addObserver(this);};Tools.Data.Region.prototype.removeDataSet=function(aDataSet)
{if(!aDataSet||this.dataSets)
return;for(var i=0;i<this.dataSets.length;i++)
{if(this.dataSets[i]==aDataSet)
{this.dataSets.splice(i,1);aDataSet.removeObserver(this);return;}}};Tools.Data.Region.prototype.onPreLoad=function(dataSet)
{if(this.currentState!="loading")
this.setState("loading");};Tools.Data.Region.prototype.onLoadError=function(dataSet)
{if(this.currentState!="error")
this.setState("error");Tools.Data.Region.notifyObservers("onError",this);};Tools.Data.Region.prototype.onSessionExpired=function(dataSet)
{if(this.currentState!="expired")
this.setState("expired");Tools.Data.Region.notifyObservers("onExpired",this);};Tools.Data.Region.prototype.onCurrentRowChanged=function(dataSet,data)
{if(this.isDetailRegion)
this.updateContent();};Tools.Data.Region.prototype.onPostSort=function(dataSet,data)
{this.updateContent();};Tools.Data.Region.prototype.onDataChanged=function(dataSet,data)
{this.updateContent();};Tools.Data.Region.enableBehaviorAttributes=true;Tools.Data.Region.behaviorAttrs={};Tools.Data.Region.behaviorAttrs["spry:select"]={attach:function(rgn,node,value)
{var selectGroupName=null;try{selectGroupName=node.attributes.getNamedItem("spry:selectgroup").value;}catch(e){}
if(!selectGroupName)
selectGroupName="default";Tools.Utils.addEventListener(node,"click",function(event){Tools.Utils.SelectionManager.select(selectGroupName,node,value);},false);if(node.attributes.getNamedItem("spry:selected"))
Tools.Utils.SelectionManager.select(selectGroupName,node,value);}};Tools.Data.Region.behaviorAttrs["spry:hover"]={attach:function(rgn,node,value)
{Tools.Utils.addEventListener(node,"mouseover",function(event){Tools.Utils.addClassName(node,value);},false);Tools.Utils.addEventListener(node,"mouseout",function(event){Tools.Utils.removeClassName(node,value);},false);}};Tools.Data.Region.setUpRowNumberForEvenOddAttr=function(node,attr,value,rowNumAttrName)
{if(!value)
{Tools.Debug.showError("The "+attr+" attribute requires a CSS class name as its value!");node.attributes.removeNamedItem(attr);return;}
var dsName="";var valArr=value.split(/\s/);if(valArr.length>1)
{dsName=valArr[0];node.setAttribute(attr,valArr[1]);}
node.setAttribute(rowNumAttrName,"{"+(dsName?(dsName+"::"):"")+"ds_RowNumber}");};Tools.Data.Region.behaviorAttrs["spry:even"]={setup:function(node,value)
{Tools.Data.Region.setUpRowNumberForEvenOddAttr(node,"spry:even",value,"spryevenrownumber");},attach:function(rgn,node,value)
{if(value)
{rowNumAttr=node.attributes.getNamedItem("spryevenrownumber");if(rowNumAttr&&rowNumAttr.value)
{var rowNum=parseInt(rowNumAttr.value);if(rowNum%2)
Tools.Utils.addClassName(node,value);}}
node.removeAttribute("spry:even");node.removeAttribute("spryevenrownumber");}};Tools.Data.Region.behaviorAttrs["spry:odd"]={setup:function(node,value)
{Tools.Data.Region.setUpRowNumberForEvenOddAttr(node,"spry:odd",value,"spryoddrownumber");},attach:function(rgn,node,value)
{if(value)
{rowNumAttr=node.attributes.getNamedItem("spryoddrownumber");if(rowNumAttr&&rowNumAttr.value)
{var rowNum=parseInt(rowNumAttr.value);if(rowNum%2==0)
Tools.Utils.addClassName(node,value);}}
node.removeAttribute("spry:odd");node.removeAttribute("spryoddrownumber");}};Tools.Data.Region.setRowAttrClickHandler=function(node,dsName,rowAttr,funcName)
{if(dsName)
{var ds=Tools.Data.getDataSetByName(dsName);if(ds)
{rowIDAttr=node.attributes.getNamedItem(rowAttr);if(rowIDAttr)
{var rowAttrVal=rowIDAttr.value;if(rowAttrVal)
Tools.Utils.addEventListener(node,"click",function(event){ds[funcName](rowAttrVal);},false);}}}};Tools.Data.Region.behaviorAttrs["spry:setrow"]={setup:function(node,value)
{if(!value)
{Tools.Debug.reportError("The spry:setrow attribute requires a data set name as its value!");node.removeAttribute("spry:setrow");return;}
node.setAttribute("spryrowid","{"+value+"::ds_RowID}");},attach:function(rgn,node,value)
{Tools.Data.Region.setRowAttrClickHandler(node,value,"spryrowid","setCurrentRow");node.removeAttribute("spry:setrow");node.removeAttribute("spryrowid");}};Tools.Data.Region.behaviorAttrs["spry:setrownumber"]={setup:function(node,value)
{if(!value)
{Tools.Debug.reportError("The spry:setrownumber attribute requires a data set name as its value!");node.removeAttribute("spry:setrownumber");return;}
node.setAttribute("spryrownumber","{"+value+"::ds_RowID}");},attach:function(rgn,node,value)
{Tools.Data.Region.setRowAttrClickHandler(node,value,"spryrownumber","setCurrentRowNumber");node.removeAttribute("spry:setrownumber");node.removeAttribute("spryrownumber");}};Tools.Data.Region.behaviorAttrs["spry:sort"]={attach:function(rgn,node,value)
{if(!value)
return;var ds=rgn.getDataSets()[0];var sortOrder="toggle";var colArray=value.split(/\s/);if(colArray.length>1)
{var specifiedDS=Tools.Data.getDataSetByName(colArray[0]);if(specifiedDS)
{ds=specifiedDS;colArray.shift();}
if(colArray.length>1)
{var str=colArray[colArray.length-1];if(str=="ascending"||str=="descending"||str=="toggle")
{sortOrder=str;colArray.pop();}}}
if(ds&&colArray.length>0)
Tools.Utils.addEventListener(node,"click",function(event){ds.sort(colArray,sortOrder);},false);node.removeAttribute("spry:sort");}};Tools.Data.Region.prototype.attachBehaviors=function()
{var rgn=this;Tools.Utils.getNodesByFunc(this.regionNode,function(node)
{if(!node||node.nodeType!=1)
return false;try
{var bAttrs=Tools.Data.Region.behaviorAttrs;for(var bAttrName in bAttrs)
{var attr=node.attributes.getNamedItem(bAttrName);if(attr)
{var behavior=bAttrs[bAttrName];if(behavior&&behavior.attach)
behavior.attach(rgn,node,attr.value);}}}catch(e){}
return false;});};Tools.Data.Region.prototype.updateContent=function()
{var allDataSetsReady=true;var dsArray=this.getDataSets();if(!dsArray||dsArray.length<1)
{Tools.Debug.reportError("updateContent(): Region '"+this.name+"' has no data set!\n");return;}
for(var i=0;i<dsArray.length;i++)
{var ds=dsArray[i];if(ds)
{if(ds.getLoadDataRequestIsPending())
allDataSetsReady=false;else if(!ds.getDataWasLoaded())
{ds.loadData();allDataSetsReady=false;}}}
if(!allDataSetsReady)
{Tools.Data.Region.notifyObservers("onLoadingData",this);return;}
this.setState("ready");};Tools.Data.Region.prototype.clearContent=function()
{this.regionNode.innerHTML="";};Tools.Data.Region.processContentPI=function(inStr)
{var outStr="";var regexp=/<!--\s*<\/?spry:content\s*[^>]*>\s*-->/mg;var searchStartIndex=0;var processingContentTag=0;while(inStr.length)
{var results=regexp.exec(inStr);if(!results||!results[0])
{outStr+=inStr.substr(searchStartIndex,inStr.length-searchStartIndex);break;}
if(!processingContentTag&&results.index!=searchStartIndex)
{outStr+=inStr.substr(searchStartIndex,results.index-searchStartIndex);}
if(results[0].search(/<\//)!=-1)
{--processingContentTag;if(processingContentTag)
Tools.Debug.reportError("Nested spry:content regions are not allowed!\n");}
else
{++processingContentTag;var dataRefStr=results[0].replace(/.*\bdataref="/,"");outStr+=dataRefStr.replace(/".*$/,"");}
searchStartIndex=regexp.lastIndex;}
return outStr;};Tools.Data.Region.prototype.tokenizeData=function(dataStr)
{if(!dataStr)
return null;var rootToken=new Tools.Data.Region.Token(Tools.Data.Region.Token.LIST_TOKEN,null,null,null);var tokenStack=new Array;var parseStr=Tools.Data.Region.processContentPI(dataStr);tokenStack.push(rootToken);var regexp=/((<!--\s*){0,1}<\/{0,1}spry:[^>]+>(\s*-->){0,1})|((\{|%7[bB])[^\}\s%]+(\}|%7[dD]))/mg;var searchStartIndex=0;while(parseStr.length)
{var results=regexp.exec(parseStr);var token=null;if(!results||!results[0])
{var str=parseStr.substr(searchStartIndex,parseStr.length-searchStartIndex);token=new Tools.Data.Region.Token(Tools.Data.Region.Token.STRING_TOKEN,null,str,str);tokenStack[tokenStack.length-1].addChild(token);break;}
if(results.index!=searchStartIndex)
{var str=parseStr.substr(searchStartIndex,results.index-searchStartIndex);token=new Tools.Data.Region.Token(Tools.Data.Region.Token.STRING_TOKEN,null,str,str);tokenStack[tokenStack.length-1].addChild(token);}
if(results[0].search(/^({|%7[bB])/)!=-1)
{var valueName=results[0];var regionStr=results[0];valueName=valueName.replace(/^({|%7[bB])/,"");valueName=valueName.replace(/(}|%7[dD])$/,"");var dataSetName=null;var splitArray=valueName.split(/::/);if(splitArray.length>1)
{dataSetName=splitArray[0];valueName=splitArray[1];}
regionStr=regionStr.replace(/^%7[bB]/,"{");regionStr=regionStr.replace(/%7[dD]$/,"}");token=new Tools.Data.Region.Token(Tools.Data.Region.Token.VALUE_TOKEN,dataSetName,valueName,new String(regionStr));tokenStack[tokenStack.length-1].addChild(token);}
else if(results[0].charAt(0)=='<')
{var piName=results[0].replace(/^(<!--\s*){0,1}<\/?/,"");piName=piName.replace(/>(\s*-->){0,1}|\s.*$/,"");if(results[0].search(/<\//)!=-1)
{if(tokenStack[tokenStack.length-1].tokenType!=Tools.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
{Tools.Debug.reportError("Invalid processing instruction close tag: "+piName+" -- "+results[0]+"\n");return null;}
tokenStack.pop();}
else
{var piDesc=Tools.Data.Region.PI.instructions[piName];if(piDesc)
{var dataSet=null;var selectedDataSetName="";if(results[0].search(/^.*\bselect=\"/)!=-1)
{selectedDataSetName=results[0].replace(/^.*\bselect=\"/,"");selectedDataSetName=selectedDataSetName.replace(/".*$/,"");if(selectedDataSetName)
{dataSet=Tools.Data.getDataSetByName(selectedDataSetName);if(!dataSet)
{Tools.Debug.reportError("Failed to retrieve data set ("+selectedDataSetName+") for "+piName+"\n");selectedDataSetName="";}}}
var jsExpr=null;if(results[0].search(/^.*\btest=\"/)!=-1)
{jsExpr=results[0].replace(/^.*\btest=\"/,"");jsExpr=jsExpr.replace(/".*$/,"");jsExpr=Tools.Utils.decodeEntities(jsExpr);}
var regionState=null;if(results[0].search(/^.*\bname=\"/)!=-1)
{regionState=results[0].replace(/^.*\bname=\"/,"");regionState=regionState.replace(/".*$/,"");regionState=Tools.Utils.decodeEntities(regionState);}
var piData=new Tools.Data.Region.Token.PIData(piName,selectedDataSetName,jsExpr,regionState);token=new Tools.Data.Region.Token(Tools.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN,dataSet,piData,new String(results[0]));tokenStack[tokenStack.length-1].addChild(token);tokenStack.push(token);}
else
{Tools.Debug.reportError("Unsupported region processing instruction: "+results[0]+"\n");return null;}}}
else
{Tools.Debug.reportError("Invalid region token: "+results[0]+"\n");return null;}
searchStartIndex=regexp.lastIndex;}
return rootToken;};Tools.Data.Region.prototype.callScriptFunction=function(funcName,processContext)
{var result=undefined;funcName=funcName.replace(/^\s*\{?\s*function::\s*|\s*\}?\s*$/g,"");var func=Tools.Utils.getObjectByName(funcName);if(func)
result=func(this.name,function(){return processContext.getValueFromDataSet.apply(processContext,arguments);});return result;};Tools.Data.Region.prototype.evaluateExpression=function(exprStr,processContext)
{var result=undefined;try
{if(exprStr.search(/^\s*function::/)!=-1)
result=this.callScriptFunction(exprStr,processContext);else
result=Tools.Utils.eval(Tools.Data.Region.processDataRefString(processContext,exprStr,null,true));}
catch(e)
{Tools.Debug.trace("Caught exception in Tools.Data.Region.prototype.evaluateExpression() while evaluating: "+Tools.Utils.encodeEntities(exprStr)+"\n    Exception:"+e+"\n");}
return result;};Tools.Data.Region.prototype.processTokenChildren=function(outputArr,token,processContext)
{var children=token.children;var len=children.length;for(var i=0;i<len;i++)
this.processTokens(outputArr,children[i],processContext);};Tools.Data.Region.prototype.processTokens=function(outputArr,token,processContext)
{var i=0;switch(token.tokenType)
{case Tools.Data.Region.Token.LIST_TOKEN:this.processTokenChildren(outputArr,token,processContext);break;case Tools.Data.Region.Token.STRING_TOKEN:outputArr.push(token.data);break;case Tools.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN:if(token.data.name=="spry:repeat")
{var dataSet=null;if(token.dataSet)
dataSet=token.dataSet;else
dataSet=this.dataSets[0];if(dataSet)
{var dsContext=processContext.getDataSetContext(dataSet);if(!dsContext)
{Tools.Debug.reportError("processTokens() failed to get a data set context!\n");break;}
dsContext.pushState();var dataSetRows=dsContext.getData();var numRows=dataSetRows.length;for(i=0;i<numRows;i++)
{dsContext.setRowIndex(i);var testVal=true;if(token.data.jsExpr)
testVal=this.evaluateExpression(token.data.jsExpr,processContext);if(testVal)
this.processTokenChildren(outputArr,token,processContext);}
dsContext.popState();}}
else if(token.data.name=="spry:if")
{var testVal=true;if(token.data.jsExpr)
testVal=this.evaluateExpression(token.data.jsExpr,processContext);if(testVal)
this.processTokenChildren(outputArr,token,processContext);}
else if(token.data.name=="spry:choose")
{var defaultChild=null;var childToProcess=null;var testVal=false;var j=0;for(j=0;j<token.children.length;j++)
{var child=token.children[j];if(child.tokenType==Tools.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN)
{if(child.data.name=="spry:when")
{if(child.data.jsExpr)
{testVal=this.evaluateExpression(child.data.jsExpr,processContext);if(testVal)
{childToProcess=child;break;}}}
else if(child.data.name=="spry:default")
defaultChild=child;}}
if(!childToProcess&&defaultChild)
childToProcess=defaultChild;if(childToProcess)
this.processTokenChildren(outputArr,childToProcess,processContext);}
else if(token.data.name=="spry:state")
{var testVal=true;if(!token.data.regionState||token.data.regionState==this.currentState)
this.processTokenChildren(outputArr,token,processContext);}
else
{Tools.Debug.reportError("processTokens(): Unknown processing instruction: "+token.data.name+"\n");return"";}
break;case Tools.Data.Region.Token.VALUE_TOKEN:var dataSet=token.dataSet;var val=undefined;if(dataSet&&dataSet=="function")
{val=this.callScriptFunction(token.data,processContext);}
else
{if(!dataSet&&this.dataSets&&this.dataSets.length>0&&this.dataSets[0])
{dataSet=this.dataSets[0];}
if(!dataSet)
{Tools.Debug.reportError("processTokens(): Value reference has no data set specified: "+token.regionStr+"\n");return"";}
val=processContext.getValueFromDataSet(dataSet,token.data);}
if(typeof val!="undefined")
outputArr.push(val+"");break;default:Tools.Debug.reportError("processTokens(): Invalid token type: "+token.regionStr+"\n");break;}};Tools.Data.Region.prototype.transform=function()
{if(this.data&&!this.tokens)
this.tokens=this.tokenizeData(this.data);if(!this.tokens)
return"";processContext=new Tools.Data.Region.ProcessingContext(this);if(!processContext)
return"";var outputArr=[""];this.processTokens(outputArr,this.tokens,processContext);return outputArr.join("");};Tools.Data.Region.PI={};Tools.Data.Region.PI.instructions={};Tools.Data.Region.PI.buildOpenTagForValueAttr=function(ele,piName,attrName)
{if(!ele||!piName)
return"";var jsExpr="";try
{var testAttr=ele.attributes.getNamedItem(piName);if(testAttr&&testAttr.value)
jsExpr=Tools.Utils.encodeEntities(testAttr.value);}
catch(e){jsExpr="";}
if(!jsExpr)
{Tools.Debug.reportError(piName+" attribute requires a JavaScript expression that returns true or false!\n");return"";}
return"<"+Tools.Data.Region.PI.instructions[piName].tagName+" "+attrName+"=\""+jsExpr+"\">";};Tools.Data.Region.PI.buildOpenTagForTest=function(ele,piName)
{return Tools.Data.Region.PI.buildOpenTagForValueAttr(ele,piName,"test");};Tools.Data.Region.PI.buildOpenTagForState=function(ele,piName)
{return Tools.Data.Region.PI.buildOpenTagForValueAttr(ele,piName,"name");};Tools.Data.Region.PI.buildOpenTagForRepeat=function(ele,piName)
{if(!ele||!piName)
return"";var selectAttrStr="";try
{var selectAttr=ele.attributes.getNamedItem(piName);if(selectAttr&&selectAttr.value)
{selectAttrStr=selectAttr.value;selectAttrStr=selectAttrStr.replace(/\s/g,"");}}
catch(e){selectAttrStr="";}
if(!selectAttrStr)
{Tools.Debug.reportError(piName+" attribute requires a data set name!\n");return"";}
var testAttrStr="";try
{var testAttr=ele.attributes.getNamedItem("spry:test");if(testAttr)
{if(testAttr.value)
testAttrStr=" test=\""+Tools.Utils.encodeEntities(testAttr.value)+"\"";ele.attributes.removeNamedItem(testAttr.nodeName);}}
catch(e){testAttrStr="";}
return"<"+Tools.Data.Region.PI.instructions[piName].tagName+" select=\""+selectAttrStr+"\""+testAttrStr+">";};Tools.Data.Region.PI.buildOpenTagForContent=function(ele,piName)
{if(!ele||!piName)
return"";var dataRefStr="";try
{var contentAttr=ele.attributes.getNamedItem(piName);if(contentAttr&&contentAttr.value)
dataRefStr=Tools.Utils.encodeEntities(contentAttr.value);}
catch(e){dataRefStr="";}
if(!dataRefStr)
{Tools.Debug.reportError(piName+" attribute requires a data reference!\n");return"";}
return"<"+Tools.Data.Region.PI.instructions[piName].tagName+" dataref=\""+dataRefStr+"\">";};Tools.Data.Region.PI.buildOpenTag=function(ele,piName)
{return"<"+Tools.Data.Region.PI.instructions[piName].tagName+">";};Tools.Data.Region.PI.buildCloseTag=function(ele,piName)
{return"</"+Tools.Data.Region.PI.instructions[piName].tagName+">";};Tools.Data.Region.PI.instructions["spry:state"]={tagName:"spry:state",childrenOnly:false,getOpenTag:Tools.Data.Region.PI.buildOpenTagForState,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.instructions["spry:if"]={tagName:"spry:if",childrenOnly:false,getOpenTag:Tools.Data.Region.PI.buildOpenTagForTest,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.instructions["spry:repeat"]={tagName:"spry:repeat",childrenOnly:false,getOpenTag:Tools.Data.Region.PI.buildOpenTagForRepeat,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.instructions["spry:repeatchildren"]={tagName:"spry:repeat",childrenOnly:true,getOpenTag:Tools.Data.Region.PI.buildOpenTagForRepeat,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.instructions["spry:choose"]={tagName:"spry:choose",childrenOnly:true,getOpenTag:Tools.Data.Region.PI.buildOpenTag,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.instructions["spry:when"]={tagName:"spry:when",childrenOnly:false,getOpenTag:Tools.Data.Region.PI.buildOpenTagForTest,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.instructions["spry:default"]={tagName:"spry:default",childrenOnly:false,getOpenTag:Tools.Data.Region.PI.buildOpenTag,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.instructions["spry:content"]={tagName:"spry:content",childrenOnly:true,getOpenTag:Tools.Data.Region.PI.buildOpenTagForContent,getCloseTag:Tools.Data.Region.PI.buildCloseTag};Tools.Data.Region.PI.orderedInstructions=["spry:state","spry:if","spry:repeat","spry:repeatchildren","spry:choose","spry:when","spry:default","spry:content"];Tools.Data.Region.getTokensFromStr=function(str)
{if(!str)
return null;return str.match(/{[^}]+}/g);};Tools.Data.Region.processDataRefString=function(processingContext,regionStr,dataSetsToUse,isJSExpr)
{if(!regionStr)
return"";if(!processingContext&&!dataSetsToUse)
return regionStr;var resultStr="";var re=new RegExp("\\{([^\\}:]+::)?[^\\}]+\\}","g");var startSearchIndex=0;while(startSearchIndex<regionStr.length)
{var reArray=re.exec(regionStr);if(!reArray||!reArray[0])
{resultStr+=regionStr.substr(startSearchIndex,regionStr.length-startSearchIndex);return resultStr;}
if(reArray.index!=startSearchIndex)
resultStr+=regionStr.substr(startSearchIndex,reArray.index-startSearchIndex);var dsName="";if(reArray[0].search(/^\{[^}:]+::/)!=-1)
dsName=reArray[0].replace(/^\{|::.*/g,"");var fieldName=reArray[0].replace(/^\{|.*::|\}/g,"");var row=null;var val="";if(processingContext)
val=processingContext.getValueFromDataSet(dsName,fieldName);else
{var ds=dsName?dataSetsToUse[dsName]:dataSetsToUse[0];if(ds)
val=ds.getValue(fieldName);}
if(typeof val!="undefined")
{val+="";resultStr+=isJSExpr?Tools.Utils.escapeQuotesAndLineBreaks(val):val;}
if(startSearchIndex==re.lastIndex)
{var leftOverIndex=reArray.index+reArray[0].length;if(leftOverIndex<regionStr.length)
resultStr+=regionStr.substr(leftOverIndex);break;}
startSearchIndex=re.lastIndex;}
return resultStr;};Tools.Data.Region.strToDataSetsArray=function(str,returnRegionNames)
{var dataSetsArr=new Array;var foundHash={};if(!str)
return dataSetsArr;str=str.replace(/\s+/g," ");str=str.replace(/^\s|\s$/g,"");var arr=str.split(/ /);for(var i=0;i<arr.length;i++)
{if(arr[i]&&!Tools.Data.Region.PI.instructions[arr[i]])
{try{var dataSet=Tools.Data.getDataSetByName(arr[i]);if(!foundHash[arr[i]])
{if(returnRegionNames)
dataSetsArr.push(arr[i]);else
dataSetsArr.push(dataSet);foundHash[arr[i]]=true;}}
catch(e){}}}
return dataSetsArr;};Tools.Data.Region.DSContext=function(dataSet,processingContext)
{var m_dataSet=dataSet;var m_processingContext=processingContext;var m_curRowIndexArray=[{rowIndex:-1}];var m_parent=null;var m_children=[];var getInternalRowIndex=function(){return m_curRowIndexArray[m_curRowIndexArray.length-1].rowIndex;};this.resetAll=function(){m_curRowIndexArray=[{rowIndex:m_dataSet.getCurrentRow()}]};this.getDataSet=function(){return m_dataSet;};this.getNumRows=function(unfiltered)
{var data=this.getCurrentState().data;return data?data.length:m_dataSet.getRowCount(unfiltered);};this.getData=function()
{var data=this.getCurrentState().data;return data?data:m_dataSet.getData();};this.setData=function(data)
{this.getCurrentState().data=data;};this.getValue=function(valueName,rowContext)
{var result="";var curState=this.getCurrentState();var ds=curState.nestedDS?curState.nestedDS:this.getDataSet();if(ds)
result=ds.getValue(valueName,rowContext);return result;};this.getCurrentRow=function()
{if(m_curRowIndexArray.length<2||getInternalRowIndex()<0)
return m_dataSet.getCurrentRow();var data=this.getData();var curRowIndex=getInternalRowIndex();if(curRowIndex<0||curRowIndex>data.length)
{Tools.Debug.reportError("Invalid index used in Tools.Data.Region.DSContext.getCurrentRow()!\n");return null;}
return data[curRowIndex];};this.getRowIndex=function()
{var curRowIndex=getInternalRowIndex();if(curRowIndex>=0)
return curRowIndex;return m_dataSet.getRowNumber(m_dataSet.getCurrentRow());};this.setRowIndex=function(rowIndex)
{this.getCurrentState().rowIndex=rowIndex;var data=this.getData();var numChildren=m_children.length;for(var i=0;i<numChildren;i++)
m_children[i].syncDataWithParentRow(this,rowIndex,data);};this.syncDataWithParentRow=function(parentDSContext,rowIndex,parentData)
{var row=parentData[rowIndex];if(row)
{nestedDS=m_dataSet.getNestedDataSetForParentRow(row);if(nestedDS)
{var currentState=this.getCurrentState();currentState.nestedDS=nestedDS;currentState.data=nestedDS.getData();currentState.rowIndex=nestedDS.getCurrentRowNumber();currentState.rowIndex=currentState.rowIndex<0?0:currentState.rowIndex;var numChildren=m_children.length;for(var i=0;i<numChildren;i++)
m_children[i].syncDataWithParentRow(this,currentState.rowIndex,currentState.data);}}};this.pushState=function()
{var curState=this.getCurrentState();var newState=new Object;newState.rowIndex=curState.rowIndex;newState.data=curState.data;newState.nestedDS=curState.nestedDS;m_curRowIndexArray.push(newState);var numChildren=m_children.length;for(var i=0;i<numChildren;i++)
m_children[i].pushState();};this.popState=function()
{if(m_curRowIndexArray.length<2)
{Tools.Debug.reportError("Stack underflow in Tools.Data.Region.DSContext.popState()!\n");return;}
var numChildren=m_children.length;for(var i=0;i<numChildren;i++)
m_children[i].popState();m_curRowIndexArray.pop();};this.getCurrentState=function()
{return m_curRowIndexArray[m_curRowIndexArray.length-1];};this.addChild=function(childDSContext)
{var numChildren=m_children.length;for(var i=0;i<numChildren;i++)
{if(m_children[i]==childDSContext)
return;}
m_children.push(childDSContext);};};Tools.Data.Region.ProcessingContext=function(region)
{this.region=region;this.dataSetContexts=[];if(region&&region.dataSets)
{var dsArray=region.dataSets.slice(0);var dsArrayLen=dsArray.length;for(var i=0;i<dsArrayLen;i++)
{var ds=region.dataSets[i];while(ds&&ds.getParentDataSet)
{var doesExist=false;ds=ds.getParentDataSet();if(ds&&this.indexOf(dsArray,ds)==-1)
dsArray.push(ds);}}
for(i=0;i<dsArray.length;i++)
this.dataSetContexts.push(new Tools.Data.Region.DSContext(dsArray[i],this));var dsContexts=this.dataSetContexts;var numDSContexts=dsContexts.length;for(i=0;i<numDSContexts;i++)
{var dsc=dsContexts[i];var ds=dsc.getDataSet();if(ds.getParentDataSet)
{var parentDS=ds.getParentDataSet();if(parentDS)
{var pdsc=this.getDataSetContext(parentDS);if(pdsc)pdsc.addChild(dsc);}}}}};Tools.Data.Region.ProcessingContext.prototype.indexOf=function(arr,item)
{if(arr)
{var arrLen=arr.length;for(var i=0;i<arrLen;i++)
if(arr[i]==item)
return i;}
return-1;};Tools.Data.Region.ProcessingContext.prototype.getDataSetContext=function(dataSet)
{if(!dataSet)
{if(this.dataSetContexts.length>0)
return this.dataSetContexts[0];return null;}
if(typeof dataSet=='string')
{dataSet=Tools.Data.getDataSetByName(dataSet);if(!dataSet)
return null;}
for(var i=0;i<this.dataSetContexts.length;i++)
{var dsc=this.dataSetContexts[i];if(dsc.getDataSet()==dataSet)
return dsc;}
return null;};Tools.Data.Region.ProcessingContext.prototype.getValueFromDataSet=function()
{var dsName="";var columnName="";if(arguments.length>1)
{dsName=arguments[0];columnName=arguments[1];}
else
{var dataRef=arguments[0].replace(/\s*{\s*|\s*}\s*/g,"");if(dataRef.search("::")!=-1)
{dsName=dataRef.replace(/::.*/,"");columnName=dataRef.replace(/.*::/,"");}
else
columnName=dataRef;}
var result="";var dsContext=this.getDataSetContext(dsName);if(dsContext)
result=dsContext.getValue(columnName,dsContext.getCurrentRow());else
Tools.Debug.reportError("getValueFromDataSet: Failed to get "+dsName+" context for the "+this.region.regionNode.id+" region.\n");return result;};Tools.Data.Region.ProcessingContext.prototype.$v=Tools.Data.Region.ProcessingContext.prototype.getValueFromDataSet;Tools.Data.Region.ProcessingContext.prototype.getCurrentRowForDataSet=function(dataSet)
{var dsc=this.getDataSetContext(dataSet);if(dsc)
return dsc.getCurrentRow();return null;};Tools.Data.Region.Token=function(tokenType,dataSet,data,regionStr)
{var self=this;this.tokenType=tokenType;this.dataSet=dataSet;this.data=data;this.regionStr=regionStr;this.parent=null;this.children=null;};Tools.Data.Region.Token.prototype.addChild=function(child)
{if(!child)
return;if(!this.children)
this.children=new Array;this.children.push(child);child.parent=this;};Tools.Data.Region.Token.LIST_TOKEN=0;Tools.Data.Region.Token.STRING_TOKEN=1;Tools.Data.Region.Token.PROCESSING_INSTRUCTION_TOKEN=2;Tools.Data.Region.Token.VALUE_TOKEN=3;Tools.Data.Region.Token.PIData=function(piName,data,jsExpr,regionState)
{var self=this;this.name=piName;this.data=data;this.jsExpr=jsExpr;this.regionState=regionState;};Tools.Utils.addLoadListener(function(){setTimeout(function(){if(Tools.Data.initRegionsOnLoad)Tools.Data.initRegions();},0);});
// ToolsDataExtensions.js - version 0.4 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.DataSet.multiFilterFuncs={};Tools.Data.DataSet.multiFilterFuncs.and=function(ds,row,rowNumber,filters)
{if(filters)
{var numFilters=filters.length;for(var i=0;i<numFilters;i++)
{row=filters[i](ds,row,rowNumber);if(!row)
break;}}
return row;};Tools.Data.DataSet.multiFilterFuncs.or=function(ds,row,rowNumber,filters)
{if(filters&&filters.length>0)
{var numFilters=filters.length;for(var i=0;i<numFilters;i++)
{var savedRow=row;row=filters[i](ds,row,rowNumber);if(row)
return row;row=savedRow;}
return null;}
return row;};Tools.Data.DataSet.prototype.getMultiFilterFunc=function()
{var func=Tools.Data.DataSet.multiFilterFuncs[this.getFilterMode()];if(!func)
func=Tools.Data.DataSet.multiFilterFuncs["and"];var filters=this.activeFilters;return function(ds,row,rowNumber){return func(ds,row,rowNumber,filters);};};Tools.Data.DataSet.prototype.addFilter=function(filterFunc,doApplyFilters)
{if(!this.hasFilter(filterFunc))
{if(!this.activeFilters)
this.activeFilters=[];this.activeFilters.push(filterFunc);}
if(doApplyFilters)
this.applyFilters();};Tools.Data.DataSet.prototype.removeFilter=function(filterFunc,doApplyFilters)
{var filters=this.activeFilters;if(filters)
{var numFilters=filters.length;for(var i=0;i<numFilters;i++)
{if(filters[i]==filterFunc)
{this.activeFilters.splice(i,1);if(doApplyFilters)
this.applyFilters();return;}}}};Tools.Data.DataSet.prototype.removeAllFilters=function(doApplyFilters)
{var filters=this.activeFilters;if(filters&&filters.length>0)
{this.activeFilters=[];if(doApplyFilters)
this.applyFilters();}};Tools.Data.DataSet.prototype.getFilters=function(filterFunc)
{if(!this.activeFilters)
this.activeFilters=[];return this.activeFilters;};Tools.Data.DataSet.prototype.applyFilters=function()
{if(this.activeFilters&&this.activeFilters.length>0)
this.filter(this.getMultiFilterFunc());else
this.filter(null);};Tools.Data.DataSet.prototype.hasFilter=function(filterFunc)
{if(!this.activeFilters&&this.activeFilters>0)
{var filters=this.activeFilters;var numFilters=filters.length;for(var i=0;i<numFilters;i++)
{if(filters[i]==filterFunc)
return true;}}
return false;};Tools.Data.DataSet.prototype.getFilterMode=function()
{return this.filterMode?this.filterMode:"and";};Tools.Data.DataSet.prototype.setFilterMode=function(mode,doApplyFilters)
{var oldMode=this.getFilterMode();this.filterMode=mode;if(doApplyFilters)
this.applyFilters();return oldMode;};
// ToolsDataSetShell.js - version 0.1 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.DataSetShell=function(ds,options)
{this.currentDS=ds;this.options=options;Tools.Data.DataSet.call(this,options);if(this.currentDS)
this.currentDS.addObserver(this.getObserverFunc(this.currentDS));};Tools.Data.DataSetShell.prototype=new Tools.Data.DataSet();Tools.Data.DataSetShell.prototype.constructor=Tools.Data.DataSetShell.prototype;Tools.Data.DataSetShell.prototype.getObserverFunc=function(ds)
{var self=this;return function(notificationType,notifier,data){self.notifyObservers(notificationType,data);};};Tools.Data.DataSetShell.prototype.setInternalDataSet=function(ds,loadDS)
{var cds=this.currentDS;if(cds!=ds)
{var wasLoaded=ds.getDataWasLoaded();if(wasLoaded)
this.notifyObservers("onPreLoad");if(cds)
cds.removeObserver(this.getObserverFunc(cds));this.currentDS=ds;ds.addObserver(this.getObserverFunc(ds));if(wasLoaded)
{this.notifyObservers("onPostLoad");this.notifyObservers("onDataChanged");}
else if(loadDS)
ds.loadData();}};Tools.Data.DataSetShell.prototype.getInternalDataSet=function()
{return this.currentDS;};Tools.Data.DataSetShell.prototype.getNestedDataSetForParentRow=function(parentRow)
{return this.currentDS?this.currentDS.getNestedDataSetForParentRow():null;};Tools.Data.DataSetShell.prototype.getParentDataSet=function()
{if(this.currentDS&&this.currentDS.getParentDataSet)
return this.currentDS.getParentDataSet();return null;};Tools.Data.DataSetShell.prototype.loadData=function()
{if(this.currentDS&&!this.currentDS.getLoadDataRequestIsPending())
this.currentDS.loadData();};Tools.Data.DataSetShell.prototype.getData=function(unfiltered)
{if(this.currentDS)
return this.currentDS.getData(unfiltered);return[];};Tools.Data.DataSetShell.prototype.getLoadDataRequestIsPending=function()
{return this.currentDS?this.currentDS.getLoadDataRequestIsPending():false;};Tools.Data.DataSetShell.prototype.getDataWasLoaded=function()
{return this.currentDS?this.currentDS.getDataWasLoaded():false;};Tools.Data.DataSetShell.prototype.setDataFromArray=function(arr,fireSyncLoad)
{if(this.currentDS)
this.currentDS.setDataFromArray(arr,fireSyncLoad);};Tools.Data.DataSetShell.prototype.cancelLoadData=function()
{if(this.currentDS)
this.currentDS.cancelLoadData();};Tools.Data.DataSetShell.prototype.getRowCount=function(unfiltered)
{return this.currentDS?this.currentDS.getRowCount(unfiltered):0;};Tools.Data.DataSetShell.prototype.getRowByID=function(rowID)
{return this.currentDS?this.currentDS.getRowByID(rowID):undefined;};Tools.Data.DataSetShell.prototype.getRowByRowNumber=function(rowNumber,unfiltered)
{return this.currentDS?this.currentDS.getRowByRowNumber(rowNumber,unfiltered):null;};Tools.Data.DataSetShell.prototype.getCurrentRow=function()
{return this.currentDS?this.currentDS.getCurrentRow():null;};Tools.Data.DataSetShell.prototype.setCurrentRow=function(rowID)
{if(this.currentDS)
this.currentDS.setCurrentRow(rowID);};Tools.Data.DataSetShell.prototype.getRowNumber=function(row)
{return this.currentDS?this.currentDS.getRowNumber(row):0;};Tools.Data.DataSetShell.prototype.getCurrentRowNumber=function()
{return this.currentDS?this.currentDS.getCurrentRowNumber():0;};Tools.Data.DataSetShell.prototype.getCurrentRowID=function()
{return this.currentDS?this.currentDS.getCurrentRowID():0;};Tools.Data.DataSetShell.prototype.setCurrentRowNumber=function(rowNumber)
{if(this.currentDS)
this.currentDS.setCurrentRowNumber(rowNumber);};Tools.Data.DataSetShell.prototype.findRowsWithColumnValues=function(valueObj,firstMatchOnly,unfiltered)
{if(this.currentDS)
return this.currentDS.findRowsWithColumnValues(valueObj,firstMatchOnly,unfiltered);return firstMatchOnly?null:[];};Tools.Data.DataSetShell.prototype.setColumnType=function(columnNames,columnType)
{if(this.currentDS)
this.currentDS.setColumnType(columnNames,columnType);};Tools.Data.DataSetShell.prototype.getColumnType=function(columnName)
{return this.currentDS?this.currentDS.getColumnType(columnName):"string";};Tools.Data.DataSetShell.prototype.distinct=function(columnNames)
{if(this.currentDS)
this.currentDS.distinct(columnNames);};Tools.Data.DataSetShell.prototype.getSortColumn=function()
{return this.currentDS?this.currentDS.getSortColumn():"";};Tools.Data.DataSetShell.prototype.getSortOrder=function()
{return this.currentDS?this.currentDS.getSortOrder():"";};Tools.Data.DataSetShell.prototype.sort=function(columnNames,sortOrder)
{if(this.currentDS)
this.currentDS.sort(columnNames,sortOrder);};Tools.Data.DataSetShell.prototype.filterData=function(filterFunc,filterOnly)
{if(this.currentDS)
this.currentDS.filterData(filterFunc,filterOnly);};Tools.Data.DataSetShell.prototype.filter=function(filterFunc,filterOnly)
{if(this.currentDS)
this.currentDS.filter(filterFunc,filterOnly);};
// ToolsCSVDataSet.js - version 0.2 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.CSVDataSet=function(dataSetURL,dataSetOptions)
{Tools.Data.HTTPSourceDataSet.call(this,dataSetURL,dataSetOptions);this.firstRowAsHeaders=true;this.columnNames=[];Tools.Utils.setOptions(this,dataSetOptions);};Tools.Data.CSVDataSet.prototype=new Tools.Data.HTTPSourceDataSet();Tools.Data.CSVDataSet.prototype.constructor=Tools.Data.CSVDataSet;Tools.Data.CSVDataSet.prototype.getDataRefStrings=function()
{var strArr=[];if(this.url)strArr.push(this.url);return strArr;};Tools.Data.CSVDataSet.prototype.getDocument=function(){return this.doc;};Tools.Data.CSVDataSet.cleanFieldString=function(str)
{str=str.replace(/\s*(\r\n)\s*/g,"$1");str=str.replace(/^[ \t]*"?|"?\s*,?\s*$/g,"");return str.replace(/""/g,'"');};Tools.Data.CSVDataSet.prototype.columnNumberToColumnName=function(colNum)
{var colName=this.columnNames[colNum];if(!colName)
colName="column"+colNum;return colName;};Tools.Data.CSVDataSet.prototype.loadDataIntoDataSet=function(rawDataDoc)
{var data=new Array();var dataHash=new Object();var s=rawDataDoc?rawDataDoc:"";var strLen=s.length;var i=0;var done=false;var firstRowAsHeaders=this.firstRowAsHeaders;var searchStartIndex=0;var regexp=/([ \t]*"([^"]|"")*"[ \t]*,?)|([ \t]*[^",\r\n]+[ \t]*,?)|[ \t]*(\r\n|\r|\n)/mg;var results=regexp.exec(s);var rowObj=null;var columnNum=-1;var rowID=0;while(results&&results[0])
{var f=Tools.Data.CSVDataSet.cleanFieldString(results[0]);if(f=="\r\n"||f=="\r"||f=="\n")
{if(!firstRowAsHeaders)
{rowObj.ds_RowID=rowID++;data.push(rowObj);dataHash[rowObj.ds_RowID]=rowObj;rowObj=null;}
firstRowAsHeaders=false;columnNum=-1;}
else
{if(firstRowAsHeaders)
this.columnNames[++columnNum]=f;else
{if(++columnNum==0)
rowObj=new Object;rowObj[this.columnNumberToColumnName(columnNum)]=f;}}
searchStartIndex=regexp.lastIndex;results=regexp.exec(s);}
this.doc=rawDataDoc;this.data=data;this.dataHash=dataHash;this.dataWasLoaded=(this.doc!=null);};
// ToolsDOMUtils.js - version 0.6 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Utils)Tools.Utils={};Tools.$=function(element)
{if(arguments.length>1)
{for(var i=0,elements=[],length=arguments.length;i<length;i++)
elements.push(Tools.$(arguments[i]));return elements;}
if(typeof element=='string')
element=document.getElementById(element);return element;};Tools.Utils.setAttribute=function(ele,name,value)
{ele=Tools.$(ele);if(!ele||!name)
return;if(name=="class")
ele.className=value;else
ele.setAttribute(name,value);};Tools.Utils.removeAttribute=function(ele,name)
{ele=Tools.$(ele);if(!ele||!name)
return;try
{ele.removeAttribute(name);if(name=="class")
ele.removeAttribute("className");}catch(e){}};Tools.Utils.addClassName=function(ele,className)
{ele=Tools.$(ele);if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Utils.removeClassName=function(ele,className)
{ele=Tools.$(ele);if(Tools.Utils.hasClassName(ele,className))
ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Utils.toggleClassName=function(ele,className)
{if(Tools.Utils.hasClassName(ele,className))
Tools.Utils.removeClassName(ele,className);else
Tools.Utils.addClassName(ele,className);};Tools.Utils.hasClassName=function(ele,className)
{ele=Tools.$(ele);if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)
return false;return true;};Tools.Utils.camelizeString=function(str)
{var cStr="";var a=str.split("-");for(var i=0;i<a.length;i++)
{var s=a[i];if(s)
cStr=cStr?(cStr+s.charAt(0).toUpperCase()+s.substring(1)):s;}
return cStr;};Tools.Utils.styleStringToObject=function(styleStr)
{var o={};if(styleStr)
{pvA=styleStr.split(";");for(var i=0;i<pvA.length;i++)
{var pv=pvA[i];if(pv&&pv.indexOf(":")!=-1)
{var nvA=pv.split(":");var n=nvA[0].replace(/^\s*|\s*$/g,"");var v=nvA[1].replace(/^\s*|\s*$/g,"");if(n&&v)
o[Tools.Utils.camelizeString(n)]=v;}}}
return o;};Tools.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(!Tools.Utils.eventListenerIsBoundToElement(element,eventType,handler,capture))
{element=Tools.$(element);handler=Tools.Utils.bindEventListenerToElement(element,eventType,handler,capture);if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}}
catch(e){}};Tools.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{element=Tools.$(element);handler=Tools.Utils.unbindEventListenerFromElement(element,eventType,handler,capture);if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler);}
catch(e){}};Tools.Utils.eventListenerHash={};Tools.Utils.nextEventListenerID=1;Tools.Utils.getHashForElementAndHandler=function(element,eventType,handler,capture)
{var hash=null;element=Tools.$(element);if(element)
{if(typeof element.spryEventListenerID=="undefined")
element.spryEventListenerID="e"+(Tools.Utils.nextEventListenerID++);if(typeof handler.spryEventHandlerID=="undefined")
handler.spryEventHandlerID="h"+(Tools.Utils.nextEventListenerID++);hash=element.spryEventListenerID+"-"+handler.spryEventHandlerID+"-"+eventType+(capture?"-capture":"");}
return hash;};Tools.Utils.eventListenerIsBoundToElement=function(element,eventType,handler,capture)
{element=Tools.$(element);var hash=Tools.Utils.getHashForElementAndHandler(element,eventType,handler,capture);return Tools.Utils.eventListenerHash[hash]!=undefined;};Tools.Utils.bindEventListenerToElement=function(element,eventType,handler,capture)
{element=Tools.$(element);var hash=Tools.Utils.getHashForElementAndHandler(element,eventType,handler,capture);if(Tools.Utils.eventListenerHash[hash])
return Tools.Utils.eventListenerHash[hash];return Tools.Utils.eventListenerHash[hash]=function(e)
{e=e||window.event;if(!e.preventDefault)e.preventDefault=function(){this.returnValue=false;};if(!e.stopPropagation)e.stopPropagation=function(){this.cancelBubble=true;};var result=handler.call(element,e);if(result==false)
{e.preventDefault();e.stopPropagation();}
return result;};};Tools.Utils.unbindEventListenerFromElement=function(element,eventType,handler,capture)
{element=Tools.$(element);var hash=Tools.Utils.getHashForElementAndHandler(element,eventType,handler,capture);if(Tools.Utils.eventListenerHash[hash])
{handler=Tools.Utils.eventListenerHash[hash];Tools.Utils.eventListenerHash[hash]=undefined;}
return handler;};Tools.Utils.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Utils.getAncestor=function(ele,selector)
{ele=Tools.$(ele);if(ele)
{var s=Tools.$$.tokenizeSequence(selector?selector:"*")[0];var t=s?s[0]:null;if(t)
{var p=ele.parentNode;while(p)
{if(t.match(p))
return p;p=p.parentNode;}}}
return null;};Tools.$$=function(selectorSequence,rootNode)
{if(!rootNode)
rootNode=document;else
rootNode=Tools.$(rootNode);var sequences=Tools.$$.tokenizeSequence(selectorSequence);var matches=[];Tools.$$.addExtensions(matches);++Tools.$$.queryID;var nid=0;var ns=sequences.length;for(var i=0;i<ns;i++)
{var m=Tools.$$.processTokens(sequences[i],rootNode);var nm=m.length;for(var j=0;j<nm;j++)
{var n=m[j];if(!n.spry$$ID)
{n.spry$$ID=++nid;matches.push(n);}}}
var nm=matches.length;for(i=0;i<nm;i++)
matches[i].spry$$ID=undefined;return matches;};Tools.$$.cache={};Tools.$$.queryID=0;Tools.$$.Token=function()
{this.type=Tools.$$.Token.SELECTOR;this.name="*";this.id="";this.classes=[];this.attrs=[];this.pseudos=[];};Tools.$$.Token.Attr=function(n,v)
{this.name=n;this.value=v?new RegExp(v):undefined;};Tools.$$.Token.PseudoClass=function(pstr)
{this.name=pstr.replace(/\(.*/,"");this.arg=pstr.replace(/^[^\(\)]*\(?\s*|\)\s*$/g,"");this.func=Tools.$$.pseudoFuncs[this.name];};Tools.$$.Token.SELECTOR=0;Tools.$$.Token.COMBINATOR=1;Tools.$$.Token.prototype.match=function(ele,nameAlreadyMatches)
{if(this.type==Tools.$$.Token.COMBINATOR)
return false;if(!nameAlreadyMatches&&this.name!='*'&&this.name!=ele.nodeName.toLowerCase())
return false;if(this.id&&this.id!=ele.id)
return false;var classes=this.classes;var len=classes.length;for(var i=0;i<len;i++)
{if(!ele.className||!classes[i].value.test(ele.className))
return false;}
var attrs=this.attrs;len=attrs.length;for(var i=0;i<len;i++)
{var a=attrs[i];var an=ele.attributes.getNamedItem(a.name);if(!an||(!a.value&&an.nodeValue==undefined)||(a.value&&!a.value.test(an.nodeValue)))
return false;}
var ps=this.pseudos;var len=ps.length;for(var i=0;i<len;i++)
{var p=ps[i];if(p&&p.func&&!p.func(p.arg,ele,this))
return false;}
return true;};Tools.$$.Token.prototype.getNodeNameIfTypeMatches=function(ele)
{var nodeName=ele.nodeName.toLowerCase();if(this.name!='*')
{if(this.name!=nodeName)
return null;return this.name;}
return nodeName;};Tools.$$.escapeRegExpCharsRE=/\/|\.|\*|\+|\(|\)|\[|\]|\{|\}|\\|\|/g;Tools.$$.tokenizeSequence=function(s)
{var cc=Tools.$$.cache[s];if(cc)return cc;var tokenExpr=/(\[[^\"'~\^\$\*\|\]=]+([~\^\$\*\|]?=\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\])|((:[^\.#:\s,>~\+\[\]]+\(([^\(\)]+|\([^\(\)]*\))*\))|[\.#:]?[^\.#:\s,>~\+\[\]]+)|(\s*[\s,>~\+]\s*)/g;var tkn=new Tools.$$.Token;var sequence=[];sequence.push(tkn);var tokenSequences=[];tokenSequences.push(sequence);s=s.replace(/^\s*|\s*$/,"");var expMatch=tokenExpr.exec(s);while(expMatch)
{var tstr=expMatch[0];var c=tstr.charAt(0);switch(c)
{case'.':tkn.classes.push(new Tools.$$.Token.Attr("class","\\b"+tstr.substr(1)+"\\b"));break;case'#':tkn.id=tstr.substr(1);break;case':':tkn.pseudos.push(new Tools.$$.Token.PseudoClass(tstr));break;case'[':var attrComps=tstr.match(/\[([^\"'~\^\$\*\|\]=]+)(([~\^\$\*\|]?=)\s*('[^']*'|"[^"]*"|[^"'\]]+))?\s*\]/);var name=attrComps[1];var matchType=attrComps[3];var val=attrComps[4];if(val)
{val=val.replace(/^['"]|['"]$/g,"");val=val.replace(Tools.$$.escapeRegExpCharsRE,'\\$&');}
var matchStr=undefined;switch(matchType)
{case"=":matchStr="^"+val+"$";break;case"^=":matchStr="^"+val;break;case"$=":matchStr=val+"$";break;case"~=":case"|=":matchStr="\\b"+val+"\\b";break;case"*=":matchStr=val;break;}
tkn.attrs.push(new Tools.$$.Token.Attr(name,matchStr));break;default:var combiMatch=tstr.match(/^\s*([\s,~>\+])\s*$/);if(combiMatch)
{if(combiMatch[1]==',')
{sequence=new Array;tokenSequences.push(sequence);tkn=new Tools.$$.Token;sequence.push(tkn);}
else
{tkn=new Tools.$$.Token;tkn.type=Tools.$$.Token.COMBINATOR;tkn.name=combiMatch[1];sequence.push(tkn);tkn=new Tools.$$.Token();sequence.push(tkn);}}
else
tkn.name=tstr.toLowerCase();break;}
expMatch=tokenExpr.exec(s);}
Tools.$$.cache[s]=tokenSequences;return tokenSequences;};Tools.$$.combinatorFuncs={" ":function(nodes,token)
{var uid=++Tools.$$.uniqueID;var results=[];var nn=nodes.length;for(var i=0;i<nn;i++)
{var n=nodes[i];if(uid!=n.spry$$uid)
{var ea=nodes[i].getElementsByTagName(token.name);var ne=ea.length;for(var j=0;j<ne;j++)
{var e=ea[j];if(token.match(e,true))
results.push(e);e.spry$$uid=uid;}}}
return results;},">":function(nodes,token)
{var results=[];var nn=nodes.length;for(var i=0;i<nn;i++)
{var n=nodes[i].firstChild;while(n)
{if(n.nodeType==1&&token.match(n))
results.push(n);n=n.nextSibling;}}
return results;},"+":function(nodes,token)
{var results=[];var nn=nodes.length;for(var i=0;i<nn;i++)
{var n=nodes[i].nextSibling;while(n&&n.nodeType!=1)
n=n.nextSibling;if(n&&token.match(n))
results.push(n);}
return results;},"~":function(nodes,token)
{var uid=++Tools.$$.uniqueID;var results=[];var nn=nodes.length;for(var i=0;i<nn;i++)
{var n=nodes[i].nextSibling;while(n)
{if(n.nodeType==1)
{if(uid==n.spry$$uid)
break;if(token.match(n))
{results.push(n);n.spry$$uid=uid;}}
n=n.nextSibling;}}
return results;}};Tools.$$.uniqueID=0;Tools.$$.pseudoFuncs={":first-child":function(arg,node,token)
{var n=node.previousSibling;while(n)
{if(n.nodeType==1)return false;n=n.previousSibling;}
return true;},":last-child":function(arg,node,token)
{var n=node.nextSibling;while(n)
{if(n.nodeType==1)
return false;n=n.nextSibling;}
return true;},":empty":function(arg,node,token)
{var n=node.firstChild;while(n)
{switch(n.nodeType)
{case 1:case 3:case 4:case 5:return false;}
n=n.nextSibling;}
return true;},":nth-child":function(arg,node,token)
{return Tools.$$.nthChild(arg,node,token);},":nth-last-child":function(arg,node,token)
{return Tools.$$.nthChild(arg,node,token,true);},":nth-of-type":function(arg,node,token)
{return Tools.$$.nthChild(arg,node,token,false,true);},":nth-last-of-type":function(arg,node,token)
{return Tools.$$.nthChild(arg,node,token,true,true);},":first-of-type":function(arg,node,token)
{var nodeName=token.getNodeNameIfTypeMatches(node);if(!nodeName)return false;var n=node.previousSibling;while(n)
{if(n.nodeType==1&&nodeName==n.nodeName.toLowerCase())return false;n=n.previousSibling;}
return true;},":last-of-type":function(arg,node,token)
{var nodeName=token.getNodeNameIfTypeMatches(node);if(!nodeName)return false;var n=node.nextSibling;while(n)
{if(n.nodeType==1&&nodeName==n.nodeName.toLowerCase())
return false;n=n.nextSibling;}
return true;},":only-child":function(arg,node,token)
{var f=Tools.$$.pseudoFuncs;return f[":first-child"](arg,node,token)&&f[":last-child"](arg,node,token);},":only-of-type":function(arg,node,token)
{var f=Tools.$$.pseudoFuncs;return f[":first-of-type"](arg,node,token)&&f[":last-of-type"](arg,node,token);},":not":function(arg,node,token)
{var s=Tools.$$.tokenizeSequence(arg)[0];var t=s?s[0]:null;return!t||!t.match(node);},":enabled":function(arg,node,token)
{return!node.disabled;},":disabled":function(arg,node,token)
{return node.disabled;},":checked":function(arg,node,token)
{return node.checked;},":root":function(arg,node,token)
{return node.parentNode&&node.ownerDocument&&node.parentNode==node.ownerDocument;}};Tools.$$.nthRegExp=/((-|[0-9]+)?n)?([+-]?[0-9]*)/;Tools.$$.nthCache={"even":{a:2,b:0,mode:1,invalid:false},"odd":{a:2,b:1,mode:1,invalid:false},"2n":{a:2,b:0,mode:1,invalid:false},"2n+1":{a:2,b:1,mode:1,invalid:false}};Tools.$$.parseNthChildString=function(str)
{var o=Tools.$$.nthCache[str];if(!o)
{var m=str.match(Tools.$$.nthRegExp);var n=m[1];var a=m[2];var b=m[3];if(!a)
{a=n?1:0;}
else if(a=="-")
{a=-1;}
else
{a=parseInt(a,10);}
b=b?parseInt(b,10):0;var mode=(a==0)?0:((a>0)?1:-1);var invalid=false;if(a>0&&b<0)
{b=b%a;b=((b=(b%a))<0)?a+b:b;}
else if(a<0)
{if(b<0)
invalid=true;else
a=Math.abs(a);}
o=new Object;o.a=a;o.b=b;o.mode=mode;o.invalid=invalid;Tools.$$.nthCache[str]=o;}
return o;};Tools.$$.nthChild=function(arg,node,token,fromLastSib,matchNodeName)
{if(matchNodeName)
{var nodeName=token.getNodeNameIfTypeMatches(node);if(!nodeName)return false;}
var o=Tools.$$.parseNthChildString(arg);if(o.invalid)
return false;var qidProp="spry$$ncQueryID";var posProp="spry$$ncPos";var countProp="spry$$ncCount";if(matchNodeName)
{qidProp+=nodeName;posProp+=nodeName;countProp+=nodeName;}
var parent=node.parentNode;if(parent[qidProp]!=Tools.$$.queryID)
{var pos=0;parent[qidProp]=Tools.$$.queryID;var c=parent.firstChild;while(c)
{if(c.nodeType==1&&(!matchNodeName||nodeName==c.nodeName.toLowerCase()))
c[posProp]=++pos;c=c.nextSibling;}
parent[countProp]=pos;}
pos=node[posProp];if(fromLastSib)
pos=parent[countProp]-pos+1;if(o.mode==0)
return pos==o.b;if(o.mode>0)
return(pos<o.b)?false:(!((pos-o.b)%o.a));return(pos>o.b)?false:(!((o.b-pos)%o.a));};Tools.$$.processTokens=function(tokens,root)
{var numTokens=tokens.length;var nodeSet=[root];var combiFunc=null;for(var i=0;i<numTokens&&nodeSet.length>0;i++)
{var t=tokens[i];if(t.type==Tools.$$.Token.SELECTOR)
{if(combiFunc)
{nodeSet=combiFunc(nodeSet,t);combiFunc=null;}
else
nodeSet=Tools.$$.getMatchingElements(nodeSet,t);}
else
combiFunc=Tools.$$.combinatorFuncs[t.name];}
return nodeSet;};Tools.$$.getMatchingElements=function(nodes,token)
{var results=[];if(token.id)
{n=nodes[0];if(n&&n.ownerDocument)
{var e=n.ownerDocument.getElementById(token.id);if(e)
{if(token.match(e))
results.push(e);}
return results;}}
var nn=nodes.length;for(var i=0;i<nn;i++)
{var n=nodes[i];var ea=n.getElementsByTagName(token.name);var ne=ea.length;for(var j=0;j<ne;j++)
{var e=ea[j];if(token.match(e,true))
results.push(e);}}
return results;};Tools.$$.addExtensions=function(a)
{for(var f in Tools.$$.Results)
a[f]=Tools.$$.Results[f];};Tools.$$.Results={};Tools.$$.Results.forEach=function(func)
{var n=this.length;for(var i=0;i<n;i++)
func(this[i]);return this;};Tools.$$.Results.setAttribute=function(name,value)
{return this.forEach(function(n){Tools.Utils.setAttribute(n,name,value);});};Tools.$$.Results.removeAttribute=function(name)
{return this.forEach(function(n){Tools.Utils.removeAttribute(n,name);});};Tools.$$.Results.addClassName=function(className)
{return this.forEach(function(n){Tools.Utils.addClassName(n,className);});};Tools.$$.Results.removeClassName=function(className)
{return this.forEach(function(n){Tools.Utils.removeClassName(n,className);});};Tools.$$.Results.toggleClassName=function(className)
{return this.forEach(function(n){Tools.Utils.toggleClassName(n,className);});};Tools.$$.Results.addEventListener=function(eventType,handler,capture,bindHandler)
{return this.forEach(function(n){Tools.Utils.addEventListener(n,eventType,handler,capture,bindHandler);});};Tools.$$.Results.removeEventListener=function(eventType,handler,capture)
{return this.forEach(function(n){Tools.Utils.removeEventListener(n,eventType,handler,capture);});};Tools.$$.Results.setStyle=function(style)
{if(style)
{style=Tools.Utils.styleStringToObject(style);this.forEach(function(n)
{for(var p in style)
try{n.style[p]=style[p];}catch(e){}});}
return this;};Tools.$$.Results.setProperty=function(prop,value)
{if(prop)
{if(typeof prop=="string")
{var p={};p[prop]=value;prop=p;}
this.forEach(function(n)
{for(var p in prop)
try{n[p]=prop[p];}catch(e){}});}
return this;};
// Tools.Effect.js - version 0.38 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};Tools.forwards=1;Tools.backwards=2;if(!Tools.Effect)Tools.Effect={};Tools.Effect.Transitions={linearTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;return begin+(time/duration)*change;},sinusoidalTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;return begin+((-Math.cos((time/duration)*Math.PI)/2)+0.5)*change;},squareTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;return begin+Math.pow(time/duration,2)*change;},squarerootTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;return begin+Math.sqrt(time/duration)*change;},fifthTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;return begin+Math.sqrt((-Math.cos((time/duration)*Math.PI)/2)+0.5)*change;},circleTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;var pos=time/duration;return begin+Math.sqrt(1-Math.pow((pos-1),2))*change;},pulsateTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;return begin+(0.5+Math.sin(17*time/duration)/2)*change;},growSpecificTransition:function(time,begin,change,duration)
{if(time>duration)return change+begin;var pos=time/duration;return begin+(5*Math.pow(pos,3)-6.4*Math.pow(pos,2)+2*pos)*change;}};for(var trans in Tools.Effect.Transitions)
{Tools[trans]=Tools.Effect.Transitions[trans];}
Tools.Effect.Registry=function()
{this.effects=[];};Tools.Effect.Registry.prototype.getRegisteredEffect=function(element,options)
{var a={};a.element=Tools.Effect.getElement(element);a.options=options;for(var i=0;i<this.effects.length;i++)
if(this.effectsAreTheSame(this.effects[i],a))
return this.effects[i].effect;return false;};Tools.Effect.Registry.prototype.addEffect=function(effect,element,options)
{if(!this.getRegisteredEffect(element,options))
{var len=this.effects.length;this.effects[len]={};var eff=this.effects[len];eff.effect=effect;eff.element=Tools.Effect.getElement(element);eff.options=options;}};Tools.Effect.Registry.prototype.effectsAreTheSame=function(effectA,effectB)
{if(effectA.element!=effectB.element)
return false;var compare=Tools.Effect.Utils.optionsAreIdentical(effectA.options,effectB.options);if(compare)
{if(typeof effectB.options.setup=='function')
effectA.options.setup=effectB.options.setup;if(typeof effectB.options.finish=='function')
effectA.options.finish=effectB.options.finish;}
return compare;};var ToolsRegistry=new Tools.Effect.Registry;if(!Tools.Effect.Utils)Tools.Effect.Utils={};Tools.Effect.Utils.showError=function(msg)
{alert('Tools.Effect ERR: '+msg);};Tools.Effect.Utils.showInitError=function(effect){Tools.Effect.Utils.showError('The '+effect+' class can\'t be accessed as a static function anymore. '+"\n"+'Please read Tools Effects migration documentation.');return false;};Tools.Effect.Utils.Position=function()
{this.x=0;this.y=0;this.units="px";};Tools.Effect.Utils.Rectangle=function()
{this.width=0;this.height=0;this.units="px";};Tools.Effect.Utils.intToHex=function(integerNum)
{var result=integerNum.toString(16);if(result.length==1)
result="0"+result;return result;};Tools.Effect.Utils.hexToInt=function(hexStr)
{return parseInt(hexStr,16);};Tools.Effect.Utils.rgb=function(redInt,greenInt,blueInt)
{var intToHex=Tools.Effect.Utils.intToHex;var redHex=intToHex(redInt);var greenHex=intToHex(greenInt);var blueHex=intToHex(blueInt);compositeColorHex=redHex.concat(greenHex,blueHex).toUpperCase();compositeColorHex='#'+compositeColorHex;return compositeColorHex;};Tools.Effect.Utils.longColorVersion=function(color){if(color.match(/^#[0-9a-f]{3}$/i)){var tmp=color.split('');var color='#';for(var i=1;i<tmp.length;i++){color+=tmp[i]+''+tmp[i];}}
return color;};Tools.Effect.Utils.camelize=function(stringToCamelize)
{if(stringToCamelize.indexOf('-')==-1){return stringToCamelize;}
var oStringList=stringToCamelize.split('-');var isFirstEntry=true;var camelizedString='';for(var i=0;i<oStringList.length;i++)
{if(oStringList[i].length>0)
{if(isFirstEntry)
{camelizedString=oStringList[i];isFirstEntry=false;}
else
{var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}}}
return camelizedString;};Tools.Effect.Utils.isPercentValue=function(value)
{var result=false;if(typeof value=='string'&&value.length>0&&value.lastIndexOf("%")>0)
result=true;return result;};Tools.Effect.Utils.getPercentValue=function(value)
{var result=0;try
{result=Number(value.substring(0,value.lastIndexOf("%")));}
catch(e){Tools.Effect.Utils.showError('Tools.Effect.Utils.getPercentValue: '+e);}
return result;};Tools.Effect.Utils.getPixelValue=function(value)
{var result=0;if(typeof value=='number')return value;var unitIndex=value.lastIndexOf("px");if(unitIndex==-1)
unitIndex=value.length;try
{result=parseInt(value.substring(0,unitIndex),10);}
catch(e){}
return result;};Tools.Effect.Utils.getFirstChildElement=function(node)
{if(node)
{var childCurr=node.firstChild;while(childCurr)
{if(childCurr.nodeType==1)
return childCurr;childCurr=childCurr.nextSibling;}}
return null;};Tools.Effect.Utils.fetchChildImages=function(startEltIn,targetImagesOut)
{if(!startEltIn||startEltIn.nodeType!=1||!targetImagesOut)
return;if(startEltIn.hasChildNodes())
{var childImages=startEltIn.getElementsByTagName('img');var imageCnt=childImages.length;for(var i=0;i<imageCnt;i++)
{var imgCurr=childImages[i];var dimensionsCurr=Tools.Effect.getDimensions(imgCurr);targetImagesOut.push([imgCurr,dimensionsCurr.width,dimensionsCurr.height]);}}};Tools.Effect.Utils.optionsAreIdentical=function(optionsA,optionsB)
{if(optionsA==null&&optionsB==null)
return true;if(optionsA!=null&&optionsB!=null)
{var objectCountA=0;var objectCountB=0;for(var propA in optionsA)objectCountA++;for(var propB in optionsB)objectCountB++;if(objectCountA!=objectCountB)
return false;for(var prop in optionsA)
{var typeA=typeof optionsA[prop];var typeB=typeof optionsB[prop];if(typeA!=typeB||(typeA!='undefined'&&optionsA[prop]!=optionsB[prop]))
return false;}
return true;}
return false;};Tools.Effect.Utils.DoEffect=function(effectName,element,options)
{if(!options)
var options={};options.name=effectName;var ef=ToolsRegistry.getRegisteredEffect(element,options);if(!ef)
{ef=new Tools.Effect[effectName](element,options);ToolsRegistry.addEffect(ef,element,options);}
ef.start();return true;};if(!Tools.Utils)Tools.Utils={};Tools.Utils.Notifier=function()
{this.observers=[];this.suppressNotifications=0;};Tools.Utils.Notifier.prototype.addObserver=function(observer)
{if(!observer)
return;var len=this.observers.length;for(var i=0;i<len;i++)
if(this.observers[i]==observer)return;this.observers[len]=observer;};Tools.Utils.Notifier.prototype.removeObserver=function(observer)
{if(!observer)
return;for(var i=0;i<this.observers.length;i++)
{if(this.observers[i]==observer)
{this.observers.splice(i,1);break;}}};Tools.Utils.Notifier.prototype.notifyObservers=function(methodName,data)
{if(!methodName)
return;if(!this.suppressNotifications)
{var len=this.observers.length;for(var i=0;i<len;i++)
{var obs=this.observers[i];if(obs)
{if(typeof obs=="function")
obs(methodName,this,data);else if(obs[methodName])
obs[methodName](this,data);}}}};Tools.Utils.Notifier.prototype.enableNotifications=function()
{if(--this.suppressNotifications<0)
{this.suppressNotifications=0;Tools.Effect.Utils.showError("Unbalanced enableNotifications() call!\n");}};Tools.Utils.Notifier.prototype.disableNotifications=function()
{++this.suppressNotifications;};Tools.Effect.getElement=function(ele)
{var element=ele;if(typeof ele=="string")
element=document.getElementById(ele);if(element==null)
Tools.Effect.Utils.showError('Element "'+ele+'" not found.');return element;};Tools.Effect.getStyleProp=function(element,prop)
{var value;var camelized=Tools.Effect.Utils.camelize(prop);try
{if(element.style)
value=element.style[camelized];if(!value)
{if(document.defaultView&&document.defaultView.getComputedStyle)
{var css=document.defaultView.getComputedStyle(element,null);value=css?css.getPropertyValue(prop):null;}
else if(element.currentStyle)
{value=element.currentStyle[camelized];}}}
catch(e){Tools.Effect.Utils.showError('Tools.Effect.getStyleProp: '+e);}
return value=='auto'?null:value;};Tools.Effect.setStyleProp=function(element,prop,value)
{try
{element.style[Tools.Effect.Utils.camelize(prop)]=value;}
catch(e){Tools.Effect.Utils.showError('Tools.Effect.setStyleProp: '+e);}};Tools.Effect.getStylePropRegardlessOfDisplayState=function(element,prop,displayElement)
{var refElement=displayElement?displayElement:element;var displayOrig=Tools.Effect.getStyleProp(refElement,'display');var visibilityOrig=Tools.Effect.getStyleProp(refElement,'visibility');if(displayOrig=='none')
{Tools.Effect.setStyleProp(refElement,'visibility','hidden');Tools.Effect.setStyleProp(refElement,'display','block');if(window.opera)
refElement.focus();}
var styleProp=Tools.Effect.getStyleProp(element,prop);if(displayOrig=='none')
{Tools.Effect.setStyleProp(refElement,'display','none');Tools.Effect.setStyleProp(refElement,'visibility',visibilityOrig);}
return styleProp;};Tools.Effect.makePositioned=function(element)
{var pos=Tools.Effect.getStyleProp(element,'position');if(!pos||pos=='static')
{element.style.position='relative';if(window.opera)
{element.style.top=0;element.style.left=0;}}};Tools.Effect.isInvisible=function(element)
{var propDisplay=Tools.Effect.getStyleProp(element,'display');if(propDisplay&&propDisplay.toLowerCase()=='none')
return true;var propVisible=Tools.Effect.getStyleProp(element,'visibility');if(propVisible&&propVisible.toLowerCase()=='hidden')
return true;return false;};Tools.Effect.enforceVisible=function(element)
{var propDisplay=Tools.Effect.getStyleProp(element,'display');if(propDisplay&&propDisplay.toLowerCase()=='none')
Tools.Effect.setStyleProp(element,'display','block');var propVisible=Tools.Effect.getStyleProp(element,'visibility');if(propVisible&&propVisible.toLowerCase()=='hidden')
Tools.Effect.setStyleProp(element,'visibility','visible');};Tools.Effect.makeClipping=function(element)
{var overflow=Tools.Effect.getStyleProp(element,'overflow');if(!overflow||(overflow.toLowerCase()!='hidden'&&overflow.toLowerCase()!='scroll'))
{var heightCache=0;var needsCache=/MSIE 7.0/.test(navigator.userAgent)&&/Windows NT/.test(navigator.userAgent);if(needsCache)
heightCache=Tools.Effect.getDimensionsRegardlessOfDisplayState(element).height;Tools.Effect.setStyleProp(element,'overflow','hidden');if(needsCache)
Tools.Effect.setStyleProp(element,'height',heightCache+'px');}};Tools.Effect.cleanWhitespace=function(element)
{var childCountInit=element.childNodes.length;for(var i=childCountInit-1;i>=0;i--){var node=element.childNodes[i];if(node.nodeType==3&&!/\S/.test(node.nodeValue))
try
{element.removeChild(node);}
catch(e){Tools.Effect.Utils.showError('Tools.Effect.cleanWhitespace: '+e);}}};Tools.Effect.getComputedStyle=function(element)
{return/MSIE/.test(navigator.userAgent)?element.currentStyle:document.defaultView.getComputedStyle(element,null);};Tools.Effect.getDimensions=function(element)
{var dimensions=new Tools.Effect.Utils.Rectangle;var computedStyle=null;if(element.style.width&&/px/i.test(element.style.width))
dimensions.width=parseInt(element.style.width,10);else
{computedStyle=Tools.Effect.getComputedStyle(element);var tryComputedStyle=computedStyle&&computedStyle.width&&/px/i.test(computedStyle.width);if(tryComputedStyle)
dimensions.width=parseInt(computedStyle.width,10);if(!tryComputedStyle||dimensions.width==0)
dimensions.width=element.offsetWidth;}
if(element.style.height&&/px/i.test(element.style.height))
dimensions.height=parseInt(element.style.height,10);else
{if(!computedStyle)
computedStyle=Tools.Effect.getComputedStyle(element);var tryComputedStyle=computedStyle&&computedStyle.height&&/px/i.test(computedStyle.height);if(tryComputedStyle)
dimensions.height=parseInt(computedStyle.height,10);if(!tryComputedStyle||dimensions.height==0)
dimensions.height=element.offsetHeight;}
return dimensions;};Tools.Effect.getDimensionsRegardlessOfDisplayState=function(element,displayElement)
{var refElement=displayElement?displayElement:element;var displayOrig=Tools.Effect.getStyleProp(refElement,'display');var visibilityOrig=Tools.Effect.getStyleProp(refElement,'visibility');if(displayOrig=='none')
{Tools.Effect.setStyleProp(refElement,'visibility','hidden');Tools.Effect.setStyleProp(refElement,'display','block');if(window.opera)
refElement.focus();}
var dimensions=Tools.Effect.getDimensions(element);if(displayOrig=='none')
{Tools.Effect.setStyleProp(refElement,'display','none');Tools.Effect.setStyleProp(refElement,'visibility',visibilityOrig);}
return dimensions;};Tools.Effect.getOpacity=function(element)
{var o=Tools.Effect.getStyleProp(element,"opacity");if(typeof o=='undefined'||o==null)
o=1.0;return o;};Tools.Effect.getBgColor=function(ele)
{return Tools.Effect.getStyleProp(ele,"background-color");};Tools.Effect.intPropStyle=function(e,prop){var i=parseInt(Tools.Effect.getStyleProp(e,prop),10);if(isNaN(i))
return 0;return i;};Tools.Effect.getPosition=function(element)
{var position=new Tools.Effect.Utils.Position;var computedStyle=null;if(element.style.left&&/px/i.test(element.style.left))
position.x=parseInt(element.style.left,10);else
{computedStyle=Tools.Effect.getComputedStyle(element);var tryComputedStyle=computedStyle&&computedStyle.left&&/px/i.test(computedStyle.left);if(tryComputedStyle)
position.x=parseInt(computedStyle.left,10);if(!tryComputedStyle||position.x==0)
position.x=element.offsetLeft;}
if(element.style.top&&/px/i.test(element.style.top))
position.y=parseInt(element.style.top,10);else
{if(!computedStyle)
computedStyle=Tools.Effect.getComputedStyle(element);var tryComputedStyle=computedStyle&&computedStyle.top&&/px/i.test(computedStyle.top);if(tryComputedStyle)
position.y=parseInt(computedStyle.top,10);if(!tryComputedStyle||position.y==0)
position.y=element.offsetTop;}
return position;};Tools.Effect.getOffsetPosition=Tools.Effect.getPosition;Tools.Effect.Animator=function(options)
{Tools.Utils.Notifier.call(this);this.name='Animator';this.element=null;this.startMilliseconds=0;this.repeat='none';this.isRunning=false;this.timer=null;this.cancelRemaining=0;if(!options)
var options={};if(options.toggle)
this.direction=false;else
this.direction=Tools.forwards;var self=this;if(options.setup!=null)
this.addObserver({onPreEffect:function(){try{self.options.setup(self.element,self);}catch(e){Tools.Effect.Utils.showError('Tools.Effect.Animator.prototype.start: setup callback: '+e);}}});if(options.finish!=null)
this.addObserver({onPostEffect:function(){try{self.options.finish(self.element,self);}catch(e){Tools.Effect.Utils.showError('Tools.Effect.Animator.prototype.stop: finish callback: '+e);}}});this.options={duration:1000,toggle:false,transition:Tools.linearTransition,interval:16};this.setOptions(options);if(options.transition)
this.setTransition(options.transition);if(options.fps)
this.setFps(options.fps);};Tools.Effect.Animator.prototype=new Tools.Utils.Notifier();Tools.Effect.Animator.prototype.constructor=Tools.Utils.Animator;Tools.Effect.Animator.prototype.notStaticAnimator=true;Tools.Effect.Animator.prototype.setOptions=function(options)
{if(!options)
return;for(var prop in options)
this.options[prop]=options[prop];};Tools.Effect.Animator.prototype.setTransition=function(transition){if(typeof transition=='number'||transition=="1"||transition=="2")
switch(parseInt(transition,10))
{case 1:transition=Tools.linearTransition;break;case 2:transition=Tools.sinusoidalTransition;break;default:Tools.Effect.Utils.showError('unknown transition');}
else if(typeof transition=='string')
{if(typeof window[transition]=='function')
transition=window[transition];else if(typeof Tools[transition]=='function')
transition=Tools[transition];else
Tools.Effect.Utils.showError('unknown transition');}
this.options.transition=transition;if(typeof this.effectsArray!='undefined'){var l=this.effectsArray.length;for(var i=0;i<l;i++)
this.effectsArray[i].effect.setTransition(transition);}};Tools.Effect.Animator.prototype.setDuration=function(duration){this.options.duration=duration;if(typeof this.effectsArray!='undefined')
{var l=this.effectsArray.length;for(var i=0;i<l;i++)
{this.effectsArray[i].effect.setDuration(duration);}}};Tools.Effect.Animator.prototype.setFps=function(fps){this.options.interval=parseInt(1000/fps,10);this.options.fps=fps;if(typeof this.effectsArray!='undefined')
{var l=this.effectsArray.length;for(var i=0;i<l;i++)
{this.effectsArray[i].effect.setFps(fps);}}};Tools.Effect.Animator.prototype.start=function(withoutTimer)
{if(!this.element)
return;if(arguments.length==0)
withoutTimer=false;if(this.isRunning)
this.cancel();this.prepareStart();var currDate=new Date();this.startMilliseconds=currDate.getTime();if(this.element.id)
this.element=document.getElementById(this.element.id);if(this.cancelRemaining!=0&&this.options.toggle)
{if(this.cancelRemaining<1&&typeof this.options.transition=='function')
{var startTime=0;var stopTime=this.options.duration;var start=0;var stop=1;var emergency=0;this.cancelRemaining=Math.round(this.cancelRemaining*1000)/1000;var found=false;var middle=0;while(!found)
{if(emergency++>this.options.duration)break;var half=startTime+((stopTime-startTime)/2);middle=Math.round(this.options.transition(half,1,-1,this.options.duration)*1000)/1000;if(middle==this.cancelRemaining)
{this.startMilliseconds-=half;found=true;}
if(middle<this.cancelRemaining)
{stopTime=half;stop=middle;}
else
{startTime=half;start=middle;}}}
this.cancelRemaining=0;}
this.notifyObservers('onPreEffect',this);if(withoutTimer==false)
{var self=this;this.timer=setInterval(function(){self.drawEffect();},this.options.interval);}
this.isRunning=true;};Tools.Effect.Animator.prototype.stopFlagReset=function()
{if(this.timer)
{clearInterval(this.timer);this.timer=null;}
this.startMilliseconds=0;};Tools.Effect.Animator.prototype.stop=function()
{this.stopFlagReset();this.notifyObservers('onPostEffect',this);this.isRunning=false;};Tools.Effect.Animator.prototype.cancel=function()
{var elapsed=this.getElapsedMilliseconds();if(this.startMilliseconds>0&&elapsed<this.options.duration)
this.cancelRemaining=this.options.transition(elapsed,0,1,this.options.duration);this.stopFlagReset();this.notifyObservers('onCancel',this);this.isRunning=false;};Tools.Effect.Animator.prototype.drawEffect=function()
{var isRunning=true;this.notifyObservers('onStep',this);var timeElapsed=this.getElapsedMilliseconds();if(typeof this.options.transition!='function'){Tools.Effect.Utils.showError('unknown transition');return;}
this.animate();if(timeElapsed>this.options.duration)
{isRunning=false;this.stop();}
return isRunning;};Tools.Effect.Animator.prototype.getElapsedMilliseconds=function()
{if(this.startMilliseconds>0)
{var currDate=new Date();return(currDate.getTime()-this.startMilliseconds);}
return 0;};Tools.Effect.Animator.prototype.doToggle=function()
{if(!this.direction)
{this.direction=Tools.forwards;return;}
if(this.options.toggle==true)
{if(this.direction==Tools.forwards)
{this.direction=Tools.backwards;this.notifyObservers('onToggle',this);}
else if(this.direction==Tools.backwards)
{this.direction=Tools.forwards;}}};Tools.Effect.Animator.prototype.prepareStart=function()
{if(this.options&&this.options.toggle)
this.doToggle();};Tools.Effect.Animator.prototype.animate=function(){};Tools.Effect.Animator.prototype.onStep=function(el)
{if(el!=this)
this.notifyObservers('onStep',this);};Tools.Effect.Move=function(element,fromPos,toPos,options)
{this.dynamicFromPos=false;if(arguments.length==3)
{options=toPos;toPos=fromPos;fromPos=Tools.Effect.getPosition(element);this.dynamicFromPos=true;}
Tools.Effect.Animator.call(this,options);this.name='Move';this.element=Tools.Effect.getElement(element);if(!this.element)
return;if(fromPos.units!=toPos.units)
Tools.Effect.Utils.showError('Tools.Effect.Move: Conflicting units ('+fromPos.units+', '+toPos.units+')');this.units=fromPos.units;this.startX=Number(fromPos.x);this.stopX=Number(toPos.x);this.startY=Number(fromPos.y);this.stopY=Number(toPos.y);};Tools.Effect.Move.prototype=new Tools.Effect.Animator();Tools.Effect.Move.prototype.constructor=Tools.Effect.Move;Tools.Effect.Move.prototype.animate=function()
{var left=0;var top=0;var floor=Math.floor;var elapsed=this.getElapsedMilliseconds();if(this.direction==Tools.forwards)
{left=floor(this.options.transition(elapsed,this.startX,this.stopX-this.startX,this.options.duration));top=floor(this.options.transition(elapsed,this.startY,this.stopY-this.startY,this.options.duration));}
else if(this.direction==Tools.backwards)
{left=floor(this.options.transition(elapsed,this.stopX,this.startX-this.stopX,this.options.duration));top=floor(this.options.transition(elapsed,this.stopY,this.startY-this.stopY,this.options.duration));}
this.element.style.left=left+this.units;this.element.style.top=top+this.units;};Tools.Effect.Move.prototype.prepareStart=function()
{if(this.options&&this.options.toggle)
this.doToggle();if(this.dynamicFromPos==true)
{var fromPos=Tools.Effect.getPosition(this.element);this.startX=fromPos.x;this.startY=fromPos.y;this.rangeMoveX=this.startX-this.stopX;this.rangeMoveY=this.startY-this.stopY;}};Tools.Effect.Size=function(element,fromRect,toRect,options)
{this.dynamicFromRect=false;if(arguments.length==3)
{options=toRect;toRect=fromRect;fromRect=Tools.Effect.getDimensionsRegardlessOfDisplayState(element);this.dynamicFromRect=true;}
Tools.Effect.Animator.call(this,options);this.name='Size';this.element=Tools.Effect.getElement(element);if(!this.element)
return;element=this.element;if(fromRect.units!=toRect.units)
{Tools.Effect.Utils.showError('Tools.Effect.Size: Conflicting units ('+fromRect.units+', '+toRect.units+')');return false;}
this.units=fromRect.units;var originalRect=Tools.Effect.getDimensionsRegardlessOfDisplayState(element);this.originalWidth=originalRect.width;this.originalHeight=originalRect.height;this.startWidth=fromRect.width;this.startHeight=fromRect.height;this.stopWidth=toRect.width;this.stopHeight=toRect.height;this.childImages=new Array();if(this.options.useCSSBox){Tools.Effect.makePositioned(this.element);var intProp=Tools.Effect.intPropStyle;this.startFromBorder_top=intProp(element,'border-top-width');this.startFromBorder_bottom=intProp(element,'border-bottom-width');this.startFromBorder_left=intProp(element,'border-left-width');this.startFromBorder_right=intProp(element,'border-right-width');this.startFromPadding_top=intProp(element,'padding-top');this.startFromPadding_bottom=intProp(element,'padding-bottom');this.startFromPadding_left=intProp(element,'padding-left');this.startFromPadding_right=intProp(element,'padding-right');this.startFromMargin_top=intProp(element,'margin-top');this.startFromMargin_bottom=intProp(element,'margin-bottom');this.startFromMargin_right=intProp(element,'margin-right');this.startFromMargin_left=intProp(element,'margin-left');this.startLeft=intProp(element,'left');this.startTop=intProp(element,'top');}
if(this.options.scaleContent)
Tools.Effect.Utils.fetchChildImages(element,this.childImages);this.fontFactor=1.0;var fontSize=Tools.Effect.getStyleProp(this.element,'font-size');if(fontSize&&/em\s*$/.test(fontSize))
this.fontFactor=parseFloat(fontSize);var isPercent=Tools.Effect.Utils.isPercentValue;if(isPercent(this.startWidth))
{var startWidthPercent=Tools.Effect.Utils.getPercentValue(this.startWidth);this.startWidth=originalRect.width*(startWidthPercent/100);}
if(isPercent(this.startHeight))
{var startHeightPercent=Tools.Effect.Utils.getPercentValue(this.startHeight);this.startHeight=originalRect.height*(startHeightPercent/100);}
if(isPercent(this.stopWidth))
{var stopWidthPercent=Tools.Effect.Utils.getPercentValue(this.stopWidth);this.stopWidth=originalRect.width*(stopWidthPercent/100);}
if(isPercent(this.stopHeight))
{var stopHeightPercent=Tools.Effect.Utils.getPercentValue(this.stopHeight);this.stopHeight=originalRect.height*(stopHeightPercent/100);}
this.enforceVisible=Tools.Effect.isInvisible(this.element);};Tools.Effect.Size.prototype=new Tools.Effect.Animator();Tools.Effect.Size.prototype.constructor=Tools.Effect.Size;Tools.Effect.Size.prototype.animate=function()
{var width=0;var height=0;var fontSize=0;var direction=0;var floor=Math.floor;var elapsed=this.getElapsedMilliseconds();if(this.direction==Tools.forwards){width=floor(this.options.transition(elapsed,this.startWidth,this.stopWidth-this.startWidth,this.options.duration));height=floor(this.options.transition(elapsed,this.startHeight,this.stopHeight-this.startHeight,this.options.duration));direction=1;}else if(this.direction==Tools.backwards){width=floor(this.options.transition(elapsed,this.stopWidth,this.startWidth-this.stopWidth,this.options.duration));height=floor(this.options.transition(elapsed,this.stopHeight,this.startHeight-this.stopHeight,this.options.duration));direction=-1;}
var propFactor=width/this.originalWidth;fontSize=this.fontFactor*propFactor;var elStyle=this.element.style;if(width<0)
width=0;if(height<0)
height=0;elStyle.width=width+this.units;elStyle.height=height+this.units;if(typeof this.options.useCSSBox!='undefined'&&this.options.useCSSBox==true)
{var intProp=Tools.Effect.intPropStyle;var origTop=intProp(this.element,'top');var origLeft=intProp(this.element,'left');var origMarginTop=intProp(this.element,'margin-top');var origMarginLeft=intProp(this.element,'margin-left');var widthFactor=propFactor;var heightFactor=height/this.originalHeight;var border_top=floor(this.startFromBorder_top*heightFactor);var border_bottom=floor(this.startFromBorder_bottom*heightFactor);var border_left=floor(this.startFromBorder_left*widthFactor);var border_right=floor(this.startFromBorder_right*widthFactor);var padding_top=floor(this.startFromPadding_top*heightFactor);var padding_bottom=floor(this.startFromPadding_bottom*heightFactor);var padding_left=floor(this.startFromPadding_left*widthFactor);var padding_right=floor(this.startFromPadding_right*widthFactor);var margin_top=floor(this.startFromMargin_top*heightFactor);var margin_bottom=floor(this.startFromMargin_bottom*heightFactor);var margin_right=floor(this.startFromMargin_right*widthFactor);var margin_left=floor(this.startFromMargin_left*widthFactor);elStyle.borderTopWidth=border_top+this.units;elStyle.borderBottomWidth=border_bottom+this.units;elStyle.borderLeftWidth=border_left+this.units;elStyle.borderRightWidth=border_right+this.units;elStyle.paddingTop=padding_top+this.units;elStyle.paddingBottom=padding_bottom+this.units;elStyle.paddingLeft=padding_left+this.units;elStyle.paddingRight=padding_right+this.units;elStyle.marginTop=margin_top+this.units;elStyle.marginBottom=margin_bottom+this.units;elStyle.marginLeft=margin_left+this.units;elStyle.marginRight=margin_right+this.units;elStyle.left=floor(origLeft+origMarginLeft-margin_left)+this.units;elStyle.top=floor(origTop+origMarginTop-margin_top)+this.units;}
if(this.options.scaleContent)
{for(var i=0;i<this.childImages.length;i++)
{this.childImages[i][0].style.width=propFactor*this.childImages[i][1]+this.units;this.childImages[i][0].style.height=propFactor*this.childImages[i][2]+this.units;}
this.element.style.fontSize=fontSize+'em';}
if(this.enforceVisible)
{Tools.Effect.enforceVisible(this.element);this.enforceVisible=false;}};Tools.Effect.Size.prototype.prepareStart=function()
{if(this.options&&this.options.toggle)
this.doToggle();if(this.dynamicFromRect==true)
{var fromRect=Tools.Effect.getDimensions(this.element);this.startWidth=fromRect.width;this.startHeight=fromRect.height;this.widthRange=this.startWidth-this.stopWidth;this.heightRange=this.startHeight-this.stopHeight;}};Tools.Effect.Opacity=function(element,startOpacity,stopOpacity,options)
{this.dynamicStartOpacity=false;if(arguments.length==3)
{options=stopOpacity;stopOpacity=startOpacity;startOpacity=Tools.Effect.getOpacity(element);this.dynamicStartOpacity=true;}
Tools.Effect.Animator.call(this,options);this.name='Opacity';this.element=Tools.Effect.getElement(element);if(!this.element)
return;if(/MSIE/.test(navigator.userAgent)&&(!this.element.hasLayout))
Tools.Effect.setStyleProp(this.element,'zoom','1');this.startOpacity=startOpacity;this.stopOpacity=stopOpacity;this.enforceVisible=Tools.Effect.isInvisible(this.element);};Tools.Effect.Opacity.prototype=new Tools.Effect.Animator();Tools.Effect.Opacity.prototype.constructor=Tools.Effect.Opacity;Tools.Effect.Opacity.prototype.animate=function()
{var opacity=0;var elapsed=this.getElapsedMilliseconds();if(this.direction==Tools.forwards)
opacity=this.options.transition(elapsed,this.startOpacity,this.stopOpacity-this.startOpacity,this.options.duration);else if(this.direction==Tools.backwards)
opacity=this.options.transition(elapsed,this.stopOpacity,this.startOpacity-this.stopOpacity,this.options.duration);if(opacity<0)
opacity=0;if(/MSIE/.test(navigator.userAgent))
{var tmpval=Tools.Effect.getStyleProp(this.element,'filter');if(tmpval){tmpval=tmpval.replace(/alpha\(opacity=[0-9]{1,3}\)/g,'');}
this.element.style.filter=tmpval+"alpha(opacity="+Math.floor(opacity*100)+")";}
else
this.element.style.opacity=opacity;if(this.enforceVisible)
{Tools.Effect.enforceVisible(this.element);this.enforceVisible=false;}};Tools.Effect.Opacity.prototype.prepareStart=function()
{if(this.options&&this.options.toggle)
this.doToggle();if(this.dynamicStartOpacity==true)
{this.startOpacity=Tools.Effect.getOpacity(this.element);this.opacityRange=this.startOpacity-this.stopOpacity;}};Tools.Effect.Color=function(element,startColor,stopColor,options)
{this.dynamicStartColor=false;if(arguments.length==3)
{options=stopColor;stopColor=startColor;startColor=Tools.Effect.getBgColor(element);this.dynamicStartColor=true;}
Tools.Effect.Animator.call(this,options);this.name='Color';this.element=Tools.Effect.getElement(element);if(!this.element)
return;this.startColor=startColor;this.stopColor=stopColor;this.startRedColor=Tools.Effect.Utils.hexToInt(startColor.substr(1,2));this.startGreenColor=Tools.Effect.Utils.hexToInt(startColor.substr(3,2));this.startBlueColor=Tools.Effect.Utils.hexToInt(startColor.substr(5,2));this.stopRedColor=Tools.Effect.Utils.hexToInt(stopColor.substr(1,2));this.stopGreenColor=Tools.Effect.Utils.hexToInt(stopColor.substr(3,2));this.stopBlueColor=Tools.Effect.Utils.hexToInt(stopColor.substr(5,2));};Tools.Effect.Color.prototype=new Tools.Effect.Animator();Tools.Effect.Color.prototype.constructor=Tools.Effect.Color;Tools.Effect.Color.prototype.animate=function()
{var redColor=0;var greenColor=0;var blueColor=0;var floor=Math.floor;var elapsed=this.getElapsedMilliseconds();if(this.direction==Tools.forwards)
{redColor=floor(this.options.transition(elapsed,this.startRedColor,this.stopRedColor-this.startRedColor,this.options.duration));greenColor=floor(this.options.transition(elapsed,this.startGreenColor,this.stopGreenColor-this.startGreenColor,this.options.duration));blueColor=floor(this.options.transition(elapsed,this.startBlueColor,this.stopBlueColor-this.startBlueColor,this.options.duration));}
else if(this.direction==Tools.backwards)
{redColor=floor(this.options.transition(elapsed,this.stopRedColor,this.startRedColor-this.stopRedColor,this.options.duration));greenColor=floor(this.options.transition(elapsed,this.stopGreenColor,this.startGreenColor-this.stopGreenColor,this.options.duration));blueColor=floor(this.options.transition(elapsed,this.stopBlueColor,this.startBlueColor-this.stopBlueColor,this.options.duration));}
this.element.style.backgroundColor=Tools.Effect.Utils.rgb(redColor,greenColor,blueColor);};Tools.Effect.Color.prototype.prepareStart=function()
{if(this.options&&this.options.toggle)
this.doToggle();if(this.dynamicStartColor==true)
{this.startColor=Tools.Effect.getBgColor(element);this.startRedColor=Tools.Effect.Utils.hexToInt(startColor.substr(1,2));this.startGreenColor=Tools.Effect.Utils.hexToInt(startColor.substr(3,2));this.startBlueColor=Tools.Effect.Utils.hexToInt(startColor.substr(5,2));this.redColorRange=this.startRedColor-this.stopRedColor;this.greenColorRange=this.startGreenColor-this.stopGreenColor;this.blueColorRange=this.startBlueColor-this.stopBlueColor;}};Tools.Effect.Cluster=function(options)
{Tools.Effect.Animator.call(this,options);this.name='Cluster';this.effectsArray=new Array();this.currIdx=-1;var _ClusteredEffect=function(effect,kind)
{this.effect=effect;this.kind=kind;this.isRunning=false;};this.ClusteredEffect=_ClusteredEffect;};Tools.Effect.Cluster.prototype=new Tools.Effect.Animator();Tools.Effect.Cluster.prototype.constructor=Tools.Effect.Cluster;Tools.Effect.Cluster.prototype.setInterval=function(interval){var l=this.effectsArray.length;this.options.interval=interval;for(var i=0;i<l;i++)
{this.effectsArray[i].effect.setInterval(interval);}};Tools.Effect.Cluster.prototype.drawEffect=function()
{var isRunning=true;var allEffectsDidRun=false;var baseEffectIsStillRunning=false;var evalNextEffectsRunning=false;if((this.currIdx==-1&&this.direction==Tools.forwards)||(this.currIdx==this.effectsArray.length&&this.direction==Tools.backwards))
this.initNextEffectsRunning();var start=this.direction==Tools.forwards?0:this.effectsArray.length-1;var stop=this.direction==Tools.forwards?this.effectsArray.length:-1;var step=this.direction==Tools.forwards?1:-1;for(var i=start;i!=stop;i+=step)
{if(this.effectsArray[i].isRunning==true)
{baseEffectIsStillRunning=this.effectsArray[i].effect.drawEffect();if(baseEffectIsStillRunning==false&&i==this.currIdx)
{this.effectsArray[i].isRunning=false;evalNextEffectsRunning=true;}}}
if(evalNextEffectsRunning==true)
allEffectsDidRun=this.initNextEffectsRunning();if(allEffectsDidRun==true){this.stop();isRunning=false;for(var i=0;i<this.effectsArray.length;i++)
this.effectsArray[i].isRunning=false;this.currIdx=this.direction==Tools.forwards?this.effectsArray.length:-1;}
return isRunning;};Tools.Effect.Cluster.prototype.initNextEffectsRunning=function()
{var allEffectsDidRun=false;var step=this.direction==Tools.forwards?1:-1;var stop=this.direction==Tools.forwards?this.effectsArray.length:-1;this.currIdx+=step;if((this.currIdx>(this.effectsArray.length-1)&&this.direction==Tools.forwards)||(this.currIdx<0&&this.direction==Tools.backwards))
allEffectsDidRun=true;else
for(var i=this.currIdx;i!=stop;i+=step)
{if((i>this.currIdx&&this.direction==Tools.forwards||i<this.currIdx&&this.direction==Tools.backwards)&&this.effectsArray[i].kind=="queue")
break;this.effectsArray[i].effect.start(true);this.effectsArray[i].isRunning=true;this.currIdx=i;}
return allEffectsDidRun;};Tools.Effect.Cluster.prototype.toggleCluster=function()
{if(!this.direction)
{this.direction=Tools.forwards;return;}
if(this.options.toggle==true)
{if(this.direction==Tools.forwards)
{this.direction=Tools.backwards;this.notifyObservers('onToggle',this);this.currIdx=this.effectsArray.length;}
else if(this.direction==Tools.backwards)
{this.direction=Tools.forwards;this.currIdx=-1;}}
else
{if(this.direction==Tools.forwards)
this.currIdx=-1;else if(this.direction==Tools.backwards)
this.currIdx=this.effectsArray.length;}};Tools.Effect.Cluster.prototype.doToggle=function()
{this.toggleCluster();for(var i=0;i<this.effectsArray.length;i++)
{if(this.effectsArray[i].effect.options&&(this.effectsArray[i].effect.options.toggle!=null))
if(this.effectsArray[i].effect.options.toggle==true)
this.effectsArray[i].effect.doToggle();}};Tools.Effect.Cluster.prototype.cancel=function()
{for(var i=0;i<this.effectsArray.length;i++)
if(this.effectsArray[i].effect.isRunning)
this.effectsArray[i].effect.cancel();var elapsed=this.getElapsedMilliseconds();if(this.startMilliseconds>0&&elapsed<this.options.duration)
this.cancelRemaining=this.options.transition(elapsed,0,1,this.options.duration);this.stopFlagReset();this.notifyObservers('onCancel',this);this.isRunning=false;};Tools.Effect.Cluster.prototype.addNextEffect=function(effect)
{effect.addObserver(this);this.effectsArray[this.effectsArray.length]=new this.ClusteredEffect(effect,"queue");if(this.effectsArray.length==1)
{this.element=effect.element;}};Tools.Effect.Cluster.prototype.addParallelEffect=function(effect)
{if(this.effectsArray.length==0||this.effectsArray[this.effectsArray.length-1].kind!='parallel')
effect.addObserver(this);this.effectsArray[this.effectsArray.length]=new this.ClusteredEffect(effect,"parallel");if(this.effectsArray.length==1)
{this.element=effect.element;}};Tools.Effect.Cluster.prototype.prepareStart=function()
{this.toggleCluster();};Tools.Effect.Fade=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Fade');Tools.Effect.Cluster.call(this,options);this.name='Fade';var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;var durationInMilliseconds=1000;var fromOpacity=0.0;var toOpacity=100.0;var doToggle=false;var transition=Tools.fifthTransition;var fps=60;var originalOpacity=0;if(/MSIE/.test(navigator.userAgent))
originalOpacity=parseInt(Tools.Effect.getStylePropRegardlessOfDisplayState(this.element,'filter').replace(/alpha\(opacity=([0-9]{1,3})\)/g,'$1'),10);else
originalOpacity=parseInt(Tools.Effect.getStylePropRegardlessOfDisplayState(this.element,'opacity')*100,10);if(isNaN(originalOpacity))
originalOpacity=100;if(options)
{if(options.duration!=null)durationInMilliseconds=options.duration;if(options.from!=null){if(Tools.Effect.Utils.isPercentValue(options.from))
fromOpacity=Tools.Effect.Utils.getPercentValue(options.from)*originalOpacity/100;else
fromOpacity=options.from;}
if(options.to!=null)
{if(Tools.Effect.Utils.isPercentValue(options.to))
toOpacity=Tools.Effect.Utils.getPercentValue(options.to)*originalOpacity/100;else
toOpacity=options.to;}
if(options.toggle!=null)doToggle=options.toggle;if(options.transition!=null)transition=options.transition;if(options.fps!=null)fps=options.fps;else this.options.transition=transition;}
fromOpacity=fromOpacity/100.0;toOpacity=toOpacity/100.0;options={duration:durationInMilliseconds,toggle:doToggle,transition:transition,from:fromOpacity,to:toOpacity,fps:fps};var fadeEffect=new Tools.Effect.Opacity(element,fromOpacity,toOpacity,options);this.addNextEffect(fadeEffect);};Tools.Effect.Fade.prototype=new Tools.Effect.Cluster();Tools.Effect.Fade.prototype.constructor=Tools.Effect.Fade;Tools.Effect.Blind=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Blind');Tools.Effect.Cluster.call(this,options);this.name='Blind';var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;var durationInMilliseconds=1000;var doToggle=false;var kindOfTransition=Tools.circleTransition;var fps=60;var doScaleContent=false;Tools.Effect.makeClipping(element);var originalRect=Tools.Effect.getDimensionsRegardlessOfDisplayState(element);var fromHeightPx=originalRect.height;var toHeightPx=0;var optionFrom=options?options.from:originalRect.height;var optionTo=options?options.to:0;var fullCSSBox=false;if(options)
{if(options.duration!=null)durationInMilliseconds=options.duration;if(options.from!=null)
{if(Tools.Effect.Utils.isPercentValue(options.from))
fromHeightPx=Tools.Effect.Utils.getPercentValue(options.from)*originalRect.height/100;else
fromHeightPx=Tools.Effect.Utils.getPixelValue(options.from);}
if(options.to!=null)
{if(Tools.Effect.Utils.isPercentValue(options.to))
toHeightPx=Tools.Effect.Utils.getPercentValue(options.to)*originalRect.height/100;else
toHeightPx=Tools.Effect.Utils.getPixelValue(options.to);}
if(options.toggle!=null)doToggle=options.toggle;if(options.transition!=null)kindOfTransition=options.transition;if(options.fps!=null)fps=options.fps;if(options.useCSSBox!=null)fullCSSBox=options.useCSSBox;}
var fromRect=new Tools.Effect.Utils.Rectangle;fromRect.width=originalRect.width;fromRect.height=fromHeightPx;var toRect=new Tools.Effect.Utils.Rectangle;toRect.width=originalRect.width;toRect.height=toHeightPx;options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,scaleContent:doScaleContent,useCSSBox:fullCSSBox,from:optionFrom,to:optionTo,fps:fps};var blindEffect=new Tools.Effect.Size(element,fromRect,toRect,options);this.addNextEffect(blindEffect);};Tools.Effect.Blind.prototype=new Tools.Effect.Cluster();Tools.Effect.Blind.prototype.constructor=Tools.Effect.Blind;Tools.Effect.Highlight=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Highlight');Tools.Effect.Cluster.call(this,options);this.name='Highlight';var durationInMilliseconds=1000;var toColor="#ffffff";var doToggle=false;var kindOfTransition=Tools.sinusoidalTransition;var fps=60;var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;var fromColor=Tools.Effect.getBgColor(element);if(fromColor=="transparent")fromColor="#ffff99";if(options)
{if(options.duration!=null)durationInMilliseconds=options.duration;if(options.from!=null)fromColor=options.from;if(options.to!=null)toColor=options.to;if(options.toggle!=null)doToggle=options.toggle;if(options.transition!=null)kindOfTransition=options.transition;if(options.fps!=null)fps=options.fps;}
if(fromColor.indexOf('rgb')!=-1)
var fromColor=Tools.Effect.Utils.rgb(parseInt(fromColor.substring(fromColor.indexOf('(')+1,fromColor.indexOf(',')),10),parseInt(fromColor.substring(fromColor.indexOf(',')+1,fromColor.lastIndexOf(',')),10),parseInt(fromColor.substring(fromColor.lastIndexOf(',')+1,fromColor.indexOf(')')),10));if(toColor.indexOf('rgb')!=-1)
var toColor=Tools.Effect.Utils.rgb(parseInt(toColor.substring(toColor.indexOf('(')+1,toColor.indexOf(',')),10),parseInt(toColor.substring(toColor.indexOf(',')+1,toColor.lastIndexOf(',')),10),parseInt(toColor.substring(toColor.lastIndexOf(',')+1,toColor.indexOf(')')),10));var fromColor=Tools.Effect.Utils.longColorVersion(fromColor);var toColor=Tools.Effect.Utils.longColorVersion(toColor);this.restoreBackgroundImage=Tools.Effect.getStyleProp(element,'background-image');options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,fps:fps};var highlightEffect=new Tools.Effect.Color(element,fromColor,toColor,options);this.addNextEffect(highlightEffect);this.addObserver({onPreEffect:function(effect){Tools.Effect.setStyleProp(effect.element,'background-image','none');},onPostEffect:function(effect){Tools.Effect.setStyleProp(effect.element,'background-image',effect.restoreBackgroundImage);if(effect.direction==Tools.forwards&&effect.options.restoreColor)
Tools.Effect.setStyleProp(element,'background-color',effect.options.restoreColor);}});};Tools.Effect.Highlight.prototype=new Tools.Effect.Cluster();Tools.Effect.Highlight.prototype.constructor=Tools.Effect.Highlight;Tools.Effect.Slide=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Slide');Tools.Effect.Cluster.call(this,options);this.name='Slide';var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;var durationInMilliseconds=1000;var doToggle=false;var kindOfTransition=Tools.sinusoidalTransition;var fps=60;var slideHorizontally=false;var firstChildElt=Tools.Effect.Utils.getFirstChildElement(element);var direction=-1;if(/MSIE 7.0/.test(navigator.userAgent)&&/Windows NT/.test(navigator.userAgent))
Tools.Effect.makePositioned(element);Tools.Effect.makeClipping(element);if(/MSIE 6.0/.test(navigator.userAgent)&&/Windows NT/.test(navigator.userAgent))
{var pos=Tools.Effect.getStyleProp(element,'position');if(pos&&(pos=='static'||pos=='fixed'))
{Tools.Effect.setStyleProp(element,'position','relative');Tools.Effect.setStyleProp(element,'top','');Tools.Effect.setStyleProp(element,'left','');}}
if(firstChildElt)
{Tools.Effect.makePositioned(firstChildElt);Tools.Effect.makeClipping(firstChildElt);var childRect=Tools.Effect.getDimensionsRegardlessOfDisplayState(firstChildElt,element);Tools.Effect.setStyleProp(firstChildElt,'width',childRect.width+'px');}
var fromDim=Tools.Effect.getDimensionsRegardlessOfDisplayState(element);var initDim=new Tools.Effect.Utils.Rectangle();var toDim=new Tools.Effect.Utils.Rectangle();initDim.width=toDim.width=fromDim.width;initDim.height=toDim.height=fromDim.height;if(!this.options.to){if(!options)
options={};options.to='0%';}
if(options&&options.horizontal!==null&&options.horizontal===true)
slideHorizontally=true;if(options.duration!=null)durationInMilliseconds=options.duration;if(options.from!=null)
{if(slideHorizontally)
{if(Tools.Effect.Utils.isPercentValue(options.from))
fromDim.width=initDim.width*Tools.Effect.Utils.getPercentValue(options.from)/100;else
fromDim.width=Tools.Effect.Utils.getPixelValue(options.from);}
else
{if(Tools.Effect.Utils.isPercentValue(options.from))
fromDim.height=initDim.height*Tools.Effect.Utils.getPercentValue(options.from)/100;else
fromDim.height=Tools.Effect.Utils.getPixelValue(options.from);}}
if(options.to!=null)
{if(slideHorizontally)
{if(Tools.Effect.Utils.isPercentValue(options.to))
toDim.width=initDim.width*Tools.Effect.Utils.getPercentValue(options.to)/100;else
toDim.width=Tools.Effect.Utils.getPixelValue(options.to);}
else
{if(Tools.Effect.Utils.isPercentValue(options.to))
toDim.height=initDim.height*Tools.Effect.Utils.getPercentValue(options.to)/100;else
toDim.height=Tools.Effect.Utils.getPixelValue(options.to);}}
if(options.toggle!=null)doToggle=options.toggle;if(options.transition!=null)kindOfTransition=options.transition;if(options.fps!=null)fps=options.fps;options={duration:durationInMilliseconds,transition:kindOfTransition,scaleContent:false,toggle:doToggle,fps:fps};var size=new Tools.Effect.Size(element,fromDim,toDim,options);this.addParallelEffect(size);if((fromDim.width<toDim.width&&slideHorizontally)||(fromDim.height<toDim.height&&!slideHorizontally))
direction=1;var fromPos=new Tools.Effect.Utils.Position();var toPos=new Tools.Effect.Utils.Position();toPos.x=fromPos.x=Tools.Effect.intPropStyle(firstChildElt,'left');toPos.y=fromPos.y=Tools.Effect.intPropStyle(firstChildElt,'top');toPos.units=fromPos.units;if(slideHorizontally)
toPos.x=parseInt(fromPos.x+direction*(fromDim.width-toDim.width),10);else
toPos.y=parseInt(fromPos.y+direction*(fromDim.height-toDim.height),10);if(direction==1){var tmp=fromPos;var fromPos=toPos;var toPos=tmp;}
options={duration:durationInMilliseconds,transition:kindOfTransition,toggle:doToggle,from:fromPos,to:toPos,fps:fps};var move=new Tools.Effect.Move(firstChildElt,fromPos,toPos,options);this.addParallelEffect(move);};Tools.Effect.Slide.prototype=new Tools.Effect.Cluster();Tools.Effect.Slide.prototype.constructor=Tools.Effect.Slide;Tools.Effect.Grow=function(element,options)
{if(!element)
return;if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Grow');Tools.Effect.Cluster.call(this,options);this.name='Grow';var durationInMilliseconds=1000;var doToggle=false;var doScaleContent=true;var calcHeight=false;var growFromCenter=true;var fullCSSBox=false;var kindOfTransition=Tools.squareTransition;var fps=60;var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;Tools.Effect.makeClipping(element);var dimRect=Tools.Effect.getDimensionsRegardlessOfDisplayState(element);var originalWidth=dimRect.width;var originalHeight=dimRect.height;var propFactor=(originalWidth==0)?1:originalHeight/originalWidth;var fromRect=new Tools.Effect.Utils.Rectangle;fromRect.width=0;fromRect.height=0;var toRect=new Tools.Effect.Utils.Rectangle;toRect.width=originalWidth;toRect.height=originalHeight;var optionFrom=options?options.from:dimRect.width;var optionTo=options?options.to:0;var pixelValue=Tools.Effect.Utils.getPixelValue;if(options)
{if(options.growCenter!=null)growFromCenter=options.growCenter;if(options.duration!=null)durationInMilliseconds=options.duration;if(options.useCSSBox!=null)fullCSSBox=options.useCSSBox;if(options.scaleContent!=null)doScaleContent=options.scaleContent;if(options.from!=null)
{if(Tools.Effect.Utils.isPercentValue(options.from))
{fromRect.width=originalWidth*(Tools.Effect.Utils.getPercentValue(options.from)/100);fromRect.height=originalHeight*(Tools.Effect.Utils.getPercentValue(options.from)/100);}
else
{if(calcHeight)
{fromRect.height=pixelValue(options.from);fromRect.width=pixelValue(options.from)/propFactor;}
else
{fromRect.width=pixelValue(options.from);fromRect.height=propFactor*pixelValue(options.from);}}}
if(options.to!=null)
{if(Tools.Effect.Utils.isPercentValue(options.to))
{toRect.width=originalWidth*(Tools.Effect.Utils.getPercentValue(options.to)/100);toRect.height=originalHeight*(Tools.Effect.Utils.getPercentValue(options.to)/100);}
else
{if(calcHeight)
{toRect.height=pixelValue(options.to);toRect.width=pixelValue(options.to)/propFactor;}
else
{toRect.width=pixelValue(options.to);toRect.height=propFactor*pixelValue(options.to);}}}
if(options.toggle!=null)doToggle=options.toggle;if(options.transition!=null)kindOfTransition=options.transition;if(options.fps!=null)fps=options.fps;}
options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,scaleContent:doScaleContent,useCSSBox:fullCSSBox,fps:fps};var sizeEffect=new Tools.Effect.Size(element,fromRect,toRect,options);this.addParallelEffect(sizeEffect);if(growFromCenter)
{Tools.Effect.makePositioned(element);var startOffsetPosition=new Tools.Effect.Utils.Position();startOffsetPosition.x=parseInt(Tools.Effect.getStylePropRegardlessOfDisplayState(element,"left"),10);startOffsetPosition.y=parseInt(Tools.Effect.getStylePropRegardlessOfDisplayState(element,"top"),10);if(!startOffsetPosition.x)startOffsetPosition.x=0;if(!startOffsetPosition.y)startOffsetPosition.y=0;options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,from:optionFrom,to:optionTo,fps:fps};var fromPos=new Tools.Effect.Utils.Position;fromPos.x=startOffsetPosition.x+(originalWidth-fromRect.width)/2.0;fromPos.y=startOffsetPosition.y+(originalHeight-fromRect.height)/2.0;var toPos=new Tools.Effect.Utils.Position;toPos.x=startOffsetPosition.x+(originalWidth-toRect.width)/2.0;toPos.y=startOffsetPosition.y+(originalHeight-toRect.height)/2.0;var moveEffect=new Tools.Effect.Move(element,fromPos,toPos,options);this.addParallelEffect(moveEffect);}};Tools.Effect.Grow.prototype=new Tools.Effect.Cluster();Tools.Effect.Grow.prototype.constructor=Tools.Effect.Grow;Tools.Effect.Shake=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Shake');Tools.Effect.Cluster.call(this,options);this.options.direction=false;if(this.options.toggle)
this.options.toggle=false;this.name='Shake';var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;var durationInMilliseconds=100;var kindOfTransition=Tools.linearTransition;var fps=60;var steps=4;if(options)
{if(options.duration!=null)steps=Math.ceil(this.options.duration/durationInMilliseconds)-1;if(options.fps!=null)fps=options.fps;if(options.transition!=null)kindOfTransition=options.transition;}
Tools.Effect.makePositioned(element);var startOffsetPosition=new Tools.Effect.Utils.Position();startOffsetPosition.x=parseInt(Tools.Effect.getStyleProp(element,"left"),10);startOffsetPosition.y=parseInt(Tools.Effect.getStyleProp(element,"top"),10);if(!startOffsetPosition.x)startOffsetPosition.x=0;if(!startOffsetPosition.y)startOffsetPosition.y=0;var centerPos=new Tools.Effect.Utils.Position;centerPos.x=startOffsetPosition.x;centerPos.y=startOffsetPosition.y;var rightPos=new Tools.Effect.Utils.Position;rightPos.x=startOffsetPosition.x+20;rightPos.y=startOffsetPosition.y+0;var leftPos=new Tools.Effect.Utils.Position;leftPos.x=startOffsetPosition.x+-20;leftPos.y=startOffsetPosition.y+0;options={duration:Math.ceil(durationInMilliseconds/2),toggle:false,fps:fps,transition:kindOfTransition};var effect=new Tools.Effect.Move(element,centerPos,rightPos,options);this.addNextEffect(effect);options={duration:durationInMilliseconds,toggle:false,fps:fps,transition:kindOfTransition};var effectToRight=new Tools.Effect.Move(element,rightPos,leftPos,options);var effectToLeft=new Tools.Effect.Move(element,leftPos,rightPos,options);for(var i=0;i<steps;i++)
{if(i%2==0)
this.addNextEffect(effectToRight);else
this.addNextEffect(effectToLeft);}
var pos=(steps%2==0)?rightPos:leftPos;options={duration:Math.ceil(durationInMilliseconds/2),toggle:false,fps:fps,transition:kindOfTransition};var effect=new Tools.Effect.Move(element,pos,centerPos,options);this.addNextEffect(effect);};Tools.Effect.Shake.prototype=new Tools.Effect.Cluster();Tools.Effect.Shake.prototype.constructor=Tools.Effect.Shake;Tools.Effect.Shake.prototype.doToggle=function(){};Tools.Effect.Squish=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Squish');if(!options)
options={};if(!options.to)
options.to='0%';if(!options.from)
options.from='100%';options.growCenter=false;Tools.Effect.Grow.call(this,element,options);this.name='Squish';};Tools.Effect.Squish.prototype=new Tools.Effect.Grow();Tools.Effect.Squish.prototype.constructor=Tools.Effect.Squish;Tools.Effect.Pulsate=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Pulsate');Tools.Effect.Cluster.call(this,options);this.options.direction=false;if(this.options.toggle)
this.options.toggle=false;var element=Tools.Effect.getElement(element);var originalOpacity=0;this.element=element;if(!this.element)
return;this.name='Pulsate';var durationInMilliseconds=100;var fromOpacity=100.0;var toOpacity=0.0;var doToggle=false;var kindOfTransition=Tools.linearTransition;var fps=60;if(/MSIE/.test(navigator.userAgent))
originalOpacity=parseInt(Tools.Effect.getStylePropRegardlessOfDisplayState(this.element,'filter').replace(/alpha\(opacity=([0-9]{1,3})\)/g,'$1'),10);else
originalOpacity=parseInt(Tools.Effect.getStylePropRegardlessOfDisplayState(this.element,'opacity')*100,10);if(isNaN(originalOpacity)){originalOpacity=100;}
if(options)
{if(options.from!=null){if(Tools.Effect.Utils.isPercentValue(options.from))
fromOpacity=Tools.Effect.Utils.getPercentValue(options.from)*originalOpacity/100;else
fromOpacity=options.from;}
if(options.to!=null)
{if(Tools.Effect.Utils.isPercentValue(options.to))
toOpacity=Tools.Effect.Utils.getPercentValue(options.to)*originalOpacity/100;else
toOpacity=options.to;}
if(options.transition!=null)kindOfTransition=options.transition;if(options.fps!=null)fps=options.fps;}
options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,fps:fps};fromOpacity=fromOpacity/100.0;toOpacity=toOpacity/100.0;var fadeEffect=new Tools.Effect.Opacity(element,fromOpacity,toOpacity,options);var appearEffect=new Tools.Effect.Opacity(element,toOpacity,fromOpacity,options);var steps=parseInt(this.options.duration/200,10);for(var i=0;i<steps;i++){this.addNextEffect(fadeEffect);this.addNextEffect(appearEffect);}};Tools.Effect.Pulsate.prototype=new Tools.Effect.Cluster();Tools.Effect.Pulsate.prototype.constructor=Tools.Effect.Pulsate;Tools.Effect.Pulsate.prototype.doToggle=function(){};Tools.Effect.Puff=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Puff');Tools.Effect.Cluster.call(this,options);var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;this.name='Puff';var doToggle=false;var doScaleContent=false;var durationInMilliseconds=1000;var kindOfTransition=Tools.fifthTransition;var fps=60;Tools.Effect.makePositioned(element);if(options){if(options.toggle!=null)doToggle=options.toggle;if(options.duration!=null)durationInMilliseconds=options.duration;if(options.transition!=null)kindOfTransition=options.transition;if(options.fps!=null)fps=options.fps;}
var originalRect=Tools.Effect.getDimensions(element);var startWidth=originalRect.width;var startHeight=originalRect.height;options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,fps:fps};var fromOpacity=1.0;var toOpacity=0.0;var opacityEffect=new Tools.Effect.Opacity(element,fromOpacity,toOpacity,options);this.addParallelEffect(opacityEffect);var fromPos=Tools.Effect.getPosition(element);var toPos=new Tools.Effect.Utils.Position;toPos.x=startWidth/2.0*-1.0;toPos.y=startHeight/2.0*-1.0;options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,from:fromPos,to:toPos,fps:fps};var moveEffect=new Tools.Effect.Move(element,fromPos,toPos,options);this.addParallelEffect(moveEffect);var self=this;this.addObserver({onPreEffect:function(){if(self.direction==Tools.backwards){self.element.style.display='block';}},onPostEffect:function(){if(self.direction==Tools.forwards){self.element.style.display='none';}}});};Tools.Effect.Puff.prototype=new Tools.Effect.Cluster;Tools.Effect.Puff.prototype.constructor=Tools.Effect.Puff;Tools.Effect.DropOut=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('DropOut');Tools.Effect.Cluster.call(this,options);var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;var durationInMilliseconds=1000;var fps=60;var kindOfTransition=Tools.fifthTransition;var direction=Tools.forwards;var doToggle=false;this.name='DropOut';Tools.Effect.makePositioned(element);if(options)
{if(options.duration!=null)durationInMilliseconds=options.duration;if(options.toggle!=null)doToggle=options.toggle;if(options.fps!=null)fps=options.fps;if(options.transition!=null)kindOfTransition=options.transition;if(options.dropIn!=null)direction=-1;}
var startOffsetPosition=new Tools.Effect.Utils.Position();startOffsetPosition.x=parseInt(Tools.Effect.getStyleProp(element,"left"),10);startOffsetPosition.y=parseInt(Tools.Effect.getStyleProp(element,"top"),10);if(!startOffsetPosition.x)startOffsetPosition.x=0;if(!startOffsetPosition.y)startOffsetPosition.y=0;var fromPos=new Tools.Effect.Utils.Position;fromPos.x=startOffsetPosition.x+0;fromPos.y=startOffsetPosition.y+0;var toPos=new Tools.Effect.Utils.Position;toPos.x=startOffsetPosition.x+0;toPos.y=startOffsetPosition.y+(direction*160);options={from:fromPos,to:toPos,duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,fps:fps};var moveEffect=new Tools.Effect.Move(element,options.from,options.to,options);this.addParallelEffect(moveEffect);var fromOpacity=1.0;var toOpacity=0.0;options={duration:durationInMilliseconds,toggle:doToggle,transition:kindOfTransition,fps:fps};var opacityEffect=new Tools.Effect.Opacity(element,fromOpacity,toOpacity,options);this.addParallelEffect(opacityEffect);var self=this;this.addObserver({onPreEffect:function(){self.element.style.display='block';},onPostEffect:function(){if(self.direction==Tools.forwards){self.element.style.display='none';}}});};Tools.Effect.DropOut.prototype=new Tools.Effect.Cluster();Tools.Effect.DropOut.prototype.constructor=Tools.Effect.DropOut;Tools.Effect.Fold=function(element,options)
{if(!this.notStaticAnimator)
return Tools.Effect.Utils.showInitError('Fold');Tools.Effect.Cluster.call(this,options);var element=Tools.Effect.getElement(element);this.element=element;if(!this.element)
return;this.name='Fold';var durationInMilliseconds=1000;var doToggle=false;var doScaleContent=true;var fullCSSBox=false;var kindOfTransition=Tools.fifthTransition;var fps=fps;Tools.Effect.makeClipping(element);var originalRect=Tools.Effect.getDimensionsRegardlessOfDisplayState(element);var startWidth=originalRect.width;var startHeight=originalRect.height;var stopWidth=startWidth;var stopHeight=startHeight/5;var fromRect=new Tools.Effect.Utils.Rectangle;fromRect.width=startWidth;fromRect.height=startHeight;var toRect=new Tools.Effect.Utils.Rectangle;toRect.width=stopWidth;toRect.height=stopHeight;if(options)
{if(options.duration!=null)durationInMilliseconds=Math.ceil(options.duration/2);if(options.toggle!=null)doToggle=options.toggle;if(options.useCSSBox!=null)fullCSSBox=options.useCSSBox;if(options.fps!=null)fps=options.fps;if(options.transition!=null)kindOfTransition=options.transition;}
options={duration:durationInMilliseconds,toggle:doToggle,scaleContent:doScaleContent,useCSSBox:fullCSSBox,transition:kindOfTransition,fps:fps};var sizeEffect=new Tools.Effect.Size(element,fromRect,toRect,options);this.addNextEffect(sizeEffect);fromRect.width=toRect.width;fromRect.height=toRect.height;toRect.width='0%';var sizeEffect=new Tools.Effect.Size(element,fromRect,toRect,options);this.addNextEffect(sizeEffect);};Tools.Effect.Fold.prototype=new Tools.Effect.Cluster();Tools.Effect.Fold.prototype.constructor=Tools.Effect.Fold;Tools.Effect.DoFade=function(element,options)
{return Tools.Effect.Utils.DoEffect('Fade',element,options);};Tools.Effect.DoBlind=function(element,options)
{return Tools.Effect.Utils.DoEffect('Blind',element,options);};Tools.Effect.DoHighlight=function(element,options)
{return Tools.Effect.Utils.DoEffect('Highlight',element,options);};Tools.Effect.DoSlide=function(element,options)
{return Tools.Effect.Utils.DoEffect('Slide',element,options);};Tools.Effect.DoGrow=function(element,options)
{return Tools.Effect.Utils.DoEffect('Grow',element,options);};Tools.Effect.DoShake=function(element,options)
{return Tools.Effect.Utils.DoEffect('Shake',element,options);};Tools.Effect.DoSquish=function(element,options)
{return Tools.Effect.Utils.DoEffect('Squish',element,options);};Tools.Effect.DoPulsate=function(element,options)
{return Tools.Effect.Utils.DoEffect('Pulsate',element,options);};Tools.Effect.DoPuff=function(element,options)
{return Tools.Effect.Utils.DoEffect('Puff',element,options);};Tools.Effect.DoDropOut=function(element,options)
{return Tools.Effect.Utils.DoEffect('DropOut',element,options);};Tools.Effect.DoFold=function(element,options)
{return Tools.Effect.Utils.DoEffect('Fold',element,options);};
// ToolsHTMLDataSet.js - version 0.20 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.HTMLDataSet=function(dataSetURL,sourceElementID,dataSetOptions)
{this.sourceElementID=sourceElementID;this.sourceElement=null;this.sourceWasInitialized=false;this.usesExternalFile=(dataSetURL!=null)?true:false;this.firstRowAsHeaders=true;this.useColumnsAsRows=false;this.columnNames=null;this.hideDataSourceElement=true;this.rowSelector=null;this.dataSelector=null;this.tableModeEnabled=true;Tools.Data.HTTPSourceDataSet.call(this,dataSetURL,dataSetOptions);};Tools.Data.HTMLDataSet.prototype=new Tools.Data.HTTPSourceDataSet();Tools.Data.HTMLDataSet.prototype.constructor=Tools.Data.HTMLDataSet;Tools.Data.HTMLDataSet.prototype.getDataRefStrings=function()
{var dep=[];if(this.url)
dep.push(this.url);if(typeof this.sourceElementID=="string")
dep.push(this.sourceElementID);return dep;};Tools.Data.HTMLDataSet.prototype.setDisplay=function(ele,display)
{if(ele)
ele.style.display=display;};Tools.Data.HTMLDataSet.prototype.initDataSource=function(callLoadData)
{if(!this.loadDependentDataSets())
return;if(!this.usesExternalFile)
{this.setSourceElement();if(this.hideDataSourceElement)
this.setDisplay(this.sourceElement,"none");}};Tools.Data.HTMLDataSet.prototype.setSourceElement=function(externalDataElement)
{this.sourceElement=null;if(!this.sourceElementID)
{if(externalDataElement)
this.sourceElement=externalDataElement;else
{this.hideDataSourceElement=false;this.sourceElement=document.body;}
return;}
var sourceElementID=Tools.Data.Region.processDataRefString(null,this.sourceElementID,this.dataSetsForDataRefStrings);if(!this.usesExternalFile)
this.sourceElement=Tools.$(sourceElementID);else
if(externalDataElement)
{var foundElement=false;var sources=Tools.Utils.getNodesByFunc(externalDataElement,function(node)
{if(foundElement)
return false;if(node.nodeType!=1)
return false;if(node.id&&node.id.toLowerCase()==sourceElementID.toLowerCase())
{foundElement=true;return true;}});this.sourceElement=sources[0];}
if(!this.sourceElement)
Tools.Debug.reportError("Tools.Data.HTMLDataSet: '"+sourceElementID+"' is not a valid element ID");};Tools.Data.HTMLDataSet.prototype.getSourceElement=function(){return this.sourceElement;};Tools.Data.HTMLDataSet.prototype.getSourceElementID=function(){return this.sourceElementID;};Tools.Data.HTMLDataSet.prototype.setSourceElementID=function(sourceElementID)
{if(this.sourceElementID!=sourceElementID)
{this.sourceElementID=sourceElementID;this.recalculateDataSetDependencies();this.dataWasLoaded=false;}};Tools.Data.HTMLDataSet.prototype.getDataSelector=function(){return this.dataSelector;};Tools.Data.HTMLDataSet.prototype.setDataSelector=function(dataSelector)
{if(this.dataSelector!=dataSelector)
{this.dataSelector=dataSelector;this.dataWasLoaded=false;}};Tools.Data.HTMLDataSet.prototype.getRowSelector=function(){return this.rowSelector;};Tools.Data.HTMLDataSet.prototype.setRowSelector=function(rowSelector)
{if(this.rowSelector!=rowSelector)
{this.rowSelector=rowSelector;this.dataWasLoaded=false;}};Tools.Data.HTMLDataSet.prototype.loadDataIntoDataSet=function(rawDataDoc)
{var responseText=rawDataDoc;responseText=Tools.Data.HTMLDataSet.cleanupSource(responseText);var div=document.createElement("div");div.id="htmlsource"+this.internalID;div.innerHTML=responseText;this.setSourceElement(div);if(this.sourceElement)
{var parsedStructure=this.getDataFromSourceElement();if(parsedStructure)
{this.dataHash=parsedStructure.dataHash;this.data=parsedStructure.data;}}
this.dataWasLoaded=true;div=null;};Tools.Data.HTMLDataSet.prototype.loadDependentDataSets=function()
{if(this.hasDataRefStrings)
{var allDataSetsReady=true;for(var i=0;i<this.dataSetsForDataRefStrings.length;i++)
{var ds=this.dataSetsForDataRefStrings[i];if(ds.getLoadDataRequestIsPending())
allDataSetsReady=false;else if(!ds.getDataWasLoaded())
{ds.loadData();allDataSetsReady=false;}}
if(!allDataSetsReady)
return false;}
return true;};Tools.Data.HTMLDataSet.prototype.loadData=function()
{this.cancelLoadData();this.initDataSource();var self=this;if(!this.usesExternalFile)
{this.notifyObservers("onPreLoad");this.dataHash=new Object;this.data=new Array;this.dataWasLoaded=false;this.unfilteredData=null;this.curRowID=0;this.pendingRequest=new Object;this.pendingRequest.timer=setTimeout(function()
{self.pendingRequest=null;var parsedStructure=self.getDataFromSourceElement();if(parsedStructure)
{self.dataHash=parsedStructure.dataHash;self.data=parsedStructure.data;}
self.dataWasLoaded=true;self.disableNotifications();self.filterAndSortData();self.enableNotifications();self.notifyObservers("onPostLoad");self.notifyObservers("onDataChanged");},0);}
else
{var url=Tools.Data.Region.processDataRefString(null,this.url,this.dataSetsForDataRefStrings);var postData=this.requestInfo.postData;if(postData&&(typeof postData)=="string")
postData=Tools.Data.Region.processDataRefString(null,postData,this.dataSetsForDataRefStrings);this.notifyObservers("onPreLoad");this.dataHash=new Object;this.data=new Array;this.dataWasLoaded=false;this.unfilteredData=null;this.curRowID=0;var req=this.requestInfo.clone();req.url=url;req.postData=postData;this.pendingRequest=new Object;this.pendingRequest.data=Tools.Data.HTTPSourceDataSet.LoadManager.loadData(req,this,this.useCache);}};Tools.Data.HTMLDataSet.cleanupSource=function(source)
{source=source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi,function(a,b,c){return'<'+b+c.replace(/\b(src|href)\s*=/gi,function(a,b){return'spry_'+b+'=';})+'>';});return source;};Tools.Data.HTMLDataSet.undoCleanupSource=function(source)
{source=source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi,function(a,b,c){return'<'+b+c.replace(/\bspry_(src|href)\s*=/gi,function(a,b){return b+'=';})+'>';});return source;};Tools.Data.HTMLDataSet.normalizeColumnName=function(colName)
{colName=colName.replace(/(?:^[\s\t]+|[\s\t]+$)/gi,"");colName=colName.replace(/<\/?([a-z]+)([^>]+)>/gi,"");colName=colName.replace(/[\s\t]+/gi,"_");return colName;};Tools.Data.HTMLDataSet.prototype.getDataFromSourceElement=function()
{if(!this.sourceElement)
return null;var extractedData;var usesTable=(this.tableModeEnabled&&this.sourceElement.nodeName.toLowerCase()=="table");if(usesTable)
extractedData=this.getDataFromHTMLTable();else
extractedData=this.getDataFromNestedStructure();if(!extractedData)
return null;if(this.useColumnsAsRows)
{var flipedData=new Array;for(var rowIdx=0;rowIdx<extractedData.length;rowIdx++)
{var row=extractedData[rowIdx];for(var cellIdx=0;cellIdx<row.length;cellIdx++)
{if(!flipedData[cellIdx])flipedData[cellIdx]=new Array;flipedData[cellIdx][rowIdx]=row[cellIdx];}}
extractedData=flipedData;}
var parsedStructure=new Object();parsedStructure.dataHash=new Object;parsedStructure.data=new Array;if(extractedData.length==0)
return parsedStructure;var columnNames=new Array;var firstRowOfData=extractedData[0];for(var cellIdx=0;cellIdx<firstRowOfData.length;cellIdx++)
{if(usesTable&&this.firstRowAsHeaders)columnNames[cellIdx]=Tools.Data.HTMLDataSet.normalizeColumnName(firstRowOfData[cellIdx]);else columnNames[cellIdx]="column"+cellIdx;}
if(this.columnNames&&this.columnNames.length)
{if(this.columnNames.length<columnNames.length)
Tools.Debug.reportError("Too few elements in the columnNames array. The columNames length must match the actual number of columns.");else
for(var i=0;i<columnNames.length;i++){if(this.columnNames[i])columnNames[i]=this.columnNames[i];}}
var nextID=0;var firstDataRowIndex=(usesTable&&this.firstRowAsHeaders)?1:0;for(var rowIdx=firstDataRowIndex;rowIdx<extractedData.length;rowIdx++)
{var row=extractedData[rowIdx];if(columnNames.length!=row.length)
{Tools.Debug.reportError("Unbalanced column names for row #"+(rowIdx+1)+". Skipping row.");continue;}
var rowObj={};for(var cellIdx=0;cellIdx<row.length;cellIdx++)
rowObj[columnNames[cellIdx]]=row[cellIdx];rowObj['ds_RowID']=nextID++;parsedStructure.dataHash[rowObj['ds_RowID']]=rowObj;parsedStructure.data.push(rowObj);}
return parsedStructure;};Tools.Data.HTMLDataSet.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Tools.Data.HTMLDataSet.prototype.getDataFromHTMLTable=function()
{var tHead=this.sourceElement.tHead;var tBody=this.sourceElement.tBodies[0];var rowsHead=[];var rowsBody=[];if(tHead)rowsHead=Tools.Data.HTMLDataSet.getElementChildren(tHead);if(tBody)rowsBody=Tools.Data.HTMLDataSet.getElementChildren(tBody);var extractedData=new Array;var rows=rowsHead.concat(rowsBody);if(this.rowSelector)rows=Tools.Data.HTMLDataSet.applySelector(rows,this.rowSelector);for(var rowIdx=0;rowIdx<rows.length;rowIdx++)
{var row=rows[rowIdx];var dataRow;if(extractedData[rowIdx])dataRow=extractedData[rowIdx];else dataRow=new Array;var offset=0;var cells=row.cells;if(this.dataSelector)cells=Tools.Data.HTMLDataSet.applySelector(cells,this.dataSelector);for(var cellIdx=0;cellIdx<cells.length;cellIdx++)
{var cell=cells[cellIdx];var nextCellIndex=cellIdx+offset;while(dataRow[nextCellIndex])
{offset++;nextCellIndex++;}
var cellValue=Tools.Data.HTMLDataSet.undoCleanupSource(cell.innerHTML);dataRow[nextCellIndex]=cellValue;var colspan=cell.colSpan;if(colspan==0)colspan=1;var startOffset=offset;for(var offIdx=1;offIdx<colspan;offIdx++)
{offset++;nextCellIndex=cellIdx+offset;dataRow[nextCellIndex]=cellValue;}
var rowspan=cell.rowSpan;if(rowspan==0)rowspan=1;for(var rowOffIdx=1;rowOffIdx<rowspan;rowOffIdx++)
{nextRowIndex=rowIdx+rowOffIdx;var nextDataRow;if(extractedData[nextRowIndex])nextDataRow=extractedData[nextRowIndex];else nextDataRow=new Array;var rowSpanCellOffset=startOffset;for(var offIdx=0;offIdx<colspan;offIdx++)
{nextCellIndex=cellIdx+rowSpanCellOffset;nextDataRow[nextCellIndex]=cellValue;rowSpanCellOffset++;}
extractedData[nextRowIndex]=nextDataRow;}}
extractedData[rowIdx]=dataRow;}
return extractedData;};Tools.Data.HTMLDataSet.prototype.getDataFromNestedStructure=function()
{var extractedData=new Array;if(this.sourceElementID&&!this.rowSelector&&!this.dataSelector)
{extractedData[0]=[Tools.Data.HTMLDataSet.undoCleanupSource(this.sourceElement.innerHTML)];return extractedData;}
var self=this;var rows=[];if(!this.rowSelector)
rows=[this.sourceElement];else
rows=Tools.Utils.getNodesByFunc(this.sourceElement,function(node){return Tools.Data.HTMLDataSet.evalSelector(node,self.sourceElement,self.rowSelector);});for(var rowIdx=0;rowIdx<rows.length;rowIdx++)
{var row=rows[rowIdx];var cells=[];if(!this.dataSelector)
cells=[row];else
cells=Tools.Utils.getNodesByFunc(row,function(node){return Tools.Data.HTMLDataSet.evalSelector(node,row,self.dataSelector);});extractedData[rowIdx]=new Array;for(var cellIdx=0;cellIdx<cells.length;cellIdx++)
extractedData[rowIdx][cellIdx]=Tools.Data.HTMLDataSet.undoCleanupSource(cells[cellIdx].innerHTML);}
return extractedData;};Tools.Data.HTMLDataSet.applySelector=function(collection,selector,root)
{var newCollection=[];for(var idx=0;idx<collection.length;idx++)
{var node=collection[idx];if(Tools.Data.HTMLDataSet.evalSelector(node,root?root:node.parentNode,selector))
newCollection.push(node);}
return newCollection;};Tools.Data.HTMLDataSet.evalSelector=function(node,root,selector)
{if(node.nodeType!=1)
return false;if(node==root)
return false;var selectors=selector.split(",");for(var idx=0;idx<selectors.length;idx++)
{var currentSelector=selectors[idx].replace(/^\s+/,"").replace(/\s+$/,"");var tagName=null;var className=null;var id=null;var selected=true;if(currentSelector.substring(0,1)==">")
{if(node.parentNode!=root)
selected=false;else
currentSelector=currentSelector.substring(1).replace(/^\s+/,"");}
if(selected)
{tagName=currentSelector.toLowerCase();if(currentSelector.indexOf(".")!=-1)
{var parts=currentSelector.split(".");tagName=parts[0];className=parts[1];}
else if(currentSelector.indexOf("#")!=-1)
{var parts=currentSelector.split("#");tagName=parts[0];id=parts[1];}}
if(selected&&tagName!=''&&tagName!='*')
if(node.nodeName.toLowerCase()!=tagName)
selected=false;if(selected&&id&&node.id!=id)
selected=false;if(selected&&className&&node.className.search(new RegExp('\\b'+className+'\\b','i'))==-1)
selected=false;if(selected)
return true;}
return false;};
// ToolsHTMLPanel.js - version 0.4 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.HTMLPanel=function(ele,opts)
{Tools.Widget.HTMLPanel.Notifier.call(this);this.element=Tools.Widget.HTMLPanel.$(ele);this.evalScripts=Tools.Widget.HTMLPanel.evalScripts;this.loadingContentClass="HTMLPanelLoadingContent";this.errorContentClass="HTMLPanelErrorContent";this.loadingStateContent="";this.errorStateContent="";this.loadingStateClass="HTMLPanelLoading";this.errorStateClass="HTMLPanelError";this.pendingRequest=null;Tools.Widget.HTMLPanel.setOptions(this,opts);var elements=this.element.getElementsByTagName("*");var numElements=elements.length;var errorEle=null;var loadingEle=null;var d=document.createElement("div");for(var i=0;i<numElements&&(!loadingEle||!errorEle);i++)
{var e=elements[i];if(Tools.Widget.HTMLPanel.hasClassName(e,this.loadingContentClass))
loadingEle=e;if(Tools.Widget.HTMLPanel.hasClassName(e,this.errorContentClass))
errorEle=e;}
if(loadingEle)
this.loadingStateContent=Tools.Widget.HTMLPanel.removeAndExtractContent(loadingEle,this.loadingContentClass);if(errorEle)
this.errorStateContent=Tools.Widget.HTMLPanel.removeAndExtractContent(errorEle,this.errorContentClass);};Tools.Widget.HTMLPanel.evalScripts=false;Tools.Widget.HTMLPanel.Notifier=function()
{this.observers=[];this.suppressNotifications=0;};Tools.Widget.HTMLPanel.Notifier.prototype.addObserver=function(observer)
{if(!observer)
return;var len=this.observers.length;for(var i=0;i<len;i++)
{if(this.observers[i]==observer)
return;}
this.observers[len]=observer;};Tools.Widget.HTMLPanel.Notifier.prototype.removeObserver=function(observer)
{if(!observer)
return;for(var i=0;i<this.observers.length;i++)
{if(this.observers[i]==observer)
{this.observers.splice(i,1);break;}}};Tools.Widget.HTMLPanel.Notifier.prototype.notifyObservers=function(methodName,data)
{if(!methodName)
return;if(!this.suppressNotifications)
{var len=this.observers.length;for(var i=0;i<len;i++)
{var obs=this.observers[i];if(obs)
{if(typeof obs=="function")
obs(methodName,this,data);else if(obs[methodName])
obs[methodName](this,data);}}}};Tools.Widget.HTMLPanel.Notifier.prototype.enableNotifications=function()
{if(--this.suppressNotifications<0)
{this.suppressNotifications=0;Tools.Debug.reportError("Unbalanced enableNotifications() call!\n");}};Tools.Widget.HTMLPanel.Notifier.prototype.disableNotifications=function()
{++this.suppressNotifications;};Tools.Widget.HTMLPanel.prototype=new Tools.Widget.HTMLPanel.Notifier();Tools.Widget.HTMLPanel.prototype.constructor=Tools.Widget.HTMLPanel;Tools.Widget.HTMLPanel.$=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.HTMLPanel.setOptions=function(dstObj,srcObj,ignoreUndefinedProps)
{if(srcObj)
{for(var optionName in srcObj)
{if(ignoreUndefinedProps&&srcObj[optionName]==undefined)
continue;dstObj[optionName]=srcObj[optionName];}}};Tools.Widget.HTMLPanel.addClassName=function(ele,className)
{ele=Tools.Widget.HTMLPanel.$(ele);if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.HTMLPanel.removeClassName=function(ele,className)
{ele=Tools.Widget.HTMLPanel.$(ele);if(Tools.Widget.HTMLPanel.hasClassName(ele,className))
ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.HTMLPanel.hasClassName=function(ele,className)
{ele=Tools.Widget.HTMLPanel.$(ele);if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)
return false;return true;};Tools.Widget.HTMLPanel.removeAndExtractContent=function(ele,className)
{var d=document.createElement("div");if(ele)
{d.appendChild(ele);if(className)
Tools.Widget.HTMLPanel.removeClassName(ele,className);}
return d.innerHTML;};Tools.Widget.HTMLPanel.findNodeById=function(id,node)
{if(node&&node.nodeType==1)
{if(node.id==id)
return node;var child=node.firstChild;while(child)
{var result=Tools.Widget.HTMLPanel.findNodeById(id,child);if(result)
return result;child=child.nextSibling;}}
return null;};Tools.Widget.HTMLPanel.disableSrcReferences=function(source)
{if(source)
source=source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi,function(a,b,c){return'<'+b+c.replace(/\b(src|href)\s*=/gi,function(a,b){return'spry_'+b+'=';})+'>';});return source;};Tools.Widget.HTMLPanel.enableSrcReferences=function(source)
{source=source.replace(/<(img|script|link|frame|iframe|input)([^>]+)>/gi,function(a,b,c){return'<'+b+c.replace(/\bspry_(src|href)\s*=/gi,function(a,b){return b+'=';})+'>';});return source;};Tools.Widget.HTMLPanel.getFragByID=function(id,contentStr)
{var frag=Tools.Widget.HTMLPanel.disableSrcReferences(contentStr);var div=document.createElement("div");div.innerHTML=frag;frag="";var node=Tools.Widget.HTMLPanel.findNodeById(id,div);if(node)
frag=node.innerHTML;return Tools.Widget.HTMLPanel.enableSrcReferences(frag);};Tools.Widget.HTMLPanel.prototype.setContent=function(contentStr,id)
{var data={content:contentStr,id:id};this.notifyObservers("onPreUpdate",data);contentStr=data.content;id=data.id;if(typeof id!="undefined")
contentStr=Tools.Widget.HTMLPanel.getFragByID(id,contentStr);Tools.Widget.HTMLPanel.setInnerHTML(this.element,contentStr,!this.evalScripts);this.removeStateClasses();this.notifyObservers("onPostUpdate",data);};Tools.Widget.HTMLPanel.prototype.loadContent=function(url,opts)
{if(!this.element)
return;this.cancelLoad();if(!opts)
opts=new Object;opts.url=opts.url?opts.url:url;opts.method=opts.method?opts.method:"GET";opts.async=opts.async?opts.async:true;opts.id=opts.id?opts.id:undefined;var self=this;opts.errorCallback=function(req){self.onLoadError(req);};this.notifyObservers("onPreLoad",opts);if(this.loadingStateContent)
this.setContent(this.loadingStateContent);Tools.Widget.HTMLPanel.addClassName(this.element,this.loadingStateClass);this.pendingRequest=Tools.Widget.HTMLPanel.loadURL(opts.method,opts.url,opts.async,function(req){self.onLoadSuccessful(req);},opts);};Tools.Widget.HTMLPanel.prototype.cancelLoad=function()
{try
{if(this.pendingRequest&&this.pendingRequest.xhRequest)
{var xhr=this.pendingRequest.xhRequest;if(xhr.abort)
xhr.abort();xhr.onreadystatechange=null;this.notifyObservers("onLoadCancelled",this.pendingRequest);}}
catch(e){}
this.pendingRequest=null;};Tools.Widget.HTMLPanel.prototype.removeStateClasses=function()
{Tools.Widget.HTMLPanel.removeClassName(this.element,this.loadingStateClass);Tools.Widget.HTMLPanel.removeClassName(this.element,this.errorStateClass);};Tools.Widget.HTMLPanel.prototype.onLoadSuccessful=function(req)
{this.notifyObservers("onPostLoad",req);this.setContent(req.xhRequest.responseText,req.id);this.pendingRequest=null;};Tools.Widget.HTMLPanel.prototype.onLoadError=function(req)
{this.notifyObservers("onLoadError",req);if(this.errorStateContent)
this.setContent(this.errorStateContent);Tools.Widget.HTMLPanel.addClassName(this.element,this.errorStateClass);this.pendingRequest=null;};Tools.Widget.HTMLPanel.msProgIDs=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0"];Tools.Widget.HTMLPanel.createXMLHttpRequest=function()
{var req=null;if(window.ActiveXObject)
{while(!req&&Tools.Widget.HTMLPanel.msProgIDs.length)
{try{req=new ActiveXObject(Tools.Widget.HTMLPanel.msProgIDs[0]);}catch(e){req=null;}
if(!req)
Tools.Widget.HTMLPanel.msProgIDs.splice(0,1);}}
if(!req&&window.XMLHttpRequest){try{req=new XMLHttpRequest();}catch(e){req=null;}}
return req;};Tools.Widget.HTMLPanel.loadURL=function(method,url,async,callback,opts)
{var req=new Object;req.method=method;req.url=url;req.async=async;req.successCallback=callback;Tools.Widget.HTMLPanel.setOptions(req,opts);try
{req.xhRequest=Tools.Widget.HTMLPanel.createXMLHttpRequest();if(!req.xhRequest)
return null;if(req.async)
req.xhRequest.onreadystatechange=function(){Tools.Widget.HTMLPanel.loadURL.callback(req);};req.xhRequest.open(method,req.url,req.async,req.username,req.password);if(req.headers)
{for(var name in req.headers)
req.xhRequest.setRequestHeader(name,req.headers[name]);}
req.xhRequest.send(req.postData);if(!req.async)
Tools.Widget.HTMLPanel.loadURL.callback(req);}
catch(e){if(req.errorCallback)req.errorCallback(req);req=null;}
return req;};Tools.Widget.HTMLPanel.loadURL.callback=function(req)
{if(!req||req.xhRequest.readyState!=4)
return;if(req.successCallback&&(req.xhRequest.status==200||req.xhRequest.status==0))
req.successCallback(req);else if(req.errorCallback)
req.errorCallback(req);};Tools.Widget.HTMLPanel.eval=function(str){return eval(str);};Tools.Widget.HTMLPanel.setInnerHTML=function(ele,str,preventScripts)
{if(!ele)
return;if(!str)str="";ele=Tools.Widget.HTMLPanel.$(ele);var scriptExpr="<script[^>]*>(.|\s|\n|\r)*?</script>";ele.innerHTML=str.replace(new RegExp(scriptExpr,"img"),"");if(preventScripts)
return;var matches=str.match(new RegExp(scriptExpr,"img"));if(matches)
{var numMatches=matches.length;for(var i=0;i<numMatches;i++)
{var s=matches[i].replace(/<script[^>]*>[\s\r\n]*(<\!--)?|(-->)?[\s\r\n]*<\/script>/img,"");Tools.Widget.HTMLPanel.eval(s);}}};
// ToolsImageLoader.js - version 0.2 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Utils)Tools.Utils={};Tools.Utils.ImageLoader=function()
{this.queue=[];this.timerID=0;this.currentEntry=null;};Tools.Utils.ImageLoader.prototype.start=function()
{if(!this.timerID)
{var self=this;this.timerID=setTimeout(function()
{self.timerID=0;self.processQueue();},0);}};Tools.Utils.ImageLoader.prototype.stop=function()
{if(this.currentEntry)
{var entry=this.currentEntry;entry.loader.onload=null;entry.loader.src="";entry.loader=null;this.currentEntry=null;this.queue.unshift(entry);}
if(this.timerID)
clearTimeout(this.timerID);this.timerID=0;};Tools.Utils.ImageLoader.prototype.clearQueue=function()
{this.stop();this.queue.length=0;};Tools.Utils.ImageLoader.prototype.load=function(url,callback,priority)
{if(url)
{if(typeof priority=="undefined")
priority=0;this.queue.push({url:url,callback:callback,priority:priority});this.queue.sort(function(a,b){return(a.priority>b.priority)?-1:((a.priority<b.priority)?1:0);});this.start();}};Tools.Utils.ImageLoader.prototype.processQueue=function()
{if(this.queue.length<1)
return;var entry=this.currentEntry=this.queue.shift();var loader=entry.loader=new Image;var self=this;loader.onload=function()
{self.currentEntry=null;if(entry.callback)
entry.callback(entry.url,entry.loader);if(self.queue.length>0)
self.start();};loader.onerror=function()
{self.currentEntry=null;if(self.queue.length>0)
self.start();};this.currentLoader=loader;loader.src=entry.url;};
// ToolsImageViewer.js - version 0.1 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools; if (!Tools) Tools = {}; if (!Tools.Widget) Tools.Widget = {};

Tools.Widget.ImageViewer = function(ele, options)
{
	Tools.Utils.Notifier.call(this);

	this.element = Tools.$(ele);
	this.imageSelector = "img";
	this.elementToResizeSelector = "*";
	
	this.currentEffect = null;
	this.currentLoader = null;
};

Tools.Widget.ImageViewer.prototype = new Tools.Utils.Notifier();
Tools.Widget.ImageViewer.prototype.constructor = Tools.Widget.ImageViewer;

Tools.Widget.ImageViewer.prototype.killLoader = function()
{
	if (this.currentLoader)
	{
		this.currentLoader.onload = null;
		this.currentLoader = null;
	}
};

Tools.Widget.ImageViewer.prototype.setImage = function(url)
{
	var img = Tools.$$(this.imageSelector, this.element)[0];
	if (!img) return;

	if (this.currentEffect)
	{
		this.currentEffect.stop();
		this.currentEffect = null;
	}

	this.killLoader();
	var loader = this.currentLoader = new Image;
	var self = this;

	this.notifyObservers("onPreUpdate", url);

	this.currentEffect = new Tools.Effect.Opacity(img, Tools.Effect.getOpacity(img), 0, { duration: 400,
		finish: function()
		{
			// Use an image loader to make sure we only fade in the new image after
			// it is completely loaded.
			loader.onload = function()
			{
				var w = loader.width;
				var h = loader.height;

				var eleToResize = img;
				if (self.elementToResizeSelector)
					eleToResize = Tools.Utils.getAncestor(img, self.elementToResizeSelector);

				self.currentEffect = new Tools.Effect.Size(eleToResize, Tools.Effect.getDimensions(eleToResize), { width: w, height: h, units:"px"}, {duration: 400, finish: function()
				{
					img.src = loader.src;
					loader = null;
					self.currentEffect = new Tools.Effect.Opacity(img, 0, 1, { duration: 400,
						finish: function()
						{
							self.currentEffect = null;
							
							// Our new image is fully visible now. Remove any opacity related
							// style properties on the img to workaround the IE bug that creates
							// white dots/holes in the images. Removing the properties forces
							// IE to re-render the image correctly.

							img.style.opacity = "";
							img.style.filter = "";

							// If the slide show is on, fire off the timer for the next image.

							self.notifyObservers("onPostUpdate", url);
						}});
					self.currentEffect.start();					
				}});
				self.currentEffect.start();
			};
			loader.src = url;
		}
	});
	this.currentEffect.start();
};
// ToolsJSONDataSet.js - version 0.6 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.JSONDataSet=function(dataSetURL,dataSetOptions)
{this.path="";this.pathIsObjectOfArrays=false;this.doc=null;this.subPaths=[];this.useParser=false;this.preparseFunc=null;Tools.Data.HTTPSourceDataSet.call(this,dataSetURL,dataSetOptions);var jwType=typeof this.subPaths;if(jwType=="string"||(jwType=="object"&&this.subPaths.constructor!=Array))
this.subPaths=[this.subPaths];};Tools.Data.JSONDataSet.prototype=new Tools.Data.HTTPSourceDataSet();Tools.Data.JSONDataSet.prototype.constructor=Tools.Data.JSONDataSet;Tools.Data.JSONDataSet.prototype.getDataRefStrings=function()
{var strArr=[];if(this.url)strArr.push(this.url);if(this.path)strArr.push(this.path);if(this.requestInfo&&this.requestInfo.postData)strArr.push(this.requestInfo.postData);return strArr;};Tools.Data.JSONDataSet.prototype.getDocument=function(){return this.doc;};Tools.Data.JSONDataSet.prototype.getPath=function(){return this.path;};Tools.Data.JSONDataSet.prototype.setPath=function(path)
{if(this.path!=path)
{this.path=path;if(this.dataWasLoaded&&this.doc)
{this.notifyObservers("onPreLoad");this.setDataFromDoc(this.doc);}}};Tools.Data.JSONDataSet.getMatchingObjects=function(path,jsonObj)
{var results=[];if(path&&jsonObj)
{var prop="";var leftOverPath="";var offset=path.search(/\./);if(offset!=-1)
{prop=path.substring(0,offset);leftOverPath=path.substring(offset+1);}
else
prop=path;var matches=[];if(prop&&typeof jsonObj=="object")
{var obj=jsonObj[prop];var objType=typeof obj;if(objType!=undefined&&objType!=null)
{if(obj&&objType=="object"&&obj.constructor==Array)
matches=matches.concat(obj);else
matches.push(obj);}}
var numMatches=matches.length;if(leftOverPath)
{for(var i=0;i<numMatches;i++)
results=results.concat(Tools.Data.JSONDataSet.getMatchingObjects(leftOverPath,matches[i]));}
else
results=matches;}
return results;};Tools.Data.JSONDataSet.flattenObject=function(obj,basicColumnName)
{var basicName=basicColumnName?basicColumnName:"column0";var row=new Object;var objType=typeof obj;if(objType=="object")
Tools.Data.JSONDataSet.copyProps(row,obj);else
row[basicName]=obj;row.ds_JSONObject=obj;return row;};Tools.Data.JSONDataSet.copyProps=function(dstObj,srcObj,suppressObjProps)
{if(srcObj&&dstObj)
{for(var prop in srcObj)
{if(suppressObjProps&&typeof srcObj[prop]=="object")
continue;dstObj[prop]=srcObj[prop];}}
return dstObj;};Tools.Data.JSONDataSet.flattenDataIntoRecordSet=function(jsonObj,path,pathIsObjectOfArrays)
{var rs=new Object;rs.data=[];rs.dataHash={};if(!path)
path="";var obj=jsonObj;var objType=typeof obj;var basicColName="";if(objType!="object"||!obj)
{if(obj!=null)
{var row=new Object;row.column0=obj;row.ds_RowID=0;rs.data.push(row);rs.dataHash[row.ds_RowID]=row;}
return rs;}
var matches=[];if(obj.constructor==Array)
{var arrLen=obj.length;if(arrLen<1)
return rs;var eleType=typeof obj[0];if(eleType!="object")
{for(var i=0;i<arrLen;i++)
{var row=new Object;row.column0=obj[i];row.ds_RowID=i;rs.data.push(row);rs.dataHash[row.ds_RowID]=row;}
return rs;}
if(obj[0].constructor==Array)
return rs;if(path)
{for(var i=0;i<arrLen;i++)
matches=matches.concat(Tools.Data.JSONDataSet.getMatchingObjects(path,obj[i]));}
else
{for(var i=0;i<arrLen;i++)
matches.push(obj[i]);}}
else
{if(path)
matches=Tools.Data.JSONDataSet.getMatchingObjects(path,obj);else
matches.push(obj);}
var numMatches=matches.length;if(path&&numMatches>=1&&typeof matches[0]!="object")
basicColName=path.replace(/.*\./,"");if(!pathIsObjectOfArrays)
{for(var i=0;i<numMatches;i++)
{var row=Tools.Data.JSONDataSet.flattenObject(matches[i],basicColName,pathIsObjectOfArrays);row.ds_RowID=i;rs.dataHash[i]=row;rs.data.push(row);}}
else
{var rowID=0;for(var i=0;i<numMatches;i++)
{var obj=matches[i];var colNames=[];var maxNumRows=0;for(var propName in obj)
{var prop=obj[propName];var propyType=typeof prop;if(propyType=='object'&&prop.constructor==Array)
{colNames.push(propName);maxNumRows=Math.max(maxNumRows,obj[propName].length);}}
var numColNames=colNames.length;for(var j=0;j<maxNumRows;j++)
{var row=new Object;for(var k=0;k<numColNames;k++)
{var colName=colNames[k];row[colName]=obj[colName][j];}
row.ds_RowID=rowID++;rs.dataHash[row.ds_RowID]=row;rs.data.push(row);}}}
return rs;};Tools.Data.JSONDataSet.prototype.flattenSubPaths=function(rs,subPaths)
{if(!rs||!subPaths)
return;var numSubPaths=subPaths.length;if(numSubPaths<1)
return;var data=rs.data;var dataHash={};var pathArray=[];var cleanedPathArray=[];var isObjectOfArraysArr=[];for(var i=0;i<numSubPaths;i++)
{var subPath=subPaths[i];if(typeof subPath=="object")
{isObjectOfArraysArr[i]=subPath.pathIsObjectOfArrays;subPath=subPath.path;}
if(!subPath)
subPath="";pathArray[i]=Tools.Data.Region.processDataRefString(null,subPath,this.dataSetsForDataRefStrings);cleanedPathArray[i]=pathArray[i].replace(/\[.*\]/g,"");}
var row;var numRows=data.length;var newData=[];for(var i=0;i<numRows;i++)
{row=data[i];var newRows=[row];for(var j=0;j<numSubPaths;j++)
{var newRS=Tools.Data.JSONDataSet.flattenDataIntoRecordSet(row.ds_JSONObject,pathArray[j],isObjectOfArraysArr[j]);if(newRS&&newRS.data&&newRS.data.length)
{if(typeof subPaths[j]=="object"&&subPaths[j].subPaths)
{var sp=subPaths[j].subPaths;spType=typeof sp;if(spType=="string")
sp=[sp];else if(spType=="object"&&spType.constructor==Object)
sp=[sp];this.flattenSubPaths(newRS,sp);}
var newRSData=newRS.data;var numRSRows=newRSData.length;var cleanedPath=cleanedPathArray[j]+".";var numNewRows=newRows.length;var joinedRows=[];for(var k=0;k<numNewRows;k++)
{var newRow=newRows[k];for(var l=0;l<numRSRows;l++)
{var newRowObj=new Object;var newRSRow=newRSData[l];for(var prop in newRSRow)
{var newPropName=cleanedPath+prop;if(cleanedPath==prop||cleanedPath.search(new RegExp("\\."+prop+"\\.$"))!=-1)
newPropName=cleanedPathArray[j];newRowObj[newPropName]=newRSRow[prop];}
Tools.Data.JSONDataSet.copyProps(newRowObj,newRow);joinedRows.push(newRowObj);}}
newRows=joinedRows;}}
newData=newData.concat(newRows);}
data=newData;numRows=data.length;for(i=0;i<numRows;i++)
{row=data[i];row.ds_RowID=i;dataHash[row.ds_RowID]=row;}
rs.data=data;rs.dataHash=dataHash;};Tools.Data.JSONDataSet.prototype.parseJSON=function(str,filter)
{try
{if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(str))
{var j=eval('('+str+')');if(typeof filter==='function')
{function walk(k,v)
{if(v&&typeof v==='object')
{for(var i in v)
{if(v.hasOwnProperty(i))
{v[i]=walk(i,v[i]);}}}
return filter(k,v);}
j=walk('',j);}
return j;}}catch(e){}
throw new Error("Failed to parse JSON string.");};Tools.Data.JSONDataSet.prototype.syncColumnTypesToData=function()
{var row=this.getData()[0];for(var colName in row)
{if(!this.columnTypes[colName])
{var type=typeof row[colName];if(type=="number")
this.setColumnType(colName,type);}}};Tools.Data.JSONDataSet.prototype.loadDataIntoDataSet=function(rawDataDoc)
{if(this.preparseFunc)
rawDataDoc=this.preparseFunc(this,rawDataDoc);var jsonObj;try{jsonObj=this.useParser?this.parseJSON(rawDataDoc):eval("("+rawDataDoc+")");}
catch(e)
{Tools.Debug.reportError("Caught exception in JSONDataSet.loadDataIntoDataSet: "+e);jsonObj={};}
if(jsonObj==null)
jsonObj="null";var rs=Tools.Data.JSONDataSet.flattenDataIntoRecordSet(jsonObj,Tools.Data.Region.processDataRefString(null,this.path,this.dataSetsForDataRefStrings),this.pathIsObjectOfArrays);this.flattenSubPaths(rs,this.subPaths);this.doc=rawDataDoc;this.docObj=jsonObj;this.data=rs.data;this.dataHash=rs.dataHash;this.dataWasLoaded=(this.doc!=null);this.syncColumnTypesToData();};
// ToolsMenuBar.js - version 0.12 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;this.version=parseFloat(r[2]);}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Tools.is=new Tools.BrowserSniff();Tools.Widget.MenuBar=function(element,opts)
{this.init(element,opts);};Tools.Widget.MenuBar.prototype.init=function(element,opts)
{this.element=this.getElement(element);this.currMenu=null;this.showDelay=250;this.hideDelay=600;if(typeof document.getElementById=='undefined'||(navigator.vendor=='Apple Computer, Inc.'&&typeof window.XMLHttpRequest=='undefined')||(Tools.is.ie&&typeof document.uniqueID=='undefined'))
{return;}
if(Tools.is.ie&&Tools.is.version<7){try{document.execCommand("BackgroundImageCache",false,true);}catch(err){}}
this.upKeyCode=Tools.Widget.MenuBar.KEY_UP;this.downKeyCode=Tools.Widget.MenuBar.KEY_DOWN;this.leftKeyCode=Tools.Widget.MenuBar.KEY_LEFT;this.rightKeyCode=Tools.Widget.MenuBar.KEY_RIGHT;this.escKeyCode=Tools.Widget.MenuBar.KEY_ESC;this.hoverClass='MenuBarItemHover';this.subHoverClass='MenuBarItemSubmenuHover';this.subVisibleClass='MenuBarSubmenuVisible';this.hasSubClass='MenuBarItemSubmenu';this.activeClass='MenuBarActive';this.isieClass='MenuBarItemIE';this.verticalClass='MenuBarVertical';this.horizontalClass='MenuBarHorizontal';this.enableKeyboardNavigation=true;this.hasFocus=false;if(opts)
{for(var k in opts)
{if(typeof this[k]=='undefined')
{var rollover=new Image;rollover.src=opts[k];}}
Tools.Widget.MenuBar.setOptions(this,opts);}
if(Tools.is.safari)
this.enableKeyboardNavigation=false;if(this.element)
{this.currMenu=this.element;var items=this.element.getElementsByTagName('li');for(var i=0;i<items.length;i++)
{if(i>0&&this.enableKeyboardNavigation)
items[i].getElementsByTagName('a')[0].tabIndex='-1';this.initialize(items[i],element);if(Tools.is.ie)
{this.addClassName(items[i],this.isieClass);items[i].style.position="static";}}
if(this.enableKeyboardNavigation)
{var self=this;this.addEventListener(document,'keydown',function(e){self.keyDown(e);},false);}
if(Tools.is.ie)
{if(this.hasClassName(this.element,this.verticalClass))
{this.element.style.position="relative";}
var linkitems=this.element.getElementsByTagName('a');for(var i=0;i<linkitems.length;i++)
{linkitems[i].style.position="relative";}}}};Tools.Widget.MenuBar.KEY_ESC=27;Tools.Widget.MenuBar.KEY_UP=38;Tools.Widget.MenuBar.KEY_DOWN=40;Tools.Widget.MenuBar.KEY_LEFT=37;Tools.Widget.MenuBar.KEY_RIGHT=39;Tools.Widget.MenuBar.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.MenuBar.prototype.hasClassName=function(ele,className)
{if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)
{return false;}
return true;};Tools.Widget.MenuBar.prototype.addClassName=function(ele,className)
{if(!ele||!className||this.hasClassName(ele,className))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.MenuBar.prototype.removeClassName=function(ele,className)
{if(!ele||!className||!this.hasClassName(ele,className))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.MenuBar.prototype.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
{element.addEventListener(eventType,handler,capture);}
else if(element.attachEvent)
{element.attachEvent('on'+eventType,handler);}}
catch(e){}};Tools.Widget.MenuBar.prototype.createIframeLayer=function(menu)
{var layer=document.createElement('iframe');layer.tabIndex='-1';layer.src='javascript:""';layer.frameBorder='0';layer.scrolling='no';menu.parentNode.appendChild(layer);layer.style.left=menu.offsetLeft+'px';layer.style.top=menu.offsetTop+'px';layer.style.width=menu.offsetWidth+'px';layer.style.height=menu.offsetHeight+'px';};Tools.Widget.MenuBar.prototype.removeIframeLayer=function(menu)
{var layers=((menu==this.element)?menu:menu.parentNode).getElementsByTagName('iframe');while(layers.length>0)
{layers[0].parentNode.removeChild(layers[0]);}};Tools.Widget.MenuBar.prototype.clearMenus=function(root)
{var menus=root.getElementsByTagName('ul');for(var i=0;i<menus.length;i++)
this.hideSubmenu(menus[i]);this.removeClassName(this.element,this.activeClass);};Tools.Widget.MenuBar.prototype.bubbledTextEvent=function()
{return Tools.is.safari&&(event.target==event.relatedTarget.parentNode||(event.eventPhase==3&&event.target.parentNode==event.relatedTarget));};Tools.Widget.MenuBar.prototype.showSubmenu=function(menu)
{if(this.currMenu)
{this.clearMenus(this.currMenu);this.currMenu=null;}
if(menu)
{this.addClassName(menu,this.subVisibleClass);if(typeof document.all!='undefined'&&!Tools.is.opera&&navigator.vendor!='KDE')
{if(!this.hasClassName(this.element,this.horizontalClass)||menu.parentNode.parentNode!=this.element)
{menu.style.top=menu.parentNode.offsetTop+'px';}}
if(Tools.is.ie&&Tools.is.version<7)
{this.createIframeLayer(menu);}}
this.addClassName(this.element,this.activeClass);};Tools.Widget.MenuBar.prototype.hideSubmenu=function(menu)
{if(menu)
{this.removeClassName(menu,this.subVisibleClass);if(typeof document.all!='undefined'&&!Tools.is.opera&&navigator.vendor!='KDE')
{menu.style.top='';menu.style.left='';}
if(Tools.is.ie&&Tools.is.version<7)
this.removeIframeLayer(menu);}};Tools.Widget.MenuBar.prototype.initialize=function(listitem,element)
{var opentime,closetime;var link=listitem.getElementsByTagName('a')[0];var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);if(menu)
this.addClassName(link,this.hasSubClass);if(!Tools.is.ie)
{listitem.contains=function(testNode)
{if(testNode==null)
return false;if(testNode==this)
return true;else
return this.contains(testNode.parentNode);};}
var self=this;this.addEventListener(listitem,'mouseover',function(e){self.mouseOver(listitem,e);},false);this.addEventListener(listitem,'mouseout',function(e){if(self.enableKeyboardNavigation)self.clearSelection();self.mouseOut(listitem,e);},false);if(this.enableKeyboardNavigation)
{this.addEventListener(link,'blur',function(e){self.onBlur(listitem);},false);this.addEventListener(link,'focus',function(e){self.keyFocus(listitem,e);},false);}};Tools.Widget.MenuBar.prototype.keyFocus=function(listitem,e)
{this.lastOpen=listitem.getElementsByTagName('a')[0];this.addClassName(this.lastOpen,listitem.getElementsByTagName('ul').length>0?this.subHoverClass:this.hoverClass);this.hasFocus=true;};Tools.Widget.MenuBar.prototype.onBlur=function(listitem)
{this.clearSelection(listitem);};Tools.Widget.MenuBar.prototype.clearSelection=function(el){if(!this.lastOpen)
return;if(el)
{el=el.getElementsByTagName('a')[0];var item=this.lastOpen;while(item!=this.element)
{var tmp=el;while(tmp!=this.element)
{if(tmp==item)
return;try{tmp=tmp.parentNode;}catch(err){break;}}
item=item.parentNode;}}
var item=this.lastOpen;while(item!=this.element)
{this.hideSubmenu(item.parentNode);var link=item.getElementsByTagName('a')[0];this.removeClassName(link,this.hoverClass);this.removeClassName(link,this.subHoverClass);item=item.parentNode;}
this.lastOpen=false;};Tools.Widget.MenuBar.prototype.keyDown=function(e)
{if(!this.hasFocus)
return;if(!this.lastOpen)
{this.hasFocus=false;return;}
var e=e||event;var listitem=this.lastOpen.parentNode;var link=this.lastOpen;var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);var hasSubMenu=(menu)?true:false;var opts=[listitem,menu,null,this.getSibling(listitem,'previousSibling'),this.getSibling(listitem,'nextSibling')];if(!opts[3])
opts[2]=(listitem.parentNode.parentNode.nodeName.toLowerCase()=='li')?listitem.parentNode.parentNode:null;var found=0;switch(e.keyCode){case this.upKeyCode:found=this.getElementForKey(opts,'y',1);break;case this.downKeyCode:found=this.getElementForKey(opts,'y',-1);break;case this.leftKeyCode:found=this.getElementForKey(opts,'x',1);break;case this.rightKeyCode:found=this.getElementForKey(opts,'x',-1);break;case this.escKeyCode:case 9:this.clearSelection();this.hasFocus=false;default:return;}
switch(found)
{case 0:return;case 1:this.mouseOver(listitem,e);break;case 2:this.mouseOut(opts[2],e);break;case 3:case 4:this.removeClassName(link,hasSubMenu?this.subHoverClass:this.hoverClass);break;}
var link=opts[found].getElementsByTagName('a')[0];if(opts[found].nodeName.toLowerCase()=='ul')
opts[found]=opts[found].getElementsByTagName('li')[0];this.addClassName(link,opts[found].getElementsByTagName('ul').length>0?this.subHoverClass:this.hoverClass);this.lastOpen=link;opts[found].getElementsByTagName('a')[0].focus();return Tools.Widget.MenuBar.stopPropagation(e);};Tools.Widget.MenuBar.prototype.mouseOver=function(listitem,e)
{var link=listitem.getElementsByTagName('a')[0];var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);var hasSubMenu=(menu)?true:false;if(this.enableKeyboardNavigation)
this.clearSelection(listitem);if(this.bubbledTextEvent())
{return;}
if(listitem.closetime)
clearTimeout(listitem.closetime);if(this.currMenu==listitem)
{this.currMenu=null;}
if(this.hasFocus)
link.focus();this.addClassName(link,hasSubMenu?this.subHoverClass:this.hoverClass);this.lastOpen=link;if(menu&&!this.hasClassName(menu,this.subHoverClass))
{var self=this;listitem.opentime=window.setTimeout(function(){self.showSubmenu(menu);},this.showDelay);}};Tools.Widget.MenuBar.prototype.mouseOut=function(listitem,e)
{var link=listitem.getElementsByTagName('a')[0];var submenus=listitem.getElementsByTagName('ul');var menu=(submenus.length>0?submenus[0]:null);var hasSubMenu=(menu)?true:false;if(this.bubbledTextEvent())
{return;}
var related=(typeof e.relatedTarget!='undefined'?e.relatedTarget:e.toElement);if(!listitem.contains(related))
{if(listitem.opentime)
clearTimeout(listitem.opentime);this.currMenu=listitem;this.removeClassName(link,hasSubMenu?this.subHoverClass:this.hoverClass);if(menu)
{var self=this;listitem.closetime=window.setTimeout(function(){self.hideSubmenu(menu);},this.hideDelay);}
if(this.hasFocus)
link.blur();}};Tools.Widget.MenuBar.prototype.getSibling=function(element,sibling)
{var child=element[sibling];while(child&&child.nodeName.toLowerCase()!='li')
child=child[sibling];return child;};Tools.Widget.MenuBar.prototype.getElementForKey=function(els,prop,dir)
{var found=0;var rect=Tools.Widget.MenuBar.getPosition;var ref=rect(els[found]);var hideSubmenu=false;if(els[1]&&!this.hasClassName(els[1],this.MenuBarSubmenuVisible))
{els[1].style.visibility='hidden';this.showSubmenu(els[1]);hideSubmenu=true;}
var isVert=this.hasClassName(this.element,this.verticalClass);var hasParent=els[0].parentNode.parentNode.nodeName.toLowerCase()=='li'?true:false;for(var i=1;i<els.length;i++){if(prop=='y'&&isVert&&(i==1||i==2))
{continue;}
if(prop=='x'&&!isVert&&!hasParent&&(i==1||i==2))
{continue;}
if(els[i])
{var tmp=rect(els[i]);if((dir*tmp[prop])<(dir*ref[prop]))
{ref=tmp;found=i;}}}
if(els[1]&&hideSubmenu){this.hideSubmenu(els[1]);els[1].style.visibility='';}
return found;};Tools.Widget.MenuBar.camelize=function(str)
{if(str.indexOf('-')==-1){return str;}
var oStringList=str.split('-');var isFirstEntry=true;var camelizedString='';for(var i=0;i<oStringList.length;i++)
{if(oStringList[i].length>0)
{if(isFirstEntry)
{camelizedString=oStringList[i];isFirstEntry=false;}
else
{var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}}}
return camelizedString;};Tools.Widget.MenuBar.getStyleProp=function(element,prop)
{var value;try
{if(element.style)
value=element.style[Tools.Widget.MenuBar.camelize(prop)];if(!value)
if(document.defaultView&&document.defaultView.getComputedStyle)
{var css=document.defaultView.getComputedStyle(element,null);value=css?css.getPropertyValue(prop):null;}
else if(element.currentStyle)
{value=element.currentStyle[Tools.Widget.MenuBar.camelize(prop)];}}
catch(e){}
return value=='auto'?null:value;};Tools.Widget.MenuBar.getIntProp=function(element,prop)
{var a=parseInt(Tools.Widget.MenuBar.getStyleProp(element,prop),10);if(isNaN(a))
return 0;return a;};Tools.Widget.MenuBar.getPosition=function(el,doc)
{doc=doc||document;if(typeof(el)=='string'){el=doc.getElementById(el);}
if(!el){return false;}
if(el.parentNode===null||Tools.Widget.MenuBar.getStyleProp(el,'display')=='none'){return false;}
var ret={x:0,y:0};var parent=null;var box;if(el.getBoundingClientRect){box=el.getBoundingClientRect();var scrollTop=doc.documentElement.scrollTop||doc.body.scrollTop;var scrollLeft=doc.documentElement.scrollLeft||doc.body.scrollLeft;ret.x=box.left+scrollLeft;ret.y=box.top+scrollTop;}else if(doc.getBoxObjectFor){box=doc.getBoxObjectFor(el);ret.x=box.x;ret.y=box.y;}else{ret.x=el.offsetLeft;ret.y=el.offsetTop;parent=el.offsetParent;if(parent!=el){while(parent){ret.x+=parent.offsetLeft;ret.y+=parent.offsetTop;parent=parent.offsetParent;}}
if(Tools.is.opera||Tools.is.safari&&Tools.Widget.MenuBar.getStyleProp(el,'position')=='absolute')
ret.y-=doc.body.offsetTop;}
if(el.parentNode)
parent=el.parentNode;else
parent=null;if(parent.nodeName){var cas=parent.nodeName.toUpperCase();while(parent&&cas!='BODY'&&cas!='HTML'){cas=parent.nodeName.toUpperCase();ret.x-=parent.scrollLeft;ret.y-=parent.scrollTop;if(parent.parentNode)
parent=parent.parentNode;else
parent=null;}}
return ret;};Tools.Widget.MenuBar.stopPropagation=function(ev)
{if(ev.stopPropagation)
ev.stopPropagation();else
ev.cancelBubble=true;if(ev.preventDefault)
ev.preventDefault();else
ev.returnValue=false;};Tools.Widget.MenuBar.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};
// ToolsNestedJSONDataSet.js - version 0.5 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.NestedJSONDataSet=function(parentDataSet,jpath,options)
{this.parentDataSet=parentDataSet;this.jpath=jpath;this.nestedDataSets=[];this.nestedDataSetsHash={};this.currentDS=null;this.currentDSAncestor=null;this.options=options;this.ignoreOnDataChanged=false;Tools.Data.DataSet.call(this,options);parentDataSet.addObserver(this);};Tools.Data.NestedJSONDataSet.prototype=new Tools.Data.DataSet();Tools.Data.NestedJSONDataSet.prototype.constructor=Tools.Data.NestedJSONDataSet.prototype;Tools.Data.NestedJSONDataSet.prototype.getParentDataSet=function()
{return this.parentDataSet;};Tools.Data.NestedJSONDataSet.prototype.getNestedDataSetForParentRow=function(parentRow)
{var jsonNode=parentRow.ds_JSONObject;if(jsonNode&&this.nestedDataSets)
{if(this.currentDSAncestor&&this.currentDSAncestor==jsonNode)
return this.currentDS;var nDSArr=this.nestedDataSets;var nDSArrLen=nDSArr.length;for(var i=0;i<nDSArrLen;i++)
{var dsObj=nDSArr[i];if(dsObj&&jsonNode==dsObj.ancestor)
return dsObj.dataSet;}}
return null;};Tools.Data.NestedJSONDataSet.prototype.getNestedJSONDataSetsArray=function()
{var resultsArray=[];if(this.nestedDataSets)
{var arrDS=this.nestedDataSets;var numDS=this.nestedDataSets.length;for(var i=0;i<numDS;i++)
resultsArray.push(arrDS[i].dataSet);}
return resultsArray;};Tools.Data.NestedJSONDataSet.prototype.onDataChanged=function(notifier,data)
{if(!this.ignoreOnDataChanged)
this.loadData();};Tools.Data.NestedJSONDataSet.prototype.onCurrentRowChanged=function(notifier,data)
{this.notifyObservers("onPreParentContextChange");this.currentDS=null;this.currentDSAncestor=null;var pCurRow=this.parentDataSet.getCurrentRow();if(pCurRow)
{var nestedDS=this.getNestedDataSetForParentRow(pCurRow);if(nestedDS)
{this.currentDS=nestedDS;this.currentDSAncestor=pCurRow.ds_JSONObject;}}
this.notifyObservers("onDataChanged");this.notifyObservers("onPostParentContextChange");this.ignoreOnDataChanged=false;};Tools.Data.NestedJSONDataSet.prototype.onPostParentContextChange=Tools.Data.NestedJSONDataSet.prototype.onCurrentRowChanged;Tools.Data.NestedJSONDataSet.prototype.onPreParentContextChange=function(notifier,data)
{this.ignoreOnDataChanged=true;};Tools.Data.NestedJSONDataSet.prototype.filterAndSortData=function()
{if(this.filterDataFunc)
this.filterData(this.filterDataFunc,true);if(this.distinctOnLoad)
this.distinct(this.distinctFieldsOnLoad);if(this.keepSorted&&this.getSortColumn())
this.sort(this.lastSortColumns,this.lastSortOrder);else if(this.sortOnLoad)
this.sort(this.sortOnLoad,this.sortOrderOnLoad);if(this.filterFunc)
this.filter(this.filterFunc,true);};Tools.Data.NestedJSONDataSet.prototype.loadData=function()
{var parentDS=this.parentDataSet;if(!parentDS||parentDS.getLoadDataRequestIsPending()||!this.jpath)
return;if(!parentDS.getDataWasLoaded())
{parentDS.loadData();return;}
this.notifyObservers("onPreLoad");this.nestedDataSets=[];this.currentDS=null;this.currentDSAncestor=null;this.data=[];this.dataHash={};var self=this;var ancestorDS=[parentDS];if(parentDS.getNestedJSONDataSetsArray)
ancestorDS=parentDS.getNestedJSONDataSetsArray();var currentAncestor=null;var currentAncestorRow=parentDS.getCurrentRow();if(currentAncestorRow)
currentAncestor=currentAncestorRow.ds_JSONObject;var numAncestors=ancestorDS.length;for(var i=0;i<numAncestors;i++)
{var aDS=ancestorDS[i];var aData=aDS.getData(true);if(aData)
{var aDataLen=aData.length;for(var j=0;j<aDataLen;j++)
{var row=aData[j];if(row&&row.ds_JSONObject)
{var ds=new Tools.Data.DataSet(this.options);for(var cname in this.columnTypes)
ds.setColumnType(cname,this.columnTypes[cname]);var dataArr=Tools.Data.JSONDataSet.flattenDataIntoRecordSet(row.ds_JSONObject,this.jpath);ds.setDataFromArray(dataArr.data,true);var dsObj=new Object;dsObj.ancestor=row.ds_JSONObject;dsObj.dataSet=ds;this.nestedDataSets.push(dsObj);if(row.ds_JSONObject==currentAncestor)
{this.currentDS=ds;this.currentDSAncestor=this.ds_JSONObject;}
ds.addObserver(function(notificationType,notifier,data){if(notifier==self.currentDS)setTimeout(function(){self.notifyObservers(notificationType,data);},0);});}}}}
this.pendingRequest=new Object;this.dataWasLoaded=false;this.pendingRequest.timer=setTimeout(function(){self.pendingRequest=null;self.dataWasLoaded=true;self.disableNotifications();self.filterAndSortData();self.enableNotifications();self.notifyObservers("onPostLoad");self.notifyObservers("onDataChanged");},0);};Tools.Data.NestedJSONDataSet.prototype.getData=function(unfiltered)
{if(this.currentDS)
return this.currentDS.getData(unfiltered);return[];};Tools.Data.NestedJSONDataSet.prototype.getRowCount=function(unfiltered)
{if(this.currentDS)
return this.currentDS.getRowCount(unfiltered);return 0;};Tools.Data.NestedJSONDataSet.prototype.getRowByID=function(rowID)
{if(this.currentDS)
return this.currentDS.getRowByID(rowID);return undefined;};Tools.Data.NestedJSONDataSet.prototype.getRowByRowNumber=function(rowNumber,unfiltered)
{if(this.currentDS)
return this.currentDS.getRowByRowNumber(rowNumber,unfiltered);return null;};Tools.Data.NestedJSONDataSet.prototype.getCurrentRow=function()
{if(this.currentDS)
return this.currentDS.getCurrentRow();return null;};Tools.Data.NestedJSONDataSet.prototype.setCurrentRow=function(rowID)
{if(this.currentDS)
return this.currentDS.setCurrentRow(rowID);};Tools.Data.NestedJSONDataSet.prototype.getRowNumber=function(row)
{if(this.currentDS)
return this.currentDS.getRowNumber(row);return 0;};Tools.Data.NestedJSONDataSet.prototype.getCurrentRowNumber=function()
{if(this.currentDS)
return this.currentDS.getCurrentRowNumber();return 0;};Tools.Data.NestedJSONDataSet.prototype.getCurrentRowID=function()
{if(this.currentDS)
return this.currentDS.getCurrentRowID();return 0;};Tools.Data.NestedJSONDataSet.prototype.setCurrentRowNumber=function(rowNumber)
{if(this.currentDS)
return this.currentDS.setCurrentRowNumber(rowNumber);};Tools.Data.NestedJSONDataSet.prototype.findRowsWithColumnValues=function(valueObj,firstMatchOnly,unfiltered)
{if(this.currentDS)
return this.currentDS.findRowsWithColumnValues(valueObj,firstMatchOnly,unfiltered);return firstMatchOnly?null:[];};Tools.Data.NestedJSONDataSet.prototype.setColumnType=function(columnNames,columnType)
{if(columnNames)
{Tools.Data.DataSet.prototype.setColumnType.call(this,columnNames,columnType);var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.setColumnType(columnNames,columnType);}};Tools.Data.NestedJSONDataSet.prototype.getColumnType=function(columnName)
{if(this.currentDS)
return this.currentDS.getColumnType(columnName);return"string";};Tools.Data.NestedJSONDataSet.prototype.distinct=function(columnNames)
{if(columnNames)
{var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.distinct(columnNames);}};Tools.Data.NestedJSONDataSet.prototype.sort=function(columnNames,sortOrder)
{if(columnNames)
{var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.sort(columnNames,sortOrder);if(dsArrLen>0)
{var ds=dsArr[0].dataSet;this.lastSortColumns=ds.lastSortColumns.slice(0);this.lastSortOrder=ds.lastSortOrder;}}};Tools.Data.NestedJSONDataSet.prototype.filterData=function(filterFunc,filterOnly)
{this.filterDataFunc=filterFunc;var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.filterData(filterFunc,filterOnly);};Tools.Data.NestedJSONDataSet.prototype.filter=function(filterFunc,filterOnly)
{this.filterFunc=filterFunc;var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.filter(filterFunc,filterOnly);};
// ToolsNestedXMLDataSet.js - version 0.7 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.NestedXMLDataSet=function(parentDataSet,xpath,options)
{this.parentDataSet=parentDataSet;this.xpath=xpath;this.nestedDataSets=[];this.nestedDataSetsHash={};this.currentDS=null;this.currentDSAncestor=null;this.options=options;this.ignoreOnDataChanged=false;this.entityEncodeStrings=parentDataSet?parentDataSet.entityEncodeStrings:true;Tools.Data.DataSet.call(this,options);parentDataSet.addObserver(this);};Tools.Data.NestedXMLDataSet.prototype=new Tools.Data.DataSet();Tools.Data.NestedXMLDataSet.prototype.constructor=Tools.Data.NestedXMLDataSet.prototype;Tools.Data.NestedXMLDataSet.prototype.getParentDataSet=function()
{return this.parentDataSet;};Tools.Data.NestedXMLDataSet.prototype.getNestedDataSetForParentRow=function(parentRow)
{var xmlNode=parentRow.ds_XMLNode;if(xmlNode&&this.nestedDataSets)
{if(this.currentDSAncestor&&this.currentDSAncestor==xmlNode)
return this.currentDS;var nDSArr=this.nestedDataSets;var nDSArrLen=nDSArr.length;for(var i=0;i<nDSArrLen;i++)
{var dsObj=nDSArr[i];if(dsObj&&xmlNode==dsObj.ancestor)
return dsObj.dataSet;}}
return null;};Tools.Data.NestedXMLDataSet.prototype.getNestedXMLDataSetsArray=function()
{var resultsArray=[];if(this.nestedDataSets)
{var arrDS=this.nestedDataSets;var numDS=this.nestedDataSets.length;for(var i=0;i<numDS;i++)
resultsArray.push(arrDS[i].dataSet);}
return resultsArray;};Tools.Data.NestedXMLDataSet.prototype.onDataChanged=function(notifier,data)
{if(!this.ignoreOnDataChanged)
this.loadData();};Tools.Data.NestedXMLDataSet.prototype.onCurrentRowChanged=function(notifier,data)
{this.notifyObservers("onPreParentContextChange");this.currentDS=null;this.currentDSAncestor=null;var pCurRow=this.parentDataSet.getCurrentRow();if(pCurRow)
{var nestedDS=this.getNestedDataSetForParentRow(pCurRow);if(nestedDS)
{this.currentDS=nestedDS;this.currentDSAncestor=pCurRow.ds_XMLNode;}}
this.notifyObservers("onDataChanged");this.notifyObservers("onPostParentContextChange");this.ignoreOnDataChanged=false;};Tools.Data.NestedXMLDataSet.prototype.onPostParentContextChange=Tools.Data.NestedXMLDataSet.prototype.onCurrentRowChanged;Tools.Data.NestedXMLDataSet.prototype.onPreParentContextChange=function(notifier,data)
{this.ignoreOnDataChanged=true;};Tools.Data.NestedXMLDataSet.prototype.filterAndSortData=function()
{if(this.filterDataFunc)
this.filterData(this.filterDataFunc,true);if(this.distinctOnLoad)
this.distinct(this.distinctFieldsOnLoad);if(this.keepSorted&&this.getSortColumn())
this.sort(this.lastSortColumns,this.lastSortOrder);else if(this.sortOnLoad)
this.sort(this.sortOnLoad,this.sortOrderOnLoad);if(this.filterFunc)
this.filter(this.filterFunc,true);};Tools.Data.NestedXMLDataSet.prototype.loadData=function()
{var parentDS=this.parentDataSet;if(!parentDS||parentDS.getLoadDataRequestIsPending()||!this.xpath)
return;if(!parentDS.getDataWasLoaded())
{parentDS.loadData();return;}
this.notifyObservers("onPreLoad");this.nestedDataSets=[];this.currentDS=null;this.currentDSAncestor=null;this.data=[];this.dataHash={};var self=this;var ancestorDS=[parentDS];if(parentDS.getNestedXMLDataSetsArray)
ancestorDS=parentDS.getNestedXMLDataSetsArray();var currentAncestor=null;var currentAncestorRow=parentDS.getCurrentRow();if(currentAncestorRow)
currentAncestor=currentAncestorRow.ds_XMLNode;var numAncestors=ancestorDS.length;for(var i=0;i<numAncestors;i++)
{var aDS=ancestorDS[i];var aData=aDS.getData(true);if(aData)
{var aDataLen=aData.length;for(var j=0;j<aDataLen;j++)
{var row=aData[j];if(row&&row.ds_XMLNode)
{var ds=new Tools.Data.DataSet(this.options);for(var cname in this.columnTypes)
ds.setColumnType(cname,this.columnTypes[cname]);var dataArr=Tools.Data.XMLDataSet.getRecordSetFromXMLDoc(row.ds_XMLNode,this.xpath,false,this.entityEncodeStrings);ds.setDataFromArray(dataArr.data,true);var dsObj=new Object;dsObj.ancestor=row.ds_XMLNode;dsObj.dataSet=ds;this.nestedDataSets.push(dsObj);if(row.ds_XMLNode==currentAncestor)
{this.currentDS=ds;this.currentDSAncestor=this.ds_XMLNode;}
ds.addObserver(function(notificationType,notifier,data){if(notifier==self.currentDS)setTimeout(function(){self.notifyObservers(notificationType,data);},0);});}}}}
this.pendingRequest=new Object;this.dataWasLoaded=false;this.pendingRequest.timer=setTimeout(function(){self.pendingRequest=null;self.dataWasLoaded=true;self.disableNotifications();self.filterAndSortData();self.enableNotifications();self.notifyObservers("onPostLoad");self.notifyObservers("onDataChanged");},0);};Tools.Data.NestedXMLDataSet.prototype.getData=function(unfiltered)
{if(this.currentDS)
return this.currentDS.getData(unfiltered);return[];};Tools.Data.NestedXMLDataSet.prototype.getRowCount=function(unfiltered)
{if(this.currentDS)
return this.currentDS.getRowCount(unfiltered);return 0;};Tools.Data.NestedXMLDataSet.prototype.getRowByID=function(rowID)
{if(this.currentDS)
return this.currentDS.getRowByID(rowID);return undefined;};Tools.Data.NestedXMLDataSet.prototype.getRowByRowNumber=function(rowNumber,unfiltered)
{if(this.currentDS)
return this.currentDS.getRowByRowNumber(rowNumber,unfiltered);return null;};Tools.Data.NestedXMLDataSet.prototype.getCurrentRow=function()
{if(this.currentDS)
return this.currentDS.getCurrentRow();return null;};Tools.Data.NestedXMLDataSet.prototype.setCurrentRow=function(rowID)
{if(this.currentDS)
return this.currentDS.setCurrentRow(rowID);};Tools.Data.NestedXMLDataSet.prototype.getRowNumber=function(row)
{if(this.currentDS)
return this.currentDS.getRowNumber(row);return 0;};Tools.Data.NestedXMLDataSet.prototype.getCurrentRowNumber=function()
{if(this.currentDS)
return this.currentDS.getCurrentRowNumber();return 0;};Tools.Data.NestedXMLDataSet.prototype.getCurrentRowID=function()
{if(this.currentDS)
return this.currentDS.getCurrentRowID();return 0;};Tools.Data.NestedXMLDataSet.prototype.setCurrentRowNumber=function(rowNumber)
{if(this.currentDS)
return this.currentDS.setCurrentRowNumber(rowNumber);};Tools.Data.NestedXMLDataSet.prototype.findRowsWithColumnValues=function(valueObj,firstMatchOnly,unfiltered)
{if(this.currentDS)
return this.currentDS.findRowsWithColumnValues(valueObj,firstMatchOnly,unfiltered);return firstMatchOnly?null:[];};Tools.Data.NestedXMLDataSet.prototype.setColumnType=function(columnNames,columnType)
{if(columnNames)
{Tools.Data.DataSet.prototype.setColumnType.call(this,columnNames,columnType);var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.setColumnType(columnNames,columnType);}};Tools.Data.NestedXMLDataSet.prototype.getColumnType=function(columnName)
{if(this.currentDS)
return this.currentDS.getColumnType(columnName);return"string";};Tools.Data.NestedXMLDataSet.prototype.distinct=function(columnNames)
{if(columnNames)
{var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.distinct(columnNames);}};Tools.Data.NestedXMLDataSet.prototype.sort=function(columnNames,sortOrder)
{if(columnNames)
{var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.sort(columnNames,sortOrder);if(dsArrLen>0)
{var ds=dsArr[0].dataSet;this.lastSortColumns=ds.lastSortColumns.slice(0);this.lastSortOrder=ds.lastSortOrder;}}};Tools.Data.NestedXMLDataSet.prototype.filterData=function(filterFunc,filterOnly)
{this.filterDataFunc=filterFunc;var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.filterData(filterFunc,filterOnly);};Tools.Data.NestedXMLDataSet.prototype.filter=function(filterFunc,filterOnly)
{this.filterFunc=filterFunc;var dsArr=this.nestedDataSets;var dsArrLen=dsArr.length;for(var i=0;i<dsArrLen;i++)
dsArr[i].dataSet.filter(filterFunc,filterOnly);};Tools.Data.NestedXMLDataSet.prototype.setXPath=function(path)
{if(this.xpath!=path)
{this.xpath=path;this.loadData();}};
// ToolsNotifier.js - version 0.1 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Utils)Tools.Utils={};Tools.Utils.Notifier=function()
{this.observers=[];this.suppressNotifications=0;};Tools.Utils.Notifier.prototype.addObserver=function(observer)
{if(!observer)
return;var len=this.observers.length;for(var i=0;i<len;i++)
{if(this.observers[i]==observer)
return;}
this.observers[len]=observer;};Tools.Utils.Notifier.prototype.removeObserver=function(observer)
{if(!observer)
return;for(var i=0;i<this.observers.length;i++)
{if(this.observers[i]==observer)
{this.observers.splice(i,1);break;}}};Tools.Utils.Notifier.prototype.notifyObservers=function(methodName,data)
{if(!methodName)
return;if(!this.suppressNotifications)
{var len=this.observers.length;for(var i=0;i<len;i++)
{var obs=this.observers[i];if(obs)
{if(typeof obs=="function")
obs(methodName,this,data);else if(obs[methodName])
obs[methodName](this,data);}}}};Tools.Utils.Notifier.prototype.enableNotifications=function()
{if(--this.suppressNotifications<0)
{this.suppressNotifications=0;Tools.Debug.reportError("Unbalanced enableNotifications() call!\n");}};Tools.Utils.Notifier.prototype.disableNotifications=function()
{++this.suppressNotifications;};
// ToolsPagedView.js - version 0.7 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Data)Tools.Data={};Tools.Data.PagedView=function(ds,options)
{Tools.Data.DataSet.call(this);this.ds=ds;this.pageSize=10;this.pageOffset=0;this.forceFullPages=false;this.pageFirstItemOffset=0;this.useZeroBasedIndexes=false;this.setCurrentRowOnPageChange=false;Tools.Utils.setOptions(this,options);this.adjustmentValue=1;if(!this.useZeroBasedIndexes)
this.adjustmentValue=0;this.pageStop=this.pageOffset+this.pageSize;this.ds.addObserver(this);this.preProcessData();if(this.pageSize>0)
this.filter(this.getFilterFunc());};Tools.Data.PagedView.prototype=new Tools.Data.DataSet();Tools.Data.PagedView.prototype.constructor=Tools.Data.PagedView;Tools.Data.PagedView.prototype.setCurrentRow=function(rowID)
{if(this.ds)
this.ds.setCurrentRow(rowID);};Tools.Data.PagedView.prototype.setCurrentRowNumber=function(rowNumber)
{if(this.ds)
this.ds.setCurrentRowNumber(rowNumber);};Tools.Data.PagedView.prototype.sort=function(columnNames,sortOrder)
{if(!columnNames)
return;if(typeof columnNames=="string")
columnNames=[columnNames,"ds_RowID"];else if(columnNames.length<2&&columnNames[0]!="ds_RowID")
columnNames.push("ds_RowID");if(!sortOrder)
sortOrder="toggle";if(sortOrder=="toggle")
{if(this.lastSortColumns.length>0&&this.lastSortColumns[0]==columnNames[0]&&this.lastSortOrder=="ascending")
sortOrder="descending";else
sortOrder="ascending";}
var nData={oldSortColumns:this.lastSortColumns,oldSortOrder:this.lastSortOrder,newSortColumns:columnNames,newSortOrder:sortOrder};this.notifyObservers("onPreSort",nData);this.disableNotifications();Tools.Data.DataSet.prototype.sort.call(this,columnNames,sortOrder);this.updatePagerColumns();this.firstPage();this.enableNotifications();this.notifyObservers("onPostSort",nData);};Tools.Data.PagedView.prototype.loadData=function()
{if(!this.ds||this.ds.getLoadDataRequestIsPending())
return;if(!this.ds.getDataWasLoaded())
{this.ds.loadData();return;}
Tools.Data.DataSet.prototype.loadData.call(this);};Tools.Data.PagedView.prototype.onDataChanged=function(notifier,data)
{this.setPageOffset(0);this.preProcessData();};Tools.Data.PagedView.prototype.onCurrentRowChanged=function(notifier,data)
{var self=this;setTimeout(function(){self.notifyObservers("onCurrentRowChanged",data);},0);};Tools.Data.PagedView.prototype.onPostSort=Tools.Data.PagedView.prototype.onDataChanged;Tools.Data.PagedView.prototype.updatePagerColumns=function()
{var rows=this.getData(true);if(!rows||rows.length<1)
return;var numRows=rows.length;var pageSize=(this.pageSize>0)?this.pageSize:numRows;var firstItem=1;var lastItem=firstItem+pageSize-1;lastItem=(lastItem<firstItem)?firstItem:(lastItem>numRows?numRows:lastItem);var pageNum=1;var pageCount=parseInt((numRows+pageSize-1)/pageSize);var pageItemCount=Math.min(numRows,pageSize);for(var i=0;i<numRows;i++)
{itemIndex=i+1;if(itemIndex>lastItem)
{firstItem=itemIndex;lastItem=firstItem+this.pageSize-1;lastItem=(lastItem>numRows)?numRows:lastItem;pageItemCount=Math.min(lastItem-firstItem+1,pageSize);++pageNum;}
var row=rows[i];if(row)
{row.ds_PageNumber=pageNum;row.ds_PageSize=this.pageSize;row.ds_PageItemRowNumber=i;row.ds_PageItemNumber=itemIndex;row.ds_PageFirstItemNumber=firstItem;row.ds_PageLastItemNumber=lastItem;row.ds_PageItemCount=pageItemCount;row.ds_PageCount=pageCount;row.ds_PageTotalItemCount=numRows;}}};Tools.Data.PagedView.prototype.preProcessData=function()
{if(!this.ds||!this.ds.getDataWasLoaded())
return;this.notifyObservers("onPreLoad");this.unfilteredData=null;this.data=[];this.dataHash={};var rows=this.ds.getData();if(rows)
{var numRows=rows.length;for(var i=0;i<numRows;i++)
{var row=rows[i];var newRow=new Object();Tools.Utils.setOptions(newRow,row);this.data.push(newRow);this.dataHash[newRow.ds_RowID]=newRow;}
if(numRows>0)
this.curRowID=rows[0].ds_RowID;this.updatePagerColumns();}
this.loadData();};Tools.Data.PagedView.prototype.getFilterFunc=function()
{var self=this;return function(ds,row,rowNumber){if(rowNumber<self.pageOffset||rowNumber>=self.pageStop)
return null;return row;};};Tools.Data.PagedView.prototype.setPageOffset=function(offset)
{var numRows=this.getData(true).length;this.pageFirstItemOffset=(offset<0)?0:offset;if(this.forceFullPages&&offset>(numRows-this.pageSize))
offset=numRows-this.pageSize;if(offset<0)
offset=0;this.pageOffset=offset;this.pageStop=offset+this.pageSize;};Tools.Data.PagedView.prototype.filterDataSet=function(offset)
{if(this.pageSize<1)
return;this.setPageOffset(offset);var rows=this.getData(true);if(rows&&rows.length&&rows[this.pageFirstItemOffset])
this.curRowID=rows[this.pageFirstItemOffset].ds_RowID;if(this.setCurrentRowOnPageChange)
this.ds.setCurrentRow(this.curRowID);this.filter(this.getFilterFunc());};Tools.Data.PagedView.prototype.getPageCount=function()
{return parseInt((this.getData(true).length+this.pageSize-1)/this.pageSize);};Tools.Data.PagedView.prototype.getCurrentPage=function()
{return parseInt((((this.pageFirstItemOffset!=this.pageOffset)?this.pageFirstItemOffset:this.pageOffset)+this.pageSize)/this.pageSize)-this.adjustmentValue;};Tools.Data.PagedView.prototype.goToPage=function(pageNum)
{pageNum=parseInt(pageNum);var numPages=this.getPageCount();if((pageNum+this.adjustmentValue)<1||(pageNum+this.adjustmentValue)>numPages)
return;var newOffset=(pageNum-1+this.adjustmentValue)*this.pageSize;this.filterDataSet(newOffset);};Tools.Data.PagedView.prototype.goToPageContainingRowID=function(rowID)
{this.goToPageContainingRowNumber(this.getRowNumber(this.getRowByID(rowID),true));};Tools.Data.PagedView.prototype.goToPageContainingRowNumber=function(rowNumber)
{this.goToPage(this.getPageForRowNumber(rowNumber));};Tools.Data.PagedView.prototype.goToPageContainingItemNumber=function(itemNumber)
{this.goToPageContainingRowNumber(itemNumber-1);};Tools.Data.PagedView.prototype.firstPage=function()
{this.goToPage(1-this.adjustmentValue);};Tools.Data.PagedView.prototype.lastPage=function()
{this.goToPage(this.getPageCount()-this.adjustmentValue);};Tools.Data.PagedView.prototype.previousPage=function()
{this.goToPage(this.getCurrentPage()-1);};Tools.Data.PagedView.prototype.nextPage=function()
{this.goToPage(this.getCurrentPage()+1);};Tools.Data.PagedView.prototype.getPageForRowID=function(rowID)
{return this.getPageForRowNumber(this.getRowNumber(this.getRowByID(rowID),true));};Tools.Data.PagedView.prototype.getPageForRowNumber=function(rowNumber)
{return parseInt(rowNumber/this.pageSize)+1-this.adjustmentValue;};Tools.Data.PagedView.prototype.getPageForItemNumber=function(itemNumber)
{return this.getPageForRowNumber(itemNumber-1);};Tools.Data.PagedView.prototype.getPageSize=function()
{return this.pageSize;};Tools.Data.PagedView.prototype.setPageSize=function(pageSize)
{if(this.pageSize==pageSize)
return;if(pageSize<1)
{this.pageSize=0;this.setPageOffset(0);this.updatePagerColumns();this.filter(null);}
else if(this.pageSize<1)
{this.pageSize=pageSize;this.setPageOffset(0);this.updatePagerColumns();this.filterDataSet(this.pageOffset);}
else
{this.pageSize=pageSize;this.updatePagerColumns();this.goToPage(this.getPageForRowNumber(this.pageFirstItemOffset));}};Tools.Data.PagedView.prototype.getPagingInfo=function()
{return new Tools.Data.PagedView.PagingInfo(this);};Tools.Data.PagedView.PagingInfo=function(pagedView)
{Tools.Data.DataSet.call(this);this.pagedView=pagedView;pagedView.addObserver(this);};Tools.Data.PagedView.PagingInfo.prototype=new Tools.Data.DataSet();Tools.Data.PagedView.PagingInfo.prototype.constructor=Tools.Data.PagedView.PagingInfo;Tools.Data.PagedView.PagingInfo.prototype.onDataChanged=function(notifier,data)
{this.extractInfo();};Tools.Data.PagedView.PagingInfo.prototype.onPostSort=Tools.Data.PagedView.PagingInfo.prototype.onDataChanged;Tools.Data.PagedView.PagingInfo.prototype.extractInfo=function()
{var pv=this.pagedView;if(!pv||!pv.getDataWasLoaded())
return;this.notifyObservers("onPreLoad");this.unfilteredData=null;this.data=[];this.dataHash={};var rows=pv.getData(true);if(rows)
{var numRows=rows.length;var numPages=pv.getPageCount();var i=0;var id=0;while(i<numRows)
{var row=rows[i];var newRow=new Object();newRow.ds_RowID=id++;this.data.push(newRow);this.dataHash[newRow.ds_RowID]=newRow;newRow.ds_PageNumber=row.ds_PageNumber;newRow.ds_PageSize=row.ds_PageSize;newRow.ds_PageCount=row.ds_PageCount;newRow.ds_PageFirstItemNumber=row.ds_PageFirstItemNumber;newRow.ds_PageLastItemNumber=row.ds_PageLastItemNumber;newRow.ds_PageItemCount=row.ds_PageItemCount;newRow.ds_PageTotalItemCount=row.ds_PageTotalItemCount;i+=newRow.ds_PageSize;}
if(numRows>0)
{var self=this;var func=function(notificationType,notifier,data){if(notificationType!="onPostLoad")
return;self.removeObserver(func);self.setCurrentRowNumber(pv.getCurrentPage()-(pv.useZeroBasedIndexes?0:1));};this.addObserver(func);}}
this.loadData();};
// ToolsRating.js - version 0.2 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

try
{document.execCommand("BackgroundImageCache",false,true);}
catch(err){}
var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.Rating=function(element,opts)
{Tools.Widget.Rating.Notifier.call(this);this.init(element,opts);};Tools.Widget.Rating.KEY_ENTER=13;Tools.Widget.Rating.KEY_LEFT=37;Tools.Widget.Rating.KEY_RIGHT=39;Tools.Widget.Rating.Notifier=function()
{this.observers=[];this.suppressNotifications=0;};Tools.Widget.Rating.Notifier.prototype.addObserver=function(observer)
{if(!observer)
return;var len=this.observers.length;for(var i=0;i<len;i++)
if(this.observers[i]==observer)return;this.observers[len]=observer;};Tools.Widget.Rating.Notifier.prototype.removeObserver=function(observer)
{if(!observer)
return;for(var i=0;i<this.observers.length;i++)
{if(this.observers[i]==observer)
{this.observers.splice(i,1);break;}}};Tools.Widget.Rating.Notifier.prototype.notifyObservers=function(methodName,data)
{if(!methodName)
return;if(!this.suppressNotifications)
{var len=this.observers.length;for(var i=0;i<len;i++)
{var obs=this.observers[i];if(obs)
{if(typeof obs=="function")
{obs(methodName,this,data);}
else if(obs[methodName])
{obs[methodName](this,data);}}}}};Tools.Widget.Rating.Notifier.prototype.enableNotifications=function()
{if(--this.suppressNotifications<0)
{this.suppressNotifications=0;Tools.Effect.Rating.showError("Unbalanced enableNotifications() call!\n");}};Tools.Widget.Rating.Notifier.prototype.disableNotifications=function()
{++this.suppressNotifications;};Tools.Widget.Rating.prototype=new Tools.Widget.Rating.Notifier();Tools.Widget.Rating.prototype.constructor=Tools.Widget.Rating;Tools.Widget.Rating.prototype.init=function(element,opts)
{this.element=this.getElement(element);this.containerInitialClass='ratingInitialState';this.containerReadOnlyClass='ratingReadOnlyState';this.containerRatedClass='ratingRatedState';this.readOnlyErrClass='ratingReadOnlyErrState';this.starDefaultClass='ratingButton';this.starFullClass='ratingFull';this.starHalfClass='ratingHalf';this.starEmptyClass='ratingEmpty';this.starHoverClass='ratingHover';this.counterClass='ratingCounter';this.movePrevKeyCode=Tools.Widget.Rating.KEY_LEFT;this.moveNextKeyCode=Tools.Widget.Rating.KEY_RIGHT;this.doRatingKeyCode=Tools.Widget.Rating.KEY_ENTER;this.afterRating='currentValue';this.enableKeyboardNavigation=true;this.allowMultipleRating=true;this.method='GET';this.postData=null;this.ratingValueElement=null;this.ratingValue=0;this.saveUrl=null;this.hasFocus=null;this.rateHandler=null;Tools.Widget.Rating.setOptions(this,opts,true);this.stars=Tools.Widget.Rating.getElementsByClassName(this.element,this.starDefaultClass);if(this.stars.length==0)
{this.showError('No star elements in the container '+(typeof element=='string'?element:''));return;}
for(var i=0;i<this.stars.length;i++)
this.stars[i].starValue=i+1;if(this.saveUrl&&this.postData)
this.method='POST';if(this.ratingValueElement)
{this.ratingValueElement=this.getElement(this.ratingValueElement);this.ratingValue=parseFloat(this.ratingValueElement.getAttribute('value'));if(isNaN(this.ratingValue))
this.ratingValue=0;}
if(this.stars.length<2)
{this.showError("The rating widget must have at least two stars!");return;}
if(this.ratingValue>this.stars.length)
{this.showError("Rating initial value must not exceed the number of stars!");return;}
if(this.counter)
{this.updateCounter(this.ratingValue);}
this.setValue(this.ratingValue);if(this.readOnly)
this.setState('readonly');else
this.setState('initial');this.attachBehaviors();};Tools.Widget.Rating.prototype.getState=function()
{return this.currentState;};Tools.Widget.Rating.prototype.setState=function(state)
{var className;this.currentState=state;this.removeClassName(this.element,this.containerInitialClass);this.removeClassName(this.element,this.containerReadOnlyClass);this.removeClassName(this.element,this.containerRatedClass);switch(state)
{case'readonly':className=this.containerReadOnlyClass;break;case'rated':className=this.containerRatedClass;if(!this.allowMultipleRating)
{this.addClassName(this.element,this.containerReadOnlyClass);state='readonly';}
break;default:state='initial';className=this.containerInitialClass;break;}
this.addClassName(this.element,className);};Tools.Widget.Rating.prototype.removeMessage=function(className,when)
{switch(className)
{case this.readOnlyErrClass:case this.containerRatedClass:if(!when)
this.removeClassName(this.element,className);else
{var self=this;setTimeout(function(){self.removeClassName(self.element,className);if(className==self.containerRatedClass&&self.containerRatedClass!='readonly'){self.addClassName(self.element,self.containerInitialClass);}},when);}
break;}};Tools.Widget.Rating.prototype.attachBehaviors=function()
{this.event_handlers=[];for(var j=0;j<this.stars.length;j++)
{var self=this;var star=this.stars[j];this.event_handlers.push([star,"click",function(e){self.onRate(e||event);}]);if(!this.readOnly)
{this.event_handlers.push([star,"mouseover",function(e){self.onFocus(e||event);}]);this.event_handlers.push([star,"mouseout",function(e){self.onBlur(e||event);}]);}
this.enableKeyboardNavigation=(this.enableKeyboardNavigation&&star.attributes.getNamedItem("tabindex"));if(this.enableKeyboardNavigation&&!this.readOnly){this.event_handlers.push([star,"focus",function(e){self.onFocus(e||event);}]);this.event_handlers.push([star,"blur",function(e){self.onBlur(e||event);}]);this.event_handlers.push([star,"keydown",function(e){self.keyDown(e||event);}]);}}
for(var i=0;i<this.event_handlers.length;i++)
Tools.Widget.Rating.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);Tools.Widget.Rating.addEventListener(window,"unload",this.destroy,false);};Tools.Widget.Rating.prototype.getValue=function()
{return this.ratingValue;};Tools.Widget.Rating.prototype.setValue=function(rating)
{if(this.ratingValueElement)
this.ratingValueElement.value=rating;this.ratingValue=rating;this.updateCounter(this.ratingValue);for(var j=0;j<this.stars.length;j++)
{this.resetClasses(this.stars[j]);if(rating>=1)
{this.addClassName(this.stars[j],this.starFullClass);rating--;}
else if(rating>=0.5&&rating<1)
{this.addClassName(this.stars[j],this.starHalfClass);rating=0;}
else
{this.addClassName(this.stars[j],this.starEmptyClass);}}};Tools.Widget.Rating.prototype.onFocus=function(e)
{this.hasFocus=true;if(this.currentState==='readonly'||(this.currentState==='rated'&&!this.allowMultipleRating))
return;var target=(e.target)?e.target:e.srcElement;for(var k=0;k<=target.starValue;k++)
this.addClassName(this.stars[k-1],this.starHoverClass);this.updateCounter(k-1);};Tools.Widget.Rating.prototype.onBlur=function(e)
{this.hasFocus=false;if(this.currentState==='readonly'||(this.currentState==='rated'&&!this.allowMultipleRating))
return;var target=(e.target)?e.target:e.srcElement;for(var k=0;k<=target.starValue;k++)
this.removeClassName(this.stars[k-1],this.starHoverClass);this.updateCounter(this.ratingValue);};Tools.Widget.Rating.prototype.onRate=function(e)
{this.notifyObservers("onPreRate");if(this.currentState=='rated'&&!this.allowMultipleRating)
return;if(this.currentState=='readonly')
{this.removeClassName(this.element,this.containerRatedClass);this.addClassName(this.element,this.readOnlyErrClass);return;}
this.setState('rated');var target=(e.target)?e.target:e.srcElement;this.setValue(target.starValue);try{if(this.saveUrl)
this.saveUrlHandler(target.starValue);if(typeof this.rateHandler=='function')
this.rateHandler();}
catch(err){this.showError(err);};this.notifyObservers("onPostRate");};Tools.Widget.Rating.prototype.keyDown=function(e)
{if(this.currentState=='rated'&&!this.allowMultipleRating)
return;var key=e.keyCode;if(!this.hasFocus||(key!=this.movePrevKeyCode&&key!=this.moveNextKeyCode&&key!=this.doRatingKeyCode))
return true;var target=(e.target)?e.target:e.srcElement;var j=target.starValue-1;switch(key)
{case this.movePrevKeyCode:if(j>0)
this.stars[j-1].focus();break;case this.moveNextKeyCode:if(j<this.stars.length-1)
this.stars[j+1].focus();break;case this.doRatingKeyCode:this.onRate(e);break;default:break;}
return Tools.Widget.Rating.stopEvent(e);};Tools.Widget.Rating.prototype.updateCounter=function(val)
{if(this.counter)
{this.ratingCounter=Tools.Widget.Rating.getElementsByClassName(this.element,this.counterClass)[0];this.ratingCounter.innerHTML='['+val+'/'+this.stars.length+']';}};Tools.Widget.Rating.prototype.saveUrlHandler=function(val)
{this.newSaveUrl=this.saveUrl.replace(/@@ratingValue@@/,val);var opts={};if(this.postData){this.newPostData=this.postData.replace(/@@ratingValue@@/,val);opts.headers={"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"};opts.postData=this.newPostData;}
var self=this;opts.errorCallback=function(req){self.onLoadError(req);};this.pendingRequest=Tools.Widget.Rating.loadURL(this.method,this.newSaveUrl,true,function(req){self.onLoadSuccess(req,val);},opts);};Tools.Widget.Rating.prototype.onLoadSuccess=function(req,val)
{this.notifyObservers("onServerUpdate",req);if(this.afterRating=='serverValue'){var returnVal=parseFloat(req.xhRequest.responseText);if(!isNaN(returnVal))
this.setValue(returnVal);}};Tools.Widget.Rating.prototype.onLoadError=function(req)
{this.notifyObservers("onServerError",req);};Tools.Widget.Rating.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.Rating.prototype.destroy=function()
{if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++)
{Tools.Widget.Rating.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
try{delete this.element;}catch(err){}
try{delete this.stars;}catch(err){}
try{delete this.counter;}catch(err){}
try{delete this.ratingValueElement;}catch(err){}
try{delete this.event_handlers;}catch(err){}};Tools.Widget.Rating.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.Rating.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.Rating.prototype.resetClasses=function(el)
{var cls=[this.starFullClass,this.starHalfClass,this.starEmptyClass,this.starHoverClass];for(var i=0;i<cls.length;i++)
this.removeClassName(el,cls[i]);};Tools.Widget.Rating.prototype.showError=function(msg)
{alert('Tools.Widget.Rating ERROR: '+msg);};Tools.Widget.Rating.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Rating.removeEventListener=function(element,eventType,handler,capture)
{try
{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Rating.hasClassName=function(ele,className)
{if(typeof element=='string')
element=document.getElementById(element);if(!ele||!className||!ele.className||ele.className.search(new RegExp("\\b"+className+"\\b"))==-1){return false;}
return true;};Tools.Widget.Rating.getElementsByClassName=function(root,className)
{var results=[];var elements=root.getElementsByTagName("*");for(var i=0;i<elements.length;i++){if(Tools.Widget.Rating.hasClassName(elements[i],className))
results.push(elements[i]);}
return results;};Tools.Widget.Rating.stopEvent=function(e)
{if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Tools.Widget.Rating.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Rating.msProgIDs=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0"];Tools.Widget.Rating.createXMLHttpRequest=function()
{var req=null;try
{if(window.ActiveXObject)
{while(!req&&Tools.Widget.Rating.msProgIDs.length)
{try{req=new ActiveXObject(Tools.Widget.Rating.msProgIDs[0]);}catch(e){req=null;}
if(!req)
Tools.Widget.Rating.msProgIDs.splice(0,1);}}
if(!req&&window.XMLHttpRequest)
req=new XMLHttpRequest();}
catch(e){req=null;}
if(!req)
Tools.Widget.Rating.prototype.showError("Failed to create an XMLHttpRequest object!");return req;};Tools.Widget.Rating.loadURL=function(method,url,async,callback,opts)
{var req=new Tools.Widget.Rating.loadURL.Request();req.method=method;req.url=url;req.async=async;req.successCallback=callback;Tools.Widget.Rating.setOptions(req,opts);try
{req.xhRequest=Tools.Widget.Rating.createXMLHttpRequest();if(!req.xhRequest)
return null;if(req.async)
req.xhRequest.onreadystatechange=function(){Tools.Widget.Rating.loadURL.callback(req);};req.xhRequest.open(req.method,req.url,req.async,req.username,req.password);if(req.headers)
{for(var name in req.headers)
req.xhRequest.setRequestHeader(name,req.headers[name]);}
req.xhRequest.send(req.postData);if(!req.async)
Tools.Widget.Rating.loadURL.callback(req);}
catch(e)
{if(req.errorCallback)
req.errorCallback(req);else
Tools.Widget.Rating.prototype.showError("Exception caught while loading "+url+": "+e);req=null;}
return req;};Tools.Widget.Rating.loadURL.callback=function(req)
{if(!req||req.xhRequest.readyState!=4)
return;if(req.successCallback&&(req.xhRequest.status==200||req.xhRequest.status==0))
req.successCallback(req);else if(req.errorCallback)
req.errorCallback(req);};Tools.Widget.Rating.loadURL.Request=function()
{var props=Tools.Widget.Rating.loadURL.Request.props;var numProps=props.length;for(var i=0;i<numProps;i++)
this[props[i]]=null;this.method="GET";this.async=true;this.headers={};};Tools.Widget.Rating.loadURL.Request.props=["method","url","async","username","password","postData","successCallback","errorCallback","headers","userData","xhRequest"];
// ToolsSlideShowControl.js - version 0.1 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools; if (!Tools) Tools = {}; if (!Tools.Widget) Tools.Widget = {};

Tools.Widget.SlideShowControl = function(ele, options)
{
	Tools.Utils.Notifier.call(this);

	this.element = Tools.$(ele);
	this.interval = 4000;
	this.timerID = 0;
	this.active = false;

	this.playBtnSelector = ".playBtn";
	this.prevBtnSelector = ".previousBtn";
	this.nextBtnSelector = ".nextBtn";
	this.firstBtnSelector = ".firstBtn";
	this.lastBtnSelector = ".lastBtn";

	this.playClass = "playBtn";
	this.pauseClass = "pauseBtn";

	var self = this;

	this.playBtn = Tools.$$(this.playBtnSelector, this.element)[0];
	if (this.playBtn)
		Tools.Utils.addEventListener(this.playBtn, "click", function(e){ self.toggle(); return false; }, false);

	this.prevBtn = Tools.$$(this.prevBtnSelector, this.element)[0];
	if (this.prevBtn)
		Tools.Utils.addEventListener(this.prevBtn, "click", function(e){ self.previous(); return false; }, false);

	this.nextBtn = Tools.$$(this.nextBtnSelector, this.element)[0];
	if (this.nextBtn)
		Tools.Utils.addEventListener(this.nextBtn, "click", function(e){ self.next(); return false; }, false);

	this.firstBtn = Tools.$$(this.firstBtnSelector, this.element)[0];
	if (this.firstBtn)
		Tools.Utils.addEventListener(this.firstBtn, "click", function(e){ self.first(); return false; }, false);

	this.lastBtn = Tools.$$(this.lastBtnSelector, this.element)[0];
	if (this.lastBtn)
		Tools.Utils.addEventListener(this.lastBtn, "click", function(e){ self.last(); return false; }, false);

};

Tools.Widget.SlideShowControl.prototype = new Tools.Utils.Notifier();
Tools.Widget.SlideShowControl.prototype.constructor = Tools.Widget.SlideShowControl;

Tools.Widget.SlideShowControl.prototype.isActive = function()
{
	return this.slideShowIsActive;
};

Tools.Widget.SlideShowControl.prototype.startTimer = function()
{
	this.killTimer();

	var self = this;
	this.timerID = setInterval(function(){ self.next(); }, this.interval);
};

Tools.Widget.SlideShowControl.prototype.killTimer = function()
{
	if (this.timerID)
		clearInterval(this.timerID);
	this.timerID = 0;
};

Tools.Widget.SlideShowControl.prototype.start = function()
{
	this.slideShowIsActive = true;

	if (this.playBtn)
	{
		Tools.Utils.removeClassName(this.playBtn, this.playClass);
		Tools.Utils.addClassName(this.playBtn, this.pauseClass);
	}

	this.startTimer();
	this.notifyObservers("onStart");
};

Tools.Widget.SlideShowControl.prototype.stop = function()
{
	this.slideShowIsActive = false;

	if (this.playBtn)
	{
		Tools.Utils.addClassName(this.playBtn, this.playClass);
		Tools.Utils.removeClassName(this.playBtn, this.pauseClass);
	}

	this.killTimer();
	this.notifyObservers("onStop");
};

Tools.Widget.SlideShowControl.prototype.toggle = function()
{
	if (this.slideShowIsActive)
		this.stop();
	else
		this.start();
};

Tools.Widget.SlideShowControl.prototype.previous = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onPreviousSlide");
};

Tools.Widget.SlideShowControl.prototype.next = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onNextSlide");
};

Tools.Widget.SlideShowControl.prototype.first = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onFirstSlide");
};


Tools.Widget.SlideShowControl.prototype.last = function(stopSlideShow)
{
	if (stopSlideShow)
		this.killTimer();
	this.notifyObservers("onLastSlide");
};
// ToolsSlidingPanels.js - version 0.5 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.SlidingPanels=function(element,opts)
{this.element=this.getElement(element);this.enableAnimation=true;this.currentPanel=null;this.enableKeyboardNavigation=true;this.hasFocus=false;this.previousPanelKeyCode=Tools.Widget.SlidingPanels.KEY_LEFT;this.nextPanelKeyCode=Tools.Widget.SlidingPanels.KEY_RIGHT;this.currentPanelClass="SlidingPanelsCurrentPanel";this.focusedClass="SlidingPanelsFocused";this.animatingClass="SlidingPanelsAnimating";Tools.Widget.SlidingPanels.setOptions(this,opts);if(this.element)
this.element.style.overflow="hidden";if(this.defaultPanel)
{if(typeof this.defaultPanel=="number")
this.currentPanel=this.getContentPanels()[this.defaultPanel];else
this.currentPanel=this.getElement(this.defaultPanel);}
if(!this.currentPanel)
this.currentPanel=this.getContentPanels()[0];if(Tools.Widget.SlidingPanels.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.SlidingPanels.loadQueue.push(this);};Tools.Widget.SlidingPanels.prototype.onFocus=function(e)
{this.hasFocus=true;this.addClassName(this.element,this.focusedClass);return false;};Tools.Widget.SlidingPanels.prototype.onBlur=function(e)
{this.hasFocus=false;this.removeClassName(this.element,this.focusedClass);return false;};Tools.Widget.SlidingPanels.KEY_LEFT=37;Tools.Widget.SlidingPanels.KEY_UP=38;Tools.Widget.SlidingPanels.KEY_RIGHT=39;Tools.Widget.SlidingPanels.KEY_DOWN=40;Tools.Widget.SlidingPanels.prototype.onKeyDown=function(e)
{var key=e.keyCode;if(!this.hasFocus||(key!=this.previousPanelKeyCode&&key!=this.nextPanelKeyCode))
return true;if(key==this.nextPanelKeyCode)
this.showNextPanel();else
this.showPreviousPanel();if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Tools.Widget.SlidingPanels.prototype.attachBehaviors=function()
{var ele=this.element;if(!ele)
return;if(this.enableKeyboardNavigation)
{var focusEle=null;var tabIndexAttr=ele.attributes.getNamedItem("tabindex");if(tabIndexAttr||ele.nodeName.toLowerCase()=="a")
focusEle=ele;if(focusEle)
{var self=this;Tools.Widget.SlidingPanels.addEventListener(focusEle,"focus",function(e){return self.onFocus(e||window.event);},false);Tools.Widget.SlidingPanels.addEventListener(focusEle,"blur",function(e){return self.onBlur(e||window.event);},false);Tools.Widget.SlidingPanels.addEventListener(focusEle,"keydown",function(e){return self.onKeyDown(e||window.event);},false);}}
if(this.currentPanel)
{var ea=this.enableAnimation;this.enableAnimation=false;this.showPanel(this.currentPanel);this.enableAnimation=ea;}};Tools.Widget.SlidingPanels.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.SlidingPanels.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.SlidingPanels.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.SlidingPanels.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.SlidingPanels.prototype.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Tools.Widget.SlidingPanels.prototype.getCurrentPanel=function()
{return this.currentPanel;};Tools.Widget.SlidingPanels.prototype.getContentGroup=function()
{return this.getElementChildren(this.element)[0];};Tools.Widget.SlidingPanels.prototype.getContentPanels=function()
{return this.getElementChildren(this.getContentGroup());};Tools.Widget.SlidingPanels.prototype.getContentPanelsCount=function()
{return this.getContentPanels().length;};Tools.Widget.SlidingPanels.onloadDidFire=false;Tools.Widget.SlidingPanels.loadQueue=[];Tools.Widget.SlidingPanels.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.SlidingPanels.processLoadQueue=function(handler)
{Tools.Widget.SlidingPanels.onloadDidFire=true;var q=Tools.Widget.SlidingPanels.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.SlidingPanels.addLoadListener(Tools.Widget.SlidingPanels.processLoadQueue);Tools.Widget.SlidingPanels.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Tools.Widget.SlidingPanels.prototype.getContentPanelIndex=function(ele)
{if(ele)
{ele=this.getElement(ele);var panels=this.getContentPanels();var numPanels=panels.length;for(var i=0;i<numPanels;i++)
{if(panels[i]==ele)
return i;}}
return-1;};Tools.Widget.SlidingPanels.prototype.showPanel=function(elementOrIndex)
{var pIndex=-1;if(typeof elementOrIndex=="number")
pIndex=elementOrIndex;else
pIndex=this.getContentPanelIndex(elementOrIndex);var numPanels=this.getContentPanelsCount();if(numPanels>0)
pIndex=(pIndex>=numPanels)?numPanels-1:pIndex;else
pIndex=0;var panel=this.getContentPanels()[pIndex];var contentGroup=this.getContentGroup();if(panel&&contentGroup)
{if(this.currentPanel)
this.removeClassName(this.currentPanel,this.currentPanelClass);this.currentPanel=panel;var nx=-panel.offsetLeft;var ny=-panel.offsetTop;if(this.enableAnimation)
{if(this.animator)
this.animator.stop();var cx=contentGroup.offsetLeft;var cy=contentGroup.offsetTop;if(cx!=nx||cy!=ny)
{var self=this;this.addClassName(this.element,this.animatingClass);this.animator=new Tools.Widget.SlidingPanels.PanelAnimator(contentGroup,cx,cy,nx,ny,{duration:this.duration,fps:this.fps,transition:this.transition,finish:function()
{self.removeClassName(self.element,self.animatingClass);self.addClassName(panel,self.currentPanelClass);}});this.animator.start();}}
else
{contentGroup.style.left=nx+"px";contentGroup.style.top=ny+"px";this.addClassName(panel,this.currentPanelClass);}}
return panel;};Tools.Widget.SlidingPanels.prototype.showFirstPanel=function()
{return this.showPanel(0);};Tools.Widget.SlidingPanels.prototype.showLastPanel=function()
{return this.showPanel(this.getContentPanels().length-1);};Tools.Widget.SlidingPanels.prototype.showPreviousPanel=function()
{return this.showPanel(this.getContentPanelIndex(this.currentPanel)-1);};Tools.Widget.SlidingPanels.prototype.showNextPanel=function()
{return this.showPanel(this.getContentPanelIndex(this.currentPanel)+1);};Tools.Widget.SlidingPanels.PanelAnimator=function(ele,curX,curY,dstX,dstY,opts)
{this.element=ele;this.curX=curX;this.curY=curY;this.dstX=dstX;this.dstY=dstY;this.fps=60;this.duration=500;this.transition=Tools.Widget.SlidingPanels.PanelAnimator.defaultTransition;this.startTime=0;this.timerID=0;this.finish=null;var self=this;this.intervalFunc=function(){self.step();};Tools.Widget.SlidingPanels.setOptions(this,opts,true);this.interval=1000/this.fps;};Tools.Widget.SlidingPanels.PanelAnimator.defaultTransition=function(time,begin,finish,duration){time/=duration;return begin+((2-time)*time*finish);};Tools.Widget.SlidingPanels.PanelAnimator.prototype.start=function()
{this.stop();this.startTime=(new Date()).getTime();this.timerID=setTimeout(this.intervalFunc,this.interval);};Tools.Widget.SlidingPanels.PanelAnimator.prototype.stop=function()
{if(this.timerID)
clearTimeout(this.timerID);this.timerID=0;};Tools.Widget.SlidingPanels.PanelAnimator.prototype.step=function()
{var elapsedTime=(new Date()).getTime()-this.startTime;var done=elapsedTime>=this.duration;var x,y;if(done)
{x=this.curX=this.dstX;y=this.curY=this.dstY;}
else
{x=this.transition(elapsedTime,this.curX,this.dstX-this.curX,this.duration);y=this.transition(elapsedTime,this.curY,this.dstY-this.curY,this.duration);}
this.element.style.left=x+"px";this.element.style.top=y+"px";if(!done)
this.timerID=setTimeout(this.intervalFunc,this.interval);else if(this.finish)
this.finish();};
// ToolsTabbedPanels.js - version 0.6 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.TabbedPanels=function(element,opts)
{this.element=this.getElement(element);this.defaultTab=0;this.tabSelectedClass="TabbedPanelsTabSelected";this.tabHoverClass="TabbedPanelsTabHover";this.tabFocusedClass="TabbedPanelsTabFocused";this.panelVisibleClass="TabbedPanelsContentVisible";this.focusElement=null;this.hasFocus=false;this.currentTabIndex=0;this.enableKeyboardNavigation=true;this.nextPanelKeyCode=Tools.Widget.TabbedPanels.KEY_RIGHT;this.previousPanelKeyCode=Tools.Widget.TabbedPanels.KEY_LEFT;Tools.Widget.TabbedPanels.setOptions(this,opts);if(typeof(this.defaultTab)=="number")
{if(this.defaultTab<0)
this.defaultTab=0;else
{var count=this.getTabbedPanelCount();if(this.defaultTab>=count)
this.defaultTab=(count>1)?(count-1):0;}
this.defaultTab=this.getTabs()[this.defaultTab];}
if(this.defaultTab)
this.defaultTab=this.getElement(this.defaultTab);this.attachBehaviors();};Tools.Widget.TabbedPanels.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.TabbedPanels.prototype.getElementChildren=function(element)
{var children=[];var child=element.firstChild;while(child)
{if(child.nodeType==1)
children.push(child);child=child.nextSibling;}
return children;};Tools.Widget.TabbedPanels.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.TabbedPanels.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.TabbedPanels.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.TabbedPanels.prototype.getTabGroup=function()
{if(this.element)
{var children=this.getElementChildren(this.element);if(children.length)
return children[0];}
return null;};Tools.Widget.TabbedPanels.prototype.getTabs=function()
{var tabs=[];var tg=this.getTabGroup();if(tg)
tabs=this.getElementChildren(tg);return tabs;};Tools.Widget.TabbedPanels.prototype.getContentPanelGroup=function()
{if(this.element)
{var children=this.getElementChildren(this.element);if(children.length>1)
return children[1];}
return null;};Tools.Widget.TabbedPanels.prototype.getContentPanels=function()
{var panels=[];var pg=this.getContentPanelGroup();if(pg)
panels=this.getElementChildren(pg);return panels;};Tools.Widget.TabbedPanels.prototype.getIndex=function(ele,arr)
{ele=this.getElement(ele);if(ele&&arr&&arr.length)
{for(var i=0;i<arr.length;i++)
{if(ele==arr[i])
return i;}}
return-1;};Tools.Widget.TabbedPanels.prototype.getTabIndex=function(ele)
{var i=this.getIndex(ele,this.getTabs());if(i<0)
i=this.getIndex(ele,this.getContentPanels());return i;};Tools.Widget.TabbedPanels.prototype.getCurrentTabIndex=function()
{return this.currentTabIndex;};Tools.Widget.TabbedPanels.prototype.getTabbedPanelCount=function(ele)
{return Math.min(this.getTabs().length,this.getContentPanels().length);};Tools.Widget.TabbedPanels.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Tools.Widget.TabbedPanels.prototype.cancelEvent=function(e)
{if(e.preventDefault)e.preventDefault();else e.returnValue=false;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true;return false;};Tools.Widget.TabbedPanels.prototype.onTabClick=function(e,tab)
{this.showPanel(tab);return this.cancelEvent(e);};Tools.Widget.TabbedPanels.prototype.onTabMouseOver=function(e,tab)
{this.addClassName(tab,this.tabHoverClass);return false;};Tools.Widget.TabbedPanels.prototype.onTabMouseOut=function(e,tab)
{this.removeClassName(tab,this.tabHoverClass);return false;};Tools.Widget.TabbedPanels.prototype.onTabFocus=function(e,tab)
{this.hasFocus=true;this.addClassName(tab,this.tabFocusedClass);return false;};Tools.Widget.TabbedPanels.prototype.onTabBlur=function(e,tab)
{this.hasFocus=false;this.removeClassName(tab,this.tabFocusedClass);return false;};Tools.Widget.TabbedPanels.KEY_UP=38;Tools.Widget.TabbedPanels.KEY_DOWN=40;Tools.Widget.TabbedPanels.KEY_LEFT=37;Tools.Widget.TabbedPanels.KEY_RIGHT=39;Tools.Widget.TabbedPanels.prototype.onTabKeyDown=function(e,tab)
{var key=e.keyCode;if(!this.hasFocus||(key!=this.previousPanelKeyCode&&key!=this.nextPanelKeyCode))
return true;var tabs=this.getTabs();for(var i=0;i<tabs.length;i++)
if(tabs[i]==tab)
{var el=false;if(key==this.previousPanelKeyCode&&i>0)
el=tabs[i-1];else if(key==this.nextPanelKeyCode&&i<tabs.length-1)
el=tabs[i+1];if(el)
{this.showPanel(el);el.focus();break;}}
return this.cancelEvent(e);};Tools.Widget.TabbedPanels.prototype.preorderTraversal=function(root,func)
{var stopTraversal=false;if(root)
{stopTraversal=func(root);if(root.hasChildNodes())
{var child=root.firstChild;while(!stopTraversal&&child)
{stopTraversal=this.preorderTraversal(child,func);try{child=child.nextSibling;}catch(e){child=null;}}}}
return stopTraversal;};Tools.Widget.TabbedPanels.prototype.addPanelEventListeners=function(tab,panel)
{var self=this;Tools.Widget.TabbedPanels.addEventListener(tab,"click",function(e){return self.onTabClick(e,tab);},false);Tools.Widget.TabbedPanels.addEventListener(tab,"mouseover",function(e){return self.onTabMouseOver(e,tab);},false);Tools.Widget.TabbedPanels.addEventListener(tab,"mouseout",function(e){return self.onTabMouseOut(e,tab);},false);if(this.enableKeyboardNavigation)
{var tabIndexEle=null;var tabAnchorEle=null;this.preorderTraversal(tab,function(node){if(node.nodeType==1)
{var tabIndexAttr=tab.attributes.getNamedItem("tabindex");if(tabIndexAttr)
{tabIndexEle=node;return true;}
if(!tabAnchorEle&&node.nodeName.toLowerCase()=="a")
tabAnchorEle=node;}
return false;});if(tabIndexEle)
this.focusElement=tabIndexEle;else if(tabAnchorEle)
this.focusElement=tabAnchorEle;if(this.focusElement)
{Tools.Widget.TabbedPanels.addEventListener(this.focusElement,"focus",function(e){return self.onTabFocus(e,tab);},false);Tools.Widget.TabbedPanels.addEventListener(this.focusElement,"blur",function(e){return self.onTabBlur(e,tab);},false);Tools.Widget.TabbedPanels.addEventListener(this.focusElement,"keydown",function(e){return self.onTabKeyDown(e,tab);},false);}}};Tools.Widget.TabbedPanels.prototype.showPanel=function(elementOrIndex)
{var tpIndex=-1;if(typeof elementOrIndex=="number")
tpIndex=elementOrIndex;else
tpIndex=this.getTabIndex(elementOrIndex);if(!tpIndex<0||tpIndex>=this.getTabbedPanelCount())
return;var tabs=this.getTabs();var panels=this.getContentPanels();var numTabbedPanels=Math.max(tabs.length,panels.length);for(var i=0;i<numTabbedPanels;i++)
{if(i!=tpIndex)
{if(tabs[i])
this.removeClassName(tabs[i],this.tabSelectedClass);if(panels[i])
{this.removeClassName(panels[i],this.panelVisibleClass);panels[i].style.display="none";}}}
this.addClassName(tabs[tpIndex],this.tabSelectedClass);this.addClassName(panels[tpIndex],this.panelVisibleClass);panels[tpIndex].style.display="block";this.currentTabIndex=tpIndex;};Tools.Widget.TabbedPanels.prototype.attachBehaviors=function(element)
{var tabs=this.getTabs();var panels=this.getContentPanels();var panelCount=this.getTabbedPanelCount();for(var i=0;i<panelCount;i++)
this.addPanelEventListeners(tabs[i],panels[i]);this.showPanel(this.defaultTab);};
// ToolsThumbViewer.js - version 0.1 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools; if (!Tools) Tools = {}; if (!Tools.Widget) Tools.Widget = {};

Tools.Widget.ThumbViewer = function(ele, options)
{
	Tools.Utils.Notifier.call(this);

	this.element = Tools.$(ele);
	this.loader = new Tools.Utils.ImageLoader();
	this.nextImageID = 0;

	this.maxDimension = 70;
	this.thumbWidth = 24;
	this.thumbHeight = 24;

	this.tnLinkSelector = "a[href]";
	this.tnImageSelector = "a[href] > img";

	this.currentImage = null;

	this.behaviorsArray = [];

	this.attachBehaviors();
	this.select(0);
};

Tools.Widget.ThumbViewer.prototype = new Tools.Utils.Notifier();
Tools.Widget.ThumbViewer.prototype.constructor = Tools.Widget.ThumbViewer;

Tools.Widget.ThumbViewer.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;
	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Tools.Widget.ThumbViewer.prototype.attachBehaviors = function()
{
	var self = this;
	if (this.element)
		this.getThumbImages().forEach(function(img){ if (img.src) self.preloadImage(img); });
};

Tools.Widget.ThumbViewer.prototype.attachHoverBehaviors = function(img)
{
	var a = Tools.Utils.getAncestor(img, "a[href]");
	if (a)
	{
		var self = this;
		Tools.Utils.addEventListener(a, "mouseover", function(e) { self.growThumbnail(img); return false; }, false);
		Tools.Utils.addEventListener(a, "mouseout", function(e) { self.shrinkThumbnail(img); return false; }, false);
		Tools.Utils.addEventListener(a, "click", function(e) { self.select(img); return false; }, false);
	}

};

Tools.Widget.ThumbViewer.prototype.preloadImage = function(img)
{
	if (this.loader && img.src)
	{
		var self = this;
		this.loader.load(img.src, function(url, loaderImage)
		{
			img.spryOrigWidth = loaderImage.width;
			img.spryOrigHeight = loaderImage.height;
			self.attachHoverBehaviors(img);
		}, 10);

		// var a = Tools.Utils.getAncestor(img, "a[href]");
		// if (a) this.loader.load(a.href);
	}
};

Tools.Widget.ThumbViewer.prototype.cancelBehavior = function(id)
{
	if (this.behaviorsArray[id])
	{
		this.behaviorsArray[id].cancel();
		this.behaviorsArray[id] = null;
	}
};

Tools.Widget.ThumbViewer.prototype.sizeAndPosition = function(img, toX, toY, toWidth, toHeight, callback)
{
	var id = img.spryID;

	this.cancelBehavior(id);
	var effectCluster = new Tools.Effect.Cluster( { finish: callback } );
	var moveEffect = new Tools.Effect.Move(img, Tools.Effect.getPosition(img), { x: toX, y: toY, units: "px" }, { duration: 400 });
	var sizeEffect = new Tools.Effect.Size(img, Tools.Effect.getDimensions(img), { width: toWidth, height: toHeight, units: "px" }, { duration: 400 });
	
	effectCluster.addParallelEffect(moveEffect);
	effectCluster.addParallelEffect(sizeEffect);
	
	//effectCluster.finish = callback;
	
	this.behaviorsArray[id] = effectCluster;
	this.behaviorsArray[id].start();
};

Tools.Widget.ThumbViewer.prototype.growThumbnail = function(img)
{
	if (!img.spryOrigWidth || !img.spryOrigHeight)
		return;

	Tools.Utils.addClassName(img, "inFocus");
	img.style.zIndex = 150;
	
	if (!img.spryID)
		img.spryID = ++this.nextImageID;

	var w = img.spryOrigWidth;
	var h = img.spryOrigHeight;

	var ratio = this.maxDimension / (w > h ? w : h);

	w *= ratio;
	h *= ratio;
	var x = (this.thumbWidth - w) / 2;
	var y = (this.thumbHeight - h) / 2;
	
	var self = this;
	this.sizeAndPosition(img, x, y, w, h, function(b){ self.behaviorsArray[img.spryID] = null; });
};

Tools.Widget.ThumbViewer.prototype.shrinkThumbnail = function(img)
{
	var self = this;
	Tools.Utils.addClassName(img, "inFocus");
	img.style.zIndex = 1;
	this.sizeAndPosition(img, 0, 0, this.thumbWidth, this.thumbHeight, function(b){self.behaviorsArray[img.spryID] = null; Tools.Utils.removeClassName(img, "inFocus");});
};

Tools.Widget.ThumbViewer.prototype.select = function(img)
{
	var imgs = this.getThumbImages();

	img = (typeof img == "number") ? imgs[img] : Tools.$(img);
	if (!img) return;

	if (this.currentImage)
		Tools.Utils.removeClassName(this.currentImage, "selectedThumbnail");
	Tools.Utils.addClassName(img, "selectedThumbnail");
	this.currentImage = img;

	var a = Tools.Utils.getAncestor(img, "a[href]");
	if (a)
	{
		this.notifyObservers("onSelect", a.href);
		if (img == imgs[0])
			this.notifyObservers("onFirstSelect", a.href);
		if (img == imgs[imgs.length - 1])
			this.notifyObservers("onLastSelect", a.href);
	}
};

Tools.Widget.ThumbViewer.prototype.previous = function()
{
	var img = this.currentImage;
	var imgs = this.getThumbImages();

	for (var i = 0; i < imgs.length; i++)
	{
		if (imgs[i] == img)
		{
			if (--i < 0) i = imgs.length - 1;
			this.select(imgs[i]);
			return;
		}
		prevImg = imgs[i];
	}
};

Tools.Widget.ThumbViewer.prototype.next = function()
{
	var img = this.currentImage;
	var imgs = this.getThumbImages();

	for (var i = 0; i < imgs.length; i++)
	{
		if (imgs[i] == img)
		{
			if (++i >= imgs.length) i = 0;
			this.select(imgs[i]);
			return;
		}
		prevImg = imgs[i];
	}
};

Tools.Widget.ThumbViewer.prototype.getThumbLinks = function()
{
	return Tools.$$(this.tnLinkSelector, this.element);
};

Tools.Widget.ThumbViewer.prototype.getThumbImages = function()
{
	return Tools.$$(this.tnImageSelector, this.element);
};

Tools.Widget.ThumbViewer.prototype.getCurrentThumbLink = function()
{
	return Tools.Utils.getAncestor(this.currentImage, "a[href]");
};

Tools.Widget.ThumbViewer.prototype.getCurrentThumbImage = function()
{
	return this.currentImage;
};

Tools.Widget.ThumbViewer.prototype.getThumbCount = function()
{
	return Tools.$$(this.tnImageSelector, this.element).length;
};
// ToolsTooltip.js - version 0.7 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;if(parseFloat(r[2])<420)
this.version=2;else
this.version=3;}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Tools.is=new Tools.Widget.BrowserSniff();Tools.Widget.Tooltip=function(tooltip_element,trigger_selector,options)
{options=Tools.Widget.Utils.firstValid(options,{});this.init(trigger_selector,tooltip_element,options);if(Tools.Widget.Tooltip.onloadDidFire)
this.attachBehaviors();Tools.Widget.Tooltip.loadQueue.push(this);};Tools.Widget.Tooltip.prototype.init=function(trigger_element,tooltip_element,options)
{var Utils=Tools.Widget.Utils;this.triggerElements=Utils.getElementsByClassName(trigger_element);this.tooltipElement=Utils.getElement(tooltip_element);options.showDelay=parseInt(Utils.firstValid(options.showDelay,0),10);options.hideDelay=parseInt(Utils.firstValid(options.hideDelay,0),10);if(typeof this.triggerElements=='undefined'||!(this.triggerElements.length>0))
{this.showError('The element(s) "'+trigger_element+'" do not exist in the page');return false;}
if(typeof this.tooltipElement=='undefined'||!this.tooltipElement)
{this.showError('The element "'+tooltip_element+'" do not exists in the page');return false;}
this.listenersAttached=false;this.hoverClass="";this.followMouse=false;this.offsetX=15;this.offsetY=15;this.closeOnTooltipLeave=false;this.useEffect=false;Utils.setOptions(this,options);this.animator=null;for(var i=0;i<this.triggerElements.length;i++)
if(!this.triggerElements[i].className)
this.triggerElements[i].className='';if(this.useEffect){switch(this.useEffect.toString().toLowerCase()){case'blind':this.useEffect='Blind';break;case'fade':this.useEffect='Fade';break;default:this.useEffect=false;}}
this.visibleTooltip=false;this.tooltipElement.offsetHeight;if(Tools.Widget.Utils.getStyleProperty(this.tooltipElement,'display')!='none')
{this.tooltipElement.style.display='none';}
if(typeof this.offsetX!='numeric')
this.offsetX=parseInt(this.offsetX,10);if(isNaN(this.offsetX))
this.offsetX=0;if(typeof this.offsetY!='numeric')
this.offsetY=parseInt(this.offsetY,10);if(isNaN(this.offsetY))
this.offsetY=0;this.tooltipElement.style.position='absolute';this.tooltipElement.style.top='0px';this.tooltipElement.style.left='0px';};Tools.Widget.Tooltip.onloadDidFire=false;Tools.Widget.Tooltip.loadQueue=[];Tools.Widget.Tooltip.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.Tooltip.processLoadQueue=function(handler)
{Tools.Widget.Tooltip.onloadDidFire=true;var q=Tools.Widget.Tooltip.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(!q[i].listenersAttached)
q[i].attachBehaviors();};Tools.Widget.Tooltip.addLoadListener(Tools.Widget.Tooltip.processLoadQueue);Tools.Widget.Tooltip.prototype.addClassName=function(ele,className)
{if(!ele||!className)
return;if(ele.className.indexOf(className)==-1)
ele.className+=(ele.className?" ":"")+className;};Tools.Widget.Tooltip.prototype.removeClassName=function(ele,className)
{if(!ele||!className)
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.Tooltip.prototype.showTooltip=function()
{if(!this.visibleTooltip)
{this.tooltipElement.style.visibility='hidden';this.tooltipElement.style.zIndex='9999';this.tooltipElement.style.display='block';}
Tools.Widget.Utils.putElementAt(this.tooltipElement,this.pos,{x:this.offsetX,y:this.offsetY},true);if(Tools.is.ie&&Tools.is.version=='6')
this.createIframeLayer(this.tooltipElement);if(!this.visibleTooltip)
{if(this.useEffect)
{if(typeof this.showEffect=='undefined')
this.showEffect=new Tools.Widget.Tooltip[this.useEffect](this.tooltipElement,{from:0,to:1});this.showEffect.start();}
else
this.tooltipElement.style.visibility='visible';}
this.visibleTooltip=true;};Tools.Widget.Tooltip.prototype.hideTooltip=function(quick)
{if(this.useEffect&&!quick)
{if(typeof this.hideEffect=='undefined')
this.hideEffect=new Tools.Widget.Tooltip[this.useEffect](this.tooltipElement,{from:1,to:0});this.hideEffect.start();}
else
{if(typeof this.showEffect!='undefined')
this.showEffect.stop();this.tooltipElement.style.display='none';}
if(Tools.is.ie&&Tools.is.version=='6')
this.removeIframeLayer(this.tooltipElement);if(this.hoverClass&&!this.hideTimer)
{for(var i=0;i<this.triggerElements.length;i++)
this.removeClassName(this.triggerElements[i],this.hoverClass);}
this.visibleTooltip=false;};Tools.Widget.Tooltip.prototype.displayTooltip=function(show){if(this.tooltipElement)
{if(this.hoverClass){for(var i=0;i<this.triggerElements.length;i++)
this.removeClassName(this.triggerElements[i],this.hoverClass);}
if(show)
{if(this.hideTimer)
{clearInterval(this.hideTimer);delete(this.hideTimer);}
if(this.hoverClass)
{if(typeof this.triggerHighlight!='undefined')
this.addClassName(this.triggerHighlight,this.hoverClass);}
var self=this;this.showTimer=setTimeout(function(){self.showTooltip()},this.showDelay);}
else
{if(this.showTimer)
{clearInterval(this.showTimer);delete(this.showTimer);}
var self=this;this.hideTimer=setTimeout(function(){self.hideTooltip();},this.hideDelay);}}
this.refreshTimeout();};Tools.Widget.Tooltip.prototype.onMouseOverTrigger=function(e)
{var target='';if(Tools.is.ie)
target=e.srcElement;else
target=e.target;var contains=Tools.Widget.Utils.contains;for(var i=0;i<this.triggerElements.length;i++)
if(contains(this.triggerElements[i],target))
{target=this.triggerElements[i];break;}
if(i==this.triggerElements.length)return;if(this.visibleTooltip&&this.triggerHighlight&&this.triggerHighlight==target)
{if(this.hideTimer)
{clearInterval(this.hideTimer);delete(this.hideTimer);}
if(this.hoverClass)
{if(typeof this.triggerHighlight!='undefined')
this.addClassName(this.triggerHighlight,this.hoverClass);}
return;}
var pos=Tools.Widget.Utils.getAbsoluteMousePosition(e);this.pos={x:pos.x+this.offsetX,y:pos.y+this.offsetY};this.triggerHighlight=target;Tools.Widget.Tooltip.closeAll();this.displayTooltip(true);};Tools.Widget.Tooltip.prototype.onMouseMoveTrigger=function(e)
{var pos=Tools.Widget.Utils.getAbsoluteMousePosition(e);this.pos={x:pos.x+this.offsetX,y:pos.y+this.offsetY};if(this.visibleTooltip)
this.showTooltip();};Tools.Widget.Tooltip.prototype.onMouseOutTrigger=function(e)
{var target='';if(Tools.is.ie)
target=e.toElement;else
target=e.relatedTarget;var contains=Tools.Widget.Utils.contains;for(var i=0;i<this.triggerElements.length;i++)
if(contains(this.triggerElements[i],target))
return;this.displayTooltip(false);};Tools.Widget.Tooltip.prototype.onMouseOutTooltip=function(e)
{var target='';if(Tools.is.ie)
target=e.toElement;else
target=e.relatedTarget;var contains=Tools.Widget.Utils.contains;if(contains(this.tooltipElement,target))
return;this.displayTooltip(false);};Tools.Widget.Tooltip.prototype.onMouseOverTooltip=function(e)
{if(this.hideTimer)
{clearInterval(this.hideTimer);delete(this.hideTimer);}
if(this.hoverClass)
{if(typeof this.triggerHighlight!='undefined')
this.addClassName(this.triggerHighlight,this.hoverClass);}};Tools.Widget.Tooltip.prototype.refreshTimeout=function()
{if(Tools.Widget.Tooltip.refreshTimeout!=null)
{clearTimeout(Tools.Widget.Tooltip.refreshTimeout);Tools.Widget.Tooltip.refreshTimeout=null;}
Tools.Widget.Tooltip.refreshTimeout=setTimeout(Tools.Widget.Tooltip.refreshAll,100);};Tools.Widget.Tooltip.prototype.destroy=function()
{for(var k in this)
{try{if(typeof this.k=='object'&&typeof this.k.destroy=='function')this.k.destroy();delete this.k;}catch(err){}}};Tools.Widget.Tooltip.prototype.checkDestroyed=function()
{if(!this.tooltipElement||this.tooltipElement.parentNode==null)
return true;return false;};Tools.Widget.Tooltip.prototype.attachBehaviors=function()
{var self=this;var ev=Tools.Widget.Utils.addEventListener;for(var i=0;i<this.triggerElements.length;i++)
{ev(this.triggerElements[i],'mouseover',function(e){self.onMouseOverTrigger(e||event);return true;},false);ev(this.triggerElements[i],'mouseout',function(e){self.onMouseOutTrigger(e||event);return true;},false);if(this.followMouse)
ev(this.triggerElements[i],'mousemove',function(e){self.onMouseMoveTrigger(e||event);return true;},false);}
if(this.closeOnTooltipLeave)
{ev(this.tooltipElement,'mouseover',function(e){self.onMouseOverTooltip(e||event);return true;},false);ev(this.tooltipElement,'mouseout',function(e){self.onMouseOutTooltip(e||event);return true;},false);}
this.listenersAttached=true;};Tools.Widget.Tooltip.prototype.createIframeLayer=function(tooltip)
{if(typeof this.iframeLayer=='undefined')
{var layer=document.createElement('iframe');layer.tabIndex='-1';layer.src='javascript:"";';layer.scrolling='no';layer.frameBorder='0';layer.className='iframeTooltip';tooltip.parentNode.appendChild(layer);this.iframeLayer=layer;}
this.iframeLayer.style.left=tooltip.offsetLeft+'px';this.iframeLayer.style.top=tooltip.offsetTop+'px';this.iframeLayer.style.width=tooltip.offsetWidth+'px';this.iframeLayer.style.height=tooltip.offsetHeight+'px';this.iframeLayer.style.display='block';};Tools.Widget.Tooltip.prototype.removeIframeLayer=function(tooltip)
{if(this.iframeLayer)
this.iframeLayer.style.display='none';};Tools.Widget.Tooltip.prototype.showError=function(msg)
{alert('Tools.Widget.Tooltip ERR: '+msg);};Tools.Widget.Tooltip.refreshAll=function()
{var q=Tools.Widget.Tooltip.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
{if(q[i].checkDestroyed())
{q[i].destroy();q.splice(i,1);i--;qlen=q.length;}}};Tools.Widget.Tooltip.closeAll=function()
{var q=Tools.Widget.Tooltip.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
{if(q[i].visibleTooltip)
q[i].hideTooltip(true);if(q[i].showTimer)
clearTimeout(q[i].showTimer);if(q[i].hideTimer)
clearTimeout(q[i].hideTimer);}};Tools.Widget.Tooltip.Animator=function(element,opts)
{this.timer=null;this.fps=60;this.duration=500;this.startTime=0;this.transition=Tools.Widget.Tooltip.Animator.defaultTransition;this.onComplete=null;if(typeof element=='undefined')return;this.element=Tools.Widget.Utils.getElement(element);Tools.Widget.Utils.setOptions(this,opts,true);this.interval=this.duration/this.fps;};Tools.Widget.Tooltip.Animator.defaultTransition=function(time,begin,finish,duration){time/=duration;return begin+((2-time)*time*finish);};Tools.Widget.Tooltip.Animator.prototype.start=function()
{var self=this;this.startTime=(new Date).getTime();this.beforeStart();this.timer=setInterval(function(){self.stepAnimation();},this.interval);};Tools.Widget.Tooltip.Animator.prototype.stop=function()
{if(this.timer)
clearTimeout(this.timer);this.timer=null;};Tools.Widget.Tooltip.Animator.prototype.stepAnimation=function(){};Tools.Widget.Tooltip.Animator.prototype.beforeStart=function(){};Tools.Widget.Tooltip.Animator.prototype.destroy=function()
{for(var k in this)
try
{delete this.k;}catch(err){}};Tools.Widget.Tooltip.Fade=function(element,opts)
{Tools.Widget.Tooltip.Animator.call(this,element,opts);if(Tools.is.ie)
this.origOpacity=this.element.style.filter;else
this.origOpacity=this.element.style.opacity;};Tools.Widget.Tooltip.Fade.prototype=new Tools.Widget.Tooltip.Animator();Tools.Widget.Tooltip.Fade.prototype.constructor=Tools.Widget.Tooltip.Fade;Tools.Widget.Tooltip.Fade.prototype.stepAnimation=function()
{var curTime=(new Date).getTime();var elapsedTime=curTime-this.startTime;var i,obj;if(elapsedTime>=this.duration)
{this.beforeStop();this.stop();return;}
var ht=this.transition(elapsedTime,this.from,this.to-this.from,this.duration);if(Tools.is.ie)
{var filter=this.element.style.filter.replace(/alpha\s*\(\s*opacity\s*=\s*[0-9\.]{1,3}\)/,'');this.element.style.filter=filter+'alpha(opacity='+parseInt(ht*100,10)+')';}
else
{this.element.style.opacity=ht;}
this.element.style.visibility='visible';this.element.style.display='block';};Tools.Widget.Tooltip.Fade.prototype.beforeStop=function()
{if(this.from>this.to)
this.element.style.display='none';if(Tools.is.mozilla)
this.element.style.filter=this.origOpacity;else
this.element.style.opacity=this.origOpacity;};Tools.Widget.Tooltip.Blind=function(element,opts)
{this.from=0;this.to=100;Tools.Widget.Tooltip.Animator.call(this,element,opts);this.element.style.visibility='hidden';this.element.style.display='block';this.origHeight=parseInt(Tools.Widget.Utils.getStyleProperty(this.element,'height'),10);if(isNaN(this.origHeight))
this.origHeight=this.element.offsetHeight;if(this.to==0)
this.from=this.origHeight;else
this.to=this.origHeight;};Tools.Widget.Tooltip.Blind.prototype=new Tools.Widget.Tooltip.Animator();Tools.Widget.Tooltip.Blind.prototype.constructor=Tools.Widget.Tooltip.Blind;Tools.Widget.Tooltip.Blind.prototype.beforeStart=function()
{this.origOverflow=Tools.Widget.Utils.getStyleProperty(this.element,'overflow');this.element.style.overflow='hidden';};Tools.Widget.Tooltip.Blind.prototype.stepAnimation=function()
{var curTime=(new Date).getTime();var elapsedTime=curTime-this.startTime;var i,obj;if(elapsedTime>=this.duration)
{this.beforeStop();this.stop();return;}
var ht=this.transition(elapsedTime,this.from,this.to-this.from,this.duration);this.element.style.height=Math.floor(ht)+'px';this.element.style.visibility='visible';this.element.style.display='block';};Tools.Widget.Tooltip.Blind.prototype.beforeStop=function()
{this.element.style.overflow=this.origOverflow;if(this.from>this.to)
this.element.style.display='none';this.element.style.height=this.origHeight+'px';};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.Utils.getElementsByClassName=function(sel)
{if(!sel.length>0)
return null;var selectors=sel.split(',');var el=[];for(var i=0;i<selectors.length;i++)
{var cs=selectors[i];var chunk=cs.split(' ');var parents=[];parents[0]=[];parents[0][0]=document.body;for(var j=0;j<chunk.length;j++)
{var tokens=Tools.Widget.Utils.getSelectorTokens(chunk[j]);for(var k=0;k<parents[j].length;k++)
{var childs=parents[j][k].getElementsByTagName('*');parents[j+1]=[];for(var l=0;l<childs.length;l++)
if(Tools.Widget.Utils.hasSelector(childs[l],tokens))
parents[j+1].push(childs[l]);}}
if(parents[j])
{for(var k=0;k<parents[j].length;k++)
el.push(parents[j][k]);}}
return el;};Tools.Widget.Utils.firstValid=function()
{var ret=null;var a=Tools.Widget.Utils.firstValid;for(var i=0;i<a.arguments.length;i++)
{if(typeof(a.arguments[i])!='undefined')
{ret=a.arguments[i];break;}}
return ret;};Tools.Widget.Utils.getSelectorTokens=function(str)
{str=str.replace(/\./g,' .');str=str.replace(/\#/g,' #');str=str.replace(/^\s+|\s+$/g,"");return str.split(' ');};Tools.Widget.Utils.hasSelector=function(el,tokens)
{for(var i=0;i<tokens.length;i++)
{switch(tokens[i].charAt(0))
{case'.':if(!el.className||el.className.indexOf(tokens[i].substr(1))==-1)return false;break;case'#':if(!el.id||el.id!=tokens[i].substr(1))return false;break;default:if(el.nodeName.toLowerCase!=tokens[i])return false;break;}}
return true;};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler);}
catch(e){}};Tools.Widget.Utils.getStyleProperty=function(element,prop)
{var value;var camelized=Tools.Widget.Utils.camelize(prop);try
{if(element.style)
value=element.style[camelized];if(!value)
{if(document.defaultView&&document.defaultView.getComputedStyle)
{var css=document.defaultView.getComputedStyle(element,null);value=css?css.getPropertyValue(prop):null;}
else if(element.currentStyle)
{value=element.currentStyle[camelized];}}}
catch(e){}
return value=='auto'?null:value;};Tools.Widget.Utils.camelize=function(str)
{if(str.indexOf('-')==-1)
return str;var oStringList=str.split('-');var isFirstEntry=true;var camelizedString='';for(var i=0;i<oStringList.length;i++)
{if(oStringList[i].length>0)
{if(isFirstEntry)
{camelizedString=oStringList[i];isFirstEntry=false;}
else
{var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1);}}}
return camelizedString;};Tools.Widget.Utils.getPixels=function(m,s)
{var v=Tools.Widget.Utils.getStyleProperty(m,s);if(v=="medium"){v=2;}else{v=parseInt(v,10);}
v=isNaN(v)?0:v;return v;};Tools.Widget.Utils.getAbsoluteMousePosition=function(ev)
{var pos={x:0,y:0};if(ev.pageX)
pos.x=ev.pageX;else if(ev.clientX)
pos.x=ev.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);if(isNaN(pos.x))pos.x=0;if(ev.pageY)
pos.y=ev.pageY;else if(ev.clientY)
pos.y=ev.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);if(isNaN(pos.y))pos.y=0;return pos;};Tools.Widget.Utils.getBorderBox=function(el,doc)
{doc=doc||document;if(typeof el=='string')
el=doc.getElementById(el);if(!el)
return false;if(el.parentNode===null||Tools.Widget.Utils.getStyleProperty(el,'display')=='none')
return false;var ret={x:0,y:0,width:0,height:0};var parent=null;var box;if(el.getBoundingClientRect){box=el.getBoundingClientRect();var scrollTop=doc.documentElement.scrollTop||doc.body.scrollTop;var scrollLeft=doc.documentElement.scrollLeft||doc.body.scrollLeft;ret.x=box.left+scrollLeft;ret.y=box.top+scrollTop;ret.width=box.right-box.left;ret.height=box.bottom-box.top;}else if(doc.getBoxObjectFor){box=doc.getBoxObjectFor(el);ret.x=box.x;ret.y=box.y;ret.width=box.width;ret.height=box.height;var btw=Tools.Widget.Utils.getPixels(el,"border-top-width");var blw=Tools.Widget.Utils.getPixels(el,"border-left-width");ret.x-=blw;ret.y-=btw;}else{ret.x=el.offsetLeft;ret.y=el.offsetTop;ret.width=el.offsetWidth;ret.height=el.offsetHeight;parent=el.offsetParent;if(parent!=el)
{while(parent)
{ret.x+=parent.offsetLeft;ret.y+=parent.offsetTop;parent=parent.offsetParent;}}
var blw=Tools.Widget.Utils.getPixels(el,"border-left-width");var btw=Tools.Widget.Utils.getPixels(el,"border-top-width");ret.x-=blw;ret.y-=btw;var ua=navigator.userAgent.toLowerCase();if(Tools.is.opera||Tools.is.safari&&Tools.Widget.Utils.getStyleProperty(el,'position')=='absolute')
ret.y-=doc.body.offsetTop;}
if(el.parentNode)
parent=el.parentNode;else
parent=null;while(parent&&parent.tagName!='BODY'&&parent.tagName!='HTML')
{ret.x-=parent.scrollLeft;ret.y-=parent.scrollTop;if(parent.parentNode)
parent=parent.parentNode;else
parent=null;}
return ret;};Tools.Widget.Utils.setBorderBox=function(el,box){var pos=Tools.Widget.Utils.getBorderBox(el,el.ownerDocument);if(pos===false)
return false;var delta={x:Tools.Widget.Utils.getPixels(el,'left'),y:Tools.Widget.Utils.getPixels(el,'top')};var new_pos={x:0,y:0,w:0,h:0};if(typeof box.x=='number'){new_pos.x=box.x-pos.x+delta.x;}
if(typeof box.y=='number'){new_pos.y=box.y-pos.y+delta.y;}
if(typeof box.x=='number'){el.style.left=new_pos.x+'px';}
if(typeof box.y=='number'){el.style.top=new_pos.y+'px';}
return true;};Tools.Widget.Utils.putElementAt=function(source,target,offset,biv)
{biv=Tools.Widget.Utils.firstValid(biv,true);var source_box=Tools.Widget.Utils.getBorderBox(source,source.ownerDocument);Tools.Widget.Utils.setBorderBox(source,target);if(biv)
Tools.Widget.Utils.bringIntoView(source);return true;};Tools.Widget.Utils.bringIntoView=function(source){var box=Tools.Widget.Utils.getBorderBox(source,source.ownerDocument);if(box===false){return false;}
var current={x:Tools.Widget.Utils.getPixels(source,'left'),y:Tools.Widget.Utils.getPixels(source,'top')};var delta={x:0,y:0};var offset_fix={x:0,y:0};var strictm=source.ownerDocument.compatMode=="CSS1Compat";var doc=(Tools.is.ie&&strictm||Tools.is.mozilla)?source.ownerDocument.documentElement:source.ownerDocument.body;offset_fix.x=Tools.Widget.Utils.getPixels(doc,'border-left-width');offset_fix.y=Tools.Widget.Utils.getPixels(doc,'border-top-width');var st=doc.scrollTop;var ch=self.innerHeight?self.innerHeight:doc.clientHeight;var t=box.y+(Tools.is.ie?-offset_fix.y:offset_fix.y);var b=box.y+box.height+(Tools.is.ie?-offset_fix.y:offset_fix.y);if(b-st>ch){delta.y=ch-(b-st);if(t+delta.y<st){delta.y=st-t;}}else if(t<st){delta.y=st-t;}
if(delta.y!=0){source.style.top=(current.y+delta.y)+'px';}
var sl=doc.scrollLeft;var cw=doc.clientWidth;var l=box.x+(Tools.is.ie?-offset_fix.x:offset_fix.x);var r=box.x+box.width+(Tools.is.ie?-offset_fix.x:offset_fix.x);if(r-sl>cw){delta.x=cw-(r-sl);if(l+delta.x<sl){delta.x=sl-l;}}else if(l<sl){delta.x=sl-l;}
if(delta.x!=0){source.style.left=(current.x+delta.x)+'px';}};Tools.Widget.Utils.contains=function(who,what){if(typeof who.contains=='object'){return what&&who&&(who==what||who.contains(what));}else{var el=what;while(el){try{if(el==who){return true;}
el=el.parentNode;}catch(a){return false;}}
return false;}};
// ToolsTSVDataSet.js - version 0.2 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

Tools.Data.TSVDataSet=function(dataSetURL,dataSetOptions)
{Tools.Data.HTTPSourceDataSet.call(this,dataSetURL,dataSetOptions);this.delimiter="\t";this.firstRowAsHeaders=true;this.columnNames=[];this.columnNames=[];Tools.Utils.setOptions(this,dataSetOptions);};Tools.Data.TSVDataSet.prototype=new Tools.Data.HTTPSourceDataSet();Tools.Data.TSVDataSet.prototype.constructor=Tools.Data.TSVDataSet;Tools.Data.TSVDataSet.prototype.getDataRefStrings=function()
{var strArr=[];if(this.url)strArr.push(this.url);return strArr;};Tools.Data.TSVDataSet.prototype.getDocument=function(){return this.doc;};Tools.Data.TSVDataSet.prototype.columnNumberToColumnName=function(colNum)
{var colName=this.columnNames[colNum];if(!colName)
colName="column"+colNum;return colName;};Tools.Data.TSVDataSet.prototype.loadDataIntoDataSet=function(rawDataDoc)
{var data=new Array();var dataHash=new Object();var s=rawDataDoc?rawDataDoc:"";var strLen=s.length;var i=0;var done=false;var firstRowAsHeaders=this.firstRowAsHeaders;var searchStartIndex=0;var regexp=/[^\r\n]+|(\r\n|\r|\n)/mg;var results=regexp.exec(s);var rowObj=null;var columnNum=-1;var rowID=0;while(results&&results[0])
{var r=results[0];if(r=="\r\n"||r=="\r"||r=="\n")
{if(!firstRowAsHeaders)
{rowObj.ds_RowID=rowID++;data.push(rowObj);dataHash[rowObj.ds_RowID]=rowObj;rowObj=null;}
firstRowAsHeaders=false;columnNum=-1;}
else
{var fields=r.split(this.delimiter);for(var i=0;i<fields.length;i++)
{if(firstRowAsHeaders)
this.columnNames[++columnNum]=fields[i];else
{if(++columnNum==0)
rowObj=new Object;rowObj[this.columnNumberToColumnName(columnNum)]=fields[i];}}}
searchStartIndex=regexp.lastIndex;results=regexp.exec(s);}
this.doc=rawDataDoc;this.data=data;this.dataHash=dataHash;this.dataWasLoaded=(this.doc!=null);};
// ToolsURLUtils.js - version 0.1 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Utils)Tools.Utils={};Tools.Utils.urlComponentToObject=function(ucStr,paramSeparator,nameValueSeparator)
{var o=new Object;if(ucStr)
{if(!paramSeparator)paramSeparator="&";if(!nameValueSeparator)nameValueSeparator="=";var params=ucStr.split(paramSeparator);for(var i=0;i<params.length;i++)
{var a=params[i].split(nameValueSeparator);var n=decodeURIComponent(a[0]?a[0]:"");var v=decodeURIComponent(a[1]?a[1]:"");if(v.match(/^0$|^[1-9]\d*$/))
v=parseInt(v);if(typeof o[n]=="undefined")
o[n]=v;else
{if(typeof o[n]!="object")
{var t=o[n];o[n]=new Array;o[n].push(t);}
o[n].push(v);}}}
return o;};Tools.Utils.getLocationHashParamsAsObject=function(paramSeparator,nameValueSeparator)
{return Tools.Utils.urlComponentToObject(window.location.hash.replace(/^#/,""),paramSeparator,nameValueSeparator);};Tools.Utils.getLocationParamsAsObject=function()
{return Tools.Utils.urlComponentToObject(window.location.search.replace(/^\?/,""));};Tools.Utils.getURLHashParamsAsObject=function(url,paramSeparator,nameValueSeparator)
{var i;if(url&&(i=url.search("#"))>=0)
return Tools.Utils.urlComponentToObject(url.substr(i+1),paramSeparator,nameValueSeparator);return new Object;};Tools.Utils.getURLParamsAsObject=function(url)
{var s;if(url&&(s=url.match(/\?[^#]*/))&&s)
return Tools.Utils.urlComponentToObject(s[0].replace(/^\?/,""));return new Object;};
// ToolsUtils.js - version 0.3 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Utils)Tools.Utils={};Tools.Utils.submitForm=function(form,callback,opts)
{if(!form)
return true;if(typeof form=='string')
form=Tools.$(form)||document.forms[form];var frmOpts={};frmOpts.method=form.getAttribute('method');frmOpts.url=form.getAttribute('action')||document.location.href;frmOpts.enctype=form.getAttribute('enctype');Tools.Utils.setOptions(frmOpts,opts);var submitData=Tools.Utils.extractParamsFromForm(form,frmOpts.elements);if(frmOpts.additionalData)
submitData+="&"+frmOpts.additionalData;if(!frmOpts.enctype||frmOpts.enctype.toLowerCase()!='multipart/form-data')
{frmOpts.method=(frmOpts.method&&frmOpts.method.toLowerCase()=="post")?'POST':'GET';if(frmOpts.method=="GET")
{if(frmOpts.url.indexOf('?')==-1)
frmOpts.url+='?';else
frmOpts.url+='&';frmOpts.url+=submitData;}
else
{if(!frmOpts.headers)frmOpts.headers={};if(!frmOpts.headers['Content-Type']||frmOpts.headers['Content-Type'].indexOf("application/x-www-form-urlencoded")==-1)
frmOpts.headers['Content-Type']='application/x-www-form-urlencoded';frmOpts.postData=submitData;}
Tools.Utils.loadURL(frmOpts.method,frmOpts.url,true,callback,frmOpts);return false;}
return true;};Tools.Utils.extractParamsFromForm=function(form,elements)
{if(!form)
return'';if(typeof form=='string')
form=document.getElementById(form)||document.forms[form];var formElements;if(elements)
formElements=','+elements.join(',')+',';var compStack=new Array();var el;for(var i=0;i<form.elements.length;i++)
{el=form.elements[i];if(el.disabled||!el.name)
{continue;}
if(!el.type)
{continue;}
if(formElements&&formElements.indexOf(','+el.name+',')==-1)
continue;switch(el.type.toLowerCase())
{case'text':case'password':case'textarea':case'hidden':case'submit':compStack.push(encodeURIComponent(el.name)+'='+encodeURIComponent(el.value));break;case'select-one':var value='';var opt;if(el.selectedIndex>=0){opt=el.options[el.selectedIndex];value=opt.value||opt.text;}
compStack.push(encodeURIComponent(el.name)+'='+encodeURIComponent(value));break;case'select-multiple':for(var j=0;j<el.length;j++)
{if(el.options[j].selected)
{value=el.options[j].value||el.options[j].text;compStack.push(encodeURIComponent(el.name)+'='+encodeURIComponent(value));}}
break;case'checkbox':case'radio':if(el.checked)
compStack.push(encodeURIComponent(el.name)+'='+encodeURIComponent(el.value));break;default:break;}}
return compStack.join('&');};
// ToolsValidationCheckbox.js - version 0.10 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.ValidationCheckbox=function(element,opts)
{this.init(element);Tools.Widget.Utils.setOptions(this,opts);var validateOn=['submit'].concat(this.validateOn||[]);validateOn=validateOn.join(",");this.validateOn=0|(validateOn.indexOf('submit')!=-1?Tools.Widget.ValidationCheckbox.ONSUBMIT:0);this.validateOn=this.validateOn|(validateOn.indexOf('blur')!=-1?Tools.Widget.ValidationCheckbox.ONBLUR:0);this.validateOn=this.validateOn|(validateOn.indexOf('change')!=-1?Tools.Widget.ValidationCheckbox.ONCHANGE:0);if(!isNaN(this.minSelections)){this.minSelections=(this.minSelections>0)?parseInt(this.minSelections,10):null;}
if(!isNaN(this.maxSelections)){this.maxSelections=(this.maxSelections>0)?parseInt(this.maxSelections,10):null;}
if(this.additionalError)
this.additionalError=this.getElement(this.additionalError);if(Tools.Widget.ValidationCheckbox.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.ValidationCheckbox.loadQueue.push(this);};Tools.Widget.ValidationCheckbox.ONCHANGE=1;Tools.Widget.ValidationCheckbox.ONBLUR=2;Tools.Widget.ValidationCheckbox.ONSUBMIT=4;Tools.Widget.ValidationCheckbox.prototype.init=function(element)
{this.element=this.getElement(element);this.checkboxElements=null;this.additionalError=false;this.form=null;this.event_handlers=[];this.hasFocus=false;this.requiredClass="checkboxRequiredState";this.minSelectionsClass="checkboxMinSelectionsState";this.maxSelectionsClass="checkboxMaxSelectionsState";this.focusClass="checkboxFocusState";this.validClass="checkboxValidState";this.isRequired=true;this.minSelections=null;this.maxSelections=null;this.validateOn=["submit"];};Tools.Widget.ValidationCheckbox.prototype.destroy=function(){if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++)
{Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
try{delete this.element;}catch(err){}
if(this.checkboxElements)
for(var i=0;i<this.checkboxElements.length;i++)
{try{delete this.checkboxElements[i];}catch(err){}}
try{delete this.checkboxElements;}catch(err){}
try{delete this.form;}catch(err){}
try{delete this.event_handlers;}catch(err){}
var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(q[i]==this){q.splice(i,1);break;}}};Tools.Widget.ValidationCheckbox.onloadDidFire=false;Tools.Widget.ValidationCheckbox.loadQueue=[];Tools.Widget.ValidationCheckbox.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.ValidationCheckbox.processLoadQueue=function(handler)
{Tools.Widget.ValidationCheckbox.onloadDidFire=true;var q=Tools.Widget.ValidationCheckbox.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.ValidationCheckbox.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.ValidationCheckbox.addLoadListener(Tools.Widget.ValidationCheckbox.processLoadQueue);Tools.Widget.ValidationCheckbox.addLoadListener(function(){Tools.Widget.Utils.addEventListener(window,"unload",Tools.Widget.Form.destroyAll,false);});Tools.Widget.ValidationCheckbox.prototype.attachBehaviors=function()
{if(!this.element)
return;if(this.element.nodeName=="INPUT"){this.checkboxElements=[this.element];}else{this.checkboxElements=this.getCheckboxes();}
if(this.checkboxElements){var self=this;this.event_handlers=[];var qlen=this.checkboxElements.length;for(var i=0;i<qlen;i++){this.event_handlers.push([this.checkboxElements[i],"focus",function(e){return self.onFocus(e);}]);this.event_handlers.push([this.checkboxElements[i],"blur",function(e){return self.onBlur(e);}]);if(this.validateOn&Tools.Widget.ValidationCheckbox.ONCHANGE){this.event_handlers.push([this.checkboxElements[i],"click",function(e){return self.onClick(e);}]);}}
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
this.form=Tools.Widget.Utils.getFirstParentWithNodeName(this.element,"FORM");if(this.form){if(!this.form.attachedSubmitHandler&&!this.form.onsubmit){this.form.onsubmit=function(e){e=e||event;return Tools.Widget.Form.onSubmit(e,e.srcElement||e.currentTarget)};this.form.attachedSubmitHandler=true;}
if(!this.form.attachedResetHandler){Tools.Widget.Utils.addEventListener(this.form,"reset",function(e){e=e||event;return Tools.Widget.Form.onReset(e,e.srcElement||e.currentTarget)},false);this.form.attachedResetHandler=true;}
Tools.Widget.Form.onSubmitWidgetQueue.push(this);}}};Tools.Widget.ValidationCheckbox.prototype.getCheckboxes=function(){var arrCheckboxes;var elements=this.element.getElementsByTagName("INPUT");if(elements.length){arrCheckboxes=[];var qlen=elements.length;for(var i=0;i<qlen;i++){if(elements[i].type=="checkbox"){arrCheckboxes.push(elements[i]);}}
return arrCheckboxes;}
return null;};Tools.Widget.ValidationCheckbox.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.ValidationCheckbox.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.ValidationCheckbox.prototype.onFocus=function(e)
{var eventCheckbox=(e.srcElement!=null)?e.srcElement:e.target;if(eventCheckbox.disabled)return;this.hasFocus=true;this.addClassName(this.element,this.focusClass);this.addClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationCheckbox.prototype.onBlur=function(e)
{var eventCheckbox=(e.srcElement!=null)?e.srcElement:e.target;if(eventCheckbox.disabled)return;this.hasFocus=false;var doValidation=false;if(this.validateOn&Tools.Widget.ValidationCheckbox.ONBLUR)
doValidation=true;if(doValidation)
this.validate();this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationCheckbox.prototype.onClick=function(e){var eventCheckbox=(e.srcElement!=null)?e.srcElement:e.target;if(eventCheckbox.disabled)return;this.validate();};Tools.Widget.ValidationCheckbox.prototype.reset=function(){this.removeClassName(this.element,this.validClass);this.removeClassName(this.element,this.requiredClass);this.removeClassName(this.element,this.minSelectionsClass);this.removeClassName(this.element,this.maxSelectionsClass);this.removeClassName(this.additionalError,this.validClass);this.removeClassName(this.additionalError,this.requiredClass);this.removeClassName(this.additionalError,this.minSelectionsClass);this.removeClassName(this.additionalError,this.maxSelectionsClass);};Tools.Widget.ValidationCheckbox.prototype.validate=function(){this.reset();var nochecked=0;if(this.checkboxElements){var qlen=this.checkboxElements.length;for(var i=0;i<qlen;i++){if(!this.checkboxElements[i].disabled&&this.checkboxElements[i].checked){nochecked++;}}}
if(this.isRequired){if(nochecked==0){this.addClassName(this.element,this.requiredClass);this.addClassName(this.additionalError,this.requiredClass);return false;}}
if(this.minSelections){if(this.minSelections>nochecked){this.addClassName(this.element,this.minSelectionsClass);this.addClassName(this.additionalError,this.minSelectionsClass);return false;}}
if(this.maxSelections){if(this.maxSelections<nochecked){this.addClassName(this.element,this.maxSelectionsClass);this.addClassName(this.additionalError,this.maxSelectionsClass);return false;}}
this.addClassName(this.element,this.validClass);this.addClassName(this.additionalError,this.validClass);return true;};Tools.Widget.ValidationCheckbox.prototype.isDisabled=function(){var ret=true;if(this.checkboxElements){var qlen=this.checkboxElements.length;for(var i=0;i<qlen;i++){if(!this.checkboxElements[i].disabled){ret=false;break;}}}
return ret;};if(!Tools.Widget.Form)Tools.Widget.Form={};if(!Tools.Widget.Form.onSubmitWidgetQueue)Tools.Widget.Form.onSubmitWidgetQueue=[];if(!Tools.Widget.Form.validate){Tools.Widget.Form.validate=function(vform){var isValid=true;var isElementValid=true;var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform){isElementValid=q[i].validate();isValid=isElementValid&&isValid;}}
return isValid;}};if(!Tools.Widget.Form.onSubmit){Tools.Widget.Form.onSubmit=function(e,form)
{if(Tools.Widget.Form.validate(form)==false){return false;}
return true;};};if(!Tools.Widget.Form.onReset){Tools.Widget.Form.onReset=function(e,vform)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform&&typeof(q[i].reset)=='function'){q[i].reset();}}
return true;};};if(!Tools.Widget.Form.destroy){Tools.Widget.Form.destroy=function(form)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(q[i].form==form&&typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Form.destroyAll){Tools.Widget.Form.destroyAll=function()
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.getFirstParentWithNodeName=function(node,nodeName)
{while(node.parentNode&&node.parentNode.nodeName.toLowerCase()!=nodeName.toLowerCase()&&node.parentNode.nodeName!='BODY'){node=node.parentNode;}
if(node.parentNode&&node.parentNode.nodeName.toLowerCase()==nodeName.toLowerCase()){return node.parentNode;}else{return null;}};Tools.Widget.Utils.destroyWidgets=function(container)
{if(typeof container=='string'){container=document.getElementById(container);}
var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'&&Tools.Widget.Utils.contains(container,q[i].element)){q[i].destroy();i--;}}};Tools.Widget.Utils.contains=function(who,what)
{if(typeof who.contains=='object'){return what&&who&&(who==what||who.contains(what));}else{var el=what;while(el){if(el==who){return true;}
el=el.parentNode;}
return false;}};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}
catch(e){}};
// ToolsValidationConfirm.js - version 0.3 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;this.version=parseFloat(r[2]);}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Tools.is=new Tools.Widget.BrowserSniff();Tools.Widget.ValidationConfirm=function(element,firstInput,options)
{options=Tools.Widget.Utils.firstValid(options,{});if(!this.isBrowserSupported())
return;if(this.init(element,firstInput,options)===false)
return false;var validateOn=['submit'].concat(Tools.Widget.Utils.firstValid(this.options.validateOn,[]));validateOn=validateOn.join(",");this.validateOn=0;this.validateOn=this.validateOn|(validateOn.indexOf('submit')!=-1?Tools.Widget.ValidationConfirm.ONSUBMIT:0);this.validateOn=this.validateOn|(validateOn.indexOf('blur')!=-1?Tools.Widget.ValidationConfirm.ONBLUR:0);this.validateOn=this.validateOn|(validateOn.indexOf('change')!=-1?Tools.Widget.ValidationConfirm.ONCHANGE:0);if(Tools.Widget.ValidationConfirm.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.ValidationConfirm.loadQueue.push(this);};Tools.Widget.ValidationConfirm.ONCHANGE=1;Tools.Widget.ValidationConfirm.ONBLUR=2;Tools.Widget.ValidationConfirm.ONSUBMIT=4;Tools.Widget.ValidationConfirm.prototype.init=function(element,firstInput,options)
{options=Tools.Widget.Utils.firstValid(options,[]);this.options=[];this.element=this.getElement(element);if(!this.element)
{this.showError('The element '+(!element||element==''?'to be validated is not defined!':(element+' doesn\'t exists!')));return false;}
else
{if(this.element.nodeName.toUpperCase()=='INPUT'&&(typeof this.element.type=='undefined'||',RADIO,CHECKBOX,BUTTON,SUBMIT,IMAGE,'.indexOf(','+this.element.type.toUpperCase+',')==-1))
{this.input=this.element;}
else
{this.input=Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.element,'INPUT');}}
if(!this.input)
{this.showError('Element '+element+' doesn\'t contain any form input!');return false;}
var elm=this.getElement(firstInput);this.firstInput=false;if(!elm)
{this.showError('The element '+(!firstInput||firstInput==''?'that contains the value to be validated is not defined!':(firstInput+' doesn\'t exists!')));return false;}
if(elm.nodeName.toUpperCase()!='INPUT')
{this.firstInput=Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(elm,'INPUT');}
else if(typeof elm.type=='undefined'||',RADIO,CHECKBOX,BUTTON,SUBMIT,IMAGE,'.indexOf(','+elm.type.toUpperCase()+',')==-1)
{this.firstInput=elm;}
if(!this.firstInput)
{this.showError('Element '+firstInput+' doesn\'t contain any form input!');return false;}
this.event_handlers=[];this.validClass="confirmValidState";this.focusClass="confirmFocusState";this.requiredClass="confirmRequiredState";this.invalidClass="confirmInvalidState";options.isRequired=Tools.Widget.Utils.firstValid(options.isRequired,true);options.additionalError=Tools.Widget.Utils.firstValid(options.additionalError,false);if(options.additionalError)
options.additionalError=this.getElement(options.additionalError);Tools.Widget.Utils.setOptions(this,options);Tools.Widget.Utils.setOptions(this.options,options);};Tools.Widget.ValidationConfirm.loadQueue=[];Tools.Widget.ValidationConfirm.onloadDidFire=false;Tools.Widget.ValidationConfirm.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
ele=document.getElementById(ele);return ele;};Tools.Widget.ValidationConfirm.processLoadQueue=function(handler)
{Tools.Widget.ValidationConfirm.onloadDidFire=true;var q=Tools.Widget.ValidationConfirm.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.ValidationConfirm.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.ValidationConfirm.addLoadListener(Tools.Widget.ValidationConfirm.processLoadQueue);Tools.Widget.ValidationConfirm.prototype.destroy=function()
{if(this.event_handlers){for(var i=0;i<this.event_handlers.length;i++)
Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
try{delete this.element;}catch(err){};try{delete this.input;}catch(err){};try{delete this.event_handlers;}catch(err){};try{delete this.options;}catch(err){};var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(q[i]==this)
{q.splice(i,1);break;}};Tools.Widget.ValidationConfirm.prototype.attachBehaviors=function()
{if(this.event_handlers&&this.event_handlers.length>0)
return;var handlers=this.event_handlers;if(this.input)
{var self=this;this.input.setAttribute("AutoComplete","off");if(this.validateOn&Tools.Widget.ValidationConfirm.ONCHANGE)
{var changeEvent=Tools.is.mozilla||Tools.is.opera||Tools.is.safari?"input":Tools.is.ie?"propertychange":"change";handlers.push([this.input,changeEvent,function(e){if(self.isDisabled())return true;return self.validate(e||event);}]);if(Tools.is.mozilla||Tools.is.safari)
handlers.push([this.input,"dragdrop",function(e){if(self.isDisabled())return true;return self.validate(e);}]);else if(Tools.is.ie)
handlers.push([this.input,"drop",function(e){if(self.isDisabled())return true;return self.validate(event);}]);}
handlers.push([this.input,"blur",function(e){if(self.isDisabled())return true;return self.onBlur(e||event);}]);handlers.push([this.input,"focus",function(e){if(self.isDisabled())return true;return self.onFocus(e||event);}]);for(var i=0;i<this.event_handlers.length;i++)
Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);this.form=Tools.Widget.Utils.getFirstParentWithNodeName(this.input,"FORM");if(this.form)
{if(!this.form.attachedSubmitHandler&&!this.form.onsubmit)
{this.form.onsubmit=function(e){e=e||event;return Tools.Widget.Form.onSubmit(e,e.srcElement||e.currentTarget)};this.form.attachedSubmitHandler=true;}
if(!this.form.attachedResetHandler)
{Tools.Widget.Utils.addEventListener(this.form,"reset",function(e){var e=e||event;return Tools.Widget.Form.onReset(e,e.srcElement||e.currentTarget)},false);this.form.attachedResetHandler=true;}
Tools.Widget.Form.onSubmitWidgetQueue.push(this);}}};Tools.Widget.ValidationConfirm.prototype.reset=function()
{this.switchClassName(this.element,'');this.switchClassName(this.additionalError,'');this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);if(Tools.is.ie)
{this.input.forceFireFirstOnPropertyChange=true;this.input.removeAttribute("forceFireFirstOnPropertyChange");}};Tools.Widget.ValidationConfirm.prototype.validate=function(e)
{if(this.isRequired&&this.input.value=='')
{this.switchClassName(this.element,this.requiredClass);this.switchClassName(this.additionalError,this.requiredClass);return false;}
if(this.input.value.length>0&&this.input.value!=this.firstInput.value)
{this.switchClassName(this.element,this.invalidClass);this.switchClassName(this.additionalError,this.invalidClass);return false;}
this.switchClassName(this.element,this.validClass);this.switchClassName(this.additionalError,this.validClass);return true;};Tools.Widget.ValidationConfirm.prototype.onBlur=function(e)
{this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);if(this.validateOn&Tools.Widget.ValidationConfirm.ONBLUR)
this.validate(e);};Tools.Widget.ValidationConfirm.prototype.onFocus=function()
{this.addClassName(this.element,this.focusClass);this.addClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationConfirm.prototype.switchClassName=function(ele,className)
{var classes=[this.validClass,this.requiredClass,this.invalidClass];for(var i=0;i<classes.length;i++)
this.removeClassName(ele,classes[i]);this.addClassName(ele,className);};Tools.Widget.ValidationConfirm.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.indexOf(className)!=-1&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.ValidationConfirm.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.indexOf(className)!=-1&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.ValidationConfirm.prototype.isBrowserSupported=function()
{return Tools.is.ie&&Tools.is.v>=5&&Tools.is.windows||Tools.is.mozilla&&Tools.is.v>=1.4||Tools.is.safari||Tools.is.opera&&Tools.is.v>=9;};Tools.Widget.ValidationConfirm.prototype.isDisabled=function()
{return this.input&&(this.input.disabled||this.input.readOnly)||!this.input;};Tools.Widget.ValidationConfirm.prototype.showError=function(msg)
{alert('Tools.ValidationConfirm ERR: '+msg);};if(!Tools.Widget.Form)Tools.Widget.Form={};if(!Tools.Widget.Form.onSubmitWidgetQueue)Tools.Widget.Form.onSubmitWidgetQueue=[];if(!Tools.Widget.Form.validate)
{Tools.Widget.Form.validate=function(vform)
{var isValid=true;var isElementValid=true;var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(!q[i].isDisabled()&&q[i].form==vform)
{isElementValid=q[i].validate();isValid=isElementValid&&isValid;}
return isValid;};};if(!Tools.Widget.Form.onSubmit)
{Tools.Widget.Form.onSubmit=function(e,form)
{if(Tools.Widget.Form.validate(form)==false)
return false;return true;};};if(!Tools.Widget.Form.onReset)
{Tools.Widget.Form.onReset=function(e,vform)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(!q[i].isDisabled()&&q[i].form==vform&&typeof(q[i].reset)=='function')
q[i].reset();return true;};};if(!Tools.Widget.Form.destroy)
{Tools.Widget.Form.destroy=function(form)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++)
if(q[i].form==form&&typeof(q[i].destroy)=='function')
{q[i].destroy();i--;}}};if(!Tools.Widget.Form.destroyAll)
{Tools.Widget.Form.destroyAll=function()
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++)
if(typeof(q[i].destroy)=='function')
{q[i].destroy();i--;}}};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.firstValid=function()
{var ret=null;for(var i=0;i<Tools.Widget.Utils.firstValid.arguments.length;i++)
if(typeof Tools.Widget.Utils.firstValid.arguments[i]!='undefined')
{ret=Tools.Widget.Utils.firstValid.arguments[i];break;}
return ret;};Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel=function(node,nodeName)
{var elements=node.getElementsByTagName(nodeName);if(elements){return elements[0];}
return null;};Tools.Widget.Utils.getFirstParentWithNodeName=function(node,nodeName)
{while(node.parentNode&&node.parentNode.nodeName.toLowerCase()!=nodeName.toLowerCase()&&node.parentNode.nodeName!='BODY')
node=node.parentNode;if(node.parentNode&&node.parentNode.nodeName.toLowerCase()==nodeName.toLowerCase())
return node.parentNode;else
return null;};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}
catch(e){}};
// ToolsValidationPassword.js - version 0.3 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;this.version=parseFloat(r[2]);}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Tools.is=new Tools.Widget.BrowserSniff();Tools.Widget.ValidationPassword=function(element,options)
{options=Tools.Widget.Utils.firstValid(options,{});if(!this.isBrowserSupported())
return;if(this.init(element,options)===false)
return false;var validateOn=['submit'].concat(Tools.Widget.Utils.firstValid(this.options.validateOn,[]));validateOn=validateOn.join(",");this.validateOn=0;this.validateOn=this.validateOn|(validateOn.indexOf('submit')!=-1?Tools.Widget.ValidationPassword.ONSUBMIT:0);this.validateOn=this.validateOn|(validateOn.indexOf('blur')!=-1?Tools.Widget.ValidationPassword.ONBLUR:0);this.validateOn=this.validateOn|(validateOn.indexOf('change')!=-1?Tools.Widget.ValidationPassword.ONCHANGE:0);if(Tools.Widget.ValidationPassword.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.ValidationPassword.loadQueue.push(this);};Tools.Widget.ValidationPassword.ONCHANGE=1;Tools.Widget.ValidationPassword.ONBLUR=2;Tools.Widget.ValidationPassword.ONSUBMIT=4;Tools.Widget.ValidationPassword.prototype.init=function(element,options)
{options=Tools.Widget.Utils.firstValid(options,[]);this.options=[];this.element=this.getElement(element);if(!this.element)
{return false;}
else
{if(this.element.nodeName.toUpperCase()=='INPUT'&&typeof this.element.type!='undefined'&&this.element.type.toUpperCase()=='PASSWORD')
{this.input=this.element;}
else
{var inputs=Tools.Widget.Utils.getValidChildrenWithNodeNameAtAnyLevel(this.element,'INPUT','PASSWORD');if(inputs&&inputs.length>0)
this.input=inputs[0];else
this.input=false;}}
if(!this.input)
return false;this.event_handlers=[];this.validClass="passwordValidState";this.focusClass="passwordFocusState";this.requiredClass="passwordRequiredState";this.invalidStrengthClass="passwordInvalidStrengthState";this.invalidCharsMinClass="passwordMinCharsState";this.invalidCharsMaxClass="passwordMaxCharsState";this.invalidCustomClass="passwordCustomState";options.isRequired=Tools.Widget.Utils.firstValid(options.isRequired,true);options.additionalError=Tools.Widget.Utils.firstValid(options.additionalError,false);if(options.additionalError)
options.additionalError=this.getElement(options.additionalError);var getRealValue=Tools.Widget.Utils.getOptionRealValue;options.minChars=getRealValue(options.minChars,false);options.maxChars=getRealValue(options.maxChars,false);if(options.maxChars)
this.input.removeAttribute("maxLength");options.minAlphaChars=getRealValue(options.minAlphaChars,false);options.maxAlphaChars=getRealValue(options.maxAlphaChars,false);options.minUpperAlphaChars=getRealValue(options.minUpperAlphaChars,false);options.maxUpperAlphaChars=getRealValue(options.maxUpperAlphaChars,false);options.minSpecialChars=getRealValue(options.minSpecialChars,false);options.maxSpecialChars=getRealValue(options.maxSpecialChars,false);options.minNumbers=getRealValue(options.minNumbers,false);options.maxNumbers=getRealValue(options.maxNumbers,false);if((options.minAlphaChars!==false&&options.maxAlphaChars!==false&&options.minAlphaChars>options.maxAlphaChars)||(options.minUpperAlphaChars!==false&&options.maxUpperAlphaChars!==false&&options.minUpperAlphaChars>options.maxUpperAlphaChars)||(options.minSpecialChars!==false&&options.maxSpecialChars!==false&&options.minSpecialChars>options.maxSpecialChars)||(options.minNumbers!==false&&options.maxNumbers!==false&&options.minNumbers>options.maxNumbers)||(options.maxUpperAlphaChars!==false&&options.maxAlphaChars!==false&&options.maxUpperAlphaChars>options.maxAlphaChars)||(options.maxChars!==false&&options.minAlphaChars+options.minUpperAlphaChars+options.minSpecialChars+options.minNumbers>options.maxChars))
{this.showError('Invalid Strength Options!');return false;}
Tools.Widget.Utils.setOptions(this,options);Tools.Widget.Utils.setOptions(this.options,options);};Tools.Widget.ValidationPassword.loadQueue=[];Tools.Widget.ValidationPassword.onloadDidFire=false;Tools.Widget.ValidationPassword.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
ele=document.getElementById(ele);return ele;};Tools.Widget.ValidationPassword.processLoadQueue=function(handler)
{Tools.Widget.ValidationPassword.onloadDidFire=true;var q=Tools.Widget.ValidationPassword.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.ValidationPassword.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.ValidationPassword.addLoadListener(Tools.Widget.ValidationPassword.processLoadQueue);Tools.Widget.ValidationPassword.prototype.destroy=function()
{if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++)
Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);try{delete this.element;}catch(err){};try{delete this.input;}catch(err){};try{delete this.event_handlers;}catch(err){};try{delete this.options;}catch(err){};var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(q[i]==this)
{q.splice(i,1);break;}};Tools.Widget.ValidationPassword.prototype.attachBehaviors=function()
{if(this.event_handlers&&this.event_handlers.length>0)
return;var handlers=this.event_handlers;if(this.input)
{var self=this;this.input.setAttribute("AutoComplete","off");if(this.validateOn&Tools.Widget.ValidationPassword.ONCHANGE)
{var changeEvent=Tools.is.mozilla||Tools.is.opera||Tools.is.safari?"input":Tools.is.ie?"propertychange":"change";handlers.push([this.input,changeEvent,function(e){if(self.isDisabled())return true;return self.validate(e||event);}]);if(Tools.is.mozilla||Tools.is.safari)
handlers.push([this.input,"dragdrop",function(e){if(self.isDisabled())return true;return self.validate(e);}]);else if(Tools.is.ie)
handlers.push([this.input,"drop",function(e){if(self.isDisabled())return true;return self.validate(event);}]);}
handlers.push([this.input,"blur",function(e){if(self.isDisabled())return true;return self.onBlur(e||event);}]);handlers.push([this.input,"focus",function(e){if(self.isDisabled())return true;return self.onFocus(e||event);}]);for(var i=0;i<this.event_handlers.length;i++)
Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);this.form=Tools.Widget.Utils.getFirstParentWithNodeName(this.input,"FORM");if(this.form)
{if(!this.form.attachedSubmitHandler&&!this.form.onsubmit)
{this.form.onsubmit=function(e){e=e||event;return Tools.Widget.Form.onSubmit(e,e.srcElement||e.currentTarget)};this.form.attachedSubmitHandler=true;}
if(!this.form.attachedResetHandler)
{Tools.Widget.Utils.addEventListener(this.form,"reset",function(e){var e=e||event;return Tools.Widget.Form.onReset(e,e.srcElement||e.currentTarget)},false);this.form.attachedResetHandler=true;}
Tools.Widget.Form.onSubmitWidgetQueue.push(this);}}};Tools.Widget.ValidationPassword.prototype.reset=function()
{this.switchClassName(this.element,'');this.switchClassName(this.additionalError,'');this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);if(Tools.is.ie)
{this.input.forceFireFirstOnPropertyChange=true;this.input.removeAttribute("forceFireFirstOnPropertyChange");}};Tools.Widget.ValidationPassword.prototype.validateLength=function(e)
{var opt=this.options;if(this.isRequired&&this.input.value=='')
return this.requiredClass;if(opt.minChars>0&&this.input.value.length<opt.minChars)
return this.invalidCharsMinClass;if(opt.maxChars!==false&&this.input.value.length>opt.maxChars)
return this.invalidCharsMaxClass;return true;};Tools.Widget.ValidationPassword.prototype.validateStrength=function(e)
{var opt=this.options;var value=this.input.value;if(opt.minAlphaChars!==false||opt.maxAlphaChars!==false)
{var alphaChars=value.replace(/[^a-z]/ig,'').length;if((opt.maxAlphaChars!==false&&alphaChars>opt.maxAlphaChars)||(opt.minAlphaChars!==false&&alphaChars<opt.minAlphaChars))
return false;}
if(opt.minUpperAlphaChars!==false||opt.maxUpperAlphaChars!==false)
{var upperAlphaChars=value.replace(/[^A-Z]/g,'').length;if((opt.maxUpperAlphaChars!==false&&upperAlphaChars>opt.maxUpperAlphaChars)||(opt.minUpperAlphaChars!==false&&upperAlphaChars<opt.minUpperAlphaChars))
return false;}
if(opt.minNumbers!==false||opt.maxNumbers!==false)
{var numbers=value.replace(/[^0-9]/g,'').length;if((opt.maxNumbers!==false&&numbers>opt.maxNumbers)||(opt.minNumbers!==false&&numbers<opt.minNumbers))
return false;}
if(opt.minSpecialChars!==false||opt.maxSpecialChars!==false)
{var specials=value.replace(/[a-z0-9]/ig,'').length;if((opt.maxSpecialChars!==false&&specials>opt.maxSpecialChars)||(opt.minSpecialChars!==false&&specials<opt.minSpecialChars))
return false;}
return true;};Tools.Widget.ValidationPassword.prototype.validate=function(e)
{var vLength=this.validateLength(e);if(vLength!==true)
{this.switchClassName(this.element,vLength);this.switchClassName(this.additionalError,vLength);return false;}
var vStrength=this.validateStrength(e);if(vStrength!==true)
{this.switchClassName(this.element,this.invalidStrengthClass);this.switchClassName(this.additionalError,this.invalidStrengthClass);return false;}
if(typeof this.options.validation=='function')
{var customValidation=this.options.validation(this.input.value,this.options);if(customValidation!==true)
{this.switchClassName(this.element,this.invalidCustomClass);return false;}}
this.switchClassName(this.element,this.validClass);this.switchClassName(this.additionalError,this.validClass);return true;};Tools.Widget.ValidationPassword.prototype.onBlur=function(e)
{this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);if(this.validateOn&Tools.Widget.ValidationPassword.ONBLUR)
this.validate(e);};Tools.Widget.ValidationPassword.prototype.onFocus=function()
{this.addClassName(this.element,this.focusClass);this.addClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationPassword.prototype.switchClassName=function(ele,className)
{var classes=[this.validClass,this.requiredClass,this.invalidCharsMaxClass,this.invalidCharsMinClass,this.invalidStrengthClass,this.invalidCustomClass];for(var i=0;i<classes.length;i++)
this.removeClassName(ele,classes[i]);this.addClassName(ele,className);};Tools.Widget.ValidationPassword.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.indexOf(className)!=-1&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.ValidationPassword.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.indexOf(className)!=-1&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.ValidationPassword.prototype.isBrowserSupported=function()
{return Tools.is.ie&&Tools.is.v>=5&&Tools.is.windows||Tools.is.mozilla&&Tools.is.v>=1.4||Tools.is.safari||Tools.is.opera&&Tools.is.v>=9;};Tools.Widget.ValidationPassword.prototype.isDisabled=function()
{return this.input&&(this.input.disabled||this.input.readOnly)||!this.input;};Tools.Widget.ValidationPassword.prototype.showError=function(msg)
{alert('Tools.ValidationPassword ERR: '+msg);};if(!Tools.Widget.Form)Tools.Widget.Form={};if(!Tools.Widget.Form.onSubmitWidgetQueue)Tools.Widget.Form.onSubmitWidgetQueue=[];if(!Tools.Widget.Form.validate)
{Tools.Widget.Form.validate=function(vform)
{var isValid=true;var isElementValid=true;var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(!q[i].isDisabled()&&q[i].form==vform)
{isElementValid=q[i].validate();isValid=isElementValid&&isValid;}
return isValid;};};if(!Tools.Widget.Form.onSubmit)
{Tools.Widget.Form.onSubmit=function(e,form)
{if(Tools.Widget.Form.validate(form)==false)
return false;return true;};};if(!Tools.Widget.Form.onReset)
{Tools.Widget.Form.onReset=function(e,vform)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
if(!q[i].isDisabled()&&q[i].form==vform&&typeof(q[i].reset)=='function')
q[i].reset();return true;};};if(!Tools.Widget.Form.destroy)
{Tools.Widget.Form.destroy=function(form)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++)
if(q[i].form==form&&typeof(q[i].destroy)=='function')
{q[i].destroy();i--;}}};if(!Tools.Widget.Form.destroyAll)
{Tools.Widget.Form.destroyAll=function()
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++)
if(typeof(q[i].destroy)=='function')
{q[i].destroy();i--;}}};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.firstValid=function()
{var ret=null;for(var i=0;i<Tools.Widget.Utils.firstValid.arguments.length;i++)
if(typeof Tools.Widget.Utils.firstValid.arguments[i]!='undefined')
{ret=Tools.Widget.Utils.firstValid.arguments[i];break;}
return ret;};Tools.Widget.Utils.getOptionRealValue=function(option,alternate)
{var value=Tools.Widget.Utils.firstValid(option,alternate);if(value!==false)
value=parseInt(value,10);if(isNaN(value)||value<0)
value=false;return value;};Tools.Widget.Utils.getValidChildrenWithNodeNameAtAnyLevel=function(node,nodeName,type)
{var elements=node.getElementsByTagName(nodeName);var to_return=[];var j=0;if(elements)
{for(var i=0;i<elements.length;i++)
if(typeof elements[i].type!='undefined'&&elements[i].type.toUpperCase()==type.toUpperCase())
{to_return[j]=elements[i];j++;}}
return to_return;};Tools.Widget.Utils.getFirstParentWithNodeName=function(node,nodeName)
{while(node.parentNode&&node.parentNode.nodeName.toLowerCase()!=nodeName.toLowerCase()&&node.parentNode.nodeName!='BODY')
node=node.parentNode;if(node.parentNode&&node.parentNode.nodeName.toLowerCase()==nodeName.toLowerCase())
return node.parentNode;else
return null;};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}
catch(e){}};
// ToolsValidationRadio.js - version 0.1 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.ValidationRadio=function(element,opts)
{this.init(element);Tools.Widget.Utils.setOptions(this,opts);var validateOn=['submit'].concat(this.validateOn||[]);validateOn=validateOn.join(",");this.validateOn=0|(validateOn.indexOf('submit')!=-1?Tools.Widget.ValidationRadio.ONSUBMIT:0);this.validateOn=this.validateOn|(validateOn.indexOf('blur')!=-1?Tools.Widget.ValidationRadio.ONBLUR:0);this.validateOn=this.validateOn|(validateOn.indexOf('change')!=-1?Tools.Widget.ValidationRadio.ONCHANGE:0);if(this.additionalError)
this.additionalError=this.getElement(this.additionalError);if(Tools.Widget.ValidationRadio.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.ValidationRadio.loadQueue.push(this);};Tools.Widget.ValidationRadio.ONCHANGE=1;Tools.Widget.ValidationRadio.ONBLUR=2;Tools.Widget.ValidationRadio.ONSUBMIT=4;Tools.Widget.ValidationRadio.prototype.init=function(element)
{this.element=this.getElement(element);this.additionalError=false;this.radioElements=null;this.form=null;this.event_handlers=[];this.requiredClass="radioRequiredState";this.focusClass="radioFocusState";this.invalidClass="radioInvalidState";this.validClass="radioValidState";this.emptyValue="";this.invalidValue=null;this.isRequired=true;this.validateOn=["submit"];};Tools.Widget.ValidationRadio.onloadDidFire=false;Tools.Widget.ValidationRadio.loadQueue=[];Tools.Widget.ValidationRadio.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.ValidationRadio.processLoadQueue=function(handler)
{Tools.Widget.ValidationRadio.onloadDidFire=true;var q=Tools.Widget.ValidationRadio.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.ValidationRadio.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.ValidationRadio.addLoadListener(Tools.Widget.ValidationRadio.processLoadQueue);Tools.Widget.ValidationRadio.addLoadListener(function(){Tools.Widget.Utils.addEventListener(window,"unload",Tools.Widget.Form.destroyAll,false);});Tools.Widget.ValidationRadio.prototype.attachBehaviors=function()
{if(!this.element)
return;if(this.element.nodeName=="INPUT"){this.radioElements=[this.element];}else{this.radioElements=this.getRadios();}
if(this.radioElements){var self=this;this.event_handlers=[];var qlen=this.radioElements.length;for(var i=0;i<qlen;i++){this.event_handlers.push([this.radioElements[i],"focus",function(e){return self.onFocus(e);}]);this.event_handlers.push([this.radioElements[i],"blur",function(e){return self.onBlur(e);}]);if(this.validateOn&Tools.Widget.ValidationRadio.ONCHANGE){this.event_handlers.push([this.radioElements[i],"click",function(e){return self.onClick(e);}]);}}
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
this.form=Tools.Widget.Utils.getFirstParentWithNodeName(this.element,"FORM");if(this.form){if(!this.form.attachedSubmitHandler&&!this.form.onsubmit){this.form.onsubmit=function(e){e=e||event;return Tools.Widget.Form.onSubmit(e,e.srcElement||e.currentTarget)};this.form.attachedSubmitHandler=true;}
if(!this.form.attachedResetHandler){Tools.Widget.Utils.addEventListener(this.form,"reset",function(e){e=e||event;return Tools.Widget.Form.onReset(e,e.srcElement||e.currentTarget)},false);this.form.attachedResetHandler=true;}
Tools.Widget.Form.onSubmitWidgetQueue.push(this);}}};Tools.Widget.ValidationRadio.prototype.getRadios=function()
{var arrRadios;var elements=this.element.getElementsByTagName("INPUT");if(elements.length){arrRadios=[];var qlen=elements.length;for(var i=0;i<qlen;i++)
{if(elements[i].getAttribute('type').toLowerCase()=="radio")
arrRadios.push(elements[i]);}
return arrRadios;}
return null;};Tools.Widget.ValidationRadio.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.ValidationRadio.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.ValidationRadio.prototype.onFocus=function(e)
{var eventRadio=(e.srcElement!=null)?e.srcElement:e.target;if(eventRadio.disabled)return;this.addClassName(this.element,this.focusClass);this.addClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationRadio.prototype.onBlur=function(e)
{var eventRadio=(e.srcElement!=null)?e.srcElement:e.target;if(eventRadio.disabled)return;var doValidation=false;if(this.validateOn&Tools.Widget.ValidationRadio.ONBLUR)
doValidation=true;if(doValidation)
this.validate();this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationRadio.prototype.onClick=function(e){var eventRadio=(e.srcElement!=null)?e.srcElement:e.target;if(eventRadio.disabled)return;this.validate();};Tools.Widget.ValidationRadio.prototype.reset=function()
{this.removeClassName(this.element,this.validClass);this.removeClassName(this.element,this.requiredClass);this.removeClassName(this.element,this.invalidClass);this.removeClassName(this.additionalError,this.validClass);this.removeClassName(this.additionalError,this.requiredClass);this.removeClassName(this.additionalError,this.invalidClass);};Tools.Widget.ValidationRadio.prototype.validate=function()
{this.reset();var nochecked=0;var invalid=0;var required=0;if(this.radioElements)
{var qlen=this.radioElements.length;for(var i=0;i<qlen;i++)
{if(!this.radioElements[i].disabled&&this.radioElements[i].checked)
{if(this.radioElements[i].value==this.emptyValue){required++;}else if(this.invalidValue&&this.radioElements[i].value==this.invalidValue){invalid++;}else{nochecked++;}}}}
if(this.invalidValue&&invalid!=0)
{this.addClassName(this.element,this.invalidClass);this.addClassName(this.additionalError,this.invalidClass);return false;}
if(this.isRequired&&(nochecked==0||required!=0))
{this.addClassName(this.element,this.requiredClass);this.addClassName(this.additionalError,this.requiredClass);return false;}
this.addClassName(this.element,this.validClass);this.addClassName(this.additionalError,this.validClass);return true;};Tools.Widget.ValidationRadio.prototype.isDisabled=function()
{var ret=true;if(this.radioElements){var qlen=this.radioElements.length;for(var i=0;i<qlen;i++)
{if(!this.radioElements[i].disabled)
{ret=false;break;}}}
return ret;};Tools.Widget.ValidationRadio.prototype.destroy=function()
{if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++)
{Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
try{delete this.element;}catch(err){}
if(this.radioElements)
for(var i=0;i<this.radioElements.length;i++)
{try{delete this.radioElements[i];}catch(err){}}
try{delete this.radioElements;}catch(err){}
try{delete this.form;}catch(err){}
try{delete this.event_handlers;}catch(err){}
var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(q[i]==this){q.splice(i,1);break;}}};if(!Tools.Widget.Form)Tools.Widget.Form={};if(!Tools.Widget.Form.onSubmitWidgetQueue)Tools.Widget.Form.onSubmitWidgetQueue=[];if(!Tools.Widget.Form.validate){Tools.Widget.Form.validate=function(vform){var isValid=true;var isElementValid=true;var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform){isElementValid=q[i].validate();isValid=isElementValid&&isValid;}}
return isValid;}};if(!Tools.Widget.Form.onSubmit){Tools.Widget.Form.onSubmit=function(e,form)
{if(Tools.Widget.Form.validate(form)==false){return false;}
return true;};};if(!Tools.Widget.Form.onReset){Tools.Widget.Form.onReset=function(e,vform)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform&&typeof(q[i].reset)=='function'){q[i].reset();}}
return true;};};if(!Tools.Widget.Form.destroy){Tools.Widget.Form.destroy=function(form)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(q[i].form==form&&typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Form.destroyAll){Tools.Widget.Form.destroyAll=function()
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.getFirstParentWithNodeName=function(node,nodeName)
{while(node.parentNode&&node.parentNode.nodeName.toLowerCase()!=nodeName.toLowerCase()&&node.parentNode.nodeName!='BODY'){node=node.parentNode;}
if(node.parentNode&&node.parentNode.nodeName.toLowerCase()==nodeName.toLowerCase()){return node.parentNode;}else{return null;}};Tools.Widget.Utils.destroyWidgets=function(container)
{if(typeof container=='string'){container=document.getElementById(container);}
var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'&&Tools.Widget.Utils.contains(container,q[i].element)){q[i].destroy();i--;}}};Tools.Widget.Utils.contains=function(who,what)
{if(typeof who.contains=='object'){return what&&who&&(who==what||who.contains(what));}else{var el=what;while(el){if(el==who){return true;}
el=el.parentNode;}
return false;}};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}catch(e){}};Tools.Widget.Utils.removeEventListener=function(element,eventType,handler,capture)
{try{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}catch(e){}};
// ToolsValidationSelect.js - version 0.10 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.ValidationSelect=function(element,opts)
{this.init(element);Tools.Widget.Utils.setOptions(this,opts);var validateOn=['submit'].concat(this.validateOn||[]);validateOn=validateOn.join(",");this.validateOn=0|(validateOn.indexOf('submit')!=-1?Tools.Widget.ValidationSelect.ONSUBMIT:0);this.validateOn=this.validateOn|(validateOn.indexOf('blur')!=-1?Tools.Widget.ValidationSelect.ONBLUR:0);this.validateOn=this.validateOn|(validateOn.indexOf('change')!=-1?Tools.Widget.ValidationSelect.ONCHANGE:0);if(this.additionalError)
this.additionalError=this.getElement(this.additionalError);if(Tools.Widget.ValidationSelect.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.ValidationSelect.loadQueue.push(this);};Tools.Widget.ValidationSelect.ONCHANGE=1;Tools.Widget.ValidationSelect.ONBLUR=2;Tools.Widget.ValidationSelect.ONSUBMIT=4;Tools.Widget.ValidationSelect.prototype.init=function(element)
{this.element=this.getElement(element);this.additionalError=false;this.selectElement=null;this.form=null;this.event_handlers=[];this.requiredClass="selectRequiredState";this.invalidClass="selectInvalidState";this.focusClass="selectFocusState";this.validClass="selectValidState";this.emptyValue="";this.invalidValue=null;this.isRequired=true;this.validateOn=["submit"];this.validatedByOnChangeEvent=false;};Tools.Widget.ValidationSelect.prototype.destroy=function(){if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
try{delete this.element;}catch(err){}
try{delete this.selectElement;}catch(err){}
try{delete this.form;}catch(err){}
try{delete this.event_handlers;}catch(err){}
var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(q[i]==this){q.splice(i,1);break;}}};Tools.Widget.ValidationSelect.onloadDidFire=false;Tools.Widget.ValidationSelect.loadQueue=[];Tools.Widget.ValidationSelect.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.ValidationSelect.processLoadQueue=function(handler)
{Tools.Widget.ValidationSelect.onloadDidFire=true;var q=Tools.Widget.ValidationSelect.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.ValidationSelect.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.ValidationSelect.addLoadListener(Tools.Widget.ValidationSelect.processLoadQueue);Tools.Widget.ValidationSelect.addLoadListener(function(){Tools.Widget.Utils.addEventListener(window,"unload",Tools.Widget.Form.destroyAll,false);});Tools.Widget.ValidationSelect.prototype.attachBehaviors=function()
{if(this.element.nodeName=="SELECT"){this.selectElement=this.element;}else{this.selectElement=Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.element,"SELECT");}
if(this.selectElement){var self=this;this.event_handlers=[];var focusEventName="focus";var ua=navigator.userAgent.match(/msie (\d+)\./i);if(ua){ua=parseInt(ua[1],10);if(ua>=6){focusEventName="beforeactivate";}}
this.event_handlers.push([this.selectElement,focusEventName,function(e){if(self.isDisabled())return true;return self.onFocus(e);}]);this.event_handlers.push([this.selectElement,"blur",function(e){if(self.isDisabled())return true;return self.onBlur(e);}]);if(this.validateOn&Tools.Widget.ValidationSelect.ONCHANGE){this.event_handlers.push([this.selectElement,"change",function(e){if(self.isDisabled())return true;return self.onChange(e);}]);this.event_handlers.push([this.selectElement,"keypress",function(e){if(self.isDisabled())return true;return self.onChange(e);}]);}
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
this.form=Tools.Widget.Utils.getFirstParentWithNodeName(this.selectElement,"FORM");if(this.form){if(!this.form.attachedSubmitHandler&&!this.form.onsubmit){this.form.onsubmit=function(e){e=e||event;return Tools.Widget.Form.onSubmit(e,e.srcElement||e.currentTarget)};this.form.attachedSubmitHandler=true;}
if(!this.form.attachedResetHandler){Tools.Widget.Utils.addEventListener(this.form,"reset",function(e){e=e||event;return Tools.Widget.Form.onReset(e,e.srcElement||e.currentTarget)},false);this.form.attachedResetHandler=true;}
Tools.Widget.Form.onSubmitWidgetQueue.push(this);}}};Tools.Widget.ValidationSelect.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.ValidationSelect.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.ValidationSelect.prototype.onFocus=function(e)
{this.hasFocus=true;this.validatedByOnChangeEvent=false;this.addClassName(this.element,this.focusClass);this.addClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationSelect.prototype.onBlur=function(e)
{this.hasFocus=false;var doValidation=false;if(this.validateOn&Tools.Widget.ValidationSelect.ONBLUR)
doValidation=true;if(doValidation&&!this.validatedByOnChangeEvent)
this.validate();this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationSelect.prototype.onChange=function(e)
{this.hasFocus=false;this.validate();this.validatedByOnChangeEvent=true;};Tools.Widget.ValidationSelect.prototype.reset=function(){this.removeClassName(this.element,this.requiredClass);this.removeClassName(this.element,this.invalidClass);this.removeClassName(this.element,this.validClass);this.removeClassName(this.additionalError,this.requiredClass);this.removeClassName(this.additionalError,this.invalidClass);this.removeClassName(this.additionalError,this.validClass);};Tools.Widget.ValidationSelect.prototype.validate=function(){this.reset();if(this.isRequired){if(this.selectElement.options.length==0||this.selectElement.selectedIndex==-1){this.addClassName(this.element,this.requiredClass);this.addClassName(this.additionalError,this.requiredClass);return false;}
if(this.selectElement.options[this.selectElement.selectedIndex].getAttribute("value")==null){this.addClassName(this.element,this.requiredClass);this.addClassName(this.additionalError,this.requiredClass);return false;}
if(this.selectElement.options[this.selectElement.selectedIndex].value==this.emptyValue){this.addClassName(this.element,this.requiredClass);this.addClassName(this.additionalError,this.requiredClass);return false;}
if(this.selectElement.options[this.selectElement.selectedIndex].disabled){this.addClassName(this.element,this.requiredClass);this.addClassName(this.additionalError,this.requiredClass);return false;}}
if(this.invalidValue){if(this.selectElement.options.length>0&&this.selectElement.selectedIndex!=-1&&this.selectElement.options[this.selectElement.selectedIndex].value==this.invalidValue){this.addClassName(this.element,this.invalidClass);this.addClassName(this.additionalError,this.invalidClass);return false;}}
this.addClassName(this.element,this.validClass);this.addClassName(this.additionalError,this.validClass);return true;};Tools.Widget.ValidationSelect.prototype.isDisabled=function(){return this.selectElement.disabled;};if(!Tools.Widget.Form)Tools.Widget.Form={};if(!Tools.Widget.Form.onSubmitWidgetQueue)Tools.Widget.Form.onSubmitWidgetQueue=[];if(!Tools.Widget.Form.validate){Tools.Widget.Form.validate=function(vform){var isValid=true;var isElementValid=true;var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform){isElementValid=q[i].validate();isValid=isElementValid&&isValid;}}
return isValid;}};if(!Tools.Widget.Form.onSubmit){Tools.Widget.Form.onSubmit=function(e,form)
{if(Tools.Widget.Form.validate(form)==false){return false;}
return true;};};if(!Tools.Widget.Form.onReset){Tools.Widget.Form.onReset=function(e,vform)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform&&typeof(q[i].reset)=='function'){q[i].reset();}}
return true;};};if(!Tools.Widget.Form.destroy){Tools.Widget.Form.destroy=function(form)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(q[i].form==form&&typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Form.destroyAll){Tools.Widget.Form.destroyAll=function()
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel=function(node,nodeName)
{var elements=node.getElementsByTagName(nodeName);if(elements){return elements[0];}
return null;};Tools.Widget.Utils.getFirstParentWithNodeName=function(node,nodeName)
{while(node.parentNode&&node.parentNode.nodeName.toLowerCase()!=nodeName.toLowerCase()&&node.parentNode.nodeName!='BODY'){node=node.parentNode;}
if(node.parentNode&&node.parentNode.nodeName.toLowerCase()==nodeName.toLowerCase()){return node.parentNode;}else{return null;}};Tools.Widget.Utils.destroyWidgets=function(container)
{if(typeof container=='string'){container=document.getElementById(container);}
var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'&&Tools.Widget.Utils.contains(container,q[i].element)){q[i].destroy();i--;}}};Tools.Widget.Utils.contains=function(who,what)
{if(typeof who.contains=='object'){return what&&who&&(who==what||who.contains(what));}else{var el=what;while(el){if(el==who){return true;}
el=el.parentNode;}
return false;}};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}
catch(e){}};
// ToolsValidationTextarea.js - version 0.17 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;this.version=parseFloat(r[2]);}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Tools.is=new Tools.Widget.BrowserSniff();Tools.Widget.ValidationTextarea=function(element,options){options=Tools.Widget.Utils.firstValid(options,{});this.flags={locked:false};this.options={};this.element=element;this.init(element);if(!this.isBrowserSupported()){return;}
options.useCharacterMasking=Tools.Widget.Utils.firstValid(options.useCharacterMasking,true);options.hint=Tools.Widget.Utils.firstValid(options.hint,'');options.isRequired=Tools.Widget.Utils.firstValid(options.isRequired,true);options.additionalError=Tools.Widget.Utils.firstValid(options.additionalError,false);Tools.Widget.Utils.setOptions(this,options);Tools.Widget.Utils.setOptions(this.options,options);if(options.additionalError)
this.additionalError=this.getElement(options.additionalError);var validateOn=['submit'].concat(Tools.Widget.Utils.firstValid(this.options.validateOn,[]));validateOn=validateOn.join(",");this.validateOn=0;this.validateOn=this.validateOn|(validateOn.indexOf('submit')!=-1?Tools.Widget.ValidationTextarea.ONSUBMIT:0);this.validateOn=this.validateOn|(validateOn.indexOf('blur')!=-1?Tools.Widget.ValidationTextarea.ONBLUR:0);this.validateOn=this.validateOn|(validateOn.indexOf('change')!=-1?Tools.Widget.ValidationTextarea.ONCHANGE:0);if(Tools.Widget.ValidationTextarea.onloadDidFire){this.attachBehaviors();}else{Tools.Widget.ValidationTextarea.loadQueue.push(this);}};Tools.Widget.ValidationTextarea.ONCHANGE=1;Tools.Widget.ValidationTextarea.ONBLUR=2;Tools.Widget.ValidationTextarea.ONSUBMIT=4;Tools.Widget.ValidationTextarea.INITIAL='Initial';Tools.Widget.ValidationTextarea.REQUIRED='Required';Tools.Widget.ValidationTextarea.INVALID='Invalid Format';Tools.Widget.ValidationTextarea.MINIMUM='Minimum Number of Chars Not Met';Tools.Widget.ValidationTextarea.MAXIMUM='Maximum Number of Chars Exceeded';Tools.Widget.ValidationTextarea.VALID='Valid';Tools.Widget.ValidationTextarea.prototype.init=function(element)
{this.element=this.getElement(element);this.event_handlers=[];this.requiredClass="textareaRequiredState";this.invalidCharsMaxClass="textareaMaxCharsState";this.invalidCharsMinClass="textareaMinCharsState";this.validClass="textareaValidState";this.focusClass="textareaFocusState";this.hintClass="textareaHintState";this.textareaFlashClass="textareaFlashState";this.isMaxInvalid=false;this.isMinInvalid=false;this.isRequireInvalid=false;this.safariClicked=false;this.state=Tools.Widget.ValidationTextarea.INITIAL;};Tools.Widget.ValidationTextarea.prototype.destroy=function(){if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
try{delete this.element;}catch(err){}
try{delete this.input;}catch(err){}
try{delete this.counterEl;}catch(err){}
try{delete this.form;}catch(err){}
try{delete this.event_handlers;}catch(err){}
try{this.cursorPosition.destroy();}catch(err){}
try{delete this.cursorPosition;}catch(err){}
try{this.initialCursor.destroy();}catch(err){}
try{delete this.initialCursor;}catch(err){}
var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(q[i]==this){q.splice(i,1);break;}}};Tools.Widget.ValidationTextarea.prototype.isDisabled=function(){return this.input&&(this.input.disabled||this.input.readOnly)||!this.input;};Tools.Widget.ValidationTextarea.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.ValidationTextarea.addLoadListener=function(handler){if(typeof window.addEventListener!='undefined'){window.addEventListener('load',handler,false);}else if(typeof document.addEventListener!='undefined'){document.addEventListener('load',handler,false);}else if(typeof window.attachEvent!='undefined'){window.attachEvent('onload',handler);}};Tools.Widget.ValidationTextarea.processLoadQueue=function(handler){Tools.Widget.ValidationTextarea.onloadDidFire=true;var q=Tools.Widget.ValidationTextarea.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++){q[i].attachBehaviors();}};Tools.Widget.ValidationTextarea.onloadDidFire=false;Tools.Widget.ValidationTextarea.loadQueue=[];Tools.Widget.ValidationTextarea.addLoadListener(Tools.Widget.ValidationTextarea.processLoadQueue);Tools.Widget.ValidationTextarea.addLoadListener(function(){Tools.Widget.Utils.addEventListener(window,"unload",Tools.Widget.Form.destroyAll,false);});Tools.Widget.ValidationTextarea.prototype.isBrowserSupported=function()
{return Tools.is.ie&&Tools.is.v>=5&&Tools.is.windows||Tools.is.mozilla&&Tools.is.v>=1.4||Tools.is.safari||Tools.is.opera&&Tools.is.v>=9;};Tools.Widget.ValidationTextarea.prototype.attachBehaviors=function()
{if(this.element){if(this.element.nodeName=="TEXTAREA"){this.input=this.element;}else{this.input=Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.element,"TEXTAREA");}}
if(this.options&&this.options.counterType&&(this.options.counterType=='chars_count'||this.options.counterType=='chars_remaining')){this.counterEl=document.getElementById(this.options.counterId);this.counterChar();}
if(this.input){this.input.setAttribute("AutoComplete","off");this.putHint();this.cursorPosition=new Tools.Widget.SelectionDescriptor(this.input);var self=this;this.event_handlers=[];if(this.useCharacterMasking){if(Tools.is.ie){this.event_handlers.push([this.input,"propertychange",function(e){return self.onKeyEvent(e||event);}]);this.event_handlers.push([this.input,"drop",function(e){return self.onDrop(e||event);}]);this.event_handlers.push([this.input,"keypress",function(e){return self.onKeyPress(e||event);}]);}else{this.event_handlers.push([this.input,"keydown",function(e){return self.onKeyDown(e);}]);this.event_handlers.push([this.input,"keypress",function(e){return self.safariKeyPress(e);}]);this.event_handlers.push([this.input,"keyup",function(e){return self.safariValidate(e);}]);if(Tools.is.safari){this.event_handlers.push([this.input,"mouseup",function(e){return self.safariMouseUp(e);}]);this.event_handlers.push([this.input,"mousedown",function(e){return self.safariMouseDown(e);}]);}else{this.event_handlers.push([this.input,"dragdrop",function(e){return self.onKeyEvent(e);}]);this.event_handlers.push([this.input,"dragenter",function(e){self.removeHint();return self.onKeyDown(e);}]);this.event_handlers.push([this.input,"dragexit",function(e){return self.putHint();}]);}}
this.event_handlers.push([this.input,"keydown",function(e){return self.onKeyDown(e||event);}]);}
this.event_handlers.push([this.input,"focus",function(e){return self.onFocus(e||event);}]);this.event_handlers.push([this.input,"mousedown",function(e){return self.onMouseDown(e||event);}]);this.event_handlers.push([this.input,"blur",function(e){return self.onBlur(e||event);}]);if(this.validateOn&Tools.Widget.ValidationTextarea.ONCHANGE){if(Tools.is.ie){this.event_handlers.push([this.input,"propertychange",function(e){return self.onChange(e||event);}]);this.event_handlers.push([this.input,"drop",function(e){return self.onChange(e||event);}]);}else{this.event_handlers.push([this.input,"keydown",function(e){return self.onKeyDown(e);}]);this.event_handlers.push([this.input,"keypress",function(e){return self.safariChangeKeyPress(e);}]);this.event_handlers.push([this.input,"keyup",function(e){return self.safariChangeValidate(e);}]);if(Tools.is.safari){this.event_handlers.push([this.input,"mouseup",function(e){return self.safariChangeMouseUp(e);}]);this.event_handlers.push([this.input,"mousedown",function(e){return self.safariMouseDown(e);}]);}else{this.event_handlers.push([this.input,"dragdrop",function(e){return self.onChange(e);}]);this.event_handlers.push([this.input,"dragenter",function(e){self.removeHint();return self.onKeyDown(e);}]);this.event_handlers.push([this.input,"dragexit",function(e){return self.putHint();}]);}}}
if(!(this.validateOn&Tools.Widget.ValidationTextarea.ONCHANGE)&&!this.useCharacterMasking){if(Tools.is.ie){this.event_handlers.push([this.input,"propertychange",function(e){return self.counterChar();}]);this.event_handlers.push([this.input,"drop",function(e){return self.counterChar();}]);}else{this.event_handlers.push([this.input,"keypress",function(e){return self.counterChar();}]);this.event_handlers.push([this.input,"keyup",function(e){return self.counterChar();}]);if(Tools.is.safari){this.event_handlers.push([this.input,"mouseup",function(e){return self.counterChar();}]);}else{this.event_handlers.push([this.input,"dragdrop",function(e){return self.counterChar();}]);}}}
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
this.form=Tools.Widget.Utils.getFirstParentWithNodeName(this.input,"FORM");if(this.form){if(!this.form.attachedSubmitHandler&&!this.form.onsubmit){this.form.onsubmit=function(e){e=e||event;return Tools.Widget.Form.onSubmit(e,e.srcElement||e.currentTarget)};this.form.attachedSubmitHandler=true;}
if(!this.form.attachedResetHandler){Tools.Widget.Utils.addEventListener(this.form,"reset",function(e){e=e||event;return Tools.Widget.Form.onReset(e,e.srcElement||e.currentTarget)},false);this.form.attachedResetHandler=true;}
Tools.Widget.Form.onSubmitWidgetQueue.push(this);}}
this.saveState();};Tools.Widget.ValidationTextarea.prototype.onTyping=function(e){if(this.input.disabled==true||this.input.readOnly==true){return;}
if(!this.initialCursor){this.initialCursor=this.cursorPosition;}
if(this.flags.locked){return true;}
var val=this.input.value;var ret=true;if(this.flags.hintOn){return true;}
if(e&&this.input&&this.options&&this.options.maxChars>0&&ret){if(val.length>this.options.maxChars&&((!Tools.Widget.Utils.isSpecialKey(e)&&this.cursorPosition.start==this.cursorPosition.end)||(Tools.Widget.Utils.isSpecialKey(e)&&val!=this.initialValue)||this.cursorPosition.start!=this.cursorPosition.end)){this.flags.locked=true;var initial=this.initialValue;var start=this.initialCursor.start;var end=this.initialCursor.end;if(initial.length&&this.initialCursor.end<initial.length){var tmp=end-start+this.options.maxChars-initial.length;var newValue=initial.substring(0,start)+val.substring(start,start+tmp)+initial.substring(end,initial.length<this.options.maxChars?initial.length:this.options.maxChars);end=start+tmp;}else{var newValue=val.substring(0,this.options.maxChars);end=start=this.options.maxChars;}
if(Tools.is.ie){this.input.innerText=newValue;}else{this.input.value=newValue;}
this.redTextFlash();this.cursorPosition.moveTo(end,end);this.flags.locked=false;ret=false;}else{this.setState(Tools.Widget.ValidationTextarea.VALID);this.isMaxInvalid=false;}}
this.counterChar();return ret;};Tools.Widget.ValidationTextarea.prototype.validateMinRequired=function(val){var oldInvalid=false;if(typeof this.notFireMinYet=='undefined'){this.notFireMinYet=false;}else{oldInvalid=true;this.notFireMinYet=true;}
if(this.onBlurOn){this.notFireMinYet=true;}else if(!this.onKeyEventOn){this.notFireMinYet=true;}
if(this.input&&this.options&&this.options.isRequired){if(val.length>0&&this.isRequireInvalid&&(!this.hint||(this.hint&&!this.flags.hintOn)||(this.hint&&val!=this.hint))){this.switchClassName(this.validClass);this.setState(Tools.Widget.ValidationTextarea.VALID);this.isRequireInvalid=false;}else if((val.length==0||!(!this.hint||(this.hint&&!this.flags.hintOn)||(this.hint&&val!=this.hint)))&&(!this.isRequireInvalid||oldInvalid)){if(this.notFireMinYet||Tools.is.ie){this.switchClassName(this.requiredClass);this.setState(Tools.Widget.ValidationTextarea.REQUIRED);}
this.isRequireInvalid=true;this.isMinInvalid=false;}}
if(this.input&&this.options&&this.options.minChars>0&&!this.isRequireInvalid){if(val.length>=this.options.minChars&&(!this.hint||(this.hint&&!this.flags.hintOn)||(this.hint&&val!=this.hint))&&this.isMinInvalid){this.switchClassName(this.validClass);this.setState(Tools.Widget.ValidationTextarea.VALID);this.isMinInvalid=false;}else if((val.length<this.options.minChars||(this.hint&&val==this.hint&&this.flags.hintOn))&&!this.isMinInvalid){this.switchClassName(this.invalidCharsMinClass);this.setState(Tools.Widget.ValidationTextarea.MINIMUM);this.isMinInvalid=true;}}};Tools.Widget.ValidationTextarea.prototype.counterChar=function(){if(!this.counterEl||!this.options||!this.options.counterType||(this.options.counterType!='chars_remaining'&&this.options.counterType!='chars_count')){return;}
if(this.options.counterType=='chars_remaining'){if(this.options.maxChars>0){if(this.flags.hintOn){this.setCounterElementValue(this.options.maxChars);}else{if(this.options.maxChars>this.input.value.length){this.setCounterElementValue(this.options.maxChars-this.input.value.length);}else{this.setCounterElementValue(0);}}}}else{if(this.flags.hintOn){this.setCounterElementValue(0);}else{if(this.useCharacterMasking&&typeof this.options.maxChars!='undefined'&&this.options.maxChars<this.input.value.length){this.setCounterElementValue(this.options.maxChars);}else{this.setCounterElementValue(this.input.value.length);}}}};Tools.Widget.ValidationTextarea.prototype.setCounterElementValue=function(val){if(this.counterEl.nodeName.toLowerCase()!='input'&&this.counterEl.nodeName.toLowerCase()!='textarea'&&this.counterEl.nodeName.toLowerCase()!='select'&&this.counterEl.nodeName.toLowerCase()!='img'){this.counterEl.innerHTML=val;}};Tools.Widget.ValidationTextarea.prototype.reset=function(){this.removeHint();this.removeClassName(this.requiredClass);this.removeClassName(this.invalidCharsMinClass);this.removeClassName(this.invalidCharsMaxClass);this.removeClassName(this.validClass);this.setState(Tools.Widget.ValidationTextarea.INITIAL);var self=this;setTimeout(function(){self.putHint();self.counterChar();},10);};Tools.Widget.ValidationTextarea.prototype.validate=function(){if(this.input.disabled==true||this.input.readOnly==true){return true;}
if(this.validateOn&Tools.Widget.ValidationTextarea.ONSUBMIT){this.removeHint();}
var val=this.input.value;this.validateMinRequired(val);var ret=!this.isMinInvalid&&!this.isRequireInvalid;if(ret&&this.options.maxChars>0&&!this.useCharacterMasking){if(val.length<=this.options.maxChars||(this.hint&&this.hint==val&&this.flags.hintOn)){this.switchClassName(this.validClass);this.setState(Tools.Widget.ValidationTextarea.VALID);this.isMaxInvalid=false;}else{this.switchClassName(this.invalidCharsMaxClass);this.setState(Tools.Widget.ValidationTextarea.MAXIMUM);this.isMaxInvalid=true;}}
ret=ret&&!this.isMaxInvalid;if(ret){this.switchClassName(this.validClass);}
this.counterChar();return ret;};Tools.Widget.ValidationTextarea.prototype.setState=function(newstate){this.state=newstate;};Tools.Widget.ValidationTextarea.prototype.getState=function(){return this.state;};Tools.Widget.ValidationTextarea.prototype.removeHint=function()
{if(this.flags.hintOn)
{this.flags.locked=true;this.input.value="";this.flags.locked=false;this.flags.hintOn=false;this.removeClassName(this.hintClass);}};Tools.Widget.ValidationTextarea.prototype.putHint=function()
{if(this.hint&&this.input.value==""){this.flags.hintOn=true;this.input.value=this.hint;this.addClassName(this.hintClass);}};Tools.Widget.ValidationTextarea.prototype.redTextFlash=function()
{var self=this;this.addClassName(this.textareaFlashClass);setTimeout(function(){self.removeClassName(self.textareaFlashClass)},200);};Tools.Widget.ValidationTextarea.prototype.onKeyPress=function(e)
{if(Tools.is.ie&&Tools.is.windows&&e.keyCode==13){if((this.initialCursor.length+this.options.maxChars-this.input.value.length)<2){Tools.Widget.Utils.stopEvent(e);return false;}}};Tools.Widget.ValidationTextarea.prototype.onKeyDown=function(e)
{this.saveState();this.keyCode=e.keyCode;return true;};Tools.Widget.ValidationTextarea.prototype.onKeyEvent=function(e){if(e.type=='propertychange'&&e.propertyName!='value'){return true;}
var allow=this.onTyping(e);if(!allow){Tools.Widget.Utils.stopEvent(e);}};Tools.Widget.ValidationTextarea.prototype.onChange=function(e){if(Tools.is.ie&&e&&e.type=='propertychange'&&e.propertyName!='value'){return true;}
if(this.flags.drop){var self=this;setTimeout(function(){self.flags.drop=false;self.onChange(null);},0);return true;}
if(this.flags.hintOn){return true;}
this.onKeyEventOn=true;var answer=this.validate();this.onKeyEventOn=false;return answer;};Tools.Widget.ValidationTextarea.prototype.onMouseDown=function(e)
{if(this.flags.active){this.saveState();}};Tools.Widget.ValidationTextarea.prototype.onDrop=function(e)
{this.flags.drop=true;this.removeHint();if(Tools.is.ie){var rng=document.body.createTextRange();rng.moveToPoint(e.x,e.y);rng.select();}
this.saveState();this.flags.active=true;this.addClassName(this.focusClass);};Tools.Widget.ValidationTextarea.prototype.onFocus=function(e)
{if(this.flags.drop){return;}
this.removeHint();this.saveState();this.flags.active=true;this.addClassName(this.focusClass);};Tools.Widget.ValidationTextarea.prototype.onBlur=function(e){this.removeClassName(this.focusClass);if(this.validateOn&Tools.Widget.ValidationTextarea.ONBLUR){this.onBlurOn=true;this.validate();this.onBlurOn=false;}
this.flags.active=false;var self=this;setTimeout(function(){self.putHint();},10);};Tools.Widget.ValidationTextarea.prototype.safariMouseDown=function(e){this.safariClicked=true;};Tools.Widget.ValidationTextarea.prototype.safariChangeMouseUp=function(e){if(!this.safariClicked){this.onKeyDown(e);return this.safariChangeValidate(e,false);}else{this.safariClicked=false;return true;}};Tools.Widget.ValidationTextarea.prototype.safariMouseUp=function(e){if(!this.safariClicked){this.onKeyDown(e);return this.safariValidate(e,false);}else{this.safariClicked=false;return true;}};Tools.Widget.ValidationTextarea.prototype.safariKeyPress=function(e){this.safariFlag=new Date();return this.safariValidate(e,true);};Tools.Widget.ValidationTextarea.prototype.safariValidate=function(e,recall)
{if(e.keyCode&&Tools.Widget.Utils.isSpecialKey(e)&&e.keyCode!=8&&e.keyCode!=46){return true;}
var answer=this.onTyping(e);if(new Date()-this.safariFlag<1000&&recall){var self=this;setTimeout(function(){self.safariValidate(e,false);},1000);}
return answer;};Tools.Widget.ValidationTextarea.prototype.safariChangeKeyPress=function(e){this.safariChangeFlag=new Date();return this.safariChangeValidate(e,true);};Tools.Widget.ValidationTextarea.prototype.safariChangeValidate=function(e,recall){if(e.keyCode&&Tools.Widget.Utils.isSpecialKey(e)&&e.keyCode!=8&&e.keyCode!=46){return true;}
var answer=this.onChange(e);if(new Date()-this.safariChangeFlag<1000&&recall){var self=this;setTimeout(function(){self.safariChangeValidate(e,false);},1000-new Date()+this.safariChangeFlag);}
return answer;};Tools.Widget.ValidationTextarea.prototype.saveState=function(e){if(this.options.maxChars>0&&this.input.value.length>this.options.maxChars){return;}
this.cursorPosition.update();if(!this.flags.hintOn){this.initialValue=this.input.value;}else{this.initialValue='';}
this.initialCursor=this.cursorPosition;return true;};Tools.Widget.ValidationTextarea.prototype.checkClassName=function(ele,className){if(!ele||!className){return false;}
if(typeof ele=='string'){ele=document.getElementById(ele);if(!ele){return false;}}
if(!ele.className){ele.className=' ';}
return ele;};Tools.Widget.ValidationTextarea.prototype.switchClassName=function(className){var classes=[this.invalidCharsMaxClass,this.validClass,this.requiredClass,this.invalidCharsMinClass];for(var k=0;k<classes.length;k++){if(classes[k]!=className){this.removeClassName(classes[k]);}}
this.addClassName(className);};Tools.Widget.ValidationTextarea.prototype.addClassName=function(clssName){var ele=this.checkClassName(this.element,clssName);var add=this.checkClassName(this.additionalError,clssName);if(!ele||ele.className.search(new RegExp("\\b"+clssName+"\\b"))!=-1){return;}
this.element.className+=' '+clssName;if(add)
add.className+=' '+clssName;};Tools.Widget.ValidationTextarea.prototype.removeClassName=function(className){var ele=this.checkClassName(this.element,className);var add=this.checkClassName(this.additionalError,className);if(!ele){return;}
ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),'');if(add){add.className=add.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),'');}};Tools.Widget.SelectionDescriptor=function(element)
{this.element=element;this.update();};Tools.Widget.SelectionDescriptor.prototype.update=function()
{if(Tools.is.ie&&Tools.is.windows){var sel=this.element.ownerDocument.selection;if(this.element.nodeName=="TEXTAREA"){if(sel.type!='None'){try{var range=sel.createRange();}catch(err){return;}
if(range.parentElement()==this.element){var range_all=this.element.ownerDocument.body.createTextRange();range_all.moveToElementText(this.element);for(var sel_start=0;range_all.compareEndPoints('StartToStart',range)<0;sel_start++){range_all.moveStart('character',1);}
this.start=sel_start;range_all=this.element.ownerDocument.body.createTextRange();range_all.moveToElementText(this.element);for(var sel_end=0;range_all.compareEndPoints('StartToEnd',range)<0;sel_end++){range_all.moveStart('character',1);}
this.end=sel_end;this.length=this.end-this.start;this.text=range.text;}}}else if(this.element.nodeName=="INPUT"){try{this.range=sel.createRange();}catch(err){return;}
this.length=this.range.text.length;var clone=this.range.duplicate();this.start=-clone.moveStart("character",-10000);clone=this.range.duplicate();clone.collapse(false);this.end=-clone.moveStart("character",-10000);this.text=this.range.text;}}else{var tmp=this.element;var selectionStart=0;var selectionEnd=0;try{selectionStart=tmp.selectionStart;}catch(err){}
try{selectionEnd=tmp.selectionEnd;}catch(err){}
if(Tools.is.safari){if(selectionStart==2147483647){selectionStart=0;}
if(selectionEnd==2147483647){selectionEnd=0;}}
this.start=selectionStart;this.end=selectionEnd;this.length=selectionEnd-selectionStart;this.text=this.element.value.substring(selectionStart,selectionEnd);}};Tools.Widget.SelectionDescriptor.prototype.destroy=function(){try{delete this.range}catch(err){}
try{delete this.element}catch(err){}};Tools.Widget.SelectionDescriptor.prototype.moveTo=function(start,end)
{if(Tools.is.ie&&Tools.is.windows){if(this.element.nodeName=="TEXTAREA"){var ta_range=this.element.createTextRange();this.range=this.element.createTextRange();this.range.move("character",start);this.range.moveEnd("character",end-start);var c1=this.range.compareEndPoints("StartToStart",ta_range);if(c1<0){this.range.setEndPoint("StartToStart",ta_range);}
var c2=this.range.compareEndPoints("EndToEnd",ta_range);if(c2>0){this.range.setEndPoint("EndToEnd",ta_range);}}else if(this.element.nodeName=="INPUT"){this.range=this.element.ownerDocument.selection.createRange();this.range.move("character",-10000);this.start=this.range.moveStart("character",start);this.end=this.start+this.range.moveEnd("character",end-start);}
this.range.select();}else{this.start=start;try{this.element.selectionStart=start;}catch(err){}
this.end=end;try{this.element.selectionEnd=end;}catch(err){}}
this.ignore=true;this.update();};if(!Tools.Widget.Form)Tools.Widget.Form={};if(!Tools.Widget.Form.onSubmitWidgetQueue)Tools.Widget.Form.onSubmitWidgetQueue=[];if(!Tools.Widget.Form.validate){Tools.Widget.Form.validate=function(vform){var isValid=true;var isElementValid=true;var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform){isElementValid=q[i].validate();isValid=isElementValid&&isValid;}}
return isValid;}};if(!Tools.Widget.Form.onSubmit){Tools.Widget.Form.onSubmit=function(e,form)
{if(Tools.Widget.Form.validate(form)==false){return false;}
return true;};};if(!Tools.Widget.Form.onReset){Tools.Widget.Form.onReset=function(e,vform)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform&&typeof(q[i].reset)=='function'){q[i].reset();}}
return true;};};if(!Tools.Widget.Form.destroy){Tools.Widget.Form.destroy=function(form)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(q[i].form==form&&typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Form.destroyAll){Tools.Widget.Form.destroyAll=function()
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.firstValid=function(){var ret=null;for(var i=0;i<Tools.Widget.Utils.firstValid.arguments.length;i++){if(typeof(Tools.Widget.Utils.firstValid.arguments[i])!='undefined'){ret=Tools.Widget.Utils.firstValid.arguments[i];break;}}
return ret;};Tools.Widget.Utils.specialSafariNavKeys=",63232,63233,63234,63235,63272,63273,63275,63276,63277,63289,";Tools.Widget.Utils.specialCharacters=",8,9,16,17,18,20,27,33,34,35,36,37,38,39,40,45,46,91,92,93,144,192,63232,";Tools.Widget.Utils.specialCharacters+=Tools.Widget.Utils.specialSafariNavKeys;Tools.Widget.Utils.isSpecialKey=function(ev){return Tools.Widget.Utils.specialCharacters.indexOf(","+ev.keyCode+",")!=-1;};Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel=function(node,nodeName){var elements=node.getElementsByTagName(nodeName);if(elements){return elements[0];}
return null;};Tools.Widget.Utils.getFirstParentWithNodeName=function(node,nodeName)
{while(node.parentNode&&node.parentNode.nodeName.toLowerCase()!=nodeName.toLowerCase()&&node.parentNode.nodeName!='BODY'){node=node.parentNode;}
if(node.parentNode&&node.parentNode.nodeName.toLowerCase()==nodeName.toLowerCase()){return node.parentNode;}else{return null;}};Tools.Widget.Utils.destroyWidgets=function(container)
{if(typeof container=='string'){container=document.getElementById(container);}
var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'&&Tools.Widget.Utils.contains(container,q[i].element)){q[i].destroy();i--;}}};Tools.Widget.Utils.contains=function(who,what)
{if(typeof who.contains=='object'){return what&&who&&(who==what||who.contains(what));}else{var el=what;while(el){if(el==who){return true;}
el=el.parentNode;}
return false;}};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.stopEvent=function(ev)
{try
{this.stopPropagation(ev);this.preventDefault(ev);}
catch(e){}};Tools.Widget.Utils.stopPropagation=function(ev)
{if(ev.stopPropagation)
{ev.stopPropagation();}
else
{ev.cancelBubble=true;}};Tools.Widget.Utils.preventDefault=function(ev)
{if(ev.preventDefault)
{ev.preventDefault();}
else
{ev.returnValue=false;}};
// ToolsValidationTextField.js - version 0.37 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.Widget)Tools.Widget={};Tools.Widget.BrowserSniff=function()
{var b=navigator.appName.toString();var up=navigator.platform.toString();var ua=navigator.userAgent.toString();this.mozilla=this.ie=this.opera=this.safari=false;var re_opera=/Opera.([0-9\.]*)/i;var re_msie=/MSIE.([0-9\.]*)/i;var re_gecko=/gecko/i;var re_safari=/(applewebkit|safari)\/([\d\.]*)/i;var r=false;if((r=ua.match(re_opera))){this.opera=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_msie))){this.ie=true;this.version=parseFloat(r[1]);}else if((r=ua.match(re_safari))){this.safari=true;this.version=parseFloat(r[2]);}else if(ua.match(re_gecko)){var re_gecko_version=/rv:\s*([0-9\.]+)/i;r=ua.match(re_gecko_version);this.mozilla=true;this.version=parseFloat(r[1]);}
this.windows=this.mac=this.linux=false;this.Platform=ua.match(/windows/i)?"windows":(ua.match(/linux/i)?"linux":(ua.match(/mac/i)?"mac":ua.match(/unix/i)?"unix":"unknown"));this[this.Platform]=true;this.v=this.version;if(this.safari&&this.mac&&this.mozilla){this.mozilla=false;}};Tools.is=new Tools.Widget.BrowserSniff();Tools.Widget.ValidationTextField=function(element,type,options)
{type=Tools.Widget.Utils.firstValid(type,"none");if(typeof type!='string'){this.showError('The second parameter in the constructor should be the validation type, the options are the third parameter.');return;}
if(typeof Tools.Widget.ValidationTextField.ValidationDescriptors[type]=='undefined'){this.showError('Unknown validation type received as the second parameter.');return;}
options=Tools.Widget.Utils.firstValid(options,{});this.type=type;if(!this.isBrowserSupported()){options.useCharacterMasking=false;}
this.init(element,options);var validateOn=['submit'].concat(Tools.Widget.Utils.firstValid(this.options.validateOn,[]));validateOn=validateOn.join(",");this.validateOn=0;this.validateOn=this.validateOn|(validateOn.indexOf('submit')!=-1?Tools.Widget.ValidationTextField.ONSUBMIT:0);this.validateOn=this.validateOn|(validateOn.indexOf('blur')!=-1?Tools.Widget.ValidationTextField.ONBLUR:0);this.validateOn=this.validateOn|(validateOn.indexOf('change')!=-1?Tools.Widget.ValidationTextField.ONCHANGE:0);if(Tools.Widget.ValidationTextField.onloadDidFire)
this.attachBehaviors();else
Tools.Widget.ValidationTextField.loadQueue.push(this);};Tools.Widget.ValidationTextField.ONCHANGE=1;Tools.Widget.ValidationTextField.ONBLUR=2;Tools.Widget.ValidationTextField.ONSUBMIT=4;Tools.Widget.ValidationTextField.ERROR_REQUIRED=1;Tools.Widget.ValidationTextField.ERROR_FORMAT=2;Tools.Widget.ValidationTextField.ERROR_RANGE_MIN=4;Tools.Widget.ValidationTextField.ERROR_RANGE_MAX=8;Tools.Widget.ValidationTextField.ERROR_CHARS_MIN=16;Tools.Widget.ValidationTextField.ERROR_CHARS_MAX=32;Tools.Widget.ValidationTextField.ValidationDescriptors={'none':{},'custom':{},'integer':{characterMasking:/[\-\+\d]/,regExpFilter:/^[\-\+]?\d*$/,validation:function(value,options){if(value==''||value=='-'||value=='+'){return false;}
var regExp=/^[\-\+]?\d*$/;if(!regExp.test(value)){return false;}
options=options||{allowNegative:false};var ret=parseInt(value,10);if(!isNaN(ret)){var allowNegative=true;if(typeof options.allowNegative!='undefined'&&options.allowNegative==false){allowNegative=false;}
if(!allowNegative&&value<0){ret=false;}}else{ret=false;}
return ret;}},'real':{characterMasking:/[\d\.,\-\+e]/i,regExpFilter:/^[\-\+]?\d(?:|\.,\d{0,2})|(?:|e{0,1}[\-\+]?\d{0,})$/i,validation:function(value,options){var regExp=/^[\+\-]?[0-9]+([\.,][0-9]+)?([eE]{0,1}[\-\+]?[0-9]+)?$/;if(!regExp.test(value)){return false;}
var ret=parseFloat(value);if(isNaN(ret)){ret=false;}
return ret;}},'currency':{formats:{'dot_comma':{characterMasking:/[\d\.\,\-\+\$]/,regExpFilter:/^[\-\+]?(?:[\d\.]*)+(|\,\d{0,2})$/,validation:function(value,options){var ret=false;if(/^(\-|\+)?\d{1,3}(?:\.\d{3})*(?:\,\d{2}|)$/.test(value)||/^(\-|\+)?\d+(?:\,\d{2}|)$/.test(value)){value=value.toString().replace(/\./gi,'').replace(/\,/,'.');ret=parseFloat(value);}
return ret;}},'comma_dot':{characterMasking:/[\d\.\,\-\+\$]/,regExpFilter:/^[\-\+]?(?:[\d\,]*)+(|\.\d{0,2})$/,validation:function(value,options){var ret=false;if(/^(\-|\+)?\d{1,3}(?:\,\d{3})*(?:\.\d{2}|)$/.test(value)||/^(\-|\+)?\d+(?:\.\d{2}|)$/.test(value)){value=value.toString().replace(/\,/gi,'');ret=parseFloat(value);}
return ret;}}}},'email':{characterMasking:/[^\s]/,validation:function(value,options){var rx=/^[\w\.-]+@[\w\.-]+\.\w+$/i;return rx.test(value);}},'date':{validation:function(value,options){var formatRegExp=/^([mdy]+)[\.\-\/\\\s]+([mdy]+)[\.\-\/\\\s]+([mdy]+)$/i;var valueRegExp=this.dateValidationPattern;var formatGroups=options.format.match(formatRegExp);var valueGroups=value.match(valueRegExp);if(formatGroups!==null&&valueGroups!==null){var dayIndex=-1;var monthIndex=-1;var yearIndex=-1;for(var i=1;i<formatGroups.length;i++){switch(formatGroups[i].toLowerCase()){case"dd":dayIndex=i;break;case"mm":monthIndex=i;break;case"yy":case"yyyy":yearIndex=i;break;}}
if(dayIndex!=-1&&monthIndex!=-1&&yearIndex!=-1){var maxDay=-1;var theDay=parseInt(valueGroups[dayIndex],10);var theMonth=parseInt(valueGroups[monthIndex],10);var theYear=parseInt(valueGroups[yearIndex],10);if(theMonth<1||theMonth>12){return false;}
switch(theMonth){case 1:case 3:case 5:case 7:case 8:case 10:case 12:maxDay=31;break;case 4:case 6:case 9:case 11:maxDay=30;break;case 2:if((parseInt(theYear/4,10)*4==theYear)&&(theYear%100!=0||theYear%400==0)){maxDay=29;}else{maxDay=28;}
break;}
if(theDay<1||theDay>maxDay){return false;}
return(new Date(theYear,theMonth-1,theDay));}}else{return false;}}},'time':{validation:function(value,options){var formatRegExp=/([hmst]+)/gi;var valueRegExp=/(\d+|AM?|PM?)/gi;var formatGroups=options.format.match(formatRegExp);var valueGroups=value.match(valueRegExp);if(formatGroups!==null&&valueGroups!==null){if(formatGroups.length!=valueGroups.length){return false;}
var hourIndex=-1;var minuteIndex=-1;var secondIndex=-1;var tIndex=-1;var theHour=0,theMinute=0,theSecond=0,theT='AM';for(var i=0;i<formatGroups.length;i++){switch(formatGroups[i].toLowerCase()){case"hh":hourIndex=i;break;case"mm":minuteIndex=i;break;case"ss":secondIndex=i;break;case"t":case"tt":tIndex=i;break;}}
if(hourIndex!=-1){var theHour=parseInt(valueGroups[hourIndex],10);if(isNaN(theHour)||theHour>(formatGroups[hourIndex]=='HH'?23:12)){return false;}}
if(minuteIndex!=-1){var theMinute=parseInt(valueGroups[minuteIndex],10);if(isNaN(theMinute)||theMinute>59){return false;}}
if(secondIndex!=-1){var theSecond=parseInt(valueGroups[secondIndex],10);if(isNaN(theSecond)||theSecond>59){return false;}}
if(tIndex!=-1){var theT=valueGroups[tIndex].toUpperCase();if(formatGroups[tIndex].toUpperCase()=='TT'&&!/^a|pm$/i.test(theT)||formatGroups[tIndex].toUpperCase()=='T'&&!/^a|p$/i.test(theT)){return false;}}
var date=new Date(2000,0,1,theHour+(theT.charAt(0)=='P'?12:0),theMinute,theSecond);return date;}else{return false;}}},'credit_card':{characterMasking:/\d/,validation:function(value,options){var regExp=null;options.format=options.format||'ALL';switch(options.format.toUpperCase()){case'ALL':regExp=/^[3-6]{1}[0-9]{12,18}$/;break;case'VISA':regExp=/^4(?:[0-9]{12}|[0-9]{15})$/;break;case'MASTERCARD':regExp=/^5[1-5]{1}[0-9]{14}$/;break;case'AMEX':regExp=/^3(4|7){1}[0-9]{13}$/;break;case'DISCOVER':regExp=/^6011[0-9]{12}$/;break;case'DINERSCLUB':regExp=/^3(?:(0[0-5]{1}[0-9]{11})|(6[0-9]{12})|(8[0-9]{12}))$/;break;}
if(!regExp.test(value)){return false;}
var digits=[];var j=1,digit='';for(var i=value.length-1;i>=0;i--){if((j%2)==0){digit=parseInt(value.charAt(i),10)*2;digits[digits.length]=digit.toString().charAt(0);if(digit.toString().length==2){digits[digits.length]=digit.toString().charAt(1);}}else{digit=value.charAt(i);digits[digits.length]=digit;}
j++;}
var sum=0;for(i=0;i<digits.length;i++){sum+=parseInt(digits[i],10);}
if((sum%10)==0){return true;}
return false;}},'zip_code':{formats:{'zip_us9':{pattern:'00000-0000'},'zip_us5':{pattern:'00000'},'zip_uk':{characterMasking:/[\dA-Z\s]/,validation:function(value,options){return/^[A-Z]{1,2}\d[\dA-Z]?\s?\d[A-Z]{2}$/.test(value);}},'zip_canada':{characterMasking:/[\dA-Z\s]/,pattern:'A0A 0A0'},'zip_custom':{}}},'phone_number':{formats:{'phone_us':{pattern:'(000) 000-0000'},'phone_custom':{}}},'social_security_number':{pattern:'000-00-0000'},'ip':{characterMaskingFormats:{'ipv4':/[\d\.]/i,'ipv6_ipv4':/[\d\.\:A-F\/]/i,'ipv6':/[\d\.\:A-F\/]/i},validation:function(value,options){return Tools.Widget.ValidationTextField.validateIP(value,options.format);}},'url':{characterMasking:/[^\s]/,validation:function(value,options){var URI_spliter=/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;var parts=value.match(URI_spliter);if(parts&&parts[4]){var host=parts[4].split(".");var punyencoded='';for(var i=0;i<host.length;i++){punyencoded=Tools.Widget.Utils.punycode_encode(host[i],64);if(!punyencoded){return false;}else{if(punyencoded!=(host[i]+"-")){host[i]='xn--'+punyencoded;}}}
host=host.join(".");value=value.replace(URI_spliter,"$1//"+host+"$5$6$8");}
var regExp=/^(?:https?|ftp)\:\/\/(?:(?:[a-z0-9\-\._~\!\$\&\'\(\)\*\+\,\;\=:]|%[0-9a-f]{2,2})*\@)?(?:((?:(?:[a-z0-9][a-z0-9\-]*[a-z0-9]|[a-z0-9])\.)*(?:[a-z][a-z0-9\-]*[a-z0-9]|[a-z])|(?:\[[^\]]*\]))(?:\:[0-9]*)?)(?:\/(?:[a-z0-9\-\._~\!\$\&\'\(\)\*\+\,\;\=\:\@]|%[0-9a-f]{2,2})*)*(?:\?(?:[a-z0-9\-\._~\!\$\&\'\(\)\*\+\,\;\=\:\@\/\?]|%[0-9a-f]{2,2})*)?(?:\#(?:[a-z0-9\-\._~\!\$\&\'\(\)\*\+\,\;\=\:\@\/\?]|%[0-9a-f]{2,2})*)?$/i;var valid=value.match(regExp);if(valid){var address=valid[1];if(address){if(address=='[]'){return false;}
if(address.charAt(0)=='['){address=address.replace(/^\[|\]$/gi,'');return Tools.Widget.ValidationTextField.validateIP(address,'ipv6_ipv4');}else{if(/[^0-9\.]/.test(address)){return true;}else{return Tools.Widget.ValidationTextField.validateIP(address,'ipv4');}}}else{return true;}}else{return false;}}}};Tools.Widget.ValidationTextField.validateIP=function(value,format)
{var validIPv6Addresses=[/^(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}(?:\/\d{1,3})?$/i,/^[a-f0-9]{0,4}::(?:\/\d{1,3})?$/i,/^:(?::[a-f0-9]{1,4}){1,6}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){1,6}:(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:)(?::[a-f0-9]{1,4}){1,6}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){2}(?::[a-f0-9]{1,4}){1,5}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){3}(?::[a-f0-9]{1,4}){1,4}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){4}(?::[a-f0-9]{1,4}){1,3}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){5}(?::[a-f0-9]{1,4}){1,2}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){6}(?::[a-f0-9]{1,4})(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){6}(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,/^:(?::[a-f0-9]{1,4}){0,4}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){1,5}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:)(?::[a-f0-9]{1,4}){1,4}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){2}(?::[a-f0-9]{1,4}){1,3}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){3}(?::[a-f0-9]{1,4}){1,2}:(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i,/^(?:[a-f0-9]{1,4}:){4}(?::[a-f0-9]{1,4}):(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,3})?$/i];var validIPv4Addresses=[/^(\d{1,3}\.){3}\d{1,3}$/i];var validAddresses=[];if(format=='ipv6'||format=='ipv6_ipv4'){validAddresses=validAddresses.concat(validIPv6Addresses);}
if(format=='ipv4'||format=='ipv6_ipv4'){validAddresses=validAddresses.concat(validIPv4Addresses);}
var ret=false;for(var i=0;i<validAddresses.length;i++){if(validAddresses[i].test(value)){ret=true;break;}}
if(ret&&value.indexOf(".")!=-1){var ipv4=value.match(/:?(?:\d{1,3}\.){3}\d{1,3}/i);if(!ipv4){return false;}
ipv4=ipv4[0].replace(/^:/,'');var pieces=ipv4.split('.');if(pieces.length!=4){return false;}
var regExp=/^[\-\+]?\d*$/;for(var i=0;i<pieces.length;i++){if(pieces[i]==''){return false;}
var piece=parseInt(pieces[i],10);if(isNaN(piece)||piece>255||!regExp.test(pieces[i])||pieces[i].length>3||/^0{2,3}$/.test(pieces[i])){return false;}}}
if(ret&&value.indexOf("/")!=-1){var prefLen=value.match(/\/\d{1,3}$/);if(!prefLen)return false;var prefLenVal=parseInt(prefLen[0].replace(/^\//,''),10);if(isNaN(prefLenVal)||prefLenVal>128||prefLenVal<1){return false;}}
return ret;};Tools.Widget.ValidationTextField.onloadDidFire=false;Tools.Widget.ValidationTextField.loadQueue=[];Tools.Widget.ValidationTextField.prototype.isBrowserSupported=function()
{return Tools.is.ie&&Tools.is.v>=5&&Tools.is.windows||Tools.is.mozilla&&Tools.is.v>=1.4||Tools.is.safari||Tools.is.opera&&Tools.is.v>=9;};Tools.Widget.ValidationTextField.prototype.init=function(element,options)
{this.element=this.getElement(element);this.errors=0;this.flags={locked:false,restoreSelection:true};this.options={};this.event_handlers=[];this.validClass="textfieldValidState";this.focusClass="textfieldFocusState";this.requiredClass="textfieldRequiredState";this.hintClass="textfieldHintState";this.invalidFormatClass="textfieldInvalidFormatState";this.invalidRangeMinClass="textfieldMinValueState";this.invalidRangeMaxClass="textfieldMaxValueState";this.invalidCharsMinClass="textfieldMinCharsState";this.invalidCharsMaxClass="textfieldMaxCharsState";this.textfieldFlashTextClass="textfieldFlashText";if(Tools.is.safari){this.flags.lastKeyPressedTimeStamp=0;}
switch(this.type){case'phone_number':options.format=Tools.Widget.Utils.firstValid(options.format,'phone_us');break;case'currency':options.format=Tools.Widget.Utils.firstValid(options.format,'comma_dot');break;case'zip_code':options.format=Tools.Widget.Utils.firstValid(options.format,'zip_us5');break;case'date':options.format=Tools.Widget.Utils.firstValid(options.format,'mm/dd/yy');break;case'time':options.format=Tools.Widget.Utils.firstValid(options.format,'HH:mm');options.pattern=options.format.replace(/[hms]/gi,"0").replace(/TT/gi,'AM').replace(/T/gi,'A');break;case'ip':options.format=Tools.Widget.Utils.firstValid(options.format,'ipv4');options.characterMasking=Tools.Widget.ValidationTextField.ValidationDescriptors[this.type].characterMaskingFormats[options.format];break;}
var validationDescriptor={};if(options.format&&Tools.Widget.ValidationTextField.ValidationDescriptors[this.type].formats){if(Tools.Widget.ValidationTextField.ValidationDescriptors[this.type].formats[options.format]){Tools.Widget.Utils.setOptions(validationDescriptor,Tools.Widget.ValidationTextField.ValidationDescriptors[this.type].formats[options.format]);}}else{Tools.Widget.Utils.setOptions(validationDescriptor,Tools.Widget.ValidationTextField.ValidationDescriptors[this.type]);}
options.useCharacterMasking=Tools.Widget.Utils.firstValid(options.useCharacterMasking,false);options.hint=Tools.Widget.Utils.firstValid(options.hint,'');options.isRequired=Tools.Widget.Utils.firstValid(options.isRequired,true);options.additionalError=Tools.Widget.Utils.firstValid(options.additionalError,false);if(options.additionalError)
options.additionalError=this.getElement(options.additionalError);options.characterMasking=Tools.Widget.Utils.firstValid(options.characterMasking,validationDescriptor.characterMasking);options.regExpFilter=Tools.Widget.Utils.firstValid(options.regExpFilter,validationDescriptor.regExpFilter);options.pattern=Tools.Widget.Utils.firstValid(options.pattern,validationDescriptor.pattern);options.validation=Tools.Widget.Utils.firstValid(options.validation,validationDescriptor.validation);if(typeof options.validation=='string'){options.validation=eval(options.validation);}
options.minValue=Tools.Widget.Utils.firstValid(options.minValue,validationDescriptor.minValue);options.maxValue=Tools.Widget.Utils.firstValid(options.maxValue,validationDescriptor.maxValue);options.minChars=Tools.Widget.Utils.firstValid(options.minChars,validationDescriptor.minChars);options.maxChars=Tools.Widget.Utils.firstValid(options.maxChars,validationDescriptor.maxChars);Tools.Widget.Utils.setOptions(this,options);Tools.Widget.Utils.setOptions(this.options,options);};Tools.Widget.ValidationTextField.prototype.destroy=function(){if(this.event_handlers)
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.removeEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
try{delete this.element;}catch(err){}
try{delete this.input;}catch(err){}
try{delete this.form;}catch(err){}
try{delete this.event_handlers;}catch(err){}
try{this.selection.destroy();}catch(err){}
try{delete this.selection;}catch(err){}
var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(q[i]==this){q.splice(i,1);break;}}};Tools.Widget.ValidationTextField.prototype.attachBehaviors=function()
{if(this.element){if(this.element.nodeName=="INPUT"){this.input=this.element;}else{this.input=Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel(this.element,"INPUT");}}
if(this.input){if(this.maxChars){this.input.removeAttribute("maxLength");}
this.putHint();this.compilePattern();if(this.type=='date'){this.compileDatePattern();}
this.input.setAttribute("AutoComplete","off");this.selection=new Tools.Widget.SelectionDescriptor(this.input);this.oldValue=this.input.value;var self=this;this.event_handlers=[];this.event_handlers.push([this.input,"keydown",function(e){if(self.isDisabled())return true;return self.onKeyDown(e||event);}]);this.event_handlers.push([this.input,"keypress",function(e){if(self.isDisabled())return true;return self.onKeyPress(e||event);}]);if(Tools.is.opera){this.event_handlers.push([this.input,"keyup",function(e){if(self.isDisabled())return true;return self.onKeyUp(e||event);}]);}
this.event_handlers.push([this.input,"focus",function(e){if(self.isDisabled())return true;return self.onFocus(e||event);}]);this.event_handlers.push([this.input,"blur",function(e){if(self.isDisabled())return true;return self.onBlur(e||event);}]);this.event_handlers.push([this.input,"mousedown",function(e){if(self.isDisabled())return true;return self.onMouseDown(e||event);}]);var changeEvent=Tools.is.mozilla||Tools.is.opera||Tools.is.safari?"input":Tools.is.ie?"propertychange":"change";this.event_handlers.push([this.input,changeEvent,function(e){if(self.isDisabled())return true;return self.onChange(e||event);}]);if(Tools.is.mozilla||Tools.is.safari){this.event_handlers.push([this.input,"dragdrop",function(e){if(self.isDisabled())return true;self.removeHint();return self.onChange(e||event);}]);}else if(Tools.is.ie){this.event_handlers.push([this.input,"drop",function(e){if(self.isDisabled())return true;return self.onDrop(e||event);}]);}
for(var i=0;i<this.event_handlers.length;i++){Tools.Widget.Utils.addEventListener(this.event_handlers[i][0],this.event_handlers[i][1],this.event_handlers[i][2],false);}
this.form=Tools.Widget.Utils.getFirstParentWithNodeName(this.input,"FORM");if(this.form){if(!this.form.attachedSubmitHandler&&!this.form.onsubmit){this.form.onsubmit=function(e){e=e||event;return Tools.Widget.Form.onSubmit(e,e.srcElement||e.currentTarget)};this.form.attachedSubmitHandler=true;}
if(!this.form.attachedResetHandler){Tools.Widget.Utils.addEventListener(this.form,"reset",function(e){e=e||event;return Tools.Widget.Form.onReset(e,e.srcElement||e.currentTarget)},false);this.form.attachedResetHandler=true;}
Tools.Widget.Form.onSubmitWidgetQueue.push(this);}}};Tools.Widget.ValidationTextField.prototype.isDisabled=function(){return this.input&&(this.input.disabled||this.input.readOnly)||!this.input;};Tools.Widget.ValidationTextField.prototype.getElement=function(ele)
{if(ele&&typeof ele=="string")
return document.getElementById(ele);return ele;};Tools.Widget.ValidationTextField.addLoadListener=function(handler)
{if(typeof window.addEventListener!='undefined')
window.addEventListener('load',handler,false);else if(typeof document.addEventListener!='undefined')
document.addEventListener('load',handler,false);else if(typeof window.attachEvent!='undefined')
window.attachEvent('onload',handler);};Tools.Widget.ValidationTextField.processLoadQueue=function(handler)
{Tools.Widget.ValidationTextField.onloadDidFire=true;var q=Tools.Widget.ValidationTextField.loadQueue;var qlen=q.length;for(var i=0;i<qlen;i++)
q[i].attachBehaviors();};Tools.Widget.ValidationTextField.addLoadListener(Tools.Widget.ValidationTextField.processLoadQueue);Tools.Widget.ValidationTextField.addLoadListener(function(){Tools.Widget.Utils.addEventListener(window,"unload",Tools.Widget.Form.destroyAll,false);});Tools.Widget.ValidationTextField.prototype.setValue=function(newValue){this.flags.locked=true;this.input.value=newValue;this.flags.locked=false;this.oldValue=newValue;if(!Tools.is.ie){this.onChange();}};Tools.Widget.ValidationTextField.prototype.saveState=function()
{this.oldValue=this.input.value;this.selection.update();};Tools.Widget.ValidationTextField.prototype.revertState=function(revertValue)
{if(revertValue!=this.input.value){this.input.readOnly=true;this.input.value=revertValue;this.input.readOnly=false;if(Tools.is.safari&&this.flags.active){this.input.focus();}}
if(this.flags.restoreSelection){this.selection.moveTo(this.selection.start,this.selection.end);}
this.redTextFlash();};Tools.Widget.ValidationTextField.prototype.removeHint=function()
{if(this.flags.hintOn){this.input.value="";this.flags.hintOn=false;this.removeClassName(this.element,this.hintClass);this.removeClassName(this.additionalError,this.hintClass);}};Tools.Widget.ValidationTextField.prototype.putHint=function()
{if(this.hint&&this.input&&this.input.type=="text"&&this.input.value==""){this.flags.hintOn=true;this.input.value=this.hint;this.addClassName(this.element,this.hintClass);this.addClassName(this.additionalError,this.hintClass);}};Tools.Widget.ValidationTextField.prototype.redTextFlash=function()
{var self=this;this.addClassName(this.element,this.textfieldFlashTextClass);setTimeout(function(){self.removeClassName(self.element,self.textfieldFlashTextClass)},100);};Tools.Widget.ValidationTextField.prototype.doValidations=function(testValue,revertValue)
{if(this.isDisabled())return false;if(this.flags.locked){return false;}
if(testValue.length==0&&!this.isRequired){this.errors=0;return false;}
this.flags.locked=true;var mustRevert=false;var continueValidations=true;if(!this.options.isRequired&&testValue.length==0){continueValidations=false;}
var errors=0;var fixedValue=testValue;if(this.useCharacterMasking&&this.characterMasking){for(var i=0;i<testValue.length;i++){if(!this.characterMasking.test(testValue.charAt(i))){errors=errors|Tools.Widget.ValidationTextField.ERROR_FORMAT;fixedValue=revertValue;mustRevert=true;break;}}}
if(!mustRevert&&this.useCharacterMasking&&this.regExpFilter){if(!this.regExpFilter.test(fixedValue)){errors=errors|Tools.Widget.ValidationTextField.ERROR_FORMAT;mustRevert=true;}}
if(!mustRevert&&this.pattern){var currentRegExp=this.patternToRegExp(testValue.length);if(!currentRegExp.test(testValue)){errors=errors|Tools.Widget.ValidationTextField.ERROR_FORMAT;mustRevert=true;}else if(this.patternLength!=testValue.length){errors=errors|Tools.Widget.ValidationTextField.ERROR_FORMAT;}}
if(fixedValue==''){errors=errors|Tools.Widget.ValidationTextField.ERROR_REQUIRED;}
if(!mustRevert&&this.pattern&&this.useCharacterMasking){var n=this.getAutoComplete(testValue.length);if(n){fixedValue+=n;}}
if(!mustRevert&&this.minChars!==null&&continueValidations){if(testValue.length<this.minChars){errors=errors|Tools.Widget.ValidationTextField.ERROR_CHARS_MIN;continueValidations=false;}}
if(!mustRevert&&this.maxChars!==null&&continueValidations){if(testValue.length>this.maxChars){errors=errors|Tools.Widget.ValidationTextField.ERROR_CHARS_MAX;continueValidations=false;}}
if(!mustRevert&&this.validation&&continueValidations){var value=this.validation(fixedValue,this.options);if(false===value){errors=errors|Tools.Widget.ValidationTextField.ERROR_FORMAT;continueValidations=false;}else{this.typedValue=value;}}
if(!mustRevert&&this.validation&&this.minValue!==null&&continueValidations){var minValue=this.validation(this.minValue.toString(),this.options);if(minValue!==false){if(this.typedValue<minValue){errors=errors|Tools.Widget.ValidationTextField.ERROR_RANGE_MIN;continueValidations=false;}}}
if(!mustRevert&&this.validation&&this.maxValue!==null&&continueValidations){var maxValue=this.validation(this.maxValue.toString(),this.options);if(maxValue!==false){if(this.typedValue>maxValue){errors=errors|Tools.Widget.ValidationTextField.ERROR_RANGE_MAX;continueValidations=false;}}}
if(this.useCharacterMasking&&mustRevert){this.revertState(revertValue);}
this.errors=errors;this.fixedValue=fixedValue;this.flags.locked=false;return mustRevert;};Tools.Widget.ValidationTextField.prototype.onChange=function(e)
{if(Tools.is.opera&&this.flags.operaRevertOnKeyUp){return true;}
if(Tools.is.ie&&e&&e.propertyName!='value'){return true;}
if(this.flags.drop){var self=this;setTimeout(function(){self.flags.drop=false;self.onChange(null);},0);return;}
if(this.flags.hintOn){return true;}
if(this.keyCode==8||this.keyCode==46){var mustRevert=this.doValidations(this.input.value,this.input.value);this.oldValue=this.input.value;if((mustRevert||this.errors)&&this.validateOn&Tools.Widget.ValidationTextField.ONCHANGE){var self=this;setTimeout(function(){self.validate();},0);return true;}}
var mustRevert=this.doValidations(this.input.value,this.oldValue);if((!mustRevert||this.errors)&&this.validateOn&Tools.Widget.ValidationTextField.ONCHANGE){var self=this;setTimeout(function(){self.validate();},0);}
return true;};Tools.Widget.ValidationTextField.prototype.onKeyUp=function(e){if(this.flags.operaRevertOnKeyUp){this.setValue(this.oldValue);Tools.Widget.Utils.stopEvent(e);this.selection.moveTo(this.selection.start,this.selection.start);this.flags.operaRevertOnKeyUp=false;return false;}
if(this.flags.operaPasteOperation){window.clearInterval(this.flags.operaPasteOperation);this.flags.operaPasteOperation=null;}};Tools.Widget.ValidationTextField.prototype.operaPasteMonitor=function(){if(this.input.value!=this.oldValue){var mustRevert=this.doValidations(this.input.value,this.input.value);if(mustRevert){this.setValue(this.oldValue);this.selection.moveTo(this.selection.start,this.selection.start);}else{this.onChange();}}};Tools.Widget.ValidationTextField.prototype.compileDatePattern=function()
{var dateValidationPatternString="";var groupPatterns=[];var fullGroupPatterns=[];var autocompleteCharacters=[];var formatRegExp=/^([mdy]+)([\.\-\/\\\s]+)([mdy]+)([\.\-\/\\\s]+)([mdy]+)$/i;var formatGroups=this.options.format.match(formatRegExp);if(formatGroups!==null){for(var i=1;i<formatGroups.length;i++){switch(formatGroups[i].toLowerCase()){case"dd":groupPatterns[i-1]="\\d{1,2}";fullGroupPatterns[i-1]="\\d\\d";dateValidationPatternString+="("+groupPatterns[i-1]+")";autocompleteCharacters[i-1]=null;break;case"mm":groupPatterns[i-1]="\\d{1,2}";fullGroupPatterns[i-1]="\\d\\d";dateValidationPatternString+="("+groupPatterns[i-1]+")";autocompleteCharacters[i-1]=null;break;case"yy":groupPatterns[i-1]="\\d{1,2}";fullGroupPatterns[i-1]="\\d\\d";dateValidationPatternString+="(\\d\\d)";autocompleteCharacters[i-1]=null;break;case"yyyy":groupPatterns[i-1]="\\d{1,4}";fullGroupPatterns[i-1]="\\d\\d\\d\\d";dateValidationPatternString+="(\\d\\d\\d\\d)";autocompleteCharacters[i-1]=null;break;default:groupPatterns[i-1]=fullGroupPatterns[i-1]=Tools.Widget.ValidationTextField.regExpFromChars(formatGroups[i]);dateValidationPatternString+="["+groupPatterns[i-1]+"]";autocompleteCharacters[i-1]=formatGroups[i];}}}
this.dateValidationPattern=new RegExp("^"+dateValidationPatternString+"$","");this.dateAutocompleteCharacters=autocompleteCharacters;this.dateGroupPatterns=groupPatterns;this.dateFullGroupPatterns=fullGroupPatterns;this.lastDateGroup=formatGroups.length-2;};Tools.Widget.ValidationTextField.prototype.getRegExpForGroup=function(group)
{var ret='^';for(var j=0;j<=group;j++)ret+=this.dateGroupPatterns[j];ret+='$';return new RegExp(ret,"");};Tools.Widget.ValidationTextField.prototype.getRegExpForFullGroup=function(group)
{var ret='^';for(var j=0;j<group;j++)ret+=this.dateGroupPatterns[j];ret+=this.dateFullGroupPatterns[group];return new RegExp(ret,"");};Tools.Widget.ValidationTextField.prototype.getDateGroup=function(value,pos)
{if(pos==0)return 0;var test_value=value.substring(0,pos);for(var i=0;i<=this.lastDateGroup;i++)
if(this.getRegExpForGroup(i).test(test_value))return i;return-1;};Tools.Widget.ValidationTextField.prototype.isDateGroupFull=function(value,group)
{return this.getRegExpForFullGroup(group).test(value);};Tools.Widget.ValidationTextField.prototype.isValueValid=function(value,pos,group)
{var test_value=value.substring(0,pos);return this.getRegExpForGroup(group).test(test_value);};Tools.Widget.ValidationTextField.prototype.isPositionAtEndOfGroup=function(value,pos,group)
{var test_value=value.substring(0,pos);return this.getRegExpForFullGroup(group).test(test_value);};Tools.Widget.ValidationTextField.prototype.nextDateDelimiterExists=function(value,pos,group)
{var autocomplete=this.dateAutocompleteCharacters[group+1];if(value.length<pos+autocomplete.length)
return false;else
{var test_value=value.substring(pos,pos+autocomplete.length);if(test_value==autocomplete)
return true;}
return false;};Tools.Widget.ValidationTextField.prototype.onKeyPress=function(e)
{if(this.flags.skp){this.flags.skp=false;Tools.Widget.Utils.stopEvent(e);return false;}
if(e.ctrlKey||e.metaKey||!this.useCharacterMasking){return true;}
if(Tools.is.opera&&this.flags.operaRevertOnKeyUp){Tools.Widget.Utils.stopEvent(e);return false;}
if(this.keyCode==8||this.keyCode==46){var mr=this.doValidations(this.input.value,this.input.value);if(mr){return true;}}
var pressed=Tools.Widget.Utils.getCharacterFromEvent(e);if(pressed&&this.characterMasking){if(!this.characterMasking.test(pressed)){Tools.Widget.Utils.stopEvent(e);this.redTextFlash();return false;}}
if(pressed&&this.pattern){var currentPatternChar=this.patternCharacters[this.selection.start];if(/[ax]/i.test(currentPatternChar)){if(currentPatternChar.toLowerCase()==currentPatternChar){pressed=pressed.toLowerCase();}else{pressed=pressed.toUpperCase();}}
var autocomplete=this.getAutoComplete(this.selection.start);if(this.selection.start==this.oldValue.length){if(this.oldValue.length<this.patternLength){if(autocomplete){Tools.Widget.Utils.stopEvent(e);var futureValue=this.oldValue.substring(0,this.selection.start)+autocomplete+pressed;var mustRevert=this.doValidations(futureValue,this.oldValue);if(!mustRevert){this.setValue(this.fixedValue);this.selection.moveTo(this.fixedValue.length,this.fixedValue.length);}else{this.setValue(this.oldValue.substring(0,this.selection.start)+autocomplete);this.selection.moveTo(this.selection.start+autocomplete.length,this.selection.start+autocomplete.length);}
return false;}}else{Tools.Widget.Utils.stopEvent(e);this.setValue(this.input.value);return false;}}else if(autocomplete){Tools.Widget.Utils.stopEvent(e);this.selection.moveTo(this.selection.start+autocomplete.length,this.selection.start+autocomplete.length);return false;}
Tools.Widget.Utils.stopEvent(e);var futureValue=this.oldValue.substring(0,this.selection.start)+pressed+this.oldValue.substring(this.selection.start+1);var mustRevert=this.doValidations(futureValue,this.oldValue);if(!mustRevert){autocomplete=this.getAutoComplete(this.selection.start+1);this.setValue(this.fixedValue);this.selection.moveTo(this.selection.start+1+autocomplete.length,this.selection.start+1+autocomplete.length);}else{this.selection.moveTo(this.selection.start,this.selection.start);}
return false;}
if(pressed&&this.type=='date'&&this.useCharacterMasking)
{var group=this.getDateGroup(this.oldValue,this.selection.start);if(group!=-1){Tools.Widget.Utils.stopEvent(e);if((group%2)!=0)
group++;if(this.isDateGroupFull(this.oldValue,group))
{if(this.isPositionAtEndOfGroup(this.oldValue,this.selection.start,group))
{if(group==this.lastDateGroup)
{this.redTextFlash();return false;}
else
{var autocomplete=this.dateAutocompleteCharacters[group+1];if(this.nextDateDelimiterExists(this.oldValue,this.selection.start,group))
{var autocomplete=this.dateAutocompleteCharacters[group+1];this.selection.moveTo(this.selection.start+autocomplete.length,this.selection.start+autocomplete.length);if(pressed==autocomplete)
return false;if(this.isDateGroupFull(this.oldValue,group+2))
futureValue=this.oldValue.substring(0,this.selection.start)+pressed+this.oldValue.substring(this.selection.start+1);else
futureValue=this.oldValue.substring(0,this.selection.start)+pressed+this.oldValue.substring(this.selection.start);if(!this.isValueValid(futureValue,this.selection.start+1,group+2))
{this.redTextFlash();return false;}
else
{this.setValue(futureValue);this.selection.moveTo(this.selection.start+1,this.selection.start+1);}
return false;}
else
{var autocomplete=this.dateAutocompleteCharacters[group+1];var insertedValue=autocomplete+pressed;futureValue=this.oldValue.substring(0,this.selection.start)+insertedValue+this.oldValue.substring(this.selection.start);if(!this.isValueValid(futureValue,this.selection.start+insertedValue.length,group+2))
{insertedValue=autocomplete;futureValue=this.oldValue.substring(0,this.selection.start)+insertedValue+this.oldValue.substring(this.selection.start);this.setValue(futureValue);this.selection.moveTo(this.selection.start+insertedValue.length,this.selection.start+insertedValue.length);this.redTextFlash();return false;}
else
{this.setValue(futureValue);this.selection.moveTo(this.selection.start+insertedValue.length,this.selection.start+insertedValue.length);return false;}}}}
else
{var movePosition=1;futureValue=this.oldValue.substring(0,this.selection.start)+pressed+this.oldValue.substring(this.selection.start+1);if(!this.isValueValid(futureValue,this.selection.start+1,group))
{this.redTextFlash();return false;}
else
{if(this.isPositionAtEndOfGroup(futureValue,this.selection.start+1,group))
{if(group!=this.lastDateGroup)
{if(this.nextDateDelimiterExists(futureValue,this.selection.start+1,group))
{var autocomplete=this.dateAutocompleteCharacters[group+1];movePosition=1+autocomplete.length;}
else
{var autocomplete=this.dateAutocompleteCharacters[group+1];futureValue=this.oldValue.substring(0,this.selection.start)+pressed+autocomplete+this.oldValue.substring(this.selection.start+1);movePosition=1+autocomplete.length;}}}
this.setValue(futureValue);this.selection.moveTo(this.selection.start+movePosition,this.selection.start+movePosition);return false;}}}
else
{futureValue=this.oldValue.substring(0,this.selection.start)+pressed+this.oldValue.substring(this.selection.start);var movePosition=1;if(!this.isValueValid(futureValue,this.selection.start+1,group)&&!this.isValueValid(futureValue,this.selection.start+1,group+1))
{this.redTextFlash();return false;}
else
{var autocomplete=this.dateAutocompleteCharacters[group+1];if(pressed==autocomplete)
{if(this.nextDateDelimiterExists(this.oldValue,this.selection.start,group))
{futureValue=this.oldValue;movePosition=1;}}
else
{if(this.isPositionAtEndOfGroup(futureValue,this.selection.start+1,group))
{if(group!=this.lastDateGroup)
{if(this.nextDateDelimiterExists(futureValue,this.selection.start+1,group))
{var autocomplete=this.dateAutocompleteCharacters[group+1];movePosition=1+autocomplete.length;}
else
{var autocomplete=this.dateAutocompleteCharacters[group+1];futureValue=this.oldValue.substring(0,this.selection.start)+pressed+autocomplete+this.oldValue.substring(this.selection.start+1);movePosition=1+autocomplete.length;}}}}
this.setValue(futureValue);this.selection.moveTo(this.selection.start+movePosition,this.selection.start+movePosition);return false;}}}
return false;}};Tools.Widget.ValidationTextField.prototype.onKeyDown=function(e)
{this.saveState();this.keyCode=e.keyCode;if(Tools.is.opera){if(this.flags.operaPasteOperation){window.clearInterval(this.flags.operaPasteOperation);this.flags.operaPasteOperation=null;}
if(e.ctrlKey){var pressed=Tools.Widget.Utils.getCharacterFromEvent(e);if(pressed&&'vx'.indexOf(pressed.toLowerCase())!=-1){var self=this;this.flags.operaPasteOperation=window.setInterval(function(){self.operaPasteMonitor();},1);return true;}}}
if(this.keyCode!=8&&this.keyCode!=46&&Tools.Widget.Utils.isSpecialKey(e)){return true;}
if(this.keyCode==8||this.keyCode==46){var mr=this.doValidations(this.input.value,this.input.value);if(mr){return true;}}
if(this.useCharacterMasking&&this.pattern&&this.keyCode==46){if(e.ctrlKey){this.setValue(this.input.value.substring(0,this.selection.start));}else if(this.selection.end==this.input.value.length||this.selection.start==this.input.value.length-1){return true;}else{this.flags.operaRevertOnKeyUp=true;}
if(Tools.is.mozilla&&Tools.is.mac){this.flags.skp=true;}
Tools.Widget.Utils.stopEvent(e);return false;}
if(this.useCharacterMasking&&this.pattern&&!e.ctrlKey&&this.keyCode==8){if(this.selection.start==this.input.value.length){var n=this.getAutoComplete(this.selection.start,-1);this.setValue(this.input.value.substring(0,this.input.value.length-(Tools.is.opera?0:1)-n.length));if(Tools.is.opera){this.selection.start=this.selection.start-1-n.length;this.selection.end=this.selection.end-1-n.length;}}else if(this.selection.end==this.input.value.length){return true;}else{this.flags.operaRevertOnKeyUp=true;}
if(Tools.is.mozilla&&Tools.is.mac){this.flags.skp=true;}
Tools.Widget.Utils.stopEvent(e);return false;}
return true;};Tools.Widget.ValidationTextField.prototype.onMouseDown=function(e)
{if(this.flags.active){this.saveState();}};Tools.Widget.ValidationTextField.prototype.onDrop=function(e)
{this.flags.drop=true;this.removeHint();this.saveState();this.flags.active=true;this.addClassName(this.element,this.focusClass);this.addClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationTextField.prototype.onFocus=function(e)
{if(this.flags.drop){return;}
this.removeHint();if(this.pattern&&this.useCharacterMasking){var autocomplete=this.getAutoComplete(this.selection.start);this.setValue(this.input.value+autocomplete);this.selection.moveTo(this.input.value.length,this.input.value.length);}
this.saveState();this.flags.active=true;this.addClassName(this.element,this.focusClass);this.addClassName(this.additionalError,this.focusClass);};Tools.Widget.ValidationTextField.prototype.onBlur=function(e)
{this.flags.active=false;this.removeClassName(this.element,this.focusClass);this.removeClassName(this.additionalError,this.focusClass);this.flags.restoreSelection=false;var mustRevert=this.doValidations(this.input.value,this.input.value);this.flags.restoreSelection=true;if(this.validateOn&Tools.Widget.ValidationTextField.ONBLUR){this.validate();}
var self=this;setTimeout(function(){self.putHint();},10);return true;};Tools.Widget.ValidationTextField.prototype.compilePattern=function(){if(!this.pattern){return;}
var compiled=[];var regexps=[];var patternCharacters=[];var idx=0;var c='',p='';for(var i=0;i<this.pattern.length;i++){c=this.pattern.charAt(i);if(p=='\\'){if(/[0ABXY\?]/i.test(c)){regexps[idx-1]=c;}else{regexps[idx-1]=Tools.Widget.ValidationTextField.regExpFromChars(c);}
compiled[idx-1]=c;patternCharacters[idx-1]=null;p='';continue;}
regexps[idx]=Tools.Widget.ValidationTextField.regExpFromChars(c);if(/[0ABXY\?]/i.test(c)){compiled[idx]=null;patternCharacters[idx]=c;}else if(c=='\\'){compiled[idx]=c;patternCharacters[idx]='\\';}else{compiled[idx]=c;patternCharacters[idx]=null;}
idx++;p=c;}
this.autoCompleteCharacters=compiled;this.compiledPattern=regexps;this.patternCharacters=patternCharacters;this.patternLength=compiled.length;};Tools.Widget.ValidationTextField.prototype.getAutoComplete=function(from,direction){if(direction==-1){var n='',m='';while(from&&(n=this.getAutoComplete(--from))){m=n;}
return m;}
var ret='',c='';for(var i=from;i<this.autoCompleteCharacters.length;i++){c=this.autoCompleteCharacters[i];if(c){ret+=c;}else{break;}}
return ret;};Tools.Widget.ValidationTextField.regExpFromChars=function(string){var ret='',character='';for(var i=0;i<string.length;i++){character=string.charAt(i);switch(character){case'0':ret+='\\d';break;case'A':ret+='[A-Z]';break;case'a':ret+='[a-z]';break;case'B':case'b':ret+='[a-zA-Z]';break;case'x':ret+='[0-9a-z]';break;case'X':ret+='[0-9A-Z]';break;case'Y':case'y':ret+='[0-9a-zA-Z]';break;case'?':ret+='.';break;case'1':case'2':case'3':case'4':case'5':case'6':case'7':case'8':case'9':ret+=character;break;case'c':case'C':case'e':case'E':case'f':case'F':case'r':case'd':case'D':case'n':case's':case'S':case'w':case'W':case't':case'v':ret+=character;break;default:ret+='\\'+character;}}
return ret;};Tools.Widget.ValidationTextField.prototype.patternToRegExp=function(len){var ret='^';var end=Math.min(this.compiledPattern.length,len);for(var i=0;i<end;i++){ret+=this.compiledPattern[i];}
ret+='$';ret=new RegExp(ret,"");return ret;};Tools.Widget.ValidationTextField.prototype.resetClasses=function(){var classes=[this.requiredClass,this.invalidFormatClass,this.invalidRangeMinClass,this.invalidRangeMaxClass,this.invalidCharsMinClass,this.invalidCharsMaxClass,this.validClass];for(var i=0;i<classes.length;i++)
{this.removeClassName(this.element,classes[i]);this.removeClassName(this.additionalError,classes[i]);}};Tools.Widget.ValidationTextField.prototype.reset=function(){this.removeHint();this.oldValue=this.input.defaultValue;this.resetClasses();if(Tools.is.ie){this.input.forceFireFirstOnPropertyChange=true;this.input.removeAttribute("forceFireFirstOnPropertyChange");}
var self=this;setTimeout(function(){self.putHint();},10);};Tools.Widget.ValidationTextField.prototype.validate=function(){this.resetClasses();if(this.validateOn&Tools.Widget.ValidationTextField.ONSUBMIT){this.removeHint();this.doValidations(this.input.value,this.input.value);if(!this.flags.active){var self=this;setTimeout(function(){self.putHint();},10);}}
if(this.isRequired&&this.errors&Tools.Widget.ValidationTextField.ERROR_REQUIRED){this.addClassName(this.element,this.requiredClass);this.addClassName(this.additionalError,this.requiredClass);return false;}
if(this.errors&Tools.Widget.ValidationTextField.ERROR_FORMAT){this.addClassName(this.element,this.invalidFormatClass);this.addClassName(this.additionalError,this.invalidFormatClass);return false;}
if(this.errors&Tools.Widget.ValidationTextField.ERROR_RANGE_MIN){this.addClassName(this.element,this.invalidRangeMinClass);this.addClassName(this.additionalError,this.invalidRangeMinClass);return false;}
if(this.errors&Tools.Widget.ValidationTextField.ERROR_RANGE_MAX){this.addClassName(this.element,this.invalidRangeMaxClass);this.addClassName(this.additionalError,this.invalidRangeMaxClass);return false;}
if(this.errors&Tools.Widget.ValidationTextField.ERROR_CHARS_MIN){this.addClassName(this.element,this.invalidCharsMinClass);this.addClassName(this.additionalError,this.invalidCharsMinClass);return false;}
if(this.errors&Tools.Widget.ValidationTextField.ERROR_CHARS_MAX){this.addClassName(this.element,this.invalidCharsMaxClass);this.addClassName(this.additionalError,this.invalidCharsMaxClass);return false;}
this.addClassName(this.element,this.validClass);this.addClassName(this.additionalError,this.validClass);return true;};Tools.Widget.ValidationTextField.prototype.addClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1))
return;ele.className+=(ele.className?" ":"")+className;};Tools.Widget.ValidationTextField.prototype.removeClassName=function(ele,className)
{if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1))
return;ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"");};Tools.Widget.ValidationTextField.prototype.showError=function(msg)
{alert('Tools.Widget.TextField ERR: '+msg);};Tools.Widget.SelectionDescriptor=function(element)
{this.element=element;this.update();};Tools.Widget.SelectionDescriptor.prototype.update=function()
{if(Tools.is.ie&&Tools.is.windows){var sel=this.element.ownerDocument.selection;if(this.element.nodeName=="TEXTAREA"){if(sel.type!='None'){try{var range=sel.createRange();}catch(err){return;}
if(range.parentElement()==this.element){var range_all=this.element.ownerDocument.body.createTextRange();range_all.moveToElementText(this.element);for(var sel_start=0;range_all.compareEndPoints('StartToStart',range)<0;sel_start++){range_all.moveStart('character',1);}
this.start=sel_start;range_all=this.element.ownerDocument.body.createTextRange();range_all.moveToElementText(this.element);for(var sel_end=0;range_all.compareEndPoints('StartToEnd',range)<0;sel_end++){range_all.moveStart('character',1);}
this.end=sel_end;this.length=this.end-this.start;this.text=range.text;}}}else if(this.element.nodeName=="INPUT"){try{this.range=sel.createRange();}catch(err){return;}
this.length=this.range.text.length;var clone=this.range.duplicate();this.start=-clone.moveStart("character",-10000);clone=this.range.duplicate();clone.collapse(false);this.end=-clone.moveStart("character",-10000);this.text=this.range.text;}}else{var tmp=this.element;var selectionStart=0;var selectionEnd=0;try{selectionStart=tmp.selectionStart;}catch(err){}
try{selectionEnd=tmp.selectionEnd;}catch(err){}
if(Tools.is.safari){if(selectionStart==2147483647){selectionStart=0;}
if(selectionEnd==2147483647){selectionEnd=0;}}
this.start=selectionStart;this.end=selectionEnd;this.length=selectionEnd-selectionStart;this.text=this.element.value.substring(selectionStart,selectionEnd);}};Tools.Widget.SelectionDescriptor.prototype.destroy=function(){try{delete this.range}catch(err){}
try{delete this.element}catch(err){}};Tools.Widget.SelectionDescriptor.prototype.move=function(amount)
{if(Tools.is.ie&&Tools.is.windows){this.range.move("character",amount);this.range.select();}else{try{this.element.selectionStart++;}catch(err){}}
this.update();};Tools.Widget.SelectionDescriptor.prototype.moveTo=function(start,end)
{if(Tools.is.ie&&Tools.is.windows){if(this.element.nodeName=="TEXTAREA"){var ta_range=this.element.createTextRange();this.range=this.element.createTextRange();this.range.move("character",start);this.range.moveEnd("character",end-start);var c1=this.range.compareEndPoints("StartToStart",ta_range);if(c1<0){this.range.setEndPoint("StartToStart",ta_range);}
var c2=this.range.compareEndPoints("EndToEnd",ta_range);if(c2>0){this.range.setEndPoint("EndToEnd",ta_range);}}else if(this.element.nodeName=="INPUT"){this.range=this.element.ownerDocument.selection.createRange();this.range.move("character",-10000);this.start=this.range.moveStart("character",start);this.end=this.start+this.range.moveEnd("character",end-start);}
this.range.select();}else{this.start=start;try{this.element.selectionStart=start;}catch(err){}
this.end=end;try{this.element.selectionEnd=end;}catch(err){}}
this.ignore=true;this.update();};Tools.Widget.SelectionDescriptor.prototype.moveEnd=function(amount)
{if(Tools.is.ie&&Tools.is.windows){this.range.moveEnd("character",amount);this.range.select();}else{try{this.element.selectionEnd++;}catch(err){}}
this.update();};Tools.Widget.SelectionDescriptor.prototype.collapse=function(begin)
{if(Tools.is.ie&&Tools.is.windows){this.range=this.element.ownerDocument.selection.createRange();this.range.collapse(begin);this.range.select();}else{if(begin){try{this.element.selectionEnd=this.element.selectionStart;}catch(err){}}else{try{this.element.selectionStart=this.element.selectionEnd;}catch(err){}}}
this.update();};if(!Tools.Widget.Form)Tools.Widget.Form={};if(!Tools.Widget.Form.onSubmitWidgetQueue)Tools.Widget.Form.onSubmitWidgetQueue=[];if(!Tools.Widget.Form.validate){Tools.Widget.Form.validate=function(vform){var isValid=true;var isElementValid=true;var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform){isElementValid=q[i].validate();isValid=isElementValid&&isValid;}}
return isValid;}};if(!Tools.Widget.Form.onSubmit){Tools.Widget.Form.onSubmit=function(e,form)
{if(Tools.Widget.Form.validate(form)==false){return false;}
return true;};};if(!Tools.Widget.Form.onReset){Tools.Widget.Form.onReset=function(e,vform)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;var qlen=q.length;for(var i=0;i<qlen;i++){if(!q[i].isDisabled()&&q[i].form==vform&&typeof(q[i].reset)=='function'){q[i].reset();}}
return true;};};if(!Tools.Widget.Form.destroy){Tools.Widget.Form.destroy=function(form)
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(q[i].form==form&&typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Form.destroyAll){Tools.Widget.Form.destroyAll=function()
{var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'){q[i].destroy();i--;}}}};if(!Tools.Widget.Utils)Tools.Widget.Utils={};Tools.Widget.Utils.punycode_constants={base:36,tmin:1,tmax:26,skew:38,damp:700,initial_bias:72,initial_n:0x80,delimiter:0x2D,maxint:2<<26-1};Tools.Widget.Utils.punycode_encode_digit=function(d){return String.fromCharCode(d+22+75*(d<26));};Tools.Widget.Utils.punycode_adapt=function(delta,numpoints,firsttime){delta=firsttime?delta/this.punycode_constants.damp:delta>>1;delta+=delta/numpoints;for(var k=0;delta>((this.punycode_constants.base-this.punycode_constants.tmin)*this.punycode_constants.tmax)/2;k+=this.punycode_constants.base){delta/=this.punycode_constants.base-this.punycode_constants.tmin;}
return k+(this.punycode_constants.base-this.punycode_constants.tmin+1)*delta/(delta+this.punycode_constants.skew);};Tools.Widget.Utils.punycode_encode=function(input,max_out){var inputc=input.split("");input=[];for(var i=0;i<inputc.length;i++){input.push(inputc[i].charCodeAt(0));}
var output='';var h,b,j,m,q,k,t;var input_len=input.length;var n=this.punycode_constants.initial_n;var delta=0;var bias=this.punycode_constants.initial_bias;var out=0;for(j=0;j<input_len;j++){if(input[j]<128){if(max_out-out<2){return false;}
output+=String.fromCharCode(input[j]);out++;}}
h=b=out;if(b>0){output+=String.fromCharCode(this.punycode_constants.delimiter);out++;}
while(h<input_len){for(m=this.punycode_constants.maxint,j=0;j<input_len;j++){if(input[j]>=n&&input[j]<m){m=input[j];}}
if(m-n>(this.punycode_constants.maxint-delta)/(h+1)){return false;}
delta+=(m-n)*(h+1);n=m;for(j=0;j<input_len;j++){if(input[j]<n){if(++delta==0){return false;}}
if(input[j]==n){for(q=delta,k=this.punycode_constants.base;true;k+=this.punycode_constants.base){if(out>=max_out){return false;}
t=k<=bias?this.punycode_constants.tmin:k>=bias+this.punycode_constants.tmax?this.punycode_constants.tmax:k-bias;if(q<t){break;}
output+=this.punycode_encode_digit(t+(q-t)%(this.punycode_constants.base-t));out++;q=(q-t)/(this.punycode_constants.base-t);}
output+=this.punycode_encode_digit(q);out++;bias=this.punycode_adapt(delta,h+1,h==b);delta=0;h++;}}
delta++,n++;}
return output;};Tools.Widget.Utils.setOptions=function(obj,optionsObj,ignoreUndefinedProps)
{if(!optionsObj)
return;for(var optionName in optionsObj)
{if(ignoreUndefinedProps&&optionsObj[optionName]==undefined)
continue;obj[optionName]=optionsObj[optionName];}};Tools.Widget.Utils.firstValid=function(){var ret=null;for(var i=0;i<Tools.Widget.Utils.firstValid.arguments.length;i++){if(typeof(Tools.Widget.Utils.firstValid.arguments[i])!='undefined'){ret=Tools.Widget.Utils.firstValid.arguments[i];break;}}
return ret;};Tools.Widget.Utils.specialCharacters=",8,9,16,17,18,20,27,33,34,35,36,37,38,40,45,144,192,63232,";Tools.Widget.Utils.specialSafariNavKeys="63232,63233,63234,63235,63272,63273,63275,63276,63277,63289,";Tools.Widget.Utils.specialNotSafariCharacters="39,46,91,92,93,";Tools.Widget.Utils.specialCharacters+=Tools.Widget.Utils.specialSafariNavKeys;if(!Tools.is.safari){Tools.Widget.Utils.specialCharacters+=Tools.Widget.Utils.specialNotSafariCharacters;}
Tools.Widget.Utils.isSpecialKey=function(ev){return Tools.Widget.Utils.specialCharacters.indexOf(","+ev.keyCode+",")!=-1;};Tools.Widget.Utils.getCharacterFromEvent=function(e){var keyDown=e.type=="keydown";var code=null;var character=null;if(Tools.is.mozilla&&!keyDown){if(e.charCode){character=String.fromCharCode(e.charCode);}else{code=e.keyCode;}}else{code=e.keyCode||e.which;if(code!=13){character=String.fromCharCode(code);}}
if(Tools.is.safari){if(keyDown){code=e.keyCode||e.which;character=String.fromCharCode(code);}else{code=e.keyCode||e.which;if(Tools.Widget.Utils.specialCharacters.indexOf(","+code+",")!=-1){character=null;}else{character=String.fromCharCode(code);}}}
if(Tools.is.opera){if(Tools.Widget.Utils.specialCharacters.indexOf(","+code+",")!=-1){character=null;}else{character=String.fromCharCode(code);}}
return character;};Tools.Widget.Utils.getFirstChildWithNodeNameAtAnyLevel=function(node,nodeName)
{var elements=node.getElementsByTagName(nodeName);if(elements){return elements[0];}
return null;};Tools.Widget.Utils.getFirstParentWithNodeName=function(node,nodeName)
{while(node.parentNode&&node.parentNode.nodeName.toLowerCase()!=nodeName.toLowerCase()&&node.parentNode.nodeName!='BODY'){node=node.parentNode;}
if(node.parentNode&&node.parentNode.nodeName.toLowerCase()==nodeName.toLowerCase()){return node.parentNode;}else{return null;}};Tools.Widget.Utils.destroyWidgets=function(container)
{if(typeof container=='string'){container=document.getElementById(container);}
var q=Tools.Widget.Form.onSubmitWidgetQueue;for(var i=0;i<Tools.Widget.Form.onSubmitWidgetQueue.length;i++){if(typeof(q[i].destroy)=='function'&&Tools.Widget.Utils.contains(container,q[i].element)){q[i].destroy();i--;}}};Tools.Widget.Utils.contains=function(who,what)
{if(typeof who.contains=='object'){return what&&who&&(who==what||who.contains(what));}else{var el=what;while(el){if(el==who){return true;}
el=el.parentNode;}
return false;}};Tools.Widget.Utils.addEventListener=function(element,eventType,handler,capture)
{try
{if(element.addEventListener)
element.addEventListener(eventType,handler,capture);else if(element.attachEvent)
element.attachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.removeEventListener=function(element,eventType,handler,capture)
{try
{if(element.removeEventListener)
element.removeEventListener(eventType,handler,capture);else if(element.detachEvent)
element.detachEvent("on"+eventType,handler,capture);}
catch(e){}};Tools.Widget.Utils.stopEvent=function(ev)
{try
{this.stopPropagation(ev);this.preventDefault(ev);}
catch(e){}};Tools.Widget.Utils.stopPropagation=function(ev)
{if(ev.stopPropagation)
{ev.stopPropagation();}
else
{ev.cancelBubble=true;}};Tools.Widget.Utils.preventDefault=function(ev)
{if(ev.preventDefault)
{ev.preventDefault();}
else
{ev.returnValue=false;}};
// ToolsXML.js - version 0.4 - Tools Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Tools;if(!Tools)Tools={};if(!Tools.XML)Tools.XML={};if(!Tools.XML.Schema)Tools.XML.Schema={};Tools.XML.Schema.Node=function(nodeName)
{this.nodeName=nodeName;this.isAttribute=false;this.appearsMoreThanOnce=false;this.children=new Array;};Tools.XML.Schema.Node.prototype.toString=function(indentStr)
{if(!indentStr)
indentStr="";var str=indentStr+this.nodeName;if(this.appearsMoreThanOnce)
str+=" (+)";str+="\n";var newIndentStr=indentStr+"    ";for(var $childName in this.children)
{var child=this.children[$childName];if(child.isAttribute)
str+=newIndentStr+child.nodeName+"\n";else
str+=child.toString(newIndentStr);}
return str;};Tools.XML.Schema.mapElementIntoSchemaNode=function(ele,schemaNode)
{if(!ele||!schemaNode)
return;var i=0;for(i=0;i<ele.attributes.length;i++)
{var attr=ele.attributes.item(i);if(attr&&attr.nodeType==2)
{var attrName="@"+attr.name;if(!schemaNode.children[attrName])
{var attrObj=new Tools.XML.Schema.Node(attrName);attrObj.isAttribute=true;schemaNode.children[attrName]=attrObj;}}}
var child=ele.firstChild;var namesSeenSoFar=new Array;while(child)
{if(child.nodeType==1)
{var childSchemaNode=schemaNode.children[child.nodeName];if(!childSchemaNode)
{childSchemaNode=new Tools.XML.Schema.Node(child.nodeName);if(childSchemaNode)
schemaNode.children[child.nodeName]=childSchemaNode;}
if(childSchemaNode)
{if(namesSeenSoFar[childSchemaNode.nodeName])
childSchemaNode.appearsMoreThanOnce=true;else
namesSeenSoFar[childSchemaNode.nodeName]=true;}
Tools.XML.Schema.mapElementIntoSchemaNode(child,childSchemaNode);}
child=child.nextSibling;}};Tools.XML.getSchemaForElement=function(ele)
{if(!ele)
return null;schemaNode=new Tools.XML.Schema.Node(ele.nodeName);Tools.XML.Schema.mapElementIntoSchemaNode(ele,schemaNode);return schemaNode;};Tools.XML.getSchema=function(xmlDoc)
{if(!xmlDoc)
return null;var node=xmlDoc.firstChild;while(node)
{if(node.nodeType==1)
break;node=node.nextSibling;}
return Tools.XML.getSchemaForElement(node);};Tools.XML.nodeHasValue=function(node)
{if(node)
{var child=node.firstChild;if(child&&child.nextSibling==null&&(child.nodeType==3||child.nodeType==4))
return true;}
return false;};Tools.XML.XObject=function()
{};Tools.XML.XObject.prototype._value=function()
{var val=this["#text"];if(val!=undefined)
return val;return this["#cdata-section"];};Tools.XML.XObject.prototype._hasValue=function()
{return this._value()!=undefined;};Tools.XML.XObject.prototype._valueIsText=function()
{return this["#text"]!=undefined;};Tools.XML.XObject.prototype._valueIsCData=function()
{return this["#cdata-section"]!=undefined;};Tools.XML.XObject.prototype._propertyIsArray=function(prop)
{var val=this[prop];if(val==undefined)
return false;return(typeof val=="object"&&val.constructor==Array);};Tools.XML.XObject.prototype._getPropertyAsArray=function(prop)
{var arr=[];var val=this[prop];if(val!=undefined)
{if(typeof val=="object"&&val.constructor==Array)
return val;arr.push(val);}
return arr;};Tools.XML.XObject.prototype._getProperties=function()
{var props=[];for(var p in this)
{if(!/^_/.test(p))
props.push(p);}
return props;};Tools.XML.nodeToObject=function(node)
{if(!node)
return null;var obj=new Tools.XML.XObject();for(var i=0;i<node.attributes.length;i++)
{var attr=node.attributes[i];var attrName="@"+attr.name;obj[attrName]=attr.value;}
var child;if(Tools.XML.nodeHasValue(node))
{try
{child=node.firstChild;if(child.nodeType==3)
obj[child.nodeName]=Tools.Utils.encodeEntities(child.data);else if(child.nodeType==4)
obj[child.nodeName]=child.data;}catch(e){Tools.Debug.reportError("Tools.XML.nodeToObject() exception caught: "+e+"\n");}}
else
{child=node.firstChild;while(child)
{if(child.nodeType==1)
{var isArray=false;var tagName=child.nodeName;if(obj[tagName])
{if(obj[tagName].constructor!=Array)
{var curValue=obj[tagName];obj[tagName]=new Array;obj[tagName].push(curValue);}
isArray=true;}
var childObj=Tools.XML.nodeToObject(child);if(isArray)
obj[tagName].push(childObj);else
obj[tagName]=childObj;}
child=child.nextSibling;}}
return obj;};Tools.XML.documentToObject=function(xmlDoc)
{var obj=null;if(xmlDoc&&xmlDoc.firstChild)
{var child=xmlDoc.firstChild;while(child)
{if(child.nodeType==1)
{obj=new Tools.XML.XObject();obj[child.nodeName]=Tools.XML.nodeToObject(child);break;}
child=child.nextSibling;}}
return obj;};
// xpath.js - version 0.7 - Tools Pre-Release 1.6.1
//
// Copyright 2006 Google Inc.
// All Rights Reserved

var REGEXP_UNICODE=function(){var tests=[' ','\u0120',-1,'!','\u0120',-1,'\u0120','\u0120',0,'\u0121','\u0120',-1,'\u0121','\u0120|\u0121',0,'\u0122','\u0120|\u0121',-1,'\u0120','[\u0120]',0,'\u0121','[\u0120]',-1,'\u0121','[\u0120\u0121]',0,'\u0122','[\u0120\u0121]',-1,'\u0121','[\u0120-\u0121]',0,'\u0122','[\u0120-\u0121]',-1];for(var i=0;i<tests.length;i+=3){if(tests[i].search(new RegExp(tests[i+1]))!=tests[i+2]){return false;}}
return true;}();var XML_S='[ \t\r\n]+';var XML_EQ='('+XML_S+')?=('+XML_S+')?';var XML_CHAR_REF='&#[0-9]+;|&#x[0-9a-fA-F]+;';var XML10_VERSION_INFO=XML_S+'version'+XML_EQ+'("1\\.0"|'+"'1\\.0')";var XML10_BASE_CHAR=(REGEXP_UNICODE)?'\u0041-\u005a\u0061-\u007a\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff'+'\u0100-\u0131\u0134-\u013e\u0141-\u0148\u014a-\u017e\u0180-\u01c3'+'\u01cd-\u01f0\u01f4-\u01f5\u01fa-\u0217\u0250-\u02a8\u02bb-\u02c1\u0386'+'\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03ce\u03d0-\u03d6\u03da\u03dc'+'\u03de\u03e0\u03e2-\u03f3\u0401-\u040c\u040e-\u044f\u0451-\u045c'+'\u045e-\u0481\u0490-\u04c4\u04c7-\u04c8\u04cb-\u04cc\u04d0-\u04eb'+'\u04ee-\u04f5\u04f8-\u04f9\u0531-\u0556\u0559\u0561-\u0586\u05d0-\u05ea'+'\u05f0-\u05f2\u0621-\u063a\u0641-\u064a\u0671-\u06b7\u06ba-\u06be'+'\u06c0-\u06ce\u06d0-\u06d3\u06d5\u06e5-\u06e6\u0905-\u0939\u093d'+'\u0958-\u0961\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2'+'\u09b6-\u09b9\u09dc-\u09dd\u09df-\u09e1\u09f0-\u09f1\u0a05-\u0a0a'+'\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36'+'\u0a38-\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8b\u0a8d'+'\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9'+'\u0abd\u0ae0\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30'+'\u0b32-\u0b33\u0b36-\u0b39\u0b3d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b85-\u0b8a'+'\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4'+'\u0ba8-\u0baa\u0bae-\u0bb5\u0bb7-\u0bb9\u0c05-\u0c0c\u0c0e-\u0c10'+'\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c60-\u0c61\u0c85-\u0c8c'+'\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cde\u0ce0-\u0ce1'+'\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d60-\u0d61'+'\u0e01-\u0e2e\u0e30\u0e32-\u0e33\u0e40-\u0e45\u0e81-\u0e82\u0e84'+'\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5'+'\u0ea7\u0eaa-\u0eab\u0ead-\u0eae\u0eb0\u0eb2-\u0eb3\u0ebd\u0ec0-\u0ec4'+'\u0f40-\u0f47\u0f49-\u0f69\u10a0-\u10c5\u10d0-\u10f6\u1100\u1102-\u1103'+'\u1105-\u1107\u1109\u110b-\u110c\u110e-\u1112\u113c\u113e\u1140\u114c'+'\u114e\u1150\u1154-\u1155\u1159\u115f-\u1161\u1163\u1165\u1167\u1169'+'\u116d-\u116e\u1172-\u1173\u1175\u119e\u11a8\u11ab\u11ae-\u11af'+'\u11b7-\u11b8\u11ba\u11bc-\u11c2\u11eb\u11f0\u11f9\u1e00-\u1e9b'+'\u1ea0-\u1ef9\u1f00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d'+'\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc'+'\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec'+'\u1ff2-\u1ff4\u1ff6-\u1ffc\u2126\u212a-\u212b\u212e\u2180-\u2182'+'\u3041-\u3094\u30a1-\u30fa\u3105-\u312c\uac00-\ud7a3':'A-Za-z';var XML10_IDEOGRAPHIC=(REGEXP_UNICODE)?'\u4e00-\u9fa5\u3007\u3021-\u3029':'';var XML10_COMBINING_CHAR=(REGEXP_UNICODE)?'\u0300-\u0345\u0360-\u0361\u0483-\u0486\u0591-\u05a1\u05a3-\u05b9'+'\u05bb-\u05bd\u05bf\u05c1-\u05c2\u05c4\u064b-\u0652\u0670\u06d6-\u06dc'+'\u06dd-\u06df\u06e0-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0901-\u0903\u093c'+'\u093e-\u094c\u094d\u0951-\u0954\u0962-\u0963\u0981-\u0983\u09bc\u09be'+'\u09bf\u09c0-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09d7\u09e2-\u09e3\u0a02'+'\u0a3c\u0a3e\u0a3f\u0a40-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a70-\u0a71'+'\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0b01-\u0b03'+'\u0b3c\u0b3e-\u0b43\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b82-\u0b83'+'\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0c01-\u0c03\u0c3e-\u0c44'+'\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c82-\u0c83\u0cbe-\u0cc4'+'\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0d02-\u0d03\u0d3e-\u0d43'+'\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1'+'\u0eb4-\u0eb9\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39'+'\u0f3e\u0f3f\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f95\u0f97\u0f99-\u0fad'+'\u0fb1-\u0fb7\u0fb9\u20d0-\u20dc\u20e1\u302a-\u302f\u3099\u309a':'';var XML10_DIGIT=(REGEXP_UNICODE)?'\u0030-\u0039\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef'+'\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be7-\u0bef\u0c66-\u0c6f'+'\u0ce6-\u0cef\u0d66-\u0d6f\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29':'0-9';var XML10_EXTENDER=(REGEXP_UNICODE)?'\u00b7\u02d0\u02d1\u0387\u0640\u0e46\u0ec6\u3005\u3031-\u3035'+'\u309d-\u309e\u30fc-\u30fe':'';var XML10_LETTER=XML10_BASE_CHAR+XML10_IDEOGRAPHIC;var XML10_NAME_CHAR=XML10_LETTER+XML10_DIGIT+'\\._:'+
XML10_COMBINING_CHAR+XML10_EXTENDER+'-';var XML10_NAME='['+XML10_LETTER+'_:]['+XML10_NAME_CHAR+']*';var XML10_ENTITY_REF='&'+XML10_NAME+';';var XML10_REFERENCE=XML10_ENTITY_REF+'|'+XML_CHAR_REF;var XML10_ATT_VALUE='"(([^<&"]|'+XML10_REFERENCE+')*)"|'+"'(([^<&']|"+XML10_REFERENCE+")*)'";var XML10_ATTRIBUTE='('+XML10_NAME+')'+XML_EQ+'('+XML10_ATT_VALUE+')';var XML11_VERSION_INFO=XML_S+'version'+XML_EQ+'("1\\.1"|'+"'1\\.1')";var XML11_NAME_START_CHAR=(REGEXP_UNICODE)?':A-Z_a-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u037d'+'\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff'+'\uf900-\ufdcf\ufdf0-\ufffd':':A-Z_a-z';var XML11_NAME_CHAR=XML11_NAME_START_CHAR+
((REGEXP_UNICODE)?'\\.0-9\u00b7\u0300-\u036f\u203f-\u2040-':'\\.0-9-');var XML11_NAME='['+XML11_NAME_START_CHAR+']['+XML11_NAME_CHAR+']*';var XML11_ENTITY_REF='&'+XML11_NAME+';';var XML11_REFERENCE=XML11_ENTITY_REF+'|'+XML_CHAR_REF;var XML11_ATT_VALUE='"(([^<&"]|'+XML11_REFERENCE+')*)"|'+"'(([^<&']|"+XML11_REFERENCE+")*)'";var XML11_ATTRIBUTE='('+XML11_NAME+')'+XML_EQ+'('+XML11_ATT_VALUE+')';var XML_NC_NAME_CHAR=XML10_LETTER+XML10_DIGIT+'\\._'+
XML10_COMBINING_CHAR+XML10_EXTENDER+'-';var XML_NC_NAME='['+XML10_LETTER+'_]['+XML_NC_NAME_CHAR+']*';var DOM_ELEMENT_NODE=1;var DOM_ATTRIBUTE_NODE=2;var DOM_TEXT_NODE=3;var DOM_CDATA_SECTION_NODE=4;var DOM_ENTITY_REFERENCE_NODE=5;var DOM_ENTITY_NODE=6;var DOM_PROCESSING_INSTRUCTION_NODE=7;var DOM_COMMENT_NODE=8;var DOM_DOCUMENT_NODE=9;var DOM_DOCUMENT_TYPE_NODE=10;var DOM_DOCUMENT_FRAGMENT_NODE=11;var DOM_NOTATION_NODE=12;function xpathLog(msg){};function xsltLog(msg){};function xsltLogXml(msg){};function assert(b){if(!b){throw"Assertion failed";}}
function stringSplit(s,c){var a=s.indexOf(c);if(a==-1){return[s];}
var parts=[];parts.push(s.substr(0,a));while(a!=-1){var a1=s.indexOf(c,a+1);if(a1!=-1){parts.push(s.substr(a+1,a1-a-1));}else{parts.push(s.substr(a+1));}
a=a1;}
return parts;}
function mapExec(array,func){for(var i=0;i<array.length;++i){func.call(this,array[i],i);}}
function mapExpr(array,func){var ret=[];for(var i=0;i<array.length;++i){ret.push(func(array[i]));}
return ret;};function reverseInplace(array){for(var i=0;i<array.length/2;++i){var h=array[i];var ii=array.length-i-1;array[i]=array[ii];array[ii]=h;}}
function removeFromArray(array,value,opt_notype){var shift=0;for(var i=0;i<array.length;++i){if(array[i]===value||(opt_notype&&array[i]==value)){array.splice(i--,1);shift++;}}
return shift;}
function copyArray(dst,src){for(var i=0;i<src.length;++i){dst.push(src[i]);}}
function xmlValue(node){if(!node){return'';}
var ret='';if(node.nodeType==DOM_TEXT_NODE||node.nodeType==DOM_CDATA_SECTION_NODE||node.nodeType==DOM_ATTRIBUTE_NODE){ret+=node.nodeValue;}else if(node.nodeType==DOM_ELEMENT_NODE||node.nodeType==DOM_DOCUMENT_NODE||node.nodeType==DOM_DOCUMENT_FRAGMENT_NODE){for(var i=0;i<node.childNodes.length;++i){ret+=arguments.callee(node.childNodes[i]);}}
return ret;}
function xpathParse(expr){xpathLog('parse '+expr);xpathParseInit();var cached=xpathCacheLookup(expr);if(cached){xpathLog(' ... cached');return cached;}
if(expr.match(/^(\$|@)?\w+$/i)){var ret=makeSimpleExpr(expr);xpathParseCache[expr]=ret;xpathLog(' ... simple');return ret;}
if(expr.match(/^\w+(\/\w+)*$/i)){var ret=makeSimpleExpr2(expr);xpathParseCache[expr]=ret;xpathLog(' ... simple 2');return ret;}
var cachekey=expr;var stack=[];var ahead=null;var previous=null;var done=false;var parse_count=0;var lexer_count=0;var reduce_count=0;while(!done){parse_count++;expr=expr.replace(/^\s*/,'');previous=ahead;ahead=null;var rule=null;var match='';for(var i=0;i<xpathTokenRules.length;++i){var result=xpathTokenRules[i].re.exec(expr);lexer_count++;if(result&&result.length>0&&result[0].length>match.length){rule=xpathTokenRules[i];match=result[0];break;}}
if(rule&&(rule==TOK_DIV||rule==TOK_MOD||rule==TOK_AND||rule==TOK_OR)&&(!previous||previous.tag==TOK_AT||previous.tag==TOK_DSLASH||previous.tag==TOK_SLASH||previous.tag==TOK_AXIS||previous.tag==TOK_DOLLAR)){rule=TOK_QNAME;}
if(rule){expr=expr.substr(match.length);xpathLog('token: '+match+' -- '+rule.label);ahead={tag:rule,match:match,prec:rule.prec?rule.prec:0,expr:makeTokenExpr(match)};}else{xpathLog('DONE');done=true;}
while(xpathReduce(stack,ahead)){reduce_count++;xpathLog('stack: '+stackToString(stack));}}
xpathLog('stack: '+stackToString(stack));if(stack.length!=1){throw'XPath parse error '+cachekey+':\n'+stackToString(stack);}
var result=stack[0].expr;xpathParseCache[cachekey]=result;xpathLog('XPath parse: '+parse_count+' / '+
lexer_count+' / '+reduce_count);return result;}
var xpathParseCache={};function xpathCacheLookup(expr){return xpathParseCache[expr];}
function xpathReduce(stack,ahead){var cand=null;if(stack.length>0){var top=stack[stack.length-1];var ruleset=xpathRules[top.tag.key];if(ruleset){for(var i=0;i<ruleset.length;++i){var rule=ruleset[i];var match=xpathMatchStack(stack,rule[1]);if(match.length){cand={tag:rule[0],rule:rule,match:match};cand.prec=xpathGrammarPrecedence(cand);break;}}}}
var ret;if(cand&&(!ahead||cand.prec>ahead.prec||(ahead.tag.left&&cand.prec>=ahead.prec))){for(var i=0;i<cand.match.matchlength;++i){stack.pop();}
xpathLog('reduce '+cand.tag.label+' '+cand.prec+' ahead '+(ahead?ahead.tag.label+' '+ahead.prec+
(ahead.tag.left?' left':''):' none '));var matchexpr=mapExpr(cand.match,function(m){return m.expr;});cand.expr=cand.rule[3].apply(null,matchexpr);stack.push(cand);ret=true;}else{if(ahead){xpathLog('shift '+ahead.tag.label+' '+ahead.prec+
(ahead.tag.left?' left':'')+' over '+(cand?cand.tag.label+' '+
cand.prec:' none'));stack.push(ahead);}
ret=false;}
return ret;}
function xpathMatchStack(stack,pattern){var S=stack.length;var P=pattern.length;var p,s;var match=[];match.matchlength=0;var ds=0;for(p=P-1,s=S-1;p>=0&&s>=0;--p,s-=ds){ds=0;var qmatch=[];if(pattern[p]==Q_MM){p-=1;match.push(qmatch);while(s-ds>=0&&stack[s-ds].tag==pattern[p]){qmatch.push(stack[s-ds]);ds+=1;match.matchlength+=1;}}else if(pattern[p]==Q_01){p-=1;match.push(qmatch);while(s-ds>=0&&ds<2&&stack[s-ds].tag==pattern[p]){qmatch.push(stack[s-ds]);ds+=1;match.matchlength+=1;}}else if(pattern[p]==Q_1M){p-=1;match.push(qmatch);if(stack[s].tag==pattern[p]){while(s-ds>=0&&stack[s-ds].tag==pattern[p]){qmatch.push(stack[s-ds]);ds+=1;match.matchlength+=1;}}else{return[];}}else if(stack[s].tag==pattern[p]){match.push(stack[s]);ds+=1;match.matchlength+=1;}else{return[];}
reverseInplace(qmatch);qmatch.expr=mapExpr(qmatch,function(m){return m.expr;});}
reverseInplace(match);if(p==-1){return match;}else{return[];}}
function xpathTokenPrecedence(tag){return tag.prec||2;}
function xpathGrammarPrecedence(frame){var ret=0;if(frame.rule){if(frame.rule.length>=3&&frame.rule[2]>=0){ret=frame.rule[2];}else{for(var i=0;i<frame.rule[1].length;++i){var p=xpathTokenPrecedence(frame.rule[1][i]);ret=Math.max(ret,p);}}}else if(frame.tag){ret=xpathTokenPrecedence(frame.tag);}else if(frame.length){for(var j=0;j<frame.length;++j){var p=xpathGrammarPrecedence(frame[j]);ret=Math.max(ret,p);}}
return ret;}
function stackToString(stack){var ret='';for(var i=0;i<stack.length;++i){if(ret){ret+='\n';}
ret+=stack[i].tag.label;}
return ret;}
function ExprContext(node,opt_position,opt_nodelist,opt_parent){this.node=node;this.position=opt_position||0;this.nodelist=opt_nodelist||[node];this.variables={};this.parent=opt_parent||null;if(opt_parent){this.root=opt_parent.root;}else if(this.node.nodeType==DOM_DOCUMENT_NODE){this.root=node;}else{this.root=node.ownerDocument;}}
ExprContext.prototype.clone=function(opt_node,opt_position,opt_nodelist){return new ExprContext(opt_node||this.node,typeof opt_position!='undefined'?opt_position:this.position,opt_nodelist||this.nodelist,this);};ExprContext.prototype.setVariable=function(name,value){this.variables[name]=value;};ExprContext.prototype.getVariable=function(name){if(typeof this.variables[name]!='undefined'){return this.variables[name];}else if(this.parent){return this.parent.getVariable(name);}else{return null;}};ExprContext.prototype.setNode=function(position){this.node=this.nodelist[position];this.position=position;};ExprContext.prototype.contextSize=function(){return this.nodelist.length;};function StringValue(value){this.value=value;this.type='string';}
StringValue.prototype.stringValue=function(){return this.value;};StringValue.prototype.booleanValue=function(){return this.value.length>0;};StringValue.prototype.numberValue=function(){return this.value-0;};StringValue.prototype.nodeSetValue=function(){throw this;};function BooleanValue(value){this.value=value;this.type='boolean';}
BooleanValue.prototype.stringValue=function(){return''+this.value;};BooleanValue.prototype.booleanValue=function(){return this.value;};BooleanValue.prototype.numberValue=function(){return this.value?1:0;};BooleanValue.prototype.nodeSetValue=function(){throw this;};function NumberValue(value){this.value=value;this.type='number';}
NumberValue.prototype.stringValue=function(){return''+this.value;};NumberValue.prototype.booleanValue=function(){return!!this.value;};NumberValue.prototype.numberValue=function(){return this.value-0;};NumberValue.prototype.nodeSetValue=function(){throw this;};function NodeSetValue(value){this.value=value;this.type='node-set';}
NodeSetValue.prototype.stringValue=function(){if(this.value.length==0){return'';}else{return xmlValue(this.value[0]);}};NodeSetValue.prototype.booleanValue=function(){return this.value.length>0;};NodeSetValue.prototype.numberValue=function(){return this.stringValue()-0;};NodeSetValue.prototype.nodeSetValue=function(){return this.value;};function TokenExpr(m){this.value=m;}
TokenExpr.prototype.evaluate=function(){return new StringValue(this.value);};function LocationExpr(){this.absolute=false;this.steps=[];}
LocationExpr.prototype.appendStep=function(s){this.steps.push(s);};LocationExpr.prototype.prependStep=function(s){var steps0=this.steps;this.steps=[s];for(var i=0;i<steps0.length;++i){this.steps.push(steps0[i]);}};LocationExpr.prototype.evaluate=function(ctx){var start;if(this.absolute){start=ctx.root;}else{start=ctx.node;}
var nodes=[];xPathStep(nodes,this.steps,0,start,ctx);return new NodeSetValue(nodes);};function xPathStep(nodes,steps,step,input,ctx){var s=steps[step];var ctx2=ctx.clone(input);var nodelist=s.evaluate(ctx2).nodeSetValue();for(var i=0;i<nodelist.length;++i){if(step==steps.length-1){nodes.push(nodelist[i]);}else{xPathStep(nodes,steps,step+1,nodelist[i],ctx);}}}
function StepExpr(axis,nodetest,opt_predicate){this.axis=axis;this.nodetest=nodetest;this.predicate=opt_predicate||[];}
StepExpr.prototype.appendPredicate=function(p){this.predicate.push(p);};StepExpr.prototype.evaluate=function(ctx){var input=ctx.node;var nodelist=[];if(this.axis==xpathAxis.ANCESTOR_OR_SELF){nodelist.push(input);for(var n=input.parentNode;n;n=n.parentNode){nodelist.push(n);}}else if(this.axis==xpathAxis.ANCESTOR){for(var n=input.parentNode;n;n=n.parentNode){nodelist.push(n);}}else if(this.axis==xpathAxis.ATTRIBUTE){copyArray(nodelist,input.attributes);}else if(this.axis==xpathAxis.CHILD){copyArray(nodelist,input.childNodes);}else if(this.axis==xpathAxis.DESCENDANT_OR_SELF){nodelist.push(input);xpathCollectDescendants(nodelist,input);}else if(this.axis==xpathAxis.DESCENDANT){xpathCollectDescendants(nodelist,input);}else if(this.axis==xpathAxis.FOLLOWING){for(var n=input;n;n=n.parentNode){for(var nn=n.nextSibling;nn;nn=nn.nextSibling){nodelist.push(nn);xpathCollectDescendants(nodelist,nn);}}}else if(this.axis==xpathAxis.FOLLOWING_SIBLING){for(var n=input.nextSibling;n;n=n.nextSibling){nodelist.push(n);}}else if(this.axis==xpathAxis.NAMESPACE){alert('not implemented: axis namespace');}else if(this.axis==xpathAxis.PARENT){if(input.parentNode){nodelist.push(input.parentNode);}}else if(this.axis==xpathAxis.PRECEDING){for(var n=input;n;n=n.parentNode){for(var nn=n.previousSibling;nn;nn=nn.previousSibling){nodelist.push(nn);xpathCollectDescendantsReverse(nodelist,nn);}}}else if(this.axis==xpathAxis.PRECEDING_SIBLING){for(var n=input.previousSibling;n;n=n.previousSibling){nodelist.push(n);}}else if(this.axis==xpathAxis.SELF){nodelist.push(input);}else{throw'ERROR -- NO SUCH AXIS: '+this.axis;}
var nodelist0=nodelist;nodelist=[];for(var i=0;i<nodelist0.length;++i){var n=nodelist0[i];if(this.nodetest.evaluate(ctx.clone(n,i,nodelist0)).booleanValue()){nodelist.push(n);}}
for(var i=0;i<this.predicate.length;++i){var nodelist0=nodelist;nodelist=[];for(var ii=0;ii<nodelist0.length;++ii){var n=nodelist0[ii];if(this.predicate[i].evaluate(ctx.clone(n,ii,nodelist0)).booleanValue()){nodelist.push(n);}}}
return new NodeSetValue(nodelist);};function NodeTestAny(){this.value=new BooleanValue(true);}
NodeTestAny.prototype.evaluate=function(ctx){return this.value;};function NodeTestElementOrAttribute(){}
NodeTestElementOrAttribute.prototype.evaluate=function(ctx){return new BooleanValue(ctx.node.nodeType==DOM_ELEMENT_NODE||ctx.node.nodeType==DOM_ATTRIBUTE_NODE);};function NodeTestText(){}
NodeTestText.prototype.evaluate=function(ctx){return new BooleanValue(ctx.node.nodeType==DOM_TEXT_NODE);};function NodeTestComment(){}
NodeTestComment.prototype.evaluate=function(ctx){return new BooleanValue(ctx.node.nodeType==DOM_COMMENT_NODE);};function NodeTestPI(target){this.target=target;}
NodeTestPI.prototype.evaluate=function(ctx){return new
BooleanValue(ctx.node.nodeType==DOM_PROCESSING_INSTRUCTION_NODE&&(!this.target||ctx.node.nodeName==this.target));};function NodeTestNC(nsprefix){this.regex=new RegExp("^"+nsprefix+":");this.nsprefix=nsprefix;}
NodeTestNC.prototype.evaluate=function(ctx){var n=ctx.node;return new BooleanValue(this.regex.match(n.nodeName));};function NodeTestName(name){this.name=name;}
NodeTestName.prototype.evaluate=function(ctx){var n=ctx.node;return new BooleanValue(n.nodeName==this.name);};function PredicateExpr(expr){this.expr=expr;}
PredicateExpr.prototype.evaluate=function(ctx){var v=this.expr.evaluate(ctx);if(v.type=='number'){return new BooleanValue(ctx.position==v.numberValue()-1);}else{return new BooleanValue(v.booleanValue());}};function FunctionCallExpr(name){this.name=name;this.args=[];}
FunctionCallExpr.prototype.appendArg=function(arg){this.args.push(arg);};FunctionCallExpr.prototype.evaluate=function(ctx){var fn=''+this.name.value;var f=this.xpathfunctions[fn];if(f){return f.call(this,ctx);}else{xpathLog('XPath NO SUCH FUNCTION '+fn);return new BooleanValue(false);}};FunctionCallExpr.prototype.xpathfunctions={'last':function(ctx){assert(this.args.length==0);return new NumberValue(ctx.contextSize());},'position':function(ctx){assert(this.args.length==0);return new NumberValue(ctx.position+1);},'count':function(ctx){assert(this.args.length==1);var v=this.args[0].evaluate(ctx);return new NumberValue(v.nodeSetValue().length);},'id':function(ctx){assert(this.args.length==1);var e=this.args[0].evaluate(ctx);var ret=[];var ids;if(e.type=='node-set'){ids=[];var en=e.nodeSetValue();for(var i=0;i<en.length;++i){var v=xmlValue(en[i]).split(/\s+/);for(var ii=0;ii<v.length;++ii){ids.push(v[ii]);}}}else{ids=e.stringValue().split(/\s+/);}
var d=ctx.node.ownerDocument;for(var i=0;i<ids.length;++i){var n=d.getElementById(ids[i]);if(n){ret.push(n);}}
return new NodeSetValue(ret);},'local-name':function(ctx){alert('not implmented yet: XPath function local-name()');},'namespace-uri':function(ctx){alert('not implmented yet: XPath function namespace-uri()');},'name':function(ctx){assert(this.args.length==1||this.args.length==0);var n;if(this.args.length==0){n=[ctx.node];}else{n=this.args[0].evaluate(ctx).nodeSetValue();}
if(n.length==0){return new StringValue('');}else{return new StringValue(n[0].nodeName);}},'string':function(ctx){assert(this.args.length==1||this.args.length==0);if(this.args.length==0){return new StringValue(new NodeSetValue([ctx.node]).stringValue());}else{return new StringValue(this.args[0].evaluate(ctx).stringValue());}},'concat':function(ctx){var ret='';for(var i=0;i<this.args.length;++i){ret+=this.args[i].evaluate(ctx).stringValue();}
return new StringValue(ret);},'starts-with':function(ctx){assert(this.args.length==2);var s0=this.args[0].evaluate(ctx).stringValue();var s1=this.args[1].evaluate(ctx).stringValue();return new BooleanValue(s0.indexOf(s1)==0);},'contains':function(ctx){assert(this.args.length==2);var s0=this.args[0].evaluate(ctx).stringValue();var s1=this.args[1].evaluate(ctx).stringValue();return new BooleanValue(s0.indexOf(s1)!=-1);},'substring-before':function(ctx){assert(this.args.length==2);var s0=this.args[0].evaluate(ctx).stringValue();var s1=this.args[1].evaluate(ctx).stringValue();var i=s0.indexOf(s1);var ret;if(i==-1){ret='';}else{ret=s0.substr(0,i);}
return new StringValue(ret);},'substring-after':function(ctx){assert(this.args.length==2);var s0=this.args[0].evaluate(ctx).stringValue();var s1=this.args[1].evaluate(ctx).stringValue();var i=s0.indexOf(s1);var ret;if(i==-1){ret='';}else{ret=s0.substr(i+s1.length);}
return new StringValue(ret);},'substring':function(ctx){assert(this.args.length==2||this.args.length==3);var s0=this.args[0].evaluate(ctx).stringValue();var s1=this.args[1].evaluate(ctx).numberValue();var ret;if(this.args.length==2){var i1=Math.max(0,Math.round(s1)-1);ret=s0.substr(i1);}else{var s2=this.args[2].evaluate(ctx).numberValue();var i0=Math.round(s1)-1;var i1=Math.max(0,i0);var i2=Math.round(s2)-Math.max(0,-i0);ret=s0.substr(i1,i2);}
return new StringValue(ret);},'string-length':function(ctx){var s;if(this.args.length>0){s=this.args[0].evaluate(ctx).stringValue();}else{s=new NodeSetValue([ctx.node]).stringValue();}
return new NumberValue(s.length);},'normalize-space':function(ctx){var s;if(this.args.length>0){s=this.args[0].evaluate(ctx).stringValue();}else{s=new NodeSetValue([ctx.node]).stringValue();}
s=s.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s+/g,' ');return new StringValue(s);},'translate':function(ctx){assert(this.args.length==3);var s0=this.args[0].evaluate(ctx).stringValue();var s1=this.args[1].evaluate(ctx).stringValue();var s2=this.args[2].evaluate(ctx).stringValue();for(var i=0;i<s1.length;++i){s0=s0.replace(new RegExp(s1.charAt(i),'g'),s2.charAt(i));}
return new StringValue(s0);},'boolean':function(ctx){assert(this.args.length==1);return new BooleanValue(this.args[0].evaluate(ctx).booleanValue());},'not':function(ctx){assert(this.args.length==1);var ret=!this.args[0].evaluate(ctx).booleanValue();return new BooleanValue(ret);},'true':function(ctx){assert(this.args.length==0);return new BooleanValue(true);},'false':function(ctx){assert(this.args.length==0);return new BooleanValue(false);},'lang':function(ctx){assert(this.args.length==1);var lang=this.args[0].evaluate(ctx).stringValue();var xmllang;var n=ctx.node;while(n&&n!=n.parentNode){xmllang=n.getAttribute('xml:lang');if(xmllang){break;}
n=n.parentNode;}
if(!xmllang){return new BooleanValue(false);}else{var re=new RegExp('^'+lang+'$','i');return new BooleanValue(xmllang.match(re)||xmllang.replace(/_.*$/,'').match(re));}},'number':function(ctx){assert(this.args.length==1||this.args.length==0);if(this.args.length==1){return new NumberValue(this.args[0].evaluate(ctx).numberValue());}else{return new NumberValue(new NodeSetValue([ctx.node]).numberValue());}},'sum':function(ctx){assert(this.args.length==1);var n=this.args[0].evaluate(ctx).nodeSetValue();var sum=0;for(var i=0;i<n.length;++i){sum+=xmlValue(n[i])-0;}
return new NumberValue(sum);},'floor':function(ctx){assert(this.args.length==1);var num=this.args[0].evaluate(ctx).numberValue();return new NumberValue(Math.floor(num));},'ceiling':function(ctx){assert(this.args.length==1);var num=this.args[0].evaluate(ctx).numberValue();return new NumberValue(Math.ceil(num));},'round':function(ctx){assert(this.args.length==1);var num=this.args[0].evaluate(ctx).numberValue();return new NumberValue(Math.round(num));},'ext-join':function(ctx){assert(this.args.length==2);var nodes=this.args[0].evaluate(ctx).nodeSetValue();var delim=this.args[1].evaluate(ctx).stringValue();var ret='';for(var i=0;i<nodes.length;++i){if(ret){ret+=delim;}
ret+=xmlValue(nodes[i]);}
return new StringValue(ret);},'ext-if':function(ctx){assert(this.args.length==3);if(this.args[0].evaluate(ctx).booleanValue()){return this.args[1].evaluate(ctx);}else{return this.args[2].evaluate(ctx);}},'ext-cardinal':function(ctx){assert(this.args.length>=1);var c=this.args[0].evaluate(ctx).numberValue();var ret=[];for(var i=0;i<c;++i){ret.push(ctx.node);}
return new NodeSetValue(ret);}};function UnionExpr(expr1,expr2){this.expr1=expr1;this.expr2=expr2;}
UnionExpr.prototype.evaluate=function(ctx){var nodes1=this.expr1.evaluate(ctx).nodeSetValue();var nodes2=this.expr2.evaluate(ctx).nodeSetValue();var I1=nodes1.length;for(var i2=0;i2<nodes2.length;++i2){var n=nodes2[i2];var inBoth=false;for(var i1=0;i1<I1;++i1){if(nodes1[i1]==n){inBoth=true;i1=I1;}}
if(!inBoth){nodes1.push(n);}}
return new NodeSetValue(nodes1);};function PathExpr(filter,rel){this.filter=filter;this.rel=rel;}
PathExpr.prototype.evaluate=function(ctx){var nodes=this.filter.evaluate(ctx).nodeSetValue();var nodes1=[];for(var i=0;i<nodes.length;++i){var nodes0=this.rel.evaluate(ctx.clone(nodes[i],i,nodes)).nodeSetValue();for(var ii=0;ii<nodes0.length;++ii){nodes1.push(nodes0[ii]);}}
return new NodeSetValue(nodes1);};function FilterExpr(expr,predicate){this.expr=expr;this.predicate=predicate;}
FilterExpr.prototype.evaluate=function(ctx){var nodes=this.expr.evaluate(ctx).nodeSetValue();for(var i=0;i<this.predicate.length;++i){var nodes0=nodes;nodes=[];for(var j=0;j<nodes0.length;++j){var n=nodes0[j];if(this.predicate[i].evaluate(ctx.clone(n,j,nodes0)).booleanValue()){nodes.push(n);}}}
return new NodeSetValue(nodes);};function UnaryMinusExpr(expr){this.expr=expr;}
UnaryMinusExpr.prototype.evaluate=function(ctx){return new NumberValue(-this.expr.evaluate(ctx).numberValue());};function BinaryExpr(expr1,op,expr2){this.expr1=expr1;this.expr2=expr2;this.op=op;}
BinaryExpr.prototype.evaluate=function(ctx){var ret;switch(this.op.value){case'or':ret=new BooleanValue(this.expr1.evaluate(ctx).booleanValue()||this.expr2.evaluate(ctx).booleanValue());break;case'and':ret=new BooleanValue(this.expr1.evaluate(ctx).booleanValue()&&this.expr2.evaluate(ctx).booleanValue());break;case'+':ret=new NumberValue(this.expr1.evaluate(ctx).numberValue()+
this.expr2.evaluate(ctx).numberValue());break;case'-':ret=new NumberValue(this.expr1.evaluate(ctx).numberValue()-
this.expr2.evaluate(ctx).numberValue());break;case'*':ret=new NumberValue(this.expr1.evaluate(ctx).numberValue()*this.expr2.evaluate(ctx).numberValue());break;case'mod':ret=new NumberValue(this.expr1.evaluate(ctx).numberValue()%this.expr2.evaluate(ctx).numberValue());break;case'div':ret=new NumberValue(this.expr1.evaluate(ctx).numberValue()/this.expr2.evaluate(ctx).numberValue());break;case'=':ret=this.compare(ctx,function(x1,x2){return x1==x2;});break;case'!=':ret=this.compare(ctx,function(x1,x2){return x1!=x2;});break;case'<':ret=this.compare(ctx,function(x1,x2){return x1<x2;});break;case'<=':ret=this.compare(ctx,function(x1,x2){return x1<=x2;});break;case'>':ret=this.compare(ctx,function(x1,x2){return x1>x2;});break;case'>=':ret=this.compare(ctx,function(x1,x2){return x1>=x2;});break;default:alert('BinaryExpr.evaluate: '+this.op.value);}
return ret;};BinaryExpr.prototype.compare=function(ctx,cmp){var v1=this.expr1.evaluate(ctx);var v2=this.expr2.evaluate(ctx);var ret;if(v1.type=='node-set'&&v2.type=='node-set'){var n1=v1.nodeSetValue();var n2=v2.nodeSetValue();ret=false;for(var i1=0;i1<n1.length;++i1){for(var i2=0;i2<n2.length;++i2){if(cmp(xmlValue(n1[i1]),xmlValue(n2[i2]))){ret=true;i2=n2.length;i1=n1.length;}}}}else if(v1.type=='node-set'||v2.type=='node-set'){if(v1.type=='number'){var s=v1.numberValue();var n=v2.nodeSetValue();ret=false;for(var i=0;i<n.length;++i){var nn=xmlValue(n[i])-0;if(cmp(s,nn)){ret=true;break;}}}else if(v2.type=='number'){var n=v1.nodeSetValue();var s=v2.numberValue();ret=false;for(var i=0;i<n.length;++i){var nn=xmlValue(n[i])-0;if(cmp(nn,s)){ret=true;break;}}}else if(v1.type=='string'){var s=v1.stringValue();var n=v2.nodeSetValue();ret=false;for(var i=0;i<n.length;++i){var nn=xmlValue(n[i]);if(cmp(s,nn)){ret=true;break;}}}else if(v2.type=='string'){var n=v1.nodeSetValue();var s=v2.stringValue();ret=false;for(var i=0;i<n.length;++i){var nn=xmlValue(n[i]);if(cmp(nn,s)){ret=true;break;}}}else{ret=cmp(v1.booleanValue(),v2.booleanValue());}}else if(v1.type=='boolean'||v2.type=='boolean'){ret=cmp(v1.booleanValue(),v2.booleanValue());}else if(v1.type=='number'||v2.type=='number'){ret=cmp(v1.numberValue(),v2.numberValue());}else{ret=cmp(v1.stringValue(),v2.stringValue());}
return new BooleanValue(ret);};function LiteralExpr(value){this.value=value;}
LiteralExpr.prototype.evaluate=function(ctx){return new StringValue(this.value);};function NumberExpr(value){this.value=value;}
NumberExpr.prototype.evaluate=function(ctx){return new NumberValue(this.value);};function VariableExpr(name){this.name=name;}
VariableExpr.prototype.evaluate=function(ctx){return ctx.getVariable(this.name);};function makeTokenExpr(m){return new TokenExpr(m);}
function passExpr(e){return e;}
function makeLocationExpr1(slash,rel){rel.absolute=true;return rel;}
function makeLocationExpr2(dslash,rel){rel.absolute=true;rel.prependStep(makeAbbrevStep(dslash.value));return rel;}
function makeLocationExpr3(slash){var ret=new LocationExpr();ret.appendStep(makeAbbrevStep('.'));ret.absolute=true;return ret;}
function makeLocationExpr4(dslash){var ret=new LocationExpr();ret.absolute=true;ret.appendStep(makeAbbrevStep(dslash.value));return ret;}
function makeLocationExpr5(step){var ret=new LocationExpr();ret.appendStep(step);return ret;}
function makeLocationExpr6(rel,slash,step){rel.appendStep(step);return rel;}
function makeLocationExpr7(rel,dslash,step){rel.appendStep(makeAbbrevStep(dslash.value));return rel;}
function makeStepExpr1(dot){return makeAbbrevStep(dot.value);}
function makeStepExpr2(ddot){return makeAbbrevStep(ddot.value);}
function makeStepExpr3(axisname,axis,nodetest){return new StepExpr(axisname.value,nodetest);}
function makeStepExpr4(at,nodetest){return new StepExpr('attribute',nodetest);}
function makeStepExpr5(nodetest){return new StepExpr('child',nodetest);}
function makeStepExpr6(step,predicate){step.appendPredicate(predicate);return step;}
function makeAbbrevStep(abbrev){switch(abbrev){case'//':return new StepExpr('descendant-or-self',new NodeTestAny);case'.':return new StepExpr('self',new NodeTestAny);case'..':return new StepExpr('parent',new NodeTestAny);}}
function makeNodeTestExpr1(asterisk){return new NodeTestElementOrAttribute;}
function makeNodeTestExpr2(ncname,colon,asterisk){return new NodeTestNC(ncname.value);}
function makeNodeTestExpr3(qname){return new NodeTestName(qname.value);}
function makeNodeTestExpr4(typeo,parenc){var type=typeo.value.replace(/\s*\($/,'');switch(type){case'node':return new NodeTestAny;case'text':return new NodeTestText;case'comment':return new NodeTestComment;case'processing-instruction':return new NodeTestPI('');}}
function makeNodeTestExpr5(typeo,target,parenc){var type=typeo.replace(/\s*\($/,'');if(type!='processing-instruction'){throw type;}
return new NodeTestPI(target.value);}
function makePredicateExpr(pareno,expr,parenc){return new PredicateExpr(expr);}
function makePrimaryExpr(pareno,expr,parenc){return expr;}
function makeFunctionCallExpr1(name,pareno,parenc){return new FunctionCallExpr(name);}
function makeFunctionCallExpr2(name,pareno,arg1,args,parenc){var ret=new FunctionCallExpr(name);ret.appendArg(arg1);for(var i=0;i<args.length;++i){ret.appendArg(args[i]);}
return ret;}
function makeArgumentExpr(comma,expr){return expr;}
function makeUnionExpr(expr1,pipe,expr2){return new UnionExpr(expr1,expr2);}
function makePathExpr1(filter,slash,rel){return new PathExpr(filter,rel);}
function makePathExpr2(filter,dslash,rel){rel.prependStep(makeAbbrevStep(dslash.value));return new PathExpr(filter,rel);}
function makeFilterExpr(expr,predicates){if(predicates.length>0){return new FilterExpr(expr,predicates);}else{return expr;}}
function makeUnaryMinusExpr(minus,expr){return new UnaryMinusExpr(expr);}
function makeBinaryExpr(expr1,op,expr2){return new BinaryExpr(expr1,op,expr2);}
function makeLiteralExpr(token){var value=token.value.substring(1,token.value.length-1);return new LiteralExpr(value);}
function makeNumberExpr(token){return new NumberExpr(token.value);}
function makeVariableReference(dollar,name){return new VariableExpr(name.value);}
function makeSimpleExpr(expr){if(expr.charAt(0)=='$'){return new VariableExpr(expr.substr(1));}else if(expr.charAt(0)=='@'){var a=new NodeTestName(expr.substr(1));var b=new StepExpr('attribute',a);var c=new LocationExpr();c.appendStep(b);return c;}else if(expr.match(/^[0-9]+$/)){return new NumberExpr(expr);}else{var a=new NodeTestName(expr);var b=new StepExpr('child',a);var c=new LocationExpr();c.appendStep(b);return c;}}
function makeSimpleExpr2(expr){var steps=stringSplit(expr,'/');var c=new LocationExpr();for(var i=0;i<steps.length;++i){var a=new NodeTestName(steps[i]);var b=new StepExpr('child',a);c.appendStep(b);}
return c;}
var xpathAxis={ANCESTOR_OR_SELF:'ancestor-or-self',ANCESTOR:'ancestor',ATTRIBUTE:'attribute',CHILD:'child',DESCENDANT_OR_SELF:'descendant-or-self',DESCENDANT:'descendant',FOLLOWING_SIBLING:'following-sibling',FOLLOWING:'following',NAMESPACE:'namespace',PARENT:'parent',PRECEDING_SIBLING:'preceding-sibling',PRECEDING:'preceding',SELF:'self'};var xpathAxesRe=[xpathAxis.ANCESTOR_OR_SELF,xpathAxis.ANCESTOR,xpathAxis.ATTRIBUTE,xpathAxis.CHILD,xpathAxis.DESCENDANT_OR_SELF,xpathAxis.DESCENDANT,xpathAxis.FOLLOWING_SIBLING,xpathAxis.FOLLOWING,xpathAxis.NAMESPACE,xpathAxis.PARENT,xpathAxis.PRECEDING_SIBLING,xpathAxis.PRECEDING,xpathAxis.SELF].join('|');var TOK_PIPE={label:"|",prec:17,re:new RegExp("^\\|")};var TOK_DSLASH={label:"//",prec:19,re:new RegExp("^//")};var TOK_SLASH={label:"/",prec:30,re:new RegExp("^/")};var TOK_AXIS={label:"::",prec:20,re:new RegExp("^::")};var TOK_COLON={label:":",prec:1000,re:new RegExp("^:")};var TOK_AXISNAME={label:"[axis]",re:new RegExp('^('+xpathAxesRe+')')};var TOK_PARENO={label:"(",prec:34,re:new RegExp("^\\(")};var TOK_PARENC={label:")",re:new RegExp("^\\)")};var TOK_DDOT={label:"..",prec:34,re:new RegExp("^\\.\\.")};var TOK_DOT={label:".",prec:34,re:new RegExp("^\\.")};var TOK_AT={label:"@",prec:34,re:new RegExp("^@")};var TOK_COMMA={label:",",re:new RegExp("^,")};var TOK_OR={label:"or",prec:10,re:new RegExp("^or\\b")};var TOK_AND={label:"and",prec:11,re:new RegExp("^and\\b")};var TOK_EQ={label:"=",prec:12,re:new RegExp("^=")};var TOK_NEQ={label:"!=",prec:12,re:new RegExp("^!=")};var TOK_GE={label:">=",prec:13,re:new RegExp("^>=")};var TOK_GT={label:">",prec:13,re:new RegExp("^>")};var TOK_LE={label:"<=",prec:13,re:new RegExp("^<=")};var TOK_LT={label:"<",prec:13,re:new RegExp("^<")};var TOK_PLUS={label:"+",prec:14,re:new RegExp("^\\+"),left:true};var TOK_MINUS={label:"-",prec:14,re:new RegExp("^\\-"),left:true};var TOK_DIV={label:"div",prec:15,re:new RegExp("^div\\b"),left:true};var TOK_MOD={label:"mod",prec:15,re:new RegExp("^mod\\b"),left:true};var TOK_BRACKO={label:"[",prec:32,re:new RegExp("^\\[")};var TOK_BRACKC={label:"]",re:new RegExp("^\\]")};var TOK_DOLLAR={label:"$",re:new RegExp("^\\$")};var TOK_NCNAME={label:"[ncname]",re:new RegExp('^'+XML_NC_NAME)};var TOK_ASTERISK={label:"*",prec:15,re:new RegExp("^\\*"),left:true};var TOK_LITERALQ={label:"[litq]",prec:20,re:new RegExp("^'[^\\']*'")};var TOK_LITERALQQ={label:"[litqq]",prec:20,re:new RegExp('^"[^\\"]*"')};var TOK_NUMBER={label:"[number]",prec:35,re:new RegExp('^\\d+(\\.\\d*)?')};var TOK_QNAME={label:"[qname]",re:new RegExp('^('+XML_NC_NAME+':)?'+XML_NC_NAME)};var TOK_NODEO={label:"[nodetest-start]",re:new RegExp('^(processing-instruction|comment|text|node)\\(')};var xpathTokenRules=[TOK_DSLASH,TOK_SLASH,TOK_DDOT,TOK_DOT,TOK_AXIS,TOK_COLON,TOK_AXISNAME,TOK_NODEO,TOK_PARENO,TOK_PARENC,TOK_BRACKO,TOK_BRACKC,TOK_AT,TOK_COMMA,TOK_OR,TOK_AND,TOK_NEQ,TOK_EQ,TOK_GE,TOK_GT,TOK_LE,TOK_LT,TOK_PLUS,TOK_MINUS,TOK_ASTERISK,TOK_PIPE,TOK_MOD,TOK_DIV,TOK_LITERALQ,TOK_LITERALQQ,TOK_NUMBER,TOK_QNAME,TOK_NCNAME,TOK_DOLLAR];var XPathLocationPath={label:"LocationPath"};var XPathRelativeLocationPath={label:"RelativeLocationPath"};var XPathAbsoluteLocationPath={label:"AbsoluteLocationPath"};var XPathStep={label:"Step"};var XPathNodeTest={label:"NodeTest"};var XPathPredicate={label:"Predicate"};var XPathLiteral={label:"Literal"};var XPathExpr={label:"Expr"};var XPathPrimaryExpr={label:"PrimaryExpr"};var XPathVariableReference={label:"Variablereference"};var XPathNumber={label:"Number"};var XPathFunctionCall={label:"FunctionCall"};var XPathArgumentRemainder={label:"ArgumentRemainder"};var XPathPathExpr={label:"PathExpr"};var XPathUnionExpr={label:"UnionExpr"};var XPathFilterExpr={label:"FilterExpr"};var XPathDigits={label:"Digits"};var xpathNonTerminals=[XPathLocationPath,XPathRelativeLocationPath,XPathAbsoluteLocationPath,XPathStep,XPathNodeTest,XPathPredicate,XPathLiteral,XPathExpr,XPathPrimaryExpr,XPathVariableReference,XPathNumber,XPathFunctionCall,XPathArgumentRemainder,XPathPathExpr,XPathUnionExpr,XPathFilterExpr,XPathDigits];var Q_01={label:"?"};var Q_MM={label:"*"};var Q_1M={label:"+"};var ASSOC_LEFT=true;var xpathGrammarRules=[[XPathLocationPath,[XPathRelativeLocationPath],18,passExpr],[XPathLocationPath,[XPathAbsoluteLocationPath],18,passExpr],[XPathAbsoluteLocationPath,[TOK_SLASH,XPathRelativeLocationPath],18,makeLocationExpr1],[XPathAbsoluteLocationPath,[TOK_DSLASH,XPathRelativeLocationPath],18,makeLocationExpr2],[XPathAbsoluteLocationPath,[TOK_SLASH],0,makeLocationExpr3],[XPathAbsoluteLocationPath,[TOK_DSLASH],0,makeLocationExpr4],[XPathRelativeLocationPath,[XPathStep],31,makeLocationExpr5],[XPathRelativeLocationPath,[XPathRelativeLocationPath,TOK_SLASH,XPathStep],31,makeLocationExpr6],[XPathRelativeLocationPath,[XPathRelativeLocationPath,TOK_DSLASH,XPathStep],31,makeLocationExpr7],[XPathStep,[TOK_DOT],33,makeStepExpr1],[XPathStep,[TOK_DDOT],33,makeStepExpr2],[XPathStep,[TOK_AXISNAME,TOK_AXIS,XPathNodeTest],33,makeStepExpr3],[XPathStep,[TOK_AT,XPathNodeTest],33,makeStepExpr4],[XPathStep,[XPathNodeTest],33,makeStepExpr5],[XPathStep,[XPathStep,XPathPredicate],33,makeStepExpr6],[XPathNodeTest,[TOK_ASTERISK],33,makeNodeTestExpr1],[XPathNodeTest,[TOK_NCNAME,TOK_COLON,TOK_ASTERISK],33,makeNodeTestExpr2],[XPathNodeTest,[TOK_QNAME],33,makeNodeTestExpr3],[XPathNodeTest,[TOK_NODEO,TOK_PARENC],33,makeNodeTestExpr4],[XPathNodeTest,[TOK_NODEO,XPathLiteral,TOK_PARENC],33,makeNodeTestExpr5],[XPathPredicate,[TOK_BRACKO,XPathExpr,TOK_BRACKC],33,makePredicateExpr],[XPathPrimaryExpr,[XPathVariableReference],33,passExpr],[XPathPrimaryExpr,[TOK_PARENO,XPathExpr,TOK_PARENC],33,makePrimaryExpr],[XPathPrimaryExpr,[XPathLiteral],30,passExpr],[XPathPrimaryExpr,[XPathNumber],30,passExpr],[XPathPrimaryExpr,[XPathFunctionCall],30,passExpr],[XPathFunctionCall,[TOK_QNAME,TOK_PARENO,TOK_PARENC],-1,makeFunctionCallExpr1],[XPathFunctionCall,[TOK_QNAME,TOK_PARENO,XPathExpr,XPathArgumentRemainder,Q_MM,TOK_PARENC],-1,makeFunctionCallExpr2],[XPathArgumentRemainder,[TOK_COMMA,XPathExpr],-1,makeArgumentExpr],[XPathUnionExpr,[XPathPathExpr],20,passExpr],[XPathUnionExpr,[XPathUnionExpr,TOK_PIPE,XPathPathExpr],20,makeUnionExpr],[XPathPathExpr,[XPathLocationPath],20,passExpr],[XPathPathExpr,[XPathFilterExpr],19,passExpr],[XPathPathExpr,[XPathFilterExpr,TOK_SLASH,XPathRelativeLocationPath],20,makePathExpr1],[XPathPathExpr,[XPathFilterExpr,TOK_DSLASH,XPathRelativeLocationPath],20,makePathExpr2],[XPathFilterExpr,[XPathPrimaryExpr,XPathPredicate,Q_MM],20,makeFilterExpr],[XPathExpr,[XPathPrimaryExpr],16,passExpr],[XPathExpr,[XPathUnionExpr],16,passExpr],[XPathExpr,[TOK_MINUS,XPathExpr],-1,makeUnaryMinusExpr],[XPathExpr,[XPathExpr,TOK_OR,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_AND,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_EQ,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_NEQ,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_LT,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_LE,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_GT,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_GE,XPathExpr],-1,makeBinaryExpr],[XPathExpr,[XPathExpr,TOK_PLUS,XPathExpr],-1,makeBinaryExpr,ASSOC_LEFT],[XPathExpr,[XPathExpr,TOK_MINUS,XPathExpr],-1,makeBinaryExpr,ASSOC_LEFT],[XPathExpr,[XPathExpr,TOK_ASTERISK,XPathExpr],-1,makeBinaryExpr,ASSOC_LEFT],[XPathExpr,[XPathExpr,TOK_DIV,XPathExpr],-1,makeBinaryExpr,ASSOC_LEFT],[XPathExpr,[XPathExpr,TOK_MOD,XPathExpr],-1,makeBinaryExpr,ASSOC_LEFT],[XPathLiteral,[TOK_LITERALQ],-1,makeLiteralExpr],[XPathLiteral,[TOK_LITERALQQ],-1,makeLiteralExpr],[XPathNumber,[TOK_NUMBER],-1,makeNumberExpr],[XPathVariableReference,[TOK_DOLLAR,TOK_QNAME],200,makeVariableReference]];var xpathRules=[];function xpathParseInit(){if(xpathRules.length){return;}
xpathGrammarRules.sort(function(a,b){var la=a[1].length;var lb=b[1].length;if(la<lb){return 1;}else if(la>lb){return-1;}else{return 0;}});var k=1;for(var i=0;i<xpathNonTerminals.length;++i){xpathNonTerminals[i].key=k++;}
for(i=0;i<xpathTokenRules.length;++i){xpathTokenRules[i].key=k++;}
xpathLog('XPath parse INIT: '+k+' rules');function push_(array,position,element){if(!array[position]){array[position]=[];}
array[position].push(element);}
for(i=0;i<xpathGrammarRules.length;++i){var rule=xpathGrammarRules[i];var pattern=rule[1];for(var j=pattern.length-1;j>=0;--j){if(pattern[j]==Q_1M){push_(xpathRules,pattern[j-1].key,rule);break;}else if(pattern[j]==Q_MM||pattern[j]==Q_01){push_(xpathRules,pattern[j-1].key,rule);--j;}else{push_(xpathRules,pattern[j].key,rule);break;}}}
xpathLog('XPath parse INIT: '+xpathRules.length+' rule bins');var sum=0;mapExec(xpathRules,function(i){if(i){sum+=i.length;}});xpathLog('XPath parse INIT: '+(sum/xpathRules.length)+' average bin size');}
function xpathCollectDescendants(nodelist,node){for(var n=node.firstChild;n;n=n.nextSibling){nodelist.push(n);arguments.callee(nodelist,n);}}
function xpathCollectDescendantsReverse(nodelist,node){for(var n=node.lastChild;n;n=n.previousSibling){nodelist.push(n);arguments.callee(nodelist,n);}}
function xpathDomEval(expr,node){var expr1=xpathParse(expr);var ret=expr1.evaluate(new ExprContext(node));return ret;}
function xpathSort(input,sort){if(sort.length==0){return;}
var sortlist=[];for(var i=0;i<input.contextSize();++i){var node=input.nodelist[i];var sortitem={node:node,key:[]};var context=input.clone(node,0,[node]);for(var j=0;j<sort.length;++j){var s=sort[j];var value=s.expr.evaluate(context);var evalue;if(s.type=='text'){evalue=value.stringValue();}else if(s.type=='number'){evalue=value.numberValue();}
sortitem.key.push({value:evalue,order:s.order});}
sortitem.key.push({value:i,order:'ascending'});sortlist.push(sortitem);}
sortlist.sort(xpathSortByKey);var nodes=[];for(var i=0;i<sortlist.length;++i){nodes.push(sortlist[i].node);}
input.nodelist=nodes;input.setNode(0);}
function xpathSortByKey(v1,v2){for(var i=0;i<v1.key.length;++i){var o=v1.key[i].order=='descending'?-1:1;if(v1.key[i].value>v2.key[i].value){return+1*o;}else if(v1.key[i].value<v2.key[i].value){return-1*o;}}
return 0;}
function xpathEval(select,context){var expr=xpathParse(select);var ret=expr.evaluate(context);return ret;}