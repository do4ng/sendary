import { globSync } from 'fast-glob';
import { dirname, isAbsolute, join } from 'path';
import { error } from './logger';

export class Find {
  cwd: string = process.cwd();

  #cwd(cwd?: string): string {
    if (cwd) this.cwd = cwd;

    // cwd must be absolute path
    if (!isAbsolute(this.cwd)) {
      error(new Error(`cwd must be absolute path. (provided: ${this.cwd})`));

      process.exit(1);
    }

    return this.cwd;
  }

  root(cwd?: string) {
    cwd = this.#cwd();

    const foundConfig = globSync('**/sendary.json', { cwd });

    if (foundConfig.length !== 1) {
      error(
        new Error(
          'Unexpected: Only one file should be found: root configuration (sendary.json).'
        )
      );
      process.exit(1);
    }

    return {
      base: dirname(foundConfig[0]),
      config: foundConfig[0],
    };
  }

  workspaces(cwd?: string, workspaces: string[] = ['**']) {
    const { base } = this.root(cwd);

    const foundWorkspaces = globSync(
      workspaces.map((workspace) => join(workspace, 'build.json').replace(/\\/g, '/')),

      { cwd: join(this.cwd, base) }
    );

    return foundWorkspaces.map((workspace) => dirname(workspace));
  }
}

export const find = new Find();

export * from './logger';
export * from './merge';
export * from './spinner';
