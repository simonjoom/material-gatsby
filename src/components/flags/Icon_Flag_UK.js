'use strict';

import React from 'react';

export default function( props )
{
  return(
    <svg focusable={false} viewBox="0 0 640 480" {...props}>
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#ffd500" d="M0 0h640v480H0z"/>
        <path fill="#005bbb" d="M0 0h640v240H0z"/>
      </g>
    </svg>
  )
}
