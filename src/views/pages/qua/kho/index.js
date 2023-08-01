import { AddOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import QuaKhuyenDungForm from 'forms/QuaKhuyenDungForm';
import { useState } from 'react';
import toast from 'react-hot-toast';
import MainCard from 'ui-component/cards/MainCard';

const KhoQua = () => {
    const [creating, setCreating] = useState(false);

    const handleCreate = async (values) => {
        try {
            throw new Error('Chức năng đang phát triển');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <MainCard
                title="Kho Quà"
                secondary={
                    <Button
                        variant="outlined"
                        startIcon={<AddOutlined />}
                        onClick={() => setCreating(true)}
                    >
                        Thêm quà
                    </Button>
                }
            ></MainCard>

            <Dialog open={creating} anchor="right" onClose={() => setCreating(false)}>
                <DialogTitle>Thêm quà</DialogTitle>
                <DialogContent>
                    <QuaKhuyenDungForm
                        actions={
                            <>
                                <Button type="submit" variant="outlined">
                                    Tạo
                                </Button>
                            </>
                        }
                        onSubmit={handleCreate}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default KhoQua;
