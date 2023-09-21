import bcript from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user";
import transporter from "../common/mailTransporter";
import Mail from "nodemailer/lib/mailer";

const register = async (username: string, email: string, password: string) => {
  const existedUser = await userRepo.findExistedUser(username, email);
  if (existedUser) {
    console.log("Username or Email is already used!");
    throw new Error("Username or Email is already used!");
  }

  const hashed = await bcript.hash(password, +process.env.BC_SALT_ROUNDS);
  const newUser = await userRepo.registerUser(username, email, hashed);
  if (newUser) {
    console.log("Registered new user!");
    return newUser;
  } else {
    console.log("Error creating new user!");
    throw new Error("Error creating new user!");
  }
};

const login = async (
  username: string,
  password: string,
  refreshToken: string
) => {
  const user = await userRepo.findUserByUsername(username);
  if (!user) {
    const message: string = "A user with this username could not be found!";
    console.log(message);
    throw new Error(message);
  }

  const match = await bcript.compare(password, user.password);
  if (!match) {
    const message: string = "Password is incorrect";
    console.log(message);
    throw new Error(message);
  }

  const accessToken = jwt.sign(
    { userID: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );

  const newRefreshToken = jwt.sign(
    { userID: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );

  let newRefreshTokenArr = !refreshToken
    ? user.refreshTokens || []
    : user.refreshTokens.filter((token) => token !== refreshToken);

  let shouldClearToken = false;

  if (refreshToken) {
    /* 
      Scenarios: 
          1) User logs in but never uses RT and does not logout
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
    */
    const foundToken = user.refreshTokens.includes(refreshToken);

    if (!foundToken) {
      console.log("Refresh token reuse at login!");
      newRefreshTokenArr = [];
    }

    shouldClearToken = true;
  }

  const savedUser = await userRepo.saveRefreshToken(user, [
    ...newRefreshTokenArr,
    newRefreshToken,
  ]);

  return { accessToken, newRefreshToken, shouldClearToken };
};

const getLoginStatus = async (accessToken: string, refreshToken: string) => {
  try {
    const decodedAccess: any = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const decodedRefresh: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (decodedAccess && decodedRefresh) return true;
  } catch (err) {
    const user = await userRepo.findUserByRefreshToken(refreshToken);
    await userRepo.saveRefreshToken(
      user,
      user.refreshTokens.filter((rt) => rt !== refreshToken)
    );
    throw new Error("Invalid or expired tokens");
  }
};

const handleRefreshToken = async (refreshToken: string) => {
  let decoded: any;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    //expired refresh token
    const expiredUser = await userRepo.findUserByRefreshToken(refreshToken);
    if (expiredUser) {
      console.log(
        await userRepo.saveRefreshToken(
          expiredUser,
          expiredUser.refreshTokens.filter((rt) => rt !== refreshToken)
        )
      );
    }
    throw new Error("Invalid or expired refresh token");
  }

  const user = await userRepo.findUserByID(decoded.userID);

  // Refresh token reuse
  if (!user.refreshTokens.includes(refreshToken)) {
    console.log("Refresh token is being reused");
    await userRepo.saveRefreshToken(user, []);
    throw new Error("Refresh token already used");
  }

  const newRefreshTokenArr = user.refreshTokens.filter(
    (rt) => rt !== refreshToken
  );

  const accessToken = jwt.sign(
    { userID: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );

  const newRefreshToken = jwt.sign(
    { userID: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );

  await userRepo.saveRefreshToken(user, [
    ...newRefreshTokenArr,
    newRefreshToken,
  ]);

  return { accessToken, newRefreshToken };
};

const logout = async (refreshToken: string) => {
  const user = await userRepo.findUserByRefreshToken(refreshToken);
  if (!user) throw new Error("Refresh token not found");
  await userRepo.saveRefreshToken(
    user,
    user.refreshTokens.filter((rt) => rt !== refreshToken)
  );
};

const forgetPassword = async (email: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error("User not registered");

  const secret = process.env.RESET_PASS_SECRET + user.password;

  const token = jwt.sign(
    { userid: user.id, username: user.username, email: user.email },
    secret,
    { expiresIn: process.env.RESET_PASS_EXPIRE }
  );
  const link = `${process.env.CLIENT_URL}/reset-password/${user.username}/${token}`;

  const message: Mail.Options = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Reset password",
    text: `Visit link to reset your password: ${link}`,
  };

  const sentInfo = await transporter.sendMail(message);
  return sentInfo;
};

const getResetPassword = async (username: string, token: string) => {
  const user = await userRepo.findUserByUsername(username);
  if (!user) throw new Error("User does not exist");

  const secret = process.env.RESET_PASS_SECRET + user.password;
  const data = jwt.verify(token, secret);
  return data;
};

const resetPassword = async (
  username: string,
  password: string,
  token: string
) => {
  const user = await userRepo.findUserByUsername(username);
  if (!user) throw new Error("User does not exist");

  const secret = process.env.RESET_PASS_SECRET + user.password;
  jwt.verify(token, secret);

  const hashed = await bcript.hash(password, +process.env.BC_SALT_ROUNDS);

  return userRepo.changePassword(user, hashed);
};

export {
  register,
  login,
  getLoginStatus,
  handleRefreshToken,
  logout,
  forgetPassword,
  getResetPassword,
  resetPassword,
};
