import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect } from "react";
import { debounceFuncs } from "../utils/LodashUtils";
import { selectAuth } from "../redux/auth/reducer";
import { useRouter } from "next/router";
import _ from "lodash";
import { postUserAssignToGroup } from "../axios/UsersApi";
import { setAuth } from "../redux/auth/actions";

const withUserAuthenticated = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();
        const router = useRouter();
        const { user } = useSelector(selectAuth);

        /******************* memoized callbacks ************************/

        const assignUserWithRole = useCallback(() => {
            let authJwtInLocalStorage = localStorage.getItem("authorization");
            const roleIdInUrl = _.get(router, "query.role_id", "");

            let forceFetchUser = false;

            // use roleId from URL to override the existing auth token
            if (roleIdInUrl && authJwtInLocalStorage) {
                localStorage.removeItem("authorization");
                authJwtInLocalStorage = "";
                forceFetchUser = true;
            }

            // if user already logged in and has roleId in URL
            // simply remote the roleId from the URL
            if (user?.id && roleIdInUrl && !forceFetchUser) {
                // console.log("found user but specified role in url");
                return debounceFuncs(() =>
                    router.replace("/", undefined, { shallow: true }),
                );
            }

            // if user is neither loggedIn nor, there is auth token in LS
            if (!user?.id || !authJwtInLocalStorage) {
                //  prevent from calling API unless we share the role_id keyHash to the participants
                if (roleIdInUrl && roleIdInUrl?.length > 0) {
                    const reqData = {
                        role_id: roleIdInUrl,
                    };
                    postUserAssignToGroup(reqData)
                        .then(res => {
                            const nonPassUser: any = res;
                            if (Object.keys(nonPassUser).includes("password"))
                                delete nonPassUser["password"];

                            router
                                .replace("/", undefined, { shallow: true })
                                .then(res => {
                                    // @ts-ignore
                                    dispatch(setAuth(nonPassUser));
                                });
                        })
                        .catch(err => {
                            let errorMessage =
                                "Failed to sign up. Please try with correct passcode.";
                            console.error("sign up error: ", err);
                            const status = _.get(
                                err,
                                "response.status",
                                undefined,
                            );
                            if (status === 403) {
                                errorMessage =
                                    "Please enter a valid email address.";
                            }
                            if (status === 404) {
                                errorMessage =
                                    "We do not have any slot available. Please contact support for more info.";
                            }
                            // notification.error({
                            //     message: errorMessage,
                            //     placement: "topRight",
                            // });
                        });
                }
            }
        }, [user?.id]);

        /******************* use effects ************************/

        useEffect(() => debounceFuncs(() => assignUserWithRole()), []);

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withUserAuthenticated;
