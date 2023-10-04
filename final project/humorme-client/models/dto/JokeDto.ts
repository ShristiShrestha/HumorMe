import { JokeRatingLevels } from "../enum/JokeEnum";
import { UIUserDetails } from "./UIUserDetails";

export type PostJoke = {
    labels: string;
    text: string;
    title: string;
};

export type UIJokeDetails = {
    id: number;
    title: string;
    text: string;
    labels: string;
    labelRatings: LabelRatings;
    user: UIUserDetails;
    createdAt: Date;
};

export type LabelRatings = {
    [level in JokeRatingLevels]: number;
};
