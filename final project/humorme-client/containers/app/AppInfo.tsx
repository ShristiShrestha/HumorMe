import React from "react";
import Image from "next/image";
import {
    ResText12Regular,
    ResText14Regular,
    ResText16Regular,
    ResText20SemiBold,
} from "../../utils/TextUtils";
import styled from "styled-components";
import FiveStars from "../../components/FiveStars";
import { useSelector } from "react-redux";
import { selectApps } from "../../redux/apps/reducer";
import { capitalize } from "../../utils/StringUtils";
import { grey3 } from "../../utils/ShadesUtils";

export const Wrapper = styled.div`
    column-gap: 12px;
    row-gap: 12px;

    align-items: start;

    .apps-names {
        row-gap: 4px;
    }

    .vertical-start-flex {
        align-items: start;
    }

    img {
        border-radius: 32px;
    }
`;

const Card = styled.div`
    row-gap: 12px;
    margin-top: 8px;

    .app-names {
        row-gap: 4px;
    }

    .apps-ratings {
        row-gap: 3px;
    }

    .app-ratings ul {
        margin-top: 4px;
        display: inline-flex;
        row-gap: 2px;
        list-style-type: none;

        li {
            font-size: 8px;
        }
    }

    .apps-star-ratings {
        align-items: baseline;
    }

    .dot-separator {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        display: inline-flex;
        background: ${grey3};
        margin: 0 6px;
    }
`;

type PropTypes = {
    appIconSize?: number;
    showRatings: boolean;
};
export default function AppInfo(props: PropTypes) {
    const { app } = useSelector(selectApps);

    const { appIconSize, showRatings } = props;

    return (
        <Wrapper className={"h-start-flex"}>
            <Image
                src={app?.meta?.appIconUrl || ""}
                width={appIconSize || 200}
                height={appIconSize || 200}
                alt={"app-icon"}
                loader={() => app?.meta?.appIconUrl || ""}
            />
            <Card className={"vertical-start-flex"}>
                <div className={"vertical-start-flex jokes-names"}>
                    <ResText20SemiBold className={"text-grey1"}>
                        {capitalize(app?.name, true)}
                    </ResText20SemiBold>
                    <ResText16Regular className={"text-grey2"}>
                        {capitalize(app?.genres, true)}
                    </ResText16Regular>
                    <ResText16Regular className={"text-store-blue"}>
                        {app?.meta?.sellerName}
                    </ResText16Regular>
                </div>
                {showRatings && (
                    <>
                        <div className={"vertical-start-flex jokes-ratings"}>
                            {app && app?.rank > 0 && (
                                <ResText14Regular className={"text-store-blue"}>
                                    {`#${app?.rank} in ${app?.primaryGenre}`}
                                </ResText14Regular>
                            )}

                            <div className={"h-start-flex jokes-star-ratings"}>
                                <FiveStars
                                    rating={app?.meta?.avgRatingText}
                                    style={{ marginTop: 2, marginRight: 8 }}
                                    fontSize={12}
                                    showAvgRating={false}
                                />
                                <ResText12Regular
                                    className={
                                        "h-vertically-centered-flex text-grey3"
                                    }
                                >
                                    {app?.meta.avgRatingText}
                                    <div className={"dot-separator"} />
                                    {app?.meta?.ratingText}
                                    {" Ratings"}
                                </ResText12Regular>
                            </div>
                        </div>
                        <ResText14Regular className={"text-grey2"}>
                            {app?.meta?.priceText}
                        </ResText14Regular>
                    </>
                )}
            </Card>
        </Wrapper>
    );
}
