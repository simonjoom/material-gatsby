'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var inferno = require('inferno');
var infernoCloneVnode = require('inferno-clone-vnode');
var infernoCreateClass = require('inferno-create-class');
var infernoCreateElement = require('inferno-create-element');
var infernoExtras = require('inferno-extras');

var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
}
function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
}
function isFunction(o) {
    return typeof o === 'function';
}
function isNull(o) {
    return o === null;
}
function isTrue(o) {
    return o === true;
}
function isUndefined(o) {
    return o === void 0;
}
function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(("Inferno Error: " + message));
}

function isSameInnerHTML(dom, innerHTML) {
    var tempdom = document.createElement('i');
    tempdom.innerHTML = innerHTML;
    return tempdom.innerHTML === dom.innerHTML;
}
function findLastDOMFromVNode(vNode) {
    var flags;
    var children;
    while (vNode) {
        flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            return vNode.dom;
        }
        children = vNode.children;
        if (flags & 8192 /* Fragment */) {
            vNode = vNode.childFlags === 2 /* HasVNodeChildren */ ? children : children[children.length - 1];
        }
        else if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        else {
            vNode = children;
        }
    }
    return null;
}
function isSamePropsInnerHTML(dom, props) {
    return Boolean(props && props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html && isSameInnerHTML(dom, props.dangerouslySetInnerHTML.__html));
}
function hydrateComponent(vNode, parentDOM, dom, context, isSVG, isClass) {
    var type = vNode.type;
    var ref = vNode.ref;
    var props = vNode.props || {};
    var currentNode;
    if (isClass) {
        var instance = inferno._CI(vNode, type, props, context);
        var input = instance.$LI;
        currentNode = hydrateVNode(input, parentDOM, dom, instance.$CX, isSVG);
        inferno._MCCC(ref, instance);
        instance.$UPD = false; // Mount finished allow going sync
    }
    else {
        var input$1 = inferno._HI(type(props, context));
        currentNode = hydrateVNode(input$1, parentDOM, dom, context, isSVG);
        vNode.children = input$1;
        inferno._MFCC(props, ref, vNode);
    }
    return currentNode;
}
function hydrateChildren(parentVNode, parentNode, currentNode, context, isSVG) {
    var childFlags = parentVNode.childFlags;
    var children = parentVNode.children;
    var props = parentVNode.props;
    var flags = parentVNode.flags;
    if (childFlags !== 1 /* HasInvalidChildren */) {
        if (childFlags === 2 /* HasVNodeChildren */) {
            if (isNull(currentNode)) {
                inferno._M(children, parentNode, context, isSVG, null);
            }
            else {
                currentNode = hydrateVNode(children, parentNode, currentNode, context, isSVG);
                currentNode = currentNode ? currentNode.nextSibling : null;
            }
        }
        else if (childFlags === 16 /* HasTextChildren */) {
            if (isNull(currentNode)) {
                parentNode.appendChild(document.createTextNode(children));
            }
            else if (parentNode.childNodes.length !== 1 || currentNode.nodeType !== 3) {
                parentNode.textContent = children;
            }
            else {
                if (currentNode.nodeValue !== children) {
                    currentNode.nodeValue = children;
                }
            }
            currentNode = null;
        }
        else if (childFlags & 12 /* MultipleChildren */) {
            var prevVNodeIsTextNode = false;
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                if (isNull(currentNode) || (prevVNodeIsTextNode && (child.flags & 16 /* Text */) > 0)) {
                    inferno._M(child, parentNode, context, isSVG, currentNode);
                }
                else {
                    currentNode = hydrateVNode(child, parentNode, currentNode, context, isSVG);
                    currentNode = currentNode ? currentNode.nextSibling : null;
                }
                prevVNodeIsTextNode = (child.flags & 16 /* Text */) > 0;
            }
        }
        // clear any other DOM nodes, there should be only a single entry for the root
        if ((flags & 8192 /* Fragment */) === 0) {
            var nextSibling = null;
            while (currentNode) {
                nextSibling = currentNode.nextSibling;
                parentNode.removeChild(currentNode);
                currentNode = nextSibling;
            }
        }
    }
    else if (!isNull(parentNode.firstChild) && !isSamePropsInnerHTML(parentNode, props)) {
        parentNode.textContent = ''; // dom has content, but VNode has no children remove everything from DOM
        if (flags & 448 /* FormElement */) {
            // If element is form element, we need to clear defaultValue also
            parentNode.defaultValue = '';
        }
    }
}
function hydrateElement(vNode, parentDOM, dom, context, isSVG) {
    var props = vNode.props;
    var className = vNode.className;
    var flags = vNode.flags;
    var ref = vNode.ref;
    isSVG = isSVG || (flags & 32 /* SvgElement */) > 0;
    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type) {
        inferno._ME(vNode, null, context, isSVG, null);
        parentDOM.replaceChild(vNode.dom, dom);
    }
    else {
        vNode.dom = dom;
        hydrateChildren(vNode, dom, dom.firstChild, context, isSVG);
        if (!isNull(props)) {
            inferno._MP(vNode, flags, props, dom, isSVG);
        }
        if (isNullOrUndef(className)) {
            if (dom.className !== '') {
                dom.removeAttribute('class');
            }
        }
        else if (isSVG) {
            dom.setAttribute('class', className);
        }
        else {
            dom.className = className;
        }
        inferno._MR(ref, dom);
    }
    return vNode.dom;
}
function hydrateText(vNode, parentDOM, dom) {
    if (dom.nodeType !== 3) {
        inferno._MT(vNode, null, null);
        parentDOM.replaceChild(vNode.dom, dom);
    }
    else {
        var text = vNode.children;
        if (dom.nodeValue !== text) {
            dom.nodeValue = text;
        }
        vNode.dom = dom;
    }
    return vNode.dom;
}
function hydrateFragment(vNode, parentDOM, dom, context, isSVG) {
    var children = vNode.children;
    if (vNode.childFlags === 2 /* HasVNodeChildren */) {
        hydrateText(children, parentDOM, dom);
        return children.dom;
    }
    hydrateChildren(vNode, parentDOM, dom, context, isSVG);
    return findLastDOMFromVNode(children[children.length - 1]);
}
function hydrateVNode(vNode, parentDOM, currentDom, context, isSVG) {
    var flags = (vNode.flags |= 16384 /* InUse */);
    if (flags & 14 /* Component */) {
        return hydrateComponent(vNode, parentDOM, currentDom, context, isSVG, (flags & 4 /* ComponentClass */) > 0);
    }
    if (flags & 481 /* Element */) {
        return hydrateElement(vNode, parentDOM, currentDom, context, isSVG);
    }
    if (flags & 16 /* Text */) {
        return hydrateText(vNode, parentDOM, currentDom);
    }
    if (flags & 512 /* Void */) {
        return (vNode.dom = currentDom);
    }
    if (flags & 8192 /* Fragment */) {
        return hydrateFragment(vNode, parentDOM, currentDom, context, isSVG);
    }
    throwError();
    return null;
}
function hydrate(input, parentDOM, callback) {
    var dom = parentDOM.firstChild;
    if (isNull(dom)) {
        inferno.render(input, parentDOM, callback);
    }
    else {
        if (!isInvalid(input)) {
            dom = hydrateVNode(input, parentDOM, dom, {}, false);
        }
        // clear any other DOM nodes, there should be only a single entry for the root
        while (dom && (dom = dom.nextSibling)) {
            parentDOM.removeChild(dom);
        }
    }
    if (inferno._L.length > 0) {
        var listener;
        while ((listener = inferno._L.shift()) !== undefined) {
            listener();
        }
    }
    parentDOM.$V = input;
    if (isFunction(callback)) {
        callback();
    }
}

var isArray = Array.isArray;
function isNullOrUndef$1(o) {
    return isUndefined$1(o) || isNull$1(o);
}
function isInvalid$1(o) {
    return isNull$1(o) || o === false || isTrue$1(o) || isUndefined$1(o);
}
function isFunction$1(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}
function isNumber(o) {
    return typeof o === 'number';
}
function isNull$1(o) {
    return o === null;
}
function isTrue$1(o) {
    return o === true;
}
function isUndefined$1(o) {
    return o === void 0;
}
function isObject(o) {
    return typeof o === 'object';
}
function warning(message) {
    // tslint:disable-next-line:no-console
    console.error(message);
}

function isValidElement(obj) {
    var isNotANullObject = isObject(obj) && isNull$1(obj) === false;
    if (isNotANullObject === false) {
        return false;
    }
    var flags = obj.flags;
    return (flags & (14 /* Component */ | 481 /* Element */)) > 0;
}

/**
 * @module Inferno-Compat
 */
/**
 * Inlined PropTypes, there is propType checking ATM.
 */
// tslint:disable-next-line:no-empty
function proptype() { }
proptype.isRequired = proptype;
var getProptype = function () { return proptype; };
var PropTypes = {
    any: getProptype,
    array: proptype,
    arrayOf: getProptype,
    bool: proptype,
    checkPropTypes: function () { return null; },
    element: getProptype,
    func: proptype,
    instanceOf: getProptype,
    node: getProptype,
    number: proptype,
    object: proptype,
    objectOf: getProptype,
    oneOf: getProptype,
    oneOfType: getProptype,
    shape: getProptype,
    string: proptype,
    symbol: proptype
};

/**
 * This is a list of all SVG attributes that need special casing,
 * namespacing, or boolean value assignment.
 *
 * When adding attributes to this list, be sure to also add them to
 * the `possibleStandardNames` module to ensure casing and incorrect
 * name warnings.
 *
 * SVG Attributes List:
 * https://www.w3.org/TR/SVG/attindex.html
 * SMIL Spec:
 * https://www.w3.org/TR/smil
 */
var ATTRS = [
    'accent-height',
    'alignment-baseline',
    'arabic-form',
    'baseline-shift',
    'cap-height',
    'clip-path',
    'clip-rule',
    'color-interpolation',
    'color-interpolation-filters',
    'color-profile',
    'color-rendering',
    'dominant-baseline',
    'enable-background',
    'fill-opacity',
    'fill-rule',
    'flood-color',
    'flood-opacity',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-constiant',
    'font-weight',
    'glyph-name',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'horiz-adv-x',
    'horiz-origin-x',
    'image-rendering',
    'letter-spacing',
    'lighting-color',
    'marker-end',
    'marker-mid',
    'marker-start',
    'overline-position',
    'overline-thickness',
    'paint-order',
    'panose-1',
    'pointer-events',
    'rendering-intent',
    'shape-rendering',
    'stop-color',
    'stop-opacity',
    'strikethrough-position',
    'strikethrough-thickness',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-anchor',
    'text-decoration',
    'text-rendering',
    'underline-position',
    'underline-thickness',
    'unicode-bidi',
    'unicode-range',
    'units-per-em',
    'v-alphabetic',
    'v-hanging',
    'v-ideographic',
    'v-mathematical',
    'vector-effect',
    'vert-adv-y',
    'vert-origin-x',
    'vert-origin-y',
    'word-spacing',
    'writing-mode',
    'x-height',
    'xlink:actuate',
    'xlink:arcrole',
    'xlink:href',
    'xlink:role',
    'xlink:show',
    'xlink:title',
    'xlink:type',
    'xml:base',
    'xmlns:xlink',
    'xml:lang',
    'xml:space'
];
var SVGDOMPropertyConfig = {};
var CAMELIZE = /[\-\:]([a-z])/g;
var capitalize = function (token) { return token[1].toUpperCase(); };
ATTRS.forEach(function (original) {
    var reactName = original.replace(CAMELIZE, capitalize);
    SVGDOMPropertyConfig[reactName] = original;
});

function getNumberStyleValue(style, value) {
    switch (style) {
        case 'animation-iteration-count':
        case 'border-image-outset':
        case 'border-image-slice':
        case 'border-image-width':
        case 'box-flex':
        case 'box-flex-group':
        case 'box-ordinal-group':
        case 'column-count':
        case 'fill-opacity':
        case 'flex':
        case 'flex-grow':
        case 'flex-negative':
        case 'flex-order':
        case 'flex-positive':
        case 'flex-shrink':
        case 'flood-opacity':
        case 'font-weight':
        case 'grid-column':
        case 'grid-row':
        case 'line-clamp':
        case 'line-height':
        case 'opacity':
        case 'order':
        case 'orphans':
        case 'stop-opacity':
        case 'stroke-dasharray':
        case 'stroke-dashoffset':
        case 'stroke-miterlimit':
        case 'stroke-opacity':
        case 'stroke-width':
        case 'tab-size':
        case 'widows':
        case 'z-index':
        case 'zoom':
            return value;
        default:
            return value + 'px';
    }
}
var uppercasePattern = /[A-Z]/g;
function hyphenCase(str) {
    return str.replace(uppercasePattern, '-$&').toLowerCase();
}

inferno.options.reactStyles = true;
function unmountComponentAtNode(container) {
    inferno.__render(null, container);
    return true;
}
function flatten(arr, result) {
    for (var i = 0, len = arr.length; i < len; i++) {
        var value = arr[i];
        if (isArray(value)) {
            flatten(value, result);
        }
        else {
            result.push(value);
        }
    }
    return result;
}
var ARR = [];
var Children = {
    map: function map(children, fn, ctx) {
        if (isNullOrUndef$1(children)) {
            return children;
        }
        children = Children.toArray(children);
        if (ctx && ctx !== children) {
            fn = fn.bind(ctx);
        }
        return children.map(fn);
    },
    forEach: function forEach(children, fn, ctx) {
        if (isNullOrUndef$1(children)) {
            return;
        }
        children = Children.toArray(children);
        if (ctx && ctx !== children) {
            fn = fn.bind(ctx);
        }
        for (var i = 0, len = children.length; i < len; i++) {
            var child = isInvalid$1(children[i]) ? null : children[i];
            fn(child, i, children);
        }
    },
    count: function count(children) {
        children = Children.toArray(children);
        return children.length;
    },
    only: function only(children) {
        children = Children.toArray(children);
        if (children.length !== 1) {
            throw new Error('Children.only() expects only one child.');
        }
        return children[0];
    },
    toArray: function toArray(children) {
        if (isNullOrUndef$1(children)) {
            return [];
        }
        // We need to flatten arrays here,
        // because React does it also and application level code might depend on that behavior
        if (isArray(children)) {
            var result = [];
            flatten(children, result);
            return result;
        }
        return ARR.concat(children);
    }
};
inferno.Component.prototype.isReactComponent = {};
var version = '15.4.2';
function normalizeGenericProps(props) {
    for (var prop in props) {
        if (prop === 'onDoubleClick') {
            props.onDblClick = props[prop];
            props[prop] = void 0;
        }
        if (prop === 'htmlFor') {
            props.for = props[prop];
            props[prop] = void 0;
        }
        var mappedProp = SVGDOMPropertyConfig[prop];
        if (mappedProp && props[prop] && mappedProp !== prop) {
            props[mappedProp] = props[prop];
            props[prop] = void 0;
        }
        if (inferno.options.reactStyles && prop === 'style') {
            var styles = props.style;
            if (styles && !isString(styles)) {
                var newStyles = {};
                for (var s in styles) {
                    var value = styles[s];
                    var hyphenStr = hyphenCase(s);
                    newStyles[hyphenStr] = isNumber(value) ? getNumberStyleValue(hyphenStr, value) : value;
                }
                props.style = newStyles;
            }
        }
    }
}
function normalizeFormProps(name, props) {
    if ((name === 'input' || name === 'textarea') && props.type !== 'radio' && props.onChange) {
        var type = props.type;
        var eventName;
        if (!type || type === 'text') {
            eventName = 'oninput';
        }
        if (eventName && !props[eventName]) {
            {
                var existingMethod = props.oninput || props.onInput;
                if (existingMethod) {
                    warning(("Inferno-compat Warning! 'onInput' handler is reserved to support React like 'onChange' event flow.\nOriginal event handler 'function " + (existingMethod.name) + "' will not be called."));
                }
            }
            props[eventName] = props.onChange;
            props.onChange = void 0;
        }
    }
}
// we need to add persist() to Event (as React has it for synthetic events)
// this is a hack and we really shouldn't be modifying a global object this way,
// but there isn't a performant way of doing this apart from trying to proxy
// every prop event that starts with "on", i.e. onClick or onKeyPress
// but in reality devs use onSomething for many things, not only for
// input events
if (typeof Event !== 'undefined') {
    var eventProtoType = Event.prototype;
    if (!eventProtoType.persist) {
        // tslint:disable-next-line:no-empty
        eventProtoType.persist = function () { };
    }
    if (!eventProtoType.isDefaultPrevented) {
        eventProtoType.isDefaultPrevented = function () {
            return this.defaultPrevented;
        };
    }
    if (!eventProtoType.isPropagationStopped) {
        eventProtoType.isPropagationStopped = function () {
            return this.cancelBubble;
        };
    }
}
function iterableToArray(iterable) {
    var iterStep;
    var tmpArr = [];
    do {
        iterStep = iterable.next();
        tmpArr.push(iterStep.value);
    } while (!iterStep.done);
    return tmpArr;
}
var g = typeof window === 'undefined' ? global : window;
var hasSymbolSupport = typeof g.Symbol !== 'undefined';
var symbolIterator = hasSymbolSupport ? g.Symbol.iterator : '';
var oldCreateVNode = inferno.options.createVNode;
inferno.options.createVNode = function (vNode) {
    var children = vNode.children;
    var props = vNode.props;
    if (isNullOrUndef$1(props)) {
        props = vNode.props = {};
    }
    // React supports iterable children, in addition to Array-like
    if (hasSymbolSupport && !isNull$1(children) && typeof children === 'object' && !isArray(children) && isFunction$1(children[symbolIterator])) {
        vNode.children = iterableToArray(children[symbolIterator]());
    }
    if (!isNullOrUndef$1(children) && isNullOrUndef$1(props.children)) {
        props.children = children;
    }
    if (vNode.flags & 14 /* Component */) {
        if (isString(vNode.type)) {
            vNode.flags = inferno.getFlagsForElementVnode(vNode.type);
            if (props) {
                inferno.normalizeProps(vNode);
            }
        }
    }
    var flags = vNode.flags;
    if (flags & 448 /* FormElement */) {
        normalizeFormProps(vNode.type, props);
    }
    if (flags & 481 /* Element */) {
        if (vNode.className) {
            props.className = vNode.className;
        }
        normalizeGenericProps(props);
    }
    if (oldCreateVNode) {
        oldCreateVNode(vNode);
    }
};
// Credit: preact-compat - https://github.com/developit/preact-compat :)
function shallowDiffers(a, b) {
    var i;
    for (i in a) {
        if (!(i in b)) {
            return true;
        }
    }
    for (i in b) {
        if (a[i] !== b[i]) {
            return true;
        }
    }
    return false;
}
var PureComponent = (function (Component) {
    function PureComponent () {
        Component.apply(this, arguments);
    }

    if ( Component ) PureComponent.__proto__ = Component;
    PureComponent.prototype = Object.create( Component && Component.prototype );
    PureComponent.prototype.constructor = PureComponent;

    PureComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate (props, state) {
        return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    };

    return PureComponent;
}(inferno.Component));
var WrapperComponent = (function (Component) {
    function WrapperComponent () {
        Component.apply(this, arguments);
    }

    if ( Component ) WrapperComponent.__proto__ = Component;
    WrapperComponent.prototype = Object.create( Component && Component.prototype );
    WrapperComponent.prototype.constructor = WrapperComponent;

    WrapperComponent.prototype.getChildContext = function getChildContext () {
        // tslint:disable-next-line
        return this.props.context;
    };
    WrapperComponent.prototype.render = function render (props) {
        return props.children;
    };

    return WrapperComponent;
}(inferno.Component));
function unstable_renderSubtreeIntoContainer(parentComponent, vNode, container, callback) {
    var wrapperVNode = inferno.createComponentVNode(4 /* ComponentClass */, WrapperComponent, {
        children: vNode,
        context: parentComponent.context
    });
    render(wrapperVNode, container, null);
    var component = vNode.children;
    if (callback) {
        // callback gets the component as context, no other argument.
        callback.call(component);
    }
    return component;
}
function createFactory(type) {
    return infernoCreateElement.createElement.bind(null, type);
}
function render(rootInput, container, cb, context) {
    inferno.__render(rootInput, container, cb, context);
    var input = container.$V;
    if (input && input.flags & 14 /* Component */) {
        return input.children;
    }
}
// Mask React global in browser enviornments when React is not used.
if (typeof window !== 'undefined' && typeof window.React === 'undefined') {
    var exports$1 = {
        Children: Children,
        Component: inferno.Component,
        EMPTY_OBJ: inferno.EMPTY_OBJ,
        Fragment: inferno.Fragment,
        PropTypes: PropTypes,
        PureComponent: PureComponent,
        // Internal methods
        _CI: inferno._CI,
        _HI: inferno._HI,
        _L: inferno._L,
        _M: inferno._M,
        _MCCC: inferno._MCCC,
        _ME: inferno._ME,
        _MFCC: inferno._MFCC,
        _MP: inferno._MP,
        _MR: inferno._MR,
        _MT: inferno._MT,
        __render: inferno.__render,
        // Public methods
        cloneElement: infernoCloneVnode.cloneVNode,
        cloneVNode: infernoCloneVnode.cloneVNode,
        createClass: infernoCreateClass.createClass,
        createComponentVNode: inferno.createComponentVNode,
        createElement: infernoCreateElement.createElement,
        createFactory: createFactory,
        createFragment: inferno.createFragment,
        createPortal: inferno.createPortal,
        createRef: inferno.createRef,
        createRenderer: inferno.createRenderer,
        createTextVNode: inferno.createTextVNode,
        createVNode: inferno.createVNode,
        directClone: inferno.directClone,
        findDOMNode: infernoExtras.findDOMNode,
        findDOMfromVNode: inferno.findDOMfromVNode,
        forwardRef: inferno.forwardRef,
        getFlagsForElementVnode: inferno.getFlagsForElementVnode,
        hydrate: hydrate,
        isValidElement: isValidElement,
        linkEvent: inferno.linkEvent,
        normalizeProps: inferno.normalizeProps,
        options: inferno.options,
        render: render,
        rerender: inferno.rerender,
        unmountComponentAtNode: unmountComponentAtNode,
        unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
        version: version
    };
    window.React = exports$1;
    window.ReactDOM = exports$1;
}
var index = {
    Children: Children,
    Component: inferno.Component,
    EMPTY_OBJ: inferno.EMPTY_OBJ,
    Fragment: inferno.Fragment,
    PropTypes: PropTypes,
    PureComponent: PureComponent,
    // Internal methods
    _CI: inferno._CI,
    _HI: inferno._HI,
    _L: inferno._L,
    _M: inferno._M,
    _MCCC: inferno._MCCC,
    _ME: inferno._ME,
    _MFCC: inferno._MFCC,
    _MP: inferno._MP,
    _MR: inferno._MR,
    _MT: inferno._MT,
    __render: inferno.__render,
    // Public methods
    cloneElement: infernoCloneVnode.cloneVNode,
    cloneVNode: infernoCloneVnode.cloneVNode,
    createClass: infernoCreateClass.createClass,
    createComponentVNode: inferno.createComponentVNode,
    createElement: infernoCreateElement.createElement,
    createFactory: createFactory,
    createFragment: inferno.createFragment,
    createPortal: inferno.createPortal,
    createRef: inferno.createRef,
    createRenderer: inferno.createRenderer,
    createTextVNode: inferno.createTextVNode,
    createVNode: inferno.createVNode,
    directClone: inferno.directClone,
    findDOMNode: infernoExtras.findDOMNode,
    findDOMfromVNode: inferno.findDOMfromVNode,
    forwardRef: inferno.forwardRef,
    getFlagsForElementVnode: inferno.getFlagsForElementVnode,
    hydrate: hydrate,
    isValidElement: isValidElement,
    linkEvent: inferno.linkEvent,
    normalizeProps: inferno.normalizeProps,
    options: inferno.options,
    render: render,
    rerender: inferno.rerender,
    unmountComponentAtNode: unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
    version: version
};

exports.Component = inferno.Component;
exports.EMPTY_OBJ = inferno.EMPTY_OBJ;
exports.Fragment = inferno.Fragment;
exports._CI = inferno._CI;
exports._HI = inferno._HI;
exports._L = inferno._L;
exports._M = inferno._M;
exports._MCCC = inferno._MCCC;
exports._ME = inferno._ME;
exports._MFCC = inferno._MFCC;
exports._MP = inferno._MP;
exports._MR = inferno._MR;
exports._MT = inferno._MT;
exports.__render = inferno.__render;
exports.createComponentVNode = inferno.createComponentVNode;
exports.createFragment = inferno.createFragment;
exports.createPortal = inferno.createPortal;
exports.createRef = inferno.createRef;
exports.createRenderer = inferno.createRenderer;
exports.createTextVNode = inferno.createTextVNode;
exports.createVNode = inferno.createVNode;
exports.directClone = inferno.directClone;
exports.findDOMfromVNode = inferno.findDOMfromVNode;
exports.forwardRef = inferno.forwardRef;
exports.getFlagsForElementVnode = inferno.getFlagsForElementVnode;
exports.linkEvent = inferno.linkEvent;
exports.normalizeProps = inferno.normalizeProps;
exports.options = inferno.options;
exports.rerender = inferno.rerender;
exports.cloneElement = infernoCloneVnode.cloneVNode;
exports.cloneVNode = infernoCloneVnode.cloneVNode;
exports.createClass = infernoCreateClass.createClass;
exports.createElement = infernoCreateElement.createElement;
exports.findDOMNode = infernoExtras.findDOMNode;
exports.Children = Children;
exports.PropTypes = PropTypes;
exports.PureComponent = PureComponent;
exports.createFactory = createFactory;
exports.hydrate = hydrate;
exports.isValidElement = isValidElement;
exports.render = render;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.unstable_renderSubtreeIntoContainer = unstable_renderSubtreeIntoContainer;
exports.version = version;
exports.default = index;
