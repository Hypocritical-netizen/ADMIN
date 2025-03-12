import {useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import {set} from 'config/store/reducers/appState';

function Notice() {
    const dispatch = useDispatch();
    
    useEffect(() => {
		dispatch(
			set({
				breadcrumbs: [
					{
						name: 'Tools',
						url: '/tools',
					},
                    {
                        name: 'Game Notifications',
                        url: '/tools/notice'
                    }
				],
			})
		);
	}, []);

    return (
        <>
            NOTICE
        </>
    )
}

export default Notice;