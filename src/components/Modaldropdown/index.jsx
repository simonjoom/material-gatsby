import React, { Component } from "react";
import ReactDOM from "react-dom";
import { throttle } from "lodash";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ListView,
  findNodeHandle,
  UIManager,
  Modal,
  ActivityIndicator
} from "react-native";

import PropTypes from "prop-types";

export default class ModalDropdown extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,

    accessible: PropTypes.bool,
    animated: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.string,

    style: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),
    textStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),
    dropdownStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),
    dropdownTextStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),
    dropdownTextHighlightStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),

    adjustFrame: PropTypes.func,
    renderRow: PropTypes.func,
    renderSeparator: PropTypes.func,
    renderButtonText: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    scrollEnabled: true,
    defaultIndex: -1,
    defaultValue: "Please select...",
    options: null,
    animated: true,
    showsVerticalScrollIndicator: true,
    keyboardShouldPersistTaps: "never"
  };

  constructor(props) {
    super(props);
    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;
    this.scroll = {
      x: 0,
      y: 0
    };
    this.state = {
      accessible: !!props.accessible,
      frameStyle: {},
      loading: !props.options,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex
    };
  }
  componentWillReceiveProps(nextProps) {
    let { buttonText, selectedIndex } = this.state;
    const { defaultIndex, defaultValue, options } = nextProps;
    buttonText = this._nextValue == null ? buttonText : this._nextValue;
    selectedIndex = this._nextIndex == null ? selectedIndex : this._nextIndex;
    if (selectedIndex < 0) {
      selectedIndex = defaultIndex;
      if (selectedIndex < 0) {
        buttonText = defaultValue;
      }
    }
    this._nextValue = null;
    this._nextIndex = null;

    this.setState({
      loading: !options,
      buttonText,
      selectedIndex
    });
  }

  render() {
    return (
      <View {...this.props} tabIndex={0} onBlur={this.hide}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    );
  }

  _updatePosition = () => {
    // if (this._button && this._button.measure) {
    /*     UIManager.measure(findNodeHandle(this.refs.view), (x, y, w, h, px, py) => {
   //     this.originPosition = {x, y, w, h, px, py};
        this._buttonFrame = { x, y, w, h, px, py };
        console.log("this._buttonFrame",this._buttonFrame)
        this.setState({ frameStyle: this._calcPosition() });
      });
*/
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = { x: px, y: py, w: width, h: height };
        this.setState({ frameStyle: this._calcPosition() });
      });
    }
  };

  handleScroll = () => {
    if (typeof window !== undefined) { 
      let supportPageOffset = window.pageXOffset !== undefined;
      let isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
      this.scroll = {
        x: supportPageOffset
          ? window.pageXOffset
          : isCSS1Compat
            ? document.documentElement.scrollLeft
            : document.body.scrollLeft,
        y: supportPageOffset
          ? window.pageYOffset
          : isCSS1Compat
            ? document.documentElement.scrollTop
            : document.body.scrollTop
      }; 
      this._updatePosition();
    }
  };
  componentDidMount() { 
    window.addEventListener("scroll", throttle(this.handleScroll, 100));
    this._updatePosition();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", throttle(this.handleScroll, 100));
  }

  show = () => {
    this.setState({
      showDropdown: true
    });
  };

  focusInCurrentTarget = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget === null) return false;

    var node = relatedTarget.parentNode;

    while (node !== null) {
      if (node === currentTarget) return true;
      node = node.parentNode;
    }

    return false;
  };

  hide = e => {
    if (e && !this.focusInCurrentTarget(e)) {
      this.setState({
        showDropdown: false
      });
    } else {
      if (!e) {
        this.setState({
          showDropdown: false
        });
      }
    }
  };

  select(idx) {
    const {
      defaultValue,
      options,
      defaultIndex,
      renderButtonText
    } = this.props;

    let value = defaultValue;
    if (idx == null || !options || idx >= options.length) {
      idx = defaultIndex;
    }

    if (idx >= 0) {
      value = renderButtonText
        ? renderButtonText(options[idx])
        : options[idx].toString();
    }

    this._nextValue = value;
    this._nextIndex = idx;

    this.setState({
      buttonText: value,
      selectedIndex: idx
    });
  }

  _renderButton() {
    const { disabled, accessible, children, textStyle } = this.props;
    const { buttonText } = this.state;

    return (
      <TouchableOpacity
        ref={_button => {
          this._button = _button;
        }}
        disabled={disabled}
        accessible={accessible}
        onPress={this._onButtonPress}
      >
        {children || (
          <View style={styles.button}>
            <Text style={[styles.buttonText, textStyle]} numberOfLines={1}>
              {buttonText}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  _onButtonPress = () => {
    const { onDropdownWillShow } = this.props;
    if (!onDropdownWillShow || onDropdownWillShow() !== false) {
      this.show();
    }
  };

  _renderModal() {
    const { animated, accessible, dropdownStyle } = this.props;
    const { showDropdown, loading, frameStyle } = this.state;
    console.log("showDropdown", showDropdown);
    //const animationType = animated ? 'fade' : 'none';
    return (
      <Modal
        visible={showDropdown}
        transparent={true}
        onRequestClose={this._onRequestClose}
        supportedOrientations={[
          "portrait",
          "portrait-upside-down",
          "landscape",
          "landscape-left",
          "landscape-right"
        ]}
      >
        <View style={styles.modal}>
          <View style={[styles.dropdown, dropdownStyle, frameStyle]}>
            {loading ? this._renderLoading() : this._renderDropdown()}
          </View>
        </View>
      </Modal>
    );
  }

  _calcPosition() {
    const { dropdownStyle, style, adjustFrame } = this.props;

    const dimensions = Dimensions.get("window");
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;

    const dropdownHeight = StyleSheet.flatten(styles.dropdown).height;
    const posy = this._buttonFrame.y;
    const posx = this._buttonFrame.x;
    console.log("_calcPosition", this.scroll.y);
    const bottomSpace = windowHeight - posy - this._buttonFrame.h;
    const rightSpace = windowWidth - posx;
    //const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= posy;
    const showInLeft = rightSpace >= posx;

    const showInBottom = true;
    console.log("showInBottom", showInBottom);
    const positionStyle = {
      height: dropdownHeight,
      top: showInBottom
        ? posy + this._buttonFrame.h - this.scroll.y
        : Math.max(0, posy - dropdownHeight)
    };
    if (showInLeft) {
      positionStyle.left = posx;
    } else {
      const dropdownWidth =
        (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) ||
        -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = rightSpace - this._buttonFrame.w;
    }

    console.log("positionStyle", positionStyle);
    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  }

  _onRequestClose = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _onModalPress = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _renderLoading() {
    return <ActivityIndicator size="small" />;
  }

  _renderDropdown() {
    const {
      scrollEnabled,
      renderSeparator,
      showsVerticalScrollIndicator,
      keyboardShouldPersistTaps
    } = this.props;
    return (
      <ListView
        scrollEnabled={scrollEnabled}
        style={styles.list}
        dataSource={this._dataSource}
        renderRow={this._renderRow}
        renderSeparator={renderSeparator || this._renderSeparator}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      />
    );
  }

  get _dataSource() {
    const { options } = this.props;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(options);
  }

  _renderRow = (rowData, sectionID, rowID, highlightRow) => {
    const {
      renderRow,
      dropdownTextStyle,
      dropdownTextHighlightStyle,
      accessible
    } = this.props;
    const { selectedIndex } = this.state;
    const key = `row_${rowID}`;
    const highlighted = rowID == selectedIndex;
    const row = !renderRow ? (
      <Text
        style={[
          styles.rowText,
          dropdownTextStyle,
          highlighted && styles.highlightedRowText,
          highlighted && dropdownTextHighlightStyle
        ]}
      >
        {rowData}
      </Text>
    ) : (
      renderRow(rowData, rowID, highlighted)
    );
    const preservedProps = {
      key,
      accessible,
      onPressIn: () => this._onRowPress(rowData, sectionID, rowID, highlightRow)
    };

    return <TouchableHighlight {...preservedProps}>{row}</TouchableHighlight>;
  };

  _onRowPress(rowData, sectionID, rowID, highlightRow) {
    const { onSelect, renderButtonText, onDropdownWillHide } = this.props;
    if (!onSelect || onSelect(rowID, rowData) !== false) {
      highlightRow(sectionID, rowID);
      const value =
        (renderButtonText && renderButtonText(rowData)) || rowData.toString();
      this._nextValue = value;
      this._nextIndex = rowID;
      this.setState({
        buttonText: value,
        selectedIndex: rowID
      });
    }
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      setTimeout(() => this.hide(), 400);
    }
  }

  _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
    const key = `spr_${rowID}`;
    return <View style={styles.separator} key={key} />;
  };
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 12
  },
  modal: {
    flexGrow: 1,
    position: "absolute",
    top: "0px",
    right: "0px"
  },
  dropdown: {
    position: "absolute",
    height: (70+StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    borderRadius: 2,
    backgroundColor: "white",
    justifyContent: "center"
  },
  loading: {
    alignSelf: "center"
  },
  list: {
    //flexGrow: 1,
  },
  rowText: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: 11,
    color: "gray",
    backgroundColor: "white",
    textAlignVertical: "center"
  },
  highlightedRowText: {
    color: "black"
  },
  separator: {
    height: 1,
    backgroundColor: "lightgray"
  }
});
