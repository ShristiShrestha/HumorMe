import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import { Input, List, Spin } from "antd";
import { ResText14Regular } from "../../utils/TextUtils";
import { grey3, grey5 } from "../../utils/ShadesUtils";
import { selectAuth } from "../../redux/auth/reducer";
import JokeCard from "../../components/JokeCard";
import MyEmptyView from "../../components/MyEmtpyView";

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
    const { appsById, searchAppsById, myJokesRatingsByIds } =
        useSelector(selectApps);
    const { user } = useSelector(selectAuth);
    const [showSearchRes, setShowSearchRes] = useState(false);
    const [loadApps, setLoadApps] = useState(false);

    /******************* memoized variables ************************/

    const searchApps = useMemo(
        () => Object.values(searchAppsById) || [],
        [showSearchRes, Object.keys(searchAppsById)],
    );

    const reduxApps = useMemo(
        () =>
            Object.values(appsById).sort(
                (first, second) =>
                    new Date(second["createdAt"]).getTime() -
                    new Date(first["createdAt"]).getTime(),
            ) || [],
        [Object.keys(appsById)],
    );

    /******************* event handlers ************************/
    const handleSearch = (e, textCleared: boolean) => {
        const text = e.target.value;

        if (text.length < 1) {
            return setShowSearchRes(false);
        }

        if (textCleared) return;

        setLoadApps(true);
        dispatch(
            // @ts-ignore
            fetchSearchApps(text, undefined, undefined, () => {
                setShowSearchRes(true);
                setLoadApps(false);
            }),
        );
    };

    /******************* render ************************/

    if (Object.keys(appsById).length < 1) {
        // eslint-disable-next-line react/jsx-no-undef
        return <MyEmptyView showAsLoading={true} />;
    }

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
                                <JokeCard
                                    joke={app}
                                    showViewComments={true}
                                    myRating={
                                        myJokesRatingsByIds &&
                                        Object.keys(myJokesRatingsByIds)
                                            .length > 0
                                            ? myJokesRatingsByIds[app.id]
                                            : undefined
                                    }
                                />
                            </Item>
                        )}
                    />
                </Spin>
            </ListContent>
        </Wrapper>
    );
}
