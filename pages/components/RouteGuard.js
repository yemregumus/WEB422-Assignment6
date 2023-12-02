import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/authenticate';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard(props) {
   const [authorized, setAuthorized] = useState(false);
   const router = useRouter();
   const [, setFavouritesList] = useAtom(favouritesAtom);
   const [, setSearchHistory] = useAtom(searchHistoryAtom);
   
   async function updateAtoms(){
      setFavouritesList(await getFavourites()); 
      setSearchHistory(await getHistory()); 
   }

  useEffect(() => {
   updateAtoms()
    // on initial load - run auth check
    authCheck(router.pathname);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  function authCheck(url) {
   // redirect to login page if accessing a private page and not logged in
   const path = url.split('?')[0];
   
   if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
    setAuthorized(false);
    router.push('/login');
   } else {
     setAuthorized(true);
   }
 }

  return <>{authorized && props.children}</>
}