// Cloudflare Worker — handles both static assets and API requests
const API_KEY = 'ad75db6245cc44138e20988d8bea99f5';
const FREE_COMPETITIONS = [2021,2014,2002,2019,2001,2015,2003,2016,2017,2018,2000,2013];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle API route
    if (url.pathname === '/functions/matches' || url.pathname === '/.netlify/functions/matches') {
      const dateFrom = url.searchParams.get('dateFrom');
      const dateTo = url.searchParams.get('dateTo');
      const matchId = url.searchParams.get('matchId');
      const type = url.searchParams.get('type');

      let apiUrl;
      if (matchId && type === 'h2h') {
        apiUrl = `https://api.football-data.org/v4/matches/${matchId}/head2head?limit=10`;
      } else {
        const params = new URLSearchParams();
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        params.append('competitions', FREE_COMPETITIONS.join(','));
        apiUrl = `https://api.football-data.org/v4/matches?${params.toString()}`;
      }

      try {
        const res = await fetch(apiUrl, {
          headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  }
};
