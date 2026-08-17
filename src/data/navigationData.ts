import React from 'react';
import { HomeIcon } from '../components/icons/HomeIcon';
import { BookmarksIcon } from '../components/icons/BookmarksIcon';
import { CRMIcon } from '../components/icons/CRMIcon';
import { ContentIcon } from '../components/icons/ContentIcon';
import { CommerceIcon } from '../components/icons/CommerceIcon';
import { AutomationIcon } from '../components/icons/AutomationIcon';
import { BreezeIcon } from '../components/icons/BreezeIcon';
import { MarketingIcon } from '../components/icons/MarketingIcon';
import { SalesIcon } from '../components/icons/SalesIcon';
import { ServiceIcon } from '../components/icons/ServiceIcon';
import { DataManagementIcon } from '../components/icons/DataManagementIcon';
import { ReportsIcon } from '../components/icons/ReportsIcon';

export interface NavigationSubItem {
  id: string;
  label: string;
  href?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationSubItem[];
}

export interface NavigationItem {
  id: string;
  icon: string | React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  sections?: NavigationSection[];
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    icon: HomeIcon,
    label: 'Home'
  },
  {
    id: 'bookmarks',
    icon: BookmarksIcon,
    label: 'Bookmarks',
    sections: []
  },
  {
    id: 'crm',
    icon: CRMIcon,
    label: 'CRM',
    sections: [
      {
        title: '',
        items: [
          { id: 'contacts', label: 'Contacts', href: '/contacts' },
          { id: 'companies', label: 'Companies' },
          { id: 'deals', label: 'Deals' },
          { id: 'tickets', label: 'Tickets' },
          { id: 'orders', label: 'Orders' }
        ]
      },
      {
        title: '',
        items: [
          { id: 'segments', label: 'Segments (Lists)' },
          { id: 'inbox', label: 'Inbox' },
          { id: 'chat', label: 'Chat', href: '/crm/chat' },
          { id: 'calls', label: 'Calls' },
          { id: 'meetings', label: 'Meetings' },
          { id: 'tasks', label: 'Tasks' },
          { id: 'playbooks', label: 'Playbooks' },
          { id: 'message-templates', label: 'Message Templates' },
          { id: 'snippets', label: 'Snippets' }
        ]
      }
    ]
  },
  {
    id: 'marketing',
    icon: MarketingIcon,
    label: 'Marketing',
    sections: [
      {
        title: '',
        items: [
          { id: 'email', label: 'Email Marketing' },
          { id: 'ads', label: 'Ads' },
          { id: 'social', label: 'Social Media' }
        ]
      },
      {
        title: '',
        items: [
          { id: 'landing-pages', label: 'Landing Pages' },
          { id: 'blog', label: 'Blog' }
        ]
      }
    ]
  },
  {
    id: 'content',
    icon: ContentIcon,
    label: 'Content',
    sections: [
      {
        title: '',
        items: [
          { id: 'pages', label: 'Website Pages' },
          { id: 'blog-posts', label: 'Blog Posts' },
          { id: 'files', label: 'File Manager' }
        ]
      }
    ]
  },
  {
    id: 'sales',
    icon: SalesIcon,
    label: 'Sales',
    sections: [
      {
        title: '',
        items: [
          { id: 'deals', label: 'Deals' },
          { id: 'quotes', label: 'Quotes' },
          { id: 'products', label: 'Products' }
        ]
      },
      {
        title: '',
        items: [
          { id: 'sequences', label: 'Sequences' },
          { id: 'snippets', label: 'Snippets' }
        ]
      }
    ]
  },
  {
    id: 'commerce',
    icon: CommerceIcon,
    label: 'Commerce',
    sections: [
      {
        title: '',
        items: [
          { id: 'products', label: 'Products' },
          { id: 'orders', label: 'Orders' },
          { id: 'customers', label: 'Customers' }
        ]
      }
    ]
  },
  {
    id: 'service',
    icon: ServiceIcon,
    label: 'Service',
    sections: [
      {
        title: '',
        items: [
          { id: 'help-desk', label: 'Help Desk', href: '/help-desk' },
          { id: 'customer-success', label: 'Customer Success' }
        ]
      },
      {
        title: '',
        items: [
          { id: 'customer-agent', label: 'Customer Agent', href: '/customer-agent' }
        ]
      },
      {
        title: '',
        items: [
          { id: 'chatflows', label: 'Chatflows', href: '/chatflows' },
          { id: 'knowledge-base', label: 'Knowledge Base', href: '/knowledge-base' },
          { id: 'customer-portal', label: 'Customer Portal' }
        ]
      },
      {
        title: '',
        items: [
          { id: 'feedback-surveys', label: 'Feedback Surveys' },
          { id: 'service-analytics', label: 'Service Analytics' }
        ]
      }
    ]
  },
  {
    id: 'data-management',
    icon: DataManagementIcon,
    label: 'Data Management',
    sections: [
      {
        title: '',
        items: [
          { id: 'duplicate-management', label: 'Duplicate Management' },
          { id: 'data-sync', label: 'Data Sync' }
        ]
      }
    ]
  },
  {
    id: 'automation',
    icon: AutomationIcon,
    label: 'Automation',
    sections: [
      {
        title: '',
        items: [
          { id: 'workflows', label: 'Workflows' },
          { id: 'sequences', label: 'Sequences' }
        ]
      }
    ]
  },
  {
    id: 'reporting',
    icon: ReportsIcon,
    label: 'Reporting',
    sections: [
      {
        title: '',
        items: [
          { id: 'reports', label: 'Reports' },
          { id: 'dashboards', label: 'Dashboards' },
          { id: 'datasets', label: 'Datasets' }
        ]
      }
    ]
  },
  {
    id: 'breeze',
    icon: BreezeIcon,
    label: 'Breeze',
    sections: [
      {
        title: '',
        items: [
          { id: 'copilot', label: 'Copilot' },
          { id: 'content-assistant', label: 'Content Assistant' }
        ]
      }
    ]
  }
];