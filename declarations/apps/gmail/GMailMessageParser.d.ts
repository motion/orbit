import { GMailMessage } from '@mcro/services';
import { GmailBitDataParticipant } from './GmailBitData';
export declare class GMailMessageParser {
    private message;
    private textBody;
    private htmlBody;
    constructor(message: GMailMessage);
    getDate(): number;
    getTitle(): string | undefined;
    getParticipants(): GmailBitDataParticipant[];
    getTextBody(): string;
    getHtmlBody(): any;
    private removeAnnoyingCharacters;
    private buildTextBody;
    private buildHtmlBody;
}
//# sourceMappingURL=GMailMessageParser.d.ts.map