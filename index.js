const net = require('net');
const discord = require('discord.js');

const chalk = require('chalk');
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

if (!process.env.TOKEN) {
    console.log('token is undefiend');

    process.exit(3);
}

const cache = {
    $: {},
    get(key) {
        return this.$[key] || null;
    },
    set(key, value) {
        this.$[key] = value;
        return this;
    },
    add(key) {
        if (key in cache) {
            return new Error(`${key} is already exist`);
        }
        this.$[key] = value;
        return this;
    },
    remove(key) {
        if (!key in cache) {
            return new Error(`${key} is not exist`);
        }
        delete this.$[key];
        return this;
    },
    register(key, value, time = 10_000) {
        this.set(key, value, time);

        setTimeout(() => {
            this.remove(key);
        }, time);
        return this;
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

let externalConsole = null;

net.createServer(socket => {
    externalConsole = socket;
}).listen(51944, () => {
    console.log(`TCP serevr ready at ${51944}`);
});

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
            // block_nyn(msg);
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
        } else if (msg.command === 'rpi') {
            if (!msg.args[1]) return msg.reply(`id를 제공하세요`);

            const role_or_null = msg.guild.roles.cache.find(
                r => r.id === msg.args[1],
            );
            if (!role_or_null)
                return msg.reply(
                    `\`${msg.args[1]}\` 라는 아이디의 역할이 없습니다!`,
                );

            console.log(
                `${JSON.stringify(role_or_null.permissions, null, '  ')}`,
            );
        } else if (msg.command === '!emo') {
            msg.delete();
            // msg.channel.lastMessage.react('🤔');
        } else if (msg.command === '추방') {
            if (msg.author.id !== msg.guild.owner.id)
                return msg.reply('권한이 없습니다!');
            if (!msg.mentions.members) {
                msg.reply('추방할 사람을 멘션해 주세요');
            }

            const reason = msg.args
                .find(arg => /^(?:reason|이유):(\S+)$/i.test(arg))
                ?.match(/^(?:reason|이유):(\S+)$/i)[1];

            const myMsg = await msg.reply(
                `\n${msg.mentions.members.map(m => `${m}님`).join(', ')}을 ${
                    reason ? `\`${reason}\`의 사유로` : '정말'
                } ${msg.guild.name}서버에서 추방하시겠습니까?`,
            );

            try {
                // console.log(msg.guild.emojis.cache.first());
                myMsg.react('👌');
                // console.log(msg.guild.emojis.cache.first().toString());
            } catch (err) {
                msg.reply('에러가 발생했습니다!');

                console.log(err);

                msg.reply(JSON.stringify(err, null, '  '));
            }

            console.log(reason);
        } else if (msg.command === 'emoji_id') {
            // if (!msg.args[1]) return msg.reply('이모지를 제공해 주세요!')
            console.log('ashsahkj');

            setTimeout(() => {
                console.log(
                    msg.reactions.cache.array().map(e => e),
                    // .join('\n'),
                );

                console.log('severn');
            }, 7000);

            throw Error('ERRRRRRRRR!@!@@@!@!@!');
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

    .on('channelCreate', ch => {
        console.log('channelCreate!');

        // console.log(ch);

        console.log(`\tchannel type: ${chalk.blue(ch.type)}`);
        if (ch.type === 'dm') {
            console.log(`\trecipient: ${chalk.blue(ch.recipient.tag)}`);
        }
        // bot.host?.send('channelCreate');
    })
    .on('channelDelete', () => {
        console.log('channelDelete!');
        bot.host?.send('channelDelete');
    })
    .on('channelPinsUpdate', () => {
        console.log('channelPinsUpdate!');
        bot.host?.send('channelPinsUpdate');
    })
    .on('channelUpdate', () => {
        console.log('channelUpdate!');
        bot.host?.send('channelUpdate');
    })
    .on('debug', info => {
        externalConsole?.write(chalk.green(`debugInfo: ${info}`));
        // bot.host?.send('debug');
    })
    .on('emojiCreate', () => {
        console.log('emojiCreate!');
        bot.host?.send('emojiCreate');
    })
    .on('emojiDelete', () => {
        console.log('emojiDelete!');
        bot.host?.send('emojiDelete');
    })
    .on('emojiUpdate', () => {
        console.log('emojiUpdate!');
        bot.host?.send('emojiUpdate');
    })
    .on('error', () => {
        console.log('error!');
        bot.host?.send('error');
    })
    .on('guildBanAdd', () => {
        console.log('guildBanAdd!');
        bot.host?.send('guildBanAdd');
    })
    .on('guildBanRemove', () => {
        console.log('guildBanRemove!');
        bot.host?.send('guildBanRemove');
    })
    .on('guildCreate', () => {
        console.log('guildCreate!');
        bot.host?.send('guildCreate');
    })
    .on('guildDelete', () => {
        console.log('guildDelete!');
        bot.host?.send('guildDelete');
    })
    .on('guildIntegrationsUpdate', () => {
        console.log('guildIntegrationsUpdate!');
        bot.host?.send('guildIntegrationsUpdate');
    })
    .on('guildMemberAdd', member => {
        if (!member.guild) {
            return;
        }

        const grt = member.guild.roles.cache.find(
            r => r.id === '815844469810397204',
        );

        msg.channel.lastMessage.react(':thumbsup:');

        // console.log('guildMemberAdd!');
        // bot.host?.send('guildMemberAdd');
    })
    .on('guildMemberAvailable', m => {
        console.log(`${m.displayName} Available!`);
        // bot.host?.send('guildMemberAvailable');
    })
    .on('guildMemberRemove', () => {
        console.log('guildMemberRemove!');
        bot.host?.send('guildMemberRemove');
    })
    .on('guildMembersChunk', () => {
        console.log('guildMembersChunk!');
        bot.host?.send('guildMembersChunk');
    })
    .on('guildMemberSpeaking', () => {
        console.log('guildMemberSpeaking!');
        bot.host?.send('guildMemberSpeaking');
    })
    .on('guildMemberUpdate', (old_m, new_m) => {
        console.log('guildMemberUpdate!');

        console.log(`\t${new_m.user.tag}`);
        console.log(
            `\t${old_m.roles.cache
                .difference(new_m.roles.cache)
                .map(r => `± ${chalk.hex(r.hexColor)(r.name)}`)
                .join('\n')}`,
        );

        // bot.host?.send('guildMemberUpdate');
    })
    .on('guildUnavailable', () => {
        console.log('guildUnavailable!');
        bot.host?.send('guildUnavailable');
    })
    .on('guildUpdate', () => {
        console.log('guildUpdate!');
        bot.host?.send('guildUpdate');
    })
    .on('invalidated', () => {
        console.log('invalidated!');
        bot.host?.send('invalidated');
    })
    .on('inviteCreate', () => {
        console.log('inviteCreate!');
        bot.host?.send('inviteCreate');
    })
    .on('inviteDelete', () => {
        console.log('inviteDelete!');
        bot.host?.send('inviteDelete');
    })
    .on('message', async msg => {
        // console.log('message!');
        // bot.host?.send('message');
        if (msg.author.id === msg.client.user.id) return;

        if (msg.content === cache.get(`lastMsgOf${msg.author.id}`)) {
            msg.reply('ehqoek도배다!!');
        }
        cache.remove(`lastMsgOf${msg.author.id}`);
        cache.register(`lastMsgOf${msg.author.id}`, msg.content);
    })
    .on('messageDelete', msg => {
        console.log(`${msg.author.tag} deletes message: ${msg.content}`);
        // bot.host?.send('messageDelete');
    })
    .on('messageDeleteBulk', () => {
        console.log('messageDeleteBulk!');
        bot.host?.send('messageDeleteBulk');
    })
    .on('messageReactionAdd', () => {
        console.log('messageReactionAdd!');
        bot.host?.send('messageReactionAdd');
    })
    .on('messageReactionRemove', () => {
        console.log('messageReactionRemove!');
        bot.host?.send('messageReactionRemove');
    })
    .on('messageReactionRemoveAll', () => {
        console.log('messageReactionRemoveAll!');
        bot.host?.send('messageReactionRemoveAll');
    })
    .on('messageReactionRemoveEmoji', () => {
        console.log('messageReactionRemoveEmoji!');
        bot.host?.send('messageReactionRemoveEmoji');
    })
    .on('messageUpdate', (old_msg, new_msg) => {
        console.log('messageUpdate!');
        bot.host?.send('messageUpdate');
    })
    .on('presenceUpdate', (old_p, new_p) => {
        // console.log('presenceUpdate!');
        return;

        if (new_p.member.user.bot) return;
        const tag = new_p.member.user.tag;
        // console.log(JSON.stringify(new_p, null, '  '));

        console.log(`${tag} 님의 상태 업데이트`);
        // bot.host?.send('presenceUpdate');
    })
    .on('rateLimit', () => {
        console.log('rateLimit!');
        // bot.host?.send('rateLimit');
    })
    // .on('ready', () => {
    //     console.log('ready!');
    //     bot.host?.send('ready');
    // })
    .on('roleCreate', r => {
        console.log('roleCreate!');
        bot.host?.send('roleCreate');
    })
    .on('roleDelete', () => {
        console.log('roleDelete!');
        bot.host?.send('roleDelete');
    })
    .on('roleUpdate', () => {
        console.log('roleUpdate!');
        bot.host?.send('roleUpdate');
    })
    .on('shardDisconnect', () => {
        console.log('shardDisconnect!');
        bot.host?.send('shardDisconnect');
    })
    .on('shardError', () => {
        console.log('shardError!');
        bot.host?.send('shardError');
    })
    .on('shardReady', () => {
        console.log('shardReady!');
        bot.host?.send('shardReady');
    })
    .on('shardReconnecting', () => {
        console.log('shardReconnecting!');
        bot.host?.send('shardReconnecting');
    })
    .on('shardResume', () => {
        console.log('shardResume!');
        bot.host?.send('shardResume');
    })
    .on('typingStart', async (ch, user) => {
        return;
        console.log(`${user.tag} starts typing at ${ch.name}`);
        // bot.host?.send('typingStart');
        if (user.bot) return;

        // ch.startTyping();

        ch.client.setTimeout(() => {
            ch.stopTyping();
            // console.log(ch.client.user.typingDurationIn(ch));
        }, 2000);

        ch.client.setTimeout(() => {
            console.log(ch.typing);
            console.log(ch.typingCount);

            // console.log(ch.client.user.typingDurationIn());
            // console.log(ch.client.user.typingIn());
            // console.log(ch.client.user.typingSinceIn());

            console.log(
                `${user.tag}.typingDurationIn(): ${ch.guild.members.cache
                    .find(m => m.user.id === user.id)
                    .user.typingDurationIn(ch)}`,
            );
            console.log(`${user.tag}.typingIn(): ${user.typingIn(ch)}`);
            console.log(
                `${user.tag}.typingSinceIn(): ${user.typingSinceIn(ch)}`,
            );
            console.log(`diff: ${new Date() - user.typingSinceIn(ch)}`);
        }, 7000);

        ch.client.setTimeout(async () => {
            if (user.typingIn(ch)) {
                const deleteMsgAfter = (msg, time) => {
                    msg.client.setTimeout(() => {
                        msg.delete();
                    }, time);
                };

                deleteMsgAfter(
                    await ch.send(
                        `${user} 아주 길고 멋진 글을 쓰고 계시군요! 기대하겠습니다!`,
                    ),
                    2000,
                );
            }
        }, 19000);
    })
    .on('userUpdate', () => {
        console.log('userUpdate!');
        bot.host?.send('userUpdate');
    })
    .on('voiceStateUpdate', () => {
        console.log('voiceStateUpdate!');
        bot.host?.send('voiceStateUpdate');
    })
    .on('warn', () => {
        console.warn('warn!');
        // bot.host?.send('warn');
    })
    .on('webhookUpdate', () => {
        console.log('webhookUpdate!');
        bot.host?.send('webhookUpdate');
    })

    .login(process.env.TOKEN)
    .catch(console.error);
