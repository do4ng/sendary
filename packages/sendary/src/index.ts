import { build } from './build';

if (process.argv.includes('--native-build')) {
  build();
}

export { build };
