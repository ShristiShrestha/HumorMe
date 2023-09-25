// @flow
import * as React from "react";
import { ReactElement, useEffect, useState } from "react";
import NProgress from "nprogress";
// import { useRouter } from "next/router";
import MyLoading from "./MyLoading";

/* props definition */
type StateType = {
    loading: boolean;
    success: boolean;
    error: boolean;
};

type Props = { children: ReactElement };

export default function MyNpLoading(props: Props) {
    const { children } = props;
    const [status, setStatus] = useState<StateType>({
        loading: true,
        success: false,
        error: false,
    });

    /* use effects */
    useEffect(() => {
        const stopLoading = callback => {
            setTimeout(function () {
                callback();
            }, 0);
        };

        const routeChangeStart = () => {
            setStatus({ loading: true, success: false, error: false });
            NProgress.start();
        };
        const routeChangeComplete = () => {
            stopLoading(() => {
                setStatus({ loading: false, success: true, error: false });
                NProgress.done();
            });
        };
        const routeChangeError = () => {
            stopLoading(() => {
                setStatus({ loading: false, success: false, error: true });
                NProgress.done();
            });
        };

        if (document.readyState === "complete") {
            routeChangeComplete();
        } else {
            window.addEventListener("load", routeChangeComplete);
            return () =>
                document.removeEventListener("load", routeChangeComplete);
        }

        // router.events.on("routeChangeStart", routeChangeStart);
        // router.events.on("routeChangeComplete", routeChangeComplete);
        // router.events.on("routeChangeError", routeChangeError);
        //
        // return () => {
        //     router.events.off("routeChangeStart", routeChangeStart);
        //     router.events.off("routeChangeComplete", routeChangeComplete);
        //     router.events.off("routeChangeError", routeChangeError);
        // };
    }, []);

    if (status.loading) return <MyLoading />;

    return children;
}
