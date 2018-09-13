import React, { Component } from "react";
import classNames from "classnames";
import { translate } from "react-i18next";
import { push } from "gatsby"

class LanguageSwitcher extends Component {
  constructor(props) {
    super(props);
    const { i18n } = this.props;
    this.state = { language: i18n.language };

    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ language: nextProps.i18n.language });
  }

  handleChangeLanguage(lng) {
    const { i18n } = this.props;
    //console.log(this.props.route)
    //i18n.changeLanguage(lng);
    console.log("this.props.route[lng]",this.props.route[lng])
    push(this.props.route[lng])
    return false;
  }

  renderLanguageChoice({ code, label }) {
    const buttonClass = classNames("LanguageSwitcher__button", {
      "LanguageSwitcher__button--selected": this.state.language === code
    });

    return (
      <button
        key={code}
        className={buttonClass}
        onClick={() => this.handleChangeLanguage(code)}
      >
        {label}
      </button>
    );
  }

  render() {
    const languages = [
      { code: "en", label: "English" },
      { code: "fr", label: "French" },
      { code: "ru", label: "Russian" },
      { code: "pt", label: "Portuguese" },
      { code: "uk", label: "Ukrainien" },
      { code: "ch", label: "Chinese" }
    ];

    return (
      <div className="LanguageSwitcher">
        {languages.map(language => this.renderLanguageChoice(language))}
      </div>
    );
  }
}

export default translate()(LanguageSwitcher);
