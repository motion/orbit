export { Transform, Color } from './types';
export * from './helpers';
export default function motionStyle(options?: Object): (styles: Object, opts?: {
    errorMessage?: string;
    snakeCase?: boolean;
}) => Object;
