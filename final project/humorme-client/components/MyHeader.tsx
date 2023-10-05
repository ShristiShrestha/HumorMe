import React, { useCallback, useEffect, useState } from "react";
import { ResText18SemiBold } from "../utils/TextUtils";
import styled from "styled-components";
import { grey5 } from "../utils/ShadesUtils";
import { selectAuth } from "../redux/auth/reducer";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { setAuth } from "../redux/auth/actions";
import { verifyJwt } from "../utils/JwtUtils";
import LoginView from "../containers/login/LoginView";

const Wrapper = styled.div`
    align-items: center;
    margin: auto;
    row-gap: 8px;
    column-gap: 12px;

    .header-options {
        column-gap: 6px;
        row-gap: 6px;
    }

    .ant-input {
        width: 250px;
        font-size: 0.75rem;
        font-style: normal;
        border: 1px solid ${grey5};
    }

    .user-ant-input {
        width: fit-content;
        column-gap: 12px;
    }

    .user-dropdown-btn {
        column-gap: 10px;
        align-items: center;

        :hover {
            background: white;
            border-radius: 12px;
        }
    }
`;

export function MyHeader() {
    const dispatch = useDispatch();
    const [localAuthJwt, setLocalAuthJwt] = useState<string | undefined>(
        undefined,
    );

    /******************* memoized callbacks ************************/

    const updateUserCallback = useCallback(() => {
        if (
            localAuthJwt !== null &&
            localAuthJwt !== undefined &&
            localAuthJwt.length > 0
        ) {
            try {
                const jwtUser = verifyJwt(localAuthJwt);

                if (jwtUser) {
                    // @ts-ignore
                    dispatch(setAuth(jwtUser));
                } else localStorage.clear();
            } catch (e) {
                console.log("error on jwt user verify: ", e);
            }
        }
    }, [localAuthJwt]);

    /******************* use effect ************************/

    useEffect(() => {
        const localStorageAuthJwt = localStorage.getItem("authorization");
        if (localStorageAuthJwt !== null && localStorageAuthJwt.length > 0) {
            const jwtWithoutBearer = localStorageAuthJwt
                .replace("bearer ", "")
                .trim();
            setLocalAuthJwt(jwtWithoutBearer);
        }
    }, []);
    //
    // useEffect(() => {
    //     if (localAuthJwt !== null && !loggedIn && !user) {
    //         updateUserCallback();
    //     }
    // }, [localAuthJwt]);

    return (
        <Wrapper className={"h-justified-flex custom-layout"}>
            <Link href={"/"}>
                <ResText18SemiBold className={"text-grey1 pointer-cursor"}>
                    HumorMe!
                </ResText18SemiBold>
            </Link>
            <LoginView />
        </Wrapper>
    );
}
