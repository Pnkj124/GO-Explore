import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsercrudService {

  registration_endpoint = 'http://localhost:3000/api/users/registration';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials': 'true' })
  };

  constructor(private httpClient: HttpClient) { }

  createUser(user: User): Observable<any> {
    return this.httpClient.post<User>(this.registration_endpoint, JSON.stringify(user), this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('Error occured'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}



