import { BaseEntity } from 'typeorm';
import { Setting } from '../interfaces/Setting';
export declare class SettingEntity extends BaseEntity {
    target: 'setting';
    id?: number;
    name?: string;
    values?: Setting['values'];
}
//# sourceMappingURL=SettingEntity.node.d.ts.map