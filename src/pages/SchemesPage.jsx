import { useState } from 'react'
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Landmark, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Building2,
  Sparkles
} from 'lucide-react'
import { SCHEMES, CONFLICT_RULES, I18N } from '../data/scholarshipData'
import { getLocalizedSchemes } from '../data/localizationEngine'
import './SchemesPage.css'

export default function SchemesPage({ 
  activeStudent, 
  lang, 
  onTriggerConflict, 
  onDirectApply 
}) {
  const [filterPortal, setFilterPortal] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSchemeId, setExpandedSchemeId] = useState(null)
  const t = I18N[lang] || I18N.en
  const localizedSchemes = getLocalizedSchemes(SCHEMES, lang)

  const filteredSchemes = localizedSchemes.filter(scheme => {
    const matchesPortal = filterPortal === 'ALL' || scheme.portal.includes(filterPortal)
    const matchesQuery = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.targetGroup.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPortal && matchesQuery
  })

  const handleApplyClick = (scheme) => {
    const conflictResult = CONFLICT_RULES.evaluateApplicationConflict(activeStudent, scheme.id)
    if (conflictResult.hasConflict) {
      onTriggerConflict(scheme.id)
    } else {
      onDirectApply(scheme)
    }
  }

  return (
    <div className="schemes-view fade-in">
      {/* Header & Search */}
      <section className="schemes-header-section">
        <div className="schemes-title-group">
          <h1 className="schemes-heading">{t.schemesHeading || 'Ministry of Tribal Affairs — 5 Flagship Schemes'}</h1>
          <p className="schemes-sub">
            {t.schemesSub || 'Unified directory unifying schemes across National Scholarship Portal (NSP), SFMP (Canara Bank), and standalone NOS overseas portal.'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="schemes-toolbar">
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder || 'Search by scheme name, course, institution type...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="scheme-search-field"
            />
          </div>

          <div className="portal-filter-tabs">
            <button 
              className={`filter-btn ${filterPortal === 'ALL' ? 'active-filter' : ''}`}
              onClick={() => setFilterPortal('ALL')}
            >
              {t.allSchemes || 'All 5 Schemes'}
            </button>
            <button 
              className={`filter-btn ${filterPortal === 'NSP' ? 'active-filter' : ''}`}
              onClick={() => setFilterPortal('NSP')}
            >
              <Landmark size={14} />
              <span>{t.nspFilter || 'NSP (School & College)'}</span>
            </button>
            <button 
              className={`filter-btn ${filterPortal === 'SFMP' ? 'active-filter' : ''}`}
              onClick={() => setFilterPortal('SFMP')}
            >
              <Building2 size={14} />
              <span>{t.sfmpFilter || 'SFMP (Canara Bank / NFST)'}</span>
            </button>
            <button 
              className={`filter-btn ${filterPortal === 'NOS' ? 'active-filter' : ''}`}
              onClick={() => setFilterPortal('NOS')}
            >
              <Globe size={14} />
              <span>{t.nosFilter || 'NOS (Overseas Study)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Schemes Grid */}
      <div className="schemes-list">
        {filteredSchemes.map(scheme => {
          const isExpanded = expandedSchemeId === scheme.id
          const hasActiveApp = activeStudent.applications.some(a => a.schemeId === scheme.id)

          return (
            <div key={scheme.id} className="gov-card scheme-card">
              <div className="scheme-card-top">
                <div className="scheme-info-col">
                  <div className="scheme-badges-row">
                    <span className="badge badge-primary">{scheme.portal}</span>
                    <span className="badge badge-neutral">{scheme.code}</span>
                    <span className="badge badge-neutral">{scheme.category}</span>
                    {hasActiveApp && (
                      <span className="badge badge-success">
                        <CheckCircle2 size={13} /> {t.activeInProfile || 'Active in Profile'}
                      </span>
                    )}
                  </div>
                  <h2 className="scheme-name">{scheme.name}</h2>
                  <p className="scheme-desc">{scheme.description}</p>
                </div>

                <div className="scheme-amount-col">
                  <div className="amount-label">{t.annualGrant || 'Annual Grant / Financial Assistance'}</div>
                  <div className="amount-value">{scheme.amountRange}</div>
                  <div className="deadline-tag">
                    <Calendar size={13} />
                    <span>{t.applyBefore || 'Apply before:'} <strong>{scheme.deadline}</strong></span>
                  </div>
                </div>
              </div>

              {/* Quick Eligibility & Highlights */}
              <div className="scheme-criteria-box">
                <div className="criteria-header">{t.eligibilityHighlights || 'Eligibility Highlights'}</div>
                <div className="criteria-grid">
                  {scheme.eligibilityCriteria.slice(0, 2).map((crit, idx) => (
                    <div key={idx} className="criteria-item">
                      <CheckCircle2 size={15} className="criteria-check" />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expandable Details Accordion */}
              {isExpanded && (
                <div className="scheme-expanded-details fade-in">
                  <div className="expanded-section">
                    <h3 className="expanded-subhead">{t.fullEligibilityOfficial || 'Full Eligibility Criteria (MoTA Official)'}</h3>
                    <ul className="expanded-list">
                      {scheme.eligibilityCriteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="expanded-section">
                    <h3 className="expanded-subhead">{t.mandatoryDocs || 'Mandatory Verification Documents (DigiLocker Synced)'}</h3>
                    <div className="docs-tag-grid">
                      {scheme.mandatoryDocuments.map(doc => (
                        <div key={doc.id} className="doc-pill">
                          <FileText size={14} />
                          <span>{doc.name}</span>
                          <span className="doc-source-label">{doc.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="expanded-section">
                    <h3 className="expanded-subhead">{t.disbursementFramework || 'Disbursement & Funding Framework'}</h3>
                    <div className="funding-meta-row">
                      <div>{t.fundingPattern || 'Funding Pattern:'} <strong>{scheme.fundingRatio}</strong></div>
                      <div>{t.disbursementFreq || 'Disbursement Frequency:'} <strong>{scheme.disbursementFreq}</strong></div>
                      <div>{t.hostellerAllowance || 'Hosteller Allowance:'} <strong>{scheme.hostellerAllowance}</strong></div>
                      <div>{t.grantsBooks || 'Grants & Books:'} <strong>{scheme.bookGrant}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="scheme-card-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                >
                  <span>{isExpanded ? (t.hideGuidelines || 'Hide Guidelines') : (t.viewFullGuidelines || 'View Full Guidelines & Documents')}</span>
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={() => handleApplyClick(scheme)}
                >
                  <span>{hasActiveApp ? (t.viewActiveApp || 'View Active Application') : (t.checkEligibility || 'Check Eligibility & Apply')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
