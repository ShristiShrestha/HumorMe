import Api from "../utils/ApiUtils";
import { PostJoke, UIJokeDetails } from "../models/dto/JokeDto";
import { UICommentDetails, UIRatingDetails } from "../models/dto/CommentDto";
import { JokeRatingLevels } from "../models/enum/JokeEnum";

/******************* post joke ************************/

export const postJoke = (request: PostJoke) => {
    return Api.apiCall<UIJokeDetails>({
        url: "/jokes",
        method: "POST",
        data: request,
    });
};
export const getJokes = (labels?: string) => {
    return Api.apiCall<UIJokeDetails[]>({
        url: "/jokes",
        method: "GET",
        params: {
            labels: labels,
        },
    });
};

export const getJoke = (id: number) => {
    return Api.apiCall<UIJokeDetails>({
        url: `/jokes/${id}`,
        method: "GET",
    });
};

/******************* joke comment ************************/

export const postJokeComment = (jokeId: string, request: string) => {
    return Api.apiCall<UICommentDetails>({
        url: `/jokes/${jokeId}/comments`,
        method: "POST",
        data: request,
    });
};

export const getJokeComments = (jokeId: number) => {
    return Api.apiCall<UICommentDetails[]>({
        url: `/jokes/${jokeId}/comments`,
        method: "GET",
    });
};

/******************* joke rating ************************/

export const postJokeRating = (id: number, label: JokeRatingLevels) => {
    return Api.apiCall<UIRatingDetails>({
        url: `/jokes/${id}/ratings`,
        method: "POST",
        data: label,
    });
};
export const getJokeRatings = (id: number) => {
    return Api.apiCall<UIRatingDetails[]>({
        url: `/jokes/${id}/ratings`,
        method: "GET",
    });
};
