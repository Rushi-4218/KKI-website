import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const [[product]] = await db.execute(
      `SELECT p.*, c.name AS categoryName, c.slug AS categorySlug FROM product p
       LEFT JOIN category c ON p.categoryId = c.id
       WHERE p.slug = ?`,
      [slug]
    );

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("GET PRODUCT BY SLUG ERROR:", err);
    return NextResponse.json({ success: false, message: "Error fetching product" }, { status: 500 });
  }
}
