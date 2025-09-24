import React, { useState, useMemo, useCallback, memo } from 'react';
import type { Hadatai } from '../plugins/docusaurus-plugin-maker-data';
import { useDebounce } from '../hooks/useDebounce';

interface HadataiCardsProps {
  className?: string;
  data: Hadatai[];
}

interface SortConfig {
  key: keyof Hadatai;
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

const HadataiCards: React.FC<HadataiCardsProps> = memo(({ className = '', data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedHadatai = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = data.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.region?.toLowerCase().includes(term) ||
        item.notes?.toLowerCase().includes(term) ||
        item.priceExamples?.some(example =>
          example.type.toLowerCase().includes(term) ||
          example.price.toString().toLowerCase().includes(term)
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
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });
  }, [data, debouncedSearchTerm, sortConfig]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, direction] = e.target.value.split('-');
    setSortConfig({ key: key as keyof Hadatai, direction: direction as 'asc' | 'desc' });
  }, []);

  return (
    <div className={`hadatai-cards-container ${className}`}>
      <div className="hadatai-cards-header">
        <div className="hadatai-cards-search">
          <input
            type="text"
            placeholder="Search hadatai makers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="hadatai-cards-sort">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="region-asc">Region (A-Z)</option>
            <option value="region-desc">Region (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="hadatai-cards-grid">
        {filteredAndSortedHadatai.length === 0 ? (
          <div className="no-results">
            {searchTerm ? 'No hadatai makers found matching your search.' : 'No hadatai data available.'}
          </div>
        ) : (
          filteredAndSortedHadatai.map((item, index) => (
            <div key={`${item.name}-${index}`} className="hadatai-card">
              <div className="hadatai-card-header">
                <h3 className="hadatai-name">
                  {item.name}
                </h3>
                {typeof item.region === 'string' && (
                  <span className="region-badge">Ships from: {item.region}</span>
                )}
              </div>

              <div className="hadatai-card-content">
                {item.socials && typeof item.socials === 'object' && Object.keys(item.socials).length > 0 && (
                  <div className="hadatai-field">
                    <span className="field-label">Links:</span>
                    <div className="links-container">
                      {Object.entries(item.socials).map(([platform, url]) => (
                        <LinkIcon key={platform} platform={platform} url={String(url)} />
                      ))}
                    </div>
                  </div>
                )}

                {item.priceExamples && item.priceExamples.length > 0 && (
                  <div className="hadatai-field">
                    <span className="field-label">Price Examples:</span>
                    <div className="price-examples">
                      {item.priceExamples.map((example, idx) => (
                        <div key={idx} className="price-example">
                          <div className="price-example-type">{example.type}</div>
                          <div className="price-example-price">
                            {example.link ? (
                              <a 
                                href={example.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="price-link"
                              >
                                {example.price}
                              </a>
                            ) : (
                              example.price
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {typeof item.notes === 'string' && (
                  <div className="hadatai-field">
                    <span className="field-label">Notes:</span>
                    <p className="notes">{item.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hadatai-cards-info">
        <p>Showing {filteredAndSortedHadatai.length} of {data.length} hadatai makers</p>
      </div>
    </div>
  );
});

export default HadataiCards;
