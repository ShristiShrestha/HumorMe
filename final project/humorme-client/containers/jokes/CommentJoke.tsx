import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/auth/reducer";
import { ResText14Regular } from "../../utils/TextUtils";
import MyButton, { MyButtonType } from "../../components/MyButton";
import { Modal } from "antd";
import { selectApps } from "../../redux/apps/reducer";

export default function CommentJoke({ joke }) {
    const { loggedIn } = useSelector(selectAuth);
    const { appReviews } = useSelector(selectApps);

    const { id, title, text } = joke;
    const [openModal, setModal] = useState({
        open: false,
        text: "",
    });

    return (
        <>
            <MyButton
                text={"view comments"}
                btnType={MyButtonType.secondary}
                onClick={() => setModal({ ...openModal, open: true })}
            />

            <Modal
                open={openModal.open}
                onCancel={() => setModal({ ...openModal, open: false })}
                footer={null}
            >
                <ResText14Regular>Comments</ResText14Regular>
                {appReviews?.map(comment => (
                    <ResText14Regular key={"joke-" + id + comment.id}>
                        {comment.text}
                    </ResText14Regular>
                ))}
            </Modal>
        </>
    );
}
