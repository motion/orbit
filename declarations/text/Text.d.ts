import { CSSPropertySet } from '@mcro/gloss';
import { HighlightOptions } from '@mcro/helpers';
import * as React from 'react';
declare type ChildrenHlFn = ((Highlights: any) => JSX.Element | null);
export declare type TextProps = CSSPropertySet & React.HTMLAttributes<HTMLParagraphElement> & {
    color?: CSSPropertySet['color'] | false;
    editable?: boolean;
    autoselect?: boolean;
    selectable?: boolean;
    onFinishEdit?: Function;
    onCancelEdit?: Function;
    getRef?: Function;
    ellipse?: boolean | number;
    tagName?: string;
    lines?: number;
    alpha?: number;
    onKeyDown?: Function;
    opacity?: number;
    size?: number;
    style?: Object;
    placeholder?: string;
    lineHeight?: number;
    sizeLineHeight?: number;
    measure?: boolean;
    onMeasure?: Function;
    sizeMethod?: string;
    highlight?: HighlightOptions;
    wordBreak?: string;
    theme?: Object;
    children: React.ReactNode | ChildrenHlFn;
    ignoreColor?: boolean;
};
export declare type Highlights = {
    highlights: string[];
};
export declare class Text extends React.PureComponent<TextProps> {
    selected: boolean;
    editable: boolean;
    node: any;
    static defaultProps: {
        tagName: string;
    };
    state: {
        doClamp: boolean;
        textHeight: number;
    };
    componentDidMount(): void;
    componentDidUpdate(): void;
    measure(): void;
    handleProps(props: any): void;
    focus(): void;
    readonly value: any;
    handleKeydown: (event: any) => void;
    getRef: (node: any) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Text.d.ts.map