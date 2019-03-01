/// <reference types="react" />
import { ItemsPropsContextType } from './ItemPropsContext';
export declare type ChatMessage = {
    person?: {
        id?: any;
        photo?: string;
    };
    text?: string;
    updatedAt?: number;
};
declare type ChatMessageProps = Partial<ItemsPropsContextType> & {
    message: ChatMessage;
    previousMessage?: ChatMessage;
};
export declare function ChatMessage(rawProps: ChatMessageProps): JSX.Element;
export {};
//# sourceMappingURL=ChatMessage.d.ts.map