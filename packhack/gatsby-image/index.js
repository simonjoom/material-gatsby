import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

// Handle legacy names for image queries.

var imageCache = {};

var inImageCache = function inImageCache(convertedProps) { 
  var src = convertedProps.fluid.src; // ? convertedProps.fluid.src
  // : convertedProps.fixed.src

  if (imageCache[src]) {
    return true;
  } else {
    imageCache[src] = true;
    return false;
  }
};

var io;
var listeners = [];

function getIO() {
  if (typeof io === "undefined" && typeof window !== "undefined" && window.IntersectionObserver) { 
    io = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        listeners.forEach(function (l) {
          if (l[0] === entry.target) {
            // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
            if (entry.isIntersecting || entry.intersectionRatio > 0) { 
              io.unobserve(l[0]);
              l[1]();
            }
          }
        });
      });
    }, {
      rootMargin: "200px"
    });
  }

  return io;
}

var listenToIntersections = function listenToIntersections(el, cb) {
  getIO().observe(el);
  listeners.push([el, cb]);
};

var isWebpSupportedCache = null;

var isWebpSupported = function isWebpSupported() {
  if (isWebpSupportedCache !== null) {
    return isWebpSupportedCache;
  }

  var elem = typeof window !== "undefined" ? window.document.createElement("canvas") : {};

  if (elem.getContext && elem.getContext("2d")) {
    isWebpSupportedCache = elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  } else {
    isWebpSupportedCache = false;
  }
  
  return isWebpSupportedCache;
};
/*
const Img = props => {
  const { style, onLoad, onError, ...otherProps } = props
  return (
    <img
      {...otherProps}
      onLoad={onLoad}
      onError={onError}
      style={{
        position: `absolute`,
        top: 0,
        left: 0,
        transition: `opacity 0.5s`,
        width: `100%`,
        height: `100%`,
        objectFit: `cover`,
        objectPosition: `center`,
        ...style,
      }}
    />
  )
}

Img.propTypes = {
  style: PropTypes.object,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
}*/

var calculImg=function srcset(image, mxW, mxH, aspectRatio,maxWidth) {
    var maxW, maxHeight, bigW, bigH,images; 
    if (image.srcWebp && image.srcSetWebp && isWebpSupported()) {
      images=image.srcSetWebp;
      }else{
      images=image.srcSet;
      }
      
var fullscreen=false;
    if (typeof window !== 'undefined') {
      bigW = window.innerWidth > 0 ? window.innerWidth : screen.width;
      bigH = window.innerHeight > 0 ? window.innerHeight : screen.height;
    } else {
      bigW = 800;
      bigH = 600;
    }

    if (mxW) {
      if (typeof mxW == "string" && mxW.indexOf("%") !== -1) maxW = bigW * (parseInt(mxW) / 100);else maxW = parseInt(mxW, 10);
    } else {
      maxW = bigW;
    }

    if (mxH) {
      if (typeof mxH == "string" && mxH.indexOf("%") !== -1) maxHeight = bigH * (parseInt(mxH) / 100);else maxHeight = parseInt(mxH, 10);
    } else {
      maxHeight = bigH;
    }
    maxW = maxWidth && parseInt(maxWidth) < maxW ? parseInt(maxWidth) : maxW;
    var maxDensity = 1;
    var ratio = 1 / aspectRatio;
     
if(maxW * ratio>maxHeight){
maxW=maxHeight/ratio
} 

    if (typeof window !== 'undefined') {
      maxDensity = window.devicePixelRatio;
    } 
    
    var filename, density, height, width, widthresult, widthresultabs, filenameresult;
    var candidates = images.split(',');  
    if (candidates.length == 0) return false;
    var widthresultabs = 10000;

    for (var i = 0; i < candidates.length; i++) {
      // The following regular expression was created based on the rules
      // in the srcset W3C specification available at:
      // http://www.w3.org/html/wg/drafts/srcset/w3c-srcset/
      var descriptors = candidates[i].match(/^\s*([^\s]+)\s*(\s(\d+)w)?\s*(\s(\d+)h)?\s*(\s(\d+)x)?\s*$/);
      filename = descriptors[1];
      width = parseInt(descriptors[3], 10) || false; //if (width) height = width * ratio;

      density = descriptors[7] || 1;  
      if (width && Math.abs(width - maxW*maxDensity) < widthresultabs) {
        widthresult = width;
        height = widthresult * ratio;
        filenameresult = filename;
        widthresultabs = Math.abs(width - maxW*maxDensity);
        continue;
      }

      if (density && density > maxDensity) {
        continue;
      }   
      break;
    /*  widthresult=widthresult>maxW?maxW:widthresult
      height=height>maxHeight/2?maxHeight/2.2:height/1.2
      return {
        result: filenameresult,
        width: widthresult,
         height : fullscreen?maxHeight:height,
      };*/
    }
        
      widthresult=widthresult>maxW?maxW:widthresult
      height=height>maxHeight/2?maxHeight/2.2:height/1.2
    return {
      result: filenameresult,
        width: widthresult,
         height : fullscreen?maxHeight:height,
    };
}

var GatsbyImage =
/*#__PURE__*/
function (_React$Component) {
  babelHelpers.inheritsLoose(GatsbyImage, _React$Component);

  function GatsbyImage(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // If this browser doesn't support the IntersectionObserver API
    // we default to start downloading the image right away.

    var isVisible = true;
    var imgLoaded = true;
    var IOSupported = false;
    var Imgheight; // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.

    var _convertProps = babelHelpers.extends({},props,{fluid:props.fluid?props.fluid:props.sizes}); 
    var seenBefore = inImageCache(_convertProps);
    
    if (!seenBefore && typeof window !== "undefined" && window.IntersectionObserver) {
      isVisible = false;
      imgLoaded = false;
      IOSupported = true;
    } // Always don't render image while server rendering

if(false){
     isVisible = true;
     imgLoaded = false;
}

    _this.state = {
      Imgheight: Imgheight,
      isVisible: isVisible,
      imgLoaded: imgLoaded,
      IOSupported: IOSupported
    };
    _this.handleRef = _this.handleRef.bind(babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(_this)));
    
    //_this.handleRef = _this.handleRef.bind(this)
   var width = _convertProps.width; 
    var  height = _convertProps.height;
    var image = _convertProps.fluid;
 _this.srcImage = calculImg(image, width, height,image.aspectRatio,_this.props.maxWidth);
     
      if (image.srcWebp && image.srcSetWebp && isWebpSupported()) {
        _this.srcSet = image.srcSetWebp;
      } else {
        _this.srcSet = image.srcSet;
      } 
      
    return _this;
  } // Implement srcset


  var _proto = GatsbyImage.prototype;
 
  _proto.handleRef = function handleRef(ref) {
    var _this2 = this;
    if (_this2.state.IOSupported && ref) {
      listenToIntersections(ref, function () {
        _this2.setState({
          isVisible: true,
          imgLoaded: false
        });
      });
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    var _convertProps = this.props,
        title = _convertProps.title,
        alt = _convertProps.alt,
        resizeMode = _convertProps.resizeMode,
        width = _convertProps.width,
        content = _convertProps.content,
        maxWidth = _convertProps.maxWidth,
        height = _convertProps.height,
        className = _convertProps.className,
        outerWrapperClassName = _convertProps.outerWrapperClassName,
        _convertProps$imgStyl = _convertProps.imgStyle,
        style = _convertProps.style,
        positionImage= _convertProps.positionImage,
        imgStyle = _convertProps$imgStyl === void 0 ? {} : _convertProps$imgStyl,
        _convertProps$placeho = _convertProps.placeholderStyle,
        placeholderStyle = _convertProps$placeho === void 0 ? {} : _convertProps$placeho,
        fluid = _convertProps.fluid?_convertProps.fluid:_convertProps.sizes,
        backgroundColor = _convertProps.backgroundColor;
 
    var bgColor;

    if (typeof backgroundColor === "boolean") {
      bgColor = "lightgray";
    } else {
      bgColor = backgroundColor;
    }

    if (fluid) {
      var image = fluid; // var Pattern = /\(max-width: (.*)px\).*vw, (.*)px/

      var srcImage, src, srcSet, presentationHeight, Pattern, match;
	
 

      var imagePlaceholderStyle = babelHelpers.extends({
        opacity: !this.state.imgLoaded ? 1 : 0,
        width:"auto !important",
        transitionDelay: "0.25s"
      }, imgStyle, placeholderStyle,positionImage=="right"?{right:"0px"}:{});
      
      var imageStyle = babelHelpers.extends({
        opacity: this.state.imgLoaded ? 1 : 0,
        transitionDelay: "0.25s"
      }, imgStyle,positionImage=="right"?
{backgroundPosition: "right top"}:{backgroundPosition: "center top"}); // Use webp by default if browser supports it
 
/*
      if (image.srcWebp && image.srcSetWebp && isWebpSupported()) {
        srcImage = this.srcset(image.srcSetWebp, width, height, image.aspectRatio);
        srcSet = image.srcSetWebp;
      } else {
        srcImage = this.srcset(image.srcSet, width, height, image.aspectRatio);
        srcSet = image.srcSet;
      }*/
 
      src = this.srcImage.result;
   //   image.width = this.srcImage.width;
   //   image.height = this.srcImage.height;
      	presentationHeight = height?height:this.srcImage.height
      	
      var srcFront = image.tracedSVG; //|| image.base64 not good 
      var bgStyle = {
        backgroundColor: bgColor,
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
      };
      var rootImg="https://cdn.skiscool.com";
      var isconstrained = width !== '100%' && width; // The outer div is necessary to reset the z-index to 0.

      /*   style={{
           height: presentationHeight ? presentationHeight : 'auto',
           width: width !== '100%' ? srcImage.width : '100%',
         }}*/
var stylecontainer=babelHelpers.extends({
          width: width ? width : "100%",
          maxWidth: maxWidth,
          margin: '0 auto',
          position: 'relative',
          alignSelf: "center"
        },style);
        
      return React.createElement("div", {
        style: stylecontainer,
        className: className
      }, bgColor && React.createElement(View, {
        title: title,
        style: bgStyle
      }), React.createElement("div", {
        ref: this.handleRef
      }, content), _this3.state.isVisible && React.createElement(Image, {
        accessibilityLabel: alt,
        resizeMode: resizeMode,
        title: title,
        defaultSource: srcFront,
        source: rootImg+src,
        srcSet: rootImg+srcSet,
        sizes: image.sizes,
        styleAccessibilityImage: imagePlaceholderStyle,
        styleImage: imageStyle,
        style: {
           paddingBottom: presentationHeight,
          maxWidth: '100%',
          opacity: 1,
          transitionDelay: "0.35s"
        },
        onLoadEnd: function onLoadEnd() {
          _this3.state.IOSupported && _this3.setState({
            imgLoaded: true
          });
          _this3.props.onLoad && _this3.props.onLoad();
        },
        onError: this.props.onError
      }));
    }

    return null;
  };

  return GatsbyImage;
}(React.Component);

Image.defaultProps = {
  fadeIn: true,
  alt: "",
  resizeMode: 'center'
};
var fixedObject = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string
});
var fluidObject = PropTypes.shape({
  aspectRatio: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  sizes: PropTypes.string.isRequired,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string
});
/*
Image.propTypes = {
  resolutions: fixedObject,
  sizes: fluidObject,
  fluid: fluidObject,
  fadeIn: PropTypes.bool,
  title: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  outerWrapperClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  style: PropTypes.object,
  imgStyle: PropTypes.object,
  placeholderStyle: PropTypes.object,
  position: PropTypes.string,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
   style={{
               // height: this.state.Imgheight || presentationHeight,
               // maxWidth: '100%',
              }}
}*/

export {calculImg,listenToIntersections};

export default GatsbyImage;