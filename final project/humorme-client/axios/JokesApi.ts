import Api from "../utils/ApiUtils";
import { JokeQuery, PostJoke, UIJokeDetails } from "../models/dto/JokeDto";
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
export const getJokes = (query?: JokeQuery) => {
    return Api.apiCall<UIJokeDetails[]>({
        url: "/jokes",
        method: "GET",
        params: { ...query },
    });
};

export const getJoke = (id: number) => {
    return Api.apiCall<UIJokeDetails>({
        url: `/jokes/${id}`,
        method: "GET",
    });
};

export const deleteJoke = (id: number) => {
    return Api.apiCall<UIJokeDetails>({
        url: `/jokes/${id}`,
        method: "DELETE",
    });
};

/******************* joke comment ************************/

export const postJokeComment = (
    jokeId: string | string[] | undefined,
    request: any,
) => {
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
export const getMyJokeRatings = () => {
    return Api.apiCall<UIRatingDetails[]>({
        url: `/jokes/ratings`,
        method: "GET",
    });
};
