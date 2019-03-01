import { BaseEntity } from 'typeorm';
import { AppBit } from '../interfaces/AppBit';
import { Job } from '../interfaces/Job';
import { JobStatus } from '../interfaces/JobStatus';
import { JobType } from '../interfaces/JobType';
export declare class JobEntity extends BaseEntity implements Job {
    target: 'job';
    id?: number;
    syncer?: string;
    time?: number;
    type?: JobType;
    status?: JobStatus;
    message?: string;
    appId?: number;
    app?: AppBit;
}
//# sourceMappingURL=JobEntity.node.d.ts.map