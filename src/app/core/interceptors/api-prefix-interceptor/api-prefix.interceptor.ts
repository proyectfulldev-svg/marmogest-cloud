import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'http://localhost:8000';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const apiReq = req.clone({ url: `${API_BASE_URL}${req.url}` });
    return next(apiReq);
  }
  return next(req);
};
