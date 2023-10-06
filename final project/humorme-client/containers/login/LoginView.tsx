import React, { useState } from "react";
import styled from "styled-components";
import {
    Button,
    Form,
    Input,
    Modal,
    notification,
    Tabs,
    TabsProps,
} from "antd";
import MyButton, { MyButtonType } from "../../components/MyButton";
import { ResText16Regular, ResText20SemiBold } from "../../utils/TextUtils";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "../../axios/UsersApi";
import { setAuth } from "../../redux/auth/actions";
import { selectAuth } from "../../redux/auth/reducer";
import _ from "lodash";
import { UserOutlined } from "@ant-design/icons";
import { openNotification } from "../../utils/NotificationUtils";
import { NotificationEnum } from "../../models/enum/NotificationEnum";
import Link from "next/link";

const Wrapper = styled.div`
    column-gap: 12px;

    .auth-options {
        row-gap: 12px;
        column-gap: 12px;
    }
`;

const ModelWrapper = styled.div`
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

const authParams = {
    name: "",
    email: "",
    password: "",
};

export default function LoginView() {
    const dispatch = useDispatch();

    const [openModal, setOpenModal] = useState({
        open: false,
        defaultTab: "1",
    });
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const { loggedIn, user } = useSelector(selectAuth);

    /******************* event handler ************************/

    const handleLogin = authParams => {
        login(authParams)
            .then(res => {
                if (res) {
                    // @ts-ignore
                    // dispatch(setAuth(authParams)); // make server API return user info
                }
                // @ts-ignore
                dispatch(setAuth(authParams)); // todo: remove here
                handleModal(false);
            })
            .catch(err => {
                const errorMessage = _.get(
                    err,
                    "response.data",
                    "Failed to sign in. Please try again.",
                );
                return openNotification(
                    "Error",
                    errorMessage,
                    NotificationEnum.ERROR,
                );
            });
    };

    const handleSignup = authParams => {
        if (authParams && Object.keys(authParams).length < 1)
            return notification.warning({
                message: "Please enter email to send you a passcode.",
                placement: "topRight",
            });

        signup(authParams)
            .then(res => {
                openNotification(
                    "Sign up success!",
                    "You have successfully signed up. Sign in to post your own jokes.",
                    NotificationEnum.SUCCESS,
                );
            })
            .catch(err => {
                let errorMessage =
                    "Failed to sign up. Please try with correct passcode.";
                let serverErrorMessage = _.get(
                    err,
                    "response.data",
                    errorMessage,
                );
                return openNotification(
                    "Error",
                    serverErrorMessage,
                    NotificationEnum.ERROR,
                );
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

    /******************* handlers ************************/
    const handleModal = (open, tabKey = "1") => {
        setOpenModal({ ...openModal, open: open, defaultTab: tabKey });
    };

    /******************* render ************************/

    const renderSignInForm = (
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            style={{ width: "100%" }}
            initialValues={authParams}
            onFinish={handleLogin}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        type: "email",
                        required: true,
                        message: "Please input your email!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input your password!",
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} className={"h-end-flex"}>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                >
                    Sign in
                </Button>
            </Form.Item>
        </Form>
    );

    const renderSignUpForm = (
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            style={{ width: "100%" }}
            initialValues={authParams}
            onFinish={handleSignup}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Please input your username!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        type: "email",
                        required: true,
                        message: "Please input your email!",
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input your password!",
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} className={"h-end-flex"}>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                >
                    Sign up
                </Button>
            </Form.Item>
        </Form>
    );

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: `Sign in`,
            children: renderSignInForm,
        },
        {
            key: "2",
            label: `Sign up`,
            children: renderSignUpForm,
        },
    ];

    // @ts-ignore
    return (
        <Wrapper className={"h-start-flex"}>
            {loggedIn && user?.id && (
                <Link href={`/users/${user?.id}`}>
                    <ResText16Regular className={"text-grey2"}>
                        {" "}
                        <UserOutlined style={{ marginRight: 6 }} />
                        {user?.name}
                    </ResText16Regular>
                </Link>
            )}
            {loggedIn ? (
                <MyButton
                    text={"Sign out"}
                    showLoading={true}
                    onClick={() => setOpenLogoutModal(true)}
                    btnType={MyButtonType.secondary}
                />
            ) : (
                <div className={"h-start-flex auth-options"}>
                    <MyButton
                        text={"My Account"}
                        showLoading={true}
                        onClick={() => handleModal(true, "2")}
                        btnType={MyButtonType.secondary}
                    />
                    {/*<MyButton*/}
                    {/*    text={"Sign in"}*/}
                    {/*    showLoading={true}*/}
                    {/*    onClick={() => handleModal(true, "1")}*/}
                    {/*    btnType={MyButtonType.primary}*/}
                    {/*/>*/}
                </div>
            )}
            <Modal
                open={openModal.open}
                footer={null}
                onCancel={() => handleModal(false)}
            >
                <ModelWrapper>
                    <Tabs
                        defaultActiveKey={openModal.defaultTab}
                        items={items}
                    />
                </ModelWrapper>
            </Modal>
            <Modal
                open={openLogoutModal}
                footer={null}
                onCancel={() => setOpenLogoutModal(false)}
            >
                <ModelWrapper className={"vertical-start-flex"}>
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
                </ModelWrapper>
            </Modal>
        </Wrapper>
    );
}
