const remove_role = async msg => {
    if (!msg.mentions.members) return msg.reply('멘션을 햇');
    if (!msg.mentions.roles) return msg.reply('역할을 멘션햇');

    await msg.mentions.members.map(m => m.roles.remove(msg.mentions.roles));

    msg.reply('역할 제거가 완료 되었습니다!');
};

module.exports = remove_role;
