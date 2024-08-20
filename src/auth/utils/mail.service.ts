import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { minify } from 'html-minifier-terser';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

const mjml2html = require('mjml');

export enum TemplateTypeEnum {
  emailSignIn = 'sign-in',
  emailSignUp = 'sign-up',
}

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: TemplateTypeEnum,
    context: { [key: string]: any },
  ) {
    const mjmlTemplate = await this.getEmailTemplate(templateName);

    context.year = new Date().getFullYear();

    const mjmlWithVariables = this.replaceVariables(mjmlTemplate, context);

    const { html } = mjml2html(mjmlWithVariables);

    const minifiedHtml = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });

    const mailOptions = {
      from: `"Spicy.Pub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: minifiedHtml,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }

  private replaceVariables(
    template: string,
    variables: { [key: string]: any },
  ): string {
    return Object.keys(variables).reduce((acc, key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      return acc.replace(regex, variables[key]);
    }, template);
  }

  async getEmailTemplate(templateName: TemplateTypeEnum) {
    try {
      const pathName = path.join(
        __dirname,
        'templates',
        `${templateName}.mjml`,
      );
      return await fs.readFile(pathName, 'utf8');
    } catch (error) {
      console.error(`Error reading email template: ${error}`);
      throw new Error(error);
    }
  }
}
