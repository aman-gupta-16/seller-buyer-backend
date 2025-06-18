import prisma from "../prisma/prismaClient.js";

export const createNewBid =async (req, res) => {
  try {
    const {  projectId, bidAmount, estimatedTime, message } = req.body;
    const sellerId = req.user.id;

    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if seller exists
    const seller = await prisma.seller.findUnique({ where: { id: sellerId } });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const bid = await prisma.bid.create({
      data: {
        sellerId,
        projectId,
        bidAmount,
        estimatedTime,
        message,
      },
    });

    res.status(201).json({ bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place bid" });
  }
}


export const getBidForProjects =  async (req, res) => {
  try {
    const { projectId } = req.params;

    const bids = await prisma.bid.findMany({
      where: { projectId: parseInt(projectId) },
      include: { seller: true}, // Include seller info in response
      // include:{project:true}
    });

    res.json({ bids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
};


