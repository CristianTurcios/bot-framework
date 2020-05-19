// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory } from 'botbuilder';
const axios = require('axios');

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${context.activity.text}`;
            const avaamoResponse = await this.getAvaamoResponse(context.activity.text);
            try {
                await context.sendActivity(MessageFactory.text(avaamoResponse, avaamoResponse));
            } catch (error) {
                await context.sendActivity(MessageFactory.text(replyText, replyText));
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

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
            return response.data.incoming_message.bot_replies[0].text;

        } catch (e) {
            console.log(e);
        }
    }
}
