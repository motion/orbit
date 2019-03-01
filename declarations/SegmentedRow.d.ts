/// <reference types="react" />
import { BreadcrumbItem, BreadcrumbsProps } from './Breadcrumbs';
export declare function SegmentedRow(props: BreadcrumbsProps): JSX.Element;
export declare function getSegmentRadius(props: {
    ignoreSegment?: boolean;
    borderRadius?: number;
}, item: BreadcrumbItem): {
    borderRightRadius: number;
    borderRightWidth: number;
    borderLeftRadius: number;
} | {
    borderLeftRadius: number;
    borderRightRadius: number;
    borderRightWidth?: undefined;
};
//# sourceMappingURL=SegmentedRow.d.ts.map