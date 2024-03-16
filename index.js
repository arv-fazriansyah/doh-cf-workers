// index.js
const doh = "https://security.cloudflare-dns.com/dns-query";
const dohjson = "https://security.cloudflare-dns.com/dns-query";
const contype = "application/dns-message";
const jstontype = "application/dns-json";
const r404 = new Response(null, { status: 404 });

const doh_cf_workers_default = {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};

async function handleRequest(request) {
  let response = r404;
  const { method, headers, url } = request;
  const searchParams = new URL(url).searchParams;
  
  if (method === "GET" && searchParams.has("dns")) {
    response = await fetch(doh + "?dns=" + searchParams.get("dns"), {
      method: "GET",
      headers: {
        "Accept": contype
      }
    });
  } else if (method === "POST" && headers.get("content-type") === contype) {
    const requestBody = await request.text();
    response = await fetch(doh, {
      method: "POST",
      headers: {
        "Accept": contype,
        "Content-Type": contype
      },
      body: requestBody
    });
  } else if (method === "GET" && headers.get("Accept") === jstontype) {
    const search = new URL(url).search;
    response = await fetch(dohjson + search, {
      method: "GET",
      headers: {
        "Accept": jstontype
      }
    });
  }
  
  return response;
}

export default doh_cf_workers_default;
