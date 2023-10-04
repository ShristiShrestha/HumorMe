import React from "react";
import { ResText14Regular, ResText16Regular } from "../utils/TextUtils";
import Image from "next/image";
import styled from "styled-components";
import { grey5, grey6 } from "../utils/ShadesUtils";

const Wrapper = styled.div`
    row-gap: 8px;
    padding: 24px;
    border: 1px solid white;
    border-bottom: 1px solid ${grey6};

    .comment-title {
        column-gap: 8px;
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

export default function CommentCard({ comment }) {
    const { text, user } = comment;

    return (
        <Wrapper className={"vertical-start-flex"}>
            <div className={"h-start-flex comment-title"}>
                <Image
                    src={"/default_user.png"}
                    alt={"default user"}
                    width={20}
                    height={20}
                />
                <ResText14Regular className={"text-grey1"}>
                    {user?.name}
                </ResText14Regular>
            </div>
            <ResText16Regular className={"text-grey2"}>
                {comment.text}
            </ResText16Regular>
        </Wrapper>
    );
}
