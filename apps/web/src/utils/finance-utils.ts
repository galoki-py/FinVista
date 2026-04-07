/**
 * Finance Utility Library for FinVista
 * Contains standard formulas for investment, debt, and planning.
 */

// --- Investment Calculators ---

/**
 * Calculates maturity amount for a Systematic Investment Plan (SIP).
 * M = P * ((1 + i)^n - 1) / i * (1 + i)
 * @param monthlyP - Monthly investment amount
 * @param annualRate - Expected annual return rate (percentage)
 * @param years - Investment duration in years
 */
export const calculateSIP = (monthlyP: number, annualRate: number, years: number) => {
  const i = annualRate / 100 / 12;
  const n = years * 12;
  const maturityValue = monthlyP * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const totalInvestment = monthlyP * n;
  return {
    maturityValue: Math.round(maturityValue),
    totalInvestment,
    estimatedReturns: Math.round(maturityValue - totalInvestment)
  };
};

/**
 * Calculates returns for a one-time Lumpsum investment.
 * A = P * (1 + r/n)^(nt)
 * @param principal - One-time investment amount
 * @param annualRate - Expected annual return rate (percentage)
 * @param years - Investment duration in years
 */
export const calculateLumpsum = (principal: number, annualRate: number, years: number) => {
  const maturityValue = principal * Math.pow(1 + annualRate / 100, years);
  return {
    maturityValue: Math.round(maturityValue),
    totalInvestment: principal,
    estimatedReturns: Math.round(maturityValue - principal)
  };
};

/**
 * Calculates maturity amount for a Step-up SIP.
 * @param initialMonthlyP - Starting monthly investment
 * @param stepUpPercent - Annual increase percentage (e.g., 10 for 10%)
 * @param annualRate - Expected annual return rate (percentage)
 * @param years - Investment duration in years
 */
export const calculateStepUpSIP = (initialMonthlyP: number, stepUpPercent: number, annualRate: number, years: number) => {
  let totalInvestment = 0;
  let maturityValue = 0;
  let currentMonthlyP = initialMonthlyP;
  const monthlyRate = annualRate / 100 / 12;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      totalInvestment += currentMonthlyP;
      // Each month's contribution grows for the remaining duration
      const remainingMonths = (years * 12) - ((year - 1) * 12 + month) + 1;
      maturityValue += currentMonthlyP * Math.pow(1 + monthlyRate, remainingMonths);
    }
    // Increase monthly amount for the next year
    currentMonthlyP *= (1 + stepUpPercent / 100);
  }

  return {
    maturityValue: Math.round(maturityValue),
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(maturityValue - totalInvestment)
  };
};

// --- Loan/Debt Calculators ---

/**
 * Calculates Equated Monthly Installment (EMI).
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate (percentage)
 * @param years - Loan tenure in years
 */
export const calculateEMI = (principal: number, annualRate: number, years: number) => {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalPayment - principal),
    totalPayment: Math.round(totalPayment)
  };
};

/**
 * Calculates interest savings with extra monthly prepayments.
 * @param principal - Current principal
 * @param annualRate - Annual interest rate
 * @param years - Remaining tenure
 * @param extraMonthly - Extra amount paid monthly
 */
export const calculatePrepaymentSavings = (principal: number, annualRate: number, years: number, extraMonthly: number) => {
  const r = annualRate / 100 / 12;
  const originalN = years * 12;
  const emi = (principal * r * Math.pow(1 + r, originalN)) / (Math.pow(1 + r, originalN) - 1);
  
  let balance = principal;
  let monthsWithPrepayment = 0;
  let totalInterestWithPrepayment = 0;

  while (balance > 0 && monthsWithPrepayment < 600) { // Safety cap 50 years
    const interest = balance * r;
    const principalPaid = (emi + extraMonthly) - interest;
    totalInterestWithPrepayment += interest;
    balance -= principalPaid;
    monthsWithPrepayment++;
  }

  const originalTotalInterest = (emi * originalN) - principal;
  return {
    originalTenureMonths: originalN,
    newTenureMonths: monthsWithPrepayment,
    monthsSaved: originalN - monthsWithPrepayment,
    interestSaved: Math.round(originalTotalInterest - totalInterestWithPrepayment)
  };
};

// --- Planning Tools ---

/**
 * Calculates the corpus needed for Financial Independence (FIRE).
 * Uses the 4% rule (Corpus = Annual Expenses * 25) adjusted for safety.
 * @param monthlyExpenses - Current monthly expenses
 * @param withdrawalRate - Safe withdrawal rate (e.g., 4%)
 */
export const calculateFIRE = (monthlyExpenses: number, withdrawalRate: number = 4) => {
  const annualExpenses = monthlyExpenses * 12;
  const targetCorpus = annualExpenses / (withdrawalRate / 100);
  return {
    targetCorpus: Math.round(targetCorpus),
    annualWithdrawal: annualExpenses
  };
};

/**
 * Calculates future value of money based on inflation.
 * @param currentAmount - Today's amount
 * @param inflationRate - Annual inflation rate
 * @param years - Time period
 */
export const calculateInflation = (currentAmount: number, inflationRate: number, years: number) => {
  const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
  const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, years);
  return {
    futureValue: Math.round(futureValue),
    purchasingPower: Math.round(purchasingPower) // What today's amount will be worth then
  };
};

/**
 * Calculates weighted average price of stock buys.
 */
export const calculateStockAverage = (buys: Array<{ price: number; quantity: number }>) => {
  let totalCost = 0;
  let totalQuantity = 0;
  buys.forEach(buy => {
    totalCost += buy.price * buy.quantity;
    totalQuantity += buy.quantity;
  });
  return {
    averagePrice: totalQuantity > 0 ? (totalCost / totalQuantity).toFixed(2) : 0,
    totalCost,
    totalQuantity
  };
};
