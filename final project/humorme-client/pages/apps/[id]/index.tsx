import React from "react";
import AppInfo from "../../../containers/app/AppInfo";
import { ResText16Regular } from "../../../utils/TextUtils";
import AppRatingsReviews from "../../../containers/app/AppRatingsReviews";
import styled from "styled-components";
import { Divider } from "antd";
import { useSelector } from "react-redux";
import { selectApps } from "../../../redux/apps/reducer";
import Link from "next/link";
import { LeftOutlined } from "@ant-design/icons";
import AppScreenshots from "../../../containers/app/AppScreenshots";
import AppDesc from "../../../containers/app/AppDesc";
import AppExtraInfo from "../../../containers/app/AppExtraInfo";
import MyEmptyView from "../../../components/MyEmtpyView";
import withAppLoad from "../../../containers/WithAppLoad";

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
    const { app } = useSelector(selectApps);

    if (!app?.appId) return <MyEmptyView showAsLoading={true} />;

    return (
        <Wrapper>
            {BackIconWithText("/")}
            <AppInfo showRatings={true} />
            <Divider type={"horizontal"} />
            <AppScreenshots />
            <Divider type={"horizontal"} />
            <AppDesc />
            <Divider type={"horizontal"} />
            <AppRatingsReviews />
            <Divider type={"horizontal"} />
            <AppExtraInfo />
        </Wrapper>
    );
}

const WrappedPage = withAppLoad(Page);
export default WrappedPage;
// export async function getServerSideProps(context) {
//     return {
//         props: {},
//         // Disable server-side rendering for this page
//         // You can also try setting revalidate to a higher value
//         // if you want to use ISR (Incremental Static Regeneration)
//         // revalidate: 60
//         notFound: true, // Or use `notFound` if appropriate
//     };
// }
