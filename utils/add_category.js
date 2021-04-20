const add_category = (msg) => {
    const cate = await msg.guild.channels.create(msg.args[1] || 'DEF_CATE', {
        type: 'category',
        reason: 'create new cate',
        permissionOverwrites: [
            {
                id: msg.author.id,
                allow: ['VIEW_CHANNEL', 'ADMINISTRATOR'],
            },
        ],
    });
};

module.exports = add_category;
