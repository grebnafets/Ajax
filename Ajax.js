/*global XMLHttpRequest, ActiveXObject*/
/**************************************/
/*           CLASS AJAX              */
/**************************************/
function Ajax(url, data, callback, method, async) {
    'use strict';
    this.url       = url      || '';
    this.data      = data     || '';
    this.callback  = callback || function () {};
    this.method    = method   || 'POST';
    this.async     = async    || true;
    this.factories = [//good idea quirksmode.org
        function () {return new XMLHttpRequest(); },
        function () {return new ActiveXObject("Msxml2.XMLHTTP"); },
        function () {return new ActiveXObject("Msxml3.XMLHTTP"); },
        function () {return new ActiveXObject("Microsoft.XMLHTTP"); }
    ];
}
Ajax.prototype.object = function () {//function that will transform itself to an object
    'use strict';
    var xmlhttp, i, errFound, that;
    that    = this;
    xmlhttp = false;
    for (i = 0; i < this.factories.length; i = i + 1) {//thank you quirksmode.org; keep up being awesome!
        errFound = false;
        try {
            xmlhttp = this.factories[i]();
        } catch (e) {
            errFound = true;
        }
        if (!errFound) {
            break;
        }
    }
    if (xmlhttp !== null) {
        xmlhttp.onreadystatechange = function () {
            var ready = true;
            if (xmlhttp.readyState !== 4) {ready = false; }
            if (xmlhttp.status !== 200 && xmlhttp.status !== 304) {
                ready = false;
            }
            if (ready) {
                that.callback(xmlhttp);
            }
        };
    }
    if (xmlhttp !== null) {
        return xmlhttp;
    } else {
        return false;
    }
};
Ajax.prototype.update = function () {
    'use strict';
    var success = false;
    if (typeof this.object === 'function') {
        this.object = this.object();//change it from function to object
    }
    if (typeof this.object === 'object') {
        this.object.open(this.method, this.url, this.async);
        if (this.data !== '') {
            this.object.send(this.data);
            success = true;
        } else {
            this.object.send();
            success = true;
        }
    }
    return success;
};
/**************************************/
/*          /CLASS AJAX              */
/**************************************/