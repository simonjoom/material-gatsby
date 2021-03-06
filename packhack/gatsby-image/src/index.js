import React from 'react'
import PropTypes from 'prop-types'
import { View, Image } from 'react-native'
/*
const FancyImage = React.forwardRef((props, ref) => (
  <Image forwardedRef={ref} {...props} />
))
const ref = React.createRef()*/
// Handle legacy names for image queries.
 
// Cache if we've seen an image before so we don't both with
// lazy-loading & fading in on subsequent mounts.
const imageCache = {}
const inImageCache = convertedProps => { 
  // Find src
  const src = convertedProps.fluid.src
  // ? convertedProps.fluid.src
  // : convertedProps.fixed.src

  if (imageCache[src]) {
    return true
  } else {
    imageCache[src] = true
    return false
  }
}

let io
const listeners = []

function getIO() {
  if (
    typeof io === `undefined` &&
    typeof window !== `undefined` &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          listeners.forEach(l => {
            if (l[0] === entry.target) {
              // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                io.unobserve(l[0])
                l[1]()
              }
            }
          })
        })
      },
      { rootMargin: `200px` }
    )
  }

  return io
}

const listenToIntersections = (el, cb) => {
  getIO().observe(el)
  listeners.push([el, cb])
}

let isWebpSupportedCache = null
const isWebpSupported = () => {
  if (isWebpSupportedCache !== null) {
    return isWebpSupportedCache
  }

  const elem =
    typeof window !== `undefined` ? window.document.createElement(`canvas`) : {}
  if (elem.getContext && elem.getContext(`2d`)) {
    isWebpSupportedCache =
      elem.toDataURL(`image/webp`).indexOf(`data:image/webp`) === 0
  } else {
    isWebpSupportedCache = false
  }

  return isWebpSupportedCache
}
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

class GatsbyImage extends React.Component {
  constructor(props) {
    super(props)

    // If this browser doesn't support the IntersectionObserver API
    // we default to start downloading the image right away.
    let isVisible = true
    let imgLoaded = true
    let IOSupported = false
    let Imgheight

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    
    var _convertProps = babelHelpers.extends({},props,{fluid:props.fluid?props.fluid:props.sizes}); 
    const seenBefore = inImageCache(_convertProps)    
    
    if (
      !seenBefore &&
      typeof window !== `undefined` &&
      window.IntersectionObserver
    ) {
      isVisible = false
      imgLoaded = false
      IOSupported = true
    }

    this.state = {
      Imgheight,
      isVisible,
      imgLoaded,
      IOSupported,
    }

    this.handleRef = this.handleRef.bind(this)
  }

  // Implement srcset
  srcset(images, mxW, mxH, aspectRatio) { 
  var maxWidth,maxHeight,bigW,bigH;
  
   if (typeof window !== 'undefined') {
   bigW=(window.innerWidth > 0 ? window.innerWidth : screen.width)
   bigH=(window.innerHeight > 0 ? window.innerHeight : screen.height)
   }else{
   bigW=800
   bigH=600
   }
  if(mxW){
  if(typeof mxW=="string"&&mxW.indexOf("%")!==-1)
  maxWidth=bigW*(parseInt(mxW)/100)
  else
  maxWidth=parseInt(mxW,10)
  }else{
  maxWidth=bigW
  }
  
  if(mxH){
  if(typeof mxH=="string"&&mxH.indexOf("%")!==-1)
  maxHeight=bigH*(parseInt(mxH)/100)
  else
  maxHeight=parseInt(mxH,10)
  }else{
  maxHeight=bigH
  }
  
   maxWidth=(this.props.maxWidth&&parseInt(this.props.maxWidth)<maxWidth)?parseInt(this.props.maxWidth):maxWidth

    var maxDensity = 1
    const ratio = 1 / aspectRatio

    if (typeof window !== 'undefined') {
      maxDensity = window.devicePixelRatio;
    }
    
    var filename,density,height,width,widthresult,widthresultabs,filenameresult;
    let candidates = images.split(',')
    if (candidates.length == 0) return false
    var widthresultabs=10000;
    for (var i = 0; i < candidates.length; i++) {
      // The following regular expression was created based on the rules
      // in the srcset W3C specification available at:
      // http://www.w3.org/html/wg/drafts/srcset/w3c-srcset/
      var descriptors = candidates[i].match(/^\s*([^\s]+)\s*(\s(\d+)w)?\s*(\s(\d+)h)?\s*(\s(\d+)x)?\s*$/);
      filename = descriptors[1]; 
      width = parseInt(descriptors[3],10) || false;
      //if (width) height = width * ratio;
      density = descriptors[7] || 1; 
      if (width && Math.abs(width-maxWidth)<widthresultabs){ 
      widthresult=width;
      height = width * ratio;
      filenameresult=filename;
      widthresultabs=Math.abs(width-maxWidth);
        continue;
      } 
      
      if (density && density > maxDensity) {
        continue
      }

      return { result: filenameresult, width: widthresult, height: height }
    }
    return { result: filenameresult, width: widthresult, height: height }
  }

  handleRef(ref) {
    if (this.state.IOSupported && ref) {
      listenToIntersections(ref, () => {
        this.setState({ isVisible: true, imgLoaded: false })
      })
    }
  }
  render() {
    const {
      title,
      alt,
      resizeMode,
      width,
      content,
      maxWidth,
      height,
      className,
      outerWrapperClassName,
      imgStyle = {},
      placeholderStyle = {}, 
      backgroundColor,
    } = this.props
     const fluid = this.props.fluid?this.props.fluid:this.props.sizes;
    let bgColor
    if (typeof backgroundColor === `boolean`) {
      bgColor = `lightgray`
    } else {
      bgColor = backgroundColor
    }

    if (fluid) {
      const image = fluid
      // var Pattern = /\(max-width: (.*)px\).*vw, (.*)px/
      let srcImage, src, srcSet, presentationHeight, Pattern, match

		presentationHeight = height?height:"50%"
		/*
      if (height) {
        Pattern = /(.*)px/
        match = height.match(Pattern)
        if (match) {
          presentationHeight = parseInt(match[1], 10) / 2 + 'px' //|| match[2] + 'px'
        } else {
          Pattern = /(.*)%/
          match = height.match(Pattern)
          if (match) {
            presentationHeight = parseInt(match[1], 10) / 2 + '%' //|| match[2] + 'px'
          } else {
            presentationHeight = height + 'px'
          }
        }
      }*/
      
      const posImag1=positionImage=="right"?{right:"0px"}:{}
      const imagePlaceholderStyle = {
        opacity: this.state.imgLoaded ? 0 : 1,
        transitionDelay: `0.25s`,
        left:"auto",
        ...imgStyle,
        ...placeholderStyle,
        ...posImag
      }

      const posImagback=positionImage=="right"?{backgroundPosition: "right top"}:{}
      const imageStyle = {
        opacity: this.state.imgLoaded || this.props.fadeIn === false ? 1 : 0,
        ...imgStyle,
        ...posImagback
      }

      // Use webp by default if browser supports it
      if (image.srcWebp && image.srcSetWebp && isWebpSupported()) {
        srcImage = this.srcset(
          image.srcSetWebp,
          width,
          height,
          image.aspectRatio
        )
        srcSet = image.srcSetWebp
      } else {
        srcImage = this.srcset(image.srcSet, width, height, image.aspectRatio)
        srcSet = image.srcSet
      }
      src = srcImage.result
      image.width = srcImage.width
      image.height = srcImage.height

      const srcFront = image.tracedSVG 
      //|| image.base64 not good
      const bgStyle = {
        backgroundColor: bgColor,
        position: `absolute`,
        top: 0,
        bottom: 0,
        opacity: !this.state.imgLoaded ? 1 : 0,
        transitionDelay: `0.35s`,
        right: 0,
        left: 0,
      }
      var isconstrained = width !== '100%' && width
      // The outer div is necessary to reset the z-index to 0.
       /*   style={{
            height: presentationHeight ? presentationHeight : 'auto',
            width: width !== '100%' ? srcImage.width : '100%',
          }}*/
      return (
        <div
          style={{
          width: width?width:"100%",
          maxWidth: maxWidth,
          margin: '0 auto',
          position:'relative',
          alignSelf: "center"
          }}
          className={className}
        >
          {bgColor && <View title={title} style={bgStyle} />}
          <div ref={this.handleRef}>
         {content}</div>
          {/* Once the image is visible (or the browser doesn't support IntersectionObserver), start downloading the image */}
          {this.state.isVisible && (
            <Image
              accessibilityLabel={alt}
              resizeMode={resizeMode}
              title={title}
              defaultSource={srcFront}
              source={src}
              srcSet={srcSet}
              sizes={image.sizes}
              styleAccessibilityImage={imagePlaceholderStyle}
              styleImage={imageStyle}
              style={{
          paddingBottom: presentationHeight ? presentationHeight : '60%',
          maxWidth: '100%',
        opacity: this.state.imgLoaded ? 1 : 0,
        transitionDelay: "0.35s"
        }}
              onLoadEnd={() => {
                this.state.IOSupported && this.setState({ imgLoaded: true })
                this.props.onLoad && this.props.onLoad()
              }}
              onError={this.props.onError}
            />
          )}
        </div>
      )
    }
    return null
  }
}

Image.defaultProps = {
  fadeIn: true,
  alt: ``,
  resizeMode: 'center',
}

const fixedObject = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string,
})

const fluidObject = PropTypes.shape({
  aspectRatio: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  sizes: PropTypes.string.isRequired,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string,
})
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

export default GatsbyImage
