import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function CustomButton({
  className = 'button dark:button',
  label,
  onClick,
  type = 'button',
  disabled = false,
  to,
  ...props
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    if (onClick) onClick();
  };

  return (
    <button
      data-testid={`button-${label}`}
      className={`${className}`}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
}

CustomButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  to: PropTypes.string,
  disabled: PropTypes.bool
};
