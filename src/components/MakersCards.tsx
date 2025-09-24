import React, { useState, useMemo, useCallback, memo } from 'react';
import type { Maker } from '../plugins/docusaurus-plugin-maker-data';
import { useDebounce } from '../hooks/useDebounce';

interface MakersCardsProps {
  className?: string;
  data: Maker[];
}

interface SortConfig {
  key: keyof Maker;
  direction: 'asc' | 'desc';
}

const LinkIcon: React.FC<{ platform: string; url: string; isWebsite?: boolean }> = memo(({ platform, url, isWebsite = false }) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return null;

  const getIconPath = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('twitter') || lowerPlatform.includes('x.com')) {
      return '/social_icons/x.svg';
    } else if (lowerPlatform.includes('instagram')) {
      return '/social_icons/instagram.svg';
    } else if (lowerPlatform.includes('facebook')) {
      return '/social_icons/facebook.svg';
    } else if (lowerPlatform.includes('weibo')) {
      return '/social_icons/weibo.svg';
    } else if (lowerPlatform.includes('tiktok')) {
      return '/social_icons/tiktok.svg';
    } else if (lowerPlatform.includes('bluesky')) {
      return '/social_icons/bluesky.svg';
    } else {
      return null; // No icon available
    }
  };

  const iconPath = isWebsite ? null : getIconPath(platform);
  const displayName = isWebsite ? 'Website' : platform;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-item"
      title={`${displayName} - ${url}`}
    >
      {iconPath ? (
        <img 
          src={iconPath} 
          alt={displayName}
          className="link-icon"
        />
      ) : (
        <span className="link-text">{displayName}</span>
      )}
    </a>
  );
});

const StatusBadge: React.FC<{ status?: string }> = memo(({ status }) => {
  if (!status || typeof status !== 'string') return null;

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('open') || lowerStatus.includes('active')) {
      return 'status-open';
    } else if (lowerStatus.includes('closed') || lowerStatus.includes('inactive')) {
      return 'status-closed';
    } else if (lowerStatus.includes('waitlist') || lowerStatus.includes('wait')) {
      return 'status-waitlist';
    } else {
      return 'status-unknown';
    }
  };

  return (
    <span className={`status-badge ${getStatusColor(status)}`}>
      {status}
    </span>
  );
});

const MakersCards: React.FC<MakersCardsProps> = memo(({ className = '', data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnglishOnly, setShowEnglishOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedMakers = useMemo(() => {
    let filtered = data;

    // Apply English ordering filter
    if (showEnglishOnly) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(maker => 
        maker.englishOrdering !== false && 
        maker.englishOrdering !== null && 
        maker.englishOrdering !== undefined
      );
      console.log(`English filter: ${beforeCount} → ${filtered.length} makers`);
    }

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(maker => 
        maker.name.toLowerCase().includes(term) ||
        maker.alias?.toLowerCase().includes(term) ||
        maker.notes?.toLowerCase().includes(term) ||
        maker.priceRange?.toLowerCase().includes(term) ||
        maker.priceTier?.toLowerCase().includes(term) ||
        maker.type?.toLowerCase().includes(term) ||
        maker.region?.toLowerCase().includes(term) ||
        maker.size?.toLowerCase().includes(term) ||
        maker.materialType?.toLowerCase().includes(term) ||
        (typeof maker.englishOrdering === 'string' && maker.englishOrdering.toLowerCase().includes(term)) ||
        (maker.features && Object.entries(maker.features)
          .filter(([key, value]) => value === true)
          .some(([key, value]) => key.toLowerCase().includes(term))
        )
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      
      // Special handling for price range sorting
      if (sortConfig.key === 'priceRange') {
        const aPrice = extractNumericPrice(aVal as string);
        const bPrice = extractNumericPrice(bVal as string);
        
        if (aPrice === null && bPrice === null) return 0;
        if (aPrice === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bPrice === null) return sortConfig.direction === 'asc' ? -1 : 1;
        
        return sortConfig.direction === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });
  }, [data, debouncedSearchTerm, showEnglishOnly, sortConfig]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleEnglishOnlyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShowEnglishOnly(e.target.checked);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, direction] = e.target.value.split('-');
    setSortConfig({ key: key as keyof Maker, direction: direction as 'asc' | 'desc' });
  }, []);

  return (
    <div className={`makers-cards-container ${className}`}>
      <div className="makers-cards-header">
        <div className="makers-cards-search">
          <input
            type="text"
            placeholder="Search makers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="makers-cards-filters">
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showEnglishOnly}
              onChange={handleEnglishOnlyChange}
            />
            <span className="filter-label">English ordering only</span>
          </label>
        </div>
        
        <div className="makers-cards-sort">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="status-asc">Status (Open first)</option>
            <option value="status-desc">Status (Closed first)</option>
            {/* COMMENTED OUT: Old price range sorting options - preserved for potential future use */}
            {/* <option value="priceRange-asc">Price (Low to High)</option> */}
            {/* <option value="priceRange-desc">Price (High to Low)</option> */}
            <option value="priceTier-asc">Price Tier (Low to High)</option>
            <option value="priceTier-desc">Price Tier (High to Low)</option>
            <option value="region-asc">Region (A-Z)</option>
            <option value="region-desc">Region (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="makers-cards-grid">
        {filteredAndSortedMakers.length === 0 ? (
          <div className="no-results">
            {searchTerm ? 'No makers found matching your search.' : 'No makers data available.'}
          </div>
        ) : (
          filteredAndSortedMakers.map((maker, index) => (
            <div key={`${maker.name}-${index}`} className="maker-card">
              <div className="maker-card-header">
                <h3 className="maker-name">
                  {typeof maker.name === 'string' ? maker.name : 'Unknown'}
                  {maker.alias && typeof maker.alias === 'string' && (
                    <span className="maker-alias"> ({maker.alias})</span>
                  )}
                </h3>
                <StatusBadge status={maker.status} />
              </div>

              <div className="maker-card-content">
                {/* Combined Links section */}
                {(maker.website || (maker.socials && Object.keys(maker.socials).length > 0)) && (
                  <div className="maker-field">
                    <span className="field-label">Links:</span>
                    <div className="links-container">
                      {maker.website && typeof maker.website === 'string' && (
                        <LinkIcon platform="website" url={maker.website} isWebsite={true} />
                      )}
                      {maker.socials && typeof maker.socials === 'object' && Object.entries(maker.socials).map(([platform, url]) => (
                        <LinkIcon key={platform} platform={platform} url={String(url)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* COMMENTED OUT: Original price range display logic - preserved for potential future use */}
                {/*
                {typeof maker.priceRange === 'string' && (
                  <div className="maker-field">
                    <span className="field-label">Approximate Starting Price:</span>
                    <span className="price-range">{maker.priceRange}</span>
                    {maker.priceDetails && typeof maker.priceDetails === 'object' && (
                      <div className="price-details">
                        {Object.entries(maker.priceDetails).map(([key, value]) => (
                          <div key={key} className="price-detail">
                            <span className="price-type">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                */}

                {typeof maker.priceTier === 'string' && (
                  <div className="maker-field inline">
                    <span className="field-label">Price Tier:</span>
                    <span className="price-tier">{maker.priceTier}</span>
                  </div>
                )}

                {typeof maker.region === 'string' && (
                  <div className="maker-field inline">
                    <span className="field-label">Ships from:</span>
                    <span className="region">{maker.region}</span>
                  </div>
                )}

                {typeof maker.size === 'string' && (
                  <div className="maker-field inline">
                    <span className="field-label">Size:</span>
                    <span className="size">{maker.size}</span>
                  </div>
                )}

                {typeof maker.materialType === 'string' && (
                  <div className="maker-field inline">
                    <span className="field-label">Material:</span>
                    <span className="material-type">{maker.materialType}</span>
                  </div>
                )}

                {maker.englishOrdering !== false && maker.englishOrdering !== null && maker.englishOrdering !== undefined && (
                  <div className="maker-field inline">
                    <span className="field-label">English Ordering:</span>
                    <span className="english-ordering">
                      {typeof maker.englishOrdering === 'string' ? maker.englishOrdering : 'Available'}
                    </span>
                  </div>
                )}

                {maker.features && typeof maker.features === 'object' && Object.entries(maker.features).filter(([key, value]) => value === true).length > 0 && (
                  <div className="maker-field">
                    <span className="field-label">Features:</span>
                    <div className="features-list">
                      {Object.entries(maker.features)
                        .filter(([key, value]) => value === true)
                        .map(([key, value]) => (
                          <span key={key} className="feature-badge">
                            {key}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                )}

                {typeof maker.notes === 'string' && (
                  <div className="maker-field">
                    <span className="field-label">Notes:</span>
                    <p className="notes">{maker.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="makers-cards-info">
        <p>Showing {filteredAndSortedMakers.length} of {data.length} makers</p>
      </div>
    </div>
  );
});

// Helper function to extract numeric price from price strings
const extractNumericPrice = (priceStr: string): number | null => {
  if (!priceStr || typeof priceStr !== 'string') return null;
  
  // Look for patterns like "$784 USD", "$200-300", "¥3200-3500", etc.
  const match = priceStr.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (match) {
    const numericStr = match[1].replace(/,/g, '');
    const num = parseFloat(numericStr);
    return isNaN(num) ? null : num;
  }
  
  return null;
};

export default MakersCards;
