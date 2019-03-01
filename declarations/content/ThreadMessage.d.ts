/// <reference types="react" />
export declare type ThreadMessageLike = {
    body?: string;
    participants: {
        name: string;
        email: string;
        type: 'to' | 'from';
    }[];
    date: number;
};
export declare function ThreadMessage({ date, participants, body }: ThreadMessageLike): JSX.Element;
//# sourceMappingURL=ThreadMessage.d.ts.map