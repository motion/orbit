/// <reference types="node" />
import { ChildProcess } from 'child_process';
export declare type ChildProcessProps = {
    name: string;
    isNode?: boolean;
    env?: {
        [key: string]: any;
    };
    inspectPort?: number;
    inspectPortRemote?: number;
};
export declare function startChildProcess({ name, isNode, inspectPort, inspectPortRemote, env, }: ChildProcessProps): ChildProcess;
//# sourceMappingURL=startChildProcess.d.ts.map