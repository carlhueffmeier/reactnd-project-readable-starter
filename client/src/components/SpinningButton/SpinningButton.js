import React from 'react';
import Spinner from 'components/Spinner';

export default function SpinningButton(props) {
  return (
    <button {...props} disabled>
      <Spinner size={30} color="white" />
    </button>
  );
}
