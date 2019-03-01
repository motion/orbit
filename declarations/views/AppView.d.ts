import React from 'react';
import { AppStore } from '../stores';
import { AppProps } from '../types/AppProps';
export declare type AppViewProps = Pick<AppProps, 'title' | 'viewType' | 'isActive' | 'appConfig'> & {
    id?: string;
    identifier: string;
    appStore?: AppStore;
    after?: React.ReactNode;
    before?: React.ReactNode;
    inside?: React.ReactNode;
};
export declare type AppViewRef = {
    hasView?: boolean;
};
export declare const AppView: React.ForwardRefExoticComponent<Pick<AppProps, "title" | "isActive" | "appConfig" | "viewType"> & {
    id?: string;
    identifier: string;
    appStore?: AppStore;
    after?: React.ReactNode;
    before?: React.ReactNode;
    inside?: React.ReactNode;
} & React.RefAttributes<AppViewRef>>;
//# sourceMappingURL=AppView.d.ts.map