import { Menu } from "antd";
import { Text16Regular } from "../utils/TextUtils";
import * as React from "react";
import styled from "styled-components";

/* styles */
const styles = {
    menu: {
        minWidth: 280,
        margin: "0 16px",
    },
};

/* styled tokens */
const Wrapper = styled.div`
    .ant-menu-horizontal {
        border-bottom: transparent;
    }

    #landing-top-nav-menu-home:hover {
        color: #595cd4;
        border-bottom-color: #595cd4 !important;
    }

    #landing-top-nav-menu-about:hover {
        color: #3cabdc;
        border-bottom-color: #3cabdc !important;
    }

    #landing-top-nav-menu-blog:hover {
        color: #fc3258;
        border-bottom-color: #fc3258 !important;
    }

    #landing-top-nav-menu-faqs:hover {
        color: #f6d475;
        border-bottom-color: #f6d475 !important;
    }

    #landing-top-nav-menu-contact:hover {
        color: #5c5cd3;
        border-bottom-color: #5c5cd3 !important;
    }
`;

const OverflowSpan = styled.div.attrs({
    className: "h-start-flex",
})`
    padding: 20px 0;

    i {
        margin-right: 8px;
    }
`;

/* type definition */
type MenuType = {
    name: string;
    path: string;
    className: string;
    color: string;
};

type Props = {
    menu: MenuType[];
    defaultActive: string;
    onSelected: any;
};

export default function MyMenus(props: Props) {
    const { menu, defaultActive, onSelected } = props;

    /* ============================================= */
    /* handlers */
    /* ============================================= */
    const onChange = val => {
        onSelected(val.key);
    };

    /* render */
    return (
        <Wrapper>
            <Menu
                inlineCollapsed={false}
                mode={"horizontal"}
                style={styles.menu}
                selectedKeys={[defaultActive]}
                triggerSubMenuAction={"click"}
                onSelect={onChange}
                overflowedIndicator={
                    <OverflowSpan>
                        {/*<i className={"fa fa-ellipsis-h"} />*/}
                        <Text16Regular>More</Text16Regular>
                    </OverflowSpan>
                }
            >
                {menu.map(option => (
                    <Menu.Item
                        key={option.path}
                        id={`${option.className}`}
                        style={
                            defaultActive === option.path
                                ? {
                                      borderBottomColor: option.color,
                                      color: option.color,
                                  }
                                : {}
                        }
                    >
                        <Text16Regular>{option.name}</Text16Regular>
                    </Menu.Item>
                ))}
            </Menu>
        </Wrapper>
    );
}
