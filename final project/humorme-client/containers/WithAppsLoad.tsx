import React, { useCallback, useEffect } from "react";
import { fetchApp, fetchApps, fetchMyJokeRatings } from "../redux/apps/actions";
import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../redux/apps/reducer";
import { debounceFuncs } from "../utils/LodashUtils";
import { useRouter } from "next/router";
import { isString } from "lodash";

const withAppsLoad = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();
        const router = useRouter();
        const { id } = router.query;

        /******************* memoized callbacks ************************/

        const callbackLoadApps = useCallback(() => {
            const isViewingUserProfile = router.pathname.includes("users");
            const params = {
                userId: isViewingUserProfile ? id : undefined,
            };

            // if viewing user profile, forceUpdate the jokes in redux
            // @ts-ignore
            dispatch(fetchApps(params, isViewingUserProfile));
            // @ts-ignore
            dispatch(fetchMyJokeRatings());
        }, []);

        // const callbackLoadApp = useCallback(() => {
        //     if (id && isString(id)) {
        //         // @ts-ignore
        //         dispatch(fetchApp(id));
        //         // // @ts-ignore
        //         // dispatch(fetchMyJokeRatings());
        //     }
        // }, [id]);

        /******************* use effects ************************/

        useEffect(() => debounceFuncs(() => callbackLoadApps()), []);

        // useEffect(() => debounceFuncs(() => callbackLoadApp()), []);

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withAppsLoad;
