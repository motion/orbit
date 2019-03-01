import * as React from 'react';
import { NormalItem } from '../types/NormalItem';
import { ResolvableModel } from '../types/ResolvableModel';
export declare type ItemResolverExtraProps = {
    beforeTitle?: React.ReactNode;
    minimal?: boolean;
    preventSelect?: boolean;
};
export declare const normalizeItem: (model: ResolvableModel) => NormalItem;
//# sourceMappingURL=normalizeItem.d.ts.map