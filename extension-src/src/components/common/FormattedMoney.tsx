import { useEffect, useState } from "react";

export default function FormattedMoney({
  amount,
  style = {},
}: {
  amount: number;
  style?: React.CSSProperties;
}) {
  const [formattedHtml, setFormattedHtml] = useState("");

  useEffect(() => {
    // Get the formatted HTML
    const html =
      window.TSUFFIXShopify.money_format &&
      window.TSUFFIXFormatMoney(amount, window.TSUFFIXShopify.moneyFormat);

    // Decode HTML entities (convert &lt; to <, etc.)
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    const decodedHtml = textarea.value;

    setFormattedHtml(decodedHtml);
  }, [amount, window.TSUFFIXShopify.money_format]);

  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{
        __html: formattedHtml,
      }}
    />
  );
}
