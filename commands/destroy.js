//Requires
const modulename = 'destroy';
const axios = require("axios");
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

//Helpers
const anyUndefined = (...args) => { return [...args].some(x => (typeof x === 'undefined')) };

module.exports = {
    description: 'Insults a member.',
    async execute(message, args, txChungus) {
        if (!message.mentions.users.size) {
            return message.reply('you need to tag an user in order to mock them... fucktard');
        }

        try {
            //perform request
            let reqUrl = `https://insult.mattbas.org/api/insult.json?who={{replace}}`;
            if(message.mentions.users.size > 1) reqUrl += '&plural';
            let resp = await axios.get(reqUrl, {timeout: 5000});
    
            //check response
            if(anyUndefined(resp.data, resp.data.error, resp.data.insult)) throw new Error('missing data');
            if(resp.data.error) throw new Error('detected error');

            //form insult and send
            const mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
            const outMsg = resp.data.insult.replace('{{replace}}', mentionString);
            return message.channel.send(outMsg);

        } catch (error) {
            dir(error)
            return message.channel.send(`Destroy him yourself... idiot`);
        }
    },
};
