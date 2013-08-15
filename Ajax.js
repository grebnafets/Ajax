/*global XMLHttpRequest, ActiveXObject*/
/**************************************/
        /* CLASS AJAX */
/**************************************/
function Ajax(url, data, callback, method, async) {
    'use strict';
    this.url = url || '';
    this.data = data || '';
    this.callback = callback || function (data) {return data; };
    this.method = method || 'POST';
    this.async = async || true;
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
    that = this;
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
    }
};
Ajax.prototype.update = function (data) {
    'use strict';
    var success = false;
    if (typeof this.object === 'function') {
        this.object = this.object();//change it from function to object
    }
    if (typeof this.object === 'object') {
        this.object.open(this.method, this.url, this.async);
        if (data !== undefined || data !== null) {
            this.object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.object.send(data);
            success = true;
        } else if (this.data !== '') {
            this.object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
        /* /CLASS AJAX */
/**************************************/