import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT ?? '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Bem-vindo!',
      text: 'Seja bem-vindo ao PH Nest API!',
      html: `
        <h1>Bem-vindo!</h1>
        <p>
          Seu cadastro foi realizado com sucesso.
        </p>
      `,
    });
  }
}
