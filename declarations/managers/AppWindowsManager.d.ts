import { Screen } from '@mcro/screen';
declare type FakeProcess = {
    id: number;
    screen: Screen;
};
export declare class AppWindowsManager {
    processes: FakeProcess[];
    dispose(): Promise<void>;
    manageAppIcons: void;
    spawnScreen(id: number, iconPath: string): Promise<Screen>;
    handleAppState: (id: any) => (action: string) => void;
    removeProcess(id: number): Promise<void>;
}
export {};
//# sourceMappingURL=AppWindowsManager.d.ts.map