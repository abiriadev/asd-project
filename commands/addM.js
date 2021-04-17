const show_invite_info = require('./../utils/show_invite_info');

module.exports = async msg => {
    try {
        const inv = await msg.channel.createInvite({
            maxUses: 1,
            reason: 'reason',
        });

        msg.reply(inv.toString());

        show_invite_info(inv);
    } catch (err) {
        console.error(err);
    }
};
