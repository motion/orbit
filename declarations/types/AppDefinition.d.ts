import { AppBit, ItemType } from '@mcro/models';
import { SearchBarType } from '@mcro/ui';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { AppConfig } from './AppConfig';
import { AppProps } from './AppProps';
import { OrbitItemViewProps } from './OrbitItemViewProps';
export declare type AppElements = {
    index?: React.ReactElement<any>;
    children?: React.ReactElement<any>;
    statusBar?: React.ReactElement<any>;
    toolBar?: React.ReactElement<any>;
    provideStores?: Object;
};
export declare type AppViews = {
    index?: FunctionComponent<AppProps> | false | null;
    main?: FunctionComponent<AppProps> | false | null;
    toolBar?: FunctionComponent<AppProps> | false | null;
    statusBar?: FunctionComponent<AppProps> | false | null;
    settings?: FunctionComponent<AppProps> | false | null;
    setup?: FunctionComponent<AppProps> | false | null;
};
export declare type AppDefinition = {
    id: string;
    name: string;
    icon: string;
    iconLight?: string;
    defaultViewConfig?: AppConfig['viewConfig'];
    context?: React.Context<any>;
    itemType?: ItemType;
    app?: FunctionComponent<AppProps>;
    settings?: FunctionComponent<AppProps>;
    setup?: FunctionComponent<AppProps>;
    appData?: Object;
    sync?: {};
    API?: {
        receive(app: AppBit, parentID: number, child: any): any;
    };
};
export declare type AppBitMainProps = OrbitItemViewProps & {
    searchBar: SearchBarType;
    searchTerm: string;
};
export declare type AppSettingsProps<T extends AppBit> = {
    appConfig?: AppConfig;
    app: T;
};
//# sourceMappingURL=AppDefinition.d.ts.map