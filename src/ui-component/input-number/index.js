import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { Stack } from '@mui/system';

/**
 * @type {import('react').FC<import('@mui/material').TextFieldProps>}
 */
const InputNumber = (props) => {
    const setValue = (value) => {
        props.onChange?.({ target: { name: props.name, value } });
    };

    const increase = () => {
        setValue(props.value + 1);
    };

    const desrease = () => {
        setValue(props.value - 1);
    };

    return (
        <TextField
            {...props}
            InputProps={{
                endAdornment: (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton color="info" onClick={desrease}>
                            <RemoveOutlined />
                        </IconButton>

                        <IconButton color="info" onClick={increase}>
                            <AddOutlined />
                        </IconButton>
                    </Stack>
                ),
            }}
        />
    );
};

export default InputNumber;
