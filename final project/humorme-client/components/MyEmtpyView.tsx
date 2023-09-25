import React from "react";
import styled from "styled-components";
import { ResText14Regular } from "../utils/TextUtils";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const Wrapper = styled.div`
    position: relative;
    height: calc(100vh - 100px);
    width: 100%;
    overflow: hidden;
`;
export default function MyEmptyView({ showAsLoading }) {
    return (
        <Wrapper className={"centered-flex"}>
            <ResText14Regular className={"text-grey3"}>
                {showAsLoading ? (
                    <>
                        <LoadingOutlined style={{ marginRight: 6 }} />
                        Loading...
                    </>
                ) : (
                    <>
                        <ExclamationCircleOutlined style={{ marginRight: 6 }} />
                        404 Page
                    </>
                )}
            </ResText14Regular>
        </Wrapper>
    );
}
