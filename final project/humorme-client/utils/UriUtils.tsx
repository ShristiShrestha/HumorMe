export const parseStrToUrl = strUrl => {
    const url = new URL(strUrl);
    return {
        url: url,
        protocol: url.protocol,
        path: url.pathname,
        host: url.host,
    };
};
