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
