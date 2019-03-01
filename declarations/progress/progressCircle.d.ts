import * as React from 'react';
import { Color } from '@mcro/gloss';
declare type Props = {
    percent: number;
    size: number;
    lineType: 'butt' | 'square' | 'round';
    backgroundColor: Color;
    lineColor: Color;
    lineWidth: number;
};
export declare class ProgressCircle extends React.Component<Props> {
    static defaultProps: {
        backgroundColor: number[];
        lineColor: string;
        lineWidth: number;
        size: number;
        lineType: string;
    };
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=progressCircle.d.ts.map