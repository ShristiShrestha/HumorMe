import React from "react";
import { webAppConstants } from "../models/constants/MetaInfo";

function MyMeta() {
    return (
        <>
            <meta property="og:type" content="website" />
            <meta
                property="og:url"
                content={webAppConstants.socialPreview.url}
            />
            {/*<meta*/}
            {/*    property="og:title"*/}
            {/*    content={webAppConstants.socialPreview.title}*/}
            {/*/>*/}
            {/*<meta*/}
            {/*    property="og:description"*/}
            {/*    content={webAppConstants.socialPreview.desc}*/}
            {/*/>*/}
            {/*<meta*/}
            {/*    property="og:image"*/}
            {/*    content={`${webAppConstants.socialPreview.image}`}*/}
            {/*/>*/}

            {/*<meta name="twitter:card" content="summary_large_image" />*/}
            {/*<meta*/}
            {/*    name="twitter:url"*/}
            {/*    content={webAppConstants.socialPreview.url}*/}
            {/*/>*/}
            {/*<meta*/}
            {/*    name="twitter:title"*/}
            {/*    content={webAppConstants.socialPreview.title}*/}
            {/*/>*/}
            {/*<meta*/}
            {/*    name="twitter:description"*/}
            {/*    content={webAppConstants.socialPreview.desc}*/}
            {/*/>*/}
            {/*<meta*/}
            {/*    name="twitter:image"*/}
            {/*    content={webAppConstants.socialPreview.image}*/}
            {/*/>*/}
        </>
    );
}

export default MyMeta;
