import { ActivityHandler, MessageFactory } from 'botbuilder';
import { Avaamo } from './helpers/Avaamo';

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            let replyText = `Echo: ${context.activity.text}`;
            replyText = context.activity.text ? context.activity.text : context.activity.value[Object.keys(context.activity.value)[0]];

            try {
                const avaamo = new Avaamo();
                const user = context.activity.from;
                const avaamoResponse = await avaamo.getAvaamoResponse(replyText, user);
                await context.sendActivity(avaamoResponse);

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
