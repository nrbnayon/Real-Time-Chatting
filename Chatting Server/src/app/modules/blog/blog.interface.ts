export type IBlogs = {
  title: string;
  des: string;
  image: string;
  status: 'active' | 'delete';
  updatedAt?: Date;
  createdAt?: Date;
};
