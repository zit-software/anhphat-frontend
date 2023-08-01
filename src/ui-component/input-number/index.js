import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { func, number, string } from 'prop-types';

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
        <Stack direction="row" spacing={1} alignItems="start">
            <TextField {...props} sx={{ flex: 1 }} />

            <IconButton size="large" color="info" onClick={desrease}>
                <RemoveOutlined />
            </IconButton>

            <IconButton size="large" color="info" onClick={increase}>
                <AddOutlined />
            </IconButton>
        </Stack>
    );
};

InputNumber.propTypes = {
    onChange: func,
    value: number,
    name: string,
};

export default InputNumber;
