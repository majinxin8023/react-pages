import React, { Suspense } from 'react';
import { RouteObject, useRoutes } from "react-router-dom";
import { SyncRoute, Routes} from './route';
import { Loading } from '@components/index'


const syncRouter = (routes: SyncRoute.Routes[]): RouteObject[] => {
  let routeArray: RouteObject[] = []
  routes.forEach(route => {
    routeArray.push({
      path: route.path,
      element: (
        <Suspense fallback={ <Loading /> }>
          <route.element />
        </Suspense>
      ),
      children: route.children && syncRouter(route.children)
    })
  })
  return routeArray
}

export default () => useRoutes(syncRouter(Routes))
