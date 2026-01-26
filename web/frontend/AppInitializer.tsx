import { useEffect, ReactNode } from "react";
import useShopInfoStore from "./stores/useShopInfoStore";
import { sendEvent } from "./helpers/eventTracker";

interface AppInitializerProps {
  children: ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  useShopInfoStore((state) => state.fetchData)();
  useShopInfoStore((state) => state.fetchPlans)();

  useEffect(() => {
    sendEvent("visit_app", null);
  }, []);

  return children;
};

export default AppInitializer;
