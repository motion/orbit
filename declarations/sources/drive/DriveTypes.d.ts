export declare type DriveFetchQueryOptions<_R> = {
    url: string;
    query: {
        [key: string]: any;
    };
    json?: boolean;
};
export declare type DriveFileResponse = {
    nextPageToken: string;
    files: DriveFile[];
};
export declare type DriveCommentResponse = {
    kind: 'drive#commentList';
    nextPageToken: string;
    comments: DriveComment[];
};
export declare type DriveRevisionResponse = {
    kind: 'drive#revisionList';
    nextPageToken: string;
    revisions: DriveRevision[];
};
export declare type DriveUser = {
    kind: 'drive#user';
    displayName: string;
    photoLink: string;
    me: boolean;
    permissionId: string;
    emailAddress: string;
};
export declare type DriveFile = {
    kind: 'drive#file';
    id: string;
    name: string;
    mimeType: string;
    description: string;
    starred: boolean;
    trashed: boolean;
    explicitlyTrashed: boolean;
    trashingUser: DriveUser;
    trashedTime: string;
    parents: string[];
    properties: {
        [key: string]: string;
    };
    appProperties: {
        [key: string]: string;
    };
    spaces: string[];
    version: number;
    webContentLink: string;
    webViewLink: string;
    iconLink: string;
    hasThumbnail: boolean;
    thumbnailLink: string;
    thumbnailVersion: number;
    viewedByMe: boolean;
    viewedByMeTime: string;
    createdTime: string;
    modifiedTime: string;
    modifiedByMeTime: string;
    modifiedByMe: boolean;
    sharedWithMeTime: string;
    sharingUser: DriveUser;
    owners: DriveUser[];
    teamDriveId: string;
    lastModifyingUser: DriveUser;
    shared: boolean;
    ownedByMe: boolean;
    capabilities: {
        canAddChildren: boolean;
        canChangeCopyRequiresWriterPermission: boolean;
        canChangeViewersCanCopyContent: boolean;
        canComment: boolean;
        canCopy: boolean;
        canDelete: boolean;
        canDownload: boolean;
        canEdit: boolean;
        canListChildren: boolean;
        canMoveItemIntoTeamDrive: boolean;
        canMoveTeamDriveItem: boolean;
        canReadRevisions: boolean;
        canReadTeamDrive: boolean;
        canRemoveChildren: boolean;
        canRename: boolean;
        canShare: boolean;
        canTrash: boolean;
        canUntrash: boolean;
    };
    viewersCanCopyContent: boolean;
    copyRequiresWriterPermission: boolean;
    writersCanShare: boolean;
    permissions: any[];
    permissionIds: string[];
    hasAugmentedPermissions: boolean;
    folderColorRgb: string;
    originalFilename: string;
    fullFileExtension: string;
    fileExtension: string;
    md5Checksum: string;
    size: number;
    quotaBytesUsed: number;
    headRevisionId: string;
    contentHints: {
        thumbnail: {
            image: string;
            mimeType: string;
        };
        indexableText: string;
    };
    imageMediaMetadata: {
        width: number;
        height: number;
        rotation: number;
        location: {
            latitude: number;
            numberitude: number;
            altitude: number;
        };
        time: string;
        cameraMake: string;
        cameraModel: string;
        exposureTime: number;
        aperture: number;
        flashUsed: boolean;
        focalLength: number;
        isoSpeed: number;
        meteringMode: string;
        sensor: string;
        exposureMode: string;
        colorSpace: string;
        whiteBalance: string;
        exposureBias: number;
        maxApertureValue: number;
        subjectDistance: number;
        lens: string;
    };
    videoMediaMetadata: {
        width: number;
        height: number;
        durationMillis: number;
    };
    isAppAuthorized: boolean;
};
export declare type DriveComment = {
    kind: 'drive#comment';
    id: string;
    createdTime: string;
    modifiedTime: string;
    author: DriveUser;
    htmlContent: string;
    content: string;
    deleted: boolean;
    resolved: boolean;
    quotedFileContent: {
        mimeType: string;
        value: string;
    };
    anchor: string;
    replies: any[];
};
export declare type DriveRevision = {
    kind: 'drive#revision';
    id: string;
    mimeType: string;
    modifiedTime: string;
    keepForever: boolean;
    published: boolean;
    publishAuto: boolean;
    publishedOutsideDomain: boolean;
    lastModifyingUser: DriveUser;
    originalFilename: string;
    md5Checksum: string;
    size: number;
};
export declare type DriveLoadedFile = {
    file: DriveFile;
    content: string;
    thumbnailFilePath: string;
    comments: DriveComment[];
    revisions: DriveRevision[];
    users: DriveUser[];
    parent?: DriveFile;
};
export declare type DriveAbout = {
    user: DriveUser;
};
//# sourceMappingURL=DriveTypes.d.ts.map