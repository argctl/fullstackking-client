import React from 'react';
import defaultPic from "../images/defaultProfilePic.png";

const ProfPic = ({photo, id, action, alt, className}) => (
    <img className={className} onClick={action !== undefined ? action : null} src={(photo === "no photo uploaded" || id === undefined) ?
    defaultPic : `${process.env.REACT_APP_URL}/${id}.${photo}`} alt={alt} />
)

export default ProfPic;
