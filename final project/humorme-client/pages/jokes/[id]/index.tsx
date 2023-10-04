import React, { useMemo } from "react";
import { ResText16Regular } from "../../../utils/TextUtils";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectApps } from "../../../redux/apps/reducer";
import Link from "next/link";
import { LeftOutlined } from "@ant-design/icons";
import MyEmptyView from "../../../components/MyEmtpyView";
import withAppLoad from "../../../containers/WithAppLoad";
import ViewComments from "../../../containers/comments/ViewComments";
import JokeCard from "../../../components/JokeCard";
import { useRouter } from "next/router";
import { isString } from "lodash";

const Wrapper = styled.div.attrs({
    className: "vertical-start-flex",
})`
    height: calc(100vh - 110px);
    position: relative;
    overflow-y: auto;
    row-gap: 16px;
    padding-bottom: 24px;
`;

const BackIcon = styled.div`
    margin: 12px 0;
`;

export const BackIconWithText = (backTo: string, title?: string) => (
    <BackIcon>
        <Link href={backTo}>
            <ResText16Regular className={"text-store-blue"}>
                <LeftOutlined />
                {title ? " Back to " + title : "Back"}
            </ResText16Regular>
        </Link>
    </BackIcon>
);

function Page() {
    const router = useRouter();
    const { id } = router.query;
    const { app, myJokesRatingsByIds, appsById } = useSelector(selectApps);
    const viewJoke = useMemo(
        () => (id ? appsById[parseInt(id?.toString())] || app : app),
        [id, app?.id, Object.keys(appsById)],
    );

    if (viewJoke == undefined) return <MyEmptyView showAsLoading={true} />;

    return (
        <Wrapper>
            {BackIconWithText("/")}
            <JokeCard
                joke={viewJoke}
                showViewComments={false}
                myRating={
                    myJokesRatingsByIds &&
                    Object.keys(myJokesRatingsByIds).length > 0
                        ? myJokesRatingsByIds[viewJoke.id]
                        : undefined
                }
            />

            <ViewComments />
        </Wrapper>
    );
}

const WrappedPage = withAppLoad(Page);
export default WrappedPage;
