import React from 'react';
import { AppElements } from '../types/AppDefinition';
export declare const AppLoadContext: React.Context<{
    identifier: string;
    id: string;
}>;
export declare class App extends React.Component<AppElements> {
    state: {
        error: any;
    };
    componentDidCatch(error: any): void;
    render(): JSX.Element;
}
//# sourceMappingURL=App.d.ts.map