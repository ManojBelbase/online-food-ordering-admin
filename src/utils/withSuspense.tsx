import React, { Suspense, type ComponentType } from 'react';
import PageLoader from '../components/GlobalComponents/PageLoader';

// 
// USAGE:
// const LazyComponent = lazy(() => import('./Component'));
// export default withSuspense(LazyComponent);
//
// OR with custom loading:
// export default withSuspense(LazyComponent, {
//   fallback: <CustomLoader />,
//   message: "Loading orders..."
// });

interface WithSuspenseOptions {
  fallback?: React.ReactNode;
  message?: string;
  type?: 'spinner' | 'skeleton' | 'custom';
}

function withSuspense<P extends object>(
  Component: ComponentType<P>,
  options: WithSuspenseOptions = {}
) {
  const {
    fallback,
    message = 'Loading...',
    type = 'spinner'
  } = options;

  const WrappedComponent: React.FC<P> = (props) => {
    const defaultFallback = (
      <PageLoader 
        type={type} 
        message={message} 
      />
    );

    return (
      <Suspense fallback={fallback || defaultFallback}>
        <Component {...props} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = `withSuspense(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default withSuspense;

export const withPageLoader = <P extends object>(
  Component: ComponentType<P>,
  message?: string
) => withSuspense(Component, { 
  type: 'spinner', 
  message: message || 'Loading page...' 
});

export const withSkeleton = <P extends object>(
  Component: ComponentType<P>
) => withSuspense(Component, { 
  type: 'skeleton' 
});

export const withCustomLoader = <P extends object>(
  Component: ComponentType<P>,
  fallback: React.ReactNode
) => withSuspense(Component, { 
  fallback 
});

// 🎯 Example usage:
//
// // Basic usage
// const OrdersPage = lazy(() => import('./OrdersPage'));
// export default withSuspense(OrdersPage);
//
// // With custom message
// export default withPageLoader(OrdersPage, 'Loading orders...');
//
// // With skeleton
// export default withSkeleton(OrdersPage);
//
// // With custom fallback
// export default withCustomLoader(OrdersPage, <MyCustomLoader />);
