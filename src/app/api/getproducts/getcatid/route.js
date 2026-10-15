import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        { status: 400 }
      );
    }

    const [products] = await db.execute(
      `
      SELECT
        p.*,
        c.name AS categoryName,
        c.slug AS categorySlug
      FROM product p
      LEFT JOIN category c
        ON p.categoryId = c.id
      WHERE c.slug = ?
      ORDER BY p.id DESC
      `,
      [category]
    );

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("GET PRODUCTS BY CATEGORY ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products",
        error: err.message,
      },
      { status: 500 }
    );
  }
}