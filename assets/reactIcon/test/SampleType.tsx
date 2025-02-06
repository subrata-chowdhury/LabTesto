const SampleTypeIcon: React.FC<{ fill?: string, size?: number }> = ({ fill = '', size= 24 }) => (
	<svg aria-hidden="true" focusable="false" role="img" fill={fill ? fill : 'none'} preserveAspectRatio="xMidYMid meet" data-icon="Beaker" viewBox="0 0 24 24" width={size} height={size} className="sc-f32db17d-0 sc-c1dcc9aa-0 cjEpGv hhQbhi sc-eed3504d-0 kLYXoq">
		<path d="M3.30176 9.65723C4.75146 9.65723 4.75145 10.4983 6.20115 10.4983C7.65085 10.4983 7.65084 9.65723 9.10054 9.65723C10.5502 9.65723 10.5503 10.4983 12 10.4983C13.4497 10.4983 13.4497 9.65723 14.8994 9.65723C16.3491 9.65723 16.3491 10.4983 17.7988 10.4983C19.2485 10.4983 19.2485 9.65723 20.6982 9.65723" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
		<path d="M1 3.15039H2.3833C2.54971 3.15324 2.7085 3.22061 2.82619 3.3383C2.94387 3.45598 3.01118 3.61478 3.01402 3.78118V18.6654C3.01402 19.226 3.23674 19.7637 3.63313 20.16C4.02952 20.5564 4.56716 20.7791 5.12774 20.7791H18.8722C19.4328 20.7791 19.9704 20.5564 20.3668 20.16C20.7632 19.7637 20.9859 19.226 20.9859 18.6654V3.78118C20.9859 3.61389 21.0523 3.45342 21.1706 3.33512C21.2889 3.21683 21.4494 3.15039 21.6167 3.15039H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
	</svg>
);

export default SampleTypeIcon;