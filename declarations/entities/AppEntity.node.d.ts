import { BaseEntity } from 'typeorm';
import { AppBit } from '../interfaces/AppBit';
import { ItemType } from '../interfaces/ItemType';
import { Space } from '../interfaces/Space';
export declare class AppEntity extends BaseEntity implements AppBit {
    target: 'app';
    id?: number;
    identifier?: string;
    sourceIdentifier?: string;
    token?: string;
    spaces?: Space[];
    space?: Space;
    spaceId?: number;
    name?: string;
    itemType?: ItemType;
    colors?: string[];
    pinned?: boolean;
    data?: any;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=AppEntity.node.d.ts.map