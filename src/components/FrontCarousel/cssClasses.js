import classNames from 'classnames';

export default {
    CAROUSEL: (isSlider) => classNames({
        "carousel": true,
        "carousel-slider": isSlider
    }),

    WRAPPER: (isSlider, axis) => classNames({
        "thumbs-wrapper": !isSlider,
        "slider-wrapper": isSlider,
        "axis-horizontal": axis === "horizontal",
        "axis-vertical": axis !== "horizontal"
    }),

    SLIDER: (isSlider, isSwiping) => classNames({
        "thumbs": !isSlider,
        "slider": isSlider,
        "animated": !isSwiping
    }),

    ITEM: (isSlider, selected) => classNames({
        "thumb": !isSlider,
        "slide": isSlider,
        "selected": selected
    }),

    ARROW_PREV: (disabled) => classNames({
        "control-arrow control-prev": true,
        "control-disabled": disabled
    }),

    ARROW_NEXT: (disabled) => classNames({
        "control-arrow control-next": true,
        "control-disabled": disabled
    }),


    DOT: (selected) => classNames({
        "dot": true,
        'selected': selected
    })
};