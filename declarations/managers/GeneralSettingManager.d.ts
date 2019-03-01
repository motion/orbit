import { Setting } from '@mcro/models';
import AutoLaunch from 'auto-launch';
export declare class GeneralSettingManager {
    autoLaunch: AutoLaunch;
    constructor();
    start(): Promise<void>;
    dispose(): void;
    handleAutoLaunch: (setting: Setting) => void;
}
//# sourceMappingURL=GeneralSettingManager.d.ts.map