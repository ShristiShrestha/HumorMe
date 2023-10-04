import React, { useMemo } from "react";
import { selectApps } from "../../redux/apps/reducer";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Image from "next/image";
import { ResText20SemiBold } from "../../utils/TextUtils";

const Wrapper = styled.div.attrs({
    className: "vertical-start-flex",
})`
    position: relative;
    row-gap: 16px;
    width: 100%;
    overflow-x: scroll;
    min-height: 400px;
`;

const ScrollScreens = styled.div`
    position: relative;
    display: flex;
    column-gap: 20px;
    min-height: fit-content;

    img {
        border-radius: 16px;
    }
`;
export default function AppScreenshots() {
    const { app } = useSelector(selectApps);
    const screenshotsUrl = useMemo(
        () => app?.meta?.screenshotsUrl || [],
        [app?.appId],
    );

    return (
        <Wrapper>
            <ResText20SemiBold>Screenshots</ResText20SemiBold>
            <ScrollScreens>
                {screenshotsUrl.map((item, index) => (
                    <Image
                        key={"app-screenshot-" + index}
                        src={item}
                        alt={"jokes-screenshots"}
                        width={200}
                        height={360}
                    />
                ))}
            </ScrollScreens>
        </Wrapper>
    );
}
