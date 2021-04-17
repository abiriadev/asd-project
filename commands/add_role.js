const add_role = async msg => {
    if (!msg.mentions.members) return msg.reply('멘션을 햇');
    if (!msg.mentions.roles) return msg.reply('역할을 멘션햇');

    await msg.mentions.members.map(m =>
        msg.mentions.roles.map(r => r.deleted || m.roles.add(r)),
    );

    msg.reply('역할 분배가 완료 되었습니다!');
};

module.exports = add_role;
