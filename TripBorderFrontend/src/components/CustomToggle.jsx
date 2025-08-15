import { useState } from 'react';
import PropTypes from 'prop-types';

export default function CustomToggle({
  className = 'toggle dark:toggle text-base',
  titleOn,
  titleOff,
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
        {isOpen
          ? <span>{titleOn}</span>
          : <span>{titleOff}</span>}
      </button>
      {isOpen ? component : null}
    </span>
  );
}

CustomToggle.propTypes = {
  className: PropTypes.string,
  titleOn: PropTypes.string,
  titleOff: PropTypes.string,
  component: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  isOpened: PropTypes.bool,
  label: PropTypes.string
};
