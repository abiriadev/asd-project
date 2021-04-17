const create_server = async msg => {
    try {
        const new_guild = await msg.client.guilds.create(
            msg.args[1] || 'DEFAULT',
            {},
        );

        msg.reply('서버가 생성 되었습니다!');

        console.log(
            new_guild.channels.cache
                .map(ch => ch.name)
                .map(name => `new: ${name}`)
                .join('\n'),
        );

        const target_ch = new_guild.channels.cache.find(
            ch => ch.type === 'text',
        );

        msg.reply(`\`${target_ch.name}\` 채널의 링크를 보내 드리겠습니다!`);

        // new_guild.channels.cache.first().send('hellow, wrold')

        const inv = await target_ch.createInvite({
            maxUses: 1,
            reason: 'reason',
        });

        msg.reply(inv.toString());
    } catch (err) {
        console.error(err);
    }
};

module.exports = create_server;
