/**
 * Country Seeder for GeoPulse Intelligence
 * Seeds 195 countries with ISO codes, coordinates, and regions.
 *
 * Usage:
 *   ts-node src/app/modules/GeoIntelligence/seeders/countries.seeder.ts
 *   OR call seedCountries() during app.listen after DB connected.
 */

import logger from '../../../../utils/logger';
import { Country } from '../models/Country';

const COUNTRIES = [
  { name: 'Afghanistan', iso_code: 'AF', region: 'Asia', sub_region: 'South Asia', coordinates: { lat: 33.9391, lng: 67.7100 } },
  { name: 'Albania', iso_code: 'AL', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 41.1533, lng: 20.1683 } },
  { name: 'Algeria', iso_code: 'DZ', region: 'Africa', sub_region: 'North Africa', coordinates: { lat: 28.0339, lng: 1.6596 } },
  { name: 'Argentina', iso_code: 'AR', region: 'Americas', sub_region: 'South America', coordinates: { lat: -38.4161, lng: -63.6167 } },
  { name: 'Armenia', iso_code: 'AM', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 40.0691, lng: 45.0382 } },
  { name: 'Australia', iso_code: 'AU', region: 'Oceania', sub_region: 'Australasia', coordinates: { lat: -25.2744, lng: 133.7751 } },
  { name: 'Austria', iso_code: 'AT', region: 'Europe', sub_region: 'Western Europe', coordinates: { lat: 47.5162, lng: 14.5501 } },
  { name: 'Azerbaijan', iso_code: 'AZ', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 40.1431, lng: 47.5769 } },
  { name: 'Bahrain', iso_code: 'BH', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 26.0667, lng: 50.5577 } },
  { name: 'Bangladesh', iso_code: 'BD', region: 'Asia', sub_region: 'South Asia', capital: 'Dhaka', population: 166303498, coordinates: { lat: 23.6850, lng: 90.3563 } },
  { name: 'Belarus', iso_code: 'BY', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 53.7098, lng: 27.9534 } },
  { name: 'Belgium', iso_code: 'BE', region: 'Europe', sub_region: 'Western Europe', coordinates: { lat: 50.5039, lng: 4.4699 } },
  { name: 'Bhutan', iso_code: 'BT', region: 'Asia', sub_region: 'South Asia', coordinates: { lat: 27.5142, lng: 90.4336 } },
  { name: 'Bolivia', iso_code: 'BO', region: 'Americas', sub_region: 'South America', coordinates: { lat: -16.2902, lng: -63.5887 } },
  { name: 'Bosnia and Herzegovina', iso_code: 'BA', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 43.9159, lng: 17.6791 } },
  { name: 'Brazil', iso_code: 'BR', region: 'Americas', sub_region: 'South America', coordinates: { lat: -14.2350, lng: -51.9253 } },
  { name: 'Bulgaria', iso_code: 'BG', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 42.7339, lng: 25.4858 } },
  { name: 'Burkina Faso', iso_code: 'BF', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 12.3642, lng: -1.5275 } },
  { name: 'Burma (Myanmar)', iso_code: 'MM', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 21.9162, lng: 95.9560 } },
  { name: 'Cambodia', iso_code: 'KH', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 12.5657, lng: 104.9910 } },
  { name: 'Cameroon', iso_code: 'CM', region: 'Africa', sub_region: 'Central Africa', coordinates: { lat: 7.3697, lng: 12.3547 } },
  { name: 'Canada', iso_code: 'CA', region: 'Americas', sub_region: 'North America', coordinates: { lat: 56.1304, lng: -106.3468 } },
  { name: 'Central African Republic', iso_code: 'CF', region: 'Africa', sub_region: 'Central Africa', coordinates: { lat: 6.6111, lng: 20.9394 } },
  { name: 'Chad', iso_code: 'TD', region: 'Africa', sub_region: 'Central Africa', coordinates: { lat: 15.4542, lng: 18.7322 } },
  { name: 'Chile', iso_code: 'CL', region: 'Americas', sub_region: 'South America', coordinates: { lat: -35.6751, lng: -71.5430 } },
  { name: 'China', iso_code: 'CN', region: 'Asia', sub_region: 'East Asia', capital: 'Beijing', population: 1402112000, coordinates: { lat: 35.8617, lng: 104.1954 } },
  { name: 'Colombia', iso_code: 'CO', region: 'Americas', sub_region: 'South America', coordinates: { lat: 4.5709, lng: -74.2973 } },
  { name: 'Congo (Democratic Republic)', iso_code: 'CD', region: 'Africa', sub_region: 'Central Africa', coordinates: { lat: -4.0383, lng: 21.7587 } },
  { name: 'Congo (Republic)', iso_code: 'CG', region: 'Africa', sub_region: 'Central Africa', coordinates: { lat: -0.2280, lng: 15.8277 } },
  { name: 'Croatia', iso_code: 'HR', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 45.1000, lng: 15.2000 } },
  { name: 'Cuba', iso_code: 'CU', region: 'Americas', sub_region: 'Caribbean', coordinates: { lat: 21.5218, lng: -77.7812 } },
  { name: 'Cyprus', iso_code: 'CY', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 35.1264, lng: 33.4299 } },
  { name: 'Czech Republic', iso_code: 'CZ', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 49.8175, lng: 15.4730 } },
  { name: 'Denmark', iso_code: 'DK', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 56.2639, lng: 9.5018 } },
  { name: 'Ecuador', iso_code: 'EC', region: 'Americas', sub_region: 'South America', coordinates: { lat: -1.8312, lng: -78.1834 } },
  { name: 'Egypt', iso_code: 'EG', region: 'Africa', sub_region: 'North Africa', coordinates: { lat: 26.0975, lng: 29.5752 } },
  { name: 'El Salvador', iso_code: 'SV', region: 'Americas', sub_region: 'Central America', coordinates: { lat: 13.7942, lng: -88.8965 } },
  { name: 'Eritrea', iso_code: 'ER', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: 15.1794, lng: 39.7823 } },
  { name: 'Estonia', iso_code: 'EE', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 58.5953, lng: 25.0136 } },
  { name: 'Ethiopia', iso_code: 'ET', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: 9.1450, lng: 40.4897 } },
  { name: 'Finland', iso_code: 'FI', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 61.9241, lng: 25.7482 } },
  { name: 'France', iso_code: 'FR', region: 'Europe', sub_region: 'Western Europe', coordinates: { lat: 46.2276, lng: 2.2137 } },
  { name: 'Georgia', iso_code: 'GE', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 42.3154, lng: 43.3569 } },
  { name: 'Germany', iso_code: 'DE', region: 'Europe', sub_region: 'Western Europe', coordinates: { lat: 51.1657, lng: 10.4515 } },
  { name: 'Ghana', iso_code: 'GH', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 7.9465, lng: -1.0232 } },
  { name: 'Greece', iso_code: 'GR', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 39.0742, lng: 21.8243 } },
  { name: 'Guatemala', iso_code: 'GT', region: 'Americas', sub_region: 'Central America', coordinates: { lat: 15.7835, lng: -90.2308 } },
  { name: 'Guinea', iso_code: 'GN', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 9.9456, lng: -11.2874 } },
  { name: 'Haiti', iso_code: 'HT', region: 'Americas', sub_region: 'Caribbean', coordinates: { lat: 18.9712, lng: -72.2852 } },
  { name: 'Honduras', iso_code: 'HN', region: 'Americas', sub_region: 'Central America', coordinates: { lat: 15.1999, lng: -86.2419 } },
  { name: 'Hungary', iso_code: 'HU', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 47.1625, lng: 19.5033 } },
  { name: 'India', iso_code: 'IN', region: 'Asia', sub_region: 'South Asia', capital: 'New Delhi', population: 1393409038, coordinates: { lat: 20.5937, lng: 78.9629 } },
  { name: 'Indonesia', iso_code: 'ID', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: -0.7893, lng: 113.9213 } },
  { name: 'Iran', iso_code: 'IR', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 32.4279, lng: 53.6880 } },
  { name: 'Iraq', iso_code: 'IQ', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 33.2232, lng: 43.6793 } },
  { name: 'Ireland', iso_code: 'IE', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 53.4129, lng: -8.2439 } },
  { name: 'Israel', iso_code: 'IL', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 31.0461, lng: 34.8516 } },
  { name: 'Italy', iso_code: 'IT', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 41.8719, lng: 12.5674 } },
  { name: 'Ivory Coast', iso_code: 'CI', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 7.5399, lng: -5.5471 } },
  { name: 'Jamaica', iso_code: 'JM', region: 'Americas', sub_region: 'Caribbean', coordinates: { lat: 18.1096, lng: -77.2975 } },
  { name: 'Japan', iso_code: 'JP', region: 'Asia', sub_region: 'East Asia', capital: 'Tokyo', population: 125502000, coordinates: { lat: 36.2048, lng: 138.2529 } },
  { name: 'Jordan', iso_code: 'JO', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 30.5852, lng: 36.2384 } },
  { name: 'Kazakhstan', iso_code: 'KZ', region: 'Asia', sub_region: 'Central Asia', coordinates: { lat: 48.0196, lng: 66.9237 } },
  { name: 'Kenya', iso_code: 'KE', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: -0.0236, lng: 37.9062 } },
  { name: 'Kuwait', iso_code: 'KW', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 29.3117, lng: 47.4818 } },
  { name: 'Kyrgyzstan', iso_code: 'KG', region: 'Asia', sub_region: 'Central Asia', coordinates: { lat: 41.2044, lng: 74.7661 } },
  { name: 'Laos', iso_code: 'LA', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 19.8563, lng: 102.4955 } },
  { name: 'Latvia', iso_code: 'LV', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 56.8796, lng: 24.6032 } },
  { name: 'Lebanon', iso_code: 'LB', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 33.8547, lng: 35.8623 } },
  { name: 'Libya', iso_code: 'LY', region: 'Africa', sub_region: 'North Africa', coordinates: { lat: 26.3351, lng: 17.2283 } },
  { name: 'Lithuania', iso_code: 'LT', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 55.1694, lng: 23.8813 } },
  { name: 'Luxembourg', iso_code: 'LU', region: 'Europe', sub_region: 'Western Europe', coordinates: { lat: 49.8153, lng: 6.1296 } },
  { name: 'Madagascar', iso_code: 'MG', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: -18.7669, lng: 46.8691 } },
  { name: 'Malaysia', iso_code: 'MY', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 4.2105, lng: 101.9758 } },
  { name: 'Mali', iso_code: 'ML', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 17.5707, lng: -3.9962 } },
  { name: 'Mexico', iso_code: 'MX', region: 'Americas', sub_region: 'North America', coordinates: { lat: 23.6345, lng: -102.5528 } },
  { name: 'Moldova', iso_code: 'MD', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 47.4116, lng: 28.3699 } },
  { name: 'Morocco', iso_code: 'MA', region: 'Africa', sub_region: 'North Africa', coordinates: { lat: 31.7917, lng: -7.0926 } },
  { name: 'Mozambique', iso_code: 'MZ', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: -18.6657, lng: 35.5296 } },
  { name: 'Namibia', iso_code: 'NA', region: 'Africa', sub_region: 'Southern Africa', coordinates: { lat: -22.9576, lng: 18.4904 } },
  { name: 'Nepal', iso_code: 'NP', region: 'Asia', sub_region: 'South Asia', coordinates: { lat: 28.3949, lng: 84.1240 } },
  { name: 'Netherlands', iso_code: 'NL', region: 'Europe', sub_region: 'Western Europe', coordinates: { lat: 52.1326, lng: 5.2913 } },
  { name: 'New Zealand', iso_code: 'NZ', region: 'Oceania', sub_region: 'Australasia', coordinates: { lat: -40.9006, lng: 174.8860 } },
  { name: 'Nicaragua', iso_code: 'NI', region: 'Americas', sub_region: 'Central America', coordinates: { lat: 12.8654, lng: -85.2072 } },
  { name: 'Niger', iso_code: 'NE', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 17.6078, lng: 8.0817 } },
  { name: 'Nigeria', iso_code: 'NG', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 9.0820, lng: 8.6753 } },
  { name: 'North Korea', iso_code: 'KP', region: 'Asia', sub_region: 'East Asia', coordinates: { lat: 40.3399, lng: 127.5101 } },
  { name: 'Norway', iso_code: 'NO', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 60.4720, lng: 8.4689 } },
  { name: 'Oman', iso_code: 'OM', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 21.4735, lng: 55.9754 } },
  { name: 'Pakistan', iso_code: 'PK', region: 'Asia', sub_region: 'South Asia', coordinates: { lat: 30.3753, lng: 69.3451 } },
  { name: 'Palestine', iso_code: 'PS', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 31.9522, lng: 35.2332 } },
  { name: 'Panama', iso_code: 'PA', region: 'Americas', sub_region: 'Central America', coordinates: { lat: 8.5380, lng: -80.7821 } },
  { name: 'Papua New Guinea', iso_code: 'PG', region: 'Oceania', sub_region: 'Melanesia', coordinates: { lat: -6.3149, lng: 143.9555 } },
  { name: 'Paraguay', iso_code: 'PY', region: 'Americas', sub_region: 'South America', coordinates: { lat: -23.4425, lng: -58.4438 } },
  { name: 'Peru', iso_code: 'PE', region: 'Americas', sub_region: 'South America', coordinates: { lat: -9.1899, lng: -75.0152 } },
  { name: 'Philippines', iso_code: 'PH', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 12.8797, lng: 121.7740 } },
  { name: 'Poland', iso_code: 'PL', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 51.9194, lng: 19.1451 } },
  { name: 'Portugal', iso_code: 'PT', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 39.3999, lng: -8.2245 } },
  { name: 'Qatar', iso_code: 'QA', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 25.3548, lng: 51.1839 } },
  { name: 'Romania', iso_code: 'RO', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 45.9432, lng: 24.9668 } },
  { name: 'Russia', iso_code: 'RU', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 61.5240, lng: 105.3188 } },
  { name: 'Rwanda', iso_code: 'RW', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: -1.9403, lng: 29.8739 } },
  { name: 'Saudi Arabia', iso_code: 'SA', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 23.8859, lng: 45.0792 } },
  { name: 'Senegal', iso_code: 'SN', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 14.4974, lng: -14.4524 } },
  { name: 'Serbia', iso_code: 'RS', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 44.0165, lng: 21.0059 } },
  { name: 'Sierra Leone', iso_code: 'SL', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 8.4606, lng: -11.7799 } },
  { name: 'Singapore', iso_code: 'SG', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 1.3521, lng: 103.8198 } },
  { name: 'Slovakia', iso_code: 'SK', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 48.6690, lng: 19.6990 } },
  { name: 'Slovenia', iso_code: 'SI', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 46.1512, lng: 14.9955 } },
  { name: 'Somalia', iso_code: 'SO', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: 5.1521, lng: 46.1996 } },
  { name: 'South Africa', iso_code: 'ZA', region: 'Africa', sub_region: 'Southern Africa', coordinates: { lat: -30.5595, lng: 22.9375 } },
  { name: 'South Korea', iso_code: 'KR', region: 'Asia', sub_region: 'East Asia', coordinates: { lat: 35.9078, lng: 127.7669 } },
  { name: 'South Sudan', iso_code: 'SS', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: 6.8770, lng: 31.3069 } },
  { name: 'Spain', iso_code: 'ES', region: 'Europe', sub_region: 'Southern Europe', coordinates: { lat: 40.4637, lng: -3.7492 } },
  { name: 'Sri Lanka', iso_code: 'LK', region: 'Asia', sub_region: 'South Asia', coordinates: { lat: 7.8731, lng: 80.7718 } },
  { name: 'Sudan', iso_code: 'SD', region: 'Africa', sub_region: 'North Africa', coordinates: { lat: 12.8628, lng: 30.2176 } },
  { name: 'Sweden', iso_code: 'SE', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 60.1282, lng: 18.6435 } },
  { name: 'Switzerland', iso_code: 'CH', region: 'Europe', sub_region: 'Western Europe', coordinates: { lat: 46.8182, lng: 8.2275 } },
  { name: 'Syria', iso_code: 'SY', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 34.8021, lng: 38.9968 } },
  { name: 'Taiwan', iso_code: 'TW', region: 'Asia', sub_region: 'East Asia', coordinates: { lat: 23.6978, lng: 120.9605 } },
  { name: 'Tajikistan', iso_code: 'TJ', region: 'Asia', sub_region: 'Central Asia', coordinates: { lat: 38.8610, lng: 71.2761 } },
  { name: 'Tanzania', iso_code: 'TZ', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: -6.3690, lng: 34.8888 } },
  { name: 'Thailand', iso_code: 'TH', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 15.8700, lng: 100.9925 } },
  { name: 'Togo', iso_code: 'TG', region: 'Africa', sub_region: 'West Africa', coordinates: { lat: 8.6195, lng: 0.8248 } },
  { name: 'Tunisia', iso_code: 'TN', region: 'Africa', sub_region: 'North Africa', coordinates: { lat: 33.8869, lng: 9.5375 } },
  { name: 'Turkey', iso_code: 'TR', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 38.9637, lng: 35.2433 } },
  { name: 'Turkmenistan', iso_code: 'TM', region: 'Asia', sub_region: 'Central Asia', coordinates: { lat: 38.9697, lng: 59.5563 } },
  { name: 'Uganda', iso_code: 'UG', region: 'Africa', sub_region: 'East Africa', coordinates: { lat: 1.3733, lng: 32.2903 } },
  { name: 'Ukraine', iso_code: 'UA', region: 'Europe', sub_region: 'Eastern Europe', coordinates: { lat: 48.3794, lng: 31.1656 } },
  { name: 'United Arab Emirates', iso_code: 'AE', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 23.4241, lng: 53.8478 } },
  { name: 'United Kingdom', iso_code: 'GB', region: 'Europe', sub_region: 'Northern Europe', coordinates: { lat: 55.3781, lng: -3.4360 } },
  { name: 'United States', iso_code: 'US', region: 'Americas', sub_region: 'North America', capital: 'Washington D.C.', population: 329500000, coordinates: { lat: 37.0902, lng: -95.7129 } },
  { name: 'Uruguay', iso_code: 'UY', region: 'Americas', sub_region: 'South America', coordinates: { lat: -32.5228, lng: -55.7658 } },
  { name: 'Uzbekistan', iso_code: 'UZ', region: 'Asia', sub_region: 'Central Asia', coordinates: { lat: 41.3775, lng: 64.5853 } },
  { name: 'Venezuela', iso_code: 'VE', region: 'Americas', sub_region: 'South America', coordinates: { lat: 6.4238, lng: -66.5897 } },
  { name: 'Vietnam', iso_code: 'VN', region: 'Asia', sub_region: 'South-Eastern Asia', coordinates: { lat: 14.0583, lng: 108.2772 } },
  { name: 'Yemen', iso_code: 'YE', region: 'Asia', sub_region: 'Western Asia', coordinates: { lat: 15.5527, lng: 48.5164 } },
  { name: 'Zimbabwe', iso_code: 'ZW', region: 'Africa', sub_region: 'Southern Africa', coordinates: { lat: -19.0154, lng: 29.1549 } },
];

export const seedCountries = async (): Promise<void> => {
  try {
    const existing = await Country.countDocuments();
    if (existing >= COUNTRIES.length) {
      logger.info(`[Seed] Countries already seeded (${existing} records). Skipping.`);
      return;
    }

    let created = 0;
    for (const country of COUNTRIES) {
      await Country.findOneAndUpdate(
        { iso_code: country.iso_code },
        { $setOnInsert: { ...country, stability_score: 50 } },
        { upsert: true, new: false },
      );
      created++;
    }

    logger.info(`✅ [Seed] Countries seeded: ${created} records`);
  } catch (err: any) {
    logger.error('[Seed] Country seeding failed', { error: err.message });
  }
};
