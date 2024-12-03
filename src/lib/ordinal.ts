const pr = new Intl.PluralRules("en-CA", { type: "ordinal" });

export function ordinal(val: number) {
  const suffix = { zero: "th", one: "st", two: "nd", few: "rd", other: "th", many: "th" }[
    pr.select(val)
  ];
  return `${val}${suffix}`;
}
