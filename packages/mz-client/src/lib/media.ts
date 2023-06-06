const breakpoints = {
  mobile: 500,
  tablet: 768,
  desktop: 1024,
  widescreen: 1200,
  xwidescreen: 1400,
} as const;

type BreakpointKey = keyof typeof breakpoints;
type Media = Record<BreakpointKey, string>;
const mediaQuery = (width: number) => `@media (min-width: ${width}px)`;

export const media = Object.entries(breakpoints).reduce((acc, cur) => {
  const [key, value] = cur as [BreakpointKey, number];
  acc[key] = mediaQuery(value);
  return acc;
}, {} as Media);
