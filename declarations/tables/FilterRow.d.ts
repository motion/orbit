import { Filter } from './types';
import { PureComponent } from 'react';
declare type Props = {
    children: any;
    addFilter: (filter: Filter) => void;
    filterKey: string;
};
export default class FilterRow extends PureComponent {
    props: Props;
    onClick: (e: MouseEvent) => void;
    menuItems: {
        label: string;
        click: () => void;
    }[];
    render(): any;
}
export {};
//# sourceMappingURL=FilterRow.d.ts.map