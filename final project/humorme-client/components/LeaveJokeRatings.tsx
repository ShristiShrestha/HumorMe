import React from "react";
import styled from "styled-components";
import { JokeRatingLevels } from "../models/enum/JokeEnum";
import { ResText14Regular } from "../utils/TextUtils";
import {
    amethyst,
    grey2,
    grey3,
    grey6,
    pearl,
    snow,
} from "../utils/ShadesUtils";
import { postJokeRating } from "../axios/JokesApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyJokeRatings, setApp } from "../redux/apps/actions";
import Link from "next/link";
import { selectAuth } from "../redux/auth/reducer";
import { selectApps } from "../redux/apps/reducer";
import { UIJokeDetails } from "../models/dto/JokeDto";
import { UIRatingDetails } from "../models/dto/CommentDto";

const Wrapper = styled.div`
    position: relative;
    width: 100%;

    .leave-ratings {
        column-gap: 6px;
        row-gap: 6px;
    }

    .my-label {
        background: ${grey2};
        color: white;
        cursor: pointer;
    }

    .view-comments-link {
        padding: 6px 12px;
        color: ${grey3};
        border: 1px solid white;

        :hover {
            border-radius: 4px;
            border: 1px solid ${grey3};
            color: ${grey2} !important;
        }
    }
`;

const ClickItem = styled.div`
    padding: 4px 8px;
    color: ${grey2};
    border: 1px solid ${grey6};
    background: ${pearl};
    border-radius: 4px;

    :hover {
        background: ${grey2};
        color: white;
        cursor: pointer;
    }
`;

type Props = {
    joke: UIJokeDetails;
    myRating?: UIRatingDetails;
    showViewComments: boolean;
};

export default function LeaveJokeRatings(props: Props) {
    const dispatch = useDispatch();
    const { joke, myRating, showViewComments } = props;
    const { id } = joke;
    const { user, loggedIn } = useSelector(selectAuth);
    const {} = useSelector(selectApps);

    /******************* handlers ************************/
    const handleRating = (e, label: JokeRatingLevels) => {
        e.preventDefault();
        e.stopPropagation();

        postJokeRating(id, label).then((rating: UIRatingDetails) => {
            // @ts-ignore
            dispatch(setApp(rating.joke));
            // @ts-ignore
            dispatch(fetchMyJokeRatings());
        });
    };
    /******************* render ************************/

    return (
        <Wrapper className={"h-justified-flex"}>
            <div className={"h-start-flex leave-ratings"}>
                <ResText14Regular className={"text-grey3"}>
                    Rate this{" "}
                </ResText14Regular>
                {Object.values(JokeRatingLevels).map(item => (
                    <ClickItem
                        className={
                            myRating?.label?.toLowerCase()?.replace("=", "") ==
                            item.toLowerCase()
                                ? "my-label"
                                : ""
                        }
                        key={"rate-level-" + item}
                        onClick={e => handleRating(e, item)}
                    >
                        <ResText14Regular>
                            {item.toLowerCase()}
                        </ResText14Regular>
                    </ClickItem>
                ))}
            </div>

            {/*{showViewComments && (*/}
            {/*    <Link href={`/jokes/${id}`} className={"view-comments-link"}>*/}
            {/*        <ResText14Regular>view more</ResText14Regular>*/}
            {/*    </Link>*/}
            {/*)}*/}
        </Wrapper>
    );
}
