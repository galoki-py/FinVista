/**
 * Finance Utility Library for FinVista (Mobile)
 * Ported from Web for consistent logic.
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

export const calculateLumpsum = (principal: number, annualRate: number, years: number) => {
  const maturityValue = principal * Math.pow(1 + annualRate / 100, years);
  return {
    maturityValue: Math.round(maturityValue),
    totalInvestment: principal,
    estimatedReturns: Math.round(maturityValue - principal)
  };
};

export const calculateStepUpSIP = (initialMonthlyP: number, stepUpPercent: number, annualRate: number, years: number) => {
  let totalInvestment = 0;
  let maturityValue = 0;
  let currentMonthlyP = initialMonthlyP;
  const monthlyRate = annualRate / 100 / 12;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      totalInvestment += currentMonthlyP;
      const remainingMonths = (years * 12) - ((year - 1) * 12 + month) + 1;
      maturityValue += currentMonthlyP * Math.pow(1 + monthlyRate, remainingMonths);
    }
    currentMonthlyP *= (1 + stepUpPercent / 100);
  }

  return {
    maturityValue: Math.round(maturityValue),
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(maturityValue - totalInvestment)
  };
};

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

export const calculatePrepaymentSavings = (principal: number, annualRate: number, years: number, extraMonthly: number) => {
  const r = annualRate / 100 / 12;
  const originalN = years * 12;
  const emi = (principal * r * Math.pow(1 + r, originalN)) / (Math.pow(1 + r, originalN) - 1);
  
  let balance = principal;
  let monthsWithPrepayment = 0;
  let totalInterestWithPrepayment = 0;

  while (balance > 0 && monthsWithPrepayment < 600) {
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

export const calculateFIRE = (monthlyExpenses: number, withdrawalRate: number = 4) => {
  const annualExpenses = monthlyExpenses * 12;
  const targetCorpus = annualExpenses / (withdrawalRate / 100);
  return {
    targetCorpus: Math.round(targetCorpus),
    annualWithdrawal: annualExpenses
  };
};

export const calculateInflation = (currentAmount: number, inflationRate: number, years: number) => {
  const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
  const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, years);
  return {
    futureValue: Math.round(futureValue),
    purchasingPower: Math.round(purchasingPower)
  };
};
