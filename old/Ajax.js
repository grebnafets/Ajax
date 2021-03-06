/*global XMLHttpRequest, ActiveXObject*/
/**************************************/
        /* CLASS AJAX */
/**************************************/
function Ajax(url, data, callback, method, async) {
    'use strict';
    this.url       = url      || '';
    this.data      = data     || '';
    this.callback  = callback || function (data) {return data; };
    this.method    = method   || 'POST';
    this.async     = async    || true;
    this.factories = [//I took this from quirksmode.org
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
    for (i = 0; i < this.factories.length; i = i + 1) {//also quirksmode.org
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
        if (data !== undefined || data !== null) {
            if (this.method === 'post' || this.method === 'POST') {
                this.object.open(this.method, this.url, this.async);
                this.object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                this.object.send(data);
            } else if (this.method === 'get' || this.method === 'GET') {
                this.object.open(this.method, this.url + data, this.async);
                this.object.send(null);
            }
            success = true;
        } else if (this.data !== '') {
            if (this.method === 'post' || this.method === 'POST') {
                this.object.open(this.method, this.url, this.async);
                this.object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                this.object.send(this.data);
            } else if (this.method === 'get' || this.method === 'GET') {
                this.object.open(this.method, this.url + this.data, this.async);
                this.object.send(null);
            }
            success = true;
        } else {
            this.object.send(null);
            success = true;
        }
    }
    return success;
};
/**************************************/
        /* /CLASS AJAX */
/**************************************/