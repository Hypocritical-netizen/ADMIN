import {useSelector} from 'react-redux';
import Authentication from 'lib/components/Authentication';

const withAuthentication = (Component) => {
	return () => {
		const {isAuthenticated} = useSelector((state) => state.appState);
		return isAuthenticated ? <Component /> : <Authentication />;
	};
};

export default withAuthentication;
