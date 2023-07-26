import React from 'react';
import { SvgXml } from 'react-native-svg';

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="208.702" height="290.36" viewBox="0 0 208.702 290.36">
  <g id="Group_4" data-name="Group 4" transform="translate(616.351 609.18) rotate(180)">
    <g id="Group_2" data-name="Group 2" transform="translate(1024.005 999.084) rotate(180)">
      <g id="Path_2" data-name="Path 2" transform="translate(616.346 474.564) rotate(90)" fill="none">
        <path d="M-32.419,0H101.35l58.181,104.179L101.35,208.692H-32.419L-84.66,104.179Z" stroke="none"/>
        <path d="M -13.90213012695312 30.00001525878906 L -51.11007690429688 104.200927734375 L -13.87562561035156 178.6922454833984 L 83.71556854248047 178.6922454833984 L 125.1829986572266 104.2027816772461 L 83.74301147460938 30.00001525878906 L -13.90213012695312 30.00001525878906 M -32.41912841796875 1.52587890625e-05 L 101.350227355957 1.52587890625e-05 L 159.5312805175781 104.1794815063477 L 101.350227355957 208.6922454833984 L -32.41912841796875 208.6922454833984 L -84.65976715087891 104.1794815063477 L -32.41912841796875 1.52587890625e-05 Z" stroke="none" fill="#3e3e3e"/>
      </g>
      <path id="Path_3" data-name="Path 3" d="M109.949,109.744l23.162-81.777L166.8,19.214,134.26,134.021,19.214,166.776,27.943,133.1Z" transform="translate(512 444.394) rotate(45)" opacity="0.413"/>
    </g>
  </g>
</svg>
`;

const LogoSvg = (props) => {
  return <SvgXml xml={logoSvg} {...props} />;
};

export default LogoSvg;
