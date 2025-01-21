import express, { Request, Response, Router } from "express";
import multer from "multer";
import Product from "../models/Product";
const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

interface MulterFileFields {
  thumbnail?: Express.Multer.File[];
  cover?: Express.Multer.File[];
}

router.post(
  "/",
  upload.fields([{ name: "thumbnail" }, { name: "cover" }]),
  async (req: Request, res: Response) => {
    const { title, quantity, price, stock, discount } = req.body;

    const files = req.files as MulterFileFields;
    const thumbnail = files?.thumbnail ? files.thumbnail[0].path : "";
    const cover = files?.cover ? files.cover[0].path : "";

    try {
      const newProduct = new Product({
        title,
        photo: { thumbnail, cover },
        quantity,
        price,
        stock,
        discount,
      });

      await newProduct.save();
      res
        .status(201)
        .json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, sort } = req.query;

  try {
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string))
      .sort({ price: sort === "desc" ? -1 : 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
