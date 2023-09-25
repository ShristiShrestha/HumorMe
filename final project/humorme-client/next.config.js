// module.exports = {
//     distDir: "build",
//     // compiler: {
//     //     // Enables the styled-components SWC transform
//     //     styledComponents: true,
//     // },
// };

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    //distDir: "out", // exports the output to out directory on npm run dev
    output: "export", //exports the output to out directory on npm run build
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
