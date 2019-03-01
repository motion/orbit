/// <reference types="react" />
import { ViewProps } from '@mcro/gloss';
export declare type TabsProps = {
    height?: number;
    onActive?: (key: string | void) => void;
    defaultActive?: string;
    active?: string | void;
    children?: Array<any>;
    orderable?: boolean;
    onOrder?: (order: Array<string>) => void;
    order?: Array<string>;
    persist?: boolean;
    newable?: boolean;
    onNew?: () => void;
    before?: Array<any>;
    after?: Array<any>;
    tabProps?: ViewProps;
    tabPropsActive?: ViewProps;
    TabComponent?: any;
};
export declare function Tabs(props: TabsProps): JSX.Element;
//# sourceMappingURL=Tabs.d.ts.map