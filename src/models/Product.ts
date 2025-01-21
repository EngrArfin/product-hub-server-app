import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  title: string;
  photo: { thumbnail: string; cover: string };
  quantity: number;
  price: number;
  stock: number;
  discount: number;
}

const productSchema: Schema<IProduct> = new Schema({
  title: { type: String, required: true },
  photo: {
    thumbnail: { type: String, required: true },
    cover: { type: String, required: true },
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  discount: { type: Number, required: true },
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
