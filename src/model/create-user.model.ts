type CreateUserModel = {
  uid: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  phone_number: string | null;
  email_verified: boolean;
  provider: string | null;
  created_at: Date;
  updated_at: Date;
};

export default CreateUserModel;
