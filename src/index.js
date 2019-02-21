'use strict';

// load worker
const SharedWorker = require('shared-worker-loader!./worker.js')

// connect to it
const worker = new SharedWorker('Demo')