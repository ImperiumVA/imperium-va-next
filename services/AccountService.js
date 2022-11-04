import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/account`;

export const AccountService = {
    getById,
    getAll,
    findOne: getById,
    findAll: getAll,
    update,
    destroy,
    delete: destroy,
};

async function getAll() {
    return await fetchWrapper.get(baseUrl);
}

async function getById(id) {
    if (!id) throw new Error('id is required');
    return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function update(id, params) {
    if (!id) throw new Error('id is required');
    return await fetchWrapper.put(`${baseUrl}/${id}`, params);
}

async function destroy(id) {
    if (!id) throw new Error('id is required');
    return await fetchWrapper.delete(`${baseUrl}/${id}`);
}

async function toggleAdmin(id) {
    if (!id) throw new Error('id is required');
    return await fetchWrapper.put(`${baseUrl}/toggleAdmin/${id}`);
}