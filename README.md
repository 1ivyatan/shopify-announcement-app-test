# Libautech - TEMP app - [PR - Prod](https://github.com/Libautech/TEMP/compare/prod...main) [PR - Staging](https://github.com/Libautech/TEMP/compare/staging...main)

# SETUP IMPORTANT!!!
Replace project wide `TEMP` -> Apps name, no spaces, make sure to do case sensitive, keep it short this is what is used in libautech_XXX for conductor, and extensions etc
Replace project wide `TSUFFIX` -> apps short form prefix, for upsell its lbtu, sticky is lbts, keep it lower case, search with case sensitive


## ENV structure, ish

```yaml
MONGO_URI= #MongoDB URI
MONGO_DB= #Database name

SHOPIFY_API_KEY= #App client ID
SHOPIFY_API_SECRET= #App secret
APP_NAME= #epic-app-123

BOT_ID= #Telegram bot id
SUBSCRIBER_CHAT_ID= #Telegram subscriber chat id
OFFER_CHAT_ID= #Telegram offer chat id
VISITS_CHAT_ID= #Telegram visits chat id
CHAT_ID= #Telegram chat id

MAILCHIMP_API_KEY= #Mailchimp API key
MAILCHIMP_AUDIENCE_ID= #Mailchimp Audience ID

IPAPIKEY= #api key for ip location api

MANTLE_API_URL=
MANTLE_APP_ID=
MANTLE_APP_API_KEY=

FUNCTION_ID= #Extension function ID
BUNDLES_FUNCTION_ID= #Bundles extension function ID
PORT= #PORT

IS_LOCAL= #Meant for prod app when launched as dev
```
