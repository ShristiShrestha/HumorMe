/* styled tokens */
import styled from "styled-components";
import { grey3 } from "../utils/ShadesUtils";
import { Text16Regular } from "../utils/TextUtils";
import * as React from "react";

const Wrapper = styled.div.attrs({
    className: "centered-flex",
})`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: calc(100vh - 75px);
    overflow: hidden;
    background: white;

    text {
        color: ${grey3};
    }
`;

export default function MyLoading() {
    return (
        <Wrapper>
            <Text16Regular>Hold your horses, soldier...</Text16Regular>
        </Wrapper>
    );
}
