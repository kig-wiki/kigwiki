import type { LoadContext, Plugin } from '@docusaurus/types';
import * as fs from 'fs';
import * as path from 'path';
import { getCurrencyConverter } from '../utils/currency-converter';

// Type definitions based on migration.md
export interface SocialLinks {
  x?: string;
  instagram?: string;
  facebook?: string;
  weibo?: string;
  bluesky?: string;
  tiktok?: string;
}

export interface PriceDetails {
  generic?: string;
  semiCustom?: string;
  fullCustom?: string;
}

export interface Features {
  budget?: boolean;
  "Hard Hair"?: boolean;
  shell?: boolean;
}

export interface HairOptions {
  "Hard Hair"?: boolean;
  "Hard HairPrice"?: string;
}

export interface Maker {
  name: string;
  alias?: string;
  website?: string;
  status?: 'open' | 'closed' | 'beware';
  region?: string;
  socials?: SocialLinks;
  priceRange?: string;
  priceDetails?: PriceDetails;
  approxStartingPrice?: string;
  currency?: string;
  priceTier?: string;
  type?: string;
  size?: string;
  materialType?: string;
  englishOrdering?: boolean | string;
  features?: Features;
  hairOptions?: HairOptions;
  notes?: string;
}

export interface PriceExample {
  type: string;
  price: string | number;
  link?: string;
}

export interface Hadatai {
  name: string;
  region?: string;
  currency?: string;
  socials?: SocialLinks;
  priceExamples?: PriceExample[];
  notes?: string;
}

export interface MakerDataContent {
  makers: Maker[];
  hadatai: Hadatai[];
}

interface PluginOptions {
  makersDir?: string;
  hadataiDir?: string;
  verbose?: boolean;
}

const makerDataPlugin = (context: LoadContext, options: PluginOptions = {}): Plugin<MakerDataContent> => {
  const { siteDir } = context;
  const { 
    makersDir = 'makers', 
    hadataiDir = 'hadatai',
    verbose = false 
  } = options;

  const log = (message: string, ...args: any[]) => {
    if (verbose) {
      console.log(`[maker-data-plugin] ${message}`, ...args);
    }
  };

  const loadJsonFiles = async (dirPath: string): Promise<any[]> => {
    const fullPath = path.join(siteDir, dirPath);
    
    if (!fs.existsSync(fullPath)) {
      log(`Directory ${fullPath} does not exist`);
      return [];
    }

    try {
      const files = fs.readdirSync(fullPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      log(`Found ${jsonFiles.length} JSON files in ${dirPath}`);
      
      const data = jsonFiles.map(file => {
        const filePath = path.join(fullPath, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const parsed = JSON.parse(content);
          log(`Loaded ${file}:`, parsed.name || 'unnamed');
          return parsed;
        } catch (error) {
          log(`Error loading ${file}:`, error);
          return null;
        }
      }).filter(Boolean);

      return data;
    } catch (error) {
      log(`Error reading directory ${dirPath}:`, error);
      return [];
    }
  };

  const transformMakerData = (rawData: any[], converter: any): Maker[] => {
    return rawData.map(item => {
      const transformed: Maker = {
        name: item.name || 'Unknown',
        alias: item.alias,
        website: item.website,
        status: item.status,
        region: item.Region || item.region,
        socials: item.socials || {},
        priceRange: item.priceRange,
        priceDetails: item.priceDetails,
        approxStartingPrice: item.approxStartingPrice,
        currency: item.currency,
        priceTier: item.priceTier,
        type: item.type,
        size: item.size,
        materialType: item.materialType,
        englishOrdering: item.englishOrdering,
        features: item.features || {},
        hairOptions: item.hairOptions || {},
        notes: item.notes,
      };

      // COMMENTED OUT: Convert pricing if we have approxStartingPrice and currency
      // This logic is preserved for potential future use
      /*
      if (item.approxStartingPrice && item.currency) {
        try {
          const converted = converter.convertPriceString(item.approxStartingPrice, item.currency);
          transformed.priceRange = `${converted.convertedFormatted} USD (${converted.original} ${converted.originalCurrency})`;
        } catch (error) {
          console.warn(`[MakerData] Failed to convert price for ${item.name}:`, error);
          transformed.priceRange = `${item.approxStartingPrice} ${item.currency}`;
        }
      }
      */

      return transformed;
    });
  };

  const transformHadataiData = (rawData: any[], converter: any): Hadatai[] => {
    return rawData.map(item => {
      const transformed: Hadatai = {
        name: item.name || 'Unknown',
        region: item.Region || item.region,
        currency: item.currency,
        socials: item.socials || {},
        priceExamples: item.priceExamples || [],
        notes: item.notes,
      };

      // Convert price examples if we have currency
      if (item.priceExamples && item.currency) {
        transformed.priceExamples = item.priceExamples.map((example: any) => {
          try {
            const converted = converter.convertPriceString(example.price.toString(), item.currency);
            return {
              ...example,
              price: `${converted.convertedFormatted} USD (${converted.original} ${converted.originalCurrency})`
            };
          } catch (error) {
            console.warn(`[HadataiData] Failed to convert price for ${item.name}:`, error);
            return example;
          }
        });
      }

      return transformed;
    });
  };

  return {
    name: 'docusaurus-plugin-maker-data',

    async loadContent(): Promise<MakerDataContent> {
      log('Loading maker and hadatai data...');
      
      // Initialize currency converter
      const converter = getCurrencyConverter();
      await converter.loadRates();
      
      const [rawMakers, rawHadatai] = await Promise.all([
        loadJsonFiles(makersDir),
        loadJsonFiles(hadataiDir),
      ]);

      const makers = transformMakerData(rawMakers, converter);
      const hadatai = transformHadataiData(rawHadatai, converter);

      log(`Loaded ${makers.length} makers and ${hadatai.length} hadatai entries`);

      return {
        makers,
        hadatai,
      };
    },

    async contentLoaded({ content, actions }) {
      const { createData } = actions;
      
      log('Creating data files for static import...');
      
      // Create data files that will be embedded in pages
      await createData(
        'makers-data.json',
        JSON.stringify(content.makers, null, 2)
      );

      await createData(
        'hadatai-data.json', 
        JSON.stringify(content.hadatai, null, 2)
      );

      // Create TypeScript data files for import
      const dataDir = path.join(siteDir, 'src', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const makersTsPath = path.join(dataDir, 'makers-data.ts');
      const hadataiTsPath = path.join(dataDir, 'hadatai-data.ts');

      const makersTsContent = `// Auto-generated file - do not edit manually
import type { Maker } from '../plugins/docusaurus-plugin-maker-data';

export const makersData: Maker[] = ${JSON.stringify(content.makers, null, 2)};
`;

      const hadataiTsContent = `// Auto-generated file - do not edit manually
import type { Hadatai } from '../plugins/docusaurus-plugin-maker-data';

export const hadataiData: Hadatai[] = ${JSON.stringify(content.hadatai, null, 2)};
`;

      fs.writeFileSync(makersTsPath, makersTsContent);
      fs.writeFileSync(hadataiTsPath, hadataiTsContent);

      log('Data files created successfully');
    },


    getPathsToWatch() {
      return [
        path.join(siteDir, makersDir, '**/*.json'),
        path.join(siteDir, hadataiDir, '**/*.json'),
      ];
    },

    // Simple approach: create static files only when needed
    // This avoids constantly creating files in the active environment

  };
};

export default makerDataPlugin;
