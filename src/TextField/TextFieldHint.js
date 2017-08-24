import React from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';

function getStyles(props) {
  const {
    muiTheme: {
      textField: {
        hintColor,
      },
    },
    show,
  } = props;

  return {
    root: {
      position: 'absolute',
      opacity: show ? 1 : 0,
      color: hintColor,
      transition: transitions.easeOut(),
      bottom: 12,
    },
  };
}

const TextFieldHint = (props) => {
  const {
    muiTheme: {
      prepareStyles,
    },
    style,
    text,
  } = props;

  const styles = getStyles(props);

  return (
    <div style={prepareStyles(Object.assign(styles.root, style))}>
      {text}
    </div>
  );
};

TextFieldHint.propTypes = {
  /**
   * @ignore
   * The material-ui theme applied to this component.
   */
  muiTheme: PropTypes.object.isRequired,
  /**
   * @property {PropTypes.bool} show - True if the hint text should be visible.
   */
  show: PropTypes.bool,
  /**
   * @property {PropTypes.object} style - Override the inline-styles of the root element.
   */
  style: PropTypes.object,
  /**
   * @property {PropTypes.node} text - The hint text displayed.
   */
  text: PropTypes.node,
};

TextFieldHint.defaultProps = {
  show: true,
};

export default TextFieldHint;
