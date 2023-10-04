import React, { useCallback, useEffect } from "react";
import { fetchApps, fetchMyJokeRatings } from "../redux/apps/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../redux/apps/reducer";
import { debounceFuncs } from "../utils/LodashUtils";

const withAppsLoad = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();

        const { appsById } = useSelector(selectApps);

        /******************* memoized callbacks ************************/

        const callbackLoadApps = useCallback(() => {
            if (Object.keys(appsById).length < 1) {
                // @ts-ignore
                dispatch(fetchApps());
                // @ts-ignore
                dispatch(fetchMyJokeRatings());
            }
        }, []);

        /******************* use effects ************************/

        useEffect(() => debounceFuncs(() => callbackLoadApps()), []);

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withAppsLoad;
