import { AppBit } from './AppBit';
import { JobStatus } from './JobStatus';
import { JobType } from './JobType';
export interface Job {
    target: 'job';
    id?: number;
    syncer?: string;
    appId?: number;
    app?: AppBit;
    time?: number;
    type?: JobType;
    status?: JobStatus;
    message?: string;
}
//# sourceMappingURL=Job.d.ts.map