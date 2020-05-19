const axios = require('axios');

export class Avaamo {
    public async getAvaamoResponse(userText: string) {
        try {
            const response = await axios.post('https://c0.avaamo.com//bot_connector_webhooks/be09efe0-1612-4419-8f26-34b79c072cd8/message.json', {
                channel_uuid: '1c954349-df14-4665-9311-92ea548242f2',
                message: {
                    text: userText
                },
                user: {
                    first_name: 'Sam',
                    last_name: 'Will',
                    uuid: '9ac15843-151d-47fb-8b3d-930b89ce797e'
                }
            });

            console.log(response.data.incoming_message.bot_replies);
            return response.data.incoming_message.bot_replies;

        } catch (e) {
            console.log(e);
        }
    }
}
