import React from 'react';

const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: '10px', margin: '5px' }}>
      {children}
    </button>
  );
};

export default Button;