import { AppBit, Bit } from '@mcro/models';
export declare class BitUtils {
    static id(App: string, appId: number | undefined, data: string): number;
    static id(app: AppBit, data: string): number;
    static difference<T extends Bit>(firstBits: T[], secondBits: T[]): T[];
    static create(properties: Partial<Bit>, AppId?: any): Bit;
    static contentHash(bit: Bit): number;
}
//# sourceMappingURL=BitUtils.d.ts.map