import { BuildOptions } from 'esbuild';

export type Formats = 'esmodule' | 'commonjs';

export interface DefaultBuild {
  format?: string[] | string;
  externals?: boolean;
}

export interface RootConfig<T = BuildOptions> {
  workspaces?: string[];
  build?: DefaultBuild;
  compilerOptions?: T;
}

export interface EntryPoint<T = BuildOptions> {
  output?: string;
  hash?: string;

  build?: DefaultBuild;
  compilerOptions?: T;
}

export interface WorkspaceConfig<T = BuildOptions> {
  entries?: Record<string, EntryPoint<T> | string>;

  chunks?: {
    target?: string[];
  };

  build?: DefaultBuild;
  compilerOptions?: T;
}
