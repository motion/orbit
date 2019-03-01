import * as React from 'react';
import { ProgressBar } from './progressBar';
import { ProgressCircle } from './progressCircle';
declare type Props = {
    percent: number;
    size: any;
    lineType?: any;
    type: 'circle' | 'bar';
    backgroundColor?: any;
    lineColor?: any;
    lineWidth?: any;
};
export declare class Progress extends React.Component<Props> {
    static Bar: typeof ProgressBar;
    static Circle: typeof ProgressCircle;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Progress.d.ts.map