/// <reference types="node" />
import { ChildProcess } from 'child_process';
declare type SudoerOptions = {
    name?: string;
    icns?: string;
};
declare class Sudoer {
    options?: SudoerOptions;
    cp?: ChildProcess;
    platform?: string;
    tmpdir?: string;
    constructor(options: SudoerOptions);
    hash(buffer: any): string;
    joinEnv(options: any): any[];
    escapeDoubleQuotes(string: any): any;
    encloseDoubleQuotes(string: any): any;
    kill(pid: any): void;
}
declare class SudoerUnix extends Sudoer {
    constructor(options?: SudoerOptions);
    copy(source: any, target: any): Promise<{}>;
    remove(target: any): Promise<{}>;
    reset(): Promise<void>;
}
declare class SudoerDarwin extends SudoerUnix {
    constructor(options?: SudoerOptions);
    isValidName(name: any): boolean;
    joinEnv(options: any): any[];
    exec(command: any, options?: {
        env: any;
    }): Promise<{
        stdout: string;
        stderr: string;
    }>;
    getCommand: (cmd: any) => string;
    spawn(command: any, args: any, options?: {
        env: any;
    }): Promise<{}>;
}
declare class SudoerLinux extends SudoerUnix {
    binary?: string;
    paths: string[];
    constructor(options?: SudoerOptions);
    getBinary(): Promise<string>;
    exec(command: any, options?: {
        env: any;
    }): Promise<{}>;
    spawn(command: any, args: any, options?: {
        env: any;
    }): Promise<{}>;
}
declare class SudoerWin32 extends Sudoer {
    bundled: string;
    binary?: string;
    constructor(options?: SudoerOptions);
    writeBatch(command: any, args: any, options: any): Promise<{
        batch: string;
        output: string;
    }>;
    watchOutput(cp: any): Promise<any>;
    prepare(): Promise<{}>;
    exec(command: any, options?: {
        env: any;
    }): Promise<Buffer>;
    spawn(command: any, args: any, options?: {
        env: any;
    }): Promise<any>;
    clean(cp: any): void;
}
export { SudoerDarwin, SudoerLinux, SudoerWin32 };
//# sourceMappingURL=sudoer.d.ts.map