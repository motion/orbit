/// <reference types="react" />
import { ItemRenderText, ListItemHide } from '@mcro/ui';
import { NormalItem } from '../types/NormalItem';
export declare type RichItemProps = {
    item?: any;
    normalizedItem?: Partial<NormalItem>;
    isExpanded?: boolean;
    shownLimit?: number;
    searchTerm?: string;
    renderText?: ItemRenderText;
    hide?: ListItemHide;
    beforeTitle?: React.ReactNode;
    oneLine?: boolean;
    condensed?: boolean;
    preventSelect?: boolean;
};
//# sourceMappingURL=RichItemProps.d.ts.map