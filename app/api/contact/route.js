// File: app/api/contact/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import nodemailer from 'nodemailer';

export async function POST(request) {
  // 1. Ambil sesi dari server untuk memastikan pengguna sudah login
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Anda harus login.' }, { status: 401 });
  }

  try {
    const { name, email, message } = await request.json();

    // 2. Validasi input dasar
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi.' }, { status: 400 });
    }

    // 3. Konfigurasi transporter Nodemailer menggunakan App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4. Opsi email
    const mailOptions = {
      from: `"${name}" <${email}>`, // Bisa juga dari process.env.GMAIL_EMAIL
      to: process.env.EMAIL_USER, // Kirim ke email Anda sendiri
      subject: `Pesan Kontak Baru dari ${name}`,
      html: `
        <h2>Pesan dari Formulir Kontak RuangRiung AI</h2>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email Pengirim:</strong> ${email}</p>
        <hr>
        <p><strong>Pesan:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // 5. Kirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Pesan berhasil dikirim!' }, { status: 200 });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengirim pesan.' }, { status: 500 });
  }
}