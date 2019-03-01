import { AppDefinition } from '@mcro/kit';
import { AppBit, Bit } from '@mcro/models';
export declare const API: {
    receive(app: AppBit, parentID: number, child: Bit | {
        id?: number;
        name?: string;
        icon?: string;
        target: "folder";
    }): void;
};
export declare const ListsApp: AppDefinition;
//# sourceMappingURL=ListsApp.d.ts.map