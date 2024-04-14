#!/usr/bin/env node

import program from 'animaux';
import pkg from '../package.json';
import { build } from './build';

const app = program('sendary');

app.version(pkg.version);

app
  .command('build')
  .describe('Build Workspace')
  .action(() => {
    build(process.cwd());
  });

app.parse(process.argv);
