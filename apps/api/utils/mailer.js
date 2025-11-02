import mjml2html from "mjml";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename__ = fileURLToPath(import.meta.url);
const __dirname__ = path.dirname(__filename__);

// Default configuration to Mailpit
const { SMTP_HOST = "localhost", SMTP_PORT = 1025, SMTP_USER, SMTP_PASS, SMTP_SECURE = "false" } = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

export const getEmailTemplate = async (name, context = {}) => {
  const template = fs.readFileSync(path.join(__dirname__, "../emails", `${name}.mjml`), "utf-8");
  let { html } = await mjml2html(template);

  for (const [key, value] of Object.entries(context)) {
    html = html.replaceAll(`[[${key}]]`, value);
  }

  return html;
};
