// parse  str to date object
export const parseDate = (dateStr: any) => Date.parse(dateStr);

///
export const parseDateStrToDate = (dateStr: any) =>
    new Date(parseDate(dateStr));

export function toDateFromMilliseconds(milliseconds: number) {
    return new Date(milliseconds);
}

export function getDateFormatWrtDotLocale(locale: string) {
    const mapper = {
        en: "YYYY.MM.DD",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "YYYY.MM.DD";
}

export function getReverseDateFormatWrtDotLocale(locale: string) {
    const mapper = {
        en: "DD.MM.YYYY",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "DD.MM.YYYY";
}

export function getDateFormatWrtLocale(locale: string) {
    const mapper = {
        en: "YYYY/MM/DD",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "YYYY/MM/DD";
}

export function getReverseDateFormatWrtLocale(locale: string) {
    const mapper = {
        en: "DD/MM/YYYY",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "DD/MM/YYYY";
}

export function getDateTimeFormatWrtLocale(locale: string) {
    const mapper = {
        en: "YYYY/MM/DD HH:mm:ss",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "YYYY/MM/DD HH:mm:ss";
}

export function getDateShortTimeFormat(locale: string) {
    const mapper = {
        en: "YYYY/MM/DD HH:mm",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "YYYY/MM/DD HH:mm";
}

export function getDottedDateShortTimeFormat(locale: string) {
    const mapper = {
        en: "DD.MM.YYYY HH:mm",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "DD.MM.YYYY HH:mm";
}

export function getDateMonthFormat(locale: string) {
    const mapper = {
        en: "MM/DD",
        // TODO: Add date format for other languages
    };
    // @ts-ignore
    if (mapper[locale]) {
        // @ts-ignore
        return mapper[locale];
    }
    return "MM/DD";
}

export const getDateByNdays = (
    currentDate: Date,
    goBack: boolean,
    skipDayNo: number,
) => {
    const skipBy = skipDayNo * 24 * 60 * 60 * 1000 * (goBack ? -1 : 1);
    return new Date(currentDate.getTime() + skipBy);
};

export const getInitialStr = (value: any) => value.split(".")[0];

export const toMonthDateStr = (date?: Date) =>
    date
        ? date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
          })
        : "N/A";

export const toMonthDateYearStr = (date?: Date) =>
    date
        ? date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "N/A";

export const toHourMinStr = (date: Date) =>
    date.toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "numeric",
    });

/// shows lagging by
/// days or hours w.r.t current moment
/// <0 => day is behind the today
/// >0 => day is ahead of today
export const driftFromToday = (date: any) =>
    new Date().getTime() - parseDateStrToDate(date).getTime();

const getStr = (
    momentVal: any,
    timeStrSingle: string,
    momentStr: string,
    preMomentStr = "",
) =>
    `${preMomentStr} ${getInitialStr(Math.abs(momentVal).toString())} ${
        Math.abs(momentVal.valueOf()) < 2
            ? ` ${timeStrSingle} ${momentStr}`
            : `${timeStrSingle}s ${momentStr}`
    }`;

export const getDriftedDateStr = (
    momentVal: any,
    momentStr: any,
    preMomentStr = "",
) => {
    if (momentVal >= 1)
        return getStr(momentVal.valueOf(), "day", momentStr, preMomentStr);

    momentVal *= 24;
    if (momentVal.valueOf() >= 1)
        return getStr(momentVal.valueOf(), "hour", momentStr, preMomentStr);

    momentVal *= 60;
    if (momentVal.valueOf() >= 1)
        return getStr(momentVal.valueOf(), "min", momentStr, preMomentStr);

    momentVal *= 60;
    if (momentVal.valueOf() >= 1)
        return getStr(momentVal.valueOf(), "sec", momentStr, preMomentStr);

    return momentStr.length > 0 ? `a moment ${momentStr}` : `in a moment`;
};

export const driftDateStr = (dateStr: string) => {
    let drift = driftFromToday(parseDateStrToDate(dateStr));
    drift = toDays(drift);
    if (drift < 0) return getDriftedDateStr(Math.abs(drift.valueOf()), "");
    return getDriftedDateStr(drift.valueOf(), "ago");
};

export const toDays = (milliseconds: number) => {
    milliseconds /= 1000 * 60 * 60 * 24;
    return milliseconds;
};

// -------------------------------- //
//  add days in between given dates  //
//--------------------------------- //
export const addDays = (current: any, days: number) => {
    const newDate = new Date(current);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const getDateRanges = (
    fromDate: any,
    dateFormatter: Function,
    middleSteps = 5,
) => {
    if (!!fromDate) {
        const fromDateTime = new Date(fromDate);
        const newDates = [toMonthDateStr(fromDateTime)];
        for (let i = 0; i < middleSteps; i++) {
            const updatedDate = dateFormatter(addDays(fromDateTime, i + 1));
            !!updatedDate && newDates.push(updatedDate);
        }
        return newDates;
    }
    return [];
};
