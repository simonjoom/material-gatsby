import React, {Component} from "react";
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
  cn: Icon_Flag_CH,
  en: Icon_Flag_US,
  fr: Icon_Flag_FR,
  pt: Icon_Flag_BR,
  ru: Icon_Flag_RU,
  uk: Icon_Flag_UK
};
class LanguageSwitcher extends Component {
  getLanguage() {
    return (
      i18n.language ||
      (!(process.env.GATSBY_BUILD_STAGE == "build-html") &&
        window &&
        window.localStorage.i18nextLng) ||
      "en"
    );
  }
  renderRow(label, lng, parent) {
    const Flag = Localetosrc[lng];
    return (
      <View style={[styles.dropdown_2_row, {height:"20px"}]}>
        <Text style={[styles.dropdown_2_row_text]}>
          <Flag style={{ height: parent ? "2em" : "1.5em" }} /> {`${label}`}
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

    if (!path) console.log(this.props);
    if (process.env.NODE_ENV === "production") {
      if (code == "fr") href = "https://www.skiscool.fr";
      else if (code == "en") href = "https://www.ski-courchevel.deals";
      else if (code == "pt") href = "https://pt.skiscool.com";
      else if (code == "ru") href = "https://www.skiscool.com";
      else if (code == "uk") href = "https://uk.skiscool.com";
      else href = "https://cn.skiscool.com";
    }
    return href + path;
  }
  handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    var $al = $(e.target).closest("a");
    if (!!$al.length) window.location.replace($al[0].href);
  };

  render() {
    const languages = [
      { code: "en", label: "English" },
      { code: "fr", label: "French" },
      { code: "ru", label: "Russian" },
      { code: "pt", label: "Portuguese" },
      { code: "uk", label: "Ukrainien" },
      { code: "cn", label: "Chinese" }
    ];
    const lng = this.getLanguage();
    const label = languages.find(el => el.code == lng).label;
    return (
      <div className="md-cell md-cell--1 md-cell--1-phone">
        <Dropdown
          trigger={
            <div className="btn btn-flat btn-flags dropdown-trigger" style={{display:"table"}}>
              {this.renderRow(label, lng, true)}
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
                  onClick={this.handleClick}
                  external={process.env.NODE_ENV === "production"}
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
  dropdown_2_row: {
    display: "table-row",
    height: 30,
    width: "2em",
    // width: 'auto',
    margin: 5
  },
  dropdown_2_row_text: {
    flex: 1,
  },
  dropdown_2_row: {
    flexDirection: "row",
    height: 30,
    width:'2em',
    // width: 'auto',
    margin: 5
  },
  dropdown_6: {
    flex: 1,
    left: 8
  },
  dropdown_6_image: {
    width: 20,
    height: 20
  }
});
export default LanguageSwitcher;

/*
                  //    onClick={() => i18n.changeLanguage(el.code)}
        {languages.map(language => this.renderLanguageChoice(language))}*/
