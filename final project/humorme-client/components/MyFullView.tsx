// @flow
import * as React from "react";
import { CSSProperties, ReactElement } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { InView } from "react-intersection-observer";

/* styled components */
const Wrapper = styled.div<{ height: string; disableSnap: boolean }>`
    height: ${props => props.height};
    scroll-snap-align: ${props =>
        !!props.disableSnap && props.disableSnap ? "none" : "center"};
`;

/* type definition */
type Props = {
    heightOffset: number;
    children: ReactElement;
    pageIndex: number;
    addLandingListener: boolean;
    isFitContent: boolean;
    pageIdPrefix: string;
    wrapperStyle?: CSSProperties;
    onChangeView?: Function;
};
export default function MyFullView(props: Props) {
    /* props */
    const dispatch = useDispatch();
    const [inView, setInView] = React.useState(false);
    const {
        heightOffset,
        children,
        pageIndex,
        addLandingListener,
        isFitContent,
        pageIdPrefix,
        wrapperStyle,
        onChangeView,
    } = props;
    const pageId = `${pageIdPrefix}${pageIndex}`;

    /* handlers */
    const onChangeViewHandler = pageIndex =>
        onChangeView && onChangeView(pageIndex);

    const onEnterView = inView => {
        if (addLandingListener) {
            setInView(inView);
            inView && onChangeViewHandler(pageIndex);
        }
    };

    /* render */
    /* todo: use props for offset */
    return (
        <InView onChange={onEnterView} threshold={0.75}>
            <Wrapper
                id={pageId}
                className={"centered-flex"}
                style={!!wrapperStyle ? wrapperStyle : {}}
                disableSnap={isFitContent}
                height={
                    isFitContent ? "100%" : `calc(100vh - ${heightOffset}px)`
                }
            >
                {children}
            </Wrapper>
        </InView>
    );
}
