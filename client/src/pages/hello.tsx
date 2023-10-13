import { API_PREFIX } from '@constants/config';
import { useEffect, useState } from "react";

const Hello = ({}) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(API_PREFIX + '/hello', {
            method: 'GET',
            // headers: {},
            // body: JSON.stringify({}), // data can be a string or {object}!
        })
            .then(response => response.text())
            .then(data => setMessage(data));
    }, []);

    return <div>{message}</div>;
}

export default Hello;