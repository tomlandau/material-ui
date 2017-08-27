/**
 * 
 * #Drawer
 * The [Drawer](#) slides in from the side. It is a common pattern found in Google apps and follows the keylines and metrics for lists.
 * There are no examples for uncontrolled mode because an uncontrolled Drawer can only be opened with a swipe. The doc site has an uncontrolled Drawer. Swipe from the left on a touch device to see it.
 * 
 * #Examples
 * 
 * ##Docked example
 * A simple controlled Drawer. The Drawer is docked by default, remaining open unless closed through the open prop.
 * 
 * ```js 
 * import React from 'react';
 * import Drawer from 'material-ui/Drawer';
 * import MenuItem from 'material-ui/MenuItem';
 * import RaisedButton from 'material-ui/RaisedButton';
 * 
 * export default class DrawerSimpleExample extends React.Component {
 * 
 *   constructor(props) {
 *     super(props);
 *     this.state = {open: false};
 *   }
 * 
 *   handleToggle = () => this.setState({open: !this.state.open});
 * 
 *   render() {
 *     return (
 *       <div>
 *         <RaisedButton
 *           label="Toggle Drawer"
 *           onClick={this.handleToggle}
 *         />
 *         <Drawer open={this.state.open}>
 *           <MenuItem>Menu Item</MenuItem>
 *           <MenuItem>Menu Item 2</MenuItem>
 *         </Drawer>
 *       </div>
 *     );
 *   }
 * }
 * ```
 * 
 * &nbsp;
 * ##Undocked example
 * An undocked controlled Drawer with custom width. The Drawer can be cancelled by clicking the overlay or pressing the Esc key. It closes when an item is selected, handled by controlling the open prop.
 * 
 * ```js
 * import React from 'react';
 * import Drawer from 'material-ui/Drawer';
 * import MenuItem from 'material-ui/MenuItem';
 * import RaisedButton from 'material-ui/RaisedButton';
 * 
 * export default class DrawerUndockedExample extends React.Component {
 * 
 *   constructor(props) {
 *     super(props);
 *     this.state = {open: false};
 *   }
 * 
 *   handleToggle = () => this.setState({open: !this.state.open});
 * 
 *   handleClose = () => this.setState({open: false});
 * 
 *   render() {
 *     return (
 *       <div>
 *         <RaisedButton
 *           label="Open Drawer"
 *           onClick={this.handleToggle}
 *         />
 *         <Drawer
 *           docked={false}
 *           width={200}
 *           open={this.state.open}
 *           onRequestChange={(open) => this.setState({open})}
 *         >
 *           <MenuItem onClick={this.handleClose}>Menu Item</MenuItem>
 *           <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
 *         </Drawer>
 *       </div>
 *     );
 *   }
 * }
 * ```
 * 
 * &nbsp;
 * ##Open secondary example
 * The openSecondary prop allows the Drawer to open on the opposite side.
 * 
 * ```js
 * import React from 'react';
 * import Drawer from 'material-ui/Drawer';
 * import AppBar from 'material-ui/AppBar';
 * import RaisedButton from 'material-ui/RaisedButton';
 * 
 * export default class DrawerOpenRightExample extends React.Component {
 * 
 *   constructor(props) {
 *     super(props);
 *     this.state = {open: false};
 *   }
 * 
 *   handleToggle = () => this.setState({open: !this.state.open});
 * 
 *   render() {
 *     return (
 *       <div>
 *         <RaisedButton
 *           label="Toggle Drawer"
 *           onClick={this.handleToggle}
 *         />
 *         <Drawer width={200} openSecondary={true} open={this.state.open} >
 *           <AppBar title="AppBar" />
 *         </Drawer>
 *       </div>
 *     );
 *   }
 * }
 * ```
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import autoPrefix from '../utils/autoPrefix';
import transitions from '../styles/transitions';
import Overlay from '../internal/Overlay';
import Paper from '../Paper';
import propTypes from '../utils/propTypes';

let openNavEventHandler = null;

class Drawer extends Component {
  static propTypes = {
    /**
     * @property {PropTypes.node} children - The contents of the `Drawer`
     */
    children: PropTypes.node,
    /**
     * @property {PropTypes.string} className - The CSS class name of the root element.
     */
    className: PropTypes.string,
    /**
     * @property {PropTypes.string} containerClassName - The CSS class name of the container element.
     */
    containerClassName: PropTypes.string,
    /**
     * @property {PropTypes.object} containerStyle - Override the inline-styles of the container element.
     */
    containerStyle: PropTypes.object,
    /**
     * @property {PropTypes.bool} disableSwipeToOpen - If true, swiping sideways when the `Drawer` is closed will not open it.
     */
    disableSwipeToOpen: PropTypes.bool,
    /**
     * @property {PropTypes.bool} docked - If true, the `Drawer` will be docked. In this state, the overlay won't show and
     * clicking on a menu item will not close the `Drawer`.
     */
    docked: PropTypes.bool,
    /**
     * @property {PropTypes.func} onRequestChange - Callback function fired when the `open` state of the `Drawer` is requested to be changed.
     *
     * @param {boolean} open If true, the `Drawer` was requested to be opened.
     * @param {string} reason The reason for the open or close request. Possible values are
     * 'swipe' for open requests; 'clickaway' (on overlay clicks),
     * 'escape' (on escape key press), and 'swipe' for close requests.
     */
    onRequestChange: PropTypes.func,
    /**
     * @property {PropTypes.bool} open - If true, the `Drawer` is opened.  Providing a value will turn the `Drawer`
     * into a controlled component.
     */
    open: PropTypes.bool,
    /**
     * @property {PropTypes.bool} openSecondary - If true, the `Drawer` is positioned to open from the opposite side.
     */
    openSecondary: PropTypes.bool,
    /**
     * @property {PropTypes.string} overlayClassName - The CSS class name to add to the `Overlay` component that is rendered behind the `Drawer`.
     */
    overlayClassName: PropTypes.string,
    /**
     * @property {PropTypes.object} overlayStyle - Override the inline-styles of the `Overlay` component that is rendered behind the `Drawer`.
     */
    overlayStyle: PropTypes.object,
    /**
     * @property {PropTypes.object} style - Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * @property {PropTypes.number} swipeAreaWidth - The width of the left most (or right most) area in pixels where the `Drawer` can be
     * swiped open from. Setting this to `null` spans that area to the entire page
     * (**CAUTION!** Setting this property to `null` might cause issues with sliders and
     * swipeable `Tabs`: use at your own risk).
     */
    swipeAreaWidth: PropTypes.number,
    /**
     * @property {string|number} width - The width of the `Drawer` in pixels or percentage in string format ex. `50%` to fill
     * half of the window or `100%` and so on. Defaults to using the values from theme.
     */
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    /**
     * @property {PropTypes.zDepth} zDepth - The zDepth of the `Drawer`.
     */
    zDepth: propTypes.zDepth,

  };

  static defaultProps = {
    disableSwipeToOpen: false,
    docked: true,
    open: null,
    openSecondary: false,
    swipeAreaWidth: 30,
    width: null,
    zDepth: 2,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.maybeSwiping = false;
    this.touchStartX = null;
    this.touchStartY = null;
    this.swipeStartX = null;

    this.setState({
      open: (this.props.open !== null ) ? this.props.open : this.props.docked,
      swiping: null,
    });
  }

  componentDidMount() {
    this.enableSwipeHandling();
  }

  componentWillReceiveProps(nextProps) {
    // If controlled then the open prop takes precedence.
    if (nextProps.open !== null) {
      this.setState({
        open: nextProps.open,
      });
      // Otherwise, if docked is changed, change the open state for when uncontrolled.
    } else if (this.props.docked !== nextProps.docked) {
      this.setState({
        open: nextProps.docked,
      });
    }
  }

  componentDidUpdate() {
    this.enableSwipeHandling();
  }

  componentWillUnmount() {
    this.disableSwipeHandling();
    this.removeBodyTouchListeners();
  }

  getStyles() {
    const muiTheme = this.context.muiTheme;
    const theme = muiTheme.drawer;

    const x = this.getTranslateMultiplier() * (this.state.open ? 0 : this.getMaxTranslateX());

    const styles = {
      root: {
        height: '100%',
        width: this.getTranslatedWidth() || theme.width,
        position: 'fixed',
        zIndex: muiTheme.zIndex.drawer,
        left: 0,
        top: 0,
        transform: `translate(${x}px, 0)`,
        transition: !this.state.swiping && transitions.easeOut(null, 'transform', null),
        backgroundColor: theme.color,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
      },
      overlay: {
        zIndex: muiTheme.zIndex.drawerOverlay,
        pointerEvents: this.state.open ? 'auto' : 'none', // Bypass mouse events when left nav is closing.
      },
      rootWhenOpenRight: {
        left: 'auto',
        right: 0,
      },
    };

    return styles;
  }

  shouldShow() {
    return this.state.open || !!this.state.swiping;  // component is swiping
  }

  close(reason) {
    if (this.props.open === null) this.setState({open: false});
    if (this.props.onRequestChange) this.props.onRequestChange(false, reason);
    return this;
  }

  open(reason) {
    if (this.props.open === null) this.setState({open: true});
    if (this.props.onRequestChange) this.props.onRequestChange(true, reason);
    return this;
  }

  handleTouchTapOverlay = (event) => {
    event.preventDefault();
    this.close('clickaway');
  };

  handleKeyUp = (event) => {
    if (this.state.open && !this.props.docked && keycode(event) === 'esc') {
      this.close('escape');
    }
  };

  getTranslatedWidth() {
    if (typeof this.props.width === 'string') {
      if (!/^\d+(\.\d+)?%$/.test(this.props.width)) {
        throw new Error('Not a valid percentage format.');
      }
      const width = parseFloat(this.props.width) / 100.0;
      // We are doing our best on the Server to render a consistent UI, hence the
      // default value of 10000
      return typeof window !== 'undefined' ? width * window.innerWidth : 10000;
    } else {
      return this.props.width;
    }
  }

  getMaxTranslateX() {
    const width = this.getTranslatedWidth() || this.context.muiTheme.drawer.width;
    return width + 10;
  }

  getTranslateMultiplier() {
    return this.props.openSecondary ? 1 : -1;
  }

  enableSwipeHandling() {
    if (!this.props.docked) {
      document.body.addEventListener('touchstart', this.onBodyTouchStart);
      if (!openNavEventHandler) {
        openNavEventHandler = this.onBodyTouchStart;
      }
    } else {
      this.disableSwipeHandling();
    }
  }

  disableSwipeHandling() {
    document.body.removeEventListener('touchstart', this.onBodyTouchStart);
    if (openNavEventHandler === this.onBodyTouchStart) {
      openNavEventHandler = null;
    }
  }

  onBodyTouchStart = (event) => {
    const swipeAreaWidth = this.props.swipeAreaWidth;

    const touchStartX = this.context.muiTheme.isRtl ?
      (document.body.offsetWidth - event.touches[0].pageX) :
      event.touches[0].pageX;
    const touchStartY = event.touches[0].pageY;

    // Open only if swiping from far left (or right) while closed
    if (swipeAreaWidth !== null && !this.state.open) {
      if (this.props.openSecondary) {
        // If openSecondary is true calculate from the far right
        if (touchStartX < document.body.offsetWidth - swipeAreaWidth) return;
      } else {
        // If openSecondary is false calculate from the far left
        if (touchStartX > swipeAreaWidth) return;
      }
    }

    if (!this.state.open &&
         (openNavEventHandler !== this.onBodyTouchStart ||
          this.props.disableSwipeToOpen)
       ) {
      return;
    }

    this.maybeSwiping = true;
    this.touchStartX = touchStartX;
    this.touchStartY = touchStartY;

    document.body.addEventListener('touchmove', this.onBodyTouchMove);
    document.body.addEventListener('touchend', this.onBodyTouchEnd);
    document.body.addEventListener('touchcancel', this.onBodyTouchEnd);
  };

  removeBodyTouchListeners() {
    document.body.removeEventListener('touchmove', this.onBodyTouchMove);
    document.body.removeEventListener('touchend', this.onBodyTouchEnd);
    document.body.removeEventListener('touchcancel', this.onBodyTouchEnd);
  }

  setPosition(translateX) {
    const rtlTranslateMultiplier = this.context.muiTheme.isRtl ? -1 : 1;
    const drawer = ReactDOM.findDOMNode(this.refs.clickAwayableElement);
    const transformCSS = `translate(${(this.getTranslateMultiplier() * rtlTranslateMultiplier * translateX)}px, 0)`;
    this.refs.overlay.setOpacity(1 - translateX / this.getMaxTranslateX());
    autoPrefix.set(drawer.style, 'transform', transformCSS);
  }

  getTranslateX(currentX) {
    return Math.min(
             Math.max(
               this.state.swiping === 'closing' ?
                 this.getTranslateMultiplier() * (currentX - this.swipeStartX) :
                 this.getMaxTranslateX() - this.getTranslateMultiplier() * (this.swipeStartX - currentX),
               0
             ),
             this.getMaxTranslateX()
           );
  }

  onBodyTouchMove = (event) => {
    const currentX = this.context.muiTheme.isRtl ?
      (document.body.offsetWidth - event.touches[0].pageX) :
      event.touches[0].pageX;
    const currentY = event.touches[0].pageY;

    if (this.state.swiping) {
      event.preventDefault();
      this.setPosition(this.getTranslateX(currentX));
    } else if (this.maybeSwiping) {
      const dXAbs = Math.abs(currentX - this.touchStartX);
      const dYAbs = Math.abs(currentY - this.touchStartY);
      // If the user has moved his thumb ten pixels in either direction,
      // we can safely make an assumption about whether he was intending
      // to swipe or scroll.
      const threshold = 10;

      if (dXAbs > threshold && dYAbs <= threshold) {
        this.swipeStartX = currentX;
        this.setState({
          swiping: this.state.open ? 'closing' : 'opening',
        });
        this.setPosition(this.getTranslateX(currentX));
      } else if (dXAbs <= threshold && dYAbs > threshold) {
        this.onBodyTouchEnd();
      }
    }
  };

  onBodyTouchEnd = (event) => {
    if (this.state.swiping) {
      const currentX = this.context.muiTheme.isRtl ?
        (document.body.offsetWidth - event.changedTouches[0].pageX) :
        event.changedTouches[0].pageX;
      const translateRatio = this.getTranslateX(currentX) / this.getMaxTranslateX();

      this.maybeSwiping = false;
      const swiping = this.state.swiping;
      this.setState({
        swiping: null,
      });

      // We have to open or close after setting swiping to null,
      // because only then CSS transition is enabled.
      if (translateRatio > 0.5) {
        if (swiping === 'opening') {
          this.setPosition(this.getMaxTranslateX());
        } else {
          this.close('swipe');
        }
      } else {
        if (swiping === 'opening') {
          this.open('swipe');
        } else {
          this.setPosition(0);
        }
      }
    } else {
      this.maybeSwiping = false;
    }

    this.removeBodyTouchListeners();
  };

  render() {
    const {
      children,
      className,
      containerClassName,
      containerStyle,
      docked,
      openSecondary,
      overlayClassName,
      overlayStyle,
      style,
      zDepth,
    } = this.props;

    const styles = this.getStyles();

    let overlay;
    if (!docked) {
      overlay = (
        <Overlay
          ref="overlay"
          show={this.shouldShow()}
          className={overlayClassName}
          style={Object.assign(styles.overlay, overlayStyle)}
          transitionEnabled={!this.state.swiping}
          onClick={this.handleTouchTapOverlay}
        />
      );
    }

    return (
      <div
        className={className}
        style={style}
      >
        <EventListener target="window" onKeyUp={this.handleKeyUp} />
        {overlay}
        <Paper
          ref="clickAwayableElement"
          zDepth={zDepth}
          rounded={false}
          transitionEnabled={!this.state.swiping}
          className={containerClassName}
          style={Object.assign(styles.root, openSecondary && styles.rootWhenOpenRight, containerStyle)}
        >
          {children}
        </Paper>
      </div>
    );
  }
}

export default Drawer;
