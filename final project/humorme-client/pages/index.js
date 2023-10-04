import React from "react";
import styled from "styled-components";
import JokesList from "../containers/jokes/JokesList";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/auth/reducer";
import PostJoke from "../containers/jokes/PostJoke";

/* styled components */
const Wrapper = styled.div.attrs({
    className: "vertical-start-flex",
})`
    height: calc(100vh - 110px);
    padding-top: 24px;
    row-gap: 24px;
    overflow-y: hidden;
`;

export default function Home() {
    const { loggedIn } = useSelector(selectAuth);

    return (
        <Wrapper>
            {loggedIn && <PostJoke />}
            <JokesList />
        </Wrapper>
    );
}
