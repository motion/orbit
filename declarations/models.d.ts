import { Model } from '@mcro/mediator';
import { FindOptions, FindOptionsWhere } from 'typeorm';
import { AppBit } from './interfaces/AppBit';
import { Bit } from './interfaces/Bit';
import { BitContentType } from './interfaces/BitContentType';
import { Job } from './interfaces/Job';
import { SearchResult } from './interfaces/Search';
import { Setting } from './interfaces/Setting';
import { Space } from './interfaces/Space';
import { User } from './interfaces/User';
export declare const BitModel: Model<Bit, FindOptions<Bit>, FindOptionsWhere<Bit>>;
export declare const JobModel: Model<Job, FindOptions<Job>, FindOptionsWhere<Job>>;
export declare const SettingModel: Model<Setting, FindOptions<Setting>, FindOptionsWhere<Setting>>;
export declare const SpaceModel: Model<Space, FindOptions<Space>, FindOptionsWhere<Space>>;
export declare const AppModel: Model<AppBit, FindOptions<AppBit>, FindOptionsWhere<AppBit>>;
export declare const UserModel: Model<User, FindOptions<User>, FindOptionsWhere<User>>;
export declare const GithubRepositoryModel: Model<any, {
    appId: number;
}, {
    appId: number;
}>;
export declare const SlackChannelModel: Model<any, {
    appId: number;
}, {
    appId: number;
}>;
export declare const SearchPinnedResultModel: Model<Bit, {
    query: string;
}, {
    query: string;
}>;
export declare type SearchQuery = {
    query: string;
    sortBy?: 'Recent' | 'Relevant';
    searchBy?: 'Topic' | 'Bit';
    startDate?: Date;
    endDate?: Date;
    appFilters?: string[];
    peopleFilters?: string[];
    locationFilters?: string[];
    take: number;
    skip?: number;
    appId?: number;
    appIds?: number[];
    group?: string;
    maxBitsCount?: number;
    spaceId?: number;
    ids?: number[];
    contentType?: BitContentType;
};
export declare const SearchResultModel: Model<SearchResult, SearchQuery, SearchQuery>;
export declare type GroupResult = {
    title: string;
    locations: string[];
    Apps: string[];
    topics: string[];
    count: number;
    people: {
        id: number;
        icon: string;
        name: string;
    };
};
export declare const SalientWordsModel: Model<string, {
    query: SearchQuery;
    count: number;
}, {
    query: SearchQuery;
    count: number;
}>;
export declare const SearchLocationsModel: Model<string, {
    query: SearchQuery;
    count: number;
}, {
    query: SearchQuery;
    count: number;
}>;
export declare const SearchByTopicModel: Model<Bit, {
    query: string;
    count: number;
}, {
    query: string;
    count: number;
}>;
export declare type SalientWord = {
    word: string;
    uniqueness: number;
};
export declare const CosalTopWordsModel: Model<string, {
    text: string;
    max?: number;
}, {
    text: string;
    max?: number;
}>;
export declare const CosalSaliencyModel: Model<SalientWord, {
    words: string;
}, {
    words: string;
}>;
export declare const CosalTopicsModel: Model<string, {
    query: string;
    count: number;
}, {
    query: string;
    count: number;
}>;
export declare type TrendingItem = {
    name: string;
    direction: 'up' | 'neutral' | 'down';
};
export declare const TrendingTopicsModel: Model<TrendingItem, void, void>;
export declare const TrendingTermsModel: Model<TrendingItem, void, void>;
export declare const PeopleNearTopicModel: Model<Bit, {
    topic: string;
    count: number;
}, {
    topic: string;
    count: number;
}>;
export declare const BitsNearTopicModel: Model<Bit, {
    topic: string;
    count: number;
}, {
    topic: string;
    count: number;
}>;
//# sourceMappingURL=models.d.ts.map