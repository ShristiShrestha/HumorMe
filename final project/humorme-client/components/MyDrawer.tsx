import { Drawer } from "antd";
import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { Text16Regular } from "../utils/TextUtils";
import { getColorUrlPath } from "../utils/ShadesUtils";

/* styled components */
const Wrapper = styled.div.attrs({
    className: "centered-flex landing-nav-drawer",
})``;

const Item = styled.div<{ color: string }>`
    width: 100%;
    padding: 24px 16px;
    text-align: center;
    text {
        color: ${props => props.color};
    }
`;

/* props */
type Props = {
    openDrawer: boolean;
    menuOptions: any[];
    defaultActive: string;
    onSelected: Function;
    lastItem: ReactElement;
};

export default function MyDrawer(props: Props) {
    const { menuOptions, openDrawer, defaultActive, onSelected, lastItem } =
        props;

    /* handlers */
    const onChange = val => {
        onSelected(val.path);
    };

    /* render */
    return (
        <Wrapper>
            <Drawer
                className={"centered-flex"}
                placement="right"
                closable={false}
                visible={openDrawer}
            >
                <>
                    {menuOptions.map(item => (
                        <Item
                            key={item.path}
                            color={getColorUrlPath(defaultActive, item.path)}
                            onClick={() => onChange(item)}
                        >
                            <Text16Regular>{item.name}</Text16Regular>
                        </Item>
                    ))}
                    <Item color={""}>{lastItem}</Item>
                </>
            </Drawer>
        </Wrapper>
    );
}
