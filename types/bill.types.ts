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

export type ElectricityDisco = {
  status: string;
  responseCode: string;
  message: string;
  data: ElectricityDiscoData[];
};

export type ElectricityDiscoData = {
  name: string;
  value: string;
};

export type VerifyMeterNumberRequest = {
  meter_number: "45067208137";
  disco: "ikeja-electric";
  meter_type: "prepaid";
};

export type VerifyMeterNumberResponse = {
  status: "success";
  responseCode: "000";
  message: "Meter Verify fetched successfully";
  data: {
    name: "AMUDALAT ADELEYE";
    address: "39A, AINA STREET, OJODU";
    type: "prepaid";
    arrears: "0";
    Meter_Number: "45067208137";
  };
};
