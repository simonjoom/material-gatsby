import React, { Component } from "react";
import classNames from "classnames";
import { translate } from "react-i18next";
import { push } from "gatsby";
import { StyleSheet,View,TouchableHighlight,Text } from "react-native";
import ModalDropdown from "Modaldropdown";
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

    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps", nextProps.i18n.language);
    this.setState({ language: nextProps.i18n.language });
  }

  handleChangeLanguage(lng) {
    const { i18n } = this.props;
    //console.log(this.props.route)
    i18n.changeLanguage(lng); 
    push(this.props.route[lng]);
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
  onSelect(idx, value) {
    //console.log("onSelect", idx, value);
    var that=this;
    setTimeout(function(){that.handleChangeLanguage(value.code)},100)
    /* this.setState({
      dropdown_6_icon_heart: !this.state.dropdown_6_icon_heart,
    })*/
  }
  renderButtonText(rowData) {
    const { label } = rowData;
    return `${label}`;
  }
  renderRow(rowData, rowID, highlighted) {
    const lng = rowData.code;
    const label = rowData.label; 
    const Flag = Localetosrc[lng]; 
    let evenRow = rowID % 2;
    return ( 
        <View
          style={[
            styles.dropdown_2_row,
            { backgroundColor: evenRow ? "lemonchiffon" : "white" }
          ]}
        > 
          <Text
            style={[
              styles.dropdown_2_row_text,
              highlighted && { color: "mediumaquamarine" }
            ]}
          >
            <Flag style={{height:"50px"}}/>{`${label}`}
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

    const CurrentFlag = Localetosrc[this.state.language];
    return (
      <div className="LanguageSwitcher flex-end">
        <ModalDropdown 
          options={languages}
          style={styles.dropdown_2}
          textStyle={styles.dropdown_2_text}
          dropdownStyle={styles.dropdown_2_dropdown}
          renderButtonText={rowData => this.renderButtonText(rowData)}
          renderRow={this.renderRow.bind(this)}
          onSelect={(idx, value) => this.onSelect(idx, value)}
        >
          <CurrentFlag />
        </ModalDropdown>
      </div>
    );
  }
}
const styles = StyleSheet.create({
  dropdown_2: {
    alignSelf: "flex-end",
    width: 50,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "cornflowerblue"
  },
  dropdown_2_text: {
    marginVertical: 10,
    flex:1,
    marginHorizontal: 6,
    fontSize: 18,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center"
  },
  dropdown_2_dropdown: {
    width: 150,
    height: "auto",
    borderColor: "cornflowerblue",
    borderWidth: 2,
    borderRadius: 3
  },
  dropdown_2_row_text:{
    flex: 1,
  },
  dropdown_2_row: {
    flexDirection: "row",
    height: 50,
    marginBottom:5
  },
  dropdown_6: {
    flex: 1,
    left: 8
  },
  dropdown_6_image: {
    width: 40,
    height: 40
  }
});
export default translate()(LanguageSwitcher);

/*
        {languages.map(language => this.renderLanguageChoice(language))}*/
