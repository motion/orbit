import { ItemType } from './ItemType';
import { Space } from './Space';
export interface AppBit {
    target: 'app';
    id?: number;
    itemType?: ItemType;
    identifier?: string;
    sourceIdentifier?: string;
    space?: Space;
    spaceId?: number;
    spaces?: Space[];
    name?: string;
    pinned?: boolean;
    colors?: string[];
    editable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    token?: string;
    data?: any;
}
//# sourceMappingURL=AppBit.d.ts.map