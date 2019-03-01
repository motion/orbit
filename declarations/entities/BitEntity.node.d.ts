import { BaseEntity } from 'typeorm';
import { AppBit } from '../interfaces/AppBit';
import { Bit } from '../interfaces/Bit';
import { BitContentType } from '../interfaces/BitContentType';
import { Space } from '../interfaces/Space';
import { LocationEntity } from './LocationEntity.node';
export declare class BitEntity extends BaseEntity implements Bit {
    target: 'bit';
    id?: number;
    contentHash?: number;
    appIdentifier?: string;
    appId?: number;
    authorId?: number;
    originalId?: string;
    title?: string;
    email?: string;
    photo?: string;
    body?: string;
    type?: BitContentType;
    webLink?: string;
    desktopLink?: string;
    data?: any;
    location?: LocationEntity;
    bitCreatedAt?: number;
    bitUpdatedAt?: number;
    crawled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    author?: Bit;
    people?: Bit[];
    bits?: Bit[];
    app?: AppBit;
    space?: Space;
    peopleCount?: number;
}
//# sourceMappingURL=BitEntity.node.d.ts.map