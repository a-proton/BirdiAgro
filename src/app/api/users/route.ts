// src/app/api/users/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// GET - Fetch all users
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role = "Staff" } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== "Admin" && role !== "Staff") {
      return NextResponse.json(
        { error: "Role must be either 'Admin' or 'Staff'" },
        { status: 400 }
      );
    }

    // Create Supabase Admin Client (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if email already exists in users table
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "यो इमेल पहिले नै प्रयोग भइसकेको छ" },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role,
        },
      });

    if (authError) {
      console.error("Auth error:", authError);

      // Check if it's a duplicate email error
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "यो इमेल पहिले नै प्रयोग भइसकेको छ" },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: "Failed to create auth user" },
        { status: 500 }
      );
    }

    // Check if user already exists in users table with this ID
    const { data: existingUserById } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (existingUserById) {
      // User already exists in users table, just return it
      const { data: existingUserData } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      return NextResponse.json(existingUserData, { status: 201 });
    }

    // Insert into users table with the SAME ID from auth
    const { data: userData, error: dbError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);

      // If it's a duplicate key error, the user was created successfully
      // but already exists in the table (race condition or trigger)
      if (dbError.code === "23505") {
        const { data: existingUserData } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (existingUserData) {
          return NextResponse.json(existingUserData, { status: 201 });
        }
      }

      // Rollback: delete the auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "प्रयोगकर्ता सिर्जना गर्न असफल भयो" },
        { status: 500 }
      );
    }

    return NextResponse.json(userData, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error creating user:", error);
    return NextResponse.json({ error: "अज्ञात त्रुटि भयो" }, { status: 500 });
  }
}
