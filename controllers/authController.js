// controllers/authController.js
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";
import jwt from 'jsonwebtoken';


export const registerBuyer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingBuyer = await prisma.buyer.findUnique({ where: { email } });
    if (existingBuyer)
      return res.status(400).json({ error: "Buyer already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const buyer = await prisma.buyer.create({
      data: { name, email, password: hashedPassword },
    });

    res.json({ message: "Buyer registered successfully", buyer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingSeller = await prisma.seller.findUnique({ where: { email } });
    if (existingSeller)
      return res.status(400).json({ error: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.seller.create({
      data: { name, email, password: hashedPassword },
    });

    res.json({ message: "Seller registered successfully", seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body; // role = 'buyer' or 'seller'

    let user;
    if (role === "buyer") {
      user = await prisma.buyer.findUnique({ where: { email } });
    } else if (role === "seller") {
      user = await prisma.seller.findUnique({ where: { email } });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};
