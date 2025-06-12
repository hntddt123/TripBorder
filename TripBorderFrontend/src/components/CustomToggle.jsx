import { useState } from 'react';
import PropTypes from 'prop-types';

function CustomToggle({ className = 'text-base', title, component, type = 'button', disabled = false, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <span>
      <button
        className={`${className}`}
        type={type}
        onClick={toggle}
        disabled={disabled}
        {...props}
      >
        {isOpen ? `${title} ▼` : `${title} ▶`}
      </button>
      {isOpen ? component : null}
    </span>
  );
}

CustomToggle.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  component: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string
};

export default CustomToggle;
