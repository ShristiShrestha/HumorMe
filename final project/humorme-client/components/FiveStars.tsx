import React from "react";
import { StarFilled } from "@ant-design/icons";
import { grey4, orange } from "../utils/ShadesUtils";
import { ResText14Regular } from "../utils/TextUtils";

export default function FiveStars(props) {
    const { rating, showAvgRating } = props;
    const flooredRating = Math.floor(parseFloat(rating));
    const ratingTxt = rating?.toString().slice(0, 4);

    const getRatings = () =>
        [...Array(5).keys()].map(item =>
            item < flooredRating ? orange : grey4,
        );

    const iconFontSize = props?.fontSize || 18;
    return (
        <div className={"h-start-flex star-ratings"} {...props}>
            {getRatings().map((itemRatingColor, index) => (
                // @ts-ignore
                <StarFilled
                    key={"review-star-ratings-" + index}
                    style={{ color: itemRatingColor, fontSize: iconFontSize }}
                />
            ))}
            {rating > 0 && showAvgRating && (
                <ResText14Regular style={{ marginLeft: 6 }}>
                    {ratingTxt}
                </ResText14Regular>
            )}
        </div>
    );
}
