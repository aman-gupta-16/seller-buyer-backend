import prisma from "../prisma/prismaClient.js";

export const createNewProject = async (req, res) => {
  try {
    const { title, description, budgetMin, budgetMax, deadline } =
      req.body;
      const buyerId= req.user.id;

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
};

export const getAllPendingProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "Pending" }, // only show open projects
      include: { buyer: true }, // include buyer info if needed
    });

    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const selectSeller = async (req, res) => {
  try {
    const { projectId, sellerId } = req.body;

    const project = await prisma.project.findUnique({
      where: { id:parseInt(projectId)  },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const seller = await prisma.seller.findUnique({ where: { id:parseInt(sellerId)} });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId)},
      data: {
        status: "In Progress",
        selectedSellerId: sellerId,
      },
    });

    // Send Email to Seller (using Nodemailer)
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: seller.email,
      subject: "You have been selected for a project!",
      text: `Congratulations! You have been selected for the project: ${project.title}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({
      message: "Seller selected successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to select seller" });
  }
};

// Upload deliverables to Cloudinary
export const uploadDeliverables = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `${req.file.path}?fl_attachment` ;

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        deliverableUrl: fileUrl,
      },
    });

    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const buyer = await prisma.buyer.findUnique({
      where: { id: project.buyerId },
    });
    const seller = await prisma.seller.findUnique({
      where: { id: project.selectedSellerId },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${buyer.email}, ${seller.email}`,
      subject: "Project Completed!",
      text: `The project "${project.title}" has been marked as completed. Deliverables: ${fileUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({
      message: "Deliverable uploaded and project completed.",
      fileUrl,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to upload deliverable" });
  }
};


export const getProjectsByBuyer = async (req,res)=>{
  const buyerId = req.user.id;
  try {
    const buyer = await prisma.buyer.findUnique({
      where:{id:buyerId}
    })
    if(!buyer){
      return res.status(404).json({ error: "Buyer not found" });
    }
    const projects = await prisma.project.findMany({
      where:{buyerId:buyer.id}
    })
    return res.status(200).json({
      message:"projects Found",
      projects
    })
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to Get Project" });
  
  }
}

export const getProject = async(req,res)=>{
  const {projectId} = req.params;
  try {
    const project = await prisma.project.findUnique({
      where:{
        id:parseInt(projectId)
      }
    })
    return res.status(200).json({
      message:"project Found",
      project
    })
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to Get Projects" });
  }
}

export const awardedBidBySeller = async (req,res)=>{
  const sellerId = req.user.id;
  try {
    const seller = await prisma.seller.findUnique({
      where:{id:parseInt(sellerId)}
    })
    if(!seller){
      return res.status(404).json({
        error:"Seller Not Found"
      })
    }
    const projects = await prisma.project.findMany({
      where:{
        selectedSellerId:parseInt(sellerId)
      }
    })
    return res.status(201).json({
      message:"projects found",
      projects
    })
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to Get Projects" });
  }
}

export const updateStatusOfProject = async (req,res)=>{
  const {status,projectId} = req.body;
  try {
    const project = await prisma.project.findUnique({
      where:{id:projectId}
    })
    if(!project){
      return res.status(404).json({
        error:"project is not found"
      })
    }

    const updatedProject = await prisma.project.update({
      where:{id:projectId},
        data: {
        status: status,
      }, 
    })
    return res.status(201).json({
      message:"status updated succesfully",
      updatedProject,
    })
  } catch (error) {
     console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update status" });
  }
}