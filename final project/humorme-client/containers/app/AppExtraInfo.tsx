import React from "react";
import styled from "styled-components";
import { ResText14Regular, ResText20SemiBold } from "../../utils/TextUtils";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import { ArrowUpOutlined } from "@ant-design/icons";

const Wrapper = styled.div.attrs({
    className: "vertical-start-flex",
})`
    width: 100%;
    row-gap: 12px;

    .extra-info-item {
        row-gap: 4px;
    }

    .external-links {
        column-gap: 24px;
        row-gap: 12px;
    }
`;

export default function AppExtraInfo() {
    const { app } = useSelector(selectApps);

    const linkContent = [
        {
            title: "Developer Website",
            url: app?.meta?.sellerUrl,
        },
        {
            title: "View in AppStore",
            url: app?.meta?.sellerUrl,
        },
    ];

    const content = [
        {
            title: "Provider",
            content: app?.meta?.sellerName || "N/A",
        },
        {
            title: "Size",
            content: app?.meta?.sizeText || "0B",
        },
        {
            title: "Category",
            content: app?.primaryGenre || "",
        },
    ];

    return (
        <Wrapper>
            <ResText20SemiBold>Information</ResText20SemiBold>
            <Row className={"full-width"} gutter={[12, 12]}>
                {content.map((item, index) => (
                    <Col key={"extra-info-" + index} md={8} sm={24}>
                        <div
                            className={
                                "vertical-start-flex extra-info-item full-width"
                            }
                        >
                            <ResText14Regular className={"text-grey2"}>
                                {item.title}
                            </ResText14Regular>
                            <ResText14Regular>{item.content}</ResText14Regular>
                        </div>
                    </Col>
                ))}
            </Row>
            <div className={"centered-flex medium-vertical-margin"}>
                <div className={"h-start-flex external-links"}>
                    {linkContent.map((item, index) => (
                        <a
                            key={"link-app-" + index}
                            href={item.url}
                            target={"_blank"}
                        >
                            <ResText14Regular className={"text-store-blue"}>
                                {item.title} <ArrowUpOutlined rotate={30} />
                            </ResText14Regular>
                        </a>
                    ))}
                </div>
            </div>
        </Wrapper>
    );
}
