export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  relatedArticles?: string[];
}

export const helpArticles: Record<string, HelpArticle> = {
  "virtual-cards": {
    id: "virtual-cards",
    slug: "virtual-cards",
    title: "Virtual Cards Guide",
    category: "Virtual Cards",
    description: "Create and manage virtual cards",
    content: `
# Virtual Cards Guide

Virtual cards are digital payment cards that exist only online, providing a secure way to make online purchases without exposing your actual account details.

## What are Virtual Cards?

Virtual cards are randomly generated card numbers linked to your VeloCards account. Each card has:
- A unique 16-digit card number
- Expiration date
- CVV/CVC security code
- Customizable spending limits

## Benefits of Virtual Cards

### 1. Enhanced Security
- Unique card numbers for different merchants
- Easy to freeze or delete if compromised
- No physical card to lose or steal

### 2. Better Control
- Set spending limits per card
- Create single-use cards for one-time purchases
- Pause cards when not in use

### 3. Instant Creation
- Generate new cards in seconds
- No waiting for physical delivery
- Start using immediately

## How to Create a Virtual Card

1. **Navigate to Cards Section**
   - Click on "Cards" in the sidebar
   - Select "Create New Card"

2. **Choose Card Details**
   - Select a BIN (Bank Identification Number)
   - Set card nickname for easy identification
   - Configure spending limits

3. **Review and Create**
   - Review the card creation fee
   - Click "Create Card"
   - Your card is ready to use!

## Best Practices

- Use different cards for different merchants
- Set appropriate spending limits
- Regularly review card transactions
- Delete unused cards to maintain security
- Use descriptive nicknames for easy management

## Card Limits by Tier

- **Unverified**: Maximum 1 active card
- **Verified**: Unlimited active cards
- **Premium**: Unlimited active cards with reduced fees
- **Elite**: Unlimited active cards with lowest fees
    `,
    relatedArticles: ["card-creation", "managing-multiple-cards", "card-security"]
  },
  
  "crypto-deposits": {
    id: "crypto-deposits",
    slug: "crypto-deposits",
    title: "Crypto Deposits Guide",
    category: "Crypto Deposits",
    description: "Fund your account with cryptocurrency",
    content: `
# Funding Your Account with Cryptocurrency

VeloCards supports deposits in multiple cryptocurrencies, allowing you to fund your account quickly and securely.

## Supported Cryptocurrencies

- **Bitcoin (BTC)** - 3 confirmations required
- **Ethereum (ETH)** - 12 confirmations required  
- **USDT (Tether)** - 12 confirmations required
- **USDC** - 12 confirmations required

## How to Make a Deposit

1. **Access Deposit Section**
   - Click on your balance in the top bar
   - Select "Add Balance"
   - Choose "Crypto Deposit"

2. **Select Cryptocurrency**
   - Choose your preferred cryptocurrency
   - Enter the amount to deposit
   - Review the network fee

3. **Send Funds**
   - Copy the deposit address or scan QR code
   - Send funds from your wallet
   - Wait for confirmations

## Processing Times

| Currency | Confirmations | Estimated Time |
|----------|--------------|----------------|
| BTC | 3 | 30-60 minutes |
| ETH | 12 | 3-5 minutes |
| USDT | 12 | 3-5 minutes |
| USDC | 12 | 3-5 minutes |

## Important Notes

### Minimum Deposits
- Each cryptocurrency has a minimum deposit amount
- Deposits below minimum will not be credited

### Network Selection
- Ensure you select the correct network
- Wrong network selection may result in loss of funds
- USDT supports both ERC-20 and TRC-20

### Deposit Fees
- Network fees vary based on blockchain congestion
- VeloCards commission depends on your tier:
  - Unverified: 5%
  - Verified: 4%
  - Premium: 2.5%
  - Elite: 1%

## Troubleshooting

### Deposit Not Showing
1. Check transaction on blockchain explorer
2. Ensure minimum confirmations are met
3. Verify correct network was used
4. Contact support if issue persists

### Wrong Address Used
- Double-check address before sending
- VeloCards cannot recover funds sent to wrong address
- Always send a small test amount first
    `,
    relatedArticles: ["processing-times", "fees-and-limits", "account-balance"]
  },

  "account-balance": {
    id: "account-balance",
    slug: "account-balance",
    title: "Understanding Account Balance",
    category: "Account Balance",
    description: "Manage your VeloCards balance",
    content: `
# Understanding Your Account Balance

Your VeloCards account has two important balance figures that you need to understand.

## Account Balance vs Available Balance

### Account Balance
This is the total amount of funds in your account, including:
- Completed deposits
- Pending deposits (after minimum confirmations)
- Funds allocated to active cards

### Available Balance  
This is the amount you can actually use to create new cards:
- Available Balance = Account Balance - Active Card Balances

## How Balances Work

1. **When You Deposit**
   - Funds added to Account Balance after confirmations
   - Also added to Available Balance

2. **When You Create a Card**
   - Card amount deducted from Available Balance
   - Remains in Account Balance (allocated to card)

3. **When You Delete a Card**
   - Remaining card balance returns to Available Balance
   - Account Balance stays the same

## Example Scenario

1. You deposit $1,000
   - Account Balance: $1,000
   - Available Balance: $1,000

2. You create a card with $300
   - Account Balance: $1,000
   - Available Balance: $700
   - Active Card Balance: $300

3. You spend $100 on the card
   - Account Balance: $900
   - Available Balance: $700
   - Active Card Balance: $200

## Managing Your Balance

### Tips for Optimization
- Keep track of funds locked in cards
- Delete unused cards to free up balance
- Monitor spending to maintain available balance
- Consider your tier benefits for lower fees

### Balance Notifications
- Low balance alerts
- Deposit confirmations
- Large transaction notifications
- Monthly balance summaries

## Frequently Asked Questions

**Q: Why is my available balance less than account balance?**
A: You have funds allocated to active virtual cards.

**Q: How do I increase my available balance?**
A: Either deposit more funds or delete/reduce limits on existing cards.

**Q: Can I withdraw my balance?**
A: Withdrawal features depend on your account tier and verification status.
    `,
    relatedArticles: ["crypto-deposits", "virtual-cards", "fees-and-limits"]
  },

  "card-creation": {
    id: "card-creation",
    slug: "card-creation",
    title: "How to Create Virtual Cards",
    category: "Card Creation",
    description: "Step-by-step guide to creating new virtual cards",
    content: `
# Creating Your First Virtual Card

Creating a virtual card with VeloCards is quick and simple. Follow this guide to get started.

## Prerequisites

Before creating a card:
- Verify you have sufficient available balance
- Complete KYC verification for unlimited cards (optional)
- Understand the card creation fee for your tier

## Step-by-Step Process

### 1. Navigate to Card Creation
- Click "Cards" in the sidebar
- Click "Create New Card" button
- Or use the "+" button on the dashboard

### 2. Select Card Program (BIN)
Choose from available BINs based on:
- **Issuing Bank**: Different banks may have different merchant acceptance
- **Card Type**: Visa or Mastercard
- **Use Case**: Some BINs work better for specific merchants

### 3. Configure Card Settings

#### Card Nickname
- Choose a descriptive name
- Examples: "Netflix Card", "Amazon Shopping", "Facebook Ads"
- Helps identify cards in your list

#### Spending Limit
- Set the maximum amount for this card
- Can be adjusted later
- Minimum: $10
- Maximum: Your available balance

#### Card Expiry (Optional)
- Default: 3 years from creation
- Can set custom expiry for temporary use

### 4. Review Fees
Card creation fees by tier:
- **Unverified**: $50 per card
- **Verified**: $30 per card
- **Premium**: $20 per card
- **Elite**: $10 per card

### 5. Create Card
- Click "Create Card"
- Card details displayed immediately
- Save details securely

## After Creation

### Immediate Actions
1. **Save Card Details**
   - Copy card number, expiry, CVV
   - Store in password manager
   - Screenshot for backup

2. **Test Card**
   - Make a small purchase
   - Verify merchant acceptance
   - Check transaction appears

### Card Management
- View in Cards dashboard
- Monitor transactions
- Adjust limits as needed
- Freeze when not in use

## Pro Tips

1. **Naming Convention**
   - Use consistent naming
   - Include merchant name
   - Add creation date

2. **Limit Setting**
   - Start with lower limits
   - Increase after testing
   - Consider subscription amounts

3. **Security**
   - Never share card photos
   - Use unique cards per merchant
   - Delete compromised cards immediately

## Common Issues

### Creation Failed
- Insufficient balance
- Tier limit reached (Unverified: 1 card max)
- Technical issue (try again)

### Card Declined
- Merchant doesn't accept virtual cards
- BIN not compatible with merchant
- Insufficient card balance
    `,
    relatedArticles: ["virtual-cards", "card-bins", "managing-multiple-cards"]
  },

  "transactions": {
    id: "transactions",
    slug: "transactions",
    title: "Understanding Transactions",
    category: "Transactions",
    description: "View and manage your transaction history",
    content: `
# Transaction Management Guide

Keep track of all your VeloCards activities with our comprehensive transaction system.

## Types of Transactions

### 1. Deposits
- Cryptocurrency deposits
- Processing status tracking
- Blockchain confirmations
- Fee breakdowns

### 2. Card Transactions
- Purchases and payments
- Authorizations and settlements
- Refunds and reversals
- Failed transactions

### 3. Fees
- Card creation fees
- Monthly maintenance fees
- Deposit commission
- Other platform fees

## Viewing Transactions

### All Transactions View
1. Navigate to "Transactions" in sidebar
2. View comprehensive list of all activities
3. Filter by type, status, or date
4. Search specific transactions

### Card-Specific Transactions
1. Go to "Cards" section
2. Click on specific card
3. View transactions for that card only
4. Export transaction history

## Transaction Statuses

### For Deposits
- **Detected**: Transaction seen on blockchain
- **Pending**: Awaiting confirmations
- **Completed**: Funds available in account
- **Failed**: Transaction failed

### For Card Transactions
- **Authorized**: Merchant authorized payment
- **Pending**: Processing payment
- **Completed**: Payment successful
- **Declined**: Payment rejected
- **Refunded**: Amount returned

## Transaction Details

Each transaction shows:
- Date and time
- Amount and currency
- Status and type
- Merchant information (for card transactions)
- Blockchain details (for crypto deposits)
- Fee breakdown
- Reference numbers

## Filtering and Searching

### Filter Options
- **By Type**: Deposits, Card, Fees
- **By Status**: Completed, Pending, Failed
- **By Date**: Custom date ranges
- **By Amount**: Minimum/maximum ranges

### Search Features
- Search by merchant name
- Transaction reference
- Amount
- Card nickname

## Exporting Transactions

### Available Formats
- CSV for spreadsheets
- PDF for records
- JSON for developers

### Export Options
- All transactions
- Filtered results only
- Specific date ranges
- Individual card transactions

## Understanding Transaction Fees

### Deposit Fees
- Network fees (blockchain)
- VeloCards commission (tier-based)

### Card Transaction Fees
- No per-transaction fees
- Monthly card maintenance only

### How Fees Display
- Shown separately in transaction list
- Included in transaction details
- Monthly fee summary available

## Troubleshooting Transactions

### Missing Transaction
1. Check filters aren't hiding it
2. Refresh transaction list
3. Check correct card selected
4. Contact support with details

### Incorrect Amount
- Check for currency conversion
- Verify merchant charged correctly
- Review fee calculations
- Dispute if necessary

### Failed Transaction
- Check failure reason
- Verify card has sufficient balance
- Try different card/BIN
- Contact merchant support
    `,
    relatedArticles: ["virtual-cards", "crypto-deposits", "fees-and-limits"]
  },

  "kyc-verification": {
    id: "kyc-verification",
    slug: "kyc-verification",
    title: "KYC Verification Process",
    category: "KYC Verification",
    description: "Complete identity verification for enhanced features",
    content: `
# KYC Verification Guide

Complete identity verification to unlock unlimited virtual cards and enhanced account features.

## Why Verify Your Account?

### Unverified Account Limitations
- Maximum 1 active card
- $500 daily spending limit
- Higher fees (5% deposit commission)
- Limited features

### Verified Account Benefits
- Unlimited virtual cards
- No spending limits
- Reduced fees (4% deposit commission)
- Access to all features
- Tier upgrade eligibility

## Required Documents

### Primary ID (Choose One)
- Passport
- National ID card
- Driver's license

### Proof of Address (Choose One)
- Utility bill (within 3 months)
- Bank statement
- Government letter
- Rental agreement

### Selfie Verification
- Clear photo of your face
- Hold your ID next to face
- Good lighting required
- No glasses or hat

## Verification Process

### Step 1: Start Verification
1. Click on profile icon
2. Select "Verify Account"
3. Or click "Upgrade" on tier display

### Step 2: Identity Document
1. Select document type
2. Take clear photo of front
3. Take clear photo of back (if applicable)
4. Ensure all text is readable

### Step 3: Address Proof
1. Select document type
2. Upload clear image
3. Ensure address matches application
4. Document must be recent (3 months)

### Step 4: Selfie Verification
1. Allow camera access
2. Position face in frame
3. Hold ID document next to face
4. Take clear photo
5. Ensure both face and ID are visible

### Step 5: Submit and Wait
1. Review all documents
2. Submit for verification
3. Receive confirmation email
4. Wait for review (usually 1-2 hours)

## Verification Tips

### Document Quality
- Use good lighting
- Avoid shadows or glare
- Ensure text is sharp
- Include all corners

### Common Mistakes
- Blurry photos
- Covered information
- Expired documents
- Mismatched information

### Quick Approval Tips
- Submit during business hours
- Use high-quality images
- Ensure information matches
- Complete in one session

## After Verification

### Immediate Benefits
- Card limit removed
- Lower fees active
- Full feature access
- Tier upgrade eligible

### Next Steps
1. Create additional cards
2. Increase deposits
3. Work towards higher tiers
4. Enjoy reduced fees

## Troubleshooting

### Verification Rejected
Common reasons:
- Poor image quality
- Expired documents
- Information mismatch
- Incomplete submission

### Resubmission
1. Check rejection reason
2. Prepare correct documents
3. Resubmit application
4. Contact support if needed

### Verification Delayed
- High volume periods
- Additional review needed
- Document clarification required
- Check email for updates

## Privacy and Security

- Documents encrypted
- Secure verification partner
- Data protection compliance
- Documents deleted after verification
- No third-party sharing
    `,
    relatedArticles: ["account-tiers", "fees-and-limits", "security"]
  },

  "account-tiers": {
    id: "account-tiers",
    slug: "account-tiers",
    title: "Understanding Account Tiers",
    category: "Tier System",
    description: "VeloCards tier system and benefits explained",
    content: `
# VeloCards Tier System

VeloCards uses a tier system to reward loyal users with better rates and features.

## Tier Overview

### Unverified (Starting Tier)
- **Requirements**: None (default tier)
- **Deposit Fee**: 5%
- **Card Creation**: $50
- **Monthly Card Fee**: N/A
- **Card Limit**: 1 active card
- **Daily Limit**: $500

### Verified (Tier 1)
- **Requirements**: Complete KYC verification
- **Deposit Fee**: 4%
- **Card Creation**: $30
- **Monthly Card Fee**: $15
- **Card Limit**: Unlimited
- **Daily Limit**: No limit

### Premium (Tier 2)
- **Requirements**: $100,000 yearly spending + Verified
- **Deposit Fee**: 2.5%
- **Card Creation**: $20
- **Monthly Card Fee**: $15
- **Card Limit**: Unlimited
- **Daily Limit**: No limit

### Elite (Tier 3)
- **Requirements**: $500,000 yearly spending + Verified
- **Deposit Fee**: 1%
- **Card Creation**: $10
- **Monthly Card Fee**: $10
- **Card Limit**: Unlimited
- **Daily Limit**: No limit

## How to Upgrade Tiers

### From Unverified to Verified
1. Click "Upgrade Tier" button
2. Complete KYC verification
3. Instant upgrade upon approval
4. Immediate fee reduction

### From Verified to Premium
1. Spend $100,000 in a calendar year
2. Automatic upgrade at threshold
3. Retroactive fee adjustments
4. Email notification sent

### From Premium to Elite  
1. Spend $500,000 in a calendar year
2. Automatic upgrade at threshold
3. Exclusive benefits activated
4. Personal account manager assigned

## Tier Benefits Comparison

| Feature | Unverified | Verified | Premium | Elite |
|---------|-----------|----------|---------|-------|
| Deposit Fee | 5% | 4% | 2.5% | 1% |
| Card Creation | $50 | $30 | $20 | $10 |
| Monthly Fee | N/A | $15 | $15 | $10 |
| Cards Allowed | 1 | Unlimited | Unlimited | Unlimited |
| Daily Limit | $500 | None | None | None |
| Support | Standard | Priority | Priority | Dedicated |

## Calculating Savings

### Example: $10,000 Monthly Deposits
- **Unverified**: $500 in fees
- **Verified**: $400 in fees ($100 saved)
- **Premium**: $250 in fees ($250 saved)
- **Elite**: $100 in fees ($400 saved)

### Card Creation Savings
- **10 cards created**:
  - Unverified: Not possible (1 card limit)
  - Verified: $300 total
  - Premium: $200 total ($100 saved)
  - Elite: $100 total ($200 saved)

## Yearly Spending Tracking

### What Counts as Spending
- Card purchases
- Card fees
- Deposit commissions
- All completed transactions

### What Doesn't Count
- Deposits themselves
- Declined transactions
- Refunded amounts
- Pending transactions

### Tracking Your Progress
1. View Dashboard statistics
2. Check "Yearly Spending" widget
3. Monitor progress bar
4. Receive milestone emails

## Maintaining Your Tier

### Annual Review
- Tiers reviewed yearly
- Based on calendar year spending
- Must maintain minimum spending
- 30-day grace period

### Tier Downgrade
- Occurs if spending requirement not met
- Notification sent before downgrade
- Opportunity to increase spending
- Fees adjust to new tier

## Pro Tips

1. **Fast Track to Premium**
   - Focus spending on VeloCards
   - Consolidate all online purchases
   - Use for business expenses

2. **Maximize Benefits**
   - Create cards strategically
   - Time large deposits for lower fees
   - Take advantage of tier benefits

3. **Plan Upgrades**
   - Track spending monthly
   - Plan large purchases
   - Consider annual fees savings
    `,
    relatedArticles: ["kyc-verification", "fees-and-limits", "maximizing-benefits"]
  },

  "security": {
    id: "security",
    slug: "security",
    title: "Security Best Practices",
    category: "Security",
    description: "Keep your VeloCards account secure",
    content: `
# Security Best Practices

Protecting your VeloCards account and virtual cards is essential for safe online transactions.

## Account Security

### Strong Password
- Minimum 12 characters
- Mix of letters, numbers, symbols
- Unique to VeloCards
- Change every 90 days
- Use password manager

### Two-Factor Authentication (2FA)
1. Enable in Security Settings
2. Use authenticator app (recommended)
3. Save backup codes securely
4. Don't share 2FA codes

### Login Security
- Check URL is correct
- Look for HTTPS padlock
- Never login via email links
- Use bookmark for access
- Monitor login notifications

## Virtual Card Security

### Card Creation
- Use unique cards per merchant
- Set appropriate limits
- Use descriptive nicknames
- Never share card photos
- Screenshot details securely

### Safe Usage
1. **Online Shopping**
   - Verify merchant legitimacy
   - Check for secure checkout
   - Use one-time cards for trials
   - Monitor transactions immediately

2. **Subscription Services**
   - Dedicated card per service
   - Set limit to subscription amount
   - Review charges monthly
   - Cancel unused subscriptions

3. **International Purchases**
   - Research merchant first
   - Use lower limit cards
   - Check currency conversion
   - Monitor for fraud

### Card Management
- Freeze unused cards
- Delete compromised cards
- Regular transaction review
- Update limits as needed
- Organize with clear names

## Recognizing Threats

### Phishing Attempts
**Red Flags:**
- Urgent account warnings
- Requests for passwords
- Suspicious sender addresses
- Poor grammar/spelling
- Unexpected attachments

**Protection:**
- Never click email links
- Verify sender identity
- Check with support
- Report phishing attempts
- Delete suspicious emails

### Fraud Prevention
1. **Monitor Account**
   - Daily balance checks
   - Transaction notifications on
   - Review all charges
   - Question unknowns

2. **Merchant Verification**
   - Research before purchase
   - Check reviews
   - Verify SSL certificate
   - Use established merchants

## If Compromised

### Immediate Actions
1. Freeze affected cards
2. Change account password
3. Review recent transactions
4. Enable 2FA if not active
5. Contact support

### Investigation Steps
1. List suspicious transactions
2. Note dates and amounts
3. Identify compromised card
4. Document everything
5. File dispute if needed

## Best Practices Summary

### Daily Habits
- Check account balance
- Review notifications
- Verify transactions
- Update security settings

### Weekly Tasks
- Review all cards
- Check spending limits
- Delete unused cards
- Update passwords

### Monthly Reviews
- Full transaction audit
- Security settings check
- Card organization
- Subscription review

## Advanced Security

### API Security
- Secure API keys
- Use IP whitelisting
- Monitor API usage
- Rotate keys regularly

### Business Accounts
- Separate personal/business
- Team member permissions
- Activity logging
- Regular audits

## Security Resources

### VeloCards Security Features
- 256-bit encryption
- PCI DSS compliance
- Fraud detection system
- Real-time monitoring
- Instant card freeze

### Reporting Security Issues
- Email: security@velocards.com
- 24/7 support hotline
- In-app reporting
- Bug bounty program
    `,
    relatedArticles: ["card-security", "two-factor-auth", "fraud-prevention"]
  },

  "card-bins": {
    id: "card-bins",
    slug: "card-bins",
    title: "Understanding Card BINs",
    category: "Card BINs",
    description: "Guide to selecting the right BIN for your needs",
    content: `
# Card BIN Selection Guide

The Bank Identification Number (BIN) determines your card's issuing bank and can affect merchant acceptance.

## What is a BIN?

A BIN is the first 6-8 digits of a card number that identifies:
- Card network (Visa/Mastercard)
- Issuing bank
- Card type
- Country of issue

## Available BINs

### Visa BINs
- **453213** - Standard Visa
  - Wide acceptance
  - E-commerce optimized
  - Good for general use

- **471629** - Premium Visa
  - Enhanced acceptance
  - Travel-friendly
  - Higher limits available

### Mastercard BINs
- **542518** - Standard Mastercard
  - Global acceptance
  - Subscription services
  - Digital goods

- **551249** - Premium Mastercard
  - Business purchases
  - International use
  - Enhanced features

## Choosing the Right BIN

### For E-commerce
**Recommended: 453213 (Visa)**
- Amazon, eBay compatible
- Digital marketplaces
- Online retailers
- Gaming platforms

### For Subscriptions
**Recommended: 542518 (Mastercard)**
- Netflix, Spotify
- Software subscriptions
- News/media sites
- Cloud services

### For Travel
**Recommended: 471629 (Visa)**
- Airlines
- Hotels
- Car rentals
- Travel agencies

### For Business
**Recommended: 551249 (Mastercard)**
- B2B purchases
- Software licenses
- Advertising platforms
- Professional services

## BIN Compatibility

### High Acceptance Merchants
- Major e-commerce
- Established brands
- Subscription services
- Digital platforms

### Limited Acceptance
- Some gaming sites
- Certain crypto exchanges
- High-risk merchants
- Adult content sites

## Testing BINs

### Before Major Purchases
1. Create card with chosen BIN
2. Make small test purchase
3. Verify acceptance
4. Proceed with larger amount

### BIN Rotation
- Try different BIN if declined
- Some merchants prefer specific BINs
- Keep successful combinations
- Document what works

## Advanced BIN Features

### Geographic Considerations
- US-issued BINs
- Better for US merchants
- May have restrictions internationally
- Check merchant requirements

### Industry Preferences
- **Tech Companies**: Often prefer Visa
- **Entertainment**: Usually accept all
- **Financial**: May have restrictions
- **Government**: Specific requirements

## BIN Management Tips

### Organization Strategy
1. **By Purpose**
   - Shopping cards
   - Subscription cards
   - Business cards
   - Travel cards

2. **By BIN Type**
   - Group similar BINs
   - Track success rates
   - Note merchant preferences

### Documentation
- Keep BIN success log
- Note declined merchants
- Track acceptance patterns
- Share findings with support

## Common Issues

### BIN Declined
**Reasons:**
- Merchant BIN restrictions
- Geographic limitations
- Risk assessment
- Category blocks

**Solutions:**
- Try alternative BIN
- Contact merchant
- Use established card
- Check with support

### BIN Changes
- New BINs added regularly
- Old BINs may be retired
- Features may update
- Check announcements

## Future Developments

### Upcoming Features
- More BIN options
- Enhanced compatibility
- Regional BINs
- Specialized categories

### Industry Trends
- Increased virtual acceptance
- Better BIN recognition
- Reduced restrictions
- Enhanced features
    `,
    relatedArticles: ["card-creation", "virtual-cards", "troubleshooting"]
  },

  "fees-and-limits": {
    id: "fees-and-limits",
    slug: "fees-and-limits",
    title: "Fees and Limits Guide",
    category: "Fees & Limits",
    description: "Understanding VeloCards fees and account limits",
    content: `
# Complete Guide to Fees and Limits

Understanding the fee structure and limits helps you maximize your VeloCards value.

## Fee Structure by Tier

### Deposit Fees (Commission)
| Tier | Deposit Fee | On $1,000 Deposit |
|------|------------|-------------------|
| Unverified | 5% | $50 |
| Verified | 4% | $40 |
| Premium | 2.5% | $25 |
| Elite | 1% | $10 |

### Card Creation Fees
| Tier | Per Card | 10 Cards |
|------|----------|----------|
| Unverified | $50 | N/A (1 card limit) |
| Verified | $30 | $300 |
| Premium | $20 | $200 |
| Elite | $10 | $100 |

### Monthly Card Maintenance
| Tier | Monthly Fee | Annual Cost |
|------|------------|-------------|
| Unverified | N/A | N/A |
| Verified | $15 | $180 |
| Premium | $15 | $180 |
| Elite | $10 | $120 |

## Account Limits

### Card Limits
| Tier | Active Cards | Daily Spending |
|------|-------------|----------------|
| Unverified | 1 | $500 |
| Verified | Unlimited | No limit |
| Premium | Unlimited | No limit |
| Elite | Unlimited | No limit |

### Transaction Limits
- **Minimum card funding**: $10
- **Maximum card funding**: Your available balance
- **Minimum deposit**: Varies by crypto
- **Maximum deposit**: No limit

## Deposit Minimums

### Cryptocurrency Minimums
- **Bitcoin (BTC)**: 0.0001 BTC
- **Ethereum (ETH)**: 0.01 ETH
- **USDT**: 10 USDT
- **USDC**: 10 USDC

### Why Minimums Exist
- Network fee coverage
- Processing efficiency
- Anti-spam protection
- Cost effectiveness

## Fee Calculation Examples

### Scenario 1: Small User
**Monthly Activity:**
- $500 deposit
- 2 cards created
- 2 cards maintained

**Unverified Costs:**
- Deposit: $25 (5%)
- Cards: $100 (limited to 1)
- Monthly: $0
- Total: $125

**Verified Costs:**
- Deposit: $20 (4%)
- Cards: $60
- Monthly: $30
- Total: $110
- Savings: $15/month

### Scenario 2: Power User
**Monthly Activity:**
- $5,000 deposit
- 5 cards created
- 10 cards maintained

**Verified Costs:**
- Deposit: $200 (4%)
- Cards: $150
- Monthly: $150
- Total: $500

**Elite Costs:**
- Deposit: $50 (1%)
- Cards: $50
- Monthly: $100
- Total: $200
- Savings: $300/month

## Hidden Costs to Avoid

### What We Don't Charge
- Transaction fees
- Currency conversion
- Card deletion
- Balance checks
- API usage
- Support tickets

### Blockchain Network Fees
- Paid to miners/validators
- Varies by network congestion
- Not controlled by VeloCards
- Check before depositing

## Optimizing Your Fees

### Deposit Strategy
1. **Batch Deposits**
   - Fewer large deposits
   - Save on percentage fees
   - Plan monthly funding

2. **Time Deposits**
   - Monitor network fees
   - Deposit during low congestion
   - Use faster networks

### Card Strategy
1. **Efficient Creation**
   - Plan card needs
   - Create multiple at once
   - Avoid unnecessary cards

2. **Smart Limits**
   - Set appropriate amounts
   - Adjust as needed
   - Delete unused cards

## Fee Comparison

### VeloCards vs Traditional
| Service | VeloCards Elite | Bank Virtual Card |
|---------|----------------|-------------------|
| Card Creation | $10 | $0-25 |
| Monthly Fee | $10 | $5-15 |
| Transaction Fee | $0 | 1-3% |
| International | $0 | 3-5% |

### Break-Even Analysis
- **Verified Tier**: Worth it at $200+/month deposits
- **Premium Tier**: Break-even at $2,000/month activity
- **Elite Tier**: Profitable at $5,000+/month usage

## Future Fee Updates

### Our Commitment
- Transparent pricing
- Advance notice of changes
- Grandfathered rates possible
- Competitive positioning

### Industry Trends
- Decreasing virtual card costs
- More tier benefits
- Loyalty rewards
- Volume discounts
    `,
    relatedArticles: ["account-tiers", "maximizing-benefits", "card-creation"]
  },

  "api-integration": {
    id: "api-integration",
    slug: "api-integration",
    title: "API Integration Guide",
    category: "API Guide",
    description: "Integrate VeloCards API into your application",
    content: `
# VeloCards API Integration

Automate card creation and management with our developer-friendly API.

## Getting Started

### API Access
1. Enable API in account settings
2. Generate API credentials
3. Note your API key and secret
4. Configure webhook URL (optional)

### Base URL
\`\`\`
https://api.velocards.com/v1
\`\`\`

### Authentication
All requests require authentication:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Core Endpoints

### Account Information
\`\`\`http
GET /account
\`\`\`
Returns account details, balance, tier information

### List Cards
\`\`\`http
GET /cards
\`\`\`
Returns all active virtual cards

### Create Card
\`\`\`http
POST /cards
{
  "bin": "453213",
  "amount": 100,
  "nickname": "API Test Card"
}
\`\`\`

### Card Transactions
\`\`\`http
GET /cards/{cardId}/transactions
\`\`\`

## Code Examples

### JavaScript/Node.js
\`\`\`javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.velocards.com/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Create a card
async function createCard(amount, nickname) {
  try {
    const response = await client.post('/cards', {
      bin: '453213',
      amount: amount,
      nickname: nickname
    });
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
  }
}
\`\`\`

### Python
\`\`\`python
import requests

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.velocards.com/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

def create_card(amount, nickname):
    payload = {
        'bin': '453213',
        'amount': amount,
        'nickname': nickname
    }
    
    response = requests.post(
        f'{BASE_URL}/cards',
        json=payload,
        headers=headers
    )
    
    return response.json()
\`\`\`

## Webhooks

### Supported Events
- card.created
- card.updated
- card.deleted
- transaction.completed
- transaction.declined
- deposit.completed

### Webhook Payload
\`\`\`json
{
  "event": "transaction.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "cardId": "card_123",
    "amount": 25.99,
    "merchant": "Amazon",
    "status": "completed"
  }
}
\`\`\`

## Rate Limits

### Default Limits
- 100 requests per minute
- 5,000 requests per hour
- 50,000 requests per day

### Rate Limit Headers
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
\`\`\`

## Error Handling

### Error Response Format
\`\`\`json
{
  "error": {
    "code": "insufficient_balance",
    "message": "Not enough available balance",
    "details": {
      "required": 100,
      "available": 50
    }
  }
}
\`\`\`

### Common Error Codes
- \\\`invalid_api_key\\\`: Check your credentials
- \\\`insufficient_balance\\\`: Add funds
- \\\`card_limit_reached\\\`: Upgrade tier
- \\\`invalid_bin\\\`: Use valid BIN
- \\\`rate_limit_exceeded\\\`: Slow down requests

## Best Practices

### Security
1. **API Key Management**
   - Never commit to code
   - Use environment variables
   - Rotate regularly
   - Restrict IP access

2. **Request Validation**
   - Validate inputs
   - Handle errors gracefully
   - Log all requests
   - Monitor usage

### Performance
1. **Optimization**
   - Batch operations
   - Cache responses
   - Use webhooks
   - Implement retries

2. **Monitoring**
   - Track API usage
   - Monitor errors
   - Set up alerts
   - Review logs

## Advanced Features

### Bulk Operations
Create multiple cards in one request:
\`\`\`http
POST /cards/bulk
{
  "cards": [
    {"bin": "453213", "amount": 50, "nickname": "Card 1"},
    {"bin": "542518", "amount": 100, "nickname": "Card 2"}
  ]
}
\`\`\`

### Filters and Pagination
\`\`\`http
GET /cards?status=active&limit=50&offset=0
GET /transactions?from=2024-01-01&to=2024-01-31
\`\`\`

## SDK and Libraries

### Official SDKs
- Node.js: \\\`npm install @velocards/sdk\\\`
- Python: \\\`pip install velocards\\\`
- PHP: \\\`composer require velocards/sdk\\\`

### Community Libraries
- Ruby gem
- Go module
- Java package
- .NET library

## Support Resources

### Documentation
- Full API reference
- Postman collection
- OpenAPI specification
- Integration examples

### Developer Support
- Developer Discord
- API status page
- Technical documentation
- Code examples repository
    `,
    relatedArticles: ["webhooks", "rate-limits", "api-security"]
  }
};

// Function to get article by slug
export const getArticleBySlug = (slug: string): HelpArticle | null => {
  return helpArticles[slug] || null;
};

// Function to get all articles
export const getAllArticles = (): HelpArticle[] => {
  return Object.values(helpArticles);
};

// Function to get articles by category
export const getArticlesByCategory = (category: string): HelpArticle[] => {
  return Object.values(helpArticles).filter(article => article.category === category);
};

// Function to search articles
export const searchArticles = (query: string): HelpArticle[] => {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(helpArticles).filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.description.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery)
  );
};