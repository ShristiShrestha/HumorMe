import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../redux/apps/reducer";
import React, { useEffect, useMemo, useState } from "react";
import { StarFilled } from "@ant-design/icons";
import { grey3, grey6, storeBlue, webYellow } from "../utils/ShadesUtils";
import { ResText14Regular, ResText16SemiBold } from "../utils/TextUtils";
import styled from "styled-components";
import MyButton, { MyButtonType } from "./MyButton";
import { capitalize, toEndDottedStr } from "../utils/StringUtils";
import { Input, notification } from "antd";
import { selectAuth } from "../redux/auth/reducer";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
    SubmitAppRatingsActions,
    ViewFeaturesActions,
} from "../models/enum/GAEventRateFeatureEnum";
import { postAppRating } from "../axios/AppsApi";
import { EventRes } from "../models/enum/EventEnum";
import {
    ELEMENT_ON_ACTION,
    OVERALL_RATING,
    UIFeatureViewEnum,
} from "../models/enum/UIRateFeatureEnum";
import {
    logSubmitAppRatingsActions,
    logViewFeatureActions,
} from "../models/dto/GAEventLogger";
import moment from "moment";
import { setAppTimeLog } from "../redux/events/actions";
import { selectAppTimeLogs } from "../redux/events/reducer";
import { AuthUserRole } from "../utils/AuthUtils";
import { getCloseBtn } from "../containers/app/RateFeatures";

const { TextArea } = Input;

const Wrapper = styled.div`
    row-gap: 24px;
    width: 100%;
    position: relative;

    .vertical-start-flex {
        width: 100%;
    }

    .rate-features-ratings {
        row-gap: 16px;
        margin-top: 4px;
    }

    .undo-feature-ratings-view {
        cursor: pointer;
    }
`;

const FeatureRating = styled.div`
    align-items: center;

    .break-text {
        white-space: normal;
    }

    .tap-rating-content {
        //width: 85%;
        row-gap: 12px;
    }

    .tap-star-title {
        column-gap: 8px;
    }

    .tap-star-ratings {
        column-gap: 10px;
    }

    .tap-star-ratings-clear {
        column-gap: 24px;
        row-gap: 12px;
        //justify-content: flex-start;
        align-items: center;
    }

    .anticon {
        cursor: pointer;
        font-size: 15px;
        color: ${storeBlue};
    }

    .clear-feature {
        cursor: pointer;
    }

    .close-feature-anticon {
        color: ${grey3};
    }
`;

export default function LeaveStarRatings({ openModalTs, onSubmit }) {
    const dispatch = useDispatch();
    const [textReview, setTextReview] = useState("");

    // per feature > number of stars selected to rate
    const [selectedStar, setSelectedStar] = useState({});

    const { app, appRateFeatures } = useSelector(selectApps);
    const { user, loggedIn } = useSelector(selectAuth);
    const perAppTimelogs = useSelector(selectAppTimeLogs);
    const [ratingTs, setRatingTs] = useState({
        startTs: undefined,
        endTs: undefined,
    });

    // for each feature (including overall),
    // add latest ts of adding star rating
    // to that feature
    const [featureRatingTs, setFeatureRatingTs] = useState({});

    // config for show, removed events for each feature
    const [featuresConfig, setFeaturesConfig] = useState({});

    /******************* memoized variables ************************/

    const shouldShowRateFeatures = useMemo(
        () =>
            appRateFeatures?.rateFeatures &&
            Object.keys(appRateFeatures?.rateFeatures).length > 1 &&
            _.get(user, "role", undefined) === AuthUserRole.EXPERIMENT,
        [loggedIn, user?.role, appRateFeatures?.rateFeatures],
    );

    // exclude overall rating as rate feature
    const rateFeatures = useMemo(
        () =>
            Object.keys(_.get(appRateFeatures, "rateFeatures", {})).filter(
                item => !item.includes(OVERALL_RATING),
            ),
        [app?.appId],
    );

    const enableSubmit = useMemo(
        () =>
            // @ts-ignore
            Object.values(selectedStar).filter(item => item > 0).length > 0,
        [selectedStar],
    );

    const tempRemovedFeatures = useMemo(
        () =>
            Object.keys(featuresConfig).filter(item =>
                _.get(
                    featuresConfig,
                    `${item}.${UIFeatureViewEnum.REMOVED}`,
                    false,
                ),
            ),
        [featuresConfig],
    );

    /******************* use effects ************************/

    useEffect(() => {
        if (rateFeatures.length > 0) {
            initializeFeatureConfig(false);
        }
    }, [rateFeatures]);

    useEffect(() => {
        if (!!openModalTs) {
            initializeStarRatings();
        }

        // on component unmount
        //return () => initializeStarRatings();
    }, [!!openModalTs]); // if removed !!, the startTs in ratingTs is not cleared on modal close without submit

    /******************* state management ************************/

    const initializeStarRatings = () => {
        const starRatings = {};
        for (let i = 0; i < rateFeatures.length; i++) {
            starRatings[rateFeatures[i]] = -1;
        }

        console.log("init star ratings: ", starRatings);

        setSelectedStar({ ...starRatings });
    };

    const initializeFeatureConfig = undo => {
        const config = featuresConfig;

        // if initialized when page is loaded
        const existingFeatures = Object.keys(config);
        if (!undo && existingFeatures.length < 1) {
            for (let i = 0; i < rateFeatures.length; i++) {
                config[rateFeatures[i]] = {
                    [UIFeatureViewEnum.SHOW]: true,
                    [UIFeatureViewEnum.REMOVED]: false,
                };
            }
        }

        // on user click undo
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
                element: ELEMENT_ON_ACTION.RATE_APP,
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

    /******************* event handlers ************************/

    // check if a feature's star rating is selected
    const isSelected = (feature, index) => {
        return selectedStar[feature] > 0 && index + 1 <= selectedStar[feature];
    };

    // when user clicks to expand/collapse the feature details (description)
    const onClickFeatureItem = (e, feature, key, value) => {
        e.preventDefault();

        // update the key values of the corresponding feature
        const featureValues = { ...featuresConfig[feature], [key]: value };

        // log in analytics
        // user clicks to expand feature description
        if (key === UIFeatureViewEnum.SHOW && value) {
            let params: any = {
                feature: feature,
                element: ELEMENT_ON_ACTION.RATE_APP,
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
        // if (key === UIFeatureViewEnum.REMOVED && value) {
        //     const removeAction =
        //         _.get(
        //             featuresConfig,
        //             `${feature}.${UIFeatureViewEnum.SHOW}`,
        //             undefined,
        //         ) === true
        //             ? ViewFeaturesActions.DESC_EXPAND_REMOVE
        //             : ViewFeaturesActions.TEMPORARY_REMOVE;
        //     let params: any = {
        //         feature: feature,
        //         element: ELEMENT_ON_ACTION.RATE_APP,
        //         startTs: new Date(),
        //         userRole: user?.role,
        //     };
        //
        //     // log time in redux
        //     dispatch(
        //         // @ts-ignore
        //         setAppTimeLog(
        //             removeAction,
        //             app?.appId || "-1",
        //             user?.id || "-1",
        //             params,
        //         ),
        //     );
        //
        //     // log in GA
        //     params = { ...params, userId: user?.id, appId: app?.appId };
        //     logViewFeatureActions(removeAction, params);
        // }

        // update the entire key values in the state
        setFeaturesConfig({ ...featuresConfig, [feature]: featureValues });
    };

    // when user clicks stars (in feature or overall)
    const onClickFeatureRating = (e, feature, index) => {
        e.stopPropagation();
        let featureKey = feature?.toUpperCase();
        if (featureKey?.includes("TAP TO RATE")) {
            featureKey = OVERALL_RATING;
        }
        // @ts-ignore
        const previouslyRatedFeatures = Object.entries(selectedStar).filter(
            // @ts-ignore
            ([key, value]) => value > 0,
        );

        if (
            previouslyRatedFeatures.length < 1 ||
            ratingTs.startTs === undefined
        ) {
            console.log(
                "no previous feature rated: selected star and previously rated stars",
                selectedStar,
                previouslyRatedFeatures,
            );
            // @ts-ignore
            setRatingTs({ ...ratingTs, startTs: new Date() });
        }

        // update with the latest timestamp when rating feature
        if (index > -1) {
            setFeatureRatingTs({
                ...featureRatingTs,
                [featureKey]: new Date(),
            });
        }
        setSelectedStar({ ...selectedStar, [featureKey]: index + 1 });
    };

    // when user submits their ratings
    const onSubmitReview = () => {
        const olderFeatureTsFirst = Object.values(featureRatingTs).sort(
            // @ts-ignore
            (first, second) => first - second,
        );
        const ratingStartTs = ratingTs?.startTs
            ? new Date(ratingTs?.startTs)
            : olderFeatureTsFirst.length > 0
            ? olderFeatureTsFirst[0]
            : undefined;

        if (ratingStartTs === undefined) {
            return notification.error({
                message: "Start ts is undefined.",
                placement: "topRight",
            });
        }

        const selectedStarFeaturesInView = Object.keys(selectedStar).filter(
            item =>
                _.get(
                    featuresConfig,
                    `${item}.${UIFeatureViewEnum.REMOVED}`,
                    undefined,
                ) !== true,
        );

        const selectedFeaturesRated = {};
        for (let i = 0; i < selectedStarFeaturesInView.length; i++) {
            const featureKey = selectedStarFeaturesInView[i];
            selectedFeaturesRated[featureKey] = selectedStar[featureKey];
        }

        const includedFeatures = Object.keys(selectedFeaturesRated).filter(
            item => selectedFeaturesRated[item] > -1,
        );
        const excludedFeatures = rateFeatures.filter(
            item => !includedFeatures.includes(item),
        );

        // @ts-ignore
        ratingTs["endTs"] = new Date();

        if (moment(ratingTs.endTs).isBefore(moment(ratingStartTs))) {
            return notification.error({
                message: "End ts is before start ts.",
                placement: "topRight",
            });
        }

        console.log(
            "submit rating start ts: ",
            ratingStartTs,
            " end ts: ",
            ratingTs.endTs,
        );

        const timeToRateInMilli =
            ratingTs.endTs && ratingTs.startTs // @ts-ignore
                ? new Date(ratingTs.endTs).getTime() - ratingStartTs?.getTime()
                : -1;

        const appRating = {
            id: uuidv4()?.toString(),
            user: user || { id: "-1", name: "anonymous" },
            appId: app?.appId,
            appName: app?.name,
            createdAt: new Date(),
            star: selectedFeaturesRated,
            text: textReview,
            ratingTs: ratingTs,
        };

        // before submitting log rating submission in analytics
        let logParams: any = {
            ...ratingTs,
            appRatingId: appRating.id,
            timeToRate: timeToRateInMilli,
            element: ELEMENT_ON_ACTION.RATE_APP,
            userRole: user?.role,
        };

        const actionType =
            excludedFeatures.length === rateFeatures.length
                ? SubmitAppRatingsActions.EXCLUDE_RATE_FEATURES // WHEN ONly overall rating is used
                : SubmitAppRatingsActions.INCLUDE_RATE_FEATURES;

        // when at least ONE (1) rate feature is used to rate app
        if (actionType === SubmitAppRatingsActions.INCLUDE_RATE_FEATURES) {
            logParams["includedFeatures"] = includedFeatures;
            logParams["excludedFeatures"] = excludedFeatures;
        }

        console.log("submit app rating: ", appRating);

        postAppRating(appRating)
            .then(() => {
                // log app rating time in redux
                const newLog = {
                    eventType: actionType,
                    appId: app?.appId || "-1",
                    userId: user?.id || "-1",
                    params: logParams,
                };
                // dispatch(
                //     // @ts-ignore
                //     setAppTimeLog(
                //         actionType,
                //         app?.appId || "-1",
                //         user?.id || "-1",
                //         logParams,
                //     ),
                // );

                // log app rating event in GA
                logParams = {
                    ...logParams,
                    userId: user?.id,
                    appId: app?.appId,
                };

                console.log(
                    "submit app ratings GA logs: ",
                    actionType,
                    logParams,
                );
                logSubmitAppRatingsActions(actionType, logParams);

                // re initialize timestamps
                setRatingTs({
                    ...ratingTs,
                    startTs: undefined,
                    endTs: undefined,
                });

                // submit app time logs until this point
                // use this again in app page
                // coz the user may not rate this app

                // console.log(
                //     "on submit ratings perAppTimelogs: ",
                //     perAppTimelogs,
                // );
                // TODO: do we even need this since app rating submitted
                //  already records these values?
                // dispatch(
                //     // @ts-ignore
                //     postAppTimelog(
                //         user?.id || "-1",
                //         perAppTimelogs,
                //         newLog,
                //         data => {},
                //         (data, error) => {
                //             console.error(
                //                 "submit rating time log error: ",
                //                 error,
                //             );
                //         },
                //     ),
                // );

                // user rating has been submitted,
                // so clear the star ratings
                initializeStarRatings();
                onSubmit(EventRes.SUCCESS);
            })
            .catch(err => {
                console.error("submit rating err: ", err);
                onSubmit(EventRes.ERROR, err);
            });
    };

    /******************* render ************************/

    const getFeatureRating = (title, index) => {
        const shouldShowDesc = _.get(
            featuresConfig,
            `${title}.${UIFeatureViewEnum.SHOW}`,
            undefined,
        );

        const featureName = capitalize(
            _.get(
                appRateFeatures,
                "rateFeatures." + title + ".name",
                OVERALL_RATING,
            ),
        );

        const desc = capitalize(
            _.get(
                app,
                "rateFeatures." + title + ".desc",
                _.get(appRateFeatures, "rateFeatures." + title + ".desc", ""),
            ).toString(),
        );
        const displayDesc = !shouldShowDesc ? toEndDottedStr(desc, 10) : desc;
        const toggleDescText = (
            <ResText14Regular
                className={"toggle-desc text-store-blue"}
                onClick={e =>
                    title !== OVERALL_RATING &&
                    onClickFeatureItem(
                        e,
                        title,
                        UIFeatureViewEnum.SHOW,
                        !_.get(
                            featuresConfig,
                            `${title}.${UIFeatureViewEnum.SHOW}`,
                            false,
                        ),
                    )
                }
            >
                {shouldShowDesc ? "show less" : "show more"}
            </ResText14Regular>
        );

        const starsView = [...Array(5).keys()].map((ratingKey, index) => (
            <StarFilled
                key={"leave-ratings-" + ratingKey}
                style={{
                    fontSize: 32,
                    color: isSelected(title, index) ? webYellow : grey6,
                }}
                onClick={e => onClickFeatureRating(e, title, ratingKey)}
            />
        ));

        const dontShowStars =
            _.get(
                featuresConfig,
                `${title}.${UIFeatureViewEnum.SHOW}`,
                undefined,
            ) === false;

        return (
            <FeatureRating
                key={"tap-rating-feature-" + index}
                className={"h-justified-flex"}
                // style={{
                //     padding:
                //         title === OVERALL_RATING
                //             ? "8px 0 !important"
                //             : "8px 12px",
                // }}
            >
                <div className={"vertical-start-flex tap-rating-content"}>
                    <div className={"h-justified-flex"}>
                        <span className={"h-start-flex tap-star-title"}></span>
                    </div>
                    <ResText16SemiBold className={"text-grey2"}>
                        {title === OVERALL_RATING
                            ? "How would you rate this app?"
                            : featureName}
                    </ResText16SemiBold>
                    <div
                        className={
                            "h-justified-flex full-width tap-star-ratings-clear"
                        }
                    >
                        <div className={"h-start-flex tap-star-ratings"}>
                            {!dontShowStars ? (
                                starsView
                            ) : (
                                <ResText14Regular className={"text-grey3"}>
                                    Not rated
                                </ResText14Regular>
                            )}
                        </div>

                        {selectedStar[title] > 0 ? (
                            <ResText14Regular
                                className={"text-grey3 clear-feature"}
                                onClick={e =>
                                    onClickFeatureRating(e, title, -1)
                                }
                            >
                                Clear
                            </ResText14Regular>
                        ) : (
                            title !== OVERALL_RATING &&
                            getCloseBtn(
                                onClickFeatureItem,
                                title,
                                dontShowStars,
                            )
                        )}
                    </div>

                    {/*{title !== OVERALL_RATING && (*/}
                    {/*    <ResText14Regular*/}
                    {/*        className={*/}
                    {/*            "full-width text-grey2 wrap-word break-text"*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        {displayDesc}*/}
                    {/*        {toggleDescText}*/}
                    {/*    </ResText14Regular>*/}
                    {/*)}*/}
                </div>
            </FeatureRating>
        );
    };

    const getFeatureRatings = () => (
        <div className={"vertical-start-flex rate-features-ratings"}>
            <div className={"h-justified-flex"}>
                <ResText16SemiBold className={"text-grey2"}>
                    How would you rate these features?
                    {/*<ResText14Regular className={"text-grey3"}>*/}
                    {/*    (Optional)*/}
                    {/*</ResText14Regular>*/}
                </ResText16SemiBold>

                {/*{appRateFeatures?.totalUsersRatingFeatures > 0 && (*/}
                {/*    <Tooltip*/}
                {/*        title={"Users who rated this app using these features"}*/}
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

            {/* rate features star-ratings*/}
            {Object.keys(featuresConfig)
                // .filter(
                //     item =>
                //         !_.get(
                //             featuresConfig,
                //             `${item}.${UIFeatureViewEnum.REMOVED}`,
                //             false,
                //         ) && item !== OVERALL_RATING,
                // )
                .map((feature, index) =>
                    getFeatureRating(feature?.toUpperCase(), index),
                )}
        </div>
    );

    return (
        <Wrapper className={"vertical-start-flex"}>
            {getFeatureRating(OVERALL_RATING, 0)}

            {/* show star-rating by tapping for rate features */}
            {loggedIn && shouldShowRateFeatures && getFeatureRatings()}

            <div className={"vertical-start-flex text-ratings"}>
                <TextArea
                    placeholder={"Review (Optional)"}
                    autoSize={{ minRows: 3 }}
                    onChange={e => setTextReview(e.currentTarget.value)}
                />
            </div>

            {/*{loggedIn ? (*/}
            {/*    <div className={"h-end-flex full-width"}>*/}
            {/*        <MyButton*/}
            {/*            text={"Submit"}*/}
            {/*            showLoading={true}*/}
            {/*            btnType={MyButtonType.primary}*/}
            {/*            onClick={() => onSubmitReview()}*/}
            {/*            isDisabled={!enableSubmit}*/}
            {/*            isFullWidth={true}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    <ResText14Regular className={"text-grey2"}>*/}
            {/*        <InfoCircleOutlined className={"text-orange"} /> Please Sign*/}
            {/*        in first*/}
            {/*    </ResText14Regular>*/}
            {/*)}*/}

            <div className={"h-end-flex full-width"}>
                <MyButton
                    text={"Submit"}
                    showLoading={true}
                    btnType={MyButtonType.primary}
                    onClick={() => onSubmitReview()}
                    isDisabled={!enableSubmit}
                    isFullWidth={true}
                />
            </div>
        </Wrapper>
    );
}
