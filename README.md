# Bee Server Health Check


Health check to express and restify projects

## Install

```
npm install -S @beetech/bee-server-health-check
```

## Usage

```js

const Koa = require('koa');
const healthCheck = require('@beetech/bee-server-health-check');

const app = new Koa();

const options = {
  healthFn = async (ctx) => ({ ok: true }), // default
  successStatusCode = 200, // default
  failureStatusCode = 503 // default
}

app.use(healthCheck(options));
// use some koa route to put it in an endpoint
// app.use(koaRoute.get('/health-check', healthCheck(options))); 

```

### options

| Name  | Type | Description | default |
|-------|------|-------------|---------|
| healthFn | Promise.<Object, Error> | Promise based or async function to check api health, the response will be sent to ctx.body | `async (ctx) => ({ ok: true })` |
| successStatusCode | number | Status code to be sent when `healthFn` fullfilled | `200`
| failureStatusCode | number | Status code to be sent when `healthFn` rejected | `503`
