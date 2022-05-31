export default async function fetcher<T>(url:string, data: T | undefined = undefined ){
    return await fetch(`${window.location.origin}/api/${url}`, {
        method: data ? "POST" : "GET",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data) 
    }).then( res => res.json())
    
}
