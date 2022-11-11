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
    } = req.body

    if (!message) throw 'Message is required'

    
    Redis.publish(channelName || 'discord', message);
    // await EventService.publish('discord', 'test');

    // const x = await ES.publish('discord', 'test');

    return res.status(200).json(true);
}