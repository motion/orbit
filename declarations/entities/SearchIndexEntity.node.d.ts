import { BaseEntity } from 'typeorm';
import { SearchIndex } from '../interfaces/SearchIndex';
export declare class SearchIndexEntity extends BaseEntity implements SearchIndex {
    id?: number;
    title?: string;
    body?: string;
}
//# sourceMappingURL=SearchIndexEntity.node.d.ts.map