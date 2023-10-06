import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import { Input, List } from "antd";
import { ResText14Regular } from "../../utils/TextUtils";
import { grey3, grey5 } from "../../utils/ShadesUtils";
import JokeCard from "../../components/JokeCard";
import { fetchApps } from "../../redux/apps/actions";
import { deleteJoke } from "../../axios/JokesApi";
import { openNotification } from "../../utils/NotificationUtils";
import { NotificationEnum } from "../../models/enum/NotificationEnum";
import { isString } from "lodash";
import { useRouter } from "next/router";

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

export default function JokesList({ showSearch }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const { appsById, myJokesRatingsByIds } = useSelector(selectApps);

    /******************* memoized variables ************************/

    const reduxApps = useMemo(
        () =>
            Object.values(appsById).sort(
                (first, second) =>
                    new Date(second["createdAt"]).getTime() -
                    new Date(first["createdAt"]).getTime(),
            ) || [],
        [Object.keys(appsById), Object.keys(appsById).length],
    );

    /******************* event handlers ************************/

    const handleSearch = (e: any, shouldFetch: boolean) => {
        const query = e.target.value;
        const params = {
            text: e.target.value,
        };
        if (shouldFetch) {
            // @ts-ignore
            dispatch(fetchApps(params, true));
        }
        setSearchQuery(query);
        // if (searchQuery.length < 1 && query.length > 0) {
        //     setSearchQuery(query);
        // } else if (searchQuery.length > 1 && query.length < 1) {
        //     setSearchQuery(query);
        // }
    };

    const handleDeleteJoke = (jokeId: number) => {
        deleteJoke(jokeId)
            .then(res => {
                openNotification(
                    "Remove success",
                    "You have successfully removed your joke.",
                    NotificationEnum.SUCCESS,
                );

                if (
                    router.query?.id &&
                    isString(router.query.id) &&
                    router.pathname.includes("users")
                ) {
                    const userId = router.query.id;
                    // @ts-ignore
                    dispatch(fetchApps({ userId: userId }, true));
                }
            })
            .catch(err => {});
    };

    /******************* use effects ************************/

    useEffect(() => {
        if (searchQuery.length < 1) {
            // @ts-ignore
            dispatch(fetchApps({}, true));
        }
    }, [searchQuery.length]);

    /******************* render ************************/

    // if (Object.keys(appsById).length < 1) {
    //     // eslint-disable-next-line react/jsx-no-undef
    //     return <MyEmptyView showAsLoading={true} />;
    // }

    return (
        <Wrapper>
            {showSearch && (
                <>
                    <Input
                        placeholder={"Search by joke, author, label... "}
                        onPressEnter={e => handleSearch(e, true)}
                        onChange={e => handleSearch(e, false)}
                        allowClear
                    />
                    <ResText14Regular className={"text-grey2"}>
                        Found <b>{reduxApps.length}</b>{" "}
                        {reduxApps.length > 1 ? "jokes" : "joke"}
                    </ResText14Regular>
                </>
            )}
            <ListContent>
                <List
                    dataSource={reduxApps}
                    bordered={false}
                    renderItem={(app: any) => (
                        <Item>
                            <JokeCard
                                joke={app}
                                showViewComments={true}
                                handleDelete={id => handleDeleteJoke(id)}
                                myRating={
                                    myJokesRatingsByIds &&
                                    Object.keys(myJokesRatingsByIds).length > 0
                                        ? myJokesRatingsByIds[app.id]
                                        : undefined
                                }
                            />
                        </Item>
                    )}
                />
            </ListContent>
        </Wrapper>
    );
}
