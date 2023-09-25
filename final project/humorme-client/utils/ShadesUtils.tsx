/* ============================================= */
/* primary  */
/* ============================================= */
import _ from "lodash";

export const webPink = "#FC3258";
export const webPinkShade1 = "#f78398";
export const webBlue = "#5c5cd3";
export const webBlueShade2 = "#595cd4";

export const storeBlue = "#2685D1";
export const webBlueShade3 = "#30338E";
export const webSky = "#3cabdc";
export const webYellow = "#f6d475";
export const webGrey = "#484848";
export const webLightGrey = "#eaeaea";

const webColors = [
    webPink,
    webBlue,
    webSky,
    webYellow,
    webBlueShade2,
    webBlueShade3,
    webPinkShade1,
];

export const getRandomWebColor = index => {
    const posIndex = index % webColors.length;
    return webColors[posIndex];
};

/* ============================================= */
/* secondary */
/* ============================================= */
export const whitesmoke = "#FCFCFC";
export const white = "#fff";
export const orange = "#ffb822";
export const danger = "#EB5757";
export const royalBlue = "#77b6d4";
export const linkBlue = "#1890ff";
export const tokenBlue = "#009bc3";
export const hippieBlue = "#49809e";

// -------------------------------- //
//  Blue shades  //
//--------------------------------- //
export const ocean = "#012C72";
export const blue = "#0140A7";
export const cerulean = "#3870EA";
export const lavender = "#9DBCFF";
export const silver = "#D8E4FF";
export const snow = "#F3F7FF";

// -------------------------------- //
//  grey shades  //
//--------------------------------- //
export const night = "#303B4F";
export const stormy = "#586782";
export const mouse = "#A4AFBF";
export const cloud = "#E5E9ED";
export const sky = "#EAECEF";
export const pearl = "#f4f4f4";

// -------------------------------- //
//  grey shade 2  //
//--------------------------------- //
export const grey1 = "#333333";
export const grey2 = "#4f4f4f";
export const grey3 = "#828282";
export const grey4 = "#bdbdbd";
export const grey5 = "#e0e0e0";
export const grey6 = "#f2f2f2";

// -------------------------------- //
// Accents    //
//--------------------------------- //
export const amethyst = "#9D6FF2";
export const amethystShade1 = "#AF85FF";

export const violet = "#5916D7";
export const purple = "#7A41E6";
export const orchid = "#C19FFF";
export const lilac = "#E2D2FF";
export const periwinkle = "#F9F7FF";
export const lightlilac = "#f4f2fa";

export const emerald = "#049365";
export const parakeet = "#1BB885";
export const green = "#16D79A";
export const mint = "#81E9C8";
export const lime = "#D3F4EA";
export const seaFoam = "#EEF9F5";

export const dijon = "#8C6D1F";
export const medallion = "#CAA53D";
export const yellow = "#F4CA64";
export const daffodil = "#FAE29F";
export const banana = "#FDF3D7";
export const lightBanana = "#fffcf2";

export const lipstick = "#891B1B";
export const apple = "#B82020";
export const red = "#DC3030";
export const crimson = "#E46464";
export const mildRed = "#ff786e";
export const rose = "#F5AAAA";
export const lightRed = "#fff8f7";

export const hasData = (data: any, min = 0) => {
    return !!data && !_.isEmpty(data) && data?.length > min;
};

export const getDarkRandomColor = (lum = -0.25, defaultHex = "") => {
    let hex = hasData(defaultHex)
        ? defaultHex
        : String(
              "#" + Math.random().toString(16).slice(2, 8).toUpperCase(),
          ).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    let rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};

/* ============================================= */
/* Color selection by page url */
/* ============================================= */

export const getColorUrlPath = (selectedId, path) => {
    if (selectedId !== path) return stormy;
    switch (path) {
        case "about":
            return webSky;
        case "faqs":
            return webYellow;
        case "contact":
            return webBlueShade2;
        default:
            return webBlue;
    }
};
