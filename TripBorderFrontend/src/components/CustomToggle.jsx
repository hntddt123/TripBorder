import { useState } from 'react';
import PropTypes from 'prop-types';

function CustomToggle({
  className = 'toggle dark:toggle text-base mx-0.5 py-2',
  title,
  component,
  type = 'button',
  disabled = false,
  isOpened = false,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(isOpened);

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
        {isOpen ? <span>{title} ▼</span> : <span>{title} ▶</span>}
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
  isOpened: PropTypes.bool,
  label: PropTypes.string
};

export default CustomToggle;
