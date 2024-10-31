const requiredChannels = ["@requiredbot77"];

const checkUserMemberShip = async (ctx) => {
  try {
    const userId = ctx.message.from.id;
    let isMember = true;

    for (channel of requiredChannels) {
      const member = await ctx.telegram.getChatMember(channel, userId);
      if (member.status == "left" || member.status == "kicked") {
        isMember = false;
        break;
      }
    }

    return isMember;
  } catch (error) {
    throw error;
  }
};

module.exports = { checkUserMemberShip };
