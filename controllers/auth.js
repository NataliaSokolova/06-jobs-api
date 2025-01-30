import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

async function register(req, res) {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}

async function login(req, res) {
  const user = await User.checkExistUser(req.body);

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid Credentials" });
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

export { register, login };