/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { ChildProcessProps } from './startChildProcess';
export { cleanupChildren } from './cleanupChildren';
export { ChildProcessProps, startChildProcess } from './startChildProcess';
export declare function forkProcess(props: ChildProcessProps): ChildProcess;
export declare function forceKillProcess(proc: ChildProcess): void;
//# sourceMappingURL=forkProcess.d.ts.map