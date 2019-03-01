/// <reference types="react" />
import { Document, Markdown, Task, Thread } from '@mcro/ui';
import { Conversation } from '../bit/BitConversation';
import { ConversationItem } from '../bit/BitConversationItem';
import { Readability } from '../bit/Readability';
export declare const itemViewsApp: {
    conversation: typeof Conversation;
    document: typeof Document;
    markdown: typeof Markdown;
    text: typeof Readability;
    task: typeof Task;
    thread: typeof Thread;
};
export declare const itemViewsListItem: {
    conversation: typeof ConversationItem;
    document: ({ item }: {
        item: any;
    }) => JSX.Element;
    markdown: ({ item }: {
        item: any;
    }) => JSX.Element;
    text: ({ item }: {
        item: any;
    }) => JSX.Element;
    task: ({ item }: {
        item: any;
    }) => JSX.Element;
    thread: ({ item }: {
        item: any;
    }) => JSX.Element;
    person: ({ item, }: {
        item: import("@mcro/models").Bit;
    }) => JSX.Element;
};
//# sourceMappingURL=itemViews.d.ts.map