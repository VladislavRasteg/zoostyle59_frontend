import { CircularProgress } from "@mui/material"

export const Loader = (props: { size?: string, color?: string }) => {
	const { size = '100%', color = 'var(--brand-color)' }  = props;

	return (
			<CircularProgress style={{ color, width: size, height: size, alignSelf: 'center' }} />
	)
}