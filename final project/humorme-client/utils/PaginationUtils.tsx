import { PageableDto, PageableMiniDto } from "../models/dto/PageableDto";

export function convertPaginationToClientPaginationConfig(
    res: PageableDto<any>,
) {
    const page = res.payload.pageable.pageNumber;
    const size = res.payload.pageable.pageSize;
    const totalElements = res.payload.totalElements;
    const numberOfElements = res.payload.numberOfElements;
    return {
        page: page,
        size: size,
        totalElements: totalElements,
        numberOfElements: numberOfElements,
    };
}

export function convertMiniPaginationToClientPaginationConfig(
    res: PageableMiniDto<any>,
) {
    const page = res.page.page;
    const size = res.page.size;
    const numberOfElements = res.data.length;
    const totalElements = res.page.totalElementCount;
    return {
        page: page,
        size: size,
        totalElements: totalElements,
        numberOfElements: numberOfElements,
    };
}
