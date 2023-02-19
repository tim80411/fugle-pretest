module.exports = {
  dataUrl: 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
  host: {
    redis: '127.0.0.1',
  },
  port: {
    redis: 6379,
  },
  ws: {
    serverConfig: {
      port: 3000,
      handleProtocols: (protocols, client) => {
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        client._socket.binaryType = 'text';
      },
    },
    tickerTTL: 60,
  },
  address: {
    bitStamp: 'wss://ws.bitstamp.net.',
  },
};
