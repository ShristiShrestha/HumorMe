import toastr from "toastr";
import { message as antdMessage } from "antd";
import React, { Component } from "react";

import { connect } from "react-redux";

toastr.options = {
    positionClass: "toast-top-center",
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: false,
    preventDuplicates: true,
    onclick: () => {},
    showDuration: 1000,
    hideDuration: 100,
    timeOut: 10000,
    extendedTimeOut: 10000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
};

class MyToastr extends Component {
    static error(title: string, description = "") {
        // const { intl } = new IntlProvider({ locale: language, messages: messages }, {}).getChildContext();
        // notification.error({message: "Error!", description: description});
        toastr.error(description, title);
    }

    static success(title, description) {
        // const { intl } = new IntlProvider({ locale: language, messages: messages[localStorage.getItem('lang') ? localStorage.getItem('lang') : 'eu'] }, {}).getChildContext();
        // notification.success({message: title, description: description });
        // const selected = store.state.Language.selectedLanguage;
        toastr.success(description, title);
    }

    static info(title, description) {
        // notification.info({message: title, description: description });
        toastr.info(description, title);
    }

    static warning(title, description) {
        // notification.warning({message: title, description: description });
        toastr.warning(description, title);
    }

    static loading(message) {
        antdMessage.loading(message);
    }

    static message(message) {
        antdMessage.success(message);
    }
}

const mapStateToProps = store => ({
    // selectedLanguage: store.getState().Language.selectedLanguage,
});

export default connect(mapStateToProps)(MyToastr);
