export type LoginRequest = {
  lon: string;
  lat: string;
  username: string;
  password: string;
  device_model: string;
  device_id: string;
  device_token: string;
};

export type LoginResponse = {
  status: string;
  responseCode: string;
  message: string;
  data: {
    user: {
      userid: 2;
      userid_str: "2";
      first_name: "scarlett";
      last_name: "christian";
      phone: "11743118583";
      profilepic: "http://127.0.0.1:8000/storage/uploads/YLMKMCnmEOCrceOi4iskglisZ5dT4QuTK3xYcIUa.png";
      username: "scarlettchristian";
      bvn: string;
      nin: string;
      email: string;
      address: string;
      sex: string;
      accountno: string;
      balance: string;
      currency: string;
    };
    access_token: string;
    expired_at: string;
  };
};

export type ForgetPassordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  otp_code: string;
  password: string;
  email: string;
};


