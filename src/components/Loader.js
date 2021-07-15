import React from 'react'
import HashLoader from "react-spinners/HashLoader";
import './css/loader.css';

function Loader(props) {
  // const color = '#00f';
  // const color = '#19398A';
  // const color = '#3a0ca3';
  // const color = '#031D44';
  const color = '#023e8a';
  // const color = '#3a86ff';
  // const color = '#023047';
  // const color = '#14213d';
  // const color = '#000';

  if (props.loading) {
    return (
      <div className="loader-container">
        <HashLoader color={color} size={150} loading={true} />
      </div>
    );
  } else {
    return null;
  }
}

export default Loader;