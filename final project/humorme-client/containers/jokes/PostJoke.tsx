import React, { useState } from "react";
import MyButton, { MyButtonType } from "../../components/MyButton";
import { Button, Form, Input, Modal, notification, Select } from "antd";
import { postJoke } from "../../axios/JokesApi";
import { useDispatch } from "react-redux";
import { fetchApps } from "../../redux/apps/actions";

const defaultJoke = {
    title: "",
    text: "",
    labels: [],
};

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
            .catch(e =>
                notification.error({
                    placement: "topRight",
                    message: "failed to submit your joke.",
                }),
            );
    };

    return (
        <>
            <MyButton
                text={"Post"}
                btnType={MyButtonType.primary}
                onClick={() => setModal(true)}
            />
            <Modal
                open={openModal}
                onCancel={() => setModal(false)}
                footer={null}
            >
                <Form
                    layout={"vertical"}
                    initialValues={defaultJoke}
                    onFinish={submitJoke}
                >
                    <Form.Item
                        label={"Title"}
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Please give a short title",
                            },
                        ]}
                    >
                        <Input placeholder="Short title" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
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
                    <Form.Item label={"Labels"} name="labels">
                        <Select
                            mode="tags"
                            placeholder="write and enter labels e.g. #authors"
                        />
                    </Form.Item>
                    <Form.Item className={"h-end-flex"}>
                        <Button htmlType={"submit"} type="primary">
                            Post
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
