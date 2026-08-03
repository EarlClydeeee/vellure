/** Product mockup images served from /public/iphone/iphone17 */
export const IPHONE_MOCKUP_IMAGES = {
  iphone17: '/iphone/iphone17/iphone_17__fb1277oq3eaa_large.jpg',
  iphone17Pro: '/iphone/iphone17/iphone_17pro__t1j902iw6kya_large.jpg',
  iphone17e: '/iphone/iphone17/iphone_17e__cq5ygzct314y_large.jpg',
  iphoneAir: '/iphone/iphone17/iphone_air__b5qmgl05ojyq_large.jpg',
} as const;

export type IphoneMockupKey = keyof typeof IPHONE_MOCKUP_IMAGES;
