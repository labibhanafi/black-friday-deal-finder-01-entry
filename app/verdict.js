// Verdict tiers for every deal: a five-step honest signal, from a true low
// to a sale that is not a deal at all. The tier is stored on the deal; this
// file only maps a tier to its label, colour class and plain-English meaning.

export const VERDICTS = {
  NEW_LOW: { label: 'NEW LOW', cls: 'v-newlow', blurb: 'Lowest price ever tracked' },
  STRONG: { label: 'STRONG', cls: 'v-strong', blurb: 'A genuinely strong price' },
  GOOD: { label: 'GOOD', cls: 'v-good', blurb: 'A solid saving, not a record' },
  ROUTINE: { label: 'ROUTINE', cls: 'v-routine', blurb: 'A routine sale price' },
  NOT_A_DEAL: { label: 'NOT A DEAL', cls: 'v-notdeal', blurb: 'Usual price dressed as a sale' },
};

export function verdictInfo(tier) {
  return VERDICTS[tier] || VERDICTS.ROUTINE;
}

// Discount percent from the two prices, rounded to a whole number.
export function percentOff(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

// Dollars saved on this deal.
export function dollarsSaved(deal) {
  return deal.was - deal.price;
}

// A short score used for the "Best deal" sort: discount share plus a nudge
// for big dollar savings, so a 60%-off $20 item does not outrank a 50%-off
// $400 TV.
export function dealScore(deal) {
  return percentOff(deal) + Math.min(15, dollarsSaved(deal) / 40);
}
