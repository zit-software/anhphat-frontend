import { useState } from 'react';
import { useEffect } from 'react';

const useDelay = (search, timeout = 500) => {
    const [delayed, setDelayed] = useState();
    useEffect(() => {
        setTimeout(() => {
            setDelayed(search);
        }, timeout);
    }, [search, timeout]);
    return delayed;
};

export default useDelay;
