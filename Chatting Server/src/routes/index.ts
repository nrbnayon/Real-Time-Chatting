import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';

import { UserRoutes } from '../app/modules/user/user.route';
import { PetProfileRoutes } from '../app/modules/petProfile/petProfile.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { BlogRoutes } from '../app/modules/blog/blog.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { PaymentRoutes } from '../app/modules/payment/payment.route';
import { ContactRoutes } from '../app/modules/contact/contact.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { WishlistRoutes } from '../app/modules/wishList/wishList.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route';
import { SubscriberRoutes } from '../app/modules/subscriber/subscriber.route';
import { ColourRoutes } from '../app/modules/colours/colours.route';
import { SizeRoutes } from '../app/modules/size/size.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/petProfile', route: PetProfileRoutes },
  { path: '/faq', route: FaqRoutes },
  { path: '/blog', route: BlogRoutes },
  { path: '/category', route: CategoryRoutes },
  { path: '/product', route: ProductRoutes },
  { path: '/payment', route: PaymentRoutes },
  { path: '/contact', route: ContactRoutes },
  { path: '/review', route: ReviewRoutes },
  { path: '/setting', route: SettingRoutes },
  { path: '/wishList', route: WishlistRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/dashboard', route: DashboardRoutes },
  { path: '/subscriber', route: SubscriberRoutes },
  { path: '/colour', route: ColourRoutes },
  { path: '/size', route: SizeRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
