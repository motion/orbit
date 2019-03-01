import Route from 'url-pattern';
export declare class SimpleRouter {
    routes: {};
    history: any;
    routeTable: {
        [path: string]: Route;
    };
    routeList: Array<{
        path: string;
        route: Route;
    }>;
    constructor({ routes, history, path }: {
        routes: any;
        history: any;
        path?: Location;
    });
    onRoute: ({ pathname }: {
        pathname: any;
    }) => void;
    getMatch: (path: any) => any;
}
//# sourceMappingURL=SimpleRouter.d.ts.map