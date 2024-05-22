import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/postl.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
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
      })
    );
  }

  deletePosts() {
    // Subscribe within Component controller so it can clear loadedPosts array; return observable 
    return this.http.delete('https://ng-max-guide-428f9-default-rtdb.europe-west1.firebasedatabase.app/posts.json');
  }

}
