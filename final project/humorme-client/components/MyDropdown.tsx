/* styled tokens */
import styled from "styled-components";
import { Dropdown, Menu } from "antd";
import * as React from "react";
import { ReactElement } from "react";
import { Text14Regular } from "../utils/TextUtils";

const Wrapper = styled.span``;

/* type definition */
type DropdownMenu = {
    key: string;
    onClick: Function;
    child?: ReactElement;
    text?: string;
};

type Props = {
    options: DropdownMenu[];
    children?: ReactElement;
    text?: string;
};

export default function MyDropdown(props: Props) {
    const { text, children, options } = props;

    /* sub tokens */
    const menu = (
        <Menu>
            {options.map(option => (
                <Menu.Item key={option.key} onClick={() => option.onClick()}>
                    {option.child}
                </Menu.Item>
            ))}
        </Menu>
    );

    /* render */
    return (
        <Wrapper>
            <Dropdown overlay={menu}>
                {children ? (
                    children
                ) : text ? (
                    <Text14Regular>{text}</Text14Regular>
                ) : (
                    <i className={"fa fa-vertical-ellipsis"} />
                )}
            </Dropdown>
        </Wrapper>
    );
}
