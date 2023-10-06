export type UIUserDetails = {
    id: number;
    name: string;
    bio?: string;
    email: string;
    isEnabled: boolean;
    createdAt: Date;

    followers: UIUserDetails[];
    followings: UIUserDetails[];
};

export type PostUserDto = {
    name: string;
    email: string;
    password: string;
};

export type LoginUserDto = {
    email: string;
    password: string;
};
