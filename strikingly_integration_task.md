# Strikingly API Integration Task

## Project Overview
Add Strikingly website builder integration to existing business listing app, allowing users to generate AI-powered websites from their business profile data.

## Task Requirements

### 1. UI Component Addition
- **Location**: Business Profile Dashboard (main user dashboard area)
- **Component**: Add "Create Website" button
- **Styling**: Match existing dashboard button design
- **Icon**: Use website/globe icon (lucide-react or similar)
- **Text**: "Create Your Website" or "Build Website"

### 2. New Page Creation
- **Route**: `/dashboard/website-builder` (NOT in main site navigation)
- **Access**: Only accessible from dashboard button click
- **Layout**: Full-screen modal OR dedicated page layout
- **Breadcrumb**: Dashboard > Create Website

### 3. Strikingly API Integration

#### Required API Endpoints Setup:
```javascript
// Base configuration
const STRIKINGLY_CONFIG = {
  apiUrl: 'https://api.strikingly.com/v1/',
  apiKey: process.env.STRIKINGLY_API_KEY,
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
}
```

#### Core API Functions to Implement:
1. **Get Templates** - Fetch available templates
2. **Create Site** - Generate new site with business data
3. **Update Site** - Modify existing site
4. **Get Site Status** - Check creation progress
5. **Delete Site** - Remove test sites

### 4. Business Data Auto-Population

#### Data Mapping Requirements:
```javascript
// Map business profile data to Strikingly fields
const businessDataMapping = {
  siteName: businessProfile.name,
  siteDescription: businessProfile.description,
  contactInfo: {
    phone: businessProfile.phone,
    email: businessProfile.email,
    address: businessProfile.address
  },
  businessHours: businessProfile.hours,
  images: businessProfile.photos,
  socialMedia: businessProfile.socialLinks
}
```

### 5. Testing Interface Components

#### Required UI Elements:
- **Template Preview Grid** - Show 6-8 template options
- **Business Data Preview** - Display data that will be populated
- **Generate Button** - Trigger site creation
- **Progress Indicator** - Show AI generation progress
- **Preview Frame** - Display generated website
- **Test Controls**:
  - Regenerate button
  - Edit data button
  - Delete test site button
  - Download/Export options

### 6. Error Handling & Loading States

#### Required States:
- Loading spinner during API calls
- Error messages for API failures
- Success confirmation with preview
- Rate limit handling
- Network timeout handling

#### Error Scenarios to Handle:
- API key invalid
- Rate limit exceeded
- Site generation failed
- Template not available
- Business data incomplete

### 7. Technical Implementation Details

#### File Structure:
```
/pages/dashboard/website-builder.js
/components/WebsiteBuilder/
  ├── TemplateSelector.js
  ├── BusinessDataPreview.js
  ├── SitePreview.js
  ├── GenerationProgress.js
  └── TestControls.js
/services/strikingly-api.js
/utils/businessDataMapper.js
```

#### State Management:
```javascript
const [templates, setTemplates] = useState([])
const [selectedTemplate, setSelectedTemplate] = useState(null)
const [isGenerating, setIsGenerating] = useState(false)
const [generatedSite, setGeneratedSite] = useState(null)
const [error, setError] = useState(null)
```

### 8. Testing Requirements

#### Test Scenarios:
1. **Template Loading** - Verify templates load from API
2. **Data Population** - Confirm business data maps correctly
3. **Site Generation** - Test AI website creation flow
4. **Preview Display** - Ensure generated site displays properly
5. **Error Handling** - Test various error scenarios
6. **Performance** - Verify reasonable load times

#### Test Data:
- Use existing business profile data from logged-in user
- Fallback dummy data for incomplete profiles
- Test with different business types (restaurant, service, retail)

### 9. Environment Setup

#### Required Environment Variables:
```env
STRIKINGLY_API_KEY=your_api_key_here
STRIKINGLY_API_URL=https://api.strikingly.com/v1/
STRIKINGLY_WEBHOOK_SECRET=webhook_secret_here
```

#### Dependencies to Add:
```json
{
  "axios": "^1.6.0", // For API calls
  "react-iframe": "^1.8.0", // For site preview
  "react-loading-skeleton": "^3.3.0" // Loading states
}
```

### 10. Deliverables

#### Phase 1 (MVP):
- [ ] Dashboard button added and functional
- [ ] Website builder page created
- [ ] Basic Strikingly API integration
- [ ] Template selection interface
- [ ] Business data auto-population
- [ ] Site generation with progress indicator

#### Phase 2 (Enhanced):
- [ ] Site preview in iframe
- [ ] Edit/regenerate functionality
- [ ] Error handling and user feedback
- [ ] Loading states and animations
- [ ] Test site management (delete, regenerate)

### 11. Acceptance Criteria

- ✅ Button appears on business dashboard
- ✅ Clicking button opens website builder page
- ✅ Templates load from Strikingly API
- ✅ Business profile data auto-populates correctly
- ✅ AI site generation works end-to-end
- ✅ Generated website displays in preview
- ✅ Error states handled gracefully
- ✅ Loading indicators show during API calls
- ✅ Test sites can be deleted/regenerated

### 12. Notes for Developer

#### API Documentation:
- Research Strikingly API documentation
- Test API endpoints in Postman first
- Implement rate limiting and caching
- Use async/await for all API calls

#### UI/UX Considerations:
- Keep interface simple and intuitive
- Show clear progress during generation
- Provide helpful error messages
- Make preview responsive

#### Security:
- Never expose API keys to frontend
- Validate all user inputs
- Implement proper error boundaries
- Add request timeouts

## Priority: High
## Estimated Time: 3-5 days
## Complexity: Medium-High