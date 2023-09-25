import React, { useCallback, useEffect } from "react";
import { fetchApps } from "../redux/apps/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../redux/apps/reducer";
import { debounceFuncs } from "../utils/LodashUtils";

const withAppsLoad = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();
        const { appsById, lastPointer } = useSelector(selectApps);

        /******************* memoized callbacks ************************/

        const callbackLoadApps = useCallback(paramAppsById => {
            if (Object.keys(paramAppsById).length < 1) {
                // @ts-ignore
                dispatch(fetchApps(lastPointer));
            }
        }, []);

        /******************* use effects ************************/

        useEffect(() => debounceFuncs(() => callbackLoadApps(appsById)), []);

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withAppsLoad;
