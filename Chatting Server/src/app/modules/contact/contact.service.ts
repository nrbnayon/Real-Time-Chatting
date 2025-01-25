import { sendEmail } from '../../../helpers/sendMail';
import { IContact } from './contact.interface';
import { Contact } from './contact.model';

const createContactInfo = async (payload: IContact) => {
  const result = await Contact.create(payload);

  await sendEmail(
    payload.email,
    'Thank you for your message',
    ` <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Dear ${result.name},</p>
        <p><strong>Email:</strong> ${result.email}</p>
        <p>${result.message}</p>
      </div>
    `
  );
  return result;
};

export const ContactService = { createContactInfo };
