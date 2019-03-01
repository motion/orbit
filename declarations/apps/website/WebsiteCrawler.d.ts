import { Logger } from '@mcro/logger';
import { WebsiteCrawledData } from './WebsiteCrawledData';
export interface WebsiteCrawlerOptions {
    url: string;
    deep: boolean;
    handler: (data: WebsiteCrawledData) => Promise<boolean> | boolean;
}
export declare class WebsiteCrawler {
    private log;
    private visitedLinks;
    private maxLinks;
    private browser;
    constructor(log: Logger);
    isOpened(): boolean;
    start(): Promise<void>;
    close(): Promise<void>;
    run(options: WebsiteCrawlerOptions): Promise<void>;
    private visit;
}
//# sourceMappingURL=WebsiteCrawler.d.ts.map