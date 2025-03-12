import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import {ColorPicker, useColor} from 'react-color-palette';
import ReactDOM from 'react-dom';
import 'react-color-palette/css';
import EditIcon from '@mui/icons-material/Edit';

function ColorPickerDropdown({disabled = false, onChange = () => {}}) {
	const [color, setColor] = useColor('#123123');
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	useEffect(() => {
		onChange(color);
	}, [color]);

	return (
		<div style={{height: '56px', marginLeft: 5}}>
			<Button
				disabled={disabled}
				aria-describedby={id}
				variant="default"
				onClick={handleClick}
				style={{backgroundColor: color.hex, width: '100%', height: '100%'}}
			>
				<EditIcon />
			</Button>
			{ReactDOM.createPortal(
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <ColorPicker hideInput={["rgb", "hsv"]} width={456} height={228} color={color} onChange={setColor} hideHSV hideAlpha dark />
                </Popover>,
                document.getElementById('popover-root')
            )}
		</div>
	);
}

export default ColorPickerDropdown;
