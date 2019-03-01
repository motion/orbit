import { AppBit } from './AppBit';
import { BitContentType } from './BitContentType';
import { Location } from './Location';
export interface Bit {
    target: 'bit';
    id?: number;
    appIdentifier?: string;
    appId?: number;
    authorId?: number;
    originalId?: string;
    contentHash?: number;
    createdAt?: Date;
    updatedAt?: Date;
    title?: string;
    email?: string;
    photo?: string;
    body?: string;
    type?: BitContentType;
    bitCreatedAt?: number;
    bitUpdatedAt?: number;
    webLink?: string;
    desktopLink?: string;
    author?: Bit;
    people?: Bit[];
    bits?: Bit[];
    peopleCount?: number;
    app?: AppBit;
    data?: any;
    location?: Location;
    crawled?: boolean;
}
//# sourceMappingURL=Bit.d.ts.map