import { Logger } from '@mcro/logger';
import { SlackChannel, SlackMessage, SlackTeam, SlackUser } from './SlackTypes';
import { AppBit } from '@mcro/models';
export declare class SlackLoader {
    private app;
    private log;
    constructor(app: AppBit, log?: Logger);
    loadTeam(): Promise<SlackTeam>;
    loadUsers(cursor?: string): Promise<SlackUser[]>;
    loadChannels(cursor?: string): Promise<SlackChannel[]>;
    loadMessages(channelId: string, oldestMessageId?: string, latestMessageId?: string): Promise<SlackMessage[]>;
}
//# sourceMappingURL=SlackLoader.d.ts.map