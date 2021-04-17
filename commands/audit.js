const audit = async msg => {
    try {
        const logs = await msg.guild.fetchAuditLogs({});
        console.log(logs.entries.first());
    } catch (err) {
        console.error(err);
    }
};

module.exports = audit;
