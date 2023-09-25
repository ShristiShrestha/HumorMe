import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, Modal, notification, Tabs, TabsProps, Tag } from "antd";
import MyButton, { MyButtonType } from "../../components/MyButton";
import {
    ResText12Regular,
    ResText14Regular,
    ResText16Regular,
    ResText20SemiBold,
} from "../../utils/TextUtils";
import { useDispatch, useSelector } from "react-redux";
import { postUserAssignToGroup, postUserSignIn } from "../../axios/UsersApi";
import { setAuth } from "../../redux/auth/actions";
import { selectAuth } from "../../redux/auth/reducer";
import {
    CopyOutlined,
    InfoCircleOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import copy from "copy-to-clipboard";
import _ from "lodash";
import { storeBlue } from "../../utils/ShadesUtils";

const Wrapper = styled.div`
    width: 100%;
    row-gap: 24px;

    .modal-header {
        width: 100%;
        row-gap: 8px;
    }

    .modal-content {
        row-gap: 8px;
        width: 100%;
    }

    .modal-footer {
        width: 100%;
    }
`;

const TabContent = styled.div`
    width: 100%;
    row-gap: 24px;

    .ant-tag {
        padding: 2px 6px;
        cursor: pointer;
    }

    .save-icon {
        padding: 4px;
    }

    .copy-icon {
        color: white;
        padding: 4px;
        border-radius: 4px;
    }
`;

export default function LoginView() {
    const dispatch = useDispatch();
    const [pass, setPass] = useState("");
    const [sendEmailTo, setSendEmailTo] = useState<undefined | string>(
        undefined,
    );
    const [openModal, setOpenModal] = useState(false);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [assignedUser, setAssignedUser] = useState("");
    const { loggedIn } = useSelector(selectAuth);

    /******************* use effects ************************/

    useEffect(() => {
        const savedPasscode = localStorage.getItem("passcode");
        if (savedPasscode !== null && savedPasscode.length > 0) {
            setAssignedUser(savedPasscode);
            setPass(savedPasscode);
        }
    }, []);

    /******************* event handler ************************/

    const handleLogin = () => {
        if (pass.length < 1)
            return notification.warning({
                message: "Please enter passkey for login.",
                placement: "topRight",
            });
        postUserSignIn({ password: pass })
            .then(res => {
                if (res) {
                    // @ts-ignore
                    dispatch(setAuth(res));
                    setOpenModal(false);
                }
            })
            .catch(err => {
                console.error("sign in error: ", err);
                notification.error({
                    message:
                        "Failed to sign in. Please try with correct passcode.",
                    placement: "topRight",
                });
            });
    };

    const handleSignup = () => {
        if (sendEmailTo && sendEmailTo.length < 1)
            return notification.warning({
                message: "Please enter email to send you a passcode.",
                placement: "topRight",
            });
        const reqData = {
            sendEmailTo: sendEmailTo,
        };
        postUserAssignToGroup(reqData)
            .then(res => {
                // @ts-ignore
                setAssignedUser(res?.password || "No password");
                const nonPassUser: any = res;
                if (Object.keys(nonPassUser).includes("password"))
                    delete nonPassUser["password"];
                // @ts-ignore
                dispatch(setAuth(nonPassUser));
            })
            .catch(err => {
                let errorMessage =
                    "Failed to sign up. Please try with correct passcode.";
                console.error("sign up error: ", err);
                const status = _.get(err, "response.status", undefined);
                if (status === 403) {
                    errorMessage = "Please enter a valid email address.";
                }
                if (status === 404) {
                    errorMessage =
                        "We do not have any slot available. Please contact support for more info.";
                }
                notification.error({
                    message: errorMessage,
                    placement: "topRight",
                });
            });
    };

    const handleLogout = async () => {
        const localAuthJwt = await localStorage.getItem("authorization");
        if (localAuthJwt !== null && localAuthJwt.length > 0) {
            await localStorage.removeItem("authorization");
        }
        // @ts-ignore
        dispatch(setAuth(undefined));
        setOpenLogoutModal(false);
        notification.success({
            message: "Logout complete.",
            placement: "topRight",
        });
    };

    const handleSaveInStorage = () => {
        localStorage.setItem("passcode", assignedUser);
    };

    /******************* render ************************/

    const getLoginContent = () => {
        if (loggedIn)
            return (
                <TabContent>
                    <div className={"modal-header vertical-start-flex"}>
                        <ResText20SemiBold className={"text-grey2"}>
                            Already signed in!
                        </ResText20SemiBold>
                        <ResText16Regular className={"text-grey2"}>
                            You can close this and continue exploring the
                            appstore.
                        </ResText16Regular>
                    </div>
                </TabContent>
            );

        return (
            <TabContent className={"vertical-start-flex"}>
                <div className={"modal-header vertical-start-flex"}>
                    <ResText20SemiBold className={"text-grey2"}>
                        Sign in
                    </ResText20SemiBold>
                    <ResText16Regular className={"text-grey2"}>
                        Please enter the passcode we provided to you during Sign
                        up.
                    </ResText16Regular>
                </div>

                <div className={"modal-content vertical-start-flex"}>
                    <ResText16Regular className={"text-grey3"}>
                        Enter passcode
                    </ResText16Regular>
                    <Input
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        placeholder={"Enter 7 digit password."}
                    />
                    {pass.length > 0 && assignedUser.length > 0 && (
                        <ResText12Regular className={"text-grey3"}>
                            We found a previously saved passcode from the
                            browser.
                        </ResText12Regular>
                    )}
                </div>

                <div className={"modal-footer h-end-flex"}>
                    <MyButton
                        text={"Sign in"}
                        showLoading={true}
                        btnType={MyButtonType.primary}
                        onClick={() => handleLogin()}
                    />
                </div>
            </TabContent>
        );
    };

    const getSignupContent = () => {
        return (
            <TabContent className={"vertical-start-flex"}>
                <div className={"modal-header vertical-start-flex"}>
                    <ResText20SemiBold className={"text-grey2"}>
                        {assignedUser.length > 0
                            ? `We've assigned a user account.`
                            : `Sign up`}
                    </ResText20SemiBold>
                    <ResText16Regular className={"text-grey2 wrap-word"}>
                        {assignedUser.length > 0
                            ? `Copy and save this passcode in a safe place. Use this passcode for sign in.`
                            : `We will create a user account for you. Please provide us
                        an email to send you a sign in passcode.`}
                    </ResText16Regular>
                </div>

                <div className={"modal-content vertical-start-flex"}>
                    {assignedUser.length > 0 ? (
                        <>
                            <ResText16Regular>
                                Passcode: <b>{assignedUser}</b>
                            </ResText16Regular>

                            {assignedUser?.length >= 0 && (
                                <Tag
                                    color={storeBlue}
                                    onClick={() => {
                                        copy(assignedUser);
                                        notification.info({
                                            message: "Passcode copied!",
                                            placement: "topRight",
                                        });
                                    }}
                                >
                                    <ResText14Regular className={"text-white"}>
                                        Copy
                                        <CopyOutlined className={"copy-icon"} />
                                    </ResText14Regular>
                                </Tag>
                            )}

                            {assignedUser?.length >= 0 && (
                                <Tag
                                    style={{
                                        color: storeBlue,
                                        background: "white",
                                        borderRadius: 4,
                                        border: `1px solid ${storeBlue}`,
                                    }}
                                    onClick={() => {
                                        try {
                                            handleSaveInStorage();
                                            notification.info({
                                                message:
                                                    "Passcode saved in browser!",
                                                placement: "topRight",
                                            });
                                        } catch (err) {
                                            notification.error({
                                                message:
                                                    "Unable to save in browser!",
                                                placement: "topRight",
                                            });
                                        }
                                    }}
                                >
                                    <ResText14Regular
                                        className={"text-store-blue"}
                                    >
                                        Save in browser
                                        <SaveOutlined
                                            className={
                                                "text-store-blue save-icon"
                                            }
                                        />
                                    </ResText14Regular>
                                </Tag>
                            )}
                        </>
                    ) : (
                        <>
                            <ResText16Regular className={"text-grey3"}>
                                Enter your email address{" "}
                                <ResText14Regular>(Optional)</ResText14Regular>
                            </ResText16Regular>
                            <Input
                                value={sendEmailTo}
                                onChange={e => setSendEmailTo(e.target.value)}
                                placeholder={"email@example.com"}
                            />

                            <ResText14Regular
                                className={"text-grey3 text-italic"}
                            >
                                <InfoCircleOutlined
                                    style={{ marginRight: 4, color: "orange" }}
                                />{" "}
                                We neither store nor track your activities using
                                your email address.
                            </ResText14Regular>
                        </>
                    )}
                </div>

                {assignedUser.length < 1 && (
                    <div className={"modal-footer h-end-flex"}>
                        <MyButton
                            text={"Sign up"}
                            showLoading={true}
                            btnType={MyButtonType.primary}
                            onClick={() => handleSignup()}
                        />
                    </div>
                )}
            </TabContent>
        );
    };

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: `Sign in`,
            children: getLoginContent(),
        },
        {
            key: "2",
            label: `Sign up`,
            children: getSignupContent(),
        },
    ];

    // @ts-ignore
    return (
        <>
            {!loggedIn ? (
                <MyButton
                    text={"Sign in"}
                    showLoading={true}
                    onClick={() => setOpenModal(true)}
                    btnType={MyButtonType.primary}
                />
            ) : (
                <MyButton
                    text={"Sign out"}
                    showLoading={true}
                    onClick={() => setOpenLogoutModal(true)}
                    btnType={MyButtonType.secondary}
                />
            )}
            <Modal
                open={openModal}
                footer={null}
                onCancel={() => setOpenModal(false)}
            >
                <Wrapper>
                    <Tabs defaultActiveKey="1" items={items} />
                </Wrapper>
            </Modal>
            <Modal
                open={openLogoutModal}
                footer={null}
                onCancel={() => setOpenLogoutModal(false)}
            >
                <Wrapper className={"vertical-start-flex"}>
                    <ResText20SemiBold>Log out</ResText20SemiBold>
                    <ResText16Regular>
                        Are you sure you want to sign out?
                    </ResText16Regular>

                    <div className={"modal-footer h-end-flex"}>
                        <MyButton
                            text={"Sign out"}
                            showLoading={true}
                            btnType={MyButtonType.primary}
                            onClick={() => handleLogout()}
                        />
                    </div>
                </Wrapper>
            </Modal>
        </>
    );
}
