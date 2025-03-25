import React from 'react';

const TubeIcon: React.FC<{ fill?: string, size?: number }> = ({ fill = '', size = 24 }) => (
	<svg aria-hidden="true" focusable="false" role="img" fill={fill ? fill : 'none'} preserveAspectRatio="xMidYMid meet" data-icon="Test-tube" viewBox="0 0 24 25" width={size}>
		<path d="M15.7189 3.23406L21.4082 8.92333L8.54377 21.7878C7.78846 22.5431 6.764 22.9674 5.69583 22.9674C4.62766 22.9674 3.60329 22.5431 2.84798 21.7878V21.7878C2.09267 21.0324 1.66829 20.008 1.66829 18.9399C1.66829 17.8717 2.09267 16.8473 2.84798 16.092L15.7124 3.22754L15.7189 3.23406Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M14.1245 1.64062L22.9998 10.516" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M12.686 6.61719L14.3081 8.23926" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M9.64502 9.64941L11.2763 11.2807" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M6.61279 12.6904L8.23487 14.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
	</svg>
);

export default TubeIcon;