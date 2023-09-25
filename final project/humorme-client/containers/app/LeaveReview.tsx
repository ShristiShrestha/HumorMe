import { ResText14Regular, ResText24Regular } from "../../utils/TextUtils";
import { Button, Modal, notification } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined } from "@ant-design/icons";
import AppInfo from "./AppInfo";
import LeaveStarRatings from "../../components/LeaveStarRatings";
import styled from "styled-components";
import { EventRes } from "../../models/enum/EventEnum";
import { setAppRateFeatures } from "../../redux/apps/actions";
import { selectApps } from "../../redux/apps/reducer";
import { getAppRateFeatures } from "../../axios/AppsApi";
import { UserRole } from "../../functions/src/utils/Users";
import { selectAuth } from "../../redux/auth/reducer";

const ModalWrapper = styled.div`
    margin: 24px 0;
    row-gap: 24px;
    width: 100%;
`;

export default function LeaveReview(props) {
    const dispatch = useDispatch();
    const { app } = useSelector(selectApps);
    const { user, loggedIn } = useSelector(selectAuth);
    const [openModal, setOpenModal] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const callbackSubmitReview = (event: EventRes, err: any) => {
        if (event == EventRes.SUCCESS) {
            setOpenModal(false);
            api.success({
                message: `Ratings submitted!`,
                description: "Thank you for rating the app.",
                // @ts-ignore
                placement: "topRight",
            });
            if (app?.appId && loggedIn && user?.role === UserRole.EXPERIMENT) {
                getAppRateFeatures(app.appId).then(appRes => {
                    // @ts-ignore
                    dispatch(setAppRateFeatures(appRes));
                });
            }
        } else {
            console.log("error submit ratings: :", err.response.status);
            const errorMessage =
                err?.response?.status === 401
                    ? "Please login first."
                    : "Failed to submit your ratings. Please try again later.";
            api.error({
                message: `Error`,
                description: errorMessage,
                placement: "topRight",
            });
        }
    };

    // @ts-ignore
    return (
        <>
            {contextHolder}
            <Button
                size={"small"}
                onClick={() => setOpenModal(true)}
                style={{ ...props }}
            >
                <ResText14Regular className={"text-store-blue"}>
                    Write a review <EditOutlined style={{ marginRight: 3 }} />
                </ResText14Regular>
            </Button>

            {/* unique key everytime a user clicks "show more" in feature desc
                 is causing modal to auto close, since I am using dispatch to set ts
                 whenever users clicks "show more"...
                 instead I used a prop.openModalTs to initialize star ratings
                 whenever the user opens up the modal */}
            <Modal
                // key={"leave-star-rating-modal-" + new Date().getTime()}
                open={openModal}
                title={<ResText24Regular>Write a review</ResText24Regular>}
                footer={null}
                okButtonProps={undefined}
                cancelButtonProps={undefined}
                onCancel={() => {
                    setOpenModal(false);
                }}
            >
                <ModalWrapper className={"vertical-start-flex"}>
                    <AppInfo appIconSize={100} showRatings={false} />
                    <LeaveStarRatings
                        openModalTs={openModal ? new Date() : undefined}
                        onSubmit={(event, err) =>
                            callbackSubmitReview(event, err)
                        }
                    />
                </ModalWrapper>
            </Modal>
        </>
    );
}
