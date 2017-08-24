/**
 * #Paper
 * A [Paper](#) element is a basic container that can give depth to the page.
 * 
 * #Examples
 * 
 * ##Simple example
 * Paper examples showing the range of zDepth.
 * 
 * ```js
 *  import React from 'react';
 * import Paper from 'material-ui/Paper';
 * 
 * const style = {
 *   height: 100,
 *   width: 100,
 *   margin: 20,
 *   textAlign: 'center',
 *   display: 'inline-block',
 * };
 * 
 * const PaperExampleSimple = () => (
 *   <div>
 *     <Paper style={style} zDepth={1} />
 *     <Paper style={style} zDepth={2} />
 *     <Paper style={style} zDepth={3} />
 *     <Paper style={style} zDepth={4} />
 *     <Paper style={style} zDepth={5} />
 *   </div>
 * );
 * 
 * export default PaperExampleSimple;
 * ```
 * 
 * ##Non-rounded corners
 * Corners are rounded by default. Set the rounded property to false for square corners.
 * 
 * ```js
 *
 * import React from 'react';
 * import Paper from 'material-ui/Paper';
 * 
 * const style = {
 *   height: 100,
 *   width: 100,
 *   margin: 20,
 *   textAlign: 'center',
 *   display: 'inline-block',
 * };
 * 
 * const PaperExampleRounded = () => (
 *   <div>
 *     <Paper style={style} zDepth={1} rounded={false} />
 *     <Paper style={style} zDepth={2} rounded={false} />
 *     <Paper style={style} zDepth={3} rounded={false} />
 *     <Paper style={style} zDepth={4} rounded={false} />
 *     <Paper style={style} zDepth={5} rounded={false} />
 *   </div>
 * );
 * 
 * export default PaperExampleRounded;
 * ```
 * 
 * ##Circular Paper
 * Set the circle property for circular Paper.
 * 
 * ```js
 *
 * import React from 'react';
 * import Paper from 'material-ui/Paper';
 * 
 * const style = {
 *   height: 100,
 *   width: 100,
 *   margin: 20,
 *   textAlign: 'center',
 *   display: 'inline-block',
 * };
 * 
 * const PaperExampleCircle = () => (
 *   <div>
 *     <Paper style={style} zDepth={1} circle={true} />
 *     <Paper style={style} zDepth={2} circle={true} />
 *     <Paper style={style} zDepth={3} circle={true} />
 *     <Paper style={style} zDepth={4} circle={true} />
 *     <Paper style={style} zDepth={5} circle={true} />
 *   </div>
 * );
 * 
 * export default PaperExampleCircle;
 * ```
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import propTypes from '../utils/propTypes';
import transitions from '../styles/transitions';

function getStyles(props, context) {
  const {
    rounded,
    circle,
    transitionEnabled,
    zDepth,
  } = props;

  const {
    baseTheme,
    paper,
    borderRadius,
  } = context.muiTheme;

  return {
    root: {
      color: paper.color,
      backgroundColor: paper.backgroundColor,
      transition: transitionEnabled && transitions.easeOut(),
      boxSizing: 'border-box',
      fontFamily: baseTheme.fontFamily,
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      boxShadow: paper.zDepthShadows[zDepth - 1], // No shadow for 0 depth papers
      borderRadius: circle ? '50%' : rounded ? borderRadius : '0px',
    },
  };
}

class Paper extends Component {
  static propTypes = {
    /**
     * @property {PropTypes.node} children - Children passed into the paper element.
     */
    children: PropTypes.node,
    /**
     * @property {PropTypes.bool} circle - Set to true to generate a circular paper container.
     */
    circle: PropTypes.bool,
    /**
     * @property {PropTypes.bool} rounded - By default, the paper container will have a border radius.
     * Set this to false to generate a container with sharp corners.
     */
    rounded: PropTypes.bool,
    /**
     * @property {PropTypes.object} style - Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * @property {PropTypes.bool} transitionEnabled - Set to false to disable CSS transitions for the paper element.
     */
    transitionEnabled: PropTypes.bool,
    /**
     * @property {PropTypes.zDepth} zDepth - This number represents the zDepth of the paper shadow.
     */
    zDepth: propTypes.zDepth,
  };

  static defaultProps = {
    circle: false,
    rounded: true,
    transitionEnabled: true,
    zDepth: 1,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const {
      children,
      circle, // eslint-disable-line no-unused-vars
      rounded, // eslint-disable-line no-unused-vars
      style,
      transitionEnabled, // eslint-disable-line no-unused-vars
      zDepth, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context);

    return (
      <div {...other} style={prepareStyles(Object.assign(styles.root, style))}>
        {children}
      </div>
    );
  }
}

export default Paper;
