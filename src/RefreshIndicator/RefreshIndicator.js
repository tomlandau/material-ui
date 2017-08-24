/**
 * #Refresh Indicator
 * The [refresh indicator](#) is used when showing an item is loading. It is kept hidden from the interface until it's status prop is changed to loading or ready.
 * #Examples
 * 
 * ##Ready
 * The ready status can be used in response to a pull-to-refresh action, with the percentage tracking the depth of the "pull". The size property determines the icon size in pixels, and the color property its color, except at percentage 100, when the colour switches to the secondary color.
 * 
 * ```js
 
 * import React from 'react';
 * import RefreshIndicator from 'material-ui/RefreshIndicator';
 * 
 * const style = {
 *   container: {
 *     position: 'relative',
 *   },
 *   refresh: {
 *     display: 'inline-block',
 *     position: 'relative',
 *   },
 * };
 * 
 * const RefreshIndicatorExampleSimple = () => (
 *   <div style={style.container}>
 *     <RefreshIndicator
 *       percentage={30}
 *       size={40}
 *       left={10}
 *       top={0}
 *       status="ready"
 *       style={style.refresh}
 *     />
 *     <RefreshIndicator
 *       percentage={60}
 *       size={50}
 *       left={65}
 *       top={0}
 *       status="ready"
 *       style={style.refresh}
 *     />
 *     <RefreshIndicator
 *       percentage={80}
 *       size={60}
 *       left={120}
 *       top={0}
 *       color="red"
 *       status="ready"
 *       style={style.refresh}
 *     />
 *     <RefreshIndicator
 *       percentage={100}
 *       size={70}
 *       left={175}
 *       top={0}
 *       color="red" // Overridden by percentage={100}
 *       status="ready"
 *       style={style.refresh}
 *     />
 *   </div>
 * );
 * 
 * export default RefreshIndicatorExampleSimple;
 * 
 * ```
 * 
 * &nbsp;
 * ##Loading
 * The loading status displays an indeterminate indicator, intended to to be used while content is loading. The loadingColor prop can be used to set the indicator color, which defaults to the secondary color.
 * 
 * ```js
 * import React from 'react';
 * import RefreshIndicator from 'material-ui/RefreshIndicator';
 * 
 * const style = {
 *   container: {
 *     position: 'relative',
 *   },
 *   refresh: {
 *     display: 'inline-block',
 *     position: 'relative',
 *   },
 * };
 * 
 * const RefreshIndicatorExampleLoading = () => (
 *   <div style={style.container}>
 *     <RefreshIndicator
 *       size={40}
 *       left={10}
 *       top={0}
 *       status="loading"
 *       style={style.refresh}
 *     />
 *     <RefreshIndicator
 *       size={50}
 *       left={70}
 *       top={0}
 *       loadingColor="#FF9800"
 *       status="loading"
 *       style={style.refresh}
 *     />
 *   </div>
 * );
 * 
 * export default RefreshIndicatorExampleLoading;
 * ```
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autoPrefix from '../utils/autoPrefix';
import transitions from '../styles/transitions';
import Paper from '../Paper';

const VIEWBOX_SIZE = 32;

function getStyles(props) {
  const padding = props.size * 0.1; // same implementation of `this.getPaddingSize()`
  return {
    root: {
      position: 'absolute',
      zIndex: 2,
      width: props.size,
      height: props.size,
      padding: padding,
      top: -10000,
      left: -10000,
      transform: `translate(${10000 + props.left}px, ${10000 + props.top}px)`,
      opacity: props.status === 'hide' ? 0 : 1,
      transition: props.status === 'hide' ? transitions.create('all', '.3s', 'ease-out') : 'none',
    },
  };
}

class RefreshIndicator extends Component {
  static propTypes = {
    /**
     * @property {PropTypes.string} color - Override the theme's color of the indicator while it's status is
     * "ready" and it's percentage is less than 100.
     */
    color: PropTypes.string,
    /**
     * @property {PropTypes.number} left - The absolute left position of the indicator in pixels.
     */
    left: PropTypes.number.isRequired,
    /**
     * @property {PropTypes.string} loadingColor - Override the theme's color of the indicator while
     * it's status is "loading" or when it's percentage is 100.
     */
    loadingColor: PropTypes.string,
    /**
     * @property {PropTypes.number} percentage - The confirmation progress to fetch data. Max value is 100.
     */
    percentage: PropTypes.number,
    /**
     * @property {PropTypes.number} size - Size in pixels.
     */
    size: PropTypes.number,
    /**
     * @property {'ready'| 'loading'| 'hide'} status - The display status of the indicator. If the status is
     * "ready", the indicator will display the ready state
     * arrow. If the status is "loading", it will display
     * the loading progress indicator. If the status is "hide",
     * the indicator will be hidden.
     */
    status: PropTypes.oneOf(['ready', 'loading', 'hide']),
    /**
     * @property {PropTypes.object} style - Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * @property {PropTypes.number} top - The absolute top position of the indicator in pixels.
     */
    top: PropTypes.number.isRequired,
  };

  static defaultProps = {
    percentage: 0,
    size: 40,
    status: 'hide',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.scalePath(this.refs.path, 0);
    this.rotateWrapper(this.refs.wrapper);
  }

  componentDidUpdate() {
    clearTimeout(this.scalePathTimer);
    clearTimeout(this.rotateWrapperTimer);
    clearTimeout(this.rotateWrapperSecondTimer);

    this.scalePath(this.refs.path, 0);
    this.rotateWrapper(this.refs.wrapper);
  }

  componentWillUnmount() {
    clearTimeout(this.scalePathTimer);
    clearTimeout(this.rotateWrapperTimer);
    clearTimeout(this.rotateWrapperSecondTimer);
  }

  renderChildren() {
    const {prepareStyles} = this.context.muiTheme;
    const paperSize = this.getPaperSize();

    let childrenCmp = null;
    if (this.props.status !== 'ready') {
      const circleStyle = this.getCircleStyle(paperSize);
      childrenCmp = (
        <div
          ref="wrapper"
          style={prepareStyles({
            transition: transitions.create('transform', '20s', null, 'linear'),
            width: '100%',
            height: '100%',
          })}
        >
          <svg
            style={{
              width: paperSize,
              height: paperSize,
            }}
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          >
            <circle
              ref="path"
              style={prepareStyles(Object.assign(circleStyle.style, {
                transition: transitions.create('all', '1.5s', null, 'ease-in-out'),
              }))}
              {...circleStyle.attr}
            />
          </svg>
        </div>
      );
    } else {
      const circleStyle = this.getCircleStyle(paperSize);
      const polygonStyle = this.getPolygonStyle(paperSize);
      childrenCmp = (
        <svg
          style={{
            width: paperSize,
            height: paperSize,
          }}
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        >
          <circle
            style={prepareStyles(circleStyle.style)}
            {...circleStyle.attr}
          />
          <polygon
            style={prepareStyles(polygonStyle.style)}
            {...polygonStyle.attr}
          />
        </svg>
      );
    }

    return childrenCmp;
  }

  getTheme() {
    return this.context.muiTheme.refreshIndicator;
  }

  getPaddingSize() {
    const padding = this.props.size * 0.1;
    return padding;
  }

  getPaperSize() {
    return this.props.size - this.getPaddingSize() * 2;
  }

  getCircleAttr() {
    return {
      radiu: VIEWBOX_SIZE / 2 - 5,
      originX: VIEWBOX_SIZE / 2,
      originY: VIEWBOX_SIZE / 2,
      strokeWidth: 3,
    };
  }

  getArcDeg() {
    const p = this.props.percentage / 100;

    const beginDeg = p * 120;
    const endDeg = p * 410;
    return [beginDeg, endDeg];
  }

  getFactor() {
    const p = this.props.percentage / 100;
    const p1 = Math.min(1, p / 0.4);

    return p1;
  }

  getCircleStyle() {
    const isLoading = this.props.status === 'loading';
    const p1 = isLoading ? 1 : this.getFactor();
    const circle = this.getCircleAttr();
    const perimeter = Math.PI * 2 * circle.radiu;

    const [beginDeg, endDeg] = this.getArcDeg();
    const arcLen = (endDeg - beginDeg) * perimeter / 360;
    const dashOffset = -beginDeg * perimeter / 360;

    const theme = this.getTheme();
    return {
      style: {
        strokeDasharray: `${arcLen}, ${(perimeter - arcLen)}`,
        strokeDashoffset: dashOffset,
        stroke: (isLoading || this.props.percentage === 100) ?
          (this.props.loadingColor || theme.loadingStrokeColor) :
          (this.props.color || theme.strokeColor),
        strokeLinecap: 'round',
        opacity: p1,
        strokeWidth: circle.strokeWidth * p1,
        fill: 'none',
      },
      attr: {
        cx: circle.originX,
        cy: circle.originY,
        r: circle.radiu,
      },
    };
  }

  getPolygonStyle() {
    const p1 = this.getFactor();
    const circle = this.getCircleAttr();

    const triangleCx = circle.originX + circle.radiu;
    const triangleCy = circle.originY;
    const dx = (circle.strokeWidth * 7 / 4) * p1;
    const trianglePath = `${(triangleCx - dx)},${triangleCy} ${(triangleCx + dx)},${
      triangleCy} ${triangleCx},${(triangleCy + dx)}`;

    const [, endDeg] = this.getArcDeg();

    const theme = this.getTheme();
    return {
      style: {
        fill: this.props.percentage === 100 ?
          (this.props.loadingColor || theme.loadingStrokeColor) :
          (this.props.color || theme.strokeColor),
        transform: `rotate(${endDeg}deg)`,
        transformOrigin: `${circle.originX}px ${circle.originY}px`,
        opacity: p1,
      },
      attr: {
        points: trianglePath,
      },
    };
  }

  scalePath(path, step) {
    if (this.props.status !== 'loading') return;

    const currStep = (step || 0) % 3;

    const circle = this.getCircleAttr();
    const perimeter = Math.PI * 2 * circle.radiu;
    const arcLen = perimeter * 0.64;

    let strokeDasharray;
    let strokeDashoffset;
    let transitionDuration;

    if (currStep === 0) {
      strokeDasharray = '1, 200';
      strokeDashoffset = 0;
      transitionDuration = '0ms';
    } else if (currStep === 1) {
      strokeDasharray = `${arcLen}, 200`;
      strokeDashoffset = -15;
      transitionDuration = '750ms';
    } else {
      strokeDasharray = `${arcLen}, 200`;
      strokeDashoffset = -(perimeter - 1);
      transitionDuration = '850ms';
    }

    autoPrefix.set(path.style, 'strokeDasharray', strokeDasharray);
    autoPrefix.set(path.style, 'strokeDashoffset', strokeDashoffset);
    autoPrefix.set(path.style, 'transitionDuration', transitionDuration);

    this.scalePathTimer = setTimeout(() => this.scalePath(path, currStep + 1), currStep ? 750 : 250);
  }

  rotateWrapper(wrapper) {
    if (this.props.status !== 'loading') return;

    autoPrefix.set(wrapper.style, 'transform', null);
    autoPrefix.set(wrapper.style, 'transform', 'rotate(0deg)');
    autoPrefix.set(wrapper.style, 'transitionDuration', '0ms');

    this.rotateWrapperSecondTimer = setTimeout(() => {
      autoPrefix.set(wrapper.style, 'transform', 'rotate(1800deg)');
      autoPrefix.set(wrapper.style, 'transitionDuration', '10s');
      autoPrefix.set(wrapper.style, 'transitionTimingFunction', 'linear');
    }, 50);

    this.rotateWrapperTimer = setTimeout(() => this.rotateWrapper(wrapper), 10050);
  }

  render() {
    const {
      style,
      top, // eslint-disable-line no-unused-vars
      left, // eslint-disable-line no-unused-vars
      percentage, // eslint-disable-line no-unused-vars
      status, // eslint-disable-line no-unused-vars
      loadingColor, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const styles = getStyles(this.props, this.context);

    return (
      <Paper
        circle={true}
        style={Object.assign(styles.root, style)}
        {...other}
      >
        {this.renderChildren()}
      </Paper>
    );
  }
}

export default RefreshIndicator;
