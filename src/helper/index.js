#!/bin/env node
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { argv, argv0, env } from 'process';
import { fileURLToPath } from 'url';

// Ensure we can import from files without extensions.
spawn(argv0, [join(dirname(fileURLToPath(import.meta.url)), 'main.js'), ...argv.slice(2)], {
    env: { ...env, NODE_OPTIONS: '--es-module-specifier-resolution=node' },
    stdio: 'inherit',
    stdin: 'inherit',
});
