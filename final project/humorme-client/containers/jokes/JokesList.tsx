import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import { Input, List, Spin } from "antd";
import { ResText14Regular } from "../../utils/TextUtils";
import { grey3, grey5 } from "../../utils/ShadesUtils";
import { setAppTimeLog } from "../../redux/events/actions";
import {
    PageViewActions,
    SearchAppsActions,
} from "../../models/enum/GAEventRateFeatureEnum";
import { selectAuth } from "../../redux/auth/reducer";
import { ELEMENT_ON_ACTION } from "../../models/enum/UIRateFeatureEnum";
import { logAppSearch, logPageView } from "../../models/dto/GAEventLogger";
import { fetchApps, fetchSearchApps } from "../../redux/apps/actions";
import JokeCard from "../../components/JokeCard";

const Wrapper = styled.div.attrs({
    className: "vertical-start-flex",
})`
    width: 100%;
    position: relative;
    row-gap: 16px;
    min-height: fit-content;
    overflow-y: scroll;

    .ant-input {
        border-radius: 12px;
        border: 1px solid ${grey3};
        font-size: 1em;
        font-style: normal;
        height: 40px;
    }
`;

const ListContent = styled.div`
    width: 100%;
    position: relative;
    height: calc(100vh - 100px);
    overflow-y: scroll;
    overflow-x: hidden;
    min-height: fit-content;

    .ant-list-items {
        display: grid;
        row-gap: 32px;
    }

    .ant-list-item {
        border-block-end: none;
    }
`;

const LoadMoreDiv = styled.div`
    padding: 6px;
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid ${grey5};
`;

const { Item } = List;

export default function JokesList() {
    const dispatch = useDispatch();
    const { appsById, lastPointer, searchAppsById } = useSelector(selectApps);
    const { user } = useSelector(selectAuth);
    const [showSearchRes, setShowSearchRes] = useState(false);
    const [loadApps, setLoadApps] = useState(false);

    /******************* memoized variables ************************/
    const searchApps = useMemo(
        () => Object.values(searchAppsById) || [],
        [showSearchRes, Object.keys(searchAppsById)],
    );

    const reduxApps = useMemo(
        () => Object.values(appsById) || [],
        [Object.keys(appsById)],
    );

    /******************* GA event logging ************************/

    const logSearchAppQuery = query => {
        if (query?.toString().length > 0) {
            let params: any = {
                element: ELEMENT_ON_ACTION.HOME,
                query: query,
                startTs: new Date(),
                userRole: user?.role,
            };

            dispatch(
                // @ts-ignore
                setAppTimeLog(
                    SearchAppsActions.QUERY_APP,
                    "-1",
                    user?.id || "-1",
                    params,
                ),
            );

            params = { ...params, userId: user?.id, appId: "-1" };
            logAppSearch(SearchAppsActions.QUERY_APP, params);
        }
    };

    /******************* event handlers ************************/
    const handleSearch = (e, textCleared: boolean) => {
        const text = e.target.value;

        if (text.length < 1) {
            return setShowSearchRes(false);
        }

        if (textCleared) return;
        // const existingApps = reduxApps;
        // existingApps.push(...searchApps);
        // const appsFromLocal = searchByQuery(text, existingApps);
        //
        // console.log("search in redux first: ", appsFromLocal);
        // fuzzy search in existing redux store
        // if (appsFromLocal && appsFromLocal.length > 0) {
        //     // @ts-ignore
        //     dispatch(setApps(appsFromLocal, undefined, true, true));
        //     setShowSearchRes(true);
        // }
        // fetch from server
        // else {
        setLoadApps(true);
        dispatch(
            // @ts-ignore
            fetchSearchApps(text, undefined, undefined, () => {
                setShowSearchRes(true);
                setLoadApps(false);
            }),
        );
        // }

        logSearchAppQuery(text); // GA log event
    };

    const handleLoadMore = () => {
        // @ts-ignore
        dispatch(fetchApps(lastPointer));
    };

    const logPageNavigate = appId => {
        if (appId?.toString()?.length > 0) {
            let params: any = {
                element: ELEMENT_ON_ACTION.HOME,
                appId: appId,
                startTs: new Date(),
                userRole: user?.role,
            };

            //TODO: rm logging app page view
            // dispatch(
            //     // @ts-ignore
            //     setAppTimeLog(
            //         PageViewActions.VIEW_APP_DETAILS,
            //         appId,
            //         user?.id || "-1",
            //         params,
            //     ),
            // );

            params = { ...params, userId: user?.id, appId: appId };
            logPageView(PageViewActions.VIEW_APP_DETAILS, params);
        }
    };

    /******************* render ************************/

    // if (Object.keys(appsById).length < 1) {
    //     return <MyEmptyView showAsLoading={true} />;
    // }

    return (
        <Wrapper>
            <Input
                placeholder={"Search by name, category "}
                onPressEnter={e => handleSearch(e, false)}
                allowClear
                onChange={e => handleSearch(e, true)}
            />
            <ResText14Regular className={"text-grey2"}>
                Found{" "}
                <b>{showSearchRes ? searchApps.length : reduxApps.length}</b>{" "}
                {(showSearchRes ? searchApps : reduxApps).length > 1
                    ? "jokes"
                    : "joke"}
            </ResText14Regular>
            <ListContent>
                {/* loadApps*/}
                <Spin spinning={false}>
                    <List
                        dataSource={showSearchRes ? searchApps : reduxApps}
                        bordered={false}
                        renderItem={(app: any) => (
                            <Item>
                                <JokeCard joke={app} />
                            </Item>
                        )}
                    />
                    {!showSearchRes && (
                        <LoadMoreDiv
                            className={"h-centered-flex"}
                            onClick={() => lastPointer && handleLoadMore()}
                        >
                            <ResText14Regular
                                className={
                                    "text-grey2 " +
                                    (lastPointer ? "" : "disabled-cursor")
                                }
                            >
                                {lastPointer
                                    ? "Load more apps"
                                    : "End of the page"}
                            </ResText14Regular>
                        </LoadMoreDiv>
                    )}
                </Spin>
            </ListContent>
        </Wrapper>
    );
}
