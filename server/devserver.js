const concurrently = require('concurrently');
const env = require('process').env;

env.NODE_ENV = 'dev';
env.PORT = 5000;

concurrently([{
    command: 'npm:ts:watch',
    name: 'Typescript',
    prefixColor: ['white', 'bgBlue', 'bold']
  },
  {
    command: 'npm:serve',
    name: 'Server',
    prefixColor: ['white', 'bgGreen', 'bold']
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
});
