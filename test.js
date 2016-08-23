import path from 'path';
import test from 'ava';
import history from '.';

const fixture = path.join(__dirname, 'fixture');

test('reads 3 lines from history', t => {
  return history(fixture).then(commands => {
    t.is(commands.length, 3);
  });
});

test('parses the command\'s time', t => {
  return history(fixture).then(commands => {
    t.true(commands[0].time instanceof Date);
  });
});

test('parses the command\'s execution time', t => {
  return history(fixture).then(commands => {
    t.is(commands[2].executionTime, 3);
  });
});

test('parses the command', t => {
  return history(fixture).then(commands => {
    t.is(commands[2].command, 'git');
  });
});

test('parses the command\'s arguments into an array', t => {
  t.plan(2);

  return history(fixture).then(commands => {
    t.true(commands[1].arguments instanceof Array);
    t.is(commands[1].arguments.length, 3);
  });
});

test('throws when unable to read history', t => {
  t.throws(history('notafile'));
});
