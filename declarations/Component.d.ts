import * as React from 'react';
declare type Weaken<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? any : T[P];
};
export interface StartComponent<P = {}, S = {}> extends React.Component<P, S> {
    props: P;
    state: S;
    setInterval: Function;
    setTimeout: Function;
}
export interface ComponentType<A extends Object = {}, B = {}> extends Weaken<StartComponent<A, B>, 'render'> {
    new (A: any, context?: any): React.Component<A, any>;
    render(props: A): JSX.Element | string | null;
}
export declare const Component: ComponentType<{}, {}>;
export {};
//# sourceMappingURL=Component.d.ts.map