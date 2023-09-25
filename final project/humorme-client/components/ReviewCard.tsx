import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { ResText14Regular, ResText14SemiBold } from "../utils/TextUtils";
import { toEndDottedStr } from "../utils/StringUtils";
import FiveStars from "./FiveStars";
import { Modal } from "antd";
import { toMonthDateYearStr } from "../utils/DateUtils";
import _ from "lodash";
import { ELEMENT_ON_ACTION } from "../models/enum/UIRateFeatureEnum";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../redux/auth/reducer";
import { useRouter } from "next/router";
import { setAppTimeLog } from "../redux/events/actions";
import { ViewReviewActions } from "../models/enum/GAEventRateFeatureEnum";
import { selectApps } from "../redux/apps/reducer";
import { logReviewActions } from "../models/dto/GAEventLogger";

export const Wrapper = styled.div`
    padding: 12px;
    background: #f8f8f8;
    min-height: 175px;
    border-radius: 4px;

    row-gap: 16px;

    .title-text {
        row-gap: 8px;
    }

    .review-text {
        row-gap: 6px;
        text-align: justify;
    }

    .anticon {
        font-size: 12px;
    }

    .star-ratings {
        column-gap: 1px;
        margin-bottom: 2px;
    }
`;

export default function ReviewCard({ review }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const { user } = useSelector(selectAuth);
    const { app } = useSelector(selectApps);
    const { username, date: dateStr, rating, title, review: text } = review;

    /******************* memorized vars ************************/
    const date = useMemo(() => {
        const [datePart, timePart] = dateStr.split(" ");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);

        const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
        return dateObj;
    }, [dateStr]);

    const devResText = useMemo(() => {
        const devRes = _.get(review, "developerResponse", {});
        return _.get(devRes, "body", "");
    }, [review]);

    const reviewLength = useMemo(() => {
        if (devResText?.length > 0) return 30;
        return 150;
    }, [devResText?.length]);

    /******************* modal handlers ************************/
    const toggleModal = (open: boolean, isDevRes = false) => {
        if (!open) setOpenModal(open);
        else {
            const viewingInReviewPage =
                router?.route?.includes("/reviews") === true;
            const compOfView = viewingInReviewPage
                ? ELEMENT_ON_ACTION.ALL_REVIEWS_VIEW
                : ELEMENT_ON_ACTION.APP_DETAILS;
            // modal is opened
            // log that user is reading a review
            let params: any = {
                element: compOfView,
                reviewId: review?.reviewId,
                startTs: new Date(),
                userRole: user?.role,
            };

            const expandAction = isDevRes
                ? ViewReviewActions.DEV_RES_EXPAND
                : ViewReviewActions.REVIEW_EXPAND;

            dispatch(
                // @ts-ignore
                setAppTimeLog(
                    expandAction,
                    app?.appId || "-1",
                    user?.id || "-1",
                    params,
                ),
            );

            params = { ...params, userId: user?.id, appId: app?.appId };
            logReviewActions(expandAction, params);

            setOpenModal(open);
        }
    };

    /******************* render ************************/

    const getTitle = () => (
        <div className={"vertical-start-flex title-text"}>
            <FiveStars rating={rating} showAvgRating={false} />
            <ResText14SemiBold className={"text-grey3"}>
                {username}, {toMonthDateYearStr(date)}
            </ResText14SemiBold>
        </div>
    );

    const getUserReview = (showFull = false) => (
        <div className={"vertical-start-flex review-text"}>
            <ResText14SemiBold className={"text-grey2"}>
                {showFull ? title : toEndDottedStr(title, 30)}
            </ResText14SemiBold>
            <ResText14Regular className={"text-grey2"}>
                {showFull ? text : toEndDottedStr(text, reviewLength)}
                {!showFull && (
                    <span
                        className={"text-store-blue pointer-cursor"}
                        onClick={() => toggleModal(true)}
                    >
                        more
                    </span>
                )}
            </ResText14Regular>
        </div>
    );

    const getDevRes = (showFull = false) =>
        devResText.length > 0 && (
            <div className={"vertical-start-flex review-text "}>
                <ResText14SemiBold className={"text-grey2"}>
                    Developer Response,
                </ResText14SemiBold>
                <ResText14Regular className={"text-grey2"}>
                    {!showFull ? toEndDottedStr(devResText, 30) : devResText}{" "}
                    {!showFull && (
                        <span
                            className={"text-store-blue pointer-cursor"}
                            onClick={() => toggleModal(true, true)}
                        >
                            more
                        </span>
                    )}
                </ResText14Regular>
            </div>
        );

    return (
        <>
            <Wrapper className={"vertical-start-flex"}>
                {getTitle()}
                {getUserReview()}
                {getDevRes()}
            </Wrapper>
            <Modal
                open={openModal}
                footer={null}
                okButtonProps={undefined}
                cancelButtonProps={undefined}
                onCancel={() => toggleModal(false)}
            >
                <Wrapper className={"vertical-start-flex"}>
                    {getTitle()}
                    {getUserReview(true)}
                    {getDevRes(true)}
                </Wrapper>
            </Modal>
        </>
    );
}
