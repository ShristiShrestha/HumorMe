import styled from "styled-components";
import { Text12Regular } from "../utils/TextUtils";
import * as React from "react";
import { CSSProperties } from "react";

/* styled tokens */
const TagSpan = styled.span``;

/* type definition */
type Props = {
    text: string;
    onClick?: Function;
    tagStyle?: CSSProperties;
    tagTextStyle?: CSSProperties;
};

export default function MyTag(props: Props) {
    const { text, onClick, tagTextStyle, tagStyle } = props;
    return (
        <TagSpan
            style={tagStyle}
            onClick={(...args) => onClick && onClick(...args)}
        >
            <Text12Regular style={tagTextStyle}>{text}</Text12Regular>
        </TagSpan>
    );
}
