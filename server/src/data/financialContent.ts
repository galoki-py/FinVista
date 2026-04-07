import { LearningModule } from '@finvista/types';

export const financialContent: LearningModule[] = [
  {
    id: 'fd-01',
    category: 'fd',
    title: 'Fixed Deposits (FDs): The Safety Net',
    content: 'Fixed Deposits are investment instruments offered by banks where you deposit a sum of money for a fixed tenure at a fixed interest rate. It is considered one of the safest investment options in India. Pros: Guaranteed returns, capital protection. Cons: Low liquidity, post-tax returns might not beat inflation.',
    tier: 1,
    points: 50,
    quiz: []
  },
  {
    id: 'sip-01',
    category: 'sip',
    title: 'Systematic Investment Plans (SIPs)',
    content: 'SIP is a method of investing in mutual funds where you contribute a fixed amount regularly (monthly/quarterly). It uses "Rupee Cost Averaging", meaning you buy more units when prices are low and fewer when high. Over long periods, this creates significant wealth through compounding.',
    tier: 1,
    points: 50,
    quiz: []
  },
  {
    id: 'market-01',
    category: 'market',
    title: 'Share Markets: Owning a Piece of Business',
    content: 'Investing in the share market means buying equity in companies. While potentially high-reward, it comes with volatility. Diversifying across sectors and focusing on long-term growth (blue-chip stocks) is key for beginners.',
    tier: 2,
    points: 50,
    quiz: []
  },
  {
    id: 'security-01',
    category: 'security',
    title: 'Securities: Bonds & T-Bills',
    content: 'Securities are tradable financial assets. Bonds are essentially loans you provide to governments or corporations in exchange for periodic interest (coupons). Treasury Bills (T-Bills) are short-term government debt instruments, considered virtually risk-free.',
    tier: 2,
    points: 50,
    quiz: []
  },
  {
    id: 'chitfund-01',
    category: 'chitfund',
    title: 'Chit Funds: Community Saving',
    content: 'Chit funds are a unique Indian financial instrument where a group of people contribute a fixed amount each month. One member gets the "pot" each month through an auction or draw. While great for local liquidity, ensure the fund is registered under the Chit Funds Act, 1982 to avoid scams.',
    tier: 3,
    points: 50,
    quiz: []
  },
  {
    id: 'realestate-01',
    category: 'realestate',
    title: 'Real Estate: The Tangible Asset',
    content: 'Investing in property (land, residential, commercial). It offers potential for rental income and capital appreciation. For working professionals and part-time students, "REITs" (Real Estate Investment Trusts) allow you to invest in large-scale real estate with small amounts of money.',
    tier: 4,
    points: 50,
    quiz: []
  },
  {
    id: 'gold-01',
    category: 'gold',
    title: 'Gold: The Eternal Hedge',
    content: 'Gold is traditionally used as a hedge against inflation. You can invest in physical gold (jewelry/coins) or digital gold (Sovereign Gold Bonds - SGBs). SGBs are highly recommended as they pay 2.5% annual interest and are tax-free on maturity.',
    tier: 3,
    points: 50,
    quiz: []
  }
];
