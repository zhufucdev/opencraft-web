export const apiUrl = process.env.API_URL;
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

async function fetchBody(url: string, body: any | undefined): Promise<Response> {
    if (body) {
        return await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });
    }
    else {
        return await fetch(url, {headers});
    }
}

export async function apiFetch(name: string, body: any | undefined = undefined): Promise<Response> {
    const url = `${apiUrl}/${name}`;
    return await fetchBody(url, body);
}

export async function localApiFetch(name: String, body: any | undefined = undefined): Promise<Response> {
    const url = `/api/${name}`;
    return await fetchBody(url, body);
}