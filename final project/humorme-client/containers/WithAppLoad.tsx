import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../redux/apps/reducer";
import React, { useCallback, useEffect } from "react";
import { setApp, setAppRateFeatures } from "../redux/apps/actions";
import { debounceFuncs } from "../utils/LodashUtils";
import { getAppRateFeatures, getApps } from "../axios/AppsApi";
import { toUIAppDetail } from "../utils/AppsUtils";
import { useRouter } from "next/router";
import { UserRole } from "../functions/src/utils/Users";
import _ from "lodash";
import { selectAuth } from "../redux/auth/reducer";
import { UIAppDetail } from "../models/dto/JokeDto";

const withAppLoad = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();
        const router = useRouter();
        const { id } = router.query;
        const { user } = useSelector(selectAuth);
        const { appsById, app, appRateFeatures } = useSelector(selectApps);

        /******************* memoized callbacks ************************/

        const callbackLoadApp = useCallback(
            (paramsApps: { [id: string]: UIAppDetail }) => {
                if (id !== app?.appId) {
                    const filteredApps: UIAppDetail[] = Object.values(
                        paramsApps,
                    ).filter((item: any) => item.appId === id);
                    if (filteredApps.length > 0) {
                        const filteredApp: UIAppDetail = filteredApps[0];
                        filteredApp?.appId === id &&
                            // @ts-ignore
                            dispatch(setApp(filteredApp));
                    } else {
                        //@ts-ignore
                        getApps(id).then(
                            resApp =>
                                resApp?.appId === id && // @ts-ignore
                                dispatch(setApp(toUIAppDetail(resApp))),
                        );
                    }
                }
            },
            [id],
        );

        const callbackLoadRateFeatures = useCallback(() => {
            if (
                id &&
                id?.toString()?.length > 0 &&
                user?.role === UserRole.EXPERIMENT
            ) {
                getAppRateFeatures(id?.toString())
                    .then(res => {
                        // @ts-ignore
                        dispatch(setAppRateFeatures(res));
                    })
                    .catch(err => {
                        const status = _.get(err, "response.status", undefined);
                        if (status)
                            console.error(
                                "Error fetching rate features: ",
                                status,
                                err,
                            );
                        // if rate feature responded nth
                        // and redux has rate features of other app
                        if (id && appRateFeatures?.appId !== id?.toString()) {
                            // @ts-ignore
                            dispatch(setAppRateFeatures({}));
                        }
                    });
            }
        }, [id, user?.role]);

        // const callbackLoadAppReviews = useCallback(() => {
        //     if (id && id?.toString()?.length > 0) {
        //         // @ts-ignore
        //         dispatch(fetchAppReviews(id.toString()));
        //     }
        // }, [id]);
        //
        /******************* use effects ************************/

        useEffect(
            () =>
                debounceFuncs(() => {
                    callbackLoadApp(appsById);
                    // callbackLoadAppReviews();
                }),
            [id],
        );

        useEffect(
            () =>
                debounceFuncs(() => {
                    callbackLoadRateFeatures();
                }),
            [id, user?.role],
        );

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withAppLoad;
