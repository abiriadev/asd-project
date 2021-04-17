module.exports = async msg => {
    msg.delete();
    const m = await msg.channel.send('도배 방지를 위해 삭제합니다! ㅠㅠ');

    setTimeout(() => {
        m.delete();
    }, 1000);

    return;
};
