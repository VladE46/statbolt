exports.handler = async function(event) {
  const API_KEY = 'ad75db6245cc44138e20988d8bea99f5';
  const { dateFrom, dateTo, matchId, type } = event.queryStringParameters || {};

  const FREE_COMPETITIONS = [2021,2014,2002,2019,2001,2015,2003,2016,2017,2018,2000,2013];

  let url;
  if (matchId && type === 'h2h') {
    url = `https://api.football-data.org/v4/matches/${matchId}/head2head?limit=10`;
  } else {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    params.append('competitions', FREE_COMPETITIONS.join(','));
    url = `https://api.football-data.org/v4/matches?${params.toString()}`;
  }

  try {
    const res = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
