import { ItemsPropsContextType } from './ItemPropsContext';
import { ThreadMessageLike } from './ThreadMessage';
export declare type ThreadLike = {
    body?: string;
    messages: ThreadMessageLike[];
};
export declare type ThreadProps = ThreadLike & ItemsPropsContextType;
export declare function Thread(rawProps: ThreadProps): any;
//# sourceMappingURL=Thread.d.ts.map