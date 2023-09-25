/******************* rate features actions ************************/

export enum ActionCategories {
    // view feature in app detail page > ratings
    // view feature in app rating popup > ratings
    VIEW_FEATURE = "VIEW_FEATURE",
    SUBMIT_APP_RATINGS = "SUBMIT_APP_RATINGS",
    SEARCH_APPS = "SEARCH_APPS",
    PAGE_VIEW = "PAGE_VIEW",
    VIEW_REVIEW = "VIEW_REVIEW", // read review
    HELPFULNESS = "HELPFULNESS",
}

/******************* actions for : VIEW_FEATURE ************************/

export enum ViewFeaturesActions {
    // expand feature description
    DESC_EXPAND = "DESC_EXPAND",

    // expand feature description and then remove from UI
    DESC_EXPAND_REMOVE = "DESC_EXPAND_REMOVE",

    // remove feature by clicking close icon (without desc expand)
    TEMPORARY_REMOVE = "TEMPORARY_REMOVE",

    // display features that were temporarily removed before
    UNDO_REMOVE = "UNDO_REMOVE",
}

/******************* actions for : SUBMIT_APP_RATINGS ************************/

export enum SubmitAppRatingsActions {
    EXCLUDE_RATE_FEATURES = "EXCLUDE_RATE_FEATURES",
    INCLUDE_RATE_FEATURES = "INCLUDE_RATE_FEATURES",
}

/******************* actions for : SEARCH_APPS ************************/

export enum SearchAppsActions {
    QUERY_APP = "QUERY_APP",
}

/******************* actions for : HELPFULNESS ************************/

export enum HelpfulnessActions {
    USER_HELPFULNESS = "USER_HELPFULNESS",
    FEATURE_HELPFULNESS = "FEATURE_HELPFULNESS",
}

/******************* actions for: VIEW_REVIEW ************************/

export enum ViewReviewActions {
    REVIEW_EXPAND = "REVIEW_EXPAND",
    DEV_RES_EXPAND = "DEV_RES_EXPAND",
}

/******************* actions for : PAGE_VIEW ************************/
export enum PageViewActions {
    VIEW_APP_DETAILS = "VIEW_APP_DETAILS",
}
