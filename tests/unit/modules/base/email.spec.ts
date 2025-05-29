import  { send }  from "@/modules/base/services/email.service";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import { EmailTemplateType } from '@/modules/base/enums/email.template.type' ;

jest.mock("nodemailer");
jest.mock("@sendgrid/mail", () => ({
    setApiKey: jest.fn(),
    send: jest.fn(),
}));

describe("send function", () => {
    const mockTransporter = {
        sendMail: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NODE_ENV = "local"; // default to local for most tests
        process.env.MAILTRAP_HOST = "smtp.mailtrap.io";
        process.env.MAILTRAP_PORT = "2525";
        process.env.MAILTRAP_USER = "user";
        process.env.MAILTRAP_PASS = "pass";
        process.env.SENDGRID_API_KEY = "fake-api-key";
        process.env.FROM_EMAIL = "no-reply@example.com";
    });

    it("should send an email using nodemailer in local environment", async () => {
        (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
        mockTransporter.sendMail.mockResolvedValue({});

        const result = await send("test@example.com", EmailTemplateType.forgotPassword, { name: "John Doe", otp:123456, expiresIn: 2 });

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });
        expect(mockTransporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: "test@example.com",
                from: process.env.FROM_EMAIL,
                subject: "Reset Password",
            }),
        );
        expect(result).toBe(true);
    });

    it("should send an email using SendGrid in production environment", async () => {
        process.env.NODE_ENV = "production";

        (sgMail.send as jest.Mock).mockResolvedValue([{ statusCode: 202 }]);

        const result = await send("test@example.com", EmailTemplateType.forgotPassword, { name: "John Doe", otp:123456, expiresIn: 2  });

        expect(sgMail.setApiKey).toHaveBeenCalledWith(process.env.SENDGRID_API_KEY);
        expect(sgMail.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: "test@example.com",
                from: process.env.FROM_EMAIL,
                subject: "Reset Password",
            }),
        );
        expect(result).toBe(true);
    });

    it("should handle SendGrid errors gracefully", async () => {
        process.env.NODE_ENV = "production";

        (sgMail.send as jest.Mock).mockResolvedValue(new Error("SendGrid error"));

        const result = await send("test@example.com", EmailTemplateType.forgotPassword, { name: "John Doe",otp:123456, expiresIn: 2  });

        expect(sgMail.setApiKey).toHaveBeenCalledWith(process.env.SENDGRID_API_KEY);
        expect(sgMail.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: "test@example.com",
                from: process.env.FROM_EMAIL,
                subject: "Reset Password",
            }),
        );
        expect(result).toBe(false);
    });

    it("should throw an error for invalid template path", async () => {
        await expect(
            send("test@example.com", "invalidTemplate" as EmailTemplateType, { name: "John Doe" }),
        ).rejects.toThrowError();
    });
});
