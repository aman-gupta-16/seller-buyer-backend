import prisma from "../prisma/prismaClient.js";

export const createNewProject = async (req, res) => {
  try {
    const { title, description, budgetMin, budgetMax, deadline, buyerId } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budgetMin,
        budgetMax,
        deadline: new Date(deadline),
        buyerId,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create project" });
  }
}