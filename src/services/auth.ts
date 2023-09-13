import bcript from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findExistedUser,
  findUserByID,
  findUserByRefreshToken,
  findUserByUsername,
  registerUser,
  saveRefreshToken,
} from "../repositories/user";

const register = async (username: string, email: string, password: string) => {
  const existedUser = await findExistedUser(username, email);
  if (existedUser) {
    console.log("Username or Email is already used!");
    throw new Error("Username or Email is already used!");
  }

  const hashed = await bcript.hash(password, +process.env.BC_SALT_ROUNDS);
  const newUser = await registerUser(username, email, hashed);
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
  const user = await findUserByUsername(username);
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
    ? user.refreshTokens
    : user.refreshTokens.filter((token) => token !== refreshToken);

  const savedUser = await saveRefreshToken(user, [
    ...newRefreshTokenArr,
    newRefreshToken,
  ]);

  console.log(savedUser.refreshTokens);

  return { accessToken, newRefreshToken };
};

const handleRefreshToken = async (refreshToken: string) => {
  let decoded: any;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    //expired refresh token
    const expiredUser = await findUserByRefreshToken(refreshToken);
    if (expiredUser) {
      console.log(
        await saveRefreshToken(
          expiredUser,
          expiredUser.refreshTokens.filter((rt) => rt !== refreshToken)
        )
      );
    }
    throw new Error("Invalid or expired refresh token");
  }

  const user = await findUserByID(decoded.userID);

  // Refresh token reuse
  if (!user.refreshTokens.includes(refreshToken)) {
    console.log("Refresh token is being reused");
    await saveRefreshToken(user, []);
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

  await saveRefreshToken(user, [...newRefreshTokenArr, newRefreshToken]);

  return { accessToken, newRefreshToken };
};

const logout = async (refreshToken: string) => {
  const user = await findUserByRefreshToken(refreshToken);
  if (!user) throw new Error("Refresh token not found");
  await saveRefreshToken(
    user,
    user.refreshTokens.filter((rt) => rt !== refreshToken)
  );
};

export { register, login, handleRefreshToken, logout };
