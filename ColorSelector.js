

/***********************************************
	Resource: std/OnLoadQueue.js
***********************************************/




// @author Axel Ancona Esselmann

function OnLoadQueue () {
    this.onLoadQueue = [];
    var q = this;
    window.onload = function() {
        for (var i = 0; i < q.onLoadQueue.length; i++) q.onLoadQueue[i]();
    };
}
OnLoadQueue.prototype.registerQueue = function (queue) {
    var callback = function() {
        for (var i = 0; i < queue.length; i++) queue[i]();
    };
    this.push(callback);
}
OnLoadQueue.prototype.push = function (callback) {
    var body = document.getElementsByTagName('body')[0];
    if (body == null) this.onLoadQueue.push(callback);
    else callback();
}
var globalOnLoadQueue = new OnLoadQueue();

/***********************************************
	Resource: std/EventUtil.js
***********************************************/



/**
 * EventUtil is adapted from "Professional JavaScript for Web Developers" by Nicholas Zakas
 */

var EventUtil = {

    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },

    getButton: function(event){
        if (document.implementation.hasFeature("MouseEvents", "2.0")){
            return event.button;
        } else {
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4: return 1;
            }
        }
    },

    getCharCode: function(event){
        if (typeof event.charCode == "number"){
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },

    getClipboardText: function(event){
        var clipboardData =  (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },

    getEvent: function(event){
        return event ? event : window.event;
    },

    getRelatedTarget: function(event){
        if (event.relatedTarget){
            return event.relatedTarget;
        } else if (event.toElement){
            return event.toElement;
        } else if (event.fromElement){
            return event.fromElement;
        } else {
            return null;
        }

    },

    getTarget: function(event){
        return event.target || event.srcElement;
    },

    getWheelDelta: function(event){
        if (event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    },

    preventDefault: function(event){
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },

    setClipboardText: function(event, value){
        if (event.clipboardData){
            event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData){
            window.clipboardData.setData("text", value);
        }
    },

    stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }

};

/***********************************************
	Resource: ui/UISlider.js
***********************************************/



/*** include std/EventUtil.js ***/

// @author Axel Ancona Esselmann
function UISlider(name, valueChangeCallback, initPercentage) {
    this.name                = name;
    this.isDown              = false;
    this.valueChangeCallback = valueChangeCallback;
    this.val                 = initPercentage;
    this.deadSpace           = 0;
}
UISlider.prototype.getNode = function() {
    return document.getElementById(this.name);
}
UISlider.prototype.setBarPercentage = function(barPercentage) {
    this.val                   = barPercentage;
    var sliderValue            = barPercentage / 100 * this.barWidth - this.sliderWidthOffset;
    this.sliderNode.style.left = sliderValue + "px";

    this.valueChangeCallback(barPercentage);
}
UISlider.prototype.setBarValue = function(value) {
    var barPercentage = value * 100 / this.barWidth;
    this.setBarPercentage(barPercentage);
}
UISlider.prototype.drag = function(event) {
    if (this.isDown) {
        event = EventUtil.getEvent(event);
        EventUtil.stopPropagation(event);
        var rect              = this.sliderNode.parentNode.getBoundingClientRect();
        var newX              = (event.clientX - rect.left - this.sliderWidthOffset);
        var barPercentage;
        var leftMargin        = -this.sliderWidthOffset;
        var rightMargin       = this.barWidth - this.sliderWidthOffset - this.deadSpace;
        if (newX < leftMargin) {
            newX          = leftMargin;
            barPercentage = 0;
        } else if (newX > rightMargin) {
            newX = rightMargin;
            barPercentage = 100;
        } else {
            var barPos    = newX + this.sliderWidthOffset;
            barPercentage = barPos * 100 / this.barWidth;
        };
        this.setBarPercentage(barPercentage);
        this.sliderNode.style.left = newX +"px";
    };
}
UISlider.prototype.stopDrag = function(event) {
    if (this.isDown) {
        this.isDown = false;
        event       = EventUtil.getEvent(event);
        EventUtil.stopPropagation(event);
    };
}
UISlider.prototype.startDrag = function(event) {
    if (!this.isDown) {
        this.isDown = true;
        event       = EventUtil.getEvent(event);
        EventUtil.stopPropagation(event);
    };
}
UISlider.prototype.draw = function(targetNode) {
    var that = this;
    var uiSliderDrawCallback = function() {
        var sliderMainNode = document.createElement('div');
        sliderMainNode.setAttribute("class", "sliderBarCont");
        sliderMainNode.setAttribute("id", that.name);

        var sliderBarNode = document.createElement('div');
        sliderBarNode.setAttribute("class", "sliderBar");
        sliderMainNode.appendChild(sliderBarNode);

        var sliderNode = document.createElement('div');
        sliderNode.setAttribute("class", "slider");
        sliderNode.setAttribute("id", that.name + "Slider");
        sliderMainNode.appendChild(sliderNode);

        targetNode.appendChild(sliderMainNode);

        that.sliderNode        = sliderNode;
        var rect               = that.sliderNode.parentNode.getBoundingClientRect();
        that.barWidth          = rect.right - rect.left;
        var sliderBound        = that.sliderNode.getBoundingClientRect();
        that.sliderWidth       = sliderBound.right - sliderBound.left;
        that.sliderWidthOffset = that.sliderWidth / 2;

        (function(obj) {
            EventUtil.addHandler(obj, "mouseup",   function(event) {that.stopDrag (event);});
            EventUtil.addHandler(obj, "mousemove", function(event) {that.drag     (event);});
        })(document);

        (function(obj) {
            EventUtil.addHandler(obj, "mousedown", function(event) {
                if (EventUtil.getButton(event) == 0) {
                    that.setBarValue(event.offsetX);
                    that.startDrag(event);
                };
            });
        })(sliderMainNode);

        (function(obj) {
            EventUtil.addHandler(obj, "mousedown", function(event) {
                if (EventUtil.getButton(event) == 0) that.startDrag(event);
            });
        })(sliderNode);
    }
    var body = document.getElementsByTagName('body')[0];
    if (body == null) globalOnLoadQueue.push(uiSliderDrawCallback);
    else uiSliderDrawCallback();
}

/***********************************************
	Resource: ui/ColorSelector.js
***********************************************/



/*** include std/OnLoadQueue.js ***/
/*** include ui/UISlider.js ***/

// @author Axel Ancona Esselmann

function Color(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this._onChangeCallback = undefined;
}
Color.prototype.rgb = function() {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
}
Color.prototype.set = function(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
    if (this._onChangeCallback != undefined) {
        this._onChangeCallback(this.r,this.g,this.b);
    }
}
Color.prototype.onChangeCallback = function(callback) {
    this._onChangeCallback = callback;
}



function RainbowColor(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.index = 0;
    this.frequency = 2 * 3.14159265359;
    this._onChangeCallback = undefined;
}
RainbowColor.prototype.setPeriod = function(period) {
    this.frequency = (2 * 3.14159265359) / period;
}
RainbowColor.prototype.rgb = function() {
    var red   = Math.round((Math.sin(this.frequency*this.index + 0)                         * 127) + 128);
    var green = Math.round((Math.sin(this.frequency*this.index + 2 * 3.14159265359 / 3)     * 127) + 128);
    var blue  = Math.round((Math.sin(this.frequency*this.index + 2 * 3.14159265359 / 3 * 2 + 0) * 127) + 128);
    this.index++;

    // console.log(this.index);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
    // return 'rgb(' + ((this.r + red) % 128) + ',' + ((this.g + green) % 128) + ',' + ((this.b + blue) % 128) + ')';
}
RainbowColor.prototype.set = function(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.index = 0;
    if (this._onChangeCallback != undefined) {
        this._onChangeCallback(this.r,this.g,this.b);
    }
}
RainbowColor.prototype.onChangeCallback = function(callback) {
    this._onChangeCallback = callback;
}





function RainbowColorGenertor() {

}
RainbowColorGenertor.prototype.getColor = function() {
    return
}

function RainbowColorSelector(r,g,b,onChangeCallback) {
    this.color = new RainbowColor(r,g,b);
    this.period = 1;
    this.maxPeriod = 1;
    var that = this;
    var periodSliderCallback = function(barPercentage) {
        var period = that.period + 1;
        // var period = that.maxPeriod * barPercentage / 100;
        console.log(period);
        that.setPeriod(period);
        onChangeCallback(that.color);
    }
    this.periodSlider = new UISlider('periodSlider', periodSliderCallback);
}
RainbowColorSelector.prototype.setPeriod = function(period) {
    this.period = period;
    this.color.setPeriod(period);
    this.buildSwatches();
}
RainbowColorSelector.prototype.setMaxPeriod = function(period) {
    this.maxPeriod = period;
    this.buildSwatches();
}
RainbowColorSelector.prototype.buildSwatches = function() {
    this.color.index = 0;
    while (this.colorSwatches.firstChild) {
        this.colorSwatches.removeChild(this.colorSwatches.firstChild);
    }
    for (var i = 0; i < this.maxPeriod; i++) {
        var colorSwatch = document.createElement('div');
        colorSwatch.id = "swab" + i;
        colorSwatch.style.backgroundColor = this.color.rgb();
        this.colorSwatches.appendChild(colorSwatch);
    }
    this.color.index = 0;
}
RainbowColorSelector.prototype.draw = function(targetNode) {
    var that = this;
    var colorSelectorBuildCallback = function() {
        if (targetNode == undefined) {
            targetNode = document.getElementsByTagName('body')[0];
        };
        console.log("building sliders");
        var csNode = document.createElement('div');
        csNode.setAttribute("id", "RainbowColorSelector");
        targetNode.appendChild(csNode);
        that.periodSlider.draw(csNode);

        that.colorSwatches = document.createElement('div');
        that.colorSwatches.setAttribute("class", "rainbowColorSwatches");
        csNode.appendChild(that.colorSwatches);

        that.buildSwatches();



        // that.rSlider.draw(csNode);
        // that.gSlider.draw(csNode);
        // that.bSlider.draw(csNode);
        // that.luminocitySlider.draw(csNode);
        // var colorDisplayNode = document.createElement('div');
        // colorDisplayNode.setAttribute('id', 'colorDisplay');
        // csNode.appendChild(colorDisplayNode);

        // that.setColor();

        // var rPercent = that.rVal * 100 / 255;
        // var gPercent = that.gVal * 100 / 255;
        // var bPercent = that.bVal * 100 / 255;
        // that.rSlider.setBarPercentage(rPercent);
        // that.gSlider.setBarPercentage(gPercent);
        // that.bSlider.setBarPercentage(bPercent);
    }
    var body = document.getElementsByTagName('body')[0];
    if (body == null) globalOnLoadQueue.push(colorSelectorBuildCallback);
    else colorSelectorBuildCallback();
}

function RgbColorSelector (r, g, b, onChangeCallback) {
    var cs = this;
    var valCangeCallbackR = function(percentage) {
        cs.changeRed(percentage);
        onChangeCallback(cs.rVal, cs.gVal, cs.bVal);
    }
    var valCangeCallbackG = function(percentage) {
        cs.changeGreen(percentage);
        onChangeCallback(cs.rVal, cs.gVal, cs.bVal);
    }
    var valCangeCallbackB = function(percentage) {
        cs.changeBlue(percentage);
        onChangeCallback(cs.rVal, cs.gVal, cs.bVal);
    }
    var valCangeCallbackLuminocity = function(percentage) {
        cs.changeLuminocity(percentage);
        onChangeCallback(cs.rVal, cs.gVal, cs.bVal);
    }
    this.rSlider = new UISlider('sliderR', valCangeCallbackR);
    this.gSlider = new UISlider('sliderG', valCangeCallbackG);
    this.bSlider = new UISlider('sliderB', valCangeCallbackB);
    this.luminocitySlider = new UISlider('luminocity', valCangeCallbackLuminocity);
    this.rVal = r;
    this.gVal = g;
    this.bVal = b;
}
RgbColorSelector.prototype._getLuminocityMin = function() {
    return Math.min(this.rVal,this.gVal,this.bVal);
}
RgbColorSelector.prototype._getLuminocityMax = function() {
    return Math.max(this.rVal,this.gVal,this.bVal);
}
RgbColorSelector.prototype.changeRed = function(percentage) {
    if (percentage > 100) percentage = 100;
    this.rVal = Math.round(percentage / 100 * 255);
    // console.log("changing red to " + this.rVal);
    this.updateLuminocity();
    this.setColor();
}
RgbColorSelector.prototype.changeGreen = function(percentage) {
    if (percentage > 100) percentage = 100;
    this.gVal = Math.round(percentage / 100 * 255);
    // console.log("changing green to " + this.gVal);
    this.updateLuminocity();
    this.setColor();
}
RgbColorSelector.prototype.changeBlue = function(percentage) {
    if (percentage > 100) percentage = 100;
    this.bVal = Math.round(percentage / 100 * 255);
    // console.log("changing blue to " + this.bVal);
    this.updateLuminocity();
    this.setColor();
}
RgbColorSelector.prototype._getLuminocitySliderWidth = function() {

}
RgbColorSelector.prototype.updateLuminocity = function() {
    var min = this._getLuminocityMin();
    var max = this._getLuminocityMax();
    var totalDiff =  ((max - min) / 255 * 100) / 100 * this.luminocitySlider.barWidth + this.luminocitySlider.sliderWidth;

    var left = Math.min(
        parseInt(this.rSlider.sliderNode.style.left),
        parseInt(this.gSlider.sliderNode.style.left),
        parseInt(this.bSlider.sliderNode.style.left)
    );

    this.luminocitySlider.sliderNode.style.width = totalDiff + "px";
    this.luminocitySlider.sliderNode.style.left = left + "px";
    this.luminocitySlider.deadSpace = totalDiff - 2 * this.luminocitySlider.sliderWidthOffset;
}
RgbColorSelector.prototype.changeLuminocity = function(percentage) {
    var min = this._getLuminocityMin();
    var max = this._getLuminocityMax();
    var totalDiff =  ((max - min) / 255 * 100) / 100 * this.luminocitySlider.barWidth + this.luminocitySlider.sliderWidth;

    var rPercent = percentage + (this.rVal - min) / 255 * 100;
    var gPercent = percentage + (this.gVal - min) / 255 * 100;
    var bPercent = percentage + (this.bVal - min) / 255 * 100;
    var maxPercent = Math.max(rPercent, gPercent, bPercent);
    if (maxPercent > 100) {
        var excess = maxPercent - 100;
        rPercent -= excess;
        gPercent -= excess;
        bPercent -= excess;
    }
    this.rSlider.setBarPercentage(rPercent);
    this.gSlider.setBarPercentage(gPercent);
    this.bSlider.setBarPercentage(bPercent);
    var right = parseInt(this.rSlider.sliderNode.style.left) + totalDiff;
    this.luminocitySlider.sliderNode.style.width = totalDiff + "px";
}
RgbColorSelector.prototype.setSliders = function(r,g,b) {
    console.log("setting color slider to:");
    console.log(r, g, b);
    this.rSlider.setBarPercentage(r / 255 * 100);
    this.gSlider.setBarPercentage(g / 255 * 100);
    this.bSlider.setBarPercentage(b / 255 * 100);
}
RgbColorSelector.prototype.setColor = function(r,g,b) {
    if (r != undefined) {
        this.rVal = r;
        this.gVal = g;
        this.bVal = b;
    }
    var colorDisplayNode = document.getElementById("colorDisplay");
    colorDisplayNode.style.backgroundColor = 'rgb(' + this.rVal + ',' + this.gVal + ',' + this.bVal + ')';
}
RgbColorSelector.prototype.getColor = function() {
    'rgb(' + this.rVal + ',' + this.gVal + ',' + this.bVal + ')';
}

RgbColorSelector.prototype.getNode = function() {
    return document.getElementById("RgbColorSelector");
}

RgbColorSelector.prototype.draw = function(targetNode) {
    var cs = this;
    var colorSelectorBuildCallback = function() {
        if (targetNode == undefined) {
            targetNode = document.getElementsByTagName('body')[0];
        };
        console.log("building sliders");
        var csNode = document.createElement('div');
        csNode.setAttribute("id", "RgbColorSelector");
        targetNode.appendChild(csNode);
        cs.rSlider.draw(csNode);
        cs.gSlider.draw(csNode);
        cs.bSlider.draw(csNode);
        cs.luminocitySlider.draw(csNode);
        var colorDisplayNode = document.createElement('div');
        colorDisplayNode.setAttribute('id', 'colorDisplay');
        csNode.appendChild(colorDisplayNode);

        cs.setColor();

        var rPercent = cs.rVal * 100 / 255;
        var gPercent = cs.gVal * 100 / 255;
        var bPercent = cs.bVal * 100 / 255;
        cs.rSlider.setBarPercentage(rPercent);
        cs.gSlider.setBarPercentage(gPercent);
        cs.bSlider.setBarPercentage(bPercent);
    }
    var body = document.getElementsByTagName('body')[0];
    if (body == null) globalOnLoadQueue.push(colorSelectorBuildCallback);
    else colorSelectorBuildCallback();
}