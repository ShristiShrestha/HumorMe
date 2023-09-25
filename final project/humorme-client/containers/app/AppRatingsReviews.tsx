import React, { useMemo } from "react";
import styled from "styled-components";
import {
    Header3,
    ResText12Regular,
    ResText14Regular,
    ResText14SemiBold,
    ResText20SemiBold,
} from "../../utils/TextUtils";
import StarRatings from "../../components/StarRatings";
import ReviewCard from "../../components/ReviewCard";
import { Col, Row } from "antd";
import RateFeatures from "./RateFeatures";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import LeaveReview from "./LeaveReview";
import { storeBlue } from "../../utils/ShadesUtils";
import { selectAuth } from "../../redux/auth/reducer";
import _ from "lodash";
import { AuthUserRole } from "../../utils/AuthUtils";

const Wrapper = styled.div`
    row-gap: 16px;

    .end-align {
        align-items: end;
    }

    .end-text-margin {
        display: inline-block;
        margin-bottom: 8px;
    }

    .rating-reviews-title {
        column-gap: 12px;
        row-gap: 16px;
    }

    .rating-content {
        width: 100%;
        row-gap: 36px;
        column-gap: 24px;
    }

    .avg-rating-h3 {
        margin-bottom: 0 !important;
    }

    .rating-score {
        column-gap: 24px;
    }

    .ant-row {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
`;

export const ratings = {
    5: 0.9,
    4: 0.2,
    3: 0,
    2: 0.1,
    1: 0,
};

export default function AppRatingsReviews() {
    const router = useRouter();
    const { id } = router.query;
    const { app, appRateFeatures, appReviews } = useSelector(selectApps);

    const { user, loggedIn } = useSelector(selectAuth);

    /******************* memoized variables ************************/

    const shouldShowRateFeatures = useMemo(
        () =>
            appRateFeatures?.rateFeatures &&
            Object.keys(appRateFeatures?.rateFeatures).length > 1 &&
            _.get(user, "role", undefined) === AuthUserRole.EXPERIMENT,
        [loggedIn, user?.role, appRateFeatures?.rateFeatures],
    );

    /******************* render ************************/

    return (
        <Wrapper className={"h-start-flex"}>
            {/* title*/}
            <div className={"h-justified-flex rating-reviews-title"}>
                <div className={"h-start-flex rating-reviews-title"}>
                    <ResText20SemiBold>Ratings and Reviews</ResText20SemiBold>
                    <LeaveReview borderColor={storeBlue} />
                </div>
                {/*<Link*/}
                {/*    href={`/apps/${id}/reviews`}*/}
                {/*    className={"pointer-cursor text-store-blue"}*/}
                {/*>*/}
                {/*    See All*/}
                {/*</Link>*/}
                <a
                    className={"pointer-cursor text-store-blue"}
                    href={`https://apps.apple.com/us/app/${app?.name}/id${app?.appId}?see-all=reviews`}
                    target={"_blank"}
                    referrerPolicy={"no-referrer"}
                    rel={"noreferrer"}
                >
                    <ResText12Regular
                        className={"pointer-cursor text-store-blue"}
                    >
                        See all{" "}
                    </ResText12Regular>
                </a>
            </div>
            {/* content */}
            <div className={"h-start-flex rating-content"}>
                {/* rating summary */}
                <div className={"h-start-flex rating-score end-align"}>
                    <div className={"h-start-flex end-align"}>
                        <Header3 className={"text-grey2 avg-rating-h3"}>
                            {app?.meta?.avgRatingText}
                        </Header3>
                        <ResText14SemiBold
                            className={"text-grey2 end-text-margin"}
                            style={{ marginLeft: 6, marginBottom: 12 }}
                        >
                            out of 5
                        </ResText14SemiBold>
                    </div>
                    <ResText14Regular
                        className={"text-grey2 end-text-margin"}
                        style={{ marginLeft: 6, marginBottom: 12 }}
                    >
                        {app?.meta?.ratingText} Ratings
                    </ResText14Regular>
                </div>
                {/* star based ratings */}
                <StarRatings starRatings={ratings} />
                {/* rate features */}
                {loggedIn && shouldShowRateFeatures && <RateFeatures />}
                {/* text reviews */}
                <Row className={"full-width"} gutter={[24, 24]}>
                    {appReviews?.slice(0, 3).map((item, index) => (
                        <Col
                            key={"review-examples-" + index}
                            md={8}
                            sm={12}
                            xs={24}
                        >
                            <ReviewCard review={item} />
                        </Col>
                    ))}
                </Row>
            </div>
        </Wrapper>
    );
}
