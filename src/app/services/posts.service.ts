import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/postl.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    // Subscribe within service as we don't nee Component controller to handle response
    const postData: Post = { title: title, content: content };
    this.http.post<{ name: string }>('https://ng-max-guide-428f9-default-rtdb.europe-west1.firebasedatabase.app/posts.json', postData)
    .pipe(
      tap(responseData => {
        console.log(responseData);
      }),
      catchError(error => {
        this.error.next(error.message);
        return throwError(() => error);
      })
    )
    .subscribe();
  }

  fetchPosts() {
    // Return observable so Component contrller handles response 
    return this.http.get<{ [key: string]: Post }>('https://ng-max-guide-428f9-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key })
          }
        }
        return postsArray;
      }),
      catchError(errorResp => {
        // Send to analytics server
        //console.log(errorResp);
        return throwError(() =>errorResp);
      })
    );
  }

  deletePosts() {
    // Subscribe within Component controller so it can clear loadedPosts array; return observable 
    return this.http.delete('https://ng-max-guide-428f9-default-rtdb.europe-west1.firebasedatabase.app/posts.json');
  }

}
