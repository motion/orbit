import { ItemsPropsContextType } from './ItemPropsContext';
import { TaskCommentLike } from './TaskComment';
export declare type TaskLike = {
    body: string;
    comments: TaskCommentLike[];
};
export declare function Task(rawProps: TaskLike & ItemsPropsContextType): any;
//# sourceMappingURL=Task.d.ts.map