module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'], // Add more locales as needed
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
