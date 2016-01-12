/*!
 * koa-geolocation-middleware <https://github.com/lrdiv/koa-geolocation-middleware>
 */

'use strict'

var geoip = require('geoip-lite');

module.exports = function geolocate(options) {
  var routes = 'all';
  if (options && options['whitelist']) {
    routes = options['whitelist'];
  }

  return function *geolocate(next) {
    if (!routeIsWhitelisted(routes, this.url)) {
      return yield next;
    }
    
    var ip = this.request.ip;
    var geo = geoip.lookup(ip);

    if (geo != null) {
      var cityState = stringifyLocation(geo);
      this.request.query.geoipCityState = cityState;
      this.request.query.geoipLatLng = geo['ll'];
    }

    return yield next;
  }
}

var routeIsWhitelisted = function(routes, url) {
  if (routes == 'all') {
    return true
  }
  return routes.indexOf(url) > -1;
}

var stringifyLocation = function(geo) {
  return [geo.city, geo.region, geo.country].join(', ');
}
