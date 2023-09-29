import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../redux/apps/reducer";
import React from "react";
import { useRouter } from "next/router";
import { selectAuth } from "../redux/auth/reducer";

const withAppLoad = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();
        const router = useRouter();
        const { id } = router.query;
        const { user } = useSelector(selectAuth);
        const { appsById, app, appRateFeatures } = useSelector(selectApps);

        /******************* memoized callbacks ************************/

        // const callbackLoadApp = useCallback(
        //     (paramsApps: { [id: string]: UIAppDetail }) => {
        //         if (id !== app?.appId) {
        //             const filteredApps: UIAppDetail[] = Object.values(
        //                 paramsApps,
        //             ).filter((item: any) => item.appId === id);
        //             if (filteredApps.length > 0) {
        //                 const filteredApp: UIAppDetail = filteredApps[0];
        //                 filteredApp?.appId === id &&
        //                     // @ts-ignore
        //                     dispatch(setApp(filteredApp));
        //             } else {
        //                 //@ts-ignore
        //                 getApps(id).then(
        //                     resApp =>
        //                         resApp?.appId === id && // @ts-ignore
        //                         dispatch(setApp(toUIAppDetail(resApp))),
        //                 );
        //             }
        //         }
        //     },
        //     [id],
        // );

        // const callbackLoadAppReviews = useCallback(() => {
        //     if (id && id?.toString()?.length > 0) {
        //         // @ts-ignore
        //         dispatch(fetchAppReviews(id.toString()));
        //     }
        // }, [id]);
        //
        /******************* use effects ************************/
        //
        // useEffect(
        //     () =>
        //         debounceFuncs(() => {
        //             callbackLoadApp(appsById);
        //             // callbackLoadAppReviews();
        //         }),
        //     [id],
        // );

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withAppLoad;
