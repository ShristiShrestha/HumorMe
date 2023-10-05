import React from "react";
import { Tag } from "antd";
import { grey3 } from "../utils/ShadesUtils";

export function MeTag() {
    return (
        <Tag
            style={{
                marginLeft: 8,
                border: `1px solid ${grey3}`,
                background: "white",
                color: grey3,
            }}
        >
            me
        </Tag>
    );
}
