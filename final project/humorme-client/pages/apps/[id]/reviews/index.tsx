import React from "react";
import { useRouter } from "next/router";
import {
    Header3,
    ResText14Regular,
    ResText14SemiBold,
    ResText24SemiBold,
} from "../../../../utils/TextUtils";
import styled from "styled-components";
import StarRatings from "../../../../components/StarRatings";
import { ratings } from "../../../../containers/app/AppRatingsReviews";
import { Col, Row } from "antd";
import ReviewCard from "../../../../components/ReviewCard";
import { selectApps } from "../../../../redux/apps/reducer";
import { useSelector } from "react-redux";
import { capitalize } from "../../../../utils/StringUtils";
import { BackIconWithText } from "../index";
import MyEmptyView from "../../../../components/MyEmtpyView";
import withAppLoad from "../../../../containers/WithAppLoad";

const Wrapper = styled.div.attrs({
    className: "vertical-start-flex",
})`
    height: calc(100vh - 120px);
    position: relative;
    overflow-y: auto;
    row-gap: 12px;

    .rating-content {
        align-items: center;
        row-gap: 24px;
    }

    .app-name:hover {
        text-decoration: underline;
    }

    .end-align {
        align-items: end;
    }

    .end-text-margin {
        display: inline-block;
        margin-bottom: 8px;
    }

    .rating-score {
        column-gap: 24px;
    }

    @media (max-width: 560px) {
        .users-rating {
            display: none;
        }
    }
`;

function Reviews() {
    const router = useRouter();
    const { id } = router.query;
    const { app, appReviews } = useSelector(selectApps);

    if (!app?.appId) return <MyEmptyView showAsLoading={true} />;

    return (
        <Wrapper>
            {BackIconWithText(`/apps/${id}`, capitalize(app?.name || ""))}

            <ResText24SemiBold
                className={"text-grey1 full-block"}
                style={{ marginBottom: 4 }}
            >
                Ratings and Reviews
            </ResText24SemiBold>
            <div className={"h-justified-flex rating-content"}>
                {/* rating summary*/}
                <div className={"h-start-flex rating-score end-align"}>
                    <div
                        className={"h-start-flex end-align"}
                        style={{ columnGap: 8 }}
                    >
                        <Header3 className={"text-grey2"}>
                            {app?.meta?.avgRatingText}
                        </Header3>
                        <ResText14SemiBold
                            className={"text-grey2 end-text-margin"}
                        >
                            out of 5
                        </ResText14SemiBold>
                    </div>
                    <ResText14Regular
                        className={"text-grey2 end-text-margin users-rating"}
                    >
                        {app?.meta?.ratingText} Ratings
                    </ResText14Regular>
                </div>
                <StarRatings starRatings={ratings} style={{ marginRight: 8 }} />
                {/* text reviews */}
                <Row
                    className={"full-width no-margin"}
                    style={{ marginLeft: 0, marginRight: 0, width: "100%" }}
                    gutter={[24, 24]}
                >
                    {appReviews?.map((item, index) => (
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

const WrappedPage = withAppLoad(Reviews);
export default WrappedPage;
