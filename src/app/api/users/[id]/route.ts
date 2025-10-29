// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create admin client with service role
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id } = await params;

    const body = await request.json();
    const { name, role, email, password } = body;

    console.log("[Update User] Received request for ID:", id);
    console.log("[Update User] Body:", {
      name,
      role,
      email,
      hasPassword: !!password,
    });

    // Validate input
    if (!name && !role && !email && !password) {
      return NextResponse.json(
        { error: "कम्तिमा एउटा फिल्ड आवश्यक छ" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && role !== "Admin" && role !== "Staff") {
      return NextResponse.json(
        { error: "भूमिका 'Admin' वा 'Staff' हुनुपर्छ" },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it's already in use
    if (email) {
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .neq("id", id)
        .maybeSingle();

      if (existingUser) {
        return NextResponse.json(
          { error: "यो इमेल पहिले नै प्रयोग भइसकेको छ" },
          { status: 400 }
        );
      }
    }

    // Update user in users table
    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (email) updateData.email = email;

    let updatedUser = null;

    if (Object.keys(updateData).length > 0) {
      const { data, error: updateError } = await supabaseAdmin
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        console.error("[Update User] Error updating users table:", updateError);
        return NextResponse.json(
          { error: "प्रयोगकर्ता अपडेट गर्न असफल भयो" },
          { status: 500 }
        );
      }

      updatedUser = data;
    } else {
      // If only password is being updated, fetch current user data
      const { data } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      updatedUser = data;
    }

    // Update auth user (email, password, or metadata)
    const authUpdateData: any = {};

    if (email) {
      authUpdateData.email = email;
    }

    if (password && password.trim() !== "") {
      authUpdateData.password = password;
      console.log("[Update User] Updating password");
    }

    if (name || role) {
      authUpdateData.user_metadata = {};
      if (name) authUpdateData.user_metadata.name = name;
      if (role) authUpdateData.user_metadata.role = role;
    }

    if (Object.keys(authUpdateData).length > 0) {
      console.log(
        "[Update User] Updating auth with:",
        Object.keys(authUpdateData)
      );

      const { data: authUser, error: authUpdateError } =
        await supabaseAdmin.auth.admin.updateUserById(id, authUpdateData);

      if (authUpdateError) {
        console.error(
          "[Update User] Error updating auth user:",
          authUpdateError
        );
        return NextResponse.json(
          {
            error:
              "प्रमाणीकरण डेटा अपडेट गर्न असफल भयो: " + authUpdateError.message,
          },
          { status: 500 }
        );
      }

      console.log("[Update User] Auth user updated successfully");
    }

    console.log("[Update User] Update completed successfully");
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[Update User] Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "आन्तरिक सर्भर त्रुटि" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id } = await params;

    // Delete from users table first
    const { error: deleteError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting user from users table:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Delete from auth.users
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(id);

    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError);
      return NextResponse.json({
        success: true,
        warning: "User deleted from database but auth deletion failed",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/users/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
