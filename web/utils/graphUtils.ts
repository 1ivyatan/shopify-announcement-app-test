// Schemas
import SettingsSchema from "../schemas/SettingsSchema.js";
import { ISettings } from "../schemas/SettingsSchema.js";

const shopQuery = `
    query {
        shop {
            id
            email
            name
            currencyCode
            currencyFormats {
                moneyFormat
            }
            plan {
                displayName
            }
        }
    }
`;

const deepShopQuery = `
query {
  orders(first: 250, sortKey: CREATED_AT, reverse: true) {
    edges {
      node {
        id
        name
        lineItems(first: 30) {
          edges {
            node {
              title
              quantity
              variant {
                id
                price
                title
              }
              product {
                productType
                category {
                  fullName
                  name
                }
                handle
                isGiftCard
                onlineStoreUrl
              }
            }
          }
        }
        fullyPaid
        currencyCode
        confirmationNumber
        sourceName
        sourceIdentifier
        subtotalPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
          shopMoney {
            amount
            currencyCode
          }
        }
        clientIp
        customerJourneySummary {
          customerOrderIndex
          daysToConversion
          lastVisit {
            sourceType
            sourceDescription
            source
            referrerUrl
            referralInfoHtml
            referralCode
            occurredAt
            landingPage
            id
            utmParameters {
              campaign
              content
              medium
              source
              term
            }
          }
        }
        totalPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
          shopMoney {
            amount
            currencyCode
          }
        }
        createdAt
        discountApplications(first: 10) {
          nodes {
            ... on AutomaticDiscountApplication {
              __typename
              title
            }
          }
        }
        discountCodes
      }
    }
  }
  abandonedCheckoutsCount (limit: null) {
    count
    precision
  }
  ordersCount (limit: null) {
    count
    precision
  }
  productsCount (limit: null) {
    count
    precision
  }
  shop {
    id
    plan {
      displayName
      partnerDevelopment
      shopifyPlus
    }
    email
    checkoutApiSupported
    createdAt
    contactEmail
    enabledPresentmentCurrencies
    description
    currencyCode
    allProductCategoriesList {
      name
    }
    billingAddress {
      country
      countryCodeV2
    }
    myshopifyDomain
    name
    shopOwnerName
  }
  themes(first: 30) {
    edges {
      node {
        name
        themeStoreId
        id
        prefix
        processing
        role
      }
    }
  }
}
`;

interface ShopDetails {
  id: string;
  email: string;
  name: string;
  currencyCode: string;
  currencyFormats: {
    moneyFormat: string;
  };
  plan: {
    displayName: string;
  };
}

export const getShopDetails = async (client: any): Promise<ShopDetails> => {
  const shopifyResponse = await client.request(shopQuery);
  return shopifyResponse.data.shop;
};

export const getDeepShopData = async (client: any): Promise<any> => {
  const shopifyResponse = await client.request(deepShopQuery);
  return shopifyResponse.data;
};

export const checkAndPopulateShopSettings = async (
  shopSettings: any,
  client: any,
  shop: string
): Promise<Partial<ISettings>> => {
  // Convert MongoDB document to plain object if needed
  const settings: Partial<ISettings> = shopSettings
    ? shopSettings.toObject
      ? shopSettings.toObject()
      : shopSettings
    : {};

  // Check if any required fields are missing
  if (
    !settings.storeId ||
    !settings.email ||
    !settings.name ||
    !settings.currencyCode ||
    !settings.moneyFormat
  ) {
    const shopGraph = await getShopDetails(client);
    const { id: storeId, email, name, currencyCode, currencyFormats } = shopGraph;

    const updatedFields = {
      storeId,
      email,
      name,
      currencyCode,
      moneyFormat: currencyFormats.moneyFormat,
    };

    // Update database, no need to await
    SettingsSchema.updateOne({ shop }, updatedFields, { upsert: true });

    // Return complete settings object with updated fields
    return {
      ...settings,
      ...updatedFields,
    };
  }
  // If all fields exist, return the plain object
  return settings;
};
