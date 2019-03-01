export default class Oauth {
    findInfo: Function;
    updateInfo: Function;
    constructor({ strategies, onSuccess, findInfo, updateInfo }: {
        strategies: any;
        onSuccess: any;
        findInfo: any;
        updateInfo: any;
    });
    setupStrategies(strategies: any, onSuccess: any): void;
    refreshToken(service: any): Promise<{}>;
    setupSerialization(): void;
}
//# sourceMappingURL=oauth.d.ts.map