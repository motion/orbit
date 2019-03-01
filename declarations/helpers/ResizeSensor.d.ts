import * as React from 'react';
export declare class ResizeSensor extends React.Component<{
    onResize: (e: any) => void;
}> {
    iframe: HTMLIFrameElement | void;
    setRef: (ref: void | HTMLIFrameElement) => void;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleResize: () => void;
}
//# sourceMappingURL=ResizeSensor.d.ts.map