/**
 * 
 * Fetcher is used for all data fetching. It assumes the user is doing a get request if no body is passed.
 * You can override that feature by passing the method in the third optional argument.
 * 
 * @param url 
 * @param data 
 * @param options - override the method set by default
 * @returns 
 */
export default async function fetcher<T>(url:string | null, data: T | undefined = undefined, method: "POST" | "PUT" | "GET" | "PATCH" | "DELETE" = "GET"){
    if(!url){
        return {error: "Missing params in the fetch call"}
    }
    return await fetch(`${window.location.origin}/api/${url}`, {
        method: method,
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data) 
    }).then( res => res.json())
}