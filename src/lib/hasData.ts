// The api will send back {error: true, message: "Post not found"} if user navigates to a post detail page which does not exist on a dynamic route
export const hasData = <T>(data: T ): T | undefined => {
  if(!data){
    return undefined
  }
  if(typeof data === "object" && 'error' in data){
    return undefined;
  }
  return data
};