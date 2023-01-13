import { Skeleton, TableCell, TableRow } from '@mui/material';

const RowSkeletion = ({ cols }) => {
    const columns = [];

    for (let i = 0; i < cols; i++) {
        columns.push(
            <TableCell>
                <Skeleton />
            </TableCell>
        );
    }

    return <TableRow>{columns}</TableRow>;
};

export default RowSkeletion;
