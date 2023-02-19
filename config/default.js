module.exports = {
  dataUrl: 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
  host: {
    redis: '127.0.0.1',
  },
  port: {
    redis: 6379,
  },
  ws: {
    tickerTTL: 60,
  },
  address: {
    bitStamp: 'wss://ws.bitstamp.net.',
  },
};
