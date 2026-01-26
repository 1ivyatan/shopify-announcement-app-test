interface VariantOption {
  [optionName: string]: string | number;
}

interface Variant extends VariantOption {
  [key: string]: any;
}

interface SelectedOptions {
  [optionName: string]: string | number;
}

export function findVariant(variants: Variant[], selected: SelectedOptions): Variant | null {
  return (
    variants.find((v) => {
      return Object.entries(selected).every(([optName, optValue]) => {
        return v[optName] === optValue;
      });
    }) || null
  );
}

export function getOptionNames(variants: Variant[]): string[] {
  const first = variants[0];
  return Object.keys(first).filter(
    (k) => ["option1", "option2", "option3"].includes(k) && first[k] !== null
  );
}

interface OptionValuesMap {
  [optionName: string]: (string | number)[];
}

export function getOptionValuesMap(variants: Variant[]): OptionValuesMap {
  const optionNames = getOptionNames(variants);
  const map: OptionValuesMap = {};

  optionNames.forEach((opt) => {
    map[opt] = [...new Set(variants.map((v) => v[opt]).filter(Boolean))];
  });

  return map;
}
