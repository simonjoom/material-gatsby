import React, { Component } from "react"; 
import { translate } from "react-i18next";
import Dropdown from "../reactLIB/Dropdown";
import Button from "../reactLIB/Button";
import NavItem from "../reactLIB/NavItem"; 
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
    const { i18n } = this.props;
    this.state = { language: i18n.language };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ language: nextProps.i18n.language });
  }

  renderButtonText(rowData) {
    const { label } = rowData;
    return `${label}`;
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
    const lng = this.state.language;
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
                  href={this.props.route[el.code]}
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
export default translate()(LanguageSwitcher);

/*
        {languages.map(language => this.renderLanguageChoice(language))}*/
