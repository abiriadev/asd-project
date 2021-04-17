const all_guild = async msg => {
    const asd = msg.client.guilds.cache
        .array()
        .map(g => g.name)
        .map(name => `guild: ${name}`)
        .join('\n');

    msg.reply(asd);
    console.log(asd);
};

module.exports = all_guild;
