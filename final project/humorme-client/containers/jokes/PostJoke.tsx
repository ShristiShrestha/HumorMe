import React, { useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { postJoke } from "../../axios/JokesApi";
import { useDispatch } from "react-redux";
import { fetchApps } from "../../redux/apps/actions";
import { ResText18Regular } from "../../utils/TextUtils";
import styled from "styled-components";
import _ from "lodash";
import { openNotification } from "../../utils/NotificationUtils";
import { NotificationEnum } from "../../models/enum/NotificationEnum";

const defaultJoke = {
    title: "",
    text: "",
    labels: [],
};

const ModalWrapper = styled.div`
    row-gap: 24px;
`;

const { TextArea } = Input;
export default function PostJoke() {
    const dispatch = useDispatch();
    const [openModal, setModal] = useState(false);

    /******************* handlers ************************/
    const submitJoke = data => {
        const request = { ...data };
        request["labels"] = (data["labels"] || []).join(",");
        postJoke(request)
            .then(res => {
                // @ts-ignore
                dispatch(fetchApps());
                setModal(false);
            })
            .catch(e => {
                const errorMessage = _.get(
                    e,
                    "response.data",
                    "Failed to post your joke",
                );
                return openNotification(
                    "Error",
                    errorMessage,
                    NotificationEnum.ERROR,
                );
            });
    };

    return (
        <>
            <div className={"h-justified-flex"}>
                <ResText18Regular>Got anything funny?</ResText18Regular>
                <Button type={"primary"} onClick={() => setModal(true)}>
                    Post
                </Button>
            </div>
            <Modal
                // className={"vertical-start-flex"}
                open={openModal}
                onCancel={() => setModal(false)}
                footer={null}
            >
                <ModalWrapper className={"vertical-start-flex"}>
                    <ResText18Regular>Post a joke</ResText18Regular>
                    <Form
                        layout={"vertical"}
                        initialValues={defaultJoke}
                        onFinish={submitJoke}
                        style={{ width: "100%" }}
                    >
                        {/*<Form.Item*/}
                        {/*    label={"Title"}*/}
                        {/*    name="title"*/}
                        {/*    rules={[*/}
                        {/*        {*/}
                        {/*            required: true,*/}
                        {/*            message: "Please give a short title",*/}
                        {/*        },*/}
                        {/*    ]}*/}
                        {/*>*/}
                        {/*    <Input placeholder="Short title" />*/}
                        {/*</Form.Item>*/}
                        <Form.Item
                            label="Tell us more"
                            name="text"
                            rules={[
                                {
                                    required: true,
                                    message: "You've gotta explain a bit!",
                                },
                            ]}
                        >
                            <TextArea
                                placeholder="Maximum of 250 characters"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                        <Form.Item
                            // label={"Labels"}
                            name="labels"
                        >
                            <Select
                                mode="tags"
                                placeholder="type and press enter e.g. #authors"
                            />
                        </Form.Item>
                        <Form.Item className={"h-end-flex"}>
                            <Button htmlType={"submit"} type="primary">
                                Post
                            </Button>
                        </Form.Item>
                    </Form>
                </ModalWrapper>
            </Modal>
        </>
    );
}
