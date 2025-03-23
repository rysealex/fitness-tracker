import React, { useState, useEffect } from 'react';

function CurrentDate() {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // update every second

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            {currentDate.toLocaleDateString()}
        </div>
    );
}

export default CurrentDate;