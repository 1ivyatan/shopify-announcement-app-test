export function initPreviewUtils(moneyFormat: string) {
  window.TSUFFIXShopify = {};
  window.TSUFFIXShopify.money_format = moneyFormat || "";
  window.TSUFFIXFormatMoney = function (cents: any, format: any) {
    if (!moneyFormat) {
      return "";
    }
    if (typeof cents == "string") {
      cents = cents.replace(".", "");
    }
    let value = "";
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || window.TSUFFIXShopify.money_format;

    function defaultOption(opt: any, def: any) {
      return typeof opt == "undefined" ? def : opt;
    }

    function formatWithDelimiters(number: any, precision: any, thousands: any, decimal: any) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ",");
      decimal = defaultOption(decimal, ".");

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split("."),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
        cents = parts[1] ? decimal + parts[1] : "";

      return dollars + cents;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2, ",", ".");
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0, ",", ".");
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };
}
