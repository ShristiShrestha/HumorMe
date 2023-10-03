import React from "react";
import styled from "styled-components";
import { JokeRatingLevels } from "../models/enum/JokeEnum";
import { ResText14Regular } from "../utils/TextUtils";
import { grey2, grey6, pearl } from "../utils/ShadesUtils";
import MyButton, { MyButtonType } from "./MyButton";
import { postJokeRating } from "../axios/JokesApi";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setApp } from "../redux/apps/actions";
import { UIJokeDetails } from "../models/dto/JokeDto";
import { selectAuth } from "../redux/auth/reducer";
import CommentJoke from "../containers/jokes/CommentJoke";

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
export default function LeaveJokeRatings({ joke }) {
    const dispatch = useDispatch();
    const { id } = joke;

    const handleRating = (e, label: JokeRatingLevels) => {
        e.preventDefault();
        e.stopPropagation();
        // @ts-ignore
        postJokeRating(id, label).then(joke => dispatch(setApp(joke)));
    };

    return (
        <Wrapper className={"h-justified-flex"}>
            <div className={"h-start-flex leave-ratings"}>
                <ResText14Regular className={"text-grey3"}>
                    Rate this{" "}
                </ResText14Regular>
                {Object.values(JokeRatingLevels).map(item => (
                    <ClickItem
                        key={"rate-level-" + item}
                        onClick={e => handleRating(e, item)}
                    >
                        <ResText14Regular>
                            {item.toLowerCase()}
                        </ResText14Regular>
                    </ClickItem>
                ))}
            </div>
            <CommentJoke joke={joke} />
        </Wrapper>
    );
}
