module.exports = async msg => {
    if (msg.args[1] === '역할') {
        const newRole = await msg.guild.roles.create({
            data: {
                name: msg.args[2] || 'new_role',
                color: msg.args.find(arg => arg.startsWith('color:')),
                permissions: msg.args.includes('--empty')
                    ? 0
                    : ['ADMINISTRATOR'],
            },
            reason:
                msg.args.find(arg => arg.startsWith('reason:'))?.slice(7) ||
                'we need to add new role',
        });

        msg.reply(`${newRole} has created!`);
    }
};
