import React from 'react';

const PackageIcon: React.FC<{ fill?: string, size?: number }> = ({ fill = '', size= 24 }) => (
	<svg aria-hidden="true" focusable="false" role="img" fill={fill ? fill : 'none'} preserveAspectRatio="xMidYMid meet" data-icon="Package" viewBox="0 0 22 20" width={size}>
		<path d="M19.0392 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H19.0392C20.1438 19 21.0392 18.1046 21.0392 17V3C21.0392 1.89543 20.1438 1 19.0392 1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M14.3893 7.70223L11.0248 4.98802L7.65039 7.70223V1H14.3893V7.70223Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

export default PackageIcon;
