import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/company`;

export const CompanyService = {
    getById,
    getAll,
    findOne: getById,
    findAll: getAll,
    update,
    upsert,
    destroy,
    delete: destroy,
    toggleField,
    getOnAirCompanyDetails,
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

async function getOnAirCompanyDetails(payload) {
    const company = await fetchWrapper.put(`${baseUrl}/onAir/companyDetails`, payload);

    return company;
}

async function refreshCompanyDetails(ownerId) {
    if (!ownerId) throw new Error('ownerId is required');
    return await fetchWrapper.put(`${baseUrl}/refreshCompanyDetails`, { ownerId });
}