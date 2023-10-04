import React from "react";
import { StarFilled } from "@ant-design/icons";
import styled from "styled-components";
import { grey3, grey6 } from "../utils/ShadesUtils";

const ratingScaleWidth = 300;
const ratingScaleHeight = 1.5;

const Wrapper = styled.div<{
    ratingScaleWidth?: number;
}>`
    max-width: 400px;

    .rating-item {
        column-gap: 12px;
    }

    .per-rating-stars {
        column-gap: 2px;
    }

    .rating-scale {
        width: ${props => (props.ratingScaleWidth || ratingScaleWidth) + "px"};
        border-radius: 4px;
        height: ${ratingScaleHeight}px;
        background: ${grey6};
    }

    .anticon {
        font-size: 10px;
        color: ${grey3};
    }

    @media (max-width: 540px) {
        width: 100% !important;
        max-width: 100% !important;

        .rating-scale {
            width: 60%;
        }
    }
`;

const RatingNumUsers = styled.div<{
    users: number;
    ratingScaleWidth?: number;
}>`
    width: ${props =>
        (props.ratingScaleWidth || ratingScaleWidth) * props.users + "px"};
    height: ${ratingScaleHeight}px;
    border-radius: 4px;
    background: ${grey3};

    @media (max-width: 540px) {
        width: ${props => `${100 * props.users}%`};
    }
`;

export default function StarRatings(props) {
    const { starRatings } = props;

    return (
        <Wrapper {...props}>
            {Object.keys(starRatings)
                .sort()
                .reverse()
                .map((item, itemKey) => (
                    <div
                        key={"jokes-rating-" + itemKey}
                        className={"h-end-flex rating-item"}
                    >
                        <span className={"h-end-flex per-rating-stars"}>
                            {[...Array(parseInt(item)).keys()].map(
                                ratingKey => (
                                    <StarFilled
                                        key={"jokes-rating-ratio-" + ratingKey}
                                    />
                                ),
                            )}
                        </span>

                        <div className={"rating-scale"}>
                            <RatingNumUsers users={starRatings[item]} />
                        </div>
                    </div>
                ))}
        </Wrapper>
    );
}
