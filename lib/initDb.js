import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // غيّر المسار لو مختلف عندك

// GET all posts (news)
export async function GET(req) {
  try {
    const result = await query("SELECT * FROM posts ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST new post (news)
export async function POST(req) {
  try {
    const { title, content, image_url, user_id } = await req.json();

    if (!title || !content || !image_url || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      INSERT INTO posts (title, content, image_url, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [title, content, image_url, user_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// DELETE a post (by id)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    await query("DELETE FROM posts WHERE id = $1", [id]);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
