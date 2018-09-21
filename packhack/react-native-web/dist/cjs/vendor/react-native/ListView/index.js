/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule ListView
 * 
 * @format
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _ListViewDataSource = _interopRequireDefault(require("./ListViewDataSource"));

var _Platform = _interopRequireDefault(require("../../../exports/Platform"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _findNodeHandle = _interopRequireDefault(require("../../../exports/findNodeHandle"));

var _NativeModules = _interopRequireDefault(require("../../../exports/NativeModules"));

var _ScrollView = _interopRequireDefault(require("../../../exports/ScrollView"));

var _ScrollResponder = _interopRequireDefault(require("../../../modules/ScrollResponder"));

var _StaticRenderer = _interopRequireDefault(require("../StaticRenderer"));

var _reactTimerMixin = _interopRequireDefault(require("react-timer-mixin"));

var _View = _interopRequireDefault(require("../../../exports/View"));

var _cloneReferencedElement = _interopRequireDefault(require("./cloneReferencedElement"));

var _createReactClass = _interopRequireDefault(require("create-react-class"));

var _isEmpty = _interopRequireDefault(require("../isEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var merge = function merge() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}].concat(args));
};

var RCTScrollViewManager = _NativeModules.default.ScrollViewManager;
var DEFAULT_PAGE_SIZE = 1;
var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;
var DEFAULT_END_REACHED_THRESHOLD = 1000;
var DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;
/**
 * DEPRECATED - use one of the new list components, such as [`FlatList`](docs/flatlist.html)
 * or [`SectionList`](docs/sectionlist.html) for bounded memory use, fewer bugs,
 * better performance, an easier to use API, and more features. Check out this
 * [blog post](https://facebook.github.io/react-native/blog/2017/03/13/better-list-views.html)
 * for more details.
 *
 * ListView - A core component designed for efficient display of vertically
 * scrolling lists of changing data. The minimal API is to create a
 * [`ListView.DataSource`](docs/listviewdatasource.html), populate it with a simple
 * array of data blobs, and instantiate a `ListView` component with that data
 * source and a `renderRow` callback which takes a blob from the data array and
 * returns a renderable component.
 *
 * Minimal example:
 *
 * ```
 * class MyComponent extends Component {
 *   constructor() {
 *     super();
 *     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
 *     this.state = {
 *       dataSource: ds.cloneWithRows(['row 1', 'row 2']),
 *     };
 *   }
 *
 *   render() {
 *     return (
 *       <ListView
 *         dataSource={this.state.dataSource}
 *         renderRow={(rowData) => <Text>{rowData}</Text>}
 *       />
 *     );
 *   }
 * }
 * ```
 *
 * ListView also supports more advanced features, including sections with sticky
 * section headers, header and footer support, callbacks on reaching the end of
 * the available data (`onEndReached`) and on the set of rows that are visible
 * in the device viewport change (`onChangeVisibleRows`), and several
 * performance optimizations.
 *
 * There are a few performance operations designed to make ListView scroll
 * smoothly while dynamically loading potentially very large (or conceptually
 * infinite) data sets:
 *
 *  * Only re-render changed rows - the rowHasChanged function provided to the
 *    data source tells the ListView if it needs to re-render a row because the
 *    source data has changed - see ListViewDataSource for more details.
 *
 *  * Rate-limited row rendering - By default, only one row is rendered per
 *    event-loop (customizable with the `pageSize` prop). This breaks up the
 *    work into smaller chunks to reduce the chance of dropping frames while
 *    rendering rows.
 */

var ListView = (0, _createReactClass.default)({
  displayName: 'ListView',
  _childFrames: [],
  _sentEndForContentLength: null,
  _scrollComponent: null,
  _prevRenderedRowsCount: 0,
  _visibleRows: {},
  scrollProperties: {},
  mixins: [_ScrollResponder.default.Mixin, _reactTimerMixin.default],
  statics: {
    DataSource: _ListViewDataSource.default
  },

  /**
   * Exports some data, e.g. for perf investigations or analytics.
   */
  getMetrics: function getMetrics() {
    return {
      contentLength: this.scrollProperties.contentLength,
      totalRows: this.props.enableEmptySections ? this.props.dataSource.getRowAndSectionCount() : this.props.dataSource.getRowCount(),
      renderedRows: this.state.curRenderedRowsCount,
      visibleRows: Object.keys(this._visibleRows).length
    };
  },

  /**
   * Provides a handle to the underlying scroll responder.
   * Note that `this._scrollComponent` might not be a `ScrollView`, so we
   * need to check that it responds to `getScrollResponder` before calling it.
   */
  getScrollResponder: function getScrollResponder() {
    if (this._scrollComponent && this._scrollComponent.getScrollResponder) {
      return this._scrollComponent.getScrollResponder();
    }
  },
  getScrollableNode: function getScrollableNode() {
    if (this._scrollComponent && this._scrollComponent.getScrollableNode) {
      return this._scrollComponent.getScrollableNode();
    } else {
      return (0, _findNodeHandle.default)(this._scrollComponent);
    }
  },

  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   *
   * See `ScrollView#scrollTo`.
   */
  scrollTo: function scrollTo() {
    if (this._scrollComponent && this._scrollComponent.scrollTo) {
      var _this$_scrollComponen;

      (_this$_scrollComponen = this._scrollComponent).scrollTo.apply(_this$_scrollComponen, arguments);
    }
  },

  /**
   * If this is a vertical ListView scrolls to the bottom.
   * If this is a horizontal ListView scrolls to the right.
   *
   * Use `scrollToEnd({animated: true})` for smooth animated scrolling,
   * `scrollToEnd({animated: false})` for immediate scrolling.
   * If no options are passed, `animated` defaults to true.
   *
   * See `ScrollView#scrollToEnd`.
   */
  scrollToEnd: function scrollToEnd(options) {
    if (this._scrollComponent) {
      if (this._scrollComponent.scrollToEnd) {
        this._scrollComponent.scrollToEnd(options);
      } else {
        console.warn('The scroll component used by the ListView does not support ' + 'scrollToEnd. Check the renderScrollComponent prop of your ListView.');
      }
    }
  },

  /**
   * Displays the scroll indicators momentarily.
   *
   * @platform ios
   */
  flashScrollIndicators: function flashScrollIndicators() {
    if (this._scrollComponent && this._scrollComponent.flashScrollIndicators) {
      this._scrollComponent.flashScrollIndicators();
    }
  },
  setNativeProps: function setNativeProps(props) {
    if (this._scrollComponent) {
      this._scrollComponent.setNativeProps(props);
    }
  },

  /**
   * React life cycle hooks.
   */
  getDefaultProps: function getDefaultProps() {
    return {
      initialListSize: DEFAULT_INITIAL_ROWS,
      pageSize: DEFAULT_PAGE_SIZE,
      renderScrollComponent: function renderScrollComponent(props) {
        return _react.default.createElement(_ScrollView.default, props);
      },
      scrollRenderAheadDistance: DEFAULT_SCROLL_RENDER_AHEAD,
      onEndReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
      stickySectionHeadersEnabled: _Platform.default.OS === 'ios' || _Platform.default.OS === 'web',
      stickyHeaderIndices: []
    };
  },
  getInitialState: function getInitialState() {
    return {
      curRenderedRowsCount: this.props.initialListSize,
      highlightedRow: {}
    };
  },
  getInnerViewNode: function getInnerViewNode() {
    return this._scrollComponent.getInnerViewNode();
  },
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    // this data should never trigger a render pass, so don't put in state
    this.scrollProperties = {
      visibleLength: null,
      contentLength: null,
      offset: 0
    };
    this._childFrames = [];
    this._visibleRows = {};
    this._prevRenderedRowsCount = 0;
    this._sentEndForContentLength = null;
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    // do this in animation frame until componentDidMount actually runs after
    // the component is laid out
    this.requestAnimationFrame(function () {
      _this._measureAndUpdateScrollProps();
    });
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    var _this2 = this;

    if (this.props.dataSource !== nextProps.dataSource || this.props.initialListSize !== nextProps.initialListSize) {
      this.setState(function (state, props) {
        _this2._prevRenderedRowsCount = 0;
        return {
          curRenderedRowsCount: Math.min(Math.max(state.curRenderedRowsCount, props.initialListSize), props.enableEmptySections ? props.dataSource.getRowAndSectionCount() : props.dataSource.getRowCount())
        };
      }, function () {
        return _this2._renderMoreRowsIfNeeded();
      });
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    var _this3 = this;

    this.requestAnimationFrame(function () {
      _this3._measureAndUpdateScrollProps();
    });
  },
  _onRowHighlighted: function _onRowHighlighted(sectionID, rowID) {
    this.setState({
      highlightedRow: {
        sectionID: sectionID,
        rowID: rowID
      }
    });
  },
  render: function render() {
    var bodyComponents = [];
    var dataSource = this.props.dataSource;
    var allRowIDs = dataSource.rowIdentities;
    var rowCount = 0;
    var stickySectionHeaderIndices = [];
    var renderSectionHeader = this.props.renderSectionHeader;
    var header = this.props.renderHeader && this.props.renderHeader();
    var footer = this.props.renderFooter && this.props.renderFooter();
    var totalIndex = header ? 1 : 0;

    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var sectionID = dataSource.sectionIdentities[sectionIdx];
      var rowIDs = allRowIDs[sectionIdx];

      if (rowIDs.length === 0) {
        if (this.props.enableEmptySections === undefined) {
          /* $FlowFixMe(>=0.54.0 site=react_native_oss) This comment suppresses
           * an error found when Flow v0.54 was deployed. To see the error
           * delete this comment and run Flow. */
          var warning = require('fbjs/lib/warning');

          warning(false, 'In next release empty section headers will be rendered.' + " In this release you can use 'enableEmptySections' flag to render empty section headers.");
          continue;
        } else {
          var invariant = require('fbjs/lib/invariant');

          invariant(this.props.enableEmptySections, "In next release 'enableEmptySections' flag will be deprecated, empty section headers will always be rendered." + ' If empty section headers are not desirable their indices should be excluded from sectionIDs object.' + " In this release 'enableEmptySections' may only have value 'true' to allow empty section headers rendering.");
        }
      }

      if (renderSectionHeader) {
        var element = renderSectionHeader(dataSource.getSectionHeaderData(sectionIdx), sectionID);

        if (element) {
          bodyComponents.push(_react.default.cloneElement(element, {
            key: 's_' + sectionID
          }));

          if (this.props.stickySectionHeadersEnabled) {
            stickySectionHeaderIndices.push(totalIndex);
          }

          totalIndex++;
        }
      }

      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var comboID = sectionID + '_' + rowID;
        var shouldUpdateRow = rowCount >= this._prevRenderedRowsCount && dataSource.rowShouldUpdate(sectionIdx, rowIdx);

        var row = _react.default.createElement(_StaticRenderer.default, {
          key: 'r_' + comboID,
          shouldUpdate: !!shouldUpdateRow,
          render: this.props.renderRow.bind(null, dataSource.getRowData(sectionIdx, rowIdx), sectionID, rowID, this._onRowHighlighted)
        });

        bodyComponents.push(row);
        totalIndex++;

        if (this.props.renderSeparator && (rowIdx !== rowIDs.length - 1 || sectionIdx === allRowIDs.length - 1)) {
          var adjacentRowHighlighted = this.state.highlightedRow.sectionID === sectionID && (this.state.highlightedRow.rowID === rowID || this.state.highlightedRow.rowID === rowIDs[rowIdx + 1]);
          var separator = this.props.renderSeparator(sectionID, rowID, adjacentRowHighlighted);

          if (separator) {
            bodyComponents.push(_react.default.createElement(_View.default, {
              key: 's_' + comboID
            }, separator));
            totalIndex++;
          }
        }

        if (++rowCount === this.state.curRenderedRowsCount) {
          break;
        }
      }

      if (rowCount >= this.state.curRenderedRowsCount) {
        break;
      }
    }

    var _this$props = this.props,
        renderScrollComponent = _this$props.renderScrollComponent,
        props = _objectWithoutPropertiesLoose(_this$props, ["renderScrollComponent"]);

    if (!props.scrollEventThrottle) {
      props.scrollEventThrottle = DEFAULT_SCROLL_CALLBACK_THROTTLE;
    }

    if (props.removeClippedSubviews === undefined) {
      props.removeClippedSubviews = true;
    }

    Object.assign(props, {
      onScroll: this._onScroll,
      stickyHeaderIndices: this.props.stickyHeaderIndices.concat(stickySectionHeaderIndices),
      // Do not pass these events downstream to ScrollView since they will be
      // registered in ListView's own ScrollResponder.Mixin
      onKeyboardWillShow: undefined,
      onKeyboardWillHide: undefined,
      onKeyboardDidShow: undefined,
      onKeyboardDidHide: undefined
    });
    return (0, _cloneReferencedElement.default)(renderScrollComponent(props), {
      ref: this._setScrollComponentRef,
      onContentSizeChange: this._onContentSizeChange,
      onLayout: this._onLayout,
      DEPRECATED_sendUpdatedChildFrames: typeof props.onChangeVisibleRows !== undefined
    }, header, bodyComponents, footer);
  },

  /**
   * Private methods
   */
  _measureAndUpdateScrollProps: function _measureAndUpdateScrollProps() {
    var scrollComponent = this.getScrollResponder();

    if (!scrollComponent || !scrollComponent.getInnerViewNode) {
      return;
    } // RCTScrollViewManager.calculateChildFrames is not available on
    // every platform


    RCTScrollViewManager && RCTScrollViewManager.calculateChildFrames && RCTScrollViewManager.calculateChildFrames((0, _findNodeHandle.default)(scrollComponent), this._updateVisibleRows);
  },
  _setScrollComponentRef: function _setScrollComponentRef(scrollComponent) {
    this._scrollComponent = scrollComponent;
  },
  _onContentSizeChange: function _onContentSizeChange(width, height) {
    var contentLength = !this.props.horizontal ? height : width;

    if (contentLength !== this.scrollProperties.contentLength) {
      this.scrollProperties.contentLength = contentLength;

      this._updateVisibleRows();

      this._renderMoreRowsIfNeeded();
    }

    this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);
  },
  _onLayout: function _onLayout(event) {
    var _event$nativeEvent$la = event.nativeEvent.layout,
        width = _event$nativeEvent$la.width,
        height = _event$nativeEvent$la.height;
    var visibleLength = !this.props.horizontal ? height : width;

    if (visibleLength !== this.scrollProperties.visibleLength) {
      this.scrollProperties.visibleLength = visibleLength;

      this._updateVisibleRows();

      this._renderMoreRowsIfNeeded();
    }

    this.props.onLayout && this.props.onLayout(event);
  },
  _maybeCallOnEndReached: function _maybeCallOnEndReached(event) {
    if (this.props.onEndReached && this.scrollProperties.contentLength !== this._sentEndForContentLength && this._getDistanceFromEnd(this.scrollProperties) < this.props.onEndReachedThreshold && this.state.curRenderedRowsCount === (this.props.enableEmptySections ? this.props.dataSource.getRowAndSectionCount() : this.props.dataSource.getRowCount())) {
      this._sentEndForContentLength = this.scrollProperties.contentLength;
      this.props.onEndReached(event);
      return true;
    }

    return false;
  },
  _renderMoreRowsIfNeeded: function _renderMoreRowsIfNeeded() {
    if (this.scrollProperties.contentLength === null || this.scrollProperties.visibleLength === null || this.state.curRenderedRowsCount === (this.props.enableEmptySections ? this.props.dataSource.getRowAndSectionCount() : this.props.dataSource.getRowCount())) {
      this._maybeCallOnEndReached();

      return;
    }

    var distanceFromEnd = this._getDistanceFromEnd(this.scrollProperties);

    if (distanceFromEnd < this.props.scrollRenderAheadDistance) {
      this._pageInNewRows();
    }
  },
  _pageInNewRows: function _pageInNewRows() {
    var _this4 = this;

    this.setState(function (state, props) {
      var rowsToRender = Math.min(state.curRenderedRowsCount + props.pageSize, props.enableEmptySections ? props.dataSource.getRowAndSectionCount() : props.dataSource.getRowCount());
      _this4._prevRenderedRowsCount = state.curRenderedRowsCount;
      return {
        curRenderedRowsCount: rowsToRender
      };
    }, function () {
      _this4._measureAndUpdateScrollProps();

      _this4._prevRenderedRowsCount = _this4.state.curRenderedRowsCount;
    });
  },
  _getDistanceFromEnd: function _getDistanceFromEnd(scrollProperties) {
    return scrollProperties.contentLength - scrollProperties.visibleLength - scrollProperties.offset;
  },
  _updateVisibleRows: function _updateVisibleRows(updatedFrames) {
    var _this5 = this;

    if (!this.props.onChangeVisibleRows) {
      return; // No need to compute visible rows if there is no callback
    }

    if (updatedFrames) {
      updatedFrames.forEach(function (newFrame) {
        _this5._childFrames[newFrame.index] = merge(newFrame);
      });
    }

    var isVertical = !this.props.horizontal;
    var dataSource = this.props.dataSource;
    var visibleMin = this.scrollProperties.offset;
    var visibleMax = visibleMin + this.scrollProperties.visibleLength;
    var allRowIDs = dataSource.rowIdentities;
    var header = this.props.renderHeader && this.props.renderHeader();
    var totalIndex = header ? 1 : 0;
    var visibilityChanged = false;
    var changedRows = {};

    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var rowIDs = allRowIDs[sectionIdx];

      if (rowIDs.length === 0) {
        continue;
      }

      var sectionID = dataSource.sectionIdentities[sectionIdx];

      if (this.props.renderSectionHeader) {
        totalIndex++;
      }

      var visibleSection = this._visibleRows[sectionID];

      if (!visibleSection) {
        visibleSection = {};
      }

      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var frame = this._childFrames[totalIndex];
        totalIndex++;

        if (this.props.renderSeparator && (rowIdx !== rowIDs.length - 1 || sectionIdx === allRowIDs.length - 1)) {
          totalIndex++;
        }

        if (!frame) {
          break;
        }

        var rowVisible = visibleSection[rowID];
        var min = isVertical ? frame.y : frame.x;
        var max = min + (isVertical ? frame.height : frame.width);

        if (!min && !max || min === max) {
          break;
        }

        if (min > visibleMax || max < visibleMin) {
          if (rowVisible) {
            visibilityChanged = true;
            delete visibleSection[rowID];

            if (!changedRows[sectionID]) {
              changedRows[sectionID] = {};
            }

            changedRows[sectionID][rowID] = false;
          }
        } else if (!rowVisible) {
          visibilityChanged = true;
          visibleSection[rowID] = true;

          if (!changedRows[sectionID]) {
            changedRows[sectionID] = {};
          }

          changedRows[sectionID][rowID] = true;
        }
      }

      if (!(0, _isEmpty.default)(visibleSection)) {
        this._visibleRows[sectionID] = visibleSection;
      } else if (this._visibleRows[sectionID]) {
        delete this._visibleRows[sectionID];
      }
    }

    visibilityChanged && this.props.onChangeVisibleRows(this._visibleRows, changedRows);
  },
  _onScroll: function _onScroll(e) {
    var isVertical = !this.props.horizontal;
    this.scrollProperties.visibleLength = e.nativeEvent.layoutMeasurement[isVertical ? 'height' : 'width'];
    this.scrollProperties.contentLength = e.nativeEvent.contentSize[isVertical ? 'height' : 'width'];
    this.scrollProperties.offset = e.nativeEvent.contentOffset[isVertical ? 'y' : 'x'];

    this._updateVisibleRows(e.nativeEvent.updatedChildFrames);

    if (!this._maybeCallOnEndReached(e)) {
      this._renderMoreRowsIfNeeded();
    }

    if (this.props.onEndReached && this._getDistanceFromEnd(this.scrollProperties) > this.props.onEndReachedThreshold) {
      // Scrolled out of the end zone, so it should be able to trigger again.
      this._sentEndForContentLength = null;
    }

    this.props.onScroll && this.props.onScroll(e);
  }
});
var _default = ListView;
exports.default = _default;