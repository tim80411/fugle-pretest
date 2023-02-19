# Fugle-Pretest

## Package
### Outer-Dependency
- process manager: pm2
- in-memory data store: redis

### Functional-Dependency
- framework: express - fast web server builder
- logger: pino - for well manipulate log
- security: helmet - for basic header setting
- validation: joi
- redis client: io-redis
- rate limit: express-rate-limit & rate-limit-redis
- time handle: moment
- cors

### Dev-Dependency
- linter


## How to start
- make sure you have installed outer-dependency
- start server
```sh
npm run start:dev
```
- stop server
```sh
npm run stop:dev
```

## Feature
### ApiServer
- default port: 3000
- endpoint: /data
- query param: `user=id`
- example:
```
/data?user=1
```

### wsServer
- default port: 3000
- endpoint: /streaming
- request: 
  - type: it can be `subscribe`, `unsubscribe`
  - channel: it can be ticker pair, [ref](https://www.bitstamp.net/websocket/v2/)
- example:
```json
{
  "type": "subscribe",
  "channel": "btcusd"
}
```

