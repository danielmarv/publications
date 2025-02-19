export const navItems = [
  {
    name: 'Dashboard',
    icon: '/assets/icons/dashboard.svg',
    url: '/dashboard',
  },
  {
    name: 'Documents',
    icon: '/assets/icons/documents.svg',
    url: '/documents',
  },
  {
    name: 'Drafts',
    icon: '/assets/icons/others.svg',
    url: '/drafts',
  },
  {
    name: 'Publications',
    icon: '/assets/icons/images.svg',
    url: '/pubs',
  },
  {
    name: 'Comments',
    icon: '/assets/icons/video.svg',
    url: '/media',
  },
  {
    name: 'Write',
    icon: '/assets/icons/others.svg',
    url: '/others',
  },
  {
    name: 'Departments',
    icon: '/assets/icons/others.svg',
    url: '/department',
  },
  {
    name: 'Users',
    icon: '/assets/icons/others.svg',
    url: '/others',
  },
];

export const actionsDropdownItems = [
  {
    label: 'Rename',
    icon: '/assets/icons/edit.svg',
    value: 'rename',
  },
  {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details',
  },
  {
    label: 'Share',
    icon: '/assets/icons/share.svg',
    value: 'share',
  },
  {
    label: 'Download',
    icon: '/assets/icons/download.svg',
    value: 'download',
  },
  {
    label: 'Delete',
    icon: '/assets/icons/delete.svg',
    value: 'delete',
  },
  {
    label: 'Draft for Publishing',
    icon: '/assets/icons/file-svg.svg',
    value: 'draft',
  },
];

export const reviewItems = [
  {
    label: 'Submit Review',
    icon: '/assets/icons/info.svg',
    value: 'review',
  },
];

export const approveItems = [
  {
    label: 'Approve',
    icon: '/assets/icons/info.svg',
    value: 'approve',
  },
];

export const adminItems = [
  {
    label: 'Submit Review',
    icon: '/assets/icons/info.svg',
    value: 'review',
  },
  {
    label: 'Approve',
    icon: '/assets/icons/info.svg',
    value: 'approve',
  },
];

export const sortTypes = [
  {
    label: 'Date created (newest)',
    value: '$createdAt-desc',
  },
  {
    label: 'Created Date (oldest)',
    value: '$createdAt-asc',
  },
  {
    label: 'Name (A-Z)',
    value: 'name-asc',
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc',
  },
  {
    label: 'Size (Highest)',
    value: 'size-desc',
  },
  {
    label: 'Size (Lowest)',
    value: 'size-asc',
  },
];

export const avatarPlaceholderUrl =
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
