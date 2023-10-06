import React from "react";
import { Tag } from "antd";
import { grey3 } from "../utils/ShadesUtils";
import { ResText12Regular } from "../utils/TextUtils";

export function MeTag() {
    return (
        <Tag
            style={{
                lineHeight: "unset",
                width: "fit-content",
                padding: "0px 3px",
                marginLeft: 8,
                border: `1px solid ${grey3}`,
                background: "white",
                color: grey3,
            }}
        >
            <ResText12Regular className={"text-grey3"}>me</ResText12Regular>
        </Tag>
    );
}
