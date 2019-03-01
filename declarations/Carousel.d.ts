import * as React from 'react';
import { Card } from './Card';
import { HorizontalScrollRowProps } from './layout/HorizontalScrollRow';
import { ListItemProps } from './lists/ListItem';
export declare type CarouselProps = HorizontalScrollRowProps & {
    CardView?: (props: ListItemProps) => JSX.Element;
    items?: any[];
    verticalPadding?: number;
    cardWidth?: number;
    cardHeight?: number;
    cardSpace?: number;
    cardProps?: ListItemProps;
    before?: React.ReactNode;
    after?: React.ReactNode;
    children?: React.ReactNode;
    offset: number;
    className?: string;
};
export declare class Carousel extends React.PureComponent<CarouselProps> {
    static defaultProps: {
        CardView: typeof Card;
    };
    frameRef: React.RefObject<HTMLDivElement>;
    readonly cardRefs: HTMLDivElement[];
    lastScroll: number;
    scrollTo: (index: any, { onlyIfOutside }?: {
        onlyIfOutside?: boolean;
    }) => void;
    render(): JSX.Element;
}
//# sourceMappingURL=Carousel.d.ts.map