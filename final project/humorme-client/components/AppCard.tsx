import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { ResText16Regular, ResText18SemiBold } from "../utils/TextUtils";
import { grey1 } from "../utils/ShadesUtils";
import { capitalize, toEndDottedStr } from "../utils/StringUtils";
import Link from "next/link";
import useDim from "../hooks/useDim";

const Wrapper = styled.div.attrs({
    className: "h-start-flex",
})`
    row-gap: 12px;
    column-gap: 24px;
    align-items: flex-start;
    color: ${grey1};

    .info-content {
        justify-content: start;
        row-gap: 12px;
        text-align: justify;
        column-gap: 12px;
    }

    @media (max-width: 540px) {
        align-items: center;
        justify-content: center;
        row-gap: 32px;
    }
`;

export default function AppCard({ app, onClickViewMore }) {
    const dataMap = app?.data || {};
    const { width } = useDim((deltaWidth, deltaHeight) => {});

    return (
        <Wrapper style={{ width: width - 55 }}>
            <Image
                width={120}
                height={120}
                // width={width < 480 ? width - 300 : 120}
                // height={width < 480 ? width - 300 : 120}
                src={dataMap["artworkUrl512"]}
                alt={"app-icon"}
                loader={() => dataMap["artworkUrl512"]}
            />

            <div
                className={"vertical-start-flex info-content"}
                style={{ width: width < 600 ? width - 20 : "75%" }}
            >
                <ResText18SemiBold>{capitalize(app?.name)}</ResText18SemiBold>
                <ResText16Regular>
                    {toEndDottedStr(
                        dataMap?.description || "",
                        width > 600 ? 250 : 150,
                    )}
                </ResText16Regular>
                <Link
                    href={`/apps/${app?.appId}`}
                    onClick={() => onClickViewMore(app?.appId)}
                >
                    <ResText16Regular className={"text-store-blue"}>
                        View more {">"}
                    </ResText16Regular>
                </Link>
            </div>
        </Wrapper>
    );
}
