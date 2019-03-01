import { Command, SaveOptions } from '@mcro/mediator';
import { AppBit } from './AppBit';
export declare const NewFallbackServerPortCommand: Command<number, void>;
export declare const AppRemoveCommand: Command<void, {
    appId: number;
}>;
export declare const AppForceSyncCommand: Command<void, {
    appId: number;
}>;
export declare const AppForceCancelCommand: Command<void, {
    appId: number;
}>;
export declare const AppSaveCommand: Command<{
    success: boolean;
    error?: string;
}, {
    app: SaveOptions<AppBit>;
}>;
export declare const SlackAppBlacklistCommand: Command<void, {
    appId: number;
    channel: string;
    blacklisted: boolean;
}>;
export declare const SettingOnboardFinishCommand: Command<void, void>;
export declare const GithubAppBlacklistCommand: Command<void, {
    appId: number;
    repository: string;
    blacklisted: boolean;
}>;
export declare const CheckProxyCommand: Command<boolean, void>;
export declare const SetupProxyCommand: Command<boolean, void>;
export declare const OpenCommand: Command<boolean, {
    url: string;
}>;
export declare const TearAppCommand: Command<void, {
    appType: string;
    appId: number;
}>;
export declare const CloseAppCommand: Command<void, {
    appId: number;
}>;
export declare const RestartAppCommand: Command<void, void>;
export declare const ResetDataCommand: Command<void, void>;
export declare const ChangeDesktopThemeCommand: Command<void, {
    theme: "dark" | "light";
}>;
export declare const SendClientDataCommand: Command<void, {
    name: "CLOSE_APP" | "SHOW" | "HIDE" | "TOGGLE_SETTINGS";
    value: any;
}>;
//# sourceMappingURL=commands.d.ts.map