import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/admin/discord`;

export const DiscordService = {
    sendMessage,
};

async function sendMessage(message, channelName = 'discord', opts) {
    if (!channelName) throw new Error('chanel name is required');
    if (!message) throw new Error('message is required');
    
    return await fetchWrapper.post(`${baseUrl}`, {
        channelName,
        message,
    });
}