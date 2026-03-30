exports.handler = async function(event) {
  const API_KEY = 'ad75db6245cc44138e20988d8bea99f5';
  const { dateFrom, dateTo } = event.queryStringParameters || {};

  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  const url = `https://api.football-data.org/v4/matches?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
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
