import { Bit } from './Bit';
import { BitContentType } from './BitContentType';
export interface SearchResult {
    target: 'search-group';
    id: number;
    group: string;
    contentType?: BitContentType;
    title?: string;
    text?: string;
    bitsTotalCount: number;
    bits: Bit[];
}
//# sourceMappingURL=Search.d.ts.map