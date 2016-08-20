const Promise = require('bluebird');
const execa = require('execa');

const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

function history(histFile) {
  if (!isZSH()) return;

  return execa(path.join(__dirname, 'history.sh'))
  .then(result => {
    return fs.readFileAsync(result.stdout, 'utf-8');
  })
  .then(history => {
    return history.trim().split('\n').map(parseLine);
  });
};

function isZSH() {
  return /zsh$/.test(process.env.SHELL);
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

exports.history = history;
