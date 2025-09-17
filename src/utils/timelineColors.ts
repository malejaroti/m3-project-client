// Soft and varied colors with 50% transparency for timeline backgrounds
// These colors are gentle and pleasant for UI backgrounds

export const timelineColors = [
    'rgba(230, 230, 250, 0.5)', // Lavender - soft lavender
    'rgba(204, 229, 255, 0.5)',  // Light Steel Blue - soft blue-gray
    'rgba(221, 212, 231, 0.5)', // Plum - soft purple
    'rgba(255, 228, 181, 0.3)', // Moccasin - soft beige
    'rgba(175, 238, 238, 0.5)', // Pale Turquoise - soft cyan
    'rgba(255, 239, 213, 0.5)', // Papaya Whip - soft cream
  'rgba(173, 216, 230, 0.5)', // Light Blue - soft sky blue
  'rgba(255, 218, 185, 0.5)', // Peach Puff - warm peach
  'rgba(152, 251, 152, 0.3)', // Pale Green - soft mint green
  'rgba(255, 192, 203, 0.5)', // Pink - gentle pink
];

// Function to get a color by index (cycles through if more than 10 timelines)
export const getTimelineColor = (index: number, p0: { groupId: number; }): string => {
  return timelineColors[index % timelineColors.length];
};

// Function to get all colors
export const getAllTimelineColors = (): string[] => {
  return [...timelineColors];
};

// Default fallback color
export const defaultTimelineColor = 'rgba(240, 240, 240, 0.5)'; // Light gray