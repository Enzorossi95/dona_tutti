# Hooks Organization

## Structure

The hooks are organized in two main directories based on functionality:

### `/hooks/api/` - Authenticated API Hooks
These hooks require authentication and are used for admin-specific operations:
- `useCampaign` - Fetches single campaign with auth token  
- `useCampaignDonations` - Fetches donations for a campaign
- `useSummary` - Fetches admin dashboard summary
- Used in: Admin sections that need privileged data

### `/hooks/campaigns/` - Campaign Hooks (Public & Admin)
These hooks are used for campaign-related operations:
- `useCampaigns` - Fetches campaigns list (public endpoint, used in both public and admin pages)
- `useCampaign` - Fetches single campaign details (public endpoint)
- `useCampaignActivities` - Fetches campaign activities/updates (public)
- `useCampaignReceipts` - Fetches campaign receipts (currently using mock data)
- `useCampaignUpdates` - Admin hook for creating/updating campaign activities (requires auth)
- Used in: Both `/app/campanas/*` and `/app/admin/*` pages

## Usage Examples

### For Campaigns List (Both Public and Admin)
```typescript
import { useCampaigns } from '@/hooks/campaigns/useCampaigns'

// In public pages - gets only active campaigns
const { campaigns } = useCampaigns()

// In admin pages - gets all campaigns
const { allCampaigns } = useCampaigns()
```

### For Single Campaign
```typescript
import { useCampaign } from '@/hooks/campaigns/useCampaign'
```

## Notes
- The old hooks in `/lib/hooks/` have been removed to avoid confusion
- Public hooks fetch directly from API without auth headers
- Admin hooks use `useAuthSWR` which automatically includes auth tokens