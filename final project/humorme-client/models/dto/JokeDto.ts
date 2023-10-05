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
    totalComments?: number;
};

export type LabelRatings = {
    [level in JokeRatingLevels]: number;
};

export type JokeQuery = {
    userId?: number;
    text?: string;
};
