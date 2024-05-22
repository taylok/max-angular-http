import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Post } from './models/postl.model';
import { PostsService } from './services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription = new Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) { }

  ngOnInit() {
    this.error = null;
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage as any;
    });

    this.isFetching = true;
    this.postsService.fetchPosts()
      .subscribe({
        next: (posts) => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        error: (error) => {
          this.isFetching = false;  // It's good practice to ensure isFetching is set to false even in case of an error
          this.error = error.message;
        }
      });
  }

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.postsService.fetchPosts()
      .subscribe({
        next: (posts) => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        error: (error) => {
          this.isFetching = false;
          this.error = error.message;
        }
      });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

}