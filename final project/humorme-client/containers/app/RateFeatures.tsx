import React, { useEffect, useMemo, useState } from "react";
import {
    ResText14Regular,
    ResText16SemiBold,
    ResText18SemiBold,
} from "../../utils/TextUtils";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import FiveStars from "../../components/FiveStars";
import { grey2, grey3, grey5, storeBlue } from "../../utils/ShadesUtils";
import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import _ from "lodash";
import { selectAuth } from "../../redux/auth/reducer";
import { ViewFeaturesActions } from "../../models/enum/GAEventRateFeatureEnum";
import { logViewFeatureActions } from "../../models/dto/GAEventLogger";
import {
    ELEMENT_ON_ACTION,
    OVERALL_RATING,
    UIFeatureViewEnum,
} from "../../models/enum/UIRateFeatureEnum";
import { capitalize, toEndDottedStr } from "../../utils/StringUtils";
import { setAppTimeLog } from "../../redux/events/actions";

const Wrapper = styled.div`
    width: 100%;
    row-gap: 12px;
`;

const FeatureTitle = styled.div`
    row-gap: 12px;

    .rate-features-title {
        column-gap: 12px;
        row-gap: 8px;
    }
`;

export const UndoTextDiv = styled.div`
    display: inline-flex;
    padding: 4px 8px;
    margin: 3px 0;
    border-radius: 4px;
    color: ${grey2};
    border: 1px solid ${grey5};

    b {
        display: inline-flex;
        margin: 0 2px;
    }

    :hover {
        border: 1px solid ${grey5};
        background: #f4f4f4;
        color: ${grey2};
    }
`;

const FeatureContent = styled.div`
    width: 100%;
    row-gap: 20px;

    .star-ratings {
        column-gap: 4px;
    }
`;

const FeatureItem = styled.div`
    padding: 12px 16px;
    align-items: center;
    width: 540px;

    .break-text {
        white-space: normal;
    }

    .feature-item-content {
        width: 90%;
        row-gap: 16px;
    }

    .feature-item-title {
        row-gap: 8px;
        column-gap: 8px;
    }

    .info-icon {
        margin-left: 6px;
        font-size: 16px;
        color: ${storeBlue};
        cursor: pointer;
    }

    .toggle-desc {
        padding: 4px 8px;
    }

    .toggle-desc:hover {
        border-radius: 4px;
        background: #fcfcfc;
        text-decoration: initial;
    }

    @media (max-width: 560px) {
        width: 100%;
    }

    :hover {
        border-radius: 4px;
        background: #f8f8f8;
    }
`;

const CloseBtn = styled.div`
    display: inline-flex;
    cursor: pointer;
    // border: 1px solid ${grey5};
    //border-radius: 4px;

    .anticon {
        font-size: 14px;
        color: ${grey2} !important;
    }

    .close-feature-anticon {
        padding: 4px;
    }

    //.close-feature-text {
    //    //display: none;
    //    padding: 6px 10px;
    //    align-self: start;
    //}

    // .close-feature-text:hover {
    //     background: white;
    //     border: 1px solid ${grey5};
    // }
    //
    // :hover {
    //     cursor: pointer;
    //     border-radius: 4px;
    //     border: 1px solid ${grey3};
    //     background: white;
    // }

    //@media (max-width: 540px) {
    //    margin-top: 24px;
    //
    //    .close-feature-anticon {
    //        display: none;
    //    }
    //
    //    .close-feature-text {
    //        display: flex;
    //    }
    //
    //    :hover {
    //        border: none;
    //        background: none;
    //    }
    //}
`;

export const getCloseBtn = (onClick, feature, dontShowStars) => {
    return (
        <CloseBtn
            onClick={e =>
                onClick(e, feature, UIFeatureViewEnum.SHOW, dontShowStars)
            }
        >
            {dontShowStars ? (
                <ResText14Regular className={"text-grey1"}>
                    Undo
                </ResText14Regular>
            ) : (
                <CloseOutlined className={"text-grey2"} />
            )}
            {/*<ResText14Regular className={"text-grey2 close-feature-text"}>*/}
            {/*    Hide{" "}*/}
            {/*    <CloseOutlined style={{ marginTop: 1.5, marginLeft: 4 }} />*/}
            {/*</ResText14Regular>*/}
        </CloseBtn>
    );
};

export default function RateFeatures() {
    const dispatch = useDispatch();
    const [featuresConfig, setFeaturesConfig] = useState({});
    const { app, appRateFeatures } = useSelector(selectApps);
    const { user } = useSelector(selectAuth);

    /******************* memoized variables ************************/

    const features = useMemo(
        () =>
            Object.keys(appRateFeatures?.rateFeatures || {}).filter(
                item => !item.includes(OVERALL_RATING),
            ),
        [appRateFeatures],
    );

    /******************* use effects ************************/
    useEffect(() => {
        if (features.length > 0) {
            initializeFeatureConfig(false);
        }
    }, [features]);

    /******************* state management ************************/
    const initializeFeatureConfig = undo => {
        const config = featuresConfig;

        // if initialized when page is loaded
        const existingFeatures = Object.keys(config);
        if (!undo && existingFeatures.length < 1) {
            for (let i = 0; i < features.length; i++) {
                config[features[i]] = {
                    [UIFeatureViewEnum.SHOW]: false,
                    [UIFeatureViewEnum.REMOVED]: false,
                };
            }
        }

        // on user click undo (display removed features)
        else if (undo) {
            const tempRemovedFeatures = getRemovedFeatures();

            for (let i = 0; i < tempRemovedFeatures.length; i++) {
                const feature = tempRemovedFeatures[i];
                config[feature] = {
                    ...featuresConfig[feature],
                    [UIFeatureViewEnum.REMOVED]: false,
                };
            }

            // log in analytics
            // users undoes (remove features)
            let params: any = {
                features: tempRemovedFeatures,
                element: ELEMENT_ON_ACTION.APP_DETAILS,
                startTs: new Date(),
                userRole: user?.role,
            };

            // log time in redux
            dispatch(
                // @ts-ignore
                setAppTimeLog(
                    ViewFeaturesActions.UNDO_REMOVE,
                    app?.appId || "-1",
                    user?.id || "-1",
                    params,
                ),
            );

            params = { ...params, userId: user?.id, appId: app?.appId };
            logViewFeatureActions(ViewFeaturesActions.UNDO_REMOVE, params);
        }

        setFeaturesConfig({ ...config });
    };

    /******************* handle user events ************************/

    const onClickFeatureItem = (e, feature, key, value) => {
        e.preventDefault();
        e.stopPropagation();

        // update the key values of the corresponding feature
        const featureValues = { ...featuresConfig[feature], [key]: value };

        // log in analytics
        // user clicks to expand feature description
        if (key === UIFeatureViewEnum.SHOW && value) {
            let params: any = {
                feature: feature,
                element: ELEMENT_ON_ACTION.APP_DETAILS,
                startTs: new Date(),
                userRole: user?.role,
                appId: app?.appId,
            };

            // log time in redux
            dispatch(
                // @ts-ignore
                setAppTimeLog(
                    ViewFeaturesActions.DESC_EXPAND,
                    app?.appId || "-1",
                    user?.id || "-1",
                    params,
                ),
            );

            params = { ...params, userId: user?.id };
            logViewFeatureActions(ViewFeaturesActions.DESC_EXPAND, params);
        }

        // user clicks to temporarily remove feature from UI
        if (key === UIFeatureViewEnum.REMOVED && value) {
            const removeAction =
                _.get(
                    featuresConfig,
                    `${feature}.${UIFeatureViewEnum.SHOW}`,
                    undefined,
                ) === true
                    ? ViewFeaturesActions.DESC_EXPAND_REMOVE
                    : ViewFeaturesActions.TEMPORARY_REMOVE;

            let params: any = {
                feature: feature,
                element: ELEMENT_ON_ACTION.APP_DETAILS,
                startTs: new Date(),
                userRole: user?.role,
            };

            // log time in redux
            dispatch(
                // @ts-ignore
                setAppTimeLog(
                    removeAction,
                    app?.appId || "-1",
                    user?.id || "-1",
                    params,
                ),
            );

            // log in GA
            params = { ...params, userId: user?.id, appId: app?.appId };
            logViewFeatureActions(removeAction, params);
        }

        // update the entire key values in the state
        setFeaturesConfig({
            ...featuresConfig,
            [feature]: featureValues,
        });
    };

    const getRemovedFeatures = (expanded?: boolean) =>
        Object.keys(featuresConfig).filter(
            feature =>
                _.get(
                    featuresConfig,
                    `${feature}.${UIFeatureViewEnum.REMOVED}`,
                    undefined,
                ) === true &&
                (!!expanded
                    ? _.get(
                          featuresConfig,
                          `${feature}.${UIFeatureViewEnum.SHOW}`,
                          undefined,
                      ) === expanded
                    : true),
        );

    /******************* render ************************/

    const getFeatureItem = (feature, index) => {
        const shouldShowDesc = _.get(
            featuresConfig,
            `${feature}.${UIFeatureViewEnum.SHOW}`,
            undefined,
        );
        const featureName = _.get(
            appRateFeatures,
            "rateFeatures." + feature + ".name",
            "",
        );
        const ratingStr = _.get(
            appRateFeatures,
            "rateFeatures." + feature + ".avgRating",
            0,
        )?.toString();
        const desc = _.get(
            appRateFeatures,
            "rateFeatures." + feature + ".desc",
            "",
        ).toString();
        const displayDesc = !shouldShowDesc ? toEndDottedStr(desc, 10) : desc;
        const totalUsersRatingFeature = _.get(
            appRateFeatures,
            "rateFeatures." + feature + ".totalUsers",
            0,
        );

        const toggleDescText = (
            <ResText14Regular
                className={"toggle-desc text-store-blue"}
                onClick={e => {
                    onClickFeatureItem(
                        e,
                        feature,
                        UIFeatureViewEnum.SHOW,
                        !_.get(
                            featuresConfig,
                            `${feature}.${UIFeatureViewEnum.SHOW}`,
                            undefined,
                        ),
                    );
                }}
            >
                {shouldShowDesc ? "show less" : "show more"}
            </ResText14Regular>
        );

        return (
            <FeatureItem
                key={"rate-feature-" + index}
                className={"h-justified-flex"}
            >
                {/* individual feature content*/}
                <div className={"vertical-start-flex feature-item-content"}>
                    <div className={"h-start-flex feature-item-title"}>
                        <ResText16SemiBold className={"text-grey1"}>
                            {capitalize(featureName)}
                        </ResText16SemiBold>
                    </div>
                    <FiveStars
                        rating={ratingStr}
                        fontSize={24}
                        showAvgRating={
                            featureName?.toUpperCase() !== OVERALL_RATING
                        }
                    />
                    <ResText14Regular
                        className={"text-grey2 wrap-word break-text"}
                    >
                        {desc}
                        {/*{toggleDescText}*/}
                    </ResText14Regular>

                    {/*{loggedIn && user?.id && (*/}
                    {/*    <HelpfulSurvey label={featureName} useModal={false} />*/}
                    {/*)}*/}
                </div>

                {/* remove rate feature temporarily from UI */}
                {/*{getCloseBtn(onClickFeatureItem, feature)}*/}
            </FeatureItem>
        );
    };

    return (
        <Wrapper className={"vertical-start-flex"}>
            {/* title */}
            <FeatureTitle className={"h-justified-flex"}>
                <div className={"h-start-flex rate-features-title"}>
                    <ResText18SemiBold className={"text-grey1"}>
                        Rate Features
                    </ResText18SemiBold>
                    {/*num of users rating RF*/}
                    {/*{appRateFeatures?.totalUsersRatingFeatures > 0 && (*/}
                    {/*    <Tooltip*/}
                    {/*        title={*/}
                    {/*            "Users who rated this app using these features"*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        <ResText16Regular*/}
                    {/*            className={"text-grey2 pointer-cursor"}*/}
                    {/*            style={{*/}
                    {/*                marginTop: 2,*/}
                    {/*                display: "inline-flex",*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            {`${appRateFeatures?.totalUsersRatingFeatures}/${appRateFeatures?.totalUsersCount} users`}*/}
                    {/*        </ResText16Regular>*/}
                    {/*    </Tooltip>*/}
                    {/*)}*/}
                </div>
            </FeatureTitle>

            {/*{getRemovedFeatures().length > 0 && (*/}
            {/*    <UndoTextDiv>*/}
            {/*        <ResText14Regular*/}
            {/*            className={"undo-text pointer-cursor"}*/}
            {/*            onClick={e => {*/}
            {/*                e.preventDefault();*/}
            {/*                initializeFeatureConfig(true);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Show <b>{` ${getRemovedFeatures().length} `}</b> hidden*/}
            {/*            {getRemovedFeatures().length > 1*/}
            {/*                ? " features"*/}
            {/*                : " feature"}*/}
            {/*        </ResText14Regular>*/}
            {/*    </UndoTextDiv>*/}
            {/*)}*/}

            {/* features by avg. star ratings */}
            <FeatureContent className={"vertical-start-flex"}>
                {features.map(
                    (feature, index) =>
                        !_.get(
                            featuresConfig,
                            `${feature}.${UIFeatureViewEnum.REMOVED}`,
                            false,
                        ) && getFeatureItem(feature, index),
                )}
            </FeatureContent>
        </Wrapper>
    );
}
