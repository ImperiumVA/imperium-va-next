import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

async function get(url) {
    const requestOptions = {
        method: 'GET',
    };
    return await fetch(url, requestOptions).then(handleResponse);
}

async function post(url, body) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(body)
    };
    return await fetch(url, requestOptions).then(handleResponse);
}

async function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(body)
    };
    return await fetch(url, requestOptions).then(handleResponse);    
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
    };
    
    return await fetch(url, requestOptions).then(handleResponse);
}

// helper functions
async function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}