export const environment = {
  production: true,
  apiKeys: {
    movie: import.meta.env['NG_APP_MOVIE_API_KEY'],
    book: import.meta.env['NG_APP_BOOK_API_KEY']
  }
};