import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { Button, TextField, Tooltip } from '@mui/material';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5)
}));

export default function ChipsArray({ values, setDonVi }) {
    const [chipData, setChipData] = React.useState(values);

    const donViRef = React.useRef();

    const handleDelete = (chipToDelete) => {
        const newChips = chipData.filter((chip) => chip.ten !== chipToDelete.ten);
        setChipData(newChips);
        setDonVi(newChips);
    };

    const handleAdd = (newChip) => {
        if (chipData.find((chip) => chip.ten.toLowerCase() === newChip.ten.toLowerCase())) {
            donViRef.current.value = '';
            return;
        }
        const newChips = [...chipData];
        newChips.push(newChip);
        setChipData(newChips);
        setDonVi(newChips);
        donViRef.current.value = '';
    };

    return (
        <div style={{ marginTop: '12px' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: '4px',
                    justifyContent: 'center'
                }}
            >
                <TextField inputRef={donViRef} fullWidth label="Đơn Vị Cần Thêm" />
                <Button
                    onClick={() => {
                        handleAdd({ inDB: false, ten: donViRef.current.value });
                    }}
                    variant="text"
                >
                    Thêm
                </Button>
            </div>
            <Paper
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0
                }}
                component="ul"
            >
                {chipData.map((data) => {
                    return (
                        <ListItem key={data.ten}>
                            <Tooltip title={data.inDB ? 'Đơn vị đã lưu' : 'Đơn vị chưa lưu'}>
                                <Chip
                                    color={data.inDB ? 'primary' : 'secondary'}
                                    label={data.ten}
                                    onDelete={
                                        data.inDB
                                            ? null
                                            : () => {
                                                  handleDelete(data);
                                              }
                                    }
                                />
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </Paper>
        </div>
    );
}
