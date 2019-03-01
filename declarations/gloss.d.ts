import { CSSPropertySet, ThemeObject } from '@mcro/css';
import { HTMLAttributes, ReactElement, ReactNode, ValidationMap } from 'react';
export declare type BaseRules = {
    [key: string]: string | number;
};
declare type GlossProps<Props> = Props & HTMLAttributes<any> & {
    tagName?: string;
};
declare type GlossThemeFn<Props> = ((props: GlossProps<Props>, theme: ThemeObject) => CSSPropertySet | null);
export interface GlossView<Props> {
    (props: Props & {
        children?: ReactNode;
    }, context?: any): ReactElement<any> | null;
    propTypes?: ValidationMap<Props>;
    contextTypes?: ValidationMap<any>;
    defaultProps?: Partial<Props>;
    displayName?: string;
    ignoreAttrs?: Object;
    theme: ((cb: GlossThemeFn<Props>) => GlossView<Props>);
    withConfig: (config: {
        displayName?: string;
    }) => any;
    glossConfig: {
        getConfig: () => {
            id: string;
            displayName: string;
            targetElement: any;
            styles: any;
            propStyles: Object;
            child: any;
        };
        themeFn: GlossThemeFn<Props> | null;
    };
}
export declare function gloss<Props = GlossProps<any>>(a?: CSSPropertySet | any, b?: CSSPropertySet): GlossView<Props>;
export {};
//# sourceMappingURL=gloss.d.ts.map