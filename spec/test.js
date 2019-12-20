const Jasmine = require('jasmine');
const jasmine = new Jasmine({});
jasmine.loadConfig({
  spec_dir: 'spec',
  spec_files: ['**/*[sS]pec.js'],
  helpers: ['helpers/**/*.js'],
  stopSpecOnExpectationFailure: false
});

const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
  colors: 1,
  cleanStack: 1,
  verbosity: 4,
  listStyle: 'indent',
  timeUnit: 'ms', 
  timeThreshold: { ok: 500, warn: 1000, ouch: 3000 },
  activity: 'star',
  emoji: true,
  beep: true
});

// initialize and execute
jasmine.env.clearReporters();
jasmine.addReporter(reporter);
jasmine.execute();
