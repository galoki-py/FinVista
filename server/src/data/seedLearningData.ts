import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import LearningModule from '../models/LearningModule';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const modules = [
  // SIP - 4 Modules
  {
    category: 'sip',
    title: 'SIP Basics: Your Path to Wealth',
    content: 'A Systematic Investment Plan (SIP) is a disciplined way to invest in mutual funds. Instead of a lump sum, you invest a fixed amount regularly. This helps in averaging your investment cost and builds a habit of saving.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'What is the full form of SIP?', options: ['Simple Investment Plan', 'Systematic Investment Plan', 'Secure Income Path'], correctIndex: 1 },
      { question: 'Does SIP require a large lump sum?', options: ['Yes', 'No'], correctIndex: 1 }
    ]
  },
  {
    category: 'sip',
    title: 'Power of Compounding',
    content: 'Compounding is the process where the value of an investment increases because the earnings on an investment, both capital gains and interest, earn interest as time passes. In SIP, the longer you stay invested, the more wealth you create.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What is "interest on interest" called?', options: ['Inflation', 'Compounding', 'Liquidity'], correctIndex: 1 },
      { question: 'What factor most helps compounding?', options: ['Amount', 'Time', 'Luck'], correctIndex: 1 }
    ]
  },
  {
    category: 'sip',
    title: 'Rupee Cost Averaging',
    content: 'This is a strategy where you buy more units when the market price is low and fewer units when the price is high. Over time, this averages out the cost of your investment, reducing the risk of market volatility.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What does Rupee Cost Averaging do?', options: ['Guarantees returns', 'Averages out purchase cost', 'Doubles your money'], correctIndex: 1 }
    ]
  },
  {
    category: 'sip',
    title: 'Step-up SIP vs Regular SIP',
    content: 'A Step-up SIP allows you to increase your SIP amount periodically as your income grows. This can significantly accelerate wealth creation compared to a regular SIP where the amount remains fixed.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'Why use Step-up SIP?', options: ['To spend more', 'To match rising income', 'To pay less tax'], correctIndex: 1 }
    ]
  },

  // CRYPTO - 4 Modules
  {
    category: 'crypto',
    title: 'Blockchain: The Foundation',
    content: 'A blockchain is a decentralized, digital ledger that records transactions across many computers so that the record cannot be altered retroactively. This transparency and security are what make cryptocurrencies possible.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'Who controls the blockchain?', options: ['Banks', 'Governments', 'Network of computers'], correctIndex: 2 },
      { question: 'Is blockchain easy to hack and alter?', options: ['Yes', 'No'], correctIndex: 1 }
    ]
  },
  {
    category: 'crypto',
    title: 'Bitcoin vs Ethereum',
    content: 'Bitcoin is primarily a digital currency and store of value (Digital Gold). Ethereum is a programmable blockchain that allows developers to build decentralized applications (dApps) using Smart Contracts.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'Which crypto is often called Digital Gold?', options: ['Ethereum', 'Bitcoin', 'Dodgecoin'], correctIndex: 1 },
      { question: 'What are programmable agreements on Ethereum called?', options: ['Paper Contracts', 'Smart Contracts', 'Quick Deals'], correctIndex: 1 }
    ]
  },
  {
    category: 'crypto',
    title: 'Wallets and Security',
    content: 'Hot wallets are connected to the internet (apps), while Cold wallets are offline (USB devices). Never share your seed phrase (12-24 words) with anyone; it is the master key to your funds.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'Which wallet is more secure for long term?', options: ['Hot Wallet', 'Cold Wallet'], correctIndex: 1 },
      { question: 'Should you share your seed phrase?', options: ['Yes, with support', 'Never'], correctIndex: 1 }
    ]
  },
  {
    category: 'crypto',
    title: 'Stablecoins & Volatility',
    content: 'Most cryptos are highly volatile. Stablecoins (like USDT) are pegged to a stable asset like the US Dollar to maintain a steady price. They are used as a safe haven during market crashes.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'What is a stablecoin pegged to?', options: ['Gold/USD', 'Bitcoin price', 'Internet speed'], correctIndex: 0 }
    ]
  },

  // TRADING - 4 Modules
  {
    category: 'trading',
    title: 'Introduction to Share Markets',
    content: 'A share market is where buyers and sellers trade shares of public companies. When you buy a share, you own a tiny part of that business. Markets rise and fall based on company news and the economy.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'What is a share?', options: ['A literal piece of paper', 'Ownership in a company', 'A loan to the bank'], correctIndex: 1 }
    ]
  },
  {
    category: 'trading',
    title: 'Fundamental Analysis',
    content: 'This involves looking at a company financial health (Profit/Loss, P/E Ratio, Debt) to determine its actual value. It is best for long-term investors looking for "undervalued" stocks.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What does Fundamental Analysis focus on?', options: ['Chart patterns', 'Company health', 'Market rumors'], correctIndex: 1 }
    ]
  },
  {
    category: 'trading',
    title: 'Technical Analysis',
    content: 'This involves studying price charts and volume to predict future price movements. Concepts like Support (floor) and Resistance (ceiling) are used to find entry and exit points.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What are Support and Resistance?', options: ['Market regulators', 'Chart price levels', 'Stock brokers'], correctIndex: 1 }
    ]
  },
  {
    category: 'trading',
    title: 'Intraday vs Delivery',
    content: 'Intraday trading means buying and selling a stock on the same day. It is risky and requires constant monitoring. Delivery means holding the stock for more than a day, usually years.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'Which is riskier for beginners?', options: ['Delivery', 'Intraday'], correctIndex: 1 }
    ]
  },

  // MUTUAL FUNDS - 4 Modules
  {
    category: 'mutualfunds',
    title: 'What is a Mutual Fund?',
    content: 'A mutual fund pools money from many investors and invests it in stocks, bonds, or other securities. Professional Fund Managers make the decisions, making it easier for beginners.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'Who manages a mutual fund?', options: ['The bank teller', 'Professional Fund Manager', 'The government'], correctIndex: 1 }
    ]
  },
  {
    category: 'mutualfunds',
    title: 'Equity vs Debt Funds',
    content: 'Equity funds invest in shares and are high-risk/high-reward. Debt funds invest in government bonds and corporate deposits, offering lower but more stable returns.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'Which fund type has higher risk?', options: ['Equity', 'Debt'], correctIndex: 0 }
    ]
  },
  {
    category: 'mutualfunds',
    title: 'ELSS: Save Tax While Growing',
    content: 'Equity Linked Savings Scheme (ELSS) allows you to save tax under Section 80C in India. It has a lock-in period of 3 years, which is the shortest among all tax-saving options.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What is the lock-in period for ELSS?', options: ['5 years', '3 years', 'No lock-in'], correctIndex: 1 }
    ]
  },
  {
    category: 'mutualfunds',
    title: 'Index Funds: Beating the Average',
    content: 'Index funds simply copy a market index like Nifty 50. They have very low fees (Expense Ratio) because no manager is picking stocks. They often beat actively managed funds long-term.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'Why are Index Fund fees low?', options: ['They are government run', 'They just copy an index', 'They only invest in one stock'], correctIndex: 1 }
    ]
  },

  // ETFs - 3 Modules
  {
    category: 'etfs',
    title: 'ETFs: Stocks + Mutual Funds',
    content: 'Exchange Traded Funds (ETFs) are like mutual funds but trade on the stock exchange like regular stocks. You can buy/sell them anytime during market hours.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'Can you buy ETFs like stocks?', options: ['Yes', 'No'], correctIndex: 0 }
    ]
  },
  {
    category: 'etfs',
    title: 'Gold ETFs vs Physical Gold',
    content: 'Gold ETFs represent physical gold but are held digitally. There is no risk of theft, no "making charges", and they are highly liquid. One unit of ETF equals 1 gram of gold (usually).',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What is a benefit of Gold ETFs?', options: ['You can wear them', 'No making charges', 'Physical storage needed'], correctIndex: 1 }
    ]
  },
  {
    category: 'etfs',
    title: 'Liquidity and Expense Ratio',
    content: 'Liquidity is how easily you can sell your ETF. Expense ratio is the annual fee. Lower is better. Always check the trading volume before buying an obscure ETF.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'What is "Expense Ratio"?', options: ['Tax amount', 'Annual management fee', 'Profit share'], correctIndex: 1 }
    ]
  },

  // CHITFUNDS - 3 Modules
  {
    category: 'chitfund',
    title: 'Ancient Social Saving',
    content: 'Chit funds are traditional savings in India where a group contributes monthly. One person gets the "pot" each month. It acts as both a savings tool and a cheap loan for members.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'Who gets the money in a chit fund?', options: ['The bank', 'One member each month', 'Only the leader'], correctIndex: 1 }
    ]
  },
  {
    category: 'chitfund',
    title: 'How Auctions Work',
    content: 'The "pot" is often auctioned. Members bid the discount they are willing to take. The highest bidder gets the money, and the discount is shared among other members as an "organizer dividend".',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'Where does the "discount" go?', options: ['To the bank', 'To other members', 'Lost forever'], correctIndex: 1 }
    ]
  },
  {
    category: 'chitfund',
    title: 'Legal Protection: Chit Fund Act',
    content: 'Always check if your chit fund is registered under the Chit Fund Act, 1982. This protects you from scams. Many "private" unregistered schemes are illegal and high-risk.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'Is the Chit Fund Act important?', options: ['Yes, for safety', 'No, it is optional', 'Only for banks'], correctIndex: 0 }
    ]
  },

  // REAL ESTATE - 3 Modules
  {
    category: 'realestate',
    title: 'Real Estate Basics',
    content: 'Investing in land or buildings. It provides rental income and capital appreciation. However, it requires a huge amount of money and is hard to sell quickly (Low liquidity).',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'What is a drawback of Real Estate?', options: ['High returns', 'Low liquidity', 'Easy to buy'], correctIndex: 1 }
    ]
  },
  {
    category: 'realestate',
    title: 'REITs: The Easy Way',
    content: 'Real Estate Investment Trusts (REITs) are companies that own income-producing real estate. You can buy "shares" in a REIT for a few hundred dollars, without buying a whole building.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What are REITs?', options: ['Construction companies', 'Real Estate stocks', 'Bank loans'], correctIndex: 1 }
    ]
  },
  {
    category: 'realestate',
    title: 'Commercial vs Residential',
    content: 'Residential is for houses/apartments. Commercial is for offices/shops. Commercial often gives higher rental yields but requires more expertise and higher capital.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'Which usually has higher rental yields?', options: ['Residential', 'Commercial'], correctIndex: 1 }
    ]
  },

  // GOLD - 3 Modules
  {
    category: 'gold',
    title: 'Gold: The Inflation Hedge',
    content: 'Gold traditionally holds its value when the currency falls (inflation). It is a "safe haven" asset during wars or financial crises. It should be 5-10% of your portfolio.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'Why is gold a "safe haven"?', options: ['It is shiny', 'It holds value in crises', 'It grows 100% every year'], correctIndex: 1 }
    ]
  },
  {
    category: 'gold',
    title: 'Sovereign Gold Bonds (SGBs)',
    content: 'Issued by the Govt of India, SGBs are the BEST way to buy gold. You get 2.5% annual interest + the gold price appreciation, and no tax on maturity. No storage risk!',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'Who issues SGBs?', options: ['Jewellers', 'Government of India', 'Private banks'], correctIndex: 1 },
      { question: 'Do SGBs pay annual interest?', options: ['Yes (2.5%)', 'No'], correctIndex: 0 }
    ]
  },
  {
    category: 'gold',
    title: 'Digital Gold vs Jewelry',
    content: 'Digital gold allows you to buy gold for as low as ₹1. Jewelry is for wearing, but as an investment, it is poor due to high making charges and impurities.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'Why is jewelry a poor investment?', options: ['Making charges', 'Insecure', 'Both'], correctIndex: 2 }
    ]
  },

  // SECURITIES - 3 Modules
  {
    category: 'security',
    title: 'Bonds: Loaning to the Govt',
    content: 'When you buy a bond, you are lending money to the government or a company for a fixed period. In return, you get regular interest (coupon) and your money back at the end.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'What is a bond?', options: ['Company ownership', 'A loan from you', 'A lottery ticket'], correctIndex: 1 }
    ]
  },
  {
    category: 'security',
    title: 'Treasury Bills (T-Bills)',
    content: 'T-Bills are short-term loans (less than 1 year) to the central government. They are considered the safest possible investment as the govt is unlikely to fail.',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'What are T-Bills?', options: ['Short-term govt debt', 'Long-term corporate debt', 'Fixed deposits'], correctIndex: 0 }
    ]
  },
  {
    category: 'security',
    title: 'Credit Rating: Safety Check',
    content: 'Agencies like CRISIL or Moodys rank bonds (AAA, AA, B). AAA is the safest. Higher risk bonds (C or D) pay more interest but might never return your money.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'Which rating is safest?', options: ['AAA', 'BBB', 'C'], correctIndex: 0 }
    ]
  },

  // FDs - 3 Modules
  {
    category: 'fd',
    title: 'FD: The Indian Favorite',
    content: 'Fixed Deposits (FDs) are the simplest tool. You deposit money in a bank for a fixed time at a fixed interest rate. Your capital is guaranteed by DICGC up to ₹5 Lakhs.',
    tier: 1,
    points: 50,
    quiz: [
      { question: 'Is FD capital guaranteed?', options: ['Yes (up to 5L)', 'No'], correctIndex: 0 }
    ]
  },
  {
    category: 'fd',
    title: 'Cumulative vs Non-Cumulative',
    content: 'Cumulative FDs pay interest only at the end (Compounding). Non-Cumulative FDs pay interest monthly/quarterly, which is good for those needing regular income (like seniors).',
    tier: 2,
    points: 100,
    quiz: [
      { question: 'Which FD type uses compounding?', options: ['Cumulative', 'Non-Cumulative'], correctIndex: 0 }
    ]
  },
  {
    category: 'fd',
    title: 'FD Taxation (TDS)',
    content: 'Interest from FDs is taxable based on your income slab. If interest exceeds ₹40,000 (₹50k for seniors), the bank deducts 10% TDS automatically unless you submit Form 15G/H.',
    tier: 3,
    points: 150,
    quiz: [
      { question: 'When does TDS apply (Regular)?', options: ['Above ₹40k interest', 'Above ₹1L interest', 'Always'], correctIndex: 0 }
    ]
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finvista';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    
    console.log('Deleting existing modules...');
    await LearningModule.deleteMany({});
    
    console.log(`Inserting ${modules.length} modules...`);
    await LearningModule.insertMany(modules);
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
