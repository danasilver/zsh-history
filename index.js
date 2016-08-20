const Promise = require('bluebird');
const execa = require('execa');

const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

function history(histFile) {
  histFile = histFile || path.join(os.homedir(), '.zsh_history');

  return execa(path.join(__dirname, 'history.sh'), [histFile])
  .then(result => {
    return fs.readFileAsync(result.stdout, 'utf-8');
  })
  .then(history => {
    return history.trim().split('\n').map(parseLine);
  })
  .catch(error => {
    throw new Error(`Unable to read history from \`${histFile}\`.`);
  });
};

function parseLine(line) {
  const parts = line.match(/^ *(\d+)  (\d+)  (\d+):(\d+)  (\S+) ?(.*)?/);

  return {
    time: new Date(parseInt(parts[2]) * 1000),
    executionTime: parseInt(parts[3]) * 60 + parseInt(parts[4]),
    command: parts[5],
    arguments: parts[6],
  };
};

module.exports = history;
