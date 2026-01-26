import { t } from "i18next";
import { Loader2 } from "lucide-react";
import { FC } from "react";

export const Loader: FC = () => {
  return (
    <div className="flex flex-col justify-center text-center">
      <span className="flex items-center justify-center  text-black mb-2 mt-5">
        <Loader2 color="#000000" className="animate-spin " />
      </span>
      <p>{t("loadingData")}</p>
    </div>
  );
};
