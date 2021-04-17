const delete_each = async msg => {
    await msg.guild.channels.cache
        .filter(ch => ch.name === 'asdf')
        .map(ch => ch.deletable && ch.delete());

    msg.reply('complete!');
};

module.exports = delete_each;
