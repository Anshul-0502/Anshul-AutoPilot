import morgan from 'morgan';
import config from '../config/env.js';

const requestLogger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
}, {
  skip: () => config.nodeEnv === 'test'
});

export default requestLogger;
