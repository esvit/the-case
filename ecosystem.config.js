module.exports = {
  apps: [{
    name: 'api',
    cwd: './build',
    script: 'npm',
    args: 'start',
    output: '/dev/stdout',
    error: '/dev/stderr',
    env: {
      HOST: '127.0.0.1',
      PORT: 5000,
      NODE_TLS_REJECT_UNAUTHORIZED: '0' // disable certificate validation for binance, nbu
    }
  }]
};
