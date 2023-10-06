import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../redux/auth/reducer";
import { selectApps } from "../../redux/apps/reducer";
import { useRouter } from "next/router";
import CommentCard from "../../components/CommentCard";
import { Button, Form, Input } from "antd";
import styled from "styled-components";
import { postJokeComment } from "../../axios/JokesApi";
import { UICommentDetails } from "../../models/dto/CommentDto";
import { openNotification } from "../../utils/NotificationUtils";
import { NotificationEnum } from "../../models/enum/NotificationEnum";
import _ from "lodash";
import { fetchApp, fetchAppReviews } from "../../redux/apps/actions";
import { ResText16SemiBold } from "../../utils/TextUtils";

const Wrapper = styled.div`
    width: 100%;

    .write-comment {
        margin-top: 12px;
    }

    .view-comments {
        row-gap: 20px;
    }
`;

const { TextArea } = Input;
export default function ViewComments() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;
    const { loggedIn, user } = useSelector(selectAuth);
    const { appReviews } = useSelector(selectApps);

    /******************* handlers ************************/
    const submitComment = data => {
        if (data.text?.length < 1) {
            return openNotification(
                "Empty comments",
                "Say something or not.",
                NotificationEnum.WARNING,
            );
        }

        postJokeComment(id, {
            text: data.text,
        })
            .then((res: UICommentDetails) => {
                openNotification(
                    "Comment submitted",
                    "",
                    NotificationEnum.SUCCESS,
                );
                // @ts-ignore
                dispatch(fetchAppReviews(id));
                // @ts-ignore
                dispatch(fetchApp(id));
            })
            .catch(err => {
                openNotification(
                    "Comment submitted",
                    _.get(err, "response", ""),
                    NotificationEnum.SUCCESS,
                );
            });
    };

    /******************* renders ************************/

    return (
        <Wrapper className={"vertical-start-flex"}>
            {loggedIn && user?.id && (
                <div className={"vertical-start-flex write-comment"}>
                    <Form
                        layout={"vertical"}
                        initialValues={{ text: "" }}
                        onFinish={submitComment}
                        style={{ width: "100%" }}
                    >
                        <Form.Item
                            label="Anything you want to say to this joke?"
                            name="text"
                            rules={[
                                {
                                    required: false,
                                    message: "You've gotta write something!",
                                },
                            ]}
                        >
                            <TextArea
                                placeholder="Maximum of 250 characters"
                                autoSize={{ minRows: 5 }}
                            />
                        </Form.Item>
                        <Form.Item className={"h-end-flex"}>
                            <Button htmlType={"submit"} type={"primary"}>
                                Comment
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
            <div className={"vertical-start-flex view-comments"}>
                <ResText16SemiBold>All comments</ResText16SemiBold>
                <div className={"vertical-start-flex"}>
                    {appReviews?.map(comment => (
                        <CommentCard
                            key={"joke-" + id + comment.id}
                            comment={comment}
                            loggedUser={user}
                        />
                    ))}
                </div>
            </div>
        </Wrapper>
    );
}
