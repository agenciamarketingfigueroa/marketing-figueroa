const router={replace:()=>{throw Error('SERVER_NAVIGATION_DISABLED');},refresh:()=>{throw Error('SERVER_NAVIGATION_DISABLED');}};
export const useRouter=()=>router;
