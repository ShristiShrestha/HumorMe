import React from "react";
import { NotificationEnum } from "../models/enum/NotificationEnum";
import { notification } from "antd";

export const openNotification = (
    title: string,
    desc: string,
    label: NotificationEnum,
) => {
    switch (label) {
        case NotificationEnum.SUCCESS:
            return notification.success({
                message: title,
                description: desc,
                placement: "topRight",
            });
        case NotificationEnum.WARNING:
            return notification.warning({
                message: title,
                description: desc,
                placement: "topRight",
            });
        case NotificationEnum.ERROR:
            return notification.error({
                message: title,
                description: desc,
                placement: "topRight",
            });
    }
};
