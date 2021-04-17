module.exports = async msg => {
    // console.log("asdf")

    const target = msg.mentions.members.first();
    console.log(msg.member.permissions);
    console.log(msg.member.permissions.bitfield);
    console.log(msg.member.permissions.ALL);
    console.log(msg.member.permissions.DEFAULT);
    console.log(msg.member.permissions.FLAGS);
    // console.log(msg.member.permissions.)
};
