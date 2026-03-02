export type RegisterRequest = {
  first_name: string;
  last_name: string;
  phone: string;
  dob: string;
  gender: string;
  username: string;
  password: string;
  email: string;
  bvn: string;
  device_id: string;
  pin: string;
  device_token: string;
};

export type BVNRequest = {
  bvn: string;
};

export type VerifyPhoneOTPRequest = {
  otp: string;
  phone: string;
};

export type SendPhoneOtpRequest = {
  phone: string;
  device_id: string;
};

export type ResendOtpRequest = {
  phone: string;
  device_id: string;
};
