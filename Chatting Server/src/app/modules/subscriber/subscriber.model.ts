import { model, Schema } from 'mongoose';
import { ISubscriber } from './subscriber.interface';

const subscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['active', 'delete'],
    default: 'active',
  },
});

export const Subscriber = model<ISubscriber>('Subscriber', subscriberSchema);
