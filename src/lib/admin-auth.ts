import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** Sesión del panel: una cookie firmada con ADMIN_PASSWORD. Cambiar la contraseña cierra todas las sesiones. */
const adminPassword = process.env.ADMIN_PASSWORD ?? "";
const cookieName = "admin_session";
const sessionMs = 8 * 60 * 60 * 1000;

export const isAdminConfigured = adminPassword.length >= 12;

function sign(value: string) {
  return createHmac("sha256", adminPassword).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(sign(`compare:${a}`));
  const right = Buffer.from(sign(`compare:${b}`));
  return timingSafeEqual(left, right);
}

export function isCorrectPassword(password: unknown) {
  return isAdminConfigured && typeof password === "string" && safeEqual(password, adminPassword);
}

export async function startAdminSession() {
  const expires = Date.now() + sessionMs;
  const store = await cookies();
  store.set(cookieName, `${expires}.${sign(`session:${expires}`)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMs / 1000,
  });
}

export async function endAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function isAdminSession() {
  if (!isAdminConfigured) return false;
  const store = await cookies();
  const [expires = "", signature = ""] = (store.get(cookieName)?.value ?? "").split(".");
  return Number(expires) > Date.now() && safeEqual(signature, sign(`session:${expires}`));
}
