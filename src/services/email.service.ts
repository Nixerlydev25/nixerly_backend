import { SendEmailCommand } from "@aws-sdk/client-ses";
import * as otpModel from "../model/v1/otp.model";

import path from "path";
import fs from "fs";
import ejs from "ejs"; // Ensure ejs is imported
import { sesClient } from "./aws.service";
import { AwsServiceError, DatabaseError, GeneralError } from "../utils/errors";

class OtpService {
  
  static getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static async sendOtpHandler(userId: string, email: string): Promise<void> {
    try {
      const otp = this.getRandomArbitrary(100000, 999999);

      await otpModel.expireExistingOtps(userId);
      await otpModel.createOtp(otp, userId);

      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: { Data: this.getOtpEmailTemplate(otp) },
          },
          Subject: { Data: "Your OTP Code" },
        },
        Source: "noreply@nixerly.com",
      };

      const command = new SendEmailCommand(params);
      await sesClient.send(command);
      console.log("OTP sent successfully.");
    } catch (error: any) {
      throw new AwsServiceError(error.message);
    }
  }

  static async verifyOtpHandler(userId: string, otp: number): Promise<boolean> {
    try {
      const otpRecord = await otpModel.findValidOtp(userId, otp);
      if (otpRecord) {
        await otpModel.expireOtpById(otpRecord.id);
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }
  
  static async verifyOtpByEmailHandler(email: string, otp: number): Promise<boolean> {
    try {
      const otpRecord = await otpModel.findValidOtpByEmail(email, otp);
      if (otpRecord) {
        await otpModel.expireOtpById(otpRecord.id);
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getOtpEmailTemplate(otp: number) {
    try {
      const templatePath = path.join(
        __dirname,
        "..",
        "templates",
        "otp.html"
      );
      let template = fs.readFileSync(templatePath, "utf8");
      template = template.replace("${otp}", otp.toString());
      return template;
    } catch (error: any) {
      throw new GeneralError(error.message);
    }
  }

  static async getWelcomeEmailTemplate(type: string, username: string, password: string) {
    try {
      const templatePath = path.join(
        __dirname,
        "..",
        "templates",
        "welcomeAccountTemplate.html"
      );
      const template = fs.readFileSync(templatePath, 'utf8');
      const html = ejs.render(template, { type, username, password });
      return html;
    } catch (error: any) {
      throw new GeneralError(error.message);
    }

  }

  static async sendWelcomeEmailHandler(type: string, username: string, password: string) {
    try {
      const emailHtml = await this.getWelcomeEmailTemplate(type, username, password);

      const params = {
        Destination: {
          ToAddresses: [username],
        },
        Message: {
          Body: {
            Html: { Data: emailHtml },
          },
          Subject: { Data: `Welcome to Tea Receipts!` },
        },
        Source: "noreply@nixerly.com",
      };

      const command = new SendEmailCommand(params);
      await sesClient.send(command);

    } catch (error: any) {
      throw new AwsServiceError(error.message);
    }
  }
}

export default OtpService;
