import { Screen } from '@mcro/screen';
export declare class KeyboardManager {
    pauseTm: any;
    constructor({ screen }: {
        screen: Screen;
    });
    downTm: any;
    isOptionDown: boolean;
    mouseActive: number;
    onOptionKey: ({ type, value }: {
        type: any;
        value: any;
    }) => void;
    clearOnDocked: void;
    onMouseMove: () => void;
    reOpenIfMouseSettles: void;
    private resetHoldingOption;
}
//# sourceMappingURL=KeyboardManager.d.ts.map