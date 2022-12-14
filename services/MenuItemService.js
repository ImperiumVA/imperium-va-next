import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/menuitems`;

export const MenuItemService = {
    getById,
    getAll,
    findOne: getById,
    findAll: getAll,
    update,
    destroy,
    delete: destroy,
    toggleField: toggleField,
    create: create,
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

async function toggleField(id, key) {
    if (!id) throw new Error('id is required');
    if (!key) throw new Error('key is required');
    
    return await fetchWrapper.put(`${baseUrl}/toggleField/${id}`, {key});
}

async function create(payload) {
    if (!payload) throw new Error('Payload is required');
    if (!payload.menuId) throw new Error('menuId is required');

    return await fetchWrapper.post(baseUrl, payload);
}