export { Transform, Color } from './types';
export * from './helpers';
declare type Opts = {
    errorMessage?: string;
    snakeCase?: boolean;
};
export default function motionStyle(options?: Object): (styles: Object, opts?: Opts) => Object;
