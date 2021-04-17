const add_each = async msg => {
    await msg.guild.channels.cache
        .filter(ch => ch.type === 'category')
        .map(ch => {
            msg.guild.channels.create('asdf', {
                type: 'text',
                topic: 'topic',
                parent: ch,
                reason: 'reason',
            });
        });

    msg.reply('complete!');
};

module.exports = add_each;
