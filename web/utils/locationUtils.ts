import { Request } from "express";

interface IpApiResponse {
  countryCode?: string;
  [key: string]: any;
}

export const getMainLocationFromIpApi = async (ip: string): Promise<string> => {
  try {
    if (ip.indexOf(",") > -1) ip = ip.split(",")[0];
    const response = await fetch(`https://pro.ip-api.com/json/${ip}?key=${process.env.IPAPIKEY}`);
    const jsonData = (await response.json()) as IpApiResponse;
    return jsonData.countryCode ? jsonData.countryCode : "";
  } catch (e) {
    return "";
  }
};

export const getLocationName = async (ip: string): Promise<string> => {
  try {
    let mainLocation = await getMainLocationFromIpApi(ip);
    return mainLocation ? mainLocation : "";
  } catch (error) {
    return "";
  }
};

export const getIpFromHeaders = (req: Request): string => {
  return (
    (req.headers["x-forwarded-for"] as string) || (req.connection?.remoteAddress as string) || ""
  );
};
