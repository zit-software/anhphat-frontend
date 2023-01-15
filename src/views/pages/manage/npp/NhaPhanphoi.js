import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { IconCirclePlus } from '@tabler/icons';
import * as Yup from 'yup';

import MainCard from 'ui-component/cards/MainCard';
import ProvinceService from 'services/province.service';
import { Formik } from 'formik';

const CreateModal = () => {
    return (
        <Dialog open>
            <DialogTitle>Thêm nhà phân phối</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ ten: '', chietkhau: 0, matinh: '' }}
                    validationSchema={Yup.object().shape({
                        ten: Yup.string().required('Vui lòng nhập tên nhà phân phối'),
                        chietkhau: Yup.number().test(
                            'valid',
                            'Chiếu khấu phải từ 0 - 100%',
                            (v) => v >= 0 && v <= 1
                        ),
                    })}
                ></Formik>
            </DialogContent>
        </Dialog>
    );
};

function NhaPhanPhoi() {
    return (
        <MainCard
            title="Quản lý nhà phân phối"
            secondary={<Button startIcon={<IconCirclePlus />}>Thêm </Button>}
        >
            <CreateModal />
        </MainCard>
    );
}

export default NhaPhanPhoi;
