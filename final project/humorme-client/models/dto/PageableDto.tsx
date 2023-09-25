export interface Error {
    code: string;
    data: any;
    desc: string;
    error: string;
    timestamp: Date;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: Sort;
    unpaged: boolean;
}

export interface Payload<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}

export interface PageableDto<T> {
    api_version: string;
    errors: Error[];
    payload: Payload<T>;
}

export interface PageableMiniDto<T> {
    page: {
        page: number;
        size: number;
        totalElementCount: number;
    };
    data: T[];
}
