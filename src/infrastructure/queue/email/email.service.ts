import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(configService: ConfigService) {
    this.from = configService.getOrThrow<string>('SMTP_FROM');
    this.transporter = nodemailer.createTransport({
      host: configService.getOrThrow<string>('SMTP_HOST'),
      port: configService.getOrThrow<number>('SMTP_PORT'),
      secure: configService.getOrThrow<boolean>('SMTP_SECURE'),
      auth: {
        user: configService.getOrThrow<string>('SMTP_USER'),
        pass: configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Bem-vindo!',
      text: 'Seja bem-vindo ao ChatDesktop!',
      html: `
        <h1>Bem-vindo!</h1>

        <p>
          Seu cadastro foi realizado com sucesso.
        </p>
      `,
    });
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Confirme seu e-mail',
      text: `Seu código de confirmação é: ${code}`,
      html: `
        <h1>Confirmação de e-mail</h1>

        <p>
          Utilize o código abaixo para confirmar seu endereço de e-mail:
        </p>

        <h2>${code}</h2>

        <p>
          Esse código expira em 10 minutos.
        </p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Recuperação de senha',
      text: `Seu código para redefinir sua senha é: ${code}`,
      html: `
      <h1>Recuperação de senha</h1>

      <p>
        Recebemos uma solicitação para redefinir sua senha.
      </p>

      <p>
        Utilize o código abaixo:
      </p>

      <h2>${code}</h2>

      <p>
        Esse código expira em 10 minutos.
      </p>

      <p>
        Se você não solicitou a recuperação da senha,
        ignore este e-mail.
      </p>
    `,
    });
  }
}
