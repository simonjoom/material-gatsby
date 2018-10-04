import React, {Component} from "react";
import Dropdown from "../reactLIB/Dropdown";
import Button from "../reactLIB/Button";
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
      (!(process.env.GATSBY_BUILD_STAGE=="build-html") && window && window.localStorage.i18nextLng) ||
      "en"
    );
  }
  renderRow(label, lng) {
    const Flag = Localetosrc[lng];
    return (
      <View style={styles.dropdown_2_row}>
        <Text style={[styles.dropdown_2_row_text]}>
          <Flag style={{ height: "20px" }} /> {`${label}`}
        </Text>
      </View>
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
    const lng = this.getLanguage();
    const label = languages.find(el => el.code == lng).label;
    return (
      <div className="LanguageSwitcher flex-end">
        <Dropdown
          trigger={
            <Button
              style={{margin: '10px 0px',paddingBottom: '20px', width:'150px'}}
            >
              {this.renderRow(label, lng)}
            </Button>
          }
        >
          {languages.map((el, i) => {
            if (el.code !== lng)
              return (
                <NavItem
                  key={"nav" + i}
                  href={
                    this.route
                      ? this.route[el.code]
                      : this.props.path
                          .replace("_fr", "_" + lng)
                          .replace("_pt", "_" + lng)
                          .replace("_ru", "_" + lng)
                          .replace("_ch", "_" + lng)
                          .replace("_uk", "_" + lng)
                  }
                  waves="light"
                >
                  {this.renderRow(el.label, el.code)}
                </NavItem>
              );
          })}
        </Dropdown>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  dropdown_2: {
    alignSelf: "flex-end",
    width: 30,
    // marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "cornflowerblue",
    margin: 10
  },
  dropdown_2_text: {
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 6,
    fontSize: 1,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center"
  },
  dropdown_2_dropdown: {
    width: 150,
    height: "auto",
    borderColor: "cornflowerblue",
    borderWidth: 2,
    borderRadius: 3,
    padding: 5
  },
  dropdown_2_row_text: {
    flex: 1
  },
  dropdown_2_row: {
    flexDirection: "row",
    height: 20,
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
        {languages.map(language => this.renderLanguageChoice(language))}*/
