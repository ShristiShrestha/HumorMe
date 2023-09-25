import { Button } from "antd";
import { ResText14Regular } from "../utils/TextUtils";
import * as React from "react";
import { CSSProperties, useState } from "react";
import styled from "styled-components";
import {
    grey3,
    lightBanana,
    lightRed,
    orange,
    red,
    storeBlue,
    webGrey,
    webLightGrey,
    white,
} from "../utils/ShadesUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { debounceFuncs } from "../utils/LodashUtils";

/* styled tokens */
const Wrapper = styled.span<{
    width?: string;
    isDisabled?: boolean;
}>`
    // width: ${props => props.width || "auto"};

    .ant-btn {
        border-radius: 4px;
        cursor: ${props => (props.isDisabled ? "disabled" : "initial")};
        //min-width: 80px;
        //min-height: 40px;
        // box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
        //z-index: 1111;
    }
`;

/* custom styling to button by types */
export enum MyButtonType {
    primary,
    secondary,
    warning,
    danger,
    info,
}

const buttonStyleByType = (
    btnType: MyButtonType,
    disabled?: boolean,
    isBorder = false, // else background
) => {
    if (disabled) return webLightGrey;
    switch (btnType) {
        case MyButtonType.primary:
            return storeBlue;
        case MyButtonType.warning:
            return isBorder ? orange : lightBanana;
        case MyButtonType.danger:
            return isBorder ? red : lightRed;
        case MyButtonType.secondary:
            return isBorder ? grey3 : white;
        case MyButtonType.info:
            return isBorder ? storeBlue : white;
    }
};

const buttonTextStyleByType = (btnType: MyButtonType, disabled?: boolean) => {
    if (disabled) return webGrey;
    switch (btnType) {
        case MyButtonType.primary:
        case MyButtonType.warning:
        case MyButtonType.danger:
            return white;
        case MyButtonType.secondary:
            return grey3;
        case MyButtonType.info:
            return storeBlue;
    }
};

/* types definition */
type Props = {
    text: string;
    btnType: MyButtonType;
    onClick: Function;
    isDisabled?: boolean;
    showLoading?: boolean;
    isFullWidth?: boolean;
    background?: string;
    textStyle?: CSSProperties;
    buttonStyle?: CSSProperties;
};

export default function MyButton(props: Props) {
    const {
        btnType,
        text,
        isFullWidth,
        isDisabled,
        showLoading,
        onClick,
        background,
        buttonStyle = {},
        textStyle = {},
    } = props;

    /* states */
    const [isLoading, setLoading] = useState(false);
    const ignorePropsColor = isDisabled || !background;

    /* handlers */
    const handleOnClick = e => {
        e.preventDefault();
        // e.stopPropagation();

        setLoading(true);
        // onClick();
        debounceFuncs(async () => {
            await onClick();
            setTimeout(() => setLoading(false), 1000);
        });
    };

    const btnStyle = {
        ...buttonStyle,
        width: isFullWidth ? "100%" : "auto",
        borderColor: ignorePropsColor
            ? buttonStyleByType(
                  btnType,
                  isDisabled || (isLoading && showLoading),
                  true,
              )
            : background,
        background: ignorePropsColor
            ? buttonStyleByType(
                  btnType,
                  isDisabled || (isLoading && showLoading),
              )
            : background,
    };
    const btnTextStyle = {
        ...textStyle,
        color: buttonTextStyleByType(
            btnType,
            isDisabled || (isLoading && showLoading),
        ),
    };

    /* render */
    return (
        <Wrapper width={btnStyle.width}>
            <Button
                style={btnStyle}
                onClick={e => !isLoading && handleOnClick(e)}
                disabled={isDisabled || (isLoading && showLoading)}
            >
                <ResText14Regular style={btnTextStyle}>
                    {text} {isLoading && showLoading && <LoadingOutlined />}
                </ResText14Regular>
            </Button>
        </Wrapper>
    );
}
