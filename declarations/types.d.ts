/// <reference types="react" />
export declare type OnScroll = (params: {
    scrollHeight: number;
    scrollTop: number;
    clientHeight: number;
}) => void;
export declare type KeyMapper = (index: number) => string;
export declare type RowRenderer = (params: {
    index: number;
    style: Object;
}) => any;
export declare type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>;
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
//# sourceMappingURL=types.d.ts.map