import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect } from "react";
import { debounceFuncs } from "../utils/LodashUtils";
import { selectAuth } from "../redux/auth/reducer";
import { checkLogin } from "../axios/UsersApi";
import { setAuth } from "../redux/auth/actions";

const withUserAuthenticated = WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return props => {
        const dispatch = useDispatch();
        const { user } = useSelector(selectAuth);

        /******************* memoized callbacks ************************/

        const checkAuthLogin = useCallback(() => {
            checkLogin()
                .then(res => {
                    if (res?.id) {
                        // @ts-ignore
                        dispatch(setAuth(res));
                    }
                })
                .catch(err => {});
        }, []);

        /******************* use effects ************************/

        useEffect(() => debounceFuncs(() => checkAuthLogin()), []);

        /******************* render ************************/

        return <WrappedComponent dispatch={dispatch} {...props} />;
    };
};

export default withUserAuthenticated;
