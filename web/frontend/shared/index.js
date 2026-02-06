import React, { useState, useEffect } from "react";
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = React, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const useMainStore = create((set, get) => {
  return {
    temp: "temp data",
    setTemp: (data) => set({ temp: data })
  };
});
function initPreviewUtils(moneyFormat) {
  window.TSUFFIXShopify = {};
  window.TSUFFIXShopify.money_format = moneyFormat;
  window.TSUFFIXFormatMoney = function(cents, format) {
    if (typeof cents == "string") {
      cents = cents.replace(".", "");
    }
    let value = "";
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || window.TSUFFIXShopify.money_format;
    function defaultOption(opt, def) {
      return typeof opt == "undefined" ? def : opt;
    }
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ",");
      decimal = defaultOption(decimal, ".");
      if (isNaN(number) || number == null) {
        return 0;
      }
      number = (number / 100).toFixed(precision);
      const parts = number.split("."), dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands), cents2 = parts[1] ? decimal + parts[1] : "";
      return dollars + cents2;
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
const App = ({ contextData }) => {
  if (window.TSUFFIXIsPreview) {
    initPreviewUtils("{amount_with_comma_separator}");
  }
  window.TSUFFIXIsPreview = false;
  const { temp } = useMainStore();
  const [shouldShow, setShouldShow] = useState(false);
  useEffect(() => {
    setShouldShow(true);
  }, []);
  if (!shouldShow) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "TSUFFIX-tw-scope", children: contextData.data.map((banner) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          width: "100%",
          padding: "0.5em 1em",
          lineHeight: "1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${banner.fontSize || 12}pt`,
          backgroundColor: `${banner.bgColor || "#000"}`,
          color: `${banner.fgColor || "#FFF"}`
        },
        children: banner.text
      }
    );
  }) });
};
export {
  App as ExtensionPreview
};
