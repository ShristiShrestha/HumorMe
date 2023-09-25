import React, { useCallback, useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store";

import "antd/dist/reset.css"; //~antd/dist/antd.css
import "../styles/globals.css";
import "../styles/toastr.css";
import { Layout } from "antd";
import { MyHeader } from "../components/MyHeader";
import styled from "styled-components";
import withAppsLoad from "../containers/WithAppsLoad";
import { initGoogleAnalytics } from "../utils/GoogleAnalyticsUtils";
import { debounceFuncs } from "../utils/LodashUtils";
import withUserAuthenticated from "../hooks/withUserAuthenticated";

const MyContent = styled.div.attrs({
    className: "custom-layout",
})`
    margin: auto;
`;

const { Header, Footer, Content } = Layout;

function MyApp({ Component, pageProps }) {
    // const router = useRouter();
    const WrappedComponent = withAppsLoad(withUserAuthenticated(Component));

    /******************* render ************************/

    return (
        <React.StrictMode>
            <Provider store={store}>
                <Header>
                    <MyHeader />
                </Header>
                <Content>
                    <MyContent>
                        <WrappedComponent {...pageProps} />
                    </MyContent>
                </Content>
                <Footer>
                    <MyContent>Learn about our policy.</MyContent>
                </Footer>
            </Provider>
        </React.StrictMode>
    );
}

export default MyApp;
