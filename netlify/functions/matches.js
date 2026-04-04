exports.handler = async function(event) {
  const API_KEY = 'ad75db6245cc44138e20988d8bea99f5';
  const { dateFrom, dateTo, competition } = event.queryStringParameters || {};

  // All 12 free competitions explicitly
  const FREE_COMPETITIONS = [
    2021, // Premier League
    2014, // La Liga
    2002, // Bundesliga
    2019, // Serie A
    2001, // Champions League
    2015, // Ligue 1
    2003, // Eredivisie
    2016, // Championship
    2017, // Primeira Liga
    2018, // European Championship
    2000, // World Cup
    2013, // Brasileiro Serie A
  ];

  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  let url;
  if (competition) {
    url = `https://api.football-data.org/v4/competitions/${competition}/matches?${params.toString()}`;
  } else {
    // Fetch all competitions in one call
    params.append('competitions', FREE_COMPETITIONS.join(','));
    url = `https://api.football-data.org/v4/matches?${params.toString()}`;
  }

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
        'Cache-Control': 'no-cache',
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
