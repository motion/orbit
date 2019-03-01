import SlackStrategy from './passportSlack';
declare const _default: {
    slack: {
        strategy: typeof SlackStrategy;
        config: {
            credentials: {
                callbackURL: string;
                clientID: string;
                clientSecret: string;
            };
        };
        options: {
            skipUserProfile: boolean;
            scope: string[];
        };
    };
    github: {
        strategy: any;
        config: {
            credentials: {
                callbackURL: string;
                clientID: string;
                clientSecret: string;
                scope: string[];
            };
        };
    };
    gmail: {
        strategy: any;
        config: {
            credentials: {
                callbackURL: string;
                clientID: string;
                clientSecret: string;
            };
        };
        options: {
            scope: string[];
            accessType: string;
            prompt: string;
        };
    };
    drive: {
        strategy: any;
        config: {
            credentials: {
                callbackURL: string;
                clientID: string;
                clientSecret: string;
            };
        };
        options: {
            scope: string[];
            accessType: string;
            prompt: string;
        };
    };
};
export default _default;
//# sourceMappingURL=oauthStrategies.d.ts.map