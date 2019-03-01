import React from 'react';
declare type TimeAgoProps = {
    date?: number | Date;
    children?: number | Date;
    postfix?: string;
    isLive?: boolean;
    timeInterval?: number;
};
export declare class TimeAgo extends React.Component<TimeAgoProps> {
    static defaultProps: {
        date: any;
        element: string;
        postfix: string;
        className: any;
        isLive: boolean;
        addSuffix: boolean;
        includeSeconds: boolean;
        timeInterval: number;
    };
    interval: any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    updateTime: () => void;
    readonly date: number | Date;
    getDifference(): number;
    getInterval(): 0 | 60000 | 3600000;
    getParsedDate(): string;
    render(): string;
}
export {};
//# sourceMappingURL=TimeAgo.d.ts.map