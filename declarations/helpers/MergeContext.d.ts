import React from 'react';
export declare type MergeContextProps<A> = {
    Context: React.Context<A>;
    value: Partial<A>;
    children: React.ReactNode;
};
export declare function MergeContext<A>(props: MergeContextProps<A>): any;
//# sourceMappingURL=MergeContext.d.ts.map