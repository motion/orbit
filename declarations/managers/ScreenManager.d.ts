import { Screen } from '@mcro/screen';
export declare class ScreenManager {
    clearTimeout?: Function;
    isStarted: boolean;
    screen: Screen;
    constructor({ screen }: {
        screen: Screen;
    });
    start: () => Promise<void>;
}
//# sourceMappingURL=ScreenManager.d.ts.map