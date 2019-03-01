#!/usr/bin/env node
declare let devcert: any;
declare let httpProxy: any;
declare let exec: any;
declare let killPort: any;
declare let fs: any;
declare let path: any;
declare const silentRm: (path: any) => boolean;
declare const getArg: (prefix: string) => string;
declare function setupPortForwarding(): Promise<boolean>;
declare function main(): Promise<void>;
//# sourceMappingURL=authProxyProcess.d.ts.map