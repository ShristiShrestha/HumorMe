import React, { useMemo } from "react";
import { UIJokeDetails } from "../models/dto/JokeDto";
import styled from "styled-components";
import {
    crimson,
    grey1,
    grey3,
    grey5,
    grey6,
    lightRed,
} from "../utils/ShadesUtils";
import {
    ResText14Regular,
    ResText14SemiBold,
    ResText16Regular,
    ResText24SemiBold,
} from "../utils/TextUtils";
import { UIRatingDetails } from "../models/dto/CommentDto";
import Image from "next/image";
import { toMonthDateStr } from "../utils/DateUtils";
import Link from "next/link";
import { sum } from "lodash";
import { Button, Divider, Popconfirm, Tag } from "antd";
import { CommentOutlined, SmileOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/auth/reducer";
import { getTruncVal } from "../utils/StringUtils";
import { MeTag } from "./MeTag";
import { useRouter } from "next/router";
import LeaveJokeRatings from "./LeaveJokeRatings";

const Wrapper = styled.div`
    width: 100%;
    row-gap: 32px;
    column-gap: 24px;
    align-items: flex-start;
    color: ${grey1};
    padding: 24px;
    background: #fcfcfc;
    // border: 1px solid ${grey6};
    border-bottom: 1px solid ${grey6};

    .joke-title-user {
        column-gap: 8px;
    }

    .joke-content {
        justify-content: start;
        row-gap: 8px;
        text-align: justify;
        column-gap: 12px;
    }

    .joke-ratings {
        column-gap: 16px;
        row-gap: 28px;
        width: 100%;
    }

    .btn-danger {
        border: 1px solid ${crimson};
        color: ${crimson};
        background: ${lightRed};
    }

    .joke-actions {
        column-gap: 12px;
    }

    :hover {
        // border: 1px solid ${grey5};
        border-radius: 4px;
        background: #fcfcfc !important;
        // box-shadow: 16px 6px 4px ${grey5};

        .view-comments-link {
            background: white;
        }
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
    handleDelete?: Function;
};
export default function JokeCard(props: Props) {
    const { loggedIn, user } = useSelector(selectAuth);
    const { joke, myRating, showViewComments, handleDelete } = props;
    const router = useRouter();

    const labels = useMemo(
        () => (joke && joke.labels ? joke.labels.split(",") : []),
        [joke.id],
    );

    const totalRating = useMemo(
        () =>
            sum(
                joke && joke.labelRatings
                    ? Object.values(joke.labelRatings)
                    : [],
            ),
        [joke?.id, joke && Object.values(joke.labelRatings)],
    );
    const maxRating = useMemo(
        () =>
            joke && joke.labelRatings
                ? Object.entries(joke.labelRatings).sort(
                      (firstItem, secondItem) => secondItem[1] - firstItem[1],
                  )[0]
                : [],
        [joke?.id, joke && Object.values(joke.labelRatings)],
    );

    const cardTitle = (
        <div className={"h-justified-flex joke-title"}>
            <span className={"h-start-flex joke-title-user"}>
                <Image
                    src={"/default_user.png"}
                    alt={"default user"}
                    width={20}
                    height={20}
                />
                <Link href={`/users/${joke.user.id}`}>
                    <ResText14Regular className={"text-grey3"}>
                        {joke.user.name}
                        {loggedIn &&
                            user?.id &&
                            user?.id === joke?.user?.id && <MeTag />}
                    </ResText14Regular>
                </Link>
            </span>
            <span className={"h-start-flex joke-actions"}>
                <ResText14Regular className={"text-grey2 text-italic"}>
                    {toMonthDateStr(new Date(joke.createdAt))}
                </ResText14Regular>
                {loggedIn &&
                    user?.id &&
                    joke &&
                    router.pathname.includes("users") &&
                    user?.id === joke?.user?.id && (
                        <Popconfirm
                            title="Caution"
                            description={
                                <div className={"vertical-start-flex"}>
                                    <ResText14Regular className={"text-grey2"}>
                                        It will remove all comments and ratings
                                        associated with this joke.
                                    </ResText14Regular>
                                    <ResText14SemiBold className={"text-grey2"}>
                                        Are you sure to remove this joke?
                                    </ResText14SemiBold>
                                </div>
                            }
                            onConfirm={e => {
                                if (e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDelete && handleDelete(joke.id);
                                }
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                className={"btn-danger"}
                                type={"default"}
                                onChange={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                            >
                                remove
                            </Button>
                        </Popconfirm>
                    )}
            </span>
        </div>
    );

    const cardRatings = (
        <div className={"vertical-start-flex joke-ratings"}>
            {(totalRating > 0 ||
                (joke?.totalComments && joke?.totalComments > 0)) && (
                <span>
                    {/* total ratings */}
                    {totalRating > 0 && (
                        <>
                            <ResText16Regular>
                                <SmileOutlined
                                    style={{
                                        marginRight: 6,
                                        color: grey3,
                                    }}
                                />
                                {totalRating}
                            </ResText16Regular>{" "}
                            {/*<Divider type={"vertical"} />*/}
                        </>
                    )}

                    {/* total text comments */}
                    {joke?.totalComments && joke?.totalComments > 0 && (
                        <>
                            <Divider type={"vertical"} />
                            <ResText16Regular>
                                <CommentOutlined
                                    style={{
                                        marginRight: 6,
                                        color: grey3,
                                    }}
                                />
                                {joke.totalComments}
                            </ResText16Regular>
                            {/*<Divider type={"vertical"} />*/}
                        </>
                    )}

                    {/* max people rating */}
                    {maxRating &&
                        maxRating?.length > 1 &&
                        totalRating > 0 &&
                        maxRating[1] < totalRating && (
                            <>
                                <Divider type={"vertical"} />
                                <ResText16Regular className={"text-grey2"}>
                                    {getTruncVal(
                                        100 * (maxRating[1] / totalRating),
                                    )}
                                    % found this{" "}
                                    {maxRating[0]
                                        ?.replace("=", "")
                                        ?.toLowerCase()}
                                </ResText16Regular>
                                {/*<Divider type={"vertical"} />*/}
                            </>
                        )}

                    {/* your rating */}
                    {myRating && (
                        <>
                            <Divider type={"vertical"} />
                            <ResText14Regular className={"text-grey3"}>
                                You found this{" "}
                                <i className={"text-grey2"}>
                                    {myRating?.label
                                        ?.toLowerCase()
                                        ?.replace("=", "")}
                                </i>
                            </ResText14Regular>
                        </>
                    )}
                </span>
            )}

            {labels.length > 0 && (
                <div className={"h-start-flex"}>
                    {labels.map(item => (
                        <Tag key={"joke-" + item}>{item.toLowerCase()}</Tag>
                    ))}
                </div>
            )}

            {loggedIn && user?.id && joke?.user?.id !== user?.id && (
                <LeaveJokeRatings
                    joke={joke}
                    myRating={myRating}
                    showViewComments={showViewComments}
                />
            )}
        </div>
    );

    const cardWrapper = (
        <Wrapper
            className={"vertical-start-flex"}
            style={{
                background: router.pathname.includes("jokes")
                    ? "#fcfcfc"
                    : "white",
            }}
        >
            {cardTitle}
            <div className={"vertical-start-flex joke-content"}>
                <Link href={`/jokes/${joke?.id}`}>
                    <ResText24SemiBold className={"text-grey2"}>
                        {joke.text}
                    </ResText24SemiBold>
                </Link>
            </div>

            {cardRatings}
        </Wrapper>
    );

    // if (router.pathname.includes("jokes")) return cardWrapper;
    // return (
    //     <Link href={`/jokes/${joke?.id}`} className={"full-width"}>
    //         {cardWrapper}
    //     </Link>
    // );
    return cardWrapper;
}
