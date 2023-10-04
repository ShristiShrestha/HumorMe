import React from "react";
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
    const { app, myJokesRatingsByIds } = useSelector(selectApps);

    if (!app?.id) return <MyEmptyView showAsLoading={true} />;

    return (
        <Wrapper>
            {BackIconWithText("/")}
            <JokeCard
                joke={app}
                showViewComments={false}
                myRating={
                    myJokesRatingsByIds &&
                    Object.keys(myJokesRatingsByIds).length > 0
                        ? myJokesRatingsByIds[app.id]
                        : undefined
                }
            />

            <ViewComments />
        </Wrapper>
    );
}

const WrappedPage = withAppLoad(Page);
export default WrappedPage;
