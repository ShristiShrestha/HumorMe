import React, { useMemo } from "react";
import { UIJokeDetails } from "../models/dto/JokeDto";
import styled from "styled-components";
import { grey1, grey5, grey6 } from "../utils/ShadesUtils";
import {
    ResText16Regular,
    ResText18Regular,
    ResText24SemiBold,
} from "../utils/TextUtils";
import Image from "next/image";
import LeaveJokeRatings from "./LeaveJokeRatings";

const Wrapper = styled.div`
    width: 100%;
    row-gap: 12px;
    column-gap: 24px;
    align-items: flex-start;
    color: ${grey1};
    padding: 24px;
    border: 1px solid white;
    border-bottom: 1px solid ${grey6};

    .joke-content {
        justify-content: start;
        row-gap: 12px;
        text-align: justify;
        column-gap: 12px;
    }

    .joke-ratings {
        column-gap: 6px;
        row-gap: 8px;
        width: 100%;
    }

    :hover {
        border: 1px solid ${grey5};
        border-radius: 4px;
        box-shadow: 16px 6px 4px ${grey5};
    }

    @media (max-width: 540px) {
        align-items: center;
        justify-content: center;
        row-gap: 32px;
    }
`;

type Props = {
    joke: UIJokeDetails;
};
export default function JokeCard(props: Props) {
    const { joke } = props;

    const maxRating = useMemo(
        () =>
            Object.entries(joke.labelRatings).sort(
                (firstItem, secondItem) => secondItem[1] - firstItem[1],
            )[0],
        [joke.title],
    );

    console.log("max rating: ", maxRating);
    return (
        <Wrapper className={"vertical-start-flex"}>
            <div className={"vertical-start-flex joke-content"}>
                <ResText24SemiBold>
                    <Image
                        src={"/default_user.png"}
                        alt={"default user"}
                        width={20}
                        height={20}
                    />{" "}
                    {joke.title}
                </ResText24SemiBold>
                <ResText18Regular>{joke.text}</ResText18Regular>
            </div>
            <div className={"vertical-start-flex joke-ratings"}>
                <ResText16Regular className={"text-grey2 text-italic"}>
                    {/*{maxRating[1]} found this {maxRating[0]}*/}
                </ResText16Regular>
                <LeaveJokeRatings />
            </div>
        </Wrapper>
    );
}
