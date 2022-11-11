import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { apiHandler, omit, slugify } from 'helpers/api'
import Redis from '@redis';

export default apiHandler({
    post: SendMessage,
});


async function SendMessage(req, res) {
    const {
        message,
        channelName,
    } = JSON.parse(req.body)

    if (!message) throw 'Message is required'

    
    Redis.publish(channelName || 'discord', message);
    console.log(`Published '${message}' to ${channelName || 'discord'}`);
    // await EventService.publish('discord', 'test');

    // const x = await ES.publish('discord', 'test');

    return res.status(200).json(true);
}