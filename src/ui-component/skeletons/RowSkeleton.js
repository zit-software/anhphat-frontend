import { Skeleton, TableCell, TableRow } from '@mui/material';

const RowSkeleton = ({ cols }) => {
    const columns = [];

    for (let i = 0; i < cols; i++) {
        columns.push(
            <TableCell key={i}>
                <Skeleton />
            </TableCell>
        );
    }

    return <TableRow>{columns}</TableRow>;
};

export default RowSkeleton;
