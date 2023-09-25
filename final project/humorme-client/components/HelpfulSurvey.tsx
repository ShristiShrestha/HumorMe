import React, { useState } from "react";
import styled from "styled-components";
import { Input, Modal, notification, Tag } from "antd";
import { ResText12Regular, ResText16Regular } from "../utils/TextUtils";
import MyButton, { MyButtonType } from "./MyButton";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../redux/auth/reducer";
import { selectApps } from "../redux/apps/reducer";
import { ELEMENT_ON_ACTION } from "../models/enum/UIRateFeatureEnum";
import { logHelpfulness } from "../models/dto/GAEventLogger";
import { HelpfulnessActions } from "../models/enum/GAEventRateFeatureEnum";
import { postAppTimelog } from "../redux/events/actions";
import { selectAppTimeLogs } from "../redux/events/reducer";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";

const Wrapper = styled.div`
    width: fit-content;
    cursor: pointer;
    column-gap: 8px;
    row-gap: 8px;

    .ant-tag {
        padding: 3px 8px;
        background: white;
    }
`;

const ModalBox = styled.div`
    align-items: flex-start;
    row-gap: 12px;

    .submit-btns {
        display: flex;
        width: 100%;
    }

    .submit-btns > .h-start-flex {
        column-gap: 6px;
        row-gap: 6px;
    }

    @media (max-width: 360px) {
        align-items: center;
        justify-content: center;

        span,
        div {
            width: 100% !important;
        }

        .ant-btn {
            width: 100% !important;
        }
    }
`;
export default function HelpfulSurvey({ label, useModal }) {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);
    const { app } = useSelector(selectApps);
    const perAppTimelogs = useSelector(selectAppTimeLogs);

    const [showModal, setShowModal] = useState(false);
    const [extraReview, setExtraReview] = useState("");

    /******************* event handlers ************************/

    const onSubmitSurvey = (e, isHelpful?: boolean) => {
        e.preventDefault();

        let params: any = {
            element: ELEMENT_ON_ACTION.APP_DETAILS,
            isHelpful: isHelpful,
            startTs: new Date(),
            userRole: user?.role,
        };

        if (extraReview?.length > 0) {
            params["extraReview"] = extraReview;
        }
        if (isHelpful !== undefined) {
            params["isHelpful"] = isHelpful;
        }
        if (label?.length > 0) {
            params["label"] = label?.toUpperCase();
        }

        const actionType =
            isHelpful !== undefined
                ? HelpfulnessActions.FEATURE_HELPFULNESS
                : HelpfulnessActions.USER_HELPFULNESS;

        const newLog = {
            eventType: actionType,
            appId: app?.appId || "-1",
            userId: user?.id || "-1",
            params: params,
        };
        // dispatch(
        //     // @ts-ignore
        //     setAppTimeLog(
        //         actionType,
        //         app?.appId || "-1",
        //         user?.id || "-1",
        //         params,
        //     ),
        // );

        // submit time logs to firebase
        submitTimelogs(newLog);

        // log in GA
        params = {
            ...params,
            userId: user?.id || "-1",
            appId: app?.appId || "-1",
        };
        logHelpfulness(actionType, params);
    };

    const submitTimelogs = (newLog: any) => {
        dispatch(
            // @ts-ignore
            postAppTimelog(
                user?.id || "-1",
                perAppTimelogs,
                newLog,
                data => {
                    notification.success({
                        message: "Submitted successfully.",
                        placement: "topRight",
                    });
                    if (showModal) {
                        setShowModal(false);
                    }
                },
                (data, error) => {
                    notification.error({
                        message:
                            "Failed to submit the survey. Please try again.",
                        placement: "topRight",
                    });
                },
            ),
        );
    };

    /******************* render ************************/

    const likeOptions = [
        {
            key: "find-helpful",
            title: "Helpful",
            icon: <LikeOutlined />,
            value: true,
        },
        {
            key: "find-no-helpful",
            title: "Not Helpful",
            icon: <DislikeOutlined />,
            value: false,
        },
    ].slice(0, useModal ? 1 : 2);

    return (
        <Wrapper className={"h-start-flex"}>
            {likeOptions.map(item => (
                <Tag
                    key={item.key + "-" + label}
                    onClick={e =>
                        useModal
                            ? setShowModal(true)
                            : onSubmitSurvey(e, item.value)
                    }
                >
                    <ResText12Regular>
                        {item.icon} {item.title}
                    </ResText12Regular>
                </Tag>
            ))}

            <Modal
                open={showModal}
                footer={null}
                onCancel={() => setShowModal(false)}
            >
                <ModalBox className={"h-centered-flex"}>
                    <ResText16Regular>Send us feedback</ResText16Regular>
                    <Input
                        value={extraReview}
                        onChange={e => setExtraReview(e.target.value)}
                        placeholder={"Tell us more about your experience."}
                    />

                    <div className={"h-end-flex submit-btns"}>
                        <div className={"h-start-flex"}>
                            <MyButton
                                text={"Submit"}
                                showLoading={true}
                                btnType={MyButtonType.primary}
                                onClick={e => onSubmitSurvey(e)}
                            />

                            {/*<MyButton*/}
                            {/*    text={"No"}*/}
                            {/*    showLoading={true}*/}
                            {/*    btnType={MyButtonType.info}*/}
                            {/*    onClick={() => onSubmitSurvey(false)}*/}
                            {/*/>*/}
                        </div>
                    </div>
                </ModalBox>
            </Modal>
        </Wrapper>
    );
}
