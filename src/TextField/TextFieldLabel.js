import React from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';

function getStyles(props) {
  const defaultStyles = {
    position: 'absolute',
    lineHeight: '22px',
    top: 38,
    transition: transitions.easeOut(),
    zIndex: 1, // Needed to display label above Chrome's autocomplete field background
    transform: 'scale(1) translate(0, 0)',
    transformOrigin: 'left top',
    pointerEvents: 'auto',
    userSelect: 'none',
  };

  const shrinkStyles = props.shrink ? Object.assign({
    transform: 'scale(0.75) translate(0, -28px)',
    pointerEvents: 'none',
  }, props.shrinkStyle) : null;

  return {
    root: Object.assign(defaultStyles, props.style, shrinkStyles),
  };
}

const TextFieldLabel = (props) => {
  const {
    muiTheme,
    className,
    children,
    htmlFor,
    onClick,
  } = props;

  const {prepareStyles} = muiTheme;
  const styles = getStyles(props);

  return (
    <label
      className={className}
      style={prepareStyles(styles.root)}
      htmlFor={htmlFor}
      onClick={onClick}
    >
      {children}
    </label>
  );
};

TextFieldLabel.propTypes = {
  /**
   * @property {PropTypes.node} children - The label contents.
   */
  children: PropTypes.node,
  /**
   * @property {PropTypes.string} className - The css class name of the root element.
   */
  className: PropTypes.string,
  /**
   * @property {PropTypes.bool} disabled - Disables the label if set to true.
   */
  disabled: PropTypes.bool,
  /**
   * @property {PropTypes.string} htmlFor - The id of the target element that this label should refer to.
   */
  htmlFor: PropTypes.string,
  /**
   * @ignore
   * The material-ui theme applied to this component.
   */
  muiTheme: PropTypes.object.isRequired,
  /**
   * @property {PropTypes.func} onClick - Callback function for when the label is selected via a touch tap.
   *
   * @param {object} event TouchTap event targeting the text field label.
   */
  onClick: PropTypes.func,
  /**
   * @property {PropTypes.bool} shrink - True if the floating label should shrink.
   */
  shrink: PropTypes.bool,
  /**
   * @property {PropTypes.object} shrinkStyle - Override the inline-styles of the root element when shrunk.
   */
  shrinkStyle: PropTypes.object,
  /**
   * @property {PropTypes.object} style - Override the inline-styles of the root element.
   */
  style: PropTypes.object,
};

TextFieldLabel.defaultProps = {
  disabled: false,
  shrink: false,
};

export default TextFieldLabel;
