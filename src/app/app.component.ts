import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

export interface Post {
  title: string;
  content: string;
  id?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    //console.log(postData);
    this.http.post<{ name: string }>('https://ng-max-guide-428f9-default-rtdb.europe-west1.firebasedatabase.app/posts.json', postData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.http.get<{ [key: string]: Post }>('https://ng-max-guide-428f9-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key })
          }
        }
        return postsArray;
      }))
      .subscribe(posts => {
        //console.log(posts);
        this.loadedPosts = posts;
      });
  }
}