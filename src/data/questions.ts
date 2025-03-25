export const questions = [
  {
    id: 'friend_description',
    text: 'In general, how would your best friend describe you as a risk taker?',
    type: 'choice',
    options: [
      'A real gambler',
      'Willing to take risks after completing adequate research',
      'Cautious',
      'A real risk avoider'
    ],
    scores: [9, 6, 4, 2],
    weight: 1.0
  },
  {
    id: 'game_show',
    text: 'You are on a TV game show and can choose one of the following; which would you take?',
    type: 'choice',
    options: [
      '$1,000 in cash',
      'A 50% chance at winning $5,000',
      'A 25% chance at winning $10,000',
      'A 5% chance at winning $100,000'
    ],
    scores: [2, 4, 6, 9],
    weight: 1.0
  },
  {
    id: 'vacation_job_loss',
    text: 'You have just finished saving for a "once-in-a-lifetime" vacation. Three weeks before you plan to leave, you lose your job. You would:',
    type: 'choice',
    options: [
      'Cancel the vacation',
      'Take a much more modest vacation',
      'Go as scheduled, reasoning that you need the time to prepare for a job search',
      'Extend your vacation, because this might be your last chance to go first-class'
    ],
    scores: [2, 4, 6, 9],
    weight: 1.0
  },
  {
    id: 'unexpected_money',
    text: 'If you unexpectedly received $20,000 to invest, what would you do?',
    type: 'choice',
    options: [
      'Deposit it in a bank account, money market account, or insured CD',
      'Invest it in safe high-quality bonds or bond mutual funds',
      'Invest it in stocks or stock mutual funds'
    ],
    scores: [2, 4, 6],
    weight: 1.0
  },
  {
    id: 'stock_comfort',
    text: 'In terms of experience, how comfortable are you investing in stocks or stock mutual funds?',
    type: 'choice',
    options: [
      'Not at all comfortable',
      'Somewhat comfortable', 
      'Very comfortable'
    ],
    scores: [2, 4, 6],
    weight: 1.0
  },
  {
    id: 'risk_word',
    text: 'When you think of the word "risk," which of the following words comes to mind first?',
    type: 'choice',
    options: [
      'Loss',
      'Uncertainty',
      'Opportunity',
      'Thrill'
    ],
    scores: [2, 4, 6, 9],
    weight: 1.0
  },
  {
    id: 'bond_scenario',
    text: 'Some experts are predicting prices of assets such as gold, jewels, collectibles, and real estate (hard assets) to increase in value; bond prices may fall, however, experts tend to agree that government bonds are relatively safe. Most of your investment assets are now in high-interest government bonds. What would you do?',
    type: 'choice',
    options: [
      'Hold the bonds',
      'Sell the bonds, put half the proceeds into money market accounts, and the other half into hard assets',
      'Sell the bonds and put the total proceeds into hard assets',
      'Sell the bonds, put all the money into hard assets, and borrow additional money to buy more'
    ],
    scores: [2, 4, 6, 9],
    weight: 1.0
  },
  {
    id: 'investment_choice',
    text: 'Given the best and worst case returns of the four investment choices below, which would you prefer?',
    type: 'choice',
    options: [
      '$200 gain best case; $0 gain/loss worst case',
      '$800 gain best case, $200 loss worst case',
      '$2,600 gain best case, $800 loss worst case',
      '$4,800 gain best case, $2,400 loss worst case'
    ],
    scores: [2, 4, 6, 9],
    weight: 1.0
  },
  {
    id: 'given_1000',
    text: 'In addition to whatever you own, you have been given $1,000. You are now asked to choose between:',
    type: 'choice',
    options: [
      'A sure gain of $500',
      'A 50% chance to gain $1,000 and a 50% chance to gain nothing'
    ],
    scores: [1, 3],
    weight: 1.0
  },
  {
    id: 'given_2000',
    text: 'In addition to whatever you own, you have been given $2,000. You are now asked to choose between:',
    type: 'choice',
    options: [
      'A sure loss of $500',
      'A 50% chance to lose $1,000 and a 50% chance to lose nothing'
    ],
    scores: [1, 3],
    weight: 1.0
  },
  {
    id: 'inheritance',
    text: 'Suppose a relative left you an inheritance of $100,000, stipulating in the will that you invest ALL the money in ONE of the following choices. Which one would you select?',
    type: 'choice',
    options: [
      'A savings account or money market mutual fund',
      'A mutual fund that owns stocks and bonds',
      'A portfolio of 15 common stocks',
      'Commodities like gold, silver, and oil'
    ],
    scores: [2, 4, 6, 9],
    weight: 1.0
  },
  {
    id: 'investment_20k',
    text: 'If you had to invest $20,000, which of the following investment choices would you find most appealing?',
    type: 'choice',
    options: [
      '60% in low-risk investments, 30% in medium-risk investments, 10% in high-risk investments',
      '30% in low-risk investments, 40% in medium-risk investments, 30% in high-risk investments',
      '10% in low-risk investments, 40% in medium-risk investments, 50% in high-risk investments'
    ],
    scores: [3, 6, 10],
    weight: 1.0
  },
  {
    id: 'gold_mining',
    text: 'Your trusted friend and neighbor, an experienced geologist, is putting together a group of investors to fund an exploratory gold mining venture. The venture could pay back 50 to 100 times the investment if successful. If the mine is a bust, the entire investment is worthless. Your friend estimates the chance of success is only 20%. If you had the money, how much would you invest?',
    type: 'choice',
    options: [
      'Nothing',
      'One months\' salary',
      'Three months\' salary',
      'Six months\' salary'
    ],
    scores: [2, 4, 6, 9],
    weight: 1.0
  }
] as const;