import _ from "lodash";

export function debounceFuncs(callback: Function) {
    let throttled: any = undefined;
    throttled = _.debounce(() => callback(), 1000);
    throttled();

    return () => throttled && throttled.cancel();
}
