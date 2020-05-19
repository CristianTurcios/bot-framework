import { ActivityHandler, MessageFactory } from 'botbuilder';
import { Avaamo } from './helpers/avaamo';

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const replyText = `Echo: ${context.activity.text}`;
            try {
                const avaamo = new Avaamo();
                const avaamoResponse = await avaamo.getAvaamoResponse(context.activity.text);
                avaamoResponse.forEach(async (element) => await context.sendActivity(MessageFactory.text(element.text, element.text)));
            } catch (error) {
                console.log('error', error);
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
}
