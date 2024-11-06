import React from 'react';
import { Link } from 'react-router-dom';
import style from './page.module.scss';

const Test: React.FC = () => {
    return (
        <div>
            <div className={style.TestPF}>
                <Link to="/pftest" className={style.pfLink}>16PF Test</Link>
            </div>
            <div>
                <Link to="/iqtest">IQ Test</Link>
            </div>
            
        </div>
    );
};

export default Test;
