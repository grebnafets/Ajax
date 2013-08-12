/*global console, Ajax, asreq1, asreq2, asreq3*/
var site = {};
function set_site(data) {
    'use strict';
    try {
        site = JSON.parse(data.responseText);
    } catch (e) {
        throw new Error();
    }
}
var siteAjax = [];
siteAjax[0] = new Ajax('json/site.json', '', set_site);
siteAjax[0].async = false;
siteAjax[0].update();
console.log(site);
siteAjax[1] = new Ajax('json/asynreq1.json', '', asreq1);
siteAjax[1].update();
siteAjax[2] = new Ajax('json/asynreq2.json', '', asreq2);
siteAjax[2].update();
siteAjax[3] = new Ajax('json/asynreq3.json', '', asreq3);
siteAjax[3].update();

