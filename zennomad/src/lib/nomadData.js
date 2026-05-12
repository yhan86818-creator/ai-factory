export const nomadVisas = [
  {
    id: 'portugal',
    name: 'Portugal D8',
    type: 'Digital Nomad Visa',
    minIncome: 3280, // EUR per month
    duration: '1-2 years (renewable)',
    taxBenefit: 'NHR potential (0% on foreign income)',
    difficulty: 'Medium',
    continent: 'Europe',
    monthlyLivingCost: 2000
  },
  {
    id: 'spain',
    name: 'Spain DNV',
    type: 'Digital Nomad Visa',
    minIncome: 2520, // EUR per month
    duration: '1 year (renewable)',
    taxBenefit: 'Beckham Law (24% flat tax)',
    difficulty: 'Medium',
    continent: 'Europe',
    monthlyLivingCost: 2500
  },
  {
    id: 'uae',
    name: 'UAE Remote Work',
    type: 'Remote Work Visa',
    minIncome: 3500, // USD per month
    duration: '1 year',
    taxBenefit: '0% Personal Income Tax',
    difficulty: 'Easy',
    continent: 'Middle East',
    monthlyLivingCost: 3500
  },
  {
    id: 'malaysia',
    name: 'Malaysia DE Rantau',
    type: 'Digital Nomad Pass',
    minIncome: 2000, // USD per month
    duration: '3-12 months (renewable)',
    taxBenefit: '0-15% Tax on foreign income',
    difficulty: 'Easy',
    continent: 'Asia',
    monthlyLivingCost: 1200
  },
  {
    id: 'thailand',
    name: 'Thailand LTR',
    type: 'Long-Term Resident',
    minIncome: 6600, // USD per month
    duration: '10 years',
    taxBenefit: '17% Flat Tax for professionals',
    difficulty: 'Hard',
    continent: 'Asia',
    monthlyLivingCost: 1500
  },
  {
    id: 'costarica',
    name: 'Costa Rica Rentista',
    type: 'Nomad Visa',
    minIncome: 3000, // USD per month
    duration: '2 years',
    taxBenefit: '0% Tax on foreign income',
    difficulty: 'Easy',
    continent: 'Americas',
    monthlyLivingCost: 2200
  },
  {
    id: 'mexico',
    name: 'Mexico Residente Temporal',
    type: 'Temporary Resident',
    minIncome: 2600, // USD per month
    duration: '1-4 years',
    taxBenefit: 'Tax-free if income is foreign',
    difficulty: 'Easy',
    continent: 'Americas',
    monthlyLivingCost: 1800
  },
  {
    id: 'croatia',
    name: 'Croatia DNV',
    type: 'Digital Nomad Stay',
    minIncome: 2500, // EUR per month
    duration: '1 year',
    taxBenefit: '0% Income Tax',
    difficulty: 'Medium',
    continent: 'Europe',
    monthlyLivingCost: 1600
  },
  {
    id: 'japan',
    name: 'Japan DNV',
    type: 'Digital Nomad Visa',
    minIncome: 830000, // JPY per month (~$5500)
    duration: '6 months',
    taxBenefit: 'No local tax if <183 days',
    difficulty: 'Hard',
    continent: 'Asia',
    monthlyLivingCost: 2800
  },
  {
    id: 'georgia',
    name: 'Georgia Individual Entrepreneur',
    type: 'Business License',
    minIncome: 0, 
    duration: 'Indefinite',
    taxBenefit: '1% Tax for Small Business',
    difficulty: 'Easy',
    continent: 'Europe/Asia',
    monthlyLivingCost: 1100
  }
];

export const calculateTaxSavings = (income, currentTaxRate, targetCountryId) => {
  const target = nomadVisas.find(v => v.id === targetCountryId);
  if (!target) return 0;

  let targetRate = 0;
  
  // Logical mapping based on visa/country specific rules
  switch(target.id) {
    case 'uae': 
    case 'costarica':
    case 'mexico':
    case 'croatia':
    case 'japan':
      targetRate = 0; 
      break;
    case 'georgia': 
      targetRate = 0.01; 
      break;
    case 'spain': 
      targetRate = 0.24; 
      break;
    case 'portugal': 
      targetRate = 0.10; // Conservative NHR assumption
      break;
    case 'thailand':
      targetRate = 0.17;
      break;
    case 'malaysia':
      targetRate = 0.05; // Average assumption
      break;
    default:
      targetRate = 0.20;
  }

  const currentTax = income * (currentTaxRate / 100);
  const targetTax = income * targetRate;
  
  return Math.max(0, currentTax - targetTax);
};
