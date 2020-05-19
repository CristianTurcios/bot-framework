export class AdaptativeCards {
    public parseQuickReply(message) {
        const actions = [];
        message[0].quick_replies.forEach((element) => {
            actions.push({
                data: {
                    [element.title]: element.payload
                },
                title: element.title,
                type: 'Action.Submit'
            });
        });
        return {
            attachments: [{
                content: {
                    actions,
                    type: 'AdaptiveCard',
                    version: '1.0'
                },
                contentType: 'application/vnd.microsoft.card.adaptive'
            }],
            text: message[0].text,
            type: 'message'
        };
    }
}
