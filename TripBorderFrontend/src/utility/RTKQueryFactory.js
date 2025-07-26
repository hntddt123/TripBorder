//  Arguments exmaple
//  url: '/tableNamebyemail',
//  method: 'POST',
//  body: { email, page, limit },
//  headers: { 'Content-Type': 'application/json' }
export const createByEmailPaginationQuery = (builder, { url, tagName = 'default' }) => builder.query({
  query: ({ email, page = 1, limit = 10 }) => ({
    url,
    method: 'POST',
    body: { email, page, limit },
    headers: { 'Content-Type': 'application/json' }
  }),
  providesTags: [tagName]
});

export const createByTripQuery = (builder, { url, tagName = 'default' }) => builder.query({
  query: ({ tripID }) => ({
    url,
    method: 'POST',
    body: { tripID },
    headers: { 'Content-Type': 'application/json' }
  }),
  providesTags: [tagName]
});
