import { useDispatch } from "react-redux";
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchApp, fetchAppReviews } from "../redux/apps/actions";
import { debounceFuncs } from "../utils/LodashUtils";

const withAppLoad = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();
        const router = useRouter();
        const { id } = router.query;

        /******************* memoized callbacks ************************/

        const callbackLoadApp = useCallback(() => {
            // @ts-ignore
            dispatch(fetchApp(id));
        }, [id]);

        const callbackLoadAppReviews = useCallback(() => {
            if (id && id?.toString()?.length > 0) {
                // @ts-ignore
                dispatch(fetchAppReviews(id.toString()));
            }
        }, [id]);

        /******************* use effects ************************/

        useEffect(
            () =>
                debounceFuncs(() => {
                    callbackLoadApp();
                    callbackLoadAppReviews();
                }),
            [id],
        );

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withAppLoad;
