/// <reference types="react" />
import { ViewProps } from '@mcro/gloss';
export declare type TaskCommentLike = {
    author: {
        avatarUrl: string;
        login: string;
    };
    createdAt: string;
    body?: string;
};
export declare type TaskCommentProps = TaskCommentLike & {
    onClickPerson?: any;
};
export declare function TaskComment({ author, createdAt, body, onClickPerson }: TaskCommentProps): JSX.Element;
export declare function HighlightSection({ children, ...props }: ViewProps): JSX.Element;
//# sourceMappingURL=TaskComment.d.ts.map