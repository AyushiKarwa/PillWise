import { Request, Response } from 'express';

const MEDICINES_DATABASE: Record<string, any> = {
  'saridon': {
    mrp: 51.55,
    tata1mg: { price: 46.8, discount: '9% OFF' },
    apollo: { price: 48.0, discount: '7% OFF' },
    pharmeasy: { price: 46.5, discount: '10% OFF' },
    netmeds: { price: 47.0, discount: '9% OFF' }
  },
  'saridon advance': {
    mrp: 59.0,
    tata1mg: { price: 54.2, discount: '8% OFF' },
    apollo: { price: 55.0, discount: '7% OFF' },
    pharmeasy: { price: 53.8, discount: '9% OFF' },
    netmeds: { price: 54.5, discount: '8% OFF' }
  },
  'boroline': {
    mrp: 42.0,
    tata1mg: { price: 38.0, discount: '10% OFF' },
    apollo: { price: 39.0, discount: '7% OFF' },
    pharmeasy: { price: 37.5, discount: '11% OFF' },
    netmeds: { price: 38.0, discount: '10% OFF' }
  },
  'boroline antiseptic cream': {
    mrp: 42.0,
    tata1mg: { price: 38.0, discount: '10% OFF' },
    apollo: { price: 39.0, discount: '7% OFF' },
    pharmeasy: { price: 37.5, discount: '11% OFF' },
    netmeds: { price: 38.0, discount: '10% OFF' }
  },
  'volini': {
    mrp: 75.0,
    tata1mg: { price: 67.5, discount: '10% OFF' },
    apollo: { price: 69.0, discount: '8% OFF' },
    pharmeasy: { price: 66.0, discount: '12% OFF' },
    netmeds: { price: 67.0, discount: '11% OFF' }
  },
  'volini gel': {
    mrp: 75.0,
    tata1mg: { price: 67.5, discount: '10% OFF' },
    apollo: { price: 69.0, discount: '8% OFF' },
    pharmeasy: { price: 66.0, discount: '12% OFF' },
    netmeds: { price: 67.0, discount: '11% OFF' }
  },
  'moov': {
    mrp: 115.0,
    tata1mg: { price: 102.0, discount: '11% OFF' },
    apollo: { price: 105.0, discount: '9% OFF' },
    pharmeasy: { price: 100.0, discount: '13% OFF' },
    netmeds: { price: 102.0, discount: '11% OFF' }
  },
  'betadine': {
    mrp: 132.0,
    tata1mg: { price: 118.8, discount: '10% OFF' },
    apollo: { price: 120.0, discount: '9% OFF' },
    pharmeasy: { price: 116.0, discount: '12% OFF' },
    netmeds: { price: 117.5, discount: '11% OFF' }
  },
  'dolo 650': {
    mrp: 32.13,
    tata1mg: { price: 30.8, discount: '4% OFF' },
    apollo: { price: 30.8, discount: '4% OFF' },
    pharmeasy: { price: 30.5, discount: '5% OFF' },
    netmeds: { price: 30.8, discount: '4% OFF' }
  },
  'paracetamol 500mg': {
    mrp: 20.0,
    tata1mg: { price: 18.5, discount: '7% OFF' },
    apollo: { price: 19.0, discount: '5% OFF' },
    pharmeasy: { price: 18.0, discount: '10% OFF' },
    netmeds: { price: 18.5, discount: '7% OFF' }
  },
  'crocin 650': {
    mrp: 33.5,
    tata1mg: { price: 31.0, discount: '7% OFF' },
    apollo: { price: 31.5, discount: '6% OFF' },
    pharmeasy: { price: 30.8, discount: '8% OFF' },
    netmeds: { price: 31.2, discount: '7% OFF' }
  },
  'crocin advance': {
    mrp: 24.5,
    tata1mg: { price: 22.5, discount: '8% OFF' },
    apollo: { price: 23.0, discount: '6% OFF' },
    pharmeasy: { price: 22.0, discount: '10% OFF' },
    netmeds: { price: 22.5, discount: '8% OFF' }
  },
  'combiflam': {
    mrp: 47.88,
    tata1mg: { price: 41.5, discount: '13% OFF' },
    apollo: { price: 43.0, discount: '10% OFF' },
    pharmeasy: { price: 41.0, discount: '14% OFF' },
    netmeds: { price: 42.0, discount: '12% OFF' }
  },
  'pantocid 40mg': {
    mrp: 155.0,
    tata1mg: { price: 139.5, discount: '10% OFF' },
    apollo: { price: 142.0, discount: '8% OFF' },
    pharmeasy: { price: 136.0, discount: '12% OFF' },
    netmeds: { price: 138.0, discount: '11% OFF' }
  },
  'pan d': {
    mrp: 199.0,
    tata1mg: { price: 179.0, discount: '10% OFF' },
    apollo: { price: 182.0, discount: '9% OFF' },
    pharmeasy: { price: 175.0, discount: '12% OFF' },
    netmeds: { price: 178.0, discount: '11% OFF' }
  },
  'cetirizine 10mg': {
    mrp: 22.0,
    tata1mg: { price: 19.5, discount: '11% OFF' },
    apollo: { price: 20.0, discount: '9% OFF' },
    pharmeasy: { price: 19.0, discount: '13% OFF' },
    netmeds: { price: 19.8, discount: '10% OFF' }
  },
  'allegra 120mg': {
    mrp: 212.0,
    tata1mg: { price: 190.8, discount: '10% OFF' },
    apollo: { price: 195.0, discount: '8% OFF' },
    pharmeasy: { price: 188.0, discount: '11% OFF' },
    netmeds: { price: 190.0, discount: '10% OFF' }
  },
  'gelusil': {
    mrp: 110.0,
    tata1mg: { price: 98.0, discount: '11% OFF' },
    apollo: { price: 101.0, discount: '8% OFF' },
    pharmeasy: { price: 96.0, discount: '13% OFF' },
    netmeds: { price: 97.5, discount: '11% OFF' }
  },
  'digene': {
    mrp: 125.0,
    tata1mg: { price: 112.5, discount: '10% OFF' },
    apollo: { price: 115.0, discount: '8% OFF' },
    pharmeasy: { price: 110.0, discount: '12% OFF' },
    netmeds: { price: 112.0, discount: '10% OFF' }
  },
  'disprin': {
    mrp: 11.2,
    tata1mg: { price: 10.5, discount: '6% OFF' },
    apollo: { price: 10.8, discount: '4% OFF' },
    pharmeasy: { price: 10.2, discount: '9% OFF' },
    netmeds: { price: 10.5, discount: '6% OFF' }
  },
  'otrivin': {
    mrp: 112.0,
    tata1mg: { price: 102.0, discount: '9% OFF' },
    apollo: { price: 105.0, discount: '6% OFF' },
    pharmeasy: { price: 100.0, discount: '11% OFF' },
    netmeds: { price: 102.0, discount: '9% OFF' }
  },
  'augmentin 625': {
    mrp: 223.0,
    tata1mg: { price: 198.0, discount: '11% OFF' },
    apollo: { price: 202.0, discount: '9% OFF' },
    pharmeasy: { price: 195.0, discount: '12% OFF' },
    netmeds: { price: 198.0, discount: '11% OFF' }
  },
  'azithral 500': {
    mrp: 132.0,
    tata1mg: { price: 118.8, discount: '10% OFF' },
    apollo: { price: 121.0, discount: '8% OFF' },
    pharmeasy: { price: 116.0, discount: '12% OFF' },
    netmeds: { price: 118.0, discount: '10% OFF' }
  },
  'vicks vaporub': {
    mrp: 150.0,
    tata1mg: { price: 135.0, discount: '10% OFF' },
    apollo: { price: 138.0, discount: '8% OFF' },
    pharmeasy: { price: 132.0, discount: '12% OFF' },
    netmeds: { price: 135.0, discount: '10% OFF' }
  },
  'vicco turmeric': {
    mrp: 90.0,
    tata1mg: { price: 81.0, discount: '10% OFF' },
    apollo: { price: 83.0, discount: '8% OFF' },
    pharmeasy: { price: 79.0, discount: '12% OFF' },
    netmeds: { price: 81.0, discount: '10% OFF' }
  },
  'evion 400': {
    mrp: 38.0,
    tata1mg: { price: 34.2, discount: '10% OFF' },
    apollo: { price: 35.0, discount: '8% OFF' },
    pharmeasy: { price: 33.5, discount: '12% OFF' },
    netmeds: { price: 34.0, discount: '10% OFF' }
  },
  'becosules': {
    mrp: 52.0,
    tata1mg: { price: 46.8, discount: '10% OFF' },
    apollo: { price: 48.0, discount: '8% OFF' },
    pharmeasy: { price: 45.5, discount: '12% OFF' },
    netmeds: { price: 46.5, discount: '10% OFF' }
  },
  'revital h': {
    mrp: 310.0,
    tata1mg: { price: 263.5, discount: '15% OFF' },
    apollo: { price: 272.0, discount: '12% OFF' },
    pharmeasy: { price: 258.0, discount: '17% OFF' },
    netmeds: { price: 260.0, discount: '16% OFF' }
  }
};

export const pharmacyController = {
  async comparePrices(req: Request, res: Response) {
    try {
      const rawName = (req.query.name as string) || 'Dolo 650';
      const cleanName = rawName.trim();
      const lowerKey = cleanName.toLowerCase();

      // Find exact or closest match in database using token or substring matching
      let match = MEDICINES_DATABASE[lowerKey];
      if (!match) {
        for (const [k, v] of Object.entries(MEDICINES_DATABASE)) {
          if (lowerKey.includes(k) || k.includes(lowerKey)) {
            match = v;
            break;
          }
        }
      }

      // If still no match, split into words and check if key contains primary word (e.g. "saridon" in "saridon tablet 10s")
      if (!match) {
        const words = lowerKey.split(/\s+/).filter((w) => w.length > 3);
        for (const word of words) {
          for (const [k, v] of Object.entries(MEDICINES_DATABASE)) {
            if (k.includes(word) || word.includes(k)) {
              match = v;
              break;
            }
          }
          if (match) break;
        }
      }

      // If unknown medicine, estimate realistic MRP
      let baseMrp = 45.0;
      if (match) {
        baseMrp = match.mrp;
      } else {
        let hash = 0;
        for (let i = 0; i < cleanName.length; i++) hash += cleanName.charCodeAt(i);
        baseMrp = 35 + (hash % 80);
      }

      const encodedQuery = encodeURIComponent(cleanName);

      const tPrice = match?.tata1mg?.price ?? Number((baseMrp * 0.90).toFixed(1));
      const aPrice = match?.apollo?.price ?? Number((baseMrp * 0.93).toFixed(1));
      const pPrice = match?.pharmeasy?.price ?? Number((baseMrp * 0.88).toFixed(1));
      const nPrice = match?.netmeds?.price ?? Number((baseMrp * 0.91).toFixed(1));

      const prices = [
        {
          pharmacyName: 'Tata 1mg',
          logoUrl: 'https://www.1mg.com/images/1mg_logo.svg',
          price: tPrice,
          originalPrice: baseMrp,
          discount: match?.tata1mg?.discount || '8% OFF',
          deliveryTime: 'Same Day Delivery (2 hrs)',
          inStock: true,
          buyUrl: `https://www.1mg.com/search/all?name=${encodedQuery}`
        },
        {
          pharmacyName: 'Apollo Pharmacy',
          logoUrl: 'https://images.apollo247.in/images/ic_logo.png',
          price: aPrice,
          originalPrice: baseMrp,
          discount: match?.apollo?.discount || '6% OFF',
          deliveryTime: 'Express 45 Mins',
          inStock: true,
          buyUrl: `https://www.apollopharmacy.in/search-medicines/${encodedQuery}`
        },
        {
          pharmacyName: 'PharmEasy',
          logoUrl: 'https://assets.pharmeasy.in/web-assets/dist/fca22ccb.png',
          price: pPrice,
          originalPrice: baseMrp,
          discount: match?.pharmeasy?.discount || '10% OFF',
          deliveryTime: 'Delivered Tomorrow',
          inStock: true,
          buyUrl: `https://pharmeasy.in/search/all?name=${encodedQuery}`
        },
        {
          pharmacyName: 'Netmeds',
          logoUrl: 'https://www.netmeds.com/assets/glimpse/images/netmeds-logo.svg',
          price: nPrice,
          originalPrice: baseMrp,
          discount: match?.netmeds?.discount || '7% OFF',
          deliveryTime: 'Delivery in 1-2 Days',
          inStock: true,
          buyUrl: `https://www.netmeds.com/catalogsearch/result?q=${encodedQuery}`
        }
      ];

      res.json({ success: true, medicineName: cleanName, prices });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getNearbyPharmacies(req: Request, res: Response) {
    try {
      const lat = parseFloat(req.query.lat as string) || 28.6139;
      const lng = parseFloat(req.query.lng as string) || 77.209;

      const pharmacies = [
        {
          id: 'pharm-1',
          name: 'Apollo Pharmacy 24/7',
          address: 'Main Healthcare Avenue, Near City Hospital',
          distance: '0.4 km',
          phone: '+91 1800 108 1008',
          openNow: true,
          rating: 4.8,
          lat: lat + 0.003,
          lng: lng + 0.002,
          operatingHours: 'Open 24 Hours',
          directionsUrl: `https://www.google.com/maps/search/pharmacy/@${lat + 0.003},${lng + 0.002},15z`
        },
        {
          id: 'pharm-2',
          name: 'MedPlus Chemist & Druggist',
          address: 'Shop 12, Market Complex',
          distance: '0.8 km',
          phone: '+91 1800 425 7171',
          openNow: true,
          rating: 4.6,
          lat: lat - 0.004,
          lng: lng + 0.005,
          operatingHours: '8:00 AM - 11:00 PM',
          directionsUrl: `https://www.google.com/maps/search/pharmacy/@${lat - 0.004},${lng + 0.005},15z`
        },
        {
          id: 'pharm-3',
          name: 'Wellness Forever Healthcare Store',
          address: 'Green Park Extension, Medical Hub',
          distance: '1.2 km',
          phone: '+91 1800 266 2244',
          openNow: true,
          rating: 4.9,
          lat: lat + 0.007,
          lng: lng - 0.003,
          operatingHours: 'Open 24 Hours',
          directionsUrl: `https://www.google.com/maps/search/pharmacy/@${lat + 0.007},${lng - 0.003},15z`
        },
        {
          id: 'pharm-4',
          name: 'Guardian Pharmacy & Care',
          address: 'Sector 15 Community Center',
          distance: '1.9 km',
          phone: '+91 1800 102 3456',
          openNow: false,
          rating: 4.4,
          lat: lat - 0.008,
          lng: lng - 0.006,
          operatingHours: '9:00 AM - 9:30 PM',
          directionsUrl: `https://www.google.com/maps/search/pharmacy/@${lat - 0.008},${lng - 0.006},15z`
        }
      ];

      res.json({ success: true, data: pharmacies });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
