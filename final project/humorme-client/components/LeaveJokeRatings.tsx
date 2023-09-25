import React from "react";
import styled from "styled-components";
import { JokeRatingLevels } from "../models/enum/JokeEnum";
import { ResText14Regular } from "../utils/TextUtils";
import { grey2, grey6, pearl } from "../utils/ShadesUtils";
import MyButton, { MyButtonType } from "./MyButton";

const Wrapper = styled.div`
    position: relative;
    width: 100%;

    .leave-ratings {
        column-gap: 6px;
        row-gap: 6px;
    }
`;

const ClickItem = styled.div`
    padding: 4px 8px;
    color: ${grey2};
    border: 1px solid ${grey6};
    background: ${pearl};

    :hover {
        background: ${grey2};
        color: white;
        cursor: pointer;
    }
`;
export default function LeaveJokeRatings() {
    return (
        <Wrapper className={"h-justified-flex"}>
            <div className={"h-start-flex leave-ratings"}>
                <ResText14Regular className={"text-grey3"}>
                    Rate this{" "}
                </ResText14Regular>
                {Object.values(JokeRatingLevels).map(item => (
                    <ClickItem key={"rate-level-" + item}>
                        <ResText14Regular>
                            {item.toLowerCase()}
                        </ResText14Regular>
                    </ClickItem>
                ))}
            </div>
            <MyButton
                text={"comment"}
                btnType={MyButtonType.secondary}
                onClick={() => {}}
            />
        </Wrapper>
    );
}
