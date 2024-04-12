import { find, merge, Spinner } from '@sendary/utils';
import { readFileSync } from 'fs';
import { join } from 'path';
import { build as esbuildBuild, BuildOptions } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

import { RootConfig, WorkspaceConfig } from '$sendary/types/config';

export async function build(cwd: string = process.cwd()) {
  const root = find.root(cwd);

  const rootConfig: RootConfig = JSON.parse(
    readFileSync(join(cwd, root.config)).toString()
  );

  const workspaces = find.workspaces(cwd, rootConfig.workspaces);

  for await (const workspace of workspaces) {
    const base = join(cwd, root.base, workspace);
    const workspaceConfig: WorkspaceConfig = JSON.parse(
      readFileSync(join(base, 'build.json')).toString()
    );
    const pkgJSON = JSON.parse(
      readFileSync(join(cwd, root.base, workspace, 'package.json')).toString()
    );

    // timer

    const spinner = new Spinner({
      message: `workspace:${pkgJSON.name.bold}`.gray,
    });

    for await (const entry of Object.keys(workspaceConfig.entries)) {
      const entryPath = join(cwd, root.base, workspace, entry);

      spinner.edit(
        `${'∘'.cyan} ${`workspace:${pkgJSON.name.bold}`.gray} Building ${entry}`
      );

      const $ = {
        output: null,
        build: {},
        compilerOptions: {},
      };

      const entryOptions = workspaceConfig.entries[entry];

      if (typeof entryOptions === 'string') {
        $.output = join(base, entryOptions);
      } else {
        $.output = join(base, entryOptions.output) || join(base, 'dist', entryPath);
        $.build = entryOptions.build || {};
        $.compilerOptions = entryOptions.compilerOptions || {};
      }

      const buildOptions = {
        build: rootConfig.build,
        compilerOptions: rootConfig.compilerOptions,
      };

      buildOptions.build = merge(buildOptions.build || {}, workspaceConfig.build || {});
      buildOptions.compilerOptions = merge(
        buildOptions.compilerOptions || {},
        workspaceConfig.compilerOptions || {}
      );
      buildOptions.build = merge(buildOptions.build || {}, $.build || {});
      buildOptions.compilerOptions = merge(
        buildOptions.compilerOptions || {},
        $.compilerOptions || {}
      );

      const esbuildOptions: BuildOptions = {
        entryPoints: [entryPath],
        outfile: $.output,
        bundle: true,
        platform: 'node',

        ...buildOptions.compilerOptions,
      };

      if (!esbuildOptions.plugins) esbuildOptions.plugins = [];

      if (buildOptions.build.externals) {
        esbuildOptions.plugins.push(
          nodeExternalsPlugin({
            packagePath: join(cwd, root.base, workspace, 'package.json'),
          })
        );
      }

      const formats: Array<'commonjs' | 'esmodule'> = (buildOptions.build
        .format as any) || ['commonjs'];

      const pos = esbuildOptions.outfile.lastIndexOf('.');

      for await (const format of formats) {
        await esbuildBuild({
          ...esbuildOptions,
          outfile:
            format === 'esmodule'
              ? `${esbuildOptions.outfile.substr(
                  0,
                  pos < 0 ? esbuildOptions.outfile.length : pos
                )}.mjs`
              : esbuildOptions.outfile,
          banner:
            format === 'esmodule'
              ? {
                  js: [
                    'import{createRequire}from"node:module";',
                    'import{fileURLToPath}from"node:url";',
                    'var __filename=fileURLToPath(import.meta.url);',
                    'var __dirname=fileURLToPath(new URL(".", import.meta.url));',
                    'var require=createRequire(import.meta.url);',
                  ].join(''),
                }
              : {},
          format: format === 'commonjs' ? 'cjs' : 'esm',
        });
      }
    }
    spinner.stop();
    spinner.clearLine();

    console.log(`${'DONE'.blue.bold} ${'workspace:'.dim}${`${pkgJSON.name}`.gray.bold}`);
  }
}
