import { RequestHandler } from "express";
import * as authService from "../services/auth";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await authService.register(
      username,
      email,
      password.trim()
    );
    if (newUser) res.send("Registered new user!");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const refreshToken = req.cookies.refreshToken;

    const { accessToken, newRefreshToken, shouldClearToken } =
      await authService.login(username, password.trim(), refreshToken);

    if (shouldClearToken) {
      res.clearCookie("refreshToken");
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.send("Logged in");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getLoginStatus: RequestHandler = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    const isLoggedIn = await authService.getLoginStatus(
      accessToken,
      refreshToken
    );
    if (isLoggedIn) res.status(200).send("Logged in");
  } catch (err) {
    res.status(403).send(err.message);
  }
};

const handleRefreshToken: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("No refresh token provided");

    const { accessToken, newRefreshToken } =
      await authService.handleRefreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.send("Refreshed tokens");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const logout: RequestHandler = async (req, res, next) => {
  try {
    await authService.logout(req.cookies.refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).send("Logged out");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { register, login, getLoginStatus, logout, handleRefreshToken };
