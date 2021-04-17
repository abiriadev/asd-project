const add_category = async msg => {
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

    msg.reply(`${cate} 채널을 생성했습니다!`);
};

module.exports = add_category;
