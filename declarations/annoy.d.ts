import { Result } from './cosal';
export declare function annoyScan({ db, path }: {
    db: any;
    path: any;
}): Promise<void>;
export declare function annoySearch({ path, db, vector, max }: {
    path: any;
    db: any;
    vector: any;
    max: any;
}): Promise<Result[]>;
export declare function annoyRelated({ path, db, index, max }: {
    path: any;
    db: any;
    index: any;
    max: any;
}): Promise<any>;
//# sourceMappingURL=annoy.d.ts.map