import {
    ActionCategories,
    HelpfulnessActions,
    PageViewActions,
    SearchAppsActions,
    SubmitAppRatingsActions,
    ViewFeaturesActions,
    ViewReviewActions,
} from "../enum/GAEventRateFeatureEnum";
import ReactGA from "react-ga4";
import _ from "lodash";

/******************* Send Event logs to Google Analytics ************************/

// View Rate Features
export const logViewFeatureActions = (
    action: ViewFeaturesActions,
    params: any,
) => {
    const optionsOrName = {
        // required: specific trigger of this event
        action: action,

        // required: broad category of the event
        category: ActionCategories.VIEW_FEATURE,

        // short description of this event
        label: getActionLabels(action),

        // numerical value associated with this event
        value: parseInt(_.get(params, "appId", "-1")),
    };

    // custom dimensions (any) and metrics (numerical)
    const additionalParams = {
        ...params,
    };

    switch (action) {
        case ViewFeaturesActions.UNDO_REMOVE:
            const logFeatures = _.get(params, "features", []);
            additionalParams["features"] = logFeatures.join(",");
            break;
        default:
            break;
    }

    sendGAEvent(optionsOrName, additionalParams);
};

export const logReviewActions = (action: ViewReviewActions, params: any) => {
    const optionsOrName = {
        // required: specific trigger of this event
        action: action,

        // required: broad category of the event
        category: ActionCategories.VIEW_REVIEW,

        // short description of this event
        label: getActionLabels(action),

        // numerical value associated with this event
        value: parseInt(_.get(params, "appId", "-1")),
    };

    // custom dimensions (any) and metrics (numerical)
    const additionalParams = {
        ...params,
    };

    sendGAEvent(optionsOrName, additionalParams);
};

// Submit app ratings
export const logSubmitAppRatingsActions = (
    action: SubmitAppRatingsActions,
    params: any,
) => {
    const optionsOrName = {
        // required: specific trigger of this event
        action: action,

        // required: broad category of the event
        category: ActionCategories.SUBMIT_APP_RATINGS,

        // short description of this event
        label: getActionLabels(action),

        // numerical value associated with this event
        value: _.get(params, "timeToRate", -1),
    };

    // custom dimensions (any) and metrics (numerical)
    const additionalParams = {
        ...params,
    };

    const excluded = _.get(params, "excludedFeatures", []);
    const included = _.get(params, "includedFeatures", []);
    additionalParams["excludedFeatures"] = excluded.join(",");
    additionalParams["includedFeatures"] = included.join(",");

    sendGAEvent(optionsOrName, additionalParams);
};

export const logAppSearch = (action: SearchAppsActions, params: any) => {
    const optionsOrName = {
        action: action,
        category: ActionCategories.SEARCH_APPS,
        label: getActionLabels(action),
        value: _.get(params, "query", "")?.toString()?.split(" ").length,
    };

    // custom dimensions (any) and metrics (numerical)
    const additionalParams = {
        ...params,
    };

    sendGAEvent(optionsOrName, additionalParams);
};

export const logPageView = (action: PageViewActions, params: any) => {
    const optionsOrName = {
        action: action,
        category: ActionCategories.PAGE_VIEW,
        label: getActionLabels(action),
        value: _.get(params, "appId", "-1"),
    };

    // custom dimensions (any) and metrics (numerical)
    const additionalParams = {
        ...params,
    };

    sendGAEvent(optionsOrName, additionalParams);
};

export const logHelpfulness = (action: HelpfulnessActions, params: any) => {
    const optionsOrName = {
        action: action,
        category: ActionCategories.HELPFULNESS,
        label: getActionLabels(action),
        value: _.get(params, "isHelpful", ""),
    };

    // custom dimensions (any) and metrics (numerical)
    const additionalParams = {
        ...params,
    };

    sendGAEvent(optionsOrName, additionalParams);
};

/******************* internal helpers ************************/
const getActionLabels = (
    action:
        | ViewFeaturesActions
        | ViewReviewActions
        | SubmitAppRatingsActions
        | SearchAppsActions
        | PageViewActions
        | HelpfulnessActions,
) => {
    switch (action) {
        case ViewFeaturesActions.DESC_EXPAND:
            return "expand feature description.";
        case ViewFeaturesActions.DESC_EXPAND_REMOVE:
            return "remove feature after expanding description.";
        case ViewFeaturesActions.TEMPORARY_REMOVE:
            return "remove feature without expanding description.";
        case ViewFeaturesActions.UNDO_REMOVE:
            return "display features by undoing the remove feature action.";
        case SubmitAppRatingsActions.EXCLUDE_RATE_FEATURES:
            return "submit app rating without any rate features.";
        case SubmitAppRatingsActions.INCLUDE_RATE_FEATURES:
            return "submit app rating by including atleast 1 rate feature.";
        case SearchAppsActions.QUERY_APP:
            return "query app by string.";
        case ViewReviewActions.REVIEW_EXPAND:
            return "expand review by review.see more";
        case ViewReviewActions.DEV_RES_EXPAND:
            return "expand review by devRes.see more";
        case PageViewActions.VIEW_APP_DETAILS:
            return "navigate to app details page.";
        case HelpfulnessActions.USER_HELPFULNESS:
            return "submit helpfulness survey.";
        case HelpfulnessActions.FEATURE_HELPFULNESS:
            return "submit feature helpfulness survey.";
        default:
            return "Invalid action.";
    }
};

const sendGAEvent = (optionsOrName, additionalParams) =>
    ReactGA._gaCommandSendEvent(
        optionsOrName.category,
        optionsOrName.action,
        optionsOrName.label,
        optionsOrName.value,
        additionalParams,
    );
