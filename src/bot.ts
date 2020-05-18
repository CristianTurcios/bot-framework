// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory } from 'botbuilder';
const axios = require('axios');

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${ context.activity.text }`;
            this.getAvaamoResponse(context.activity.text);
            await context.sendActivity(MessageFactory.text(replyText, replyText));
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

getAvaamoResponse(userText:String){

    axios.post('/https://c0.avaamo.com//bot_connector_webhooks/be09efe0-1612-4419-8f26-34b79c072cd8/message.json', {
        channel_uuid: '1c954349-df14-4665-9311-92ea548242f2',
        user: {
          first_name : 'Sam',
          last_name : 'Will',
          uuid: '9ac15843-151d-47fb-8b3d-930b89ce797e'
        },
        message: {
          text: userText
        },
        
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}


}

