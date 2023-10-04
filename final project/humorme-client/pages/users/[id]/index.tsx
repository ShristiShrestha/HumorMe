import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { isString } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../../redux/auth/actions";
import { selectAuth } from "../../../redux/auth/reducer";
import styled from "styled-components";
import Image from "next/image";
import {
    ResText14Regular,
    ResText16Regular,
    ResText18Regular,
    ResText18SemiBold,
} from "../../../utils/TextUtils";
import { toMonthDateYearStr } from "../../../utils/DateUtils";
import { Button, Divider } from "antd";
import MyButton, { MyButtonType } from "../../../components/MyButton";

const Wrapper = styled.div`
    height: calc(100vh - 110px);
    position: relative;
    overflow-y: auto;
    row-gap: 16px;
    padding-bottom: 24px;

    .user-profile {
        row-gap: 12px;
        margin-top: 24px;
    }

    .user-follow {
        column-gap: 12px;
        row-gap: 12px;
    }

    .user-jokes {
    }
`;

export default function UserProfile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const { viewUser, user } = useSelector(selectAuth);

    const loggedUserFollowViewUser = useMemo(() => {
        const filtered = viewUser?.followers?.filter(
            item => item.id === user?.id,
        );
        if (filtered) return filtered[0];
        return undefined;
    }, [id, user?.id]);

    /******************* use effects ************************/

    useEffect(() => {
        if (isString(id)) {
            // @ts-ignore
            dispatch(fetchUser(id));
        }
    }, [id]);

    /******************* handlers ************************/

    return (
        <Wrapper>
            <div className={"centered-flex user-profile"}>
                <Image
                    src={"/default_user.png"}
                    alt={"default user"}
                    width={100}
                    height={100}
                />
                <ResText18SemiBold className={"text-grey2"}>
                    {viewUser?.name}
                </ResText18SemiBold>
                <ResText16Regular className={"text-grey3"}>
                    Joined in{" "}
                    {viewUser &&
                        toMonthDateYearStr(new Date(viewUser?.createdAt))}
                </ResText16Regular>
                <ResText16Regular>
                    {viewUser?.followers?.length || 0} followers
                    <Divider type={"vertical"} />
                    {viewUser?.following?.length || 0} followings
                </ResText16Regular>
                <div className={"h-start-flex user-follow"}>
                    <ResText16Regular className={"text-grey2"}>
                        You {loggedUserFollowViewUser ? "" : "don't"} follow
                        this person
                    </ResText16Regular>
                    <Button type={"primary"} onClick={() => {}}>
                        <ResText14Regular>
                            {loggedUserFollowViewUser ? "unfollow" : "follow"}
                        </ResText14Regular>
                    </Button>
                </div>
            </div>
            <div className={"vertical-start-flex"}></div>
        </Wrapper>
    );
}
