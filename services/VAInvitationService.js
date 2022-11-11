import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/vainvitation`;

export const VAInvitationService = {
    getById,
    getAll,
    findOne: getById,
    findAll: getAll,
    update,
    upsert,
    destroy,
    delete: destroy,
    create,
};

async function getAll() {
    return await fetchWrapper.get(baseUrl);
}

async function getById(id) {
    if (!id) throw new Error('id is required');
    return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function update(id, payload) {
    if (!id) throw new Error('id is required');
    return await fetchWrapper.put(`${baseUrl}/${id}`, payload);
}

async function create(payload) {
    if (!payload) throw new Error('payload is required');
    return await fetchWrapper.post(`${baseUrl}`, payload);
}

async function upsert(id, payload) {
    if (!payload) throw new Error('id is required');
    return await fetchWrapper.put(`${baseUrl}/upsert`, {id, ...payload});
}

async function destroy(id) {
    if (!id) throw new Error('id is required');
    return await fetchWrapper.delete(`${baseUrl}/${id}`);
}
