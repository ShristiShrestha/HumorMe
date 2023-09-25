export const isInDevelopment =
    process.env.NEXT_PUBLIC_NODE_ENV === "development";
export const isInProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";

export const disableLogInProduction = () => {
    if (isInProduction) {
        console.log = console.warn = console.error = function () {};
    }
};
