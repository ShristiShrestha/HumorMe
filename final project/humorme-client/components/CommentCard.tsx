import React from "react";
import { ResText14Regular, ResText16Regular } from "../utils/TextUtils";
import Image from "next/image";
import styled from "styled-components";
import { grey6 } from "../utils/ShadesUtils";
import { Divider } from "antd";
import { toMonthDateStr } from "../utils/DateUtils";
import { MeTag } from "./MeTag";
import Link from "next/link";

const Wrapper = styled.div`
    row-gap: 24px;
    padding: 28px 24px;
    border-bottom: 1px solid ${grey6};

    .comment-title {
        column-gap: 8px;
    }

    :hover {
        border-radius: 4px;
        background: #fcfcfc;
    }

    @media (max-width: 540px) {
        align-items: center;
        justify-content: center;
        row-gap: 32px;
    }
`;

export default function CommentCard({ comment, loggedUser }) {
    const { text, user, createdAt } = comment;

    return (
        <Wrapper className={"vertical-start-flex"}>
            <div className={"h-start-flex comment-title"}>
                <Image
                    src={"/default_user.png"}
                    alt={"default user"}
                    width={20}
                    height={20}
                />
                <Link href={`/users/${user?.id}`}>
                    <ResText14Regular className={"text-grey1"}>
                        {user?.name}
                        {user?.id === loggedUser?.id && <MeTag />}
                    </ResText14Regular>
                </Link>
                <Divider type={"vertical"} />
                <ResText14Regular className={"text-grey3"}>
                    {toMonthDateStr(new Date(createdAt))}
                </ResText14Regular>
            </div>
            <ResText16Regular className={"text-grey2"}>{text}</ResText16Regular>
        </Wrapper>
    );
}
