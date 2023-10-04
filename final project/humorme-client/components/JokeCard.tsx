import React, { useMemo } from "react";
import { UIJokeDetails } from "../models/dto/JokeDto";
import styled from "styled-components";
import { grey1, grey5, grey6 } from "../utils/ShadesUtils";
import {
    ResText14Regular,
    ResText16Regular,
    ResText24SemiBold,
} from "../utils/TextUtils";
import LeaveJokeRatings from "./LeaveJokeRatings";
import { UIRatingDetails } from "../models/dto/CommentDto";
import Image from "next/image";
import { toMonthDateStr } from "../utils/DateUtils";

const Wrapper = styled.div`
    width: 100%;
    row-gap: 24px;
    column-gap: 24px;
    align-items: flex-start;
    color: ${grey1};
    padding: 24px;
    // border: 1px solid ${grey6};
    border-bottom: 1px solid ${grey6};

    .joke-title-user {
        column-gap: 8px;
    }

    .joke-content {
        justify-content: start;
        row-gap: 12px;
        text-align: justify;
        column-gap: 12px;
    }

    .joke-ratings {
        column-gap: 12px;
        row-gap: 16px;
        width: 100%;
    }

    :hover {
        // border: 1px solid ${grey5};
        border-radius: 4px;
        background: #fcfcfc;
        // box-shadow: 16px 6px 4px ${grey5};
    }

    @media (max-width: 540px) {
        align-items: center;
        justify-content: center;
        row-gap: 32px;
    }
`;

type Props = {
    joke: UIJokeDetails;
    myRating?: UIRatingDetails;
    showViewComments: boolean;
};
export default function JokeCard(props: Props) {
    const { joke, myRating, showViewComments } = props;

    const maxRating = useMemo(
        () =>
            joke && joke.labelRatings
                ? Object.entries(joke.labelRatings).sort(
                      (firstItem, secondItem) => secondItem[1] - firstItem[1],
                  )[0]
                : [],
        [joke.labelRatings],
    );

    return (
        <Wrapper className={"vertical-start-flex"}>
            <div className={"h-justified-flex joke-title"}>
                <span className={"h-start-flex joke-title-user"}>
                    <Image
                        src={"/default_user.png"}
                        alt={"default user"}
                        width={20}
                        height={20}
                    />
                    <ResText14Regular className={"text-grey3"}>
                        {joke.user.name}
                    </ResText14Regular>
                </span>
                <ResText14Regular className={"text-grey2 text-italic"}>
                    {toMonthDateStr(new Date(joke.createdAt))}
                </ResText14Regular>
            </div>
            <div className={"vertical-start-flex joke-content"}>
                <ResText24SemiBold>{joke.text}</ResText24SemiBold>
                {/*<ResText18Regular>{joke.text}</ResText18Regular>*/}
            </div>
            <div className={"vertical-start-flex joke-ratings"}>
                {maxRating && maxRating?.length > 1 && (
                    <ResText16Regular className={"text-grey2 text-italic"}>
                        {maxRating[1]} people found this{" "}
                        {maxRating[0]?.replace("=", "")?.toLowerCase()}
                    </ResText16Regular>
                )}
                <LeaveJokeRatings
                    joke={joke}
                    myRating={myRating}
                    showViewComments={showViewComments}
                />
            </div>
        </Wrapper>
    );
}
