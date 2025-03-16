import express, { json } from "express";

import { prisma } from "db/prisma";
import cors from "cors";
import { authMiddleware } from "./middleware";
const app = express();

app.use(json());
app.use(cors());

app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;

  const data = await prisma.website.create({
    data: {
      userId,
      url,
    },
  });

  res.json({
    id: data.id,
  });
});

app.post("/api/v1/website/status", async (req, res) => {
  const wesbiteId = req.query.websiteId as string;
  const userId = req.userId;

  const data = await prisma.website.findFirst({
    where: {
      id: wesbiteId,
      userId,
    },
    include: {
      ticks: true,
    },
  });

  res.json(data);
});

app.get("/api/v1/website", async (req, res) => {
  const userId = req.userId;

  const data = await prisma.website.findMany({
    where: {
      userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });

  res.json({
    data,
  });
});

app.delete("/api/v1/website", async (req, res) => {
  const websiteId = req.body.websiteId;
  const userId = req.userId;

  const data = await prisma.website.update({
    where: {
      userId,
      id: websiteId,
    },
    data: {
      disabled: true,
    },
  });

  res.json({
    data,
  });
});

app.listen(8080);
