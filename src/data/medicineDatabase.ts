export interface PopularMedicine {
  name: string;
  purpose: string;
  defaultDosage: string;
  category: string;
  mrp: number; // MRP in INR (₹)
  prices: {
    tata1mg: { price: number; discount: string; buyUrl: string; deliveryTime: string };
    apollo: { price: number; discount: string; buyUrl: string; deliveryTime: string };
    pharmeasy: { price: number; discount: string; buyUrl: string; deliveryTime: string };
    netmeds: { price: number; discount: string; buyUrl: string; deliveryTime: string };
  };
}

export const POPULAR_MEDICINES_DATA: Record<string, PopularMedicine> = {
  'dolo 650': {
    name: 'Dolo 650 Tablet',
    purpose: 'Fever & High Temperature Relief',
    defaultDosage: '1 Tablet every 6 hours after food',
    category: 'Analgesics & Antipyretics',
    mrp: 32.13,
    prices: {
      tata1mg: {
        price: 30.8,
        discount: '4% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Dolo%20650',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 31.0,
        discount: '3% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Dolo%20650',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 30.5,
        discount: '5% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Dolo%20650',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 30.8,
        discount: '4% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Dolo%20650',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'paracetamol 500mg': {
    name: 'Paracetamol 500mg',
    purpose: 'Mild Fever & Headache Relief',
    defaultDosage: '1 Tablet 2-3 times daily',
    category: 'Fever & Pain',
    mrp: 20.0,
    prices: {
      tata1mg: {
        price: 18.5,
        discount: '7% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Paracetamol%20500mg',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 19.0,
        discount: '5% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Paracetamol%20500mg',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 18.0,
        discount: '10% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Paracetamol%20500mg',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 18.5,
        discount: '7% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Paracetamol%20500mg',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'crocin 650': {
    name: 'Crocin 650 Tablet',
    purpose: 'Fever & Body Pain Relief',
    defaultDosage: '1 Tablet after meals',
    category: 'Fever & Pain',
    mrp: 33.5,
    prices: {
      tata1mg: {
        price: 31.0,
        discount: '7% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Crocin%20650',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 31.5,
        discount: '6% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Crocin%20650',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 30.8,
        discount: '8% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Crocin%20650',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 31.2,
        discount: '7% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Crocin%20650',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'pantocid 40mg': {
    name: 'Pantocid 40mg Tablet',
    purpose: 'Acid Reflux, Gastritis & Heartburn',
    defaultDosage: '1 Tablet on empty stomach in morning',
    category: 'Gastrointestinal',
    mrp: 155.0,
    prices: {
      tata1mg: {
        price: 139.5,
        discount: '10% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Pantocid%2040mg',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 142.0,
        discount: '8% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Pantocid%2040mg',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 136.0,
        discount: '12% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Pantocid%2040mg',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 138.0,
        discount: '11% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Pantocid%2040mg',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'cetirizine 10mg': {
    name: 'Cetirizine 10mg Tablet',
    purpose: 'Allergies, Cold & Running Nose',
    defaultDosage: '1 Tablet before bedtime',
    category: 'Antihistamine / Allergy',
    mrp: 22.0,
    prices: {
      tata1mg: {
        price: 19.5,
        discount: '11% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Cetirizine%2010mg',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 20.0,
        discount: '9% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Cetirizine%2010mg',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 19.0,
        discount: '13% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Cetirizine%2010mg',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 19.8,
        discount: '10% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Cetirizine%2010mg',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'combiflam': {
    name: 'Combiflam Tablet',
    purpose: 'Severe Joint & Body Pain',
    defaultDosage: '1 Tablet twice daily after food',
    category: 'Pain Relief & Anti-inflammatory',
    mrp: 45.0,
    prices: {
      tata1mg: {
        price: 39.5,
        discount: '12% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Combiflam',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 41.0,
        discount: '9% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Combiflam',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 38.0,
        discount: '15% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Combiflam',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 40.0,
        discount: '11% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Combiflam',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'azithromycin 500mg': {
    name: 'Azithromycin 500mg',
    purpose: 'Bacterial Infection & Throat Pain',
    defaultDosage: '1 Tablet daily for 3 days',
    category: 'Antibiotics',
    mrp: 120.0,
    prices: {
      tata1mg: {
        price: 108.0,
        discount: '10% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Azithromycin%20500mg',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 110.0,
        discount: '8% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Azithromycin%20500mg',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 105.0,
        discount: '12% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Azithromycin%20500mg',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 107.5,
        discount: '10% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Azithromycin%20500mg',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'ibuprofen 400mg': {
    name: 'Ibuprofen 400mg',
    purpose: 'Inflammation & Muscle Aches',
    defaultDosage: '1 Tablet as needed after meals',
    category: 'Pain Relief',
    mrp: 28.0,
    prices: {
      tata1mg: {
        price: 25.0,
        discount: '10% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Ibuprofen%20400mg',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 25.5,
        discount: '9% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Ibuprofen%20400mg',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 24.5,
        discount: '12% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Ibuprofen%20400mg',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 25.0,
        discount: '10% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Ibuprofen%20400mg',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'allegra 120mg': {
    name: 'Allegra 120mg',
    purpose: 'Allergic Rhinitis & Hives',
    defaultDosage: '1 Tablet daily in morning',
    category: 'Allergy',
    mrp: 210.0,
    prices: {
      tata1mg: {
        price: 189.0,
        discount: '10% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Allegra%20120mg',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 192.0,
        discount: '8% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Allegra%20120mg',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 184.0,
        discount: '12% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Allegra%20120mg',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 188.0,
        discount: '10% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Allegra%20120mg',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'disprin': {
    name: 'Disprin Water Soluble',
    purpose: 'Acute Headache & Pain Relief',
    defaultDosage: '1 Tablet dissolved in water',
    category: 'Analgesics',
    mrp: 14.0,
    prices: {
      tata1mg: {
        price: 12.8,
        discount: '8% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Disprin',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 13.0,
        discount: '7% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Disprin',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 12.5,
        discount: '10% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Disprin',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 13.0,
        discount: '7% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Disprin',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'zincovit': {
    name: 'Zincovit Multivitamin',
    purpose: 'Daily Immunity & Nutrition',
    defaultDosage: '1 Tablet daily after breakfast',
    category: 'Vitamins & Supplements',
    mrp: 110.0,
    prices: {
      tata1mg: {
        price: 93.5,
        discount: '15% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Zincovit',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 98.0,
        discount: '11% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Zincovit',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 92.0,
        discount: '16% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Zincovit',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 95.0,
        discount: '13% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Zincovit',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'limcee vitamin c': {
    name: 'Limcee 500mg Vitamin C',
    purpose: 'Immunity & Vitamin C Supplement',
    defaultDosage: '1 Chewable Tablet daily',
    category: 'Vitamins',
    mrp: 25.0,
    prices: {
      tata1mg: {
        price: 22.0,
        discount: '12% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Limcee',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 23.0,
        discount: '8% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Limcee',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 21.5,
        discount: '14% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Limcee',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 22.5,
        discount: '10% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Limcee',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'electral ors': {
    name: 'Electral ORS Sachet',
    purpose: 'Dehydration & Electrolyte Recovery',
    defaultDosage: 'Dissolve 1 sachet in 1 liter of water',
    category: 'Rehydration',
    mrp: 22.5,
    prices: {
      tata1mg: {
        price: 20.0,
        discount: '11% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Electral%20ORS',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 21.0,
        discount: '6% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Electral%20ORS',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 19.8,
        discount: '12% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Electral%20ORS',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 20.5,
        discount: '9% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Electral%20ORS',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  },
  'gelusil antacid': {
    name: 'Gelusil Antacid Syrup / Tablet',
    purpose: 'Acidity, Heartburn & Gas Relief',
    defaultDosage: '2 teaspoons or 1 tablet after meals',
    category: 'Gastrointestinal',
    mrp: 110.0,
    prices: {
      tata1mg: {
        price: 99.0,
        discount: '10% OFF',
        buyUrl: 'https://www.1mg.com/search/all?name=Gelusil',
        deliveryTime: 'Same Day Delivery (2 hrs)'
      },
      apollo: {
        price: 102.0,
        discount: '7% OFF',
        buyUrl: 'https://www.apollopharmacy.in/search-medicines/Gelusil',
        deliveryTime: 'Express 45 Mins'
      },
      pharmeasy: {
        price: 96.0,
        discount: '12% OFF',
        buyUrl: 'https://pharmeasy.in/search/all?name=Gelusil',
        deliveryTime: 'Delivered Tomorrow'
      },
      netmeds: {
        price: 98.0,
        discount: '10% OFF',
        buyUrl: 'https://www.netmeds.com/catalogsearch/result?q=Gelusil',
        deliveryTime: 'Delivery in 1-2 Days'
      }
    }
  }
};

export const findPopularMedicineInfo = (query: string): PopularMedicine | null => {
  if (!query) return null;
  const key = query.toLowerCase().trim();
  if (POPULAR_MEDICINES_DATA[key]) return POPULAR_MEDICINES_DATA[key];

  // Partial match search
  for (const [k, v] of Object.entries(POPULAR_MEDICINES_DATA)) {
    if (k.includes(key) || key.includes(k)) {
      return v;
    }
  }
  return null;
};
