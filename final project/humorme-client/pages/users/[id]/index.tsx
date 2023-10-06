import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { isString } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, setAuth, setUser } from "../../../redux/auth/actions";
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
import { Button, Divider, Form, Input, Modal } from "antd";
import MyButton, { MyButtonType } from "../../../components/MyButton";
import { followUser, patchUser } from "../../../axios/UsersApi";
import JokesList from "../../../containers/jokes/JokesList";
import { UIUserDetails } from "../../../models/dto/UIUserDetails";
import { openNotification } from "../../../utils/NotificationUtils";
import { NotificationEnum } from "../../../models/enum/NotificationEnum";
import { UserOutlined } from "@ant-design/icons";
import { BackIconWithText } from "../../jokes/[id]";

const { TextArea } = Input;

const Wrapper = styled.div`
    height: calc(100vh - 110px);
    position: relative;
    overflow-y: auto;
    padding-bottom: 24px;
    row-gap: 32px;

    .user-profile {
        row-gap: 16px;
        margin-top: 24px;
    }

    .user-follow {
        column-gap: 12px;
        row-gap: 12px;
    }

    .user-jokes {
        margin-top: 24px;
        row-gap: 24px;
    }
`;

const ModalWrapper = styled.div`
    row-gap: 16px;
`;

export default function UserProfile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;
    const [updateOpen, setUpdateOpen] = useState(false);

    const { viewUser, user, loggedIn } = useSelector(selectAuth);

    /******************* memos ************************/

    const loggedUserFollowViewUser = useMemo(() => {
        const filtered = viewUser?.followers?.filter(
            item => item.id === user?.id,
        );
        if (filtered) return filtered[0];
        return undefined;
    }, [id, user?.id, user?.followers?.length, viewUser?.followers?.length]);

    /******************* use effects ************************/

    useEffect(() => {
        if (isString(id)) {
            // @ts-ignore
            dispatch(fetchUser(id));
        }
    }, [id]);

    // useEffect(() => {
    //     const params = {
    //         userId: viewUser?.id,
    //     };
    //     // @ts-ignore
    //     dispatch(fetchApps(params, true));
    // }, [viewUser?.id]);

    /******************* handlers ************************/

    const handleFollow = follow => {
        if (viewUser?.id) {
            followUser(viewUser?.id, follow)
                .then((updatedLoggedUser: UIUserDetails) => {
                    // @ts-ignore
                    dispatch(setAuth(updatedLoggedUser));
                    // @ts-ignore
                    dispatch(fetchUser(id));
                })
                .catch(err => {
                    openNotification(
                        "Request failed",
                        "",
                        NotificationEnum.ERROR,
                    );
                });
        }
    };

    const handleProfileUpdate = data => {
        patchUser(data)
            .then(res => {
                // @ts-ignore
                dispatch(setAuth(res));

                if (viewUser?.id === user?.id) {
                    // @ts-ignore
                    dispatch(setUser(res));
                }
                setUpdateOpen(false);
            })
            .catch(err => {});
    };

    return (
        <>
            <Wrapper className={"vertical-start-flex"}>
                {BackIconWithText("/", "home")}
                {/* view user profile */}
                <div className={"centered-flex user-profile"}>
                    <Image
                        src={"/default_user.png"}
                        alt={"default user"}
                        width={100}
                        height={100}
                    />
                    <ResText18SemiBold className={"text-grey2"}>
                        <UserOutlined style={{ marginRight: 8 }} />
                        {viewUser?.name}
                    </ResText18SemiBold>
                    {viewUser?.bio && viewUser?.bio?.length > 0 && (
                        <ResText16Regular className={"text-grey2"}>
                            {viewUser?.bio}
                        </ResText16Regular>
                    )}
                    <ResText16Regular className={"text-grey3"}>
                        Joined in{" "}
                        {viewUser &&
                            toMonthDateYearStr(new Date(viewUser?.createdAt))}
                    </ResText16Regular>
                    <ResText16Regular>
                        {viewUser?.followers?.length || 0} followers
                        <Divider type={"vertical"} />
                        {viewUser?.followings?.length || 0} followings
                    </ResText16Regular>
                    {user?.id && viewUser?.id !== user?.id && (
                        <div className={"h-start-flex user-follow"}>
                            <ResText16Regular className={"text-grey2"}>
                                You {loggedUserFollowViewUser ? "" : "don't"}{" "}
                                follow this person
                            </ResText16Regular>
                            <Button
                                type={
                                    loggedUserFollowViewUser
                                        ? "text"
                                        : "primary"
                                }
                                onClick={() =>
                                    handleFollow(!loggedUserFollowViewUser)
                                }
                            >
                                <ResText14Regular>
                                    {!!user?.id &&
                                    loggedIn &&
                                    loggedUserFollowViewUser
                                        ? "unfollow"
                                        : "follow"}
                                </ResText14Regular>
                            </Button>
                        </div>
                    )}
                    {viewUser?.id == user?.id && (
                        <MyButton
                            text={"Edit profile"}
                            btnType={MyButtonType.secondary}
                            onClick={() => setUpdateOpen(true)}
                        />
                    )}
                </div>

                {/* view user jokes */}
                <div className={"vertical-start-flex user-jokes"}>
                    <ResText18Regular className={"text-grey2"}>
                        {viewUser?.name + "'s jokes"}
                    </ResText18Regular>
                    <JokesList showSearch={false} />
                </div>
            </Wrapper>
            <Modal
                open={updateOpen}
                onCancel={() => setUpdateOpen(false)}
                footer={null}
            >
                <ModalWrapper className={"vertical-start-flex"}>
                    <ResText16Regular className={"text-grey3"}>
                        Edit your profile
                    </ResText16Regular>
                    <Form
                        layout={"vertical"}
                        initialValues={{
                            name: user?.name,
                            bio: user?.bio,
                        }}
                        onFinish={handleProfileUpdate}
                        style={{ width: "100%" }}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "There is no such thing as nameless person!",
                                },
                            ]}
                        >
                            <Input placeholder="Your name" />
                        </Form.Item>

                        <Form.Item
                            label="Bio"
                            name="bio"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <TextArea rows={5} placeholder="Your bio" />
                        </Form.Item>
                        <Form.Item className={"h-end-flex"}>
                            <Button htmlType={"submit"} type="primary">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </ModalWrapper>
            </Modal>
        </>
    );
}
