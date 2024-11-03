import React from 'react';
import { Link } from 'react-router-dom';

const Test: React.FC = () => {
    return (
        <div>
        <div>
            <Link to="/pftest">16PF Test</Link>
        </div>
        <div>
            <Link to="/iqtest">IQ Test</Link>
        </div>
        </div>
    );
};

export default Test;
