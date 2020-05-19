import { ActivityHandler, MessageFactory, ActionTypes } from 'botbuilder';
import { Avaamo } from './helpers/Avaamo';
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const request = require('request');

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            if (context.activity.attachments && context.activity.attachments.length > 0){
                await this.handleIncomingAttachment(context);
            } else {
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
            }
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
            await next();
        });
    }

    async handleIncomingAttachment(turnContext) {
        const promises = turnContext.activity.attachments.map(this.downloadAttachmentAndWrite);
        const successfulSaves = await Promise.all(promises);

        async function replyForReceivedAttachments(localAttachmentData) {
            if (localAttachmentData) {
                await this.sendActivity(`Attachment "${ localAttachmentData.fileName }" ` +
                    `has been received and saved to "${ localAttachmentData.localPath }".`);
            } else {
                await this.sendActivity('Attachment was not successfully saved to disk.');
            }
        }

        const replyPromises = successfulSaves.map(replyForReceivedAttachments.bind(turnContext));
        await Promise.all(replyPromises);
    }

    async downloadAttachmentAndWrite(attachment) {
        const url = attachment.contentUrl;

        const localFileName = path.join(__dirname, attachment.name);
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            fs.writeFile(localFileName, response.data, (fsError) => {
                if (fsError) {
                    throw fsError;
                }
                const image = fs.readFileSync(path.join(__dirname, attachment.name));
                const imageBase64 = Buffer.from(image).toString('base64')
                console.log(imageBase64)
                const options = {
                    method: 'POST',
                    url: 'https://a76736d3.ngrok.io/vision/uploadImage',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ya29.c.Ko8Bywc3nDC8gq-3KXP8yhVmWjPBB3Xz3KmNGlTXjhXInpqYckS05m_PzYtburK4DRhFvFNDyMr6DynuYBbIMdluEmySyeHoPSUabxyOza8KN6CbZklDMIVTe6VptBO4LBwe0fgADExsKldhJ6lKyA-GloeAc2z7zr4e3wQNdiw0YtD97mbnhChMDCMW_s3xop0'
                    },
                    body: JSON.stringify({
                        "content": imageBase64,
                        "studentEmail": "felix.maldonado@dev.waldenu.edu",
	                    "description": "Test Description to the Ticket",
                    })
                }
                request(options, function (error, response) { 
                    if (error) throw new Error(error);
                    console.log(response.body);
                    fs.unlinkSync(path.join(__dirname, attachment.name));
                });
            });
        } catch (error) {
            console.error(error);
            return undefined;
        }

        return {
            fileName: attachment.name,
            localPath: localFileName
        };
    }
}
