export type DataBundle = {
  status: string;
  responseCode: string;
  message: string;
  data: DataBundleData[];
};

export type DataBundleData = {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
};

export type BuyDataPaylaod = {
  data_plan: string;
  phone_number: string;
  network_provider: string;
  amount: number;
  transaction_pin: string;
  platform: string;
};

export type CableSubscription = {
  status: string;
  responseCode: string;
  message: string;
  data: CableSubscriptionData[];
};

export type CableSubscriptionData = {
  name: string;
  code: string;
  amount: string;
};

export type VerifyCableRequest = {
  smartcard_number: string;
  cable_type: string;
};

export type VerifyCableResponse = {
  status: string;
  responseCode: string;
  message: string;
  data: {
    name: string;
    type: string;
    current_bouquet: string;
  };
};

export type BuyCableRequest = {
  amount: string;
  phone_number: string;
  smartcard_number: string;
  subscription_plan: string;
  cable_type: string;
  transaction_pin: string;
  platform: string;
};

export type BuyAirtime = {
  amount: number;
  phone_number: string;
  network_provider: string;
  transaction_pin: string;
  platform: string;
};
