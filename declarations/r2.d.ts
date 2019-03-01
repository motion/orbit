import 'isomorphic-fetch';
declare type R2Opts = {
    url?: string;
    method: string;
    formData?: Object;
    headers?: Object;
    query?: Object;
    json?: Object;
    body?: Object;
};
declare class R2 {
    opts: R2Opts;
    response: Promise<{}>;
    _headers: {};
    _caseless: any;
    json: any;
    text: any;
    arrayBuffer: any;
    blob: any;
    formData: any;
    constructor(...args: any[]);
    _args(...args: any[]): void;
    put(...args: any[]): this;
    get(...args: any[]): this;
    post(...args: any[]): this;
    head(...args: any[]): this;
    patch(...args: any[]): this;
    delete(...args: any[]): this;
    _request(): void;
    setHeaders(obj: any): this;
    setHeader(key: any, value: any): this;
}
export default function r2(...args: any[]): R2;
export declare const put: (...args: any[]) => R2;
export declare const get: (...args: any[]) => R2;
export declare const post: (...args: any[]) => R2;
export declare const head: (...args: any[]) => R2;
export declare const patch: (...args: any[]) => R2;
export declare const del: (...args: any[]) => R2;
export {};
//# sourceMappingURL=r2.d.ts.map