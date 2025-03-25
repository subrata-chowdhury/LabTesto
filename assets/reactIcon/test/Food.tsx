import React from 'react';

const FoodIcon: React.FC<{ fill?: string, size?: number }> = ({ fill = '', size= 24 }) => (
	<svg aria-hidden="true" focusable="false" role="img" fill={fill ? fill : 'none'} preserveAspectRatio="xMidYMid meet" data-icon="FastingIcon" viewBox="0 0 24 24" width={size} height={size}>
		<path d="M9.94793 5.72629V9.36842L8.96899 10.6211L9.40061 17.0842C9.41671 17.2679 9.39429 17.4528 9.33488 17.6274C9.27548 17.8019 9.18034 17.9622 9.05554 18.0979C8.93073 18.2336 8.77907 18.3417 8.61011 18.4155C8.44115 18.4893 8.25864 18.527 8.07428 18.5263V18.5263C7.88992 18.527 7.70742 18.4893 7.53846 18.4155C7.3695 18.3417 7.21777 18.2336 7.09297 18.0979C6.96816 17.9622 6.87303 17.8019 6.81362 17.6274C6.75421 17.4528 6.73186 17.2679 6.74796 17.0842L7.20058 10.6211L6.14795 9.36842V5.71582" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M8.08496 5.45215V9.01004" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M17.7791 8.85272C17.7791 6.8843 16.8949 5.69482 16.0107 5.69482C15.1265 5.69482 14.2002 6.91588 14.2002 8.85272C14.2073 9.20232 14.3089 9.54349 14.4942 9.84001C14.6795 10.1365 14.9417 10.3773 15.2528 10.5369L15.0212 16.8527C14.9475 17.6316 15.2633 18.2948 16.0738 18.2948C16.8844 18.2948 17.1265 17.6316 17.1265 16.8527L16.9055 10.5369C17.1833 10.3547 17.4096 10.1041 17.5627 9.80911C17.7157 9.51415 17.7902 9.18482 17.7791 8.85272Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M17.6733 6.42177L19.726 4.36914" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M9.49512 14.4212L14.1372 9.95801" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M4.36914 19.7367L6.48493 17.6104" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
	</svg>
);

export default FoodIcon;