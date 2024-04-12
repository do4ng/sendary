export function parseError(err: Error): {
  at: string;
  loc: string;
}[];

export function errorWithStacks(
  err: string,
  stacks: {
    at: string;
    loc: string;
  }[]
): void;

export function error(err: Error | string);
export function warn(message: string): void;
export function success(message: string, type?: string): void;
export function info(message: string): void;

export class Find {
  cwd: string;
  root(cwd?: string): { base: string; config: string };
  workspaces(cwd?: string, workspaces?: string[]): string[];
}

export const find: Find;
export function merge(a: any, b: any): any;

interface SpinnerOptions {
  spinner?: string[];
  tick?: number;
  message?: string;
}

export class Spinner {
  tick: number;

  spinner: string[];

  message: string;

  processor: NodeJS.Timer;

  constructor(opts: SpinnerOptions);

  clearLine(): this;

  start(): this;

  stop(message?: string): this;

  edit(message: string): this;
}

export function spinner(options?: SpinnerOptions): Spinner;
