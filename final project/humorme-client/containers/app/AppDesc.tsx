import React from "react";
import { useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import styled from "styled-components";
import { Divider, Typography } from "antd";
import { ResText14Regular, ResText20SemiBold } from "../../utils/TextUtils";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    .break-text {
        white-space: break-spaces;
    }
`;

const NewRelease = styled.div.attrs({
    className: "vertical-start-flex",
})`
    row-gap: 16px;
`;

const { Paragraph } = Typography;

export default function AppDesc() {
    const { app } = useSelector(selectApps);
    const description = app?.meta?.desc || "";
    const releaseNote = app?.meta?.releaseNote || "";
    const version = app?.meta?.releaseVersion || "";

    return (
        <Wrapper>
            <Paragraph
                className={"wrap-word break-text"}
                ellipsis={{
                    rows: 2,
                    expandable: true,
                    symbol: (
                        <ResText14Regular className={"text-store-blue"}>
                            show more
                        </ResText14Regular>
                    ),
                }}
            >
                {description}
            </Paragraph>
            <Divider />
            <NewRelease>
                <div className={"h-justified-flex"}>
                    <ResText20SemiBold>What's New</ResText20SemiBold>
                    <ResText14Regular className={"text-store-blue"}>
                        Version History
                    </ResText14Regular>
                </div>
                <div className={"h-justified-flex new-release-notes"}>
                    <ResText14Regular className={"wrap-word break-text"}>
                        {releaseNote}
                    </ResText14Regular>
                    <ResText14Regular className={"text-grey3"}>
                        Version {version}
                    </ResText14Regular>
                </div>
            </NewRelease>
        </Wrapper>
    );
}
