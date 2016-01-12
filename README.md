koa-geoip
=========

IP-based geolocation middleware for Koa

## Installation (via [npm](https://npmjs.org/package/koa-geoip))

```bash
$ npm install koa-geoip
```

## Usage

```javascript
var koa = require('koa');
var route = require('koa-route');
var geolocate = require('koa-geoip');
var app = koa();

app.use(geolocate());

app.use(route.get('/', function() {
  if (this.request.geolocation) {
    this.body = {
      city: this.request.geolocation.city,
      state: this.request.geolocation.region,
      country: this.request.geolocation.country,
      latlng: this.request.geolocation.ll
    }
  } else {
    this.body = {error: "Could not geolocate."};
  }
}));

app.listen(3000);
```

## Options

### whitelist

If the whitelist option is not provided, koa-geoip will be used on all routes.
The whitelist option allows you to specify which routes the middleware should be used
on.

```javascript
app.use(geolocate({
  whitelist: ['/foo', '/bar', '/baz']
}));
```

## Dependencies

[node-geoip](https://github.com/bluesmoon/node-geoip)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
