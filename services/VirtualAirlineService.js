import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/va`;

export const VirtualAirlineService = {
    getById,
    getAll,
    findOne: getById,
    findAll: getAll,
    update,
    upsert,
    destroy,
    delete: destroy,
    toggleField,
    create,
    getOnAirVADetails,
    refreshVADetails,
    refresh: refreshVADetails,
    inviteMember,
    removeMember,
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

async function toggleField(id, key) {
    if (!id) throw new Error('id is required');
    if (!key) throw new Error('key is required');
    
    return await fetchWrapper.put(`${baseUrl}/toggleField`, {id, key});
}

async function getOnAirVADetails(payload) {
    const x = await fetchWrapper.put(`${baseUrl}/onAir/vaDetails`, payload);

    return x;
}

async function refreshVADetails(vaId) {
    if (!vaId) throw new Error('vaId is required');
    return await fetchWrapper.put(`${baseUrl}/refreshDetails`, { vaId });
}

async function changeOwner({ vaId, companyId }) {
    if (!vaId) throw new Error('VA ID is required');
    if (!companyId) throw new Error('Company ID is required');

    return await fetchWrapper.put(`${baseUrl}/changeOwner`, { vaId, companyId });
}

async function inviteMember(payload) {
    return await fetchWrapper.put(`${baseUrl}/inviteMember`, payload);
}

async function removeMember(payload) {
    return await fetchWrapper.put(`${baseUrl}/removeMember`, payload);
}