const Promise = require('bluebird');
const argvSplit = require('argv-split');
const execa = require('execa');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

function history(histFile) {
  histFile = histFile || path.join(os.homedir(), '.zsh_history');

  return Promise.resolve(execa(path.join(__dirname, 'history.sh'), [histFile]))
  .then(result => {
    return Promise.props({
      contents: fs.readFileAsync(result.stdout, 'utf-8'),
      tempFile: result.stdout,
    });
  })
  .tap(history => {
    return fs.unlinkAsync(history.tempFile);
  })
  .then(history => {
    return history.contents.trim().split('\n').map(parseLine);
  })
  .catch(error => {
    throw new Error(`Unable to read history from \`${histFile}\`.\n${error.stack}`);
  });
};

function parseLine(line) {
  const parts = line.match(/^ *(\d+)  (\d+)  (\d+):(\d+)  (\S+) ?(.*)?/);

  return {
    time: new Date(parseInt(parts[2]) * 1000),
    executionTime: parseInt(parts[3]) * 60 + parseInt(parts[4]),
    command: parts[5],
    arguments: argvSplit(parts[6] || ''),
  };
};

module.exports = history;
