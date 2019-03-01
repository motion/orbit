import { SimpleRouter } from './SimpleRouter';
declare type RouterProps = {
    routes: {
        [name: string]: any;
    };
    history?: any;
};
export declare class Router {
    router: SimpleRouter;
    routes: any;
    history: any;
    max: number;
    position: number;
    path: string;
    route: any;
    params: {};
    forceUpdate: boolean;
    version: number;
    _id: number;
    onNavigateCallback: any;
    constructor({ routes, history }: RouterProps);
    setRoute: (path: any, params: any) => void;
    readonly key: string;
    readonly activeView: any;
    readonly routeName: string;
    readonly atFront: boolean;
    readonly atBack: boolean;
    back: () => void;
    forward: () => void;
    link: (where: any) => (e: any) => void;
    go: (...segments: any[]) => void;
    set: (key: any, val: any) => void;
    onNavigate: (callback: any) => void;
    normalizeParams: (params: any) => any;
    setObject: (params: any) => any;
    setParam: (key: any, val: any) => any;
    unset: (key: any) => void;
    redirect: (path: any) => void;
    isActive: (path: any) => boolean;
}
export {};
//# sourceMappingURL=Router.d.ts.map