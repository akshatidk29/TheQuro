import User from "../Models/userModel.js";

export const deductTokens = async ({ userEmail, tokensToDeduct, reason }) => {
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new Error("User not found.");
    if (tokensToDeduct <= 0) throw new Error("Invalid token amount.");
    if (user.tokens < tokensToDeduct) throw new Error("Insufficient tokens.");

    user.tokens -= tokensToDeduct;

    user.tokenHistory.push({
        type: "Deduct",
        amount: tokensToDeduct,
        reason
    });

    await user.save();
};


export const creditTokens = async ({ userEmail, tokensToCredit, reason }) => {
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new Error("User not found.");
    if (tokensToCredit <= 0) throw new Error("Invalid token amount.");

    user.tokens += tokensToCredit;


    user.tokenHistory.push({
        type: "Credit",
        amount: tokensToCredit,
        reason
    });

    await user.save();
};

