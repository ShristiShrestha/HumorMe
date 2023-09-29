import { UIUserDetails } from "./UIUserDetails";
import { UIJokeDetails } from "./JokeDto";
import { JokeRatingLevels } from "../enum/JokeEnum";

export type UICommentDetails = {
    id: number;
    text: string;
    user: UIUserDetails;
    createdAt: Date;
};

export type UIRatingDetails = {
    id: number;
    joke: UIJokeDetails;
    label: JokeRatingLevels;
    user: UIUserDetails;
    createdAt: Date;
};
