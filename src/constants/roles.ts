export const roles = [
  {
    key: 'admin',
    title: 'Administrator',
    icon: 'Shield',
    description: 'Full control over the platform',
    color: 'primary',
    features: [
      'Manage all users & roles',
      'Create & delete events',
      'View complete analytics',
      'System configuration',
    ],
  },
  {
    key: 'organizer',
    title: 'Event Organizer',
    icon: 'Clipboard List',
    description: 'Manage & run sports event',
    color: 'primary',
    features: [
      'Create & manage events',
      'Approve team registrations',
      'Generate match schedules',
      'Update scores & results',
    ],
  },
  {
    key: 'participant',
    title: 'Participant',
    icon: 'Users',
    description: 'Join events & compete',
    color: 'participant',
    features: [
      'Browse & join events',
      'Create or join teams',
      'View schedule & results',
      'Track your performance',
    ],
  },
];
