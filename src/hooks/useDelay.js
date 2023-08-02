import { useState } from 'react';
import { useEffect } from 'react';

const useDelay = (search) => {
    const [delayed, setDelayed] = useState();
    useEffect(() => {
        setTimeout(() => {
            setDelayed(search);
        }, 500);
    }, [search]);
    return delayed;
};

export default useDelay;
