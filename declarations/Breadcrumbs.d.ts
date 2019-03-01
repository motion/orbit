import { ViewProps } from '@mcro/gloss';
import { ReactNode } from 'react';
import { TextProps } from './text/Text';
export declare function Breadcrumbs(props: ViewProps): JSX.Element;
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type BreadcrumbsProps = Omit<TextProps, 'children'> & {
    separator?: ReactNode;
    children?: ReactNode | ((crumb?: ReturnType<typeof useBreadcrumb>) => ReactNode);
};
export declare function Breadcrumb({ separator, children, ...props }: BreadcrumbsProps): any;
export declare function BreadcrumbReset(props: {
    children: any;
}): JSX.Element;
export declare type BreadcrumbItem = {
    index: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
};
export declare function useBreadcrumb(): BreadcrumbItem | null;
export {};
//# sourceMappingURL=Breadcrumbs.d.ts.map