import React, { Component } from "react";
import Dropdown from "../reactLIB/Dropdown";
import NavItem from "../reactLIB/NavItem";
import i18n from "i18next";
import { StyleSheet, View, Text } from "react-native";

import {
  Icon_Flag_FR,
  Icon_Flag_RU,
  Icon_Flag_US,
  Icon_Flag_CH,
  Icon_Flag_UK,
  Icon_Flag_BR
  // Icon_Skype,
} from "./flags/";
const Localetosrc = {
  ch: Icon_Flag_CH,
  en: Icon_Flag_US,
  fr: Icon_Flag_FR,
  pt: Icon_Flag_BR,
  ru: Icon_Flag_RU,
  uk: Icon_Flag_UK
};
class LanguageSwitcher extends Component {
  constructor(props) {
    super(props);
    // console.log("i18n.language", i18n.language);
    this.language = this.getLanguage();
    this.route = this.props.route;
  }
  getLanguage() {
    return (
      i18n.language ||
      (!(process.env.GATSBY_BUILD_STAGE == "build-html") &&
        window &&
        window.localStorage.i18nextLng) ||
      "en"
    );
  }
  renderRow(label, lng) {
    const Flag = Localetosrc[lng];
    return (
      <View style={styles.dropdown_2_row}>
        <Text style={[styles.dropdown_2_row_text]}>
          <Flag style={{ height: "35px" }} /> {`${label}`}
        </Text>
      </View>
    );
  }
  buildhref(code, lng) {
    let href = "";
    let path = this.props.route
      ? this.props.route[code]
      : this.props.path
          .replace("_fr", "_" + lng)
          .replace("_pt", "_" + lng)
          .replace("_ru", "_" + lng)
          .replace("_ch", "_" + lng)
          .replace("_uk", "_" + lng);
    if (process.env.NODE_ENV === "production") {
      if (code == "fr") href = "https://www.skiscool.fr";
      else if (code == "en") href = "https://www.ski-courchevel.deals";
      else if (code == "pt") href = "https://pt.skiscool.com";
      else if (code == "ru") href = "https://www.skiscool.com";
      else if (code == "uk") href = "https://uk.skiscool.com";
      else href = "https://cn.skiscool.com";
      path = path.replace(/\/(fr|ru|uk|ch|pt|en)/, "");
    }
    return href + path;
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
    const lng = this.getLanguage();
    const label = languages.find(el => el.code == lng).label;
    return (
      <div className="md-cell md-cell--1 md-cell--1-phone">
        <Dropdown
          trigger={
            <div className="btn btn-large btn-flags">
              {this.renderRow(label, lng)}
            </div>
          }
        >
          {languages.map((el, i) => {
            if (el.code !== lng) {
              const href = this.buildhref(el.code, lng);
              return (
                <NavItem
                  key={"nav" + i}
                  href={href}
                  external={process.env.NODE_ENV === "production"}
                  //    onClick={() => i18n.changeLanguage(el.code)}
                  waves="light"
                >
                  {this.renderRow(el.label, el.code)}
                </NavItem>
              );
            }
          })}
        </Dropdown>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  dropdown_2_text: {
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 6,
    fontSize: 1,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center"
  },
  dropdown_2_row_text: {
    flex: 1
  }
});
export default LanguageSwitcher;

/*
        {languages.map(language => this.renderLanguageChoice(language))}*/
