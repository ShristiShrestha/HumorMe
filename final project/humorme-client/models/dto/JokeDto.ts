import { JokeRatingLevels } from "../enum/JokeEnum";

export type UIJokeDetails = {
    title: string;
    text: string;
    numReviews: number;
    ratings: UIJokeRatings;
};

export type UIJokeRatings = {
    [level in JokeRatingLevels]: number;
};
