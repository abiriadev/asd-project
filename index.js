const discord = require('discord.js');

// const show_invite_info = require('./utils/show_invite_info.js');
const addM = require('./commands/addM.js');
const show_invite_info = require('./utils/show_invite_info.js');
const block = require('./commands/block_nyn.js');
const create = require('./commands/create.js');
const add_role = require('./commands/add_role.js');
const remove_role = require('./commands/remove_role');
const add_each = require('./commands/add_each.js');
const delete_each = require('./commands/delete_each.js');
const perm = require('./commands/perm.js');
// const adM = require('./commands/addM.js');
const all_guild = require('./commands/all_guild.js');
const create_serve = require('./commands/create_server.js');
const add_category = require('./commands/add_category.js');
const audit = require('./commands/audit.js');

const cache = {
    $: {},
    get(key) {
        return this.$[key] || null;
    },
    set(key, value) {
        if (key in cache) {
            return new Error(`${key} is already exist`);
        }
        this.$[key] = value;
    },
    remove(key) {
        if (!key in cache) {
            return new Error(`${key} is not exist`);
        }
        delete this.$[key];
    },
};

const server_log = (msg, embed_data) => {
    const log_ch = old_msg.guild.channels.cache.find(
        ch => ch.id === '832874822530891777',
    );
    if (!log_ch) return;

    const embed = new discord.embed(embed_data);

    log_ch.send(embed);
};

const bot = new discord.Client();

bot.on('ready', async () => {
    console.log(`${bot.user.tag} ready!`);

    bot.host = (await bot.fetchApplication()).owner;

    bot.host.send(`${bot.readyAt} 봇이 시작되었습니다!`);
})
    .on('message', async msg => {
        if (msg.mentions.everyone) {
            msg.delete();
            msg.channel.send('효력이 없는 에브리원도 금지 ㅅㄱ');
        }
        if (msg.content.match(/:nyancat_body:/)) {
            block_nyn(msg);
        }
        if (msg.author.bot) return;
        if (msg.content.startsWith('!')) msg.content = msg.content.slice(1);
        else return;

        msg.args = msg.content.split(/\s+/);
        msg.command = msg.args[0];
        msg.permission = {
            host: msg.author.id === msg.client.host.id,
            admin: false,
        };

        if (msg.command === '생성') {
            create();
        } else if (msg.command === 'add_role') {
            add_role(msg);
        } else if (msg.command === 'remove_role') {
            remove_role(msg);
        } else if (msg.command === 'add_each') {
            add_each(msg);
        } else if (msg.command === 'delete_each') {
        } else if (msg.command === 'perm') {
            perm(msg);
        } else if (msg.command === 'adM') {
            addM(msg);
        } else if (msg.command === 'all_guild') {
            all_guild(msg);
        } else if (msg.command === 'delk' && msg.permission.host) {
            const a = msg.client.guilds.cache
                .filter(g => g.id !== '687271752224735233')
                .map(g => g.delete());

            msg.reply(a);
        } else if (msg.command === 'GID') msg.reply(msg.guild.id);
        else if (msg.command === '서버생성' && msg.permission.host) {
            create_server(msg);
        } else if (msg.command === 'add_cate') {
            add_category(msg);
        } else if (msg.command === 'all_ch') {
            msg.reply(
                msg.guild.channels.cache
                    .map(ch => `[${ch.type}] \`${ch.name}\``)
                    .join('\n'),
            );
        } else if (msg.command === 'audit') {
            audit(msg);
        } else if (msg.command === 'set') {
            if (!msg.args[1]) return msg.reply('채널 이름 정해!!');
            if (!msg.args[2]) return msg.reply('값을 정해!!');
            let ch = msg.guild.channels.cache
                .filter(ch => ch.type === 'text')
                .find(ch => ch.name === msg.args[1]);

            if (!ch) {
                let parent_name = 'asd'; //NOTE default
                const where = msg.args
                    .slice(3)
                    .find(arg => arg.startsWith('where:'))
                    ?.slice(6);

                if (where) {
                    if (
                        !msg.guild.channels.cache
                            .array()
                            .filter(ch => ch.type === 'category')
                            .map(ch => ch.name)
                            .includes(where)
                    ) {
                        return msg.reply(`${where} 이라는 채널은 없거든!!!`);
                    } else parent_name = where;
                }

                const parent = msg.guild.channels.cache
                    .filter(ch => ch.type === 'category')
                    .find(ch => ch.name === parent_name);

                if (!parent) {
                    return msg.reply('카테고리가 없아요! 아이고!');
                }

                ch = await msg.guild.channels.create(msg.args[1], {
                    type: 'text',
                    topic: 'new field',
                    reason: 'create new cate',
                    parent,
                });
            }

            const my_message_id = cache.get(ch.id);
            try {
                const my_message =
                    my_message_id === null
                        ? await ch.send(msg.args[2])
                        : await (await ch.messages.fetch(my_message_id)).edit(
                              msg.args[2],
                          );

                cache.set(ch.id, my_message.id);
            } catch (err) {
                console.error(err);
            }
        }
    })
    .on('inviteCreate', invite => {
        console.log('Event: inviteCreate');

        show_invite_info(invite);
    })
    // .on('messageDelete', async old_msg => {

    // 	const asd = {
    // 		title: "메세지 삭제",
    // 		description: `${old_msg.author} 님이 메세지를 삭제하셨어요!`,
    // 		color: 1480672,

    // 		fields: [
    // 			{
    // 				name: `삭제가 발생한 채널:`,
    // 				value: `${new_msg.channel}`,
    // 			},
    // 			{
    // 				name: `삭제가 발생한 시각:`,
    // 				value: `${new_msg.channel}`,
    // 			},
    // 		]
    // 	}

    // 	server_log(`\n삭제된 내용: ${old_msg.content}`)
    // })
    // .on('messageUpdate', async (old_msg, new_msg) => {
    // 	server_log(`${new_msg.author} 님이 ${} 채널에서 "${old_msg.content}" 를 "${new_msg.content}" 로 수정하셨어요!`)
    // })
    .login(process.env.TOKEN)
    .catch(console.error);
