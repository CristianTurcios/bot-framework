const axios = require('axios');
import { AdaptativeCards } from './AdaptativeCards';
import { Common } from './Common';

export class Avaamo {
    public async getAvaamoResponse(userText: string, user) {
        const common = new Common();
        try {
            const name = common.parseName(user.name);
            const response = await axios.post('https://c0.avaamo.com//bot_connector_webhooks/be09efe0-1612-4419-8f26-34b79c072cd8/message.json', {
                channel_uuid: '1c954349-df14-4665-9311-92ea548242f2',
                message: {
                    text: userText
                },
                user: {
                    first_name: name.firstName,
                    last_name: name.lastName,
                    uuid: user.id
                }
            });
            const adaptativeCard  = this.convertToAdaptiveCard(response.data.incoming_message.bot_replies);
            return adaptativeCard;

        } catch (e) {
            console.log(e);
        }
    }

    public convertToAdaptiveCard(message) {
        let convertedMsg;

        const adaptativeCards = new AdaptativeCards();
        if (message.length > 0 && 'quick_replies' in message[0]) {
            convertedMsg = adaptativeCards.parseQuickReply(message);
        } else if (message.length > 0) {
            convertedMsg = {
                text: message[0].text,
                type: 'message'
            };
        }
        return convertedMsg;
    }
}
