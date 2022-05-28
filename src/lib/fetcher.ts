export default async function fetcher<T>(url:string, data: T | undefined = undefined ){
    const res = await fetch(`${window.location.origin}/api/${url}`, {
        method: data ? "POST" : "GET",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data) 
    })
    if(!res.ok){
        const error = new Error('An error occurred while fetching the data.');    
        throw error
    }
    return res.json()
}