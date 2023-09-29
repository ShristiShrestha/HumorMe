export type UIUserDetails = {
    id: number;
    name: string;
    email: string;
    isEnabled: boolean;
    createdAt: Date;
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
