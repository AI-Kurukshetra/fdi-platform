"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function buildLoginRedirect(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `/login?${query}` : "/login";
}

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isLocalDevelopmentAuthEnabled() {
  return process.env.NODE_ENV !== "production" && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getAuthMessage(errorMessage: string) {
  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "Your account exists, but the email is not confirmed yet. In local development you can press Create account again to auto-confirm it.";
  }

  if (normalized.includes("rate limit") || normalized.includes("only request this after")) {
    return "Supabase is rate-limiting confirmation emails right now. In local development, press Create account again and the app will finish setup without waiting for email delivery.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Invalid login credentials. If this is your first time here, use Create account first so the local development flow can provision the user.";
  }

  if (normalized.includes("already been registered")) {
    return "That email is already registered. In local development, Create account will also repair unconfirmed accounts and sign you in.";
  }

  return errorMessage;
}

async function findAuthUserByEmail(email: string) {
  const admin = createAdminClient();
  let page = 1;

  while (page <= 10) {
    const {
      data: { users },
      error
    } = await admin.auth.admin.listUsers({
      page,
      perPage: 200
    });

    if (error) {
      throw new Error(error.message);
    }

    const existingUser = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return existingUser;
    }

    if (users.length < 200) {
      break;
    }

    page += 1;
  }

  return null;
}

async function ensureDevelopmentUser(email: string, password: string) {
  const admin = createAdminClient();
  const existingUser = await findAuthUserByEmail(email);

  if (existingUser) {
    const { data, error } = await admin.auth.admin.updateUserById(existingUser.id, {
      email_confirm: true,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Unable to create development user.");
  }

  return data.user;
}

async function signInAfterRepair(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return error;
}

export async function signInAction(formData: FormData) {
  const email = getTextValue(formData, "email");
  const password = getTextValue(formData, "password");
  const next = getTextValue(formData, "next") || "/dashboard";
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    const shouldRepairDemoUser =
      isLocalDevelopmentAuthEnabled() &&
      email.toLowerCase() === (process.env.SEED_USER_EMAIL ?? "").toLowerCase() &&
      password === (process.env.SEED_USER_PASSWORD ?? "");

    const shouldRepairUnconfirmedUser =
      isLocalDevelopmentAuthEnabled() && error.message.toLowerCase().includes("email not confirmed");

    if (shouldRepairDemoUser || shouldRepairUnconfirmedUser) {
      try {
        await ensureDevelopmentUser(email, password);
        const repairedSignInError = await signInAfterRepair(email, password);

        if (!repairedSignInError) {
          redirect(next);
        }
      } catch (repairError) {
        const message = repairError instanceof Error ? repairError.message : error.message;
        redirect(
          buildLoginRedirect({
            error: getAuthMessage(message),
            email,
            next
          })
        );
      }
    }

    redirect(
      buildLoginRedirect({
        error: getAuthMessage(error.message),
        email,
        next
      })
    );
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const email = getTextValue(formData, "email");
  const password = getTextValue(formData, "password");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || headers().get("origin") || undefined;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: origin
      ? {
          emailRedirectTo: `${origin}/dashboard`
        }
      : undefined
  });

  if (error) {
    if (isLocalDevelopmentAuthEnabled()) {
      try {
        await ensureDevelopmentUser(email, password);
        const repairedSignInError = await signInAfterRepair(email, password);

        if (!repairedSignInError) {
          redirect("/dashboard");
        }
      } catch (repairError) {
        const message = repairError instanceof Error ? repairError.message : error.message;
        redirect(
          buildLoginRedirect({
            error: getAuthMessage(message),
            email
          })
        );
      }
    }

    redirect(
      buildLoginRedirect({
        error: getAuthMessage(error.message),
        email
      })
    );
  }

  if (!data.session) {
    if (isLocalDevelopmentAuthEnabled()) {
      try {
        await ensureDevelopmentUser(email, password);
        const repairedSignInError = await signInAfterRepair(email, password);

        if (!repairedSignInError) {
          redirect("/dashboard");
        }
      } catch (repairError) {
        const message = repairError instanceof Error ? repairError.message : "Check your email to complete signup.";
        redirect(
          buildLoginRedirect({
            error: getAuthMessage(message),
            email
          })
        );
      }
    }

    redirect(
      buildLoginRedirect({
        message: "Account created. Check your email to complete signup before signing in.",
        email
      })
    );
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login?message=Signed%20out%20successfully.");
}
