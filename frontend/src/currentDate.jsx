import React, { useState, useEffect } from 'react';

function CurrentDate() {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // update every second

        return () => clearInterval(intervalId);
    }, []);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div>
            {currentDate.toLocaleDateString('en-US', options)}
        </div>
    );
}

export default CurrentDate;