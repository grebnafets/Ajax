
/* exported Ajax */
function Ajax(config) {
	'use strict';
	var Ajax = this;
	Ajax.url       = config.url      || "";
	Ajax.head      = config.head     || [];
	Ajax.method    = config.method   || "POST";
	Ajax.async     = config.async    || true;
	if (config.timeout) {
		Ajax.timeout = config.timeout;
	}
	Ajax.onsuccess = config.onsuccess  || function (data, header) {
		return {data:data, header:header};
	};
	Ajax.onfailure = config.onfailure  || function (data, header) {
		return {data:data, header:header};
	};
	Ajax.ontimeout = config.ontimeout || function () {
		return null;
	};
	Ajax.method.toUpperCase();
	Ajax.http = new XMLHttpRequest();
	function applyHeader(ajax) {
		var i, len, head;
		head = Ajax.head;
		len = head.length;
		for (i = 0; i < len; i += 1) {
			ajax.http.setRequestHeader(head[i].key, head[i].val);
		}
	}
	Ajax.http.onload = function () {
		var h;
		if (Ajax.http.readyState === 4) {
			if (Ajax.http.status === 200) {
				h = Ajax.http.getAllResponseHeaders();
				Ajax.onsuccess(Ajax.http.responseText, h);
			} else {
				h = Ajax.http.getAllResponseHeaders();
				Ajax.onfailure(Ajax.http.statusText, h);
			}
		}
	};
	Ajax.http.ontimeout = function () {
		Ajax.ontimeout();
	};
	Ajax.http.onerror = function () {
		Ajax.onfailure(Ajax.http.statusText);
	};
	Ajax.postMessage = function (data) {
		data = data || "";
		switch (Ajax.method) {
		case "POST":
			Ajax.http.open(Ajax.method, Ajax.url, Ajax.async);
			applyHeader(Ajax);
			Ajax.http.send(data);
			return true;
		case "GET":
			Ajax.http.open(Ajax.method, Ajax.url + data, Ajax.async);
			applyHeader(Ajax);
			Ajax.http.send(null);
			return true;
		}
		return false;
	};
	return Ajax;
}

Ajax.prototype.on = function(evt, handle) {
	"use strict";
	switch (evt) {
	case "success":
		this.onsuccess = handle;
		break;
	case "failure":
		this.onfailure = handle;
		break;
	case "timeout":
		this.ontimeout = handle;
		break;
	}
};

Ajax.prototype.parseHeader = function(headers) {
	"use strict";
	var i, line, lines, header;
	header = {};
	lines = headers.split("\n");
	for (i = 0; i < lines.length; i += 1) {
		line = lines[i].split(":");
		if (line[0] && line[1]) {
			header[line[0].trim()] = line[1].trim();
		}
	}
	return header;
};

